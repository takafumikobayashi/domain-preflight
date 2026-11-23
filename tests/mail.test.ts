import { describe, expect, it } from "vitest";
import { baseZone, check } from "./helpers.js";

const SES_DKIM = "abc123._domainkey.example.com";

describe("mail checks — the cautious defaults", () => {
  it("does not push Null MX / SPF -all / DMARC reject when usage is unknown", async () => {
    const checks = await check("example.com", baseZone());
    for (const id of ["mail.mx", "mail.spf", "mail.dmarc"]) {
      expect(checks[id]?.status).toBe("review");
      expect(checks[id]?.recommendations.join(" ")).toMatch(/確かな場合に限り|送信の有無|受信するかどうか/);
    }
    expect(checks["mail.context"]?.status).toBe("review");
  });

  it("suggests the no-mail set only when usage is none", async () => {
    const checks = await check("example.com", baseZone(), { mail: "none" });
    expect(checks["mail.mx"]?.recommendations.join(" ")).toContain("Null MX");
    expect(checks["mail.spf"]?.recommendations.join(" ")).toContain("v=spf1 -all");
    expect(checks["mail.dmarc"]?.recommendations.join(" ")).toContain("p=reject");
  });

  it("passes a no-mail domain that is already locked down", async () => {
    const checks = await check("example.com", {
      ...baseZone(),
      mx: { "example.com": [{ priority: 0, exchange: "" }] },
      txt: { "example.com": ["v=spf1 -all"], "_dmarc.example.com": ["v=DMARC1; p=reject;"] },
    }, { mail: "none" });
    expect(checks["mail.mx"]?.status).toBe("pass");
    expect(checks["mail.spf"]?.status).toBe("pass");
    expect(checks["mail.dmarc"]?.status).toBe("pass");
    expect(checks["mail.context"]?.status).toBe("pass");
  });
});

describe("mail checks — record format mistakes seen in practice", () => {
  it("finds a DMARC value wrapped in literal quotes", async () => {
    const checks = await check("example.com", { ...baseZone(), txt: { "_dmarc.example.com": ['"v=DMARC1; p=none;"'] } });
    expect(checks["mail.dmarc"]).toMatchObject({ status: "finding", severity: "medium" });
    expect(checks["mail.dmarc"]?.recommendations[0]).toContain("v=DMARC1; p=none;");
  });

  it("finds an SPF value wrapped in literal quotes", async () => {
    const checks = await check("mail.example.com", { ...baseZone("mail.example.com"), txt: { "mail.example.com": ['"v=spf1 include:amazonses.com ~all"'] } });
    expect(checks["mail.spf"]?.status).toBe("finding");
  });

  it("finds an MX whose priority was typed into the value", async () => {
    const checks = await check("mail.example.com", { ...baseZone("mail.example.com"), mx: { "mail.example.com": [{ priority: 1, exchange: "10 feedback-smtp.us-east-1.amazonses.com" }] } });
    expect(checks["mail.mx"]).toMatchObject({ status: "finding", severity: "medium" });
  });

  it("finds two SPF records", async () => {
    const checks = await check("example.com", { ...baseZone(), txt: { "example.com": ["v=spf1 -all", "v=spf1 include:_spf.google.com ~all"] } });
    expect(checks["mail.spf"]?.status).toBe("finding");
  });

  it("finds Null MX mixed with real MX", async () => {
    const checks = await check("example.com", { ...baseZone(), mx: { "example.com": [{ priority: 0, exchange: "" }, { priority: 10, exchange: "mx.example.net" }] } });
    expect(checks["mail.mx"]?.status).toBe("finding");
  });
});

describe("mail checks — policies", () => {
  it("finds +all", async () => {
    const checks = await check("example.com", { ...baseZone(), txt: { "example.com": ["v=spf1 +all"] } });
    expect(checks["mail.spf"]).toMatchObject({ status: "finding", severity: "high" });
  });

  it("treats DMARC p=none as review, and quarantine as pass", async () => {
    const none = await check("example.com", { ...baseZone(), txt: { "_dmarc.example.com": ["v=DMARC1; p=none; rua=mailto:dmarc@example.com"] } }, { mail: "send-only" });
    expect(none["mail.dmarc"]?.status).toBe("review");
    const quarantine = await check("example.com", { ...baseZone(), txt: { "_dmarc.example.com": ["v=DMARC1; p=quarantine"] } });
    expect(quarantine["mail.dmarc"]?.status).toBe("pass");
  });

  it("applies the organizational sp= to a subdomain without its own DMARC", async () => {
    const checks = await check("news.example.com", { ...baseZone("news.example.com"), txt: { "_dmarc.example.com": ["v=DMARC1; p=reject; sp=none"] } });
    expect(checks["mail.dmarc"]?.status).toBe("review");
    expect(checks["mail.dmarc"]?.summary).toContain("sp=");
  });

  it("finds missing SPF and DMARC when the host sends mail", async () => {
    const checks = await check("example.com", baseZone(), { mail: "send-only" });
    expect(checks["mail.spf"]?.status).toBe("finding");
    expect(checks["mail.dmarc"]?.status).toBe("finding");
  });

  it("finds Null MX on a host that should receive mail", async () => {
    const checks = await check("example.com", { ...baseZone(), mx: { "example.com": [{ priority: 0, exchange: "" }] } }, { mail: "send-and-receive" });
    expect(checks["mail.mx"]).toMatchObject({ status: "finding", severity: "high" });
    expect(checks["mail.context"]?.status).toBe("review");
  });
});

describe("mail checks — usage inference", () => {
  it("infers sending from an SES SPF include and says it is only an inference", async () => {
    const checks = await check("mail.example.com", { ...baseZone("mail.example.com"), txt: { "mail.example.com": ["v=spf1 include:amazonses.com ~all"] } });
    expect(checks["mail.context"]?.summary).toContain("送信");
    expect(checks["mail.context"]?.evidence[0]?.detail).toContain("Amazon SES");
    expect(checks["mail.context"]?.limitations.join(" ")).toContain("サブドメイン");
  });

  it("flags a declared 'none' that contradicts published MX", async () => {
    const checks = await check("example.com", { ...baseZone(), mx: { "example.com": [{ priority: 10, exchange: "mx.example.net" }] } }, { mail: "none" });
    expect(checks["mail.context"]?.status).toBe("review");
    expect(checks["mail.mx"]?.status).toBe("review");
  });
});

describe("DKIM", () => {
  it("is not_checked without a selector — never shown as safe", async () => {
    const checks = await check("example.com", baseZone());
    expect(checks["mail.dkim"]?.status).toBe("not_checked");
  });

  it("passes a published key (also through a CNAME) and finds a missing one", async () => {
    const zone = { ...baseZone(), cname: { [SES_DKIM]: "abc123.dkim.amazonses.com" }, txt: { "abc123.dkim.amazonses.com": ["p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ"] } };
    expect((await check("example.com", zone, { dkim: ["abc123"] }))["mail.dkim"]?.status).toBe("pass");
    expect((await check("example.com", zone, { dkim: ["missing"] }))["mail.dkim"]?.status).toBe("finding");
  });
});

describe("mail checks — SES custom MAIL FROM", () => {
  it("reads the SES feedback MX as a sending signal, not as a mailbox", async () => {
    const checks = await check("mail.example.com", {
      ...baseZone("mail.example.com"),
      mx: { "mail.example.com": [{ priority: 10, exchange: "feedback-smtp.us-east-1.amazonses.com" }] },
      txt: { "mail.example.com": ["v=spf1 include:amazonses.com ~all"] },
    });
    expect(checks["mail.context"]?.summary).toContain("送信に使っている可能性");
    expect(checks["mail.context"]?.summary).not.toContain("受信");
  });

  it("explains that apex SPF -all does not rule out sending with DKIM", async () => {
    const checks = await check("example.com", { ...baseZone(), txt: { "example.com": ["v=spf1 -all"] } });
    expect(checks["mail.context"]?.limitations.join(" ")).toContain("DKIM署名");
  });
});

describe("mail.shared-host — mail living on the web server", () => {
  it("warns before migration when MX points at the same server as the site", async () => {
    const checks = await check("example.com", {
      ...baseZone(),
      a: { "example.com": ["203.0.113.10"], "mail.example.com": ["203.0.113.10"] },
      mx: { "example.com": [{ priority: 10, exchange: "mail.example.com" }] },
    });
    expect(checks["mail.shared-host"]).toMatchObject({ status: "review", severity: "medium" });
    expect(checks["mail.shared-host"]?.recommendations.join(" ")).toContain("解約");
  });

  it("warns when MX is the site's own name", async () => {
    const checks = await check("example.com", { ...baseZone(), mx: { "example.com": [{ priority: 10, exchange: "example.com" }] } });
    expect(checks["mail.shared-host"]?.status).toBe("review");
  });

  it("passes when mail is hosted elsewhere, and is not_checked without MX", async () => {
    const elsewhere = await check("example.com", {
      ...baseZone(),
      a: { "example.com": ["203.0.113.10"], "aspmx.l.google.com": ["198.51.100.27"] },
      mx: { "example.com": [{ priority: 1, exchange: "aspmx.l.google.com" }] },
    });
    expect(elsewhere["mail.shared-host"]?.status).toBe("pass");
    const noMx = await check("example.com", baseZone());
    expect(noMx["mail.shared-host"]?.status).toBe("not_checked");
  });
});

describe("not applicable vs not checked", () => {
  it("a locked-down no-mail domain has a clear mail area, not 'unchecked'", async () => {
    const { scanHost } = await import("../src/run.js");
    const { FakeDns, FakeWeb, NOW, healthySite } = await import("./fakes.js");
    const site = healthySite("example.com");
    const report = await scanHost("example.com", {
      hosts: ["example.com"], mailUsage: "none", dkimSelectors: [], now: NOW,
      dns: new FakeDns({ ...baseZone(), mx: { "example.com": [{ priority: 0, exchange: "" }] }, txt: { "example.com": ["v=spf1 -all"], "_dmarc.example.com": ["v=DMARC1; p=reject;"] } }),
      web: new FakeWeb(site.pages, site.certs),
    });
    const mail = report.areas.find((area) => area.id === "mail");
    expect(mail?.state).toBe("clear");
    expect(report.checks.find((c) => c.id === "mail.dkim")?.notApplicable).toBe(true);
  });

  it("DKIM without a selector is still 'not checked' (not 'not applicable') when mail is used", async () => {
    const checks = await check("example.com", baseZone(), { mail: "send-only" });
    expect(checks["mail.dkim"]?.notApplicable).toBeFalsy();
  });
});

describe("SPF -all with declared sending (the field-notes trap)", () => {
  it("does not call apex SPF -all a contradiction of send-only, but explains MAIL FROM + DKIM", async () => {
    const checks = await check("example.com", { ...baseZone(), txt: { "example.com": ["v=spf1 -all"], "_dmarc.example.com": ["v=DMARC1; p=reject;"] } }, { mail: "send-only" });
    expect(checks["mail.context"]?.status).toBe("pass");
    expect(checks["mail.context"]?.recommendations.join(" ")).toContain("DKIM");
  });
});
