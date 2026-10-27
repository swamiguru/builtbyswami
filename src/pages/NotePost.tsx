/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { NOTES_SORTED, getNote, formatNoteDate } from "../data/notes";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ScrollProgress from "../components/ScrollProgress";
import Reveal from "../components/Reveal";
import TableOfContents, {
  extractTocFromMarkdown,
  createMarkdownHeadingComponents,
} from "../components/TableOfContents";

const YOUTUBE = "https://www.youtube.com/@builtbyswami";

// Compact date for the sub-nav pills — "Jul 27" rather than formatNoteDate's
// "Jul 27, 2026", so "Previous · Jul 27" still fits a 48px-tall bar.
const formatShortDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function NotePost() {
  const { slug } = useParams<{ slug: string }>();
  const note = slug ? getNote(slug) : undefined;

  // NOTES_SORTED is newest-first, so the older note sits at index + 1
  // and the newer one at index - 1.
  const index = note ? NOTES_SORTED.findIndex((n) => n.slug === note.slug) : -1;
  const older = index >= 0 ? NOTES_SORTED[index + 1] : undefined;
  const newer = index > 0 ? NOTES_SORTED[index - 1] : undefined;

  const tocItems = useMemo(
    () => (note ? extractTocFromMarkdown(note.content) : []),
    [note]
  );
  const markdownComponents = useMemo(() => createMarkdownHeadingComponents(), []);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (note) {
      document.title = `${note.title} | Build Notes`;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", note.description);
    }
  }, [note]);

  if (!note) return <Navigate to="/notes" replace />;

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <ScrollProgress />
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">

        <SiteHeader />

        {/* Contextual sub-nav */}
        <div className="h-12 md:h-14 border-b border-m3-outline/20 flex items-center justify-between px-6 md:px-10 bg-m3-surface/60">
          <Link to="/notes" className="font-display font-bold text-sm text-m3-on-surface hover:text-m3-primary transition-colors">
            ← Build Notes
          </Link>
          <div className="flex items-center gap-1">
            {older ? (
              <Link
                to={`/notes/${older.slug}`}
                aria-label={`Previous note: ${older.title}`}
                title={`Previous note: ${older.title}`}
                className="h-9 pl-2 pr-3 rounded-full flex items-center gap-1 text-m3-on-surface-variant hover:text-m3-primary hover:bg-m3-surface-variant/60 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">
                  Previous · {formatShortDate(older.date)}
                </span>
                <span className="text-xs font-bold whitespace-nowrap sm:hidden">
                  {formatShortDate(older.date)}
                </span>
              </Link>
            ) : (
              <span className="h-9 pl-2 pr-3 flex items-center gap-1 text-m3-on-surface-variant/20">
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">Previous</span>
              </span>
            )}
            {newer ? (
              <Link
                to={`/notes/${newer.slug}`}
                aria-label={`Next note: ${newer.title}`}
                title={`Next note: ${newer.title}`}
                className="h-9 pr-2 pl-3 rounded-full flex items-center gap-1 text-m3-on-surface-variant hover:text-m3-primary hover:bg-m3-surface-variant/60 transition-colors"
              >
                <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">
                  Next · {formatShortDate(newer.date)}
                </span>
                <span className="text-xs font-bold whitespace-nowrap sm:hidden">
                  {formatShortDate(newer.date)}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            ) : (
              <span className="h-9 pr-2 pl-3 flex items-center gap-1 text-m3-on-surface-variant/20">
                <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">Next</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </span>
            )}
          </div>
        </div>

        <div className="max-w-[1020px] mx-auto px-6 md:px-10 py-10 md:py-16 w-full flex flex-col lg:flex-row gap-10 items-start">
          <article className="flex-1 min-w-0 max-w-[720px] w-full">
            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant/60 mb-5">
              <span className="text-m3-primary">{note.tag}</span>
              <span>{formatNoteDate(note.date)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {note.readMinutes} min read</span>
            </div>
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="serif text-3xl md:text-5xl font-medium tracking-tight text-m3-on-surface leading-[1.08] mb-6"
            >
              {note.title}
            </motion.h1>
            {(note.ctaUrl || note.videoUrl) && (
              <div className="flex flex-wrap items-center gap-3 mb-10">
                {note.ctaUrl && (
                  <a
                    href={note.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 m3-button-tonal text-sm tracking-wide"
                  >
                    {note.ctaLabel ?? "Visit the live site"} <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                {note.videoUrl && (
                  <a
                    href={note.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 m3-button-tonal text-sm tracking-wide"
                  >
                    Watch the build on YouTube <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
            <div className="prose-notes">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Floating Table of Contents Sidebar */}
          {tocItems.length > 0 && <TableOfContents items={tocItems} />}
        </div>

        {(older || newer) && (
          <nav
            aria-label="Note navigation"
            className="max-w-[820px] mx-auto px-6 md:px-14 pb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {older ? (
              <Reveal index={0}>
                <Link
                  to={`/notes/${older.slug}`}
                  className="group bg-m3-surface rounded-[20px] border border-m3-outline/5 p-5 md:p-6 hover:border-m3-primary/30 hover:shadow-lg transition-all flex flex-col gap-2"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant flex items-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous · {formatNoteDate(older.date)}
                  </span>
                  <span className="font-display font-bold text-sm md:text-base text-m3-on-surface line-clamp-2 group-hover:text-m3-primary transition-colors">
                    {older.title}
                  </span>
                </Link>
              </Reveal>
            ) : (
              <div />
            )}
            {newer ? (
              <Reveal index={1}>
                <Link
                  to={`/notes/${newer.slug}`}
                  className="group bg-m3-surface rounded-[20px] border border-m3-outline/5 p-5 md:p-6 hover:border-m3-primary/30 hover:shadow-lg transition-all flex flex-col gap-2 md:items-end md:text-right"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant flex items-center gap-1.5 md:flex-row-reverse">
                    Next · {formatNoteDate(newer.date)} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-display font-bold text-sm md:text-base text-m3-on-surface line-clamp-2 group-hover:text-m3-primary transition-colors">
                    {newer.title}
                  </span>
                </Link>
              </Reveal>
            ) : (
              <div />
            )}
          </nav>
        )}

        <SiteFooter />
      </div>
    </div>
  );
}
