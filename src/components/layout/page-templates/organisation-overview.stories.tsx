import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
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

const userData = [
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

const rowActionMenu = (name: string) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="p-1 rounded hover:bg-muted">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem onClick={() => alert(`Select ${name}`)}>Select</DropdownMenuItem>
      <DropdownMenuItem onClick={() => alert(`Edit ${name}`)}>Edit</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const OrganisationOverview: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [activeTab, setActiveTab] = React.useState('organisations');

    // Organisations tab state
    const [orgStatusFilter, setOrgStatusFilter] = React.useState<string[]>([]);
    const [orgTypeFilter, setOrgTypeFilter] = React.useState<string[]>([]);
    const [orgSearch, setOrgSearch] = React.useState('');

    // Users tab state
    const [userStatusFilter, setUserStatusFilter] = React.useState<string[]>([]);
    const [userRoleFilter, setUserRoleFilter] = React.useState<string[]>([]);
    const [userSearch, setUserSearch] = React.useState('');

    const filteredOrgs = organisationData.filter(row => {
      const statusMatch = orgStatusFilter.length === 0 || orgStatusFilter.includes(row.status.toLowerCase());
      const typeMatch = orgTypeFilter.length === 0 || orgTypeFilter.includes(row.type.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
      const searchMatch = orgSearch === '' || row.name.toLowerCase().includes(orgSearch.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });

    const filteredUsers = userData.filter(row => {
      const statusMatch = userStatusFilter.length === 0 || userStatusFilter.includes(row.status.toLowerCase());
      const roleMatch = userRoleFilter.length === 0 || userRoleFilter.includes(row.role.toLowerCase().replace(/ /g, '-'));
      const searchMatch = userSearch === '' || row.name.toLowerCase().includes(userSearch.toLowerCase()) || row.email.toLowerCase().includes(userSearch.toLowerCase());
      return statusMatch && roleMatch && searchMatch;
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
            title: 'Organisations & users',
            subtitle: 'Manage all partner organisations and platform users',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <CardWithTabs
            tabs={[
              {
                label: 'Organisations',
                value: 'organisations',
                content: (
                  <div className="space-y-6 mt-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Status',
                          options: [
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                          ],
                          selectedValues: orgStatusFilter,
                          onChange: setOrgStatusFilter,
                        },
                        {
                          name: 'Type',
                          options: [
                            { label: 'Advertiser', value: 'advertiser' },
                            { label: 'Agency', value: 'agency' },
                            { label: 'Debtor', value: 'debtor' },
                            { label: 'Debtor & Advertiser', value: 'debtor-advertiser' },
                          ],
                          selectedValues: orgTypeFilter,
                          onChange: setOrgTypeFilter,
                        },
                      ]}
                      searchValue={orgSearch}
                      onSearchChange={setOrgSearch}
                      searchPlaceholder="Search organisations..."
                    />
                    <Table
                      columns={[
                        { key: 'actions', header: '', render: (row) => rowActionMenu(row.name) },
                        { key: 'name', header: 'Name' },
                        { key: 'brands', header: 'Brands', render: (row) => <Badge variant="secondary">{row.brands}</Badge> },
                        { key: 'type', header: 'Type' },
                        { key: 'users', header: 'Users', render: (row) => <Badge variant="secondary">{row.users}</Badge> },
                        { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge> },
                      ]}
                      data={filteredOrgs}
                      rowKey={(row) => row.id}
                      onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                    />
                  </div>
                ),
              },
              {
                label: 'Users',
                value: 'users',
                content: (
                  <div className="space-y-6 mt-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Status',
                          options: [
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                          ],
                          selectedValues: userStatusFilter,
                          onChange: setUserStatusFilter,
                        },
                        {
                          name: 'Role',
                          options: [
                            { label: 'Admin', value: 'admin' },
                            { label: 'Campaign Manager', value: 'campaign-manager' },
                            { label: 'Viewer', value: 'viewer' },
                            { label: 'Finance', value: 'finance' },
                          ],
                          selectedValues: userRoleFilter,
                          onChange: setUserRoleFilter,
                        },
                      ]}
                      searchValue={userSearch}
                      onSearchChange={setUserSearch}
                      searchPlaceholder="Search users..."
                    />
                    <Table
                      columns={[
                        { key: 'actions', header: '', render: (row) => rowActionMenu(row.name) },
                        { key: 'name', header: 'Name' },
                        { key: 'email', header: 'Email' },
                        { key: 'organisation', header: 'Organisation' },
                        { key: 'role', header: 'Role', render: (row) => <Badge variant="outline">{row.role}</Badge> },
                        { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge> },
                      ]}
                      data={filteredUsers}
                      rowKey={(row) => row.id}
                      onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                    />
                  </div>
                ),
              },
            ]}
            action={activeTab === 'organisations' ? <Button>Add organisation</Button> : <Button>Invite user</Button>}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
