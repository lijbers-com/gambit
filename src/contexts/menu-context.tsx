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

export function MenuContextProvider({ children }: { children: React.ReactNode }) {
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
  useEffect(() => {
    if (collapsed) {
      // Hide text immediately when collapsing
      setShowText(false);
    } else {
      // Show text after animation completes when expanding (500ms duration)
      const timer = setTimeout(() => {
        setShowText(true);
      }, 500);
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