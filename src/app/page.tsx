import type { Metadata } from "next";
import { getHomeGrid, getByDiscipline } from "@/lib/content";
import { pool } from "@/content/media-pool";
import { Hero, type HeroSlide } from "@/components/site/hero";
import { Manifesto } from "@/components/site/manifesto";
import { SelectedWork } from "@/components/site/selected-work";
import { FilmReel, ContactSheet } from "@/components/site/film-reel";
import { DesignBoards, type Board } from "@/components/site/design-boards";
import { Services, type ServiceRow } from "@/components/site/services";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";

export const metadata: Metadata = {
  title: "MUFASA® — Victor Oginga, Photography · Design · Film",
  description:
    "Portfolio of Victor Oginga (MUFASA®) — photographer, graphic designer, filmmaker, brand-identity designer and campaign creative director.",
};

const heroSlides: HeroSlide[] = [
  { ...pool.photo1, index: "01", label: "Photography" },
  { ...pool.design1, index: "02", label: "Graphic Design" },
  { ...pool.film1, index: "03", label: "Film" },
];

const serviceRows: ServiceRow[] = [
  {
    index: "01",
    title: "Photography",
    line: "Editorial, documentary and still-life photography, from first frame to final grade.",
    thumbs: [pool.photo1, pool.photo6, pool.photo2].map((media) => ({ media, alt: media.alt })),
  },
  {
    index: "02",
    title: "Graphic Design",
    line: "Posters, editorial layouts and print systems built on grids, type and paper.",
    thumbs: [pool.design1, pool.design5, pool.design6].map((media) => ({ media, alt: media.alt })),
  },
  {
    index: "03",
    title: "Film & Video",
    line: "Short films and brand motion — treatment, direction and edit.",
    thumbs: [pool.film1, pool.film3, pool.film2].map((media) => ({ media, alt: media.alt })),
  },
  {
    index: "04",
    title: "Branding & Identity",
    line: "Marks, stationery, packaging and type systems that hold together in the wild.",
    thumbs: [pool.design2, pool.design3, pool.design4].map((media) => ({ media, alt: media.alt })),
  },
  {
    index: "05",
    title: "Campaign & Creative Direction",
    line: "Concept-to-out-of-home campaign direction across print, film and environment.",
    thumbs: [pool.campaign1, pool.campaign2, pool.design7].map((media) => ({ media, alt: media.alt })),
  },
];

const boards: Board[] = [
  {
    title: "Meridian",
    projectSlug: "meridian",
    tags: ["posters", "editorial"],
    media: pool.design1,
    typefaces: ["Big Shoulders", "Instrument Serif"],
  },
  {
    title: "Ghode",
    projectSlug: "ghode",
    tags: ["identity", "stationery"],
    media: pool.design2,
    swatches: [
      { hex: "#FF3B1F", name: "Vermilion" },
      { hex: "#0D0C0A", name: "Ink" },
      { hex: "#F6F2E9", name: "Bone" },
    ],
  },
  {
    title: "Kilo",
    projectSlug: "kilo",
    tags: ["packaging", "campaign"],
    media: pool.design4,
    swatches: [
      { hex: "#D9A06B", name: "Sand" },
      { hex: "#B4552D", name: "Terracotta" },
      { hex: "#0D0C0A", name: "Ink" },
    ],
  },
  {
    title: "Common Thread",
    projectSlug: "common-thread",
    tags: ["poster series"],
    media: pool.design7,
  },
];

// contact sheet: the roll, uncut — 18 frames across disciplines
const sheetFrames = [
  pool.photo1, pool.film1, pool.photo4, pool.design5,
  pool.photo2, pool.photo6, pool.film3, pool.design3,
  pool.photo5, pool.film2, pool.photo7, pool.film5,
  pool.photo3, pool.design6, pool.film4, pool.photo8,
  pool.film6, pool.design7,
].map((media, i) => ({
  media,
  frameNo: `${String(Math.floor(i / 6) + 1).padStart(2, "0")}${String.fromCharCode(65 + (i % 6))}`,
}));

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string }>;
}) {
  const { discipline } = await searchParams;
  const films = getByDiscipline("film");

  return (
    <>
      <Hero slides={heroSlides} />
      <Manifesto
        lenses={[
          {
            discipline: "photography",
            label: "Photography",
            index: "01",
            blurb: "Portraits, streets and still life — shot on film, graded warm.",
            media: pool.photo6,
          },
          {
            discipline: "graphic-design",
            label: "Graphic Design",
            index: "02",
            blurb: "Posters, spreads and print systems on strict grids.",
            media: pool.design1,
          },
          {
            discipline: "film",
            label: "Film",
            index: "03",
            blurb: "Short films with long holds and practical light.",
            media: pool.film2,
          },
        ]}
      />
      <SelectedWork projects={getHomeGrid()} initialDiscipline={discipline ?? null} />
      <FilmReel films={films} />
      <ContactSheet frames={sheetFrames} />
      <DesignBoards boards={boards} />
      <Services rows={serviceRows} />
      <About portrait={pool.portrait} />
      <Contact
        providerConfigured={Boolean(process.env.RESEND_API_KEY || process.env.CONTACT_WEBHOOK_URL)}
      />
    </>
  );
}
