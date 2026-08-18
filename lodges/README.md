# Déploiement d'une nouvelle loge

## Étape 1 — Créer le fichier de configuration

Créer le dossier `lodges/{slug}/config.json` en copiant l'exemple :

```bash
cp -r lodges/exemple-loge lodges/mon-slug
```

Remplir `config.json` :
```json
{
  "slug": "loge-lumiere",
  "name": "R∴L∴ Loge Lumière n°99",
  "shortName": "Loge Lumière",
  "appId": "loge-lumiere-99",
  "domain": "loge-lumiere.fr",
  "contact_email": "vm@loge-lumiere.fr",
  "emails": {
    "apprenti":   "apprenti@loge-lumiere.fr",
    "compagnon":  "compagnon@loge-lumiere.fr",
    "maitre":     "maitre@loge-lumiere.fr",
    "tresorier":  "tresorier@loge-lumiere.fr",
    "vm":         "vm@loge-lumiere.fr",
    "architecte": "architecte@loge-lumiere.fr"
  }
}
```

**Règles de nommage :**
- `slug` : minuscules, tirets uniquement, ex. `loge-lumiere`
- `appId` : unique pour chaque loge, ex. `loge-lumiere-99` (le numéro de la loge)
- `domain` : domaine du site de la loge

## Étape 2 — Pousser sur main

```bash
git add lodges/loge-lumiere/
git commit -m "Nouvelle loge : Loge Lumière n°99"
git push
```

## Étape 3 — Lancer le déploiement

Sur GitHub → **Actions** → **Déployer une Nouvelle Loge** → **Run workflow**

Remplir :
- **Slug** : `loge-lumiere`
- **Mot de passe** : le mot de passe initial pour tous les comptes (min. 8 caractères)

Durée : ~2 minutes. Le résumé final affiche tous les comptes et l'URL du site.

## Ce que le workflow fait automatiquement

1. ✅ Génère un `index.html` personnalisé (nom, appId, emails)
2. ✅ Déploie sur Cloudflare Workers (URL du domaine)
3. ✅ Crée les 6 comptes Firebase Auth avec le mot de passe initial
4. ✅ Affiche le résumé complet

## Données Firestore

Chaque loge est isolée dans Firestore par son `appId` :
```
artifacts/{appId}/public/data/members/...
artifacts/{appId}/public/data/agenda/...
artifacts/{appId}/public/data/planches/...
```

Les données d'une loge ne sont jamais visibles par une autre.

## Loges déployées

| Slug | Nom | Domaine | AppID |
|------|-----|---------|-------|
| comte-guifr | R∴L∴ Comte Guifré n°51 | lcg51.fr | site-cg51 |

*(Mettre à jour ce tableau après chaque déploiement)*
