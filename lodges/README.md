# Velum — Déploiement d'une nouvelle loge

## Architecture multi-tenant

Chaque loge est identifiée par son **slug** (ex: `loge-lumiere`).

- **Sous-domaine** : `loge-lumiere.velum.fr` (ou domaine propre)
- **Comptes Firebase** : `grade@loge-lumiere.velum.fr`
- **Données Firestore** : `artifacts/loge-lumiere/public/data/...`
- **Worker Cloudflare** : `temple-loge-lumiere`

Le slug est dérivé automatiquement du sous-domaine à l'ouverture de l'application.

---

## Déployer une nouvelle loge

### Via GitHub Actions (recommandé)

**Actions → "Déployer une Nouvelle Loge" → Run workflow**

| Champ | Exemple | Description |
|-------|---------|-------------|
| slug | `loge-lumiere` | Identifiant unique, minuscules + tirets |
| Nom de la loge | `R∴L∴ Loge Lumière n°99` | Nom complet affiché dans l'app |
| Domaine | `loge-lumiere.velum.fr` | Sous-domaine Velum ou domaine propre |
| Mot de passe initial | `Temple2025!` | Pour tous les comptes (min. 8 car.) |

Durée : ~2 minutes. Le résumé affiche tous les comptes créés.

### Ce que le workflow fait automatiquement

1. ✅ Copie `index.html` + assets dans `lodges/{slug}/dist/`
2. ✅ Personnalise le titre HTML avec le nom de la loge
3. ✅ Crée le `wrangler.toml` pour le Worker Cloudflare
4. ✅ Déploie sur Cloudflare Workers
5. ✅ Crée les 6 comptes Firebase Auth (`grade@{slug}.velum.fr`)
6. ✅ Initialise Firestore avec le nom de la loge et les mots de passe

### Comptes créés automatiquement

```
apprenti@{slug}.velum.fr
compagnon@{slug}.velum.fr
maitre@{slug}.velum.fr
tresorier@{slug}.velum.fr
vm@{slug}.velum.fr
architecte@{slug}.velum.fr
```

Tous démarrent avec le mot de passe initial. L'architecte doit les changer à la première connexion.

---

## Secrets GitHub requis

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Token Cloudflare avec permission Workers:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | ID du compte Cloudflare |
| `FIREBASE_SERVICE_ACCOUNT_FR` | Clé JSON du compte de service Firebase (projet: site-cg51) |

---

## Isolation des données

Les règles Firestore garantissent qu'un utilisateur de la loge A **ne peut jamais** accéder aux données de la loge B. La vérification se fait sur l'email : `vm@loge-a.velum.fr` ne peut lire que le chemin `artifacts/loge-a/...`.

---

## Loges déployées

| Slug | Nom | Domaine | Déployée le |
|------|-----|---------|-------------|
| site-cg51 | R∴L∴ Comte Guifré n°51 | lcg51.fr | loge fondatrice |

*(Mettre à jour ce tableau après chaque déploiement)*
