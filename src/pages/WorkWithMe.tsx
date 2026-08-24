/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Check,
  Globe,
  Hammer,
  Server,
  X,
} from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { TestimonialQuotes } from "../components/Testimonials";
import { trackCta } from "../lib/analytics";
import { usePageSeo } from "../hooks/usePageSeo";

/** Booking link — the 30-minute event type, linked directly so there's no
 *  intermediate "pick a duration" step between the CTA and a booked call. */
const CAL_LINK = "https://cal.com/swami-guru/30min";

/**
 * Full case-study page URL. Leave as an empty string until the case study is
 * published — the "Read the full case study" link is hidden while it's empty,
 * so we never ship a link that 404s.
 */
const CASE_STUDY_URL = "/case-study/middle-east";

interface Service {
  icon: typeof Globe;
  name: string;
  meta: string;
  body: string;
}

const SERVICES: Service[] = [
  {
    icon: Globe,
    name: "Market Launch & Expansion Readiness",
    meta: "2–3 weeks · from ₹2,00,000",
    body: "A written go-to-market plan for a new region, with the platform, editorial, commercial and regulatory decisions already made — not a list of things to figure out. Audience and revenue modelling, platform readiness, localisation architecture, ad and commerce stack, launch sequencing, and the risks that actually move launch dates.",
  },
  {
    icon: Server,
    name: "Platform & CMS Migration Readiness",
    meta: "2–3 weeks · from ₹2,00,000",
    body: "The replatform plan that protects your traffic and revenue through the cutover. Content modelling, taxonomy, redirect and SEO strategy, integration surface, ad and commerce continuity, editorial workflow on the far side, and a phased cutover you can defend to your board.",
  },
  {
    icon: Hammer,
    name: "Build Sprint",
    meta: "2–3 weeks · from ₹2,50,000",
    body: "A working prototype in your hands, not a slide deck. For teams who need to see the thing before committing engineering to it. I build and ship my own products — this is that, pointed at your problem.",
  },
];

const GOOD_FIT: [string, string][] = [
  [
    "You're taking a brand into a new market and the risk is execution, not strategy.",
    "The decision is made; what you need is the platform, the ad stack, the SEO and the local team all working on day one. Five titles, three waves, three years — the last one shipped in half the time of the first.",
  ],
  [
    "You're replatforming or migrating a CMS and you're afraid of what the cutover costs you.",
    "Content modelling, redirects, taxonomy, ad and commerce integrations, editorial workflow on the other side. This is the work I've spent six years on across five global brands.",
  ],
  [
    "You have a content or editorial team and you want AI to actually make them faster.",
    "Not a workshop, not a policy doc — real workflows with real guardrails. I cut a launch programme's time-to-market by 50% doing exactly this.",
  ],
];

const NOT_A_FIT: [string, string][] = [
  [
    "You need a pair of hands to write tickets and run standups.",
    "I'm not a delivery PM for hire. I'm worth the money where the decisions are hard, not where the backlog is long.",
  ],
  [
    "You're shopping for the lowest bid.",
    "Engagements start at ₹2,00,000. I don't discount to win work — I'd rather point you to someone cheaper than deliver a thin version of this.",
  ],
  [
    "You need an engineer to own your codebase.",
    "I build working prototypes and I ship my own products, but I'm a product lead, not your engineering hire.",
  ],
];

const SHIPPED: [string, string, string][] = [
  [
    "freewordtool.com",
    "https://freewordtool.com",
    "A text analysis tool: readability scoring, reading and speaking time, platform character limits. Runs entirely in your browser.",
  ],
  [
    "adda.builtbyswami.com",
    "https://adda.builtbyswami.com",
    "Pick a city, get its songs, its sky, its clock.",
  ],
];

function BookButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={CAL_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta("consulting_book_call", "work_with_me")}
      className={`inline-flex items-center gap-2 bg-m3-primary text-m3-on-primary font-display font-bold px-7 py-3.5 rounded-m3-full transition-all hover:m3-elevation-1-shadow active:scale-95 shadow-sm ${className}`}
    >
      Book a 30-minute call <ArrowRight className="w-4 h-4" />
    </a>
  );
}

export default function WorkWithMe() {
  usePageSeo("workWithMe");

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">
        <SiteHeader />

        {/* Hero */}
        <section className="px-6 md:px-14 pt-12 md:pt-16 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-m3-primary" />
            <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-primary">
              Work With Me
            </span>
          </div>

          <h1 className="display text-3xl md:text-5xl font-extrabold uppercase tracking-tighter text-m3-on-surface max-w-4xl leading-[0.95]">
            I help publishers and content businesses make the hard platform
            moves — without losing traffic or revenue
          </h1>

          <p className="mt-5 text-base md:text-lg font-medium text-m3-on-surface-variant max-w-2xl leading-relaxed">
            New markets, replatforms, AI in the newsroom.
          </p>

          <div className="mt-8">
            <BookButton />
          </div>

          <p className="mt-8 pt-8 border-t border-m3-outline/15 text-sm md:text-[15px] font-medium text-m3-on-surface-variant max-w-3xl leading-relaxed">
            11 years in product. Led product for{" "}
            <strong className="text-m3-on-surface font-bold">
              Vogue, GQ, Wired, Architectural Digest and Condé Nast Traveller
            </strong>
            . Took five titles into the Middle East across three waves —
            exceeded the $20M+ Year 1 revenue target and beat audience
            benchmarks by 12%. Before that, Newsweek and Metro World News.
          </p>
        </section>

        {/* Services */}
        <section className="px-6 md:px-14 py-10 md:py-12">
          <h2 className="font-display text-xs font-black uppercase tracking-[0.25em] text-m3-on-surface-variant/60 mb-3">
            What I do
          </h2>
          <p className="text-sm md:text-base font-medium text-m3-on-surface-variant max-w-2xl mb-8 leading-relaxed">
            Three ways to start. Each is fixed scope, fixed price, and ends with
            something you can act on.
          </p>

          <div className="flex flex-col gap-4 md:gap-5">
            {SERVICES.map(({ icon: Icon, name, meta, body }) => (
              <div
                key={name}
                className="bg-m3-surface rounded-[24px] border border-m3-outline/5 p-6 md:p-8 flex flex-col gap-3 hover:border-m3-primary/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 w-10 h-10 shrink-0 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface">
                      {name}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-m3-primary">
                      {meta}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-m3-on-surface-variant font-medium max-w-3xl">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm font-medium text-m3-on-surface-variant/80 italic max-w-2xl">
            Longer engagements: I take on one or two fractional product leads at
            a time, two to three days a week, minimum three months. Ask on the
            call.
          </p>
        </section>

        {/* Case study */}
        <section className="px-6 md:px-14 py-10 md:py-12">
          <h2 className="font-display text-xs font-black uppercase tracking-[0.25em] text-m3-on-surface-variant/60 mb-6">
            The work
          </h2>

          <div className="bg-m3-surface rounded-[24px] border border-m3-outline/5 p-6 md:p-10 flex flex-col gap-4">
            <h3 className="display text-2xl md:text-3xl font-extrabold tracking-tight text-m3-on-surface">
              Launching global media brands into the Middle East
            </h3>
            <p className="text-base md:text-lg font-bold text-m3-primary leading-snug">
              Five titles, three waves — and the last one shipped in half the
              time.
            </p>

            <p className="text-sm md:text-[15px] leading-relaxed text-m3-on-surface-variant font-medium">
              I led the product side of Condé Nast's Middle East expansion —
              five flagship titles taken live in the GCC on group infrastructure
              across three waves and three years, with multi-currency
              subscriptions, regional ad-tech and affiliate commerce working
              from day one. The programme exceeded its $20M+ Year 1 revenue
              target and beat its audience benchmarks by 12%.
            </p>
            <p className="text-sm md:text-[15px] leading-relaxed text-m3-on-surface-variant font-medium">
              For the third wave I audited the earlier launches for friction,
              automated the repeatable work with LLM-driven guardrails, and
              rebuilt content placement using audience data from the previous
              launch — cutting time-to-market by 50% and lifting ad revenue per
              visit ~11%, with the same five-person delivery team.
            </p>
            <p className="text-sm md:text-[15px] leading-relaxed text-m3-on-surface font-bold">
              Doing it once is a launch. Doing it three times, with the last one
              in half the time, is a playbook.
            </p>

            {CASE_STUDY_URL && (
              <Link
                to={CASE_STUDY_URL}
                className="mt-1 inline-flex items-center gap-1 min-h-[44px] text-[11px] font-bold uppercase tracking-widest text-m3-primary hover:gap-2 transition-all"
              >
                Read the full case study <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </section>

        {/* Three references, straight after the case study — proof follows the
            claim it supports. Deliberately quieter than the /about treatment. */}
        <TestimonialQuotes />

        {/* I also ship */}
        <section className="px-6 md:px-14 py-10 md:py-12">
          <h2 className="font-display text-xs font-black uppercase tracking-[0.25em] text-m3-on-surface-variant/60 mb-3">
            I also ship
          </h2>
          <p className="display text-lg md:text-xl font-extrabold tracking-tight text-m3-on-surface mb-6">
            Most product people talk about building. I build.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {SHIPPED.map(([label, href, body]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-m3-surface rounded-[24px] border border-m3-outline/5 p-6 hover:border-m3-primary/30 hover:shadow-xl transition-all flex flex-col gap-2"
              >
                <span className="mono text-sm font-bold text-m3-primary group-hover:underline underline-offset-4">
                  {label}
                </span>
                <span className="text-sm leading-relaxed text-m3-on-surface-variant font-medium">
                  {body}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Fit */}
        <section className="px-6 md:px-14 py-10 md:py-12">
          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-m3-surface rounded-[24px] border border-m3-outline/5 p-6 md:p-8">
              <h2 className="flex items-center gap-2 font-display text-xs font-black uppercase tracking-[0.25em] text-m3-primary mb-6">
                <Check className="w-4 h-4" /> Good fit
              </h2>
              <div className="flex flex-col gap-5">
                {GOOD_FIT.map(([lead, body]) => (
                  <p
                    key={lead}
                    className="text-sm leading-relaxed text-m3-on-surface-variant font-medium"
                  >
                    <strong className="text-m3-on-surface font-bold">
                      {lead}
                    </strong>{" "}
                    {body}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-m3-surface rounded-[24px] border border-m3-outline/5 p-6 md:p-8">
              <h2 className="flex items-center gap-2 font-display text-xs font-black uppercase tracking-[0.25em] text-m3-on-surface-variant/60 mb-6">
                <X className="w-4 h-4" /> Not a fit
              </h2>
              <div className="flex flex-col gap-5">
                {NOT_A_FIT.map(([lead, body]) => (
                  <p
                    key={lead}
                    className="text-sm leading-relaxed text-m3-on-surface-variant font-medium"
                  >
                    <strong className="text-m3-on-surface font-bold">
                      {lead}
                    </strong>{" "}
                    {body}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-14 pb-16 pt-6">
          <div className="bg-m3-surface rounded-[28px] border border-m3-outline/5 p-8 md:p-12 text-center flex flex-col items-center gap-4">
            <h2 className="display text-2xl md:text-4xl font-extrabold uppercase tracking-tighter text-m3-on-surface">
              Book a 30-minute call
            </h2>
            <p className="text-sm md:text-base font-medium text-m3-on-surface-variant max-w-md leading-relaxed">
              No pitch. Tell me what you're dealing with and I'll tell you if I
              can help.
            </p>
            <div className="mt-2">
              <BookButton />
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
