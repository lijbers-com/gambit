import { useState, useCallback } from 'react';

export function useMenu() {
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