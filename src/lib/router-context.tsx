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

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState('/');
  const [query] = useState<Record<string, string>>({});

  const push = (path: string) => {
    setPathname(path);
  };

  const replace = (path: string) => {
    setPathname(path);
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

