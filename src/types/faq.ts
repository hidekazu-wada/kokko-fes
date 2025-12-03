// FAQ機能の型定義

export interface FAQCategory {
  id: string;
  name: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string; // HTML形式も可
}

export interface FAQData {
  categories: FAQCategory[];
  faqs: FAQItem[];
}
