// MicroCMS API レスポンス型定義
export interface MicroCMSImage {
  url: string;
  height: number;
  width: number;
}

export interface MicroCMSDate {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

// 開催日型定義
export interface EventDate {
  fieldId: string;
  date: string;
  label?: string;
}

// カテゴリー型定義
export interface Category {
  fieldId: string;
  categoryId: string;
  name: string;
  slug: string;
  order: number;
}

// イベント設定型定義
export interface EventConfig extends MicroCMSDate {
  id: string;
  year: string;
  status: string[];
  theme: string;
  dates: EventDate[];
  categories: Category[];
}

// コンテンツ型定義
export interface Content extends MicroCMSDate {
  id: string;
  title: string;
  year: string;
  categoryId: string;
  description: string;
  images: MicroCMSImage[];
  venue?: string;
  time?: string;
  slug: string;
}

// お知らせ型定義
export interface News extends MicroCMSDate {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  year: string;
  slug: string;
}

// MicroCMS API レスポンス型
export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}