# セットアップガイド

Domain Preflight は2つの部品でできている。

| 部品 | 役割 | 必須か |
| --- | --- | --- |
| **CLI**（`domain-preflight` コマンド） | 点検と判定を行い、レポートを出す | 必須 |
| **Agent Skill**（`SKILL.md`） | Claude Code などの AI エージェントが CLI を正しく使い、結果を説明するための手順書 | AI と対話して使う場合のみ |

Skill は CLI を呼び出すだけで、点検の機能は持たない。入れ方は2通り。

| 入れ方 | 手順 | 向いている人 |
| --- | --- | --- |
| **A. Claude Code プラグイン**（推奨） | `/plugin` で2行。CLI と Skill が一緒に入る | Claude Code で対話しながら使う人 |
| **B. 手動** | リポジトリをビルドし、コマンドと Skill を自分で配置 | CLI だけ使う人、CI、Claude Code 以外のエージェント、開発者 |

## A. Claude Code プラグインとして入れる（推奨）

> **公開前:** この手順は、リポジトリが GitHub に公開された後に使える。

前提は Node.js 24 以上だけ（`node -v` で確認）。npm でのインストールやビルドは不要。プラグインには、1ファイルにまとめた CLI（`plugin/lib/domain-preflight.cjs`）が同梱されている。

Claude Code のセッションで:

```text
/plugin marketplace add takafumikobayashi/domain-preflight
/plugin install domain-preflight@domain-preflight
```

シェルからなら:

```bash
claude plugin marketplace add takafumikobayashi/domain-preflight
claude plugin install domain-preflight@domain-preflight
```

入れた後に Claude Code を新しく起動すると、次の2つが使えるようになる。

- Skill: 「example.com の DNS とメールの設定を点検して」と頼むと、手順に従って点検・説明する
- コマンド: プラグインが有効な間、Claude が実行する Bash から `domain-preflight` で呼べる（プラグインの `bin/` が PATH に入る）

更新は `claude plugin update domain-preflight@domain-preflight`、削除は `claude plugin uninstall domain-preflight@domain-preflight`。

注意: プラグインの `bin/` は Claude Code の中だけで PATH に入る。普段のターミナルからも `domain-preflight` を使いたい場合や、CI で使う場合は B の手順で CLI を入れる。`bin/` を含むプラグインは claude.ai と Cowork にはインストールされない（コマンドを実行できる Claude Code 向け）。

## B. 手動で入れる

**先に CLI をセットアップし、どこからでも `domain-preflight` で呼べる状態にしてから** Skill を入れる。

### B-1. 前提

| もの | 確認方法 | 備考 |
| --- | --- | --- |
| Node.js 24 以上 | `node -v` | nvm を使っている場合、グローバルにインストールしたコマンドは Node のバージョンごとに別。以降の作業と普段使いを同じバージョンで行う |
| Git | `git --version` | |
| jq（任意） | `jq --version` | DNS 移行の前後比較（[USAGE](USAGE.md) D）で使う |

### B-2. CLI をインストールする

npm への公開前なので、リポジトリから入れる。

```bash
git clone https://github.com/takafumikobayashi/domain-preflight.git
cd domain-preflight
npm ci
npm run build
```

次に、どのディレクトリからでも `domain-preflight` で呼べるようにする。どちらか一方を選ぶ。

| 方法 | コマンド | 向いている人 |
| --- | --- | --- |
| **リンク**（推奨） | `npm link` | リポジトリを更新して使い続ける人。ビルドし直すだけで反映される |
| **コピー** | `npm install -g .` | リポジトリを残さず使いたい人。更新のたびに入れ直す |

確認する。

```bash
cd ~                      # リポジトリの外で試す
domain-preflight --version
domain-preflight check example.com
```

バージョンが表示され、点検結果が出れば完了。

> npm に公開された後は、インストールせずに `npx domain-preflight check example.com` で使える予定。

### B-3. Skill を取り込む（Claude Code）

Claude Code は、`skills/<名前>/SKILL.md` の形で置かれたスキルを読み込む。置き場所は2通り。

| 置き場所 | 効く範囲 |
| --- | --- |
| `~/.claude/skills/domain-preflight-site-check/SKILL.md` | 自分のすべてのプロジェクト |
| `<プロジェクト>/.claude/skills/domain-preflight-site-check/SKILL.md` | そのプロジェクトだけ（リポジトリに含めればチームで共有できる） |

リポジトリの更新に追従させたいなら、コピーではなくシンボリックリンクにする。

```bash
# すべてのプロジェクトで使う場合（リンク。リポジトリを更新すると Skill も更新される）
mkdir -p ~/.claude/skills
ln -s "$(pwd)/plugin/skills/site-check" ~/.claude/skills/domain-preflight-site-check

# コピーで置く場合
mkdir -p ~/.claude/skills/domain-preflight-site-check
cp plugin/skills/site-check/SKILL.md ~/.claude/skills/domain-preflight-site-check/
```

（どちらも domain-preflight リポジトリの中で実行する。）

#### 確認する

1. Claude Code を**新しく起動**する（実行中のセッションには、後から置いたスキルが反映されないことがある）。
2. 「example.com の DNS とメールの設定を点検して」のように頼む。
3. エージェントがメールの用途などを確認し、`domain-preflight check ...` を実行して、結果を「要対応」「要確認」「未検査」に分けて説明すれば成功。

エージェントが「`domain-preflight` が見つからない」と言う場合は、B-2 の CLI のセットアップが終わっていないか、Claude Code から見える PATH にコマンドがない（[トラブルシューティング](#6-トラブルシューティング)）。

#### Claude Code 以外のエージェント

シェルのコマンドを実行できるエージェント（Codex など）なら、`SKILL.md` の「手順」と「絶対ルール」を、そのエージェントの指示ファイル（例: リポジトリの `AGENTS.md`）に書き写せば同じように使えるはず。ただし、Claude Code 以外での動作は確認していない。

コマンドを実行できないチャット型の AI では使えない（その用途には将来の MCP サーバー版を検討中）。

### B-4. 更新する

```bash
cd domain-preflight
git pull
npm ci
npm run build
# 「コピー」で入れた場合だけ、入れ直す
npm install -g .
```

Skill をシンボリックリンクで置いた場合は、`git pull` で自動的に新しくなる。コピーで置いた場合は、もう一度コピーする。

### B-5. アンインストール

```bash
npm uninstall -g domain-preflight          # npm link / npm install -g のどちらでも
rm -rf ~/.claude/skills/domain-preflight-site-check
```

## トラブルシューティング

| 症状 | 原因と対処 |
| --- | --- |
| `command not found: domain-preflight` | プラグインで入れた場合は、Claude Code の外では使えない（A の注意を参照）。手動の場合は B-2 の `npm link` / `npm install -g .` をしていない。nvm を使っているなら、インストールした時と同じ Node のバージョンになっているか `node -v` で確認する |
| 「Node.js 24 以上が必要です」と表示される | Node が古い。`nvm install 24` などで更新し、そのバージョンで B-2 をやり直す（プラグインの場合は Node を更新するだけでよい） |
| Claude Code がスキルを使わない | 置き場所が `skills/<名前>/SKILL.md` の形になっているか、ファイル先頭の `name:` / `description:` が残っているかを確認し、Claude Code を新しく起動する。「domain-preflight-site-check スキルで点検して」と名前を出して頼んでもよい |
| エージェントからだけコマンドが見つからない | Claude Code を起動したシェルの PATH に、npm のグローバル bin（`npm prefix -g` の下の `bin`）が入っているか確認する |
| DNS が `TIMEOUT` や `error` になる | ネットワークや DNS の一時的な問題。時間をおくか、`--resolver 1.1.1.1` で問い合わせ先を変えて試す |
| 社内ネットワークで HTTPS のチェックだけ失敗する | 現在の CLI は HTTP プロキシ（`HTTPS_PROXY` など）に対応していない。プロキシを通さないネットワークで実行する |

## Cloudflare 連携（予定）

Cloudflare の内部設定の照合（Phase 3）は未実装。実装後は、Zone / DNS / Zone Settings の **Read 権限だけを持つ API トークン**の作成手順をここに追記する（理由は [DECISIONS](DECISIONS.md) D9）。今は Cloudflare の設定は不要。
