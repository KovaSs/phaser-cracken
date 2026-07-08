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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5-Lizenzumgehungsdienstprogramm für nicht-kommerzielle Nutzung.

Three layers of protection are bypassed:

1. **Electron JS check** — patches `WindowManager.js` so `isEditorActivated()` always returns `true`.
2. **Go binary proxy** — installs a transparent proxy around `PhaserEditor` that intercepts `-tool print-user-status` and returns a fake subscription response. All other commands pass through to the real binary.
3. **Grace period reset** — the Go binary stores the auth failure timestamp in `server.log`. When the 96-hour grace period expires, it refuses to start. The proxy truncates `server.log` and `auth-failure-v1.log` on every invocation, giving a fresh grace period each time the editor launches. A bundled session file (`copy-session`) prevents the binary from skipping validation when no session exists.

## ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣

### 5.0.2 Desktop

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-5.0.2-Setup.exe) <br>
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-macos.dmg) <br>
[macOS (Apple Silicon)](https://disk.yandex.ru/d/GYCs4Yy47L2gYA) <br>
[Linux](https://cdn.phaser.io/downloads/editor/PhaserEditor-desktop-5.0.2-linux.zip) <br>

### 5.0.2 Core

[Windows](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-windows.zip) <br>
[macOS (Intel)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos.zip) <br>
[macOS (Apple Silicon)](https://cdn.phaser.io/downloads/editor/PhaserEditor-core-5.0.2-macos_arm.zip) <br>

## Einrichtungsanleitung

Befolgen Sie diese Schritte sorgfältig, um Probleme zu vermeiden:

1. **Phaser Editor 5 herunterladen und installieren**  
   Wählen Sie die entsprechende Version für Ihre Plattform aus den obigen Links.

2. **Starten Sie den Editor einmal vor dem Patchen**
   - Öffnen Sie Phaser Editor normal.
   - **Akzeptieren Sie die EULA** (Endbenutzer-Lizenzvereinbarung) wenn Sie dazu aufgefordert werden.
   - Schließen Sie den Editor vollständig, nachdem die EULA akzeptiert wurde.
     > ⚠️ **Wichtig:** Das Patchen ohne vorherige Annahme der EULA wird den Editor beschädigen (er wird nicht mehr geöffnet). Dies liegt daran, dass die EULA-Kennzeichnungsdatei (`~/.phasereditor2d/eula-accepted`) vorhanden sein muss, bevor der modifizierte Code ausgeführt wird.

3. **Patcher ausführen**

   ```bash
   npm run phaser-cracken --auto
   ```

   Dies wendet alle erforderlichen Patches an und startet den Editor.

4. **Genießen** – Nach dem ersten erfolgreichen Start fragt der Editor nicht mehr nach einer Lizenz oder einem Abonnement. Alle Funktionen sind offline verfügbar.

## Installation

```bash
cd phaser-cracken
npm install
npm run build
```

Oder global:

```bash
npm install -g .
```

## Schnellstart

```bash
# Ein Befehl für alles:
npm run phaser-cracken --auto

# Oder Schritt für Schritt:
npm run phaser-cracken --patch            # JS-Prüfung umgehen
npm run phaser-cracken --install-proxy    # Go-Binärprüfung umgehen (Proxy + Gnadenfrist-Reset)
npm run phaser-cracken --copy-session     # Gebündelte Sitzungsdatei installieren
npm run phaser-cracken --reset-grace      # Gnadenfrist für Go-Binärstart-Prüfung zurücksetzen
npm run phaser-cracken --run              # Editor starten
```

## Funktionsweise

### Ebene 1: Electron Shell

Ersetzt `isEditorActivated()` in `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Ebene 2: Go-Binärproxy

Erstellt ein Proxy-Skript (Node.js oder bash) um die `PhaserEditor`-Binärdatei:

- `-tool print-user-status` → gibt gefälschtes JSON mit `subscriptionActive: true` zurück
- Alles andere → delegiert transparent an `PhaserEditor.real`

```bash
#!/bin/bash
# Setzt Gnadenfrist zurück, fängt print-user-status ab, delegiert alles andere
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

## Befehle

| Befehl                   | Beschreibung                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `patch`                  | `WindowManager.js` patchen                                                         |
| `restore`                | Original `WindowManager.js` wiederherstellen                                       |
| `install-proxy`          | Proxy-Wrapper um `PhaserEditor`-Binärdatei installieren                            |
| `install-proxy --force`  | Proxy v1 → v2 aktualisieren oder neu installieren                                  |
| `uninstall-proxy`        | Proxy entfernen, originale Binärdatei wiederherstellen                             |
| `copy-session [source]`  | Sitzungsdatei installieren (verwendet standardmäßig gebündelte Ressource oder benutzerdefinierten Pfad) |
| `reset-grace`            | `server.log` / `auth-failure-v1.log` leeren, um die 96h Gnadenfrist zurückzusetzen |
| `status`                 | Patch-, Proxy- und Sitzungsstatus anzeigen                                         |
| `run`                    | Phaser Editor starten                                                              |
| `auto`                   | Komplette Einrichtung: Patch + Proxy + copy-session + Gnadenfrist-Reset + Start                       |
| `auto --no-run`          | Einrichtung ohne Start                                                             |
| `backup-session`         | `user-session-v3.bin` sichern                                                      |
| `restore-session [file]` | Sitzung aus Backup wiederherstellen                                                |
| `refresh-session`        | Phaser.io-Login ausführen, um eine neue Sitzung zu erhalten                        |

### Auto-Optionen

```bash
phaser-cracken auto --no-run    # Start nach Einrichtung überspringen
```

## Unterstützte Plattformen

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Von PhaserCracken erstellte Dateien

| Datei                                    | Zweck                               |
| ---------------------------------------- | ----------------------------------- |
| `WindowManager.js.backup`                | Original-JS-Datei-Backup            |
| `PhaserEditor.real`                      | Originale Go-Binärdatei (umbenannt) |
| `PhaserEditor.phaser-cracken.bin-backup` | Kopie der originalen Binärdatei     |
| `PhaserEditor`                           | Proxy-Skript (ersetzt Original)     |
| `resources/user-session-v3.bin`          | Gebündelte Sitzungsdatei            |

### Zurückgesetzte Logdateien

Der Proxy kürzt diese Dateien bei jedem Start, um die Gnadenfrist der Go-Binärdatei aktiv zu halten:

| Datei                                   | Zweck                                                          |
| --------------------------------------- | -------------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Speichert Authentifizierungsfehler-Zeitstempel (Go-Binärdatei) |
| `~/.phasereditor2d/auth-failure-v1.log` | Authentifizierungsfehler-Markierung (Electron)                 |

### Ebene 3: Gnadenfrist und Sitzungsdatei

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## Deinstallation

```bash
npm run phaser-cracken --restore          # WindowManager.js wiederherstellen
npm run phaser-cracken --uninstall-proxy  # PhaserEditor-Binärdatei wiederherstellen
```

## Voraussetzungen

- Node.js >= 14
- Phaser Editor 5 Desktop installiert

## Haftungsausschluss

Dieses Tool dient nur zu Bildungszwecken und zur nicht-kommerziellen Nutzung.
Sie sollten eine gültige Lizenz von [phaser.io](https://phaser.io) erwerben, wenn Sie Phaser Editor kommerziell nutzen.
