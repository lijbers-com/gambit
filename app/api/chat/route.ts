import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
  type UIMessage,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

export const maxDuration = 30;

/**
 * The Campaign Agent's brain. The conversation is deliberately FENCED: the
 * request carries the insight/recommendation context the user came from, and
 * the system prompt binds the agent to that data — it analyses and advises
 * inside the fence instead of inventing platform-wide numbers.
 *
 * Charts are first-class: the model answers with `show_chart` /
 * `show_metrics` tool calls whose structured results the client renders with
 * the design system's own chart components — the same snippets the insight
 * drawer shows, so the agent speaks the product's visual language.
 *
 * Without ANTHROPIC_API_KEY the route streams a simulated reply built from
 * the same context, so the prototype demos the full UI (text + chart
 * snippet) with no key configured. The wiring is identical either way.
 */

const chartInput = z.object({
  title: z.string().describe('Short chart title, e.g. "Spend vs target by week"'),
  kind: z.enum(['area', 'bar', 'donut']).describe('area for trends over time, bar for comparisons, donut for shares of a whole'),
  xKey: z.string().describe('The key in each data row used for the x axis (or the segment name key for donut)'),
  series: z
    .array(z.object({ key: z.string(), label: z.string() }))
    .describe('The numeric keys to plot, with display labels. Donut charts use exactly one series (the value key).'),
  data: z
    .array(z.record(z.string(), z.union([z.string(), z.number()])))
    .describe('The rows. Only use numbers that appear in, or are directly derived from, the provided context.'),
});

const metricsInput = z.object({
  tiles: z
    .array(z.object({ label: z.string(), value: z.string(), sub: z.string().optional() }))
    .max(4)
    .describe('Up to four headline figures, straight from the context.'),
});

function buildSystem(context: unknown): string {
  const base = `You are the Campaign Agent of Edge, a retail media platform. You help advertisers and campaign managers understand ONE insight or recommendation at a time and decide what to do about it.

Rules:
- Reason ONLY from the context below and the conversation. If the answer is not derivable from it, say so and suggest where in the platform to look — never invent numbers.
- Lead with the answer in one or two sentences, then support it.
- When numbers carry the point, call show_metrics (headline figures) or show_chart (trends and comparisons) instead of writing number soup. At most one chart and one metrics row per reply.
- Keep replies short; this is a working tool, not an essay.
- End with one concrete next step the user can take in the platform when it helps.`;
  if (!context) {
    return `${base}\n\nNo message context was provided: help with general campaign questions, but be explicit that you are not looking at live data.`;
  }
  return `${base}\n\nThe context — the message the user came from, and its business case:\n${JSON.stringify(context, null, 2)}`;
}

/** The no-key path: a scripted but context-grounded reply, streamed as the
 *  same UIMessage chunks the real model produces. */
function simulatedResponse(context: {
  subject?: string;
  message?: string;
  stats?: { label: string; value: string; sub?: string }[];
  chart?: {
    data: Record<string, unknown>[];
    config: Record<string, { label?: string }>;
    kind?: 'area' | 'bar';
    xKey?: string;
    title?: string;
  };
} | null) {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = 'sim-text';
      const say = (delta: string) => writer.write({ type: 'text-delta', id: textId, delta });
      writer.write({ type: 'text-start', id: textId });
      if (context?.subject) {
        say(`Let's look at “${context.subject}”. `);
        if (context.message) say(`${context.message} `);
        say(`\n\nThe figures behind it are below. Ask me to compare, project, or explain any of them — I answer from this case only.`);
      } else {
        say('I can help with campaign questions, but no message context was handed to me — open an insight or recommendation and press “Ask the agent” to ground this conversation in its data.');
      }
      say('\n\n_(Simulated reply — set ANTHROPIC_API_KEY on the deploy for the live agent.)_');
      writer.write({ type: 'text-end', id: textId });
      if (context?.stats?.length) {
        const callId = 'sim-metrics';
        writer.write({
          type: 'tool-input-available',
          toolCallId: callId,
          toolName: 'show_metrics',
          input: { tiles: context.stats.slice(0, 4) },
        });
        writer.write({
          type: 'tool-output-available',
          toolCallId: callId,
          output: { tiles: context.stats.slice(0, 4) },
        });
      }
      // The chart the case came with, replayed as a show_chart call — so the
      // no-key demo exercises the same chart-snippet rendering the live
      // model's tool calls do.
      if (context?.chart?.data?.length) {
        const c = context.chart;
        const chart = {
          title: c.title ?? context.subject ?? 'The case in one chart',
          kind: c.kind ?? 'area',
          xKey: c.xKey ?? 'month',
          series: Object.entries(c.config).map(([key, v]) => ({ key, label: v.label ?? key })),
          data: c.data,
        };
        const callId = 'sim-chart';
        writer.write({ type: 'tool-input-available', toolCallId: callId, toolName: 'show_chart', input: chart });
        writer.write({ type: 'tool-output-available', toolCallId: callId, output: chart });
      }
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: unknown } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return simulatedResponse((context ?? null) as Parameters<typeof simulatedResponse>[0]);
  }

  const result = streamText({
    model: anthropic('claude-sonnet-5'),
    system: buildSystem(context),
    messages: await convertToModelMessages(messages),
    tools: {
      // Execute echoes the input: the tool IS its rendering — the client
      // draws the chart from the structured result with the design system's
      // own chart components.
      show_chart: tool({
        description: 'Render a chart snippet in the conversation. Use for trends, comparisons and shares the words alone cannot carry.',
        inputSchema: chartInput,
        execute: async (input) => input,
      }),
      show_metrics: tool({
        description: 'Render a row of headline metric tiles. Use for the two to four figures the answer hangs on.',
        inputSchema: metricsInput,
        execute: async (input) => input,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
