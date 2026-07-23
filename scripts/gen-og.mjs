/**
 * Genera public/og-default.jpg (1200×630) — immagine social di default.
 * Composizione "dark nature" con entrambi gli aloni bioma (smeraldo + ambra)
 * a rappresentare il marchio. Nessun testo (rendering robusto senza font).
 * Uso: node terrari-showcase/scripts/gen-og.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og-default.jpg');
const W = 1200;
const H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e1417"/>
      <stop offset="100%" stop-color="#070a0c"/>
    </linearGradient>
    <radialGradient id="g1" cx="18%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="86%" cy="82%" r="55%">
      <stop offset="0%" stop-color="#d97706" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="48%" r="72%">
      <stop offset="55%" stop-color="#05070a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#04060a" stop-opacity="0.75"/>
    </radialGradient>
    <linearGradient id="seam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0"/>
      <stop offset="45%" stop-color="#22c55e" stop-opacity="0.85"/>
      <stop offset="60%" stop-color="#eab308" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect x="${W / 2 - 1}" y="120" width="2" height="${H - 240}" fill="url(#seam)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="16" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(OUT);
console.log('✓ og-default.jpg generato in', OUT);
