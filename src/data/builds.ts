/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Everything shipped solo. This used to be a grid buried at position nine of
 * eleven on /about, which meant the evidence for "I build and ship my own
 * products" — the claim the Build Sprint offer rests on — wasn't linkable and
 * wasn't indexed. It has its own page now.
 *
 * Each entry answers the same four questions in the same order: what it is,
 * what the constraint was, how long it took, what it's made of. The constraint
 * is the interesting field. Anyone can ship something given unlimited time.
 */

export interface Build {
  name: string;
  /** Short status chip — "Live", "24-hour sprint". */
  status: string;
  /** One line: what the thing actually does. */
  what: string;
  /** The rule the build was held to, and what it cost. */
  constraint: string;
  /** Plain-language time to ship. */
  shipped: string;
  stack: string;
  /** Public URL, when there is one. */
  url?: string;
  /** Matching build note on this site. */
  noteSlug?: string;
  /** Optional deeper read: the same build seen through several disciplines. */
  perspectives?: { label: string; text: string }[];
}

export const BUILDS: Build[] = [
  {
    name: "Long Press",
    status: "Live",
    what: "A daily tech publication I edit, build and ship solo — sourcing, editing, design and the ship pipeline, no editorial team. Three editorial pillars: the Daily Five, five stories every morning, each broken into the problem, what changed, the catch, and what it means for you; Known Issue, an opinion column on the things that have been broken long enough to count as a decision; and Fine Print, a weekly Saturday explainer on Indian rules, prices and service changes, worked through in rupees.",
    constraint:
      "Give a publisher and title structure real infrastructure instead of a landing page. BuiltBySwami is the publisher, Long Press the title: its own domain, its own masthead, its own analytics.",
    shipped: "76 issues, daily since 12 July 2026",
    stack: "Astro, Vercel. Own domain, own GA4 property.",
    url: "https://longpress.news",
    perspectives: [
      {
        label: "Editorial",
        text: "Three pillars with fixed formats. The Daily Five is the morning brief: five stories, each taken apart as the problem, what changed, the catch and what it means for you. Five is a cap, not a target, so choosing what to leave out is part of the job. Known Issue is the opinion column on problems that have been broken long enough to count as a decision, and it ends in a verdict: buy, skip or wait. Fine Print is a weekly Saturday explainer on Indian rules, prices and service changes, read from the source document, worked through in rupees and dated with a last-checked line. I use Claude and Gemini across research and drafting; I choose what runs, edit every piece and am accountable for what is published. Errors are corrected on the page with a note of what changed and when. Paid items, if any, are labelled, and the opinion is not part of the deal.",
      },
      {
        label: "Audience",
        text: "Readers in India who want the tech news that actually touches them, in five minutes rather than a feed. That is why Fine Print is written in rupees and about banks, telecoms, regulators and apps, and why the brief mixes India and global stories. It is written from Bengaluru, for people who would rather be told what a change means than be shown the announcement.",
      },
      {
        label: "Technical",
        text: "A static Astro site on Vercel, in its own repo. Every issue is a content file checked against a schema, and the schema keeps the four-part story structure so it renders as labelled blocks instead of one body of text. A routing guard runs at build time and blocks the deploy on a bad or colliding URL slug, because a broken URL is not a style nit. It also ships an RSS feed and a public search index.",
      },
      {
        label: "Design",
        text: "Its own light editorial identity, separate from builtbyswami.com: a masthead, a restrained theme and the line \"Press and hold, the tech signal.\" The four labelled blocks make every story scannable, and fixed-height slots are reserved so the page never jumps as it loads.",
      },
      {
        label: "SEO and Google Search",
        text: "One page per day, not one per story: about 350 URLs a year rather than thousands of thin pages that decay within hours. Time-bound briefs live under /daily; standalone pieces get permanent root-level slugs with no date or category in them, so recategorising never costs a redirect. Full text lives in exactly one place, so the brief and an evergreen page never compete for the same query, and the brief links to the evergreen pages every morning. The old daily on builtbyswami.com is redirected permanently to the new home.",
      },
      {
        label: "Tracking and measurement",
        text: "Its own GA4 property and its own Tag Manager container, so Long Press is measured as a title in its own right rather than as a section of another site. The tooling is the same set I audit for clients: Search Console, GA4 and tag setup.",
      },
      {
        label: "Social platforms",
        text: "Each morning the five stories become image cards for X and Threads, with carousels for the stories that suit them, and one pick a day goes to Instagram. There is also a WhatsApp channel carrying the Daily Five. Posts are scheduled in advance for set slots in Indian time, so the publication keeps its cadence whether or not I am at a desk.",
      },
    ],
  },
  {
    name: "builtbyswami.com",
    status: "Live",
    what: "A daily-publishing tech platform: the site, the daily brief, the newsletter and the social cards, all run from one repo. The daily outgrew it and now runs as its own title at longpress.news.",
    constraint:
      "Publish every day from day one. The site had to be finished enough to carry a daily habit before it was finished enough to look right.",
    shipped: "Publishing daily since 12 July 2026",
    stack: "React, TypeScript, Vite, Tailwind, Vercel. GA4 and GTM.",
    url: "https://www.builtbyswami.com",
    noteSlug: "why-i-built-builtbyswami-from-scratch",
  },
  {
    name: "Free Word Tool",
    status: "Live",
    what: "A writing utility: readability scoring, reading and speaking time, platform character limits. Runs entirely in your browser, nothing leaves the page.",
    constraint:
      "One day, one tool. Six user segments were scoped and it started turning into five products; I cut it back mid-build to the one that was worth shipping.",
    shipped: "One-day sprint, eight commits",
    stack: "Static, fully client-side.",
    url: "https://freewordtool.com",
    noteSlug: "freewordtool-one-day-sprint",
  },
  {
    name: "अड्डा — Adda",
    status: "Live",
    what: "Pick a city and hear its songs, under that city's sky and on that city's clock. Delhi first, 31 tracks at India Gate, golden hour.",
    constraint:
      "Deliberately no job to do. Nothing to complete, nothing to export, no number it moves — which meant no test could tell me when it was done.",
    shipped: "Twenty-four deploys in under four hours",
    stack: "Next.js on the App Router, Turbopack, Redis for presence, YouTube for playback.",
    url: "https://adda.builtbyswami.com",
    noteSlug: "adda-a-product-with-no-job",
  },
  {
    name: "Task management engine",
    status: "24-hour sprint",
    what: "Data modeling, state, persistence and UI from an empty repo to a working app.",
    constraint:
      "One sitting, no second pass. Private build — never published to the Play Store, because the point was the method rather than the product.",
    shipped: "24 hours, solo",
    stack: "Android.",
    noteSlug: "24-hour-task-manager-sprint",
  },
];
