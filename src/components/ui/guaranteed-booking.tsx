'use client';

import * as React from 'react';
import { Eye, Lock, ReceiptText, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { FormSection } from './form-section';
import { useToast } from './toast';
import {
  BILLING_STATE_LABEL,
  BILLING_STATE_VARIANT,
  GOAL_LABEL,
  PRICE_STATE_LABEL,
  billableLine,
  bookingPrice,
  compactNumber,
  deliveryProgress,
  formatEuro,
  formatGoal,
  formatUnitPrice,
  goalMetricFor,
  isGuaranteed,
  quoteBookingPrice,
  setBookingGoal,
  useDb,
  type Booking,
  type BookingGoal,
  type BookingPriceState,
  type BookingPriceView,
  type DbData,
  type EngineId,
  type GoalMetric,
  priceFor,
  amountFor,
} from '@/lib/db';

/**
 * The pieces a guaranteed booking shows wherever it appears: its goal, how
 * far delivery has come against it, and its price in whatever state it is
 * — the same marks in the plan's table, the booking page and the billing
 * overview, so a price reads as agreed in one place and agreed everywhere.
 */

const GOAL_ICON: Record<GoalMetric, React.ComponentType<{ className?: string }>> = { impressions: Eye, stores: Store };

export const PRICE_STATE_VARIANT: Record<BookingPriceState, 'outline' | 'secondary' | 'info' | 'success'> = {
  'not-priced': 'outline',
  indicative: 'secondary',
  quoted: 'info',
  agreed: 'success',
};

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** "👁 1.0M" — a goal, compact, with what it counts as its icon. */
export const GoalCell: React.FC<{ goal?: BookingGoal; className?: string }> = ({ goal, className }) => {
  if (!goal) return <span className={cn('text-muted-foreground', className)}>—</span>;
  const Icon = GOAL_ICON[goal.metric];
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums', className)} title={formatGoal(goal)}>
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      {compactNumber(goal.amount)}
    </span>
  );
};

/**
 * Delivered against the goal: the bar fills with what is delivered, the
 * tick marks where it should be by now. Behind the tick is behind.
 */
export const DeliveryProgressBar: React.FC<{ share?: number; expectedShare?: number; className?: string }> = ({ share, expectedShare, className }) => {
  if (share === undefined || expectedShare === undefined) return <span className={cn('text-muted-foreground', className)}>—</span>;
  const behind = share < expectedShare - 0.05;
  return (
    <div className={cn('w-full min-w-[160px] max-w-[260px]', className)}>
      <div className="relative h-1.5 rounded-full bg-muted">
        <div className={cn('absolute inset-y-0 left-0 rounded-full', behind ? 'bg-warning-500' : 'bg-primary')} style={{ width: `${(Math.min(1, share) * 100).toFixed(1)}%` }} />
        <span
          className="absolute -top-1 h-3.5 w-0.5 -translate-x-1/2 rounded-full bg-foreground"
          style={{ left: `${(Math.min(1, expectedShare) * 100).toFixed(1)}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold tabular-nums">{pct(share)}</span>
        <span className="tabular-nums text-muted-foreground">Exp. {pct(expectedShare)}</span>
      </div>
    </div>
  );
};

/** "€4,500.00 / Invoiced afterwards" — a price and what state it is in. */
export const AgreedPriceCell: React.FC<{ view: BookingPriceView; className?: string }> = ({ view, className }) => (
  <span className={cn('flex flex-col leading-tight', className)}>
    <span className={cn('whitespace-nowrap tabular-nums', view.amount === undefined && 'text-muted-foreground')}>
      {view.amount === undefined ? '—' : formatEuro(view.amount)}
    </span>
    <span className="mt-0.5 whitespace-nowrap text-xs text-muted-foreground">
      {view.state === 'agreed' ? 'Invoiced afterwards' : PRICE_STATE_LABEL[view.state].label}
    </span>
  </span>
);

/** The same rows, read from the store — for templates without the db at hand. */
export function useGuaranteedSummaryItems(booking: Booking | undefined) {
  const db = useDb();
  return guaranteedSummaryItems(db, booking);
}

/** The rows a guaranteed booking adds to its summary card. */
export function guaranteedSummaryItems(db: DbData, booking: Booking | undefined): { label: string; value: React.ReactNode }[] {
  if (!booking || !isGuaranteed(db, booking)) return [];
  const view = bookingPrice(db, booking);
  return [
    { label: 'Buying', value: 'Guaranteed' },
    { label: 'Goal', value: booking.goal ? formatGoal(booking.goal) : 'Not set' },
    { label: view.state === 'agreed' ? 'Agreed price' : 'Price', value: view.amount === undefined ? PRICE_STATE_LABEL[view.state].label : `${formatEuro(view.amount)} · ${PRICE_STATE_LABEL[view.state].label.toLowerCase()}` },
  ];
}

/**
 * Goal & price on the booking page. The goal is the one thing a user sets;
 * the price follows from it — indicative until availability is checked,
 * quoted while the hold runs, agreed from approval on. An agreed booking
 * shows its delivery against the goal and where its invoice stands.
 */
export const GuaranteedGoalPrice: React.FC<{ booking: Booking | undefined; className?: string }> = ({ booking, className }) => {
  const db = useDb();
  const toast = useToast();
  const campaign = booking && db.campaigns.find((c) => c.id === booking.campaignId);
  const metric = campaign ? goalMetricFor(campaign.engine) : 'impressions';
  const show = (n?: number) => (n ? n.toLocaleString('en-US') : '');
  const [draft, setDraft] = React.useState(show(booking?.goal?.amount));
  React.useEffect(() => { setDraft(show(booking?.goal?.amount)); }, [booking?.id, booking?.goal?.amount]);

  if (!booking || !campaign || !isGuaranteed(db, booking)) return null;
  const view = bookingPrice(db, booking);
  const progress = deliveryProgress(booking);
  const line = billableLine(db, booking);
  const locked = view.state === 'agreed';
  const label = GOAL_LABEL[metric];

  const commitGoal = () => {
    const amount = parseInt(draft.replace(/[^\d]/g, ''), 10);
    const next = Number.isFinite(amount) && amount > 0 ? { metric, amount } : undefined;
    if ((next?.amount ?? 0) === (booking.goal?.amount ?? 0)) return;
    setBookingGoal(booking.id, next);
  };

  const checkAvailability = () => {
    const result = quoteBookingPrice(booking.id);
    if (result === 'quoted') {
      const after = bookingPrice(db, { ...booking, price: undefined });
      toast({ title: 'Price quoted', description: `Inventory held and ${after.amount !== undefined ? formatEuro(after.amount) : 'the price'} locked until the hold runs out.` });
    } else {
      toast({ title: 'Nothing to quote yet', description: 'Set a goal first — the price follows from it.' });
    }
  };

  return (
    <FormSection bordered title="Goal & price" className={className}>
      <div className="space-y-field">
        <p className="text-sm text-muted-foreground">
          Guaranteed, like its campaign: sold on {label.many} at an agreed price per {metric === 'impressions' ? '1,000 impressions (CPM)' : 'store'}.
        </p>

        <div>
          <label className="mb-2 block text-sm font-medium">Goal*</label>
          <div className="flex items-center gap-2">
            <Input
              inputMode="numeric"
              value={draft}
              disabled={locked}
              placeholder={metric === 'impressions' ? 'e.g. 500,000' : 'e.g. 30'}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitGoal}
              onKeyDown={(e) => { if (e.key === 'Enter') commitGoal(); }}
              className="w-48"
            />
            <span className="text-sm text-muted-foreground">{label.many}</span>
          </div>
          {locked && <p className="mt-1.5 text-xs text-muted-foreground">The goal is part of the agreed price and cannot change after approval.</p>}
        </div>

        {/* The price, in its state. */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{locked ? 'Agreed booking price' : view.state === 'quoted' ? 'Quoted booking price' : 'Indicative booking price'}</span>
            <Badge variant={PRICE_STATE_VARIANT[view.state]} className="gap-1">
              {locked && <Lock className="h-3 w-3" />}
              {PRICE_STATE_LABEL[view.state].label}
            </Badge>
          </div>
          <div className="mt-3 text-2xl font-semibold tabular-nums">{view.amount === undefined ? '—' : formatEuro(view.amount)}</div>
          {view.unitPrice !== undefined && view.basis && booking.goal && (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatGoal(booking.goal)} at {formatUnitPrice(view.unitPrice, view.basis)}
            </p>
          )}
          {view.state === 'indicative' && view.buildUp && view.buildUp.steps.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
              <li>List price {formatUnitPrice(view.buildUp.listPrice, view.buildUp.basis)}</li>
              {view.buildUp.steps.map((st) => (
                <li key={st.rule.id}>{st.rule.name} {st.rule.index >= 1 ? '+' : '−'}{Math.round(Math.abs(st.rule.index - 1) * 100)}%</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {view.state === 'agreed' && view.lockedAt ? `Agreed on ${fmtDate(view.lockedAt)}. Excl. VAT, invoiced afterwards.`
              : view.state === 'quoted' && view.expiresAt ? `Held until ${fmtDate(view.expiresAt)}. Approval turns this quote into the agreed price.`
              : view.state === 'indicative' ? 'A preview holds no inventory. Check availability to lock the price as a quote.'
              : 'Set a goal to get a price.'}
          </p>
          {(view.state === 'indicative' || view.state === 'quoted') && (
            <Button variant="outline" size="sm" className="mt-3" onClick={checkAvailability}>
              {view.state === 'quoted' ? 'Check availability again' : 'Check availability'}
            </Button>
          )}
        </div>

        {progress && (
          <div>
            <div className="mb-2 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">Delivery</span>
              <span className="tabular-nums text-muted-foreground">{compactNumber(progress.delivered)} of {formatGoal(progress.goal)}</span>
            </div>
            <DeliveryProgressBar share={progress.share} expectedShare={progress.expectedShare} className="max-w-none" />
          </div>
        )}

        {line && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 text-sm">
            <span className="flex items-center gap-2"><ReceiptText className="h-4 w-4 text-muted-foreground" />Billing</span>
            <span className="flex items-center gap-2">
              {line.adjustment ? <span className="text-xs text-muted-foreground">{formatEuro(line.adjustment)} credit</span> : null}
              <Badge variant={BILLING_STATE_VARIANT[line.state]}>{BILLING_STATE_LABEL[line.state]}{line.invoice ? ` · ${line.invoice.number}` : ''}</Badge>
            </span>
          </div>
        )}
      </div>
    </FormSection>
  );
};

/**
 * The goal and its indicative price while a booking is still being made in
 * the wizard — before there is a booking to hold inventory for. The price
 * is the proposition's guaranteed rate card with today's pricing rules; it
 * becomes a quote on the booking page and agreed on approval.
 */
export const GoalPricePreview: React.FC<{
  engine: EngineId;
  goal: string;
  onGoalChange: (value: string) => void;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  className?: string;
}> = ({ engine, goal, onGoalChange, startDate, endDate, budget, className }) => {
  const db = useDb();
  const metric = goalMetricFor(engine);
  const label = GOAL_LABEL[metric];
  const product = db.mediaProducts.find((m) => m.engine === engine && m.status === 'active' && (m.buyingModels ?? []).includes('guaranteed'));
  const iso = (d?: Date) => (d ? d.toISOString().slice(0, 10) : undefined);
  const build = product ? priceFor(db, product, { from: iso(startDate), to: iso(endDate), budget }) : undefined;
  const amount = parseInt(goal.replace(/[^\d]/g, ''), 10);
  const goalValue = Number.isFinite(amount) && amount > 0 ? { metric, amount } : undefined;
  const price = build && goalValue ? amountFor(build.basis, build.price, goalValue) : undefined;
  // What the budget buys at this price, offered as the goal.
  const affordable = build && budget && build.price > 0
    ? (build.basis === 'cpm' ? Math.floor(((budget / build.price) * 1000) / 1000) * 1000 : Math.floor(budget / build.price))
    : undefined;

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <label className="mb-2 block text-sm font-medium">Goal*</label>
        <div className="flex items-center gap-2">
          <Input inputMode="numeric" value={goal} onChange={(e) => onGoalChange(e.target.value)} placeholder={metric === 'impressions' ? 'e.g. 500,000' : 'e.g. 30'} className="w-48" />
          <span className="text-sm text-muted-foreground">{label.many}</span>
        </div>
        {affordable !== undefined && affordable > 0 && (
          <button type="button" className="mt-1.5 text-xs font-medium text-primary hover:underline" onClick={() => onGoalChange(affordable.toLocaleString('en-US'))}>
            The budget buys about {compactNumber(affordable)} {label.many} — use that
          </button>
        )}
      </div>
      <div className="rounded-lg border p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Indicative booking price</div>
        <div className="mt-3 text-2xl font-semibold tabular-nums">{price === undefined ? '—' : formatEuro(price)}</div>
        <p className="mt-1 text-sm text-muted-foreground">
          {build && goalValue ? `${formatGoal(goalValue)} at ${formatUnitPrice(build.price, build.basis)}` : 'Set a goal to see the price.'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Excl. VAT · invoiced afterwards</p>
        <p className="mt-3 text-xs text-muted-foreground">A preview does not hold inventory. Check availability on the booking to lock the price; approval makes it the agreed price.</p>
      </div>
    </div>
  );
};
