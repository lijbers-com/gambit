'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The FAQ list: questions that open to reveal their answer.
 *
 * Collapsed by default and quiet by design — it sits at the end of a template
 * for the reader who wants it, and takes almost no room from the reader who
 * does not. One question can be open at a time, so the block never pushes the
 * page around more than a screen.
 *
 * Purely presentational; FaqPanel supplies the entries from the database.
 */

export interface FaqItem {
  id: string;
  question: string;
  /** Plain text. Blank lines become paragraphs — no markup is parsed. */
  answer: string;
}

export interface FaqProps {
  items: FaqItem[];
  /** Heading above the list. Pass `null` to render the questions alone. */
  heading?: React.ReactNode;
  /** Which question starts open. Defaults to the first — a collapsed block of
   *  bare questions gives the reader nothing, and the first answer shows what
   *  kind of help this is. Pass `null` to start fully collapsed. */
  defaultOpenId?: string | null;
  className?: string;
}

export const Faq: React.FC<FaqProps> = ({ items, heading = 'Frequently asked questions', defaultOpenId, className }) => {
  // `undefined` means the reader hasn't touched the list yet, so the default
  // applies; `null` means they deliberately closed it. Collapsing the first
  // question has to stick, which it can't if "nothing open" and "not chosen
  // yet" are the same value.
  const [chosenId, setChosenId] = React.useState<string | null | undefined>(undefined);

  if (items.length === 0) return null;

  // The default: the first question, unless the caller asked for another one
  // or for none at all.
  const fallbackId = defaultOpenId === null ? null : defaultOpenId ?? items[0].id;
  // The list changes when the reader switches tab or step, and a chosen id may
  // not be in the new set — fall back rather than render nothing open.
  const activeId =
    chosenId === undefined ? fallbackId
    : chosenId === null ? null
    : items.some((i) => i.id === chosenId) ? chosenId
    : fallbackId;

  return (
    // One card holding the title and the questions, on the page background
    // rather than white: help is there for whoever wants it and should sit
    // quieter than the content it follows.
    <section className={cn('w-full overflow-hidden rounded-xl border bg-page', className)}>
      {heading !== null && (
        // Even padding top and bottom so the title sits centred in its band.
        <h3 className="px-5 py-4 text-lg font-semibold">{heading}</h3>
      )}
      <div className={cn('divide-y divide-border', heading !== null && 'border-t border-border')}>
        {items.map((item) => {
          const isOpen = activeId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setChosenId(isOpen ? null : item.id)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface-hover"
              >
                <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{item.question}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              {isOpen && (
                <div className="space-y-3 px-5 pb-4 pr-12 text-sm leading-relaxed text-muted-foreground">
                  {item.answer.split(/\n\s*\n/).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
