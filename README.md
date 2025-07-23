# Monaco Theme Sync

A sophisticated theme synchronization system that extracts colors from Monaco Editor themes and applies them to your entire application, creating a cohesive visual experience across both code editor and UI components.

## Overview

This project demonstrates how to seamlessly integrate Monaco Editor themes with a React/Next.js application. When users select a Monaco theme, the system automatically:

- Extracts ~50 different colors from the theme
- Converts them to CSS custom properties
- Applies them to the entire application UI
- Supports separate themes for light and dark modes
- Persists preferences across sessions

## Key Features

- **🎨 Automatic Color Extraction**: Extracts colors from any Monaco theme including background, foreground, syntax highlighting, and UI elements
- **🌓 Dual Theme Support**: Configure different Monaco themes for light and dark modes
- **🎯 Smart Theme Categorization**: Automatically detects whether themes are light or dark based on background brightness
- **💾 Persistent Preferences**: Saves theme selections and extracted colors to localStorage
- **⚡ Performance Optimized**: Caches extracted colors and uses singleton pattern to prevent duplicate operations
- **🔧 Intelligent Fallbacks**: Generates missing colors based on theme characteristics

## Installation

```bash
# Install dependencies (requires pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## How It Works

### 1. Theme Selection

Users can select different Monaco themes for light and dark modes through the UI. The system provides separate dropdowns filtered by theme brightness.

### 2. Color Extraction

When a theme is selected, the system:

- Loads the theme into Monaco Editor
- Extracts colors from Monaco's internal theme service
- Converts all colors to HSL format for flexibility
- Maps Monaco colors to semantic CSS variables

### 3. CSS Variable Override

Colors are applied by setting CSS custom properties on the HTML element, which override the defaults in `globals.css`:

```javascript
// Monaco theme color
document.documentElement.style.setProperty('--background', '222.2 47.4% 11.2%')

// In CSS
background-color: hsl(var(--background))
```

### 4. Persistence

Theme selections and extracted colors are saved to localStorage for instant application on page reload.

## Architecture

```
lib/
├── theme-application.ts      # Singleton service managing theme application
├── theme-sync.ts            # Core utilities for color extraction
├── theme-brightness-registry.ts  # Auto-generated theme categorization
└── monaco-theme-registry.ts  # Available Monaco themes

hooks/
└── useMonacoTheme.ts        # React hook for theme state management

components/
├── monaco-theme-selector.tsx # UI component for theme selection
└── theme-toggle.tsx         # Light/dark mode toggle

scripts/
└── analyze-theme-brightness.js  # Analyzes and categorizes Monaco themes
```

## Theme Brightness Analysis

The project includes a script that automatically categorizes all Monaco themes:

```bash
node scripts/analyze-theme-brightness.js
```

This generates `lib/theme-brightness-registry.ts` with theme metadata including background colors and brightness values.

## Extracted Colors

The system extracts and maps approximately 50 colors including:

- **Editor Colors**: Background, foreground, selection, cursor
- **UI Elements**: Sidebar, tabs, panels, inputs, buttons
- **Syntax Highlighting**: Keywords, functions, strings, comments
- **Semantic Colors**: Error, warning, success, info states
- **Interactive States**: Hover, active, focus, disabled

## Default Themes

The following VS Code default themes use the application's built-in CSS instead of extracted colors:

- Visual Studio (`vs`)
- Visual Studio Dark (`vs-dark`)
- High Contrast Light (`hc-light`)
- High Contrast Black (`hc-black`)

## Development

### Adding New Monaco Themes

1. Install the theme package
2. Run the brightness analysis script
3. Import and register the theme in your Monaco setup
4. Test theme switching in the application

### Debugging

```javascript
// Check extracted colors in browser console
localStorage.getItem('monaco-theme-colors-[theme-name]');

// View current CSS variables
document.documentElement.style.getPropertyValue('--background');

// Force reset all theme data
Object.keys(localStorage)
  .filter((k) => k.includes('monaco-theme'))
  .forEach((k) => localStorage.removeItem(k));
```

## Technical Details

### Color Extraction Process

1. Access Monaco's internal theme service
2. Extract colors from multiple sources (theme data, rules array, internal service)
3. Convert hex colors to HSL format
4. Generate color scales for primary colors
5. Apply intelligent fallbacks for missing colors

### CSS Variable System

The application uses CSS custom properties defined in HSL format:

```css
--background: 222.2 47.4% 11.2%;
--foreground: 0 0% 83.1%;
--primary: 25 95% 53%;
```

### Performance Considerations

- Singleton pattern prevents duplicate theme applications
- Colors are cached in localStorage after extraction
- Theme changes are debounced to prevent rapid switching
- Only extracts colors when theme actually changes

## License

This project is licensed under the MIT License.
