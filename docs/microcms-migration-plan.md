# MicroCMS移行実装手順書

## 📅 全体スケジュール（推奨）

| フェーズ | 作業内容 | 所要時間 | リスク |
|---------|---------|---------|--------|
| フェーズ1 | 準備と設計 | 1-2日 | 低 |
| フェーズ2 | データ移行層の実装 | 2-3日 | 低 |
| フェーズ3 | テスト環境での検証 | 1-2日 | 中 |
| フェーズ4 | 本番切り替え | 1日 | 中 |
| フェーズ5 | 後処理とクリーンアップ | 1日 | 低 |

**合計**: 6-9日

---

## 🔧 フェーズ1：準備と設計（1-2日）

### ✅ タスク1.1：MicroCMSアカウント作成

1. [MicroCMS](https://microcms.io/)でアカウント作成
2. 新規サービス作成（例：`kokko-fes`）
3. APIキー取得（読み取り専用で十分）

### ✅ タスク1.2：APIスキーマ作成

`docs/microcms-schema.md`を参照してMicroCMS管理画面で設定

**チェックリスト：**
- [ ] カテゴリーAPI作成（リスト形式）
- [ ] 全フィールド追加完了
- [ ] 繰り返しフィールド（items）設定完了
- [ ] APIプレビュー機能有効化

### ✅ タスク1.3：環境変数設定

```bash
# .env.local を作成
MICROCMS_SERVICE_DOMAIN=your-service
MICROCMS_API_KEY=your-api-key
```

**セキュリティ注意：**
- `.gitignore`に`.env.local`が含まれていることを確認

---

## 💻 フェーズ2：データ取得層の実装（2-3日）

### ✅ タスク2.1：依存パッケージのインストール

```bash
npm install microcms-js-sdk
npm install --save-dev @types/node
```

### ✅ タスク2.2：TypeScript型定義の作成

**ファイル**: `src/types/categories.ts`

既存のデータ構造に加えて、MicroCMS用の型を定義：

```typescript
// 既存の型定義（categories.json用）
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
  galleryImages: MicroCMSImage[];
  location: string;
  time: string;
  snsUrl: string;
  price: string;
}

export interface MicroCMSCategory {
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

export interface MicroCMSCategoriesResponse {
  contents: MicroCMSCategory[];
  totalCount: number;
  offset: number;
  limit: number;
}
```

### ✅ タスク2.3：データ取得の抽象化層を作成

**ファイル**: `src/lib/categoryData.ts`

この層がキーポイント！JSONとMicroCMS両方に対応し、切り替え可能にします。

```typescript
import type { Categories, Category, CategoryItem } from '../types/categories';

// MicroCMSから取得する場合
import { createClient } from 'microcms-js-sdk';
import type { MicroCMSCategory, MicroCMSCategoryItem } from '../types/categories';

// フィーチャーフラグ（環境変数で制御）
const USE_MICROCMS = import.meta.env.PUBLIC_USE_MICROCMS === 'true';

// MicroCMSクライアント初期化
const client = USE_MICROCMS
  ? createClient({
      serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
      apiKey: import.meta.env.MICROCMS_API_KEY,
    })
  : null;

// MicroCMSデータを既存の型に変換
function convertMicroCMSItem(item: MicroCMSCategoryItem): CategoryItem {
  return {
    name: item.name,
    description: item.description,
    detailInfo: item.detailInfo,
    image: item.mainImage.url, // 画像URLに変換
    images: item.galleryImages.map(img => img.url), // 画像URL配列に変換
    location: item.location,
    time: item.time,
    snsUrl: item.snsUrl,
    price: item.price,
  };
}

function convertMicroCMSCategory(category: MicroCMSCategory): Category {
  return {
    id: category.categoryId,
    title: category.title,
    titleAccent: category.titleAccent,
    subtitle: category.subtitle,
    description: category.description,
    items: category.items.map(convertMicroCMSItem),
  };
}

// JSONデータの取得（フォールバック）
async function getCategoriesFromJSON(): Promise<Categories> {
  const categoriesData = await import('../data/categories.json');
  return categoriesData.default as Categories;
}

// MicroCMSからデータ取得
async function getCategoriesFromMicroCMS(): Promise<Categories> {
  if (!client) {
    throw new Error('MicroCMS client is not initialized');
  }

  try {
    const response = await client.get({
      endpoint: 'categories',
      queries: { limit: 100 },
    });

    const categories: Categories = {};
    response.contents.forEach((category: MicroCMSCategory) => {
      categories[category.categoryId] = convertMicroCMSCategory(category);
    });

    return categories;
  } catch (error) {
    console.error('Failed to fetch from MicroCMS:', error);
    // エラー時はJSONにフォールバック
    console.warn('Falling back to JSON data');
    return getCategoriesFromJSON();
  }
}

// 統一インターフェース：このメソッドを全ページで使用
export async function getCategoriesData(): Promise<Categories> {
  if (USE_MICROCMS) {
    return getCategoriesFromMicroCMS();
  } else {
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
  return category ? category.items.map(item => item.name) : [];
}
```

**重要ポイント：**
- `USE_MICROCMS`フラグで簡単に切り替え可能
- MicroCMSエラー時は自動的にJSONにフォールバック
- 既存の型（`Categories`）に変換するので、他のコードは変更不要

### ✅ タスク2.4：既存ページの書き換え

#### 例1：カテゴリ一覧ページ `src/pages/[category]/index.astro`

**変更前：**
```astro
---
import categoriesData from "../../data/categories.json";
const { category } = Astro.params;
const categoryData = categoriesData[category];
---
```

**変更後：**
```astro
---
import { getCategoryData, getAllCategoryIds } from "../../lib/categoryData";

export async function getStaticPaths() {
  const categoryIds = await getAllCategoryIds();
  return categoryIds.map(category => ({
    params: { category }
  }));
}

const { category } = Astro.params;
const categoryData = await getCategoryData(category);

if (!categoryData) {
  return Astro.redirect('/404');
}
---
```

#### 例2：カテゴリ詳細ページ `src/pages/[category]/[detail].astro`

**変更前：**
```astro
---
import categoriesData from "../../data/categories.json";

export function getStaticPaths() {
  const paths = [];
  Object.entries(categoriesData).forEach(([categoryKey, categoryValue]) => {
    categoryValue.items.forEach((item) => {
      paths.push({
        params: {
          category: categoryKey,
          detail: item.name
        },
        props: {
          categoryData: categoryValue,
          itemData: item
        }
      });
    });
  });
  return paths;
}
---
```

**変更後：**
```astro
---
import { getCategoriesData } from "../../lib/categoryData";

export async function getStaticPaths() {
  const categoriesData = await getCategoriesData();
  const paths = [];

  Object.entries(categoriesData).forEach(([categoryKey, categoryValue]) => {
    categoryValue.items.forEach((item) => {
      paths.push({
        params: {
          category: categoryKey,
          detail: item.name
        },
        props: {
          categoryData: categoryValue,
          itemData: item
        }
      });
    });
  });
  return paths;
}
---
```

#### 例3：トップページ `src/components/top/Category.astro`

**変更前：**
```astro
---
import categoriesData from "../../data/categories.json";
const categories = Object.values(categoriesData);
---
```

**変更後：**
```astro
---
import { getCategoriesData } from "../../lib/categoryData";
const categoriesData = await getCategoriesData();
const categories = Object.values(categoriesData);
---
```

---

## 🧪 フェーズ3：テスト環境での検証（1-2日）

### ✅ タスク3.1：MicroCMSにテストデータ投入

1. MicroCMS管理画面で1つのカテゴリー（例：eat）を作成
2. 2-3個のアイテムを登録
3. 画像をアップロード

### ✅ タスク3.2：環境変数設定

```bash
# .env.local
PUBLIC_USE_MICROCMS=false  # まずはJSONで動作確認
MICROCMS_SERVICE_DOMAIN=your-service
MICROCMS_API_KEY=your-api-key
```

### ✅ タスク3.3：JSON版の動作確認

```bash
npm run dev
```

- [ ] トップページ表示確認
- [ ] カテゴリ一覧ページ表示確認
- [ ] カテゴリ詳細ページ表示確認
- [ ] 画像表示確認
- [ ] スタイリング崩れがないか確認

### ✅ タスク3.4：MicroCMS版の動作確認

```bash
# .env.localを変更
PUBLIC_USE_MICROCMS=true
```

```bash
npm run dev
```

- [ ] 同じページが正しく表示されるか確認
- [ ] MicroCMSの画像URLが正しく表示されるか
- [ ] ビルドエラーがないか（`npm run build`）

### ✅ タスク3.5：画像表示の確認

**注意点：**
- MicroCMSの画像URLは外部URL（`https://images.microcms-assets.io/...`）
- `<img>`タグの`src`属性で直接使用可能
- Astroの`<Image>`コンポーネントは外部URLに対応（設定必要）

**Astro設定の確認** (`astro.config.mjs`)：

```javascript
export default defineConfig({
  image: {
    domains: ["images.microcms-assets.io"],
  },
});
```

---

## 🚀 フェーズ4：本番切り替え（1日）

### ✅ タスク4.1：全データの移行

1. MicroCMS管理画面で全カテゴリー（eat, watch, play, make）を作成
2. `categories.json`から全データをコピー＆ペースト
3. 画像を一括アップロード

**画像移行のヒント：**
- 画像は`public/src/images/`から手動でMicroCMSにアップロード
- 各アイテムに対応する画像を設定

### ✅ タスク4.2：本番環境変数の設定

Vercel管理画面で環境変数を設定：

```
PUBLIC_USE_MICROCMS=true
MICROCMS_SERVICE_DOMAIN=your-service
MICROCMS_API_KEY=your-api-key
```

### ✅ タスク4.3：デプロイと確認

1. Gitにコミット＆プッシュ
2. Vercelで自動デプロイ
3. 本番サイトで全ページ確認

**チェックリスト：**
- [ ] トップページ
- [ ] 全カテゴリー一覧ページ（eat, watch, play, make）
- [ ] 各カテゴリーの全詳細ページ
- [ ] 画像の表示
- [ ] スタイリング
- [ ] パフォーマンス（Lighthouse確認）

### ✅ タスク4.4：ロールバック手順の準備

問題が発生した場合の即座のロールバック：

```bash
# Vercel環境変数を変更
PUBLIC_USE_MICROCMS=false

# または、該当のコミットをrevert
git revert <commit-hash>
git push
```

---

## 🧹 フェーズ5：後処理とクリーンアップ（1日）

### ✅ タスク5.1：不要ファイルの削除

MicroCMSへの移行が完全に完了したら：

```bash
# categories.jsonを削除
rm src/data/categories.json

# ローカル画像ディレクトリを削除（任意）
rm -rf public/src/images/eat
rm -rf public/src/images/watch
rm -rf public/src/images/play
rm -rf public/src/images/make
```

**注意：** 削除前に必ずバックアップを取ること！

### ✅ タスク5.2：型定義のクリーンアップ

`src/lib/categoryData.ts`からJSON関連のコードを削除（任意）

### ✅ タスク5.3：ドキュメント更新

`CLAUDE.md`を更新：
- データ管理方法をMicroCMSに変更
- 更新手順を追記

---

## 📊 移行後の運用

### コンテンツ更新の流れ

**従来（JSON）：**
1. エディタで`categories.json`を編集
2. Gitにコミット＆プッシュ
3. Vercel自動デプロイ

**移行後（MicroCMS）：**
1. MicroCMS管理画面でコンテンツ編集
2. 「公開」ボタンをクリック
3. Vercelで自動ビルド（Webhook設定推奨）

### Webhook設定（推奨）

MicroCMSで記事を公開したら自動的にVercelでビルドを実行：

1. Vercel > Settings > Git > Deploy Hooks でWebhook URL取得
2. MicroCMS > API設定 > Webhook でVercelのURLを設定

---

## ⚠️ リスク管理

### リスク1：画像URLの変更

**対策：** データ取得層で変換処理を実装済み

### リスク2：MicroCMS APIのダウン

**対策：** 自動フォールバック機能を実装

### リスク3：ビルド時間の増加

**対策：**
- MicroCMSのレスポンスが遅い場合、キャッシュ機構を追加
- Astroの`cacheTime`設定を活用

### リスク4：既存のスタイリング崩れ

**対策：**
- データ構造を変えずに変換層で吸収
- 全ページでビジュアルリグレッションテストを実施

---

## ✅ 成功の判断基準

- [ ] 全ページが正常に表示される
- [ ] 画像が正しく表示される
- [ ] パフォーマンスが低下していない（Lighthouse 90点以上維持）
- [ ] MicroCMS管理画面でコンテンツ更新が可能
- [ ] 更新後のビルドが正常に完了する
- [ ] ロールバック手順が確認済み

---

## 📚 参考リンク

- [MicroCMS公式ドキュメント](https://document.microcms.io/)
- [Astro + MicroCMS連携](https://docs.astro.build/ja/guides/cms/microcms/)
- [microcms-js-sdk](https://github.com/microcmsio/microcms-js-sdk)
