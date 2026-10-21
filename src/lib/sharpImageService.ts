// Astro 5 と同じ大きさで画像を書き出すための Sharp サービス。
// Astro 6 から、幅だけ指定しても高さを計算して「幅×高さ」に切り抜くようになり、
// 高さや幅が1pxずれる画像が出る。fit を指定していないときは Astro 5 と同じく幅だけで縮める。
import type { LocalImageService } from 'astro';
import sharpService from 'astro/assets/services/sharp';

const base = sharpService as LocalImageService;

const service: LocalImageService = {
  ...base,
  async transform(inputBuffer, transformOptions, ...rest) {
    if (transformOptions.width && transformOptions.height && !transformOptions.fit) {
      const { height: _height, ...widthOnly } = transformOptions;
      return base.transform(inputBuffer, widthOnly as typeof transformOptions, ...rest);
    }
    return base.transform(inputBuffer, transformOptions, ...rest);
  },
};

export default service;
