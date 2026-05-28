import chalk from "chalk";
import { Command } from "commander";
import * as emoji from "node-emoji";

import { findPhaserEditor } from "./finder";
import { isPatched, patchWindowManager, restoreWindowManager } from "./patcher";
import { backupSession, listBackups, restoreSession, sessionStatus } from "./session";

const program = new Command();

function die(message: string): never {
  console.error(`${chalk.red("✖")} ${message}`);
  process.exit(1);
}

function ensureFound() {
  const paths = findPhaserEditor();
  if (!paths) {
    die("Phaser Editor 5 not found on this system.\n" +
      "  Supported paths:\n" +
      "    macOS:   /Applications/Phaser Editor 5.app\n" +
      "    Windows: C:\\Program Files\\Phaser Editor\\resources\\app\n" +
      "    Linux:   /opt/phaser-editor/resources/app\n");
  }
  return paths;
}

// ─── patch ───────────────────────────────────────────────────────────────────

program
  .command("patch")
  .description("Patch WindowManager.js to bypass license check")
  .action(() => {
    const paths = ensureFound();
    const { windowManagerJs } = paths;

    if (isPatched(windowManagerJs)) {
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Already patched — no action needed.`);
      return;
    }

    console.log(`${chalk.green("==>")} ${emoji.get("hammer")} Patching ${chalk.green(windowManagerJs)}`);
    patchWindowManager(windowManagerJs);

    console.log(`${chalk.green("==>")} ${emoji.get("package")} Backup saved at ${chalk.green(windowManagerJs + ".phaser-cracken.backup")}`);
    console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Patch applied successfully!`);
    console.log(`${chalk.green("==>")} ${emoji.get("rocket")} Run ${chalk.bold("phaser-cracken run")} to launch the editor.`);
  });

// ─── restore ─────────────────────────────────────────────────────────────────

program
  .command("restore")
  .description("Restore the original WindowManager.js from backup")
  .action(() => {
    const paths = ensureFound();
    const { windowManagerJs } = paths;

    if (isPatched(windowManagerJs)) {
      console.log(`${chalk.green("==>")} ${emoji.get("arrows_counterclockwise")} Restoring original file...`);
      restoreWindowManager(windowManagerJs);
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Restored successfully.`);
    } else if (!isPatched(windowManagerJs)) {
      console.log(`${chalk.green("==>")} ${emoji.get("information_source")} File is not patched — nothing to restore.`);
    }
  });

// ─── status ──────────────────────────────────────────────────────────────────

program
  .command("status")
  .description("Show current patch and session status")
  .action(() => {
    const paths = findPhaserEditor();

    if (paths) {
      const { windowManagerJs, sessionFile, serverBinary } = paths;

      console.log(`${chalk.bold("Phaser Editor 5")}`);
      console.log(`  App root:      ${chalk.green(paths.appRoot)}`);
      console.log(`  Server binary: ${chalk.green(serverBinary)}`);

      const patched = isPatched(windowManagerJs);
      const icon = patched ? emoji.get("unlock") : emoji.get("lock");
      const status = patched ? chalk.green("PATCHED") : chalk.yellow("ORIGINAL");
      console.log(`  WindowManager: ${icon} ${status}`);

      if (patched) {
        console.log(`  Backup:        ${chalk.green(windowManagerJs + ".phaser-cracken.backup")}`);
      }
    } else {
      console.log(`${chalk.yellow("Phaser Editor 5 not found on this system.")}`);
    }

    const sessionFile = paths?.sessionFile;
    if (sessionFile) {
      const s = sessionStatus(sessionFile);
      if (s.exists) {
        const sizeKB = ((s.size || 0) / 1024).toFixed(1);
        console.log(`  Session file:  ${emoji.get("white_check_mark")} ${chalk.green(`${sizeKB} KB`)} (${s.mtime})`);
      } else {
        console.log(`  Session file:  ${emoji.get("x")} ${chalk.red("not found")}`);
      }
    }
    console.log();
  });

// ─── backup-session ──────────────────────────────────────────────────────────

program
  .command("backup-session")
  .description("Backup the user-session-v3.bin file")
  .option("-o, --output <dir>", "Backup directory", "./phaser_backup")
  .action((opts) => {
    const paths = ensureFound();
    const { sessionFile } = paths;

    console.log(`${chalk.green("==>")} ${emoji.get("package")} Backing up session file...`);
    const backupPath = backupSession(sessionFile, opts.output);
    console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Backup saved: ${chalk.green(backupPath)}`);
  });

// ─── restore-session ─────────────────────────────────────────────────────────

program
  .command("restore-session [backupFile]")
  .description("Restore user-session-v3.bin from a backup")
  .action((backupFile) => {
    const paths = ensureFound();
    const { sessionFile } = paths;

    if (!backupFile) {
      // List available backups in default dir
      const backups = listBackups("./phaser_backup");
      if (backups.length === 0) {
        die("No backups found in ./phaser_backup/\n  Specify a backup file: phaser-cracken restore-session <path>");
      }
      // Use latest
      backupFile = "./phaser_backup/" + backups[0];
      console.log(`${chalk.green("==>")} ${emoji.get("information_source")} Using latest backup: ${chalk.green(backupFile)}`);
    }

    console.log(`${chalk.green("==>")} ${emoji.get("arrows_counterclockwise")} Restoring session file...`);
    restoreSession(backupFile, sessionFile);
    console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Session restored successfully.`);
  });

// ─── run ─────────────────────────────────────────────────────────────────────

program
  .command("run")
  .description("Launch Phaser Editor (requires prior patch)")
  .action(() => {
    const paths = ensureFound();

    if (!isPatched(paths.windowManagerJs)) {
      console.log(`${chalk.yellow("==>")} ${emoji.get("warning")} WindowManager.js is not patched. Run ${chalk.bold("phaser-cracken patch")} first.`);

      // Still try to run - maybe session file exists and works
      console.log(`${chalk.green("==>")} ${emoji.get("rocket")} Attempting to launch anyway...`);
    }

    const platform = process.platform;
    const appPath = platform === "darwin"
      ? paths.appRoot.replace(/\/Contents\/Resources\/app$/, "")
      : undefined;

    console.log(`${chalk.green("==>")} ${emoji.get("rocket")} Launching Phaser Editor...`);

    if (platform === "darwin" && appPath) {
      const { execSync } = require("child_process");
      try {
        execSync(`open "${appPath}"`, { stdio: "inherit" });
      } catch {
        die("Failed to launch Phaser Editor via 'open'. Try launching it manually.");
      }
    } else if (platform === "win32") {
      const { execSync } = require("child_process");
      try {
        execSync(`start "" "${paths.serverBinary.replace(/PhaserEditor\.exe$/, "Phaser Editor.exe")}"`, { shell: true });
      } catch {
        console.log(`${chalk.yellow("==>")} Could not auto-launch. Please start Phaser Editor manually.`);
      }
    } else {
      // Linux
      console.log(`${chalk.yellow("==>")} Please start Phaser Editor manually.`);
    }
  });

// ─── auto ────────────────────────────────────────────────────────────────────

program
  .command("auto")
  .description("Patch and run in one command")
  .action(async () => {
    const paths = ensureFound();
    const { windowManagerJs } = paths;

    if (!isPatched(windowManagerJs)) {
      console.log(`${chalk.green("==>")} ${emoji.get("hammer")} Patching ${chalk.green(windowManagerJs)}`);
      patchWindowManager(windowManagerJs);
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Patch applied successfully!`);
    } else {
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Already patched.`);
    }

    // Now run via the 'run' command logic
    const appPath = process.platform === "darwin"
      ? paths.appRoot.replace(/\/Contents\/Resources\/app$/, "")
      : undefined;

    console.log(`${chalk.green("==>")} ${emoji.get("rocket")} Launching Phaser Editor...`);

    if (process.platform === "darwin" && appPath) {
      const { execSync } = require("child_process");
      try {
        execSync(`open "${appPath}"`, { stdio: "inherit" });
      } catch {
        die("Failed to launch. Try starting Phaser Editor manually.");
      }
    } else {
      console.log(`${chalk.yellow("==>")} Please start Phaser Editor manually.`);
    }
  });

export function runCli(argv: string[] = process.argv): void {
  program
    .name("phaser-cracken")
    .description("Phaser Editor 5 license bypass utility")
    .version("1.0.0")
    .addHelpText("beforeAll", () => {
      return [
        "",
        chalk.blue.bold("  ⚡ PhaserCracken v1.0.0"),
        chalk.dim("  ───────────────────────────────"),
        "",
      ].join("\n");
    })
    .parse(argv);
}
