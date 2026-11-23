import type { DnsAnswer, MxRecord } from "../net/dns.js";
import type { CheckResult, Evidence } from "../types.js";
import { describeAnswer, evidence, isLookupError, receivesMail, result, sendsMail, type CheckContext } from "./context.js";

/** Published mail records for one host, fetched once and shared by the mail checks. */
export type MailObservation = {
  mx: DnsAnswer<MxRecord>;
  txt: DnsAnswer<string>;
  /** DMARC at _dmarc.<host>; and, when the host is a subdomain, at _dmarc.<organizational domain>. */
  dmarcHost: DnsAnswer<string>;
  dmarcOrg?: DnsAnswer<string>;
  dkim: { selector: string; name: string; txt: DnsAnswer<string> }[];
};

export async function observeMail(context: CheckContext): Promise<MailObservation> {
  const { host, organizationalDomain, dns } = context;
  const [mx, txt, dmarcHost, dmarcOrg, dkim] = await Promise.all([
    dns.mx(host),
    dns.txt(host),
    dns.txt(`_dmarc.${host}`),
    host === organizationalDomain ? Promise.resolve(undefined) : dns.txt(`_dmarc.${organizationalDomain}`),
    Promise.all(
      context.dkimSelectors.map(async (selector) => {
        const name = `${selector}._domainkey.${host}`;
        return { selector, name, txt: await dns.txt(name) };
      }),
    ),
  ]);
  return { mx, txt, dmarcHost, dmarcOrg, dkim };
}

/** Text that wraps a record in literal quotes (e.g. `"v=spf1 -all"`), a common copy-paste mistake. */
const QUOTED = /^\s*["“”']|["“”']\s*$/;
const stripQuotes = (value: string) => value.replace(/^\s*["“”']+|["“”']+\s*$/g, "");

/** Known sending services, recognised from SPF includes or DKIM CNAME-style names. */
const SENDERS: [RegExp, string][] = [
  [/amazonses\.com/i, "Amazon SES"],
  [/_spf\.google\.com/i, "Google Workspace"],
  [/spf\.protection\.outlook\.com/i, "Microsoft 365"],
  [/sendgrid\.net/i, "SendGrid"],
  [/mailgun\.org/i, "Mailgun"],
  [/spf\.mandrillapp\.com|mailchimp/i, "Mailchimp"],
  [/zoho\./i, "Zoho Mail"],
  [/_spf\.mx\.cloudflare\.net/i, "Cloudflare Email Routing"],
  [/spf\.messagingengine\.com/i, "Fastmail"],
];

const spfRecords = (txt: DnsAnswer<string>) => (txt.ok ? txt.records.filter((record) => /v=spf1\b/i.test(record)) : []);
const isNullMx = (record: MxRecord) => record.exchange === "" || record.exchange === ".";

export function checkMailContext(context: CheckContext, mail: MailObservation): CheckResult {
  const { host, mailUsage } = context;
  const signals: string[] = [];
  const items: Evidence[] = [];
  const allMx = mail.mx.ok ? mail.mx.records.filter((record) => !isNullMx(record)) : [];
  // An MX to SES's feedback endpoint receives bounces for a custom MAIL FROM domain: a sign of sending, not of a mailbox.
  const bounceMx = allMx.filter((record) => /^feedback-smtp\.[a-z0-9-]+\.amazonses\.com\.?$/i.test(record.exchange));
  const realMx = allMx.filter((record) => !bounceMx.includes(record));
  const nullMx = mail.mx.ok && mail.mx.records.some(isNullMx);
  if (bounceMx.length > 0) signals.push("送信: Amazon SES のカスタム MAIL FROM（バウンス受け取り用のMX）");
  if (realMx.length > 0) signals.push(`受信: MX ${realMx.map((record) => record.exchange).join(", ")}`);
  if (nullMx) signals.push("受信しない宣言: Null MX");
  for (const record of spfRecords(mail.txt)) {
    const value = stripQuotes(record);
    const senders = SENDERS.filter(([pattern]) => pattern.test(value)).map(([, name]) => name);
    if (/\s-all\b/i.test(value) && !/\s(include|a|mx|ip4|ip6|exists|redirect)[:=\s]/i.test(value)) signals.push("このホスト名をエンベロープ送信者にしない宣言: SPF -all のみ");
    else signals.push(`送信: SPF ${senders.length > 0 ? `(${senders.join("、")})` : "で送信元を指定"}`);
  }
  for (const dkim of mail.dkim) if (dkim.txt.ok) signals.push(`送信: DKIM ${dkim.selector}`);
  items.push(evidence(context, "推測に使ったシグナル", signals.length > 0 ? signals.join(" / ") : "なし"));

  const looksSending = signals.some((signal) => signal.startsWith("送信:"));
  const looksReceiving = realMx.length > 0;
  const declaresNone = signals.some((signal) => signal.includes("しない宣言"));
  const inferred = looksSending || looksReceiving
    ? `${looksSending ? "送信" : ""}${looksSending && looksReceiving ? "と" : ""}${looksReceiving ? "受信" : ""}に使っている可能性`
    : declaresNone
      ? `メールを使わない宣言が公開されています（${[nullMx ? "Null MX" : "", signals.some((signal) => signal.includes("SPF -all")) ? "SPF -all" : ""].filter(Boolean).join("、")}）`
      : "メール用途の手がかりなし";

  // SPF -all alone does not contradict sending: mail can use another MAIL FROM domain and pass DMARC
  // through DKIM (e.g. Amazon SES with a custom MAIL FROM). Only Null MX contradicts receiving.
  const conflict = (mailUsage === "none" && (looksSending || looksReceiving)) || (receivesMail(mailUsage) && nullMx);
  const spfOnlyNote =
    sendsMail(mailUsage) && !looksSending && signals.some((signal) => signal.includes("SPF -all"))
      ? `このホストのSPFは -all です。${host} をエンベロープ送信者（MAIL FROM）にしたメールはSPFで失敗しますが、送信サービスが別のサブドメインをMAIL FROMにし、DKIMで署名していれば問題ありません。送信サービスの設定（カスタム MAIL FROM、DKIM）を確認してください。`
      : undefined;

  const limitations = [
    `${host} 自身のレコードだけを見ています。メール送信にサブドメイン（例: SESのMAIL FROM用の mail.${host}）を使う構成では、そちらにMX・SPFがあります。`,
    "DKIMは、セレクタを指定した場合だけ確認しています。",
    "SPF -all は「このホスト名をエンベロープ送信者（MAIL FROM）にしたメールは正当でない」という意味です。差出人（ヘッダーFrom）にこのドメインを使い、別のMAIL FROMとDKIM署名で送る構成（Amazon SES など）では、SPF -all でも送信できます。",
  ];
  if (mailUsage === "unknown") {
    return result({
      id: "mail.context",
      title: "メールの用途",
      status: "review",
      severity: "info",
      summary: `メールの用途は指定されていません。公開レコードからの推測: ${inferred}。`,
      evidence: items,
      recommendations: [
        "メールの送受信の有無を --mail で指定すると、用途に合った確認・提案になります。用途が分からないうちは、Null MX・SPF -all・DMARC p=reject のような強い設定は提案しません。",
      ],
      limitations,
    });
  }
  return result({
    id: "mail.context",
    title: "メールの用途",
    status: conflict ? "review" : "pass",
    severity: conflict ? "medium" : "info",
    summary: conflict
      ? `指定された用途（${mailUsage}）と公開レコードが食い違っています（推測: ${inferred}）。`
      : `指定された用途（${mailUsage}）で点検します。公開レコードからの推測: ${inferred}。`,
    evidence: items,
    recommendations: conflict
      ? ["用途の指定と実際の運用のどちらが正しいか確認してください。食い違いを解消するまで、メール関連の設定変更は控えてください。"]
      : spfOnlyNote
        ? [spfOnlyNote]
        : [],
    limitations,
  });
}

export function checkMx(context: CheckContext, mail: MailObservation): CheckResult {
  const { host, mailUsage, dns } = context;
  const id = "mail.mx";
  const title = "MX（メールの受信先）";
  const items = [evidence(context, `DNS MX ${host} (${dns.source})`, describeAnswer(mail.mx, (record) => `${record.priority} ${record.exchange || "."}`))];
  if (isLookupError(mail.mx)) return result({ id, title, status: "error", summary: "MXを取得できませんでした。", evidence: items });

  if (mail.mx.ok) {
    const records = mail.mx.records;
    const malformed = records.filter((record) => /\s/.test(record.exchange) || /^\d+\s/.test(record.exchange));
    if (malformed.length > 0) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: `MXの値の書式が誤っています（${malformed.map((record) => `"${record.exchange}"`).join(", ")}）。優先度が値の中に入っている可能性があります。`,
        evidence: items,
        recommendations: ["MXは「優先度」と「メールサーバーのホスト名」を別々の欄に設定します。値には ホスト名だけを入れてください（例: 優先度 10、値 mail.example.net）。"],
        limitations: ["DNS事業者のCSVエクスポートなどでは優先度が表示されないことがあります。公開DNSの応答で確認してください。"],
      });
    }
    const hasNull = records.some(isNullMx);
    if (hasNull && records.length > 1) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: "Null MX（受信しない宣言）と通常のMXが同時に設定されています。",
        evidence: items,
        recommendations: ["Null MXは単独で使う決まりです（RFC 7505）。受信するなら Null MX を削除、受信しないなら他のMXを削除してください。"],
      });
    }
    if (hasNull) {
      const contradicts = receivesMail(mailUsage);
      return result({
        id,
        title,
        status: contradicts ? "finding" : "pass",
        severity: contradicts ? "high" : "info",
        summary: contradicts ? "Null MXが設定されていますが、用途はメールを受信する設定です。メールを受け取れません。" : "Null MX により、このホストでメールを受信しないことを宣言しています。",
        evidence: items,
        recommendations: contradicts ? ["受信するなら Null MX を削除し、メールサーバーのMXを設定してください。"] : [],
      });
    }
    const unexpected = mailUsage === "none" || mailUsage === "send-only";
    return result({
      id,
      title,
      status: unexpected ? "review" : "pass",
      severity: unexpected ? "low" : "info",
      summary: `MXが${records.length}件あります（${records.map((record) => record.exchange).join(", ")}）。`,
      evidence: items,
      recommendations: unexpected ? ["用途は受信しない設定ですが、MXがあります。不要なら削除を検討してください（迷惑メールの受け口になることがあります）。"] : [],
    });
  }

  if (receivesMail(mailUsage)) {
    return result({
      id,
      title,
      status: "finding",
      severity: "high",
      summary: "MXがありません。このホスト宛てのメールを確実に受信できません。",
      evidence: items,
      recommendations: ["メールサービスの案内に従ってMXを設定してください。"],
      limitations: ["MXがない場合、送信側はA/AAAAレコードへ配送を試みることがあります（暗黙のMX）。"],
    });
  }
  return result({
    id,
    title,
    status: mailUsage === "none" ? "review" : mailUsage === "send-only" ? "pass" : "review",
    severity: mailUsage === "send-only" ? "info" : "low",
    summary: "MXはありません。",
    evidence: items,
    recommendations:
      mailUsage === "none"
        ? ["このホストでメールを一切受信しないことが確かなら、Null MX（優先度 0、値 \".\"）で受信しないことを明示できます。"]
        : mailUsage === "unknown"
          ? ["受信するかどうかで対応が変わります。受信しないことが確かな場合に限り、Null MX を検討できます。"]
          : [],
    limitations: ["MXがない場合、送信側はA/AAAAレコードへ配送を試みることがあります（暗黙のMX）。"],
  });
}

export function checkSpf(context: CheckContext, mail: MailObservation): CheckResult {
  const { host, mailUsage, dns } = context;
  const id = "mail.spf";
  const title = "SPF";
  const items = [evidence(context, `DNS TXT ${host} (${dns.source})`, describeAnswer(mail.txt, (record) => JSON.stringify(record)))];
  if (isLookupError(mail.txt)) return result({ id, title, status: "error", summary: "TXTレコードを取得できませんでした。", evidence: items });
  const limitations = ["SPFの構文全体やDNS参照回数（上限10回）は検査していません。"];

  const records = spfRecords(mail.txt);
  if (records.length > 1) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `SPFレコードが${records.length}件あります。複数あるとSPFは失敗（permerror）扱いになります。`,
      evidence: items,
      recommendations: ["1件にまとめてください（include などの指定を1つのレコードに並べます）。"],
      limitations,
    });
  }
  const record = records[0];
  if (record !== undefined) {
    if (QUOTED.test(record) || !/^v=spf1\b/i.test(record.trim())) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: `SPFの値の書式が誤っています: ${JSON.stringify(record)}。値は "v=spf1" で始まる必要があり、余分な引用符があると無効になります。`,
        evidence: items,
        recommendations: [`値を ${stripQuotes(record)} に直してください（管理画面によっては引用符を自動で付けるため、入力に引用符を含めないでください）。`],
        limitations,
      });
    }
    const all = record.match(/\s([+\-~?]?)all\b/i);
    const qualifier = all ? all[1] || "+" : undefined;
    if (qualifier === "+") {
      return result({
        id,
        title,
        status: "finding",
        severity: "high",
        summary: "SPFが +all で終わっています。どのサーバーからの送信も正当と扱われます。",
        evidence: items,
        recommendations: ["送信元を include / ip4 などで指定し、末尾を ~all か -all にしてください。"],
        limitations,
      });
    }
    if (qualifier === undefined || qualifier === "?") {
      return result({
        id,
        title,
        status: "review",
        severity: "low",
        summary: qualifier === "?" ? "SPFが ?all（中立）で終わっています。" : "SPFに all の指定がありません。",
        evidence: items,
        recommendations: ["送信元をすべて列挙できているなら、末尾を ~all または -all にすることを検討してください。"],
        limitations,
      });
    }
    return result({
      id,
      title,
      status: "pass",
      severity: "info",
      summary: `SPFが設定されています（末尾 ${qualifier}all）。`,
      evidence: items,
      limitations,
    });
  }

  if (sendsMail(mailUsage)) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: "メールを送信する用途ですが、このホストにSPFがありません。",
      evidence: items,
      recommendations: [
        `送信に使うサービスの案内に従ってSPFを設定してください。エンベロープ送信者（MAIL FROM）に別のサブドメインを使うサービス（Amazon SESのカスタムMAIL FROMなど）では、そのサブドメイン側にSPFが必要です。`,
      ],
      limitations,
    });
  }
  return result({
    id,
    title,
    status: "review",
    severity: "low",
    summary: "SPFはありません。",
    evidence: items,
    recommendations:
      mailUsage === "none" || mailUsage === "receive-only"
        ? ["このホストからメールを送信しないことが確かなら、v=spf1 -all で「送信しない」ことを明示し、なりすましを防げます。"]
        : ["送信するかどうかで対応が変わります。送信しないことが確かな場合に限り v=spf1 -all を検討できます。"],
    limitations,
  });
}

type DmarcTags = Record<string, string>;

function parseDmarc(record: string): DmarcTags {
  const tags: DmarcTags = {};
  for (const part of record.split(";")) {
    const [key, ...rest] = part.split("=");
    if (key && rest.length > 0) tags[key.trim().toLowerCase()] = rest.join("=").trim().toLowerCase();
  }
  return tags;
}

export function checkDmarc(context: CheckContext, mail: MailObservation): CheckResult {
  const { host, organizationalDomain, mailUsage, dns } = context;
  const id = "mail.dmarc";
  const title = "DMARC";
  const items = [evidence(context, `DNS TXT _dmarc.${host} (${dns.source})`, describeAnswer(mail.dmarcHost, (record) => JSON.stringify(record)))];
  if (mail.dmarcOrg) items.push(evidence(context, `DNS TXT _dmarc.${organizationalDomain} (${dns.source})`, describeAnswer(mail.dmarcOrg, (record) => JSON.stringify(record))));
  const limitations = ["公開レコードだけを見ています。実際のメールがSPF・DKIMのアライメントを満たすかは、送信したメールのヘッダーで確認する必要があります。"];

  for (const answer of [mail.dmarcHost, mail.dmarcOrg]) {
    if (answer && isLookupError(answer)) return result({ id, title, status: "error", summary: "DMARCレコードを取得できませんでした。", evidence: items });
  }
  const candidates = (answer: DnsAnswer<string> | undefined) => (answer?.ok ? answer.records.filter((record) => /v\s*=\s*dmarc1/i.test(record)) : []);
  const own = candidates(mail.dmarcHost);
  const inherited = own.length === 0 ? candidates(mail.dmarcOrg) : [];
  const records = own.length > 0 ? own : inherited;
  const where = own.length > 0 ? `_dmarc.${host}` : `_dmarc.${organizationalDomain}`;

  if (records.length === 0) {
    const strong = mailUsage === "none";
    return result({
      id,
      title,
      status: sendsMail(mailUsage) ? "finding" : "review",
      severity: sendsMail(mailUsage) ? "medium" : "low",
      summary: `DMARCレコードがありません（_dmarc.${host}${mail.dmarcOrg ? ` と _dmarc.${organizationalDomain}` : ""}）。`,
      evidence: items,
      recommendations: strong
        ? ["メールを一切送信しないことが確かなら、v=DMARC1; p=reject; で、このドメインを名乗るメールを拒否するよう受信側に求められます。"]
        : sendsMail(mailUsage)
          ? ["まず v=DMARC1; p=none; rua=mailto:（集計レポートの受け取り先）で状況を把握し、正規のメールがSPFかDKIMのアライメントを満たすことを確認してから、quarantine → reject と段階的に強めてください。"]
          : ["送信の有無で適切な設定が変わります。送信しないことが確かな場合に限り p=reject を検討できます。"],
      limitations,
    });
  }
  if (records.length > 1) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `${where} にDMARCレコードが${records.length}件あります。複数あるとDMARCは適用されません。`,
      evidence: items,
      recommendations: ["1件にまとめてください。"],
      limitations,
    });
  }
  const record = records[0]!;
  if (QUOTED.test(record) || !/^v=DMARC1\s*(;|$)/.test(record.trim())) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `${where} のDMARCの書式が誤っています: ${JSON.stringify(record)}。"v=DMARC1" で始まる必要があり、余分な引用符があると受信側に無視されます。`,
      evidence: items,
      recommendations: [`値を ${stripQuotes(record).replace(/^v\s*=\s*dmarc1/i, "v=DMARC1")} に直してください（入力に引用符を含めないでください）。`],
      limitations,
    });
  }
  const tags = parseDmarc(record);
  // A subdomain without its own record falls under the organizational record's sp= (or p=).
  const policy = inherited.length > 0 ? (tags.sp ?? tags.p) : tags.p;
  const inheritedNote = inherited.length > 0 ? `（${host} には独自のレコードがなく、${organizationalDomain} の${tags.sp ? " sp=" : "ポリシー"}が適用されます）` : "";
  if (!policy || !["none", "quarantine", "reject"].includes(policy)) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `DMARCのポリシー（p=）が${policy ? `不正です（${policy}）` : "ありません"}。${inheritedNote}`,
      evidence: items,
      recommendations: ["p=none / quarantine / reject のいずれかを指定してください。"],
      limitations,
    });
  }
  if (policy === "none") {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: `DMARCは p=none（監視のみ）です${inheritedNote}。なりすましメールは拒否されません。`,
      evidence: items,
      recommendations: [
        mailUsage === "none"
          ? "メールを送信しないことが確かなら、p=reject に強められます。"
          : "正規のメールがSPFかDKIMのアライメントを満たすことを（集計レポートやテスト送信で）確認できたら、quarantine → reject と段階的に強めることを検討してください。",
      ],
      limitations,
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `DMARCは p=${policy} です${inheritedNote}。`,
    evidence: items,
    limitations,
  });
}

export function checkDkim(context: CheckContext, mail: MailObservation): CheckResult {
  const id = "mail.dkim";
  const title = "DKIM";
  if (mail.dkim.length === 0) {
    return result({
      id,
      title,
      status: "not_checked",
      notApplicable: context.mailUsage === "none",
      summary: context.mailUsage === "none" ? "メールを使わない設定のため対象外です。" : "DKIMセレクタが指定されていないため、確認していません。",
      limitations: ["DKIMの公開鍵はセレクタ名が分からないと取得できません。送信サービスの管理画面や、受信したメールの DKIM-Signature ヘッダー（s=）で確認し、--dkim-selector で指定してください。"],
    });
  }
  const items = mail.dkim.map((entry) => evidence(context, `DNS TXT ${entry.name} (${context.dns.source})`, describeAnswer(entry.txt, (record) => (record.length > 80 ? `${record.slice(0, 80)}…` : record))));
  if (mail.dkim.some((entry) => isLookupError(entry.txt))) return result({ id, title, status: "error", summary: "DKIMレコードを取得できませんでした。", evidence: items });
  const missing = mail.dkim.filter((entry) => !entry.txt.ok || !entry.txt.records.some((record) => /(^|;)\s*p=/i.test(record)));
  const revoked = mail.dkim.filter((entry) => entry.txt.ok && entry.txt.records.some((record) => /(^|;)\s*p=\s*(;|$)/i.test(record)));
  if (missing.length > 0) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `指定したセレクタのDKIM公開鍵が見つかりません: ${missing.map((entry) => entry.selector).join(", ")}。`,
      evidence: items,
      recommendations: ["セレクタ名が正しいか、送信サービスが案内するDKIMレコード（CNAMEまたはTXT）がDNSに登録されているか確認してください。"],
    });
  }
  if (revoked.length > 0) {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: `公開鍵が空（失効）のセレクタがあります: ${revoked.map((entry) => entry.selector).join(", ")}。`,
      evidence: items,
      recommendations: ["使わなくなった鍵なら問題ありません。使っている場合は送信サービスで鍵を確認してください。"],
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `指定したセレクタ（${mail.dkim.map((entry) => entry.selector).join(", ")}）のDKIM公開鍵が公開されています。`,
    evidence: items,
    limitations: ["鍵が公開されていることだけを確認しています。署名が実際に検証に通るかは、送信したメールで確認してください。"],
  });
}

/**
 * Warns before a migration when mail and the website share a server: moving the site (changing the
 * A record) or cancelling the hosting contract would then stop mail too. Compares the IPs of the
 * MX hosts with the IPs of the checked host and of the organizational domain.
 */
export async function checkSharedHost(context: CheckContext, mail: MailObservation): Promise<CheckResult> {
  const { host, organizationalDomain, dns } = context;
  const id = "mail.shared-host";
  const title = "メールとWebサイトのサーバーの同居";
  const exchanges = mail.mx.ok ? mail.mx.records.filter((record) => !isNullMx(record) && !/\s/.test(record.exchange)).map((record) => record.exchange.replace(/\.$/, "").toLowerCase()) : [];
  if (exchanges.length === 0) {
    return result({ id, title, status: "not_checked", notApplicable: true, summary: "このホストにはメールの受け取り先（MX）がないため対象外です。" });
  }
  const webNames = [...new Set([host, organizationalDomain])];
  const addressesOf = async (name: string) => {
    const [a, aaaa] = await Promise.all([dns.a(name), dns.aaaa(name)]);
    return { name, failed: isLookupError(a) && isLookupError(aaaa), addresses: [...(a.ok ? a.records : []), ...(aaaa.ok ? aaaa.records : [])] };
  };
  const [mxHosts, webHosts] = await Promise.all([Promise.all(exchanges.slice(0, 5).map(addressesOf)), Promise.all(webNames.map(addressesOf))]);
  const items = [
    ...mxHosts.map((entry) => evidence(context, `DNS A/AAAA ${entry.name}（MX の行き先）(${dns.source})`, entry.addresses.join(", ") || "アドレスなし")),
    ...webHosts.map((entry) => evidence(context, `DNS A/AAAA ${entry.name}（Webサイト）(${dns.source})`, entry.addresses.join(", ") || "アドレスなし")),
  ];
  if (mxHosts.some((entry) => entry.failed)) return result({ id, title, status: "error", summary: "MX の行き先の住所を取得できませんでした。", evidence: items });

  const webAddresses = new Set(webHosts.flatMap((entry) => entry.addresses));
  const shared = mxHosts.filter((entry) => webNames.includes(entry.name) || entry.addresses.some((address) => webAddresses.has(address)));
  if (shared.length === 0) {
    return result({
      id,
      title,
      status: "pass",
      severity: "info",
      summary: "メールの受け取り先は、Webサイトとは別のサーバーです。サイトを移しても、MX を変えなければメールの受け取りには影響しません。",
      evidence: items,
      limitations: ["IP アドレスの一致だけで判定しています。別の IP でも同じ事業者の契約に含まれている場合（契約を解約するとメールも止まる場合）は判定できません。"],
    });
  }
  return result({
    id,
    title,
    status: "review",
    severity: "medium",
    summary: `メールの受け取り先（${shared.map((entry) => entry.name).join(", ")}）が、Webサイトと同じサーバーを指しています。サイトを移す・サーバーを解約すると、メールも止まるおそれがあります。`,
    evidence: items,
    recommendations: [
      "サイトの移行やサーバーの解約の前に、メールをどこで受け取り続けるか決めてください。今のサーバーでメールだけ使い続けるか、メールサービス（Google Workspace、Microsoft 365 など）へ移すかで、手順が変わります。",
      `MX の値がサイトと同じ名前（例: ${organizationalDomain}）になっている場合、サイトのために A レコードを変えると、メールの行き先も一緒に変わります。先に MX を、今のメールサーバー専用の名前（例: mail.${organizationalDomain}）に向け直しておくと安全です。`,
      "切り替えた後は、外部のアドレスから自分宛てにメールを送り、届くことを確かめてください。",
    ],
    limitations: ["同じサーバーでも、メールだけを残せる契約や構成もあります。移行してよいかは、契約内容とメールの使い方によります。"],
  });
}
