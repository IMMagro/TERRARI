import type { ImageMetadata } from 'astro';

/**
 * Risolve una stringa dal frontmatter (coverImage / galleryImages) in
 * ImageMetadata ottimizzabile da <Image> di astro:assets.
 *
 * Accetta path completi (`/src/assets/terrari/x.webp`), path parziali
 * (`assets/terrari/x.webp`) o solo il nome file (`x.webp`), così la pipeline
 * Agentic OS può usare la convenzione che preferisce. Se il file non esiste
 * ancora (es. placeholder non generato), ritorna `undefined` e il componente
 * mostra il fallback gradiente `.img-placeholder`.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/terrari/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const byKey = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  byKey.set(path, mod.default); // path completo
  const base = path.split('/').pop();
  if (base) byKey.set(base, mod.default); // solo nome file
}

export function resolveTerrarioImage(ref: string | undefined): ImageMetadata | undefined {
  if (!ref) return undefined;
  const normalized = ref.replace(/^\.?\/?(src\/)?assets\/terrari\//, '');
  return (
    byKey.get(ref) ??
    byKey.get(normalized) ??
    byKey.get(ref.split('/').pop() ?? ref)
  );
}
