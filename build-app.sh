#!/usr/bin/env bash
# ============================================================
# build-app.sh — Générer les projets Android et iOS
# Temple Virtuel · Plateforme Velum
#
# Prérequis :
#   - Node.js >= 18  (node --version)
#   - Android Studio installé (pour Android)
#   - Xcode installé sur Mac (pour iOS)
# ============================================================

set -e
echo "🏛️  Temple Virtuel — Préparation des apps natives"
echo "=================================================="

# 1. Installer les dépendances Capacitor
echo ""
echo "📦 Installation de Capacitor..."
npm install

# 2. Ajouter Android si pas encore fait
if [ ! -d "android" ]; then
  echo ""
  echo "🤖 Ajout du projet Android..."
  npx cap add android
else
  echo "✅ Projet Android déjà présent"
fi

# 3. Ajouter iOS si pas encore fait (Mac uniquement)
if [[ "$OSTYPE" == "darwin"* ]]; then
  if [ ! -d "ios" ]; then
    echo ""
    echo "🍎 Ajout du projet iOS..."
    npx cap add ios
  else
    echo "✅ Projet iOS déjà présent"
  fi
else
  echo "⚠️  iOS ignoré (Mac requis)"
fi

# 4. Synchroniser le contenu web dans les projets natifs
echo ""
echo "🔄 Synchronisation du contenu web..."
npx cap sync

echo ""
echo "=================================================="
echo "✅ PROJETS GÉNÉRÉS"
echo "=================================================="
echo ""
echo "👉 Pour ouvrir Android Studio :"
echo "   npx cap open android"
echo ""
if [[ "$OSTYPE" == "darwin"* ]]; then
echo "👉 Pour ouvrir Xcode :"
echo "   npx cap open ios"
echo ""
fi
echo "📖 Voir APP_STORE_GUIDE.md pour la suite"
echo "=================================================="
