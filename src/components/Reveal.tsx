/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Scroll-triggered fade/rise-in, used for section headlines and card grids
 * on the homepage and About timeline. Fires once (viewport.once) so it never
 * re-triggers while scrolling back up, and collapses to an instant, static
 * render under prefers-reduced-motion — same pattern SiteHeader already uses
 * for its show/hide transition, just applied to content instead of chrome.
 */

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger index — multiplied by 0.08s. Use for grids/lists of siblings. */
  index?: number;
  /** Starting vertical offset in px. */
  y?: number;
  className?: string;
  /** "fade" skips the y-translate, for text that shouldn't visibly rise. */
  variant?: "rise" | "fade";
}

export default function Reveal({
  children,
  index = 0,
  y = 18,
  className,
  variant = "rise",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion || variant === "fade" ? 0 : y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
