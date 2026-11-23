// Builds docs/examples/sample-report.md from fictional data (no network). Run after `npm run build`.
import { writeFileSync } from "node:fs";
import { scan } from "../dist/run.js";
import { toMarkdown } from "../dist/report.js";

const ok = (records) => ({ ok: true, records });
const none = { ok: false, failure: "NODATA", message: "nodata" };
const nx = { ok: false, failure: "NXDOMAIN", message: "nxdomain" };
const zone = {
  a: { "example.com": ["203.0.113.10"], "www.example.com": ["203.0.113.10"] },
  cname: { "old.example.com": "retired-project.pages.dev" },
  ns: { "example.com": ["ana.ns.cloudflare.com", "bob.ns.cloudflare.com"] },
  mx: { "mail.example.com": [{ priority: 1, exchange: "10 feedback-smtp.us-east-1.amazonses.com" }] },
  txt: { "example.com": ["v=spf1 -all"], "_dmarc.example.com": ['"v=DMARC1; p=none;"'], "mail.example.com": ["v=spf1 include:amazonses.com ~all"] },
};
const pick = (table, name) => (table?.[name] ? ok(table[name]) : name.startsWith("retired-project") || name === "old.example.com" ? (name === "old.example.com" ? none : nx) : none);
const dns = {
  source: "例示用の固定データ",
  a: async (n) => pick(zone.a, n), aaaa: async () => none, cname: async (n) => (zone.cname[n] ? ok([zone.cname[n]]) : none),
  mx: async (n) => pick(zone.mx, n), txt: async (n) => pick(zone.txt, n), ns: async (n) => pick(zone.ns, n), caa: async () => none,
};
const res = (status, headers = {}) => ({ ok: true, status, headers, remoteAddress: "203.0.113.10" });
const pages = {
  "http://example.com/": res(301, { location: "https://example.com/" }),
  "https://example.com/": res(200, { "x-content-type-options": "nosniff", server: "cloudflare" }),
};
const web = {
  get: async (url) => pages[url.href] ?? { ok: false, failure: "dns", message: "ENOTFOUND" },
  certificate: async (host) =>
    host === "example.com"
      ? { ok: true, authorized: true, subject: "CN=example.com", issuer: "C=US, O=Google Trust Services, CN=WE1", issuerOrganization: "Google Trust Services", validFrom: "Oct  1 00:00:00 2026 GMT", validTo: "Dec 30 00:00:00 2026 GMT", subjectAltNames: ["example.com", "*.example.com"], protocol: "TLSv1.3", remoteAddress: "203.0.113.10" }
      : { ok: false, failure: "dns", message: "ENOTFOUND" },
};
let tick = Date.parse("2026-11-22T00:00:00Z");
const report = await scan({ hosts: ["example.com", "mail.example.com", "old.example.com"], mailUsage: "unknown", dkimSelectors: [], dns, web, now: () => new Date(tick) });
writeFileSync(new URL("../docs/examples/sample-report.md", import.meta.url), "<!-- 架空のデータから生成した例です（scripts/sample-report.mjs）。実在のドメインの点検結果ではありません。 -->\n\n" + toMarkdown(report));
console.log("wrote docs/examples/sample-report.md");
