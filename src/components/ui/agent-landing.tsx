'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AGENT_CASES, type AgentCase } from '@/lib/agent-cases';
import { stashAgentContext } from '@/lib/agent-context';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';

/**
 * The Campaign Agent's front door. The agent's main flow starts from a case,
 * so the landing leads with the cases: the same insights and recommendations
 * the inbox and dashboards surface, each opening a fenced conversation. The
 * prompt input is there too — a question without a case gets the agent in
 * general mode, which says so.
 */

/** Open the fenced conversation for one case — the same hard hand-off the
 *  message drawer's Ask-the-agent uses. */
function openCase(c: AgentCase) {
  stashAgentContext({ kind: c.kind, subject: c.subject, message: c.message, ...c.caseData });
  window.location.href = `/chat?q=${encodeURIComponent(`Tell me more: ${c.subject}`)}`;
}

const CaseTile: React.FC<{ c: AgentCase; onOpen: () => void }> = ({ c, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="flex min-w-0 flex-col rounded-lg border bg-card p-4 text-left transition-all hover:shadow-md"
  >
    <span className="text-xs capitalize text-muted-foreground">{c.kind}</span>
    <span className="mt-0.5 text-sm font-medium">{c.subject}</span>
    <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{c.message}</span>
    {c.caseData.stats && (
      <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {c.caseData.stats.slice(0, 3).map((s) => (
          <span key={s.label} className="text-xs text-muted-foreground">
            {s.label}{' '}
            <span className={cn('font-semibold tabular-nums', s.tone === 'success' ? 'text-success-600' : 'text-foreground')}>
              {s.value}
            </span>
          </span>
        ))}
      </span>
    )}
  </button>
);

export const AgentLanding: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('w-full max-w-[800px] space-y-6', className)}>
      <PromptInput
        onSubmit={({ text }) => {
          if (text?.trim()) window.location.href = `/chat?q=${encodeURIComponent(text.trim())}`;
        }}
      >
        <PromptInputBody>
          <PromptInputTextarea placeholder="Ask about your campaigns…" />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Campaign Agent
            </span>
          </PromptInputTools>
          <PromptInputSubmit status="ready" />
        </PromptInputFooter>
      </PromptInput>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Or start from a case</div>
        <p className="text-xs text-muted-foreground">
          The agent works best grounded in one insight or recommendation — the same cases your inbox and dashboards surface.
        </p>
        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
          {AGENT_CASES.map((c) => (
            <CaseTile key={c.slug} c={c} onOpen={() => openCase(c)} />
          ))}
        </div>
      </div>
    </div>
  );
};
