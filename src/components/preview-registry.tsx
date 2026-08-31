'use client';

import * as React from 'react';
import { Gavel, ListStart, MonitorSpeaker, Pencil, ShieldCheck, Eye, Brain, ShoppingCart, Heart } from 'lucide-react';
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
