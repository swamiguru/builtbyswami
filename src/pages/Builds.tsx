/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Hammer } from "lucide-react";
import { BUILDS } from "../data/builds";
import { NOTES_SORTED } from "../data/notes";
import SiteHeader from "../components/SiteHeader";
import LongPressDeepDive from "../components/LongPressDeepDive";
import SiteFooter from "../components/SiteFooter";
import Reveal from "../components/Reveal";
import { usePageSeo } from "../hooks/usePageSeo";

/** Screenshots per build, keyed by exact name. The first shot in each list
 *  is the same asset used on the Home teaser, so a build's primary image
 *  doesn't change between the two places it's shown — the rest are extra
 *  screens that only show up here, where there's room for more than one. */
const BUILD_SHOTS: Record<string, string[]> = {
  "Long Press": [
    "/builds/longpress.webp",
    "/builds/longpress-2.webp",
    "/builds/longpress-3.webp",
    "/builds/longpress-4.webp",
  ],
  "Free Word Tool": [
    "/builds/freewordtool.webp",
    "/builds/freewordtool-2.webp",
    "/builds/freewordtool-3.webp",
    "/builds/freewordtool-4.webp",
  ],
  "अड्डा — Adda": [
    "/builds/adda.webp",
    "/builds/adda-2.webp",
    "/builds/adda-3.webp",
    "/builds/adda-4.webp",
  ],
  "Task management engine": [
    "/builds/taskmanager.webp",
    "/builds/taskmanager-2.webp",
    "/builds/taskmanager-3.webp",
  ],
};

/**
 * Shipped solo.
 *
 * This page does three jobs at once, which is why it earns a nav slot: brand
 * proof for "build · ship · repeat", the evidence behind the Build Sprint
 * offer on /work-with-me, and the thing a hiring manager actually wants to
 * click. Before it existed, all of that lived as a grid two thirds of the way
 * down a 4,000-word page.
 */
export default function Builds() {
  usePageSeo("builds");
  const shouldReduceMotion = useReducedMotion();

  const noteFor = (slug?: string) =>
    slug ? NOTES_SORTED.find((n) => n.slug === slug) : undefined;

  return (
    <div className="min-h-screen bg-m3-surface md:p-8 selection:bg-m3-primary selection:text-m3-on-primary">
      <div className="max-w-[1100px] mx-auto min-h-[90vh] flex flex-col relative bg-m3-surface-variant shadow-xl rounded-m3-xl md:rounded-[32px] border border-m3-outline/10">

        <SiteHeader />

        <section className="px-6 md:px-14 pt-12 md:pt-16 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Hammer className="w-5 h-5 text-m3-primary" />
            <span className="font-display text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-m3-primary">
              Builds
            </span>
          </div>
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="serif text-3xl md:text-5xl font-medium tracking-tight text-m3-on-surface max-w-2xl leading-[1.05]"
          >
            Shipped solo
          </motion.h1>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-base md:text-lg font-medium text-m3-on-surface-variant max-w-xl leading-relaxed"
          >
            Brief to production, single-handedly. AI tools as build partners
            rather than autocomplete. Each one had a constraint, and the
            constraint is the part worth reading.
          </motion.p>
        </section>

        <section className="px-6 md:px-14 pb-12 flex-1">
          <div className="flex flex-col gap-4 md:gap-5">
            {BUILDS.map((build, i) => {
              const note = noteFor(build.noteSlug);
              const shots = BUILD_SHOTS[build.name];
              return (
                <Reveal key={build.name} index={i}>
                <article
                  className="bg-m3-surface rounded-[28px] border border-m3-outline/5 overflow-hidden"
                >
                  {shots && (
                    <div className="flex gap-3 overflow-x-auto px-6 md:px-8 pt-6 md:pt-8 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {shots.map((shot, si) => (
                        <div
                          key={shot}
                          className="shrink-0 w-[150px] md:w-[180px] h-64 md:h-80 overflow-hidden rounded-[18px] bg-m3-surface-variant snap-start"
                        >
                          <img
                            src={shot}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4">
                    <h2 className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface">
                      {build.name}
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-m3-primary-container text-m3-on-primary-container px-3 py-1 rounded-full">
                      {build.status}
                    </span>
                  </div>

                  <p className="text-sm md:text-base leading-relaxed text-m3-on-surface font-medium max-w-2xl mb-5">
                    {build.what}
                  </p>

                  <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mb-6">
                    <div className="sm:col-span-2">
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-m3-primary mb-1.5">
                        The constraint
                      </dt>
                      <dd className="text-sm leading-relaxed text-m3-on-surface-variant font-medium">
                        {build.constraint}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-m3-primary mb-1.5">
                        Shipped in
                      </dt>
                      <dd className="text-sm text-m3-on-surface-variant font-medium">
                        {build.shipped}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-m3-primary mb-1.5">
                        Built with
                      </dt>
                      <dd className="text-sm text-m3-on-surface-variant font-medium">
                        {build.stack}
                      </dd>
                    </div>
                  </dl>

                  {build.deepDive && <LongPressDeepDive data={build.deepDive} />}

                  <div className="flex flex-wrap items-center gap-3">
                    {build.url && (
                      <a
                        href={build.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-m3-primary text-m3-on-primary font-display font-bold px-5 py-2.5 rounded-m3-full text-sm tracking-wide hover:m3-elevation-1-shadow active:scale-95 transition-all shadow-xs"
                      >
                        Open it <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                    {note && (
                      <Link
                        to={`/notes/${note.slug}`}
                        className="inline-flex items-center gap-2 text-m3-on-surface border border-m3-outline/20 font-display font-bold px-5 py-2.5 rounded-m3-full text-sm tracking-wide hover:border-m3-primary/40 hover:text-m3-primary active:scale-95 transition-all"
                      >
                        How it was built <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                  </div>
                </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* The reason this page is worth a nav slot: it's the proof behind an
            offer. Say so once, at the bottom, rather than selling all the way
            down the page. */}
        <section className="px-6 md:px-14 py-8 md:py-10 bg-m3-primary text-m3-on-primary">
          <div className="max-w-3xl">
            <h2 className="serif text-xl md:text-[2rem] font-medium leading-[1.15] mb-4">
              I build working prototypes for teams who need to see the thing
              before committing engineering to it.
            </h2>
            <Link
              to="/work-with-me"
              className="inline-flex items-center gap-2 bg-m3-surface text-m3-on-surface font-display font-bold px-6 py-2.5 rounded-m3-full hover:m3-elevation-2 active:scale-95 transition-all text-sm tracking-wide"
            >
              Build sprints <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
