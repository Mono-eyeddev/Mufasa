
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./reveal";
import LogoLoop from "./LogoLoop";
import {
  SiDavinciresolve,
  SiFigma,
  SiBlender,
} from "react-icons/si";

export interface Brand {
  name: string;
  number: string;
  logo?: { src: string; width: number; height: number };
  href?: string;
}

const placeholderBrands: Brand[] = Array.from(
  { length: 20 },
  (_, index) => ({
    name: `BRAND ${String(index + 1).padStart(2, "0")}`,
    number: String(index + 1).padStart(2, "0"),
  })
);

const adobeMark = (
  letters: string,
  color: string
) => (
  <span
    className="flex h-9 w-9 items-center justify-center rounded-sm border text-sm font-bold tracking-tight transition-all duration-300"
    style={{
      color,
      borderColor: `${color}55`,
      backgroundColor: `${color}12`,
    }}
  >
    {letters}
  </span>
);

const creativeTools = [
  {
    node: adobeMark("Ps", "#31A8FF"),
    title: "Photoshop",
    href: "https://www.adobe.com/products/photoshop.html",
    hoverColor: "#31A8FF",
  },
  {
    node: adobeMark("Ai", "#FF9A00"),
    title: "Illustrator",
    href: "https://www.adobe.com/products/illustrator.html",
    hoverColor: "#FF9A00",
  },
  {
    node: adobeMark("Lr", "#31A8FF"),
    title: "Lightroom",
    href: "https://www.adobe.com/products/photoshop-lightroom.html",
    hoverColor: "#31A8FF",
  },
  {
    node: adobeMark("Pr", "#9999FF"),
    title: "Premiere Pro",
    href: "https://www.adobe.com/products/premiere.html",
    hoverColor: "#9999FF",
  },
  {
    node: adobeMark("Ae", "#9999FF"),
    title: "After Effects",
    href: "https://www.adobe.com/products/aftereffects.html",
    hoverColor: "#9999FF",
  },
  {
    node: <SiDavinciresolve />,
    title: "DaVinci Resolve",
    href: "https://www.blackmagicdesign.com/products/davinciresolve",
    hoverColor: "#FD802E",
  },
  {
    node: <SiFigma />,
    title: "Figma",
    href: "https://www.figma.com",
    hoverColor: "#FD802E",
  },
  {
    node: <SiBlender />,
    title: "Blender",
    href: "https://www.blender.org",
    hoverColor: "#FD802E",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .93 0 0 0 0 .9 0 0 0 0 .86 1.1 0 0 0 -.38'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}")`;

export function Brands({
  brands = placeholderBrands,
}: {
  brands?: Brand[];
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id="brands"
      aria-labelledby="brands-heading"
      className="band-ink relative isolate overflow-hidden border-t border-paper/10 px-gutter pt-20 pb-24 text-paper"
    >
      {/* Background grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25]"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: "240px 240px",
        }}
      />

      {/* Section heading */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mono-label text-paper/50">
              ( Selected Brands )
            </p>

            <h2
              id="brands-heading"
              className="font-display mt-6 text-5xl sm:text-6xl md:text-7xl"
            >
              Brands I Worked With
              <span className="text-signal neon-text">.</span>
            </h2>
          </div>

          <p className="mono-label pb-2 text-paper/50">
            A FEW GOOD PARTNERS
          </p>
        </div>
      </Reveal>

      {/* Brand grid */}
      <ul className="mt-10 grid grid-cols-2 border-l border-t border-paper/10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {brands.map((brand, index) => {
          const content = (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,128,46,0.14),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
              />

              <span className="relative z-10 flex flex-col items-center gap-1.5 transition-transform duration-500 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
                {brand.logo ? (
                  <Image
                    src={brand.logo.src}
                    alt={brand.name}
                    width={brand.logo.width}
                    height={brand.logo.height}
                    className="max-h-7 w-auto max-w-full object-contain opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 sm:max-h-8"
                  />
                ) : (
                  <span className="font-display text-base tracking-[0.12em] text-paper/60 transition-colors duration-500 group-hover:text-paper group-focus-visible:text-paper sm:text-lg">
                    {brand.name}
                  </span>
                )}

                <span
                  aria-hidden="true"
                  className="mono-label text-[9px] tracking-[0.25em] text-paper/40 transition-colors duration-500 group-hover:text-signal group-focus-visible:text-signal"
                >
                  {brand.number}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="absolute right-0 top-0 h-px w-0 bg-signal transition-[width] duration-500 group-hover:w-8 group-focus-visible:w-8"
              />
              <span
                aria-hidden="true"
                className="absolute right-0 top-0 h-0 w-px bg-signal transition-[height] duration-500 group-hover:h-8 group-focus-visible:h-8"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-signal transition-[width] duration-500 group-hover:w-8 group-focus-visible:w-8"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-0 w-px bg-signal transition-[height] duration-500 group-hover:h-8 group-focus-visible:h-8"
              />
            </>
          );

          const cellClass =
            "group relative flex min-h-[76px] w-full items-center justify-center overflow-hidden p-3 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal sm:min-h-[88px] sm:p-4";

          return (
            <motion.li
              key={brand.number}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reduce ? 0 : 0.7,
                delay: reduce ? 0 : (index % 5) * 0.06,
                ease: EASE,
              }}
              className="border-b border-r border-paper/10"
            >
              {brand.href ? (
                <a
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cellClass}
                >
                  {content}
                </a>
              ) : (
                <div className={cellClass}>
                  {content}
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>

      {/* Creative Toolkit */}
      <div className="mt-24 border-t border-paper/10 pt-12">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mono-label text-paper/45">
                ( Creative Toolkit )
              </p>

              <h3 className="font-display mt-4 text-3xl tracking-tight text-paper sm:text-4xl md:text-5xl">
                Tools Behind The Work
                <span className="text-signal neon-text">.</span>
              </h3>
            </div>

            <p className="mono-label text-paper/40">
              THE DIGITAL WORKSHOP
            </p>
          </div>
        </Reveal>

        {/* Interactive LogoLoop */}
        <div className="relative min-h-[170px] overflow-hidden border-y border-paper/10 py-8">
          <LogoLoop
            logos={creativeTools}
            speed={reduce ? 0 : 65}
            direction="left"
            logoHeight={34}
            gap={64}
            hoverSpeed={0}
            fadeOut
            fadeOutWidth={0.12}
            scaleOnHover
            layout="wave"
            bend={0.35}
            focus={0.5}
            magnify={1.25}
            tiltX={0}
            tiltY={0}
            step={false}
            muted={0.2}
            labels="inline"
            draggable
            scrollBoost={1}
            intro={!reduce}
            ariaLabel="Creative software used by MUFASA"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label text-[9px] text-paper/35">
            DESIGN / PHOTOGRAPHY / MOTION / FILM
          </p>

          <p className="mono-label text-[9px] text-paper/35">
            DRAG TO EXPLORE
            <span className="ml-2 text-signal">↔</span>
          </p>
        </div>
      </div>
    </section>
  );
}
