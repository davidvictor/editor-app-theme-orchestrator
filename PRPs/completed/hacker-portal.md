# Hacker Portal Feature PRP

## Feature Overview
Create a new page called "Hacker Portal" with a Monaco editor as the main card, alongside controls for theme selection and live configuration editing. The editor theme will automatically sync with the application's dark/light mode, with separate theme preferences stored in localStorage.

## Key Requirements
1. New page accessible via navigation: "Hacker Portal"
2. Main card containing Monaco editor
3. Side card with dropdown for theme selection (separate for dark/light modes)
4. Side card with editor for live Monaco configuration editing
5. Automatic theme switching based on application theme mode
6. Local storage persistence for themes and configuration

## Implementation Context

### Existing Patterns to Follow

#### Theme Management Pattern (from components/theme-toggle.tsx)
```tsx
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // theme will be "light" or "dark"
}
```

#### Page Creation Pattern (from app/command-center/page.tsx)
```tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HackerPortalPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cards go here */}
      </div>
    </div>
  )
}
```

#### Navigation Integration (from app/page.tsx:42-47)
```tsx
// Add to navigationItems array
{ id: "hacker-portal", icon: Code2, label: "HACKER PORTAL" }

// Add to conditional rendering (line 108-113)
{activeSection === "hacker-portal" && <HackerPortalPage />}
```

### Monaco Editor Integration

Package already installed: `@monaco-editor/react@4.7.0-rc.0`

#### Basic Editor Setup with Theme Sync
```tsx
import Editor from '@monaco-editor/react'
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

// Local storage keys
const STORAGE_KEYS = {
  LIGHT_THEME: 'monaco-light-theme',
  DARK_THEME: 'monaco-dark-theme',
  CONFIG: 'monaco-editor-config',
  CODE: 'monaco-editor-code'
}

// Inside component
const { theme } = useTheme()
const [lightTheme, setLightTheme] = useState('vs')
const [darkTheme, setDarkTheme] = useState('vs-dark')
const [editorOptions, setEditorOptions] = useState({})

// Load from localStorage on mount
useEffect(() => {
  setLightTheme(localStorage.getItem(STORAGE_KEYS.LIGHT_THEME) || 'vs')
  setDarkTheme(localStorage.getItem(STORAGE_KEYS.DARK_THEME) || 'vs-dark')
  const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG)
  if (savedConfig) {
    try {
      setEditorOptions(JSON.parse(savedConfig))
    } catch {}
  }
}, [])

// Determine current theme
const currentTheme = theme === 'dark' ? darkTheme : lightTheme

<Editor
  height="100%"
  defaultLanguage="javascript"
  theme={currentTheme}
  value={code}
  options={editorOptions}
  onMount={handleEditorDidMount}
/>
```

### Available Themes

#### Built-in Themes
- `vs` (light)
- `vs-dark`
- `hc-black` (high contrast)
- `hc-light` (high contrast)

#### Monaco-Themes Package Themes
Documentation: https://github.com/brijeshb42/monaco-themes
- Active4D, All Hallows Eve, Amy, Birds of Paradise, Blackboard
- Brilliance Black, Brilliance Dull, Chrome DevTools, Clouds, Clouds Midnight
- Cobalt, Cobalt2, Dawn, Dracula, Dreamweaver, Eiffel, Espresso Libre
- GitHub, GitHub Dark, GitHub Light, IDLE, Katzenmilch, Kuroir Theme
- LAZY, MagicWB (Amiga), Merbivore, Merbivore Soft, Monokai, Monokai Bright
- Night Owl, Nord, Oceanic Next, Pastels on Dark

### Dynamic Configuration

Reference: https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IGlobalEditorOptions.html

```tsx
// Update configuration dynamically
editorRef.current?.updateOptions(newOptions)
```

Common Configuration Options:
- fontSize, fontFamily, lineNumbers, minimap
- wordWrap, theme, automaticLayout
- suggestOnTriggerCharacters, acceptSuggestionOnCommitCharacter
- acceptSuggestionOnEnter, accessibilitySupport
- autoClosingBrackets, autoClosingQuotes
- autoIndent, bracketPairColorization
- cursorBlinking, cursorStyle
- folding, formatOnPaste, formatOnType

## Implementation Blueprint

### Pseudocode
```
1. Create app/hacker-portal/page.tsx
   - Import Editor from @monaco-editor/react
   - Import useTheme from next-themes
   - Set up state for: lightTheme, darkTheme, editorOptions, code
   - Load saved preferences from localStorage on mount
   - Create main editor card (lg:col-span-8)
   - Create theme selector card (lg:col-span-4)
     - Show current mode (light/dark)
     - Dropdown for light theme selection
     - Dropdown for dark theme selection
   - Create config editor card (lg:col-span-4)

2. Update app/page.tsx
   - Import Code2 icon from lucide-react
   - Add navigation item
   - Import HackerPortalPage
   - Add conditional rendering

3. Theme Management
   - Create theme list constant
   - Implement separate handlers for light/dark theme changes
   - Save theme selections to localStorage
   - Load custom themes from monaco-themes
   - Auto-switch theme based on app theme mode

4. Configuration Editor
   - Use second Monaco editor instance with JSON language
   - Initialize with current editorOptions
   - Parse JSON configuration on change
   - Save valid config to localStorage
   - Apply changes on edit with error handling

5. Persistence Layer
   - Save/load light theme preference
   - Save/load dark theme preference
   - Save/load editor configuration
   - Save/load editor code content
```

## Tasks to Complete

1. Create the Hacker Portal page component at `app/hacker-portal/page.tsx`
2. Set up state management for light/dark themes, configuration, and code
3. Implement localStorage hooks for persistence
4. Implement the main Monaco editor card with theme sync
5. Create theme selector card with separate light/dark dropdowns
6. Implement configuration editor card with JSON validation
7. Add theme loading logic for monaco-themes
8. Update navigation in `app/page.tsx`
9. Add error handling for invalid configuration
10. Test automatic theme switching with app theme toggle
11. Verify localStorage persistence across sessions
12. Ensure responsive layout matches existing pages

## Gotchas & Considerations

1. **Theme Loading**: Custom themes from monaco-themes need to be imported dynamically
2. **Configuration Validation**: JSON parsing for config editor needs error handling
3. **Editor Refs**: Need to store editor instance refs for dynamic updates
4. **Performance**: Large configuration objects may impact performance
5. **Mobile Layout**: Consider stacking cards vertically on mobile
6. **Theme Sync**: useTheme hook needs mounted check to avoid hydration issues
7. **LocalStorage**: Need to handle SSR - localStorage only available client-side
8. **Theme Switching**: Monaco editor instance needs to be available before setTheme

## Error Handling Strategy

```tsx
// Configuration parsing with localStorage save
try {
  const newOptions = JSON.parse(configText)
  editorRef.current?.updateOptions(newOptions)
  localStorage.setItem(STORAGE_KEYS.CONFIG, configText)
  setConfigError('')
} catch (error) {
  setConfigError('Invalid JSON configuration')
}

// Theme loading with persistence
try {
  const themeData = await import(`monaco-themes/themes/${themeName}.json`)
  monaco.editor.defineTheme(themeName, themeData)
  
  // Save theme based on current mode
  if (theme === 'dark') {
    setDarkTheme(themeName)
    localStorage.setItem(STORAGE_KEYS.DARK_THEME, themeName)
  } else {
    setLightTheme(themeName)
    localStorage.setItem(STORAGE_KEYS.LIGHT_THEME, themeName)
  }
} catch (error) {
  // Fallback to built-in theme
  console.error('Failed to load theme:', themeName)
}

// Safe localStorage access
const safeGetItem = (key: string, defaultValue: string = '') => {
  if (typeof window === 'undefined') return defaultValue
  return localStorage.getItem(key) || defaultValue
}
```

## Validation Gates

```bash
# TypeScript/Linting
pnpm typecheck && pnpm lint

# Build verification
pnpm build

# Manual testing checklist:
# - [ ] Navigation to Hacker Portal works
# - [ ] Monaco editor loads with default content
# - [ ] Light theme dropdown shows when app is in light mode
# - [ ] Dark theme dropdown shows when app is in dark mode
# - [ ] Theme changes apply immediately to editor
# - [ ] Theme selections persist in localStorage
# - [ ] Toggling app theme switches editor theme automatically
# - [ ] Configuration editor loads with current config
# - [ ] Configuration changes apply live
# - [ ] Invalid configuration shows error message
# - [ ] Valid configuration saves to localStorage
# - [ ] Editor code content persists across page reloads
# - [ ] All saved preferences load correctly on page refresh
# - [ ] Responsive layout works on mobile
```

## Implementation Confidence Score: 9/10

High confidence due to:
- Clear existing patterns in codebase
- Monaco editor already installed
- Comprehensive theme list available
- Well-documented Monaco API
- Similar card-based layouts already implemented

Minor uncertainty around:
- Exact monaco-themes import syntax (may need adjustment)