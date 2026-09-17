'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Table } from './table';
import { FilterBar } from './filter-bar';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import { LevelMeter, LEVEL_LABELS, type Level } from './level-meter';
import { BidRow, suggestedBid } from './bid-row';
import { spKeywordSuggestions, spKeywordDetail } from '@/lib/sp-keywords';

/**
 * The keywords of a sponsored products booking, as one table with two views:
 * what we suggest and what the booking has. Bookings carry a hundred or two
 * hundred keywords, so this is a table with filters and bulk actions rather
 * than a list of cards. Type a keyword and press Enter to add your own.
 *
 * Shared by the wizard and the booking page — the same table, so adding
 * keywords looks the same whether the booking is being made or edited. Bids
 * belong to the booking once it exists: pass `bids` and the "In booking" view
 * gains a bid column; leave them off in the wizard.
 */
export interface KeywordTableProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  /** Bid per keyword — shown on the "In booking" view when given. */
  bids?: Record<string, string>;
  onBidChange?: (keyword: string, bid: string) => void;
  /** Max height of the table body before it scrolls. */
  maxHeightClassName?: string;
  className?: string;
}

export const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, onChange, bids, onBidChange, maxHeightClassName = 'max-h-80', className }) => {
  const [view, setView] = React.useState<'suggested' | 'added'>('suggested');
  const [volumeFilter, setVolumeFilter] = React.useState<string[]>([]);
  const [competitionFilter, setCompetitionFilter] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<React.Key[]>([]);
  const [query, setQuery] = React.useState('');

  const q = query.trim().toLowerCase();
  const suggested = spKeywordSuggestions.filter((k) => !keywords.includes(k));
  const source = view === 'suggested' ? suggested : keywords;
  const rows = source
    .map((k) => ({ id: k, keyword: k, ...spKeywordDetail(k) }))
    .filter((r) => !q || r.keyword.includes(q))
    .filter((r) => volumeFilter.length === 0 || volumeFilter.includes(String(r.volume)))
    .filter((r) => competitionFilter.length === 0 || competitionFilter.includes(String(r.competition)));
  const levelOptions = ([5, 4, 3, 2, 1] as Level[]).map((l) => ({ label: LEVEL_LABELS[l], value: String(l) }));
  const picked = selected.map(String);
  const addMany = (list: string[]) => { onChange([...keywords, ...list.filter((k) => !keywords.includes(k))]); setSelected([]); };
  const removeMany = (list: string[]) => { onChange(keywords.filter((k) => !list.includes(k))); setSelected([]); };
  const withBids = !!bids && !!onBidChange;

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Type a keyword and press Enter to add it; the same box filters the table. */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search or type a keyword and press Enter…"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key !== 'Enter') return;
              e.preventDefault();
              const k = query.trim().toLowerCase();
              if (!k) return;
              if (!keywords.includes(k)) onChange([...keywords, k]);
              setQuery('');
              setView('added');
            }}
          />
        </div>

        {/* One table, two views; the filters narrow whichever is open. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={view} onValueChange={(v) => { setView(v as 'suggested' | 'added'); setSelected([]); }}>
            <TabsList>
              <TabsTrigger value="suggested">Suggested · {suggested.length}</TabsTrigger>
              <TabsTrigger value="added">In booking · {keywords.length}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            {view === 'suggested' ? (
              <>
                {picked.length > 0 && <Button size="sm" onClick={() => addMany(picked)}>Add selected ({picked.length})</Button>}
                <Button variant="outline" size="sm" disabled={rows.length === 0} onClick={() => addMany(rows.map((r) => r.id))}>
                  {rows.length < suggested.length ? `Add all shown (${rows.length})` : 'Add all'}
                </Button>
              </>
            ) : (
              <>
                {picked.length > 0 && <Button variant="outline" size="sm" onClick={() => removeMany(picked)}>Remove selected ({picked.length})</Button>}
                <Button variant="outline" size="sm" disabled={keywords.length === 0} onClick={() => removeMany(keywords)}>Clear all</Button>
              </>
            )}
          </div>
        </div>
        <FilterBar
          hideSearch
          filters={[
            { name: 'Volume', options: levelOptions, selectedValues: volumeFilter, onChange: setVolumeFilter },
            { name: 'Competition', options: levelOptions, selectedValues: competitionFilter, onChange: setCompetitionFilter },
          ]}
        />
        <div className={`${maxHeightClassName} overflow-y-auto rounded-md border`}>
          <Table
            columns={[
              { key: 'keyword', header: 'Keyword' },
              { key: 'searches', header: 'Searches / month', render: (row) => row.searches.toLocaleString('en-GB') },
              { key: 'volume', header: 'Volume', render: (row) => <LevelMeter label={null} tone="supply" level={row.volume} /> },
              { key: 'competition', header: 'Competition', render: (row) => <LevelMeter label={null} tone="risk" level={row.competition} /> },
              // The table remembers its columns from the first render, so the
              // bid column is always there once bids are in play: a suggestion
              // shows what we would bid, a booked keyword takes the bid.
              ...(withBids
                ? [{ key: 'bid', header: 'Bid (CPC)', render: (row: { id: string }) => view === 'added'
                    ? <BidRow id={row.id} hideLabel className="mt-0" value={bids?.[row.id] ?? ''} onChange={(v) => onBidChange?.(row.id, v)} />
                    : <span className="text-xs text-muted-foreground">Suggested €{suggestedBid(row.id)}</span> }]
                : []),
            ]}
            data={rows}
            rowKey={(row) => row.id}
            rowSelection={{ selectedKeys: selected, onChange: setSelected, getKey: (row) => row.id }}
            rowActions={(row) => view === 'suggested'
              ? <Button variant="outline" size="sm" onClick={() => addMany([row.id])}>Add</Button>
              : <Button variant="ghost" size="sm" onClick={() => removeMany([row.id])}>Remove</Button>}
            hideRefreshedAt
            emptyState={
              <p className="p-4 text-sm text-muted-foreground">
                {view === 'suggested'
                  ? (q ? `Nothing suggested matches "${q}" — press Enter to add it.` : suggested.length === 0 ? 'Every suggestion is in the booking.' : 'Nothing matches these filters.')
                  : (keywords.length === 0 ? 'No keywords yet — add suggestions or type your own above.' : 'Nothing matches.')}
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
};
