import type { CaaRecord, DnsAnswer, DnsClient, MxRecord } from "../src/net/dns.js";
import type { Certificate, WebClient, WebError, WebResponse } from "../src/net/web.js";

export type Zone = {
  a?: Record<string, string[]>;
  aaaa?: Record<string, string[]>;
  cname?: Record<string, string>;
  mx?: Record<string, MxRecord[]>;
  txt?: Record<string, string[]>;
  ns?: Record<string, string[]>;
  caa?: Record<string, CaaRecord[]>;
  /** Names that do not exist at all (NXDOMAIN); everything else answers NODATA when empty. */
  nxdomain?: string[];
  /** Names whose lookups fail with SERVFAIL. */
  servfail?: string[];
};

/** In-memory DNS. Like a real resolver, A/AAAA/MX/TXT follow a CNAME at the queried name. */
export class FakeDns implements DnsClient {
  readonly source = "テスト用DNS";
  constructor(private zone: Zone) {}

  private lookup<T>(name: string, table: Record<string, T[]> | undefined): DnsAnswer<T> {
    if (this.zone.servfail?.includes(name)) return { ok: false, failure: "SERVFAIL", message: "servfail" };
    const target = this.zone.cname?.[name];
    if (target && table !== (this.zone.cname as unknown)) return this.lookup(target.replace(/\.$/, ""), table);
    const records = table?.[name];
    if (records && records.length > 0) return { ok: true, records };
    const exists = this.zone.nxdomain ? !this.zone.nxdomain.includes(name) : true;
    return exists ? { ok: false, failure: "NODATA", message: "nodata" } : { ok: false, failure: "NXDOMAIN", message: "nxdomain" };
  }

  async a(name: string) { return this.lookup(name, this.zone.a); }
  async aaaa(name: string) { return this.lookup(name, this.zone.aaaa); }
  async cname(name: string): Promise<DnsAnswer<string>> {
    if (this.zone.servfail?.includes(name)) return { ok: false, failure: "SERVFAIL", message: "servfail" };
    const target = this.zone.cname?.[name];
    if (target) return { ok: true, records: [target] };
    return this.zone.nxdomain?.includes(name) ? { ok: false, failure: "NXDOMAIN", message: "nxdomain" } : { ok: false, failure: "NODATA", message: "nodata" };
  }
  async mx(name: string) { return this.lookup(name, this.zone.mx); }
  async txt(name: string) { return this.lookup(name, this.zone.txt); }
  async ns(name: string) { return this.lookup(name, this.zone.ns); }
  async caa(name: string) { return this.lookup(name, this.zone.caa); }
}

export const response = (status: number, headers: Record<string, string> = {}): WebResponse => ({ ok: true, status, headers, remoteAddress: "203.0.113.10" });
export const failure = (failure: WebError["failure"], message: string = failure): WebError => ({ ok: false, failure, message });

export function certificate(overrides: Partial<Certificate> = {}): Certificate {
  return {
    ok: true,
    authorized: true,
    subject: "CN=example.com",
    issuer: "C=US, O=Let's Encrypt, CN=R11",
    issuerOrganization: "Let's Encrypt",
    validFrom: "Oct  1 00:00:00 2026 GMT",
    validTo: "Dec 30 00:00:00 2026 GMT",
    subjectAltNames: ["example.com", "www.example.com"],
    protocol: "TLSv1.3",
    remoteAddress: "203.0.113.10",
    ...overrides,
  };
}

export class FakeWeb implements WebClient {
  readonly requested: string[] = [];
  constructor(
    private pages: Record<string, WebResponse | WebError>,
    private certs: Record<string, Certificate | WebError> = {},
  ) {}
  async get(url: URL) {
    this.requested.push(url.href);
    return this.pages[url.href] ?? failure("dns", "not found");
  }
  async certificate(host: string) {
    return this.certs[host] ?? failure("dns", "not found");
  }
}

/** A typical healthy HTTPS site at https://<host>/. */
export function healthySite(host: string, headers: Record<string, string> = {}) {
  return {
    pages: {
      [`http://${host}/`]: response(301, { location: `https://${host}/` }),
      [`https://${host}/`]: response(200, { "strict-transport-security": "max-age=86400", "x-content-type-options": "nosniff", ...headers }),
    },
    certs: { [host]: certificate({ subjectAltNames: [host] }) },
  };
}

export const NOW = () => new Date("2026-11-22T00:00:00Z");
