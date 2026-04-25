import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Configuration Details',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AppLayout>;

interface OrganisationDetailProps {
  orgName: string;
  orgType: string;
}

const OrganisationDetailContent = ({ orgName, orgType }: OrganisationDetailProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
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

  const users = [
    { name: 'John Smith', meta: 'Admin' },
    { name: 'Sarah Johnson', meta: 'Campaign Manager' },
    { name: 'Michael van den Berg', meta: 'Viewer' },
  ];

  const brands = ['Unox', 'Dove', 'Axe', 'Magnum'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardWithTabs
          className="w-full"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          action={activeTab === 'details' ? <Button>Save</Button> : activeTab === 'contracts' ? <Button>Add contract</Button> : activeTab === 'groups' ? <Button>Add group</Button> : activeTab === 'api-keys' ? <Button>New token</Button> : null}
          header={
            activeTab === 'details' ? (
              <div className="space-y-4 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input defaultValue={orgName} placeholder="Enter organisation name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="space-y-2">
                    {[
                      { id: 'advertiser', label: 'Advertiser', checked: isAdvertiser, onChange: (v: boolean) => setIsAdvertiser(v) },
                      { id: 'nonEndemic', label: 'Non-Endemic advertiser', checked: isNonEndemic, onChange: (v: boolean) => setIsNonEndemic(v) },
                      { id: 'agency', label: 'Agency', checked: isAgency, onChange: (v: boolean) => setIsAgency(v) },
                      { id: 'retailer', label: 'Retailer', checked: isRetailer, onChange: (v: boolean) => setIsRetailer(v) },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Checkbox id={item.id} checked={item.checked} onCheckedChange={(v) => item.onChange(!!v)} />
                        <label htmlFor={item.id} className="text-sm cursor-pointer">{item.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Input dropdown options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]} value={status} onChange={setStatus} placeholder="Select status" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="flex border border-input rounded-md w-full p-2 text-sm min-h-[80px] bg-transparent shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Enter description" />
                </div>
              </div>
            ) : null
          }
          tabs={[
            { label: 'Details', value: 'details', content: null },
            {
              label: 'Contracts',
              value: 'contracts',
              content: (
                <div className="mt-6">
                  <Table
                    columns={[
                      { key: 'name', header: 'Contract' },
                      { key: 'brands', header: 'Brands', render: (row) => <Badge variant="secondary">{row.brands}</Badge> },
                      { key: 'users', header: 'Users', render: (row) => <Badge variant="secondary">{row.users}</Badge> },
                      { key: 'debtor', header: 'Retailer' },
                    ]}
                    data={mediaPartners}
                    rowKey={(row) => row.id}
                    onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                  />
                </div>
              ),
            },
            {
              label: 'Groups',
              value: 'groups',
              content: (
                <div className="mt-6">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'users', header: 'Users', render: (row) => <Badge variant="secondary">{row.users}</Badge> },
                    ]}
                    data={groups}
                    rowKey={(row) => row.id}
                    onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                  />
                </div>
              ),
            },
            {
              label: 'API keys',
              value: 'api-keys',
              content: (
                <div className="mt-6">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'access', header: 'Repository access' },
                      { key: 'permissions', header: 'Permissions' },
                      { key: 'date', header: 'Date' },
                    ]}
                    data={apiKeys}
                    rowKey={(row) => row.id}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Right sidebar */}
      <div className="space-y-6 pt-14">
        <Card>
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.name}>
                  <p className="font-medium text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.meta}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Brands</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand}>
                  <p className="font-medium text-sm">{brand}</p>
                  <p className="text-xs text-muted-foreground">General roles</p>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <Button variant="outline" size="sm">Assign/Revoke role</Button>
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
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'Unilever', subtitle: 'Agency · Active', onEdit: () => alert('Edit clicked'), onExport: () => alert('Export clicked'), onSettings: () => alert('Settings clicked') }}>
          <OrganisationDetailContent orgName="Unilever" orgType="Agency" />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const OrganisationDetailAdvertiser: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'Coca-Cola', subtitle: 'Advertiser · Active', onEdit: () => alert('Edit clicked'), onExport: () => alert('Export clicked'), onSettings: () => alert('Settings clicked') }}>
          <OrganisationDetailContent orgName="Coca-Cola" orgType="Advertiser" />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
