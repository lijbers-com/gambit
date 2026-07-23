import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GoalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Selectable goal card — icon + title + description with a highlighted selected
 * state. Used in the create-media-plan wizard and the media-plan details form so
 * the goal picker looks and behaves the same across templates.
 */
export const GoalCard: React.FC<GoalCardProps> = ({ icon, title, description, selected, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex h-full flex-col items-start rounded-lg border-2 p-6 text-left transition-all cursor-pointer hover:border-primary/50 hover:shadow-sm',
      selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card',
      className,
    )}
  >
    <div className={cn('mb-4', selected ? 'text-primary' : 'text-muted-foreground')}>{icon}</div>
    <h3 className="mb-1 text-sm font-semibold">{title}</h3>
    <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
  </button>
);
