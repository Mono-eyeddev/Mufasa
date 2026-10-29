"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DISCIPLINE_INDEX, DISCIPLINE_LABEL, DISCIPLINES, type Discipline, type Project } from "@/content/types";
import { Reveal } from "./reveal";

const FILTERS: { key: Discipline | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...DISCIPLINES.map((d) => ({ key: d, label: DISCIPLINE_LABEL[d] })),
];

export function WorkFilterPills({
  projects,
  active,
  onChange,
  idPrefix = "filter",
}: {
  projects: Project[];
  active: Discipline | "all";
  onChange: (d: Discipline | "all") => void;
  idPrefix?: string;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      for (const d of p.discipline) map.set(d, (map.get(d) ?? 0) + 1);
    }
    return map;
  }, [projects]);

  return (
    <div
      role="group"
      aria-label="Filter projects by discipline"
      className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 md:mx-0 md:flex-wrap md:px-0 [scroll-snap-type:x_mandatory]"
    >
      {FILTERS.map((f) => {
        const count = f.key === "all" ? projects.length : counts.get(f.key) ?? 0;
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            id={`${idPrefix}-${f.key}`}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(f.key)}
            className={`mono-label flex min-h-[44px] shrink-0 items-center gap-2 rounded-[20px] border px-4 transition-colors [scroll-snap-align:start] ${
              isActive
                ? "neon-box border-signal bg-signal text-ink"
                : "border-paper/25 bg-transparent text-paper/70 hover:border-paper/60 hover:text-paper"
            }`}
          >
            {isActive && <span aria-hidden="true" className="text-[8px] text-ink">●</span>}
            {f.label}
            <span className={isActive ? "text-ink/60" : "text-paper/40"}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}

/** Per-index editorial span pattern — card aspect follows the asset's real ratio. */
function gridClass(i: number, ratio: number) {
  let span: string;
  if (ratio < 0.95) {
    span = "md:col-span-4";
  } else if (ratio < 1.25) {
    span = i % 3 === 0 ? "md:col-span-5" : "md:col-span-6";
  } else if (ratio < 1.7) {
    span = "md:col-span-7";
  } else {
    span = "md:col-span-8";
  }
  const offset = ["md:mt-0", "md:mt-20", "md:mt-8", "md:mt-28"][i % 4];
  return `${span} ${offset}`;
}

export function WorkCard({ project, index }: { project: Project; index: number }) {
  const discipline = project.discipline[0];
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block"
      aria-label={`${project.title} — ${DISCIPLINE_LABEL[discipline]}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-[2px] bg-graphite/5"
        style={{ aspectRatio: `${project.cover.width} / ${project.cover.height}` }}
      >
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(min-width: 1024px) 45vw, (min-width: 768px) 55vw, 92vw"
          placeholder={project.cover.blurDataURL ? "blur" : "empty"}
          blurDataURL={project.cover.blurDataURL}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="mono-label text-paper/50">
          {DISCIPLINE_INDEX[discipline]} — {DISCIPLINE_LABEL[discipline]}
          {project.year ? ` — ${project.year}` : ""}
        </p>
        <span aria-hidden="true" className="mono-label text-paper/30">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="font-display mt-1 text-3xl leading-[0.9] md:text-4xl">
        <span className="link-underline-accent decoration-2">{project.title}</span>
      </h3>
    </Link>
  );
}

export function SelectedWork({
  projects,
  initialDiscipline,
}: {
  projects: Project[];
  initialDiscipline?: string | null;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Discipline | "all">(
    initialDiscipline && (DISCIPLINES as string[]).includes(initialDiscipline)
      ? (initialDiscipline as Discipline)
      : "all"
  );
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [finePointer, setFinePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
  const sectionRef = useRef<HTMLElement>(null);

  const change = (d: Discipline | "all") => {
    setActive(d);
    const url = new URL(window.location.href);
    if (d === "all") url.searchParams.delete("discipline");
    else url.searchParams.set("discipline", d);
    window.history.replaceState(null, "", url);
  };

  // cursor-following View label on pointer:fine
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    mq.addEventListener("change", sync);
    if (!mq.matches) return () => mq.removeEventListener("change", sync);
    const onMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom;
      setCursor(inside ? { x: e.clientX, y: e.clientY } : null);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      mq.removeEventListener("change", sync);
    };
  }, []);

  const filtered = active === "all" ? projects : projects.filter((p) => p.discipline.includes(active));

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-heading"
      className="band-ink px-gutter section-y text-paper"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="mono-label text-paper/50">( Selected work )</p>
          <h2 id="work-heading" className="font-display mt-6 text-6xl md:text-7xl">
            The work<span className="text-signal neon-text">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Link href="/work" className="mono-label link-underline-accent link-underline-neon text-paper">
            Full archive →
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.12} className="mt-10">
        <WorkFilterPills projects={projects} active={active} onChange={change} idPrefix="home-filter" />
      </Reveal>

      <motion.div layout={!reduce} className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-24">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className={gridClass(i, p.cover.width / p.cover.height)}
            >
              <WorkCard project={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* cursor-following View label */}
      {finePointer && cursor && !reduce && (
        <div
          aria-hidden="true"
          className="neon-box pointer-events-none fixed z-40 rounded-[20px] bg-signal px-3.5 py-2"
          style={{ left: cursor.x + 14, top: cursor.y + 14 }}
        >
          <span className="mono-label text-ink">View</span>
        </div>
      )}
    </section>
  );
}
