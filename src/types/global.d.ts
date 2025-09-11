// Astroコンポーネントの型定義
declare module "../components/common/MenuToggle.astro" {
  const component: any;
  export default component;
}

declare module "../components/common/Menu.astro" {
  const component: any;
  export default component;
}

declare module "../components/common/Footer.astro" {
  const component: any;
  export default component;
}

declare module "../components/common/PageHeader.astro" {
  const component: any;
  export default component;
}

declare module "../components/common/PageBottomWave.astro" {
  const component: any;
  export default component;
}

// カテゴリーデータの型定義
declare module "../data/categories.json" {
  interface CategoryItem {
    name: string;
    description: string;
    detailInfo: string;
    image: string;
    images?: string[];
    location: string;
    time: string;
    snsUrl: string;
    price: string;
  }

  interface CategoryData {
    id: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    description: string;
    items: CategoryItem[];
  }

  interface CategoriesData {
    [key: string]: CategoryData;
  }

  const data: CategoriesData;
  export default data;
}