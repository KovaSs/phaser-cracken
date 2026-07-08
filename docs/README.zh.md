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

[🇨🇳 中文](../README.zh.md)

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 许可证绕过工具，仅供非商业用途使用。

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

## 设置说明

请仔细遵循以下步骤以避免问题：

1. **下载并安装 Phaser Editor 5**  
   从上方链接中选择适合您平台的版本。

2. **在打补丁前先启动编辑器一次**
   - 正常打开 Phaser Editor。
   - 在提示时**接受 EULA**（最终用户许可协议）。
   - 接受 EULA 后完全关闭编辑器。
     > ⚠️ **重要：** 未先接受 EULA 就打补丁会导致编辑器损坏（将无法打开）。这是因为 EULA 标志文件（`~/.phasereditor2d/eula-accepted`）必须在修改后的代码运行之前存在。

3. **运行补丁程序**

   ```bash
   npm run phaser-cracken --auto
   ```

这将应用所有必要的补丁并启动编辑器。

4. **享用** – 首次成功启动后，编辑器将不再询问许可证或订阅。所有功能均可离线使用。

## 安装

```bash
cd phaser-cracken
npm install
npm run build
```

或全局安装：

```bash
npm install -g .
```

## 快速开始

```bash
# 一条命令完成所有操作：
npm run phaser-cracken --auto

# 或逐步操作：
npm run phaser-cracken --patch            # 绕过 JS 检查
npm run phaser-cracken --install-proxy    # 绕过 Go 二进制文件检查（代理 + 宽限期重置）
npm run phaser-cracken --copy-session     # 安装捆绑的会话文件
npm run phaser-cracken --reset-grace      # 重置 Go 二进制文件启动检查的宽限期
npm run phaser-cracken --run              # 启动编辑器
```

## 工作原理

### 第 1 层：Electron Shell

替换 `WindowManager.js` 中的 `isEditorActivated()`：

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### 第 2 层：Go 二进制文件代理

在 `PhaserEditor` 二进制文件周围创建一个代理脚本（Node.js 或 bash）：

- `-tool print-user-status` → 返回包含 `subscriptionActive: true` 的伪造 JSON
- 其他所有内容 → 透明地委托给 `PhaserEditor.real`

```bash
#!/bin/bash
# 重置宽限期，拦截 print-user-status，委托其他所有内容
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

## 命令

| 命令                      | 描述                                                               |
| ------------------------- | ------------------------------------------------------------------ |
| `patch`                   | 修补 `WindowManager.js`                                            |
| `restore`                 | 恢复原始 `WindowManager.js`                                        |
| `install-proxy`           | 在 `PhaserEditor` 二进制文件周围安装代理包装                       |
| `install-proxy --force`   | 升级代理 v1 → v2 或重新安装                                        |
| `uninstall-proxy`         | 移除代理，恢复原始二进制文件                                       |
| `copy-session [source]`   | 安装会话文件（默认使用捆绑资源，或自定义路径）                  |
| `reset-grace`             | 清除 `server.log` / `auth-failure-v1.log` 以重置 Go 二进制文件的 96 小时宽限期 |
| `status`                  | 显示补丁、代理和会话状态                                           |
| `run`                     | 启动 Phaser Editor                                                 |
| `auto`                    | 完整设置：补丁 + 代理 + copy-session + 重置宽限期 + 启动                 |
| `auto --no-run`           | 设置但不启动                                                       |
| `backup-session`          | 备份 `user-session-v3.bin`                                         |
| `restore-session [file]`  | 从备份恢复会话                                                     |
| `refresh-session`         | 登录 Phaser.io 获取新会话                                          |

### 自动选项

```bash
phaser-cracken auto --no-run    # 设置后跳过启动
```

## 支持的平台

- **macOS**：`/Applications/Phaser Editor.app`
- **Windows**：`C:\Program Files\Phaser Editor\resources\app`
- **Linux**：`/opt/phaser-editor/resources/app`

## PhaserCracken 创建的文件

| 文件                                      | 用途                               |
| ----------------------------------------- | ---------------------------------- |
| `WindowManager.js.backup`                 | 原始 JS 文件备份                   |
| `PhaserEditor.real`                       | 原始 Go 二进制文件（已重命名）     |
| `PhaserEditor.phaser-cracken.bin-backup`  | 原始二进制文件副本                 |
| `PhaserEditor`                            | 代理脚本（替换原始文件）           |
| `resources/user-session-v3.bin`           | 捆绑的会话文件                     |

### 重置的日志文件

代理在每次启动时截断这些文件，以保持 Go 二进制文件的宽限期有效：

| 文件                                        | 用途                                         |
| ------------------------------------------- | -------------------------------------------- |
| `~/.phasereditor2d/server.log`              | 存储认证失败时间戳（Go 二进制文件）          |
| `~/.phasereditor2d/auth-failure-v1.log`     | 认证失败标记（Electron）                     |

### 第 3 层：宽限期和会话文件

Without a `user-session-v3.bin` file, the Go binary skips HTTP validation entirely and goes straight to the "premium users" error. A bundled session file is provided in `resources/` — `copy-session` installs it to `~/.phasereditor2d/`.

```bash
npm run phaser-cracken --copy-session
```

This step runs automatically as part of `phaser-cracken auto`.

## 卸载

```bash
npm run phaser-cracken --restore          # 恢复 WindowManager.js
npm run phaser-cracken --uninstall-proxy  # 恢复 PhaserEditor 二进制文件
```

## 要求

- Node.js >= 14
- 已安装 Phaser Editor 5 Desktop

## 免责声明

此工具仅用于教育目的和非商业用途。
如果您在商业上使用 Phaser Editor，请从 [phaser.io](https://phaser.io) 购买有效许可证。
