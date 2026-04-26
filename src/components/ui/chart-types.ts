// Chart data types
export interface ChartDataPoint {
  [key: string]: string | number | boolean | null | undefined;
}

const trimZeros = (s: string) => s.replace(/\.?0+$/, '');

export function formatYAxisTick(value: number): string {
  if (!Number.isFinite(value)) return '';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return trimZeros((value / 1_000_000).toFixed(1)) + 'M';
  if (abs >= 1_000) return Math.round(value / 1_000) + 'K';
  if (Number.isInteger(value)) return String(value);
  return trimZeros(value.toFixed(2));
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
    icon?: React.ReactNode;
  };
}

// Specific chart data interfaces
export interface FillRateData extends ChartDataPoint {
  day: string;
  fillRate: number;
}

export interface EcpmByDeviceData extends ChartDataPoint {
  device: string;
  ecpm: number;
  impressions: number;
}

export interface RevenueByHourData extends ChartDataPoint {
  hour: string;
  revenue: number;
}

export interface BidCompetitionData extends ChartDataPoint {
  keyword: string;
  competition: number;
  avgBid: number;
}

export interface RevenueByCategoryData extends ChartDataPoint {
  category: string;
  revenue: number;
  fillRate: number;
}