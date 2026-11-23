# Field Notes — 実際の点検・移行作業から得た知見

> 本プロジェクトの出発点になった実作業（Cloudflare `cf` CLI、Netlify CLI、AWS CLI を使ったドメイン点検・DNS移行・メール認証の修正）の記録を、要件に反映するために整理したもの。
> 実在のドメイン名・ID・トークンは載せない。例は `example.com` などの予約済みドメインに置き換えている。

## 1. 実作業の概要

| 作業 | 内容 |
| --- | --- |
| アカウント棚卸し | ゾーン、DNSレコード、Pages / Workers、Accessアプリ、ゾーン設定、Security Center を読み取り専用で一覧化 |
| 不要リソース整理 | 初期に付けたまま残っていた Access アプリと IdP、使われていない A / CNAME レコード17件を、バックアップを取ってから削除 |
| メールを使わないドメインの防御 | Null MX、SPF `-all`、DMARC `p=reject` を apex と `www` に設定（メールを使わないことを確認してから） |
| TLS / HSTS | SSL モード strict、最小 TLS 1.2、HSTS `max-age=86400`（短く始める）、nosniff |
| DNSSEC | DS レコードまで取得したが、レジストラ側で有料オプションだったため見送り |
| メール認証の修正 | 問い合わせフォーム（Lambda → SES）用の SPF / DMARC / MX の書式誤りを修正し、SES の MAIL FROM 検証を SUCCESS に戻した |
| DNS移行 | Netlify DNS → Cloudflare DNS（ホスティングは据え置き）。19件をAPIから複製、切り替え前に全件の応答を突き合わせ、切り替え後に全10ホストとメールを確認 |

## 2. 要件に反映すべき教訓

### 2.1 apex だけ見てメール用途を判断してはいけない

apex に MX も SPF もないのを見て「メール未設定」と判断し、Null MX を提案しかけた。実際は `mail.example.com` に SES の MAIL FROM 用の MX / SPF があり、DKIM の CNAME（`*._domainkey`）も3件あった。**apex を Null MX にしても送信には影響しないが、利用者の理解とずれた提案になる**。

→ メール用途は「入力されたホスト」だけでなく、組織ドメイン・`_dmarc`・既知の送信基盤（SES、Google Workspace、Microsoft 365 など）の痕跡から**推測し、推測であることを示した上で利用者に確認する**。

### 2.2 管理画面では見えない書式の誤りがよくある

- TXT 値が二重に引用されていた: `""v=DMARC1; p=none;""`。DMARC として無効。
- MX の値に優先度が含まれていた: 優先度 `1`、値 `10 feedback-smtp.example.net`。
- プロバイダーの CSV エクスポートは MX の優先度を落とすため、エクスポートだけでは誤りに気付けない。

→ 公開 DNS の応答そのものを検査する。「値が `v=` で始まらない」「引用符を含む」「交換ホスト名に空白を含む」などは、用途に関係なく `finding` にできる高信頼のチェック。

### 2.3 Cloudflare DNS を使う ≠ Cloudflare を通る

- ゾーンの HSTS / Always Use HTTPS / 最小 TLS は**プロキシ有効（オレンジ雲）のホストにだけ**効く。
- Netlify / Vercel / SES 向けのレコードは DNS-only のまま。これらに Cloudflare 側の HTTP 設定は適用されない。
- Pages の CNAME はプロキシ有効にできる。証明書（Universal SSL）が発行されてから有効にした。

→ Cloudflare モードでは、ホストごとに「proxied / DNS-only」を取得し、公開側の観測（`server: cloudflare`、`cf-ray`）と照合する。

### 2.4 DNS の答えは問い合わせ先で変わる

- 移行直後、公開リゾルバのキャッシュと権威 DNS で答えが食い違った。`.tokyo` などの TLD の NS は最長1日キャッシュされる。
- レジストリ側の NS 反映は RDAP で確認した（IANA のブートストラップ → TLD の RDAP サーバー）。
- 旧 DNS のゾーンはロールバック用に数日残した。両方が同じ答えを返す限り問題ない。

→ 「親ゾーンの委任」「権威 DNS」「再帰リゾルバ」を区別して記録する。食い違いは `review`（移行中の可能性）として扱い、断定しない。

### 2.5 `cf` CLI は若く、推測でコマンドを書けない

確認時点の `cf` は v0.15.0。

- 推測したコマンドの多くが存在しなかった（例: 設定の一括取得はなく、`cf zones settings get <setting-id>` を設定ごとに呼ぶ）。
- 一部の一覧系（API トークン一覧など）は OAuth ログインでも 403 だった。
- `cf analytics` は Zero Trust 向けで、Webサイトのアクセス数には使えなかった（GraphQL Analytics API が別途必要）。
- 名前が読み取りっぽくても副作用のあるコマンドがある（例: `cf dns records scan` はスキャンを開始する）。
- 破壊的コマンドは `--force` がないと止まる。`--dry-run` で送信されるリクエストを確認できる。
- OAuth ログイン（`cf auth login`）のトークンは書き込み権限を持つ。ツール側の許可リストで呼び出しを絞っても、**トークン自体の権限は小さくならない**。

→ Cloudflare 連携は「取得方法を差し替えられる」設計にし、読み取り専用 API トークンでの REST API 呼び出しを第一候補にする（`docs/DECISIONS.md` 参照）。

### 2.6 典型的な「残骸」

- 公開サイトに、初期のテスト用 Access アプリがそのまま残っていた（OTP の IdP も）。
- 使われていないサブドメインの A レコードが残り、到達するとプロキシのエラー画面がタイムアウトしていた。
- 移行後に旧 DNS プロバイダーのゾーンが残る。

→ Resource Cleaner（将来）の候補。MVP では「指す先のない CNAME」（乗っ取りリスク）だけを公開情報で検出する。

### 2.7 推奨には運用上の前提がある

- HSTS は1日から始め、問題がなければ延ばす。`includeSubDomains` は全サブドメインの HTTPS 対応が前提。
- DMARC `p=reject` は、SPF / DKIM のアライメントが通ることを実メールで確認してから（今回はテスト送信で SPF / DKIM / DMARC が PASS したのを確認後に強化）。
- DNSSEC はレジストラ次第で有料。未設定を事故扱いしない。
- Null MX / SPF `-all` / DMARC `p=reject` の組は、そのホストでメールを送受信しないことが確認できた場合のみ。

## 3. 追加したいチェック（MVP 候補）

| ID | 内容 | 根拠 |
| --- | --- | --- |
| `dns.record-format` | TXT の余分な引用符、MX 値の空白など | 2.2 |
| `dns.dangling-cname` | CNAME の先が NXDOMAIN（Pages / Vercel / Netlify 等の残骸） | 2.6 |
| `dns.caa` | CAA があれば、使っている CA が許可されているか | Cloudflare は Let's Encrypt / Google Trust Services 等で発行する |
| `dns.delegation` | 親ゾーンの NS と権威 DNS の NS の一致 | 2.4（MVP では `review` 止まり） |
| `mail.context` | メール用途の推測シグナル（MX、SPF の include、既知の DKIM CNAME） | 2.1 |
