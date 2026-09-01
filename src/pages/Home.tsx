/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  BookOpen,
  Sparkles,
  Clock,
  Hammer,
  Search,
  Globe,
  Server,
} from "lucide-react";
import { SOCIALS } from "../data/socials";
import { getLatestDigest, formatDigestDate, getTopCategories } from "../data/social";
import { useLatestWeekly } from "../hooks/useLatestWeekly";
import { trackCta } from "../lib/analytics";
import { getLatestNotes, formatNoteDate } from "../data/notes";
import { BUILDS } from "../data/builds";
import { NEWSLETTER_TITLE, NEWSLETTER_PROMISE } from "../data/newsletter";
import Carousel from "../components/Carousel";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import NewsletterSignup from "../components/NewsletterSignup";
import { useScrambleText } from "../hooks/useScrambleText";
import { usePageSeo } from "../hooks/usePageSeo";

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
const METRICS: [string, string][] = [
  ["20", "brand launches"],
  ["5", "continents since 2015"],
  ["$20M", "peak year"],
];

/** Compressed one-line summaries of the four fixed-scope offers on
 *  /work-with-me. Kept as data, separate from that page's fuller SERVICES
 *  array, because the homepage needs a shorter blurb per offer — but the
 *  name, shape and price must stay identical to avoid the two pages
 *  disagreeing with each other. */
const CONSULTING_OFFERS: { icon: typeof Globe; name: string; meta: string; blurb: string }[] = [
  {
    icon: Globe,
    name: "Market Launch & Expansion Readiness",
    meta: "2–3 weeks · from ₹2,00,000",
    blurb: "A go-to-market plan for a new region, with the platform, content and commercial decisions already made.",
  },
  {
    icon: Server,
    name: "Platform & CMS Migration Readiness",
    meta: "2–3 weeks · from ₹2,00,000",
    blurb: "The replatform plan that protects your traffic and revenue through the cutover.",
  },
  {
    icon: Sparkles,
    name: "AI Workflow & Product Operations",
    meta: "2–3 weeks · from ₹2,00,000",
    blurb: "Real automation with guardrails, for a content or product workflow that hasn't caught up with AI.",
  },
  {
    icon: Hammer,
    name: "Build Sprint",
    meta: "2–3 weeks · from ₹2,50,000",
    blurb: "A working prototype in your hands, not a slide deck.",
  },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const roundupKicker = useScrambleText("The Daily Five");
  const navigate = useNavigate();
  const [roundupSearch, setRoundupSearch] = useState("");

  const latestDigest = getLatestDigest();
  // Lead story for the day: whichever post is explicitly marked `featured`,
  // falling back to the first post so today's content (and any digest that
  // hasn't adopted the field yet) still gets a hero instead of nothing.
  const heroPost = latestDigest?.posts.find((p) => p.featured) ?? latestDigest?.posts[0];
  const railPosts = latestDigest ? latestDigest.posts.filter((p) => p.n !== heroPost?.n) : [];
  const categories = getTopCategories();
  const latestIssue = useLatestWeekly();
  // Six is the ceiling; the section header links to /builds for the rest.
  const homeBuilds = BUILDS.slice(0, 6);

  const handleRoundupSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (roundupSearch.trim()) {
      navigate(`/tech-roundup?q=${encodeURIComponent(roundupSearch.trim())}`);
    } else {
      navigate("/tech-roundup");
    }
  };

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
        <section className="relative overflow-hidden px-6 md:px-14 pt-10 md:pt-14 pb-10 md:pb-14 bg-m3-surface-variant border-b border-m3-outline/10">
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-20 w-80 h-80 bg-m3-primary/10 rounded-full blur-3xl pointer-events-none"
          />
          {/* Single column now. The credential facts (launches, houses,
              titles) used to live here twice — a desktop sidebar card and a
              separate mobile strip — just to fill the second grid track.
              They've moved to their own full-width band below, so the
              headline gets the whole hero to itself at every width. */}
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/swami-guru.jpg"
                alt="Swami Guru"
                className="w-11 h-11 rounded-full object-cover border border-m3-outline/15 shrink-0"
              />
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-m3-on-surface-variant bg-m3-surface border border-m3-outline/15 rounded-m3-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-m3-primary" />
                Taking new engagements
              </span>
            </div>
            <span className="font-display text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-extrabold text-m3-primary block mb-4">
              build · ship · repeat
            </span>
            <h1 className="display text-[1.9rem] md:text-[3.15rem] font-extrabold tracking-tighter text-m3-on-surface leading-[1.05] mb-5">
              I spent eleven years leading product for global publishing
              brands. Now I design, build, and ship my own &mdash; in public.
            </h1>
            <p className="text-base md:text-xl text-m3-on-surface font-medium leading-relaxed mb-7 max-w-2xl">
              Product consulting for publishers and content-driven teams making
              the hard moves &mdash; new markets, replatforms, AI in the workflow.
              Plus the daily five and build notes from what I ship solo.
            </p>

            <div className="flex flex-wrap min-[360px]:flex-nowrap items-center gap-2 sm:gap-3">
            <a
              href="#daily-five"
              onClick={() => trackCta("hero_read_daily", "home_hero")}
              className="inline-flex items-center justify-center gap-2 min-[360px]:flex-1 sm:flex-none bg-m3-primary text-m3-on-primary font-display font-bold px-4 sm:px-6 py-3 rounded-m3-full hover:m3-elevation-1-shadow active:scale-95 transition-all text-[13px] sm:text-sm tracking-wide whitespace-nowrap shadow-xs cursor-pointer"
            >
              Read today&rsquo;s five <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/work-with-me"
              onClick={() => trackCta("hero_work_with_me", "home_hero")}
              className="inline-flex items-center justify-center gap-2 min-[360px]:flex-1 sm:flex-none bg-m3-surface text-m3-on-surface border border-m3-outline/20 font-display font-bold px-4 sm:px-6 py-3 rounded-m3-full hover:border-m3-primary/40 hover:text-m3-primary active:scale-95 transition-all text-[13px] sm:text-sm tracking-wide whitespace-nowrap"
            >
              Work with me <ArrowUpRight className="w-4 h-4" />
            </Link>
            </div>
            <p className="mt-4 text-[13px] md:text-sm text-m3-on-surface-variant font-medium">
              Currently building{" "}
              <a
                href="https://adda.builtbyswami.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-m3-primary font-bold hover:underline underline-offset-4"
              >
                adda.builtbyswami.com
              </a>
            </p>
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
              {METRICS.map(([value, label]) => (
                <div key={value} className="flex items-baseline gap-2.5">
                  <span className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-primary-container leading-none">
                    {value}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-80">
                    {label}
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
              {CONSULTING_OFFERS.map(({ icon: Icon, name, meta, blurb }, i) => (
                <div key={name} className="relative overflow-hidden bg-m3-surface rounded-[24px] border border-m3-outline/5 p-5 flex flex-col hover:border-m3-primary/30 hover:shadow-xl transition-all">
                  <span className="absolute top-3 right-4 font-mono text-[26px] font-bold text-m3-outline/10 tabular-nums leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-10 h-10 rounded-[14px] bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" strokeWidth={2.25} />
                  </span>
                  <h3 className="font-display font-bold text-sm text-m3-on-surface leading-snug mb-1.5">
                    {name}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-m3-on-surface-variant mb-2">
                    {meta}
                  </p>
                  <p className="text-[13px] text-m3-on-surface-variant leading-relaxed">{blurb}</p>
                </div>
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

        {/* Deliberate seam: the hero and the feed below read as the same
            section without a visible break here (verified — the two share
            near-identical bold headline treatments). A plain 1px border
            wasn't enough; this accent bar is. */}
        <div aria-hidden="true" className="h-1 md:h-1.5 bg-gradient-to-r from-m3-primary via-m3-primary/50 to-transparent" />

        {/* 02 — The Daily Five (LEAD) */}
        <section
          id="daily-five"
          className="relative overflow-hidden px-6 md:px-14 pt-10 md:pt-16 pb-10 md:pb-14 bg-m3-surface scroll-mt-[88px]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-m3-primary/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-bold text-m3-primary/50">02</span>
                <div className="inline-flex items-center gap-2.5 bg-m3-primary-container/60 rounded-m3-full pl-3 pr-4 py-2">
                  <Sparkles className="w-4 h-4 text-m3-primary" />
                  <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-primary">
                    {roundupKicker}
                  </span>
                </div>
              </div>
              <Link
                to="/tech-roundup"
                className="text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant hover:text-m3-primary transition-colors flex items-center gap-1"
              >
                All roundups <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {latestDigest ? (
              <>
                {/* h2, not h1 — the router hero above owns the page's single h1. */}
                <h2 className="display text-2xl md:text-4xl font-extrabold tracking-tighter text-m3-on-surface max-w-3xl leading-[1.05] mb-4">
                  {latestDigest.title}
                </h2>
                <p className="text-base md:text-lg text-m3-on-surface-variant font-medium max-w-2xl leading-relaxed mb-8">
                  {latestDigest.intro}
                </p>
                <div className="mb-5 text-[11px] font-bold uppercase tracking-widest text-m3-primary">
                  {formatDigestDate(latestDigest.date)} · today's five
                </div>

                {heroPost && (
                  <motion.div
                    role="listitem"
                    className="group mb-6"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: "some" }}
                    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
                      e.currentTarget.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
                    }}
                  >
                    <Link
                      to={`/tech-roundup/${latestDigest.date}#post-${heroPost.n}`}
                      className="grid md:grid-cols-2 bg-m3-surface-variant/40 rounded-[24px] border border-m3-outline/5 overflow-hidden hover:bg-m3-surface hover:border-m3-primary/30 hover:shadow-xl transition-all"
                    >
                      {heroPost.image && (
                        <div className="relative overflow-hidden aspect-[16/9] md:aspect-auto">
                          <img
                            src={heroPost.image}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <CardArtOverlay />
                          {/* Right corner, not left — the pillar pill baked into the
                              card art (icons.py's pill(), always left-aligned near
                              the top) sits close beneath the top-left on this crop,
                              so a left badge here crowds it. Right stays clear. */}
                          <span className="absolute top-4 right-4 z-[1] text-[10px] font-black uppercase tracking-[0.15em] bg-m3-primary text-white px-3 py-1.5 rounded-full">
                            Today's lead
                          </span>
                        </div>
                      )}
                      <div className="p-6 md:p-10 flex flex-col justify-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-m3-primary">
                          {heroPost.pillar}
                        </span>
                        <h2 className="display text-2xl md:text-3xl font-extrabold tracking-tight text-m3-on-surface leading-snug">
                          {heroPost.hook}
                        </h2>
                        {heroPost.body && (
                          <p className="text-sm md:text-base leading-relaxed text-m3-on-surface-variant font-medium line-clamp-3">
                            {heroPost.body}
                          </p>
                        )}
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-m3-primary">
                          Read the take <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )}

                <Carousel ariaLabel="Today's tech roundup" showDots>
                  {railPosts.map((p, i) => (
                    <motion.div
                      key={p.n}
                      role="listitem"
                      className="group snap-start shrink-0 w-[calc(100vw_-_104px)] max-w-[360px] md:w-[340px] md:max-w-none"
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: "some" }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0.7, 0.3, 1] }}
                      onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
                        e.currentTarget.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
                      }}
                    >
                      <Link
                        to={`/tech-roundup/${latestDigest.date}#post-${p.n}`}
                        className="block h-full bg-m3-surface-variant/40 rounded-[24px] border border-m3-outline/5 overflow-hidden flex flex-col hover:bg-m3-surface hover:border-m3-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        {p.image && (
                          <div className="relative overflow-hidden">
                            <img
                              src={p.image}
                              alt=""
                              loading="lazy"
                              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <CardArtOverlay />
                          </div>
                        )}
                        <div className="p-6 flex flex-col gap-2 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-m3-primary">
                            {p.pillar}
                          </span>
                          <p className="text-[15px] leading-snug text-m3-on-surface font-bold line-clamp-3">
                            {p.hook}
                          </p>
                          {p.problem && (
                            <p className="text-[13px] leading-snug text-m3-on-surface-variant font-medium line-clamp-2">
                              {p.problem}
                            </p>
                          )}
                          <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-m3-primary group-hover:gap-1.5 transition-all">
                            Read the take <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </Carousel>
              </>
            ) : (
              <div className="bg-m3-surface-variant/40 rounded-[24px] border border-m3-outline/5 p-8 flex flex-col md:flex-row md:items-center gap-5">
                <div className="flex-1">
                  <p className="font-display font-bold text-m3-on-surface mb-1">The daily roundup is coming online</p>
                  <p className="text-sm text-m3-on-surface-variant font-medium">
                    Fresh tech & AI stories will land here every day. In the meantime, follow along:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`@builtbyswami on ${s.name}`}
                      className="w-10 h-10 bg-m3-surface text-m3-on-surface-variant rounded-full flex items-center justify-center hover:bg-m3-primary hover:text-m3-on-primary transition-colors shadow-sm border border-m3-outline/10"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                        <path d={s.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {categories.length > 0 && (
              <div className="mt-8 pt-6 border-t border-m3-outline/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div
                  className="flex md:flex-wrap flex-nowrap items-center gap-2 overflow-x-auto md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0 pb-1 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant/60 mr-1">
                    Browse
                  </span>
                  {categories.map(({ category, count }) => (
                    <Link
                      key={category}
                      to={`/tech-roundup?category=${encodeURIComponent(category)}`}
                      className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-m3-surface-variant/60 text-m3-on-surface hover:bg-m3-primary hover:text-m3-on-primary transition-colors"
                    >
                      {category} <span className="opacity-60">({count})</span>
                    </Link>
                  ))}
                </div>

                <form
                  onSubmit={handleRoundupSearch}
                  className="relative shrink-0 w-full md:w-64"
                >
                  <Search className="w-3.5 h-3.5 text-m3-on-surface-variant/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={roundupSearch}
                    onChange={(e) => setRoundupSearch(e.target.value)}
                    placeholder="Search all stories..."
                    className="w-full bg-m3-surface-variant/60 text-m3-on-surface placeholder:text-m3-on-surface-variant/50 text-xs font-medium rounded-full pl-9 pr-8 py-2 border border-m3-outline/15 focus:border-m3-primary focus:bg-m3-surface focus:outline-hidden transition-all shadow-2xs"
                  />
                  {roundupSearch && (
                    <button
                      type="button"
                      onClick={() => setRoundupSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/60 hover:text-m3-on-surface p-0.5 rounded-full"
                    >
                      ×
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </section>

        {/* 02b + 03 — The Weekly and the email capture, one block.
            These were two full-bleed sections stacked on top of each other:
            the latest issue on surface, then the signup on secondary-container.
            On mobile that was ~900px of scroll for one idea — "here is the
            weekly, subscribe to it". They now share a single tinted block that
            reads as one unit and sits clearly apart from Notes below, which
            keeps surface-variant. On lg the issue and the form sit side by
            side; below that they stack, and the issue card stays horizontal
            rather than putting a 16:9 image above the text. */}
        <section className="bg-m3-secondary-container text-m3-on-secondary-container px-6 md:px-14 py-9 md:py-12 border-t border-m3-outline/10">
          <div className="grid xl:grid-cols-[1.35fr_1fr] gap-8 xl:gap-12 items-start">
            {/* The Weekly */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-[12px] bg-m3-surface/70 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] font-bold opacity-40">03</span>
                    <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em]">
                      The Weekly
                    </span>
                  </span>
                </div>
                <Link
                  to="/weekly"
                  className="text-[11px] font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  All issues <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {latestIssue ? (
                <a
                  href={latestIssue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex sm:h-[192px] xl:h-[176px] bg-m3-surface text-m3-on-surface rounded-[24px] overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* The crop is governed by how close this box's aspect is to
                      the source. beehiiv art is ~1.79:1; the old box was
                      200x251 (0.80), so object-cover kept 45% of the image
                      width at 1440 and 37% at 1024 — a centre band with the
                      subject sliced off both edges, which is what "broken crop"
                      looked like. Widening to 42% and clamping the text keeps
                      the box near landscape, so most of the frame survives.
                      A full 16:9 banner crops nothing but costs ~280px of
                      height here, which is the space this block was rebuilt to
                      save. Still hidden below sm. `max-sm:hidden`, not
                      `hidden sm:block` — see the teaser below for why. */}
                  {latestIssue.thumbnail && (
                    <img
                      src={latestIssue.thumbnail}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="max-sm:hidden w-[48%] max-w-[300px] shrink-0 self-stretch h-full object-cover object-center"
                    />
                  )}
                  <div className="p-4 md:p-5 flex flex-col justify-center gap-1.5 md:gap-2 flex-1 min-w-0">
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant">
                      {latestIssue.issueNumber !== undefined && `Issue #${latestIssue.issueNumber} · `}
                      {formatDigestDate(latestIssue.publishedDate)}
                    </span>
                    <h2 className="display text-base md:text-lg font-extrabold tracking-tight leading-snug line-clamp-2">
                      {latestIssue.title}
                    </h2>
                    {/* `max-sm:hidden`, never `hidden sm:block`: line-clamp
                        works by setting display:-webkit-box, so a `sm:block`
                        overrides it and the teaser renders in full. That's how
                        an eight-line paragraph shipped past a `line-clamp-2`. */}
                    <p className="max-sm:hidden xl:hidden text-[13px] font-medium text-m3-on-surface-variant leading-snug line-clamp-2">
                      {latestIssue.teaser}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-m3-primary group-hover:gap-2 transition-all">
                      {latestIssue.issueNumber === undefined
                        ? "Read the issue"
                        : `Read issue #${latestIssue.issueNumber}`}{" "}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              ) : (
                <div className="bg-m3-surface text-m3-on-surface rounded-[24px] p-6 md:p-8">
                  <p className="font-display font-bold mb-1">First weekly issue coming soon</p>
                  <p className="text-sm text-m3-on-surface-variant font-medium">
                    Once the first Builtbyswami Weekly issue is live, the week's biggest stories will round up right here.
                  </p>
                </div>
              )}
            </div>

            {/* Email capture. Keeps the #build-notes id — the footer's
                Subscribe link points at it. */}
            <div
              id="build-notes"
              className="flex flex-col xl:border-l xl:border-m3-on-secondary-container/15 xl:pl-12 xl:pt-9"
            >
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5" />
                <h2 className="display text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-tight">
                  {NEWSLETTER_TITLE}
                </h2>
              </div>
              <p className="text-sm font-medium opacity-80 mb-5">{NEWSLETTER_PROMISE}</p>
              <NewsletterSignup />
            </div>
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
                <span className="font-mono text-[11px] font-bold text-m3-on-surface-variant/40">04</span>
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

        {/* 08 — Builds.
            Sits immediately before the closing fork on purpose: that section's
            eyebrow reads "the operator behind the builds", so the builds should
            be the thing directly above it. It also puts the strongest proof of
            work last, leading straight into the ask.

            Order here matches the nav — Daily Five, Notes, Builds — so the page
            and the header tell the same story. */}
        <section className="px-6 md:px-14 py-12 md:py-16 bg-m3-surface border-t border-m3-outline/10">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-[12px] bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
                <Hammer className="w-4 h-4" />
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] font-bold text-m3-on-surface-variant/40">05</span>
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
            className={`grid sm:grid-cols-2 gap-4 ${
              homeBuilds.length === 4 ? "lg:grid-cols-2" : "lg:grid-cols-3"
            }`}
          >
            {homeBuilds.map((build) => {
              // Not everything shipped has somewhere to go — the task engine was
              // never published. Those cards point at the write-up instead of a
              // dead "Open it", which is why they can be shown at all.
              const cardClass =
                "group bg-m3-surface-variant/40 rounded-[24px] border border-m3-outline/5 p-6 flex flex-col gap-3 hover:bg-m3-surface hover:border-m3-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all";

              const inner = (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-m3-primary">
                    {build.status}
                  </span>
                  <span className="display text-lg font-extrabold tracking-tight text-m3-on-surface">
                    {build.name}
                  </span>
                  <span className="text-sm leading-relaxed text-m3-on-surface-variant font-medium line-clamp-3">
                    {build.what}
                  </span>
                  <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-m3-primary group-hover:gap-1.5 transition-all">
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
                </>
              );

              return build.url ? (
                <a
                  key={build.name}
                  href={build.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={build.name}
                  to={build.noteSlug ? `/notes/${build.noteSlug}` : "/builds"}
                  className={cardClass}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* 09 — Second fork.
            Anyone who scrolled a whole publication homepage is interested in
            who wrote it. This used to offer one vague exit ("The full story");
            it now names both, so the reader picks rather than guessing. */}
        <section className="px-6 md:px-14 py-7 md:py-9 bg-m3-primary text-m3-on-primary">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] font-bold text-m3-on-primary/35">06</span>
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
