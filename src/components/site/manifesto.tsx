"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Media } from "@/content/types";
import { Reveal } from "./reveal";

interface Lens {
  discipline: string;
  label: string;
  index: string;
  blurb: string;
  media: Media;
}

export function Manifesto({ lenses }: { lenses: Lens[] }) {
  return (
    <section aria-labelledby="manifesto-heading" className="band-ink-2 px-gutter section-y text-paper">
      <Reveal>
        <p className="mono-label text-paper/50">( Manifesto )</p>
        <h2
          id="manifesto-heading"
          className="mt-8 font-display text-[17vw] leading-[0.88] sm:text-[13vw] lg:text-[9.5vw]"
        >
          Photography<span className="text-signal neon-text">.</span>
          <br />
          <span className="serif-accent font-normal lowercase tracking-normal">and </span>
          Design<span className="text-signal neon-text">.</span>
          <br />
          <span className="serif-accent font-normal lowercase tracking-normal">and </span>
          Film<span className="text-signal neon-text">.</span>
        </h2>
        <p className="mt-10 max-w-[52ch] text-[17px] leading-relaxed text-paper/75">
          One studio, three ways of working. Pictures are made with light, identities with type
          and grid, films with time — the same eye runs through all of it.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-16 md:mt-24">
        <LensRow lenses={lenses} />
      </Reveal>
    </section>
  );
}

function LensRow({ lenses }: { lenses: Lens[] }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="flex flex-col gap-3 md:h-[420px] md:flex-row"
      onMouseLeave={() => setHovered(null)}
    >
      {lenses.map((lens, i) => (
        <LensPanel
          key={lens.discipline}
          lens={lens}
          expanded={hovered === i}
          dimmed={hovered !== null && hovered !== i}
          reduce={reduce}
          onHover={() => setHovered(i)}
        />
      ))}
    </div>
  );
}

function LensPanel({
  lens,
  expanded,
  dimmed,
  reduce,
  onHover,
}: {
  lens: Lens;
  expanded: boolean;
  dimmed: boolean;
  reduce: boolean | null;
  onHover: () => void;
}) {
  const isFilm = lens.discipline === "film";
  const [tc, setTc] = useState(0);

  // running timecode for the film panel
  useEffect(() => {
    if (!isFilm || reduce) return;
    const id = window.setInterval(() => setTc((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [isFilm, reduce]);

  const timecode = `00:${String(Math.floor(tc / 60)).padStart(2, "0")}:${String(tc % 60).padStart(2, "0")}`;

  return (
    <Link
      href={`/work?discipline=${lens.discipline}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onTouchStart={onHover}
      className={`group relative block overflow-hidden rounded-[2px] text-left aspect-[4/3] md:aspect-auto md:h-full ${
        reduce ? "md:flex-1" : ""
      }`}
      style={
        reduce
          ? undefined
          : {
              flexGrow: expanded ? 1.6 : 1,
              flexBasis: expanded ? "56%" : "22%",
              flexShrink: 1,
              transition: "flex-basis 500ms cubic-bezier(.2,.8,.2,1), flex-grow 500ms cubic-bezier(.2,.8,.2,1)",
            }
      }
      aria-label={`See ${lens.label} work`}
    >
      {/* media */}
      {isFilm ? (
        <div className="absolute inset-0 border border-paper/10 bg-ink">
          {/* letterboxed 2.39:1 still */}
          <div className="absolute inset-x-0 top-1/2 aspect-[2.39/1] w-full -translate-y-1/2 overflow-hidden">
            <Image
              src={lens.media.src}
              alt={lens.media.alt}
              fill
              sizes="(min-width: 768px) 40vw, 92vw"
              placeholder={lens.media.blurDataURL ? "blur" : "empty"}
              blurDataURL={lens.media.blurDataURL}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <span className="mono-label absolute bottom-3 right-4 text-paper/90 tabular-nums">
            <span className="blink-soft mr-2 text-signal neon-text-soft">●</span>TC {timecode}
          </span>
        </div>
      ) : lens.discipline === "graphic-design" ? (
        <div className="absolute inset-0 bg-signal">
          {/* flat accent-tinted board with a design crop */}
          <div className="absolute inset-3 overflow-hidden rounded-[2px] md:inset-5">
            <Image
              src={lens.media.src}
              alt={lens.media.alt}
              fill
              sizes="(min-width: 768px) 40vw, 92vw"
              placeholder={lens.media.blurDataURL ? "blur" : "empty"}
              blurDataURL={lens.media.blurDataURL}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-ink/25">
          <Image
            src={lens.media.src}
            alt={lens.media.alt}
            fill
            sizes="(min-width: 768px) 40vw, 92vw"
            placeholder={lens.media.blurDataURL ? "blur" : "empty"}
            blurDataURL={lens.media.blurDataURL}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-ink/25" />
        </div>
      )}

      {/* label */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-4 md:p-5">
        <div>
          <p className="mono-label text-paper/70">{lens.index}</p>
          <p className={`font-display mt-1 text-paper transition-all duration-500 ${expanded ? "md:text-4xl" : "md:text-3xl"}`}>
            {lens.label}
          </p>
          <p
            className={`mt-1 max-w-[30ch] text-sm leading-snug text-paper/80 transition-all duration-500 ${
              expanded ? "opacity-100 md:translate-y-0" : "opacity-100 md:pointer-events-none md:translate-y-2 md:opacity-0"
            }`}
          >
            {lens.blurb}
          </p>
        </div>
        <span aria-hidden="true" className="font-display text-paper/60 transition-colors group-hover:text-signal text-2xl">
          ✱
        </span>
      </div>
    </Link>
  );
}
