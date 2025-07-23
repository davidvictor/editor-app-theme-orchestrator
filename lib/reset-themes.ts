/**
 * Utility to reset Monaco themes to defaults
 * Can be called from browser console: window.resetMonacoThemes()
 */

import { STORAGE_KEYS } from './hacker-portal-config'

export function resetMonacoThemes() {
  console.log('🔄 Resetting Monaco themes to defaults...')
  
  // Clear theme preferences
  localStorage.removeItem(STORAGE_KEYS.LIGHT_THEME)
  localStorage.removeItem(STORAGE_KEYS.DARK_THEME)
  
  // Clear all saved theme colors
  const keys = Object.keys(localStorage)
  let colorCachesCleared = 0
  
  keys.forEach(key => {
    if (key.startsWith('monaco-theme-colors-')) {
      localStorage.removeItem(key)
      colorCachesCleared++
    }
  })
  
  console.log(`✅ Cleared theme preferences`)
  console.log(`✅ Cleared ${colorCachesCleared} theme color caches`)
  console.log('🔄 Reloading page to apply defaults...')
  
  // Reload the page to apply changes
  window.location.reload()
}

// Make it available globally in browser
if (typeof window !== 'undefined') {
  (window as any).resetMonacoThemes = resetMonacoThemes
}