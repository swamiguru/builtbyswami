/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import NewsletterSignup from "./NewsletterSignup";

import { NEWSLETTER_TITLE, NEWSLETTER_PROMISE } from "../data/newsletter";

interface NavItem {
  label: string;
  to: string;
  external?: boolean;
}

/**
 * Five items, no more. The YouTube channel deliberately isn't here — a nav
 * item that ejects every visitor off-domain was the site's biggest leak, so
 * the channel lives as a carousel on the homepage and a link in the footer.
 * Labels match their destination exactly ("The Work" → /about is the one
 * that used to lie).
 */
const NAV: NavItem[] = [
  { label: "Consulting", to: "/work-with-me" },
  { label: "The Daily Five", to: "/tech-roundup" },
  { label: "Notes", to: "/notes" },
  { label: "Builds", to: "/builds" },
  { label: "The Work", to: "/about" },
];

/**
 * Shared, responsive site header: brand lockup + desktop nav on md+,
 * and a hamburger dropdown on small screens so nav is reachable on mobile.
 *
 * Implements a smart scroll behavior:
 * - Hides smoothly on downward scroll
 * - Elegantly animates back into view on upward scroll
 * - Stays visible when near the top of the page or when menus/modals are active
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const subscribeRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Handle outside click for subscribe popover
  useEffect(() => {
    if (!subscribeOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        subscribeRef.current &&
        !subscribeRef.current.contains(e.target as Node)
      ) {
        setSubscribeOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSubscribeOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [subscribeOpen]);

  // Scroll direction detection
  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? (window.pageYOffset || document.documentElement.scrollTop || 0) : 0;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      // Always reveal when near the top
      if (currentScrollY <= 80) {
        setVisible(true);
        setScrolled(false);
        lastScrollY = Math.max(0, currentScrollY);
        return;
      }

      setScrolled(true);

      // Keep header visible if mobile menu or subscribe popover is open
      if (open || subscribeOpen) {
        setVisible(true);
        lastScrollY = Math.max(0, currentScrollY);
        return;
      }

      const diff = currentScrollY - lastScrollY;

      // Scrolling down past threshold -> hide header
      if (diff > 8) {
        setVisible(false);
        lastScrollY = currentScrollY;
      }
      // Scrolling up past threshold -> reveal header smoothly
      else if (diff < -8) {
        setVisible(true);
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open, subscribeOpen]);

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
        animate={visible ? "visible" : "hidden"}
        variants={{
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration: shouldReduceMotion ? 0.05 : 0.28,
              ease: [0.16, 1, 0.3, 1], // snappy ease-out
            },
          },
          hidden: {
            y: "-100%",
            opacity: 0,
            transition: {
              duration: shouldReduceMotion ? 0.05 : 0.22,
              ease: [0.4, 0, 1, 1], // immediate ease-in
            },
          },
        }}
        style={{
          boxShadow:
            scrolled && visible
              ? "0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)"
              : "none",
        }}
      >
        <div className="h-[70px] md:h-[88px] flex items-center justify-between px-6 md:px-10">
          <BrandLogo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 md:gap-3 font-display font-bold text-sm">
            {NAV.map((item) => renderItem(item, desktopLink))}
            <div className="relative" ref={subscribeRef}>
              <button
                type="button"
                onClick={() => setSubscribeOpen((o) => !o)}
                aria-expanded={subscribeOpen}
                aria-haspopup="true"
                className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-m3-full hover:m3-elevation-1-shadow active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Subscribe
              </button>
              {subscribeOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-[320px] max-w-[calc(100vw-3rem)] bg-m3-surface border border-m3-outline/10 rounded-[20px] shadow-xl p-5 z-40">
                  <p className="font-display font-bold text-sm text-m3-on-surface mb-1">
                    {NEWSLETTER_TITLE}
                  </p>
                  <p className="text-xs text-m3-on-surface-variant font-medium mb-4">
                    {NEWSLETTER_PROMISE}
                  </p>
                  <NewsletterSignup stacked />
                </div>
              )}
            </div>
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
            <div className="mt-3 pt-4 border-t border-m3-outline/10">
              <p className="px-4 font-display font-bold text-sm text-m3-on-surface mb-1">
                {NEWSLETTER_TITLE}
              </p>
              <p className="px-4 text-xs text-m3-on-surface-variant font-medium mb-4">
                {NEWSLETTER_PROMISE}
              </p>
              <div className="px-4">
                <NewsletterSignup stacked />
              </div>
            </div>
          </nav>
        )}
      </motion.header>
    </>
  );
}
