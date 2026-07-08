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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 Utilidad de omisión de licencia 5 para uso no comercial.

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

## Instrucciones de configuración

Siga estos pasos cuidadosamente para evitar problemas:

1. **Descargar e instalar Phaser Editor 5**  
   Elija la versión adecuada para su plataforma desde los enlaces anteriores.

2. **Inicie el editor una vez antes de parchear**
   - Abra Phaser Editor normalmente.
   - **Acepte el EULA** (Contrato de Licencia de Usuario Final) cuando se le solicite.
   - Cierre el editor completamente después de aceptar el EULA.
     > ⚠️ **Importante:** Parchear sin haber aceptado primero el EULA romperá el editor (no podrá abrirse). Esto se debe a que el archivo de marca EULA (`~/.phasereditor2d/eula-accepted`) debe existir antes de que se ejecute el código modificado.

3. **Ejecutar el parcheador**

   ```bash
   npm run phaser-cracken --auto
   ```

   Esto aplicará todos los parches necesarios e iniciará el editor.

4. **Disfrute** – Después del primer inicio exitoso, el editor ya no solicitará una licencia o suscripción. Todas las funciones estarán disponibles sin conexión.

## Instalación

```bash
cd phaser-cracken
npm install
npm run build
```

O globalmente:

```bash
npm install -g .
```

## Inicio rápido

```bash
# Un solo comando para hacer todo:
npm run phaser-cracken --auto

# O paso a paso:
npm run phaser-cracken --patch            # Omitir verificación JS
npm run phaser-cracken --install-proxy    # Omitir verificación binaria Go (proxy + reinicio de gracia)
npm run phaser-cracken --copy-session     # Instalar archivo de sesión incluido
npm run phaser-cracken --reset-grace      # Reiniciar período de gracia para verificación de inicio Go
npm run phaser-cracken --run              # Iniciar el editor
```

## Cómo funciona

### Capa 1: Electron Shell

Reemplaza `isEditorActivated()` en `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Capa 2: Proxy Binario Go

Crea un script proxy (Node.js o bash) alrededor del binario `PhaserEditor`:

- `-tool print-user-status` → devuelve JSON falso con `subscriptionActive: true`
- Todo lo demás → delega transparentemente a `PhaserEditor.real`

```bash
#!/bin/bash
# Reinicia el período de gracia, intercepta print-user-status, delega todo lo demás
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

## Comandos

| Comando                  | Descripción                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `patch`                  | Parchear `WindowManager.js`                                                             |
| `restore`                | Restaurar `WindowManager.js` original                                                   |
| `install-proxy`          | Instalar wrapper proxy alrededor del binario `PhaserEditor`                             |
| `install-proxy --force`  | Actualizar proxy v1 → v2 o reinstalar                                                   |
| `uninstall-proxy`        | Eliminar proxy, restaurar el binario original                                           |
| `copy-session [source]`  | Instalar archivo de sesión (usa recurso incluido por defecto, o ruta personalizada)     |
| `reset-grace`            | Limpiar `server.log` / `auth-failure-v1.log` para reiniciar el período de gracia de 96h |
| `status`                 | Mostrar estado del parche, proxy y sesión                                               |
| `run`                    | Iniciar Phaser Editor                                                                   |
| `auto`                   | Configuración completa: parche + proxy + copy-session + reinicio de gracia + inicio                        |
| `auto --no-run`          | Configuración sin iniciar                                                               |
| `backup-session`         | Respaldar `user-session-v3.bin`                                                         |
| `restore-session [file]` | Restaurar sesión desde respaldo                                                         |
| `refresh-session`        | Ejecutar inicio de sesión en Phaser.io para obtener una nueva sesión                    |

### Opciones de auto

```bash
phaser-cracken auto --no-run    # Omitir inicio después de la configuración
```

## Plataformas compatibles

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Archivos creados por PhaserCracken

| Archivo                                  | Propósito                            |
| ---------------------------------------- | ------------------------------------ |
| `WindowManager.js.backup`                | Respaldo del archivo JS original     |
| `PhaserEditor.real`                      | Binario Go original (renombrado)     |
| `PhaserEditor.phaser-cracken.bin-backup` | Copia del binario original           |
| `PhaserEditor`                           | Script proxy (reemplaza al original) |
| `resources/user-session-v3.bin`          | Archivo de sesión incluido           |

### Archivos de registro restablecidos

El proxy trunca estos archivos en cada inicio para mantener activo el período de gracia del binario Go:

| Archivo                                 | Propósito                                                       |
| --------------------------------------- | --------------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Almacena marca de tiempo de error de autenticación (binario Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Marcador de error de autenticación (Electron)                   |

### Capa 3: Período de gracia y archivo de sesión

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## Desinstalación

```bash
npm run phaser-cracken --restore          # Restaurar WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Restaurar binario PhaserEditor
```

## Requisitos

- Node.js >= 14
- Phaser Editor 5 Desktop instalado

## Aviso legal

Esta herramienta es solo para fines educativos y uso no comercial.
Debe adquirir una licencia válida en [phaser.io](https://phaser.io) si utiliza Phaser Editor comercialmente.
