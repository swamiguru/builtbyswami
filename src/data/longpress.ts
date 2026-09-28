/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * "Today on Long Press" reads the same daily JSON the Long Press importer
 * consumes (scripts/import-roundup.mjs in the longpress repo, per
 * longpress-build-status.md), so the homepage preview and the actual daily
 * issue can never disagree about the lead story. Bundled at build time via
 * import.meta.glob — no fetch, no new API endpoint, and no client-side call
 * across to another registrable domain (which is the thing GA4 cross-domain
 * measurement would otherwise have to account for — see
 * daily-five-subdomain-decision.md).
 */

export interface DailyPost {
  n: number;
  pillar: string;
  hook: string;
  body: string;
}

export interface DailyIssue {
  date: string; // YYYY-MM-DD
  title: string;
  intro: string;
  posts: DailyPost[];
}

const modules = import.meta.glob<{ default: DailyIssue }>(
  "../content/social/*.json",
  { eager: true }
);

const issues = Object.values(modules)
  .map((m) => m.default)
  .filter((issue): issue is DailyIssue => Array.isArray(issue?.posts) && issue.posts.length > 0)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

/** The newest issue committed to the repo. Undefined only if the folder is
 *  ever empty, which the component below renders around rather than crashes on. */
export const LATEST_DAILY_ISSUE: DailyIssue | undefined = issues[0];

/** Known Issue — the standalone Hot Take or Myth-Buster — only ever lands in
 *  slot 4 or 5, and doesn't close every issue (site-ia-phase-1-status.md has
 *  the rolling rate). Matching on the pillar string, the same way
 *  normalizeCategory does on the Long Press side, so this never drifts from
 *  how the column is actually tagged. */
const KNOWN_ISSUE_PATTERN = /hot take|myth-buster/i;

export function getKnownIssuePost(issue?: DailyIssue): DailyPost | undefined {
  return issue?.posts
    .filter((p) => p.n === 4 || p.n === 5)
    .find((p) => KNOWN_ISSUE_PATTERN.test(p.pillar));
}

export function dailyIssueUrl(issue: DailyIssue): string {
  return `https://longpress.news/daily/${issue.date}`;
}
