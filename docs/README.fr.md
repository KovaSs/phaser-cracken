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

ℙ𝕙𝕒𝕤𝕖𝕣 𝔼𝕕𝕚𝕥𝕠𝕣 Utilitaire de contournement de licence 5 pour usage non commercial.

Quatre couches de protection sont contournées :

1. **Vérification Electron JS** — patch `WindowManager.js` pour que `isEditorActivated()` retourne toujours `true`.
2. **Vérification du binaire Go (statut utilisateur)** — installe un proxy transparent autour de `PhaserEditor` qui intercepte `-tool print-user-status` et renvoie une fausse réponse d'abonnement. Toutes les autres commandes sont transmises au vrai binaire.
3. **Vérification du binaire Go (démarrage du serveur — période de grâce)** — le binaire Go stocke l'horodatage d'échec d'authentification dans `server.log`. Lorsque la période de grâce de 96 heures expire, il refuse de démarrer. Le proxy tronque désormais `server.log` et `auth-failure-v1.log` à chaque invocation, offrant une nouvelle période de grâce à chaque lancement de l'éditeur.
4. **Vérification du binaire Go (démarrage du serveur — validation HTTP)** — le binaire Go effectue une requête HTTP directe à `https://phaser.io/api/user/?has=product:editor:desktop`. Si le serveur répond "pas d'autorisation", le binaire bloque immédiatement (pas de mode grâce). Le proxy définit `HTTPS_PROXY` sur une adresse invalide, forçant l'échec de la requête HTTP et le retour au mode grâce.

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

## Instructions d'installation

Suivez ces étapes attentivement pour éviter tout problème :

1. **Télécharger et installer Phaser Editor 5**  
   Choisissez la version appropriée pour votre plateforme depuis les liens ci-dessus.

2. **Lancez l'éditeur une fois avant le patch**
   - Ouvrez Phaser Editor normalement.
   - **Acceptez le CLUF** (Contrat de Licence Utilisateur Final) lorsque vous y êtes invité.
   - Fermez complètement l'éditeur après avoir accepté le CLUF.
     > ⚠️ **Important :** Patcher sans avoir d'abord accepté le CLUF cassera l'éditeur (il ne pourra pas s'ouvrir). Cela est dû au fait que le fichier indicateur CLUF (`~/.phasereditor2d/eula-accepted`) doit exister avant que le code modifié ne s'exécute.

3. **Exécutez le patcher**

   ```bash
   npm run phaser-cracken --auto
   ```

   Cela appliquera tous les correctifs nécessaires et lancera l'éditeur.

4. **Profitez** – Après le premier lancement réussi, l'éditeur ne demandera plus de licence ou d'abonnement. Toutes les fonctionnalités deviennent disponibles hors ligne.

## Installation

```bash
cd phaser-cracken
npm install
npm run build
```

Ou globalement :

```bash
npm install -g .
```

## Démarrage rapide

```bash
# Une seule commande pour tout faire :
npm run phaser-cracken --auto

# Ou étape par étape :
npm run phaser-cracken --patch            # Contourner la vérification JS
npm run phaser-cracken --install-proxy    # Contourner la vérification du binaire Go (proxy + réinitialisation de grâce)
npm run phaser-cracken --seed-session     # Créer un fichier de session pré-construit (requis si manquant)
npm run phaser-cracken --reset-grace      # Réinitialiser la période de grâce pour la vérification de démarrage Go
npm run phaser-cracken --run              # Lancer l'éditeur
```

## Comment ça fonctionne

### Couche 1 : Electron Shell

Remplace `isEditorActivated()` dans `WindowManager.js` :

```diff
- isEditorActivated() {
-     const userInfo = this.getUserInfo();
-     return Boolean(userInfo.user && userInfo.user.subscriptionActive);
- }
+ isEditorActivated() {
+     return true;
+ }
```

### Couche 2 : Proxy du binaire Go

Crée un script proxy (Node.js ou bash) autour du binaire `PhaserEditor` :

- `-tool print-user-status` → renvoie un faux JSON avec `subscriptionActive: true`
- Tout le reste → délègue de manière transparente à `PhaserEditor.real`

```bash
#!/bin/bash
# Réinitialise la période de grâce, bloque la validation phaser.io,
# intercepte print-user-status, délègue tout le reste
PHASER_HOME="$HOME/.phasereditor2d"
[ -f "$PHASER_HOME/server.log" ] && : > "$PHASER_HOME/server.log"
export HTTPS_PROXY="http://127.0.0.1:1"  # Forcer le mode grâce

for arg in "$@"; do
  if [ "$arg" = "print-user-status" ]; then
    echo '{"user":{"subscriptionActive":true,"permissions":{"product:editor:desktop":true}}}'
    exit 0
  fi
done
exec "$0.real" "$@"
```

## Commandes

| Commande                 | Description                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `patch`                  | Patcher `WindowManager.js`                                                            |
| `restore`                | Restaurer le `WindowManager.js` original                                              |
| `install-proxy`          | Installer un wrapper proxy autour du binaire `PhaserEditor`                           |
| `install-proxy --force`  | Mettre à niveau le proxy v1 → v2 ou réinstaller                                       |
| `uninstall-proxy`        | Supprimer le proxy, restaurer le binaire original                                     |
| `seed-session`           | Créer un fichier de session pré-construit (nécessaire lorsque le binaire Go ignore la validation) |
| `reset-grace`            | Vider `server.log` / `auth-failure-v1.log` pour réinitialiser la période de grâce 96h |
| `status`                 | Afficher l'état du patch, du proxy et de la session                                   |
| `run`                    | Lancer Phaser Editor                                                                  |
| `auto`                   | Configuration complète : patch + proxy + seed-session + réinitialisation de grâce + lancement             |
| `auto --no-run`          | Configuration sans lancement                                                          |
| `backup-session`         | Sauvegarder `user-session-v3.bin`                                                     |
| `restore-session [file]` | Restaurer la session depuis une sauvegarde                                            |
| `refresh-session`        | Exécuter la connexion Phaser.io pour obtenir une nouvelle session                     |

### Options auto

```bash
phaser-cracken auto --no-run    # Ignorer le lancement après la configuration
```

## Plateformes prises en charge

- **macOS** : `/Applications/Phaser Editor.app`
- **Windows** : `C:\Program Files\Phaser Editor\resources\app`
- **Linux** : `/opt/phaser-editor/resources/app`

## Fichiers créés par PhaserCracken

| Fichier                                  | Objectif                           |
| ---------------------------------------- | ---------------------------------- |
| `WindowManager.js.backup`                | Sauvegarde du fichier JS original  |
| `PhaserEditor.real`                      | Binaire Go original (renommé)      |
| `PhaserEditor.phaser-cracken.bin-backup` | Copie du binaire original          |
| `PhaserEditor`                           | Script proxy (remplace l'original) |

### Fichiers journaux réinitialisés

Le proxy tronque ces fichiers à chaque lancement pour maintenir la période de grâce du binaire Go active :

| Fichier                                 | Objectif                                        |
| --------------------------------------- | ----------------------------------------------- |
| `~/.phasereditor2d/server.log`          | Stocke l'horodatage d'échec d'auth (binaire Go) |
| `~/.phasereditor2d/auth-failure-v1.log` | Marqueur d'échec d'authentification (Electron)  |

### Couche 4 : Fichier de session

Sans fichier `user-session-v3.bin`, le binaire Go ignore complètement la validation HTTP et va directement à l'erreur "premium users" — même avec le blocage de `HTTPS_PROXY`. La commande `seed-session` écrit un fichier de session minimal afin que le binaire tente la validation, échoue (mode grâce) et démarre le serveur.

```bash
npm run phaser-cracken --seed-session
```

Cette étape s'exécute automatiquement dans le cadre de `phaser-cracken auto`.

## Désinstallation

```bash
npm run phaser-cracken --restore          # Restaurer WindowManager.js
npm run phaser-cracken --uninstall-proxy  # Restaurer le binaire PhaserEditor
```

## Prérequis

- Node.js >= 14
- Phaser Editor 5 Desktop installé

## Avertissement

Cet outil est uniquement destiné à des fins éducatives et à un usage non commercial.
Vous devez acheter une licence valide auprès de [phaser.io](https://phaser.io) si vous utilisez Phaser Editor à des fins commerciales.
