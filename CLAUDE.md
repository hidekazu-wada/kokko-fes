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

## 🚨 要件実装タスク（重要）

**このセクションは開発中のタスク管理用です。完了したタスクは削除してください。**

### 🔴 最高優先度（必須機能）

- [ ] **年度別アーカイブページ実装**
  - `/[year].astro` - 年度別トップページ（例：/2024）
  - `/[year]/[category].astro` - 年度別カテゴリーページ（例：/2024/miru）
  - `/[year]/[category]/[slug].astro` - 年度別コンテンツ詳細
  - `/[year]/news/index.astro` - 年度別お知らせ一覧
  - `/[year]/news/[slug].astro` - 年度別お知らせ詳細

- [x] **MicroCMS status型修正** ✅ 完了
  - EventConfig.status: string[] → string に変更
  - getCurrentEventConfig()の条件分岐修正
  - archive.astroのfilter条件修正

### 🟡 高優先度

- [ ] **アーカイブ通知バー実装**
  - 年度別ページに「これは○○年のアーカイブです」表示
  - トップに固定表示、目立つスタイル

- [ ] **archive.astro修正**
  - status配列対応 → 文字列対応
  - リンク先の実装確認とエラー修正

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