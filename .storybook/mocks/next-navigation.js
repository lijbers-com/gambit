// Mock Next.js navigation hooks for Storybook

export function usePathname() {
  return '/dashboard';
}

export function useRouter() {
  return {
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
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function redirect() {
  return () => {};
}

export function notFound() {
  return () => {};
}