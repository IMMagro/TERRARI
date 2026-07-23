/**
 * Converte le 3 immagini "portale di bioma" (giungla/deserto/palude) in WebP
 * per lo sfondo ciclante della sezione immersiva.
 * Uso: node terrari-showcase/scripts/import-biomi.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'assets', 'biomi');
mkdirSync(out, { recursive: true });

const SRC = 'C:/Users/massi/Desktop/Untitled (7)';
const jobs = [
  ['ce86baa17820f55255d9b868a844dedb 1.png', 'biome-tropicale.webp'], // giungla
  ['ce86baa17820f55255d9b868a844dedb 1-1.png', 'biome-deserto.webp'], // deserto
  ['ce86baa17820f55255d9b868a844dedb 1-2.png', 'biome-palude.webp'], // palude
];

for (const [from, to] of jobs) {
  const info = await sharp(join(SRC, from))
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(out, to));
  console.log('✓', to, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
