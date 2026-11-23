import { describe, expect, it } from "vitest";
import { meetsSeverity, toJson, toMarkdown, toText, worstFinding } from "../src/report.js";
import { scan } from "../src/run.js";
import { FakeDns, FakeWeb, NOW, healthySite } from "./fakes.js";
import { baseZone } from "./helpers.js";

async function sampleReport() {
  const site = healthySite("example.com");
  return scan({
    hosts: ["example.com"],
    mailUsage: "unknown",
    dkimSelectors: [],
    dns: new FakeDns({ ...baseZone(), txt: { "_dmarc.example.com": ['"v=DMARC1; p=none;"'] } }),
    web: new FakeWeb(site.pages, site.certs),
    now: NOW,
  });
}

describe("reports", () => {
  it("JSON carries schemaVersion and every check", async () => {
    const report = await sampleReport();
    const json = JSON.parse(toJson(report));
    expect(json.schemaVersion).toBe("0.2.0");
    expect(json.targets[0].checks).toHaveLength(15);
    expect(json).not.toHaveProperty("score");
  });

  it("Markdown and text show the same findings as JSON", async () => {
    const report = await sampleReport();
    const markdown = toMarkdown(report);
    const text = toText(report);
    for (const check of report.targets[0]!.checks.filter((item) => item.status === "finding")) {
      expect(markdown).toContain(check.summary.replace(/\|/g, "\\|"));
      expect(text).toContain(check.summary);
    }
    expect(markdown).toContain("安全の保証ではありません");
  });

  it("every check carries a plain-language guide, and every target has the three areas", async () => {
    const report = await sampleReport();
    const target = report.targets[0]!;
    for (const check of target.checks) {
      expect(check.guide, check.id).toBeDefined();
      for (const text of Object.values(check.guide!)) expect(text.length).toBeGreaterThan(5);
    }
    expect(target.areas.map((area) => area.id)).toEqual(["website", "mail", "domain"]);
    const covered = target.areas.flatMap((area) => area.checkIds).sort();
    expect(covered).toEqual(target.checks.map((check) => check.id).sort());
  });

  it("an area takes the most urgent state, and a clear area still says it is not a guarantee", async () => {
    const report = await sampleReport();
    const areas = Object.fromEntries(report.targets[0]!.areas.map((area) => [area.id, area]));
    expect(areas.mail?.state).toBe("action");
    expect(areas.domain?.state).toBe("unchecked");
    const markdown = toMarkdown(report);
    expect(markdown).toContain("このままで大丈夫？");
    expect(markdown).toContain("まず見てほしいこと");
    expect(markdown).toContain("かんたんな説明");
  });

  it("fail-on compares the worst finding with the threshold", async () => {
    const report = await sampleReport();
    expect(worstFinding(report)).toBe("medium");
    expect(meetsSeverity("medium", "low")).toBe(true);
    expect(meetsSeverity("medium", "high")).toBe(false);
    expect(meetsSeverity(undefined, "low")).toBe(false);
  });

  it("never puts secret-looking environment values into the report", async () => {
    process.env.CLOUDFLARE_API_TOKEN = "secret-token-value-123";
    const report = await sampleReport();
    expect(toJson(report)).not.toContain("secret-token-value-123");
    delete process.env.CLOUDFLARE_API_TOKEN;
  });
});
