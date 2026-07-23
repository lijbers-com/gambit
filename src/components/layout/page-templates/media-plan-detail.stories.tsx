import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { MetricRow } from '@/components/ui/metric-row';
import { Badge } from '@/components/ui/badge';
import { CardWithTabs } from '@/components/ui/card';
import { Table, type TableColumn } from '@/components/ui/table';
import { FilterBar } from '@/components/ui/filter-bar';
import { Filter } from '@/components/ui/filter';
import { FormSection } from '@/components/ui/form-section';
import { GoalCard } from '@/components/ui/goal-card';
import { RetailProductSelect } from '@/components/ui/retail-product-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DateRangePicker, futureDateRangePresets } from '@/components/ui/date-picker';
import { DollarSign } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, XCircle, CornerDownRight, ListStart, MonitorSpeaker, Eye, Brain, ShoppingCart, Heart, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Media Plan Detail',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

type Booking = {
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  budget: string;
  dailyCap: string;
  flight: string;
  objectiveKpi: string;
  inherits?: boolean;
};
type PlanCampaign = {
  id: string;
  name: string;
  engine: 'SP' | 'Display';
  state: string;
  budget: string;
  dates: string;
  objectiveKpi: string;
  lock: 'FLEXIBLE' | 'LOCKED';
  bookings: Booking[];
};

const planCampaigns: PlanCampaign[] = [
  {
    id: 'c1', name: 'SP - Early Capout Candidate', engine: 'SP', state: 'CREATED', budget: '€6,000.00',
    dates: 'Jul 2, 2026 → Aug 5, 2026', objectiveKpi: 'SALES / ROAS', lock: 'FLEXIBLE',
    bookings: [
      { name: 'Brand Keywords - Top of Search', status: 'ACTIVE', budget: '€2500', dailyCap: '€200/d', flight: 'Jun 30, 2026 → Jul 27, 2026', objectiveKpi: 'SALES / ROAS: 5' },
      { name: 'Category Keywords - Rest of Search', status: 'ACTIVE', budget: '€2000', dailyCap: '€175/d', flight: 'Jun 30, 2026 → Jul 27, 2026', objectiveKpi: 'SALES / ROAS: 2.5' },
      { name: 'Product Page Placements', status: 'ACTIVE', budget: '€1500', dailyCap: '€125/d', flight: 'Jun 30, 2026 → Jul 27, 2026', objectiveKpi: 'SALES / ROAS: 2' },
    ],
  },
  {
    id: 'c2', name: 'SP - Daily Cap Too Low Candidate', engine: 'SP', state: 'CREATED', budget: '€3,000.00',
    dates: 'Jul 6, 2026 → Jul 26, 2026', objectiveKpi: 'SALES / ROAS', lock: 'FLEXIBLE',
    bookings: [
      { name: 'Category Keywords - Rest of Search', status: 'ACTIVE', budget: '€1800', dailyCap: '€45/d', flight: 'Jul 3, 2026 → Jul 23, 2026', objectiveKpi: 'Inherits from campaign', inherits: true },
      { name: 'Competitor Keywords', status: 'ACTIVE', budget: '€1200', dailyCap: '€30/d', flight: 'Jul 3, 2026 → Jul 23, 2026', objectiveKpi: 'SALES / ROAS: 1.5' },
    ],
  },
  {
    id: 'c3', name: 'Display - Steady Running', engine: 'Display', state: 'CREATED', budget: '€1,000.00',
    dates: 'Jul 2, 2026 → —', objectiveKpi: 'AWARENESS / CPM', lock: 'FLEXIBLE',
    bookings: [
      { name: 'Homepage Banner - Premium Slot', status: 'ACTIVE', budget: '€600', dailyCap: '€35/d', flight: '—', objectiveKpi: 'AWARENESS / CPM: 9' },
      { name: 'Category Page - Broad Reach', status: 'ACTIVE', budget: '€400', dailyCap: '€25/d', flight: '—', objectiveKpi: 'AWARENESS / CPM: 6.5' },
    ],
  },
  {
    id: 'c4', name: 'SP - Recently Finished', engine: 'SP', state: 'CREATED', budget: '€2,000.00',
    dates: 'Jun 28, 2026 → Jul 13, 2026', objectiveKpi: 'SALES / ROAS', lock: 'LOCKED',
    bookings: [
      { name: 'Brand Keywords - Completed', status: 'COMPLETED', budget: '€1200', dailyCap: '—', flight: 'May 15, 2026 → Jun 30, 2026', objectiveKpi: 'Inherits from campaign', inherits: true },
      { name: 'Seasonal Keywords - Paused', status: 'PAUSED', budget: '€800', dailyCap: '—', flight: 'May 15, 2026 → Jun 30, 2026', objectiveKpi: 'Inherits from campaign', inherits: true },
    ],
  },
];

// Option lists for the editable "Media plan details" form.
const advertiserOptions = [
  { label: 'Acme Media', value: 'acme' },
  { label: 'Brand Alliance', value: 'brand-alliance' },
  { label: 'Global Brands Co.', value: 'global-brands' },
];
// `hasRetailProducts` gates the retail-product picker (some brands aren't carried).
const brandFilterOptions = [
  { label: 'Coca-Cola', value: 'coca-cola', hasRetailProducts: true },
  { label: 'Heineken', value: 'heineken', hasRetailProducts: true },
  { label: 'Unilever', value: 'unilever', hasRetailProducts: false },
  { label: 'Nestlé', value: 'nestle', hasRetailProducts: false },
];
// Goal catalog — same shape as the create-media-plan wizard's goal cards.
const goals = [
  { id: 'awareness', icon: <Eye size={24} />, title: 'Awareness', description: 'Reach a broad audience and make them aware of your brand, product or service' },
  { id: 'consideration', icon: <Brain size={24} />, title: 'Consideration', description: 'Encourage people to think about your brand and seek out more information' },
  { id: 'purchase', icon: <ShoppingCart size={24} />, title: 'Purchase', description: 'Drive sales and conversions on your website, in your app or in physical stores' },
  { id: 'loyalty', icon: <Heart size={24} />, title: 'Loyalty', description: 'Strengthen existing customer relationships and drive repeat purchases' },
];
const objectiveOptions = [
  { label: 'Merkbekendheid', value: 'merkbekendheid' },
  { label: 'Productbekendheid', value: 'productbekendheid' },
  { label: 'Merk associaties', value: 'merk-associaties' },
];
const kpiFilterOptions = [
  { label: 'Top of Mind Awareness', value: 'toma' },
  { label: 'Spontane merk/productbekendheid', value: 'spontaan' },
  { label: 'Reclamebekendheid (Ad-recall)', value: 'adrecall' },
  { label: 'CEP', value: 'cep' },
];
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'In-option', value: 'in-option' },
  { label: 'Ready', value: 'ready' },
  { label: 'Running', value: 'running' },
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

// Proposition shown as icon + text (not a coloured badge).
const propositionMeta: Record<string, { icon: LucideIcon; label: string }> = {
  SP: { icon: ListStart, label: 'Sponsored products' },
  Display: { icon: MonitorSpeaker, label: 'Display' },
};
// Booking status → badge (same treatment as the campaign State badge).
const statusBadge: Record<string, { variant: 'success' | 'secondary' | 'warning'; label: string }> = {
  ACTIVE: { variant: 'success', label: 'Active' },
  COMPLETED: { variant: 'secondary', label: 'Completed' },
  PAUSED: { variant: 'warning', label: 'Paused' },
};

// One row type covering both levels so the whole hierarchy renders in a single
// shared Table. Campaign-only fields are blank on booking rows and vice-versa.
type Row = {
  _type: 'campaign' | 'booking';
  _id: string;
  name: string;
  engine?: 'SP' | 'Display';
  state?: string;
  status?: Booking['status'];
  budget: string;
  dailyCap?: string;
  dates?: string;
  objectiveKpi: string;
  lock?: 'FLEXIBLE' | 'LOCKED';
  inherits?: boolean;
  bookingsCount?: number;
};

export const MediaPlanDetail: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    const [expanded, setExpanded] = React.useState<string[]>(['c1']);
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);

    // Editable "Media plan details" form state.
    const [planName, setPlanName] = React.useState('Holiday Sale Plan');
    const [poNumber, setPoNumber] = React.useState('PO-2026-0042');
    const [advertiser, setAdvertiser] = React.useState('acme');
    const [brands, setBrands] = React.useState<string[]>(['coca-cola', 'heineken']);
    const [retailProducts, setRetailProducts] = React.useState<string[]>([]);
    const brandsHaveRetailProducts = brands.some((v) => brandFilterOptions.find((b) => b.value === v)?.hasRetailProducts);
    const [goal, setGoal] = React.useState('awareness');
    const [objective, setObjective] = React.useState('merkbekendheid');
    const [kpis, setKpis] = React.useState<string[]>(['toma', 'cep']);
    const [budgetAmount, setBudgetAmount] = React.useState('15000');
    const [status, setStatus] = React.useState('in-option');
    const [runTime, setRunTime] = React.useState<DateRange | undefined>({ from: new Date('2026-06-01'), to: new Date('2026-06-30') });

    // Campaigns & bookings filters (surface once the plan grows).
    const [rowSearch, setRowSearch] = React.useState('');
    const [propFilter, setPropFilter] = React.useState<string[]>([]);
    const [stateFilter, setStateFilter] = React.useState<string[]>([]);
    const toggle = (id: string) =>
      setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const metrics = [
      { key: 'budget', label: 'Budget', value: '$9.2K', subMetric: 'of $15.0K budget', badgeValue: '61%', badgeVariant: 'secondary' as const },
      { key: 'impressions', label: 'Impressions', value: '2.5M', subMetric: 'Media plan', badgeValue: '+8%', badgeVariant: 'success' as const },
      { key: 'roas', label: 'ROAS', value: '4.2x', subMetric: 'Media plan (weighted)', badgeValue: '+11%', badgeVariant: 'success' as const },
      { key: 'campaigns', label: 'Campaigns', value: '4', subMetric: '9 bookings', badgeValue: '', badgeVariant: 'secondary' as const },
    ];

    // Apply the Campaigns & bookings filters (search / proposition / state).
    const filteredCampaigns = planCampaigns.filter((c) => {
      const q = rowSearch.trim().toLowerCase();
      const searchMatch = !q || c.name.toLowerCase().includes(q) || c.bookings.some((b) => b.name.toLowerCase().includes(q));
      const propMatch = propFilter.length === 0 || propFilter.includes(c.engine);
      const stateMatch = stateFilter.length === 0 || stateFilter.includes(c.state) || c.bookings.some((b) => stateFilter.includes(b.status));
      return searchMatch && propMatch && stateMatch;
    });

    // Flatten campaigns + (when expanded) their bookings into the table's rows.
    const rows: Row[] = filteredCampaigns.flatMap((c) => [
      { _type: 'campaign', _id: c.id, name: c.name, engine: c.engine, state: c.state, budget: c.budget, dates: c.dates, objectiveKpi: c.objectiveKpi, lock: c.lock, bookingsCount: c.bookings.length },
      ...(expanded.includes(c.id)
        ? c.bookings.map((b, i): Row => ({ _type: 'booking', _id: `${c.id}-b${i}`, name: b.name, engine: c.engine, status: b.status, budget: b.budget, dailyCap: b.dailyCap, dates: b.flight, objectiveKpi: b.objectiveKpi, inherits: b.inherits }))
        : []),
    ]);

    const columns: TableColumn<Row>[] = [
      {
        key: 'name', header: 'Name', render: (r) =>
          r._type === 'campaign' ? (
            <span className="flex items-center gap-2 min-w-0">
              {/* Only the chevron toggles the row open/closed; the rest of the
                  row navigates to the campaign. */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggle(r._id); }}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label={expanded.includes(r._id) ? `Collapse ${r.name}` : `Expand ${r.name}`}
              >
                {expanded.includes(r._id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
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
        key: 'state', header: 'State', render: (r) =>
          r._type === 'campaign' ? (
            <Badge variant="secondary">Created</Badge>
          ) : (
            <Badge variant={statusBadge[r.status!].variant}>{statusBadge[r.status!].label}</Badge>
          ),
      },
      { key: 'budget', header: 'Budget', render: (r) => <span className="tabular-nums">{r.budget}</span> },
      { key: 'dailyCap', header: 'Daily cap', render: (r) => <span className="tabular-nums text-muted-foreground">{r._type === 'booking' ? r.dailyCap : '—'}</span> },
      { key: 'dates', header: 'Dates', render: (r) => <span className="text-muted-foreground">{r.dates}</span> },
      { key: 'objectiveKpi', header: 'Objective / KPI', render: (r) => <span className={cn('text-muted-foreground', r.inherits && 'italic')}>{r.objectiveKpi}</span> },
      { key: 'lock', header: 'Lock', render: (r) => (r._type === 'campaign' ? (r.lock === 'LOCKED' ? <Badge className="bg-neutral-200 text-neutral-800 border-neutral-300">Locked</Badge> : <Badge variant="outline">Flexible</Badge>) : null) },
      {
        key: 'actions', header: 'Actions', render: (r) =>
          r._type === 'campaign' ? (
            <button type="button" onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground" aria-label={`Remove ${r.name}`}>
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
            title: 'Holiday Sale Plan',
            titleIcon: <HierarchyBadge level="media-plan" />,
            onEdit: () => {},
            onExport: () => {},
            onSettings: () => {},
            headerRight: null,
          }}
        >
          <div className="mb-3">
            <MetricRow metrics={metrics} maxVisible={4} defaultVariant="default" removable={false} bleedEdges />
          </div>

          <CardWithTabs
            tabs={[
              {
                label: 'Media plan details',
                value: 'details',
                content: (
                  <div className="mt-6 space-y-6">
                    {/* Sections mirror the create-media-plan wizard steps. */}
                    <FormSection title="Setup">
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
                          <Input dropdown options={statusOptions} value={status} onChange={setStatus} placeholder="Select status" />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection title="Advertiser">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Advertiser</Label>
                          <Input dropdown options={advertiserOptions} value={advertiser} onChange={setAdvertiser} placeholder="Select an advertiser" />
                        </div>
                        <div className="space-y-2">
                          <Label>Brands</Label>
                          <Filter name="Select brands" keepName options={brandFilterOptions} selectedValues={brands} onChange={setBrands} className="w-full justify-between" />
                          {/* Selected brands — chips with remove, like the wizard. */}
                          {brands.length > 0 && (
                            <div className="space-y-1 pt-1">
                              {brands.map((value) => {
                                const opt = brandFilterOptions.find((b) => b.value === value);
                                return opt ? (
                                  <div key={value} className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-2">
                                    <div className="text-sm font-medium">{opt.label}</div>
                                    <Button variant="outline" size="sm" onClick={() => setBrands(brands.filter((v) => v !== value))} className="h-8 w-8 shrink-0 p-0" aria-label={`Remove ${opt.label}`}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">Choose the brand(s) this media plan advertises for</div>
                        </div>

                        {/* Retail products — only for a selected advertiser + brand carried in-store. */}
                        {advertiser && brands.length > 0 && brandsHaveRetailProducts && (
                          <RetailProductSelect value={retailProducts} onChange={setRetailProducts} optional showCount />
                        )}
                      </div>
                    </FormSection>

                    <FormSection title="Goals & objectives">
                      <div className="space-y-5">
                        <div>
                          <Label className="mb-3 block">Campaign goal</Label>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {goals.map((g) => (
                              <GoalCard
                                key={g.id}
                                icon={g.icon}
                                title={g.title}
                                description={g.description}
                                selected={goal === g.id}
                                onClick={() => setGoal(g.id)}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Objective</Label>
                          <Filter
                            name="Select objective"
                            keepName
                            options={objectiveOptions}
                            selectedValues={objective ? [objective] : []}
                            onChange={(vals) => setObjective(vals.length ? vals[vals.length - 1] : '')}
                            className="w-full justify-between"
                          />
                          {objective && (
                            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-2">
                              <div className="text-sm font-medium">{objectiveOptions.find((o) => o.value === objective)?.label ?? objective}</div>
                              <Button variant="outline" size="sm" onClick={() => setObjective('')} className="h-8 w-8 shrink-0 p-0" aria-label="Remove objective">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>KPIs</Label>
                          <Filter name="Select KPIs" keepName options={kpiFilterOptions} selectedValues={kpis} onChange={setKpis} className="w-full justify-between" />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection title="Run time & budget">
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
                      <Button>Save changes</Button>
                    </div>
                  </div>
                ),
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
                          options: [
                            { label: 'Sponsored products', value: 'SP' },
                            { label: 'Display', value: 'Display' },
                          ],
                          selectedValues: propFilter,
                          onChange: setPropFilter,
                        },
                        {
                          name: 'State',
                          options: [
                            { label: 'Created', value: 'CREATED' },
                            { label: 'Active', value: 'ACTIVE' },
                            { label: 'Completed', value: 'COMPLETED' },
                            { label: 'Paused', value: 'PAUSED' },
                          ],
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
                      onRowClick={(r) => {
                        // Rows link to the campaign / booking; only the chevron toggles.
                        const type = r.engine === 'Display' ? 'display' : 'sponsored-products';
                        let href: string;
                        if (r._type === 'campaign') {
                          href = `/campaigns/${type}/${r._id}`;
                        } else if (r.engine === 'Display') {
                          href = `/campaigns/display/booking/${r._id}`;
                        } else {
                          // Sponsored-products keyword bookings live inside the campaign,
                          // so open the parent campaign detail.
                          href = `/campaigns/${type}/${r._id.split('-b')[0]}`;
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
