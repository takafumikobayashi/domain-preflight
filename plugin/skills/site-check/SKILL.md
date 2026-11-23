---
name: domain-preflight-site-check
description: Guide users through read-only DNS, HTTPS and email-authentication checks of their own domains with the Domain Preflight CLI, and explain the evidence-based report without overstating it.
---

# Domain Preflight — Site Check

**状態:** Public Check（公開情報のみ）に対応。Cloudflare の内部設定の照合は未実装なので、Cloudflare の設定について断定しない。

## 目的

Webサイトやドメインの公開設定を**読み取り専用**で確認し、CLI が出した根拠に基づいて、利用者に分かる説明と、条件付きの改善候補を出す。

## 手順

1. **対象と権限を確認する。** 点検するホスト名（複数可）と、利用者がそのドメインを管理している（または点検の許可を得ている）ことを確認する。
2. **用途を聞く。** メールを送るか、受けるか、どちらもしないか。分からなければ `unknown` のまま進め、推測で決めない。DKIM のセレクタが分かれば聞く（送信サービスの管理画面や、受信メールの `DKIM-Signature` の `s=`）。
3. **CLI があるか確かめる。** `domain-preflight --version` を実行する。見つからなければ、パスを推測して探さず、利用者にセットアップ（リポジトリの `docs/SETUP.md`）を案内して止まる。Node.js 24 以上が必要。
4. **実行する。**

   ```bash
   domain-preflight check <host> [<host>...] --mail <usage> [--dkim-selector <s>] --format json
   ```

   利用者に見せるレポートが必要なら `--format markdown --output <file>`。既存ファイルを上書きするときは利用者に確認してから `--force`。
5. **読み解く。** JSON の `status` をそのまま区別して説明する。

   | status | 説明の仕方 |
   | --- | --- |
   | `finding` | 観測された具体的な問題。`summary` と `evidence` を引用する |
   | `review` | 状況次第。`recommendations` に書かれた**条件**を必ず添える |
   | `not_checked` | 確認していない。「問題なし」と言わない |
   | `error` | 確認に失敗した。再実行や別の方法を案内する |
   | `pass` | 定めた条件を観測できた。安全の保証とは言わない |

6. **提案する（適用はしない）。** 変更案には、影響、前提、変更後の確認方法、元に戻す方法を添える。DNS・HTTPS・メールの設定変更は利用者が行う。

## 絶対ルール

- 読み取り専用で実行する。`cf` などの変更系操作は呼ばない。
- 未検査項目を「問題なし」にしない。`dns.dnssec` は現在常に `not_checked`。
- メール用途が不明なのに Null MX / SPF `-all` / DMARC `p=reject` を勧めない。`mail.context` の推測は推測として伝える。apex の SPF `-all` は「そのドメインでメールを送らない」ことを意味しない（別の MAIL FROM と DKIM で送る構成がある）。
- HSTS の `includeSubDomains`、preload、長期 `max-age` を一律に勧めない。短い値から始める。
- Cloudflare の DNS-only のホストに、ゾーンの HTTP 設定（HSTS、Always Use HTTPS など）が適用されると説明しない。
- 認証情報や非公開の設定を、対話や成果物に出さない。
- 公開情報の点検だけで、侵入テストやセキュリティ保証をしたと主張しない。

## 開発者向け

判定の基準は CLI 側（`src/checks/`）にだけ置く。このスキルに新しい診断基準を書かない。CLI のオプションや status を変えたら、この手順を同時に更新する。
