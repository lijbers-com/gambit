import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { FilterBar } from '@/components/ui/filter-bar';

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

// Mock data for general fill rate metrics
const generalFillRateMetrics = [
  {
    id: 'general-fill-rate',
    label: 'General Fill Rate',
    value: '93.6%',
    subMetric: 'Target: 88%',
    badgeValue: '+6.2%',
    badgeVariant: 'success' as const,
  },
  {
    id: 'sponsored-products-fill',
    label: 'Sponsored Products',
    value: '99.2%',
    subMetric: 'Target: 95%',
    badgeValue: '+4.2%',
    badgeVariant: 'success' as const,
  },
  {
    id: 'display-fill',
    label: 'Display',
    value: '96.7%',
    subMetric: 'Target: 90%',
    badgeValue: '+7.4%',
    badgeVariant: 'success' as const,
  },
  {
    id: 'digital-instore-fill',
    label: 'Digital In-store',
    value: '91.4%',
    subMetric: 'Target: 85%',
    badgeValue: '+6.8%',
    badgeVariant: 'success' as const,
  },
  {
    id: 'offline-instore-fill',
    label: 'Offline In-store',
    value: '86.9%',
    subMetric: 'Target: 80%',
    badgeValue: '+8.6%',
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
    const yearData = historicalFillRateData[year as unknown as keyof typeof historicalFillRateData];
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

// Function to get single engine fill rate data
const getSingleEngineFillRateData = (engineId: string, dateRange: DateRange | undefined) => {
  const fullData = getFilteredFillRateData(dateRange, []);

  // Handle General Fill Rate - show combined average
  if (engineId === 'general-fill-rate') {
    return fullData.map(item => {
      const avgFillRate = (item.sponsoredProducts + item.display + item.digitalInstore + item.offlineInstore) / 4;
      return {
        name: item.name,
        fillRate: Number(avgFillRate.toFixed(1)),
        target: 88.0 // Overall target for general fill rate
      };
    });
  }

  const engineMapping: { [key: string]: string } = {
    'sponsored-products-fill': 'sponsoredProducts',
    'display-fill': 'display',
    'digital-instore-fill': 'digitalInstore',
    'offline-instore-fill': 'offlineInstore'
  };

  const engineKey = engineMapping[engineId] || 'sponsoredProducts';

  // Transform data to have only the selected engine and add target
  return fullData.map(item => ({
    name: item.name,
    fillRate: item[engineKey as keyof typeof item],
    target: engineKey === 'sponsoredProducts' ? 92.0 :
            engineKey === 'display' ? 85.0 :
            engineKey === 'digitalInstore' ? 80.0 : 75.0
  }));
};

// Function to filter fill rate metrics based on engine filter
const getFilteredFillRateMetrics = (engineFilter: string | undefined) => {
  if (!engineFilter || engineFilter === 'all') {
    return generalFillRateMetrics;
  }

  const engineMapping: { [key: string]: string } = {
    'sponsored-products': 'sponsored-products-fill',
    'display': 'display-fill',
    'digital-instore': 'digital-instore-fill',
    'offline-instore': 'offline-instore-fill'
  };

  const targetMetricId = engineMapping[engineFilter];
  return generalFillRateMetrics.filter(metric => metric.id === targetMetricId);
};

// Function to filter chart data based on engine filter
const getFilteredChartData = (
  selectedMetric: string,
  engineFilter: string | undefined,
  dateRange: DateRange | undefined,
  fillRateComparisonYears: string[]
) => {
  // Always return single engine data since a metric is always selected
  return getSingleEngineFillRateData(selectedMetric, dateRange);
};

// Function to filter inventory data based on channel filter
const getFilteredInventoryData = (channelFilter: string | undefined) => {
  if (!channelFilter || channelFilter === 'all') {
    return channelReportData;
  }

  // Filter to show only selected channel across all engines
  return channelReportData.map(item => ({
    engine: item.engine,
    [channelFilter]: item[channelFilter as keyof typeof item] || 0
  }));
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

// Mock data for Revenue Report
const revenueReportMetrics = [
  {
    id: 'total-revenue',
    label: 'Total Revenue',
    value: '€2.4M',
    subMetric: 'This month',
    badgeValue: '+15.3%',
    badgeVariant: 'success' as const,
  },
  {
    id: 'avg-cpm',
    label: 'Average CPM',
    value: '€12.45',
    subMetric: 'Cost per mille',
    badgeValue: '-2.1%',
    badgeVariant: 'destructive' as const,
  },
  {
    id: 'revenue-per-position',
    label: 'Revenue per Position',
    value: '€4.67',
    subMetric: 'Average',
    badgeValue: '+8.7%',
    badgeVariant: 'success' as const,
  },
];

const revenueChartData = [
  { name: 'Jan', revenue: 187000, target: 180000 },
  { name: 'Feb', revenue: 201000, target: 190000 },
  { name: 'Mar', revenue: 195000, target: 200000 },
  { name: 'Apr', revenue: 223000, target: 210000 },
  { name: 'May', revenue: 234000, target: 220000 },
  { name: 'Jun', revenue: 218000, target: 215000 },
];

const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  target: {
    label: 'Target',
    color: 'hsl(var(--chart-2))',
  },
};

// Mock data for Market Index Report - Top 5 best and worst performing products
const marketIndexData = [
  // Top 5 Best Performing
  {
    product: 'Search Ads',
    performance: 'best',
    listPrice: 85,
    seasonality: 15,
    marketIndex: 25,
    discount: -10,
    total: 115,
  },
  {
    product: 'Display Banners',
    performance: 'best',
    listPrice: 70,
    seasonality: 20,
    marketIndex: 18,
    discount: -5,
    total: 103,
  },
  {
    product: 'Video Ads',
    performance: 'best',
    listPrice: 90,
    seasonality: 12,
    marketIndex: -8,
    discount: -12,
    total: 82,
  },
  {
    product: 'Native Ads',
    performance: 'best',
    listPrice: 65,
    seasonality: 8,
    marketIndex: 22,
    discount: -15,
    total: 80,
  },
  {
    product: 'In-store Digital',
    performance: 'best',
    listPrice: 55,
    seasonality: 18,
    marketIndex: 12,
    discount: -8,
    total: 77,
  },
  // Top 5 Worst Performing
  {
    product: 'Shelf Talkers',
    performance: 'worst',
    listPrice: 45,
    seasonality: -5,
    marketIndex: -12,
    discount: -3,
    total: 25,
  },
  {
    product: 'Floor Graphics',
    performance: 'worst',
    listPrice: 38,
    seasonality: -8,
    marketIndex: -15,
    discount: -2,
    total: 13,
  },
  {
    product: 'Window Clings',
    performance: 'worst',
    listPrice: 42,
    seasonality: -10,
    marketIndex: -18,
    discount: -4,
    total: 10,
  },
  {
    product: 'Aisle Headers',
    performance: 'worst',
    listPrice: 35,
    seasonality: -12,
    marketIndex: -20,
    discount: -1,
    total: 2,
  },
  {
    product: 'Cart Ads',
    performance: 'worst',
    listPrice: 30,
    seasonality: -15,
    marketIndex: -25,
    discount: 0,
    total: -10,
  },
];

const marketIndexChartConfig = {
  listPrice: {
    label: 'List Price',
    color: 'hsl(var(--chart-1))',
  },
  seasonality: {
    label: 'Seasonality',
    color: 'hsl(var(--chart-2))',
  },
  marketIndex: {
    label: 'Market Index',
    color: 'hsl(var(--chart-3))',
  },
  discount: {
    label: 'Discount',
    color: 'hsl(var(--chart-4))',
  },
};

// Mock data for Channel Report - Inventory distribution by engine
const channelReportData = [
  {
    engine: 'Sponsored Products',
    managed: 45,
    selfService: 35,
    unsold: 8,
    programmatic: 7,
    marketing: 5,
  },
  {
    engine: 'Display',
    managed: 40,
    selfService: 25,
    unsold: 15,
    programmatic: 12,
    marketing: 8,
  },
  {
    engine: 'Digital In-store',
    managed: 50,
    selfService: 20,
    unsold: 12,
    programmatic: 10,
    marketing: 8,
  },
  {
    engine: 'Offline In-store',
    managed: 60,
    selfService: 15,
    unsold: 18,
    programmatic: 2,
    marketing: 5,
  },
];

const channelReportMetrics = [
  {
    id: 'managed-inventory',
    label: 'Managed',
    value: '48.8%',
    subMetric: 'Average across engines',
    badgeValue: '+2.3%',
    badgeVariant: 'success' as const,
  },
  {
    id: 'self-service',
    label: 'Self Service',
    value: '23.8%',
    subMetric: 'User managed',
    badgeValue: '+1.1%',
    badgeVariant: 'success' as const,
  },
  {
    id: 'unsold-inventory',
    label: 'Unsold',
    value: '13.3%',
    subMetric: 'Available inventory',
    badgeValue: '-1.8%',
    badgeVariant: 'success' as const,
  },
];

const channelChartConfig = {
  managed: {
    label: 'Managed',
    color: 'hsl(var(--chart-1))',
  },
  selfService: {
    label: 'Self Service',
    color: 'hsl(var(--chart-2))',
  },
  unsold: {
    label: 'Unsold',
    color: 'hsl(var(--chart-3))',
  },
  programmatic: {
    label: 'Programmatic',
    color: 'hsl(var(--chart-4))',
  },
  marketing: {
    label: 'Marketing',
    color: 'hsl(var(--chart-5))',
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
    const [selectedMetric, setSelectedMetric] = useState<string | null>('general-fill-rate');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(2024, 0, 1), // January 1, 2024
      to: new Date(2024, 11, 31), // December 31, 2024
    });

    // Filter states
    const [engineFilter, setEngineFilter] = useState<string | undefined>('all');
    const [retailMediaProductFilter, setRetailMediaProductFilter] = useState<string | undefined>('all');
    const [adSpaceFilter, setAdSpaceFilter] = useState<string | undefined>('all');
    const [channelFilter, setChannelFilter] = useState<string | undefined>('all');

    // Separate comparison years state for each chart
    const [fillRateComparisonYears, setFillRateComparisonYears] = useState<string[]>([]);
    const [seasonalityComparisonYears, setSeasonalityComparisonYears] = useState<string[]>([]);

    // Get filtered data based on current filter selections
    const filteredFillRateMetrics = getFilteredFillRateMetrics(engineFilter);

    // Reset selected metric if it's not available in filtered results, fallback to general-fill-rate
    const isSelectedMetricValid = selectedMetric ? filteredFillRateMetrics.some(metric => metric.id === selectedMetric) : false;
    const validSelectedMetric = isSelectedMetricValid ? selectedMetric : 'general-fill-rate';
    const selectedMetricData = filteredFillRateMetrics.find(metric => metric.id === validSelectedMetric) || filteredFillRateMetrics[0];

    // Get chart data based on selection and filters
    const fillRateChartData = getFilteredChartData(validSelectedMetric as string, engineFilter, dateRange, fillRateComparisonYears);
    const seasonalityData = getSeasonalityData(seasonalityComparisonYears);
    const filteredInventoryData = getFilteredInventoryData(channelFilter);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
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
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Engine</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Engines', value: 'all' },
                      { label: 'Display', value: 'display' },
                      { label: 'Sponsored Products', value: 'sponsored-products' },
                      { label: 'Digital In-store', value: 'digital-instore' },
                      { label: 'Offline In-store', value: 'offline-instore' },
                    ]}
                    value={engineFilter}
                    onChange={setEngineFilter}
                    placeholder="Select engine"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Retail Media Product</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Products', value: 'all' },
                      { label: 'Search Ads', value: 'search-ads' },
                      { label: 'Display Banners', value: 'display-banners' },
                      { label: 'Video Ads', value: 'video-ads' },
                      { label: 'Native Ads', value: 'native-ads' },
                      { label: 'In-store Digital', value: 'instore-digital' },
                      { label: 'Shelf Talkers', value: 'shelf-talkers' },
                    ]}
                    value={retailMediaProductFilter}
                    onChange={setRetailMediaProductFilter}
                    placeholder="Select media product"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ad Space</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Spaces', value: 'all' },
                      { label: 'Homepage Hero', value: 'homepage-hero' },
                      { label: 'Search Results Top', value: 'search-results-top' },
                      { label: 'Search Results Side', value: 'search-results-side' },
                      { label: 'Category Page Header', value: 'category-header' },
                      { label: 'Product Detail Page', value: 'pdp' },
                      { label: 'Shopping Cart', value: 'cart' },
                      { label: 'Checkout', value: 'checkout' },
                      { label: 'In-store Entrance', value: 'instore-entrance' },
                      { label: 'Aisle End Caps', value: 'aisle-endcaps' },
                    ]}
                    value={adSpaceFilter}
                    onChange={setAdSpaceFilter}
                    placeholder="Select ad space"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Channel</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Channels', value: 'all' },
                      { label: 'Managed', value: 'managed' },
                      { label: 'Marketing', value: 'marketing' },
                      { label: 'Programmatic', value: 'programmatic' },
                      { label: 'Self Service', value: 'selfService' },
                      { label: 'Unsold', value: 'unsold' },
                    ]}
                    value={channelFilter}
                    onChange={setChannelFilter}
                    placeholder="Select channel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fill Rate Report */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fill Rate Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {filteredFillRateMetrics.map((metric) => (
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
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                  {selectedMetricData ? `${selectedMetricData.label} Fill Rate Trend` : 'Fill Rate Trend'}
                </h4>
                <div className="w-full">
                  <LineChartComponent
                    data={fillRateChartData}
                    config={fillRateChartConfig}
                    xAxisDataKey="name"
                    className="h-[300px] w-full"
                  />
                </div>
              </div>
              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Fill Rate Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>


          {/* Seasonality Report */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Seasonality Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Seasonality Index by Week</h4>
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
              </div>
              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Seasonality Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Channel and Retail Media Product Reports - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Inventory Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Inventory Distribution by Engine</h4>
                  <div className="w-full">
                    <BarChartComponent
                      data={filteredInventoryData}
                      config={channelChartConfig}
                      xAxisDataKey="engine"
                      className="h-[350px] w-full"
                      stacked={true}
                      showLegend={true}
                    />
                  </div>
                </div>
                {/* CTA Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => console.log('Navigate to full Inventory Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Retail Media Product Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Retail Media Product Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top 5 Best Performing Products</h4>
                    <div className="w-full">
                      <BarChartComponent
                        data={marketIndexData.filter(item => item.performance === 'best')}
                        config={marketIndexChartConfig}
                        xAxisDataKey="product"
                        className="h-[200px] w-full"
                        horizontal={true}
                        stacked={true}
                        showLegend={true}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top 5 Worst Performing Products</h4>
                    <div className="w-full">
                      <BarChartComponent
                        data={marketIndexData.filter(item => item.performance === 'worst')}
                        config={marketIndexChartConfig}
                        xAxisDataKey="product"
                        className="h-[200px] w-full"
                        horizontal={true}
                        stacked={true}
                        showLegend={true}
                      />
                    </div>
                  </div>
                </div>
                {/* CTA Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => console.log('Navigate to full Retail Media Product Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Report - Full Width Below */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {revenueReportMetrics.map((metric) => (
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
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Revenue Trend</h4>
                <div className="w-full">
                  <LineChartComponent
                    data={revenueChartData}
                    config={revenueChartConfig}
                    xAxisDataKey="name"
                    className="h-[250px] w-full"
                  />
                </div>
              </div>
              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Revenue Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
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
      </MenuContextProvider>
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
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
      </MenuContextProvider>
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
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
      </MenuContextProvider>
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{
          name: 'John Doe',
          avatar: '/placeholder-avatar.jpg',
        }}
        breadcrumbProps={{ namespace: '' }}
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
      </MenuContextProvider>
    );
  },
};
export const YieldReportView: Story = {
  render: () => {
    // Filter states
    const [engineFilter, setEngineFilter] = useState<string[]>([]);
    const [retailMediaProductFilter, setRetailMediaProductFilter] = useState<string[]>([]);
    const [adSpaceFilter, setAdSpaceFilter] = useState<string[]>([]);
    const [channelFilter, setChannelFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState('fill-rate-report');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });

    // Comprehensive filter options
    const engineOptions = [
      { label: "Display", value: "display" },
      { label: "Sponsored Products", value: "sponsored-products" },
      { label: "Digital In-store", value: "digital-instore" },
      { label: "Offline In-store", value: "offline-instore" },
    ];

    const channelOptions = [
      { label: "Managed", value: "managed" },
      { label: "Self Service", value: "self-service" },
      { label: "Programmatic", value: "programmatic" },
      { label: "Marketing", value: "marketing" },
      { label: "Unsold", value: "unsold" },
    ];

    const retailMediaProductOptions = [
      { label: "Search Ads", value: "search-ads" },
      { label: "Display Banners", value: "display-banners" },
      { label: "Video Ads", value: "video-ads" },
      { label: "Native Ads", value: "native-ads" },
      { label: "In-store Digital", value: "instore-digital" },
      { label: "Shelf Talkers", value: "shelf-talkers" },
      { label: "Floor Graphics", value: "floor-graphics" },
      { label: "Window Clings", value: "window-clings" },
    ];

    const adSpaceOptions = [
      { label: "Homepage Hero", value: "homepage-hero" },
      { label: "Search Results Top", value: "search-results-top" },
      { label: "Search Results Side", value: "search-results-side" },
      { label: "Category Page Header", value: "category-header" },
      { label: "Product Detail Page", value: "pdp" },
      { label: "Shopping Cart", value: "cart" },
      { label: "Checkout", value: "checkout" },
      { label: "Entrance Digital Screen", value: "entrance-screen" },
      { label: "Aisle End Caps", value: "aisle-endcaps" },
      { label: "Shelf Edge", value: "shelf-edge" },
    ];

    // Enhanced data per retail media product
    const fillRateReportData = [
      // Search Ads across different engines and positions
      {
        id: 'FR-001', engine: 'Sponsored Products', retailProduct: 'Search Ads',
        channel: 'Managed', adSpace: 'Search Results Top', fillRate: '99.2%',
        revenue: '€45,678', impressions: '2,450,000', clicks: '7,350', ctr: '0.30%'
      },
      {
        id: 'FR-002', engine: 'Sponsored Products', retailProduct: 'Search Ads',
        channel: 'Self Service', adSpace: 'Search Results Side', fillRate: '97.8%',
        revenue: '€32,145', impressions: '1,800,000', clicks: '5,400', ctr: '0.30%'
      },
      {
        id: 'FR-003', engine: 'Display', retailProduct: 'Search Ads',
        channel: 'Programmatic', adSpace: 'Search Results Top', fillRate: '94.5%',
        revenue: '€18,234', impressions: '1,200,000', clicks: '2,400', ctr: '0.20%'
      },

      // Display Banners across different placements
      {
        id: 'FR-004', engine: 'Display', retailProduct: 'Display Banners',
        channel: 'Managed', adSpace: 'Homepage Hero', fillRate: '96.7%',
        revenue: '€28,904', impressions: '3,500,000', clicks: '8,750', ctr: '0.25%'
      },
      {
        id: 'FR-005', engine: 'Display', retailProduct: 'Display Banners',
        channel: 'Self Service', adSpace: 'Category Page Header', fillRate: '95.2%',
        revenue: '€17,800', impressions: '2,200,000', clicks: '5,500', ctr: '0.25%'
      },
      {
        id: 'FR-006', engine: 'Display', retailProduct: 'Display Banners',
        channel: 'Programmatic', adSpace: 'Product Detail Page', fillRate: '93.8%',
        revenue: '€12,300', impressions: '1,640,000', clicks: '3,280', ctr: '0.20%'
      },

      // Video Ads
      {
        id: 'FR-007', engine: 'Digital In-store', retailProduct: 'Video Ads',
        channel: 'Managed', adSpace: 'Entrance Digital Screen', fillRate: '91.4%',
        revenue: '€18,901', impressions: '1,200,000', clicks: '2,400', ctr: '0.20%'
      },
      {
        id: 'FR-008', engine: 'Digital In-store', retailProduct: 'Video Ads',
        channel: 'Marketing', adSpace: 'Aisle End Caps', fillRate: '89.7%',
        revenue: '€14,560', impressions: '980,000', clicks: '1,960', ctr: '0.20%'
      },

      // Native Ads
      {
        id: 'FR-009', engine: 'Sponsored Products', retailProduct: 'Native Ads',
        channel: 'Self Service', adSpace: 'Product Detail Page', fillRate: '88.9%',
        revenue: '€15,678', impressions: '1,400,000', clicks: '4,200', ctr: '0.30%'
      },
      {
        id: 'FR-010', engine: 'Display', retailProduct: 'Native Ads',
        channel: 'Programmatic', adSpace: 'Shopping Cart', fillRate: '87.3%',
        revenue: '€9,876', impressions: '890,000', clicks: '1,780', ctr: '0.20%'
      },

      // In-store Digital
      {
        id: 'FR-011', engine: 'Digital In-store', retailProduct: 'In-store Digital',
        channel: 'Managed', adSpace: 'Entrance Digital Screen', fillRate: '92.1%',
        revenue: '€22,456', impressions: '1,500,000', clicks: '3,000', ctr: '0.20%'
      },
      {
        id: 'FR-012', engine: 'Digital In-store', retailProduct: 'In-store Digital',
        channel: 'Self Service', adSpace: 'Aisle End Caps', fillRate: '90.3%',
        revenue: '€13,789', impressions: '920,000', clicks: '1,840', ctr: '0.20%'
      },

      // Shelf Talkers
      {
        id: 'FR-013', engine: 'Offline In-store', retailProduct: 'Shelf Talkers',
        channel: 'Managed', adSpace: 'Shelf Edge', fillRate: '86.9%',
        revenue: '€4,689', impressions: '350,000', clicks: '700', ctr: '0.20%'
      },
      {
        id: 'FR-014', engine: 'Offline In-store', retailProduct: 'Shelf Talkers',
        channel: 'Self Service', adSpace: 'Shelf Edge', fillRate: '84.2%',
        revenue: '€3,480', impressions: '280,000', clicks: '560', ctr: '0.20%'
      },

      // Floor Graphics
      {
        id: 'FR-015', engine: 'Offline In-store', retailProduct: 'Floor Graphics',
        channel: 'Marketing', adSpace: 'Aisle End Caps', fillRate: '82.6%',
        revenue: '€2,520', impressions: '220,000', clicks: '440', ctr: '0.20%'
      },

      // Window Clings
      {
        id: 'FR-016', engine: 'Offline In-store', retailProduct: 'Window Clings',
        channel: 'Managed', adSpace: 'Entrance Digital Screen', fillRate: '80.1%',
        revenue: '€1,920', impressions: '180,000', clicks: '360', ctr: '0.20%'
      },
    ];

    return (
      <MenuContextProvider>
        <AppLayout
          routes={defaultRoutes}
          logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
          user={{
            name: 'John Doe',
              avatar: '/placeholder-avatar.jpg',
          }}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: "Yield Reports",
            subtitle: "Comprehensive view of all yield performance reports",
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
            <CardWithTabs
              tabs={[
                {
                  value: 'fill-rate-report',
                  label: 'Fill Rate Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Retail Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                            {
                              name: "Ad Space",
                              options: adSpaceOptions,
                              selectedValues: adSpaceFilter,
                              onChange: setAdSpaceFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search fill rate data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine', hideable: false },
                          { key: 'retailProduct', header: 'Retail Product' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'adSpace', header: 'Ad Space' },
                          { key: 'fillRate', header: 'Fill Rate', render: (row) => (
                            <Badge variant={getPerformanceBadgeVariant(row.fillRate)}>
                              {row.fillRate}
                            </Badge>
                          )},
                          { key: 'revenue', header: 'Revenue' },
                          { key: 'impressions', header: 'Impressions' },
                          { key: 'clicks', header: 'Clicks' },
                          { key: 'ctr', header: 'CTR' },
                        ]}
                        data={fillRateReportData}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                        onRowClick={(row) => console.log('Navigate to details for', row.retailProduct)}
                      />
                    </div>
                  )
                },
                {
                  value: 'seasonality-report',
                  label: 'Seasonality Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Retail Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search seasonality data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine', hideable: false },
                          { key: 'retailProduct', header: 'Retail Product' },
                          { key: 'week', header: 'Week' },
                          { key: 'month', header: 'Month' },
                          { key: 'seasonalityIndex', header: 'Seasonality Index' },
                          { key: 'demandMultiplier', header: 'Demand Multiplier' },
                          { key: 'priceMultiplier', header: 'Price Multiplier' },
                          { key: 'fillRateImpact', header: 'Fill Rate Impact' },
                          { key: 'revenueImpact', header: 'Revenue Impact' },
                        ]}
                        data={[
                          // Search Ads seasonality
                          {
                            id: 'SR-001', engine: 'Sponsored Products', retailProduct: 'Search Ads',
                            week: 'Week 1', month: 'January', seasonalityIndex: 78,
                            demandMultiplier: '0.78x', priceMultiplier: '0.85x', fillRateImpact: '-15%', revenueImpact: '-22%'
                          },
                          {
                            id: 'SR-002', engine: 'Display', retailProduct: 'Search Ads',
                            week: 'Week 14', month: 'April', seasonalityIndex: 118,
                            demandMultiplier: '1.18x', priceMultiplier: '1.25x', fillRateImpact: '+18%', revenueImpact: '+28%'
                          },
                          {
                            id: 'SR-003', engine: 'Sponsored Products', retailProduct: 'Search Ads',
                            week: 'Week 27', month: 'July', seasonalityIndex: 88,
                            demandMultiplier: '0.88x', priceMultiplier: '0.92x', fillRateImpact: '-8%', revenueImpact: '-12%'
                          },
                          {
                            id: 'SR-004', engine: 'Display', retailProduct: 'Search Ads',
                            week: 'Week 52', month: 'December', seasonalityIndex: 210,
                            demandMultiplier: '2.10x', priceMultiplier: '1.85x', fillRateImpact: '+95%', revenueImpact: '+110%'
                          },

                          // Display Banners seasonality
                          {
                            id: 'SR-005', engine: 'Display', retailProduct: 'Display Banners',
                            week: 'Week 8', month: 'February', seasonalityIndex: 82,
                            demandMultiplier: '0.82x', priceMultiplier: '0.88x', fillRateImpact: '-12%', revenueImpact: '-18%'
                          },
                          {
                            id: 'SR-006', engine: 'Display', retailProduct: 'Display Banners',
                            week: 'Week 46', month: 'November', seasonalityIndex: 165,
                            demandMultiplier: '1.65x', priceMultiplier: '1.45x', fillRateImpact: '+45%', revenueImpact: '+65%'
                          },

                          // Video Ads seasonality
                          {
                            id: 'SR-007', engine: 'Digital In-store', retailProduct: 'Video Ads',
                            week: 'Week 21', month: 'May', seasonalityIndex: 95,
                            demandMultiplier: '0.95x', priceMultiplier: '0.98x', fillRateImpact: '-3%', revenueImpact: '-5%'
                          },
                          {
                            id: 'SR-008', engine: 'Digital In-store', retailProduct: 'Video Ads',
                            week: 'Week 48', month: 'December', seasonalityIndex: 195,
                            demandMultiplier: '1.95x', priceMultiplier: '1.75x', fillRateImpact: '+75%', revenueImpact: '+95%'
                          },

                          // Native Ads seasonality
                          {
                            id: 'SR-009', engine: 'Sponsored Products', retailProduct: 'Native Ads',
                            week: 'Week 35', month: 'August', seasonalityIndex: 85,
                            demandMultiplier: '0.85x', priceMultiplier: '0.90x', fillRateImpact: '-10%', revenueImpact: '-15%'
                          },
                          {
                            id: 'SR-010', engine: 'Display', retailProduct: 'Native Ads',
                            week: 'Week 43', month: 'October', seasonalityIndex: 135,
                            demandMultiplier: '1.35x', priceMultiplier: '1.28x', fillRateImpact: '+28%', revenueImpact: '+35%'
                          },

                          // In-store Digital seasonality
                          {
                            id: 'SR-011', engine: 'Digital In-store', retailProduct: 'In-store Digital',
                            week: 'Week 16', month: 'April', seasonalityIndex: 112,
                            demandMultiplier: '1.12x', priceMultiplier: '1.18x', fillRateImpact: '+12%', revenueImpact: '+18%'
                          },
                          {
                            id: 'SR-012', engine: 'Digital In-store', retailProduct: 'In-store Digital',
                            week: 'Week 51', month: 'December', seasonalityIndex: 188,
                            demandMultiplier: '1.88x', priceMultiplier: '1.65x', fillRateImpact: '+65%', revenueImpact: '+88%'
                          },

                          // Shelf Talkers seasonality
                          {
                            id: 'SR-013', engine: 'Offline In-store', retailProduct: 'Shelf Talkers',
                            week: 'Week 6', month: 'February', seasonalityIndex: 72,
                            demandMultiplier: '0.72x', priceMultiplier: '0.82x', fillRateImpact: '-18%', revenueImpact: '-28%'
                          },
                          {
                            id: 'SR-014', engine: 'Offline In-store', retailProduct: 'Shelf Talkers',
                            week: 'Week 49', month: 'December', seasonalityIndex: 145,
                            demandMultiplier: '1.45x', priceMultiplier: '1.35x', fillRateImpact: '+35%', revenueImpact: '+45%'
                          },
                        ]}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                        onRowClick={(row) => console.log('Navigate to seasonality details for', row.retailProduct, row.week)}
                      />
                    </div>
                  )
                },
                {
                  value: 'inventory-report',
                  label: 'Inventory Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Retail Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search inventory data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine', hideable: false },
                          { key: 'retailProduct', header: 'Retail Product' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'inventoryShare', header: 'Inventory Share %' },
                          { key: 'totalPositions', header: 'Total Positions' },
                          { key: 'filledPositions', header: 'Filled Positions' },
                          { key: 'revenue', header: 'Revenue' },
                          { key: 'avgCPM', header: 'Avg CPM' },
                          { key: 'utilizationRate', header: 'Utilization Rate' },
                        ]}
                        data={[
                          // Sponsored Products inventory
                          {
                            id: 'IR-001', engine: 'Sponsored Products', retailProduct: 'Search Ads',
                            channel: 'Managed', inventoryShare: '45%', totalPositions: 1200, filledPositions: 1190,
                            revenue: '€45,678', avgCPM: '€12.45', utilizationRate: '99.2%'
                          },
                          {
                            id: 'IR-002', engine: 'Sponsored Products', retailProduct: 'Search Ads',
                            channel: 'Self Service', inventoryShare: '35%', totalPositions: 980, filledPositions: 958,
                            revenue: '€32,145', avgCPM: '€8.90', utilizationRate: '97.8%'
                          },
                          {
                            id: 'IR-003', engine: 'Sponsored Products', retailProduct: 'Native Ads',
                            channel: 'Self Service', inventoryShare: '12%', totalPositions: 340, filledPositions: 302,
                            revenue: '€15,678', avgCPM: '€15.20', utilizationRate: '88.9%'
                          },

                          // Display inventory
                          {
                            id: 'IR-004', engine: 'Display', retailProduct: 'Display Banners',
                            channel: 'Managed', inventoryShare: '40%', totalPositions: 800, filledPositions: 774,
                            revenue: '€28,904', avgCPM: '€18.30', utilizationRate: '96.7%'
                          },
                          {
                            id: 'IR-005', engine: 'Display', retailProduct: 'Display Banners',
                            channel: 'Self Service', inventoryShare: '25%', totalPositions: 500, filledPositions: 476,
                            revenue: '€17,800', avgCPM: '€14.50', utilizationRate: '95.2%'
                          },
                          {
                            id: 'IR-006', engine: 'Display', retailProduct: 'Display Banners',
                            channel: 'Programmatic', inventoryShare: '15%', totalPositions: 300, filledPositions: 281,
                            revenue: '€12,300', avgCPM: '€10.20', utilizationRate: '93.8%'
                          },
                          {
                            id: 'IR-007', engine: 'Display', retailProduct: 'Native Ads',
                            channel: 'Programmatic', inventoryShare: '12%', totalPositions: 220, filledPositions: 192,
                            revenue: '€9,876', avgCPM: '€11.80', utilizationRate: '87.3%'
                          },

                          // Digital In-store inventory
                          {
                            id: 'IR-008', engine: 'Digital In-store', retailProduct: 'Video Ads',
                            channel: 'Managed', inventoryShare: '50%', totalPositions: 150, filledPositions: 137,
                            revenue: '€18,901', avgCPM: '€25.60', utilizationRate: '91.4%'
                          },
                          {
                            id: 'IR-009', engine: 'Digital In-store', retailProduct: 'Video Ads',
                            channel: 'Marketing', inventoryShare: '20%', totalPositions: 60, filledPositions: 54,
                            revenue: '€14,560', avgCPM: '€22.40', utilizationRate: '89.7%'
                          },
                          {
                            id: 'IR-010', engine: 'Digital In-store', retailProduct: 'In-store Digital',
                            channel: 'Managed', inventoryShare: '25%', totalPositions: 80, filledPositions: 74,
                            revenue: '€22,456', avgCPM: '€28.90', utilizationRate: '92.1%'
                          },
                          {
                            id: 'IR-011', engine: 'Digital In-store', retailProduct: 'In-store Digital',
                            channel: 'Self Service', inventoryShare: '15%', totalPositions: 45, filledPositions: 41,
                            revenue: '€13,789', avgCPM: '€24.10', utilizationRate: '90.3%'
                          },

                          // Offline In-store inventory
                          {
                            id: 'IR-012', engine: 'Offline In-store', retailProduct: 'Shelf Talkers',
                            channel: 'Managed', inventoryShare: '60%', totalPositions: 45, filledPositions: 39,
                            revenue: '€4,689', avgCPM: '€32.40', utilizationRate: '86.9%'
                          },
                          {
                            id: 'IR-013', engine: 'Offline In-store', retailProduct: 'Shelf Talkers',
                            channel: 'Self Service', inventoryShare: '25%', totalPositions: 20, filledPositions: 17,
                            revenue: '€3,480', avgCPM: '€28.60', utilizationRate: '84.2%'
                          },
                          {
                            id: 'IR-014', engine: 'Offline In-store', retailProduct: 'Floor Graphics',
                            channel: 'Marketing', inventoryShare: '8%', totalPositions: 15, filledPositions: 12,
                            revenue: '€2,520', avgCPM: '€35.20', utilizationRate: '82.6%'
                          },
                          {
                            id: 'IR-015', engine: 'Offline In-store', retailProduct: 'Window Clings',
                            channel: 'Managed', inventoryShare: '5%', totalPositions: 10, filledPositions: 8,
                            revenue: '€1,920', avgCPM: '€38.40', utilizationRate: '80.1%'
                          },
                        ]}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                        onRowClick={(row) => console.log('Navigate to inventory details for', row.engine, row.retailProduct)}
                      />
                    </div>
                  )
                },
                {
                  value: 'retail-media-product-report',
                  label: 'Retail Media Product Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Retail Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                            {
                              name: "Ad Space",
                              options: adSpaceOptions,
                              selectedValues: adSpaceFilter,
                              onChange: setAdSpaceFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search retail media products..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'retailProduct', header: 'Retail Product', hideable: false },
                          { key: 'engine', header: 'Engine' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'adSpace', header: 'Ad Space' },
                          { key: 'listPrice', header: 'List Price' },
                          { key: 'seasonality', header: 'Seasonality' },
                          { key: 'marketIndex', header: 'Market Index' },
                          { key: 'discount', header: 'Discount' },
                          { key: 'finalPrice', header: 'Final Price' },
                          { key: 'performance', header: 'Performance' },
                          { key: 'revenue', header: 'Revenue' },
                          { key: 'impressions', header: 'Impressions' },
                          { key: 'ctr', header: 'CTR' },
                        ]}
                        data={[
                          // Search Ads performance across engines
                          {
                            id: 'RMP-001', retailProduct: 'Search Ads', engine: 'Sponsored Products', channel: 'Managed',
                            adSpace: 'Search Results Top', listPrice: '€85', seasonality: '+15%', marketIndex: '+25%',
                            discount: '-10%', finalPrice: '€115', performance: 'Excellent', revenue: '€45,678',
                            impressions: '2,500,000', ctr: '0.30%'
                          },
                          {
                            id: 'RMP-002', retailProduct: 'Search Ads', engine: 'Sponsored Products', channel: 'Self Service',
                            adSpace: 'Search Results Side', listPrice: '€70', seasonality: '+10%', marketIndex: '+18%',
                            discount: '-5%', finalPrice: '€93', performance: 'Good', revenue: '€32,145',
                            impressions: '1,800,000', ctr: '0.30%'
                          },
                          {
                            id: 'RMP-003', retailProduct: 'Search Ads', engine: 'Display', channel: 'Programmatic',
                            adSpace: 'Search Results Top', listPrice: '€60', seasonality: '+5%', marketIndex: '+12%',
                            discount: '0%', finalPrice: '€77', performance: 'Good', revenue: '€18,234',
                            impressions: '1,200,000', ctr: '0.20%'
                          },

                          // Display Banners performance
                          {
                            id: 'RMP-004', retailProduct: 'Display Banners', engine: 'Display', channel: 'Managed',
                            adSpace: 'Homepage Hero', listPrice: '€120', seasonality: '+20%', marketIndex: '+30%',
                            discount: '-15%', finalPrice: '€157', performance: 'Excellent', revenue: '€28,904',
                            impressions: '3,500,000', ctr: '0.25%'
                          },
                          {
                            id: 'RMP-005', retailProduct: 'Display Banners', engine: 'Display', channel: 'Self Service',
                            adSpace: 'Category Page Header', listPrice: '€90', seasonality: '+15%', marketIndex: '+20%',
                            discount: '-8%', finalPrice: '€117', performance: 'Good', revenue: '€17,800',
                            impressions: '2,200,000', ctr: '0.25%'
                          },
                          {
                            id: 'RMP-006', retailProduct: 'Display Banners', engine: 'Display', channel: 'Programmatic',
                            adSpace: 'Product Detail Page', listPrice: '€75', seasonality: '+8%', marketIndex: '+15%',
                            discount: '-3%', finalPrice: '€95', performance: 'Average', revenue: '€12,300',
                            impressions: '1,640,000', ctr: '0.20%'
                          },

                          // Video Ads performance
                          {
                            id: 'RMP-007', retailProduct: 'Video Ads', engine: 'Digital In-store', channel: 'Managed',
                            adSpace: 'Entrance Digital Screen', listPrice: '€200', seasonality: '+25%', marketIndex: '+40%',
                            discount: '-20%', finalPrice: '€292', performance: 'Excellent', revenue: '€18,901',
                            impressions: '1,200,000', ctr: '0.20%'
                          },
                          {
                            id: 'RMP-008', retailProduct: 'Video Ads', engine: 'Digital In-store', channel: 'Marketing',
                            adSpace: 'Aisle End Caps', listPrice: '€150', seasonality: '+18%', marketIndex: '+25%',
                            discount: '-12%', finalPrice: '€199', performance: 'Good', revenue: '€14,560',
                            impressions: '980,000', ctr: '0.20%'
                          },

                          // Native Ads performance
                          {
                            id: 'RMP-009', retailProduct: 'Native Ads', engine: 'Sponsored Products', channel: 'Self Service',
                            adSpace: 'Product Detail Page', listPrice: '€45', seasonality: '+8%', marketIndex: '+12%',
                            discount: '-2%', finalPrice: '€63', performance: 'Average', revenue: '€15,678',
                            impressions: '1,400,000', ctr: '0.30%'
                          },
                          {
                            id: 'RMP-010', retailProduct: 'Native Ads', engine: 'Display', channel: 'Programmatic',
                            adSpace: 'Shopping Cart', listPrice: '€35', seasonality: '+5%', marketIndex: '+8%',
                            discount: '0%', finalPrice: '€48', performance: 'Below Average', revenue: '€9,876',
                            impressions: '890,000', ctr: '0.20%'
                          },

                          // In-store Digital performance
                          {
                            id: 'RMP-011', retailProduct: 'In-store Digital', engine: 'Digital In-store', channel: 'Managed',
                            adSpace: 'Entrance Digital Screen', listPrice: '€180', seasonality: '+22%', marketIndex: '+35%',
                            discount: '-18%', finalPrice: '€251', performance: 'Excellent', revenue: '€22,456',
                            impressions: '1,500,000', ctr: '0.20%'
                          },
                          {
                            id: 'RMP-012', retailProduct: 'In-store Digital', engine: 'Digital In-store', channel: 'Self Service',
                            adSpace: 'Aisle End Caps', listPrice: '€140', seasonality: '+15%', marketIndex: '+22%',
                            discount: '-10%', finalPrice: '€177', performance: 'Good', revenue: '€13,789',
                            impressions: '920,000', ctr: '0.20%'
                          },

                          // Shelf Talkers performance
                          {
                            id: 'RMP-013', retailProduct: 'Shelf Talkers', engine: 'Offline In-store', channel: 'Managed',
                            adSpace: 'Shelf Edge', listPrice: '€25', seasonality: '+5%', marketIndex: '+8%',
                            discount: '-2%', finalPrice: '€31', performance: 'Average', revenue: '€4,689',
                            impressions: '350,000', ctr: '0.20%'
                          },
                          {
                            id: 'RMP-014', retailProduct: 'Shelf Talkers', engine: 'Offline In-store', channel: 'Self Service',
                            adSpace: 'Shelf Edge', listPrice: '€20', seasonality: '+3%', marketIndex: '+5%',
                            discount: '0%', finalPrice: '€28', performance: 'Below Average', revenue: '€3,480',
                            impressions: '280,000', ctr: '0.20%'
                          },

                          // Floor Graphics performance
                          {
                            id: 'RMP-015', retailProduct: 'Floor Graphics', engine: 'Offline In-store', channel: 'Marketing',
                            adSpace: 'Aisle End Caps', listPrice: '€15', seasonality: '+2%', marketIndex: '+3%',
                            discount: '0%', finalPrice: '€20', performance: 'Poor', revenue: '€2,520',
                            impressions: '220,000', ctr: '0.20%'
                          },

                          // Window Clings performance
                          {
                            id: 'RMP-016', retailProduct: 'Window Clings', engine: 'Offline In-store', channel: 'Managed',
                            adSpace: 'Entrance Digital Screen', listPrice: '€12', seasonality: '+1%', marketIndex: '+2%',
                            discount: '0%', finalPrice: '€15', performance: 'Poor', revenue: '€1,920',
                            impressions: '180,000', ctr: '0.20%'
                          },
                        ]}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                        onRowClick={(row) => console.log('Navigate to product details for', row.retailProduct)}
                      />
                    </div>
                  )
                },
                {
                  value: 'revenue-report',
                  label: 'Revenue Report',
                  content: (
                    <div>
                      <div className="mb-4 mt-6">
                        <FilterBar
                          filters={[
                            {
                              name: "Engine",
                              options: engineOptions,
                              selectedValues: engineFilter,
                              onChange: setEngineFilter,
                            },
                            {
                              name: "Channel",
                              options: channelOptions,
                              selectedValues: channelFilter,
                              onChange: setChannelFilter,
                            },
                            {
                              name: "Retail Product",
                              options: retailMediaProductOptions,
                              selectedValues: retailMediaProductFilter,
                              onChange: setRetailMediaProductFilter,
                            },
                          ]}
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          searchPlaceholder="Search revenue data..."
                        />
                      </div>
                      <Table
                        columns={[
                          { key: 'engine', header: 'Engine', hideable: false },
                          { key: 'retailProduct', header: 'Retail Product' },
                          { key: 'channel', header: 'Channel' },
                          { key: 'month', header: 'Month' },
                          { key: 'totalRevenue', header: 'Total Revenue' },
                          { key: 'targetRevenue', header: 'Target Revenue' },
                          { key: 'variance', header: 'Variance' },
                          { key: 'avgCPM', header: 'Avg CPM' },
                          { key: 'fillRate', header: 'Fill Rate' },
                          { key: 'impressions', header: 'Impressions' },
                          { key: 'clicks', header: 'Clicks' },
                          { key: 'ctr', header: 'CTR' },
                        ]}
                        data={[
                          // Sponsored Products revenue
                          {
                            id: 'RR-001', engine: 'Sponsored Products', retailProduct: 'Search Ads', channel: 'Managed',
                            month: 'January', totalRevenue: '€187,000', targetRevenue: '€180,000', variance: '+3.9%',
                            avgCPM: '€12.45', fillRate: '99.2%', impressions: '4,500,000', clicks: '13,500', ctr: '0.30%'
                          },
                          {
                            id: 'RR-002', engine: 'Sponsored Products', retailProduct: 'Search Ads', channel: 'Self Service',
                            month: 'January', totalRevenue: '€132,000', targetRevenue: '€125,000', variance: '+5.6%',
                            avgCPM: '€8.90', fillRate: '97.8%', impressions: '3,200,000', clicks: '9,600', ctr: '0.30%'
                          },
                          {
                            id: 'RR-003', engine: 'Sponsored Products', retailProduct: 'Native Ads', channel: 'Self Service',
                            month: 'February', totalRevenue: '€78,400', targetRevenue: '€80,000', variance: '-2.0%',
                            avgCPM: '€15.20', fillRate: '88.9%', impressions: '2,100,000', clicks: '6,300', ctr: '0.30%'
                          },

                          // Display revenue
                          {
                            id: 'RR-004', engine: 'Display', retailProduct: 'Display Banners', channel: 'Managed',
                            month: 'February', totalRevenue: '€201,000', targetRevenue: '€190,000', variance: '+5.8%',
                            avgCPM: '€18.30', fillRate: '96.7%', impressions: '3,800,000', clicks: '11,400', ctr: '0.30%'
                          },
                          {
                            id: 'RR-005', engine: 'Display', retailProduct: 'Display Banners', channel: 'Self Service',
                            month: 'March', totalRevenue: '€156,000', targetRevenue: '€160,000', variance: '-2.5%',
                            avgCPM: '€14.50', fillRate: '95.2%', impressions: '3,100,000', clicks: '7,750', ctr: '0.25%'
                          },
                          {
                            id: 'RR-006', engine: 'Display', retailProduct: 'Display Banners', channel: 'Programmatic',
                            month: 'March', totalRevenue: '€98,400', targetRevenue: '€95,000', variance: '+3.6%',
                            avgCPM: '€10.20', fillRate: '93.8%', impressions: '2,800,000', clicks: '5,600', ctr: '0.20%'
                          },
                          {
                            id: 'RR-007', engine: 'Display', retailProduct: 'Native Ads', channel: 'Programmatic',
                            month: 'April', totalRevenue: '€67,800', targetRevenue: '€70,000', variance: '-3.1%',
                            avgCPM: '€11.80', fillRate: '87.3%', impressions: '1,890,000', clicks: '3,780', ctr: '0.20%'
                          },

                          // Digital In-store revenue
                          {
                            id: 'RR-008', engine: 'Digital In-store', retailProduct: 'Video Ads', channel: 'Managed',
                            month: 'April', totalRevenue: '€223,000', targetRevenue: '€210,000', variance: '+6.2%',
                            avgCPM: '€25.60', fillRate: '91.4%', impressions: '1,200,000', clicks: '2,400', ctr: '0.20%'
                          },
                          {
                            id: 'RR-009', engine: 'Digital In-store', retailProduct: 'Video Ads', channel: 'Marketing',
                            month: 'May', totalRevenue: '€145,600', targetRevenue: '€140,000', variance: '+4.0%',
                            avgCPM: '€22.40', fillRate: '89.7%', impressions: '980,000', clicks: '1,960', ctr: '0.20%'
                          },
                          {
                            id: 'RR-010', engine: 'Digital In-store', retailProduct: 'In-store Digital', channel: 'Managed',
                            month: 'May', totalRevenue: '€224,560', targetRevenue: '€220,000', variance: '+2.1%',
                            avgCPM: '€28.90', fillRate: '92.1%', impressions: '1,500,000', clicks: '3,000', ctr: '0.20%'
                          },
                          {
                            id: 'RR-011', engine: 'Digital In-store', retailProduct: 'In-store Digital', channel: 'Self Service',
                            month: 'June', totalRevenue: '€137,890', targetRevenue: '€135,000', variance: '+2.1%',
                            avgCPM: '€24.10', fillRate: '90.3%', impressions: '920,000', clicks: '1,840', ctr: '0.20%'
                          },

                          // Offline In-store revenue
                          {
                            id: 'RR-012', engine: 'Offline In-store', retailProduct: 'Shelf Talkers', channel: 'Managed',
                            month: 'June', totalRevenue: '€46,890', targetRevenue: '€45,000', variance: '+4.2%',
                            avgCPM: '€32.40', fillRate: '86.9%', impressions: '350,000', clicks: '700', ctr: '0.20%'
                          },
                          {
                            id: 'RR-013', engine: 'Offline In-store', retailProduct: 'Shelf Talkers', channel: 'Self Service',
                            month: 'July', totalRevenue: '€34,800', targetRevenue: '€36,000', variance: '-3.3%',
                            avgCPM: '€28.60', fillRate: '84.2%', impressions: '280,000', clicks: '560', ctr: '0.20%'
                          },
                          {
                            id: 'RR-014', engine: 'Offline In-store', retailProduct: 'Floor Graphics', channel: 'Marketing',
                            month: 'August', totalRevenue: '€25,200', targetRevenue: '€25,000', variance: '+0.8%',
                            avgCPM: '€35.20', fillRate: '82.6%', impressions: '220,000', clicks: '440', ctr: '0.20%'
                          },
                          {
                            id: 'RR-015', engine: 'Offline In-store', retailProduct: 'Window Clings', channel: 'Managed',
                            month: 'September', totalRevenue: '€19,200', targetRevenue: '€20,000', variance: '-4.0%',
                            avgCPM: '€38.40', fillRate: '80.1%', impressions: '180,000', clicks: '360', ctr: '0.20%'
                          },
                        ]}
                        rowKey={(row) => row.id}
                        rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                        onRowClick={(row) => console.log('Navigate to revenue details for', row.engine, row.retailProduct)}
                      />
                    </div>
                  )
                },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
