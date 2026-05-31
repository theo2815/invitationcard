// Image optimizer — resizes oversized images to display-appropriate dimensions
// and re-encodes them, PRESERVING filename + format (so no path changes
// anywhere). Originals also live in the repo's Images/ folder.
//
// Run after dropping NEW images into public/photos or public/gifts:
//   npm run optimize:images
//
// Safe to re-run: it only overwrites a file when the result is actually
// smaller. (Avoid running many times over — repeated re-encodes of an already
// tiny file can slowly soften it. Once per new batch is the intent.)
import sharp from "sharp";
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const TARGETS = [
  { dir: "public/gifts", maxDim: 1000 }, // small cards + zoom modal
  { dir: "public/photos", maxDim: 1400 }, // portrait gallery + zoom modal
];

const fmt = (n) => `${(n / 1024).toFixed(0)} KB`;
let before = 0, after = 0;

for (const { dir, maxDim } of TARGETS) {
  const files = await readdir(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
    const fp = path.join(dir, file);
    const input = await readFile(fp); // fully buffer first (safe in-place write)
    const oldSize = input.length;

    const meta = await sharp(input).metadata();
    let pipe = sharp(input).rotate(); // respect EXIF orientation
    if (Math.max(meta.width, meta.height) > maxDim) {
      pipe = pipe.resize({ width: maxDim, height: maxDim, fit: "inside", withoutEnlargement: true });
    }
    pipe =
      ext === ".png"
        ? pipe.png({ quality: 78, palette: true, compressionLevel: 9, effort: 9 })
        : pipe.jpeg({ quality: 82, mozjpeg: true });

    const out = await pipe.toBuffer();
    const kept = out.length < oldSize; // only overwrite if we saved bytes
    if (kept) await writeFile(fp, out);
    const newSize = kept ? out.length : oldSize;
    before += oldSize;
    after += newSize;

    const dims = `${meta.width}x${meta.height}`;
    console.log(
      `${kept ? "✓" : "·"} ${file.padEnd(34)} ${dims.padEnd(11)} ${fmt(oldSize).padStart(8)} -> ${fmt(newSize).padStart(8)}${kept ? "" : "  (kept original — no gain)"}`
    );
  }
}

console.log("─".repeat(72));
console.log(`TOTAL  ${fmt(before)} -> ${fmt(after)}  (saved ${fmt(before - after)}, ${(100 * (before - after) / before).toFixed(0)}%)`);
