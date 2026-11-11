import GridMotion from "./GridMotion";
import { Reveal } from "./reveal";

const UNSPLASH_PARAMS = "auto=format&fit=crop&w=900&q=85";

// TODO: swap these placeholders for real on-set / process photos.
const behindTheScenes = [
  "photo-1492691527719-9d1e07e534b4",
  "photo-1502982720700-bfff97f2ecac",
  "photo-1516035069371-29a1b244cc32",
  "photo-1471341971476-ae15ff5dd4ea",
  "photo-1500530855697-b586d89ba3ee",
  "photo-1452587925148-ce544e77e70d",
  "photo-1519608487953-e999c86e7455",
  "photo-1517841905240-472988babdf9",
  "photo-1534528741775-53994a69daeb",
  "photo-1497366754035-f200968a6e72",
  "photo-1529139574466-a303027c1d8b",
  "photo-1500534623283-312aade485b7",
].map((id) => `https://images.unsplash.com/${id}?${UNSPLASH_PARAMS}`);

export function BehindTheScenes() {
  return (
    <section
      id="behind-the-scenes"
      aria-labelledby="behind-the-scenes-heading"
      className="band-ink overflow-hidden border-t border-paper/10 px-gutter pb-16 pt-8 text-paper"
    >
      <Reveal>
        <h2
          id="behind-the-scenes-heading"
          className="font-display mb-8 mt-6 text-5xl sm:text-6xl md:mb-12 md:text-7xl"
        >
          Behind the Scenes<span className="text-signal neon-text">.</span>
        </h2>
      </Reveal>

      {/* Moving image wall (decorative) */}
      <div
        aria-hidden="true"
        className="relative -mx-[var(--gutter,0px)] h-[430px] overflow-hidden sm:h-[520px] lg:h-[650px]"
      >
        <GridMotion
          items={behindTheScenes}
          rows={7}
          aspectRatio={1.25}
          gap={10}
          radius={3}
          angle={-12}
          tilt={0}
          speed={28}
          direction="alternate"
          parallax={0.45}
          spotlight={0.65}
          dim={0.38}
          fade={0.55}
          grayscale={false}
          theme="dark"
          tileColor="#080808"
          textColor="#ECE7DC"
        />

        {/* Cinematic edge fades */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#080808] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#080808] to-transparent" />
      </div>

      {/* Bottom label */}
      <div className="mx-auto mt-8 flex max-w-[1600px] items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] text-paper/55">
        <span>MUFASA® — ON LOCATION</span>
        <span>THE PROCESS / 001</span>
      </div>
    </section>
  );
}