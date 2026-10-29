"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { RotatingBadge } from "./rotating-badge";

export interface HeroSlide {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  index: string;
  label: string;
}

const LETTERS = ["M", "U", "F", "A", "S", "A"];

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, 48]); // ≤6% of image height
  const parallax = reduce ? 0 : parallaxY;

  // crossfade every 5s — pause on hover, static first frame under reduced motion
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [reduce, slides.length]);

  const current = slides[active];

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      className="band-ink relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden"
    >
      {/* left column — eyebrow + disciplines (desktop) */}
      <div className="px-gutter absolute left-0 top-[19vh] z-30 hidden lg:block">
        <p className="mono-label text-paper/60">Victor Oginga</p>
        <ul className="mt-5 space-y-2">
          {slides.map((s, i) => (
            <li key={s.label} className="mono-label flex items-center gap-3">
              <span className={i === active ? "text-signal neon-text-soft" : "text-paper/35"}>{s.index}</span>
              <span className={i === active ? "text-paper" : "text-paper/55"}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* right column — one line (desktop) */}
      <p className="px-gutter absolute right-0 top-[19vh] z-30 hidden max-w-[220px] text-right text-[15px] leading-snug text-paper/80 lg:block">
        Images, identities and&nbsp;moving pictures.
      </p>

      {/* hero image — centred, 4/5, overlapping the name */}
      <motion.div
        style={reduce ? undefined : { y: parallax }}
        className="absolute left-1/2 top-[12vh] z-10 w-[78vw] -translate-x-1/2 md:w-[60vw] lg:w-[34vw]"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-paper/5 ring-1 ring-inset ring-paper/10">
          {slides.map((s, i) => (
            <div
              key={s.src}
              className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== active}
            >
              <motion.div
                className="relative h-full w-full"
                initial={false}
                animate={i === active ? { scale: 1 } : { scale: 1.03 }}
                transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Image
                  src={s.src}
                  alt={i === active ? s.alt : ""}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 34vw, (min-width: 768px) 60vw, 78vw"
                  placeholder={s.blurDataURL ? "blur" : "empty"}
                  blurDataURL={s.blurDataURL}
                  className="hero-img-fade object-cover"
                />
              </motion.div>
            </div>
          ))}
        </div>

        {/* caption chip — current discipline */}
        <div className="absolute -bottom-4 left-1/2 z-30 -translate-x-1/2">
          <p className="mono-label neon-box whitespace-nowrap rounded-[20px] border border-signal/40 bg-ink/80 px-3.5 py-2 text-paper backdrop-blur-sm">
            {current.index} {current.label}
          </p>
        </div>

        {/* rotating badge beside the image (desktop) */}
        <div className="absolute -right-32 top-2 hidden lg:block">
          <RotatingBadge />
        </div>
      </motion.div>

      {/* disciplines list under the image (mobile / tablet) */}
      <div className="px-gutter absolute top-[66svh] left-0 z-30 lg:hidden">
        <ul className="space-y-1.5">
          {slides.map((s, i) => (
            <li key={s.label} className="mono-label flex items-center gap-3">
              <span className={i === active ? "text-signal neon-text-soft" : "text-paper/35"}>{s.index}</span>
              <span className={i === active ? "text-paper" : "text-paper/55"}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* rotating badge (mobile / tablet) */}
      <div className="px-gutter absolute right-0 top-[64svh] z-30 lg:hidden">
        <RotatingBadge />
      </div>

      {/* wordmark — back copy behind the image */}
      <Wordmark className="pointer-events-none absolute inset-x-0 bottom-0 z-0 select-none" />

      {/* wordmark — front copy clipped to its lowest 28%, in front of the image */}
      <Wordmark
        clip
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden select-none md:block"
      />
    </section>
  );
}

/**
 * The MUFASA® wordmark. `clip` renders the front layer cut to its lowest 28%
 * so the image appears to rise from behind the name.
 */
function Wordmark({ className, clip = false }: { className?: string; clip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={clip ? { clipPath: "inset(72% 0 0 0)" } : undefined}
    >
      <h1
        aria-label="MUFASA®"
        className={`px-gutter whitespace-nowrap text-center font-display text-[26vw] leading-[0.86] ${
          clip ? "text-signal neon-text" : "text-paper"
        }`}
      >
        {LETTERS.map((l, i) =>
          i < LETTERS.length - 1 ? (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
              <span className="rise-mask" style={{ animationDelay: `${i * 50}ms` }}>
                {l}
              </span>
            </span>
          ) : (
            <span key={i} aria-hidden="true" className="relative inline-block align-bottom">
              <span className="inline-block overflow-hidden align-bottom">
                <span className="rise-mask" style={{ animationDelay: `${i * 50}ms` }}>
                  {l}
                </span>
              </span>
              <span
                className="hero-img-fade absolute text-[0.3em] text-signal"
                style={{ top: "-0.12em", right: "-0.3em", lineHeight: 1 }}
              >
                ®
              </span>
            </span>
          )
        )}
      </h1>
    </div>
  );
}
