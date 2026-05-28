# PhaserCracken

Phaser Editor 5 license bypass utility for non-commercial use.

Two layers of protection are bypassed:

1. **Electron JS check** — patches `WindowManager.js` so `isEditorActivated()` always returns `true`.
2. **Go binary check** — installs a transparent proxy around `PhaserEditor` that intercepts `-tool print-user-status` and returns a fake subscription response. All other commands pass through to the real binary.

## Phaser Editor

### 5.0.2 desktop

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-5.0.2-Setup.exe)
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-macos.dmg)
[macOS (Apple Silicon)](https://disk.yandex.ru/d/GYCs4Yy47L2gYA)
[Linux](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-linux.zip)

### 5.0.2 core

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-windows.zip)
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos.zip)
[macOS (Apple Silicon)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos_arm.zip)

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
npm run phaser-cracken --install-proxy    # Bypass Go binary check
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
# Intercepts print-user-status, delegates everything else
if [ "$1" = "-tool" ] && [ "$2" = "print-user-status" ]; then
  echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
  exit 0
fi
exec "$0.real" "$@"
```

## Commands

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `patch`                  | Patch `WindowManager.js`                           |
| `restore`                | Restore original `WindowManager.js`                |
| `install-proxy`          | Install proxy wrapper around `PhaserEditor` binary |
| `uninstall-proxy`        | Remove proxy, restore original binary              |
| `status`                 | Show patch, proxy and session status               |
| `run`                    | Launch Phaser Editor                               |
| `auto`                   | Complete setup: patch + proxy + run                |
| `backup-session`         | Backup `user-session-v3.bin`                       |
| `restore-session [file]` | Restore session from backup                        |
| `refresh-session`        | Run Phaser.io login to get a new session           |

### Auto options

```bash
phaser-cracken auto --no-run    # Skip launching after setup
```

## Supported Platforms

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Files Created by PhaserCracken

| File                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| `WindowManager.js.backup` | Original JS file backup            |
| `PhaserEditor.real`       | Original Go binary (renamed)       |
| `PhaserEditor.backup`     | Copy of original binary (optional) |
| `PhaserEditor`            | Proxy script (replaces original)   |

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
