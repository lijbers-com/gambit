import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { defaultRoutes } from '../default-routes';
import { addDays } from 'date-fns';
import * as React from 'react';

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
- **Line Items**: Number of associated line items (with badge)
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


const campaignData = [
  { id: 'C-001', status: 'Running', advertiser: 'Acme Media', name: 'Holiday Sale', lineItems: 5, creatives: 3, start: '2024-06-01', end: '2024-06-30', engines: ['Display', 'Sponsored products'] },
  { id: 'C-002', status: 'Ready', advertiser: 'BrandX', name: 'Summer Launch', lineItems: 2, creatives: 1, start: '2024-07-01', end: '2024-07-31', engines: ['Digital in-store'] },
  { id: 'C-003', status: 'In option', advertiser: 'MediaWorks', name: 'Back to School', lineItems: 4, creatives: 2, start: '2024-08-10', end: '2024-09-10', engines: ['Sponsored products'] },
  { id: 'C-004', status: 'Paused', advertiser: 'AdPartners', name: 'Black Friday', lineItems: 6, creatives: 4, start: '2024-11-01', end: '2024-11-30', engines: ['Display', 'Digital in-store'] },
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
    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const filteredCampaignData = campaignData.filter(row => {
      const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
      const advertiserMatch = advertiser.length === 0 || advertiser.includes(row.advertiser.toLowerCase().replace(/ /g, '-'));
      return statusMatch && advertiserMatch;
    });
    return (
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
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
              searchPlaceholder={`Search ${engineType} campaigns...`}
            />
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'status', header: 'Status', render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                { key: 'advertiser', header: 'Advertiser' },
                { key: 'name', header: 'Name' },
                { key: 'engines', header: 'Engine', render: row => (
                  <div className="flex flex-nowrap gap-1 whitespace-nowrap">
                    {row.engines.map((engine, index) => (
                      <Badge key={index} variant="outline" className="text-xs whitespace-nowrap">{engine}</Badge>
                    ))}
                  </div>
                )},
                { key: 'lineItems', header: 'Line items', render: row => <Badge variant="secondary">{row.lineItems}</Badge> },
                { key: 'creatives', header: 'Creatives', render: row => <Badge variant="secondary">{row.creatives}</Badge> },
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

// Campaign data for the card view
const campaignSummaryData = [
  {
    title: 'Holiday Sale Campaign',
    badge: { text: 'Best ROAS', variant: 'default' as const },
    goal: 'performance-transaction',
    estimatedRoas: '4.8x',
    budget: '$15,000',
    usedBudget: '$9,200',
    totalPrice: '$17,500',
    budgetUsagePercentage: 61,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 29),
    },
    features: [],
  },
  {
    title: 'Summer Launch Campaign',
    badge: { text: 'High CTR', variant: 'secondary' as const },
    goal: 'brand-awareness',
    estimatedRoas: '3.2x',
    budget: '$8,500',
    usedBudget: '$2,100',
    totalPrice: '$9,200',
    budgetUsagePercentage: 25,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-07-01'),
      to: addDays(new Date('2024-07-01'), 30),
    },
    features: [],
  },
  {
    title: 'Back to School Campaign',
    badge: { text: 'In Option', variant: 'outline' as const },
    goal: 'customer-acquisition',
    estimatedRoas: '5.1x',
    budget: '$12,000',
    usedBudget: '$4,800',
    totalPrice: '$13,500',
    budgetUsagePercentage: 40,
    engines: [
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-08-10'),
      to: addDays(new Date('2024-08-10'), 31),
    },
    features: [],
  },
  {
    title: 'Black Friday Campaign',
    badge: { text: 'Paused', variant: 'destructive' as const },
    goal: 'performance-transaction',
    estimatedRoas: '6.2x',
    budget: '$25,000',
    usedBudget: '$22,800',
    totalPrice: '$28,000',
    budgetUsagePercentage: 91,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-11-01'),
      to: addDays(new Date('2024-11-01'), 29),
    },
    features: [],
  },
  {
    title: 'New Year Campaign',
    badge: { text: 'Ready', variant: 'secondary' as const },
    goal: 'retargeting',
    estimatedRoas: '4.5x',
    budget: '$18,000',
    usedBudget: '$1,200',
    totalPrice: '$19,500',
    budgetUsagePercentage: 7,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
    ],
    dateRange: {
      from: new Date('2025-01-01'),
      to: addDays(new Date('2025-01-01'), 31),
    },
    features: [],
  },
];

export const FullFunnelOverview: Story = {
  render: () => {
    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={defaultRoutes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Campaigns - Card View',
            subtitle: 'Monitor campaign performance with detailed campaign summary cards',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
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
              {campaignSummaryData.map((campaign, index) => (
                <CampaignSummary
                  key={index}
                  layout="horizontal"
                  title={campaign.title}
                  badge={campaign.badge}
                  goal={campaign.goal}
                  estimatedRoas={campaign.estimatedRoas}
                  budget={campaign.budget}
                  usedBudget={campaign.usedBudget}
                  totalPrice={campaign.totalPrice}
                  budgetUsagePercentage={campaign.budgetUsagePercentage}
                  engines={campaign.engines}
                  dateRange={campaign.dateRange}
                  features={campaign.features}
                  onEdit={() => console.log(`Edit campaign: ${campaign.title}`)}
                  onAddToCart={() => console.log(`Add to cart: ${campaign.title}`)}
                  className="w-full"
                />
              ))}
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
# Campaign Card View

This variant replaces the traditional table view with horizontal CampaignSummary cards, providing a more detailed and visually rich representation of campaign data.

## Features

- **Detailed Campaign Cards**: Each campaign is displayed as a horizontal CampaignSummary component
- **Rich Information Display**: Shows budget usage, ROAS, engines used, and date ranges
- **Interactive Elements**: Each card includes Edit and Add to Cart actions
- **Visual Status Indicators**: Color-coded badges for campaign status
- **Budget Usage Visualization**: Progress bars showing budget utilization
- **Media Products Display**: Table format showing budget and ROAS per engine

## Use Cases

- Campaign management with detailed oversight
- Visual campaign performance monitoring
- Quick access to campaign editing and actions
- Better understanding of budget allocation per engine
- Enhanced campaign comparison view

This view provides much more detailed information per campaign compared to the table view, making it ideal for campaign managers who need comprehensive campaign insights at a glance.
        `,
      },
    },
  },
}; 