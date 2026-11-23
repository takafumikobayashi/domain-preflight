import { scanHost } from "../src/run.js";
import type { MailUsage } from "../src/types.js";
import { FakeDns, FakeWeb, NOW, healthySite, type Zone } from "./fakes.js";

/** Scans one host against fake DNS/web and returns checks keyed by id. */
export async function check(host: string, zone: Zone, options: { mail?: MailUsage; dkim?: string[]; web?: FakeWeb } = {}) {
  const site = healthySite(host);
  const web = options.web ?? new FakeWeb(site.pages, site.certs);
  const report = await scanHost(host, {
    hosts: [host],
    mailUsage: options.mail ?? "unknown",
    dkimSelectors: options.dkim ?? [],
    dns: new FakeDns(zone),
    web,
    now: NOW,
  });
  return Object.fromEntries(report.checks.map((result) => [result.id, result]));
}

export const baseZone = (host = "example.com"): Zone => ({
  a: { [host]: ["203.0.113.10"] },
  ns: { "example.com": ["ana.ns.cloudflare.com", "bob.ns.cloudflare.com"] },
});
