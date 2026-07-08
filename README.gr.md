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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 5 — βοήθημα παράκαμψης άδειας για μη εμπορική χρήση.

Παρακάμπτονται τέσσερα επίπεδα προστασίας:

1. **Έλεγχος Electron JS** — διορθώνει το `WindowManager.js` ώστε το `isEditorActivated()` να επιστρέφει πάντα `true`.
2. **Έλεγχος Go δυαδικού (κατάσταση χρήστη)** — εγκαθιστά ένα διαφανές proxy γύρω από το `PhaserEditor` που παρεμβάλλει το `-tool print-user-status` και επιστρέφει μια πλαστή απάντηση συνδρομής. Όλες οι άλλες εντολές προωθούνται διαφανώς στο πραγματικό δυαδικό.
3. **Έλεγχος Go δυαδικού (εκκίνηση διακομιστή — περίοδος χάριτος)** — το Go δυαδικό αποθηκεύει τη χρονική σήμανση αποτυχίας αυθεντικοποίησης στο `server.log`. Όταν λήξει η περίοδος χάριτος των 96 ωρών, αρνείται να ξεκινήσει. Το proxy πλέον μηδενίζει τα `server.log` και `auth-failure-v1.log` σε κάθε κλήση, δίνοντας μια νέα περίοδο χάριτος κάθε φορά που ξεκινά ο επεξεργαστής.
4. **Έλεγχος Go δυαδικού (εκκίνηση διακομιστή — επικύρωση HTTP)** — το Go δυαδικό κάνει ένα απευθείας HTTP αίτημα στο `https://phaser.io/api/user/?has=product:editor:desktop`. Εάν ο διακομιστής απαντήσει με "δεν υπάρχει άδεια", το δυαδικό μπλοκάρει αμέσως (χωρίς λειτουργία χάριτος). Το proxy ορίζει το `HTTPS_PROXY` σε μη έγκυρη διεύθυνση, αναγκάζοντας το HTTP αίτημα να αποτύχει και να επιστρέψει σε λειτουργία χάριτος.

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

## Οδηγίες εγκατάστασης

Ακολουθήστε προσεκτικά αυτά τα βήματα για να αποφύγετε προβλήματα:

1. **Λήψη και εγκατάσταση του Phaser Editor 5**  
   Επιλέξτε την κατάλληλη έκδοση για την πλατφόρμα σας από τους παραπάνω συνδέσμους.

2. **Εκκινήστε τον επεξεργαστή μία φορά πριν από τη διόρθωση**
   - Ανοίξτε το Phaser Editor κανονικά.
   - **Αποδεχτείτε την EULA** (Άδεια Χρήσης Τελικού Χρήστη) όταν σας ζητηθεί.
   - Κλείστε εντελώς τον επεξεργαστή αφού γίνει αποδεκτή η EULA.
     > ⚠️ **Σημαντικό:** Η διόρθωση χωρίς προηγούμενη αποδοχή της EULA θα σπάσει τον επεξεργαστή (θα αποτύχει να ανοίξει). Αυτό συμβαίνει γιατί το αρχείο σήμανσης EULA (`~/.phasereditor2d/eula-accepted`) πρέπει να υπάρχει πριν εκτελεστεί ο τροποποιημένος κώδικας.

3. **Εκτελέστε το εργαλείο διόρθωσης**

   ```bash
   npm run phaser-cracken --auto
   ```

   Αυτό θα εφαρμόσει όλες τις απαραίτητες διορθώσεις και θα εκκινήσει τον επεξεργαστή.

4. **Απολαύστε** – Μετά την πρώτη επιτυχημένη εκκίνηση, ο επεξεργαστής δεν θα ζητά πλέον άδεια ή συνδρομή. Όλες οι λειτουργίες γίνονται διαθέσιμες εκτός σύνδεσης.

## Εγκατάσταση

```bash
cd phaser-cracken
npm install
npm run build
```

Ή καθολικά:

```bash
npm install -g .
```

## Γρήγορη εκκίνηση

```bash
# Μία εντολή για να γίνουν τα πάντα:
npm run phaser-cracken --auto

# Ή βήμα προς βήμα:
npm run phaser-cracken --patch            # Παράκαμψη ελέγχου JS
npm run phaser-cracken --install-proxy    # Παράκαμψη ελέγχου Go δυαδικού (proxy + επαναφορά χάριτος)
npm run phaser-cracken --reset-grace      # Επαναφορά περιόδου χάριτος για έλεγχο εκκίνησης Go δυαδικού
npm run phaser-cracken --run              # Εκκίνηση επεξεργαστή
```

## Πώς λειτουργεί

### Επίπεδο 1: Electron Shell

Αντικαθιστά το `isEditorActivated()` στο `WindowManager.js`:

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Επίπεδο 2: Proxy Go δυαδικού

Δημιουργεί ένα σενάριο proxy (Node.js ή bash) γύρω από το δυαδικό `PhaserEditor`:

- `-tool print-user-status` → επιστρέφει πλαστό JSON με `subscriptionActive: true`
- Οτιδήποτε άλλο → διαφανώς αναθέτει στο `PhaserEditor.real`

```bash
#!/bin/bash
# Επαναφέρει την περίοδο χάριτος, μπλοκάρει την επικύρωση phaser.io,
# παρεμβάλλει το print-user-status, αναθέτει οτιδήποτε άλλο
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # Αναγκάζει λειτουργία χάριτος

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## Εντολές

| Εντολή                   | Περιγραφή                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `patch`                  | Διόρθωση του `WindowManager.js`                                                                           |
| `restore`                | Επαναφορά αρχικού `WindowManager.js`                                                                      |
| `install-proxy`          | Εγκατάσταση proxy wrapper γύρω από το δυαδικό `PhaserEditor`                                              |
| `install-proxy --force`  | Αναβάθμιση proxy v1 → v2 ή επανεγκατάσταση                                                                |
| `uninstall-proxy`        | Αφαίρεση proxy, επαναφορά αρχικού δυαδικού                                                                |
| `reset-grace`            | Εκκαθάριση `server.log` / `auth-failure-v1.log` για επαναφορά της 96ωρης περιόδου χάριτος του Go δυαδικού |
| `status`                 | Εμφάνιση κατάστασης διόρθωσης, proxy και συνόδου                                                          |
| `run`                    | Εκκίνηση του Phaser Editor                                                                                |
| `auto`                   | Πλήρης ρύθμιση: διόρθωση + proxy + επαναφορά χάριτος + εκκίνηση                                           |
| `auto --no-run`          | Ρύθμιση χωρίς εκκίνηση                                                                                    |
| `backup-session`         | Δημιουργία αντιγράφου ασφαλείας του `user-session-v3.bin`                                                 |
| `restore-session [file]` | Επαναφορά συνόδου από αντίγραφο ασφαλείας                                                                 |
| `refresh-session`        | Εκτέλεση σύνδεσης Phaser.io για λήψη νέας συνόδου                                                         |

### Επιλογές auto

```bash
phaser-cracken auto --no-run    # Παράλειψη εκκίνησης μετά τη ρύθμιση
```

## Υποστηριζόμενες πλατφόρμες

- **macOS**: `/Applications/Phaser Editor.app`
- **Windows**: `C:\Program Files\Phaser Editor\resources\app`
- **Linux**: `/opt/phaser-editor/resources/app`

## Αρχεία που δημιουργούνται από το PhaserCracken

| Αρχείο                                   | Σκοπός                                 |
| ---------------------------------------- | -------------------------------------- |
| `WindowManager.js.backup`                | Αντίγραφο ασφαλείας αρχικού JS αρχείου |
| `PhaserEditor.real`                      | Αρχικό Go δυαδικό (μετονομασμένο)      |
| `PhaserEditor.phaser-cracken.bin-backup` | Αντίγραφο του αρχικού δυαδικού         |
| `PhaserEditor`                           | Σενάριο proxy (αντικαθιστά το αρχικό)  |

### Επαναφορά αρχείων καταγραφής

Το proxy μηδενίζει αυτά τα αρχεία σε κάθε εκκίνηση για να διατηρεί ενεργή την περίοδο χάριτος του Go δυαδικού:

| Αρχείο                                  | Σκοπός                                                             |
| --------------------------------------- | ------------------------------------------------------------------ |
| `~/.phasereditor2d/server.log`          | Αποθηκεύει χρονική σήμανση αποτυχίας αυθεντικοποίησης (Go δυαδικό) |
| `~/.phasereditor2d/auth-failure-v1.log` | Δείκτης αποτυχίας αυθεντικοποίησης (Electron)                      |

## Απεγκατάσταση

```bash
npm run phaser-cracken --restore          # Επαναφορά WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Επαναφορά δυαδικού PhaserEditor
```

## Απαιτήσεις

- Node.js >= 14
- Εγκατεστημένο Phaser Editor 5 Desktop

## Αποποίηση ευθύνης

Αυτό το εργαλείο προορίζεται μόνο για εκπαιδευτικούς σκοπούς και μη εμπορική χρήση.
Θα πρέπει να αγοράσετε μια έγκυρη άδεια από το [phaser.io](https://phaser.io) εάν χρησιμοποιείτε το Phaser Editor εμπορικά.
