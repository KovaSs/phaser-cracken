import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";

export interface PhaserEditorPaths {
  appRoot: string;
  windowManagerJs: string;
  serverBinary: string;
  sessionFile: string;
}

/**
 * Locates the installed Phaser Editor 5 Desktop application
 * across macOS, Windows, and Linux.
 */
export function findPhaserEditor(): PhaserEditorPaths | null {
  const appRoot = findAppRoot();
  if (!appRoot) {
    return null;
  }
  return {
    appRoot,
    windowManagerJs: path.join(appRoot, "src", "js", "WindowManager.js"),
    serverBinary: findServerBinary(appRoot),
    sessionFile: getSessionFilePath(),
  };
}

function findAppRoot(): string | null {
  const platform = process.platform;
  const candidates: string[] = [];

  if (platform === "darwin") {
    candidates.push(
      "/Applications/Phaser Editor 5.app/Contents/Resources/app",
      "/Applications/Phaser Editor.app/Contents/Resources/app",
    );
  } else if (platform === "win32") {
    candidates.push(
      path.join(process.env["ProgramFiles"] || "C:\\Program Files", "Phaser Editor 5", "resources", "app"),
      path.join(process.env["ProgramFiles"] || "C:\\Program Files", "Phaser Editor", "resources", "app"),
      path.join(process.env["LOCALAPPDATA"] || path.join(os.homedir(), "AppData", "Local"), "Phaser Editor 5", "resources", "app"),
      path.join(process.env["LOCALAPPDATA"] || path.join(os.homedir(), "AppData", "Local"), "Phaser Editor", "resources", "app"),
    );
  } else if (platform === "linux") {
    candidates.push(
      "/opt/phaser-editor/resources/app",
      "/opt/PhaserEditor/resources/app",
      "/usr/share/phaser-editor/resources/app",
      "/usr/local/share/phaser-editor/resources/app",
    );
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function findServerBinary(appRoot: string): string {
  const platform = process.platform;
  const exeName = platform === "win32" ? "PhaserEditor.exe" : "PhaserEditor";
  const candidate = path.normalize(path.join(appRoot, "..", "server", exeName));
  if (fs.existsSync(candidate)) {
    return candidate;
  }
  return candidate;
}

function getSessionFilePath(): string {
  return path.join(os.homedir(), ".phasereditor2d", "user-session-v3.bin");
}
