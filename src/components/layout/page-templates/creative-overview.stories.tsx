import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/ui/filter-bar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import React, { useState } from 'react';

// Map the creative type label to its detail-route slug (used by the View modal).
const TYPE_SLUG: Record<string, string> = {
  'Display': 'display',
  'Digital In-Store': 'digital-instore',
  'Offline In-Store': 'offline-instore',
  'Sponsored Products': 'sponsored-products',
};

type CreativeRow = {
  id: string; status: string; type: string; format: string;
  name: string; campaign: string; bookings: number; created: string; updated: string;
};

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Creative Overview',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Creative Overview Page Template

The Creative Overview page template provides a comprehensive view of all creative assets with advanced filtering and search capabilities. It serves as the main creative management interface for media partners.

## Features

- **Data Table**: Displays creative information in a sortable, filterable table format
- **Triple Filtering**: Multi-select filters for Status, Type, and Format
- **Advanced Search**: Real-time search across creative names, campaigns, and IDs
- **Status Badges**: Visual indicators for creative approval status
- **Type Badges**: Visual indicators for creative types (Display, Digital In-Store, etc.)
- **Click Navigation**: Row clicks navigate to creative detail pages
- **Responsive Design**: Table adapts to different screen sizes

## Data Structure

Each creative record includes:
- **ID**: Unique creative identifier (CR-001, CR-002, etc.)
- **Status**: Approval status with color-coded badges
- **Type**: Creative type with color-coded badges
- **Format**: Creative format specification
- **Name**: Creative name
- **Campaign**: Associated campaign name
- **Bookings**: Number of linked bookings (with badge)
- **Created/Updated**: Date tracking with proper formatting

## Filter Options

### Status Filter
- **Approved**: Creative approved and ready for use
- **Pending**: Creative awaiting approval
- **Draft**: Creative in development
- **Rejected**: Creative rejected and needs revision

### Type Filter
- **Display**: Online display advertisements
- **Digital In-Store**: Digital signage and in-store displays
- **Offline In-Store**: Physical in-store materials
- **Sponsored Products**: Product-specific advertising

### Format Filter
- **Banner**: Standard banner advertisements
- **Video**: Video advertisements
- **Digital Signage**: Digital display formats
- **Wobbler**: Physical wobbler materials
- **Product Image**: Product-specific imagery
- **Interstitial**: Full-screen advertisements

## Search Functionality

The search feature allows filtering by:
- Creative names
- Campaign names
- Creative IDs
- Real-time filtering as you type

## Usage

This template is ideal for:
- Creative asset management
- Media partner creative overviews
- Creative approval workflows
- Creative performance monitoring
- Bulk creative operations

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- FilterBar (filtering and search interface)
- Table (data display with sorting and row actions)
- Badge (status, type, and count indicators)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


const creativeData = [
  { id: 'CR-001', status: 'Approved', type: 'Display', format: 'Banner', name: 'Holiday Sale Banner', campaign: 'Holiday Sale', bookings: 3, created: '2024-06-01', updated: '2024-06-15' },
  { id: 'CR-002', status: 'Pending', type: 'Display', format: 'Video', name: 'Summer Launch Video', campaign: 'Summer Launch', bookings: 1, created: '2024-07-01', updated: '2024-07-10' },
  { id: 'CR-003', status: 'Approved', type: 'Digital In-Store', format: 'Digital Signage', name: 'Back to School Display', campaign: 'Back to School', bookings: 2, created: '2024-08-01', updated: '2024-08-05' },
  { id: 'CR-004', status: 'Rejected', type: 'Offline In-Store', format: 'Wobbler', name: 'Black Friday Wobbler', campaign: 'Black Friday', bookings: 0, created: '2024-10-15', updated: '2024-10-20' },
  { id: 'CR-005', status: 'Approved', type: 'Sponsored Products', format: 'Product Image', name: 'Electronics Promo', campaign: 'Electronics Sale', bookings: 4, created: '2024-09-01', updated: '2024-09-10' },
  { id: 'CR-006', status: 'Draft', type: 'Display', format: 'Interstitial', name: 'Winter Collection', campaign: 'Winter Launch', bookings: 0, created: '2024-11-01', updated: '2024-11-01' },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'Approved': return 'default';
    case 'Pending': return 'secondary';
    case 'Draft': return 'outline';
    case 'Rejected': return 'destructive';
    default: return 'outline';
  }
};

const typeVariant = (type: string) => {
  switch (type) {
    case 'Display': return 'default';
    case 'Digital In-Store': return 'secondary';
    case 'Offline In-Store': return 'outline';
    case 'Sponsored Products': return 'destructive';
    default: return 'outline';
  }
};

export const CreativeOverview: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [status, setStatus] = useState<string[]>([]);
    const [type, setType] = useState<string[]>([]);
    const [format, setFormat] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    // Creative rows are stateful so the quick approve/reject actions can update status.
    const [rows, setRows] = useState<CreativeRow[]>(creativeData);
    const [viewing, setViewing] = useState<CreativeRow | null>(null);
    const setRowStatus = (id: string, next: string) =>
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));

    const filteredCreativeData = rows.filter(row => {
      const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
      const typeMatch = type.length === 0 || type.includes(row.type.toLowerCase().replace(/ /g, '-'));
      const formatMatch = format.length === 0 || format.includes(row.format.toLowerCase().replace(/ /g, '-'));
      const searchMatch = search === '' || 
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.campaign.toLowerCase().includes(search.toLowerCase()) ||
        row.id.toLowerCase().includes(search.toLowerCase());
      return statusMatch && typeMatch && formatMatch && searchMatch;
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
          title: 'Creative Overview',
          subtitle: 'Manage and monitor all your creative assets across campaigns',
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
                  name: 'Type',
                  options: [
                    { label: 'Display', value: 'display' },
                    { label: 'Digital In-Store', value: 'digital-in-store' },
                    { label: 'Offline In-Store', value: 'offline-in-store' },
                    { label: 'Sponsored Products', value: 'sponsored-products' },
                  ],
                  selectedValues: type,
                  onChange: setType,
                },
                {
                  name: 'Format',
                  options: [
                    { label: 'Banner', value: 'banner' },
                    { label: 'Video', value: 'video' },
                    { label: 'Digital Signage', value: 'digital-signage' },
                    { label: 'Wobbler', value: 'wobbler' },
                    { label: 'Product Image', value: 'product-image' },
                    { label: 'Interstitial', value: 'interstitial' },
                  ],
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
                {
                  key: 'actions',
                  header: 'Actions',
                  render: (row) => {
                    const isApproved = row.status === 'Approved';
                    const isRejected = row.status === 'Rejected';
                    return (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="View creative"
                          onClick={(e) => { e.stopPropagation(); setViewing(row); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm"
                          className={`h-8 w-8 p-0 ${isRejected ? 'border-red-200 bg-red-50 text-red-600' : 'text-muted-foreground hover:text-red-600'}`}
                          aria-label="Disapprove creative"
                          onClick={(e) => { e.stopPropagation(); setRowStatus(row.id, 'Rejected'); }}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm"
                          className={`h-8 w-8 p-0 ${isApproved ? 'border-green-200 bg-green-50 text-green-700' : 'text-muted-foreground hover:text-green-700'}`}
                          aria-label="Approve creative"
                          onClick={(e) => { e.stopPropagation(); setRowStatus(row.id, 'Approved'); }}>
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  },
                },
                { key: 'status', header: 'Status', render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                { key: 'type', header: 'Type', render: row => <Badge variant={typeVariant(row.type)}>{row.type}</Badge> },
                { key: 'format', header: 'Format' },
                { key: 'name', header: 'Name' },
                { key: 'campaign', header: 'Campaign' },
                { key: 'bookings', header: 'Bookings', render: row => <Badge variant="secondary">{row.bookings}</Badge> },
                { key: 'created', header: 'Created', render: row => new Date(row.created).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                { key: 'updated', header: 'Updated', render: row => new Date(row.updated).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
              ]}
              data={filteredCreativeData}
              rowKey={row => row.id}
              rowClassName={() => 'cursor-pointer'}
              onRowClick={row => {
                console.log('Navigate to creative details for', row.name);
              }}
            />
          </CardContent>
        </Card>

        {/* View modal — quick look with a link to the full creative detail page */}
        <Dialog open={viewing != null} onOpenChange={(open) => { if (!open) setViewing(null); }}>
          <DialogContent className="max-w-lg">
            {viewing && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {viewing.name}
                    <Badge variant={statusVariant(viewing.status)}>{viewing.status}</Badge>
                  </DialogTitle>
                  <DialogDescription>{viewing.id} · {viewing.campaign}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div><div className="text-xs text-muted-foreground">Type</div><div className="font-medium">{viewing.type}</div></div>
                  <div><div className="text-xs text-muted-foreground">Format</div><div className="font-medium">{viewing.format}</div></div>
                  <div><div className="text-xs text-muted-foreground">Bookings</div><div className="font-medium">{viewing.bookings}</div></div>
                  <div><div className="text-xs text-muted-foreground">Updated</div><div className="font-medium">{new Date(viewing.updated).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</div></div>
                </div>
                <div className="mt-2 flex aspect-[16/9] items-center justify-center rounded-md border border-dashed bg-muted/40 text-sm text-muted-foreground">
                  Creative preview
                </div>
                <DialogFooter className="gap-2 sm:justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setRowStatus(viewing.id, 'Rejected'); setViewing(null); }}>
                      <XCircle className="mr-1.5 h-4 w-4" /> Disapprove
                    </Button>
                    <Button onClick={() => { setRowStatus(viewing.id, 'Approved'); setViewing(null); }}>
                      <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                    </Button>
                  </div>
                  <a
                    href={`/creatives/${TYPE_SLUG[viewing.type] || 'display'}/${viewing.id}`}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Open creative
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};