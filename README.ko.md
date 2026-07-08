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

[🇰🇷 한국어](./README.ko.md)

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 라이선스 우회 유틸리티(비상업적 용도 전용).

세 가지 보호 계층을 우회합니다:

1. **Electron JS 검사** — `WindowManager.js`를 패치하여 `isEditorActivated()`가 항상 `true`를 반환하도록 합니다.
2. **Go 바이너리 검사(사용자 상태)** — `PhaserEditor` 주위에 투명 프록시를 설치하여 `-tool print-user-status`를 가로채고 가짜 구독 응답을 반환합니다. 다른 모든 명령은 실제 바이너리로 투명하게 전달됩니다.
3. **Go 바이너리 검사(서버 시작)** — Go 바이너리가 인증 실패 타임스탬프를 `server.log`에 저장합니다. 96시간 유예 기간이 만료되면 시작을 거부합니다. 프록시는 매 호출 시 `server.log`와 `auth-failure-v1.log`를 잘라내어 편집기를 실행할 때마다 새로운 유예 기간을 제공합니다.

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

## 설정 방법

문제를 방지하려면 다음 단계를 주의 깊게 따르세요:

1. **Phaser Editor 5 다운로드 및 설치**  
   위 링크에서 플랫폼에 맞는 버전을 선택하세요.

2. **패치 전에 편집기를 한 번 실행하세요**
   - Phaser Editor를 정상적으로 엽니다.
   - 메시지가 표시되면 **EULA**(최종 사용자 사용권 계약)에 **동의**합니다.
   - EULA에 동의한 후 편집기를 완전히 종료합니다.
     > ⚠️ **중요:** EULA에 먼저 동의하지 않고 패치를 적용하면 편집기가 손상됩니다(열리지 않음). EULA 플래그 파일(`~/.phasereditor2d/eula-accepted`)이 수정된 코드가 실행되기 전에 존재해야 하기 때문입니다.

3. **패처 실행**

   ```bash
   npm run phaser-cracken --auto
   ```

이 명령은 필요한 모든 패치를 적용하고 편집기를 시작합니다.

4. **즐기세요** – 첫 번째 성공적인 실행 후 편집기는 더 이상 라이선스나 구독을 묻지 않습니다. 모든 기능을 오프라인에서 사용할 수 있습니다.

## 설치

```bash
cd phaser-cracken
npm install
npm run build
```

또는 전역 설치:

```bash
npm install -g .
```

## 빠른 시작

```bash
# 모든 작업을 한 번에 수행:
npm run phaser-cracken --auto

# 또는 단계별로:
npm run phaser-cracken --patch            # JS 검사 우회
npm run phaser-cracken --install-proxy    # Go 바이너리 검사 우회(프록시 + 유예 기간 재설정)
npm run phaser-cracken --reset-grace      # Go 바이너리 시작 검사의 유예 기간 재설정
npm run phaser-cracken --run              # 편집기 실행
```

## 작동 방식

### 계층 1: Electron Shell

`WindowManager.js`의 `isEditorActivated()`를 대체:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### 계층 2: Go 바이너리 프록시

`PhaserEditor` 바이너리 주위에 프록시 스크립트(Node.js 또는 bash) 생성:

- `-tool print-user-status` → `subscriptionActive: true`가 포함된 가짜 JSON 반환
- 그 외 모든 것 → `PhaserEditor.real`에 투명하게 위임

```bash
#!/bin/bash
# 유예 기간 재설정, print-user-status 가로채기, 나머지는 위임
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

## 명령

| 명령                      | 설명                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `patch`                   | `WindowManager.js` 패치                                           |
| `restore`                 | 원본 `WindowManager.js` 복원                                      |
| `install-proxy`           | `PhaserEditor` 바이너리 주위에 프록시 래퍼 설치                   |
| `install-proxy --force`   | 프록시 v1 → v2 업그레이드 또는 재설치                             |
| `uninstall-proxy`         | 프록시 제거, 원본 바이너리 복원                                   |
| `reset-grace`             | `server.log` / `auth-failure-v1.log`를 지워 Go 바이너리의 96시간 유예 기간 재설정 |
| `status`                  | 패치, 프록시 및 세션 상태 표시                                    |
| `run`                     | Phaser Editor 실행                                                |
| `auto`                    | 전체 설정: 패치 + 프록시 + 유예 기간 재설정 + 실행                |
| `auto --no-run`           | 실행 없이 설정                                                    |
| `backup-session`          | `user-session-v3.bin` 백업                                        |
| `restore-session [file]`  | 백업에서 세션 복원                                                |
| `refresh-session`         | Phaser.io에 로그인하여 새 세션 받기                               |

### 자동 옵션

```bash
phaser-cracken auto --no-run    # 설정 후 실행 건너뛰기
```

## 지원 플랫폼

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## PhaserCracken이 생성하는 파일

| 파일                                      | 용도                                |
| ----------------------------------------- | ----------------------------------- |
| `WindowManager.js.backup`                 | 원본 JS 파일 백업                   |
| `PhaserEditor.real`                       | 원본 Go 바이너리(이름 변경됨)       |
| `PhaserEditor.phaser-cracken.bin-backup`  | 원본 바이너리 복사본                |
| `PhaserEditor`                            | 프록시 스크립트(원본 대체)          |

### 재설정되는 로그 파일

프록시는 매 실행 시 이 파일들을 잘라내어 Go 바이너리의 유예 기간을 활성 상태로 유지합니다:

| 파일                                        | 용도                                            |
| ------------------------------------------- | ----------------------------------------------- |
| `~/.phasereditor2d/server.log`              | 인증 실패 타임스탬프 저장(Go 바이너리)          |
| `~/.phasereditor2d/auth-failure-v1.log`     | 인증 실패 마커(Electron)                       |

## 제거

```bash
npm run phaser-cracken --restore          # WindowManager.js 복원
npm run phaser-cracken --uninstall-proxy  # PhaserEditor 바이너리 복원
```

## 요구 사항

- Node.js >= 14
- Phaser Editor 5 Desktop 설치됨

## 면책 조항

이 도구는 교육 목적 및 비상업적 용도로만 사용됩니다.
상업적으로 Phaser Editor를 사용하는 경우 [phaser.io](https://phaser.io)에서 유효한 라이선스를 구매해야 합니다.
