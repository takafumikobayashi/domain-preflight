---
name: domain-preflight-site-check
description: Help website owners — including people moving off WordPress or another CMS who do not know DNS or email terms — check that their own domain's website, HTTPS and email are set up safely, before and after publishing or migrating. Starts from what the person wants to do, runs the read-only Domain Preflight CLI, and explains the results in plain language without overstating them.
---

# Domain Preflight — サイトの点検

**状態:** 公開情報の点検（Site Check）に対応。移行の記録と比較（`snapshot` / `compare`）と Cloudflare の内部設定の照合は未実装なので、それらを実行したかのように話さない。

## この Skill が助ける人

自分のサイトを持っているが、DNS、証明書、メールの認証といった言葉に詳しくない人。WordPress などからの移行を考えている人も多い。**相手が専門用語を知っている前提で話さない。** 用語を使うときは、先に普段の言葉で言い、用語は括弧に添える（例:「メールの受け取り先（MX）」）。

## 進め方

### 1. 目的から聞く（用語では聞かない）

最初に、次の3つを普段の言葉で聞く。一度に全部聞かず、相手の話から分かることは聞き直さない。

1. **何をしたいですか？**
   - 今のサイトに問題がないか見てほしい
   - WordPress など今の仕組みから、別の場所へサイトを移したい（移す前）
   - サイトを移したので、問題がないか確かめたい（移した後）
2. **どんなサイトですか？**（会社・お店・団体のホームページ／ブログ／ネットショップや会員制サイト）
3. **このドメインのメールアドレス（例: info@あなたのドメイン）を使っていますか？** はい／いいえ／分からない
   - 「分からない」は正当な答え。推測で決めない。名刺やお問い合わせフォームの通知メールの差出人などを手がかりに、一緒に確かめる。

あわせて、点検するドメイン（サイトのアドレス）と、そのドメインを本人または所属先が管理していることを確かめる。他人のサイトは点検しない。

答えを CLI の指定に置き換える。

| 答え | `--mail` |
| --- | --- |
| 送るだけ（フォームの通知など） | `send-only` |
| 受け取るだけ | `receive-only` |
| 送るし受け取る（普通のメールアドレス） | `send-and-receive` |
| 使っていない | `none` |
| 分からない | `unknown` |

点検するホストは、サイトのアドレス（例: `example.com` と `www.example.com`）を基本にする。メールの送信サービスが別のサブドメイン（例: `mail.example.com`）を使っていると分かれば加える。DKIM のセレクタが分かる場合だけ `--dkim-selector` を付ける（分からなければ聞き出そうとしない）。

### 2. CLI があるか確かめる

`domain-preflight --version` を実行する。見つからなければ、パスを推測して探さず、セットアップ（リポジトリの `docs/SETUP.md`。Claude Code ならプラグインのインストール）を案内して止まる。Node.js 24 以上が必要。

### 3. 点検する

```bash
domain-preflight check <host> [<host>...] --mail <usage> [--dkim-selector <s>] --format json
```

相手が結果を保存・共有したい場合は `--format markdown --output <file>`。既存ファイルの上書きは、相手に確認してから `--force`。

### 4. 結果を伝える

順番を守る。

1. **まず目的ごとの状況（`areas`）を1〜3行で。** 例:「サイトの公開は確認した範囲で問題なし。メールは確認してほしいことが1件あります。」
2. **次に、対応が必要なもの・確認してほしいものだけを、重要な順に。** 各項目は JSON の `guide` を使って、
   - `guide.name`（用語を使わない名前）で呼び、
   - `summary`（何が見つかったか）を伝え、
   - `guide.why` と `guide.risk` で、なぜ大事か・放っておくと何が起きるかを添える。
3. **確認できていないもの（`not_checked` で `notApplicable` が付いていないもの、`error`）があれば、それも言う。** 「問題なし」とは言わない。`notApplicable: true` は「このホストでは使っていないので対象外」という意味で、問題でも未確認でもない。
4. 問題のない項目は、聞かれたら説明する（最初から全部並べない）。

status の扱い:

| status | 伝え方 |
| --- | --- |
| `finding` | 見つかった問題。`summary` と `evidence` を根拠に |
| `review` | 状況次第。`recommendations` に書かれた**条件**を必ず添える（「メールを使っていないなら〜」） |
| `not_checked` | 確認していない（`notApplicable` なら対象外）。未確認なら「分からない」と言う |
| `error` | 確認に失敗した。時間をおいて再実行を勧める |
| `pass` | 決めた条件を確認できた。安全の保証とは言わない |

### 5. 次の一歩を提案する（自分では変えない）

- 直し方を提案するときは、**どこの管理画面で（`dns.ns` で分かる DNS の事業者など）、何を、どう変えるか**、変えた後の確かめ方、元に戻す方法を、手順として示す。
- 設定の変更は相手（または相手が頼んだ詳しい人）が行う。この Skill から DNS やメール、HTTPS の設定を変えない。
- **移行の前**なら、特に `mail.shared-host`（メールがサイトと同じサーバーにある）と `mail.context` を最初に取り上げる。移行でいちばん起きやすい事故は、メールが止まること。
- **移行の後**なら、サイトの公開（`web.*`）とメール（`mail.*`）を確かめたうえで、外から確かめられないこと（問い合わせフォームの送信テスト、外部のアドレスから自分宛てのメールのテスト、旧サイトの主要ページの URL が新サイトでも開けるか）を、相手にやってもらう手順として示す。URL の一括確認はまだできない。

## 絶対ルール

- 読み取り専用で実行する。`cf` などの変更系操作は呼ばない。
- 未確認の項目を「問題なし」にしない。`dns.dnssec` は現在常に未確認。
- メールの用途が分からないのに、Null MX / SPF `-all` / DMARC `p=reject` を勧めない。`mail.context` の推測は推測として伝える。ドメイン本体の SPF が `-all` でも「メールを送っていない」とは限らない（別の送信用サブドメインと DKIM で送る構成がある）。
- HSTS の `includeSubDomains`、preload、長い `max-age` を一律に勧めない。短い値から始める。
- 「WordPress をやめるべき」と断定しない。更新の頻度や必要な機能によっては、CMS を使い続ける方が良い場合もある。
- Cloudflare の DNS のみ（プロキシなし）のホストに、ゾーンの HTTP 設定が効くと説明しない。
- 認証情報や非公開の設定を、対話や成果物に出さない。
- 公開情報の点検だけで、安全を保証したと言わない。

## 開発者向け

判定とやさしい説明の文は CLI 側（`src/checks/`、`src/guide.ts`）にだけ置く。この Skill に新しい診断基準や説明文を書き足さない。CLI のオプション、status、`guide`、`areas`、`notApplicable` を変えたら、この手順を同時に更新する。
