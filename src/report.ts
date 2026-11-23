import { AREA_STATE_LABEL } from "./guide.js";
import type { AreaState, CheckResult, CheckStatus, ScanReport, Severity, TargetReport } from "./types.js";

export const STATUS_LABEL: Record<CheckStatus, string> = {
  pass: "確認済み",
  finding: "要対応",
  review: "要確認",
  not_checked: "未検査",
  error: "エラー",
};

const STATUS_ICON: Record<CheckStatus, string> = { pass: "✓", finding: "✗", review: "!", not_checked: "-", error: "?" };
const AREA_ICON: Record<AreaState, string> = { action: "✗", error: "?", review: "!", unchecked: "-", clear: "✓" };

const plainName = (check: CheckResult) => check.guide?.name ?? check.title;
/** "対象外" for checks that do not apply, so they are not mistaken for gaps. */
const statusLabel = (check: CheckResult) => (check.status === "not_checked" && check.notApplicable ? "対象外" : STATUS_LABEL[check.status]);

/** The checks that need attention, most urgent first: what to look at next. */
function nextSteps(target: TargetReport): CheckResult[] {
  return [...target.checks].filter((check) => check.status === "finding" || check.status === "review" || check.status === "error").sort(byImportance);
}
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
    lines.push("### このままで大丈夫？", "");
    lines.push("| 目的 | 状態 | ひとこと |", "| --- | --- | --- |");
    for (const area of target.areas) lines.push(`| ${area.name} | ${AREA_ICON[area.state]} ${AREA_STATE_LABEL[area.state]} | ${escapeCell(area.summary)} |`);
    lines.push("");
    const steps = nextSteps(target);
    if (steps.length > 0) {
      lines.push("**まず見てほしいこと**", "");
      steps.slice(0, 3).forEach((check, index) => lines.push(`${index + 1}. **${plainName(check)}** — ${check.summary}`));
      lines.push("");
    }
    lines.push("### 項目の一覧", "");
    lines.push(`組織ドメイン: ${target.organizationalDomain} ｜ ${counts(checks)}`, "");
    lines.push("| 状態 | 重大度 | 項目 | 概要 |", "| --- | --- | --- | --- |");
    for (const check of checks) {
      lines.push(`| ${statusLabel(check)} | ${check.severity ?? "-"} | ${plainName(check)}（\`${check.id}\`） | ${escapeCell(check.summary)} |`);
    }
    lines.push("");
    for (const check of checks) {
      lines.push(`### ${STATUS_ICON[check.status]} ${plainName(check)} — ${statusLabel(check)}`, "");
      lines.push(check.summary, "");
      if (check.guide) {
        lines.push("**かんたんな説明**", "");
        lines.push(`- 何を確認したか: ${check.guide.what}`);
        lines.push(`- なぜ大事か: ${check.guide.why}`);
        lines.push(`- 放っておくと／設定を誤ると: ${check.guide.risk}`);
        lines.push(`- 用語: ${check.title}（\`${check.id}\`）`, "");
      }
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
    lines.push(`${target.host}  (組織ドメイン ${target.organizationalDomain})`);
    for (const area of target.areas) lines.push(`  ${AREA_ICON[area.state]} ${area.summary}`);
    lines.push("");
    for (const check of checks) {
      lines.push(`  ${STATUS_ICON[check.status]} ${statusLabel(check).padEnd(4, "　")} ${plainName(check)}`);
      lines.push(`      ${check.summary}`);
      if (check.status === "finding" || check.status === "review") {
        for (const recommendation of check.recommendations.slice(0, 1)) lines.push(`      → ${recommendation}`);
      }
    }
    lines.push("");
  }
  lines.push("各項目の説明（何を確認したか・なぜ大事か）は --format markdown で確認できます。「確認済み」は安全の保証ではありません。");
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
