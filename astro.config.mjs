// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Vercel用の最適化
  output: 'static',
  build: {
    assets: 'assets'
  }
});
