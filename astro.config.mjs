// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Vercel用の最適化
  output: 'static',
  build: {
    assets: 'assets'
  },
  image: {
    // Vercelでの画像最適化の問題を回避
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  }
});
