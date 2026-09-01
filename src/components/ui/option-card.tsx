'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * THE card anatomy for anything chosen, chosen-from, or configured in place.
 *
 * The selected cards had started drifting — the pacing card drew its content
 * one way, a keyword card another, the goal cards a third — so the shape is
 * now written down once:
 *
 *   ┌───────────────────────────────────────────┐
 *   │ [icon]  Title                    [control]│   header: p-3
 *   │         one-line sub                      │
 *   ├───────────────────────────────────────────┤   full-width rule
 *   │ content — free, with two house patterns:  │   body: p-3
 *   │   · OptionCardItems (icon + label rows)   │
 *   ├───────────────────────────────────────────┤
 *   │ OptionCardSection — nested settings       │   more rules as needed
 *   └───────────────────────────────────────────┘
 *
 * Padding sits on the sections, never on the card, so every rule runs the
 * full width — the same law ToggleCard follows. The control slot is whatever
 * the context needs: the selection tick, a remove ×, a settings button, an
 * info tip. The header can be the click target (`onHeaderClick`) for
 * selection lists where pressing the card chooses it.
 */

export interface OptionCardProps {
  title: React.ReactNode;
  /** One line under the title. */
  description?: React.ReactNode;
  /** 16px leading icon. */
  icon?: React.ReactNode;
  /** Small nodes on the title line itself (an info tip, a count). */
  titleExtra?: React.ReactNode;
  /** The trailing control: tick, remove ×, settings, switch… */
  control?: React.ReactNode;
  /** Selected cards take the app's one selected surface. */
  selected?: boolean;
  /** Make the header a button (selection rows). The control stays clickable
   *  on its own. */
  onHeaderClick?: () => void;
  headerAriaPressed?: boolean;
  disabled?: boolean;
  /** Body content, under the full-width rule. Use OptionCardSection for
   *  further rule-separated blocks inside. */
  children?: React.ReactNode;
  className?: string;
}

const ruleClass = (selected?: boolean) =>
  selected ? 'border-surface-selected-border' : 'border-border';

export const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  icon,
  titleExtra,
  control,
  selected,
  onHeaderClick,
  headerAriaPressed,
  disabled,
  children,
  className,
}) => {
  const headerInner = (
    <>
      {icon && (
        <span className={cn('shrink-0 [&_svg]:h-4 [&_svg]:w-4', selected ? 'text-foreground' : 'text-muted-foreground')}>
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-medium">{title}</span>
          {titleExtra}
        </span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
    </>
  );

  return (
    <div
      className={cn(
        'rounded-md border transition-colors',
        selected ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background',
        className,
      )}
    >
      <div className="flex items-center gap-3 p-3">
        {onHeaderClick ? (
          <button
            type="button"
            disabled={disabled}
            aria-pressed={headerAriaPressed}
            onClick={onHeaderClick}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-3 text-left',
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            )}
          >
            {headerInner}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{headerInner}</div>
        )}
        {control && <span className="flex shrink-0 items-center gap-1">{control}</span>}
      </div>
      {children && (
        <div className={cn('space-y-3 border-t p-3', ruleClass(selected))}>{children}</div>
      )}
    </div>
  );
};

/** A further rule-separated block inside the body — nested settings: dates,
 *  objects, a picker. Draws its own full-width rule above itself. */
export const OptionCardSection: React.FC<{ children: React.ReactNode; selected?: boolean; className?: string }> = ({
  children,
  selected,
  className,
}) => (
  <div className={cn('-mx-3 space-y-2 border-t px-3 pt-3', ruleClass(selected), className)}>{children}</div>
);

/** The house list pattern for card content: rows of similar items, each with
 *  an optional 14px icon and a label. */
export const OptionCardItems: React.FC<{
  items: { icon?: React.ReactNode; label: React.ReactNode }[];
  className?: string;
}> = ({ items, className }) => (
  <div className={cn('space-y-1', className)}>
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:h-3.5 [&_svg]:w-3.5">
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <span className="min-w-0">{item.label}</span>
      </div>
    ))}
  </div>
);

/** The selection tick — the same 20px dot every chosen card shows. */
export const OptionCardTick: React.FC = () => (
  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </span>
);
