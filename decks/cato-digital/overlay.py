# -*- coding: utf-8 -*-
"""overlay.py — composite pixel-exact data graphics onto the pages 5 and 7 art plates.

The image model renders the words and the art beautifully but draws the DATA
wrong: on page 5 it sized the stacked bar decoratively ($74 came out narrower
than $72), and on page 7 it put the Pod line at ~$16.6M instead of $24.5M, so
the drawn gap contradicted the $8.6M headline it was printed beside.

So the plates hold that space empty and this script draws the graphic from the
arithmetic. Every number here is derived, not typed twice:

    stack sum          74+72+12+9+11+9+0            = 187   (deck total)
    heat credit        187 - 17                     = 170   (deck figure)
    colocation Y10     sum 2.760 * 1.04^i, i=0..9   = 33.14
    pod Y10            sum 2.242 * 1.02^i, i=0..9   = 24.55
    difference                                      =  8.59 -> "$8.6M"

Usage:  python decks/cato-digital/overlay.py
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"

W, H = 2560, 1440
SS = 2  # supersample factor — PIL has no AA, so draw big and downscale

# ---- brand palette (from the deck's visual lock) -------------------------
INK = (10, 14, 26)
COBALT = (27, 63, 217)
ELECTRIC = (37, 99, 235)
CYAN = (34, 188, 235)
GREEN = (22, 163, 74)
SLATE = (58, 68, 84)
GRID = (219, 226, 236)
MUTED = (108, 119, 137)

FONTS = Path("C:/Windows/Fonts")


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size * SS)


SANS = "segoeui.ttf"
SANS_SB = "seguisb.ttf"
SANS_B = "segoeuib.ttf"
MONO = "consola.ttf"
MONO_B = "consolab.ttf"


def new_layer() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    layer = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    return layer, ImageDraw.Draw(layer)


def flatten(plate_name: str, layer: Image.Image, out_name: str) -> Path:
    plate = Image.open(OUT / plate_name).convert("RGBA")
    if plate.size != (W, H):
        plate = plate.resize((W, H), Image.LANCZOS)
    layer = layer.resize((W, H), Image.LANCZOS)
    plate.alpha_composite(layer)
    dest = OUT / out_name
    plate.convert("RGB").save(dest)
    return dest


def text(d, xy, s, f, fill, anchor="la", spacing=None):
    x, y = xy
    if spacing:  # letter-spaced caps, for the technical mono labels
        cx = x
        widths = [d.textlength(ch, font=f) for ch in s]
        total = sum(widths) + spacing * SS * (len(s) - 1)
        if anchor[0] == "m":
            cx = x - total / 2
        elif anchor[0] == "r":
            cx = x - total
        for ch, w in zip(s, widths):
            d.text((cx, y), ch, font=f, fill=fill, anchor="l" + anchor[1])
            cx += w + spacing * SS
        return
    d.text((x * SS if False else x, y), s, font=f, fill=fill, anchor=anchor)


def S(v: float) -> float:
    """Scale a design-space coordinate into the supersampled layer."""
    return v * SS


# =========================================================================
# PAGE 5 — stacked operating-cost bar
# =========================================================================
STACK = [
    ("CAPITAL RECOVERY", 74, (107, 118, 132)),
    ("ENERGY", 72, COBALT),
    ("DEMAND CHARGES", 12, (138, 148, 163)),
    ("PROPERTY TAX + INSURANCE", 9, (160, 169, 182)),
    ("MAINTENANCE + MONITORING", 11, CYAN),
    ("LAND + NETWORK + INTERCONNECTION", 9, (180, 188, 199)),
    ("WATER", 0, (200, 207, 216)),
]
TOTAL = sum(v for _, v, _ in STACK)
assert TOTAL == 187, f"cost stack must sum to the deck total 187, got {TOTAL}"
HEAT_CREDIT = 17
NET = TOTAL - HEAT_CREDIT
assert NET == 170, f"187 - 17 must equal the deck's 170, got {NET}"


def page5() -> Path:
    layer, d = new_layer()

    bar_x0, bar_x1 = 960.0, 2440.0
    bar_y0, bar_y1 = 360.0, 468.0
    span = bar_x1 - bar_x0

    f_val = font(SANS_B, 42)
    f_lab = font(MONO, 20)
    f_leg_val = font(SANS_B, 32)

    # --- segments ---------------------------------------------------------
    x = bar_x0
    placed = []
    for name, val, color in STACK:
        w = span * val / TOTAL
        if val > 0:
            d.rectangle([S(x), S(bar_y0), S(x + w), S(bar_y1)], fill=color + (255,))
            # hairline separator so adjacent grays stay legible
            d.line([S(x), S(bar_y0), S(x), S(bar_y1)], fill=(255, 255, 255, 200), width=max(1, SS))
        placed.append((name, val, x, w, color))
        x += w

    # Values sit inside only where a segment is genuinely wide enough. The four
    # narrow categories are read off the legend instead — centring a label over
    # each of them is what made the first pass overlap.
    for name, val, x0, w, color in placed:
        if w > 200:
            d.text((S(x0 + w / 2), S((bar_y0 + bar_y1) / 2)), f"${val}", font=f_val,
                   fill=(255, 255, 255, 255), anchor="mm")

    # water = $0 : a marked zero-width tick rather than an invisible segment
    d.line([S(bar_x1), S(bar_y0 - 10), S(bar_x1), S(bar_y1 + 10)], fill=CYAN + (255,), width=3 * SS)

    # --- legend: 4 columns x 2 rows, every category with its exact value ---
    col_w = span / 4
    for i, (name, val, x0, w, color) in enumerate(placed):
        r, c = divmod(i, 4)
        cx = bar_x0 + c * col_w
        cy = 550.0 + r * 106.0
        sw = 20.0
        if val:
            d.rectangle([S(cx), S(cy), S(cx + sw), S(cy + sw)], fill=color + (255,))
        else:
            d.rectangle([S(cx), S(cy), S(cx + sw), S(cy + sw)], outline=CYAN + (255,),
                        width=max(1, SS) * 2)
        d.text((S(cx + sw + 18), S(cy - 9)), f"${val}", font=f_leg_val,
               fill=((CYAN if val == 0 else INK)) + (255,), anchor="la")
        for k, ln in enumerate(wrap_label(d, name, f_lab, col_w - 150)):
            text(d, (S(cx + sw + 108), S(cy - 3 + k * 26)), ln, f_lab, MUTED + (255,),
                 anchor="la", spacing=1.1)

    # --- the subtraction row ---------------------------------------------
    f_big = font(SANS_B, 88)
    f_cap = font(MONO, 21)
    row_y = 748.0
    cols = [
        (1140.0, f"${TOTAL}", "OWNER-OPERATED", ELECTRIC),
        (1620.0, f"\u2212 ${HEAT_CREDIT}", "HEAT OFFTAKE", GREEN),
        (2140.0, f"= ${NET}", "WITH HEAT MONETISED", ELECTRIC),
    ]
    for cx, big, cap, col in cols:
        d.text((S(cx), S(row_y)), big, font=f_big, fill=col + (255,), anchor="ma")
        text(d, (S(cx), S(row_y + 108)), cap, f_cap, INK + (255,), anchor="ma", spacing=1.4)

    return flatten("05-economics-plate.png", layer, "05-economics.png")


def wrap_label(d, s: str, f, max_w_design: float) -> list[str]:
    """Greedy wrap on spaces, measured in design pixels."""
    words = s.split(" ")
    lines, cur = [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if d.textlength(trial, font=f) / SS <= max_w_design or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


# =========================================================================
# PAGE 7 — ten-year cumulative cost lines
# =========================================================================
COLO_Y1, COLO_ESC = 2.760, 1.04   # $M per MW-year, escalator
POD_Y1, POD_ESC = 2.242, 1.02


def series(first: float, esc: float, years: int = 10) -> list[float]:
    out, run, yr = [], 0.0, first
    for _ in range(years):
        run += yr
        out.append(run)
        yr *= esc
    return out


def page7() -> Path:
    colo = series(COLO_Y1, COLO_ESC)
    pod = series(POD_Y1, POD_ESC)
    diff = colo[-1] - pod[-1]
    assert 8.5 <= diff <= 8.7, f"year-10 gap must round to the deck's $8.6M, got {diff:.2f}"

    layer, d = new_layer()

    px0, px1 = 250.0, 1580.0
    py0, py1 = 650.0, 1200.0
    ymax = 35.0

    def X(year: int) -> float:  # year 1..10
        return px0 + (px1 - px0) * (year - 1) / 9

    def Y(v: float) -> float:
        return py1 - (py1 - py0) * (v / ymax)

    f_axis = font(MONO, 21)
    f_year = font(MONO, 20)
    f_leg = font(MONO, 21)
    f_ttl = font(MONO, 21)

    # --- y grid + labels --------------------------------------------------
    for v in range(0, int(ymax) + 1, 5):
        gy = Y(v)
        d.line([S(px0), S(gy), S(px1), S(gy)], fill=GRID + (255,), width=max(1, SS))
        d.text((S(px0 - 26), S(gy)), str(v), font=f_axis, fill=MUTED + (255,), anchor="rm")

    # axis title
    text(d, (S(px0 - 26), S(py0 - 62)), "$ MILLIONS \u00b7 CUMULATIVE", f_ttl, COBALT + (255,),
         anchor="la", spacing=1.6)

    # --- difference band between the curves ------------------------------
    band = [(S(X(i + 1)), S(Y(colo[i]))) for i in range(10)]
    band += [(S(X(i + 1)), S(Y(pod[i]))) for i in reversed(range(10))]
    fill_layer = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    ImageDraw.Draw(fill_layer).polygon(band, fill=COBALT + (30,))
    layer.alpha_composite(fill_layer)
    d = ImageDraw.Draw(layer)

    # --- the two curves ---------------------------------------------------
    def plot(vals, color, width=5):
        pts = [(S(X(i + 1)), S(Y(v))) for i, v in enumerate(vals)]
        d.line(pts, fill=color + (255,), width=width * SS, joint="curve")
        for px, py in pts:
            r = 7 * SS
            d.ellipse([px - r, py - r, px + r, py + r], fill=(255, 255, 255, 255))
            r = 5 * SS
            d.ellipse([px - r, py - r, px + r, py + r], fill=color + (255,))

    plot(colo, SLATE)
    plot(pod, ELECTRIC)

    # --- x axis + year labels --------------------------------------------
    d.line([S(px0), S(py1), S(px1), S(py1)], fill=(150, 160, 175) + (255,), width=max(1, SS) * 2)
    for i in range(10):
        gx = X(i + 1)
        d.line([S(gx), S(py1), S(gx), S(py1 + 10)], fill=(150, 160, 175) + (255,), width=max(1, SS))
        text(d, (S(gx), S(py1 + 24)), f"YEAR {i + 1}", f_year, COBALT + (255,), anchor="ma", spacing=1.0)

    # --- year-10 difference bracket --------------------------------------
    bx = X(10) + 34
    ytop, ybot = Y(colo[-1]), Y(pod[-1])
    d.line([S(bx), S(ytop), S(bx), S(ybot)], fill=COBALT + (255,), width=3 * SS)
    for yy in (ytop, ybot):
        d.line([S(bx - 10), S(yy), S(bx + 10), S(yy)], fill=COBALT + (255,), width=3 * SS)
    d.line([S(X(10)), S(ytop), S(bx), S(ytop)], fill=COBALT + (160,), width=max(1, SS))
    d.line([S(X(10)), S(ybot), S(bx), S(ybot)], fill=COBALT + (160,), width=max(1, SS))
    text(d, (S(bx + 22), S((ytop + ybot) / 2 - 12)), f"${diff:.1f}M", font(MONO_B, 26), COBALT + (255,),
         anchor="la", spacing=1.0)

    # --- legend -----------------------------------------------------------
    lx, ly = px0 + 70, py0 + 44
    for label, color, dy in (
        ("COLOCATION \u00b7 4% ESCALATOR", SLATE, 0),
        ("POD \u00b7 2% OPERATING-COST ESCALATOR", ELECTRIC, 42),
    ):
        d.line([S(lx), S(ly + dy), S(lx + 58), S(ly + dy)], fill=color + (255,), width=5 * SS)
        text(d, (S(lx + 78), S(ly + dy - 13)), label, f_leg, INK + (255,), anchor="la", spacing=1.3)

    return flatten("07-ten-year-plate.png", layer, "07-ten-year.png")


if __name__ == "__main__":
    print("page 5 ->", page5())
    print("page 7 ->", page7())
    c, p = series(COLO_Y1, COLO_ESC), series(POD_Y1, POD_ESC)
    print(f"  verified: stack={TOTAL} net={NET} coloY10={c[-1]:.2f} podY10={p[-1]:.2f} diff={c[-1]-p[-1]:.2f}")
