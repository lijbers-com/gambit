'use client';

import * as React from 'react';
import { Gavel, ListStart, MonitorSpeaker, MoreHorizontal, Pencil, ShieldCheck, Eye, Brain, ShoppingCart, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { AddButton } from './ui/add-button';
import { Input, FieldHint } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Table } from './ui/table';
import { DateRangePicker, futureDateRangePresets } from './ui/date-picker';
import { SummaryCard } from './ui/summary-card';
import { GoalSelect } from './ui/goal-select';
import { GoalCard } from './ui/goal-card';
import { SetupChecklist } from './ui/setup-checklist';
import { BudgetPacing, PacingShapeSelect, type PacingShape, type PacingOverride } from './ui/budget-pacing';
import { ToggleCard } from './ui/toggle-card';
import { ControlBar, ControlBarItem } from './ui/control-bar';
import { PropositionIcon } from './ui/proposition-icon';
import { LevelMeter } from './ui/level-meter';
import { CreatePlacement } from './ui/create-placement';
import { MetricRow } from './ui/metric-row';
import { MetricCard } from './ui/card';
import { CampaignSummary } from './ui/campaign-summary';
import { FillRateBar } from './ui/fill-rate-bar';
import { AvailableTimeBar } from './ui/available-time-bar';
import { HierarchyBadge } from './ui/hierarchy-badge';
import { Inbox, type InboxItem } from './ui/inbox';
import { FilterBar } from './ui/filter-bar';
import { SearchableSelect } from './ui/searchable-select';
import { SearchSelectList } from './ui/search-select-list';
import { SearchInput } from './ui/search-input';
import { SplitButton } from './ui/split-button';
import { ReadOnlyField } from './ui/read-only-field';
import { Slider } from './ui/slider';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { TargetSelect } from './ui/target-select';
import { AreaChartComponent } from './ui/area-chart';
import { BarChartComponent } from './ui/bar-chart';
import { LineChartComponent } from './ui/line-chart';
import { PieChartComponent } from './ui/pie-chart';
import { onlineTargetGroups } from '@/lib/target-groups';
import { retailMoments } from '@/lib/retail-moments';

/**
 * The design-system preview registry.
 *
 * One entry per component (and per variant worth seeing on its own), each
 * rendering the REAL component with realistic sample data — the same import
 * the application uses, so a preview cannot drift from the product without
 * going visibly wrong, which is what gets it fixed.
 *
 * EpicContext's design-system chapter frames these entries by URL
 * (`/__ec/preview?key=<entry>`): every `component_spec` block carries a
 * `preview_url` per variant that points here. Storybook remains the local
 * development workbench; THIS is what the documented system shows.
 *
 * Rules:
 *  - Never a re-sketch. If it is in this file, it is the shipped component.
 *  - Sample content is realistic, never lorem ipsum — real campaign names,
 *    plausible numbers — so a preview reveals truncation and alignment the
 *    way the product would.
 */

export interface PreviewEntry {
  title: string;
  /** Functional group, matching the design-system chapter's navigation. */
  group:
    | 'Actions'
    | 'Inputs & controls'
    | 'Containment'
    | 'Communication'
    | 'Navigation'
    | 'Data display'
    | 'Product surfaces';
  render: () => React.ReactNode;
  /** Widen the stage for entries that are full page sections. */
  wide?: boolean;
}

/* ── Stateful wrappers — a preview is live, not a screenshot ────────── */

const StatefulInput: React.FC<{ hint?: boolean }> = ({ hint }) => {
  const [v, setV] = React.useState('Holiday Sale — Display');
  return (
    <div className="space-y-1.5">
      <Label htmlFor="pv-input">Campaign name <span className="text-foreground">*</span></Label>
      <Input id="pv-input" value={v} onChange={(e) => setV(e.target.value)} placeholder="Enter campaign name" />
      {hint && <FieldHint>Campaign budget: €10,000</FieldHint>}
    </div>
  );
};

const StatefulSwitch: React.FC = () => {
  const [on, setOn] = React.useState(true);
  return <Switch checked={on} onCheckedChange={setOn} aria-label="Preview switch" />;
};

const StatefulCheckbox: React.FC = () => {
  const [on, setOn] = React.useState(true);
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={on} onCheckedChange={(v) => setOn(v === true)} /> Include weekends
    </label>
  );
};

const StatefulTabs: React.FC = () => {
  const [v, setV] = React.useState('all');
  return (
    <Tabs value={v} onValueChange={setV}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="weekend">Weekend</TabsTrigger>
        <TabsTrigger value="weekdays">Weekdays</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const StatefulDateRange: React.FC = () => {
  const [range, setRange] = React.useState<{ from?: Date; to?: Date } | undefined>({
    from: new Date('2026-09-07'),
    to: new Date('2026-10-04'),
  });
  return (
    <DateRangePicker
      dateRange={range?.from ? { from: range.from, to: range.to } : undefined}
      onDateRangeChange={(r) => setRange(r)}
      placeholder="Select start and end date"
      showPresets
      showWeekNumbers
      events={retailMoments}
      presets={futureDateRangePresets}
      className="w-full"
    />
  );
};

const goalOptions = [
  { id: 'awareness', icon: <Eye />, title: 'Awareness', description: 'Reach a broad audience and make them aware of your brand, product or service', brandKpis: ['Top-of-mind awareness', 'Ad recall'], mediaKpis: ['Reach', 'Frequency', 'CPM'], salesKpis: [] },
  { id: 'consideration', icon: <Brain />, title: 'Consideration', description: 'Encourage people to think about your brand and seek out more information', brandKpis: ['Brand preference', 'Purchase intent'], mediaKpis: ['CTR', 'Video completion rate'], salesKpis: ['Trial (new to product)'] },
  { id: 'purchase', icon: <ShoppingCart />, title: 'Purchase', description: 'Drive sales and conversions on your website, in your app or in physical stores', brandKpis: [], mediaKpis: ['Conversion rate', 'CTR'], salesKpis: ['Incremental ROAS', 'Sales lift', 'New to brand'] },
  { id: 'loyalty', icon: <Heart />, title: 'Loyalty', description: 'Strengthen existing customer relationships and drive repeat purchases', brandKpis: [], mediaKpis: ['Frequency'], salesKpis: ['Repeat', 'Purchase frequency', 'CLV'] },
];

const StatefulGoalSelect: React.FC = () => {
  const [v, setV] = React.useState<string | null>('purchase');
  return <GoalSelect goals={goalOptions} value={v} onChange={setV} highlightKpis={['Incremental ROAS']} />;
};

const StatefulPacing: React.FC<{ custom?: boolean }> = ({ custom }) => {
  const [shape, setShape] = React.useState<PacingShape>(custom ? 'custom' : 'even');
  const [daily, setDaily] = React.useState('120');
  const [overrides, setOverrides] = React.useState<PacingOverride[]>([]);
  const [total, setTotal] = React.useState('4000');
  return (
    <BudgetPacing
      budgetField={
        <div className="space-y-1.5">
          <Label htmlFor="pv-total">Total budget <span className="text-foreground">*</span></Label>
          <Input id="pv-total" type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
        </div>
      }
      totalBudget={Number(total) || undefined}
      startDate={new Date('2026-09-07')}
      endDate={new Date('2026-10-04')}
      shape={shape}
      onShapeChange={setShape}
      dailyBudget={daily}
      onDailyBudgetChange={setDaily}
      overrides={overrides}
      onOverridesChange={setOverrides}
    />
  );
};

const StatefulPacingShapes: React.FC = () => {
  const [v, setV] = React.useState<PacingShape>('frontloaded');
  return <PacingShapeSelect value={v} onChange={setV} shapes={['account', 'even', 'frontloaded', 'asap']} />;
};

const StatefulToggleCard: React.FC<{ open?: boolean }> = ({ open }) => {
  const [on, setOn] = React.useState(!!open);
  return (
    <ToggleCard
      title="Email budget notifications"
      description="Tells you when a booking caps out early or ends the flight with budget unspent."
      checked={on}
      onCheckedChange={setOn}
    >
      {open ? <p className="text-sm text-muted-foreground">The settings a switch turns on render here, inside the card.</p> : undefined}
    </ToggleCard>
  );
};

const placementChannels = [
  { value: 'homepage', label: 'Homepage', description: '4 ad positions' },
  { value: 'category', label: 'Category pages', description: '6 ad positions' },
  { value: 'search', label: 'Search results', description: '3 ad positions' },
];
const placementPositions = [
  { value: 'pos-home-top', label: 'Homepage top banner', description: '970×250 · above the fold', format: 'Billboard' },
  { value: 'pos-home-mid', label: 'Homepage mid banner', description: '728×90 · mid page', format: 'Leaderboard' },
  { value: 'pos-home-side', label: 'Homepage sidebar', description: '300×600 · right rail', format: 'Half page' },
];

const StatefulPlacement: React.FC = () => {
  const [channel, setChannel] = React.useState<string[]>(['homepage']);
  const [positions, setPositions] = React.useState<string[]>(['pos-home-top']);
  return (
    <CreatePlacement
      productLabel="Find channel"
      mediaProducts={placementChannels}
      mediaProduct={channel}
      onMediaProductChange={setChannel}
      positions={placementPositions}
      positionsValue={positions}
      onPositionsChange={setPositions}
    />
  );
};

/* ── Table variants — the table is props, not forks ─────────────────── */

const TableSelectable: React.FC = () => {
  const [selected, setSelected] = React.useState<React.Key[]>(['C-004']);
  return (
    <Table<PreviewRow>
      rowKey={(r) => r.id}
      rowSelection={{ selectedKeys: selected, onChange: setSelected }}
      columns={[
        { key: 'name', header: 'Campaign', render: (r) => <span className="font-medium">{r.name}</span> },
        { key: 'budget', header: 'Budget', render: (r) => r.budget },
        { key: 'spend', header: 'Spend', render: (r) => r.spend },
      ]}
      data={previewRows}
    />
  );
};

type PlanRow = { id: string; name: string; kind: 'campaign' | 'booking'; status: string; budget: string; parent?: string };
const planRows: PlanRow[] = [
  { id: 'C-004', name: 'Summer Launch — Display', kind: 'campaign', status: 'Running', budget: '€5,000' },
  { id: 'B-005', name: 'Homepage Takeover', kind: 'booking', status: 'Running', budget: '€2,500', parent: 'C-004' },
  { id: 'B-006', name: 'Category Banner — Drinks', kind: 'booking', status: 'Running', budget: '€2,500', parent: 'C-004' },
  { id: 'C-005', name: 'Summer Launch — Sponsored products', kind: 'campaign', status: 'Running', budget: '€4,000' },
];
const TableExpandableDemo: React.FC = () => {
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(['C-004']));
  const visible = planRows.filter((r) => r.kind === 'campaign' || (r.parent && open.has(r.parent)));
  return (
    <Table<PlanRow>
      rowKey={(r) => r.id}
      expandable={{
        isExpandable: (r) => r.kind === 'campaign',
        isExpanded: (r) => open.has(r.id),
        onToggle: (r) => setOpen((prev) => { const n = new Set(prev); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); return n; }),
        isChild: (r) => r.kind === 'booking',
      }}
      columns={[
        { key: 'name', header: 'Name', render: (r) => <span className={r.kind === 'campaign' ? 'font-medium' : ''}>{r.name}</span> },
        { key: 'status', header: 'Status', render: (r) => <Badge variant="success">{r.status}</Badge> },
        { key: 'budget', header: 'Budget', render: (r) => r.budget },
      ]}
      data={visible}
    />
  );
};

const TableActions: React.FC = () => (
  <Table<PreviewRow>
    rowKey={(r) => r.id}
    columns={[
      { key: 'name', header: 'Campaign', render: (r) => <span className="font-medium">{r.name}</span> },
      { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'Running' ? 'success' : 'todo'}>{r.status}</Badge> },
      { key: 'budget', header: 'Budget', render: (r) => r.budget },
    ]}
    data={previewRows}
    rowActions={() => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" iconOnly aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" iconOnly aria-label="More"><MoreHorizontal className="h-4 w-4" /></Button>
      </div>
    )}
  />
);

const TableEmpty: React.FC = () => (
  <Table<PreviewRow>
    rowKey={(r) => r.id}
    columns={[
      { key: 'name', header: 'Campaign' },
      { key: 'status', header: 'Status' },
      { key: 'budget', header: 'Budget' },
    ]}
    data={[]}
    emptyState={<span>No campaigns yet — add one from the media plan.</span>}
  />
);

/* ── Metric cards ────────────────────────────────────────────────────── */

const spark = [4, 6, 5, 8, 7, 9, 11, 10, 12].map((v) => ({ value: v }));
const MetricRowDemo: React.FC = () => (
  <MetricRow
    metrics={[
      { key: 'spend', label: 'Spend', value: '€2.1K', subMetric: 'of €3.2K budget', badgeValue: '66%', badgeVariant: 'secondary' },
      { key: 'roas', label: 'ROAS', value: '4.2x', subMetric: 'vs. 3.5x target', badgeValue: '+20%', badgeVariant: 'success' },
      { key: 'sales', label: 'Sales', value: '€8.8K', subMetric: 'attributed', badgeValue: '+8%', badgeVariant: 'success' },
      { key: 'clicks', label: 'Clicks', value: '6.2K', subMetric: 'last 30d', variant: 'graph', graphData: spark },
    ]}
    hideEditButton
  />
);

/* ── Inbox sample ────────────────────────────────────────────────────── */

const inboxItems: InboxItem[] = [
  { id: 'm1', kind: 'health', severity: 'blocking', subject: 'Holiday Sale Plan is at risk', preview: 'Live with 1 blocking issue — get help setting up this campaign first.', context: 'Holiday Sale Plan', level: 'media-plan' },
  { id: 'm2', kind: 'action', severity: 'attention', subject: 'Approve creative', preview: 'The creative for "Entrance Screens" awaits approval.', context: 'Summer Launch Plan · Digital in-store', level: 'booking' },
  { id: 'm3', kind: 'recommendation', severity: 'info', subject: 'Daily budget capped out on 4 of 7 days', preview: '"beer" stopped serving at 12:17 on average — an estimated 44 clicks were missed.', context: 'Summer Launch Plan · Sponsored products', level: 'booking' },
  { id: 'm4', kind: 'insight', severity: 'info', subject: 'One proposition carries most of the delivery', preview: '58% of spend runs through Display — worth checking the mix still matches the objective.', context: 'Holiday Sale Plan', level: 'media-plan' },
];

/* ── Filters, selects ────────────────────────────────────────────────── */

const FilterBarDemo: React.FC = () => {
  const [status, setStatus] = React.useState<string[]>(['running']);
  const [engine, setEngine] = React.useState<string[]>([]);
  const [q, setQ] = React.useState('');
  return (
    <FilterBar
      searchValue={q}
      onSearchChange={setQ}
      searchPlaceholder="Search campaigns…"
      filters={[
        { name: 'Status', options: [{ label: 'Running', value: 'running' }, { label: 'In option', value: 'in-option' }, { label: 'Paused', value: 'paused' }, { label: 'Draft', value: 'draft' }], selectedValues: status, onChange: setStatus },
        { name: 'Proposition', options: [{ label: 'Display', value: 'display' }, { label: 'Sponsored products', value: 'sp' }, { label: 'Digital in-store', value: 'dis' }], selectedValues: engine, onChange: setEngine },
      ]}
    />
  );
};

const SearchableSelectDemo: React.FC = () => {
  const [v, setV] = React.useState('coca-cola');
  return (
    <SearchableSelect
      options={[
        { value: 'coca-cola', label: 'Coca-Cola' },
        { value: 'unilever', label: 'Unilever Shopper Marketing' },
        { value: 'nestle', label: 'Nestlé Trade Marketing' },
        { value: 'heineken', label: 'Heineken' },
      ]}
      value={v}
      onChange={setV}
      placeholder="Select an advertiser"
    />
  );
};

const SearchSelectListDemo: React.FC = () => {
  const [v, setV] = React.useState<string[]>(['homepage']);
  return (
    <SearchSelectList
      label="Find channel"
      placeholder="Search channels…"
      options={placementChannels}
      value={v}
      onChange={setV}
    />
  );
};

const TargetSelectDemo: React.FC = () => {
  const [v, setV] = React.useState<Record<string, string[]>>({ 'shopper-profiles': ['Households with kids'] });
  return <TargetSelect groups={onlineTargetGroups} value={v} onChange={setV} />;
};

const SliderDemo: React.FC = () => {
  const [v, setV] = React.useState([60]);
  return <div className="w-64 pt-2"><Slider value={v} onValueChange={setV} max={100} step={1} /></div>;
};

/* ── Charts — sample series in the theme's chart ramp ───────────────── */

const chartData = [
  { month: 'W31', impressions: 420, clicks: 21 },
  { month: 'W32', impressions: 480, clicks: 26 },
  { month: 'W33', impressions: 460, clicks: 30 },
  { month: 'W34', impressions: 560, clicks: 34 },
  { month: 'W35', impressions: 610, clicks: 33 },
  { month: 'W36', impressions: 640, clicks: 39 },
];
const chartConfig = {
  impressions: { label: 'Impressions (K)', color: 'hsl(var(--chart-1))' },
  clicks: { label: 'Clicks (K)', color: 'hsl(var(--chart-3))' },
};
const pieData = [
  { name: 'Display', value: 38 },
  { name: 'Sponsored products', value: 26 },
  { name: 'Digital in-store', value: 21 },
  { name: 'Offsite', value: 15 },
];
const pieConfig = {
  'Display': { label: 'Display', color: 'hsl(var(--chart-1))' },
  'Sponsored products': { label: 'Sponsored products', color: 'hsl(var(--chart-2))' },
  'Digital in-store': { label: 'Digital in-store', color: 'hsl(var(--chart-3))' },
  'Offsite': { label: 'Offsite', color: 'hsl(var(--chart-5))' },
};

type PreviewRow = { id: string; name: string; status: string; budget: string; spend: string };
const previewRows: PreviewRow[] = [
  { id: 'C-004', name: 'Summer Launch — Display', status: 'Running', budget: '€5,000', spend: '€3,800' },
  { id: 'C-005', name: 'Summer Launch — Sponsored products', status: 'Running', budget: '€4,000', spend: '€3,600' },
  { id: 'C-011', name: 'Back to School — Offline in-store', status: 'To do', budget: '€5,000', spend: '—' },
];
const PreviewTable: React.FC = () => (
  <Table<PreviewRow>
    rowKey={(r) => r.id}
    columns={[
      { key: 'name', header: 'Campaign', render: (r) => <span className="font-medium">{r.name}</span> },
      { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'Running' ? 'success' : 'todo'}>{r.status}</Badge> },
      { key: 'budget', header: 'Budget', render: (r) => r.budget },
      { key: 'spend', header: 'Spend', render: (r) => r.spend },
    ]}
    data={previewRows}
  />
);

/* ── The registry ───────────────────────────────────────────────────── */

export const previewRegistry: Record<string, PreviewEntry> = {
  /* Actions */
  'button': { title: 'Button', group: 'Actions', render: () => <Button>Approve campaign</Button> },
  'button--outline': { title: 'Button / Outline', group: 'Actions', render: () => <Button variant="outline">Cancel</Button> },
  'button--ghost': { title: 'Button / Ghost', group: 'Actions', render: () => <Button variant="ghost">Skip</Button> },
  'button--destructive': { title: 'Button / Destructive', group: 'Actions', render: () => <Button variant="destructive">Delete booking</Button> },
  'button--icon': { title: 'Button / Icon only', group: 'Actions', render: () => <Button variant="ghost" size="sm" iconOnly aria-label="Edit"><Pencil className="h-4 w-4" /></Button> },
  'add-button': { title: 'Add button', group: 'Actions', render: () => <AddButton onClick={() => {}}>Add media plan</AddButton> },

  /* Inputs & controls */
  'input': { title: 'Input', group: 'Inputs & controls', render: () => <StatefulInput /> },
  'input--hint': { title: 'Input / With field hint', group: 'Inputs & controls', render: () => <StatefulInput hint /> },
  'textarea': { title: 'Textarea', group: 'Inputs & controls', render: () => <div className="space-y-1.5"><Label>Notes</Label><Textarea defaultValue="Prefer evening delivery on entrance screens." /></div> },
  'checkbox': { title: 'Checkbox', group: 'Inputs & controls', render: () => <StatefulCheckbox /> },
  'switch': { title: 'Switch', group: 'Inputs & controls', render: () => <StatefulSwitch /> },
  'date-range-picker': { title: 'Date range picker', group: 'Inputs & controls', render: () => <StatefulDateRange />, wide: true },

  /* Communication */
  'badge': { title: 'Badge', group: 'Communication', render: () => <Badge>Draft</Badge> },
  'badge--success': { title: 'Badge / Success', group: 'Communication', render: () => <Badge variant="success">Running</Badge> },
  'badge--warning': { title: 'Badge / Warning', group: 'Communication', render: () => <Badge variant="warning">Paused</Badge> },
  'badge--destructive': { title: 'Badge / Danger', group: 'Communication', render: () => <Badge variant="destructive">Rejected</Badge> },
  'badge--todo': { title: 'Badge / To do', group: 'Communication', render: () => <Badge variant="todo">2 actions</Badge> },
  'level-meter': { title: 'Level meter', group: 'Communication', render: () => <div className="w-56"><LevelMeter label="Search volume" level={4} detail="6,200 searches" /></div> },

  /* Navigation */
  'tabs': { title: 'Tabs', group: 'Navigation', render: () => <StatefulTabs /> },

  /* Containment */
  'table': { title: 'Table', group: 'Containment', wide: true, render: () => <PreviewTable /> },

  /* Data display */
  'summary-card--details': {
    title: 'Summary card / Details', group: 'Data display',
    render: () => (
      <SummaryCard
        title="Booking"
        entity="booking"
        variant="details"
        items={[
          { label: 'Name', value: 'Homepage Takeover' },
          { label: 'Runtime', value: '7 Sep – 4 Oct 2026' },
          { label: 'Total budget', value: '€4,000' },
          { label: 'Placement', value: 'Homepage top banner' },
        ]}
      />
    ),
  },
  'summary-card--process': {
    title: 'Summary card / Process', group: 'Data display',
    render: () => (
      <SummaryCard
        title="New booking"
        entity="booking"
        variant="process"
        steps={[
          { id: 's1', label: 'Setup', status: 'completed', value: 'Homepage Takeover' },
          { id: 's2', label: 'Run time & budget', status: 'completed', values: ['7 Sep – 4 Oct 2026', '€4,000'] },
          { id: 's3', label: 'Placements', status: 'active' },
          { id: 's4', label: 'Targeting', status: 'pending' },
        ]}
      />
    ),
  },
  'summary-card--collapsible': {
    title: 'Summary card / Collapsible', group: 'Data display',
    render: () => (
      <SummaryCard
        title="Campaign"
        entity="campaign"
        variant="details"
        collapsible
        items={[
          { label: 'Name', value: 'Summer Launch — Display' },
          { label: 'Advertiser', value: 'Coca-Cola' },
          { label: 'Budget', value: '€5,000' },
        ]}
      />
    ),
  },

  /* Product surfaces */
  'proposition-icons': {
    title: 'Proposition icons', group: 'Product surfaces',
    render: () => (
      <div className="flex items-center gap-4 text-foreground">
        {['sponsored-products', 'display', 'digital-instore', 'offline-instore', 'offsite', 'media-plans'].map((p) => (
          <span key={p} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <PropositionIcon engineType={p} />
            {p}
          </span>
        ))}
      </div>
    ),
  },
  'goal-card': {
    title: 'Goal card', group: 'Product surfaces',
    render: () => (
      <div className="grid max-w-xl grid-cols-2 gap-2">
        <GoalCard icon={<Gavel />} title="Auction" description="Bid per placement — each selected placement carries its own CPC." selected onClick={() => {}} />
        <GoalCard icon={<ShieldCheck />} title="Guaranteed" description="Fixed price, reserved delivery — no bidding." onClick={() => {}} />
      </div>
    ),
  },
  'goal-select': { title: 'Goal select', group: 'Product surfaces', render: () => <StatefulGoalSelect />, wide: true },
  'setup-checklist': {
    title: 'Setup checklist', group: 'Product surfaces', wide: true,
    render: () => (
      <SetupChecklist
        heading="Setup checklist"
        cards={[
          {
            id: 'c1',
            icon: <MonitorSpeaker className="h-4 w-4" />,
            title: 'Summer Launch — Display',
            steps: [
              { id: 's1', title: 'Approve campaign', done: true },
              { id: 's2', title: 'Approve bookings', description: '2 bookings awaiting approval', done: false },
              { id: 's3', title: 'Link creatives', done: false },
            ],
          },
          {
            id: 'c2',
            icon: <ListStart className="h-4 w-4" />,
            title: 'Summer Launch — Sponsored products',
            steps: [
              { id: 's1', title: 'Approve campaign', done: true },
              { id: 's2', title: 'Approve bookings', done: true },
              { id: 's3', title: 'Add products and keywords', done: true },
            ],
          },
        ]}
        onDismiss={() => {}}
      />
    ),
  },
  'budget-pacing': { title: 'Budget pacing / Even (default)', group: 'Product surfaces', render: () => <StatefulPacing />, wide: true },
  'budget-pacing--custom': { title: 'Budget pacing / Custom daily budget', group: 'Product surfaces', render: () => <StatefulPacing custom />, wide: true },
  'pacing-shapes': { title: 'Pacing shapes', group: 'Product surfaces', render: () => <StatefulPacingShapes /> },
  'toggle-card': { title: 'Toggle card', group: 'Product surfaces', render: () => <StatefulToggleCard /> },
  'toggle-card--open': { title: 'Toggle card / With settings', group: 'Product surfaces', render: () => <StatefulToggleCard open /> },
  'create-placement': { title: 'Create placement', group: 'Product surfaces', render: () => <StatefulPlacement />, wide: true },
  'control-bar': {
    title: 'Control bar', group: 'Product surfaces', wide: true,
    render: () => (
      <ControlBar>
        <ControlBarItem label="Status"><Badge variant="success" size="large">Running</Badge></ControlBarItem>
        <ControlBarItem label="Budget"><span className="text-sm font-medium tabular-nums">€40,000</span></ControlBarItem>
        <ControlBarItem label="Run time"><span className="text-sm">7 Sep – 4 Oct 2026</span></ControlBarItem>
      </ControlBar>
    ),
  },

  /* Containment — the table's use-case variants */
  'table--selectable': { title: 'Table / Row selection', group: 'Containment', wide: true, render: () => <TableSelectable /> },
  'table--expandable': { title: 'Table / Expandable child rows', group: 'Containment', wide: true, render: () => <TableExpandableDemo /> },
  'table--actions': { title: 'Table / Row actions', group: 'Containment', wide: true, render: () => <TableActions /> },
  'table--empty': { title: 'Table / Empty state', group: 'Containment', wide: true, render: () => <TableEmpty /> },

  /* Data display — metric cards */
  'metric-card': { title: 'Metric card', group: 'Data display', render: () => <div className="w-52"><MetricCard label="ROAS" value="4.2x" subMetric="vs. 3.5x target" badgeValue="+20%" badgeVariant="success" /></div> },
  'metric-card--graph': { title: 'Metric card / Sparkline', group: 'Data display', render: () => <div className="w-52"><MetricCard label="Clicks" value="6.2K" subMetric="last 30d" variant="graph" graphData={spark} /></div> },
  'metric-card--donut': { title: 'Metric card / Donut legend', group: 'Data display', render: () => <div className="w-64"><MetricCard label="Spend by proposition" variant="donutLegend" donutData={[{ name: 'Display', value: 4200 }, { name: 'Sponsored products', value: 2600 }, { name: 'Digital in-store', value: 1900 }]} valueFormatter={(v) => `€${v.toLocaleString()}`} /></div> },
  'metric-card--bar': { title: 'Metric card / Top categories', group: 'Data display', render: () => <div className="w-64"><MetricCard label="Top products" variant="barHorizontal" productData={[{ name: 'Coca-Cola Zero 1.5L', value: 3200 }, { name: 'Fanta Orange 1L', value: 2100 }, { name: 'Sprite 1.5L', value: 1400 }]} valueFormatter={(v) => `€${v.toLocaleString()}`} /></div> },
  'metric-card--budget': { title: 'Metric card / Budget stacked', group: 'Data display', render: () => <div className="w-64"><MetricCard label="Budget by proposition" variant="budgetStacked" budgetData={[{ name: 'Display', spent: 3800, budget: 5000 }, { name: 'Sponsored products', spent: 3600, budget: 4000 }, { name: 'Offline in-store', spent: 0, budget: 5000 }]} valueFormatter={(v) => `€${v.toLocaleString()}`} /></div> },
  'metric-row': { title: 'Metric row', group: 'Data display', wide: true, render: () => <MetricRowDemo /> },

  /* Data display — bars and badges */
  'fill-rate-bar': { title: 'Fill rate bar', group: 'Data display', render: () => <div className="w-72"><FillRateBar value={{ booked: 45, reserved: 20, available: 35 }} showLabels hoverTooltip={false} /></div> },
  'fill-rate-bar--overbooked': { title: 'Fill rate bar / Overbooked', group: 'Data display', render: () => <div className="w-72"><FillRateBar value={{ booked: 80, reserved: 20, overbooked: 12 }} showLabels hoverTooltip={false} /></div> },
  'available-time-bar': { title: 'Available time bar', group: 'Data display', render: () => <div className="w-72"><AvailableTimeBar value={{ noAvailable: 30, lowAvailable: 25, mediumAvailable: 25, highAvailable: 20 }} showLabels hoverTooltip={false} /></div> },
  'hierarchy-badge': { title: 'Hierarchy badge', group: 'Data display', render: () => <div className="flex flex-col items-start gap-2"><HierarchyBadge level="media-plan" /><HierarchyBadge level="campaign" /><HierarchyBadge level="booking" /></div> },
  'avatar': { title: 'Avatar', group: 'Data display', render: () => <Avatar><AvatarFallback>JD</AvatarFallback></Avatar> },
  'read-only-field': { title: 'Read-only field', group: 'Data display', render: () => <div className="w-72"><ReadOnlyField label="Runtime" value="7 Sep – 4 Oct 2026" hint="Inherited from the campaign" /></div> },

  /* Data display — summary stack */
  'summary-card--stack': {
    title: 'Summary cards / Stacked', group: 'Data display',
    render: () => (
      <div className="space-y-3">
        <SummaryCard
          title="Campaign"
          entity="campaign"
          variant="details"
          collapsible
          items={[
            { label: 'Name', value: 'Summer Launch — Display' },
            { label: 'Advertiser', value: 'Coca-Cola' },
            { label: 'Budget', value: '€5,000' },
          ]}
        />
        <SummaryCard
          title="New booking"
          entity="booking"
          variant="process"
          steps={[
            { id: 's1', label: 'Setup', status: 'completed', value: 'Homepage Takeover' },
            { id: 's2', label: 'Run time & budget', status: 'active' },
            { id: 's3', label: 'Placements', status: 'pending' },
            { id: 's4', label: 'Targeting', status: 'pending' },
          ]}
        />
      </div>
    ),
  },

  /* Product surfaces — the media plan card */
  'campaign-summary': {
    title: 'Media plan card', group: 'Product surfaces', wide: true,
    render: () => (
      <CampaignSummary
        title="Summer Launch Plan"
        badge={{ text: 'Running', variant: 'success' }}
        goal="Purchase"
        audience="Households with kids"
        estimatedRoas="3.8x"
        budget="9000"
        usedBudget="€3,420"
        budgetUsagePercentage={38}
        placements={5}
        bookings={3}
        engines={[
          { id: 'display', name: 'Display', campaignName: 'Summer Launch — Display', status: 'running', enabled: true, budget: 5000, spend: 3800 },
          { id: 'sponsored-products', name: 'Sponsored products', campaignName: 'Summer Launch — Sponsored products', status: 'running', enabled: true, budget: 4000, spend: 3600 },
        ]}
        features={[]}
        collapsedOnly
      />
    ),
  },
  'target-select': { title: 'Target select', group: 'Product surfaces', wide: true, render: () => <TargetSelectDemo /> },

  /* Communication */
  'inbox': { title: 'Inbox', group: 'Communication', wide: true, render: () => <Inbox items={inboxItems} status={{ m4: 'read' }} onOpen={() => {}} /> },
  'alert': { title: 'Alert', group: 'Communication', render: () => <Alert><AlertTitle>Plan adjusted</AlertTitle><AlertDescription>The campaign budget exceeds the plan by €1,000 — the plan total was raised to match.</AlertDescription></Alert> },

  /* Inputs & controls — search and selects */
  'search-input': { title: 'Search input', group: 'Inputs & controls', render: () => <SearchInput placeholder="Search campaigns…" /> },
  'searchable-select': { title: 'Searchable select', group: 'Inputs & controls', render: () => <SearchableSelectDemo /> },
  'search-select-list': { title: 'Search select list', group: 'Inputs & controls', render: () => <SearchSelectListDemo /> },
  'slider': { title: 'Slider', group: 'Inputs & controls', render: () => <SliderDemo /> },

  /* Actions */
  'split-button': { title: 'Split button', group: 'Actions', render: () => <SplitButton label="Save" onClick={() => {}} menu={[{ label: 'Save and approve' }, { label: 'Save as draft' }]} /> },

  /* Navigation / Filters */
  'filter-bar': { title: 'Filter bar', group: 'Navigation', wide: true, render: () => <FilterBarDemo /> },

  /* Charts */
  'area-chart': { title: 'Area chart', group: 'Data display', wide: true, render: () => <div className="h-64"><AreaChartComponent data={chartData} config={chartConfig} /></div> },
  'line-chart': { title: 'Line chart', group: 'Data display', wide: true, render: () => <div className="h-64"><LineChartComponent data={chartData} config={chartConfig} /></div> },
  'bar-chart': { title: 'Bar chart', group: 'Data display', wide: true, render: () => <div className="h-64"><BarChartComponent data={chartData} config={chartConfig} /></div> },
  'pie-chart': { title: 'Pie chart', group: 'Data display', render: () => <div className="h-72 w-72"><PieChartComponent data={pieData} config={pieConfig} innerRadius={45} /></div> },
};

export const previewGroups = [
  'Actions',
  'Inputs & controls',
  'Containment',
  'Communication',
  'Navigation',
  'Data display',
  'Product surfaces',
] as const;
