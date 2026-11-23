import { describe, expect, it } from "vitest";
import { FakeWeb, certificate, healthySite } from "./fakes.js";
import { baseZone, check } from "./helpers.js";

describe("dns checks", () => {
  it("passes a host with an address and names the DNS operator", async () => {
    const checks = await check("example.com", baseZone());
    expect(checks["dns.address"]?.status).toBe("pass");
    expect(checks["dns.ns"]?.status).toBe("pass");
    expect(checks["dns.ns"]?.summary).toContain("Cloudflare");
    expect(checks["dns.dangling-cname"]?.status).toBe("not_checked");
  });

  it("flags a CNAME whose target no longer exists (takeover risk)", async () => {
    const checks = await check("old.example.com", {
      ...baseZone(),
      cname: { "old.example.com": "gone-project.pages.dev" },
      nxdomain: ["gone-project.pages.dev"],
    });
    expect(checks["dns.dangling-cname"]).toMatchObject({ status: "finding", severity: "high" });
    expect(checks["dns.dangling-cname"]?.summary).toContain("Cloudflare Pages");
  });

  it("passes a CNAME that resolves", async () => {
    const checks = await check("app.example.com", {
      ...baseZone(),
      cname: { "app.example.com": "app.vercel-dns.com" },
      a: { "app.vercel-dns.com": ["203.0.113.20"] },
    });
    expect(checks["dns.address"]?.status).toBe("pass");
    expect(checks["dns.dangling-cname"]?.status).toBe("pass");
  });

  it("reports a missing name as review, and lookup failures as error", async () => {
    const missing = await check("nothing.example.com", { ...baseZone(), nxdomain: ["nothing.example.com"] });
    expect(missing["dns.address"]?.status).toBe("review");
    const broken = await check("broken.example.com", { ...baseZone(), servfail: ["broken.example.com"] });
    expect(broken["dns.address"]?.status).toBe("error");
  });

  it("marks NS split across operators for review", async () => {
    const checks = await check("example.com", { ...baseZone(), ns: { "example.com": ["ana.ns.cloudflare.com", "dns1.p01.nsone.net"] } });
    expect(checks["dns.ns"]?.status).toBe("review");
  });

  it("finds a CAA that does not allow the current certificate's CA", async () => {
    const checks = await check("www.example.com", {
      ...baseZone("www.example.com"),
      caa: { "example.com": [{ critical: 0, tag: "issue", value: "digicert.com" }] },
    });
    expect(checks["dns.caa"]).toMatchObject({ status: "finding", severity: "medium" });
  });

  it("passes when CAA allows the current CA, and when there is no CAA", async () => {
    const allowed = await check("example.com", { ...baseZone(), caa: { "example.com": [{ critical: 0, tag: "issue", value: "letsencrypt.org" }] } });
    expect(allowed["dns.caa"]?.status).toBe("pass");
    const none = await check("example.com", baseZone());
    expect(none["dns.caa"]?.status).toBe("pass");
  });

  it("always leaves DNSSEC as not_checked in this version", async () => {
    const checks = await check("example.com", baseZone());
    expect(checks["dns.dnssec"]?.status).toBe("not_checked");
  });

  it("uses the certificate issuer from the web observation for CAA", async () => {
    const site = healthySite("example.com");
    const web = new FakeWeb(site.pages, { "example.com": certificate({ issuerOrganization: "Google Trust Services" }) });
    const checks = await check("example.com", { ...baseZone(), caa: { "example.com": [{ critical: 0, tag: "issue", value: "letsencrypt.org" }] } }, { web });
    expect(checks["dns.caa"]?.status).toBe("finding");
  });
});
