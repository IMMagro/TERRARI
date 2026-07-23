/**
 * Tassonomia dei biomi: etichetta italiana + famiglia d'accento.
 * La famiglia guida il colore (smeraldo = mondi umidi, ambra = mondi aridi),
 * coerente con le regole [data-biome] in global.css.
 */
export type Biome = 'tropical' | 'desert' | 'paludarium' | 'wabi-kusa';
export type BiomeFilter = Biome | 'all';

export interface BiomeInfo {
  label: string;
  family: 'tropic' | 'arid';
  blurb: string;
}

export const BIOMI: Record<Biome, BiomeInfo> = {
  tropical: {
    label: 'Tropicale',
    family: 'tropic',
    blurb: 'Umidità alta, canopie stratificate, felci e muschi in penombra.',
  },
  paludarium: {
    label: 'Paludario',
    family: 'tropic',
    blurb: 'Terra e acqua convivono: sponde, radici emerse, riflessi.',
  },
  desert: {
    label: 'Desertico',
    family: 'arid',
    blurb: 'Luce netta, minerale e succulente: geometria e pazienza.',
  },
  'wabi-kusa': {
    label: 'Wabi-Kusa',
    family: 'arid',
    blurb: 'Estetica del transitorio: una zolla viva, essenziale e imperfetta.',
  },
};

/** Ordine delle filter pill della gallery (Tutti in testa). */
export const BIOME_FILTERS: { value: BiomeFilter; label: string }[] = [
  { value: 'all', label: 'Tutti' },
  { value: 'tropical', label: 'Tropicale' },
  { value: 'desert', label: 'Desertico' },
  { value: 'paludarium', label: 'Paludario' },
  { value: 'wabi-kusa', label: 'Wabi-Kusa' },
];

export function biomeLabel(b: Biome): string {
  return BIOMI[b]?.label ?? b;
}
