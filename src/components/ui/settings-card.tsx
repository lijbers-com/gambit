'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { OptionCard, OptionCardTick } from './option-card';

/**
 * A required, always-on rule — pacing, delivery behaviour, an account
 * default. There is always a chosen option, so there is nothing to add and
 * nothing to remove — and nothing to hide either: every option is on show,
 * the same way the goals are. What keeps the resting form light is not a
 * fold but LAZY SETTINGS: the chosen default sits as a plain selected card
 * (header + tick) until the user engages, and the moment they pick an
 * option — or click the chosen one — its settings unfold in place and stay.
 *
 * This is one scenario in the card-choice family — each sibling answers a
 * different question, and all of them render the OptionCard anatomy:
 *
 *   GoalSelect        — pick one, every option on show, chosen one open
 *   SearchSelectList  — pick one/many from a catalogue, chosen cards below
 *   SettingsCard      — a rule that ALWAYS has a value; settings unfold on use
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
  /** Field label above the cards. */
  label?: string;
  options: SettingsCardOption[];
  value: string;
  onChange: (value: string) => void;
  /** The chosen option's own settings — a sketch, an estimate, date
   *  overrides. Hidden on the untouched default; unfolds once the user
   *  engages (selects an option, or clicks the chosen card). */
  renderOpenExtra?: (option: SettingsCardOption) => React.ReactNode;
  /** Body content the chosen card ALWAYS shows, settings unfolded or not —
   *  for the rare field that must never hide (a required cap). */
  pinnedExtra?: (option: SettingsCardOption) => React.ReactNode;
  /** Start with the chosen option's settings unfolded (documentation
   *  stages, resumed forms). */
  defaultSettingsOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  label,
  options,
  value,
  onChange,
  renderOpenExtra,
  pinnedExtra,
  defaultSettingsOpen,
  disabled,
  className,
}) => {
  const [settingsOpen, setSettingsOpen] = React.useState(defaultSettingsOpen ?? false);

  return (
    <div className={cn('min-w-0 space-y-2', className)}>
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="space-y-2">
        {options.map((opt) => {
          const sel = opt.value === value;
          const openPart = sel && settingsOpen ? renderOpenExtra?.(opt) : undefined;
          const pinnedPart = sel ? pinnedExtra?.(opt) : undefined;
          return (
            <OptionCard
              key={opt.value}
              selected={sel}
              title={opt.label}
              description={opt.description}
              disabled={disabled || opt.disabled}
              /* Engaging is what unfolds the settings — a deliberate pick,
                 or a click on the already-chosen card. */
              onHeaderClick={() => {
                if (!sel) onChange(opt.value);
                setSettingsOpen(true);
              }}
              headerAriaPressed={sel}
              control={sel ? <OptionCardTick /> : undefined}
              className={!sel ? 'transition-colors hover:bg-surface-hover' : undefined}
            >
              {openPart || pinnedPart ? (
                <div className="space-y-3">
                  {openPart}
                  {pinnedPart}
                </div>
              ) : undefined}
            </OptionCard>
          );
        })}
      </div>
    </div>
  );
};
