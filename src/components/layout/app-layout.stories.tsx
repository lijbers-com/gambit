import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { FilterBar } from '@/components/ui/filter-bar';
import { useState } from 'react';
import { CardWithTabs } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { DatePicker } from '../ui/date-picker';
import { FormSection } from '../ui/form-section';
import { Input, FileInput } from '../ui/input';
import { useRef } from 'react';
import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Minus } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page Templates/AppLayout',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockRoutes = [
  { 
    id: 1, 
    name: 'Campaigns', 
    type: 'parent' as const, 
    icon: { lucide: 'Table' }, 
    subitems: [
      { id: 11, name: 'Display', url: '/campaigns/display' },
      { id: 12, name: 'Sponsored products', url: '/campaigns/sponsored-products' },
      { id: 13, name: 'Digital in-store', url: '/campaigns/digital-in-store' },
      { id: 14, name: 'Offline in-store', url: '/campaigns/offline-in-store' },
    ] 
  },
  { 
    id: 2, 
    name: 'Creatives', 
    type: 'parent' as const, 
    icon: { lucide: 'ImagePlus' }, 
    subitems: [
      { id: 21, name: 'Display', url: '/creatives/display' },
      { id: 22, name: 'Sponsored products', url: '/creatives/sponsored-products' },
      { id: 23, name: 'Digital in-store', url: '/creatives/digital-in-store' },
      { id: 24, name: 'Offline in-store', url: '/creatives/offline-in-store' },
    ] 
  },
  { 
    id: 3, 
    name: 'Calendar', 
    type: 'parent' as const, 
    icon: { lucide: 'CalendarDays' }, 
    subitems: [
      { id: 31, name: 'Display', url: '/calendar/display' },
      { id: 32, name: 'Sponsored products', url: '/calendar/sponsored-products' },
      { id: 33, name: 'Digital in-store', url: '/calendar/digital-in-store' },
      { id: 34, name: 'Offline in-store', url: '/calendar/offline-in-store' },
    ] 
  },
  { 
    id: 4, 
    name: 'Performance', 
    type: 'parent' as const, 
    icon: { lucide: 'ChartNoAxesColumn' }, 
    subitems: [
      { id: 41, name: 'Display', url: '/performance/display' },
      { id: 42, name: 'Sponsored products', url: '/performance/sponsored-products' },
      { id: 43, name: 'Digital in-store', url: '/performance/digital-in-store' },
      { id: 44, name: 'Offline in-store', url: '/performance/offline-in-store' },
    ] 
  },
  { 
    id: 5, 
    name: 'Yield', 
    url: '/yield', 
    icon: { lucide: 'TrendingUp' } 
  },
];

const campaignData = [
  {
    id: 'C-001',
    status: 'Running',
    advertiser: 'Acme Media',
    name: 'Holiday Sale',
    lineItems: 5,
    creatives: 3,
    start: '2024-06-01',
    end: '2024-06-30',
  },
  {
    id: 'C-002',
    status: 'Ready',
    advertiser: 'BrandX',
    name: 'Summer Launch',
    lineItems: 2,
    creatives: 1,
    start: '2024-07-01',
    end: '2024-07-31',
  },
  {
    id: 'C-003',
    status: 'In option',
    advertiser: 'MediaWorks',
    name: 'Back to School',
    lineItems: 4,
    creatives: 2,
    start: '2024-08-10',
    end: '2024-09-10',
  },
  {
    id: 'C-004',
    status: 'Paused',
    advertiser: 'AdPartners',
    name: 'Black Friday',
    lineItems: 6,
    creatives: 4,
    start: '2024-11-01',
    end: '2024-11-30',
  },
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

export const Default: Story = {
  args: {
    routes: mockRoutes,
    logo: { src: '/next.svg', alt: 'Logo', width: 40, height: 40 },
    user: { name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' },
    onLogout: () => alert('Logout clicked'),
    breadcrumbProps: {},
    pageHeaderProps: {
      title: 'Offline media in-store',
      subtitle: 'Manage your offline media campaigns and performance',
      onEdit: () => alert('Edit clicked'),
      onExport: () => alert('Export clicked'),
      onImport: () => alert('Import clicked'),
      onSettings: () => alert('Settings clicked'),
    },
    children: (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Page Content Area</CardTitle>
          <CardDescription>
            This is where your page content will go.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Content area ready for your components */}
        </CardContent>
      </Card>
    ),
  },
}; 

export const CampaignOverview: Story = {
  render: () => {
    const [status, setStatus] = useState<string[]>([]);
    const [advertiser, setAdvertiser] = useState<string[]>([]);
    // Filter logic for the table
    const filteredCampaignData = campaignData.filter(row => {
      const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
      const advertiserMatch = advertiser.length === 0 || advertiser.includes(row.advertiser.toLowerCase().replace(/ /g, '-'));
      return statusMatch && advertiserMatch;
    });
    return (
      <AppLayout
        routes={mockRoutes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'Campaign Overview',
          subtitle: 'Monitor campaign performance and manage your advertising initiatives',
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
          <CardContent>
            <Table
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'status', header: 'Status', render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                { key: 'advertiser', header: 'Advertiser' },
                { key: 'name', header: 'Name' },
                { key: 'lineItems', header: 'Line items', render: row => <Badge variant="secondary">{row.lineItems}</Badge> },
                { key: 'creatives', header: 'Creatives', render: row => <Badge variant="secondary">{row.creatives}</Badge> },
                { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString() },
                { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString() },
              ]}
              data={filteredCampaignData}
              rowKey={row => row.id}
            />
          </CardContent>
        </Card>
      </AppLayout>
    );
  },
};

export const CampaignDetails: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    // Example data for creatives and line-items
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
        case 'Rejected': return 'error';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'default';
        case 'Paused': return 'warning';
        case 'Stopped': return 'error';
        case 'Ready': return 'success';
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
        routes={mockRoutes}
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

export const CreativeDetail: Story = {
  render: () => {
    // State for form fields
    const [creativeName, setCreativeName] = useState('');
    const [creativeType, setCreativeType] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Simulate selectable line items
    const allLineItems = [
      { name: 'Knorr 500 stores', brand: 'Knorr', start: '01/08/2024', end: '30/08/2024', stores: 500, product: 'Pakket M' },
      { name: 'Unox 200 stores', brand: 'Unox', start: '05/08/2024', end: '20/08/2024', stores: 200, product: 'Pakket S' },
    ];
    const [selectedLineItems, setSelectedLineItems] = useState<any[]>([]);
    return (
      <AppLayout
        routes={mockRoutes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'New creative',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main form area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-col gap-6">
                <FormSection title="Creative details">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Name*</label>
                    <Input value={creativeName} onChange={e => setCreativeName(e.target.value)} placeholder="Enter creative name" />
                  </div>
                </FormSection>
                <FormSection title="Creative settings">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Input
                      dropdown
                      options={[
                        { label: 'Wobbler', value: 'wobbler' },
                        { label: 'Banner', value: 'banner' },
                        { label: 'Poster', value: 'poster' },
                      ]}
                      value={creativeType}
                      onChange={setCreativeType}
                      placeholder="Select type"
                    />
                  </div>
                  <div className="w-full">
                    <FileInput
                      label="File"
                      hint="You can upload PNG, JPG, or GIF files. Max size: 5MB."
                      className="w-full"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        setFileName(file ? file.name : null);
                      }}
                    />
                  </div>
                </FormSection>
                <FormSection title="Line items">
                  {selectedLineItems.length > 0 && (
                    <div className="mt-4">
                      <Table
                        columns={[
                          {
                            key: 'remove',
                            header: '',
                            render: (row) => (
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setSelectedLineItems(selectedLineItems.filter(item => item.name !== row.name))}
                                aria-label="Remove line-item"
                              >
                                <Minus />
                              </Button>
                            ),
                            className: 'w-10 text-center',
                          },
                          { key: 'name', header: 'Name' },
                          { key: 'brand', header: 'Brand' },
                          { key: 'start', header: 'Start date' },
                          { key: 'end', header: 'End date' },
                          { key: 'stores', header: 'Stores' },
                          { key: 'product', header: 'Product' },
                        ]}
                        data={selectedLineItems}
                        rowKey={row => row.name}
                        hideActions
                        rowClassName={() => 'cursor-pointer'}
                        onRowClick={row => {
                          // TODO: Navigate to line-item details page
                          console.log('Go to line-item details for', row.name);
                        }}
                      />
                    </div>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-4">Link line-items</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Link line-items</DialogTitle>
                        <DialogDescription>Select line-items to link to this creative.</DialogDescription>
                      </DialogHeader>
                      {(() => {
                        // Filtering state for dialog
                        const [brandFilter, setBrandFilter] = React.useState<string[]>([]);
                        const [productFilter, setProductFilter] = React.useState<string[]>([]);
                        const [search, setSearch] = React.useState('');
                        // Local selection state for dialog
                        const [localSelection, setLocalSelection] = React.useState<any[]>(selectedLineItems);
                        React.useEffect(() => { setLocalSelection(selectedLineItems); }, [selectedLineItems]);
                        // Unique brands and products for filter options
                        const brands = Array.from(new Set(allLineItems.map(i => i.brand)));
                        const products = Array.from(new Set(allLineItems.map(i => i.product)));
                        // Filtered data
                        const filteredLineItems = allLineItems.filter(item => {
                          const brandMatch = brandFilter.length === 0 || brandFilter.includes(item.brand);
                          const productMatch = productFilter.length === 0 || productFilter.includes(item.product);
                          const searchMatch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
                          return brandMatch && productMatch && searchMatch;
                        });
                        // Checkbox header logic
                        const allVisibleSelected = filteredLineItems.length > 0 && filteredLineItems.every(row => localSelection.some(li => li.name === row.name));
                        const someVisibleSelected = filteredLineItems.some(row => localSelection.some(li => li.name === row.name));
                        return <>
                          <FilterBar
                            filters={[
                              {
                                name: 'Brand',
                                options: brands.map(b => ({ label: b, value: b })),
                                selectedValues: brandFilter,
                                onChange: setBrandFilter,
                              },
                              {
                                name: 'Product',
                                options: products.map(p => ({ label: p, value: p })),
                                selectedValues: productFilter,
                                onChange: setProductFilter,
                              },
                            ]}
                            searchValue={search}
                            onSearchChange={setSearch}
                            searchPlaceholder="Search by name"
                          />
                          <Table
                            columns={[
                              { key: 'name', header: 'Name' },
                              { key: 'brand', header: 'Brand' },
                              { key: 'start', header: 'Start date' },
                              { key: 'end', header: 'End date' },
                              { key: 'stores', header: 'Stores' },
                              { key: 'product', header: 'Product' },
                            ]}
                            data={filteredLineItems}
                            rowKey={row => row.name}
                            rowSelection={{
                              selectedKeys: localSelection.map(row => row.name),
                              onChange: (keys) => {
                                setLocalSelection(filteredLineItems.filter(row => keys.includes(row.name)));
                              },
                              getKey: row => row.name,
                            }}
                            hideActions
                          />
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button type="button" onClick={() => setSelectedLineItems(localSelection)}>Save</Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </>;
                      })()}
                    </DialogContent>
                  </Dialog>
                </FormSection>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit for approval</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <CardSummary>
              <CardHeader>
                <CardSummaryTitle>Creative</CardSummaryTitle>
              </CardHeader>
              <CardSummaryContent>
                {creativeName && (
                  <div className="mb-2">
                    <div className="text-[14px] text-muted-foreground">Name</div>
                    <div className="font-medium">{creativeName}</div>
                  </div>
                )}
                {creativeType && (
                  <div className="mb-2">
                    <div className="text-[14px] text-muted-foreground">Type</div>
                    <div className="font-medium">{creativeType.charAt(0).toUpperCase() + creativeType.slice(1)}</div>
                  </div>
                )}
                {fileName && (
                  <div className="mb-2">
                    <div className="text-[14px] text-muted-foreground">File</div>
                    <div className="font-medium">{fileName}</div>
                  </div>
                )}
              </CardSummaryContent>
            </CardSummary>
            <CardSummary>
              <CardHeader>
                <CardSummaryTitle>Line items</CardSummaryTitle>
              </CardHeader>
              <CardSummaryContent>
                {selectedLineItems.length === 0 ? null : (
                  selectedLineItems.map(item => (
                    <div key={item.name} className="mb-2">
                      <div className="text-[14px] text-muted-foreground">Line item:</div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                  ))
                )}
              </CardSummaryContent>
            </CardSummary>
            <CardSummary>
              <CardHeader>
                <CardSummaryTitle>Campaign details</CardSummaryTitle>
              </CardHeader>
              <CardSummaryContent>
                <div className="mb-2">
                  <div className="text-[14px] text-muted-foreground">Campaign name</div>
                  <div className="font-medium">Campaign AH ..</div>
                </div>
                <div className="mb-2">
                  <div className="text-[14px] text-muted-foreground">PO Number</div>
                  <div className="font-medium">PO-123456</div>
                </div>
                <div className="mb-2">
                  <div className="text-[14px] text-muted-foreground">Advertiser</div>
                  <div className="font-medium">Acme Media</div>
                </div>
                <div className="mb-2">
                  <div className="text-[14px] text-muted-foreground">Brand</div>
                  <div className="font-medium">Knorr</div>
                </div>
                <div className="mb-2">
                  <div className="text-[14px] text-muted-foreground">Goal</div>
                  <div className="font-medium">Awareness</div>
                </div>
                <div className="mb-2">
                  <div className="text-[14px] text-muted-foreground">Budget</div>
                  <div className="font-medium">€10,000</div>
                </div>
                <div>
                  <div className="text-[14px] text-muted-foreground">Runtime</div>
                  <div className="font-medium">01 Aug, 2024 - 30 Aug, 2024</div>
                </div>
              </CardSummaryContent>
            </CardSummary>
          </div>
        </div>
      </AppLayout>
    );
  },
};

 