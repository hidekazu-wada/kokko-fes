// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // サイトURL（本番環境）
  site: 'https://kokko-fes.com',

  // Vercel用の最適化
  output: 'static',
  build: {
    assets: 'assets'
  },
  image: {
    // Vercelでの画像最適化の問題を回避
    service: {
      entrypoint: 'astro/assets/services/noop'
    },
    // MicroCMSの画像ドメインを許可
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io'
      }
    ]
  },

  // サイトマップの自動生成
  integrations: [sitemap()]
});
