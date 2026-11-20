
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load the WebGL fluid simulation
const GlowCursor = dynamic(() => import("./Glowcursor"), {
  ssr: false,
});

export default function GlowCursorOverlay() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hasMouse = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    const hasTouch = window.matchMedia(
      "(pointer: coarse)"
    ).matches;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Enable on desktop and touch devices
    setEnabled((hasMouse || hasTouch) && !reduceMotion);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9990,
        pointerEvents: "none",
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
