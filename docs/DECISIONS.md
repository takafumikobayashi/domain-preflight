# 技術判断の記録（Phase 0）

> 2026-11-22 時点の判断。変更したら日付と理由を追記する。
> 「確認済み」は手元で実行・閲覧して確かめたもの、「未確認」は資料・記憶に基づくもの。

## D1. 実行環境とツール

| 項目 | 採用 | 理由 |
| --- | --- | --- |
| ランタイム | Node.js 24 以上（`.nvmrc` は 24、開発は 26） | Node 20 はサポート終了済みで、脆弱性修正が提供されない。24 と 26 は LTS（期限は公式の日程表で要確認）。CI では 24 と 26 の両方で試験する |
| 言語 | TypeScript（`strict`） | 要件どおり。判定ロジックを型で固定する |
| パッケージ管理 | npm | 追加ツール不要。利用者が `npx` で試せる |
| テスト | Vitest | ESM / TypeScript をそのまま扱える。モックが簡単 |
| CLI 引数 | `node:util` の `parseArgs` | 依存を増やさない。MVP のオプション数なら十分 |
| HTTP / TLS | `node:https` / `node:tls` を直接使う | 接続先 IP の検証（内部 IP 拒否・DNS リバインディング対策）のため、名前解決を自前で差し込む必要がある。`fetch` ではこれができない |
| 組織ドメインの判定 | `tldts`（Public Suffix List） | `example.co.jp`、`example.tokyo` などを正しく扱うため。自前実装は誤りやすい |
| 実行時検証 | Zod（Phase 3 から） | `cf` / API 応答の形を検証する。Phase 1 は Node 標準 API の戻り値だけなので不要 |

依存は `tldts` のみ（開発依存を除く）から始める。

## D2. 入力

- `domain-preflight check <host> [<host>...]` — 複数ホストを1回で点検できる（実作業で1ゾーンに10ホストあったため）。
- ホスト名のみ受け付ける。URL、ポート、IP リテラル、ワイルドカードは拒否（終了コード 2）。
- 組織ドメインは PSL から自動算出し、レポートに明示する。親ドメインの設定を入力ホストのものとして扱わない（DMARC の継承のように仕様上そうなるものは、そう明記する）。
- `--mail <usage>`: `send-and-receive | send-only | receive-only | none | unknown`（既定 `unknown`）。
- `--dkim-selector <s>`（複数可）。
- `--format text|json|markdown`（既定 `text`）、`--output <file>`（既存ファイルは `--force` なしでは上書きしない）。

## D3. チェック ID（MVP）

| ID | 対象 | Phase |
| --- | --- | --- |
| `dns.address` | A / AAAA / CNAME | 1 |
| `dns.dangling-cname` | CNAME の先が解決できるか | 1 |
| `dns.ns` | 組織ドメインの NS | 1 |
| `dns.caa` | CAA（ホストから組織ドメインまで遡る） | 1 |
| `dns.dnssec` | DS / 検証状態 | 1 では `not_checked`（D6） |
| `mail.context` | メール用途の宣言と推測シグナル | 1 |
| `mail.shared-host` | メールの受け取り先がサイトと同じサーバーか（移行の事故防止） | 1（2026-11-22 追加） |
| `mail.mx` | MX / Null MX / 書式 | 1 |
| `mail.spf` | SPF の有無・重複・書式・`all` 修飾子 | 1 |
| `mail.dmarc` | ホスト → 組織ドメインの順で探索、書式・`p=` | 1 |
| `mail.dkim` | 指定セレクタのみ | 1 |
| `web.https` | HTTP→HTTPS の転送、HTTPS の応答 | 1 |
| `web.certificate` | 検証結果、期限、発行者 | 1 |
| `web.hsts` | HSTS の値の解釈 | 1 |
| `web.headers` | nosniff 等 | 1 |
| `cloudflare.*` | ゾーン・プロキシ・設定 | 3 |

`dns.record-format` は独立チェックにせず、該当する `mail.*` の所見として出す（MX / SPF / DMARC の書式誤りは各チェックの文脈で説明した方が分かりやすい）。

## D4. 判定モデルと終了コード

- `status`: `pass | finding | review | not_checked | error`（REQUIREMENTS どおり）。
- `severity`: `high | medium | low | info`。`critical` は MVP では使わない（公開情報だけで「致命的」と断定できる場面がほぼないため）。
- 終了コード:
  - `0` 点検が完了した（所見の有無は問わない）
  - `1` `--fail-on <severity>` を指定し、その重大度以上の `finding` があった（CI 用、任意）
  - `2` 入力が不正
  - `3` 予期しないエラー
- JSON に `schemaVersion`（現在 `"0.2.0"`。`guide`、`areas`、`notApplicable` を加えたときに 0.1.0 から上げた）。

## D5. DNS の問い合わせ先

- Phase 1 は**システムのリゾルバ**（`node:dns` の既定）を使い、レポートに「再帰リゾルバ経由」と明記する。
- `--resolver <ip>` で問い合わせ先を指定できる（例: `1.1.1.1`）。
- 権威 DNS への直接問い合わせと、親ゾーン委任との比較（`dns.delegation`）は Phase 1.5 で検討する。

## D6. DNSSEC

Node 標準の DNS API は DS レコードも AD フラグも返さない。選択肢は (a) DoH（JSON API）で AD フラグを見る、(b) DNS パケットを自前で組む。(a) はドメイン名を第三者へ送るため、明示オプトイン（`--doh`）にする。**Phase 1 では `not_checked` と限界の説明のみ**。

## D7. TLS

- 証明書は `tls.connect`（SNI 付き、検証有効）で取得し、`authorized` / `authorizationError` / 期限 / 発行者 / SAN を記録する。
- 検証エラー時は、検証を無効にした再接続で証明書の中身だけ取得し、理由（期限切れ・自己署名・名前不一致）を区別する。
- 最低 TLS バージョンの実測は MVP 対象外（Node / OpenSSL の既定で TLS 1.0 / 1.1 が無効のため、正しく測れない）。

## D8. ネットワーク安全性

- 名前解決結果のすべての IP を検査し、プライベート / ループバック / リンクローカル / CGNAT / マルチキャスト / 予約済み / メタデータ（`169.254.169.254`）を拒否する。
- 検証済みの IP に固定して接続する（`lookup` を差し替え）。リダイレクト先も同じ検査を通す。
- リダイレクト最大5回、タイムアウト8秒、本文は読まない（ヘッダーのみ）。HTTP メソッドは `GET`（`HEAD` 非対応サーバーがあるため）で、本文は即破棄。
- リダイレクトは、点検中のホストと同じ組織ドメインの中だけ追う。別の組織のドメインへの転送先にはアクセスせず、転送先として記録する（2026-11-23。点検の通信を利用者自身のドメインに留めるため）。
- User-Agent は `domain-preflight/<version> (read-only configuration check; +<リポジトリの URL>)`。相手のログから目的と問い合わせ先が分かるようにする。

## D9. Cloudflare 連携の方式（Phase 3）

**採用: 取得方法を差し替えられるアダプター。第一候補は読み取り専用 API トークン + REST API、`cf` CLI は代替。**

| 方式 | 利点 | 欠点 |
| --- | --- | --- |
| REST API + 読み取り専用トークン | トークンの権限そのものを読み取りに限定できる。API は安定 | 利用者がトークンを作る手間 |
| `cf` CLI（OAuth） | ログイン済みならすぐ使える | トークンに書き込み権限がある。CLI がまだ v0.15 で仕様が動く |

### `cf` v0.15.0 で存在を確認した読み取り系コマンド（`--help` で確認済み、2026-11-22）

| 用途 | コマンド | 備考 |
| --- | --- | --- |
| ゾーン一覧 | `cf zones list` | |
| ゾーン詳細 | `cf zones get` | `--zone` で指定 |
| ゾーン設定 | `cf zones settings get <setting-id>` | 一括取得はない。`ssl`、`min_tls_version`、`always_use_https`、`security_header` などを個別に |
| DNS レコード | `cf dns records list` | |
| DNSSEC | `cf dns dnssec get` | |
| 証明書パック | `cf ssl certificate-packs ...` | サブコマンドは実装時に確認 |
| Access アプリ | `cf zero-trust access applications list` / `get <app-id>` | |
| Pages | `cf pages projects ...` | |

**許可リストに入れてはいけない例:** `cf dns records scan`（スキャンを開始する）、`* edit`、`* create`、`* delete`、`* import`、`* batch`。

### REST API（未確認、実装時に公式ドキュメントで確認）

`GET /zones?name=`、`GET /zones/{id}/dns_records`、`GET /zones/{id}/settings/{setting}`、`GET /zones/{id}/dnssec`。必要権限は Zone:Read、DNS:Read、Zone Settings:Read の見込み。

## D10. レポートの言語

所見の文章は日本語、JSON のキーと ID は英語。英語の文章は将来の課題（文言をカタログ化しておく）。

## D11. ライセンス

MIT（2026-11-22 決定）。短く広く使われており、同梱する `tldts`（MIT）とも揃う。公式プラグインディレクトリへの掲載にもライセンスが必要。

## 未決事項

- npm パッケージ名の空き（未確認）
- `dns.delegation` の実装方式（RDAP か、親ゾーンの NS への直接問い合わせか）
