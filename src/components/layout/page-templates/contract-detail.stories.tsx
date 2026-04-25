import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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

const contractBrands = [
  { id: 'BRD-001', name: 'Coca-Cola', category: 'Beverages', spendLimit: '€50,000', status: 'Active' as const },
  { id: 'BRD-002', name: 'Coca-Cola Zero', category: 'Beverages', spendLimit: '€30,000', status: 'Active' as const },
  { id: 'BRD-003', name: 'Sprite', category: 'Beverages', spendLimit: '€20,000', status: 'Inactive' as const },
];

const permissions = [
  { id: 'p1', label: 'Sponsored products', description: 'Create and manage sponsored product campaigns', enabled: true },
  { id: 'p2', label: 'Display', description: 'Access display advertising inventory', enabled: true },
  { id: 'p3', label: 'Digital in-store', description: 'Access digital in-store screens', enabled: false },
  { id: 'p4', label: 'Offsite', description: 'Run offsite programmatic campaigns', enabled: false },
  { id: 'p5', label: 'Reporting', description: 'View performance reports and analytics', enabled: true },
];

interface ContractDetailContentProps {
  contractName: string;
  retailer: string;
  partner: string;
  partnerType: string;
}

const ContractDetailContent = ({ contractName, retailer, partner, partnerType }: ContractDetailContentProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [contractType, setContractType] = React.useState('standard');
  const [status, setStatus] = React.useState('active');
  const [perms, setPerms] = React.useState(permissions);

  const togglePerm = (id: string) =>
    setPerms(p => p.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardWithTabs
          className="w-full"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          action={
            activeTab === 'details' ? <Button>Save</Button> :
            activeTab === 'brands' ? <Button>Add brand</Button> : null
          }
          header={
            activeTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">Contract name</label>
                  <Input defaultValue={contractName} placeholder="Enter contract name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Input dropdown options={[
                    { label: 'Standard', value: 'standard' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'Enterprise', value: 'enterprise' },
                  ]} value={contractType} onChange={setContractType} placeholder="Select type" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Retailer</label>
                  <Input defaultValue={retailer} readOnly className="text-muted-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Partner ({partnerType})</label>
                  <Input defaultValue={partner} readOnly className="text-muted-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start date</label>
                  <Input defaultValue="01-01-2024" placeholder="DD-MM-YYYY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End date</label>
                  <Input defaultValue="31-12-2024" placeholder="DD-MM-YYYY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total budget</label>
                  <Input defaultValue="€500,000" placeholder="Enter total budget" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Input dropdown options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Pending', value: 'pending' },
                  ]} value={status} onChange={setStatus} placeholder="Select status" />
                </div>
              </div>
            ) : null
          }
          tabs={[
            { label: 'Details', value: 'details', content: null },
            {
              label: 'Brands',
              value: 'brands',
              content: (
                <div className="mt-6">
                  <Table
                    columns={[
                      { key: 'name', header: 'Brand' },
                      { key: 'category', header: 'Category' },
                      { key: 'spendLimit', header: 'Spend limit' },
                      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge> },
                    ]}
                    data={contractBrands}
                    rowKey={(row) => row.id}
                    onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                  />
                </div>
              ),
            },
            {
              label: 'Permissions',
              value: 'permissions',
              content: (
                <div className="mt-6">
                  <div className="border border-border rounded-lg divide-y divide-border">
                    {perms.map((p) => (
                      <div key={p.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{p.label}</p>
                          <p className="text-xs text-muted-foreground">{p.description}</p>
                        </div>
                        <Switch checked={p.enabled} onCheckedChange={() => togglePerm(p.id)} />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Right sidebar */}
      <div className="space-y-6 pt-14">
        <Card>
          <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Retailer</p>
                <p className="font-medium text-sm">{retailer}</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{partnerType}</p>
                <p className="font-medium text-sm">{partner}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total budget</span>
                <span className="font-medium">€500,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">€212,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium text-primary">€287,550</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '42.5%' }} />
              </div>
              <p className="text-xs text-muted-foreground">42.5% used</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ContractDetail: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'Coca-Cola Standard 2024', subtitle: 'Standard · Active · Jan–Dec 2024', onEdit: () => alert('Edit clicked'), onExport: () => alert('Export clicked'), onSettings: () => alert('Settings clicked') }}>
          <ContractDetailContent
            contractName="Coca-Cola Standard 2024"
            retailer="Albert Heijn"
            partner="The Coca-Cola Company"
            partnerType="Advertiser"
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const ContractDetailAgency: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'GroupM Agency Agreement 2024', subtitle: 'Enterprise · Active · Jan–Dec 2024', onEdit: () => alert('Edit clicked'), onSettings: () => alert('Settings clicked') }}>
          <ContractDetailContent
            contractName="GroupM Agency Agreement 2024"
            retailer="Albert Heijn"
            partner="GroupM Netherlands"
            partnerType="Agency"
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
