/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Subtle cursor-tracked tilt for card grids (consulting offers, builds).
 * Desktop/mouse only — touch devices get no pointermove events so they
 * naturally fall back to a flat card, and prefers-reduced-motion disables
 * the transform outright rather than just shortening it, since a tilt is a
 * vestibular effect, not a timing one.
 */

import { useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Kept small — this is a hint of depth, not a toy. */
  max?: number;
}

export default function TiltCard({ children, className, max = 5 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * max * 2;
    const rotateX = (0.5 - py) * max * 2;
    ref.current.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    ref.current.style.setProperty("--x", `${px * 100}%`);
    ref.current.style.setProperty("--y", `${py * 100}%`);
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`tilt-card transition-transform duration-300 ease-out ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
