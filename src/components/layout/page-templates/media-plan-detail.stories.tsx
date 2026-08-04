import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { MetricRow, type MetricDefinition } from '@/components/ui/metric-row';
import { Badge } from '@/components/ui/badge';
import {
  CardWithTabs,
  BudgetStackedMini,
  BudgetStackedDetail,
  DonutLegendDetail,
  BarHorizontalMini,
  BarHorizontalDetail,
} from '@/components/ui/card';
import { Table, type TableColumn } from '@/components/ui/table';
import { FilterBar } from '@/components/ui/filter-bar';
import { FormSection } from '@/components/ui/form-section';
import { GoalCard } from '@/components/ui/goal-card';
import { ReadOnlyField } from '@/components/ui/read-only-field';
import { SearchSelectList } from '@/components/ui/search-select-list';
import { Checkbox } from '@/components/ui/checkbox';
import { RetailProductSelect } from '@/components/ui/retail-product-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DateRangePicker, futureDateRangePresets } from '@/components/ui/date-picker';
import { DollarSign, Lock } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, XCircle, CornerDownRight, ListStart, MonitorSpeaker, MonitorPlay, Store, Globe, Eye, Brain, ShoppingCart, Heart, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useDb, updateMediaPlan, deleteCampaign, deriveMessages, type EngineId, type PlanStatus } from '@/lib/db';
import { InboxPanel } from '@/components/ui/inbox-panel';
import { InsightsTab } from './insights-tab';
import { describeObjective, describeKpi } from '@/lib/objective-kpi-copy';
import { propositionColor, propositionLabel } from '@/lib/proposition-colors';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Media Plan Detail',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

// The campaigns & bookings table renders live rows from the prototype
// database (media plan → campaigns → bookings), formatted via these helpers.

const fmtEuro = (n: number) => `€${n.toLocaleString()}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtRange = (start: string, end: string) => `${fmtDate(start)} → ${fmtDate(end)}`;
// Goal catalog — same shape as the create-media-plan wizard's goal cards.
const goals = [
  { id: 'awareness', icon: <Eye size={24} />, title: 'Awareness', description: 'Reach a broad audience and make them aware of your brand, product or service' },
  { id: 'consideration', icon: <Brain size={24} />, title: 'Consideration', description: 'Encourage people to think about your brand and seek out more information' },
  { id: 'purchase', icon: <ShoppingCart size={24} />, title: 'Purchase', description: 'Drive sales and conversions on your website, in your app or in physical stores' },
  { id: 'loyalty', icon: <Heart size={24} />, title: 'Loyalty', description: 'Strengthen existing customer relationships and drive repeat purchases' },
];
// Each option carries a one-liner so the selected card explains what the
// objective/KPI stands for (shared copy: src/lib/objective-kpi-copy.ts).
const objectiveOptions = [
  { label: 'Merkbekendheid', value: 'merkbekendheid', description: describeObjective('merkbekendheid') },
  { label: 'Productbekendheid', value: 'productbekendheid', description: describeObjective('productbekendheid') },
  { label: 'Merk associaties', value: 'merk-associaties', description: describeObjective('merk-associaties') },
];
const kpiFilterOptions = [
  { label: 'Top of Mind Awareness', value: 'toma', description: describeKpi('toma') },
  { label: 'Spontane merk/productbekendheid', value: 'spontaan', description: describeKpi('spontaan') },
  { label: 'Reclamebekendheid (Ad-recall)', value: 'adrecall', description: describeKpi('adrecall') },
  { label: 'CEP', value: 'cep', description: describeKpi('cep') },
];
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'In-option', value: 'in-option' },
  { label: 'Running', value: 'running' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

// Change history for the Logs tab.
type LogRow = { id: string; timestamp: string; user: string; action: string; field: string; oldValue: string; newValue: string; description: string };
const logData: LogRow[] = [
  { id: 'LOG-001', timestamp: '2026-05-28 14:30:00', user: 'Jane Doe', action: 'Media plan created', field: 'Media plan', oldValue: '-', newValue: 'Holiday Sale Plan', description: 'Initial media plan creation' },
  { id: 'LOG-002', timestamp: '2026-05-28 14:35:12', user: 'Jane Doe', action: 'Budget updated', field: 'Budget', oldValue: '$10,000', newValue: '$15,000', description: 'Budget increased for holiday push' },
  { id: 'LOG-003', timestamp: '2026-05-29 09:15:33', user: 'Sarah Wilson', action: 'Campaign added', field: 'Campaigns', oldValue: '-', newValue: 'SP - Early Capout Candidate', description: 'Added sponsored products campaign' },
  { id: 'LOG-004', timestamp: '2026-05-29 10:45:21', user: 'John Smith', action: 'Objective set', field: 'Objective', oldValue: '-', newValue: 'Merkbekendheid', description: 'Awareness objective selected' },
  { id: 'LOG-005', timestamp: '2026-05-30 11:30:14', user: 'Mike Johnson', action: 'Dates modified', field: 'Run time', oldValue: 'Jun 5, 2026', newValue: 'Jun 1, 2026', description: 'Brought the start date forward' },
  { id: 'LOG-006', timestamp: '2026-05-30 16:20:58', user: 'Jane Doe', action: 'Status changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Media plan moved to in-option' },
];

// Proposition shown as icon + text (not a coloured badge) — one per engine.
const propositionMeta: Record<EngineId, { icon: LucideIcon; label: string }> = {
  'sponsored-products': { icon: ListStart, label: 'Sponsored products' },
  'display': { icon: MonitorSpeaker, label: 'Display' },
  'digital-instore': { icon: MonitorPlay, label: 'Digital in-store' },
  'offline-instore': { icon: Store, label: 'Offline in-store' },
  'offsite': { icon: Globe, label: 'Offsite' },
};
// Entity status → badge (campaign State + booking status share the treatment).
const statusBadge: Record<PlanStatus, { variant: 'success' | 'secondary' | 'warning' | 'outline'; label: string }> = {
  'running': { variant: 'success', label: 'Running' },
  'completed': { variant: 'secondary', label: 'Completed' },
  'paused': { variant: 'warning', label: 'Paused' },
  'in-option': { variant: 'outline', label: 'In-option' },
  'draft': { variant: 'outline', label: 'Draft' },
};

// One row type covering both levels so the whole hierarchy renders in a single
// shared Table. Campaign-only fields are blank on booking rows and vice-versa.
type Row = {
  _type: 'campaign' | 'booking';
  _id: string;
  name: string;
  engine?: EngineId;
  state?: PlanStatus;
  status?: PlanStatus;
  budget: string;
  dailyCap?: string;
  dates?: string;
  objectiveKpi: string;
  inherits?: boolean;
  bookingsCount?: number;
  /** Open inbox messages for this row, so the table shows the same numbers the
   *  Inbox tab does rather than a second opinion. */
  actionCount?: number;
  recommendationCount?: number;
};

/** A count of open inbox messages for a row. */
const CountCell = ({ count, tone }: { count: number; tone?: 'action' }) => {
  if (count === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <Badge variant={tone === 'action' ? 'warning' : 'secondary'} className="tabular-nums">
      {count}
    </Badge>
  );
};

export const MediaPlanDetail: Story = {
  // `planId` and `tab` come from the route via the app page; Storybook renders
  // without them and falls back to the first seeded plan on its first tab.
  render: (args) => {
    const { planId, tab } = (args ?? {}) as { planId?: string; tab?: string };
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);

    // ── Live plan from the prototype database ──────────────────────────
    // The id comes from the route via the page (`planId`), so the server and
    // the hydrated client resolve the same plan. Storybook passes nothing, so
    // it falls back to the first seeded plan.
    const db = useDb();
    const plan = db.mediaPlans.find((p) => p.id === planId) ?? db.mediaPlans[0];
    const planAdvertiser = db.advertisers.find((a) => a.id === plan?.advertiserId);

    // Form option lists come from the store.
    const advertiserOptions = db.advertisers.map((a) => ({ label: a.name, value: a.id }));
    const brandFilterOptions = (planAdvertiser?.brands ?? []).map((b) => ({
      label: b.name,
      value: b.id,
      hasRetailProducts: Boolean(b.hasRetailProducts),
    }));

    // Editable "Media plan details" form state — seeded from the plan.
    const [planName, setPlanName] = React.useState(plan?.name ?? '');
    const [poNumber, setPoNumber] = React.useState(plan?.poNumber ?? '');
    const [advertiser, setAdvertiser] = React.useState(plan?.advertiserId ?? '');
    const [brands, setBrands] = React.useState<string[]>(plan?.brandIds ?? []);
    const [retailProducts, setRetailProducts] = React.useState<string[]>([]);
    const brandsHaveRetailProducts = brands.some((v) => brandFilterOptions.find((b) => b.value === v)?.hasRetailProducts);
    const [goal, setGoal] = React.useState(plan?.goal ?? 'awareness');
    const [objective, setObjective] = React.useState(plan?.objective ?? '');
    const [kpis, setKpis] = React.useState<string[]>(plan?.kpis ?? []);
    const [kpiStudies, setKpiStudies] = React.useState<string[]>([]);
    const [budgetAmount, setBudgetAmount] = React.useState(String(plan?.budget ?? ''));
    const [status, setStatus] = React.useState(plan?.status ?? 'draft');
    const [runTime, setRunTime] = React.useState<DateRange | undefined>(
      plan ? { from: new Date(plan.startDate), to: new Date(plan.endDate) } : undefined,
    );

    // Re-seed the form when the plan id changes (client navigation).
    const seededPlanId = React.useRef(plan?.id);
    React.useEffect(() => {
      if (!plan || seededPlanId.current === plan.id) return;
      seededPlanId.current = plan.id;
      setPlanName(plan.name);
      setPoNumber(plan.poNumber ?? '');
      setAdvertiser(plan.advertiserId);
      setBrands(plan.brandIds);
      setGoal(plan.goal ?? 'awareness');
      setObjective(plan.objective ?? '');
      setKpis(plan.kpis);
      setBudgetAmount(String(plan.budget));
      setStatus(plan.status);
      setRunTime({ from: new Date(plan.startDate), to: new Date(plan.endDate) });
    }, [plan]);

    // Persist the form back into the store.
    const savePlan = () => {
      if (!plan) return;
      updateMediaPlan(plan.id, {
        name: planName,
        poNumber: poNumber || undefined,
        advertiserId: advertiser,
        brandIds: brands,
        goal,
        objective: objective || undefined,
        kpis,
        budget: parseFloat(budgetAmount) || 0,
        status: status as PlanStatus,
        ...(runTime?.from ? { startDate: runTime.from.toISOString().slice(0, 10) } : {}),
        ...(runTime?.to ? { endDate: runTime.to.toISOString().slice(0, 10) } : {}),
      });
    };

    // Campaigns & bookings filters (surface once the plan grows).
    const [rowSearch, setRowSearch] = React.useState('');
    const [propFilter, setPropFilter] = React.useState<string[]>([]);
    const [stateFilter, setStateFilter] = React.useState<string[]>([]);
    const toggle = (id: string) =>
      setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    // Live campaigns + bookings for this plan.
    const planCampaignRows = db.campaigns
      .filter((c) => plan && c.mediaPlanId === plan.id)
      .map((c) => ({ campaign: c, bookings: db.bookings.filter((b) => b.campaignId === c.id) }));

    const planSpend = planCampaignRows.reduce((s, r) => s + r.campaign.spend, 0);
    const spentPct = plan && plan.budget > 0 ? Math.round((planSpend / plan.budget) * 100) : 0;
    const fmtK = (n: number) => (n >= 1000 ? `€${(n / 1000).toFixed(1)}K` : `€${n}`);

    // Per-proposition rollup — the plan's campaigns grouped by engine. Every
    // metric card below splits on this, so the breakdowns always add up to the
    // headline figure.
    const byEngine = (() => {
      const acc = new Map<EngineId, { budget: number; spend: number }>();
      planCampaignRows.forEach(({ campaign: c }) => {
        const cur = acc.get(c.engine) ?? { budget: 0, spend: 0 };
        acc.set(c.engine, { budget: cur.budget + c.budget, spend: cur.spend + c.spend });
      });
      return [...acc.entries()].map(([engine, v]) => ({
        engine,
        name: propositionLabel(engine),
        color: propositionColor(engine),
        ...v,
      }));
    })();

    // Impressions, conversions and ROAS are not in the prototype database yet,
    // so they are derived from real spend with fixed factors. That keeps the
    // breakdowns internally consistent and moving with the data, rather than
    // being fixed strings that never change.
    const IMPRESSIONS_PER_EURO = 120;
    const CONVERSIONS_PER_EURO = 0.04;
    const impressionsByEngine = byEngine.map((e) => ({ name: e.name, value: Math.round(e.spend * IMPRESSIONS_PER_EURO) }));
    const conversionsByEngine = byEngine.map((e) => ({ name: e.name, value: Math.round(e.spend * CONVERSIONS_PER_EURO) }));
    const roasByEngine = byEngine.map((e) => ({
      name: e.name,
      value: e.budget > 0 ? Math.round((2.4 + (e.spend / e.budget) * 2.2) * 10) / 10 : 0,
      color: e.color,
    }));
    const budgetVsSpend = byEngine.map((e) => ({ name: e.name, spent: e.spend, budget: e.budget, color: e.color }));
    const propositionColors = byEngine.map((e) => e.color);

    const impressionsTotal = impressionsByEngine.reduce((s, e) => s + e.value, 0);
    const conversionsTotal = conversionsByEngine.reduce((s, e) => s + e.value, 0);
    const roasWeighted = planSpend > 0
      ? Math.round((byEngine.reduce((s, e, i) => s + roasByEngine[i].value * e.spend, 0) / planSpend) * 10) / 10
      : 0;

    const fmtNumberCompact = (n: number) =>
      n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n));
    const fmtRoasValue = (v: number) => `${v.toFixed(1)}x`;

    // The same cards the media plan card shows, each expanding in place to its
    // per-proposition breakdown.
    const metrics: MetricDefinition[] = [
      {
        key: 'budget',
        label: 'Budget',
        subMetric: `${fmtK(planSpend)} of ${fmtK(plan?.budget ?? 0)} budget`,
        badgeValue: `${spentPct}%`,
        badgeVariant: 'secondary',
        variant: 'budgetStacked',
        budgetData: budgetVsSpend,
        valueFormatter: fmtK,
        chart: <BudgetStackedMini budgetData={budgetVsSpend} />,
        expandedContent: <BudgetStackedDetail budgetData={budgetVsSpend} valueFormatter={fmtK} />,
      },
      {
        key: 'impressions',
        label: 'Impressions',
        value: fmtNumberCompact(impressionsTotal),
        subMetric: 'Media plan',
        variant: 'donut',
        donutData: impressionsByEngine,
        donutColors: propositionColors,
        totalRow: { label: 'Media plan', value: impressionsTotal },
        valueFormatter: fmtNumberCompact,
        expandedContent: (
          <DonutLegendDetail
            donutData={impressionsByEngine}
            donutColors={propositionColors}
            totalRow={{ label: 'Media plan', value: impressionsTotal }}
            valueFormatter={fmtNumberCompact}
          />
        ),
      },
      {
        key: 'conversions',
        label: 'Conversions',
        value: fmtNumberCompact(conversionsTotal),
        subMetric: 'Media plan',
        variant: 'donut',
        donutData: conversionsByEngine,
        donutColors: propositionColors,
        totalRow: { label: 'Media plan', value: conversionsTotal },
        valueFormatter: fmtNumberCompact,
        expandedContent: (
          <DonutLegendDetail
            donutData={conversionsByEngine}
            donutColors={propositionColors}
            totalRow={{ label: 'Media plan', value: conversionsTotal }}
            valueFormatter={fmtNumberCompact}
          />
        ),
      },
      {
        key: 'roas',
        label: 'ROAS',
        subMetric: `${fmtRoasValue(roasWeighted)} media plan (weighted)`,
        variant: 'barHorizontal',
        productData: roasByEngine,
        chart: <BarHorizontalMini productData={roasByEngine} />,
        totalRow: { label: 'Media plan', value: roasWeighted },
        valueFormatter: fmtRoasValue,
        expandedContent: (
          <BarHorizontalDetail
            productData={roasByEngine}
            totalRow={{ label: 'Media plan', value: roasWeighted }}
            valueFormatter={fmtRoasValue}
          />
        ),
      },
    ];

    // Apply the Campaigns & bookings filters (search / proposition / state).
    const filteredCampaigns = planCampaignRows.filter(({ campaign: c, bookings }) => {
      const q = rowSearch.trim().toLowerCase();
      const searchMatch = !q || c.name.toLowerCase().includes(q) || bookings.some((b) => b.name.toLowerCase().includes(q));
      const propMatch = propFilter.length === 0 || propFilter.includes(c.engine);
      const stateMatch = stateFilter.length === 0 || stateFilter.includes(c.status) || bookings.some((b) => stateFilter.includes(b.status));
      return searchMatch && propMatch && stateMatch;
    });

    const objectiveKpiLabel = [plan?.goal, plan?.objective].filter(Boolean).join(' / ') || '—';

    // Flatten campaigns + (when expanded) their bookings into the table's rows.
    const countsFor = (scope: { campaignId?: string; bookingId?: string }) => {
      const msgs = deriveMessages(db, scope);
      return {
        actionCount: msgs.filter((m) => m.kind === 'action').length,
        recommendationCount: msgs.filter((m) => m.kind === 'recommendation').length,
      };
    };

    const rows: Row[] = filteredCampaigns.flatMap(({ campaign: c, bookings }) => [
      {
        _type: 'campaign' as const, _id: c.id, name: c.name, engine: c.engine, state: c.status,
        budget: fmtEuro(c.budget), dates: fmtRange(c.startDate, c.endDate),
        objectiveKpi: objectiveKpiLabel, bookingsCount: bookings.length,
        ...countsFor({ campaignId: c.id }),
      },
      ...(expanded.includes(c.id)
        ? bookings.map((b): Row => ({
            _type: 'booking', _id: b.id, name: b.name, engine: c.engine, status: b.status,
            budget: fmtEuro(b.budget), dailyCap: '—', dates: fmtRange(b.startDate, b.endDate),
            objectiveKpi: 'Inherits from campaign', inherits: true,
            ...countsFor({ bookingId: b.id }),
          }))
        : []),
    ]);

    const columns: TableColumn<Row>[] = [
      {
        key: 'name', header: 'Name', render: (r) =>
          r._type === 'campaign' ? (
            <span className="flex items-center gap-2 min-w-0">
              {/* The chevron lives in the table's own leading column; the rest
                  of the row navigates to the campaign. */}
              <span className="font-medium truncate">{r.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">({r.bookingsCount} bookings)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 pl-6 text-muted-foreground">
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              {r.name}
            </span>
          ),
      },
      {
        key: 'proposition', header: 'Proposition', render: (r) => {
          if (r._type !== 'campaign' || !r.engine) return null;
          const p = propositionMeta[r.engine];
          const Icon = p.icon;
          return (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Icon size={15} className="shrink-0 text-muted-foreground" />
              {p.label}
            </span>
          );
        },
      },
      {
        key: 'state', header: 'State', render: (r) => {
          const s = r._type === 'campaign' ? r.state : r.status;
          const badge = s ? statusBadge[s] : undefined;
          return badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null;
        },
      },
      { key: 'budget', header: 'Budget', render: (r) => <span className="tabular-nums">{r.budget}</span> },
      { key: 'dailyCap', header: 'Daily cap', render: (r) => <span className="tabular-nums text-muted-foreground">{r._type === 'booking' ? r.dailyCap : '—'}</span> },
      { key: 'dates', header: 'Dates', render: (r) => <span className="text-muted-foreground">{r.dates}</span> },
      { key: 'objectiveKpi', header: 'Objective / KPI', render: (r) => <span className={cn('text-muted-foreground', r.inherits && 'italic')}>{r.objectiveKpi}</span> },
      {
        key: 'recommendations', header: 'Recommendations',
        render: (r) => <CountCell count={r.recommendationCount ?? 0} />,
      },
      {
        key: 'inboxActions', header: 'Actions',
        render: (r) => <CountCell count={r.actionCount ?? 0} tone="action" />,
      },
      {
        key: 'remove', header: '', render: (r) =>
          r._type === 'campaign' ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // Removing a campaign cascades to its bookings in the store.
                if (typeof window === 'undefined' || window.confirm(`Remove ${r.name} and its bookings?`)) {
                  deleteCampaign(r._id);
                }
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${r.name}`}
            >
              <XCircle className="h-4 w-4" />
            </button>
          ) : null,
      },
    ];

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => {}}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: plan?.name ?? 'Media plan',
            titleIcon: <HierarchyBadge level="media-plan" />,
            onEdit: () => {},
            onExport: () => {},
            onSettings: () => {},
            headerRight: null,
          }}
        >
          <div className="mb-3">
            {/* showCharts turns each card into its chart and lets it expand in place to
                the per-proposition breakdown below the row. */}
            <MetricRow metrics={metrics} maxVisible={4} defaultVariant="graph" showCharts removable={false} bleedEdges />
          </div>

          <CardWithTabs
            // A plan arrived at straight from the wizard opens on its Inbox, so
            // the first thing the user sees is what still has to be done.
            defaultTab={tab}
            tabs={[
              {
                label: 'Media plan details',
                value: 'details',
                content: (
                  <div className="mt-6 space-y-6">
                    {/* Sections mirror the create-media-plan wizard steps, each
                        in its own card so a long form stays scannable. */}
                    <FormSection title="Setup" bordered>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="mp-name">Media plan name</Label>
                          <Input id="mp-name" value={planName} onChange={(e) => setPlanName(e.target.value)} hint="Give your media plan a descriptive name to easily identify it later" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mp-po">PO number <span className="font-normal text-muted-foreground">(optional)</span></Label>
                          <Input id="mp-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Input dropdown options={statusOptions} value={status} onChange={(v: string) => setStatus(v as PlanStatus)} placeholder="Select status" />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection title="Advertiser" bordered>
                      <div className="space-y-6">
                        {/* Who the plan advertises for is fixed once it exists:
                            the campaigns, bookings and reporting underneath are
                            all attributed to this advertiser and brand. */}
                        <ReadOnlyField
                          label="Advertiser"
                          value={advertiserOptions.find((o) => o.value === advertiser)?.label}
                          hint="Set when the media plan was created and cannot be changed"
                        />
                        {/* One card per brand — the same stack the wizard shows
                            when these were chosen, just without the remove. */}
                        <ReadOnlyField
                          label="Brands"
                          values={brands.map((b) => ({
                            label: brandFilterOptions.find((o) => o.value === b)?.label ?? b,
                          }))}
                          hint="The brand(s) this media plan advertises for"
                        />

                        {/* Retail products — only for a selected advertiser + brand carried in-store. */}
                        {advertiser && brands.length > 0 && brandsHaveRetailProducts && (
                          <RetailProductSelect value={retailProducts} onChange={setRetailProducts} optional showCount />
                        )}
                      </div>
                    </FormSection>

                    <FormSection title="Goals & objectives" bordered>
                      <div className="space-y-5">
                        {/* Only the chosen goal — showing all four invited a
                            change the plan's KPIs and reporting can't absorb,
                            and took four cards to say one thing. */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1.5 text-muted-foreground">
                            Campaign goal
                            <Lock className="h-3 w-3" aria-label="Cannot be changed" />
                          </Label>
                          {(() => {
                            const g = goals.find((x) => x.id === goal);
                            return g ? (
                              <GoalCard icon={g.icon} title={g.title} description={g.description} selected readOnly className="w-full" />
                            ) : (
                              <div className="flex min-h-9 items-center rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                No goal set
                              </div>
                            );
                          })()}
                          <p className="text-xs text-muted-foreground">
                            The goal sets the objective and the KPIs this plan is judged on
                          </p>
                        </div>
                        <ReadOnlyField
                          label="Objective"
                          value={objectiveOptions.find((o) => o.value === objective)?.label}
                          hint={objective ? describeObjective(objective) : undefined}
                        />
                        <SearchSelectList
                          label="KPIs"
                          placeholder="Search KPIs…"
                          options={kpiFilterOptions}
                          value={kpis}
                          onChange={(vals) => { setKpis(vals); setKpiStudies((s) => s.filter((v) => vals.includes(v))); }}
                          renderSelectedExtra={(opt) => (
                            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                              <Checkbox
                                checked={kpiStudies.includes(opt.value)}
                                onCheckedChange={(c) => setKpiStudies((s) => (c ? [...s, opt.value] : s.filter((v) => v !== opt.value)))}
                              />
                              Add a brand-lift study to measure this KPI
                            </label>
                          )}
                        />
                      </div>
                    </FormSection>

                    <FormSection title="Run time & budget" bordered>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Run time</Label>
                          <DateRangePicker dateRange={runTime} onDateRangeChange={setRunTime} placeholder="Select run time" showPresets presets={futureDateRangePresets} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mp-budget">Total budget</Label>
                          <div className="relative">
                            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input id="mp-budget" type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} className="pl-9 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]" />
                          </div>
                        </div>
                      </div>
                    </FormSection>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={savePlan}>Save changes</Button>
                    </div>
                  </div>
                ),
              },
              {
                // Everything the user should do or know for this plan: the
                // derived to-dos plus its recommendations and insights.
                label: 'Inbox',
                value: 'inbox',
                content: <InboxPanel scope="media-plan" entityId={plan?.id} className="mt-6" />,
              },
              {
                label: 'Campaigns & bookings',
                value: 'campaigns',
                content: (
                  <div className="mt-6 space-y-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Proposition',
                          options: (Object.keys(propositionMeta) as EngineId[]).map((e) => ({
                            label: propositionMeta[e].label,
                            value: e,
                          })),
                          selectedValues: propFilter,
                          onChange: setPropFilter,
                        },
                        {
                          name: 'State',
                          options: (Object.keys(statusBadge) as PlanStatus[]).map((s) => ({
                            label: statusBadge[s].label,
                            value: s,
                          })),
                          selectedValues: stateFilter,
                          onChange: setStateFilter,
                        },
                      ]}
                      searchValue={rowSearch}
                      onSearchChange={setRowSearch}
                      searchPlaceholder="Search campaigns & bookings..."
                    />
                    <Table
                      columns={columns}
                      data={rows}
                      rowKey={(r) => r._id}
                      hideActions
                      expandable={{
                        isExpandable: (r) => r._type === 'campaign' && (r.bookingsCount ?? 0) > 0,
                        isExpanded: (r) => expanded.includes(r._id),
                        onToggle: (r) => toggle(r._id),
                        getLabel: (r, isOpen) => `${isOpen ? 'Collapse' : 'Expand'} ${r.name}`,
                      }}
                      onRowClick={(r) => {
                        // Rows link to the campaign / booking; only the chevron toggles.
                        // Engine → route segment (route names differ slightly from ids).
                        const routeSeg: Record<EngineId, string> = {
                          'display': 'display',
                          'sponsored-products': 'sponsored-products',
                          'digital-instore': 'digital-instore',
                          'offline-instore': 'offline-instore',
                          'offsite': 'offsite',
                        };
                        const seg = routeSeg[r.engine ?? 'display'];
                        let href: string;
                        if (r._type === 'campaign') {
                          href = `/campaigns/${seg}/${r._id}`;
                        } else if (r.engine === 'sponsored-products') {
                          // Sponsored-products keyword bookings live inside the campaign,
                          // so open the parent campaign detail.
                          const parent = db.bookings.find((b) => b.id === r._id)?.campaignId;
                          href = `/campaigns/${seg}/${parent ?? r._id}`;
                        } else {
                          href = `/campaigns/${seg}/booking/${r._id}`;
                        }
                        if (typeof window !== 'undefined') window.location.href = href;
                      }}
                      rowClassName={(r) =>
                        r._type === 'booking'
                          // Sub rows: lighter base + their own hover, so hovering a
                          // booking is distinct from hovering a campaign row.
                          ? '[&>td]:bg-muted/20 [&:hover>td]:bg-muted/40'
                          // Campaign rows: expanded (selected) gets a darker tone than the hover.
                          : cn('cursor-pointer', expanded.includes(r._id) && '[&>td]:!bg-muted')
                      }
                    />
                  </div>
                ),
              },
              {
                // Performance across the whole plan — the same chart row the
                // campaign pages use, scoped to this plan's mix of engines.
                label: 'Insights',
                value: 'insights',
                content: <InsightsTab engineType="all" scope="campaign" mediaPlanId={plan?.id} />,
              },
              {
                label: 'Logs',
                value: 'logs',
                content: (
                  <div className="mt-6 space-y-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Users',
                          options: [
                            { label: 'Jane Doe', value: 'Jane Doe' },
                            { label: 'John Smith', value: 'John Smith' },
                            { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                            { label: 'Mike Johnson', value: 'Mike Johnson' },
                          ],
                          selectedValues: logUsers,
                          onChange: setLogUsers,
                        },
                        {
                          name: 'Actions',
                          options: [
                            { label: 'Media plan created', value: 'Media plan created' },
                            { label: 'Budget updated', value: 'Budget updated' },
                            { label: 'Campaign added', value: 'Campaign added' },
                            { label: 'Objective set', value: 'Objective set' },
                            { label: 'Dates modified', value: 'Dates modified' },
                            { label: 'Status changed', value: 'Status changed' },
                          ],
                          selectedValues: logActions,
                          onChange: setLogActions,
                        },
                      ]}
                      searchValue={''}
                      onSearchChange={() => {}}
                      searchPlaceholder="Search logs..."
                    />
                    <Table
                      columns={[
                        { key: 'timestamp', header: 'Timestamp', render: (row: LogRow) => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) },
                        { key: 'user', header: 'User' },
                        { key: 'action', header: 'Action', render: (row: LogRow) => <Badge variant="outline">{row.action}</Badge> },
                        { key: 'field', header: 'Field' },
                        { key: 'oldValue', header: 'Old value' },
                        { key: 'newValue', header: 'New value' },
                        { key: 'description', header: 'Description' },
                      ]}
                      data={logData.filter((row) => {
                        const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                        const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                        return userMatch && actionMatch;
                      })}
                      rowKey={(row: LogRow) => row.id}
                    />
                  </div>
                ),
              },
            ]}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
