# 使い方ガイド

Domain Preflight を実際の運用で使うための手引き。オプションの一覧は [README](../README.md#使い方) にある。

## 1. できること・できないこと

- **できる:** 公開されている DNS、HTTPS、証明書、レスポンスヘッダー、メール認証レコードを読み取り、根拠と条件付きの改善候補をレポートにする。
- **しない:** 設定の変更、脆弱性スキャン、侵入テスト、大量のリクエスト。1ホストあたりの通信は、DNS の問い合わせ十数件と HTTP(S) の数リクエストだけ。
- **まだできない:** Cloudflare などの管理画面の内部設定の照合（Phase 3 で予定）、DNSSEC の検証。

点検するのは、自分が管理しているドメイン、または点検の許可を得たドメインにする。

## 2. 準備

Node.js 24 以上が必要。npm への公開前なので、リポジトリを取得してビルドする。

```bash
git clone https://github.com/takafumikobayashi/domain-preflight.git
cd domain-preflight
npm install
npm run build
node dist/cli.js --version
```

別のディレクトリから使うときは、パスを指定して `npx` で呼べる（グローバルにはインストールされない）。

```bash
npx --package=/path/to/domain-preflight domain-preflight check example.com
```

どこからでも `domain-preflight` で呼べるようにする手順（`npm link`）と、Agent Skill の取り込みは [セットアップガイド](SETUP.md) を参照。以降の例は、その状態を前提に `domain-preflight` と書く（リポジトリ内の `node dist/cli.js` と同じ）。

## 3. 場面別の使い方

### A. 自分のサイトを一通り点検する

ゾーンの主なホストをまとめて指定する。Web とメールで使っている名前を並べるとよい。

```bash
domain-preflight check example.com www.example.com blog.example.com
```

ターミナルには重要な順（要対応 → エラー → 要確認 → 未検査 → 確認済み）に1行ずつ表示される。詳しく読むときや人に渡すときは Markdown で保存する。

```bash
domain-preflight check example.com www.example.com --format markdown --output preflight-2026-11-22.md
```

### B. メールを使わないドメインを守れているか確認する

ブログ専用のドメインなど、メールを一切送受信しないなら `--mail none` を付ける。用途が分かると、Null MX、SPF `-all`、DMARC `p=reject` が揃っているかを判定し、足りないものを提案する。

```bash
domain-preflight check example.com www.example.com --mail none
```

`--mail` を付けない（`unknown`）と、これらの強い設定は提案しない。誤って設定すると、実際に使っているメールが届かなくなるため。

### C. メールを送るドメインを確認する

問い合わせフォームの通知などで送信するなら `--mail send-only`（受信もするなら `send-and-receive`）。DKIM のセレクタが分かれば指定する。

```bash
domain-preflight check example.com mail.example.com --mail send-only --dkim-selector abc123def456
```

- セレクタは、送信サービスの管理画面（Amazon SES なら「DKIM」の CNAME 名の先頭部分）や、受信したメールの `DKIM-Signature` ヘッダーの `s=` で分かる。
- Amazon SES のカスタム MAIL FROM のように、**エンベロープ送信者に別のサブドメインを使う構成**では、そのサブドメイン（例: `mail.example.com`）も一緒に指定する。SPF とバウンス用の MX はそちらにある。
- 公開レコードが正しくても、実際のメールが SPF・DKIM・DMARC を通るとは限らない。最後は自分宛てにテスト送信し、受信したメールの認証結果（Gmail の「メッセージのソースを表示」など）で確認する。

### D. DNS を移行する前後に確認する

移行前に JSON で記録しておき、切り替え後に同じ点検をして比べる。

```bash
# 切り替え前
domain-preflight check example.com www.example.com mail.example.com --format json --output before.json
# ネームサーバーを切り替えた後
domain-preflight check example.com www.example.com mail.example.com --format json --output after.json

# 時刻を除いて、状態と概要だけを比べる（jq が必要）
for f in before after; do
  jq -S '[.targets[] | {host, checks: [.checks[] | {id, status, summary}]}]' "$f.json" > "$f.cmp.json"
done
diff before.cmp.json after.cmp.json
```

- 切り替え直後は、利用者ごとに古い DNS と新しい DNS のどちらが使われるか分からない（TLD の NS のキャッシュは最長1日程度）。`--resolver 1.1.1.1` や `--resolver 8.8.8.8` で問い合わせ先を変えて点検すると、どちらの答えが返っているかの手がかりになる。
- 旧 DNS と新 DNS の答えを直接比べる機能（権威 DNS への問い合わせ）はまだない（計画中）。

### E. 設定を変える前後に記録する

HSTS を延ばす、DMARC を強める、不要なレコードを消す、といった変更の前後に Markdown で保存しておくと、何がいつ変わったかの記録になる。レポートには観測日時と問い合わせ先が入る。

### F. 定期点検・CI に組み込む

`--fail-on` を付けると、指定した重大度以上の「要対応」があったときに終了コード 1 を返す。GitHub Actions で毎週点検する例:

```yaml
name: Domain preflight
on:
  schedule:
    - cron: "0 0 * * 1"   # 毎週月曜 09:00 JST
  workflow_dispatch:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          repository: takafumikobayashi/domain-preflight
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm ci && npm run build
      - run: node dist/cli.js check example.com www.example.com --mail none --format markdown --output report.md --fail-on high
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: preflight-report
          path: report.md
```

- 証明書の期限切れ、参照先のない CNAME、HTTPS に接続できない、といった問題で失敗する。
- `--fail-on medium` にすると、DMARC の書式誤りなども失敗に含まれる。
- リポジトリが公開されている場合、レポートの artifact も公開される点に注意する（内容は公開情報だが、ホストの一覧がまとまる）。

### G. Claude Code から使う（Agent Skill）

`plugin/skills/site-check/SKILL.md` は、AI エージェントがこの CLI を安全に使うための手順書。Claude Code ならプラグインとして2行で入る（[セットアップガイド A](SETUP.md#a-claude-code-プラグインとして入れる推奨)）。

取り込んだら、Claude Code で「example.com の DNS とメールの設定を点検して」のように頼む。スキルの手順に従い、エージェントは次のように進める。

1. 管理しているドメインかと、メールの用途を確認する
2. CLI を実行する
3. 「要対応」「要確認」「未検査」を区別して説明する

変更はせず、提案に留める。

## 4. レポートの読み方

レポートは「このままで大丈夫？」から始まる。目的ごと（Webサイトの公開 / メール / ドメインとDNS）に、最も注意が必要な状態を1行で示し、続けて「まず見てほしいこと」を最大3件挙げる。点数は付けない。

各項目には「かんたんな説明」が付く。

- 何を確認したか
- なぜ大事か
- 放っておくと／設定を誤ると何が起きるか

用語（HSTS、SPF など）は括弧に添えるだけなので、専門知識がなくても読める。

「対象外」は、そのホストでは使っていない（CNAME がない、Web サイトがない、メールを使わない）ため確認する必要がない項目。「未検査」（確認できていない）とは区別している。


| 表示 | status | 意味 | どうするか |
| --- | --- | --- | --- |
| ✗ 要対応 | `finding` | 具体的な問題を観測した | 「確認・改善の候補」を読み、影響を確かめてから直す |
| ! 要確認 | `review` | 状況によって正解が変わる | 候補に書かれた**条件**が自分に当てはまるか判断する |
| - 未検査 | `not_checked` | 確認していない（対象外・未実装・情報不足） | 問題がないという意味ではない |
| ? エラー | `error` | 確認しようとして失敗した | 時間をおいて再実行する。続くならネットワークや DNS を確認 |
| ✓ 確認済み | `pass` | このツールが定めた条件を観測できた | 安全の保証ではない |

重大度（`high` / `medium` / `low` / `info`）は status とは別で、対応の優先度の目安。

Markdown と JSON の各チェックには、次の3つが付く。

- **観測結果**: 何を、どこに問い合わせ、何が返ったか（`evidence`）
- **確認・改善の候補**: 適用する条件付きの提案（`recommendations`）
- **このチェックで分からないこと**: 判断の限界（`limitations`）

総合点は出さない。点数より「何を確認できて、何を確認できていないか」を重視する設計のため。

## 5. よくある疑問

**Q. 「未検査」が多いのは問題？**
A. そうとは限らない。たとえばメール専用のサブドメインは Web を持たないため、Web のチェックは対象外になる。DKIM はセレクタを指定しないと確認できない。DNSSEC は今のバージョンでは常に未検査。

**Q. apex の SPF が `-all` だが、そのドメインでメールを送っている。おかしい？**
A. 必ずしもおかしくない。SPF が見るのはエンベロープ送信者（MAIL FROM）のドメイン。Amazon SES のカスタム MAIL FROM のように別のサブドメインを MAIL FROM にし、DKIM で署名して送る構成なら、apex は `-all` のままで DMARC に合格できる。サブドメインも一緒に点検するとよい。

**Q. 「参照先のない CNAME」が出たが、サイトは表示される。**
A. 参照先が一時的に解決できなかった可能性がある。時間をおいて再実行する。続く場合は、ホスティング側のプロジェクトやカスタムドメインの設定が残っているかを確認する。

**Q. HSTS がないと「要確認」になる。すぐ設定すべき？**
A. HTTPS が安定して動いていることを確かめてから、`max-age=86400`（1日）などの短い値で始め、問題がなければ延ばすのが安全。`includeSubDomains` と `preload` は、すべてのサブドメインが HTTPS に対応してから検討する。

**Q. 他人のサイトを点検してよい？**
A. 公開情報を少数のリクエストで読むだけだが、点検は自分が管理する、または許可を得たサイトに限ること。

## 6. レポートを共有するとき

- Phase 1 のレポートに含まれるのは公開情報だけ。ただし、点検したホストの一覧と構成（使っているホスティングやメールサービス）がまとまった形になる。公開リポジトリや SNS に貼る前に内容を確認する。
- 例として載せる場合は、`example.com` などの予約済みドメインに置き換える。
