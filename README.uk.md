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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 — утиліта обходу ліцензії для некомерційного використання.

Обходяться три рівні захисту:

1. **Перевірка Electron JS** — патчить `WindowManager.js`, щоб `isEditorActivated()` завжди повертав `true`.
2. **Перевірка Go-бінарника (статус користувача)** — встановлює прозорий проксі навколо `PhaserEditor`, який перехоплює `-tool print-user-status` і повертає підроблену відповідь про підписку. Всі інші команди прозоро передаються реальному бінарнику.
3. **Перевірка Go-бінарника (запуск сервера)** — Go-бінарник зберігає часову мітку помилки автентифікації у `server.log`. Коли 96-годинний пільговий період закінчується, бінарник відмовляється запускатися. Проксі тепер обнулює `server.log` та `auth-failure-v1.log` при кожному виклику, надаючи новий пільговий період щоразу під час запуску редактора.

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

## Інструкція з налаштування

Виконайте ці кроки уважно, щоб уникнути проблем:

1. **Завантажте та встановіть Phaser Editor 5**  
   Виберіть відповідну версію для вашої платформи з посилань вище.

2. **Запустіть редактор один раз перед патрінґом**
   - Відкрийте Phaser Editor звичайним способом.
   - **Прийміть EULA** (ліцензійну угоду) при появі запиту.
   - Повністю закрийте редактор після прийняття EULA.
     > ⚠️ **Важливо:** Патчінг без попереднього прийняття EULA зламає редактор (він не зможе відкритися). Це тому, що файл прапорця EULA (`~/.phasereditor2d/eula-accepted`) має існувати до запуску зміненого коду.

3. **Запустіть патчер**

   ```bash
   npm run phaser-cracken --auto
   ```

   Це застосує всі необхідні патчі та запустить редактор.

4. **Насолоджуйтеся** — після першого успішного запуску редактор більше не питатиме про ліцензію або підписку. Усі функції стають доступними в офлайн-режимі.

## Встановлення

```bash
cd phaser-cracken
npm install
npm run build
```

Або глобально:

```bash
npm install -g .
```

## Швидкий старт

```bash
# Одна команда, щоб зробити все:
npm run phaser-cracken --auto

# Або покроково:
npm run phaser-cracken --patch            # Обхід JS перевірки
npm run phaser-cracken --install-proxy    # Обхід Go-бінарника (проксі + скидання пільгового періоду)
npm run phaser-cracken --reset-grace      # Скидання пільгового періоду для перевірки запуску Go-бінарника
npm run phaser-cracken --run              # Запуск редактора
```

## Як це працює

### Рівень 1: Electron Shell

Замінює `isEditorActivated()` у `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Рівень 2: Проксі Go-бінарника

Створює скрипт-проксі (Node.js або bash) навколо бінарника `PhaserEditor`:

- `-tool print-user-status` → повертає підроблений JSON із `subscriptionActive: true`
- Все інше → прозоро делегує `PhaserEditor.real`

```bash
#!/bin/bash
# Скидає пільговий період, перехоплює print-user-status, делегує все інше
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

## Команди

| Команда                  | Опис                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `patch`                  | Патчить `WindowManager.js`                                                                            |
| `restore`                | Відновлює оригінальний `WindowManager.js`                                                             |
| `install-proxy`          | Встановлює проксі-обгортку навколо бінарника `PhaserEditor`                                           |
| `install-proxy --force`  | Оновлення проксі v1 → v2 або перевстановлення                                                         |
| `uninstall-proxy`        | Видаляє проксі, відновлює оригінальний бінарник                                                       |
| `reset-grace`            | Очищує `server.log` / `auth-failure-v1.log` для скидання 96-годинного пільгового періоду Go-бінарника |
| `status`                 | Показує стан патча, проксі та сесії                                                                   |
| `run`                    | Запускає Phaser Editor                                                                                |
| `auto`                   | Повне налаштування: патч + проксі + скидання пільгового періоду + запуск                              |
| `auto --no-run`          | Налаштування без запуску                                                                              |
| `backup-session`         | Резервне копіювання `user-session-v3.bin`                                                             |
| `restore-session [file]` | Відновлення сесії з резервної копії                                                                   |
| `refresh-session`        | Запуск входу Phaser.io для отримання нової сесії                                                      |

### Auto параметри

```bash
phaser-cracken auto --no-run    # Пропустити запуск після налаштування
```

## Підтримувані платформи

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Файли, створені PhaserCracken

| Файл                                     | Призначення                               |
| ---------------------------------------- | ----------------------------------------- |
| `WindowManager.js.backup`                | Резервна копія оригінального JS файлу     |
| `PhaserEditor.real`                      | Оригінальний Go-бінарник (перейменований) |
| `PhaserEditor.phaser-cracken.bin-backup` | Копія оригінального бінарника             |
| `PhaserEditor`                           | Скрипт-проксі (замінює оригінал)          |

### Файли журналів, що скидаються

Проксі обнулює ці файли при кожному запуску, щоб підтримувати пільговий період Go-бінарника активним:

| Файл                                    | Призначення                                                |
| --------------------------------------- | ---------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Зберігає часову мітку помилки автентифікації (Go-бінарник) |
| `~/.phasereditor2d/auth-failure-v1.log` | Маркер помилки автентифікації (Electron)                   |

## Видалення

```bash
npm run phaser-cracken --restore          # Відновити WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Відновити бінарник PhaserEditor
```

## Вимоги

- Node.js >= 14
- Встановлений Phaser Editor 5 Desktop

## Відмова від відповідальності

Цей інструмент призначений лише для освітніх цілей та некомерційного використання.
Ви повинні придбати дійсну ліцензію на [phaser.io](https://phaser.io), якщо використовуєте Phaser Editor комерційно.
