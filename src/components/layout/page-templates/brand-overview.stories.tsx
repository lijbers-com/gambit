import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Brand Overview',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const brandData = [
  { id: 'BRD-001', name: 'Coca-Cola', advertiser: 'The Coca-Cola Company', products: 24, campaigns: 8, status: 'Active' as const },
  { id: 'BRD-002', name: 'Unox', advertiser: 'Unilever', products: 15, campaigns: 5, status: 'Active' as const },
  { id: 'BRD-003', name: 'Dove', advertiser: 'Unilever', products: 32, campaigns: 12, status: 'Active' as const },
  { id: 'BRD-004', name: 'Axe', advertiser: 'Unilever', products: 18, campaigns: 6, status: 'Active' as const },
  { id: 'BRD-005', name: "Hellmann's", advertiser: 'Unilever', products: 9, campaigns: 3, status: 'Inactive' as const },
  { id: 'BRD-006', name: 'Coca-Cola Zero', advertiser: 'The Coca-Cola Company', products: 12, campaigns: 4, status: 'Active' as const },
  { id: 'BRD-007', name: 'Magnum', advertiser: 'Unilever', products: 22, campaigns: 9, status: 'Active' as const },
  { id: 'BRD-008', name: 'Heinz', advertiser: 'Kraft Heinz', products: 41, campaigns: 7, status: 'Active' as const },
  { id: 'BRD-009', name: "Ben & Jerry's", advertiser: 'Unilever', products: 28, campaigns: 11, status: 'Active' as const },
  { id: 'BRD-010', name: 'Sensodyne', advertiser: 'Haleon', products: 7, campaigns: 2, status: 'Inactive' as const },
];

export const BrandOverview: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
    const [advertiserFilter, setAdvertiserFilter] = React.useState<string[]>([]);
    const [searchValue, setSearchValue] = React.useState('');

    const filteredData = brandData.filter(row => {
      const statusMatch = statusFilter.length === 0 || statusFilter.includes(row.status.toLowerCase());
      const advertiserMatch = advertiserFilter.length === 0 || advertiserFilter.includes(row.advertiser.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
      const searchMatch = searchValue === '' || row.name.toLowerCase().includes(searchValue.toLowerCase());
      return statusMatch && advertiserMatch && searchMatch;
    });

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Brands & retail products',
            subtitle: 'Manage your brand portfolio and retail product catalogue',
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
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ],
                    selectedValues: statusFilter,
                    onChange: setStatusFilter,
                  },
                  {
                    name: 'Advertiser',
                    options: [
                      { label: 'The Coca-Cola Company', value: 'the-coca-cola-company' },
                      { label: 'Unilever', value: 'unilever' },
                      { label: 'Kraft Heinz', value: 'kraft-heinz' },
                      { label: 'Haleon', value: 'haleon' },
                    ],
                    selectedValues: advertiserFilter,
                    onChange: setAdvertiserFilter,
                  },
                ]}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search brands..."
              />
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  {
                    key: 'actions',
                    header: '',
                    render: (row) => (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => alert(`View ${row.name}`)}>View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Edit ${row.name}`)}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ),
                  },
                  { key: 'name', header: 'Name' },
                  { key: 'advertiser', header: 'Advertiser' },
                  {
                    key: 'products',
                    header: 'Products',
                    render: (row) => <Badge variant="secondary">{row.products}</Badge>,
                  },
                  {
                    key: 'campaigns',
                    header: 'Campaigns',
                    render: (row) => <Badge variant="secondary">{row.campaigns}</Badge>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) => (
                      <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge>
                    ),
                  },
                ]}
                data={filteredData}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.name}`)}
              />
              <div className="flex justify-end pt-4">
                <Button>Add brand</Button>
              </div>
            </CardContent>
          </Card>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
