#!/usr/bin/env node
import { existsSync, writeFileSync } from "node:fs";
import { isIP } from "node:net";
import { parseArgs } from "node:util";
import { InputError, MAIL_USAGES, normalizeHost, normalizeSelector, parseMailUsage } from "./input.js";
import { NodeDnsClient } from "./net/dns.js";
import { NodeWebClient } from "./net/web.js";
import { meetsSeverity, toJson, toMarkdown, toText, worstFinding } from "./report.js";
import { scan, VERSION } from "./run.js";
import type { Severity } from "./types.js";

const HELP = `domain-preflight ${VERSION} — DNS・HTTPS・メール認証の読み取り専用点検

使い方:
  domain-preflight check <host> [<host>...] [オプション]

オプション:
  --mail <usage>          メールの用途: ${MAIL_USAGES.join(" | ")}（既定 unknown）
  --dkim-selector <s>     確認するDKIMセレクタ（複数指定可）
  --format <f>            text | json | markdown（既定 text）
  --output <file>         ファイルに書き出す（既存ファイルは --force がないと上書きしない）
  --force                 --output の上書きを許可
  --resolver <ip>         DNSの問い合わせ先（例 1.1.1.1。既定はシステムのリゾルバ）
  --fail-on <severity>    high | medium | low の所見があれば終了コード 1（CI 用）
  -h, --help              このヘルプ
  -v, --version           バージョン

終了コード: 0 完了 / 1 --fail-on に該当 / 2 入力が不正 / 3 予期しないエラー
このツールは設定を変更しません。点検は自分が管理する、または許可を得たサイトに対して行ってください。
`;

const SEVERITIES: Severity[] = ["high", "medium", "low"];

const MIN_NODE_MAJOR = 24;

async function main(argv: string[]): Promise<number> {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < MIN_NODE_MAJOR) throw new InputError(`Node.js ${MIN_NODE_MAJOR} 以上が必要です（現在 ${process.versions.node}）。docs/SETUP.md を参照してください`);
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      mail: { type: "string" },
      "dkim-selector": { type: "string", multiple: true },
      format: { type: "string", default: "text" },
      output: { type: "string" },
      force: { type: "boolean", default: false },
      resolver: { type: "string", multiple: true },
      "fail-on": { type: "string" },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });
  if (values.version) {
    process.stdout.write(`${VERSION}\n`);
    return 0;
  }
  const [command, ...rawHosts] = positionals;
  if (values.help || command === undefined) {
    process.stdout.write(HELP);
    return values.help ? 0 : 2;
  }
  if (command !== "check") throw new InputError(`不明なコマンド "${command}" です。check を指定してください`);
  if (rawHosts.length === 0) throw new InputError("点検するホスト名を指定してください（例: domain-preflight check example.com）");
  if (rawHosts.length > 20) throw new InputError("一度に指定できるホストは20件までです");

  const hosts = [...new Set(rawHosts.map(normalizeHost))];
  const mailUsage = parseMailUsage(values.mail);
  const dkimSelectors = [...new Set((values["dkim-selector"] ?? []).map(normalizeSelector))];
  const format = values.format;
  if (format !== "text" && format !== "json" && format !== "markdown") throw new InputError("--format は text / json / markdown のいずれかです");
  const failOn = values["fail-on"];
  if (failOn !== undefined && !(SEVERITIES as string[]).includes(failOn)) throw new InputError("--fail-on は high / medium / low のいずれかです");
  const resolvers = values.resolver ?? [];
  for (const resolver of resolvers) if (!isIP(resolver)) throw new InputError(`--resolver "${resolver}" はIPアドレスではありません`);
  if (values.output && existsSync(values.output) && !values.force) throw new InputError(`${values.output} は既に存在します。上書きするには --force を付けてください`);

  const report = await scan({ hosts, mailUsage, dkimSelectors, dns: new NodeDnsClient(resolvers), web: new NodeWebClient() });
  const rendered = format === "json" ? toJson(report) : format === "markdown" ? toMarkdown(report) : toText(report);
  if (values.output) {
    writeFileSync(values.output, rendered);
    process.stderr.write(`${values.output} に書き出しました。\n`);
  } else {
    process.stdout.write(rendered);
  }
  return failOn && meetsSeverity(worstFinding(report), failOn as Severity) ? 1 : 0;
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error: unknown) => {
    if (error instanceof InputError || (error as { code?: string }).code?.startsWith("ERR_PARSE_ARGS")) {
      process.stderr.write(`エラー: ${(error as Error).message}\n`);
      process.exit(2);
    }
    process.stderr.write(`予期しないエラー: ${(error as Error).message}\n`);
    process.exit(3);
  },
);
