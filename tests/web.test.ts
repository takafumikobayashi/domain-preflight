import { describe, expect, it } from "vitest";
import { FakeWeb, certificate, failure, healthySite, response } from "./fakes.js";
import { baseZone, check } from "./helpers.js";

const host = "example.com";

describe("web checks", () => {
  it("passes a healthy HTTPS site", async () => {
    const checks = await check(host, baseZone());
    expect(checks["web.https"]?.status).toBe("pass");
    expect(checks["web.certificate"]?.status).toBe("pass");
    expect(checks["web.hsts"]?.status).toBe("pass");
    expect(checks["web.headers"]?.status).toBe("pass");
  });

  it("finds HTTP that is not redirected to HTTPS", async () => {
    const site = healthySite(host);
    const web = new FakeWeb({ ...site.pages, [`http://${host}/`]: response(200) }, site.certs);
    expect((await check(host, baseZone(), { web }))["web.https"]?.status).toBe("finding");
  });

  it("finds a redirect loop", async () => {
    const site = healthySite(host);
    const web = new FakeWeb({ ...site.pages, [`http://${host}/`]: response(301, { location: `http://${host}/` }) }, site.certs);
    const result = (await check(host, baseZone(), { web }))["web.https"];
    expect(result?.status).toBe("finding");
    expect(result?.summary).toContain("ループ");
    expect(web.requested.filter((url) => url.startsWith("http://")).length).toBeLessThanOrEqual(6);
  });

  it("finds a site that does not answer on HTTPS", async () => {
    const site = healthySite(host);
    const web = new FakeWeb({ ...site.pages, [`https://${host}/`]: failure("connect", "ECONNREFUSED") }, { [host]: failure("connect") });
    const checks = await check(host, baseZone(), { web });
    expect(checks["web.https"]).toMatchObject({ status: "finding", severity: "high" });
    expect(checks["web.hsts"]?.status).toBe("not_checked");
    expect(checks["web.certificate"]?.status).toBe("error");
  });

  it("does not connect to private addresses and says so", async () => {
    const web = new FakeWeb({ [`http://${host}/`]: failure("blocked-address"), [`https://${host}/`]: failure("blocked-address") }, { [host]: failure("blocked-address") });
    const checks = await check(host, baseZone(), { web });
    expect(checks["web.https"]?.status).toBe("not_checked");
    expect(checks["web.certificate"]?.status).toBe("not_checked");
  });

  it.each([
    ["CERT_HAS_EXPIRED", "期限が切れて"],
    ["DEPTH_ZERO_SELF_SIGNED_CERT", "自己署名"],
    ["ERR_TLS_CERT_ALTNAME_INVALID", "名前の不一致"],
  ])("explains certificate error %s", async (code, text) => {
    const site = healthySite(host);
    const web = new FakeWeb(site.pages, { [host]: certificate({ authorized: false, authorizationError: code }) });
    const result = (await check(host, baseZone(), { web }))["web.certificate"];
    expect(result).toMatchObject({ status: "finding", severity: "high" });
    expect(result?.summary).toContain(text);
  });

  it("finds a certificate close to expiry", async () => {
    const site = healthySite(host);
    const web = new FakeWeb(site.pages, { [host]: certificate({ validTo: "Nov 30 00:00:00 2026 GMT" }) });
    expect((await check(host, baseZone(), { web }))["web.certificate"]?.status).toBe("finding");
  });

  it("treats missing HSTS as review with a short starting value, never a long preload", async () => {
    const site = healthySite(host);
    const web = new FakeWeb({ ...site.pages, [`https://${host}/`]: response(200, { "x-content-type-options": "nosniff" }) }, site.certs);
    const result = (await check(host, baseZone(), { web }))["web.hsts"];
    expect(result?.status).toBe("review");
    expect(result?.recommendations[0]).toContain("max-age=86400");
    expect(result?.recommendations[0]).toContain("確認してから");
  });

  it("notes includeSubDomains and preload on an existing HSTS header", async () => {
    const site = healthySite(host);
    const web = new FakeWeb({ ...site.pages, [`https://${host}/`]: response(200, { "strict-transport-security": "max-age=31536000; includeSubDomains; preload" }) }, site.certs);
    const result = (await check(host, baseZone(), { web }))["web.hsts"];
    expect(result?.status).toBe("pass");
    expect(result?.recommendations.join(" ")).toContain("すべてのサブドメイン");
  });

  it("does not run web checks for a name without an address", async () => {
    const web = new FakeWeb({}, {});
    const checks = await check("mail.example.com", { ...baseZone(), nxdomain: ["mail.example.com"] }, { web });
    expect(checks["web.https"]?.status).toBe("not_checked");
  });
});
