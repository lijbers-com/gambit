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
 * Selectable goal card — icon, title and description.
 *
 * Styled as the same card a SearchSelectList shows for a selected option
 * (`rounded-md border bg-surface-selected p-3`, title at text-sm/medium, description at
 * text-xs/muted), so a chosen goal sits alongside a chosen objective or KPI
 * without looking like a different kind of thing. Used by the create-media-plan
 * wizard and the media-plan details form.
 */
export const GoalCard: React.FC<GoalCardProps> = ({ icon, title, description, selected, onClick, readOnly, className }) => {
  // Read-only renders a div: a button that cannot do anything still shows a
  // pointer and a hover state, which reads as "click me" and then disappoints.
  const Tag = readOnly ? 'div' : 'button';
  return (
    <Tag
      {...(readOnly ? {} : { type: 'button' as const, onClick })}
      className={cn(
        // The icon is sized here rather than by the caller, so goals stay
        // consistent however the icon was passed in.
        'flex h-full w-full flex-col rounded-md border p-3 text-left transition-colors [&_svg]:h-5 [&_svg]:w-5',
        !readOnly && 'cursor-pointer hover:bg-surface-hover',
        selected ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background',
        className,
      )}
    >
      {/* Title line — icon and title centred together, description beneath. */}
      <div className="flex items-center gap-2">
        <span className={cn('shrink-0', selected ? 'text-foreground' : 'text-muted-foreground')}>{icon}</span>
        <span className="min-w-0 truncate text-sm font-medium">{title}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
    </Tag>
  );
};
