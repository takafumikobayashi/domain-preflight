# Domain Preflight — Claude Code plugin

自分が管理するドメインの DNS・HTTPS・メール認証（SPF / DMARC / DKIM）を**読み取り専用**で点検し、「要対応」「要確認」「未検査」を区別して説明するプラグイン。設定は変更しない。

## インストール

```text
/plugin marketplace add takafumikobayashi/domain-preflight
/plugin install domain-preflight@domain-preflight
```

Node.js 24 以上が必要（CLI 本体は `lib/domain-preflight.cjs` に同梱されており、npm のインストールは不要）。

## 中身

| パス | 内容 |
| --- | --- |
| `skills/site-check/SKILL.md` | 点検の手順と、提案してはいけないこと（用途不明のメールに Null MX を勧めない等） |
| `bin/domain-preflight` | プラグインが有効な間、Bash から `domain-preflight` で呼べるコマンド |
| `lib/domain-preflight.cjs` | CLI 本体（リポジトリの `src/` から `npm run bundle` で生成。手で編集しない） |

使い方は「example.com の DNS とメールの設定を点検して」と頼むだけ。詳しくはリポジトリの [docs/USAGE.md](https://github.com/takafumikobayashi/domain-preflight/blob/main/docs/USAGE.md)。
