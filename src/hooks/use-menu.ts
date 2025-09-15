import { useState, useCallback, useContext, useEffect } from 'react';
import { MenuContext } from '@/contexts/menu-context';

export function useMenu() {
  // Try to use context first
  let contextValue: any = null;
  try {
    contextValue = useContext(MenuContext);
  } catch {
    // Context provider not found, will use fallback
  }

  // Local state as fallback
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

  // Handle text visibility with animation delay (fallback only)
  useEffect(() => {
    if (contextValue) return; // Skip if using context
    
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
  }, [collapsed, contextValue]);

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
    showText,
    setCollapsed,
    toggleCollapsed,
    openSubmenu,
    setOpenSubmenu,
  };
}