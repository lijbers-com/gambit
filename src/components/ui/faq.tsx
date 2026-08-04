'use client';

import * as React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
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
  /** Opened by default — use for a single-question block that is the point of
   *  the section rather than an aside. */
  defaultOpenId?: string;
  className?: string;
}

export const Faq: React.FC<FaqProps> = ({ items, heading = 'Frequently asked questions', defaultOpenId, className }) => {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpenId ?? null);

  if (items.length === 0) return null;

  return (
    <section className={cn('w-full', className)}>
      {heading !== null && (
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <HelpCircle className="h-5 w-5 text-primary" />
          {heading}
        </h3>
      )}
      <div className="divide-y divide-border overflow-hidden rounded-lg border bg-card">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
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
                <div className="space-y-3 px-4 pb-4 pr-11 text-sm leading-relaxed text-muted-foreground">
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
