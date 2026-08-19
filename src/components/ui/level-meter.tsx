'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * A five-step scale — search volume, competitiveness, anything graded.
 *
 * Five segments and a word, because neither alone is enough: the word says
 * where it sits, the segments say how far that is from the ends. Volume reads
 * as "more is better" so it fills in one colour; competition reads as "more is
 * worse", so it runs green to red.
 */

export type Level = 1 | 2 | 3 | 4 | 5;

export const LEVEL_LABELS: Record<Level, string> = {
  1: 'Very low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Very high',
};

/** Competition is graded the other way round: high is a warning, not a win. */
const RISK_COLOURS: Record<Level, string> = {
  1: 'bg-success-500',
  2: 'bg-success-500',
  3: 'bg-warning-500',
  4: 'bg-destructive-500',
  5: 'bg-destructive-500',
};

/** Stock runs the risk scale backwards: empty is the emergency. */
const SUPPLY_COLOURS: Record<Level, string> = {
  1: 'bg-destructive-500',
  2: 'bg-warning-500',
  3: 'bg-warning-500',
  4: 'bg-success-500',
  5: 'bg-success-500',
};

export interface LevelMeterProps {
  label: string;
  level: Level;
  /** 'scale' fills in one colour (more is better); 'risk' runs green→red;
   *  'supply' is stock level — red when it is nearly gone. */
  tone?: 'scale' | 'risk' | 'supply';
  /** Extra context after the level word, e.g. the raw search count. */
  detail?: string;
  className?: string;
}

export const LevelMeter: React.FC<LevelMeterProps> = ({
  label,
  level,
  tone = 'scale',
  detail,
  className,
}) => (
  <div className={cn('flex items-center gap-2', className)}>
    <span className="text-xs text-muted-foreground">{label}:</span>
    <span className="flex items-center gap-0.5" aria-hidden>
      {([1, 2, 3, 4, 5] as Level[]).map((step) => (
        <span
          key={step}
          className={cn(
            'h-2.5 w-1 rounded-[1px]',
            step <= level
              ? tone === 'risk'
                ? RISK_COLOURS[level]
                : tone === 'supply'
                  ? SUPPLY_COLOURS[level]
                  : 'bg-primary'
              : 'bg-muted-foreground/20',
          )}
        />
      ))}
    </span>
    <span className="text-xs font-medium text-foreground">{LEVEL_LABELS[level]}</span>
    {detail && <span className="text-xs text-muted-foreground">· {detail}</span>}
  </div>
);
