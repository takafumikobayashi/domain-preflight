# アーキテクチャ案

> Phase 1 の実装（2026-11-22）に合わせて更新。技術選定は [DECISIONS.md](DECISIONS.md) を参照。

## 1. 基本方針

**TypeScriptの検査エンジンを中核**にし、AIエージェント向けSkillとCloudflare連携を分離する。

```text
User / Claude Code / Codex
              |
          CLI entry
              |
     Input validation / policy
              |
       Check orchestrator
         /          \
 Public collectors   Cloudflare adapter (optional, Phase 3)
 DNS / HTTPS / Mail  REST API (read-only token) | cf CLI (read-only allowlist)
         \          /
          Normalizer
              |
        Rule evaluators
              |
        Report model
         /          \
      JSON         Markdown
```

- **Collectors:** 観測した事実だけを返し、安全／危険の判断をしない。
- **Evaluators:** 観測結果と利用目的をもとに、所見・注意事項を生成する。
- **Reporters:** 判定済みモデルを表示する。JSONとMarkdownで根拠が食い違わないようにする。
- **Agent Skill:** CLIの適切な呼び出し方と結果の読み方を案内する。新しい診断基準をSkill内で独自に作らない。

## 2. ディレクトリ（Phase 1 時点）

```text
src/
  cli.ts            # 引数、終了コード、出力先
  input.ts          # ホスト名の検証、組織ドメイン（PSL）、--mail
  run.ts            # ホストごとの観測 → 判定のオーケストレーション
  report.ts         # text / json / markdown（同じモデルから生成）
  types.ts          # CheckResult、ScanReport など
  net/
    dns.ts          # DnsClient インターフェースと node:dns 実装
    web.ts          # WebClient インターフェースと node:http(s)/tls 実装（公開アドレスに固定して接続）
    address.ts      # 接続してはいけないアドレス範囲
  checks/
    context.ts      # 共通の文脈・ヘルパー
    dns.ts          # dns.*
    mail.ts         # mail.*（observeMail で1回だけ取得し、各チェックで判定）
    web.ts          # web.*（observeWeb で1回だけ取得し、各チェックで判定）
  providers/        # （Phase 3）cloudflare/
tests/              # FakeDns / FakeWeb を使い、ネットワークに接続しない
scripts/            # 架空データからのレポート例の生成
docs/
plugin/             # Claude Code プラグイン（.claude-plugin/plugin.json、skills/site-check/SKILL.md、
                    #   bin/domain-preflight、lib/domain-preflight.cjs = npm run bundle の生成物）
.claude-plugin/marketplace.json   # このリポジトリ自体をマーケットプレイスにする
```

観測（observe*）と判定（check*）を同じファイルに置いているが、判定関数は観測結果だけを受け取る純粋な関数にしている。規模が大きくなったら分ける。

## 3. データモデル（案）

```ts
type CheckStatus =
  | 'pass'
  | 'finding'
  | 'review'
  | 'not_checked'
  | 'error';

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

type Evidence = {
  source: string;       // 例: DNS TXT、HTTPS response、cf API
  observedAt: string;   // ISO 8601
  detail: string;       // 機密情報を除いた内容
};

type CheckResult = {
  id: string;
  title: string;
  status: CheckStatus;
  severity?: Severity;
  summary: string;
  evidence: Evidence[];
  recommendations: string[];
  limitations: string[];
};

type ScanReport = {
  schemaVersion: '0.1.0';
  target: string;
  mode: 'public';   // Phase 3 で 'cloudflare' を追加。CLI では --provider cloudflare で指定する予定
  startedAt: string;
  finishedAt: string;
  checks: CheckResult[];
};
```

型・検査ルールは明示的にし、外部入力と`cf`出力はZod等で**実行時検証**する。上記は説明用であり、そのまま最終仕様としない。

## 4. Public Checkの実装方針

- DNSはNodeのDNS API等を利用。観測元やキャッシュの違いをレポートに明示する。
- HTTP/HTTPSは安全な少数のGET/HEADまたはTLSハンドシェイクに限定。リダイレクトの接続先も検証する。
- 証明書の期限・名前の一致・検証エラーは可能な範囲で区別する。
- HTTPヘッダーの有無だけでなく値と適用対象URLを残す。
- SPF / DMARCはまず公開TXTレコードを取得。解釈は明示的な条件のみで段階的に実装する。
- DKIMは、セレクタを特定できない場合は`not_checked`とする。
- DNSSECは単一のDNS応答だけで完全な検証ができたと扱わない。

## 5. Cloudflare adapter

- ユーザーが**自身の端末で**`cf` CLIのインストールと認証を行う。
- Adapterは`cf`の**既知の読み取り専用コマンドのみ**をサブプロセス実行する。
- シェル文字列連結は避け、引数を配列で渡し、タイムアウト・出力サイズ上限を設ける。
- APIとCLIのバージョン差に備えて出力形式を検証する。
- 実装時点の公式ドキュメントで実コマンド名、権限、JSON形式を確認し、未確認のコマンドを実装しない。
- `cf`がない、権限不足、データ欠落の場合もPublic Checkは継続する。
- アカウントの全件棚卸しはMVP対象外。対象ゾーンに絞る。

## 6. AIとの責任分担

| 担当 | 責務 |
| --- | --- |
| CLI / プログラム | 再現可能な観測・検査・構造化レポート |
| Agent Skill | 対象・モード・利用目的を確認し、安全な操作順を案内 |
| AIアシスタント | JSONを利用者が理解しやすい言葉で説明、優先順位と条件を整理 |
| 利用者 | 運用上の判断、変更作業の承認 |

**AIの文章による説明は補助**であり、プログラムが観測できていない事実を断定しない。

## 7. 設計上の未決事項

- CLIライブラリ、パッケージマネージャー、ビルドとテストの選定
- DNSの解決元・権威DNSとの照合方針
- 証明書検証と最小TLSプロトコル評価のスコープ
- Cloudflare内部設定のどこまでをMVPに含めるか（`cf`実機調査が必要）
- エラーハンドリング・終了コードの仕様
- npm配布・Homebrew等の配布方法（後回し）

これらは最初の技術スパイクで決定し、READMEと要件定義を更新する。
