import { pool } from "./media-pool";
import type { Project } from "./types";

/**
 * Portfolio content.
 * NOTE: every image below is an original generated placeholder hosted in /public —
 * swap each Media entry for Victor's real files (same shape) as they become available.
 * Unknown fields (client, year, awards) are deliberately omitted, never invented.
 */

export const projects: Project[] = [
  {
    slug: "salt-and-light",
    title: "Salt & Light",
    discipline: ["photography"],
    summary:
      "A portrait series made in one afternoon of hard window light — neighbours, family and friends in a second-floor apartment.",
    cover: pool.photo1,
    blocks: [
      {
        type: "text",
        body: "Shot in a single apartment over one afternoon, the series works one window and one reflector. Nothing is styled beyond what the rooms already held — the light does the directing.",
      },
      {
        type: "image-full",
        media: pool.photo6,
        caption: "Frame 04 — seamless paper, one flash, no retouching beyond tone.",
      },
      {
        type: "image-caption",
        media: pool.photo4,
        caption: "Frame 07 — hands, between tasks.",
      },
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "ghode",
    title: "Ghode",
    discipline: ["branding", "graphic-design"],
    summary:
      "Identity system built around a single geometric mark — stationery, print collateral and a set of twelve mark explorations.",
    cover: pool.design2,
    blocks: [
      {
        type: "text",
        body: "The identity reduces to one constructed mark and two colours. Every application — card, letterhead, label — repeats the same grid, so the system survives bad photocopies and good ones alike.",
      },
      {
        type: "image-full",
        media: pool.design3,
        caption: "Mark explorations — twelve directions, one survivor.",
      },
      {
        type: "image-two",
        media: [pool.design1, pool.design6],
      },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "small-rain",
    title: "Small Rain",
    discipline: ["film"],
    summary:
      "A short film about a long wait — one figure, one doorway, one shaft of light. Shot in two evenings.",
    cover: pool.film1,
    screenerNote: "Screener available on request.",
    blocks: [
      {
        type: "text",
        body: "Small Rain is built from long holds. The camera waits for weather, traffic and people to arrange themselves, then takes the frame. Most of the film happens in the doorway and most of the drama happens off-screen.",
      },
      {
        type: "image-full",
        media: pool.film4,
        caption: "Scene 6 — dashboard glow, practical lights only.",
      },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "meridian",
    title: "Meridian",
    discipline: ["graphic-design"],
    summary:
      "A poster series and editorial spread set in one condensed face — big type, one circle, generous paper.",
    cover: pool.design1,
    blocks: [
      {
        type: "text",
        body: "Meridian is a study in how little a poster needs: one weight, one geometric accent, a strict baseline grid. The spread extends the system to long-form pages without adding a single new element.",
      },
      {
        type: "image-full",
        media: pool.design5,
        caption: "Editorial application — same grid, longer read.",
      },
      {
        type: "image-caption",
        media: pool.design6,
        caption: "Specimen — the face at display sizes.",
      },
    ],
    featured: true,
    order: 4,
  },
  {
    slug: "dust-choir",
    title: "Dust Choir",
    discipline: ["photography"],
    summary:
      "Street and landscape frames made at the edge of the day — dust, haze and the last warm ten minutes of light.",
    cover: pool.photo2,
    blocks: [
      {
        type: "image-full",
        media: pool.photo5,
        caption: "Dawn, on the road out — mist burning off the red earth.",
      },
      {
        type: "image-caption",
        media: pool.photo8,
        caption: "Texture study — wool, raking light.",
      },
    ],
    featured: true,
    order: 5,
  },
  {
    slug: "kilo",
    title: "Kilo",
    discipline: ["campaigns", "graphic-design"],
    summary:
      "A launch campaign carried across out-of-home, posters and packaging — one arc symbol, repeated until it sticks.",
    cover: pool.campaign1,
    blocks: [
      {
        type: "image-two",
        media: [pool.campaign2, pool.design4],
      },
      {
        type: "text",
        body: "The campaign lives in three places: a billboard at dusk, a wall of pasted posters, and the package in hand. Each uses the same arc and the same two inks — recognition comes from repetition, not variation.",
      },
    ],
    featured: true,
    order: 6,
  },
  {
    slug: "night-market",
    title: "Night Market",
    discipline: ["film", "photography"],
    summary:
      "A film and photo study of a market after dark — tungsten bulbs, steam and the choreography of regulars.",
    cover: pool.film3,
    screenerNote: "Screener available on request.",
    blocks: [
      {
        type: "text",
        body: "Shot handheld between 8pm and midnight with practical light only. The film keeps the market's own rhythm — no added music, no narration.",
      },
      {
        type: "image-caption",
        media: pool.film5,
        caption: "From the making — threading the projector.",
      },
    ],
    featured: false,
    order: 7,
  },
  {
    slug: "foundry",
    title: "Foundry",
    discipline: ["photography"],
    summary:
      "Architecture and still-life frames about weight and light — concrete, ceramics and one small window.",
    cover: pool.photo7,
    blocks: [
      {
        type: "image-full",
        media: pool.photo3,
        caption: "Vessel, plinth, one hard sidelight.",
      },
    ],
    featured: false,
    order: 8,
  },
  {
    slug: "northern-road",
    title: "Northern Road",
    discipline: ["film"],
    summary:
      "A road film in two shots — a car crossing open country and a bus interior at night.",
    cover: pool.film2,
    screenerNote: "Screener available on request.",
    blocks: [
      {
        type: "image-full",
        media: pool.film6,
        caption: "Shot 2 — the night bus, practicals only.",
      },
    ],
    featured: false,
    order: 9,
  },
  {
    slug: "common-thread",
    title: "Common Thread",
    discipline: ["graphic-design"],
    summary:
      "A poster pair exploring one symbol — an arc for shared ground, printed in two inks on sand paper.",
    cover: pool.design7,
    blocks: [
      {
        type: "text",
        body: "Two posters, one symbol, two inks. The series tests how far a single gesture can be pushed before it stops reading — the answer, on this evidence, is further.",
      },
    ],
    featured: false,
    order: 10,
  },
];
