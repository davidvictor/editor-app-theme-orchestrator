// Comprehensive Monaco themes registry with all available themes
// This file provides a robust, battle-tested utility for theme identification and extraction

// Import all theme data files
import Active4D from 'monaco-themes/themes/Active4D.json'
import AllHallowsEve from 'monaco-themes/themes/All Hallows Eve.json'
import Amy from 'monaco-themes/themes/Amy.json'
import BirdsOfParadise from 'monaco-themes/themes/Birds of Paradise.json'
import Blackboard from 'monaco-themes/themes/Blackboard.json'
import BrillianceBlack from 'monaco-themes/themes/Brilliance Black.json'
import BrillianceDull from 'monaco-themes/themes/Brilliance Dull.json'
import ChromeDevTools from 'monaco-themes/themes/Chrome DevTools.json'
import CloudsMidnight from 'monaco-themes/themes/Clouds Midnight.json'
import Clouds from 'monaco-themes/themes/Clouds.json'
import Cobalt from 'monaco-themes/themes/Cobalt.json'
import Cobalt2 from 'monaco-themes/themes/Cobalt2.json'
import Dawn from 'monaco-themes/themes/Dawn.json'
import DominionDay from 'monaco-themes/themes/Dominion Day.json'
import Dracula from 'monaco-themes/themes/Dracula.json'
import Dreamweaver from 'monaco-themes/themes/Dreamweaver.json'
import Eiffel from 'monaco-themes/themes/Eiffel.json'
import EspressoLibre from 'monaco-themes/themes/Espresso Libre.json'
import GitHubDark from 'monaco-themes/themes/GitHub Dark.json'
import GitHubLight from 'monaco-themes/themes/GitHub Light.json'
import GitHub from 'monaco-themes/themes/GitHub.json'
import IDLE from 'monaco-themes/themes/IDLE.json'
import idleFingers from 'monaco-themes/themes/idleFingers.json'
import iPlastic from 'monaco-themes/themes/iPlastic.json'
import Katzenmilch from 'monaco-themes/themes/Katzenmilch.json'
import krTheme from 'monaco-themes/themes/krTheme.json'
import KuroirTheme from 'monaco-themes/themes/Kuroir Theme.json'
import LAZY from 'monaco-themes/themes/LAZY.json'
import MagicWBAmiga from 'monaco-themes/themes/MagicWB (Amiga).json'
import MerbivoreSoft from 'monaco-themes/themes/Merbivore Soft.json'
import Merbivore from 'monaco-themes/themes/Merbivore.json'
import monoindustrial from 'monaco-themes/themes/monoindustrial.json'
import MonokaiBright from 'monaco-themes/themes/Monokai Bright.json'
import Monokai from 'monaco-themes/themes/Monokai.json'
import NightOwl from 'monaco-themes/themes/Night Owl.json'
import Nord from 'monaco-themes/themes/Nord.json'
import OceanicNext from 'monaco-themes/themes/Oceanic Next.json'
import PastelsOnDark from 'monaco-themes/themes/Pastels on Dark.json'
import SlushAndPoppies from 'monaco-themes/themes/Slush and Poppies.json'
import SolarizedDark from 'monaco-themes/themes/Solarized-dark.json'
import SolarizedLight from 'monaco-themes/themes/Solarized-light.json'
import SpaceCadet from 'monaco-themes/themes/SpaceCadet.json'
import Sunburst from 'monaco-themes/themes/Sunburst.json'
import TextmateMacClassic from 'monaco-themes/themes/Textmate (Mac Classic).json'
import TomorrowNightBlue from 'monaco-themes/themes/Tomorrow-Night-Blue.json'
import TomorrowNightBright from 'monaco-themes/themes/Tomorrow-Night-Bright.json'
import TomorrowNightEighties from 'monaco-themes/themes/Tomorrow-Night-Eighties.json'
import TomorrowNight from 'monaco-themes/themes/Tomorrow-Night.json'
import Tomorrow from 'monaco-themes/themes/Tomorrow.json'
import Twilight from 'monaco-themes/themes/Twilight.json'
import UpstreamSunburst from 'monaco-themes/themes/Upstream Sunburst.json'
import VibrantInk from 'monaco-themes/themes/Vibrant Ink.json'
import XcodeDefault from 'monaco-themes/themes/Xcode_default.json'
import Zenburnesque from 'monaco-themes/themes/Zenburnesque.json'

// Comprehensive theme registry with all variations of theme names
export const THEME_REGISTRY: Record<string, any> = {
  // Active4D
  'Active4D': Active4D,
  'active4d': Active4D,
  'active-4-d': Active4D,
  
  // All Hallows Eve
  'All Hallows Eve': AllHallowsEve,
  'all-hallows-eve': AllHallowsEve,
  'AllHallowsEve': AllHallowsEve,
  
  // Amy
  'Amy': Amy,
  'amy': Amy,
  
  // Birds of Paradise
  'Birds of Paradise': BirdsOfParadise,
  'birds-of-paradise': BirdsOfParadise,
  'BirdsOfParadise': BirdsOfParadise,
  
  // Blackboard
  'Blackboard': Blackboard,
  'blackboard': Blackboard,
  
  // Brilliance Black
  'Brilliance Black': BrillianceBlack,
  'brilliance-black': BrillianceBlack,
  'BrillianceBlack': BrillianceBlack,
  
  // Brilliance Dull
  'Brilliance Dull': BrillianceDull,
  'brilliance-dull': BrillianceDull,
  'BrillianceDull': BrillianceDull,
  
  // Chrome DevTools
  'Chrome DevTools': ChromeDevTools,
  'chrome-devtools': ChromeDevTools,
  'ChromeDevTools': ChromeDevTools,
  
  // Clouds Midnight
  'Clouds Midnight': CloudsMidnight,
  'clouds-midnight': CloudsMidnight,
  'CloudsMidnight': CloudsMidnight,
  
  // Clouds
  'Clouds': Clouds,
  'clouds': Clouds,
  
  // Cobalt
  'Cobalt': Cobalt,
  'cobalt': Cobalt,
  
  // Cobalt2
  'Cobalt2': Cobalt2,
  'cobalt2': Cobalt2,
  'cobalt-2': Cobalt2,
  
  // Dawn
  'Dawn': Dawn,
  'dawn': Dawn,
  
  // Dominion Day
  'Dominion Day': DominionDay,
  'dominion-day': DominionDay,
  'DominionDay': DominionDay,
  
  // Dracula
  'Dracula': Dracula,
  'dracula': Dracula,
  
  // Dreamweaver
  'Dreamweaver': Dreamweaver,
  'dreamweaver': Dreamweaver,
  
  // Eiffel
  'Eiffel': Eiffel,
  'eiffel': Eiffel,
  
  // Espresso Libre
  'Espresso Libre': EspressoLibre,
  'espresso-libre': EspressoLibre,
  'EspressoLibre': EspressoLibre,
  
  // GitHub Dark
  'GitHub Dark': GitHubDark,
  'github-dark': GitHubDark,
  'GitHubDark': GitHubDark,
  
  // GitHub Light
  'GitHub Light': GitHubLight,
  'github-light': GitHubLight,
  'GitHubLight': GitHubLight,
  
  // GitHub
  'GitHub': GitHub,
  'github': GitHub,
  
  // IDLE
  'IDLE': IDLE,
  'idle': IDLE,
  
  // idleFingers
  'idleFingers': idleFingers,
  'idle-fingers': idleFingers,
  'idlefingers': idleFingers,
  
  // iPlastic
  'iPlastic': iPlastic,
  'iplastic': iPlastic,
  'i-plastic': iPlastic,
  
  // Katzenmilch
  'Katzenmilch': Katzenmilch,
  'katzenmilch': Katzenmilch,
  
  // krTheme
  'krTheme': krTheme,
  'kr-theme': krTheme,
  'krtheme': krTheme,
  
  // Kuroir Theme
  'Kuroir Theme': KuroirTheme,
  'kuroir-theme': KuroirTheme,
  'KuroirTheme': KuroirTheme,
  
  // LAZY
  'LAZY': LAZY,
  'lazy': LAZY,
  
  // MagicWB (Amiga)
  'MagicWB (Amiga)': MagicWBAmiga,
  'magicwb-amiga': MagicWBAmiga,
  'MagicWBAmiga': MagicWBAmiga,
  
  // Merbivore Soft
  'Merbivore Soft': MerbivoreSoft,
  'merbivore-soft': MerbivoreSoft,
  'MerbivoreSoft': MerbivoreSoft,
  
  // Merbivore
  'Merbivore': Merbivore,
  'merbivore': Merbivore,
  
  // monoindustrial
  'monoindustrial': monoindustrial,
  'mono-industrial': monoindustrial,
  
  // Monokai Bright
  'Monokai Bright': MonokaiBright,
  'monokai-bright': MonokaiBright,
  'MonokaiBright': MonokaiBright,
  
  // Monokai
  'Monokai': Monokai,
  'monokai': Monokai,
  
  // Night Owl
  'Night Owl': NightOwl,
  'night-owl': NightOwl,
  'NightOwl': NightOwl,
  
  // Nord
  'Nord': Nord,
  'nord': Nord,
  
  // Oceanic Next
  'Oceanic Next': OceanicNext,
  'oceanic-next': OceanicNext,
  'OceanicNext': OceanicNext,
  
  // Pastels on Dark
  'Pastels on Dark': PastelsOnDark,
  'pastels-on-dark': PastelsOnDark,
  'PastelsOnDark': PastelsOnDark,
  
  // Slush and Poppies
  'Slush and Poppies': SlushAndPoppies,
  'slush-and-poppies': SlushAndPoppies,
  'SlushAndPoppies': SlushAndPoppies,
  
  // Solarized-dark
  'Solarized-dark': SolarizedDark,
  'solarized-dark': SolarizedDark,
  'SolarizedDark': SolarizedDark,
  
  // Solarized-light
  'Solarized-light': SolarizedLight,
  'solarized-light': SolarizedLight,
  'SolarizedLight': SolarizedLight,
  
  // SpaceCadet
  'SpaceCadet': SpaceCadet,
  'space-cadet': SpaceCadet,
  'spacecadet': SpaceCadet,
  
  // Sunburst
  'Sunburst': Sunburst,
  'sunburst': Sunburst,
  
  // Textmate (Mac Classic)
  'Textmate (Mac Classic)': TextmateMacClassic,
  'textmate-mac-classic': TextmateMacClassic,
  'TextmateMacClassic': TextmateMacClassic,
  
  // Tomorrow-Night-Blue
  'Tomorrow-Night-Blue': TomorrowNightBlue,
  'tomorrow-night-blue': TomorrowNightBlue,
  'TomorrowNightBlue': TomorrowNightBlue,
  
  // Tomorrow-Night-Bright
  'Tomorrow-Night-Bright': TomorrowNightBright,
  'tomorrow-night-bright': TomorrowNightBright,
  'TomorrowNightBright': TomorrowNightBright,
  
  // Tomorrow-Night-Eighties
  'Tomorrow-Night-Eighties': TomorrowNightEighties,
  'tomorrow-night-eighties': TomorrowNightEighties,
  'TomorrowNightEighties': TomorrowNightEighties,
  
  // Tomorrow-Night
  'Tomorrow-Night': TomorrowNight,
  'tomorrow-night': TomorrowNight,
  'TomorrowNight': TomorrowNight,
  
  // Tomorrow
  'Tomorrow': Tomorrow,
  'tomorrow': Tomorrow,
  
  // Twilight
  'Twilight': Twilight,
  'twilight': Twilight,
  
  // Upstream Sunburst
  'Upstream Sunburst': UpstreamSunburst,
  'upstream-sunburst': UpstreamSunburst,
  'UpstreamSunburst': UpstreamSunburst,
  
  // Vibrant Ink
  'Vibrant Ink': VibrantInk,
  'vibrant-ink': VibrantInk,
  'VibrantInk': VibrantInk,
  
  // Xcode_default
  'Xcode_default': XcodeDefault,
  'xcode-default': XcodeDefault,
  'XcodeDefault': XcodeDefault,
  'Xcode': XcodeDefault,
  
  // Zenburnesque
  'Zenburnesque': Zenburnesque,
  'zenburnesque': Zenburnesque,
}

// Built-in themes that come with Monaco Editor
export const BUILT_IN_THEMES = ['vs', 'vs-dark', 'hc-black', 'hc-light']

// Function to normalize theme names for lookup
export function normalizeThemeName(name: string): string {
  // Try exact match first
  if (THEME_REGISTRY[name]) {
    return name
  }
  
  // Try lowercase
  const lowercase = name.toLowerCase()
  if (THEME_REGISTRY[lowercase]) {
    return lowercase
  }
  
  // Try with hyphens instead of spaces
  const hyphenated = name.replace(/\s+/g, '-').toLowerCase()
  if (THEME_REGISTRY[hyphenated]) {
    return hyphenated
  }
  
  // Try without spaces
  const noSpaces = name.replace(/\s+/g, '')
  if (THEME_REGISTRY[noSpaces]) {
    return noSpaces
  }
  
  // Try various combinations
  const variations = [
    name,
    name.toLowerCase(),
    name.replace(/\s+/g, '-'),
    name.replace(/\s+/g, '-').toLowerCase(),
    name.replace(/\s+/g, ''),
    name.replace(/\s+/g, '').toLowerCase(),
    // Handle special cases
    name.replace(/\s*\(.*\)/, ''), // Remove parentheses content
    name.replace(/_/g, ' '), // Replace underscores with spaces
    name.replace(/_/g, '-'), // Replace underscores with hyphens
  ]
  
  for (const variant of variations) {
    if (THEME_REGISTRY[variant]) {
      return variant
    }
  }
  
  // Return original if no match found
  return name
}

// Get theme data with multiple fallback strategies
export function getThemeData(themeName: string): any {
  // Check if it's a built-in theme
  if (BUILT_IN_THEMES.includes(themeName)) {
    return null // Built-in themes are handled differently
  }
  
  // Try to get from registry with normalization
  const normalizedName = normalizeThemeName(themeName)
  const themeData = THEME_REGISTRY[normalizedName]
  
  if (themeData) {
    console.log(`Found theme data for "${themeName}" as "${normalizedName}"`)
    return themeData
  }
  
  console.warn(`Theme "${themeName}" not found in registry`)
  return null
}

// Get all available theme names (for dropdown options)
export function getAllThemeNames(): string[] {
  const uniqueThemes = new Set<string>()
  
  // Add built-in themes
  BUILT_IN_THEMES.forEach(theme => uniqueThemes.add(theme))
  
  // Add custom themes (use the proper display names)
  const displayNames = [
    'Active4D',
    'All Hallows Eve',
    'Amy',
    'Birds of Paradise',
    'Blackboard',
    'Brilliance Black',
    'Brilliance Dull',
    'Chrome DevTools',
    'Clouds Midnight',
    'Clouds',
    'Cobalt',
    'Cobalt2',
    'Dawn',
    'Dominion Day',
    'Dracula',
    'Dreamweaver',
    'Eiffel',
    'Espresso Libre',
    'GitHub Dark',
    'GitHub Light',
    'GitHub',
    'IDLE',
    'idleFingers',
    'iPlastic',
    'Katzenmilch',
    'krTheme',
    'Kuroir Theme',
    'LAZY',
    'MagicWB (Amiga)',
    'Merbivore Soft',
    'Merbivore',
    'monoindustrial',
    'Monokai Bright',
    'Monokai',
    'Night Owl',
    'Nord',
    'Oceanic Next',
    'Pastels on Dark',
    'Slush and Poppies',
    'Solarized-dark',
    'Solarized-light',
    'SpaceCadet',
    'Sunburst',
    'Textmate (Mac Classic)',
    'Tomorrow-Night-Blue',
    'Tomorrow-Night-Bright',
    'Tomorrow-Night-Eighties',
    'Tomorrow-Night',
    'Tomorrow',
    'Twilight',
    'Upstream Sunburst',
    'Vibrant Ink',
    'Xcode_default',
    'Zenburnesque',
  ]
  
  displayNames.forEach(name => uniqueThemes.add(name))
  
  return Array.from(uniqueThemes).sort()
}

// Check if a theme is built-in
export function isBuiltInTheme(themeName: string): boolean {
  return BUILT_IN_THEMES.includes(themeName)
}