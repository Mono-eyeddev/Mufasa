// Regenerate specific assets with corrected prompts.
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const FIXES = [
  {
    out: '/home/z/my-project/public/work/photography/photo-01.jpg',
    size: '864x1152',
    prompt:
      'Editorial portrait photograph of a young woman in a warm sunlit apartment, late afternoon window light raking across her face, gauzy sheer curtain glowing, ochre painted wall, quiet confident expression, three-quarter view, shallow depth of field, shot on 85mm lens, Kodak Portra 400 warm amber and ochre tones, fine film grain, muted earth-tone palette, high quality, detailed, full-bleed image only, no border, no frame, no text, no letterbox, no watermark',
  },
];

const zai = await ZAI.create();
for (const job of FIXES) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await zai.images.generations.create({ prompt: job.prompt, size: job.size });
      const b64 = res?.data?.[0]?.base64;
      if (!b64) throw new Error('empty base64');
      fs.writeFileSync(job.out, Buffer.from(b64, 'base64'));
      console.log(`[ok] ${job.out}`);
      break;
    } catch (e) {
      console.error(`[retry ${attempt}] ${e.message}`);
      await new Promise(r => setTimeout(r, 5000 * attempt));
    }
  }
}
