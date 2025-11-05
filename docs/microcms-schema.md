# MicroCMS APIスキーマ設計書

## 1. カテゴリーAPI（リスト形式）

**API ID**: `categories`
**エンドポイント**: `https://your-service.microcms.io/api/v1/categories`

### フィールド定義

| フィールドID | 表示名 | 種類 | 必須 | 説明 |
|------------|--------|------|------|------|
| categoryId | カテゴリーID | テキスト | ○ | eat, watch, play, make |
| title | タイトル | テキスト | ○ | 食べる、見る、遊ぶ、作る |
| titleAccent | タイトルアクセント | テキスト | ○ | 食、見、遊、作 |
| subtitle | サブタイトル | テキスト | ○ | − EAT − など |
| description | 説明 | テキストエリア | ○ | HTMLを含む説明文 |
| items | アイテム一覧 | 繰り返しフィールド | ○ | 以下の構造 |

### items（繰り返しフィールド）の構造

| フィールドID | 表示名 | 種類 | 必須 | 説明 |
|------------|--------|------|------|------|
| name | 名前 | テキスト | ○ | イベント/店舗名 |
| description | 説明 | テキストエリア | ○ | 短い説明文 |
| detailInfo | 詳細情報 | リッチエディタ | ○ | HTML形式の詳細説明 |
| mainImage | メイン画像 | 画像 | ○ | 一覧用の画像 |
| galleryImages | ギャラリー画像 | 画像（複数） | × | 詳細ページ用の画像配列 |
| location | 場所 | テキスト | ○ | 開催場所 |
| time | 時間 | テキストエリア | ○ | 開催時間（HTMLタグ対応） |
| snsUrl | SNS URL | テキスト（URL） | × | Instagram等のURL |
| price | 料金 | テキスト | ○ | 料金情報 |

## 2. スキーマの注意点

### 画像管理の変更点

**現在（JSON）:**
```json
"image": "もぐもぐルーク/img-1.jpg",
"images": ["もぐもぐルーク/img-1.jpg"]
```

**移行後（MicroCMS）:**
```json
"mainImage": {
  "url": "https://images.microcms-assets.io/...",
  "width": 1200,
  "height": 800
},
"galleryImages": [
  { "url": "https://...", "width": 1200, "height": 800 }
]
```

### HTMLコンテンツの扱い

- `description`: プレーンテキストまたは改行タグのみ（テキストエリア）
- `detailInfo`: リッチエディタでHTML管理
- `time`: テキストエリアでHTML（`<br>`タグ）対応

## 3. MicroCMS管理画面での設定手順

1. **新規API作成**
   - 「リスト形式」を選択
   - API ID: `categories`

2. **フィールド追加**
   - 上記の表に従ってフィールドを追加
   - 繰り返しフィールドは「カスタムフィールド」から作成

3. **API設定**
   - 公開設定：公開状態のみ取得
   - プレビュー機能：有効化（推奨）

## 4. データ移行時の対応表

| JSON | MicroCMS | 変換処理 |
|------|----------|----------|
| `eat.id` | `categoryId` | そのまま |
| `eat.title` | `title` | そのまま |
| `eat.items[].image` | `mainImage` | 画像アップロード＋URL変換 |
| `eat.items[].images` | `galleryImages` | 画像アップロード＋URL配列変換 |
| `eat.items[].detailInfo` | `detailInfo` | リッチエディタに貼り付け |

## 5. 移行スクリプトのヒント

画像パスの変換処理が必要：
```typescript
// Before
const imagePath = `/src/images/eat/${item.image}`;

// After (MicroCMS)
const imageUrl = item.mainImage.url;
```
