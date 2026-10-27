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
  deepDive?: DeepDive;
}

export interface Lens {
  label: string;
  /** One-line claim that sums the lens up. */
  headline: string;
  points: string[];
}

export interface DeepDive {
  /** Optional reach numbers (users, search clicks...). Shown only when filled
   *  in, and only with figures that come from GA4 or Search Console. */
  reach?: { value: string; label: string }[];
  lenses: Lens[];
}

export const BUILDS: Build[] = [
  {
    name: "Long Press",
    status: "Live",
    what: "A daily tech publication I edit, build and ship solo — sourcing, editing, design and the ship pipeline, no editorial team. Three editorial pillars: the Daily Five, five stories every morning, each broken into the problem, what changed, the catch, and what it means for you; Known Issue, an opinion column on the things that have been broken long enough to count as a decision; and Fine Print, a weekly Saturday explainer on Indian rules, prices and service changes, worked through in rupees.",
    constraint:
      "Give a publisher and title structure real infrastructure instead of a landing page. BuiltBySwami is the publisher, Long Press the title: its own domain, its own masthead, its own analytics.",
    shipped: `${__LP_ISSUES__} issues, daily since 12 July 2026`,
    stack: "Astro, Vercel. Own domain, own GA4 property.",
    url: "https://longpress.news",
    deepDive: {
      reach: [],
      lenses: [
        {
          label: "Editorial",
          headline: "Three formats, one standard.",
          points: [
            "The Daily Five: five stories every morning, each taken apart as the problem, what changed, the catch and what it means for you. Five is a cap, not a target.",
            "Known Issue: opinion on problems that have been broken long enough to count as a decision, ending in a verdict: buy, skip or wait.",
            "Fine Print: a weekly Saturday explainer on Indian rules, prices and service changes, read from the source, worked through in rupees and dated with a last-checked line.",
            "Method: I use Claude and Gemini across research and drafting; I choose what runs, edit every piece and am accountable for what is published.",
            "Standards: errors are corrected on the page with a note of what changed and when. Paid items, if any, are labelled, and the opinion is not part of the deal.",
          ],
        },
        {
          label: "Audience",
          headline: "Readers in India who want the signal, fast.",
          points: [
            "People who want the tech news that touches them in five minutes, not a feed to scroll.",
            "Fine Print is written in rupees and about banks, telecoms, regulators and apps; the brief mixes India and global stories.",
            "Written from Bengaluru, for readers who want what a change means rather than the announcement.",
          ],
        },
        {
          label: "Technical",
          headline: "Static, schema-checked, hard to break.",
          points: [
            "An Astro site on Vercel, in its own repo, served as static pages.",
            "Every issue is a content file checked against a schema that keeps the four-part story structure, so it renders as labelled blocks instead of one body of text.",
            "A routing guard runs at build time and blocks the deploy on a bad or colliding URL slug, because a broken URL is not a style nit.",
            "Ships an RSS feed and a public search index.",
          ],
        },
        {
          label: "Design",
          headline: "Its own identity, built to scan.",
          points: [
            "A light editorial look, separate from builtbyswami.com: a masthead, a restrained theme and the line \"Press and hold, the tech signal.\"",
            "Four labelled blocks make every story scannable.",
            "Fixed-height slots are reserved so the page never jumps as it loads.",
          ],
        },
        {
          label: "SEO and Search",
          headline: "One page a day, not one per story.",
          points: [
            "About 350 URLs a year, instead of thousands of thin pages that decay within hours.",
            "Time-bound briefs live under /daily; standalone pieces get permanent root-level slugs with no date or category, so recategorising never costs a redirect.",
            "Full text lives in exactly one place, so a brief and an evergreen page never compete for the same query, and the brief links to the evergreen pages every morning.",
            "The old daily on builtbyswami.com redirects permanently to its new home.",
          ],
        },
        {
          label: "Tracking",
          headline: "Measured as a title, not a section.",
          points: [
            "Its own GA4 property and its own Tag Manager container, so Long Press is read on its own terms rather than as a slice of another site.",
            "The same toolset I audit for clients: Search Console, GA4 and tag setup.",
          ],
        },
        {
          label: "Social",
          headline: "Distribution is part of the morning.",
          points: [
            "Each day's stories become image cards for X and Threads, with carousels where a story suits one, and one pick a day goes to Instagram.",
            "A WhatsApp channel carries the Daily Five.",
            "Posts are scheduled in advance for set slots in Indian time, so the cadence holds whether or not I am at a desk.",
          ],
        },
      ],
    },
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
