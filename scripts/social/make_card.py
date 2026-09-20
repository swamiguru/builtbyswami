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
# 15 Sept: 25s was too tight -- a plain manual call measured ~20s with a
# quiet machine, so any extra load (a background macOS/Xcode update was
# running during the 15 Sept task) or the preview model's normal jitter
# pushes it over. That silently loses the illustration for the day and
# the site falls back to showing the headline-baked social card instead --
# not a crash, just the wrong image, so nothing surfaced it. Widened to 45s
# and given one retry (see generate_illustration) rather than trusting a
# single tight attempt.
_GEMINI_TIMEOUT = 45  # seconds per attempt
_GEMINI_ATTEMPTS = 3

def _load_env_file():
    """Pick up GEMINI_API_KEY from a .env file, no dotenv dependency needed
    for one line. Checks the repo root and this script's own directory;
    real environment variables always win (setdefault), this only fills a
    gap. Whatever invokes this script (the daily task, a manual run, CI)
    doesn't need to know or set anything -- it's picked up automatically."""
    here = os.path.dirname(os.path.abspath(__file__))
    for path in (os.path.join(here, "..", "..", ".env"), os.path.join(here, ".env"),
                 "/Users/masterswami/Documents/GitHub/Builtbyswami/.env"):
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

# Verge/WIRED-style playful palette: one bold saturated field per card, a
# high-contrast accent, black + off-white linework. Rotated per story so the
# daily five feel varied; picked deterministically from the story text so a
# retry keeps the same colour. Brand orange/teal ride along as anchors.
_PALETTE = [
    ("#C6F135", "#7C3AED"),  # lime + violet
    ("#8B5CF6", "#FFE14C"),  # electric violet + acid yellow
    ("#29D3E6", "#FF5C39"),  # cyan + hot coral
    ("#FF5C39", "#17182E"),  # hot coral + midnight
    ("#F5E14C", "#111111"),  # acid yellow + black
    ("#E0552B", "#17182E"),  # brand orange + midnight
    ("#1FA89A", "#FFE14C"),  # brand teal + yellow
    ("#FF7AB6", "#111111"),  # hot pink + black
]

def _pick_palette(seed):
    import hashlib
    h = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    return _PALETTE[h % len(_PALETTE)]

def _has_text(path):
    """True if the illustration contains real lettering. Gemini sometimes
    ignores "no text" and bakes in gibberish words; catch it with tesseract
    (CLI) so the caller can retry. Best-effort: if OCR is unavailable or
    errors, return False -- never block a publish."""
    import subprocess, re
    for binp in ("/opt/homebrew/bin/tesseract", "tesseract"):
        try:
            out = subprocess.run([binp, path, "stdout", "--psm", "11"],
                                 capture_output=True, text=True, timeout=20)
            return bool(re.search(r"[A-Za-z]{3,}", out.stdout or ""))
        except FileNotFoundError:
            continue
        except Exception:
            return False
    return False

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
    bg, accent = _pick_palette(pillar + "|" + hook)
    prompt = f"""Bold, playful editorial tech illustration in the style of
The Verge and WIRED magazine spot art. Square, full-bleed, filling the
entire frame edge to edge.

Background: ONE single flat, saturated, opaque color -- {bg} -- absolutely
no gradient, vignette, border, panel or rounded card. One flat colour,
edge to edge.

Subject: invent ONE witty, clear visual metaphor for this tech story,
drawn BIG and bold as a flat vector filling about 75 percent of the frame:
{story}. Thick confident black outlines, bold flat fills using {accent}
and off-white #F7F5EE, very high contrast, minimal geometric shapes, a
little personality and humour -- like a magazine spot illustration.

Signature motif: a scattered black-and-white checkerboard / pixel-dither
block pattern creeping in from one or two corners, plus a few tiny
geometric confetti shapes (dots, plus signs, small triangles) around the
subject.

ABSOLUTELY NO text of any kind anywhere: no words, no letters, no numbers,
no captions, no labels, no gibberish lettering, no signage, no lettered
keyboard keys. Do not write anything. Also no real people, no real company
logos, no brand marks or wordmarks -- use abstract or symbolic objects
instead. Flat vector only -- no photorealism, no drop shadows, no 3D.
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
    # One retry: a timeout or a hiccup on attempt 1 is common enough for a
    # preview model that it isn't worth losing the day's illustration over.
    # Still never raises -- callers must keep treating False as "no
    # illustration available" and fall back to the drawn icon.
    for attempt in range(1, _GEMINI_ATTEMPTS + 1):
        try:
            with urllib.request.urlopen(req, timeout=_GEMINI_TIMEOUT) as resp:
                data = json.load(resp)
            img_bytes = None
            for cand in data.get("candidates", []):
                for part in cand.get("content", {}).get("parts", []):
                    inline = part.get("inlineData")
                    if inline and inline.get("data"):
                        img_bytes = base64.b64decode(inline["data"])
                        break
                if img_bytes:
                    break
            if not img_bytes:
                print(f"illustration: attempt {attempt} had no image data", file=sys.stderr)
                continue
            with open(illus_path, "wb") as f:
                f.write(img_bytes)
            _tighten_illustration(illus_path)
            # Gemini occasionally bakes in stray/gibberish text despite the
            # prompt. If so, retry (unless this was the last attempt -- a
            # slightly-lettered illustration still beats none).
            if _has_text(illus_path) and attempt < _GEMINI_ATTEMPTS:
                print(f"illustration: attempt {attempt} showed stray text, retrying", file=sys.stderr)
                continue
            return True
        except Exception as e:
            print(f"illustration: attempt {attempt} failed ({e})", file=sys.stderr)
    return False

def _tighten_illustration(path, margin_frac=0.12, thresh=28):
    """Gemini's framing drifts run to run -- 13 Sept shipped illustrations
    as small as ~48% of the canvas even after asking for "generous padding"
    (the prompt wording that used to sit above). Rather than trust wording
    alone, always re-crop to the artwork's own bounding box afterward: find
    where pixels differ from the sampled background, square up around that
    box with a small margin, and rescale back to the original canvas size.
    No numpy on this Mac, so this stays pure Pillow. Never raises -- a
    detection miss just leaves the original image in place."""
    try:
        from PIL import ImageChops
        im = Image.open(path).convert("RGB")
        w, h = im.size

        def sample_bg():
            px = []
            for x in range(0, w, 8):
                px.append(im.getpixel((x, 0)))
                px.append(im.getpixel((x, h - 1)))
            for y in range(0, h, 8):
                px.append(im.getpixel((0, y)))
                px.append(im.getpixel((w - 1, y)))
            r = sum(p[0] for p in px) / len(px)
            g = sum(p[1] for p in px) / len(px)
            b = sum(p[2] for p in px) / len(px)
            return (round(r), round(g), round(b))

        bg = sample_bg()
        diff = ImageChops.difference(im, Image.new("RGB", (w, h), bg))
        bbox = diff.convert("L").point(lambda p: 255 if p > thresh else 0).getbbox()
        if not bbox:
            return
        left, top, right, bottom = bbox
        bbw, bbh = right - left, bottom - top
        # Already filling the frame -- leave it alone rather than upscale noise.
        if bbw >= w * 0.85 and bbh >= h * 0.85:
            return
        cx, cy = (left + right) / 2, (top + bottom) / 2
        half = max(bbw, bbh) * (1 + margin_frac) / 2
        nl, nt, nr, nb = cx - half, cy - half, cx + half, cy + half
        pad_l, pad_t = max(0, -nl), max(0, -nt)
        pad_r, pad_b = max(0, nr - w), max(0, nb - h)
        work = im
        if pad_l or pad_t or pad_r or pad_b:
            canvas = Image.new("RGB", (w + int(round(pad_l + pad_r)), h + int(round(pad_t + pad_b))), bg)
            canvas.paste(im, (int(round(pad_l)), int(round(pad_t))))
            work = canvas
            nl, nr, nt, nb = nl + pad_l, nr + pad_l, nt + pad_t, nb + pad_t
        crop = work.crop((int(round(nl)), int(round(nt)), int(round(nr)), int(round(nb))))
        crop.resize((w, h), Image.LANCZOS).save(path)
    except Exception as e:
        print(f"illustration: tighten skipped ({e})", file=sys.stderr)

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

_SITE_REPO = "/Users/masterswami/Documents/GitHub/Builtbyswami"

def _publish_site_illustration(out, illus_path):
    """The daily task writes social cards to a temp outputs folder as
    card_<N>_hook_<DATE>.png and separately copies card_<N>.png into the
    repo's public/social/<DATE>/ for the Long Press site, which prefers a
    text-free illustration_<N>.png next to it. That copy step only moves the
    card, not the illustration, so the site kept falling back to the
    headline-baked card. Mirror the illustration into the same repo folder
    here; STEP 7d's `git add public/social` then commits it. Best-effort:
    never raise, skip quietly if anything is off (e.g. a one-off manual run
    whose filename doesn't match the card_<N>_hook_<DATE> convention)."""
    import re as _re, shutil as _shutil
    try:
        m = _re.match(r"card_(\d+)_hook_(\d{4}-\d{2}-\d{2})\.png$",
                      os.path.basename(out))
        if not m or not os.path.exists(illus_path):
            return
        n, date = m.group(1), m.group(2)
        if not os.path.isdir(os.path.join(_SITE_REPO, "public", "social")):
            return
        dest_dir = os.path.join(_SITE_REPO, "public", "social", date)
        os.makedirs(dest_dir, exist_ok=True)
        _shutil.copyfile(illus_path, os.path.join(dest_dir, "illustration_%s.png" % n))
    except Exception:
        pass

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
        if used_illustration:
            _publish_site_illustration(out, illus_path)
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
