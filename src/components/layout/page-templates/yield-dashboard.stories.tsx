import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from '@/components/ui/card';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import React, { useState } from 'react';
import { defaultRoutes } from '../default-routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter } from '@/components/ui/filter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Yield Dashboard',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Yield Dashboard Page Template

The Yield Dashboard provides comprehensive fill rate analytics from a retailer's perspective. It shows how well advertising positions are being filled across all advertising engines, helping retailers optimize their inventory monetization.

## Features

- **Fill Rate Focus**: Primary metric showing how well positions are being filled
- **Engine-Specific Views**: General overview and per-engine detailed views
- **Line Chart Visualization**: Trend analysis of fill rates over time
- **Retailer Perspective**: Designed for retail partners managing their ad inventory
- **Real-time Metrics**: Live fill rate indicators with percentage calculations

## Layout Structure

### Yield Dashboard
- **Fill Rate per Engine**: Shows fill rate for each advertising engine
- **Overall Fill Rate**: Combined fill rate across all engines
- **Trend Analysis**: Line chart showing fill rate trends over time
- **Revenue Impact**: How fill rate affects overall revenue

### Engine-Specific Dashboards
- **Sponsored Products**: Fill rate for product placement ads
- **Display**: Fill rate for banner and display advertisements
- **Digital In-store**: Fill rate for in-store digital positions
- **Offline In-store**: Fill rate for physical in-store positions

## Key Metrics

- **Fill Rate**: Percentage of available positions that are filled
- **Available Positions**: Total advertising positions available
- **Filled Positions**: Number of positions with active advertisements
- **Revenue per Position**: Average revenue generated per filled position

## Usage

This template is ideal for:
- Retail partners monitoring ad inventory performance
- Yield optimization and revenue management
- Position availability analysis
- Engine performance comparison
- Strategic planning for ad inventory expansion

## Components Used

- AppLayout (navigation, user management, page header)
- Card (metric cards and chart containers)
- LineChart (fill rate trend visualization)
- MetricCard (fill rate metrics display)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for general yield revenue dashboard
const generalYieldRevenueMetrics = [
  { 
    id: 'offline-instore-revenue', 
    label: 'Offline In-store', 
    value: '€127.8M', 
    subMetric: 'Fill: 86.9%',
    badgeValue: '+47.3%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'digital-instore-revenue', 
    label: 'Digital In-store', 
    value: '€108.6M', 
    subMetric: 'Fill: 91.4%',
    badgeValue: '+52.1%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'display-revenue', 
    label: 'Display', 
    value: '€94.7M', 
    subMetric: 'Fill: 96.7%',
    badgeValue: '+67.8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'sponsored-products-revenue', 
    label: 'Sponsored Products', 
    value: '€78.3M', 
    subMetric: 'Fill: 99.2%',
    badgeValue: '+84.2%',
    badgeVariant: 'success' as const,
  },
];

// Mock data for sponsored products yield
const sponsoredProductsYieldMetrics = [
  { 
    id: 'fill-rate', 
    label: 'Fill Rate', 
    value: '96.8%', 
    subMetric: 'Target: 92.0%',
    badgeValue: '+4.8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-positions', 
    label: 'Total Positions', 
    value: '15,280', 
    subMetric: 'Filled: 14,791',
    badgeValue: '+1,830',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'revenue-per-position', 
    label: 'Revenue per Position', 
    value: '€5.67', 
    subMetric: 'Avg: €3.89',
    badgeValue: '+45.8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-revenue', 
    label: 'Total Revenue', 
    value: '€83,847', 
    subMetric: 'Budget: €45,000',
    badgeValue: '+86.3%',
    badgeVariant: 'success' as const,
  },
];

// Mock data for display yield
const displayYieldMetrics = [
  { 
    id: 'fill-rate', 
    label: 'Fill Rate', 
    value: '92.3%', 
    subMetric: 'Target: 85.0%',
    badgeValue: '+8.6%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-positions', 
    label: 'Total Positions', 
    value: '11,640', 
    subMetric: 'Filled: 10,744',
    badgeValue: '+1,640',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'revenue-per-position', 
    label: 'Revenue per Position', 
    value: '€3.94', 
    subMetric: 'Avg: €2.45',
    badgeValue: '+60.8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-revenue', 
    label: 'Total Revenue', 
    value: '€42,331', 
    subMetric: 'Budget: €18,500',
    badgeValue: '+128.8%',
    badgeVariant: 'success' as const,
  },
];

// Mock data for digital in-store yield
const digitalInstoreYieldMetrics = [
  { 
    id: 'fill-rate', 
    label: 'Fill Rate', 
    value: '91.4%', 
    subMetric: 'Target: 80.0%',
    badgeValue: '+14.3%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-positions', 
    label: 'Total Positions', 
    value: '8,940', 
    subMetric: 'Filled: 8,171',
    badgeValue: '+3,260',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'revenue-per-position', 
    label: 'Revenue per Position', 
    value: '€3.47', 
    subMetric: 'Avg: €1.67',
    badgeValue: '+107.8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-revenue', 
    label: 'Total Revenue', 
    value: '€28,353', 
    subMetric: 'Budget: €8,200',
    badgeValue: '+245.8%',
    badgeVariant: 'success' as const,
  },
];

// Mock data for offline in-store yield
const offlineInstoreYieldMetrics = [
  { 
    id: 'fill-rate', 
    label: 'Fill Rate', 
    value: '86.9%', 
    subMetric: 'Target: 75.0%',
    badgeValue: '+15.9%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-positions', 
    label: 'Total Positions', 
    value: '4,680', 
    subMetric: 'Filled: 4,067',
    badgeValue: '+1,440',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'revenue-per-position', 
    label: 'Revenue per Position', 
    value: '€1.67', 
    subMetric: 'Avg: €0.78',
    badgeValue: '+114.1%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'total-revenue', 
    label: 'Total Revenue', 
    value: '€6,792', 
    subMetric: 'Budget: €2,000',
    badgeValue: '+239.6%',
    badgeVariant: 'success' as const,
  },
];

// Mock chart data for overall fill rate trends
const overallFillRateChartData = [
  { name: 'Jan', fillRate: 85.2, target: 85.0 },
  { name: 'Feb', fillRate: 86.1, target: 85.0 },
  { name: 'Mar', fillRate: 87.3, target: 85.0 },
  { name: 'Apr', fillRate: 88.7, target: 85.0 },
  { name: 'May', fillRate: 89.2, target: 85.0 },
  { name: 'Jun', fillRate: 90.1, target: 85.0 },
];

// Mock chart data for each engine with seasonal patterns
const sponsoredProductsChartData = [
  { name: 'Jan', fillRate: 88.5, target: 92.0 },
  { name: 'Feb', fillRate: 89.2, target: 92.0 },
  { name: 'Mar', fillRate: 90.8, target: 92.0 },
  { name: 'Apr', fillRate: 96.1, target: 92.0 }, // Easter peak
  { name: 'May', fillRate: 94.5, target: 92.0 },
  { name: 'Jun', fillRate: 91.7, target: 92.0 }, // Summer decline
];

const displayChartData = [
  { name: 'Jan', fillRate: 78.1, target: 85.0 }, // Post-holiday low
  { name: 'Feb', fillRate: 79.3, target: 85.0 },
  { name: 'Mar', fillRate: 81.5, target: 85.0 },
  { name: 'Apr', fillRate: 89.2, target: 85.0 }, // Spring peak
  { name: 'May', fillRate: 87.8, target: 85.0 },
  { name: 'Jun', fillRate: 84.2, target: 85.0 }, // Summer decline
];

const digitalInstoreChartData = [
  { name: 'Jan', fillRate: 74.8, target: 80.0 }, // Low season
  { name: 'Feb', fillRate: 75.6, target: 80.0 },
  { name: 'Mar', fillRate: 77.2, target: 80.0 },
  { name: 'Apr', fillRate: 84.1, target: 80.0 }, // Spring shopping peak
  { name: 'May', fillRate: 82.7, target: 80.0 },
  { name: 'Jun', fillRate: 79.4, target: 80.0 }, // Summer vacation impact
];

const offlineInstoreChartData = [
  { name: 'Jan', fillRate: 68.2, target: 75.0 }, // Post-holiday slump
  { name: 'Feb', fillRate: 69.1, target: 75.0 },
  { name: 'Mar', fillRate: 71.4, target: 75.0 },
  { name: 'Apr', fillRate: 78.9, target: 75.0 }, // Easter shopping boost
  { name: 'May', fillRate: 76.3, target: 75.0 },
  { name: 'Jun', fillRate: 72.8, target: 75.0 }, // Summer outdoor activities reduce in-store
];

const fillRateChartConfig = {
  fillRate: {
    label: 'Fill Rate',
    color: 'hsl(var(--chart-1))',
  },
  target: {
    label: 'Target',
    color: 'hsl(var(--chart-2))',
  },
};

// Mock data for fill rate trends per engine (12 months) - with seasonal patterns
const fullYearFillRateData = [
  // January - Post-holiday dip, lower demand
  { name: 'Jan', offlineInstore: 68.2, digitalInstore: 74.8, display: 78.1, sponsoredProducts: 88.5 },
  // February - Still low, winter season
  { name: 'Feb', offlineInstore: 69.1, digitalInstore: 75.6, display: 79.3, sponsoredProducts: 89.2 },
  // March - Spring awakening, gradual increase
  { name: 'Mar', offlineInstore: 71.4, digitalInstore: 77.2, display: 81.5, sponsoredProducts: 90.8 },
  // April - Easter/Spring peak, higher demand and prices
  { name: 'Apr', offlineInstore: 78.9, digitalInstore: 84.1, display: 89.2, sponsoredProducts: 96.1 },
  // May - Continued spring momentum
  { name: 'May', offlineInstore: 76.3, digitalInstore: 82.7, display: 87.8, sponsoredProducts: 94.5 },
  // June - Summer start, declining demand
  { name: 'Jun', offlineInstore: 72.8, digitalInstore: 79.4, display: 84.2, sponsoredProducts: 91.7 },
  // July - Summer low, vacation period
  { name: 'Jul', offlineInstore: 69.5, digitalInstore: 76.1, display: 80.8, sponsoredProducts: 88.9 },
  // August - Continued summer low
  { name: 'Aug', offlineInstore: 68.7, digitalInstore: 75.3, display: 79.9, sponsoredProducts: 88.1 },
  // September - Back to school, moderate recovery
  { name: 'Sep', offlineInstore: 73.2, digitalInstore: 79.8, display: 83.6, sponsoredProducts: 91.4 },
  // October - Autumn build-up
  { name: 'Oct', offlineInstore: 75.6, digitalInstore: 81.9, display: 85.7, sponsoredProducts: 93.2 },
  // November - Pre-Christmas ramp up
  { name: 'Nov', offlineInstore: 82.4, digitalInstore: 87.6, display: 92.1, sponsoredProducts: 97.8 },
  // December - Christmas peak, highest demand and prices
  { name: 'Dec', offlineInstore: 86.9, digitalInstore: 91.4, display: 96.7, sponsoredProducts: 99.2 },
];

// Historical data for multiple years
const historicalFillRateData = {
  2023: [
    { name: 'Jan', offlineInstore2023: 65.8, digitalInstore2023: 72.1, display2023: 75.3, sponsoredProducts2023: 85.2 },
    { name: 'Feb', offlineInstore2023: 66.7, digitalInstore2023: 73.0, display2023: 76.8, sponsoredProducts2023: 86.1 },
    { name: 'Mar', offlineInstore2023: 68.9, digitalInstore2023: 74.5, display2023: 78.9, sponsoredProducts2023: 87.9 },
    { name: 'Apr', offlineInstore2023: 75.2, digitalInstore2023: 80.8, display2023: 85.7, sponsoredProducts2023: 92.4 },
    { name: 'May', offlineInstore2023: 73.1, digitalInstore2023: 79.3, display2023: 84.2, sponsoredProducts2023: 91.1 },
    { name: 'Jun', offlineInstore2023: 69.8, digitalInstore2023: 76.2, display2023: 81.5, sponsoredProducts2023: 88.9 },
    { name: 'Jul', offlineInstore2023: 66.4, digitalInstore2023: 73.8, display2023: 78.1, sponsoredProducts2023: 85.7 },
    { name: 'Aug', offlineInstore2023: 65.9, digitalInstore2023: 72.9, display2023: 77.4, sponsoredProducts2023: 85.1 },
    { name: 'Sep', offlineInstore2023: 70.1, digitalInstore2023: 76.9, display2023: 80.8, sponsoredProducts2023: 88.2 },
    { name: 'Oct', offlineInstore2023: 72.8, digitalInstore2023: 78.7, display2023: 82.9, sponsoredProducts2023: 90.1 },
    { name: 'Nov', offlineInstore2023: 79.2, digitalInstore2023: 84.4, display2023: 88.9, sponsoredProducts2023: 94.7 },
    { name: 'Dec', offlineInstore2023: 83.5, digitalInstore2023: 88.1, display2023: 93.2, sponsoredProducts2023: 96.1 },
  ],
  2022: [
    { name: 'Jan', offlineInstore2022: 62.4, digitalInstore2022: 69.8, display2022: 72.9, sponsoredProducts2022: 82.1 },
    { name: 'Feb', offlineInstore2022: 63.2, digitalInstore2022: 70.5, display2022: 74.2, sponsoredProducts2022: 83.4 },
    { name: 'Mar', offlineInstore2022: 65.8, digitalInstore2022: 72.1, display2022: 76.4, sponsoredProducts2022: 85.2 },
    { name: 'Apr', offlineInstore2022: 72.1, digitalInstore2022: 78.2, display2022: 82.9, sponsoredProducts2022: 89.7 },
    { name: 'May', offlineInstore2022: 70.2, digitalInstore2022: 76.8, display2022: 81.5, sponsoredProducts2022: 88.4 },
    { name: 'Jun', offlineInstore2022: 66.9, digitalInstore2022: 73.5, display2022: 78.8, sponsoredProducts2022: 86.2 },
    { name: 'Jul', offlineInstore2022: 63.8, digitalInstore2022: 71.2, display2022: 75.4, sponsoredProducts2022: 83.1 },
    { name: 'Aug', offlineInstore2022: 63.1, digitalInstore2022: 70.4, display2022: 74.8, sponsoredProducts2022: 82.6 },
    { name: 'Sep', offlineInstore2022: 67.4, digitalInstore2022: 74.2, display2022: 78.1, sponsoredProducts2022: 85.7 },
    { name: 'Oct', offlineInstore2022: 69.8, digitalInstore2022: 76.1, display2022: 80.2, sponsoredProducts2022: 87.4 },
    { name: 'Nov', offlineInstore2022: 76.1, digitalInstore2022: 81.7, display2022: 86.2, sponsoredProducts2022: 92.1 },
    { name: 'Dec', offlineInstore2022: 80.2, digitalInstore2022: 85.4, display2022: 90.5, sponsoredProducts2022: 93.8 },
  ],
  2021: [
    { name: 'Jan', offlineInstore2021: 58.9, digitalInstore2021: 66.2, display2021: 69.8, sponsoredProducts2021: 78.4 },
    { name: 'Feb', offlineInstore2021: 59.8, digitalInstore2021: 67.1, display2021: 71.2, sponsoredProducts2021: 79.8 },
    { name: 'Mar', offlineInstore2021: 62.1, digitalInstore2021: 68.9, display2021: 73.5, sponsoredProducts2021: 81.7 },
    { name: 'Apr', offlineInstore2021: 68.4, digitalInstore2021: 74.8, display2021: 79.2, sponsoredProducts2021: 86.1 },
    { name: 'May', offlineInstore2021: 66.7, digitalInstore2021: 73.2, display2021: 78.1, sponsoredProducts2021: 84.9 },
    { name: 'Jun', offlineInstore2021: 63.2, digitalInstore2021: 70.1, display2021: 75.4, sponsoredProducts2021: 82.7 },
    { name: 'Jul', offlineInstore2021: 60.4, digitalInstore2021: 67.8, display2021: 72.1, sponsoredProducts2021: 79.8 },
    { name: 'Aug', offlineInstore2021: 59.8, digitalInstore2021: 67.1, display2021: 71.5, sponsoredProducts2021: 79.2 },
    { name: 'Sep', offlineInstore2021: 63.9, digitalInstore2021: 70.8, display2021: 74.7, sponsoredProducts2021: 82.4 },
    { name: 'Oct', offlineInstore2021: 66.2, digitalInstore2021: 72.9, display2021: 76.8, sponsoredProducts2021: 84.1 },
    { name: 'Nov', offlineInstore2021: 72.4, digitalInstore2021: 78.9, display2021: 82.7, sponsoredProducts2021: 89.2 },
    { name: 'Dec', offlineInstore2021: 76.8, digitalInstore2021: 82.1, display2021: 86.9, sponsoredProducts2021: 91.4 },
  ]
};

// Previous year seasonality data (2023) - 52 weeks
const previousYearSeasonalityData = [
  // January (weeks 1-4) - Previous year was lower
  { name: '1', prevSeasonality: 74 },
  { name: '2', prevSeasonality: 78 },
  { name: '3', prevSeasonality: 81 },
  { name: '4', prevSeasonality: 84 },
  // February (weeks 5-8)
  { name: '5', prevSeasonality: 86 },
  { name: '6', prevSeasonality: 83 },
  { name: '7', prevSeasonality: 81 },
  { name: '8', prevSeasonality: 85 },
  // March (weeks 9-13)
  { name: '9', prevSeasonality: 88 },
  { name: '10', prevSeasonality: 92 },
  { name: '11', prevSeasonality: 94 },
  { name: '12', prevSeasonality: 96 },
  { name: '13', prevSeasonality: 101 },
  // April (weeks 14-17) - Easter was different timing
  { name: '14', prevSeasonality: 114 },
  { name: '15', prevSeasonality: 121 },
  { name: '16', prevSeasonality: 128 },
  { name: '17', prevSeasonality: 124 },
  // May (weeks 18-22)
  { name: '18', prevSeasonality: 118 },
  { name: '19', prevSeasonality: 114 },
  { name: '20', prevSeasonality: 111 },
  { name: '21', prevSeasonality: 108 },
  { name: '22', prevSeasonality: 104 },
  // June (weeks 23-26)
  { name: '23', prevSeasonality: 101 },
  { name: '24', prevSeasonality: 98 },
  { name: '25', prevSeasonality: 94 },
  { name: '26', prevSeasonality: 90 },
  // July (weeks 27-30)
  { name: '27', prevSeasonality: 84 },
  { name: '28', prevSeasonality: 81 },
  { name: '29', prevSeasonality: 78 },
  { name: '30', prevSeasonality: 80 },
  // August (weeks 31-35)
  { name: '31', prevSeasonality: 79 },
  { name: '32', prevSeasonality: 77 },
  { name: '33', prevSeasonality: 81 },
  { name: '34', prevSeasonality: 84 },
  { name: '35', prevSeasonality: 88 },
  // September (weeks 36-39)
  { name: '36', prevSeasonality: 94 },
  { name: '37', prevSeasonality: 101 },
  { name: '38', prevSeasonality: 108 },
  { name: '39', prevSeasonality: 104 },
  // October (weeks 40-43)
  { name: '40', prevSeasonality: 111 },
  { name: '41', prevSeasonality: 114 },
  { name: '42', prevSeasonality: 118 },
  { name: '43', prevSeasonality: 121 },
  // November (weeks 44-48)
  { name: '44', prevSeasonality: 128 },
  { name: '45', prevSeasonality: 134 },
  { name: '46', prevSeasonality: 141 },
  { name: '47', prevSeasonality: 148 },
  { name: '48', prevSeasonality: 154 },
  // December (weeks 49-52) - Christmas peak was slightly lower
  { name: '49', prevSeasonality: 161 },
  { name: '50', prevSeasonality: 174 },
  { name: '51', prevSeasonality: 191 },
  { name: '52', prevSeasonality: 206 },
];

// Function to merge multiple years of data
const mergeMultipleYearsData = (currentData: any[], selectedYears: string[]) => {
  let mergedData = currentData;
  
  selectedYears.forEach(year => {
    const yearData = historicalFillRateData[year as keyof typeof historicalFillRateData];
    if (yearData) {
      mergedData = mergedData.map((current, index) => ({
        ...current,
        ...yearData[index]
      }));
    }
  });
  
  return mergedData;
};

// Function to merge seasonality data for multiple years
const mergeSeasonalityData = (currentData: any[], selectedYears: string[]) => {
  let mergedData = currentData;
  
  const historicalSeasonalityData: { [key: string]: any[] } = {
    '2023': seasonalityChartData.map(item => ({ name: item.name, seasonality2023: item.seasonality - 4 })),
    '2022': seasonalityChartData.map(item => ({ name: item.name, seasonality2022: item.seasonality - 8 })),
    '2021': seasonalityChartData.map(item => ({ name: item.name, seasonality2021: item.seasonality - 12 })),
  };
  
  selectedYears.forEach(year => {
    const yearData = historicalSeasonalityData[year];
    if (yearData) {
      mergedData = mergedData.map((current, index) => ({
        ...current,
        ...yearData[index]
      }));
    }
  });
  
  return mergedData;
};

// Function to filter data based on date range
const getFilteredFillRateData = (dateRange: DateRange | undefined, selectedYears: string[] = []) => {
  let currentData = fullYearFillRateData;
  
  if (dateRange?.from && dateRange?.to) {
    const fromMonth = dateRange.from.getMonth();
    const toMonth = dateRange.to.getMonth();
    
    if (fromMonth <= toMonth) {
      currentData = fullYearFillRateData.slice(fromMonth, toMonth + 1);
    } else {
      // Handle year-end wrapping
      currentData = [...fullYearFillRateData.slice(fromMonth), ...fullYearFillRateData.slice(0, toMonth + 1)];
    }
  }
  
  return selectedYears.length > 0 ? mergeMultipleYearsData(currentData, selectedYears) : currentData;
};

// Function to get seasonality data with optional comparison years
const getSeasonalityData = (selectedYears: string[] = []) => {
  return selectedYears.length > 0 ? mergeSeasonalityData(seasonalityChartData, selectedYears) : seasonalityChartData;
};

const fillRateTrendChartConfig = {
  offlineInstore: {
    label: 'Offline In-store (2024)',
    color: 'hsl(var(--chart-1))',
  },
  digitalInstore: {
    label: 'Digital In-store (2024)',
    color: 'hsl(var(--chart-2))',
  },
  display: {
    label: 'Display (2024)',
    color: 'hsl(var(--chart-3))',
  },
  sponsoredProducts: {
    label: 'Sponsored Products (2024)',
    color: 'hsl(var(--chart-4))',
  },
  offlineInstore2023: {
    label: 'Offline In-store (2023)',
    color: 'hsl(var(--chart-1) / 0.5)',
  },
  digitalInstore2023: {
    label: 'Digital In-store (2023)',
    color: 'hsl(var(--chart-2) / 0.5)',
  },
  display2023: {
    label: 'Display (2023)',
    color: 'hsl(var(--chart-3) / 0.5)',
  },
  sponsoredProducts2023: {
    label: 'Sponsored Products (2023)',
    color: 'hsl(var(--chart-4) / 0.5)',
  },
  offlineInstore2022: {
    label: 'Offline In-store (2022)',
    color: 'hsl(var(--chart-1) / 0.3)',
  },
  digitalInstore2022: {
    label: 'Digital In-store (2022)',
    color: 'hsl(var(--chart-2) / 0.3)',
  },
  display2022: {
    label: 'Display (2022)',
    color: 'hsl(var(--chart-3) / 0.3)',
  },
  sponsoredProducts2022: {
    label: 'Sponsored Products (2022)',
    color: 'hsl(var(--chart-4) / 0.3)',
  },
  offlineInstore2021: {
    label: 'Offline In-store (2021)',
    color: 'hsl(var(--chart-1) / 0.2)',
  },
  digitalInstore2021: {
    label: 'Digital In-store (2021)',
    color: 'hsl(var(--chart-2) / 0.2)',
  },
  display2021: {
    label: 'Display (2021)',
    color: 'hsl(var(--chart-3) / 0.2)',
  },
  sponsoredProducts2021: {
    label: 'Sponsored Products (2021)',
    color: 'hsl(var(--chart-4) / 0.2)',
  },
};

// Mock data for seasonality (100% = normal, higher = increased demand/prices)
// 52 weeks of data with realistic seasonal patterns
const seasonalityChartData = [
  // January (weeks 1-4) - Post-holiday slump
  { name: '1', seasonality: 78 },
  { name: '2', seasonality: 82 },
  { name: '3', seasonality: 85 },
  { name: '4', seasonality: 88 },
  // February (weeks 5-8) - Winter low
  { name: '5', seasonality: 90 },
  { name: '6', seasonality: 87 },
  { name: '7', seasonality: 85 },
  { name: '8', seasonality: 89 },
  // March (weeks 9-13) - Spring awakening
  { name: '9', seasonality: 92 },
  { name: '10', seasonality: 96 },
  { name: '11', seasonality: 98 },
  { name: '12', seasonality: 100 },
  { name: '13', seasonality: 105 },
  // April (weeks 14-17) - Easter peak
  { name: '14', seasonality: 118 },
  { name: '15', seasonality: 125 },
  { name: '16', seasonality: 132 },
  { name: '17', seasonality: 128 },
  // May (weeks 18-22) - Spring maintenance
  { name: '18', seasonality: 122 },
  { name: '19', seasonality: 118 },
  { name: '20', seasonality: 115 },
  { name: '21', seasonality: 112 },
  { name: '22', seasonality: 108 },
  // June (weeks 23-26) - Summer decline starts
  { name: '23', seasonality: 105 },
  { name: '24', seasonality: 102 },
  { name: '25', seasonality: 98 },
  { name: '26', seasonality: 94 },
  // July (weeks 27-30) - Summer low
  { name: '27', seasonality: 88 },
  { name: '28', seasonality: 85 },
  { name: '29', seasonality: 82 },
  { name: '30', seasonality: 84 },
  // August (weeks 31-35) - Continued summer low
  { name: '31', seasonality: 83 },
  { name: '32', seasonality: 81 },
  { name: '33', seasonality: 85 },
  { name: '34', seasonality: 88 },
  { name: '35', seasonality: 92 },
  // September (weeks 36-39) - Back to school
  { name: '36', seasonality: 98 },
  { name: '37', seasonality: 105 },
  { name: '38', seasonality: 112 },
  { name: '39', seasonality: 108 },
  // October (weeks 40-43) - Autumn build-up
  { name: '40', seasonality: 115 },
  { name: '41', seasonality: 118 },
  { name: '42', seasonality: 122 },
  { name: '43', seasonality: 125 },
  // November (weeks 44-48) - Pre-Christmas ramp up
  { name: '44', seasonality: 132 },
  { name: '45', seasonality: 138 },
  { name: '46', seasonality: 145 },
  { name: '47', seasonality: 152 },
  { name: '48', seasonality: 158 },
  // December (weeks 49-52) - Christmas peak
  { name: '49', seasonality: 165 },
  { name: '50', seasonality: 178 },
  { name: '51', seasonality: 195 },
  { name: '52', seasonality: 210 },
];

const seasonalityChartConfig = {
  seasonality: {
    label: '2024',
    color: 'hsl(var(--chart-1))',
  },
  seasonality2023: {
    label: '2023',
    color: 'hsl(var(--chart-1) / 0.5)',
  },
  seasonality2022: {
    label: '2022',
    color: 'hsl(var(--chart-1) / 0.3)',
  },
  seasonality2021: {
    label: '2021',
    color: 'hsl(var(--chart-1) / 0.2)',
  },
};

// Mock data for positions tables
const sponsoredProductsPositionsData = [
  { id: 'SP-001', name: 'Search Results Top', fillRate: '99.2%', totalPositions: 1200, filledPositions: 1190, revenue: '€4,567', roas: '3.24x' },
  { id: 'SP-002', name: 'Product Detail Page', fillRate: '98.8%', totalPositions: 850, filledPositions: 840, revenue: '€3,891', roas: '2.98x' },
  { id: 'SP-003', name: 'Category Listings', fillRate: '97.5%', totalPositions: 650, filledPositions: 634, revenue: '€2,156', roas: '2.76x' },
  { id: 'SP-004', name: 'Search Results Bottom', fillRate: '96.1%', totalPositions: 450, filledPositions: 432, revenue: '€1,234', roas: '2.12x' },
];

const sponsoredProductsMediaData = [
  { id: 'SPM-001', name: 'Product Banner 728x90', fillRate: '99.5%', impressions: 45000, clicks: 1250, revenue: '€3,200', ctr: '2.78%' },
  { id: 'SPM-002', name: 'Product Tile 300x250', fillRate: '98.2%', impressions: 32000, clicks: 890, revenue: '€2,450', ctr: '2.78%' },
  { id: 'SPM-003', name: 'Search Ad Text', fillRate: '97.8%', impressions: 28000, clicks: 756, revenue: '€1,890', ctr: '2.70%' },
  { id: 'SPM-004', name: 'Category Spotlight', fillRate: '96.4%', impressions: 18000, clicks: 468, revenue: '€1,120', ctr: '2.60%' },
];

const displayPositionsData = [
  { id: 'DP-001', name: 'Homepage Hero Banner', fillRate: '96.7%', totalPositions: 800, filledPositions: 774, revenue: '€2,890', roas: '2.45x' },
  { id: 'DP-002', name: 'Category Page Header', fillRate: '95.2%', totalPositions: 600, filledPositions: 571, revenue: '€1,780', roas: '2.12x' },
  { id: 'DP-003', name: 'Sidebar Banner 300x600', fillRate: '93.8%', totalPositions: 450, filledPositions: 422, revenue: '€1,230', roas: '1.98x' },
  { id: 'DP-004', name: 'Footer Banner', fillRate: '91.5%', totalPositions: 320, filledPositions: 293, revenue: '€890', roas: '1.76x' },
];

const displayMediaData = [
  { id: 'DM-001', name: 'Leaderboard 728x90', fillRate: '96.2%', impressions: 35000, clicks: 875, revenue: '€2,100', ctr: '2.50%' },
  { id: 'DM-002', name: 'Rectangle 300x250', fillRate: '94.8%', impressions: 28000, clicks: 672, revenue: '€1,680', ctr: '2.40%' },
  { id: 'DM-003', name: 'Skyscraper 160x600', fillRate: '93.1%', impressions: 22000, clicks: 506, revenue: '€1,265', ctr: '2.30%' },
  { id: 'DM-004', name: 'Mobile Banner 320x50', fillRate: '92.3%', impressions: 18000, clicks: 396, revenue: '€990', ctr: '2.20%' },
];

const digitalInstorePositionsData = [
  { id: 'DI-001', name: 'Entrance Digital Screen', fillRate: '91.4%', totalPositions: 150, filledPositions: 137, revenue: '€1,890', roas: '2.34x' },
  { id: 'DI-002', name: 'Aisle End Display', fillRate: '89.7%', totalPositions: 120, filledPositions: 108, revenue: '€1,456', roas: '2.12x' },
  { id: 'DI-003', name: 'Checkout Screen', fillRate: '88.2%', totalPositions: 80, filledPositions: 71, revenue: '€892', roas: '1.98x' },
  { id: 'DI-004', name: 'Product Shelf Display', fillRate: '86.8%', totalPositions: 60, filledPositions: 52, revenue: '€624', roas: '1.76x' },
];

const digitalInstoreMediaData = [
  { id: 'DIM-001', name: 'Video Ad 1920x1080', fillRate: '90.8%', impressions: 12000, clicks: 240, revenue: '€1,440', ctr: '2.00%' },
  { id: 'DIM-002', name: 'Interactive Banner', fillRate: '89.2%', impressions: 9500, clicks: 190, revenue: '€1,140', ctr: '2.00%' },
  { id: 'DIM-003', name: 'Product Showcase', fillRate: '87.6%', impressions: 7800, clicks: 156, revenue: '€936', ctr: '2.00%' },
  { id: 'DIM-004', name: 'Brand Spotlight', fillRate: '86.1%', impressions: 6200, clicks: 124, revenue: '€744', ctr: '2.00%' },
];

const offlineInstorePositionsData = [
  { id: 'OI-001', name: 'Entrance Poster Frame', fillRate: '86.9%', totalPositions: 45, filledPositions: 39, revenue: '€468', roas: '1.89x' },
  { id: 'OI-002', name: 'Aisle Header Banner', fillRate: '84.2%', totalPositions: 35, filledPositions: 29, revenue: '€348', roas: '1.67x' },
  { id: 'OI-003', name: 'Checkout Counter Display', fillRate: '82.6%', totalPositions: 25, filledPositions: 21, revenue: '€252', roas: '1.45x' },
  { id: 'OI-004', name: 'Product End Cap', fillRate: '80.1%', totalPositions: 20, filledPositions: 16, revenue: '€192', roas: '1.23x' },
];

const offlineInstoreMediaData = [
  { id: 'OIM-001', name: 'A1 Poster 594x841mm', fillRate: '85.4%', impressions: 3500, clicks: 70, revenue: '€420', ctr: '2.00%' },
  { id: 'OIM-002', name: 'Shelf Talker 100x150mm', fillRate: '83.7%', impressions: 2800, clicks: 56, revenue: '€336', ctr: '2.00%' },
  { id: 'OIM-003', name: 'Floor Graphic 500x500mm', fillRate: '81.9%', impressions: 2200, clicks: 44, revenue: '€264', ctr: '2.00%' },
  { id: 'OIM-004', name: 'Window Cling 300x400mm', fillRate: '79.8%', impressions: 1800, clicks: 36, revenue: '€216', ctr: '2.00%' },
];

// Helper function for performance badge variants
const getPerformanceBadgeVariant = (fillRate: string): "default" | "destructive" | "secondary" | "outline" | "success" | "warning" => {
  const rate = parseFloat(fillRate.replace('%', ''));
  if (rate >= 95) return 'success';
  if (rate >= 90) return 'warning';
  return 'destructive';
};

// Simplified Year Comparison Filter Component
const YearComparisonFilter = ({ 
  selectedYears,
  onYearsChange
}: { 
  selectedYears: string[];
  onYearsChange: (years: string[]) => void;
}) => (
  <div className="mb-4">
    <Filter
      name="Compare Years"
      options={[
        { label: '2023', value: '2023' },
        { label: '2022', value: '2022' },
        { label: '2021', value: '2021' },
      ]}
      selectedValues={selectedYears}
      onChange={onYearsChange}
    />
  </div>
);

export const YieldDashboard: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('sponsored-products-revenue');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(2024, 0, 1), // January 1, 2024
      to: new Date(2024, 11, 31), // December 31, 2024
    });
    
    // Separate comparison years state for each chart
    const [fillRateComparisonYears, setFillRateComparisonYears] = useState<string[]>([]);
    const [seasonalityComparisonYears, setSeasonalityComparisonYears] = useState<string[]>([]);

    const selectedMetricData = generalYieldRevenueMetrics.find(metric => metric.id === selectedMetric);
    const filteredFillRateData = getFilteredFillRateData(dateRange, fillRateComparisonYears);
    const seasonalityData = getSeasonalityData(seasonalityComparisonYears);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          email: 'john@albertheijn.nl',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: "Yield Overview",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
        }}
      >
        <div className="space-y-6">
          {/* Revenue Overview Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {generalYieldRevenueMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={false}
                  />
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Fill Rate Trend by Engine</h3>
                <YearComparisonFilter
                  selectedYears={fillRateComparisonYears}
                  onYearsChange={setFillRateComparisonYears}
                />
                <div className="w-full">
                  <LineChartComponent
                    data={filteredFillRateData}
                    config={fillRateTrendChartConfig}
                    xAxisDataKey="name"
                    className="h-[300px] w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Seasonality Card */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonality Index</CardTitle>
            </CardHeader>
            <CardContent>
              <YearComparisonFilter
                selectedYears={seasonalityComparisonYears}
                onYearsChange={setSeasonalityComparisonYears}
              />
              <div className="w-full">
                <BarChartComponent
                  data={seasonalityData}
                  config={seasonalityChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px] w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};

export const SponsoredProductsYield: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(), // today
    });
    const [activeTab, setActiveTab] = useState('positions');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const selectedMetricData = sponsoredProductsYieldMetrics.find(metric => metric.id === selectedMetric);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          email: 'john@albertheijn.nl',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: "Sponsored Products Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {sponsoredProductsYieldMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={sponsoredProductsChartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Positions and Media Products Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'positions', label: 'Positions' },
                  { value: 'media-products', label: 'Media Products' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="positions" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={sponsoredProductsPositionsData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to position details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="media-products" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={sponsoredProductsMediaData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to media product details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};

export const DisplayYield: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(), // today
    });
    const [activeTab, setActiveTab] = useState('positions');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const selectedMetricData = displayYieldMetrics.find(metric => metric.id === selectedMetric);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          email: 'john@albertheijn.nl',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: "Display Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {displayYieldMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={displayChartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Positions and Media Products Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'positions', label: 'Positions' },
                  { value: 'media-products', label: 'Media Products' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="positions" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={displayPositionsData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to position details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="media-products" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={displayMediaData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to media product details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};

export const DigitalInstoreYield: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(), // today
    });
    const [activeTab, setActiveTab] = useState('stores');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const selectedMetricData = digitalInstoreYieldMetrics.find(metric => metric.id === selectedMetric);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          email: 'john@albertheijn.nl',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: "Digital In-store Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {digitalInstoreYieldMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={digitalInstoreChartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stores and Players Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'stores', label: 'Stores' },
                  { value: 'players', label: 'Players' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="stores" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={digitalInstorePositionsData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to store details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="players" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={digitalInstoreMediaData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to player details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};

export const OfflineInstoreYield: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(), // today
    });
    const [activeTab, setActiveTab] = useState('positions');
    const [selectedPositions, setSelectedPositions] = useState<React.Key[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<React.Key[]>([]);

    const selectedMetricData = offlineInstoreYieldMetrics.find(metric => metric.id === selectedMetric);

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          email: 'john@albertheijn.nl',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: "Offline In-store Yield",
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {offlineInstoreYieldMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    subMetric={metric.subMetric}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    isSelected={selectedMetric === metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetricData?.label || 'Fill Rate'} Trend
                </h3>
                <LineChartComponent
                  data={offlineInstoreChartData}
                  config={fillRateChartConfig}
                  xAxisDataKey="name"
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Positions and Media Products Table */}
          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'positions', label: 'Positions' },
                  { value: 'media-products', label: 'Media Products' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="positions" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'totalPositions', header: 'Total Positions', render: (row) => row.totalPositions.toLocaleString() },
                      { key: 'filledPositions', header: 'Filled Positions', render: (row) => row.filledPositions.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={offlineInstorePositionsData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to position details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPositions,
                      onChange: setSelectedPositions,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="media-products" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                        <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                          {row.fillRate}
                        </Badge>
                      )},
                      { key: 'impressions', header: 'Impressions', render: (row) => row.impressions.toLocaleString() },
                      { key: 'clicks', header: 'Clicks', render: (row) => row.clicks.toLocaleString() },
                      { key: 'revenue', header: 'Revenue' },
                      { key: 'ctr', header: 'CTR' },
                    ]}
                    data={offlineInstoreMediaData}
                    rowKey={(row) => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={(row) => {
                      console.log('Navigate to media product details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedMedia,
                      onChange: setSelectedMedia,
                      getKey: (row) => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};