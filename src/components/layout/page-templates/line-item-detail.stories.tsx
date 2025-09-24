import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FormSection } from '../../ui/form-section';
import { Input } from '../../ui/input';
import { SearchInput } from '../../ui/search-input';
import { DatePicker } from '../../ui/date-picker';
import { Table } from '@/components/ui/table';
import { Button } from '../../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { FilterBar } from '../../ui/filter-bar';
import { Filter } from '../../ui/filter';
import { DialogFooter } from '../../ui/dialog';
import { Minus, Store, ScanBarcode, LayoutDashboard, Calendar, MapPin, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { defaultRoutes } from '../default-routes';
import { CalendarTable } from '../../ui/calendar-table';

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

// Mock data for placement search results - 3 packages per zone
const zones = [
  'No zone',
  'Zuivel',
  'Vers',
  'Vlees & Vega',
  'Diepvries',
  'Worldfoods',
  'Maaltijdtoevoegingen',
  'Noten, toast, chips etc.',
  'Zoetwaren',
  'Ontbijt',
  'Non Food',
  'To Go'
];

const packages = ['Small', 'Medium', 'Large'];

const adSpaces = {
  'Small': 'Wobbler',
  'Medium': 'Wobbler, VSB (mini & large), Vloersticker, Koeldeursticker, Makelaarsbord',
  'Large': 'Wobbler, VSB (mini & large), Vloersticker, Koeldeursticker, Makelaarsbord'
};

const mockPlacements = zones.flatMap((zone, zoneIndex) => 
  packages.map((pkg, pkgIndex) => ({
    id: zoneIndex * 3 + pkgIndex + 1,
    name: `${zone} - ${pkg} Package`,
    type: pkg,
    location: zone,
    category: 'In-Store Placement',
    adSpaces: adSpaces[pkg as keyof typeof adSpaces]
  }))
);

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
    // Location options for targeting
    const locationOptions = [
      { label: 'Amsterdam', value: 'amsterdam' },
      { label: 'Rotterdam', value: 'rotterdam' },
      { label: 'Den Haag', value: 'den-haag' },
      { label: 'Utrecht', value: 'utrecht' },
      { label: 'Eindhoven', value: 'eindhoven' }
    ];
    const [lineItemName, setLineItemName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [storeAmount, setStoreAmount] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedStoreTypes, setSelectedStoreTypes] = React.useState<string[]>([]);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
    const [selectedInventory] = React.useState<string[]>([]); // Added to fix undefined reference

    // Retail products data
    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
      { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
      { id: '612816', name: 'Nike - air max 270 - size 42' },
      { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: 'Ben & Jerry\'s - cookie dough - 465ml' },
    ];

    // Target filter options (empty for non-OfflineInStore stories)
    const storeTypeOptions = [
      { label: 'AH XL', value: 'ah-xl' },
      { label: 'AH DNAH', value: 'ah-dnah' }
    ];


    const audienceOptions = [
      { label: 'Matig Stedelijk', value: 'matig-stedelijk' },
      { label: 'Zeer Stedelijk', value: 'zeer-stedelijk' },
      { label: 'Young adult', value: 'young-adult' },
      { label: 'Family with Kids', value: 'family-with-kids' },
      { label: 'Convenience stores', value: 'convenience-stores' },
      { label: 'Traditional stores', value: 'traditional-stores' }
    ];

    // Filter retail products based on search
    const filteredRetailProducts = retailProducts.filter(product => 
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    // Handle retail product selection
    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    // Handle retail product search change
    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    // Remove retail product
    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Calculate estimated reach based on store amount (average reach per store: ~65)
    const calculateReach = (stores: string) => {
      const numStores = parseInt(stores);
      if (isNaN(numStores) || numStores <= 0) return 0;
      return Math.round(numStores * 65);
    };

    // Filter placements based on search and exclude already selected one
    const filteredPlacements = mockPlacements.filter(placement => 
      (placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.type.toLowerCase().includes(placementSearch.toLowerCase())) &&
      (!selectedPlacement || selectedPlacement.id !== placement.id)
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch('');
      setShowPlacementResults(false);
    };

    // Remove placement
    const removePlacement = () => {
      setSelectedPlacement(null);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    // Handle placement input click
    const handlePlacementClick = () => {
      setShowPlacementResults(true);
    };

    // Handle retail product input click
    const handleRetailProductClick = () => {
      setShowRetailProductResults(true);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowPlacementResults(false);
          setShowRetailProductResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <MenuContextProvider>
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
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              onClick={handlePlacementClick}
                              placeholder="Search for placement..." 
                              className="w-full"
                              icon={<LayoutDashboard className="w-4 h-4" />}
                            />
                            {showPlacementResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.length > 0 ? (
                                  filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {placement.adSpaces}
                                    </div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No placements found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {selectedPlacement && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected placement:</div>
                              <div className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                <div>
                                  <div className="text-sm font-medium">{selectedPlacement.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {selectedPlacement.adSpaces}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={removePlacement}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            {selectedPlacement 
                              ? 'Placement selected for this line item'
                              : 'Search and select a placement for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
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
                          <div className="text-sm text-muted-foreground">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Retail products">
                        <div className="space-y-4">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Select retail products*</label>
                            <SearchInput 
                              value={retailProductSearch}
                              onChange={handleRetailProductSearchChange}
                              onClick={handleRetailProductClick}
                              placeholder="Select product by name or ID..." 
                              className="w-full"
                              icon={<ScanBarcode className="w-4 h-4" />}
                            />
                            {showRetailProductResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredRetailProducts.length > 0 ? (
                                  filteredRetailProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handleRetailProductSelect(product)}
                                  >
                                    <div className="font-medium text-sm">{product.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {selectedRetailProducts.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected products:</div>
                              <div className="space-y-1">
                                {selectedRetailProducts.map(productId => {
                                  const product = retailProducts.find(p => p.id === productId);
                                  return product ? (
                                    <div key={productId} className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                      <div>
                                        <div className="text-sm font-medium">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => removeRetailProduct(productId)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            {selectedRetailProducts.length > 0 
                              ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                              : 'Search and select retail products to target for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Store targets">
                        <div className="space-y-4 min-w-0">
                          <div className="flex gap-3">
                            <Filter
                              name="Location"
                              options={locationOptions}
                              selectedValues={selectedLocations}
                              onChange={setSelectedLocations}
                            />
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                            />
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Stores">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of stores*</label>
                            <div className="relative" data-dropdown-container>
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Store className="w-4 h-4" />
                              </span>
                              <Input 
                                type="number"
                                value={storeAmount}
                                onChange={(e) => setStoreAmount(e.target.value)}
                                placeholder="Enter number of stores" 
                                className="w-full pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 0
                              ? `This will generate ${calculateReach(storeAmount).toLocaleString()} reach`
                              : 'Specify how many stores this line item will target'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Target">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Add targeting criteria for this line item
                          </div>
                          <div className="flex gap-3">
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                              className="flex-1"
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                              className="flex-1"
                            />
                          </div>
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
                      {selectedPlacement && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Placement</div>
                          <div className="font-medium">{selectedPlacement.name}</div>
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
                      {selectedRetailProducts.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Retail products</div>
                          <div className="font-medium">{selectedRetailProducts.length} selected</div>
                        </div>
                      )}
                      {storeAmount && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Stores</div>
                          <div className="font-medium">{storeAmount} stores</div>
                        </div>
                      )}
                      {selectedStoreTypes.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Store types</div>
                          <div className="font-medium">{selectedStoreTypes.length} selected</div>
                        </div>
                      )}
                      {selectedAudiences.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Audiences</div>
                          <div className="font-medium">{selectedAudiences.length} selected</div>
                        </div>
                      )}
                      {selectedInventory.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Inventory</div>
                          <div className="font-medium">{selectedInventory.length} selected</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  {/* Creatives section - hidden for now, can be brought back later
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
                  */}
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Digital In-Store Line Item Detail Story
export const DigitalInStore: Story = {
  render: () => {
    // Location options for targeting
    const locationOptions = [
      { label: 'Amsterdam', value: 'amsterdam' },
      { label: 'Rotterdam', value: 'rotterdam' },
      { label: 'Den Haag', value: 'den-haag' },
      { label: 'Utrecht', value: 'utrecht' },
      { label: 'Eindhoven', value: 'eindhoven' }
    ];
    const [lineItemName, setLineItemName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [storeAmount, setStoreAmount] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedStoreTypes, setSelectedStoreTypes] = React.useState<string[]>([]);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
    const [selectedInventory] = React.useState<string[]>([]); // Added to fix undefined reference

    // Retail products data
    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
      { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
      { id: '612816', name: 'Nike - air max 270 - size 42' },
      { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: 'Ben & Jerry\'s - cookie dough - 465ml' },
    ];

    // Target filter options (empty for non-OfflineInStore stories)
    const storeTypeOptions = [
      { label: 'AH XL', value: 'ah-xl' },
      { label: 'AH DNAH', value: 'ah-dnah' }
    ];


    const audienceOptions = [
      { label: 'Matig Stedelijk', value: 'matig-stedelijk' },
      { label: 'Zeer Stedelijk', value: 'zeer-stedelijk' },
      { label: 'Young adult', value: 'young-adult' },
      { label: 'Family with Kids', value: 'family-with-kids' },
      { label: 'Convenience stores', value: 'convenience-stores' },
      { label: 'Traditional stores', value: 'traditional-stores' }
    ];

    // Filter retail products based on search
    const filteredRetailProducts = retailProducts.filter(product => 
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    // Handle retail product selection
    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    // Handle retail product search change
    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    // Remove retail product
    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Calculate estimated reach based on store amount (average reach per store: ~65)
    const calculateReach = (stores: string) => {
      const numStores = parseInt(stores);
      if (isNaN(numStores) || numStores <= 0) return 0;
      return Math.round(numStores * 65);
    };

    // Filter placements based on search and exclude already selected one
    const filteredPlacements = mockPlacements.filter(placement => 
      (placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.type.toLowerCase().includes(placementSearch.toLowerCase())) &&
      (!selectedPlacement || selectedPlacement.id !== placement.id)
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch('');
      setShowPlacementResults(false);
    };

    // Remove placement
    const removePlacement = () => {
      setSelectedPlacement(null);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    // Handle placement input click
    const handlePlacementClick = () => {
      setShowPlacementResults(true);
    };

    // Handle retail product input click
    const handleRetailProductClick = () => {
      setShowRetailProductResults(true);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowPlacementResults(false);
          setShowRetailProductResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <MenuContextProvider>
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
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              onClick={handlePlacementClick}
                              placeholder="Search for placement..." 
                              className="w-full"
                              icon={<LayoutDashboard className="w-4 h-4" />}
                            />
                            {showPlacementResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.length > 0 ? (
                                  filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {placement.adSpaces}
                                    </div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No placements found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {selectedPlacement && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected placement:</div>
                              <div className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                <div>
                                  <div className="text-sm font-medium">{selectedPlacement.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {selectedPlacement.adSpaces}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={removePlacement}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            {selectedPlacement 
                              ? 'Placement selected for this line item'
                              : 'Search and select a placement for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
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
                          <div className="text-sm text-muted-foreground">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Retail products">
                        <div className="space-y-4">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Select retail products*</label>
                            <SearchInput 
                              value={retailProductSearch}
                              onChange={handleRetailProductSearchChange}
                              onClick={handleRetailProductClick}
                              placeholder="Select product by name or ID..." 
                              className="w-full"
                              icon={<ScanBarcode className="w-4 h-4" />}
                            />
                            {showRetailProductResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredRetailProducts.length > 0 ? (
                                  filteredRetailProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handleRetailProductSelect(product)}
                                  >
                                    <div className="font-medium text-sm">{product.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {selectedRetailProducts.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected products:</div>
                              <div className="space-y-1">
                                {selectedRetailProducts.map(productId => {
                                  const product = retailProducts.find(p => p.id === productId);
                                  return product ? (
                                    <div key={productId} className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                      <div>
                                        <div className="text-sm font-medium">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => removeRetailProduct(productId)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            {selectedRetailProducts.length > 0 
                              ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                              : 'Search and select retail products to target for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Store targets">
                        <div className="space-y-4 min-w-0">
                          <div className="flex gap-3">
                            <Filter
                              name="Location"
                              options={locationOptions}
                              selectedValues={selectedLocations}
                              onChange={setSelectedLocations}
                            />
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                            />
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Stores">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of stores*</label>
                            <div className="relative" data-dropdown-container>
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Store className="w-4 h-4" />
                              </span>
                              <Input 
                                type="number"
                                value={storeAmount}
                                onChange={(e) => setStoreAmount(e.target.value)}
                                placeholder="Enter number of stores" 
                                className="w-full pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 0
                              ? `This will generate ${calculateReach(storeAmount).toLocaleString()} reach`
                              : 'Specify how many stores this line item will target'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Target">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Add targeting criteria for this line item
                          </div>
                          <div className="flex gap-3">
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                              className="flex-1"
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                              className="flex-1"
                            />
                          </div>
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
                      {selectedPlacement && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Placement</div>
                          <div className="font-medium">{selectedPlacement.name}</div>
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
                      {selectedRetailProducts.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Retail products</div>
                          <div className="font-medium">{selectedRetailProducts.length} selected</div>
                        </div>
                      )}
                      {storeAmount && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Stores</div>
                          <div className="font-medium">{storeAmount} stores</div>
                        </div>
                      )}
                      {selectedStoreTypes.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Store types</div>
                          <div className="font-medium">{selectedStoreTypes.length} selected</div>
                        </div>
                      )}
                      {selectedAudiences.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Audiences</div>
                          <div className="font-medium">{selectedAudiences.length} selected</div>
                        </div>
                      )}
                      {selectedInventory.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Inventory</div>
                          <div className="font-medium">{selectedInventory.length} selected</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  {/* Creatives section - hidden for now, can be brought back later
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
                  */}
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Offline In-Store Line Item Detail Story
export const OfflineInStore: Story = {
  render: () => {
    const [lineItemName, setLineItemName] = React.useState('');
    const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
    const [selectedInventory, setSelectedInventory] = React.useState<any[]>([]);
    const [inventorySearch, setInventorySearch] = React.useState('');
    const [showInventoryResults, setShowInventoryResults] = React.useState(false);
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    // Removed location search state - using Filter component instead
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [storeAmount, setStoreAmount] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedStoreTypes, setSelectedStoreTypes] = React.useState<string[]>([]);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [showSelectedStoresDialog, setShowSelectedStoresDialog] = React.useState(false);
    const [showConflictingItemsDialog, setShowConflictingItemsDialog] = React.useState(false);
    const [conflictingLineItemPriorities, setConflictingLineItemPriorities] = React.useState<{[key: string]: string}>({
      'line-item-1': 'Medium',
      'line-item-2': 'Medium'
    });
    const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>(['AH001', 'AH002', 'AH003']);

    // Location options for Filter component
    const locationOptions = [
      { label: 'No zone', value: 'no-zone', description: 'General store placement' },
      { label: 'Zuivel', value: 'zuivel', description: 'Dairy section, refrigerated area' },
      { label: 'Vers', value: 'vers', description: 'Fresh produce, vegetables, fruits' },
      { label: 'Vlees & Vega', value: 'vlees-vega', description: 'Meat counter, vegetarian alternatives' },
      { label: 'Diepvries', value: 'diepvries', description: 'Frozen food aisles, freezer sections' },
      { label: 'Worldfoods', value: 'worldfoods', description: 'International cuisine, ethnic foods' },
      { label: 'Maaltijdtoevoegingen', value: 'maaltijdtoevoegingen', description: 'Meal additions, sauces, seasonings' },
      { label: 'Noten, toast, chips etc.', value: 'noten-toast-chips', description: 'Snacks aisle, nuts, crackers' },
      { label: 'Zoetwaren', value: 'zoetwaren', description: 'Candy aisle, chocolates, sweets' },
      { label: 'Ontbijt', value: 'ontbijt', description: 'Breakfast items, cereals, spreads' },
      { label: 'Non Food', value: 'non-food', description: 'Household items, personal care' },
      { label: 'To Go', value: 'to-go', description: 'Ready meals, grab-and-go section' },
    ];

    // Inventory options with detailed information
    const inventoryOptions = [
      { id: 'wobbler', name: 'Wobbler', description: 'Shelf-edge promotional wobbler', dimensions: '10x15cm', locations: 'All shelving areas' },
      { id: 'vsb-mini', name: 'VSB (Mini)', description: 'Mini shelf barker', dimensions: '5x8cm', locations: 'Product shelves' },
      { id: 'vsb-large', name: 'VSB (Large)', description: 'Large shelf barker', dimensions: '15x20cm', locations: 'End caps, prime shelving' },
      { id: 'vloersticker', name: 'Vloersticker', description: 'Floor decal sticker', dimensions: '30x40cm', locations: 'High-traffic floor areas' },
      { id: 'koeldeursticker', name: 'Koeldeursticker', description: 'Cooler door sticker', dimensions: '20x25cm', locations: 'Refrigerated sections' },
      { id: 'makelaarsbord', name: 'Makelaarsbord', description: 'Standing promotional board', dimensions: '60x80cm', locations: 'Store entrance, aisles' },
    ];

    // Conflicting line-items data for overbook alert
    const conflictingLineItems = [
      { id: 'line-item-1', name: 'Summer Beverage Campaign', stores: 280, currentPriority: conflictingLineItemPriorities['line-item-1'] },
      { id: 'line-item-2', name: 'Back to School Promotion', stores: 320, currentPriority: conflictingLineItemPriorities['line-item-2'] }
    ];

    const priorityOptions = ['High', 'Medium', 'Low'];

    const handlePriorityChange = (lineItemId: string, priority: string) => {
      setConflictingLineItemPriorities(prev => ({
        ...prev,
        [lineItemId]: priority
      }));
    };

    // Sample data for other line items running in the same time window
    const runningLineItemsData = [
      {
        id: '1',
        name: 'Summer Beverage Campaign',
        availability: [85, 72, 90, 68, 76, 82, 88, 94, 79, 73, 86, 91],
        reachData: [1850000, 1650000, 1950000, 1450000, 1750000, 1850000, 2150000, 2350000, 1950000, 1550000, 2050000, 2250000],
        storeTypes: ['ah-xl', 'ah-dnah'],
        retailProducts: ['606983', '607124'],
        inventoryTypes: ['package-medium', 'package-large'],
        campaignCounts: [12, 8, 15, 6, 10, 12, 14, 18, 11, 7, 13, 16]
      },
      {
        id: '2', 
        name: 'Back to School Promotion',
        availability: [92, 88, 76, 84, 90, 87, 79, 85, 93, 89, 81, 86],
        reachData: [2150000, 1950000, 1750000, 1850000, 2050000, 1950000, 1750000, 1850000, 2150000, 2050000, 1850000, 1950000],
        storeTypes: ['ah-xl', 'ah-dnah'],
        retailProducts: ['608456', '609782'],
        inventoryTypes: ['package-small', 'package-medium'],
        campaignCounts: [8, 12, 5, 9, 13, 11, 6, 10, 15, 14, 7, 11]
      }
    ];

    // Other line-items in the same location
    const locationLineItems = [
      {
        campaignId: 'LI-2024-001',
        status: 'closed-won',
        brand: 'Coca Cola',
        package: 'Large Package',
        storeAmount: '450',
        startDate: '2024-07-15',
        endDate: '2024-08-15'
      },
      {
        campaignId: 'LI-2024-089',
        status: 'in-option', 
        brand: 'Innocent',
        package: 'Medium Package',
        storeAmount: '280',
        startDate: '2024-08-01',
        endDate: '2024-08-31'
      },
      {
        campaignId: 'LI-2024-156',
        status: 'closed-won',
        brand: 'PepsiCo',
        package: 'Small Package', 
        storeAmount: '125',
        startDate: '2024-08-10',
        endDate: '2024-09-10'
      }
    ];

    // Retailer events for the calendar (commercial agenda events)
    const retailerEventsData = [
      { id: 'event1', name: 'Summer Sale', start: new Date('2024-08-05'), end: new Date('2024-08-12'), color: '#3B82F6' },
      { id: 'event2', name: 'Back to School', start: new Date('2024-08-20'), end: new Date('2024-08-31'), color: '#10B981' },
    ];

    // Store list data for selected stores dialog
    const storesList = [
      { id: 'AH001', name: 'AH XL Amsterdam Centraal', type: 'AH XL', location: 'Amsterdam', reach: 12500, status: 'available' },
      { id: 'AH002', name: 'AH DNAH Rotterdam Zuid', type: 'AH DNAH', location: 'Rotterdam', reach: 11200, status: 'available' },
      { id: 'AH003', name: 'AH XL Utrecht Centraal', type: 'AH XL', location: 'Utrecht', reach: 10800, status: 'available' },
      { id: 'AH004', name: 'AH DNAH Den Haag Centrum', type: 'AH DNAH', location: 'Den Haag', reach: 9500, status: 'booked' },
      { id: 'AH005', name: 'AH XL Eindhoven Airport', type: 'AH XL', location: 'Eindhoven', reach: 8900, status: 'available' },
      { id: 'AH006', name: 'AH DNAH Groningen Grote Markt', type: 'AH DNAH', location: 'Groningen', reach: 7200, status: 'available' },
      { id: 'AH007', name: 'AH XL Maastricht Centrum', type: 'AH XL', location: 'Maastricht', reach: 8100, status: 'booked' },
      { id: 'AH008', name: 'AH DNAH Almere Stad', type: 'AH DNAH', location: 'Almere', reach: 9200, status: 'available' },
      { id: 'AH009', name: 'AH XL Tilburg Centrum', type: 'AH XL', location: 'Tilburg', reach: 8700, status: 'available' },
      { id: 'AH010', name: 'AH DNAH Breda Centrum', type: 'AH DNAH', location: 'Breda', reach: 7800, status: 'available' },
    ];

    const handleStoreSelection = (storeId: string, checked: boolean) => {
      if (checked) {
        setSelectedStoreIds([...selectedStoreIds, storeId]);
      } else {
        setSelectedStoreIds(selectedStoreIds.filter(id => id !== storeId));
      }
    };

    // Retail products data
    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
      { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
      { id: '612816', name: 'Nike - air max 270 - size 42' },
      { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: 'Ben & Jerry\'s - cookie dough - 465ml' },
    ];

    // Target filter options
    const storeTypeOptions = [
      { label: 'AH XL', value: 'ah-xl' },
      { label: 'AH DNAH', value: 'ah-dnah' }
    ];


    const audienceOptions = [
      { label: 'Matig Stedelijk', value: 'matig-stedelijk' },
      { label: 'Zeer Stedelijk', value: 'zeer-stedelijk' },
      { label: 'Young adult', value: 'young-adult' },
      { label: 'Family with Kids', value: 'family-with-kids' },
      { label: 'Convenience stores', value: 'convenience-stores' },
      { label: 'Traditional stores', value: 'traditional-stores' }
    ];

    // Filter retail products based on search
    const filteredRetailProducts = retailProducts.filter(product => 
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    // Handle retail product selection
    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    // Handle retail product search change
    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    // Remove retail product
    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Calculate estimated reach based on store amount (average reach per store: ~65)
    const calculateReach = (stores: string) => {
      const numStores = parseInt(stores);
      if (isNaN(numStores) || numStores <= 0) return 0;
      return Math.round(numStores * 65);
    };

    // Filter inventory based on search and exclude already selected items
    const filteredInventoryOptions = inventoryOptions.filter(inventory => 
      (inventory.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
       inventory.description.toLowerCase().includes(inventorySearch.toLowerCase()) ||
       inventory.locations.toLowerCase().includes(inventorySearch.toLowerCase())) &&
      !selectedInventory.some(selected => selected.id === inventory.id)
    );

    // Handle inventory search change
    const handleInventorySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInventorySearch(e.target.value);
      setShowInventoryResults(e.target.value.length > 0);
    };

    // Handle inventory input click
    const handleInventoryClick = () => {
      setShowInventoryResults(true);
    };

    // Handle inventory selection
    const handleInventorySelect = (inventory: any) => {
      if (!selectedInventory.some(item => item.id === inventory.id)) {
        setSelectedInventory([...selectedInventory, inventory]);
      }
      setInventorySearch('');
      setShowInventoryResults(false);
    };

    // Remove inventory item
    const removeInventoryItem = (inventoryId: string) => {
      setSelectedInventory(selectedInventory.filter(item => item.id !== inventoryId));
    };

    // Handle placement creation based on locations and inventory
    React.useEffect(() => {
      if (selectedLocations.length > 0 && selectedInventory.length > 0) {
        const locationLabels = selectedLocations
          .map(value => locationOptions.find(opt => opt.value === value)?.label)
          .filter(Boolean)
          .join(', ');
        const inventoryLabels = selectedInventory
          .map(item => item.name)
          .join(', ');
        setSelectedPlacement({
          name: `${locationLabels} - ${inventoryLabels}`,
          type: 'Custom Inventory',
          location: locationLabels,
          adSpaces: inventoryLabels
        });
      } else {
        setSelectedPlacement(null);
      }
    }, [selectedLocations, selectedInventory]);


    // Handle retail product input click
    const handleRetailProductClick = () => {
      setShowRetailProductResults(true);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowInventoryResults(false);
          setShowRetailProductResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <MenuContextProvider>
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
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Find inventory*</label>
                            <SearchInput 
                              value={inventorySearch}
                              onChange={handleInventorySearchChange}
                              onClick={handleInventoryClick}
                              placeholder="Search for inventory..." 
                              className="w-full"
                              icon={<LayoutDashboard className="w-4 h-4" />}
                            />
                            {showInventoryResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredInventoryOptions.length > 0 ? (
                                  filteredInventoryOptions.map((inventory) => (
                                  <div
                                    key={inventory.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handleInventorySelect(inventory)}
                                  >
                                    <div className="font-medium text-sm">{inventory.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {inventory.description} • {inventory.dimensions}
                                    </div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No inventory found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {selectedInventory.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected inventory:</div>
                              <div className="space-y-1">
                                {selectedInventory.map(inventory => (
                                  <div key={inventory.id} className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                    <div>
                                      <div className="text-sm font-medium">{inventory.name}</div>
                                      <div className="text-xs text-muted-foreground">{inventory.description}</div>
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => removeInventoryItem(inventory.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            {selectedInventory.length > 0
                              ? 'Inventory selected for this line item'
                              : 'Search and select inventory items for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
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
                          <div className="text-sm text-muted-foreground">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Retail products">
                        <div className="space-y-4">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Select retail products*</label>
                            <SearchInput 
                              value={retailProductSearch}
                              onChange={handleRetailProductSearchChange}
                              onClick={handleRetailProductClick}
                              placeholder="Select product by name or ID..." 
                              className="w-full"
                              icon={<ScanBarcode className="w-4 h-4" />}
                            />
                            {showRetailProductResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredRetailProducts.length > 0 ? (
                                  filteredRetailProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handleRetailProductSelect(product)}
                                  >
                                    <div className="font-medium text-sm">{product.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {selectedRetailProducts.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected products:</div>
                              <div className="space-y-1">
                                {selectedRetailProducts.map(productId => {
                                  const product = retailProducts.find(p => p.id === productId);
                                  return product ? (
                                    <div key={productId} className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                      <div>
                                        <div className="text-sm font-medium">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => removeRetailProduct(productId)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            {selectedRetailProducts.length > 0 
                              ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                              : 'Search and select retail products to target for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Store targets">
                        <div className="space-y-4 min-w-0">
                          <div className="flex gap-3">
                            <Filter
                              name="Location"
                              options={locationOptions}
                              selectedValues={selectedLocations}
                              onChange={setSelectedLocations}
                            />
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                            />
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Stores">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of stores*</label>
                            <div className="relative" data-dropdown-container>
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Store className="w-4 h-4" />
                              </span>
                              <Input 
                                type="number"
                                value={storeAmount}
                                onChange={(e) => setStoreAmount(e.target.value)}
                                placeholder="Enter number of stores" 
                                className="w-full pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 0
                              ? `This will generate ${calculateReach(storeAmount).toLocaleString()} reach`
                              : '750 stores available within the run time selected'
                            }
                          </div>
                          {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 750 && (
                            <>
                              <Alert variant="warning" className="mt-3">
                                <AlertTitle>Overbooked</AlertTitle>
                                <AlertDescription>
                                  <div className="mb-2">
                                    You have selected {storeAmount} stores, which exceeds the 750 available stores within the selected run time.
                                  </div>
                                  <div className="mb-2">
                                    There are 2 conflicting line-items booked in the same run time that limit store availability.
                                  </div>
                                  <button 
                                    className="text-orange-600 hover:text-orange-700 underline text-sm font-medium"
                                    onClick={() => setShowConflictingItemsDialog(true)}
                                  >
                                    Resolve conflicts
                                  </button>
                                </AlertDescription>
                              </Alert>

                              <Dialog open={showConflictingItemsDialog} onOpenChange={setShowConflictingItemsDialog}>
                                <DialogContent className="sm:max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Resolve Conflicting Line-Items</DialogTitle>
                                    <DialogDescription>
                                      Adjust priorities for line-items running in the same time period. Higher priority items will be allocated stores first.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <Table
                                      columns={[
                                        { key: 'name', header: 'Line Item' },
                                        { key: 'stores', header: 'Stores Required' },
                                        { key: 'priority', header: 'Priority' }
                                      ]}
                                      data={[
                                        {
                                          name: (
                                            <div>
                                              <div className="font-medium">{lineItemName || 'Current Line Item'}</div>
                                              <div className="text-sm text-muted-foreground">This line item</div>
                                            </div>
                                          ),
                                          stores: `${storeAmount} stores`,
                                          priority: (
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                  Medium
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent>
                                                {priorityOptions.map((priority) => (
                                                  <DropdownMenuItem key={priority}>
                                                    {priority}
                                                  </DropdownMenuItem>
                                                ))}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          )
                                        },
                                        ...conflictingLineItems.map((item) => ({
                                          name: <div className="font-medium">{item.name}</div>,
                                          stores: `${item.stores} stores`,
                                          priority: (
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                  {item.currentPriority}
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent>
                                                {priorityOptions.map((priority) => (
                                                  <DropdownMenuItem 
                                                    key={priority}
                                                    onClick={() => handlePriorityChange(item.id, priority)}
                                                  >
                                                    {priority}
                                                  </DropdownMenuItem>
                                                ))}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          )
                                        }))
                                      ]}
                                      className="w-full"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowConflictingItemsDialog(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={() => setShowConflictingItemsDialog(false)}>
                                      Apply Priorities
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline">
                              Bookings calendar
                            </Button>
                            <Dialog open={showSelectedStoresDialog} onOpenChange={setShowSelectedStoresDialog}>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  Selected store
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl w-full max-h-[85vh] flex flex-col">
                                <DialogHeader>
                                  <DialogTitle>Selected Stores</DialogTitle>
                                  <DialogDescription>View and manage the stores selected for this line item.</DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload store list
                                  </Button>
                                  <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download store list
                                  </Button>
                                </div>
                                <div className="flex-1 overflow-y-auto min-h-0">
                                  <Table
                                    columns={[
                                      { 
                                        key: 'select', 
                                        header: (
                                          <Checkbox 
                                            checked={selectedStoreIds.length === storesList.length}
                                            onCheckedChange={(checked) => {
                                              if (checked) {
                                                setSelectedStoreIds(storesList.map(s => s.id));
                                              } else {
                                                setSelectedStoreIds([]);
                                              }
                                            }}
                                          />
                                        ),
                                        width: '50px'
                                      },
                                      { key: 'name', header: 'Store Name' },
                                      { key: 'type', header: 'Type' },
                                      { key: 'location', header: 'Location' },
                                      { key: 'reach', header: 'Estimated Reach' },
                                      { key: 'status', header: 'Status' }
                                    ]}
                                    data={storesList.map(store => ({
                                      select: (
                                        <Checkbox
                                          checked={selectedStoreIds.includes(store.id)}
                                          onCheckedChange={(checked) => handleStoreSelection(store.id, checked as boolean)}
                                        />
                                      ),
                                      name: store.name,
                                      type: store.type,
                                      location: store.location,
                                      reach: store.reach.toLocaleString(),
                                      status: (
                                        <Badge 
                                          className={store.status === 'available' 
                                            ? 'bg-green-100 text-green-800 border-green-200' 
                                            : 'bg-orange-100 text-orange-800 border-orange-200'}
                                        >
                                          {store.status === 'available' ? 'Available' : 'Booked'}
                                        </Badge>
                                      )
                                    }))}
                                    className="w-full"
                                  />
                                </div>
                                <DialogFooter>
                                  <DialogTrigger asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogTrigger>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
{selectedLocations.length > 0 && (
  <div className="mt-6 pt-4 border-t border-slate-200">
    <h4 className="text-sm font-medium mb-3">Other campaigns in this location</h4>
    <Table
      columns={[
        {
          key: 'campaignId',
          header: 'Campaign ID',
          render: (row) => <span className="font-mono text-xs">{row.campaignId}</span>
        },
        {
          key: 'status',
          header: 'Status',
          render: (row) => (
            <Badge 
              variant={row.status === 'closed-won' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {row.status}
            </Badge>
          )
        },
        {
          key: 'brand',
          header: 'Brand',
          render: (row) => <span className="font-medium">{row.brand}</span>
        },
        {
          key: 'package',
          header: 'Package',
          render: (row) => row.package
        },
        {
          key: 'startDate',
          header: 'Start Date',
          render: (row) => <span className="text-xs text-muted-foreground">{row.startDate}</span>
        },
        {
          key: 'endDate',
          header: 'End Date',
          render: (row) => <span className="text-xs text-muted-foreground">{row.endDate}</span>
        },
        {
          key: 'storeAmount',
          header: 'Stores',
          render: (row) => <span className="font-medium">{row.storeAmount}</span>
        }
      ]}
      data={locationLineItems}
      rowKey={(row) => row.campaignId}
      hideActions={true}
    />
  </div>
)}
                        </div>
                      </FormSection>


                      {/* Creatives FormSection - temporarily hidden, can be easily restored later
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
                      */}
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline">Cancel</Button>
                        {/* <Button>Submit for approval</Button> */}
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
                      {selectedLocations.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Locations</div>
                          <div className="font-medium">
                            {selectedLocations.map(locationValue => {
                              const location = locationOptions.find(opt => opt.value === locationValue);
                              return location?.label;
                            }).filter(Boolean).join(', ')}
                          </div>
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
                      {selectedRetailProducts.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Retail products</div>
                          <div className="font-medium">{selectedRetailProducts.length} selected</div>
                        </div>
                      )}
                      {storeAmount && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Stores</div>
                          <div className="font-medium">{storeAmount} stores</div>
                        </div>
                      )}
                      {selectedStoreTypes.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Store types</div>
                          <div className="font-medium">{selectedStoreTypes.length} selected</div>
                        </div>
                      )}
                      {selectedAudiences.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Audiences</div>
                          <div className="font-medium">{selectedAudiences.length} selected</div>
                        </div>
                      )}
                      {selectedInventory.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Inventory</div>
                          <div className="font-medium">{selectedInventory.length} selected</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  {/* Creatives section - hidden for now, can be brought back later
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
                              <span className="text-[14px] text-muted-foreground">Line item: </span>
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
                  */}
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Sponsored Products Line Item Detail Story
export const SponsoredProducts: Story = {
  render: () => {
    // Location options for targeting
    const locationOptions = [
      { label: 'Amsterdam', value: 'amsterdam' },
      { label: 'Rotterdam', value: 'rotterdam' },
      { label: 'Den Haag', value: 'den-haag' },
      { label: 'Utrecht', value: 'utrecht' },
      { label: 'Eindhoven', value: 'eindhoven' }
    ];
    const [lineItemName, setLineItemName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [storeAmount, setStoreAmount] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedStoreTypes, setSelectedStoreTypes] = React.useState<string[]>([]);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
    const [selectedInventory] = React.useState<string[]>([]); // Added to fix undefined reference

    // Retail products data
    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
      { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
      { id: '612816', name: 'Nike - air max 270 - size 42' },
      { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: 'Ben & Jerry\'s - cookie dough - 465ml' },
    ];

    // Target filter options (empty for non-OfflineInStore stories)
    const storeTypeOptions = [
      { label: 'AH XL', value: 'ah-xl' },
      { label: 'AH DNAH', value: 'ah-dnah' }
    ];


    const audienceOptions = [
      { label: 'Matig Stedelijk', value: 'matig-stedelijk' },
      { label: 'Zeer Stedelijk', value: 'zeer-stedelijk' },
      { label: 'Young adult', value: 'young-adult' },
      { label: 'Family with Kids', value: 'family-with-kids' },
      { label: 'Convenience stores', value: 'convenience-stores' },
      { label: 'Traditional stores', value: 'traditional-stores' }
    ];

    // Filter retail products based on search
    const filteredRetailProducts = retailProducts.filter(product => 
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    // Handle retail product selection
    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    // Handle retail product search change
    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    // Remove retail product
    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Calculate estimated reach based on store amount (average reach per store: ~65)
    const calculateReach = (stores: string) => {
      const numStores = parseInt(stores);
      if (isNaN(numStores) || numStores <= 0) return 0;
      return Math.round(numStores * 65);
    };

    // Filter placements based on search and exclude already selected one
    const filteredPlacements = mockPlacements.filter(placement => 
      (placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.type.toLowerCase().includes(placementSearch.toLowerCase())) &&
      (!selectedPlacement || selectedPlacement.id !== placement.id)
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch('');
      setShowPlacementResults(false);
    };

    // Remove placement
    const removePlacement = () => {
      setSelectedPlacement(null);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    // Handle placement input click
    const handlePlacementClick = () => {
      setShowPlacementResults(true);
    };

    // Handle retail product input click
    const handleRetailProductClick = () => {
      setShowRetailProductResults(true);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowPlacementResults(false);
          setShowRetailProductResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <MenuContextProvider>
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
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              onClick={handlePlacementClick}
                              placeholder="Search for placement..." 
                              className="w-full"
                              icon={<LayoutDashboard className="w-4 h-4" />}
                            />
                            {showPlacementResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.length > 0 ? (
                                  filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {placement.adSpaces}
                                    </div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No placements found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {selectedPlacement && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected placement:</div>
                              <div className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                <div>
                                  <div className="text-sm font-medium">{selectedPlacement.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {selectedPlacement.adSpaces}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={removePlacement}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            {selectedPlacement 
                              ? 'Placement selected for this line item'
                              : 'Search and select a placement for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Run time">
                        <div className="space-y-4 min-w-0">
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
                          <div className="text-sm text-muted-foreground">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Retail products">
                        <div className="space-y-4">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Select retail products*</label>
                            <SearchInput 
                              value={retailProductSearch}
                              onChange={handleRetailProductSearchChange}
                              onClick={handleRetailProductClick}
                              placeholder="Select product by name or ID..." 
                              className="w-full"
                              icon={<ScanBarcode className="w-4 h-4" />}
                            />
                            {showRetailProductResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredRetailProducts.length > 0 ? (
                                  filteredRetailProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handleRetailProductSelect(product)}
                                  >
                                    <div className="font-medium text-sm">{product.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {selectedRetailProducts.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected products:</div>
                              <div className="space-y-1">
                                {selectedRetailProducts.map(productId => {
                                  const product = retailProducts.find(p => p.id === productId);
                                  return product ? (
                                    <div key={productId} className="flex items-center justify-between bg-slate-50 rounded-md p-2">
                                      <div>
                                        <div className="text-sm font-medium">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => removeRetailProduct(productId)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            {selectedRetailProducts.length > 0 
                              ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                              : 'Search and select retail products to target for this line item'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Store targets">
                        <div className="space-y-4 min-w-0">
                          <div className="flex gap-3">
                            <Filter
                              name="Location"
                              options={locationOptions}
                              selectedValues={selectedLocations}
                              onChange={setSelectedLocations}
                            />
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                            />
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Stores">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of stores*</label>
                            <div className="relative" data-dropdown-container>
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Store className="w-4 h-4" />
                              </span>
                              <Input 
                                type="number"
                                value={storeAmount}
                                onChange={(e) => setStoreAmount(e.target.value)}
                                placeholder="Enter number of stores" 
                                className="w-full pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 0
                              ? `This will generate ${calculateReach(storeAmount).toLocaleString()} reach`
                              : 'Specify how many stores this line item will target'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection title="Target">
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Add targeting criteria for this line item
                          </div>
                          <div className="flex gap-3">
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                              className="flex-1"
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                              className="flex-1"
                            />
                          </div>
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
                      {selectedPlacement && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Placement</div>
                          <div className="font-medium">{selectedPlacement.name}</div>
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
                      {selectedRetailProducts.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Retail products</div>
                          <div className="font-medium">{selectedRetailProducts.length} selected</div>
                        </div>
                      )}
                      {storeAmount && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Stores</div>
                          <div className="font-medium">{storeAmount} stores</div>
                        </div>
                      )}
                      {selectedStoreTypes.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Store types</div>
                          <div className="font-medium">{selectedStoreTypes.length} selected</div>
                        </div>
                      )}
                      {selectedAudiences.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Audiences</div>
                          <div className="font-medium">{selectedAudiences.length} selected</div>
                        </div>
                      )}
                      {selectedInventory.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Inventory</div>
                          <div className="font-medium">{selectedInventory.length} selected</div>
                        </div>
                      )}
                    </CardSummaryContent>
                  </CardSummary>
                  
                  {/* Creatives section - hidden for now, can be brought back later
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
                  */}
                  
                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};
