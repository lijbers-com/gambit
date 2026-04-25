import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Brand Detail',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const cocaColaProducts = [
  { id: 'SKU-001', sku: 'CC-1000-330ML', name: 'Coca-Cola Classic 330ml Can', category: 'Beverages', price: '€0.99' },
  { id: 'SKU-002', sku: 'CC-ZERO-500ML', name: 'Coca-Cola Zero Sugar 500ml Bottle', category: 'Beverages', price: '€1.29' },
  { id: 'SKU-003', sku: 'CC-1000-1L', name: 'Coca-Cola Classic 1 Litre Bottle', category: 'Beverages', price: '€1.89' },
  { id: 'SKU-004', sku: 'CC-ZERO-1.5L', name: 'Coca-Cola Zero Sugar 1.5L Bottle', category: 'Beverages', price: '€2.19' },
  { id: 'SKU-005', sku: 'CC-MULTIPACK-6', name: 'Coca-Cola Classic 6-Pack 330ml', category: 'Beverages', price: '€4.49' },
];

const cocaColaOrgs = [
  { id: 'ORG-001', organisation: 'GroupM', type: 'Agency', role: 'Campaign Manager' },
  { id: 'ORG-002', organisation: 'Publicis', type: 'Agency', role: 'Viewer' },
  { id: 'ORG-003', organisation: 'Coca-Cola HQ', type: 'Advertiser', role: 'Admin' },
];

const unoxProducts = [
  { id: 'SKU-101', sku: 'UNX-SOUP-STD', name: 'Unox Erwtensoep Snert 570ml', category: 'Food', price: '€1.99' },
  { id: 'SKU-102', sku: 'UNX-HOT-4PK', name: 'Unox Knakworst 4-Pack 200g', category: 'Food', price: '€2.49' },
  { id: 'SKU-103', sku: 'UNX-SOUP-TOM', name: 'Unox Tomatensoep 570ml', category: 'Food', price: '€1.79' },
];

const unoxOrgs = [
  { id: 'ORG-101', organisation: 'Unilever Media', type: 'Advertiser', role: 'Admin' },
  { id: 'ORG-102', organisation: 'OMD Netherlands', type: 'Agency', role: 'Campaign Manager' },
];

interface BrandDetailContentProps {
  brandName: string;
  advertiserValue: string;
  categoryValue: string;
  countryOfOrigin: string;
  products: typeof cocaColaProducts;
  organisations: typeof cocaColaOrgs;
}

const BrandDetailContent = ({
  brandName,
  advertiserValue,
  categoryValue,
  countryOfOrigin,
  products,
  organisations,
}: BrandDetailContentProps) => {
  const [advertiser, setAdvertiser] = React.useState(advertiserValue);
  const [brandStatus, setBrandStatus] = React.useState('active');
  const [brandCategory, setBrandCategory] = React.useState(categoryValue);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left column — form */}
      <div className="col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Brand</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input defaultValue={brandName} placeholder="Enter brand name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent advertiser</label>
                <Input
                  dropdown
                  options={[
                    { label: 'Coca-Cola Company', value: 'coca-cola-company' },
                    { label: 'Unilever', value: 'unilever' },
                    { label: 'FrieslandCampina', value: 'frieslandcampina' },
                  ]}
                  value={advertiser}
                  onChange={setAdvertiser}
                  placeholder="Select advertiser"
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
                  value={brandStatus}
                  onChange={setBrandStatus}
                  placeholder="Select status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  dropdown
                  options={[
                    { label: 'Beverages', value: 'beverages' },
                    { label: 'Food', value: 'food' },
                    { label: 'Personal Care', value: 'personal-care' },
                    { label: 'Household', value: 'household' },
                  ]}
                  value={brandCategory}
                  onChange={setBrandCategory}
                  placeholder="Select category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country of origin</label>
                <Input defaultValue={countryOfOrigin} placeholder="Enter country of origin" />
              </div>
            </div>
            <div className="flex justify-start mt-6">
              <Button>Save</Button>
            </div>
          </CardContent>
        </Card>

        {/* Products table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Retail products</h2>
              <Button variant="outline" size="sm">Add product</Button>
            </div>
            <Table
              columns={[
                { key: 'sku', header: 'SKU' },
                { key: 'name', header: 'Name' },
                { key: 'category', header: 'Category' },
                { key: 'price', header: 'Price' },
              ]}
              data={products}
              rowKey={(row) => row.id}
              onRowClick={(row) => alert(`Navigate to ${row.name}`)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right column — sidebar */}
      <div className="col-span-1 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Organisations</h2>
              <Button variant="outline" size="sm">Grant access</Button>
            </div>
            <div className="space-y-3">
              {organisations.map((org) => (
                <div key={org.id}>
                  <p className="font-medium text-sm">{org.organisation}</p>
                  <p className="text-xs text-muted-foreground">{org.type} · <Badge variant="outline" className="text-xs h-4">{org.role}</Badge></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const BrandDetail: Story = {
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
            subtitle: 'Coca-Cola Company · Beverages · Active',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <BrandDetailContent
            brandName="Coca-Cola"
            advertiserValue="coca-cola-company"
            categoryValue="beverages"
            countryOfOrigin="United States"
            products={cocaColaProducts}
            organisations={cocaColaOrgs}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const BrandDetailUnox: Story = {
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
            title: 'Unox',
            subtitle: 'FrieslandCampina · Food · Active',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <BrandDetailContent
            brandName="Unox"
            advertiserValue="frieslandcampina"
            categoryValue="food"
            countryOfOrigin="Netherlands"
            products={unoxProducts}
            organisations={unoxOrgs}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
