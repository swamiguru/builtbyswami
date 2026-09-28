/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Preview of today's Long Press issue on the builtbyswami.com homepage.
 * Sits right after the hero, since the hero's primary CTA ("Read today's
 * five") already points here — this gives a visitor something to look at
 * before they click through, instead of a bare button.
 *
 * Data comes from src/data/longpress.ts, which reads the same daily JSON
 * the Long Press importer consumes. No new API, no client-side call across
 * to longpress.news at runtime.
 */

import { ArrowUpRight, ArrowRight, Newspaper } from "lucide-react";
import { trackCta } from "../lib/analytics";
import {
  LATEST_DAILY_ISSUE,
  getKnownIssuePost,
  dailyIssueUrl,
} from "../data/longpress";

export default function TodayOnLongPress() {
  const issue = LATEST_DAILY_ISSUE;
  if (!issue) return null;

  const knownIssue = getKnownIssuePost(issue);
  const issueUrl = dailyIssueUrl(issue);

  return (
    <section className="px-6 md:px-14 py-10 md:py-14 bg-m3-surface border-b border-m3-outline/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-[12px] bg-m3-primary-container text-m3-on-primary-container flex items-center justify-center shrink-0">
              <Newspaper className="w-4 h-4" />
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] font-bold text-m3-on-surface-variant/40">
                01
              </span>
              <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-on-surface">
                Today on Long Press
              </span>
            </span>
          </div>
          <a
            href="https://longpress.news/daily"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta("longpress_browse_archive", "home_longpress")}
            className="text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant hover:text-m3-primary transition-colors flex items-center gap-1"
          >
            Browse the archive <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <a
          href={issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCta("longpress_read_today", "home_longpress")}
          className="group block bg-m3-surface-variant/40 rounded-[28px] border border-m3-outline/5 p-6 md:p-8 hover:border-m3-primary/30 hover:shadow-xl transition-all"
        >
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-m3-on-surface-variant">
            The Daily Five · {issue.date}
          </span>
          <h2 className="display text-lg md:text-2xl font-extrabold tracking-tight text-m3-on-surface mt-2 mb-3 leading-snug group-hover:text-m3-primary transition-colors">
            {issue.title}
          </h2>
          <p className="text-sm md:text-base text-m3-on-surface-variant font-medium leading-relaxed max-w-3xl mb-5">
            {issue.intro}
          </p>

          {knownIssue && (
            <div className="border-t border-m3-outline/10 pt-4 mb-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-m3-primary block mb-1.5">
                Known Issue
              </span>
              <p className="text-sm text-m3-on-surface font-medium leading-relaxed max-w-2xl">
                {knownIssue.hook}
              </p>
            </div>
          )}

          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-m3-primary group-hover:gap-2.5 transition-all">
            Read today&rsquo;s issue <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </a>
      </div>
    </section>
  );
}
