import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Badge } from '@/components/ui/badge';
import { AreaChartComponent } from '@/components/ui/area-chart';
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
import React, { useState, useEffect } from 'react';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { Eye, MousePointer, ShoppingCart, Heart, MoreHorizontal, ChevronDown, ChevronUp, Settings2, Plus, Info } from 'lucide-react';
import { LineChart as RechartsLineChart, Line as RechartsLine, ResponsiveContainer } from 'recharts';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
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
        routes={routes}
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
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">IROAS Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
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
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full IROAS Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Dashboard Report Cards */}
          {/* Top Row - Product Report and Performance Ecom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Product Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Product Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
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
                
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Product Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>

            {/* E-commerce Funnel Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Funnel Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* Column-based Funnel Structure */}
                <div className="space-y-6">
                  {/* Top Row - Column Headers and Values */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Impressions</div>
                      <div className="text-2xl font-bold">54,740</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Clicks</div>
                      <div className="text-2xl font-bold">3,403</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Add to Cart</div>
                      <div className="text-2xl font-bold">934</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">Purchases</div>
                      <div className="text-2xl font-bold">715</div>
                    </div>
                  </div>

                  {/* Funnel Chart */}
                  <div className="h-64">
                    <FunnelChartComponent
                      data={[
                        { name: 'Impressions', value: 54740 },
                        { name: 'Clicks', value: 3403 },
                        { name: 'Add to Cart', value: 934 },
                        { name: 'Purchases', value: 715 },
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
                        'Purchases': {
                          label: "Purchases",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      showTooltip={true}
                      showLabels={true}
                      orientation="horizontal"
                      className="h-full w-full"
                    />
                  </div>

                  {/* Bottom Row - Total Conversion Rate */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Total CR%</div>
                    <div className="text-2xl font-bold">0.87%</div>
                    <div className="text-sm text-green-600">↑ 17.3%</div>
                  </div>
                </div>
                
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full E-commerce Funnel Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Bottom Row - Audience Report and Goal Report */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Audience Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Audience Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
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
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Audience Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
            </Card>

            {/* Goal Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Goal Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-6">
                {/* Goal Contribution Radar Charts */}
                <h4 className="text-sm font-medium mb-4 text-muted-foreground">Engine Performance by Goal</h4>
                <div className="grid grid-cols-2 gap-6 h-full">
                  {/* Sponsored Products Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Sponsored Products</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Sponsored products': 30 },
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
                  </div>

                  {/* Display Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Display</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Display': 12 },
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
                  </div>

                  {/* Digital In-store Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Digital In-store</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Digital in-store': 22 },
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
                  </div>

                  {/* Offline In-store Radar */}
                  <div className="flex flex-col">
                    <h5 className="text-sm font-medium mb-3 text-center">Offline In-store</h5>
                    <div className="flex-1">
                      <RadarChartComponent
                        data={[
                          { subject: 'Retention', 'Offline in-store': 18 },
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
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full Goal Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
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
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('impressions');
    const [activeTab, setActiveTab] = useState('line-items');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
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
        routes={routes}
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
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
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
            <CardContent className="flex flex-col h-full space-y-6 pt-6">
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
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('stores');
    const [activeTab, setActiveTab] = useState('line-items');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
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
        routes={routes}
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
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
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

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Plays Report</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-6">
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
              
            </CardContent>

            {/* CTA Footer */}
            <div className="p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => console.log('Navigate to full Plays Report')}
                className="w-full"
              >
                View Full Report
              </Button>
            </div>
          </Card>


          {/* ROAS Report */}
          <div className="grid grid-cols-1 gap-6">
            {/* ROAS Report Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">ROAS Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
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
                
              </CardContent>

              {/* CTA Footer */}
              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => console.log('Navigate to full ROAS Report')}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </div>
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
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [selectedMetric, setSelectedMetric] = useState('locations');
    const [activeTab, setActiveTab] = useState('line-items');
    const [timeRange, setTimeRange] = useState('last-month');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    
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
        routes={routes}
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
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 flex flex-col space-y-6 pt-6">
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
            </CardContent>

            {/* CTA Footer */}
            <div className="p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => console.log('Navigate to full Audience Report')}
                className="w-full"
              >
                View Full Report
              </Button>
            </div>
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
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    // Filter states
    const [advertiserFilter, setAdvertiserFilter] = useState<string | undefined>('unilever');
    const [campaignFilter, setCampaignFilter] = useState<string | undefined>('holiday-sale-2024');
    const [lineItemFilter, setLineItemFilter] = useState<string | undefined>(undefined);
    const [engineFilter, setEngineFilter] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(),
    });
    const [conversionWindow, setConversionWindow] = useState<number>(14);

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
        routes={routes}
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
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
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
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
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
    const [conversionWindow, setConversionWindow] = useState<number>(14);

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
        routes={routes}
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
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
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

export const FunnelView: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    // Filter states (multi-select for FilterBar)
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [campaignFilter, setCampaignFilter] = useState<string[]>([]);
    const [goalFilter, setGoalFilter] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(2024, 0, 1),
      to: new Date(2024, 5, 30)
    });

    // Proposition states for each funnel card
    const [awarenessPropositions, setAwarenessPropositions] = useState<string[]>(['display', 'digital-instore', 'offline-instore']);
    const [considerationPropositions, setConsiderationPropositions] = useState<string[]>(['display', 'digital-instore', 'offline-instore']);
    const [purchasePropositions, setPurchasePropositions] = useState<string[]>(['display', 'sponsored-products', 'digital-instore', 'offline-instore']);
    const [loyaltyPropositions, setLoyaltyPropositions] = useState<string[]>(['sponsored-products', 'digital-instore']);

    const toggleProposition = (proposition: string, card: 'awareness' | 'consideration' | 'purchase' | 'loyalty') => {
      const setters = {
        awareness: setAwarenessPropositions,
        consideration: setConsiderationPropositions,
        purchase: setPurchasePropositions,
        loyalty: setLoyaltyPropositions,
      };

      setters[card](prev =>
        prev.includes(proposition)
          ? prev.filter(p => p !== proposition)
          : [...prev, proposition]
      );
    };

    // Metric selection states for each funnel card
    const [awarenessMetrics, setAwarenessMetrics] = useState<string[]>(['spaImpressions', 'impressions', 'omiDots', 'doohSpots', 'sov', 'salesUplift']);
    const [considerationMetrics, setConsiderationMetrics] = useState<string[]>(['clicks', 'dots', 'displayClicks', 'viewability']);
    const [purchaseMetrics, setPurchaseMetrics] = useState<string[]>(['roas', 'iroas', 'purchaseBehavior', 'customerSegmentation']);
    const [loyaltyMetrics, setLoyaltyMetrics] = useState<string[]>(['repeatPurchaseRate', 'customerLifetimeValue', 'churnRate']);

    // Customer segmentation data for Purchase card
    const customerSegmentationData = [
      { name: 'First-time', value: 35 },
      { name: 'Returning', value: 42 },
      { name: 'Loyal', value: 23 }
    ];

    // Selected top metrics (can be multiple)
    const [selectedTopMetrics, setSelectedTopMetrics] = useState<string[]>(['sales', 'spend', 'roas']);

    // Custom Report Dialog state
    const [customReportOpen, setCustomReportOpen] = useState(false);
    const [selectedReportMetrics, setSelectedReportMetrics] = useState<string[]>([]);

    // Collapse states for funnel cards
    const [awarenessCollapsed, setAwarenessCollapsed] = useState(true);
    const [volumeDetailsCollapsed, setVolumeDetailsCollapsed] = useState(false);
    const [sovDetailsCollapsed, setSovDetailsCollapsed] = useState(false);
    const [buyerReachDetailsCollapsed, setBuyerReachDetailsCollapsed] = useState(false);
    const [considerationCollapsed, setConsiderationCollapsed] = useState(true);
    const [purchaseCollapsed, setPurchaseCollapsed] = useState(true);
    const [loyaltyCollapsed, setLoyaltyCollapsed] = useState(true);

    // Handle Goal filter changes - expand selected card(s) and collapse others
    useEffect(() => {
      if (goalFilter.length > 0) {
        // Collapse all cards first
        setAwarenessCollapsed(true);
        setConsiderationCollapsed(true);
        setPurchaseCollapsed(true);
        setLoyaltyCollapsed(true);

        // Expand only the selected goal card(s)
        goalFilter.forEach(goal => {
          if (goal === 'awareness') setAwarenessCollapsed(false);
          if (goal === 'consideration') setConsiderationCollapsed(false);
          if (goal === 'purchase') setPurchaseCollapsed(false);
          if (goal === 'loyalty') setLoyaltyCollapsed(false);
        });

        // Swap metrics in Performance Overview based on goal filter
        if (goalFilter.includes('awareness')) {
          // Replace 'sales' with 'reach' for awareness
          setSelectedTopMetrics(prev => {
            const newMetrics = prev.filter(m => m !== 'sales');
            if (!newMetrics.includes('reach')) {
              newMetrics.unshift('reach');
            }
            return newMetrics;
          });
        } else {
          // Restore 'sales' and remove 'reach' for other goals
          setSelectedTopMetrics(prev => {
            const newMetrics = prev.filter(m => m !== 'reach');
            if (!newMetrics.includes('sales')) {
              newMetrics.unshift('sales');
            }
            return newMetrics;
          });
        }
      } else {
        // No filter selected - restore default with 'sales'
        setSelectedTopMetrics(prev => {
          const newMetrics = prev.filter(m => m !== 'reach');
          if (!newMetrics.includes('sales')) {
            newMetrics.unshift('sales');
          }
          return newMetrics;
        });
      }
    }, [goalFilter]);

    // Visibility states for dashboard customization
    const [visibleFunnelCards, setVisibleFunnelCards] = useState({
      awareness: true,
      consideration: true,
      purchase: true,
      loyalty: true,
    });

    const toggleTopMetric = (metric: string) => {
      setSelectedTopMetrics(prev =>
        prev.includes(metric)
          ? prev.filter(m => m !== metric)
          : [...prev, metric]
      );
    };

    const toggleReportMetric = (metric: string) => {
      setSelectedReportMetrics(prev =>
        prev.includes(metric)
          ? prev.filter(m => m !== metric)
          : [...prev, metric]
      );
    };

    const handleBuildReport = () => {
      console.log('Building report with metrics:', selectedReportMetrics);
      alert(`Building custom report with ${selectedReportMetrics.length} metrics:\n${selectedReportMetrics.join(', ')}`);
      setCustomReportOpen(false);
    };

    // Sample data for charts
    const impressionKeys = ['spaImpressions', 'impressions', 'omiDots', 'doohSpots'] as const;
    const selectedImpressionKeys = impressionKeys.filter(k => awarenessMetrics.includes(k));

    const awarenessDataRaw = [
      { month: 'Jan', spaImpressions: 120000, impressions: 65000, sov: 28, salesUplift: 12, omiDots: 62000, doohSpots: 58000 },
      { month: 'Feb', spaImpressions: 175000, impressions: 95000, sov: 38, salesUplift: 15, omiDots: 98000, doohSpots: 87000 },
      { month: 'Mar', spaImpressions: 155000, impressions: 82000, sov: 35, salesUplift: 18, omiDots: 85000, doohSpots: 78000 },
      { month: 'Apr', spaImpressions: 220000, impressions: 118000, sov: 42, salesUplift: 21, omiDots: 120000, doohSpots: 112000 },
      { month: 'May', spaImpressions: 265000, impressions: 140000, sov: 44, salesUplift: 24, omiDots: 142000, doohSpots: 133000 },
      { month: 'Jun', spaImpressions: 300000, impressions: 160000, sov: 47, salesUplift: 27, omiDots: 160000, doohSpots: 155000 }
    ];

    const awarenessData = awarenessDataRaw.map(d => ({
      ...d,
      totalVolume: selectedImpressionKeys.reduce((sum, key) => sum + (d[key] as number), 0)
    }));

    const totalVolumeLabel = `${Math.round(awarenessData[awarenessData.length - 1].totalVolume / 1000)}K`;

    const buyerReachData = [
      { month: 'Jan', newToBrand: 12500, lapsed: 8200, existing: 15800 },
      { month: 'Feb', newToBrand: 16800, lapsed: 9500, existing: 18200 },
      { month: 'Mar', newToBrand: 14900, lapsed: 8900, existing: 17100 },
      { month: 'Apr', newToBrand: 19200, lapsed: 11200, existing: 20500 },
      { month: 'May', newToBrand: 21500, lapsed: 12800, existing: 22100 },
      { month: 'Jun', newToBrand: 24200, lapsed: 14500, existing: 24800 }
    ];

    const buyerReachConfig = {
      newToBrand: { label: "New-to-brand reach", color: "hsl(var(--chart-1))" },
      lapsed: { label: "Lapsed brand reach", color: "hsl(var(--chart-2))" },
      existing: { label: "Existing brand reach", color: "hsl(var(--chart-3))" }
    };

    // Per-channel SOV data
    const sovChannelData = {
      spaImpressions: { label: "SPA SOV", value: 52, pieData: [{ name: "Your Brand", value: 52 }, { name: "Competitors", value: 48 }] },
      impressions: { label: "Display SOV", value: 38, pieData: [{ name: "Your Brand", value: 38 }, { name: "Competitors", value: 62 }] },
      omiDots: { label: "OMI otS SOV", value: 41, pieData: [{ name: "Your Brand", value: 41 }, { name: "Competitors", value: 59 }] },
      doohSpots: { label: "DooH DotS SOV", value: 48, pieData: [{ name: "Your Brand", value: 48 }, { name: "Competitors", value: 52 }] },
    };

    // Per-channel buyer reach data
    const buyerReachChannelData = {
      spaImpressions: [
        { month: 'Jan', newToBrand: 4200, lapsed: 2800, existing: 5300 },
        { month: 'Feb', newToBrand: 5600, lapsed: 3200, existing: 6100 },
        { month: 'Mar', newToBrand: 5000, lapsed: 3000, existing: 5700 },
        { month: 'Apr', newToBrand: 6400, lapsed: 3700, existing: 6800 },
        { month: 'May', newToBrand: 7200, lapsed: 4300, existing: 7400 },
        { month: 'Jun', newToBrand: 8100, lapsed: 4800, existing: 8300 },
      ],
      impressions: [
        { month: 'Jan', newToBrand: 3100, lapsed: 2100, existing: 3900 },
        { month: 'Feb', newToBrand: 4200, lapsed: 2400, existing: 4500 },
        { month: 'Mar', newToBrand: 3700, lapsed: 2200, existing: 4300 },
        { month: 'Apr', newToBrand: 4800, lapsed: 2800, existing: 5100 },
        { month: 'May', newToBrand: 5400, lapsed: 3200, existing: 5500 },
        { month: 'Jun', newToBrand: 6100, lapsed: 3600, existing: 6200 },
      ],
      omiDots: [
        { month: 'Jan', newToBrand: 2800, lapsed: 1800, existing: 3500 },
        { month: 'Feb', newToBrand: 3800, lapsed: 2100, existing: 4100 },
        { month: 'Mar', newToBrand: 3400, lapsed: 1900, existing: 3800 },
        { month: 'Apr', newToBrand: 4300, lapsed: 2500, existing: 4600 },
        { month: 'May', newToBrand: 4800, lapsed: 2800, existing: 5000 },
        { month: 'Jun', newToBrand: 5400, lapsed: 3200, existing: 5600 },
      ],
      doohSpots: [
        { month: 'Jan', newToBrand: 2400, lapsed: 1500, existing: 3100 },
        { month: 'Feb', newToBrand: 3200, lapsed: 1800, existing: 3500 },
        { month: 'Mar', newToBrand: 2800, lapsed: 1800, existing: 3300 },
        { month: 'Apr', newToBrand: 3700, lapsed: 2200, existing: 4000 },
        { month: 'May', newToBrand: 4100, lapsed: 2500, existing: 4200 },
        { month: 'Jun', newToBrand: 4600, lapsed: 2900, existing: 4700 },
      ],
    };

    const channelLabels: Record<string, string> = {
      spaImpressions: 'Sponsored Products',
      impressions: 'Display',
      omiDots: 'Digital Media In-store',
      doohSpots: 'Offline Media In-store',
    };

    const channelColors: Record<string, string> = {
      spaImpressions: 'hsl(var(--chart-2))',
      impressions: 'hsl(var(--chart-3))',
      omiDots: 'hsl(var(--chart-4))',
      doohSpots: 'hsl(var(--chart-5))',
    };

    const channelTooltips: Record<string, string> = {
      spaImpressions: 'Impressions from Sponsored Product Ads shown in search results and product pages',
      impressions: 'Impressions from display advertising such as banners and rich media placements',
      omiDots: 'Digital media impressions delivered on in-store screens and digital signage',
      doohSpots: 'Offline media impressions from digital out-of-home screens in and around stores',
    };

    const channelSovTooltips: Record<string, string> = {
      spaImpressions: 'Number of positions won / all possible positions — SUM(wonAnyPosition) / SUM(numberOfPositions)',
      impressions: 'Overall visibility relative to competitors — (impressions / adsServed) × 100%',
      omiDots: 'Share of digital in-store screen time compared to competitors',
      doohSpots: 'Share of offline in-store media placements compared to competitors',
    };

    const titleTooltips = {
      totalVolume: 'Total number of impressions across all selected channels. The sum of Sponsored Products, Display, Digital Media In-store and Offline Media In-store impressions.',
      totalSov: 'Weighted average share of voice across all selected channels. Indicates your brand visibility relative to competitors.',
      totalBuyerReach: 'Total unique buyers reached across all campaigns, segmented by new-to-brand, lapsed and existing customers.',
    };

    // Consideration data - engagements by channel
    const considerationDataRaw = [
      { month: 'Jan', spaClicks: 5200, displayClicks: 3100, doohClicks: 1800, omiClicks: 1100, spaCtr: 1.8, displayCtr: 1.2, pdpViews: 8200, reachClicks: 4800, newBrandReach: 1200, lapsedReach: 1800, existingReach: 1800 },
      { month: 'Feb', spaClicks: 7400, displayClicks: 4400, doohClicks: 2600, omiClicks: 1400, spaCtr: 2.1, displayCtr: 1.4, pdpViews: 11500, reachClicks: 6800, newBrandReach: 1700, lapsedReach: 2500, existingReach: 2600 },
      { month: 'Mar', spaClicks: 6500, displayClicks: 3800, doohClicks: 2200, omiClicks: 1400, spaCtr: 1.9, displayCtr: 1.3, pdpViews: 10100, reachClicks: 5900, newBrandReach: 1500, lapsedReach: 2200, existingReach: 2200 },
      { month: 'Apr', spaClicks: 8600, displayClicks: 5100, doohClicks: 3000, omiClicks: 1700, spaCtr: 2.4, displayCtr: 1.6, pdpViews: 13400, reachClicks: 7900, newBrandReach: 2000, lapsedReach: 3000, existingReach: 2900 },
      { month: 'May', spaClicks: 9300, displayClicks: 5500, doohClicks: 3200, omiClicks: 1800, spaCtr: 2.6, displayCtr: 1.7, pdpViews: 14500, reachClicks: 8500, newBrandReach: 2100, lapsedReach: 3200, existingReach: 3200 },
      { month: 'Jun', spaClicks: 10100, displayClicks: 5900, doohClicks: 3500, omiClicks: 2000, spaCtr: 2.8, displayCtr: 1.9, pdpViews: 15700, reachClicks: 9200, newBrandReach: 2300, lapsedReach: 3500, existingReach: 3400 }
    ];

    const considerationEngagementKeys = ['spaClicks', 'displayClicks', 'doohClicks', 'omiClicks'] as const;
    const considerationData = considerationDataRaw.map(d => ({
      ...d,
      totalEngagements: considerationEngagementKeys.reduce((sum, key) => sum + d[key], 0),
      totalCtr: parseFloat(((d.spaCtr + d.displayCtr) / 2).toFixed(1)),
    }));

    const totalEngagementsLabel = `${Math.round(considerationData[considerationData.length - 1].totalEngagements / 1000)}K`;

    // Purchase data - revenue and conversions by channel
    const purchaseDataRaw = [
      { month: 'Jan', spaRevenue: 32000, displayRevenue: 18000, dmiRevenue: 12000, omiRevenue: 8000, roas: 2.8, iroas: 2.4, addToCartRate: 3.2, unitsSold: 1200, conversions: 680, conversionRate: 1.8, cpa: 38, adspend: 25800 },
      { month: 'Feb', spaRevenue: 48000, displayRevenue: 27000, dmiRevenue: 18000, omiRevenue: 12000, roas: 3.9, iroas: 3.4, addToCartRate: 3.8, unitsSold: 1800, conversions: 920, conversionRate: 2.2, cpa: 32, adspend: 29400 },
      { month: 'Mar', spaRevenue: 42000, displayRevenue: 24000, dmiRevenue: 15000, omiRevenue: 10000, roas: 3.5, iroas: 3.0, addToCartRate: 3.5, unitsSold: 1550, conversions: 810, conversionRate: 2.0, cpa: 35, adspend: 28400 },
      { month: 'Apr', spaRevenue: 58000, displayRevenue: 33000, dmiRevenue: 22000, omiRevenue: 15000, roas: 4.3, iroas: 3.8, addToCartRate: 4.2, unitsSold: 2200, conversions: 1100, conversionRate: 2.6, cpa: 27, adspend: 29800 },
      { month: 'May', spaRevenue: 63000, displayRevenue: 36000, dmiRevenue: 24000, omiRevenue: 16000, roas: 4.6, iroas: 4.1, addToCartRate: 4.5, unitsSold: 2400, conversions: 1200, conversionRate: 2.8, cpa: 25, adspend: 30200 },
      { month: 'Jun', spaRevenue: 70000, displayRevenue: 40000, dmiRevenue: 27000, omiRevenue: 18000, roas: 5.1, iroas: 4.5, addToCartRate: 4.8, unitsSold: 2700, conversions: 1350, conversionRate: 3.1, cpa: 23, adspend: 31050 }
    ];

    const purchaseData = purchaseDataRaw.map(d => ({
      ...d,
      totalRevenue: d.spaRevenue + d.displayRevenue + d.dmiRevenue + d.omiRevenue,
      totalBuyers: Math.round(d.conversions * 0.85),
      newBuyers: Math.round(d.conversions * 0.3),
      lapsedBuyers: Math.round(d.conversions * 0.25),
      existingBuyers: Math.round(d.conversions * 0.3),
    }));

    const totalRevenueLabel = `€${Math.round(purchaseData[purchaseData.length - 1].totalRevenue / 1000)}K`;

    // Loyalty data
    const loyaltyData = [
      { month: 'Jan', clv: 265, churnRate: 9.2, retentionRate: 68, frequency: 2.1, existingBuyers: 3200, lapsedBuyers: 890 },
      { month: 'Feb', clv: 305, churnRate: 7.5, retentionRate: 72, frequency: 2.4, existingBuyers: 3500, lapsedBuyers: 820 },
      { month: 'Mar', clv: 290, churnRate: 8.1, retentionRate: 70, frequency: 2.3, existingBuyers: 3400, lapsedBuyers: 850 },
      { month: 'Apr', clv: 335, churnRate: 6.3, retentionRate: 76, frequency: 2.7, existingBuyers: 3900, lapsedBuyers: 740 },
      { month: 'May', clv: 350, churnRate: 5.8, retentionRate: 78, frequency: 2.9, existingBuyers: 4100, lapsedBuyers: 690 },
      { month: 'Jun', clv: 375, churnRate: 4.9, retentionRate: 82, frequency: 3.2, existingBuyers: 4400, lapsedBuyers: 620 }
    ];

    // Data for top metric cards
    const topMetricsData = [
      { month: 'Jan', sales: 95, salesUplift: 12, avgRevenuePerCustomer: 42, customerLifetimeValue: 265, spend: 38, costPerAcquisition: 32, costPerClick: 2.4, budgetUtilization: 58, roas: 2.5, roasEuro: 95, iroas: 2.2, conversionRate: 2.1, clickThroughRate: 3.2, reach: 420 },
      { month: 'Feb', sales: 142, salesUplift: 15, avgRevenuePerCustomer: 51, customerLifetimeValue: 295, spend: 41, costPerAcquisition: 27, costPerClick: 2.1, budgetUtilization: 68, roas: 3.5, roasEuro: 142, iroas: 3.1, conversionRate: 2.9, clickThroughRate: 4.1, reach: 580 },
      { month: 'Mar', sales: 128, salesUplift: 18, avgRevenuePerCustomer: 48, customerLifetimeValue: 285, spend: 39, costPerAcquisition: 29, costPerClick: 2.0, budgetUtilization: 72, roas: 3.3, roasEuro: 128, iroas: 2.9, conversionRate: 2.6, clickThroughRate: 3.9, reach: 540 },
      { month: 'Apr', sales: 175, salesUplift: 21, avgRevenuePerCustomer: 56, customerLifetimeValue: 330, spend: 43, costPerAcquisition: 23, costPerClick: 1.8, budgetUtilization: 79, roas: 4.1, roasEuro: 175, iroas: 3.7, conversionRate: 3.5, clickThroughRate: 5.2, reach: 720 },
      { month: 'May', sales: 188, salesUplift: 24, avgRevenuePerCustomer: 58, customerLifetimeValue: 345, spend: 42, costPerAcquisition: 21, costPerClick: 1.7, budgetUtilization: 83, roas: 4.5, roasEuro: 188, iroas: 4.0, conversionRate: 3.8, clickThroughRate: 5.5, reach: 780 },
      { month: 'Jun', sales: 210, salesUplift: 27, avgRevenuePerCustomer: 62, customerLifetimeValue: 365, spend: 45, costPerAcquisition: 19, costPerClick: 1.6, budgetUtilization: 87, roas: 4.7, roasEuro: 210, iroas: 4.2, conversionRate: 4.1, clickThroughRate: 5.9, reach: 850 }
    ];

    // Metric definitions for top cards
    const metricDefinitions: Record<string, { label: string; value: string; badge: string; badgeVariant: "default" | "success" | "warning"; graphColor: string; config: any; dataKey: string }> = {
      sales: { label: 'Total Sales', value: '€200K', badge: '+78%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-3))', config: { sales: { label: "Sales (K€)", color: "hsl(var(--chart-3))" } }, dataKey: 'sales' },
      reach: { label: 'Reach', value: '850K', badge: '+102%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-3))', config: { reach: { label: "Reach (K)", color: "hsl(var(--chart-3))" } }, dataKey: 'reach' },
      salesUplift: { label: 'Sales Uplift', value: '27%', badge: '+4.2%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-3))', config: { salesUplift: { label: "Sales Uplift %", color: "hsl(var(--chart-3))" } }, dataKey: 'salesUplift' },
      avgRevenuePerCustomer: { label: 'Avg Revenue per Customer', value: '€60', badge: '+33%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-3))', config: { avgRevenuePerCustomer: { label: "Avg Revenue (€)", color: "hsl(var(--chart-3))" } }, dataKey: 'avgRevenuePerCustomer' },
      customerLifetimeValue: { label: 'Customer Lifetime Value', value: '€355', badge: '+27%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-3))', config: { customerLifetimeValue: { label: "CLV (€)", color: "hsl(var(--chart-3))" } }, dataKey: 'customerLifetimeValue' },
      spend: { label: 'Total Spend', value: '€42.5K', badge: '85% of budget', badgeVariant: 'default', graphColor: 'hsl(var(--chart-1))', config: { spend: { label: "Spend (K€)", color: "hsl(var(--chart-1))" } }, dataKey: 'spend' },
      costPerAcquisition: { label: 'Cost per Acquisition', value: '€18', badge: '-36%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-1))', config: { costPerAcquisition: { label: "CPA (€)", color: "hsl(var(--chart-1))" } }, dataKey: 'costPerAcquisition' },
      costPerClick: { label: 'Cost per Click', value: '€1.60', badge: '-24%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-1))', config: { costPerClick: { label: "CPC (€)", color: "hsl(var(--chart-1))" } }, dataKey: 'costPerClick' },
      budgetUtilization: { label: 'Budget Utilization', value: '85%', badge: '+31%', badgeVariant: 'warning', graphColor: 'hsl(var(--chart-1))', config: { budgetUtilization: { label: "Budget %", color: "hsl(var(--chart-1))" } }, dataKey: 'budgetUtilization' },
      roas: { label: 'ROAS', value: '4.7x', badge: '+0.8x', badgeVariant: 'success', graphColor: 'hsl(var(--chart-2))', config: { roas: { label: "ROAS", color: "hsl(var(--chart-2))" } }, dataKey: 'roas' },
      iroas: { label: 'iROAS', value: '4.2x', badge: '+1.4x', badgeVariant: 'success', graphColor: 'hsl(var(--chart-2))', config: { iroas: { label: "iROAS", color: "hsl(var(--chart-2))" } }, dataKey: 'iroas' },
      conversionRate: { label: 'Conversion Rate', value: '4.0%', badge: '+60%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-2))', config: { conversionRate: { label: "Conversion %", color: "hsl(var(--chart-2))" } }, dataKey: 'conversionRate' },
      clickThroughRate: { label: 'Click-through Rate', value: '5.8%', badge: '+53%', badgeVariant: 'success', graphColor: 'hsl(var(--chart-2))', config: { clickThroughRate: { label: "CTR %", color: "hsl(var(--chart-2))" } }, dataKey: 'clickThroughRate' },
    };

    const awarenessConfig = {
      impressions: { label: "Impressions", color: "hsl(var(--chart-1))" },
      reach: { label: "Reach", color: "hsl(var(--chart-2))" }
    };

    const sovConfig = {
      sov: { label: "SOV %", color: "hsl(var(--chart-3))" }
    };

    // Share of Voice pie chart data
    const sovPieData = [
      { name: "Your Brand", value: 45 },
      { name: "Competitors", value: 55 }
    ];

    const sovPieConfig = {
      "Your Brand": {
        label: "Your Brand",
        color: "hsl(var(--chart-1))"
      },
      "Competitors": {
        label: "Competitors",
        color: "hsl(0, 0%, 85%)"
      }
    };

    const considerationConfig = {
      clicks: { label: "Clicks", color: "hsl(var(--chart-1))" },
      dots: { label: "DooH Dots", color: "hsl(var(--chart-2))" },
      displayClicks: { label: "Display Clicks", color: "hsl(var(--chart-3))" }
    };

    const viewabilityConfig = {
      viewability: { label: "Viewability %", color: "hsl(var(--chart-4))" }
    };

    const purchaseConfig = {
      roas: { label: "ROAS", color: "hsl(var(--chart-1))" },
      iroas: { label: "iROAS", color: "hsl(var(--chart-2))" }
    };

    const purchaseBehaviorConfig = {
      purchaseBehavior: { label: "Purchase Behavior %", color: "hsl(var(--chart-5))" }
    };

    const customerSegmentationConfig = {
      "First-time": { label: "First-time Customers", color: "hsl(var(--chart-1))" },
      "Returning": { label: "Returning Customers", color: "hsl(var(--chart-2))" },
      "Loyal": { label: "Loyal Customers", color: "hsl(var(--chart-3))" }
    };

    return (
      <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Insights dashboard',
          subtitle: 'Complete customer journey from awareness to purchase',
          headerRight: (
            <div className="flex gap-2 items-center flex-shrink-0">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <Button
                variant="outline"
                size="default"
                className="whitespace-nowrap flex-shrink-0"
                onClick={() => setCustomReportOpen(true)}
              >
                Custom Report
              </Button>
            </div>
          ),
        }}
      >
        <div className="space-y-6">
          {/* FilterBar with Settings */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  Proposition
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuCheckboxItem
                  checked={awarenessMetrics.includes('spaImpressions')}
                  onCheckedChange={(checked) => {
                    setAwarenessMetrics(prev =>
                      checked ? [...prev, 'spaImpressions'] : prev.filter(m => m !== 'spaImpressions')
                    );
                  }}
                >
                  Sponsored Products
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={awarenessMetrics.includes('impressions')}
                  onCheckedChange={(checked) => {
                    setAwarenessMetrics(prev =>
                      checked ? [...prev, 'impressions'] : prev.filter(m => m !== 'impressions')
                    );
                  }}
                >
                  Display
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={awarenessMetrics.includes('omiDots')}
                  onCheckedChange={(checked) => {
                    setAwarenessMetrics(prev =>
                      checked ? [...prev, 'omiDots'] : prev.filter(m => m !== 'omiDots')
                    );
                  }}
                >
                  Digital Media In-store
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={awarenessMetrics.includes('doohSpots')}
                  onCheckedChange={(checked) => {
                    setAwarenessMetrics(prev =>
                      checked ? [...prev, 'doohSpots'] : prev.filter(m => m !== 'doohSpots')
                    );
                  }}
                >
                  Offline Media In-store
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1">
              <FilterBar
                filters={[
                  {
                    name: 'Brand',
                    options: [
                      { label: 'Unilever', value: 'unilever' },
                      { label: "Ben & Jerry's", value: 'ben-jerrys' },
                      { label: 'Dove', value: 'dove' }
                    ],
                    selectedValues: brandFilter,
                    onChange: setBrandFilter
                  },
                  {
                    name: 'Campaign',
                    options: [
                      { label: 'Summer Sale 2024', value: 'summer-2024' },
                      { label: 'Spring Collection', value: 'spring-2024' },
                      { label: 'Holiday Special', value: 'holiday-2024' }
                    ],
                    selectedValues: campaignFilter,
                    onChange: setCampaignFilter
                  },
                  {
                    name: 'Goal',
                    options: [
                      { label: 'Awareness', value: 'awareness' },
                      { label: 'Consideration', value: 'consideration' },
                      { label: 'Purchase', value: 'purchase' },
                      { label: 'Loyalty', value: 'loyalty' }
                    ],
                    selectedValues: goalFilter,
                    onChange: setGoalFilter
                  }
                ]}
                hideSearch={true}
              />
            </div>
          </div>

          {/* Top Metric Cards */}
          {/* grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 */}
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(selectedTopMetrics.length + 1, 5)} gap-4`}>
            {selectedTopMetrics.map((metricKey) => (
              <MetricCard
                key={metricKey}
                label={metricDefinitions[metricKey].label}
                value={metricDefinitions[metricKey].value}
                badgeValue={metricDefinitions[metricKey].badge}
                badgeVariant={metricDefinitions[metricKey].badgeVariant}
                variant="graph"
                graphData={topMetricsData.map(d => ({ value: d[metricDefinitions[metricKey].dataKey as keyof typeof d] as number }))}
                graphColor={metricDefinitions[metricKey].graphColor}
              />
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Select a Metric</DialogTitle>
                  <DialogDescription>
                    Choose a metric to add to your dashboard. Click on any metric card to select it.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[500px] overflow-y-auto p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(metricDefinitions)
                      .filter(([key]) => !selectedTopMetrics.includes(key))
                      .map(([key, metric]) => (
                        <MetricCard
                          key={key}
                          label={metric.label}
                          value={metric.value}
                          badgeValue={metric.badge}
                          badgeVariant={metric.badgeVariant}
                          variant="graph"
                          graphData={topMetricsData.map(d => ({ value: d[metric.dataKey as keyof typeof d] as number }))}
                          graphColor={metric.graphColor}
                          className="cursor-pointer hover:ring-2 hover:ring-primary"
                          onClick={() => {
                            setSelectedTopMetrics(prev => [...prev, key]);
                          }}
                        />
                      ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Awareness Card */}
          {visibleFunnelCards.awareness && (
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setAwarenessCollapsed(!awarenessCollapsed)}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex flex-col gap-1 justify-center">
                  <CardTitle>Awareness</CardTitle>
                  <p className={`text-sm text-muted-foreground transition-all duration-200 ${awarenessCollapsed ? 'opacity-100' : 'opacity-0 h-0'}`}>
                    Total Volume {totalVolumeLabel}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAwarenessCollapsed(!awarenessCollapsed);
                  }}
                >
                  {awarenessCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </div>
              {awarenessCollapsed && (
                <div className="h-12 w-full -mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={awarenessData.map(d => ({ value: d.totalVolume }))}>
                      <RechartsLine type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3, fill: "white", stroke: "hsl(var(--chart-1))", strokeWidth: 2 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardHeader>
            {!awarenessCollapsed && (
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Row 1 - Total Volume with selected impression type cards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Volume {totalVolumeLabel}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>{titleTooltips.totalVolume}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <TooltipProvider>
                        {selectedImpressionKeys.map((key, i) => (
                          <React.Fragment key={key}>
                            {i > 0 && <Plus className="w-3 h-3 text-muted-foreground" />}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span><Badge variant="secondary" className="text-xs cursor-help">{channelLabels[key]} {Math.round((awarenessDataRaw[awarenessDataRaw.length - 1] as any)[key] / 1000)}K</Badge></span>
                              </TooltipTrigger>
                              <TooltipContent>{channelTooltips[key]}</TooltipContent>
                            </Tooltip>
                          </React.Fragment>
                        ))}
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={awarenessData}
                      config={{
                        totalVolume: { label: "Total Volume", color: "hsl(var(--chart-1))" }
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      showDots={true}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      tooltipKeys={Object.fromEntries(
                        selectedImpressionKeys.map(k => [k, {
                          spaImpressions: { label: "SPA Impressions", color: "hsl(var(--chart-2))" },
                          impressions: { label: "Display Impressions", color: "hsl(var(--chart-3))" },
                          omiDots: { label: "OMI otS", color: "hsl(var(--chart-4))" },
                          doohSpots: { label: "DooH DotS", color: "hsl(var(--chart-5))" }
                        }[k]])
                      )}
                    />
                    <div className="flex justify-center mt-2 mb-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setVolumeDetailsCollapsed(!volumeDetailsCollapsed)}
                      >
                        {volumeDetailsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                    {!volumeDetailsCollapsed && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${selectedImpressionKeys.length} gap-4`}>
                      {awarenessMetrics.includes('spaImpressions') && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">SPA Impressions {Math.round(awarenessDataRaw[awarenessDataRaw.length - 1].spaImpressions / 1000)}K</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <LineChartComponent
                              data={awarenessData}
                              config={{ spaImpressions: { label: "SPA Impressions", color: "hsl(var(--chart-2))" } }}
                              showLegend={false}
                              showGrid={true}
                              showTooltip={true}
                              showXAxis={true}
                              showYAxis={false}
                              className="h-[120px] w-full"
                              xAxisDataKey="month"
                            />
                            <div className="flex justify-end mt-2">
                              <Badge variant="success" className="text-xs">+54%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {awarenessMetrics.includes('impressions') && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Display Impressions {Math.round(awarenessDataRaw[awarenessDataRaw.length - 1].impressions / 1000)}K</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <LineChartComponent
                              data={awarenessData}
                              config={{ impressions: { label: "Display Impressions", color: "hsl(var(--chart-3))" } }}
                              showLegend={false}
                              showGrid={true}
                              showTooltip={true}
                              showXAxis={true}
                              showYAxis={false}
                              className="h-[120px] w-full"
                              xAxisDataKey="month"
                            />
                            <div className="flex justify-end mt-2">
                              <Badge variant="success" className="text-xs">+46%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {awarenessMetrics.includes('omiDots') && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">OMI otS {Math.round(awarenessDataRaw[awarenessDataRaw.length - 1].omiDots / 1000)}K</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <LineChartComponent
                              data={awarenessData}
                              config={{ omiDots: { label: "OMI otS", color: "hsl(var(--chart-4))" } }}
                              showLegend={false}
                              showGrid={true}
                              showTooltip={true}
                              showXAxis={true}
                              showYAxis={false}
                              className="h-[120px] w-full"
                              xAxisDataKey="month"
                            />
                            <div className="flex justify-end mt-2">
                              <Badge variant="success" className="text-xs">+68%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {awarenessMetrics.includes('doohSpots') && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">DooH DotS {Math.round(awarenessDataRaw[awarenessDataRaw.length - 1].doohSpots / 1000)}K</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <LineChartComponent
                              data={awarenessData}
                              config={{ doohSpots: { label: "DooH DotS", color: "hsl(var(--chart-5))" } }}
                              showLegend={false}
                              showGrid={true}
                              showTooltip={true}
                              showXAxis={true}
                              showYAxis={false}
                              className="h-[120px] w-full"
                              xAxisDataKey="month"
                            />
                            <div className="flex justify-end mt-2">
                              <Badge variant="success" className="text-xs">+52%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    )}
                  </CardContent>
                </Card>

                {/* Row 2 - Total Share of Voice */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Share of Voice 45%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>{titleTooltips.totalSov}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <TooltipProvider>
                        {selectedImpressionKeys.map((key, i) => (
                          <React.Fragment key={key}>
                            {i > 0 && <Plus className="w-3 h-3 text-muted-foreground" />}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span><Badge variant="secondary" className="text-xs cursor-help">{channelLabels[key]} {sovChannelData[key as keyof typeof sovChannelData].value}%</Badge></span>
                              </TooltipTrigger>
                              <TooltipContent>{channelSovTooltips[key]}</TooltipContent>
                            </Tooltip>
                          </React.Fragment>
                        ))}
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent
                      data={sovPieData}
                      config={sovPieConfig}
                      showLegend={false}
                      showTooltip={true}
                      className="h-[200px] w-full"
                      nameKey="name"
                      dataKey="value"
                      innerRadius={55}
                      outerRadius={90}
                      showLabels={true}
                      labelPosition="inside"
                      startAngle={90}
                      endAngle={-270}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+41%</Badge>
                    </div>
                    <div className="flex justify-center mt-2 mb-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSovDetailsCollapsed(!sovDetailsCollapsed)}
                      >
                        {sovDetailsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                    {!sovDetailsCollapsed && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${selectedImpressionKeys.length} gap-4`}>
                      {selectedImpressionKeys.map((key) => (
                        <Card key={key}>
                          <CardHeader>
                            <CardTitle className="text-sm">{channelLabels[key]} SOV {sovChannelData[key as keyof typeof sovChannelData].value}%</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <PieChartComponent
                              data={sovChannelData[key as keyof typeof sovChannelData].pieData}
                              config={sovPieConfig}
                              showLegend={false}
                              showTooltip={true}
                              className="h-[120px] w-full"
                              nameKey="name"
                              dataKey="value"
                              innerRadius={25}
                              outerRadius={40}
                              showLabels={true}
                              labelPosition="inside"
                              startAngle={90}
                              endAngle={-270}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    )}
                  </CardContent>
                </Card>

                {/* Row 3 - Total Buyer Reach */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Buyer Reach
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>{titleTooltips.totalBuyerReach}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span><Badge variant="secondary" className="text-xs cursor-help">New-to-brand reach</Badge></span>
                          </TooltipTrigger>
                          <TooltipContent>Customer that did not have an impression, but now interacted with an ad</TooltipContent>
                        </Tooltip>
                        <Plus className="w-3 h-3 text-muted-foreground" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span><Badge variant="secondary" className="text-xs cursor-help">Lapsed brand reach</Badge></span>
                          </TooltipTrigger>
                          <TooltipContent>Customer that had impressions, but not between x time and now interacted again</TooltipContent>
                        </Tooltip>
                        <Plus className="w-3 h-3 text-muted-foreground" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span><Badge variant="secondary" className="text-xs cursor-help">Existing brand reach</Badge></span>
                          </TooltipTrigger>
                          <TooltipContent>Customer that has an impression before and already had this within x time</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={buyerReachData}
                      config={buyerReachConfig}
                      showLegend={true}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      stacked={true}
                    />
                  </CardContent>
                </Card>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 w-fit"
                  onClick={() => alert('Full Awareness Report')}
                >
                  Full Report
                </Button>
              </div>
            </CardContent>
            )}
          </Card>
          )}

          {/* Consideration Card */}
          {visibleFunnelCards.consideration && (
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setConsiderationCollapsed(!considerationCollapsed)}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex flex-col gap-1 justify-center">
                  <CardTitle>Consideration</CardTitle>
                  <p className={`text-sm text-muted-foreground transition-all duration-200 ${considerationCollapsed ? 'opacity-100' : 'opacity-0 h-0'}`}>
                    Total Engagements {totalEngagementsLabel}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConsiderationCollapsed(!considerationCollapsed);
                  }}
                >
                  {considerationCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </div>
              {considerationCollapsed && (
                <div className="h-12 w-full -mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={considerationData.map(d => ({ value: d.totalEngagements }))}>
                      <RechartsLine type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3, fill: "white", stroke: "hsl(var(--chart-2))", strokeWidth: 2 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardHeader>
            {!considerationCollapsed && (
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Row 1 - Total Engagements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Engagements {totalEngagementsLabel}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Total number of clicks and interactions across all channels</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">SPA Clicks {Math.round(considerationDataRaw[5].spaClicks / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Display Clicks {Math.round(considerationDataRaw[5].displayClicks / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">DOOH Clicks {Math.round(considerationDataRaw[5].doohClicks / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">OMI Clicks {Math.round(considerationDataRaw[5].omiClicks / 1000)}K</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={considerationData}
                      config={{
                        totalEngagements: { label: "Total Engagements", color: "hsl(var(--chart-1))" }
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      showDots={true}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      tooltipKeys={Object.fromEntries(
                        considerationEngagementKeys.map(k => [k, {
                          label: k === 'spaClicks' ? 'SPA Clicks' : k === 'displayClicks' ? 'Display Clicks' : k === 'doohClicks' ? 'DOOH Clicks' : 'OMI Clicks',
                          color: 'transparent'
                        }])
                      )}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+78%</Badge>
                    </div>
                    <div className="flex justify-center mt-2 mb-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setVolumeDetailsCollapsed(!volumeDetailsCollapsed)}
                      >
                        {volumeDetailsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                    {!volumeDetailsCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {considerationEngagementKeys.map((key) => (
                        <Card key={key}>
                          <CardHeader>
                            <CardTitle className="text-sm">
                              {key === 'spaClicks' ? 'SPA Clicks' : key === 'displayClicks' ? 'Display Clicks' : key === 'doohClicks' ? 'DOOH Clicks' : 'OMI Clicks'} {Math.round(considerationDataRaw[5][key] / 1000)}K
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <LineChartComponent
                              data={considerationData}
                              config={{ [key]: { label: key === 'spaClicks' ? 'SPA Clicks' : key === 'displayClicks' ? 'Display Clicks' : key === 'doohClicks' ? 'DOOH Clicks' : 'OMI Clicks', color: `hsl(var(--chart-${considerationEngagementKeys.indexOf(key) + 1}))` } }}
                              showLegend={false}
                              showGrid={true}
                              showTooltip={true}
                              showXAxis={true}
                              showYAxis={false}
                              className="h-[120px] w-full"
                              xAxisDataKey="month"
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    )}
                  </CardContent>
                </Card>

                {/* Row 2 - Total CTR */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total CTR {considerationData[5].totalCtr}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Average click-through rate across channels. Percentage of ads clicked vs impressions served.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">SPA CTR {considerationDataRaw[5].spaCtr}%</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Display CTR {considerationDataRaw[5].displayCtr}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={considerationData}
                      config={{
                        totalCtr: { label: "Total CTR %", color: "hsl(var(--chart-2))" }
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      showDots={true}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      tooltipKeys={{
                        spaCtr: { label: 'SPA CTR %', color: 'transparent' },
                        displayCtr: { label: 'Display CTR %', color: 'transparent' },
                      }}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+56%</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Row 3 - Total Reach Clicks (Users) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Reach Clicks {Math.round(considerationDataRaw[5].reachClicks / 1000)}K
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Unique count of customers (customer IDs) that had a click interaction</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">New-to-brand reach {Math.round(considerationDataRaw[5].newBrandReach / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Lapsed brand reach {Math.round(considerationDataRaw[5].lapsedReach / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Existing brand reach {Math.round(considerationDataRaw[5].existingReach / 1000)}K</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={considerationData}
                      config={{
                        newBrandReach: { label: "New-to-brand", color: "hsl(var(--chart-1))" },
                        lapsedReach: { label: "Lapsed brand", color: "hsl(var(--chart-2))" },
                        existingReach: { label: "Existing brand", color: "hsl(var(--chart-3))" },
                      }}
                      showLegend={true}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      stacked={true}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+92%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            )}
          </Card>
          )}

          {/* Purchase Card */}
          {visibleFunnelCards.purchase && (
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setPurchaseCollapsed(!purchaseCollapsed)}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex flex-col gap-1 justify-center">
                  <CardTitle>Purchase</CardTitle>
                  <p className={`text-sm text-muted-foreground transition-all duration-200 ${purchaseCollapsed ? 'opacity-100' : 'opacity-0 h-0'}`}>
                    Total Buyers {purchaseData[purchaseData.length - 1].totalBuyers.toLocaleString()}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPurchaseCollapsed(!purchaseCollapsed);
                  }}
                >
                  {purchaseCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </div>
              {purchaseCollapsed && (
                <div className="h-12 w-full -mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={purchaseData.map(d => ({ value: d.totalBuyers }))}>
                      <RechartsLine type="monotone" dataKey="value" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3, fill: "white", stroke: "hsl(var(--chart-3))", strokeWidth: 2 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardHeader>
            {!purchaseCollapsed && (
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Row 1 - ROAS */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      ROAS {purchaseData[5].roas}x
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Return on ad spend across Display, SPA, DMI and OMI channels</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">iROAS {purchaseData[5].iroas}x</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">CPA €{purchaseData[5].cpa}</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Adspend €{Math.round(purchaseDataRaw[5].adspend / 1000)}K</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={purchaseData}
                      config={{
                        roas: { label: "ROAS", color: "hsl(var(--chart-1))" }
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      showDots={true}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      tooltipKeys={{
                        iroas: { label: 'iROAS', color: 'transparent' },
                        cpa: { label: 'CPA (€)', color: 'transparent' },
                        adspend: { label: 'Adspend (€)', color: 'transparent' },
                      }}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+82%</Badge>
                    </div>
                    <div className="flex justify-center mt-2 mb-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSovDetailsCollapsed(!sovDetailsCollapsed)}
                      >
                        {sovDetailsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                    {!sovDetailsCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Add to Cart Rate {purchaseData[5].addToCartRate}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <LineChartComponent
                            data={purchaseData}
                            config={{ addToCartRate: { label: "Add to Cart %", color: "hsl(var(--chart-1))" } }}
                            showLegend={false}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={false}
                            className="h-[120px] w-full"
                            xAxisDataKey="month"
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Units Sold {purchaseData[5].unitsSold.toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <LineChartComponent
                            data={purchaseData}
                            config={{ unitsSold: { label: "Units Sold", color: "hsl(var(--chart-2))" } }}
                            showLegend={false}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={false}
                            className="h-[120px] w-full"
                            xAxisDataKey="month"
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Conversions {purchaseData[5].conversions.toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <LineChartComponent
                            data={purchaseData}
                            config={{ conversions: { label: "Conversions", color: "hsl(var(--chart-3))" } }}
                            showLegend={false}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={false}
                            className="h-[120px] w-full"
                            xAxisDataKey="month"
                          />
                        </CardContent>
                      </Card>
                    </div>
                    )}
                  </CardContent>
                </Card>

                {/* Row 2 - Total Revenue */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Revenue {totalRevenueLabel}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Total revenue generated across Display, SPA, DMI and OMI channels</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">SPA €{Math.round(purchaseDataRaw[5].spaRevenue / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Display €{Math.round(purchaseDataRaw[5].displayRevenue / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">DMI €{Math.round(purchaseDataRaw[5].dmiRevenue / 1000)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">OMI €{Math.round(purchaseDataRaw[5].omiRevenue / 1000)}K</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={purchaseData}
                      config={{
                        totalRevenue: { label: "Total Revenue (€)", color: "hsl(var(--chart-3))" }
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      showDots={true}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      tooltipKeys={{
                        spaRevenue: { label: 'SPA Revenue (€)', color: 'transparent' },
                        displayRevenue: { label: 'Display Revenue (€)', color: 'transparent' },
                        dmiRevenue: { label: 'DMI Revenue (€)', color: 'transparent' },
                        omiRevenue: { label: 'OMI Revenue (€)', color: 'transparent' },
                      }}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+121%</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Row 3 - Total Buyers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Total Buyers {purchaseData[5].totalBuyers.toLocaleString()}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Total unique buyers across all channels. Lapsed, existing and new buyers based on revenue.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">New buyers {purchaseData[5].newBuyers}</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Lapsed buyers {purchaseData[5].lapsedBuyers}</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Existing buyers {purchaseData[5].existingBuyers}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={purchaseData}
                      config={{
                        newBuyers: { label: "New buyers", color: "hsl(var(--chart-1))" },
                        lapsedBuyers: { label: "Lapsed buyers", color: "hsl(var(--chart-2))" },
                        existingBuyers: { label: "Existing buyers", color: "hsl(var(--chart-3))" },
                      }}
                      showLegend={true}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      stacked={true}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+99%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            )}
          </Card>
          )}

          {/* Loyalty Card */}
          {visibleFunnelCards.loyalty && (
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setLoyaltyCollapsed(!loyaltyCollapsed)}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex flex-col gap-1 justify-center">
                  <CardTitle>Loyalty</CardTitle>
                  <p className={`text-sm text-muted-foreground transition-all duration-200 ${loyaltyCollapsed ? 'opacity-100' : 'opacity-0 h-0'}`}>
                    Retained Customers {(loyaltyData[loyaltyData.length - 1].existingBuyers / 1000).toFixed(1)}K
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLoyaltyCollapsed(!loyaltyCollapsed);
                  }}
                >
                  {loyaltyCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </div>
              {loyaltyCollapsed && (
                <div className="h-12 w-full -mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={loyaltyData.map(d => ({ value: d.existingBuyers }))}>
                      <RechartsLine type="monotone" dataKey="value" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 3, fill: "white", stroke: "hsl(var(--chart-4))", strokeWidth: 2 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardHeader>
            {!loyaltyCollapsed && (
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Row 1 - Customer Lifetime Value */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Customer Lifetime Value €{loyaltyData[5].clv}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Average projected customer lifetime value based on purchase behavior and retention</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">Churn Rate {loyaltyData[5].churnRate}%</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Retention Rate {loyaltyData[5].retentionRate}%</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Frequency {loyaltyData[5].frequency}x</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LineChartComponent
                      data={loyaltyData}
                      config={{
                        clv: { label: "CLV (€)", color: "hsl(var(--chart-1))" }
                      }}
                      showLegend={false}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      showDots={true}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      tooltipKeys={{
                        churnRate: { label: 'Churn Rate %', color: 'transparent' },
                        retentionRate: { label: 'Retention Rate %', color: 'transparent' },
                        frequency: { label: 'Frequency', color: 'transparent' },
                      }}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+42%</Badge>
                    </div>
                    <div className="flex justify-center mt-2 mb-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setBuyerReachDetailsCollapsed(!buyerReachDetailsCollapsed)}
                      >
                        {buyerReachDetailsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                    {!buyerReachDetailsCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Churn Rate {loyaltyData[5].churnRate}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <LineChartComponent
                            data={loyaltyData}
                            config={{ churnRate: { label: "Churn Rate %", color: "hsl(var(--chart-1))" } }}
                            showLegend={false}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={false}
                            className="h-[120px] w-full"
                            xAxisDataKey="month"
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Retention Rate {loyaltyData[5].retentionRate}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <LineChartComponent
                            data={loyaltyData}
                            config={{ retentionRate: { label: "Retention Rate %", color: "hsl(var(--chart-2))" } }}
                            showLegend={false}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={false}
                            className="h-[120px] w-full"
                            xAxisDataKey="month"
                          />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Frequency {loyaltyData[5].frequency}x</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <LineChartComponent
                            data={loyaltyData}
                            config={{ frequency: { label: "Frequency", color: "hsl(var(--chart-3))" } }}
                            showLegend={false}
                            showGrid={true}
                            showTooltip={true}
                            showXAxis={true}
                            showYAxis={false}
                            className="h-[120px] w-full"
                            xAxisDataKey="month"
                          />
                        </CardContent>
                      </Card>
                    </div>
                    )}
                  </CardContent>
                </Card>

                {/* Row 2 - Unique Existing Buyers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-1.5">
                      Unique Existing Buyers {(loyaltyData[5].existingBuyers / 1000).toFixed(1)}K
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>Unique existing buyers who made repeat purchases. Is retail media contributing to repeating purchases.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">Existing buyers {(loyaltyData[5].existingBuyers / 1000).toFixed(1)}K</Badge>
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">Lapsed buyers {loyaltyData[5].lapsedBuyers}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BarChartComponent
                      data={loyaltyData}
                      config={{
                        existingBuyers: { label: "Existing buyers", color: "hsl(var(--chart-1))" },
                        lapsedBuyers: { label: "Lapsed buyers", color: "hsl(var(--chart-2))" },
                      }}
                      showLegend={true}
                      showGrid={true}
                      showTooltip={true}
                      showXAxis={true}
                      showYAxis={false}
                      className="h-[200px] w-full"
                      xAxisDataKey="month"
                      stacked={true}
                    />
                    <div className="flex justify-end mt-2">
                      <Badge variant="success" className="text-xs">+38%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            )}
          </Card>
          )}
        </div>
      </AppLayout>

      {/* Custom Report Dialog */}
      <Dialog open={customReportOpen} onOpenChange={setCustomReportOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
            <DialogDescription>
              Select the metrics you want to include in your custom report. Metrics are organized by funnel stage.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[50vh] overflow-y-auto pr-4">
            {/* Awareness Metrics Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Awareness Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-impressions"
                    checked={selectedReportMetrics.includes('impressions')}
                    onCheckedChange={() => toggleReportMetric('impressions')}
                  />
                  <Label htmlFor="metric-impressions" className="text-sm font-normal cursor-pointer">
                    Total Impressions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-display-impressions"
                    checked={selectedReportMetrics.includes('displayImpressions')}
                    onCheckedChange={() => toggleReportMetric('displayImpressions')}
                  />
                  <Label htmlFor="metric-display-impressions" className="text-sm font-normal cursor-pointer">
                    Display Impressions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-omi-dots"
                    checked={selectedReportMetrics.includes('omiDots')}
                    onCheckedChange={() => toggleReportMetric('omiDots')}
                  />
                  <Label htmlFor="metric-omi-dots" className="text-sm font-normal cursor-pointer">
                    OMI otS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-dooh-dots"
                    checked={selectedReportMetrics.includes('doohDots')}
                    onCheckedChange={() => toggleReportMetric('doohDots')}
                  />
                  <Label htmlFor="metric-dooh-dots" className="text-sm font-normal cursor-pointer">
                    DooH DotS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-sov"
                    checked={selectedReportMetrics.includes('shareOfVoice')}
                    onCheckedChange={() => toggleReportMetric('shareOfVoice')}
                  />
                  <Label htmlFor="metric-sov" className="text-sm font-normal cursor-pointer">
                    Share of Voice
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-sales-uplift"
                    checked={selectedReportMetrics.includes('salesUplift')}
                    onCheckedChange={() => toggleReportMetric('salesUplift')}
                  />
                  <Label htmlFor="metric-sales-uplift" className="text-sm font-normal cursor-pointer">
                    Sales Uplift
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-reach"
                    checked={selectedReportMetrics.includes('reach')}
                    onCheckedChange={() => toggleReportMetric('reach')}
                  />
                  <Label htmlFor="metric-reach" className="text-sm font-normal cursor-pointer">
                    Reach
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-frequency"
                    checked={selectedReportMetrics.includes('frequency')}
                    onCheckedChange={() => toggleReportMetric('frequency')}
                  />
                  <Label htmlFor="metric-frequency" className="text-sm font-normal cursor-pointer">
                    Frequency
                  </Label>
                </div>
              </div>
            </div>

            {/* Consideration Metrics Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Consideration Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-clicks"
                    checked={selectedReportMetrics.includes('clicks')}
                    onCheckedChange={() => toggleReportMetric('clicks')}
                  />
                  <Label htmlFor="metric-clicks" className="text-sm font-normal cursor-pointer">
                    Total Clicks
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-display-clicks"
                    checked={selectedReportMetrics.includes('displayClicks')}
                    onCheckedChange={() => toggleReportMetric('displayClicks')}
                  />
                  <Label htmlFor="metric-display-clicks" className="text-sm font-normal cursor-pointer">
                    Display Clicks
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-dooh-dots-pops"
                    checked={selectedReportMetrics.includes('doohDotsPops')}
                    onCheckedChange={() => toggleReportMetric('doohDotsPops')}
                  />
                  <Label htmlFor="metric-dooh-dots-pops" className="text-sm font-normal cursor-pointer">
                    DooH DotS (POPs)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-viewability"
                    checked={selectedReportMetrics.includes('viewability')}
                    onCheckedChange={() => toggleReportMetric('viewability')}
                  />
                  <Label htmlFor="metric-viewability" className="text-sm font-normal cursor-pointer">
                    Viewability
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-ctr"
                    checked={selectedReportMetrics.includes('ctr')}
                    onCheckedChange={() => toggleReportMetric('ctr')}
                  />
                  <Label htmlFor="metric-ctr" className="text-sm font-normal cursor-pointer">
                    Click-Through Rate (CTR)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-engagement-rate"
                    checked={selectedReportMetrics.includes('engagementRate')}
                    onCheckedChange={() => toggleReportMetric('engagementRate')}
                  />
                  <Label htmlFor="metric-engagement-rate" className="text-sm font-normal cursor-pointer">
                    Engagement Rate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-video-completion"
                    checked={selectedReportMetrics.includes('videoCompletion')}
                    onCheckedChange={() => toggleReportMetric('videoCompletion')}
                  />
                  <Label htmlFor="metric-video-completion" className="text-sm font-normal cursor-pointer">
                    Video Completion Rate
                  </Label>
                </div>
              </div>
            </div>

            {/* Purchase Metrics Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Purchase Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-roas"
                    checked={selectedReportMetrics.includes('roas')}
                    onCheckedChange={() => toggleReportMetric('roas')}
                  />
                  <Label htmlFor="metric-roas" className="text-sm font-normal cursor-pointer">
                    ROAS (Return on Ad Spend)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-iroas"
                    checked={selectedReportMetrics.includes('iroas')}
                    onCheckedChange={() => toggleReportMetric('iroas')}
                  />
                  <Label htmlFor="metric-iroas" className="text-sm font-normal cursor-pointer">
                    iROAS (Incremental ROAS)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-purchase-behavior"
                    checked={selectedReportMetrics.includes('purchaseBehavior')}
                    onCheckedChange={() => toggleReportMetric('purchaseBehavior')}
                  />
                  <Label htmlFor="metric-purchase-behavior" className="text-sm font-normal cursor-pointer">
                    Attributable Purchase Behavior
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-conversion-rate"
                    checked={selectedReportMetrics.includes('conversionRate')}
                    onCheckedChange={() => toggleReportMetric('conversionRate')}
                  />
                  <Label htmlFor="metric-conversion-rate" className="text-sm font-normal cursor-pointer">
                    Conversion Rate
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-revenue"
                    checked={selectedReportMetrics.includes('revenue')}
                    onCheckedChange={() => toggleReportMetric('revenue')}
                  />
                  <Label htmlFor="metric-revenue" className="text-sm font-normal cursor-pointer">
                    Total Revenue
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-ad-spend"
                    checked={selectedReportMetrics.includes('adSpend')}
                    onCheckedChange={() => toggleReportMetric('adSpend')}
                  />
                  <Label htmlFor="metric-ad-spend" className="text-sm font-normal cursor-pointer">
                    Total Ad Spend
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-cpa"
                    checked={selectedReportMetrics.includes('cpa')}
                    onCheckedChange={() => toggleReportMetric('cpa')}
                  />
                  <Label htmlFor="metric-cpa" className="text-sm font-normal cursor-pointer">
                    Cost Per Acquisition (CPA)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-cpc"
                    checked={selectedReportMetrics.includes('cpc')}
                    onCheckedChange={() => toggleReportMetric('cpc')}
                  />
                  <Label htmlFor="metric-cpc" className="text-sm font-normal cursor-pointer">
                    Cost Per Click (CPC)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-basket-size"
                    checked={selectedReportMetrics.includes('basketSize')}
                    onCheckedChange={() => toggleReportMetric('basketSize')}
                  />
                  <Label htmlFor="metric-basket-size" className="text-sm font-normal cursor-pointer">
                    Average Basket Size
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metric-customer-ltv"
                    checked={selectedReportMetrics.includes('customerLTV')}
                    onCheckedChange={() => toggleReportMetric('customerLTV')}
                  />
                  <Label htmlFor="metric-customer-ltv" className="text-sm font-normal cursor-pointer">
                    Customer Lifetime Value (LTV)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCustomReportOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuildReport}
              disabled={selectedReportMetrics.length === 0}
            >
              Build Report ({selectedReportMetrics.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </MenuContextProvider>
    );
  },
};