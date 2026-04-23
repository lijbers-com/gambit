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
import { defaultRoutes } from '../default-routes';
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
  { id: 'SKU-001', sku: 'CC-1000-330ML', name: 'Coca-Cola Classic 330ml Can', category: 'Beverages', price: '€0.99', stock: 'In stock' },
  { id: 'SKU-002', sku: 'CC-ZERO-500ML', name: 'Coca-Cola Zero Sugar 500ml Bottle', category: 'Beverages', price: '€1.29', stock: 'In stock' },
  { id: 'SKU-003', sku: 'CC-1000-1L', name: 'Coca-Cola Classic 1 Litre Bottle', category: 'Beverages', price: '€1.89', stock: 'Low stock' },
  { id: 'SKU-004', sku: 'CC-ZERO-1.5L', name: 'Coca-Cola Zero Sugar 1.5L Bottle', category: 'Beverages', price: '€2.19', stock: 'In stock' },
  { id: 'SKU-005', sku: 'CC-MULTIPACK-6', name: 'Coca-Cola Classic 6-Pack 330ml', category: 'Beverages', price: '€4.49', stock: 'Out of stock' },
];

const unoxProducts = [
  { id: 'SKU-101', sku: 'UNX-SOUP-STD', name: 'Unox Erwtensoep Snert 570ml', category: 'Food', price: '€1.99', stock: 'In stock' },
  { id: 'SKU-102', sku: 'UNX-HOT-4PK', name: 'Unox Knakworst 4-Pack 200g', category: 'Food', price: '€2.49', stock: 'In stock' },
  { id: 'SKU-103', sku: 'UNX-SOUP-TOM', name: 'Unox Tomatensoep 570ml', category: 'Food', price: '€1.79', stock: 'Low stock' },
  { id: 'SKU-104', sku: 'UNX-SAUCE-BBQ', name: 'Unox BBQ Saus 250ml', category: 'Food', price: '€1.59', stock: 'In stock' },
  { id: 'SKU-105', sku: 'UNX-HOT-8PK', name: 'Unox Smoked Sausage 8-Pack 400g', category: 'Food', price: '€4.29', stock: 'Out of stock' },
];

const cocaColaCampaigns = [
  { id: 'C-001', name: 'Summer Refresh 2024', engine: 'Display', status: 'Running', start: '01-06-2024', end: '31-08-2024' },
  { id: 'C-002', name: 'Zero Sugar Push', engine: 'Sponsored Products', status: 'Ready', start: '01-07-2024', end: '31-07-2024' },
  { id: 'C-003', name: 'Holiday Season 2024', engine: 'Offsite', status: 'In option', start: '01-11-2024', end: '31-12-2024' },
];

const unoxCampaigns = [
  { id: 'C-101', name: 'Winter Warmers Campaign', engine: 'Display', status: 'Running', start: '01-10-2024', end: '28-02-2025' },
  { id: 'C-102', name: 'Snert Season Sponsored', engine: 'Sponsored Products', status: 'Ready', start: '01-11-2024', end: '31-01-2025' },
  { id: 'C-103', name: 'BBQ Summer Offsite', engine: 'Offsite', status: 'In option', start: '01-05-2024', end: '31-08-2024' },
];

const cocaColaOrgs = [
  { id: 'ORG-001', organisation: 'GroupM', type: 'Agency', role: 'Campaign Manager', accessSince: '01-01-2024' },
  { id: 'ORG-002', organisation: 'Publicis', type: 'Agency', role: 'Viewer', accessSince: '15-03-2024' },
  { id: 'ORG-003', organisation: 'Coca-Cola HQ', type: 'Advertiser', role: 'Admin', accessSince: '01-01-2023' },
];

const unoxOrgs = [
  { id: 'ORG-101', organisation: 'Unilever Media', type: 'Advertiser', role: 'Admin', accessSince: '01-01-2023' },
  { id: 'ORG-102', organisation: 'OMD Netherlands', type: 'Agency', role: 'Campaign Manager', accessSince: '01-06-2024' },
  { id: 'ORG-103', organisation: 'Starcom', type: 'Agency', role: 'Viewer', accessSince: '15-09-2024' },
];

const stockVariant = (stock: string) => {
  switch (stock) {
    case 'In stock': return 'default' as const;
    case 'Low stock': return 'outline' as const;
    case 'Out of stock': return 'destructive' as const;
    default: return 'secondary' as const;
  }
};

const campaignStatusVariant = (status: string) => {
  switch (status) {
    case 'Running': return 'default' as const;
    case 'Ready': return 'secondary' as const;
    case 'In option': return 'outline' as const;
    case 'Paused': return 'destructive' as const;
    default: return 'outline' as const;
  }
};

interface BrandDetailContentProps {
  brandName: string;
  advertiserName: string;
  advertiserValue: string;
  category: string;
  categoryValue: string;
  countryOfOrigin: string;
  products: typeof cocaColaProducts;
  campaigns: typeof cocaColaCampaigns;
  organisations: typeof cocaColaOrgs;
}

const BrandDetailContent = ({
  brandName,
  advertiserName,
  advertiserValue,
  category,
  categoryValue,
  countryOfOrigin,
  products,
  campaigns,
  organisations,
}: BrandDetailContentProps) => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [advertiser, setAdvertiser] = React.useState(advertiserValue);
  const [brandStatus, setBrandStatus] = React.useState('active');
  const [brandCategory, setBrandCategory] = React.useState(categoryValue);
  const [productSearch, setProductSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);

  const filteredProducts = products.filter(p => {
    const searchMatch = productSearch === '' || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const catMatch = categoryFilter.length === 0 || categoryFilter.includes(p.category.toLowerCase());
    return searchMatch && catMatch;
  });

  return (
    <CardWithTabs
      header={
        activeTab === 'details' ? (
          <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <FormSection title="Brand">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </FormSection>
            <FormSection title="Settings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          label: 'Products',
          value: 'products',
          content: (
            <div className="space-y-6 mt-6">
              <FilterBar
                filters={[
                  {
                    name: 'Category',
                    options: [
                      { label: 'Beverages', value: 'beverages' },
                      { label: 'Food', value: 'food' },
                      { label: 'Personal Care', value: 'personal-care' },
                      { label: 'Household', value: 'household' },
                    ],
                    selectedValues: categoryFilter,
                    onChange: setCategoryFilter,
                  },
                ]}
                searchValue={productSearch}
                onSearchChange={setProductSearch}
                searchPlaceholder="Search products..."
              />
              <Table
                columns={[
                  { key: 'sku', header: 'SKU' },
                  { key: 'name', header: 'Name' },
                  { key: 'category', header: 'Category' },
                  { key: 'price', header: 'Price' },
                  {
                    key: 'stock',
                    header: 'Stock',
                    render: (row) => <Badge variant={stockVariant(row.stock)}>{row.stock}</Badge>,
                  },
                ]}
                data={filteredProducts}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.name}`)}
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
                data={campaigns}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.name}`)}
              />
            </div>
          ),
        },
        {
          label: 'Organisations',
          value: 'organisations',
          content: (
            <div className="space-y-6 mt-6">
              <Table
                columns={[
                  { key: 'organisation', header: 'Organisation' },
                  { key: 'type', header: 'Type' },
                  { key: 'role', header: 'Role' },
                  { key: 'accessSince', header: 'Access since' },
                ]}
                data={organisations}
                rowKey={(row) => row.id}
                onRowClick={(row) => alert(`Navigate to ${row.organisation}`)}
              />
            </div>
          ),
        },
      ]}
      action={
        activeTab === 'products' ? <Button>Add product</Button> :
        activeTab === 'organisations' ? <Button>Grant access</Button> :
        null
      }
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
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
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <BrandDetailContent
            brandName="Coca-Cola"
            advertiserName="Coca-Cola Company"
            advertiserValue="coca-cola-company"
            category="Beverages"
            categoryValue="beverages"
            countryOfOrigin="United States"
            products={cocaColaProducts}
            campaigns={cocaColaCampaigns}
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
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <BrandDetailContent
            brandName="Unox"
            advertiserName="FrieslandCampina"
            advertiserValue="frieslandcampina"
            category="Food"
            categoryValue="food"
            countryOfOrigin="Netherlands"
            products={unoxProducts}
            campaigns={unoxCampaigns}
            organisations={unoxOrgs}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
