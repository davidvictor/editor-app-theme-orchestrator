# Monaco Theme System Architecture

## Overview

This document explains the sophisticated theme synchronization system between the Monaco Editor and the main application. The system allows users to select different Monaco themes for light and dark modes, automatically extracts colors from those themes, and applies them to the entire application for a cohesive visual experience.

## Key Features

1. **Dual Theme Selection**: Users can select different Monaco themes for light and dark modes
2. **Automatic Color Extraction**: Colors are extracted from Monaco themes and applied to the app
3. **Smart Theme Categorization**: All Monaco themes are automatically categorized as light or dark
4. **Default Theme Handling**: Built-in VS Code themes use the app's default CSS
5. **Persistent Theme Preferences**: Theme selections are saved to localStorage

## Architecture Components

### 1. Theme Brightness Analysis (`scripts/analyze-theme-brightness.js`)

This script runs during development to analyze all Monaco themes and categorize them by brightness.

**How it works:**
1. Loads all theme files from `node_modules/monaco-themes/themes/`
2. Extracts the background color from each theme's data structure
3. Converts the color to HSL (Hue, Saturation, Lightness)
4. Categorizes themes as light (L > 50%) or dark (L ≤ 50%)
5. Generates `lib/theme-brightness-registry.ts` with categorization data

**Background Color Extraction Methods:**
```javascript
// Method 1: Standard format (colors object)
themeData.colors['editor.background']

// Method 2: Rules array format (common in imported themes)
themeData.rules.find(r => r.token === '').background

// Method 3: Fallback based on theme base
themeData.base === 'vs-dark' ? '#1e1e1e' : '#ffffff'
```

### 2. Theme Brightness Registry (`lib/theme-brightness-registry.ts`)

Auto-generated file containing:
- Categorized light and dark themes
- Theme metadata (background color, lightness value)
- Helper functions for theme queries

**Key Functions:**
- `getAllLightThemes()`: Returns all light theme names
- `getAllDarkThemes()`: Returns all dark theme names
- `isLightTheme(name)`: Checks if a theme is light
- `getThemeInfo(name)`: Gets theme metadata

### 3. Monaco Theme Hook (`hooks/useMonacoTheme.ts`)

React hook managing theme state without circular dependencies.

**Features:**
- Uses `useMemo` instead of `useEffect` for derived state
- Manages light/dark theme selections
- Persists selections to localStorage
- Provides clean API for theme updates

**State Management:**
```typescript
const currentTheme = useMemo(() => {
  return theme === 'dark' ? darkTheme : lightTheme
}, [theme, darkTheme, lightTheme])
```

### 4. Theme Application Manager (`lib/theme-application.ts`)

Singleton service handling theme application logic.

**Key Responsibilities:**
1. **Default Theme Detection**: Identifies VS Code default themes
2. **Color Extraction**: Extracts colors from Monaco themes
3. **Color Application**: Applies colors to CSS variables
4. **Reset Functionality**: Clears custom colors for default themes

**Default Themes (Use App CSS):**
- Visual Studio (`vs`)
- Visual Studio Dark (`vs-dark`)
- High Contrast Light (`hc-light`)
- High Contrast Black (`hc-black`)

### 5. Theme Sync Utilities (`lib/theme-sync.ts`)

Core utilities for color extraction and application.

**Color Extraction Process:**
1. Access Monaco's internal theme service
2. Extract ~50 different color values
3. Convert colors to HSL format
4. Generate color scales for primary color
5. Apply to CSS custom properties

**Extracted Colors Include:**
- Editor colors (background, foreground)
- UI colors (sidebar, panels, tabs)
- Interactive states (hover, active, selected)
- Semantic colors (error, warning, success, info)

### 6. Monaco Theme Selector Component (`components/monaco-theme-selector.tsx`)

Reusable UI component for theme selection.

**Features:**
- Separate dropdowns for light and dark themes
- Filtered theme lists based on brightness
- Clean component API for integration

### 7. CSS Variable System (`app/globals.css`)

Defines default theme variables for light and dark modes.

**Structure:**
```css
:root {
  /* Light mode defaults */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... more variables */
}

.dark {
  /* Dark mode defaults */
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... more variables */
}
```

## Theme Application Flow

### 1. Initial Page Load
```
User loads app → Check localStorage for saved themes
  ↓
If default themes (vs, vs-dark, etc.)
  → Use app's default CSS variables
  
If custom themes with saved colors
  → Apply saved Monaco colors
  
If custom themes without saved colors
  → Use app's default CSS variables
```

### 2. Theme Toggle (Sun/Moon Button)
```
User clicks theme toggle → Theme changes (light ↔ dark)
  ↓
Reset last applied theme → Get current Monaco theme
  ↓
If default theme → Reset CSS variables to defaults
If custom theme → Apply saved colors if available
```

### 3. Monaco Theme Selection (In Hacker Portal)
```
User selects new theme → Update theme preference
  ↓
If current mode matches selection
  ↓
Load theme into Monaco → Wait for theme to load
  ↓
Extract colors from Monaco → Apply to CSS variables
  ↓
Save colors to localStorage
```

## Color Extraction Deep Dive

### HSL Conversion
All colors are converted to HSL for manipulation:
```javascript
// Example: #f97316 (orange) → { h: 25, s: 95, l: 53 }
const hsl = hexToHSL('#f97316')
```

### Primary Color Scale Generation
The system generates a 10-shade scale from the primary color:
```
--primary-50:  97% lightness (lightest)
--primary-100: 89% lightness
--primary-200: 78% lightness
...
--primary-900: 28% lightness (darkest)
```

### Intelligent Fallbacks
When colors aren't available, smart fallbacks are applied:
```javascript
sidebarBackground: isDark 
  ? lightenColor(background, 3) 
  : darkenColor(background, 3)
```

## Storage Structure

### localStorage Keys
- `hacker-portal-light-theme`: Selected light theme name
- `hacker-portal-dark-theme`: Selected dark theme name
- `monaco-theme-colors-[themeName]`: Extracted colors for each theme

### Example Stored Colors
```json
{
  "background": "#1e1e1e",
  "foreground": "#d4d4d4",
  "primary": "#569cd6",
  "sidebarBackground": "#252526",
  // ... 40+ more colors
}
```

## Performance Optimizations

1. **Singleton Pattern**: Theme application manager prevents duplicate operations
2. **Caching**: Extracted colors are cached in localStorage
3. **Lazy Loading**: Theme colors only extracted when needed
4. **Smart Diffing**: Only applies colors when theme actually changes

## Troubleshooting

### Common Issues

1. **Theme doesn't change visually**
   - Check if it's a default theme (should use CSS, not extracted colors)
   - Verify localStorage has saved colors
   - Check browser console for extraction errors

2. **Colors look wrong**
   - Clear localStorage and re-extract
   - Verify theme file has proper color definitions
   - Check if theme is correctly categorized (light/dark)

3. **Performance issues**
   - Reduce extraction frequency
   - Check for circular dependencies
   - Verify singleton is working correctly

## Future Enhancements

1. **Theme Preview**: Show color swatches before applying
2. **Custom Theme Creator**: Let users create custom color schemes
3. **Theme Export**: Export extracted colors as new themes
4. **Animation Preferences**: Smooth transitions between themes
5. **Per-Page Themes**: Different themes for different sections

## Developer Notes

### Adding New Monaco Themes
1. Install theme package
2. Run `node scripts/analyze-theme-brightness.js`
3. Verify categorization in generated files
4. Test theme switching in app

### Debugging Theme Extraction
```javascript
// In browser console
localStorage.getItem('monaco-theme-colors-Dracula')
document.documentElement.style.getPropertyValue('--background')
```

### Force Theme Reset
```javascript
// Clear all theme data
Object.keys(localStorage)
  .filter(k => k.includes('monaco-theme'))
  .forEach(k => localStorage.removeItem(k))
```

## Conclusion

This theme system creates a seamless visual experience by:
1. Intelligently categorizing themes by brightness
2. Extracting comprehensive color palettes from Monaco themes
3. Applying those colors throughout the application
4. Providing smart fallbacks for default themes
5. Maintaining performance through caching and optimization

The result is an application that can adopt the full visual personality of any Monaco theme while maintaining a cohesive, professional appearance.