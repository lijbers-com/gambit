import * as React from 'react';
import { ScanBarcode } from 'lucide-react';
import { SearchSelectList } from './search-select-list';
import { seedData } from '@/lib/db/seed';
import { useDb } from '@/lib/db/hooks';
import { productsForBrands, productsForAdvertiser, brandOfProduct } from '@/lib/db/retail-products';

export interface RetailProduct {
  id: string;
  name: string;
  brand?: string;
  gtin?: string;
  image?: string;
}

/** The store's catalogue, read from the seed — every picker offers the same shelf. */
export const defaultRetailProducts: RetailProduct[] = seedData.retailProducts.map((p) => ({
  id: p.id,
  name: p.name,
  brand: seedData.advertisers.flatMap((a) => a.brands).find((b) => b.id === p.brandId)?.name,
  gtin: p.gtin,
  image: p.image,
}));

export interface RetailProductSelectProps {
  /** Selected product IDs (controlled). */
  value: string[];
  /** Called with the next list of selected IDs. */
  onChange: (ids: string[]) => void;
  /** Catalogue to search. Defaults to the store's catalogue, narrowed by `brands` / `advertiser`. */
  products?: RetailProduct[];
  /** The brands in play — ids, slugs or names; the catalogue narrows to their products. */
  brands?: string[];
  /** The organisation in play — narrows to the products of all its brands. */
  advertiser?: string;
  /** Field label. Pass `null` to render without a label. */
  label?: string | null;
  /** Append a muted "(optional)" hint to the label. */
  optional?: boolean;
  /** Show a "N retail products selected" count under the list. */
  showCount?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * The single, canonical retail-product multi-select.
 *
 * It is a thin wrapper over {@link SearchSelectList} — the generic
 * "search → dropdown → selected list below" control — rather than its own
 * implementation. It used to draw its own selected-product cards, which then
 * drifted away from every other picker in the forms. Everything visual now
 * comes from one place; this component only supplies the catalogue, the
 * barcode icon and the "N selected" count.
 */
export const RetailProductSelect: React.FC<RetailProductSelectProps> = ({
  value,
  onChange,
  products,
  brands,
  advertiser,
  label = 'Retail products',
  optional = false,
  showCount = false,
  placeholder = 'Search product by name or ID...',
  className,
}) => {
  const db = useDb();
  const catalogue = React.useMemo<RetailProduct[]>(() => {
    if (products) return products;
    const rows = brands && brands.length > 0 ? productsForBrands(db, brands) : advertiser ? productsForAdvertiser(db, advertiser) : db.retailProducts;
    return rows.map((p) => ({ id: p.id, name: p.name, brand: brandOfProduct(db, p).brand?.name, gtin: p.gtin, image: p.image }));
  }, [db, products, brands, advertiser]);
  const options = React.useMemo(
    () => catalogue.map((p) => ({ value: p.id, label: p.name, description: [p.brand, p.gtin ? `GTIN ${p.gtin}` : `ID ${p.id}`].filter(Boolean).join(' · ') })),
    [catalogue],
  );
  const count = value.filter((id) => catalogue.some((p) => p.id === id)).length;

  return (
    <div className={className}>
      <SearchSelectList
        value={value}
        onChange={onChange}
        options={options}
        label={
          label === null ? null : (
            <>
              {label}
              {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
            </>
          )
        }
        placeholder={placeholder}
        icon={<ScanBarcode className="w-4 h-4" />}
      />
      {showCount && count > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {count} retail product{count !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};
