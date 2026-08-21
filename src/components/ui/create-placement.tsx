'use client';

import * as React from 'react';
import { LayoutDashboard, Pencil } from 'lucide-react';
import { SearchSelectList, type SearchSelectOption } from './search-select-list';
import { Button } from './button';
import { Input } from './input';
import { FilterBar } from './filter-bar';
import { Table } from './table';
import { Checkbox } from './checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

/**
 * Create placement — the one way a booking picks where it runs.
 *
 * The user chooses a media product (a channel on display and digital
 * in-store, a platform offsite) and gets everything in it: the selected card
 * lists the ad positions it contains, and a modal — the same pattern as the
 * store-list targeting — lets them include or exclude positions from there.
 * Selection first, trimming second, so the default is always a complete,
 * bookable placement.
 */
export interface CreatePlacementProps {
  mediaProducts: SearchSelectOption[];
  /** All ad positions of the chosen media product; empty until one is picked. */
  positions: (SearchSelectOption & { format?: string })[];
  mediaProduct: string[];
  onMediaProductChange: (value: string[]) => void;
  positionsValue: string[];
  onPositionsChange: (value: string[]) => void;
  productLabel?: string;
  /** What this proposition calls the things inside ("Ad positions", "Ad spaces"). */
  positionsLabel?: string;
  /** Auction campaigns: the CPC per included position, edited in the modal's
   *  Bid column with a suggestion to accept. Omit on guaranteed campaigns —
   *  no bids render at all. All three props travel together. */
  bids?: Record<string, string>;
  onBidChange?: (positionId: string, value: string) => void;
  suggestedBid?: (positionId: string) => string;
  className?: string;
}

export const CreatePlacement: React.FC<CreatePlacementProps> = ({
  mediaProducts,
  positions,
  mediaProduct,
  onMediaProductChange,
  positionsValue,
  onPositionsChange,
  productLabel = 'Find media product',
  positionsLabel = 'Ad positions',
  bids,
  onBidChange,
  suggestedBid,
  className,
}) => {
  const showBids = !!bids && !!onBidChange;
  const [editing, setEditing] = React.useState(false);
  const [staged, setStaged] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  const [formatFilter, setFormatFilter] = React.useState<string[]>([]);

  const formats = Array.from(new Set(positions.map((p) => p.format).filter(Boolean))) as string[];
  const visible = positions.filter(
    (p) =>
      (search === '' || p.label.toLowerCase().includes(search.toLowerCase())) &&
      (formatFilter.length === 0 || (p.format ? formatFilter.includes(p.format) : false)),
  );

  // A newly chosen media product starts with everything it contains
  // included; the modal is where the user trims that down.
  React.useEffect(() => {
    if (mediaProduct.length && positions.length && positionsValue.length === 0) {
      onPositionsChange(positions.map((p) => p.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaProduct.join(','), positions.map((p) => p.value).join(',')]);

  const included = positions.filter((p) => positionsValue.includes(p.value));

  return (
    <div className={className ?? 'space-y-4 min-w-0'}>
      <SearchSelectList
        label={productLabel}
        placeholder="Search channel or media product…"
        icon={<LayoutDashboard className="w-4 h-4" />}
        options={mediaProducts}
        value={mediaProduct}
        onChange={onMediaProductChange}
        multiple={false}
        hideSelectedDescription
        renderSelectedExtra={() => (
          <div className="space-y-2">
            {/* Same shape as a store list: an icon and a count, not a list. */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
              {included.length} of {positions.length} {positionsLabel.toLowerCase()}
              {showBids && included.filter((p) => bids![p.value]).length > 0 && (
                <> · {included.filter((p) => bids![p.value]).length} bid{included.filter((p) => bids![p.value]).length === 1 ? '' : 's'} set</>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setStaged(positionsValue);
                setEditing(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit {positionsLabel.toLowerCase()}
            </Button>
          </div>
        )}
      />

      <Dialog open={editing} onOpenChange={(open) => !open && setEditing(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{positionsLabel}</DialogTitle>
            <DialogDescription>
              Choose which {positionsLabel.toLowerCase()} of this media product the booking includes.
            </DialogDescription>
          </DialogHeader>

          {/* Search first, then the table — the same order the store-list
              picker uses, because long channels are searched, not scrolled. */}
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder={`Search ${positionsLabel.toLowerCase()}…`}
            filters={[
              {
                name: 'Format',
                options: formats.map((f) => ({ label: f, value: f })),
                selectedValues: formatFilter,
                onChange: setFormatFilter,
              },
            ]}
          />

          <div className="max-h-80 overflow-y-auto">
            <Table
              columns={[
                {
                  key: 'include',
                  header: '',
                  className: 'w-10',
                  render: (row) => (
                    <Checkbox
                      checked={staged.includes(row.value)}
                      onCheckedChange={(on) =>
                        setStaged(on ? [...staged, row.value] : staged.filter((v) => v !== row.value))
                      }
                      aria-label={`Include ${row.label}`}
                    />
                  ),
                },
                { key: 'label', header: 'Position' },
                { key: 'format', header: 'Format', render: (row) => <span className="text-muted-foreground">{row.format ?? '—'}</span> },
                { key: 'capacity', header: 'Capacity', render: (row) => <span className="tabular-nums text-muted-foreground">{row.description}</span> },
                // Auction campaigns: the price lives on the placement it buys —
                // a bid per included position, with a suggestion to accept.
                ...(showBids ? [{
                  key: 'bid',
                  header: 'Bid (CPC)',
                  render: (row: SearchSelectOption & { format?: string }) =>
                    staged.includes(row.value) ? (
                      <span className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="relative">
                          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.05"
                            value={bids![row.value] ?? ''}
                            onChange={(e) => onBidChange!(row.value, e.target.value)}
                            placeholder={suggestedBid?.(row.value)}
                            className="h-7 w-20 pl-5 text-sm tabular-nums"
                            aria-label={`Bid for ${row.label}`}
                          />
                        </span>
                        {suggestedBid && bids![row.value] !== suggestedBid(row.value) && (
                          <button
                            type="button"
                            className="whitespace-nowrap text-xs font-medium text-primary hover:underline"
                            title={`Use suggested bid €${suggestedBid(row.value)}`}
                            onClick={() => onBidChange!(row.value, suggestedBid(row.value))}
                          >
                            Use €{suggestedBid(row.value)}
                          </button>
                        )}
                      </span>
                    ) : <span className="text-muted-foreground">—</span>,
                }] : []),
              ]}
              data={visible}
              rowKey={(row) => row.value}
              hideActions
              onRowClick={(row) =>
                setStaged(staged.includes(row.value) ? staged.filter((v) => v !== row.value) : [...staged, row.value])
              }
              emptyState={<span className="text-sm text-muted-foreground">No {positionsLabel.toLowerCase()} match these filters.</span>}
            />
          </div>

          <DialogFooter className="items-center justify-between">
            <span className="text-sm text-muted-foreground">{staged.length} of {positions.length} included</span>
            <span className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={() => { onPositionsChange(staged); setEditing(false); }}>Save</Button>
            </span>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
