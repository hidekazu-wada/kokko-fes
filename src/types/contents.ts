// カテゴリーデータ（src/data/categories.json）の型定義

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
