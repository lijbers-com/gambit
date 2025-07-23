'use client';

// EXACT Line Item Detail Display component from story/page-templates-line-item-detail--display
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { DatePicker } from '@/components/ui/date-picker';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/filter-bar';
import { Minus } from 'lucide-react';
import { defaultRoutes } from '@/components/layout/default-routes';

// EXACT mock data from Storybook
const mockCreatives = [
  { id: 1, name: 'Summer Banner', format: 'Banner', status: 'Approved', type: 'Display' },
  { id: 2, name: 'Holiday Video', format: 'Video', status: 'Pending', type: 'Display' },
  { id: 3, name: 'Store Signage', format: 'Digital Signage', status: 'Approved', type: 'Digital In-Store' },
];

const mockPlacements = [
  { id: 1, name: 'Albert Heijn Amsterdam Central', type: 'Store', location: 'Amsterdam', category: 'Grocery' },
  { id: 2, name: 'Albert Heijn Rotterdam Center', type: 'Store', location: 'Rotterdam', category: 'Grocery' },
  { id: 3, name: 'Albert Heijn Utrecht Main', type: 'Store', location: 'Utrecht', category: 'Grocery' },
  { id: 4, name: 'Albert Heijn Den Haag Plaza', type: 'Store', location: 'Den Haag', category: 'Grocery' },
  { id: 5, name: 'Albert Heijn Eindhoven Center', type: 'Store', location: 'Eindhoven', category: 'Grocery' },
];

// Creative Linking Dialog Component
const CreativeLinkingDialog = ({ selectedCreatives, onSelectionChange }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  const handleToggleSelection = (creative: any) => {
    const isSelected = selectedCreatives.some((item: any) => item.id === creative.id);
    if (isSelected) {
      onSelectionChange(selectedCreatives.filter((item: any) => item.id !== creative.id));
    } else {
      onSelectionChange([...selectedCreatives, creative]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Link creatives</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Link creatives</DialogTitle>
          <DialogDescription>
            Select creatives to link to this line item
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-shrink-0">
          <FilterBar
            filters={[
              {
                name: 'Status',
                options: [
                  { label: 'Approved', value: 'Approved' },
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Rejected', value: 'Rejected' },
                ],
                selectedValues: statusFilter,
                onChange: setStatusFilter,
              }
            ]}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search creatives..."
          />
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table
            columns={[
              {
                key: 'select',
                header: '',
                render: (row) => (
                  <input
                    type="checkbox"
                    checked={selectedCreatives.some((item: any) => item.id === row.id)}
                    onChange={() => handleToggleSelection(row)}
                    className="rounded border-gray-300"
                  />
                ),
                className: 'w-10 text-center',
              },
              { key: 'name', header: 'Name' },
              { key: 'format', header: 'Format' },
              { key: 'status', header: 'Status' },
              { key: 'type', header: 'Type' },
            ]}
            data={mockCreatives.filter(creative => 
              creative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              creative.format.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            rowKey={row => row.id}
            hideActions
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Link selected</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Campaign Details Sidebar Component
const CampaignDetailsSidebar = () => (
  <CardSummary>
    <CardHeader>
      <CardSummaryTitle>Campaign</CardSummaryTitle>
    </CardHeader>
    <CardSummaryContent>
      <div className="mb-2">
        <div className="text-[14px] text-muted-foreground">Name</div>
        <div className="font-medium">Summer Launch</div>
      </div>
      <div className="mb-2">
        <div className="text-[14px] text-muted-foreground">Advertiser</div>
        <div className="font-medium">BrandX</div>
      </div>
      <div className="mb-2">
        <div className="text-[14px] text-muted-foreground">Status</div>
        <div className="font-medium">Ready</div>
      </div>
      <div className="mb-2">
        <div className="text-[14px] text-muted-foreground">Runtime</div>
        <div className="font-medium">01 Aug - 30 Aug, 2024</div>
      </div>
    </CardSummaryContent>
  </CardSummary>
);

export default function LineItemDetailPage() {
  // EXACT state from Storybook Display variant
  const [lineItemName, setLineItemName] = useState('');
  const [placementSearch, setPlacementSearch] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const [showPlacementResults, setShowPlacementResults] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-08-01'));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-08-30'));
  const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);

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
      }}
    >
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 min-w-0">
                <Card className="min-w-0">
                  <CardHeader className="space-y-8">
                    {/* Line Item Details Section */}
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
                    
                    {/* Placement Section */}
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

                    {/* Run Time Section */}
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

                    {/* Target Section */}
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

                    {/* Creatives Section */}
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
                                    size="sm"
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
}