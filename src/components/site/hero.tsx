"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
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

function InteractiveContactCard() {
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateX = useSpring(rawX, {
    stiffness: 180,
    damping: 22,
    mass: 0.7,
  });

  const rotateY = useSpring(rawY, {
    stiffness: 180,
    damping: 22,
    mass: 0.7,
  });

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (reduce) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    rawX.set((0.5 - y) * 12);
    rawY.set((x - 0.5) * 16);

    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${x * 100}%`
    );

    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${y * 100}%`
    );
  };

  const handleMouseLeave = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    rawX.set(0);
    rawY.set(0);

    event.currentTarget.style.setProperty("--pointer-x", "50%");
    event.currentTarget.style.setProperty("--pointer-y", "50%");
  };

  return (
    <div className="relative w-full max-w-[490px] [perspective:1200px]">

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative isolate w-full rounded-[4px] border border-white/[0.12] bg-[#111111]/80 p-8 text-[#ECE7DC] shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-[border-color,box-shadow] duration-300 hover:border-[#FD802E]/40 hover:shadow-[0_30px_100px_rgba(0,0,0,0.6)] md:p-12 lg:min-h-[490px] lg:p-12"
      >

        {/* Base glass surface */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[4px] bg-gradient-to-br from-white/[0.07] via-transparent to-white/[0.015]"
        />

        {/* Cursor-following orange glare */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[4px] opacity-70 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(253,128,46,0.18), transparent 48%)",
          }}
        />

        {/* Ambient orange glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-[#FD802E]/[0.08] blur-[90px]"
        />

        {/* Animated technical lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[4px]"
        >
          <div className="absolute left-0 top-[25%] h-px w-full bg-gradient-to-r from-transparent via-[#FD802E]/20 to-transparent" />
          <div className="absolute left-0 top-[75%] h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <motion.div
            animate={reduce ? undefined : { y: ["-100%", "500%"] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-[#FD802E]/[0.06] to-transparent"
          />
        </div>

        {/* Corner brackets */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3"
        >
          <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-[#FD802E]/50" />
          <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-[#FD802E]/50" />
          <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[#FD802E]/50" />
          <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#FD802E]/50" />
        </div>

        {/* Main content */}
        <div
          className="relative z-10"
          style={{ transform: "translateZ(35px)" }}
        >

          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="mono-label text-[#ECE7DC]/50">
              OGINGA® / PORTFOLIO
            </p>

            <span className="mono-label text-[#FD802E]/70">
              001—026
            </span>
          </div>

          {/* Heading */}
          <div className="mt-14">
            <h2 className="max-w-[390px] font-display text-[clamp(2.2rem,4vw,3.7rem)] uppercase leading-[0.95] tracking-[-0.035em]">
              Creating
              <br />
              Images,
              <br />
              Identities
              <br />

              <span className="serif-accent font-normal italic text-[#FD802E]">
                & moving pictures.
              </span>
            </h2>
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-full bg-gradient-to-r from-[#FD802E]/40 via-white/15 to-transparent" />

          {/* Contact */}
          <div className="pb-12">
            <p className="mono-label text-[#ECE7DC]/40">
              HAVE A PROJECT IN MIND?
            </p>

            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-3 text-xl font-medium tracking-tight text-[#ECE7DC] transition-colors duration-300 hover:text-[#FD802E] md:text-2xl"
            >
              Let's work together
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Circular animated CTA */}
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
      </motion.div>
    </div>
  );
}


export function Hero() {
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 35]);

  return (
    <section
      aria-label="Introduction"
      id="home"
      className="band-ink relative isolate min-h-[900px] overflow-hidden px-gutter pb-16 pt-16 text-paper md:min-h-[850px] lg:min-h-[100svh] lg:pb-20 lg:pt-12"
    >
      
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
>

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
        <div className="relative flex min-h-[680px] flex-col justify-start lg:min-h-[720px]">

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
              <p className="mono-label text-paper/50">OGINGA®</p>
              <p className="mono-label mt-2 text-signal">001 / CREATIVE</p>
            </div>
          </div>


{/* Portrait composition */}
<div className="pointer-events-none absolute inset-x-0 top-[12%] z-10 flex h-[430px] items-center justify-center md:h-[500px] lg:inset-x-[8%] lg:top-[3%] lg:h-[590px]">

  <div className="absolute left-1/2 top-[25%] h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-signal/[0.13] blur-[85px] md:h-[300px] md:w-[300px] lg:left-[25%] lg:translate-x-0" />

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
    className="relative h-full w-[85%] max-w-[410px] translate-x-5 overflow-hidden md:w-[68%] md:translate-x-4 lg:translate-x-0"
  >
    <Image
      src="https://res.cloudinary.com/lbs3zryh/image/upload/v1793447549/mufxsa.png"
      alt="Victor Oginga — MUFASA®"
      fill
      priority
      sizes="(min-width: 1024px) 410px, 85vw"
      className="object-contain object-bottom"
    />
  </motion.div>
</div>

{/* Bottom introduction and main headline */}
<div className="relative z-30 mt-[390px] text-center md:mt-[440px] lg:mt-[470px] lg:text-left">

  <p className="mono-label mb-5 flex items-center justify-center gap-3 text-paper/65 lg:justify-start">
    <span className="h-2 w-2 rounded-full bg-signal" />
    Hi, AM VICTOR OGINGA: OGINGA®
  </p>

  <h1 className="mx-auto max-w-[1050px] font-display text-[clamp(3.1rem,8.2vw,8.8rem)] uppercase leading-[0.82] tracking-[-0.045em] text-paper lg:mx-0">
    Photography,
    <br />
    Design <span className="serif-accent text-signal">&</span> Film.
  </h1>

  <div className="mt-8 flex flex-nowrap items-center justify-center gap-2 sm:gap-4 lg:justify-start">
    <a
      href="/work"
      className="group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-signal px-4 py-3 mono-label text-ink transition-all duration-300 hover:shadow-[0_0_30px_rgba(253,128,46,0.22)] sm:gap-5 sm:px-6"
    >
      EXPLORE WORK
      <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>

    <a
      href="#contact"
     className="group relative isolate inline-flex min-h-12 shrink-0 items-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06] px-4 py-3 mono-label text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-signal/50 hover:bg-white/[0.09] hover:text-signal sm:px-6"
    >
      <span
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_65%)]"
/>
      START A PROJECT <span
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.04]"
/>
    </a>
  </div>
</div>
</div>
       {/* RIGHT — Interactive 3D contact card */}
<div className="relative z-30 flex items-center justify-center lg:justify-end">
  <InteractiveContactCard />
</div>
      </div>

 
    </section>
  );
}