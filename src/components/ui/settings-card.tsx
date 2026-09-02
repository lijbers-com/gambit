'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { OptionCard, OptionCardTick } from './option-card';

/**
 * A required, always-on rule — pacing, delivery behaviour, an account
 * default. There is always a chosen option, so there is nothing to add and
 * nothing to remove: folded, the card simply STATES the rule (its header,
 * nothing more), and the settings glyph opens it in place. Open, every
 * option is a selectable card in the app's one selection language, the
 * chosen one carrying its own settings, and Done folds it back.
 *
 * This is one scenario in the card-choice family — each sibling answers a
 * different question, and all of them render the OptionCard anatomy:
 *
 *   GoalSelect        — pick one, every option on show
 *   SearchSelectList  — pick one/many from a catalogue, chosen cards below
 *   SettingsCard      — a rule that ALWAYS has a value, folded to it
 *   ToggleCard        — a feature that is on or off
 *   CheckboxCard      — an optional add-on you include
 */
export interface SettingsCardOption {
  value: string;
  label: string;
  /** One line under the label — what choosing it means. */
  description?: string;
  disabled?: boolean;
}

export interface SettingsCardProps {
  /** Field label above the card; also names the settings button. */
  label?: string;
  options: SettingsCardOption[];
  value: string;
  onChange: (value: string) => void;
  /** The chosen option's own settings, rendered in its card body while the
   *  chooser is OPEN — a sketch, an estimate, date overrides. */
  renderOpenExtra?: (option: SettingsCardOption) => React.ReactNode;
  /** Body content the FOLDED card still shows. Folded means header-only by
   *  default; use this for the rare field that must never hide (a required
   *  cap). Return nothing for header-only. */
  collapsedExtra?: (option: SettingsCardOption) => React.ReactNode;
  /** Start opened (first-run and documentation stages). */
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  label,
  options,
  value,
  onChange,
  renderOpenExtra,
  collapsedExtra,
  defaultOpen,
  disabled,
  className,
}) => {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  const chosen = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className={cn('min-w-0 space-y-2', className)}>
      {label && <label className="block text-sm font-medium">{label}</label>}

      {!open ? (
        /* Folded: the card states the rule. The settings glyph is the only
           control — a required choice is changed, never removed. */
        <OptionCard
          selected
          title={chosen?.label}
          description={chosen?.description}
          control={
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 shrink-0 p-0"
              aria-label={`Change ${label ?? chosen?.label ?? 'setting'}`}
              disabled={disabled}
              onClick={() => setOpen(true)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          }
        >
          {(chosen && collapsedExtra?.(chosen)) || undefined}
        </OptionCard>
      ) : (
        <div className="space-y-2">
          {options.map((opt) => {
            const sel = opt.value === value;
            return (
              <OptionCard
                key={opt.value}
                selected={sel}
                title={opt.label}
                description={opt.description}
                disabled={disabled || opt.disabled}
                onHeaderClick={sel ? undefined : () => onChange(opt.value)}
                headerAriaPressed={sel}
                control={sel ? <OptionCardTick /> : undefined}
                className={!sel ? 'transition-colors hover:bg-surface-hover' : undefined}
              >
                {(sel && renderOpenExtra?.(opt)) || undefined}
              </OptionCard>
            );
          })}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
