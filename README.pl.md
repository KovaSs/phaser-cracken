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

Narzędzie do ominięcia licencji ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 do użytku niekomercyjnego.

Omijane są trzy warstwy ochrony:

1. **Sprawdzanie Electron JS** — łatkuje `WindowManager.js`, aby `isEditorActivated()` zawsze zwracało `true`.
2. **Sprawdzanie binarne Go (status użytkownika)** — instaluje przezroczyste proxy wokół `PhaserEditor`, które przechwytuje `-tool print-user-status` i zwraca fałszywą odpowiedź subskrypcji. Wszystkie inne polecenia są przekazywane do rzeczywistego pliku binarnego.
3. **Sprawdzanie binarne Go (uruchamianie serwera)** — plik binarny Go przechowuje znacznik czasu nieudanego uwierzytelnienia w `server.log`. Po upływie 96-godzinnego okresu karencji odmawia uruchomienia. Proxy teraz czyści `server.log` i `auth-failure-v1.log` przy każdym wywołaniu, dając świeży okres karencji za każdym razem, gdy edytor jest uruchamiany.

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
| `reset-grace`            | Czyści `server.log` / `auth-failure-v1.log`, aby zresetować 96h okres karencji Go |
| `status`                 | Pokazuje stan łatki, proxy i sesji                                                |
| `run`                    | Uruchamia Phaser Editor                                                           |
| `auto`                   | Pełna konfiguracja: łatka + proxy + reset karencji + uruchomienie                 |
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

### Resetowane pliki dziennika

Proxy czyści te pliki przy każdym uruchomieniu, aby utrzymać aktywny okres karencji pliku binarnego Go:

| Plik                                    | Cel                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `~/.phasereditor2d/server.log`          | Przechowuje znacznik czasu nieudanego uwierzytelnienia (plik binarny Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Znacznik nieudanego uwierzytelnienia (Electron)                          |

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
