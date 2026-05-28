import * as fs from "fs-extra";
import * as path from "path";

const PROXY_SIGNATURE = "# PhaserCracken Proxy v1";
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

/**
 * Checks whether the proxy is already installed.
 */
export function isProxyInstalled(binPath: string): boolean {
  if (!fs.existsSync(binPath)) return false;
  try {
    const content = fs.readFileSync(binPath, "utf-8");
    return content.includes(PROXY_SIGNATURE);
  } catch {
    return false;
  }
}

function getUnixProxyScript(): string {
  return (
    [
      "#!/bin/bash",
      PROXY_SIGNATURE,
      'DIR="$(cd "$(dirname "$0")" && pwd)"',
      `REAL="$DIR/$(basename "$0")${REAL_SUFFIX}"`,
      "",
      "# Intercept -tool print-user-status",
      'for arg in "$@"; do',
      '  if [ "$arg" = "print-user-status" ]; then',
      '    echo "---output---"',
      `    echo '${FAKE_USER_JSON}'`,
      "    exit 0",
      "  fi",
      "done",
      "",
      "# Pass through to real binary",
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
 * Throws if already installed or if the binary is missing.
 */
export function installProxy(binPath: string): void {
  if (!fs.existsSync(binPath)) {
    throw new Error(`PhaserEditor binary not found at: ${binPath}`);
  }

  if (isProxyInstalled(binPath)) {
    throw new Error("Proxy is already installed.");
  }

  const realPath = getRealPath(binPath);

  if (fs.existsSync(realPath)) {
    throw new Error(
      `File ${realPath} already exists. The proxy may be partially installed.\n` +
        `Run "phaser-cracken uninstall-proxy" first to clean up.`,
    );
  }

  // Backup the original binary
  const backupPath = getBackupPath(binPath);
  if (!fs.existsSync(backupPath)) {
    fs.copySync(binPath, backupPath);
  }

  // Rename original to .real
  fs.renameSync(binPath, realPath);

  // Write proxy script
  const isWin = process.platform === "win32";

  if (isWin) {
    // On Windows: PhaserEditor.exe becomes a .bat wrapper
    // The original .exe was renamed to PhaserEditor.real.exe
    const batPath = binPath.replace(/\.exe$/i, ".bat");
    fs.writeFileSync(batPath, getWindowsProxyScript(), "utf-8");
  } else {
    // On Unix: PhaserEditor becomes a bash script
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
