// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // サイトURL（本番環境）
  site: 'https://kokko-fes.com',

  // Vercel用の最適化
  output: 'static',
  // Astro 6 で既定が 'jsx' に変わり、要素間の空白が詰まって文字の間隔が変わるため、従来どおりに戻す
  compressHTML: true,
  build: {
    assets: 'assets'
  },
  image: {
    // Sharp使用（高速・高品質な画像最適化）
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  // リンクのプリフェッチを有効化（ホバー時に次ページを先読み）
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },

  // Astro 7（Vite 8）で CSS の書き出し先の既定が新しいブラウザ向け（Safari 16.4 以上）に変わり、
  // メディアクエリが新しい書き方になる。古い iPhone で崩れないよう、Astro 5（Vite 6）のときの対象に戻す
  vite: {
    build: {
      cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14']
    }
  },

  // サイトマップの自動生成
  integrations: [sitemap()]
});
