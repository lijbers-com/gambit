import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FormSection } from '../../ui/form-section';
import { Input, FileInput } from '../../ui/input';
import { Table } from '@/components/ui/table';
import { Button } from '../../ui/button';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { FilterBar } from '../../ui/filter-bar';
import { DialogFooter } from '../../ui/dialog';
import { Minus } from 'lucide-react';
import { defaultRoutes } from '../default-routes';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Creative Detail',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Creative Detail Page Template

The Creative Detail page template provides comprehensive forms for creating and editing creative assets across different campaign types. It features dynamic form sections, line item linking, and real-time summary cards.

## Features

- **Multi-Variant Support**: Different forms for Display, Digital In-Store, and Offline In-Store creatives
- **Dynamic Form Sections**: Form fields change based on format selection
- **Line Item Linking**: Advanced dialog for linking creatives to line items with filtering and search
- **Real-time Summary**: Live sidebar updates showing creative and line item details
- **Format Requirements**: Contextual help for format specifications
- **Responsive Design**: Two-column layout that adapts to screen size

## Form Structure

### Creative Details Section
- **Name**: Required field for creative name
- **Format**: Required dropdown with format-specific options
- **Format Requirements**: Button to view format specifications

### Dynamic Settings Section
The settings section adapts based on selected format:

#### Display Creative Settings
- Header and CTA fields
- Text and background color options
- Banner image and transparent image file uploads (stacked vertically)

#### Digital In-Store Creative Settings
- Width and height dimensions
- Background video/image upload
- Duration and loop settings

#### Offline In-Store Creative Settings
- Single file upload for creative assets
- Supported formats: PDF, PNG, JPG, AI, EPS
- File size limit: 10MB

### Line Items Section
- **Link Dialog**: Advanced filtering by Brand and Product
- **Search**: Real-time search across line item names
- **Management Table**: View and remove linked line items
- **Row Actions**: Click to navigate to line item details

## Format Options

### Display Formats
- App homepage
- Banner
- Video
- Interstitial

### Digital In-Store Formats
- Digital Signage
- LED Display
- Interactive Kiosk
- Video Wall

### Offline In-Store Formats (Dutch Retail)
- Wobbler
- VSB
- Vloersticker
- Koeldeursticker
- Makelaarsbord
- Koeldeurvlag

## Business Rules

1. **Format Selection**: Must select a format before settings section appears
2. **Required Fields**: Name and Format are mandatory
3. **File Uploads**: Offline formats require single file upload
4. **Line Item Linking**: Creatives can be linked to multiple line items
5. **Real-time Updates**: Sidebar updates immediately when form fields change

## Sidebar Information

### Creative Summary
- Creative name
- Selected format
- Dimensions (for Digital In-Store)
- Duration (for Digital In-Store)
- File information (for Offline In-Store)

### Line Items Summary
- Shows relationship between creative and line items
- Displays "Line item: [Brand] [Store Count] stores"
- Shows "Creative: [Creative Name]" or "No creative"

### Campaign Details
- Campaign name, PO number, advertiser
- Brand, goal, budget, runtime

## Usage

This template is ideal for:
- Creative asset creation and editing
- Creative approval workflows
- Multi-format creative management
- Campaign-creative relationship management

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- FormSection (organized form layouts)
- Input (text inputs and dropdowns)
- FileInput (file upload with validation)
- Dialog (line item linking modal)
- FilterBar (advanced filtering in dialog)
- Table (line item management)
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


const mockLineItems = [
  { id: 1, name: 'Knorr 500 stores', brand: 'Knorr', start: '01/08/2024', end: '30/08/2024', stores: 500, product: 'Pakket M' },
  { id: 2, name: 'Unox 200 stores', brand: 'Unox', start: '05/08/2024', end: '20/08/2024', stores: 200, product: 'Pakket S' },
  { id: 3, name: 'Maggi 300 stores', brand: 'Maggi', start: '10/08/2024', end: '25/08/2024', stores: 300, product: 'Pakket L' },
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

// Shared component for line items dialog
const LineItemsDialog = ({ selectedLineItems, onSelectionChange }: { 
  selectedLineItems: any[], 
  onSelectionChange: (items: any[]) => void 
}) => {
  const [brandFilter, setBrandFilter] = React.useState<string[]>([]);
  const [productFilter, setProductFilter] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  const [localSelection, setLocalSelection] = React.useState<any[]>(selectedLineItems);

  React.useEffect(() => {
    setLocalSelection(selectedLineItems);
  }, [selectedLineItems]);

  const brands = Array.from(new Set(mockLineItems.map(item => item.brand)));
  const products = Array.from(new Set(mockLineItems.map(item => item.product)));

  const filteredLineItems = mockLineItems.filter(item => {
    const brandMatch = brandFilter.length === 0 || brandFilter.includes(item.brand);
    const productMatch = productFilter.length === 0 || productFilter.includes(item.product);
    const searchMatch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
    return brandMatch && productMatch && searchMatch;
  });

  const handleSave = () => {
    onSelectionChange(localSelection);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">Link line items</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Link line-items</DialogTitle>
          <DialogDescription>Select line-items to link to this creative.</DialogDescription>
        </DialogHeader>
        
        <FilterBar
          filters={[
            {
              name: 'Brand',
              options: brands.map(brand => ({ label: brand, value: brand })),
              selectedValues: brandFilter,
              onChange: setBrandFilter,
            },
            {
              name: 'Product',
              options: products.map(product => ({ label: product, value: product })),
              selectedValues: productFilter,
              onChange: setProductFilter,
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
              { key: 'brand', header: 'Brand' },
              { key: 'start', header: 'Start date' },
              { key: 'end', header: 'End date' },
              { key: 'stores', header: 'Stores' },
              { key: 'product', header: 'Product' },
            ]}
            data={filteredLineItems}
            rowKey={row => row.id}
            rowSelection={{
              selectedKeys: localSelection.map(row => row.id),
              onChange: (keys) => {
                setLocalSelection(filteredLineItems.filter(row => keys.includes(row.id)));
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

// Display Creative Detail Story
export const Display: Story = {
  render: () => {
    const [creativeName, setCreativeName] = React.useState('');
    const [creativeFormat, setCreativeFormat] = React.useState('');
    const [selectedLineItems, setSelectedLineItems] = React.useState<any[]>([]);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{ 
          title: 'Creative Detail - Display',
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
                      <FormSection title="Creative details">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input 
                              value={creativeName}
                              onChange={(e) => setCreativeName(e.target.value)}
                              placeholder="Enter creative name" 
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Format*</label>
                            <Input 
                              dropdown
                              options={[
                                { label: 'App homepage', value: 'app-homepage' },
                                { label: 'Banner', value: 'banner' },
                                { label: 'Video', value: 'video' },
                                { label: 'Interstitial', value: 'interstitial' },
                              ]}
                              value={creativeFormat}
                              onChange={setCreativeFormat}
                              placeholder="Select format"
                              className="w-full"
                            />
                            <Button variant="outline" className="mt-4" onClick={() => console.log('Show format requirements')}>
                              See format requirements
                            </Button>
                          </div>
                        </div>
                      </FormSection>
                      
                      {creativeFormat && (
                        <FormSection title={`${creativeFormat.charAt(0).toUpperCase() + creativeFormat.slice(1).replace(/-/g, ' ')} settings`}>
                          <div className="space-y-4 min-w-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                              <div className="min-w-0">
                                <label className="block text-sm font-medium mb-2">Header*</label>
                                <Input placeholder="Header" />
                              </div>
                              <div className="min-w-0">
                                <label className="block text-sm font-medium mb-2">CTA*</label>
                                <Input placeholder="CTA" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                              <div className="min-w-0">
                                <label className="block text-sm font-medium mb-2">Text colour*</label>
                                <Input placeholder="White (default)" />
                              </div>
                              <div className="min-w-0">
                                <label className="block text-sm font-medium mb-2">Background colour*</label>
                                <Input placeholder="Black (default)" />
                              </div>
                            </div>
                            <div className="space-y-4 min-w-0">
                              <div className="min-w-0">
                                <FileInput label="Banner image" className="w-full" />
                              </div>
                              <div className="min-w-0">
                                <FileInput label="Transparent image" className="w-full" />
                              </div>
                            </div>
                          </div>
                        </FormSection>
                      )}

                      <FormSection title="Line items">
                        {selectedLineItems.length > 0 && (
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
                                      onClick={() => setSelectedLineItems(selectedLineItems.filter(item => item.id !== row.id))}
                                      aria-label="Remove line-item"
                                    >
                                      <Minus className="h-4 w-4" />
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
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to line-item details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <LineItemsDialog 
                          selectedLineItems={selectedLineItems} 
                          onSelectionChange={setSelectedLineItems} 
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
                      <CardSummaryTitle>Creative</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {creativeName && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Name</div>
                          <div className="font-medium">{creativeName}</div>
                        </div>
                      )}
                      {creativeFormat && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Format</div>
                          <div className="font-medium">{creativeFormat}</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Line items</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockLineItems.map(item => {
                        const isLinked = selectedLineItems.some(selected => selected.id === item.id);
                        return (
                          <div key={item.id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Line item: </span>
                              <span className="font-medium">{item.brand} {item.stores} stores</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              {isLinked ? (
                                <span className="font-medium">{creativeName || 'Unnamed Creative'}</span>
                              ) : (
                                <span className="text-muted-foreground">No creative</span>
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


// Digital In-Store Creative Detail Story
export const DigitalInStore: Story = {
  render: () => {
    const [creativeName, setCreativeName] = React.useState('');
    const [creativeFormat, setCreativeFormat] = React.useState('');
    const [displayFormat, setDisplayFormat] = React.useState('');
    const [width, setWidth] = React.useState('');
    const [height, setHeight] = React.useState('');
    const [duration, setDuration] = React.useState('');
    const [selectedLineItems, setSelectedLineItems] = React.useState<any[]>([]);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{ 
          title: 'Creative Detail - Digital In-Store',
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
                      <FormSection title="Creative details">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input 
                              value={creativeName}
                              onChange={(e) => setCreativeName(e.target.value)}
                              placeholder="Enter creative name" 
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Format*</label>
                            <Input 
                              dropdown
                              options={[
                                { label: 'Digital Signage', value: 'digital-signage' },
                                { label: 'LED Display', value: 'led-display' },
                                { label: 'Interactive Kiosk', value: 'interactive-kiosk' },
                                { label: 'Video Wall', value: 'video-wall' },
                              ]}
                              value={creativeFormat}
                              onChange={setCreativeFormat}
                              placeholder="Select format"
                              className="w-full"
                            />
                            <Button variant="outline" className="mt-4" onClick={() => console.log('Show format requirements')}>
                              See format requirements
                            </Button>
                          </div>
                        </div>
                      </FormSection>
                      
                      {creativeFormat && (
                        <FormSection title={`${creativeFormat.charAt(0).toUpperCase() + creativeFormat.slice(1).replace(/-/g, ' ')} settings`}>
                          <div className="space-y-4 min-w-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                              <div>
                                <label className="block text-sm font-medium mb-2">Width (px)*</label>
                                <Input 
                                  value={width}
                                  onChange={(e) => setWidth(e.target.value)}
                                  placeholder="1920" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Height (px)*</label>
                                <Input 
                                  value={height}
                                  onChange={(e) => setHeight(e.target.value)}
                                  placeholder="1080" 
                                />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <FileInput label="Background Video/Image*" className="w-full" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                              <div>
                                <label className="block text-sm font-medium mb-2">Duration (seconds)*</label>
                                <Input 
                                  value={duration}
                                  onChange={(e) => setDuration(e.target.value)}
                                  placeholder="30" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Loop</label>
                                <Input placeholder="Yes" />
                              </div>
                            </div>
                          </div>
                        </FormSection>
                      )}

                      <FormSection title="Line items">
                        {selectedLineItems.length > 0 && (
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
                                      onClick={() => setSelectedLineItems(selectedLineItems.filter(item => item.id !== row.id))}
                                      aria-label="Remove line-item"
                                    >
                                      <Minus className="h-4 w-4" />
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
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to line-item details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <LineItemsDialog 
                          selectedLineItems={selectedLineItems} 
                          onSelectionChange={setSelectedLineItems} 
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
                      <CardSummaryTitle>Creative</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {creativeName && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Name</div>
                          <div className="font-medium">{creativeName}</div>
                        </div>
                      )}
                      {displayFormat && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Display Format</div>
                          <div className="font-medium">{displayFormat}</div>
                        </div>
                      )}
                      {(width || height) && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Dimensions</div>
                          <div className="font-medium">{width || '?'} x {height || '?'} px</div>
                        </div>
                      )}
                      {duration && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Duration</div>
                          <div className="font-medium">{duration}s</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Line items</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockLineItems.map(item => {
                        const isLinked = selectedLineItems.some(selected => selected.id === item.id);
                        return (
                          <div key={item.id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Line item: </span>
                              <span className="font-medium">{item.brand} {item.stores} stores</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              {isLinked ? (
                                <span className="font-medium">{creativeName || 'Unnamed Creative'}</span>
                              ) : (
                                <span className="text-muted-foreground">No creative</span>
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

// Offline In-Store Creative Detail Story
export const OfflineInStore: Story = {
  render: () => {
    const [creativeName, setCreativeName] = React.useState('');
    const [creativeFormat, setCreativeFormat] = React.useState('');
    const [creativeType, setCreativeType] = React.useState('');
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [selectedLineItems, setSelectedLineItems] = React.useState<any[]>([]);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{ 
          title: 'Creative Detail - Offline In-Store',
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
                      <FormSection title="Creative details">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input 
                              value={creativeName}
                              onChange={(e) => setCreativeName(e.target.value)}
                              placeholder="Enter creative name" 
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Format*</label>
                            <Input 
                              dropdown
                              options={[
                                { label: 'Wobbler', value: 'wobbler' },
                                { label: 'VSB', value: 'vsb' },
                                { label: 'Vloersticker', value: 'vloersticker' },
                                { label: 'Koeldeursticker', value: 'koeldeursticker' },
                                { label: 'Makelaarsbord', value: 'makelaarsbord' },
                                { label: 'Koeldeurvlag', value: 'koeldeurvlag' },
                              ]}
                              value={creativeFormat}
                              onChange={setCreativeFormat}
                              placeholder="Select format"
                              className="w-full"
                            />
                            <Button variant="outline" className="mt-4" onClick={() => console.log('Show format requirements')}>
                              See format requirements
                            </Button>
                          </div>
                        </div>
                      </FormSection>
                      
                      {creativeFormat && (
                        <FormSection title={`${creativeFormat.charAt(0).toUpperCase() + creativeFormat.slice(1).replace(/-/g, ' ')} settings`}>
                          <div>
                            <FileInput 
                              label="Upload creative file" 
                              hint="Supported formats: PDF, PNG, JPG, AI, EPS. Max file size: 10MB"
                              className="w-full" 
                              onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                            />
                          </div>
                        </FormSection>
                      )}

                      <FormSection title="Line items">
                        {selectedLineItems.length > 0 && (
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
                                      onClick={() => setSelectedLineItems(selectedLineItems.filter(item => item.id !== row.id))}
                                      aria-label="Remove line-item"
                                    >
                                      <Minus className="h-4 w-4" />
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
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to line-item details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <LineItemsDialog 
                          selectedLineItems={selectedLineItems} 
                          onSelectionChange={setSelectedLineItems} 
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
                      {mockLineItems.map(item => {
                        const isLinked = selectedLineItems.some(selected => selected.id === item.id);
                        return (
                          <div key={item.id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Line item: </span>
                              <span className="font-medium">{item.brand} {item.stores} stores</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              {isLinked ? (
                                <span className="font-medium">{creativeName || 'Unnamed Creative'}</span>
                              ) : (
                                <span className="text-muted-foreground">No creative</span>
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