<!-- 架空のデータから生成した例です（scripts/sample-report.mjs）。実在のドメインの点検結果ではありません。 -->

# Domain Preflight レポート

- 点検日時: 2026-11-22T00:00:00.000Z
- 対象: example.com, mail.example.com, old.example.com
- モード: public（公開情報のみ、読み取り専用）
- メールの用途: unknown
- DNSの問い合わせ先: 例示用の固定データ
- ツール: domain-preflight 0.1.0（schema 0.1.0）

> 「確認済み」は、このツールが定めた条件を観測できたという意味で、安全の保証ではありません。「未検査」は問題がないという意味ではありません。

## example.com

組織ドメイン: example.com ｜ 要対応 1 / 要確認 3 / 未検査 3 / 確認済み 7

| 状態 | 重大度 | チェック | 概要 |
| --- | --- | --- | --- |
| 要対応 | medium | DMARC (`mail.dmarc`) | _dmarc.example.com のDMARCの書式が誤っています: "\"v=DMARC1; p=none;\""。"v=DMARC1" で始まる必要があり、余分な引用符があると受信側に無視されます。 |
| 要確認 | low | HSTS (`web.hsts`) | HSTSは設定されていません。 |
| 要確認 | low | MX（メールの受信先） (`mail.mx`) | MXはありません。 |
| 要確認 | info | メールの用途 (`mail.context`) | メールの用途は指定されていません。公開レコードからの推測: メールを使わない宣言が公開されています（SPF -all）。 |
| 未検査 | - | CNAMEの参照先 (`dns.dangling-cname`) | CNAMEがないため対象外です。 |
| 未検査 | - | DNSSEC (`dns.dnssec`) | このバージョンではDNSSECを検査していません。 |
| 未検査 | - | DKIM (`mail.dkim`) | DKIMセレクタが指定されていないため、確認していません。 |
| 確認済み | info | 名前解決（A / AAAA / CNAME） (`dns.address`) | example.com はアドレスに解決されます。 |
| 確認済み | info | ネームサーバー (`dns.ns`) | example.com のDNSは Cloudflare で提供されています（NS 2件）。 |
| 確認済み | info | CAA（証明書を発行できるCA） (`dns.caa`) | CAAはありません。どのCAでも証明書を発行できる状態です（多くのサイトと同じ既定の状態）。 |
| 確認済み | info | HTTPS と HTTP からの転送 (`web.https`) | https://example.com/ は 200 を返し、http:// からはHTTPSへ転送されます。 |
| 確認済み | info | TLS証明書 (`web.certificate`) | 証明書は有効です（Google Trust Services、残り38日）。 |
| 確認済み | info | セキュリティ関連ヘッダー (`web.headers`) | X-Content-Type-Options: nosniff が設定されています。 |
| 確認済み | info | SPF (`mail.spf`) | SPFが設定されています（末尾 -all）。 |

### ✗ DMARC — 要対応

_dmarc.example.com のDMARCの書式が誤っています: "\"v=DMARC1; p=none;\""。"v=DMARC1" で始まる必要があり、余分な引用符があると受信側に無視されます。

**観測結果**

- DNS TXT _dmarc.example.com (例示用の固定データ): `"\"v=DMARC1; p=none;\""`

**確認・改善の候補**

- 値を v=DMARC1; p=none; に直してください（入力に引用符を含めないでください）。

**このチェックで分からないこと**

- 公開レコードだけを見ています。実際のメールがSPF・DKIMのアライメントを満たすかは、送信したメールのヘッダーで確認する必要があります。

### ! HSTS — 要確認

HSTSは設定されていません。

**観測結果**

- HTTPS GET https://example.com/ のヘッダー: `Strict-Transport-Security なし`

**確認・改善の候補**

- このホストがHTTPSで安定して動いているなら、HSTSで「常にHTTPSで接続する」ようブラウザに指示できます。最初は max-age=86400（1日）など短い値で始め、問題がなければ延ばしてください。includeSubDomains と preload は、全サブドメインがHTTPSに対応していることを確認してから検討してください。

**このチェックで分からないこと**

- HTTPSのトップページの応答だけを見ています。CDNのゾーン設定とサイト側のヘッダーのどちらが付けているかは区別していません。

### ! MX（メールの受信先） — 要確認

MXはありません。

**観測結果**

- DNS MX example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- 受信するかどうかで対応が変わります。受信しないことが確かな場合に限り、Null MX を検討できます。

**このチェックで分からないこと**

- MXがない場合、送信側はA/AAAAレコードへ配送を試みることがあります（暗黙のMX）。

### ! メールの用途 — 要確認

メールの用途は指定されていません。公開レコードからの推測: メールを使わない宣言が公開されています（SPF -all）。

**観測結果**

- 推測に使ったシグナル: `このホスト名をエンベロープ送信者にしない宣言: SPF -all のみ`

**確認・改善の候補**

- メールの送受信の有無を --mail で指定すると、用途に合った確認・提案になります。用途が分からないうちは、Null MX・SPF -all・DMARC p=reject のような強い設定は提案しません。

**このチェックで分からないこと**

- example.com 自身のレコードだけを見ています。メール送信にサブドメイン（例: SESのMAIL FROM用の mail.example.com）を使う構成では、そちらにMX・SPFがあります。
- DKIMは、セレクタを指定した場合だけ確認しています。
- SPF -all は「このホスト名をエンベロープ送信者（MAIL FROM）にしたメールは正当でない」という意味です。差出人（ヘッダーFrom）にこのドメインを使い、別のMAIL FROMとDKIM署名で送る構成（Amazon SES など）では、SPF -all でも送信できます。

### - CNAMEの参照先 — 未検査

CNAMEがないため対象外です。

**観測結果**

- DNS CNAME example.com (例示用の固定データ): `レコードなし`

### - DNSSEC — 未検査

このバージョンではDNSSECを検査していません。

**このチェックで分からないこと**

- Node.jsの標準DNS APIはDSレコードと検証結果（ADフラグ）を返さないため、example.com のDNSSECの状態は判定していません。
- DNSSECの有効化はレジストラ側でのDSレコード登録が必要で、レジストラによっては有料です。未設定であることだけで問題とはみなしません。

### - DKIM — 未検査

DKIMセレクタが指定されていないため、確認していません。

**このチェックで分からないこと**

- DKIMの公開鍵はセレクタ名が分からないと取得できません。送信サービスの管理画面や、受信したメールの DKIM-Signature ヘッダー（s=）で確認し、--dkim-selector で指定してください。

### ✓ 名前解決（A / AAAA / CNAME） — 確認済み

example.com はアドレスに解決されます。

**観測結果**

- DNS CNAME example.com (例示用の固定データ): `レコードなし`
- DNS A example.com (例示用の固定データ): `203.0.113.10`
- DNS AAAA example.com (例示用の固定データ): `レコードなし`

**このチェックで分からないこと**

- 再帰リゾルバのキャッシュの影響を受けます。権威DNSの現在値とは異なる場合があります。

### ✓ ネームサーバー — 確認済み

example.com のDNSは Cloudflare で提供されています（NS 2件）。

**観測結果**

- DNS NS example.com (例示用の固定データ): `ana.ns.cloudflare.com | bob.ns.cloudflare.com`

**このチェックで分からないこと**

- 再帰リゾルバから見たNSです。レジストリに登録された委任先（親ゾーンのNS）との一致は確認していません。
- DNS移行の直後は、TLDのNSのキャッシュ（最長1日程度）により、利用者ごとに異なるDNSが使われることがあります。

### ✓ CAA（証明書を発行できるCA） — 確認済み

CAAはありません。どのCAでも証明書を発行できる状態です（多くのサイトと同じ既定の状態）。

**観測結果**

- DNS CAA example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- 必須ではありません。使うCAを限定したい場合にCAAを検討できます。CDNを使う場合はCDNが使うCAも許可が必要です。

### ✓ HTTPS と HTTP からの転送 — 確認済み

https://example.com/ は 200 を返し、http:// からはHTTPSへ転送されます。

**観測結果**

- HTTP GET http://example.com/: `301 → https://example.com/`
- HTTP GET https://example.com/: `200`
- HTTPS GET https://example.com/: `200`

**このチェックで分からないこと**

- トップページ（/）だけを確認しています。

### ✓ TLS証明書 — 確認済み

証明書は有効です（Google Trust Services、残り38日）。

**観測結果**

- TLS example.com:443: `発行者: C=US, O=Google Trust Services, CN=WE1 / 有効期限: Dec 30 00:00:00 2026 GMT（残り38日） / SAN: example.com, *.example.com / TLSv1.3`
- TLS example.com:443: `検証: 成功`

**このチェックで分からないこと**

- 点検した端末の信頼ストアで検証しています。対応している最低TLSバージョンは確認していません。
- 自動更新される証明書（Let's Encrypt など）は、残り日数が少なく見えても通常は問題ありません。

### ✓ セキュリティ関連ヘッダー — 確認済み

X-Content-Type-Options: nosniff が設定されています。

**観測結果**

- HTTPS GET https://example.com/ のヘッダー: `x-content-type-options: nosniff / content-security-policy: (なし) / x-frame-options: (なし) / referrer-policy: (なし) / permissions-policy: (なし) / server: cloudflare / cf-ray: (なし)`

**確認・改善の候補**

- Content-Security-Policy はありません。必須ではありませんが、外部スクリプトを読み込むサイトでは、読み込み元を限定する手段として検討できます。

**このチェックで分からないこと**

- ヘッダーの有無と値だけを見ています。CSPなどの内容がサイトに適切かは、サイトの作りによって変わるため判定していません。
- トップページの応答だけを見ています。

### ✓ SPF — 確認済み

SPFが設定されています（末尾 -all）。

**観測結果**

- DNS TXT example.com (例示用の固定データ): `"v=spf1 -all"`

**このチェックで分からないこと**

- SPFの構文全体やDNS参照回数（上限10回）は検査していません。

## mail.example.com

組織ドメイン: example.com ｜ 要対応 2 / 要確認 2 / 未検査 7 / 確認済み 3

| 状態 | 重大度 | チェック | 概要 |
| --- | --- | --- | --- |
| 要対応 | medium | MX（メールの受信先） (`mail.mx`) | MXの値の書式が誤っています（"10 feedback-smtp.us-east-1.amazonses.com"）。優先度が値の中に入っている可能性があります。 |
| 要対応 | medium | DMARC (`mail.dmarc`) | _dmarc.example.com のDMARCの書式が誤っています: "\"v=DMARC1; p=none;\""。"v=DMARC1" で始まる必要があり、余分な引用符があると受信側に無視されます。 |
| 要確認 | low | 名前解決（A / AAAA / CNAME） (`dns.address`) | mail.example.com にはアドレス（A / AAAA）がありません。 |
| 要確認 | info | メールの用途 (`mail.context`) | メールの用途は指定されていません。公開レコードからの推測: 送信と受信に使っている可能性。 |
| 未検査 | - | CNAMEの参照先 (`dns.dangling-cname`) | CNAMEがないため対象外です。 |
| 未検査 | - | DNSSEC (`dns.dnssec`) | このバージョンではDNSSECを検査していません。 |
| 未検査 | - | HTTPS と HTTP からの転送 (`web.https`) | mail.example.com はアドレスに解決されないため、Webの点検は対象外です。 |
| 未検査 | - | TLS証明書 (`web.certificate`) | HTTPSで接続できる状態でないため、証明書は確認していません。 |
| 未検査 | - | HSTS (`web.hsts`) | HTTPSの応答が得られないため、確認していません。 |
| 未検査 | - | セキュリティ関連ヘッダー (`web.headers`) | HTTPSの応答が得られないため、確認していません。 |
| 未検査 | - | DKIM (`mail.dkim`) | DKIMセレクタが指定されていないため、確認していません。 |
| 確認済み | info | ネームサーバー (`dns.ns`) | example.com のDNSは Cloudflare で提供されています（NS 2件）。 |
| 確認済み | info | CAA（証明書を発行できるCA） (`dns.caa`) | CAAはありません。どのCAでも証明書を発行できる状態です（多くのサイトと同じ既定の状態）。 |
| 確認済み | info | SPF (`mail.spf`) | SPFが設定されています（末尾 ~all）。 |

### ✗ MX（メールの受信先） — 要対応

MXの値の書式が誤っています（"10 feedback-smtp.us-east-1.amazonses.com"）。優先度が値の中に入っている可能性があります。

**観測結果**

- DNS MX mail.example.com (例示用の固定データ): `1 10 feedback-smtp.us-east-1.amazonses.com`

**確認・改善の候補**

- MXは「優先度」と「メールサーバーのホスト名」を別々の欄に設定します。値には ホスト名だけを入れてください（例: 優先度 10、値 mail.example.net）。

**このチェックで分からないこと**

- DNS事業者のCSVエクスポートなどでは優先度が表示されないことがあります。公開DNSの応答で確認してください。

### ✗ DMARC — 要対応

_dmarc.example.com のDMARCの書式が誤っています: "\"v=DMARC1; p=none;\""。"v=DMARC1" で始まる必要があり、余分な引用符があると受信側に無視されます。

**観測結果**

- DNS TXT _dmarc.mail.example.com (例示用の固定データ): `レコードなし`
- DNS TXT _dmarc.example.com (例示用の固定データ): `"\"v=DMARC1; p=none;\""`

**確認・改善の候補**

- 値を v=DMARC1; p=none; に直してください（入力に引用符を含めないでください）。

**このチェックで分からないこと**

- 公開レコードだけを見ています。実際のメールがSPF・DKIMのアライメントを満たすかは、送信したメールのヘッダーで確認する必要があります。

### ! 名前解決（A / AAAA / CNAME） — 要確認

mail.example.com にはアドレス（A / AAAA）がありません。

**観測結果**

- DNS CNAME mail.example.com (例示用の固定データ): `レコードなし`
- DNS A mail.example.com (例示用の固定データ): `レコードなし`
- DNS AAAA mail.example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- Webサイトとして使うホストなら、DNSレコードの設定を確認してください。メール専用などWebで使わない名前なら問題ありません。

### ! メールの用途 — 要確認

メールの用途は指定されていません。公開レコードからの推測: 送信と受信に使っている可能性。

**観測結果**

- 推測に使ったシグナル: `受信: MX 10 feedback-smtp.us-east-1.amazonses.com / 送信: SPF (Amazon SES)`

**確認・改善の候補**

- メールの送受信の有無を --mail で指定すると、用途に合った確認・提案になります。用途が分からないうちは、Null MX・SPF -all・DMARC p=reject のような強い設定は提案しません。

**このチェックで分からないこと**

- mail.example.com 自身のレコードだけを見ています。メール送信にサブドメイン（例: SESのMAIL FROM用の mail.mail.example.com）を使う構成では、そちらにMX・SPFがあります。
- DKIMは、セレクタを指定した場合だけ確認しています。
- SPF -all は「このホスト名をエンベロープ送信者（MAIL FROM）にしたメールは正当でない」という意味です。差出人（ヘッダーFrom）にこのドメインを使い、別のMAIL FROMとDKIM署名で送る構成（Amazon SES など）では、SPF -all でも送信できます。

### - CNAMEの参照先 — 未検査

CNAMEがないため対象外です。

**観測結果**

- DNS CNAME mail.example.com (例示用の固定データ): `レコードなし`

### - DNSSEC — 未検査

このバージョンではDNSSECを検査していません。

**このチェックで分からないこと**

- Node.jsの標準DNS APIはDSレコードと検証結果（ADフラグ）を返さないため、example.com のDNSSECの状態は判定していません。
- DNSSECの有効化はレジストラ側でのDSレコード登録が必要で、レジストラによっては有料です。未設定であることだけで問題とはみなしません。

### - HTTPS と HTTP からの転送 — 未検査

mail.example.com はアドレスに解決されないため、Webの点検は対象外です。

**観測結果**

- HTTP GET http://mail.example.com/: `接続失敗 (dns: ENOTFOUND)`
- HTTPS GET https://mail.example.com/: `接続失敗 (dns: ENOTFOUND)`

### - TLS証明書 — 未検査

HTTPSで接続できる状態でないため、証明書は確認していません。

**観測結果**

- TLS mail.example.com:443: `ENOTFOUND`

### - HSTS — 未検査

HTTPSの応答が得られないため、確認していません。

### - セキュリティ関連ヘッダー — 未検査

HTTPSの応答が得られないため、確認していません。

### - DKIM — 未検査

DKIMセレクタが指定されていないため、確認していません。

**このチェックで分からないこと**

- DKIMの公開鍵はセレクタ名が分からないと取得できません。送信サービスの管理画面や、受信したメールの DKIM-Signature ヘッダー（s=）で確認し、--dkim-selector で指定してください。

### ✓ ネームサーバー — 確認済み

example.com のDNSは Cloudflare で提供されています（NS 2件）。

**観測結果**

- DNS NS example.com (例示用の固定データ): `ana.ns.cloudflare.com | bob.ns.cloudflare.com`

**このチェックで分からないこと**

- 再帰リゾルバから見たNSです。レジストリに登録された委任先（親ゾーンのNS）との一致は確認していません。
- DNS移行の直後は、TLDのNSのキャッシュ（最長1日程度）により、利用者ごとに異なるDNSが使われることがあります。

### ✓ CAA（証明書を発行できるCA） — 確認済み

CAAはありません。どのCAでも証明書を発行できる状態です（多くのサイトと同じ既定の状態）。

**観測結果**

- DNS CAA mail.example.com (例示用の固定データ): `レコードなし`
- DNS CAA example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- 必須ではありません。使うCAを限定したい場合にCAAを検討できます。CDNを使う場合はCDNが使うCAも許可が必要です。

### ✓ SPF — 確認済み

SPFが設定されています（末尾 ~all）。

**観測結果**

- DNS TXT mail.example.com (例示用の固定データ): `"v=spf1 include:amazonses.com ~all"`

**このチェックで分からないこと**

- SPFの構文全体やDNS参照回数（上限10回）は検査していません。

## old.example.com

組織ドメイン: example.com ｜ 要対応 2 / 要確認 4 / 未検査 6 / 確認済み 2

| 状態 | 重大度 | チェック | 概要 |
| --- | --- | --- | --- |
| 要対応 | high | CNAMEの参照先 (`dns.dangling-cname`) | CNAMEの参照先 retired-project.pages.dev が存在しません（Cloudflare Pages）。削除済みのサービスを指している可能性があります。 |
| 要対応 | medium | DMARC (`mail.dmarc`) | _dmarc.example.com のDMARCの書式が誤っています: "\"v=DMARC1; p=none;\""。"v=DMARC1" で始まる必要があり、余分な引用符があると受信側に無視されます。 |
| 要確認 | low | 名前解決（A / AAAA / CNAME） (`dns.address`) | old.example.com にはアドレス（A / AAAA）がありません。 |
| 要確認 | low | MX（メールの受信先） (`mail.mx`) | MXはありません。 |
| 要確認 | low | SPF (`mail.spf`) | SPFはありません。 |
| 要確認 | info | メールの用途 (`mail.context`) | メールの用途は指定されていません。公開レコードからの推測: メール用途の手がかりなし。 |
| 未検査 | - | DNSSEC (`dns.dnssec`) | このバージョンではDNSSECを検査していません。 |
| 未検査 | - | HTTPS と HTTP からの転送 (`web.https`) | old.example.com はアドレスに解決されないため、Webの点検は対象外です。 |
| 未検査 | - | TLS証明書 (`web.certificate`) | HTTPSで接続できる状態でないため、証明書は確認していません。 |
| 未検査 | - | HSTS (`web.hsts`) | HTTPSの応答が得られないため、確認していません。 |
| 未検査 | - | セキュリティ関連ヘッダー (`web.headers`) | HTTPSの応答が得られないため、確認していません。 |
| 未検査 | - | DKIM (`mail.dkim`) | DKIMセレクタが指定されていないため、確認していません。 |
| 確認済み | info | ネームサーバー (`dns.ns`) | example.com のDNSは Cloudflare で提供されています（NS 2件）。 |
| 確認済み | info | CAA（証明書を発行できるCA） (`dns.caa`) | CAAはありません。どのCAでも証明書を発行できる状態です（多くのサイトと同じ既定の状態）。 |

### ✗ CNAMEの参照先 — 要対応

CNAMEの参照先 retired-project.pages.dev が存在しません（Cloudflare Pages）。削除済みのサービスを指している可能性があります。

**観測結果**

- DNS CNAME old.example.com (例示用の固定データ): `retired-project.pages.dev`
- DNS A/AAAA retired-project.pages.dev (例示用の固定データ): `名前が存在しない (NXDOMAIN) / レコードなし`

**確認・改善の候補**

- old.example.com を使っていないなら、CNAMEレコードの削除を検討してください。参照先の名前を第三者が取得すると、このサブドメインで任意の内容を配信される（サブドメイン乗っ取り）おそれがあります。
- 使っているなら、参照先のサービス側でプロジェクトやカスタムドメインの設定が残っているか確認してください。

**このチェックで分からないこと**

- 参照先が一時的に解決できないだけの場合もあります。時間をおいて再確認してください。

### ✗ DMARC — 要対応

_dmarc.example.com のDMARCの書式が誤っています: "\"v=DMARC1; p=none;\""。"v=DMARC1" で始まる必要があり、余分な引用符があると受信側に無視されます。

**観測結果**

- DNS TXT _dmarc.old.example.com (例示用の固定データ): `レコードなし`
- DNS TXT _dmarc.example.com (例示用の固定データ): `"\"v=DMARC1; p=none;\""`

**確認・改善の候補**

- 値を v=DMARC1; p=none; に直してください（入力に引用符を含めないでください）。

**このチェックで分からないこと**

- 公開レコードだけを見ています。実際のメールがSPF・DKIMのアライメントを満たすかは、送信したメールのヘッダーで確認する必要があります。

### ! 名前解決（A / AAAA / CNAME） — 要確認

old.example.com にはアドレス（A / AAAA）がありません。

**観測結果**

- DNS CNAME old.example.com (例示用の固定データ): `retired-project.pages.dev`
- DNS A old.example.com (例示用の固定データ): `レコードなし`
- DNS AAAA old.example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- Webサイトとして使うホストなら、DNSレコードの設定を確認してください。メール専用などWebで使わない名前なら問題ありません。

### ! MX（メールの受信先） — 要確認

MXはありません。

**観測結果**

- DNS MX old.example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- 受信するかどうかで対応が変わります。受信しないことが確かな場合に限り、Null MX を検討できます。

**このチェックで分からないこと**

- MXがない場合、送信側はA/AAAAレコードへ配送を試みることがあります（暗黙のMX）。

### ! SPF — 要確認

SPFはありません。

**観測結果**

- DNS TXT old.example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- 送信するかどうかで対応が変わります。送信しないことが確かな場合に限り v=spf1 -all を検討できます。

**このチェックで分からないこと**

- SPFの構文全体やDNS参照回数（上限10回）は検査していません。

### ! メールの用途 — 要確認

メールの用途は指定されていません。公開レコードからの推測: メール用途の手がかりなし。

**観測結果**

- 推測に使ったシグナル: `なし`

**確認・改善の候補**

- メールの送受信の有無を --mail で指定すると、用途に合った確認・提案になります。用途が分からないうちは、Null MX・SPF -all・DMARC p=reject のような強い設定は提案しません。

**このチェックで分からないこと**

- old.example.com 自身のレコードだけを見ています。メール送信にサブドメイン（例: SESのMAIL FROM用の mail.old.example.com）を使う構成では、そちらにMX・SPFがあります。
- DKIMは、セレクタを指定した場合だけ確認しています。
- SPF -all は「このホスト名をエンベロープ送信者（MAIL FROM）にしたメールは正当でない」という意味です。差出人（ヘッダーFrom）にこのドメインを使い、別のMAIL FROMとDKIM署名で送る構成（Amazon SES など）では、SPF -all でも送信できます。

### - DNSSEC — 未検査

このバージョンではDNSSECを検査していません。

**このチェックで分からないこと**

- Node.jsの標準DNS APIはDSレコードと検証結果（ADフラグ）を返さないため、example.com のDNSSECの状態は判定していません。
- DNSSECの有効化はレジストラ側でのDSレコード登録が必要で、レジストラによっては有料です。未設定であることだけで問題とはみなしません。

### - HTTPS と HTTP からの転送 — 未検査

old.example.com はアドレスに解決されないため、Webの点検は対象外です。

**観測結果**

- HTTP GET http://old.example.com/: `接続失敗 (dns: ENOTFOUND)`
- HTTPS GET https://old.example.com/: `接続失敗 (dns: ENOTFOUND)`

### - TLS証明書 — 未検査

HTTPSで接続できる状態でないため、証明書は確認していません。

**観測結果**

- TLS old.example.com:443: `ENOTFOUND`

### - HSTS — 未検査

HTTPSの応答が得られないため、確認していません。

### - セキュリティ関連ヘッダー — 未検査

HTTPSの応答が得られないため、確認していません。

### - DKIM — 未検査

DKIMセレクタが指定されていないため、確認していません。

**このチェックで分からないこと**

- DKIMの公開鍵はセレクタ名が分からないと取得できません。送信サービスの管理画面や、受信したメールの DKIM-Signature ヘッダー（s=）で確認し、--dkim-selector で指定してください。

### ✓ ネームサーバー — 確認済み

example.com のDNSは Cloudflare で提供されています（NS 2件）。

**観測結果**

- DNS NS example.com (例示用の固定データ): `ana.ns.cloudflare.com | bob.ns.cloudflare.com`

**このチェックで分からないこと**

- 再帰リゾルバから見たNSです。レジストリに登録された委任先（親ゾーンのNS）との一致は確認していません。
- DNS移行の直後は、TLDのNSのキャッシュ（最長1日程度）により、利用者ごとに異なるDNSが使われることがあります。

### ✓ CAA（証明書を発行できるCA） — 確認済み

CAAはありません。どのCAでも証明書を発行できる状態です（多くのサイトと同じ既定の状態）。

**観測結果**

- DNS CAA old.example.com (例示用の固定データ): `レコードなし`
- DNS CAA example.com (例示用の固定データ): `レコードなし`

**確認・改善の候補**

- 必須ではありません。使うCAを限定したい場合にCAAを検討できます。CDNを使う場合はCDNが使うCAも許可が必要です。
