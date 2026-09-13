# Card fonts

Long Press uses **Archivo** (display) and **Public Sans** (body) on
longpress.news — see `--display` / `--body` in the site's
`src/styles/global.css`. The card generator looks here first, so the
static TTFs live in this folder, matching the site:

    Archivo-Regular.ttf
    Archivo-Medium.ttf
    Archivo-SemiBold.ttf
    Archivo-Bold.ttf
    Archivo-ExtraBold.ttf
    PublicSans-Regular.ttf
    PublicSans-Medium.ttf
    PublicSans-SemiBold.ttf
    PublicSans-Bold.ttf

Get static instances from Google Fonts' css2 API (variable-font families
like Archivo don't ship static files in the google/fonts source repo):

    curl -s -A "Mozilla/4.0" \
      "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap"

...then download each `src: url(...)` it prints.

This folder previously named Schibsted Grotesk, and the generator's own
FONT_STACK separately named Bricolage Grotesque / Poppins — both stale,
neither matching global.css, and neither ever actually present here (no
google-fonts dir on this Mac, no /usr/share DejaVu - those are Linux
paths). Every card silently fell through to Pillow's built-in
`ImageFont.load_default()`, which is why headlines rendered tiny and
curly quotes/em dashes rendered as boxes. Fixed 13 Sept 2026 - if the
site's global.css --display/--body ever change, update both this
folder and FONT_STACK in make_card.py and carousel.py together.

The generator never *fails* on a missing font — it just quietly stops
looking like the site again. Verify after any font change by actually
opening a generated card, not just checking the script ran.
