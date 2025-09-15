import { useState, useCallback, useContext } from 'react';

// Dynamic import to check if context is available
let MenuContextModule: any = null;
try {
  MenuContextModule = require('@/contexts/menu-context');
} catch {
  // Context not available
}

export function useMenu() {
  // Try to use context if available
  let contextValue: any = null;
  if (MenuContextModule?.MenuContext) {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      contextValue = useContext(MenuContextModule.MenuContext);
    } catch {
      // Context provider not found
    }
  }

  // Local state as fallback
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(false);
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

  // Return context value if available, otherwise return local state
  if (contextValue) {
    return contextValue;
  }

  return {
    expandedItems,
    activeItem,
    toggleExpanded,
    isExpanded,
    setActive,
    isActive,
    collapsed,
    setCollapsed,
    toggleCollapsed,
    openSubmenu,
    setOpenSubmenu,
  };
}