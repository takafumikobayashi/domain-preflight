import type { Certificate, WebError, WebResponse } from "../net/web.js";
import type { CheckResult, Evidence } from "../types.js";
import { evidence, result, type CheckContext } from "./context.js";

const MAX_REDIRECTS = 5;
const DAY = 86_400_000;

export type Hop = { url: string; response: WebResponse | WebError };

/** Web facts for one host, fetched once and shared by the web checks. */
export type WebObservation = {
  /** http://<host>/ and the redirects that follow it. */
  fromHttp: Hop[];
  /** https://<host>/ itself (not followed), which is where HSTS and other headers are read. */
  https: WebResponse | WebError;
  certificate: Certificate | WebError;
};

async function follow(context: CheckContext, start: URL): Promise<Hop[]> {
  const hops: Hop[] = [];
  let url = start;
  for (let step = 0; step <= MAX_REDIRECTS; step += 1) {
    const response = await context.web.get(url);
    hops.push({ url: url.href, response });
    if (!response.ok || response.status < 300 || response.status >= 400 || !response.headers.location) break;
    let next: URL;
    try {
      next = new URL(response.headers.location, url);
    } catch {
      break;
    }
    if (next.protocol !== "http:" && next.protocol !== "https:") break;
    url = next;
  }
  return hops;
}

export async function observeWeb(context: CheckContext): Promise<WebObservation> {
  const [fromHttp, https, certificate] = await Promise.all([
    follow(context, new URL(`http://${context.host}/`)),
    context.web.get(new URL(`https://${context.host}/`)),
    context.web.certificate(context.host),
  ]);
  return { fromHttp, https, certificate };
}

const describeHop = (hop: Hop) =>
  hop.response.ok
    ? `${hop.response.status}${hop.response.headers.location ? ` → ${hop.response.headers.location}` : ""}`
    : `接続失敗 (${hop.response.failure}: ${hop.response.message})`;

/** True when every failure is "this name has no address", i.e. the host simply is not a website. */
const noWebsite = (web: WebObservation) => !web.https.ok && web.https.failure === "dns";

export function checkHttps(context: CheckContext, web: WebObservation): CheckResult {
  const { host } = context;
  const id = "web.https";
  const title = "HTTPS と HTTP からの転送";
  const items: Evidence[] = [
    ...web.fromHttp.map((hop) => evidence(context, `HTTP GET ${hop.url}`, describeHop(hop))),
    evidence(context, `HTTPS GET https://${host}/`, describeHop({ url: `https://${host}/`, response: web.https })),
  ];
  if (noWebsite(web)) {
    return result({ id, title, status: "not_checked", notApplicable: true, summary: `${host} はアドレスに解決されないため、Webの点検は対象外です。`, evidence: items });
  }
  if (!web.https.ok) {
    if (web.https.failure === "blocked-address") {
      return result({ id, title, status: "not_checked", summary: "公開されていないアドレスに解決されたため、接続していません。", evidence: items });
    }
    return result({
      id,
      title,
      status: web.https.failure === "timeout" || web.https.failure === "other" ? "error" : "finding",
      severity: "high",
      summary: `https://${host}/ に接続できません（${web.https.failure}）。`,
      evidence: items,
      recommendations: ["Webサイトとして使うホストなら、HTTPS（443番）で応答するよう、ホスティングやCDNの設定を確認してください。"],
      limitations: ["点検した端末のネットワークから見た結果です。"],
    });
  }

  const first = web.fromHttp[0];
  const last = web.fromHttp[web.fromHttp.length - 1];
  const redirectsToHttps = web.fromHttp.length > 1 && last !== undefined && new URL(last.url).protocol === "https:";
  const tooMany = web.fromHttp.length > MAX_REDIRECTS && last?.response.ok && last.response.status >= 300 && last.response.status < 400;
  const httpServes = first?.response.ok && first.response.status >= 200 && first.response.status < 300;
  const limitations = ["トップページ（/）だけを確認しています。"];

  if (tooMany) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `http://${host}/ からのリダイレクトが${MAX_REDIRECTS}回を超えました。転送がループしている可能性があります。`,
      evidence: items,
      recommendations: ["CDNのSSL設定（例: Cloudflareの Flexible とオリジン側のHTTPS転送の組み合わせ）や、ホスティング側の転送設定を確認してください。"],
      limitations,
    });
  }
  if (httpServes || (first?.response.ok && !redirectsToHttps)) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `https://${host}/ は応答しますが、http:// でのアクセスがHTTPSへ転送されていません。`,
      evidence: items,
      recommendations: ["HTTPのアクセスをHTTPSへ301で転送する設定を有効にしてください（多くのホスティング・CDNに設定項目があります）。"],
      limitations,
    });
  }
  const serverError = web.https.status >= 500;
  return result({
    id,
    title,
    status: serverError ? "review" : "pass",
    severity: serverError ? "medium" : "info",
    summary: `https://${host}/ は ${web.https.status} を返し、${first?.response.ok ? "http:// からはHTTPSへ転送されます" : "http:// は応答しません（HTTPSのみ）"}。`,
    evidence: items,
    recommendations: serverError ? ["サーバーエラーが返っています。一時的な障害でないか確認してください。"] : [],
    limitations,
  });
}

export function checkCertificate(context: CheckContext, web: WebObservation): CheckResult {
  const { host } = context;
  const id = "web.certificate";
  const title = "TLS証明書";
  const cert = web.certificate;
  if (!cert.ok) {
    if (cert.failure === "dns" || cert.failure === "blocked-address") {
      return result({ id, title, status: "not_checked", notApplicable: cert.failure === "dns", summary: cert.failure === "dns" ? `${host} はアドレスに解決されないため、Webの点検は対象外です。` : "HTTPSで接続できる状態でないため、証明書は確認していません。", evidence: [evidence(context, `TLS ${host}:443`, cert.message)] });
    }
    return result({ id, title, status: "error", summary: `TLS接続に失敗しました（${cert.failure}）。`, evidence: [evidence(context, `TLS ${host}:443`, cert.message)] });
  }
  const daysLeft = Math.floor((Date.parse(cert.validTo) - context.now().getTime()) / DAY);
  const items = [
    evidence(context, `TLS ${host}:443`, `発行者: ${cert.issuer} / 有効期限: ${cert.validTo}（残り${daysLeft}日） / SAN: ${cert.subjectAltNames.join(", ")} / ${cert.protocol}`),
    evidence(context, `TLS ${host}:443`, `検証: ${cert.authorized ? "成功" : `失敗 (${cert.authorizationError})`}`),
  ];
  const limitations = ["点検した端末の信頼ストアで検証しています。対応している最低TLSバージョンは確認していません。"];
  if (!cert.authorized) {
    const code = cert.authorizationError ?? "";
    const reason = /EXPIRED/.test(code)
      ? "証明書の有効期限が切れています"
      : /SELF_SIGNED/.test(code)
        ? "自己署名の証明書です"
        : /ALTNAME|HOSTNAME|IP_ADDRESS/.test(code)
          ? `証明書が ${host} に対して発行されていません（名前の不一致）`
          : /UNABLE_TO_GET_ISSUER|UNABLE_TO_VERIFY_LEAF/.test(code)
            ? "中間証明書が不足している可能性があります"
            : `証明書を検証できません（${code}）`;
    return result({
      id,
      title,
      status: "finding",
      severity: "high",
      summary: `${reason}。ブラウザで警告が表示されます。`,
      evidence: items,
      recommendations: ["ホスティングやCDNで、このホスト名の証明書が発行・設定されているか確認してください。"],
      limitations,
    });
  }
  if (daysLeft < 14) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `証明書の有効期限まで残り${daysLeft}日です。`,
      evidence: items,
      recommendations: ["自動更新が止まっていないか確認してください（DNSやCAAの変更で更新に失敗することがあります）。"],
      limitations,
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `証明書は有効です（${cert.issuerOrganization}、残り${daysLeft}日）。`,
    evidence: items,
    limitations: [...limitations, "自動更新される証明書（Let's Encrypt など）は、残り日数が少なく見えても通常は問題ありません。"],
  });
}

type Hsts = { maxAge?: number; includeSubDomains: boolean; preload: boolean };

function parseHsts(value: string): Hsts {
  const parts = value.split(";").map((part) => part.trim().toLowerCase());
  const maxAge = parts.find((part) => part.startsWith("max-age="));
  const seconds = maxAge ? Number(maxAge.slice(8).replace(/"/g, "")) : undefined;
  return { maxAge: Number.isFinite(seconds) ? seconds : undefined, includeSubDomains: parts.includes("includesubdomains"), preload: parts.includes("preload") };
}

export function checkHsts(context: CheckContext, web: WebObservation): CheckResult {
  const { host } = context;
  const id = "web.hsts";
  const title = "HSTS";
  if (!web.https.ok) {
    return noWebsite(web)
      ? result({ id, title, status: "not_checked", notApplicable: true, summary: `${host} はアドレスに解決されないため、Webの点検は対象外です。` })
      : result({ id, title, status: "not_checked", summary: "HTTPSの応答が得られないため、確認していません。" });
  }
  const value = web.https.headers["strict-transport-security"];
  const items = [evidence(context, `HTTPS GET https://${host}/ のヘッダー`, value ? `Strict-Transport-Security: ${value}` : "Strict-Transport-Security なし")];
  const limitations = ["HTTPSのトップページの応答だけを見ています。CDNのゾーン設定とサイト側のヘッダーのどちらが付けているかは区別していません。"];
  if (!value) {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: "HSTSは設定されていません。",
      evidence: items,
      recommendations: [
        "このホストがHTTPSで安定して動いているなら、HSTSで「常にHTTPSで接続する」ようブラウザに指示できます。最初は max-age=86400（1日）など短い値で始め、問題がなければ延ばしてください。includeSubDomains と preload は、全サブドメインがHTTPSに対応していることを確認してから検討してください。",
      ],
      limitations,
    });
  }
  const hsts = parseHsts(value);
  if (hsts.maxAge === undefined) {
    return result({ id, title, status: "finding", severity: "medium", summary: "HSTSに有効な max-age がありません。ブラウザに無視されます。", evidence: items, recommendations: ["max-age=86400 のように秒数を指定してください。"], limitations });
  }
  if (hsts.maxAge === 0) {
    return result({ id, title, status: "review", severity: "low", summary: "HSTSは max-age=0 で、ブラウザに記憶されたHSTSを解除する設定です。", evidence: items, limitations });
  }
  const notes = [];
  if (hsts.includeSubDomains) notes.push("includeSubDomains が付いています。すべてのサブドメインがHTTPSで応答する必要があります。");
  if (hsts.preload) notes.push("preload が付いています。ブラウザに組み込まれると、取り消しに時間がかかります。");
  if (hsts.maxAge < 86_400) notes.push("max-age が1日未満です。動作確認中でなければ、延ばすことを検討できます。");
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `HSTSが設定されています（max-age=${hsts.maxAge}${hsts.includeSubDomains ? "、includeSubDomains" : ""}${hsts.preload ? "、preload" : ""}）。`,
    evidence: items,
    recommendations: notes,
    limitations,
  });
}

export function checkHeaders(context: CheckContext, web: WebObservation): CheckResult {
  const { host } = context;
  const id = "web.headers";
  const title = "セキュリティ関連ヘッダー";
  if (!web.https.ok) {
    return noWebsite(web)
      ? result({ id, title, status: "not_checked", notApplicable: true, summary: `${host} はアドレスに解決されないため、Webの点検は対象外です。` })
      : result({ id, title, status: "not_checked", summary: "HTTPSの応答が得られないため、確認していません。" });
  }
  const headers = web.https.headers;
  const watched = ["x-content-type-options", "content-security-policy", "x-frame-options", "referrer-policy", "permissions-policy", "server", "cf-ray"];
  const items = [evidence(context, `HTTPS GET https://${host}/ のヘッダー`, watched.map((name) => `${name}: ${headers[name] ?? "(なし)"}`).join(" / "))];
  const nosniff = headers["x-content-type-options"]?.toLowerCase().includes("nosniff");
  const limitations = [
    "ヘッダーの有無と値だけを見ています。CSPなどの内容がサイトに適切かは、サイトの作りによって変わるため判定していません。",
    "トップページの応答だけを見ています。",
  ];
  const notes = [];
  if (!headers["content-security-policy"]) notes.push("Content-Security-Policy はありません。必須ではありませんが、外部スクリプトを読み込むサイトでは、読み込み元を限定する手段として検討できます。");
  if (!nosniff) {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: "X-Content-Type-Options: nosniff がありません。",
      evidence: items,
      recommendations: ["X-Content-Type-Options: nosniff を付けると、ブラウザがファイルの種類を推測して実行することを防げます。多くのサイトで副作用なく付けられます。", ...notes],
      limitations,
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: "X-Content-Type-Options: nosniff が設定されています。",
    evidence: items,
    recommendations: notes,
    limitations,
  });
}
