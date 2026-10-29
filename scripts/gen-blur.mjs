// Generates tiny base64 blur placeholders for every site image into src/content/blur.json
import sharp from "sharp";
import fs from "fs";
import path from "path";

const PUBLIC = "/home/z/my-project/public";
const OUT = "/home/z/my-project/src/content/blur.json";

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) out.push(p);
  }
  return out;
}

const files = walk(path.join(PUBLIC, "work"));
const map = {};

for (const file of files) {
  const rel = path.relative(PUBLIC, file);
  try {
    const buf = await sharp(file)
      .resize(12, 12, { fit: "inside" })
      .jpeg({ quality: 40 })
      .toBuffer();
    map[rel] = `data:image/jpeg;base64,${buf.toString("base64")}`;
    console.log(`[blur] ${rel}`);
  } catch (err) {
    console.error(`[fail] ${rel}: ${err.message}`);
  }
}

fs.writeFileSync(OUT, JSON.stringify(map, null, 2));
console.log(`Wrote ${Object.keys(map).length} placeholders to ${OUT}`);
