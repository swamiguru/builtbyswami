/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface NavItem {
  label: string;
  to: string;
  external?: boolean;
}

/**
 * Four items, no more. The YouTube channel deliberately isn't here — a nav
 * item that ejects every visitor off-domain was the site's biggest leak, so
 * the channel lives as a carousel on the homepage and a link in the footer.
 * Labels match their destination exactly ("The Work" → /about is the one
 * that used to lie). Order mirrors the homepage: offers, builds, notes, about.
 */
const NAV: NavItem[] = [
  { label: "Consulting", to: "/work-with-me" },
  { label: "Builds", to: "/builds" },
  { label: "Notes", to: "/notes" },
  { label: "The Work", to: "/about" },
];

/**
 * Shared, responsive site header: brand lockup + desktop nav on md+,
 * and a hamburger dropdown on small screens so nav is reachable on mobile.
 *
 * Always pinned to the top of the viewport via position:sticky on both
 * desktop and mobile. Previously this hid on downward scroll and
 * reanimated back in on upward scroll; that read as the header
 * "disappearing" rather than staying put, so it's now simply always
 * visible once scrolled, with a shadow/blur pickup for depth.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      setScrolled(currentScrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderItem = (item: NavItem, className: string) =>
    item.external ? (
      <a
        key={item.label}
        href={item.to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={close}
      >
        {item.label}
      </a>
    ) : (
      <Link key={item.label} to={item.to} className={className} onClick={close}>
        {item.label}
      </Link>
    );

  const desktopLink =
    "px-4 py-2.5 hover:bg-m3-surface-variant text-m3-on-surface rounded-m3-full transition-all";
  const mobileLink =
    "px-4 py-3 rounded-m3-lg hover:bg-m3-surface-variant text-m3-on-surface transition-all";

  return (
    <>
      <motion.header
        className="sticky top-0 z-30 bg-m3-surface/90 backdrop-blur-md border-b border-m3-outline/20 will-change-transform rounded-t-m3-xl md:rounded-t-[32px]"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.05 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          boxShadow: scrolled
            ? "0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)"
            : "none",
        }}
      >
        <div className="h-[70px] md:h-[88px] flex items-center justify-between px-6 md:px-10">
          <BrandLogo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 md:gap-3 font-display font-bold text-sm">
            {NAV.map((item) => renderItem(item, desktopLink))}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-m3-surface-variant text-m3-on-surface transition-colors cursor-pointer"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <nav className="md:hidden border-t border-m3-outline/10 bg-m3-surface px-4 py-4 flex flex-col gap-1 font-display font-bold text-base">
            {NAV.map((item) => renderItem(item, mobileLink))}
          </nav>
        )}
      </motion.header>
    </>
  );
}
