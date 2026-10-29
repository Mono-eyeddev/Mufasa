import Image from "next/image";
import Link from "next/link";
import type { Media } from "@/content/types";
import { Reveal } from "./reveal";
import { CropMarks } from "./crop-marks";

export interface Board {
  title: string;
  projectSlug: string;
  tags: string[];
  media: Media;
  /** Only shown when the real project data carries a palette. */
  swatches?: { hex: string; name: string }[];
  typefaces?: string[];
}

/**
 * Design boards — flat presentation boards in a two-column staggered layout.
 */
export function DesignBoards({ boards }: { boards: Board[] }) {
  const left = boards.filter((_, i) => i % 2 === 0);
  const right = boards.filter((_, i) => i % 2 === 1);

  return (
    <section
      aria-labelledby="boards-heading"
      className="band-ink-2 border-t border-paper/10 px-gutter section-y text-paper"
    >
      <Reveal>
        <p className="mono-label text-paper/50">( Design boards )</p>
        <h2 id="boards-heading" className="font-display mt-6 text-6xl md:text-7xl">
          Flat work<span className="text-signal neon-text">.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-2">
        <div className="flex flex-col gap-16 md:gap-24">
          {left.map((b, i) => (
            <Reveal key={b.projectSlug} delay={i * 0.05}>
              <BoardCard board={b} />
            </Reveal>
          ))}
        </div>
        <div className="flex flex-col gap-16 md:mt-[12vh] md:gap-24">
          {right.map((b, i) => (
            <Reveal key={b.projectSlug} delay={i * 0.05}>
              <BoardCard board={b} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BoardCard({ board }: { board: Board }) {
  const isPortrait = board.media.width < board.media.height;
  return (
    <Link
      href={`/work/${board.projectSlug}`}
      className="group block"
      aria-label={`${board.title} — open project`}
    >
      <div className="relative">
        <div
          className={`relative overflow-hidden rounded-[2px] bg-bone shadow-[0_1px_0_rgba(13,12,10,0.08)] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-1 ${
            isPortrait ? "aspect-[4/5]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={board.media.src}
            alt={board.media.alt}
            fill
            sizes="(min-width: 768px) 42vw, 92vw"
            placeholder={board.media.blurDataURL ? "blur" : "empty"}
            blurDataURL={board.media.blurDataURL}
            className="object-cover"
          />
          <CropMarks className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-3xl leading-[0.9]">
          <span className="link-underline-accent decoration-2">{board.title}</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {board.tags.map((t) => (
            <span key={t} className="mono-label rounded-[20px] border border-paper/20 px-2.5 py-1 text-paper/60">
              {t}
            </span>
          ))}
        </div>
      </div>

      {(board.swatches || board.typefaces) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          {board.swatches && (
            <div className="flex items-center gap-1.5" aria-label="Palette">
              {board.swatches.map((s) => (
                <span
                  key={s.hex}
                  title={`${s.name} ${s.hex}`}
                  className="h-4 w-4 rounded-full border border-paper/30"
                  style={{ backgroundColor: s.hex }}
                />
              ))}
            </div>
          )}
          {board.typefaces && (
            <p className="mono-label text-paper/50">Type — {board.typefaces.join(" / ")}</p>
          )}
        </div>
      )}
    </Link>
  );
}
