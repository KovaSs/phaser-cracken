import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";

const SEED_SESSION_BASE64 = "YbUgBapyne9D4wna7lMt+kPtsppzs04OSRttZdH+QKpDdTFfnukllIy4IMZjF4ZLzIJZrpQAOCs2x+jh9XZjP7Mpwh/S8DE73rbYh1T9SeQoKQZnAYK92Mj+9CLWgz0YhI43yHBUPNvCZ97lbiw7uA3xkC+XYmEp03kgCPF7DErswRGbC4VnWh/gS3MfWpJRUcbqssYtODAngvuclzq4VWXW4Sm74E4l50jXBc16dF9TD8zgT49Brc8Iy3XcF60yNc+SGyrv7ygpXa/hcBACRFIWxp72ejFKm9YDtsxhRyPiy7+01oaUsXnpK/VlX9a4ftmB+6o32qD/YBk18C76JhM37LfCtPB9SCa2k7PJAmVKel7CwhuKUW7+3PU25OlCXVObvkc29zLfAnyI8PTEHRASlpJmJLdNIfGeMoWwE4+7i44X7iZ8uynPyTs0DvsnPQ2Wj61dNzekY25iDjeo9FILsKbvb1jnIFxIsoD6ElmWY5+q0TBsRlpKbKRM36CO1Ij3RoMg70Pvbh37w9n43F0PsJ6fLZA+xX9jKw7kSvd9DVjlx79EySuqrXfwDd7Vhewy4AKBbJiEAFhQY7l+NBrxsUP0T+0rJZTEl0+AWT+B5Vu6jajgUCZ6rs0BJtSO3KxYX3XUl7k69+qbUy7C/9nBjf3LLJr0ch9yAwJwd0efUi97/pYtnHdNMWJ67LZufdLz32e88WKFOMjR+wrymn6vpIg=";

export interface SessionStatus {
  exists: boolean;
  size: number | null;
  mtime: Date | null;
}

/**
 * Writes a pre-built session file to ~/.phasereditor2d/user-session-v3.bin.
 * The Go binary needs this file to attempt HTTP validation against phaser.io
 * (which is then blocked by the proxy's HTTPS_PROXY). Without it, the binary
 * skips validation entirely and goes straight to "premium users" error.
 */
export function seedSession(sessionPath?: string): void {
  const target = sessionPath || path.join(os.homedir(), ".phasereditor2d", "user-session-v3.bin");
  fs.ensureDirSync(path.dirname(target));
  fs.writeFileSync(target, Buffer.from(SEED_SESSION_BASE64, "base64"));
}

/**
 * Returns the status of the user-session-v3.bin file.
 */
export function sessionStatus(sessionPath: string): SessionStatus {
  const exists = fs.existsSync(sessionPath);
  if (!exists) {
    return { exists: false, size: null, mtime: null };
  }
  const stat = fs.statSync(sessionPath);
  return {
    exists: true,
    size: stat.size,
    mtime: stat.mtime,
  };
}

/**
 * Creates a backup of the session file.
 * @param sessionPath - Path to user-session-v3.bin
 * @param backupDir - Directory for the backup (default: ./phaser_backup)
 * @returns The path to the backup file
 */
export function backupSession(sessionPath: string, backupDir?: string): string {
  if (!fs.existsSync(sessionPath)) {
    throw new Error(`Session file not found at: ${sessionPath}`);
  }

  const dir = backupDir || path.join(process.cwd(), "phaser_backup");
  fs.ensureDirSync(dir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `user-session-v3-${timestamp}.bin`;
  const backupPath = path.join(dir, backupName);

  fs.copySync(sessionPath, backupPath);
  return backupPath;
}

/**
 * Restores a session file from a backup.
 * @param backupPath - Path to the backup file
 * @param sessionPath - Target path (default: ~/.phasereditor2d/user-session-v3.bin)
 */
export function restoreSession(backupPath: string, sessionPath: string): void {
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found at: ${backupPath}`);
  }

  fs.ensureDirSync(path.dirname(sessionPath));
  fs.copySync(backupPath, sessionPath);
}

/**
 * Lists all session backups in a directory.
 */
export function listBackups(backupDir: string): string[] {
  if (!fs.existsSync(backupDir)) {
    return [];
  }

  return fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith("user-session-v3-") && f.endsWith(".bin"))
    .sort()
    .reverse();
}
