import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Contract Detail',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const brandsData = [
  { id: 'BR-001', brand: 'Coca-Cola Classic', products: 24, spendLimit: '$50,000', status: 'Active' },
  { id: 'BR-002', brand: 'Coca-Cola Zero Sugar', products: 18, spendLimit: '$30,000', status: 'Active' },
  { id: 'BR-003', brand: 'Sprite', products: 12, spendLimit: '$20,000', status: 'Inactive' },
];

const campaignsData = [
  { id: 'C-001', campaign: 'Summer Refresh Display', engine: 'Display', status: 'Running', spend: '$12,450' },
  { id: 'C-002', campaign: 'Zero Sugar Sponsored Push', engine: 'Sponsored Products', status: 'Ready', spend: '$8,200' },
  { id: 'C-003', campaign: 'Holiday Season Offsite', engine: 'Offsite', status: 'In option', spend: '$5,600' },
];

interface ContractDetailContentProps {
  initialStatus: string;
}

const ContractDetailContent = ({ initialStatus }: ContractDetailContentProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [contractStatus, setContractStatus] = React.useState(initialStatus);
  const [contractType, setContractType] = React.useState('standard');
  const [advertiser, setAdvertiser] = React.useState('coca-cola');
  const [agency, setAgency] = React.useState('groupm');
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-01-01'));
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-12-31'));
  const [searchValue, setSearchValue] = React.useState('');

  const [perm1, setPerm1] = React.useState(true);
  const [perm2, setPerm2] = React.useState(true);
  const [perm3, setPerm3] = React.useState(false);
  const [perm4, setPerm4] = React.useState(true);
  const [perm5, setPerm5] = React.useState(false);
  const [perm6, setPerm6] = React.useState(false);

  const statusVariant = (s: string) => {
    switch (s) {
      case 'Active': return 'default' as const;
      case 'Expired': return 'destructive' as const;
      case 'Draft': return 'outline' as const;
      case 'Running': return 'default' as const;
      case 'Ready': return 'secondary' as const;
      case 'In option': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <CardWithTabs
      header={
        activeTab === 'details' ? (
          <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <FormSection title="Contract">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input defaultValue="Agency Partnership — Coca-Cola 2024" placeholder="Enter contract name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Expired', value: 'expired' },
                      { label: 'Draft', value: 'draft' },
                    ]}
                    value={contractStatus}
                    onChange={setContractStatus}
                    placeholder="Select status"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contract type</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Standard', value: 'standard' },
                      { label: 'Exclusive', value: 'exclusive' },
                      { label: 'Co-op', value: 'co-op' },
                    ]}
                    value={contractType}
                    onChange={setContractType}
                    placeholder="Select contract type"
                  />
                </div>
              </div>
            </FormSection>
            <FormSection title="Parties">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Advertiser</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Coca-Cola', value: 'coca-cola' },
                      { label: 'Unilever', value: 'unilever' },
                      { label: 'FrieslandCampina', value: 'frieslandcampina' },
                    ]}
                    value={advertiser}
                    onChange={setAdvertiser}
                    placeholder="Select advertiser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Agency</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'GroupM', value: 'groupm' },
                      { label: 'Publicis', value: 'publicis' },
                      { label: 'WPP', value: 'wpp' },
                      { label: 'OMD', value: 'omd' },
                    ]}
                    value={agency}
                    onChange={setAgency}
                    placeholder="Select agency"
                  />
                </div>
              </div>
            </FormSection>
            <FormSection title="Duration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start date</label>
                  <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End date</label>
                  <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                </div>
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
          label: 'Brands',
          value: 'brands',
          content: (
            <div className="space-y-6 mt-6">
              <FilterBar
                filters={[]}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search brands..."
              />
              <Table
                columns={[
                  { key: 'brand', header: 'Brand' },
                  { key: 'products', header: 'Products', render: (row) => <Badge variant="secondary">{row.products}</Badge> },
                  { key: 'spendLimit', header: 'Spend limit' },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>,
                  },
                ]}
                data={brandsData.filter(b =>
                  searchValue === '' || b.brand.toLowerCase().includes(searchValue.toLowerCase())
                )}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.brand}`)}
              />
            </div>
          ),
        },
        {
          label: 'Campaigns',
          value: 'campaigns',
          content: (
            <div className="space-y-6 mt-6">
              <Table
                columns={[
                  { key: 'campaign', header: 'Campaign' },
                  { key: 'engine', header: 'Engine' },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>,
                  },
                  { key: 'spend', header: 'Spend' },
                ]}
                data={campaignsData}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.campaign}`)}
              />
            </div>
          ),
        },
        {
          label: 'Permissions',
          value: 'permissions',
          content: (
            <div className="space-y-2 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {[
                  { id: 'perm1', label: 'Create campaigns', checked: perm1, onChange: setPerm1 },
                  { id: 'perm2', label: 'Edit budgets', checked: perm2, onChange: setPerm2 },
                  { id: 'perm3', label: 'Approve creatives', checked: perm3, onChange: setPerm3 },
                  { id: 'perm4', label: 'View reports', checked: perm4, onChange: setPerm4 },
                  { id: 'perm5', label: 'Export data', checked: perm5, onChange: setPerm5 },
                  { id: 'perm6', label: 'Manage users', checked: perm6, onChange: setPerm6 },
                ].map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between py-3 border-b">
                    <Label htmlFor={perm.id} className="text-sm cursor-pointer">{perm.label}</Label>
                    <Switch
                      id={perm.id}
                      checked={perm.checked}
                      onCheckedChange={perm.onChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ]}
      action={
        activeTab === 'brands' ? <Button>Add brand</Button> :
        activeTab === 'campaigns' ? <Button>Add campaign</Button> :
        null
      }
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export const ContractDetail: Story = {
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
            title: 'Agency Partnership — Coca-Cola 2024',
            subtitle: 'Contract between GroupM and Coca-Cola · Active',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <ContractDetailContent initialStatus="active" />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const ContractDetailDraft: Story = {
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
            title: 'Agency Partnership — Coca-Cola 2025',
            subtitle: 'Contract between Publicis and Coca-Cola · Draft',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <ContractDetailContent initialStatus="draft" />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
