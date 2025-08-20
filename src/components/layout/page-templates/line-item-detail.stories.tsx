import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FormSection } from '../../ui/form-section';
import { Input } from '../../ui/input';
import { SearchInput } from '../../ui/search-input';
import { DatePicker } from '../../ui/date-picker';
import { Table } from '@/components/ui/table';
import { Button } from '../../ui/button';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { FilterBar } from '../../ui/filter-bar';
import { DialogFooter } from '../../ui/dialog';
import { Minus } from 'lucide-react';
import { format } from 'date-fns';
import { defaultRoutes } from '../default-routes';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Line Item Detail',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Line Item Detail Page Template

The Line Item Detail page template provides comprehensive forms for creating and editing line items across different campaign types. It features placement search, date pickers, creative linking, and real-time summary cards.

## Features

- **Multi-Variant Support**: Different forms for Display, Digital In-Store, Offline In-Store, and Sponsored Products
- **Placement Search**: SearchInput component with dropdown results for store/placement selection
- **Date Pickers**: DatePicker components for start and end date selection
- **Creative Linking**: Advanced dialog for linking line items to creatives with filtering and search
- **Real-time Summary**: Live sidebar updates showing line item, placement, and creative details
- **Responsive Design**: Two-column layout that adapts to screen size

## Form Structure

### Line Item Details Section
- **Name**: Required field for line item name

### Placement Section
- **Find Placement**: SearchInput with dropdown results
- **Search Results**: Shows store name, type, location, and category
- **Real-time Filtering**: Filters placements based on name and location

### Run Time Section
- **Campaign Runtime**: Displays preset campaign dates
- **Start Date**: DatePicker for line item start date
- **End Date**: DatePicker for line item end date
- **Date Validation**: Proper date handling with dd/MM/yyyy format

### Target Section
- **Targeting Criteria**: Interface for adding targeting parameters
- **Target Management**: Add and manage targeting rules

### Creatives Section
- **Link Dialog**: Advanced filtering by Format and Status
- **Search**: Real-time search across creative names
- **Management Table**: View and remove linked creatives
- **Row Actions**: Click to navigate to creative details

## Placement Search

The placement search provides:
- **Real-time Results**: Shows filtered placements as you type
- **Store Information**: Name, type, location, and category
- **Selection**: Click to select a placement
- **Visual Feedback**: Dropdown with proper styling

Example placement results:
- Albert Heijn Amsterdam Central (Store • Amsterdam • Grocery)
- Albert Heijn Rotterdam Center (Store • Rotterdam • Grocery)

## Date Management

- **DatePicker Integration**: Uses proper date picker components
- **Campaign Presets**: Shows campaign runtime as reference
- **Date Formatting**: Displays dates in dd/MM/yyyy format
- **Validation**: Ensures proper date selection

## Creative Linking

### Filter Options
- **Format**: Filter by creative format (Banner, Video, Digital Signage, etc.)
- **Status**: Filter by approval status (Approved, Pending, Draft, Rejected)

### Creative Management
- **Link Dialog**: Modal interface for creative selection
- **Search**: Real-time search across creative names
- **Removal**: Easy removal of linked creatives
- **Navigation**: Click creative rows to view details

## Variants

### Display Line Items
- Standard display advertising line items
- Focus on digital placements and targeting

### Digital In-Store Line Items
- In-store digital advertising line items
- Store-specific placement selection

### Offline In-Store Line Items
- Physical in-store advertising line items
- Store location and material placement

### Sponsored Products Line Items
- Product-specific advertising line items
- Product catalog integration

## Business Rules

1. **Name Required**: Line item name is mandatory
2. **Placement Selection**: Must select a placement for activation
3. **Date Validation**: Start date must be before end date
4. **Creative Linking**: Line items can be linked to multiple creatives
5. **Real-time Updates**: Sidebar updates immediately when form fields change

## Sidebar Information

### Line Item Summary
- Line item name
- Selected placement information
- Runtime dates (formatted)

### Creatives Summary
- Shows relationship between line item and creatives
- Displays creative names and formats
- Shows linked/unlinked status

### Campaign Details
- Campaign name, PO number, advertiser
- Brand, goal, budget, runtime

## Usage

This template is ideal for:
- Line item creation and editing
- Campaign planning and management
- Placement and targeting configuration
- Creative-line item relationship management

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- FormSection (organized form layouts)
- Input (text inputs)
- SearchInput (placement search with dropdown)
- DatePicker (date selection with calendar)
- Dialog (creative linking modal)
- FilterBar (advanced filtering in dialog)
- Table (creative management)
- Button (actions and navigation)
- CardSummary (sidebar information cards)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


// Mock data for creatives (opposite of line items)
const mockCreatives = [
  { id: 1, name: 'Summer Banner', format: 'Banner', status: 'Approved', type: 'Display' },
  { id: 2, name: 'Holiday Video', format: 'Video', status: 'Pending', type: 'Display' },
  { id: 3, name: 'Store Signage', format: 'Digital Signage', status: 'Approved', type: 'Digital In-Store' },
];

// Mock data for placement search results
const mockPlacements = [
  { id: 1, name: 'Albert Heijn Amsterdam Central', type: 'Store', location: 'Amsterdam', category: 'Grocery' },
  { id: 2, name: 'Albert Heijn Rotterdam Center', type: 'Store', location: 'Rotterdam', category: 'Grocery' },
  { id: 3, name: 'Albert Heijn Utrecht Main', type: 'Store', location: 'Utrecht', category: 'Grocery' },
  { id: 4, name: 'Albert Heijn Den Haag Plaza', type: 'Store', location: 'Den Haag', category: 'Grocery' },
  { id: 5, name: 'Albert Heijn Eindhoven Center', type: 'Store', location: 'Eindhoven', category: 'Grocery' },
];

// Shared component for campaign details sidebar
const CampaignDetailsSidebar = () => (
  <div className="flex flex-col gap-4">
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
);

// Shared component for creative linking dialog
const CreativeLinkingDialog = ({ selectedCreatives, onSelectionChange }: { 
  selectedCreatives: any[], 
  onSelectionChange: (items: any[]) => void 
}) => {
  const [formatFilter, setFormatFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  const [localSelection, setLocalSelection] = React.useState<any[]>(selectedCreatives);

  React.useEffect(() => {
    setLocalSelection(selectedCreatives);
  }, [selectedCreatives]);

  const formats = Array.from(new Set(mockCreatives.map(item => item.format)));
  const statuses = Array.from(new Set(mockCreatives.map(item => item.status)));

  const filteredCreatives = mockCreatives.filter(item => {
    const formatMatch = formatFilter.length === 0 || formatFilter.includes(item.format);
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(item.status);
    const searchMatch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
    return formatMatch && statusMatch && searchMatch;
  });

  const handleSave = () => {
    onSelectionChange(localSelection);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">Link creatives</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Link creatives</DialogTitle>
          <DialogDescription>Select creatives to link to this line item.</DialogDescription>
        </DialogHeader>
        
        <FilterBar
          filters={[
            {
              name: 'Format',
              options: formats.map(format => ({ label: format, value: format })),
              selectedValues: formatFilter,
              onChange: setFormatFilter,
            },
            {
              name: 'Status',
              options: statuses.map(status => ({ label: status, value: status })),
              selectedValues: statusFilter,
              onChange: setStatusFilter,
            },
          ]}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name"
        />
        
        <div className="overflow-x-auto">
          <Table
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'format', header: 'Format' },
              { key: 'status', header: 'Status' },
              { key: 'type', header: 'Type' },
            ]}
            data={filteredCreatives}
            rowKey={row => row.id}
            rowSelection={{
              selectedKeys: localSelection.map(row => row.id),
              onChange: (keys) => {
                setLocalSelection(filteredCreatives.filter(row => keys.includes(row.id)));
              },
              getKey: row => row.id,
            }}
            hideActions
          />
        </div>
        
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="button" onClick={handleSave}>Save</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Display Line Item Detail Story
export const Display: Story = {
  render: () => {
    const [lineItemName, setLineItemName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);

    // Filter placements based on search
    const filteredPlacements = mockPlacements.filter(placement => 
      placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase())
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch(placement.name);
      setShowPlacementResults(false);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{ 
          title: 'Line Item Detail - Display',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: null,
        }}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-w-0">
                  <Card className="min-w-0">
                    <CardHeader className="space-y-8">
                      <FormSection title="Line item details">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input 
                              value={lineItemName}
                              onChange={(e) => setLineItemName(e.target.value)}
                              placeholder="Enter line item name" 
                              className="w-full"
                            />
                          </div>
                        </div>
                      </FormSection>
                      
                      <FormSection title="Placement">
                        <div className="space-y-4 min-w-0">
                          <div className="relative">
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              placeholder="Search for placement..." 
                              className="w-full"
                            />
                            {showPlacementResults && filteredPlacements.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {placement.type} • {placement.location} • {placement.category}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">Start date*</label>
                              <DatePicker 
                                date={startDate}
                                onDateChange={setStartDate}
                                placeholder="Select start date" 
                                className="w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">End date*</label>
                              <DatePicker 
                                date={endDate}
                                onDateChange={setEndDate}
                                placeholder="Select end date" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Target">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground">
                            Add targeting criteria for this line item
                          </div>
                          <Button variant="outline" className="w-full">
                            Add target
                          </Button>
                        </div>
                      </FormSection>

                      <FormSection title="Creatives">
                        {selectedCreatives.length > 0 && (
                          <div className="mb-4 overflow-x-auto">
                            <Table
                              columns={[
                                {
                                  key: 'remove',
                                  header: '',
                                  render: (row) => (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setSelectedCreatives(selectedCreatives.filter(item => item.id !== row.id))}
                                      aria-label="Remove creative"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  ),
                                  className: 'w-10 text-center',
                                },
                                { key: 'name', header: 'Name' },
                                { key: 'format', header: 'Format' },
                                { key: 'status', header: 'Status' },
                                { key: 'type', header: 'Type' },
                              ]}
                              data={selectedCreatives}
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to creative details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <CreativeLinkingDialog 
                          selectedCreatives={selectedCreatives} 
                          onSelectionChange={setSelectedCreatives} 
                        />
                      </FormSection>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
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
                      <CardSummaryTitle>Line item</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {lineItemName && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Name</div>
                          <div className="font-medium">{lineItemName}</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Creatives</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockCreatives.map(creative => {
                        const isLinked = selectedCreatives.some(selected => selected.id === creative.id);
                        return (
                          <div key={creative.id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              <span className="font-medium">{creative.name}</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Line item: </span>
                              {isLinked ? (
                                <span className="font-medium">{lineItemName || 'Unnamed Line Item'}</span>
                              ) : (
                                <span className="text-muted-foreground">No line item</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  },
};

// Digital In-Store Line Item Detail Story
export const DigitalInStore: Story = {
  render: () => {
    const [lineItemName, setLineItemName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);

    // Filter placements based on search
    const filteredPlacements = mockPlacements.filter(placement => 
      placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase())
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch(placement.name);
      setShowPlacementResults(false);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{ 
          title: 'Line Item Detail - Digital In-Store',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: null,
        }}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-w-0">
                  <Card className="min-w-0">
                    <CardHeader className="space-y-8">
                      <FormSection title="Line item details">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input 
                              value={lineItemName}
                              onChange={(e) => setLineItemName(e.target.value)}
                              placeholder="Enter line item name" 
                              className="w-full"
                            />
                          </div>
                        </div>
                      </FormSection>
                      
                      <FormSection title="Placement">
                        <div className="space-y-4 min-w-0">
                          <div className="relative">
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              placeholder="Search for placement..." 
                              className="w-full"
                            />
                            {showPlacementResults && filteredPlacements.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {placement.type} • {placement.location} • {placement.category}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">Start date*</label>
                              <DatePicker 
                                date={startDate}
                                onDateChange={setStartDate}
                                placeholder="Select start date" 
                                className="w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">End date*</label>
                              <DatePicker 
                                date={endDate}
                                onDateChange={setEndDate}
                                placeholder="Select end date" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Target">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground">
                            Add targeting criteria for this line item
                          </div>
                          <Button variant="outline" className="w-full">
                            Add target
                          </Button>
                        </div>
                      </FormSection>

                      <FormSection title="Creatives">
                        {selectedCreatives.length > 0 && (
                          <div className="mb-4 overflow-x-auto">
                            <Table
                              columns={[
                                {
                                  key: 'remove',
                                  header: '',
                                  render: (row) => (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setSelectedCreatives(selectedCreatives.filter(item => item.id !== row.id))}
                                      aria-label="Remove creative"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  ),
                                  className: 'w-10 text-center',
                                },
                                { key: 'name', header: 'Name' },
                                { key: 'format', header: 'Format' },
                                { key: 'status', header: 'Status' },
                                { key: 'type', header: 'Type' },
                              ]}
                              data={selectedCreatives}
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to creative details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <CreativeLinkingDialog 
                          selectedCreatives={selectedCreatives} 
                          onSelectionChange={setSelectedCreatives} 
                        />
                      </FormSection>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
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
                      <CardSummaryTitle>Line item</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {lineItemName && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Name</div>
                          <div className="font-medium">{lineItemName}</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Creatives</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockCreatives.map(creative => {
                        const isLinked = selectedCreatives.some(selected => selected.id === creative.id);
                        return (
                          <div key={creative.id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              <span className="font-medium">{creative.name}</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Line item: </span>
                              {isLinked ? (
                                <span className="font-medium">{lineItemName || 'Unnamed Line Item'}</span>
                              ) : (
                                <span className="text-muted-foreground">No line item</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  },
};

// Offline In-Store Line Item Detail Story
export const OfflineInStore: Story = {
  render: () => {
    const [lineItemName, setLineItemName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);

    // Filter placements based on search
    const filteredPlacements = mockPlacements.filter(placement => 
      placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase())
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch(placement.name);
      setShowPlacementResults(false);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{ 
          title: 'Line Item Detail - Offline In-Store',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: null,
        }}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-w-0">
                  <Card className="min-w-0">
                    <CardHeader className="space-y-8">
                      <FormSection title="Line item details">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input 
                              value={lineItemName}
                              onChange={(e) => setLineItemName(e.target.value)}
                              placeholder="Enter line item name" 
                              className="w-full"
                            />
                          </div>
                        </div>
                      </FormSection>
                      
                      <FormSection title="Placement">
                        <div className="space-y-4 min-w-0">
                          <div className="relative">
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              placeholder="Search for placement..." 
                              className="w-full"
                            />
                            {showPlacementResults && filteredPlacements.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {placement.type} • {placement.location} • {placement.category}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">Start date*</label>
                              <DatePicker 
                                date={startDate}
                                onDateChange={setStartDate}
                                placeholder="Select start date" 
                                className="w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">End date*</label>
                              <DatePicker 
                                date={endDate}
                                onDateChange={setEndDate}
                                placeholder="Select end date" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Target">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground">
                            Add targeting criteria for this line item
                          </div>
                          <Button variant="outline" className="w-full">
                            Add target
                          </Button>
                        </div>
                      </FormSection>

                      <FormSection title="Creatives">
                        {selectedCreatives.length > 0 && (
                          <div className="mb-4 overflow-x-auto">
                            <Table
                              columns={[
                                {
                                  key: 'remove',
                                  header: '',
                                  render: (row) => (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setSelectedCreatives(selectedCreatives.filter(item => item.id !== row.id))}
                                      aria-label="Remove creative"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  ),
                                  className: 'w-10 text-center',
                                },
                                { key: 'name', header: 'Name' },
                                { key: 'format', header: 'Format' },
                                { key: 'status', header: 'Status' },
                                { key: 'type', header: 'Type' },
                              ]}
                              data={selectedCreatives}
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to creative details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <CreativeLinkingDialog 
                          selectedCreatives={selectedCreatives} 
                          onSelectionChange={setSelectedCreatives} 
                        />
                      </FormSection>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
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
                      <CardSummaryTitle>Line item</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {lineItemName && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Name</div>
                          <div className="font-medium">{lineItemName}</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Creatives</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockCreatives.map(creative => {
                        const isLinked = selectedCreatives.some(selected => selected.id === creative.id);
                        return (
                          <div key={creative.id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              <span className="font-medium">{creative.name}</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Line item: </span>
                              {isLinked ? (
                                <span className="font-medium">{lineItemName || 'Unnamed Line Item'}</span>
                              ) : (
                                <span className="text-muted-foreground">No line item</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  },
};

// Sponsored Products Line Item Detail Story
export const SponsoredProducts: Story = {
  render: () => {
    const [lineItemName, setLineItemName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);

    // Filter placements based on search
    const filteredPlacements = mockPlacements.filter(placement => 
      placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase())
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch(placement.name);
      setShowPlacementResults(false);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{ 
          title: 'Line Item Detail - Sponsored Products',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: null,
        }}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-w-0">
                  <Card className="min-w-0">
                    <CardHeader className="space-y-8">
                      <FormSection title="Line item details">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input 
                              value={lineItemName}
                              onChange={(e) => setLineItemName(e.target.value)}
                              placeholder="Enter line item name" 
                              className="w-full"
                            />
                          </div>
                        </div>
                      </FormSection>
                      
                      <FormSection title="Placement">
                        <div className="space-y-4 min-w-0">
                          <div className="relative">
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              placeholder="Search for placement..." 
                              className="w-full"
                            />
                            {showPlacementResults && filteredPlacements.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {placement.type} • {placement.location} • {placement.category}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">Start date*</label>
                              <DatePicker 
                                date={startDate}
                                onDateChange={setStartDate}
                                placeholder="Select start date" 
                                className="w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">End date*</label>
                              <DatePicker 
                                date={endDate}
                                onDateChange={setEndDate}
                                placeholder="Select end date" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Target">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground">
                            Add targeting criteria for this line item
                          </div>
                          <Button variant="outline" className="w-full">
                            Add target
                          </Button>
                        </div>
                      </FormSection>

                      <FormSection title="Creatives">
                        {selectedCreatives.length > 0 && (
                          <div className="mb-4 overflow-x-auto">
                            <Table
                              columns={[
                                {
                                  key: 'remove',
                                  header: '',
                                  render: (row) => (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setSelectedCreatives(selectedCreatives.filter(item => item.id !== row.id))}
                                      aria-label="Remove creative"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  ),
                                  className: 'w-10 text-center',
                                },
                                { key: 'name', header: 'Name' },
                                { key: 'format', header: 'Format' },
                                { key: 'status', header: 'Status' },
                                { key: 'type', header: 'Type' },
                              ]}
                              data={selectedCreatives}
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to creative details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <CreativeLinkingDialog 
                          selectedCreatives={selectedCreatives} 
                          onSelectionChange={setSelectedCreatives} 
                        />
                      </FormSection>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
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
                      <CardSummaryTitle>Line item</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {lineItemName && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Name</div>
                          <div className="font-medium">{lineItemName}</div>
                        </div>
                      )}
                      {placementSearch && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Placement</div>
                          <div className="font-medium">{placementSearch}</div>
                        </div>
                      )}
                      {(startDate || endDate) && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Runtime</div>
                          <div className="font-medium">
                            {startDate ? format(startDate, 'dd/MM/yyyy') : '?'} - {endDate ? format(endDate, 'dd/MM/yyyy') : '?'}
                          </div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Creatives</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockCreatives.map(creative => {
                        const isLinked = selectedCreatives.some(selected => selected.id === creative.id);
                        return (
                          <div key={creative.id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              <span className="font-medium">{creative.name}</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Line item: </span>
                              {isLinked ? (
                                <span className="font-medium">{lineItemName || 'Unnamed Line Item'}</span>
                              ) : (
                                <span className="text-muted-foreground">No line item</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  },
};
