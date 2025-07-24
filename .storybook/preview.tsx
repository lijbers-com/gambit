import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import * as React from 'react';

// Simple provider wrapper for stories
const withProviders = (Story: any, context: any) => {
  return React.createElement('div', {}, React.createElement(Story, context));
};

const preview: Preview = {
  decorators: [withProviders],
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
};

export default preview;