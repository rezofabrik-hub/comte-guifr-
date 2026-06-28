#!/bin/bash

# Script pour pousser le configurateur Rezo Découpe vers GitHub automatiquement

echo "🚀 Rezo Découpe - Push automatique vers GitHub"
echo "=================================================="

# Vérifier que git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Veuillez installer Git d'abord."
    exit 1
fi

# Initialiser le repo s'il n'est pas déjà initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du repository Git..."
    git init
    git config user.email "rezofabrik@gmail.com"
    git config user.name "Rezofabrik"
fi

# Ajouter tous les fichiers
echo "📝 Ajout de tous les fichiers..."
git add .

# Créer le commit initial
echo "💾 Création du commit..."
git commit -m "Commit initial: Configurateur Rezo Découpe - Application autonome de lettrage

✨ Application React complète et fonctionnelle:
- Aperçu en temps réel avec canvas
- Sélection de 5 matériaux (Acier, Bois, Acrylique, PVC, Aluminium)
- Personnalisation du texte, taille et couleur
- Authentification Firebase intégrée
- Gestion des commandes utilisateur
- Interface moderne avec Tailwind CSS

🔧 Configuration:
- .env.example: Template pour les variables d'environnement
- .gitignore: Exclusions Git appropriées
- README.md: Documentation complète

🚀 Prêt pour:
- Intégration Stripe (paiements)
- Intégration SendGrid (emails)
- Déploiement sur Vercel, Netlify ou Cloudflare Pages

📝 Zero dépendance à Comte Guifré Temple - Application complètement autonome" || echo "ℹ️ Aucun changement à committer"

# Renommer la branche principale en 'main'
echo "🔄 Renommage de la branche en 'main'..."
git branch -M main

# Ajouter le remote GitHub
echo "🌐 Ajout du remote GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/rezofabrik-hub/rezo-decoupe.git"

# Pousser le code
echo "📤 Poussée du code vers GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Le code a été poussé avec succès!"
    echo ""
    echo "📍 Votre repository est disponible sur:"
    echo "   https://github.com/rezofabrik-hub/rezo-decoupe"
    echo ""
    echo "🚀 Prochaines étapes:"
    echo "   1. Configurez Firebase dans .env.local"
    echo "   2. Servez l'application: python3 -m http.server 3000"
    echo "   3. Ouvrez http://localhost:3000 dans votre navigateur"
else
    echo "❌ Erreur lors de la poussée du code."
    echo "   Vérifiez que vous avez les permissions sur le repo."
fi
