'use client';

import * as React from 'react';
import { Button } from './button';
import { AddButton } from './add-button';
import { Badge } from './badge';
import { Switch } from './switch';
import { Table } from './table';
import { FilterBar } from './filter-bar';
import { LevelMeter, LEVEL_LABELS, type Level } from './level-meter';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { RetailProductSelect, type RetailProduct } from './retail-product-select';
import { useDb } from '@/lib/db/hooks';
import { productsForBrands, productsForAdvertiser, brandOfProduct } from '@/lib/db/retail-products';
import { retailProductPerformance } from '@/lib/sp-retail-products';

/**
 * The retail products of a sponsored products booking, with how each one
 * performs — the table the campaign level used to carry, now on the booking
 * where the products are actually chosen. Status and POD ID stay fixed on
 * the left; the rest of the columns can be hidden and reordered from the
 * table's own menu. Products are added through the same picker the wizard
 * uses, in a dialog.
 */
export interface RetailProductTableProps {
  /** Ids of the products in the booking. */
  value: string[];
  onChange: (ids: string[]) => void;
  /** The catalogue to add from; by default the store's, narrowed by `brands` / `advertiser`. */
  catalogue?: RetailProduct[];
  brands?: string[];
  advertiser?: string;
  className?: string;
}

const money = (n: number) => `€${n.toLocaleString('en-GB')}`;
const num = (n: number) => n.toLocaleString('en-GB');

export const RetailProductTable: React.FC<RetailProductTableProps> = ({ value, onChange, catalogue: catalogueProp, brands, advertiser, className }) => {
  const db = useDb();
  const catalogue = React.useMemo<RetailProduct[]>(() => {
    if (catalogueProp) return catalogueProp;
    const rows = brands && brands.length > 0 ? productsForBrands(db, brands) : advertiser ? productsForAdvertiser(db, advertiser) : db.retailProducts;
    return rows.map((p) => ({ id: p.id, name: p.name, brand: brandOfProduct(db, p).brand?.name, gtin: p.gtin, image: p.image }));
  }, [db, catalogueProp, brands, advertiser]);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [volumeFilter, setVolumeFilter] = React.useState<string[]>([]);
  const [competitiveFilter, setCompetitiveFilter] = React.useState<string[]>([]);
  const [paused, setPaused] = React.useState<Set<string>>(new Set());
  const [selected, setSelected] = React.useState<React.Key[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string[]>(value);

  const q = search.trim().toLowerCase();
  const rows = value
    .map((id) => {
      const dbProduct = db.retailProducts.find((p) => p.id === id);
      const product = catalogue.find((p) => p.id === id) ?? (dbProduct ? { id, name: dbProduct.name, brand: brandOfProduct(db, dbProduct).brand?.name, gtin: dbProduct.gtin, image: dbProduct.image } : { id, name: id });
      const perf = retailProductPerformance(id);
      // The barcode is the product's own; the derived extras stand in for other pack sizes.
      const upcs = dbProduct ? [dbProduct.gtin, ...(dbProduct.upcs ?? []).filter((u) => u !== dbProduct.gtin)] : perf.upcs;
      const status: 'active' | 'paused' = paused.has(id) ? 'paused' : perf.status === 'paused' && !paused.has(`on:${id}`) ? 'paused' : 'active';
      return { ...perf, upcs, id, name: product.name, brandName: product.brand ?? '—', image: product.image, status };
    })
    .filter((r) => !q || r.name.toLowerCase().includes(q) || r.brandName.toLowerCase().includes(q) || r.podId.includes(q) || r.upcs.some((u) => u.includes(q)))
    .filter((r) => statusFilter.length === 0 || statusFilter.includes(r.status))
    .filter((r) => volumeFilter.length === 0 || volumeFilter.includes(String(r.searchVolume)))
    .filter((r) => competitiveFilter.length === 0 || competitiveFilter.includes(String(r.competitive)));
  const levelOptions = ([5, 4, 3, 2, 1] as Level[]).map((l) => ({ label: LEVEL_LABELS[l], value: String(l) }));

  const toggleStatus = (id: string, on: boolean) => setPaused((prev) => {
    const next = new Set(prev);
    // A product the data marks paused switches on through a second key, so
    // both directions stick without touching the derived data.
    if (on) { next.delete(id); next.add(`on:${id}`); } else { next.add(id); next.delete(`on:${id}`); }
    return next;
  });
  const remove = (ids: string[]) => { onChange(value.filter((v) => !ids.includes(v))); setSelected([]); };
  const picked = selected.map(String);

  const conv = (key: 'sku' | 'brand', label: string) => [
    { key: `${key}TotalConversions`, header: `7d ${label} Total Conversions`, render: (r: typeof rows[number]) => num(r[key].totalConversions) },
    { key: `${key}TotalUnits`, header: `7d ${label} Total Units Sold`, render: (r: typeof rows[number]) => num(r[key].totalUnits) },
    { key: `${key}TotalRevenue`, header: `7d ${label} Total Revenue`, render: (r: typeof rows[number]) => money(r[key].totalRevenue) },
    { key: `${key}TotalRoas`, header: `7d ${label} Total ROAS`, render: (r: typeof rows[number]) => `${r[key].totalRoas}%` },
    { key: `${key}TotalConversionRate`, header: `7d ${label} Total Conversion Rate`, render: (r: typeof rows[number]) => `${r[key].totalConversionRate}%` },
    { key: `${key}OnlineConversions`, header: `7d ${label} Online Conversions`, render: (r: typeof rows[number]) => num(r[key].onlineConversions) },
    { key: `${key}OnlineUnits`, header: `7d ${label} Online Units Sold`, render: (r: typeof rows[number]) => num(r[key].onlineUnits) },
    { key: `${key}OnlineRevenue`, header: `7d ${label} Online Revenue`, render: (r: typeof rows[number]) => money(r[key].onlineRevenue) },
    { key: `${key}InstoreConversions`, header: `7d ${label} Instore Conversions`, render: (r: typeof rows[number]) => num(r[key].instoreConversions) },
    { key: `${key}InstoreUnits`, header: `7d ${label} Instore Units Sold`, render: (r: typeof rows[number]) => num(r[key].instoreUnits) },
    { key: `${key}InstoreRevenue`, header: `7d ${label} Instore Revenue`, render: (r: typeof rows[number]) => money(r[key].instoreRevenue) },
  ];

  return (
    <div className={className}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-inline">
          <p className="text-xs text-muted-foreground">{value.length} of 500 retail products. Switch one off to keep it in the booking without serving it.</p>
          {picked.length > 0 && <Button variant="outline" size="sm" onClick={() => remove(picked)}>Remove selected ({picked.length})</Button>}
        </div>
        <FilterBar
          action={<AddButton onClick={() => { setDraft(value); setAddOpen(true); }}>Add retail products</AddButton>}
          filters={[
            { name: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Paused', value: 'paused' }], selectedValues: statusFilter, onChange: setStatusFilter },
            { name: 'Search volume', options: levelOptions, selectedValues: volumeFilter, onChange: setVolumeFilter },
            { name: 'Competitive', options: levelOptions, selectedValues: competitiveFilter, onChange: setCompetitiveFilter },
          ]}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title, POD ID or UPC…"
        />
        <Table
          columns={[
            { key: 'status', header: 'Status', hideable: false, render: (r) => (
              <Switch checked={r.status === 'active'} onCheckedChange={(on) => toggleStatus(r.id, on)} aria-label={`${r.status === 'active' ? 'Pause' : 'Activate'} ${r.name}`} />
            ) },
            { key: 'podId', header: 'POD ID', hideable: false, render: (r) => <span className="tabular-nums">{r.podId}</span> },
            { key: 'upc', header: 'UPC', render: (r) => (
              <span className="flex items-center gap-1.5 tabular-nums">{r.upcs[0]}{r.upcs.length > 1 && <Badge variant="outline" className="font-normal">+{r.upcs.length - 1}</Badge>}</span>
            ) },
            { key: 'image', header: 'Image', render: (r) => r.image
              ? <img src={r.image} alt="" className="h-8 w-8 rounded object-cover" />
              : <span className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground" aria-hidden>{r.name.slice(0, 1)}</span> },
            { key: 'name', header: 'Product title', render: (r) => <span className="whitespace-nowrap">{r.name}</span> },
            { key: 'brandName', header: 'Brand', render: (r) => r.brandName },
            { key: 'impressions', summary: 'sum', header: 'Impressions', render: (r) => num(r.impressions) },
            { key: 'clicks', summary: 'sum', header: 'Clicks', render: (r) => num(r.clicks) },
            { key: 'spend', summary: 'sum', header: 'Spend', render: (r) => money(r.spend) },
            { key: 'avgCpc', summary: 'avg', header: 'Avg. CPC', render: (r) => `€${r.avgCpc.toFixed(2)}` },
            { key: 'ctr', summary: 'avg', header: 'CTR', render: (r) => `${r.ctr.toFixed(1)}%` },
            { key: 'searchVolume', header: 'Search volume', render: (r) => <LevelMeter label={null} tone="supply" level={r.searchVolume} /> },
            { key: 'competitive', header: 'Competitive', render: (r) => <LevelMeter label={null} tone="risk" level={r.competitive} /> },
            ...conv('sku', 'SKU'),
            ...conv('brand', 'Brand'),
          ]}
          data={rows}
          rowKey={(r) => r.id}
          defaultFixedColumns={['status', 'podId']}
          rowSelection={{ selectedKeys: selected, onChange: setSelected, getKey: (r) => r.id }}
          rowActions={(r) => <Button variant="ghost" size="sm" onClick={() => remove([r.id])}>Remove</Button>}
          emptyState={
            <p className="p-4 text-sm text-muted-foreground">
              {value.length === 0 ? 'No retail products in this booking yet — add some to start serving.' : 'Nothing matches these filters.'}
            </p>
          }
        />
      </div>

      <Dialog open={addOpen} onOpenChange={(o) => !o && setAddOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add retail products</DialogTitle>
            <DialogDescription>Search the catalogue by name or ID. The same picker the wizard uses.</DialogDescription>
          </DialogHeader>
          <RetailProductSelect value={draft} onChange={setDraft} products={catalogue} label={null} showCount />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { onChange(draft); setAddOpen(false); }}>Save products</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
