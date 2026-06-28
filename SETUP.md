# 🚀 Rezo Découpe - Guide de déploiement ULTRA rapide

## ⚡ Option 1: Déploiement complet (RECOMMANDÉ)

Tout se fait en UNE COMMANDE!

### Mac/Linux:
```bash
chmod +x deploy-all.py
python3 deploy-all.py
```

### Windows:
```bash
python deploy-all.py
```

**Ce que fait ce script:**
- ✅ Initialise Git
- ✅ Commit tous les fichiers
- ✅ Pousse vers GitHub
- ✅ Configure le déploiement automatique
- ✅ Vous donne le lien du site!

---

## 📝 Option 2: Scripts manuels (ancien)

### Mac/Linux:
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

### Windows:
```bash
push-to-github.bat
```

## ✨ APRÈS LE DÉPLOIEMENT

### 🌍 Votre site sera automatiquement en ligne!

**Lien public:**
```
https://rezofabrik-hub.github.io/rezo-decoupe
```

### 🔧 Étapes finales (optionnel)

1. **Configurez Firebase** (pour sauvegarder les commandes):
   ```bash
   cp .env.example .env.local
   # Remplissez avec vos clés Firebase
   ```

2. **Testez localement:**
   ```bash
   python3 -m http.server 3000
   # Allez sur http://localhost:3000
   ```

3. **Intégrations avancées:**
   - Stripe pour paiements
   - SendGrid pour emails
   - Cloudflare pour CDN

## 🎯 Fonctionnalités du configurateur

✅ Saisie de texte (max 50 caractères)
✅ Choix de 5 matériaux avec prix
✅ Curseur de taille (10-200 cm)
✅ Sélecteur de couleur
✅ Aperçu en temps réel avec Canvas
✅ Historique des commandes
✅ Interface moderne avec Tailwind CSS

## 🔄 Mise à jour du site

Le site se met à jour **automatiquement** quand vous:
```bash
git add .
git commit -m "Votre message"
git push origin main
```

GitHub Pages redéploie automatiquement en 1-2 minutes! 🚀

---

**✨ Votre site est prêt! Enjoy! 🎉**
