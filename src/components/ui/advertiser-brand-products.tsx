'use client';

import * as React from 'react';
import { AdvertiserSelect } from './advertiser-select';
import { SearchSelectList } from './search-select-list';
import { RetailProductSelect } from './retail-product-select';

/**
 * Advertiser, brand and retail products — who a booking is for and what it
 * sells, as one block.
 *
 * The media plan wizard already asks these three together; the booking forms
 * each improvised their own version (hand-rolled brand searches, a product
 * picker floating alone). This is the same trio everywhere: the standard
 * advertiser select, the standard search-select for brands, and the shared
 * retail product picker.
 */
export interface AdvertiserBrandProductsProps {
  advertiser: string;
  onAdvertiserChange: (value: string) => void;
  brands: string[];
  onBrandsChange: (value: string[]) => void;
  brandOptions: { label: string; value: string }[];
  products: React.ComponentProps<typeof RetailProductSelect>['value'];
  onProductsChange: React.ComponentProps<typeof RetailProductSelect>['onChange'];
  productCatalog: React.ComponentProps<typeof RetailProductSelect>['products'];
  className?: string;
}

export const AdvertiserBrandProducts: React.FC<AdvertiserBrandProductsProps> = ({
  advertiser,
  onAdvertiserChange,
  brands,
  onBrandsChange,
  brandOptions,
  products,
  onProductsChange,
  productCatalog,
  className,
}) => (
  <div className={className ?? 'space-y-4 min-w-0'}>
    <div>
      <label className="block text-sm font-medium mb-2">Advertiser</label>
      <AdvertiserSelect value={advertiser} onChange={onAdvertiserChange} className="w-full" />
    </div>
    <SearchSelectList
      label="Brands"
      placeholder="Search brands..."
      options={brandOptions}
      value={brands}
      onChange={onBrandsChange}
    />
    <RetailProductSelect value={products} onChange={onProductsChange} products={productCatalog} />
  </div>
);
