/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * One newsletter promise, defined once and reused verbatim everywhere the
 * list is offered — header dropdown, mobile menu, homepage capture block and
 * footer. Previously each of those four places made a different promise,
 * which read as three competing products rather than one list.
 *
 * If the pitch changes, it changes here and nowhere else.
 */

/** Short title for the offer. */
export const NEWSLETTER_TITLE = "The best of Long Press, once a week";

/** The canonical promise. Do not paraphrase at the call site. */
export const NEWSLETTER_PROMISE =
  "Five tech stories every morning at Long Press. The best of the week lands here in one email, plus what I'm building in public. Free.";

/**
 * One-line version for the slim strip under the header, where the full
 * promise doesn't fit. Same offer, fewer words — not a different pitch.
 */
export const NEWSLETTER_TAGLINE = "5 stories. 5 minutes. Zero fluff.";
export const NEWSLETTER_TAGLINE_SUFFIX =
  " — the best of Long Press, in one weekly email.";
