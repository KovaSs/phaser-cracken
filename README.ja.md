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

[🇯🇵 日本語](./README.ja.md)

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 ライセンス回避ユーティリティ（非商用利用のみ）。

4 つの保護レイヤーをバイパスします：

1. **Electron JS チェック** — `WindowManager.js` にパッチを適用し、`isEditorActivated()` が常に `true` を返すようにします。
2. **Go バイナリチェック（ユーザーステータス）** — `PhaserEditor` の周囲に透過プロキシをインストールし、`-tool print-user-status` をインターセプトして偽のサブスクリプション応答を返します。その他のコマンドはすべて実際のバイナリに透過的に委譲されます。
3. **Go バイナリチェック（サーバー起動 — 猶予期間）** — Go バイナリは認証失敗のタイムスタンプを `server.log` に保存します。96 時間の猶予期間が経過すると、起動を拒否します。プロキシは呼び出しのたびに `server.log` と `auth-failure-v1.log` を切り詰め、エディタを起動するたびに新しい猶予期間を提供します。
4. **Go バイナリチェック（サーバー起動 — HTTP 検証）** — Go バイナリは `https://phaser.io/api/user/?has=product:editor:desktop` に直接 HTTP リクエストを送信します。サーバーが「権限なし」と応答した場合、バイナリは即座にブロックします（猶予モードなし）。プロキシは `HTTPS_PROXY` を無効なアドレスに設定し、HTTP リクエストを強制的に失敗させて猶予モードにフォールバックさせます。

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

## セットアップ手順

問題を避けるために、以下の手順に注意深く従ってください：

1. **Phaser Editor 5 をダウンロードしてインストール**  
   上記のリンクからプラットフォームに適したバージョンを選択してください。

2. **パッチ適用前にエディタを一度起動する**
   - Phaser Editor を通常通り開きます。
   - プロンプトが表示されたら **EULA**（エンドユーザー使用許諾契約）に同意します。
   - EULA に同意したら、エディタを完全に閉じます。
     > ⚠️ **重要：** EULA に先に同意せずにパッチを適用すると、エディタが破損します（開けなくなります）。これは、修正されたコードが実行される前に EULA フラグファイル（`~/.phasereditor2d/eula-accepted`）が存在している必要があるためです。

3. **パッチャーを実行**

   ```bash
   npm run phaser-cracken --auto
   ```

これにより、必要なすべてのパッチが適用され、エディタが起動します。

4. **お楽しみください** – 初回起動が成功した後は、エディタはライセンスやサブスクリプションを要求しなくなります。すべての機能をオフラインで利用できます。

## インストール

```bash
cd phaser-cracken
npm install
npm run build
```

またはグローバルインストール：

```bash
npm install -g .
```

## クイックスタート

```bash
# すべてを一度に行うコマンド：
npm run phaser-cracken --auto

# またはステップバイステップ：
npm run phaser-cracken --patch            # JS チェックをバイパス
npm run phaser-cracken --install-proxy    # Go バイナリチェックをバイパス（プロキシ + 猶予期間リセット）
npm run phaser-cracken --reset-grace      # Go バイナリ起動チェックの猶予期間をリセット
npm run phaser-cracken --run              # エディタを起動
```

## 仕組み

### レイヤー 1: Electron Shell

`WindowManager.js` 内の `isEditorActivated()` を置き換え：

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### レイヤー 2: Go バイナリプロキシ

`PhaserEditor` バイナリの周囲にプロキシスクリプト（Node.js または bash）を作成：

- `-tool print-user-status` → `subscriptionActive: true` を含む偽の JSON を返す
- それ以外 → `PhaserEditor.real` に透過的に委譲

```bash
#!/bin/bash
# 猶予期間をリセットし、phaser.io 検証をブロックし、
# print-user-status をインターセプトし、それ以外を委譲
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # 猶予モードを強制

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## コマンド

| コマンド                    | 説明                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| `patch`                     | `WindowManager.js` にパッチを適用                                  |
| `restore`                   | 元の `WindowManager.js` を復元                                      |
| `install-proxy`             | `PhaserEditor` バイナリの周囲にプロキシラッパーをインストール       |
| `install-proxy --force`     | プロキシ v1 → v2 にアップグレード、または再インストール             |
| `uninstall-proxy`           | プロキシを削除、元のバイナリを復元                                  |
| `reset-grace`               | `server.log` / `auth-failure-v1.log` をクリアして Go バイナリの 96 時間の猶予期間をリセット |
| `status`                    | パッチ、プロキシ、セッションの状態を表示                            |
| `run`                       | Phaser Editor を起動                                                |
| `auto`                      | 完全セットアップ：パッチ + プロキシ + 猶予期間リセット + 起動       |
| `auto --no-run`             | 起動せずにセットアップ                                              |
| `backup-session`            | `user-session-v3.bin` をバックアップ                                |
| `restore-session [file]`    | バックアップからセッションを復元                                    |
| `refresh-session`           | Phaser.io にログインして新しいセッションを取得                      |

### 自動オプション

```bash
phaser-cracken auto --no-run    # セットアップ後に起動をスキップ
```

## サポート対象プラットフォーム

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## PhaserCracken が作成するファイル

| ファイル                                    | 用途                                |
| ------------------------------------------- | ----------------------------------- |
| `WindowManager.js.backup`                   | 元の JS ファイルのバックアップ      |
| `PhaserEditor.real`                         | 元の Go バイナリ（名前変更済み）    |
| `PhaserEditor.phaser-cracken.bin-backup`    | 元のバイナリのコピー                |
| `PhaserEditor`                              | プロキシスクリプト（元のファイルを置き換え） |

### リセットされるログファイル

プロキシは起動のたびにこれらのファイルを切り詰めて、Go バイナリの猶予期間をアクティブに保ちます：

| ファイル                                      | 用途                                            |
| --------------------------------------------- | ----------------------------------------------- |
| `~/.phasereditor2d/server.log`                | 認証失敗のタイムスタンプを保存（Go バイナリ）   |
| `~/.phasereditor2d/auth-failure-v1.log`       | 認証失敗マーカー（Electron）                   |

## アンインストール

```bash
npm run phaser-cracken --restore          # WindowManager.js を復元
npm run phaser-cracken --uninstall-proxy  # PhaserEditor バイナリを復元
```

## 要件

- Node.js >= 14
- Phaser Editor 5 Desktop がインストールされていること

## 免責事項

このツールは教育目的および非商用利用のみを目的としています。
Phaser Editor を商用で使用する場合は、[phaser.io](https://phaser.io) から有効なライセンスを購入してください。
