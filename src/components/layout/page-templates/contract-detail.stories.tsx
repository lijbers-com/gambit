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
import { Building2, Users } from 'lucide-react';

type CampaignAccess = 'edit' | 'view' | 'none';
import * as React from 'react';

const InfoRow = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-foreground/70 shrink-0" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Configuration Details',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AppLayout>;

const permissions = [
  { id: 'p1', label: 'Sponsored products', description: 'Create and manage sponsored product campaigns', enabled: true },
  { id: 'p2', label: 'Display', description: 'Access display advertising inventory', enabled: true },
  { id: 'p3', label: 'Digital in-store', description: 'Access digital in-store screens', enabled: false },
  { id: 'p4', label: 'Offsite', description: 'Run offsite programmatic campaigns', enabled: false },
  { id: 'p5', label: 'Reporting', description: 'View performance reports and analytics', enabled: true },
];

interface Partner {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Inactive';
  campaignAccess: CampaignAccess;
}

interface Brand {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive';
}

interface ContractDetailContentProps {
  contractName: string;
  advertiser: string;
  partners: Partner[];
  brands: Brand[];
}

const AccessToggle = ({ value, onChange }: { value: CampaignAccess; onChange: (v: CampaignAccess) => void }) => (
  <Input
    dropdown
    options={[
      { label: 'Edit', value: 'edit' },
      { label: 'View', value: 'view' },
      { label: 'No share', value: 'none' },
    ]}
    value={value}
    onChange={(v) => onChange(v as CampaignAccess)}
    className="w-32"
  />
);

const ContractDetailContent = ({ contractName, advertiser, partners, brands }: ContractDetailContentProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [contractType, setContractType] = React.useState('standard');
  const [status, setStatus] = React.useState('active');
  const [perms, setPerms] = React.useState(permissions);
  const [partnerList, setPartnerList] = React.useState(partners);

  const updateAccess = (id: string, access: CampaignAccess) =>
    setPartnerList(p => p.map(x => x.id === id ? { ...x, campaignAccess: access } : x));

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
            activeTab === 'partners' ? <Button>Add partner</Button> :
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
                  <label className="block text-sm font-medium mb-1">Advertiser</label>
                  <Input defaultValue={advertiser} readOnly className="text-muted-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Input dropdown options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Pending', value: 'pending' },
                  ]} value={status} onChange={setStatus} placeholder="Select status" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start date</label>
                  <Input defaultValue="01-01-2024" placeholder="DD-MM-YYYY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End date</label>
                  <Input defaultValue="31-12-2024" placeholder="DD-MM-YYYY" />
                </div>
              </div>
            ) : null
          }
          tabs={[
            { label: 'Details', value: 'details', content: null },
            {
              label: 'Partners',
              value: 'partners',
              content: (
                <div className="mt-6">
                  <Table
                    columns={[
                      { key: 'name', header: 'Partner' },
                      { key: 'type', header: 'Type' },
                      {
                        key: 'status',
                        header: 'Status',
                        render: (row: Partner) => (
                          <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge>
                        ),
                      },
                      {
                        key: 'campaignAccess',
                        header: 'Campaign sharing',
                        render: (row: Partner) => (
                          <AccessToggle
                            value={row.campaignAccess}
                            onChange={(v) => updateAccess(row.id, v)}
                          />
                        ),
                      },
                    ]}
                    data={partnerList}
                    rowKey={(row: Partner) => row.id}
                    hideActions
                  />
                </div>
              ),
            },
            {
              label: 'Brands',
              value: 'brands',
              content: (
                <div className="mt-6">
                  <Table
                    columns={[
                      { key: 'name', header: 'Brand' },
                      { key: 'category', header: 'Category' },
                      {
                        key: 'status',
                        header: 'Status',
                        render: (row: Brand) => (
                          <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge>
                        ),
                      },
                    ]}
                    data={brands}
                    rowKey={(row: Brand) => row.id}
                    onRowClick={(row: Brand) => alert(`Navigate to ${row.name}`)}
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
          <CardHeader><CardTitle>Advertiser</CardTitle></CardHeader>
          <CardContent>
            <InfoRow icon={Building2} title={advertiser} subtitle="Advertiser" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Partners</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {partnerList.map((partner) => (
                <InfoRow key={partner.id} icon={Users} title={partner.name} subtitle={partner.type} />
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <Button variant="outline" size="sm">Add partner</Button>
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
            advertiser="The Coca-Cola Company"
            partners={[
              { id: 'ORG-001', name: 'GroupM Netherlands', type: 'Media agency', status: 'Active', campaignAccess: 'edit' },
              { id: 'ORG-002', name: 'Publicis Media', type: 'Media agency', status: 'Active', campaignAccess: 'view' },
            ]}
            brands={[
              { id: 'BRD-001', name: 'Coca-Cola', category: 'Beverages', status: 'Active' },
              { id: 'BRD-002', name: 'Coca-Cola Zero', category: 'Beverages', status: 'Active' },
              { id: 'BRD-003', name: 'Sprite', category: 'Beverages', status: 'Inactive' },
            ]}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const ContractDetailShared: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'Fanta Shared Partnership 2024', subtitle: 'Standard · Active · Jan–Dec 2024', onEdit: () => alert('Edit clicked'), onSettings: () => alert('Settings clicked') }}>
          <ContractDetailContent
            contractName="Fanta Shared Partnership 2024"
            advertiser="The Coca-Cola Company"
            partners={[
              { id: 'ORG-001', name: 'GroupM Netherlands', type: 'Media agency', status: 'Active', campaignAccess: 'edit' },
              { id: 'ORG-002', name: 'OMD Netherlands', type: 'Media agency', status: 'Active', campaignAccess: 'edit' },
              { id: 'ORG-003', name: 'Wavemaker', type: 'Media agency', status: 'Inactive', campaignAccess: 'none' },
            ]}
            brands={[
              { id: 'BRD-004', name: 'Fanta', category: 'Beverages', status: 'Active' },
            ]}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
