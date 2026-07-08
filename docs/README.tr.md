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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 lisans atlatma aracı — yalnızca ticari olmayan kullanım için.

Dört koruma katmanı atlatılır:

1. **Electron JS denetimi** — `WindowManager.js` dosyasını yamalayarak `isEditorActivated()` fonksiyonunun her zaman `true` döndürmesini sağlar.
2. **Go ikili denetimi (kullanıcı durumu)** — `PhaserEditor` etrafında `-tool print-user-status` komutunu yakalayan ve sahte bir abonelik yanıtı döndüren şeffaf bir proxy kurar. Diğer tüm komutlar gerçek ikili dosyaya iletilir.
3. **Go ikili denetimi (sunucu başlatma — ödeme süresi)** — Go ikili dosyası, başarısız kimlik doğrulama zaman damgasını `server.log` içinde saklar. 96 saatlik ödeme süresi dolduğunda başlatılmayı reddeder. Proxy artık her çağrıda `server.log` ve `auth-failure-v1.log` dosyalarını temizleyerek düzenleyici her başlatıldığında yeni bir ödeme süresi sağlar.
4. **Go ikili denetimi (sunucu başlatma — HTTP doğrulaması)** — Go ikili dosyası doğrudan `https://phaser.io/api/user/?has=product:editor:desktop` adresine bir HTTP isteği gönderir. Sunucu "izin yok" yanıtı verirse, ikili dosya hemen engeller (ödeme modu yok). Proxy, `HTTPS_PROXY`'yi geçersiz bir adrese ayarlayarak HTTP isteğinin başarısız olmasını ve ödeme moduna geri dönmesini sağlar.

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

## Kurulum Talimatları

Sorun yaşamamak için bu adımları dikkatlice izleyin:

1. **Phaser Editor 5'i indirin ve kurun**
   Platformunuza uygun sürümü yukarıdaki bağlantılardan seçin.

2. **Yamalamadan önce düzenleyiciyi bir kez başlatın**
   - Phaser Editor'ı normal şekilde açın.
   - İstendiğinde **EULA'yı** (Son Kullanıcı Lisans Sözleşmesi) kabul edin.
   - EULA kabul edildikten sonra düzenleyiciyi tamamen kapatın.
     > ⚠️ **Önemli:** EULA'yı önceden kabul etmeden yamalama yapmak düzenleyiciyi bozar (açılmaz). Bunun nedeni, EULA bayrak dosyasının (`~/.phasereditor2d/eula-accepted`) değiştirilmiş kod çalışmadan önce var olması gerektiğidir.

3. **Yamalayıcıyı çalıştırın**

   ```bash
   npm run phaser-cracken --auto
   ```

   Bu, gerekli tüm yamaları uygulayacak ve düzenleyiciyi başlatacaktır.

4. **Keyfini çıkarın** – İlk başarılı başlatmadan sonra düzenleyici artık lisans veya abonelik sormayacaktır. Tüm özellikler çevrimdışı olarak kullanılabilir hale gelir.

## Kurulum

```bash
cd phaser-cracken
npm install
npm run build
```

Veya global olarak:

```bash
npm install -g .
```

## Hızlı Başlangıç

```bash
# Her şey için tek komut:
npm run phaser-cracken --auto

# Veya adım adım:
npm run phaser-cracken --patch            # JS denetimini atla
npm run phaser-cracken --install-proxy    # Go ikili denetimini atla (proxy + ödeme sıfırlama)
npm run phaser-cracken --seed-session     # Önceden oluşturulmuş oturum dosyası oluştur (eksikse gerekli)
npm run phaser-cracken --reset-grace      # Go ikili başlatma denetimi için ödeme süresini sıfırla
npm run phaser-cracken --run              # Düzenleyiciyi başlat
```

## Nasıl Çalışır

### Katman 1: Electron Kabuğu

`WindowManager.js` içindeki `isEditorActivated()` fonksiyonunu değiştirir:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Katman 2: Go İkili Proxy

`PhaserEditor` ikili dosyası etrafında bir proxy betiği (Node.js veya bash) oluşturur:

- `-tool print-user-status` → `subscriptionActive: true` ile sahte JSON döndürür
- Diğer her şey → şeffaf bir şekilde `PhaserEditor.real` dosyasına devreder

```bash
#!/bin/bash
# Ödeme süresini sıfırlar, phaser.io doğrulamasını engeller,
# print-user-status'u yakalar, diğer her şeyi devreder
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # Ödeme modunu zorla

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## Komutlar

| Komut                    | Açıklama                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `patch`                  | `WindowManager.js` dosyasını yamala                                                                       |
| `restore`                | Orijinal `WindowManager.js` dosyasını geri yükle                                                          |
| `install-proxy`          | `PhaserEditor` ikili dosyası etrafına proxy kur                                                           |
| `install-proxy --force`  | Proxy v1 → v2 yükselt veya yeniden kur                                                                    |
| `uninstall-proxy`        | Proxy'yi kaldır, orijinal ikili dosyayı geri yükle                                                        |
| `seed-session`           | Önceden oluşturulmuş oturum dosyası oluştur (Go ikilisi doğrulamayı atladığında gerekli)                    |
| `reset-grace`            | Go ikilisinin 96s ödeme süresini sıfırlamak için `server.log` / `auth-failure-v1.log` dosyalarını temizle |
| `status`                 | Yama, proxy ve oturum durumunu göster                                                                     |
| `run`                    | Phaser Editor'ı başlat                                                                                    |
| `auto`                   | Tam kurulum: yama + proxy + seed-session + ödeme sıfırlama + başlatma                                                    |
| `auto --no-run`          | Başlatmadan kurulum                                                                                       |
| `backup-session`         | `user-session-v3.bin` dosyasını yedekle                                                                   |
| `restore-session [file]` | Oturumu yedekten geri yükle                                                                               |
| `refresh-session`        | Yeni bir oturum almak için Phaser.io girişini çalıştır                                                    |

### Auto seçenekleri

```bash
phaser-cracken auto --no-run    # Kurulumdan sonra başlatmayı atla
```

## Desteklenen Platformlar

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## PhaserCracken Tarafından Oluşturulan Dosyalar

| Dosya                                    | Amaç                                              |
| ---------------------------------------- | ------------------------------------------------- |
| `WindowManager.js.backup`                | Orijinal JS dosyası yedeği                        |
| `PhaserEditor.real`                      | Orijinal Go ikili dosyası (yeniden adlandırılmış) |
| `PhaserEditor.phaser-cracken.bin-backup` | Orijinal ikili dosyanın kopyası                   |
| `PhaserEditor`                           | Proxy betiği (orijinalin yerine geçer)            |

### Sıfırlanan Günlük Dosyaları

Proxy, Go ikilisinin ödeme süresini aktif tutmak için bu dosyaları her başlatmada temizler:

| Dosya                                   | Amaç                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| `~/.phasereditor2d/server.log`          | Başarısız kimlik doğrulama zaman damgasını saklar (Go ikili) |
| `~/.phasereditor2d/auth-failure-v1.log` | Başarısız kimlik doğrulama işareti (Electron)                |

### Katman 4: Oturum Dosyası

`user-session-v3.bin` dosyası olmadan, Go ikilisi HTTP doğrulamasını tamamen atlar ve `HTTPS_PROXY` engellemesine rağmen doğrudan "premium users" hatasına gider. `seed-session` komutu, ikilinin doğrulamayı denemesi, başarısız olması (ödeme modu) ve sunucuyu başlatması için minimum bir oturum dosyası yazar.

```bash
npm run phaser-cracken --seed-session
```

Bu adım, `phaser-cracken auto`'nun bir parçası olarak otomatik olarak çalışır.

## Kaldırma

```bash
npm run phaser-cracken --restore          # WindowManager.js dosyasını geri yükle
npm run phaser-cracken --uninstall-proxy  # PhaserEditor ikili dosyasını geri yükle
```

## Gereksinimler

- Node.js >= 14
- Phaser Editor 5 Desktop kurulu olmalı

## Sorumluluk Reddi

Bu araç yalnızca eğitim amaçlı ve ticari olmayan kullanım içindir.
Phaser Editor'ı ticari olarak kullanıyorsanız [phaser.io](https://phaser.io) adresinden geçerli bir lisans satın almalısınız.
