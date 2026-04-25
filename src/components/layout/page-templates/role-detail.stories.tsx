import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Configuration Details',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const assignedUsers = [
  { id: 'USR-001', name: 'John Smith', email: 'john.smith@unilever.com', organisation: 'Unilever', assignedDate: '12-01-2024' },
  { id: 'USR-002', name: 'Sarah Johnson', email: 's.johnson@coca-cola.com', organisation: 'Coca-Cola', assignedDate: '15-02-2024' },
  { id: 'USR-003', name: 'Michael van den Berg', email: 'm.vandenberg@frieslandcampina.com', organisation: 'FrieslandCampina', assignedDate: '03-03-2024' },
];

interface RoleDetailContentProps {
  roleName: string;
  roleDescription: string;
  allPermissionsOn?: boolean;
}

const RoleDetailContent = ({ roleName, roleDescription, allPermissionsOn = false }: RoleDetailContentProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [proposition, setProposition] = React.useState('all');
  const [searchValue, setSearchValue] = React.useState('');

  // Campaigns permissions
  const [canCreate, setCanCreate] = React.useState<boolean>(allPermissionsOn || true);
  const [canEdit, setCanEdit] = React.useState<boolean>(allPermissionsOn || true);
  const [canDelete, setCanDelete] = React.useState<boolean>(allPermissionsOn || false);
  const [canPublish, setCanPublish] = React.useState<boolean>(allPermissionsOn || true);
  // Bookings permissions
  const [canCreateBooking, setCanCreateBooking] = React.useState<boolean>(allPermissionsOn || true);
  const [canEditBooking, setCanEditBooking] = React.useState<boolean>(allPermissionsOn || true);
  const [canApproveBooking, setCanApproveBooking] = React.useState<boolean>(allPermissionsOn || false);
  // Creatives permissions
  const [canUploadCreative, setCanUploadCreative] = React.useState<boolean>(allPermissionsOn || true);
  const [canApproveCreative, setCanApproveCreative] = React.useState<boolean>(allPermissionsOn || false);
  const [canDeleteCreative, setCanDeleteCreative] = React.useState<boolean>(allPermissionsOn || false);
  // Reports permissions
  const [canViewReports, setCanViewReports] = React.useState<boolean>(allPermissionsOn || true);
  const [canExportReports, setCanExportReports] = React.useState<boolean>(allPermissionsOn || false);
  // Admin permissions
  const [canManageUsers, setCanManageUsers] = React.useState<boolean>(allPermissionsOn || false);
  const [canManageRoles, setCanManageRoles] = React.useState<boolean>(allPermissionsOn || false);

  const permissionRow = (label: string, checked: boolean, onChange: (v: boolean) => void) => (
    <div className="flex items-center justify-between py-2 border-b">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <CardWithTabs
      header={
        activeTab === 'details' ? (
          <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <FormSection title="Role">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input defaultValue={roleName} placeholder="Enter role name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    defaultValue={roleDescription}
                  />
                </div>
              </div>
            </FormSection>
            <FormSection title="Scope">
              <div>
                <label className="block text-sm font-medium mb-1">Proposition</label>
                <Input
                  dropdown
                  options={[
                    { label: 'All', value: 'all' },
                    { label: 'Display', value: 'display' },
                    { label: 'Sponsored Products', value: 'sponsored-products' },
                    { label: 'Digital In-store', value: 'digital-instore' },
                    { label: 'Offsite', value: 'offsite' },
                  ]}
                  value={proposition}
                  onChange={setProposition}
                  placeholder="Select proposition"
                />
              </div>
            </FormSection>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
          </form>
        ) : null
      }
      tabs={[
        {
          label: 'Details',
          value: 'details',
          content: null,
        },
        {
          label: 'Permissions',
          value: 'permissions',
          content: (
            <div className="mt-6 max-w-2xl">
              <h3 className="font-medium text-sm mb-2 mt-4">Campaigns</h3>
              {permissionRow('Create', canCreate, setCanCreate)}
              {permissionRow('Edit', canEdit, setCanEdit)}
              {permissionRow('Delete', canDelete, setCanDelete)}
              {permissionRow('Publish', canPublish, setCanPublish)}

              <h3 className="font-medium text-sm mb-2 mt-4">Bookings</h3>
              {permissionRow('Create', canCreateBooking, setCanCreateBooking)}
              {permissionRow('Edit', canEditBooking, setCanEditBooking)}
              {permissionRow('Approve', canApproveBooking, setCanApproveBooking)}

              <h3 className="font-medium text-sm mb-2 mt-4">Creatives</h3>
              {permissionRow('Upload', canUploadCreative, setCanUploadCreative)}
              {permissionRow('Approve', canApproveCreative, setCanApproveCreative)}
              {permissionRow('Delete', canDeleteCreative, setCanDeleteCreative)}

              <h3 className="font-medium text-sm mb-2 mt-4">Reports</h3>
              {permissionRow('View', canViewReports, setCanViewReports)}
              {permissionRow('Export', canExportReports, setCanExportReports)}

              <h3 className="font-medium text-sm mb-2 mt-4">Admin</h3>
              {permissionRow('Manage users', canManageUsers, setCanManageUsers)}
              {permissionRow('Manage roles', canManageRoles, setCanManageRoles)}
            </div>
          ),
        },
        {
          label: 'Users',
          value: 'users',
          content: (
            <div className="space-y-6 mt-6">
              <FilterBar
                filters={[]}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search users..."
              />
              <Table
                columns={[
                  { key: 'name', header: 'Name' },
                  { key: 'email', header: 'Email' },
                  { key: 'organisation', header: 'Organisation' },
                  { key: 'assignedDate', header: 'Assigned date' },
                ]}
                data={assignedUsers.filter(u =>
                  searchValue === '' || u.name.toLowerCase().includes(searchValue.toLowerCase()) || u.email.toLowerCase().includes(searchValue.toLowerCase())
                )}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.name}`)}
              />
            </div>
          ),
        },
      ]}
      action={activeTab === 'users' ? <Button>Assign user</Button> : null}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export const RoleDetailCampaignManager: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Campaign Manager',
            subtitle: 'Role definition · All propositions',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <RoleDetailContent
            roleName="Campaign Manager"
            roleDescription="Can create and manage campaigns across all propositions. Cannot delete campaigns or manage other users."
            allPermissionsOn={false}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const RoleDetailAdmin: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Admin',
            subtitle: 'Role definition · All propositions',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <RoleDetailContent
            roleName="Admin"
            roleDescription="Full access to all platform features including user management, role management, and all campaign operations."
            allPermissionsOn={true}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
