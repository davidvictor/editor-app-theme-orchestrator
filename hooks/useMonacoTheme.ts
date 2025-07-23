'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { STORAGE_KEYS } from '@/lib/hacker-portal-config';

interface UseMonacoThemeReturn {
  lightTheme: string;
  darkTheme: string;
  currentTheme: string;
  setLightTheme: (theme: string) => void;
  setDarkTheme: (theme: string) => void;
}

export function useMonacoTheme(): UseMonacoThemeReturn {
  const { theme } = useTheme();

  // Initialize from localStorage with proper client-side check and fallbacks
  const [lightTheme, setLightThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.LIGHT_THEME);
      // Always return default if localStorage is empty or null
      return savedTheme || 'vs';
    }
    return 'vs';
  });

  const [darkTheme, setDarkThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.DARK_THEME);
      // Always return default if localStorage is empty or null
      return savedTheme || 'vs-dark';
    }
    return 'vs-dark';
  });

  // Use useMemo to derive current theme instead of useEffect
  const currentTheme = useMemo(() => {
    return theme === 'dark' ? darkTheme : lightTheme;
  }, [theme, darkTheme, lightTheme]);

  // Theme setters that update localStorage
  const setLightTheme = useCallback((theme: string) => {
    setLightThemeState(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LIGHT_THEME, theme);
    }
  }, []);

  const setDarkTheme = useCallback((theme: string) => {
    setDarkThemeState(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DARK_THEME, theme);
    }
  }, []);

  return {
    lightTheme,
    darkTheme,
    currentTheme,
    setLightTheme,
    setDarkTheme,
  };
}
