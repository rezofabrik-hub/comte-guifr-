#!/usr/bin/env python3
"""Compile le site en un fichier HTML unique, images incluses en data: URI.
Sert à publier une version partageable par simple lien."""
import base64, pathlib, re, sys

root = pathlib.Path(__file__).parent
out_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else root / "ombre-et-lumiere.html"

html = (root / "index.html").read_text(encoding="utf-8")
parts = {n: (root / "assets" / n).read_text(encoding="utf-8")
         for n in ("style.css", "data.js", "images.js", "app.js")}

body = html.split("<body>", 1)[1].split('<script src="assets/data.js">', 1)[0].strip()
assert body.startswith('<a class="skip"') and body.endswith("</footer>")

doc = ("<title>Ombre et Lumière</title>\n"
       f"<style>\n{parts['style.css']}\n</style>\n\n{body}\n\n"
       f"<script>\n{parts['data.js']}\n</script>\n"
       f"<script>\n{parts['images.js']}\n</script>\n"
       f"<script>\n{parts['app.js']}\n</script>\n")

def inline(m):
    f = root / m.group(0)
    if not f.exists():
        raise SystemExit("image absente : " + m.group(0))
    return "data:image/jpeg;base64," + base64.b64encode(f.read_bytes()).decode()

doc, n = re.subn(r"assets/img/[A-Za-z0-9_.-]+\.jpg", inline, doc)
out_path.write_text(doc, encoding="utf-8")
print(f"{out_path} — {len(doc)/1e6:.2f} Mo, {n} images intégrées")
