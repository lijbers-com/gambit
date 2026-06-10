'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface MenuContextType {
  expandedItems: string[];
  activeItem: string;
  collapsed: boolean;
  showText: boolean;
  openSubmenu: string[];
  toggleExpanded: (item: string) => void;
  isExpanded: (item: string) => boolean;
  setActive: (item: string) => void;
  isActive: (item: string) => boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  setOpenSubmenu: (submenu: string[]) => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

/**
 * MenuContextProvider. If a parent already supplies a MenuContext (the
 * Next.js root layout does), we pass through the children unchanged so
 * the root's `collapsed` / `openSubmenu` state survives client-side
 * navigations between pages. Without this, every story / page template
 * that wraps its content in `<MenuContextProvider>` would shadow the
 * root and reset the nav back to expanded on every route change.
 */
export function MenuContextProvider({ children }: { children: React.ReactNode }) {
  const existing = useContext(MenuContext);
  if (existing) {
    return <>{children}</>;
  }
  return <RootMenuContextProvider>{children}</RootMenuContextProvider>;
}

function RootMenuContextProvider({ children }: { children: React.ReactNode }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(true);
  const [openSubmenu, setOpenSubmenu] = useState<string[]>([]);

  const toggleExpanded = useCallback((item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, []);

  const isExpanded = useCallback((item: string) => {
    return expandedItems.includes(item);
  }, [expandedItems]);

  const setActive = useCallback((item: string) => {
    setActiveItem(item);
  }, []);

  const isActive = useCallback((item: string) => {
    return activeItem === item;
  }, [activeItem]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  // Handle text visibility with animation delay
  //
  // CLOSING: hide labels first (synchronously), then let the width
  // transition collapse so labels never overflow a narrowing container.
  //
  // OPENING: wait for the 500ms width transition to fully finish before
  // un-hiding labels. The extra 80ms buffer pushes the reveal past the
  // browser's final paint of the open state so labels never momentarily
  // render against an intermediate width (which would cause them to
  // wrap onto multiple lines).
  useEffect(() => {
    if (collapsed) {
      setShowText(false);
    } else {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 580);
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  const contextValue: MenuContextType = {
    expandedItems,
    activeItem,
    collapsed,
    showText,
    openSubmenu,
    toggleExpanded,
    isExpanded,
    setActive,
    isActive,
    setCollapsed,
    toggleCollapsed,
    setOpenSubmenu,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext(): MenuContextType {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuContextProvider');
  }
  return context;
}