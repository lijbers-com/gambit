import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent, CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { DateRangePicker } from '@/components/ui/date-picker';
import { AdvertiserSelect } from '@/components/ui/advertiser-select';
import { DateRange } from 'react-day-picker';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { addDays } from 'date-fns';
import * as React from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';

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


const productImages = [
  '/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg',
  '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg',
  '/products/AHI_656b70553646657151435343764372315175694b3941.jpeg',
];

const campaignData = [
  { id: 'C-001', status: 'Running', advertiser: 'Acme Media', name: 'Holiday Sale', bookings: 5, creatives: 3, placements: 12, start: '2024-06-01', end: '2024-06-30', engines: ['Display', 'Sponsored products', 'Offsite'], products: { images: productImages, total: 3 }, spendToDate: 0, spendingLimit: 10000 },
  { id: 'C-002', status: 'Ready', advertiser: 'BrandX', name: 'Summer Launch', bookings: 2, creatives: 1, placements: 8, start: '2024-07-01', end: '2024-07-31', engines: ['Digital in-store', 'Offsite'], products: { images: productImages.slice(0, 1), total: 1 }, spendToDate: 0, spendingLimit: 100000 },
  { id: 'C-003', status: 'In option', advertiser: 'MediaWorks', name: 'Back to School', bookings: 4, creatives: 2, placements: 15, start: '2024-08-10', end: '2024-09-10', engines: ['Sponsored products', 'Offsite'], products: { images: productImages.slice(0, 2), total: 7 }, spendToDate: 0, spendingLimit: 100000 },
  { id: 'C-004', status: 'Paused', advertiser: 'AdPartners', name: 'Black Friday', bookings: 6, creatives: 4, placements: 20, start: '2024-11-01', end: '2024-11-30', engines: ['Display', 'Digital in-store', 'Offsite'], products: { images: productImages, total: 13 }, spendToDate: 0, spendingLimit: 80000 },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'Running': return 'default';
    case 'Ready': return 'secondary';
    case 'In option': return 'outline';
    case 'Paused': return 'destructive';
    default: return 'outline';
  }
};

const createCampaignOverviewStory = (engineType: string, engineTitle: string) => ({
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [retailProduct, setRetailProduct] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const filteredCampaignData = campaignData.filter(row => {
      const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
      const advertiserMatch = advertiser.length === 0 || advertiser.includes(row.advertiser.toLowerCase().replace(/ /g, '-'));
      return statusMatch && advertiserMatch;
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
          title: `Campaigns - ${engineTitle}`,
          subtitle: `Monitor ${engineType} campaign performance and manage your advertising initiatives`,
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
            <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
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
            </div>
            <Button>Add campaign</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'status', header: 'Status', render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                { key: 'advertiser', header: 'Advertiser' },
                { key: 'name', header: 'Name' },
                ...(engineType === 'offsite' ? [{ key: 'marketplace', header: 'Marketplace', render: () => 'Epsilon' }] : []),
                { key: 'products', header: 'Products', render: row => {
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
                { key: 'bookings', header: 'Bookings', render: row => <Badge variant="secondary">{row.bookings}</Badge> },
                { key: 'creatives', header: 'Creatives', render: row => <Badge variant="secondary">{row.creatives}</Badge> },
                { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
                { key: 'spendToDate', header: 'Spend to date', render: row => `$${row.spendToDate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                { key: 'spendingLimit', header: 'Spending limit', render: row => `$${row.spendingLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
              ]}
              data={filteredCampaignData}
              rowKey={row => row.id}
              onRowClick={(row) => console.log(`Navigating to campaign: ${row.name} (${row.id})`)}
            />
          </CardContent>
        </Card>
      </AppLayout>
      </MenuContextProvider>
    );
  },
});

export const CampaignOverview: Story = createCampaignOverviewStory('all', 'All Engines');

export const SponsoredProducts: Story = createCampaignOverviewStory('sponsored products', 'Sponsored Products');

export const Display: Story = createCampaignOverviewStory('display', 'Display');

export const DigitalInStore: Story = createCampaignOverviewStory('digital in-store', 'Digital In-Store');

export const OfflineInstore: Story = createCampaignOverviewStory('offline instore', 'Offline Instore');

export const Offsite: Story = createCampaignOverviewStory('offsite', 'Offsite');

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
            subtitle: 'Complete overview of all your campaigns across all advertising engines',
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
            subtitle: 'Complete overview of all your campaigns across all advertising engines',
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
                            hideAutoBudget
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
                <Button onClick={handleAddMediaExperience}>
                  Add media plan
                </Button>
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