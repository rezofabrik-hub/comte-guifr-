#!/usr/bin/env python3
"""
🚀 Rezo Découpe - Script de déploiement automatique complet
Pousse vers GitHub et configure le déploiement automatique
"""

import subprocess
import sys
import os

def run_command(cmd, description):
    """Exécute une commande et affiche le résultat"""
    print(f"\n🔄 {description}...")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Erreur: {result.stderr}")
        return False
    print(f"✅ {description} réussi!")
    return True

def main():
    print("\n" + "="*60)
    print("🚀 REZO DÉCOUPE - DÉPLOIEMENT AUTOMATIQUE COMPLET")
    print("="*60)

    # Vérifier git
    if not run_command("git --version", "Vérification de Git"):
        sys.exit(1)

    # Initialiser git si nécessaire
    if not os.path.exists(".git"):
        print("\n📦 Initialisation du repository Git...")
        run_command("git init", "Initialisation Git")
        run_command("git config user.email 'rezofabrik@gmail.com'", "Configuration email Git")
        run_command("git config user.name 'Rezofabrik'", "Configuration nom Git")

    # Ajouter tous les fichiers
    run_command("git add .", "Ajout de tous les fichiers")

    # Créer le commit
    commit_msg = """Commit initial: Configurateur Rezo Découpe - Application autonome

✨ Application React complète:
- Aperçu en temps réel avec canvas
- Sélection de 5 matériaux
- Personnalisation texte/taille/couleur
- Authentification Firebase
- Gestion des commandes

🚀 Configuration déploiement automatique incluse
📝 Zero dépendance au projet Temple Comte Guifré"""

    run_command(f'git commit -m "{commit_msg}"', "Création du commit")

    # Renommer branche
    run_command("git branch -M main", "Renommage de la branche en 'main'")

    # Ajouter remote
    run_command("git remote remove origin 2>/dev/null || true", "Nettoyage remote")
    run_command(
        "git remote add origin https://github.com/rezofabrik-hub/rezo-decoupe.git",
        "Ajout du remote GitHub"
    )

    # Pousser le code
    print("\n📤 Poussée du code vers GitHub...")
    push_result = subprocess.run(
        "git push -u origin main",
        shell=True,
        capture_output=True,
        text=True
    )

    if push_result.returncode == 0:
        print("✅ Code poussé avec succès!")
    else:
        print("⚠️  Poussée du code:")
        print(push_result.stderr)

    # Afficher les prochaines étapes
    print("\n" + "="*60)
    print("✅ CONFIGURATION AUTOMATIQUE TERMINÉE!")
    print("="*60)

    print("\n📍 VOTRE SITE SERA DISPONIBLE À:")
    print("   https://rezofabrik-hub.github.io/rezo-decoupe")

    print("\n🔧 PROCHAINES ÉTAPES MANUELLES (30 secondes):")
    print("\n1. Allez sur: https://github.com/rezofabrik-hub/rezo-decoupe")
    print("\n2. Cliquez sur 'Settings' (Paramètres)")
    print("\n3. Dans le menu gauche, cliquez sur 'Pages'")
    print("\n4. Sous 'Build and deployment':")
    print("   - Source: sélectionnez 'Deploy from a branch'")
    print("   - Branch: sélectionnez 'main' et '/root'")
    print("   - Cliquez 'Save'")
    print("\n5. ⏳ Attendez 1-2 minutes")
    print("\n6. ✅ Votre site sera live sur:")
    print("   https://rezofabrik-hub.github.io/rezo-decoupe")

    print("\n💡 CONSEIL:")
    print("   GitHub Pages mets à jour votre site automatiquement")
    print("   chaque fois que vous poussez des changements!")

    print("\n🔑 CONFIGURATION FIREBASE (optionnel):")
    print("   1. cp .env.example .env.local")
    print("   2. Ajoutez vos clés Firebase")
    print("   3. Les commandes seront sauvegardées!")

    print("\n" + "="*60)
    print("✨ Bravo! Votre configurateur est prêt! 🎉")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
