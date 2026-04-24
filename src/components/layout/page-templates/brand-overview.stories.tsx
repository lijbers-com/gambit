import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Brand Overview',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const brandData = [
  { id: 'BRD-001', name: 'Coca-Cola', advertiser: 'The Coca-Cola Company', products: 24, campaigns: 8, status: 'Active' as const },
  { id: 'BRD-002', name: 'Unox', advertiser: 'Unilever', products: 15, campaigns: 5, status: 'Active' as const },
  { id: 'BRD-003', name: 'Dove', advertiser: 'Unilever', products: 32, campaigns: 12, status: 'Active' as const },
  { id: 'BRD-004', name: 'Axe', advertiser: 'Unilever', products: 18, campaigns: 6, status: 'Active' as const },
  { id: 'BRD-005', name: "Hellmann's", advertiser: 'Unilever', products: 9, campaigns: 3, status: 'Inactive' as const },
  { id: 'BRD-006', name: 'Coca-Cola Zero', advertiser: 'The Coca-Cola Company', products: 12, campaigns: 4, status: 'Active' as const },
  { id: 'BRD-007', name: 'Magnum', advertiser: 'Unilever', products: 22, campaigns: 9, status: 'Active' as const },
  { id: 'BRD-008', name: 'Heinz', advertiser: 'Kraft Heinz', products: 41, campaigns: 7, status: 'Active' as const },
  { id: 'BRD-009', name: "Ben & Jerry's", advertiser: 'Unilever', products: 28, campaigns: 11, status: 'Active' as const },
  { id: 'BRD-010', name: 'Sensodyne', advertiser: 'Haleon', products: 7, campaigns: 2, status: 'Inactive' as const },
];

const productData = [
  { id: 'SKU-001', sku: 'CC-1000-330ML', name: 'Coca-Cola Classic 330ml Can', brand: 'Coca-Cola', category: 'Beverages', price: '€0.99', status: 'Active' as const },
  { id: 'SKU-002', sku: 'CC-ZERO-500ML', name: 'Coca-Cola Zero Sugar 500ml Bottle', brand: 'Coca-Cola Zero', category: 'Beverages', price: '€1.29', status: 'Active' as const },
  { id: 'SKU-003', sku: 'CC-1000-1L', name: 'Coca-Cola Classic 1 Litre Bottle', brand: 'Coca-Cola', category: 'Beverages', price: '€1.89', status: 'Active' as const },
  { id: 'SKU-004', sku: 'DV-SOAP-200ML', name: 'Dove Beauty Bar Original 200ml', brand: 'Dove', category: 'Personal Care', price: '€2.49', status: 'Active' as const },
  { id: 'SKU-005', sku: 'DV-SHMP-400ML', name: 'Dove Intensive Repair Shampoo 400ml', brand: 'Dove', category: 'Personal Care', price: '€3.99', status: 'Active' as const },
  { id: 'SKU-006', sku: 'UNX-SOUP-570ML', name: 'Unox Hollandse Erwtensoep 570ml', brand: 'Unox', category: 'Food', price: '€1.79', status: 'Active' as const },
  { id: 'SKU-007', sku: 'UNX-WURST-300G', name: 'Unox Rookworst 300g', brand: 'Unox', category: 'Food', price: '€2.89', status: 'Active' as const },
  { id: 'SKU-008', sku: 'MGN-VAN-440ML', name: 'Magnum Classic Ice Cream 440ml', brand: 'Magnum', category: 'Frozen', price: '€4.49', status: 'Active' as const },
  { id: 'SKU-009', sku: 'MGN-ALM-440ML', name: 'Magnum Almond Ice Cream 440ml', brand: 'Magnum', category: 'Frozen', price: '€4.49', status: 'Inactive' as const },
  { id: 'SKU-010', sku: 'HNZ-KTC-460G', name: 'Heinz Tomato Ketchup 460g', brand: 'Heinz', category: 'Condiments', price: '€2.19', status: 'Active' as const },
  { id: 'SKU-011', sku: 'HNZ-MAYO-400G', name: 'Heinz Seriously Good Mayonnaise 400g', brand: 'Heinz', category: 'Condiments', price: '€2.99', status: 'Active' as const },
  { id: 'SKU-012', sku: 'BJY-CDGH-465ML', name: "Ben & Jerry's Cookie Dough 465ml", brand: "Ben & Jerry's", category: 'Frozen', price: '€5.99', status: 'Active' as const },
];


export const BrandOverview: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [activeTab, setActiveTab] = React.useState('brands');

    // Brands tab state
    const [brandStatusFilter, setBrandStatusFilter] = React.useState<string[]>([]);
    const [advertiserFilter, setAdvertiserFilter] = React.useState<string[]>([]);
    const [brandSearch, setBrandSearch] = React.useState('');

    // Products tab state
    const [productStatusFilter, setProductStatusFilter] = React.useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);
    const [productSearch, setProductSearch] = React.useState('');

    const filteredBrands = brandData.filter(row => {
      const statusMatch = brandStatusFilter.length === 0 || brandStatusFilter.includes(row.status.toLowerCase());
      const advertiserMatch = advertiserFilter.length === 0 || advertiserFilter.includes(row.advertiser.toLowerCase().replace(/ /g, '-'));
      const searchMatch = brandSearch === '' || row.name.toLowerCase().includes(brandSearch.toLowerCase());
      return statusMatch && advertiserMatch && searchMatch;
    });

    const filteredProducts = productData.filter(row => {
      const statusMatch = productStatusFilter.length === 0 || productStatusFilter.includes(row.status.toLowerCase());
      const catMatch = categoryFilter.length === 0 || categoryFilter.includes(row.category.toLowerCase());
      const searchMatch = productSearch === '' || row.name.toLowerCase().includes(productSearch.toLowerCase()) || row.sku.toLowerCase().includes(productSearch.toLowerCase());
      return statusMatch && catMatch && searchMatch;
    });

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Brands & retail products',
            subtitle: 'Manage your brand portfolio and retail product catalogue',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <CardWithTabs
            tabs={[
              {
                label: 'Brands',
                value: 'brands',
                content: (
                  <div className="space-y-6 mt-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Status',
                          options: [
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                          ],
                          selectedValues: brandStatusFilter,
                          onChange: setBrandStatusFilter,
                        },
                        {
                          name: 'Advertiser',
                          options: [
                            { label: 'The Coca-Cola Company', value: 'the-coca-cola-company' },
                            { label: 'Unilever', value: 'unilever' },
                            { label: 'Kraft Heinz', value: 'kraft-heinz' },
                            { label: 'Haleon', value: 'haleon' },
                          ],
                          selectedValues: advertiserFilter,
                          onChange: setAdvertiserFilter,
                        },
                      ]}
                      searchValue={brandSearch}
                      onSearchChange={setBrandSearch}
                      searchPlaceholder="Search brands..."
                    />
                    <Table
                      columns={[

                        { key: 'name', header: 'Name' },
                        { key: 'advertiser', header: 'Advertiser' },
                        { key: 'products', header: 'Products', render: (row) => <Badge variant="secondary">{row.products}</Badge> },
                        { key: 'campaigns', header: 'Campaigns', render: (row) => <Badge variant="secondary">{row.campaigns}</Badge> },
                        { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge> },
                      ]}
                      data={filteredBrands}
                      rowKey={(row) => row.id}
                      onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                    />
                  </div>
                ),
              },
              {
                label: 'Retail products',
                value: 'products',
                content: (
                  <div className="space-y-6 mt-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Status',
                          options: [
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                          ],
                          selectedValues: productStatusFilter,
                          onChange: setProductStatusFilter,
                        },
                        {
                          name: 'Category',
                          options: [
                            { label: 'Beverages', value: 'beverages' },
                            { label: 'Food', value: 'food' },
                            { label: 'Personal Care', value: 'personal care' },
                            { label: 'Frozen', value: 'frozen' },
                            { label: 'Condiments', value: 'condiments' },
                          ],
                          selectedValues: categoryFilter,
                          onChange: setCategoryFilter,
                        },
                      ]}
                      searchValue={productSearch}
                      onSearchChange={setProductSearch}
                      searchPlaceholder="Search products or SKU..."
                    />
                    <Table
                      columns={[

                        { key: 'sku', header: 'SKU' },
                        { key: 'name', header: 'Name' },
                        { key: 'brand', header: 'Brand' },
                        { key: 'category', header: 'Category' },
                        { key: 'price', header: 'Price' },
                        { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge> },
                      ]}
                      data={filteredProducts}
                      rowKey={(row) => row.id}
                      onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                    />
                  </div>
                ),
              },
            ]}
            action={activeTab === 'brands' ? <Button>Add brand</Button> : <Button>Add product</Button>}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
