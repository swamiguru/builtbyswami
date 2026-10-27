/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from "react";

// The publication's own hosted subscribe page — a stable, guaranteed-public
// entry point for the "Builtbyswami Weekly" beehiiv publication. We hand the
// visitor's email off via the `email` query param (the same param beehiiv's
// own redirect settings reference) so the hosted page arrives pre-filled and
// one click from confirmed.
//
// This is a lightweight redirect-based integration rather than a fully
// inline widget. beehiiv's inline embed is a proprietary script tag only
// obtainable from Subscribers > Subscribe forms > Get embed code in the
// beehiiv dashboard (no API exposes it) — swap this component's internals
// for that script if a no-redirect inline experience is preferred later.
export const SUBSCRIBE_URL = "https://builtbyswami.beehiiv.com/subscribe";

interface NewsletterSignupProps {
  /** Force a single-column layout regardless of viewport width — for use
   * inside narrow containers like a nav dropdown, where the default
   * `sm:flex-row` would trigger from viewport width even though the
   * container itself is small. */
  stacked?: boolean;
}

export default function NewsletterSignup({
  stacked = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setRedirecting(true);
    window.location.href = `${SUBSCRIBE_URL}?email=${encodeURIComponent(trimmed)}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        stacked
          ? "flex flex-col gap-3 w-full"
          : "flex flex-col sm:flex-row gap-3 max-w-lg"
      }
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={redirecting}
        className="flex-1 bg-m3-surface rounded-m3-full py-3.5 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-m3-on-surface/15 text-m3-on-surface shadow-inner placeholder:text-m3-on-surface/30 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={redirecting}
        className="m3-button-filled text-sm tracking-wide whitespace-nowrap disabled:opacity-60"
      >
        {redirecting ? "Taking you there…" : "Subscribe →"}
      </button>
    </form>
  );
}
