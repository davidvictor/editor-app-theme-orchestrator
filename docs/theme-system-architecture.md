# Monaco Theme System Architecture

## Overview

This document explains the sophisticated theme synchronization system between the Monaco Editor and the main application. The system allows users to select different Monaco themes for light and dark modes, automatically extracts colors from those themes, and applies them to the entire application for a cohesive visual experience.

## How It Works: Core Mechanisms

### CSS Variable Override Mechanism

The theme system works by dynamically setting CSS custom properties on the HTML element (`document.documentElement`). This overrides the default values defined in `globals.css` because:

1. **CSS Specificity**: Inline styles on the HTML element have higher specificity than stylesheet rules
2. **CSS Custom Property Inheritance**: Variables defined on `:root` or `html` cascade down to all child elements
3. **Direct Property Setting**: Using `element.style.setProperty()` creates inline styles that take precedence

Example:
```css
/* In globals.css */
:root {
  --background: 0 0% 100%; /* Default white */
}

/* Applied by theme system */
<html style="--background: 222.2 47.4% 11.2%"> /* Overrides with Monaco theme color */
```

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

### 2. Theme Toggle (Switch in Header)
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

### How Theme Colors Are Mapped

The system extracts colors from Monaco theme data structures and maps them to CSS variables:

#### 1. **Theme Data Extraction Sources** (in order of priority):
```javascript
// Method 1: Standard Monaco theme format with colors object
themeData.colors['editor.background']
themeData.colors['editor.foreground']

// Method 2: Custom theme format with rules array
themeData.rules.find(r => r.token === '').background  // Background from base rule
themeData.rules.find(r => r.token === 'source').foreground  // Foreground from text tokens

// Method 3: Monaco's internal theme service
monacoInstance._themeService._theme.getColor('editor.background')
```

#### 2. **Color Mapping Table**:
| Monaco Theme Color | CSS Variable | Usage |
|-------------------|--------------|-------|
| `editor.background` | `--background` | Main app background |
| `editor.foreground` | `--foreground` | Main text color |
| `sidebarPanel.background` | `--card`, `--popover` | Card backgrounds |
| `input.background` | `--secondary` | Secondary backgrounds |
| `list.activeSelectionBackground` | `--accent` | Active selections |
| `activityBar.background` | `--sidebar-background` | Sidebar background |
| `editorError.foreground` | `--destructive`, `--status-error` | Error states |
| `editorWarning.foreground` | `--status-warning` | Warning states |
| Extracted primary color | `--primary` | Accent color |

### HSL Conversion Algorithm

All colors are converted from hex to HSL using this algorithm:

```javascript
const hexToHSL = (hex: string): HSLColor => {
  // Normalize hex (handle 3-digit format)
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  
  // Convert to RGB (0-1 range)
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255
  
  // Calculate lightness
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  
  // Calculate saturation
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  }
  
  // Calculate hue
  let h = 0
  if (max !== min) {
    const d = max - min
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),  // 0-360 degrees
    s: Math.round(s * 100),  // 0-100%
    l: Math.round(l * 100)   // 0-100%
  }
}
```

### Primary Color Selection Algorithm

The primary color is extracted from syntax highlighting rules in this priority order. **Important**: The system ALWAYS sets a primary color - it never falls back to the CSS variable from globals.css:

```javascript
const extractPrimaryColor = (themeData: any): string => {
  const priorityTokens = [
    'keyword',               // e.g., 'function', 'const', 'if'
    'function',             // Function names
    'variable.language',    // e.g., 'this', 'self'
    'support.function',     // Built-in functions
    'entity.name.function', // Function declarations
    'storage.type'          // e.g., 'class', 'interface'
  ]
  
  // Search through theme rules for these tokens
  for (const token of priorityTokens) {
    const rule = themeData.rules.find(r => 
      r.token === token || r.scope?.includes(token)
    )
    if (rule?.foreground) {
      return rule.foreground
    }
  }
  
  // Fallback to orange if no primary found
  // This always returns a color - it does NOT fall back to globals.css
  return '#f97316'
}
```

### Primary Color Scale Generation

The system generates a 10-shade scale from the extracted primary color:

```javascript
// Fixed lightness and saturation values for each shade
const shades = {
  50:  { lightness: 97, saturation: 97 },  // Lightest
  100: { lightness: 89, saturation: 97 },
  200: { lightness: 78, saturation: 96 },
  300: { lightness: 64, saturation: 94 },
  400: { lightness: 58, saturation: 94 },
  500: { lightness: 53, saturation: 95 },  // Base primary
  600: { lightness: 48, saturation: 90 },
  700: { lightness: 40, saturation: 88 },
  800: { lightness: 34, saturation: 79 },
  900: { lightness: 28, saturation: 75 }   // Darkest
}

// Applied as: --primary-[shade]: h s% l%
// Example: --primary-500: 25 95% 53%
```

### Intelligent Fallbacks

When specific colors aren't available in the theme, the system generates them:

```javascript
// Sidebar background: 3% lighter/darker than main background
sidebarBackground: isDark 
  ? lightenColor(background, 3)   // Dark theme: slightly lighter
  : darkenColor(background, 3)     // Light theme: slightly darker

// Muted colors: Mix of background and foreground
muted: mixColors(background, foreground, 0.1)      // 10% foreground
mutedForeground: mixColors(background, foreground, 0.4)  // 40% foreground

// Input background: Generated from theme type
inputBackground: isDark 
  ? lightenColor(background, 10)   // Dark: 10% lighter
  : darkenColor(background, 7)      // Light: 7% darker
```

## CSS Variable Application Process

### How Colors Override Default Values

The theme system applies colors by setting CSS custom properties directly on the HTML element:

```javascript
const applyThemeColors = (colors: ExtractedThemeColors) => {
  const root = document.documentElement  // <html> element
  
  // Set CSS variable with HSL format
  const setHSLVariable = (varName: string, hexColor: string) => {
    const hsl = hexToHSL(hexColor)
    root.style.setProperty(`--${varName}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`)
  }
  
  // Apply each color
  setHSLVariable('background', colors.background)
  setHSLVariable('foreground', colors.foreground)
  // ... more colors
}
```

### Why This Overrides globals.css

1. **Cascade Priority**: Inline styles have the highest specificity in CSS
   ```html
   <!-- This inline style... -->
   <html style="--background: 222.2 47.4% 11.2%">
   
   <!-- ...overrides this stylesheet rule -->
   <style>
   :root {
     --background: 0 0% 100%;
   }
   </style>
   ```

2. **CSS Custom Property Resolution**: When the browser resolves `var(--background)`:
   - First checks inline styles on current element and ancestors
   - Then checks stylesheets
   - Uses first defined value found

3. **Full Color Application Example**:
   ```javascript
   // Monaco theme color: #1e1e1e (VS Code Dark background)
   // Converted to HSL: { h: 0, s: 0, l: 12 }
   // Applied as: --background: 0 0% 12%
   
   // In your component:
   background-color: hsl(var(--background));
   // Resolves to: background-color: hsl(0 0% 12%);
   ```

### Complete Variable Mapping

Here's the full mapping of Monaco colors to CSS variables:

```typescript
// Core colors
'--background': colors.background
'--foreground': colors.foreground
'--card': colors.sidebarBackground
'--card-foreground': colors.foreground
'--popover': colors.sidebarBackground
'--popover-foreground': colors.foreground
'--primary': colors.primary
'--primary-foreground': '#000000' or '#ffffff' (based on contrast)
'--secondary': colors.inputBackground
'--secondary-foreground': colors.foreground
'--muted': mixColors(background, foreground, 0.1)
'--muted-foreground': mixColors(background, foreground, 0.4)
'--accent': colors.listActiveBackground
'--accent-foreground': colors.foreground
'--destructive': colors.error
'--destructive-foreground': '#ffffff'
'--border': colors.border
'--input': colors.inputBackground
'--ring': colors.primary

// Sidebar specific
'--sidebar-background': colors.activityBarBackground
'--sidebar-foreground': colors.activityBarForeground
'--sidebar-primary': colors.primary
'--sidebar-primary-foreground': '#000000' or '#ffffff'
'--sidebar-accent': colors.listHoverBackground
'--sidebar-accent-foreground': colors.foreground
'--sidebar-border': colors.sidebarBorder

// Status colors
'--status-error': colors.error
'--status-warning': colors.warning
'--status-success': colors.success
'--status-info': colors.info
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

## Implementation Summary

### The Complete Theme Application Flow

1. **Theme Selection**: User selects a Monaco theme in the Hacker Portal
2. **Data Extraction**: System extracts theme data from Monaco using multiple fallback methods
3. **Color Mapping**: ~50 colors are extracted and mapped to semantic CSS variables
4. **HSL Conversion**: All hex colors are converted to HSL format for flexibility
5. **Primary Extraction**: System searches syntax rules to find the theme's accent color
6. **Scale Generation**: Creates a 10-shade scale from the primary color
7. **CSS Application**: Colors are applied as inline styles on the HTML element
8. **Override Mechanism**: Inline styles override the default CSS variables from globals.css
9. **Persistence**: Colors are saved to localStorage for instant application on reload

### Key Technical Details

- **HSL Format**: All colors use HSL (Hue, Saturation, Lightness) for easy manipulation
- **Override Method**: `document.documentElement.style.setProperty()` creates inline styles
- **Primary Selection**: Searches for keyword/function colors, always sets a value (never falls back to CSS)
- **Fallback Generation**: Missing colors are intelligently generated from base colors
- **Theme Detection**: Background lightness < 50% determines dark themes
- **Default Themes**: VS Code's built-in themes use app CSS instead of extraction

### Why It Works

The system leverages CSS's cascade rules where inline styles have the highest specificity. By setting CSS custom properties on the HTML element, these values override the defaults in globals.css and cascade to all child elements. The HSL format allows for dynamic color manipulation while maintaining the theme's character.

The result is an application that can adopt the full visual personality of any Monaco theme while maintaining a cohesive, professional appearance.