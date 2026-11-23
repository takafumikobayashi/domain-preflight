# Domain Preflight

> **Webサイトを作った。その後は大丈夫？**
>
> Webサイトの公開・移行・運用に必要な設定（DNS、HTTPS、メール、セキュリティ設定）を確認し、専門知識がなくても問題点と改善方法を理解できるようにするオープンソースツール。AIエージェント（Claude Code）との対話で使えます。

> [!WARNING]
> **利用上の注意: 自分が管理しているドメイン以外には使わないでください。**
>
> 点検してよいのは、あなた自身か所属する組織が管理しているドメインです。制作や保守を請け負っていて、管理を任されているドメインも含みます。それ以外のサイトは点検しないでください。
>
> このツールは公開情報を読むだけで、設定の変更や攻撃はしません。それでも、頼まれていない第三者のサイトを点検すれば、相手からは無断の調査に見えます。トラブルや誤解のもとになり、通信がブロックされたり、通報されたりすることもあります。点検の通信は相手のサーバーの記録に残ります（[どんな通信をするか](docs/USAGE.md#7-点検でどんな通信をするか)）。
>
> このツールの使い方によって生じた結果について、作者は責任を負いません（[MIT License](LICENSE)）。

**Status: v0.1.0（Public Check）公開中** — 公開情報だけを使う点検（DNS・HTTPS・メール認証）が動きます。Claude Code プラグインとして GitHub からインストールできます。Cloudflare連携とnpmでの配布はまだです。下の「実装状況」を参照してください。

## なぜ作るのか

Webサイトを公開したものの、DNSやSSL/TLS、HSTS、SPF・DMARC、WAFなどが適切に設定されているかを把握するのは簡単ではありません。設定は複数の管理画面に分散し、用途によって正解も変わります。

Domain Preflightは、単に「危険／安全」と判定するのではなく、**何が観測され、何が未確認で、次に何を確認・改善するとよいか**を、根拠付きで説明することを目指します。

実際のDNS移行・不要レコード整理・Cloudflareの設定点検・メール認証強化を経験したことを出発点に、誰でも再利用できる手順・検査ロジックに落とし込みます。

## 想定する利用者

- **WordPress などの CMS から、AI の力を借りて別の構成へ移ろうとしている個人・小規模事業者・地域団体**（中心）
- AI で初めて Web サイトを作った人
- 既存サイトを保守している制作・保守担当者、地域団体のサイト管理者

専門用語を知らなくても使えるよう、AI が窓口になり、各項目には「何を確認したか・なぜ大事か・放っておくと何が起きるか」の説明が付きます。詳しくは [コンセプト](docs/CONCEPT.md)。

## 2つの診断モード

| モード | 接続・認証 | できること（予定） |
| --- | --- | --- |
| **Public Check**（実装済み） | 不要 | 公開DNS、HTTPS、証明書、HTTPレスポンスヘッダー、公開されているメール認証レコードを点検 |
| **Cloudflare Check**（予定） | 読み取り専用のAPIトークン、または Cloudflare CLI `cf` | DNSゾーン、プロキシ有無、SSL/TLS、Access、Pages/Workersなど、権限とAPIで取得可能な内部設定を照合 |

Cloudflareへの接続は**任意**です。Cloudflareを使っていないサイトにも役立つツールにします。

## 実装状況

| チェック | ID | 状態 |
| --- | --- | --- |
| 名前解決（A / AAAA / CNAME） | `dns.address` | 実装済み |
| 参照先のないCNAME（サブドメイン乗っ取りの危険） | `dns.dangling-cname` | 実装済み |
| ネームサーバーと事業者 | `dns.ns` | 実装済み |
| CAAと現在の証明書の発行者の照合 | `dns.caa` | 実装済み |
| DNSSEC | `dns.dnssec` | 未実装（常に `not_checked`。理由は [DECISIONS](docs/DECISIONS.md) D6） |
| HTTPSとHTTPからの転送 | `web.https` | 実装済み |
| TLS証明書（検証・期限・失敗理由） | `web.certificate` | 実装済み |
| HSTS | `web.hsts` | 実装済み |
| nosniff などのヘッダー | `web.headers` | 実装済み |
| メールの用途（宣言と公開レコードからの推測） | `mail.context` | 実装済み |
| メールがサイトと同じサーバーにないか（移行でメールが止まる危険） | `mail.shared-host` | 実装済み |
| MX / Null MX / 書式の誤り | `mail.mx` | 実装済み |
| SPF（重複・引用符・`all`） | `mail.spf` | 実装済み |
| DMARC（組織ドメインからの継承、書式、`p=`） | `mail.dmarc` | 実装済み |
| DKIM（セレクタ指定時のみ） | `mail.dkim` | 実装済み |
| やさしい説明（各項目の「何を・なぜ・放っておくと」） | `guide` | 実装済み |
| 目的ごとの状況（Webサイトの公開 / メール / ドメインとDNS） | `areas` | 実装済み |
| 移行の記録と比較 | `snapshot` / `compare` | 未実装（次の段階） |
| URL の移行確認（sitemap） | — | 未実装 |
| Cloudflare内部設定 | `cloudflare.*` | 未実装 |

## 使い方

**Claude Code で使う場合（推奨・公開後）:** `/plugin marketplace add takafumikobayashi/domain-preflight` → `/plugin install domain-preflight@domain-preflight` の2行で、CLI と Skill が入ります（Node.js 24以上が必要）。

**CLI を直接使う場合:** Node.js 24以上が必要です。npmへの公開前なので、リポジトリから実行します。どこからでも `domain-preflight` で呼べるようにする方法と、Claude Code への Skill の取り込みは **[セットアップガイド（docs/SETUP.md）](docs/SETUP.md)** を参照してください。

```bash
npm install
npm run build
node dist/cli.js check example.com www.example.com
node dist/cli.js check example.com --mail none --format markdown --output report.md
node dist/cli.js check example.com --mail send-only --dkim-selector s1 --format json
```

| オプション | 意味 |
| --- | --- |
| `--mail <usage>` | `send-and-receive` / `send-only` / `receive-only` / `none` / `unknown`（既定）。用途が分からないうちは、強い設定を提案しません |
| `--dkim-selector <s>` | 確認するDKIMセレクタ（複数指定可）。指定しないとDKIMは `not_checked` |
| `--format <f>` | `text`（既定） / `json` / `markdown` |
| `--output <file>` | ファイルへ書き出し（既存ファイルは `--force` がないと上書きしない） |
| `--resolver <ip>` | DNSの問い合わせ先（既定はシステムのリゾルバ） |
| `--fail-on <severity>` | `high` / `medium` / `low` の所見があれば終了コード 1（CI 用） |

終了コード: `0` 完了 / `1` `--fail-on` に該当 / `2` 入力が不正 / `3` 予期しないエラー。

場面別の使い方（サイトの点検、メール設定、DNS移行の前後、CI、Claude Code からの利用）とレポートの読み方は **[使い方ガイド（docs/USAGE.md）](docs/USAGE.md)** を参照。

レポートの例（架空のデータ）: [docs/examples/sample-report.md](docs/examples/sample-report.md)

## 開発

```bash
npm run check   # 型チェックとテスト（テストはネットワークに接続しません）
npm run build
```

## 設計原則

- **Read-only first**: 初期版は設定を変更しません。診断・提案に徹します。
- **Evidence over scores**: 機械的な総合点より、確認した事実・根拠・限界を重視します。
- **Context matters**: メールを使うか、サブドメインをどう運用するかなど、用途に応じて提案します。
- **Unknown is not safe**: 未検査・取得失敗・対象外を、正常と見なしてはいけません。
- **Portable**: 検査の中核はTypeScriptで実装し、AI Agent Skillは利用方法を案内する薄い層にします。
- **No surprise changes**: DNS、WAF、HSTS、DMARCなどの変更を自動実施しません。

## ドキュメント

- [コンセプトと利用者価値](docs/CONCEPT.md)
- [セットアップガイド](docs/SETUP.md)
- [使い方ガイド](docs/USAGE.md)
- [実作業から得た知見](docs/FIELD_NOTES.md)
- [技術判断の記録](docs/DECISIONS.md)
- [MVP要件・診断ルール](docs/REQUIREMENTS.md)
- [アーキテクチャ案](docs/ARCHITECTURE.md)
- [安全設計](docs/SECURITY.md)
- [実装計画と受け入れ基準](docs/IMPLEMENTATION_PLAN.md)
- [Claude Codeへの引き継ぎ](CLAUDE.md)
- [Agent Skill](plugin/skills/site-check/SKILL.md)（Claude Code プラグイン `plugin/` に同梱）

## 将来の拡張候補（MVPの対象外）

- DNS Migration Assistant: 旧DNSと新DNSの差分比較、切り替え手順、切り替え後検証
- Resource Cleaner: 不要と思われるDNS・Access等の候補抽出（削除は人間が判断）
- Drift Watch: 設定スナップショットの差分・定期点検
- Netlify / AWS等のプロバイダー拡張

## 注意

このツールは設定の点検と改善検討を支援するものであり、脆弱性診断・侵入テスト・セキュリティ保証の代替ではありません。**自分が管理しているドメインだけに使ってください**（冒頭の「利用上の注意」を参照）。実際の変更は影響とロールバック方法を理解してから実施してください。

**License:** [MIT](LICENSE)
