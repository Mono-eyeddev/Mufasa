"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DISCIPLINE_INDEX, DISCIPLINE_LABEL, DISCIPLINES, type Discipline, type Project } from "@/content/types";
import { WorkFilterPills } from "./selected-work";
import { CropMarks } from "./crop-marks";

export function WorkArchive({ projects, initialDiscipline }: { projects: Project[]; initialDiscipline?: string | null }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Discipline | "all">(
    initialDiscipline && (DISCIPLINES as string[]).includes(initialDiscipline)
      ? (initialDiscipline as Discipline)
      : "all"
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const change = (d: Discipline | "all") => {
    setActive(d);
    const url = new URL(window.location.href);
    if (d === "all") url.searchParams.delete("discipline");
    else url.searchParams.set("discipline", d);
    window.history.replaceState(null, "", url);
  };

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.discipline.includes(active))),
    [active, projects]
  );

  const hovered = filtered.find((p) => p.slug === hoveredSlug);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <WorkFilterPills projects={projects} active={active} onChange={change} idPrefix="archive-filter" />
        <div
          role="group"
          aria-label="View mode"
          className="flex shrink-0 rounded-[20px] border border-paper/20 p-1"
        >
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`mono-label min-h-[36px] rounded-[16px] px-4 transition-colors ${
                view === v ? "bg-signal text-ink" : "text-paper/60 hover:text-paper"
              }`}
            >
              {v === "grid" ? "Grid" : "List"}
            </button>
          ))}
        </div>
      </div>

      <p className="mono-label mt-6 text-paper/45" role="status">
        {String(filtered.length).padStart(2, "0")} project{filtered.length === 1 ? "" : "s"} shown
      </p>

      {/* ---------- GRID VIEW ---------- */}
      {view === "grid" && (
        <motion.div
          layout={!reduce}
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:gap-y-20 lg:grid-cols-12"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((p, i) => {
              const ratio = p.cover.width / p.cover.height;
              const span =
                ratio < 0.95
                  ? "lg:col-span-4"
                  : ratio < 1.25
                    ? i % 2 === 0
                      ? "lg:col-span-5"
                      : "lg:col-span-6"
                    : ratio < 1.7
                      ? "lg:col-span-7"
                      : "lg:col-span-8";
              return (
                <motion.div
                  key={p.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                  className={span}
                >
                  <Link
                    href={`/work/${p.slug}`}
                    className="group block"
                    onMouseEnter={() => setHoveredSlug(p.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    aria-label={`${p.title} — ${DISCIPLINE_LABEL[p.discipline[0]]}`}
                  >
                    <div className="relative overflow-hidden rounded-[2px]" style={{ aspectRatio: `${p.cover.width} / ${p.cover.height}` }}>
                      <Image
                        src={p.cover.src}
                        alt={p.cover.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, (min-width: 640px) 46vw, 92vw"
                        placeholder={p.cover.blurDataURL ? "blur" : "empty"}
                        blurDataURL={p.cover.blurDataURL}
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
                      />
                      <CropMarks className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mono-label mt-3 text-paper/50">
                      {DISCIPLINE_INDEX[p.discipline[0]]} — {p.discipline.map((d) => DISCIPLINE_LABEL[d]).join(" · ")}
                      {p.year ? ` — ${p.year}` : ""}
                    </p>
                    <h2 className="font-display mt-1 text-3xl leading-[0.9] md:text-4xl">
                      <span className="link-underline-accent decoration-2">{p.title}</span>
                    </h2>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ---------- LIST VIEW ---------- */}
      {view === "list" && (
        <div className="mt-10 relative">
          <ul className="border-t border-paper/15">
            <AnimatePresence initial={false}>
              {filtered.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-paper/15"
                  onMouseEnter={() => setHoveredSlug(p.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                >
                  <Link
                    href={`/work/${p.slug}`}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-5 md:grid-cols-[3rem_1fr_10rem_6rem]"
                    aria-label={`${p.title} — ${DISCIPLINE_LABEL[p.discipline[0]]}`}
                  >
                    <span className="mono-label text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-3xl leading-[0.95] transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                      <span className="link-underline-accent decoration-2">{p.title}</span>
                    </span>
                    <span className="mono-label hidden text-paper/50 md:block">
                      {p.discipline.map((d) => DISCIPLINE_LABEL[d]).join(" · ")}
                    </span>
                    <span aria-hidden="true" className="mono-label text-right text-paper/30 group-hover:text-signal">
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* hover image preview (pointer:fine) */}
          {hovered && (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed left-1/2 top-1/2 z-40 hidden h-64 w-96 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2px] lg:block"
            >
              <Image
                src={hovered.cover.src}
                alt=""
                fill
                sizes="24rem"
                className="animate-[hero-fade-in_0.3s_ease] object-cover"
              />
              <CropMarks />
            </div>
          )}
        </div>
      )}
    </>
  );
}
