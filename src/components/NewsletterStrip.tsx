/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { SUBSCRIBE_URL } from "./NewsletterSignup";
import { NEWSLETTER_TAGLINE, NEWSLETTER_TAGLINE_SUFFIX } from "../data/newsletter";

// Dismissing hides the strip for two weeks (persisted client-side) rather
// than forever, so it resurfaces for a returning visitor who never
// subscribed instead of going dark permanently after one stray tap.
const DISMISS_KEY = "nl-strip-dismissed-until";
const DISMISS_DAYS = 14;

/**
 * Slim newsletter strip that sits directly under the sticky <SiteHeader />.
 * Reuses the same beehiiv redirect flow as <NewsletterSignup /> — no
 * separate integration to maintain.
 */
export default function NewsletterStrip() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const until = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (Date.now() > until) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(
      DISMISS_KEY,
      String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000),
    );
    setVisible(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setRedirecting(true);
    window.location.href = `${SUBSCRIBE_URL}?email=${encodeURIComponent(trimmed)}`;
  };

  if (!visible) return null;

  return (
    <div className="relative z-20 bg-m3-on-surface text-m3-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2.5">
          <div className="flex items-center gap-2 shrink-0 pr-9 sm:pr-0">
            <Sparkles
              className="w-4 h-4 shrink-0 text-m3-surface/80"
              aria-hidden="true"
            />
            <p className="text-sm font-bold font-display leading-tight">
              {NEWSLETTER_TAGLINE}
              <span className="hidden sm:inline text-m3-surface/75 font-medium">
                {NEWSLETTER_TAGLINE_SUFFIX}
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto"
          >
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={redirecting}
              className="flex-1 sm:w-56 bg-m3-surface/10 focus:bg-m3-surface text-sm font-bold placeholder:text-m3-surface/50 placeholder:font-medium text-m3-surface focus:text-m3-on-surface rounded-m3-full py-2 px-4 border border-m3-on-primary/25 focus:outline-none focus:ring-2 focus:ring-m3-on-primary/40 transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={redirecting}
              className="shrink-0 inline-flex items-center gap-1.5 bg-m3-surface text-m3-on-surface text-sm font-bold rounded-m3-full py-2 px-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {redirecting ? (
                "Taking you there…"
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss newsletter banner"
            className="absolute right-1 top-1 sm:static shrink-0 p-2 rounded-full hover:bg-m3-surface/10 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
