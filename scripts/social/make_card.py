#!/usr/bin/env python3
"""Long Press card generator (longpress.news).
Usage: python3 make_card.py "<PILLAR>" "<HOOK>" "<SUBTITLE or ''>" <out.png> [hook|ig|news]
"""
import base64, glob, json, os, sys, urllib.error, urllib.request
from PIL import Image, ImageDraw, ImageFont
try:
    import icons as _icons
except Exception:
    _icons = None

# --- AI illustration (13 Sept) ------------------------------------------
# Per-story illustration via Gemini image gen, replacing the small drawn
# icon with something that actually depicts the story. Two files come out
# of every card: card_N.png (this card, headline baked in, for social) and
# illustration_N.png beside it (same picture alone, no headline -- that one
# is what the LONG PRESS SITE shows, since the site already renders the
# real headline as text and a second copy baked into the picture is just
# redundant there). import-roundup.mjs on the longpress side looks for
# illustration_N.png next to each card_N.png and prefers it; nothing on
# this side has to know that -- it is purely a naming convention.
#
# Never let this block a publish: no key, a network hiccup, or a slow
# response all just fall through to the old drawn icon (draw_icon below).
_GEMINI_MODEL = "gemini-3-pro-image-preview"  # "Nano Banana Pro"
_GEMINI_TIMEOUT = 25  # seconds -- the daily run is already tight against 10:00 IST

def _load_env_file():
    """Pick up GEMINI_API_KEY from a .env file, no dotenv dependency needed
    for one line. Checks the repo root and this script's own directory;
    real environment variables always win (setdefault), this only fills a
    gap. Whatever invokes this script (the daily task, a manual run, CI)
    doesn't need to know or set anything -- it's picked up automatically."""
    here = os.path.dirname(os.path.abspath(__file__))
    for path in (os.path.join(here, "..", "..", ".env"), os.path.join(here, ".env")):
        if not os.path.exists(path):
            continue
        for line in open(path):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

_load_env_file()

def _illustration_path(out):
    """card_3.png -> illustration_3.png, same folder. Falls back to a
    generic name if `out` doesn't match the card_N.png convention (e.g. a
    one-off manual call) so this never raises."""
    d, base = os.path.split(out)
    if base.startswith("card_") and base.endswith(".png"):
        return os.path.join(d, "illustration_" + base[len("card_"):])
    return os.path.join(d, "illustration_" + base)

def generate_illustration(pillar, hook, sub, illus_path):
    """Write a full-bleed, on-brand, text-free illustration for this story
    to illus_path. Returns True on success, False on ANY failure (missing
    key, network error, bad response, timeout) -- callers must treat False
    as "no illustration available" and fall back, never raise."""
    if os.path.exists(illus_path):
        return True  # already made this run/day -- don't re-spend the call
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return False
    story = f"{pillar}: {hook}" + (f" -- {sub}" if sub else "")
    prompt = f"""Flat vector editorial illustration, square, filling the
entire frame edge to edge with a solid flat background color of exactly
#17182E (a dark midnight navy) -- no vignette, no gradient, no border, no
card, no panel, no rounded rectangle, no glow, no checkerboard, no
transparency. The background must be one single flat opaque color from
edge to edge.

Invent one clear visual metaphor for this tech news story, centered with
generous padding, rendered only in thin clean line art. Story: {story}

Do not depict any real person, real company logo, brand mark, wordmark, or
any text or letters anywhere in the image -- use abstract or symbolic
objects instead of literal logos or trademarks.

Line art and accent colors only, background stays pure #17182E: use warm
cream #F4F1E8 for the main linework, orange #E0552B as the primary accent,
and muted teal #3E7C74 as a rare secondary accent. Minimal geometric style,
no photorealism, no drop shadow, no extra background shapes of any kind.
"""
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }).encode()
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{_GEMINI_MODEL}:generateContent?key={api_key}")
    req = urllib.request.Request(url, data=body,
                                  headers={"Content-Type": "application/json"},
                                  method="POST")
    try:
        with urllib.request.urlopen(req, timeout=_GEMINI_TIMEOUT) as resp:
            data = json.load(resp)
        for cand in data.get("candidates", []):
            for part in cand.get("content", {}).get("parts", []):
                inline = part.get("inlineData")
                if inline and inline.get("data"):
                    with open(illus_path, "wb") as f:
                        f.write(base64.b64decode(inline["data"]))
                    return True
    except Exception as e:
        print(f"illustration: skipped ({e})", file=sys.stderr)
    return False

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

def draw_illustration(img, illus_path, W, H, text_bottom, margin):
    """Paste the generated illustration bottom-right, sized to whatever
    vertical space is actually left below the headline/subtitle -- so a
    long three-line headline gets a smaller picture instead of colliding
    with it, and a short one-line headline gets a bigger one."""
    wordmark_top = H - 78 - 34
    avail = wordmark_top - text_bottom - 24
    size = max(0, min(560, avail, W - margin * 2))
    if size < 220:
        return False  # too little room left to be worth showing at all
    illus = Image.open(illus_path).convert("RGB").resize((size, size), Image.LANCZOS)
    x = W - margin - size
    y = wordmark_top - size
    img.paste(illus, (x, y))
    return True

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
    illus_path = _illustration_path(out)
    used_illustration = False
    if generate_illustration(pillar, hook, sub, illus_path):
        used_illustration = draw_illustration(img, illus_path, W, H, y, margin)
    if not used_illustration:
        draw_icon(img, icon, W, H)
    wordmark(ImageDraw.Draw(img), W, H)
    img.convert("RGB").save(out)
    print("saved", out, "(illustration)" if used_illustration else "(icon fallback)")

if __name__ == "__main__":
    pillar = sys.argv[1]
    hook = sys.argv[2]
    sub = sys.argv[3] if len(sys.argv) > 3 else ""
    out = sys.argv[4] if len(sys.argv) > 4 else "card.png"
    mode = sys.argv[5] if len(sys.argv) > 5 else "news"
    icon = sys.argv[6] if len(sys.argv) > 6 else None
    make(pillar, hook, sub, out, mode, icon)
