#!/usr/bin/env python3
"""Long Press card generator (longpress.news).
Usage: python3 make_card.py "<PILLAR>" "<HOOK>" "<SUBTITLE or ''>" <out.png> [hook|ig|news]
"""
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont
try:
    import icons as _icons
except Exception:
    _icons = None

# Long Press palette - the newsroom identity, taken from the site's own
# tokens in longpress.news src/styles/global.css. Cards render on the site's
# MIDNIGHT ground (--ink), not its cream page ground: a cream card disappears
# in a feed, and the site's own inverted blocks and share card are midnight.
MIDNIGHT = (23, 24, 46)     # #17182E  --ink        the card ground
PANEL    = (34, 35, 60)     # #22233C  one step up  panels and icon tiles
ORANGE   = (224, 85, 43)    # #E0552B  --accent     fills, rules, large type
ORANGE_LT= (255, 157, 122)  # #FF9D7A  --accent-light  accent text ON midnight
PAPER    = (244, 241, 232)  # #F4F1E8  --ground     body text on midnight
MUTED    = (154, 151, 168)  # #9A97A8  --muted-light
TEAL     = (62, 124, 116)   # #3E7C74  --accent-2   the second voice
DEEP     = (23, 24, 46)     # text sitting on an orange fill

# Small orange text on midnight is about 3:1 - under the readable line. Use
# ORANGE_LT wherever the accent carries words; ORANGE only for fills, rules
# and display-size type.

# back-compat names, kept so icons.py and any caller keep working
BG, CYAN, WHITE, DARK = MIDNIGHT, ORANGE, PAPER, DEEP

HANDLE = "@longpressnews"

# The site sets Bricolage Grotesque. Google ships it with an optical-size
# suffix (BricolageGrotesque_48pt-Bold.ttf), so match by glob rather than an
# exact filename. Falls through Poppins to DejaVu: this never dies on a
# missing font, it just stops looking like the masthead.
_HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIRS = (
    os.path.join(_HERE, "fonts"),
    "/usr/share/fonts/truetype/google-fonts/",
    "/usr/local/share/fonts",
    os.path.expanduser("~/.fonts"),
)
DEJAVU = "/usr/share/fonts/truetype/dejavu/"
FONT_STACK = ("BricolageGrotesque", "Poppins")
# Not every family ships every weight (some boxes have no Poppins-SemiBold),
# so try near weights inside a family before dropping to the next family --
# a slightly heavier cut beats a whole different typeface on the same card.
WEIGHT_FALLBACK = {
    "Bold": ("Bold", "SemiBold", "ExtraBold"),
    "SemiBold": ("SemiBold", "Bold", "Medium"),
    "Medium": ("Medium", "Regular", "SemiBold"),
    "Regular": ("Regular", "Medium"),
}

def _find_font(family, weight):
    for d in FONT_DIRS:
        for pat in (f"{family}-{weight}.ttf", f"{family}*-{weight}.ttf"):
            hits = sorted(glob.glob(os.path.join(d, pat)))
            if hits:
                return hits[0]
    return None

def font(size, weight="Bold"):
    for family in FONT_STACK:
        for w in WEIGHT_FALLBACK.get(weight, (weight,)):
            path = _find_font(family, w)
            if path:
                try:
                    return ImageFont.truetype(path, size)
                except Exception:
                    pass
    dv = "DejaVuSans.ttf" if weight in ("Regular", "Medium") else "DejaVuSans-Bold.ttf"
    try:
        return ImageFont.truetype(DEJAVU + dv, size)
    except Exception:
        return ImageFont.load_default()

def mark(draw, x, y, size):
    """The Long Press mark: a ring with a centred dot, right arc in orange.
    Press and hold. Same shape as the favicon and the share card."""
    w = max(3, int(round(size * 0.14)))
    box = (x, y, x + size, y + size)
    draw.ellipse(box, outline=PAPER, width=w)
    draw.arc(box, start=-88, end=62, fill=ORANGE, width=w)
    r = size * 0.20
    cx, cy = x + size / 2.0, y + size / 2.0
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=PAPER)

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
    mark(draw, 80, y - 8, 38)
    draw.text((134, y + 11), HANDLE, font=fnt, fill=PAPER, anchor="lm")

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
