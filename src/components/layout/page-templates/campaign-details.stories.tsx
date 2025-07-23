import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '../../ui/card';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { FormSection } from '../../ui/form-section';
import { Input } from '../../ui/input';
import { DatePicker } from '../../ui/date-picker';
import { defaultRoutes } from '../default-routes';
import React, { useState } from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Campaign Details',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Campaign Details Page Template

The Campaign Details page template provides a comprehensive view of individual campaigns with tabbed navigation for different data views. It combines campaign information display with detailed line item and creative management.

## Features

- **Tabbed Interface**: CardWithTabs component for organized content sections
- **Campaign Information**: Detailed campaign metadata and settings
- **Line Items Management**: Table view with filtering and actions
- **Creatives Management**: Table view with filtering and actions
- **Advanced Filtering**: FilterBar for both line items and creatives
- **Action Menus**: Dropdown menus for row-level actions
- **Responsive Design**: Adapts to different screen sizes

## Tab Structure

### Campaign Information Tab
- **Campaign Details**: Name, advertiser, dates, budget
- **Settings**: Campaign configuration options
- **Status**: Current campaign status and approval state

### Line Items Tab
- **Data Table**: List of all line items in the campaign
- **Filtering**: Filter by status, type, and other criteria
- **Actions**: Edit, duplicate, delete line items
- **Search**: Real-time search across line item names
- **Status Badges**: Visual indicators for line item status

### Creatives Tab
- **Data Table**: List of all creatives in the campaign
- **Filtering**: Filter by format, status, and approval state
- **Actions**: Edit, duplicate, delete creatives
- **Search**: Real-time search across creative names
- **Status Badges**: Visual indicators for creative status

## Data Management

### Line Items
- **Status Tracking**: Active, Paused, Completed, Draft
- **Type Classification**: Display, Digital In-Store, Offline In-Store, Sponsored Products
- **Performance Metrics**: Impressions, clicks, conversions
- **Date Management**: Start/end dates with proper formatting

### Creatives
- **Approval Workflow**: Draft, Pending, Approved, Rejected
- **Format Classification**: Banner, Video, Digital Signage, etc.
- **Asset Management**: File uploads and asset tracking
- **Version Control**: Track creative versions and updates

## Action Capabilities

### Line Item Actions
- **Edit**: Navigate to line item detail page
- **Duplicate**: Create copy of line item
- **Delete**: Remove line item from campaign
- **Pause/Resume**: Toggle line item status
- **View Performance**: Access performance metrics

### Creative Actions
- **Edit**: Navigate to creative detail page
- **Duplicate**: Create copy of creative
- **Delete**: Remove creative from campaign
- **Approve/Reject**: Change approval status
- **Download**: Download creative assets

## Business Rules

1. **Campaign Status**: Controls availability of actions
2. **User Permissions**: Role-based access to actions
3. **Data Integrity**: Cascading updates between related entities
4. **Status Validation**: Proper status transitions
5. **Asset Management**: File handling and storage

## Filter Options

### Line Items Filters
- **Status**: Active, Paused, Completed, Draft
- **Type**: Display, Digital In-Store, Offline In-Store, Sponsored Products
- **Performance**: Based on metrics thresholds

### Creatives Filters
- **Status**: Draft, Pending, Approved, Rejected
- **Format**: Banner, Video, Digital Signage, Wobbler, etc.
- **Type**: Display, Digital In-Store, Offline In-Store, Sponsored Products

## Usage

This template is ideal for:
- Campaign management and monitoring
- Line item and creative oversight
- Campaign performance analysis
- Asset management and approval workflows
- Multi-entity relationship management

## Components Used

- AppLayout (navigation, user management, page header)
- CardWithTabs (tabbed interface)
- Card (content containers)
- Table (data display with actions)
- FilterBar (filtering and search)
- Badge (status indicators)
- Button (actions and navigation)
- DropdownMenu (action menus)
- FormSection (organized form layouts)
- Input (form inputs)
- DatePicker (date selection)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


export const CampaignDetails: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
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
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
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
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
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
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
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
                    { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString() },
                    { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString() },
                  ]}
                  data={lineItemData.filter(row => {
                    const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                    const placementMatch = placement.length === 0 || placement.includes(row.placement);
                    return statusMatch && placementMatch;
                  })}
                  rowKey={row => row.id}
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
  },
}; 