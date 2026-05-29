# ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 ℂ𝕣𝕒𝕔𝕜𝕖𝕟

Утилита для обхода лицензии ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 для некоммерческого использования.

Обход двух уровней защиты:

1. **Проверка Electron JS** — патчит `WindowManager.js`, заставляя `isEditorActivated()` всегда возвращать `true`.
2. **Проверка Go-бинарника** — устанавливает прозрачный прокси вокруг `PhaserEditor`, перехватывающий вызов `-tool print-user-status` и возвращающий фиктивный ответ о подписке. Все остальные команды передаются настоящему бинарнику.

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
npm run phaser-cracken --install-proxy    # Обход проверки Go-бинарника
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
# Перехватывает print-user-status, всё остальное передаёт дальше
if [ "$1" = "-tool" ] && [ "$2" = "print-user-status" ]; then
  echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
  exit 0
fi
exec "$0.real" "$@"
```

## Команды

| Команда                  | Описание                                                  |
| ------------------------ | --------------------------------------------------------- |
| `patch`                  | Наложить патч на `WindowManager.js`                       |
| `restore`                | Восстановить исходный `WindowManager.js`                  |
| `install-proxy`          | Установить прокси-обёртку вокруг бинарника `PhaserEditor` |
| `uninstall-proxy`        | Удалить прокси, восстановить исходный бинарник            |
| `status`                 | Показать статус патча, прокси и сессии                    |
| `run`                    | Запустить Phaser Editor                                   |
| `auto`                   | Полная настройка: патч + прокси + запуск                  |
| `backup-session`         | Сделать резервную копию `user-session-v3.bin`             |
| `restore-session [file]` | Восстановить сессию из резервной копии                    |
| `refresh-session`        | Выполнить вход в Phaser.io для получения новой сессии     |

### Опции авторежима

```bash
phaser-cracken auto --no-run    # Пропустить запуск после настройки
```

## Поддерживаемые платформы

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Файлы, создаваемые PhaserCracken

| Файл                      | Назначение                              |
| ------------------------- | --------------------------------------- |
| `WindowManager.js.backup` | Резервная копия исходного JS-файла      |
| `PhaserEditor.real`       | Исходный Go-бинарник (переименован)     |
| `PhaserEditor.backup`     | Копия исходного бинарника (опционально) |
| `PhaserEditor`            | Скрипт-прокси (заменяет оригинал)       |

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
