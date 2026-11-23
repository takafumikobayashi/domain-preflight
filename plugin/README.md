# Domain Preflight — Claude Code plugin

自分が管理するドメインの DNS・HTTPS・メール認証（SPF / DMARC / DKIM）を**読み取り専用**で点検し、「要対応」「要確認」「未検査」を区別して説明するプラグイン。設定は変更しない。

> [!WARNING]
> **利用上の注意: 自分が管理しているドメイン以外には使わないでください。**
>
> 点検してよいのは、あなた自身か所属する組織が管理しているドメインです。制作や保守を請け負っていて、管理を任されているドメインも含みます。それ以外のサイトは点検しないでください。
>
> このツールは公開情報を読むだけで、設定の変更や攻撃はしません。それでも、頼まれていない第三者のサイトを点検すれば、相手からは無断の調査に見えます。トラブルや誤解のもとになり、通信がブロックされたり、通報されたりすることもあります。点検の通信は相手のサーバーの記録に残ります（[どんな通信をするか](https://github.com/takafumikobayashi/domain-preflight/blob/main/docs/USAGE.md#7-点検でどんな通信をするか)）。
>
> このツールの使い方によって生じた結果について、作者は責任を負いません（[MIT License](https://github.com/takafumikobayashi/domain-preflight/blob/main/LICENSE)）。

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
