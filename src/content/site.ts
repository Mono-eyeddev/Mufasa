/**
 * Single source of truth for site facts.
 * Replace values with real ones as they become available — nothing here is invented.
 */
export const siteConfig = {
  /** Legal / personal name */
  name: "Victor Oginga",
  /** Professional name — always typeset with the (R). */
  brand: "MUFASA®",
  /** Professional name without the mark, for the display wordmark. */
  brandShort: "MUFASA",
  /** Working email — replace with the real inbox before launch. */
  email: "hello@mufasa.studio",
  /** Canonical site URL. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Victor Oginga, known professionally as MUFASA® — photographer, graphic designer, filmmaker, brand-identity designer and campaign creative director.",
  /**
   * Availability pill in the header. Driven from config, not hardcoded.
   * Default false until confirmed.
   */
  availableForCommissions: false,
  /**
   * Location + IANA timezone. The hero clock renders ONLY when both are set.
   * Left null until confirmed.
   */
  location: null as string | null,
  timezone: null as string | null,
  /**
   * Verified social links only. None verified yet — keep empty rather than guessing.
   */
  socials: [] as { label: string; href: string }[],
  /** Services offered — factual list, no pricing. */
  services: [
    {
      index: "01",
      title: "Photography",
      line: "Editorial, documentary and still-life photography, from first frame to final grade.",
      tags: ["portrait", "documentary", "still life"],
    },
    {
      index: "02",
      title: "Graphic Design",
      line: "Posters, editorial layouts and print systems built on grids, type and paper.",
      tags: ["posters", "editorial", "print"],
    },
    {
      index: "03",
      title: "Film & Video",
      line: "Short films and brand motion — treatment, direction and edit.",
      tags: ["direction", "cinematography", "edit"],
    },
    {
      index: "04",
      title: "Branding & Identity",
      line: "Marks, stationery, packaging and type systems that hold together in the wild.",
      tags: ["identity", "marks", "packaging"],
    },
    {
      index: "05",
      title: "Campaign & Creative Direction",
      line: "Concept-to-out-of-home campaign direction across print, film and environment.",
      tags: ["concepts", "art direction", "ooh"],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
