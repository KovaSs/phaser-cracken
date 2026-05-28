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

/**
 * Finds just the PhaserEditor binary, independent of the Electron app shell.
 */
export function findPhaserBinary(): string | null {
  const paths = findPhaserEditor();
  if (paths && fs.existsSync(paths.serverBinary)) {
    return paths.serverBinary;
  }

  // Fallback: search known paths directly
  const platform = process.platform;
  const candidates: string[] = [];

  if (platform === "darwin") {
    candidates.push(
      "/Applications/Phaser Editor 5.app/Contents/Resources/server/PhaserEditor",
      "/Applications/Phaser Editor.app/Contents/Resources/server/PhaserEditor",
    );
  } else if (platform === "win32") {
    const base = process.env["ProgramFiles"] || "C:\\Program Files";
    const local = process.env["LOCALAPPDATA"] || path.join(os.homedir(), "AppData", "Local");
    for (const name of ["Phaser Editor 5", "Phaser Editor"]) {
      candidates.push(
        path.join(base, name, "resources", "server", "PhaserEditor.exe"),
        path.join(local, name, "resources", "server", "PhaserEditor.exe"),
      );
    }
  } else {
    for (const prefix of ["/opt", "/usr/share", "/usr/local/share"]) {
      for (const name of ["phaser-editor", "PhaserEditor"]) {
        candidates.push(path.join(prefix, name, "resources", "server", "PhaserEditor"));
      }
    }
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
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

  // Try app/server/ (bundled inside the app directory)
  const bundledCandidate = path.join(appRoot, "server", exeName);
  if (fs.existsSync(bundledCandidate)) {
    return bundledCandidate;
  }

  // Fallback: try sibling server/ directory (older layout)
  const siblingCandidate = path.normalize(path.join(appRoot, "..", "server", exeName));
  if (fs.existsSync(siblingCandidate)) {
    return siblingCandidate;
  }

  return bundledCandidate;
}

function getSessionFilePath(): string {
  return path.join(os.homedir(), ".phasereditor2d", "user-session-v3.bin");
}
