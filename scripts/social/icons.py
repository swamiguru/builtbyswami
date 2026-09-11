#!/usr/bin/env python3
"""Playful brand icons for Long Press cards — colour + glow + sparkles (PIL, no assets).
Public API:
  ACCENT: dict of icon-keyword -> RGB accent colour
  pick(name): returns the shape fn or None (kept for back-compat)
  render(img, name, cx, cy, r): draws the full illustration (glow + tile + icon + sparkles)
     onto an RGBA `img` at centre (cx,cy) with tile half-size r. Returns True if drawn.
"""
import math
from PIL import Image, ImageDraw, ImageFilter

INDIGO = (169, 182, 255)   # #A9B6FF  Long Press on-dark accent
CYAN = INDIGO              # name kept; the brand through-line is now indigo
WHITE = (244, 244, 246)
BG = (23, 23, 28)          # #17171C  matches the card ground
DARK = (16, 16, 20)
PANELC = (34, 34, 42)      # #22222A  icon tile
RING = (58, 58, 70)

# per-story accent colours (icon pops; the brand indigo stays the through-line)
ACCENT = {
    "disc": (96, 165, 250), "gaming": (96, 165, 250), "console": (96, 165, 250), "game": (96, 165, 250),
    "chat": (37, 211, 102), "whatsapp": (37, 211, 102), "message": (37, 211, 102),
    "search": (168, 130, 255), "x": (168, 130, 255),
    "chip": (245, 170, 66), "laptop": (245, 170, 66), "cpu": (245, 170, 66), "processor": (245, 170, 66),
    "incognito": (167, 139, 250), "privacy": (167, 139, 250), "security": (167, 139, 250),
    "phone": INDIGO, "iphone": INDIGO, "android": (52, 211, 153),
    "robot": (94, 234, 212), "ai": (94, 234, 212),
    "tip": (250, 204, 21), "bulb": (250, 204, 21),
    "mail": (234, 120, 60), "email": (234, 120, 60), "gmail": (234, 120, 60),
    "rocket": (251, 146, 60), "space": (251, 146, 60), "isro": (251, 146, 60), "launch": (251, 146, 60),
    "video": (239, 88, 88), "youtube": (239, 88, 88), "creator": (239, 88, 88), "play": (239, 88, 88),
    "watch": (45, 212, 191), "wearable": (45, 212, 191), "smartwatch": (45, 212, 191), "ring": (45, 212, 191),
    "gavel": (232, 121, 249), "legal": (232, 121, 249), "lawsuit": (232, 121, 249), "court": (232, 121, 249), "sued": (232, 121, 249),
    "lock": (52, 211, 153), "passkey": (52, 211, 153), "padlock": (52, 211, 153),
    "music": (244, 114, 182), "audio": (244, 114, 182), "sound": (244, 114, 182), "shazam": (244, 114, 182),
    "doc": (129, 140, 248), "document": (129, 140, 248), "sheet": (129, 140, 248), "workflow": (129, 140, 248), "receipt": (129, 140, 248),
}


def _sparkle(d, x, y, r, col):
    k = r * 0.30
    d.polygon([(x, y-r), (x+k, y-k), (x+r, y), (x+k, y+k),
               (x, y+r), (x-k, y+k), (x-r, y), (x-k, y-k)], fill=col)


def _glow(img, cx, cy, col, r):
    g = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(g).ellipse((cx-r, cy-r, cx+r, cy+r), fill=col + (120,))
    img.alpha_composite(g.filter(ImageFilter.GaussianBlur(70)))


# ---- colour-aware icon shapes ----
def chat(d, cx, cy, s, c):
    w, h = s*1.9, s*1.4
    x0, y0 = cx-w/2, cy-h/2-s*0.15
    d.rounded_rectangle((x0, y0, x0+w, y0+h), radius=int(s*0.42), outline=c, width=11)
    d.polygon([(x0+s*0.55, y0+h-3), (x0+s*0.30, y0+h+s*0.45), (x0+s*1.05, y0+h-3)], fill=c)
    for dx in (-s*0.45, 0, s*0.45):
        d.ellipse((cx+dx-11, y0+h/2-11, cx+dx+11, y0+h/2+11), fill=WHITE)

def disc(d, cx, cy, s, c):
    d.ellipse((cx-s, cy-s, cx+s, cy+s), outline=c, width=12)
    d.ellipse((cx-s*0.6, cy-s*0.6, cx+s*0.6, cy+s*0.6), outline=RING, width=4)
    d.ellipse((cx-s*0.28, cy-s*0.28, cx+s*0.28, cy+s*0.28), outline=c, width=8, fill=BG)
    d.arc((cx-s*0.82, cy-s*0.82, cx+s*0.82, cy+s*0.82), start=205, end=265, fill=WHITE, width=9)

def search(d, cx, cy, s, c):
    r = s*0.72; ox, oy = cx-s*0.22, cy-s*0.22
    d.ellipse((ox-r, oy-r, ox+r, oy+r), outline=c, width=13)
    a = math.radians(45)
    d.line((ox+math.cos(a)*r, oy+math.sin(a)*r, ox+math.cos(a)*(r+s*0.7), oy+math.sin(a)*(r+s*0.7)), fill=c, width=17)

def chip(d, cx, cy, s, c):
    b = s*0.85
    d.rounded_rectangle((cx-b, cy-b, cx+b, cy+b), radius=int(s*0.14), outline=c, width=11)
    ib = s*0.42
    d.rounded_rectangle((cx-ib, cy-ib, cx+ib, cy+ib), radius=int(s*0.10), outline=WHITE, width=6)
    pin = s*0.22
    for i in (-0.5, 0, 0.5):
        px = cx+i*b*1.1
        d.line((px, cy-b, px, cy-b-pin), fill=c, width=10)
        d.line((px, cy+b, px, cy+b+pin), fill=c, width=10)
        py = cy+i*b*1.1
        d.line((cx-b, py, cx-b-pin, py), fill=c, width=10)
        d.line((cx+b, py, cx+b+pin, py), fill=c, width=10)

def incognito(d, cx, cy, s, c):
    d.ellipse((cx-s*1.05, cy-s*0.5, cx+s*1.05, cy-s*0.12), fill=c)
    d.rounded_rectangle((cx-s*0.6, cy-s*0.95, cx+s*0.6, cy-s*0.28), radius=int(s*0.22), fill=c)
    gy, gr = cy+s*0.45, s*0.34
    d.ellipse((cx-s*0.78-gr, gy-gr, cx-s*0.78+gr, gy+gr), outline=WHITE, width=10, fill=BG)
    d.ellipse((cx+s*0.78-gr, gy-gr, cx+s*0.78+gr, gy+gr), outline=WHITE, width=10, fill=BG)
    d.line((cx-s*0.44, gy-4, cx+s*0.44, gy-4), fill=WHITE, width=10)

def phone(d, cx, cy, s, c):
    w, h = s*1.15, s*1.9
    d.rounded_rectangle((cx-w/2, cy-h/2, cx+w/2, cy+h/2), radius=int(s*0.24), outline=c, width=10)
    d.line((cx-s*0.18, cy-h/2+s*0.16, cx+s*0.18, cy-h/2+s*0.16), fill=c, width=8)
    d.ellipse((cx-10, cy+h/2-s*0.22-10, cx+10, cy+h/2-s*0.22+10), fill=c)

def robot(d, cx, cy, s, c):
    d.rounded_rectangle((cx-s*0.85, cy-s*0.55, cx+s*0.85, cy+s*0.75), radius=int(s*0.22), outline=c, width=10)
    d.ellipse((cx-s*0.35-15, cy+s*0.05-15, cx-s*0.35+15, cy+s*0.05+15), fill=c)
    d.ellipse((cx+s*0.35-15, cy+s*0.05-15, cx+s*0.35+15, cy+s*0.05+15), fill=c)
    d.line((cx, cy-s*0.55, cx, cy-s*0.95), fill=c, width=8)
    d.ellipse((cx-11, cy-s*1.02-11, cx+11, cy-s*1.02+11), fill=c)

def bulb(d, cx, cy, s, c):
    d.ellipse((cx-s*0.7, cy-s*0.9, cx+s*0.7, cy+s*0.5), outline=c, width=11)
    d.rounded_rectangle((cx-s*0.3, cy+s*0.42, cx+s*0.3, cy+s*0.8), radius=6, outline=c, width=9)

def mail(d, cx, cy, s, c):
    w, h = s*1.7, s*1.2
    x0, y0 = cx-w/2, cy-h/2
    d.rounded_rectangle((x0, y0, x0+w, y0+h), radius=int(s*0.12), outline=c, width=10)
    d.line((x0+8, y0+10, cx, cy+s*0.12), fill=c, width=9, joint="curve")
    d.line((x0+w-8, y0+10, cx, cy+s*0.12), fill=c, width=9, joint="curve")

def rocket(d, cx, cy, s, c):
    bw = s*0.55
    d.rounded_rectangle((cx-bw, cy-s*0.45, cx+bw, cy+s*0.7), radius=int(bw), outline=c, width=10)
    d.line([(cx-bw, cy-s*0.3), (cx, cy-s*1.05), (cx+bw, cy-s*0.3)], fill=c, width=10, joint="curve")
    d.ellipse((cx-s*0.2, cy-s*0.28, cx+s*0.2, cy+s*0.12), outline=c, width=8)
    d.line([(cx-bw, cy+s*0.28), (cx-bw-s*0.35, cy+s*0.78), (cx-bw+2, cy+s*0.68)], fill=c, width=10, joint="curve")
    d.line([(cx+bw, cy+s*0.28), (cx+bw+s*0.35, cy+s*0.78), (cx+bw-2, cy+s*0.68)], fill=c, width=10, joint="curve")
    d.polygon([(cx-s*0.18, cy+s*0.72), (cx, cy+s*1.08), (cx+s*0.18, cy+s*0.72)], fill=CYAN)

def video(d, cx, cy, s, c):
    b = s*0.82
    d.rounded_rectangle((cx-b, cy-b*0.72, cx+b, cy+b*0.72), radius=int(s*0.22), outline=c, width=11)
    t = s*0.34
    d.polygon([(cx-t*0.5, cy-t), (cx-t*0.5, cy+t), (cx+t, cy)], fill=c)

def watch(d, cx, cy, s, c):
    fw = s*0.62
    d.rounded_rectangle((cx-fw, cy-s*1.0, cx+fw, cy-fw*0.7), radius=8, fill=c)
    d.rounded_rectangle((cx-fw, cy+fw*0.7, cx+fw, cy+s*1.0), radius=8, fill=c)
    d.rounded_rectangle((cx-s*0.72, cy-s*0.72, cx+s*0.72, cy+s*0.72), radius=int(s*0.28), outline=c, width=11, fill=BG)
    d.ellipse((cx-6, cy-6, cx+6, cy+6), fill=c)
    d.line((cx, cy, cx, cy-s*0.4), fill=WHITE, width=7)
    d.line((cx, cy, cx+s*0.3, cy), fill=WHITE, width=7)

def gavel(d, cx, cy, s, c):
    d.rounded_rectangle((cx-s*0.62, cy-s*0.92, cx+s*0.62, cy-s*0.5), radius=int(s*0.12), outline=c, width=11)
    d.line((cx-s*0.3, cy-s*0.92, cx-s*0.3, cy-s*0.5), fill=c, width=9)
    d.line((cx+s*0.3, cy-s*0.92, cx+s*0.3, cy-s*0.5), fill=c, width=9)
    d.line((cx, cy-s*0.5, cx, cy+s*0.45), fill=c, width=12)
    d.rounded_rectangle((cx-s*0.75, cy+s*0.5, cx+s*0.75, cy+s*0.78), radius=int(s*0.12), fill=c)

def lock(d, cx, cy, s, c):
    d.arc((cx-s*0.45, cy-s*0.95, cx+s*0.45, cy-s*0.12), start=180, end=360, fill=c, width=12)
    d.rounded_rectangle((cx-s*0.62, cy-s*0.32, cx+s*0.62, cy+s*0.78), radius=int(s*0.18), outline=c, width=11)
    d.ellipse((cx-s*0.13, cy+s*0.04, cx+s*0.13, cy+s*0.3), fill=c)
    d.line((cx, cy+s*0.22, cx, cy+s*0.52), fill=c, width=9)

def music(d, cx, cy, s, c):
    d.ellipse((cx-s*0.72, cy+s*0.24, cx-s*0.3, cy+s*0.64), fill=c)
    d.ellipse((cx+s*0.18, cy+s*0.02, cx+s*0.6, cy+s*0.42), fill=c)
    d.line((cx-s*0.31, cy+s*0.44, cx-s*0.31, cy-s*0.62), fill=c, width=9)
    d.line((cx+s*0.59, cy+s*0.22, cx+s*0.59, cy-s*0.82), fill=c, width=9)
    d.line((cx-s*0.31, cy-s*0.62, cx+s*0.59, cy-s*0.82), fill=c, width=13)

def doc(d, cx, cy, s, c):
    w, h = s*1.1, s*1.5
    d.rounded_rectangle((cx-w/2, cy-h/2, cx+w/2, cy+h/2), radius=int(s*0.12), outline=c, width=10)
    for ly in (-0.28, -0.08, 0.12, 0.32):
        d.line((cx-w/2+s*0.22, cy+h*ly, cx+w/2-s*0.22, cy+h*ly), fill=c, width=7)

SHAPES = {
    "chat": chat, "whatsapp": chat, "message": chat,
    "disc": disc, "playstation": disc, "gaming": disc, "game": disc, "console": disc,
    "search": search, "x": search,
    "chip": chip, "laptop": chip, "cpu": chip, "processor": chip,
    "incognito": incognito, "privacy": incognito, "security": incognito,
    "phone": phone, "iphone": phone, "android": phone,
    "robot": robot, "ai": robot,
    "tip": bulb, "bulb": bulb,
    "mail": mail, "email": mail, "gmail": mail,
    "rocket": rocket, "space": rocket, "isro": rocket, "launch": rocket,
    "video": video, "youtube": video, "creator": video, "play": video,
    "watch": watch, "wearable": watch, "smartwatch": watch, "ring": watch,
    "gavel": gavel, "legal": gavel, "lawsuit": gavel, "court": gavel, "sued": gavel,
    "lock": lock, "passkey": lock, "padlock": lock,
    "music": music, "audio": music, "sound": music, "shazam": music,
    "doc": doc, "document": doc, "sheet": doc, "workflow": doc, "receipt": doc,
}


def pick(name):
    return SHAPES.get((name or "").lower())


def render(img, name, cx, cy, r):
    """Draw glow + tile + colour icon + sparkles onto RGBA img. Returns True if drawn."""
    fn = SHAPES.get((name or "").lower())
    if not fn:
        return False
    c = ACCENT.get((name or "").lower(), CYAN)
    _glow(img, cx, cy, c, r + 55)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((cx-r, cy-r, cx+r, cy+r), radius=int(r*0.30), fill=PANELC, outline=RING, width=3)
    fn(d, cx, cy, int(r*0.62), c)
    _sparkle(d, cx-r+18, cy-r+8, 26, CYAN)
    _sparkle(d, cx+r-6, int(cy-r*0.15), 17, WHITE)
    _sparkle(d, int(cx-r*0.2), cy+r-2, 14, c)
    d.ellipse((cx+r-30, cy+r-30, cx+r-14, cy+r-14), fill=CYAN)
    return True


# back-compat: panel() used by older callers
def panel(d, cx, cy, r):
    d.rounded_rectangle((cx-r, cy-r, cx+r, cy+r), radius=int(r*0.30), fill=PANELC, outline=RING, width=3)
