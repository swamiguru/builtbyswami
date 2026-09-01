/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * One title and description per static route, read by both sides of the SPA's
 * metadata story:
 *
 *   - scripts/prerender-meta.mjs, which bakes them into the route shells that
 *     crawlers and social cards actually see;
 *   - the pages themselves, which set document.title on mount for the visitor.
 *
 * They used to be written twice, independently, with nothing tying them
 * together. They drifted: /about served "Product Builder Portfolio" to Google
 * and "Senior Product Leader & AI-Native Product Builder" to the reader, with
 * two different descriptions, and /tech-roundup disagreed on its title too.
 * Nobody would ever notice, because you have to view source to see it.
 *
 * This file is .mjs rather than .ts so Node can import it directly in the
 * build script and Vite can import it from .tsx. Adding a route means adding
 * it here once.
 *
 * Content-driven routes (individual notes, roundup issues, the case study)
 * derive their metadata from the content itself and aren't listed here.
 */

/**
 * @typedef {{ title: string, description: string }} PageSeo
 * @type {Record<string, PageSeo>}
 */
export const PAGE_SEO = {
  home: {
    title: "The Daily Tech Roundup: Tech News + AI Builds | Swami Guru",
    description:
      "Product consulting for publishers and content-driven teams, from ex-Condé Nast product lead Swami Guru — plus a daily five-story tech and AI roundup.",
  },
  about: {
    title: "Swami Guru | Senior Product Leader & AI-Native Product Builder",
    description:
      "Swami Guru — product leader turned solo builder. Twenty brand launches since 2015, five continents. Previously Condé Nast, Newsweek and Metro World News.",
  },
  builds: {
    title: "Builds | Swami Guru",
    description:
      "Products Swami Guru has taken from brief to production single-handedly — builtbyswami.com, Free Word Tool, Adda and a 24-hour task engine. What each one was, the constraint, and how long it took.",
  },
  notes: {
    title: "Build Notes | Swami Guru",
    description:
      "Build notes by Swami Guru — the brief, the method and what broke, written after each product ships. Building in public with AI as a real tool.",
  },
  weekly: {
    title: "The Weekly | Swami Guru",
    description:
      "The Weekly by Swami Guru — every issue of the Builtbyswami Weekly: the best of the daily five, plus what I'm building in public. Free.",
  },
  techRoundup: {
    // "The Daily Five" is the brand name in the nav. The title tag keeps the
    // words people search for, which are not the same thing.
    title: "Daily Tech & AI Roundup | Swami Guru",
    description:
      "Daily tech & AI roundups from Swami Guru — the biggest stories, honest takes, and practical tips, filtered so you only get what's worth your time.",
  },
  workWithMe: {
    title: "Swami Guru | Product Consulting for Publishers & Content Teams",
    description:
      "Product consulting for publishers and content-driven teams: market launches, CMS migrations, AI workflows — without losing traffic or revenue.",
  },
};
