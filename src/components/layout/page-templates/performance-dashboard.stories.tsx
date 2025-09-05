import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { LineChartComponent } from '@/components/ui/line-chart';
import { MapChart } from '@/components/ui/map-chart';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { FilterBar } from '@/components/ui/filter-bar';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { defaultRoutes } from '../default-routes';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Performance Dashboard',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Performance Dashboard Page Template

The Performance Dashboard provides comprehensive performance analytics with interactive metric cards, dynamic charts, and detailed performance tables. It serves as the main analytics interface for campaign performance monitoring.

## Features

- **Interactive Metric Cards**: Clickable cards that change the chart view
- **Dynamic Chart Visualization**: Bar chart showing achieved vs planned performance
- **Tabbed Data Tables**: Switch between Line Items and Creatives performance data
- **Real-time Metrics**: Live performance indicators with percentage calculations
- **Responsive Design**: Adapts to different screen sizes seamlessly

## Layout Structure

### Top Metrics Cards (3-4 cards)
- **Repetitions**: Total campaign repetitions/impressions
- **Stores**: Number of stores reached
- **Performance**: Overall campaign performance percentage
- **Interactive**: Click cards to change chart focus

### Main Chart Area
- **Bar Chart**: Achieved vs Planned performance over time
- **Dynamic Data**: Chart changes based on selected metric card
- **Monthly View**: Performance data by month with dual-series visualization
- **Legend**: Clear distinction between Achieved and Planned metrics

### Bottom Table Section
- **Tabbed Interface**: Switch between Line Items and Creatives
- **Performance Metrics**: ID, Planned, Achieved, Performance %, Creative count
- **Sortable Data**: All columns support sorting
- **Badge Indicators**: Visual performance indicators

## Interactive Features

1. **Metric Card Selection**: Click any metric card to update the chart
2. **Chart Responsiveness**: Chart data updates based on selected metric
3. **Tab Navigation**: Easy switching between Line Items and Creatives data
4. **Performance Indicators**: Color-coded performance badges

## Data Structure

### Metric Cards
- **Value**: Large numeric display
- **Label**: Descriptive text
- **Color**: Visual indicator (blue for primary metrics)
- **Clickable**: Updates chart on selection

### Chart Data
- **Time Series**: Monthly performance data
- **Dual Series**: Achieved vs Planned comparison
- **Responsive**: Updates based on selected metric

### Table Data
- **ID**: Unique identifier
- **Name**: Line item or creative name
- **Planned**: Target performance value
- **Achieved**: Actual performance value
- **Performance**: Percentage calculation
- **Creative**: Associated creative count

## Usage

This template is ideal for:
- Campaign performance monitoring
- Performance analytics dashboards
- Executive reporting interfaces
- Media partner performance reviews
- Real-time campaign optimization

## Components Used

- AppLayout (navigation, user management, page header)
- Card (metric cards and main container)
- BarChart (performance visualization)
- Tabs (Line Items vs Creatives switching)
- Table (performance data display)
- Badge (performance indicators)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


// Mock data for performance metrics
const performanceMetrics = [
  { 
    id: 'repetitions', 
    label: 'Repetitions', 
    value: '4,058,317', 
    subMetric: 'CTR: 2.14%',
    badgeValue: '+8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'stores', 
    label: 'Stores', 
    value: '343', 
    subMetric: 'Coverage: 89%',
    badgeValue: '0%',
    badgeVariant: 'secondary' as const,
  },
  { 
    id: 'performance', 
    label: 'Performance', 
    value: '105.89%', 
    subMetric: 'CPC: €0.89',
    badgeValue: '-5%',
    badgeVariant: 'destructive' as const,
  },
  { 
    id: 'roas', 
    label: 'ROAS', 
    value: '3.24x', 
    subMetric: 'AOV: €78.50',
    badgeValue: '+12%',
    badgeVariant: 'success' as const,
  },
];

// Mock data for chart - showing daily campaign runtime performance
const getChartData = (selectedMetric: string, engineType?: string, timeRange: string = 'last-month', dateRange?: DateRange) => {
  const days = [];
  const today = new Date();
  
  // If dateRange is provided, use it instead of timeRange
  if (dateRange?.from && dateRange?.to) {
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // If range is 1 day, show hourly data
    if (daysDiff === 1) {
      for (let i = 0; i < 24; i++) {
        const hour = new Date(startDate);
        hour.setHours(i);
        const hourLabel = hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        
        // Generate hourly patterns
        let baseAchieved = 100;
        let basePlanned = 95;
        
        // Peak hours (9 AM - 5 PM)
        if (i >= 9 && i <= 17) {
          baseAchieved *= 1.5;
          basePlanned *= 1.4;
        } else if (i >= 0 && i <= 6) {
          // Low activity at night
          baseAchieved *= 0.3;
          basePlanned *= 0.3;
        }
        
        // Add variance
        baseAchieved *= (0.85 + Math.random() * 0.3);
        basePlanned *= (0.95 + Math.random() * 0.1);
        
        days.push({
          day: hourLabel,
          achieved: Math.round(baseAchieved),
          planned: Math.round(basePlanned),
        });
      }
    } else {
      // Show daily data for date range
      for (let i = 0; i < daysDiff; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Generate realistic daily patterns
        let baseAchieved = 1000;
        let basePlanned = 950;
        
        // Weekend dips
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (isWeekend) {
          baseAchieved *= 0.7;
          basePlanned *= 0.7;
        }
        
        // Add variance
        baseAchieved *= (0.85 + Math.random() * 0.3);
        basePlanned *= (0.95 + Math.random() * 0.1);
        
        // Engine-specific patterns
        if (engineType === 'digital-instore') {
          baseAchieved *= 1.1;
        } else if (engineType === 'offline-instore' && isWeekend) {
          baseAchieved *= 1.4;
          basePlanned *= 1.3;
        } else if (engineType === 'display') {
          baseAchieved *= 1.05;
        }
        
        days.push({
          day: dayLabel,
          achieved: Math.round(baseAchieved),
          planned: Math.round(basePlanned),
        });
      }
    }
  } else {
    // Use timeRange logic (existing code)
    // Determine number of days based on time range
    let numDays = 30;
    let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    switch (timeRange) {
      case 'last-day':
        numDays = 1;
        // For last day, show hourly data
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(today);
          hour.setHours(hour.getHours() - i);
          const hourLabel = hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          
          // Generate hourly patterns
          let baseAchieved = 100;
          let basePlanned = 95;
          
          // Peak hours (9 AM - 5 PM)
          const currentHour = hour.getHours();
          if (currentHour >= 9 && currentHour <= 17) {
            baseAchieved *= 1.5;
            basePlanned *= 1.4;
          } else if (currentHour >= 0 && currentHour <= 6) {
            // Low activity at night
            baseAchieved *= 0.3;
            basePlanned *= 0.3;
          }
          
          // Add variance
          baseAchieved *= (0.85 + Math.random() * 0.3);
          basePlanned *= (0.95 + Math.random() * 0.1);
          
          days.push({
            day: hourLabel,
            achieved: Math.round(baseAchieved),
            planned: Math.round(basePlanned),
          });
        }
        break;
        
      case 'last-week':
        numDays = 7;
        dateFormat = { weekday: 'short', month: 'short', day: 'numeric' };
        break;
        
      case 'last-month':
      default:
        numDays = 30;
        break;
    }
  
    // Generate daily data for week and month views
    if (timeRange !== 'last-day') {
      for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayLabel = date.toLocaleDateString('en-US', dateFormat);
        
        // Generate realistic daily patterns based on metric and engine type
        let baseAchieved = 1000;
        let basePlanned = 950;
        
        // Weekend dips
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        if (isWeekend) {
          baseAchieved *= 0.7;
          basePlanned *= 0.7;
        }
        
        // Add some variance
        baseAchieved *= (0.85 + Math.random() * 0.3);
        basePlanned *= (0.95 + Math.random() * 0.1);
        
        // Engine-specific patterns
        if (engineType === 'digital-instore') {
          // Digital in-store has consistent performance during store hours
          baseAchieved *= 1.1;
        } else if (engineType === 'offline-instore') {
          // Offline in-store peaks on weekends
          if (isWeekend) {
            baseAchieved *= 1.4;
            basePlanned *= 1.3;
          }
        } else if (engineType === 'display') {
          // Display has evening peaks
          baseAchieved *= 1.05;
        }
        
        days.push({
          day: dayLabel,
          achieved: Math.round(baseAchieved),
          planned: Math.round(basePlanned),
        });
      }
    }
  }
  
  // Adjust data based on selected metric
  const multiplier = 
    selectedMetric === 'repetitions' || selectedMetric === 'impressions' ? 1000 : 
    selectedMetric === 'stores' || selectedMetric === 'locations' ? 0.1 : 
    selectedMetric === 'screens' ? 0.5 :
    selectedMetric === 'plays' ? 100 :
    selectedMetric === 'clicks' ? 10 :
    selectedMetric === 'spend' ? 5 :
    selectedMetric === 'materials' ? 2 :
    1;
  
  return days.map(item => ({
    ...item,
    achieved: Math.round(item.achieved * multiplier),
    planned: Math.round(item.planned * multiplier),
  }));
};

// Chart configuration
const getChartConfig = (selectedMetric: string) => ({
  achieved: {
    label: "Achieved",
    color: "hsl(var(--chart-1))",
  },
  planned: {
    label: "Planned", 
    color: "hsl(var(--chart-2))",
  },
});

// Mock data for line items performance
const lineItemsData = [
  { id: '1893', name: 'Campaign total', planned: 27000, achieved: 25000, performance: '103.00%', creatives: 2, roas: '3.24x' },
  { id: '1893', name: 'Auction line item #1', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '3.15x' },
  { id: '1893', name: 'Auction line item #2', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '3.42x' },
  { id: '1893', name: 'Auction line item #3', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '2.98x' },
  { id: '1893', name: 'Auction line item #4', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '3.67x' },
  { id: '1893', name: 'Auction line item #5', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '3.21x' },
  { id: '1893', name: 'Auction line item #6', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '2.87x' },
  { id: '1893', name: 'Auction line item #7', planned: 1300, achieved: 1250, performance: '103.00%', creatives: 2, roas: '3.55x' },
];

// Mock data for creatives performance
const creativesData = [
  { id: 'CR-001', name: 'Summer Banner', planned: 15000, achieved: 14500, performance: '96.67%', lineItems: 3, roas: '3.45x' },
  { id: 'CR-002', name: 'Holiday Video', planned: 12000, achieved: 10500, performance: '87.50%', lineItems: 2, roas: '2.78x' },
  { id: 'CR-003', name: 'Store Display', planned: 8000, achieved: 8200, performance: '102.50%', lineItems: 1, roas: '4.12x' },
  { id: 'CR-004', name: 'Product Banner', planned: 10000, achieved: 9800, performance: '98.00%', lineItems: 2, roas: '2.95x' },
  { id: 'CR-005', name: 'Promo Video', planned: 6000, achieved: 6300, performance: '105.00%', lineItems: 1, roas: '3.67x' },
];

const getPerformanceBadgeVariant = (performance: string) => {
  const value = parseFloat(performance.replace('%', ''));
  if (value >= 100) return 'default';
  if (value >= 90) return 'secondary';
  return 'destructive';
};

export const SponsoredProductsPerformance: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    
    // Top filter states
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('holiday-sale-2024');
    const [lineItemFilter, setLineItemFilter] = useState<string | undefined>(undefined);
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>(undefined);
    
    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'Sponsored Products',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Advertiser</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Advertisers', value: 'all' },
                      { label: 'Unilever', value: 'unilever' },
                      { label: 'Procter & Gamble', value: 'pg' },
                      { label: 'Nestlé', value: 'nestle' },
                      { label: 'Coca-Cola', value: 'coca-cola' },
                    ]}
                    value={advertiserFilter}
                    onChange={setAdvertiserFilter}
                    placeholder="Select advertiser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Holiday Sale 2024', value: 'holiday-sale-2024' },
                      { label: 'Summer Launch 2024', value: 'summer-launch-2024' },
                      { label: 'Spring Collection 2024', value: 'spring-collection-2024' },
                      { label: 'Back to School 2024', value: 'back-to-school-2024' },
                    ]}
                    value={campaignFilter}
                    onChange={setCampaignFilter}
                    placeholder="Select campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Line Item</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Line Items', value: 'all' },
                      { label: 'Auction line item #1', value: 'auction-1' },
                      { label: 'Auction line item #2', value: 'auction-2' },
                      { label: 'Auction line item #3', value: 'auction-3' },
                      { label: 'Auction line item #4', value: 'auction-4' },
                    ]}
                    value={lineItemFilter}
                    onChange={setLineItemFilter}
                    placeholder="Select line item"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Report Cards */}
          {/* Top Row - Product Report and Performance Ecom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Product Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Product Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Top 5 Products Performance Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top 5 Products - Impressions vs Transactions</h4>
                  <BarChartComponent
                    data={[
                      { 
                        product: 'Dove', 
                        impressions: 450000, 
                        transactions: 2847 
                      },
                      { 
                        product: 'Hellmanns', 
                        impressions: 380000, 
                        transactions: 2634 
                      },
                      { 
                        product: 'Ben & Jerrys', 
                        impressions: 320000, 
                        transactions: 2291 
                      },
                      { 
                        product: 'Axe', 
                        impressions: 280000, 
                        transactions: 1923 
                      },
                      { 
                        product: 'Lipton', 
                        impressions: 220000, 
                        transactions: 1756 
                      },
                    ]}
                    config={{
                      impressions: {
                        label: "Impressions",
                        color: "hsl(var(--chart-1))",
                      },
                      transactions: {
                        label: "Transactions",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="product"
                  />
                </div>

                {/* Bottom 5 Products Performance Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Least 5 Performing Products - Impressions vs Transactions</h4>
                  <BarChartComponent
                    data={[
                      { 
                        product: 'Surf', 
                        impressions: 85000, 
                        transactions: 245 
                      },
                      { 
                        product: 'Persil', 
                        impressions: 92000, 
                        transactions: 312 
                      },
                      { 
                        product: 'Magnum', 
                        impressions: 108000, 
                        transactions: 389 
                      },
                      { 
                        product: 'Knorr', 
                        impressions: 125000, 
                        transactions: 456 
                      },
                      { 
                        product: 'Vaseline', 
                        impressions: 140000, 
                        transactions: 523 
                      },
                    ]}
                    config={{
                      impressions: {
                        label: "Impressions",
                        color: "hsl(var(--chart-1))",
                      },
                      transactions: {
                        label: "Transactions",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="product"
                  />
                </div>
                
                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full Product Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Ecom Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Performance Ecom Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Individual Ecommerce Metric Charts - Stacked Vertically */}
                <div className="space-y-6">
                  {/* Clicks Chart */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Clicks</h4>
                    <LineChartComponent
                      data={[
                        { day: 'Mon', value: 1250 },
                        { day: 'Tue', value: 1340 },
                        { day: 'Wed', value: 1180 },
                        { day: 'Thu', value: 1420 },
                        { day: 'Fri', value: 1680 },
                        { day: 'Sat', value: 1590 },
                        { day: 'Sun', value: 1480 },
                      ]}
                      config={{
                        value: {
                          label: "Clicks",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      className="h-32 w-full"
                      xAxisDataKey="day"
                    />
                  </div>

                  {/* Add to Cart Chart */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Add to Cart</h4>
                    <LineChartComponent
                      data={[
                        { day: 'Mon', value: 187 },
                        { day: 'Tue', value: 201 },
                        { day: 'Wed', value: 165 },
                        { day: 'Thu', value: 223 },
                        { day: 'Fri', value: 289 },
                        { day: 'Sat', value: 267 },
                        { day: 'Sun', value: 244 },
                      ]}
                      config={{
                        value: {
                          label: "Add to Cart",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      className="h-32 w-full"
                      xAxisDataKey="day"
                    />
                  </div>


                  {/* Conversion Chart */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Conversion (%)</h4>
                    <LineChartComponent
                      data={[
                        { day: 'Mon', value: 4.2 },
                        { day: 'Tue', value: 4.5 },
                        { day: 'Wed', value: 3.9 },
                        { day: 'Thu', value: 4.7 },
                        { day: 'Fri', value: 5.1 },
                        { day: 'Sat', value: 4.9 },
                        { day: 'Sun', value: 4.6 },
                      ]}
                      config={{
                        value: {
                          label: "Conversion (%)",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      className="h-32 w-full"
                      xAxisDataKey="day"
                    />
                  </div>

                  {/* Transactions Chart */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Transactions</h4>
                    <LineChartComponent
                      data={[
                        { day: 'Mon', value: 52 },
                        { day: 'Tue', value: 60 },
                        { day: 'Wed', value: 46 },
                        { day: 'Thu', value: 67 },
                        { day: 'Fri', value: 86 },
                        { day: 'Sat', value: 78 },
                        { day: 'Sun', value: 68 },
                      ]}
                      config={{
                        value: {
                          label: "Transactions",
                          color: "hsl(var(--chart-5))",
                        },
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={true}
                      className="h-32 w-full"
                      xAxisDataKey="day"
                    />
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full Performance Ecom Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - ROAS Report */}
          <div className="grid grid-cols-1 gap-6">
            {/* ROAS Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">ROAS Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ROAS metrics grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetricCard
                    label="Overall ROAS"
                    value="4.25x"
                    subMetric="All channels"
                    badgeValue="+12%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Overall IROAS"
                    value="3.65x"
                    subMetric="Incremental ROAS"
                    badgeValue="+18%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Offline ROAS"
                    value="2.89x"
                    subMetric="In-store campaigns"
                    badgeValue="+8%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Online ROAS"
                    value="5.12x"
                    subMetric="Digital campaigns"
                    badgeValue="+22%"
                    badgeVariant="success"
                  />
                </div>

                {/* ROAS Trend Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">ROAS Performance Trend</h4>
                  <LineChartComponent
                    data={[
                      { day: 'Mon', overallRoas: 4.1, overallIroas: 3.4, offlineRoas: 2.8, onlineRoas: 4.9 },
                      { day: 'Tue', overallRoas: 4.3, overallIroas: 3.6, offlineRoas: 2.9, onlineRoas: 5.1 },
                      { day: 'Wed', overallRoas: 3.9, overallIroas: 3.2, offlineRoas: 2.7, onlineRoas: 4.8 },
                      { day: 'Thu', overallRoas: 4.5, overallIroas: 3.8, offlineRoas: 3.1, onlineRoas: 5.3 },
                      { day: 'Fri', overallRoas: 4.8, overallIroas: 4.1, offlineRoas: 3.2, onlineRoas: 5.6 },
                      { day: 'Sat', overallRoas: 4.6, overallIroas: 3.9, offlineRoas: 3.0, onlineRoas: 5.4 },
                      { day: 'Sun', overallRoas: 4.25, overallIroas: 3.65, offlineRoas: 2.89, onlineRoas: 5.12 },
                    ]}
                    config={{
                      overallRoas: {
                        label: "Overall ROAS",
                        color: "hsl(var(--chart-1))",
                      },
                      overallIroas: {
                        label: "Overall IROAS",
                        color: "hsl(var(--chart-2))",
                      },
                      offlineRoas: {
                        label: "Offline ROAS",
                        color: "hsl(var(--chart-3))",
                      },
                      onlineRoas: {
                        label: "Online ROAS",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-40 w-full"
                    xAxisDataKey="day"
                  />
                </div>
                
                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full ROAS Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  },
};

export const DisplayPerformance: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('impressions');
    const [activeTab, setActiveTab] = useState('line-items');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    
    // Selection states
    const [selectedLineItems, setSelectedLineItems] = useState<any[]>([]);
    const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
    
    // Display-specific metrics
    const displayMetrics = [
      { 
        id: 'impressions', 
        label: 'Impressions', 
        value: '2,847,193', 
        subMetric: 'CPM: €2.14',
        badgeValue: '+12%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'clicks', 
        label: 'Clicks', 
        value: '8,432', 
        subMetric: 'CTR: 0.30%',
        badgeValue: '+5%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'spend', 
        label: 'Spend', 
        value: '€6,089', 
        subMetric: 'CPC: €0.72',
        badgeValue: '-3%',
        badgeVariant: 'destructive' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS', 
        value: '4.15x', 
        subMetric: 'AOV: €85.20',
        badgeValue: '+18%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const chartData = getChartData(selectedMetric, 'display', timeRange, dateRange);
    const chartConfig = getChartConfig(selectedMetric);
    const selectedMetricData = displayMetrics.find(m => m.id === selectedMetric);
    
    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'Spring Collection 2024 - Display Campaign',
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {displayMetrics.map((metric) => (
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
                  Achieved {selectedMetricData?.label.toLowerCase() || 'performance'}
                </h3>
                <BarChartComponent
                  data={chartData}
                  config={chartConfig}
                  showLegend={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-80 aspect-auto"
                  xAxisDataKey="day"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'line-items', label: 'Line Items' },
                  { value: 'creatives', label: 'Creatives' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <FilterBar
                  filters={[
                    {
                      name: "Status",
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Paused", value: "paused" },
                        { label: "Draft", value: "draft" },
                        { label: "Completed", value: "completed" },
                      ],
                      selectedValues: statusFilter,
                      onChange: setStatusFilter,
                    },
                    {
                      name: "Performance",
                      options: [
                        { label: "Above 100%", value: "above-100" },
                        { label: "90-100%", value: "90-100" },
                        { label: "Below 90%", value: "below-90" },
                      ],
                      selectedValues: performanceFilter,
                      onChange: setPerformanceFilter,
                    },
                  ]}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  searchPlaceholder="Search line items, creatives..."
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="line-items" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'creatives', header: 'Creative', render: row => (
                        <Badge variant="secondary">{row.creatives}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={lineItemsData}
                    rowKey={row => `${row.id}-${row.name}`}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to line item details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedLineItems,
                      onChange: setSelectedLineItems,
                      getKey: row => `${row.id}-${row.name}`,
                    }}
                  />
                </TabsContent>
                <TabsContent value="creatives" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'lineItems', header: 'Line Items', render: row => (
                        <Badge variant="secondary">{row.lineItems}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={creativesData}
                    rowKey={row => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to creative details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedCreatives,
                      onChange: setSelectedCreatives,
                      getKey: row => row.id,
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

export const DigitalInstorePerformance: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('stores');
    const [activeTab, setActiveTab] = useState('line-items');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    
    // Top filter states (similar to Sponsored Products)
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('summer-promotion-2024');
    const [lineItemFilter, setLineItemFilter] = useState<string | undefined>(undefined);
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>(undefined);
    
    // Digital In-store specific filter states (no longer needed for tables but keeping for reference)
    const [storeTypeFilter, setStoreTypeFilter] = useState<string[]>([]);
    const [playerTypeFilter, setPlayerTypeFilter] = useState<string[]>([]);
    
    
    // Map data for Digital In-store
    const mapData = [
      // Amsterdam area
      { name: 'Amsterdam Central', plays: 5847, x: 48, y: 35 },
      { name: 'Amsterdam Zuid', plays: 4239, x: 46, y: 40 },
      { name: 'Amsterdam Noord', plays: 3156, x: 50, y: 32 },
      
      // Rotterdam area
      { name: 'Rotterdam Central', plays: 6241, x: 40, y: 55 },
      { name: 'Rotterdam Zuid', plays: 2847, x: 42, y: 58 },
      
      // Den Haag area
      { name: 'Den Haag HS', plays: 4156, x: 35, y: 50 },
      { name: 'Den Haag Central', plays: 3542, x: 33, y: 52 },
      
      // Utrecht area
      { name: 'Utrecht CS', plays: 5123, x: 52, y: 48 },
      { name: 'Utrecht Noord', plays: 2156, x: 54, y: 45 },
      
      // Eindhoven area
      { name: 'Eindhoven CS', plays: 3789, x: 58, y: 70 },
      { name: 'Eindhoven Airport', plays: 1923, x: 62, y: 72 },
      
      // Groningen area
      { name: 'Groningen CS', plays: 2456, x: 65, y: 15 },
      { name: 'Groningen Noord', plays: 1567, x: 67, y: 12 },
      
      // Breda area
      { name: 'Breda CS', plays: 2789, x: 45, y: 68 },
      
      // Tilburg area
      { name: 'Tilburg CS', plays: 3234, x: 52, y: 65 },
      
      // Arnhem area
      { name: 'Arnhem CS', plays: 2945, x: 68, y: 52 },
      
      // Nijmegen area
      { name: 'Nijmegen CS', plays: 2156, x: 70, y: 58 },
      
      // Zwolle area
      { name: 'Zwolle CS', plays: 1834, x: 62, y: 35 },
      
      // Haarlem area
      { name: 'Haarlem CS', plays: 2567, x: 42, y: 38 },
      
      // Almere area
      { name: 'Almere CS', plays: 3456, x: 58, y: 42 },
    ];
    
    // Digital In-store specific metrics
    const digitalInstoreMetrics = [
      { 
        id: 'stores', 
        label: 'Stores', 
        value: '1,247', 
        subMetric: 'Coverage: 94%',
        badgeValue: '+2%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'plays', 
        label: 'Plays', 
        value: '89,432', 
        subMetric: 'Rate: 71.7/day',
        badgeValue: '+8%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'completion', 
        label: 'Completion', 
        value: '87.3%', 
        subMetric: 'Duration: 15s avg',
        badgeValue: '-1%',
        badgeVariant: 'destructive' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS', 
        value: '2.85x', 
        subMetric: 'AOV: €92.40',
        badgeValue: '+7%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const chartData = getChartData(selectedMetric, 'digital-instore', timeRange, dateRange);
    const chartConfig = getChartConfig(selectedMetric);
    const selectedMetricData = digitalInstoreMetrics.find(m => m.id === selectedMetric);
    
    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'Digital Media In Store',
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Advertiser</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Advertisers', value: 'all' },
                      { label: 'Albert Heijn', value: 'albert-heijn' },
                      { label: 'Jumbo', value: 'jumbo' },
                      { label: 'Etos', value: 'etos' },
                      { label: 'Kruidvat', value: 'kruidvat' },
                    ]}
                    value={advertiserFilter}
                    onChange={setAdvertiserFilter}
                    placeholder="Select advertiser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'Summer Promotion 2024', value: 'summer-promotion-2024' },
                      { label: 'Back to School 2024', value: 'back-to-school-2024' },
                      { label: 'Holiday Campaign 2024', value: 'holiday-campaign-2024' },
                      { label: 'Spring Collection 2024', value: 'spring-collection-2024' },
                    ]}
                    value={campaignFilter}
                    onChange={setCampaignFilter}
                    placeholder="Select campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Line Item</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Line Items', value: 'all' },
                      { label: 'Hypermarket displays', value: 'hypermarket-displays' },
                      { label: 'Checkout screens', value: 'checkout-screens' },
                      { label: 'Interactive kiosks', value: 'interactive-kiosks' },
                      { label: 'Entrance displays', value: 'entrance-displays' },
                    ]}
                    value={lineItemFilter}
                    onChange={setLineItemFilter}
                    placeholder="Select line item"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Plays Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  label="Stores"
                  value="1,247"
                  subMetric="Coverage: 94%"
                  badgeValue="+2%"
                  badgeVariant="success"
                  isSelected={selectedMetric === 'stores'}
                  onClick={() => setSelectedMetric('stores')}
                />
                <MetricCard
                  label="Plays"
                  value="89,432"
                  subMetric="Rate: 71.7/day"
                  badgeValue="+8%"
                  badgeVariant="success"
                  isSelected={selectedMetric === 'plays'}
                  onClick={() => setSelectedMetric('plays')}
                />
                <MetricCard
                  label="Completion"
                  value="87.3%"
                  subMetric="Duration: 15s avg"
                  badgeValue="-1%"
                  badgeVariant="destructive"
                  isSelected={selectedMetric === 'completion'}
                  onClick={() => setSelectedMetric('completion')}
                />
              </div>

              <div>
                <BarChartComponent
                  data={chartData}
                  config={chartConfig}
                  showLegend={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-80 aspect-auto"
                  xAxisDataKey="day"
                />
              </div>
              
              {/* CTA Button */}
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => alert('Navigate to full Plays Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>


          {/* ROAS Report */}
          <div className="grid grid-cols-1 gap-6">
            {/* ROAS Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">ROAS Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ROAS metrics grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetricCard
                    label="Overall ROAS"
                    value="4.25x"
                    subMetric="All channels"
                    badgeValue="+12%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Overall IROAS"
                    value="3.65x"
                    subMetric="Incremental ROAS"
                    badgeValue="+18%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Offline ROAS"
                    value="2.89x"
                    subMetric="In-store campaigns"
                    badgeValue="+8%"
                    badgeVariant="success"
                  />
                  <MetricCard
                    label="Online ROAS"
                    value="5.12x"
                    subMetric="Digital campaigns"
                    badgeValue="+22%"
                    badgeVariant="success"
                  />
                </div>

                {/* ROAS Trend Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">ROAS Performance Trend</h4>
                  <LineChartComponent
                    data={[
                      { day: 'Mon', overallRoas: 4.1, overallIroas: 3.4, offlineRoas: 2.8, onlineRoas: 4.9 },
                      { day: 'Tue', overallRoas: 4.3, overallIroas: 3.6, offlineRoas: 2.9, onlineRoas: 5.1 },
                      { day: 'Wed', overallRoas: 3.9, overallIroas: 3.2, offlineRoas: 2.7, onlineRoas: 4.8 },
                      { day: 'Thu', overallRoas: 4.5, overallIroas: 3.8, offlineRoas: 3.1, onlineRoas: 5.3 },
                      { day: 'Fri', overallRoas: 4.8, overallIroas: 4.1, offlineRoas: 3.2, onlineRoas: 5.6 },
                      { day: 'Sat', overallRoas: 4.6, overallIroas: 3.9, offlineRoas: 3.0, onlineRoas: 5.4 },
                      { day: 'Sun', overallRoas: 4.25, overallIroas: 3.65, offlineRoas: 2.89, onlineRoas: 5.12 },
                    ]}
                    config={{
                      overallRoas: {
                        label: "Overall ROAS",
                        color: "hsl(var(--chart-1))",
                      },
                      overallIroas: {
                        label: "Overall IROAS",
                        color: "hsl(var(--chart-2))",
                      },
                      offlineRoas: {
                        label: "Offline ROAS",
                        color: "hsl(var(--chart-3))",
                      },
                      onlineRoas: {
                        label: "Online ROAS",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-40 w-full"
                    xAxisDataKey="day"
                  />
                </div>
                
                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full ROAS Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Digital In-store Specific Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Netherlands Map Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Demographic Report</CardTitle>
              </CardHeader>
              <CardContent>
                <MapChart data={mapData} />
              </CardContent>
            </Card>

            {/* Hourly Plays Line Chart Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Plays by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChartComponent
                  data={[
                    { hour: '6AM', plays: 0 },
                    { hour: '7AM', plays: 1200 },
                    { hour: '8AM', plays: 8900 },
                    { hour: '9AM', plays: 12400 },
                    { hour: '10AM', plays: 13800 },
                    { hour: '11AM', plays: 14200 },
                    { hour: '12PM', plays: 15800 },
                    { hour: '1PM', plays: 16200 },
                    { hour: '2PM', plays: 15900 },
                    { hour: '3PM', plays: 15200 },
                    { hour: '4PM', plays: 14800 },
                    { hour: '5PM', plays: 13900 },
                    { hour: '6PM', plays: 12100 },
                    { hour: '7PM', plays: 8900 },
                    { hour: '8PM', plays: 4200 },
                    { hour: '9PM', plays: 1800 },
                    { hour: '10PM', plays: 0 },
                  ]}
                  config={{
                    plays: {
                      label: "Plays",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  showLegend={false}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-60 w-full"
                  xAxisDataKey="hour"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  },
};

export const OfflineInstorePerformance: Story = {
  render: () => {
    const [selectedMetric, setSelectedMetric] = useState('locations');
    const [activeTab, setActiveTab] = useState('line-items');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    
    // Selection states
    const [selectedLineItems, setSelectedLineItems] = useState<any[]>([]);
    const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
    
    // Offline In-store specific metrics
    const offlineInstoreMetrics = [
      { 
        id: 'locations', 
        label: 'Locations', 
        value: '843', 
        subMetric: 'Coverage: 97%',
        badgeValue: '+1%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'materials', 
        label: 'Materials', 
        value: '2,195', 
        subMetric: 'Installed: 98%',
        badgeValue: '+3%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'compliance', 
        label: 'Compliance', 
        value: '94.2%', 
        subMetric: 'Verified: 89%',
        badgeValue: '-2%',
        badgeVariant: 'destructive' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS', 
        value: '1.95x', 
        subMetric: 'AOV: €65.80',
        badgeValue: '+4%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const chartData = getChartData(selectedMetric, 'offline-instore', timeRange, dateRange);
    const chartConfig = getChartConfig(selectedMetric);
    const selectedMetricData = offlineInstoreMetrics.find(m => m.id === selectedMetric);
    
    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'Back to School 2024 - Offline In-store',
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {offlineInstoreMetrics.map((metric) => (
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
                  Achieved {selectedMetricData?.label.toLowerCase() || 'performance'}
                </h3>
                <BarChartComponent
                  data={chartData}
                  config={chartConfig}
                  showLegend={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-80 aspect-auto"
                  xAxisDataKey="day"
                />
              </div>
            </CardContent>
          </Card>

          {/* Audience Report Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Audience Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Audience Breakdown Pie Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Audience Distribution</h4>
                  <PieChartComponent
                    data={[
                      { name: 'Stedelijk', value: 35, percentage: '35%' },
                      { name: 'Young adult', value: 28, percentage: '28%' },
                      { name: 'Family with Kids', value: 25, percentage: '25%' },
                      { name: 'Bonus shoppers', value: 12, percentage: '12%' },
                    ]}
                    config={{
                      'Stedelijk': {
                        label: "Stedelijk",
                        color: "hsl(var(--chart-1))",
                      },
                      'Young adult': {
                        label: "Young adult",
                        color: "hsl(var(--chart-2))",
                      },
                      'Family with Kids': {
                        label: "Family with Kids",
                        color: "hsl(var(--chart-3))",
                      },
                      'Bonus shoppers': {
                        label: "Bonus shoppers",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    showLegend={true}
                    showTooltip={true}
                    className="h-64 w-full"
                    dataKey="value"
                    nameKey="name"
                  />
                </div>

                {/* Audience Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Audience Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Stedelijk</p>
                        <p className="text-xs text-muted-foreground">35% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€24.5K revenue</p>
                        <p className="text-xs text-green-600">+12% ROAS</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Young adult</p>
                        <p className="text-xs text-muted-foreground">28% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€19.2K revenue</p>
                        <p className="text-xs text-green-600">+18% ROAS</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Family with Kids</p>
                        <p className="text-xs text-muted-foreground">25% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€17.8K revenue</p>
                        <p className="text-xs text-green-600">+8% ROAS</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Bonus shoppers</p>
                        <p className="text-xs text-muted-foreground">12% of audience</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">€8.1K revenue</p>
                        <p className="text-xs text-red-600">-3% ROAS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => alert('Navigate to full Audience Report')}
                >
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Viewbar
                labels={[]}
                tabs={[
                  { value: 'line-items', label: 'Line Items' },
                  { value: 'creatives', label: 'Creatives' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <FilterBar
                  filters={[
                    {
                      name: "Status",
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Paused", value: "paused" },
                        { label: "Draft", value: "draft" },
                        { label: "Completed", value: "completed" },
                      ],
                      selectedValues: statusFilter,
                      onChange: setStatusFilter,
                    },
                    {
                      name: "Performance",
                      options: [
                        { label: "Above 100%", value: "above-100" },
                        { label: "90-100%", value: "90-100" },
                        { label: "Below 90%", value: "below-90" },
                      ],
                      selectedValues: performanceFilter,
                      onChange: setPerformanceFilter,
                    },
                  ]}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  searchPlaceholder="Search line items, creatives..."
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="line-items" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'creatives', header: 'Creative', render: row => (
                        <Badge variant="secondary">{row.creatives}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={lineItemsData}
                    rowKey={row => `${row.id}-${row.name}`}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to line item details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedLineItems,
                      onChange: setSelectedLineItems,
                      getKey: row => `${row.id}-${row.name}`,
                    }}
                  />
                </TabsContent>
                <TabsContent value="creatives" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'planned', header: 'Planned', render: row => row.planned.toLocaleString() },
                      { key: 'achieved', header: 'Achieved', render: row => row.achieved.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'lineItems', header: 'Line Items', render: row => (
                        <Badge variant="secondary">{row.lineItems}</Badge>
                      )},
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={creativesData}
                    rowKey={row => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to creative details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedCreatives,
                      onChange: setSelectedCreatives,
                      getKey: row => row.id,
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

export const FullReportView: Story = {
  render: () => {
    // Filter states
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>('unilever');
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('holiday-sale-2024');
    const [lineItemFilter, setLineItemFilter] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });

    // Comprehensive report data
    const fullReportData = [
      {
        id: 'LI-001',
        name: 'Sponsored Products - Electronics',
        advertiser: 'Unilever',
        campaign: 'Holiday Sale 2024',
        impressions: 2847193,
        clicks: 8432,
        spend: 6089.50,
        conversions: 234,
        revenue: 18576.80,
        roas: '3.05x',
        ctr: '0.30%',
        cpc: '€0.72',
        cvr: '2.78%',
        cpa: '€26.02',
        status: 'Active',
        startDate: '2024-11-01',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-002',
        name: 'Display Campaign - Home & Garden',
        advertiser: 'Unilever',
        campaign: 'Holiday Sale 2024',
        impressions: 1934567,
        clicks: 5821,
        spend: 4234.75,
        conversions: 156,
        revenue: 12890.40,
        roas: '3.04x',
        ctr: '0.30%',
        cpc: '€0.73',
        cvr: '2.68%',
        cpa: '€27.15',
        status: 'Active',
        startDate: '2024-11-01',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-003',
        name: 'Video Campaign - Beauty Products',
        advertiser: 'Procter & Gamble',
        campaign: 'Spring Collection 2024',
        impressions: 3456789,
        clicks: 12045,
        spend: 8967.25,
        conversions: 378,
        revenue: 29456.70,
        roas: '3.28x',
        ctr: '0.35%',
        cpc: '€0.74',
        cvr: '3.14%',
        cpa: '€23.72',
        status: 'Active',
        startDate: '2024-10-15',
        endDate: '2024-12-15',
      },
      {
        id: 'LI-004',
        name: 'Search Campaign - Food & Beverage',
        advertiser: 'Nestlé',
        campaign: 'Summer Launch 2024',
        impressions: 2156784,
        clicks: 9234,
        spend: 7123.80,
        conversions: 287,
        revenue: 21456.90,
        roas: '3.01x',
        ctr: '0.43%',
        cpc: '€0.77',
        cvr: '3.11%',
        cpa: '€24.82',
        status: 'Paused',
        startDate: '2024-09-01',
        endDate: '2024-11-30',
      },
      {
        id: 'LI-005',
        name: 'Social Media Campaign - Fashion',
        advertiser: 'Coca-Cola',
        campaign: 'Back to School 2024',
        impressions: 4567123,
        clicks: 15678,
        spend: 11234.50,
        conversions: 445,
        revenue: 34567.80,
        roas: '3.08x',
        ctr: '0.34%',
        cpc: '€0.72',
        cvr: '2.84%',
        cpa: '€25.25',
        status: 'Completed',
        startDate: '2024-08-01',
        endDate: '2024-10-31',
      },
      {
        id: 'LI-006',
        name: 'Retargeting Campaign - Tech Accessories',
        advertiser: 'Unilever',
        campaign: 'Holiday Sale 2024',
        impressions: 1789456,
        clicks: 6789,
        spend: 5234.60,
        conversions: 198,
        revenue: 15678.90,
        roas: '2.99x',
        ctr: '0.38%',
        cpc: '€0.77',
        cvr: '2.92%',
        cpa: '€26.44',
        status: 'Active',
        startDate: '2024-11-15',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-007',
        name: 'Shopping Campaign - Sports Equipment',
        advertiser: 'Procter & Gamble',
        campaign: 'Spring Collection 2024',
        impressions: 2987654,
        clicks: 10234,
        spend: 7890.40,
        conversions: 312,
        revenue: 23456.70,
        roas: '2.97x',
        ctr: '0.34%',
        cpc: '€0.77',
        cvr: '3.05%',
        cpa: '€25.29',
        status: 'Active',
        startDate: '2024-10-01',
        endDate: '2024-12-31',
      },
      {
        id: 'LI-008',
        name: 'Brand Awareness - Automotive',
        advertiser: 'Nestlé',
        campaign: 'Summer Launch 2024',
        impressions: 5432109,
        clicks: 18765,
        spend: 13567.80,
        conversions: 523,
        revenue: 41234.50,
        roas: '3.04x',
        ctr: '0.35%',
        cpc: '€0.72',
        cvr: '2.79%',
        cpa: '€25.94',
        status: 'Active',
        startDate: '2024-09-15',
        endDate: '2024-12-15',
      },
    ];

    const getStatusBadgeVariant = (status: string) => {
      switch (status.toLowerCase()) {
        case 'active':
          return 'default';
        case 'paused':
          return 'secondary';
        case 'completed':
          return 'outline';
        default:
          return 'secondary';
      }
    };

    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'Full Performance Report',
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range"
              showPresets={true}
            />
          ),
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Advertiser</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Advertisers', value: 'all' },
                      { label: 'Unilever', value: 'unilever' },
                      { label: 'Procter & Gamble', value: 'pg' },
                      { label: 'Nestlé', value: 'nestle' },
                      { label: 'Coca-Cola', value: 'coca-cola' },
                    ]}
                    value={advertiserFilter}
                    onChange={setAdvertiserFilter}
                    placeholder="Select advertiser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Campaigns', value: 'all' },
                      { label: 'Holiday Sale 2024', value: 'holiday-sale-2024' },
                      { label: 'Summer Launch 2024', value: 'summer-launch-2024' },
                      { label: 'Spring Collection 2024', value: 'spring-collection-2024' },
                      { label: 'Back to School 2024', value: 'back-to-school-2024' },
                    ]}
                    value={campaignFilter}
                    onChange={setCampaignFilter}
                    placeholder="Select campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Line Item</label>
                  <Input
                    dropdown
                    options={[
                      { label: 'All Line Items', value: 'all' },
                      { label: 'Sponsored Products', value: 'sponsored-products' },
                      { label: 'Display Campaign', value: 'display' },
                      { label: 'Video Campaign', value: 'video' },
                      { label: 'Search Campaign', value: 'search' },
                      { label: 'Social Media Campaign', value: 'social' },
                    ]}
                    value={lineItemFilter}
                    onChange={setLineItemFilter}
                    placeholder="Select line item"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Report Table */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table
                columns={[
                  { key: 'id', header: 'Line Item ID' },
                  { key: 'name', header: 'Campaign Name' },
                  { key: 'advertiser', header: 'Advertiser' },
                  { key: 'status', header: 'Status', render: row => (
                    <Badge variant={getStatusBadgeVariant(row.status)}>
                      {row.status}
                    </Badge>
                  )},
                  { key: 'impressions', header: 'Impressions', render: row => row.impressions.toLocaleString() },
                  { key: 'clicks', header: 'Clicks', render: row => row.clicks.toLocaleString() },
                  { key: 'ctr', header: 'CTR' },
                  { key: 'spend', header: 'Spend', render: row => `€${row.spend.toLocaleString()}` },
                  { key: 'cpc', header: 'CPC' },
                  { key: 'conversions', header: 'Conversions', render: row => row.conversions.toLocaleString() },
                  { key: 'cvr', header: 'CVR' },
                  { key: 'cpa', header: 'CPA' },
                  { key: 'revenue', header: 'Revenue', render: row => `€${row.revenue.toLocaleString()}` },
                  { key: 'roas', header: 'ROAS' },
                  { key: 'startDate', header: 'Start Date' },
                  { key: 'endDate', header: 'End Date' },
                ]}
                data={fullReportData}
                rowKey={row => row.id}
                hideActions
                rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                onRowClick={row => {
                  console.log('Navigate to line item details for', row.name);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};