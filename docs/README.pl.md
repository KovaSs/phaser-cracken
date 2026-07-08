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

Narzędzie do ominięcia licencji ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 do użytku niekomercyjnego.

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

## Instrukcja konfiguracji

Postępuj uważnie, aby uniknąć problemów:

1. **Pobierz i zainstaluj Phaser Editor 5**
   Wybierz odpowiednią wersję dla swojej platformy z powyższych linków.

2. **Uruchom edytor raz przed łatkowaniem**
   - Otwórz Phaser Editor normalnie.
   - **Zaakceptuj EULA** (Umowę licencyjną użytkownika końcowego) po wyświetleniu monitu.
   - Zamknij edytor całkowicie po zaakceptowaniu EULA.
     > ⚠️ **Ważne:** Łatkowanie bez wcześniejszego zaakceptowania EULA spowoduje uszkodzenie edytora (nie będzie się otwierał). Dzieje się tak, ponieważ plik flagi EULA (`~/.phasereditor2d/eula-accepted`) musi istnieć przed uruchomieniem zmodyfikowanego kodu.

3. **Uruchom patcher**

   ```bash
   npm run phaser-cracken --auto
   ```

   Zastosuje to wszystkie niezbędne łatki i uruchomi edytor.

4. **Ciesz się** – Po pierwszym pomyślnym uruchomieniu edytor nie będzie już pytał o licencję ani subskrypcję. Wszystkie funkcje będą dostępne offline.

## Instalacja

```bash
cd phaser-cracken
npm install
npm run build
```

Lub globalnie:

```bash
npm install -g .
```

## Szybki start

```bash
# Jedno polecenie do wszystkiego:
npm run phaser-cracken --auto

# Lub krok po kroku:
npm run phaser-cracken --patch            # Ominięcie sprawdzania JS
npm run phaser-cracken --install-proxy    # Ominięcie sprawdzania binarnego Go (proxy + reset karencji)
npm run phaser-cracken --copy-session     # Zainstaluj dołączony plik sesji
npm run phaser-cracken --reset-grace      # Reset okresu karencji dla sprawdzania uruchamiania Go
npm run phaser-cracken --run              # Uruchomienie edytora
```

## Jak to działa

### Warstwa 1: Electron Shell

Zastępuje `isEditorActivated()` w `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Warstwa 2: Proxy binarne Go

Tworzy skrypt proxy (Node.js lub bash) wokół pliku binarnego `PhaserEditor`:

- `-tool print-user-status` → zwraca fałszywy JSON z `subscriptionActive: true`
- Wszystko inne → przekazuje przezroczysto do `PhaserEditor.real`

```bash
#!/bin/bash
# Resetuje okres karencji, przechwytuje print-user-status, przekazuje wszystko inne
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

## Polecenia

| Polecenie                | Opis                                                                              |
| ------------------------ | --------------------------------------------------------------------------------- |
| `patch`                  | Łatkuje `WindowManager.js`                                                        |
| `restore`                | Przywraca oryginalny `WindowManager.js`                                           |
| `install-proxy`          | Instaluje proxy wokół pliku binarnego `PhaserEditor`                              |
| `install-proxy --force`  | Aktualizuje proxy v1 → v2 lub reinstaluje                                         |
| `uninstall-proxy`        | Usuwa proxy, przywraca oryginalny plik binarny                                    |
| `copy-session [source]`  | Zainstaluj plik sesji (domyślnie używa dołączonego zasobu lub niestandardowej ścieżki) |
| `reset-grace`            | Czyści `server.log` / `auth-failure-v1.log`, aby zresetować 96h okres karencji Go |
| `status`                 | Pokazuje stan łatki, proxy i sesji                                                |
| `run`                    | Uruchamia Phaser Editor                                                           |
| `auto`                   | Pełna konfiguracja: łatka + proxy + copy-session + reset karencji + uruchomienie                     |
| `auto --no-run`          | Konfiguracja bez uruchamiania                                                     |
| `backup-session`         | Tworzy kopię zapasową `user-session-v3.bin`                                       |
| `restore-session [file]` | Przywraca sesję z kopii zapasowej                                                 |
| `refresh-session`        | Uruchamia logowanie Phaser.io w celu uzyskania nowej sesji                        |

### Opcje auto

```bash
phaser-cracken auto --no-run    # Pomiń uruchamianie po konfiguracji
```

## Obsługiwane platformy

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Pliki tworzone przez PhaserCracken

| Plik                                     | Cel                                        |
| ---------------------------------------- | ------------------------------------------ |
| `WindowManager.js.backup`                | Kopia zapasowa oryginalnego pliku JS       |
| `PhaserEditor.real`                      | Oryginalny plik binarny Go (przemianowany) |
| `PhaserEditor.phaser-cracken.bin-backup` | Kopia oryginalnego pliku binarnego         |
| `PhaserEditor`                           | Skrypt proxy (zastępuje oryginał)          |
| `resources/user-session-v3.bin`          | Dołączony plik sesji                      |

### Resetowane pliki dziennika

Proxy czyści te pliki przy każdym uruchomieniu, aby utrzymać aktywny okres karencji pliku binarnego Go:

| Plik                                    | Cel                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `~/.phasereditor2d/server.log`          | Przechowuje znacznik czasu nieudanego uwierzytelnienia (plik binarny Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Znacznik nieudanego uwierzytelnienia (Electron)                          |

### Warstwa 3: Okres karencji i plik sesji

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## Dezinstalacja

```bash
npm run phaser-cracken --restore          # Przywróć WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Przywróć plik binarny PhaserEditor
```

## Wymagania

- Node.js >= 14
- Zainstalowany Phaser Editor 5 Desktop

## Zastrzeżenie

To narzędzie służy wyłącznie do celów edukacyjnych i użytku niekomercyjnego.
Powinieneś zakupić ważną licencję na stronie [phaser.io](https://phaser.io), jeśli używasz Phaser Editor komercyjnie.
