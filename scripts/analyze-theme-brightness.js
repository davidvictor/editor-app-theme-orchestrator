#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import all theme data files manually
const themes = {
  Active4D: require('../node_modules/monaco-themes/themes/Active4D.json'),
  'All Hallows Eve': require('../node_modules/monaco-themes/themes/All Hallows Eve.json'),
  Amy: require('../node_modules/monaco-themes/themes/Amy.json'),
  'Birds of Paradise': require('../node_modules/monaco-themes/themes/Birds of Paradise.json'),
  Blackboard: require('../node_modules/monaco-themes/themes/Blackboard.json'),
  'Brilliance Black': require('../node_modules/monaco-themes/themes/Brilliance Black.json'),
  'Brilliance Dull': require('../node_modules/monaco-themes/themes/Brilliance Dull.json'),
  'Chrome DevTools': require('../node_modules/monaco-themes/themes/Chrome DevTools.json'),
  'Clouds Midnight': require('../node_modules/monaco-themes/themes/Clouds Midnight.json'),
  Clouds: require('../node_modules/monaco-themes/themes/Clouds.json'),
  Cobalt: require('../node_modules/monaco-themes/themes/Cobalt.json'),
  Cobalt2: require('../node_modules/monaco-themes/themes/Cobalt2.json'),
  Dawn: require('../node_modules/monaco-themes/themes/Dawn.json'),
  'Dominion Day': require('../node_modules/monaco-themes/themes/Dominion Day.json'),
  Dracula: require('../node_modules/monaco-themes/themes/Dracula.json'),
  Dreamweaver: require('../node_modules/monaco-themes/themes/Dreamweaver.json'),
  Eiffel: require('../node_modules/monaco-themes/themes/Eiffel.json'),
  'Espresso Libre': require('../node_modules/monaco-themes/themes/Espresso Libre.json'),
  'GitHub Dark': require('../node_modules/monaco-themes/themes/GitHub Dark.json'),
  'GitHub Light': require('../node_modules/monaco-themes/themes/GitHub Light.json'),
  GitHub: require('../node_modules/monaco-themes/themes/GitHub.json'),
  IDLE: require('../node_modules/monaco-themes/themes/IDLE.json'),
  idleFingers: require('../node_modules/monaco-themes/themes/idleFingers.json'),
  iPlastic: require('../node_modules/monaco-themes/themes/iPlastic.json'),
  Katzenmilch: require('../node_modules/monaco-themes/themes/Katzenmilch.json'),
  krTheme: require('../node_modules/monaco-themes/themes/krTheme.json'),
  'Kuroir Theme': require('../node_modules/monaco-themes/themes/Kuroir Theme.json'),
  LAZY: require('../node_modules/monaco-themes/themes/LAZY.json'),
  'MagicWB (Amiga)': require('../node_modules/monaco-themes/themes/MagicWB (Amiga).json'),
  'Merbivore Soft': require('../node_modules/monaco-themes/themes/Merbivore Soft.json'),
  Merbivore: require('../node_modules/monaco-themes/themes/Merbivore.json'),
  monoindustrial: require('../node_modules/monaco-themes/themes/monoindustrial.json'),
  'Monokai Bright': require('../node_modules/monaco-themes/themes/Monokai Bright.json'),
  Monokai: require('../node_modules/monaco-themes/themes/Monokai.json'),
  'Night Owl': require('../node_modules/monaco-themes/themes/Night Owl.json'),
  Nord: require('../node_modules/monaco-themes/themes/Nord.json'),
  'Oceanic Next': require('../node_modules/monaco-themes/themes/Oceanic Next.json'),
  'Pastels on Dark': require('../node_modules/monaco-themes/themes/Pastels on Dark.json'),
  'Slush and Poppies': require('../node_modules/monaco-themes/themes/Slush and Poppies.json'),
  'Solarized-dark': require('../node_modules/monaco-themes/themes/Solarized-dark.json'),
  'Solarized-light': require('../node_modules/monaco-themes/themes/Solarized-light.json'),
  SpaceCadet: require('../node_modules/monaco-themes/themes/SpaceCadet.json'),
  Sunburst: require('../node_modules/monaco-themes/themes/Sunburst.json'),
  'Textmate (Mac Classic)': require('../node_modules/monaco-themes/themes/Textmate (Mac Classic).json'),
  'Tomorrow-Night-Blue': require('../node_modules/monaco-themes/themes/Tomorrow-Night-Blue.json'),
  'Tomorrow-Night-Bright': require('../node_modules/monaco-themes/themes/Tomorrow-Night-Bright.json'),
  'Tomorrow-Night-Eighties': require('../node_modules/monaco-themes/themes/Tomorrow-Night-Eighties.json'),
  'Tomorrow-Night': require('../node_modules/monaco-themes/themes/Tomorrow-Night.json'),
  Tomorrow: require('../node_modules/monaco-themes/themes/Tomorrow.json'),
  Twilight: require('../node_modules/monaco-themes/themes/Twilight.json'),
  'Upstream Sunburst': require('../node_modules/monaco-themes/themes/Upstream Sunburst.json'),
  'Vibrant Ink': require('../node_modules/monaco-themes/themes/Vibrant Ink.json'),
  Xcode_default: require('../node_modules/monaco-themes/themes/Xcode_default.json'),
  Zenburnesque: require('../node_modules/monaco-themes/themes/Zenburnesque.json'),
};

const BUILT_IN_THEMES = ['vs', 'vs-dark', 'hc-black', 'hc-light'];

// Convert hex to HSL
const hexToHSL = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// Ensure colors have # prefix
const ensureHash = (color) => {
  if (!color) return null;
  return color.startsWith('#') ? color : '#' + color;
};

// Extract background color from theme data
const extractBackgroundColor = (themeData) => {
  try {
    // Method 1: Check colors object (standard format)
    if (themeData.colors && themeData.colors['editor.background']) {
      return ensureHash(themeData.colors['editor.background']);
    }

    // Method 2: Check rules array (common in imported themes)
    if (themeData.rules && Array.isArray(themeData.rules)) {
      // Find the base rule (empty token) which contains background
      const baseRule = themeData.rules.find((r) => r.token === '');
      if (baseRule && baseRule.background) {
        return ensureHash(baseRule.background);
      }
    }

    // Method 3: Check if it's marked as dark theme
    if (themeData.base === 'vs-dark' || themeData.base === 'hc-black') {
      return '#1e1e1e'; // Default dark background
    } else if (themeData.base === 'vs' || themeData.base === 'hc-light') {
      return '#ffffff'; // Default light background
    }

    return null;
  } catch (error) {
    console.error('Error extracting background color:', error);
    return null;
  }
};

// Analyze themes and categorize by brightness
const analyzeThemes = () => {
  const categorization = {
    light: {},
    dark: {},
    builtIn: {
      light: [],
      dark: [],
    },
    statistics: {
      totalThemes: 0,
      lightThemes: 0,
      darkThemes: 0,
      averageLightness: {
        light: 0,
        dark: 0,
      },
    },
  };

  // Track lightness values for statistics
  const lightThemeLightness = [];
  const darkThemeLightness = [];

  console.log(`\nAnalyzing ${Object.keys(themes).length} themes...\n`);

  // Process built-in themes
  BUILT_IN_THEMES.forEach((themeName) => {
    if (themeName === 'vs' || themeName === 'hc-light') {
      categorization.builtIn.light.push(themeName);
    } else {
      categorization.builtIn.dark.push(themeName);
    }
  });

  // Process custom themes
  for (const [themeName, themeData] of Object.entries(themes)) {
    // Extract background color
    const backgroundColor = extractBackgroundColor(themeData);
    if (!backgroundColor) {
      console.warn(`⚠️  Could not extract background color for "${themeName}"`);
      continue;
    }

    // Calculate lightness
    const hsl = hexToHSL(backgroundColor);
    const lightness = hsl.l;

    // Create theme info
    const themeInfo = {
      displayName: themeName,
      background: backgroundColor,
      lightness,
    };

    // Categorize based on lightness
    if (lightness > 50) {
      categorization.light[themeName] = themeInfo;
      lightThemeLightness.push(lightness);
      categorization.statistics.lightThemes++;
    } else {
      categorization.dark[themeName] = themeInfo;
      darkThemeLightness.push(lightness);
      categorization.statistics.darkThemes++;
    }

    categorization.statistics.totalThemes++;
  }

  // Calculate average lightness
  if (lightThemeLightness.length > 0) {
    categorization.statistics.averageLightness.light = Math.round(
      lightThemeLightness.reduce((a, b) => a + b, 0) / lightThemeLightness.length
    );
  }
  if (darkThemeLightness.length > 0) {
    categorization.statistics.averageLightness.dark = Math.round(
      darkThemeLightness.reduce((a, b) => a + b, 0) / darkThemeLightness.length
    );
  }

  // Sort themes by lightness within each category
  const sortByLightness = (a, b) => b[1].lightness - a[1].lightness;

  categorization.light = Object.fromEntries(
    Object.entries(categorization.light).sort(sortByLightness)
  );
  categorization.dark = Object.fromEntries(
    Object.entries(categorization.dark).sort(sortByLightness)
  );

  return categorization;
};

// Generate TypeScript file content
const generateRegistryFile = (categorization) => {
  return `// Auto-generated theme brightness categorization
// Generated on: ${new Date().toISOString()}
// This file categorizes all Monaco themes as light or dark based on their background color lightness

export interface ThemeInfo {
  displayName: string
  background: string
  lightness: number
}

export interface ThemeBrightnessRegistry {
  light: Record<string, ThemeInfo>
  dark: Record<string, ThemeInfo>
  builtIn: {
    light: string[]
    dark: string[]
  }
  statistics: {
    totalThemes: number
    lightThemes: number
    darkThemes: number
    averageLightness: {
      light: number
      dark: number
    }
  }
}

export const THEME_BRIGHTNESS_REGISTRY: ThemeBrightnessRegistry = ${JSON.stringify(categorization, null, 2)}

// Helper functions
export function isLightTheme(themeName: string): boolean {
  // Check built-in themes
  if (THEME_BRIGHTNESS_REGISTRY.builtIn.light.includes(themeName)) {
    return true
  }
  if (THEME_BRIGHTNESS_REGISTRY.builtIn.dark.includes(themeName)) {
    return false
  }
  
  // Check custom themes
  return themeName in THEME_BRIGHTNESS_REGISTRY.light
}

export function isDarkTheme(themeName: string): boolean {
  return !isLightTheme(themeName)
}

export function getThemeInfo(themeName: string): ThemeInfo | null {
  return THEME_BRIGHTNESS_REGISTRY.light[themeName] || 
         THEME_BRIGHTNESS_REGISTRY.dark[themeName] || 
         null
}

export function getAllLightThemes(): string[] {
  return [
    ...THEME_BRIGHTNESS_REGISTRY.builtIn.light,
    ...Object.keys(THEME_BRIGHTNESS_REGISTRY.light)
  ]
}

export function getAllDarkThemes(): string[] {
  return [
    ...THEME_BRIGHTNESS_REGISTRY.builtIn.dark,
    ...Object.keys(THEME_BRIGHTNESS_REGISTRY.dark)
  ]
}

export function getThemeBrightness(themeName: string): 'light' | 'dark' | null {
  if (isLightTheme(themeName)) return 'light'
  if (isDarkTheme(themeName)) return 'dark'
  return null
}
`;
};

// Main execution
const main = () => {
  console.log('🎨 Monaco Theme Brightness Analyzer');
  console.log('=====================================');

  // Analyze themes
  const categorization = analyzeThemes();

  // Print statistics
  console.log('\n📊 Analysis Results:');
  console.log('-------------------');
  console.log(`Total themes analyzed: ${categorization.statistics.totalThemes}`);
  console.log(
    `Light themes: ${categorization.statistics.lightThemes} (avg lightness: ${categorization.statistics.averageLightness.light}%)`
  );
  console.log(
    `Dark themes: ${categorization.statistics.darkThemes} (avg lightness: ${categorization.statistics.averageLightness.dark}%)`
  );
  console.log(`Built-in light themes: ${categorization.builtIn.light.join(', ')}`);
  console.log(`Built-in dark themes: ${categorization.builtIn.dark.join(', ')}`);

  // Print sample themes
  console.log('\n🌞 Sample Light Themes:');
  Object.entries(categorization.light)
    .slice(0, 5)
    .forEach(([name, info]) => {
      console.log(`  - ${name}: ${info.background} (L: ${info.lightness}%)`);
    });

  console.log('\n🌙 Sample Dark Themes:');
  Object.entries(categorization.dark)
    .slice(0, 5)
    .forEach(([name, info]) => {
      console.log(`  - ${name}: ${info.background} (L: ${info.lightness}%)`);
    });

  // Generate and save registry file
  const registryContent = generateRegistryFile(categorization);
  const outputPath = path.join(process.cwd(), 'lib', 'theme-brightness-registry.ts');

  fs.writeFileSync(outputPath, registryContent, 'utf-8');
  console.log(`\n✅ Theme brightness registry saved to: ${outputPath}`);

  // Save JSON version for reference
  const jsonPath = path.join(process.cwd(), 'lib', 'theme-brightness-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(categorization, null, 2), 'utf-8');
  console.log(`📄 JSON data saved to: ${jsonPath}`);
};

// Run the script
main();
