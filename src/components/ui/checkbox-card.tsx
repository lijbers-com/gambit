'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';

/**
 * An optional extra you include — a brand-lift study on a KPI, an add-on with
 * a price. The checkbox sibling of ToggleCard: a switch is a setting that IS
 * on or off, a checkbox card is something you ADD.
 *
 * It speaks the app's one selection language: unchecked it is an idle card
 * that hovers, checked it takes the selected surface — the same states a goal
 * card or a pacing row shows, so an optional extra reads as choosable instead
 * of pre-decided. The whole card is the control; a description under the title
 * is part of what you are agreeing to, so clicking it counts too.
 */
export interface CheckboxCardProps {
  title: string;
  /** One line of what including it means. */
  description?: React.ReactNode;
  /** Trailing fact on the title line — a price ("+€1,500"), "included". */
  meta?: React.ReactNode;
  /** 14px leading icon on the title. */
  icon?: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const CheckboxCard: React.FC<CheckboxCardProps> = ({
  title,
  description,
  meta,
  icon,
  checked,
  onCheckedChange,
  disabled,
  className,
}) => (
  <label
    className={cn(
      'block space-y-1 rounded-md border p-3 transition-colors',
      checked
        ? 'border-surface-selected-border bg-surface-selected'
        : 'border-border bg-background',
      disabled
        ? 'cursor-not-allowed opacity-60'
        : cn('cursor-pointer', !checked && 'hover:bg-surface-hover'),
      className,
    )}
  >
    <span className="flex items-center gap-2.5">
      <Checkbox checked={checked} disabled={disabled} onCheckedChange={(c) => onCheckedChange(c === true)} />
      <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
        {icon && <span className="shrink-0 [&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span>}
        <span className="truncate">{title}</span>
        {meta && <span className="shrink-0 font-normal text-muted-foreground">{meta}</span>}
      </span>
    </span>
    {description && (
      // Indented to the title's left edge, so the card reads as one sentence
      // with a checkbox, not a checkbox beside a paragraph.
      <span className="block pl-[26px] text-xs text-muted-foreground">{description}</span>
    )}
  </label>
);
