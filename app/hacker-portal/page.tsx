'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import Editor, { Monaco } from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  STORAGE_KEYS,
  BUILT_IN_THEMES,
  DEFAULT_CONFIG,
  JAVASCRIPT_TEMPLATE,
  SQL_TEMPLATE,
} from '@/lib/hacker-portal-config';
import { clearOldThemeColorCaches } from '@/lib/theme-sync';
import { themeApplication } from '@/lib/theme-application';
import { MonacoThemeSelector } from '@/components/monaco-theme-selector';
import '@/lib/reset-themes'; // Make resetMonacoThemes available globally

// Templates are now imported from lib/hacker-portal-config

// Safe localStorage access
const safeGetItem = (key: string, defaultValue: string = '') => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch {
    return defaultValue;
  }
};

const safeSetItem = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

interface HackerPortalPageProps {
  monacoTheme?: {
    lightTheme: string;
    darkTheme: string;
    currentTheme: string;
    setLightTheme: (theme: string) => void;
    setDarkTheme: (theme: string) => void;
  };
}

export default function HackerPortalPage({ monacoTheme }: HackerPortalPageProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Fallback values for when component is pre-rendered
  const [localLightTheme, setLocalLightTheme] = useState('vs');
  const [localDarkTheme, setLocalDarkTheme] = useState('vs-dark');

  // Use monacoTheme if provided, otherwise use local state
  const lightTheme = monacoTheme?.lightTheme ?? localLightTheme;
  const darkTheme = monacoTheme?.darkTheme ?? localDarkTheme;
  const currentTheme = monacoTheme?.currentTheme ?? (theme === 'dark' ? darkTheme : lightTheme);
  const [editorOptions, setEditorOptions] = useState<any>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('javascript');
  const [javascriptCode, setJavascriptCode] = useState(JAVASCRIPT_TEMPLATE);
  const [sqlCode, setSqlCode] = useState(SQL_TEMPLATE);
  const [configText, setConfigText] = useState('');
  const [configError, setConfigError] = useState('');
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null);
  const editorRef = useRef<any>(null);
  const configEditorRef = useRef<any>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);

    // Clear old theme color caches on mount
    clearOldThemeColorCaches();

    // Load local theme values if monacoTheme is not provided
    if (!monacoTheme) {
      setLocalLightTheme(safeGetItem(STORAGE_KEYS.LIGHT_THEME, 'vs'));
      setLocalDarkTheme(safeGetItem(STORAGE_KEYS.DARK_THEME, 'vs-dark'));
    }

    const savedConfig = safeGetItem(STORAGE_KEYS.CONFIG);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setEditorOptions(parsed);
        setConfigText(savedConfig);
      } catch {
        setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2));
      }
    } else {
      setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2));
    }

    const savedJsCode = safeGetItem(STORAGE_KEYS.CODE, JAVASCRIPT_TEMPLATE);
    setJavascriptCode(savedJsCode);
    const savedSqlCode = safeGetItem(STORAGE_KEYS.CODE + '_sql', SQL_TEMPLATE);
    setSqlCode(savedSqlCode);
  }, []);

  // Remove the theme loading effect - this is now handled by the hook in page.tsx

  // Apply Monaco theme when editor loads or theme changes
  useEffect(() => {
    if (!monacoInstance || !mounted || !theme) return;

    const applyTheme = async () => {
      // Ensure we have a valid theme to apply
      const themeToApply = currentTheme || (theme === 'dark' ? 'vs-dark' : 'vs');

      // Set Monaco instance in theme application manager
      themeApplication.setMonacoInstance(monacoInstance);

      // Load theme into Monaco
      const themeId = await themeApplication.loadMonacoTheme(themeToApply, monacoInstance);
      if (themeId) {
        monacoInstance.editor.setTheme(themeId);

        // Extract and apply colors after a delay to ensure theme is loaded
        setTimeout(
          async () => {
            await themeApplication.extractAndApplyTheme(themeToApply);
          },
          BUILT_IN_THEMES.includes(themeToApply) ? 100 : 500
        );
      }
    };

    applyTheme();
  }, [currentTheme, monacoInstance, mounted, theme]);

  // Get the safe theme ID for Monaco
  const getThemeId = (themeName: string) => {
    if (BUILT_IN_THEMES.includes(themeName)) {
      return themeName;
    }
    return themeName.replace(/\s+/g, '-').toLowerCase();
  };

  // Handle theme change
  const handleLightThemeChange = useCallback(
    (newTheme: string) => {
      if (monacoTheme) {
        monacoTheme.setLightTheme(newTheme);
      } else {
        setLocalLightTheme(newTheme);
        safeSetItem(STORAGE_KEYS.LIGHT_THEME, newTheme);
      }

      // Reset the last applied theme to force re-application
      themeApplication.resetLastApplied();
    },
    [monacoTheme]
  );

  const handleDarkThemeChange = useCallback(
    (newTheme: string) => {
      if (monacoTheme) {
        monacoTheme.setDarkTheme(newTheme);
      } else {
        setLocalDarkTheme(newTheme);
        safeSetItem(STORAGE_KEYS.DARK_THEME, newTheme);
      }

      // Reset the last applied theme to force re-application
      themeApplication.resetLastApplied();
    },
    [monacoTheme]
  );

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    setMonacoInstance(monaco);
  };

  // Handle config editor mount
  const handleConfigEditorDidMount = (editor: any) => {
    configEditorRef.current = editor;
  };

  // Handle reset themes
  const handleResetThemes = useCallback(() => {
    // Reset to defaults
    const defaultLight = 'vs';
    const defaultDark = 'vs-dark';

    // Update the state
    if (monacoTheme) {
      monacoTheme.setLightTheme(defaultLight);
      monacoTheme.setDarkTheme(defaultDark);
    } else {
      setLocalLightTheme(defaultLight);
      setLocalDarkTheme(defaultDark);
      safeSetItem(STORAGE_KEYS.LIGHT_THEME, defaultLight);
      safeSetItem(STORAGE_KEYS.DARK_THEME, defaultDark);
    }

    // Clear all theme color caches
    themeApplication.resetToDefaults();

    // Reset color mode to default (dark)
    setTheme('dark');

    // Show success toast
    toast({
      title: 'Themes Reset',
      description: 'Monaco themes and color mode have been reset to defaults.',
    });

    // Force a re-render by resetting Monaco instance
    if (monacoInstance) {
      const themeToApply = theme === 'dark' ? defaultDark : defaultLight;
      monacoInstance.editor.setTheme(themeToApply);
    }
  }, [monacoTheme, theme, setTheme, monacoInstance, toast]);

  // Handle code change
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      if (activeTab === 'javascript') {
        setJavascriptCode(value);
        safeSetItem(STORAGE_KEYS.CODE, value);
      } else {
        setSqlCode(value);
        safeSetItem(STORAGE_KEYS.CODE + '_sql', value);
      }
    }
  };

  // Get current code and language based on active tab
  const currentCode = activeTab === 'javascript' ? javascriptCode : sqlCode;
  const currentLanguage = activeTab === 'javascript' ? 'javascript' : 'sql';

  // Handle config change
  const handleConfigChange = (value: string | undefined) => {
    if (value === undefined) return;

    setConfigText(value);

    try {
      const newOptions = JSON.parse(value);
      editorRef.current?.updateOptions(newOptions);
      setEditorOptions(newOptions);
      safeSetItem(STORAGE_KEYS.CONFIG, value);
      setConfigError('');
    } catch (error) {
      setConfigError('Invalid JSON configuration');
    }
  };

  if (!mounted) {
    return null; // Avoid hydration issues
  }

  return (
    <div className="h-screen p-6 flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Main Editor Card */}
        <Card className="lg:col-span-8 h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-wider text-primary-500">
              CODE EDITOR
            </CardTitle>
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
              <CardTitle className="text-xl font-bold tracking-wider text-primary-500">
                THEME CONTROL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400 uppercase tracking-wider">
                  Current Mode: {theme === 'dark' ? 'DARK' : 'LIGHT'}
                </Label>
              </div>

              <MonacoThemeSelector
                lightTheme={lightTheme}
                darkTheme={darkTheme}
                onLightThemeChange={handleLightThemeChange}
                onDarkThemeChange={handleDarkThemeChange}
              />

              <Button onClick={handleResetThemes} variant="outline" className="w-full mt-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>

          {/* Configuration Editor Card */}
          <Card className="flex-1 min-h-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold tracking-wider text-primary-500">
                CONFIGURATION
              </CardTitle>
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
                options={
                  {
                    ...editorOptions,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    fontSize: 12,
                  } as any
                }
                onChange={handleConfigChange}
                onMount={handleConfigEditorDidMount}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
