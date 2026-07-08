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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 alat za zaobilaženje licence za nekomercijalnu upotrebu.

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

## Upute za podešavanje

Pažljivo slijedite ove korake kako biste izbjegli probleme:

1. **Preuzmite i instalirajte Phaser Editor 5**
   Odaberite odgovarajuću verziju za svoju platformu sa gornjih linkova.

2. **Pokrenite editor jednom prije patchanja**
   - Otvorite Phaser Editor normalno.
   - **Prihvatite EULA** (Licencni ugovor krajnjeg korisnika) kada se zatraži.
   - Potpuno zatvorite editor nakon što je EULA prihvaćen.
     > ⚠️ **Važno:** Patchanje bez prethodnog prihvatanja EULA će pokvariti editor (neće se moći otvoriti). To je zato što EULA označeni fajl (`~/.phasereditor2d/eula-accepted`) mora postojati prije nego što modificirani kod pokrene.

3. **Pokrenite patcher**

   ```bash
   npm run phaser-cracken --auto
   ```

   Ovo će primijeniti sve potrebne patcheve i pokrenuti editor.

4. **Uživajte** – Nakon prvog uspješnog pokretanja, editor više neće tražiti licencu ili pretplatu. Sve funkcije postaju dostupne offline.

## Instalacija

```bash
cd phaser-cracken
npm install
npm run build
```

Ili globalno:

```bash
npm install -g .
```

## Brzi početak

```bash
# Jedna komanda za sve:
npm run phaser-cracken --auto

# Ili korak po korak:
npm run phaser-cracken --patch            # Zaobiđi JS provjeru
npm run phaser-cracken --install-proxy    # Zaobiđi Go binary provjeru (proxy + reset grejsa)
npm run phaser-cracken --copy-session     # Instaliraj priloženu sesijsku datoteku
npm run phaser-cracken --reset-grace      # Resetuj grejs period za Go binary provjeru pokretanja
npm run phaser-cracken --run              # Pokreni editor
```

## Kako radi

### Sloj 1: Electron Shell

Zamjenjuje `isEditorActivated()` u `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Sloj 2: Go Binary Proxy

Kreira proxy skriptu (Node.js ili bash) oko `PhaserEditor` binarne datoteke:

- `-tool print-user-status` → vraća lažni JSON sa `subscriptionActive: true`
- Sve ostalo → transparentno delegira na `PhaserEditor.real`

```bash
#!/bin/bash
# Resetuje grejs period, presreće print-user-status, prosljeđuje sve ostalo
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

## Komande

| Komanda                  | Opis                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `patch`                  | Patchuj `WindowManager.js`                                                           |
| `restore`                | Vrati originalni `WindowManager.js`                                                  |
| `install-proxy`          | Instaliraj proxy oko `PhaserEditor` binarne datoteke                                 |
| `install-proxy --force`  | Nadogradi proxy v1 → v2 ili reinstaliraj                                             |
| `uninstall-proxy`        | Ukloni proxy, vrati originalnu binarnu datoteku                                      |
| `copy-session [source]`  | Instaliraj sesijsku datoteku (podrazumijevano koristi priloženi resurs ili prilagođenu putanju) |
| `reset-grace`            | Očisti `server.log` / `auth-failure-v1.log` da resetuješ 96h grejs period Go binarne |
| `status`                 | Prikaži status patcha, proxy i sesije                                                |
| `run`                    | Pokreni Phaser Editor                                                                |
| `auto`                   | Potpuno podešavanje: patch + proxy + copy-session + reset grejsa + pokretanje                           |
| `auto --no-run`          | Podešavanje bez pokretanja                                                           |
| `backup-session`         | Napravi sigurnosnu kopiju `user-session-v3.bin`                                      |
| `restore-session [file]` | Vrati sesiju iz sigurnosne kopije                                                    |
| `refresh-session`        | Pokreni Phaser.io prijavu da dobiješ novu sesiju                                     |

### Auto opcije

```bash
phaser-cracken auto --no-run    # Preskoči pokretanje nakon podešavanja
```

## Podržane platforme

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Datoteke kreirane od strane PhaserCracken

| Datoteka                                 | Svrha                                  |
| ---------------------------------------- | -------------------------------------- |
| `WindowManager.js.backup`                | Sigurnosna kopija originalnog JS fajla |
| `PhaserEditor.real`                      | Originalni Go binary (preimenovan)     |
| `PhaserEditor.phaser-cracken.bin-backup` | Kopija originalnog binarne datoteke    |
| `PhaserEditor`                           | Proxy skript (zamjenjuje original)     |
| `resources/user-session-v3.bin`          | Priložena sesijska datoteka            |

### Resetovane log datoteke

Proxy skraćuje ove datoteke pri svakom pokretanju kako bi grejs period Go binarne datoteke ostao aktivan:

| Datoteka                                | Svrha                                                             |
| --------------------------------------- | ----------------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Pohranjuje vremensku oznaku neuspjele autentifikacije (Go binary) |
| `~/.phasereditor2d/auth-failure-v1.log` | Oznaka neuspjele autentifikacije (Electron)                       |

### Sloj 3: Grejs period i sesijska datoteka

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## Deinstalacija

```bash
npm run phaser-cracken --restore          # Vrati WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Vrati PhaserEditor binarnu datoteku
```

## Zahtjevi

- Node.js >= 14
- Instaliran Phaser Editor 5 Desktop

## Izjava o odricanju odgovornosti

Ovaj alat je namijenjen isključivo u obrazovne svrhe i za nekomercijalnu upotrebu.
Trebali biste kupiti važeću licencu na [phaser.io](https://phaser.io) ako Phaser Editor koristite komercijalno.
