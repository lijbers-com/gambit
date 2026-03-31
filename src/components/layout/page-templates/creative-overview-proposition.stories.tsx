import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import React, { useState } from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Creative Overview/Propositions',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Creative Overview - Proposition Variants

Separate creative overview pages per proposition/engine type. Each variant shows only the creatives relevant to that specific proposition.

## Propositions
- **Display**: Online display advertisements (banners, video, interstitials)
- **Digital In-Store**: Digital signage and in-store digital displays
- **Offline In-Store**: Physical in-store materials (wobblers, shelf strips, posters)
- **Offsite**: Offsite display advertisements across external networks
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const statusVariant = (status: string) => {
  switch (status) {
    case 'Approved': return 'default';
    case 'Pending': return 'secondary';
    case 'Draft': return 'outline';
    case 'Rejected': return 'destructive';
    default: return 'outline';
  }
};

// Display creatives
const displayCreatives = [
  { id: 'CR-001', status: 'Approved', format: 'Banner', name: 'Holiday Sale Banner', campaign: 'Holiday Sale', bookings: 3, dimensions: '728x90', created: '2024-06-01', updated: '2024-06-15' },
  { id: 'CR-002', status: 'Pending', format: 'Video', name: 'Summer Launch Video', campaign: 'Summer Launch', bookings: 1, dimensions: '1920x1080', created: '2024-07-01', updated: '2024-07-10' },
  { id: 'CR-006', status: 'Draft', format: 'Interstitial', name: 'Winter Collection', campaign: 'Winter Launch', bookings: 0, dimensions: '320x480', created: '2024-11-01', updated: '2024-11-01' },
  { id: 'CR-010', status: 'Approved', format: 'Banner', name: 'Spring Deals Banner', campaign: 'Spring Deals', bookings: 2, dimensions: '300x250', created: '2024-03-15', updated: '2024-04-01' },
  { id: 'CR-011', status: 'Approved', format: 'Video', name: 'Brand Story Video', campaign: 'Brand Awareness', bookings: 4, dimensions: '1920x1080', created: '2024-05-10', updated: '2024-05-20' },
  { id: 'CR-012', status: 'Pending', format: 'Banner', name: 'Flash Sale Leaderboard', campaign: 'Flash Sale', bookings: 1, dimensions: '728x90', created: '2024-08-20', updated: '2024-08-22' },
];

// Digital in-store creatives
const digitalInstoreCreatives = [
  { id: 'CR-003', status: 'Approved', format: 'Digital Signage', name: 'Back to School Display', campaign: 'Back to School', bookings: 2, dimensions: '1920x1080', created: '2024-08-01', updated: '2024-08-05' },
  { id: 'CR-020', status: 'Approved', format: 'Digital Signage', name: 'Entrance Screen Welcome', campaign: 'Store Branding', bookings: 5, dimensions: '3840x2160', created: '2024-04-10', updated: '2024-04-15' },
  { id: 'CR-021', status: 'Pending', format: 'Digital Endcap', name: 'Aisle Promo Screen', campaign: 'Aisle Promotions', bookings: 3, dimensions: '1080x1920', created: '2024-06-20', updated: '2024-06-25' },
  { id: 'CR-022', status: 'Draft', format: 'Checkout Screen', name: 'Checkout Upsell', campaign: 'Checkout Campaign', bookings: 0, dimensions: '1920x1080', created: '2024-09-01', updated: '2024-09-01' },
  { id: 'CR-023', status: 'Approved', format: 'Digital Signage', name: 'Fresh Produce Display', campaign: 'Fresh & Healthy', bookings: 2, dimensions: '1920x1080', created: '2024-07-15', updated: '2024-07-20' },
];

// Offline in-store creatives
const offlineInstoreCreatives = [
  { id: 'CR-004', status: 'Rejected', format: 'Wobbler', name: 'Black Friday Wobbler', campaign: 'Black Friday', bookings: 0, dimensions: '100x150mm', created: '2024-10-15', updated: '2024-10-20' },
  { id: 'CR-030', status: 'Approved', format: 'Shelf Strip', name: 'Weekly Deals Strip', campaign: 'Weekly Deals', bookings: 6, dimensions: '900x50mm', created: '2024-05-01', updated: '2024-05-10' },
  { id: 'CR-031', status: 'Approved', format: 'Poster', name: 'Season Sale Poster', campaign: 'Season Sale', bookings: 3, dimensions: 'A2', created: '2024-03-20', updated: '2024-04-01' },
  { id: 'CR-032', status: 'Pending', format: 'Floor Sticker', name: 'Entrance Floor Promo', campaign: 'Store Entrance', bookings: 1, dimensions: '500x500mm', created: '2024-08-01', updated: '2024-08-05' },
  { id: 'CR-033', status: 'Draft', format: 'Wobbler', name: 'New Product Wobbler', campaign: 'Product Launch', bookings: 0, dimensions: '80x120mm', created: '2024-11-10', updated: '2024-11-10' },
];

// Offsite creatives
const offsiteCreatives = [
  { id: 'CR-040', status: 'Approved', format: 'Display Banner', name: 'Retargeting Banner', campaign: 'Retargeting Q4', bookings: 4, dimensions: '300x250', created: '2024-09-15', updated: '2024-10-01' },
  { id: 'CR-041', status: 'Approved', format: 'Native Ad', name: 'Recipe Integration', campaign: 'Content Marketing', bookings: 2, dimensions: '600x400', created: '2024-06-10', updated: '2024-06-20' },
  { id: 'CR-042', status: 'Pending', format: 'Video Pre-roll', name: 'Summer Collection Pre-roll', campaign: 'Summer Launch', bookings: 1, dimensions: '1920x1080', created: '2024-07-05', updated: '2024-07-10' },
  { id: 'CR-043', status: 'Draft', format: 'Display Banner', name: 'Holiday Retargeting', campaign: 'Holiday Campaign', bookings: 0, dimensions: '728x90', created: '2024-11-01', updated: '2024-11-01' },
  { id: 'CR-044', status: 'Approved', format: 'Social Display', name: 'Social Media Banner Set', campaign: 'Social Push', bookings: 3, dimensions: '1080x1080', created: '2024-04-20', updated: '2024-05-01' },
];

interface PropositionCreativeOverviewProps {
  title: string;
  subtitle: string;
  data: typeof displayCreatives;
  formatOptions: { label: string; value: string }[];
}

const PropositionCreativeOverview = ({ title, subtitle, data, formatOptions }: PropositionCreativeOverviewProps) => {
  const { theme: storybookTheme } = useStorybookTheme();
  const currentTheme = storybookTheme || 'retailMedia';
  const routes = getRoutesForTheme(currentTheme);
  const [status, setStatus] = useState<string[]>([]);
  const [format, setFormat] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filteredData = data.filter(row => {
    const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
    const formatMatch = format.length === 0 || format.includes(row.format.toLowerCase().replace(/ /g, '-'));
    const searchMatch = search === '' ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.campaign.toLowerCase().includes(search.toLowerCase()) ||
      row.id.toLowerCase().includes(search.toLowerCase());
    return statusMatch && formatMatch && searchMatch;
  });

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title,
          subtitle,
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
                    { label: 'Approved', value: 'approved' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Rejected', value: 'rejected' },
                  ],
                  selectedValues: status,
                  onChange: setStatus,
                },
                {
                  name: 'Format',
                  options: formatOptions,
                  selectedValues: format,
                  onChange: setFormat,
                },
              ]}
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search creatives..."
            />
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'status', header: 'Status', render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                { key: 'format', header: 'Format' },
                { key: 'dimensions', header: 'Dimensions' },
                { key: 'name', header: 'Name' },
                { key: 'campaign', header: 'Campaign' },
                { key: 'bookings', header: 'Bookings', render: row => <Badge variant="secondary">{row.bookings}</Badge> },
                { key: 'created', header: 'Created', render: row => new Date(row.created).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                { key: 'updated', header: 'Updated', render: row => new Date(row.updated).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
              ]}
              data={filteredData}
              rowKey={row => row.id}
              rowClassName={() => 'cursor-pointer'}
              onRowClick={row => {
                console.log('Navigate to creative details for', row.name);
              }}
            />
          </CardContent>
        </Card>
      </AppLayout>
    </MenuContextProvider>
  );
};

export const Display: Story = {
  render: () => (
    <PropositionCreativeOverview
      title="Display Creatives"
      subtitle="Manage display creative assets — banners, videos, and interstitials"
      data={displayCreatives}
      formatOptions={[
        { label: 'Banner', value: 'banner' },
        { label: 'Video', value: 'video' },
        { label: 'Interstitial', value: 'interstitial' },
      ]}
    />
  ),
};

export const DigitalInStore: Story = {
  name: 'Digital In-Store',
  render: () => (
    <PropositionCreativeOverview
      title="Digital In-Store Creatives"
      subtitle="Manage digital in-store creative assets — signage, endcaps, and screens"
      data={digitalInstoreCreatives}
      formatOptions={[
        { label: 'Digital Signage', value: 'digital-signage' },
        { label: 'Digital Endcap', value: 'digital-endcap' },
        { label: 'Checkout Screen', value: 'checkout-screen' },
      ]}
    />
  ),
};

export const OfflineInStore: Story = {
  name: 'Offline In-Store',
  render: () => (
    <PropositionCreativeOverview
      title="Offline In-Store Creatives"
      subtitle="Manage offline in-store creative assets — wobblers, shelf strips, and posters"
      data={offlineInstoreCreatives}
      formatOptions={[
        { label: 'Wobbler', value: 'wobbler' },
        { label: 'Shelf Strip', value: 'shelf-strip' },
        { label: 'Poster', value: 'poster' },
        { label: 'Floor Sticker', value: 'floor-sticker' },
      ]}
    />
  ),
};

export const Offsite: Story = {
  render: () => (
    <PropositionCreativeOverview
      title="Offsite Creatives"
      subtitle="Manage offsite creative assets — display banners, native ads, and video"
      data={offsiteCreatives}
      formatOptions={[
        { label: 'Display Banner', value: 'display-banner' },
        { label: 'Native Ad', value: 'native-ad' },
        { label: 'Video Pre-roll', value: 'video-pre-roll' },
        { label: 'Social Display', value: 'social-display' },
      ]}
    />
  ),
};
