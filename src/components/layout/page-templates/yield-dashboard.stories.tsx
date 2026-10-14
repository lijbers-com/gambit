import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs } from '@/components/ui/card';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import React, { useMemo, useState } from 'react';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Input } from '@/components/ui/input';
import { FilterBar } from '@/components/ui/filter-bar';
import { PROTOTYPE_TODAY, prototypeToday } from '@/lib/clock';
import { useDb } from '@/lib/db';
import type { DbData, EngineId, MediaProduct, Placement, Position, PricingBasis, PricingRule } from '@/lib/db';
import { BASIS_LABEL, ENGINE_LABEL, formatPrice, priceFor } from '@/lib/db/pricing';
import {
  defaultFrame,
  mondayOf,
  mondaysBetween,
  positionWeek,
  productWeek,
  retailMomentsFor,
  weekNumberOf,
  type InventoryWeek,
} from '@/lib/db/inventory';
import {
  BENCHMARKS,
  EMPTY,
  breakdown,
  previousPeriod,
  ratesOf,
  seriesFor,
  totalsFor,
  type PerformanceScope,
  type Totals,
} from '@/lib/db/performance';
import { groupOf, productsOfPosition } from '@/lib/db/hierarchy';
import { placementsOf, positionsOf } from '@/lib/db/pricing';

/** Whether a media product's package reaches into a placement. */
const inProduct = (db: DbData, placementId: string, productId: string) => positionsOf(db, productId, placementId).length > 0;

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Yield Dashboard',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Yield Dashboard Page Template

The Yield Dashboard provides comprehensive fill rate analytics from a retailer's perspective. It shows how well advertising positions are being filled across all advertising engines, helping retailers optimize their inventory monetization.

## Features

- **Fill Rate Focus**: Primary metric showing how well positions are being filled
- **Engine-Specific Views**: General overview and per-engine detailed views
- **Line Chart Visualization**: Trend analysis of fill rates over time
- **Retailer Perspective**: Designed for retail partners managing their ad inventory
- **Real-time Metrics**: Live fill rate indicators with percentage calculations

## Layout Structure

### Yield Dashboard
- **Fill Rate per Engine**: Shows fill rate for each advertising engine
- **Overall Fill Rate**: Combined fill rate across all engines
- **Trend Analysis**: Line chart showing fill rate trends over time
- **Revenue Impact**: How fill rate affects overall revenue

### Engine-Specific Dashboards
- **Sponsored Products**: Fill rate for product placement ads
- **Display**: Fill rate for banner and display advertisements
- **Digital In-store**: Fill rate for in-store digital positions
- **Offline In-store**: Fill rate for physical in-store positions

## Key Metrics

- **Fill Rate**: Percentage of available positions that are filled
- **Available Positions**: Total advertising positions available
- **Filled Positions**: Number of positions with active advertisements
- **Revenue per Position**: Average revenue generated per filled position

## Usage

This template is ideal for:
- Retail partners monitoring ad inventory performance
- Yield optimization and revenue management
- Position availability analysis
- Engine performance comparison
- Strategic planning for ad inventory expansion

## Components Used

- AppLayout (navigation, user management, page header)
- Card (metric cards and chart containers)
- LineChart (fill rate trend visualization)
- MetricCard (fill rate metrics display)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


// ── Yield data ──────────────────────────────────────────────────────────
//
// Every number on the yield pages is read from the prototype database
// through the shared models, never seeded per page:
//   fill, capacity, sales channel and booked revenue — the inventory model
//     (positionWeek), the same one every booking calendar reads;
//   delivered revenue (spend), impressions, clicks, ROAS — the performance
//     model (totalsFor / breakdown / seriesFor);
//   prices and indexes — the pricing engine (priceFor, db.pricingRules).
// Rows follow AH's offering: proposition → media product → placement →
// position. Business time is the prototype clock (lib/clock).

const ENGINES: EngineId[] = ['sponsored-products', 'display', 'digital-instore', 'offline-instore', 'offsite'];

/** What the retailer holds each proposition's fill rate to, in % — the one
 *  place the yield targets live. `all` is the general fill rate's. Offsite
 *  has no agreed target yet and carries offline in-store's. */
const FILL_RATE_TARGETS: Record<EngineId | 'all', number> = {
  all: 88,
  'sponsored-products': 92,
  display: 85,
  'digital-instore': 80,
  'offline-instore': 75,
  offsite: 75,
};

/** How inventory was sold — the inventory model's split of every booked
 *  unit (InventoryWeek.channels), plus what is left. */
type Channel = 'managed' | 'selfService' | 'programmatic' | 'unsold';
const CHANNELS: Channel[] = ['managed', 'selfService', 'programmatic', 'unsold'];
const CHANNEL_LABEL: Record<Channel, string> = {
  managed: 'Managed',
  selfService: 'Self Service',
  programmatic: 'Programmatic',
  unsold: 'Unsold',
};
type SoldChannel = Exclude<Channel, 'unsold'>;
const CHANNEL_OF: Record<keyof InventoryWeek['channels'], SoldChannel> = {
  soldManaged: 'managed',
  action: 'selfService',
  programmatic: 'programmatic',
};

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'outline' | 'success' | 'warning';

/** A metric card's content. */
interface YieldMetric {
  id: string;
  label: string;
  value: string;
  subMetric?: string;
  badgeValue?: string;
  badgeVariant?: BadgeVariant;
}

// ── Formatting ──────────────────────────────────────────────────────────

const round1 = (v: number) => Math.round(v * 10) / 10;
const pct = (share: number, digits = 1) => `${(share * 100).toFixed(digits)}%`;
const int = (v: number) => Math.round(v).toLocaleString('en-US');
const eur = (v: number) => `€${Math.round(v).toLocaleString('en-US')}`;
const eurCents = (v: number) => `€${v.toFixed(2)}`;
/** Small amounts with cents, larger ones whole. */
const money = (v: number) => (Math.abs(v) < 100 ? eurCents(v) : eur(v));
const eurCompact = (v: number) =>
  v >= 1_000_000 ? `€${(v / 1_000_000).toFixed(1)}M` : v >= 10_000 ? `€${(v / 1_000).toFixed(1)}K` : eur(v);
const signed = (v: number, digits = 1, unit = '%') => `${v >= 0 ? '+' : ''}${v.toFixed(digits)}${unit}`;
const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

// ── Dates (business time: lib/clock) ────────────────────────────────────

const DAY_MS = 86_400_000;
/** A picker's local calendar day as an ISO date. */
const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/** An ISO date as a local calendar day, for the date pickers. */
const dateOf = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);
/** The month an ISO week belongs to — its Thursday's, as ISO weeks count. */
const monthOfWeek = (monday: string) => addDays(monday, 3).slice(0, 7);
const lastDayOfMonth = (month: string) => {
  const [y, m] = month.split('-').map(Number);
  return addDays(`${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, '0')}-01`, -1);
};
const monthSpan = (from: string, to: string) => {
  const a = MONTH_LONG[Number(from.slice(5, 7)) - 1];
  const b = MONTH_LONG[Number(to.slice(5, 7)) - 1];
  return a === b ? a : `${a} – ${b}`;
};

/** The yield overview's default period: the business year of the
 *  prototype's today (Jan–Dec 2026). The seeded bookings run Jan–Sep, so the
 *  year shows the season sold so far and the months still open to sell —
 *  and the Q4 and Black Friday indexes in the seasonality chart. */
const businessYear = () => {
  const y = PROTOTYPE_TODAY.slice(0, 4);
  return { from: `${y}-01-01`, to: `${y}-12-31` };
};

const rangeOf = (range: DateRange | undefined, fallback: { from: string; to: string }) =>
  range?.from && range?.to ? { from: isoOf(range.from), to: isoOf(range.to) } : fallback;

// ── Inventory roll-ups ──────────────────────────────────────────────────

/** Inventory weeks added up. Capacity is in the proposition's own unit, so
 *  stock only adds up within one proposition. */
interface Stock {
  capacity: number;
  used: number;
  available: number;
  /** Booked revenue: each booking's budget spread over its run. */
  revenue: number;
  channels: Record<SoldChannel, number>;
}

const emptyStock = (): Stock => ({ capacity: 0, used: 0, available: 0, revenue: 0, channels: { managed: 0, selfService: 0, programmatic: 0 } });

function addWeek(s: Stock, w: InventoryWeek): Stock {
  s.capacity += w.capacity;
  s.used += w.used;
  s.available += w.available;
  s.revenue += w.revenue;
  (Object.keys(w.channels) as (keyof InventoryWeek['channels'])[]).forEach((k) => { s.channels[CHANNEL_OF[k]] += w.channels[k]; });
  return s;
}

/** Fill as the calendars show it: taken over capacity, at most 100%. */
const fillOf = (s: Stock) => (s.capacity > 0 ? Math.min(1, s.used / s.capacity) : 0);
/** A channel's share of the capacity; unsold is what is left. */
const channelShare = (s: Stock, c: Channel) => (s.capacity > 0 ? (c === 'unsold' ? s.available : s.channels[c]) / s.capacity : 0);

/** One position over the period, week by week. */
interface PositionYield {
  position: Position;
  product: MediaProduct;
  placement?: Placement;
  engine: EngineId;
  weeks: InventoryWeek[];
  stock: Stock;
}

interface YieldModel {
  from: string;
  to: string;
  mondays: string[];
  positions: PositionYield[];
  /** How each booking was sold. */
  channelOf: Map<string, SoldChannel>;
}

/** How each booking was sold, read off the inventory model itself — the
 *  channel its load lands in — so the split is the calendars' own. */
function bookingChannels(db: DbData): Map<string, SoldChannel> {
  const out = new Map<string, SoldChannel>();
  for (const b of db.bookings) {
    const position = db.positions.find((p) => b.positionIds.includes(p.id));
    if (!position) continue;
    const w = positionWeek(db, position, mondayOf(b.startDate), { include: (x) => x.id === b.id });
    const key = (Object.keys(w.channels) as (keyof InventoryWeek['channels'])[]).find((k) => w.channels[k] > 0);
    if (key) out.set(b.id, CHANNEL_OF[key]);
  }
  return out;
}

function buildYieldModel(db: DbData, from: string, to: string): YieldModel {
  const mondays = mondaysBetween(from, to);
  const positions: PositionYield[] = [];
  for (const position of db.positions) {
    // The rate-card line a position is sold in first — its own product.
    const product = productsOfPosition(db, position.id)[0];
    if (!product) continue;
    const weeks = mondays.map((m) => positionWeek(db, position, m));
    positions.push({
      position,
      product,
      placement: db.placements.find((p) => p.id === position.placementId),
      engine: product.engine,
      weeks,
      stock: weeks.reduce(addWeek, emptyStock()),
    });
  }
  return { from, to, mondays, positions, channelOf: bookingChannels(db) };
}

const stockOf = (list: PositionYield[]) => {
  const s = emptyStock();
  for (const p of list) for (const w of p.weeks) addWeek(s, w);
  return s;
};

/** What the filters narrow to. */
interface YieldFilter {
  engine?: EngineId;
  productId?: string;
  placementId?: string;
}

const scopedPositions = (model: YieldModel, f: YieldFilter) =>
  model.positions.filter((p) =>
    (!f.engine || p.engine === f.engine) && (!f.productId || p.product.id === f.productId) && (!f.placementId || p.position.placementId === f.placementId));

/** The same narrowing for the performance model. */
const performanceScope = (model: YieldModel, f: YieldFilter): PerformanceScope => ({
  from: model.from,
  to: model.to,
  engine: f.engine,
  mediaProductIds: f.productId ? [f.productId] : undefined,
  placementIds: f.placementId ? [f.placementId] : undefined,
});

// ── Series ──────────────────────────────────────────────────────────────

type YieldGrain = 'week' | 'month';
/** Weekly up to four months, monthly beyond. */
const grainFor = (model: YieldModel): YieldGrain => (model.mondays.length > 17 ? 'month' : 'week');

interface Bucket { key: string; label: string; weekIdx: number[] }

function bucketsOf(model: YieldModel, grain: YieldGrain): Bucket[] {
  const out: Bucket[] = [];
  model.mondays.forEach((m, i) => {
    const key = grain === 'week' ? m : monthOfWeek(m);
    const last = out[out.length - 1];
    if (last && last.key === key) last.weekIdx.push(i);
    else out.push({ key, label: grain === 'week' ? `Wk ${weekNumberOf(m)}` : MONTH_SHORT[Number(key.slice(5, 7)) - 1], weekIdx: [i] });
  });
  return out;
}

function stockSeries(model: YieldModel, list: PositionYield[], grain: YieldGrain): (Bucket & { stock: Stock })[] {
  return bucketsOf(model, grain).map((b) => {
    const stock = emptyStock();
    for (const p of list) for (const i of b.weekIdx) addWeek(stock, p.weeks[i]);
    return { ...b, stock };
  });
}

const fillVariant = (fillPct: number, target: number): BadgeVariant =>
  fillPct >= target ? 'success' : fillPct >= target - 10 ? 'warning' : 'destructive';

/** The fill-rate card of a proposition (or the general one). */
function fillCard(id: string, label: string, fill: number, target: number): YieldMetric {
  return {
    id,
    label,
    value: pct(fill),
    subMetric: `Target: ${target}%`,
    badgeValue: signed(fill * 100 - target, 1, ' pts'),
    badgeVariant: fillVariant(fill * 100, target),
  };
}

/** Fill per proposition over the period; the general fill rate is their
 *  average — each proposition counts its capacity in its own unit (clicks,
 *  impressions, stores), so their units cannot be added together. */
function fillRateCards(list: PositionYield[], engine?: EngineId) {
  const perEngine = ENGINES.map((e) => ({ e, stock: stockOf(list.filter((p) => p.engine === e)) })).filter((x) => x.stock.capacity > 0);
  const cards = perEngine.map((x) => fillCard(`${x.e}-fill`, ENGINE_LABEL[x.e], fillOf(x.stock), FILL_RATE_TARGETS[x.e]));
  if (engine) return cards;
  return [fillCard('general-fill-rate', 'General Fill Rate', avg(perEngine.map((x) => fillOf(x.stock))), FILL_RATE_TARGETS.all), ...cards];
}

/** The trend behind a fill-rate card, per week or month. */
function fillTrend(model: YieldModel, list: PositionYield[], metricId: string) {
  const grain = grainFor(model);
  const engine = ENGINES.find((e) => `${e}-fill` === metricId);
  if (engine) {
    return stockSeries(model, list.filter((p) => p.engine === engine), grain)
      .map((b) => ({ name: b.label, fillRate: round1(fillOf(b.stock) * 100), target: FILL_RATE_TARGETS[engine] }));
  }
  const perEngine = ENGINES.map((e) => list.filter((p) => p.engine === e)).filter((l) => l.length).map((l) => stockSeries(model, l, grain));
  return bucketsOf(model, grain).map((b, i) => ({
    name: b.label,
    fillRate: round1(avg(perEngine.map((s) => s[i].stock).filter((s) => s.capacity > 0).map(fillOf)) * 100),
    target: FILL_RATE_TARGETS.all,
  }));
}

// ── Pricing ─────────────────────────────────────────────────────────────

/** Seasons and retail moments: the dated pricing rules, per ISO week — the
 *  same rules that move prices and mark the calendars' event bars. With no
 *  proposition chosen, only the rules that hold for every proposition. */
function seasonalitySeries(db: DbData, model: YieldModel, engine?: EngineId, productId?: string) {
  const rules = (engine
    ? retailMomentsFor(db, engine)
    : db.pricingRules.filter((r) => (r.kind === 'seasonality' || r.kind === 'moment') && r.status === 'active' && r.from && r.to && r.engine === 'all'))
    .filter((r) => !productId || !r.mediaProductIds?.length || r.mediaProductIds.includes(productId));
  return model.mondays.map((m) => {
    const end = addDays(m, 6);
    const index = rules.filter((r) => r.from! <= end && m <= r.to!).reduce((x, r) => x * r.index, 1);
    return { name: String(weekNumberOf(m)), seasonality: Math.round(index * 100) };
  });
}

type PriceGroup = 'seasonality' | 'marketIndex' | 'discount';
const PRICE_GROUP: Record<PricingRule['kind'], PriceGroup> = {
  seasonality: 'seasonality',
  moment: 'seasonality',
  market: 'marketIndex',
  demand: 'marketIndex',
  'early-booking': 'discount',
  volume: 'discount',
};

/** A price over the period, taken apart: the list price and what each kind
 *  of pricing rule adds or takes off, as shares of the list price. Demand
 *  rules read the fill; early-booking reads how far ahead the period starts.
 *  Volume deals depend on a booking's budget, so they do not show here. */
function priceAnatomy(db: DbData, target: MediaProduct | Position, model: YieldModel, fill: number) {
  const build = priceFor(db, 'engine' in target ? target : productsOfPosition(db, target.id)[0], {
    from: model.from,
    to: model.to,
    fillRate: fill,
    daysAhead: Math.max(0, daysBetween(PROTOTYPE_TODAY, model.from)),
  });
  if (!build || !build.listPrice) return undefined;
  const delta: Record<PriceGroup, number> = { seasonality: 0, marketIndex: 0, discount: 0 };
  for (const s of build.steps) delta[PRICE_GROUP[s.rule.kind]] += (s.after - s.before) / build.listPrice;
  return { ...build, delta };
}

const priceLabel = (v: number, basis: PricingBasis) => `${formatPrice(v, basis)} ${BASIS_LABEL[basis]}`;

/** The dashboard's "Retail Media Product Report": every media product's
 *  price as an index on its list price (= 100), built up from the pricing
 *  rules — ranked by fill over the period. */
function priceIndexRanking(db: DbData, model: YieldModel, list: PositionYield[]) {
  const products = [...new Set(list.map((p) => p.product))];
  const rows = products.map((m) => {
    const fill = fillOf(stockOf(list.filter((p) => p.product.id === m.id)));
    const a = priceAnatomy(db, m, model, fill);
    return {
      product: m.name,
      // Not `fill`: recharts reads a row's `fill` as its bar colour.
      fillRate: fill,
      listPrice: 100,
      seasonality: round1((a?.delta.seasonality ?? 0) * 100),
      marketIndex: round1((a?.delta.marketIndex ?? 0) * 100),
      discount: round1((a?.delta.discount ?? 0) * 100),
      total: a ? round1((a.price / a.listPrice) * 100) : 100,
    };
  }).sort((a, b) => b.fillRate - a.fillRate);
  const chartRows = rows.map(({ fillRate: _, ...row }) => row);
  const best = chartRows.slice(0, Math.min(5, Math.ceil(rows.length / 2)));
  const worst = chartRows.slice(best.length).slice(-5).reverse();
  return { best, worst };
}

// ── Revenue ─────────────────────────────────────────────────────────────

function changeBadge(now: number, before: number | undefined): { badgeValue?: string; badgeVariant?: BadgeVariant } {
  if (!before || before <= 0) return {};
  return { badgeValue: signed((now / before - 1) * 100), badgeVariant: now >= before ? 'success' : 'destructive' };
}

/** Revenue to the retailer is what the bookings spent (delivered, to the
 *  prototype's today); booked revenue is their budget spread over the run. */
function revenueCards(db: DbData, model: YieldModel, list: PositionYield[], f: YieldFilter): YieldMetric[] {
  const scope = performanceScope(model, f);
  const totals = totalsFor(db, scope);
  const prevScope = previousPeriod(scope);
  const prev = prevScope ? totalsFor(db, prevScope) : undefined;
  const booked = stockOf(list).revenue;
  const n = Math.max(1, list.length);
  return [
    { id: 'total-revenue', label: 'Total Revenue', value: eurCompact(totals.spend), subMetric: `Booked: ${eurCompact(booked)}`, ...changeBadge(totals.spend, prev?.spend) },
    { id: 'avg-cpm', label: 'Average CPM', value: eurCents(ratesOf(totals).cpm), subMetric: 'Cost per mille', ...changeBadge(ratesOf(totals).cpm, prev && ratesOf(prev).cpm) },
    { id: 'revenue-per-position', label: 'Revenue per Position', value: money(totals.spend / n), subMetric: `Average over ${list.length} positions`, ...changeBadge(totals.spend / n, prev && prev.spend / n) },
  ];
}

function revenueTrend(db: DbData, model: YieldModel, list: PositionYield[], f: YieldFilter) {
  const grain = grainFor(model);
  const spendBy = new Map<string, number>();
  for (const p of seriesFor(db, performanceScope(model, f), grain)) {
    const key = grain === 'month' ? p.start.slice(0, 7) : p.start;
    spendBy.set(key, (spendBy.get(key) ?? 0) + p.totals.spend);
  }
  return stockSeries(model, list, grain).map((b) => ({ name: b.label, revenue: Math.round(spendBy.get(b.key) ?? 0), booked: Math.round(b.stock.revenue) }));
}

/** Inventory per proposition by how it was sold, in % of capacity. */
function inventoryByEngine(list: PositionYield[], channel?: Channel) {
  return ENGINES.flatMap((e) => {
    const s = stockOf(list.filter((p) => p.engine === e));
    if (!s.capacity) return [];
    const shares = Object.fromEntries(CHANNELS.map((c) => [c, round1(channelShare(s, c) * 100)])) as Record<Channel, number>;
    return [channel ? { engine: ENGINE_LABEL[e], [channel]: shares[channel] } : { engine: ENGINE_LABEL[e], ...shares }];
  });
}

// ── Per proposition (the un-routed per-engine stories) ──────────────────

function useEngineYield(engine: EngineId, dateRange: DateRange | undefined) {
  const db = useDb();
  const { from, to } = rangeOf(dateRange, defaultFrame());
  return useMemo(() => {
    const model = buildYieldModel(db, from, to);
    const list = model.positions.filter((p) => p.engine === engine);
    const stock = stockOf(list);
    const target = FILL_RATE_TARGETS[engine];
    const totals = totalsFor(db, { engine, from, to });
    const n = Math.max(1, list.length);
    const metrics: YieldMetric[] = [
      { ...fillCard('fill-rate', 'Fill Rate', fillOf(stock), target), subMetric: `Target: ${target.toFixed(1)}%` },
      { id: 'total-positions', label: 'Total Positions', value: int(list.length), subMetric: `Filled: ${list.filter((p) => p.stock.used > 0).length}` },
      { id: 'revenue-per-position', label: 'Revenue per Position', value: money(totals.spend / n), subMetric: `Booked: ${money(stock.revenue / n)}` },
      { id: 'total-revenue', label: 'Total Revenue', value: eur(totals.spend), subMetric: `Booked: ${eur(stock.revenue)}` },
    ];
    const chartData = stockSeries(model, list, grainFor(model)).map((b) => ({ name: b.label, fillRate: round1(fillOf(b.stock) * 100), target }));
    const byPosition = new Map(breakdown(db, { engine, from, to }, 'position').map((r) => [r.id, r.totals]));
    const positions = list.map((p) => {
      const t = byPosition.get(p.position.id) ?? EMPTY;
      return {
        id: p.position.id,
        name: `${p.placement?.name ?? p.product.name} · ${p.position.name}`,
        fillRate: pct(fillOf(p.stock)),
        totalPositions: Math.round(p.stock.capacity),
        filledPositions: Math.round(p.stock.used),
        revenue: eur(t.spend),
        roas: `${ratesOf(t).roas.toFixed(2)}x`,
      };
    });
    const byProduct = new Map(breakdown(db, { engine, from, to }, 'mediaProduct').map((r) => [r.id, r.totals]));
    const media = db.mediaProducts.filter((m) => m.engine === engine).map((m) => {
      const t = byProduct.get(m.id) ?? EMPTY;
      return {
        id: m.id,
        name: m.name,
        fillRate: pct(fillOf(stockOf(list.filter((p) => p.product.id === m.id)))),
        impressions: Math.round(t.impressions),
        clicks: Math.round(t.clicks),
        revenue: eur(t.spend),
        ctr: pct(ratesOf(t).ctr, 2),
      };
    });
    return { metrics, chartData, positions, media };
  }, [db, engine, from, to]);
}

// ── Chart configs ───────────────────────────────────────────────────────

const fillRateChartConfig = {
  fillRate: {
    label: 'Fill Rate',
    color: 'hsl(var(--chart-1))',
  },
  target: {
    label: 'Target',
    color: 'hsl(var(--chart-2))',
  },
};

const seasonalityChartConfig = {
  seasonality: {
    label: 'Seasonality index',
    color: 'hsl(var(--chart-1))',
  },
};

const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  booked: {
    label: 'Booked',
    color: 'hsl(var(--chart-2))',
  },
};

const marketIndexChartConfig = {
  listPrice: {
    label: 'List Price',
    color: 'hsl(var(--chart-1))',
  },
  seasonality: {
    label: 'Seasonality',
    color: 'hsl(var(--chart-2))',
  },
  marketIndex: {
    label: 'Market Index',
    color: 'hsl(var(--chart-3))',
  },
  discount: {
    label: 'Discount',
    color: 'hsl(var(--chart-4))',
  },
};

const channelChartConfig = {
  managed: {
    label: 'Managed',
    color: 'hsl(var(--chart-1))',
  },
  selfService: {
    label: 'Self Service',
    color: 'hsl(var(--chart-2))',
  },
  unsold: {
    label: 'Unsold',
    color: 'hsl(var(--chart-3))',
  },
  programmatic: {
    label: 'Programmatic',
    color: 'hsl(var(--chart-4))',
  },
};

// Badge for a fill rate against its proposition's target.
const getPerformanceBadgeVariant = (fillRate: string, target: number = FILL_RATE_TARGETS.all): BadgeVariant =>
  fillVariant(parseFloat(fillRate.replace('%', '')), target);

export const YieldDashboard: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const db = useDb();
    const [selectedMetric, setSelectedMetric] = useState<string | null>('general-fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
      const year = businessYear();
      return { from: dateOf(year.from), to: dateOf(year.to) };
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);

    // Filter states
    const [engineFilter, setEngineFilter] = useState<string | undefined>('all');
    const [retailMediaProductFilter, setRetailMediaProductFilter] = useState<string | undefined>('all');
    const [adSpaceFilter, setAdSpaceFilter] = useState<string | undefined>('all');
    const [channelFilter, setChannelFilter] = useState<string | undefined>('all');

    // The period and the inventory over it — one model for every report below.
    const { from, to } = rangeOf(dateRange, businessYear());
    const model = useMemo(() => buildYieldModel(db, from, to), [db, from, to]);

    // The filters narrow the hierarchy: proposition → media product → placement.
    const engine = engineFilter && engineFilter !== 'all' ? (engineFilter as EngineId) : undefined;
    const product = db.mediaProducts.find((m) => m.id === retailMediaProductFilter && (!engine || m.engine === engine));
    const placement = db.placements.find((p) => p.id === adSpaceFilter && (product ? inProduct(db, p.id, product.id) : !engine || groupOf(db, p)?.engine === engine));
    const filter: YieldFilter = { engine, productId: product?.id, placementId: placement?.id };
    const channel = channelFilter && channelFilter !== 'all' ? (channelFilter as Channel) : undefined;
    const inScope = useMemo(() => scopedPositions(model, filter), [model, filter.engine, filter.productId, filter.placementId]);

    const productOptions = db.mediaProducts.filter((m) => !engine || m.engine === engine);
    const placementOptions = db.placements.filter((p) => (product ? inProduct(db, p.id, product.id) : productOptions.some((m) => inProduct(db, p.id, m.id))));

    // Get filtered data based on current filter selections
    const filteredFillRateMetrics = fillRateCards(inScope, engine);

    // Reset selected metric if it's not available in filtered results, fallback to the first card
    const isSelectedMetricValid = selectedMetric ? filteredFillRateMetrics.some(metric => metric.id === selectedMetric) : false;
    const validSelectedMetric = isSelectedMetricValid ? selectedMetric! : filteredFillRateMetrics[0]?.id ?? 'general-fill-rate';
    const selectedMetricData = filteredFillRateMetrics.find(metric => metric.id === validSelectedMetric) || filteredFillRateMetrics[0];

    // Get chart data based on selection and filters
    const fillRateChartData = fillTrend(model, inScope, validSelectedMetric);
    const seasonalityData = seasonalitySeries(db, model, engine ?? product?.engine, product?.id);
    const filteredInventoryData = inventoryByEngine(inScope, channel);
    const priceRanking = priceIndexRanking(db, model, inScope);
    const revenueReportMetrics = revenueCards(db, model, inScope, filter);
    const revenueChartData = revenueTrend(db, model, inScope, filter);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: "Yield Overview",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="space-y-6">
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                <div>
                  <label className="block text-sm font-medium mb-2">Engine</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Engines', value: 'all' },
                      ...ENGINES.map((e) => ({ label: ENGINE_LABEL[e], value: e })),
                    ]}
                    value={engineFilter}
                    onChange={setEngineFilter}
                    placeholder="Select engine"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Media Product</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Products', value: 'all' },
                      ...productOptions.map((m) => ({ label: m.name, value: m.id })),
                    ]}
                    value={product ? retailMediaProductFilter : 'all'}
                    onChange={setRetailMediaProductFilter}
                    placeholder="Select media product"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Placement</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Placements', value: 'all' },
                      ...placementOptions.map((p) => ({
                        label: product ? p.name : `${groupOf(db, p)?.name ?? ''} · ${p.name}`,
                        value: p.id,
                      })),
                    ]}
                    value={placement ? adSpaceFilter : 'all'}
                    onChange={setAdSpaceFilter}
                    placeholder="Select placement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Channel</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Channels', value: 'all' },
                      ...CHANNELS.map((c) => ({ label: CHANNEL_LABEL[c], value: c })),
                    ]}
                    value={channelFilter}
                    onChange={setChannelFilter}
                    placeholder="Select channel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fill Rate Report */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fill Rate Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-row">
                {filteredFillRateMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={validSelectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                  {selectedMetricData ? `${selectedMetricData.label} Fill Rate Trend` : 'Fill Rate Trend'}
                </h4>
                <div className="w-full">
                  <LineChartComponent
                    data={fillRateChartData}
                    config={fillRateChartConfig}
                    xAxisDataKey="name"
                    className="h-[300px] w-full"
                  />
                </div>
              </div>
              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Fill Rate Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>


          {/* Seasonality Report */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Seasonality Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Seasonality Index by Week</h4>
                <div className="w-full">
                  <BarChartComponent
                    data={seasonalityData}
                    config={seasonalityChartConfig}
                    xAxisDataKey="name"
                    className="h-[300px] w-full"
                  />
                </div>
              </div>
              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Seasonality Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Channel and Retail Media Product Reports - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-row">
            {/* Inventory Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Inventory Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Inventory Distribution by Engine</h4>
                  <div className="w-full">
                    <BarChartComponent
                      data={filteredInventoryData}
                      config={channelChartConfig}
                      xAxisDataKey="engine"
                      className="h-[350px] w-full"
                      stacked={true}
                      showLegend={true}
                    />
                  </div>
                </div>
                {/* CTA Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => console.log('Navigate to full Inventory Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Retail Media Product Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Retail Media Product Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top 5 Best Performing Products</h4>
                    <div className="w-full">
                      <BarChartComponent
                        data={priceRanking.best}
                        config={marketIndexChartConfig}
                        xAxisDataKey="product"
                        className="h-[200px] w-full"
                        horizontal={true}
                        stacked={true}
                        showLegend={true}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top 5 Worst Performing Products</h4>
                    <div className="w-full">
                      <BarChartComponent
                        data={priceRanking.worst}
                        config={marketIndexChartConfig}
                        xAxisDataKey="product"
                        className="h-[200px] w-full"
                        horizontal={true}
                        stacked={true}
                        showLegend={true}
                      />
                    </div>
                  </div>
                </div>
                {/* CTA Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => console.log('Navigate to full Retail Media Product Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Report - Full Width Below */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-row">
                {revenueReportMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={false}
                  />
                ))}
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Revenue Trend</h4>
                <div className="w-full">
                  <LineChartComponent
                    data={revenueChartData}
                    config={revenueChartConfig}
                    xAxisDataKey="name"
                    className="h-[250px] w-full"
                  />
                </div>
              </div>
              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Revenue Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const SponsoredProductsYield: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(), // today
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    const [activeTab, setActiveTab] = useState('positions');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const yieldData = useEngineYield('sponsored-products', dateRange);
    const selectedMetricData = yieldData.metrics.find(metric => metric.id === selectedMetric);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: "Sponsored Products Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                {yieldData.metrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={yieldData.chartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Positions and Media Products Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'positions', label: 'Positions' },
                  { value: 'media-products', label: 'Media Products' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="positions" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={yieldData.positions}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to position details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="media-products" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={yieldData.media}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to media product details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const DisplayYield: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(), // today
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    const [activeTab, setActiveTab] = useState('positions');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const yieldData = useEngineYield('display', dateRange);
    const selectedMetricData = yieldData.metrics.find(metric => metric.id === selectedMetric);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: "Display Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                {yieldData.metrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={yieldData.chartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Positions and Media Products Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'positions', label: 'Positions' },
                  { value: 'media-products', label: 'Media Products' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="positions" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={yieldData.positions}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to position details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="media-products" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={yieldData.media}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to media product details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const DigitalInstoreYield: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(), // today
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    const [activeTab, setActiveTab] = useState('stores');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const yieldData = useEngineYield('digital-instore', dateRange);
    const selectedMetricData = yieldData.metrics.find(metric => metric.id === selectedMetric);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: "Digital In-store Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                {yieldData.metrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={yieldData.chartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stores and Players Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'stores', label: 'Stores' },
                  { value: 'players', label: 'Players' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="stores" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={yieldData.positions}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to store details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="players" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={yieldData.media}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to player details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const OfflineInstoreYield: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(), // today
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    const [activeTab, setActiveTab] = useState('positions');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const yieldData = useEngineYield('offline-instore', dateRange);
    const selectedMetricData = yieldData.metrics.find(metric => metric.id === selectedMetric);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: "Offline In-store Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                {yieldData.metrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={yieldData.chartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Positions and Media Products Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'positions', label: 'Positions' },
                  { value: 'media-products', label: 'Media Products' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="positions" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={yieldData.positions}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to position details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="media-products" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={yieldData.media}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to media product details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};
// ── Yield reports: rows per AH hierarchy ────────────────────────────────

/** What a report row is about, so the filter bar can narrow it. */
interface ReportKeys {
  id: string;
  _engine: EngineId;
  _productId: string;
  _placementIds: string[];
  _channels: Channel[];
}

/** The channels a position (or a product) was sold through, plus unsold
 *  when capacity is left. */
const channelsOf = (s: Stock): Channel[] =>
  CHANNELS.filter((c) => (c === 'unsold' ? s.available > 0 : s.channels[c] > 0));
const channelText = (cs: Channel[]) => cs.map((c) => CHANNEL_LABEL[c]).join(', ') || '—';

function performanceLabel(t: Totals, engine: EngineId): string {
  if (!t.spend) return 'No delivery';
  const r = ratesOf(t).roas / BENCHMARKS[engine].roas;
  return r >= 1.2 ? 'Excellent' : r >= 1 ? 'Good' : r >= 0.8 ? 'Average' : r >= 0.5 ? 'Below Average' : 'Poor';
}

function buildYieldReports(db: DbData, model: YieldModel) {
  const scope = { from: model.from, to: model.to };
  const byPosition = new Map(breakdown(db, scope, 'position').map((r) => [r.id, r.totals]));
  const products = db.mediaProducts.filter((m) => model.positions.some((p) => p.product.id === m.id));
  const positionsOf = (productId: string) => model.positions.filter((p) => p.product.id === productId);
  const keysOf = (p: PositionYield): Omit<ReportKeys, 'id'> => ({
    _engine: p.engine,
    _productId: p.product.id,
    _placementIds: [p.position.placementId],
    _channels: channelsOf(p.stock),
  });
  const productKeys = (m: MediaProduct, channels: Channel[]): Omit<ReportKeys, 'id'> => ({
    _engine: m.engine,
    _productId: m.id,
    _placementIds: placementsOf(db, m.id).map((pl) => pl.id),
    _channels: channels,
  });

  // Fill rate: one row per position.
  const fillRate = model.positions.map((p) => {
    const t = byPosition.get(p.position.id) ?? EMPTY;
    return {
      id: p.position.id,
      ...keysOf(p),
      engine: ENGINE_LABEL[p.engine],
      mediaProduct: p.product.name,
      placement: p.placement?.name ?? '—',
      position: p.position.name,
      channel: channelText(channelsOf(p.stock).filter((c) => c !== 'unsold')),
      fillRate: pct(fillOf(p.stock)),
      target: FILL_RATE_TARGETS[p.engine],
      revenue: eur(t.spend),
      impressions: int(t.impressions),
      clicks: int(t.clicks),
      ctr: pct(ratesOf(t).ctr, 2),
    };
  });

  // Seasonality: each season or retail moment, per media product it prices —
  // its index and price, and how the product sold in those weeks against the
  // selected period.
  const seasonality = products.flatMap((m) => {
    const base = stockOf(positionsOf(m.id));
    const baseFill = fillOf(base);
    const baseRevenuePerWeek = base.revenue / Math.max(1, model.mondays.length);
    return retailMomentsFor(db, m.engine)
      .filter((r) => !r.mediaProductIds?.length || r.mediaProductIds.includes(m.id))
      .map((r) => {
        const weeks = mondaysBetween(r.from!, r.to!).map((w) => productWeek(db, m, w));
        const win = weeks.reduce(addWeek, emptyStock());
        const winFill = fillOf(win);
        const winRevenuePerWeek = win.revenue / Math.max(1, weeks.length);
        const price = priceFor(db, m, { from: r.from, to: r.to });
        return {
          id: `${r.id}-${m.id}`,
          ...productKeys(m, channelsOf(win)),
          engine: ENGINE_LABEL[m.engine],
          mediaProduct: m.name,
          moment: r.name,
          week: `Wk ${weekNumberOf(r.from!)}–${weekNumberOf(r.to!)}`,
          month: monthSpan(r.from!, r.to!),
          seasonalityIndex: Math.round(r.index * 100),
          demandMultiplier: baseFill > 0 ? `${(winFill / baseFill).toFixed(2)}x` : '—',
          priceMultiplier: price && price.listPrice ? `${(price.price / price.listPrice).toFixed(2)}x` : '—',
          fillRateImpact: signed((winFill - baseFill) * 100, 1, ' pts'),
          revenueImpact: baseRevenuePerWeek > 0 ? signed((winRevenuePerWeek / baseRevenuePerWeek - 1) * 100, 0) : '—',
        };
      });
  });

  // Inventory: each media product by how its capacity was sold.
  const inventory = products.flatMap((m) => {
    const list = positionsOf(m.id);
    const s = stockOf(list);
    const fill = fillOf(s);
    return CHANNELS.filter((c) => channelShare(s, c) > 0 || c === 'unsold').map((c) => {
      const bookingIds = c === 'unsold' ? [] : [...model.channelOf].filter(([, ch]) => ch === c).map(([id]) => id);
      const t = c === 'unsold' ? EMPTY : totalsFor(db, { ...scope, mediaProductIds: [m.id], bookingIds });
      const filled = list.filter((p) => (c === 'unsold' ? p.stock.available > 0 : p.stock.channels[c] > 0)).length;
      return {
        id: `${m.id}-${c}`,
        ...productKeys(m, [c]),
        engine: ENGINE_LABEL[m.engine],
        mediaProduct: m.name,
        channel: CHANNEL_LABEL[c],
        inventoryShare: pct(channelShare(s, c)),
        totalPositions: list.length,
        filledPositions: filled,
        revenue: eur(t.spend),
        avgCPM: t.impressions > 0 ? eurCents(ratesOf(t).cpm) : '—',
        utilizationRate: pct(fill),
      };
    });
  });

  // Media product pricing: each position's price over the period, built up
  // from its list price by the pricing rules, and how it delivered.
  const mediaProducts = model.positions.map((p) => {
    const t = byPosition.get(p.position.id) ?? EMPTY;
    const a = priceAnatomy(db, p.position, model, fillOf(p.stock));
    return {
      id: p.position.id,
      ...keysOf(p),
      mediaProduct: p.product.name,
      engine: ENGINE_LABEL[p.engine],
      channel: channelText(channelsOf(p.stock).filter((c) => c !== 'unsold')),
      placement: `${p.placement?.name ?? '—'} · ${p.position.name}`,
      listPrice: a ? priceLabel(a.listPrice, a.basis) : '—',
      seasonality: a ? signed(a.delta.seasonality * 100, 0) : '—',
      marketIndex: a ? signed(a.delta.marketIndex * 100, 0) : '—',
      discount: a ? signed(a.delta.discount * 100, 0) : '—',
      finalPrice: a ? priceLabel(a.price, a.basis) : '—',
      performance: performanceLabel(t, p.engine),
      revenue: eur(t.spend),
      impressions: int(t.impressions),
      ctr: pct(ratesOf(t).ctr, 2),
    };
  });

  // Revenue: each media product per month — delivered against booked.
  const months = bucketsOf(model, 'month');
  const revenue = products.flatMap((m) => {
    const list = positionsOf(m.id);
    return months.flatMap((b, mi) => {
      const s = emptyStock();
      const bookings = new Set<string>();
      for (const p of list) for (const i of b.weekIdx) { addWeek(s, p.weeks[i]); p.weeks[i].bookings.forEach((x) => bookings.add(x.id)); }
      // The period's first and last months run to its own ends.
      const monthFrom = mi === 0 ? model.from : `${b.key}-01`;
      const monthTo = mi === months.length - 1 ? model.to : lastDayOfMonth(b.key);
      const t = totalsFor(db, { from: monthFrom, to: monthTo, mediaProductIds: [m.id] });
      if (!s.revenue && !t.spend) return [];
      const channels = CHANNELS.filter((c) => [...bookings].some((id) => model.channelOf.get(id) === c));
      return [{
        id: `${m.id}-${b.key}`,
        ...productKeys(m, channels),
        engine: ENGINE_LABEL[m.engine],
        mediaProduct: m.name,
        channel: channelText(channels),
        month: `${MONTH_LONG[Number(b.key.slice(5, 7)) - 1]} ${b.key.slice(0, 4)}`,
        totalRevenue: eur(t.spend),
        bookedRevenue: eur(s.revenue),
        variance: s.revenue > 0 ? signed((t.spend / s.revenue - 1) * 100) : '—',
        avgCPM: t.impressions > 0 ? eurCents(ratesOf(t).cpm) : '—',
        fillRate: pct(fillOf(s)),
        impressions: int(t.impressions),
        clicks: int(t.clicks),
        ctr: pct(ratesOf(t).ctr, 2),
      }];
    });
  });

  return { fillRate, seasonality, inventory, mediaProducts, revenue };
}

export const YieldReportView: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const db = useDb();
    // Filter states
    const [engineFilter, setEngineFilter] = useState<string[]>([]);
    const [retailMediaProductFilter, setRetailMediaProductFilter] = useState<string[]>([]);
    const [adSpaceFilter, setAdSpaceFilter] = useState<string[]>([]);
    const [channelFilter, setChannelFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState('fill-rate-report');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(),
    });

    // Filter options: the propositions, channels and AH hierarchy in the db.
    const engineOptions = ENGINES.map((e) => ({ label: ENGINE_LABEL[e], value: e }));
    const channelOptions = CHANNELS.map((c) => ({ label: CHANNEL_LABEL[c], value: c }));
    const retailMediaProductOptions = db.mediaProducts
      .filter((m) => !engineFilter.length || engineFilter.includes(m.engine))
      .map((m) => ({ label: m.name, value: m.id }));
    const adSpaceOptions = db.placements
      .filter((pl) => retailMediaProductOptions.some((o) => inProduct(db, pl.id, o.value)) && (!retailMediaProductFilter.length || retailMediaProductFilter.some((id) => inProduct(db, pl.id, id))))
      .map((pl) => ({ label: `${groupOf(db, pl)?.name ?? ''} · ${pl.name}`, value: pl.id }));

    const fallback = defaultFrame();
    const { from, to } = rangeOf(dateRange, fallback);
    const reports = useMemo(() => buildYieldReports(db, buildYieldModel(db, from, to)), [db, from, to]);

    // Every report narrows the same way: proposition, channel, media product,
    // placement and a free-text search over what the row shows.
    const narrow = <T extends ReportKeys>(rows: T[], useChannel = true, usePlacement = true): T[] => {
      const q = searchValue.trim().toLowerCase();
      return rows.filter((r) =>
        (!engineFilter.length || engineFilter.includes(r._engine))
        && (!useChannel || !channelFilter.length || r._channels.some((c) => channelFilter.includes(c)))
        && (!retailMediaProductFilter.length || retailMediaProductFilter.includes(r._productId))
        && (!usePlacement || !adSpaceFilter.length || r._placementIds.some((id) => adSpaceFilter.includes(id)))
        && (!q || Object.entries(r).some(([k, v]) => !k.startsWith('_') && typeof v === 'string' && v.toLowerCase().includes(q))));
    };

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
          user={{
            name: 'John Doe',
              avatar: '/placeholder-avatar.jpg',
          }}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: "Yield Reports",
            subtitle: "Comprehensive view of all yield performance reports",
            headerRight: (
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="Pick a date range"
                showPresets={true}
              />
            ),
          }}
        >
          <div className="space-y-6">
            <CardWithTabs
              tabs={[
                {
                  value: 'fill-rate-report',
                  label: 'Fill Rate Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Media Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                            {
                              name: "Placement",
                              options: adSpaceOptions,
                              selectedValues: adSpaceFilter,
                              onChange: setAdSpaceFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search fill rate data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine' },
                          { key: 'mediaProduct', header: 'Media Product' },
                          { key: 'placement', header: 'Placement' },
                          { key: 'position', header: 'Position' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                            <Badge variant={getPerformanceBadgeVariant(row.fillRate, row.target)}>
                              {row.fillRate}
                            </Badge>
                          )},
                          { key: 'revenue', header: 'Revenue' },
                          { key: 'impressions', header: 'Impressions' },
                          { key: 'clicks', header: 'Clicks' },
                          { key: 'ctr', header: 'CTR' },
                        ]}
                        data={narrow(reports.fillRate)}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                        onRowClick={(row) => console.log('Navigate to details for', row.position)}
                      />
                    </div>
                  )
                },
                {
                  value: 'seasonality-report',
                  label: 'Seasonality Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Media Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search seasonality data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine' },
                          { key: 'mediaProduct', header: 'Media Product' },
                          { key: 'moment', header: 'Season / Moment' },
                          { key: 'week', header: 'Week' },
                          { key: 'month', header: 'Month' },
                          { key: 'seasonalityIndex', header: 'Seasonality Index' },
                          { key: 'demandMultiplier', header: 'Demand Multiplier' },
                          { key: 'priceMultiplier', header: 'Price Multiplier' },
                          { key: 'fillRateImpact', header: 'Fill Rate Impact' },
                          { key: 'revenueImpact', header: 'Revenue Impact' },
                        ]}
                        data={narrow(reports.seasonality, false, false)}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                        onRowClick={(row) => console.log('Navigate to seasonality details for', row.mediaProduct, row.week)}
                      />
                    </div>
                  )
                },
                {
                  value: 'inventory-report',
                  label: 'Inventory Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Media Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search inventory data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine' },
                          { key: 'mediaProduct', header: 'Media Product' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'inventoryShare', header: 'Inventory Share %' },
                          { key: 'totalPositions', header: 'Total Positions' },
                          { key: 'filledPositions', header: 'Filled Positions' },
                          { key: 'revenue', header: 'Revenue' },
                          { key: 'avgCPM', header: 'Avg CPM' },
                          { key: 'utilizationRate', header: 'Utilization Rate' },
                        ]}
                        data={narrow(reports.inventory, true, false)}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                        onRowClick={(row) => console.log('Navigate to inventory details for', row.engine, row.mediaProduct)}
                      />
                    </div>
                  )
                },
                {
                  value: 'retail-media-product-report',
                  label: 'Retail Media Product Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Media Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                            {
                              name: "Placement",
                              options: adSpaceOptions,
                              selectedValues: adSpaceFilter,
                              onChange: setAdSpaceFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search retail media products..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'mediaProduct', header: 'Media Product' },
                          { key: 'engine', header: 'Engine' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'placement', header: 'Placement · Position' },
                          { key: 'listPrice', header: 'List Price' },
                          { key: 'seasonality', header: 'Seasonality' },
                          { key: 'marketIndex', header: 'Market Index' },
                          { key: 'discount', header: 'Discount' },
                          { key: 'finalPrice', header: 'Final Price' },
                          { key: 'performance', header: 'Performance' },
                          { key: 'revenue', header: 'Revenue' },
                          { key: 'impressions', header: 'Impressions' },
                          { key: 'ctr', header: 'CTR' },
                        ]}
                        data={narrow(reports.mediaProducts)}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                        onRowClick={(row) => console.log('Navigate to product details for', row.mediaProduct)}
                      />
                    </div>
                  )
                },
                {
                  value: 'revenue-report',
                  label: 'Revenue Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Media Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search revenue data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine' },
                          { key: 'mediaProduct', header: 'Media Product' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'month', header: 'Month' },
                          { key: 'totalRevenue', header: 'Total Revenue' },
                          { key: 'bookedRevenue', header: 'Booked Revenue' },
                          { key: 'variance', header: 'Variance' },
                          { key: 'avgCPM', header: 'Avg CPM' },
                          { key: 'fillRate', header: 'Fill Rate' },
                          { key: 'impressions', header: 'Impressions' },
                          { key: 'clicks', header: 'Clicks' },
                          { key: 'ctr', header: 'CTR' },
                        ]}
                        data={narrow(reports.revenue, true, false)}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                        onRowClick={(row) => console.log('Navigate to revenue details for', row.engine, row.mediaProduct)}
                      />
                    </div>
                  )
                },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
