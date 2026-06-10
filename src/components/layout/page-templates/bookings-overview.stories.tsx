import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { InsightsTab } from './insights-tab';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { MetricRow } from '@/components/ui/metric-row';
import { getPropositionMetrics } from '@/lib/proposition-metrics';
import { Button } from '@/components/ui/button';
import { AdvertiserSelect } from '@/components/ui/advertiser-select';
import { PropositionIcon } from '@/components/ui/proposition-icon';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import * as React from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';

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
// each per-proposition story filters down by this field.
type BookingRow = {
  id: string;
  status: 'In-option' | 'Running' | 'Paused' | 'Stopped' | 'Ready';
  engine: 'sponsored-products' | 'display' | 'digital-instore' | 'offline-instore' | 'offsite';
  advertiser: string;
  campaign: string;
  campaignId: string;
  name: string;
  placement: string;
  start: string;
  end: string;
  spend: number;
  impressions: number;
  aiRecommendation: 'Optimize Budget' | 'Increase Spend' | 'Pause' | 'Extend' | 'No action';
};

// Shared dataset — covers every proposition with a realistic spread of
// statuses, advertisers, and ai recommendations. Per-proposition stories
// filter this by `engine`.
const bookingData: BookingRow[] = [
  // Sponsored products
  { id: 'LI-101', status: 'Running',   engine: 'sponsored-products', advertiser: 'Acme Media',  campaign: 'Holiday Top Picks',     campaignId: 'C-001', name: 'Homepage hero',     placement: 'Search results top',  start: '2024-06-01', end: '2024-06-30', spend: 4200,  impressions: 240000,  aiRecommendation: 'Optimize Budget' },
  { id: 'LI-102', status: 'Ready',     engine: 'sponsored-products', advertiser: 'BrandX',      campaign: 'Summer Featured',       campaignId: 'C-002', name: 'Category leaderboard', placement: 'Category page top', start: '2024-07-01', end: '2024-07-31', spend: 0,     impressions: 0,       aiRecommendation: 'Increase Spend' },
  { id: 'LI-103', status: 'In-option', engine: 'sponsored-products', advertiser: 'MediaWorks',  campaign: 'Back to School Promos', campaignId: 'C-003', name: 'Aisle endcaps',     placement: 'Product detail',      start: '2024-08-10', end: '2024-09-10', spend: 0,     impressions: 0,       aiRecommendation: 'No action' },
  { id: 'LI-104', status: 'Paused',    engine: 'sponsored-products', advertiser: 'AdPartners',  campaign: 'BF Deal Listings',      campaignId: 'C-004', name: 'BF deals row',      placement: 'Homepage rail',       start: '2024-11-01', end: '2024-11-30', spend: 6800,  impressions: 380000,  aiRecommendation: 'Extend' },

  // Display
  { id: 'LI-201', status: 'Running',   engine: 'display',            advertiser: 'Acme Media',  campaign: 'Holiday Banners',       campaignId: 'C-001', name: 'Homepage takeover', placement: 'Homepage top',        start: '2024-06-01', end: '2024-06-30', spend: 5400,  impressions: 720000,  aiRecommendation: 'Optimize Budget' },
  { id: 'LI-202', status: 'Running',   engine: 'display',            advertiser: 'BrandX',      campaign: 'Summer Banners',        campaignId: 'C-002', name: 'Category banner',   placement: 'Category page',       start: '2024-07-01', end: '2024-07-31', spend: 2100,  impressions: 290000,  aiRecommendation: 'Increase Spend' },
  { id: 'LI-203', status: 'Paused',    engine: 'display',            advertiser: 'AdPartners',  campaign: 'BF Homepage Takeover',  campaignId: 'C-004', name: 'BF homepage',       placement: 'Homepage hero',       start: '2024-11-01', end: '2024-11-30', spend: 7600,  impressions: 980000,  aiRecommendation: 'Extend' },
  { id: 'LI-204', status: 'Ready',     engine: 'display',            advertiser: 'BrandX',      campaign: 'NY Retargeting Banners',campaignId: 'C-005', name: 'NY retargeting',    placement: 'Run of site',         start: '2025-01-01', end: '2025-01-31', spend: 700,   impressions: 110000,  aiRecommendation: 'No action' },

  // Digital in-store
  { id: 'LI-301', status: 'Running',   engine: 'digital-instore',    advertiser: 'Acme Media',  campaign: 'Holiday Screens',       campaignId: 'C-001', name: 'XL store loop',     placement: 'Aisle screens',       start: '2024-06-01', end: '2024-06-30', spend: 1200,  impressions: 84000,   aiRecommendation: 'No action' },
  { id: 'LI-302', status: 'Ready',     engine: 'digital-instore',    advertiser: 'BrandX',      campaign: 'Summer Kiosks',         campaignId: 'C-002', name: 'Entry kiosks',      placement: 'Front of store',      start: '2024-07-01', end: '2024-07-31', spend: 625,   impressions: 41000,   aiRecommendation: 'Increase Spend' },
  { id: 'LI-303', status: 'Paused',    engine: 'digital-instore',    advertiser: 'AdPartners',  campaign: 'BF Store Screens',      campaignId: 'C-004', name: 'BF aisle loop',     placement: 'Aisle endcaps',       start: '2024-11-01', end: '2024-11-30', spend: 4800,  impressions: 280000,  aiRecommendation: 'Pause' },

  // Offline in-store
  { id: 'LI-401', status: 'Running',   engine: 'offline-instore',    advertiser: 'Acme Media',  campaign: 'Holiday POS',           campaignId: 'C-001', name: 'Shelf talkers',     placement: 'Shelf strips',        start: '2024-06-01', end: '2024-06-30', spend: 380,   impressions: 12000,   aiRecommendation: 'Optimize Budget' },
  { id: 'LI-402', status: 'In-option', engine: 'offline-instore',    advertiser: 'BrandX',      campaign: 'Summer POS',            campaignId: 'C-002', name: 'Floor decals',      placement: 'Aisle floor',         start: '2024-07-01', end: '2024-07-31', spend: 0,     impressions: 0,       aiRecommendation: 'No action' },
  { id: 'LI-403', status: 'Paused',    engine: 'offline-instore',    advertiser: 'AdPartners',  campaign: 'BF Shelf Talkers',      campaignId: 'C-004', name: 'BF shelf strips',   placement: 'Shelf strips',        start: '2024-11-01', end: '2024-11-30', spend: 3850, impressions: 96000,    aiRecommendation: 'Extend' },

  // Offsite
  { id: 'LI-501', status: 'Running',   engine: 'offsite',            advertiser: 'Acme Media',  campaign: 'Holiday Open Web',      campaignId: 'C-001', name: 'Open web banners',  placement: 'Programmatic',        start: '2024-06-01', end: '2024-06-30', spend: 150,   impressions: 380000,  aiRecommendation: 'Increase Spend' },
  { id: 'LI-502', status: 'Stopped',   engine: 'offsite',            advertiser: 'AdPartners',  campaign: 'BF Open Web',           campaignId: 'C-004', name: 'BF retargeting',    placement: 'Programmatic',        start: '2024-11-01', end: '2024-11-30', spend: 1240,  impressions: 1100000, aiRecommendation: 'Pause' },
];

const statusVariant = (status: BookingRow['status']) => {
  switch (status) {
    case 'Running':   return 'success';
    case 'Ready':     return 'info';
    case 'In-option': return 'outline';
    case 'Paused':    return 'warning';
    case 'Stopped':   return 'destructive';
    default:          return 'outline';
  }
};

const aiVariant = (rec: BookingRow['aiRecommendation']) => {
  switch (rec) {
    case 'Optimize Budget': return 'secondary';
    case 'Increase Spend':  return 'success';
    case 'Pause':           return 'warning';
    case 'Extend':          return 'info';
    case 'No action':       return 'outline';
    default:                return 'outline';
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

const formatCurrency = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatImpressions = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString('en-US');
};

// Map an `engineType` string used everywhere on the campaign overview
// (e.g. 'display', 'sponsored products', 'digital in-store') to the
// canonical BookingRow.engine value.
const normalizeEngine = (engineType: string): BookingRow['engine'] | 'all' => {
  const e = engineType.toLowerCase().replace(/\s+/g, '-').replace(/in[-\s]?store/g, 'instore');
  if (e === 'all') return 'all';
  if (e === 'sponsored-products') return 'sponsored-products';
  if (e === 'display') return 'display';
  if (e === 'digital-instore') return 'digital-instore';
  if (e === 'offline-instore') return 'offline-instore';
  if (e === 'offsite') return 'offsite';
  return 'all';
};

const createBookingsOverviewStory = (engineType: string, engineTitle: string) => ({
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [aiRec, setAiRec] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const [activeTab, setActiveTab] = React.useState<string>('bookings');
    const [search, setSearch] = React.useState<string>('');

    const normalizedEngine = normalizeEngine(engineType);
    const filteredBookingData = bookingData.filter((row) => {
      const engineMatch = normalizedEngine === 'all' || row.engine === normalizedEngine;
      const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
      const advertiserMatch = advertiser.length === 0 || advertiser.includes(row.advertiser.toLowerCase().replace(/ /g, '-'));
      const aiMatch = aiRec.length === 0 || aiRec.includes(row.aiRecommendation.toLowerCase().replace(/ /g, '-'));
      const searchMatch =
        search.length === 0 ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.campaign.toLowerCase().includes(search.toLowerCase());
      return engineMatch && statusMatch && advertiserMatch && aiMatch && searchMatch;
    });

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Bookings',
            titleIcon: <PropositionIcon engineType={engineType} />,
            subtitle: `All ${engineType} bookings`,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
            headerRight: (
              <AdvertiserSelect
                value={headerAdvertiser}
                onChange={setHeaderAdvertiser}
              />
            ),
          }}
        >
          <div className="space-y-6">
            <MetricRow
              metrics={getPropositionMetrics(engineType, 'overview')}
              maxVisible={5}
              defaultVariant="default"
              removable={false}
              bleedEdges
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
                            options: [
                              { label: 'Running',   value: 'running' },
                              { label: 'Ready',     value: 'ready' },
                              { label: 'In-option', value: 'in-option' },
                              { label: 'Paused',    value: 'paused' },
                              { label: 'Stopped',   value: 'stopped' },
                            ],
                            selectedValues: status,
                            onChange: setStatus,
                          },
                          {
                            name: 'Advertiser',
                            options: [
                              { label: 'Acme Media', value: 'acme-media' },
                              { label: 'BrandX',     value: 'brandx' },
                              { label: 'MediaWorks', value: 'mediaworks' },
                              { label: 'AdPartners', value: 'adpartners' },
                            ],
                            selectedValues: advertiser,
                            onChange: setAdvertiser,
                          },
                          {
                            name: 'AI Recommendation',
                            options: [
                              { label: 'Optimize Budget', value: 'optimize-budget' },
                              { label: 'Increase Spend',  value: 'increase-spend' },
                              { label: 'Pause',           value: 'pause' },
                              { label: 'Extend',          value: 'extend' },
                              { label: 'No action',       value: 'no-action' },
                            ],
                            selectedValues: aiRec,
                            onChange: setAiRec,
                          },
                        ]}
                        searchValue={search}
                        onSearchChange={(v: string) => setSearch(v)}
                        searchPlaceholder={`Search ${engineType} bookings...`}
                      />
                      <Table
                        columns={[
                          { key: 'id', header: 'Booking ID' },
                          { key: 'status', header: 'Status', render: (row: BookingRow) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                          { key: 'advertiser', header: 'Advertiser' },
                          { key: 'campaign', header: 'Campaign' },
                          { key: 'name', header: 'Name' },
                          { key: 'placement', header: 'Placement' },
                          { key: 'spend', header: 'Spend', render: (row: BookingRow) => formatCurrency(row.spend) },
                          { key: 'impressions', header: 'Impressions', render: (row: BookingRow) => formatImpressions(row.impressions) },
                          { key: 'start', header: 'Start date', render: (row: BookingRow) => formatDate(row.start) },
                          { key: 'end', header: 'End date', render: (row: BookingRow) => formatDate(row.end) },
                          { key: 'aiRecommendation', header: 'AI Recommendation', render: (row: BookingRow) => <Badge variant={aiVariant(row.aiRecommendation)}>{row.aiRecommendation}</Badge> },
                        ]}
                        data={filteredBookingData}
                        rowKey={(row: BookingRow) => row.id}
                        onRowClick={(row: BookingRow) => console.log(`Navigating to booking: ${row.name} (${row.id})`)}
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
              action={activeTab === 'bookings' ? <Button>Add booking</Button> : null}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
});

export const BookingsOverview: Story = createBookingsOverviewStory('all', 'All Engines');

export const SponsoredProducts: Story = createBookingsOverviewStory('sponsored products', 'Sponsored Products');

export const Display: Story = createBookingsOverviewStory('display', 'Display');

export const DigitalInStore: Story = createBookingsOverviewStory('digital in-store', 'Digital In-Store');

export const OfflineInstore: Story = createBookingsOverviewStory('offline instore', 'Offline Instore');

export const Offsite: Story = createBookingsOverviewStory('offsite', 'Offsite');
