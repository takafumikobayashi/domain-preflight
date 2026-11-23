import type { CheckResult, CheckStatus, ScanReport, Severity } from "./types.js";

export const STATUS_LABEL: Record<CheckStatus, string> = {
  pass: "確認済み",
  finding: "要対応",
  review: "要確認",
  not_checked: "未検査",
  error: "エラー",
};

const STATUS_ICON: Record<CheckStatus, string> = { pass: "✓", finding: "✗", review: "!", not_checked: "-", error: "?" };
const SEVERITY_ORDER: Severity[] = ["high", "medium", "low", "info"];
const STATUS_ORDER: CheckStatus[] = ["finding", "error", "review", "not_checked", "pass"];

const byImportance = (a: CheckResult, b: CheckResult) =>
  STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
  SEVERITY_ORDER.indexOf(a.severity ?? "info") - SEVERITY_ORDER.indexOf(b.severity ?? "info");

function counts(checks: CheckResult[]): string {
  return STATUS_ORDER.map((status) => [status, checks.filter((check) => check.status === status).length] as const)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${STATUS_LABEL[status]} ${count}`)
    .join(" / ");
}

export function toJson(report: ScanReport): string {
  return JSON.stringify(report, null, 2) + "\n";
}

const escapeCell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");

export function toMarkdown(report: ScanReport): string {
  const lines: string[] = [];
  lines.push(`# Domain Preflight レポート`, "");
  lines.push(`- 点検日時: ${report.startedAt}`);
  lines.push(`- 対象: ${report.input.hosts.join(", ")}`);
  lines.push(`- モード: ${report.mode}（公開情報のみ、読み取り専用）`);
  lines.push(`- メールの用途: ${report.input.mailUsage}`);
  lines.push(`- DNSの問い合わせ先: ${report.input.resolver}`);
  lines.push(`- ツール: ${report.tool.name} ${report.tool.version}（schema ${report.schemaVersion}）`, "");
  lines.push(
    "> 「確認済み」は、このツールが定めた条件を観測できたという意味で、安全の保証ではありません。「未検査」は問題がないという意味ではありません。",
    "",
  );
  for (const target of report.targets) {
    const checks = [...target.checks].sort(byImportance);
    lines.push(`## ${target.host}`, "");
    lines.push(`組織ドメイン: ${target.organizationalDomain} ｜ ${counts(checks)}`, "");
    lines.push("| 状態 | 重大度 | チェック | 概要 |", "| --- | --- | --- | --- |");
    for (const check of checks) {
      lines.push(`| ${STATUS_LABEL[check.status]} | ${check.severity ?? "-"} | ${check.title} (\`${check.id}\`) | ${escapeCell(check.summary)} |`);
    }
    lines.push("");
    for (const check of checks) {
      lines.push(`### ${STATUS_ICON[check.status]} ${check.title} — ${STATUS_LABEL[check.status]}`, "");
      lines.push(check.summary, "");
      if (check.evidence.length > 0) {
        lines.push("**観測結果**", "");
        for (const item of check.evidence) lines.push(`- ${item.source}: \`${item.detail.replace(/`/g, "'")}\``);
        lines.push("");
      }
      if (check.recommendations.length > 0) {
        lines.push("**確認・改善の候補**", "");
        for (const item of check.recommendations) lines.push(`- ${item}`);
        lines.push("");
      }
      if (check.limitations.length > 0) {
        lines.push("**このチェックで分からないこと**", "");
        for (const item of check.limitations) lines.push(`- ${item}`);
        lines.push("");
      }
    }
  }
  return lines.join("\n");
}

export function toText(report: ScanReport): string {
  const lines: string[] = [];
  for (const target of report.targets) {
    const checks = [...target.checks].sort(byImportance);
    lines.push(`${target.host}  (組織ドメイン ${target.organizationalDomain})  ${counts(checks)}`);
    for (const check of checks) {
      lines.push(`  ${STATUS_ICON[check.status]} ${STATUS_LABEL[check.status].padEnd(4, "　")} ${check.id.padEnd(20)} ${check.summary}`);
      if (check.status === "finding" || check.status === "review") {
        for (const recommendation of check.recommendations.slice(0, 1)) lines.push(`      → ${recommendation}`);
      }
    }
    lines.push("");
  }
  lines.push("詳細は --format markdown または --format json で確認できます。「確認済み」は安全の保証ではありません。");
  return lines.join("\n") + "\n";
}

/** Highest severity among findings, for --fail-on. */
export function worstFinding(report: ScanReport): Severity | undefined {
  const severities = report.targets.flatMap((target) => target.checks.filter((check) => check.status === "finding").map((check) => check.severity ?? "info"));
  return SEVERITY_ORDER.find((severity) => severities.includes(severity));
}

export function meetsSeverity(found: Severity | undefined, threshold: Severity): boolean {
  return found !== undefined && SEVERITY_ORDER.indexOf(found) <= SEVERITY_ORDER.indexOf(threshold);
}
