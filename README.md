# PhaserCracken

Phaser Editor 5 license bypass utility for non-commercial use.

Patches `WindowManager.js` to skip the subscription check (`isEditorActivated()` always returns `true`), and provides session file backup/restore for offline use.

## Installation

```bash
cd PhaserCracken
npm install
npm run build
```

Or install globally:

```bash
npm install -g .
```

## Quick Start

```bash
# 1. Apply the license bypass patch
phaser-cracken patch

# 2. Launch the editor
phaser-cracken run

# Or do both at once:
phaser-cracken auto
```

## Commands

| Command | Description |
|---------|-------------|
| `patch` | Patch `WindowManager.js` — bypass `isEditorActivated()` |
| `restore` | Restore the original `WindowManager.js` from backup |
| `status` | Show patch status and session file info |
| `backup-session` | Backup `user-session-v3.bin` to `./phaser_backup/` |
| `restore-session [file]` | Restore session from backup |
| `run` | Launch Phaser Editor |
| `auto` | Patch + run in one step |

## How It Works

Phaser Editor 5 checks the license via a method `isEditorActivated()` in `WindowManager.js`. This method spawns the core server binary with `-tool print-user-status` and checks `subscriptionActive`.

**PhaserCracken** replaces:
```javascript
isEditorActivated() {
    // ... checks userInfo.user.subscriptionActive ...
    return Boolean(userInfo.user && userInfo.user.subscriptionActive);
}
```

With:
```javascript
isEditorActivated() {
    return true;
}
```

The session file (`~/.phasereditor2d/user-session-v3.bin`) is still required for the core server to start. Use `backup-session` / `restore-session` to manage it.

## Supported Platforms

- **macOS**: `/Applications/Phaser Editor 5.app`
- **Windows**: `C:\Program Files\Phaser Editor 5\`
- **Linux**: `/opt/phaser-editor/`

## Requirements

- Node.js >= 14
- Phaser Editor 5 Desktop installed

## Disclaimer

This tool is for educational purposes and non-commercial use only. You should purchase a valid license from [phaser.io](https://phaser.io) if you use Phaser Editor commercially.
