# MVP要件定義

> Status: Draft v0.2 — 2026-11-22、実作業の知見（[FIELD_NOTES](FIELD_NOTES.md)）と Phase 0 の判断（[DECISIONS](DECISIONS.md)）を反映。

## 1. スコープ

### MVPに含める

- 1つ以上のFQDN（最大20件）を入力とする**読み取り専用**診断CLI（1ゾーンに複数のホストがある運用が一般的なため）
- 公開DNSとHTTP/HTTPSの軽量チェック
- 公開メール認証レコードの検査
- 根拠付きのJSON / Markdownレポート
- Cloudflare `cf` CLIがある場合の追加情報取得（対応API・権限で取得可能な項目のみ）
- Claude Code等から利用するためのAgent Skill

### MVPに含めない

- DNSレコード・Access・WAF・TLSの作成、変更、削除
- 旧DNS→新DNSの自動移行、ネームサーバー切り替え
- 定期監視、メール・Slack通知、Web UI
- 侵入・脆弱性検査、パスワード総当たり、ポートスキャン
- アカウント全体の2FA状態の保証（権限/API制約があり得る）

## 2. 入力

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| 対象ドメイン / FQDN | 必須 | 例: `example.com`、`www.example.com`。複数指定可。URL・ポート・IPリテラル・ワイルドカードは拒否する |
| モード | 任意 | `public`（初期値）、`cloudflare` |
| レポート形式 | 任意 | `json` / `markdown` |
| メール利用形態 | 任意 | `send-and-receive` / `send-only` / `receive-only` / `none` / `unknown`。不明なら断定的な修正提案を避ける |
| DKIMセレクタ | 任意 | 指定したときだけ該当レコードを調査 |
| 出力ファイル | 任意 | 標準出力または指定先。上書きは明示的に扱う |

**注記:** 入力したホストの`www`や親ドメインを自動的に同一の設定とみなさない。関連ホストの検査は明示的にする。

**組織ドメイン:** Public Suffix List で入力ホストの組織ドメイン（例: `www.example.co.jp` → `example.co.jp`）を算出し、レポートに明示する。NS と、DMARC の継承（サブドメインに独自レコードがない場合の `sp=` / `p=`）は組織ドメインを参照する。

**メール用途の推測:** `--mail` が `unknown` の場合でも、MX、SPF の include、SES のバウンス用 MX などの公開シグナルから用途を**推測**し、「推測」であることを明示して利用者に確認を促す。推測だけを根拠に強い設定を提案しない（[FIELD_NOTES](FIELD_NOTES.md) 2.1）。

## 3. Public Checkの対象

| ID | チェック | 出力で示すこと | 注意点 |
| --- | --- | --- | --- |
| `dns.ns` | NS | 公開された委任先 / DNS上の観測値 | キャッシュ・伝播差異に注意 |
| `dns.address` | A / AAAA / CNAME | 観測されたレコード | 不在が常に問題とは限らない |
| `dns.mx` | MX / Null MX | メール受信先と状態 | Null MXを無条件に推奨しない |
| `dns.dangling-cname` | CNAMEの参照先 | 参照先がNXDOMAINなら乗っ取りリスク | 一時的な障害との区別に注意 |
| `dns.caa` | CAA | 制限の有無、現在の証明書の発行者が許可されているか | CNAME先のCAAが適用される場合がある |
| `dns.dnssec` | DS / DNSSEC観測 | 確認できる状態・限界 | DS不在だけで「故障」と断定しない。Phase 1 は `not_checked` |
| `web.https` | HTTPS応答・HTTP→HTTPS | 接続可否、リダイレクト経路 | オリジンの設定全体を保証しない |
| `web.certificate` | TLS証明書 | 有効期限、検証結果など | 証明書検証に失敗した理由を区別 |
| `web.headers` | HSTS / nosniff等 | レスポンスヘッダーの値 | CSP等は用途依存、単純な有無で断罪しない |
| `mail.context` | メールの用途 | 宣言された用途と公開シグナルからの推測、食い違い | 推測は推測として表示 |
| `mail.spf` | SPF TXT | 設定有無・公開値、明らかな異常（重複、引用符、`+all`） | SPF構文全体の完全検証は段階的に対応 |
| `mail.dmarc` | DMARC TXT | pポリシー等の公開値 | サブドメインへの継承・組織ドメインを考慮 |
| `mail.dkim` | DKIM TXT | 指定セレクタの公開値 | セレクタ不明なら`not_checked` |

初期版のTLSチェックは、接続可否と証明書検証を優先する。**最低TLSバージョンが完全に確認できた**と断定するには、対応プロトコルごとの実測条件と検証方法の明確化が必要であり、別タスクとして扱う。

## 4. Cloudflare Checkの対象

`cf` CLIを通じて、以下の**読み取り可能な**情報を取得して公開情報と照合する。実際のコマンド名、必要権限、取得フィールドは、実装時点の公式ドキュメントおよび`cf --help`等で必ず検証する。

取得方法は差し替え可能にし、**読み取り専用 API トークン + REST API を第一候補**、`cf` CLI を代替とする（[DECISIONS](DECISIONS.md) D9）。`cf` の OAuth トークンは書き込み権限を持つため、許可リストだけでは権限を最小化できない。

- 対象ゾーンの存在・状態、DNSレコード、プロキシ有無
- SSL/TLSモード、最小TLS、HTTPSリダイレクト、HSTS等（取得可能な設定に限定）
- WAFの有効状況やルールの存在（権限・プラン・適用範囲による）
- Accessアプリの存在・保護対象（取得可能な範囲）
- Pages / Workersの構成情報（実際の対象ホストとの関連が確認できる場合）

**適用範囲の注意:** Cloudflare DNSを利用することと、HTTPトラフィックがCloudflareのプロキシを通ることは異なる。DNS-onlyのホスト、Pages独自の設定、外部ホスティングを同じ基準で判定しない。

MVPでは、Cloudflare内部情報を取得できない場合、Public Checkの結果を破棄せず、該当項目を`not_checked`または`error`で表示する。

## 5. 判定モデル

各チェック結果は以下を必須とする。

- `id`, `title`, `status`, `summary`, `observedAt`
- `evidence[]`: 観測値・情報源・時点（機密値は記録しない）
- `recommendations[]`: 必要に応じた改善・確認案
- `limitations[]`: このチェックで判断できないこと

`status`の候補:

| status | 意味 |
| --- | --- |
| `pass` | 定義した条件を満たすことが観測できた |
| `finding` | 具体的な問題・不整合を確認した |
| `review` | 状況により判断が変わるため確認を推奨する |
| `not_checked` | 対象外・未実装・未認証などで検査していない |
| `error` | 検査を試みたが失敗した |

重要度（`critical/high/medium/low/info`など）は`status`と独立させる。`pass`を「完全に安全」という意味で表示しない。根拠が薄いときは`review`または`not_checked`を使う。

## 6. レポート要件

- CLI標準出力で要約を見られること。
- JSON（機械処理用）およびMarkdown（人が読む用）を出せること。
- 診断日時、対象FQDN、モード、ツールバージョン、エラー・未検査項目を記録すること。
- 各所見について「観測結果 → 意味 → 推奨確認 → 影響・注意」を追えること。
- 初期版では**総合セキュリティ点数を付けない**こと。
- 適用条件が不明な変更（HSTS長期化、DMARCの強化、DNS削除等）を断定的に推奨しないこと。
- JSONには将来の互換性管理用`schemaVersion`を含めること。

## 7. 非機能要件

- TypeScript / Node.js 24以上を基本とし、macOS・Linux・Windowsでの実行を目指す。
- 公開情報検査は認証不要。Cloudflare連携はユーザーが認証を済ませる方式。
- DNS・HTTPのタイムアウト、リトライ上限、リダイレクト上限を設ける。
- 検査対象を公的に到達可能なホスト名に限定し、内部IPへの接続を防ぐ。
- シークレットをログ・レポートに出さず、デフォルトで外部テレメトリを送らない。
- エラー時も検査できた項目は維持し、部分結果を出力できる。
- すべてのCloudflare操作は読み取り専用の許可リストを用いる。

## 8. 代表的な受け入れ条件

1. 公開ドメインを指定するとPublic Checkが完走し、JSONとMarkdownに同じ所見が出る。
2. HTTPS未対応やDMARC未設定でもクラッシュせず、根拠・限界が記録される。
3. DKIMセレクタが不明な場合、DKIMを「安全」とは表示しない。
4. メール用途が不明なドメインにNull MX / `SPF -all` / `DMARC p=reject`を無条件に提案しない。
5. `cf`未インストール・未認証でもPublic Checkは利用できる。
6. 本ツール実行だけでDNSやCloudflare設定が変更されない。
7. テストは外部サイトへの実アクセスに依存せず実行できる。
