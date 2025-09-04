// お知らせ機能の型定義

export interface NewsCategory {
  id: string;
  name: string;
  color: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface NewsData {
  categories: NewsCategory[];
  articles: NewsArticle[];
}

// ページネーション用の型
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

// フィルター用の型
export interface NewsFilterProps {
  categories: NewsCategory[];
  selectedCategory?: string;
}