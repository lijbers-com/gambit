'use client';

import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentContext } from '@/lib/agent-context';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { AreaChartComponent } from '@/components/ui/area-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { Badge } from '@/components/ui/badge';

/**
 * The live Campaign Agent conversation — `useChat` against `/api/chat`,
 * rendered with the AI Elements the frontend team picked, speaking the
 * design system's own visual language for data: every chart or metric the
 * model answers with is a TOOL RESULT, drawn by the same chart components
 * the insight drawer uses. The conversation is fenced to the context it was
 * opened from (an insight or recommendation), which renders as the pinned
 * case card on top so the user always sees what the agent is looking at.
 */

const CHART_FALLBACK_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-3))', 'hsl(var(--chart-5))', 'hsl(var(--chart-7))'];

type ChartToolResult = {
  title: string;
  kind: 'area' | 'bar' | 'donut';
  xKey: string;
  series: { key: string; label: string }[];
  data: Record<string, string | number>[];
};

type MetricsToolResult = { tiles: { label: string; value: string; sub?: string }[] };

/** A chart inside the conversation — a snippet card, never a bare canvas. */
const ChartSnippet: React.FC<{ chart: ChartToolResult }> = ({ chart }) => {
  const config = Object.fromEntries(
    chart.series.map((s, i) => [s.key, { label: s.label, color: CHART_FALLBACK_COLORS[i % CHART_FALLBACK_COLORS.length] }]),
  );
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="mb-1 text-sm font-medium text-muted-foreground">{chart.title}</div>
      <div className="h-52 w-full">
        {chart.kind === 'donut' ? (
          <PieChartComponent
            data={chart.data.map((row) => ({ name: String(row[chart.xKey]), value: Number(row[chart.series[0]?.key] ?? 0) }))}
            config={Object.fromEntries(
              chart.data.map((row, i) => [String(row[chart.xKey]), { label: String(row[chart.xKey]), color: CHART_FALLBACK_COLORS[i % CHART_FALLBACK_COLORS.length] }]),
            )}
            innerRadius={45}
          />
        ) : chart.kind === 'bar' ? (
          <BarChartComponent data={chart.data} config={config} xAxisDataKey={chart.xKey} />
        ) : (
          /* The area chart reads its x axis from the "month" key, so the
             rows are remapped onto it — same convention the cases use. */
          <AreaChartComponent
            data={chart.data.map((row) => ({ ...row, month: row[chart.xKey] }))}
            config={config}
            showLegend={chart.series.length > 1}
          />
        )}
      </div>
    </div>
  );
};

/** Headline figures as small tiles — the metric-card language at chat scale. */
const MetricsSnippet: React.FC<{ metrics: MetricsToolResult }> = ({ metrics }) => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
    {metrics.tiles.map((t) => (
      <div key={t.label} className="rounded-md border border-border bg-background px-3 py-2">
        <span className="block text-xs text-muted-foreground">{t.label}</span>
        <span className="block truncate text-sm font-medium tabular-nums">{t.value}</span>
        {t.sub && <span className="block truncate text-[11px] text-muted-foreground">{t.sub}</span>}
      </div>
    ))}
  </div>
);

/** The fence, visible: what the agent is looking at and nothing else. */
const ContextCard: React.FC<{ context: AgentContext }> = ({ context }) => (
  <div className="rounded-lg border border-border bg-neutral-50 p-4">
    <div className="mb-1 flex items-center gap-2">
      {context.kind && <Badge variant="outline" className="capitalize">{context.kind}</Badge>}
      <span className="min-w-0 truncate text-sm font-medium">{context.subject}</span>
    </div>
    {context.message && <p className="text-xs text-muted-foreground">{context.message}</p>}
    {context.stats && context.stats.length > 0 && (
      <div className="mt-3">
        <MetricsSnippet metrics={{ tiles: context.stats.slice(0, 4) }} />
      </div>
    )}
    {context.chart && context.chart.data.length > 0 && (
      <div className="mt-3 rounded-md border border-border bg-background p-3">
        {context.chart.title && <div className="mb-1 text-xs font-medium text-muted-foreground">{context.chart.title}</div>}
        <div className="h-44 w-full">
          {(() => {
            const config = Object.fromEntries(
              Object.entries(context.chart!.config).map(([k, v], i) => [k, { label: v.label ?? k, color: v.color ?? CHART_FALLBACK_COLORS[i % CHART_FALLBACK_COLORS.length] }]),
            );
            return context.chart!.kind === 'bar' ? (
              <BarChartComponent data={context.chart!.data} config={config} xAxisDataKey={context.chart!.xKey ?? 'month'} />
            ) : (
              <AreaChartComponent
                data={context.chart!.data.map((row) => ({ ...row, month: row[context.chart!.xKey ?? 'month'] }))}
                config={config}
              />
            );
          })()}
        </div>
      </div>
    )}
    <p className="mt-3 text-[11px] text-muted-foreground">
      The agent answers from this case and your conversation — not from the whole platform.
    </p>
  </div>
);

const FOLLOW_UPS = [
  'What would you do about this?',
  'How was this calculated?',
  'What happens if I do nothing?',
];

export interface AgentChatProps {
  /** The bounded case this conversation is grounded in. */
  context?: AgentContext | null;
  /** Sent automatically as the opening user message. */
  initialPrompt?: string;
  className?: string;
}

export const AgentChat: React.FC<AgentChatProps> = ({ context, initialPrompt, className }) => {
  const transport = React.useMemo(
    () => new DefaultChatTransport({ api: '/api/chat', body: { context: context ?? undefined } }),
    [context],
  );
  const { messages, sendMessage, status } = useChat({ transport });

  // The hand-off question opens the conversation by itself — once.
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (initialPrompt && !opened.current) {
      opened.current = true;
      void sendMessage({ text: initialPrompt });
    }
  }, [initialPrompt, sendMessage]);

  const busy = status === 'submitted' || status === 'streaming';

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-[800px] space-y-4 px-4 py-6">
          {context && <ContextCard context={context} />}
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return <MessageResponse key={i}>{part.text}</MessageResponse>;
                  }
                  if (part.type === 'tool-show_chart' && part.state === 'output-available') {
                    return <ChartSnippet key={i} chart={part.output as ChartToolResult} />;
                  }
                  if (part.type === 'tool-show_metrics' && part.state === 'output-available') {
                    return <MetricsSnippet key={i} metrics={part.output as MetricsToolResult} />;
                  }
                  if ((part.type === 'tool-show_chart' || part.type === 'tool-show_metrics') && part.state !== 'output-error') {
                    return <Shimmer key={i} className="text-sm">Preparing the numbers…</Shimmer>;
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
          {busy && messages[messages.length - 1]?.role === 'user' && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer className="text-sm">Reading the case…</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-[800px] space-y-2 px-4 pb-6">
        {messages.length > 0 && !busy && (
          <Suggestions>
            {FOLLOW_UPS.map((s) => (
              <Suggestion key={s} suggestion={s} onClick={(text) => void sendMessage({ text })} />
            ))}
          </Suggestions>
        )}
        <PromptInput
          onSubmit={({ text }) => {
            if (text?.trim()) void sendMessage({ text });
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask about this case…" />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Campaign Agent
              </span>
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
