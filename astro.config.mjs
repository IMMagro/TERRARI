// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Sito statico ad alte prestazioni: le pagine sono prerenderizzate,
// solo gli endpoint API usano `export const prerender = false` (serverless su Vercel).
export default defineConfig({
  // TODO: sostituire con il dominio reale al momento del deploy.
  site: 'https://terrari-showcase.vercel.app',
  output: 'static',
  // Porta assegnata dal preview (PORT env), con fallback 4321 per l'uso manuale.
  server: { port: Number(process.env.PORT) || 4321 },
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
