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

Công cụ vượt giấy phép ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 dành cho mục đích phi thương mại.

Ba lớp bảo vệ bị vượt qua:

1. **Kiểm tra Electron JS** — vá `WindowManager.js` để `isEditorActivated()` luôn trả về `true`.
2. **Kiểm tra nhị phân Go (trạng thái người dùng)** — cài đặt một proxy trong suốt quanh `PhaserEditor` để chặn `-tool print-user-status` và trả về phản hồi đăng ký giả. Tất cả các lệnh khác được chuyển tiếp đến tệp nhị phân thật.
3. **Kiểm tra nhị phân Go (khởi động máy chủ)** — tệp nhị phân Go lưu dấu thời gian xác thực thất bại trong `server.log`. Khi thời gian gia hạn 96 giờ hết hạn, nó từ chối khởi động. Proxy hiện cắt ngắn `server.log` và `auth-failure-v1.log` mỗi lần gọi, cung cấp thời gian gia hạn mới mỗi khi trình chỉnh sửa được khởi chạy.

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

## Hướng dẫn thiết lập

Thực hiện cẩn thận các bước sau để tránh sự cố:

1. **Tải xuống và cài đặt Phaser Editor 5**
   Chọn phiên bản phù hợp với nền tảng của bạn từ các liên kết ở trên.

2. **Khởi chạy trình chỉnh sửa một lần trước khi vá**
   - Mở Phaser Editor bình thường.
   - **Chấp nhận EULA** (Thỏa thuận cấp phép người dùng cuối) khi được nhắc.
   - Đóng hoàn toàn trình chỉnh sửa sau khi EULA được chấp nhận.
     > ⚠️ **Quan trọng:** Vá mà không chấp nhận EULA trước sẽ làm hỏng trình chỉnh sửa (nó sẽ không mở được). Điều này là do tệp cờ EULA (`~/.phasereditor2d/eula-accepted`) phải tồn tại trước khi mã đã sửa đổi chạy.

3. **Chạy trình vá**

   ```bash
   npm run phaser-cracken --auto
   ```

   Thao tác này sẽ áp dụng tất cả các bản vá cần thiết và khởi chạy trình chỉnh sửa.

4. **Tận hưởng** – Sau lần khởi chạy thành công đầu tiên, trình chỉnh sửa sẽ không còn yêu cầu giấy phép hoặc đăng ký. Tất cả các tính năng đều có sẵn ngoại tuyến.

## Cài đặt

```bash
cd phaser-cracken
npm install
npm run build
```

Hoặc cài đặt toàn cầu:

```bash
npm install -g .
```

## Khởi động nhanh

```bash
# Một lệnh để làm mọi thứ:
npm run phaser-cracken --auto

# Hoặc từng bước:
npm run phaser-cracken --patch            # Vượt qua kiểm tra JS
npm run phaser-cracken --install-proxy    # Vượt qua kiểm tra nhị phân Go (proxy + đặt lại thời gian gia hạn)
npm run phaser-cracken --reset-grace      # Đặt lại thời gian gia hạn cho kiểm tra khởi động nhị phân Go
npm run phaser-cracken --run              # Khởi chạy trình chỉnh sửa
```

## Cách hoạt động

### Lớp 1: Electron Shell

Thay thế `isEditorActivated()` trong `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Lớp 2: Proxy nhị phân Go

Tạo một tập lệnh proxy (Node.js hoặc bash) quanh tệp nhị phân `PhaserEditor`:

- `-tool print-user-status` → trả về JSON giả với `subscriptionActive: true`
- Mọi thứ khác → ủy quyền trong suốt cho `PhaserEditor.real`

```bash
#!/bin/bash
# Đặt lại thời gian gia hạn, chặn print-user-status, ủy quyền mọi thứ khác
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## Lệnh

| Lệnh                     | Mô tả                                                                            |
| ------------------------ | -------------------------------------------------------------------------------- |
| `patch`                  | Vá `WindowManager.js`                                                            |
| `restore`                | Khôi phục `WindowManager.js` gốc                                                 |
| `install-proxy`          | Cài đặt proxy quanh tệp nhị phân `PhaserEditor`                                  |
| `install-proxy --force`  | Nâng cấp proxy v1 → v2 hoặc cài đặt lại                                          |
| `uninstall-proxy`        | Gỡ bỏ proxy, khôi phục tệp nhị phân gốc                                          |
| `reset-grace`            | Xóa `server.log` / `auth-failure-v1.log` để đặt lại thời gian gia hạn 96h của Go |
| `status`                 | Hiển thị trạng thái vá, proxy và phiên làm việc                                  |
| `run`                    | Khởi chạy Phaser Editor                                                          |
| `auto`                   | Thiết lập hoàn chỉnh: vá + proxy + đặt lại thời gian gia hạn + khởi chạy         |
| `auto --no-run`          | Thiết lập mà không khởi chạy                                                     |
| `backup-session`         | Sao lưu `user-session-v3.bin`                                                    |
| `restore-session [file]` | Khôi phục phiên từ bản sao lưu                                                   |
| `refresh-session`        | Chạy đăng nhập Phaser.io để lấy phiên mới                                        |

### Tùy chọn auto

```bash
phaser-cracken auto --no-run    # Bỏ qua khởi chạy sau khi thiết lập
```

## Nền tảng được hỗ trợ

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Các tệp được tạo bởi PhaserCracken

| Tệp                                      | Mục đích                          |
| ---------------------------------------- | --------------------------------- |
| `WindowManager.js.backup`                | Sao lưu tệp JS gốc                |
| `PhaserEditor.real`                      | Tệp nhị phân Go gốc (đã đổi tên)  |
| `PhaserEditor.phaser-cracken.bin-backup` | Bản sao của tệp nhị phân gốc      |
| `PhaserEditor`                           | Tập lệnh proxy (thay thế bản gốc) |

### Các tệp nhật ký được đặt lại

Proxy cắt ngắn các tệp này mỗi lần khởi chạy để giữ cho thời gian gia hạn của tệp nhị phân Go luôn hoạt động:

| Tệp                                     | Mục đích                                              |
| --------------------------------------- | ----------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Lưu dấu thời gian xác thực thất bại (tệp nhị phân Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Dấu hiệu xác thực thất bại (Electron)                 |

## Gỡ cài đặt

```bash
npm run phaser-cracken --restore          # Khôi phục WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Khôi phục tệp nhị phân PhaserEditor
```

## Yêu cầu

- Node.js >= 14
- Đã cài đặt Phaser Editor 5 Desktop

## Tuyên bố miễn trừ trách nhiệm

Công cụ này chỉ dành cho mục đích giáo dục và sử dụng phi thương mại.
Bạn nên mua giấy phép hợp lệ từ [phaser.io](https://phaser.io) nếu sử dụng Phaser Editor cho mục đích thương mại.
