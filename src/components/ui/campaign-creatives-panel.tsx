'use client';

import * as React from 'react';
import { Eye } from 'lucide-react';
import { useDb, useRouteCampaign, type Creative, type EngineId } from '@/lib/db';
import { Button } from './button';
import { FilterBar } from './filter-bar';
import { Table } from './table';
import { CreativePreviewThumb } from './creative-preview';
import { CreativePreviewDialog } from './creative-preview-dialog';
import { CreativeStatusBadge } from './creative-builder';

/**
 * The campaign's Creatives tab — an overview of every creative linked to one
 * of its bookings, from the same records the booking pages and the portal
 * use. Read-only here: a creative is linked on its booking, and edited in
 * the builder. The same preview and the same thumbnails as everywhere else.
 */

const STATUS_LABEL: Record<Creative['status'], string> = {
  requested: 'Requested',
  draft: 'Draft',
  submitted: 'Submitted',
  'in-review': 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
};

/** Deterministic demo delivery numbers per creative, for running campaigns. */
const seeded = (id: string) => {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (min: number, max: number, salt: number) => {
    const x = ((h ^ (salt * 2654435761)) >>> 0) / 4294967295;
    return min + Math.round(x * (max - min));
  };
};

export const CampaignCreativesPanel: React.FC<{
  engine: EngineId;
  /** The campaign; read from the route when omitted. */
  campaignId?: string;
  /** Running campaigns show what each creative delivered. */
  showPerformance?: boolean;
  className?: string;
}> = ({ engine, campaignId, showPerformance, className }) => {
  const db = useDb();
  const routeCampaign = useRouteCampaign();
  const id = campaignId ?? routeCampaign?.id;
  const bookings = id ? db.bookings.filter((b) => b.campaignId === id) : [];
  const bookingIds = new Set(bookings.map((b) => b.id));
  const bookingName = new Map(bookings.map((b) => [b.id, b.name]));
  const templatesById = new Map(db.creativeTemplates.map((t) => [t.id, t]));
  const rows = db.creatives.filter((c) => c.engine === engine && c.bookingIds.some((b) => bookingIds.has(b)));

  const [statuses, setStatuses] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  const [previewId, setPreviewId] = React.useState<string | null>(null);
  const previewing = previewId ? db.creatives.find((c) => c.id === previewId) ?? null : null;

  const visible = rows.filter((c) => {
    const q = search.toLowerCase();
    return (
      (statuses.length === 0 || statuses.includes(c.status)) &&
      (q === '' || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    );
  });

  const perf = (c: Creative) => {
    const r = seeded(c.id);
    const impressions = r(120_000, 900_000, 1);
    const clicks = Math.round(impressions * r(6, 18, 2) / 1000);
    const revenue = r(8_000, 60_000, 3);
    return {
      impressions: impressions.toLocaleString('en-GB'),
      clicks: clicks.toLocaleString('en-GB'),
      ctr: `${((clicks / impressions) * 100).toFixed(2)}%`,
      revenue: `€${revenue.toLocaleString('en-GB')}`,
      roas: `${(r(22, 52, 4) / 10).toFixed(1)}x`,
    };
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <FilterBar
          filters={[
            {
              name: 'Status',
              options: (Object.keys(STATUS_LABEL) as Creative['status'][]).map((s) => ({ label: STATUS_LABEL[s], value: s })),
              selectedValues: statuses,
              onChange: setStatuses,
            },
          ]}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search creatives..."
        />
        <div className="overflow-x-auto">
          <Table
            columns={[
              { key: 'preview', header: '', width: 128, render: (c: Creative) => <CreativePreviewThumb creative={c} template={templatesById.get(c.templateId)} /> },
              {
                key: 'actions', header: 'Actions', width: 76,
                render: (c: Creative) => (
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Preview ${c.name}`} onClick={(e) => { e.stopPropagation(); setPreviewId(c.id); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
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
              {
                key: 'bookings', header: 'Bookings',
                render: (c: Creative) => c.bookingIds.filter((b) => bookingIds.has(b)).map((b) => bookingName.get(b) ?? b).join(' · '),
              },
              { key: 'template', header: 'Template', render: (c: Creative) => templatesById.get(c.templateId)?.name ?? '—' },
              ...(showPerformance
                ? [
                    { key: 'impressions', header: 'Impressions', render: (c: Creative) => perf(c).impressions },
                    { key: 'clicks', header: 'Clicks', render: (c: Creative) => perf(c).clicks },
                    { key: 'ctr', header: 'CTR', render: (c: Creative) => perf(c).ctr },
                    { key: 'revenue', header: 'Total SKU revenue', render: (c: Creative) => perf(c).revenue },
                    { key: 'roas', header: 'ROAS', render: (c: Creative) => perf(c).roas },
                  ]
                : []),
              { key: 'updated', header: 'Updated', render: (c: Creative) => c.updatedAt.slice(0, 10) },
            ]}
            data={visible}
            rowKey={(c: Creative) => c.id}
            hideActions
            rowClassName={() => 'cursor-pointer'}
            onRowClick={(c: Creative) => { window.location.href = `/creatives/${engine}/${c.id}`; }}
            emptyState={<span>No creatives on this campaign yet — link or create them on a booking.</span>}
          />
        </div>
      </div>
      <CreativePreviewDialog creative={previewing} onClose={() => setPreviewId(null)} />
    </div>
  );
};
