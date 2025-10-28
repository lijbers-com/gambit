'use client';

import React, { createContext, useContext, useState } from 'react';

interface RouterContextType {
  pathname: string;
  push: (path: string) => void;
  query: Record<string, string>;
  // Next.js App Router compatibility methods
  replace: (path: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (path: string) => Promise<void>;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  push: () => {},
  query: {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: async () => {},
});

// Storybook story path mapping
const getStorybookPath = (path: string): string | null => {
  const storyMapping: Record<string, string> = {
    '/campaigns': 'page-templates-campaign-overview--campaigns-360',
    '/notifications': 'page-templates-notification-center--notification-center',
    '/profile': 'page-templates-dashboard--dashboard',
    '/': 'page-templates-dashboard--dashboard',
  };
  return storyMapping[path] || null;
};

// Function to navigate within Storybook
const navigateInStorybook = (storyId: string) => {
  try {
    console.log('[Router] Attempting Storybook navigation to:', storyId);

    // Check if we're in an iframe (Storybook)
    if (typeof window === 'undefined' || window.self === window.top) {
      console.log('[Router] Not in iframe, skipping Storybook navigation');
      return false;
    }

    // Navigate the parent window to the story
    const baseUrl = window.top!.location.origin + window.top!.location.pathname;
    const newUrl = `${baseUrl}?path=/story/${storyId}`;
    console.log('[Router] Navigating to:', newUrl);
    window.top!.location.href = newUrl;
    return true;
  } catch (e) {
    console.error('[Router] Error navigating in Storybook:', e);
    return false;
  }
};

export function RouterProvider({ children }: { children: React.ReactNode }) {
  console.log('=== ROUTER PROVIDER INITIALIZED ===');
  const [pathname, setPathname] = useState('/');
  const [query] = useState<Record<string, string>>({});

  const push = (path: string) => {
    console.log('=== CUSTOM ROUTER PUSH CALLED ===');
    console.log('[Router] push called with path:', path);
    console.log('[Router] typeof window:', typeof window);
    console.log('[Router] window.self === window.top:', typeof window !== 'undefined' ? window.self === window.top : 'N/A');
    setPathname(path);

    // Try to navigate in Storybook
    const storyId = getStorybookPath(path);
    console.log('[Router] Story ID from mapping:', storyId);
    if (storyId) {
      console.log('[Router] Found Storybook story ID:', storyId);
      navigateInStorybook(storyId);
    } else {
      console.log('[Router] No Storybook mapping for path:', path);
    }
  };

  const replace = (path: string) => {
    // For now, just use push
    push(path);
  };

  const back = () => {
    // Mock implementation - in Storybook we don't have real navigation history
    console.log('Mock router: back()');
  };

  const forward = () => {
    // Mock implementation
    console.log('Mock router: forward()');
  };

  const refresh = () => {
    // Mock implementation
    console.log('Mock router: refresh()');
  };

  const prefetch = async (path: string) => {
    // Mock implementation
    console.log('Mock router: prefetch()', path);
  };

  return (
    <RouterContext.Provider value={{
      pathname,
      push,
      query,
      replace,
      back,
      forward,
      refresh,
      prefetch
    }}>
      {children}
    </RouterContext.Provider>
  );
}

export function usePathname() {
  const { pathname } = useContext(RouterContext);
  return pathname;
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useSearchParams() {
  const { query } = useContext(RouterContext);
  return {
    get: (key: string) => query[key] || null,
    forEach: (callback: (value: string, key: string) => void) => {
      Object.entries(query).forEach(([key, value]) => callback(value, key));
    },
  };
}

// Simple Link component replacement
export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>(({ href, onClick, ...props }, ref) => {
  const { push } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    push(href);
    onClick?.(e);
  };

  return <a ref={ref} href={href} onClick={handleClick} {...props} />;
});

Link.displayName = 'Link';

// Simple Image component replacement
export const Image = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    width?: number | string;
    height?: number | string;
    priority?: boolean;
  }
>(({ width, height, style, priority, ...props }, ref) => {
  // priority is a Next.js Image prop, not a valid HTML img attribute
  // We'll ignore it when rendering a regular img element
  return (
    <img
      ref={ref}
      style={{ width, height, ...style }}
      {...props}
    />
  );
});

Image.displayName = 'Image';
