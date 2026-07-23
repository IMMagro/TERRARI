/**
 * Converte il ritaglio del geco (trasparente) in WebP con alpha,
 * per il box "Opere in evidenza". Uso: node terrari-showcase/scripts/import-gecko-peek.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'assets');
mkdirSync(out, { recursive: true });

const SRC = 'C:/Users/massi/Desktop/260e9d109166882d747b69553cc0636b 1.png';
const meta = await sharp(SRC).metadata();
console.log('sorgente:', `${meta.width}×${meta.height}`, 'hasAlpha:', meta.hasAlpha, 'channels:', meta.channels);

const info = await sharp(SRC)
  .trim() // rimuove i bordi trasparenti così le zampe toccano il fondo del box
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(join(out, 'gecko-peek.webp'));
console.log('✓ gecko-peek.webp', `${info.width}×${info.height}`, `${Math.round(info.size / 1024)}KB`);
