'use client';

import * as React from 'react';
import { Button } from './button';
import { AddButton } from './add-button';
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
  const addTyped = () => {
    const k = query.trim().toLowerCase();
    if (!k) return;
    if (!keywords.includes(k)) onChange([...keywords, k]);
    setQuery('');
    setView('added');
  };
  const withBids = !!bids && !!onBidChange;

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* One table, two views; the filters narrow whichever is open. */}
        <div className="flex flex-wrap items-center justify-between gap-inline">
          <Tabs value={view} onValueChange={(v) => { setView(v as 'suggested' | 'added'); setSelected([]); }}>
            <TabsList>
              <TabsTrigger value="suggested">Suggested · {suggested.length}</TabsTrigger>
              <TabsTrigger value="added">In booking · {keywords.length}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-inline">
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
        {/* The search box is also where a keyword of your own is typed:
            Enter or the + beside it adds what you typed to the booking. */}
        <FilterBar
          filters={[
            { name: 'Volume', options: levelOptions, selectedValues: volumeFilter, onChange: setVolumeFilter },
            { name: 'Competition', options: levelOptions, selectedValues: competitionFilter, onChange: setCompetitionFilter },
          ]}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Search or type a keyword…"
          onSearchSubmit={addTyped}
          action={<AddButton disabled={!q} onClick={addTyped}>Add keyword</AddButton>}
        />
        <div className={`${maxHeightClassName} overflow-y-auto`}>
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
