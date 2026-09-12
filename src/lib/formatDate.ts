/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Long-form date for the weekly issue cards.
 *
 * This used to be formatDigestDate in data/social.ts, which eagerly globs
 * every daily JSON file. Importing a date formatter therefore pulled the whole
 * 60-issue archive into the bundle on every page load. The archive lives at
 * longpress.news now; only the formatter was ever needed here.
 */

export const formatLongDate = (iso: string): string =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
