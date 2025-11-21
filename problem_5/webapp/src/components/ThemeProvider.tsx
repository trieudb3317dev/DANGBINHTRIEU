'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');

  // init from localStorage or system
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeState(stored);
      } else {
        setThemeState('system');
      }
    } catch {
      setThemeState('system');
    }
  }, []);

  // apply theme to html element and listen to system changes
  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: Theme) => {
      if (t === 'system') {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', !!isDark);
      } else {
        root.classList.toggle('dark', t === 'dark');
      }
    };

    apply(theme);

    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handler = () => {
      if (theme === 'system') apply('system');
    };

    if (mql) {
      // support both addEventListener API and legacy addListener
      if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handler);
      else if (typeof mql.addListener === 'function') mql.addListener(handler);
    }

    return () => {
      if (mql) {
        if (typeof mql.removeEventListener === 'function') mql.removeEventListener('change', handler);
        else if (typeof mql.removeListener === 'function') mql.removeListener(handler);
      }
    };
  }, [theme]);

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem('theme', t);
    } catch {
      // ignore
    }
    setThemeState(t);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
