"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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

export function Hero() {
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 35]);

  return (
    <section
      aria-label="Introduction"
      className="band-ink relative isolate min-h-[900px] overflow-hidden px-gutter pb-16 pt-10 text-paper md:min-h-[850px] lg:min-h-[100svh] lg:pb-20 lg:pt-12"
    >
      
      {/* Animated Acid Darkroom atmosphere */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
>
  {/* Lime ambient glow */}
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
    }}
    transition={{
      duration: 9,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute left-[35%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#FD802E] blur-[150px]"
  />

  {/* Rotating orbital ring */}
  <motion.div
    animate={reduce ? undefined : { rotate: 360 }}
    transition={{
      duration: 45,
      repeat: Infinity,
      ease: "linear",
    }}
    className="absolute left-[25%] top-[12%] h-[520px] w-[520px] rounded-full border border-[]/20"
  >
    <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#FD802E] shadow-[0_0_25px_#FD802E]" />
  </motion.div>

  {/* Secondary orbital ring */}
  <motion.div
    animate={reduce ? undefined : { rotate: -360 }}
    transition={{
      duration: 65,
      repeat: Infinity,
      ease: "linear",
    }}
    className="absolute left-[30%] top-[17%] h-[420px] w-[420px] rounded-full border border-paper/10"
  />

  {/* Subtle floating accent */}
  <motion.div
    animate={reduce ? undefined : { y: [0, -25, 0] }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute left-[55%] top-[25%] h-5 w-5 rounded-full border border-[#FD802E]/60"
  />
</div>
      {/* Subtle background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-[25%] h-[420px] w-[420px] rounded-full bg-signal/[0.035] blur-[120px]" />
        <div className="absolute right-[-10%] top-[5%] h-[380px] w-[380px] rounded-full bg-paper/[0.025] blur-[120px]" />
      </div>

      {/* Editorial background watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-2%] top-[13%] z-0 select-none whitespace-nowrap font-display text-[25vw] leading-none text-paper/[0.045]"
      >
        CREATIVE
      </div>

      {/* Main composition */}
      <div className="relative z-10 mx-auto grid min-h-[790px] max-w-[1800px] grid-cols-1 gap-12 lg:min-h-[calc(100svh-80px)] lg:grid-cols-[1.45fr_0.75fr] lg:items-center lg:gap-10">

        {/* LEFT — Image, signature and introduction */}
        <div className="relative flex min-h-[680px] flex-col justify-between lg:min-h-[720px]">

          {/* Top introduction */}
          <div className="relative z-30 flex items-start justify-between gap-6">
            <div>
              <p className="mono-label flex items-center gap-3 text-signal">
                <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_#FD802E]" />
                MULTIDISCIPLINARY CREATIVE
              </p>

              <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-paper/60">
                Photography, graphic design, filmmaking and visual identity.
              </p>
            </div>

            <div className="text-right lg:hidden">
              <p className="mono-label text-paper/50">MUFASA®</p>
              <p className="mono-label mt-2 text-signal">001 / CREATIVE</p>
            </div>
          </div>

          {/* Portrait composition */}
          <div className="pointer-events-none absolute inset-x-0 top-[12%] z-10 flex h-[430px] items-center justify-center md:h-[500px] lg:inset-x-[8%] lg:top-[3%] lg:h-[590px]">

            {/* Lime atmospheric glow */}
            <div className="absolute left-[25%] top-[25%] h-[220px] w-[220px] rounded-full bg-signal/[0.13] blur-[85px] md:h-[300px] md:w-[300px]" />

            {/* Existing project image — temporary portrait */}
            {/* MUFASA — Acid Darkroom Portrait */}
            {/* Floating MUFASA Portrait */}
          <motion.div
  animate={
    reduce
      ? undefined
      : {
          y: [0, -14, 0, 14, 0],
          rotate: [0, 0.6, 0, -0.6, 0],
        }
  }
  transition={{
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="relative h-full w-[68%] max-w-[410px] overflow-hidden"
>
  <Image
    src="https://res.cloudinary.com/lbs3zryh/image/upload/v1793447549/mufxsa.png"
    alt="Victor Oginga — MUFASA®"
    fill
    priority
    sizes="(min-width: 1024px) 410px, 68vw"
    className="object-contain object-bottom"
  />
</motion.div>

            {/* Handwritten-style editorial signature */}
            <div className="absolute left-[2%] top-[48%] z-20 -rotate-[12deg] md:left-[4%]">
              <span className="serif-accent text-[clamp(3rem,8vw,7rem)] italic leading-none text-signal">
                Mufasa
              </span>
            </div>

            <div className="absolute bottom-[4%] right-[4%] z-20 rotate-[7deg]">
              <span className="serif-accent text-[clamp(2.5rem,6vw,5rem)] italic text-paper">
                Visuals.
              </span>
            </div>

        
          </div>

          {/* Bottom introduction and main headline */}
          <div className="relative z-30 mt-[390px] md:mt-[440px] lg:mt-[470px]">
            <p className="mono-label mb-5 flex items-center gap-3 text-paper/65">
              <span className="h-2 w-2 rounded-full bg-signal" />
              VICTOR OGINGA — MUFASA®
            </p>

            <h1 className="max-w-[1050px] font-display text-[clamp(3.1rem,8.2vw,8.8rem)] uppercase leading-[0.82] tracking-[-0.045em] text-paper">
              Photography,
              <br />
              Design <span className="serif-accent text-signal">&</span> Film.
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/work"
                className="group inline-flex min-h-12 items-center gap-5 rounded-full bg-signal px-6 py-3 mono-label text-ink transition-all duration-300 hover:shadow-[0_0_30px_rgba(204,255,0,0.22)]"
              >
                EXPLORE WORK
                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-12 items-center rounded-full border border-paper/35 px-6 py-3 mono-label text-paper transition-colors duration-300 hover:border-signal hover:text-signal"
              >
                START A PROJECT
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT — Floating contact card */}
        <div className="relative z-30 flex items-center justify-center lg:justify-end">

          <div className="relative w-full max-w-[490px] rounded-[4px] bg-paper p-8 text-ink shadow-[0_30px_100px_rgba(0,0,0,0.25)] md:p-12 lg:min-h-[490px] lg:p-12">

            <div className="flex items-center justify-between">
              <p className="mono-label text-ink/55">MUFASA® / PORTFOLIO</p>
              <span className="mono-label text-ink/45">001—026</span>
            </div>

            <div className="mt-14">
              <h2 className="max-w-[390px] font-display text-[clamp(2.2rem,4vw,3.7rem)] uppercase leading-[0.95] tracking-[-0.035em]">
                Creating
                <br />
                Images,
                <br />
                Identities
                <br />
                <span className="serif-accent font-normal italic text-ink/65">
                  & moving pictures.
                </span>
              </h2>
            </div>

            <div className="my-10 h-px w-full bg-ink/15" />

            <div className="pb-12">
              <p className="mono-label text-ink/50">HAVE A PROJECT IN MIND?</p>

              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-3 text-xl font-medium tracking-tight transition-colors hover:text-ink/55 md:text-2xl"
              >
                Let's work together
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            {/* Circular animated contact CTA */}
            <a
              href="#contact"
              aria-label="Let's discuss a project"
              className="group absolute -bottom-9 right-7 flex h-[112px] w-[112px] items-center justify-center rounded-full bg-ink text-paper shadow-xl transition-transform duration-300 hover:scale-105 md:-right-7 md:h-[130px] md:w-[130px]"
            >
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 h-full w-full animate-spin-slow"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="mufasa-contact-circle"
                    d="M 60,60 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
                  />
                </defs>
                <text
                  fill="#FD802E"
                  fontSize="9"
                  letterSpacing="2.2"
                  fontFamily="monospace"
                >
                  <textPath href="#mufasa-contact-circle">
                    LET'S DISCUSS • LET'S DISCUSS •
                  </textPath>
                </text>
              </svg>

              <span className="text-4xl text-signal transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom page marker */}
      <div className="relative z-20 mt-20 flex items-center justify-between border-t border-paper/15 pt-5">
        <p className="mono-label text-paper/45">
          CREATIVE MINDS / VISUAL STORIES
        </p>

        <a
          href="#manifesto"
          className="mono-label flex items-center gap-3 text-paper/65 transition-colors hover:text-signal"
        >
          SCROLL TO EXPLORE
          <span className="text-lg">↓</span>
        </a>
      </div>
    </section>
  );
}