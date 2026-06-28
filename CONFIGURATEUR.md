# Configurateur de Lettrages 🎨

Bienvenue dans le configurateur interactif de lettrages ! Ce module vous permet de concevoir des lettrages personnalisés avec plusieurs matières, tailles, polices et finitions.

## 🚀 Fonctionnalités

### 1️⃣ Configuration Texte
- Saisisssez votre texte (maximum 32 caractères)
- Support complet des accents français (é, è, ê, ë, à, etc.)
- Validation en temps réel

### 2️⃣ Sélection de la Matière
Choisissez parmi 5 matières différentes :

| Matière | Prix/cm² | Délai | Description |
|---------|----------|-------|-------------|
| **Acier Inox** | 8,75 € | 5j | Acier galvanisé haute qualité, très durable |
| **Bois de Chêne** | 12,50 € | 7j | Bois massif premium, aspect naturel |
| **Acrylique Transparent** | 15,00 € | 4j | Acrylique brillant pour effet moderne |
| **PVC Blanc** | 6,50 € | 3j | PVC économique et durable |
| **Aluminium Anodisé** | 10,25 € | 6j | Aluminium anodisé, effet haut de gamme |

### 3️⃣ Personnalisation (Taille, Police, Couleur)

**Hauteur:**
- Ajustable de 50 mm à 500 mm
- Largeur estimée calculée automatiquement

**Polices:**
- **Serif** (Elegant) - Police élégante traditionnelle
- **Sans-serif** (Moderne) - Police contemporaine et épurée
- **Monospace** (Code) - Police à espacement fixe

**Couleurs:**
- Noir (#000000)
- Blanc (#FFFFFF)
- Rouge (#DC2626)
- Bleu (#0369A1)
- Violet (#7C3AED)
- Orange (#EA580C)

### 4️⃣ Finitions Optionnelles

| Finition | Matières Compatibles | Prix |
|----------|---------------------|------|
| **Vernis Brillant** | Acier, Bois, Aluminium | +8,50 € |
| **Peinture Noire** | Toutes matières | +10,00 € |
| **Peinture Blanche** | Acier, Acrylique, PVC, Aluminium | +10,00 € |
| **Finition Naturelle** | Bois uniquement | Gratuit |

### 5️⃣ Prévisualisation & Tarification

**Prévisualisation en temps réel:**
- Aperçu exact de votre lettrage
- Simulation de la texture de la matière
- Mise à jour instantanée lors de chaque modification

**Calcul du Prix:**
- Prix matière : basé sur surface (hauteur × largeur estimée)
- Prix caractères : coût supplémentaire par caractère
- Prix finitions : somme des options sélectionnées
- Affichage HT et TTC (TVA 20% incluse)

## 💰 Exemple de Tarification

**Configuration:** "COMTE GUIFRÉ" en Acier (150mm) avec Peinture Noire

```
Matière (Acier 150×450mm):      45,50 €
Caractères (12 × 0,65€):         7,80 €
Finitions (Peinture noire):     10,00 €
                               --------
Sous-total HT:                  63,30 €
TVA (20%):                      12,66 €
                               --------
TOTAL TTC:                      75,96 €

Délai de production: 7 jours (5j acier + 2j finition)
```

## 🔧 Comment Utiliser

1. **Ouvrir le Configurateur:**
   - Cliquez sur "Configurateur" dans la barre de navigation

2. **Parcourir les étapes:**
   - Étape 1: Saisir votre texte
   - Étape 2: Choisir la matière
   - Étape 3: Régler taille, police et couleur
   - Étape 4: Ajouter des finitions (optionnel)
   - Étape 5: Vérifier le récapitulatif et passer commande

3. **Navigation:**
   - Bouton "Suivant" → Aller à l'étape suivante
   - Bouton "Retour" → Revenir à l'étape précédente
   - L'aperçu se met à jour en temps réel

4. **Passer la Commande:**
   - Vérifiez tous les détails dans l'étape finale
   - Cliquez "Passer la Commande"
   - La commande est enregistrée et vous recevez une confirmation

## 📊 Historique des Commandes

Toutes vos commandes sont enregistrées et accessibles:
- **Statut:** Pending → Production → Shipped → Delivered
- **Détails:** Texte, matière, dimensions, prix
- **Aperçu:** Image de la configuration
- **Actions:** Dupliquer une commande précédente

## 🔒 Données Stockées

Les informations de vos commandes sont stockées de manière sécurisée dans Firestore:
- Texte et configuration exacte
- Prix détaillé (HT, TTC, TVA)
- Date de création
- Statut de la commande
- Email de l'utilisateur

Chaque utilisateur ne peut voir que ses propres commandes.

## ⚡ Astuces & Conseils

✅ **Bon à savoir:**
- La largeur est estimée automatiquement selon la police et la hauteur
- Les finitions ajoutent 2 jours au délai de production
- Les prix affichés sont en euros TTC
- Maximum 32 caractères par commande

⚠️ **À retenir:**
- L'acier est le plus durable et économique
- Le bois offre un aspect premium et naturel
- L'acrylique crée un effet moderne et transparent
- Les finitions (vernis, peinture) protègent et embellissent

## 🎯 Cas d'Usage

- **Enseignes commerciales** → Acier + Peinture
- **Plaques commemoratives** → Bois + Vernis
- **Panneaux modernes** → Acrylique transparent
- **Signalétique intérieure** → PVC économique
- **Plaques haut de gamme** → Aluminium anodisé

## 📞 Support

Pour toute question sur le configurateur ou vos commandes:
- Contactez l'Architecte du Temple
- Email: architecte@cg51-virtuel.fr
- Téléphone: 06 84 05 92 55

---

**Version:** 1.0  
**Date:** Juin 2026  
**Loge:** R∴L∴ Comte Guifré n°51
