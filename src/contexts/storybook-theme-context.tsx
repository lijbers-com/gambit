import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContext, Theme } from './theme-context';

interface StorybookThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const StorybookThemeContext = createContext<StorybookThemeContextType | undefined>(undefined);

interface StorybookThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

export const StorybookThemeProvider: React.FC<StorybookThemeProviderProps> = ({
  children,
  initialTheme = 'retailMedia'
}) => {
  const [theme, setThemeState] = useState<string>(initialTheme);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    // Also dispatch a custom event so we can sync with toolbar
    window.dispatchEvent(new CustomEvent('storybook-theme-change', { detail: newTheme }));
  };

  useEffect(() => {
    // Listen for toolbar theme changes
    const handleToolbarChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail !== theme) {
        setThemeState(customEvent.detail);
      }
    };

    window.addEventListener('toolbar-theme-change', handleToolbarChange);
    return () => window.removeEventListener('toolbar-theme-change', handleToolbarChange);
  }, [theme]);

  return (
    <StorybookThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </StorybookThemeContext.Provider>
  );
};

// Map Next.js theme names to Storybook theme names
const nextToStorybookThemeMap: Record<Theme, string> = {
  'gambit': 'retailMedia',
  'albert-heijn': 'albertHeijn',
  'adusa': 'adusa',
  'delhaize': 'delhaize',
  'alfa-beta': 'alfaBeta'
};

// Map Storybook theme names to Next.js theme names
const storybookToNextThemeMap: Record<string, Theme> = {
  'retailMedia': 'gambit',
  'albertHeijn': 'albert-heijn',
  'adusa': 'adusa',
  'delhaize': 'delhaize',
  'alfaBeta': 'alfa-beta'
};

export const useStorybookTheme = (): StorybookThemeContextType => {
  const storybookContext = useContext(StorybookThemeContext);
  const nextThemeContext = useContext(ThemeContext);

  // If Next.js theme context is available, use it
  if (nextThemeContext !== undefined) {
    return {
      theme: nextToStorybookThemeMap[nextThemeContext.theme] || 'retailMedia',
      setTheme: (newTheme: string) => {
        const nextTheme = storybookToNextThemeMap[newTheme] || 'gambit';
        nextThemeContext.setTheme(nextTheme);
      }
    };
  }

  // If Storybook context is available, use it
  if (storybookContext !== undefined) {
    return storybookContext;
  }

  // Fallback for neither context available
  return {
    theme: 'retailMedia',
    setTheme: () => {
      // No-op when used outside both contexts
    }
  };
};
