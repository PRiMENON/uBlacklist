# uBlacklist

[![jp](https://img.shields.io/badge/lang-jp-green.svg)](https://github.com/PRiMENON/uBlacklist/blob/master/README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/PRiMENON/uBlacklist/blob/master/README.en-us.md)

## Subscription list

* [uBlacklist.txt](uBlacklist.txt) [subscription](https://raw.githubusercontent.com/primenon/uBlacklist/master/uBlacklist.txt)
* [uBlockOrigin.txt](uBlockOrigin.txt) [subscription](https://raw.githubusercontent.com/primenon/uBlacklist/master/uBlockOrigin.txt)

## Evidence

* [evidence.md](evidence.md) Checks if the URL is still alive.

## How to use

### PC

1. Install uBlacklist on [Google Chrome](https://chrome.google.com/webstore/detail/ublacklist/pncfbmialoiaghdehhbnbhkkgmjanfhe) or [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/ublacklist/).
1. Open uBlacklist settings page.
1. Copy and paste the subscription URL.

### Mobile phone

Google Chrome does not support the uBlacklist extension.

Firefox can install uBlock Origin, so use the list for uBlock origin.

1. Launch Firefox for Android
1. Tap Add-ons from the certical 3-point reader menu.
1. Tap uBlock Origin
1. Tap Settings
1. Tap the filter list at the top, then tap import at the bottom 
1. An iput from will appear, paste the URL of [uBlockOrigin.txt](https://raw.githubusercontent.com/primenon/uBlacklist/master/uBlockOrigin.txt)
1. Tap the ✔

## Add site

* Machine translation site
* Web proxy site
* GitHub clone site
* Twitter clone site
* Web archive site
* Gossip and blow up site

## Not add site

* Sites that Google defines as web spam
    * [User-generated spam](https://support.google.com/webmasters/answer/2721437?hl=ja)
    * [Hacked web spam](https://developers.google.com/web/fundamentals/security/hacked/)
    * [Spammy automatically-generated content](https://support.google.com/webmasters/answer/2721306?hl=ja)
    * [Scraped content](https://support.google.com/webmasters/answer/2721312?hl=ja&ref_topic=6001971)
    * [Search engine spam](https://support.google.com/webmasters/answer/93713)
    * [Phising](https://safebrowsing.google.com/safebrowsing/report_phish/)
    * [malware](https://www.google.com/safebrowsing/report_badware/)
* stackoverflow.com
* stackexchange.com
* qiita.com
* quora.com
* hatena.ne.jp

## Caution

[domain-list.yaml](domain-list.yaml) may redirect you to sites containing malware or malicious scripts.
Running puppeteer is the same as accessing the site with a browser, **so please be very careful**.

## Reference

* https://github.com/h-matsuo/uBlacklist-subscription-for-developer
* https://github.com/yussio/web-blacklist
* https://gist.github.com/lmdslyngl/b61bae0ad802dd5e5c9a5746b38c2d3e
* https://github.com/arosh/ublacklist-stackoverflow-translation
* https://github.com/108EAA0A/ublacklist-programming-school
* https://github.com/ncaq/uBlacklistRule
* (archived by the owner) https://github.com/tats-u/tech-spam-filter

## Acknowledgement

* [iorate](https://github.com/iorate/uBlacklist) uBlacklist Creator / Developer.

## License

MIT License.
