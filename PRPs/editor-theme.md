# Dynamic Site Color Configuration Based on Editor Theme

## Goal

Create a system that dynamically updates the site's color variables (CSS custom properties) to match the currently selected Monaco editor theme. This will create a cohesive visual experience where the entire dashboard's color scheme adapts to match the code editor's theme, maintaining the cyberpunk aesthetic while allowing for personalized color preferences.

## Why

- **Visual Cohesion**: Creates a unified visual experience where the editor theme influences the entire interface
- **Personalization**: Allows users to customize the entire dashboard's color scheme through editor theme selection
- **Enhanced UX**: Reduces visual discord between the editor and the rest of the application
- **Theming System**: Establishes a foundation for a comprehensive theming system across the application

## What

### User-Visible Behavior
1. When a user selects a Monaco editor theme, the site's color scheme updates to match
2. Primary accent color (currently orange #f97316) adapts to the theme's primary highlight color
3. Background and foreground colors sync with the editor's color scheme
4. Status colors (success, warning, error) harmonize with the theme
5. All transitions are smooth and immediate
6. Theme preferences persist across sessions via localStorage

### Technical Requirements
1. Extract key colors from Monaco theme definitions
2. Map Monaco theme colors to CSS custom properties
3. Update CSS variables dynamically when theme changes
4. Maintain readable contrast ratios
5. Support both light and dark theme variations
6. Preserve cyberpunk aesthetic with theme-appropriate adaptations

### Success Criteria

- [ ] Monaco theme selection updates site-wide color scheme
- [ ] Color transitions are smooth and immediate
- [ ] All UI elements maintain proper contrast and readability
- [ ] Theme color mappings persist in localStorage
- [ ] Cyberpunk aesthetic is maintained across all themes
- [ ] Both built-in and custom Monaco themes are supported
- [ ] Color system is extensible for future enhancements

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneThemeData.html
  why: Monaco theme data structure and color definitions

- url: https://github.com/brijeshb42/monaco-themes/tree/master/themes
  why: Structure of Monaco theme JSON files for color extraction

- file: /Users/david/dev/monaco/app/globals.css
  why: Current CSS variable structure and color system

- file: /Users/david/dev/monaco/app/hacker-portal/page.tsx
  why: Current Monaco editor implementation and theme loading

- file: /Users/david/dev/monaco/tailwind.config.ts
  why: Tailwind configuration using CSS variables

- docfile: /Users/david/dev/monaco/CLAUDE.md
  why: Project conventions and color system documentation
```

### Current Codebase tree

```bash
monaco/
├── app/
│   ├── globals.css          # CSS variables and color definitions
│   ├── hacker-portal/
│   │   └── page.tsx        # Monaco editor with theme selection
│   └── page.tsx            # Main layout and navigation
├── components/
│   └── ui/                 # shadcn/ui components using CSS vars
├── lib/
│   └── utils.ts           # Utility functions
└── tailwind.config.ts     # Tailwind using CSS variables
```

### Desired Codebase tree with new files

```bash
monaco/
├── app/
│   ├── globals.css          # CSS variables and color definitions
│   ├── hacker-portal/
│   │   └── page.tsx        # Monaco editor with theme selection
│   └── page.tsx            # Main layout and navigation
├── components/
│   └── ui/                 # shadcn/ui components using CSS vars
├── lib/
│   ├── utils.ts           # Utility functions
│   └── theme-sync.ts      # NEW: Theme color extraction and mapping
└── tailwind.config.ts     # Tailwind using CSS variables
```

### Known Gotchas of our codebase & Library Quirks

```
// CRITICAL: Monaco themes use hex colors without # prefix
// Example: "F8F8F2" not "#F8F8F2"

// CRITICAL: CSS variables expect HSL format for Tailwind/shadcn
// Must convert hex to HSL for CSS variables

// CRITICAL: Monaco theme loading is async
// Color extraction must wait for theme to be fully loaded

// CRITICAL: Some Monaco themes don't have all color properties
// Need fallback values for missing colors

// CRITICAL: Built-in themes (vs, vs-dark) have different structure
// Need separate handling for built-in vs custom themes
```

## Implementation Blueprint

### Data models and structure

```typescript
// lib/theme-sync.ts

// Monaco theme color extraction interface
export interface ExtractedThemeColors {
  // Core colors
  background: string
  foreground: string
  
  // UI colors
  primary: string           // Main accent (extracted from keywords/functions)
  secondary: string        // Secondary accent
  muted: string           // Comments/inactive
  border: string          // Editor borders
  
  // Semantic colors
  error: string           // Error tokens
  warning: string         // Warning tokens
  success: string         // Success/strings
  info: string           // Information/types
  
  // Editor specific
  selection: string       // Selection background
  lineHighlight: string   // Current line
}

// Color format converters
interface ColorConverters {
  hexToHSL: (hex: string) => { h: number; s: number; l: number }
  hslToString: (hsl: { h: number; s: number; l: number }) => string
  ensureContrast: (fg: string, bg: string, minRatio: number) => string
}

// Theme mapping configuration
interface ThemeMapping {
  source: keyof ExtractedThemeColors
  target: string // CSS variable name
  transform?: (color: string) => string
}
```

### List of tasks to be completed

```yaml
Task 1:
CREATE lib/theme-sync.ts:
  - Create color extraction logic for Monaco themes
  - Handle both built-in and custom theme structures
  - Implement hex to HSL conversion
  - Add contrast ratio validation
  - Export applyThemeColors function

Task 2:
MODIFY app/hacker-portal/page.tsx:
  - Import theme-sync utilities
  - Add color extraction after theme load
  - Call applyThemeColors when theme changes
  - Store color mappings in localStorage
  - Load and apply saved colors on mount

Task 3:
MODIFY app/globals.css:
  - Add CSS custom properties for theme colors
  - Create smooth transition for color changes
  - Add theme-specific status color variations
  - Ensure fallback values for all variables

Task 4:
MODIFY components throughout the app:
  - Update hardcoded orange-500 references to use primary color
  - Replace direct color classes with themed variants
  - Ensure all status colors use semantic variables
  - Test contrast in both light and dark modes

Task 5:
CREATE theme color persistence:
  - Save extracted colors to localStorage
  - Load saved colors on app initialization
  - Sync colors across browser tabs
  - Handle theme removal/corruption gracefully
```

### Per task pseudocode

```typescript
// Task 1: lib/theme-sync.ts
export const extractThemeColors = async (
  monaco: Monaco,
  themeName: string,
  isBuiltIn: boolean
): Promise<ExtractedThemeColors> => {
  let themeData: any
  
  if (isBuiltIn) {
    // Built-in themes have different structure
    const currentTheme = monaco.editor._themeService._theme
    themeData = currentTheme.themeData
  } else {
    // Custom themes loaded from JSON
    themeData = monaco.editor._themeService._knownThemes.get(themeName)
  }
  
  // Extract colors with fallbacks
  const colors: ExtractedThemeColors = {
    background: themeData.colors?.['editor.background'] || 
                extractFromRules(themeData.rules, 'background') || 
                '#1a1a1a',
    foreground: themeData.colors?.['editor.foreground'] || 
                extractFromRules(themeData.rules, 'foreground') || 
                '#f8f8f2',
    primary: extractPrimaryColor(themeData) || '#f97316', // Keep orange as fallback
    // ... extract other colors
  }
  
  return colors
}

export const applyThemeColors = (colors: ExtractedThemeColors) => {
  const root = document.documentElement
  
  // Convert hex to HSL and apply
  Object.entries(colorMappings).forEach(([key, mapping]) => {
    const sourceColor = colors[mapping.source]
    const hslColor = hexToHSL(sourceColor)
    const hslString = `${hslColor.h} ${hslColor.s}% ${hslColor.l}%`
    
    root.style.setProperty(`--${mapping.target}`, hslString)
    
    // Generate color scale (50-900) for primary
    if (key === 'primary') {
      generateColorScale(hslColor).forEach((scaleColor, index) => {
        const shade = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900][index]
        root.style.setProperty(
          `--primary-${shade}`,
          `${scaleColor.h} ${scaleColor.s}% ${scaleColor.l}%`
        )
      })
    }
  })
}

// Task 2: Modify hacker-portal/page.tsx
// Add after theme is loaded/changed:
useEffect(() => {
  if (!monacoInstance || !mounted) return
  
  const extractAndApplyColors = async () => {
    try {
      const themeToApply = theme === "dark" ? darkTheme : lightTheme
      const isBuiltIn = BUILT_IN_THEMES.some(t => t.value === themeToApply)
      
      // Wait for theme to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const colors = await extractThemeColors(monacoInstance, themeToApply, isBuiltIn)
      applyThemeColors(colors)
      
      // Save to localStorage
      localStorage.setItem(
        `monaco-theme-colors-${theme}`,
        JSON.stringify(colors)
      )
    } catch (error) {
      console.error('Failed to extract theme colors:', error)
    }
  }
  
  extractAndApplyColors()
}, [theme, lightTheme, darkTheme, monacoInstance, mounted])

// Task 3: Update globals.css
:root {
  /* Theme-synced colors */
  --theme-background: var(--background);
  --theme-foreground: var(--foreground);
  --theme-primary: var(--primary);
  --theme-secondary: var(--secondary);
  --theme-error: 0 84.2% 60.2%;
  --theme-warning: 38 92% 50%;
  --theme-success: 142 76% 36%;
  
  /* Smooth transitions for theme changes */
  * {
    transition: background-color 0.3s ease, 
                color 0.3s ease, 
                border-color 0.3s ease;
  }
}

// Task 4: Update components
// Example: Replace text-orange-500 with text-primary-500
// Before: <CardTitle className="text-orange-500">
// After: <CardTitle className="text-primary-500">

// Task 5: Persistence on app load
// In app/layout.tsx or a client component:
useEffect(() => {
  const savedColors = localStorage.getItem(`monaco-theme-colors-${theme}`)
  if (savedColors) {
    try {
      const colors = JSON.parse(savedColors)
      applyThemeColors(colors)
    } catch (error) {
      console.error('Failed to load saved theme colors:', error)
    }
  }
}, [theme])
```

### Integration Points

```yaml
THEME STORAGE:
  - localStorage keys:
    - 'monaco-theme-colors-light': Light theme color mappings
    - 'monaco-theme-colors-dark': Dark theme color mappings
  
CSS VARIABLES:
  - Update in globals.css:
    - --primary: Dynamic from theme
    - --primary-50 through --primary-900: Generated scale
    - --theme-error/warning/success: Semantic colors
  
COMPONENTS:
  - Replace throughout codebase:
    - orange-500 → primary-500
    - orange-600 → primary-600
    - Add hover:primary-600 variants
  
THEME SYNC:
  - Listen for theme changes in hacker-portal
  - Broadcast changes via localStorage events
  - Apply on all pages via layout effect
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
pnpm lint                         # Check linting
pnpm typecheck                    # Type checking

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests

```typescript
// CREATE lib/__tests__/theme-sync.test.ts
import { extractThemeColors, applyThemeColors, hexToHSL } from '../theme-sync'

describe('theme-sync', () => {
  describe('hexToHSL', () => {
    it('should convert hex colors to HSL', () => {
      expect(hexToHSL('#f97316')).toEqual({ h: 25, s: 95, l: 53 })
      expect(hexToHSL('f97316')).toEqual({ h: 25, s: 95, l: 53 })
    })
    
    it('should handle edge cases', () => {
      expect(hexToHSL('#000000')).toEqual({ h: 0, s: 0, l: 0 })
      expect(hexToHSL('#ffffff')).toEqual({ h: 0, s: 0, l: 100 })
    })
  })
  
  describe('extractThemeColors', () => {
    it('should extract colors from Monaco theme', async () => {
      const mockTheme = {
        colors: {
          'editor.background': '#272822',
          'editor.foreground': '#F8F8F2'
        },
        rules: []
      }
      
      const colors = await extractThemeColors(mockMonaco, 'test', false)
      expect(colors.background).toBe('#272822')
      expect(colors.foreground).toBe('#F8F8F2')
    })
    
    it('should provide fallbacks for missing colors', async () => {
      const mockTheme = { colors: {}, rules: [] }
      const colors = await extractThemeColors(mockMonaco, 'test', false)
      expect(colors.primary).toBe('#f97316') // Orange fallback
    })
  })
  
  describe('applyThemeColors', () => {
    it('should update CSS custom properties', () => {
      const colors = {
        background: '#1a1a1a',
        foreground: '#ffffff',
        primary: '#f97316',
        // ... other colors
      }
      
      applyThemeColors(colors)
      
      const root = document.documentElement
      expect(root.style.getPropertyValue('--primary')).toContain('25')
    })
  })
})
```

### Level 3: Manual Testing Checklist

```bash
# Visual and functional testing:
# - [ ] Select different Monaco themes and verify site colors update
# - [ ] Check that primary color (orange) changes to theme's accent
# - [ ] Verify all UI elements maintain readability
# - [ ] Test both light and dark mode themes
# - [ ] Confirm color transitions are smooth
# - [ ] Check localStorage persistence across page reloads
# - [ ] Verify color sync across multiple browser tabs
# - [ ] Test with built-in themes (vs, vs-dark)
# - [ ] Test with custom themes (Monokai, Dracula, etc.)
# - [ ] Ensure status colors (success/warning/error) remain distinguishable
# - [ ] Verify hover states work with new primary color
# - [ ] Check that all cards, buttons, and borders use themed colors
# - [ ] Test on different screen sizes (responsive)
# - [ ] Verify no color flashing on page load
```

## Final Validation Checklist

- [ ] All TypeScript compiles without errors: `pnpm typecheck`
- [ ] No linting errors: `pnpm lint`
- [ ] Theme colors extract correctly from Monaco
- [ ] CSS variables update dynamically
- [ ] Color transitions are smooth (300ms)
- [ ] All UI elements use themed colors
- [ ] Contrast ratios meet WCAG standards
- [ ] Theme preferences persist in localStorage
- [ ] Color sync works across browser tabs
- [ ] Cyberpunk aesthetic maintained
- [ ] No performance degradation
- [ ] Build succeeds: `pnpm build`

## Anti-Patterns to Avoid

- ❌ Don't hardcode color values - use CSS variables
- ❌ Don't skip contrast validation - ensure readability
- ❌ Don't apply colors without transitions - avoid jarring changes
- ❌ Don't forget fallback values - themes may be incomplete
- ❌ Don't mix color formats - stick to HSL for CSS variables
- ❌ Don't ignore theme loading state - colors need async handling
- ❌ Don't break existing themes - maintain backwards compatibility
- ❌ Don't forget to test edge cases - corrupted themes, missing colors

## Implementation Confidence Score: 8/10

High confidence due to:
- Clear Monaco theme structure documentation
- Existing theme loading implementation
- Well-defined CSS variable system
- Straightforward color mapping approach

Moderate complexity in:
- Extracting colors from different theme formats
- Ensuring contrast ratios across all themes
- Generating appropriate color scales