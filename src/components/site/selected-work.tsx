
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import StarBorder from "./StarBorder";
import ChromaGrid from "./ChromaGrid";
import { Reveal } from "./reveal";

import {
  DISCIPLINE_LABEL,
  DISCIPLINES,
  type Discipline,
  type Project,
} from "@/content/types";

import { projects as allProjects } from "@/content/projects";
import { photographyCategories } from "@/content/photography";

/* ───────────────────────── FILTERS ───────────────────────── */

const FILTERS: { key: Discipline | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...DISCIPLINES.map((discipline) => ({
    key: discipline,
    label: DISCIPLINE_LABEL[discipline],
  })),
];

/* Temporary category images for categories without uploaded covers. */

const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  weddings:
    "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391313/DSC04798_result.webp",
  graduations:
    "",
  portraits:
    "",
  events:
    "",
};

/* ───────────────────────── FILTER NAVIGATION ───────────────────────── */

export function WorkFilterPills({
  projects,
  active,
  onChange,
  photographyCount,
  idPrefix = "filter",
}: {
  projects: Project[];
  active: Discipline | "all";
  onChange: (discipline: Discipline | "all") => void;
  photographyCount: number;
  idPrefix?: string;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();

    for (const project of projects) {
      for (const discipline of project.discipline) {
        map.set(
          discipline,
          (map.get(discipline) ?? 0) + 1
        );
      }
    }

    return map;
  }, [projects]);

  return (
    <div
      role="group"
      aria-label="Filter projects by discipline"
      className="flex w-full flex-wrap items-center justify-center gap-3"
    >
      {FILTERS.map((filter) => {
        const count =
          filter.key === "all"
            ? projects.length
            : filter.key === "photography"
              ? photographyCount
              : counts.get(filter.key) ?? 0;

        const isActive = active === filter.key;

        return (
          <StarBorder
            key={filter.key}
            id={`${idPrefix}-${filter.key}`}
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
            onClick={() => onChange(filter.key)}
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

              {filter.label}

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

/* ───────────────────────── SELECTED WORK ───────────────────────── */

export function SelectedWork({
  projects = [],
  initialDiscipline,
}: {
  projects?: Project[];
  initialDiscipline?: string | null;
}) {
  /* Use supplied projects, or fall back to the main content source. */
  const sourceProjects =
    projects.length > 0 ? projects : allProjects;

  const [active, setActive] = useState<Discipline | "all">(
    initialDiscipline &&
      (DISCIPLINES as string[]).includes(initialDiscipline)
      ? (initialDiscipline as Discipline)
      : "all"
  );

  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [finePointer, setFinePointer] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  /* ───────────────────────── FILTER + URL STATE ───────────────────────── */

  const change = (discipline: Discipline | "all") => {
    setActive(discipline);

    const url = new URL(window.location.href);

    if (discipline === "all") {
      url.searchParams.delete("discipline");
    } else {
      url.searchParams.set("discipline", discipline);
    }

    window.history.replaceState(null, "", url);
  };

  /* ───────────────────────── POINTER DETECTION ───────────────────────── */

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

    const onMove = (event: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();

      if (!rect) return;

      const inside =
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right;

      setCursor(
        inside
          ? { x: event.clientX, y: event.clientY }
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
  }, []);

  /* ───────────────────────── FILTERED PROJECTS ───────────────────────── */

  const filtered =
    active === "all"
      ? sourceProjects
      : sourceProjects.filter((project) =>
          project.discipline.includes(active)
        );

  /* ───────────────────────── PHOTOGRAPHY CATEGORIES ───────────────────────── */

  const photographyItems = photographyCategories.map(
    (category) => {
      const cover =
        category.cover ??
        category.collections[0]?.cover;

      return {
        image:
          cover?.src ??
          CATEGORY_PLACEHOLDERS[category.slug] ??
          CATEGORY_PLACEHOLDERS.weddings,
        alt:
          cover?.alt ??
          `${category.title} photography`,
        title: category.title,
        subtitle: `${category.collections.length} ${
          category.collections.length === 1
            ? "collection"
            : "collections"
        }`,
        accent: "#F28C28",
        url: `/photography/${category.slug}`,
      };
    }
  );

  /* ───────────────────────── CHROMA GRID ITEMS ───────────────────────── */

  const gridItems =
    active === "photography"
      ? photographyItems
      : filtered.map((project) => ({
          image: project.cover.src,
          alt: project.cover.alt,
          title: project.title,
          subtitle: `${
            project.discipline[0]
              ? DISCIPLINE_LABEL[project.discipline[0]]
              : "Creative"
          }${project.year ? ` — ${project.year}` : ""}`,
          accent: "#F28C28",
          url: `/work/${project.slug}`,
        }));

  /* ───────────────────────── RENDER ───────────────────────── */

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-heading"
      className="band-ink px-gutter pt-20 pb-24 text-paper"
    >
      {/* Section heading */}

      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="mono-label text-paper/50">
            ( Selected work )
          </p>

          <h2
            id="work-heading"
            className="font-display mt-6 text-6xl md:text-7xl"
          >
            The work
            <span className="text-signal neon-text">.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href="/photography"
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
          projects={sourceProjects}
          active={active}
          onChange={change}
          photographyCount={photographyCategories.length}
          idPrefix="home-filter"
        />
      </Reveal>

      {/* ChromaGrid */}

      <ChromaGrid
        items={gridItems}
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

      {active !== "photography" && filtered.length === 0 && (
        <div
          className="
            flex min-h-[220px] flex-col
            items-center justify-center
            border-b border-paper/15 text-center
          "
        >
          <span className="font-display text-5xl text-paper/20">
            00
          </span>

          <p
            className="
              mono-label mt-3 text-[10px]
              tracking-[0.2em] text-paper/45
            "
          >
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

      {finePointer && cursor && (
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
