# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a kokko-fes project built with Astro 5.7.12, featuring a responsive SCSS architecture with mobile-first design and Japanese typography support. The project includes a sophisticated viewport-based responsive system using custom SCSS functions.

## Development Commands

```bash
# Navigate to the astro directory first
cd astro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Project Structure
- `astro/` - Main Astro application directory
  - `src/layouts/MySiteLayout.astro` - Base layout with Google Fonts integration
  - `src/pages/index.astro` - Home page
  - `src/styles/` - SCSS architecture with modular design

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

### Working Directory
Always change to the `astro/` directory before running npm commands, as the main package.json is located there.