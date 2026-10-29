import { m } from "@/lib/media";

/**
 * Shared media pool — every asset referenced by name.
 * Replace these entries with Victor's real files (same shape) when available.
 */

const photo = (n: number, alt: string, w: number, h: number) =>
  m({ src: `/work/photography/photo-0${n}.jpg`, alt, width: w, height: h });
const design = (n: number, alt: string, w: number, h: number) =>
  m({ src: `/work/design/design-0${n}.jpg`, alt, width: w, height: h });
const film = (n: number, alt: string, w: number, h: number) =>
  m({ src: `/work/film/film-0${n}.jpg`, alt, width: w, height: h });
const campaign = (n: number, alt: string, w: number, h: number) =>
  m({ src: `/work/campaign/campaign-0${n}.jpg`, alt, width: w, height: h });

export const pool = {
  photo1: photo(1, "Editorial portrait of a young woman lit by hard afternoon window light in a warm apartment", 864, 1152),
  photo2: photo(2, "Street scene at dusk in Nairobi with golden haze, silhouetted pedestrians and a matatu in soft focus", 1344, 768),
  photo3: photo(3, "Studio still life of a hand-thrown ceramic vessel on a plinth with a long hard shadow", 1024, 1024),
  photo4: photo(4, "Detail of a leather craftsman's hands at work on a bench in warm workshop light", 864, 1152),
  photo5: photo(5, "Open savanna landscape at dawn with low mist over red earth and a single acacia silhouette", 1344, 768),
  photo6: photo(6, "Fashion editorial portrait against a seamless ochre backdrop in a rust-colored garment", 864, 1152),
  photo7: photo(7, "Minimal architecture detail with warm concrete, diagonal light and a single small window", 1024, 1024),
  photo8: photo(8, "Macro close-up of woven wool threads in rust and cream under warm raking light", 1344, 768),

  design1: design(1, "Typographic poster with bold abstract letterforms and a large vermilion circle on bone paper", 864, 1152),
  design2: design(2, "Brand stationery flat lay with business cards, letterhead and envelope in vermilion and ink", 1152, 864),
  design3: design(3, "Grid of twelve small geometric brand mark explorations printed on bone paper", 1024, 1024),
  design4: design(4, "Coffee packaging mockup with three matte paper bags in warm sand and terracotta tones", 1024, 1024),
  design5: design(5, "Open magazine spread with a huge condensed headline and a duotone photograph", 1152, 864),
  design6: design(6, "Type specimen poster with an enormous cropped letterform and vermilion registration marks", 864, 1152),
  design7: design(7, "Two matching minimal campaign posters with an abstract sun arc symbol on a warm wall", 1152, 864),

  film1: film(1, "Film still of a lone figure in a doorway with a shaft of golden light and floating dust", 1344, 768),
  film2: film(2, "Very wide film still of a lone car on a red dirt road crossing savanna at dusk", 1440, 720),
  film3: film(3, "Film still of a night market with warm tungsten bulbs, steam and amber bokeh", 1344, 768),
  film4: film(4, "Film still inside an old car at dusk with the driver half-lit by warm dashboard glow", 1344, 768),
  film5: film(5, "Detail film still of hands threading a 16mm projector under warm tungsten light", 1344, 768),
  film6: film(6, "Film still inside a bus at night with a silhouetted passenger and streaking highway lights", 1440, 720),

  campaign1: campaign(1, "Billboard mockup at dusk showing a minimal poster with a vermilion arc symbol", 1344, 768),
  campaign2: campaign(2, "Weathered campaign posters pasted on a warm concrete wall with torn edges", 1152, 864),

  portrait: m({
    src: "/work/about/portrait.jpg",
    alt: "Portrait of Victor Oginga from behind at a three-quarter angle, holding a medium format camera in a dim studio doorway with warm rim light",
    width: 864,
    height: 1152,
  }),
} as const;

export type PoolKey = keyof typeof pool;
