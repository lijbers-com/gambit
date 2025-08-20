import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";
import * as React from 'react';
import { ThemeProvider } from "../src/contexts/theme-context";
import { RouterProvider } from "../src/lib/router-context";

// Provider wrapper for stories with ThemeProvider and theme application
const withTheme = (Story: any, context: any) => {
  const theme = context.globals.theme || 'retailMedia';
  
  // Apply theme to the document root for CSS variables
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Also update any theme-specific classes
    document.documentElement.className = '';
    document.body.className = '';
  }, [theme]);

  // Wrap in a div with the theme to ensure CSS cascade
  return React.createElement(
    'div',
    { 'data-theme': theme, style: { height: '100%' } },
    React.createElement(
      RouterProvider,
      {},
      React.createElement(
        ThemeProvider, 
        {}, 
        React.createElement(Story, context)
      )
    )
  );
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
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;