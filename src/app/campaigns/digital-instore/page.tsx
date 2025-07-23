'use client';

// EXACT DigitalInStore component from story/page-templates-campaign-overview--digital-in-store
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { defaultRoutes } from '@/components/layout/default-routes';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// EXACT campaign data from Storybook
const campaignData = [
  { id: 'C-001', status: 'Running', advertiser: 'Acme Media', name: 'Holiday Sale', lineItems: 5, creatives: 3, start: '2024-06-01', end: '2024-06-30' },
  { id: 'C-002', status: 'Ready', advertiser: 'BrandX', name: 'Summer Launch', lineItems: 2, creatives: 1, start: '2024-07-01', end: '2024-07-31' },
  { id: 'C-003', status: 'In option', advertiser: 'MediaWorks', name: 'Back to School', lineItems: 4, creatives: 2, start: '2024-08-10', end: '2024-09-10' },
  { id: 'C-004', status: 'Paused', advertiser: 'AdPartners', name: 'Black Friday', lineItems: 6, creatives: 4, start: '2024-11-01', end: '2024-11-30' },
];

const statusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Running': return 'default';
    case 'Ready': return 'secondary';
    case 'In option': return 'outline';
    case 'Paused': return 'destructive';
    default: return 'outline';
  }
};

export default function DigitalInStoreCampaignsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string[]>([]);
  const [advertiser, setAdvertiser] = useState<string[]>([]);
  
  const filteredCampaignData = campaignData.filter(row => {
    const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
    const advertiserMatch = advertiser.length === 0 || advertiser.includes(row.advertiser.toLowerCase().replace(/ /g, '-'));
    return statusMatch && advertiserMatch;
  });

  const handleRowClick = (campaign: typeof campaignData[0]) => {
    // Navigate to campaign details page
    router.push(`/campaigns/${campaign.id}`);
  };

  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Campaigns - Digital In-Store',
        subtitle: 'Monitor digital in-store campaign performance and manage your advertising initiatives',
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
            searchPlaceholder="Search digital in-store campaigns..."
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
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}