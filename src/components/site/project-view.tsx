"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DISCIPLINE_INDEX, DISCIPLINE_LABEL, type Media, type Project } from "@/content/types";
import { CropMarks } from "./crop-marks";
import { Lightbox } from "./lightbox";

type Template = "photography" | "design" | "film";

function templateFor(project: Project): Template {
  if (project.discipline.includes("photography")) return "photography";
  if (project.discipline.includes("film")) return "film";
  return "design";
}

/**
 * Project body — cover, sticky meta rail, block sequence, next-project footer.
 * Templates: photography (image-led + viewer), design (board sequence), film (player-first).
 */
export function ProjectView({ project, next }: { project: Project; next: Project }) {
  const reduce = useReducedMotion();
  const template = templateFor(project);
  const ratio = project.cover.width / project.cover.height;

  // discipline-specific cover ratio
  const coverRatioClass =
    template === "film"
      ? "aspect-video"
      : ratio < 0.95
        ? "aspect-[4/5]"
        : ratio < 1.25
          ? "aspect-square"
          : "aspect-[3/2]";

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="bg-ink text-paper"
    >
      {/* ---------- cover ---------- */}
      <header className="px-gutter pt-28 md:pt-36">
        <p className="mono-label text-paper/50">
          <Link href="/work" className="link-underline">Archive</Link>
          <span aria-hidden="true"> ✱ </span>
          {DISCIPLINE_INDEX[project.discipline[0]]} — {project.discipline.map((d) => DISCIPLINE_LABEL[d]).join(" · ")}
        </p>
        <h1 className="font-display mt-6 text-[15vw] leading-[0.86] md:text-[9vw]">
          {project.title}
          <span className="text-signal neon-text">.</span>
        </h1>

        <div className={`relative mt-10 overflow-hidden rounded-[2px] bg-graphite/5 md:mt-14 ${coverRatioClass}`}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            priority
            sizes="100vw"
            placeholder={project.cover.blurDataURL ? "blur" : "empty"}
            blurDataURL={project.cover.blurDataURL}
            className="object-cover"
          />
          <CropMarks />
        </div>
      </header>

      {/* ---------- summary + sticky meta rail ---------- */}
      <section className="px-gutter mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="max-w-[52ch] text-xl leading-relaxed text-paper/85 md:text-2xl">{project.summary}</p>
        </div>
        <aside className="md:col-span-4 md:col-start-9">
          <div className="md:sticky md:top-24">
            <MetaRail project={project} template={template} />
          </div>
        </aside>
      </section>

      {/* ---------- block sequence ---------- */}
      <BlockSequence project={project} template={template} />

      {/* ---------- next project ---------- */}
      <NextProject next={next} />
    </motion.article>
  );
}

function MetaRail({ project, template }: { project: Project; template: Template }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Discipline",
      value: project.discipline.map((d) => DISCIPLINE_LABEL[d]).join(" · "),
    },
  ];
  if (project.client) rows.push({ label: "Client", value: project.client });
  if (project.year) rows.push({ label: "Year", value: String(project.year) });
  if (project.role) rows.push({ label: "Role", value: project.role });
  if (project.deliverables?.length)
    rows.push({ label: "Deliverables", value: project.deliverables.join(", ") });
  if (template === "film") {
    rows.push({
      label: "Format",
      value: "Short film · practical light",
    });
  }

  return (
    <dl className="border-t border-paper/15">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-paper/15 py-3.5">
          <dt className="mono-label shrink-0 text-paper/45">{r.label}</dt>
          <dd className="text-right text-[14px] leading-snug text-paper/85">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function BlockSequence({ project, template }: { project: Project; template: Template }) {
  const images: Media[] = [];
  for (const b of project.blocks) {
    if (b.type === "image-full" || b.type === "image-caption") images.push(b.media);
    if (b.type === "image-two") images.push(...b.media);
    if (b.type === "image-three") images.push(...b.media);
  }

  const [viewer, setViewer] = useState<number | null>(null);
  const canView = template === "photography" && images.length > 0;

  const wrapClick = (media: Media) => {
    if (!canView) return;
    const idx = images.findIndex((m) => m.src === media.src);
    if (idx >= 0) setViewer(idx);
  };

  return (
    <section className="px-gutter mt-20 space-y-20 md:mt-28 md:space-y-28" aria-label="Project content">
      {project.blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return (
              <div key={i} className="mx-auto max-w-[60ch]">
                {block.heading && <h2 className="font-display text-3xl md:text-4xl mb-4">{block.heading}</h2>}
                <p className="text-[17px] leading-relaxed text-paper/80">{block.body}</p>
              </div>
            );

          case "image-full":
            return (
              <figure key={i}>
                <button
                  type="button"
                  onClick={() => wrapClick(block.media)}
                  disabled={!canView}
                  className={`relative block w-full overflow-hidden rounded-[2px] ${block.media.height > block.media.width ? "max-w-[720px] mx-auto" : ""}`}
                  style={{ aspectRatio: `${block.media.width} / ${block.media.height}` }}
                  aria-label={canView ? "Open image full screen" : undefined}
                >
                  <Image
                    src={block.media.src}
                    alt={block.media.alt}
                    fill
                    sizes="(min-width: 1024px) 90vw, 100vw"
                    placeholder={block.media.blurDataURL ? "blur" : "empty"}
                    blurDataURL={block.media.blurDataURL}
                    className="object-cover"
                  />
                  {template === "design" && <CropMarks />}
                </button>
                {block.caption && (
                  <figcaption className="mono-label mt-3 text-paper/50">{block.caption}</figcaption>
                )}
              </figure>
            );

          case "image-two":
            return (
              <div key={i} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {block.media.map((med, j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => wrapClick(med)}
                    disabled={!canView}
                    className="relative block w-full overflow-hidden rounded-[2px]"
                    style={{ aspectRatio: `${med.width} / ${med.height}` }}
                    aria-label={canView ? "Open image full screen" : undefined}
                  >
                    <Image
                      src={med.src}
                      alt={med.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 92vw"
                      placeholder={med.blurDataURL ? "blur" : "empty"}
                      blurDataURL={med.blurDataURL}
                      className="object-cover"
                    />
                    {template === "design" && <CropMarks />}
                  </button>
                ))}
              </div>
            );

          case "image-three":
            return (
              <div key={i} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {block.media.map((med, j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => wrapClick(med)}
                    disabled={!canView}
                    className="relative block w-full overflow-hidden rounded-[2px] aspect-[4/5]"
                    aria-label={canView ? "Open image full screen" : undefined}
                  >
                    <Image
                      src={med.src}
                      alt={med.alt}
                      fill
                      sizes="(min-width: 640px) 30vw, 92vw"
                      placeholder={med.blurDataURL ? "blur" : "empty"}
                      blurDataURL={med.blurDataURL}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            );

          case "image-caption":
            return (
              <figure key={i}>
                <button
                  type="button"
                  onClick={() => wrapClick(block.media)}
                  disabled={!canView}
                  className="relative block w-full overflow-hidden rounded-[2px]"
                  style={{ aspectRatio: `${block.media.width} / ${block.media.height}` }}
                  aria-label={canView ? "Open image full screen" : undefined}
                >
                  <Image
                    src={block.media.src}
                    alt={block.media.alt}
                    fill
                    sizes="(min-width: 1024px) 90vw, 100vw"
                    placeholder={block.media.blurDataURL ? "blur" : "empty"}
                    blurDataURL={block.media.blurDataURL}
                    className="object-cover"
                  />
                  {template === "design" && <CropMarks />}
                </button>
                <figcaption className="mono-label mt-3 text-paper/50">{block.caption}</figcaption>
              </figure>
            );

          case "video":
            return (
              <figure key={i} className="aspect-video overflow-hidden rounded-[2px] bg-ink">
                <video
                  src={block.media.src}
                  poster={block.media.poster}
                  controls
                  preload="none"
                  playsInline
                  className="h-full w-full object-cover"
                  aria-label={block.media.alt}
                />
                {block.caption && <figcaption className="mono-label mt-3 text-paper/50">{block.caption}</figcaption>}
              </figure>
            );

          case "before-after":
            return (
              <figure key={i} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { med: block.before, tag: "Before" },
                  { med: block.after, tag: "After" },
                ].map(({ med, tag }) => (
                  <div key={tag} className="relative overflow-hidden rounded-[2px]" style={{ aspectRatio: `${med.width} / ${med.height}` }}>
                    <Image
                      src={med.src}
                      alt={med.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 92vw"
                      placeholder={med.blurDataURL ? "blur" : "empty"}
                      blurDataURL={med.blurDataURL}
                      className="object-cover"
                    />
                    <span className="mono-label absolute left-3 top-3 rounded-[20px] bg-ink/70 px-3 py-1.5 text-paper">
                      {tag}
                    </span>
                  </div>
                ))}
              </figure>
            );

          default:
            return null;
        }
      })}

      {/* film template — screener note under the sequence */}
      {template === "film" && project.screenerNote && (
        <p className="mono-label mx-auto max-w-[60ch] rounded-[2px] border border-paper/20 px-4 py-3 text-center text-paper/60">
          ( {project.screenerNote} )
        </p>
      )}

      {canView && viewer !== null && (
        <Lightbox
          items={images}
          index={viewer}
          onIndex={setViewer}
          onClose={() => setViewer(null)}
          label={`${project.title} — viewer`}
        />
      )}
    </section>
  );
}

function NextProject({ next }: { next: Project }) {
  return (
    <Link
      href={`/work/${next.slug}`}
      className="group mt-24 block border-t border-paper/15 md:mt-36"
      aria-label={`Next project: ${next.title}`}
    >
      <div className="px-gutter grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          <p className="mono-label text-paper/45">Next project</p>
          <p className="font-display mt-4 text-[13vw] leading-[0.86] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-3 md:text-[7vw]">
            {next.title}
            <span className="text-signal neon-text">.</span>
          </p>
          <p className="mono-label mt-4 text-paper/50">
            {next.discipline.map((d) => DISCIPLINE_LABEL[d]).join(" · ")}
          </p>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-[2px] md:col-span-4 md:col-start-9">
          <Image
            src={next.cover.src}
            alt={next.cover.alt}
            fill
            sizes="(min-width: 768px) 30vw, 92vw"
            placeholder={next.cover.blurDataURL ? "blur" : "empty"}
            blurDataURL={next.cover.blurDataURL}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <CropMarks />
        </div>
      </div>
    </Link>
  );
}
