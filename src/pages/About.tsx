/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Cpu,
  Download,
  Globe,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { TestimonialsSection } from "../components/Testimonials";
import { usePageSeo } from "../hooks/usePageSeo";

// --- Types ---

interface Highlight {
  title: string;
  detail: string;
}

interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  website: string;
  context?: string;
  current?: boolean;
  /** Older roles render their detail as a compact list rather than a card
   *  grid — depth should decay with recency the way a good CV tapers. */
  condensed?: boolean;
  /** Portfolio-level scope — the "ran a book of work" signal that individual
   *  project bullets can't carry on their own. */
  portfolio?: {
    label: string;
    themes: string[];
  };
  impact: string[];
  highlights: Highlight[];
  technologies: string[];
}

const EXPERIENCE: ExperienceItem[] = [
  {
    company: "BuiltBySwami",
    role: "Independent Product Builder",
    location: "Bengaluru",
    period: "May 2026 – Present",
    website: "https://www.builtbyswami.com",
    context: "Solo, AI-native product building — strategy through shipped code",
    current: true,
    impact: [
      "Shipped three live products solo — BuiltBySwami.com, Free Word Tool and Adda.",
      "Took a full task-management engine from empty repo to working app in 24 hours.",
      "Built and instrumented a daily-publishing content platform end to end.",
      "Audited a major global media brand across Editorial, Audience, Commerce and SEO."
    ],
    highlights: [
      {
        title: "Definition Before Code",
        detail:
          "Audience, content and distribution strategy defined and written down before any code exists — then instrumented with GA4, GTM and Search Console so every release feeds a publish-measure-iterate loop rather than a guess."
      },
      {
        title: "Directing AI Through Execution",
        detail:
          "AI tools used as build partners in tight build-review loops, not one-shot prompts. The constraint that makes it work is the brief: state the context and what is out of scope, then hold the model to it."
      },
      {
        title: "Scope Discipline",
        detail:
          "Caught and reversed scope creep mid-build, shipping one focused, privacy-first utility instead of the unfocused five-app bundle it was turning into. Knowing what to cut is the job; speed only compounds the decision."
      },
      {
        title: "Portfolio Audit",
        detail:
          "Conducted a self-initiated portfolio audit across Editorial, Audience, Commerce and SEO for a major global media brand."
      }
    ],
    technologies: ["React", "TypeScript", "AI-Native Delivery", "GA4 / GTM", "Technical SEO", "Content Strategy"]
  },
  {
    company: "Condé Nast",
    role: "Senior Product Manager",
    location: "Bengaluru",
    period: "May 2022 – Apr 2026",
    website: "https://www.condenast.com",
    context: "Vogue · GQ · Wired · Condé Nast Traveller · Architectural Digest — US, EMEA, LATAM, APAC, Middle East",
    portfolio: {
      label: "Portfolio 2024–26 · 14 projects, 10+ markets, 6 new revenue lines",
      themes: [
        "Global Brand Expansion",
        "New Revenue Lines",
        "Risk & Brand Integrity",
        "Traffic & Audience Growth"
      ]
    },
    impact: [
      "Hired and led two product managers; set the PM group's reporting standard.",
      "Built $20M+ in net-new revenue through new-market entries.",
      "Cut prototyping cycles 30% and time-to-market 50% with AI-native delivery.",
      "Drove a 30% audience lift and $800K incremental revenue via tentpole launches."
    ],
    highlights: [
      {
        title: "Hiring & Team Leadership",
        detail:
          "Hired two product managers — writing the JDs and shaping the team structure around them — then mentored both to independent ownership of features across regional squads. Defined the reporting format the PM group used to brief leadership, and ran a monthly peer forum to share what was working and standardise how we improved."
      },
      {
        title: "Cross-Functional & Executive Leadership",
        detail:
          "Steered launches across 14 functions with no direct authority over any of them — Editorial, Audience Development, Engineering, Design, Legal, Consent, Data & Analytics, Programme, SEO, Ad Tech, Commerce, Newsletters, Social and Hiring — reconciling competing priorities into a single sequence. Presented to Product VPs weekly and to exec-level stakeholders ahead of every major launch."
      },
      {
        title: "Market Expansion",
        detail:
          "Launched Vogue, GQ and Wired in the Middle East and Condé Nast Traveller in Germany — new-market entries that were the core driver of the $20M+ net-new revenue build, opening new advertising, subscription and partnership channels in each market."
      },
      {
        title: "Revenue Growth & P&L",
        detail:
          "Owned the P&L for new revenue lines, directing the full-cycle launch of monetisation channels including the Architectural Digest Directory ($300K), the Condé Nast Traveller and Abercrombie & Kent booking partnership (scaled $150K to $650K across 2025–26), and Traveller Secret Homestays with Airbnb and Booking.com."
      },
      {
        title: "AI-Native Product Delivery",
        detail:
          "Operationalised AI tools and solutions across the product lifecycle — from discovery to shipped MVP — cutting prototyping cycles 30% and time-to-market 50%, validating product bets with users before committing engineering."
      },
      {
        title: "Audience Growth & Engagement",
        detail:
          "Led global tentpole product launches — Vogue Met Gala and GQ Men of the Year — and A/B tested editorial storytelling formats to drive a 30% audience lift, a 24% increase in time on page, and $800K incremental revenue."
      },
      {
        title: "Frontend & Sponsor UX",
        detail:
          "Designed and shipped interactive sponsor modules and new editorial storytelling formats to elevate the reading experience — driving an 8% lift in sponsorship revenue and a 12% increase in time spent on site."
      },
      {
        title: "Platform Migration & Technical SEO",
        detail:
          "Executed large-scale migrations for Vogue, GQ, Wired and Architectural Digest with 100% SEO integrity and zero revenue loss, and consolidated Condé Nast Traveller Spain and LATAM onto one Spanish-language platform reaching 56.6M unique users — leading cross-functional Agile squads across Engineering and Design throughout."
      }
    ],
    technologies: ["Team Leadership", "Hiring", "Exec Stakeholders", "Enterprise CMS", "Generative AI", "P&L Ownership"]
  },
  {
    company: "Condé Nast",
    role: "Product Manager, GQ",
    location: "Bengaluru",
    period: "Oct 2020 – Apr 2022",
    website: "https://www.gq.com",
    context: "Promoted to Senior Product Manager, May 2022",
    impact: [
      "Owned the product roadmap for GQ's 10 global digital properties.",
      "Drove a 30% audience lift and $500K incremental revenue.",
      "Migrated GQ to a unified global CMS with zero SEO or ad-revenue loss.",
      "Lifted PLP click-through 7% and on-page engagement 6%."
    ],
    highlights: [
      {
        title: "Global Roadmap Ownership",
        detail:
          "Owned the product roadmap for GQ's 10 global digital properties — writing PRDs and user stories and defining feature priorities across Editorial, Commercial and Engineering."
      },
      {
        title: "Frontend & Editorial UX",
        detail:
          "Shaped shoppable-editorial and storytelling UX components across GQ's global properties and scaled affiliate commerce (Amazon Associates, Skimlinks) across PLPs — lifting on-page engagement 6% via recirculation component clicks, CTR 7% on redesigned PLP layouts, and opening new revenue channels through improved on-page monetisation."
      },
      {
        title: "Audience Growth & Engagement",
        detail:
          "Delivered GQ Men of the Year, GQ Sports and FIFA World Cup 2022 activations — driving a 30% audience lift and $500K incremental revenue."
      },
      {
        title: "Platform Migration",
        detail:
          "Led GQ's migration to a unified global CMS across four regional teams with zero SEO degradation and zero ad-revenue disruption."
      }
    ],
    technologies: ["Roadmap Ownership", "PRDs & User Stories", "Affiliate Commerce", "CMS Migration", "Shoppable Editorial"]
  },
  {
    company: "Newsweek",
    role: "Product Manager",
    location: "Bengaluru",
    period: "Jan 2018 – Oct 2020",
    condensed: true,
    website: "https://www.newsweek.com",
    context: "Digital properties reaching 50M+ monthly unique visitors",
    impact: [
      "Owned the roadmap for platforms serving 50M+ monthly unique visitors.",
      "Drove a 17% traffic lift through the Newsgeek brand redesign.",
      "Lifted article engagement 14% with a new on-page module.",
      "Delivered a zero-downtime CMS migration with 100% site authority preserved."
    ],
    highlights: [
      {
        title: "Brand Redesign & Engagement",
        detail:
          "Led the Newsgeek brand redesign end-to-end, from user research to launch, driving a 17% traffic lift and a 14% uplift in article engagement via a new on-page engagement module."
      },
      {
        title: "Platform Scale",
        detail:
          "Owned the roadmap for digital properties reaching 50M+ monthly unique visitors, balancing Editorial, Sales and Engineering priorities in an Agile environment."
      },
      {
        title: "Zero-Downtime CMS Migration",
        detail:
          "Directed an enterprise CMS migration with Technical SEO teams, preserving 100% site authority and ad-revenue continuity throughout the transition."
      }
    ],
    technologies: ["Enterprise CMS", "Technical SEO", "Ad Tech", "User Research", "Agile / Scrum"]
  },
];

const PRODUCT_LINKS: { label: string; url: string }[] = [
  { label: "BuiltBySwami.com", url: "https://www.builtbyswami.com" },
  { label: "Free Word Tool", url: "https://freewordtool.com" },
  { label: "Adda", url: "https://adda.builtbyswami.com" }
];

/**
 * Turns the names of my own shipped products into outbound links inside body
 * copy, so the claims in the experience section are verifiable in one click
 * rather than requiring a scroll down to Selected Work. Deliberately scoped to
 * products I built — employer brand names are left unlinked, since a link to a
 * company homepage proves nothing and just leaks the reader away.
 */
/** Currency, percentages and magnitudes — the tokens a scanning reader hunts for. */
const METRIC_ONLY = /^(?:\$\d[\d.,]*[KMB]?\+?|\d[\d.]*%\+?|\d[\d.]*[KMB]\+?)$/;

/**
 * Renders body copy with two kinds of emphasis: my own shipped products become
 * links, and hard numbers become bold primary-coloured tokens. The surrounding
 * prose deliberately stays at normal weight — if the whole line is bold, the
 * metric has nothing to stand out against.
 */
function richText(text: string) {
  const labels = PRODUCT_LINKS.map((p) => p.label)
    .sort((a, b) => b.length - a.length)
    .map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const pattern = new RegExp(
    `(\\b(?:${labels.join("|")})\\b|\\$\\d[\\d.,]*[KMB]?\\+?|\\d[\\d.]*%\\+?|\\b\\d[\\d.]*[KMB]\\+?)`,
    "g"
  );

  return text.split(pattern).map((part, i) => {
    if (!part) return null;

    const link = PRODUCT_LINKS.find((p) => p.label === part);
    if (link) {
      return (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-m3-primary font-semibold underline decoration-m3-primary/30 underline-offset-2 hover:decoration-m3-primary transition-colors"
        >
          {part}
        </a>
      );
    }

    if (METRIC_ONLY.test(part)) {
      return (
        <strong key={i} className="text-m3-primary font-extrabold">
          {part}
        </strong>
      );
    }

    return part;
  });
}

/**
 * The contact actions appear twice — hero and closing CTA. Defining them once
 * means order, labels, icons, hierarchy and sizing can't drift apart between
 * the two placements, which is exactly what had happened.
 *
 * Mobile: the primary action keeps its label and flexes to fill; the two
 * secondary actions collapse to 48px icon buttons. Full labels from sm up.
 */
const ACTIONS = [
  {
    label: "Download CV",
    href: "/Swami-Guru-CV.pdf",
    icon: Download,
    download: "Swami-Guru-CV.pdf",
    variant: "outlined" as const
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/swaminathanguru/",
    icon: Linkedin,
    external: true,
    variant: "primary" as const
  },
  {
    label: "Email",
    href: "mailto:builtbyswami@gmail.com",
    icon: Mail,
    variant: "outlined" as const
  }
];

const ACTION_VARIANTS = {
  primary: "bg-m3-primary text-m3-on-primary shadow-sm hover:m3-elevation-1-shadow",
  tonal: "bg-m3-secondary-container text-m3-on-secondary-container hover:m3-elevation-1",
  outlined: "border border-m3-outline/30 text-m3-on-surface hover:bg-m3-surface-variant"
};

function ActionRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {ACTIONS.map((a, i) => {
        const Icon = a.icon;
        const isPrimary = i === 0;
        return (
          <motion.a
            key={a.label}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={a.href}
            aria-label={a.label}
            {...(a.download ? { download: a.download } : {})}
            {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`inline-flex items-center justify-center gap-2 font-display font-bold h-12 rounded-m3-full text-[13px] sm:text-sm tracking-wide transition-all whitespace-nowrap ${
              ACTION_VARIANTS[a.variant]
            } ${isPrimary ? "flex-1 sm:flex-none px-4 sm:px-6" : "shrink-0 w-12 sm:w-auto sm:px-6"}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className={isPrimary ? "" : "hidden sm:inline"}>{a.label}</span>
          </motion.a>
        );
      })}
    </div>
  );
}

const HOME_TZ = "Asia/Kolkata";

/**
 * Swami's local time — not the visitor's. Someone in London deciding whether to
 * reach out actually wants to know when he's awake, so this is useful before
 * it's charming.
 *
 * The phase label is the deliberate part: Adda is built on the idea that a
 * place feels different under its own sky and its own clock, and "golden hour"
 * is the same hour that product opens on. The page and the product argue the
 * same thing.
 */
function LocalTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: number;
    // Tick on the real minute boundary rather than every 60s from mount, so the
    // displayed minute never drifts behind a clock the visitor can see.
    const schedule = () => {
      timer = window.setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60000 - (Date.now() % 60000));
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: HOME_TZ
  }).format(now);

  const hour =
    Number(
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        hour12: false,
        timeZone: HOME_TZ
      }).format(now)
    ) % 24;

  const { label, dim } =
    hour < 5
      ? { label: "late night", dim: "opacity-35" }
      : hour < 12
        ? { label: "morning", dim: "opacity-75" }
        : hour < 17
          ? { label: "afternoon", dim: "opacity-100" }
          : hour < 20
            ? { label: "golden hour", dim: "opacity-100" }
            : { label: "evening", dim: "opacity-55" };

  return (
    <span
      className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-m3-on-secondary-container/60"
      title={`Swami's local time in Bengaluru — ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full bg-m3-primary shrink-0 ${dim}`} aria-hidden="true" />
      <span>
        {time} <span className="opacity-70">· {label}</span>
      </span>
    </span>
  );
}

export default function About() {
  usePageSeo("about");

  const [showScrollTop, setShowScrollTop] = useState(false);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const workSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: workScrollProgressRaw } = useScroll({
    target: workSectionRef,
    offset: ["start start", "end end"]
  });

  const workScrollProgress = useSpring(workScrollProgressRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary relative">
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">

        <SiteHeader />

        {/* Back to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 w-12 h-12 bg-m3-surface-variant text-m3-on-surface-variant rounded-[24px] flex items-center justify-center shadow-lg hover:shadow-2xl transition-all z-50 group print:hidden"
              title="Back to Top"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Top Section: Sidebar + Hero */}
        <div className="flex flex-col md:flex-row border-b border-m3-outline/10">
          {/* Sidebar: Identity */}
          <aside className="w-full md:w-[360px] border-b md:border-b-0 md:border-r border-m3-outline/10 p-6 md:p-8 flex flex-col justify-center bg-m3-secondary-container shrink-0">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src="/swami-guru.jpg"
                  alt="Swami Guru"
                  width={400}
                  height={400}
                  loading="eager"
                  className="w-[72px] h-[72px] rounded-full object-cover shadow-sm ring-2 ring-m3-primary/25 shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-secondary-container leading-none">
                    Swami Guru
                  </h1>
                  <div className="w-10 h-1.5 bg-m3-primary rounded-full mt-2.5" />
                </div>
              </div>
              <div className="flex flex-col gap-1 relative group/title select-none">
                <div className="flex items-start gap-4">
                  <p className="display text-4xl md:text-5xl leading-[0.85] font-bold tracking-tighter uppercase text-m3-on-secondary-container relative">
                    <span className="block relative group-hover/title:text-m3-primary transition-colors duration-500">
                      PRODUCT
                    </span>
                    <span className="block text-m3-primary/90">
                      LEADER
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-[12px] h-[36px] bg-m3-primary ml-1 align-middle translate-y-[-2px]"
                      />
                    </span>
                  </p>

                  <div className="mt-2 flex flex-col items-center">
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-m3-primary relative"
                    >
                      <Layers className="w-6 h-6" />
                      <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border border-m3-primary rounded-full"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="pt-1 space-y-5">
                <div className="flex flex-col">
                  <span className="font-display text-[11px] font-bold uppercase tracking-wider text-m3-primary/60">Currently · since May 2026</span>
                  <span className="text-sm font-bold mb-1">Independent Product Builder</span>
                  <p className="text-[13px] leading-relaxed text-m3-on-secondary-container/70 font-medium">
                    Building and shipping products solo, AI-native, in public.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="font-display text-[11px] font-bold uppercase tracking-wider text-m3-primary/60">Previously</span>
                    <span className="text-[13px] font-semibold leading-snug">Condé Nast · Newsweek · Metro</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-[11px] font-bold uppercase tracking-wider text-m3-primary/60">Location</span>
                    <span className="text-[13px] font-semibold flex items-center gap-1.5 leading-snug">
                      <MapPin className="w-3.5 h-3.5 text-m3-primary shrink-0" /> Bengaluru, India
                    </span>
                    <LocalTime />
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* Right Content: Hero + Stats */}
          <div className="flex-1 flex flex-col shrink-0 bg-m3-surface">
            <section className="flex-1 border-b border-m3-outline/10 p-6 md:p-10 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-m3-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="max-w-2xl relative z-10">
                <span className="font-display text-[11px] md:text-[12px] font-bold uppercase tracking-[0.25em] md:tracking-[0.3em] text-m3-primary mb-4 md:mb-6 block">
                  <span className="hidden md:inline">Senior Product Leader · </span>AI-Native Product
                </span>
                <span className="display font-medium text-2xl md:text-[2.75rem] block mb-6 leading-[1.15] tracking-tight text-m3-on-surface">
                  I turn complex platforms into <span className="text-m3-primary font-bold px-2 bg-m3-primary-container/30 rounded-lg">growth engines</span> — lifting engagement, accelerating revenue, and shipping at half the time-to-market.
                </span>
                <p className="text-sm font-medium text-m3-on-surface-variant max-w-xl leading-relaxed">
                  Across Vogue, GQ, Wired, Condé Nast Traveller, Architectural Digest and Newsweek — including new brand launches in the Middle East and Germany.
                </p>

                {/* Scope, stated high. "Ran a portfolio" is a different claim from
                    "shipped things", and it was previously only visible several
                    screens down inside the Condé Nast card. */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-5">
                  {[
                    { v: "11+", l: "years in product" },
                    { v: "14", l: "projects" },
                    { v: "10+", l: "markets" },
                    { v: "6", l: "new revenue lines" }
                  ].map((s, i) => (
                    <span key={i} className="inline-flex items-baseline gap-1.5 bg-m3-surface-variant/60 border border-m3-outline/10 rounded-m3-full px-3.5 py-1.5">
                      <span className="display text-sm font-extrabold text-m3-primary">{s.v}</span>
                      <span className="text-[12px] font-semibold text-m3-on-surface-variant">{s.l}</span>
                    </span>
                  ))}
                </div>

                <ActionRow className="mt-6" />
              </div>
            </section>

            {/* Impact Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 shrink-0">
              {[
                { val: "$20M+", label: "NET-NEW REVENUE", container: "bg-m3-primary-container/20", text: "text-m3-on-primary-container" },
                { val: "30%+", label: "ENGAGEMENT LIFT", container: "bg-m3-secondary-container/20", text: "text-m3-on-secondary-container" },
                { val: "50%", label: "TIME-TO-MARKET CUT", container: "bg-m3-tertiary-container/20", text: "text-m3-on-tertiary-container" },
                { val: "100%", label: "SEO RETAINED", container: "bg-m3-primary-container/20", text: "text-m3-on-primary-container" }
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`px-4 py-6 flex flex-col items-center justify-center text-center ${stat.container} border-m3-outline/5 border-t lg:border-t-0 ${i % 2 === 0 ? "border-r" : ""} ${i < 3 ? "lg:border-r" : "lg:border-r-0"}`}
                >
                  <span className={`display text-3xl md:text-4xl font-extrabold tracking-tighter ${stat.text}`}>{stat.val}</span>
                  <span className={`font-display text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1.5 ${stat.text}`}>{stat.label}</span>
                </div>
              ))}
            </section>
          </div>
        </div>

        {/* ============ EXPERIENCE ============ */}
        <section id="work" ref={workSectionRef} className="border-b border-m3-outline/10 flex flex-col shrink-0 bg-m3-surface overflow-hidden relative">
          <div className="sticky top-0 left-0 right-0 h-1 z-40 pointer-events-none">
            <motion.div
              style={{ scaleX: workScrollProgress, transformOrigin: "0%" }}
              className="h-full bg-m3-secondary"
            />
          </div>
          <div className="px-6 md:px-10 lg:px-12 pt-10 md:pt-12">
            <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.35em] text-m3-primary block mb-3">
              Experience
            </span>
            <h2 className="display text-2xl md:text-4xl font-extrabold tracking-tighter uppercase text-m3-on-surface">
              Professional trajectory
            </h2>
          </div>

          <div className="flex-1 space-y-8 md:space-y-10 p-5 md:p-10 lg:p-12 pt-8 md:pt-8">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className={`rounded-[28px] md:rounded-[36px] p-6 md:p-10 border transition-all ${
                  exp.current
                    ? "bg-m3-primary-container/25 border-m3-primary/25 shadow-md"
                    : "bg-m3-surface-variant/40 border-m3-outline/5 hover:bg-m3-surface hover:shadow-xl"
                }`}
              >
                {/* Header runs full width rather than sitting in a tall left
                    rail — the rail forced the highlight grid into 2 columns and
                    stacked awkwardly on mobile. */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-5 mb-6 border-b border-m3-outline/10">
                  <div className="space-y-2 min-w-0">
                    {exp.current && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-m3-primary text-m3-on-primary rounded-m3-full text-[10px] font-bold uppercase tracking-widest mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-m3-on-primary animate-pulse" />
                        Current
                      </span>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tighter uppercase leading-none text-m3-primary">
                        {exp.company}
                      </h3>
                      <motion.a
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${exp.company} website`}
                        className="w-9 h-9 bg-m3-primary-container text-m3-on-primary-container rounded-full flex items-center justify-center transition-all shadow-sm hover:bg-m3-primary hover:text-m3-on-primary shrink-0"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.a>
                      <span className="text-base lg:text-lg font-bold text-m3-secondary">{exp.role}</span>
                    </div>
                    {exp.context && (
                      <p className="text-[13px] leading-relaxed text-m3-on-surface-variant font-medium max-w-3xl">
                        {exp.context}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end shrink-0">
                    <span className="px-3.5 py-1.5 bg-m3-secondary-container text-m3-on-secondary-container rounded-m3-full text-[11px] font-bold uppercase tracking-wider">
                      {exp.period}
                    </span>
                    <span className="px-3.5 py-1.5 bg-m3-surface border border-m3-outline/20 text-m3-on-surface rounded-m3-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {exp.location}
                    </span>
                  </div>
                </div>

                {/* Impact — 4 across at desktop so it reads as one band */}
                <div className="bg-m3-surface rounded-[20px] p-5 md:p-6 border border-m3-outline/10 shadow-sm mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-4 h-4 text-m3-primary shrink-0" />
                    <h4 className="display font-extrabold text-[10px] uppercase tracking-widest text-m3-primary">
                      Quantifiable Impact
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
                    {exp.impact.map((ki, kii) => (
                      <div key={kii} className="flex gap-2.5 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-m3-primary mt-1.5 shrink-0" />
                        <p className="text-[13px] font-semibold text-m3-on-surface leading-snug">{richText(ki)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {exp.portfolio && (
                  <div className="rounded-[20px] border border-m3-outline/10 bg-m3-surface p-5 md:p-6 mb-6">
                    <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.3em] text-m3-on-surface-variant/60 block mb-4">
                      {exp.portfolio.label}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.portfolio.themes.map((t, ti) => (
                        <span key={ti} className="text-[11px] font-semibold text-m3-on-surface-variant bg-m3-surface-variant/60 px-2.5 py-1 rounded-m3-md border border-m3-outline/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent roles get the full card grid; older roles get the same
                    content as a compact list — no card chrome, about a third of
                    the height, nothing lost. */}
                {exp.condensed ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                    {exp.highlights.map((h, hi) => (
                      <p key={hi} className="text-[13px] leading-relaxed text-m3-on-surface-variant font-medium">
                        <span className="font-bold text-m3-on-surface">{h.title}</span>
                        <span className="text-m3-primary"> — </span>
                        {richText(h.detail)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {exp.highlights.map((h, hi) => (
                      <div key={hi} className="bg-m3-surface p-5 rounded-[20px] border border-m3-outline/5 hover:border-m3-primary/20 transition-all shadow-sm">
                        <h4 className="font-bold text-[14px] mb-1.5 text-m3-on-surface leading-snug">{h.title}</h4>
                        <p className="text-[13px] leading-relaxed text-m3-on-surface-variant font-medium">{richText(h.detail)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-m3-outline/10">
                  {exp.technologies.map((tech, ti) => (
                    <span key={ti} className="text-[10px] font-bold uppercase tracking-wider bg-m3-primary/5 text-m3-primary px-2.5 py-1 rounded-m3-md border border-m3-primary/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ CASE STUDY ============ */}
        {/* Client work, so it sits after Experience and before the solo builds
            below — the two shouldn't read as the same category. */}
        <section id="case-study" className="bg-m3-surface border-b border-m3-outline/10 px-6 md:px-10 lg:px-12 py-10 md:py-12">
          <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.35em] text-m3-primary block mb-3">
            Case Study
          </span>

          <motion.div whileHover={{ y: -4 }} className="bg-m3-surface-variant rounded-[24px] border border-m3-outline/5 hover:border-m3-primary/30 shadow-sm hover:shadow-xl transition-all p-6 md:p-9">
            <Link to="/case-study/middle-east" className="group block">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="w-12 h-12 bg-m3-primary-container text-m3-on-primary-container rounded-[16px] flex items-center justify-center shrink-0 group-hover:bg-m3-primary group-hover:text-m3-on-primary transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-m3-primary bg-m3-primary/5 border border-m3-primary/15 px-3 py-1 rounded-m3-full shrink-0">
                  Condé Nast
                </span>
              </div>

              <h2 className="display text-2xl md:text-4xl font-extrabold tracking-tighter uppercase text-m3-on-surface leading-[1.02] flex items-start gap-2">
                Launching global media brands into the Middle East
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 mt-1 shrink-0 text-m3-primary opacity-60 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </h2>

              <p className="mt-4 text-base md:text-lg font-bold text-m3-primary leading-snug">
                Five titles, three waves — and the last one shipped in half the time.
              </p>

              <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-m3-on-surface-variant font-medium max-w-3xl">
                Product Lead across all three waves of Condé Nast's GCC expansion — Condé Nast Traveller and Architectural Digest in 2023, GQ and Vogue in 2025, Wired in 2026. Multi-currency subscriptions, regional ad-tech and affiliate commerce working from day one.
              </p>

              <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                {[
                  ["$20M+", "Year 1 target exceeded"],
                  ["12%", "above audience benchmark"],
                  ["50%", "faster time-to-market"],
                  ["~11%", "ad revenue per visit"],
                ].map(([metric, label]) => (
                  <div key={label}>
                    <div className="display text-2xl md:text-3xl font-extrabold tracking-tighter text-m3-on-surface">
                      {metric}
                    </div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant/70 leading-snug">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <span className="mt-7 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-m3-primary">
                Read the case study <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </motion.div>
        </section>

        {/* ============ TESTIMONIALS ============ */}
        {/* Sits after the case study on purpose: the reader meets the numbers
            first, then hears named people corroborate them. Endorsement before
            evidence reads as marketing; after it, it reads as proof. */}
        <TestimonialsSection />

        {/* ============ BUILDS POINTER ============ */}
        {/* The grid that used to sit here is now /builds, where it is linkable,
            indexable and doing three jobs instead of decorating a CV. */}
        <section id="builds" className="bg-m3-surface-variant border-b border-m3-outline/10 px-6 md:px-10 lg:px-12 py-10 md:py-12">
          <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.35em] text-m3-primary block mb-3">
            Selected work
          </span>
          <h2 className="display text-2xl md:text-4xl font-extrabold tracking-tighter uppercase text-m3-on-surface mb-4">
            Shipped solo
          </h2>
          <p className="text-sm md:text-base text-m3-on-surface-variant font-medium leading-relaxed max-w-xl mb-6">
            Four products taken from brief to production single-handedly, each
            with a constraint that shaped it. builtbyswami.com, Free Word Tool,
            Adda, and a task engine built in a single sitting.
          </p>
          <Link
            to="/builds"
            className="inline-flex items-center gap-2 bg-m3-primary text-m3-on-primary font-display font-bold px-6 py-3 rounded-m3-full text-sm tracking-wide hover:m3-elevation-1-shadow active:scale-95 transition-all shadow-xs"
          >
            See the builds <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* ============ TOOLKIT (one line) ============ */}
        {/* Was a competencies matrix, a four-group tools grid and two
            credentials. Every PM has a skills matrix and it dates within a
            year. What survives is the tools someone might actually filter on
            and the one certification worth listing. */}
        <section id="skills" ref={skillsSectionRef} className="bg-m3-surface border-b border-m3-outline/10 px-6 md:px-10 lg:px-12 py-10 md:py-12">
          <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.35em] text-m3-primary block mb-3">
            Capability
          </span>
          <h2 className="display text-2xl md:text-4xl font-extrabold tracking-tighter uppercase text-m3-on-surface mb-6">
            How I work
          </h2>
          <p className="text-sm md:text-base text-m3-on-surface-variant font-medium leading-relaxed max-w-3xl mb-4">
            Claude, Claude Code, Cursor, Gemini and NotebookLM in the build
            loop. React and TypeScript. GA4, Google Tag Manager and Snowplow
            for measurement. WordPress VIP, Drupal and proprietary enterprise
            CMS platforms. Google Ad Manager, affiliate and subscription
            stacks. Jira, Confluence, Figma and Notion for the rest.
          </p>
          <p className="text-sm text-m3-on-surface-variant/70 font-medium">
            Certified Scrum Product Owner&reg; (CSPO), Scrum Alliance.
          </p>
        </section>

        {/* ============ POINT OF VIEW ============ */}
        {/* Collapsed from a two-column section: the "what that looks like" card
            duplicated the BuiltBySwami highlights almost verbatim, and the prose
            beside it was generic. What's left is the one claim that is actually
            mine, in my own words, at a third of the height. */}
        <section className="bg-m3-primary text-m3-on-primary px-6 md:px-10 lg:px-12 py-10 md:py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Cpu className="w-56 h-56 md:w-80 md:h-80 -mr-14 -mt-14 rotate-12" />
          </div>

          <div className="max-w-3xl relative z-10">
            <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.35em] text-m3-on-primary/60 block mb-4">
              Point of View
            </span>
            <h2 className="display text-2xl md:text-4xl font-extrabold tracking-tighter leading-[1.05] mb-5">
              The barrier between idea and execution has collapsed
            </h2>
            <p className="text-base md:text-lg font-medium leading-relaxed opacity-90 mb-8 max-w-2xl">
              Context — not syntax — is the new bottleneck. But the method has a load-bearing
              assumption I only noticed building something with no job to do: it runs on a
              definition of done.
            </p>
            <Link
              to="/notes/what-got-faster-and-what-didnt"
              className="inline-flex items-center gap-2 bg-m3-surface text-m3-primary font-display font-bold px-6 py-3 rounded-m3-full text-sm tracking-wide hover:shadow-xl transition-shadow"
            >
              Read the full argument <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ============ CONTACT CTA ============ */}
        <section className="bg-m3-surface px-6 md:px-10 lg:px-12 py-10 md:py-12 border-t border-m3-outline/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="display text-2xl md:text-4xl font-extrabold tracking-tighter uppercase text-m3-on-surface mb-3">
                Let&rsquo;s build something
              </h2>
              <p className="text-sm md:text-base text-m3-on-surface-variant font-medium leading-relaxed">
                Bengaluru-based, working globally. If you're taking a brand into a new market or replatforming without losing traffic, that's the work I do.
              </p>
            </div>
            <ActionRow className="shrink-0 w-full md:w-auto" />
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
