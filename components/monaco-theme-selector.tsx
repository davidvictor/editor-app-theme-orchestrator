"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getAllLightThemes, getAllDarkThemes } from "@/lib/theme-brightness-registry"

// Get categorized theme lists
const LIGHT_THEMES = getAllLightThemes()
const DARK_THEMES = getAllDarkThemes()

// Transform to options format
const LIGHT_THEME_OPTIONS = LIGHT_THEMES.map(theme => ({ 
  value: theme, 
  label: theme === 'vs' ? 'Visual Studio' : 
         theme === 'hc-light' ? 'High Contrast Light' : 
         theme 
}))

const DARK_THEME_OPTIONS = DARK_THEMES.map(theme => ({ 
  value: theme, 
  label: theme === 'vs-dark' ? 'Visual Studio Dark' : 
         theme === 'hc-black' ? 'High Contrast Black' : 
         theme 
}))

interface MonacoThemeSelectorProps {
  lightTheme: string
  darkTheme: string
  onLightThemeChange: (theme: string) => void
  onDarkThemeChange: (theme: string) => void
  className?: string
}

export function MonacoThemeSelector({
  lightTheme,
  darkTheme,
  onLightThemeChange,
  onDarkThemeChange,
  className = ""
}: MonacoThemeSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="light-theme" className="text-sm text-gray-400 uppercase tracking-wider">
          Light Theme
        </Label>
        <Select
          value={lightTheme}
          onValueChange={onLightThemeChange}
        >
          <SelectTrigger id="light-theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIGHT_THEME_OPTIONS.map((themeOption) => (
              <SelectItem key={themeOption.value} value={themeOption.value}>
                {themeOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dark-theme" className="text-sm text-gray-400 uppercase tracking-wider">
          Dark Theme
        </Label>
        <Select
          value={darkTheme}
          onValueChange={onDarkThemeChange}
        >
          <SelectTrigger id="dark-theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DARK_THEME_OPTIONS.map((themeOption) => (
              <SelectItem key={themeOption.value} value={themeOption.value}>
                {themeOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}