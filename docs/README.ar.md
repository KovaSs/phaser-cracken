# ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 ℂ𝕣𝕒𝕔𝕜𝕖𝕟

<p align="center">
  <a href="../README.md">English</a> |
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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 — أداة تجاوز الترخيص للاستخدام غير التجاري.

يتم تجاوز أربع طبقات من الحماية:

1. **فحص Electron JS** — يصحح ملف `WindowManager.js` بحيث يعيد `isEditorActivated()` القيمة `true` دائمًا.
2. **فحص الثنائي Go (حالة المستخدم)** — يقوم بتثبيت وكيل شفاف حول `PhaserEditor` يعترض `-tool print-user-status` ويعيد استجابة اشتراك مزيفة. جميع الأوامر الأخرى تُمرَّر بشفافية إلى الثنائي الحقيقي.
3. **فحص الثنائي Go (بدء تشغيل الخادم — فترة السماح)** — يخزن الثنائي Go طابع وقت فشل المصادقة في `server.log`. عندما تنتهي فترة السماح البالغة 96 ساعة، يرفض البدء. يقوم الوكيل الآن بإفراغ `server.log` و `auth-failure-v1.log` عند كل استدعاء، مما يمنح فترة سماح جديدة في كل مرة يُشغَّل فيها المحرر.
4. **فحص الثنائي Go (بدء تشغيل الخادم — التحقق من HTTP)** — يقوم الثنائي Go بتقديم طلب HTTP مباشر إلى `https://phaser.io/api/user/?has=product:editor:desktop`. إذا رد الخادم بـ "لا إذن"، يقوم الثنائي بالحظر فورًا (بدون وضع السماح). يقوم الوكيل بتعيين `HTTPS_PROXY` إلى عنوان غير صالح، مما يجبر طلب HTTP على الفشل والعودة إلى وضع السماح.

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

## تعليمات الإعداد

اتبع هذه الخطوات بعناية لتجنب المشاكل:

1. **قم بتنزيل وتثبيت Phaser Editor 5**  
   اختر الإصدار المناسب لمنصتك من الروابط أعلاه.

2. **شغِّل المحرر مرة واحدة قبل التصحيح**
   - افتح Phaser Editor بشكل طبيعي.
   - **اقبل اتفاقية ترخيص المستخدم النهائي (EULA)** عندما يُطلب منك ذلك.
   - أغلق المحرر بالكامل بعد قبول EULA.
     > ⚠️ **هام:** التصحيح دون قبول EULA أولاً سيعطل المحرر (سيفشل في الفتح). وذلك لأن ملف علامة EULA (`~/.phasereditor2d/eula-accepted`) يجب أن يكون موجودًا قبل تشغيل الكود المعدل.

3. **شغِّل أداة التصحيح**

   ```bash
   npm run phaser-cracken --auto
   ```

   سيقوم هذا بتطبيق جميع التصحيحات الضرورية وتشغيل المحرر.

4. **استمتع** — بعد أول تشغيل ناجح، لن يطلب المحرر ترخيصًا أو اشتراكًا بعد الآن. جميع الميزات تصبح متاحة دون اتصال بالإنترنت.

## التنصيب

```bash
cd phaser-cracken
npm install
npm run build
```

أو بشكل عام:

```bash
npm install -g .
```

## بدء سريع

```bash
# أمر واحد لفعل كل شيء:
npm run phaser-cracken --auto

# أو خطوة بخطوة:
npm run phaser-cracken --patch            # تجاوز فحص JS
npm run phaser-cracken --install-proxy    # تجاوز فحص الثنائي Go (وكيل + إعادة تعيين السماح)
npm run phaser-cracken --seed-session     # إنشاء ملف جلسة مُنشأ مسبقًا (مطلوب في حالة الفقدان)
npm run phaser-cracken --reset-grace      # إعادة تعيين فترة السماح لفحص بدء تشغيل الثنائي Go
npm run phaser-cracken --run              # تشغيل المحرر
```

## كيف يعمل

### الطبقة 1: غلاف Electron

يستبدل `isEditorActivated()` في `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### الطبقة 2: وكيل الثنائي Go

ينشئ سكريبت وكيل (Node.js أو bash) حول الثنائي `PhaserEditor`:

- `-tool print-user-status` → يعيد JSON مزيفًا مع `subscriptionActive: true`
- كل شيء آخر → يفوض بشفافية إلى `PhaserEditor.real`

```bash
#!/bin/bash
# إعادة تعيين فترة السماح، حظر التحقق من phaser.io،
# اعتراض print-user-status، تفويض كل شيء آخر
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # فرض وضع السماح

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## الأوامر

| الأمر                    | الوصف                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `patch`                  | تصحيح `WindowManager.js`                                                               |
| `restore`                | استعادة `WindowManager.js` الأصلي                                                      |
| `install-proxy`          | تثبيت غلاف وكيل حول الثنائي `PhaserEditor`                                             |
| `install-proxy --force`  | ترقية الوكيل v1 ← v2 أو إعادة التثبيت                                                  |
| `uninstall-proxy`        | إزالة الوكيل، استعادة الثنائي الأصلي                                                   |
| `seed-session`           | إنشاء ملف جلسة مُنشأ مسبقًا (مطلوب عندما يتخطى الثنائي Go التحقق)                      |
| `reset-grace`            | إفراغ `server.log` / `auth-failure-v1.log` لإعادة تعيين فترة السماح 96 ساعة للثنائي Go |
| `status`                 | عرض حالة التصحيح والوكيل والجلسة                                                       |
| `run`                    | تشغيل Phaser Editor                                                                    |
| `auto`                   | إعداد كامل: تصحيح + وكيل + seed-session + إعادة تعيين السماح + تشغيل                                  |
| `auto --no-run`          | إعداد بدون تشغيل                                                                       |
| `backup-session`         | نسخ احتياطي لـ `user-session-v3.bin`                                                   |
| `restore-session [file]` | استعادة الجلسة من النسخة الاحتياطية                                                    |
| `refresh-session`        | تشغيل تسجيل الدخول إلى Phaser.io للحصول على جلسة جديدة                                 |

### خيارات auto

```bash
phaser-cracken auto --no-run    # تخطي التشغيل بعد الإعداد
```

## المنصات المدعومة

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## الملفات التي ينشئها PhaserCracken

| الملف                                    | الغرض                                |
| ---------------------------------------- | ------------------------------------ |
| `WindowManager.js.backup`                | نسخة احتياطية من ملف JS الأصلي       |
| `PhaserEditor.real`                      | الثنائي Go الأصلي (تمت إعادة تسميته) |
| `PhaserEditor.phaser-cracken.bin-backup` | نسخة من الثنائي الأصلي               |
| `PhaserEditor`                           | سكريبت الوكيل (يحل محل الأصلي)       |

### إعادة تعيين ملفات السجل

يقوم الوكيل بإفراغ هذه الملفات عند كل تشغيل للحفاظ على فترة سماح الثنائي Go نشطة:

| الملف                                   | الغرض                                   |
| --------------------------------------- | --------------------------------------- |
| `~/.phasereditor2d/server.log`          | يخزن طابع وقت فشل المصادقة (الثنائي Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | علامة فشل المصادقة (Electron)           |

### الطبقة 4: ملف الجلسة

بدون ملف `user-session-v3.bin`، يتخطى الثنائي Go التحقق من HTTP بالكامل ويذهب مباشرة إلى خطأ "المستخدمين المميزين" — حتى مع حظر `HTTPS_PROXY`. يقوم أمر `seed-session` بكتابة ملف جلسة أدنى بحيث يحاول الثنائي التحقق ويفشل (وضع السماح) ويبدأ الخادم.

```bash
npm run phaser-cracken --seed-session
```

يتم تشغيل هذه الخطوة تلقائيًا كجزء من `phaser-cracken auto`.

## إلغاء التثبيت

```bash
npm run phaser-cracken --restore          # استعادة WindowManager.js
npm run phaser-cracken --uninstall-proxy  # استعادة ثنائي PhaserEditor
```

## المتطلبات

- Node.js >= 14
- تثبيت Phaser Editor 5 Desktop

## إخلاء مسؤولية

هذه الأداة مخصصة للأغراض التعليمية والاستخدام غير التجاري فقط.
يجب عليك شراء ترخيص صالح من [phaser.io](https://phaser.io) إذا كنت تستخدم Phaser Editor تجاريًا.
