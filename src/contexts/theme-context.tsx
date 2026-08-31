'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'gambit' | 'albert-heijn' | 'adusa' | 'delhaize' | 'alfa-beta';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('gambit'); // Default to Gambit

  // Load theme from localStorage on mount
  useEffect(() => {
    // try/catch, not just a window check: in a sandboxed iframe (the
    // EpicContext design-system chapter frames the preview route) touching
    // localStorage THROWS a SecurityError, and an uncaught throw in an effect
    // is Next's whole-page "Application error".
    try {
      const savedTheme = localStorage.getItem('gambit-theme') as Theme;
      if (savedTheme && (savedTheme === 'gambit' || savedTheme === 'albert-heijn' || savedTheme === 'adusa' || savedTheme === 'delhaize' || savedTheme === 'alfa-beta')) {
        setTheme(savedTheme);
      }
    } catch {
      /* storage unavailable — keep the default theme */
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('gambit-theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  // Apply theme to document root and body
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Map theme names to data-theme attribute values
      const themeAttributeMap: Record<Theme, string> = {
        'gambit': 'retailMedia',
        'albert-heijn': 'albertHeijn',
        'adusa': 'adusa',
        'delhaize': 'delhaize',
        'alfa-beta': 'alfaBeta'
      };

      const themeAttr = themeAttributeMap[theme];
      document.documentElement.setAttribute('data-theme', themeAttr);
      document.body.setAttribute('data-theme', themeAttr);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}