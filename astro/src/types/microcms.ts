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
  status: string;  // "current" or "archived"
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

// イベント情報型定義
export interface EventInfo extends MicroCMSDate {
  id: string;
  title: string;
  description: string;
  schedule: string;
  venue: string;
  capacity?: string;
  fee?: string;
  application: string;
  contact: string;
  year: string;
}

// アクセス情報型定義
export interface AccessInfo extends MicroCMSDate {
  id: string;
  venue_name: string;
  address: string;
  access_methods: string;
  parking?: string;
  map_embed?: string;
  year: string;
}

// お問い合わせ情報型定義
export interface ContactInfo extends MicroCMSDate {
  id: string;
  general_contact: string;
  event_contact?: string;
  media_contact?: string;
  volunteer_contact?: string;
  year: string;
}

// MicroCMS API レスポンス型
export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}