import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Users Overview',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const usersData = [
  { id: 'USR-001', name: 'John Smith', email: 'john.smith@unilever.com', organisation: 'Unilever', role: 'Admin' as const, status: 'Active' as const },
  { id: 'USR-002', name: 'Sarah Johnson', email: 's.johnson@coca-cola.com', organisation: 'Coca-Cola', role: 'Campaign Manager' as const, status: 'Active' as const },
  { id: 'USR-003', name: 'Michael van den Berg', email: 'm.vandenberg@frieslandcampina.com', organisation: 'FrieslandCampina', role: 'Viewer' as const, status: 'Active' as const },
  { id: 'USR-004', name: 'Emma Wilson', email: 'e.wilson@pg.com', organisation: 'Procter & Gamble', role: 'Finance' as const, status: 'Inactive' as const },
  { id: 'USR-005', name: 'Lucas Müller', email: 'l.muller@nestle.com', organisation: 'Nestlé', role: 'Campaign Manager' as const, status: 'Active' as const },
  { id: 'USR-006', name: 'Sophie Dubois', email: 's.dubois@heineken.com', organisation: 'Heineken', role: 'Viewer' as const, status: 'Inactive' as const },
  { id: 'USR-007', name: 'James Martinez', email: 'j.martinez@mars.com', organisation: 'Mars', role: 'Admin' as const, status: 'Active' as const },
  { id: 'USR-008', name: 'Anna Lefebvre', email: 'a.lefebvre@danone.com', organisation: 'Danone', role: 'Campaign Manager' as const, status: 'Active' as const },
  { id: 'USR-009', name: 'Thomas Bernard', email: 't.bernard@loreal.com', organisation: "L'Oréal", role: 'Finance' as const, status: 'Active' as const },
  { id: 'USR-010', name: 'Lisa de Vries', email: 'l.devries@philips.com', organisation: 'Philips', role: 'Viewer' as const, status: 'Inactive' as const },
];

export const UsersOverview: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
    const [roleFilter, setRoleFilter] = React.useState<string[]>([]);
    const [organisationFilter, setOrganisationFilter] = React.useState<string[]>([]);
    const [searchValue, setSearchValue] = React.useState('');

    const filteredData = usersData.filter(row => {
      const statusMatch = statusFilter.length === 0 || statusFilter.includes(row.status.toLowerCase());
      const roleMatch = roleFilter.length === 0 || roleFilter.includes(row.role.toLowerCase().replace(/ /g, '-'));
      const orgMatch = organisationFilter.length === 0 || organisationFilter.includes(row.organisation.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/'/g, ''));
      const searchMatch = searchValue === '' || row.name.toLowerCase().includes(searchValue.toLowerCase()) || row.email.toLowerCase().includes(searchValue.toLowerCase());
      return statusMatch && roleMatch && orgMatch && searchMatch;
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
            title: 'Users',
            subtitle: 'Manage users across all organisations in the retail media platform',
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
                    name: 'Role',
                    options: [
                      { label: 'Admin', value: 'admin' },
                      { label: 'Campaign Manager', value: 'campaign-manager' },
                      { label: 'Viewer', value: 'viewer' },
                      { label: 'Finance', value: 'finance' },
                    ],
                    selectedValues: roleFilter,
                    onChange: setRoleFilter,
                  },
                  {
                    name: 'Organisation',
                    options: [
                      { label: 'Unilever', value: 'unilever' },
                      { label: 'Coca-Cola', value: 'coca-cola' },
                      { label: 'FrieslandCampina', value: 'frieslandcampina' },
                      { label: 'Procter & Gamble', value: 'procter-gamble' },
                      { label: 'Nestlé', value: 'nestlé' },
                      { label: 'Heineken', value: 'heineken' },
                      { label: 'Mars', value: 'mars' },
                      { label: 'Danone', value: 'danone' },
                      { label: "L'Oréal", value: 'loréal' },
                      { label: 'Philips', value: 'philips' },
                    ],
                    selectedValues: organisationFilter,
                    onChange: setOrganisationFilter,
                  },
                ]}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search users..."
              />
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  { key: 'name', header: 'Name' },
                  { key: 'email', header: 'Email' },
                  { key: 'organisation', header: 'Organisation' },
                  {
                    key: 'role',
                    header: 'Role',
                    render: (row) => <Badge variant="outline">{row.role}</Badge>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) => (
                      <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>
                        {row.status}
                      </Badge>
                    ),
                  },
                ]}
                data={filteredData}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.name}`)}
              />
              <div className="flex justify-end pt-4">
                <Button>Invite user</Button>
              </div>
            </CardContent>
          </Card>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
