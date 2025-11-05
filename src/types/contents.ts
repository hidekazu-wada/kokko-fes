// MicroCMS「コンテンツ国庫フェス」API用の型定義

// 既存の型定義（JSONとの互換性維持）
export interface CategoryItem {
  name: string;
  description: string;
  detailInfo: string;
  image: string;
  images: string[];
  location: string;
  time: string;
  snsUrl: string;
  price: string;
}

export interface Category {
  id: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  items: CategoryItem[];
}

export interface Categories {
  [key: string]: Category;
}

// MicroCMS用の型定義
export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

export interface MicroCMSCategoryItem {
  name: string;
  description: string;
  detailInfo: string;
  mainImage: MicroCMSImage;
  galleryImages?: MicroCMSImage[];
  location: string;
  time: string;
  snsUrl?: string;
  price: string;
}

export interface MicroCMSContent {
  id: string;
  categoryId: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  items: MicroCMSCategoryItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface MicroCMSContentsResponse {
  contents: MicroCMSContent[];
  totalCount: number;
  offset: number;
  limit: number;
}
