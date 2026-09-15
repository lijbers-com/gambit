'use client';

import * as React from 'react';
import { Link2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useDb,
  createCreative,
  updateCreative,
  type Creative,
  type EngineId,
} from '@/lib/db';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Input } from './input';
import { OptionCard, OptionCardTick } from './option-card';
import { Table } from './table';
import { queueToast } from './toast';
import { CreativePreviewThumb } from './creative-preview';
import { CreativeStatusBadge } from './creative-builder';

/**
 * The booking's Creatives tab — link an existing creative from the portal or
 * start a new one from the engine's templates, without leaving the booking.
 * Every proposition except sponsored products gets this panel; SP runs
 * without creatives by design.
 */
export const BookingCreativesPanel: React.FC<{
  engine: EngineId;
  /** The booking this panel belongs to; read from the route when omitted. */
  bookingId?: string;
  className?: string;
}> = ({ engine, bookingId: bookingIdProp, className }) => {
  const db = useDb();

  const [routeId, setRouteId] = React.useState<string | null>(null);
  React.useEffect(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    setRouteId(segments[segments.length - 1] ?? null);
  }, []);
  const bookingId = bookingIdProp ?? routeId ?? undefined;

  const templatesById = new Map(db.creativeTemplates.map((t) => [t.id, t]));
  const attached = bookingId ? db.creatives.filter((c) => c.bookingIds.includes(bookingId)) : [];
  const linkable = db.creatives.filter((c) => c.engine === engine && bookingId && !c.bookingIds.includes(bookingId));

  const [linking, setLinking] = React.useState(false);
  const [selection, setSelection] = React.useState<string[]>([]);

  const [creating, setCreating] = React.useState(false);
  const [newTemplate, setNewTemplate] = React.useState<string | null>(null);
  const [newName, setNewName] = React.useState('');
  const engineTemplates = db.creativeTemplates.filter((t) => t.engine === engine);

  const unlink = (c: Creative) => {
    if (!bookingId) return;
    updateCreative(c.id, { bookingIds: c.bookingIds.filter((id) => id !== bookingId) });
  };

  const link = () => {
    if (!bookingId) return;
    for (const id of selection) {
      const c = db.creatives.find((x) => x.id === id);
      if (c) updateCreative(id, { bookingIds: [...c.bookingIds, bookingId] });
    }
    queueToast({ title: 'Creatives linked', description: `${selection.length} linked to this booking.` });
    setSelection([]);
    setLinking(false);
  };

  const create = () => {
    if (!bookingId || !newTemplate) return;
    const creative = createCreative({
      name: newName.trim() || 'Untitled creative',
      engine,
      templateId: newTemplate,
      status: 'draft',
      values: {},
      languages: ['en'],
      bookingIds: [bookingId],
    });
    window.location.href = `/creatives/${engine}/${creative.id}`;
  };

  return (
    <div className={className}>
      {attached.length === 0 ? (
        <p className="mb-4 text-sm text-muted-foreground">
          No creative attached yet — the booking cannot go live without an approved one.
        </p>
      ) : (
        <div className="mb-4 overflow-x-auto">
          <Table
            columns={[
              {
                key: 'remove', header: '', width: 48,
                render: (c: Creative) => (
                  <Button size="icon" variant="outline" className="h-8 w-8" aria-label={`Unlink ${c.name}`} onClick={() => unlink(c)}>
                    <X className="h-4 w-4" />
                  </Button>
                ),
              },
              { key: 'preview', header: '', width: 72, render: (c: Creative) => <CreativePreviewThumb creative={c} template={templatesById.get(c.templateId)} /> },
              { key: 'name', header: 'Name' },
              { key: 'template', header: 'Template', render: (c: Creative) => templatesById.get(c.templateId)?.name ?? '—' },
              { key: 'status', header: 'Status', render: (c: Creative) => <CreativeStatusBadge status={c.status} /> },
            ]}
            data={attached}
            rowKey={(c: Creative) => c.id}
            hideActions
            rowClassName={() => 'cursor-pointer'}
            onRowClick={(c: Creative) => { window.location.href = `/creatives/${engine}/${c.id}`; }}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-1.5" onClick={() => { setSelection([]); setLinking(true); }}>
          <Link2 className="h-4 w-4" /> Link creative
        </Button>
        <Button className="gap-1.5" onClick={() => { setNewTemplate(null); setNewName(''); setCreating(true); }}>
          <Plus className="h-4 w-4" /> New creative
        </Button>
      </div>

      {/* ── Link existing ── */}
      <Dialog open={linking} onOpenChange={setLinking}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Link a creative</DialogTitle>
            <DialogDescription>From the creative portal, narrowed to what this proposition can run.</DialogDescription>
          </DialogHeader>
          <Table
            columns={[
              { key: 'preview', header: '', width: 72, render: (c: Creative) => <CreativePreviewThumb creative={c} template={templatesById.get(c.templateId)} /> },
              { key: 'name', header: 'Name' },
              { key: 'template', header: 'Template', render: (c: Creative) => templatesById.get(c.templateId)?.name ?? '—' },
              { key: 'status', header: 'Status', render: (c: Creative) => <CreativeStatusBadge status={c.status} /> },
            ]}
            data={linkable}
            rowSelection={{
              selectedKeys: selection,
              onChange: (keys) => setSelection(keys.map(String)),
              getKey: (c: Creative) => c.id,
            }}
            hideActions
            emptyState={<span>Nothing to link yet — create a new creative instead.</span>}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinking(false)}>Cancel</Button>
            <Button disabled={selection.length === 0} onClick={link}>
              Link {selection.length || ''} creative{selection.length === 1 ? '' : 's'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── New from template ── */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>New creative</DialogTitle>
            <DialogDescription>Starts from this proposition's template and opens the builder, linked to this booking.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {engineTemplates.map((t) => (
              <OptionCard
                key={t.id}
                selected={newTemplate === t.id}
                title={t.name}
                description={`${t.description} (${t.sizes.join(', ')})`}
                onHeaderClick={() => setNewTemplate(t.id)}
                headerAriaPressed={newTemplate === t.id}
                control={newTemplate === t.id ? <OptionCardTick /> : undefined}
              />
            ))}
          </div>
          {newTemplate && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <Input placeholder="Creative name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            <Button disabled={!newTemplate} onClick={create}>Create and open builder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
