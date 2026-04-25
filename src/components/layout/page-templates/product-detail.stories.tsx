import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardWithTabs } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Product Detail',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AppLayout>;

interface ProductDetailContentProps {
  skuCode: string;
  productName: string;
  brandValue: string;
  categoryValue: string;
  price: string;
  ean: string;
  unitSize: string;
  brandLabel: string;
  advertiser: string;
}

const ProductDetailContent = ({
  skuCode, productName, brandValue, categoryValue,
  price, ean, unitSize, brandLabel, advertiser,
}: ProductDetailContentProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [status, setStatus] = React.useState('active');
  const [category, setCategory] = React.useState(categoryValue);
  const [brand, setBrand] = React.useState(brandValue);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardWithTabs
          className="w-full"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          action={activeTab === 'details' ? <Button>Save</Button> : null}
          header={
            activeTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input defaultValue={skuCode} placeholder="Enter SKU" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input defaultValue={productName} placeholder="Enter product name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <Input dropdown options={[
                    { label: 'Coca-Cola', value: 'coca-cola' },
                    { label: 'Coca-Cola Zero', value: 'coca-cola-zero' },
                    { label: 'Unox', value: 'unox' },
                    { label: 'Dove', value: 'dove' },
                    { label: 'Magnum', value: 'magnum' },
                    { label: 'Heinz', value: 'heinz' },
                  ]} value={brand} onChange={setBrand} placeholder="Select brand" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Input dropdown options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]} value={status} onChange={setStatus} placeholder="Select status" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Input dropdown options={[
                    { label: 'Beverages', value: 'beverages' },
                    { label: 'Food', value: 'food' },
                    { label: 'Personal Care', value: 'personal-care' },
                    { label: 'Frozen', value: 'frozen' },
                    { label: 'Condiments', value: 'condiments' },
                  ]} value={category} onChange={setCategory} placeholder="Select category" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <Input defaultValue={price} placeholder="Enter price" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">EAN / Barcode</label>
                  <Input defaultValue={ean} placeholder="Enter EAN barcode" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit size</label>
                  <Input defaultValue={unitSize} placeholder="Enter unit size" />
                </div>
              </div>
            ) : null
          }
          tabs={[
            { label: 'Details', value: 'details', content: null },
          ]}
        />
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Brand</CardTitle></CardHeader>
          <CardContent>
            <div>
              <p className="font-medium text-sm">{brandLabel}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{advertiser}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ProductDetail: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'Coca-Cola Classic 330ml Can', subtitle: 'Coca-Cola · Beverages · SKU CC-1000-330ML · Active', onEdit: () => alert('Edit clicked'), onExport: () => alert('Export clicked'), onSettings: () => alert('Settings clicked') }}>
          <ProductDetailContent
            skuCode="CC-1000-330ML" productName="Coca-Cola Classic 330ml Can"
            brandValue="coca-cola" categoryValue="beverages" price="€0.99"
            ean="5449000000996" unitSize="330ml"
            brandLabel="Coca-Cola" advertiser="The Coca-Cola Company"
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
