Every CMS migration I've worked on was sold internally as a platform project. The business case has three lines: license, build, data move. That number is real, and it's the smallest number in the whole exercise.

I've led this work across five global brands over about six years. Vogue, GQ, Wired and Architectural Digest at Condé Nast. Newsweek before that, on properties doing 50 million monthly uniques. At Metro International I scoped and shipped a CMS from scratch in three months. GQ's front-end replatform ran across ten properties, on an upgraded CMS. Condé Nast Traveller's Spain and LATAM sites were consolidated onto one Spanish-language platform serving 56.6 million uniques.

Every one of them dipped slightly at cutover and was back to prior levels inside a week. Ad and consent integrations broke in a handful of markets and took a day or two to close. That's the outcome you're actually buying. It isn't the thing the business case is priced against.

## The costs that don't make the deck

**Your editorial team gets slower, and nobody budgets for it.** Every writer and editor has a way of working that's been tuned over years. Where the image crop lives, which field the standfirst goes in, the keyboard path from draft to publish. A new CMS resets all of that on day one. Output doesn't stop, but it drops, and it stays down while people rebuild their habits. If you're a daily publisher, that's the real bill. It shows up as missed slots and later publish times, so nobody ever writes it down as a cost.

**The redirect map is a content job, not an engineering one.** Engineering can move a URL. Engineering cannot tell you that four hundred of your old URLs are tag pages that ranked by accident, that two hundred more are legacy microsites nobody remembers commissioning, or that one of them is a 2014 gift guide still pulling traffic every December. Somebody who knows the archive has to sit with that list. On the migrations I've run, this is the single largest predictor of whether traffic holds. It's also the task most likely to get pushed to the last fortnight because it looks like cleanup.

**Ad and commerce integrations break quietly.** A broken template is loud. A slot that renders but stops passing the right key values is silent, and it fails in the direction of less revenue. Same for affiliate links, consent, and anything that fires on page view. Staging won't catch most of it, because staging doesn't carry real demand. You find these in the first week of live traffic, which means somebody senior has to be watching revenue per page rather than uptime.

## What I got wrong

I ran the same program three times at Condé Nast. Five titles into the GCC, across three waves and three years. It wasn't until the third one that I sat down and audited the first two for friction, then automated the repeatable parts and rebuilt content placement using audience data from the previous launch. That wave shipped in half the time of the first with the same five-person team, and lifted ad revenue per visit about 11%.

The uncomfortable part is the timing. All of that was available to me after wave one. I had the data and I didn't stop to look at it, because wave two was already scheduled and the fastest-looking path was to run the same play again. Two launches went out slower than they needed to, and the reason was that reviewing the last one felt like a delay rather than work.

If you're on your second migration and you haven't done a proper post-mortem on the first, that's the cheapest thing on your list right now.

## What I'd do differently

- Put a named editor on the redirect map from week one, not an engineer, and give them the traffic data. Treat it as an editorial deliverable with a person's name against it.
- Price the throughput dip openly. Tell the newsroom what publishing volume you expect in the first month after cutover, agree it beforehand, and staff for it. It goes badly when nobody said it would happen.
- Instrument revenue per page before the cutover, not after. If you don't have a clean pre-migration baseline, you can't tell a real drop from a normal week, and you'll spend the first fortnight arguing about it instead of fixing it.
- Cut over in waves if the brand structure allows it. One title, or one market, ahead of the rest. The first one is where you find the problems, and it's much better to find them on the smallest property you own.

## The part that's actually hard

None of this is technically difficult. Content modeling, taxonomy, redirects, integrations, editorial workflow on the far side. It's all well-understood work. What makes migrations go wrong is that the decisions belong to people who don't sit together: editorial owns the archive, engineering owns the URLs, commercial owns the ad stack, and SEO owns the outcome everyone is judged on. The migration is the first time anyone forces those four into the same sequence.

Getting that sequence right is most of the work, and it has very little to do with which platform you picked.

If you're planning one: do you have a single person who can say what the archive is worth, page by page? On the migrations that went well, we did. On the ones that took longer than they should have, that question had four different owners and no answer.
