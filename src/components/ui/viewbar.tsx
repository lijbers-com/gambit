import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import { cn } from '@/lib/utils';

export interface ViewbarLabel {
  label: string;
  color?: 'default' | 'success' | 'muted';
}

export interface ViewbarTab {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ViewbarProps {
  labels: ViewbarLabel[];
  tabs: ViewbarTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

const labelColorClass = (color: string = 'default') => {
  switch (color) {
    case 'success':
      return 'bg-green-100 text-green-900';
    case 'muted':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const Viewbar: React.FC<ViewbarProps> = ({ labels, tabs, activeTab, onTabChange, className }) => {
  return (
    <div className={cn('flex items-center justify-between w-full gap-4', className)}>
      {labels.length > 0 && (
        <div className="flex gap-3">
          {labels.map((l, i) => (
            <span
              key={i}
              className={cn(
                'inline-block rounded-full px-4 py-1 text-base font-medium',
                labelColorClass(l.color)
              )}
            >
              {l.label}
            </span>
          ))}
        </div>
      )}
      {labels.length === 0 && <div />}
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}; 