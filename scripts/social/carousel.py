#!/usr/bin/env python3
"""Long Press carousel generator (4:5, 1080x1350).
Usage: python3 carousel.py spec.json
spec: {"tag","prefix","slides":[{type:cover|list|take,...}]}
"""
import glob, os, sys, json
from PIL import Image, ImageDraw, ImageFont
try:
    import icons as _icons
except Exception:
    _icons = None

# Long Press palette - the newsroom identity, taken from the site's own
# tokens in longpress.news src/styles/global.css. Cards render on the site's
# MIDNIGHT ground (--ink), not its cream page ground: a cream card disappears
# in a feed, and the site's own inverted blocks and share card are midnight.
MIDNIGHT = (52, 50, 63)     # #34323F  --screen     the card ground
PANEL    = (66, 63, 79)     # #423F4F  one step up  panels and icon tiles
ORANGE   = (217, 142, 114)  # #D98E72  terracotta   fills, rules, large type
ORANGE_LT= (227, 165, 143)  # #E3A58F  --accent-light  accent text on slate
PAPER    = (243, 238, 225)
AMBER    = (227, 197, 138)  # #E3C58A  phosphor, the mark's ring and dot
MUSTARD  = (214, 184, 120)  # #D6B878  # #F3EEE1  --ground     body text on slate
MUTED    = (172, 167, 184)  # #ACA7B8  muted on slate
TEAL     = (91, 138, 132)   # #5B8A84  --teal       the second voice
DEEP     = (52, 50, 63)     # text sitting on a terracotta fill

# Small orange text on midnight is about 3:1 - under the readable line. Use
# ORANGE_LT wherever the accent carries words; ORANGE only for fills, rules
# and display-size type.

# back-compat names, kept so icons.py and any caller keep working
BG, CYAN, WHITE, DARK = MIDNIGHT, ORANGE, PAPER, DEEP

HANDLE = "@longpressnews"

W, H = 1080, 1350

# The site's actual display type (src/styles/global.css --display) is
# Archivo, with Public Sans as body. Earlier revisions of this comment named
# Bricolage Grotesque / Poppins and the fonts/README named Schibsted Grotesk
# - none of those match global.css and none of those TTFs were ever present
# on the Mac this generator runs on (no google-fonts dir, no /usr/share
# DejaVu either - those are Linux paths). Every card since this script
# existed silently fell through every family to ImageFont.load_default(),
# which is why headlines rendered tiny and curly quotes/em dashes rendered
# as boxes. Match by glob (not an exact filename) in case a future family
# ships with an optical-size suffix.
_HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIRS = (
    os.path.join(_HERE, "fonts"),
    # The daily task copies this script into a temp outputs folder and runs
    # it there, so _HERE/fonts is empty and text silently fell back to a
    # tiny bitmap font. Absolute repo path keeps the brand fonts loading no
    # matter which folder the script runs from.
    "/Users/masterswami/Documents/GitHub/Builtbyswami/scripts/social/fonts",
    "/usr/share/fonts/truetype/google-fonts/",
    "/usr/local/share/fonts",
    os.path.expanduser("~/.fonts"),
)
DEJAVU = "/usr/share/fonts/truetype/dejavu/"
FONT_STACK = ("Archivo", "PublicSans")
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
        pass
    # macOS has none of the Linux font paths above; try a real system font
    # at the requested size before the last-resort bitmap default (which
    # renders microscopically and ignores `size`).
    for macf in ("/System/Library/Fonts/Supplemental/Arial Bold.ttf",
                 "/System/Library/Fonts/Supplemental/Arial.ttf",
                 "/System/Library/Fonts/Helvetica.ttc"):
        try:
            return ImageFont.truetype(macf, size)
        except Exception:
            pass
    return ImageFont.load_default()

def mark(draw, x, y, size):
    """The Long Press mark: a ring with a centred dot, right arc in orange.
    Press and hold. Same shape as the favicon and the share card."""
    w = max(3, int(round(size * 0.14)))
    box = (x, y, x + size, y + size)
    draw.ellipse(box, outline=AMBER, width=w)
    draw.arc(box, start=-88, end=62, fill=ORANGE, width=w)
    r = size * 0.20
    cx, cy = x + size / 2.0, y + size / 2.0
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=AMBER)

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

def base(tag, idx, total):
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, 4), fill=CYAN); d.rectangle((0, 4, W, 8), fill=MUSTARD); d.rectangle((0, 8, W, 12), fill=TEAL)
    m = 80
    pf = font(28, "SemiBold")
    tw = d.textlength(tag.upper(), font=pf)
    d.rounded_rectangle((m, 90, m + tw + 48, 90 + 50), radius=25, fill=CYAN)
    d.text((m + 24, 115), tag.upper(), font=pf, fill=DARK, anchor="lm")
    # slide counter
    cf = font(28, "SemiBold")
    d.text((W - m, 115), f"{idx}/{total}", font=cf, fill=MUTED, anchor="rm")
    return img, d, m

def wordmark(d):
    fnt = font(34, "SemiBold")
    y = H - 76
    mark(d, 80, y - 7, 34)
    d.text((126, y + 9), HANDLE, font=fnt, fill=PAPER, anchor="lm")
    _cx = 126 + d.textlength(HANDLE, font=fnt) + 10
    d.rectangle((_cx, y - 2, _cx + 13, y + 20), fill=AMBER)

def cover(tag, s, idx, total):
    img, d, m = base(tag, idx, total)
    tf = font(96, "Bold")
    lines = wrap(d, s["title"], tf, W - m*2)
    # The 430 start assumed a one or two line title. A third line used to run
    # straight into the icon tile, so lift the block as it grows.
    y = max(300, 430 - (len(lines) - 2) * 58)
    for ln in lines:
        d.text((m, y), ln, font=tf, fill=WHITE, anchor="lm"); y += 116
    if s.get("sub"):
        sf = font(44, "Medium")
        y += 24
        for ln in wrap(d, s["sub"], sf, W - m*2):
            d.text((m, y), ln, font=sf, fill=ORANGE_LT, anchor="lm"); y += 58
    icon = s.get("icon")
    if _icons and icon:
        # Sit below whatever the text actually used. On a long title there is
        # less room, so shrink the tile rather than collide with the headline
        # (the old fixed y) or leave a hole in the middle of the slide.
        top, floor = int(y) + 40, H - 250
        r = min(180, (floor - top) // 2)
        if r >= 90:
            _icons.render(img, icon, W - 250, top + r, r)
    sw = font(40, "SemiBold")
    d.text((m, H - 200), "Swipe", font=sw, fill=MUTED, anchor="lm")
    # arrow is drawn, not typed: not every fallback font carries U+2192
    ax, ay = m + d.textlength("Swipe", font=sw) + 22, H - 200
    d.line((ax, ay, ax + 32, ay), fill=MUTED, width=5)
    d.polygon([(ax + 28, ay - 11), (ax + 46, ay), (ax + 28, ay + 11)], fill=MUTED)
    wordmark(d)
    return img

def listslide(tag, s, idx, total):
    img, d, m = base(tag, idx, total)
    tf = font(60, "Bold")
    y = 230
    for ln in wrap(d, s["title"], tf, W - m*2):
        d.text((m, y), ln, font=tf, fill=WHITE, anchor="lm"); y += 74
    y += 40
    itf = font(42, "Medium")
    for it in s["items"]:
        d.ellipse((m, y + 12, m + 18, y + 30), fill=CYAN)
        lines = wrap(d, it, itf, W - m*2 - 50)
        yy = y
        for ln in lines:
            d.text((m + 44, yy), ln, font=itf, fill=WHITE, anchor="lm"); yy += 52
        y = yy + 34
    wordmark(d)
    return img

def take(tag, s, idx, total):
    img, d, m = base(tag, idx, total)
    qf = font(120, "Bold")
    d.text((m, 240), "“", font=qf, fill=CYAN, anchor="lm")
    tf = font(70, "Bold")
    y = 400
    for ln in wrap(d, s["statement"], tf, W - m*2):
        d.text((m, y), ln, font=tf, fill=WHITE, anchor="lm"); y += 88
    if s.get("cta"):
        cf = font(44, "SemiBold")
        d.rounded_rectangle((m, H - 320, W - m, H - 210), radius=20, fill=CYAN)
        d.text((W/2, H - 265), s["cta"], font=cf, fill=DARK, anchor="mm")
    wordmark(d)
    return img

def main():
    spec = json.load(open(sys.argv[1]))
    tag, prefix, slides = spec["tag"], spec["prefix"], spec["slides"]
    total = len(slides)
    for i, s in enumerate(slides, 1):
        t = s["type"]
        if t == "cover":
            img = cover(tag, s, i, total)
        elif t == "list":
            img = listslide(tag, s, i, total)
        else:
            img = take(tag, s, i, total)
        out = f"{prefix}_slide{i}.png"
        img.convert("RGB").save(out)
        print("saved", out)

if __name__ == "__main__":
    main()
