import { checkMailContext, checkDkim, checkDmarc, checkMx, checkSharedHost, checkSpf, observeMail } from "./checks/mail.js";
import { summarizeAreas, withGuide } from "./guide.js";
import { checkAddress, checkCaa, checkDanglingCname, checkDnssec, checkNameServers } from "./checks/dns.js";
import { checkCertificate, checkHeaders, checkHsts, checkHttps, observeWeb } from "./checks/web.js";
import type { CheckContext } from "./checks/context.js";
import { organizationalDomain } from "./input.js";
import type { DnsClient } from "./net/dns.js";
import type { WebClient } from "./net/web.js";
import { SCHEMA_VERSION, type CheckResult, type MailUsage, type ScanReport, type TargetReport } from "./types.js";

export const VERSION = "0.1.0";

export type ScanOptions = {
  hosts: string[];
  mailUsage: MailUsage;
  dkimSelectors: string[];
  dns: DnsClient;
  web: WebClient;
  now?: () => Date;
};

/** A check that throws must not take the rest of the report down with it. */
async function safely(id: string, title: string, run: () => CheckResult | Promise<CheckResult>): Promise<CheckResult> {
  try {
    return await run();
  } catch (error) {
    return { id, title, status: "error", summary: `内部エラー: ${(error as Error).message}`, evidence: [], recommendations: [], limitations: [] };
  }
}

export async function scanHost(host: string, options: ScanOptions): Promise<TargetReport> {
  const context: CheckContext = {
    host,
    organizationalDomain: organizationalDomain(host),
    mailUsage: options.mailUsage,
    dkimSelectors: options.dkimSelectors,
    dns: options.dns,
    web: options.web,
    now: options.now ?? (() => new Date()),
  };
  const [mail, web] = await Promise.all([observeMail(context), observeWeb(context)]);
  const checks = await Promise.all([
    safely("dns.address", "名前解決", () => checkAddress(context)),
    safely("dns.dangling-cname", "CNAMEの参照先", () => checkDanglingCname(context)),
    safely("dns.ns", "ネームサーバー", () => checkNameServers(context)),
    safely("dns.caa", "CAA", () => checkCaa(context, web.certificate)),
    safely("dns.dnssec", "DNSSEC", () => checkDnssec(context)),
    safely("web.https", "HTTPS", () => checkHttps(context, web)),
    safely("web.certificate", "TLS証明書", () => checkCertificate(context, web)),
    safely("web.hsts", "HSTS", () => checkHsts(context, web)),
    safely("web.headers", "セキュリティ関連ヘッダー", () => checkHeaders(context, web)),
    safely("mail.context", "メールの用途", () => checkMailContext(context, mail)),
    safely("mail.shared-host", "メールとWebサイトのサーバーの同居", () => checkSharedHost(context, mail)),
    safely("mail.mx", "MX", () => checkMx(context, mail)),
    safely("mail.spf", "SPF", () => checkSpf(context, mail)),
    safely("mail.dmarc", "DMARC", () => checkDmarc(context, mail)),
    safely("mail.dkim", "DKIM", () => checkDkim(context, mail)),
  ]);
  const guided = checks.map(withGuide);
  return { host, organizationalDomain: context.organizationalDomain, areas: summarizeAreas(guided), checks: guided };
}

export async function scan(options: ScanOptions): Promise<ScanReport> {
  const now = options.now ?? (() => new Date());
  const startedAt = now().toISOString();
  const targets: TargetReport[] = [];
  // One host at a time keeps the request rate low and the order of evidence readable.
  for (const host of options.hosts) targets.push(await scanHost(host, { ...options, now }));
  return {
    schemaVersion: SCHEMA_VERSION,
    tool: { name: "domain-preflight", version: VERSION },
    mode: "public",
    startedAt,
    finishedAt: now().toISOString(),
    input: { hosts: options.hosts, mailUsage: options.mailUsage, dkimSelectors: options.dkimSelectors, resolver: options.dns.source },
    targets,
  };
}
