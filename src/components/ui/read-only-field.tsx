import * as React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './label';

/**
 * A field that shows a value the user cannot change here.
 *
 * Some things are fixed once a media plan exists — who it advertises for, and
 * what it is judged on — because changing them would invalidate the campaigns,
 * bookings and reporting underneath. Rather than a disabled input (which still
 * looks like something you could type in if only it were enabled), this reads
 * as a stated fact, with a lock to say so.
 */
export interface ReadOnlyFieldProps {
  label: React.ReactNode;
  /** The value. Falls back to an em dash when empty. */
  value?: React.ReactNode;
  /** One line under the field explaining why it is fixed. */
  hint?: React.ReactNode;
  className?: string;
}

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value, hint, className }) => (
  <div className={cn('space-y-2', className)}>
    <Label className="flex items-center gap-1.5 text-muted-foreground">
      {label}
      <Lock className="h-3 w-3" aria-label="Cannot be changed" />
    </Label>
    <div className="flex min-h-9 items-center rounded-md bg-muted/50 px-3 py-2 text-sm text-foreground">
      {value || <span className="text-muted-foreground">—</span>}
    </div>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);
