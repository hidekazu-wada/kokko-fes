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
    // Sharp使用（高速・高品質な画像最適化）
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    // MicroCMSの画像ドメインを許可
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io'
      }
    ]
  },

  // リンクのプリフェッチを有効化（ホバー時に次ページを先読み）
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },

  // サイトマップの自動生成
  integrations: [sitemap()]
});
