# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

これはkuwarubi.hamayouresort.com用のAstro プロジェクトです。観光・リゾート業界向けのWebサイトを開発しています。

## 技術スタック

- **フレームワーク**: Astro v5.12.8
- **言語**: TypeScript（tsconfig.json設定済み）
- **スタイル**: SCSS（sass v1.89.2）
- **パッケージマネージャー**: npm
- **開発環境**: Node.js

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（localhost:4321）
npm run dev

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview

# Astro CLIコマンドの実行
npm run astro [command]

# Astro CLIのヘルプ
npm run astro -- --help
```

## プロジェクト構造

```
/
├── public/          # 静的アセット（画像、ファビコンなど）
├── src/
│   ├── components/  # 再利用可能なコンポーネント
│   │   └── common/  # 全ページ共通コンポーネント
│   │       ├── Breadcrumb.astro    # パンくずリスト
│   │       ├── Footer.astro        # フッター
│   │       ├── Head.astro          # HTMLヘッド
│   │       ├── Loading.astro       # ローディング画面
│   │       ├── Menu.astro          # メニュー
│   │       ├── MenuToggle.astro    # メニュートグル
│   │       ├── PageBottomWave.astro # ページ下部の波形
│   │       └── PageHeader.astro    # ページヘッダー
│   ├── pages/       # ページコンポーネント（ファイルベースルーティング）
│   │   ├── index.astro         # トップページ
│   │   ├── inquiry.astro       # お問い合わせページ
│   │   ├── [category].astro    # カテゴリページ（動的ルート）
│   │   └── 404.astro          # 404エラーページ
│   ├── data/        # 静的データファイル
│   │   └── categories.json # カテゴリデータ
│   ├── layouts/     # レイアウトコンポーネント
│   │   └── PageLayout.astro # 基本ページレイアウト
│   └── styles/      # SCSSファイル
│       ├── reset.scss      # リセットCSS
│       ├── _variables.scss # 変数・定数
│       ├── _functions.scss # カスタム関数
│       ├── _mixins.scss    # ミックスイン
│       └── main.scss       # メインSCSSファイル
├── astro.config.mjs # Astro設定ファイル
├── package.json     # プロジェクト設定と依存関係
└── tsconfig.json    # TypeScript設定
```

## アーキテクチャ

- **ファイルベースルーティング**: `src/pages/`内の`.astro`または`.md`ファイルがページルートになります
- **コンポーネント**: `src/components/`にAstro/React/Vue/Svelte/Preactコンポーネントを配置
- **静的アセット**: `public/`ディレクトリ内のファイルは直接提供されます
- **Islands Architecture**: 必要な部分のみでJavaScriptを動作させる部分的ハイドレーション

## SCSS使用方法

### コンポーネント内でのSCSS使用
```astro
<style lang="scss">
$primary-color: #ff6b35;

.example {
  color: $primary-color;
  
  &:hover {
    color: darken($primary-color, 20%);
  }
}
</style>
```

### 外部SCSSファイルのインポート
```astro
---
// グローバルスタイル
import '../styles/main.scss';
---
```

### コンポーネント内でのmixin/function使用
```astro
<style lang="scss">
// 必要なファイルを個別にインポート
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.example {
  font-size: spx(16);
  @include tablet-up {
    font-size: tpx(20);
  }
  @include desktop-up {
    font-size: ppx(24);
  }
}
</style>
```

### SCSSファイル構造
- `main.scss`: すべてのSCSSをまとめるメインファイル
- `reset.scss`: リセットCSS（destyle.cssベース）
- `_variables.scss`: プロジェクト全体で使用する変数・定数
- `_functions.scss`: px→vw変換用カスタム関数
- `_mixins.scss`: レスポンシブ・フォント用ミックスイン

### 定義済み変数・関数・ミックスイン

**変数（_variables.scss）:**
```scss
$viewport_pc: 2560;    // PC基準ビューポート
$viewport_tab: 2048;   // タブレット基準ビューポート  
$viewport_sp: 720;     // スマホ基準ビューポート

$breakpoint-tablet-up: 744px;   // タブレット以上
$breakpoint-desktop-up: 1024px; // PC以上

$font-didot: "Didot", serif;
$font-noto-serif-jp: "Noto Serif JP", serif;
```

**関数（_functions.scss）:**
```scss
ppx($num_pc)   // PC用px→vw変換
tpx($num_tab)  // タブレット用px→vw変換
spx($num_sp)   // スマホ用px→vw変換
```

**ミックスイン（_mixins.scss）:**
```scss
@mixin tablet-up { ... }     // タブレット以上のメディアクエリ
@mixin desktop-up { ... }    // PC以上のメディアクエリ
@mixin hover { ... }         // ホバー可能デバイス用
@mixin zen-kaku-gothic-new-regular { ... }  // フォント設定
@mixin zen-kaku-gothic-new-bold { ... }     // フォント設定（太字）
```

### インポート順序（重要）
1. 変数（最初に読み込む）
2. 関数とミックスイン（変数の後に読み込む）
3. リセットCSS
4. その他のスタイル

### 使用例
```scss
// レスポンシブなフォントサイズ
.title {
  font-size: spx(20);        // スマホ: 20px相当
  @include tablet-up {
    font-size: tpx(24);      // タブレット: 24px相当
  }
  @include desktop-up {
    font-size: ppx(28);      // PC: 28px相当
  }
}

// フォントミックスイン使用
.heading {
  @include zen-kaku-gothic-new-bold;
}
```

### 注意事項
- コンポーネント内で外部のmixin/functionを使用する場合は、個別にインポートが必要
- インポート順序を守らないと変数が未定義エラーになる可能性
- `@import`は非推奨警告が出るが、現在は正常に動作

## 開発のヒント

- 新しいフレームワークの追加: `astro add [framework]`コマンドを使用
- TypeScriptサポートは標準で含まれています
- 開発サーバーはホットリロード機能付きです

## 業界コンテキスト

- 観光・ホスピタリティ業界向けサイトとして、アクセシビリティと多言語対応を考慮
- パフォーマンス重視（Astroの特性を活用）
- SEO最適化が重要

## 開発フロー・ワークフロー

### Git workflow
- **メインブランチ**: `main`
- **ブランチ命名規則**: `feature/機能名` または `fix/修正内容`
- **コミットメッセージ**: 日本語でわかりやすく記述
- デプロイは基本的にmainブランチから自動デプロイ（Vercel連携）

### 作業の進め方
1. 新機能・修正時は必ずブランチを切って作業
2. コミット前に `npm run dev` でローカル確認
3. プッシュ前に以下の確認項目をチェック：
   - レスポンシブ対応（SP/タブレット/PC）
   - 画像の表示確認
   - SCSSのコンパイルエラーがないか
   - TypeScriptエラーがないか

## 開発ルール・ベストプラクティス

### ファイル命名規則
- **コンポーネント**: PascalCase（例: `Hero.astro`, `MenuToggle.astro`）
- **ページファイル**: kebab-case（例: `contact.astro`, `about-us.astro`）
- **SCSSファイル**: アンダースコア付きkebab-case（例: `_variables.scss`, `_mixins.scss`）
- **画像ファイル**: kebab-case + 用途別ディレクトリ分け

### ディレクトリ構成ルール
```
src/
├── components/
│   ├── common/     # 全ページ共通コンポーネント（実装済み）
│   │   ├── Breadcrumb.astro    # パンくずリスト（再利用可能）
│   │   ├── Footer.astro        # フッター
│   │   ├── Head.astro          # HTMLヘッド
│   │   ├── Loading.astro       # ローディング画面
│   │   ├── Menu.astro          # メニュー
│   │   ├── MenuToggle.astro    # メニュートグル
│   │   ├── PageBottomWave.astro # ページ下部の波形
│   │   └── PageHeader.astro    # ページヘッダー
│   ├── top/        # トップページ専用コンポーネント
│   └── [page]/     # 各ページ専用コンポーネント（将来の拡張用）
├── data/           # 静的データ・設定ファイル（実装済み）
│   └── categories.json # カテゴリページ用データ
├── layouts/        # レイアウトコンポーネント（実装済み）
│   └── PageLayout.astro # 基本ページレイアウト
├── pages/          # Astroページファイル（実装済み）
│   ├── index.astro         # トップページ
│   ├── inquiry.astro       # お問い合わせページ
│   ├── [category].astro    # カテゴリページ（動的ルート）
│   └── 404.astro          # 404エラーページ
├── styles/         # SCSS関連ファイル
├── images/         # 画像アセット（用途別にサブディレクトリ作成推奨）
└── types/          # TypeScript型定義ファイル
```

### コンポーネント開発ガイドライン

#### 新しいコンポーネント作成時
1. **既存コンポーネントの参考**: 類似のコンポーネントを確認し、同じ構造・命名規則を踏襲
2. **TypeScriptインターフェース**: プロパティがある場合は必ず型定義を記述
3. **レスポンシブ対応**: 必ずSP/タブレット/PC全てに対応
4. **SCSS記述**: コンポーネント内でのSCSS使用時は以下の順序でインポート：
   ```scss
   @import '../styles/variables';
   @import '../styles/functions';
   @import '../styles/mixins';
   ```

#### スタイリングのベストプラクティス
- **関数使用**: px値は必ず `spx()`, `tpx()`, `ppx()` 関数を使用
- **メディアクエリ**: `@include tablet-up`, `@include desktop-up` を活用
- **カラー変数**: 色は `$base_1`, `$logo_color_1` などの変数を使用
- **フォント**: フォントは `@include zen-kaku-gothic-new-regular` ミックスイン使用推奨

### コードスタイル・フォーマット
- **Prettier**: `.prettierrc`設定に従いAstro用フォーマットを使用
- **インデント**: 2スペース
- **HTML属性**: ダブルクォート使用
- **SCSS**: BEM記法推奨、ネストは3階層まで

### パフォーマンス考慮事項
- **画像最適化**: Astroの`<Image />`コンポーネント使用推奨（現在はVercel対応でnoop設定）
- **CSS**: 不要なスタイルは削除、セレクタの詳細度を適切に管理
- **JavaScript**: Islands Architectureを活用し、必要最小限の部分のみでJS実行

### 品質管理・テスト
- **ビルド確認**: `npm run build` でエラーがないことを確認
- **複数ブラウザ確認**: Chrome、Safari、Firefoxでの表示確認
- **デバイス確認**: 実機またはDevToolsでモバイル・タブレット表示確認
- **パフォーマンス**: Lighthouseスコア確認（特にモバイル）

### トラブルシューティング

#### よくある問題と解決法
1. **SCSSコンパイルエラー**
   - 変数・ミックスインのインポート順序を確認
   - `@import` 文の記述ミスをチェック

2. **画像が表示されない**
   - パスの確認（`public/`ディレクトリからの相対パス）
   - ファイル名の大文字小文字を確認

3. **TypeScriptエラー**
   - `src/types/global.d.ts` での型定義確認
   - Astroコンポーネントのプロパティ型定義確認

4. **レスポンシブが効かない**
   - メディアクエリの記述順序確認（モバイルファースト）
   - ブレークポイント変数の使用確認

### デプロイメント
- **本番環境**: Vercel自動デプロイ（mainブランチプッシュ時）
- **プレビュー**: プルリクエスト作成時にVercelプレビューURL生成
- **環境変数**: 必要に応じて`.env`ファイルでローカル管理、Vercel管理画面で本番設定

## 実装済み機能

### ページ実装状況
- ✅ **トップページ** (`index.astro`): 完全実装済み
- ✅ **お問い合わせページ** (`inquiry.astro`): 完全実装済み
- ✅ **カテゴリページ** (`[category].astro`): 動的ルート実装済み
- ✅ **404エラーページ** (`404.astro`): 実装済み

### お問い合わせページの実装詳細
- **フォーム統合**: Formspree (https://formspree.io/f/mgvlpodg) 使用
- **必須項目検証**: HTML5バリデーション + JavaScript補完
- **インタラクティブ機能**:
  - プライバシーポリシー同意チェックで送信ボタン活性化
  - 送信ボタンの状態変化（背景色・テキスト色のトランジション）
- **アクセシビリティ**: aria属性、適切なラベリング、キーボードナビゲーション対応
- **レスポンシブ対応**: SP/タブレット/PC全デバイス対応
- **バリデーション仕様**:
  - 名前・メールアドレス・お問い合わせ内容: 必須
  - お問い合わせ種別: 任意選択
  - プライバシーポリシー同意: 必須（送信ボタン制御）

### 共通コンポーネントの実装
- ✅ **Breadcrumbコンポーネント**: パンくずリスト機能をコンポーネント化
  - `currentPageTitle` プロパティで現在ページ名を設定
  - inquiry.astro と [category].astro で再利用
  - 完全なレスポンシブ対応とアクセシビリティ対応

### フォーム機能の技術仕様
- **外部サービス**: Formspree無料プランを使用
- **セキュリティ**: サーバーサイドバリデーション（Formspree）+ クライアントサイドバリデーション
- **送信データ制御**: プライバシー同意チェックは受信メールに含まれない設定推奨
- **エラーハンドリング**: HTML5バリデーション + カスタムJavaScript制御
- **UX最適化**: 送信ボタンの視覚的フィードバック実装

### 今後の開発予定
- その他ページの段階的実装
- SEO最適化（メタタグ、構造化データ等）
- パフォーマンス最適化
- 多言語対応検討

## 重要な注意事項
- 観光・リゾート業界向けサイトとしてアクセシビリティに配慮
- 多言語対応の可能性を考慮した実装
- 画像の多用が想定されるためパフォーマンスを重視
- SEO対策（メタタグ、構造化データ等）の実装必須