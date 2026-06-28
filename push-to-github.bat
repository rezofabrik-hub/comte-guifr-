@echo off
REM Script pour pousser le configurateur Rezo Découpe vers GitHub automatiquement (Windows)

echo 🚀 Rezo Découpe - Push automatique vers GitHub
echo ==================================================

REM Vérifier que git est installé
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installé. Veuillez installer Git d'abord.
    pause
    exit /b 1
)

REM Initialiser le repo s'il n'est pas déjà initialisé
if not exist ".git" (
    echo 📦 Initialisation du repository Git...
    git init
    git config user.email "rezofabrik@gmail.com"
    git config user.name "Rezofabrik"
)

REM Ajouter tous les fichiers
echo 📝 Ajout de tous les fichiers...
git add .

REM Créer le commit initial
echo 💾 Création du commit...
git commit -m "Commit initial: Configurateur Rezo Découpe - Application autonome de lettrage"

REM Renommer la branche principale en 'main'
echo 🔄 Renommage de la branche en 'main'...
git branch -M main

REM Ajouter le remote GitHub
echo 🌐 Ajout du remote GitHub...
git remote remove origin 2>nul
git remote add origin "https://github.com/rezofabrik-hub/rezo-decoupe.git"

REM Pousser le code
echo 📤 Poussée du code vers GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Le code a été poussé avec succès!
    echo.
    echo 📍 Votre repository est disponible sur:
    echo    https://github.com/rezofabrik-hub/rezo-decoupe
    echo.
    echo 🚀 Prochaines étapes:
    echo    1. Configurez Firebase dans .env.local
    echo    2. Servez l'application: python -m http.server 3000
    echo    3. Ouvrez http://localhost:3000 dans votre navigateur
) else (
    echo ❌ Erreur lors de la poussée du code.
    echo    Vérifiez que vous avez les permissions sur le repo.
)

pause
