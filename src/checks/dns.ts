import type { Certificate, WebError } from "../net/web.js";
import type { CheckResult } from "../types.js";
import { describeAnswer, evidence, isLookupError, result, type CheckContext } from "./context.js";

/** Name-server suffixes of common DNS hosts, only to explain where the zone is served from. */
const DNS_HOSTS: [string, string][] = [
  [".ns.cloudflare.com", "Cloudflare"],
  [".nsone.net", "NS1（Netlify DNS など）"],
  [".awsdns-", "Amazon Route 53"],
  [".googledomains.com", "Google"],
  [".domaincontrol.com", "GoDaddy"],
  [".vercel-dns.com", "Vercel"],
  [".dns-onamae.com", "お名前.com"],
  [".value-domain.com", "VALUE-DOMAIN"],
  [".azure-dns.", "Azure DNS"],
];

/** Hosting platforms whose CNAME targets are worth naming when they dangle. */
const PLATFORMS: [string, string][] = [
  [".pages.dev", "Cloudflare Pages"],
  [".workers.dev", "Cloudflare Workers"],
  [".netlify.app", "Netlify"],
  [".vercel-dns.com", "Vercel"],
  [".vercel.app", "Vercel"],
  [".github.io", "GitHub Pages"],
  [".herokudns.com", "Heroku"],
  [".azurewebsites.net", "Azure App Service"],
  [".cloudfront.net", "Amazon CloudFront"],
  [".s3-website", "Amazon S3"],
];

/** CA domains (CAA issuer names) by the certificate issuer organisation that uses them. */
const CA_BY_ISSUER: [RegExp, string[]][] = [
  [/let's encrypt/i, ["letsencrypt.org"]],
  [/google trust services/i, ["pki.goog"]],
  [/digicert/i, ["digicert.com"]],
  [/sectigo|comodo/i, ["sectigo.com", "comodoca.com"]],
  [/amazon/i, ["amazon.com", "amazontrust.com", "awstrust.com", "amazonaws.com"]],
  [/globalsign/i, ["globalsign.com"]],
  [/ssl\.com/i, ["ssl.com"]],
  [/zerossl/i, ["sectigo.com"]],
];

const matchSuffix = (name: string, table: [string, string][]) => table.find(([suffix]) => name.toLowerCase().includes(suffix))?.[1];

export async function checkAddress(context: CheckContext): Promise<CheckResult> {
  const { host, dns } = context;
  const [a, aaaa, cname] = await Promise.all([dns.a(host), dns.aaaa(host), dns.cname(host)]);
  const items = [
    evidence(context, `DNS CNAME ${host} (${dns.source})`, describeAnswer(cname)),
    evidence(context, `DNS A ${host} (${dns.source})`, describeAnswer(a)),
    evidence(context, `DNS AAAA ${host} (${dns.source})`, describeAnswer(aaaa)),
  ];
  const title = "名前解決（A / AAAA / CNAME）";
  if (a.ok || aaaa.ok) {
    return result({
      id: "dns.address",
      title,
      status: "pass",
      severity: "info",
      summary: `${host} は${cname.ok ? ` CNAME ${cname.records[0]} を経由して` : ""}アドレスに解決されます。`,
      evidence: items,
      limitations: ["再帰リゾルバのキャッシュの影響を受けます。権威DNSの現在値とは異なる場合があります。"],
    });
  }
  if ([a, aaaa].some(isLookupError)) {
    return result({ id: "dns.address", title, status: "error", summary: "名前解決に失敗しました。", evidence: items });
  }
  const missing = !a.ok && a.failure === "NXDOMAIN";
  return result({
    id: "dns.address",
    title,
    status: "review",
    severity: "low",
    summary: missing ? `${host} という名前はDNSに存在しません。` : `${host} にはアドレス（A / AAAA）がありません。`,
    evidence: items,
    recommendations: ["Webサイトとして使うホストなら、DNSレコードの設定を確認してください。メール専用などWebで使わない名前なら問題ありません。"],
  });
}

export async function checkDanglingCname(context: CheckContext): Promise<CheckResult> {
  const { host, dns } = context;
  const id = "dns.dangling-cname";
  const title = "CNAMEの参照先";
  const cname = await dns.cname(host);
  if (!cname.ok) {
    return result({
      id,
      title,
      status: isLookupError(cname) ? "error" : "not_checked",
      notApplicable: !isLookupError(cname),
      summary: isLookupError(cname) ? "CNAMEの取得に失敗しました。" : "CNAMEがないため対象外です。",
      evidence: [evidence(context, `DNS CNAME ${host} (${dns.source})`, describeAnswer(cname))],
    });
  }
  const target = cname.records[0]!.replace(/\.$/, "");
  const [a, aaaa] = await Promise.all([dns.a(target), dns.aaaa(target)]);
  const items = [
    evidence(context, `DNS CNAME ${host} (${dns.source})`, target),
    evidence(context, `DNS A/AAAA ${target} (${dns.source})`, `${describeAnswer(a)} / ${describeAnswer(aaaa)}`),
  ];
  const platform = matchSuffix(target, PLATFORMS);
  if (a.ok || aaaa.ok) {
    return result({ id, title, status: "pass", severity: "info", summary: `参照先 ${target} はアドレスに解決されます。`, evidence: items });
  }
  if ([a, aaaa].some(isLookupError)) {
    return result({ id, title, status: "error", summary: `参照先 ${target} の名前解決に失敗しました。`, evidence: items });
  }
  const nxdomain = !a.ok && a.failure === "NXDOMAIN";
  return result({
    id,
    title,
    status: nxdomain ? "finding" : "review",
    severity: nxdomain ? "high" : "medium",
    summary: nxdomain
      ? `CNAMEの参照先 ${target} が存在しません${platform ? `（${platform}）` : ""}。削除済みのサービスを指している可能性があります。`
      : `CNAMEの参照先 ${target} にアドレスがありません。`,
    evidence: items,
    recommendations: [
      `${host} を使っていないなら、CNAMEレコードの削除を検討してください。参照先の名前を第三者が取得すると、このサブドメインで任意の内容を配信される（サブドメイン乗っ取り）おそれがあります。`,
      "使っているなら、参照先のサービス側でプロジェクトやカスタムドメインの設定が残っているか確認してください。",
    ],
    limitations: ["参照先が一時的に解決できないだけの場合もあります。時間をおいて再確認してください。"],
  });
}

export async function checkNameServers(context: CheckContext): Promise<CheckResult> {
  const { organizationalDomain: domain, dns } = context;
  const ns = await dns.ns(domain);
  const item = evidence(context, `DNS NS ${domain} (${dns.source})`, describeAnswer(ns));
  if (!ns.ok) {
    return result({ id: "dns.ns", title: "ネームサーバー", status: "error", summary: `${domain} のNSを取得できませんでした。`, evidence: [item] });
  }
  const operators = [...new Set(ns.records.map((name) => matchSuffix(name, DNS_HOSTS) ?? "不明"))];
  const mixed = operators.length > 1;
  return result({
    id: "dns.ns",
    title: "ネームサーバー",
    status: mixed ? "review" : "pass",
    severity: mixed ? "low" : "info",
    summary: `${domain} のDNSは ${operators.join("、")} で提供されています（NS ${ns.records.length}件）。`,
    evidence: [item],
    recommendations: mixed ? ["NSが複数の事業者に分かれています。意図した構成か、移行途中の状態でないか確認してください。"] : [],
    limitations: [
      "再帰リゾルバから見たNSです。レジストリに登録された委任先（親ゾーンのNS）との一致は確認していません。",
      "DNS移行の直後は、TLDのNSのキャッシュ（最長1日程度）により、利用者ごとに異なるDNSが使われることがあります。",
    ],
  });
}

/**
 * CAA is looked up from the host upward to the organizational domain; the first set found applies
 * (RFC 8659, without following CNAMEs). The observed certificate issuer is compared with it.
 */
export async function checkCaa(context: CheckContext, certificate: Certificate | WebError | undefined): Promise<CheckResult> {
  const { host, organizationalDomain, dns } = context;
  const id = "dns.caa";
  const title = "CAA（証明書を発行できるCA）";
  const names: string[] = [];
  for (let name = host; ; name = name.slice(name.indexOf(".") + 1)) {
    names.push(name);
    if (name === organizationalDomain || !name.includes(".")) break;
  }
  const items = [];
  for (const name of names) {
    const caa = await dns.caa(name);
    items.push(evidence(context, `DNS CAA ${name} (${dns.source})`, describeAnswer(caa, (record) => `${record.critical} ${record.tag} "${record.value}"`)));
    if (isLookupError(caa)) return result({ id, title, status: "error", summary: `${name} のCAAを取得できませんでした。`, evidence: items });
    if (!caa.ok) continue;

    const issuers = caa.records
      .filter((record) => record.tag === "issue" || record.tag === "issuewild")
      .map((record) => record.value.split(";")[0]!.trim().toLowerCase())
      .filter(Boolean);
    const forbidsAll = caa.records.some((record) => record.tag === "issue" && record.value.trim() === ";") && issuers.length === 0;
    const organization = certificate?.ok ? certificate.issuerOrganization : "";
    const expected = CA_BY_ISSUER.find(([pattern]) => pattern.test(organization))?.[1];
    if (forbidsAll) {
      return result({
        id,
        title,
        status: "review",
        severity: "medium",
        summary: `${name} のCAAは、どのCAにも証明書の発行を許可していません。`,
        evidence: items,
        recommendations: ["HTTPSで使うホストなら、証明書の更新ができなくなります。意図した設定か確認してください。"],
      });
    }
    if (expected && !expected.some((domain) => issuers.includes(domain))) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: `現在の証明書の発行者（${organization}）が、${name} のCAAで許可されていません。次回の証明書更新に失敗するおそれがあります。`,
        evidence: items,
        recommendations: [
          `CAAに ${expected[0]} を追加するか、許可されたCAで証明書を発行するよう設定してください。CDN（Cloudflare等）が証明書を発行する場合、そのCDNが使うCAすべてを許可する必要があります。`,
        ],
        limitations: ["発行者名からCAのドメインを推定しています。中間CAの名前によっては判定できません。"],
      });
    }
    return result({
      id,
      title,
      status: "pass",
      severity: "info",
      summary: `${name} のCAAで発行できるCAが制限されています（${[...new Set(issuers)].join("、")}）。${expected ? "現在の証明書の発行者も許可されています。" : ""}`,
      evidence: items,
      limitations: expected ? [] : ["現在の証明書の発行者とCAAの対応は確認できませんでした。"],
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: "CAAはありません。どのCAでも証明書を発行できる状態です（多くのサイトと同じ既定の状態）。",
    evidence: items,
    recommendations: ["必須ではありません。使うCAを限定したい場合にCAAを検討できます。CDNを使う場合はCDNが使うCAも許可が必要です。"],
  });
}

export function checkDnssec(context: CheckContext): CheckResult {
  return result({
    id: "dns.dnssec",
    title: "DNSSEC",
    status: "not_checked",
    summary: "このバージョンではDNSSECを検査していません。",
    evidence: [],
    limitations: [
      `Node.jsの標準DNS APIはDSレコードと検証結果（ADフラグ）を返さないため、${context.organizationalDomain} のDNSSECの状態は判定していません。`,
      "DNSSECの有効化はレジストラ側でのDSレコード登録が必要で、レジストラによっては有料です。未設定であることだけで問題とはみなしません。",
    ],
  });
}
