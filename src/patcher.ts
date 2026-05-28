import * as fs from "fs-extra";

const PATCHED_SIGNATURE = "// PATCHED by PhaserCracken";

const PATCHED_METHOD = [
  "    isEditorActivated() {",
  `        ${PATCHED_SIGNATURE}`,
  "        return true;",
  "    }",
].join("\n");

/**
 * Regex to match the entire `isEditorActivated()` method.
 * Matches from `    isEditorActivated() {` through the closing `    }`.
 */
const METHOD_REGEX = /    isEditorActivated\(\) \{[\s\S]*?\n    \}/;

/**
 * Checks if WindowManager.js has already been patched.
 */
export function isPatched(jsPath: string): boolean {
  if (!fs.existsSync(jsPath)) {
    return false;
  }
  const content = fs.readFileSync(jsPath, "utf-8");
  return content.includes(PATCHED_SIGNATURE);
}

function getBackupPath(jsPath: string): string {
  return jsPath + ".phaser-cracken.backup";
}

function ensureBackup(jsPath: string): string {
  const backupPath = getBackupPath(jsPath);
  if (!fs.existsSync(backupPath)) {
    fs.copySync(jsPath, backupPath);
  }
  return backupPath;
}

/**
 * Patches WindowManager.js: replaces `isEditorActivated()` with `return true`.
 * Automatically creates a backup if one doesn't exist.
 * Throws if already patched or if the file doesn't exist.
 */
export function patchWindowManager(jsPath: string): void {
  if (!fs.existsSync(jsPath)) {
    throw new Error(`WindowManager.js not found at: ${jsPath}`);
  }

  const content = fs.readFileSync(jsPath, "utf-8");

  if (content.includes(PATCHED_SIGNATURE)) {
    throw new Error("WindowManager.js is already patched.");
  }

  if (!METHOD_REGEX.test(content)) {
    throw new Error(
      "Could not find isEditorActivated() method in WindowManager.js.\n" +
        "The file may already be modified or from an incompatible Phaser Editor version.",
    );
  }

  ensureBackup(jsPath);

  const patchedContent = content.replace(METHOD_REGEX, PATCHED_METHOD);
  fs.writeFileSync(jsPath, patchedContent, "utf-8");
}

/**
 * Restores the original WindowManager.js from backup.
 * Throws if no backup exists.
 */
export function restoreWindowManager(jsPath: string): void {
  const backupPath = getBackupPath(jsPath);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`No backup found at: ${backupPath}`);
  }

  fs.copySync(backupPath, jsPath);
  fs.removeSync(backupPath);
}

/**
 * Removes the backup file if it exists (cleanup).
 */
export function removeBackup(jsPath: string): void {
  const backupPath = getBackupPath(jsPath);
  if (fs.existsSync(backupPath)) {
    fs.removeSync(backupPath);
  }
}
