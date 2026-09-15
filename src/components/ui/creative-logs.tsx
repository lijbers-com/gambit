'use client';

import * as React from 'react';
import { useDb, type Creative, type CreativeTemplate } from '@/lib/db';
import { Badge } from './badge';
import { FilterBar } from './filter-bar';
import { Table } from './table';

/**
 * The creative's Logs tab — who did what, in the same shape the campaign,
 * booking and media plan logs use: timestamp, user, action, field, old and
 * new value, filterable by user and action.
 *
 * The prototype keeps no audit trail, so the rows are derived from the
 * record itself: its creation, the template, the values it carries, the
 * bookings it is linked to and the approval steps its status implies.
 */

interface LogRow {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
}

const STATUS_LABEL: Record<Creative['status'], string> = {
  requested: 'Requested',
  draft: 'Draft',
  submitted: 'Submitted',
  'in-review': 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
};

const stamp = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ` +
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const clip = (v: string, n = 40) => (v.length > n ? `${v.slice(0, n - 1)}…` : v);

export const CreativeLogs: React.FC<{ creative: Creative; template?: CreativeTemplate; className?: string }> = ({ creative, template, className }) => {
  const db = useDb();

  const rows = React.useMemo<LogRow[]>(() => {
    const advertiser = db.users.find((u) => u.side === 'advertiser')?.name ?? 'Advertiser';
    const retailer = db.users.find((u) => u.id === 'u-campaign-manager')?.name ?? db.users.find((u) => u.side === 'retailer')?.name ?? 'Retailer';
    const bookingsById = new Map(db.bookings.map((b) => [b.id, b.name]));
    const fieldsByKey = new Map((template?.fields ?? []).map((f) => [f.key, f.label]));

    const start = new Date(creative.createdAt);
    let minutes = 0;
    const out: LogRow[] = [];
    const push = (user: string, action: string, field: string, oldValue: string, newValue: string, gap = 7) => {
      minutes += gap;
      out.push({ id: `CLOG-${out.length + 1}`, timestamp: stamp(new Date(start.getTime() + minutes * 60_000)), user, action, field, oldValue, newValue });
    };

    if (creative.status === 'requested') {
      push(retailer, 'Upload requested', 'Creative', '-', creative.id, 0);
    } else {
      push(advertiser, 'Creative created', 'Creative', '-', creative.id, 0);
    }
    if (template) push(advertiser, 'Template set', 'Template', '-', template.name, 3);

    // The first few filled-in, default-language fields, in template order.
    let shown = 0;
    for (const f of template?.fields ?? []) {
      const v = creative.values[f.key];
      if (!v || f.type === 'image' || shown >= 3) continue;
      push(advertiser, 'Field updated', fieldsByKey.get(f.key) ?? f.key, '-', clip(v.replace(/^uploaded:/, '')));
      shown += 1;
    }
    if (creative.languages.length > 1) {
      push(advertiser, 'Language added', 'Languages', 'EN', creative.languages.map((l) => l.toUpperCase()).join(', '));
    }
    if (creative.skus?.length) {
      push(advertiser, 'Retail products set', 'Retail products', '-', `${creative.skus.length} product${creative.skus.length === 1 ? '' : 's'}`);
    }
    for (const id of creative.bookingIds) {
      push(retailer, 'Booking linked', 'Bookings', '-', bookingsById.get(id) ?? id, 25);
    }

    // The approval steps the current status implies, in order.
    const ladder: Array<[Creative['status'], Creative['status'], string]> = [];
    const s = creative.status;
    if (s === 'submitted' || s === 'in-review' || s === 'approved' || s === 'rejected') ladder.push(['draft', 'submitted', advertiser]);
    if (s === 'in-review' || s === 'approved' || s === 'rejected') ladder.push(['submitted', 'in-review', retailer]);
    if (s === 'approved') ladder.push(['in-review', 'approved', retailer]);
    if (s === 'rejected') ladder.push(['in-review', 'rejected', retailer]);
    for (const [from, to, user] of ladder) push(user, 'Status changed', 'Status', STATUS_LABEL[from], STATUS_LABEL[to], 90);
    if (s === 'rejected' && creative.rejectionReason) push(retailer, 'Rejection reason', 'Reason', '-', clip(creative.rejectionReason, 60), 1);

    return out.reverse();
  }, [creative, template, db.users, db.bookings]);

  const [users, setUsers] = React.useState<string[]>([]);
  const [actions, setActions] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');

  const userOptions = Array.from(new Set(rows.map((r) => r.user))).map((v) => ({ label: v, value: v }));
  const actionOptions = Array.from(new Set(rows.map((r) => r.action))).map((v) => ({ label: v, value: v }));

  const visible = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      (users.length === 0 || users.includes(r.user)) &&
      (actions.length === 0 || actions.includes(r.action)) &&
      (q === '' || Object.values(r).some((v) => String(v).toLowerCase().includes(q)))
    );
  });

  return (
    <div className={className}>
      <div className="space-y-6">
        <FilterBar
          filters={[
            { name: 'Users', options: userOptions, selectedValues: users, onChange: setUsers },
            { name: 'Actions', options: actionOptions, selectedValues: actions, onChange: setActions },
          ]}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search logs..."
        />
        <div className="overflow-x-auto">
          <Table
            columns={[
              { key: 'timestamp', header: 'Timestamp' },
              { key: 'user', header: 'User' },
              { key: 'action', header: 'Action', render: (row: LogRow) => <Badge variant="outline">{row.action}</Badge> },
              { key: 'field', header: 'Field' },
              { key: 'oldValue', header: 'Old value' },
              { key: 'newValue', header: 'New value' },
            ]}
            data={visible}
            rowKey={(row: LogRow) => row.id}
            hideActions
            emptyState={<span>No log lines match these filters.</span>}
          />
        </div>
      </div>
    </div>
  );
};
