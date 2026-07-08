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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 Utilidad de omisión de licencia 5 para uso no comercial.

Se omiten cuatro capas de protección:

1. **Verificación Electron JS** — parchea `WindowManager.js` para que `isEditorActivated()` siempre devuelva `true`.
2. **Verificación binaria Go (estado del usuario)** — instala un proxy transparente alrededor de `PhaserEditor` que intercepta `-tool print-user-status` y devuelve una respuesta de suscripción falsa. Todos los demás comandos se delegan al binario real.
3. **Verificación binaria Go (inicio del servidor — período de gracia)** — el binario Go almacena la marca de tiempo de error de autenticación en `server.log`. Cuando el período de gracia de 96 horas expira, se niega a iniciar. El proxy ahora trunca `server.log` y `auth-failure-v1.log` en cada invocación, otorgando un nuevo período de gracia cada vez que se lanza el editor.
4. **Verificación binaria Go (inicio del servidor — validación HTTP)** — el binario Go realiza una solicitud HTTP directa a `https://phaser.io/api/user/?has=product:editor:desktop`. Si el servidor responde con "sin permiso", el binario bloquea inmediatamente (sin modo de gracia). El proxy establece `HTTPS_PROXY` en una dirección no válida, forzando que la solicitud HTTP falle y recurra al modo de gracia.

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
# Reinicia el período de gracia, bloquea la validación de phaser.io,
# intercepta print-user-status, delega todo lo demás
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # Forzar modo de gracia

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
| `reset-grace`            | Limpiar `server.log` / `auth-failure-v1.log` para reiniciar el período de gracia de 96h |
| `status`                 | Mostrar estado del parche, proxy y sesión                                               |
| `run`                    | Iniciar Phaser Editor                                                                   |
| `auto`                   | Configuración completa: parche + proxy + reinicio de gracia + inicio                    |
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

### Archivos de registro restablecidos

El proxy trunca estos archivos en cada inicio para mantener activo el período de gracia del binario Go:

| Archivo                                 | Propósito                                                       |
| --------------------------------------- | --------------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Almacena marca de tiempo de error de autenticación (binario Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Marcador de error de autenticación (Electron)                   |

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
