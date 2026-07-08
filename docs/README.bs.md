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

Četiri sloja zaštite su zaobiđena:

1. **Electron JS provjera** — patcha `WindowManager.js` tako da `isEditorActivated()` uvijek vraća `true`.
2. **Go binary provjera (status korisnika)** — instalira transparentni proxy oko `PhaserEditor` koji presreće `-tool print-user-status` i vraća lažni odgovor pretplate. Sve ostale komande se prosljeđuju pravom binarnom fajlu.
3. **Go binary provjera (pokretanje servera — grejs period)** — Go binary pohranjuje vremensku oznaku neuspjele autentifikacije u `server.log`. Kada 96-satni grejs period istekne, odbija da se pokrene. Proxy sada skraćuje `server.log` i `auth-failure-v1.log` pri svakom pozivu, dajući svježi grejs period svaki put kada se editor pokrene.
4. **Go binary provjera (pokretanje servera — HTTP validacija)** — Go binary šalje direktan HTTP zahtjev na `https://phaser.io/api/user/?has=product:editor:desktop`. Ako server odgovori sa "nema dozvole", binary blokira odmah (bez grejs moda). Proxy postavlja `HTTPS_PROXY` na nevažeću adresu, prisiljavajući HTTP zahtjev da ne uspije i vrati se u grejs mod.

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
npm run phaser-cracken --seed-session     # Kreiraj unaprijed izgrađenu sesijsku datoteku (potrebno ako nedostaje)
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
# Resetuje grejs period, blokira phaser.io validaciju,
# presreće print-user-status, prosljeđuje sve ostalo
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # Forsira grejs mod

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
| `seed-session`           | Kreiraj unaprijed izgrađenu sesijsku datoteku (potrebno kada Go binary preskoči validaciju) |
| `reset-grace`            | Očisti `server.log` / `auth-failure-v1.log` da resetuješ 96h grejs period Go binarne |
| `status`                 | Prikaži status patcha, proxy i sesije                                                |
| `run`                    | Pokreni Phaser Editor                                                                |
| `auto`                   | Potpuno podešavanje: patch + proxy + seed-session + reset grejsa + pokretanje                           |
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

### Resetovane log datoteke

Proxy skraćuje ove datoteke pri svakom pokretanju kako bi grejs period Go binarne datoteke ostao aktivan:

| Datoteka                                | Svrha                                                             |
| --------------------------------------- | ----------------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Pohranjuje vremensku oznaku neuspjele autentifikacije (Go binary) |
| `~/.phasereditor2d/auth-failure-v1.log` | Oznaka neuspjele autentifikacije (Electron)                       |

### Sloj 4: Sesijska datoteka

Bez `user-session-v3.bin` datoteke, Go binary potpuno preskače HTTP validaciju i ide direktno na grešku "premium users" — čak i sa blokiranjem `HTTPS_PROXY`. Komanda `seed-session` upisuje minimalnu sesijsku datoteku tako da binary pokuša validaciju, ne uspije (grejs mod) i pokrene server.

```bash
npm run phaser-cracken --seed-session
```

Ovaj korak se pokreće automatski kao dio `phaser-cracken auto`.

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
