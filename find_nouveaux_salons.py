#!/usr/bin/env python3
"""
Trouve les salons/instituts créés récemment en France via l'API officielle.
Source : recherche-entreprises.api.gouv.fr (gratuit, sans clé)

Usage :
  python3 find_nouveaux_salons.py
  python3 find_nouveaux_salons.py --mois 3        # créés dans les 3 derniers mois
  python3 find_nouveaux_salons.py --ville Paris    # filtrer par ville
  python3 find_nouveaux_salons.py --dept 69        # filtrer par département (ex: 69 = Rhône)
"""

import urllib.request
import urllib.parse
import json
import csv
import sys
import argparse
from datetime import datetime, timedelta

# Codes NAF ciblés
NAF_CODES = {
    "96.02A": "Coiffure",
    "96.02B": "Soins de beauté / esthétique",
    "96.04Z": "Entretien corporel (spa, hammam...)",
    "96.09B": "Tatouage / piercing",
    "96.09A": "Autres soins corporels",
}

API_URL = "https://recherche-entreprises.api.gouv.fr/search"


def fetch_page(naf, date_debut, ville=None, dept=None, page=1, per_page=25):
    params = {
        "activite_principale": naf,
        "date_creation_min": date_debut,
        "per_page": per_page,
        "page": page,
        "etat_administratif": "A",  # uniquement actifs
    }
    if ville:
        params["commune"] = ville
    if dept:
        params["departement"] = dept

    url = API_URL + "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        print(f"  Erreur API : {e}", file=sys.stderr)
        return None


def fetch_all(naf, label, date_debut, ville=None, dept=None, max_results=200):
    results = []
    page = 1
    print(f"  Recherche [{label}] depuis {date_debut}...", end="", flush=True)
    while len(results) < max_results:
        data = fetch_page(naf, date_debut, ville, dept, page)
        if not data:
            break
        items = data.get("results", [])
        if not items:
            break
        for item in items:
            siege = item.get("siege", {})
            results.append({
                "Secteur": label,
                "Nom": item.get("nom_complet", "").strip(),
                "SIREN": item.get("siren", ""),
                "Date création": item.get("date_creation", ""),
                "Adresse": siege.get("adresse", ""),
                "Code postal": siege.get("code_postal", ""),
                "Ville": siege.get("libelle_commune", ""),
                "Département": siege.get("departement", ""),
                "Site web": siege.get("site_internet", ""),
                "Email": siege.get("email", ""),
                "Téléphone": siege.get("telephone", ""),
                "NAF": naf,
            })
        total = data.get("total_results", 0)
        print(f" {min(len(results), total)}/{total}", end="", flush=True)
        if page * 25 >= total or page * 25 >= max_results:
            break
        page += 1
    print()
    return results


def main():
    parser = argparse.ArgumentParser(description="Cherche les nouveaux salons/instituts en France")
    parser.add_argument("--mois", type=int, default=6, help="Créés dans les N derniers mois (défaut: 6)")
    parser.add_argument("--ville", type=str, default=None, help="Filtrer par ville")
    parser.add_argument("--dept", type=str, default=None, help="Filtrer par département (ex: 75, 69, 13)")
    parser.add_argument("--max", type=int, default=200, help="Max résultats par secteur (défaut: 200)")
    parser.add_argument("--sortie", type=str, default="nouveaux_salons.csv", help="Fichier CSV de sortie")
    args = parser.parse_args()

    date_debut = (datetime.now() - timedelta(days=args.mois * 30)).strftime("%Y-%m-%d")

    print(f"\n🔍 Recherche des établissements créés depuis le {date_debut}")
    if args.ville:
        print(f"   Ville : {args.ville}")
    if args.dept:
        print(f"   Département : {args.dept}")
    print()

    all_results = []
    for naf, label in NAF_CODES.items():
        rows = fetch_all(naf, label, date_debut, args.ville, args.dept, args.max)
        all_results.extend(rows)

    # Dédupliquer par SIREN
    seen = set()
    deduped = []
    for r in all_results:
        if r["SIREN"] not in seen:
            seen.add(r["SIREN"])
            deduped.append(r)

    # Trier par date de création décroissante (les plus récents en premier)
    deduped.sort(key=lambda x: x["Date création"], reverse=True)

    print(f"\n✅ {len(deduped)} établissements trouvés (doublons retirés)")

    if not deduped:
        print("Aucun résultat.")
        return

    # Export CSV
    fields = ["Secteur", "Nom", "Date création", "Adresse", "Code postal", "Ville",
              "Département", "Téléphone", "Email", "Site web", "SIREN", "NAF"]
    with open(args.sortie, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(deduped)

    print(f"📄 Fichier exporté : {args.sortie}")
    print()

    # Résumé par secteur
    print("── Résumé par secteur ──────────────────")
    from collections import Counter
    counts = Counter(r["Secteur"] for r in deduped)
    for label, count in counts.most_common():
        print(f"  {label:<35} {count} établissements")

    # Aperçu des 5 premiers
    print()
    print("── 5 plus récents ──────────────────────")
    for r in deduped[:5]:
        print(f"  {r['Date création']}  {r['Nom']}  —  {r['Ville']} ({r['Département']})")
        if r["Téléphone"]:
            print(f"             📞 {r['Téléphone']}")
        if r["Email"]:
            print(f"             ✉  {r['Email']}")


if __name__ == "__main__":
    main()
