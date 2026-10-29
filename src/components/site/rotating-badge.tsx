"use client";

import { useCallback } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Rotating circular text badge (SVG textPath, 18s loop).
 * Scrolls to #work, or opens the showreel when a film asset exists (hasFilm).
 */
export function RotatingBadge({ hasFilm = false, targetId = "work" }: { hasFilm?: boolean; targetId?: string }) {
  const reduce = useReducedMotion();

  const handleClick = useCallback(() => {
    if (hasFilm) {
      document.getElementById("film")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      return;
    }
    document.getElementById(targetId)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [hasFilm, reduce, targetId]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={hasFilm ? "Open showreel" : "Scroll to selected work"}
      className="relative block h-24 w-24 md:h-28 md:w-28 rounded-full text-paper transition-colors hover:text-signal hover:drop-shadow-[0_0_12px_rgba(204,255,0,0.4)]"
    >
      <svg
        viewBox="0 0 100 100"
        className={`h-full w-full ${reduce ? "" : "animate-spin-slow"}`}
        aria-hidden="true"
      >
        <defs>
          <path id="badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="mono-label" style={{ fontSize: 8.2, letterSpacing: "0.16em" }} fill="currentColor">
          <textPath href="#badge-circle">Scroll ✱ Showreel ✱ Scroll ✱</textPath>
        </text>
      </svg>
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M7 1v12M1 7h12" />
        </svg>
      </span>
    </button>
  );
}
