"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Project } from "@/content/types";
import { DISCIPLINE_LABEL } from "@/content/types";
import { Reveal } from "./reveal";
import { Lightbox, ContactSheetFrame } from "./lightbox";

/**
 * Film reel — ink band, horizontal scroll-snap rail.
 * Hover previews only run when a real video file exists (media.kind === "video");
 * with stills-only assets the cards deep-link into the film's project page.
 */
export function FilmReel({ films }: { films: Project[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-reel-card]");
    const step = card ? card.offsetWidth + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      id="film"
      aria-labelledby="film-heading"
      className="band-ink section-y text-paper"
    >
      <div className="px-gutter flex items-end justify-between gap-6">
        <Reveal>
          <p className="mono-label text-paper/50">( Film reel )</p>
          <h2 id="film-heading" className="font-display mt-6 text-6xl md:text-7xl">
            Moving image<span className="text-signal">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll reel back"
            className="grid h-11 w-11 place-items-center rounded-[20px] border border-paper/25 text-paper hover:border-signal hover:text-signal"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll reel forward"
            className="grid h-11 w-11 place-items-center rounded-[20px] border border-paper/25 text-paper hover:border-signal hover:text-signal"
          >
            →
          </button>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div
          ref={railRef}
          role="region"
          aria-label="Film reel — scroll horizontally"
          tabIndex={0}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-gutter pb-2 focus-visible:outline-signal"
        >
          {/* intro card */}
          <div
            data-reel-card
            className="flex aspect-[16/9] w-[82vw] shrink-0 snap-start flex-col justify-between rounded-[2px] border border-paper/15 p-5 md:w-[34rem]"
          >
            <p className="mono-label text-paper/50">MUFASA® — Reel</p>
            <p className="font-display text-4xl leading-[0.9] md:text-5xl">
              Welcome<span className="text-signal">.</span>
              <br />
              <span className="serif-accent lowercase tracking-normal">take a look around</span>
            </p>
            <p className="mono-label text-paper/40">Scroll the rail →</p>
          </div>

          {films.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-reel-card
              className="group relative block aspect-[16/9] w-[82vw] shrink-0 snap-start overflow-hidden rounded-[2px] bg-graphite md:w-[34rem]"
              aria-label={`Open ${p.title}`}
            >
              <Image
                src={p.cover.src}
                alt={p.cover.alt}
                fill
                sizes="(min-width: 768px) 34rem, 82vw"
                placeholder={p.cover.blurDataURL ? "blur" : "empty"}
                blurDataURL={p.cover.blurDataURL}
                className="object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
              />
              {/* large timecode numerals */}
              <span className="mono-label absolute right-4 top-4 rounded-[20px] bg-ink/60 px-3 py-1.5 text-paper/90 tabular-nums backdrop-blur-sm">
                TC 00:00:00
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-14">
                <p className="mono-label text-paper/60">
                  {p.discipline.map((d) => DISCIPLINE_LABEL[d]).join(" · ")}
                </p>
                <p className="font-display mt-1 text-3xl md:text-4xl text-paper">{p.title}</p>
                {p.role ? (
                  <p className="mono-label mt-1 text-paper/50">{p.role}</p>
                ) : (
                  <p className="mono-label mt-1 text-paper/50">Direction · Camera · Edit</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Contact sheet — dense photography grid on ink, natural aspects in dense rows,
 * opens the fullscreen viewer.
 */
export function ContactSheet({ frames }: { frames: { media: import("@/content/types").Media; frameNo: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="sheet-heading"
      className="band-ink section-y border-t border-paper/10 text-paper"
    >
      <div className="px-gutter">
        <Reveal>
          <p className="mono-label text-paper/50">( Contact sheet )</p>
          <h2 id="sheet-heading" className="font-display mt-6 text-6xl md:text-7xl">
            Every frame<span className="text-signal">.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">
            The roll, uncut — stills and outtakes from recent shoots and sets. Click a frame to
            view it full screen.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="mt-12 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4"
            style={{ gridAutoFlow: "dense" }}
          >
            {frames.map((f, i) => (
              <ContactSheetTile key={f.frameNo} frame={f} onOpen={() => setOpen(i)} priority={i < 4} />
            ))}
          </div>
        </Reveal>
      </div>

      {open !== null && (
        <Lightbox
          items={frames.map((f) => f.media)}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          label="Contact sheet viewer"
        />
      )}
    </section>
  );
}

function ContactSheetTile({
  frame,
  onOpen,
  priority,
}: {
  frame: { media: import("@/content/types").Media; frameNo: string };
  onOpen: () => void;
  priority: boolean;
}) {
  const { media, frameNo } = frame;
  const wide = media.width / media.height > 1.35;
  return (
    <div className={wide ? "col-span-2" : ""}>
      <ContactSheetFrame media={media} frameNo={frameNo} onOpen={onOpen} priority={priority} />
    </div>
  );
}
