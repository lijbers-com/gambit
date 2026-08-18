'use client';

import * as React from 'react';
import { ArrowRight, Check, Undo2, X } from 'lucide-react';
import { Inbox, type InboxItem } from './inbox';
import { Button } from './button';
import { MessageDrawer, type MessageBusinessCase } from './message-drawer';
import {
  useDb,
  useSession,
  useInboxState,
  deriveMessages,
  markRead,
  markDone,
  markUndone,
  type InboxMessage,
  type EngineId,
} from '@/lib/db';

/**
 * The Inbox tab shown on the media-plan, campaign, booking and engine pages,
 * and the body of the Inbox page.
 *
 * Everything in it is derived from the database (src/lib/db/messages.ts), so a
 * message disappears the moment the thing it asks for is done — there is no
 * separate list to keep in sync. Opening a message marks it read; finishing one
 * moves it to Done, which is remembered per message id.
 */

export interface InboxPanelProps {
  /** What this inbox covers. 'user' is the whole workspace, filtered by role. */
  scope: 'user' | 'media-plan' | 'campaign' | 'booking' | 'engine';
  /** Id of that entity (an EngineId or 'all' for engine scope). Omit to take it
   *  from the route. Not used for 'user'. */
  entityId?: string;
  /** Show an opened message in place of the list rather than in a second
   *  drawer — for when the panel itself already lives in a drawer. */
  detailInline?: boolean;
  className?: string;
}

/** The evidence a derived message carries, as the panel's business case. No
 *  chart: a to-do like "upload creative" has no trend, and inventing one would
 *  make the panel look more certain than the data is. */
const businessCaseFor = (m: InboxMessage): MessageBusinessCase | undefined =>
  m.evidence ? { stats: m.evidence.stats, insights: m.evidence.insights } : undefined;

/**
 * Messages for a scope, resolving the entity from the route when it is not
 * given — the same resolution InboxPanel uses, so a badge and the list it
 * labels always count the same thing.
 */
export function useScopedMessages(scope: InboxPanelProps['scope'], entityId?: string): InboxMessage[] {
  const db = useDb();
  const user = useSession();

  const [routeId, setRouteId] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    setRouteId(segments[segments.length - 1]);
  }, []);
  const id = entityId ?? routeId;

  return React.useMemo(() => {
    if (scope === 'user') {
      return deriveMessages(db, user ? { user: { personaKey: user.personaKey, side: user.side } } : {});
    }
    if (!id) return [];
    if (scope === 'engine') return deriveMessages(db, { engine: id as EngineId | 'all' });
    if (scope === 'media-plan') return deriveMessages(db, { mediaPlanId: id });
    if (scope === 'campaign') return deriveMessages(db, { campaignId: id });
    return deriveMessages(db, { bookingId: id });
  }, [db, user, scope, id]);
}

/** How many messages in this scope the reader has not opened — the tab badge. */
export function useUnreadCount(scope: InboxPanelProps['scope'], entityId?: string): number {
  const messages = useScopedMessages(scope, entityId);
  const status = useInboxState();
  return messages.filter((m) => (status[m.id] ?? 'unread') === 'unread').length;
}

export const InboxPanel: React.FC<InboxPanelProps> = ({ scope, entityId, detailInline, className }) => {
  const db = useDb();
  const user = useSession();
  const status = useInboxState();

  // Templates that render one entity per route can omit entityId; the last path
  // segment identifies it. Resolved after mount, never during render, so the
  // server HTML and the hydrated client agree.
  const [routeId, setRouteId] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    setRouteId(segments[segments.length - 1]);
  }, []);
  const id = entityId ?? routeId;

  const messages = React.useMemo(() => {
    if (scope === 'user') {
      return deriveMessages(db, user ? { user: { personaKey: user.personaKey, side: user.side } } : {});
    }
    if (!id) return [];
    if (scope === 'engine') return deriveMessages(db, { engine: id as EngineId | 'all' });
    if (scope === 'media-plan') return deriveMessages(db, { mediaPlanId: id });
    if (scope === 'campaign') return deriveMessages(db, { campaignId: id });
    return deriveMessages(db, { bookingId: id });
  }, [db, user, scope, id]);

  const [openId, setOpenId] = React.useState<string | null>(null);
  const active = messages.find((m) => m.id === openId) ?? null;

  const items: InboxItem[] = messages.map((m) => ({
    id: m.id,
    kind: m.kind,
    subject: m.subject,
    preview: m.preview,
    severity: m.severity,
    // Every message says what it is about, at every scope — inside a plan's own
    // Inbox tab that still tells you which campaign or booking is meant.
    context: m.context,
    level: m.level,
  }));

  const open = (item: InboxItem) => {
    markRead(item.id);
    setOpenId(item.id);
  };

  return (
    <div className={className}>
      {!(detailInline && active) && (
      <Inbox
        items={items}
        status={status}
        onOpen={open}
        emptyMessage={
          scope === 'user'
            ? 'Nothing needs your attention right now.'
            : 'Everything here is set up — nothing to do.'
        }
      />
      )}

      {active && (
        <MessageDrawer
          inline={detailInline}
          open
          onOpenChange={(isOpen) => { if (!isOpen) setOpenId(null); }}
          kind={active.kind}
          severity={active.severity}
          subject={active.subject}
          context={active.context}
          level={active.level}
          message={active.preview}
          businessCase={businessCaseFor(active)}
          onAskAgent={() => {
            const q = `Tell me more: ${active.subject} — ${active.preview}`;
            if (typeof window !== 'undefined') window.location.href = `/chat?q=${encodeURIComponent(q)}`;
          }}
          footer={
            active.kind === 'recommendation' && status[active.id] !== 'done' ? (
              // A recommendation is a proposal, so its two answers are the
              // proposal's: take it or turn it down. Either way it is
              // answered — both close the case as done.
              <>
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => { markDone(active.id); setOpenId(null); }}
                >
                  <X className="h-4 w-4" />
                  Decline
                </Button>
                <Button
                  className="gap-1.5"
                  onClick={() => { markDone(active.id); setOpenId(null); }}
                >
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
              </>
            ) : (
            <>
              {status[active.id] === 'done' ? (
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => { markUndone(active.id); setOpenId(null); }}
                >
                  <Undo2 className="h-4 w-4" />
                  Move back to to-do
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => { markDone(active.id); setOpenId(null); }}
                >
                  <Check className="h-4 w-4" />
                  Mark as done
                </Button>
              )}
              <Button
                className="gap-1.5"
                onClick={() => {
                  if (typeof window !== 'undefined') window.location.href = active.href;
                }}
              >
                Go there
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
            )
          }
        />
      )}
    </div>
  );
};
