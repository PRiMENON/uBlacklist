# uBlacklist

dev ブランチは、開発中です。リポジトリ名は変更する場合があります。

## リスト

* [uBlacklist.txt](uBlacklist.txt) [購読](https://raw.githubusercontent.com/primenon/uBlacklist/master/uBlacklist.txt)
* [uBlockOrigin.txt](uBlockOrigin.txt) [購読](https://raw.githubusercontent.com/primenon/uBlacklist/master/uBlockOrigin.txt)

## エビデンス

* [evidence.md](evidence.md)

[domain-list.yaml](domain-list.yaml) を puppeteer で巡回して Http Status Code をチェックします。


## 使い方

### PC版

1. uBlacklist を [Google Chrome](https://chrome.google.com/webstore/detail/ublacklist/pncfbmialoiaghdehhbnbhkkgmjanfhe) または [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/ublacklist/) にインストールします。
1. uBlacklist の設定ページを開きます。
1. 購読のURLをコピー＆ペーストします。

### スマートフォン版

Google Chrome は拡張機能をサポートしていません。 Firefox は、拡張機能はサポートしているものの、 uBlacklist をインストールできません。
Firefox に uBlock Origin をインストールできますので、uBlock Origin 用のリストを読み込ませてください。

このリポジトリで提供できるように準備しています。

## 追加しないサイト

* Googleがウェブスパムと定義しているサイト
    * [ユーザー生成スパム](https://support.google.com/webmasters/answer/2721437?hl=ja)
    * [ハッキングウェブスパム](https://developers.google.com/web/fundamentals/security/hacked/)
    * [自動生成](https://support.google.com/webmasters/answer/2721306?hl=ja)および[無断複製されたコンテンツ](https://support.google.com/webmasters/answer/2721312?hl=ja&ref_topic=6001971)によるスパム
    * [検索スパム](https://support.google.com/webmasters/answer/93713)
    * [フィッシング](https://safebrowsing.google.com/safebrowsing/report_phish/)
    * [マルウェア](https://www.google.com/safebrowsing/report_badware/)
* stackoverflow.com
* stackexchange.com
* qiita.com
* quora.com
* hatena.ne.jp

## 参考文献

* https://github.com/h-matsuo/uBlacklist-subscription-for-developer
* https://github.com/yussio/web-blacklist
* https://gist.github.com/lmdslyngl/b61bae0ad802dd5e5c9a5746b38c2d3e
* https://github.com/arosh/ublacklist-stackoverflow-translation
* https://github.com/108EAA0A/ublacklist-programming-school
* https://github.com/ncaq/uBlacklistRule
* (archived by the owner) https://github.com/tats-u/tech-spam-filter

## 謝辞

* [uBlacklistを作ってくれた iorate さん](https://github.com/iorate/uBlacklist)

## ライセンス

MIT License.
