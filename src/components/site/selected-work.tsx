
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import StarBorder from "./StarBorder";
import ChromaGrid from "./ChromaGrid";

import {
  DISCIPLINE_INDEX,
  DISCIPLINE_LABEL,
  DISCIPLINES,
  type Discipline,
  type Project,
} from "@/content/types";

import { Reveal } from "./reveal";

/* ───────────────────────── FILTERS ───────────────────────── */

const FILTERS: { key: Discipline | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...DISCIPLINES.map((d) => ({
    key: d,
    label: DISCIPLINE_LABEL[d],
  })),
];

const formatNumber = (value: number) =>
  String(value).padStart(2, "0");

/* ───────────────────────── FILTER NAVIGATION ───────────────────────── */


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
      for (const d of p.discipline) {
        map.set(d, (map.get(d) ?? 0) + 1);
      }
    }

    return map;
  }, [projects]);

  return (
    <div
      role="group"
      aria-label="Filter projects by discipline"
      className="
        flex w-full flex-wrap
        items-center justify-center gap-3
      "
    >
      {FILTERS.map((f) => {
        const count =
          f.key === "all"
            ? projects.length
            : counts.get(f.key) ?? 0;

        const isActive = active === f.key;

        return (
          <StarBorder
            key={f.key}
            id={`${idPrefix}-${f.key}`}
            color="#F28C28"
            trailColor="#F28C28"
            duration={4}
            direction="clockwise"
            stars={1}
            trailLength={0.3}
            thickness={1}
            radius={20}
            glow={0.6}
            sparkle={false}
            hover="lap"
            clickPulse
            theme="dark"
            backgroundColor={isActive ? "#233D4C" : "#080808"}
            textColor="#ECE7DC"
            borderColor="#233D4C"
            className="
  mono-label min-h-[36px] shrink-0
  px-3 py-2 text-[10px] tracking-wider
  transition-colors
"
            aria-pressed={isActive}
            onClick={() => onChange(f.key)}
          >
            <span className="flex items-center gap-2">
              {isActive && (
                <span
                  aria-hidden="true"
                  className="text-[#F28C28]"
                >
                  ●
                </span>
              )}

              {f.label}

              <span className="opacity-50">
                ({count})
              </span>
            </span>
          </StarBorder>
        );
      })}
    </div>
  );
}

/* ───────────────────────── WORK CARD ───────────────────────── */



/* ───────────────────────── SELECTED WORK ───────────────────────── */

export function SelectedWork({
  projects,
  initialDiscipline,
}: {
  projects: Project[];
  initialDiscipline?: string | null;
}) {
  const reduce = useReducedMotion();

  const [active, setActive] = useState<
    Discipline | "all"
  >(
    initialDiscipline &&
      (DISCIPLINES as string[]).includes(initialDiscipline)
      ? (initialDiscipline as Discipline)
      : "all"
  );

  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [finePointer, setFinePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches
  );

  const sectionRef = useRef<HTMLElement>(null);

  /* Filter + URL state */
  const change = (d: Discipline | "all") => {
    setActive(d);

    const url = new URL(window.location.href);

    if (d === "all") {
      url.searchParams.delete("discipline");
    } else {
      url.searchParams.set("discipline", d);
    }

    window.history.replaceState(null, "", url);
  };

  /* Cursor-following View label */
  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const sync = () => {
      setFinePointer(mq.matches);

      if (!mq.matches) {
        setCursor(null);
      }
    };

    sync();
    mq.addEventListener("change", sync);

    const onMove = (e: MouseEvent) => {
      if (!mq.matches || reduce) return;

      const rect =
        sectionRef.current?.getBoundingClientRect();

      if (!rect) return;

      const inside =
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right;

      setCursor(
        inside
          ? { x: e.clientX, y: e.clientY }
          : null
      );
    };

    window.addEventListener("mousemove", onMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      mq.removeEventListener("change", sync);
    };
  }, [reduce]);

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) =>
          p.discipline.includes(active)
        );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-heading"
      className="
        band-ink px-gutter
        section-y text-paper
      "
    >
      {/* Section heading */}
      <div className="
        flex flex-wrap items-end
        justify-between gap-6
      ">
        <Reveal>
          <p className="mono-label text-paper/50">
            ( Selected work )
          </p>

          <h2
            id="work-heading"
            className="
              font-display mt-6
              text-6xl md:text-7xl
            "
          >
            The work
            <span className="text-signal neon-text">
              .
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href="/work"
            className="
              mono-label link-underline-accent
              link-underline-neon text-paper
            "
          >
            Full archive →
          </Link>
        </Reveal>
      </div>

      {/* Filters */}
      <Reveal delay={0.12} className="mt-10">
        <WorkFilterPills
          projects={projects}
          active={active}
          onChange={change}
          idPrefix="home-filter"
        />
      </Reveal>

      {/* Uniform project grid */}
{/* Chroma project grid */}
<ChromaGrid
  items={filtered.map((project) => {
    const discipline = project.discipline[0];

    return {
      image: project.cover.src,
      alt: project.cover.alt,
      title: project.title,
      subtitle: `${DISCIPLINE_LABEL[discipline]}${
        project.year ? ` — ${project.year}` : ""
      }`,
      accent: "#F28C28",
      url: `/work/${project.slug}`,
    };
  })}
  columns={3}
  minCardWidth={180}
  gap={24}
  radius={260}
  softness={0.65}
  damping={0.45}
  grayscale={1}
  dim={0.08}
  glow={0.5}
  borderGlow={1}
  aspectRatio="4 / 3"
  cardRadius={2}
  showInfo
  theme="dark"
  className="mt-12"
/>

      {/* Empty filter state */}
      {filtered.length === 0 && (
        <div className="
          flex min-h-[220px] flex-col
          items-center justify-center
          border-b border-paper/15 text-center
        ">
          <span className="
            font-display text-5xl text-paper/20
          ">
            00
          </span>

          <p className="
            mono-label mt-3 text-[10px]
            tracking-[0.2em] text-paper/45
          ">
            NO PROJECTS IN THIS CATEGORY
          </p>

          <button
            type="button"
            onClick={() => change("all")}
            className="
              mono-label mt-5 text-[10px]
              tracking-[0.15em] text-signal
              hover:text-paper
            "
          >
            VIEW ALL PROJECTS →
          </button>
        </div>
      )}

      {/* Cursor-following View label */}
      {finePointer && cursor && !reduce && (
        <div
          aria-hidden="true"
          className="
            neon-box pointer-events-none fixed
            z-40 rounded-[20px]
            bg-signal px-3.5 py-2
          "
          style={{
            left: cursor.x + 14,
            top: cursor.y + 14,
          }}
        >
          <span className="mono-label text-ink">
            View
          </span>
        </div>
      )}
    </section>
  );
}
