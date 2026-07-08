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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 license bypass utility for non-commercial use.

Three layers of protection are bypassed:

1. **Electron JS check** — patches `WindowManager.js` so `isEditorActivated()` always returns `true`.
2. **Go binary check (user status)** — installs a transparent proxy around `PhaserEditor` that intercepts `-tool print-user-status` and returns a fake subscription response. All other commands pass through to the real binary.
3. **Go binary check (server startup)** — the Go binary stores the auth failure timestamp in `server.log`. When the 96-hour grace period expires, it refuses to start. The proxy now truncates `server.log` and `auth-failure-v1.log` on every invocation, giving a fresh grace period each time the editor launches.

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

## Setup Instructions

Follow these steps carefully to avoid issues:

1. **Download and install Phaser Editor 5**  
   Choose the appropriate version for your platform from the links above.

2. **Launch the editor once before patching**
   - Open Phaser Editor normally.
   - **Accept the EULA** (End User License Agreement) when prompted.
   - Close the editor completely after the EULA is accepted.
     > ⚠️ **Important:** Patching without having accepted the EULA first will break the editor (it will fail to open). This is because the EULA flag file (`~/.phasereditor2d/eula-accepted`) must exist before the modified code runs.

3. **Run the patcher**

   ```bash
   npm run phaser-cracken --auto
   ```

This will apply all necessary patches and launch the editor.

4. **Enjoy** – After the first successful launch, the editor will no longer ask for a license or subscription. All features become available offline.

## Installation

```bash
cd phaser-cracken
npm install
npm run build
```

Or globally:

```bash
npm install -g .
```

## Quick Start

```bash
# One command to do everything:
npm run phaser-cracken --auto

# Or step by step:
npm run phaser-cracken --patch            # Bypass JS check
npm run phaser-cracken --install-proxy    # Bypass Go binary check (proxy + grace reset)
npm run phaser-cracken --reset-grace      # Reset grace period for Go binary startup check
npm run phaser-cracken --run              # Launch the editor
```

## How It Works

### Layer 1: Electron Shell

Replaces `isEditorActivated()` in `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Layer 2: Go Binary Proxy

Creates a proxy script (Node.js or bash) around the `PhaserEditor` binary:

- `-tool print-user-status` → returns fake JSON with `subscriptionActive: true`
- Everything else → transparently delegates to `PhaserEditor.real`

```bash
#!/bin/bash
# Resets grace period, intercepts print-user-status, delegates everything else
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

## Commands

| Command                  | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `patch`                  | Patch `WindowManager.js`                                                             |
| `restore`                | Restore original `WindowManager.js`                                                  |
| `install-proxy`          | Install proxy wrapper around `PhaserEditor` binary                                   |
| `install-proxy --force`  | Upgrade proxy v1 → v2 or reinstall                                                   |
| `uninstall-proxy`        | Remove proxy, restore original binary                                                |
| `reset-grace`            | Clear `server.log` / `auth-failure-v1.log` to reset the Go binary's 96h grace period |
| `status`                 | Show patch, proxy and session status                                                 |
| `run`                    | Launch Phaser Editor                                                                 |
| `auto`                   | Complete setup: patch + proxy + reset-grace + run                                    |
| `auto --no-run`          | Setup without launching                                                              |
| `backup-session`         | Backup `user-session-v3.bin`                                                         |
| `restore-session [file]` | Restore session from backup                                                          |
| `refresh-session`        | Run Phaser.io login to get a new session                                             |

### Auto options

```bash
phaser-cracken auto --no-run    # Skip launching after setup
```

## Supported Platforms

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Files Created by PhaserCracken

| File                                     | Purpose                          |
| ---------------------------------------- | -------------------------------- |
| `WindowManager.js.backup`                | Original JS file backup          |
| `PhaserEditor.real`                      | Original Go binary (renamed)     |
| `PhaserEditor.phaser-cracken.bin-backup` | Copy of original binary          |
| `PhaserEditor`                           | Proxy script (replaces original) |

### Log Files Reset

The proxy truncates these files on every launch to keep the Go binary's grace period active:

| File                                    | Purpose                                   |
| --------------------------------------- | ----------------------------------------- |
| `~/.phasereditor2d/server.log`          | Stores auth failure timestamp (Go binary) |
| `~/.phasereditor2d/auth-failure-v1.log` | Auth failure marker (Electron)            |

## Uninstallation

```bash
npm run phaser-cracken --restore          # Restore WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Restore PhaserEditor binary
```

## Requirements

- Node.js >= 14
- Phaser Editor 5 Desktop installed

## Disclaimer

This tool is for educational purposes and non-commercial use only.
You should purchase a valid license from [phaser.io](https://phaser.io) if you use Phaser Editor commercially.
