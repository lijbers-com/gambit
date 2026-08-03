'use client';

import * as React from 'react';
import { ChevronRight, Check, Inbox as InboxIcon, WalletCards, Rows3, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import type { MessageKind, MessageStatus } from '@/lib/db';

/**
 * The inbox list.
 *
 * Reads like a mail client: an unread dot on the left, the message type as a
 * badge, a bold subject, a preview line, and the entity it belongs to on the
 * right. No card chrome and no "Notifications" header — whatever contains the
 * inbox (a tab, a page) already names it, and naming it twice was the thing
 * that made the old component feel heavy.
 *
 * Purely presentational. Read/done state is passed in, so the same component
 * serves the persisted, database-backed inbox and the throwaway advice list in
 * the wizard.
 */

/** One row. `kind` drives the badge; everything else is content. */
export interface InboxItem {
  id: string;
  kind: MessageKind;
  subject: string;
  preview: React.ReactNode;
  /** What the message is about — e.g. "Holiday Sale Plan · Display". */
  context?: string;
  /** Which level that entity sits at, so the context line gets the matching
   *  hierarchy icon. Defaults to media plan. */
  level?: 'media-plan' | 'campaign' | 'booking';
  /** Only read for health messages, where "at risk" and "needs attention" are
   *  the same kind but must not look the same. */
  severity?: 'blocking' | 'attention' | 'info';
}

/** The hierarchy icons, matching HierarchyBadge so a booking looks like a
 *  booking wherever it appears. */
const levelIcon = {
  'media-plan': WalletCards,
  'campaign': Rows3,
  'booking': LayoutList,
} as const;

/** Badge styling per kind. */
const kindBadge: Record<MessageKind, { label: string; className: string }> = {
  health: { label: 'At risk', className: 'border-red-200 bg-red-50 text-red-700' },
  action: { label: 'Action needed', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  recommendation: { label: 'Recommendation', className: 'border-primary/20 bg-primary/5 text-primary' },
  insight: { label: 'Insight', className: 'border-border bg-neutral-50 text-neutral-600' },
};

/** A health message that isn't blocking is amber "Needs attention", not red. */
const badgeFor = (item: InboxItem) => {
  if (item.kind === 'health' && item.severity !== 'blocking') {
    return { label: 'Needs attention', className: 'border-amber-200 bg-amber-50 text-amber-700' };
  }
  return kindBadge[item.kind];
};

export type InboxFilter = 'all' | 'unread' | 'done';

export interface InboxProps {
  items: InboxItem[];
  /** Status per message id. Anything missing counts as unread. */
  status?: Record<string, MessageStatus>;
  onOpen?: (item: InboxItem) => void;
  /** Shown as a "Mark all read" button when there is anything unread. */
  onMarkAllRead?: () => void;
  /** Copy for the empty state — say what the user did right, not "no data". */
  emptyMessage?: string;
  /** Force the filter row on or off; by default it appears once it earns its place. */
  showFilters?: boolean;
  className?: string;
}

const statusOfItem = (item: InboxItem, status?: Record<string, MessageStatus>): MessageStatus =>
  status?.[item.id] ?? 'unread';

export const Inbox: React.FC<InboxProps> = ({
  items,
  status,
  onOpen,
  onMarkAllRead,
  emptyMessage = 'Nothing needs your attention.',
  showFilters,
  className,
}) => {
  const [filter, setFilter] = React.useState<InboxFilter>('all');

  const unread = items.filter((i) => statusOfItem(i, status) === 'unread');
  const done = items.filter((i) => statusOfItem(i, status) === 'done');
  const open = items.filter((i) => statusOfItem(i, status) !== 'done');

  // The filter row only earns its place once there is something to filter.
  const filtersVisible = showFilters ?? (items.length > 4 || done.length > 0);

  const visible = filter === 'unread' ? unread : filter === 'done' ? done : open;

  const filters: { value: InboxFilter; label: string; count: number }[] = [
    { value: 'all', label: 'To do', count: open.length },
    { value: 'unread', label: 'Unread', count: unread.length },
    { value: 'done', label: 'Done', count: done.length },
  ];

  return (
    <div className={cn('w-full', className)}>
      {filtersVisible && (
        <div className="mb-3 flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filter === f.value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label} {f.count > 0 && <span className="tabular-nums">({f.count})</span>}
            </button>
          ))}
          {onMarkAllRead && unread.length > 0 && (
            <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={onMarkAllRead}>
              Mark all read
            </Button>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center">
          <InboxIcon className="h-5 w-5 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">
            {filter === 'done' ? 'Nothing finished yet.' : filter === 'unread' ? "You're all caught up." : emptyMessage}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60 overflow-hidden rounded-lg border">
          {visible.map((item) => {
            const s = statusOfItem(item, status);
            const isUnread = s === 'unread';
            const isDone = s === 'done';
            const badge = badgeFor(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen?.(item)}
                className={cn(
                  // Hover lifts the row to white — the same "this is the one
                  // I'm on" cue a mail client gives, and it reads on both the
                  // tinted unread rows and the plain read ones.
                  'group/msg flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white',
                  isUnread && 'bg-primary/[0.03]',
                  isDone && 'opacity-60 hover:opacity-100',
                )}
              >
                {/* Unread dot — the single strongest inbox signal. Finished
                    messages swap it for a check so the column always reads. */}
                <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  {isDone ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : isUnread ? (
                    <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
                  ) : null}
                </span>

                <span className="min-w-0 flex-1">
                  {/* Subject leads, badge sits at the end of the line — so the
                      subject, preview and entity all start at the same edge. */}
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'min-w-0 flex-1 truncate text-sm text-foreground',
                        isUnread ? 'font-semibold' : 'font-medium',
                      )}
                    >
                      {item.subject}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn('shrink-0 px-2 py-0.5 text-xs font-medium', badge.className)}
                    >
                      {badge.label}
                    </Badge>
                  </span>
                  {item.preview && (
                    <span className="mt-0.5 block truncate text-sm text-muted-foreground">{item.preview}</span>
                  )}
                  {/* What the message is about, on its own line with the icon
                      for its level — every message carries one, so the list
                      always says which plan, campaign or booking it concerns. */}
                  {item.context && (() => {
                    const LevelIcon = levelIcon[item.level ?? 'media-plan'];
                    return (
                      <span className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <LevelIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.context}</span>
                      </span>
                    );
                  })()}
                </span>

                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover/msg:text-foreground" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
