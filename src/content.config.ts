import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collection "terrari" — Content Layer (Astro 7, glob loader).
 *
 * Lo schema Zod replica ESATTAMENTE i campi del brief: è il contratto con
 * la pipeline Agentic OS esterna, che scrive file .md/.mdx/.json in
 * src/content/terrari/ senza dover toccare il codice.
 *
 * Le immagini restano `z.string()` (path/nome file): src/lib/images.ts le
 * risolve in ImageMetadata per <Image>, con fallback a placeholder gradiente.
 */
const terrari = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,json}', base: './src/content/terrari' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    biome: z.enum(['tropical', 'desert', 'paludarium', 'wabi-kusa']),
    tagline: z.string(),
    isFeatured: z.boolean().default(false),
    coverImage: z.string(),
    galleryImages: z.array(z.string()).default([]),
    specs: z.object({
      dimensions: z.string(),
      volume: z.string(),
      glassType: z.string(),
      lighting: z.string(),
      automation: z.string(),
      hardscape: z.string(),
      substrate: z.string(),
      maintenanceLevel: z.enum(['Basso', 'Medio', 'Alto']),
      faunaCompatibility: z.string().optional(),
    }),
    botanicalList: z.array(z.string()).default([]),
    status: z.enum(['Disponibile', 'Realizzato su Commissione', 'Pezzo Unico']),
  }),
});

export const collections = { terrari };
