import chalk from "chalk";
import { Command } from "commander";
import * as emoji from "node-emoji";
import { execSync } from "child_process";

import { findPhaserEditor, PhaserEditorPaths } from "./finder";
import { isPatched, patchWindowManager, restoreWindowManager } from "./patcher";
import { isProxyInstalled, installProxy, uninstallProxy } from "./proxy";
import { backupSession, listBackups, restoreSession, sessionStatus } from "./session";

const program = new Command();

// ─── helpers ─────────────────────────────────────────────────────────────────

function die(message: string): never {
  console.error(`${chalk.red("\u2716")} ${message}`);
  process.exit(1);
}

function ensureFound(): PhaserEditorPaths {
  const paths = findPhaserEditor();
  if (!paths) {
    die(
      "Phaser Editor 5 not found on this system.\n" +
        "  Supported paths:\n" +
        "    macOS:   /Applications/Phaser Editor 5.app\n" +
        "    Windows: C:\\Program Files\\Phaser Editor\\resources\\app\n" +
        "    Linux:   /opt/phaser-editor/resources/app\n",
    );
  }
  return paths;
}

function doLaunch(paths: PhaserEditorPaths): void {
  console.log(`${chalk.green("==>")} ${emoji.get("rocket")} Launching Phaser Editor...`);

  const p = process.platform;

  if (p === "darwin") {
    const appPath = paths.appRoot.replace(/\/Contents\/Resources\/app$/, "");
    execSync(`open "${appPath}"`, { stdio: "inherit" });
  } else if (p === "win32") {
    const appExe = paths.appRoot.replace(/\\resources\\app$/i, "");
    execSync(`start "" "${appExe}"`, { shell: "cmd.exe" });
  } else {
    console.log(`${chalk.yellow("==>")} Please start Phaser Editor manually.`);
  }
}

function verifyProxy(binPath: string): void {
  try {
    const r = execSync(`"${binPath}" -tool print-user-status 2>/dev/null`, {
      encoding: "utf-8",
      timeout: 5000,
    });
    if (r.includes("subscriptionActive")) {
      console.log(`${chalk.green("==>")} ${emoji.get("white_check_mark")} Verified: fake auth works.`);
    }
  } catch {
    // ignore verification errors
  }
}

// ─── patch ───────────────────────────────────────────────────────────────────

program
  .command("patch")
  .description("Patch WindowManager.js to bypass license check")
  .action(() => {
    const { windowManagerJs } = ensureFound();

    if (isPatched(windowManagerJs)) {
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Already patched \u2014 no action needed.`);
      return;
    }

    console.log(`${chalk.green("==>")} ${emoji.get("hammer")} Patching ${chalk.green(windowManagerJs)}`);
    patchWindowManager(windowManagerJs);

    console.log(`${chalk.green("==>")} ${emoji.get("package")} Backup saved at ${chalk.green(windowManagerJs + ".phaser-cracken.backup")}`);
    console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Patch applied successfully!`);
  });

// ─── restore ─────────────────────────────────────────────────────────────────

program
  .command("restore")
  .description("Restore the original WindowManager.js from backup")
  .action(() => {
    const { windowManagerJs } = ensureFound();

    if (isPatched(windowManagerJs)) {
      console.log(`${chalk.green("==>")} ${emoji.get("arrows_counterclockwise")} Restoring original file...`);
      restoreWindowManager(windowManagerJs);
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Restored successfully.`);
    } else {
      console.log(`${chalk.green("==>")} ${emoji.get("information_source")} File is not patched \u2014 nothing to restore.`);
    }
  });

// ─── status ──────────────────────────────────────────────────────────────────

program
  .command("status")
  .description("Show current patch, proxy and session status")
  .action(() => {
    const paths = findPhaserEditor();

    if (paths) {
      const { windowManagerJs, sessionFile, serverBinary } = paths;

      console.log(`${chalk.bold("Phaser Editor 5")}`);
      console.log(`  App root:      ${chalk.green(paths.appRoot)}`);
      console.log(`  Server binary: ${chalk.green(serverBinary)}`);

      const patched = isPatched(windowManagerJs);
      const wmIcon = patched ? emoji.get("unlock") : emoji.get("lock");
      const wmStatus = patched ? chalk.green("PATCHED") : chalk.yellow("ORIGINAL");
      console.log(`  WindowManager: ${wmIcon} ${wmStatus}`);

      if (patched) {
        console.log(`  WM Backup:     ${chalk.green(windowManagerJs + ".phaser-cracken.backup")}`);
      }

      const proxyInstalled = isProxyInstalled(serverBinary);
      const pxIcon = proxyInstalled ? emoji.get("electric_plug") : emoji.get("no_entry_sign");
      const pxStatus = proxyInstalled ? chalk.green("INSTALLED") : chalk.yellow("NOT INSTALLED");
      console.log(`  Proxy wrapper: ${pxIcon} ${pxStatus}`);

      if (proxyInstalled) {
        const realSuffix = process.platform === "win32" ? ".real.exe" : ".real";
        console.log(`  Real binary:   ${chalk.green(serverBinary + realSuffix)}`);
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

// ─── install-proxy ───────────────────────────────────────────────────────────

program
  .command("install-proxy")
  .description("Install proxy wrapper around PhaserEditor binary")
  .action(() => {
    const { serverBinary } = ensureFound();

    if (isProxyInstalled(serverBinary)) {
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Proxy already installed.`);
      return;
    }

    console.log(`${chalk.green("==>")} ${emoji.get("electric_plug")} Installing proxy wrapper at ${chalk.green(serverBinary)}`);
    installProxy(serverBinary);

    const realSuffix = process.platform === "win32" ? ".real.exe" : ".real";
    console.log(`${chalk.green("==>")} ${emoji.get("package")} Original binary renamed to ${chalk.green(serverBinary + realSuffix)}`);
    console.log(`${chalk.green("==>")} ${emoji.get("package")} Backup saved at ${chalk.green(serverBinary + ".phaser-cracken.bin-backup")}`);
    console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Proxy installed successfully!`);

    verifyProxy(serverBinary);
  });

// ─── uninstall-proxy ─────────────────────────────────────────────────────────

program
  .command("uninstall-proxy")
  .description("Remove proxy wrapper and restore original binary")
  .action(() => {
    const { serverBinary } = ensureFound();

    if (!isProxyInstalled(serverBinary)) {
      console.log(`${chalk.green("==>")} ${emoji.get("information_source")} Proxy is not installed.`);
      return;
    }

    console.log(`${chalk.green("==>")} ${emoji.get("arrows_counterclockwise")} Removing proxy wrapper...`);
    uninstallProxy(serverBinary);
    console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Original binary restored.`);
  });

// ─── refresh-session ─────────────────────────────────────────────────────────

program
  .command("refresh-session")
  .description("Open Phaser.io login to refresh the session file")
  .action(() => {
    const { serverBinary, sessionFile } = ensureFound();

    console.log(`${chalk.green("==>")} ${emoji.get("globe_with_meridians")} Launching Phaser.io login...`);
    console.log(`${chalk.green("==>")} ${emoji.get("information_source")} This will open your browser. Sign in with your Phaser.io account.`);

    try {
      execSync(`"${serverBinary}" -login`, { stdio: "inherit" });
    } catch {
      die("Login process failed. Try running PhaserEditor -login manually.");
    }

    const s = sessionStatus(sessionFile);
    if (s.exists) {
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Session updated! (${(s.size! / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`${chalk.yellow("==>")} ${emoji.get("warning")} Session file was not created. Login may have failed.`);
    }
  });

// ─── backup-session ──────────────────────────────────────────────────────────

program
  .command("backup-session")
  .description("Backup the user-session-v3.bin file")
  .option("-o, --output <dir>", "Backup directory", "./phaser_backup")
  .action((opts: { output?: string }) => {
    const { sessionFile } = ensureFound();

    console.log(`${chalk.green("==>")} ${emoji.get("package")} Backing up session file...`);
    const backupPath = backupSession(sessionFile, opts.output);
    console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} Backup saved: ${chalk.green(backupPath)}`);
  });

// ─── restore-session ─────────────────────────────────────────────────────────

program
  .command("restore-session [backupFile]")
  .description("Restore user-session-v3.bin from a backup")
  .action((backupFile?: string) => {
    const { sessionFile } = ensureFound();

    if (!backupFile) {
      const backups = listBackups("./phaser_backup");
      if (backups.length === 0) {
        die("No backups found in ./phaser_backup/\n  Specify a backup file: phaser-cracken restore-session <path>");
      }
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
  .description("Launch Phaser Editor")
  .action(() => {
    const paths = ensureFound();

    const patched = isPatched(paths.windowManagerJs);
    const proxied = isProxyInstalled(paths.serverBinary);

    if (!patched && !proxied) {
      console.log(`${chalk.yellow("==>")} ${emoji.get("warning")} Neither patch nor proxy installed.`);
      console.log(`${chalk.yellow("==>")} Run ${chalk.bold("phaser-cracken auto")} first for a complete setup.`);
    } else if (!patched) {
      console.log(`${chalk.yellow("==>")} ${emoji.get("warning")} WindowManager is not patched.`);
    } else if (!proxied) {
      console.log(`${chalk.yellow("==>")} ${emoji.get("warning")} Proxy is not installed.`);
    }

    doLaunch(paths);
  });

// ─── auto ────────────────────────────────────────────────────────────────────

program
  .command("auto")
  .description("Complete setup: patch + install-proxy + run")
  .option("--no-run", "Skip launching the editor after setup")
  .action((opts: { run?: boolean }) => {
    const paths = ensureFound();
    const { windowManagerJs, serverBinary } = paths;

    // Step 1: Patch
    if (!isPatched(windowManagerJs)) {
      console.log(`${chalk.green("==>")} ${emoji.get("hammer")} [1/2] Patching WindowManager.js...`);
      patchWindowManager(windowManagerJs);
      console.log(`${chalk.green("==>")}     ${emoji.get("ok_hand")} Patch applied.`);
    } else {
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} [1/2] WindowManager already patched.`);
    }

    // Step 2: Proxy
    if (!isProxyInstalled(serverBinary)) {
      console.log(`${chalk.green("==>")} ${emoji.get("electric_plug")} [2/2] Installing proxy wrapper...`);
      installProxy(serverBinary);
      console.log(`${chalk.green("==>")}     ${emoji.get("ok_hand")} Proxy installed.`);
      verifyProxy(serverBinary);
    } else {
      console.log(`${chalk.green("==>")} ${emoji.get("ok_hand")} [2/2] Proxy already installed.`);
    }

    const patched = isPatched(windowManagerJs);
    const proxied = isProxyInstalled(serverBinary);

    if (patched && proxied) {
      console.log();
      console.log(`${chalk.green("==>")} ${emoji.get("tada")} ${chalk.bold.green("Phaser Editor 5 is fully cracked!")}`);
      console.log(`${chalk.dim("     No license check. No internet required. No expiry.")}`);
    }

    // Step 3: Run (unless --no-run)
    if (opts.run) {
      doLaunch(paths);
    }
  });

// ─── entry point ─────────────────────────────────────────────────────────────

export function runCli(argv: string[] = process.argv): void {
  program
    .name("phaser-cracken")
    .description("Phaser Editor 5 license bypass utility")
    .version("1.1.0")
    .addHelpText("beforeAll", () => {
      return [
        "",
        chalk.blue.bold("  \u26a1 PhaserCracken v1.1.0"),
        chalk.dim("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"),
        "",
      ].join("\n");
    })
    .parse(argv);
}
