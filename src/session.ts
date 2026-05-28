import * as fs from "fs-extra";
import * as path from "path";

export interface SessionStatus {
  exists: boolean;
  size: number | null;
  mtime: Date | null;
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
