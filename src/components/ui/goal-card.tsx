import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GoalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  /** Display only — renders the chosen goal without hover, cursor or focus
   *  affordances, for forms where the goal is fixed. */
  readOnly?: boolean;
  className?: string;
}

/**
 * Selectable goal card — icon + title + description with a highlighted selected
 * state. Used in the create-media-plan wizard and the media-plan details form so
 * the goal picker looks and behaves the same across templates.
 */
export const GoalCard: React.FC<GoalCardProps> = ({ icon, title, description, selected, onClick, readOnly, className }) => {
  // Read-only renders a div: a button that cannot do anything still shows a
  // pointer and a hover state, which reads as "click me" and then disappoints.
  const Tag = readOnly ? 'div' : 'button';
  return (
  <Tag
    {...(readOnly ? {} : { type: 'button' as const, onClick })}
    className={cn(
      'flex h-full flex-col items-start rounded-lg border-2 p-6 text-left transition-all',
      !readOnly && 'cursor-pointer hover:border-primary/50 hover:shadow-sm',
      selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card',
      className,
    )}
  >
    <div className={cn('mb-4', selected ? 'text-primary' : 'text-muted-foreground')}>{icon}</div>
    <h3 className="mb-1 text-sm font-semibold">{title}</h3>
    <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
  </Tag>
  );
};
