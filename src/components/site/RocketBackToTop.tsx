"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   Settings
------------------------------------------------------------------ */
const SHOW_AFTER = 350; // px scrolled before the button appears
const FLIGHT_DURATION = 1600; // ms
const EXPLOSION_DURATION = 1150; // ms
const SMOKE_INTERVAL = 65; // ms between smoke puffs
const MAX_SMOKE = 45;
const PARTICLE_COUNT = 70;

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const EASE = [0.22, 1, 0.36, 1] as const;
const EXPLOSION_COLORS = ["#FFC247", "#FD802E", "#E94B25", "#FFFFFF", "#FF9D42"];

/* ------------------------------------------------------------------
   Cubic-bezier easing (same curve for rocket and page scroll)
------------------------------------------------------------------ */
function bezier(p: number, x1: number, y1: number, x2: number, y2: number) {
  const at = (t: number, a: number, b: number) => {
    const i = 1 - t;
    return 3 * i * i * t * a + 3 * i * t * t * b + t * t * t;
  };
  let lo = 0;
  let hi = 1;
  let t = p;
  for (let n = 0; n < 12; n++) {
    t = (lo + hi) / 2;
    if (at(t, x1, x2) < p) lo = t;
    else hi = t;
  }
  return at(t, y1, y2);
}

const flightEase = (p: number) => bezier(p, EASE[0], EASE[1], EASE[2], EASE[3]);

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------ */
type Smoke = { x: number; y: number; size: number; drift: number; born: number; life: number };
type Spark = {
  vx: number; vy: number; size: number; life: number; age: number;
  rotation: number; spin: number; color: string;
};

/* A soft grey puff drawn once, then reused with drawImage.
   This replaces the expensive CSS blur on every smoke element. */
function makeSmokeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(133,135,123,0.9)");
  grad.addColorStop(0.5, "rgba(133,135,123,0.45)");
  grad.addColorStop(1, "rgba(133,135,123,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export default function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);

  const tickingRef = useRef(false);
  const scrollFrame = useRef<number | null>(null);
  const flightFrame = useRef<number | null>(null);
  const launchingRef = useRef(false);

  /* ----- scroll progress ring + visibility (no React state) ----- */
  useEffect(() => {
    const button = buttonRef.current;
    const ring = ringRef.current;
    if (!button || !ring) return;

    const update = () => {
      tickingRef.current = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(y / max, 1) : 0;
      ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
      if (!launchingRef.current) {
        button.dataset.visible = y > SHOW_AFTER ? "true" : "false";
      }
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      scrollFrame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
      if (flightFrame.current !== null) cancelAnimationFrame(flightFrame.current);
    };
  }, []);

  /* ----- launch sequence: ONE rAF loop drives everything ----- */
  const launch = () => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const flyer = flyerRef.current;
    const flame = flameRef.current;
    if (!button || !canvas || !flyer || !flame || launchingRef.current) return;

    const initialScroll = window.scrollY;
    if (initialScroll === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, 0);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      window.scrollTo(0, 0);
      return;
    }

    launchingRef.current = true;

    const rect = button.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const targetY = Math.max(130, Math.min(window.innerHeight * 0.28, 250));

    // Size the overlay canvas to the viewport
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas.style.display = "block";

    flyer.style.display = "block";
    button.dataset.visible = "false";

    // Stop fighting CSS smooth scrolling while we drive the scroll ourselves
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    // Let the user take over scrolling mid-flight (the show goes on)
    let scrollCancelled = false;
    const cancelScroll = () => { scrollCancelled = true; };
    window.addEventListener("wheel", cancelScroll, { passive: true, once: true });
    window.addEventListener("touchstart", cancelScroll, { passive: true, once: true });
    window.addEventListener("keydown", cancelScroll, { once: true });

    const sprite = makeSmokeSprite();
    const smoke: Smoke[] = [];
    let sparks: Spark[] = [];

    const t0 = performance.now();
    let lastSmoke = 0;
    let lastFrame = t0;
    let explodedAt = 0;

    const spawnSparks = () => {
      sparks = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.16;
        const speed = 100 + Math.random() * 340;
        return {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.2 + Math.random() * 3.2,
          life: 0.55 + Math.random() * 0.5,
          age: 0,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 9,
          color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
        };
      });
    };

    const finish = () => {
      window.removeEventListener("wheel", cancelScroll);
      window.removeEventListener("touchstart", cancelScroll);
      window.removeEventListener("keydown", cancelScroll);
      root.style.scrollBehavior = previousBehavior;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      canvas.style.display = "none";
      flyer.style.display = "none";

      launchingRef.current = false;
      flightFrame.current = null;
      button.dataset.visible = window.scrollY > SHOW_AFTER ? "true" : "false";
    };

    const frame = (now: number) => {
      const elapsed = now - t0;
      const dt = Math.min((now - lastFrame) / 1000, 0.035);
      lastFrame = now;

      const p = Math.min(elapsed / FLIGHT_DURATION, 1);
      const e = flightEase(p);
      const y = startY + (targetY - startY) * e;

      // Page scroll shares the rocket's easing
      if (!scrollCancelled && p <= 1) {
        window.scrollTo(0, Math.round(initialScroll * (1 - e)));
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      /* --- rocket flight --- */
      if (p < 1) {
        const shake = Math.sin(elapsed * 0.05) * 2;
        flyer.style.transform =
          `translate3d(${startX}px, ${y}px, 0) translate(-50%, -50%) rotate(${shake}deg)`;
        flame.style.transform =
          `translateX(-50%) scaleY(${0.8 + Math.abs(Math.sin(elapsed * 0.09)) * 0.9})`;

        // Exhaust trail: orange glow + white-hot core, fading toward the tail
        const trailTop = y + 20;
        const trailAlpha = Math.min(p * 5, 1) * (1 - p * 0.45);
        if (startY > trailTop) {
          const glow = ctx.createLinearGradient(0, trailTop, 0, startY);
          glow.addColorStop(0, `rgba(253,128,46,${0.85 * trailAlpha})`);
          glow.addColorStop(1, "rgba(253,128,46,0)");
          ctx.fillStyle = glow;
          ctx.fillRect(startX - 6, trailTop, 12, startY - trailTop);

          const core = ctx.createLinearGradient(0, trailTop, 0, startY);
          core.addColorStop(0, `rgba(255,255,255,${0.95 * trailAlpha})`);
          core.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = core;
          ctx.fillRect(startX - 1.5, trailTop, 3, startY - trailTop);
        }

        // Smoke puffs behind the rocket
        if (elapsed - lastSmoke > SMOKE_INTERVAL && p < 0.96) {
          lastSmoke = elapsed;
          smoke.push({
            x: startX + (Math.random() - 0.5) * 26,
            y: y + 22,
            size: 18 + Math.random() * 30,
            drift: (Math.random() - 0.5) * 65,
            born: now,
            life: 1200 + Math.random() * 800,
          });
          if (smoke.length > MAX_SMOKE) smoke.shift();
        }
      } else if (!explodedAt) {
        // Rocket reached the hero: hide it and detonate
        flyer.style.display = "none";
        explodedAt = now;
        spawnSparks();
      }

      /* --- smoke (sprite drawn with drawImage, no blur filter) --- */
      for (let i = smoke.length - 1; i >= 0; i--) {
        const s = smoke[i];
        const sp = (now - s.born) / s.life;
        if (sp >= 1) {
          smoke.splice(i, 1);
          continue;
        }
        const size = s.size * (0.45 + sp * 2.35);
        const slide = 75 * (1 - Math.pow(1 - sp, 2));
        ctx.globalAlpha = 0.8 * (1 - sp);
        ctx.drawImage(sprite, s.x + s.drift * sp - size / 2, s.y + slide - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      /* --- explosion --- */
      let explosionDone = false;
      if (explodedAt) {
        const t = now - explodedAt;
        explosionDone = t >= EXPLOSION_DURATION;

        // Central flash
        const fp = Math.min(t / 280, 1);
        const flashOpacity = Math.pow(1 - fp, 2);
        if (flashOpacity > 0.01) {
          const r = 8 + fp * 115;
          const g = ctx.createRadialGradient(startX, targetY, 0, startX, targetY, r);
          g.addColorStop(0, `rgba(255,255,255,${flashOpacity})`);
          g.addColorStop(0.22, `rgba(255,194,71,${flashOpacity * 0.85})`);
          g.addColorStop(0.55, `rgba(253,128,46,${flashOpacity * 0.35})`);
          g.addColorStop(1, "rgba(253,128,46,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(startX, targetY, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Expanding rings
        const rp = Math.min(t / 850, 1);
        const ringOpacity = Math.pow(1 - rp, 1.7);
        if (ringOpacity > 0.01) {
          const r = 12 + rp * 175;
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = "#FD802E";
          ctx.globalAlpha = ringOpacity;
          ctx.beginPath();
          ctx.arc(startX, targetY, r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.lineWidth = 1;
          ctx.strokeStyle = "#FFC247";
          ctx.globalAlpha = ringOpacity * 0.7;
          ctx.beginPath();
          ctx.arc(startX, targetY, r * 0.72, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Sparks with drag + gravity
        for (const s of sparks) {
          if (s.age >= s.life) continue;
          s.age += dt;
          const a = s.age;
          const drag = Math.exp(-1.05 * a);
          const px = startX + s.vx * ((1 - drag) / 1.05);
          const py = targetY + s.vy * ((1 - drag) / 1.05) + 0.5 * 115 * a * a;
          const lp = a / s.life;
          const opacity = Math.pow(Math.max(0, 1 - lp), 1.4);
          const tail = Math.min(Math.hypot(s.vx, s.vy) * 0.025, 13);
          const dir = Math.atan2(s.vy + 115 * a, s.vx);

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(px, py);
          ctx.rotate(dir + s.rotation);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.size * 0.7;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-tail, 0);
          ctx.lineTo(0, 0);
          ctx.stroke();
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(0, 0, s.size * (1 - lp * 0.35), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          s.rotation += s.spin * dt;
        }
      }

      if (explosionDone && smoke.length === 0) {
        finish();
      } else {
        flightFrame.current = requestAnimationFrame(frame);
      }
    };

    flightFrame.current = requestAnimationFrame(frame);
  };

  return (
    <>
      {/* Overlay for flight, smoke and explosion (hidden until launch) */}
      <canvas ref={canvasRef} aria-hidden="true" className="btt-canvas" />

      {/* The rocket in flight */}
      <div ref={flyerRef} aria-hidden="true" className="btt-flyer">
        <svg width="48" height="64" viewBox="0 0 48 64" fill="none">
          <path
            d="M24 2C14 14 11 27 13 43L24 53L35 43C37 27 34 14 24 2Z"
            fill="#233D4C" stroke="#FD802E" strokeWidth="2"
          />
          <path
            d="M24 5C17 16 16 26 17 38L24 45L31 38C32 26 31 16 24 5Z"
            fill="#FFC247" fillOpacity=".16"
          />
          <circle cx="24" cy="27" r="6" fill="#080808" stroke="#FFC247" strokeWidth="2" />
          <path
            d="M13 35L4 48L14 45L18 40M35 35L44 48L34 45L30 40"
            stroke="#FD802E" strokeWidth="2"
          />
          <path d="M18 47L24 63L30 47L24 53L18 47Z" fill="#FFC247" />
        </svg>
        <div ref={flameRef} className="btt-engine" />
      </div>

      {/* The button */}
      <button
        ref={buttonRef}
        type="button"
        aria-label="Launch rocket and return to top"
        data-visible="false"
        onClick={launch}
        className="btt"
      >
        <svg className="btt-ring" viewBox="0 0 56 56" aria-hidden="true">
          <circle className="btt-track" cx="28" cy="28" r={RADIUS} />
          <circle
            ref={ringRef}
            className="btt-progress"
            cx="28" cy="28" r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>

        <span className="btt-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="30" height="30" fill="none">
            <path
              d="M24 3C15 11 12 21 13 31L24 39L35 31C36 21 33 11 24 3Z"
              fill="#FD802E" fillOpacity=".12" stroke="#FD802E" strokeWidth="1.8"
            />
            <circle cx="24" cy="21" r="4.2" fill="#080808" stroke="#FFC247" strokeWidth="2" />
            <path
              d="M13 25L6 34L14 32L17 28M35 25L42 34L34 32L31 28"
              stroke="#FD802E" strokeWidth="1.8"
            />
            <path d="M19 34L24 46L29 34L24 39L19 34Z" fill="#FFC247" />
          </svg>
        </span>
      </button>

      <style>{`
        .btt-canvas {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: none;
          pointer-events: none;
        }
        .btt-flyer {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 9998;
          display: none;
          pointer-events: none;
          will-change: transform;
        }
        .btt-flyer svg { display: block; }
        .btt-engine {
          position: absolute;
          left: 50%;
          top: 85%;
          width: 18px;
          height: 54px;
          border-radius: 9999px;
          transform-origin: top center;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, #fff, #FFC247 45%, rgba(253,128,46,0));
        }

        .btt {
          position: fixed;
          right: 28px;
          bottom: 28px;
          z-index: 100;
          width: 56px;
          height: 56px;
          padding: 0;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: rgba(8, 8, 8, 0.95);
          cursor: pointer;
          opacity: 0;
          transform: translateY(24px) scale(0.65);
          pointer-events: none;
          box-shadow: 0 0 24px rgba(253, 128, 46, 0.2);
          transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease;
        }
        .btt[data-visible="true"] {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        .btt[data-visible="true"]:hover {
          transform: scale(1.08);
          box-shadow: 0 0 35px rgba(253, 128, 46, 0.4);
        }
        .btt[data-visible="true"]:active { transform: scale(0.92); }
        .btt:focus-visible {
          outline: 2px solid #FFC247;
          outline-offset: 3px;
        }

        .btt-ring {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .btt-track {
          fill: none;
          stroke: rgba(253, 128, 46, 0.2);
          stroke-width: 2;
        }
        .btt-progress {
          fill: none;
          stroke: #FD802E;
          stroke-width: 2.5;
          stroke-linecap: round;
        }

        /* Idle bob: CSS only, runs on the compositor */
        .btt-icon {
          display: block;
          line-height: 0;
          animation: btt-bob 2.5s ease-in-out infinite;
        }
        .btt:hover .btt-icon { animation-duration: 0.9s; }

        @keyframes btt-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-1.5px) rotate(2deg); }
          50%      { transform: translateY(-3px) rotate(0deg); }
          75%      { transform: translateY(-1.5px) rotate(-2deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .btt { transition: none; }
          .btt-icon { animation: none; }
        }
        @media (max-width: 640px) {
          .btt { right: 16px; bottom: 16px; }
        }
      `}</style>
    </>
  );
}