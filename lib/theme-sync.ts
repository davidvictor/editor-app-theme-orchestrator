import { Monaco } from "@monaco-editor/react"
import { getThemeData, isBuiltInTheme } from "./monaco-themes-registry"

// Interface for extracted theme colors - expanded to include Monaco neutral colors
export interface ExtractedThemeColors {
  // Core colors
  background: string           // Main editor background
  foreground: string          // Main editor foreground
  
  // UI Surface colors
  sidebarBackground: string   // Sidebar/navigation background
  sidebarForeground: string   // Sidebar text
  activityBarBackground: string // Activity bar (far left) background
  activityBarForeground: string // Activity bar text
  
  // Panel and card colors
  panelBackground: string     // Bottom panel background
  editorGroupBackground: string // Editor group/container background
  tabActiveBackground: string   // Active tab background
  tabInactiveBackground: string // Inactive tab background
  
  // Input and form colors
  inputBackground: string     // Input field background
  inputForeground: string     // Input field text
  inputBorder: string        // Input field border
  dropdownBackground: string  // Dropdown background
  
  // Interactive states
  listActiveBackground: string // Active/selected list item
  listHoverBackground: string  // Hover state background
  
  // Borders and separators
  border: string             // General border color
  contrastBorder: string     // High contrast border
  
  // Accent colors
  primary: string           // Main accent (keywords/functions)
  selection: string         // Selection background
  
  // Semantic colors
  error: string
  warning: string
  success: string
  info: string
  
  // Additional UI colors
  badgeBackground: string    // Badge/chip background
  badgeForeground: string    // Badge/chip text
  buttonBackground: string   // Button background
  buttonForeground: string   // Button text
}

// Color format converters
export interface HSLColor {
  h: number
  s: number
  l: number
}

// Convert hex to HSL
export const hexToHSL = (hex: string): HSLColor => {
  // Remove # if present
  hex = hex.replace(/^#/, '')
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// Convert HSL to hex
export const hslToHex = (hsl: HSLColor): string => {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Convert HSL to string format
export const hslToString = (hsl: HSLColor): string => {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

// Lighten a color by a percentage
export const lightenColor = (color: string, percent: number): string => {
  const hsl = hexToHSL(color)
  hsl.l = Math.min(100, hsl.l + percent)
  return hslToHex(hsl)
}

// Darken a color by a percentage
export const darkenColor = (color: string, percent: number): string => {
  const hsl = hexToHSL(color)
  hsl.l = Math.max(0, hsl.l - percent)
  return hslToHex(hsl)
}

// Mix two colors
export const mixColors = (color1: string, color2: string, ratio: number = 0.5): string => {
  const hsl1 = hexToHSL(color1)
  const hsl2 = hexToHSL(color2)
  
  return hslToHex({
    h: Math.round(hsl1.h * (1 - ratio) + hsl2.h * ratio),
    s: Math.round(hsl1.s * (1 - ratio) + hsl2.s * ratio),
    l: Math.round(hsl1.l * (1 - ratio) + hsl2.l * ratio)
  })
}

// Generate a scale of neutral colors based on background and foreground
export const generateNeutralScale = (bg: string, fg: string): string[] => {
  const scale: string[] = []
  const steps = 10
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1)
    scale.push(mixColors(bg, fg, ratio))
  }
  
  return scale
}

// Extract primary color from theme
const extractPrimaryColor = (themeData: any): string => {
  // Try to find keyword/function colors which are typically the accent
  const primarySources = [
    'keyword',
    'function',
    'variable.language',
    'support.function',
    'entity.name.function',
    'storage.type'
  ]
  
  if (themeData.rules && Array.isArray(themeData.rules)) {
    for (const source of primarySources) {
      const rule = themeData.rules.find((r: any) => 
        r.token === source || (r.scope && r.scope.includes(source))
      )
      if (rule && rule.foreground) {
        return rule.foreground.startsWith('#') ? rule.foreground : '#' + rule.foreground
      }
    }
  }
  
  // Fallback to orange if no primary color found
  return '#f97316'
}

// Extract semantic colors from theme
const extractSemanticColor = (themeData: any, tokenType: string, fallback: string): string => {
  if (themeData.rules && Array.isArray(themeData.rules)) {
    const rule = themeData.rules.find((r: any) => 
      r.token === tokenType || (r.scope && r.scope.includes(tokenType))
    )
    if (rule && rule.foreground) {
      return rule.foreground.startsWith('#') ? rule.foreground : '#' + rule.foreground
    }
  }
  return fallback
}

// Ensure colors have # prefix
const ensureHash = (color: string | undefined, fallback: string): string => {
  if (!color) return fallback
  return color.startsWith('#') ? color : '#' + color
}

// Extract colors from Monaco theme with robust fallbacks
export const extractThemeColors = async (
  monaco: Monaco,
  themeName: string,
  passedIsBuiltIn?: boolean
): Promise<ExtractedThemeColors> => {
  let themeData: any
  
  try {
    // First determine if theme is built-in
    const isBuiltIn = passedIsBuiltIn ?? isBuiltInTheme(themeName)
    
    // For custom themes, try to get from our comprehensive registry first
    if (!isBuiltIn) {
      themeData = getThemeData(themeName)
      if (themeData) {
        console.log('✅ Got theme data from registry:', themeName)
      }
    }
    
    // If no theme data yet, try Monaco's theme service
    if (!themeData) {
      const themeService = (monaco.editor as any)._themeService
      
      if (themeService) {
        // Try multiple methods to get theme data
        
        // Method 1: Direct from current theme
        if (themeService._theme) {
          const currentTheme = themeService._theme
          
          if (currentTheme.themeData) {
            themeData = currentTheme.themeData
            console.log('✅ Got theme data from current theme')
          } else if (currentTheme.tokenColors) {
            // Construct from tokenColors
            themeData = {
              base: currentTheme.base || (isBuiltIn && themeName.includes('light') ? 'vs' : 'vs-dark'),
              rules: currentTheme.tokenColors,
              colors: currentTheme.colors || {}
            }
            console.log('✅ Constructed theme data from tokenColors')
          }
        }
        
        // Method 2: From theme registry
        if (!themeData && themeService._themeRegistry) {
          const registry = themeService._themeRegistry
          const registeredTheme = registry.getTheme?.(themeName) || registry._themes?.get(themeName)
          if (registeredTheme) {
            themeData = registeredTheme.themeData || registeredTheme
            console.log('✅ Got theme data from theme registry')
          }
        }
      }
    }
    
    
    if (!themeData) {
      console.warn(`⚠️ Could not extract theme data for "${themeName}", using defaults`)
      return getDefaultColors(isBuiltIn, themeName)
    }
    
    console.log('Theme data structure:', {
      hasColors: !!themeData.colors,
      hasRules: !!themeData.rules,
      base: themeData.base,
      colorKeys: themeData.colors ? Object.keys(themeData.colors).slice(0, 10) : []
    })
    
    // Extract base colors - handle different theme formats
    let background: string
    let foreground: string
    
    // Check if this is a custom theme with rules format
    if (!themeData.colors && themeData.rules) {
      // Find the base background color from rules
      const bgRule = themeData.rules.find((r: any) => r.token === '')
      background = bgRule?.background ? ensureHash(bgRule.background, '#1e1e1e') : '#1e1e1e'
      
      // For foreground, we need to extract from the theme or use a default
      const fgRule = themeData.rules.find((r: any) => r.token === '' && r.foreground)
      foreground = fgRule?.foreground ? ensureHash(fgRule.foreground, '#f8f8f2') : '#f8f8f2'
      
      // If no foreground in base rule, look for common text tokens
      if (!fgRule || foreground === '#f8f8f2') {
        const textRule = themeData.rules.find((r: any) => 
          r.token === 'source' || r.token === 'text' || r.token === 'variable'
        )
        if (textRule?.foreground) {
          foreground = ensureHash(textRule.foreground, '#f8f8f2')
        }
      }
      
      console.log('Extracted from rules - bg:', background, 'fg:', foreground)
    } else {
      // Standard theme with colors object
      background = ensureHash(
        themeData.colors?.['editor.background'],
        themeData.base === 'vs' ? '#ffffff' : '#1e1e1e'
      )
      foreground = ensureHash(
        themeData.colors?.['editor.foreground'],
        themeData.base === 'vs' ? '#000000' : '#cccccc'
      )
    }
    
    // Determine if theme is dark
    const isDark = hexToHSL(background).l < 50
    
    // Generate neutral scale for fallbacks
    const neutralScale = generateNeutralScale(background, foreground)
    
    // Extract all UI colors with intelligent fallbacks
    const colors: ExtractedThemeColors = {
      // Core colors
      background,
      foreground,
      
      // Sidebar colors
      sidebarBackground: ensureHash(
        themeData.colors?.['sideBar.background'],
        isDark ? lightenColor(background, 3) : darkenColor(background, 3)
      ),
      sidebarForeground: ensureHash(
        themeData.colors?.['sideBar.foreground'],
        foreground
      ),
      
      // Activity bar colors
      activityBarBackground: ensureHash(
        themeData.colors?.['activityBar.background'],
        isDark ? lightenColor(background, 5) : darkenColor(background, 5)
      ),
      activityBarForeground: ensureHash(
        themeData.colors?.['activityBar.foreground'],
        foreground
      ),
      
      // Panel and editor group colors
      panelBackground: ensureHash(
        themeData.colors?.['panel.background'],
        isDark ? lightenColor(background, 2) : darkenColor(background, 2)
      ),
      editorGroupBackground: ensureHash(
        themeData.colors?.['editorGroup.background'] || themeData.colors?.['editorGroup.header.tabsBackground'],
        background
      ),
      
      // Tab colors
      tabActiveBackground: ensureHash(
        themeData.colors?.['tab.activeBackground'],
        background
      ),
      tabInactiveBackground: ensureHash(
        themeData.colors?.['tab.inactiveBackground'],
        isDark ? lightenColor(background, 4) : darkenColor(background, 4)
      ),
      
      // Input colors
      inputBackground: ensureHash(
        themeData.colors?.['input.background'],
        isDark ? lightenColor(background, 5) : darkenColor(background, 5)
      ),
      inputForeground: ensureHash(
        themeData.colors?.['input.foreground'],
        foreground
      ),
      inputBorder: ensureHash(
        themeData.colors?.['input.border'],
        neutralScale[2]
      ),
      dropdownBackground: ensureHash(
        themeData.colors?.['dropdown.background'],
        isDark ? lightenColor(background, 5) : darkenColor(background, 5)
      ),
      
      // List colors
      listActiveBackground: ensureHash(
        themeData.colors?.['list.activeSelectionBackground'],
        isDark ? lightenColor(background, 10) : darkenColor(background, 10)
      ),
      listHoverBackground: ensureHash(
        themeData.colors?.['list.hoverBackground'],
        isDark ? lightenColor(background, 5) : darkenColor(background, 5)
      ),
      
      // Borders
      border: ensureHash(
        themeData.colors?.['editorGroup.border'] || themeData.colors?.['panel.border'],
        neutralScale[2]
      ),
      contrastBorder: ensureHash(
        themeData.colors?.['contrastBorder'],
        neutralScale[3]
      ),
      
      // Accent colors
      primary: extractPrimaryColor(themeData),
      selection: ensureHash(
        themeData.colors?.['editor.selectionBackground'],
        '#264f78'
      ),
      
      // Semantic colors
      error: extractSemanticColor(themeData, 'invalid', '#f44747'),
      warning: extractSemanticColor(themeData, 'warning', '#ffcc00'),
      success: extractSemanticColor(themeData, 'string', '#89d185'),
      info: extractSemanticColor(themeData, 'type', '#4ec9b0'),
      
      // Additional UI colors
      badgeBackground: ensureHash(
        themeData.colors?.['badge.background'],
        extractPrimaryColor(themeData)
      ),
      badgeForeground: ensureHash(
        themeData.colors?.['badge.foreground'],
        '#ffffff'
      ),
      buttonBackground: ensureHash(
        themeData.colors?.['button.background'],
        extractPrimaryColor(themeData)
      ),
      buttonForeground: ensureHash(
        themeData.colors?.['button.foreground'],
        '#ffffff'
      )
    }
    
    return colors
  } catch (error) {
    console.error('❌ Error extracting theme colors:', error)
    return getDefaultColors(passedIsBuiltIn ?? isBuiltInTheme(themeName), themeName)
  }
}

// Default colors fallback with theme awareness
const getDefaultColors = (isBuiltIn: boolean = false, themeName: string = ''): ExtractedThemeColors => {
  // Provide sensible defaults based on theme type
  const isLightTheme = themeName.toLowerCase().includes('light') || themeName === 'vs'
  const isDarkTheme = !isLightTheme
  
  return isDarkTheme ? {
    // Dark theme defaults
    background: '#1a1a1a',
    foreground: '#f8f8f2',
    sidebarBackground: '#1e1e1e',
    sidebarForeground: '#f8f8f2',
    activityBarBackground: '#252526',
    activityBarForeground: '#f8f8f2',
    panelBackground: '#1e1e1e',
    editorGroupBackground: '#1a1a1a',
    tabActiveBackground: '#1a1a1a',
    tabInactiveBackground: '#2d2d30',
    inputBackground: '#3c3c3c',
    inputForeground: '#cccccc',
    inputBorder: '#3c3c3c',
    dropdownBackground: '#3c3c3c',
    listActiveBackground: '#094771',
    listHoverBackground: '#2a2d2e',
    border: '#303030',
    contrastBorder: '#6fc3df',
    primary: '#f97316',
    selection: '#264f78',
    error: '#f44747',
    warning: '#ffcc00',
    success: '#89d185',
    info: '#4ec9b0',
    badgeBackground: '#f97316',
    badgeForeground: '#ffffff',
    buttonBackground: '#f97316',
    buttonForeground: '#ffffff'
  } : {
    // Light theme defaults
    background: '#ffffff',
    foreground: '#000000',
    sidebarBackground: '#f3f3f3',
    sidebarForeground: '#000000',
    activityBarBackground: '#2c2c2c',
    activityBarForeground: '#ffffff',
    panelBackground: '#f3f3f3',
    editorGroupBackground: '#ffffff',
    tabActiveBackground: '#ffffff',
    tabInactiveBackground: '#ececec',
    inputBackground: '#ffffff',
    inputForeground: '#000000',
    inputBorder: '#cecece',
    dropdownBackground: '#ffffff',
    listActiveBackground: '#0060c0',
    listHoverBackground: '#e8e8e8',
    border: '#e5e5e5',
    contrastBorder: '#6fc3df',
    primary: '#f97316',
    selection: '#add6ff',
    error: '#d60a0a',
    warning: '#ff8c00',
    success: '#4b8b3b',
    info: '#007acc',
    badgeBackground: '#f97316',
    badgeForeground: '#ffffff',
    buttonBackground: '#f97316',
    buttonForeground: '#ffffff'
  }
}

// Apply theme colors to CSS variables
export const applyThemeColors = (colors: ExtractedThemeColors) => {
  const root = document.documentElement
  
  // Helper to set CSS variable with HSL conversion
  const setHSLVariable = (varName: string, hexColor: string) => {
    const hsl = hexToHSL(hexColor)
    root.style.setProperty(`--${varName}`, hslToString(hsl))
  }
  
  // Core colors
  setHSLVariable('background', colors.background)
  setHSLVariable('foreground', colors.foreground)
  
  // Card and popover use sidebar background for elevated surfaces
  setHSLVariable('card', colors.sidebarBackground)
  setHSLVariable('card-foreground', colors.sidebarForeground)
  setHSLVariable('popover', colors.sidebarBackground)
  setHSLVariable('popover-foreground', colors.sidebarForeground)
  
  // Primary with generated scale
  const primaryHSL = hexToHSL(colors.primary)
  setHSLVariable('primary', colors.primary)
  setHSLVariable('primary-foreground', colors.buttonForeground)
  
  // Generate primary scale
  const lightness = [97, 89, 78, 64, 58, 53, 48, 40, 34, 28]
  const saturation = [97, 97, 96, 94, 94, 95, 90, 88, 79, 75]
  
  lightness.forEach((l, i) => {
    const shade = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900][i]
    root.style.setProperty(
      `--primary-${shade}`,
      `${primaryHSL.h} ${saturation[i]}% ${l}%`
    )
  })
  
  // Secondary uses input background
  setHSLVariable('secondary', colors.inputBackground)
  setHSLVariable('secondary-foreground', colors.inputForeground)
  
  // Muted uses a mix between background and foreground
  const mutedColor = mixColors(colors.background, colors.foreground, 0.1)
  setHSLVariable('muted', mutedColor)
  setHSLVariable('muted-foreground', mixColors(colors.foreground, colors.background, 0.4))
  
  // Accent uses list active background
  setHSLVariable('accent', colors.listActiveBackground)
  setHSLVariable('accent-foreground', colors.foreground)
  
  // Borders
  setHSLVariable('border', colors.border)
  setHSLVariable('input', colors.inputBackground)
  setHSLVariable('ring', colors.primary)
  
  // Sidebar colors
  setHSLVariable('sidebar-background', colors.activityBarBackground)
  setHSLVariable('sidebar-foreground', colors.activityBarForeground)
  setHSLVariable('sidebar-primary', colors.primary)
  setHSLVariable('sidebar-primary-foreground', colors.buttonForeground)
  setHSLVariable('sidebar-accent', colors.listHoverBackground)
  setHSLVariable('sidebar-accent-foreground', colors.foreground)
  setHSLVariable('sidebar-border', colors.border)
  setHSLVariable('sidebar-ring', colors.primary)
  
  // Semantic colors
  setHSLVariable('destructive', colors.error)
  setHSLVariable('destructive-foreground', colors.buttonForeground)
  setHSLVariable('status-error', colors.error)
  setHSLVariable('status-warning', colors.warning)
  setHSLVariable('status-success', colors.success)
  setHSLVariable('status-info', colors.info)
  
  // Chart colors - derive from theme
  const isDark = hexToHSL(colors.background).l < 50
  if (isDark) {
    setHSLVariable('chart-1', colors.info)
    setHSLVariable('chart-2', colors.success)
    setHSLVariable('chart-3', colors.warning)
    setHSLVariable('chart-4', colors.error)
    setHSLVariable('chart-5', colors.primary)
  } else {
    setHSLVariable('chart-1', darkenColor(colors.info, 10))
    setHSLVariable('chart-2', darkenColor(colors.success, 10))
    setHSLVariable('chart-3', darkenColor(colors.warning, 10))
    setHSLVariable('chart-4', darkenColor(colors.error, 10))
    setHSLVariable('chart-5', darkenColor(colors.primary, 10))
  }
}

// Save theme colors to localStorage
export const saveThemeColors = (theme: 'light' | 'dark', colors: ExtractedThemeColors) => {
  localStorage.setItem(`monaco-theme-colors-${theme}`, JSON.stringify(colors))
}

// Load theme colors from localStorage
export const loadThemeColors = (theme: 'light' | 'dark'): ExtractedThemeColors | null => {
  try {
    const saved = localStorage.getItem(`monaco-theme-colors-${theme}`)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load saved theme colors:', error)
  }
  return null
}