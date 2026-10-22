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
  ChevronDown,
  Globe,
  Hammer,
  Mail,
  ScanSearch,
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
const REPLATFORM_CASE_STUDY_URL = "/case-study/replatforming";

interface Service {
  icon: typeof Globe;
  name: string;
  meta: string;
  body: string;
}

const SERVICES: Service[] = [
  {
    icon: ScanSearch,
    name: "Publisher Site Health Audit",
    meta: "1–2 weeks · fixed scope · start here",
    body: "A written audit of how your site is actually found, measured and structured, not a crawler export. Search and indexing, Google Search Console, GA4 and tag setup, site architecture and navigation, and the technical issues quietly costing you traffic. You get a ranked list of what to fix first, who owns it and how much effort each fix takes, so your team can start on Monday.",
  },
  {
    icon: Globe,
    name: "Market Launch & Expansion Readiness",
    meta: "2–3 weeks · fixed scope",
    body: "A written go-to-market plan for a new region, with the platform, content, commercial and regulatory decisions already made — not a list of things to figure out. Audience and revenue modelling, platform readiness, localisation architecture, ad and commerce stack, launch sequencing, and the risks that actually move launch dates.",
  },
  {
    icon: Server,
    name: "Platform & CMS Migration Readiness",
    meta: "2–3 weeks · fixed scope",
    body: "The replatform plan that protects your traffic and revenue through the cutover. Content modelling, taxonomy, redirect and SEO strategy, integration surface, ad and commerce continuity, your team's workflow on the far side, and a phased cutover you can defend to your board.",
  },
  {
    icon: Sparkles,
    name: "AI Workflow & Product Operations",
    meta: "2–3 weeks · fixed scope",
    body: "For teams whose content or product workflow hasn't caught up with what AI can actually do. I map where the manual work is, build the automation with real guardrails, and hand your team something they'll actually use — not a policy doc, not a workshop. This is the same approach that cut a launch programme's time-to-market by 50% and lifted ad revenue per visit ~11%, with the same five-person team.",
  },
  {
    icon: Hammer,
    name: "Build Sprint",
    meta: "2–3 weeks · fixed scope",
    body: "A working prototype in your hands, not a slide deck. For teams who need to see the thing before committing engineering to it. I build and ship my own products — this is that, pointed at your problem.",
  },
];

/** What sits inside the audit card. Shown as its own panel under the offers
 *  list so the card itself stays the same length as its neighbours. Proof is
 *  drawn only from the author's own sites. */
const AUDIT_TRIGGERS: string[] = [
  "Search traffic dropped and nobody can say why.",
  "You replatformed and never checked what broke.",
  "Your analytics, your ad server and your editors each report a different number.",
  "You're planning a migration or a launch and want a baseline first.",
];

const AUDIT_SCOPE: [string, string][] = [
  [
    "Search and indexing",
    "Crawl and index coverage, sitemaps, canonicals, redirects, structured data, page speed.",
  ],
  [
    "Google Search Console",
    "Which sections and query types earn clicks, what isn't being indexed, and why.",
  ],
  [
    "Analytics",
    "GA4 and Tag Manager setup, event and conversion tracking, consent, cross-domain measurement, and whether the numbers can be trusted.",
  ],
  [
    "Site structure",
    "Navigation, naming, taxonomy and internal linking, and where good content is buried.",
  ],
];

interface Detail {
  takeaways: string[];
  start: string[];
  cover: [string, string][];
  get: string;
  not: string;
  proof: string;
  proofLink?: { label: string; to: string };
}

/** Collapsible panel content per offer, keyed by Service.name. */
const DETAILS: Record<string, Detail> = {
  "Publisher Site Health Audit": {
    takeaways: ["Ranked findings", "90-day fix plan", "45-minute readout"],
    start: AUDIT_TRIGGERS,
    cover: AUDIT_SCOPE,
    get: "A ranked findings list with severity, owner and effort. A 90-day fix plan. A 45-minute readout with your team.",
    not: "Ongoing monitoring, or doing the fixes for you. I hand your team the plan. If it points to a launch, a migration or a workflow problem, the offers below are the next step.",
    proof:
      "I audit my own sites the same way. On builtbyswami.com and Long Press I found a sitemap that returned a web page instead of XML, so search engines couldn't use it; a category rule that filed 39 commentary pieces under News, so my own reports described a different publication from the one I was running; and a Tag Manager container that never listened for the events my site was sending, so none of my button clicks reached Google Analytics. All three are fixed. I also moved a 60-issue archive to a new domain behind permanent redirects.",
  },
  "Market Launch & Expansion Readiness": {
    takeaways: ["Go-to-market plan", "Go/No-Go framework", "Ranked launch risks"],
    start: [
      "You've approved a new region, but the business case rests on interest rather than numbers.",
      "Your global platform has never been tested for this region's currencies, languages or ad tech.",
      "A licence or privacy requirement could move your launch date, and nobody has mapped it.",
      "Your central and local teams don't share a playbook.",
    ],
    cover: [
      ["Business case", "Audience sizing and a five-year model with localised monetisation, capex, opex and a breakeven date."],
      ["Platform readiness", "CMS integration, localised rendering, multi-currency payments, ad-tech delivery and automated SEO indexing."],
      ["Operational enablement", "Playbooks, governance, taxonomy mapping, aligned workflows and unified analytics between central and local teams."],
      ["Regulatory timing", "Licensing and data-privacy requirements mapped early, with schedule buffer built into the plan."],
    ],
    get: "A written go-to-market plan with the platform, content, commercial and regulatory decisions already made. Launch sequencing. A Go/No-Go framework across technical, editorial, legal and commercial readiness. The risks that actually move launch dates, ranked.",
    not: "Running the launch itself. If you want me in the seat through go-live, that is the fractional engagement below.",
    proof:
      "Five titles, three waves, three years. Exceeded the $20M+ Year 1 target, and the third wave shipped in half the time.",
    proofLink: { label: "Read the launches case study.", to: CASE_STUDY_URL },
  },
  "Platform & CMS Migration Readiness": {
    takeaways: ["Replatform plan", "Redirect and SEO strategy", "Phased cutover plan"],
    start: [
      "A replatform is planned or approved and you're afraid of what the cutover costs you.",
      "Traffic dipped after your last migration and nobody can say why.",
      "Nobody owns the redirect map.",
      "Around fifteen integrations fire on every page view and none of them has a named owner.",
    ],
    cover: [
      ["Content model and taxonomy", "What moves, what changes shape, and what quietly ranks by accident."],
      ["Redirects and SEO", "An editorial owner for the redirect map, plus pre- and post-launch audits sized to your markets."],
      ["Integration surface", "Ads, consent, affiliate, newsletters, subscription state, recommendations, tag manager and Search Console, each with a named owner and an after-launch check."],
      ["Newsroom and cutover", "Training, documentation and parallel running for your editors, and a phased cutover that starts with your smallest property, with a rollback plan."],
    ],
    get: "The replatform plan, and a document that names every team touching the property, what each does before and after cutover, and who is accountable by name. A redirect and SEO strategy. A phased cutover you can defend to your board.",
    not: "Doing the migration or building the platform.",
    proof:
      "Thirteen properties across four brands in eight years. Organic dipped slightly at cutover and recovered in about a week, and no rollback was ever used.",
    proofLink: { label: "Read the replatforming case study.", to: REPLATFORM_CASE_STUDY_URL },
  },
  "AI Workflow & Product Operations": {
    takeaways: ["Mapped workflow", "Working automation", "Team handover"],
    start: [
      "Your team does repeatable work by hand: metadata, social copy, translation passes, configuration.",
      "You've run AI pilots that produced a policy document or a workshop, and no change in how the work gets done.",
      "You want automation, but you don't trust it without checks.",
    ],
    cover: [
      ["Workflow map", "Where the manual work is, and which of it is repeatable and expensive."],
      ["Automation with guardrails", "The automation built into your team's workflow, with automated checks replacing manual oversight."],
      ["Measurement", "Time-to-market and quality measured before and after, so the gain is a number."],
      ["Handover", "Something your team will actually use. Not a policy document, not a workshop."],
    ],
    get: "A mapped workflow with the repeatable work ranked, working automation for the highest-value steps with guardrails, and a handover your team can run without me.",
    not: "A policy document, a workshop, or ongoing tooling support.",
    proof:
      "The same approach cut a launch programme's time-to-market by 50% and lifted ad revenue per visit by about 11%, with the same five-person team.",
  },
  "Build Sprint": {
    takeaways: ["Working prototype", "Short written brief", "Engineer handover note"],
    start: [
      "You have an idea that has lived in slide decks for months.",
      "You need to see it working before you commit engineering to it.",
      "You want to test a workflow or a tool with real users, fast.",
    ],
    cover: [
      ["One problem", "Chosen with you, and written down as a constraint before anything is built."],
      ["A working prototype", "Something you can click and put in front of people, not a mockup."],
      ["A stack that fits", "Chosen to match what your team can take over."],
    ],
    get: "A working prototype you can open and use, a short written brief covering what it is, the constraint and what broke, and a handover note for your engineers.",
    not: "Production engineering, or owning your codebase. I'm a product lead, not your engineering hire.",
    proof:
      "I build and ship my own products: Long Press has run daily since 12 July, and Free Word Tool shipped in a one-day sprint.",
    proofLink: { label: "See Builds.", to: "/builds" },
  },
};

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
    "Your search traffic has slipped, or you don't trust your analytics, and you don't know where to look first.",
    "The audit tells you what's broken and what to fix first in a week or two. It's also the shortest way to find out whether you need one of the bigger engagements below.",
  ],
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
    "I scope before I quote, and I don't discount to win work — I'd rather point you to someone cheaper than deliver a thin version of this.",
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

function AuditButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={CAL_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta("consulting_book_audit", "work_with_me_audit")}
      className={`inline-flex items-center justify-center gap-2 bg-m3-primary text-m3-on-primary font-display font-bold px-4 sm:px-7 py-3 sm:py-3.5 rounded-m3-full transition-all hover:m3-elevation-1-shadow active:scale-95 shadow-sm text-[13px] sm:text-base whitespace-nowrap ${className}`}
    >
      Book a 30-min call about the audit <ArrowRight className="w-4 h-4" />
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
            Site audits, new markets, replatforms, AI in the workflow.
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
            five offers read as a menu, not five repeats of the same shape.
            The audit leads ("start here") and has its own panel under the
            list. Fractional Product Lead sits apart below, deliberately
            styled differently — it isn't fixed-scope like the five above it. */}
        <section className="bg-m3-surface border-b border-m3-outline/10 px-6 md:px-14 py-12 md:py-16">
          <Eyebrow tone="primary">What I do</Eyebrow>
          <p className="mt-3 text-sm md:text-base font-medium text-m3-on-surface-variant max-w-2xl mb-2 leading-relaxed">
            Five ways to start. Each is fixed scope and fixed price, quoted
            once I understand what you're dealing with, and each ends with
            something you can act on. If you're not sure where to begin,
            begin with the audit.
          </p>

          <div className="flex flex-col">
            {SERVICES.map(({ icon: Icon, name, meta, body }, i) => (
              <div
                key={name}
                className={`py-7 md:py-9 flex flex-col md:flex-row md:items-start gap-4 md:gap-10 ${
                  i !== 0 ? "border-t border-m3-outline/10" : ""
                }`}
              >
                <div className="md:w-56 shrink-0 flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <span className="display text-3xl md:text-4xl font-extrabold text-m3-outline/25 tabular-nums leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="w-11 h-11 shrink-0 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                  </div>
                  {/* Desktop only: fills the gutter under the number with the
                      three things you walk away with. */}
                  <div className="hidden md:block">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-m3-on-surface-variant/60">
                      You walk away with
                    </span>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {DETAILS[name].takeaways.map((t) => (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-[13px] leading-snug font-semibold text-m3-on-surface"
                        >
                          <Check className="w-3.5 h-3.5 mt-[2px] shrink-0 text-m3-primary" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
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

                  {/* Native <details>: crawlable, no JS. The audit starts
                      open because it is the front door. */}
                  <details
                    open={i === 0}
                    className="group mt-4 bg-m3-surface-variant/60 rounded-[20px] border border-m3-outline/10"
                  >
                    <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer select-none rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-m3-primary flex items-center justify-between gap-3 px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-m3-primary">
                      <span>Inside this offer</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-6 pt-3 flex flex-col gap-6">
                      <div>
                        <h4 className="display text-lg md:text-xl font-extrabold tracking-tight text-m3-on-surface">
                          Start here if
                        </h4>
                        <ul className="mt-3 flex flex-col gap-2 max-w-3xl">
                          {DETAILS[name].start.map((t) => (
                            <li
                              key={t}
                              className="flex items-start gap-2 text-sm leading-relaxed text-m3-on-surface-variant font-medium"
                            >
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-m3-primary shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                        {DETAILS[name].cover.map(([label, detail]) => (
                          <div
                            key={label}
                            className="bg-m3-surface rounded-[16px] border border-m3-outline/10 px-4 py-3.5"
                          >
                            <span className="text-sm font-bold text-m3-on-surface">{label}</span>
                            <p className="mt-1 text-[13px] leading-snug text-m3-on-surface-variant font-medium">
                              {detail}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 max-w-3xl text-sm leading-relaxed text-m3-on-surface-variant font-medium">
                        <p>
                          <strong className="text-m3-on-surface font-bold">What you get.</strong>{" "}
                          {DETAILS[name].get}
                        </p>
                        <p>
                          <strong className="text-m3-on-surface font-bold">What it doesn't include.</strong>{" "}
                          {DETAILS[name].not}
                        </p>
                        <p>
                          <strong className="text-m3-on-surface font-bold">Where I've done it.</strong>{" "}
                          {DETAILS[name].proof}
                          {DETAILS[name].proofLink && (
                            <>
                              {" "}
                              <Link
                                to={DETAILS[name].proofLink!.to}
                                className="font-bold text-m3-primary hover:underline"
                              >
                                {DETAILS[name].proofLink!.label}
                              </Link>
                            </>
                          )}
                        </p>
                      </div>

                      {i === 0 && (
                        <div>
                          <AuditButton />
                        </div>
                      )}
                    </div>
                  </details>
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
            A site audit, a market launch or a replatform isn't a
            product-team problem. Getting it right means getting all of the
            functions below to agree and stay agreed, through the fixes or
            through cutover — not just shipping the roadmap. That's why the
            plans and findings on this page cover the ad stack, the legal
            sign-off and the SEO strategy, not just the product decisions.
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

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-x-7 gap-y-1">
              {CASE_STUDY_URL && (
                <Link
                  to={CASE_STUDY_URL}
                  className="inline-flex items-center gap-1 min-h-[44px] text-[11px] font-bold uppercase tracking-widest text-m3-primary-container hover:gap-2 transition-all"
                >
                  Read the launches case study <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <Link
                to={REPLATFORM_CASE_STUDY_URL}
                className="inline-flex items-center gap-1 min-h-[44px] text-[11px] font-bold uppercase tracking-widest text-m3-primary-container hover:gap-2 transition-all"
              >
                Read the replatforming case study <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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
