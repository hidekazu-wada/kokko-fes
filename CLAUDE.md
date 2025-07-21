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

## 年度別ページ管理システム

### 基本構造：現在年度と過去年度の住み分け

**ディレクトリ構造による管理方式**

```
src/pages/
├── index.astro                    # 現在年度のトップページ
├── event.astro                    # 現在年度のイベント情報
├── access.astro                   # 現在年度のアクセス情報
├── contact.astro                  # 現在年度のお問い合わせ
├── [category].astro               # 現在年度のカテゴリページ
├── news/                          # 現在年度のお知らせ
└── [year]/                        # 過去年度管理ディレクトリ
    ├── index.astro                # 年度別トップページ  
    ├── event.astro                # 年度別イベント情報
    ├── access.astro               # 年度別アクセス情報
    ├── contact.astro              # 年度別お問い合わせ
    ├── [category].astro           # 年度別カテゴリページ
    └── news/                      # 年度別お知らせ
```

### URL構造の設計思想

**現在年度（currentステータス）：**
- `/` → 現在開催中・準備中の祭り情報
- `/event`, `/access`, `/contact` → 現在年度の詳細情報
- `/miru`, `/taberu`, `/asobu` → 現在年度のカテゴリ

**過去年度（archivedステータス）：**
- `/2024/`, `/2025/` → 過去の開催記録
- `/2024/event`, `/2024/access` → 過去年度の詳細情報（記録保存用）
- `/2024/miru`, `/2024/taberu` → 過去年度のカテゴリ（記録保存用）

### 年度別表示カスタマイズの実装方法

#### 1. 条件分岐による年度別表示

```astro
---
// 年度情報を取得
const { year } = Astro.props; // [year]ディレクトリの場合
// または
const eventConfig = await getCurrentEventConfig(); // 現在年度の場合
const currentYear = eventConfig?.year;
---

<!-- 年度別デザイン適用例 -->
<div class={`event-header ${year === '2024' ? 'retro-theme' : year === '2025' ? 'modern-theme' : 'default-theme'}`}>
  {year === '2024' ? (
    <div class="retro-design">
      <h1>懐かしの2024年コッコ祭り</h1>
      <p class="retro-subtitle">思い出に残る一日でした</p>
    </div>
  ) : year === '2025' ? (
    <div class="modern-design">
      <h1>未来を見つめる2025年</h1>
      <p class="modern-subtitle">新時代のコッコ祭り</p>
    </div>
  ) : (
    <div class="standard-design">
      <h1>{year}年コッコ祭り</h1>
    </div>
  )}
</div>
```

#### 2. 年度別スタイル定義

```scss
// 年度別カラーテーマ
.event-header {
  &.retro-theme {
    background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%);
    
    .retro-subtitle {
      font-family: serif;
      font-style: italic;
    }
  }
  
  &.modern-theme {
    background: linear-gradient(135deg, #2a9d8f 0%, #264653 100%);
    
    .modern-subtitle {
      font-weight: 300;
      letter-spacing: 0.05em;
    }
  }
  
  &.default-theme {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
```

#### 3. 年度別コンテンツ表示制御

```astro
---
// 年度固有の情報表示
const showSpecialContent = (year: string) => {
  const specialYears = {
    '2024': { 
      message: '初回開催記念', 
      badge: 'FIRST',
      color: '#e76f51' 
    },
    '2025': { 
      message: '5周年記念', 
      badge: '5th ANNIVERSARY',
      color: '#2a9d8f' 
    }
  };
  
  return specialYears[year] || null;
};

const specialInfo = showSpecialContent(year);
---

{specialInfo && (
  <div class="special-banner" style={`border-color: ${specialInfo.color}`}>
    <span class="special-badge">{specialInfo.badge}</span>
    <p class="special-message">{specialInfo.message}</p>
  </div>
)}
```

#### 4. 機能の有効/無効制御

```astro
---
// 年度別機能制御
const getYearFeatures = (year: string) => {
  const features = {
    '2024': {
      hasVirtualTour: false,
      hasLiveStreaming: false,
      hasQRCodeMenu: true
    },
    '2025': {
      hasVirtualTour: true,
      hasLiveStreaming: true,
      hasQRCodeMenu: true
    }
  };
  
  return features[year] || {
    hasVirtualTour: false,
    hasLiveStreaming: false,
    hasQRCodeMenu: false
  };
};

const features = getYearFeatures(year);
---

<!-- 機能別表示制御 -->
{features.hasVirtualTour && (
  <section class="virtual-tour">
    <h3>バーチャル会場ツアー</h3>
    <!-- VRツアーコンテンツ -->
  </section>
)}

{features.hasLiveStreaming && (
  <section class="live-streaming">
    <h3>ライブ配信</h3>
    <!-- ライブ配信コンテンツ -->
  </section>
)}
```

### 年度管理のベストプラクティス

#### 1. 過去年度の情報保護
- 過去年度ページは「記録保存」として位置づけ
- 現在情報への誘導リンクを必ず含める
- 「この情報は○年開催時のものです」注意書きを表示

#### 2. MicroCMSデータの年度管理
```typescript
// API呼び出し時の年度指定
const getCurrentData = () => getCurrentEventConfig(); // 現在年度
const getHistoricalData = (year: string) => getEventConfigByYear(year); // 指定年度
```

#### 3. パンくずナビゲーションの統一
```astro
<!-- 現在年度 -->
<nav class="breadcrumb">
  <a href="/">ホーム</a> > <span>イベント情報</span>
</nav>

<!-- 過去年度 -->
<nav class="breadcrumb">
  <a href="/">ホーム</a> > 
  <a href="/archive">過去の開催</a> > 
  <a href="/{year}">{year}年</a> > 
  <span>イベント情報</span>
</nav>
```

#### 4. 年度切り替え時の運用フロー
1. 新年度のevent-configでstatusを'current'に設定
2. 前年度のevent-configでstatusを'archived'に変更
3. 必要に応じて年度別カスタマイズを`/[year]/`ディレクトリに実装
4. 現在年度用ページ（`/pages/`直下）は自動的に新年度データを参照

### MicroCMS側で行う年度管理操作

#### 1. 新年度開始時の作業

**event-config（イベント設定）の更新**
```json
// 新年度の設定を作成（例：2026年）
{
  "year": "2026",
  "status": "current",  // 現在年度として設定
  "theme": "2026年のテーマ",
  "dates": [...],
  "categories": [...]
}

// 前年度の設定を更新（例：2025年）
{
  "year": "2025", 
  "status": "archived",  // アーカイブ年度に変更
  "theme": "2025年のテーマ",
  "dates": [...],
  "categories": [...]
}
```

**新年度のコンテンツ作成**
- `contents`：新年度のカテゴリ別コンテンツを作成
- `news`：新年度のお知らせを作成
- `event-info`：新年度のイベント情報を作成（必要に応じて）
- `access-info`：新年度のアクセス情報を作成（必要に応じて）
- `contact-info`：新年度のお問い合わせ情報を作成（必要に応じて）

#### 2. 過去年度データの修正・追加

**既存年度の情報を修正する場合**
- 対象年度の`year`フィールドで絞り込み
- 該当する年度のデータのみを編集
- `status`は`archived`のまま維持

**過去年度に不足情報を追加する場合**
```json
// 例：2024年にイベント情報が無かった場合の追加
{
  "title": "2024年限定イベント",
  "description": "...",
  "year": "2024",  // 追加対象の年度を指定
  "schedule": "...",
  "venue": "..."
}
```

#### 3. 年度別APIエンドポイント管理

**各APIエンドポイントでの年度管理**

**contents（コンテンツ）**
- `year`フィールドで年度を指定
- `categoryId`で種別を指定
- 例：`year[equals]2024[and]categoryId[equals]miru`

**news（お知らせ）**
- `year`フィールドで年度を指定
- 例：`year[equals]2024`

**event-info（イベント情報）**
- `year`フィールドで年度を指定
- リスト形式：複数のイベントを年度別に管理

**access-info（アクセス情報）**
- `year`フィールドで年度を指定
- オブジェクト形式：年度ごとに1つの会場情報

**contact-info（お問い合わせ情報）**
- `year`フィールドで年度を指定
- オブジェクト形式：年度ごとに1つのお問い合わせ先

#### 4. データ整合性チェック

**確認すべき項目**
- [ ] `event-config`で`status: "current"`が1つだけ存在する
- [ ] 過去年度は全て`status: "archived"`になっている
- [ ] 各年度のコンテンツに`year`フィールドが正しく設定されている
- [ ] カテゴリIDと年度の組み合わせが適切に設定されている

**データの確認方法**
```
フィルター検索例：
- 現在年度確認：status[equals]current
- 特定年度確認：year[equals]2024
- 年度別コンテンツ確認：year[equals]2024[and]categoryId[equals]miru
```

#### 5. 年度アーカイブ時の注意事項

**アーカイブ前に確認**
- 該当年度の全てのコンテンツが完成している
- 画像やファイルが正しくアップロードされている
- リンク切れや誤字脱字がない

**アーカイブ後の運用**
- 過去年度のデータは原則として修正しない
- 重大な誤りがある場合のみ例外的に修正
- 修正時は影響範囲を慎重に確認

#### 6. 年度データの削除について

**削除の判断基準**
- 法的保存義務の確認
- 利用者からの参照頻度
- サーバー容量の制限

**削除時の手順**
1. 関連する全てのAPIエンドポイントからデータを削除
2. 画像やファイルも併せて削除
3. サイト側の`getStaticPaths()`から該当年度を除外

**例：古い年度の完全削除**
```typescript
// [year]ページのgetStaticPaths()から除外
export async function getStaticPaths() {
  // const years = ['2022', '2023', '2024', '2025']; // 2022年を削除前
  const years = ['2023', '2024', '2025']; // 2022年を削除後
  
  return years.map(year => ({
    params: { year },
    props: { year }
  }));
}
```

この方式により、年度ごとの情報管理と表示カスタマイズが体系的に行えます。

## 宿泊予約サイトリンク管理

### 概要
「泊まる」カテゴリーは外部の宿泊予約サイト（じゃらん、楽天トラベルなど）へのリンクとしてハードコード実装されています。年度や地域によってリンク先を変更したい場合の編集方法を記録します。

### 編集対象ファイル

**1. 現在年のカテゴリーページ**
- ファイル: `src/pages/[category].astro`
- 編集箇所: 行61-88（宿泊予約サイトのリンク部分）

**2. 過去年のカテゴリーページ**  
- ファイル: `src/pages/[year]/[category].astro`
- 編集箇所: 行90-117（宿泊予約サイトのリンク部分）

### 年度別リンク変更の実装方法

#### 過去年用ファイル (`src/pages/[year]/[category].astro`) での条件分岐

```astro
<div class="booking-sites">
  {eventConfig.year === '2024' ? (
    <>
      <!-- 2024年の宿泊予約サイト -->
      <a href="https://www.jalan.net/" class="booking-card jalan" target="_blank" rel="noopener noreferrer">
        <div class="booking-logo">
          <span class="booking-name">じゃらん</span>
        </div>
        <div class="booking-description">
          豊富な宿泊プランとお得な料金で予約
        </div>
        <div class="external-link-indicator">
          外部サイト 🔗
        </div>
      </a>
      <a href="https://travel.rakuten.co.jp/" class="booking-card rakuten" target="_blank" rel="noopener noreferrer">
        <div class="booking-logo">
          <span class="booking-name">楽天トラベル</span>
        </div>
        <div class="booking-description">
          楽天ポイントが貯まる・使える
        </div>
        <div class="external-link-indicator">
          外部サイト 🔗
        </div>
      </a>
    </>
  ) : eventConfig.year === '2025' ? (
    <>
      <!-- 2025年の宿泊予約サイト（例：別のサイト） -->
      <a href="https://www.booking.com/" class="booking-card booking" target="_blank" rel="noopener noreferrer">
        <div class="booking-logo">
          <span class="booking-name">Booking.com</span>
        </div>
        <div class="booking-description">
          世界最大の宿泊予約サイト
        </div>
        <div class="external-link-indicator">
          外部サイト 🔗
        </div>
      </a>
      <a href="https://www.agoda.com/" class="booking-card agoda" target="_blank" rel="noopener noreferrer">
        <div class="booking-logo">
          <span class="booking-name">Agoda</span>
        </div>
        <div class="booking-description">
          アジア圏の宿泊施設に強い
        </div>
        <div class="external-link-indicator">
          外部サイト 🔗
        </div>
      </a>
    </>
  ) : (
    <>
      <!-- デフォルト（その他の年度） -->
      <a href="https://www.jalan.net/" class="booking-card jalan" target="_blank" rel="noopener noreferrer">
        <!-- デフォルトのじゃらんリンク -->
      </a>
      <a href="https://travel.rakuten.co.jp/" class="booking-card rakuten" target="_blank" rel="noopener noreferrer">
        <!-- デフォルトの楽天トラベルリンク -->
      </a>
    </>
  )}
</div>
```

#### 現在年用ファイル (`src/pages/[category].astro`) での条件分岐

```astro
<div class="booking-sites">
  {year === '2024' ? (
    <!-- 2024年の宿泊予約サイト -->
  ) : year === '2025' ? (
    <!-- 2025年の宿泊予約サイト -->
  ) : (
    <!-- デフォルト -->
  )}
</div>
```

### スタイル追加が必要な場合

新しい宿泊予約サイトを追加する場合は、対応するCSSクラスを追加してください：

```scss
.booking-card {
  // 既存のスタイル

  &.booking {
    border-color: #003580;
    
    &:hover {
      border-color: #002654;
    }
  }

  &.agoda {
    border-color: #FF5722;
    
    &:hover {
      border-color: #E64A19;
    }
  }
}

.booking-name {
  // 既存のスタイル
  
  .booking & {
    color: #003580;
  }
  
  .agoda & {
    color: #FF5722;
  }
}
```

### 変更作業のルール

1. **現在公開年の直接編集**
   - 現在公開中の年度（currentステータス）については、直接編集が可能
   - `src/pages/[category].astro` ファイルを編集

2. **過去年度の条件分岐**
   - 複数年度を管理する場合は条件分岐を使用
   - `src/pages/[year]/[category].astro` ファイルで `eventConfig.year` による分岐

3. **両ファイルの同期**
   - 現在年と過去年の両方のファイルを編集する必要あり
   - 一貫性を保つため、同じロジックを両ファイルに適用

4. **新しいサイト追加時の手順**
   - HTMLマークアップを追加
   - 対応するCSSスタイルを追加
   - ブランドカラーとホバー効果を設定

### 注意事項

- target="_blank" と rel="noopener noreferrer" を必ず設定
- 外部サイトであることを明示する「外部サイト 🔗」表示を維持
- レスポンシブ対応（spx, tpx, ppx関数）を使用
- 新しいサイトのブランドガイドラインに従った色設定

## 🚨 現在のサイト状況とタスク管理

**最終更新: 2025年7月21日**

### ✅ 実装完了済み

**コア機能**
- [x] **基本ページ構造**
  - トップページ（index.astro）
  - カテゴリページ（[category].astro）
  - コンテンツ詳細ページ（[category]/[slug].astro）
  - お知らせページ（news/index.astro, news/[slug].astro）
  - アーカイブページ（archive.astro）

- [x] **年度別管理ページ**
  - 年度別トップ（[year].astro）
  - 年度別カテゴリ（[year]/[category].astro）
  - 年度別コンテンツ詳細（[year]/[category]/[slug].astro）
  - 年度別お知らせ（[year]/news/index.astro, [year]/news/[slug].astro）

- [x] **新規追加ページ（現在年度）**
  - イベント情報ページ（event.astro）
  - アクセスページ（access.astro）
  - お問い合わせページ（contact.astro）

- [x] **新規追加ページ（年度別）**
  - 年度別イベント情報（[year]/event.astro）
  - 年度別アクセス（[year]/access.astro）
  - 年度別お問い合わせ（[year]/contact.astro）

- [x] **UI/UXコンポーネント**
  - グローバルナビゲーション（GlobalNavigation.astro）
  - レスポンシブ対応（モバイル・タブレット・デスクトップ）
  - パンくずナビゲーション
  - 年度識別とナビゲーション

- [x] **MicroCMS統合**
  - API関数ライブラリ（microcms.ts）
  - TypeScript型定義（types/microcms.ts）
  - 年度別データ取得機能
  - エラーハンドリング

**ビルド状況**
- ✅ 正常ビルド完了（37ページ生成）
- ✅ 全てのルートが正常に生成
- ⚠️ SCSS deprecation warnings（動作に影響なし）

### 🔵 低優先度・将来改善

- [ ] **技術的改善**
  - SCSS @import → @use への移行（deprecation warning解消）
  - 画像最適化の追加
  - パフォーマンス最適化

- [ ] **SEO最適化**
  - メタタグ設定の詳細化
  - 構造化データ実装
  - サイトマップ生成

- [ ] **アクセシビリティ改善**
  - ARIA属性の追加
  - キーボードナビゲーション
  - カラーコントラスト最適化

### 🏗️ サイト構成状況

**URL構造（実装済み）**
```
/ (現在年度トップ)
├── /miru, /taberu, /asobu, /tsukuru, /tomaru (現在年度カテゴリ)
├── /event (現在年度イベント情報)
├── /access (現在年度アクセス)
├── /contact (現在年度お問い合わせ)
├── /news (現在年度お知らせ)
├── /archive (過去開催一覧)
└── /[year]/ (年度別)
    ├── /[year]/miru, /[year]/taberu など (年度別カテゴリ)
    ├── /[year]/event (年度別イベント情報)
    ├── /[year]/access (年度別アクセス)
    ├── /[year]/contact (年度別お問い合わせ)
    └── /[year]/news (年度別お知らせ)
```

**MicroCMS統合状況**
- ✅ event-config（イベント設定）
- ✅ contents（コンテンツ）
- ✅ news（お知らせ）
- 🆕 event-info（イベント情報）- 型定義・API関数実装済み
- 🆕 access-info（アクセス情報）- 型定義・API関数実装済み
- 🆕 contact-info（お問い合わせ情報）- 型定義・API関数実装済み

### 📝 運用ガイド

**現在の運用状況**
- 2025年が現在年度（status: current）
- 2024年がアーカイブ年度（status: archived）
- 「作る」カテゴリのデモコンテンツ実装済み

**今後の運用で必要な作業**
1. **新規APIエンドポイント作成**（必要に応じて）
   - event-info
   - access-info  
   - contact-info

2. **年度切り替え時**（年度別ページ管理システム参照）
   - event-configのstatus更新
   - 新年度コンテンツ作成

**注意**: 実装済みタスクは上記✅完了済みセクションで管理。新規タスクのみこのセクションに追加してください。