# Monaco Editor Scripts

This folder contains utility scripts for the Monaco Editor theme system.

## analyze-theme-brightness.js

This script analyzes all Monaco themes and categorizes them as light or dark based on their background color lightness.

### What it does:

1. Loads all Monaco theme files from `node_modules/monaco-themes/themes/`
2. Extracts the background color from each theme
3. Calculates the lightness value using HSL conversion
4. Categorizes themes as light (lightness > 50%) or dark (lightness ≤ 50%)
5. Generates two output files:
   - `lib/theme-brightness-registry.ts` - TypeScript registry with helper functions
   - `lib/theme-brightness-data.json` - Raw JSON data for reference

### Usage:

```bash
node scripts/analyze-theme-brightness.js
```

### Output:

The script generates a comprehensive theme registry that includes:

- Categorized light and dark themes
- Theme information (display name, background color, lightness value)
- Built-in theme categorization (vs, vs-dark, hc-black, hc-light)
- Statistics about theme distribution
- Helper functions for theme categorization

### When to run:

Run this script when:

- You add new Monaco themes to the project
- You update the monaco-themes package
- You need to regenerate the theme brightness registry

The generated files are used by the theme system to properly categorize themes for the light/dark theme selector in the Hacker Portal.
