# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **kokko-fes (コッコ祭り) project** built with Astro 5.7.12, featuring a responsive SCSS architecture with mobile-first design and Japanese typography support. The project is a festival website with dynamic content management through MicroCMS, supporting multiple years and categories of events.

## Development Commands

```bash
# Navigate to the astro directory first
cd astro

# Install dependencies
npm install

# Start development server (runs on http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Important**: Always run commands from the `astro/` directory, as the main package.json is located there.

## Architecture

### Project Structure
```
astro/
├── src/
│   ├── layouts/
│   │   └── MySiteLayout.astro        # Base layout with Google Fonts
│   ├── pages/
│   │   ├── index.astro               # トップページ
│   │   ├── [category].astro          # カテゴリー一覧ページ（見る・食べる・遊ぶ）
│   │   ├── [category]/
│   │   │   └── [slug].astro          # コンテンツ詳細ページ
│   │   ├── archive.astro             # 過去の開催アーカイブ
│   │   ├── news/
│   │   │   ├── index.astro           # お知らせ一覧
│   │   │   └── [slug].astro          # お知らせ詳細
│   │   └── test.astro                # テスト用ページ
│   ├── lib/
│   │   └── microcms.ts               # MicroCMS API連携
│   ├── types/
│   │   └── microcms.ts               # TypeScript型定義
│   └── styles/                       # SCSS アーキテクチャ
│       ├── variables.scss
│       ├── functions.scss
│       ├── mixins.scss
│       └── global.scss
└── .env.example                      # 環境変数テンプレート
```

### Site Structure & Routing

**URL構造：**
- `/` - トップページ（現在の年度の祭り情報）
- `/miru`, `/taberu`, `/asobu` - カテゴリー一覧ページ
- `/miru/[slug]`, `/taberu/[slug]`, `/asobu/[slug]` - コンテンツ詳細ページ
- `/news` - お知らせ一覧
- `/news/[slug]` - お知らせ詳細
- `/archive` - 過去の開催アーカイブ

**ページ構成：**
1. **トップページ** - 現在年度の祭り概要、カテゴリーナビ、お知らせ・アーカイブリンク
2. **カテゴリー一覧** - 見る・食べる・遊ぶの各カテゴリーのコンテンツ一覧
3. **コンテンツ詳細** - 個別のイベント・店舗・アクティビティの詳細情報
4. **お知らせ** - ニュース・告知の一覧と詳細
5. **アーカイブ** - 過去の開催年度と実績

### SCSS Architecture

The project uses a sophisticated 4-file SCSS architecture:

1. **variables.scss** - Viewport and breakpoint definitions
   - `$viewport_pc: 2560` - PC viewport baseline
   - `$viewport_tab: 2048` - Tablet viewport baseline  
   - `$viewport_sp: 720` - Mobile viewport baseline
   - `$breakpoint-tablet-up: 744px` - Tablet breakpoint
   - `$breakpoint-desktop-up: 1024px` - Desktop breakpoint

2. **functions.scss** - Responsive unit conversion functions
   - `ppx()` - Convert px to vw for PC viewport
   - `tpx()` - Convert px to vw for tablet viewport
   - `spx()` - Convert px to vw for mobile viewport

3. **mixins.scss** - Media queries and typography mixins
   - `@mixin tablet-up` - Mobile-first tablet styles
   - `@mixin desktop-up` - Mobile-first desktop styles
   - Font mixins for Zen Kaku Gothic New

4. **global.scss** - Global styles with destyle.css reset

### Typography System
- Primary: Zen Kaku Gothic New (Japanese web font)
- Fallback fonts: Didot, Noto Serif JP
- Google Fonts preloaded in MySiteLayout.astro:15-19

## Development Guidelines

### Responsive Design Pattern
Always use mobile-first approach with the established viewport conversion functions:

```scss
.element {
    // Mobile default (720px viewport)
    width: spx(300px);
    
    @include tablet-up {
        width: tpx(500px);  // 2048px viewport
    }
    
    @include desktop-up {
        width: ppx(800px);  // 2560px viewport
    }
}
```

### SCSS Import Order
When creating new stylesheets, maintain this import order:
1. destyle.css
2. functions.scss  
3. mixins.scss
4. Custom styles

## MicroCMS Integration

### Environment Setup
Create `.env` file in the `astro/` directory with:
```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

### API Structure
**Endpoints:**
- `event-config` - イベント設定（年度、テーマ、開催日、カテゴリー）
- `contents` - コンテンツ（見る・食べる・遊ぶの各種イベント情報）
- `news` - お知らせ・ニュース

**Key Functions:**
- `getCurrentEventConfig()` - 現在アクティブな年度設定を取得
- `getContents(year)` - 指定年度のコンテンツを取得
- `getNews(year)` - 指定年度のお知らせを取得

### Data Structure
```typescript
// イベント設定
interface EventConfig {
  year: string;
  status: string[];          // ['current'] で現在年度を指定
  theme: string;             // 祭りテーマ
  dates: EventDate[];        // 開催日程
  categories: Category[];    // カテゴリー定義
}

// カテゴリー
interface Category {
  categoryId: string;        // 'miru', 'taberu', 'asobu'
  name: string;              // '見る', '食べる', '遊ぶ'
  slug: string;              // URL用slug
  order: number;             // 表示順
}

// コンテンツ
interface Content {
  title: string;
  year: string;
  categoryId: string;        // カテゴリーとの紐付け
  description: string;
  images: MicroCMSImage[];
  venue?: string;            // 会場
  time?: string;             // 時間
  slug: string;              // URL用slug
}
```

## Development Notes

### Astro Specific
- **Static Site Generation**: `getStaticPaths()` でビルド時にページを生成
- **Dynamic Routing**: `[category].astro` と `[category]/[slug].astro` で動的URL対応
- **TypeScript**: 全ファイルでTypeScript型安全性を確保

### Performance Considerations
- **Image Optimization**: MicroCMSの画像を適切なサイズで表示
- **SEO**: 各ページに適切なメタデータとパンくずナビゲーション
- **Mobile-First**: レスポンシブ設計でモバイル体験を優先

### Content Management
- **Year-based Organization**: 年度ごとにコンテンツを管理
- **Category System**: 見る・食べる・遊ぶの3カテゴリー構造
- **Status Management**: current/archive でアクティブ年度を制御

### Working Directory
Always change to the `astro/` directory before running npm commands, as the main package.json is located there.

## Troubleshooting

### Common Issues
1. **Server Connection Issues**: npm run dev のタイムアウト対策として、バックグラウンド実行または直接ターミナルで実行
2. **Environment Variables**: .env ファイルの設定確認（MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY）
3. **Build Errors**: MicroCMS接続エラー時は型定義とAPI関数を確認

### Development Workflow
1. MicroCMSでコンテンツ作成・編集
2. ローカル開発サーバーで確認
3. 型安全性とレスポンシブデザインを確認
4. 本番ビルドでエラーがないことを確認

## 年度別カスタマイズ実装方針

### 基本原則: 責任分離アーキテクチャ

**CMS管理領域（データ層）**
- 毎年入力が必要な最低限のデータのみ
- テキスト、画像、お知らせ、カテゴリー、コンテンツ
- 複雑な設定項目は追加しない

**ハードコード領域（プレゼンテーション層）**
- 年度固有のデザイン・機能
- 特別なセクション・アニメーション
- インタラクティブ要素

### 実装パターン

#### 1. 条件分岐による年度別コンポーネント呼び出し

```astro
---
// 年度別特別コンポーネントの動的インポート
const getYearlyComponent = async (year: string) => {
  try {
    return await import(`../components/yearly/${year}/Special.astro`);
  } catch {
    return null; // 特別コンポーネントがない年度
  }
};

const SpecialComponent = await getYearlyComponent(eventConfig.year);
---

<!-- 共通部分：CMSデータ -->
<Hero config={eventConfig} />
<Categories categories={eventConfig.categories} />

<!-- 年度特有部分：ハードコード -->
{SpecialComponent && <SpecialComponent.default config={eventConfig} />}

<!-- 共通部分：CMSデータ -->
<Contents contents={eventConfig.contents} />
```

#### 2. ディレクトリ構造規則

```
src/
├── components/
│   ├── shared/           # 共通コンポーネント
│   │   ├── Hero.astro
│   │   └── Categories.astro
│   ├── yearly/           # 年度別コンポーネント
│   │   ├── 2024/
│   │   │   └── Special.astro
│   │   ├── 2025/
│   │   │   ├── AnniversarySection.astro
│   │   │   └── InteractiveMap.astro
│   │   └── 2026/
│   │       └── Special.astro
│   └── design-system/    # デザインシステム
│       ├── Section.astro
│       └── Heading.astro
```

#### 3. 命名規則とベストプラクティス

**ファイル命名：**
- `Special.astro` - メインの年度別セクション
- `[機能名]Section.astro` - 機能別セクション（例：AnniversarySection.astro）
- `Custom[コンポーネント名].astro` - 既存コンポーネントの年度別版

**コンポーネント設計：**
```astro
---
// 年度別コンポーネントの共通インターフェース
interface YearlyComponentProps {
  year: string;
  theme: string;
  dates: EventDate[];
  categories: Category[];
}

export default function Special2025(props: YearlyComponentProps) {
  // 年度固有のロジック
}
---

<!-- デザインシステムを活用 -->
<DesignSystem.Section variant="special">
  <DesignSystem.Heading level={2}>
    {props.theme}
  </DesignSystem.Heading>
  <!-- 年度固有の内容 -->
</DesignSystem.Section>
```

### 注意事項

1. **一貫性の担保**
   - 共通デザインシステムを必ず使用
   - ブランドガイドラインを遵守
   - 既存のSCSS関数（spx, tpx, ppx）を活用

2. **保守性の確保**
   - 過去年度のコンポーネントは原則として凍結
   - 重大な不具合のみ修正対象
   - 新年度の要件は新しいコンポーネントで対応

3. **CMSの複雑化回避**
   - 新しい設定項目をMicroCMSに追加しない
   - 「便利だから」ではなく「必要だから」で判断
   - 運用者の負荷を増やさない

### 実装時の判断基準

**年度別コンポーネントを作成する場合：**
- ✅ 特定年度のみの特別企画（例：周年記念）
- ✅ 大幅なデザイン変更
- ✅ 新しいインタラクティブ機能

**共通コンポーネントを修正する場合：**
- ✅ 全年度に影響する改善
- ✅ バグ修正
- ✅ パフォーマンス向上

この方針により、「運用の簡単さ」と「デザインの自由度」を両立し、長期的な保守性を確保できます。

## 🚨 要件実装タスク（重要）

**このセクションは開発中のタスク管理用です。完了したタスクは削除してください。**

### 🟢 中優先度

- [ ] **「泊まる」カテゴリー外部リンク対応**
  - じゃらん、楽天トラベルへの外部リンク機能
  - 外部リンクであることの明示

- [ ] **基本ページ追加**
  - イベント情報ページ
  - アクセスページ
  - お問い合わせページ

### 🔵 低優先度

- [ ] **SEO最適化**
  - メタタグ設定
  - 構造化データ実装

**注意**: 上記タスクは要件との差分分析結果です。作業完了後は該当項目を削除してください。