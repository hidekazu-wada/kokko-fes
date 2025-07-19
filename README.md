
## スタイル構成の詳細

### variables.scss

基本的な変数を定義するファイルです。

```scss
// ビューポートサイズの定義
$viewport_pc: 2560;    // PC用ビューポート基準値
$viewport_tab: 2048;   // タブレット用ビューポート基準値
$viewport_sp: 720;     // スマホ用ビューポート基準値

// ブレイクポイントの定義
$breakpoint-tablet-up: 744px;   // タブレット以上
$breakpoint-desktop-up: 1024px; // デスクトップ以上
```

### functions.scss

px単位をvw単位に変換するための関数を提供します。これにより、異なる画面サイズに対応したレスポンシブな値を簡単に計算できます。

```scss
// PC用のpx→vw変換
@function ppx($num_pc, $width_pc: $viewport_pc) {
    // 使用例: width: ppx(100px); → 100pxを基準ビューポートに対するvw値に変換
}

// タブレット用のpx→vw変換
@function tpx($num_tab, $width_tab: $viewport_tab) { ... }

// スマホ用のpx→vw変換
@function spx($num_sp, $width_sp: $viewport_sp) { ... }
```

### mixins.scss

レスポンシブデザインとフォント設定のためのミックスインを提供します。

```scss
// モバイルファースト用メディアクエリ
@mixin tablet-up {
    // 744px以上のデバイス向け
    @media (min-width: $breakpoint-tablet-up) {
        @content;
    }
}

@mixin desktop-up {
    // 1024px以上のデバイス向け
    @media (min-width: $breakpoint-desktop-up) {
        @content;
    }
}

// フォント設定
@mixin zen-kaku-gothic-new-regular {
    font-family: "Zen Kaku Gothic New", sans-serif;
    font-weight: 400;
    font-style: normal;
}

@mixin zen-kaku-gothic-new-bold { ... }
```

### global.scss

プロジェクト全体に適用されるグローバルスタイルを定義します。

```scss
@import "destyle.css";         // モダンなCSSリセット
@import "./functions.scss";    // ユーティリティ関数
@import "./mixins.scss";       // ミックスイン

// フォント定義
$font-didot: "Didot", serif;
$font-noto-serif-jp: "Noto Serif JP", serif;

html {
    scroll-behavior: smooth;
    body {
        @include zen-kaku-gothic-new-regular;
        // 基本スタイル
    }
}
```

## 使用方法

### 基本的なレスポンシブスタイルの記述

モバイルファーストアプローチでは、基本スタイルをデフォルトとして定義し、より大きな画面サイズに対してメディアクエリを使用します。

```scss
.element {
    // モバイル用スタイル（デフォルト）
    font-size: 16px;
    padding: 10px;
    
    // タブレット以上
    @include tablet-up {
        font-size: 18px;
        padding: 15px;
    }
    
    // デスクトップ以上
    @include desktop-up {
        font-size: 20px;
        padding: 20px;
    }
}
```

### vw単位変換関数の使用

異なるビューポートサイズに対応するために、px値をvw値に変換できます。

```scss
.element {
    // モバイル用（720pxビューポート基準）
    width: spx(300px);  // 300pxを720pxビューポート基準のvw値に変換
    
    // タブレット以上（2048pxビューポート基準）
    @include tablet-up {
        width: tpx(500px);
    }
    
    // デスクトップ以上（2560pxビューポート基準）
    @include desktop-up {
        width: ppx(800px);
    }
}
```

### フォントミックスインの使用

一貫したフォントスタイルを適用するためのミックスインを使用できます。

```scss
.title {
    @include zen-kaku-gothic-new-bold;
    font-size: 24px;
}

.content {
    @include zen-kaku-gothic-new-regular;
    line-height: 1.6;
}
```

## Google Fontsの設定

このテンプレートでは、Google Fontsを`MySiteLayout.astro`で読み込んでいます。

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

別のフォントを使用する場合は、上記のリンクと`mixins.scss`のフォントミックスインを更新してください。

## 注意点

1. **モバイルファースト設計**: 常にモバイル用スタイルをデフォルトとして定義し、より大きな画面サイズにはメディアクエリを使用します。

2. **SCSSファイルの役割分担**:
   - `variables.scss`: 変数のみを定義
   - `functions.scss`: 関数のみを定義
   - `mixins.scss`: ミックスインを定義
   - `global.scss`: グローバルスタイルを適用

3. **インポート順序**: 依存関係を考慮して、正しい順序でファイルをインポートします。
   ```scss
   @import "destyle.css";
   @import "./functions.scss";
   @import "./mixins.scss";
   // その他のスタイル
   ```

4. **destyle.cssの使用**: このテンプレートでは、モダンなCSSリセットとして`destyle.css`を使用しています。

## カスタマイズ方法

1. **プロジェクト名の変更**: `package.json`の`name`フィールドを更新します。

2. **フォントの変更**: 
   - `MySiteLayout.astro`のGoogle Fontsリンクを更新
   - `mixins.scss`のフォントミックスインを更新
   - `global.scss`のフォント変数を更新

3. **ブレイクポイントの調整**: プロジェクトの要件に合わせて`variables.scss`のブレイクポイント値を調整します。

4. **カラーパレットの追加**: 必要に応じて`variables.scss`にカラー変数を追加します。

## 始め方

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## ライセンス

MITライセンス
