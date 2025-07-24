// Mock useMenu hook for Storybook

export function useMenu() {
  return {
    isOpen: false,
    toggle: () => {},
    close: () => {},
    openSubmenu: [],
    setOpenSubmenu: () => {},
  };
}

export default {
  useMenu,
};