# -*- coding: utf-8 -*-
"""assemble.py — collect the ten finished pages into a contact sheet and a
single 16:9 PDF, and assert the set is complete and correctly shaped.

Usage:  python decks/cato-digital/assemble.py
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

# PdfImagePlugin looks up Image.SAVE["JPEG"] directly, which is only populated
# once the format plugins are registered — without this the PDF save raises
# KeyError: 'JPEG' even though libjpeg is present.
Image.init()

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"

PAGES = [
    "01-cover", "02-product", "03-how-built", "04-thermal", "05-economics",
    "06-side-by-side", "07-ten-year", "08-siting", "09-assurance", "10-working-together",
]

missing = [p for p in PAGES if not (OUT / f"{p}.png").exists()]
if missing:
    raise SystemExit(f"missing pages: {', '.join(missing)}")

imgs = []
for name in PAGES:
    im = Image.open(OUT / f"{name}.png").convert("RGB")
    if im.size != (2560, 1440):
        raise SystemExit(f"{name}: expected 2560x1440, got {im.size[0]}x{im.size[1]}")
    imgs.append(im)
print(f"{len(imgs)} pages, all 2560x1440 (exact 16:9)")

# --- contact sheet: 2 columns x 5 rows ------------------------------------
TW, TH, GAP, PAD = 640, 360, 18, 24
cols, rows = 2, 5
sheet = Image.new("RGB", (PAD * 2 + cols * TW + (cols - 1) * GAP,
                          PAD * 2 + rows * TH + (rows - 1) * GAP), (245, 248, 251))
for i, im in enumerate(imgs):
    r, c = divmod(i, cols)
    sheet.paste(im.resize((TW, TH), Image.LANCZOS),
                (PAD + c * (TW + GAP), PAD + r * (TH + GAP)))
sheet_path = OUT / "_contact-sheet.png"
sheet.save(sheet_path)
print("contact sheet ->", sheet_path)

# --- single deck PDF ------------------------------------------------------
pdf_path = OUT / "PODOS_Cato_Digital_Deck.pdf"
imgs[0].save(pdf_path, save_all=True, append_images=imgs[1:], resolution=150.0, quality=95)
print("deck pdf      ->", pdf_path, f"({pdf_path.stat().st_size / 1_048_576:.1f} MB)")
