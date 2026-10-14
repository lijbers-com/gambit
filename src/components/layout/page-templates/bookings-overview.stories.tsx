import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { InsightsTab } from './insights-tab';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { MetricRow } from '@/components/ui/metric-row';
import { propositionMetrics, fmtCount } from '@/lib/proposition-metrics';
import { useDb, deriveMessages, workflowFor, type DbData, type EngineId } from '@/lib/db';
import { bookingTotalsIn } from '@/lib/db/performance';
import { Button } from '@/components/ui/button';
import { AdvertiserSelect } from '@/components/ui/advertiser-select';
import { SessionAdvertiserSelect } from '@/components/ui/session-advertiser-select';
import { useSessionFilters, withinSessionRange, setSessionMetricKeys } from '@/lib/session-filters';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import * as React from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { AddButton } from '@/components/ui/add-button';
import { addBooking } from '@/lib/create-entities';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Bookings Overview',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Bookings Overview Page Template

Per-proposition overview of every booking in the system, mirroring the Campaign Overview template
but pivoted to bookings as the primary row. Each booking is a flight inside some campaign — the table
includes the campaign it belongs to so users can drill back up if needed.

The Bookings nav lives next to Campaigns in the side navigation and has the same sub-items
(Sponsored products / Display / Digital in-store / Offline instore / Display offsite).

Click a row → navigate to the existing booking detail page at
\`/campaigns/{proposition}/booking/{bookingId}\`.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Booking row shape. Engine is the proposition the booking belongs to —
// each per-proposition story filters down by this field. Every row is a
// booking in the prototype database; spend and impressions are what the
// performance model says it delivered (lib/db/performance.ts).
type BookingRow = {
  id: string;
  status: string;
  engine: EngineId;
  advertiser: string;
  campaign: string;
  campaignId: string;
  mediaPlan: string;
  name: string;
  placement: string;
  start: string;
  end: string;
  budget: number;
  spend: number;
  impressions: number;
  conversions: number;
  sales: number;
  /** Open notifications (recommendations, to-dos, health) on the booking. */
  notifications: number;
  /** Offline in-store only: a physical booking is filtered by what it
   *  promotes, where it hangs, and whether the print is ready in time. */
  brand?: string;
  retailProduct?: string;
  readiness?: 'Ready' | 'Creative missing' | 'Awaiting approval';
  /** ISO date the print creative has to be in by. */
  creativeDeadline?: string;
};

// Store statuses in the table's vocabulary — the same words the campaign
// overview uses.
const statusLabel: Record<string, string> = {
  running: 'Live',
  'in-option': 'In review',
  draft: 'Draft',
  paused: 'Paused',
  completed: 'Completed',
};

const statusVariant = (status: string) => {
  switch (status) {
    case 'Live':      return 'success';
    case 'Completed': return 'secondary';
    case 'In review': return 'outline';
    case 'Draft':     return 'outline';
    case 'Paused':    return 'warning';
    default:          return 'outline';
  }
};

const readinessOf: Record<string, BookingRow['readiness']> = {
  approved: 'Ready',
  submitted: 'Awaiting approval',
  missing: 'Creative missing',
};

const formatCurrency = (n: number) =>
  `€${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatImpressions = (n: number) => fmtCount(n);

const slug = (s: string) => s.toLowerCase().replace(/ /g, '-');

// Map an `engineType` string used everywhere on the campaign overview
// (e.g. 'display', 'sponsored products', 'digital in-store') to the
// canonical engine id.
const normalizeEngine = (engineType: string): EngineId | 'all' => {
  const e = engineType.toLowerCase().replace(/\s+/g, '-').replace(/in[-\s]?store/g, 'instore');
  if (e === 'sponsored-products') return 'sponsored-products';
  if (e === 'display') return 'display';
  if (e === 'digital-instore') return 'digital-instore';
  if (e === 'offline-instore') return 'offline-instore';
  if (e === 'offsite') return 'offsite';
  return 'all';
};

/** The day a booking's creative is due: the engine workflow's creative step
 *  (OMI: X-4) counted back from the flight start. */
function creativeDeadlineOf(db: DbData, engine: EngineId, startDate: string): string | undefined {
  const steps = workflowFor(db, engine)?.steps ?? [];
  const step = steps.find((st) => st.setup === 'link-creatives' && st.dueDaysBeforeStart)
    ?? steps.find((st) => /creative/i.test(st.name) && st.dueDaysBeforeStart);
  if (!step?.dueDaysBeforeStart) return undefined;
  const d = new Date(`${startDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - step.dueDaysBeforeStart);
  return d.toISOString().slice(0, 10);
}

/** Every booking of a proposition (or all), as table rows. Delivery is the
 *  performance model's, inside the session's date range when one is set —
 *  so the table's totals row and the metric cards above it agree. */
function bookingRows(db: DbData, engine: EngineId | 'all', from?: string, to?: string): BookingRow[] {
  const notes = new Map<string, number>();
  deriveMessages(db, engine === 'all' ? {} : { engine })
    .filter((m) => m.level === 'booking')
    .forEach((m) => notes.set(m.entityId, (notes.get(m.entityId) ?? 0) + 1));
  return db.bookings.flatMap((b): BookingRow[] => {
    const c = db.campaigns.find((x) => x.id === b.campaignId);
    if (!c || (engine !== 'all' && c.engine !== engine)) return [];
    const plan = db.mediaPlans.find((p) => p.id === c.mediaPlanId);
    const advertiser = db.advertisers.find((a) => a.id === plan?.advertiserId);
    const brands = (plan?.brandIds ?? []).map((id) => advertiser?.brands.find((br) => br.id === id)?.name).filter((n): n is string => !!n);
    const products = (c.retailProductIds ?? []).map((id) => db.retailProducts.find((r) => r.id === id)?.name).filter((n): n is string => !!n);
    const positions = b.positionIds.map((id) => db.positions.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
    const placements = [...new Set(positions.map((p) => db.placements.find((pl) => pl.id === p.placementId)?.name ?? p.name))];
    const t = bookingTotalsIn(db, b, from, to);
    return [{
      id: b.id,
      status: statusLabel[b.status] ?? b.status,
      engine: c.engine,
      advertiser: advertiser?.name ?? '',
      campaign: c.name,
      campaignId: c.id,
      mediaPlan: plan?.name ?? '',
      name: b.name,
      placement: placements.join(', ') || '—',
      start: b.startDate,
      end: b.endDate,
      budget: b.budget,
      spend: t.spend,
      impressions: t.impressions,
      conversions: t.conversions,
      sales: t.sales,
      notifications: notes.get(b.id) ?? 0,
      brand: brands[0],
      retailProduct: products[0],
      readiness: readinessOf[b.creativeStatus],
      creativeDeadline: creativeDeadlineOf(db, c.engine, b.startDate),
    }];
  });
}

const optionsOf = (values: (string | undefined)[], value: (v: string) => string = (v) => v) =>
  [...new Set(values.filter((v): v is string => !!v))].sort().map((v) => ({ label: v, value: value(v) }));

const createBookingsOverviewStory = (engineType: string, engineTitle: string) => ({
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [notified, setNotified] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const [activeTab, setActiveTab] = React.useState<string>('bookings');
    const [search, setSearch] = React.useState<string>('');
    // Offline in-store's own filters — what a physical booking promotes,
    // where it hangs, and whether the print is ready in time.
    const [brand, setBrand] = React.useState<string[]>([]);
    const [retailProduct, setRetailProduct] = React.useState<string[]>([]);
    const [placement, setPlacement] = React.useState<string[]>([]);
    const [creativeDeadline, setCreativeDeadline] = React.useState<string>('');
    const [readiness, setReadiness] = React.useState<string[]>([]);

    // Same session-wide range the campaign overview uses, so the window a user
    // set there is still applied here (see lib/session-filters).
    const sessionFilters = useSessionFilters();
    const db = useDb();

    const normalizedEngine = normalizeEngine(engineType);
    // The proposition's bookings in the session's window.
    const engineRows = bookingRows(db, normalizedEngine, sessionFilters.dateFrom, sessionFilters.dateTo)
      .filter((row) => withinSessionRange(sessionFilters, row.start, row.end));
    const filteredBookingData = engineRows.filter((row) => {
      const statusMatch = status.length === 0 || status.includes(slug(row.status));
      const advertiserMatch = advertiser.length === 0 || advertiser.includes(slug(row.advertiser));
      const notifiedMatch = notified.length === 0 || notified.includes(row.notifications > 0 ? 'open' : 'none');
      const searchMatch =
        search.length === 0 ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.campaign.toLowerCase().includes(search.toLowerCase());
      const brandMatch = brand.length === 0 || (!!row.brand && brand.includes(row.brand));
      const productMatch = retailProduct.length === 0 || (!!row.retailProduct && retailProduct.includes(row.retailProduct));
      const placementMatch = placement.length === 0 || placement.some((p) => row.placement.split(', ').includes(p));
      const readinessMatch = readiness.length === 0 || (!!row.readiness && readiness.includes(row.readiness));
      // A deadline filter keeps what has to be in by that day.
      const deadlineMatch = creativeDeadline.length === 0 || (!!row.creativeDeadline && row.creativeDeadline <= creativeDeadline);
      return statusMatch && advertiserMatch && notifiedMatch && searchMatch
        && brandMatch && productMatch && placementMatch && readinessMatch && deadlineMatch;
    });

    // The cards follow the table only while the table is in front of the
    // user: on any other tab they fall back to the proposition's totals, and
    // pick the filtered numbers back up when the bookings tab returns.
    const tableFiltersActive =
      status.length > 0 || advertiser.length > 0 || notified.length > 0 || search.length > 0 ||
      brand.length > 0 || retailProduct.length > 0 || placement.length > 0 ||
      readiness.length > 0 || creativeDeadline.length > 0;
    const followTable = activeTab === 'bookings' && tableFiltersActive;
    const metricRowId = `bookings:${engineType}`;
    const bookingHref = (row: BookingRow) => `/campaigns/${row.engine}/booking/${row.id}`;

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            // Same as the campaign overview: name the proposition in the title.
            title: engineType === 'all' ? 'Bookings' : `${engineTitle} bookings`,
            titleIcon: <HierarchyBadge level="booking" />,
            subtitle: engineType === 'all' ? 'All bookings' : `All ${engineType} bookings`,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
            headerRight: (
              <div className="flex items-center gap-2">
                <SessionAdvertiserSelect />
              </div>
            ),
          }}
        >
          <div className="space-y-section">
            <MetricRow
              // Same rule as the campaign overview: the cards follow the rows.
              metrics={propositionMetrics(db, engineType, {
                ...(followTable ? { bookingIds: filteredBookingData.map((row) => row.id) } : {}),
                from: sessionFilters.dateFrom,
                to: sessionFilters.dateTo,
              })}
              filterNote={followTable ? `Filtered · ${filteredBookingData.length} of ${engineRows.length} bookings` : undefined}
              selectedKeys={sessionFilters.metricKeys?.[metricRowId]}
              onSelectionChange={(keys) => setSessionMetricKeys(metricRowId, keys)}
              maxVisible={5}
              defaultVariant="default"
              removable={false}
              bleedEdges
              showCharts
            />
            <CardWithTabs
              tabs={[
                {
                  label: 'Bookings',
                  value: 'bookings',
                  content: (
                    <div className="space-y-6 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: 'Status',
                            options: optionsOf(engineRows.map((r) => r.status), slug),
                            selectedValues: status,
                            onChange: setStatus,
                          },
                          {
                            name: 'Advertiser',
                            options: optionsOf(engineRows.map((r) => r.advertiser), slug),
                            selectedValues: advertiser,
                            onChange: setAdvertiser,
                          },
                          {
                            name: 'Notifications',
                            options: [
                              { label: 'Open notifications', value: 'open' },
                              { label: 'None', value: 'none' },
                            ],
                            selectedValues: notified,
                            onChange: setNotified,
                          },
                          // Offline in-store is the one proposition where a
                          // booking is a physical thing: it promotes a product
                          // for a brand, hangs in a store, and needs its print
                          // in by a date. Those are its filters.
                          ...(normalizedEngine === 'offline-instore'
                            ? [
                                {
                                  name: 'Brand',
                                  options: optionsOf(engineRows.map((r) => r.brand)),
                                  selectedValues: brand,
                                  onChange: setBrand,
                                },
                                {
                                  name: 'Retail product',
                                  options: optionsOf(engineRows.map((r) => r.retailProduct)),
                                  selectedValues: retailProduct,
                                  onChange: setRetailProduct,
                                },
                                {
                                  name: 'Placement',
                                  options: optionsOf(engineRows.flatMap((r) => r.placement.split(', ')).filter((p) => p !== '—')),
                                  selectedValues: placement,
                                  onChange: setPlacement,
                                },
                                {
                                  name: 'Creative deadline',
                                  options: [],
                                  selectedValues: [],
                                  onChange: () => {},
                                  customInput: {
                                    label: 'Print needed by',
                                    value: creativeDeadline,
                                    onChange: setCreativeDeadline,
                                    type: 'date' as const,
                                  },
                                },
                                {
                                  name: 'Readiness',
                                  options: [
                                    { label: 'Ready', value: 'Ready' },
                                    { label: 'Creative missing', value: 'Creative missing' },
                                    { label: 'Awaiting approval', value: 'Awaiting approval' },
                                  ],
                                  selectedValues: readiness,
                                  onChange: setReadiness,
                                },
                              ]
                            : []),
                        ]}
                        searchValue={search}
                        onSearchChange={(v: string) => setSearch(v)}
                        searchPlaceholder={normalizedEngine === 'offline-instore' ? 'Search for ID, Name' : `Search ${engineType} bookings...`}
                      />
                      <Table
                        columns={[
                          { key: 'name', header: 'Name' },
                          { key: 'id', header: 'ID' },
                          { key: 'status', header: 'Status', render: (row: BookingRow) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                          { key: 'placement', header: 'Placement' },
                          { key: 'notifications', header: 'Notifications', render: (row: BookingRow) => row.notifications > 0 ? <Badge variant="warning">{row.notifications} open</Badge> : <Badge variant="outline">None</Badge> },
                          { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                          { key: 'advertiser', header: 'Advertiser' },
                          { key: 'campaign', header: 'Campaign' },
                          { key: 'spend', summary: 'sum', header: 'Spend', render: (row: BookingRow) => formatCurrency(row.spend) },
                          { key: 'impressions', summary: 'sum', header: 'Impressions', render: (row: BookingRow) => formatImpressions(row.impressions) },
                        ]}
                        data={filteredBookingData}
                        rowKey={(row: BookingRow) => row.id}
                        // A booking opens its detail page in its proposition's section.
                        onRowClick={(row: BookingRow) => { if (typeof window !== 'undefined') window.location.href = bookingHref(row); }}
                      />
                    </div>
                  ),
                },
                {
                  label: 'Insights',
                  value: 'insights',
                  content: <InsightsTab engineType={engineType} scope="overview" />,
                },
              ]}
              // A booking always lives under a campaign; from the overview the
              // draft lands on the engine's first open campaign and opens its
              // form, where the campaign can still be changed.
              action={
                activeTab === 'bookings' ? (
                  <AddButton
                    onClick={() =>
                      addBooking(normalizedEngine === 'all' ? 'display' : normalizedEngine)
                    }
                  >
                    Add booking
                  </AddButton>
                ) : null
              }
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
});

export const BookingsOverview: Story = createBookingsOverviewStory('all', 'All engines');

export const SponsoredProducts: Story = createBookingsOverviewStory('sponsored products', 'Sponsored products');

export const Display: Story = createBookingsOverviewStory('display', 'Display');

export const DigitalInStore: Story = createBookingsOverviewStory('digital in-store', 'Digital in-store');

export const OfflineInstore: Story = createBookingsOverviewStory('offline instore', 'Offline in-store');

export const Offsite: Story = createBookingsOverviewStory('offsite', 'Offsite');
