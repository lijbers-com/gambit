'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface BreadcrumbEntity {
  id: string;
  name: string;
  type: 'campaign' | 'line-item' | 'creative';
  campaignType?: 'sponsored-products' | 'display' | 'digital-instore' | 'offline-instore';
}

export interface BreadcrumbContextValue {
  entities: BreadcrumbEntity[];
  setEntities: (entities: BreadcrumbEntity[]) => void;
  getEntityName: (id: string, type: BreadcrumbEntity['type']) => string | null;
  addEntity: (entity: BreadcrumbEntity) => void;
  getCampaignName: (campaignId: string) => string;
  getLineItemName: (lineItemId: string) => string;
  getCreativeName: (creativeId: string) => string;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export interface BreadcrumbProviderProps {
  children: ReactNode;
  entities?: BreadcrumbEntity[];
}

export function BreadcrumbProvider({ children, entities = [] }: BreadcrumbProviderProps) {
  const [contextEntities, setContextEntities] = React.useState<BreadcrumbEntity[]>(entities);

  const getEntityName = (id: string, type: BreadcrumbEntity['type']): string | null => {
    const entity = contextEntities.find(e => e.id === id && e.type === type);
    return entity?.name || null;
  };

  const addEntity = (entity: BreadcrumbEntity) => {
    setContextEntities(prev => {
      // Remove existing entity with same id and type, then add new one
      const filtered = prev.filter(e => !(e.id === entity.id && e.type === entity.type));
      return [...filtered, entity];
    });
  };

  const getCampaignName = (campaignId: string): string => {
    const entity = getEntityName(campaignId, 'campaign');
    return entity || 'Campaign Details';
  };

  const getLineItemName = (lineItemId: string): string => {
    const entity = getEntityName(lineItemId, 'line-item');
    return entity || 'Line-item Details';
  };

  const getCreativeName = (creativeId: string): string => {
    const entity = getEntityName(creativeId, 'creative');
    return entity || 'Creative Details';
  };

  const value: BreadcrumbContextValue = {
    entities: contextEntities,
    setEntities: setContextEntities,
    getEntityName,
    addEntity,
    getCampaignName,
    getLineItemName,
    getCreativeName,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb(): BreadcrumbContextValue {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}

// Hook for optional breadcrumb context (doesn't throw if not in provider)
export function useBreadcrumbOptional(): BreadcrumbContextValue | null {
  return useContext(BreadcrumbContext);
}