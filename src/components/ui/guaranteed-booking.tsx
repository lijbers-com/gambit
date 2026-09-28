'use client';

import * as React from 'react';
import { Eye, Lock, MousePointerClick, ReceiptText, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { FormSection } from './form-section';
import { useToast } from './toast';
import { Table } from './table';
import { planStatusLabel } from '@/lib/status-vocabulary';
import { BudgetPacing, type PacingOverride, type PacingShape } from './budget-pacing';
import { BuyingTypePicker } from './buying-type-picker';
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
  buyingTypeOf,
  buyingTypeOfCampaign,
  productForBooking,
  updateBooking,
  updateCampaign,
  type Campaign,
} from '@/lib/db';

/**
 * The pieces a guaranteed booking shows wherever it appears: its goal, how
 * far delivery has come against it, and its price in whatever state it is
 * — the same marks in the plan's table, the booking page and the billing
 * overview, so a price reads as agreed in one place and agreed everywhere.
 */

const GOAL_ICON: Record<GoalMetric, React.ComponentType<{ className?: string }>> = { impressions: Eye, stores: Store, clicks: MousePointerClick };

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
 * Delivered against the goal, drawn the way the booking calendar draws fill:
 * an 8px bar on the muted track in the chart's darkest shade, the figures
 * beneath. The tick marks where delivery should be by now.
 */
export const DeliveryProgressBar: React.FC<{ share?: number; expectedShare?: number; className?: string }> = ({ share, expectedShare, className }) => {
  if (share === undefined || expectedShare === undefined) return <span className={cn('text-muted-foreground', className)}>—</span>;
  return (
    <div className={cn('w-full min-w-[160px] max-w-[260px]', className)} title={`Delivered ${pct(share)} · expected ${pct(expectedShare)} by now`}>
      <div className="relative">
        <div className="flex h-2 w-full overflow-hidden rounded-sm bg-muted">
          <div style={{ width: `${(Math.min(1, share) * 100).toFixed(1)}%`, backgroundColor: 'hsl(var(--chart-800))' }} />
        </div>
        <span
          className="absolute -top-0.5 h-3 w-0.5 -translate-x-1/2 bg-foreground"
          style={{ left: `${(Math.min(1, expectedShare) * 100).toFixed(1)}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-xs">
        <span className="font-medium tabular-nums">{pct(share)}</span>
        <span className="tabular-nums text-muted-foreground">Exp. {pct(expectedShare)}</span>
      </div>
    </div>
  );
};

/**
 * The billable amount on one line: what the invoice will say, excl. VAT.
 * Until it is agreed it is muted and says what it still is.
 */
export const BillableAmountCell: React.FC<{ view: BookingPriceView; className?: string }> = ({ view, className }) => (
  <span className={cn('whitespace-nowrap tabular-nums', view.state !== 'agreed' && 'text-muted-foreground', className)} title={PRICE_STATE_LABEL[view.state].label}>
    {view.amount === undefined ? '—' : formatEuro(view.amount)}
    {view.amount !== undefined && view.state !== 'agreed' && <span className="ml-1 text-xs">· {PRICE_STATE_LABEL[view.state].label.toLowerCase()}</span>}
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
    { label: 'Billable amount', value: view.amount === undefined ? PRICE_STATE_LABEL[view.state].label : `${formatEuro(view.amount)} · ${PRICE_STATE_LABEL[view.state].label.toLowerCase()}` },
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
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Billable amount</span>
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

/** "Guaranteed" or "Auction", the way every table names a campaign's type. */
export const BuyingTypeLabel: React.FC<{ type: 'guaranteed' | 'auction'; className?: string }> = ({ type, className }) => (
  <Badge variant={type === 'guaranteed' ? 'info' : 'outline'} className={cn('font-normal', className)}>
    {type === 'guaranteed' ? 'Guaranteed' : 'Auction'}
  </Badge>
);

const fmtRange = (a: string, b: string) => {
  const f = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${f(a)} – ${f(b)}`;
};

/**
 * A campaign's bookings with what they cost: on a guaranteed campaign every
 * booking's goal, delivery and billable amount; on an auction campaign its
 * budget and spend. The totals are the metric cards' job, not this table's.
 */
export const CampaignBookingsPricing: React.FC<{ campaign: Campaign; bookingHref: (bookingId: string) => string; className?: string }> = ({ campaign, bookingHref, className }) => {
  const db = useDb();
  const bookings = db.bookings.filter((b) => b.campaignId === campaign.id);
  const type = buyingTypeOfCampaign(db, campaign);
  const guaranteed = type === 'guaranteed';

  return (
    <div className={cn('space-y-4', className)}>
      <Table
        columns={[
          { key: 'name', header: 'Name', render: (b) => <span className="font-medium">{b.name}</span> },
          { key: 'id', header: 'ID', render: (b) => <span className="tabular-nums text-muted-foreground">{b.id}</span> },
          { key: 'status', header: 'Status', render: (b) => <Badge variant="outline">{planStatusLabel(b.status)}</Badge> },
          ...(guaranteed ? [
            { key: 'goal', header: 'Goal', render: (b: Booking) => <GoalCell goal={b.goal} /> },
            { key: 'delivery', header: 'Delivery progress', width: 220, render: (b: Booking) => {
              const p = deliveryProgress(b);
              return <DeliveryProgressBar share={p?.share} expectedShare={p?.expectedShare} />;
            } },
            { key: 'price', header: 'Billable amount', summary: (rows: Booking[]) => formatEuro(rows.reduce((n, b) => n + (bookingPrice(db, b).amount ?? 0), 0)), render: (b: Booking) => <BillableAmountCell view={bookingPrice(db, b)} /> },
          ] : [
            { key: 'budget', header: 'Budget', summary: 'sum' as const, render: (b: Booking) => <span className="tabular-nums">{formatEuro(b.budget)}</span> },
            { key: 'spend', header: 'Spend', summary: 'sum' as const, render: (b: Booking) => <span className="tabular-nums">{formatEuro(b.spend)}</span> },
          ]),
          { key: 'runtime', header: 'Run time', render: (b) => fmtRange(b.startDate, b.endDate) },
        ]}
        data={bookings}
        rowKey={(b) => b.id}
        onRowClick={(b) => { window.location.href = bookingHref(b.id); }}
        hideActions
        emptyState="No bookings on this campaign yet."
      />
    </div>
  );
};

/**
 * An auction booking's buying terms: the most it pays per click, and how
 * its budget is spread over the flight. The floor is the product's lowest
 * accepted bid when it prices per click.
 */
export const AuctionBidPacing: React.FC<{ booking: Booking; withPacing?: boolean; className?: string }> = ({ booking, withPacing = true, className }) => {
  const db = useDb();
  const [bid, setBid] = React.useState(booking.bid !== undefined ? String(booking.bid) : '');
  React.useEffect(() => { setBid(booking.bid !== undefined ? String(booking.bid) : ''); }, [booking.id, booking.bid]);
  const [shape, setShape] = React.useState<PacingShape>('even');
  const [dailyBudget, setDailyBudget] = React.useState('');
  const [overrides, setOverrides] = React.useState<PacingOverride[]>([]);
  const product = productForBooking(db, booking);
  const floor = product?.floorPrice;
  const commit = () => {
    const n = parseFloat(bid.replace(',', '.'));
    const next = Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : undefined;
    if (next !== booking.bid) updateBooking(booking.id, { bid: next });
  };
  return (
    <FormSection bordered title={withPacing ? 'Bid & pacing' : 'Bid'} className={className}>
      <div className="space-y-field">
        <p className="text-sm text-muted-foreground">Auction, like its campaign: the booking bids for every impression and pays per click.</p>
        <div>
          <label className="mb-2 block text-sm font-medium">Bid (CPC)*</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">€</span>
            <Input inputMode="decimal" value={bid} onChange={(e) => setBid(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); }} placeholder="0.60" className="w-32" />
            <span className="text-sm text-muted-foreground">per click</span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            The most this booking pays for a click{floor !== undefined ? ` — at least ${formatEuro(floor)}, the floor` : ''}.
          </p>
        </div>
        {withPacing && <BudgetPacing
          totalBudget={booking.budget || undefined}
          startDate={new Date(booking.startDate)}
          endDate={new Date(booking.endDate)}
          shape={shape}
          onShapeChange={setShape}
          shapes={['account', 'even', 'frontloaded', 'asap']}
          dailyBudget={dailyBudget}
          onDailyBudgetChange={setDailyBudget}
          overrides={overrides}
          onOverridesChange={setOverrides}
        />}
      </div>
    </FormSection>
  );
};

/**
 * How the booking buys, following its campaign: a guaranteed booking sets
 * its goal and gets a billable amount; an auction booking sets its CPC and
 * pacing. Sponsored products carries bids and pacing of its own and passes
 * `auctionOnPage`; display paces in its budget block and passes `pacingOnPage`.
 */
export const BookingBuying: React.FC<{ booking: Booking | undefined; auctionOnPage?: boolean; pacingOnPage?: boolean; className?: string }> = ({ booking, auctionOnPage, pacingOnPage, className }) => {
  const db = useDb();
  if (!booking) return null;
  if (buyingTypeOf(db, booking) === 'guaranteed') return <GuaranteedGoalPrice booking={booking} className={className} />;
  return auctionOnPage ? null : <AuctionBidPacing booking={booking} withPacing={!pacingOnPage} className={className} />;
};

/**
 * The campaign type, stored: the choice every booking under the campaign
 * follows. Switching it changes the booking page — goal and billable amount
 * for guaranteed, CPC and pacing for auction.
 */
export const CampaignBuyingTypePicker: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const db = useDb();
  const toast = useToast();
  const value = buyingTypeOfCampaign(db, campaign);
  const bookings = db.bookings.filter((b) => b.campaignId === campaign.id);
  return (
    <BuyingTypePicker
      value={value}
      onChange={(next) => {
        if (next === value) return;
        updateCampaign(campaign.id, { buyingType: next });
        toast({
          title: next === 'guaranteed' ? 'Campaign is guaranteed' : 'Campaign is auction',
          description: `${bookings.length ? `Its ${bookings.length} booking${bookings.length === 1 ? '' : 's'} now` : 'Its bookings'} ${next === 'guaranteed' ? 'sell a goal at a billable amount' : 'bid a CPC with pacing'}.`,
          undo: () => updateCampaign(campaign.id, { buyingType: value }),
        });
      }}
    />
  );
};
