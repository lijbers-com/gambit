// Mock useMenu hook for Storybook
import { useState, useCallback } from 'react';

export function useMenu() {
  const [expandedItems, setExpandedItems] = useState([]);
  const [activeItem, setActiveItem] = useState('');
  // Check if we're in the collapsed state story by looking at URL
  const isCollapsedStory = typeof window !== 'undefined' && window.location.href.includes('collapsed-state');
  const [collapsed, setCollapsed] = useState(isCollapsedStory);
  const [openSubmenu, setOpenSubmenu] = useState([]);

  const toggleExpanded = useCallback((item) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, []);

  const isExpanded = useCallback((item) => {
    return expandedItems.includes(item);
  }, [expandedItems]);

  const setActive = useCallback((item) => {
    setActiveItem(item);
  }, []);

  const isActive = useCallback((item) => {
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
    // Legacy properties for backwards compatibility
    isOpen: false,
    toggle: toggleCollapsed,
    close: () => setCollapsed(false),
  };
}

export default {
  useMenu,
};