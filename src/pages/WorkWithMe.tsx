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
  Mail,
  Server,
  Sparkles,
  Users,
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
    body: "A written go-to-market plan for a new region, with the platform, content, commercial and regulatory decisions already made — not a list of things to figure out. Audience and revenue modelling, platform readiness, localisation architecture, ad and commerce stack, launch sequencing, and the risks that actually move launch dates.",
  },
  {
    icon: Server,
    name: "Platform & CMS Migration Readiness",
    meta: "2–3 weeks · from ₹2,00,000",
    body: "The replatform plan that protects your traffic and revenue through the cutover. Content modelling, taxonomy, redirect and SEO strategy, integration surface, ad and commerce continuity, your team's workflow on the far side, and a phased cutover you can defend to your board.",
  },
  {
    icon: Sparkles,
    name: "AI Workflow & Product Operations",
    meta: "2–3 weeks · from ₹2,00,000",
    body: "For teams whose content or product workflow hasn't caught up with what AI can actually do. I map where the manual work is, build the automation with real guardrails, and hand your team something they'll actually use — not a policy doc, not a workshop. This is the same approach that cut a launch programme's time-to-market by 50% and lifted ad revenue per visit ~11%, with the same five-person team.",
  },
  {
    icon: Hammer,
    name: "Build Sprint",
    meta: "2–3 weeks · from ₹2,50,000",
    body: "A working prototype in your hands, not a slide deck. For teams who need to see the thing before committing engineering to it. I build and ship my own products — this is that, pointed at your problem.",
  },
];

/** The functions a launch or migration actually has to get through — pulled
 *  out of prose into a scannable grid so the range registers at a glance
 *  instead of requiring a full read of the paragraph. */
const TEAM_FUNCTIONS: { name: string; detail?: string }[] = [
  { name: "Engineering & Core Platform" },
  { name: "CMS & Cloud/CDN" },
  { name: "Design" },
  { name: "Editorial & Content Strategy" },
  { name: "Newsletters" },
  { name: "Marketing Technology" },
  { name: "Subscriptions" },
  { name: "Audience Development" },
  { name: "Social & Video" },
  { name: "Ad Tech" },
  {
    name: "Data & Analytics",
    detail: "Google Analytics, Tag Manager, consent management",
  },
  { name: "Affiliate Commerce & Product Listings" },
  { name: "Content Recommendation Engines" },
  { name: "Legal" },
  { name: "SEO & Search Console" },
  { name: "Commercial & Marketing" },
];

/** The case study's numbers, pulled into a stat strip so "the work" section
 *  carries its own visual weight instead of reading as another text block. */
const CASE_STUDY_STATS: [string, string][] = [
  ["5", "titles launched"],
  ["3", "waves, 3 years"],
  ["$20M+", "Year 1 target, exceeded"],
  ["12%", "above audience benchmark"],
  ["½", "the time — wave 3 vs. wave 1"],
];

const GOOD_FIT: [string, string][] = [
  [
    "You're taking a brand into a new market and the risk is execution, not strategy.",
    "The decision is made; what you need is the platform, the ad stack, the SEO and the local team all working on day one. Five titles, three waves, three years — the last one shipped in half the time of the first.",
  ],
  [
    "You're replatforming or migrating a CMS and you're afraid of what the cutover costs you.",
    "Content modelling, redirects, taxonomy, ad and commerce integrations, your team's workflow on the other side. This is the work I've spent six years on across five global brands.",
  ],
  [
    "You have a content, catalog or editorial team and you want AI to actually make them faster.",
    "Not a workshop, not a policy doc — real workflows with real guardrails. I cut a launch programme's time-to-market by 50% doing exactly this.",
  ],
  [
    "You need product leadership for longer than three weeks but don't want to hire full-time yet.",
    "That's the fractional seat — the same kind of hard calls, just on a longer clock.",
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
  [
    "24-hour task manager sprint",
    "/notes/24-hour-task-manager-sprint",
    "Data modelling, state, persistence and UI, from an empty repo to a working Android app. Built solo, one sitting, no second pass.",
  ],
];

function BookButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={CAL_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta("consulting_book_call", "work_with_me")}
      className={`inline-flex items-center justify-center gap-2 bg-m3-primary text-m3-on-primary font-display font-bold px-4 sm:px-7 py-3 sm:py-3.5 rounded-m3-full transition-all hover:m3-elevation-1-shadow active:scale-95 shadow-sm text-[13px] sm:text-base whitespace-nowrap ${className}`}
    >
      Book a 30-minute call <ArrowRight className="w-4 h-4" />
    </a>
  );
}

function EmailButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="mailto:builtbyswami@gmail.com"
      onClick={() => trackCta("consulting_email_me", "work_with_me")}
      className={`inline-flex items-center justify-center gap-2 bg-m3-surface text-m3-on-surface border border-m3-outline/20 font-display font-bold px-4 sm:px-7 py-3 sm:py-3.5 rounded-m3-full transition-all hover:border-m3-primary/40 hover:text-m3-primary active:scale-95 text-[13px] sm:text-base whitespace-nowrap ${className}`}
    >
      Email me <Mail className="w-4 h-4" />
    </a>
  );
}

/** Small caps eyebrow, reused above every section heading so the label
 *  language stays identical while each band's background color changes. */
function Eyebrow({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "primary" | "inverted";
}) {
  const toneClass =
    tone === "primary"
      ? "text-m3-primary"
      : tone === "inverted"
        ? "text-m3-primary-container"
        : "text-m3-on-surface-variant/60";
  return (
    <span
      className={`font-display text-xs font-black uppercase tracking-[0.25em] block ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function WorkWithMe() {
  usePageSeo("workWithMe");

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">
        <SiteHeader />

        {/* Hero */}
        <section className="bg-m3-surface-variant border-b border-m3-outline/10 px-6 md:px-14 pt-12 md:pt-16 pb-10 md:pb-12">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-m3-primary" />
            <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-primary">
              Work With Me
            </span>
          </div>

          <h1 className="display text-3xl md:text-5xl font-extrabold uppercase tracking-tighter text-m3-on-surface max-w-4xl leading-[0.95]">
            I help publishers and content-driven teams make the hard
            product moves — without losing what's already working
          </h1>

          <p className="mt-5 text-base md:text-lg font-medium text-m3-on-surface-variant max-w-2xl leading-relaxed">
            New markets, replatforms, AI in the workflow.
          </p>

          <div className="mt-8 flex flex-wrap min-[360px]:flex-nowrap items-center gap-2 sm:gap-3">
            <BookButton className="min-[360px]:flex-1 sm:flex-none" />
            <EmailButton className="min-[360px]:flex-1 sm:flex-none" />
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

        {/* What I do — a numbered list rather than a stack of cards, so the
            four offers read as a menu, not four repeats of the same shape.
            Fractional Product Lead sits apart below, deliberately styled
            differently — it isn't fixed-scope like the four above it. */}
        <section className="bg-m3-surface border-b border-m3-outline/10 px-6 md:px-14 py-12 md:py-16">
          <Eyebrow tone="primary">What I do</Eyebrow>
          <p className="mt-3 text-sm md:text-base font-medium text-m3-on-surface-variant max-w-2xl mb-2 leading-relaxed">
            Four ways to start. Each is fixed scope, fixed price, and ends
            with something you can act on.
          </p>

          <div className="flex flex-col">
            {SERVICES.map(({ icon: Icon, name, meta, body }, i) => (
              <div
                key={name}
                className={`py-7 md:py-9 flex flex-col md:flex-row md:items-start gap-4 md:gap-10 ${
                  i !== 0 ? "border-t border-m3-outline/10" : ""
                }`}
              >
                <div className="flex items-center gap-4 md:w-56 shrink-0">
                  <span className="display text-3xl md:text-4xl font-extrabold text-m3-outline/25 tabular-nums leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-11 h-11 shrink-0 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <h3 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface">
                      {name}
                    </h3>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-m3-primary whitespace-nowrap">
                      {meta}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-m3-on-surface-variant font-medium max-w-2xl">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-m3-surface-variant/60 rounded-[24px] border border-dashed border-m3-outline/25 p-6 md:p-8 flex flex-col gap-3">
            <span className="font-display text-[11px] font-black uppercase tracking-[0.25em] text-m3-on-surface-variant/60">
              Also available
            </span>
            <div className="flex items-start gap-4">
              <span className="mt-0.5 w-10 h-10 shrink-0 rounded-m3-full bg-m3-secondary-container text-m3-on-secondary-container flex items-center justify-center">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h3 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface">
                  Fractional Product Lead
                </h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant">
                  2–3 days a week · minimum 3 months · one or two clients at a time
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-m3-on-surface-variant font-medium max-w-3xl">
              For teams that need product leadership for longer than a sprint but don't need, or can't yet justify, a full-time hire. I ran this exact seat full-time at group scale for three years — here it's the same decisions, part-time. Scope and rate are set on the call, not published; every fractional engagement is different enough that a fixed number would be dishonest.
            </p>
          </div>
        </section>

        {/* The teams every engagement actually runs through — a grid instead
            of a single paragraph, so the range of functions registers at a
            glance rather than requiring a full read. */}
        <section className="bg-m3-surface-variant border-b border-m3-outline/10 px-6 md:px-14 py-12 md:py-16">
          <Eyebrow>The teams every one of these runs through</Eyebrow>
          <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-m3-on-surface-variant font-medium max-w-3xl mb-8">
            A market launch or a replatform isn't a product-team problem.
            Getting it right means getting all of the functions below to
            agree and stay agreed through cutover — not just shipping the
            roadmap. That's why the plans on this page cover the ad stack,
            the legal sign-off and the SEO strategy, not just the product
            decisions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {TEAM_FUNCTIONS.map(({ name, detail }) => (
              <div
                key={name}
                className="bg-m3-surface rounded-[16px] border border-m3-outline/10 px-4 py-3.5 flex flex-col gap-1"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-m3-primary shrink-0" />
                  <span className="text-sm font-bold text-m3-on-surface leading-snug">
                    {name}
                  </span>
                </div>
                {detail && (
                  <span className="pl-3.5 text-[11px] font-medium text-m3-on-surface-variant leading-snug">
                    {detail}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 pt-8 border-t border-m3-outline/15 text-sm md:text-[15px] leading-relaxed text-m3-on-surface font-bold max-w-3xl">
            I know this because I started on the other side of it. Five
            years running the service desk at Metro World News, supporting
            exactly these teams, before I moved into product at the same
            company. Eleven years in product since — but the first five are
            why none of this is theoretical.
          </p>
        </section>

        {/* The work — the flagship case study, set apart with an inverted
            band and a stat strip so it reads as proof, not another block of
            text between the offer and the testimonials. */}
        <section className="bg-m3-on-surface text-m3-surface px-6 md:px-14 py-12 md:py-16">
          <Eyebrow tone="inverted">The work</Eyebrow>

          <h3 className="display mt-3 text-2xl md:text-4xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
            Launching global media brands into the Middle East
          </h3>
          <p className="mt-3 text-base md:text-lg font-bold text-m3-primary-container leading-snug">
            Five titles, three waves — and the last one shipped in half the
            time.
          </p>

          <div className="mt-8 md:mt-10 flex flex-wrap gap-x-8 gap-y-5 pb-8 md:pb-10 border-b border-m3-surface/15">
            {CASE_STUDY_STATS.map(([value, label]) => (
              <div key={label} className="flex flex-col gap-1 min-w-[110px]">
                <span className="display text-2xl md:text-3xl font-extrabold tracking-tight text-m3-primary-container leading-none">
                  {value}
                </span>
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-75 max-w-[140px] leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 max-w-3xl">
            <p className="text-sm md:text-[15px] leading-relaxed opacity-85 font-medium">
              I led the product side of Condé Nast's Middle East expansion —
              five flagship titles taken live in the GCC on group infrastructure
              across three waves and three years, with multi-currency
              subscriptions, regional ad-tech and affiliate commerce working
              from day one. The programme exceeded its $20M+ Year 1 revenue
              target and beat its audience benchmarks by 12%.
            </p>
            <p className="text-sm md:text-[15px] leading-relaxed opacity-85 font-medium">
              For the third wave I audited the earlier launches for friction,
              automated the repeatable work with LLM-driven guardrails, and
              rebuilt content placement using audience data from the previous
              launch — cutting time-to-market by 50% and lifting ad revenue per
              visit ~11%, with the same five-person delivery team.
            </p>
            <p className="text-sm md:text-[15px] leading-relaxed font-bold">
              Doing it once is a launch. Doing it three times, with the last one
              in half the time, is a playbook.
            </p>

            {CASE_STUDY_URL && (
              <Link
                to={CASE_STUDY_URL}
                className="mt-1 inline-flex items-center gap-1 min-h-[44px] text-[11px] font-bold uppercase tracking-widest text-m3-primary-container hover:gap-2 transition-all"
              >
                Read the full case study <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </section>

        {/* Three references, straight after the case study — proof follows
            the claim it supports. Own band, quieter than the /about
            treatment, deliberately calm after the dark case-study band. */}
        <div className="bg-m3-surface border-b border-m3-outline/10">
          <TestimonialQuotes />
        </div>

        {/* I also ship */}
        <section className="bg-m3-surface-variant border-b border-m3-outline/10 px-6 md:px-14 py-12 md:py-16">
          <Eyebrow>I also ship</Eyebrow>
          <p className="display mt-3 text-lg md:text-xl font-extrabold tracking-tight text-m3-on-surface mb-6">
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
        <section className="bg-m3-surface border-b border-m3-outline/10 px-6 md:px-14 py-12 md:py-16">
          <Eyebrow>Is this a fit?</Eyebrow>
          <div className="mt-6 grid md:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-m3-surface-variant/60 rounded-[24px] border border-m3-outline/5 p-6 md:p-8">
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

            <div className="bg-m3-surface-variant/60 rounded-[24px] border border-m3-outline/5 p-6 md:p-8">
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
        <section className="bg-m3-surface-variant px-6 md:px-14 pb-16 pt-12 md:pt-16">
          <div className="bg-m3-surface rounded-[28px] border border-m3-outline/5 p-8 md:p-12 text-center flex flex-col items-center gap-4">
            <h2 className="display text-2xl md:text-4xl font-extrabold uppercase tracking-tighter text-m3-on-surface">
              Book a 30-minute call
            </h2>
            <p className="text-sm md:text-base font-medium text-m3-on-surface-variant max-w-md leading-relaxed">
              No pitch. Tell me what you're dealing with and I'll tell you if I
              can help.
            </p>
            <div className="mt-2 flex flex-wrap min-[360px]:flex-nowrap items-center justify-center gap-2 sm:gap-3">
              <BookButton className="min-[360px]:flex-1 sm:flex-none" />
              <EmailButton className="min-[360px]:flex-1 sm:flex-none" />
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
