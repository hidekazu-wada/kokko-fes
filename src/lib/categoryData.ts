// カテゴリーデータ取得の抽象化層
// データは src/data/categories.json、画像は public/images/categories/ に置いている
// （2025年版は microCMS から切り離し済み）

import type { Categories, Category } from '../types/contents';

// 統一インターフェース：全ページでこのメソッドを使用
export async function getCategoriesData(): Promise<Categories> {
  const categoriesData = await import('../data/categories.json');
  return categoriesData.default as Categories;
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
