/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Animates a number from 0 to its target once it scrolls into view — used
 * on the homepage credential band and the About impact grid, the two spots
 * where a bare stat ("$20M+", "30%+") is the whole point of the section.
 *
 * Reduced-motion and no-JS both degrade to the same thing: the final value,
 * rendered immediately, because the number itself (not the count) is the
 * content the prerender step and any crawler needs to see.
 */

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

interface CountUpProps {
  /** Target number to count to. */
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(shouldReduceMotion ? to : 0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setDisplay(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [isInView, to, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
