'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent } from './card';

/**
 * The "what is left before this can go live" cards on a media plan.
 *
 * One card per campaign, each listing the setup steps the plan still needs
 * from it — create bookings, link creatives, add products and keywords. The
 * steps are DERIVED from the data (the same facts the to-do engine reads), so
 * a step strikes itself through the moment the work is actually done, and a
 * card whose steps are all done disappears on its own. Skip hides a card
 * without doing the work — the to-dos in the inbox still stand; this surface
 * is the friendly path, not the system of record.
 *
 * Each step opens the surface where the work happens — the same wizards and
 * pages the campaign is built with — rather than explaining them.
 */

export interface SetupChecklistStep {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  /** Opens where this work is done. */
  onClick?: () => void;
}

export interface SetupChecklistCardData {
  id: string;
  icon?: React.ReactNode;
  title: string;
  /** The campaign's governing facts — budget, run time — each a labelled
   *  field, in the same order the plan's control bar states them. A string
   *  renders as a read-only box; a node renders as itself, so a caller can
   *  hand over the same editors the table rows use. */
  facts?: Array<{ label: string; value: React.ReactNode }>;
  steps: SetupChecklistStep[];
}

export interface SetupChecklistProps {
  heading?: string;
  subtitle?: string;
  cards: SetupChecklistCardData[];
  /** Skip / Done both dismiss the card; the parent persists which ids are hidden. */
  onDismiss: (id: string) => void;
  onSkipAll?: () => void;
  className?: string;
}

export const SetupChecklist: React.FC<SetupChecklistProps> = ({
  heading = 'Setup checklist',
  subtitle = 'Complete these steps to take the plan live. You can skip any card for now.',
  cards,
  onDismiss,
  onSkipAll,
  className,
}) => {
  if (cards.length === 0) return null;

  return (
    <section className={cn('space-y-4', className)}>
      {(heading || subtitle) && (
        <div>
          {heading && <h3 className="text-lg font-semibold">{heading}</h3>}
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => {
          const done = card.steps.filter((s) => s.done).length;
          const complete = done === card.steps.length;
          const nextStep = card.steps.find((s) => !s.done);
          return (
            <Card key={card.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-center gap-3">
                  {card.icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-foreground [&_svg]:h-4 [&_svg]:w-4">
                      {card.icon}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{card.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {complete ? 'All set' : `${card.steps.length - done} step${card.steps.length - done === 1 ? '' : 's'} to complete`}
                    </span>
                  </span>
                </div>

                {card.facts && card.facts.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {card.facts.map((f) => (
                      <div key={f.label} className="min-w-0 space-y-1">
                        <span className="block text-xs font-medium text-muted-foreground">{f.label}</span>
                        {typeof f.value === 'string' ? (
                          <div className="truncate rounded-md border border-border px-3 py-2 text-xs tabular-nums text-muted-foreground">
                            {f.value}
                          </div>
                        ) : (
                          f.value
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium tabular-nums">{done}/{card.steps.length}</span>
                  </div>
                  {/* Progress is state, not celebration — the fill is the same
                      dark the step ticks and primary buttons use. */}
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(done / card.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 space-y-3">
                  {card.steps.map((step) => (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={step.onClick}
                        disabled={step.done}
                        className={cn('group flex w-full items-start gap-3 text-left', !step.done && 'cursor-pointer')}
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                            step.done ? 'border-transparent bg-primary text-primary-foreground' : 'border-border bg-background',
                          )}
                        >
                          {step.done && <Check className="h-2.5 w-2.5" />}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={cn(
                              'block text-sm font-medium',
                              step.done ? 'text-muted-foreground line-through' : 'group-hover:underline',
                            )}
                          >
                            {step.title}
                          </span>
                          {step.description && (
                            <span className={cn('block text-xs text-muted-foreground', step.done && 'line-through')}>
                              {step.description}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => onDismiss(card.id)}>
                    Skip
                  </Button>
                  {/* The card exists because work is open, so its action is to
                      START that work — the next unfinished step's own wizard.
                      A card with nothing left removes itself. */}
                  <Button disabled={!nextStep} onClick={() => nextStep?.onClick?.()}>
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {onSkipAll && cards.length > 1 && (
        <button
          type="button"
          onClick={onSkipAll}
          className="text-sm font-medium text-primary underline underline-offset-2 hover:no-underline"
        >
          Skip all
        </button>
      )}
    </section>
  );
};
