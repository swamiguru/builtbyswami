Every replatform is sold internally as a platform project. License, build, data move. That number is real and it is the smallest number in the exercise.

I've done this thirteen times across four brands and eight years. One of those was building the platform myself. One was a full CMS and front-end rebuild on a site doing fifty million monthly uniques. Ten were the same front end shipped into ten different markets, one market at a time. The last one folded two regions into a single property.

None of them lost their search traffic. All of them dipped a little on the way through.

## The four

| | When | What it was | Scope | Team | Elapsed |
|---|---|---|---|---|---|
| metro.us | 2017 | CMS built from scratch, site migrated onto it | 1 property | — | 3 months |
| Newsweek | 2020 | New CMS and new front end | 1 property, 50M+ monthly uniques | 2 engineers, 1 design lead, me on product | 2.5 months |
| GQ | 2021–22 | New front end on an upgraded CMS | 10 markets | 4 engineers, 1 design lead, me on product | ~1 month per market |
| Condé Nast Traveller | 2025 | New instance, new front end, two regions merged into one | Spain and LatAm, one Spanish property | 4 engineers, 1 design lead, me on product | 3 months |

Worth being precise about the middle two, because people use "migration" loosely and it matters here. Newsweek was a genuine CMS swap. GQ was not. GQ stayed on the same CMS, upgraded, and what actually moved was the front end, across ten markets: UK, France, Spain, Germany, Italy, Russia, India, Japan, Taiwan and Mexico.

## What makes this hard

Not the platform. The platform is the part with a vendor, a budget line and someone whose job it is.

The hard part is that a live publisher has about fifteen things attached to it that nobody thinks of as part of the migration. Ad stack. Consent. Affiliate links. Newsletters. Subscription state. Recommendation modules. Search Console. Tag manager. Every one of them fires on page view, every one of them belongs to a different team, and every one of them fails quietly rather than loudly.

Then multiply by markets. Ten markets means ten ad configurations, ten consent regimes, ten sets of editorial habits and ten separate opportunities to find out that something you assumed was global was actually configured per site five years ago by someone who has left.

That is the whole job. The CMS is the easy part.

## What I did

**Sequenced deliberately, smallest first.** Ten markets, roughly one a month. The order came from capacity and readiness, not from importance, and the first one out was a low-risk market on purpose. Whatever you have got wrong, you get it wrong once, in the place where it costs least. Every market after that inherits the fix.

**Ran SEO audits before and after each one.** Technical SEO specialists, pre-migration and post-migration, per market. Not a single audit at the end of the programme. The point of doing it per market is that market three benefits from what market two taught you, and by market eight the audit is mostly confirming things you already handled.

**Kept a rollback plan.** Never used it on any of the four. That is not the same as not needing it. What it buys you is the ability to go live on a Tuesday instead of arguing for three more weeks of testing, because the downside is bounded.

**Treated the newsroom as the actual project.** Pre-training before cutover, written documentation, parallel running on the old and new systems, sitting with editors through the first big story on the new front end, and two weeks of hands-on support after launch. Every migration plan I have seen budgets for engineering and assumes editorial will adapt. Editorial is where the schedule actually goes.

## What broke

Some of the GQ markets went live with broken ad slots. Unfilled inventory, which is lost revenue for as long as it runs.

Consent handling behaved incorrectly in some European markets. Both were found and corrected within a day or two, which is fast, and both should have been caught before launch, which is the honest way to say it. Staging does not carry real ad demand and it does not carry real consent traffic, so a class of problem exists that you can only find in production. Knowing that in advance means somebody senior watches revenue per page in the first week rather than watching uptime.

The pattern across all four is the same. Nothing broke loudly. Nothing 500'd. Templates rendered, pages loaded, and revenue quietly came in lower until someone went looking.

## What changed between 2017 and 2025

Repetition is what changed. Not experience, exactly. Repetition.

Doing a migration once teaches you very little you can carry. You solve the problems in front of you, you ship, and most of what you learned stays stuck to that specific property. metro.us in 2017 and Newsweek in 2020 were both like that. One site each, three years apart, and by the time the second one came round I was mostly re-deriving things I had already worked out.

Ten markets back to back is different, because you cannot hold ten markets in your head. Somewhere around the third GQ market it stops being possible to run it on memory and judgement, and you are forced to write down what you actually do. That is an unglamorous reason to develop a method, and it is the real one.

So by 2025 the first thing I build is not a project plan. It is a document that names every cross-functional team touching the property, what each one does before cutover, what each one checks afterwards, and who by name is accountable for each item. Ad ops, consent, SEO, newsletters, subscriptions, analytics, editorial. Sequenced, dated, owned.

It is a boring document and it is most of the method. Every expensive surprise I have had in eight years was something that had nobody's name against it.

## What actually happened to the traffic

| | |
|---|---|
| Organic at cutover | Slight dip on every one |
| Time to recover prior levels | About a week |
| SEO issues found post-launch | Closed within a week |
| Ad and consent breakages | Some GQ markets, fixed in a day or two |
| Rollbacks used | None |

I want to be careful with this table, because the version of it that would sell better is not true. I have seen "zero SEO impact" on plenty of consultant pages. What happens in reality is that you dip, and then you come back, and the thing that determines whether you come back is how much work went into the redirect map and the pre-launch audit.

If someone tells you their migrations have no organic impact at all, they either did not measure or are not telling you.

## The four things that decide whether it goes well

**Somebody who knows the archive owns the redirect map.** Not an engineer. Engineering can move a URL. Engineering cannot tell you that two hundred of your old URLs are tag pages that ranked by accident, or that one of them is a 2014 gift guide that still pulls traffic every December. This is an editorial job with a person's name on it, and it is the single biggest predictor of whether traffic holds.

**Every integration that fires on page view has a named owner and a check for after launch.** Ads, consent, affiliate, newsletters, subscription state, analytics. Not a list of systems. A list of people.

**The first property out is the smallest one, and nothing else ships until it is clean.** You are going to get something wrong. Decide in advance where it costs least.

**The newsroom is a workstream, not a comms afterthought.** Budget training, documentation, parallel running and a fortnight of hands-on support after launch. Output drops while people rebuild habits they spent years forming. It drops whether or not you planned for it. Planning for it is cheaper.

---

*Thirteen properties, four brands, eight years. If you are looking at a replatform and want an outside read before you commit, that is what the migration readiness engagement is for.*
