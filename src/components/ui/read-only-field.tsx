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
  /** Several values, rendered as one card each — the same stack a
   *  SearchSelectList shows for its selected options, minus the remove button.
   *  Use this rather than `value` for multi-select fields like Brands, so the
   *  locked form matches how the wizard presented the same choice. */
  values?: { label: string; description?: string }[];
  /** One line under the field explaining why it is fixed. */
  hint?: React.ReactNode;
  className?: string;
}

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value, values, hint, className }) => (
  <div className={cn('space-y-2', className)}>
    <Label className="flex items-center gap-1.5 text-muted-foreground">
      {label}
      <Lock className="h-3 w-3" aria-label="Cannot be changed" />
    </Label>
    {/* Same card as a selected option in SearchSelectList and GoalCard, so
        everything a form has already settled on looks alike. */}
    {values && values.length > 0 ? (
      <div className="space-y-1">
        {values.map((v) => (
          <div key={v.label} className="rounded-md border border-surface-selected-border bg-surface-selected p-3">
            <div className="min-w-0 truncate text-sm font-medium">{v.label}</div>
            {v.description && <div className="mt-1 text-xs text-muted-foreground">{v.description}</div>}
          </div>
        ))}
      </div>
    ) : (
      <div className="flex min-h-9 items-center rounded-md border border-surface-selected-border bg-surface-selected px-3 py-2 text-sm text-foreground">
        {value || <span className="text-muted-foreground">—</span>}
      </div>
    )}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);
