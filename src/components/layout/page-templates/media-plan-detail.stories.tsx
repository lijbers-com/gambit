import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { MetricRow } from '@/components/ui/metric-row';
import { Badge } from '@/components/ui/badge';
import { CardWithTabs } from '@/components/ui/card';
import { Table, type TableColumn } from '@/components/ui/table';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, XCircle, CornerDownRight, ListStart, MonitorSpeaker } from 'lucide-react';
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
    const toggle = (id: string) =>
      setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const metrics = [
      { key: 'budget', label: 'Budget', value: '$9.2K', subMetric: 'of $15.0K budget', badgeValue: '61%', badgeVariant: 'secondary' as const },
      { key: 'impressions', label: 'Impressions', value: '2.5M', subMetric: 'Media plan', badgeValue: '+8%', badgeVariant: 'success' as const },
      { key: 'roas', label: 'ROAS', value: '4.2x', subMetric: 'Media plan (weighted)', badgeValue: '+11%', badgeVariant: 'success' as const },
      { key: 'campaigns', label: 'Campaigns', value: '4', subMetric: '9 bookings', badgeValue: '', badgeVariant: 'secondary' as const },
    ];

    // Flatten campaigns + (when expanded) their bookings into the table's rows.
    const rows: Row[] = planCampaigns.flatMap((c) => [
      { _type: 'campaign', _id: c.id, name: c.name, engine: c.engine, state: c.state, budget: c.budget, dates: c.dates, objectiveKpi: c.objectiveKpi, lock: c.lock, bookingsCount: c.bookings.length },
      ...(expanded.includes(c.id)
        ? c.bookings.map((b, i): Row => ({ _type: 'booking', _id: `${c.id}-b${i}`, name: b.name, status: b.status, budget: b.budget, dailyCap: b.dailyCap, dates: b.flight, objectiveKpi: b.objectiveKpi, inherits: b.inherits }))
        : []),
    ]);

    const columns: TableColumn<Row>[] = [
      {
        key: 'name', header: 'Name', render: (r) =>
          r._type === 'campaign' ? (
            <span className="flex items-center gap-2 min-w-0">
              {expanded.includes(r._id) ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
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
                label: 'Campaigns & bookings',
                value: 'campaigns',
                content: (
                  <div className="mt-6">
                    <Table
                      columns={columns}
                      data={rows}
                      rowKey={(r) => r._id}
                      hideActions
                      onRowClick={(r) => { if (r._type === 'campaign') toggle(r._id); }}
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
            ]}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
