/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Check, ChevronDown, Radio, Repeat2, Search } from "lucide-react";
import type { DeepDive } from "../data/builds";

const DAY_MS = 86_400_000;
const toDay = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Numbers that come straight from the daily issue files (see vite.config.ts),
 *  so they move on their own every time an issue is published. */
function useOutput() {
  const issues = __LP_ISSUES__;
  const span = Math.round((toDay(__LP_LAST__) - toDay(__LP_FIRST__)) / DAY_MS) + 1;
  const pct = Math.min(100, Math.round((issues / Math.max(span, 1)) * 100));
  return { issues, stories: issues * 5, span, pct };
}

/** True from the md breakpoint up. Lets us render one layout, not two. */
function useIsDesktop() {
  const q = "(min-width: 768px)";
  const [yes, setYes] = useState(
    typeof window !== "undefined" && window.matchMedia(q).matches
  );
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setYes(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return yes;
}

/**
 * Long Press, opened up. A dark "result" band first (what it has produced),
 * then the seven disciplines as a tabbed explorer instead of a wall of text:
 * one lens at a time, a one-line claim, then the facts. Every panel stays in
 * the DOM (hidden, not removed) so it remains readable by crawlers.
 */
export default function LongPressDeepDive({ data }: { data: DeepDive }) {
  const [active, setActive] = useState(0);
  const [openRow, setOpenRow] = useState<number | null>(0);
  const desktop = useIsDesktop();
  const out = useOutput();

  const metrics: { value: string; label: string }[] = [
    { value: String(out.issues), label: "issues published" },
    { value: String(out.stories), label: "stories, each in four parts" },
    { value: `${out.pct}%`, label: `of days since launch (${out.span} days)` },
    { value: "4", label: "channels fed every morning" },
    ...(data.reach ?? []),
  ];

  const value: { icon: typeof Repeat2; title: string; body: string }[] = [
    {
      icon: Repeat2,
      title: "A daily habit, proven",
      body: `Published on ${out.pct}% of days since launch, a record anyone can check in the public archive.`,
    },
    {
      icon: Radio,
      title: "Distribution already running",
      body: "X, Threads, Instagram and a WhatsApp channel, plus an RSS feed and a search index, all fed from one morning's work.",
    },
    {
      icon: Search,
      title: "A system that transfers",
      body: "The schema, routing guard, importer and scheduling are the same playbook I use on client publications, running on my own.",
    },
  ];

  return (
    <div className="mb-6 rounded-[24px] overflow-hidden border border-m3-outline/10">
      {/* Result band */}
      <div className="bg-m3-on-surface text-m3-surface px-5 md:px-8 py-7 md:py-9">
        <span className="font-display text-[10px] font-black uppercase tracking-[0.25em] text-m3-primary-container">
          Long Press, by the numbers
        </span>
        <h3 className="display mt-2 text-xl md:text-2xl font-extrabold tracking-tight max-w-2xl">
          What one person and a system have published so far
        </h3>

        <dl className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
          {metrics.map((m) => (
            <div key={m.label} className="border-t border-m3-surface/20 pt-3">
              <dd className="display text-4xl md:text-5xl font-extrabold tracking-tighter text-m3-primary-container tabular-nums leading-none">
                {m.value}
              </dd>
              <dt className="mt-2 text-xs md:text-[13px] font-medium text-m3-surface/70 leading-snug">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>

        <p className="mt-7 text-[10px] font-bold uppercase tracking-widest text-m3-surface/50">
          What it is worth before it earns anything
        </p>
        <div className="mt-3 grid md:grid-cols-3 gap-3">
          {value.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[18px] bg-m3-surface/10 p-4">
              <Icon className="w-4 h-4 text-m3-primary-container" />
              <p className="mt-2 text-sm font-bold">{title}</p>
              <p className="mt-1 text-[13px] leading-snug text-m3-surface/70 font-medium">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lens explorer */}
      <div className="bg-m3-surface-variant/60 px-5 md:px-8 py-6 md:py-8">
        <span className="font-display text-[10px] font-black uppercase tracking-[0.25em] text-m3-primary">
          Seven ways to look at it
        </span>
        {desktop ? (
          <div className="mt-4 grid grid-cols-[200px_1fr] gap-8">
            <div role="tablist" aria-label="Long Press, by discipline" className="flex flex-col gap-2">
              {data.lenses.map((l, i) => (
                <button
                  key={l.label}
                  type="button"
                  role="tab"
                  id={`lp-tab-${i}`}
                  aria-selected={active === i}
                  aria-controls={`lp-panel-${i}`}
                  onClick={() => setActive(i)}
                  className={`text-left font-display font-bold text-sm px-4 py-2.5 rounded-[14px] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-m3-primary ${
                    active === i
                      ? "bg-m3-primary text-m3-on-primary"
                      : "bg-m3-surface text-m3-on-surface-variant hover:text-m3-primary"
                  }`}
                >
                  <span className="mono text-[10px] opacity-60 mr-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                </button>
              ))}
            </div>
            <div>
              {data.lenses.map((l, i) => (
                <div
                  key={l.label}
                  role="tabpanel"
                  id={`lp-panel-${i}`}
                  aria-labelledby={`lp-tab-${i}`}
                  hidden={active !== i}
                >
                  <h4 className="display text-2xl font-extrabold tracking-tight text-m3-on-surface">
                    {l.headline}
                  </h4>
                  <ul className="mt-4 flex flex-col gap-3 max-w-2xl">
                    {l.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-3 text-sm leading-relaxed text-m3-on-surface-variant font-medium"
                      >
                        <Check className="w-4 h-4 mt-[3px] shrink-0 text-m3-primary" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Phone: a plain stacked list. Tap a row to open it; no sideways
             scrolling, and the headline is visible only for the open row. */
          <div className="mt-3 flex flex-col">
            {data.lenses.map((l, i) => {
              const open = openRow === i;
              return (
                <div key={l.label} className="border-t border-m3-outline/15 last:border-b">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`lp-row-${i}`}
                    onClick={() => setOpenRow(open ? null : i)}
                    className="w-full flex items-center justify-between gap-3 py-4 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-m3-primary rounded-md"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="mono text-[11px] text-m3-on-surface-variant/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="display text-base font-extrabold tracking-tight text-m3-on-surface">
                        {l.label}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-m3-primary transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div id={`lp-row-${i}`} hidden={!open} className="pb-5">
                    <p className="text-sm font-bold text-m3-primary leading-snug mb-3">
                      {l.headline}
                    </p>
                    <ul className="flex flex-col gap-3">
                      {l.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-3 text-sm leading-relaxed text-m3-on-surface-variant font-medium"
                        >
                          <Check className="w-4 h-4 mt-[3px] shrink-0 text-m3-primary" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
