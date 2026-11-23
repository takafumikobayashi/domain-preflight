import { Resolver } from "node:dns/promises";

export type DnsFailure = "NODATA" | "NXDOMAIN" | "TIMEOUT" | "SERVFAIL" | "OTHER";

export type DnsAnswer<T> = { ok: true; records: T[] } | { ok: false; failure: DnsFailure; message: string };

export type MxRecord = { priority: number; exchange: string };
export type CaaRecord = { critical: number; tag: string; value: string };

/** Everything the checks need from DNS. Tests supply a fake; the CLI uses NodeDnsClient. */
export interface DnsClient {
  /** Human-readable description of where answers come from, recorded in the report. */
  readonly source: string;
  a(name: string): Promise<DnsAnswer<string>>;
  aaaa(name: string): Promise<DnsAnswer<string>>;
  cname(name: string): Promise<DnsAnswer<string>>;
  mx(name: string): Promise<DnsAnswer<MxRecord>>;
  /** Each record is returned joined from its character-strings, exactly as published (quotes included). */
  txt(name: string): Promise<DnsAnswer<string>>;
  ns(name: string): Promise<DnsAnswer<string>>;
  caa(name: string): Promise<DnsAnswer<CaaRecord>>;
}

const TIMEOUT_MS = 5_000;

const CAA_TAGS = ["issue", "issuewild", "iodef", "contactemail", "contactphone"];

/**
 * Node returns CAA records as `{ critical, issue: "ca.example" }`; newer versions also add
 * `type: "CAA"`. Pick the property tag by name rather than by position.
 */
export function toCaaRecord(raw: Record<string, unknown>): CaaRecord {
  const tag = CAA_TAGS.find((name) => name in raw) ?? Object.keys(raw).find((name) => name !== "critical" && name !== "type") ?? "";
  return { critical: Number(raw.critical ?? 0), tag, value: tag ? String(raw[tag]) : "" };
}

function failureOf(error: unknown): DnsFailure {
  const code = (error as { code?: string }).code;
  if (code === "ENODATA") return "NODATA";
  if (code === "ENOTFOUND") return "NXDOMAIN";
  if (code === "ETIMEOUT") return "TIMEOUT";
  if (code === "ESERVFAIL") return "SERVFAIL";
  return "OTHER";
}

async function answer<T>(query: () => Promise<T[]>): Promise<DnsAnswer<T>> {
  try {
    const records = await query();
    return records.length > 0 ? { ok: true, records } : { ok: false, failure: "NODATA", message: "no records" };
  } catch (error) {
    return { ok: false, failure: failureOf(error), message: (error as Error).message };
  }
}

export class NodeDnsClient implements DnsClient {
  readonly source: string;
  private resolver: Resolver;

  constructor(servers?: string[]) {
    this.resolver = new Resolver({ timeout: TIMEOUT_MS, tries: 2 });
    if (servers && servers.length > 0) this.resolver.setServers(servers);
    this.source = servers && servers.length > 0 ? `再帰リゾルバ ${servers.join(", ")}` : `システムのリゾルバ (${this.resolver.getServers().join(", ")})`;
  }

  a(name: string) {
    return answer(() => this.resolver.resolve4(name));
  }
  aaaa(name: string) {
    return answer(() => this.resolver.resolve6(name));
  }
  cname(name: string) {
    return answer(() => this.resolver.resolveCname(name));
  }
  mx(name: string) {
    return answer(() => this.resolver.resolveMx(name));
  }
  txt(name: string) {
    return answer(async () => (await this.resolver.resolveTxt(name)).map((chunks) => chunks.join("")));
  }
  ns(name: string) {
    return answer(() => this.resolver.resolveNs(name));
  }
  caa(name: string) {
    return answer(async () => (await this.resolver.resolveCaa(name)).map((record) => toCaaRecord(record as unknown as Record<string, unknown>)));
  }
}
