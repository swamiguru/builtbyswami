/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Quote } from "lucide-react";
import {
  GRID_TESTIMONIALS,
  HERO_TESTIMONIAL,
  SERVICE_TESTIMONIALS,
  initialsFor,
  type Testimonial,
} from "../data/testimonials";

const LINKEDIN = "https://www.linkedin.com/in/swaminathanguru/details/recommendations/";

/* Monogram tones cycle through the three M3 containers so the grid has
   rhythm without randomness — same person always gets the same tone. */
const TONES = [
  "bg-m3-primary-container text-m3-on-primary-container",
  "bg-m3-secondary-container text-m3-on-secondary-container",
  "bg-m3-tertiary-container text-m3-on-tertiary-container",
];

function Identity({ t, tone }: { t: Testimonial; tone: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className={`w-10 h-10 shrink-0 rounded-m3-full flex items-center justify-center font-display font-black text-xs tracking-wide ${tone}`}
      >
        {initialsFor(t)}
      </span>
      <div className="min-w-0">
        <div className="font-display font-bold text-sm text-m3-on-surface leading-snug break-words">
          {t.name}
        </div>
        <div className="text-xs font-medium text-m3-on-surface-variant leading-snug break-words">
          {t.title}
          {t.company ? `, ${t.company}` : ""}
        </div>
      </div>
    </div>
  );
}

function Card({ t, index }: { t: Testimonial; index: number }) {
  const [open, setOpen] = useState(false);
  const tone = TONES[index % TONES.length];
  const hasMore = t.full.length > t.quote.length + 40;

  return (
    <figure className="bg-m3-surface rounded-[24px] border border-m3-outline/5 p-6 md:p-7 flex flex-col gap-4 hover:border-m3-primary/30 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between gap-3">
        <Identity t={t} tone={tone} />
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-m3-primary bg-m3-primary/5 border border-m3-primary/15 px-2.5 py-1 rounded-m3-full whitespace-nowrap">
          {t.relationship}
        </span>
      </div>

      <blockquote className="text-sm leading-relaxed text-m3-on-surface-variant font-medium">
        {open ? t.full : `“${t.quote}”`}
      </blockquote>

      {hasMore && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="self-start min-h-[44px] -my-2 inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-m3-primary hover:underline underline-offset-4"
        >
          {open ? "Show less" : "Read the full recommendation"}
        </button>
      )}
    </figure>
  );
}

/** Hero quote + card grid. Used on /about. */
export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-m3-surface-variant border-b border-m3-outline/10 px-6 md:px-10 lg:px-12 py-10 md:py-14"
    >
      <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.35em] text-m3-primary block mb-3">
        What people say
      </span>

      {HERO_TESTIMONIAL && (
        <figure className="max-w-4xl mb-12 md:mb-14">
          <Quote
            aria-hidden="true"
            className="w-7 h-7 md:w-8 md:h-8 text-m3-primary/40 mb-4"
          />
          <blockquote className="display text-lg md:text-2xl lg:text-[28px] font-extrabold tracking-tight text-m3-on-surface leading-[1.3]">
            {HERO_TESTIMONIAL.quote}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="w-11 h-11 shrink-0 rounded-m3-full bg-m3-primary text-m3-on-primary flex items-center justify-center font-display font-black text-sm"
            >
              {initialsFor(HERO_TESTIMONIAL)}
            </span>
            <cite className="not-italic">
              <span className="block font-display font-bold text-sm text-m3-on-surface">
                {HERO_TESTIMONIAL.name}
              </span>
              <span className="block text-xs font-medium text-m3-on-surface-variant">
                {HERO_TESTIMONIAL.title}
              </span>
            </cite>
          </figcaption>
        </figure>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {GRID_TESTIMONIALS.map((t, i) => (
          <Card key={t.id} t={t} index={i} />
        ))}
      </div>

      <a
        href={LINKEDIN}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center min-h-[44px] text-[11px] font-bold uppercase tracking-widest text-m3-primary hover:underline underline-offset-4"
      >
        All recommendations on LinkedIn →
      </a>
    </section>
  );
}

/**
 * Three plain pull quotes. Used on /work-with-me — no cards, no monograms.
 * The visual quietness is deliberate: it should read as a reference sheet,
 * not a marketing band, so the page's weight stays on the offer.
 */
export function TestimonialQuotes() {
  return (
    <section className="px-6 md:px-14 py-10 md:py-12">
      <h2 className="font-display text-xs font-black uppercase tracking-[0.25em] text-m3-on-surface-variant/80 mb-8">
        What people who've worked with me say
      </h2>

      <div className="flex flex-col gap-8 md:gap-9 max-w-3xl">
        {SERVICE_TESTIMONIALS.map((t) => (
          <figure key={t.id} className="border-l-2 border-m3-primary pl-5 md:pl-6">
            <blockquote className="text-sm md:text-base leading-relaxed text-m3-on-surface font-medium">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-3 text-xs font-bold text-m3-on-surface-variant">
              <cite className="not-italic">
                {t.name} — {t.title}
                {t.company ? `, ${t.company}` : ""}
              </cite>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
