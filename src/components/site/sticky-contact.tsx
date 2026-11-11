"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  X,
  Mail,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

import { siteConfig } from "@/content/site";

const socialIcons: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  whatsapp: MessageCircle,
  youtube: Youtube,
  instagram: Instagram,
};

/* ------------------------------------------------------------------ */
/* Eye tuning                                                          */
/* ------------------------------------------------------------------ */

// SVG is drawn 1:1 in px so motion-value offsets are in user units.
const EYE_W = 32;
const EYE_H = 20;

// Max travel of the iris from center (the lids naturally clip it).
const MAX_X = 6;
const MAX_Y = 2.6;

// Distance (px) at which the iris reaches full travel.
const FULL_TRAVEL_DISTANCE = 220;

// Where the eye looks when the panel is open (toward the panel).
const OPEN_LOOK = { x: MAX_X * 0.75, y: 0 };

// Symmetric almond shape.
const ALMOND = "M1 10 Q16 -3 31 10 Q16 23 1 10 Z";

export function StickyContact() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const eyeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Unique, selector-safe ids for SVG defs
  const uid = useId().replace(/:/g, "");
  const ids = {
    clip: `eye-clip-${uid}`,
    sclera: `eye-sclera-${uid}`,
    iris: `eye-iris-${uid}`,
    shade: `eye-shade-${uid}`,
  };

  // Target look position + eyelid openness. Motion values avoid re-rendering
  // the whole component on every pointer move.
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const lid = useMotionValue(1);

  const irisX = useSpring(lookX, { stiffness: 260, damping: 24, mass: 0.7 });
  const irisY = useSpring(lookY, { stiffness: 260, damping: 24, mass: 0.7 });

  // Corneal highlights shift less than the iris, which sells the depth.
  // Border light: drive the conic-gradient angle with JS so only the light
  // travels around the border (rotating the element itself would swing the
  // tall rectangle out of the button's bounds).
  const borderAngle = useMotionValue(0);
  const borderGradient = useTransform(
    borderAngle,
    (a) =>
      `conic-gradient(from ${a}deg, transparent 0deg, transparent 275deg, rgba(253,128,46,0.25) 300deg, #FD802E 320deg, #FFF0D8 328deg, #FD802E 337deg, transparent 355deg, transparent 360deg)`
  );

  const glintX = useTransform(irisX, (v) => v * 0.35);
  const glintY = useTransform(irisY, (v) => v * 0.35);

  /* -------------------------- Cursor tracking ----------------------- */
  useEffect(() => {
    if (reduceMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      // While the panel is open the eye keeps looking at it.
      if (open) return;

      const eye = eyeRef.current;
      if (!eye) return;

      const rect = eye.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);

      if (dist < 0.001) {
        lookX.set(0);
        lookY.set(0);
        return;
      }

      // Ease the travel so small movements near the eye are responsive
      // and far-away movements saturate smoothly.
      const t = Math.min(dist / FULL_TRAVEL_DISTANCE, 1);
      const eased = 1 - Math.pow(1 - t, 2);

      lookX.set((dx / dist) * eased * MAX_X);
      lookY.set((dy / dist) * eased * MAX_Y);
    };

    const recenter = () => {
      if (open) return;
      lookX.set(0);
      lookY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    // `pointerleave` on window never fires; the root element does.
    document.documentElement.addEventListener("pointerleave", recenter);
    window.addEventListener("blur", recenter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", recenter);
      window.removeEventListener("blur", recenter);
    };
  }, [open, reduceMotion, lookX, lookY]);

  // React to open/close immediately, even without pointer movement
  // (keyboard, touch, or a click without moving the mouse).
  useEffect(() => {
    if (open) {
      lookX.set(OPEN_LOOK.x);
      lookY.set(OPEN_LOOK.y);
    } else {
      lookX.set(0);
      lookY.set(0);
    }
  }, [open, lookX, lookY]);

  /* --------------------------- Border light ------------------------- */
  useEffect(() => {
    if (reduceMotion) return;

    const controls = animate(borderAngle, 360, {
      duration: 3.5,
      ease: "linear",
      repeat: Infinity,
    });

    return () => controls.stop();
  }, [reduceMotion, borderAngle]);

  /* ----------------------------- Blinking --------------------------- */
  useEffect(() => {
    if (reduceMotion) {
      lid.set(1);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let controls: ReturnType<typeof animate> | undefined;
    let cancelled = false;

    const blink = (done: () => void) => {
      controls = animate(lid, [1, 0.06, 1], {
        duration: 0.2,
        times: [0, 0.42, 1],
        ease: "easeInOut",
        onComplete: done,
      });
    };

    const schedule = () => {
      if (cancelled) return;

      timer = setTimeout(() => {
        blink(() => {
          if (cancelled) return;

          // Occasional double blink
          if (Math.random() < 0.18) {
            timer = setTimeout(() => blink(schedule), 120);
          } else {
            schedule();
          }
        });
      }, 3000 + Math.random() * 3500);
    };

    schedule();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      controls?.stop();
      lid.set(1);
    };
  }, [reduceMotion, lid]);

  /* ------------------- Keyboard and outside-click ------------------- */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("[data-sticky-contact]")) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      data-sticky-contact
      className="fixed left-0 top-1/2 z-[80] -translate-y-1/2"
    >
      <div className="relative flex items-center">
        {/* Expanded contact panel */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={reduceMotion ? false : { x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { x: -24, opacity: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute left-0
                flex min-w-[220px] flex-col gap-4
                border border-[#FD802E]/30
                bg-[#080808]/90
                p-5 pl-14
                shadow-[0_15px_60px_rgba(0,0,0,0.45)]
                backdrop-blur-xl
              "
            >
              {/* Panel heading */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#FD802E]">
                  GET IN TOUCH
                </span>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close contact panel"
                  className="text-[#ECE7DC]/50 transition-colors hover:text-[#FD802E]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Email */}
              <a
                href={`mailto:${siteConfig.email}`}
                className="
                  group flex items-center justify-between
                  border-b border-[#ECE7DC]/10 pb-3
                  text-sm text-[#ECE7DC]
                  transition-colors hover:text-[#FD802E]
                "
              >
                <span className="flex items-center gap-3">
                  <Mail size={15} />
                  Email
                </span>

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              {/* Social links */}
              {siteConfig.socials.map((social) => {
                const Icon =
                  socialIcons[social.label.toLowerCase()] ?? MessageCircle;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group flex items-center justify-between
                      border-b border-[#ECE7DC]/10 pb-3
                      text-sm text-[#ECE7DC]
                      transition-colors hover:text-[#FD802E]
                    "
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={15} />
                      {social.label}
                    </span>

                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky trigger */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-expanded={open}
          aria-label={open ? "Close contact panel" : "Open contact panel"}
          className="
            relative isolate z-10
            flex h-36 w-10
            flex-col items-center justify-between
            bg-[#080808]/90 py-4
            text-[#ECE7DC]
            ring-1 ring-inset ring-[#FD802E]/35
            shadow-[0_0_8px_rgba(253,128,46,0.16),0_10px_25px_rgba(0,0,0,0.4)]
            backdrop-blur-xl
            transition-[background-color,box-shadow] duration-300
            hover:bg-[#233D4C]
            hover:shadow-[0_0_8px_rgba(253,128,46,0.4),0_0_22px_rgba(253,128,46,0.2),0_10px_25px_rgba(0,0,0,0.4)]
            focus-visible:shadow-[0_0_8px_rgba(253,128,46,0.4),0_0_22px_rgba(253,128,46,0.2),0_10px_25px_rgba(0,0,0,0.4)]
          "
        >
          {/* Travelling border light (1px ring just outside the button) */}
          {!reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px z-0"
              style={{
                padding: 1,
                background: borderGradient,
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                mask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
              }}
            />
          )}

          {/* Cursor-following eye */}
          <div
            ref={eyeRef}
            aria-hidden="true"
            className="relative z-10 flex items-center justify-center"
            style={{ width: EYE_W, height: EYE_H }}
          >
            <svg
              width={EYE_W}
              height={EYE_H}
              viewBox={`0 0 ${EYE_W} ${EYE_H}`}
              style={{
                overflow: "visible",
                filter: "drop-shadow(0 0 4px rgba(253,128,46,0.25))",
              }}
            >
              <defs>
                <clipPath id={ids.clip}>
                  <path d={ALMOND} />
                </clipPath>

                <radialGradient id={ids.sclera} cx="48%" cy="40%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#ebe6dc" />
                  <stop offset="100%" stopColor="#a9a398" />
                </radialGradient>

                <radialGradient id={ids.iris} cx="38%" cy="32%" r="75%">
                  <stop offset="0%" stopColor="#ffd18b" />
                  <stop offset="35%" stopColor="#FD802E" />
                  <stop offset="75%" stopColor="#8d3510" />
                  <stop offset="100%" stopColor="#321509" />
                </radialGradient>

                {/* Upper-lid shadow cast on the eyeball */}
                <linearGradient id={ids.shade} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000" stopOpacity="0.38" />
                  <stop offset="45%" stopColor="#000" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Blink group: scales vertically around the eye center */}
              <motion.g
                style={{
                  scaleY: lid,
                  originX: "50%",
                  originY: "50%",
                }}
              >
                {/* Invisible full-size rect keeps the bbox (and thus the
                    transform origin) stable while the iris moves. */}
                <rect
                  x="0"
                  y="0"
                  width={EYE_W}
                  height={EYE_H}
                  fill="none"
                />

                <g clipPath={`url(#${ids.clip})`}>
                  {/* Sclera */}
                  <rect
                    x="0"
                    y="0"
                    width={EYE_W}
                    height={EYE_H}
                    fill={`url(#${ids.sclera})`}
                  />

                  {/* Iris + pupil */}
                  <motion.g style={{ x: irisX, y: irisY }}>
                    <circle
                      cx="16"
                      cy="10"
                      r="5.4"
                      fill={`url(#${ids.iris})`}
                    />
                    {/* Limbal ring */}
                    <circle
                      cx="16"
                      cy="10"
                      r="5.4"
                      fill="none"
                      stroke="#1d0b04"
                      strokeOpacity="0.55"
                      strokeWidth="0.8"
                    />
                    {/* Pupil dilates slightly on hover / when open */}
                    <motion.circle
                      cx="16"
                      cy="10"
                      fill="#080808"
                      initial={false}
                      animate={{ r: hovered || open ? 3.1 : 2.6 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  </motion.g>

                  {/* Reflections (move less than the iris) */}
                  <motion.g style={{ x: glintX, y: glintY }}>
                    <circle cx="13.6" cy="7.6" r="1.5" fill="#fff" fillOpacity="0.95" />
                    <circle cx="18.6" cy="12.6" r="0.75" fill="#fff" fillOpacity="0.6" />
                  </motion.g>

                  {/* Lid shadow */}
                  <rect
                    x="0"
                    y="0"
                    width={EYE_W}
                    height={EYE_H}
                    fill={`url(#${ids.shade})`}
                  />
                </g>

                {/* Outline */}
                <path
                  d={ALMOND}
                  fill="none"
                  stroke="#FD802E"
                  strokeOpacity="0.6"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </motion.g>
            </svg>
          </div>

          <span className="relative z-10 font-mono text-[9px] tracking-[0.25em] text-[#FD802E] [writing-mode:vertical-rl]">
            CONTACT
          </span>

          <motion.span
            className="relative z-10"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight size={15} />
          </motion.span>
        </button>
      </div>
    </div>
  );
}