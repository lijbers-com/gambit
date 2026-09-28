'use client';

import * as React from 'react';
import { Eye, Lock, MousePointerClick, Store } from 'lucide-react';
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
import { ToggleSection } from './delivery-settings';
import type { MetricDefinition } from './metric-row';
import {
  GOAL_LABEL,
  PRICE_STATE_LABEL,
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
  setBookingBudget,
  listPriceFor,
  useDb,
  type Booking,
  type BookingGoal,
  type BookingPriceState,
  type BookingPriceView,
  type DbData,
  type GoalMetric,
  amountFor,
  buyingTypeOf,
  buyingTypeOfCampaign,
  campaignGuaranteedTotals,
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
  // Guaranteed: the goal is a delivery setting of its own.
  if (buyingTypeOf(db, booking) === 'guaranteed') return <BookingGoalSetting booking={booking} className={className} />;
  return auctionOnPage ? null : <AuctionBidPacing booking={booking} withPacing={false} className={className} />;
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

// ── Budget and goal ─────────────────────────────────────────────────────

/**
 * A guaranteed booking's budget, on the booking itself. The budget is its
 * price: indicative while it can change, quoted while a hold locks it, and
 * — once the booking is approved — the agreed, billable amount. The state
 * sits beside the label; what it means and what to do next beneath.
 */
export const GuaranteedBudgetField: React.FC<{ booking: Booking; campaignBudget?: string }> = ({ booking, campaignBudget }) => {
  const db = useDb();
  const toast = useToast();
  const view = bookingPrice(db, booking);
  const list = listPriceFor(db, booking);
  const locked = view.state === 'agreed';
  const [value, setValue] = React.useState(booking.budget ? String(booking.budget) : '');
  React.useEffect(() => { setValue(booking.budget ? String(booking.budget) : ''); }, [booking.id, booking.budget]);
  const commit = () => {
    const n = parseFloat(value.replace(/[^\d.]/g, ''));
    if (Number.isFinite(n) && n >= 0 && n !== booking.budget) setBookingBudget(booking.id, n);
  };
  const checkAvailability = () => {
    const result = quoteBookingPrice(booking.id);
    toast(result === 'quoted'
      ? { title: 'Budget quoted', description: 'Inventory is held and the budget locked as a quote until the hold runs out.' }
      : { title: 'Nothing to quote yet', description: 'Set a budget first.' });
  };
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <label className="text-sm font-medium">Booking budget*</label>
        {view.state !== 'not-priced' && (
          <Badge variant={PRICE_STATE_VARIANT[view.state]} className="gap-1">{locked && <Lock className="h-3 w-3" />}{PRICE_STATE_LABEL[view.state].label}</Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input inputMode="decimal" value={value} disabled={locked} placeholder="Enter budget" onChange={(e) => setValue(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); }} className="w-full" />
        {(view.state === 'indicative' || view.state === 'quoted') && (
          <Button variant="outline" onClick={checkAvailability} className="shrink-0">{view.state === 'quoted' ? 'Check again' : 'Check availability'}</Button>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {view.state === 'agreed' && view.lockedAt ? `Agreed on ${fmtDate(view.lockedAt)} — the billable amount, excl. VAT, invoiced afterwards.`
          : view.state === 'quoted' && view.expiresAt ? `Quoted, held until ${fmtDate(view.expiresAt)}. Approval makes it the billable amount.`
          : view.state === 'indicative' ? 'Indicative: a preview holds no inventory. Check availability to lock it as a quote.'
          : campaignBudget ? `Campaign budget: ${campaignBudget}` : 'Set a budget to price the booking.'}
        {booking.goal && view.unitPrice && view.basis ? ` ${formatUnitPrice(view.unitPrice, view.basis)} for ${formatGoal(booking.goal)}` : ''}
        {list && booking.goal ? ` · list ${formatUnitPrice(list.price, list.basis)}.` : ''}
      </p>
    </div>
  );
};

/**
 * The delivery goal — a setting of its own, switched on like display's
 * delivery objectives. On, the booking promises an amount of impressions
 * (stores, clicks) and is measured against it; off, it delivers what its
 * budget buys. The list price says what the goal is worth next to the
 * budget, so a negotiated deal reads as one.
 */
export const BookingGoalSetting: React.FC<{ booking: Booking; className?: string }> = ({ booking, className }) => {
  const db = useDb();
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  const metric = campaign ? goalMetricFor(campaign.engine) : 'impressions';
  const label = GOAL_LABEL[metric];
  const list = listPriceFor(db, booking);
  const locked = booking.price?.state === 'agreed';
  const [enabled, setEnabled] = React.useState(!!booking.goal);
  const [value, setValue] = React.useState(booking.goal?.amount ? booking.goal.amount.toLocaleString('en-US') : '');
  React.useEffect(() => {
    setEnabled(!!booking.goal);
    setValue(booking.goal?.amount ? booking.goal.amount.toLocaleString('en-US') : '');
  }, [booking.id, booking.goal?.amount]);
  // What the budget buys at the list price — the goal a fresh switch offers.
  const affordable = list && booking.budget > 0 && list.price > 0
    ? (list.basis === 'cpm' ? Math.floor(((booking.budget / list.price) * 1000) / 1000) * 1000 : Math.floor(booking.budget / list.price))
    : undefined;
  const amount = parseInt(value.replace(/[^\d]/g, ''), 10);
  const worth = list && Number.isFinite(amount) && amount > 0 ? amountFor(list.basis, list.price, { metric, amount }) : undefined;
  const commit = () => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    if (amount !== booking.goal?.amount) setBookingGoal(booking.id, { metric, amount });
  };
  return (
    <ToggleSection
      title="Delivery goal"
      info={`The ${label.many} this booking promises to deliver. Delivery is measured against it, and a booking that ends short is credited on its invoice.`}
      offSummary={`No goal — the booking delivers what its budget buys${affordable ? `, about ${compactNumber(affordable)} ${label.many} at the list price` : ''}.`}
      checked={enabled}
      onCheckedChange={(on) => {
        if (locked) return;
        setEnabled(on);
        if (!on) setBookingGoal(booking.id, undefined);
        else if (!booking.goal && affordable) { setValue(affordable.toLocaleString('en-US')); setBookingGoal(booking.id, { metric, amount: affordable }); }
      }}
      className={className}
    >
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">Goal*</label>
        <div className="flex items-center gap-2">
          <Input inputMode="numeric" value={value} disabled={locked} onChange={(e) => setValue(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); }} placeholder={metric === 'impressions' ? 'e.g. 500,000' : 'e.g. 30'} className="w-48" />
          <span className="text-sm text-muted-foreground">{label.many}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {locked ? 'Part of the agreed deal — it cannot change after approval.'
            : worth !== undefined && list ? `Worth ${formatEuro(worth)} at the list price of ${formatUnitPrice(list.price, list.basis)}${booking.budget ? ` — the budget is ${formatEuro(booking.budget)}` : ''}.`
            : 'Pick a retail media product to see what the goal is worth.'}
        </p>
      </div>
    </ToggleSection>
  );
};

/**
 * What goes in the budget block's pacing slot for a booking: budget or goal
 * when it is guaranteed, pacing when it bids. Pages that keep their own
 * pacing state (display, sponsored products) pass it as `auction`.
 */
export const BookingBudgetSetting: React.FC<{
  booking: Booking;
  budgetField: React.ReactNode;
  startDate?: Date;
  endDate?: Date;
  campaignBudget?: string;
  auction?: React.ReactNode;
}> = ({ booking, budgetField, startDate, endDate, campaignBudget, auction }) => {
  const db = useDb();
  const [shape, setShape] = React.useState<PacingShape>('even');
  const [dailyBudget, setDailyBudget] = React.useState('');
  const [overrides, setOverrides] = React.useState<PacingOverride[]>([]);
  if (buyingTypeOf(db, booking) === 'guaranteed') return <GuaranteedBudgetField booking={booking} campaignBudget={campaignBudget} />;
  if (auction !== undefined) return <>{auction}</>;
  return (
    <BudgetPacing
      budgetField={budgetField}
      totalBudget={booking.budget || undefined}
      startDate={startDate ?? new Date(booking.startDate)}
      endDate={endDate ?? new Date(booking.endDate)}
      shape={shape}
      onShapeChange={setShape}
      shapes={['account', 'even', 'frontloaded', 'asap']}
      dailyBudget={dailyBudget}
      onDailyBudgetChange={setDailyBudget}
      overrides={overrides}
      onOverridesChange={setOverrides}
    />
  );
};

/**
 * The budget block's pacing slot for a booking: pass the page's own pacing
 * (if it has one) and get back the slot that shows budget or goal when the
 * booking is guaranteed, and that pacing — or a default one — when it bids.
 * Without a booking (Storybook) the page's own pacing is kept as it was.
 */
export function withBudgetSetting(
  booking: Booking | undefined,
  pacing?: (budgetField: React.ReactNode) => React.ReactNode,
  campaignBudget?: string,
): ((budgetField: React.ReactNode) => React.ReactNode) | undefined {
  if (!booking) return pacing;
  // eslint-disable-next-line react/display-name
  return (budgetField) => (
    <BookingBudgetSetting booking={booking} budgetField={budgetField} campaignBudget={campaignBudget} auction={pacing ? pacing(budgetField) : undefined} />
  );
}

// ── Delivery instead of spend ───────────────────────────────────────────

/** The Delivery card: delivered against the goal, with where it should be. */
function deliveryCard(share: number, expectedShare: number, delivered: number, goal: BookingGoal): MetricDefinition {
  const behind = share < expectedShare - 0.05;
  return {
    key: 'spend',
    label: 'Delivery',
    value: `${(share * 100).toFixed(1)}%`,
    subMetric: `${compactNumber(delivered)} of ${formatGoal(goal)}`,
    badgeValue: `Exp. ${(expectedShare * 100).toFixed(1)}%`,
    badgeVariant: behind ? 'warning' : 'secondary',
  };
}

/**
 * A guaranteed booking is judged on delivery, not spend — its price is
 * fixed — so its Spend card becomes the Delivery card, in the same place.
 * Auction bookings keep their cards as they are.
 */
export function useDeliveryMetrics(metrics: MetricDefinition[], booking: Booking | undefined): MetricDefinition[] {
  const db = useDb();
  if (!booking || !isGuaranteed(db, booking)) return metrics;
  const p = deliveryProgress(booking);
  const card: MetricDefinition = p
    ? deliveryCard(p.share, p.expectedShare, p.delivered, p.goal)
    : { key: 'spend', label: 'Delivery', value: '—', subMetric: booking.goal ? `of ${formatGoal(booking.goal)} · not started` : 'No goal set yet' };
  return metrics.map((m) => (m.key === 'spend' ? card : m));
}

/** The same for a campaign: its guaranteed bookings, summed. */
export function useCampaignDeliveryMetrics(metrics: MetricDefinition[], campaign: Campaign | undefined): MetricDefinition[] {
  const db = useDb();
  if (!campaign || buyingTypeOfCampaign(db, campaign) !== 'guaranteed') return metrics;
  const t = campaignGuaranteedTotals(db, campaign);
  const delivered = db.bookings.filter((b) => b.campaignId === campaign.id).reduce((n, b) => n + (b.delivered ?? 0), 0);
  const card: MetricDefinition = t?.progress
    ? deliveryCard(t.progress.share, t.progress.expectedShare, delivered, t.goal)
    : { key: 'spend', label: 'Delivery', value: '—', subMetric: t ? `of ${formatGoal(t.goal)} · not started` : 'No goals set yet' };
  return metrics.map((m) => (m.key === 'spend' ? card : m));
}
