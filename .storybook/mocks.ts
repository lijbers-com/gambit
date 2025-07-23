// Mock implementations for Next.js and custom hooks

// Mock Next.js navigation hooks
export const mockUsePathname = () => '/dashboard';

export const mockUseRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  pathname: '/dashboard',
  route: '/dashboard',
  query: {},
  asPath: '/dashboard',
});

// Mock custom hooks
export const mockUseMenu = () => ({
  isOpen: false,
  toggle: () => {},
  close: () => {},
  openSubmenu: [],
  setOpenSubmenu: () => {},
});

// Apply mocks globally
if (typeof window !== 'undefined') {
  // Mock Next.js hooks
  jest.mock('next/navigation', () => ({
    usePathname: mockUsePathname,
    useRouter: mockUseRouter,
  }));

  // Mock custom hooks  
  jest.mock('@/hooks/use-menu', () => ({
    useMenu: mockUseMenu,
  }));
}