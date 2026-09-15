'use client';

import * as React from 'react';
import { Check, Eye, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useDb,
  createCreative,
  setCreativeStatus,
  type Creative,
  type CreativeTemplate,
  type EngineId,
} from '@/lib/db';
import { AddButton } from './add-button';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { FilterBar } from './filter-bar';
import { Input } from './input';
import { OptionCard, OptionCardTick } from './option-card';
import { PropositionIcon } from './proposition-icon';
import { Table } from './table';
import { Textarea } from './textarea';
import { queueToast } from './toast';
import { CreativePreview, CreativePreviewThumb } from './creative-preview';
import { CreativeStatusBadge } from './creative-builder';

/**
 * The creative portal — the home of every creative across engines, on the
 * database. One implementation serves the unified page and the per-engine
 * pages (pass `engine`). What the big platforms taught us is built in: every
 * row shows the actual creative (the same preview the builder draws), Add
 * creative starts from a TEMPLATE (the engine's own logic), and approve /
 * reject write real status — a rejection always carries its reason.
 */

const ENGINE_LABEL: Record<string, string> = {
  display: 'Display',
  'digital-instore': 'Digital in-store',
  'offline-instore': 'Offline in-store',
  offsite: 'Offsite',
};

const STATUS_OPTIONS = ['Requested', 'Draft', 'Submitted', 'In review', 'Approved', 'Rejected'];
const statusLabel = (s: Creative['status']) => (s === 'in-review' ? 'In review' : s[0].toUpperCase() + s.slice(1));

export const CreativePortal: React.FC<{ engine?: EngineId; className?: string }> = ({ engine, className }) => {
  const db = useDb();
  const templates = db.creativeTemplates;
  const templatesById = new Map(templates.map((t) => [t.id, t]));

  const scope = engine ? db.creatives.filter((c) => c.engine === engine) : db.creatives;

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [engineFilter, setEngineFilter] = React.useState<string[]>([]);
  const [templateFilter, setTemplateFilter] = React.useState<string[]>([]);

  const rows = scope.filter((c) => {
    if (search && !`${c.name} ${c.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter.length && !statusFilter.includes(statusLabel(c.status))) return false;
    if (engineFilter.length && !engineFilter.includes(ENGINE_LABEL[c.engine])) return false;
    if (templateFilter.length && !templateFilter.includes(templatesById.get(c.templateId)?.name ?? '')) return false;
    return true;
  });

  const open = (c: Creative) => {
    window.location.href = `/creatives/${c.engine}/${c.id}`;
  };

  // ── Review (approve / reject with reason) ──
  const [reviewing, setReviewing] = React.useState<Creative | null>(null);
  const [rejecting, setRejecting] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const review = reviewing ? db.creatives.find((c) => c.id === reviewing.id) ?? null : null;

  const approve = (c: Creative) => {
    setCreativeStatus(c.id, 'approved');
    queueToast({ title: 'Creative approved', description: `"${c.name}" can now go live on its bookings.` });
    setReviewing(null);
  };
  const reject = (c: Creative) => {
    setCreativeStatus(c.id, 'rejected', reason.trim() || 'Does not meet the format specification.');
    queueToast({ title: 'Creative rejected', description: 'The advertiser sees the reason and can resubmit.' });
    setRejecting(false);
    setReason('');
    setReviewing(null);
  };

  // ── Add creative: engine (unless preset) → template → name ──
  const [adding, setAdding] = React.useState(false);
  const [addEngine, setAddEngine] = React.useState<EngineId | null>(engine ?? null);
  const [addTemplate, setAddTemplate] = React.useState<string | null>(null);
  const [addName, setAddName] = React.useState('');
  const addTemplates = templates.filter((t) => t.engine === (addEngine ?? engine));

  /** Add = build it yourself; Request = ask the advertiser to upload.
   *  A request creates the creative as `requested` and copies the upload
   *  link to send along — the no-login advertiser page is the next step. */
  const [mode, setMode] = React.useState<'add' | 'request'>('add');

  const createDraft = () => {
    if (!addEngine || !addTemplate) return;
    const creative = createCreative({
      name: addName.trim() || 'Untitled creative',
      engine: addEngine,
      templateId: addTemplate,
      status: mode === 'request' ? 'requested' : 'draft',
      values: {},
      languages: ['en'],
      bookingIds: [],
    });
    if (mode === 'request') {
      navigator.clipboard?.writeText(`${window.location.origin}/creatives/${addEngine}/${creative.id}`).catch(() => {});
      queueToast({ title: 'Upload requested', description: 'The upload link is on your clipboard — send it to the advertiser.' });
      setAdding(false);
      return;
    }
    window.location.href = `/creatives/${addEngine}/${creative.id}`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <FilterBar
              searchPlaceholder="Search creatives…"
              searchValue={search}
              onSearchChange={setSearch}
              filters={[
                { name: 'Status', options: STATUS_OPTIONS.map((s) => ({ label: s, value: s })), selectedValues: statusFilter, onChange: setStatusFilter },
                ...(engine
                  ? []
                  : [{ name: 'Proposition', options: Object.values(ENGINE_LABEL).map((l) => ({ label: l, value: l })), selectedValues: engineFilter, onChange: setEngineFilter }]),
                {
                  name: 'Template',
                  options: [...new Set((engine ? templates.filter((t) => t.engine === engine) : templates).map((t) => t.name))].map((n) => ({ label: n, value: n })),
                  selectedValues: templateFilter,
                  onChange: setTemplateFilter,
                },
              ]}
            />
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                className="gap-1.5"
                onClick={() => { setMode('request'); setAddEngine(engine ?? null); setAddTemplate(null); setAddName(''); setAdding(true); }}
              >
                <Send className="h-4 w-4" /> Request upload
              </Button>
              <AddButton onClick={() => { setMode('add'); setAddEngine(engine ?? null); setAddTemplate(null); setAddName(''); setAdding(true); }}>
                Add creative
              </AddButton>
            </div>
          </div>

          <Table
            columns={[
              {
                key: 'preview', header: '', width: 88,
                render: (c: Creative) => <CreativePreviewThumb creative={c} template={templatesById.get(c.templateId)} />,
              },
              {
                key: 'review', header: 'Actions', width: 136,
                render: (c: Creative) => (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Preview ${c.name}`} onClick={(e) => { e.stopPropagation(); setReviewing(c); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(c.status === 'submitted' || c.status === 'in-review') && (
                      <>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Reject ${c.name}`} onClick={(e) => { e.stopPropagation(); setReviewing(c); setRejecting(true); }}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-success-600" aria-label={`Approve ${c.name}`} onClick={(e) => { e.stopPropagation(); approve(c); }}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ),
              },
              {
                key: 'name', header: 'Name',
                render: (c: Creative) => (
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.id}</div>
                  </div>
                ),
              },
              { key: 'status', header: 'Status', render: (c: Creative) => <CreativeStatusBadge status={c.status} /> },
              ...(engine
                ? []
                : [{
                    key: 'engine', header: 'Proposition',
                    render: (c: Creative) => (
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <PropositionIcon engineType={c.engine} className="h-4 w-4" />
                        {ENGINE_LABEL[c.engine]}
                      </span>
                    ),
                  }]),
              { key: 'template', header: 'Template', render: (c: Creative) => templatesById.get(c.templateId)?.name ?? '—' },
              {
                key: 'sizes', header: 'Sizes',
                render: (c: Creative) => (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {(templatesById.get(c.templateId)?.sizes ?? []).join(' · ')}
                  </span>
                ),
              },
              { key: 'bookings', header: 'Bookings', render: (c: Creative) => c.bookingIds.length },
              { key: 'updated', header: 'Updated', render: (c: Creative) => c.updatedAt.slice(0, 10) },
            ]}
            data={rows}
            onRowClick={open}
            hideActions
            emptyState={<span>No creatives match — change the filters, or add one from a template.</span>}
          />
        </CardContent>
      </Card>

      {/* ── Review dialog: the real preview, then the verdict ── */}
      <Dialog open={!!review && !rejecting} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {review && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="min-w-0 truncate">{review.name}</span>
                  <CreativeStatusBadge status={review.status} />
                </DialogTitle>
                <DialogDescription>
                  {review.id} · {ENGINE_LABEL[review.engine]} · {templatesById.get(review.templateId)?.name}
                </DialogDescription>
              </DialogHeader>
              {templatesById.get(review.templateId) && (
                <CreativePreview template={templatesById.get(review.templateId)!} values={review.values} creativeId={review.id} />
              )}
              {review.status === 'rejected' && review.rejectionReason && (
                <p className="rounded-md border border-destructive-200 bg-destructive-50 p-2.5 text-sm text-destructive-700">
                  {review.rejectionReason}
                </p>
              )}
              <DialogFooter className="gap-2 sm:justify-between">
                <Button variant="outline" onClick={() => open(review)}>Open creative</Button>
                {(review.status === 'submitted' || review.status === 'in-review') && (
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-1.5" onClick={() => setRejecting(true)}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                    <Button className="gap-1.5" onClick={() => approve(review)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Rejection carries its reason — the FAQ has promised this all along ── */}
      <Dialog open={rejecting && !!review} onOpenChange={(o) => { if (!o) { setRejecting(false); setReason(''); } }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Reject creative</DialogTitle>
            <DialogDescription>The advertiser sees this reason and can fix and resubmit.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="What does not meet the spec?" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejecting(false); setReason(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => review && reject(review)}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add creative: proposition → template → name ── */}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{mode === 'request' ? 'Request an upload' : 'New creative'}</DialogTitle>
            <DialogDescription>
              {mode === 'request'
                ? 'Pick the template the advertiser must fill — the request appears here as Requested, and the upload link goes on your clipboard.'
                : "Start from the engine's template — its logic decides the settings and sizes."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!engine && (
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ENGINE_LABEL) as EngineId[]).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => { setAddEngine(e); setAddTemplate(null); }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-colors',
                      addEngine === e ? 'border-foreground' : 'hover:bg-surface-hover',
                    )}
                  >
                    <PropositionIcon engineType={e} className="h-4 w-4" />
                    {ENGINE_LABEL[e]}
                  </button>
                ))}
              </div>
            )}
            {addEngine && (
              <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                {addTemplates.map((t: CreativeTemplate) => (
                  <OptionCard
                    key={t.id}
                    selected={addTemplate === t.id}
                    title={t.name}
                    description={`${t.description} (${t.sizes.join(', ')})`}
                    onHeaderClick={() => setAddTemplate(t.id)}
                    headerAriaPressed={addTemplate === t.id}
                    control={addTemplate === t.id ? <OptionCardTick /> : undefined}
                  />
                ))}
              </div>
            )}
            {addTemplate && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <Input placeholder="Creative name" value={addName} onChange={(e) => setAddName(e.target.value)} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            <Button disabled={!addEngine || !addTemplate} onClick={createDraft}>
              {mode === 'request' ? 'Create request and copy link' : 'Create and open builder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
