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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5-Lizenzumgehungsdienstprogramm für nicht-kommerzielle Nutzung.

Vier Schutzebenen werden umgangen:

1. **Electron JS-Prüfung** — patcht `WindowManager.js`, sodass `isEditorActivated()` immer `true` zurückgibt.
2. **Go-Binärprüfung (Benutzerstatus)** — installiert einen transparenten Proxy um `PhaserEditor`, der `-tool print-user-status` abfängt und eine gefälschte Abonnementantwort zurückgibt. Alle anderen Befehle werden an die echte Binärdatei durchgereicht.
3. **Go-Binärprüfung (Serverstart — Gnadenfrist)** — die Go-Binärdatei speichert den Zeitstempel des Authentifizierungsfehlers in `server.log`. Wenn die 96-Stunden-Gnadenfrist abläuft, verweigert sie den Start. Der Proxy kürzt nun `server.log` und `auth-failure-v1.log` bei jedem Aufruf und gewährt so jedes Mal eine neue Gnadenfrist, wenn der Editor gestartet wird.
4. **Go-Binärprüfung (Serverstart — HTTP-Validierung)** — die Go-Binärdatei führt eine direkte HTTP-Anfrage an `https://phaser.io/api/user/?has=product:editor:desktop` durch. Wenn der Server mit "keine Berechtigung" antwortet, blockiert die Binärdatei sofort (kein Gnadenmodus). Der Proxy setzt `HTTPS_PROXY` auf eine ungültige Adresse, wodurch die HTTP-Anfrage fehlschlägt und in den Gnadenmodus zurückfällt.

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
# Setzt Gnadenfrist zurück, blockiert phaser.io-Validierung,
# fängt print-user-status ab, delegiert alles andere
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # Erzwingt Gnadenmodus

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
| `reset-grace`            | `server.log` / `auth-failure-v1.log` leeren, um die 96h Gnadenfrist zurückzusetzen |
| `status`                 | Patch-, Proxy- und Sitzungsstatus anzeigen                                         |
| `run`                    | Phaser Editor starten                                                              |
| `auto`                   | Komplette Einrichtung: Patch + Proxy + Gnadenfrist-Reset + Start                   |
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

### Zurückgesetzte Logdateien

Der Proxy kürzt diese Dateien bei jedem Start, um die Gnadenfrist der Go-Binärdatei aktiv zu halten:

| Datei                                   | Zweck                                                          |
| --------------------------------------- | -------------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Speichert Authentifizierungsfehler-Zeitstempel (Go-Binärdatei) |
| `~/.phasereditor2d/auth-failure-v1.log` | Authentifizierungsfehler-Markierung (Electron)                 |

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
