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

Утилита для обхода лицензии ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 для некоммерческого использования.

Обход четырёх уровней защиты:

1. **Проверка Electron JS** — патчит `WindowManager.js`, заставляя `isEditorActivated()` всегда возвращать `true`.
2. **Проверка Go-бинарника (статус пользователя)** — устанавливает прозрачный прокси вокруг `PhaserEditor`, перехватывающий вызов `-tool print-user-status` и возвращающий фиктивный ответ о подписке.
3. **Проверка Go-бинарника (запуск сервера — грейс-период)** — Go-бинарник хранит таймстемп первой ошибки авторизации в `server.log`. По истечении 96-часового грейс-периода он блокирует запуск. Прокси очищает `server.log` и `auth-failure-v1.log` при каждом запуске, давая новый грейс-период.
4. **Проверка Go-бинарника (запуск сервера — HTTP-валидация)** — Go-бинарник делает прямой HTTP-запрос к `https://phaser.io/api/user/?has=product:editor:desktop`. Если сервер отвечает "нет прав", бинарник блокируется немедленно (без грейс-режима). Прокси устанавливает `HTTPS_PROXY` на невалидный адрес, заставляя HTTP-запрос провалиться и вернуться в грейс-режим.

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

## Инструкция по установке

Внимательно следуйте этим шагам, чтобы избежать проблем:

1. **Скачайте и установите Phaser Editor 5**  
   Выберите подходящую версию для вашей платформы по ссылкам выше.

2. **Запустите редактор один раз перед патчем**
   - Откройте Phaser Editor обычным способом.
   - **Примите EULA** (лицензионное соглашение), когда появится запрос.
   - Полностью закройте редактор после принятия EULA.
     > ⚠️ **Важно:** Попытка наложения патча без предварительного принятия EULA приведёт к поломке редактора (он не сможет открыться). Это происходит потому, что флаг-файл EULA (`~/.phasereditor2d/eula-accepted`) должен существовать до того, как изменённый код начнёт выполняться.

3. **Запустите патчер**

   ```bash
   npm run phaser-cracken --auto
   ```

Эта команда применит все необходимые патчи и запустит редактор.

4. **Наслаждайтесь** – после первого успешного запуска редактор больше не будет спрашивать лицензию или подписку. Все функции станут доступны офлайн.

## Установка

```bash
cd phaser-cracken
npm install
npm run build
```

Или глобально:

```bash
npm install -g .
```

## Быстрый старт

```bash
# Одна команда для всего:
npm run phaser-cracken --auto

# Или пошагово:
npm run phaser-cracken --patch            # Обход проверки JS
npm run phaser-cracken --install-proxy    # Обход проверки Go-бинарника (прокси + сброс грейса)
npm run phaser-cracken --reset-grace      # Сбросить грейс-период для проверки запуска сервера
npm run phaser-cracken --run              # Запуск редактора
```

## Как это работает

### Слой 1: Electron Shell

Заменяет `isEditorActivated()` в `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Слой 2: Прокси для Go-бинарника

Создаёт скрипт-прокси (Node.js или bash) вокруг бинарника `PhaserEditor`:

- `-tool print-user-status` → возвращает фейковый JSON с `subscriptionActive: true`
- Всё остальное → прозрачно передаётся `PhaserEditor.real`

```bash
#!/bin/bash
# Сбрасывает грейс-период, блокирует проверку phaser.io,
# перехватывает print-user-status, всё остальное передаёт дальше
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # Принудительный грейс-режим

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## Команды

| Команда                  | Описание                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `patch`                  | Наложить патч на `WindowManager.js`                                                             |
| `restore`                | Восстановить исходный `WindowManager.js`                                                        |
| `install-proxy`          | Установить прокси-обёртку вокруг бинарника `PhaserEditor`                                       |
| `install-proxy --force`  | Обновить прокси v1 → v2 или переустановить                                                      |
| `uninstall-proxy`        | Удалить прокси, восстановить исходный бинарник                                                  |
| `reset-grace`            | Очистить `server.log` / `auth-failure-v1.log` для сброса 96-часового грейс-периода Go-бинарника |
| `status`                 | Показать статус патча, прокси и сессии                                                          |
| `run`                    | Запустить Phaser Editor                                                                         |
| `auto`                   | Полная настройка: патч + прокси + сброс грейса + запуск                                         |
| `auto --no-run`          | Настройка без запуска                                                                           |
| `backup-session`         | Сделать резервную копию `user-session-v3.bin`                                                   |
| `restore-session [file]` | Восстановить сессию из резервной копии                                                          |
| `refresh-session`        | Выполнить вход в Phaser.io для получения новой сессии                                           |

Также доступна отдельная команда для сброса грейс-периода если редактор перестал запускаться:

```bash
npm run phaser-cracken --reset-grace
```

### Опции авторежима

```bash
phaser-cracken auto --no-run    # Пропустить запуск после настройки
```

## Поддерживаемые платформы

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Файлы, создаваемые PhaserCracken

| Файл                                     | Назначение                          |
| ---------------------------------------- | ----------------------------------- |
| `WindowManager.js.backup`                | Резервная копия исходного JS-файла  |
| `PhaserEditor.real`                      | Исходный Go-бинарник (переименован) |
| `PhaserEditor.phaser-cracken.bin-backup` | Копия исходного бинарника           |
| `PhaserEditor`                           | Скрипт-прокси (заменяет оригинал)   |

### Сбрасываемые файлы логов

Прокси очищает эти файлы при каждом запуске, чтобы поддерживать грейс-период Go-бинарника активным:

| Файл                                    | Назначение                                        |
| --------------------------------------- | ------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Хранит таймстемп ошибки авторизации (Go-бинарник) |
| `~/.phasereditor2d/auth-failure-v1.log` | Маркер ошибки авторизации (Electron)              |

## Удаление

```bash
npm run phaser-cracken --restore          # Восстановить WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Восстановить бинарник PhaserEditor
```

## Требования

- Node.js >= 14
- Установленный Phaser Editor 5 Desktop

## Отказ от ответственности

Этот инструмент предназначен только для образовательных целей и некоммерческого использования.  
Если вы используете Phaser Editor в коммерческих целях, приобретите лицензию на [phaser.io](https://phaser.io).

```

```
