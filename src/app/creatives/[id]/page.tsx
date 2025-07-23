'use client';

// EXACT Creative Detail Display component from story/page-templates-creative-detail--display
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FormSection } from '@/components/ui/form-section';
import { Input, FileInput } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/filter-bar';
import { Minus } from 'lucide-react';
import { defaultRoutes } from '@/components/layout/default-routes';

// EXACT mock data from Storybook
const mockLineItems = [
  { id: 1, name: 'Knorr 500 stores', brand: 'Knorr', start: '01/08/2024', end: '30/08/2024', stores: 500, product: 'Pakket M' },
  { id: 2, name: 'Unox 200 stores', brand: 'Unox', start: '05/08/2024', end: '20/08/2024', stores: 200, product: 'Pakket S' },
  { id: 3, name: 'Maggi 300 stores', brand: 'Maggi', start: '10/08/2024', end: '25/08/2024', stores: 300, product: 'Pakket L' },
];

// LineItems Dialog Component
const LineItemsDialog = ({ selectedLineItems, onSelectionChange }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  const handleToggleSelection = (lineItem: any) => {
    const isSelected = selectedLineItems.some((item: any) => item.id === lineItem.id);
    if (isSelected) {
      onSelectionChange(selectedLineItems.filter((item: any) => item.id !== lineItem.id));
    } else {
      onSelectionChange([...selectedLineItems, lineItem]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Link line-items</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Link line-items</DialogTitle>
          <DialogDescription>
            Select line-items to link to this creative
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-shrink-0">
          <FilterBar
            filters={[
              {
                name: 'Status',
                options: [
                  { label: 'Active', value: 'active' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Paused', value: 'paused' },
                ],
                selectedValues: statusFilter,
                onChange: setStatusFilter,
              }
            ]}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search line-items..."
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
                    checked={selectedLineItems.some((item: any) => item.id === row.id)}
                    onChange={() => handleToggleSelection(row)}
                    className="rounded border-gray-300"
                  />
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
            data={mockLineItems.filter(item => 
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.brand.toLowerCase().includes(searchTerm.toLowerCase())
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

export default function CreativeDetailPage() {
  // EXACT state from Storybook Display variant
  const [creativeName, setCreativeName] = useState('');
  const [creativeFormat, setCreativeFormat] = useState('');
  const [selectedLineItems, setSelectedLineItems] = useState<any[]>([]);

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
      }}
    >
      {/* EXACT two-column layout from Storybook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          <Card className="w-full">
            <CardContent className="space-y-6">
              {/* Creative Details Section */}
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
                      placeholder="Select format"
                      className="w-full"
                      value={creativeFormat}
                      onChange={(e) => setCreativeFormat(e.target.value)}
                    />
                    <Button variant="outline" className="mt-4">
                      See format requirements
                    </Button>
                  </div>
                </div>
              </FormSection>

              {/* Dynamic Format Settings Section */}
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

              {/* Line Items Section */}
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
                              size="sm"
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

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Submit for approval</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Creative Summary Card */}
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

          {/* Line Items Summary Card */}
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
        </div>
      </div>
    </AppLayout>
  );
}