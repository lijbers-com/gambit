'use client';

import * as React from 'react';
import { useDb, type Creative, type EngineId } from '@/lib/db';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { CreativePreview } from './creative-preview';
import { CreativeStatusBadge } from './creative-builder';

/**
 * The one "look before you open" preview: the real composition at the
 * format's true proportions, the status, and a way into the builder. The
 * booking's creatives tab, the booking summary card and the wizard all use
 * this same dialog, so a creative looks the same wherever it is previewed.
 */
export const CreativePreviewDialog: React.FC<{
  creative: Creative | null;
  onClose: () => void;
  /** Extra footer actions, rendered before "Open creative". */
  actions?: React.ReactNode;
}> = ({ creative, onClose, actions }) => {
  const db = useDb();
  const template = creative ? db.creativeTemplates.find((t) => t.id === creative.templateId) : undefined;
  const open = (c: Creative) => { window.location.href = `/creatives/${c.engine as EngineId}/${c.id}`; };
  return (
    <Dialog open={!!creative} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        {creative && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="min-w-0 truncate">{creative.name}</span>
                <CreativeStatusBadge status={creative.status} />
              </DialogTitle>
              <DialogDescription>
                {creative.id} · {template?.name ?? 'No template'}
              </DialogDescription>
            </DialogHeader>
            {template && <CreativePreview template={template} values={creative.values} creativeId={creative.id} />}
            {creative.status === 'rejected' && creative.rejectionReason && (
              <p className="rounded-md border border-destructive-200 bg-destructive-50 p-2.5 text-sm text-destructive-700">
                {creative.rejectionReason}
              </p>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Close</Button>
              {actions}
              <Button onClick={() => open(creative)}>Open creative</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
