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
import { SettingsCard } from './settings-card';
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
  useDb,
  type Booking,
  type BookingGoal,
  type BookingPriceState,
  type BookingPriceView,
  type DbData,
  type GoalMetric,
  type PricingBasis,
  priceFor,
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
  // Guaranteed sizing (budget or goal) lives in the budget block now.
  if (buyingTypeOf(db, booking) === 'guaranteed') return null;
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

// ── Budget or goal ──────────────────────────────────────────────────────

export type BudgetMode = 'budget' | 'goal';

/** What a total budget buys at a unit price, in whole goal units. */
export function goalFromBudget(budget: number, unitPrice: number, basis: PricingBasis, metric: GoalMetric): number {
  if (!unitPrice || budget <= 0) return 0;
  const raw = basis === 'cpm' ? (budget / unitPrice) * 1000 : budget / unitPrice;
  return metric === 'impressions' ? Math.floor(raw / 1000) * 1000 : Math.floor(raw);
}

/**
 * Budget or goal — how a guaranteed booking is sized, the way pacing sits
 * in an auction booking's budget: two cards, one total amount. Set a budget
 * and the goal follows from the price; set a goal and the billable amount
 * does. Presentational: the booking page and the wizard each keep the state.
 */
export const BudgetOrGoal: React.FC<{
  mode: BudgetMode;
  onModeChange: (mode: BudgetMode) => void;
  budget: string;
  onBudgetChange: (value: string) => void;
  onBudgetCommit?: () => void;
  goal: string;
  onGoalChange: (value: string) => void;
  onGoalCommit?: () => void;
  metric: GoalMetric;
  unitPrice?: number;
  basis?: PricingBasis;
  campaignBudget?: string;
  disabled?: boolean;
  /** The billable amount's state, under the cards. */
  footer?: React.ReactNode;
}> = ({ mode, onModeChange, budget, onBudgetChange, onBudgetCommit, goal, onGoalChange, onGoalCommit, metric, unitPrice, basis, campaignBudget, disabled, footer }) => {
  const label = GOAL_LABEL[metric];
  const num = (v: string) => { const n = parseFloat(v.replace(/[^\d.]/g, '')); return Number.isFinite(n) ? n : 0; };
  const priced = unitPrice !== undefined && !!basis;
  const derivedGoal = priced ? goalFromBudget(num(budget), unitPrice!, basis!, metric) : 0;
  const goalValue = Math.round(num(goal));
  const derivedAmount = priced && goalValue > 0 ? amountFor(basis!, unitPrice!, { metric, amount: goalValue }) : undefined;
  const priceNote = priced ? ` at ${formatUnitPrice(unitPrice!, basis!)}` : '';

  const field = (value: string, onChange: (v: string) => void, onCommit: (() => void) | undefined, prefix: string | undefined, suffix: string | undefined, placeholder: string, result: React.ReactNode) => (
    <div className="max-w-md space-y-1.5">
      <div className="flex items-center gap-2">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <Input inputMode="decimal" value={value} disabled={disabled} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} onBlur={onCommit} onKeyDown={(e) => { if (e.key === 'Enter') onCommit?.(); }} className="w-48" />
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      <p className="text-xs text-muted-foreground">{result}</p>
    </div>
  );

  return (
    <div className="space-y-field">
      <SettingsCard
        label="Budget or goal"
        options={[
          { value: 'budget', label: 'Set a budget', description: `Spend a total amount — the ${label.many} follow from the price.` },
          { value: 'goal', label: 'Set a goal', description: `Buy a total number of ${label.many} — the billable amount follows.` },
        ]}
        value={mode}
        onChange={(v) => { if (!disabled) onModeChange(v as BudgetMode); }}
        pinnedExtra={(opt) => opt.value === 'budget'
          ? field(budget, onBudgetChange, onBudgetCommit, '€', undefined, 'Total budget',
              priced ? (derivedGoal > 0 ? `Buys ${compactNumber(derivedGoal)} ${label.many}${priceNote}.` : `Enter a budget to see the ${label.many} it buys${priceNote}.`) : 'Pick a retail media product to price the booking.')
          : field(goal, onGoalChange, onGoalCommit, undefined, label.many, `Total ${label.many}`,
              priced ? (derivedAmount !== undefined ? `Billable amount ${formatEuro(derivedAmount)}${priceNote}.` : `Enter a goal to see the billable amount${priceNote}.`) : 'Pick a retail media product to price the booking.')}
      />
      {campaignBudget && <p className="text-xs text-muted-foreground">Campaign budget: {campaignBudget}</p>}
      {footer}
    </div>
  );
};

/**
 * Budget or goal on the booking page, written straight to the booking: the
 * goal is always stored (set, or bought by the budget) and the budget always
 * equals what it costs, so the billable amount and the invoice agree. Below
 * the cards, the billable amount in its state — with Check availability to
 * turn it into a quote until approval agrees it.
 */
export const GuaranteedBudgetGoal: React.FC<{ booking: Booking; campaignBudget?: string }> = ({ booking, campaignBudget }) => {
  const db = useDb();
  const toast = useToast();
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  const metric = campaign ? goalMetricFor(campaign.engine) : 'impressions';
  const view = bookingPrice(db, booking);
  const product = productForBooking(db, booking);
  const iso = booking.startDate;
  const live = product ? priceFor(db, product, { from: iso, to: booking.endDate, budget: booking.budget }) : undefined;
  const unitPrice = view.unitPrice ?? live?.price;
  const basis = view.basis ?? live?.basis;
  const locked = view.state === 'agreed';

  const [mode, setMode] = React.useState<BudgetMode>(booking.goal ? 'goal' : 'budget');
  const [budget, setBudget] = React.useState(booking.budget ? String(booking.budget) : '');
  const [goal, setGoal] = React.useState(booking.goal?.amount ? String(booking.goal.amount) : '');
  React.useEffect(() => {
    setBudget(booking.budget ? String(booking.budget) : '');
    setGoal(booking.goal?.amount ? String(booking.goal.amount) : '');
  }, [booking.id, booking.budget, booking.goal?.amount]);

  const commitBudget = () => {
    const b = parseFloat(budget.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(b) || b <= 0 || !unitPrice || !basis) return;
    const amount = goalFromBudget(b, unitPrice, basis, metric);
    if (amount !== booking.goal?.amount) setBookingGoal(booking.id, amount > 0 ? { metric, amount } : undefined);
    if (b !== booking.budget) updateBooking(booking.id, { budget: b });
  };
  const commitGoal = () => {
    const g = Math.round(parseFloat(goal.replace(/[^\d.]/g, '')));
    if (!Number.isFinite(g) || g <= 0) return;
    if (g !== booking.goal?.amount) setBookingGoal(booking.id, { metric, amount: g });
    if (unitPrice && basis) {
      const cost = amountFor(basis, unitPrice, { metric, amount: g });
      if (cost !== booking.budget) updateBooking(booking.id, { budget: cost });
    }
  };
  const checkAvailability = () => {
    const result = quoteBookingPrice(booking.id);
    toast(result === 'quoted'
      ? { title: 'Price quoted', description: 'Inventory is held and the billable amount locked until the hold runs out.' }
      : { title: 'Nothing to quote yet', description: 'Set a budget or a goal first.' });
  };

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Billable amount</span>
          <Badge variant={PRICE_STATE_VARIANT[view.state]} className="gap-1">{locked && <Lock className="h-3 w-3" />}{PRICE_STATE_LABEL[view.state].label}</Badge>
        </div>
        <div className="mt-1 text-lg font-semibold tabular-nums">{view.amount === undefined ? '—' : formatEuro(view.amount)}</div>
        <p className="text-xs text-muted-foreground">
          {view.state === 'agreed' && view.lockedAt ? `Agreed on ${fmtDate(view.lockedAt)}. Excl. VAT, invoiced afterwards.`
            : view.state === 'quoted' && view.expiresAt ? `Held until ${fmtDate(view.expiresAt)}. Approval makes it the agreed amount.`
            : view.state === 'indicative' ? 'A preview holds no inventory. Check availability to lock it.'
            : 'Set a budget or a goal to price the booking.'}
        </p>
      </div>
      {(view.state === 'indicative' || view.state === 'quoted') && (
        <Button variant="outline" size="sm" onClick={checkAvailability}>{view.state === 'quoted' ? 'Check availability again' : 'Check availability'}</Button>
      )}
    </div>
  );

  return (
    <BudgetOrGoal
      mode={mode}
      onModeChange={setMode}
      budget={budget}
      onBudgetChange={setBudget}
      onBudgetCommit={commitBudget}
      goal={goal}
      onGoalChange={setGoal}
      onGoalCommit={commitGoal}
      metric={metric}
      unitPrice={unitPrice}
      basis={basis}
      campaignBudget={campaignBudget}
      disabled={locked}
      footer={footer}
    />
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
  if (buyingTypeOf(db, booking) === 'guaranteed') return <GuaranteedBudgetGoal booking={booking} campaignBudget={campaignBudget} />;
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
