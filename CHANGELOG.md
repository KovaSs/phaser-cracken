# Changelog

## v1.5.0 (2026-07-08)

### Changed
- **Proxy v5** — removed all network blocking (HTTPS_PROXY/NO_PROXY/hosts).
  Log truncation + seed-session are sufficient: if phaser.io is unreachable
  the binary enters grace mode automatically.
- `auto` command: 4 steps — patch → install-proxy → seed-session → reset-grace → run

### Removed
- `block-phaser` / `unblock-phaser` commands (no longer needed)

---

## v1.4.0 (2026-07-08)

### Added
- **seed-session** command — creates a pre-built `user-session-v3.bin` file for fresh installs where the Go binary skips validation without it
- **21 language README translations** in `docs/` directory

### Changed
- `auto` command now runs 4 steps: patch → install-proxy → seed-session → reset-grace → run
- All translated READMEs moved from root to `docs/` directory
- Language switcher links updated across all README files

---

## v1.3.0 (2026-07-08)

### Added
- **HTTPS_PROXY env var** in proxy script — blocks the Go binary's direct HTTP request to `https://phaser.io/api/user/?has=product:editor:desktop`, forcing it to fall back to grace mode when phaser.io is reachable and responds with "no permission"
- **Proxy v3** with official support for upgrading from v1/v2

### Fixed
- Go binary blocking immediately (no grace mode) when phaser.io server is reachable but user has no subscription

---

## v1.2.0 (2026-07-08)

### Added
- **Grace period reset** — proxy now truncates `~/.phasereditor2d/server.log` and `auth-failure-v1.log` on every invocation, giving the Go binary a fresh 96-hour grace period each time
- **`reset-grace`** CLI command for manual grace period reset
- **`install-proxy --force`** for upgrading proxy v1 → v2
- **Proxy v2** — added log truncation logic to the proxy script
- **20 language README translations**

### Fixed
- Editor failing to start after grace period expired (Go binary blocked server startup)
- The `auto` command now includes grace reset step

---

## v1.1.0 (2026-05-28)

### Added
- **Proxy wrapper** around the `PhaserEditor` Go binary — intercepts `-tool print-user-status` and returns fake subscription JSON
- **Proxy v1** for Unix (bash) and Windows (batch)
- **`install-proxy`**, **`uninstall-proxy`** CLI commands
- **`refresh-session`**, **`backup-session`**, **`restore-session`** commands
- **`auto`** command — complete setup: patch + proxy + run
- **`status`** command — show patch, proxy, and session state
- **Proxy verification** after installation

### Changed
- Updated README with setup instructions, command reference, and platform support

---

## v1.0.0 (2026-05-28)

### Added
- Initial release
- **`patch`** command — patches `WindowManager.js` so `isEditorActivated()` always returns `true`
- **`restore`** command — restores original `WindowManager.js` from backup
- **`run`** command — launches Phaser Editor
- WindowManager.js backup system
- macOS, Windows, and Linux support
