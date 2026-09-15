'use client';

import * as React from 'react';
import { useDb, type Creative } from '@/lib/db';
import type { SummaryItem } from './summary-card';
import { CreativePreview } from './creative-preview';
import { CreativePreviewDialog } from './creative-preview-dialog';

/**
 * The booking's creatives as an item of the BOOKING summary card — not a card
 * of their own. Creatives are part of the booking, so the booking card lists
 * them the way it lists its run time and targets: how many are linked, each
 * with its thumbnail, status and a preview one click away. Pass `bookingId`
 * for a booking that exists, `creativeIds` for one still being built.
 *
 * Returns the item to spread into the card's items and the preview dialog to
 * render next to the card.
 */
const STATUS_WORD: Record<Creative['status'], string> = {
  requested: 'Requested',
  draft: 'Draft',
  submitted: 'Submitted',
  'in-review': 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export function useBookingCreativeItems(bookingId?: string, creativeIds?: string[]): { items: SummaryItem[]; dialog: React.ReactNode } {
  const db = useDb();
  const templatesById = new Map(db.creativeTemplates.map((t) => [t.id, t]));
  const linked: Creative[] = bookingId
    ? db.creatives.filter((c) => c.bookingIds.includes(bookingId))
    : db.creatives.filter((c) => (creativeIds ?? []).includes(c.id));
  const [previewId, setPreviewId] = React.useState<string | null>(null);
  const previewing = previewId ? db.creatives.find((c) => c.id === previewId) ?? null : null;
  const approved = linked.filter((c) => c.status === 'approved').length;

  const items: SummaryItem[] = [
    {
      label: 'Creatives',
      value:
        linked.length === 0 ? (
          'None linked — the booking cannot go live without an approved one'
        ) : (
          <div className="w-full min-w-0 space-y-1.5">
            <div>
              {linked.length} linked{approved < linked.length ? ` · ${approved} approved` : ' · all approved'}
            </div>
            {linked.map((c) => {
              const template = templatesById.get(c.templateId);
              return (
                /* One small creative card per creative: the preview, then its
                   name and size on one line — click it for the big preview. */
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setPreviewId(c.id)}
                  className="block w-full rounded-md border bg-background p-1.5 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Preview ${c.name}`}
                  title="Open preview"
                >
                  {template ? (
                    <CreativePreview template={template} values={c.values} creativeId={c.id} showLabel={false} />
                  ) : (
                    <div className="h-16 w-full rounded border bg-muted" />
                  )}
                  <div className="mt-1.5 flex items-center justify-between gap-2 px-0.5 text-[12px]">
                    <span className="min-w-0 truncate text-foreground" title={c.name}>
                      {c.name}
                      {c.status !== 'approved' && <span className="text-muted-foreground"> · {STATUS_WORD[c.status]}</span>}
                    </span>
                    {template && <span className="shrink-0 tabular-nums text-muted-foreground">{template.sizes[0]}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ),
    },
  ];

  const dialog = <CreativePreviewDialog creative={previewing} onClose={() => setPreviewId(null)} />;
  return { items, dialog };
}
