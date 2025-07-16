import { create } from 'zustand';

interface MenuState {
  collapsed: boolean;
  openSubmenu: string[];
  setCollapsed: (collapsed: boolean) => void;
  setOpenSubmenu: (openSubmenu: string[]) => void;
  toggleCollapsed: () => void;
}

export const useMenu = create<MenuState>((set) => ({
  collapsed: false,
  openSubmenu: [],
  setCollapsed: (collapsed) => set({ collapsed }),
  setOpenSubmenu: (openSubmenu) => set({ openSubmenu }),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
})); 