#!/usr/bin/env python3
"""Long Press card generator (longpress.news).
Usage: python3 make_card.py "<PILLAR>" "<HOOK>" "<SUBTITLE or ''>" <out.png> [hook|ig|news]
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
try:
    import icons as _icons
except Exception:
    _icons = None

# Long Press palette - the on-dark register of longpress.news
# (the site's Known Issue block: ink ground, indigo on top)
INK    = (23, 23, 28)      # #17171C  site --ink, the card ground
PANEL  = (34, 34, 42)      # #22222A
INDIGO = (169, 182, 255)   # #A9B6FF  the site's on-dark accent
PAPER  = (244, 244, 246)   # #F4F4F6
MUTED  = (154, 154, 168)   # #9A9AA8
DEEP   = (16, 16, 20)      # text sitting on an indigo fill

# back-compat names, kept so icons.py and any caller keep working
BG, CYAN, WHITE, DARK = INK, INDIGO, PAPER, DEEP

HANDLE = "@longpressnews"

# The site sets Schibsted Grotesk. Drop static TTFs named
# SchibstedGrotesk-{Regular,Medium,SemiBold,Bold}.ttf into scripts/social/fonts/
# and every card picks them up. Until then this falls through to Poppins,
# then DejaVu, so the generator never dies on a missing font.
_HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIRS = (
    os.path.join(_HERE, "fonts"),
    "/usr/share/fonts/truetype/google-fonts/",
    "/usr/local/share/fonts",
    os.path.expanduser("~/.fonts"),
)
DEJAVU = "/usr/share/fonts/truetype/dejavu/"
FONT_STACK = ("SchibstedGrotesk", "Poppins")
# Not every family ships every weight (this box has no Poppins-SemiBold), so
# try near weights inside a family before dropping to the next family --
# a slightly heavier cut beats a whole different typeface on the same card.
WEIGHT_FALLBACK = {
    "Bold": ("Bold", "SemiBold", "ExtraBold"),
    "SemiBold": ("SemiBold", "Bold", "Medium"),
    "Medium": ("Medium", "Regular", "SemiBold"),
    "Regular": ("Regular", "Medium"),
}

def font(size, weight="Bold"):
    for family in FONT_STACK:
        for w in WEIGHT_FALLBACK.get(weight, (weight,)):
            for d in FONT_DIRS:
                try:
                    return ImageFont.truetype(os.path.join(d, f"{family}-{w}.ttf"), size)
                except Exception:
                    continue
    dv = "DejaVuSans.ttf" if weight in ("Regular", "Medium") else "DejaVuSans-Bold.ttf"
    try:
        return ImageFont.truetype(DEJAVU + dv, size)
    except Exception:
        return ImageFont.load_default()

def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines

def rounded(draw, xy, r, fill):
    draw.rounded_rectangle(xy, radius=r, fill=fill)

def pill(draw, x, y, text, fnt):
    tw = draw.textlength(text, font=fnt)
    pad_x, h = 26, 54
    rounded(draw, (x, y, x + tw + pad_x * 2, y + h), 27, CYAN)
    draw.text((x + pad_x, y + h/2), text, font=fnt, fill=DARK, anchor="lm")
    return y + h

def wordmark(draw, W, H):
    fnt = font(38, "SemiBold")
    y = H - 78
    # the held-key mark: a rounded square, not a dot
    draw.rounded_rectangle((80, y - 6, 80 + 34, y + 28), radius=10, fill=INDIGO)
    draw.text((128, y + 11), HANDLE, font=fnt, fill=PAPER, anchor="lm")

def draw_icon(img, icon, W, H):
    if not (_icons and icon):
        return
    _icons.render(img, icon, W - 250, H - 250, 175)

def make(pillar, hook, sub, out, mode, icon=None):
    if mode == "ig":
        W, H = 1080, 1350
    elif mode == "hook":
        W, H = 1080, 1080
    else:
        W, H = 1080, 1080
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(img)
    # subtle top accent bar
    d.rectangle((0, 0, W, 10), fill=CYAN)
    margin = 80
    # pill tag
    pill_font = font(30, "SemiBold")
    py = pill(d, margin, 150, pillar.upper(), pill_font)
    # accent short bar under pill
    d.rectangle((margin, py + 40, margin + 90, py + 50), fill=CYAN)
    # hook text
    hook_size = 92 if len(hook) < 40 else (76 if len(hook) < 70 else 60)
    hf = font(hook_size, "Bold")
    max_w = W - margin * 2
    lines = wrap(d, hook, hf, max_w)
    y = py + 96
    for ln in lines:
        d.text((margin, y), ln, font=hf, fill=WHITE, anchor="lm")
        y += int(hook_size * 1.22)
    # subtitle
    if sub:
        sf = font(40, "Medium")
        for ln in wrap(d, sub, sf, max_w):
            y += 20
            d.text((margin, y), ln, font=sf, fill=MUTED, anchor="lm")
            y += 46
    draw_icon(img, icon, W, H)
    wordmark(ImageDraw.Draw(img), W, H)
    img.convert("RGB").save(out)
    print("saved", out)

if __name__ == "__main__":
    pillar = sys.argv[1]
    hook = sys.argv[2]
    sub = sys.argv[3] if len(sys.argv) > 3 else ""
    out = sys.argv[4] if len(sys.argv) > 4 else "card.png"
    mode = sys.argv[5] if len(sys.argv) > 5 else "news"
    icon = sys.argv[6] if len(sys.argv) > 6 else None
    make(pillar, hook, sub, out, mode, icon)
