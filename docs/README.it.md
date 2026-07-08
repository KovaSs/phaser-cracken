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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 Utilità di bypass della licenza 5 per uso non commerciale.

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

## Istruzioni per la configurazione

Segui attentamente questi passaggi per evitare problemi:

1. **Scarica e installa Phaser Editor 5**  
   Scegli la versione appropriata per la tua piattaforma dai link sopra.

2. **Avvia l'editor una volta prima della patch**
   - Apri Phaser Editor normalmente.
   - **Accetta il EULA** (Contratto di Licenza con l'Utente Finale) quando richiesto.
   - Chiudi completamente l'editor dopo aver accettato il EULA.
     > ⚠️ **Importante:** Applicare la patch senza aver prima accettato il EULA romperà l'editor (non si aprirà). Questo perché il file flag EULA (`~/.phasereditor2d/eula-accepted`) deve esistere prima che il codice modificato venga eseguito.

3. **Esegui il patcher**

   ```bash
   npm run phaser-cracken --auto
   ```

   Questo applicherà tutte le patch necessarie e avvierà l'editor.

4. **Goditi** – Dopo il primo avvio riuscito, l'editor non richiederà più una licenza o abbonamento. Tutte le funzionalità diventano disponibili offline.

## Installazione

```bash
cd phaser-cracken
npm install
npm run build
```

O globalmente:

```bash
npm install -g .
```

## Avvio rapido

```bash
# Un comando per fare tutto:
npm run phaser-cracken --auto

# O passo dopo passo:
npm run phaser-cracken --patch            # Bypass controllo JS
npm run phaser-cracken --install-proxy    # Bypass controllo binario Go (proxy + reset grazia)
npm run phaser-cracken --copy-session     # Installa il file di sessione incluso
npm run phaser-cracken --reset-grace      # Resetta il periodo di grazia per il controllo avvio Go
npm run phaser-cracken --run              # Avvia l'editor
```

## Come funziona

### Livello 1: Electron Shell

Sostituisce `isEditorActivated()` in `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Livello 2: Proxy binario Go

Crea uno script proxy (Node.js o bash) attorno al binario `PhaserEditor`:

- `-tool print-user-status` → restituisce un finto JSON con `subscriptionActive: true`
- Tutto il resto → delega trasparentemente a `PhaserEditor.real`

```bash
#!/bin/bash
# Resetta il periodo di grazia, intercetta print-user-status, delega tutto il resto
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

## Comandi

| Comando                  | Descrizione                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `patch`                  | Patch `WindowManager.js`                                                            |
| `restore`                | Ripristina `WindowManager.js` originale                                             |
| `install-proxy`          | Installa wrapper proxy attorno al binario `PhaserEditor`                            |
| `install-proxy --force`  | Aggiorna proxy v1 → v2 o reinstalla                                                 |
| `uninstall-proxy`        | Rimuovi proxy, ripristina il binario originale                                      |
| `copy-session [source]`  | Installa file di sessione (usa risorsa inclusa per impostazione predefinita o percorso personalizzato) |
| `reset-grace`            | Pulisci `server.log` / `auth-failure-v1.log` per resettare il periodo di grazia 96h |
| `status`                 | Mostra stato patch, proxy e sessione                                                |
| `run`                    | Avvia Phaser Editor                                                                 |
| `auto`                   | Configurazione completa: patch + proxy + copy-session + reset grazia + avvio                           |
| `auto --no-run`          | Configurazione senza avvio                                                          |
| `backup-session`         | Backup di `user-session-v3.bin`                                                     |
| `restore-session [file]` | Ripristina sessione dal backup                                                      |
| `refresh-session`        | Esegui login Phaser.io per ottenere una nuova sessione                              |

### Opzioni auto

```bash
phaser-cracken auto --no-run    # Salta l'avvio dopo la configurazione
```

## Piattaforme supportate

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## File creati da PhaserCracken

| File                                     | Scopo                                |
| ---------------------------------------- | ------------------------------------ |
| `WindowManager.js.backup`                | Backup del file JS originale         |
| `PhaserEditor.real`                      | Binario Go originale (rinominato)    |
| `PhaserEditor.phaser-cracken.bin-backup` | Copia del binario originale          |
| `PhaserEditor`                           | Script proxy (sostituisce originale) |
| `resources/user-session-v3.bin`          | File di sessione incluso             |

### File di log resettati

Il proxy tronca questi file a ogni avvio per mantenere attivo il periodo di grazia del binario Go:

| File                                    | Scopo                                            |
| --------------------------------------- | ------------------------------------------------ |
| `~/.phasereditor2d/server.log`          | Memorizza timestamp fallimento auth (binario Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Indicatore fallimento autenticazione (Electron)  |

### Livello 3: Periodo di grazia e file di sessione

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## Disinstallazione

```bash
npm run phaser-cracken --restore          # Ripristina WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Ripristina binario PhaserEditor
```

## Requisiti

- Node.js >= 14
- Phaser Editor 5 Desktop installato

## Dichiarazione di non responsabilità

Questo strumento è solo per scopi educativi e uso non commerciale.
È necessario acquistare una licenza valida da [phaser.io](https://phaser.io) se si utilizza Phaser Editor commercialmente.
