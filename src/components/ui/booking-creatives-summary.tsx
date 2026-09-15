'use client';

import * as React from 'react';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDb, type Creative } from '@/lib/db';
import { Button } from './button';
import { SummaryCard, type SummaryAction } from './summary-card';
import { CreativePreviewThumb } from './creative-preview';
import { CreativePreviewDialog } from './creative-preview-dialog';
import { CreativeStatusBadge } from './creative-builder';

/**
 * The booking's creatives in the summary column — the "creative" slot of the
 * hierarchy sidebar. Creatives sit on the booking's level, so every booking
 * surface (detail page, wizard) shows the same card: how many are linked,
 * which ones, and a preview one click away. Pass `bookingId` for a booking
 * that exists, `creativeIds` for one still being built in a wizard.
 */
export const BookingCreativesSummary: React.FC<{
  bookingId?: string;
  creativeIds?: string[];
  /** Footer actions, e.g. "Add creative" jumping to the creatives tab. */
  actions?: SummaryAction[];
  className?: string;
}> = ({ bookingId, creativeIds, actions, className }) => {
  const db = useDb();
  const templatesById = new Map(db.creativeTemplates.map((t) => [t.id, t]));
  const linked: Creative[] = bookingId
    ? db.creatives.filter((c) => c.bookingIds.includes(bookingId))
    : db.creatives.filter((c) => (creativeIds ?? []).includes(c.id));
  const [previewId, setPreviewId] = React.useState<string | null>(null);
  const previewing = previewId ? db.creatives.find((c) => c.id === previewId) ?? null : null;

  const approved = linked.filter((c) => c.status === 'approved').length;

  return (
    <>
      <SummaryCard
        title="Creatives"
        entity="creative"
        variant="details"
        className={cn('bg-page', className)}
        actions={actions}
        empty={linked.length === 0 ? 'No creative linked — the booking cannot go live without an approved one.' : undefined}
        items={
          linked.length === 0
            ? undefined
            : [
                {
                  label: 'Linked',
                  value: `${linked.length} creative${linked.length === 1 ? '' : 's'}${approved < linked.length ? ` · ${approved} approved` : ' · all approved'}`,
                },
                ...linked.map((c) => ({
                  label: c.name,
                  value: (
                    <span className="flex w-full min-w-0 items-center gap-2">
                      <CreativePreviewThumb creative={c} template={templatesById.get(c.templateId)} className="shrink-0" />
                      <CreativeStatusBadge status={c.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 shrink-0"
                        aria-label={`Preview ${c.name}`}
                        title="Preview"
                        onClick={() => setPreviewId(c.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </span>
                  ),
                })),
              ]
        }
      />
      <CreativePreviewDialog creative={previewing} onClose={() => setPreviewId(null)} />
    </>
  );
};
