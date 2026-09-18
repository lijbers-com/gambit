'use client';

import * as React from 'react';
import { MessageSquare, WalletCards, Rows3, LayoutList, ArrowLeft } from 'lucide-react';
import { stashAgentContext } from '@/lib/agent-context';
import { CaseCard, type CaseCardData } from './case-card';
import { Badge } from './badge';
import { Button } from './button';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerFooter,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
} from './right-drawer';
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

/** The evidence behind a recommendation or insight — the shared case card's
 *  data shape, so the case reads the same on every surface. */
export type MessageBusinessCase = CaseCardData;

/** Hierarchy icons, matching HierarchyBadge and the inbox row. */
const levelIcon = {
  'media-plan': WalletCards,
  'campaign': Rows3,
  'booking': LayoutList,
} as const;

/** Badge per kind — the same named Badge variants everywhere a kind shows,
 *  the inbox list and the chart cards' own insight rows included, rather
 *  than a bespoke colour per surface. */
const kindBadge: Record<MessageKind, { label: string; variant: 'destructive' | 'todo' | 'secondary' | 'outline' | 'warning' }> = {
  health: { label: 'At risk', variant: 'destructive' },
  action: { label: 'To do', variant: 'todo' },
  recommendation: { label: 'Recommendation', variant: 'secondary' },
  insight: { label: 'Insight', variant: 'outline' },
};

export interface MessageDrawerProps {
  /** Render the message in place — inside whatever panel is already open —
   *  instead of sliding a second drawer over it. */
  inline?: boolean;
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
  /** Opens the Campaign Agent with this message as the starting question.
   *  Every insight and recommendation offers this — omitting the prop gets
   *  the house behaviour (hand the subject to /chat), not no button. */
  onAskAgent?: () => void;
  /** A recommendation's answers, rendered inside the case template. */
  onAccept?: () => void;
  acceptLabel?: string;
  onDecline?: () => void;
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
  onAccept,
  acceptLabel,
  onDecline,
  footer,
  inline,
}) => {
  const badge =
    kind === 'health' && severity !== 'blocking'
      ? { label: 'Needs attention', variant: 'warning' as const }
      : kindBadge[kind];

  const hasCase = !!(
    businessCase?.stats?.length || businessCase?.chart || businessCase?.insights?.length || businessCase?.move?.length
  );

  // The hand-off IS the fence: the agent gets this message and its business
  // case, nothing else.
  const askAgent =
    onAskAgent ??
    (() => {
      if (typeof window === 'undefined') return;
      stashAgentContext({
        kind,
        subject,
        message: typeof message === 'string' ? message : undefined,
        stats: businessCase?.stats,
        chart: businessCase?.chart,
        move: businessCase?.move,
        insights: businessCase?.insights,
      });
      window.location.href = `/chat?q=${encodeURIComponent(`Tell me more: ${subject}`)}`;
    });

  const bodyEl = (
    <RightDrawerBody className="space-y-6">
      {/* Same size as the rest of the copy — the title and the badge above
          already establish the hierarchy, so the body reads as body text. */}
      <p className="text-sm leading-relaxed text-foreground">{message}</p>

      {hasCase && (
        <CaseCard
          title="The case for this"
          kind={kind === 'recommendation' ? 'recommendation' : 'insight'}
          basis={kind === 'recommendation' ? { window: 14, method: 'Hero' } : undefined}
          onAskAgent={askAgent}
          onAccept={onAccept}
          acceptLabel={acceptLabel}
          onDecline={onDecline}
          {...businessCase}
        />
      )}

      {/* Going deeper is a deliberate step, not the default reading mode. The
          case template carries its own Ask-the-agent; this block covers the
          messages without a case. */}
      {!hasCase && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed p-3">
          <p className="text-sm text-muted-foreground">Want more detail on this message?</p>
          <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={askAgent}>
            <MessageSquare className="h-4 w-4" />
            Ask the agent
          </Button>
        </div>
      )}
    </RightDrawerBody>
  );
  const footerEl = footer ? <RightDrawerFooter className="justify-between">{footer}</RightDrawerFooter> : null;

  // Inline: the same message, shown in place of the list inside whatever
  // panel is already open. Stacking a second drawer hid one behind the other.
  if (inline) {
    if (!open) return null;
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="p-6 pb-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All notifications
          </button>
          <div>
            <Badge variant={badge.variant} className="w-fit px-2 py-0.5 text-xs font-medium capitalize">
              {badge.label}
            </Badge>
          </div>
          <h2 className="mt-1.5 text-lg font-semibold leading-none tracking-tight">{subject}</h2>
          {context && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              {(() => { const LevelIcon = levelIcon[level ?? 'media-plan']; return <LevelIcon className="h-3.5 w-3.5 shrink-0" />; })()}
              {context}
            </p>
          )}
        </div>
        {bodyEl}
        {footerEl}
      </div>
    );
  }

  return (
    <RightDrawer open={open} onOpenChange={onOpenChange}>
      <RightDrawerContent className="sm:max-w-xl">
        <RightDrawerHeader
          onClose={() => onOpenChange(false)}
          // The kind badge sits beside the close button, not above the
          // title — the title leads, same as the compact insight row it
          // was opened from.
          action={
            <Badge variant={badge.variant} className="w-fit px-2 py-0.5 text-xs font-medium capitalize">
              {badge.label}
            </Badge>
          }
        >
          <RightDrawerTitle>{subject}</RightDrawerTitle>
          {/* What this is about, on its own line with its hierarchy icon — the
              same treatment the inbox row gives it. */}
          {context && (
            <RightDrawerDescription className="flex items-center gap-1.5">
              {(() => { const LevelIcon = levelIcon[level ?? 'media-plan']; return <LevelIcon className="h-3.5 w-3.5 shrink-0" />; })()}
              {context}
            </RightDrawerDescription>
          )}
        </RightDrawerHeader>
        {bodyEl}
        {footerEl}
      </RightDrawerContent>
    </RightDrawer>
  );
};
