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

[🇹🇭 ไทย](./README.th.md)

ยูทิลิตีสำหรับบายพาสไลเซนส์ ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 สำหรับการใช้งานที่ไม่ใช่เชิงพาณิชย์

บายพาสการป้องกันสี่ชั้น:

1. **การตรวจสอบ Electron JS** — แก้ไข `WindowManager.js` ให้ `isEditorActivated()` คืนค่า `true` เสมอ
2. **การตรวจสอบไบนารี Go (สถานะผู้ใช้)** — ติดตั้งพร็อกซีแบบโปร่งใสรอบ `PhaserEditor` ที่ดักจับ `-tool print-user-status` และคืนค่า JSON การสมัครสมาชิกปลอม คำสั่งอื่น ๆ ทั้งหมดจะถูกส่งต่อไปยังไบนารีจริงแบบโปร่งใส
3. **การตรวจสอบไบนารี Go (การเริ่มต้นเซิร์ฟเวอร์ — ระยะเวลาผ่อนผัน)** — ไบนารี Go เก็บประทับเวลาความล้มเหลวในการตรวจสอบสิทธิ์ใน `server.log` เมื่อระยะเวลาผ่อนผัน 96 ชั่วโมงหมดลง มันจะปฏิเสธที่จะเริ่มทำงาน พร็อกซีจะตัดทอน `server.log` และ `auth-failure-v1.log` ทุกครั้งที่เรียกใช้ ทำให้ได้รับระยะเวลาผ่อนผันใหม่ทุกครั้งที่เปิดแก้ไข
4. **การตรวจสอบไบนารี Go (การเริ่มต้นเซิร์ฟเวอร์ — การตรวจสอบ HTTP)** — ไบนารี Go ทำการร้องขอ HTTP โดยตรงไปยัง `https://phaser.io/api/user/?has=product:editor:desktop` หากเซิร์ฟเวอร์ตอบกลับด้วย "ไม่มีสิทธิ์" ไบนารีจะบล็อกทันที (ไม่มีโหมดผ่อนผัน) พร็อกซีจะตั้งค่า `HTTPS_PROXY` เป็นที่อยู่ที่ไม่ถูกต้อง บังคับให้คำขอ HTTP ล้มเหลวและกลับสู่โหมดผ่อนผัน

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

## คำแนะนำในการติดตั้ง

ทำตามขั้นตอนเหล่านี้อย่างระมัดระวังเพื่อหลีกเลี่ยงปัญหา:

1. **ดาวน์โหลดและติดตั้ง Phaser Editor 5**  
   เลือกเวอร์ชันที่เหมาะสมกับแพลตฟอร์มของคุณจากลิงก์ด้านบน

2. **เปิดแก้ไขหนึ่งครั้งก่อนแก้ไข**
   - เปิด Phaser Editor ตามปกติ
   - **ยอมรับ EULA** (ข้อตกลงสิทธิ์การใช้งานสำหรับผู้ใช้ปลายทาง) เมื่อได้รับแจ้ง
   - ปิดแก้ไขให้สนิทหลังจากยอมรับ EULA
     > ⚠️ **สำคัญ:** การแก้ไขโดยไม่ยอมรับ EULA ก่อนจะทำให้แก้ไขเสียหาย (จะไม่สามารถเปิดได้) ทั้งนี้เนื่องจากไฟล์ธง EULA (`~/.phasereditor2d/eula-accepted`) ต้องมีอยู่ก่อนที่โค้ดที่ถูกแก้ไขจะทำงาน

3. **รันตัวแก้ไข**

   ```bash
   npm run phaser-cracken --auto
   ```

ซึ่งจะใช้การแก้ไขที่จำเป็นทั้งหมดและเปิดแก้ไข

4. **สนุกไปกับมัน** – หลังจากเปิดใช้งานครั้งแรกสำเร็จ แก้ไขจะไม่ถามหาไลเซนส์หรือการสมัครสมาชิกอีกต่อไป ฟีเจอร์ทั้งหมดจะพร้อมใช้งานแบบออฟไลน์

## การติดตั้ง

```bash
cd phaser-cracken
npm install
npm run build
```

หรือติดตั้งแบบ global:

```bash
npm install -g .
```

## เริ่มต้นใช้งานอย่างรวดเร็ว

```bash
# คำสั่งเดียวสำหรับทุกอย่าง:
npm run phaser-cracken --auto

# หรือทีละขั้นตอน:
npm run phaser-cracken --patch            # บายพาสการตรวจสอบ JS
npm run phaser-cracken --install-proxy    # บายพาสการตรวจสอบไบนารี Go (พร็อกซี + รีเซ็ตระยะเวลาผ่อนผัน)
npm run phaser-cracken --reset-grace      # รีเซ็ตระยะเวลาผ่อนผันสำหรับการตรวจสอบการเริ่มต้นไบนารี Go
npm run phaser-cracken --run              # เปิดแก้ไข
```

## วิธีการทำงาน

### ชั้นที่ 1: Electron Shell

แทนที่ `isEditorActivated()` ใน `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### ชั้นที่ 2: พร็อกซีไบนารี Go

สร้างสคริปต์พร็อกซี (Node.js หรือ bash) รอบไบนารี `PhaserEditor`:

- `-tool print-user-status` → คืนค่า JSON ปลอมที่มี `subscriptionActive: true`
- อย่างอื่นทั้งหมด → ส่งต่อไปยัง `PhaserEditor.real` แบบโปร่งใส

```bash
#!/bin/bash
# รีเซ็ตระยะเวลาผ่อนผัน บล็อกการตรวจสอบ phaser.io
# ดักจับ print-user-status ส่งต่ออย่างอื่นทั้งหมด
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # บังคับโหมดผ่อนผัน

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## คำสั่ง

| คำสั่ง                     | คำอธิบาย                                                                      |
| -------------------------- | ----------------------------------------------------------------------------- |
| `patch`                    | แก้ไข `WindowManager.js`                                                      |
| `restore`                  | กู้คืน `WindowManager.js` ต้นฉบับ                                             |
| `install-proxy`            | ติดตั้งตัวห่อพร็อกซีรอบไบนารี `PhaserEditor`                                  |
| `install-proxy --force`    | อัปเกรดพร็อกซี v1 → v2 หรือติดตั้งใหม่                                        |
| `uninstall-proxy`          | ลบพร็อกซี กู้คืนไบนารีต้นฉบับ                                                 |
| `reset-grace`              | ล้าง `server.log` / `auth-failure-v1.log` เพื่อรีเซ็ตระยะเวลาผ่อนผัน 96 ชม. ของไบนารี Go |
| `status`                   | แสดงสถานะการแก้ไข พร็อกซี และเซสชัน                                          |
| `run`                      | เปิด Phaser Editor                                                            |
| `auto`                     | การตั้งค่าที่สมบูรณ์: แก้ไข + พร็อกซี + รีเซ็ตระยะเวลาผ่อนผัน + เปิดใช้งาน    |
| `auto --no-run`            | การตั้งค่าโดยไม่เปิดใช้งาน                                                     |
| `backup-session`           | สำรองข้อมูล `user-session-v3.bin`                                             |
| `restore-session [file]`   | กู้คืนเซสชันจากข้อมูลสำรอง                                                    |
| `refresh-session`          | เข้าสู่ระบบ Phaser.io เพื่อรับเซสชันใหม่                                      |

### ตัวเลือกอัตโนมัติ

```bash
phaser-cracken auto --no-run    # ข้ามการเปิดใช้งานหลังการตั้งค่า
```

## แพลตฟอร์มที่รองรับ

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## ไฟล์ที่สร้างโดย PhaserCracken

| ไฟล์                                       | จุดประสงค์                             |
| ------------------------------------------ | -------------------------------------- |
| `WindowManager.js.backup`                  | ไฟล์ JS ต้นฉบับที่สำรองไว้             |
| `PhaserEditor.real`                        | ไบนารี Go ต้นฉบับ (เปลี่ยนชื่อแล้ว)    |
| `PhaserEditor.phaser-cracken.bin-backup`   | สำเนาของไบนารีต้นฉบับ                 |
| `PhaserEditor`                             | สคริปต์พร็อกซี (แทนที่ไฟล์ต้นฉบับ)    |

### ไฟล์บันทึกที่ถูกรีเซ็ต

พร็อกซีจะตัดทอนไฟล์เหล่านี้ทุกครั้งที่เปิดใช้งานเพื่อให้ระยะเวลาผ่อนผันของไบนารี Go ยังคงทำงานอยู่:

| ไฟล์                                        | จุดประสงค์                                               |
| ------------------------------------------- | -------------------------------------------------------- |
| `~/.phasereditor2d/server.log`              | เก็บประทับเวลาความล้มเหลวในการตรวจสอบสิทธิ์ (ไบนารี Go) |
| `~/.phasereditor2d/auth-failure-v1.log`     | เครื่องหมายความล้มเหลวในการตรวจสอบสิทธิ์ (Electron)     |

## การถอนการติดตั้ง

```bash
npm run phaser-cracken --restore          # กู้คืน WindowManager.js
npm run phaser-cracken --uninstall-proxy  # กู้คืนไบนารี PhaserEditor
```

## ข้อกำหนด

- Node.js >= 14
- ติดตั้ง Phaser Editor 5 Desktop แล้ว

## ข้อความปฏิเสธความรับผิดชอบ

เครื่องมือนี้มีวัตถุประสงค์เพื่อการศึกษาและการใช้งานที่ไม่ใช่เชิงพาณิชย์เท่านั้น
คุณควรซื้อไลเซนส์ที่ถูกต้องจาก [phaser.io](https://phaser.io) หากคุณใช้ Phaser Editor ในเชิงพาณิชย์
