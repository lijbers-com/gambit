// Chart data types
export interface ChartDataPoint {
  [key: string]: string | number | boolean | null | undefined;
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