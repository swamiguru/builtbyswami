/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Sparkles,
  Clock,
  Hammer,
  Globe,
  Server,
  ScanSearch,
  Code2,
  Terminal,
  Cpu,
} from "lucide-react";
import { trackCta } from "../lib/analytics";
import { getLatestNotes, formatNoteDate } from "../data/notes";
import { BUILDS } from "../data/builds";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import TiltCard from "../components/TiltCard";
import { usePageSeo } from "../hooks/usePageSeo";

/** Screenshot for the Builds teaser, keyed by exact build name. Only the
 *  three with a usable phone-frame shot on hand get one — the rest keep the
 *  plain card rather than show a placeholder. */
const BUILD_SHOT: Record<string, string> = {
  "Long Press": "/builds/longpress.webp",
  "Free Word Tool": "/builds/freewordtool.webp",
  "अड्डा — Adda": "/builds/adda.webp",
  "Task management engine": "/builds/taskmanager.webp",
};

/** Vignette + grain + cursor-spotlight + sparkles stack shared by the
 * standard "Today's Five" rail cards and the featured hero card, so the two
 * treatments can't drift out of sync. Positions are tuned to the icon tile
 * icons.py always draws in the same corner of the 1080×1080 card art. Must
 * render inside a `relative overflow-hidden` (and, for the spotlight, a
 * `group`) ancestor that owns the --x/--y mousemove vars. */
function CardArtOverlay() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(130% 130% at 50% 35%, transparent 45%, rgba(0,0,0,.5) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />
      <div
        aria-hidden="true"
        className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,.35), transparent 60%)",
          mixBlendMode: "overlay",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute text-cyan-400 text-[13px] leading-none pointer-events-none animate-[sparkle-twinkle_2.6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-60"
        style={{ left: "62%", top: "60%" }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="absolute text-white text-[9px] leading-none pointer-events-none animate-[sparkle-twinkle_2.6s_ease-in-out_infinite] [animation-delay:0.9s] motion-reduce:animate-none motion-reduce:opacity-60"
        style={{ left: "91%", top: "73%" }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="absolute text-cyan-400 text-[8px] leading-none pointer-events-none animate-[sparkle-twinkle_2.6s_ease-in-out_infinite] [animation-delay:1.7s] motion-reduce:animate-none motion-reduce:opacity-60"
        style={{ left: "73%", top: "92%" }}
      >
        ✦
      </span>
    </>
  );
}

/** Hero credential. Kept as data so the lg card and the small-screen strip
 *  can't drift apart — they're the same three facts twice. */
const HOUSES = ["Condé Nast", "Newsweek", "Metro World News"];
const TITLES = ["Vogue", "GQ", "Wired", "Condé Nast Traveller", "Architectural Digest", "Vanity Fair", "Glamour", "Allure", "Pitchfork"];
const METRICS: { to: number; prefix?: string; suffix?: string; label: string }[] = [
  { to: 20, label: "brand launches" },
  { to: 5, label: "continents since 2015" },
  { to: 20, prefix: "$", suffix: "M", label: "peak year" },
];

/** Compressed one-line summaries of the five fixed-scope offers on
 *  /work-with-me. Kept as data, separate from that page's fuller SERVICES
 *  array, because the homepage needs a shorter blurb per offer — but the
 *  name, shape and terms must stay identical to avoid the two pages
 *  disagreeing with each other. The first entry is the audit, the
 *  "start here" offer, and renders as a full-width row above the other four. */
const CONSULTING_OFFERS: {
  icon: typeof Globe;
  name: string;
  meta: string;
  blurb: string;
  /** Featured (audit) card only: the areas it covers and what comes back,
   *  shown in a second column so the wide card isn't one short line. */
  covers?: string[];
  gets?: string[];
}[] = [
  {
    icon: ScanSearch,
    name: "Publisher Site Health Audit",
    meta: "1–2 weeks · fixed scope",
    blurb: "A written audit of how your site is actually found, measured and structured, not a crawler export. You get a ranked list of what to fix first, who owns it and how much effort each fix takes, so your team can start on Monday.",
    covers: ["Search & indexing", "Search Console", "GA4 & tagging", "Site structure"],
    gets: ["Ranked findings", "90-day fix plan", "45-minute readout"],
  },
  {
    icon: Globe,
    name: "Market Launch & Expansion Readiness",
    meta: "2–3 weeks · fixed scope",
    blurb: "A go-to-market plan for a new region, with the platform, content and commercial decisions already made.",
  },
  {
    icon: Server,
    name: "Platform & CMS Migration Readiness",
    meta: "2–3 weeks · fixed scope",
    blurb: "The replatform plan that protects your traffic and revenue through the cutover.",
  },
  {
    icon: Sparkles,
    name: "AI Workflow & Product Operations",
    meta: "2–3 weeks · fixed scope",
    blurb: "Real automation with guardrails, for a content or product workflow that hasn't caught up with AI.",
  },
  {
    icon: Hammer,
    name: "Build Sprint",
    meta: "2–3 weeks · fixed scope",
    blurb: "A working prototype in your hands, not a slide deck.",
  },
];

export default function Home() {
  // Six is the ceiling; the section header links to /builds for the rest.
  const homeBuilds = BUILDS.slice(0, 6);
  const shouldReduceMotion = useReducedMotion();

  usePageSeo("home");

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">

        {/* 01 — Nav */}
        <SiteHeader />

        {/* 01b — Router hero.
            The page used to open straight onto a story headline, which left a
            first-time visitor with no idea whose site this was. This states the
            positioning once and then forks: readers go down into the daily,
            everyone else goes sideways into the consulting page. Deliberately
            short — it frames the page, it doesn't compete with it. */}
        <section className="relative overflow-hidden px-6 md:px-14 pt-6 sm:pt-8 md:pt-14 pb-8 md:pb-14 bg-m3-surface-variant border-b border-m3-outline/10">
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-20 w-80 h-80 bg-m3-primary/10 rounded-full blur-3xl pointer-events-none"
          />
          {/* Two-column at md+: copy on the left, a large framed portrait on
              the right — order-first/order-last flips that to photo-above-copy
              on mobile. The portrait is deliberately small on mobile (a
              thumbnail, not a hero image) so the CTAs still land above the
              fold; it only grows into the big framed photo at md+, where
              there's room. Headline is a mixed-weight serif line — bold on
              every named title, regular on the connective text — which
              reads clearly even at a small size, so the font can shrink on
              mobile without the credential list turning to mush. */}
          <div className="relative z-10 grid md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 md:gap-12 lg:gap-16 md:items-center">
            <div className="order-2 md:order-1 min-w-0 max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/swami-guru-desk.webp"
                  alt="Swami Guru"
                  className="md:hidden w-11 h-11 rounded-2xl object-cover border border-m3-outline/15 shrink-0 bg-m3-on-surface"
                />
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-m3-on-surface-variant bg-m3-surface border border-m3-outline/15 rounded-m3-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-m3-primary" />
                  Taking new engagements
                </span>
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] md:text-xs tracking-wider font-medium text-m3-primary flex items-center gap-0.5 mb-3">
                <Terminal className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 opacity-80" aria-hidden="true" />
                build &rarr; ship &rarr; repeat
                <span
                  aria-hidden="true"
                  className="inline-block w-[2px] h-[11px] md:h-[13px] bg-m3-primary ml-1 translate-y-px animate-[blink_1.1s_steps(1)_infinite] motion-reduce:hidden"
                />
              </span>
              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="serif text-xl sm:text-2xl md:text-[2.5rem] lg:text-[2.75rem] font-normal tracking-tight text-m3-on-surface leading-[1.2] md:leading-[1.15] mb-3 md:mb-5"
              >
                I help <strong className="font-bold">publishers</strong> grow
                &mdash; and design, build, and ship my own products{" "}
                <strong className="font-bold">in public</strong>.
              </motion.h1>
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base md:text-xl text-m3-on-surface font-medium leading-relaxed mb-4 md:mb-7 max-w-2xl"
              >
                Product consulting for publishers &mdash; site audits for SEO,
                audience engagement, revenue opportunities; launching brands
                into new markets; CMS migrations; AI workflows. Plus the
                daily tech news over at{" "}
                <a
                  href="https://longpress.news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-m3-primary font-bold hover:underline underline-offset-4"
                >
                  longpress.news
                </a>
                .
              </motion.p>
              <p className="text-xs text-m3-on-surface-variant/70 italic mb-4 md:mb-6">
                Also now in early talks with The New Times.
              </p>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap min-[360px]:flex-nowrap items-center gap-2 sm:gap-3">
              <a
                href="https://longpress.news"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta("hero_read_daily", "home_hero")}
                className="inline-flex items-center justify-center gap-2 min-[360px]:flex-1 sm:flex-none bg-m3-primary text-m3-on-primary font-display font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-m3-full hover:m3-elevation-1-shadow active:scale-95 transition-all text-[13px] sm:text-sm tracking-wide whitespace-nowrap shadow-xs cursor-pointer"
              >
                Read today&rsquo;s five <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                to="/work-with-me"
                onClick={() => trackCta("hero_work_with_me", "home_hero")}
                className="inline-flex items-center justify-center gap-2 min-[360px]:flex-1 sm:flex-none bg-m3-surface text-m3-on-surface border border-m3-outline/20 font-display font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-m3-full hover:border-m3-primary/40 hover:text-m3-primary active:scale-95 transition-all text-[13px] sm:text-sm tracking-wide whitespace-nowrap"
              >
                Work with me <ArrowUpRight className="w-4 h-4" />
              </Link>
              </motion.div>
            </div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block relative order-2 w-full"
            >
              {/* Floating tech-stack chips. Gentle independent float per
                  chip (different duration/delay) so they don't move in
                  lockstep — reads as ambient, not a marquee. Purely
                  decorative, so aria-hidden; disabled under
                  prefers-reduced-motion like the rest of the hero. */}
              <motion.div
                aria-hidden="true"
                className="hidden lg:flex items-center gap-1.5 absolute -top-4 -right-5 z-10 bg-m3-surface/95 backdrop-blur border border-m3-outline/15 rounded-m3-full px-3 py-1.5 shadow-md font-mono text-[11px] font-medium text-m3-on-surface"
                animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Code2 className="w-3.5 h-3.5 text-m3-primary" />
                TypeScript
              </motion.div>
              <motion.div
                aria-hidden="true"
                className="hidden lg:flex items-center gap-1.5 absolute top-1/3 -left-6 z-10 bg-m3-surface/95 backdrop-blur border border-m3-outline/15 rounded-m3-full px-3 py-1.5 shadow-md font-mono text-[11px] font-medium text-m3-on-surface"
                animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <Cpu className="w-3.5 h-3.5 text-m3-primary" />
                AI-native
              </motion.div>
              <motion.div
                aria-hidden="true"
                className="hidden lg:flex items-center gap-1.5 absolute -bottom-4 right-6 z-10 bg-m3-surface/95 backdrop-blur border border-m3-outline/15 rounded-m3-full px-3 py-1.5 shadow-md font-mono text-[11px] font-medium text-m3-on-surface"
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <Terminal className="w-3.5 h-3.5 text-m3-primary" />
                Shipped in public
              </motion.div>

              <TiltCard
                max={4}
                className="relative aspect-[4/5] rounded-[32px] md:rounded-[40px] overflow-hidden border border-m3-outline/10 shadow-xl bg-m3-on-surface animate-[pulse-glow_4s_ease-in-out_infinite] motion-reduce:animate-none"
              >
                <img
                  src="/swami-guru-desk.webp"
                  alt="Swami Guru at his desk"
                  loading="eager"
                  className="w-full h-full object-cover grayscale contrast-110"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-m3-primary mix-blend-color opacity-25 pointer-events-none"
                />
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* Full-width credential band. Same three facts that used to be
            split across a desktop-only card and a mobile-only strip — now
            one component, one source of truth, visible at every width.
            Inverted (on-surface/surface) on purpose: it needs to read as a
            distinct "trust bar" register, not a continuation of the hero
            above or the offers below. */}
        <section className="bg-m3-on-surface text-m3-surface px-6 md:px-14 py-6 md:py-7 border-b border-m3-outline/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
            <div className="flex flex-wrap gap-x-8 gap-y-3 shrink-0">
              {METRICS.map((m) => (
                <div key={m.label} className="flex items-baseline gap-2.5">
                  <CountUp
                    to={m.to}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-primary-container leading-none tabular-nums"
                  />
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-80">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="hidden md:block w-px h-8 bg-m3-surface/15 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-60 mb-1">
                Product leadership at
              </p>
              <p className="font-display font-bold text-sm md:text-base leading-snug">
                {HOUSES.join(" · ")}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed opacity-70">{TITLES.join(" · ")}</p>
            </div>
          </div>
        </section>

        {/* What I do for clients. Consulting is the priority now, not the
            newsletter — this used to be a single link at the bottom of the
            hero copy. Same surface-variant family as the hero (they're one
            "about the business" zone); the accent bar further down is the
            actual seam into the reader-facing feed. */}
        <section className="px-6 md:px-14 py-10 md:py-14 bg-m3-surface-variant border-b border-m3-outline/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-m3-primary/50">01</span>
                  <span className="font-display text-xs font-black uppercase tracking-[0.25em] text-m3-primary">
                    what I do for clients
                  </span>
                </div>
                <h2 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface">
                  Product consulting for publishers and content-driven teams
                </h2>
              </div>
              <Link
                to="/work-with-me"
                onClick={() => trackCta("home_consulting_see_all", "home_consulting")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-m3-primary hover:underline underline-offset-4 shrink-0"
              >
                See all engagements <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONSULTING_OFFERS.map(({ icon: Icon, name, meta, blurb, covers, gets }, i) => (
              <Reveal key={name} index={i} className={i === 0 ? "sm:col-span-2 lg:col-span-4" : ""}>
                <TiltCard max={3} className={`relative overflow-hidden bg-m3-surface rounded-[24px] border border-m3-outline/5 p-5 flex flex-col h-full hover:border-m3-primary/30 hover:shadow-xl transition-all`}>
                  <span className="absolute top-3 right-4 font-mono text-[26px] font-bold text-m3-outline/10 tabular-nums leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={covers ? "lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:items-center" : "flex flex-col"}>
                    <div className="flex flex-col">
                      <span className="w-10 h-10 rounded-[14px] bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" strokeWidth={2.25} />
                      </span>
                      <h3 className={`font-display font-bold text-m3-on-surface leading-snug mb-1.5 ${covers ? "text-base md:text-lg" : "text-sm"}`}>
                        {name}
                      </h3>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-m3-on-surface-variant mb-2">
                        {meta}
                        {i === 0 && <span className="text-m3-primary"> · start here</span>}
                      </p>
                      <p className={`text-m3-on-surface-variant leading-relaxed ${covers ? "text-sm max-w-2xl" : "text-[13px]"}`}>{blurb}</p>
                    </div>
                    {covers && (
                      <div className="mt-5 lg:mt-0 lg:pl-10 lg:border-l border-m3-outline/10">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-m3-on-surface-variant mb-3">
                          What it covers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {covers.map((c) => (
                            <span
                              key={c}
                              className="text-[13px] font-bold text-m3-on-primary-container bg-m3-primary-container rounded-m3-full px-3 py-1.5"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                        {gets && (
                          <p className="mt-4 text-[13px] text-m3-on-surface-variant leading-relaxed">
                            <strong className="text-m3-on-surface font-bold">You get:</strong>{" "}
                            {gets.map((g, gi) => (
                              <span key={g} className="sm:whitespace-nowrap">
                                {g}
                                {gi < gets.length - 1 && " · "}
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                to="/work-with-me"
                onClick={() => trackCta("home_consulting_work_with_me", "home_consulting")}
                className="inline-flex items-center justify-center gap-2 bg-m3-primary text-m3-on-primary font-display font-bold px-6 py-3 rounded-m3-full hover:m3-elevation-1-shadow active:scale-95 transition-all text-sm tracking-wide shadow-xs cursor-pointer"
              >
                Work with me <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 08 — Builds.
            Follows the offers on purpose: a prospective client reads what I
            do, then sees what I actually build. Notes come next, then the
            closing fork ("the operator behind the builds"). The newsletter
            block that used to sit here was removed while the list is
            dormant; see git history to restore it. */}
        <section className="px-6 md:px-14 py-12 md:py-16 bg-m3-surface border-t border-m3-outline/10">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[12px] bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
                <Hammer className="w-4 h-4" />
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] font-bold text-m3-on-surface-variant/40">02</span>
                <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-on-surface">
                  Builds
                </span>
              </span>
            </div>
            <Link
              to="/builds"
              className="text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant hover:text-m3-primary transition-colors flex items-center gap-1"
            >
              All builds <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {/* Every build shows, capped at six. A carousel was considered and
              rejected: this section's whole job is "look how much shipped", and
              a carousel hides two thirds of it behind a swipe. A wrapping grid
              scales to six with no redesign. Two columns at exactly four, so
              the fourth card isn't stranded alone on its own row. */}
          <div
            className={`grid grid-cols-2 gap-3 md:gap-4 ${
              homeBuilds.length === 4 ? "lg:grid-cols-2" : "lg:grid-cols-3"
            }`}
          >
            {homeBuilds.map((build, bi) => {
              // Not everything shipped has somewhere to go — the task engine was
              // never published. Those cards point at the write-up instead of a
              // dead "Open it", which is why they can be shown at all.
              const shot = BUILD_SHOT[build.name];
              const cardClass =
                "group bg-m3-surface-variant/40 rounded-[24px] border border-m3-outline/5 overflow-hidden flex flex-col hover:bg-m3-surface hover:border-m3-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all h-full";

              const inner = (
                <>
                  {shot && (
                    <div className="relative h-36 sm:h-44 md:h-64 overflow-hidden bg-m3-on-surface shrink-0 flex items-center justify-center">
                      <img
                        src={shot}
                        alt={`${build.name} screenshot`}
                        loading="lazy"
                        className="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-m3-on-surface/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}
                  <div className="p-3.5 sm:p-5 md:p-6 flex flex-col gap-2 md:gap-3 flex-1">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-m3-primary">
                      {build.status}
                    </span>
                    <span className="display text-sm md:text-lg font-extrabold tracking-tight text-m3-on-surface">
                      {build.name}
                    </span>
                    <span className="text-xs md:text-sm leading-relaxed text-m3-on-surface-variant font-medium line-clamp-2 md:line-clamp-3">
                      {build.what}
                    </span>
                    <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-m3-primary group-hover:gap-1.5 transition-all">
                      {build.url ? (
                        <>
                          Open it <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          How it was built <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </div>
                </>
              );

              return build.url ? (
                <Reveal key={build.name} index={bi}>
                <a
                  href={build.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
                </Reveal>
              ) : (
                <Reveal key={build.name} index={bi}>
                <Link
                  to={build.noteSlug ? `/notes/${build.noteSlug}` : "/builds"}
                  className={cardClass}
                >
                  {inner}
                </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* 06 — Notes */}
        <section id="notes" className="px-6 md:px-14 py-12 md:py-16 bg-m3-surface-variant border-t border-m3-outline/10">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[12px] bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] font-bold text-m3-on-surface-variant/40">03</span>
                <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-on-surface">
                  Notes
                </span>
              </span>
            </div>
            <Link
              to="/notes"
              className="text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant hover:text-m3-primary transition-colors flex items-center gap-1"
            >
              All notes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {getLatestNotes(3).map((note) => (
              <Link
                key={note.slug}
                to={`/notes/${note.slug}`}
                className="group bg-m3-surface rounded-[28px] border border-m3-outline/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-6 hover:border-m3-primary/30 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-[16px] bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-m3-primary mb-2">
                    {note.tag} · {note.readMinutes} min read · {formatNoteDate(note.date)}
                  </div>
                  <h3 className="display text-lg md:text-xl font-extrabold tracking-tight text-m3-on-surface mb-2 group-hover:text-m3-primary transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-m3-on-surface-variant font-medium max-w-xl line-clamp-2">
                    {note.description}
                  </p>
                </div>
                <span className="m3-button-tonal text-sm tracking-wide whitespace-nowrap flex items-center gap-2 shrink-0">
                  Read <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 09 — Second fork.
            Anyone who scrolled a whole publication homepage is interested in
            who wrote it. This used to offer one vague exit ("The full story");
            it now names both, so the reader picks rather than guessing. */}
        <section className="px-6 md:px-14 py-7 md:py-9 bg-m3-primary text-m3-on-primary">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] font-bold text-m3-on-primary/35">04</span>
              <span className="font-display text-xs font-black uppercase tracking-[0.25em] text-m3-on-primary/60">
                The operator behind the builds
              </span>
            </div>
            <h2 className="display text-xl md:text-[1.75rem] font-bold tracking-tighter leading-[0.95] mb-5">
              11 years, three global media companies, $20M+ scaled — now an AI product builder shipping solo from Bengaluru.
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/about"
                onClick={() => trackCta("fork_the_work", "home_fork")}
                className="inline-flex items-center gap-2 bg-m3-surface text-m3-on-surface font-display font-bold px-6 py-2.5 rounded-m3-full hover:m3-elevation-2 active:scale-95 transition-all text-sm tracking-wide"
              >
                The work <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/work-with-me"
                onClick={() => trackCta("fork_work_with_me", "home_fork")}
                className="inline-flex items-center gap-2 border border-m3-on-primary/40 text-m3-on-primary font-display font-bold px-6 py-2.5 rounded-m3-full hover:bg-m3-on-primary/10 active:scale-95 transition-all text-sm tracking-wide"
              >
                Work with me <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 10 — Footer */}
        <SiteFooter />
      </div>
    </div>
  );
}
