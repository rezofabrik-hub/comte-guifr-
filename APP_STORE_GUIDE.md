# Temple Virtuel — Guide de publication sur les stores

## Vue d'ensemble

L'application utilise **Capacitor.js** pour transformer le site web en app native.
Le code source reste identique — Capacitor crée une coquille native autour du site.

---

## 1. Prérequis à installer sur ton ordinateur

### Sur Windows ou Mac (pour Android)
- **Node.js** : https://nodejs.org (version 18 ou plus)
- **Android Studio** : https://developer.android.com/studio
  - À l'installation, cocher "Android SDK", "Android Virtual Device"
  - Redémarrer l'ordinateur après l'installation

### Sur Mac uniquement (pour iOS)
- **Xcode** : App Store Mac → rechercher "Xcode" (gratuit, ~15 Go)
- **CocoaPods** : ouvrir le Terminal et taper `sudo gem install cocoapods`

---

## 2. Générer les projets natifs

Ouvrir un Terminal dans le dossier du projet et lancer :

```bash
chmod +x build-app.sh
./build-app.sh
```

Cela crée les dossiers `android/` et `ios/` avec tout le code natif.

---

## 3. Configurer le nom et les icônes

### Nom de l'app (déjà configuré dans capacitor.config.json)
- `appName` : "Temple Virtuel"
- `appId` : "fr.velum.temple"

### Icônes
Les icônes doivent être adaptées pour chaque store.
Utiliser **https://www.appicon.co** — uploader `icon-512.png` et télécharger le pack.

**Android** : copier les dossiers `mipmap-*` dans `android/app/src/main/res/`

**iOS** : glisser-déposer les icônes dans Xcode → Assets.xcassets → AppIcon

---

## 4. Publication sur Google Play

### 4a. Créer un compte Google Play Console
- Aller sur **https://play.google.com/console**
- Payer les **25 $ une seule fois**
- Accepter les conditions d'utilisation

### 4b. Générer le fichier APK/AAB signé
1. Ouvrir Android Studio : `npx cap open android`
2. Menu **Build → Generate Signed Bundle / APK**
3. Choisir **Android App Bundle (.aab)** (recommandé)
4. Créer un **Keystore** (garde ce fichier précieusement — sans lui tu ne peux plus mettre à jour l'app)
   - Key store path : choisir un endroit sûr
   - Password : mot de passe fort (le noter quelque part de sûr)
   - Alias : `velum-key`
5. Choisir **Release** et cliquer **Finish**
6. Le fichier `.aab` est généré dans `android/app/release/`

### 4c. Créer l'app sur Play Console
1. Play Console → **Créer une application**
2. Remplir les informations :
   - **Nom** : Temple Virtuel — Loge Maçonnique
   - **Langue** : Français
   - **Type** : Application
   - **Catégorie** : Productivité
3. Télécharger le fichier `.aab`
4. Remplir la **fiche Play Store** :
   - Description courte (80 car.) : "Application de gestion pour loges maçonniques"
   - Description longue : décrire les fonctionnalités (agenda, membres, trésorerie...)
   - Captures d'écran : prendre des screenshots sur ton téléphone
5. Soumettre pour **révision Google** (2-7 jours)

---

## 5. Publication sur l'App Store (iOS)

> Obligatoire : un **Mac** avec Xcode

### 5a. Créer un compte Apple Developer
- Aller sur **https://developer.apple.com/programs**
- Payer les **99 $/an** (renouvellement annuel)
- Vérification d'identité par Apple (quelques jours)

### 5b. Configurer Xcode
1. Ouvrir Xcode : `npx cap open ios`
2. Sélectionner le projet **App** dans le navigateur
3. Dans **Signing & Capabilities** :
   - Cocher **Automatically manage signing**
   - Choisir ton compte Apple Developer dans **Team**
4. Bundle Identifier : `fr.velum.temple` (doit correspondre à capacitor.config.json)

### 5c. Archiver et uploader
1. Menu **Product → Archive**
2. Dans la fenêtre **Organizer** qui s'ouvre :
   - Cliquer **Distribute App**
   - Choisir **App Store Connect**
   - Suivre les étapes et uploader

### 5d. Créer la fiche sur App Store Connect
- Aller sur **https://appstoreconnect.apple.com**
- **Mes apps → + → Nouvelle app**
- Remplir les informations (nom, description, screenshots)
- Soumettre pour **révision Apple** (1-3 jours)

---

## 6. Mettre à jour l'app après des changements

Quand tu modifies `index.html` ou `tresor.html` :

```bash
npx cap sync          # synchronise le nouveau contenu web
npx cap open android  # ouvrir Android Studio pour générer le nouvel APK
```

Puis re-publier sur les stores (pas besoin de repasser en révision pour les mises à jour mineures sur Google Play — App Store demande toujours une révision).

---

## 7. Modèle économique recommandé

Pour vendre l'accès à chaque loge :

| Option | Description |
|--------|-------------|
| **Site web direct** | La loge accède via `slug.velum.fr` — pas besoin de stores |
| **App gratuite + abonnement** | L'app est gratuite, l'accès à la loge est payant (Stripe) |
| **Achat in-app** | Google/Apple prennent 15-30% — à éviter pour du B2B |

**Recommandation** : vendre directement sur **velum.fr** (site vitrine), les loges s'abonnent par virement ou CB via Stripe, et accèdent via leur sous-domaine. L'app sur les stores est gratuite et sert de vitrine.

---

## 8. Identifiants importants

| Élément | Valeur |
|---------|--------|
| App ID (Capacitor) | `fr.velum.temple` |
| Nom affiché | `Temple Virtuel` |
| Firebase projet | `site-cg51` |
| Cloudflare | Workers nommés `temple-{slug}` |

---

## Aide

Pour toute question technique sur cette configuration, partager ce fichier avec Claude.
