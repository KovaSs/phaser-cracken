# ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 ℂ𝕣𝕒𝕔𝕜𝕖𝕟

<p align="center">
  <a href="README.md">English</a> |
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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 lisensomgåelsesverktøy for ikke-kommersiell bruk.

Tre lag med beskyttelse omgås:

1. **Electron JS-sjekk** — patcher `WindowManager.js` slik at `isEditorActivated()` alltid returnerer `true`.
2. **Go binær sjekk (brukerstatus)** — installerer en transparent proxy rundt `PhaserEditor` som fanger opp `-tool print-user-status` og returnerer et falskt abonnementssvar. Alle andre kommandoer sendes videre til den virkelige binære filen.
3. **Go binær sjekk (serveroppstart)** — den binære Go-filen lagrer tidsstempelet for mislykket autentisering i `server.log`. Når 96-timers nådeperioden utløper, nekter den å starte. Proxyen tømmer nå `server.log` og `auth-failure-v1.log` ved hver kjøring, og gir en ny nådeperiode hver gang editoren startes.

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

## Oppsettinstruksjoner

Følg disse trinnene nøye for å unngå problemer:

1. **Last ned og installer Phaser Editor 5**
   Velg riktig versjon for din plattform fra lenkene ovenfor.

2. **Start editoren én gang før patching**
   - Åpne Phaser Editor normalt.
   - **Godta EULA** (Sluttbrukeravtalen) når du blir bedt om det.
   - Lukk editoren helt etter at EULA er godtatt.
     > ⚠️ **Viktig:** Patching uten å ha godtatt EULA først vil ødelegge editoren (den vil ikke åpnes). Dette er fordi EULA-flaggfilen (`~/.phasereditor2d/eula-accepted`) må eksistere før den modifiserte koden kjøres.

3. **Kjør patcheren**

   ```bash
   npm run phaser-cracken --auto
   ```

   Dette vil bruke alle nødvendige patcher og starte editoren.

4. **Nyt** – Etter første vellykkede oppstart vil editoren ikke lenger spørre om lisens eller abonnement. Alle funksjoner blir tilgjengelige offline.

## Installasjon

```bash
cd phaser-cracken
npm install
npm run build
```

Eller globalt:

```bash
npm install -g .
```

## Hurtigstart

```bash
# Én kommando for alt:
npm run phaser-cracken --auto

# Eller steg for steg:
npm run phaser-cracken --patch            # Omgå JS-sjekk
npm run phaser-cracken --install-proxy    # Omgå Go binær sjekk (proxy + nullstill nåde)
npm run phaser-cracken --reset-grace      # Nullstill nådeperiode for Go binær oppstartssjekk
npm run phaser-cracken --run              # Start editoren
```

## Hvordan det fungerer

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

### Lag 2: Go Binary Proxy

Oppretter et proxy-skript (Node.js eller bash) rundt `PhaserEditor` binærfilen:

- `-tool print-user-status` → returnerer falsk JSON med `subscriptionActive: true`
- Alt annet → transparent delegerer til `PhaserEditor.real`

```bash
#!/bin/bash
# Nullstiller nådeperioden, fanger opp print-user-status, delegerer alt annet
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
| `restore`                | Gjenopprett original `WindowManager.js`                                               |
| `install-proxy`          | Installer proxy rundt `PhaserEditor` binærfilen                                       |
| `install-proxy --force`  | Oppgrader proxy v1 → v2 eller reinstaller                                             |
| `uninstall-proxy`        | Fjern proxy, gjenopprett original binærfil                                            |
| `reset-grace`            | Tøm `server.log` / `auth-failure-v1.log` for å nullstille Go binærens 96t nådeperiode |
| `status`                 | Vis status for patch, proxy og sesjon                                                 |
| `run`                    | Start Phaser Editor                                                                   |
| `auto`                   | Fullt oppsett: patch + proxy + nullstill nåde + start                                 |
| `auto --no-run`          | Oppsett uten oppstart                                                                 |
| `backup-session`         | Sikkerhetskopier `user-session-v3.bin`                                                |
| `restore-session [file]` | Gjenopprett sesjon fra sikkerhetskopi                                                 |
| `refresh-session`        | Kjør Phaser.io-innlogging for å få en ny sesjon                                       |

### Auto-alternativer

```bash
phaser-cracken auto --no-run    # Hopp over oppstart etter oppsett
```

## Støttede plattformer

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Filer opprettet av PhaserCracken

| Fil                                      | Formål                              |
| ---------------------------------------- | ----------------------------------- |
| `WindowManager.js.backup`                | Sikkerhetskopi av original JS-fil   |
| `PhaserEditor.real`                      | Original Go binær (omdøpt)          |
| `PhaserEditor.phaser-cracken.bin-backup` | Kopi av original binærfil           |
| `PhaserEditor`                           | Proxy-skript (erstatter originalen) |

### Tilbakestilte loggfiler

Proxyen tømmer disse filene ved hver oppstart for å holde Go-binærens nådeperiode aktiv:

| Fil                                     | Formål                                                    |
| --------------------------------------- | --------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Lagrer tidsstempel for mislykket autentisering (Go binær) |
| `~/.phasereditor2d/auth-failure-v1.log` | Markør for mislykket autentisering (Electron)             |

## Avinstallering

```bash
npm run phaser-cracken --restore          # Gjenopprett WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Gjenopprett PhaserEditor binærfil
```

## Krav

- Node.js >= 14
- Phaser Editor 5 Desktop installert

## Ansvarsfraskrivelse

Dette verktøyet er kun for pedagogiske formål og ikke-kommersiell bruk.
Du bør kjøpe en gyldig lisens fra [phaser.io](https://phaser.io) hvis du bruker Phaser Editor kommersielt.
