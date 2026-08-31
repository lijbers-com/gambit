'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from './switch';

/**
 * A setting you switch on, and everything switching it on brings with it.
 *
 * One shape for every on/off setting that sits in a form: the switch on the
 * left, what it is, one line of what it does, and — when it has them — its own
 * settings inside the card rather than beside it. Options that only exist
 * because a switch is on belong within the switch, so they arrive and leave
 * with it instead of sitting greyed out competing for attention.
 *
 * The card takes the app's selected surface while it is on, so a row of
 * settings shows at a glance which ones are active.
 */
export interface ToggleCardProps {
  title: string;
  /** One line on what turning it on does. */
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  /** The settings this switch turns on — rendered inside, only while on. */
  children?: React.ReactNode;
  className?: string;
}

export const ToggleCard: React.FC<ToggleCardProps> = ({
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
  children,
  className,
}) => (
  <div
    className={cn(
      'rounded-md border p-3',
      checked ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background',
      className,
    )}
  >
    <div className="flex items-center gap-3">
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} aria-label={title} />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{title}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
    </div>
    {checked && children && (
      <div className="mt-3 space-y-4 border-t border-surface-selected-border pt-3">{children}</div>
    )}
  </div>
);
