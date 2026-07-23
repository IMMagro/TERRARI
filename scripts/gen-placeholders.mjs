/**
 * Genera i placeholder raster (WebP) per i terrari demo usando sharp.
 * Immagini astratte "dark nature" — nessun font richiesto (solo gradienti e
 * forme organiche), così il rendering è robusto cross-platform.
 *
 * Uso:  node terrari-showcase/scripts/gen-placeholders.mjs
 * Le foto reali future sostituiscono questi file mantenendo lo stesso nome.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'terrari');

/** @param {{cx:number,cy:number,r:number,color:string,op:number}} b */
const blob = (b, i) => `
  <radialGradient id="b${i}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${b.color}" stop-opacity="${b.op}"/>
    <stop offset="100%" stop-color="${b.color}" stop-opacity="0"/>
  </radialGradient>
  <ellipse cx="${b.cx}" cy="${b.cy}" rx="${b.r}" ry="${b.r * 0.82}" fill="url(#b${i})"/>`;

function svg(w, h, cfg) {
  const blobs = cfg.blobs.map((b, i) => blob(b, i)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${cfg.top}"/>
      <stop offset="100%" stop-color="#070a0c"/>
    </linearGradient>
    <radialGradient id="glow" cx="${cfg.glowX}%" cy="${cfg.glowY}%" r="70%">
      <stop offset="0%" stop-color="${cfg.glow}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${cfg.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="48%" r="75%">
      <stop offset="55%" stop-color="#05070a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#04060a" stop-opacity="0.82"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${blobs}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect x="16" y="16" width="${w - 32}" height="${h - 32}" rx="10" fill="none"
        stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
</svg>`;
}

const tropic = (w, h) => svg(w, h, {
  top: '#0d1512', glow: '#10b981', glowX: 22, glowY: 8,
  blobs: [
    { cx: w * 0.28, cy: h * 0.3, r: w * 0.34, color: '#22c55e', op: 0.4 },
    { cx: w * 0.72, cy: h * 0.2, r: w * 0.28, color: '#10b981', op: 0.3 },
    { cx: w * 0.6, cy: h * 0.78, r: w * 0.4, color: '#065f46', op: 0.5 },
    { cx: w * 0.12, cy: h * 0.82, r: w * 0.24, color: '#16a34a', op: 0.28 },
  ],
});

const desert = (w, h) => svg(w, h, {
  top: '#15120d', glow: '#eab308', glowX: 72, glowY: 10,
  blobs: [
    { cx: w * 0.74, cy: h * 0.22, r: w * 0.26, color: '#eab308', op: 0.42 },
    { cx: w * 0.35, cy: h * 0.85, r: w * 0.5, color: '#b45309', op: 0.5 },
    { cx: w * 0.85, cy: h * 0.9, r: w * 0.38, color: '#d97706', op: 0.4 },
    { cx: w * 0.1, cy: h * 0.4, r: w * 0.2, color: '#a16207', op: 0.26 },
  ],
});

const paludario = (w, h) => svg(w, h, {
  top: '#0a1413', glow: '#0d9488', glowX: 50, glowY: 6,
  blobs: [
    { cx: w * 0.5, cy: h * 0.24, r: w * 0.32, color: '#14b8a6', op: 0.38 },
    { cx: w * 0.24, cy: h * 0.72, r: w * 0.3, color: '#10b981', op: 0.34 },
    { cx: w * 0.78, cy: h * 0.8, r: w * 0.34, color: '#0f766e', op: 0.44 },
    { cx: w * 0.62, cy: h * 0.5, r: w * 0.18, color: '#34d399', op: 0.22 },
  ],
});

const jobs = [
  ['tropicale-cover.webp', tropic(1400, 1000)],
  ['tropicale-1.webp', tropic(1000, 750)],
  ['tropicale-2.webp', tropic(1000, 750)],
  ['deserto-cover.webp', desert(1400, 1000)],
  ['deserto-1.webp', desert(1000, 750)],
  ['deserto-2.webp', desert(1000, 750)],
  ['paludario-cover.webp', paludario(1400, 1000)],
  ['paludario-1.webp', paludario(1000, 750)],
  ['paludario-2.webp', paludario(1000, 750)],
];

let done = 0;
await Promise.all(
  jobs.map(([name, markup]) =>
    sharp(Buffer.from(markup))
      .webp({ quality: 82 })
      .toFile(join(OUT, name))
      .then(() => {
        done++;
        console.log('✓', name);
      }),
  ),
);
console.log(`\nGenerati ${done}/${jobs.length} placeholder in ${OUT}`);
