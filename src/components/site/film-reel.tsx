"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Media, Project } from "@/content/types";
import { Reveal } from "./reveal";
import { Lightbox, ContactSheetFrame } from "./lightbox";

/* ───────────────────────── tokens ───────────────────────── */

const ORANGE = "#FD802E";

const TONES = {
  dark: {
    bg: "#080808",
    wall: "#0c0c0c",
    line: "rgba(236,231,220,0.11)",
    edge: "rgba(236,231,220,0.2)",
    ink: "#ECE7DC",
    glow: "rgba(253,128,46,0.32)",
  },
  light: {
    bg: "#ffffff",
    wall: "#ffffff",
    line: "rgba(0,0,0,0.2)",
    edge: "rgba(0,0,0,0.3)",
    ink: "#111111",
    glow: "rgba(255,255,255,1)",
  },
} as const;

/* ───────────────────────── geometry ───────────────────────── */

type Dim = {
  w: number;
  h: number;
  hw: number;
  hh: number;
  C: number;
  P: number;
  cols: number;
};

type Tile = {
  id: number;
  k: number;
  film: number;
  X: number;
  Y: number;
  Z: number;
  w: number;
  h: number;
  rot: string;
};

const clamp = (v: number, a = 0, b = 1) =>
  Math.min(b, Math.max(a, v));

const rand = (a: number, b: number, c: number) => {
  const s =
    Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;

  return s - Math.floor(s);
};

const text = (v: unknown) =>
  Array.isArray(v) ? v.join(" / ") : v ? String(v) : "";

const pad = (n: number) => String(n).padStart(2, "0");

/** Deterministic placement: every tile sits inside a grid cell on one of the four walls. */
function buildTiles(n: number, d: Dim, K: number): Tile[] {
  const { hw, hh, C, P, cols } = d;
  const zStart = P * 0.85 - C;
  const raw: Omit<Tile, "film">[] = [];

  let id = 0;

  for (let k = 0; k < K; k++) {
    const zc = zStart - (k + 0.5) * C;

    (["L", "R"] as const).forEach((side, si) => {
      for (let r = 0; r < 2; r++) {
        if (rand(k, si * 2 + r, 1) < 0.36) continue;

        let h = hh * 0.78;
        let w = h * 0.8;

        if (w > C * 0.78) {
          w = C * 0.78;
          h = w / 0.8;
        }

        const dz =
          (rand(k, si * 2 + r, 2) - 0.5) * (C - w) * 0.8;

        const dy =
          (rand(k, si * 2 + r, 3) - 0.5) * (hh - h) * 0.8;

        raw.push({
          id: id++,
          k,
          w,
          h,
          X: side === "L" ? -hw + 2 : hw - 2,
          Y: (r === 0 ? -hh / 2 : hh / 2) + dy,
          Z: zc + dz,
          rot: side === "L" ? "rotateY(90deg)" : "rotateY(-90deg)",
        });
      }
    });

    (["T", "B"] as const).forEach((side, si) => {
      const colW = (2 * hw) / cols;

      for (let c = 0; c < cols; c++) {
        if (rand(k, 10 + si * 2 + c, 1) < 0.4) continue;

        let w = colW * 0.78;
        let h = w / 1.5;

        if (h > C * 0.78) {
          h = C * 0.78;
          w = h * 1.5;
        }

        const dz =
          (rand(k, 10 + si * 2 + c, 2) - 0.5) * (C - h) * 0.8;

        const dx =
          (rand(k, 10 + si * 2 + c, 3) - 0.5) *
          (colW - w) *
          0.8;

        raw.push({
          id: id++,
          k,
          w,
          h,
          X: -hw + colW * (c + 0.5) + dx,
          Y: side === "T" ? -hh + 2 : hh - 2,
          Z: zc + dz,
          rot: side === "T" ? "rotateX(-90deg)" : "rotateX(90deg)",
        });
      }
    });
  }

  return raw.map((tile, index) => ({
    ...tile,
    film: index % n,
  }));
}

function gridBg(
  line: string,
  along: "x" | "y",
  C: number,
  across: number,
) {
  const vertical =
    `linear-gradient(to right, ${line} 1px, transparent 1px)`;

  const horizontal =
    `linear-gradient(to bottom, ${line} 1px, transparent 1px)`;

  return along === "x"
    ? {
        backgroundImage: `${vertical}, ${horizontal}`,
        backgroundSize: `${C}px 100%, 100% ${across}px`,
      }
    : {
        backgroundImage: `${horizontal}, ${vertical}`,
        backgroundSize: `100% ${C}px, ${across}px 100%`,
      };
}

/* ───────────────────────── passage gallery ───────────────────────── */

export function PassageGallery({
  films,
  id = "passage",
  tone = "dark",
}: {
  films: Project[];
  id?: string;
  tone?: "dark" | "light";
}) {
  const n = films.length;
  const T = TONES[tone];
  const S = Math.max(10, n * 2);
  const reduce = useReducedMotion();

  const outer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const walls = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  const els = useRef(new Map<number, HTMLElement>());
  const live = useRef<Tile[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const reduceRef = useRef(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const [dim, setDim] = useState<Dim | null>(null);
  const [cellStart, setCellStart] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    reduceRef.current = Boolean(reduce);
  }, [reduce]);

  // Stable close handler: keeps Lightbox's effect from re-running (and
  // re-stealing focus) every time this component re-renders.
  const closeViewer = useCallback(() => {
    setOpen(null);

    const trigger = triggerRef.current;
    triggerRef.current = null;

    if (trigger) {
      requestAnimationFrame(() => {
        if (trigger.isConnected && trigger.tabIndex >= 0) {
          trigger.focus({ preventScroll: true });
        }
      });
    }
  }, []);

  const lightboxItems = useMemo(
    () => films.map((film) => film.cover),
    [films],
  );

  // Measure the viewport-sized stage and update when its dimensions change.
  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    const measure = () => {
      const w = element.clientWidth;
      const h = element.clientHeight;

      if (!w || !h) return;

      const hh = h / 2;

      setDim({
        w,
        h,
        hw: w / 2,
        hh,
        C: Math.round(hh * 1.25),
        P: Math.round(clamp(w * 0.7, 640, 1000)),
        cols: w < 700 ? 1 : 2,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const tiles = useMemo(
    () => (dim && n ? buildTiles(n, dim, S + 8) : []),
    [dim, n, S],
  );

  const visible = useMemo(
    () =>
      tiles.filter(
        (tile) =>
          tile.k >= cellStart - 1 &&
          tile.k <= cellStart + 7,
      ),
    [tiles, cellStart],
  );

  useEffect(() => {
    live.current = visible;
  }, [visible]);

  // One animation-frame loop handles scroll, camera movement, pointer tilt and opacity.
  useEffect(() => {
    if (!dim || !n) return;

    const { C, P } = dim;

    let raf = 0;
    let inView = true;
    let cam = 0;
    let tx = 0;
    let ty = 0;
    let lastCell = -1;
    let lastFrame = -1;

    const maxTravel = S * C;

    const tick = () => {
      raf = 0;

      const root = outer.current;
      if (!root || !inView) return;

      const rect = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight;

      const progress =
        total > 0 ? clamp(-rect.top / total) : 0;

      const target = progress * maxTravel;
      const instant = reduceRef.current;

      cam = instant
        ? target
        : cam + (target - cam) * 0.12;

      if (Math.abs(target - cam) < 0.05) {
        cam = target;
      }

      if (!instant) {
        tx += (mouse.current.x - tx) * 0.06;
        ty += (mouse.current.y - ty) * 0.06;
      }

      if (walls.current) {
        walls.current.style.transform =
          `translate3d(0,0,${cam % C}px)`;
      }

      if (world.current) {
        world.current.style.transform =
          `translate3d(0,0,${cam}px)`;
      }

      if (tilt.current) {
        tilt.current.style.transform =
          `rotateX(${(ty * 2.5).toFixed(3)}deg) rotateY(${(-tx * 3).toFixed(3)}deg)`;
      }

      for (const tile of live.current) {
        const element = els.current.get(tile.id);
        if (!element) continue;

        const worldZ = tile.Z + cam;

        const near = clamp(
          (P * 0.88 - worldZ) / (P * 0.38),
        );

        const far = clamp(
          1 - (-worldZ - 3.2 * C) / (1.4 * C),
        );

        const opacity = Math.min(near, far);

        element.style.opacity = opacity.toFixed(3);

        // Interactivity is driven by a data attribute (see the button's
        // Tailwind classes) and only written when it changes, so the loop
        // never fights CSS and never writes inline pointer-events.
        const interactive = opacity > 0.35;
        const flag = interactive ? "true" : "false";

        if (element.dataset.live !== flag) {
          element.dataset.live = flag;
          element.tabIndex = interactive ? 0 : -1;
        }
      }

      if (bar.current) {
        bar.current.style.transform =
          `scaleY(${progress.toFixed(4)})`;
      }

      const frame = Math.min(
        n,
        Math.floor(progress * n) + 1,
      );

      if (frame !== lastFrame && counter.current) {
        counter.current.textContent =
          `${pad(frame)} / ${pad(n)}`;

        lastFrame = frame;
      }

      const cell = Math.floor(cam / C);

      if (cell !== lastCell) {
        lastCell = cell;
        setCellStart(cell);
      }

      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;

      if (inView && !raf) {
        raf = requestAnimationFrame(tick);
      }

      if (!inView && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });

    if (outer.current) {
      observer.observe(outer.current);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [dim, n, S]);

  const onPointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType !== "mouse" ||
      reduceRef.current ||
      !dim
    ) {
      return;
    }

    mouse.current.x =
      (event.clientX / dim.w - 0.5) * 2;

    mouse.current.y =
      (event.clientY / dim.h - 0.5) * 2;
  };

  if (!n) return null;

  const active =
    hovered !== null ? films[hovered] : null;

  const wallLength = dim ? dim.C * 5 : 0;

  const wallCenterZ = dim
    ? dim.P * 0.85 - dim.C - wallLength / 2
    : 0;

  const wallBase = {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    background: T.wall,
    boxShadow: `inset 0 0 0 1px ${T.edge}`,
    pointerEvents: "none" as const,
  };

  return (
    <section
      ref={outer}
      id={id}
      aria-label="Passage — visual archive"
      className="relative"
      style={{
        height: `${100 + S * 45}vh`,
        background: T.bg,
        color: T.ink,
      }}
    >
      <div
        ref={stage}
        onPointerMove={onPointerMove}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
      >
        {/* Light at the end of the passage */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              `radial-gradient(ellipse 26% 32% at 50% 50%, ${T.glow}, transparent 72%)`,
          }}
        />

        {dim && (
          /*
           * ROOT-CAUSE FIX: every structural wrapper in the 3D tree is
           * pointer-events-none. These are full-viewport planes sitting at
           * z = 0, cam % C and cam, i.e. in FRONT of almost every tile, so
           * they were swallowing all hit-tests. Only the tile buttons opt
           * back in (pointer-events is inherited, and auto on a descendant
           * overrides none on an ancestor).
           */
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              perspective: `${dim.P}px`,
              perspectiveOrigin: "50% 50%",
            }}
          >
            <div
              ref={tilt}
              className="pointer-events-none absolute inset-0 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Four tunnel walls */}
              <div
                ref={walls}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  style={{
                    ...wallBase,
                    width: wallLength,
                    height: dim.hh * 2,
                    marginLeft: -wallLength / 2,
                    marginTop: -dim.hh,
                    transform:
                      `translate3d(${-dim.hw}px,0,${wallCenterZ}px) rotateY(90deg)`,
                    ...gridBg(T.line, "x", dim.C, dim.hh),
                  }}
                />

                <div
                  style={{
                    ...wallBase,
                    width: wallLength,
                    height: dim.hh * 2,
                    marginLeft: -wallLength / 2,
                    marginTop: -dim.hh,
                    transform:
                      `translate3d(${dim.hw}px,0,${wallCenterZ}px) rotateY(-90deg)`,
                    ...gridBg(T.line, "x", dim.C, dim.hh),
                  }}
                />

                <div
                  style={{
                    ...wallBase,
                    width: dim.hw * 2,
                    height: wallLength,
                    marginLeft: -dim.hw,
                    marginTop: -wallLength / 2,
                    transform:
                      `translate3d(0,${-dim.hh}px,${wallCenterZ}px) rotateX(-90deg)`,
                    ...gridBg(
                      T.line,
                      "y",
                      dim.C,
                      (dim.hw * 2) / dim.cols,
                    ),
                  }}
                />

                <div
                  style={{
                    ...wallBase,
                    width: dim.hw * 2,
                    height: wallLength,
                    marginLeft: -dim.hw,
                    marginTop: -wallLength / 2,
                    transform:
                      `translate3d(0,${dim.hh}px,${wallCenterZ}px) rotateX(90deg)`,
                    ...gridBg(
                      T.line,
                      "y",
                      dim.C,
                      (dim.hw * 2) / dim.cols,
                    ),
                  }}
                />
              </div>

              {/* Photographs remain fixed in world space while the camera moves */}
              <div
                ref={world}
                className="pointer-events-none absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {visible.map((tile) => {
                  const film = films[tile.film];

                  return (
                    <button
                      type="button"
                      key={tile.id}
                      ref={(element) => {
                        if (element) {
                          els.current.set(tile.id, element);
                        } else {
                          els.current.delete(tile.id);
                        }
                      }}
                      onClick={(event) => {
                        triggerRef.current = event.currentTarget;
                        setOpen(tile.film);
                      }}
                      onPointerEnter={() =>
                        setHovered(tile.film)
                      }
                      onPointerLeave={() =>
                        setHovered((current) =>
                          current === tile.film
                            ? null
                            : current,
                        )
                      }
                      onFocus={() =>
                        setHovered(tile.film)
                      }
                      onBlur={() =>
                        setHovered((current) =>
                          current === tile.film
                            ? null
                            : current,
                        )
                      }
                      aria-label={`View ${film.title} full screen`}
                      data-live="false"
                      tabIndex={-1}
                      className="group pointer-events-none data-[live=true]:pointer-events-auto absolute block cursor-pointer border-0 bg-transparent p-0 text-left outline-none"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: tile.w,
                        height: tile.h,
                        marginLeft: -tile.w / 2,
                        marginTop: -tile.h / 2,
                        transform:
                          `translate3d(${tile.X}px,${tile.Y}px,${tile.Z}px) ${tile.rot}`,
                        opacity: 0,
                      }}
                    >
                      <span className="relative block h-full w-full overflow-hidden border border-[#ECE7DC]/15 bg-[#151515] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)] transition duration-300 group-hover:scale-[1.05] group-hover:border-[#FD802E] group-hover:brightness-110 group-focus-visible:border-[#FD802E]">
                        <Image
                          src={film.cover.src}
                          alt={film.cover.alt}
                          fill
                          sizes="(max-width: 768px) 40vw, 24vw"
                          quality={70}
                          className="object-cover"
                          placeholder={
                            film.cover.blurDataURL
                              ? "blur"
                              : "empty"
                          }
                          blurDataURL={film.cover.blurDataURL}
                        />

                        <span className="mono-label absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/85 to-transparent p-2 text-[9px] tracking-[0.2em] text-[#ECE7DC] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                          <span>{pad(tile.film + 1)}</span>
                          <span className="truncate">
                            {film.title}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Soft vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              `radial-gradient(ellipse at center, transparent 55%, ${T.bg} 120%)`,
            opacity: 0.55,
          }}
        />

        {/* Editorial header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 md:p-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <p className="mono-label text-[10px] tracking-[0.3em] opacity-60">
              03 — MOVING IMAGE
            </p>

            <h2 className="font-display mt-3 text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.9] tracking-tight">
              Passage<span style={{ color: ORANGE }}>.</span>
            </h2>
          </motion.div>

          <p className="mono-label hidden text-[10px] tracking-[0.3em] opacity-60 sm:block">
            OGINGA® / FILM ARCHIVE
          </p>
        </div>

        {/* Footer and progress */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 p-5 md:p-8">
          <div
            className="min-h-[3.5rem] max-w-[60%]"
            aria-live="polite"
          >
            {active ? (
              <>
                <p
                  className="mono-label text-[10px] tracking-[0.3em]"
                  style={{ color: ORANGE }}
                >
                  FRAME {pad((hovered ?? 0) + 1)} / {pad(n)}
                </p>

                <p className="font-display mt-1 text-xl font-semibold leading-tight md:text-3xl">
                  {active.title}
                </p>

                <p className="mono-label mt-1 text-[10px] tracking-[0.2em] opacity-60">
                  {[
                    text(active.discipline),
                    text(active.role),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </>
            ) : (
              <>
                <p className="mono-label text-[10px] tracking-[0.3em] opacity-60">
                  SCROLL TO TRAVEL
                </p>

                <p className="mono-label mt-1 text-[10px] tracking-[0.3em] opacity-40">
                  VISUAL ARCHIVE
                </p>
              </>
            )}
          </div>

          <div className="mono-label flex items-end gap-3 text-[10px] tracking-[0.2em] opacity-70">
            <span ref={counter}>
              {`01 / ${pad(n)}`}
            </span>

            <span
              className="relative block h-16 w-px overflow-hidden"
              style={{ background: T.edge }}
            >
              <span
                ref={bar}
                className="absolute inset-0 origin-top"
                style={{
                  background: ORANGE,
                  transform: "scaleY(0)",
                }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Full-screen image viewer */}
      {open !== null && (
        <Lightbox
          items={lightboxItems}
          index={open}
          onIndex={setOpen}
          onClose={closeViewer}
          label="Passage film archive"
        />
      )}
    </section>
  );
}

/* ───────────────────────── existing homepage API ───────────────────────── */

/**
 * Keep the original FilmReel export so the existing homepage does not need
 * import or component changes. It now renders the Passage Gallery.
 */
export function FilmReel({
  films,
}: {
  films: Project[];
}) {
  return (
    <PassageGallery
      films={films}
      id="film-reel"
      tone="dark"
    />
  );
}

/** Contact sheet — dense photography grid on ink. */
export function ContactSheet({
  frames,
}: {
  frames: { media: Media; frameNo: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="sheet-heading"
      className="band-ink section-y border-t border-paper/10 text-paper"
    >
      <div className="px-gutter">
        <Reveal>
          <p className="mono-label text-paper/50">
            ( Contact sheet )
          </p>

          <h2
            id="sheet-heading"
            className="font-display mt-6 text-6xl md:text-7xl"
          >
            Every frame<span className="text-signal neon-text">.</span>
          </h2>

          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">
            The roll, uncut — stills and outtakes from recent shoots and sets.
            Click a frame to view it full screen.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="mt-12 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4"
            style={{ gridAutoFlow: "dense" }}
          >
            {frames.map((frame, index) => (
              <ContactSheetTile
                key={frame.frameNo}
                frame={frame}
                onOpen={() => setOpen(index)}
                priority={index < 4}
              />
            ))}
          </div>
        </Reveal>
      </div>

      {open !== null && (
        <Lightbox
          items={frames.map((frame) => frame.media)}
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
  frame: { media: Media; frameNo: string };
  onOpen: () => void;
  priority: boolean;
}) {
  const { media, frameNo } = frame;
  const wide = media.width / media.height > 1.35;

  return (
    <div className={wide ? "col-span-2" : ""}>
      <ContactSheetFrame
        media={media}
        frameNo={frameNo}
        onOpen={onOpen}
        priority={priority}
      />
    </div>
  );
}