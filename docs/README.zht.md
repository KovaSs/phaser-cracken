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

[🇨🇳 繁體中文](../README.zht.md)

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 許可證繞過工具，僅供非商業用途使用。

Three layers of protection are bypassed:

1. **Electron JS check** — patches `WindowManager.js` so `isEditorActivated()` always returns `true`.
2. **Go binary proxy** — installs a transparent proxy around `PhaserEditor` that intercepts `-tool print-user-status` and returns a fake subscription response. All other commands pass through to the real binary.
3. **Grace period reset** — the Go binary stores the auth failure timestamp in `server.log`. When the 96-hour grace period expires, it refuses to start. The proxy truncates `server.log` and `auth-failure-v1.log` on every invocation, giving a fresh grace period each time the editor launches. A bundled session file (`copy-session`) prevents the binary from skipping validation when no session exists.

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

## 設定說明

請仔細遵循以下步驟以避免問題：

1. **下載並安裝 Phaser Editor 5**  
   從上方連結中選擇適合您平台的版本。

2. **在打補丁前先啟動編輯器一次**
   - 正常打開 Phaser Editor。
   - 在提示時**接受 EULA**（最終使用者許可協議）。
   - 接受 EULA 後完全關閉編輯器。
     > ⚠️ **重要：** 未先接受 EULA 就打補丁會導致編輯器損壞（將無法打開）。這是因為 EULA 標誌檔案（`~/.phasereditor2d/eula-accepted`）必須在修改後的程式碼執行之前存在。

3. **執行補丁程式**

   ```bash
   npm run phaser-cracken --auto
   ```

這將應用所有必要的補丁並啟動編輯器。

4. **盡情享用** – 首次成功啟動後，編輯器將不再詢問許可證或訂閱。所有功能均可離線使用。

## 安裝

```bash
cd phaser-cracken
npm install
npm run build
```

或全域安裝：

```bash
npm install -g .
```

## 快速開始

```bash
# 一條命令完成所有操作：
npm run phaser-cracken --auto

# 或逐步操作：
npm run phaser-cracken --patch            # 繞過 JS 檢查
npm run phaser-cracken --install-proxy    # 繞過 Go 二進位檔案檢查（代理 + 寬限期重置）
npm run phaser-cracken --copy-session     # 安裝捆綁的會話檔案
npm run phaser-cracken --reset-grace      # 重置 Go 二進位檔案啟動檢查的寬限期
npm run phaser-cracken --run              # 啟動編輯器
```

## 運作原理

### 第 1 層：Electron Shell

替換 `WindowManager.js` 中的 `isEditorActivated()`：

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### 第 2 層：Go 二進位檔案代理

在 `PhaserEditor` 二進位檔案周圍建立一個代理指令碼（Node.js 或 bash）：

- `-tool print-user-status` → 返回包含 `subscriptionActive: true` 的偽造 JSON
- 其他所有內容 → 透明地委託給 `PhaserEditor.real`

```bash
#!/bin/bash
# 重置寬限期，攔截 print-user-status，委託其他所有內容
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

## 命令

| 命令                      | 描述                                                                |
| ------------------------- | ------------------------------------------------------------------- |
| `patch`                   | 修補 `WindowManager.js`                                             |
| `restore`                 | 恢復原始 `WindowManager.js`                                         |
| `install-proxy`           | 在 `PhaserEditor` 二進位檔案周圍安裝代理包裝                        |
| `install-proxy --force`   | 升級代理 v1 → v2 或重新安裝                                         |
| `uninstall-proxy`         | 移除代理，恢復原始二進位檔案                                        |
| `copy-session [source]`   | 安裝會話檔案（預設使用捆綁資源，或自訂路徑）                     |
| `reset-grace`             | 清除 `server.log` / `auth-failure-v1.log` 以重置 Go 二進位檔案的 96 小時寬限期 |
| `status`                  | 顯示補丁、代理和工作階段狀態                                        |
| `run`                     | 啟動 Phaser Editor                                                  |
| `auto`                    | 完整設定：補丁 + 代理 + copy-session + 重置寬限期 + 啟動                  |
| `auto --no-run`           | 設定但不啟動                                                        |
| `backup-session`          | 備份 `user-session-v3.bin`                                          |
| `restore-session [file]`  | 從備份還原工作階段                                                  |
| `refresh-session`         | 登入 Phaser.io 以獲取新工作階段                                     |

### 自動選項

```bash
phaser-cracken auto --no-run    # 設定後跳過啟動
```

## 支援的平台

- **macOS**：`/Applications/Phaser Editor.app`
- **Windows**：`C:\Program Files\Phaser Editor\resources\app`
- **Linux**：`/opt/phaser-editor/resources/app`

## PhaserCracken 建立的檔案

| 檔案                                      | 用途                                |
| ----------------------------------------- | ----------------------------------- |
| `WindowManager.js.backup`                 | 原始 JS 檔案備份                    |
| `PhaserEditor.real`                       | 原始 Go 二進位檔案（已重新命名）    |
| `PhaserEditor.phaser-cracken.bin-backup`  | 原始二進位檔案副本                  |
| `PhaserEditor`                            | 代理指令碼（取代原始檔案）          |
| `resources/user-session-v3.bin`           | 捆綁的會話檔案                     |

### 重置的日誌檔案

代理在每次啟動時截斷這些檔案，以保持 Go 二進位檔案的寬限期有效：

| 檔案                                        | 用途                                          |
| ------------------------------------------- | --------------------------------------------- |
| `~/.phasereditor2d/server.log`              | 儲存認證失敗時間戳（Go 二進位檔案）           |
| `~/.phasereditor2d/auth-failure-v1.log`     | 認證失敗標記（Electron）                      |

### 第 3 層：寬限期和工作階段檔案

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## 解除安裝

```bash
npm run phaser-cracken --restore          # 恢復 WindowManager.js
npm run phaser-cracken --uninstall-proxy  # 恢復 PhaserEditor 二進位檔案
```

## 需求

- Node.js >= 14
- 已安裝 Phaser Editor 5 Desktop

## 免責聲明

此工具僅供教育目的和非商業用途使用。
如果您在商業上使用 Phaser Editor，請從 [phaser.io](https://phaser.io) 購買有效許可證。
