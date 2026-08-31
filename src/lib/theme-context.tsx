'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'gambit',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('gambit');

  useEffect(() => {
    // Get theme from localStorage on mount
    let savedTheme = 'gambit';
    try { savedTheme = localStorage.getItem('app-theme') || 'gambit'; } catch { /* storage unavailable */ }
    setTheme(savedTheme);
    document.body.className = `theme-${savedTheme}`;
  }, []);

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    try { localStorage.setItem('app-theme', newTheme); } catch { /* storage unavailable */ }
    document.body.className = `theme-${newTheme}`;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}