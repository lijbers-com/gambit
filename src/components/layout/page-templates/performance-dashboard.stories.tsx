import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { LineChartComponent } from '@/components/ui/line-chart';
import { MapChart } from '@/components/ui/map-chart';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { RadarChartComponent } from '@/components/ui/radar-chart';
import { FunnelChartComponent } from '@/components/ui/funnel-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { FilterBar } from '@/components/ui/filter-bar';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { defaultRoutes } from '../default-routes';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Insights Dashboard',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Insights Dashboard Page Template

The Insights Dashboard provides comprehensive performance analytics with interactive metric cards, dynamic charts, and detailed performance tables. It serves as the main analytics interface for campaign performance monitoring.

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

export const GeneralInsights: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    
    // Top filter states
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('holiday-sale-2024');
    const [lineItemFilter, setLineItemFilter] = useState<string | undefined>(undefined);
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>(undefined);
    const [engineFilter, setEngineFilter] = useState<string | undefined>(undefined);
    
    // IROAS selected metric state
    const [selectedIroasMetric, setSelectedIroasMetric] = useState<string>('revenue');
    
    // Function to get IROAS chart data based on selected metric
    const getIroasChartData = (metric: string) => {
      switch (metric) {
        case 'revenue':
          return [
            { day: 'Mon', incrementalRevenue: 144000, organicRevenue: 198000 },
            { day: 'Tue', incrementalRevenue: 157000, organicRevenue: 201000 },
            { day: 'Wed', incrementalRevenue: 130000, organicRevenue: 195000 },
            { day: 'Thu', incrementalRevenue: 173000, organicRevenue: 205000 },
            { day: 'Fri', incrementalRevenue: 202000, organicRevenue: 210000 },
            { day: 'Sat', incrementalRevenue: 187000, organicRevenue: 208000 },
            { day: 'Sun', incrementalRevenue: 167000, organicRevenue: 203000 },
          ];
        case 'spend':
          return [
            { day: 'Mon', mediaSpend: 42000 },
            { day: 'Tue', mediaSpend: 44000 },
            { day: 'Wed', mediaSpend: 41000 },
            { day: 'Thu', mediaSpend: 46000 },
            { day: 'Fri', mediaSpend: 49000 },
            { day: 'Sat', mediaSpend: 48000 },
            { day: 'Sun', mediaSpend: 45000 },
          ];
        case 'iroas':
          return [
            { day: 'Mon', overallIroas: 3.4, sponsoredIroas: 4.0, displayIroas: 2.8, digitalInstoreIroas: 3.2, offlineInstoreIroas: 2.9 },
            { day: 'Tue', overallIroas: 3.6, sponsoredIroas: 4.2, displayIroas: 3.0, digitalInstoreIroas: 3.4, offlineInstoreIroas: 3.1 },
            { day: 'Wed', overallIroas: 3.2, sponsoredIroas: 3.8, displayIroas: 2.6, digitalInstoreIroas: 3.0, offlineInstoreIroas: 2.7 },
            { day: 'Thu', overallIroas: 3.8, sponsoredIroas: 4.4, displayIroas: 3.2, digitalInstoreIroas: 3.6, offlineInstoreIroas: 3.3 },
            { day: 'Fri', overallIroas: 4.1, sponsoredIroas: 4.8, displayIroas: 3.4, digitalInstoreIroas: 3.9, offlineInstoreIroas: 3.5 },
            { day: 'Sat', overallIroas: 3.9, sponsoredIroas: 4.5, displayIroas: 3.3, digitalInstoreIroas: 3.7, offlineInstoreIroas: 3.4 },
            { day: 'Sun', overallIroas: 3.65, sponsoredIroas: 4.2, displayIroas: 3.1, digitalInstoreIroas: 3.5, offlineInstoreIroas: 3.2 },
          ];
        default:
          return [];
      }
    };

    // Function to get IROAS chart config based on selected metric
    const getIroasChartConfig = (metric: string) => {
      switch (metric) {
        case 'revenue':
          return {
            incrementalRevenue: {
              label: "Incremental Revenue (IROAS)",
              color: "hsl(var(--chart-1))",
            },
            organicRevenue: {
              label: "Organic Revenue",
              color: "hsl(var(--chart-2))",
            },
          };
        case 'spend':
          return {
            mediaSpend: {
              label: "Media Spend (€)",
              color: "hsl(var(--chart-1))",
            },
          };
        case 'iroas':
          return {
            overallIroas: {
              label: "Overall IROAS",
              color: "hsl(var(--chart-1))",
            },
            displayIroas: {
              label: "Display IROAS",
              color: "hsl(var(--chart-2))",
            },
            sponsoredIroas: {
              label: "Sponsored Products IROAS",
              color: "hsl(var(--chart-3))",
            },
            digitalInstoreIroas: {
              label: "Digital In-store IROAS",
              color: "hsl(var(--chart-4))",
            },
            offlineInstoreIroas: {
              label: "Offline In-store IROAS",
              color: "hsl(var(--chart-5))",
            },
          };
        default:
          return {};
      }
    };
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Insights Dashboard',
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              </div>
            </CardContent>
          </Card>

          {/* Full Width IROAS Report */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">IROAS Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Revenue, Spend and IROAS Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    label="Total Revenue"
                    value="€2.4M"
                    subMetric="Last 30 days"
                    badgeValue="+15.3%"
                    badgeVariant="success"
                    isSelected={selectedIroasMetric === 'revenue'}
                    onClick={() => setSelectedIroasMetric('revenue')}
                  />
                  <MetricCard
                    label="Total Spend"
                    value="€650K"
                    subMetric="Media investment"
                    badgeValue="+8.7%"
                    badgeVariant="success"
                    isSelected={selectedIroasMetric === 'spend'}
                    onClick={() => setSelectedIroasMetric('spend')}
                  />
                  <MetricCard
                    label="Overall IROAS"
                    value="3.65x"
                    subMetric="Incremental return"
                    badgeValue="+18%"
                    badgeVariant="success"
                    isSelected={selectedIroasMetric === 'iroas'}
                    onClick={() => setSelectedIroasMetric('iroas')}
                  />
                </div>

                {/* Dynamic Chart based on selected metric */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    {selectedIroasMetric === 'revenue' && 'Incremental vs Organic Revenue'}
                    {selectedIroasMetric === 'spend' && 'Media Spend'}
                    {selectedIroasMetric === 'iroas' && 'IROAS Performance by Channel'}
                  </h4>
                  <LineChartComponent
                    data={getIroasChartData(selectedIroasMetric)}
                    config={getIroasChartConfig(selectedIroasMetric) as any}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="day"
                    yAxisLabel={
                      selectedIroasMetric === 'revenue' ? 'Revenue (€)' :
                      selectedIroasMetric === 'spend' ? 'Spend (€)' :
                      'IROAS'
                    }
                  />
                </div>
                
                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full IROAS Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

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

            {/* E-commerce Funnel Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">E-commerce Funnel Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Total Conversion Rate at Top */}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Total CR%</div>
                  <div className="text-3xl font-bold">0.87%</div>
                  <div className="text-sm text-red-500">↓ 17.3%</div>
                </div>

                {/* Funnel Chart with Side Metrics */}
                <div className="flex items-start">
                  {/* Left Side Metrics */}
                  <div className="w-32 h-96 flex flex-col justify-between py-4 text-left">
                    <div>
                      <div className="text-xs text-muted-foreground">Item Views</div>
                      <div className="text-lg font-bold">8,598</div>
                      <div className="text-xs text-green-500">↑ 19.4%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Add To Cart CR%</div>
                      <div className="text-lg font-bold">4.8%</div>
                      <div className="text-xs text-green-500">↑ 12.9%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Checkout CR%</div>
                      <div className="text-lg font-bold">141.9%</div>
                      <div className="text-xs text-green-500">↑ 200.4%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Purchase CR%</div>
                      <div className="text-lg font-bold">12.7%</div>
                      <div className="text-xs text-red-500">↓ 77.0%</div>
                    </div>
                  </div>

                  {/* Funnel Chart */}
                  <div className="flex-1">
                    <FunnelChartComponent
                      data={[
                        { name: 'Impressions', value: 1147000, percentage: 100 },
                        { name: 'Clicks', value: 9940, percentage: 0.87 },
                        { name: 'Add to Cart', value: 477, percentage: 4.8 },
                        { name: 'Sales', value: 61, percentage: 12.7 },
                      ]}
                      config={{
                        'Impressions': {
                          label: "Impressions",
                          color: "hsl(var(--chart-1))",
                        },
                        'Clicks': {
                          label: "Clicks",
                          color: "hsl(var(--chart-2))",
                        },
                        'Add to Cart': {
                          label: "Add to Cart",
                          color: "hsl(var(--chart-3))",
                        },
                        'Sales': {
                          label: "Sales",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      showTooltip={true}
                      showLabels={false}
                      className="h-96 w-full"
                    />
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full E-commerce Funnel Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Audience Report and Goal Report */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Audience Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Audience Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Audience Pie Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Audience Distribution</h4>
                  <PieChartComponent
                    data={[
                      { name: 'Young Professionals', value: 35 },
                      { name: 'Families', value: 28 },
                      { name: 'Students', value: 22 },
                      { name: 'Seniors', value: 15 },
                    ]}
                    config={{
                      'Young Professionals': {
                        label: "Young Professionals",
                        color: "hsl(var(--chart-1))",
                      },
                      'Families': {
                        label: "Families",
                        color: "hsl(var(--chart-2))",
                      },
                      'Students': {
                        label: "Students",
                        color: "hsl(var(--chart-3))",
                      },
                      'Seniors': {
                        label: "Seniors",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    showLabels={true}
                    showLegend={true}
                    showTooltip={true}
                    className="h-64 w-full"
                    dataKey="value"
                    nameKey="name"
                  />
                </div>

                {/* Customer Lifetime Value by Audience Bar Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Customer Lifetime Value by Audience</h4>
                  <BarChartComponent
                    data={[
                      { 
                        audience: 'Young Prof.', 
                        clv: 1250,
                        avgOrderValue: 85
                      },
                      { 
                        audience: 'Families', 
                        clv: 890,
                        avgOrderValue: 120
                      },
                      { 
                        audience: 'Students', 
                        clv: 340,
                        avgOrderValue: 45
                      },
                      { 
                        audience: 'Seniors', 
                        clv: 780,
                        avgOrderValue: 65
                      },
                    ]}
                    config={{
                      clv: {
                        label: "Customer Lifetime Value (€)",
                        color: "hsl(var(--chart-1))",
                      },
                      avgOrderValue: {
                        label: "Avg Order Value (€)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    showLegend={true}
                    showGrid={true}
                    showTooltip={true}
                    showXAxis={true}
                    showYAxis={true}
                    className="h-64 w-full"
                    xAxisDataKey="audience"
                  />
                </div>
                
                {/* CTA Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full Audience Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Goal Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Goal Report</CardTitle>
              </CardHeader>
              <CardContent className="h-96 flex flex-col">
                {/* Goal Contribution Radar Charts */}
                <div className="flex-1 flex flex-col">
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Engine Performance by Goal</h4>
                  <div className="flex-1 grid grid-cols-2 gap-16">
                    {/* Sponsored Products Radar */}
                    <div>
                      <h5 className="text-xs font-medium mb-2 text-center">Sponsored Products</h5>
                      <RadarChartComponent
                        data={[
                          { subject: 'Awareness', 'Sponsored products': 25 },
                          { subject: 'Consideration', 'Sponsored products': 35 },
                          { subject: 'Intent', 'Sponsored products': 40 },
                          { subject: 'Purchase', 'Sponsored products': 50 },
                          { subject: 'Retention', 'Sponsored products': 30 },
                        ]}
                        config={{
                          'Sponsored products': {
                            label: "Sponsored Products",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>

                    {/* Display Radar */}
                    <div>
                      <h5 className="text-xs font-medium mb-2 text-center">Display</h5>
                      <RadarChartComponent
                        data={[
                          { subject: 'Awareness', 'Display': 45 },
                          { subject: 'Consideration', 'Display': 30 },
                          { subject: 'Intent', 'Display': 20 },
                          { subject: 'Purchase', 'Display': 15 },
                          { subject: 'Retention', 'Display': 12 },
                        ]}
                        config={{
                          'Display': {
                            label: "Display",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>

                    {/* Digital In-store Radar */}
                    <div>
                      <h5 className="text-xs font-medium mb-2 text-center">Digital In-store</h5>
                      <RadarChartComponent
                        data={[
                          { subject: 'Awareness', 'Digital in-store': 20 },
                          { subject: 'Consideration', 'Digital in-store': 25 },
                          { subject: 'Intent', 'Digital in-store': 25 },
                          { subject: 'Purchase', 'Digital in-store': 20 },
                          { subject: 'Retention', 'Digital in-store': 22 },
                        ]}
                        config={{
                          'Digital in-store': {
                            label: "Digital In-store",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>

                    {/* Offline In-store Radar */}
                    <div>
                      <h5 className="text-xs font-medium mb-2 text-center">Offline In-store</h5>
                      <RadarChartComponent
                        data={[
                          { subject: 'Awareness', 'Offline in-store': 10 },
                          { subject: 'Consideration', 'Offline in-store': 10 },
                          { subject: 'Intent', 'Offline in-store': 15 },
                          { subject: 'Purchase', 'Offline in-store': 15 },
                          { subject: 'Retention', 'Offline in-store': 18 },
                        ]}
                        config={{
                          'Offline in-store': {
                            label: "Offline In-store",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        showTooltip={true}
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => alert('Navigate to full Goal Report')}
                  >
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
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
      </MenuContextProvider>
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
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
      </MenuContextProvider>
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
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
      </MenuContextProvider>
    );
  },
};

export const FullReportView: Story = {
  render: () => {
    // Filter states
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>('unilever');
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('holiday-sale-2024');
    const [lineItemFilter, setLineItemFilter] = useState<string | undefined>(undefined);
    const [engineFilter, setEngineFilter] = useState<string | undefined>(undefined);
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
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  { key: 'id', header: 'Line Item ID', hideable: false },
                  { key: 'name', header: 'Campaign Name', hideable: false },
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
                rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                onRowClick={row => {
                  console.log('Navigate to line item details for', row.name);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const ProductReportView: Story = {
  render: () => {
    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [engineFilter, setEngineFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState('product-report');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });

    // Report data for all tabs
    const productReportData = [
      {
        id: 'PRD-001',
        productName: 'Dove Body Wash Original',
        brand: 'Dove',
        category: 'Personal Care',
        advertiser: 'Unilever',
        sku: 'DV-BW-250ML-ORG',
        impressions: 4850000,
        clicks: 14550,
        spend: 8950.75,
        addToCart: 2847,
        purchases: 634,
        revenue: 31750.40,
        units: 1268,
        roas: '3.55x',
        ctr: '0.30%',
        cpc: '€0.62',
        cartRate: '19.6%',
        conversionRate: '4.4%',
        cpa: '€14.12',
        aov: '€50.08',
        status: 'Active',
        stockLevel: 'High',
        margin: '42%'
      },
      {
        id: 'PRD-002',
        productName: 'Hellmanns Real Mayonnaise 400g',
        brand: 'Hellmanns',
        category: 'Food & Beverage',
        advertiser: 'Unilever',
        sku: 'HM-MAYO-400G-REAL',
        impressions: 3800000,
        clicks: 13680,
        spend: 7234.60,
        addToCart: 2634,
        purchases: 789,
        revenue: 23670.60,
        units: 1578,
        roas: '3.27x',
        ctr: '0.36%',
        cpc: '€0.53',
        cartRate: '19.2%',
        conversionRate: '5.8%',
        cpa: '€9.17',
        aov: '€30.00',
        status: 'Active',
        stockLevel: 'Medium',
        margin: '38%'
      },
      {
        id: 'PRD-003',
        productName: 'Ben & Jerrys Cookie Dough 465ml',
        brand: 'Ben & Jerrys',
        category: 'Food & Beverage',
        advertiser: 'Unilever',
        sku: 'BJ-CD-465ML',
        impressions: 3200000,
        clicks: 11520,
        spend: 6890.25,
        addToCart: 2291,
        purchases: 573,
        revenue: 22920.00,
        units: 573,
        roas: '3.33x',
        ctr: '0.36%',
        cpc: '€0.60',
        cartRate: '19.9%',
        conversionRate: '5.0%',
        cpa: '€12.02',
        aov: '€40.00',
        status: 'Active',
        stockLevel: 'Low',
        margin: '45%'
      },
      {
        id: 'PRD-004',
        productName: 'Axe Dark Temptation Body Spray',
        brand: 'Axe',
        category: 'Personal Care',
        advertiser: 'Unilever',
        sku: 'AX-DT-150ML',
        impressions: 2800000,
        clicks: 9520,
        spend: 5456.80,
        addToCart: 1923,
        purchases: 385,
        revenue: 15015.00,
        units: 1155,
        roas: '2.75x',
        ctr: '0.34%',
        cpc: '€0.57',
        cartRate: '20.2%',
        conversionRate: '4.0%',
        cpa: '€14.17',
        aov: '€39.00',
        status: 'Active',
        stockLevel: 'High',
        margin: '40%'
      },
      {
        id: 'PRD-005',
        productName: 'Lipton Yellow Label Tea 100bags',
        brand: 'Lipton',
        category: 'Food & Beverage',
        advertiser: 'Unilever',
        sku: 'LP-YL-100BAG',
        impressions: 2200000,
        clicks: 8580,
        spend: 4567.40,
        addToCart: 1756,
        purchases: 439,
        revenue: 10536.00,
        units: 1317,
        roas: '2.31x',
        ctr: '0.39%',
        cpc: '€0.53',
        cartRate: '20.5%',
        conversionRate: '5.1%',
        cpa: '€10.40',
        aov: '€24.00',
        status: 'Active',
        stockLevel: 'High',
        margin: '35%'
      }
    ];

    const audienceReportData = [
      { id: 'AUD-001', segment: 'Stedelijk', impressions: 1850000, clicks: 7200, spend: 4250.50, revenue: 18750.40, roas: '4.41x', percentage: '35%', age: '25-34', gender: 'Mixed' },
      { id: 'AUD-002', segment: 'Young adult', impressions: 1480000, clicks: 6100, spend: 3600.75, revenue: 15230.60, roas: '4.23x', percentage: '28%', age: '18-24', gender: 'Mixed' },
      { id: 'AUD-003', segment: 'Family with Kids', impressions: 1320000, clicks: 5400, spend: 3200.25, revenue: 12870.80, roas: '4.02x', percentage: '25%', age: '28-45', gender: 'Female' },
      { id: 'AUD-004', segment: 'Bonus shoppers', impressions: 635000, clicks: 2100, spend: 1450.30, revenue: 4890.20, roas: '3.37x', percentage: '12%', age: '45+', gender: 'Mixed' }
    ];

    const iroasReportData = [
      { id: 'ENG-001', engine: 'Overall', incrementalRevenue: 2400000, mediaSpend: 650000, iroas: '3.65x', organicRevenue: 980000, totalRevenue: 3380000 },
      { id: 'ENG-002', engine: 'Display', incrementalRevenue: 680000, mediaSpend: 180000, iroas: '3.78x', organicRevenue: 280000, totalRevenue: 960000 },
      { id: 'ENG-003', engine: 'Sponsored Products', incrementalRevenue: 950000, mediaSpend: 245000, iroas: '3.88x', organicRevenue: 410000, totalRevenue: 1360000 },
      { id: 'ENG-004', engine: 'Digital In-store', incrementalRevenue: 420000, mediaSpend: 125000, iroas: '3.36x', organicRevenue: 160000, totalRevenue: 580000 },
      { id: 'ENG-005', engine: 'Offline In-store', incrementalRevenue: 350000, mediaSpend: 100000, iroas: '3.50x', organicRevenue: 130000, totalRevenue: 480000 }
    ];

    const ecomFunnelData = [
      { id: 'STEP-001', step: 'Impressions', value: 15240000, percentage: '100%', dropOff: '0%', ctr: '0.32%', engine: 'All' },
      { id: 'STEP-002', step: 'Clicks', value: 48850, percentage: '0.32%', dropOff: '99.68%', cartRate: '18.7%', engine: 'All' },
      { id: 'STEP-003', step: 'Add to Cart', value: 9135, percentage: '0.06%', dropOff: '81.3%', convRate: '4.2%', engine: 'All' },
      { id: 'STEP-004', step: 'Purchases', value: 384, percentage: '0.003%', dropOff: '95.8%', aov: '€45.60', engine: 'All' }
    ];

    const goalReportData = [
      { id: 'GOAL-001', goal: 'Awareness', sponsored: 25, display: 45, digitalInstore: 20, offlineInstore: 10, total: 100 },
      { id: 'GOAL-002', goal: 'Consideration', sponsored: 35, display: 30, digitalInstore: 25, offlineInstore: 10, total: 100 },
      { id: 'GOAL-003', goal: 'Intent', sponsored: 40, display: 20, digitalInstore: 25, offlineInstore: 15, total: 100 },
      { id: 'GOAL-004', goal: 'Purchase', sponsored: 50, display: 15, digitalInstore: 20, offlineInstore: 15, total: 100 },
      { id: 'GOAL-005', goal: 'Retention', sponsored: 30, display: 12, digitalInstore: 22, offlineInstore: 18, total: 82 }
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

    const getStockBadgeVariant = (stockLevel: string) => {
      switch (stockLevel.toLowerCase()) {
        case 'high':
          return 'default';
        case 'medium':
          return 'secondary';
        case 'low':
          return 'destructive';
        default:
          return 'secondary';
      }
    };

    return (
      <MenuContextProvider>
        <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Reports',
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
          {/* Multi-Report Dashboard with CardWithTabs */}
          <CardWithTabs
            tabs={[
              {
                value: 'product-report',
                label: 'Product Report',
                content: (
                  <div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: [
                              { label: "Personal Care", value: "personal-care" },
                              { label: "Food & Beverage", value: "food-beverage" },
                              { label: "Home Care", value: "home-care" },
                            ],
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: [
                              { label: "Dove", value: "dove" },
                              { label: "Hellmanns", value: "hellmanns" },
                              { label: "Ben & Jerrys", value: "ben-jerrys" },
                              { label: "Axe", value: "axe" },
                              { label: "Lipton", value: "lipton" },
                            ],
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Engine",
                            options: [
                              { label: "Display", value: "display" },
                              { label: "Sponsored Products", value: "sponsored-products" },
                              { label: "Digital In-store", value: "digital-instore" },
                              { label: "Offline In-store", value: "offline-instore" },
                            ],
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'productName', header: 'Product Name', hideable: false },
                        { key: 'brand', header: 'Brand', hideable: false },
                        { key: 'category', header: 'Category' },
                        { key: 'sku', header: 'SKU' },
                        { key: 'status', header: 'Status', render: row => (
                          <Badge variant={getStatusBadgeVariant(row.status)}>
                            {row.status}
                          </Badge>
                        )},
                        { key: 'stockLevel', header: 'Stock', render: row => (
                          <Badge variant={getStockBadgeVariant(row.stockLevel)}>
                            {row.stockLevel}
                          </Badge>
                        )},
                        { key: 'impressions', header: 'Impressions', render: row => row.impressions.toLocaleString() },
                        { key: 'clicks', header: 'Clicks', render: row => row.clicks.toLocaleString() },
                        { key: 'ctr', header: 'CTR' },
                        { key: 'spend', header: 'Spend', render: row => `€${row.spend.toLocaleString()}` },
                        { key: 'cpc', header: 'CPC' },
                        { key: 'addToCart', header: 'Add to Cart', render: row => row.addToCart.toLocaleString() },
                        { key: 'cartRate', header: 'Cart Rate' },
                        { key: 'purchases', header: 'Purchases', render: row => row.purchases.toLocaleString() },
                        { key: 'conversionRate', header: 'Conv. Rate' },
                        { key: 'cpa', header: 'CPA' },
                        { key: 'units', header: 'Units Sold', render: row => row.units.toLocaleString() },
                        { key: 'revenue', header: 'Revenue', render: row => `€${row.revenue.toLocaleString()}` },
                        { key: 'aov', header: 'AOV' },
                        { key: 'roas', header: 'ROAS' },
                        { key: 'margin', header: 'Margin %' },
                      ]}
                      data={productReportData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                      onRowClick={row => console.log('Navigate to product details for', row.productName)}
                    />
                  </div>
                )
              },
              {
                value: 'audience-report',
                label: 'Audience Report',
                content: (
                  <div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: [
                              { label: "Personal Care", value: "personal-care" },
                              { label: "Food & Beverage", value: "food-beverage" },
                              { label: "Home Care", value: "home-care" },
                            ],
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: [
                              { label: "Dove", value: "dove" },
                              { label: "Hellmanns", value: "hellmanns" },
                              { label: "Ben & Jerrys", value: "ben-jerrys" },
                              { label: "Axe", value: "axe" },
                              { label: "Lipton", value: "lipton" },
                            ],
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Engine",
                            options: [
                              { label: "Display", value: "display" },
                              { label: "Sponsored Products", value: "sponsored-products" },
                              { label: "Digital In-store", value: "digital-instore" },
                              { label: "Offline In-store", value: "offline-instore" },
                            ],
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'segment', header: 'Audience Segment', hideable: false },
                        { key: 'percentage', header: 'Share %', hideable: false },
                        { key: 'age', header: 'Age Range' },
                        { key: 'gender', header: 'Gender' },
                        { key: 'impressions', header: 'Impressions', render: row => row.impressions.toLocaleString() },
                        { key: 'clicks', header: 'Clicks', render: row => row.clicks.toLocaleString() },
                        { key: 'spend', header: 'Spend', render: row => `€${row.spend.toLocaleString()}` },
                        { key: 'revenue', header: 'Revenue', render: row => `€${row.revenue.toLocaleString()}` },
                        { key: 'roas', header: 'ROAS' },
                      ]}
                      data={audienceReportData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                      onRowClick={row => console.log('Navigate to audience details for', row.segment)}
                    />
                  </div>
                )
              },
              {
                value: 'iroas-report',
                label: 'IROAS Report',
                content: (
                  <div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: [
                              { label: "Personal Care", value: "personal-care" },
                              { label: "Food & Beverage", value: "food-beverage" },
                              { label: "Home Care", value: "home-care" },
                            ],
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: [
                              { label: "Dove", value: "dove" },
                              { label: "Hellmanns", value: "hellmanns" },
                              { label: "Ben & Jerrys", value: "ben-jerrys" },
                              { label: "Axe", value: "axe" },
                              { label: "Lipton", value: "lipton" },
                            ],
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Engine",
                            options: [
                              { label: "Display", value: "display" },
                              { label: "Sponsored Products", value: "sponsored-products" },
                              { label: "Digital In-store", value: "digital-instore" },
                              { label: "Offline In-store", value: "offline-instore" },
                            ],
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'engine', header: 'Engine', hideable: false },
                        { key: 'incrementalRevenue', header: 'Incremental Revenue', render: row => `€${row.incrementalRevenue.toLocaleString()}` },
                        { key: 'organicRevenue', header: 'Organic Revenue', render: row => `€${row.organicRevenue.toLocaleString()}` },
                        { key: 'totalRevenue', header: 'Total Revenue', render: row => `€${row.totalRevenue.toLocaleString()}` },
                        { key: 'mediaSpend', header: 'Media Spend', render: row => `€${row.mediaSpend.toLocaleString()}` },
                        { key: 'iroas', header: 'IROAS' },
                      ]}
                      data={iroasReportData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                      onRowClick={row => console.log('Navigate to IROAS details for', row.engine)}
                    />
                  </div>
                )
              },
              {
                value: 'ecom-funnel-report',
                label: 'Ecom Funnel Report',
                content: (
                  <div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: [
                              { label: "Personal Care", value: "personal-care" },
                              { label: "Food & Beverage", value: "food-beverage" },
                              { label: "Home Care", value: "home-care" },
                            ],
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: [
                              { label: "Dove", value: "dove" },
                              { label: "Hellmanns", value: "hellmanns" },
                              { label: "Ben & Jerrys", value: "ben-jerrys" },
                              { label: "Axe", value: "axe" },
                              { label: "Lipton", value: "lipton" },
                            ],
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Engine",
                            options: [
                              { label: "Display", value: "display" },
                              { label: "Sponsored Products", value: "sponsored-products" },
                              { label: "Digital In-store", value: "digital-instore" },
                              { label: "Offline In-store", value: "offline-instore" },
                            ],
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'step', header: 'Funnel Step', hideable: false },
                        { key: 'value', header: 'Volume', render: row => row.value.toLocaleString() },
                        { key: 'percentage', header: 'Percentage' },
                        { key: 'dropOff', header: 'Drop Off' },
                        { key: 'ctr', header: 'CTR' },
                        { key: 'cartRate', header: 'Cart Rate' },
                        { key: 'convRate', header: 'Conv Rate' },
                        { key: 'aov', header: 'AOV' },
                      ]}
                      data={ecomFunnelData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                      onRowClick={row => console.log('Navigate to funnel details for', row.step)}
                    />
                  </div>
                )
              },
              {
                value: 'goal-report',
                label: 'Goal Report',
                content: (
                  <div>
                    {/* FilterBar above table */}
                    <div className="mb-4 mt-6">
                      <FilterBar
                        filters={[
                          {
                            name: "Status",
                            options: [
                              { label: "Active", value: "active" },
                              { label: "Paused", value: "paused" },
                              { label: "Completed", value: "completed" },
                            ],
                            selectedValues: statusFilter,
                            onChange: setStatusFilter,
                          },
                          {
                            name: "Category",
                            options: [
                              { label: "Personal Care", value: "personal-care" },
                              { label: "Food & Beverage", value: "food-beverage" },
                              { label: "Home Care", value: "home-care" },
                            ],
                            selectedValues: categoryFilter,
                            onChange: setCategoryFilter,
                          },
                          {
                            name: "Brand",
                            options: [
                              { label: "Dove", value: "dove" },
                              { label: "Hellmanns", value: "hellmanns" },
                              { label: "Ben & Jerrys", value: "ben-jerrys" },
                              { label: "Axe", value: "axe" },
                              { label: "Lipton", value: "lipton" },
                            ],
                            selectedValues: brandFilter,
                            onChange: setBrandFilter,
                          },
                          {
                            name: "Engine",
                            options: [
                              { label: "Display", value: "display" },
                              { label: "Sponsored Products", value: "sponsored-products" },
                              { label: "Digital In-store", value: "digital-instore" },
                              { label: "Offline In-store", value: "offline-instore" },
                            ],
                            selectedValues: engineFilter,
                            onChange: setEngineFilter,
                          },
                        ]}
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        searchPlaceholder="Search reports..."
                      />
                    </div>
                    <Table
                      columns={[
                        { key: 'goal', header: 'Goal', hideable: false },
                        { key: 'sponsored', header: 'Sponsored Products', render: row => `${row.sponsored}%` },
                        { key: 'display', header: 'Display', render: row => `${row.display}%` },
                        { key: 'digitalInstore', header: 'Digital In-store', render: row => `${row.digitalInstore}%` },
                        { key: 'offlineInstore', header: 'Offline In-store', render: row => `${row.offlineInstore}%` },
                        { key: 'total', header: 'Total Score', render: row => `${row.total}%` },
                      ]}
                      data={goalReportData}
                      rowKey={row => row.id}
                      rowClassName={() => 'cursor-pointer hover:bg-gray-50'}
                      onRowClick={row => console.log('Navigate to goal details for', row.goal)}
                    />
                  </div>
                )
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            action={
              <Button variant="default" size="default">
                Build Report
              </Button>
            }
          />
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};