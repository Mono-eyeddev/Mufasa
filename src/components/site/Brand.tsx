"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./reveal";

export interface Brand {
  name: string;
  number: string;
  /** Optional real logo. Falls back to the name set in type. */
  logo?: { src: string; width: number; height: number };
  /** Optional case-study or site link. */
  href?: string;
}

const placeholderBrands: Brand[] = [
  { name: "BRAND ONE", number: "01" },
  { name: "BRAND TWO", number: "02" },
  { name: "BRAND THREE", number: "03" },
  { name: "BRAND FOUR", number: "04" },
  { name: "BRAND FIVE", number: "05" },
  { name: "BRAND SIX", number: "06" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// Same concrete grain used on the Services wall, so sections feel related.
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .93 0 0 0 0 .9 0 0 0 0 .86 1.1 0 0 0 -.38'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}")`;

export function Brands({ brands = placeholderBrands }: { brands?: Brand[] }) {
  const reduce = useReducedMotion();

  return (
    <section
      id="brands"
      aria-labelledby="brands-heading"
      className="band-ink relative isolate overflow-hidden border-t border-paper/10 px-gutter section-y text-paper"
    >
      {/* Light wall grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25]"
        style={{ backgroundImage: GRAIN, backgroundSize: "240px 240px" }}
      />

      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mono-label text-paper/50">( Selected Brands )</p>

            <h2
              id="brands-heading"
              className="font-display mt-6 text-5xl sm:text-6xl md:text-7xl"
            >
              Brands I Worked With
              <span className="text-signal neon-text">.</span>
            </h2>
          </div>

          <p className="mono-label pb-2 text-paper/50">A FEW GOOD PARTNERS</p>
        </div>
      </Reveal>

      <ul className="mt-14 grid grid-cols-2 border-l border-t border-paper/10 sm:grid-cols-3">
        {brands.map((brand, index) => {
          const content = (
            <>
              {/* Ambient orange illumination */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,128,46,0.14),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
              />

              {/* Logo or placeholder name */}
              <span className="relative z-10 flex flex-col items-center gap-2 transition-transform duration-500 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
                {brand.logo ? (
                  <Image
                    src={brand.logo.src}
                    alt={brand.name}
                    width={brand.logo.width}
                    height={brand.logo.height}
                    className="max-h-10 w-auto object-contain opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 sm:max-h-12"
                  />
                ) : (
                  <span className="font-display text-xl tracking-[0.12em] text-paper/60 transition-colors duration-500 group-hover:text-paper group-focus-visible:text-paper sm:text-2xl">
                    {brand.name}
                  </span>
                )}

                <span
                  aria-hidden="true"
                  className="mono-label text-[10px] tracking-[0.25em] text-paper/40 transition-colors duration-500 group-hover:text-signal group-focus-visible:text-signal"
                >
                  {brand.number}
                </span>
              </span>

              {/* Corner accents (L-shaped, like crop marks) */}
              <span
                aria-hidden="true"
                className="absolute right-0 top-0 h-px w-0 bg-signal transition-[width] duration-500 group-hover:w-12 group-focus-visible:w-12"
              />
              <span
                aria-hidden="true"
                className="absolute right-0 top-0 h-0 w-px bg-signal transition-[height] duration-500 group-hover:h-12 group-focus-visible:h-12"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-signal transition-[width] duration-500 group-hover:w-12 group-focus-visible:w-12"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-0 w-px bg-signal transition-[height] duration-500 group-hover:h-12 group-focus-visible:h-12"
              />
            </>
          );

          const cellClass =
            "group relative flex h-full w-full aspect-[1.8/1] items-center justify-center overflow-hidden p-6 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal";

          return (
            <motion.li
              key={brand.number}
              // Opacity + translate only: blur filters on every cell are
              // expensive and janky on mobile.
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              // Delay lives on the entrance only, so hover is never delayed.
              transition={{
                duration: reduce ? 0 : 0.7,
                // Stagger by column so lower rows don't wait on upper ones.
                delay: reduce ? 0 : (index % 3) * 0.09,
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
                <div className={cellClass} tabIndex={undefined}>
                  {content}
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}