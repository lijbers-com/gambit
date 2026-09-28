'use client';

import * as React from 'react';
import { SearchSelectList } from './search-select-list';
import { RetailProductSelect } from './retail-product-select';
import { useDb, advertiserFor, brandsFor } from '@/lib/db';

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
  /** The brands to offer. Omitted, the chosen organisation's brands. */
  brandOptions?: { label: string; value: string }[];
  products: React.ComponentProps<typeof RetailProductSelect>['value'];
  onProductsChange: React.ComponentProps<typeof RetailProductSelect>['onChange'];
  /** Optional: a fixed catalogue. Without it the store's catalogue narrows to the chosen brands. */
  productCatalog?: React.ComponentProps<typeof RetailProductSelect>['products'];
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
}) => {
  const db = useDb();
  // The same advertiser field the media plan asks: a search-select of the
  // organisations. A key that names a brand resolves to its organisation.
  const orgOptions = db.advertisers.map((a) => ({ label: a.name, value: a.id }));
  const selectedOrg = advertiserFor(db, advertiser)
    ?? db.advertisers.find((a) => a.brands.some((b) => brandsFor(db, [advertiser]).includes(b)));
  return (
    <div className={className ?? 'space-y-4 min-w-0'}>
      <SearchSelectList
        label="Advertiser"
        placeholder="Search advertiser…"
        options={orgOptions}
        value={selectedOrg ? [selectedOrg.id] : []}
        onChange={(vals) => onAdvertiserChange(vals[0] ?? '')}
        multiple={false}
      />
      <SearchSelectList
        label="Brands"
        placeholder="Search brands…"
        options={brandOptions ?? (selectedOrg ?? { brands: db.advertisers.flatMap((a) => a.brands) }).brands.map((b) => ({ label: b.name, value: b.id }))}
        value={brands}
        onChange={onBrandsChange}
      />
      <RetailProductSelect value={products} onChange={onProductsChange} products={productCatalog} brands={brands} advertiser={advertiser} />
    </div>
  );
};
