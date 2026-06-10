'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
    '/campaigns': 'page-templates-campaign-overview--campaigns-360-no-goal-targeting',
    '/notifications': 'page-templates-notification-center--notification-center',
    '/profile': 'page-templates-dashboard--dashboard',
    '/create/media-experience': 'page-templates-create-media-experience--goal-selection',
    '/create/sponsored-products': 'page-templates-campaign-details--sponsored-products-in-option',
    '/create/display': 'page-templates-campaign-details--display-in-option',
    '/create/offline-instore': 'page-templates-campaign-details--offline-instore-in-option',
    '/create/digital-instore': 'page-templates-campaign-details--digital-instore-in-option',
    '/create/offsite': 'page-templates-campaign-details--offsite-in-option',
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
  // NOTE: this provider is currently only mounted for Storybook flows.
  // In the Next.js app, usePathname() reads window.location directly
  // (see below) — it doesn't depend on this state.
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
  // RouterProvider isn't actually mounted in the Next.js app (it only
  // exists for the Storybook flow), so we can't rely on the context's
  // pathname here — it'd always be the default '/'. Instead, maintain
  // our own state synced with the real browser URL via History API
  // patching + popstate, so callers (notably the side-nav active
  // marker) always see the current path.
  //
  // Hydration safety: we MUST initialise to the same value the server
  // rendered. The server renders with ctx.pathname (default '/'), so
  // the client's first render uses the same. The useEffect below then
  // immediately bumps it to the real URL after mount.
  const ctx = useContext(RouterContext);
  const [pathname, setPathname] = useState<string>(ctx.pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Defer the setState to a microtask so we never schedule an update
    // while React is inside useInsertionEffect — Next's App Router
    // patches/uses history.pushState from one of those, and reacting
    // synchronously here would trigger "useInsertionEffect must not
    // schedule updates."
    const sync = () => {
      queueMicrotask(() => {
        setPathname((prev) =>
          prev === window.location.pathname ? prev : window.location.pathname
        );
      });
    };
    sync();

    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    window.history.pushState = function (
      ...args: Parameters<typeof origPush>
    ) {
      origPush.apply(window.history, args);
      sync();
    };
    window.history.replaceState = function (
      ...args: Parameters<typeof origReplace>
    ) {
      origReplace.apply(window.history, args);
      sync();
    };
    window.addEventListener('popstate', sync);

    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener('popstate', sync);
    };
  }, []);

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
