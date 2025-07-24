// CRITICAL: Polyfill React Fast Refresh BEFORE any imports
(globalThis as any).$RefreshSig$ = function() { return function(type: any) { return type; }; };
(globalThis as any).$RefreshReg$ = function() {};

// Browser polyfills
if (typeof window !== 'undefined') {
  (window as any).$RefreshSig$ = (globalThis as any).$RefreshSig$;
  (window as any).$RefreshReg$ = (globalThis as any).$RefreshReg$;
}

// Self polyfills for different scope contexts
if (typeof self !== 'undefined') {
  (self as any).$RefreshSig$ = (globalThis as any).$RefreshSig$;
  (self as any).$RefreshReg$ = (globalThis as any).$RefreshReg$;
}

import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import * as React from 'react';

// Mock Next.js router for components that use useRouter
const MockRouterContext = React.createContext({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  isFallback: false,
  basePath: '',
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  isReady: true,
  isPreview: false,
});

// Mock usePathname hook
const mockUsePathname = () => '/dashboard';

// Mock useMenu hook
const mockUseMenu = () => ({
  isOpen: false,
  toggle: () => {},
  close: () => {},
  openSubmenu: [],
  setOpenSubmenu: () => {},
});

// Module mocks - these will be handled by webpack aliases
if (typeof window !== 'undefined') {
  // Create global mock functions that components can fallback to
  (window as any).__STORYBOOK_MOCKS__ = {
    usePathname: mockUsePathname,
    useRouter: () => ({
      push: () => {},
      replace: () => {},
      prefetch: () => {},
      back: () => {},
      pathname: '/dashboard',
      route: '/dashboard',
      query: {},
      asPath: '/dashboard',
    }),
    useMenu: mockUseMenu,
  };
  
  // Mock useState for Storybook stories
  if (!(window as any).React) {
    (window as any).React = React;
  }
}

// Themes disabled to avoid compatibility issues

// Provider wrapper for stories that need context
const withProviders = (Story: any, context: any) => {
  return React.createElement(
    MockRouterContext.Provider,
    {
      value: {
        push: () => {},
        replace: () => {},
        prefetch: () => {},
        back: () => {},
        pathname: '/dashboard',
        route: '/dashboard',
        query: {},
        asPath: '/dashboard',
        isFallback: false,
        basePath: '',
        locale: undefined,
        locales: undefined,
        defaultLocale: undefined,
        isReady: true,
        isPreview: false,
      }
    },
    React.createElement('div', {}, React.createElement(Story, context))
  );
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