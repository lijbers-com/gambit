import type { Level } from '@/components/ui/level-meter';

/**
 * How a retail product performs inside a sponsored products booking — the
 * columns the campaign-level product table carries, per product. Derived
 * from the product id so a product always reads the same, render after
 * render, without a data pipeline behind it.
 */
export interface RetailProductPerformance {
  podId: string;
  upcs: string[];
  status: 'active' | 'paused';
  impressions: number;
  clicks: number;
  spend: number;
  avgCpc: number;
  ctr: number;
  sku: ConversionSet;
  brand: ConversionSet;
  searchVolume: Level;
  competitive: Level;
}

export interface ConversionSet {
  totalConversions: number;
  totalUnits: number;
  totalRevenue: number;
  totalRoas: number;
  totalConversionRate: number;
  onlineConversions: number;
  onlineUnits: number;
  onlineRevenue: number;
  instoreConversions: number;
  instoreUnits: number;
  instoreRevenue: number;
}

const hashOf = (s: string) => {
  let h = 7;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 1000003;
  return h;
};

const set = (h: number, spend: number, scale: number): ConversionSet => {
  const totalConversions = Math.round(20 + (h % 400) * scale);
  const totalUnits = Math.round(totalConversions * (1.3 + (h % 7) / 10));
  const totalRevenue = Math.round(totalUnits * (2.5 + (h % 9)));
  const online = 0.55 + ((h >> 2) % 30) / 100;
  const onlineConversions = Math.round(totalConversions * online);
  const onlineUnits = Math.round(totalUnits * online);
  const onlineRevenue = Math.round(totalRevenue * online);
  return {
    totalConversions,
    totalUnits,
    totalRevenue,
    totalRoas: spend ? Math.round((totalRevenue / spend) * 100) : 0,
    totalConversionRate: 0,
    onlineConversions,
    onlineUnits,
    onlineRevenue,
    instoreConversions: totalConversions - onlineConversions,
    instoreUnits: totalUnits - onlineUnits,
    instoreRevenue: totalRevenue - onlineRevenue,
  };
};

export const retailProductPerformance = (id: string): RetailProductPerformance => {
  const h = hashOf(id);
  const impressions = 8000 + (h % 90000);
  const ctr = 0.8 + ((h >> 3) % 25) / 10;
  const clicks = Math.round((impressions * ctr) / 100);
  const avgCpc = 0.25 + ((h >> 5) % 45) / 100;
  const spend = Math.round(clicks * avgCpc);
  const sku = set(h, spend, 1);
  sku.totalConversionRate = clicks ? Math.round((sku.totalConversions / clicks) * 1000) / 10 : 0;
  const brand = set(h >> 1, spend, 1.6);
  brand.totalConversionRate = clicks ? Math.round((brand.totalConversions / clicks) * 1000) / 10 : 0;
  const upcCount = 1 + (h % 5);
  return {
    podId: String(100000 + (h % 300000)),
    upcs: Array.from({ length: upcCount }, (_, i) => String(4138700000 + ((h * (i + 3)) % 99999))),
    status: h % 9 === 0 ? 'paused' : 'active',
    impressions,
    clicks,
    spend,
    avgCpc,
    ctr,
    sku,
    brand,
    searchVolume: (1 + (h % 5)) as Level,
    competitive: (1 + ((h >> 4) % 5)) as Level,
  };
};
