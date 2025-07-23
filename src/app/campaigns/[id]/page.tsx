'use client';

// EXACT CampaignDetails component from story/page-templates-campaign-details--campaign-details
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { defaultRoutes } from '@/components/layout/default-routes';
import { useRouter } from 'next/navigation';

export default function CampaignDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('line-items');
  const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
  const [placement, setPlacement] = useState<string[]>([]);
  const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
  const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
  
  // Sample data - EXACT from Storybook
  const creativeData = [
    { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Banner', placements: 3 },
    { id: 'CR-002', status: 'Rejected', name: 'Creative 2', format: 'Video', placements: 1 },
    { id: 'CR-003', status: 'Pending', name: 'Creative 3', format: 'Banner', placements: 2 },
  ];
  
  const lineItemData = [
    { id: 'LI-001', status: 'In-option', name: 'Line-item 1', placement: 'Homepage', start: '2024-06-01', end: '2024-06-30' },
    { id: 'LI-002', status: 'Running', name: 'Line-item 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31' },
    { id: 'LI-003', status: 'Paused', name: 'Line-item 3', placement: 'Footer', start: '2024-08-10', end: '2024-09-10' },
    { id: 'LI-004', status: 'Stopped', name: 'Line-item 4', placement: 'Header', start: '2024-11-01', end: '2024-11-30' },
    { id: 'LI-005', status: 'Ready', name: 'Line-item 5', placement: 'Homepage', start: '2024-12-01', end: '2024-12-31' },
  ];

  // Status badge variants - EXACT from Storybook
  const creativeStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Rejected': return 'destructive';
      case 'Pending': return 'outline';
      default: return 'outline';
    }
  };

  const lineItemStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'In-option': return 'outline';
      case 'Running': return 'default';
      case 'Paused': return 'secondary';
      case 'Stopped': return 'destructive';
      case 'Ready': return 'secondary';
      default: return 'outline';
    }
  };

  // Form state for Details tab
  const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
  const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
  const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleCreativeClick = (creative: typeof creativeData[0]) => {
    router.push(`/creatives/${creative.id}`);
  };

  const handleLineItemClick = (lineItem: typeof lineItemData[0]) => {
    router.push(`/line-items/${lineItem.id}`);
  };

  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Campaign: Summer Launch',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
      }}
    >
      <CardWithTabs
        className="w-full"
        header={
          activeTab === 'line-items' ? (
            <FilterBar
              filters={[
                {
                  name: 'Status',
                  options: [
                    { label: 'In-option', value: 'In-option' },
                    { label: 'Running', value: 'Running' },
                    { label: 'Paused', value: 'Paused' },
                    { label: 'Stopped', value: 'Stopped' },
                    { label: 'Ready', value: 'Ready' },
                  ],
                  selectedValues: lineItemStatus,
                  onChange: setLineItemStatus,
                },
                {
                  name: 'Placement',
                  options: [
                    { label: 'Homepage', value: 'Homepage' },
                    { label: 'Sidebar', value: 'Sidebar' },
                    { label: 'Footer', value: 'Footer' },
                    { label: 'Header', value: 'Header' },
                  ],
                  selectedValues: placement,
                  onChange: setPlacement,
                },
              ]}
              searchValue={''}
              onSearchChange={() => {}}
              searchPlaceholder="Search line items..."
            />
          ) : activeTab === 'creatives' ? (
            <FilterBar
              filters={[
                {
                  name: 'Status',
                  options: [
                    { label: 'Approved', value: 'Approved' },
                    { label: 'Rejected', value: 'Rejected' },
                    { label: 'Pending', value: 'Pending' },
                  ],
                  selectedValues: creativeStatus,
                  onChange: setCreativeStatus,
                },
                {
                  name: 'Format',
                  options: [
                    { label: 'Banner', value: 'Banner' },
                    { label: 'Video', value: 'Video' },
                  ],
                  selectedValues: creativeFormat,
                  onChange: setCreativeFormat,
                },
              ]}
              searchValue={''}
              onSearchChange={() => {}}
              searchPlaceholder="Search creatives..."
            />
          ) : activeTab === 'details' ? (
            <form className="space-y-8 w-full max-w-2xl">
              <FormSection title="Details" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Campaign name</label>
                    <Input placeholder="Enter campaign name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PO Number</label>
                    <Input placeholder="Enter PO number" />
                  </div>
                </div>
              </FormSection>
              <FormSection title="Advertiser" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Advertiser</label>
                    <Input placeholder="Select advertiser" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <Input placeholder="Select brand" />
                  </div>
                </div>
              </FormSection>
              <FormSection title="Campaign">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                    <Input placeholder="Select goal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget</label>
                    <Input placeholder="Enter budget" type="number" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Run Time</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                    </div>
                    <div>
                      <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                    </div>
                  </div>
                </div>
              </FormSection>
              <Button type="submit">Save</Button>
            </form>
          ) : null
        }
        tabs={[
          {
            label: 'Line-items',
            value: 'line-items',
            content: (
              <Table
                columns={[
                  { key: 'id', header: 'Line-item ID' },
                  { key: 'status', header: 'Status', render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge> },
                  { key: 'name', header: 'Name' },
                  { key: 'placement', header: 'Placement' },
                  { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                  { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                ]}
                data={lineItemData.filter(row => {
                  const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                  const placementMatch = placement.length === 0 || placement.includes(row.placement);
                  return statusMatch && placementMatch;
                })}
                rowKey={row => row.id}
                onRowClick={handleLineItemClick}
              />
            ),
          },
          {
            label: 'Creatives',
            value: 'creatives',
            content: (
              <Table
                columns={[
                  { key: 'id', header: 'Creative ID' },
                  { key: 'status', header: 'Status', render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge> },
                  { key: 'name', header: 'Name' },
                  { key: 'format', header: 'Format' },
                  { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
                ]}
                data={creativeData.filter(row => {
                  const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                  const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                  return statusMatch && formatMatch;
                })}
                rowKey={row => row.id}
                onRowClick={handleCreativeClick}
              />
            ),
          },
          {
            label: 'Details',
            value: 'details',
            content: null,
          },
        ]}
        action={
          activeTab === 'line-items' ? (
            <Button>Add line-item</Button>
          ) : activeTab === 'creatives' ? (
            <Button>Add creative</Button>
          ) : null
        }
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </AppLayout>
  );
}