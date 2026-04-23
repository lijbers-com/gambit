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
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Organisation Overview',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const organisationData = [
  { id: 'ORG-001', name: 'Unilever', brands: 45, type: 'Advertiser' as const, users: 3000, status: 'Active' as const },
  { id: 'ORG-002', name: 'Coca-Cola', brands: 12, type: 'Debtor & Advertiser' as const, users: 850, status: 'Active' as const },
  { id: 'ORG-003', name: 'FrieslandCampina', brands: 28, type: 'Advertiser' as const, users: 420, status: 'Active' as const },
  { id: 'ORG-004', name: 'Procter & Gamble', brands: 38, type: 'Debtor & Advertiser' as const, users: 2100, status: 'Active' as const },
  { id: 'ORG-005', name: 'Nestlé', brands: 41, type: 'Advertiser' as const, users: 1750, status: 'Active' as const },
  { id: 'ORG-006', name: 'Heineken', brands: 8, type: 'Debtor' as const, users: 320, status: 'Inactive' as const },
  { id: 'ORG-007', name: 'Mars', brands: 15, type: 'Advertiser' as const, users: 540, status: 'Active' as const },
  { id: 'ORG-008', name: 'Danone', brands: 22, type: 'Agency' as const, users: 680, status: 'Active' as const },
  { id: 'ORG-009', name: "L'Oréal", brands: 33, type: 'Agency' as const, users: 1200, status: 'Inactive' as const },
  { id: 'ORG-010', name: 'Philips', brands: 2, type: 'Debtor' as const, users: 5, status: 'Active' as const },
];

export const OrganisationOverview: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
    const [typeFilter, setTypeFilter] = React.useState<string[]>([]);
    const [searchValue, setSearchValue] = React.useState('');

    const filteredData = organisationData.filter(row => {
      const statusMatch = statusFilter.length === 0 || statusFilter.includes(row.status.toLowerCase());
      const typeMatch = typeFilter.length === 0 || typeFilter.includes(row.type.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
      const searchMatch = searchValue === '' || row.name.toLowerCase().includes(searchValue.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
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
            title: 'Organisations',
            subtitle: 'Manage all partner organisations in the retail media platform',
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
                    name: 'Type',
                    options: [
                      { label: 'Advertiser', value: 'advertiser' },
                      { label: 'Agency', value: 'agency' },
                      { label: 'Debtor', value: 'debtor' },
                      { label: 'Debtor & Advertiser', value: 'debtor-advertiser' },
                    ],
                    selectedValues: typeFilter,
                    onChange: setTypeFilter,
                  },
                ]}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search organisations..."
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
                          <DropdownMenuItem onClick={() => alert(`Select ${row.name}`)}>Select</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Edit ${row.name}`)}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ),
                  },
                  { key: 'name', header: 'Name' },
                  {
                    key: 'brands',
                    header: 'Brands',
                    render: (row) => <Badge variant="secondary">{row.brands}</Badge>,
                  },
                  { key: 'type', header: 'Type' },
                  {
                    key: 'users',
                    header: 'Users',
                    render: (row) => <Badge variant="secondary">{row.users}</Badge>,
                  },
                ]}
                data={filteredData}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.name}`)}
              />
              <div className="flex justify-end pt-4">
                <Button>Create new partner</Button>
              </div>
            </CardContent>
          </Card>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
