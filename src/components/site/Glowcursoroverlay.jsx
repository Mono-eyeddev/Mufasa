"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load the WebGL fluid sim so it never blocks first paint
const GlowCursor = dynamic(() => import("./Glowcursor"), { ssr: false });

/**
 * Site-wide glow cursor.
 * Render once in your root layout, e.g. just inside <body>:
 *
 *   <GlowCursorOverlay />
 */
export default function GlowCursorOverlay() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only on devices with a real mouse, and not for reduced-motion users
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(mouse && !reduce);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9990, // above the page, below the rocket flight (9998/9999)
        pointerEvents: "none", // never blocks clicks
      }}
    >
      <GlowCursor
        color="#ff6a00"
        intensity={1.3}
        trailWidth={3}
        linger={1.4}
        glow={1.2}
        clickBurst
        theme="dark"
        quality="medium"
        maxDevicePixelRatio={1.5}
      />
    </div>
  );
}