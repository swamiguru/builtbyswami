/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SOCIALS } from "../data/socials";
import { NEWSLETTER_TITLE, NEWSLETTER_PROMISE } from "../data/newsletter";

const YOUTUBE = "https://www.youtube.com/@builtbyswami";

interface SiteFooterProps {
  className?: string;
}

/** Internal route link — same treatment everywhere in the footer columns. */
function FootLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-xs sm:text-sm font-display font-bold text-m3-on-surface-variant hover:text-m3-primary transition-colors w-fit leading-tight"
    >
      {children}
    </Link>
  );
}

/** Outbound link — carries the arrow so leaving the site is always visible. */
function FootExternal({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs sm:text-sm font-display font-bold text-m3-on-surface-variant hover:text-m3-primary transition-colors w-fit inline-flex items-center gap-1 leading-tight"
    >
      {children} <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60 shrink-0" />
    </a>
  );
}

/** Column heading — matches the old "Explore" eyebrow treatment. */
function FootHeading({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-extrabold text-m3-on-surface-variant/50 block mb-0.5">
      {children}
    </span>
  );
}

/**
 * Shared, site-wide footer: signoff + subscribe CTA, Explore nav,
 * and a status/social baseline bar. Used identically on every page
 * so navigation and branding stay consistent across the site.
 */
export default function SiteFooter({ className = "" }: SiteFooterProps) {
  return (
    <footer className={`bg-m3-surface border-t border-m3-outline/10 rounded-b-m3-xl md:rounded-b-[32px] ${className}`}>
      {/* Top tier — signoff, subscribe & nav */}
      <div className="px-5 sm:px-8 md:px-12 pt-6 md:pt-8 pb-5 md:pb-6 flex flex-col md:flex-row md:items-start gap-6 md:gap-10 justify-between">
        <div className="max-w-sm">
          <p className="font-display text-sm sm:text-base font-bold leading-snug text-m3-on-surface">
            {NEWSLETTER_TITLE}
          </p>
          <p className="mt-1 md:mt-1.5 text-xs sm:text-sm leading-relaxed text-m3-on-surface-variant font-medium">
            {NEWSLETTER_PROMISE}
          </p>
          <a
            href="#build-notes"
            className="mt-3 inline-flex items-center gap-1.5 bg-m3-primary text-m3-on-primary font-display font-bold px-4 py-2 rounded-m3-full hover:m3-elevation-1-shadow active:scale-95 transition-all text-xs sm:text-sm tracking-wide shadow-xs cursor-pointer"
          >
            Subscribe <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Three columns that mirror the nav — laid out horizontally even on mobile to prevent excessive scrolling */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 md:gap-10 pt-1 md:pt-0 border-t border-m3-outline/10 md:border-t-0">
          <nav className="flex flex-col gap-1.5 md:gap-2">
            <FootHeading>Read</FootHeading>
            <FootLink to="/tech-roundup">The Daily Five</FootLink>
            <FootLink to="/weekly">The Weekly</FootLink>
            <FootLink to="/notes">Notes</FootLink>
          </nav>

          <nav className="flex flex-col gap-1.5 md:gap-2">
            <FootHeading>Work</FootHeading>
            <FootLink to="/work-with-me">Consulting</FootLink>
            <FootLink to="/builds">Builds</FootLink>
            <FootLink to="/about">The Work</FootLink>
            <FootLink to="/case-study/middle-east">Case study</FootLink>
          </nav>

          <nav className="flex flex-col gap-1.5 md:gap-2">
            <FootHeading>Elsewhere</FootHeading>
            <FootExternal href={YOUTUBE}>YouTube</FootExternal>
            <FootExternal href="https://freewordtool.com">Free Word Tool</FootExternal>
            <FootExternal href="https://adda.builtbyswami.com">Adda</FootExternal>
          </nav>
        </div>
      </div>

      {/* Baseline bar — status, copyright & socials */}
      <div className="px-5 sm:px-8 md:px-12 py-3 md:py-3.5 border-t border-m3-outline/10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-between">
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" />
            <span className="font-display text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-m3-primary">
              Live — shipping daily
            </span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase opacity-40 font-display">
            © 2026 builtbyswami
          </span>
        </div>
        <div className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <motion.a
              key={s.name}
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.9 }}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`@builtbyswami on ${s.name}`}
              className="w-8 h-8 md:w-8.5 md:h-8.5 bg-m3-surface-variant text-m3-on-surface-variant rounded-full flex items-center justify-center hover:bg-m3-primary hover:text-m3-on-primary transition-colors shadow-xs"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true">
                <path d={s.path} />
              </svg>
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}
