import * as React from 'react';
import { ScanBarcode } from 'lucide-react';
import { SearchSelectList } from './search-select-list';

export interface RetailProduct {
  id: string;
  name: string;
}

/**
 * Shared demo catalogue used across the platform's retail-product pickers.
 * Callers can pass their own `products` if they need a different set.
 */
export const defaultRetailProducts: RetailProduct[] = [
  { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
  { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
  { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
  { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
  { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
  { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
  { id: '612816', name: 'Nike - air max 270 - size 42' },
  { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
  { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
  { id: '614649', name: "Ben & Jerry's - cookie dough - 465ml" },
];

export interface RetailProductSelectProps {
  /** Selected product IDs (controlled). */
  value: string[];
  /** Called with the next list of selected IDs. */
  onChange: (ids: string[]) => void;
  /** Catalogue to search. Defaults to {@link defaultRetailProducts}. */
  products?: RetailProduct[];
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
  products = defaultRetailProducts,
  label = 'Retail products',
  optional = false,
  showCount = false,
  placeholder = 'Search product by name or ID...',
  className,
}) => {
  const options = React.useMemo(
    () => products.map((p) => ({ value: p.id, label: p.name, description: `ID: ${p.id}` })),
    [products],
  );
  const count = value.filter((id) => products.some((p) => p.id === id)).length;

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
