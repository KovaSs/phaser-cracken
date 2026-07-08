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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 — utilitário de bypass de licença para uso não comercial.

Três camadas de proteção são contornadas:

1. **Verificação Electron JS** — modifica o `WindowManager.js` para que `isEditorActivated()` sempre retorne `true`.
2. **Verificação do binário Go (status do usuário)** — instala um proxy transparente em torno do `PhaserEditor` que intercepta `-tool print-user-status` e retorna uma resposta falsa de assinatura. Todos os outros comandos são delegados transparentemente ao binário real.
3. **Verificação do binário Go (inicialização do servidor)** — o binário Go armazena o timestamp de falha de autenticação no `server.log`. Quando o período de carência de 96 horas expira, ele se recusa a iniciar. O proxy agora limpa o `server.log` e o `auth-failure-v1.log` a cada execução, garantindo um novo período de carência toda vez que o editor é iniciado.

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

## Instruções de configuração

Siga estas etapas cuidadosamente para evitar problemas:

1. **Baixe e instale o Phaser Editor 5**  
   Escolha a versão apropriada para sua plataforma nos links acima.

2. **Inicie o editor uma vez antes da modificação**
   - Abra o Phaser Editor normalmente.
   - **Aceite o EULA** (Contrato de Licença de Usuário Final) quando solicitado.
   - Feche o editor completamente após aceitar o EULA.
     > ⚠️ **Importante:** Modificar sem ter aceitado o EULA primeiro quebrará o editor (ele não abrirá). Isso ocorre porque o arquivo de sinalização do EULA (`~/.phasereditor2d/eula-accepted`) deve existir antes que o código modificado seja executado.

3. **Execute o patcher**

   ```bash
   npm run phaser-cracken --auto
   ```

   Isso aplicará todos os patches necessários e iniciará o editor.

4. **Aproveite** – Após a primeira inicialização bem-sucedida, o editor não solicitará mais licença ou assinatura. Todos os recursos ficam disponíveis offline.

## Instalação

```bash
cd phaser-cracken
npm install
npm run build
```

Ou globalmente:

```bash
npm install -g .
```

## Início rápido

```bash
# Um comando para fazer tudo:
npm run phaser-cracken --auto

# Ou passo a passo:
npm run phaser-cracken --patch            # Bypass da verificação JS
npm run phaser-cracken --install-proxy    # Bypass da verificação do binário Go (proxy + reset de carência)
npm run phaser-cracken --reset-grace      # Redefinir período de carência para verificação de inicialização do binário Go
npm run phaser-cracken --run              # Iniciar o editor
```

## Como funciona

### Camada 1: Electron Shell

Substitui `isEditorActivated()` no `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Camada 2: Proxy do binário Go

Cria um script proxy (Node.js ou bash) em torno do binário `PhaserEditor`:

- `-tool print-user-status` → retorna JSON falso com `subscriptionActive: true`
- Todo o resto → delega transparentemente para `PhaserEditor.real`

```bash
#!/bin/bash
# Redefine o período de carência, intercepta print-user-status, delega todo o resto
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

| Comando                  | Descrição                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `patch`                  | Modificar `WindowManager.js`                                                                          |
| `restore`                | Restaurar `WindowManager.js` original                                                                 |
| `install-proxy`          | Instalar wrapper proxy em torno do binário `PhaserEditor`                                             |
| `install-proxy --force`  | Atualizar proxy v1 → v2 ou reinstalar                                                                 |
| `uninstall-proxy`        | Remover proxy, restaurar binário original                                                             |
| `reset-grace`            | Limpar `server.log` / `auth-failure-v1.log` para redefinir o período de carência de 96h do binário Go |
| `status`                 | Mostrar status do patch, proxy e sessão                                                               |
| `run`                    | Iniciar o Phaser Editor                                                                               |
| `auto`                   | Configuração completa: patch + proxy + reset de carência + inicialização                              |
| `auto --no-run`          | Configurar sem iniciar                                                                                |
| `backup-session`         | Fazer backup do `user-session-v3.bin`                                                                 |
| `restore-session [file]` | Restaurar sessão a partir do backup                                                                   |
| `refresh-session`        | Executar login no Phaser.io para obter uma nova sessão                                                |

### Opções do auto

```bash
phaser-cracken auto --no-run    # Pular a inicialização após a configuração
```

## Plataformas suportadas

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Arquivos criados pelo PhaserCracken

| Arquivo                                  | Propósito                           |
| ---------------------------------------- | ----------------------------------- |
| `WindowManager.js.backup`                | Backup do arquivo JS original       |
| `PhaserEditor.real`                      | Binário Go original (renomeado)     |
| `PhaserEditor.phaser-cracken.bin-backup` | Cópia do binário original           |
| `PhaserEditor`                           | Script proxy (substitui o original) |

### Arquivos de log redefinidos

O proxy limpa estes arquivos a cada inicialização para manter o período de carência do binário Go ativo:

| Arquivo                                 | Propósito                                                |
| --------------------------------------- | -------------------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Armazena timestamp de falha de autenticação (binário Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Marcador de falha de autenticação (Electron)             |

## Desinstalação

```bash
npm run phaser-cracken --restore          # Restaurar WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Restaurar binário PhaserEditor
```

## Requisitos

- Node.js >= 14
- Phaser Editor 5 Desktop instalado

## Aviso legal

Esta ferramenta é apenas para fins educacionais e uso não comercial.
Você deve adquirir uma licença válida em [phaser.io](https://phaser.io) se usar o Phaser Editor comercialmente.
