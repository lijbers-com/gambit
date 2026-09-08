'use client';

/**
 * The bounded hand-off from an insight or recommendation to the Campaign
 * Agent. The agent's main flow deliberately starts from ONE message and its
 * business case — a fenced set of data, not the whole database — so the
 * conversation stays grounded in the numbers the user was just looking at.
 *
 * The drawer stashes this in sessionStorage and navigates; the chat page
 * takes it and sends it with every request, where the route folds it into
 * the system prompt as the only data the agent may reason from.
 */

export interface AgentChartData {
  data: Record<string, string | number | boolean | null | undefined>[];
  /** Series key → { label, color? } — the shape ChartConfig already has. */
  config: Record<string, { label?: string; color?: string }>;
  kind?: 'area' | 'bar';
  xKey?: string;
  horizontal?: boolean;
  rightAxisKey?: string;
  title?: string;
}

export interface AgentContext {
  /** What kind of message opened the agent: insight, recommendation, … */
  kind?: string;
  subject: string;
  /** The message body the user was reading. */
  message?: string;
  stats?: { label: string; value: string; sub?: string; tone?: string }[];
  chart?: AgentChartData;
  insights?: { title: string; text: string }[];
}

const KEY = 'gambit-agent-context';

export function stashAgentContext(ctx: AgentContext) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(ctx));
  } catch {
    /* storage unavailable — the agent just starts without the context */
  }
}

/** Read the stashed context. Kept (not consumed) so a reload of the chat
 *  keeps its grounding; the next stash simply replaces it. */
export function readAgentContext(): AgentContext | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AgentContext) : null;
  } catch {
    return null;
  }
}

export function clearAgentContext() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
