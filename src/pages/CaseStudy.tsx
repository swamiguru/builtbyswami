/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import middleEastLaunches from "../content/case-studies/middle-east-launches.md?raw";
import replatforming from "../content/case-studies/replatforming.md?raw";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ScrollProgress from "../components/ScrollProgress";
import TableOfContents, {
  extractTocFromMarkdown,
  createMarkdownHeadingComponents,
} from "../components/TableOfContents";

/** One entry per case study. The route is /case-study/:slug, so adding a
 *  third means adding a content file and an entry here — nothing else.
 *  Keep the slug stable once published; it is a live URL. */
interface CaseStudyEntry {
  title: string;
  standfirst: string;
  description: string;
  readingTime: string;
  facts: [string, string][];
  content: string;
}

const CASE_STUDIES: Record<string, CaseStudyEntry> = {
  "middle-east": {
    title: "Launching global media brands into the Middle East",
    standfirst:
      "Five titles, three waves — and the last one shipped in half the time.",
    description:
      "How Condé Nast's Middle East expansion shipped across three waves — five flagship titles live in the GCC, the $20M+ Year 1 revenue target exceeded, and a final launch that halved time-to-market.",
    readingTime: "6 min read",
    facts: [
      ["Client", "Condé Nast"],
      ["Role", "Product Lead"],
      ["Titles", "CN Traveller, AD, GQ, Vogue, Wired"],
      ["Waves", "2023 · Jan 2025 · Jan 2026"],
      ["Team", "4 engineers, 1 design lead, 1 PM"],
    ],
    content: middleEastLaunches,
  },
  replatforming: {
    title: "Replatforming without losing traffic or revenue",
    standfirst:
      "Thirteen properties, four brands, eight years. Every one of them dipped, and every one of them came back.",
    description:
      "What actually happens when a live publisher replatforms: thirteen properties across metro.us, Newsweek, GQ's ten markets and Condé Nast Traveller — the integrations that break quietly, and the four things that decide whether traffic holds.",
    readingTime: "7 min read",
    facts: [
      ["Properties", "13 across 4 brands"],
      ["Span", "2017 – 2025"],
      ["Role", "Product Lead"],
      ["Brands", "Metro, Newsweek, GQ, CN Traveller"],
      ["Team", "2–4 engineers, 1 design lead, 1 PM"],
    ],
    content: replatforming,
  },
};

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? CASE_STUDIES[slug] : undefined;

  const tocItems = useMemo(
    () => (study ? extractTocFromMarkdown(study.content) : []),
    [study]
  );
  const markdownComponents = useMemo(() => createMarkdownHeadingComponents(), []);

  useEffect(() => {
    if (!study) return;
    document.title = `${study.title} | Case Study`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", study.description);
  }, [study]);

  /* An unknown slug is a dead URL, not a blank page. */
  if (!study) return <Navigate to="/work-with-me" replace />;

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <ScrollProgress />
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">
        <SiteHeader />

        {/* Contextual sub-nav */}
        <div className="h-12 md:h-14 border-b border-m3-outline/20 flex items-center justify-between px-6 md:px-10 bg-m3-surface/60">
          <Link
            to="/work-with-me"
            className="inline-flex items-center h-full pr-3 font-display font-bold text-sm text-m3-on-surface hover:text-m3-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Work with me
          </Link>
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant/60">
            <Clock className="w-3.5 h-3.5" /> {study.readingTime}
          </span>
        </div>

        <div className="max-w-[1020px] mx-auto px-6 md:px-10 py-10 md:py-16 w-full flex flex-col lg:flex-row gap-10 items-start">
          <article className="flex-1 min-w-0 max-w-[720px] w-full">
            <span className="font-display text-[11px] font-black uppercase tracking-[0.3em] text-m3-primary">
              Case Study
            </span>

            <h1 className="display mt-4 text-3xl md:text-5xl font-extrabold tracking-tighter text-m3-on-surface leading-[1.02]">
              {study.title}
            </h1>

            <p className="mt-5 text-lg md:text-xl font-bold text-m3-primary leading-snug">
              {study.standfirst}
            </p>

            <dl className="mt-9 mb-10 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 bg-m3-surface rounded-[20px] border border-m3-outline/5 p-6">
              {study.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-m3-on-surface-variant/60">
                    {k}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-m3-on-surface leading-snug">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="prose-notes">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {study.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Floating Table of Contents Sidebar */}
          {tocItems.length > 0 && <TableOfContents items={tocItems} />}
        </div>

        {/* Closing CTA — the whole point of publishing this. */}
        <section className="max-w-[820px] mx-auto w-full px-6 md:px-14 pb-14">
          <div className="bg-m3-surface rounded-[28px] border border-m3-outline/5 p-8 md:p-10 flex flex-col items-start gap-3">
            <h2 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface">
              Planning something like this?
            </h2>
            <p className="text-sm md:text-base font-medium text-m3-on-surface-variant leading-relaxed max-w-xl">
              I run this as a fixed-scope engagement for publishers and content
              businesses — market launches, replatforms, and editorial AI
              workflows.
            </p>
            <Link
              to="/work-with-me"
              className="mt-3 inline-flex items-center gap-2 bg-m3-primary text-m3-on-primary font-display font-bold px-7 py-3.5 rounded-m3-full transition-all hover:m3-elevation-1-shadow active:scale-95 shadow-sm"
            >
              See how we could work together <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
