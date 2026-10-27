/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock, BookOpen, Search, X, Tag } from "lucide-react";
import { NOTES_SORTED, formatNoteDate, getAllNoteTags, type Note } from "../data/notes";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ScrollProgress from "../components/ScrollProgress";
import Reveal from "../components/Reveal";
import { usePageSeo } from "../hooks/usePageSeo";

const formatMonth = (key: string): string =>
  new Date(key + "-01T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

export default function Notes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const tagParam = searchParams.get("tag") || "";

  const [query, setQuery] = useState(queryParam);
  const [activeTag, setActiveTag] = useState(tagParam);

  const allTags = useMemo(() => getAllNoteTags(), []);

  // Synchronize state if URL params change externally
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setActiveTag(tagParam);
  }, [tagParam]);

  // Update search params cleanly
  const updateFilters = (newQuery: string, newTag: string) => {
    const params: Record<string, string> = {};
    if (newQuery.trim()) params.q = newQuery.trim();
    if (newTag.trim()) params.tag = newTag.trim();
    setSearchParams(params, { replace: true });
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateFilters(val, activeTag);
  };

  const handleTagClick = (tag: string) => {
    const nextTag = activeTag === tag ? "" : tag;
    setActiveTag(nextTag);
    updateFilters(query, nextTag);
  };

  const resetFilters = () => {
    setQuery("");
    setActiveTag("");
    setSearchParams({}, { replace: true });
  };

  // Filter notes by query & tag
  const filteredNotes = useMemo(() => {
    const q = query.toLowerCase().trim();
    return NOTES_SORTED.filter((n) => {
      const matchesTag = !activeTag || n.tag.toLowerCase() === activeTag.toLowerCase();
      if (!matchesTag) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q))
      );
    });
  }, [query, activeTag]);

  // Group filtered notes by month (YYYY-MM)
  const monthGroups = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const n of filteredNotes) {
      const key = n.date.slice(0, 7);
      const list = map.get(key);
      if (list) list.push(n);
      else map.set(key, [n]);
    }
    return Array.from(map.entries());
  }, [filteredNotes]);

  usePageSeo("notes");
  const shouldReduceMotion = useReducedMotion();

  const isFiltered = Boolean(query.trim() || activeTag);

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <ScrollProgress />
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">

        <SiteHeader />

        <section className="px-6 md:px-14 pt-12 md:pt-16 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-m3-primary" />
            <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-primary">
              Build Notes
            </span>
          </div>
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="serif text-3xl md:text-5xl font-medium tracking-tight text-m3-on-surface max-w-2xl leading-[1.05]"
          >
            The wiring behind the builds
          </motion.h1>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-base md:text-lg font-medium text-m3-on-surface-variant max-w-xl leading-relaxed"
          >
            Build notes from shipping solo — the brief, the method, and what broke. Written after each thing goes live, while the decisions are still fresh.
          </motion.p>

          {/* Search & Tag Filter Bar */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-m3-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search notes by keyword, topic, or tech..."
                className="w-full bg-m3-surface text-m3-on-surface placeholder:text-m3-on-surface-variant/50 text-sm font-medium rounded-full pl-11 pr-10 py-3 border border-m3-outline/20 focus:border-m3-primary focus:outline-hidden transition-all shadow-xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  aria-label="Clear search input"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/60 hover:text-m3-on-surface p-1 rounded-full hover:bg-m3-surface-variant transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tag selection pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleTagClick("")}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  !activeTag
                    ? "bg-m3-primary text-m3-on-primary shadow-xs"
                    : "bg-m3-surface text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-m3-surface-variant/80 border border-m3-outline/10"
                }`}
              >
                All Notes ({NOTES_SORTED.length})
              </button>

              {allTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    activeTag.toLowerCase() === tag.toLowerCase()
                      ? "bg-m3-primary text-m3-on-primary shadow-xs"
                      : "bg-m3-surface text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-m3-surface-variant/80 border border-m3-outline/10"
                  }`}
                >
                  <Tag className="w-3 h-3 opacity-60" />
                  {tag} <span className="opacity-70 font-semibold">({count})</span>
                </button>
              ))}

              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-m3-primary hover:underline ml-1 cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Status line when filtered */}
            {isFiltered && (
              <div className="text-xs font-bold uppercase tracking-wider text-m3-on-surface-variant/70">
                Showing {filteredNotes.length} of {NOTES_SORTED.length} notes
                {query && <span> matching &ldquo;{query}&rdquo;</span>}
                {activeTag && <span> in #{activeTag}</span>}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 md:px-14 pb-14 flex-1">
          {monthGroups.length > 0 ? (
            <div className="flex flex-col gap-10">
              {monthGroups.map(([month, items]) => (
                <div key={month} className="flex flex-col gap-4 md:gap-5">
                  <h2 className="font-display text-xs font-black uppercase tracking-[0.25em] text-m3-on-surface-variant/60">
                    {formatMonth(month)}
                  </h2>
                  {items.map((n, i) => (
                    <Reveal key={n.slug} index={i}>
                      <Link
                        to={`/notes/${n.slug}`}
                        className="group bg-m3-surface rounded-[24px] border border-m3-outline/5 p-6 md:p-8 hover:border-m3-primary/30 hover:shadow-xl transition-all flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant/60">
                          <span className="text-m3-primary font-extrabold">#{n.tag}</span>
                          <span>{formatNoteDate(n.date)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {n.readMinutes} min
                          </span>
                        </div>
                        <h3 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface group-hover:text-m3-primary transition-colors">
                          {n.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-m3-on-surface-variant font-medium max-w-2xl">
                          {n.description}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-m3-primary">
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ))}
            </div>
          ) : isFiltered ? (
            <div className="bg-m3-surface rounded-[24px] border border-m3-outline/10 p-8 md:p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-4 my-6">
              <div className="w-12 h-12 rounded-full bg-m3-surface-variant flex items-center justify-center text-m3-primary">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-m3-on-surface">
                  No matching build notes
                </h3>
                <p className="text-sm text-m3-on-surface-variant mt-1">
                  We couldn&rsquo;t find any notes matching your search criteria. Try a different keyword or clear your tag filter.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 bg-m3-primary text-m3-on-primary font-display font-bold text-xs px-5 py-2.5 rounded-full hover:m3-elevation-1-shadow active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <p className="text-m3-on-surface-variant font-medium">Notes are on the way — check back soon.</p>
          )}
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
