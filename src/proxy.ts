import * as fs from "fs-extra";
import * as path from "path";

const PROXY_SIGNATURE = "# PhaserCracken Proxy v3";
const PROXY_SIGNATURE_V1 = "# PhaserCracken Proxy v1";
const REAL_SUFFIX = ".real";

const FAKE_USER_JSON = JSON.stringify(
  {
    user: {
      avatar:
        "https://avatars.mds.yandex.net/i?id=fa3bf05f720998067a589a46ffb4c27fc424bb97-9831149-images-thumbs&n=13",
      id: "00000000-0000-0000-0000-000000000000",
      email: "crack@example.com",
      username: "Cracked User",
      permissions: {
        "product:editor:desktop": true,
        "product:phaser:desktop": true,
      },
      token: "",
      subscriptionActive: true,
    },
  },
  null,
  0,
);

function getRealPath(binPath: string): string {
  if (process.platform === "win32") {
    return binPath.replace(/\.exe$/i, "") + REAL_SUFFIX + ".exe";
  }
  return binPath + REAL_SUFFIX;
}

function getBackupPath(binPath: string): string {
  return binPath + ".phaser-cracken.bin-backup";
}

function getProxyContent(binPath: string): string | null {
  if (!fs.existsSync(binPath)) return null;
  try {
    return fs.readFileSync(binPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Checks whether the proxy is already installed (any version).
 */
export function isProxyInstalled(binPath: string): boolean {
  const content = getProxyContent(binPath);
  if (!content) return false;
  return content.includes(PROXY_SIGNATURE) || content.includes(PROXY_SIGNATURE_V1);
}

/**
 * Checks if the installed proxy needs upgrade to the current version.
 */
export function needsUpgrade(binPath: string): boolean {
  const content = getProxyContent(binPath);
  if (!content) return false;
  return content.includes(PROXY_SIGNATURE_V1) && !content.includes(PROXY_SIGNATURE);
}

function getUnixProxyScript(): string {
  return (
    [
      "#!/bin/bash",
      PROXY_SIGNATURE,
      "",
      '# ── Locate real binary ──────────────────────────────────────────',
      'DIR="$(cd "$(dirname "$0")" && pwd)"',
      `REAL="$DIR/$(basename "$0")${REAL_SUFFIX}"`,
      "",
      '# ── Reset grace period ──────────────────────────────────────────',
      '# The Go binary stores auth failure timestamp in server.log.',
      '# Truncating it on each start gives a fresh 96h grace period.',
      'PHASER_HOME="$HOME/.phasereditor2d"',
      'SERVER_LOG="$PHASER_HOME/server.log"',
      'AUTH_FAIL_LOG="$PHASER_HOME/auth-failure-v1.log"',
      '[ -f "$SERVER_LOG" ] && : > "$SERVER_LOG"',
      '[ -f "$AUTH_FAIL_LOG" ] && : > "$AUTH_FAIL_LOG"',
      '',
      '# ── Block phaser.io validation ───────────────────────────────────',
      '# The Go binary makes a direct HTTP request to phaser.io/api/user/',
      '# to verify subscription. If phaser.io is reachable and responds',
      '# with \"no permission\", the binary blocks immediately (no grace mode).',
      '# Setting HTTPS_PROXY to an invalid address forces the connection to',
      '# fail, triggering grace mode instead.',
      'export HTTPS_PROXY="http://127.0.0.1:1"',
      "",
      '# ── Intercept -tool print-user-status ───────────────────────────',
      'for arg in "$@"; do',
      '  if [ "$arg" = "print-user-status" ]; then',
      '    echo "---output---"',
      `    echo '${FAKE_USER_JSON}'`,
      "    exit 0",
      "  fi",
      "done",
      "",
      '# ── Pass through to real binary ─────────────────────────────────',
      'if [ -x "$REAL" ]; then',
      '  exec "$REAL" "$@"',
      "else",
      '  echo "Error: real PhaserEditor binary not found at $REAL" >&2',
      "  exit 1",
      "fi",
    ].join("\n") + "\n"
  );
}

function getWindowsProxyScript(): string {
  return (
    [
      "@echo off",
      `rem ${PROXY_SIGNATURE}`,
      "setlocal enabledelayedexpansion",
      "",
      "set REAL=%~dp0PhaserEditor.real.exe",
      "",
      "rem ── Reset grace period ──",
      "set PHASER_HOME=%USERPROFILE%\\.phasereditor2d",
      'if exist "%PHASER_HOME%\\server.log" break > "%PHASER_HOME%\\server.log"',
      'if exist "%PHASER_HOME%\\auth-failure-v1.log" break > "%PHASER_HOME%\\auth-failure-v1.log"',
      "",
      "rem ── Block phaser.io validation ──",
      "set HTTPS_PROXY=http://127.0.0.1:1",
      "",
      "set FOUND=0",
      "for %%a in (%*) do (",
      '  if /I "%%a"=="print-user-status" set FOUND=1',
      ")",
      "",
      "if %FOUND%==1 (",
      "  echo ---output---",
      `  echo ${FAKE_USER_JSON}`,
      "  exit /b 0",
      ")",
      "",
      'if exist "%REAL%" (',
      '  "%REAL%" %*',
      "  exit /b %errorlevel%",
      ") else (",
      "  echo Error: real PhaserEditor binary not found at %REAL% >&2",
      "  exit /b 1",
      ")",
    ].join("\r\n") + "\r\n"
  );
}

/**
 * Installs the proxy wrapper around the PhaserEditor binary.
 *
 * - Renames the original binary to PhaserEditor.real
 * - Creates a proxy script named PhaserEditor that intercepts
 *   `-tool print-user-status` and passes everything else to the real binary.
 * - Creates a backup copy of the original binary.
 *
 * @param binPath - Path to the PhaserEditor binary
 * @param force - If true, reinstalls even if proxy is already installed (upgrades v1→v2)
 * Throws if already installed (unless force) or if the binary is missing.
 */
export function installProxy(binPath: string, force: boolean = false): void {
  if (!fs.existsSync(binPath)) {
    throw new Error(`PhaserEditor binary not found at: ${binPath}`);
  }

  const realPath = getRealPath(binPath);

  if (needsUpgrade(binPath) && force) {
    // Upgrade: remove old proxy script, real binary stays
    fs.removeSync(binPath);
  } else if (isProxyInstalled(binPath)) {
    if (!force) {
      throw new Error(
        "Proxy is already installed.\n" +
          "Run with --force to reinstall (upgrade from v1 to v2).",
      );
    }
    // Reinstall: remove proxy script, keep real binary
    if (fs.existsSync(binPath)) {
      fs.removeSync(binPath);
    }
  }

  // Normal install (no proxy yet)
  if (!isProxyInstalled(binPath) && !fs.existsSync(realPath)) {
    // Backup the original binary
    const backupPath = getBackupPath(binPath);
    if (!fs.existsSync(backupPath)) {
      fs.copySync(binPath, backupPath);
    }
    // Rename original to .real
    fs.renameSync(binPath, realPath);
  }

  // Write proxy script
  const isWin = process.platform === "win32";

  if (isWin) {
    const batPath = binPath.replace(/\.exe$/i, ".bat");
    fs.writeFileSync(batPath, getWindowsProxyScript(), "utf-8");
  } else {
    fs.writeFileSync(binPath, getUnixProxyScript(), {
      mode: 0o755,
      encoding: "utf-8",
    });
  }
}

/**
 * Uninstalls the proxy and restores the original PhaserEditor binary.
 * Throws if proxy is not installed.
 */
export function uninstallProxy(binPath: string): void {
  if (!isProxyInstalled(binPath)) {
    throw new Error("Proxy is not installed.");
  }

  const isWin = process.platform === "win32";
  const realPath = getRealPath(binPath);

  if (!fs.existsSync(realPath)) {
    throw new Error(
      `Real binary not found at ${realPath}. The installation may be corrupted.\n` +
        `Restore from backup: ${getBackupPath(binPath)}`,
    );
  }

  // Remove proxy script
  if (isWin) {
    const batPath = binPath.replace(/\.exe$/i, ".bat");
    if (fs.existsSync(batPath)) {
      fs.removeSync(batPath);
    }
    // Also remove .js if present
    const jsPath = binPath.replace(/\.exe$/i, ".js");
    if (fs.existsSync(jsPath)) {
      try {
        const content = fs.readFileSync(jsPath, "utf-8");
        if (content.includes(PROXY_SIGNATURE)) {
          fs.removeSync(jsPath);
        }
      } catch {
        /* ignore */
      }
    }
  } else {
    fs.removeSync(binPath);
  }

  // Restore original
  fs.renameSync(realPath, binPath);
}

/**
 * Returns the proxy script content (for inspection/debugging).
 */
export function getProxyScriptContent(): string {
  return process.platform === "win32"
    ? getWindowsProxyScript()
    : getUnixProxyScript();
}
