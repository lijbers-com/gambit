'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AreaChartComponent } from './area-chart';
import { BarChartComponent } from './bar-chart';
import type { ChartConfig, ChartDataPoint } from './chart-types';

/**
 * THE case card — the one way a recommendation's or insight's evidence is
 * shown, wherever it appears: the message drawer in notifications, the
 * Campaign Agent's pinned context, and whatever surface comes next. One
 * component so the case always reads the same: title, stat tiles, chart,
 * bold-lead key points.
 */

/** The evidence behind a recommendation or insight. */
export interface CaseCardData {
  stats?: { label: string; value: string; sub?: string; tone?: string }[];
  chart?: {
    data: ChartDataPoint[];
    config: ChartConfig;
    kind?: 'area' | 'bar';
    xKey?: string;
    horizontal?: boolean;
    rightAxisKey?: string;
    title?: string;
  };
  insights?: { title: string; text: string }[];
}

export interface CaseCardProps extends CaseCardData {
  /** A plain title — "The case for this" in the drawer, the message's
   *  subject in the agent's context card. Never a badge or label. */
  title?: string;
  /** Body copy under the title — the message the case belongs to, when the
   *  surface doesn't already show it. */
  description?: string;
  /** A closing line inside the card (e.g. the agent's fence note). */
  footer?: React.ReactNode;
  className?: string;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  title,
  description,
  stats,
  chart,
  insights,
  footer,
  className,
}) => (
  <div className={cn('space-y-4 rounded-lg border bg-muted/20 p-4', className)}>
    {(title || description) && (
      <div className="space-y-1">
        {title && <div className="text-sm font-semibold text-foreground">{title}</div>}
        {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
    )}

    {stats && stats.length > 0 && (
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="rounded-lg border bg-background p-2.5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-base font-semibold leading-tight">{s.value}</div>
            {s.sub && (
              <div className={cn('mt-0.5 text-xs', s.tone === 'success' ? 'text-success-600' : 'text-muted-foreground')}>
                {s.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {chart && (
      <div className="rounded-lg border bg-background p-3">
        {chart.title && (
          <div className="mb-1 text-sm font-medium text-muted-foreground">{chart.title}</div>
        )}
        {chart.kind === 'bar' ? (
          <BarChartComponent
            data={chart.data}
            config={chart.config}
            className="h-[190px] w-full"
            showLegend
            horizontal={chart.horizontal}
            xAxisDataKey={chart.xKey ?? 'month'}
          />
        ) : (
          <AreaChartComponent
            data={chart.data}
            config={chart.config}
            className="h-[170px] w-full"
            showLegend
            showRightYAxis={!!chart.rightAxisKey}
            rightAxisDataKey={chart.rightAxisKey}
          />
        )}
      </div>
    )}

    {insights && insights.length > 0 && (
      <ul className="space-y-2">
        {insights.map((it, i) => (
          <li key={i} className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{it.title}: </span>
            {it.text}
          </li>
        ))}
      </ul>
    )}

    {footer}
  </div>
);
