import * as React from 'react';
import { ScanBarcode, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { SearchInput } from './search-input';

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
 * The single, canonical retail-product multi-select: a barcode-style search
 * field with a results dropdown, and selected products listed as removable
 * cards. Use this everywhere instead of re-implementing the pattern.
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
  const [search, setSearch] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const results = products.filter(
    (p) =>
      !value.includes(p.id) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search)),
  );

  const add = (id: string) => {
    if (!value.includes(id)) onChange([...value, id]);
    setSearch('');
    setShowResults(false);
  };
  const remove = (id: string) => onChange(value.filter((v) => v !== id));

  // Close the results dropdown when clicking outside the field.
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selected = value
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as RetailProduct[];

  return (
    <div className={cn('min-w-0 space-y-2', className)}>
      <div className="relative" ref={containerRef}>
        {label !== null && (
          <label className="block text-sm font-medium mb-2">
            {label}
            {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
          </label>
        )}
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onClick={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full"
          icon={<ScanBarcode className="w-4 h-4" />}
        />
        {showResults && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
            {results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-neutral-50"
                  onClick={() => add(product.id)}
                >
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-sm text-muted-foreground">No products found</div>
            )}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="space-y-1">
          {selected.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-2">
              <div className="min-w-0">
                <div className="text-sm font-medium">{product.name}</div>
                <div className="text-xs text-muted-foreground">ID: {product.id}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => remove(product.id)}
                className="h-8 w-8 shrink-0 p-0"
                aria-label={`Remove ${product.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {showCount && selected.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selected.length} retail product{selected.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};
