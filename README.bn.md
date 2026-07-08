# ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 ℂ𝕣𝕒𝕔𝕜𝕖𝕟

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 লাইসেন্স বাইপাস ইউটিলিটি অ-বাণিজ্যিক ব্যবহারের জন্য।

চারটি সুরক্ষা স্তর বাইপাস করা হয়:

1. **Electron JS চেক** — `WindowManager.js` প্যাচ করে যাতে `isEditorActivated()` সবসময় `true` রিটার্ন করে।
2. **Go বাইনারি চেক (ব্যবহারকারীর অবস্থা)** — `PhaserEditor`-এর চারপাশে একটি প্রোক্সি স্থাপন করে যা `-tool print-user-status` ইন্টারসেপ্ট করে এবং একটি জাল সাবস্ক্রিপশন রেসপন্স রিটার্ন করে। অন্যান্য সব কমান্ড প্রকৃত বাইনারিতে প্রেরণ করা হয়।
3. **Go বাইনারি চেক (সার্ভার স্টার্টআপ — গ্রেস পিরিয়ড)** — Go বাইনারি `server.log`-এ অথেনটিকেশন ব্যর্থতার টাইমস্ট্যাম্প সংরক্ষণ করে। 96-ঘন্টার গ্রেস পিরিয়ড শেষ হলে, এটি শুরু হতে অস্বীকার করে। প্রোক্সি এখন প্রতিটি আহ্বানে `server.log` এবং `auth-failure-v1.log` খালি করে দেয়, যা সম্পাদক প্রতিবার চালু হলে একটি নতুন গ্রেস পিরিয়ড প্রদান করে।
4. **Go বাইনারি চেক (সার্ভার স্টার্টআপ — HTTP বৈধতা)** — Go বাইনারি সরাসরি `https://phaser.io/api/user/?has=product:editor:desktop`-এ একটি HTTP অনুরোধ পাঠায়। যদি সার্ভার "কোনও অনুমতি নেই" উত্তর দেয়, বাইনারি অবিলম্বে ব্লক করে (কোনও গ্রেস মোড নেই)। প্রোক্সি `HTTPS_PROXY` একটি অবৈধ ঠিকানায় সেট করে, HTTP অনুরোধ ব্যর্থ করতে এবং গ্রেস মোডে ফিরে যেতে বাধ্য করে।

## ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣

### 5.0.2 desktop

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-5.0.2-Setup.exe) <br>
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-macos.dmg) <br>
[macOS (Apple Silicon)](https://disk.yandex.ru/d/GYCs4Yy47L2gYA) <br>
[Linux](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-linux.zip) <br>

### 5.0.2 core

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-windows.zip) <br>
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos.zip) <br>
[macOS (Apple Silicon)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos_arm.zip) <br>

## সেটআপ নির্দেশাবলী

সমস্যা এড়াতে এই ধাপগুলি সাবধানে অনুসরণ করুন:

1. **Phaser Editor 5 ডাউনলোড এবং ইনস্টল করুন**  
   উপরের লিঙ্কগুলি থেকে আপনার প্ল্যাটফর্মের জন্য উপযুক্ত সংস্করণ নির্বাচন করুন।

2. **প্যাচ করার আগে একবার সম্পাদক চালু করুন**
   - Phaser Editor স্বাভাবিকভাবে খুলুন।
   - প্রম্পট করা হলে **EULA** (শেষ ব্যবহারকারী লাইসেন্স চুক্তি) গ্রহণ করুন।
   - EULA গ্রহণ করার পর সম্পাদক সম্পূর্ণরূপে বন্ধ করুন।
     > ⚠️ **গুরুত্বপূর্ণ:** EULA প্রথমে গ্রহণ না করে প্যাচ করলে সম্পাদক নষ্ট হবে (এটি খুলতে ব্যর্থ হবে)। কারণ EULA ফ্ল্যাগ ফাইল (`~/.phasereditor2d/eula-accepted`) পরিবর্তিত কোড চালানোর আগে অবশ্যই বিদ্যমান থাকতে হবে।

3. **প্যাচার চালু করুন**

   ```bash
   npm run phaser-cracken --auto
   ```

   এটি সমস্ত প্রয়োজনীয় প্যাচ প্রয়োগ করবে এবং সম্পাদক চালু করবে।

4. **উপভোগ করুন** – প্রথম সফল লঞ্চের পর, সম্পাদক আর লাইসেন্স বা সাবস্ক্রিপশন চাইবে না। সমস্ত বৈশিষ্ট্য অফলাইনে উপলব্ধ হবে।

## ইনস্টলেশন

```bash
cd phaser-cracken
npm install
npm run build
```

অথবা গ্লোবালি:

```bash
npm install -g .
```

## দ্রুত শুরু

```bash
# সবকিছু করার জন্য একটি কমান্ড:
npm run phaser-cracken --auto

# অথবা ধাপে ধাপে:
npm run phaser-cracken --patch            # JS চেক বাইপাস
npm run phaser-cracken --install-proxy    # Go বাইনারি চেক বাইপাস (প্রোক্সি + গ্রেস রিসেট)
npm run phaser-cracken --reset-grace      # Go বাইনারি স্টার্টআপ চেকের জন্য গ্রেস পিরিয়ড রিসেট
npm run phaser-cracken --run              # সম্পাদক চালু করুন
```

## এটি কীভাবে কাজ করে

### স্তর 1: Electron Shell

`WindowManager.js`-এ `isEditorActivated()` প্রতিস্থাপন করে:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### স্তর 2: Go বাইনারি প্রোক্সি

`PhaserEditor` বাইনারির চারপাশে একটি প্রোক্সি স্ক্রিপ্ট (Node.js বা bash) তৈরি করে:

- `-tool print-user-status` → `subscriptionActive: true` সহ জাল JSON রিটার্ন করে
- অন্যান্য সবকিছু → স্বচ্ছভাবে `PhaserEditor.real`-এ প্রেরণ করে

```bash
#!/bin/bash
# গ্রেস পিরিয়ড রিসেট করে, phaser.io বৈধতা ব্লক করে,
# print-user-status ইন্টারসেপ্ট করে, বাকি সব প্রেরণ করে
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # গ্রেস মোড বাধ্যকরী

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## কমান্ড

| কমান্ড                   | বিবরণ                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `patch`                  | `WindowManager.js` প্যাচ করুন                                                                 |
| `restore`                | মূল `WindowManager.js` পুনরুদ্ধার করুন                                                        |
| `install-proxy`          | `PhaserEditor` বাইনারির চারপাশে প্রোক্সি র্যাপার ইনস্টল করুন                                  |
| `install-proxy --force`  | প্রোক্সি v1 → v2 আপগ্রেড বা পুনরায় ইনস্টল করুন                                               |
| `uninstall-proxy`        | প্রোক্সি সরান, মূল বাইনারি পুনরুদ্ধার করুন                                                    |
| `reset-grace`            | Go বাইনারির 96 ঘন্টার গ্রেস পিরিয়ড রিসেট করতে `server.log` / `auth-failure-v1.log` খালি করুন |
| `status`                 | প্যাচ, প্রোক্সি এবং সেশন অবস্থা দেখান                                                         |
| `run`                    | Phaser Editor চালু করুন                                                                       |
| `auto`                   | সম্পূর্ণ সেটআপ: প্যাচ + প্রোক্সি + গ্রেস রিসেট + চালু                                         |
| `auto --no-run`          | চালু না করে সেটআপ                                                                             |
| `backup-session`         | `user-session-v3.bin` ব্যাকআপ করুন                                                            |
| `restore-session [file]` | ব্যাকআপ থেকে সেশন পুনরুদ্ধার করুন                                                             |
| `refresh-session`        | নতুন সেশন পেতে Phaser.io লগইন চালু করুন                                                       |

### অটো অপশন

```bash
phaser-cracken auto --no-run    # সেটআপের পর লঞ্চ এড়িয়ে যান
```

## সমর্থিত প্ল্যাটফর্ম

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## PhaserCracken দ্বারা তৈরি ফাইল

| ফাইল                                     | উদ্দেশ্য                                   |
| ---------------------------------------- | ------------------------------------------ |
| `WindowManager.js.backup`                | মূল JS ফাইলের ব্যাকআপ                      |
| `PhaserEditor.real`                      | মূল Go বাইনারি (নাম পরিবর্তিত)             |
| `PhaserEditor.phaser-cracken.bin-backup` | মূল বাইনারির কপি                           |
| `PhaserEditor`                           | প্রোক্সি স্ক্রিপ্ট (মূলটি প্রতিস্থাপন করে) |

### লগ ফাইল রিসেট

প্রোক্সি প্রতিটি লঞ্চে এই ফাইলগুলি খালি করে Go বাইনারির গ্রেস পিরিয়ড সক্রিয় রাখে:

| ফাইল                                    | উদ্দেশ্য                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | অথেনটিকেশন ব্যর্থতার টাইমস্ট্যাম্প সংরক্ষণ করে (Go বাইনারি) |
| `~/.phasereditor2d/auth-failure-v1.log` | অথেনটিকেশন ব্যর্থতার মার্কার (Electron)                     |

## আনইনস্টলেশন

```bash
npm run phaser-cracken --restore          # WindowManager.js পুনরুদ্ধার করুন
npm run phaser-cracken --uninstall-proxy  # PhaserEditor বাইনারি পুনরুদ্ধার করুন
```

## প্রয়োজনীয়তা

- Node.js >= 14
- Phaser Editor 5 Desktop ইনস্টল করা থাকতে হবে

## দাবিত্যাগ

এই টুলটি শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে এবং অ-বাণিজ্যিক ব্যবহারের জন্য।
আপনি যদি বাণিজ্যিকভাবে Phaser Editor ব্যবহার করেন, তাহলে [phaser.io](https://phaser.io) থেকে একটি বৈধ লাইসেন্স কিনতে হবে।
