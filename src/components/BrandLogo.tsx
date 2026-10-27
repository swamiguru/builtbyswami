/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";

/**
 * Brand lockup: the "S." monogram tile + the builtbyswami wordmark.
 * Pure black/white/gray — no brand hue, in line with the site's monochrome
 * editorial system.
 */
export default function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="builtbyswami — home">
      <span className="relative w-9 h-9 md:w-10 md:h-10 rounded-[13px] bg-m3-on-surface flex items-center justify-center shadow-sm shrink-0 group-hover:shadow-md transition-shadow">
        <span className="display text-lg md:text-xl font-extrabold text-m3-surface leading-none -translate-x-[0.5px]">
          S
        </span>
        <span className="absolute bottom-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-m3-surface" />
      </span>
      <span className="display text-xl md:text-2xl font-extrabold tracking-tight text-m3-on-surface lowercase leading-none">
        built<span className="italic">by</span>swami
      </span>
    </Link>
  );
}
