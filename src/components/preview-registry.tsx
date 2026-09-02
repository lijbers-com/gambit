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
import { BudgetPacing, type PacingShape, type PacingOverride } from './ui/budget-pacing';
import { SettingsCard } from './ui/settings-card';
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
import { cn } from '@/lib/utils';
import { TablePagination } from './ui/table-pagination';
import { FormSection } from './ui/form-section';
import { NotificationDot } from './ui/notification-dot';
import { CheckboxCard } from './ui/checkbox-card';
import { OptionCard, OptionCardSection, OptionCardItems, OptionCardTick } from './ui/option-card';
import { Store, Users } from 'lucide-react';
import { FlaskConical } from 'lucide-react';
import { BuyingTypePicker } from './ui/buying-type-picker';
import { RetailProductSelect } from './ui/retail-product-select';
import { ObjectiveKpiSelect, type ObjectiveKpiValue } from './ui/objective-kpi-select';
import { ConversionFunnelComponent } from './ui/conversion-funnel';
import { RadarChartComponent } from './ui/radar-chart';
import { useToast } from './ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AdvertiserSelect } from './ui/advertiser-select';
import { AttributionWindowSelect } from './ui/attribution-window-select';
import { BudgetSelect } from './ui/budget-select';
import { LifecycleActions } from './ui/lifecycle-actions';
import { Viewbar } from './ui/viewbar';
import { SessionDateRange } from './ui/session-date-range';
import { SuggestionList } from './ui/suggestion-list';
import { SelectionList } from './ui/selection-list';
import { PageHeader } from './ui/page-header';
import { Logo } from './ui/logo';
import { ThemeSwitcher } from './ui/theme-switcher';
import { VersionSwitcher } from './ui/version-switcher';
import { FaqPanel } from './ui/faq-panel';
import { NotificationItem } from './ui/notification-item';
import { DeliveryBehaviorFields, defaultDeliveryBehavior, type DeliveryBehaviorValue } from './ui/delivery-settings';
import { OptimisationCard, budgetOptimisationExplain, ctrTargetingExplain } from './ui/optimisation-card';
import { MapChart } from './ui/map-chart';
import { FunnelChartComponent } from './ui/funnel-chart';
import { ChartFrame } from './ui/chart-frame';
import { MessageDrawer } from './ui/message-drawer';
import { Separator } from './ui/separator';
import { HeaderSearch } from './ui/header-search';
import { AddCampaignMenu } from './ui/add-campaign-menu';
import { OrganisationsIcon, BrandsIcon, CreateIcon } from './ui/custom-icons';
import { SideNavigation } from './ui/side-navigation';
import { buildForecastMetrics } from './ui/forecast-metrics';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { VersionProvider } from '@/contexts/version-context';
import { BookingBudgetRuntime } from './ui/booking-budget-runtime';
import { HierarchySidebar } from './ui/hierarchy-sidebar';
import { HeaderActions } from './ui/header-actions';
import { SmartBreadcrumbsSimple } from './ui/smart-breadcrumbs-simple';
import { NotificationSettings } from './ui/notification-settings';
import { MessageAdvertiser } from './ui/message-advertiser';
import { InsightsNotifications } from './ui/insights-notifications';
import { LinkPickerDialog } from './ui/link-picker';
import { CalendarTable } from './ui/calendar-table';
import { MarketingSection, MarketingHeading, MarketingButton, MarketingStat } from './ui/marketing';
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
    | 'Fundamentals'
    | 'Actions'
    | 'Inputs & controls'
    | 'Containment'
    | 'Communication'
    | 'Navigation'
    | 'Overlays'
    | 'Data display'
    | 'Product surfaces';
  render: () => React.ReactNode;
  /** Widen the stage for entries that are full page sections. */
  wide?: boolean;
  /** Overlay components render through portals — the index links to them
   *  instead of inlining dozens of open layers on one page. */
  portal?: boolean;
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
  return <GoalSelect goals={goalOptions} value={v} onChange={setV} />;
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

const PACING_DEMO_OPTIONS = [
  { value: 'even', label: 'Even', description: 'The same target every day, so the budget lasts exactly as long as the flight.' },
  { value: 'frontloaded', label: 'Frontloaded', description: 'Spends faster in the first days, then eases off — buys reach early.' },
  { value: 'custom', label: 'Daily budget', description: 'You set the cap. Delivery stops for the day once it is reached.' },
];

/**
 * The spacing fundamental, rendered from the REAL utility classes — every bar
 * is the actual Tailwind width, so the scale shown is the scale shipped.
 * No custom spacing exists in tailwind.config.js: the grid is Tailwind's
 * 4px base, and these are the steps the house patterns actually use.
 */
const SpacingScale: React.FC = () => (
  <div className="w-full max-w-xl space-y-6">
    <div className="space-y-2">
      {[
        { cls: 'w-1', name: '1', px: '4px', use: 'micro gaps — control clusters (gap-1)' },
        { cls: 'w-1.5', name: '1.5', px: '6px', use: 'icon to label (gap-1.5) · label to field (space-y-1.5)' },
        { cls: 'w-2', name: '2', px: '8px', use: 'stacked cards and list rows (space-y-2, gap-2)' },
        { cls: 'w-3', name: '3', px: '12px', use: 'the card section unit — OptionCard/ToggleCard p-3, body space-y-3' },
        { cls: 'w-4', name: '4', px: '16px', use: 'compact card padding (p-4) · page grids (gap-4)' },
        { cls: 'w-6', name: '6', px: '24px', use: 'card padding (p-6) · section gaps (gap-6)' },
      ].map((step) => (
        <div key={step.name} className="flex items-center gap-3">
          <span className={cn('block h-3 shrink-0 rounded-[2px] bg-primary/70', step.cls)} />
          <span className="w-16 shrink-0 text-xs font-medium tabular-nums">{step.name} · {step.px}</span>
          <span className="min-w-0 truncate text-xs text-muted-foreground">{step.use}</span>
        </div>
      ))}
    </div>
    <div className="flex items-end gap-6">
      {[
        { cls: 'rounded-sm', label: 'sm 4px' },
        { cls: 'rounded-md', label: 'md 6px — inputs, option cards' },
        { cls: 'rounded-lg', label: 'lg 8px (--radius)' },
        { cls: 'rounded-xl', label: 'xl 12px — cards' },
      ].map((r) => (
        <div key={r.cls} className="flex flex-col items-start gap-1.5">
          <span className={cn('block h-9 w-14 border border-border bg-background', r.cls)} />
          <span className="text-[11px] text-muted-foreground">{r.label}</span>
        </div>
      ))}
      <div className="flex flex-col items-start gap-1.5">
        <span className="flex h-9 w-28 items-center rounded-md border border-input px-3 text-xs text-muted-foreground">h-9 · 36px</span>
        <span className="text-[11px] text-muted-foreground">field & button height</span>
      </div>
    </div>
  </div>
);

const StatefulSettingsCard: React.FC<{ open?: boolean }> = ({ open }) => {
  const [v, setV] = React.useState('even');
  return (
    <SettingsCard
      label="Budget pacing"
      options={PACING_DEMO_OPTIONS}
      value={v}
      onChange={setV}
      defaultSettingsOpen={open}
      renderOpenExtra={(opt) => (
        <p className="text-xs text-muted-foreground">
          The chosen option's own settings render here — an estimate, a date override, a cap.
          (This demo shows the anatomy; Budget pacing is the real tenant.)
        </p>
      )}
    />
  );
};

const StatefulCheckboxCard: React.FC<{ checked?: boolean }> = ({ checked }) => {
  const [on, setOn] = React.useState(!!checked);
  return (
    <CheckboxCard
      icon={<FlaskConical />}
      title="Add a brand-lift study"
      meta={on ? '· included' : '· +€1,500'}
      description="Measures the uplift this KPI drives against a control group. Free above €25k of spend."
      checked={on}
      onCheckedChange={setOn}
    />
  );
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
      // Explicit actions REPLACE the overflow column — never both.
      <Button variant="ghost" size="sm" iconOnly aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
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

/* ── Pagination, pickers, overlays ───────────────────────────────────── */

const TableWithPagination: React.FC = () => {
  const [page, setPage] = React.useState(2);
  const [sort, setSort] = React.useState('name');
  return (
    <div className="space-y-3">
      <PreviewTable />
      <TablePagination
        currentPage={page}
        totalPages={8}
        onPageChange={setPage}
        sortOptions={[{ value: 'name', label: 'Name' }, { value: 'budget', label: 'Budget' }, { value: 'spend', label: 'Spend' }]}
        selectedSort={sort}
        onSortChange={setSort}
      />
    </div>
  );
};

const StatefulBuyingType: React.FC = () => {
  const [v, setV] = React.useState<'auction' | 'guaranteed'>('auction');
  return <BuyingTypePicker value={v} onChange={setV} />;
};

const StatefulRetailProducts: React.FC = () => {
  const [v, setV] = React.useState<string[]>(['rp-1']);
  return <RetailProductSelect value={v} onChange={setV} showCount />;
};

const StatefulObjectiveKpi: React.FC = () => {
  const [v, setV] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
  return <ObjectiveKpiSelect value={v} onChange={setV} />;
};

const ToastDemo: React.FC = () => {
  const toast = useToast();
  return (
    <Button variant="outline" onClick={() => toast({ title: 'Booking saved', description: 'Homepage Takeover was updated.' })}>
      Show toast
    </Button>
  );
};

const DialogDemo: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete booking?</DialogTitle>
            <DialogDescription>
              "Homepage Takeover" will be removed from Summer Launch — Display. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>Delete booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PopoverDemo: React.FC = () => (
  <Popover defaultOpen>
    <PopoverTrigger asChild>
      <Button variant="outline">Filter: Status</Button>
    </PopoverTrigger>
    <PopoverContent align="start" className="w-56 space-y-2">
      {['Running', 'In option', 'Paused', 'Draft'].map((o) => (
        <label key={o} className="flex items-center gap-2 text-sm"><Checkbox defaultChecked={o === 'Running'} /> {o}</label>
      ))}
    </PopoverContent>
  </Popover>
);

const DropdownDemo: React.FC = () => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" iconOnly aria-label="Options"><MoreHorizontal className="h-4 w-4" /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit campaign</DropdownMenuItem>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const TooltipDemo: React.FC = () => (
  <TooltipProvider delayDuration={0}>
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline">Incremental ROAS</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Return attributable to the campaign, measured against matched control stores.</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const funnelStages = [
  { key: 'impressions', label: 'Impressions', value: 640000 },
  { key: 'clicks', label: 'Clicks', value: 39000 },
  { key: 'add-to-cart', label: 'Add to cart', value: 8200 },
  { key: 'purchase', label: 'Purchase', value: 3100 },
];

const radarData = [
  { subject: 'Reach', display: 80, sp: 45 },
  { subject: 'CTR', display: 55, sp: 85 },
  { subject: 'Conversion', display: 40, sp: 90 },
  { subject: 'New to brand', display: 70, sp: 50 },
  { subject: 'Frequency', display: 75, sp: 40 },
];

/* ── The long tail: chrome, panels, domain pickers ──────────────────── */

const StatefulAdvertiser: React.FC = () => {
  const [v, setV] = React.useState('coca-cola');
  return <AdvertiserSelect value={v} onChange={setV} />;
};
const StatefulAttribution: React.FC = () => {
  const [v, setV] = React.useState(14);
  return <AttributionWindowSelect value={v} onChange={setV} />;
};
const StatefulViewbar: React.FC = () => {
  const [tab, setTab] = React.useState('details');
  return (
    <Viewbar
      labels={[{ label: 'Running', color: 'success' }, { label: 'B-016', color: 'muted' }]}
      tabs={[{ value: 'details', label: 'Booking details' }, { value: 'targeting', label: 'Targeting' }, { value: 'logs', label: 'Logs' }]}
      activeTab={tab}
      onTabChange={setTab}
    />
  );
};
const StatefulSelectionList: React.FC<{ variant: 'list' | 'switch' }> = ({ variant }) => {
  const [items, setItems] = React.useState([
    { id: 'k1', label: 'coffee', meta: 'Volume: High · Competition: Medium' },
    { id: 'k2', label: 'coffee pads', meta: 'Volume: Medium · Competition: Low' },
    { id: 'k3', label: 'espresso', meta: 'Volume: Medium · Competition: High' },
  ]);
  return (
    <SelectionList
      items={items}
      variant={variant}
      onRemove={(id) => setItems((xs) => xs.filter((x) => x.id !== id))}
      onToggle={() => {}}
    />
  );
};
const StatefulDelivery: React.FC = () => {
  const [v, setV] = React.useState<DeliveryBehaviorValue>({ ...defaultDeliveryBehavior, userFrequencyCap: true });
  return <DeliveryBehaviorFields value={v} onChange={setV} />;
};
const MessageDrawerInline: React.FC = () => (
  <MessageDrawer
    inline
    open
    onOpenChange={() => {}}
    kind="recommendation"
    severity="attention"
    subject="Daily budget capped out on 4 of 7 days"
    context="Summer Launch Plan · Sponsored products"
    level="booking"
    message={'"beer" stopped serving at 12:17 on average — an estimated 44 clicks were missed after the budget ran out.'}
    businessCase={budgetOptimisationExplain()}
    footer={
      <>
        <Button variant="outline">Decline</Button>
        <Button>Raise daily budget to €160</Button>
      </>
    }
  />
);
const mapData = [
  { name: 'Amsterdam', plays: 4200, x: 52, y: 38 },
  { name: 'Rotterdam', plays: 3100, x: 44, y: 62 },
  { name: 'Utrecht', plays: 1900, x: 56, y: 52 },
  { name: 'Eindhoven', plays: 1400, x: 62, y: 78 },
];
const funnelData = [
  { name: 'Impressions', value: 640 },
  { name: 'Clicks', value: 210 },
  { name: 'Add to cart', value: 96 },
  { name: 'Purchase', value: 41 },
];
const funnelConfig = {
  'Impressions': { label: 'Impressions', color: 'hsl(var(--chart-1))' },
  'Clicks': { label: 'Clicks', color: 'hsl(var(--chart-2))' },
  'Add to cart': { label: 'Add to cart', color: 'hsl(var(--chart-3))' },
  'Purchase': { label: 'Purchase', color: 'hsl(var(--chart-5))' },
};
const forecastRow = buildForecastMetrics({
  budget: 40000,
  days: 28,
  stage: 'Conversion',
  engines: [
    { name: 'Display', budget: 25000, color: 'hsl(var(--chart-1))' },
    { name: 'Sponsored products', budget: 15000, color: 'hsl(var(--chart-3))' },
  ],
});

/* ── Final coverage: composed booking block, calendar grid, panels ──── */

const StatefulBookingRuntime: React.FC = () => {
  const [budget, setBudget] = React.useState('4000');
  const [start, setStart] = React.useState<Date | undefined>(new Date('2026-09-07'));
  const [end, setEnd] = React.useState<Date | undefined>(new Date('2026-10-04'));
  const [st, setSt] = React.useState('00:00');
  const [et, setEt] = React.useState('23:59');
  const [days, setDays] = React.useState(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
  return (
    <BookingBudgetRuntime
      budget={budget}
      onBudgetChange={setBudget}
      startDate={start}
      endDate={end}
      onStartDateChange={setStart}
      onEndDateChange={setEnd}
      startTime={st}
      endTime={et}
      onStartTimeChange={setSt}
      onEndTimeChange={setEt}
      campaignBudget="€10,000"
      campaignRuntime="1 Sep – 31 Oct 2026"
      activeDays={days}
      onActiveDaysChange={setDays}
    />
  );
};

const StatefulLinkPicker: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [v, setV] = React.useState<string | undefined>('C-004');
  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>Link campaign</Button>
      <LinkPickerDialog
        open={open}
        onOpenChange={setOpen}
        entityLabel="campaign"
        options={[
          { value: 'C-004', label: 'Summer Launch — Display', details: { Status: 'Running', Budget: '€5,000' } },
          { value: 'C-005', label: 'Summer Launch — Sponsored products', details: { Status: 'Running', Budget: '€4,000' } },
          { value: 'C-011', label: 'Back to School — Offline in-store', details: { Status: 'Draft', Budget: '€5,000' } },
        ]}
        value={v}
        onChange={setV}
        allowNone
      />
    </div>
  );
};

const calendarProducts = [
  { id: 'homepage', name: 'Homepage', availability: [{ booked: 60, reserved: 20, available: 20 }, { booked: 85, reserved: 10, available: 5 }, { booked: 40, available: 60 }, { booked: 95, overbooked: 8 }, { booked: 30, available: 70 }, { booked: 55, reserved: 25, available: 20 }] },
  { id: 'category', name: 'Category pages', availability: [{ booked: 30, available: 70 }, { booked: 45, reserved: 15, available: 40 }, { booked: 70, available: 30 }, { booked: 50, available: 50 }, { booked: 20, available: 80 }, { booked: 35, available: 65 }] },
];
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
    title: 'Goal card (campaign type)', group: 'Product surfaces',
    render: () => <div className="max-w-xl"><StatefulBuyingType /></div>,
  },
  'goal-select': { title: 'Goal select', group: 'Inputs & controls', render: () => <StatefulGoalSelect />, wide: true },
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
  'spacing-scale': { title: 'Spacing, radius and control heights', group: 'Fundamentals', wide: true, render: () => <SpacingScale /> },
  'settings-card': { title: 'Settings card / Resting', group: 'Inputs & controls', wide: true, render: () => <StatefulSettingsCard /> },
  'settings-card--open': { title: 'Settings card / Settings unfolded', group: 'Inputs & controls', wide: true, render: () => <StatefulSettingsCard open /> },
  'toggle-card': { title: 'Toggle card', group: 'Inputs & controls', render: () => <StatefulToggleCard /> },
  'option-card': {
    title: 'Option card', group: 'Inputs & controls', wide: true,
    render: () => (
      <OptionCard
        selected
        icon={<Store />}
        title="All stores"
        description="Every store in the banner's network"
        control={<OptionCardTick />}
      >
        <OptionCardItems items={[{ icon: <Users />, label: '48,750 reach' }, { icon: <Store />, label: '750 stores' }]} />
        <OptionCardSection selected>
          <p className="text-xs text-muted-foreground">Nested settings section — dates, objects, a picker — behind its own full-width rule.</p>
        </OptionCardSection>
      </OptionCard>
    ),
  },
  'checkbox-card': { title: 'Checkbox card', group: 'Inputs & controls', wide: true, render: () => <StatefulCheckboxCard /> },
  'checkbox-card--checked': { title: 'Checkbox card / Included', group: 'Inputs & controls', wide: true, render: () => <StatefulCheckboxCard checked /> },
  'toggle-card--open': { title: 'Toggle card / With settings', group: 'Inputs & controls', render: () => <StatefulToggleCard open /> },
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

  /* Containment — pagination */
  'table--pagination': { title: 'Table / With pagination', group: 'Containment', wide: true, render: () => <TableWithPagination /> },
  'pagination': { title: 'Table pagination', group: 'Navigation', wide: true, render: () => <TablePagination currentPage={3} totalPages={12} onPageChange={() => {}} showSort={false} /> },

  /* Inputs & controls — domain selects */
  'retail-product-select': { title: 'Retail product select', group: 'Inputs & controls', wide: true, render: () => <StatefulRetailProducts /> },
  'objective-kpi-select': { title: 'Objective and KPI select', group: 'Inputs & controls', wide: true, render: () => <StatefulObjectiveKpi /> },
  'form-section': { title: 'Form section', group: 'Containment', wide: true, render: () => <FormSection bordered title="Run time & budget"><p className="text-sm text-muted-foreground">Every form block on a detail page sits in this bordered section; inside a wizard card the border is the card's (bordered=false).</p></FormSection> },

  /* Communication */
  'notification-dot': { title: 'Notification dot', group: 'Communication', render: () => <div className="flex items-center gap-6"><span className="relative inline-flex"><Button variant="outline" iconOnly aria-label="Notifications" size="sm">🔔</Button><NotificationDot count={9} className="absolute -right-1 -top-1" /></span><NotificationDot count={128} /></div> },
  'toast': { title: 'Toast', group: 'Communication', render: () => <ToastDemo /> },

  /* Overlays — framed live; the index links rather than opening them all */
  'dialog': { title: 'Dialog', group: 'Overlays', portal: true, render: () => <DialogDemo /> },
  'popover': { title: 'Popover', group: 'Overlays', portal: true, render: () => <PopoverDemo /> },
  'dropdown-menu': { title: 'Dropdown menu', group: 'Overlays', portal: true, render: () => <DropdownDemo /> },
  'tooltip': { title: 'Tooltip', group: 'Overlays', portal: true, render: () => <TooltipDemo /> },

  /* Data display — specialty charts */
  'conversion-funnel': { title: 'Conversion funnel', group: 'Data display', wide: true, render: () => <ConversionFunnelComponent stages={funnelStages} valueFormatter={(v) => v.toLocaleString()} /> },
  'radar-chart': { title: 'Radar chart', group: 'Data display', render: () => <div className="h-72 w-72"><RadarChartComponent data={radarData} config={{ display: { label: 'Display', color: 'hsl(var(--chart-1))' }, sp: { label: 'Sponsored products', color: 'hsl(var(--chart-3))' } }} /></div> },

  /* Navigation chrome */
  'page-header': { title: 'Page header', group: 'Navigation', wide: true, render: () => <PageHeader title="Summer Launch Plan" subtitle="Coca-Cola · Purchase" showOptionsMenu={false} headerRight={null} /> },
  'viewbar': { title: 'Viewbar', group: 'Navigation', wide: true, render: () => <StatefulViewbar /> },
  'session-date-range': { title: 'Session date range', group: 'Navigation', render: () => <SessionDateRange /> },
  'logo': { title: 'Logo (theme-aware)', group: 'Navigation', render: () => <Logo /> },
  'theme-switcher': { title: 'Theme switcher', group: 'Navigation', render: () => <ThemeSwitcher /> },
  'version-switcher': { title: 'Version switcher', group: 'Navigation', render: () => <VersionProvider><VersionSwitcher /></VersionProvider> },
  'header-search': { title: 'Header search', group: 'Navigation', render: () => <div className="w-80"><HeaderSearch /></div> },
  'side-navigation': { title: 'Side navigation', group: 'Navigation', portal: true, render: () => <div className="h-[560px] w-64 overflow-hidden rounded-xl border border-border"><SideNavigation routes={getRoutesForTheme('retailMedia')} logo={{ src: '/edge-icon.svg', alt: 'Edge', width: 32, height: 32 }} /></div> },
  'separator': { title: 'Separator', group: 'Containment', render: () => <div className="w-64 space-y-3"><p className="text-sm">Run time &amp; budget</p><Separator /><p className="text-sm text-muted-foreground">Targeting</p></div> },

  /* Actions */
  'add-campaign-menu': { title: 'Add campaign menu', group: 'Actions', portal: true, render: () => <AddCampaignMenu onSelect={() => {}} onAddExisting={() => {}} /> },
  'lifecycle-actions': { title: 'Lifecycle actions', group: 'Actions', render: () => <LifecycleActions level="campaign" entityId="C-004" status="running" name="Summer Launch — Display" /> },

  /* Inputs & controls — domain pickers */
  'advertiser-select': { title: 'Advertiser select', group: 'Inputs & controls', render: () => <StatefulAdvertiser /> },
  'attribution-window-select': { title: 'Attribution window', group: 'Inputs & controls', render: () => <StatefulAttribution /> },
  'suggestion-list': { title: 'Suggestion list', group: 'Inputs & controls', render: () => <SuggestionList items={[{ value: 'coffee', meta: '22K searches' }, { value: 'espresso', meta: '9K searches' }, { value: 'coffee pads', meta: '6K searches' }, { value: 'cold brew', meta: '4K searches' }]} onAdd={() => {}} onAddAll={() => {}} /> },
  'selection-list': { title: 'Selection list', group: 'Inputs & controls', render: () => <StatefulSelectionList variant="list" /> },
  'selection-list--switch': { title: 'Selection list / Switch rows', group: 'Inputs & controls', render: () => <StatefulSelectionList variant="switch" /> },

  /* Product surfaces */
  'budget-select': { title: 'Budget select', group: 'Product surfaces', portal: true, render: () => <BudgetSelect total={40000} rows={[{ id: 'display', label: 'Display', color: 'hsl(var(--chart-1))', budget: 25000 }, { id: 'sp', label: 'Sponsored products', color: 'hsl(var(--chart-3))', budget: 15000 }]} onApply={() => {}} /> },
  'delivery-settings': { title: 'Delivery behaviour', group: 'Product surfaces', wide: true, render: () => <StatefulDelivery /> },
  'optimisation-card': { title: 'Recommendations card', group: 'Product surfaces', wide: true, render: () => <OptimisationCard items={[{ badge: 'Suggestion', tone: 'insight', title: 'Set budget to automatic', message: 'Plans using automatic budget see ~18% higher ROAS.', explain: budgetOptimisationExplain() }, { badge: 'Suggestion', tone: 'tip', title: 'Improve CTR with optimised targeting', message: 'Retargeting and in-market shoppers gain most.', explain: ctrTargetingExplain() }]} /> },
  'hierarchy-badge--icons': { title: 'Custom icons', group: 'Product surfaces', render: () => <div className="flex items-center gap-6 text-foreground"><span className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><OrganisationsIcon className="h-5 w-5" /> Organisations</span><span className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><BrandsIcon className="h-5 w-5" /> Brands</span><span className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><CreateIcon className="h-5 w-5" /> Create</span></div> },

  /* Communication */
  'faq-panel': { title: 'FAQ panel', group: 'Communication', wide: true, render: () => <FaqPanel surface="create-media-plan" heading="Questions about this step" /> },
  'notification-item': { title: 'Notification item (legacy card)', group: 'Communication', wide: true, render: () => <NotificationItem type="budget-alert" message="Your Display campaign has spent 82% of its budget with 6 days remaining." linkText="Review pacing" onLinkClick={() => {}} /> },

  /* Overlays / panels */
  'message-drawer': { title: 'Message drawer (inline)', group: 'Overlays', wide: true, render: () => <MessageDrawerInline /> },

  /* Data display */
  'forecast-metrics': { title: 'Forecast metrics', group: 'Data display', wide: true, render: () => <MetricRow metrics={forecastRow} hideEditButton /> },
  'chart-frame': { title: 'Chart frame', group: 'Data display', wide: true, render: () => <ChartFrame title="Impressions vs clicks" subtitle="Weekly, last 6 weeks"><div className="h-56"><AreaChartComponent data={chartData} config={chartConfig} /></div></ChartFrame> },
  'funnel-chart': { title: 'Funnel chart', group: 'Data display', wide: true, render: () => <div className="h-64"><FunnelChartComponent data={funnelData} config={funnelConfig} /></div> },
  'map-chart': { title: 'Map chart', group: 'Data display', render: () => <div className="h-72 w-72"><MapChart data={mapData} title="Plays by city" /></div> },

  /* Product surfaces — the composed booking block itself + the calendar grid */
  'booking-budget-runtime': { title: 'Booking budget & runtime', group: 'Product surfaces', wide: true, render: () => <StatefulBookingRuntime /> },
  'calendar-table': { title: 'Calendar table (availability grid)', group: 'Product surfaces', wide: true, render: () => <CalendarTable mediaProducts={calendarProducts} weeks={6} startWeek={37} displayType="fillRateBar" /> },
  'hierarchy-sidebar': {
    title: 'Hierarchy sidebar', group: 'Product surfaces',
    render: () => (
      <HierarchySidebar
        active="booking"
        mediaPlan={<SummaryCard title="Media plan" entity="media-plan" variant="details" collapsible items={[{ label: 'Name', value: 'Summer Launch Plan' }]} />}
        campaign={<SummaryCard title="Campaign" entity="campaign" variant="details" collapsible items={[{ label: 'Name', value: 'Summer Launch — Display' }]} />}
        booking={<SummaryCard title="Booking" entity="booking" variant="details" items={[{ label: 'Name', value: 'Homepage Takeover' }, { label: 'Budget', value: '€2,500' }]} />}
      />
    ),
  },

  /* Navigation chrome */
  'header-actions': { title: 'Header actions', group: 'Navigation', render: () => <HeaderActions hasUnreadNotifications /> },
  'breadcrumbs': { title: 'Breadcrumbs', group: 'Navigation', wide: true, render: () => <SmartBreadcrumbsSimple namespace="Media plans" /> },

  /* Communication / settings panels */
  'notification-settings': { title: 'Notification settings', group: 'Communication', wide: true, render: () => <NotificationSettings /> },
  'message-advertiser': { title: 'Message advertisers', group: 'Communication', wide: true, render: () => <MessageAdvertiser /> },
  'insights-notifications': { title: 'Insights notifications', group: 'Communication', wide: true, render: () => <InsightsNotifications /> },

  /* Overlays */
  'link-picker': { title: 'Link picker', group: 'Overlays', portal: true, render: () => <StatefulLinkPicker /> },

  /* Marketing (edge.os) */
  'marketing': {
    title: 'Marketing primitives (edge.os)', group: 'Data display', wide: true,
    render: () => (
      <MarketingSection tone="dark" className="rounded-xl p-8">
        <MarketingHeading tone="dark" align="left" label="edge.os" title="One platform, five retail brands" body="The same component library, co-branded per banner." className="mb-6" />
        <div className="mb-6 flex gap-8"><MarketingStat value="5" label="Retailer themes" /><MarketingStat value="108" label="Components" /><MarketingStat value="34" label="Page templates" /></div>
        <MarketingButton href="#" tone="primary">Explore edge.os</MarketingButton>
      </MarketingSection>
    ),
  },
};

export const previewGroups = [
  'Fundamentals',
  'Actions',
  'Inputs & controls',
  'Containment',
  'Communication',
  'Navigation',
  'Overlays',
  'Data display',
  'Product surfaces',
] as const;
