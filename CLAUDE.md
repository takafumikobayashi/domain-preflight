# Claude Code: Domain Preflight 開発ガイド

## このリポジトリの目的

Domain Preflightは、**「Webサイトを作った。その後は大丈夫？」**に答える読み取り専用の点検ツール。中心の利用者は、WordPress などの CMS から AI の力を借りて別の構成へ移る、専門用語に詳しくない個人・小規模事業者（`docs/CONCEPT.md` v0.2）。Cloudflare以外のサイトでも使え、必要なら`cf` CLIから内部設定を補完する。最初はCLI + Markdown/JSONレポート + Agent Skillを作る。

## 最初に読むファイル

1. `README.md`
2. `docs/CONCEPT.md`
3. `docs/REQUIREMENTS.md`
4. `docs/SECURITY.md`
5. `docs/ARCHITECTURE.md`
6. `docs/IMPLEMENTATION_PLAN.md`

加えて `docs/FIELD_NOTES.md`（出発点になった実作業の知見）と `docs/DECISIONS.md`（Phase 0 の技術判断）を読むこと。

**現状（2026-11-22）:** Phase 0〜2 を実施済み。Public Check（14チェック）、text / JSON / Markdown レポート、テスト77件（`FakeDns` / `FakeWeb` を使い、ネットワーク非依存）、GitHub Actions の CI 設定。Cloudflare 連携（Phase 3）と npm 公開は未実装。README の「実装状況」の表が正。未実装の機能を実装済みとして説明しないこと。

## 開発コマンド

- Node.js 24 以上（`.nvmrc`）。利用者向けの導入手順は `docs/SETUP.md`、使い方は `docs/USAGE.md`。CLI のオプションや導入方法を変えたら両方を更新する。`npm run check`（型チェック + テスト）、`npm run build`、`node dist/cli.js check example.com`
- `src/` を変えたら `npm run bundle` で `plugin/lib/domain-preflight.cjs` を作り直してコミットする（CI が差分を検査する）。プラグインの検証は `claude plugin validate . && claude plugin validate ./plugin --strict`
- `node scripts/sample-report.mjs` で `docs/examples/sample-report.md` を架空データから再生成する（ビルド後）
- 実在のドメインに対する試用は、利用者が管理するドメインだけにする。レポートを docs やテストに貼る場合は `example.com` に置き換える

## 作業原則

- **Read-only first**: DNS、WAF、Access、HSTS、DMARC等を変更するコードはMVPに作らない。
- **No credential exposure**: 環境変数、認証Cookie、APIトークン等をログやテストフィクスチャに入れない。
- **Evidence-based**: 観測できないことは`not_checked`。問題・改善候補・未確認を区別する。
- **Context-aware**: メール送信の有無やDNS-onlyかどうかなど、用途を確認せず強い推奨をしない。
- **Deterministic core**: チェック・判定はTypeScriptで再現可能に実装し、AI Skillは利用補助にする。
- **Minimal diffs**: 利用者が既に作成したファイル・設定を確認し、必要以上に変更しない。
- **Plain language**: 新しいチェックには、`src/guide.ts` に用語を使わない説明（name / what / why / risk）を必ず追加する（テストで全チェックに付いていることを確かめている）。対象外は `notApplicable: true` にして、未確認と区別する。

## `cf` CLIを扱う際の必須事項

- 現在のCLIバージョン・公式ドキュメント・`--help`を確認する。コマンド名を推測しない。
- 使用するコマンドを読み取り専用の**許可リスト**に載せ、実行前に副作用を検証する。
- 対象ゾーンと必要権限を限定する。未認証・権限不足は安全に失敗させる。
- シェル文字列連結で外部入力を渡さない。引数配列、タイムアウト、出力検証を使う。
- CloudflareのDNS-only/Proxied/Pages独自設定の適用範囲の違いを尊重する。

## 開発の進め方

1. まずリポジトリの現状を確認する。
2. Phase 0として仕様の矛盾・未決事項・技術選定を短く整理する。
3. 次に小さなPublic Checkを実装し、モックテストを通す。
4. レポート出力を整えてから、Cloudflare連携を追加する。
5. 実装したコマンド・機能のみREADMEとSkillに掲載する。

必要な技術判断が複数ある場合は、推奨案と採用理由を明記する。インターネット情報や`cf`の実行結果が未確認なら、その旨を記す。

## 禁止・要承認

- 実アカウントのDNS/WAF/Access/SSL設定変更、リソース削除
- 本番環境へのデプロイ
- APIトークン・秘密情報の表示・コミット・外部送信
- ユーザー未承認の外部サービスへのアカウント接続・課金操作

**次のタスク:** `docs/IMPLEMENTATION_PLAN.md` の「次にやること」を上から進める。判定の変更には必ずテストを追加し、README の実装状況と Skill を同時に更新する。
