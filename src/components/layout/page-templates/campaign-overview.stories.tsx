import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent, CardWithTabs } from '@/components/ui/card';
import { FaqPanel } from '@/components/ui/faq-panel';
import { SessionDateRange } from '@/components/ui/session-date-range';
import { useSessionFilters, withinSessionRange, setSessionMetricKeys } from '@/lib/session-filters';
import { InsightsTab } from './insights-tab';
import { InboxPanel, useUnreadCount } from '@/components/ui/inbox-panel';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { MetricRow } from '@/components/ui/metric-row';
import { getPropositionMetrics, scaleMetricsToSelection } from '@/lib/proposition-metrics';
import { Button } from '@/components/ui/button';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { DateRangePicker, DatePicker } from '@/components/ui/date-picker';
import { AdvertiserSelect } from '@/components/ui/advertiser-select';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { DateRange } from 'react-day-picker';
import { defaultRoutes } from '../default-routes';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { productImages } from '@/lib/product-images';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { addDays } from 'date-fns';
import { useDb, createBooking, type EngineId } from '@/lib/db';
import * as React from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { AddButton } from '@/components/ui/add-button';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Campaign Overview',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Campaign Overview Page Template

The Campaign Overview page template provides a comprehensive table view of all campaigns with advanced filtering capabilities. It serves as the main campaign management interface for media partners.

## Features

- **Data Table**: Displays campaign information in a sortable, filterable table format
- **Advanced Filtering**: Multi-select filters for Status and Advertiser
- **Search Functionality**: Real-time search across campaign names
- **Status Badges**: Visual indicators for campaign status (Running, Ready, In option, Paused)
- **Quick Actions**: Edit, Export, Import, and Settings buttons in page header
- **Responsive Design**: Table adapts to different screen sizes

## Data Structure

Each campaign record includes:
- **ID**: Unique campaign identifier
- **Status**: Current campaign state with color-coded badges
- **Advertiser**: Campaign advertiser/client name
- **Name**: Campaign name
- **Bookings**: Number of associated bookings (with badge)
- **Creatives**: Number of associated creatives (with badge)
- **Start/End Date**: Campaign runtime with proper date formatting

## Filter Options

### Status Filter
- **Running**: Currently active campaigns
- **Ready**: Approved campaigns ready to launch
- **In option**: Campaigns pending final approval
- **Paused**: Temporarily suspended campaigns

### Advertiser Filter
- Dynamic list of all advertisers in the system
- Multi-select capability for filtering multiple advertisers

## Usage

This template is ideal for:
- Campaign management dashboards
- Media partner campaign overviews
- Campaign performance monitoring
- Bulk campaign operations

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- FilterBar (filtering and search interface)
- Table (data display with sorting and actions)
- Badge (status and count indicators)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;



// Campaign rows come from the prototype database; these helpers translate
// store statuses/engines into the table's display vocabulary.
const statusLabel: Record<string, string> = {
  'running': 'Running',
  'in-option': 'In option',
  'draft': 'Draft',
  'paused': 'Paused',
  'completed': 'Completed',
};

const statusVariant = (status: string) => {
  switch (status) {
    case 'Running': return 'default';
    case 'Completed': return 'secondary';
    case 'In option': return 'outline';
    case 'Draft': return 'outline';
    case 'Paused': return 'destructive';
    default: return 'outline';
  }
};

/** Page engineType param ('digital in-store', 'sponsored products', …) → EngineId. */
const engineTypeToId = (engineType: string): EngineId | 'all' => {
  const norm = engineType.toLowerCase().replace(/in[-\s]?store/g, 'instore').replace(/[\s_]+/g, '-');
  const map: Record<string, EngineId> = {
    'display': 'display',
    'sponsored-products': 'sponsored-products',
    'digital-instore': 'digital-instore',
    'offline-instore': 'offline-instore',
    'offsite': 'offsite',
  };
  return map[norm] ?? 'all';
};

// Per-proposition metric cards now live in src/lib/proposition-metrics.ts
// so the same set is used on the campaign overview, the campaign detail
// page, and the booking detail page — values scale down with scope, but
// the labels stay identical. See getPropositionMetrics().

// Insights tab content lives in ./insights-tab.tsx so the same chart
// row can be reused on the campaign overview AND every campaign detail
// page (where it renders with scope='campaign' for narrower values).

// `showMediaPlanTab` distinguishes the two contexts:
//  - false → the campaign OVERVIEW reached from the Campaigns menu (all
//    campaigns of an engine). No "Media plan details" tab.
//  - true  → the campaign view reached FROM a media plan (linked to it), which
//    keeps the "Media plan details" tab.
const createCampaignOverviewStory = (engineType: string, engineTitle: string, showMediaPlanTab = false) => ({
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [retailProduct, setRetailProduct] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const [activeTab, setActiveTab] = React.useState<string>('campaigns');
    // Media plan details form state
    const [mediaPlanName, setMediaPlanName] = React.useState<string>('Coca-Cola Summer 2024');
    const [mediaPlanPO, setMediaPlanPO] = React.useState<string>('PO-2024-00142');
    const [mediaPlanAdvertiser, setMediaPlanAdvertiser] = React.useState<string>('coca-cola');
    const [mediaPlanBrand, setMediaPlanBrand] = React.useState<string>('coca-cola-brand');
    const [mediaPlanGoal, setMediaPlanGoal] = React.useState<string>('awareness');
    const [mediaPlanBudget, setMediaPlanBudget] = React.useState<string>('300000');
    const [mediaPlanStartDate, setMediaPlanStartDate] = React.useState<Date | undefined>(new Date('2024-06-01'));
    const [mediaPlanEndDate, setMediaPlanEndDate] = React.useState<Date | undefined>(new Date('2024-11-30'));
    // Which campaign rows are expanded to reveal their bookings.
    const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
    const toggleRow = (id: string) =>
      setExpandedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    // ── Live campaigns + bookings from the prototype database ──────────
    const db = useDb();
    const engineId = engineTypeToId(engineType);
    // The header's date range is session state, so it still applies when the
    // user arrives here from another overview (see lib/session-filters).
    const sessionFilters = useSessionFilters();
    const engineCampaigns = db.campaigns.filter(
      (c) =>
        (engineId === 'all' || c.engine === engineId) &&
        withinSessionRange(sessionFilters, c.startDate, c.endDate),
    );

    // What the filters left in view, against the proposition as a whole — the
    // ratio is how far the illustrative volume cards are scaled down.
    const visibleSpend = engineCampaigns.reduce((sum, c) => sum + c.spend, 0);
    const visibleBudget = engineCampaigns.reduce((sum, c) => sum + c.budget, 0);
    const propositionSpend = db.campaigns
      .filter((c) => engineId === 'all' || c.engine === engineId)
      .reduce((sum, c) => sum + c.spend, 0);
    const metricRowId = `campaigns:${engineType}`;
    const engineUnread = useUnreadCount('engine', engineId);

    const campaignRowsFromDb = engineCampaigns.map((c, i) => {
      const plan = db.mediaPlans.find((p) => p.id === c.mediaPlanId);
      const advertiserName = db.advertisers.find((a) => a.id === plan?.advertiserId)?.name ?? '';
      const bookings = db.bookings.filter((b) => b.campaignId === c.id);
      const positions = new Set(bookings.flatMap((b) => b.positionIds)).size;
      return {
        id: c.id,
        status: statusLabel[c.status] ?? c.status,
        advertiser: advertiserName,
        name: c.name,
        bookings: bookings.length,
        creatives: bookings.length, // creatives ≈ one per booking until modelled
        placements: positions,
        start: c.startDate,
        end: c.endDate,
        products: { images: productImages.slice(0, (i % 3) + 1), total: (i % 3) + 1 },
        spendToDate: c.spend,
        spendingLimit: c.budget,
        _bookings: bookings,
      };
    });

    const filteredCampaignData = campaignRowsFromDb.filter(row => {
      const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
      const advertiserMatch = advertiser.length === 0 || advertiser.includes(row.advertiser.toLowerCase().replace(/ /g, '-'));
      return statusMatch && advertiserMatch;
    });

    // Real bookings for a campaign, mapped into the table's row shape.
    const bookingsForCampaign = (c: typeof campaignRowsFromDb[number]) =>
      c._bookings.map((b) => ({
        _type: 'booking' as const,
        _id: b.id,
        id: b.id,
        status: statusLabel[b.status] ?? b.status,
        advertiser: '',
        name: b.name,
        engine: engineType,
        parentId: c.id,
        products: { images: [] as string[], total: 0 },
        creatives: 0,
        placements: b.positionIds.length,
        spendToDate: b.spend,
        spendingLimit: b.budget,
        start: b.startDate,
        end: b.endDate,
      }));
    // Flatten campaigns + (when expanded) their bookings into one row list.
    type CampaignRow = typeof campaignRowsFromDb[number] & { _type: 'campaign'; _id: string; engine?: string; parentId?: string };
    type BookingRow = ReturnType<typeof bookingsForCampaign>[number];
    // The trailing row under an expanded campaign, so a booking can be added
    // without leaving the table.
    type AddRow = Omit<BookingRow, '_type'> & { _type: 'add' };
    type AnyRow = CampaignRow | BookingRow | AddRow;

    /** Create a draft booking on this campaign and open it. */
    const addBookingTo = (campaignId: string) => {
      const c = db.campaigns.find((x) => x.id === campaignId);
      if (!c) return;
      const booking = createBooking({
        campaignId: c.id,
        name: `${c.name} — New booking`,
        status: 'draft',
        budget: 0,
        spend: 0,
        startDate: c.startDate,
        endDate: c.endDate,
        positionIds: [],
        creativeStatus: 'missing',
      });
      if (typeof window === 'undefined') return;
      // Sponsored-products bookings live inside the campaign page.
      window.location.href = c.engine === 'sponsored-products'
        ? `/campaigns/${engineType}/${c.id}`
        : `/campaigns/${engineType}/booking/${booking.id}`;
    };

    const tableRows: AnyRow[] = filteredCampaignData.flatMap((c) => {
      const campaignRow: CampaignRow = { ...c, _type: 'campaign', _id: c.id };
      return expandedRows.includes(c.id)
        ? [
            campaignRow,
            ...bookingsForCampaign(c),
            {
              _type: 'add' as const, _id: `add-${c.id}`, id: '', status: '', advertiser: '',
              name: '', engine: engineType, parentId: c.id,
              products: { images: [] as string[], total: 0 }, creatives: 0, placements: 0,
              spendToDate: 0, spendingLimit: 0, start: '', end: '',
            },
          ]
        : [campaignRow];
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
          // The proposition belongs in the title: this page is one
          // proposition's campaigns, and "Campaigns" alone reads the same on
          // all five. The engine-wide page keeps the plain title.
          title: engineType === 'all' ? 'Campaigns' : `${engineTitle} campaigns`,
          titleIcon: <HierarchyBadge level="campaign" />,
          subtitle: engineType === 'all' ? 'All campaigns' : `All ${engineType} campaigns`,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <div className="flex items-center gap-2">
              <AdvertiserSelect
                value={headerAdvertiser}
                onChange={setHeaderAdvertiser}
              />
              <SessionDateRange />
            </div>
          ),
        }}
      >
        <div className="space-y-6">
        <MetricRow
          // The cards describe the rows below them, so they follow the same
          // filters: a date range that hides half the campaigns has to move
          // the numbers too, or the row contradicts the table under it.
          metrics={scaleMetricsToSelection(getPropositionMetrics(engineType, 'overview'), {
            spend: visibleSpend,
            budget: visibleBudget,
            share: propositionSpend > 0 ? visibleSpend / propositionSpend : 1,
          })}
          selectedKeys={sessionFilters.metricKeys?.[metricRowId]}
          onSelectionChange={(keys) => setSessionMetricKeys(metricRowId, keys)}
          maxVisible={5}
          defaultVariant="default"
          removable={false}
          bleedEdges
          showCharts
        />
        <CardWithTabs
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Media plan name</label>
                      <Input defaultValue={mediaPlanName} placeholder="Enter media plan name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input defaultValue={mediaPlanPO} placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Coca-Cola', value: 'coca-cola' },
                          { label: 'Unilever', value: 'unilever' },
                          { label: 'Acme Media', value: 'acme-media' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={mediaPlanAdvertiser}
                        onChange={setMediaPlanAdvertiser}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Coca-Cola', value: 'coca-cola-brand' },
                          { label: 'Coca-Cola Zero', value: 'coca-cola-zero' },
                          { label: 'Sprite', value: 'sprite' },
                          { label: 'Fanta', value: 'fanta' },
                        ]}
                        value={mediaPlanBrand}
                        onChange={setMediaPlanBrand}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={mediaPlanGoal}
                        onChange={setMediaPlanGoal}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Total budget</label>
                      <Input defaultValue={mediaPlanBudget} placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Flight dates</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={mediaPlanStartDate} onDateChange={setMediaPlanStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={mediaPlanEndDate} onDateChange={setMediaPlanEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={[
            ...(showMediaPlanTab ? [{
              label: 'Media plan details',
              value: 'details',
              content: null,
            }] : []),
            {
              label: 'Campaigns',
              value: 'campaigns',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Running', value: 'running' },
                          { label: 'Ready', value: 'ready' },
                          { label: 'In option', value: 'in-option' },
                          { label: 'Paused', value: 'paused' },
                        ],
                        selectedValues: status,
                        onChange: setStatus,
                      },
                      {
                        name: 'Advertiser',
                        options: [
                          { label: 'Acme Media', value: 'acme-media' },
                          { label: 'BrandX', value: 'brandx' },
                          { label: 'MediaWorks', value: 'mediaworks' },
                          { label: 'AdPartners', value: 'adpartners' },
                        ],
                        selectedValues: advertiser,
                        onChange: setAdvertiser,
                      },
                      {
                        name: 'Retail Product',
                        options: [
                          { label: 'Coca-Cola - coca-cola zero fl - 1 liter', value: '606983' },
                          { label: 'Pepsi - pepsi max - 1.5 liter', value: '607124' },
                          { label: 'Red Bull - energy drink original - 250ml', value: '608456' },
                          { label: 'Heineken - premium lager beer - 6x330ml', value: '609782' },
                          { label: 'Samsung - galaxy s24 ultra - 256GB', value: '610394' },
                          { label: 'iPhone - 15 pro max - 512GB', value: '611205' },
                          { label: 'Nike - air max 270 - size 42', value: '612816' },
                          { label: 'Adidas - ultraboost 22 - size 43', value: '613427' },
                          { label: 'Nutella - hazelnut spread - 750g', value: '614038' },
                          { label: "Ben & Jerry's - cookie dough - 465ml", value: '614649' },
                        ],
                        selectedValues: retailProduct,
                        onChange: setRetailProduct,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder={`Search ${engineType} campaigns...`}
                  />
                  <Table
                    columns={[
                      // Wide enough for a booking name: child rows put their
                      // name in this column (Table.expandable.childLabel).
                      { key: 'id', header: 'ID', width: 200, render: row => (row._type === 'add' ? null : row.id) },
                      { key: 'status', header: 'Status', render: row => (row._type === 'add' ? null : <Badge variant={statusVariant(row.status)}>{row.status}</Badge>) },
                      { key: 'advertiser', header: 'Advertiser' },
                      // The expand chevron lives in the table's own leading
                      // column, so Name only carries the name and the count.
                      { key: 'name', header: 'Name', width: 320, render: row => row._type === 'booking' ? row.name : row._type !== 'campaign' ? null : (
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-medium">{row.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">({row.bookings} booking{row.bookings === 1 ? '' : 's'})</span>
                        </span>
                      ) },
                      ...(engineType === 'offsite' ? [{ key: 'platform', header: 'Platform', render: () => 'Epsilon' }] : []),
                      { key: 'products', header: 'Retail products', render: row => {
                        if (row._type === 'booking') return null;
                        const maxShow = 3;
                        const shown = row.products.images.slice(0, maxShow);
                        const remaining = row.products.total - shown.length;
                        return (
                          <div className="flex items-center gap-1">
                            {shown.map((img, i) => (
                              <img key={i} src={img} alt="" className="w-7 h-7 rounded object-cover" />
                            ))}
                            {remaining > 0 && <span className="text-xs text-muted-foreground ml-0.5">+{remaining}</span>}
                          </div>
                        );
                      }},
                      { key: 'bookings', header: 'Bookings', render: row => row._type === 'campaign' ? <Badge variant="secondary">{row.bookings}</Badge> : null },
                      { key: 'creatives', header: 'Creatives', render: row => row._type === 'campaign' ? <Badge variant="secondary">{row.creatives}</Badge> : null },
                      { key: 'placements', header: 'Placements', render: row => row._type === 'campaign' ? <Badge variant="secondary">{row.placements}</Badge> : null },
                      { key: 'spendToDate', header: 'Spend to date', render: row => (row._type === 'add' ? null : `$${row.spendToDate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) },
                      { key: 'spendingLimit', header: 'Spending limit', render: row => row._type === 'campaign' ? `$${row.spendingLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null },
                      { key: 'start', header: 'Start date', render: row => (row._type === 'add' ? null : new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })) },
                      { key: 'end', header: 'End date', render: row => (row._type === 'add' ? null : new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })) },
                    ]}
                    data={tableRows}
                    rowKey={row => row._id}
                    hideActions
                    // The add-booking CTA spans the row: it is an action on the
                    // campaign, not a value in any one column.
                    fullWidthRow={(row) => row._type !== 'add' ? null : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); addBookingTo(row.parentId); }}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add booking
                      </button>
                    )}
                    expandable={{
                      isExpandable: row => row._type === 'campaign' && row.bookings > 0,
                      isExpanded: row => expandedRows.includes(row._id),
                      onToggle: row => toggleRow(row._id),
                      getLabel: (row, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${row.name}`,
                      isChild: (row) => row._type === 'booking',
                    }}
                    onRowClick={(row) => {
                      if (row._type === 'add') return;
                      // Rows link into the campaign; bookings open their parent campaign
                      // (in this engine's section). The chevron alone toggles expansion.
                      const target = row._type === 'booking' ? row.parentId : row.id;
                      window.location.href = `/campaigns/${engineType}/${target}`;
                    }}
                    rowClassName={(row) =>
                      row._type === 'booking'
                        ? '[&>td]:bg-muted/20 [&:hover>td]:bg-muted/40'
                        : cn('cursor-pointer', expandedRows.includes(row._id) && '[&>td]:!bg-muted')
                    }
                  />
                </div>
              ),
            },
            {
              // Everything outstanding across this proposition's campaigns and
              // bookings — the same derived to-dos the detail pages show, just
              // scoped to the engine instead of a single entity.
              label: 'Notifications',
              value: 'actions',
              badgeCount: engineUnread,
              content: <InboxPanel scope="engine" entityId={engineId} className="mt-6" />,
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType={engineType} scope="overview" />,
            },
          ]}
          action={activeTab === 'campaigns' ? <AddButton>Add campaign</AddButton> : null}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Retailer-authored help for this overview. */}
        <FaqPanel surface="campaign-overview" className="mt-6" />
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
});

// Campaign OVERVIEW (Campaigns menu) — all campaigns of an engine, no Media plan tab.
export const CampaignOverview: Story = createCampaignOverviewStory('all', 'All engines');

export const SponsoredProducts: Story = createCampaignOverviewStory('sponsored products', 'Sponsored products');

export const Display: Story = createCampaignOverviewStory('display', 'Display');

export const DigitalInStore: Story = createCampaignOverviewStory('digital in-store', 'Digital in-store');

export const OfflineInstore: Story = createCampaignOverviewStory('offline instore', 'Offline in-store');

export const Offsite: Story = createCampaignOverviewStory('offsite', 'Offsite');

// Campaign view FROM a media plan (linked to it) — keeps the Media plan details tab.
export const SponsoredProductsFromMediaPlan: Story = createCampaignOverviewStory('sponsored products', 'Sponsored products', true);

export const DisplayFromMediaPlan: Story = createCampaignOverviewStory('display', 'Display', true);

export const DigitalInStoreFromMediaPlan: Story = createCampaignOverviewStory('digital in-store', 'Digital in-store', true);

export const OfflineInstoreFromMediaPlan: Story = createCampaignOverviewStory('offline instore', 'Offline in-store', true);

export const OffsiteFromMediaPlan: Story = createCampaignOverviewStory('offsite', 'Offsite', true);

// Campaign data for the card view
const campaignSummaryData = [
  {
    id: 'C-001',
    campaignType: 'sponsored-products',
    title: 'Holiday Sale Campaign',
    badge: { text: 'Best ROAS', variant: 'default' as const },
    goal: 'performance-transaction',
    estimatedRoas: '4.8x',
    budget: '$15,000',
    usedBudget: '$9,200',
    totalPrice: '$9,150',
    budgetUsagePercentage: 61,
    placements: 12,
    engines: [
      { id: 'display', name: 'Display', campaignName: 'Holiday Banners', status: 'running' as const, enabled: true },
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'Holiday Top Picks', status: 'running' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'Holiday Screens', status: 'ready' as const, enabled: true },
      { id: 'offline', name: 'Offline in-store', campaignName: 'Holiday POS', status: 'in-option' as const, enabled: true },
      { id: 'offsite', name: 'Offsite', campaignName: 'Holiday Open Web', status: 'draft' as const, enabled: true },
    ],
    dateRange: {
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 29),
    },
    features: [],
  },
  {
    id: 'C-002',
    campaignType: 'display',
    title: 'Summer Launch Campaign',
    badge: { text: 'High CTR', variant: 'secondary' as const },
    goal: 'brand-awareness',
    estimatedRoas: '3.2x',
    budget: '$8,500',
    usedBudget: '$2,100',
    totalPrice: '$2,125',
    budgetUsagePercentage: 25,
    placements: 8,
    engines: [
      { id: 'display', name: 'Display', campaignName: 'Summer Banners', status: 'running' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'Summer Kiosks', status: 'ready' as const, enabled: true },
    ],
    dateRange: {
      from: new Date('2024-07-01'),
      to: addDays(new Date('2024-07-01'), 30),
    },
    features: [],
  },
  {
    id: 'C-003',
    campaignType: 'digital-instore',
    title: 'Back to School Campaign',
    badge: { text: 'In Option', variant: 'outline' as const },
    goal: 'customer-acquisition',
    estimatedRoas: '5.1x',
    budget: '$12,000',
    usedBudget: '$4,800',
    totalPrice: '$4,800',
    budgetUsagePercentage: 40,
    placements: 15,
    engines: [
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'Back to School Promos', status: 'in-option' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'School Aisle Screens', status: 'in-option' as const, enabled: true },
    ],
    dateRange: {
      from: new Date('2024-08-10'),
      to: addDays(new Date('2024-08-10'), 31),
    },
    features: [],
  },
  {
    id: 'C-004',
    campaignType: 'offline-instore',
    title: 'Black Friday Campaign',
    badge: { text: 'Paused', variant: 'destructive' as const },
    goal: 'performance-transaction',
    estimatedRoas: '6.2x',
    budget: '$25,000',
    usedBudget: '$22,800',
    totalPrice: '$22,750',
    budgetUsagePercentage: 91,
    placements: 20,
    engines: [
      { id: 'display', name: 'Display', campaignName: 'BF Homepage Takeover', status: 'paused' as const, enabled: true },
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'BF Deal Listings', status: 'paused' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'BF Store Screens', status: 'paused' as const, enabled: true },
      { id: 'offline', name: 'Offline in-store', campaignName: 'BF Shelf Talkers', status: 'paused' as const, enabled: true },
      { id: 'offsite', name: 'Offsite', campaignName: 'BF Open Web', status: 'new' as const, enabled: false },
    ],
    dateRange: {
      from: new Date('2024-11-01'),
      to: addDays(new Date('2024-11-01'), 29),
    },
    features: [],
  },
  {
    id: 'C-005',
    campaignType: 'display',
    title: 'New Year Campaign',
    badge: { text: 'Ready', variant: 'secondary' as const },
    goal: 'retargeting',
    estimatedRoas: '4.5x',
    budget: '$18,000',
    usedBudget: '$1,200',
    totalPrice: '$19,500',
    budgetUsagePercentage: 7,
    placements: 14,
    engines: [
      { id: 'display', name: 'Display', campaignName: 'NY Retargeting Banners', status: 'ready' as const, enabled: true },
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'NY Featured Products', status: 'ready' as const, enabled: true },
    ],
    dateRange: {
      from: new Date('2025-01-01'),
      to: addDays(new Date('2025-01-01'), 31),
    },
    features: [],
  },
];

export const Campaigns360: Story = {
  render: () => {
    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const [campaignBudgets, setCampaignBudgets] = React.useState<{ [key: string]: string }>({});

    return (
      <MenuContextProvider>
        <AppLayout
          routes={defaultRoutes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Media plans',
            subtitle: 'All media plans',
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
          <Card className="w-full">
            <CardHeader>
              <FilterBar
                filters={[
                  {
                    name: 'Status',
                    options: [
                      { label: 'Running', value: 'running' },
                      { label: 'Ready', value: 'ready' },
                      { label: 'In option', value: 'in-option' },
                      { label: 'Paused', value: 'paused' },
                    ],
                    selectedValues: status,
                    onChange: setStatus,
                  },
                  {
                    name: 'Advertiser',
                    options: [
                      { label: 'Acme Media', value: 'acme-media' },
                      { label: 'BrandX', value: 'brandx' },
                      { label: 'MediaWorks', value: 'mediaworks' },
                      { label: 'AdPartners', value: 'adpartners' },
                    ],
                    selectedValues: advertiser,
                    onChange: setAdvertiser,
                  },
                ]}
                searchValue={''}
                onSearchChange={() => {}}
                searchPlaceholder="Search campaigns..."
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {campaignSummaryData.map((campaign, index) => {
                const currentBudget = campaignBudgets[campaign.title] || campaign.budget;
                return (
                  <CampaignSummary
                    key={index}
                    layout="horizontal"
                    title={campaign.title}
                    goal={campaign.goal}
                    audience="retail-shoppers"
                    estimatedRoas={campaign.estimatedRoas}
                    budget={currentBudget}
                    usedBudget={campaign.usedBudget}
                    totalPrice={campaign.totalPrice}
                    budgetUsagePercentage={campaign.budgetUsagePercentage}
                    engines={campaign.engines}
                    placements={campaign.placements}
                    dateRange={campaign.dateRange}
                    features={campaign.features}
                    onBudgetChange={(newBudget) => {
                      setCampaignBudgets(prev => ({
                        ...prev,
                        [campaign.title]: newBudget
                      }));
                      console.log(`Budget updated for ${campaign.title}: ${newBudget}`);
                    }}
                    onEdit={() => console.log(`Edit campaign: ${campaign.title}`)}
                    onEngineEdit={(engineId, engineName) => {
                      // Map engine ID to URL path
                      const engineTypeMap: { [key: string]: string } = {
                        'display': 'display',
                        'sponsored': 'sponsored-products',
                        'digital': 'digital-instore',
                        'offline': 'offline-instore',
                      };
                      const engineType = engineTypeMap[engineId] || engineId;
                      console.log(`Navigate to: /campaigns/${engineType}/${campaign.id}`);
                      alert(`Would navigate to: /campaigns/${engineType}/${campaign.id}`);
                    }}
                    className="w-full"
                  />
                );
              })}
            </CardContent>
          </Card>
        </AppLayout>
      </MenuContextProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
# 360 Campaigns

Get a complete overview of all your campaigns across all advertising engines with interactive budget management capabilities.

## Features

- **Comprehensive Campaign Cards**: Each campaign is displayed as a horizontal CampaignSummary component with full details
- **Interactive Budget Adjustment**: Click on any budget to open a dropdown with:
  - Direct input field for precise budget entry
  - Slider control for quick adjustments ($1,000 - $50,000 range)
  - Real-time budget updates
- **Multi-Engine Support**: Shows campaigns across Display, Sponsored Products, Digital In-Store, and Offline In-Store
- **Rich Information Display**: Shows budget usage, ROAS, engines used, and date ranges
- **Visual Status Indicators**: Color-coded badges for campaign status (Running, Ready, In Option, Paused)
- **Budget Usage Visualization**: Progress bars showing budget utilization with color indicators
- **Media Products Display**: Detailed breakdown showing budget and ROAS per advertising engine

## Interactive Elements

- **Budget Adjustment**: Click on any budget amount to adjust it using the dropdown with slider
- **Edit Campaign**: Quick access to campaign editing functionality
- **Add to Cart**: Easy campaign selection for bulk operations

## Use Cases

- 360-degree campaign management across all advertising channels
- Real-time budget optimization and reallocation
- Visual campaign performance monitoring
- Cross-engine campaign comparison and analysis
- Budget planning and adjustment workflows

This 360 Campaigns view provides complete visibility and control over your entire advertising portfolio, making it ideal for campaign managers who need to manage budgets and performance across multiple advertising engines simultaneously.
        `,
      },
    },
  },
};

export const Campaigns360NoGoalTargeting: Story = {
  render: () => {
    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const [campaignBudgets, setCampaignBudgets] = React.useState<{ [key: string]: string }>({});
    const [pageDateRange, setPageDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 180),
    });
    const [activeTab, setActiveTab] = React.useState('media-experiences');
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Holiday Sale Campaign', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '$10,000', newValue: '$15,000', description: 'Budget increased for holiday push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Campaign moved to in-option status' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Engine Added', field: 'Engines', oldValue: '-', newValue: 'Display', description: 'Added Display engine' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Engine Added', field: 'Engines', oldValue: '-', newValue: 'Sponsored Products', description: 'Added Sponsored Products engine' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Dates Modified', field: 'End Date', oldValue: '06/25/2024', newValue: '06/30/2024', description: 'Extended campaign end date' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Budget Updated', field: 'Budget', oldValue: '$15,000', newValue: '$18,000', description: 'Budget reallocated across engines' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Summer Launch Campaign', description: 'New campaign created' },
      { id: 'LOG-009', timestamp: '2024-12-12 10:15:00', user: 'Jane Doe', action: 'Status Changed', field: 'Status', oldValue: 'In-option', newValue: 'Running', description: 'Holiday Sale Campaign is now live' },
      { id: 'LOG-010', timestamp: '2024-12-13 09:00:00', user: 'Mike Johnson', action: 'Engine Added', field: 'Engines', oldValue: '-', newValue: 'Digital In-store', description: 'Added Digital In-store engine to Summer Launch' },
    ];

    // Dynamic list of campaigns - starts with existing data
    const [campaigns, setCampaigns] = React.useState(campaignSummaryData);
    const [newCampaignIds, setNewCampaignIds] = React.useState<Set<string>>(new Set());
    let nextId = React.useRef(campaigns.length + 1);

    // Add a new empty media plan
    const handleAddMediaExperience = () => {
      const newId = `C-${String(nextId.current).padStart(3, '0')}`;
      nextId.current += 1;
      setNewCampaignIds(prev => new Set(prev).add(newId));
      setCampaigns(prev => [
        {
          id: newId,
          campaignType: 'new',
          title: '',
          badge: { text: 'New', variant: 'outline' as const },
          goal: '',
          estimatedRoas: '0x',
          budget: '',
          usedBudget: '',
          totalPrice: '',
          budgetUsagePercentage: 0,
          placements: 0,
          engines: [],
          dateRange: {
            from: new Date(),
            to: addDays(new Date(), 30),
          },
          features: [],
        },
        ...prev,
      ]);
    };

    return (
      <MenuContextProvider>
        <AppLayout
          routes={defaultRoutes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Media plans',
            subtitle: 'All media plans',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
            headerRight: (
              <>
                <AdvertiserSelect
                  value={headerAdvertiser}
                  onChange={setHeaderAdvertiser}
                />
                <DateRangePicker
                  dateRange={pageDateRange}
                  onDateRangeChange={setPageDateRange}
                  placeholder="Filter by date range"
                  className="bg-background border-border w-[220px]"
                  showPresets={true}
                />
              </>
            ),
          }}
        >
          <CardWithTabs
            className="w-full"
            tabs={[
              {
                label: 'Media plans',
                value: 'media-experiences',
                content: (
                  <div className="space-y-6 mt-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Status',
                          options: [
                            { label: 'Running', value: 'running' },
                            { label: 'Ready', value: 'ready' },
                            { label: 'In option', value: 'in-option' },
                            { label: 'Paused', value: 'paused' },
                          ],
                          selectedValues: status,
                          onChange: setStatus,
                        },
                        {
                          name: 'Advertiser',
                          options: [
                            { label: 'Acme Media', value: 'acme-media' },
                            { label: 'BrandX', value: 'brandx' },
                            { label: 'MediaWorks', value: 'mediaworks' },
                            { label: 'AdPartners', value: 'adpartners' },
                          ],
                          selectedValues: advertiser,
                          onChange: setAdvertiser,
                        },
                      ]}
                      searchValue={''}
                      onSearchChange={() => {}}
                      searchPlaceholder="Search campaigns..."
                    />
                    <div className="space-y-6">
                      {campaigns.map((campaign) => {
                        const currentBudget = campaignBudgets[campaign.title] || campaign.budget;
                        return (
                          <CampaignSummary
                            key={campaign.id}
                            layout="horizontal"
                            title={campaign.title}
                            goal={campaign.goal}
                            audience="retail-shoppers"
                            hideGoal
                            hideTargeting
                            hideAgent
                            hideEngineToggle
                            hideEngineActions
                            guidedSetup={newCampaignIds.has(campaign.id)}
                            onCancel={() => {
                              setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
                              setNewCampaignIds(prev => {
                                const next = new Set(prev);
                                next.delete(campaign.id);
                                return next;
                              });
                            }}
                            campaignId={campaign.id}
                            defaultExpanded={campaign.engines.length === 0 || newCampaignIds.has(campaign.id)}
                            estimatedRoas={campaign.estimatedRoas}
                            budget={currentBudget}
                            usedBudget={campaign.usedBudget}
                            totalPrice={campaign.totalPrice}
                            budgetUsagePercentage={campaign.budgetUsagePercentage}
                            engines={campaign.engines}
                            placements={campaign.placements}
                            dateRange={campaign.dateRange}
                            features={campaign.features}
                            onBudgetChange={(newBudget) => {
                              setCampaignBudgets(prev => ({
                                ...prev,
                                [campaign.title]: newBudget
                              }));
                              console.log(`Budget updated for ${campaign.title}: ${newBudget}`);
                            }}
                            onEdit={() => console.log(`Edit campaign: ${campaign.title}`)}
                            onEngineEdit={(engineId, engineName) => {
                              const engineTypeMap: { [key: string]: string } = {
                                'display': 'display',
                                'sponsored': 'sponsored-products',
                                'digital': 'digital-instore',
                                'offline': 'offline-instore',
                              };
                              const engineType = engineTypeMap[engineId] || engineId;
                              console.log(`Navigate to: /campaigns/${engineType}/${campaign.id}`);
                              alert(`Would navigate to: /campaigns/${engineType}/${campaign.id}`);
                            }}
                            onEngineAdd={(propositionType) => {
                              console.log(`Adding ${propositionType} campaign to ${campaign.title}`);
                            }}
                            className="w-full"
                          />
                        );
                      })}
                    </div>
                  </div>
                ),
              },
              {
                label: 'Logs',
                value: 'logs',
                content: (
                  <div className="space-y-6 mt-6">
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
                            { label: 'Campaign Created', value: 'Campaign Created' },
                            { label: 'Budget Updated', value: 'Budget Updated' },
                            { label: 'Status Changed', value: 'Status Changed' },
                            { label: 'Engine Added', value: 'Engine Added' },
                            { label: 'Dates Modified', value: 'Dates Modified' },
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
                        { key: 'timestamp', header: 'Timestamp', render: (row: typeof logData[0]) => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                        { key: 'user', header: 'User' },
                        { key: 'action', header: 'Action', render: (row: typeof logData[0]) => <Badge variant="outline">{row.action}</Badge> },
                        { key: 'field', header: 'Field' },
                        { key: 'oldValue', header: 'Old Value' },
                        { key: 'newValue', header: 'New Value' },
                        { key: 'description', header: 'Description' },
                      ]}
                      data={logData.filter(row => {
                        const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                        const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                        return userMatch && actionMatch;
                      })}
                      rowKey={(row: typeof logData[0]) => row.id}
                      onRowClick={(row: typeof logData[0]) => console.log(`Log clicked: ${row.id}`)}
                    />
                  </div>
                ),
              },
            ]}
            action={
              activeTab === 'media-experiences' ? (
                <AddButton onClick={handleAddMediaExperience}>
                  Add media plan
                </AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null
            }
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
# 360 Campaigns – No Goal & Targeting

A variant of the 360 Campaigns view without Goal and Targeting sections in the campaign summary cards. This streamlined view focuses on budget, runtime, and media proposition management.

## Differences from Standard 360 Campaigns

- **No Goal dropdown** in the summary sidebar
- **No Targeting dropdown** and Auto Targeting toggle in the summary sidebar
- **Simplified collapsed subtitle** without goal information
- All other features remain the same (budget management, engine toggles, metrics, etc.)

## Use Cases

- Retailers or platforms where goal and targeting are managed at a different level
- Simplified campaign management workflows
- Quick budget and runtime-focused campaign overviews
        `,
      },
    },
  },
};