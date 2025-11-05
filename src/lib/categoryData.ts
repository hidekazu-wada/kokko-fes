// カテゴリーデータ取得の抽象化層
// JSONとMicroCMSを環境変数で切り替え可能

import type {
  Categories,
  Category,
  CategoryItem,
  MicroCMSContent,
  MicroCMSCategoryItem,
} from '../types/contents';

// フィーチャーフラグ（環境変数で制御）
const USE_MICROCMS = import.meta.env.PUBLIC_USE_MICROCMS === 'true';

let client: any = null;

// MicroCMSクライアント初期化
if (USE_MICROCMS) {
  const { createClient } = await import('microcms-js-sdk');
  client = createClient({
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN || '',
    apiKey: import.meta.env.MICROCMS_API_KEY || '',
  });
}

// MicroCMSのアイテムデータを既存の型に変換
function convertMicroCMSItem(item: MicroCMSCategoryItem): CategoryItem {
  return {
    name: item.name,
    description: item.description.replace(/\n/g, '<br>'),
    detailInfo: item.detailInfo,
    image: item.mainImage.url,
    images: item.galleryImages
      ? item.galleryImages.map((img) => img.url)
      : [item.mainImage.url],
    location: item.location,
    time: item.time,
    snsUrl: item.snsUrl || '',
    price: item.price,
  };
}

// MicroCMSのカテゴリーデータを既存の型に変換
function convertMicroCMSContent(content: MicroCMSContent): Category {
  return {
    id: content.categoryId,
    title: content.title,
    titleAccent: content.titleAccent,
    subtitle: content.subtitle,
    description: content.description.replace(/\n/g, '<br>'),
    items: content.items.map(convertMicroCMSItem),
  };
}

// JSONデータ取得（フォールバック）
async function getCategoriesFromJSON(): Promise<Categories> {
  const categoriesData = await import('../data/categories.json');
  return categoriesData.default as Categories;
}

// MicroCMSからデータ取得
async function getCategoriesFromMicroCMS(): Promise<Categories> {
  if (!client) {
    console.warn('⚠️ MicroCMS client not initialized, falling back to JSON');
    return getCategoriesFromJSON();
  }

  try {
    const response = await client.get({
      endpoint: 'contents-kokkofes',
      queries: { limit: 100 },
    });

    const categories: Categories = {};
    response.contents.forEach((content: MicroCMSContent) => {
      categories[content.categoryId] = convertMicroCMSContent(content);
    });

    console.log('✅ Data fetched from MicroCMS (contents-kokkofes)');
    return categories;
  } catch (error) {
    console.error('❌ Failed to fetch from MicroCMS:', error);
    console.warn('⚠️ Falling back to JSON data');
    return getCategoriesFromJSON();
  }
}

// 統一インターフェース：全ページでこのメソッドを使用
export async function getCategoriesData(): Promise<Categories> {
  if (USE_MICROCMS) {
    console.log('📡 Fetching from MicroCMS...');
    return getCategoriesFromMicroCMS();
  } else {
    console.log('📄 Fetching from JSON...');
    return getCategoriesFromJSON();
  }
}

// 特定カテゴリーの取得
export async function getCategoryData(categoryId: string): Promise<Category | null> {
  const categories = await getCategoriesData();
  return categories[categoryId] || null;
}

// 全カテゴリーのID一覧を取得（動的ルーティング用）
export async function getAllCategoryIds(): Promise<string[]> {
  const categories = await getCategoriesData();
  return Object.keys(categories);
}

// 特定カテゴリーの全アイテム名を取得（動的ルーティング用）
export async function getCategoryItemNames(categoryId: string): Promise<string[]> {
  const category = await getCategoryData(categoryId);
  return category ? category.items.map((item) => item.name) : [];
}
