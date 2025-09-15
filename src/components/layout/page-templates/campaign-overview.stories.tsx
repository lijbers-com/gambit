import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { defaultRoutes } from '../default-routes';
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
  { id: 'C-001', status: 'Running', advertiser: 'Acme Media', name: 'Holiday Sale', lineItems: 5, creatives: 3, start: '2024-06-01', end: '2024-06-30' },
  { id: 'C-002', status: 'Ready', advertiser: 'BrandX', name: 'Summer Launch', lineItems: 2, creatives: 1, start: '2024-07-01', end: '2024-07-31' },
  { id: 'C-003', status: 'In option', advertiser: 'MediaWorks', name: 'Back to School', lineItems: 4, creatives: 2, start: '2024-08-10', end: '2024-09-10' },
  { id: 'C-004', status: 'Paused', advertiser: 'AdPartners', name: 'Black Friday', lineItems: 6, creatives: 4, start: '2024-11-01', end: '2024-11-30' },
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
        breadcrumbProps={{}}
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
                { key: 'lineItems', header: 'Line items', render: row => <Badge variant="secondary">{row.lineItems}</Badge> },
                { key: 'creatives', header: 'Creatives', render: row => <Badge variant="secondary">{row.creatives}</Badge> },
                { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
              ]}
              data={filteredCampaignData}
              rowKey={row => row.id}
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