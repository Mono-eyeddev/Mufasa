
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BG = "#080808";
const IVORY = "#ECE7DC";
const ORANGE = "#FD802E";
const NAVY = "#233D4C";

const PLACEHOLDERS = [
  { ratio: "3 / 4" },
  { ratio: "3 / 2" },
  { ratio: "4 / 5" },
  { ratio: "16 / 10" },
  { ratio: "3 / 4" },
].map((frame, i) => ({
  ...frame,
  label: `Photograph ${String(i + 1).padStart(2, "0")}`,
}));



const randomStar = (seed) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const STARS = [
  // Deep-space nebula clouds
  "radial-gradient(ellipse 80% 35% at 48% 48%, rgba(116,126,174,0.19), rgba(65,76,119,0.12) 45%, transparent 100%)",
  "radial-gradient(ellipse 55% 22% at 52% 43%, rgba(197,180,183,0.13), transparent 100%)",
  "radial-gradient(ellipse 35% 28% at 18% 28%, rgba(65,91,140,0.17), transparent 100%)",
  "radial-gradient(ellipse 38% 25% at 83% 65%, rgba(108,69,100,0.14), transparent 100%)",
  "radial-gradient(ellipse 90% 12% at 50% 48%, rgba(190,190,210,0.10), transparent 100%)",

  // Dense, naturally scattered Milky Way stars
  ...Array.from({ length: 350 }, (_, i) => {
    const x = randomStar(i + 1) * 100;
    const y = 30 + randomStar(i + 501) * 40;
    const size = randomStar(i + 901) > 0.97 ? 2.5 : randomStar(i + 901) > 0.7 ? 1.5 : 1;
    const alpha = 0.35 + randomStar(i + 1201) * 0.65;

    return `radial-gradient(${size}px ${size}px at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(236,231,220,${alpha.toFixed(2)}) 50%, transparent 100%)`;
  }),

  // Stars scattered across the entire sky
  ...Array.from({ length: 300 }, (_, i) => {
    const x = randomStar(i + 2001) * 100;
    const y = randomStar(i + 2501) * 100;
    const size = randomStar(i + 3001) > 0.985 ? 2.5 : randomStar(i + 3001) > 0.75 ? 1.5 : 1;
    const alpha = 0.3 + randomStar(i + 3501) * 0.7;

    return `radial-gradient(${size}px ${size}px at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(236,231,220,${alpha.toFixed(2)}) 50%, transparent 100%)`;
  }),

  // Prominent stars
  "radial-gradient(3px 3px at 14% 22%, #FFFFFF 50%, transparent 100%)",
  "radial-gradient(3px 3px at 38% 67%, #FFFFFF 50%, transparent 100%)",
  "radial-gradient(3px 3px at 72% 19%, #FFFFFF 50%, transparent 100%)",
  "radial-gradient(3px 3px at 88% 54%, #FFFFFF 50%, transparent 100%)",
].join(",");



const METEORS = [
  ["8%", "-4%", "0s"],
  ["38%", "-6%", "3.5s"],
  ["70%", "-3%", "7s"],
];

export function Manifesto({ lenses = [], frames }) {
  const root = useRef(null);
  const track = useRef(null);

  const items = frames?.length ? frames : PLACEHOLDERS;
  const loop = [...items, ...items];

  useEffect(() => {
    const rootElement = root.current;
    const trackElement = track.current;

    if (!rootElement || !trackElement) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Main typography entrance
        gsap.from(".manifesto-mask", {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
        });

        gsap.from(".manifesto-fade", {
          opacity: 0,
          y: 16,
          duration: 0.8,
          delay: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });

        gsap.from(".manifesto-strip", {
          opacity: 0,
          scale: 0.92,
          duration: 1.4,
          ease: "power3.out",
        });

        // Seamless infinite photo strip
        gsap.to(trackElement, {
          xPercent: -50,
          duration: 50,
          ease: "none",
          repeat: -1,
        });

        // Scroll interaction
        gsap.timeline({
          scrollTrigger: {
            trigger: rootElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
          .to(".manifesto-copy", {
            scale: 0.82,
            opacity: 0,
            y: -40,
            ease: "none",
          }, 0)
          .to(".manifesto-strip", {
            y: 90,
            ease: "none",
          }, 0);
      });

      return () => mm.revert();
    }, rootElement);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="manifesto"
      aria-label="MUFASA creative manifesto"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#080808] text-[#ECE7DC]"
    >
      <style>{`
        @keyframes manifesto-meteor {
          0% {
            transform: translate(0, 0) rotate(22deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          100% {
            transform: translate(640px, 260px) rotate(22deg);
            opacity: 0;
          }
        }

        @keyframes manifesto-scroll-dot {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(240%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .manifesto-meteor,
          .manifesto-scroll-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* Starfield */}
      <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0"
  style={{
    backgroundColor: "#080808",
    backgroundImage: STARS,
    backgroundSize: "100% 100%",
    opacity: 1,
  }}
/>

      {/* Meteors */}
      {METEORS.map(([left, top, delay], i) => (
        <span
          key={i}
          aria-hidden="true"
          className="manifesto-meteor pointer-events-none absolute h-px w-24 bg-gradient-to-r from-transparent to-[#ECE7DC]/70"
          style={{
            left,
            top,
            animation: `manifesto-meteor 9s linear ${delay} infinite`,
            opacity: 0,
          }}
        />
      ))}

      {/* Tilted photo strip */}
      <div
        aria-hidden="true"
        className="manifesto-strip absolute left-[-20%] top-1/2 w-[140%] -translate-y-1/2"
        style={{ rotate: "-12deg" }}
      >
        <ul
          ref={track}
          className="flex w-max items-center gap-5"
        >
          {loop.map((frame, i) => (
            <li
              key={i}
              className="shrink-0 overflow-hidden rounded-2xl border border-[#ECE7DC]/10 bg-[#233D4C]"
              style={{
                height: "clamp(180px, 34vh, 340px)",
                aspectRatio: frame.ratio || `${frame.width}/${frame.height}`,
              }}
            >
              {frame.src ? (
                <div className="h-full w-full bg-[#233D4C]">
                  <img
                    src={frame.src}
                    alt={frame.alt || ""}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid h-full w-full place-items-center p-4 text-center">
                  <div>
                    <span className="mb-3 block font-mono text-[10px] tracking-[0.25em] text-[#FD802E]">
                      OGINGA®
                    </span>
                    <span className="font-mono text-xs tracking-widest text-[#ECE7DC]/40">
                      {frame.label}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Horizon fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent"
      />

      {/* Horizon ellipse */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[78%] left-1/2 h-full w-[170%] -translate-x-1/2 rounded-[100%] bg-[#080808]"
        style={{
          boxShadow: `inset 0 2px 24px ${ORANGE}, 0 -10px 70px 2px rgba(253,128,46,.35)`,
        }}
      />

      {/* Horizon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-14 left-1/2 h-24 w-[60%] -translate-x-1/2 rounded-full blur-[60px]"
        style={{ background: `${ORANGE}30` }}
      />

      {/* Main copy */}
      <div className="manifesto-copy relative z-10 flex flex-col items-center px-5 text-center mix-blend-difference">

        <p className="manifesto-fade mb-6 text-xs tracking-[0.3em]">
          Photographer, designer, filmmaker
        </p>

        <p className="mb-4 overflow-hidden">
          <span className="manifesto-mask inline-block pl-[0.5em] text-[clamp(1rem,2.6vw,2.25rem)] font-light tracking-[0.5em]">
            Victor Oginga
          </span>
        </p>

        <h1
          className="overflow-hidden pb-[0.06em] font-display text-[clamp(4.5rem,22vw,20rem)] font-bold leading-[0.85] tracking-tight"
          aria-label="MUFASA"
        >
          <span aria-hidden="true" className="inline-block">
            {"MUFASA".split("").map((character, i) => (
              <span
                key={i}
                className="manifesto-mask inline-block"
              >
                {character}
              </span>
            ))}
            <sup className="ml-2 align-top text-[0.1em]">®</sup>
          </span>
        </h1>

        <div className="manifesto-fade mt-10 flex flex-wrap justify-center gap-4 mix-blend-normal">
          <a
            href="#work"
            className="rounded-full bg-[#FD802E] px-7 py-3 font-medium text-[#080808] transition-colors duration-300 hover:bg-[#FFC247]"
          >
            Explore work
          </a>

          <a
            href="#contact"
            className="rounded-full border border-[#ECE7DC]/40 px-7 py-3 text-[#ECE7DC] transition-colors duration-300 hover:border-[#FD802E] hover:text-[#FD802E]"
          >
            Start a project
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="manifesto-fade absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.25em] text-[#ECE7DC]/60">
        <span className="relative block h-9 w-px overflow-hidden bg-[#ECE7DC]/20">
          <span
            className="manifesto-scroll-dot absolute inset-x-0 top-0 h-3 bg-[#FD802E]"
            style={{
              animation: "manifesto-scroll-dot 1.8s ease-in-out infinite",
            }}
          />
        </span>
        Scroll
      </div>
    </section>
  );
}
