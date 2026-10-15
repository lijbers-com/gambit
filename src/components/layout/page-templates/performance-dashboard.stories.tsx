import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Badge } from '@/components/ui/badge';
import { AreaChartComponent } from '@/components/ui/area-chart';
import type { EngineId } from '@/lib/db';
import { PROPOSITION_PATTERNS, PropositionSwatch } from '@/lib/proposition-patterns';
import { propositionColor } from '@/lib/proposition-colors';
import type { ChartConfig } from '@/components/ui/chart-types';

/** Bottom-to-top / declaration order for a proposition split — the same
 *  order the funnel's bands and the pattern system use. */
const ENGINE_ORDER = Object.keys(PROPOSITION_PATTERNS) as EngineId[];
import { BarChartComponent } from '@/components/ui/bar-chart';
import { ConversionFunnelComponent } from '@/components/ui/conversion-funnel';
import { LineChartComponent } from '@/components/ui/line-chart';
import { ChartFrame } from '@/components/ui/chart-frame';
import { MapChart } from '@/components/ui/map-chart';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { RadarChartComponent } from '@/components/ui/radar-chart';
import { FunnelChartComponent } from '@/components/ui/funnel-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { FilterBar } from '@/components/ui/filter-bar';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { Eye, MousePointer, ShoppingCart, Heart, MoreHorizontal, ChevronDown, ChevronUp, Settings2, Plus, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { MetricRow, type MetricDefinition } from '@/components/ui/metric-row';
import { SessionDateRange } from '@/components/ui/session-date-range';
import { CardInsightList, type CardInsight } from '@/components/ui/insights-notifications';
import { volumePacingCase, buyerMixCase, budgetRecommendationCase } from '@/lib/case-templates';
import { Label } from '@/components/ui/label';
import { prototypeToday, PROTOTYPE_TODAY } from '@/lib/clock';
import { useDb } from '@/lib/db';
import type { DbData } from '@/lib/db';
import {
  BENCHMARKS,
  EMPTY,
  add,
  breakdown,
  bookingsIn,
  previousPeriod,
  ratesOf,
  seriesFor,
  totalsFor,
  type BreakdownRow,
  type Grain,
  type PerformanceScope,
  type Totals,
} from '@/lib/db/performance';
import { fmtEuro, fmtCount } from '@/lib/proposition-metrics';
import { useSessionFilters } from '@/lib/session-filters';

// ── Insights data ───────────────────────────────────────────────────────
//
// Every number on the routed insights pages (/insights → FunnelView,
// /insights/report → ProductReportView) comes from the performance model
// (lib/db/performance.ts) over the prototype database: the sum of the
// bookings in scope, delivered up to the prototype's today. A filter
// narrows the scope; nothing is rescaled or seeded per page.
//
// The constants below are the only figures this file adds — each a
// stand-in until the data behind it reports. Change them here, never inline.

/** Buyers per purchase: some purchases are the same shopper buying again.
 *  The same 0.85 the performance model counts new-to-brand buyers from. */
const BUYERS_PER_CONVERSION = 0.85;
/** Of the buyers who are not new to the brand, the share won back after
 *  lapsing; the rest are existing buyers. Stand-in until the loyalty card
 *  splits returning buyers. */
const LAPSED_SHARE_OF_RETURNING = 0.4;
/** Add-to-carts per click on the product page. Stand-in until the site's
 *  basket events report. */
const ADD_TO_CART_PER_CLICK = 0.2;
/** Share of a proposition's spend a budget recommendation suggests moving. */
const SHIFT_SHARE = 0.1;
/** The insights pages' default window: the year so far, to the prototype's today. */
const INSIGHTS_FROM = `${PROTOTYPE_TODAY.slice(0, 4)}-01-01`;

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 86_400_000;
const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS) + 1;

/** Who bought: new to the brand from the model, the rest split by the
 *  fixed lapsed share above. */
function buyerSplit(t: Totals) {
  const buyers = t.conversions * BUYERS_PER_CONVERSION;
  const newToBrand = Math.min(buyers, t.newToBrandBuyers);
  const returning = buyers - newToBrand;
  return {
    buyers,
    newToBrand,
    lapsed: returning * LAPSED_SHARE_OF_RETURNING,
    existing: returning * (1 - LAPSED_SHARE_OF_RETURNING),
  };
}

/** The session's date range, clamped to what has delivered; the year so
 *  far when none is set. */
function insightsWindow(f: { dateFrom?: string; dateTo?: string }): { from: string; to: string } {
  const to = f.dateTo && f.dateTo < PROTOTYPE_TODAY ? f.dateTo : PROTOTYPE_TODAY;
  const from = f.dateFrom ?? INSIGHTS_FROM;
  return { from: from <= to ? from : to, to };
}

/** Months for a long window, weeks for a quarter, days for a month. */
function grainFor(from: string, to: string): Grain {
  const days = daysBetween(from, to);
  return days <= 31 ? 'day' : days <= 120 ? 'week' : 'month';
}

/** "Mar – May 2026" — a campaign's run, for a filter option. */
function runLabel(start: string, end: string): string {
  const m = (iso: string) => MONTH_SHORT[Number(iso.slice(5, 7)) - 1];
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  if (sameYear && start.slice(5, 7) === end.slice(5, 7)) return `${m(start)} ${start.slice(0, 4)}`;
  return sameYear ? `${m(start)} – ${m(end)} ${end.slice(0, 4)}` : `${m(start)} ${start.slice(0, 4)} – ${m(end)} ${end.slice(0, 4)}`;
}

/** What the scope's bookings should have spent inside the window at an even
 *  pace — the plan a pacing figure compares delivery with. */
function plannedSpendInWindow(db: DbData, scope: PerformanceScope): number {
  const end = scope.to ?? PROTOTYPE_TODAY;
  return bookingsIn(db, scope).reduce((sum, b) => {
    const from = scope.from && scope.from > b.startDate ? scope.from : b.startDate;
    const to = end < b.endDate ? end : b.endDate;
    if (to < from) return sum;
    return sum + (b.budget * daysBetween(from, to)) / Math.max(1, daysBetween(b.startDate, b.endDate));
  }, 0);
}

/** The scope's totals per proposition; propositions without bookings read empty. */
function totalsByEngine(db: DbData, scope: PerformanceScope): Record<EngineId, Totals> {
  const rows = breakdown(db, scope, 'engine');
  return Object.fromEntries(
    ENGINE_ORDER.map((e) => [e, rows.find((r) => r.id === e)?.totals ?? EMPTY]),
  ) as Record<EngineId, Totals>;
}

/** Breakdowns of several scopes (one per selected proposition) as one. */
function mergeRows(lists: BreakdownRow[][]): BreakdownRow[] {
  const out = new Map<string, BreakdownRow>();
  for (const list of lists) for (const r of list) {
    const cur = out.get(r.id);
    out.set(r.id, cur ? { ...cur, totals: add(cur.totals, r.totals) } : r);
  }
  return [...out.values()];
}

/** "+12%" vs. the period before; nothing when the period before had none. */
function changeBadge(now: number, before: number | undefined, lowerIsBetter = false): Pick<MetricDefinition, 'badgeValue' | 'badgeVariant'> {
  if (before === undefined || before <= 0) return {};
  const d = Math.round(((now - before) / before) * 100);
  const up = d > 0;
  return { badgeValue: `${d > 0 ? '+' : ''}${d}%`, badgeVariant: d === 0 ? 'secondary' : up !== lowerIsBetter ? 'success' : 'warning' };
}

const pctOf = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;
const euro2 = (n: number) => `€${n.toFixed(2)}`;
const paceWords = (pct: number) => (pct >= 100 ? `pacing ${pct - 100}% ahead of plan` : `at ${pct}% of plan`);

/** The labels the funnel's cards use for each proposition. */
const FUNNEL_ENGINE_LABEL: Record<EngineId, string> = {
  'sponsored-products': 'Sponsored Products',
  display: 'Display',
  'digital-instore': 'Digital Media In-store',
  'offline-instore': 'Offline Media In-store',
  offsite: 'Display Offsite',
};

/** The labels the custom reports use for each proposition. */
const REPORT_ENGINE_LABEL: Record<EngineId, string> = {
  'sponsored-products': 'Sponsored Products',
  display: 'Display',
  'digital-instore': 'Digital In-store',
  'offline-instore': 'Offline In-store',
  offsite: 'Display Offsite',
};

/** A budget shift inside the plan spending most in scope: from the
 *  proposition doing worst on `score` to the one doing best. */
function budgetShift(
  db: DbData,
  scope: PerformanceScope,
  score: (t: Totals) => number,
  eligible: (t: Totals) => boolean = (t) => t.spend > 0,
) {
  const plan = breakdown(db, scope, 'mediaPlan')[0];
  if (!plan) return undefined;
  const rows = breakdown(db, { ...scope, mediaPlanId: plan.id }, 'engine').filter((r) => eligible(r.totals));
  if (rows.length < 2) return undefined;
  const sorted = [...rows].sort((a, b) => score(a.totals) - score(b.totals));
  const from = sorted[0];
  const to = sorted[sorted.length - 1];
  if (score(from.totals) === score(to.totals)) return undefined;
  const amount = Math.max(100, Math.round((from.totals.spend * SHIFT_SHARE) / 100) * 100);
  return {
    plan: plan.name,
    from: from.id as EngineId,
    to: to.id as EngineId,
    fromTotals: from.totals,
    toTotals: to.totals,
    amount: `€${amount.toLocaleString('en-GB')}`,
  };
}

/** A product row of the funnel's product charts: its sales, tagged with
 *  the proposition that sold most of it. */
type ProductSales = { id: string; name: string; value: number; engine: EngineId; color: string; spend: number };

function productSales(db: DbData, scope: PerformanceScope): ProductSales[] {
  return breakdown(db, scope, 'retailProduct')
    .map((r) => {
      const engines = breakdown(db, { ...scope, retailProductIds: [r.id] }, 'engine');
      const lead = [...engines].sort((a, b) => b.totals.sales - a.totals.sales)[0];
      const engine = (lead?.id ?? 'sponsored-products') as EngineId;
      return { id: r.id, name: r.name, value: Math.round(r.totals.sales), engine, color: propositionColor(engine), spend: r.totals.spend };
    })
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
}

/** The funnel cards' insights — template-built cases, every figure read
 *  from the same scope the cards above them plot. A case with nothing to
 *  say in scope (no delivery, one proposition) is left out. */
function funnelInsights(db: DbData, scope: PerformanceScope, products: ProductSales[]) {
  const t = totalsFor(db, scope);
  const by = totalsByEngine(db, scope);
  const engines = ENGINE_ORDER.filter((e) => by[e].spend > 0);
  const planned = plannedSpendInWindow(db, scope);
  const pace = planned > 0 ? t.spend / planned : 0;
  const pacePct = Math.round(pace * 100);
  const lead = (value: (x: Totals) => number) => [...engines].sort((a, b) => value(by[b]) - value(by[a]))[0];
  const ctxAll = `${engines.length > 1 ? 'All propositions' : engines.map((e) => FUNNEL_ENGINE_LABEL[e]).join('')} · this period`;

  const pacing = (id: string, unit: string, label: string, volume: number, top: EngineId | undefined, fmt: (n: number) => string): CardInsight | undefined => {
    if (!(pace > 0) || volume <= 0 || !top) return undefined;
    const target = volume / pace;
    return {
      id,
      kind: 'insight',
      subject: `${label} ${label.endsWith('s') ? 'are' : 'is'} ${paceWords(pacePct)}`,
      preview: `The period has delivered ${fmt(volume)} ${unit} against ${fmt(target)} planned to date — ${FUNNEL_ENGINE_LABEL[top]} carries the largest share.`,
      context: ctxAll,
      caseData: volumePacingCase({ delivered: fmt(volume), target: fmt(target), pacePct, topChannel: FUNNEL_ENGINE_LABEL[top], unit }),
    };
  };

  const shiftInsight = (
    id: string,
    score: (x: Totals) => number,
    fmt: (n: number) => string,
    metric: string | undefined,
    verb: string,
    eligible?: (x: Totals) => boolean,
  ): CardInsight | undefined => {
    const s = budgetShift(db, scope, score, eligible);
    if (!s) return undefined;
    const from = FUNNEL_ENGINE_LABEL[s.from];
    const to = FUNNEL_ENGINE_LABEL[s.to];
    return {
      id,
      kind: 'recommendation',
      subject: `Shift ${s.amount} from ${from.toLowerCase()} to ${to.toLowerCase()}`,
      preview: `${to} is ${verb} ${fmt(score(s.toTotals))} against ${from}'s ${fmt(score(s.fromTotals))} in this plan — the same spend can buy more there.`,
      context: s.plan,
      caseData: budgetRecommendationCase({ from, to, amount: s.amount, roasFrom: fmt(score(s.fromTotals)), roasTo: fmt(score(s.toTotals)), metric }),
    };
  };

  const roasOf = (x: Totals) => ratesOf(x).roas;
  const ctrOf = (x: Totals) => ratesOf(x).ctr;
  const conversionsPerK = (x: Totals) => (x.spend > 0 ? (x.conversions / x.spend) * 1000 : 0);
  const keep = (list: (CardInsight | undefined)[]) => list.filter((x): x is CardInsight => !!x);

  // CTR and ROAS hold to the propositions' own targets, weighted by spend.
  const weighted = (engs: EngineId[], k: 'ctr' | 'roas') => {
    const spend = engs.reduce((s, e) => s + by[e].spend, 0);
    return spend > 0 ? engs.reduce((s, e) => s + BENCHMARKS[e][k] * by[e].spend, 0) / spend : 0;
  };
  const clickEngines = (['sponsored-products', 'display'] as EngineId[]).filter((e) => by[e].impressions > 0);
  const ctrClicks = clickEngines.reduce((s, e) => s + by[e].clicks, 0);
  const ctrImps = clickEngines.reduce((s, e) => s + by[e].impressions, 0);
  const ctrNow = ctrImps > 0 ? ctrClicks / ctrImps : 0;
  const ctrTarget = weighted(clickEngines, 'ctr');
  const roasNow = ratesOf(t).roas;
  const roasTarget = weighted(engines, 'roas');

  const ctr: CardInsight[] = ctrNow > 0 && ctrTarget > 0 ? [{
    id: 'INS-ctr-pace',
    kind: 'insight',
    subject: `CTR is running ${Math.abs(Math.round((ctrNow / ctrTarget - 1) * 100))}% ${ctrNow >= ctrTarget ? 'ahead of' : 'behind'} target`,
    preview: `The period is running at ${pctOf(ctrNow, 1)} CTR against a ${pctOf(ctrTarget, 1)} target, weighted by each proposition's spend.`,
    context: clickEngines.map((e) => FUNNEL_ENGINE_LABEL[e]).join(' · '),
    caseData: volumePacingCase({ delivered: pctOf(ctrNow, 1), target: pctOf(ctrTarget, 1), pacePct: Math.round((ctrNow / ctrTarget) * 100), topChannel: FUNNEL_ENGINE_LABEL[clickEngines.reduce((a, b) => (ctrOf(by[b]) > ctrOf(by[a]) ? b : a))], unit: 'CTR' }),
  }] : [];

  const roas: CardInsight[] = roasNow > 0 && roasTarget > 0 ? [{
    id: 'INS-roas-pace',
    kind: 'insight',
    subject: `ROAS is running ${Math.abs(Math.round((roasNow / roasTarget - 1) * 100))}% ${roasNow >= roasTarget ? 'ahead of' : 'behind'} target`,
    preview: `The period is returning ${pctOf(roasNow)} against a ${pctOf(roasTarget)} target, weighted by each proposition's spend.`,
    context: engines.map((e) => FUNNEL_ENGINE_LABEL[e]).join(' · '),
    caseData: volumePacingCase({ delivered: pctOf(roasNow), target: pctOf(roasTarget), pacePct: Math.round((roasNow / roasTarget) * 100), topChannel: FUNNEL_ENGINE_LABEL[lead(roasOf)], unit: 'ROAS' }),
  }] : [];

  // Products — the best and the weakest sellers in scope.
  const top = products.slice(0, 5);
  const low = products.length > 1 ? products.slice(Math.max(1, products.length - 5)) : [];
  const topSum = top.reduce((s, p) => s + p.value, 0);
  const lowSum = low.reduce((s, p) => s + p.value, 0);
  const allSum = products.reduce((s, p) => s + p.value, 0);
  const best = products[0];
  const worst = products[products.length - 1];
  const topProducts: CardInsight[] = best ? [{
    id: 'INS-products-lead',
    kind: 'insight',
    subject: `${best.name} carries ${Math.round((best.value / Math.max(1, allSum)) * 100)}% of product sales`,
    preview: `The top ${top.length} products brought in ${fmtEuro(topSum)} in the period — ${best.name} alone ${fmtEuro(best.value)}, the largest share of any product.`,
    context: `${[...new Set(top.map((p) => FUNNEL_ENGINE_LABEL[p.engine]))].join(' · ')} · this period`,
    caseData: volumePacingCase({ delivered: fmtEuro(topSum), target: fmtEuro(pace > 0 ? topSum / pace : topSum), pacePct, topChannel: best.name, unit: 'product revenue' }),
  }] : [];
  const lowProducts: CardInsight[] = low.length && worst && best && worst.id !== best.id ? [
    {
      id: 'INS-products-tail',
      kind: 'insight',
      subject: `${low.length} product${low.length === 1 ? '' : 's'} sold ${fmtEuro(Math.max(...low.map((p) => p.value)))} or less each`,
      preview: `The bottom ${low.length} made ${fmtEuro(lowSum)} together — ${Math.round((lowSum / Math.max(1, topSum)) * 100)}% of what the top ${top.length} did — with ${worst.name} at ${fmtEuro(worst.value)} the weakest in scope.`,
      context: `${[...new Set(low.map((p) => FUNNEL_ENGINE_LABEL[p.engine]))].join(' · ')} · this period`,
      caseData: volumePacingCase({ delivered: fmtEuro(lowSum), target: fmtEuro(pace > 0 ? lowSum / pace : lowSum), pacePct, topChannel: worst.name, unit: 'product revenue' }),
    },
    {
      id: 'INS-products-drop',
      kind: 'recommendation',
      subject: `Move ${fmtEuro(Math.max(100, Math.round(worst.spend / 100) * 100))} from ${worst.name} to ${best.name}`,
      preview: `${worst.name} returned ${fmtEuro(worst.value)} on its placements; the same budget on your top product would ride one already selling ${fmtEuro(best.value)}.`,
      context: `${FUNNEL_ENGINE_LABEL[worst.engine]} · this period`,
      caseData: budgetRecommendationCase({ from: worst.name, to: best.name, amount: fmtEuro(Math.max(100, Math.round(worst.spend / 100) * 100)), roasFrom: fmtEuro(worst.value), roasTo: fmtEuro(best.value), metric: 'revenue' }),
    },
  ] : [];

  // Buyers.
  const split = buyerSplit(t);
  const newPct = split.buyers > 0 ? Math.round((split.newToBrand / split.buyers) * 100) : 0;
  const lapsedPct = split.buyers > 0 ? Math.round((split.lapsed / split.buyers) * 100) : 0;
  const existingPct = 100 - newPct - lapsedPct;
  const topCategory = (() => {
    const cats = new Map<string, number>();
    for (const p of products) {
      const cat = db.retailProducts.find((r) => r.id === p.id)?.category;
      if (cat) cats.set(cat, (cats.get(cat) ?? 0) + p.value);
    }
    return [...cats.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  })();
  const buyerEngine = lead((x) => buyerSplit(x).buyers);
  const buyerShare = (e: EngineId) => (split.buyers > 0 ? Math.round((buyerSplit(by[e]).buyers / split.buyers) * 100) : 0);
  const secondBuyerEngine = [...engines].sort((a, b) => buyerSplit(by[b]).buyers - buyerSplit(by[a]).buyers)[1];
  const screens = by['digital-instore'];
  const offline = by['offline-instore'];
  const newPerK = (x: Totals) => (x.spend > 0 ? (buyerSplit(x).newToBrand / x.spend) * 1000 : 0);

  const buyer: CardInsight[] = keep([
    split.buyers > 0 ? {
      id: 'INS-buyer-new',
      kind: 'insight',
      subject: `${newPct}% of buyers are new to the brand`,
      preview: `${newPct}% of buyers reached had never bought you before, against ${lapsedPct}% won back from lapsed and ${existingPct}% repeat buyers.`,
      context: `${engines.length > 1 ? 'All propositions' : FUNNEL_ENGINE_LABEL[engines[0]]}${topCategory ? ` · Category: ${topCategory.toLowerCase()}` : ''}`,
      caseData: buyerMixCase({ newToBrand: newPct, lapsed: lapsedPct, existing: existingPct, category: (topCategory ?? 'all categories').toLowerCase() }),
    } : undefined,
    screens.spend > 0 && offline.spend > 0 ? (() => {
      const s = newPerK(screens);
      const o = newPerK(offline);
      const ss = buyerSplit(screens);
      const pct = (n: number) => (ss.buyers > 0 ? Math.round((n / ss.buyers) * 100) : 0);
      return {
        id: 'INS-buyer-instore',
        kind: 'insight' as const,
        subject: `In-store screens recruit ${s >= o ? (s / Math.max(o, 1e-9)).toFixed(1) + '×' : Math.round((s / Math.max(o, 1e-9)) * 100) + '% of'} the new buyers per euro`,
        preview: `Digital in-store wins ${s.toFixed(1)} new-to-brand buyers per €1K against ${o.toFixed(1)} for offline in-store media.`,
        context: 'Digital in-store · Offline in-store · this period',
        caseData: buyerMixCase({ newToBrand: pct(ss.newToBrand), lapsed: pct(ss.lapsed), existing: 100 - pct(ss.newToBrand) - pct(ss.lapsed), category: 'in-store screens' }),
      };
    })() : undefined,
  ]);

  const buyerProposition: CardInsight[] = keep([
    buyerEngine && split.buyers > 0 ? {
      id: 'INS-buyers-lead',
      kind: 'insight',
      subject: `${FUNNEL_ENGINE_LABEL[buyerEngine]} wins ${buyerShare(buyerEngine)}% of buyers`,
      preview: `${FUNNEL_ENGINE_LABEL[buyerEngine]} won ${fmtCount(buyerSplit(by[buyerEngine]).buyers)} of the period's ${fmtCount(split.buyers)} buyers — ${buyerShare(buyerEngine)}%${secondBuyerEngine ? `, with ${FUNNEL_ENGINE_LABEL[secondBuyerEngine]} next at ${buyerShare(secondBuyerEngine)}%` : ''}.`,
      context: ctxAll,
      caseData: volumePacingCase({ delivered: fmtCount(buyerSplit(by[buyerEngine]).buyers), target: fmtCount(pace > 0 ? buyerSplit(by[buyerEngine]).buyers / pace : buyerSplit(by[buyerEngine]).buyers), pacePct, topChannel: FUNNEL_ENGINE_LABEL[buyerEngine], unit: 'buyers' }),
    } : undefined,
    shiftInsight('INS-buyers-shift', newPerK, (n) => `${n.toFixed(1)} per €1K`, 'new buyers', 'recruiting'),
  ]);

  return {
    volume: keep([
      pacing('INS-volume-pace', 'impressions', 'Impressions', t.impressions, lead((x) => x.impressions), fmtCount),
      shiftInsight('INS-volume-budget', roasOf, (n) => pctOf(n), undefined, 'returning'),
    ]),
    engagement: keep([
      pacing('INS-engagement-pace', 'clicks', 'Engagements', t.clicks, lead((x) => x.clicks), fmtCount),
      shiftInsight('INS-engagement-ctr', ctrOf, (n) => pctOf(n, 2), 'CTR', 'converting at', (x) => x.spend > 0 && x.clicks > 0),
    ]),
    units: keep([
      pacing('INS-units-pace', 'conversions', 'Conversions', t.conversions, lead((x) => x.conversions), fmtCount),
      shiftInsight('INS-units-cpa', conversionsPerK, (n) => `${n.toFixed(1)} per €1K`, 'conversions', 'winning'),
    ]),
    ctr,
    roas,
    topProducts,
    lowProducts,
    buyer,
    buyerProposition,
  };
}

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Insights Dashboard',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Insights Dashboard Page Template

The Insights Dashboard provides comprehensive performance analytics with interactive metric cards, dynamic charts, and detailed performance tables. It serves as the main analytics interface for campaign performance monitoring.

## Features

- **Interactive Metric Cards**: Clickable cards that change the chart view
- **Dynamic Chart Visualization**: Bar chart showing achieved vs planned performance
- **Tabbed Data Tables**: Switch between Bookings and Creatives performance data
- **Real-time Metrics**: Live performance indicators with percentage calculations
- **Responsive Design**: Adapts to different screen sizes seamlessly

## Layout Structure

### Top Metrics Cards (3-4 cards)
- **Repetitions**: Total campaign repetitions/impressions
- **Stores**: Number of stores reached
- **Performance**: Overall campaign performance percentage
- **Interactive**: Click cards to change chart focus

### Main Chart Area
- **Bar Chart**: Achieved vs Planned performance over time
- **Dynamic Data**: Chart changes based on selected metric card
- **Monthly View**: Performance data by month with dual-series visualization
- **Legend**: Clear distinction between Achieved and Planned metrics

### Bottom Table Section
- **Tabbed Interface**: Switch between Bookings and Creatives
- **Performance Metrics**: ID, Planned, Achieved, Performance %, Creative count
- **Sortable Data**: All columns support sorting
- **Badge Indicators**: Visual performance indicators

## Interactive Features

1. **Metric Card Selection**: Click any metric card to update the chart
2. **Chart Responsiveness**: Chart data updates based on selected metric
3. **Tab Navigation**: Easy switching between Bookings and Creatives data
4. **Performance Indicators**: Color-coded performance badges

## Data Structure

### Metric Cards
- **Value**: Large numeric display
- **Label**: Descriptive text
- **Color**: Visual indicator (blue for primary metrics)
- **Clickable**: Updates chart on selection

### Chart Data
- **Time Series**: Monthly performance data
- **Dual Series**: Achieved vs Planned comparison
- **Responsive**: Updates based on selected metric

### Table Data
- **ID**: Unique identifier
- **Name**: Line item or creative name
- **Planned**: Target performance value
- **Achieved**: Actual performance value
- **Performance**: Percentage calculation
- **Creative**: Associated creative count

## Usage

This template is ideal for:
- Campaign performance monitoring
- Performance analytics dashboards
- Executive reporting interfaces
- Media partner performance reviews
- Real-time campaign optimization

## Components Used

- AppLayout (navigation, user management, page header)
- Card (metric cards and main container)
- BarChart (performance visualization)
- Tabs (Bookings vs Creatives switching)
- Table (performance data display)
- Badge (performance indicators)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


// Mock data for performance metrics
const performanceMetrics = [
  { 
    id: 'repetitions', 
    label: 'Repetitions', 
    value: '4,058,317', 
    subMetric: 'CTR: 2.14%',
    badgeValue: '+8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'stores', 
    label: 'Stores', 
    value: '343', 
    subMetric: 'Coverage: 89%',
    badgeValue: '0%',
    badgeVariant: 'secondary' as const,
  },
  { 
    id: 'performance', 
    label: 'Performance', 
    value: '105.89%', 
    subMetric: 'CPC: €0.89',
    badgeValue: '-5%',
    badgeVariant: 'destructive' as const,
  },
  { 
    id: 'roas', 
    label: 'ROAS', 
    value: '324%', 
    subMetric: 'AOV: €78.50',
    badgeValue: '+12%',
    badgeVariant: 'success' as const,
  },
];

// Mock data for chart - showing daily campaign runtime performance
const getChartData = (selectedMetric: string, engineType?: string, timeRange: string = 'last-month', dateRange?: DateRange) => {
  const days = [];
  const today = prototypeToday();
  
  // If dateRange is provided, use it instead of timeRange
  if (dateRange?.from && dateRange?.to) {
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // If range is 1 day, show hourly data
    if (daysDiff === 1) {
      for (let i = 0; i < 24; i++) {
        const hour = new Date(startDate);
        hour.setHours(i);
        const hourLabel = hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        
        // Generate hourly patterns
        let baseAchieved = 100;
        let basePlanned = 95;
        
        // Peak hours (9 AM - 5 PM)
        if (i >= 9 && i <= 17) {
          baseAchieved *= 1.5;
          basePlanned *= 1.4;
        } else if (i >= 0 && i <= 6) {
          // Low activity at night
          baseAchieved *= 0.3;
          basePlanned *= 0.3;
        }
        
        // Add variance
        baseAchieved *= (0.85 + Math.random() * 0.3);
        basePlanned *= (0.95 + Math.random() * 0.1);
        
        days.push({
          day: hourLabel,
          achieved: Math.round(baseAchieved),
          planned: Math.round(basePlanned),
        });
      }
    } else {
      // Show daily data for date range
      for (let i = 0; i < daysDiff; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Generate realistic daily patterns
        let baseAchieved = 1000;
        let basePlanned = 950;
        
        // Weekend dips
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (isWeekend) {
          baseAchieved *= 0.7;
          basePlanned *= 0.7;
        }
        
        // Add variance
        baseAchieved *= (0.85 + Math.random() * 0.3);
        basePlanned *= (0.95 + Math.random() * 0.1);
        
        // Engine-specific patterns
        if (engineType === 'digital-instore') {
          baseAchieved *= 1.1;
        } else if (engineType === 'offline-instore' && isWeekend) {
          baseAchieved *= 1.4;
          basePlanned *= 1.3;
        } else if (engineType === 'display') {
          baseAchieved *= 1.05;
        }
        
        days.push({
          day: dayLabel,
          achieved: Math.round(baseAchieved),
          planned: Math.round(basePlanned),
        });
      }
    }
  } else {
    // Use timeRange logic (existing code)
    // Determine number of days based on time range
    let numDays = 30;
    let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    switch (timeRange) {
      case 'last-day':
        numDays = 1;
        // For last day, show hourly data
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(today);
          hour.setHours(hour.getHours() - i);
          const hourLabel = hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          
          // Generate hourly patterns
          let baseAchieved = 100;
          let basePlanned = 95;
          
          // Peak hours (9 AM - 5 PM)
          const currentHour = hour.getHours();
          if (currentHour >= 9 && currentHour <= 17) {
            baseAchieved *= 1.5;
            basePlanned *= 1.4;
          } else if (currentHour >= 0 && currentHour <= 6) {
            // Low activity at night
            baseAchieved *= 0.3;
            basePlanned *= 0.3;
          }
          
          // Add variance
          baseAchieved *= (0.85 + Math.random() * 0.3);
          basePlanned *= (0.95 + Math.random() * 0.1);
          
          days.push({
            day: hourLabel,
            achieved: Math.round(baseAchieved),
            planned: Math.round(basePlanned),
          });
        }
        break;
        
      case 'last-week':
        numDays = 7;
        dateFormat = { weekday: 'short', month: 'short', day: 'numeric' };
        break;
        
      case 'last-month':
      default:
        numDays = 30;
        break;
    }
  
    // Generate daily data for week and month views
    if (timeRange !== 'last-day') {
      for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayLabel = date.toLocaleDateString('en-US', dateFormat);
        
        // Generate realistic daily patterns based on metric and engine type
        let baseAchieved = 1000;
        let basePlanned = 950;
        
        // Weekend dips
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (isWeekend) {
          baseAchieved *= 0.7;
          basePlanned *= 0.7;
        }
        
        // Add some variance
        baseAchieved *= (0.85 + Math.random() * 0.3);
        basePlanned *= (0.95 + Math.random() * 0.1);
        
        // Engine-specific patterns
        if (engineType === 'digital-instore') {
          // Digital in-store has consistent performance during store hours
          baseAchieved *= 1.1;
        } else if (engineType === 'offline-instore') {
          // Offline in-store peaks on weekends
          if (isWeekend) {
            baseAchieved *= 1.4;
            basePlanned *= 1.3;
          }
        } else if (engineType === 'display') {
          // Display has evening peaks
          baseAchieved *= 1.05;
        }
        
        days.push({
          day: dayLabel,
          achieved: Math.round(baseAchieved),
          planned: Math.round(basePlanned),
        });
      }
    }
  }
  
  // Adjust data based on selected metric
  const multiplier = 
    selectedMetric === 'repetitions' || selectedMetric === 'impressions' ? 1000 : 
    selectedMetric === 'stores' || selectedMetric === 'locations' ? 0.1 : 
    selectedMetric === 'screens' ? 0.5 :
    selectedMetric === 'plays' ? 100 :
    selectedMetric === 'clicks' ? 10 :
    selectedMetric === 'spend' ? 5 :
    selectedMetric === 'materials' ? 2 :
    1;
  
  return days.map(item => ({
    ...item,
    achieved: Math.round(item.achieved * multiplier),
    planned: Math.round(item.planned * multiplier),
  }));
};

// Chart configuration
const getChartConfig = (selectedMetric: string) => ({
  achieved: {
    label: "Achieved",
    color: "hsl(var(--chart-1))",
  },
  planned: {
    label: "Planned", 
    color: "hsl(var(--chart-2))",
  },
});

// Mock data for bookings performance
const bookingsData = [
  { id: '1893', name: 'Campaign total', planned: 27000, achieved: 25000, performance: '103.00%', creatives: 2, roas: '324%' },
  { id: '1893', name: 'Auction booking #1', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '315%' },
  { id: '1893', name: 'Auction booking #2', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '342%' },
  { id: '1893', name: 'Auction booking #3', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '298%' },
  { id: '1893', name: 'Auction booking #4', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '367%' },
  { id: '1893', name: 'Auction booking #5', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '321%' },
  { id: '1893', name: 'Auction booking #6', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '287%' },
  { id: '1893', name: 'Auction booking #7', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '355%' },
];

// Mock data for creatives performance
const creativesData = [
  { id: 'CR-001', name: 'Summer Banner', planned: 15000, achieved: 14500, performance: '96.67%', bookings: 3, roas: '345%' },
  { id: 'CR-002', name: 'Holiday Video', planned: 12000, achieved: 10500, performance: '87.50%', bookings: 2, roas: '278%' },
  { id: 'CR-003', name: 'Store Display', planned: 8000, achieved: 8200, performance: '102.50%', bookings: 1, roas: '412%' },
  { id: 'CR-004', name: 'Product Banner', planned: 10000, achieved: 9800, performance: '98.00%', bookings: 2, roas: '295%' },
  { id: 'CR-005', name: 'Promo Video', planned: 6000, achieved: 6300, performance: '105.00%', bookings: 1, roas: '367%' },
];

const getPerformanceBadgeVariant = (performance: string) => {
  const value = parseFloat(performance.replace('%', ''));
  if (value >= 100) return 'default';
  if (value >= 90) return 'secondary';
  return 'destructive';
};

export const GeneralInsights: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
    // Top filter states
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('holiday-sale-2024');
    const [bookingFilter, setBookingFilter] = useState<string | undefined>(undefined);
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>(undefined);
    const [engineFilter, setEngineFilter] = useState<string | undefined>(undefined);
    
    // IROAS selected metric state
    const [selectedIroasMetric, setSelectedIroasMetric] = useState<string>('revenue');
    
    // Function to get IROAS chart data based on selected metric
    const getIroasChartData = (metric: string) => {
      switch (metric) {
        case 'revenue':
          return [
            { day: 'Mon', incrementalRevenue: 144000, organicRevenue: 198000 },
            { day: 'Tue', incrementalRevenue: 157000, organicRevenue: 201000 },
            { day: 'Wed', incrementalRevenue: 130000, organicRevenue: 195000 },
            { day: 'Thu', incrementalRevenue: 173000, organicRevenue: 205000 },
            { day: 'Fri', incrementalRevenue: 202000, organicRevenue: 210000 },
            { day: 'Sat', incrementalRevenue: 187000, organicRevenue: 208000 },
            { day: 'Sun', incrementalRevenue: 167000, organicRevenue: 203000 },
          ];
        case 'spend':
          return [
            { day: 'Mon', mediaSpend: 42000 },
            { day: 'Tue', mediaSpend: 44000 },
            { day: 'Wed', mediaSpend: 41000 },
            { day: 'Thu', mediaSpend: 46000 },
            { day: 'Fri', mediaSpend: 49000 },
            { day: 'Sat', mediaSpend: 48000 },
            { day: 'Sun', mediaSpend: 45000 },
          ];
        case 'iroas':
          return [
            { day: 'Mon', overallIroas: 340, sponsoredIroas: 400, displayIroas: 280, digitalInstoreIroas: 320, offlineInstoreIroas: 290 },
            { day: 'Tue', overallIroas: 360, sponsoredIroas: 420, displayIroas: 300, digitalInstoreIroas: 340, offlineInstoreIroas: 310 },
            { day: 'Wed', overallIroas: 320, sponsoredIroas: 380, displayIroas: 260, digitalInstoreIroas: 300, offlineInstoreIroas: 270 },
            { day: 'Thu', overallIroas: 380, sponsoredIroas: 440, displayIroas: 320, digitalInstoreIroas: 360, offlineInstoreIroas: 330 },
            { day: 'Fri', overallIroas: 410, sponsoredIroas: 480, displayIroas: 340, digitalInstoreIroas: 390, offlineInstoreIroas: 350 },
            { day: 'Sat', overallIroas: 390, sponsoredIroas: 450, displayIroas: 330, digitalInstoreIroas: 370, offlineInstoreIroas: 340 },
            { day: 'Sun', overallIroas: 365, sponsoredIroas: 420, displayIroas: 310, digitalInstoreIroas: 350, offlineInstoreIroas: 320 },
          ];
        default:
          return [];
      }
    };

    // Function to get IROAS chart config based on selected metric
    const getIroasChartConfig = (metric: string) => {
      switch (metric) {
        case 'revenue':
          return {
            incrementalRevenue: {
              label: "Incremental Revenue (IROAS)",
              color: "hsl(var(--chart-1))",
            },
            organicRevenue: {
              label: "Organic Revenue",
              color: "hsl(var(--chart-2))",
            },
          };
        case 'spend':
          return {
            mediaSpend: {
              label: "Media Spend (€)",
              color: "hsl(var(--chart-1))",
            },
          };
        case 'iroas':
          return {
            overallIroas: {
              label: "Overall IROAS",
              color: "hsl(var(--chart-1))",
            },
            displayIroas: {
              label: "Display IROAS",
              color: "hsl(var(--chart-2))",
            },
            sponsoredIroas: {
              label: "Sponsored Products IROAS",
              color: "hsl(var(--chart-3))",
            },
            digitalInstoreIroas: {
              label: "Digital In-store IROAS",
              color: "hsl(var(--chart-4))",
            },
            offlineInstoreIroas: {
              label: "Offline In-store IROAS",
              color: "hsl(var(--chart-5))",
            },
          };
        default:
          return {};
      }
    };
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Insights Dashboard',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
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
                  <label className="block text-sm font-medium mb-2">Advertiser</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Advertisers', value: 'all' },
                      { label: 'Unilever', value: 'unilever' },
                      { label: 'Procter & Gamble', value: 'pg' },
                      { label: 'Nestlé', value: 'nestle' },
                      { label: 'Coca-Cola', value: 'coca-cola' },
                    ]}
                    value={advertiserFilter}
                    onChange={setAdvertiserFilter}
                    placeholder="Select advertiser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Holiday Sale 2024', value: 'holiday-sale-2024' },
                      { label: 'Summer Launch 2024', value: 'summer-launch-2024' },
                      { label: 'Spring Collection 2024', value: 'spring-collection-2024' },
                      { label: 'Back to School 2024', value: 'back-to-school-2024' },
                    ]}
                    value={campaignFilter}
                    onChange={setCampaignFilter}
                    placeholder="Select campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Booking</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Bookings', value: 'all' },
                      { label: 'Auction booking #1', value: 'auction-1' },
                      { label: 'Auction booking #2', value: 'auction-2' },
                      { label: 'Auction booking #3', value: 'auction-3' },
                      { label: 'Auction booking #4', value: 'auction-4' },
                    ]}
                    value={bookingFilter}
                    onChange={setBookingFilter}
                    placeholder="Select booking"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Engine</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Engines', value: 'all' },
                      { label: 'Display', value: 'display' },
                      { label: 'Sponsored Products', value: 'sponsored-products' },
                      { label: 'Digital In-store', value: 'digital-instore' },
                      { label: 'Offline In-store', value: 'offline-instore' },
                    ]}
                    value={engineFilter}
                    onChange={setEngineFilter}
                    placeholder="Select engine"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Width IROAS Report */}
          <div className="mb-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">IROAS Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
                {/* Revenue, Spend and IROAS Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-row">
                  <MetricCard
                    label="Total Revenue"
                    value="€2.4M"
                    subMetric="Last 30 days"
                    badgeValue="+15.3%"
                    badgeVariant="success"
                    isSelected={selectedIroasMetric === 'revenue'}
                    onClick={() => setSelectedIroasMetric('revenue')}
                  />
                  <MetricCard
                    label="Total Spend"
                    value="€650K"
                    subMetric="Media investment"
                    badgeValue="+8.7%"
                    badgeVariant="success"
                    isSelected={selectedIroasMetric === 'spend'}
                    onClick={() => setSelectedIroasMetric('spend')}
                  />
                  <MetricCard
                    label="Overall IROAS"
                    value="365%"
                    subMetric="Incremental return"
                    badgeValue="+18%"
                    badgeVariant="success"
                    isSelected={selectedIroasMetric === 'iroas'}
                    onClick={() => setSelectedIroasMetric('iroas')}
                  />
                </div>

                {/* Dynamic Chart based on selected metric */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    {selectedIroasMetric === 'revenue' && 'Incremental vs Organic Revenue'}
                    {selectedIroasMetric === 'spend' && 'Media Spend'}
                    {selectedIroasMetric === 'iroas' && 'IROAS Performance by Channel'}
                  </h4>
                  <LineChartComponent
                    data={getIroasChartData(selectedIroasMetric)}
                    config={getIroasChartConfig(selectedIroasMetric) as any}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="day"
                    yAxisLabel={
                      selectedIroasMetric === 'revenue' ? 'Revenue (€)' :
                      selectedIroasMetric === 'spend' ? 'Spend (€)' :
                      'IROAS'
                    }
                  />
                </div>
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full IROAS Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Dashboard Report Cards */}
          {/* Top Row - Product Report and Performance Ecom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-row mb-6">
            {/* Product Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Product Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
                {/* Top 5 Products Performance Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top 5 Products - Impressions vs Transactions</h4>
                  <BarChartComponent
                    data={[
                      { 
                        product: 'Dove', 
                        impressions: 450000, 
                        transactions: 2847 
                      },
                      { 
                        product: 'Hellmanns', 
                        impressions: 380000, 
                        transactions: 2634 
                      },
                      { 
                        product: 'Ben & Jerrys', 
                        impressions: 320000, 
                        transactions: 2291 
                      },
                      { 
                        product: 'Axe', 
                        impressions: 280000, 
                        transactions: 1923 
                      },
                      { 
                        product: 'Lipton', 
                        impressions: 220000, 
                        transactions: 1756 
                      },
                    ]}
                    config={{
                      impressions: {
                        label: "Impressions",
                        color: "hsl(var(--chart-1))",
                      },
                      transactions: {
                        label: "Transactions",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="product"
                  />
                </div>

                {/* Bottom 5 Products Performance Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Least 5 Performing Products - Impressions vs Transactions</h4>
                  <BarChartComponent
                    data={[
                      { 
                        product: 'Surf', 
                        impressions: 85000, 
                        transactions: 245 
                      },
                      { 
                        product: 'Persil', 
                        impressions: 92000, 
                        transactions: 312 
                      },
                      { 
                        product: 'Magnum', 
                        impressions: 108000, 
                        transactions: 389 
                      },
                      { 
                        product: 'Knorr', 
                        impressions: 125000, 
                        transactions: 456 
                      },
                      { 
                        product: 'Vaseline', 
                        impressions: 140000, 
                        transactions: 523 
                      },
                    ]}
                    config={{
                      impressions: {
                        label: "Impressions",
                        color: "hsl(var(--chart-1))",
                      },
                      transactions: {
                        label: "Transactions",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="product"
                  />
                </div>
                
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Product Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>

            {/* E-commerce Funnel Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Funnel Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* Column-based Funnel Structure */}
                <div className="space-y-6">
                  {/* Top Row - Column Headers and Values */}
                  <div className="grid grid-cols-4 gap-row">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Impressions</div>
                      <div className="text-2xl font-bold">54,740</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Clicks</div>
                      <div className="text-2xl font-bold">3,403</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Add to Cart</div>
                      <div className="text-2xl font-bold">934</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Purchases</div>
                      <div className="text-2xl font-bold">715</div>
                    </div>
                  </div>

                  {/* Funnel Chart */}
                  <div className="h-64">
                    <FunnelChartComponent
                      data={[
                        { name: 'Impressions', value: 54740 },
                        { name: 'Clicks', value: 3403 },
                        { name: 'Add to Cart', value: 934 },
                        { name: 'Purchases', value: 715 },
                      ]}
                      config={{
                        'Impressions': {
                          label: "Impressions",
                          color: "hsl(var(--chart-1))",
                        },
                        'Clicks': {
                          label: "Clicks",
                          color: "hsl(var(--chart-2))",
                        },
                        'Add to Cart': {
                          label: "Add to Cart",
                          color: "hsl(var(--chart-3))",
                        },
                        'Purchases': {
                          label: "Purchases",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      showTooltip={true}
                      showLabels={true}
                      orientation="horizontal"
                      className="h-full w-full"
                    />
                  </div>

                  {/* Bottom Row - Total Conversion Rate */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Total CR%</div>
                    <div className="text-2xl font-bold">0.87%</div>
                    <div className="text-sm text-success-700">↑ 17.3%</div>
                  </div>
                </div>
                
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full E-commerce Funnel Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Bottom Row - Audience Report and Goal Report */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-row mb-6">
            {/* Audience Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Audience Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
                {/* Audience Pie Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Audience Distribution</h4>
                  <PieChartComponent
                    data={[
                      { name: 'Young Professionals', value: 35 },
                      { name: 'Families', value: 28 },
                      { name: 'Students', value: 22 },
                      { name: 'Seniors', value: 15 },
                    ]}
                    config={{
                      'Young Professionals': {
                        label: "Young Professionals",
                        color: "hsl(var(--chart-1))",
                      },
                      'Families': {
                        label: "Families",
                        color: "hsl(var(--chart-2))",
                      },
                      'Students': {
                        label: "Students",
                        color: "hsl(var(--chart-3))",
                      },
                      'Seniors': {
                        label: "Seniors",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    showLabels={true}
                    showLegend={true}
                    showTooltip={true}
                    className="h-64 w-full"
                    dataKey="value"
                    nameKey="name"
                  />
                </div>

                {/* Customer Lifetime Value by Audience Bar Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Customer Lifetime Value by Audience</h4>
                  <BarChartComponent
                    data={[
                      {
                        audience: 'Young Prof.',
                        clv: 1250,
                        avgOrderValue: 85
                      },
                      {
                        audience: 'Families',
                        clv: 890,
                        avgOrderValue: 120
                      },
                      {
                        audience: 'Students',
                        clv: 340,
                        avgOrderValue: 45
                      },
                      {
                        audience: 'Seniors',
                        clv: 780,
                        avgOrderValue: 65
                      },
                    ]}
                    config={{
                      clv: {
                        label: "Customer Lifetime Value (€)",
                        color: "hsl(var(--chart-1))",
                      },
                      avgOrderValue: {
                        label: "Avg Order Value (€)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="audience"
                  />
                </div>
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Audience Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>

            {/* Goal Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Goal Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-6">
                {/* Goal Contribution Radar Charts */}
                <h4 className="text-sm font-medium mb-4 text-muted-foreground">Engine Performance by Goal</h4>
                <div className="grid grid-cols-2 gap-row h-full">
                  {/* Sponsored Products Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Sponsored Products</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Sponsored products': 30 },
                          { subject: 'Consideration', 'Sponsored products': 35 },
                          { subject: 'Intent', 'Sponsored products': 40 },
                          { subject: 'Purchase', 'Sponsored products': 50 },
                          { subject: 'Retention', 'Sponsored products': 30 },
                        ]}
                        config={{
                          'Sponsored products': {
                            label: "Sponsored Products",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>
                  </div>

                  {/* Display Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Display</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Display': 12 },
                          { subject: 'Consideration', 'Display': 30 },
                          { subject: 'Intent', 'Display': 20 },
                          { subject: 'Purchase', 'Display': 15 },
                          { subject: 'Retention', 'Display': 12 },
                        ]}
                        config={{
                          'Display': {
                            label: "Display",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>
                  </div>

                  {/* Digital In-store Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Digital In-store</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Digital in-store': 22 },
                          { subject: 'Consideration', 'Digital in-store': 25 },
                          { subject: 'Intent', 'Digital in-store': 25 },
                          { subject: 'Purchase', 'Digital in-store': 20 },
                          { subject: 'Retention', 'Digital in-store': 22 },
                        ]}
                        config={{
                          'Digital in-store': {
                            label: "Digital In-store",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>
                  </div>

                  {/* Offline In-store Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Offline In-store</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Offline in-store': 18 },
                          { subject: 'Consideration', 'Offline in-store': 10 },
                          { subject: 'Intent', 'Offline in-store': 15 },
                          { subject: 'Purchase', 'Offline in-store': 15 },
                          { subject: 'Retention', 'Offline in-store': 18 },
                        ]}
                        config={{
                          'Offline in-store': {
                            label: "Offline In-store",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Goal Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const DisplayPerformance: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('impressions');
    const [activeTab, setActiveTab] = useState('bookings');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    
    // Selection states
    const [selectedBookings, setSelectedBookings] = useState<any[]>([]);
    const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
    
    // Display-specific metrics
    const displayMetrics = [
      { 
        id: 'impressions', 
        label: 'Impressions', 
        value: '2,847,193', 
        subMetric: 'CPM: €2.14',
        badgeValue: '+12%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'clicks', 
        label: 'Clicks', 
        value: '8,432', 
        subMetric: 'CTR: 0.30%',
        badgeValue: '+5%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'spend', 
        label: 'Spend', 
        value: '€6,089', 
        subMetric: 'CPC: €0.72',
        badgeValue: '-3%',
        badgeVariant: 'destructive' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS', 
        value: '415%', 
        subMetric: 'AOV: €85.20',
        badgeValue: '+18%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const chartData = getChartData(selectedMetric, 'display', timeRange, dateRange);
    const chartConfig = getChartConfig(selectedMetric);
    const selectedMetricData = displayMetrics.find(m => m.id === selectedMetric);
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Spring Collection 2024 - Display Campaign',
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
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col h-full space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                {displayMetrics.map((metric) => (
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
                  Achieved {selectedMetricData?.label.toLowerCase() || 'performance'}
                </h3>
                <BarChartComponent
                  data={chartData}
                  config={chartConfig}
                  showLegend={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-80 aspect-auto"
                  xAxisDataKey="day"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'bookings', label: 'Bookings' },
                  { value: 'creatives', label: 'Creatives' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <FilterBar
                  filters={[
                    {
                      name: "Status",
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Paused", value: "paused" },
                        { label: "Draft", value: "draft" },
                        { label: "Completed", value: "completed" },
                      ],
                      selectedValues: statusFilter,
                      onChange: setStatusFilter,
                    },
                    {
                      name: "Performance",
                      options: [
                        { label: "Above 100%", value: "above-100" },
                        { label: "90-100%", value: "90-100" },
                        { label: "Below 90%", value: "below-90" },
                      ],
                      selectedValues: performanceFilter,
                      onChange: setPerformanceFilter,
                    },
                  ]}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  searchPlaceholder="Search bookings, creatives..."
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="bookings" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'creatives', header: 'Creative', render: row => (
                        <Badge variant="secondary">{row.creatives}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={bookingsData}
                    rowKey={row => `${row.id}-${row.name}`}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to booking details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedBookings,
                      onChange: setSelectedBookings,
                      getKey: row => `${row.id}-${row.name}`,
                    }}
                  />
                </TabsContent>
                <TabsContent value="creatives" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'bookings', header: 'Bookings', render: row => (
                        <Badge variant="secondary">{row.bookings}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={creativesData}
                    rowKey={row => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to creative details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedCreatives,
                      onChange: setSelectedCreatives,
                      getKey: row => row.id,
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

export const DigitalInstorePerformance: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('stores');
    const [activeTab, setActiveTab] = useState('bookings');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    
    // Top filter states (similar to Sponsored Products)
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('summer-promotion-2024');
    const [bookingFilter, setBookingFilter] = useState<string | undefined>(undefined);
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>(undefined);
    
    // Digital In-store specific filter states (no longer needed for tables but keeping for reference)
    const [storeTypeFilter, setStoreTypeFilter] = useState<string[]>([]);
    const [playerTypeFilter, setPlayerTypeFilter] = useState<string[]>([]);
    
    
    // Map data for Digital In-store
    const mapData = [
      // Amsterdam area
      { name: 'Amsterdam Central', plays: 5847, x: 48, y: 35 },
      { name: 'Amsterdam Zuid', plays: 4239, x: 46, y: 40 },
      { name: 'Amsterdam Noord', plays: 3156, x: 50, y: 32 },
      
      // Rotterdam area
      { name: 'Rotterdam Central', plays: 6241, x: 40, y: 55 },
      { name: 'Rotterdam Zuid', plays: 2847, x: 42, y: 58 },
      
      // Den Haag area
      { name: 'Den Haag HS', plays: 4156, x: 35, y: 50 },
      { name: 'Den Haag Central', plays: 3542, x: 33, y: 52 },
      
      // Utrecht area
      { name: 'Utrecht CS', plays: 5123, x: 52, y: 48 },
      { name: 'Utrecht Noord', plays: 2156, x: 54, y: 45 },
      
      // Eindhoven area
      { name: 'Eindhoven CS', plays: 3789, x: 58, y: 70 },
      { name: 'Eindhoven Airport', plays: 1923, x: 62, y: 72 },
      
      // Groningen area
      { name: 'Groningen CS', plays: 2456, x: 65, y: 15 },
      { name: 'Groningen Noord', plays: 1567, x: 67, y: 12 },
      
      // Breda area
      { name: 'Breda CS', plays: 2789, x: 45, y: 68 },
      
      // Tilburg area
      { name: 'Tilburg CS', plays: 3234, x: 52, y: 65 },
      
      // Arnhem area
      { name: 'Arnhem CS', plays: 2945, x: 68, y: 52 },
      
      // Nijmegen area
      { name: 'Nijmegen CS', plays: 2156, x: 70, y: 58 },
      
      // Zwolle area
      { name: 'Zwolle CS', plays: 1834, x: 62, y: 35 },
      
      // Haarlem area
      { name: 'Haarlem CS', plays: 2567, x: 42, y: 38 },
      
      // Almere area
      { name: 'Almere CS', plays: 3456, x: 58, y: 42 },
    ];
    
    // Digital In-store specific metrics
    const digitalInstoreMetrics = [
      { 
        id: 'stores', 
        label: 'Stores', 
        value: '1,247', 
        subMetric: 'Coverage: 94%',
        badgeValue: '+2%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'plays', 
        label: 'Plays', 
        value: '89,432', 
        subMetric: 'Rate: 71.7/day',
        badgeValue: '+8%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'completion', 
        label: 'Completion', 
        value: '87.3%', 
        subMetric: 'Duration: 15s avg',
        badgeValue: '-1%',
        badgeVariant: 'destructive' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS', 
        value: '285%', 
        subMetric: 'AOV: €92.40',
        badgeValue: '+7%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const chartData = getChartData(selectedMetric, 'digital-instore', timeRange, dateRange);
    const chartConfig = getChartConfig(selectedMetric);
    const selectedMetricData = digitalInstoreMetrics.find(m => m.id === selectedMetric);
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Digital Media In Store',
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
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-row">
                <div>
                  <label className="block text-sm font-medium mb-2">Advertiser</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Advertisers', value: 'all' },
                      { label: 'Albert Heijn', value: 'albert-heijn' },
                      { label: 'Jumbo', value: 'jumbo' },
                      { label: 'Etos', value: 'etos' },
                      { label: 'Kruidvat', value: 'kruidvat' },
                    ]}
                    value={advertiserFilter}
                    onChange={setAdvertiserFilter}
                    placeholder="Select advertiser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Summer Promotion 2024', value: 'summer-promotion-2024' },
                      { label: 'Back to School 2024', value: 'back-to-school-2024' },
                      { label: 'Holiday Campaign 2024', value: 'holiday-campaign-2024' },
                      { label: 'Spring Collection 2024', value: 'spring-collection-2024' },
                    ]}
                    value={campaignFilter}
                    onChange={setCampaignFilter}
                    placeholder="Select campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Booking</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Bookings', value: 'all' },
                      { label: 'Hypermarket displays', value: 'hypermarket-displays' },
                      { label: 'Checkout screens', value: 'checkout-screens' },
                      { label: 'Interactive kiosks', value: 'interactive-kiosks' },
                      { label: 'Entrance displays', value: 'entrance-displays' },
                    ]}
                    value={bookingFilter}
                    onChange={setBookingFilter}
                    placeholder="Select booking"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Plays Report</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-row">
                <MetricCard
                  label="Stores"
                  value="1,247"
                  subMetric="Coverage: 94%"
                  badgeValue="+2%"
                  badgeVariant="success"
                  isSelected={selectedMetric === 'stores'}
                  onClick={() => setSelectedMetric('stores')}
                />
                <MetricCard
                  label="Plays"
                  value="89,432"
                  subMetric="Rate: 71.7/day"
                  badgeValue="+8%"
                  badgeVariant="success"
                  isSelected={selectedMetric === 'plays'}
                  onClick={() => setSelectedMetric('plays')}
                />
                <MetricCard
                  label="Completion"
                  value="87.3%"
                  subMetric="Duration: 15s avg"
                  badgeValue="-1%"
                  badgeVariant="destructive"
                  isSelected={selectedMetric === 'completion'}
                  onClick={() => setSelectedMetric('completion')}
                />
              </div>

              <div>
                <BarChartComponent
                  data={chartData}
                  config={chartConfig}
                  showLegend={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-80 aspect-auto"
                  xAxisDataKey="day"
                />
              </div>
              
            </CardContent>

            {/* CTA Footer */}
            <div className="p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => console.log('Navigate to full Plays Report')}
                className="w-full"
              >
                View Full Report
              </Button>
            </div>
          </Card>


          {/* ROAS Report */}
          <div className="grid grid-cols-1 gap-row">
            {/* ROAS Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">ROAS Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* ROAS metrics grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                  <MetricCard
                    label="Overall ROAS"
                    value="425%"
                    subMetric="All channels"
                    badgeValue="+12%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Overall IROAS"
                    value="365%"
                    subMetric="Incremental ROAS"
                    badgeValue="+18%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Offline ROAS"
                    value="289%"
                    subMetric="In-store campaigns"
                    badgeValue="+8%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Online ROAS"
                    value="512%"
                    subMetric="Digital campaigns"
                    badgeValue="+22%"
                    badgeVariant="success"
                  />
                </div>

                {/* ROAS Trend Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">ROAS Performance Trend</h4>
                  <LineChartComponent
                    data={[
                      { day: 'Mon', overallRoas: 410, overallIroas: 340, offlineRoas: 280, onlineRoas: 490 },
                      { day: 'Tue', overallRoas: 430, overallIroas: 360, offlineRoas: 290, onlineRoas: 510 },
                      { day: 'Wed', overallRoas: 390, overallIroas: 320, offlineRoas: 270, onlineRoas: 480 },
                      { day: 'Thu', overallRoas: 450, overallIroas: 380, offlineRoas: 310, onlineRoas: 530 },
                      { day: 'Fri', overallRoas: 480, overallIroas: 410, offlineRoas: 320, onlineRoas: 560 },
                      { day: 'Sat', overallRoas: 460, overallIroas: 390, offlineRoas: 300, onlineRoas: 540 },
                      { day: 'Sun', overallRoas: 425, overallIroas: 365, offlineRoas: 289, onlineRoas: 512 },
                    ]}
                    config={{
                      overallRoas: {
                        label: "Overall ROAS",
                        color: "hsl(var(--chart-1))",
                      },
                      overallIroas: {
                        label: "Overall IROAS",
                        color: "hsl(var(--chart-2))",
                      },
                      offlineRoas: {
                        label: "Offline ROAS",
                        color: "hsl(var(--chart-3))",
                      },
                      onlineRoas: {
                        label: "Online ROAS",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-40 w-full"
                    xAxisDataKey="day"
                  />
                </div>
                
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full ROAS Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Digital In-store Specific Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-row">
            {/* Netherlands Map Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Demographic Report</CardTitle>
              </CardHeader>
              <CardContent>
                <MapChart data={mapData} />
              </CardContent>
            </Card>

            {/* Hourly Plays Line Chart Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Plays by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChartComponent
                  data={[
                    { hour: '6AM', plays: 0 },
                    { hour: '7AM', plays: 1200 },
                    { hour: '8AM', plays: 8900 },
                    { hour: '9AM', plays: 12400 },
                    { hour: '10AM', plays: 13800 },
                    { hour: '11AM', plays: 14200 },
                    { hour: '12PM', plays: 15800 },
                    { hour: '1PM', plays: 16200 },
                    { hour: '2PM', plays: 15900 },
                    { hour: '3PM', plays: 15200 },
                    { hour: '4PM', plays: 14800 },
                    { hour: '5PM', plays: 13900 },
                    { hour: '6PM', plays: 12100 },
                    { hour: '7PM', plays: 8900 },
                    { hour: '8PM', plays: 4200 },
                    { hour: '9PM', plays: 1800 },
                    { hour: '10PM', plays: 0 },
                  ]}
                  config={{
                    plays: {
                      label: "Plays",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  showLegend={false}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-60 w-full"
                  xAxisDataKey="hour"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const OfflineInstorePerformance: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('locations');
    const [activeTab, setActiveTab] = useState('bookings');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    
    // Selection states
    const [selectedBookings, setSelectedBookings] = useState<any[]>([]);
    const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
    
    // Offline In-store specific metrics
    const offlineInstoreMetrics = [
      { 
        id: 'locations', 
        label: 'Locations', 
        value: '843', 
        subMetric: 'Coverage: 97%',
        badgeValue: '+1%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'materials', 
        label: 'Materials', 
        value: '2,195', 
        subMetric: 'Installed: 98%',
        badgeValue: '+3%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'compliance', 
        label: 'Compliance', 
        value: '94.2%', 
        subMetric: 'Verified: 89%',
        badgeValue: '-2%',
        badgeVariant: 'destructive' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS', 
        value: '195%', 
        subMetric: 'AOV: €65.80',
        badgeValue: '+4%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const chartData = getChartData(selectedMetric, 'offline-instore', timeRange, dateRange);
    const chartConfig = getChartConfig(selectedMetric);
    const selectedMetricData = offlineInstoreMetrics.find(m => m.id === selectedMetric);
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Back to School 2024 - Offline In-store',
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
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 flex flex-col space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-row">
                {offlineInstoreMetrics.map((metric) => (
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
                  Achieved {selectedMetricData?.label.toLowerCase() || 'performance'}
                </h3>
                <BarChartComponent
                  data={chartData}
                  config={chartConfig}
                  showLegend={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-80 aspect-auto"
                  xAxisDataKey="day"
                />
              </div>
            </CardContent>
          </Card>

          {/* Audience Report Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Audience Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-row">
                {/* Audience Breakdown Pie Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Audience Distribution</h4>
                  <PieChartComponent
                    data={[
                      { name: 'Stedelijk', value: 35, percentage: '35%' },
                      { name: 'Young adult', value: 28, percentage: '28%' },
                      { name: 'Family with Kids', value: 25, percentage: '25%' },
                      { name: 'Bonus shoppers', value: 12, percentage: '12%' },
                    ]}
                    config={{
                      'Stedelijk': {
                        label: "Stedelijk",
                        color: "hsl(var(--chart-1))",
                      },
                      'Young adult': {
                        label: "Young adult",
                        color: "hsl(var(--chart-2))",
                      },
                      'Family with Kids': {
                        label: "Family with Kids",
                        color: "hsl(var(--chart-3))",
                      },
                      'Bonus shoppers': {
                        label: "Bonus shoppers",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    showLegend={true}
                    showTooltip={true}
                    className="h-64 w-full"
                    dataKey="value"
                    nameKey="name"
                  />
                </div>

                {/* Audience Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Audience Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Stedelijk</p>
                        <p className="text-xs text-muted-foreground">35% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€24.5K revenue</p>
                        <p className="text-xs text-success-700">+12% ROAS</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Young adult</p>
                        <p className="text-xs text-muted-foreground">28% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€19.2K revenue</p>
                        <p className="text-xs text-success-700">+18% ROAS</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Family with Kids</p>
                        <p className="text-xs text-muted-foreground">25% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€17.8K revenue</p>
                        <p className="text-xs text-success-700">+8% ROAS</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Bonus shoppers</p>
                        <p className="text-xs text-muted-foreground">12% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€8.1K revenue</p>
                        <p className="text-xs text-red-600">-3% ROAS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* CTA Footer */}
            <div className="p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => console.log('Navigate to full Audience Report')}
                className="w-full"
              >
                View Full Report
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'bookings', label: 'Bookings' },
                  { value: 'creatives', label: 'Creatives' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <FilterBar
                  filters={[
                    {
                      name: "Status",
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Paused", value: "paused" },
                        { label: "Draft", value: "draft" },
                        { label: "Completed", value: "completed" },
                      ],
                      selectedValues: statusFilter,
                      onChange: setStatusFilter,
                    },
                    {
                      name: "Performance",
                      options: [
                        { label: "Above 100%", value: "above-100" },
                        { label: "90-100%", value: "90-100" },
                        { label: "Below 90%", value: "below-90" },
                      ],
                      selectedValues: performanceFilter,
                      onChange: setPerformanceFilter,
                    },
                  ]}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  searchPlaceholder="Search bookings, creatives..."
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="bookings" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'creatives', header: 'Creative', render: row => (
                        <Badge variant="secondary">{row.creatives}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={bookingsData}
                    rowKey={row => `${row.id}-${row.name}`}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to booking details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedBookings,
                      onChange: setSelectedBookings,
                      getKey: row => `${row.id}-${row.name}`,
                    }}
                  />
                </TabsContent>
                <TabsContent value="creatives" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'bookings', header: 'Bookings', render: row => (
                        <Badge variant="secondary">{row.bookings}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={creativesData}
                    rowKey={row => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to creative details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedCreatives,
                      onChange: setSelectedCreatives,
                      getKey: row => row.id,
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

export const FullReportView: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    // Filter states
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>('unilever');
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('holiday-sale-2024');
    const [bookingFilter, setBookingFilter] = useState<string | undefined>(undefined);
    const [engineFilter, setEngineFilter] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: prototypeToday(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);

    // Comprehensive report data
    const fullReportData = [
      {
        id: 'LI-001',
        name: 'Sponsored Products - Electronics',
        advertiser: 'Unilever',
        campaign: 'Holiday Sale 2024',
        impressions: 2847193,
        clicks: 8432,
        spend: 6089.50,
        conversions: 234,
        revenue: 18576.80,
        roas: '305%',
        ctr: '0.30%',
        cpc: '€0.72',
        cvr: '2.78%',
        cpa: '€26.02',
        status: 'Active',
        startDate: '2024-11-01',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-002',
        name: 'Display Campaign - Home & Garden',
        advertiser: 'Unilever',
        campaign: 'Holiday Sale 2024',
        impressions: 1934567,
        clicks: 5821,
        spend: 4234.75,
        conversions: 156,
        revenue: 12890.40,
        roas: '304%',
        ctr: '0.30%',
        cpc: '€0.73',
        cvr: '2.68%',
        cpa: '€27.15',
        status: 'Active',
        startDate: '2024-11-01',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-003',
        name: 'Video Campaign - Beauty Products',
        advertiser: 'Procter & Gamble',
        campaign: 'Spring Collection 2024',
        impressions: 3456789,
        clicks: 12045,
        spend: 8967.25,
        conversions: 378,
        revenue: 29456.70,
        roas: '328%',
        ctr: '0.35%',
        cpc: '€0.74',
        cvr: '3.14%',
        cpa: '€23.72',
        status: 'Active',
        startDate: '2024-10-15',
        endDate: '2024-12-15',
      },
      {
        id: 'LI-004',
        name: 'Search Campaign - Food & Beverage',
        advertiser: 'Nestlé',
        campaign: 'Summer Launch 2024',
        impressions: 2156784,
        clicks: 9234,
        spend: 7123.80,
        conversions: 287,
        revenue: 21456.90,
        roas: '301%',
        ctr: '0.43%',
        cpc: '€0.77',
        cvr: '3.11%',
        cpa: '€24.82',
        status: 'Paused',
        startDate: '2024-09-01',
        endDate: '2024-11-30',
      },
      {
        id: 'LI-005',
        name: 'Social Media Campaign - Fashion',
        advertiser: 'Coca-Cola',
        campaign: 'Back to School 2024',
        impressions: 4567123,
        clicks: 15678,
        spend: 11234.50,
        conversions: 445,
        revenue: 34567.80,
        roas: '308%',
        ctr: '0.34%',
        cpc: '€0.72',
        cvr: '2.84%',
        cpa: '€25.25',
        status: 'Completed',
        startDate: '2024-08-01',
        endDate: '2024-10-31',
      },
      {
        id: 'LI-006',
        name: 'Retargeting Campaign - Tech Accessories',
        advertiser: 'Unilever',
        campaign: 'Holiday Sale 2024',
        impressions: 1789456,
        clicks: 6789,
        spend: 5234.60,
        conversions: 198,
        revenue: 15678.90,
        roas: '299%',
        ctr: '0.38%',
        cpc: '€0.77',
        cvr: '2.92%',
        cpa: '€26.44',
        status: 'Active',
        startDate: '2024-11-15',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-007',
        name: 'Shopping Campaign - Sports Equipment',
        advertiser: 'Procter & Gamble',
        campaign: 'Spring Collection 2024',
        impressions: 2987654,
        clicks: 10234,
        spend: 7890.40,
        conversions: 312,
        revenue: 23456.70,
        roas: '297%',
        ctr: '0.34%',
        cpc: '€0.77',
        cvr: '3.05%',
        cpa: '€25.29',
        status: 'Active',
        startDate: '2024-10-01',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-008',
        name: 'Brand Awareness - Automotive',
        advertiser: 'Nestlé',
        campaign: 'Summer Launch 2024',
        impressions: 5432109,
        clicks: 18765,
        spend: 13567.80,
        conversions: 523,
        revenue: 41234.50,
        roas: '304%',
        ctr: '0.35%',
        cpc: '€0.72',
        cvr: '2.79%',
        cpa: '€25.94',
        status: 'Active',
        startDate: '2024-09-15',
        endDate: '2024-12-15',
      },
    ];

    const getStatusBadgeVariant = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
          return 'default';
        case 'paused':
          return 'secondary';
        case 'completed':
          return 'outline';
        default:
          return 'secondary';
      }
    };

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Full Performance Report',
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
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-row">
                <div>
                  <label className="block text-sm font-medium mb-2">Advertiser</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Advertisers', value: 'all' },
                      { label: 'Unilever', value: 'unilever' },
                      { label: 'Procter & Gamble', value: 'pg' },
                      { label: 'Nestlé', value: 'nestle' },
                      { label: 'Coca-Cola', value: 'coca-cola' },
                    ]}
                    value={advertiserFilter}
                    onChange={setAdvertiserFilter}
                    placeholder="Select advertiser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Campaigns', value: 'all' },
                      { label: 'Holiday Sale 2024', value: 'holiday-sale-2024' },
                      { label: 'Summer Launch 2024', value: 'summer-launch-2024' },
                      { label: 'Spring Collection 2024', value: 'spring-collection-2024' },
                      { label: 'Back to School 2024', value: 'back-to-school-2024' },
                    ]}
                    value={campaignFilter}
                    onChange={setCampaignFilter}
                    placeholder="Select campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Booking</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Bookings', value: 'all' },
                      { label: 'Sponsored Products', value: 'sponsored-products' },
                      { label: 'Display Campaign', value: 'display' },
                      { label: 'Video Campaign', value: 'video' },
                      { label: 'Search Campaign', value: 'search' },
                      { label: 'Social Media Campaign', value: 'social' },
                    ]}
                    value={bookingFilter}
                    onChange={setBookingFilter}
                    placeholder="Select booking"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Engine</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Engines', value: 'all' },
                      { label: 'Display', value: 'display' },
                      { label: 'Sponsored Products', value: 'sponsored-products' },
                      { label: 'Digital In-store', value: 'digital-instore' },
                      { label: 'Offline In-store', value: 'offline-instore' },
                    ]}
                    value={engineFilter}
                    onChange={setEngineFilter}
                    placeholder="Select engine"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Report Table */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  { key: 'id', header: 'Booking ID', hideable: false },
                  { key: 'name', header: 'Campaign Name', hideable: false },
                  { key: 'advertiser', header: 'Advertiser' },
                  { key: 'status', header: 'Status', render: row => (
                    <Badge variant={getStatusBadgeVariant(row.status)}>
                      {row.status}
                    </Badge>
                  )},
                  { key: 'impressions', header: 'Impressions', render: row => row.impressions.toLocaleString() },
                  { key: 'clicks', header: 'Clicks', render: row => row.clicks.toLocaleString() },
                  { key: 'ctr', header: 'CTR' },
                  { key: 'spend', header: 'Spend', render: row => `€${row.spend.toLocaleString()}` },
                  { key: 'cpc', header: 'CPC' },
                  { key: 'conversions', header: 'Conversions', render: row => row.conversions.toLocaleString() },
                  { key: 'cvr', header: 'CVR' },
                  { key: 'cpa', header: 'CPA' },
                  { key: 'revenue', header: 'Revenue', render: row => `€${row.revenue.toLocaleString()}` },
                  { key: 'roas', header: 'ROAS' },
                  { key: 'startDate', header: 'Start Date' },
                  { key: 'endDate', header: 'End Date' },
                ]}
                data={fullReportData}
                rowKey={row => row.id}
                rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                onRowClick={row => {
                  console.log('Navigate to booking details for', row.name);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const ProductReportView: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [engineFilter, setEngineFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState('product-report');
    // The year so far by default, the same window the insights dashboard
    // opens on — both read the prototype's clock, never the machine's.
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(prototypeToday().getFullYear(), 0, 1),
      to: prototypeToday(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);

    // ── What the reports cover ─────────────────────────────────────────
    // One scope for every tab: the picked range, narrowed by Status (the
    // campaigns in that state), Brand and Category (the retail products
    // in them). Proposition sums the scope per selected proposition.
    const db = useDb();
    const isoOfLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const reportFrom = dateRange?.from ? isoOfLocal(dateRange.from) : INSIGHTS_FROM;
    const reportTo = dateRange?.to ? isoOfLocal(dateRange.to) : PROTOTYPE_TODAY;

    // A campaign's status in the report's words.
    const STATUS_VALUE: Record<string, string> = { running: 'active', paused: 'paused', completed: 'completed', 'in-option': 'in-option' };
    const STATUS_LABEL: Record<string, string> = { active: 'Active', paused: 'Paused', completed: 'Completed', 'in-option': 'In option' };

    const categoryOptions = [...new Set(db.retailProducts.map((p) => p.category))].sort().map((c) => ({ label: c, value: c }));
    const brandOptions = db.advertisers
      .flatMap((a) => a.brands)
      .filter((b) => db.retailProducts.some((p) => p.brandId === b.id))
      .map((b) => ({ label: b.name, value: b.id }));
    const engineOptions = ENGINE_ORDER.map((e) => ({ label: REPORT_ENGINE_LABEL[e], value: e }));

    const report = React.useMemo(() => {
      const productIds = db.retailProducts
        .filter((p) => (!categoryFilter.length || categoryFilter.includes(p.category)) && (!brandFilter.length || brandFilter.includes(p.brandId)))
        .map((p) => p.id);
      const campaignIds = statusFilter.length
        ? db.campaigns.filter((c) => statusFilter.includes(STATUS_VALUE[c.status] ?? c.status)).map((c) => c.id)
        : undefined;
      const scope: PerformanceScope = {
        from: reportFrom,
        to: reportTo,
        campaignIds,
        brandIds: brandFilter.length ? brandFilter : undefined,
        retailProductIds: categoryFilter.length || brandFilter.length ? productIds : undefined,
      };
      const engines = (engineFilter.length ? engineFilter : ENGINE_ORDER) as EngineId[];
      const engineRows = engines
        .map((e) => ({ engine: e, totals: totalsFor(db, { ...scope, engine: e }), campaigns: breakdown(db, { ...scope, engine: e }, 'campaign').length }))
        .filter((r) => r.totals.spend > 0 || r.totals.impressions > 0);
      const total = engineRows.reduce((t, r) => add(t, r.totals), EMPTY);

      // Products: the scope's delivery per retail product (a campaign's
      // split evenly over the products it advertises), within the picked
      // categories and brands.
      const q = searchValue.trim().toLowerCase();
      const productRows = mergeRows(engines.map((e) => breakdown(db, { ...scope, engine: e }, 'retailProduct')))
        .map((r) => ({ row: r, product: db.retailProducts.find((p) => p.id === r.id) }))
        .filter(({ product }) => !!product && productIds.includes(product.id))
        .map(({ row, product }) => {
          const p = product!;
          const brand = db.advertisers.flatMap((a) => a.brands).find((b) => b.id === p.brandId);
          const advertiser = db.advertisers.find((a) => a.brands.some((b) => b.id === p.brandId));
          const t = row.totals;
          const r = ratesOf(t);
          const addToCart = t.clicks * ADD_TO_CART_PER_CLICK;
          // The product's status is its liveliest campaign's in scope.
          const statuses = db.campaigns
            .filter((c) => c.retailProductIds?.includes(p.id) && engines.includes(c.engine) && (!campaignIds || campaignIds.includes(c.id)))
            .map((c) => STATUS_VALUE[c.status] ?? c.status);
          const status = (['active', 'paused', 'in-option', 'completed'] as const).find((s) => statuses.includes(s)) ?? 'completed';
          return {
            id: p.id,
            productName: p.name,
            brand: brand?.name ?? '—',
            category: p.category,
            advertiser: advertiser?.name ?? '—',
            sku: p.gtin,
            impressions: Math.round(t.impressions),
            clicks: Math.round(t.clicks),
            spend: Math.round(t.spend * 100) / 100,
            addToCart: Math.round(addToCart),
            purchases: Math.round(t.conversions),
            revenue: Math.round(t.sales * 100) / 100,
            units: Math.round(t.units),
            roas: pctOf(r.roas),
            ctr: t.clicks > 0 ? pctOf(r.ctr, 2) : '—',
            cpc: t.clicks > 0 ? euro2(r.cpc) : '—',
            cartRate: t.clicks > 0 ? pctOf(addToCart / t.clicks, 1) : '—',
            conversionRate: t.clicks > 0 ? pctOf(r.cvr, 1) : '—',
            cpa: t.conversions > 0 ? euro2(t.spend / t.conversions) : '—',
            aov: t.conversions > 0 ? euro2(t.sales / t.conversions) : '—',
            status: STATUS_LABEL[status],
            statusValue: status,
            // Stock and margin are the retailer's master data, which the
            // prototype does not hold — shown empty rather than invented.
            stockLevel: '—',
            margin: '—',
            totals: t,
          };
        })
        .filter((row) => !q || [row.productName, row.brand, row.sku, row.category].some((v) => v.toLowerCase().includes(q)))
        .sort((a, b) => b.revenue - a.revenue);

      // Sales over time for the products in view: each campaign's series,
      // weighted by the share of its products in view — the same even
      // split the product rows use, so the line adds up to the table.
      const visible = new Set(productRows.map((r) => r.id));
      const grain = grainFor(reportFrom, reportTo);
      let series: { month: string; revenue: number; units: number }[] = seriesFor(db, { from: reportFrom, to: reportTo, campaignIds: [] }, grain)
        .map((p) => ({ month: p.label, revenue: 0, units: 0 }));
      const campaignsInScope = [...new Set(bookingsIn(db, scope).map((b) => b.campaignId))]
        .map((id) => db.campaigns.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => !!c && engines.includes(c.engine));
      for (const c of campaignsInScope) {
        const ids = c.retailProductIds ?? [];
        const share = ids.length ? ids.filter((id) => visible.has(id)).length / ids.length : 0;
        if (share <= 0) continue;
        const s = seriesFor(db, { ...scope, campaignIds: [c.id], retailProductIds: undefined }, grain);
        series = series.map((p, i) => ({ ...p, revenue: p.revenue + (s[i]?.totals.sales ?? 0) * share, units: p.units + (s[i]?.totals.units ?? 0) * share }));
      }
      series = series.map((p) => ({ ...p, revenue: Math.round(p.revenue), units: Math.round(p.units) }));

      return { total, engineRows, productRows, series };
    }, [db, reportFrom, reportTo, statusFilter, categoryFilter, brandFilter, engineFilter, searchValue]);

    const productReportData = report.productRows;

    // Audience: the scope's buyers by type. Spend, impressions, clicks and
    // revenue are shared out by each type's share of buyers — the model
    // does not yet tell one buyer type's basket from another's.
    const audience = buyerSplit(report.total);
    const audienceReportData = ([
      ['AUD-001', 'New-to-brand', audience.newToBrand],
      ['AUD-002', 'Lapsed', audience.lapsed],
      ['AUD-003', 'Existing', audience.existing],
    ] as const).map(([id, segment, buyers]) => {
      const share = audience.buyers > 0 ? buyers / audience.buyers : 0;
      return {
        id,
        segment,
        impressions: Math.round(report.total.impressions * share),
        clicks: Math.round(report.total.clicks * share),
        spend: Math.round(report.total.spend * share * 100) / 100,
        revenue: Math.round(report.total.sales * share * 100) / 100,
        roas: pctOf(ratesOf(report.total).roas),
        percentage: `${Math.round(share * 100)}%`,
        age: 'All',
        gender: 'Mixed',
      };
    });

    // iROAS: incremental sales over spend, overall and per proposition.
    // "Organic" is the attributed sales that would have happened anyway.
    const iroasRow = (id: string, engine: string, t: Totals) => ({
      id,
      engine,
      incrementalRevenue: Math.round(t.incrementalSales),
      mediaSpend: Math.round(t.spend),
      iroas: pctOf(ratesOf(t).iroas),
      organicRevenue: Math.round(t.sales - t.incrementalSales),
      totalRevenue: Math.round(t.sales),
    });
    const iroasReportData = [
      iroasRow('ENG-overall', 'Overall', report.total),
      ...report.engineRows.map((r) => iroasRow(`ENG-${r.engine}`, REPORT_ENGINE_LABEL[r.engine], r.totals)),
    ];

    // New report: the scope per proposition.
    const newReportData = report.engineRows.map((r) => {
      const rates = ratesOf(r.totals);
      return {
        id: `NR-${r.engine}`,
        proposition: REPORT_ENGINE_LABEL[r.engine],
        campaigns: r.campaigns,
        impressions: Math.round(r.totals.impressions),
        clicks: Math.round(r.totals.clicks),
        // In-store media has nothing to click: no CTR rather than 0%.
        ctr: r.totals.clicks > 0 ? pctOf(rates.ctr, 2) : '—',
        spend: Math.round(r.totals.spend),
        revenue: Math.round(r.totals.sales),
        roas: pctOf(rates.roas),
        conversions: Math.round(r.totals.conversions),
        cpa: r.totals.conversions > 0 ? euro2(r.totals.spend / r.totals.conversions) : '—',
      };
    });

    const getStatusBadgeVariant = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
          return 'default';
        case 'paused':
          return 'secondary';
        case 'completed':
          return 'outline';
        default:
          return 'secondary';
      }
    };

    const getStockBadgeVariant = (stockLevel: string) => {
      switch (stockLevel.toLowerCase()) {
        case 'high':
          return 'default';
        case 'medium':
          return 'secondary';
        case 'low':
          return 'destructive';
        default:
          return 'secondary';
      }
    };

    // Per-tab chart data — the same rows the tables show.
    const productChartTopProducts = productReportData.slice(0, 5).map((p) => {
      const split = buyerSplit(p.totals);
      return {
        name: p.productName.length > 18 ? p.productName.slice(0, 18) + '…' : p.productName,
        revenue: Math.round(p.revenue),
        newToBrand: Math.round(split.newToBrand),
        lapsed: Math.round(split.lapsed),
        existing: Math.round(split.existing),
      };
    });
    const productSalesOverTime = report.series;

    const audienceShareData = audienceReportData.map(a => ({
      name: a.segment,
      value: parseInt(a.percentage),
    }));
    const audienceSpendRevenue = audienceReportData.map(a => ({
      segment: a.segment,
      spend: Math.round(a.spend),
      revenue: Math.round(a.revenue),
    }));

    const iroasByEngine = iroasReportData
      .filter(e => e.engine !== 'Overall')
      .map(e => ({ engine: e.engine, iroas: parseFloat(e.iroas) }));
    const revenueSplit = iroasReportData
      .filter(e => e.engine !== 'Overall')
      .map(e => ({
        engine: e.engine,
        incremental: e.incrementalRevenue,
        organic: e.organicRevenue,
      }));

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Custom reports',
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
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {/* Multi-Report Dashboard with CardWithTabs */}
          <CardWithTabs
            tabs={[
              {
                value: 'product-report',
                label: 'Product Report',
                content: (
                  <div>
                    {/* Charts above filter + table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-row mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Buyers by product</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <BarChartComponent
                            data={productChartTopProducts}
                            config={{
                              newToBrand: { label: 'New-to-brand', color: 'hsl(var(--chart-1))' },
                              lapsed: { label: 'Lapsed', color: 'hsl(var(--chart-2))' },
                              existing: { label: 'Existing', color: 'hsl(var(--chart-3))' },
                            }}
                            stacked={true}
                            showLegend={true}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={true}
                            xAxisDataKey="name"
                            className="h-[220px] w-full"
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Sales over time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <LineChartComponent
                            data={productSalesOverTime}
                            config={{
                              revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
                              units: { label: 'Units', color: 'hsl(var(--chart-2))' },
                            }}
                            showLegend={true}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={true}
                            showDots={true}
                            xAxisDataKey="month"
                            className="h-[220px] w-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: categoryOptions,
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: brandOptions,
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Proposition",
                            options: engineOptions,
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'productName', header: 'Product Name', hideable: false },
                        { key: 'brand', header: 'Brand', hideable: false },
                        { key: 'category', header: 'Category' },
                        { key: 'sku', header: 'SKU' },
                        { key: 'status', header: 'Status', render: row => (
                          <Badge variant={getStatusBadgeVariant(row.status)}>
                            {row.status}
                          </Badge>
                        )},
                        { key: 'stockLevel', header: 'Stock', render: row => row.stockLevel === '—' ? row.stockLevel : (
                          <Badge variant={getStockBadgeVariant(row.stockLevel)}>
                            {row.stockLevel}
                          </Badge>
                        )},
                        { key: 'impressions', header: 'Impressions', render: row => row.impressions.toLocaleString() },
                        { key: 'clicks', header: 'Clicks', render: row => row.clicks.toLocaleString() },
                        { key: 'ctr', header: 'CTR' },
                        { key: 'spend', header: 'Spend', render: row => `€${row.spend.toLocaleString()}` },
                        { key: 'cpc', header: 'CPC' },
                        { key: 'addToCart', header: 'Add to Cart', render: row => row.addToCart.toLocaleString() },
                        { key: 'cartRate', header: 'Cart Rate' },
                        { key: 'purchases', header: 'Purchases', render: row => row.purchases.toLocaleString() },
                        { key: 'conversionRate', header: 'Conv. Rate' },
                        { key: 'cpa', header: 'CPA' },
                        { key: 'units', header: 'Units Sold', render: row => row.units.toLocaleString() },
                        { key: 'revenue', header: 'Revenue', render: row => `€${row.revenue.toLocaleString()}` },
                        { key: 'aov', header: 'AOV' },
                        { key: 'roas', header: 'ROAS' },
                        { key: 'margin', header: 'Margin %' },
                      ]}
                      data={productReportData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                      onRowClick={row => console.log('Navigate to product details for', row.productName)}
                    />
                  </div>
                )
              },
              {
                value: 'audience-report',
                label: 'Audience Report',
                content: (
                  <div>
                    {/* Charts above filter + table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-row mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Audience share</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <PieChartComponent
                            data={audienceShareData}
                            config={{
                              'New-to-brand': { label: 'New-to-brand', color: 'hsl(var(--chart-1))' },
                              Lapsed: { label: 'Lapsed', color: 'hsl(var(--chart-2))' },
                              Existing: { label: 'Existing', color: 'hsl(var(--chart-3))' },
                            }}
                            showLegend={true}
                            showTooltip={true}
                            className="h-[220px] w-full"
                            nameKey="name"
                            dataKey="value"
                            innerRadius={50}
                            outerRadius={85}
                            startAngle={90}
                            endAngle={-270}
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Spend vs revenue per segment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <BarChartComponent
                            data={audienceSpendRevenue}
                            config={{
                              spend: { label: 'Spend', color: 'hsl(var(--chart-2))' },
                              revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
                            }}
                            showLegend={true}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={true}
                            xAxisDataKey="segment"
                            className="h-[220px] w-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: categoryOptions,
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: brandOptions,
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Proposition",
                            options: engineOptions,
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'segment', header: 'Audience Segment', hideable: false },
                        { key: 'percentage', header: 'Share %', hideable: false },
                        { key: 'age', header: 'Age Range' },
                        { key: 'gender', header: 'Gender' },
                        { key: 'impressions', header: 'Impressions', render: row => row.impressions.toLocaleString() },
                        { key: 'clicks', header: 'Clicks', render: row => row.clicks.toLocaleString() },
                        { key: 'spend', header: 'Spend', render: row => `€${row.spend.toLocaleString()}` },
                        { key: 'revenue', header: 'Revenue', render: row => `€${row.revenue.toLocaleString()}` },
                        { key: 'roas', header: 'ROAS' },
                      ]}
                      data={audienceReportData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                      onRowClick={row => console.log('Navigate to audience details for', row.segment)}
                    />
                  </div>
                )
              },
              {
                value: 'iroas-report',
                label: 'IROAS Report',
                content: (
                  <div>
                    {/* Charts above filter + table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-row mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">IROAS by engine</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <BarChartComponent
                            data={iroasByEngine}
                            config={{ iroas: { label: 'IROAS', color: 'hsl(var(--chart-1))' } }}
                            showLegend={false}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={true}
                            xAxisDataKey="engine"
                            className="h-[220px] w-full"
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Incremental vs organic revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <BarChartComponent
                            data={revenueSplit}
                            config={{
                              incremental: { label: 'Incremental', color: 'hsl(var(--chart-1))' },
                              organic: { label: 'Organic', color: 'hsl(var(--chart-3))' },
                            }}
                            showLegend={true}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={true}
                            xAxisDataKey="engine"
                            stacked={true}
                            className="h-[220px] w-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: categoryOptions,
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: brandOptions,
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Proposition",
                            options: engineOptions,
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'engine', header: 'Engine', hideable: false },
                        { key: 'incrementalRevenue', header: 'Incremental Revenue', render: row => `€${row.incrementalRevenue.toLocaleString()}` },
                        { key: 'organicRevenue', header: 'Organic Revenue', render: row => `€${row.organicRevenue.toLocaleString()}` },
                        { key: 'totalRevenue', header: 'Total Revenue', render: row => `€${row.totalRevenue.toLocaleString()}` },
                        { key: 'mediaSpend', header: 'Media Spend', render: row => `€${row.mediaSpend.toLocaleString()}` },
                        { key: 'iroas', header: 'IROAS' },
                      ]}
                      data={iroasReportData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                      onRowClick={row => console.log('Navigate to IROAS details for', row.engine)}
                    />
                  </div>
                )
              },
              {
                value: 'new-report',
                label: 'New report',
                content: (
                  <div>
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Brand",
                            options: brandOptions,
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Proposition",
                            options: engineOptions,
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search custom report..."
                      />
                    </div>
                    <Table
                        columns={[
                          { key: 'proposition', header: 'Proposition', hideable: false },
                          { key: 'campaigns', header: 'Campaigns', render: (row: { campaigns: number }) => row.campaigns.toLocaleString() },
                          { key: 'impressions', header: 'Impressions', render: (row: { impressions: number }) => row.impressions.toLocaleString() },
                          { key: 'clicks', header: 'Clicks', render: (row: { clicks: number }) => row.clicks.toLocaleString() },
                          { key: 'ctr', header: 'CTR' },
                          { key: 'spend', header: 'Spend', render: (row: { spend: number }) => `€${row.spend.toLocaleString()}` },
                          { key: 'revenue', header: 'Revenue', render: (row: { revenue: number }) => `€${row.revenue.toLocaleString()}` },
                          { key: 'roas', header: 'ROAS' },
                          { key: 'conversions', header: 'Conversions', render: (row: { conversions: number }) => row.conversions.toLocaleString() },
                          { key: 'cpa', header: 'CPA' },
                        ]}
                        data={newReportData}
                        rowKey={(row: { id: string }) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-neutral-50'}
                        onRowClick={(row: { proposition: string }) => console.log('Navigate to proposition details for', row.proposition)}
                      />
                  </div>
                )
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            action={
              <Button variant="default" size="default">
                Build Report
              </Button>
            }
          />
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const FunnelView: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    // Filter states (multi-select for FilterBar)
    const [advertiserFilter, setAdvertiserFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [campaignFilter, setCampaignFilter] = useState<string[]>([]);
    const [goalFilter, setGoalFilter] = useState<string[]>([]);

    // Proposition states for each funnel card
    const [awarenessPropositions, setAwarenessPropositions] = useState<string[]>(['display', 'digital-instore', 'offline-instore']);
    const [considerationPropositions, setConsiderationPropositions] = useState<string[]>(['display', 'digital-instore', 'offline-instore']);
    const [purchasePropositions, setPurchasePropositions] = useState<string[]>(['display', 'sponsored-products', 'digital-instore', 'offline-instore']);
    const [loyaltyPropositions, setLoyaltyPropositions] = useState<string[]>(['sponsored-products', 'digital-instore']);

    const toggleProposition = (proposition: string, card: 'awareness' | 'consideration' | 'purchase' | 'loyalty') => {
      const setters = {
        awareness: setAwarenessPropositions,
        consideration: setConsiderationPropositions,
        purchase: setPurchasePropositions,
        loyalty: setLoyaltyPropositions,
      };

      setters[card](prev =>
        prev.includes(proposition)
          ? prev.filter(p => p !== proposition)
          : [...prev, proposition]
      );
    };

    // Metric selection states for each funnel card
    const [awarenessMetrics, setAwarenessMetrics] = useState<string[]>(['spaImpressions', 'impressions', 'omiDots', 'doohSpots', 'offsiteImpressions', 'sov', 'salesUplift']);
    const [considerationMetrics, setConsiderationMetrics] = useState<string[]>(['clicks', 'dots', 'displayClicks', 'viewability']);
    const [purchaseMetrics, setPurchaseMetrics] = useState<string[]>(['roas', 'iroas', 'purchaseBehavior', 'customerSegmentation']);
    const [loyaltyMetrics, setLoyaltyMetrics] = useState<string[]>(['repeatPurchaseRate', 'customerLifetimeValue', 'churnRate']);

    // Which of the nine top metrics show by default — the rest wait in the
    // Edit metrics picker. Impressions and Spend, then a Sales/ROAS pair at
    // the same (SKU) granularity so the default four read as one story.
    const [selectedTopMetrics, setSelectedTopMetrics] = useState<string[]>(['impressions', 'spend', 'salesSku', 'roasSku']);

    // Custom Report Dialog state
    const [customReportOpen, setCustomReportOpen] = useState(false);
    const [selectedReportMetrics, setSelectedReportMetrics] = useState<string[]>([]);

    const [buyerReachDetailsCollapsed, setBuyerReachDetailsCollapsed] = useState(false);

    // Funnel chart drives which stage card is visible
    type FunnelStageKey = 'awareness' | 'consideration' | 'purchase' | 'loyalty';
    const [selectedStage, setSelectedStage] = useState<FunnelStageKey>('awareness');

    // Handle Goal filter changes - select the matching stage tab
    useEffect(() => {
      if (goalFilter.length === 0) return;
      const stageGoal = (['awareness', 'consideration', 'purchase', 'loyalty'] as const).find(g =>
        goalFilter.includes(g)
      );
      if (stageGoal) setSelectedStage(stageGoal);
    }, [goalFilter]);

    const toggleReportMetric = (metric: string) => {
      setSelectedReportMetrics(prev =>
        prev.includes(metric)
          ? prev.filter(m => m !== metric)
          : [...prev, metric]
      );
    };

    const handleBuildReport = () => {
      console.log('Building report with metrics:', selectedReportMetrics);
      alert(`Building custom report with ${selectedReportMetrics.length} metrics:\n${selectedReportMetrics.join(', ')}`);
      setCustomReportOpen(false);
    };

    // ── What the numbers cover ─────────────────────────────────────────
    // One scope for the whole page: the session's date range (the year so
    // far when none is set) narrowed by the Advertiser, Brand and Campaign
    // filters. Every card, chart, funnel band and insight below reads it.
    const db = useDb();
    const session = useSessionFilters();
    const period = insightsWindow(session);
    const scope: PerformanceScope = React.useMemo(() => ({
      ...period,
      advertiserIds: advertiserFilter.length ? advertiserFilter : undefined,
      brandIds: brandFilter.length ? brandFilter : undefined,
      campaignIds: campaignFilter.length ? campaignFilter : undefined,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [period.from, period.to, advertiserFilter, brandFilter, campaignFilter]);
    const grain = grainFor(scope.from!, scope.to!);

    // Filter options come from the database: the advertisers, their brands
    // (narrowed to the advertisers picked) and their campaigns (narrowed to
    // the advertisers and brands picked).
    const advertiserOptions = db.advertisers.map((a) => ({ label: a.name, value: a.id }));
    const brandOptions = db.advertisers
      .filter((a) => !advertiserFilter.length || advertiserFilter.includes(a.id))
      .flatMap((a) => a.brands.map((b) => ({ label: b.name, value: b.id, description: a.name })));
    const campaignOptions = db.campaigns
      .filter((c) => {
        const plan = db.mediaPlans.find((p) => p.id === c.mediaPlanId);
        if (!plan) return false;
        if (advertiserFilter.length && !advertiserFilter.includes(plan.advertiserId)) return false;
        if (brandFilter.length && !plan.brandIds.some((id) => brandFilter.includes(id))) return false;
        return true;
      })
      .map((c) => ({ label: c.name, value: c.id, description: runLabel(c.startDate, c.endDate) }));

    // The period per month (week, day for a short range), whole and per
    // proposition, plus the window's totals and the period before.
    const model = React.useMemo(() => {
      const total = seriesFor(db, scope, grain);
      const perEngine = Object.fromEntries(ENGINE_ORDER.map((e) => [e, seriesFor(db, { ...scope, engine: e }, grain)])) as Record<EngineId, ReturnType<typeof seriesFor>>;
      const buckets = total.map((p, i) => ({
        month: p.label,
        total: p.totals,
        by: Object.fromEntries(ENGINE_ORDER.map((e) => [e, perEngine[e][i]?.totals ?? EMPTY])) as Record<EngineId, Totals>,
      }));
      const prevScope = previousPeriod(scope);
      const products = productSales(db, scope);
      const planned = plannedSpendInWindow(db, scope);
      return {
        buckets,
        totals: totalsFor(db, scope),
        byEngine: totalsByEngine(db, scope),
        prev: prevScope ? totalsFor(db, prevScope) : undefined,
        prevByEngine: prevScope ? totalsByEngine(db, prevScope) : undefined,
        products,
        planned,
        insights: funnelInsights(db, scope, products),
      };
    }, [db, scope, grain]);
    const { buckets, totals, byEngine, prev, prevByEngine, planned, insights } = model;
    const SP: EngineId = 'sponsored-products';
    // Delivery at the plan's pace: what the booked budgets should have
    // bought by now. A chart's target line is that, per bucket.
    const pace = planned > 0 ? totals.spend / planned : 0;
    const perBucketTarget = (volume: number) => (pace > 0 && buckets.length ? volume / pace / buckets.length : undefined);
    const targetLine = (volume: number) => {
      const v = perBucketTarget(volume);
      return v !== undefined && v > 0 ? { value: Math.round(v), label: `Target ${fmtCount(v)}` } : undefined;
    };

    const impressionKeys = ['spaImpressions', 'impressions', 'omiDots', 'doohSpots', 'offsiteImpressions'] as const;
    const selectedImpressionKeys = impressionKeys.filter(k => awarenessMetrics.includes(k));

    const channelLabels: Record<string, string> = {
      spaImpressions: 'Sponsored Products',
      impressions: 'Display',
      omiDots: 'Digital Media In-store',
      doohSpots: 'Offline Media In-store',
      offsiteImpressions: 'Display Offsite',
    };

    // Each channel is a proposition: it is drawn in that proposition's
    // pattern and grey, the same everywhere the proposition appears.
    const channelEngines: Record<string, EngineId> = {
      spaImpressions: 'sponsored-products',
      impressions: 'display',
      omiDots: 'digital-instore',
      doohSpots: 'offline-instore',
      offsiteImpressions: 'offsite',
    };
    const channelColors: Record<string, string> = Object.fromEntries(
      Object.entries(channelEngines).map(([k, e]) => [k, PROPOSITION_PATTERNS[e].ink]),
    );

    // Awareness: impressions per proposition per bucket, with Spend and
    // Sales riding along as euro lines.
    const awarenessData = buckets.map((b) => {
      const row: Record<string, number | string> = { month: b.month, spend: Math.round(b.total.spend), revenue: Math.round(b.total.sales) };
      for (const k of impressionKeys) row[k] = Math.round(b.by[channelEngines[k]].impressions);
      return { ...row, totalVolume: selectedImpressionKeys.reduce((sum, k) => sum + (row[k] as number), 0) };
    });
    const impressionsTotal = selectedImpressionKeys.reduce((sum, k) => sum + byEngine[channelEngines[k]].impressions, 0);
    // The period's number is what it delivered start to finish.
    const totalVolumeLabel = fmtCount(impressionsTotal);

    const titleTooltips = {
      totalVolume: 'Total number of impressions across all selected channels. The sum of Sponsored Products, Display, Digital Media In-store and Offline Media In-store impressions.',
      totalSov: 'Weighted average share of voice across all selected channels. Indicates your brand visibility relative to competitors.',
      totalBuyerReach: 'Total unique buyers reached across all campaigns, segmented by new-to-brand, lapsed and existing customers.',
    };

    const engagementLabels: Record<string, string> = {
      spaClicks: 'SPA Clicks',
      displayClicks: 'Display Clicks',
      doohClicks: 'DOOH Clicks',
      omiClicks: 'OMI Clicks',
      offsiteClicks: 'Offsite Clicks',
    };
    const engagementEngines: Record<string, EngineId> = {
      spaClicks: 'sponsored-products',
      displayClicks: 'display',
      doohClicks: 'digital-instore',
      omiClicks: 'offline-instore',
      offsiteClicks: 'offsite',
    };
    const engagementColors: Record<string, string> = Object.fromEntries(
      Object.entries(engagementEngines).map(([k, e]) => [k, PROPOSITION_PATTERNS[e].ink]),
    );

    const unitLabels: Record<string, string> = {
      spaUnitsSold: 'Sponsored Products',
      displayUnitsSold: 'Display',
      dmiUnitsSold: 'Digital Media In-store',
      omiUnitsSold: 'Offline Media In-store',
      offsiteUnitsSold: 'Display Offsite',
    };
    const unitEngines: Record<string, EngineId> = {
      spaUnitsSold: 'sponsored-products',
      displayUnitsSold: 'display',
      dmiUnitsSold: 'digital-instore',
      omiUnitsSold: 'offline-instore',
      offsiteUnitsSold: 'offsite',
    };
    const unitColors: Record<string, string> = Object.fromEntries(
      Object.entries(unitEngines).map(([k, e]) => [k, PROPOSITION_PATTERNS[e].ink]),
    );

    const roasLabels: Record<string, string> = {
      spaRoas: 'Sponsored Products',
      displayRoas: 'Display',
      dmiRoas: 'Digital In-store',
      omiRoas: 'Offline In-store',
    };
    const roasEngines: Record<string, EngineId> = {
      spaRoas: 'sponsored-products',
      displayRoas: 'display',
      dmiRoas: 'digital-instore',
      omiRoas: 'offline-instore',
    };
    const roasColors: Record<string, string> = Object.fromEntries(
      Object.entries(roasEngines).map(([k, e]) => [k, PROPOSITION_PATTERNS[e].ink]),
    );

    const ctrLabels: Record<string, string> = {
      spaCtr: 'Sponsored Products',
      displayCtr: 'Display',
    };
    const ctrEngines: Record<string, EngineId> = {
      spaCtr: 'sponsored-products',
      displayCtr: 'display',
    };
    const ctrColors: Record<string, string> = Object.fromEntries(
      Object.entries(ctrEngines).map(([k, e]) => [k, PROPOSITION_PATTERNS[e].ink]),
    );

    // Consideration: clicks per proposition, CTR on the clickable ones.
    const considerationEngagementKeys = ['spaClicks', 'displayClicks', 'doohClicks', 'omiClicks', 'offsiteClicks'] as const;
    // A rate in a bucket with nothing served is no rate: a gap, not a zero.
    const ratePct = (num: number, den: number, digits = 2) => (den > 0 ? Number(((num / den) * 100).toFixed(digits)) : null);
    const considerationData = buckets.map((b) => {
      const row: Record<string, number | string | null> = { month: b.month, spend: Math.round(b.total.spend), revenue: Math.round(b.total.sales) };
      for (const k of considerationEngagementKeys) row[k] = Math.round(b.by[engagementEngines[k]].clicks);
      row.spaCtr = ratePct(b.by[SP].clicks, b.by[SP].impressions);
      row.displayCtr = ratePct(b.by.display.clicks, b.by.display.impressions);
      return { ...row, totalEngagements: considerationEngagementKeys.reduce((sum, k) => sum + (row[k] as number), 0) };
    });
    const totalEngagementsLabel = fmtCount(totals.clicks);
    // The CTR card's number: Sponsored Products and Display, blended.
    const ctrEngineList: EngineId[] = [SP, 'display'];
    const ctrClicks = ctrEngineList.reduce((s, e) => s + byEngine[e].clicks, 0);
    const ctrImpressions = ctrEngineList.reduce((s, e) => s + byEngine[e].impressions, 0);
    const totalCtr = ctrImpressions > 0 ? Number(((ctrClicks / ctrImpressions) * 100).toFixed(2)) : 0;
    const spendWeighted = (engines: EngineId[], k: 'ctr' | 'roas') => {
      const spend = engines.reduce((s, e) => s + byEngine[e].spend, 0);
      return spend > 0 ? engines.reduce((s, e) => s + BENCHMARKS[e][k] * byEngine[e].spend, 0) / spend : 0;
    };
    const ctrTargetPct = Number((spendWeighted(ctrEngineList, 'ctr') * 100).toFixed(2));
    const roasTargetPct = Math.round(spendWeighted(ENGINE_ORDER, 'roas') * 100);

    // Purchase: conversions and sales per proposition, ROAS per
    // proposition and blended, buyers by type and by proposition.
    const purchaseUnitKeys = ['spaUnitsSold', 'displayUnitsSold', 'dmiUnitsSold', 'omiUnitsSold', 'offsiteUnitsSold'] as const;
    const buyerLabels: Record<string, string> = {
      spaBuyers: 'Sponsored Products',
      displayBuyers: 'Display',
      dmiBuyers: 'Digital Media In-store',
      omiBuyers: 'Offline Media In-store',
      offsiteBuyers: 'Display Offsite',
    };
    const buyerEngines: Record<string, EngineId> = {
      spaBuyers: 'sponsored-products',
      displayBuyers: 'display',
      dmiBuyers: 'digital-instore',
      omiBuyers: 'offline-instore',
      offsiteBuyers: 'offsite',
    };
    const buyerKeys = Object.keys(buyerLabels);

    const purchaseData = buckets.map((b) => {
      const row: Record<string, number | string | null> = {
        month: b.month,
        spend: Math.round(b.total.spend),
        totalRevenue: Math.round(b.total.sales),
        roas: ratePct(b.total.sales, b.total.spend, 0),
        iroas: ratePct(b.total.incrementalSales, b.total.spend, 0),
        conversions: Math.round(b.total.conversions),
      };
      for (const k of purchaseUnitKeys) row[k] = Math.round(b.by[unitEngines[k]].conversions);
      for (const k of Object.keys(roasEngines)) row[k] = ratePct(b.by[roasEngines[k]].sales, b.by[roasEngines[k]].spend, 0);
      const split = buyerSplit(b.total);
      row.totalUnitsSold = purchaseUnitKeys.reduce((sum, k) => sum + (row[k] as number), 0);
      row.totalBuyers = Math.round(split.buyers);
      row.newBuyers = Math.round(split.newToBrand);
      row.lapsedBuyers = Math.round(split.lapsed);
      row.existingBuyers = Math.round(split.existing);
      // New-to-brand's share of the bucket's sales, in proportion to its
      // share of buyers — the count alone doesn't say what they were worth.
      row.newBuyerRevenue = split.buyers > 0 ? Math.round((split.newToBrand / split.buyers) * b.total.sales) : 0;
      for (const k of buyerKeys) row[k] = Math.round(buyerSplit(b.by[buyerEngines[k]]).buyers);
      return row;
    });
    const totalBuyers = buyerSplit(totals);
    const buyerTarget = targetLine(totalBuyers.buyers);

    // Revenue by product: the best and the weakest sellers in scope, each
    // tagged with the proposition that sold most of it.
    const revenueByProductData = model.products.slice(0, 5);
    const leastPerformingProductData = model.products.length > 1 ? model.products.slice(Math.max(1, model.products.length - 5)) : [];

    // The nine metrics this dashboard tracks, at a locked 14-day
    // attribution window — the picker only adds among these. Sponsored
    // Products is the proposition that targets specific SKUs, so it stands
    // in for SKU-level reporting; the blended totals across every
    // proposition stand in for brand-level. Each card's number is the
    // window's total, its badge the change on the period before, its chart
    // the same buckets the stage charts below plot.
    const formatEur = fmtEuro;
    const prevSp = prevByEngine?.[SP];
    const clicksDisplaySpa = (by: Record<EngineId, Totals>) => by[SP].clicks + by.display.clicks;
    const roasPct = (t: Totals) => `${Math.round(ratesOf(t).roas * 100)}%`;
    const topMetrics: MetricDefinition[] = [
      {
        key: 'impressions',
        label: 'Impressions',
        value: fmtCount(totals.impressions),
        ...changeBadge(totals.impressions, prev?.impressions),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(b.total.impressions) })),
      },
      {
        key: 'clicks',
        label: 'Clicks (Display & SPA)',
        value: fmtCount(clicksDisplaySpa(byEngine)),
        ...changeBadge(clicksDisplaySpa(byEngine), prevByEngine ? clicksDisplaySpa(prevByEngine) : undefined),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(clicksDisplaySpa(b.by)) })),
      },
      {
        key: 'spend',
        label: 'Spend',
        value: formatEur(totals.spend),
        ...changeBadge(totals.spend, prev?.spend),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(b.total.spend) })),
      },
      {
        key: 'salesSku',
        label: 'Sales SKU',
        subMetric: '14 days',
        value: formatEur(byEngine[SP].sales),
        ...changeBadge(byEngine[SP].sales, prevSp?.sales),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(b.by[SP].sales) })),
      },
      {
        key: 'salesBrand',
        label: 'Sales brand',
        subMetric: '14 days',
        value: formatEur(totals.sales),
        ...changeBadge(totals.sales, prev?.sales),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(b.total.sales) })),
      },
      {
        key: 'unitsSku',
        label: 'Units sold SKU',
        subMetric: '14 days',
        value: fmtCount(byEngine[SP].units),
        ...changeBadge(byEngine[SP].units, prevSp?.units),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(b.by[SP].units) })),
      },
      {
        key: 'unitsBrand',
        label: 'Units sold brand',
        subMetric: '14 days',
        value: fmtCount(totals.units),
        ...changeBadge(totals.units, prev?.units),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(b.total.units) })),
      },
      {
        key: 'roasSku',
        label: 'ROAS SKU',
        subMetric: '14 days',
        value: roasPct(byEngine[SP]),
        ...changeBadge(ratesOf(byEngine[SP]).roas, prevSp ? ratesOf(prevSp).roas : undefined),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(ratesOf(b.by[SP]).roas * 100) })),
      },
      {
        key: 'roasBrand',
        label: 'ROAS Brand',
        subMetric: '14 days',
        value: roasPct(totals),
        ...changeBadge(ratesOf(totals).roas, prev ? ratesOf(prev).roas : undefined),
        chartData: buckets.map(b => ({ day: b.month, value: Math.round(ratesOf(b.total).roas * 100) })),
      },
    ];

    // Conversion funnel: impressions → clicks → conversions, each band
    // split by the propositions that delivered it over the window.
    const stageBreakdown = (value: (t: Totals) => number, engines: EngineId[] = ENGINE_ORDER) =>
      Object.fromEntries(engines.map((e) => [e, Math.round(value(byEngine[e]))])) as Partial<Record<EngineId, number>>;
    const funnelStages = [
      {
        key: 'awareness',
        label: 'Awareness',
        value: Math.round(impressionsTotal),
        breakdown: stageBreakdown((t) => t.impressions, selectedImpressionKeys.map((k) => channelEngines[k])),
      },
      {
        key: 'consideration',
        label: 'Consideration',
        value: Math.round(totals.clicks),
        breakdown: stageBreakdown((t) => t.clicks),
      },
      {
        key: 'purchase',
        label: 'Purchase',
        value: Math.round(totals.conversions),
        breakdown: stageBreakdown((t) => t.conversions),
      },
      // Loyalty is hidden for now — there's no real reporting behind it yet.
    ];

    return (
      <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Insights dashboard',
          subtitle: 'Complete customer journey from awareness to purchase',
          // The advertiser picker moves into the page's own filter row,
          // next to Brand — an empty node (not null) is what actually
          // suppresses AppLayout's default header one; null still falls
          // through to it.
          headerRight: <></>,
        }}
      >
        <div className="space-y-section">
          {/* Top Metric Cards — the dashboard's filters sit in the row's header,
              beside Edit metrics: what the numbers cover and which numbers show. */}
          <MetricRow
            hideDateRange
            headerLeft={
              <>
              {/* This row already carries outlined filters (Proposition,
                  Brand…) rather than sitting beside the quiet tab strip, so
                  the date range matches them instead of its usual ghost. */}
              <SessionDateRange variant="outline" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Proposition
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={awarenessMetrics.includes('spaImpressions')}
                    onCheckedChange={(checked) => {
                      setAwarenessMetrics(prev =>
                        checked ? [...prev, 'spaImpressions'] : prev.filter(m => m !== 'spaImpressions')
                      );
                    }}
                  >
                    Sponsored Products
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={awarenessMetrics.includes('impressions')}
                    onCheckedChange={(checked) => {
                      setAwarenessMetrics(prev =>
                        checked ? [...prev, 'impressions'] : prev.filter(m => m !== 'impressions')
                      );
                    }}
                  >
                    Display
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={awarenessMetrics.includes('omiDots')}
                    onCheckedChange={(checked) => {
                      setAwarenessMetrics(prev =>
                        checked ? [...prev, 'omiDots'] : prev.filter(m => m !== 'omiDots')
                      );
                    }}
                  >
                    Digital Media In-store
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={awarenessMetrics.includes('doohSpots')}
                    onCheckedChange={(checked) => {
                      setAwarenessMetrics(prev =>
                        checked ? [...prev, 'doohSpots'] : prev.filter(m => m !== 'doohSpots')
                      );
                    }}
                  >
                    Offline Media In-store
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={awarenessMetrics.includes('offsiteImpressions')}
                    onCheckedChange={(checked) => {
                      setAwarenessMetrics(prev =>
                        checked ? [...prev, 'offsiteImpressions'] : prev.filter(m => m !== 'offsiteImpressions')
                      );
                    }}
                  >
                    Display Offsite
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex-1">
                <FilterBar
                  filters={[
                    {
                      // The advertiser picker, moved out of the page header
                      // and in as a filter like the rest of what the
                      // numbers cover — multi-select, same as Brand.
                      name: 'Advertiser',
                      options: advertiserOptions,
                      selectedValues: advertiserFilter,
                      onChange: setAdvertiserFilter
                    },
                    {
                      name: 'Brand',
                      options: brandOptions,
                      selectedValues: brandFilter,
                      onChange: setBrandFilter
                    },
                    {
                      name: 'Campaign',
                      options: campaignOptions,
                      selectedValues: campaignFilter,
                      onChange: setCampaignFilter
                    },
                    {
                      name: 'Goal',
                      options: [
                        { label: 'Awareness', value: 'awareness' },
                        { label: 'Consideration', value: 'consideration' },
                        { label: 'Purchase', value: 'purchase' },
                      ],
                      selectedValues: goalFilter,
                      onChange: setGoalFilter
                    }
                  ]}
                  hideSearch={true}
                />
              </div>
              </>
            }
            // The number leads on every card; a chart opens when the card
            // itself is clicked, like every other metric row.
            metrics={topMetrics}
            showCharts
            selectedKeys={selectedTopMetrics}
            onSelectionChange={setSelectedTopMetrics}
            maxSelectable={topMetrics.length}
          />

          {/* Conversion Funnel Breakdown + selected stage section */}
          <div>
            <div className="flex items-end w-full gap-3" style={{ minHeight: 56 }}>
              <div className="flex gap-0 flex-1">
                {funnelStages.map((stage) => {
                  const active = selectedStage === stage.key;
                  return (
                    <button
                      key={stage.key}
                      type="button"
                      onClick={() => setSelectedStage(stage.key as FunnelStageKey)}
                      className={cn(
                        "px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors",
                        active
                          ? "font-medium bg-card text-card-foreground border-border z-10"
                          : "font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground"
                      )}
                      style={{ position: 'relative', top: 1 }}
                    >
                      {stage.label}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="default"
                className="whitespace-nowrap flex-shrink-0 mb-2"
                onClick={() => setCustomReportOpen(true)}
              >
                Build Report
              </Button>
            </div>
          <Card className={cn("w-full", selectedStage === funnelStages[0].key && "rounded-tl-none")}>
            <CardContent className="px-6 pt-6 pb-0">
              {/* Funnel chart in its own bordered card, like Total Volume below —
                  same padding as every other chart card. */}
              <Card className="overflow-hidden">
                <CardContent className="pt-6">
                  <ConversionFunnelComponent
                    stages={funnelStages}
                    selectedKey={selectedStage}
                    onStageClick={(key) => setSelectedStage(key as FunnelStageKey)}
                    valueFormatter={(v) =>
                      v >= 1000 ? `${Math.round(v / 1000)}K` : v.toLocaleString()
                    }
                    showTooltip={false}
                    bleedPadding={24}
                  />
                </CardContent>
              </Card>
            </CardContent>

            <div className="pt-6">
          {/* Awareness section */}
          {selectedStage === 'awareness' && (
          <>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Row 1 - Total Volume with selected impression type cards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Impressions {totalVolumeLabel}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>{titleTooltips.totalVolume}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    {/* The per-channel breakdown used to sit here as a row of
                        badges — now it only shows on hover, in the chart's
                        own tooltip, which already carries the same pattern
                        swatch and the exact value for that point. */}
                  </CardHeader>
                  <CardContent>
                    <AreaChartComponent
                      data={awarenessData}
                      config={{
                        ...Object.fromEntries(
                          selectedImpressionKeys.map(k => [k, { label: channelLabels[k], color: channelColors[k], engine: channelEngines[k] }])
                        ),
                        // Spend and Sales both ride the volume as dashed
                        // lines on the same euro axis.
                        spend: { label: 'Spend', color: 'hsl(var(--chart-950))', kind: 'line' as const, format: (v: number) => `€${Math.round(v / 1000)}K` },
                        revenue: { label: 'Sales', color: 'hsl(var(--chart-700))', kind: 'line' as const, format: (v: number) => `€${Math.round(v / 1000)}K` },
                      }}
                      stacked={true}
                      totalLabel="Total impressions"
                      outcome={{ spend: 'spend', revenue: 'revenue' }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      showRightYAxis={true}
                      benchmark={targetLine(impressionsTotal)}
                      className="h-[320px] w-full"
                    />
                    {/* What this chart is saying — cases open in the drawer. */}
                    <CardInsightList insights={insights.volume} variant="compact" className="mt-4" />
                  </CardContent>
                </Card>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 w-fit"
                  onClick={() => alert('Full Awareness Report')}
                >
                  Full Report
                </Button>
              </div>
            </CardContent>
          </>
          )}

          {/* Consideration section */}
          {selectedStage === 'consideration' && (
          <>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Row 1 - Total Engagements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Engagements {totalEngagementsLabel}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Total number of clicks and interactions across all channels</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    {/* The per-channel breakdown used to sit here as a row of
                        badges — now it only shows on hover, in the chart's
                        own tooltip, which already carries the same pattern
                        swatch and the exact value for that point. */}
                  </CardHeader>
                  <CardContent>
                    <AreaChartComponent
                      // Sales rides alongside Spend, read from the same
                      // months of purchaseData Purchase itself uses — the
                      // two tabs never disagree on what the period sold.
                      data={considerationData}
                      config={{
                        ...Object.fromEntries(
                          considerationEngagementKeys.map(k => [k, { label: engagementLabels[k], color: engagementColors[k], engine: engagementEngines[k] }])
                        ),
                        spend: { label: 'Spend', color: 'hsl(var(--chart-950))', kind: 'line' as const, format: (v: number) => `€${Math.round(v / 1000)}K` },
                        revenue: { label: 'Sales', color: 'hsl(var(--chart-700))', kind: 'line' as const, format: (v: number) => `€${Math.round(v / 1000)}K` },
                      }}
                      stacked={true}
                      totalLabel="Total engagements"
                      outcome={{ spend: 'spend', revenue: 'revenue' }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      showRightYAxis={true}
                      benchmark={targetLine(totals.clicks)}
                      className="h-[320px] w-full"
                    />
                    {/* What this chart is saying — cases open in the drawer. */}
                    <CardInsightList insights={insights.engagement} variant="compact" className="mt-4" />
                  </CardContent>
                </Card>

                {/* Row 2 - Total CTR */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total CTR {totalCtr}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Average click-through rate across channels. Percentage of ads clicked vs impressions served.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    {/* The per-channel breakdown used to sit here as a row of
                        badges — now it only shows on hover, in the chart's
                        own tooltip, which already carries the same pattern
                        swatch and the exact value for that point. */}
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={considerationData}
                      // CTR is a rate, not a volume: one solid line per
                      // proposition, in the ink its pattern wears everywhere
                      // else — same as ROAS on the Purchase tab.
                      config={{
                        spaCtr: { label: ctrLabels.spaCtr, color: ctrColors.spaCtr, engine: ctrEngines.spaCtr },
                        displayCtr: { label: ctrLabels.displayCtr, color: ctrColors.displayCtr, engine: ctrEngines.displayCtr },
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      showDots={true}
                      benchmark={ctrTargetPct > 0 ? { value: ctrTargetPct, label: `Target ${ctrTargetPct}%` } : undefined}
                      className="h-[320px] w-full"
                      xAxisDataKey="month"
                    />
                    {/* What this chart is saying — cases open in the drawer. */}
                    <CardInsightList insights={insights.ctr} variant="compact" className="mt-4" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </>
          )}

          {/* Purchase section */}
          {selectedStage === 'purchase' && (
          <>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Row 1 - Total Conversions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Conversions {Math.round(totals.conversions).toLocaleString('en-GB')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Total purchases attributed across all proposition channels</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    {/* The per-channel breakdown used to sit here as a row of
                        badges — now it only shows on hover, in the chart's
                        own tooltip, which already carries the same pattern
                        swatch and the exact value for that point. */}
                  </CardHeader>
                  <CardContent>
                    <AreaChartComponent
                      data={purchaseData}
                      config={{
                        ...Object.fromEntries(
                          purchaseUnitKeys.map(k => [k, { label: unitLabels[k], color: unitColors[k], engine: unitEngines[k] }])
                        ),
                        spend: { label: 'Spend', color: 'hsl(var(--chart-950))', kind: 'line' as const, format: (v: number) => `€${Math.round(v / 1000)}K` },
                        totalRevenue: { label: 'Sales', color: 'hsl(var(--chart-700))', kind: 'line' as const, format: (v: number) => `€${Math.round(v / 1000)}K` },
                      }}
                      stacked={true}
                      totalLabel="Total conversions"
                      outcome={{ spend: 'spend', revenue: 'totalRevenue' }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      showRightYAxis={true}
                      benchmark={targetLine(totals.conversions)}
                      className="h-[320px] w-full"
                    />
                    {/* What this chart is saying — cases open in the drawer. */}
                    <CardInsightList insights={insights.units} variant="compact" className="mt-4" />
                  </CardContent>
                </Card>

                {/* Row 1.5 - Revenue by Product SKU: best and worst side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        Top Products SKU (14 days) {formatEur(revenueByProductData.reduce((sum, p) => sum + p.value, 0))}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>The named products behind Sales SKU (14 days), highest revenue first.</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChartComponent
                        data={revenueByProductData}
                        config={{ value: { label: 'Revenue', color: 'hsl(var(--chart-2))' } }}
                        horizontal
                        colorByPoint="color"
                        patternByPoint="engine"
                        xAxisDataKey="name"
                        showLegend={false}
                        showGrid={true}
                        showTooltip={true}
                        showXAxis={true}
                        showYAxis={true}
                        className="h-[220px] w-full"
                      />
                      {/* What this chart is saying — cases open in the drawer. */}
                      <CardInsightList insights={insights.topProducts} variant="compact" className="mt-4" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        Lowest Performing Products {formatEur(leastPerformingProductData.reduce((sum, p) => sum + p.value, 0))}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>The named products selling the least in the last 14 days — candidates to drop from the plan or re-target.</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChartComponent
                        data={leastPerformingProductData}
                        config={{ value: { label: 'Revenue', color: 'hsl(var(--chart-2))' } }}
                        horizontal
                        colorByPoint="color"
                        patternByPoint="engine"
                        xAxisDataKey="name"
                        showLegend={false}
                        showGrid={true}
                        showTooltip={true}
                        showXAxis={true}
                        showYAxis={true}
                        className="h-[220px] w-full"
                      />
                      {/* What this chart is saying — cases open in the drawer. */}
                      <CardInsightList insights={insights.lowProducts} variant="compact" className="mt-4" />
                    </CardContent>
                  </Card>
                </div>

                {/* Row 2 - ROAS */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      ROAS {roasPct(totals)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Return on ad spend across Display, SPA, DMI and OMI channels</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    {/* The per-channel breakdown used to sit here as a row of
                        badges — now it only shows on hover, in the chart's
                        own tooltip, which already carries the same pattern
                        swatch and the exact value for that point. */}
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={purchaseData}
                      // ROAS is a rate, not a volume: one solid line per
                      // proposition, in the ink its pattern wears everywhere
                      // else. Overlaid patterned areas hid one another; lines
                      // stay apart whatever their values.
                      config={Object.fromEntries(
                        (['spaRoas', 'displayRoas', 'dmiRoas', 'omiRoas'] as const).map(k => [k, { label: roasLabels[k], color: roasColors[k], engine: roasEngines[k] }])
                      )}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      showDots={true}
                      benchmark={roasTargetPct > 0 ? { value: roasTargetPct, label: `Target ${roasTargetPct}%` } : undefined}
                      className="h-[320px] w-full"
                      xAxisDataKey="month"
                    />
                    {/* What this chart is saying — cases open in the drawer. */}
                    <CardInsightList insights={insights.roas} variant="compact" className="mt-4" />
                  </CardContent>
                </Card>

                {/* Row 3 - Purchase Users, by buyer type and by proposition side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Purchase Users {Math.round(totalBuyers.buyers).toLocaleString('en-GB')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Unique count of customers that made a purchase, split by new-to-brand, lapsed and existing buyers</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    {/* The buyer-type split and new-to-brand revenue used to
                        sit here as badges — now they only show on hover, in
                        the chart's own tooltip. */}
                  </CardHeader>
                  <CardContent>
                    <AreaChartComponent
                      data={purchaseData}
                      config={{
                        // Buyer types aren't propositions, so they wear flat
                        // colours, not the proposition patterns.
                        newBuyers: { label: "New-to-brand", color: "hsl(var(--chart-1))" },
                        lapsedBuyers: { label: "Lapsed", color: "hsl(var(--chart-2))" },
                        existingBuyers: { label: "Existing", color: "hsl(var(--chart-3))" },
                        // New-to-brand's revenue rides the buyers as a euro
                        // line — the count alone doesn't say what those
                        // buyers were worth.
                        newBuyerRevenue: { label: 'New-to-brand revenue', color: 'hsl(var(--chart-700))', kind: 'line' as const, format: (v: number) => `€${Math.round(v / 1000)}K` },
                      }}
                      stacked={true}
                      totalLabel="Total buyers"
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      showRightYAxis={true}
                      benchmark={buyerTarget}
                      className="h-[320px] w-full"
                    />
                    {/* What this chart is saying — cases open in the drawer. */}
                    <CardInsightList insights={insights.buyer} variant="compact" className="mt-4" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Purchase Users by Proposition {Math.round(totalBuyers.buyers).toLocaleString('en-GB')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>The same buyers, split by the proposition that won them — in proportion to each proposition's share of units sold.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* A donut, not a trend: the split is the point here, and a
                        ring shows five shares at a glance where stacked
                        months made the reader compare band widths. Each
                        slice wears its proposition's pattern. */}
                    <PieChartComponent
                      // Each slice is labelled with its share; the count
                      // itself is in the tooltip, and the total in the title.
                      data={buyerKeys.map(k => {
                        const value = Math.round(buyerSplit(byEngine[buyerEngines[k]]).buyers);
                        return { name: buyerLabels[k], value, label: totalBuyers.buyers > 0 ? `${Math.round((value / totalBuyers.buyers) * 100)}%` : '0%' };
                      })}
                      config={Object.fromEntries(
                        buyerKeys.map(k => [buyerLabels[k], { label: buyerLabels[k], engine: buyerEngines[k] }])
                      )}
                      showLegend={false}
                      showTooltip={true}
                      className="h-[320px] w-full"
                      nameKey="name"
                      dataKey="value"
                      innerRadius={64}
                      outerRadius={104}
                      showLabels={true}
                      labelPosition="inside"
                      startAngle={90}
                      endAngle={-270}
                    />
                    {/* What this chart is saying — cases open in the drawer. */}
                    <CardInsightList insights={insights.buyerProposition} variant="compact" className="mt-4" />
                  </CardContent>
                </Card>
                </div>
              </div>
            </CardContent>
          </>
          )}
            </div>
          </Card>
          </div>
        </div>
      </AppLayout>

      {/* Custom Report Dialog */}
      <Dialog open={customReportOpen} onOpenChange={setCustomReportOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
            <DialogDescription>
              Select the metrics you want to include in your custom report. Metrics are organized by funnel stage.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[50vh] overflow-y-auto pr-4">
            {/* Awareness Metrics Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Awareness Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-impressions"
                    checked={selectedReportMetrics.includes('impressions')}
                    onCheckedChange={() => toggleReportMetric('impressions')}
                  />
                  <Label htmlFor="metric-impressions" className="text-sm font-normal cursor-pointer">
                    Total Impressions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-display-impressions"
                    checked={selectedReportMetrics.includes('displayImpressions')}
                    onCheckedChange={() => toggleReportMetric('displayImpressions')}
                  />
                  <Label htmlFor="metric-display-impressions" className="text-sm font-normal cursor-pointer">
                    Display Impressions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-omi-dots"
                    checked={selectedReportMetrics.includes('omiDots')}
                    onCheckedChange={() => toggleReportMetric('omiDots')}
                  />
                  <Label htmlFor="metric-omi-dots" className="text-sm font-normal cursor-pointer">
                    OMI otS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-dooh-dots"
                    checked={selectedReportMetrics.includes('doohDots')}
                    onCheckedChange={() => toggleReportMetric('doohDots')}
                  />
                  <Label htmlFor="metric-dooh-dots" className="text-sm font-normal cursor-pointer">
                    DooH DotS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-sov"
                    checked={selectedReportMetrics.includes('shareOfVoice')}
                    onCheckedChange={() => toggleReportMetric('shareOfVoice')}
                  />
                  <Label htmlFor="metric-sov" className="text-sm font-normal cursor-pointer">
                    Share of Voice
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-sales-uplift"
                    checked={selectedReportMetrics.includes('salesUplift')}
                    onCheckedChange={() => toggleReportMetric('salesUplift')}
                  />
                  <Label htmlFor="metric-sales-uplift" className="text-sm font-normal cursor-pointer">
                    Sales Uplift
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-reach"
                    checked={selectedReportMetrics.includes('reach')}
                    onCheckedChange={() => toggleReportMetric('reach')}
                  />
                  <Label htmlFor="metric-reach" className="text-sm font-normal cursor-pointer">
                    Reach
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-frequency"
                    checked={selectedReportMetrics.includes('frequency')}
                    onCheckedChange={() => toggleReportMetric('frequency')}
                  />
                  <Label htmlFor="metric-frequency" className="text-sm font-normal cursor-pointer">
                    Frequency
                  </Label>
                </div>
              </div>
            </div>

            {/* Consideration Metrics Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Consideration Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-clicks"
                    checked={selectedReportMetrics.includes('clicks')}
                    onCheckedChange={() => toggleReportMetric('clicks')}
                  />
                  <Label htmlFor="metric-clicks" className="text-sm font-normal cursor-pointer">
                    Total Clicks
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-display-clicks"
                    checked={selectedReportMetrics.includes('displayClicks')}
                    onCheckedChange={() => toggleReportMetric('displayClicks')}
                  />
                  <Label htmlFor="metric-display-clicks" className="text-sm font-normal cursor-pointer">
                    Display Clicks
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-dooh-dots-pops"
                    checked={selectedReportMetrics.includes('doohDotsPops')}
                    onCheckedChange={() => toggleReportMetric('doohDotsPops')}
                  />
                  <Label htmlFor="metric-dooh-dots-pops" className="text-sm font-normal cursor-pointer">
                    DooH DotS (POPs)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-viewability"
                    checked={selectedReportMetrics.includes('viewability')}
                    onCheckedChange={() => toggleReportMetric('viewability')}
                  />
                  <Label htmlFor="metric-viewability" className="text-sm font-normal cursor-pointer">
                    Viewability
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-ctr"
                    checked={selectedReportMetrics.includes('ctr')}
                    onCheckedChange={() => toggleReportMetric('ctr')}
                  />
                  <Label htmlFor="metric-ctr" className="text-sm font-normal cursor-pointer">
                    Click-Through Rate (CTR)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-engagement-rate"
                    checked={selectedReportMetrics.includes('engagementRate')}
                    onCheckedChange={() => toggleReportMetric('engagementRate')}
                  />
                  <Label htmlFor="metric-engagement-rate" className="text-sm font-normal cursor-pointer">
                    Engagement Rate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-video-completion"
                    checked={selectedReportMetrics.includes('videoCompletion')}
                    onCheckedChange={() => toggleReportMetric('videoCompletion')}
                  />
                  <Label htmlFor="metric-video-completion" className="text-sm font-normal cursor-pointer">
                    Video Completion Rate
                  </Label>
                </div>
              </div>
            </div>

            {/* Purchase Metrics Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Purchase Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-roas"
                    checked={selectedReportMetrics.includes('roas')}
                    onCheckedChange={() => toggleReportMetric('roas')}
                  />
                  <Label htmlFor="metric-roas" className="text-sm font-normal cursor-pointer">
                    ROAS (Return on Ad Spend)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-iroas"
                    checked={selectedReportMetrics.includes('iroas')}
                    onCheckedChange={() => toggleReportMetric('iroas')}
                  />
                  <Label htmlFor="metric-iroas" className="text-sm font-normal cursor-pointer">
                    iROAS (Incremental ROAS)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-purchase-behavior"
                    checked={selectedReportMetrics.includes('purchaseBehavior')}
                    onCheckedChange={() => toggleReportMetric('purchaseBehavior')}
                  />
                  <Label htmlFor="metric-purchase-behavior" className="text-sm font-normal cursor-pointer">
                    Attributable Purchase Behavior
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-conversion-rate"
                    checked={selectedReportMetrics.includes('conversionRate')}
                    onCheckedChange={() => toggleReportMetric('conversionRate')}
                  />
                  <Label htmlFor="metric-conversion-rate" className="text-sm font-normal cursor-pointer">
                    Conversion Rate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-revenue"
                    checked={selectedReportMetrics.includes('revenue')}
                    onCheckedChange={() => toggleReportMetric('revenue')}
                  />
                  <Label htmlFor="metric-revenue" className="text-sm font-normal cursor-pointer">
                    Total Revenue
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-ad-spend"
                    checked={selectedReportMetrics.includes('adSpend')}
                    onCheckedChange={() => toggleReportMetric('adSpend')}
                  />
                  <Label htmlFor="metric-ad-spend" className="text-sm font-normal cursor-pointer">
                    Total Ad Spend
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-cpa"
                    checked={selectedReportMetrics.includes('cpa')}
                    onCheckedChange={() => toggleReportMetric('cpa')}
                  />
                  <Label htmlFor="metric-cpa" className="text-sm font-normal cursor-pointer">
                    Cost Per Acquisition (CPA)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-cpc"
                    checked={selectedReportMetrics.includes('cpc')}
                    onCheckedChange={() => toggleReportMetric('cpc')}
                  />
                  <Label htmlFor="metric-cpc" className="text-sm font-normal cursor-pointer">
                    Cost Per Click (CPC)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-basket-size"
                    checked={selectedReportMetrics.includes('basketSize')}
                    onCheckedChange={() => toggleReportMetric('basketSize')}
                  />
                  <Label htmlFor="metric-basket-size" className="text-sm font-normal cursor-pointer">
                    Average Basket Size
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-customer-ltv"
                    checked={selectedReportMetrics.includes('customerLTV')}
                    onCheckedChange={() => toggleReportMetric('customerLTV')}
                  />
                  <Label htmlFor="metric-customer-ltv" className="text-sm font-normal cursor-pointer">
                    Customer Lifetime Value (LTV)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCustomReportOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuildReport}
              disabled={selectedReportMetrics.length === 0}
            >
              Build Report ({selectedReportMetrics.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </MenuContextProvider>
    );
  },
};