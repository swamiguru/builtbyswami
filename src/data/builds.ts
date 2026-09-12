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
}

export const BUILDS: Build[] = [
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
