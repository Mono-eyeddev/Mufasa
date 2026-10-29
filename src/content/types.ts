/**
 * MUFASA(R) — content model.
 * CMS-ready: everything here is plain data; swap the source in src/lib/content.ts later.
 */

export type Discipline =
  | "photography"
  | "graphic-design"
  | "film"
  | "branding"
  | "campaigns";

export type MediaKind = "image" | "video";

export interface Media {
  /** Path relative to /public, e.g. "/work/photography/photo-01.jpg" */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Precomputed base64 blur placeholder (tiny) */
  blurDataURL?: string;
  kind: MediaKind;
  /** Poster image for video media */
  poster?: string;
}

export type Block =
  | { type: "text"; heading?: string; body: string }
  | { type: "image-full"; media: Media; caption?: string }
  | { type: "image-two"; media: [Media, Media] }
  | { type: "image-three"; media: [Media, Media, Media] }
  | { type: "image-caption"; media: Media; caption: string }
  | { type: "video"; media: Media; caption?: string }
  | { type: "before-after"; before: Media; after: Media };

export interface Project {
  slug: string;
  title: string;
  discipline: Discipline[];
  /** Omitted when unknown — never invented. */
  year?: number;
  client?: string;
  role?: string;
  deliverables?: string[];
  summary: string;
  cover: Media;
  blocks: Block[];
  featured: boolean;
  order: number;
  /** Short factual note shown on the film template when no hosted video exists. */
  screenerNote?: string;
}

export const DISCIPLINES: Discipline[] = [
  "photography",
  "graphic-design",
  "film",
  "branding",
  "campaigns",
];

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  photography: "Photography",
  "graphic-design": "Graphic Design",
  film: "Film",
  branding: "Branding",
  campaigns: "Campaigns",
};

/** Numeric prefix used across the site ("01 — Photography — …"). */
export const DISCIPLINE_INDEX: Record<Discipline, string> = {
  photography: "01",
  "graphic-design": "02",
  film: "03",
  branding: "04",
  campaigns: "05",
};
