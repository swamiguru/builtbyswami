/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Thin wrapper over the GTM dataLayer (container GTM-TQFTQXB6, loaded in
 * index.html). Nothing here configures GA4 — these events only make the
 * interactions *available*; each still needs a matching trigger and tag in
 * the GTM UI before it shows up in reports.
 *
 * The events exist to answer one question the homepage rebuild raised and
 * can't otherwise settle: does the router actually route? Two CTAs sit side
 * by side in the hero, and the whole hybrid-homepage bet is that a
 * meaningful share of visitors take the second one.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Every CTA worth counting, named so the GTM trigger list reads clearly. */
export type TrackedCta =
  | "hero_read_daily"
  | "hero_work_with_me"
  | "fork_the_work"
  | "fork_work_with_me"
  | "consulting_book_call"
  | "consulting_email_me"
  | "home_consulting_see_all"
  | "home_consulting_work_with_me";

/**
 * Push a CTA click into the dataLayer. Safe before GTM loads — the snippet
 * creates window.dataLayer synchronously in <head>, and this no-ops rather
 * than throwing if a blocker removed it.
 */
export function trackCta(cta: TrackedCta, location: string): void {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;

  window.dataLayer.push({
    event: "cta_click",
    cta_id: cta,
    cta_location: location,
  });
}
