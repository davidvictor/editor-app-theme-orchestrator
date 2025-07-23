import { Monaco } from '@monaco-editor/react';
import {
  extractThemeColors,
  applyThemeColors,
  saveThemeColors,
  loadThemeColors,
  ExtractedThemeColors,
} from './theme-sync';
import { BUILT_IN_THEMES, DEFAULT_THEMES_USE_APP_CSS, STORAGE_KEYS } from './hacker-portal-config';

// Singleton to prevent multiple theme applications
class ThemeApplicationManager {
  private static instance: ThemeApplicationManager;
  private isApplying = false;
  private lastAppliedTheme: string | null = null;
  private monacoInstance: Monaco | null = null;

  private constructor() {}

  static getInstance(): ThemeApplicationManager {
    if (!ThemeApplicationManager.instance) {
      ThemeApplicationManager.instance = new ThemeApplicationManager();
    }
    return ThemeApplicationManager.instance;
  }

  setMonacoInstance(monaco: Monaco | null) {
    this.monacoInstance = monaco;
  }

  /**
   * Apply saved theme colors without Monaco instance
   * Used on app startup and theme toggle when not on HackerPortal
   */
  async applySavedThemeColors(themeName: string): Promise<boolean> {
    // Validate theme name - if empty or invalid, use defaults
    if (!themeName || themeName.trim() === '') {
      console.log('[ThemeApplication] Empty theme name provided, using default CSS');
      this.resetThemeColors();
      this.lastAppliedTheme = null;
      return false;
    }

    // Prevent duplicate applications
    if (this.isApplying) {
      console.log(`[ThemeApplication] Theme application already in progress`);
      return true;
    }

    this.isApplying = true;

    try {
      // Check if this is a default theme that should use app CSS
      if (DEFAULT_THEMES_USE_APP_CSS.includes(themeName)) {
        console.log(`[ThemeApplication] ${themeName} is a default theme, using app CSS`);
        // Reset any previously applied theme colors to let CSS take over
        this.resetThemeColors();
        this.lastAppliedTheme = null;
        return false;
      }

      // Try to load saved colors for non-default themes
      const savedColors = loadThemeColors(themeName);
      if (savedColors) {
        console.log(`[ThemeApplication] Applying saved colors for ${themeName}`);
        applyThemeColors(savedColors);
        this.lastAppliedTheme = themeName;
        return true;
      }

      console.log(
        `[ThemeApplication] No saved colors for ${themeName}, letting default CSS handle theme`
      );
      // Reset any previously applied theme colors to let CSS take over
      this.resetThemeColors();
      this.lastAppliedTheme = null;
      return false;
    } finally {
      this.isApplying = false;
    }
  }

  /**
   * Reset theme colors to let default CSS handle theming
   */
  private resetThemeColors() {
    const root = document.documentElement;
    // Remove all CSS variables that we set
    const cssVars = [
      'background',
      'foreground',
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
      'primary',
      'primary-foreground',
      'secondary',
      'secondary-foreground',
      'muted',
      'muted-foreground',
      'accent',
      'accent-foreground',
      'destructive',
      'destructive-foreground',
      'border',
      'input',
      'ring',
      'sidebar-background',
      'sidebar-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-accent',
      'sidebar-accent-foreground',
      'sidebar-border',
      'sidebar-ring',
      'status-error',
      'status-warning',
      'status-success',
      'status-info',
      'chart-1',
      'chart-2',
      'chart-3',
      'chart-4',
      'chart-5',
    ];

    // Also remove primary scale
    for (let i = 50; i <= 900; i += i === 50 ? 50 : 100) {
      cssVars.push(`primary-${i}`);
    }

    cssVars.forEach((varName) => {
      root.style.removeProperty(`--${varName}`);
    });

    console.log('[ThemeApplication] Reset theme colors to defaults');
  }

  /**
   * Extract and apply theme colors from Monaco instance
   * Used when Monaco is loaded and theme is changed in HackerPortal
   */
  async extractAndApplyTheme(themeName: string): Promise<ExtractedThemeColors | null> {
    if (!this.monacoInstance) {
      console.warn('[ThemeApplication] No Monaco instance available');
      return null;
    }

    // Check if this is a default theme that should use app CSS
    if (DEFAULT_THEMES_USE_APP_CSS.includes(themeName)) {
      console.log(`[ThemeApplication] ${themeName} is a default theme, skipping color extraction`);
      // Reset any previously applied theme colors to let CSS take over
      this.resetThemeColors();
      this.lastAppliedTheme = null;
      return null;
    }

    // Prevent duplicate applications
    if (this.isApplying) {
      console.log(`[ThemeApplication] Theme application already in progress`);
      return null;
    }

    this.isApplying = true;

    try {
      const isBuiltIn = BUILT_IN_THEMES.includes(themeName);
      console.log(`[ThemeApplication] Extracting theme: ${themeName} (built-in: ${isBuiltIn})`);

      // Extract colors from Monaco
      const colors = await extractThemeColors(this.monacoInstance, themeName, isBuiltIn);

      // Apply to the app
      applyThemeColors(colors);

      // Save for future use
      saveThemeColors(themeName, colors);

      this.lastAppliedTheme = themeName;

      console.log(`[ThemeApplication] Theme ${themeName} applied successfully`);
      return colors;
    } catch (error) {
      console.error(`[ThemeApplication] Failed to extract/apply theme ${themeName}:`, error);
      return null;
    } finally {
      this.isApplying = false;
    }
  }

  /**
   * Load Monaco theme definition (for custom themes)
   */
  async loadMonacoTheme(themeName: string, monaco: Monaco): Promise<string | null> {
    if (BUILT_IN_THEMES.includes(themeName)) {
      return themeName;
    }

    try {
      const themeId = themeName.replace(/\s+/g, '-').toLowerCase();
      const themeData = await import(`monaco-themes/themes/${themeName}.json`);
      monaco.editor.defineTheme(themeId, themeData);
      return themeId;
    } catch (error) {
      console.error(`[ThemeApplication] Failed to load theme ${themeName}:`, error);
      return null;
    }
  }

  /**
   * Reset the last applied theme (useful when switching between light/dark modes)
   */
  resetLastApplied() {
    this.lastAppliedTheme = null;
  }

  /**
   * Get the current theme based on mode
   */
  getCurrentTheme(mode: string): string {
    if (typeof window === 'undefined') return mode === 'dark' ? 'vs-dark' : 'vs';

    const lightTheme = localStorage.getItem(STORAGE_KEYS.LIGHT_THEME);
    const darkTheme = localStorage.getItem(STORAGE_KEYS.DARK_THEME);

    // Always provide defaults if localStorage is empty
    const actualLightTheme = lightTheme || 'vs';
    const actualDarkTheme = darkTheme || 'vs-dark';

    return mode === 'dark' ? actualDarkTheme : actualLightTheme;
  }

  /**
   * Reset themes to defaults
   */
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;

    // Clear theme storage
    localStorage.removeItem(STORAGE_KEYS.LIGHT_THEME);
    localStorage.removeItem(STORAGE_KEYS.DARK_THEME);

    // Clear any saved theme colors
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('monaco-theme-colors-')) {
        localStorage.removeItem(key);
      }
    });

    // Reset CSS variables
    this.resetThemeColors();
    this.lastAppliedTheme = null;

    console.log('[ThemeApplication] Reset to default themes');
  }
}

// Export singleton instance
export const themeApplication = ThemeApplicationManager.getInstance();
