import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";
import * as React from 'react';
import { ThemeProvider } from "../src/contexts/theme-context";
import { RouterProvider } from "../src/lib/router-context";
import { MenuContextProvider } from "../src/contexts/menu-context";
import { StorybookThemeProvider } from "../src/contexts/storybook-theme-context";

// Theme wrapper component that can use hooks
const ThemeWrapper: React.FC<{ theme: string; children: React.ReactNode }> = ({ theme, children }) => {
  React.useEffect(() => {
    // Apply theme to document elements for CSS variables to work
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    // Clear any existing theme classes
    document.documentElement.className = '';
    document.body.className = '';

    // Dispatch event for toolbar theme changes
    window.dispatchEvent(new CustomEvent('toolbar-theme-change', { detail: theme }));

    // Log theme changes for debugging
    console.log('Storybook theme changed to:', theme);
  }, [theme]);

  return (
    <div data-theme={theme} style={{ height: '100%' }}>
      <RouterProvider>
        <ThemeProvider>
          <MenuContextProvider>
            <StorybookThemeProvider initialTheme={theme}>
              {children}
            </StorybookThemeProvider>
          </MenuContextProvider>
        </ThemeProvider>
      </RouterProvider>
    </div>
  );
};

// Provider wrapper for stories with ThemeProvider and theme application
const withTheme = (Story: any, context: any) => {
  const theme = context.globals.theme || 'retailMedia';

  return React.createElement(ThemeWrapper, { theme }, React.createElement(Story, context));
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      autodocs: true,
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'retailMedia',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'retailMedia', title: 'Gambit Theme' },
          { value: 'albertHeijn', title: 'Albert Heijn Theme' },
          { value: 'adusa', title: 'ADUSA Theme' },
          { value: 'delhaize', title: 'Delhaize Theme' },
          { value: 'alfaBeta', title: 'Alfa Beta Theme' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;