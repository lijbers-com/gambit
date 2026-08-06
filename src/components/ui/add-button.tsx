'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import { TAB_ACTION_LABEL } from './tab-actions';

/**
 * The one way to offer "add something".
 *
 * Adding is the same gesture wherever it appears — a media plan, a campaign, a
 * booking, a creative — so it gets the same leading `+` the side navigation
 * uses for Create. Without this the label alone carried the meaning and every
 * template spelled it differently.
 */
export const AddButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, title, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn('gap-1.5', className)}
      // The label doubles as tooltip so the button still says what it adds
      // when a tight tab row collapses it to the bare +.
      title={title ?? (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      <Plus className="h-4 w-4" />
      <span className={TAB_ACTION_LABEL}>{children}</span>
    </Button>
  ),
);

AddButton.displayName = 'AddButton';

/**
 * The same mark for the in-table "+ Add booking" rows, which are text rather
 * than buttons so they sit inside the row rhythm instead of interrupting it.
 */
export const AddInlineLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span className={cn('inline-flex items-center gap-1.5 text-sm text-muted-foreground', className)}>
    <Plus className="h-4 w-4" />
    {children}
  </span>
);
