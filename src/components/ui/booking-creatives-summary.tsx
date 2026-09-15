'use client';

import * as React from 'react';
import { Eye } from 'lucide-react';
import { useDb, type Creative } from '@/lib/db';
import { Button } from './button';
import type { SummaryItem } from './summary-card';
import { CreativePreviewThumb } from './creative-preview';
import { CreativePreviewDialog } from './creative-preview-dialog';
import { CreativeStatusBadge } from './creative-builder';

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
            {linked.map((c) => (
              <div key={c.id} className="flex w-full min-w-0 items-center gap-2">
                <CreativePreviewThumb creative={c} template={templatesById.get(c.templateId)} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate text-foreground" title={c.name}>{c.name}</span>
                <CreativeStatusBadge status={c.status} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="-my-1 h-7 w-7 shrink-0"
                  aria-label={`Preview ${c.name}`}
                  title="Preview"
                  onClick={() => setPreviewId(c.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ),
    },
  ];

  const dialog = <CreativePreviewDialog creative={previewing} onClose={() => setPreviewId(null)} />;
  return { items, dialog };
}
