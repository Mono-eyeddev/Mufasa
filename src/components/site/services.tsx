"use client";

import Image from "next/image";
import { useState } from "react";
import type { Media } from "@/content/types";
import { Reveal } from "./reveal";
import { CropMarks } from "./crop-marks";

interface ServiceThumb {
  media: Media;
  alt: string;
}

export interface ServiceRow {
  index: string;
  title: string;
  line: string;
  thumbs: ServiceThumb[];
}

/**
 * Services — five numbered rows, huge condensed type,
 * expanding on hover/tap to one factual line + three related thumbnails.
 */
export function Services({ rows }: { rows: ServiceRow[] }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="band-ink border-t border-paper/10 px-gutter section-y text-paper"
    >
      <Reveal>
        <p className="mono-label text-paper/50">( Services )</p>
        <h2 id="services-heading" className="font-display mt-6 text-6xl md:text-7xl">
          What I do<span className="text-signal neon-text">.</span>
        </h2>
      </Reveal>

      <div className="mt-12 md:mt-16">
        {rows.map((s) => {
          const thumbs = s.thumbs;
          const open = openIndex === s.index;
          return (
            <div key={s.index} className="border-t border-paper/15 last:border-b">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`service-panel-${s.index}`}
                onMouseEnter={() => setOpenIndex(s.index)}
                onMouseLeave={() => setOpenIndex(null)}
                onFocus={() => setOpenIndex(s.index)}
                onBlur={() => setOpenIndex(null)}
                onClick={() => setOpenIndex(open ? null : s.index)}
                className="group flex w-full items-center justify-between gap-4 py-6 text-left md:py-8"
              >
                <span className="flex items-baseline gap-4 md:gap-8">
                  <span className="mono-label w-8 shrink-0 text-paper/40 transition-colors group-hover:text-signal">
                    {s.index}
                  </span>
                  <span className="font-display text-4xl leading-[0.9] transition-transform duration-500 group-hover:translate-x-2 sm:text-5xl md:text-6xl">
                    {s.title}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`font-display text-2xl transition-all duration-500 ${open ? "rotate-45 text-signal neon-text-soft" : "text-paper/40"}`}
                >
                  ✱
                </span>
              </button>

              <div
                id={`service-panel-${s.index}`}
                hidden={!open}
                className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-12 md:items-center"
              >
                <p className="max-w-[46ch] text-[15px] leading-relaxed text-paper/75 md:col-span-5">
                  {s.line}
                </p>
                <div className="grid grid-cols-3 gap-3 md:col-span-7 md:pl-10">
                  {thumbs.map((t, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
                      <Image
                        src={t.media.src}
                        alt={t.alt}
                        fill
                        sizes="(min-width: 768px) 18vw, 28vw"
                        placeholder={t.media.blurDataURL ? "blur" : "empty"}
                        blurDataURL={t.media.blurDataURL}
                        className="object-cover"
                      />
                      <CropMarks className="opacity-60" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
