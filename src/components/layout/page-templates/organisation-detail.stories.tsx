import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FormSection } from '@/components/ui/form-section';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Organisation Detail',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

interface OrganisationDetailProps {
  orgName: string;
  orgType: string;
}

const OrganisationDetailContent = ({ orgName, orgType }: OrganisationDetailProps) => {
  const [isAdvertiser, setIsAdvertiser] = React.useState(orgType === 'Advertiser' || orgType === 'Debtor & Advertiser');
  const [isNonEndemic, setIsNonEndemic] = React.useState(false);
  const [isAgency, setIsAgency] = React.useState(orgType === 'Agency');
  const [isRetailer, setIsRetailer] = React.useState(false);
  const [status, setStatus] = React.useState('active');

  const mediaPartners = [
    { id: 'MP-001', name: 'Unilever', brands: 'All', users: 45, debtor: 'Unilever' },
    { id: 'MP-002', name: 'Coca Cola', brands: 45, users: 45, debtor: 'Unilever' },
    { id: 'MP-003', name: 'FrieslandCampina', brands: 12, users: 22, debtor: 'FrieslandCampina' },
  ];

  const groups = [
    { id: 'GRP-001', name: 'Sponsored products teams', users: 45 },
    { id: 'GRP-002', name: 'Digital media instore team', users: 45 },
  ];

  const apiKeys = [
    { id: 'KEY-001', name: 'Test token', access: 'Read only', permissions: 'All', date: '17-10-2024' },
  ];

  const brands = ['Unox', 'Unox', 'Unox', 'Unox'];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left column */}
      <div className="col-span-2 space-y-6">
        {/* Details Card */}
        <Card>
          <CardContent className="p-6">
            <FormSection title="Details">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input defaultValue={orgName} placeholder="Enter organisation name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="advertiser"
                      checked={isAdvertiser}
                      onCheckedChange={(v) => setIsAdvertiser(!!v)}
                    />
                    <label htmlFor="advertiser" className="text-sm cursor-pointer">Advertiser</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="nonEndemic"
                      checked={isNonEndemic}
                      onCheckedChange={(v) => setIsNonEndemic(!!v)}
                    />
                    <label htmlFor="nonEndemic" className="text-sm cursor-pointer">Non-Endemic advertiser</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="agency"
                      checked={isAgency}
                      onCheckedChange={(v) => setIsAgency(!!v)}
                    />
                    <label htmlFor="agency" className="text-sm cursor-pointer">Agency</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="retailer"
                      checked={isRetailer}
                      onCheckedChange={(v) => setIsRetailer(!!v)}
                    />
                    <label htmlFor="retailer" className="text-sm cursor-pointer">Retailer</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Input
                  dropdown
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                  value={status}
                  onChange={setStatus}
                  placeholder="Select status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="flex border border-input rounded-md w-full p-2 text-sm min-h-[80px] bg-transparent shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Enter description"
                />
              </div>
              <div className="flex justify-end">
                <Button>Save</Button>
              </div>
            </div>
            </FormSection>
          </CardContent>
        </Card>

        {/* Media partners Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Media partners you can advertise for</h2>
            <Table
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'brands', header: 'Brands', render: (row) => <Badge variant="secondary">{row.brands}</Badge> },
                { key: 'users', header: 'Users', render: (row) => <Badge variant="secondary">{row.users}</Badge> },
                { key: 'debtor', header: 'Debtor' },
              ]}
              data={mediaPartners}
              rowKey={(row) => row.id}
              onRowClick={(row) => alert(`Navigate to ${row.name}`)}
            />
            <div className="flex justify-end pt-4">
              <Button>Set up Media Partner</Button>
            </div>
          </CardContent>
        </Card>

        {/* Groups Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Groups</h2>
            <Table
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'users', header: 'Users', render: (row) => <Badge variant="secondary">{row.users}</Badge> },
              ]}
              data={groups}
              rowKey={(row) => row.id}
              onRowClick={(row) => alert(`Navigate to ${row.name}`)}
            />
            <div className="flex justify-end pt-4">
              <Button>Add Group</Button>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">API keys</h2>
            <Table
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'access', header: 'Repository access' },
                { key: 'permissions', header: 'Repository Permissions' },
                { key: 'date', header: 'Date' },
              ]}
              data={apiKeys}
              rowKey={(row) => row.id}
            />
            <div className="flex justify-end pt-4">
              <Button>New token</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="col-span-1 space-y-6">
        {/* Users Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">Users</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">John Smith</p>
                <p className="text-xs text-muted-foreground">3000 users · 45 brands</p>
              </div>
              <div>
                <p className="font-medium text-sm">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">120 users · 12 brands</p>
              </div>
              <div>
                <p className="font-medium text-sm">Michael van den Berg</p>
                <p className="text-xs text-muted-foreground">45 users · 8 brands</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brands Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">Brands</h2>
            <div className="space-y-3">
              {brands.map((brand, i) => (
                <div key={i}>
                  <p className="font-medium text-sm">{brand}</p>
                  <p className="text-xs text-muted-foreground">General roles</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button>Assign/Revoke role</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const OrganisationDetail: Story = {
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
            title: 'Unilever',
            subtitle: 'Agency · Active',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <OrganisationDetailContent orgName="Unilever" orgType="Agency" />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const OrganisationDetailAdvertiser: Story = {
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
            title: 'Coca-Cola',
            subtitle: 'Advertiser · Active',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <OrganisationDetailContent orgName="Coca-Cola" orgType="Advertiser" />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
