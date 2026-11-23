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
    expect(json.schemaVersion).toBe("0.1.0");
    expect(json.targets[0].checks).toHaveLength(14);
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
