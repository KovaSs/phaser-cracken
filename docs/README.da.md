# ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 ℂ𝕣𝕒𝕔𝕜𝕖𝕟

<p align="center">
  <a href="../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 licensomgåelsesværktøj til ikke-kommerciel brug.

Three layers of protection are bypassed:

1. **Electron JS check** — patches `WindowManager.js` so `isEditorActivated()` always returns `true`.
2. **Go binary proxy** — installs a transparent proxy around `PhaserEditor` that intercepts `-tool print-user-status` and returns a fake subscription response. All other commands pass through to the real binary.
3. **Grace period reset** — the Go binary stores the auth failure timestamp in `server.log`. When the 96-hour grace period expires, it refuses to start. The proxy truncates `server.log` and `auth-failure-v1.log` on every invocation, giving a fresh grace period each time the editor launches. A bundled session file (`copy-session`) prevents the binary from skipping validation when no session exists.

## ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣

### 5.0.2 desktop

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-5.0.2-Setup.exe) <br>
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-macos.dmg) <br>
[macOS (Apple Silicon)](https://disk.yandex.ru/d/GYCs4Yy47L2gYA) <br>
[Linux](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-linux.zip) <br>

### 5.0.2 core

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-windows.zip) <br>
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos.zip) <br>
[macOS (Apple Silicon)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos_arm.zip) <br>

## Installationsvejledning

Følg disse trin omhyggeligt for at undgå problemer:

1. **Download og installer Phaser Editor 5**  
   Vælg den passende version til din platform fra linkene ovenfor.

2. **Start editoren én gang før patchning**
   - Åbn Phaser Editor normalt.
   - **Accepter EULA** (Slutbrugerlicensaftalen), når du bliver bedt om det.
   - Luk editoren helt, efter at EULA er accepteret.
     > ⚠️ **Vigtigt:** Patchning uden først at have accepteret EULA vil ødelægge editoren (den vil ikke kunne åbnes). Dette skyldes, at EULA-flagfilen (`~/.phasereditor2d/eula-accepted`) skal eksistere, før den ændrede kode kører.

3. **Kør patcheren**

   ```bash
   npm run phaser-cracken --auto
   ```

   Dette anvender alle nødvendige patches og starter editoren.

4. **Nyd det** – Efter den første vellykkede start vil editoren ikke længere bede om en licens eller et abonnement. Alle funktioner bliver tilgængelige offline.

## Installation

```bash
cd phaser-cracken
npm install
npm run build
```

Eller globalt:

```bash
npm install -g .
```

## Hurtig start

```bash
# En kommando til at gøre alt:
npm run phaser-cracken --auto

# Eller trin for trin:
npm run phaser-cracken --patch            # Omgå JS-tjek
npm run phaser-cracken --install-proxy    # Omgå Go binærtjek (proxy + nådeperiode-nulstilling)
npm run phaser-cracken --copy-session     # Installer bundtet sessionsfil
npm run phaser-cracken --reset-grace      # Nulstil nådeperiode for Go binær start-tjek
npm run phaser-cracken --run              # Start editoren
```

## Sådan virker det

### Lag 1: Electron Shell

Erstatter `isEditorActivated()` i `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Lag 2: Go binær proxy

Opretter et proxyscript (Node.js eller bash) omkring `PhaserEditor`-binæren:

- `-tool print-user-status` → returnerer falsk JSON med `subscriptionActive: true`
- Alt andet → sender transparent videre til `PhaserEditor.real`

```bash
#!/bin/bash
# Nulstiller nådeperiode, opsnapper print-user-status, sender alt andet videre
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## Kommandoer

| Kommando                 | Beskrivelse                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `patch`                  | Patch `WindowManager.js`                                                              |
| `restore`                | Gendan original `WindowManager.js`                                                    |
| `install-proxy`          | Installer proxy-wrapper omkring `PhaserEditor` binær                                  |
| `install-proxy --force`  | Opgrader proxy v1 → v2 eller geninstaller                                             |
| `uninstall-proxy`        | Fjern proxy, gendan original binær                                                    |
| `copy-session [source]`  | Installer sessionsfil (bruger bundtet ressource som standard, eller brugerdefineret sti) |
| `reset-grace`            | Ryd `server.log` / `auth-failure-v1.log` for at nulstille Go-binærens 96t nådeperiode |
| `status`                 | Vis patch-, proxy- og sessionsstatus                                                  |
| `run`                    | Start Phaser Editor                                                                   |
| `auto`                   | Komplet opsætning: patch + proxy + copy-session + nådeperiode-nulstilling + start                        |
| `auto --no-run`          | Opsætning uden start                                                                  |
| `backup-session`         | Sikkerhedskopier `user-session-v3.bin`                                                |
| `restore-session [file]` | Gendan session fra sikkerhedskopi                                                     |
| `refresh-session`        | Kør Phaser.io-login for at få en ny session                                           |

### Auto-indstillinger

```bash
phaser-cracken auto --no-run    # Spring start over efter opsætning
```

## Understøttede platforme

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Filer oprettet af PhaserCracken

| Fil                                      | Formål                            |
| ---------------------------------------- | --------------------------------- |
| `WindowManager.js.backup`                | Sikkerhedskopi af original JS-fil |
| `PhaserEditor.real`                      | Original Go binær (omdøbt)        |
| `PhaserEditor.phaser-cracken.bin-backup` | Kopi af original binær            |
| `PhaserEditor`                           | Proxyscript (erstatter original)  |
| `resources/user-session-v3.bin`          | Bundtet sessionsfil               |

### Logfiler der nulstilles

Proxyen afkorter disse filer ved hver start for at holde Go-binærens nådeperiode aktiv:

| Fil                                     | Formål                                             |
| --------------------------------------- | -------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Gemmer tidsstempel for godkendelsesfejl (Go binær) |
| `~/.phasereditor2d/auth-failure-v1.log` | Markeringsfil for godkendelsesfejl (Electron)      |

### Lag 3: Nådeperiode og sessionsfil

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## Afinstallation

```bash
npm run phaser-cracken --restore          # Gendan WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Gendan PhaserEditor binær
```

## Krav

- Node.js >= 14
- Phaser Editor 5 Desktop installeret

## Ansvarsfraskrivelse

Dette værktøj er kun til uddannelsesformål og ikke-kommerciel brug.
Du bør købe en gyldig licens fra [phaser.io](https://phaser.io), hvis du bruger Phaser Editor kommercielt.
