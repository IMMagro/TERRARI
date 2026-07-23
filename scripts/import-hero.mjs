/**
 * Importa le due immagini hero fornite dall'utente (crested gecko = tropicale,
 * pogona = arido) convertendole in WebP ottimizzati dentro src/assets/hero/.
 * Uso: node terrari-showcase/scripts/import-hero.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'assets', 'hero');
mkdirSync(out, { recursive: true });

const SRC = 'C:/Users/massi/Desktop/Untitled (4)';
const jobs = [
  ['32c0b5bf7aac571d55974358d2e6c0e9 1.png', 'hero-tropical-b.webp'],
  ['32c0b5bf7aac571d55974358d2e6c0e9 2.png', 'hero-desert-b.webp'],
];

for (const [from, to] of jobs) {
  const info = await sharp(join(SRC, from))
    .webp({ quality: 84 })
    .toFile(join(out, to));
  console.log('✓', to, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
