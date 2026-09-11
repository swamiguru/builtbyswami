# Card fonts

Long Press uses **Schibsted Grotesk** on longpress.news. The card generator
looks here first, so drop the static TTFs in this folder and the cards match
the site:

    SchibstedGrotesk-Regular.ttf
    SchibstedGrotesk-Medium.ttf
    SchibstedGrotesk-SemiBold.ttf
    SchibstedGrotesk-Bold.ttf

Get them from https://fonts.google.com/specimen/Schibsted+Grotesk
(Download family → the `static/` folder inside the zip).

Without them the generator falls back to Poppins, then DejaVu. It never fails
on a missing font — it just stops looking like the site.
