'use client';

import * as React from 'react';
import { Euro } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * The budget's own picker — the date-range picker's shape, applied to money.
 *
 * A plan's budget is not one number, it is a split: clicking the field opens
 * the split, one row per campaign, editable in place. Editing the total
 * rescales the rows so their ratios hold; editing a row moves only that row
 * and the total follows as the sum. Nothing commits until Apply, so the field
 * can be explored like a calendar can.
 */

export interface BudgetSplitRow {
  id: string;
  label: string;
  color: string;
  budget: number;
}

export interface BudgetSelectProps {
  total: number;
  rows: BudgetSplitRow[];
  onApply: (total: number, budgets: Record<string, number>) => void;
  className?: string;
}

const fmtEuroFull = (n: number) => `€${Math.round(n).toLocaleString()}`;

export const BudgetSelect: React.FC<BudgetSelectProps> = ({ total, rows, onApply, className }) => {
  const [open, setOpen] = React.useState(false);
  const [draftTotal, setDraftTotal] = React.useState('');
  const [draftRows, setDraftRows] = React.useState<Record<string, string>>({});

  // Staged on open, so a cancelled edit leaves nothing behind.
  const openWith = (next: boolean) => {
    if (next) {
      setDraftTotal(String(total));
      setDraftRows(Object.fromEntries(rows.map((r) => [r.id, String(r.budget)])));
    }
    setOpen(next);
  };

  const num = (v: string) => {
    const n = Number(v.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  const stagedRows = rows.map((r) => ({ ...r, staged: num(draftRows[r.id] ?? String(r.budget)) }));
  const stagedSum = stagedRows.reduce((s, r) => s + r.staged, 0);
  const stagedTotal = num(draftTotal);

  /** Editing the total rescales every row, keeping the split's shape. */
  const setTotal = (v: string) => {
    setDraftTotal(v);
    const nextTotal = num(v);
    const currentSum = stagedSum;
    if (nextTotal <= 0 || rows.length === 0) return;
    const next: Record<string, string> = {};
    if (currentSum > 0) {
      stagedRows.forEach((r) => { next[r.id] = String(Math.round((r.staged / currentSum) * nextTotal)); });
    } else {
      const each = Math.floor(nextTotal / rows.length);
      rows.forEach((r) => { next[r.id] = String(each); });
    }
    setDraftRows(next);
  };

  /** Editing a row moves that row; the total follows as the sum. */
  const setRow = (id: string, v: string) => {
    const next = { ...draftRows, [id]: v };
    setDraftRows(next);
    const sum = rows.reduce((s, r) => s + num(next[r.id] ?? String(r.budget)), 0);
    setDraftTotal(String(sum));
  };

  const apply = () => {
    onApply(stagedTotal, Object.fromEntries(stagedRows.map((r) => [r.id, r.staged])));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={openWith}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('h-9 justify-start gap-2 px-3 text-left font-normal tabular-nums', className)}
        >
          <Euro className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{fmtEuroFull(total)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="budget-select-total">Total budget</Label>
          <Input
            id="budget-select-total"
            type="number"
            min="0"
            value={draftTotal}
            onChange={(e) => setTotal(e.target.value)}
          />
        </div>

        {rows.length > 0 && (
          <div className="space-y-2">
            <Label className="block">Split by campaign</Label>
            {/* The bar previews the staged split, not the saved one. */}
            <div className="flex h-2.5 overflow-hidden rounded-full border border-border bg-background">
              {stagedRows.map((r) => (
                <div
                  key={r.id}
                  style={{
                    width: `${stagedSum > 0 ? (r.staged / stagedSum) * 100 : 0}%`,
                    backgroundColor: r.color,
                  }}
                />
              ))}
              <div className="flex-1" style={{ backgroundColor: 'rgb(var(--neutral-200))' }} />
            </div>
            <div className="space-y-2 pt-1">
              {stagedRows.map((r) => (
                <div key={r.id} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="min-w-0 flex-1 truncate text-sm">{r.label}</span>
                  <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {stagedSum > 0 ? `${Math.round((r.staged / stagedSum) * 100)}%` : '—'}
                  </span>
                  <Input
                    type="number"
                    min="0"
                    aria-label={`Budget for ${r.label}`}
                    className="h-8 w-28 text-sm tabular-nums"
                    value={draftRows[r.id] ?? String(r.budget)}
                    onChange={(e) => setRow(r.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">
            {rows.length > 0 ? `${fmtEuroFull(stagedSum)} across ${rows.length} campaign${rows.length === 1 ? '' : 's'}` : 'No campaigns yet'}
          </span>
          <span className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={apply}>Apply</Button>
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
};
