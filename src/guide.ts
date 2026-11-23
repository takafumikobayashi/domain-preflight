import type { AreaId, AreaState, AreaSummary, CheckResult, CheckStatus, Guide } from "./types.js";

/**
 * Plain-language explanations, fixed per check so that every user (and every AI relaying them)
 * gets the same wording. Written for people who have never had to think about DNS or TLS.
 */
export const GUIDES: Record<string, Guide> = {
  "dns.address": {
    name: "名前からサーバーの住所が引けるか",
    what: "ホスト名（例: www.example.com）から、サイトを置いているサーバーの住所（IP アドレス）が引けるかを確認しました。",
    why: "住所が引けないと、ブラウザはサイトにたどり着けません。",
    risk: "Web サイトに使う名前で住所が引けなければ、サイトが表示されません。メール専用など、Web に使わない名前なら問題ありません。",
  },
  "dns.dangling-cname": {
    name: "使われなくなった転送先が残っていないか",
    what: "別名（CNAME）で外部のサービスに転送している場合に、その転送先がまだ存在するかを確認しました。",
    why: "サービスを解約しても DNS の転送設定だけが残ることがよくあります。",
    risk: "転送先の名前を第三者が取得すると、あなたのドメインのサブドメインで、勝手なページを表示されるおそれがあります（サブドメインの乗っ取り）。",
  },
  "dns.ns": {
    name: "ドメインの設定を管理している会社",
    what: "このドメインの DNS（名前と住所の対応表）を、どの事業者のサーバーが管理しているかを確認しました。",
    why: "DNS の設定を変えるときに、どこの管理画面を開けばよいかが分かります。移行の途中かどうかの手がかりにもなります。",
    risk: "管理している事業者が分からないままだと、設定を変えたつもりでも反映されないことがあります。",
  },
  "dns.caa": {
    name: "証明書を発行してよい会社の指定",
    what: "このドメインの証明書（https の鍵）を発行してよい認証局が、DNS で指定されているかを確認しました。",
    why: "指定があると、指定外の会社が証明書を発行できなくなり、なりすましの証明書を防げます。",
    risk: "指定がなくてもすぐに困ることはありません。逆に、使っている会社を指定から外すと、証明書の更新に失敗してサイトに警告が出るようになります。",
  },
  "dns.dnssec": {
    name: "DNS の答えの改ざん防止（DNSSEC）",
    what: "DNS の答えに電子署名を付ける仕組みが使われているかです。このバージョンでは確認していません。",
    why: "DNS の答えを途中で書き換える攻撃を防げます。",
    risk: "使っていないだけで、すぐに問題になるわけではありません。レジストラによっては有料のオプションです。",
  },
  "web.https": {
    name: "暗号化された接続（https）で開けるか",
    what: "https:// でサイトが開けるか、http:// で開いたときに https:// へ自動で移るかを確認しました。",
    why: "https なら、閲覧者とサイトの間のやり取りが暗号化され、途中で読まれたり書き換えられたりしません。",
    risk: "http のまま開けると、ブラウザに「保護されていない通信」と表示され、問い合わせフォームの内容なども盗み見られるおそれがあります。",
  },
  "web.certificate": {
    name: "https の証明書の期限と正しさ",
    what: "https で使う証明書が、このサイトの名前に対して正しく発行され、期限内かを確認しました。",
    why: "証明書は「このサイトが本物である」ことを示す身分証です。",
    risk: "期限切れや名前の不一致があると、ブラウザに大きな警告が出て、多くの人がサイトを開くのをやめてしまいます。",
  },
  "web.hsts": {
    name: "いつも暗号化して開く設定（HSTS）",
    what: "ブラウザに「このサイトは必ず https で開いて」と覚えさせる設定があるかを確認しました。",
    why: "最初に http で開こうとしたときに、途中で偽のページに差し替えられる攻撃を防げます。",
    risk: "設定がなくても、多くの場合すぐに困ることはありません。逆に、長い期間で設定した後に https をやめると、閲覧者がしばらくサイトを開けなくなります。",
  },
  "web.headers": {
    name: "ブラウザ向けの安全設定",
    what: "ブラウザに安全な動き方を指示する設定（X-Content-Type-Options など）が、サイトの応答に含まれているかを確認しました。",
    why: "ファイルの種類の取り違えを悪用する攻撃などを、ブラウザ側で防げます。",
    risk: "付いていなくても、すぐにサイトが壊れたり危険になったりはしません。多くの場合、副作用なく追加できます。",
  },
  "mail.context": {
    name: "このドメインでメールを使っているか",
    what: "メールの送受信に使っているかを、あなたの回答と DNS の設定から確かめました。",
    why: "メールを使うかどうかで、正しい設定がまったく変わります。",
    risk: "使っているのに「使わない」前提の設定をすると、メールが届かなくなります。そのため、用途が分からないうちは強い設定を勧めません。",
  },
  "mail.shared-host": {
    name: "メールがサイトと同じサーバーにないか",
    what: "メールの受け取り先（MX）が、Web サイトと同じサーバーを指していないかを確認しました。",
    why: "レンタルサーバーでは、サイトとメールが同じサーバーに同居していることがよくあります。",
    risk: "同居していると、サイトを別の場所へ移したり、サーバーを解約したりしたときに、メールまで止まることがあります。移行の前に必ず確認してください。",
  },
  "mail.mx": {
    name: "メールの受け取り先",
    what: "このドメイン宛てのメールをどのサーバーが受け取るか（MX）の設定を確認しました。",
    why: "受け取り先の設定が正しくないと、あなた宛てのメールが届きません。",
    risk: "受け取るつもりなのに設定がない・誤っていると、メールが相手に戻されたり消えたりします。受け取らないなら、その旨をはっきり示すこともできます。",
  },
  "mail.spf": {
    name: "メールを送ってよいサーバーの名簿（SPF）",
    what: "このドメインからのメールを送ってよいサーバーの一覧が、DNS で公開されているかを確認しました。",
    why: "受け取る側が、本物のメールか、なりすましかを見分ける材料になります。",
    risk: "名簿がないと、あなたのドメインを名乗るなりすましメールを見分けにくくなります。逆に名簿から送信サービスが漏れていると、あなたの正規のメールが迷惑メール扱いされます。",
  },
  "mail.dmarc": {
    name: "なりすましメールの扱い方の指示（DMARC）",
    what: "なりすましと判定されたメールを、受け取る側でどう扱ってほしいか（受け取る・迷惑メールにする・拒否する）の指示を確認しました。",
    why: "なりすましメールが相手の受信箱に届くのを防げます。",
    risk: "指示がない・監視のみだと、なりすましメールが届いてしまいます。逆に、正規のメールの設定が整う前に「拒否」にすると、あなたのメールまで届かなくなります。",
  },
  "mail.dkim": {
    name: "メールの電子署名（DKIM）",
    what: "送信したメールに付ける電子署名を確かめるための鍵が、DNS で公開されているかを確認しました。",
    why: "署名があると、メールが途中で書き換えられていないこと、本当にあなたのドメインから送られたことを示せます。",
    risk: "鍵が公開されていないと署名を確かめられず、メールが迷惑メール扱いされやすくなります。",
  },
};

export const AREAS: { id: AreaId; name: string; checkIds: string[] }[] = [
  { id: "website", name: "Webサイトの公開", checkIds: ["dns.address", "dns.dangling-cname", "web.https", "web.certificate", "web.hsts", "web.headers", "dns.caa"] },
  { id: "mail", name: "メール", checkIds: ["mail.context", "mail.shared-host", "mail.mx", "mail.spf", "mail.dmarc", "mail.dkim"] },
  { id: "domain", name: "ドメインとDNS", checkIds: ["dns.ns", "dns.dnssec"] },
];

export const AREA_STATE_LABEL: Record<AreaState, string> = {
  action: "対応が必要な項目あり",
  error: "確認に失敗した項目あり",
  review: "確認してほしい項目あり",
  unchecked: "確認できていない項目あり",
  clear: "問題は見つかりませんでした",
};

export function withGuide(check: CheckResult): CheckResult {
  const guide = GUIDES[check.id];
  return guide ? { ...check, guide } : check;
}

const emptyCounts = (): Record<CheckStatus, number> => ({ pass: 0, finding: 0, review: 0, not_checked: 0, error: 0 });

/**
 * Readiness per purpose. The state is the most urgent status found in the area, so one finding
 * is never hidden behind many passes. "unchecked" only applies when every other check passed.
 */
export function summarizeAreas(checks: CheckResult[]): AreaSummary[] {
  return AREAS.map((area) => {
    const inArea = checks.filter((check) => area.checkIds.includes(check.id));
    const counts = emptyCounts();
    for (const check of inArea) counts[check.status] += 1;
    const notApplicable = inArea.filter((check) => check.status === "not_checked" && check.notApplicable).length;
    const unchecked = counts.not_checked - notApplicable;
    const state: AreaState =
      counts.finding > 0 ? "action" : counts.error > 0 ? "error" : counts.review > 0 ? "review" : unchecked > 0 ? "unchecked" : "clear";
    const pieces = [
      counts.finding > 0 ? `対応が必要 ${counts.finding}件` : "",
      counts.error > 0 ? `確認に失敗 ${counts.error}件` : "",
      counts.review > 0 ? `確認してほしい ${counts.review}件` : "",
      unchecked > 0 ? `未確認 ${unchecked}件` : "",
    ].filter(Boolean);
    const allNotApplicable = inArea.length > 0 && notApplicable === inArea.length;
    const summary = allNotApplicable
      ? `${area.name}: このホストでは使われていないため、対象外です。`
      : state === "clear"
        ? `${area.name}: 確認した範囲では問題は見つかりませんでした（安全の保証ではありません）。`
        : `${area.name}: ${pieces.join("、")}。`;
    return { id: area.id, name: area.name, state, summary, counts, notApplicable, checkIds: inArea.map((check) => check.id) };
  });
}
