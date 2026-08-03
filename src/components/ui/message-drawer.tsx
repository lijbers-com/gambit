'use client';

import * as React from 'react';
import { MessageSquare, WalletCards, Rows3, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { AreaChartComponent } from './area-chart';
import { BarChartComponent } from './bar-chart';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerFooter,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
} from './right-drawer';
import type { ChartDataPoint, ChartConfig } from './chart-types';
import type { MessageKind } from '@/lib/db';

/**
 * The panel every message opens, wherever it was clicked — the Inbox page, an
 * Inbox tab, or the wizard's contextual advice.
 *
 * It reads as a message, not a chat: a clear header, the message itself, and —
 * when there is one — the business case behind it as figures, a chart and key
 * points. The agent is a button at the end for people who want to go deeper,
 * rather than a conversation the panel pretends to already be having.
 */

/** The evidence behind a recommendation or insight. */
export interface MessageBusinessCase {
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

/** Hierarchy icons, matching HierarchyBadge and the inbox row. */
const levelIcon = {
  'media-plan': WalletCards,
  'campaign': Rows3,
  'booking': LayoutList,
} as const;

/** Badge per kind — the same vocabulary the inbox list uses. */
const kindBadge: Record<MessageKind, { label: string; className: string }> = {
  health: { label: 'At risk', className: 'border-red-200 bg-red-50 text-red-700' },
  action: { label: 'Action needed', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  recommendation: { label: 'Recommendation', className: 'border-primary/20 bg-primary/5 text-primary' },
  insight: { label: 'Insight', className: 'border-border bg-neutral-50 text-neutral-600' },
};

export interface MessageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: MessageKind;
  /** Health messages that aren't blocking read "Needs attention", not "At risk". */
  severity?: 'blocking' | 'attention' | 'info';
  /** The message's subject — the panel's title. */
  subject: string;
  /** Which plan / campaign / booking this is about — shown under the title. */
  context?: string;
  /** That entity's level, for the matching hierarchy icon. */
  level?: 'media-plan' | 'campaign' | 'booking';
  /** The message body. */
  message: React.ReactNode;
  /** Figures, chart and key points behind a recommendation or insight. */
  businessCase?: MessageBusinessCase;
  /** Opens the Campaign Agent with this message as the starting question. */
  onAskAgent?: () => void;
  /** The actions for this message — they differ per surface. */
  footer?: React.ReactNode;
}

export const MessageDrawer: React.FC<MessageDrawerProps> = ({
  open,
  onOpenChange,
  kind,
  severity,
  subject,
  context,
  level,
  message,
  businessCase,
  onAskAgent,
  footer,
}) => {
  const badge =
    kind === 'health' && severity !== 'blocking'
      ? { label: 'Needs attention', className: 'border-amber-200 bg-amber-50 text-amber-700' }
      : kindBadge[kind];

  const hasCase = !!(businessCase?.stats?.length || businessCase?.chart || businessCase?.insights?.length);

  return (
    <RightDrawer open={open} onOpenChange={onOpenChange}>
      <RightDrawerContent className="sm:max-w-xl">
        <RightDrawerHeader onClose={() => onOpenChange(false)}>
          <Badge variant="outline" className={cn('w-fit px-2 py-0.5 text-xs font-medium', badge.className)}>
            {badge.label}
          </Badge>
          <RightDrawerTitle className="mt-1.5">{subject}</RightDrawerTitle>
          {/* What this is about, on its own line with its hierarchy icon — the
              same treatment the inbox row gives it. */}
          {context && (
            <RightDrawerDescription className="flex items-center gap-1.5">
              {(() => { const LevelIcon = levelIcon[level ?? 'media-plan']; return <LevelIcon className="h-3.5 w-3.5 shrink-0" />; })()}
              {context}
            </RightDrawerDescription>
          )}
        </RightDrawerHeader>

        <RightDrawerBody className="space-y-6">
          {/* Same size as the rest of the copy — the title and the badge above
              already establish the hierarchy, so the body reads as body text. */}
          <p className="text-sm leading-relaxed text-foreground">{message}</p>

          {hasCase && (
            <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
              <div className="text-sm font-semibold text-foreground">The case for this</div>

              {businessCase?.stats && businessCase.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {businessCase.stats.map((s, i) => (
                    <div key={i} className="rounded-lg border bg-background p-2.5">
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                      <div className="text-base font-semibold leading-tight">{s.value}</div>
                      {s.sub && (
                        <div className={cn('mt-0.5 text-xs', s.tone === 'success' ? 'text-green-600' : 'text-muted-foreground')}>
                          {s.sub}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {businessCase?.chart && (
                <div className="rounded-lg border bg-background p-3">
                  {businessCase.chart.title && (
                    <div className="mb-1 text-sm font-medium text-muted-foreground">{businessCase.chart.title}</div>
                  )}
                  {businessCase.chart.kind === 'bar' ? (
                    <BarChartComponent
                      data={businessCase.chart.data}
                      config={businessCase.chart.config}
                      className="h-[190px] w-full"
                      showLegend
                      horizontal={businessCase.chart.horizontal}
                      xAxisDataKey={businessCase.chart.xKey ?? 'month'}
                    />
                  ) : (
                    <AreaChartComponent
                      data={businessCase.chart.data}
                      config={businessCase.chart.config}
                      className="h-[170px] w-full"
                      showLegend
                      showRightYAxis={!!businessCase.chart.rightAxisKey}
                      rightAxisDataKey={businessCase.chart.rightAxisKey}
                    />
                  )}
                </div>
              )}

              {businessCase?.insights && businessCase.insights.length > 0 && (
                <ul className="space-y-2">
                  {businessCase.insights.map((it, i) => (
                    <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">{it.title}: </span>
                      {it.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Going deeper is a deliberate step, not the default reading mode. */}
          {onAskAgent && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed p-3">
              <p className="text-sm text-muted-foreground">Want more detail on this message?</p>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={onAskAgent}>
                <MessageSquare className="h-4 w-4" />
                Ask the agent
              </Button>
            </div>
          )}
        </RightDrawerBody>

        {footer && <RightDrawerFooter className="justify-between">{footer}</RightDrawerFooter>}
      </RightDrawerContent>
    </RightDrawer>
  );
};
