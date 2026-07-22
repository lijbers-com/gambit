'use client';

import * as React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { AreaChartComponent } from './area-chart';
import { BarChartComponent } from './bar-chart';
import type { ChartDataPoint, ChartConfig } from './chart-types';

/**
 * A single agent "turn" rendered as a chat conversation: the user's question as
 * a bubble, followed by the agent's answer with optional stat cards, a chart and
 * insight bullets — the same layout as the Campaign Agent chat page. Reused in
 * the Recommendations flyout so every agent surface reads consistently.
 */
export interface ConversationStat {
  label: string;
  value: string;
  sub?: string;
  /** 'success' renders the sub line green; anything else is muted. */
  tone?: string;
}

export interface ConversationChart {
  data: ChartDataPoint[];
  config: ChartConfig;
  /** 'area' (default) trends over time; 'bar' compares categories. */
  kind?: 'area' | 'bar';
  xKey?: string;
  horizontal?: boolean;
  rightAxisKey?: string;
  title?: string;
}

export interface ConversationInsight {
  title: string;
  text: string;
}

export interface ConversationTemplateProps {
  /** The user's question, shown as a right-aligned chat bubble. */
  question: React.ReactNode;
  /** The agent's answer text (renders on the background, no bubble). */
  answer?: React.ReactNode;
  stats?: ConversationStat[];
  chart?: ConversationChart;
  insights?: ConversationInsight[];
  /** Follow-up composer. Rendered only when onFollowUpChange is provided. */
  followUp?: string;
  onFollowUpChange?: (value: string) => void;
  onAskAgent?: () => void;
  className?: string;
}

export function ConversationTemplate({
  question,
  answer,
  stats,
  chart,
  insights,
  followUp = '',
  onFollowUpChange,
  onAskAgent,
  className,
}: ConversationTemplateProps) {
  return (
    <div className={cn('space-y-5', className)}>
      {/* User question — right-aligned bubble */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm">
          {question}
        </div>
      </div>

      {/* Agent response — no bubble, direct on the background */}
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1 space-y-4">
          {answer && <div className="text-sm leading-relaxed text-foreground">{answer}</div>}

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {stats.map((s, i) => (
                <div key={i} className="rounded-lg border p-2.5">
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  <div className="text-base font-semibold leading-tight">{s.value}</div>
                  {s.sub && (
                    <div className={cn('mt-0.5 text-[10px]', s.tone === 'success' ? 'text-green-600' : 'text-muted-foreground')}>
                      {s.sub}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {chart && (
            <div>
              {chart.title && (
                <div className="mb-1 text-xs font-medium text-muted-foreground">{chart.title}</div>
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
                <li key={i} className="flex gap-2 text-xs">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{it.title}: </span>
                    {it.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Follow-up composer */}
      {onFollowUpChange && (
        <div className="space-y-2 pt-1">
          <label className="text-xs font-medium text-muted-foreground">Ask the Campaign Agent</label>
          <textarea
            value={followUp}
            onChange={(e) => onFollowUpChange(e.target.value)}
            placeholder="Ask a follow-up to get more detail…"
            rows={2}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {onAskAgent && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onAskAgent}>
              <MessageSquare className="h-4 w-4" />
              Ask the agent
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
