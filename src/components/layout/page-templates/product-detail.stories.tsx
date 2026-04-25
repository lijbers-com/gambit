import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Product Detail',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const relatedCampaigns = [
  { id: 'C-001', name: 'Summer Refresh 2024', engine: 'Display', status: 'Running', start: '01-06-2024', end: '31-08-2024' },
  { id: 'C-002', name: 'Zero Sugar Push', engine: 'Sponsored Products', status: 'Ready', start: '01-07-2024', end: '31-07-2024' },
  { id: 'C-003', name: 'Holiday Season 2024', engine: 'Offsite', status: 'In option', start: '01-11-2024', end: '31-12-2024' },
];

const campaignStatusVariant = (status: string) => {
  switch (status) {
    case 'Running': return 'default' as const;
    case 'Ready': return 'secondary' as const;
    case 'In option': return 'outline' as const;
    default: return 'outline' as const;
  }
};

const ProductDetailContent = () => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [status, setStatus] = React.useState('active');
  const [category, setCategory] = React.useState('beverages');
  const [brand, setBrand] = React.useState('coca-cola');

  return (
    <CardWithTabs
      header={
        activeTab === 'details' ? (
          <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <FormSection title="Product">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input defaultValue="CC-1000-330ML" placeholder="Enter SKU" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input defaultValue="Coca-Cola Classic 330ml Can" placeholder="Enter product name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Coca-Cola', value: 'coca-cola' },
                      { label: 'Coca-Cola Zero', value: 'coca-cola-zero' },
                      { label: 'Unox', value: 'unox' },
                      { label: 'Dove', value: 'dove' },
                      { label: 'Magnum', value: 'magnum' },
                      { label: 'Heinz', value: 'heinz' },
                    ]}
                    value={brand}
                    onChange={setBrand}
                    placeholder="Select brand"
                  />
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
              </div>
            </FormSection>
            <FormSection title="Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Beverages', value: 'beverages' },
                      { label: 'Food', value: 'food' },
                      { label: 'Personal Care', value: 'personal-care' },
                      { label: 'Frozen', value: 'frozen' },
                      { label: 'Condiments', value: 'condiments' },
                    ]}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <Input defaultValue="€0.99" placeholder="Enter price" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">EAN / Barcode</label>
                  <Input defaultValue="5449000000996" placeholder="Enter EAN barcode" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit size</label>
                  <Input defaultValue="330ml" placeholder="Enter unit size" />
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
          label: 'Campaigns',
          value: 'campaigns',
          content: (
            <div className="space-y-6 mt-6">
              <Table
                columns={[
                  { key: 'name', header: 'Campaign name' },
                  { key: 'engine', header: 'Engine' },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) => <Badge variant={campaignStatusVariant(row.status)}>{row.status}</Badge>,
                  },
                  { key: 'start', header: 'Start' },
                  { key: 'end', header: 'End' },
                ]}
                data={relatedCampaigns}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.name}`)}
              />
            </div>
          ),
        },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export const ProductDetail: Story = {
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
            title: 'Coca-Cola Classic 330ml Can',
            subtitle: 'Coca-Cola · Beverages · SKU CC-1000-330ML · Active',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <ProductDetailContent />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
