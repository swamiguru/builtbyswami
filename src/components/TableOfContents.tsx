/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from "react";
import { ListFilter, ChevronUp, X, ArrowUp, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Converts heading text into a URL-friendly slug ID
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extracts h2 and h3 headings from raw markdown text
 */
export function extractTocFromMarkdown(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2]
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .trim();

      const id = slugifyHeading(rawText);
      if (id && rawText) {
        items.push({ id, text: rawText, level });
      }
    }
  }
  return items;
}

/**
 * Extracts plain text from nested React children nodes
 */
export function getNodeText(node: React.ReactNode): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (typeof node === "object" && "props" in node && (node as any).props?.children) {
    return getNodeText((node as any).props.children);
  }
  return "";
}

/**
 * Helper generating custom ReactMarkdown components with scroll targets and ID anchors
 */
export function createMarkdownHeadingComponents() {
  return {
    h2: ({ children, ...props }: any) => {
      const text = getNodeText(children);
      const id = slugifyHeading(text);
      return (
        <h2 id={id} className="scroll-mt-32 group relative" {...props}>
          <a
            href={`#${id}`}
            className="inline-flex items-center gap-1.5 text-inherit no-underline hover:text-m3-on-surface transition-colors"
          >
            {children}
          </a>
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const text = getNodeText(children);
      const id = slugifyHeading(text);
      return (
        <h3 id={id} className="scroll-mt-32 group relative" {...props}>
          <a
            href={`#${id}`}
            className="inline-flex items-center gap-1.5 text-inherit no-underline hover:text-m3-on-surface transition-colors"
          >
            {children}
          </a>
        </h3>
      );
    },
    table: ({ children }: any) => (
      <div className="table-wrap">
        <table>{children}</table>
      </div>
    ),
  };
}

interface TableOfContentsProps {
  items: TocItem[];
  title?: string;
  className?: string;
}

export default function TableOfContents({
  items,
  title = "Contents",
  className = "",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Monitor scroll position and update active heading
  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      // When near bottom of page, highlight the last item
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      // Find the heading currently in or closest above the active view line
      let current = items[0].id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          current = item.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  const activeIndex = useMemo(() => {
    const idx = items.findIndex((item) => item.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [items, activeId]);

  const activeItem = useMemo(() => {
    return items.find((item) => item.id === activeId) || items[0];
  }, [items, activeId]);

  if (items.length === 0) return null;

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
      setActiveId(id);
      setMobileOpen(false);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Floating Sidebar (Visible on lg and larger screens) */}
      <aside
        className={`hidden lg:block w-[240px] shrink-0 sticky top-[140px] self-start ${className}`}
        aria-label="Table of contents"
      >
        <div className="bg-m3-surface/90 backdrop-blur-md rounded-2xl p-4 border border-m3-outline/15 shadow-sm">
          <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-m3-outline/10">
            <div className="flex items-center gap-2 text-m3-on-surface">
              <Compass className="w-4 h-4 shrink-0" />
              <span className="font-display text-[11px] font-black uppercase tracking-[0.2em]">
                {title}
              </span>
            </div>
            <span className="text-[10px] font-bold text-m3-on-surface-variant/60">
              {activeIndex + 1}/{items.length}
            </span>
          </div>

          <nav>
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollTo(e, item.id)}
                      className={`block py-1.5 transition-all text-xs leading-relaxed ${
                        item.level === 3 ? "pl-5 text-[11px]" : "pl-3"
                      } ${
                        isActive
                          ? "bg-m3-on-surface/10 text-m3-on-surface font-bold border-l-2 border-m3-on-surface rounded-r-lg"
                          : "text-m3-on-surface-variant/80 hover:text-m3-on-surface hover:bg-m3-surface-variant/50 rounded-lg"
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 pt-3 border-t border-m3-outline/10 flex items-center justify-between">
            <button
              onClick={scrollToTop}
              className="text-[11px] font-bold text-m3-on-surface-variant/70 hover:text-m3-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Top of page
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile/Tablet Floating Quick Jump Pill (Visible on < lg screens) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="bg-m3-surface text-m3-on-surface border border-m3-outline/25 shadow-lg rounded-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold hover:border-m3-on-surface active:scale-95 transition-all cursor-pointer"
          aria-expanded={mobileOpen}
          aria-label="Toggle table of contents"
        >
          <ListFilter className="w-4 h-4 text-m3-on-surface" />
          <span className="max-w-[130px] sm:max-w-[180px] truncate text-m3-on-surface">
            {activeItem ? activeItem.text : title}
          </span>
          <ChevronUp
            className={`w-3.5 h-3.5 text-m3-on-surface-variant transition-transform ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Mobile Dropdown Popover */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.16 }}
                className="fixed bottom-20 right-6 left-6 max-w-sm ml-auto bg-m3-surface rounded-2xl p-4 border border-m3-outline/20 shadow-2xl z-50 max-h-[70vh] flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b border-m3-outline/10 mb-2">
                  <div className="flex items-center gap-2 text-m3-on-surface">
                    <Compass className="w-4 h-4 shrink-0" />
                    <span className="font-display text-xs font-black uppercase tracking-wider">
                      {title}
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-full text-m3-on-surface-variant hover:bg-m3-surface-variant/60"
                    aria-label="Close contents"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="overflow-y-auto py-1">
                  <ul className="space-y-1">
                    {items.map((item) => {
                      const isActive = item.id === activeId;
                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => scrollTo(e, item.id)}
                            className={`block py-2 px-3 rounded-lg text-xs transition-all ${
                              item.level === 3 ? "pl-6 text-[11px]" : "pl-3"
                            } ${
                              isActive
                                ? "bg-m3-on-surface/10 text-m3-on-surface font-bold border-l-2 border-m3-on-surface"
                                : "text-m3-on-surface-variant hover:bg-m3-surface-variant/40"
                            }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="mt-3 pt-2 border-t border-m3-outline/10 flex justify-between items-center text-xs">
                  <button
                    onClick={scrollToTop}
                    className="text-m3-on-surface-variant/80 hover:text-m3-on-surface flex items-center gap-1.5 font-bold"
                  >
                    <ArrowUp className="w-3.5 h-3.5" /> Top of page
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
