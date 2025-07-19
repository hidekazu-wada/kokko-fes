import { createClient } from 'microcms-js-sdk';
import type { 
  EventConfig, 
  Content, 
  News, 
  MicroCMSListResponse 
} from '../types/microcms';

// MicroCMS クライアント作成
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// イベント設定取得
export const getEventConfigs = async (): Promise<MicroCMSListResponse<EventConfig>> => {
  return await client.get({
    endpoint: 'event-config',
  });
};

// 現在の年度設定取得
export const getCurrentEventConfig = async (): Promise<EventConfig | null> => {
  const response = await getEventConfigs();
  return response.contents.find(config => config.status.includes('current')) || null;
};

// 特定年度の設定取得
export const getEventConfigByYear = async (year: string): Promise<EventConfig | null> => {
  const response = await client.get({
    endpoint: 'event-config',
    queries: {
      filters: `year[equals]${year}`,
    },
  });
  return response.contents[0] || null;
};

// コンテンツ取得
export const getContents = async (year?: string, categoryId?: string): Promise<MicroCMSListResponse<Content>> => {
  let filters = '';
  if (year) filters += `year[equals]${year}`;
  if (categoryId) {
    if (filters) filters += '[and]';
    filters += `categoryId[equals]${categoryId}`;
  }

  return await client.get({
    endpoint: 'contents',
    queries: filters ? { filters } : {},
  });
};

// 特定コンテンツ取得
export const getContentBySlug = async (slug: string, year?: string): Promise<Content | null> => {
  let filters = `slug[equals]${slug}`;
  if (year) filters += `[and]year[equals]${year}`;

  const response = await client.get({
    endpoint: 'contents',
    queries: { filters },
  });
  return response.contents[0] || null;
};

// お知らせ取得
export const getNews = async (year?: string): Promise<MicroCMSListResponse<News>> => {
  const filters = year ? `year[equals]${year}` : '';
  
  return await client.get({
    endpoint: 'news',
    queries: filters ? { filters } : {},
  });
};

// 特定お知らせ取得
export const getNewsBySlug = async (slug: string): Promise<News | null> => {
  const response = await client.get({
    endpoint: 'news',
    queries: {
      filters: `slug[equals]${slug}`,
    },
  });
  return response.contents[0] || null;
};

// アーカイブ年度一覧取得
export const getArchivedYears = async (): Promise<string[]> => {
  const response = await client.get({
    endpoint: 'event-config',
    queries: {
      filters: 'status[contains]archived',
      fields: 'year',
    },
  });
  return response.contents.map((config: EventConfig) => config.year).sort((a: string, b: string) => b.localeCompare(a));
};