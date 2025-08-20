'use client';

import React, { createContext, useContext, useState } from 'react';

interface RouterContextType {
  pathname: string;
  push: (path: string) => void;
  query: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  push: () => {},
  query: {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState('/');
  const [query] = useState<Record<string, string>>({});

  const push = (path: string) => {
    setPathname(path);
  };

  return (
    <RouterContext.Provider value={{ pathname, push, query }}>
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
  }
>(({ width, height, style, ...props }, ref) => {
  return (
    <img 
      ref={ref}
      style={{ width, height, ...style }}
      {...props}
    />
  );
});

Image.displayName = 'Image';