# Monaco Theme Sync Feature

## Overview

The Monaco Theme Sync feature dynamically updates the entire application's color scheme to match the currently selected Monaco editor theme. This creates a cohesive visual experience where the code editor's theme influences the entire dashboard interface.

## Feature Status: ✅ Complete

### What Works

- **Theme Color Extraction**: Successfully extracts neutral colors (backgrounds, foregrounds, borders, etc.) from Monaco themes
- **Dynamic Application**: Site-wide CSS variables update in real-time when editor theme changes
- **Theme Persistence**: Selected themes and their color mappings persist across sessions via localStorage
- **Comprehensive Theme Support**: All 55 Monaco themes + 4 built-in themes are supported
- **Smooth Transitions**: 300ms color transitions provide smooth visual updates

### Implementation Details

#### Core Files

1. **`lib/monaco-themes-registry.ts`**
   - Comprehensive registry of all 55 Monaco themes
   - Handles theme name variations (spaces, hyphens, case sensitivity)
   - Static imports ensure theme data is always available

2. **`lib/theme-sync.ts`**
   - Extracts colors from Monaco theme data structures
   - Maps theme colors to application CSS variables
   - Provides intelligent fallbacks for missing colors
   - Handles both built-in and custom theme formats

3. **`app/hacker-portal/page.tsx`**
   - Integrates theme extraction on theme selection
   - Manages theme persistence and loading
   - Coordinates between Monaco editor and theme sync system

#### Color Mapping Strategy

Monaco theme colors are mapped to application UI surfaces:

- `editor.background` → Main application background
- `sideBar.background` → Cards, popovers, elevated surfaces
- `activityBar.background` → Navigation sidebar
- `input.background` → Form inputs and secondary surfaces
- `list.activeSelectionBackground` → Interactive/accent states
- Theme's primary color (keywords/functions) → Primary accent color

#### Technical Architecture

```
User selects theme → Monaco loads theme → Extract colors → Map to CSS variables → Apply site-wide
                                     ↓
                            Store in localStorage
```

### Known Limitations

1. **Theme Data Access**: Some Monaco themes only provide syntax highlighting rules, not UI colors. The system generates appropriate UI colors based on the theme's background/foreground.

2. **Light Theme Support**: While functional, light themes may need additional contrast adjustments for optimal readability in the cyberpunk-styled interface.

3. **Custom Theme Loading**: There's a 500ms delay for custom themes to ensure Monaco has fully loaded the theme before extraction.

### Usage

1. Navigate to the Hacker Portal (`/hacker-portal`)
2. Select a theme from the "Light Theme" or "Dark Theme" dropdown
3. The entire application adapts to the selected theme's color palette
4. Theme preferences persist across sessions

### Supported Themes

**Built-in Themes (4)**:
- Visual Studio (`vs`)
- Visual Studio Dark (`vs-dark`)
- High Contrast Black (`hc-black`)
- High Contrast Light (`hc-light`)

**Custom Themes (55)**:
Including popular themes like:
- Dracula
- Monokai
- GitHub Dark/Light
- Nord
- Solarized Dark/Light
- Tomorrow Night variations
- And 48 more...

### Examples

- **Dracula Theme**: Purple-gray background (#282a36) with the entire app adopting Dracula's color palette
- **Birds of Paradise**: Warm brown background (#372725) with cream foreground (#e6e1c4)
- **GitHub Light**: Clean white background with GitHub's signature colors

### Future Enhancements

1. **Custom Theme Creator**: Allow users to create and save custom color schemes
2. **Theme Previews**: Show theme previews before applying
3. **Advanced Contrast Controls**: User-adjustable contrast ratios
4. **Theme Sharing**: Export/import theme configurations

### Troubleshooting

If theme colors don't apply correctly:

1. **Check Console**: Look for extraction errors or warnings
2. **Clear Cache**: Remove localStorage entries prefixed with `monaco-theme-colors-`
3. **Reload Page**: Some themes require a page reload to fully apply
4. **Verify Theme Name**: Ensure the theme name matches one in the registry

### Developer Notes

- Theme extraction happens after a delay to ensure Monaco has loaded the theme
- The system handles multiple theme name formats (spaces, hyphens, case)
- Fallback colors are theme-aware (different for light vs dark themes)
- All color values are converted to HSL for CSS variable compatibility