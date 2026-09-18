'use client';

import * as React from 'react';
import { Button } from './button';
import { AddButton } from './add-button';
import { Badge } from './badge';
import { Table } from './table';
import { FilterBar } from './filter-bar';
import { LevelMeter, LEVEL_LABELS, type Level } from './level-meter';
import { BidRow, suggestedBid } from './bid-row';
import { spKeywordSuggestions, spKeywordDetail } from '@/lib/sp-keywords';

/**
 * The keywords of a sponsored products booking: what we suggest and what the
 * booking has, in one table. A status column and filter tell them apart;
 * every suggested row has its own "+ Add", every booked row its "Remove",
 * and "Add all" beside the search takes every suggestion still showing.
 * Keywords come from the suggestions only — there is no typing your own.
 *
 * Shared by the wizard and the booking page. Bids belong to the booking
 * once it exists: pass `bids` and the booked rows gain a bid field; leave
 * them off in the wizard.
 */
export interface KeywordTableProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  /** Bid per keyword — shown on booked rows when given. */
  bids?: Record<string, string>;
  onBidChange?: (keyword: string, bid: string) => void;
  /** Max height of the table body before it scrolls. */
  maxHeightClassName?: string;
  className?: string;
}

type Status = 'suggested' | 'added';

export const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, onChange, bids, onBidChange, maxHeightClassName = 'max-h-80', className }) => {
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [volumeFilter, setVolumeFilter] = React.useState<string[]>([]);
  const [competitionFilter, setCompetitionFilter] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');

  const q = query.trim().toLowerCase();
  const all = Array.from(new Set([...keywords, ...spKeywordSuggestions]));
  const rows = all
    .map((k) => ({ id: k, keyword: k, status: (keywords.includes(k) ? 'added' : 'suggested') as Status, ...spKeywordDetail(k) }))
    .filter((r) => !q || r.keyword.includes(q))
    .filter((r) => statusFilter.length === 0 || statusFilter.includes(r.status))
    .filter((r) => volumeFilter.length === 0 || volumeFilter.includes(String(r.volume)))
    .filter((r) => competitionFilter.length === 0 || competitionFilter.includes(String(r.competition)))
    // Booked keywords first, then the suggestions by how much they are
    // searched — the number itself is never shown, only the volume meter.
    .sort((a, b) => (a.status === b.status ? b.searches - a.searches : a.status === 'added' ? -1 : 1));
  const levelOptions = ([5, 4, 3, 2, 1] as Level[]).map((l) => ({ label: LEVEL_LABELS[l], value: String(l) }));
  const suggestedShown = rows.filter((r) => r.status === 'suggested');
  const suggestedTotal = all.filter((k) => !keywords.includes(k)).length;
  const add = (list: string[]) => onChange([...keywords, ...list.filter((k) => !keywords.includes(k))]);
  const remove = (k: string) => onChange(keywords.filter((x) => x !== k));
  const withBids = !!bids && !!onBidChange;

  return (
    <div className={className}>
      <div className="space-y-3">
        <FilterBar
          filters={[
            { name: 'Status', options: [{ label: 'In booking', value: 'added' }, { label: 'Suggested', value: 'suggested' }], selectedValues: statusFilter, onChange: setStatusFilter },
            { name: 'Volume', options: levelOptions, selectedValues: volumeFilter, onChange: setVolumeFilter },
            { name: 'Competition', options: levelOptions, selectedValues: competitionFilter, onChange: setCompetitionFilter },
          ]}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search keywords…"
          action={
            <AddButton disabled={suggestedShown.length === 0} onClick={() => add(suggestedShown.map((r) => r.id))}>
              {suggestedShown.length < suggestedTotal ? `Add all shown (${suggestedShown.length})` : 'Add all'}
            </AddButton>
          }
        />
        <div className={`${maxHeightClassName} overflow-y-auto`}>
          <Table
            columns={[
              { key: 'keyword', header: 'Keyword' },
              { key: 'status', header: 'Status', render: (row) => row.status === 'added' ? <Badge variant="success">In booking</Badge> : <Badge variant="outline">Suggested</Badge> },
              { key: 'volume', header: 'Volume', render: (row) => <LevelMeter label={null} tone="supply" level={row.volume} /> },
              { key: 'competition', header: 'Competition', render: (row) => <LevelMeter label={null} tone="risk" level={row.competition} /> },
              ...(withBids
                ? [{ key: 'bid', header: 'Bid (CPC)', render: (row: { id: string; status: Status }) => row.status === 'added'
                    ? <BidRow id={row.id} hideLabel className="mt-0" value={bids?.[row.id] ?? ''} onChange={(v) => onBidChange?.(row.id, v)} />
                    : <span className="text-xs text-muted-foreground">Suggested €{suggestedBid(row.id)}</span> }]
                : []),
            ]}
            data={rows}
            rowKey={(row) => row.id}
            rowActions={(row) => row.status === 'suggested'
              ? <AddButton size="sm" onClick={() => add([row.id])}>Add</AddButton>
              : <Button variant="ghost" size="sm" onClick={() => remove(row.id)}>Remove</Button>}
            hideRefreshedAt
            emptyState={
              <p className="p-4 text-sm text-muted-foreground">
                {all.length === 0 ? 'No keywords yet.' : 'Nothing matches these filters.'}
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
};
