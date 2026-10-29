// MUFASA(R) asset generation — original placeholder imagery, locally hosted.
// Warm amber/ochre grade throughout to harmonise with paper #ECE7DC / ink #0D0C0A / vermilion #FF3B1F.
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const ROOT = '/home/z/my-project/public/work';

const PHOTO_STYLE =
  'shot on 35mm film, Kodak Portra 400, warm amber and ochre tones, fine film grain, soft natural light, muted earth-tone palette, editorial photography, high quality, detailed, no text, no watermark';

const FILM_STYLE =
  'cinematic film still, anamorphic widescreen framing, warm golden tones, atmospheric haze, Kodak film stock, shallow depth of field, moody cinematography, film grain, high quality, no text, no watermark';

const DESIGN_STYLE =
  'graphic design presentation photograph, flat lay on warm cream paper, brand identity mockup, vermilion red and ink black print on bone paper, swiss grid layout, subtle paper texture and shadow, studio photography, high quality, detailed, minimal';

const JOBS = [
  // ---------- PHOTOGRAPHY (8) ----------
  { out: 'photography/photo-01.jpg', size: '864x1152', prompt: `Editorial portrait of a young woman in a warm sunlit apartment, late afternoon window light raking across her face, gauzy curtain, ochre painted wall, quiet confident expression, three-quarter view, ${PHOTO_STYLE}` },
  { out: 'photography/photo-02.jpg', size: '1344x768', prompt: `Street scene at dusk in Nairobi, golden haze over the road, silhouetted pedestrians crossing, warm street lights just switching on, matatu bus in soft focus, ${PHOTO_STYLE}` },
  { out: 'photography/photo-03.jpg', size: '1024x1024', prompt: `Studio still life of a single hand-thrown ceramic vessel on a raw plinth, hard warm sidelight casting a long shadow, terracotta and sand tones, minimal composition, ${PHOTO_STYLE}` },
  { out: 'photography/photo-04.jpg', size: '864x1152', prompt: `Documentary detail portrait of a leather craftsman's hands at work on a bench, warm workshop light through dusty air, thread and awl, weathered skin, ${PHOTO_STYLE}` },
  { out: 'photography/photo-05.jpg', size: '1344x768', prompt: `Open savanna landscape at dawn, low mist over red earth, a single distant acacia tree silhouette, pale amber sky, vast negative space, ${PHOTO_STYLE}` },
  { out: 'photography/photo-06.jpg', size: '864x1152', prompt: `Fashion editorial portrait against a seamless ochre backdrop, model in a rust-colored garment, sculptural pose, hard flash light with soft falloff, confident and minimal, ${PHOTO_STYLE}` },
  { out: 'photography/photo-07.jpg', size: '1024x1024', prompt: `Minimal architecture detail, warm concrete wall with strong diagonal afternoon light and deep shadow, single small window, brutalist calm, sand and clay tones, ${PHOTO_STYLE}` },
  { out: 'photography/photo-08.jpg', size: '1344x768', prompt: `Extreme close-up macro of woven fabric threads in rust and cream wool, warm raking light, shallow depth of field, tactile texture study, ${PHOTO_STYLE}` },

  // ---------- DESIGN (7) ----------
  { out: 'design/design-01.jpg', size: '864x1152', prompt: `A large typographic art poster pinned on a gallery wall, bold abstract geometric letterforms and a big vermilion circle on bone paper, huge condensed black shapes, greeked unreadable placeholder text lines, grainy risograph print texture, ${DESIGN_STYLE}` },
  { out: 'design/design-02.jpg', size: '1152x864', prompt: `Brand identity stationery flat lay, business cards and letterhead and envelope arranged on warm cream paper, minimal geometric logotype, vermilion and ink black accents, subtle shadows, ${DESIGN_STYLE}` },
  { out: 'design/design-03.jpg', size: '1024x1024', prompt: `Brand mark exploration sheet, a clean grid of twelve small abstract geometric logo symbols printed in ink black on bone paper, one mark highlighted in vermilion, annotation crop marks, ${DESIGN_STYLE}` },
  { out: 'design/design-04.jpg', size: '1024x1024', prompt: `Coffee packaging design mockup, three matte paper bags in warm sand, terracotta and ink colors, minimal typographic labels with abstract marks, studio light on warm cream background, ${DESIGN_STYLE}` },
  { out: 'design/design-05.jpg', size: '1152x864', prompt: `Open magazine spread mockup on cream paper, bold editorial layout with a huge condensed headline and a duotone photograph, generous white space, thin rules and folios, ${DESIGN_STYLE}` },
  { out: 'design/design-06.jpg', size: '864x1152', prompt: `Type specimen poster, one enormous cropped letterform printed in ink black over warm bone paper, small grid of glyph details below, vermilion registration marks, grainy print texture, ${DESIGN_STYLE}` },
  { out: 'design/design-07.jpg', size: '1152x864', prompt: `Two matching posters side by side on a warm gallery wall, minimal campaign design with abstract sun arc symbol and bold condensed greeked type, vermilion and ink on sand paper, slight paper curl shadow, ${DESIGN_STYLE}` },

  // ---------- FILM (6) ----------
  { out: 'film/film-01.jpg', size: '1344x768', prompt: `A lone figure standing in a doorway of a dim warm interior, a shaft of golden light through the open door with dust particles floating, backlit silhouette, quiet tension, ${FILM_STYLE}` },
  { out: 'film/film-02.jpg', size: '1344x768', prompt: `Very wide 2.39:1 composition, a lone car on a red dirt road crossing open savanna at dusk, long dust trail, enormous amber sky, tiny silhouette of distant hills, ${FILM_STYLE}` },
  { out: 'film/film-03.jpg', size: '1344x768', prompt: `Night market street scene, strings of warm tungsten bulbs, steam rising from food stalls, warm bokeh, figures moving through amber light, cinematic night photography, ${FILM_STYLE}` },
  { out: 'film/film-04.jpg', size: '1344x768', prompt: `Interior of an old car at dusk, driver seen in profile half-lit by warm dashboard glow and passing street light, rain-speckled window, reflective quiet mood, ${FILM_STYLE}` },
  { out: 'film/film-05.jpg', size: '1344x768', prompt: `Detail shot of hands threading an old 16mm film projector, warm single-source tungsten light, cigarette smoke drifting through the beam, mechanical reels, ${FILM_STYLE}` },
  { out: 'film/film-06.jpg', size: '1344x768', prompt: `Interior of a bus at night, a single passenger silhouetted against the window with warm passing highway lights streaking, reflective glass, quiet lonely mood, ${FILM_STYLE}` },

  // ---------- CAMPAIGN (2) ----------
  { out: 'campaign/campaign-01.jpg', size: '1344x768', prompt: `A large billboard mockup at dusk in a warm city street, the billboard shows a minimal poster with a big vermilion arc symbol and bold condensed greeked type on sand paper background, warm street lights, people passing below, ${FILM_STYLE}` },
  { out: 'campaign/campaign-02.jpg', size: '1152x864', prompt: `Series of weathered posters pasted on a warm concrete wall, layered campaign design with abstract geometric symbols in vermilion and ink on bone paper, torn edges, afternoon sidelight, ${DESIGN_STYLE}` },

  // ---------- ABOUT (1) ----------
  { out: 'about/portrait.jpg', size: '864x1152', prompt: `Editorial portrait of an African male photographer in his early thirties, seen from behind at a three-quarter angle, face turned away in soft shadow, holding a medium format camera at his side, standing in a dim studio doorway with warm rim light on his shoulder, workwear shirt, ${PHOTO_STYLE}` },
];

async function main() {
  const zai = await ZAI.create();
  const queue = [...JOBS];
  const failed = [];
  let done = 0;

  async function worker(id) {
    while (queue.length) {
      const job = queue.shift();
      if (!job) break;
      const dest = path.join(ROOT, job.out);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
        done++; console.log(`[skip] ${job.out}`); continue;
      }
      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          const res = await zai.images.generations.create({ prompt: job.prompt, size: job.size });
          const b64 = res?.data?.[0]?.base64;
          if (!b64) throw new Error('empty base64');
          fs.writeFileSync(dest, Buffer.from(b64, 'base64'));
          done++; console.log(`[ok ${done}/${JOBS.length}] ${job.out} (${job.size})`);
          break;
        } catch (err) {
          const is429 = String(err.message).includes('429');
          console.error(`[retry ${attempt}] ${job.out}: ${err.message}`);
          if (attempt === 5) { failed.push(job.out); done++; }
          else await new Promise(r => setTimeout(r, (is429 ? 6000 : 2000) * attempt));
        }
      }
    }
  }

  const CONCURRENCY = 2;
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  console.log(failed.length ? `FAILED: ${failed.join(', ')}` : 'ALL DONE');
  fs.writeFileSync('/home/z/my-project/scripts/gen-status.txt', failed.length ? `FAILED: ${failed.join(', ')}` : 'ALL DONE');
  process.exit(failed.length ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
