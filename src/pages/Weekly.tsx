/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { ArrowUpRight, Clock, Mail } from "lucide-react";
import { formatLongDate } from "../lib/formatDate";
import { WEEKLY_PUBLICATION_URL } from "../data/weekly";
import { useWeeklyIssues } from "../hooks/useLatestWeekly";
import { NEWSLETTER_TITLE, NEWSLETTER_PROMISE } from "../data/newsletter";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import NewsletterSignup from "../components/NewsletterSignup";
import { usePageSeo } from "../hooks/usePageSeo";

/**
 * The Weekly archive.
 *
 * Every issue lives on beehiiv, so this is an index rather than a reader —
 * each card leaves the site. That's deliberate: mirroring the content here
 * would mean two canonical copies of every issue competing in search, and
 * beehiiv already renders them well.
 *
 * The list comes from /api/latest-weekly with the committed issues as its
 * floor, so this page is never empty even if beehiiv is unreachable.
 */
export default function Weekly() {
  const { issues, loading } = useWeeklyIssues();
  usePageSeo("weekly");

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">

        <SiteHeader />

        <section className="px-6 md:px-14 pt-12 md:pt-16 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-m3-primary" />
            <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-primary">
              The Weekly
            </span>
          </div>
          <h1 className="display text-3xl md:text-5xl font-extrabold uppercase tracking-tighter text-m3-on-surface max-w-2xl leading-[0.95]">
            The week, distilled
          </h1>
          <p className="mt-5 text-base md:text-lg font-medium text-m3-on-surface-variant max-w-xl leading-relaxed">
            I publish five tech stories every morning at Long Press. This is
            the best of the week in one email, plus what I&rsquo;m building in
            public. Every issue is free and opens on beehiiv.
          </p>
        </section>

        <section className="px-6 md:px-14 pb-12 flex-1">
          {issues.length > 0 ? (
            <div className="flex flex-col gap-4 md:gap-5">
              {issues.map((issue) => (
                <a
                  key={issue.slug}
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-m3-surface rounded-[28px] border border-m3-outline/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-7 hover:border-m3-primary/30 hover:shadow-xl transition-all"
                >
                  {issue.thumbnail && (
                    <img
                      src={issue.thumbnail}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="w-full md:w-[200px] aspect-video md:aspect-square object-cover object-center rounded-[18px] shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-m3-primary mb-2">
                      {issue.issueNumber !== undefined && `Issue #${issue.issueNumber} · `}
                      {formatLongDate(issue.publishedDate)}
                    </div>
                    <h2 className="display text-lg md:text-xl font-extrabold tracking-tight text-m3-on-surface mb-2 group-hover:text-m3-primary transition-colors">
                      {issue.title}
                    </h2>
                    {issue.teaser && (
                      <p className="text-sm leading-relaxed text-m3-on-surface-variant font-medium max-w-xl line-clamp-3">
                        {issue.teaser}
                      </p>
                    )}
                  </div>
                  <span className="m3-button-tonal text-sm tracking-wide whitespace-nowrap flex items-center gap-2 shrink-0">
                    Read <ArrowUpRight className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          ) : loading ? (
            <div className="flex flex-col gap-4" aria-busy="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="bg-m3-surface rounded-[28px] border border-m3-outline/5 p-6 md:p-8 h-[132px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="bg-m3-surface rounded-[24px] border border-m3-outline/5 p-8">
              <p className="font-display font-bold text-m3-on-surface mb-1">
                Issues are on beehiiv
              </p>
              <p className="text-sm text-m3-on-surface-variant font-medium">
                The archive isn&rsquo;t loading right now.{" "}
                <a
                  href={WEEKLY_PUBLICATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-m3-primary font-bold"
                >
                  Read every issue on beehiiv
                </a>
                .
              </p>
            </div>
          )}
        </section>

        <section
          id="build-notes"
          className="bg-m3-secondary-container text-m3-on-secondary-container px-6 md:px-14 py-10 md:py-14"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-m3-primary" />
              <h2 className="display text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
                {NEWSLETTER_TITLE}
              </h2>
            </div>
            <p className="text-sm md:text-base font-medium opacity-80 mb-6 max-w-xl">
              {NEWSLETTER_PROMISE}
            </p>
            <NewsletterSignup />
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
