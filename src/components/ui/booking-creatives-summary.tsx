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
                <div key={c.id} className="min-w-0 space-y-1 pt-1">
                  <div className="truncate" title={c.name}>
                    <span className="text-foreground">{c.name}</span>
                    {c.status !== 'approved' && <span> · {STATUS_WORD[c.status]}</span>}
                  </div>
                  {/* The preview at the card's width — click it for the big one. */}
                  <button
                    type="button"
                    onClick={() => setPreviewId(c.id)}
                    className="block w-full rounded-md text-left transition-shadow hover:ring-2 hover:ring-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Preview ${c.name}`}
                    title="Open preview"
                  >
                    {template ? (
                      <CreativePreview template={template} values={c.values} creativeId={c.id} />
                    ) : (
                      <div className="h-16 w-full rounded border bg-muted" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ),
    },
  ];

  const dialog = <CreativePreviewDialog creative={previewing} onClose={() => setPreviewId(null)} />;
  return { items, dialog };
}
