'use client';

import * as React from 'react';
import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { FilterBar } from './filter-bar';
import { Table } from './table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

/**
 * Changing what a booking or a campaign hangs under.
 *
 * The link is a property of the thing above, not a field of the form in front
 * of you — so it lives on the summary card that shows it, behind a link icon,
 * and is changed in a table you can search. That keeps every form free of a
 * "which campaign?" dropdown, and makes relinking work the same way whether
 * you are in a wizard or on a detail page.
 */

export interface LinkOption {
  value: string;
  label: string;
  /** Extra columns, in order. The keys become the column headers. */
  details?: Record<string, string>;
}

export interface LinkPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What is being linked, e.g. "campaign" — used in the copy. */
  entityLabel: string;
  options: LinkOption[];
  /** Currently linked value, if any. */
  value?: string;
  onChange: (value?: string) => void;
  /** Offer a "not linked" row — for links that are genuinely optional. */
  allowNone?: boolean;
  noneLabel?: string;
}

export const LinkPickerDialog: React.FC<LinkPickerDialogProps> = ({
  open,
  onOpenChange,
  entityLabel,
  options,
  value,
  onChange,
  allowNone,
  noneLabel,
}) => {
  const [search, setSearch] = React.useState('');
  const [staged, setStaged] = React.useState<string | undefined>(value);

  // Reopening starts from what is linked now, not from the last abandoned pick.
  React.useEffect(() => {
    if (open) {
      setStaged(value);
      setSearch('');
    }
  }, [open, value]);

  const NONE = '__none__';
  const rows: LinkOption[] = [
    ...(allowNone ? [{ value: NONE, label: noneLabel ?? `No ${entityLabel}` }] : []),
    ...options,
  ];
  const q = search.trim().toLowerCase();
  const visible = q
    ? rows.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          Object.values(r.details ?? {}).some((d) => d.toLowerCase().includes(q)),
      )
    : rows;

  // Columns follow the data: whatever detail keys the options carry.
  const detailKeys = Array.from(
    new Set(options.flatMap((o) => Object.keys(o.details ?? {}))),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">{entityLabel}</DialogTitle>
          <DialogDescription>
            Choose the {entityLabel} this should be linked to.
          </DialogDescription>
        </DialogHeader>

        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={`Search ${entityLabel}s…`}
          filters={[]}
        />

        <div className="max-h-80 overflow-y-auto">
          <Table
            columns={[
              {
                key: 'linked',
                header: '',
                className: 'w-10',
                render: (row: LinkOption) => (
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border',
                      staged === row.value || (!staged && row.value === NONE)
                        ? 'border-primary'
                        : 'border-muted-foreground/40',
                    )}
                  >
                    {(staged === row.value || (!staged && row.value === NONE)) && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                ),
              },
              { key: 'label', header: 'Name' },
              ...detailKeys.map((key) => ({
                key,
                header: key,
                render: (row: LinkOption) => (
                  <span className="text-muted-foreground">{row.details?.[key] ?? '—'}</span>
                ),
              })),
            ]}
            data={visible}
            rowKey={(row: LinkOption) => row.value}
            hideActions
            onRowClick={(row: LinkOption) => setStaged(row.value === NONE ? undefined : row.value)}
            emptyState={<span className="text-sm text-muted-foreground">No {entityLabel}s match this search.</span>}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onChange(staged);
              onOpenChange(false);
            }}
          >
            Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** The icon that opens the picker, for a summary card's `headerAction`. */
export const LinkActionIcon = <Link2 className="h-4 w-4" />;
