"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import Editor, { Monaco } from "@monaco-editor/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { STORAGE_KEYS, BUILT_IN_THEMES, MONACO_THEMES, DEFAULT_CONFIG, JAVASCRIPT_TEMPLATE, SQL_TEMPLATE } from "@/lib/hacker-portal-config"
import { extractThemeColors, applyThemeColors, saveThemeColors, loadThemeColors } from "@/lib/theme-sync"

// Transform string arrays to objects with value and label
const BUILT_IN_THEME_OPTIONS = [
  { value: "vs", label: "Visual Studio" },
  { value: "vs-dark", label: "Visual Studio Dark" },
  { value: "hc-black", label: "High Contrast Black" },
  { value: "hc-light", label: "High Contrast Light" }
]

const MONACO_THEME_OPTIONS = MONACO_THEMES.map(theme => ({ value: theme, label: theme }))

const ALL_THEMES = [...BUILT_IN_THEME_OPTIONS, ...MONACO_THEME_OPTIONS]

// Templates are now imported from lib/hacker-portal-config



// Safe localStorage access
const safeGetItem = (key: string, defaultValue: string = "") => {
  if (typeof window === "undefined") return defaultValue
  try {
    return localStorage.getItem(key) || defaultValue
  } catch {
    return defaultValue
  }
}

const safeSetItem = (key: string, value: string) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

export default function HackerPortalPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [lightTheme, setLightTheme] = useState("vs")
  const [darkTheme, setDarkTheme] = useState("vs-dark")
  const [editorOptions, setEditorOptions] = useState<any>(DEFAULT_CONFIG)
  const [activeTab, setActiveTab] = useState("javascript")
  const [javascriptCode, setJavascriptCode] = useState(JAVASCRIPT_TEMPLATE)
  const [sqlCode, setSqlCode] = useState(SQL_TEMPLATE)
  const [configText, setConfigText] = useState("")
  const [configError, setConfigError] = useState("")
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null)
  const editorRef = useRef<any>(null)
  const configEditorRef = useRef<any>(null)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    setLightTheme(safeGetItem(STORAGE_KEYS.LIGHT_THEME, "vs"))
    setDarkTheme(safeGetItem(STORAGE_KEYS.DARK_THEME, "vs-dark"))
    
    const savedConfig = safeGetItem(STORAGE_KEYS.CONFIG)
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setEditorOptions(parsed)
        setConfigText(savedConfig)
      } catch {
        setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2))
      }
    } else {
      setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2))
    }
    
    const savedJsCode = safeGetItem(STORAGE_KEYS.CODE, JAVASCRIPT_TEMPLATE)
    setJavascriptCode(savedJsCode)
    const savedSqlCode = safeGetItem(STORAGE_KEYS.CODE + '_sql', SQL_TEMPLATE)
    setSqlCode(savedSqlCode)
  }, [])
  
  // Load saved theme colors on mount
  useEffect(() => {
    if (!mounted || !theme) return
    
    const savedColors = loadThemeColors(theme as 'light' | 'dark')
    if (savedColors) {
      applyThemeColors(savedColors)
    }
  }, [mounted, theme])

  // Watch for theme changes and apply the appropriate Monaco theme
  useEffect(() => {
    if (!monacoInstance || !mounted) return
    
    const themeToApply = theme === "dark" ? darkTheme : lightTheme
    const themeId = getThemeId(themeToApply)
    
    // Load and apply the theme
    if (BUILT_IN_THEME_OPTIONS.some(t => t.value === themeToApply)) {
      monacoInstance.editor.setTheme(themeId)
    } else {
      loadCustomTheme(themeToApply, monacoInstance).then(loadedThemeId => {
        if (loadedThemeId) {
          monacoInstance.editor.setTheme(loadedThemeId)
        }
      })
    }
  }, [theme, lightTheme, darkTheme, monacoInstance, mounted])
  
  // Extract and apply theme colors when theme changes
  useEffect(() => {
    if (!monacoInstance || !mounted || !theme) return
    
    const extractAndApplyColors = async () => {
      try {
        const themeToApply = theme === "dark" ? darkTheme : lightTheme
        const themeId = getThemeId(themeToApply)
        const isBuiltIn = BUILT_IN_THEME_OPTIONS.some(t => t.value === themeToApply)
        
        // Wait longer for custom themes to fully load
        await new Promise(resolve => setTimeout(resolve, isBuiltIn ? 100 : 500))
        
        console.log('Extracting colors for theme:', themeToApply, 'ID:', themeId, 'Built-in:', isBuiltIn)
        
        const colors = await extractThemeColors(monacoInstance, themeToApply, isBuiltIn)
        console.log('Extracted colors:', colors)
        
        applyThemeColors(colors)
        
        // Save to localStorage
        saveThemeColors(theme as 'light' | 'dark', colors)
      } catch (error) {
        console.error('Failed to extract theme colors:', error)
      }
    }
    
    extractAndApplyColors()
  }, [theme, lightTheme, darkTheme, monacoInstance, mounted])

  // Determine current theme
  const currentTheme = theme === "dark" ? darkTheme : lightTheme
  
  // Get the safe theme ID for Monaco
  const getThemeId = (themeName: string) => {
    if (BUILT_IN_THEME_OPTIONS.some(t => t.value === themeName)) {
      return themeName
    }
    return themeName.replace(/\s+/g, '-').toLowerCase()
  }
  
  // Function needs to be defined before useEffect that uses it
  const loadCustomTheme = async (themeName: string, monaco: Monaco) => {
    // Check if it's a built-in theme first
    if (BUILT_IN_THEME_OPTIONS.some(t => t.value === themeName)) {
      return themeName // Built-in theme, no need to load
    }

    try {
      // Create a safe theme ID by replacing spaces with hyphens
      const themeId = themeName.replace(/\s+/g, '-').toLowerCase()
      const themeData = await import(`monaco-themes/themes/${themeName}.json`)
      monaco.editor.defineTheme(themeId, themeData)
      return themeId
    } catch (error) {
      console.error("Failed to load theme:", themeName, error)
      return null
    }
  }


  // Handle theme change
  const handleThemeChange = async (newTheme: string, isDark: boolean) => {
    if (!monacoInstance) return

    // Load theme and get the actual theme ID to use
    const themeIdToUse = await loadCustomTheme(newTheme, monacoInstance)
    if (!themeIdToUse) return // Failed to load theme
    
    if (isDark) {
      setDarkTheme(newTheme)
      safeSetItem(STORAGE_KEYS.DARK_THEME, newTheme)
    } else {
      setLightTheme(newTheme)
      safeSetItem(STORAGE_KEYS.LIGHT_THEME, newTheme)
    }
    
    // Apply theme if it's the current mode
    if ((theme === "dark" && isDark) || (theme === "light" && !isDark)) {
      monacoInstance.editor.setTheme(themeIdToUse)
      
      // Extract and apply colors after theme change
      setTimeout(async () => {
        const isBuiltIn = BUILT_IN_THEME_OPTIONS.some(t => t.value === newTheme)
        console.log('Theme changed to:', newTheme, 'Extracting colors...')
        // Pass the original theme name, not the ID
        const colors = await extractThemeColors(monacoInstance, newTheme, isBuiltIn)
        console.log('Colors extracted after theme change:', colors)
        applyThemeColors(colors)
        saveThemeColors(theme as 'light' | 'dark', colors)
      }, 300)
    }
  }

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    setMonacoInstance(monaco)
    
    // Load current theme
    if (currentTheme && !BUILT_IN_THEME_OPTIONS.some(t => t.value === currentTheme)) {
      loadCustomTheme(currentTheme, monaco).then(themeId => {
        if (themeId) {
          monaco.editor.setTheme(themeId)
        }
      })
    }
  }

  // Handle config editor mount
  const handleConfigEditorDidMount = (editor: any) => {
    configEditorRef.current = editor
  }

  // Handle code change
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      if (activeTab === "javascript") {
        setJavascriptCode(value)
        safeSetItem(STORAGE_KEYS.CODE, value)
      } else {
        setSqlCode(value)
        safeSetItem(STORAGE_KEYS.CODE + '_sql', value)
      }
    }
  }
  
  // Get current code and language based on active tab
  const currentCode = activeTab === "javascript" ? javascriptCode : sqlCode
  const currentLanguage = activeTab === "javascript" ? "javascript" : "sql"

  // Handle config change
  const handleConfigChange = (value: string | undefined) => {
    if (value === undefined) return
    
    setConfigText(value)
    
    try {
      const newOptions = JSON.parse(value)
      editorRef.current?.updateOptions(newOptions)
      setEditorOptions(newOptions)
      safeSetItem(STORAGE_KEYS.CONFIG, value)
      setConfigError("")
    } catch (error) {
      setConfigError("Invalid JSON configuration")
    }
  }

  if (!mounted) {
    return null // Avoid hydration issues
  }

  return (
    <div className="h-screen p-6 flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Main Editor Card */}
        <Card className="lg:col-span-8 h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-wider text-primary-500">CODE EDITOR</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="sql">SQL</TabsTrigger>
              </TabsList>
              <TabsContent value="javascript" className="flex-1 mt-2">
                <Editor
                  height="100%"
                  language="javascript"
                  theme={getThemeId(currentTheme)}
                  value={javascriptCode}
                  options={editorOptions as any}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                />
              </TabsContent>
              <TabsContent value="sql" className="flex-1 mt-2">
                <Editor
                  height="100%"
                  language="sql"
                  theme={getThemeId(currentTheme)}
                  value={sqlCode}
                  options={editorOptions as any}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right Side Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          {/* Theme Selector Card */}
          <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-wider text-primary-500">THEME CONTROL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-400 uppercase tracking-wider">
                Current Mode: {theme === "dark" ? "DARK" : "LIGHT"}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="light-theme" className="text-sm text-gray-400 uppercase tracking-wider">
                Light Theme
              </Label>
              <Select
                value={lightTheme}
                onValueChange={(value) => handleThemeChange(value, false)}
              >
                <SelectTrigger id="light-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_THEMES.map((themeOption) => (
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
                onValueChange={(value) => handleThemeChange(value, true)}
              >
                <SelectTrigger id="dark-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_THEMES.map((themeOption) => (
                    <SelectItem key={themeOption.value} value={themeOption.value}>
                      {themeOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

          {/* Configuration Editor Card */}
          <Card className="flex-1 min-h-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-wider text-primary-500">CONFIGURATION</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            {configError && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{configError}</AlertDescription>
              </Alert>
            )}
            <Editor
              height="100%"
              defaultLanguage="json"
              theme={getThemeId(currentTheme)}
              value={configText}
              options={{
                ...editorOptions,
                minimap: { enabled: false },
                lineNumbers: "on",
                fontSize: 12
              } as any}
              onChange={handleConfigChange}
              onMount={handleConfigEditorDidMount}
            />
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}