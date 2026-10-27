/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode;
  ariaLabel?: string;
  /** Show a mobile-only progress-dot strip beneath the track, synced to
   * whichever card is currently snapped into view. Opt-in since most rails
   * (e.g. the video carousel) read fine without it. */
  showDots?: boolean;
}

/**
 * Horizontal scroll-snap carousel: native swipe on touch,
 * arrow buttons on pointer devices. Children set their own widths.
 */
export default function Carousel({ children, ariaLabel, showDots = false }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  // Browsers auto-redirect a vertical wheel/trackpad gesture into horizontal
  // scrolling when it's over an element that only overflows on the x-axis —
  // convenient for shift-less horizontal scrolling, but it also swallows the
  // page's vertical scroll while the cursor happens to be over the rail, so
  // the whole page appears stuck. Detect a vertical-dominant gesture and
  // forward it to the page instead of letting the track eat it. Must be a
  // native (non-passive) listener since React's onWheel is passive by
  // default and can't call preventDefault.
  //
  // Deciding per-tick (comparing deltaX/deltaY on every event) is what made
  // this feel "stuck": a single trackpad swipe rarely moves on one axis
  // only, so consecutive ticks within the same gesture can flip between
  // "forward to page" and "let the rail eat it," pausing the page scroll
  // mid-gesture. Instead, lock the axis on the first tick of a gesture and
  // hold that decision until the gesture goes idle for a beat.
  //
  // A few more things were making the forwarded scroll feel heavy, slow, or
  // janky compared to scrolling anywhere else on the page:
  // 1. A trackpad's momentum ("fling") phase keeps sending wheel ticks with
  //    growing gaps between them as it decelerates. A 150ms idle window was
  //    tight enough to land inside one of those gaps, resetting the axis
  //    lock mid-flick and cutting the scroll short — you'd have to scroll
  //    again to cover the same distance a normal flick would. 250ms rides
  //    out that tail.
  // 2. Not every device reports deltaY in pixels — Firefox (and some mice)
  //    use "lines" or "pages." Forwarding that raw number straight into
  //    scrollBy scrolled a tiny fraction of what the browser's own handling
  //    would have covered. Normalize to pixels first.
  // 3. Calling window.scrollBy synchronously on every single wheel tick
  //    forces a layout on the main thread once per tick. Trackpads can fire
  //    ticks faster than the display refreshes, so several scrollBy calls
  //    were competing within one frame budget — this is what read as janky
  //    on Chrome. Accumulate the pending distance and flush it once per
  //    animation frame instead.
  // 4. THE BIG ONE, confirmed by testing live in the console: `html` has
  //    `scroll-behavior: smooth` globally (index.css). scrollBy/scrollTo
  //    without an explicit `behavior` defer to that CSS value — so every
  //    one of our rAF-batched calls was silently starting a ~300ms smooth
  //    animation and immediately restarting it on the next frame before it
  //    could get anywhere. Verified: 30 calls of scrollBy({top:20}) at one
  //    per frame moved the page 58px total instead of the expected 600px.
  //    Passing behavior: "instant" bypasses the CSS default and actually
  //    moves the full distance we already computed.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let axis: "x" | "y" | null = null;
    let idleTimer: number | undefined;
    let pending = 0;
    let rafId: number | null = null;

    const toPixels = (e: WheelEvent) => {
      if (e.deltaMode === 1) return e.deltaY * 16; // DOM_DELTA_LINE
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // DOM_DELTA_PAGE
      return e.deltaY; // DOM_DELTA_PIXEL
    };

    const flush = () => {
      window.scrollBy({ top: pending, left: 0, behavior: "instant" });
      pending = 0;
      rafId = null;
    };

    const onWheel = (e: WheelEvent) => {
      if (axis === null) {
        axis = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? "y" : "x";
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        axis = null;
      }, 250);

      if (axis === "y") {
        e.preventDefault();
        pending += toPixels(e);
        if (rafId === null) rafId = requestAnimationFrame(flush);
      }
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      track.removeEventListener("wheel", onWheel);
      window.clearTimeout(idleTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Track which card is centered in the viewport so the dot strip can stay
  // in sync with native swipe/scroll — no extra state needed from callers.
  useEffect(() => {
    if (!showDots) return;
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children) as HTMLElement[];
    setDotCount(items.length);
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = items.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: track, threshold: [0.6] }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [showDots, children]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const item = track?.children[i] as HTMLElement | undefined;
    if (!item) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    item.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className="relative group/carousel">
      {/* overflow-y-hidden is load-bearing, not decorative: per spec, an
          element with overflow-x set to anything but visible computes its
          unset overflow-y as auto too. Confirmed live that this track's
          padding gave it ~16px of genuine vertical overflow, so without
          this it was a real (if tiny) vertical scroll container in its own
          right — competing with our own axis detection above.

          Deliberately NOT setting touch-action: pan-x here (an earlier,
          unverified attempt at this did). touch-action is locked in at
          touchstart, before the browser knows which way the finger is
          about to move, so it can't be corrected mid-gesture the way the
          wheel handler above corrects per-tick — there's no JS fix
          available here. Pinning it to pan-x forced every touch that
          starts on a card to be treated as horizontal, which silently ate
          vertical page scroll on real devices (confirmed on both mobile
          Chrome and mobile Safari — a browser-default problem, not a
          per-engine bug). Leaving touch-action at its default "auto" lets
          each browser's own, generally reliable, first-move heuristic
          decide the axis per gesture instead. */}
      <div
        ref={trackRef}
        role="list"
        aria-label={ariaLabel}
        className="flex gap-4 md:gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-m3-surface border border-m3-outline/15 text-m3-on-surface items-center justify-center shadow-md hover:bg-m3-on-surface hover:text-m3-surface hover:border-m3-on-surface transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-95 z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-m3-surface border border-m3-outline/15 text-m3-on-surface items-center justify-center shadow-md hover:bg-m3-on-surface hover:text-m3-surface hover:border-m3-on-surface transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-95 z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {showDots && dotCount > 1 && (
        <div
          className="flex md:hidden justify-center gap-1.5 mt-4"
          role="tablist"
          aria-label={ariaLabel ? `${ariaLabel} progress` : undefined}
        >
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to item ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-m3-on-surface" : "w-1.5 bg-m3-outline/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
