#!/usr/bin/env python3
"""Long Press carousel generator (4:5, 1080x1350).
Usage: python3 carousel.py spec.json
spec: {"tag","prefix","slides":[{type:cover|list|take,...}]}
"""
import os, sys, json
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
W, H = 1080, 1350

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

def base(tag, idx, total):
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, 10), fill=CYAN)
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
    # the held-key mark: a rounded square, not a dot
    d.rounded_rectangle((80, y - 6, 80 + 30, y + 24), radius=9, fill=INDIGO)
    d.text((122, y + 9), HANDLE, font=fnt, fill=PAPER, anchor="lm")

def cover(tag, s, idx, total):
    img, d, m = base(tag, idx, total)
    tf = font(96, "Bold")
    lines = wrap(d, s["title"], tf, W - m*2)
    y = 430
    for ln in lines:
        d.text((m, y), ln, font=tf, fill=WHITE, anchor="lm"); y += 116
    if s.get("sub"):
        sf = font(44, "Medium")
        y += 24
        for ln in wrap(d, s["sub"], sf, W - m*2):
            d.text((m, y), ln, font=sf, fill=CYAN, anchor="lm"); y += 58
    icon = s.get("icon")
    if _icons and icon:
        _icons.render(img, icon, W - 250, H - 470, 180)
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
