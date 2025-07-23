import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { LineChartComponent } from '@/components/ui/line-chart';
import { MapChart } from '@/components/ui/map-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { FilterBar } from '@/components/ui/filter-bar';
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
    const [selectedMetric, setSelectedMetric] = useState('repetitions');
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
    
    const chartData = getChartData(selectedMetric, 'sponsored-products', timeRange, dateRange);
    const chartConfig = getChartConfig(selectedMetric);
    const selectedMetricData = performanceMetrics.find(m => m.id === selectedMetric);
    
    return (
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{}}
        pageHeaderProps={{
          title: 'Holiday Sale 2024 - Sponsored Products',
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
          {/* Performance Overview Card - Contains Metrics and Chart */}
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {performanceMetrics.map((metric) => (
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

              {/* Chart Section */}
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

          {/* Table Section with Tabs */}
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
    
    // Selection states
    const [selectedLineItems, setSelectedLineItems] = useState<any[]>([]);
    const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
    const [selectedStores, setSelectedStores] = useState<any[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
    
    // Digital In-store specific filter states (override the default ones)
    const [storeTypeFilter, setStoreTypeFilter] = useState<string[]>([]);
    const [playerTypeFilter, setPlayerTypeFilter] = useState<string[]>([]);
    // Keep performance filter as is
    
    // Enhanced data with store/player type information for Digital In-store
    const digitalInstoreLineItemsData = [
      { id: '1893', name: 'Campaign total', planned: 27000, achieved: 25000, performance: '103.00%', creatives: 2, storeType: 'hypermarket', playerType: 'digital-display', roas: '2.85x' },
      { id: '1894', name: 'Hypermarket displays', planned: 1300, achieved: 1250, performance: '96.15%', creatives: 2, storeType: 'hypermarket', playerType: 'digital-display', roas: '2.92x' },
      { id: '1895', name: 'Checkout screens', planned: 1300, achieved: 1350, performance: '103.85%', creatives: 1, storeType: 'supermarket', playerType: 'checkout-screen', roas: '3.15x' },
      { id: '1896', name: 'Entrance displays', planned: 1300, achieved: 1180, performance: '90.77%', creatives: 3, storeType: 'convenience', playerType: 'entrance-display', roas: '2.68x' },
      { id: '1897', name: 'Interactive kiosks', planned: 1300, achieved: 1420, performance: '109.23%', creatives: 2, storeType: 'express', playerType: 'interactive-kiosk', roas: '3.47x' },
      { id: '1898', name: 'Express store displays', planned: 800, achieved: 750, performance: '93.75%', creatives: 1, storeType: 'express', playerType: 'digital-display', roas: '2.54x' },
      { id: '1899', name: 'Convenience screens', planned: 950, achieved: 920, performance: '96.84%', creatives: 2, storeType: 'convenience', playerType: 'checkout-screen', roas: '2.78x' },
    ];
    
    const digitalInstoreCreativesData = [
      { id: 'CR-001', name: 'In-store Promotion Banner', planned: 15000, achieved: 14500, performance: '96.67%', lineItems: 3, storeType: 'hypermarket', playerType: 'digital-display', roas: '3.12x' },
      { id: 'CR-002', name: 'Checkout Animation', planned: 12000, achieved: 10500, performance: '87.50%', lineItems: 2, storeType: 'supermarket', playerType: 'checkout-screen', roas: '2.45x' },
      { id: 'CR-003', name: 'Welcome Message', planned: 8000, achieved: 8200, performance: '102.50%', lineItems: 4, storeType: 'convenience', playerType: 'entrance-display', roas: '2.89x' },
      { id: 'CR-004', name: 'Product Finder Interface', planned: 10000, achieved: 11000, performance: '110.00%', lineItems: 2, storeType: 'express', playerType: 'interactive-kiosk', roas: '3.78x' },
      { id: 'CR-005', name: 'Special Offers Display', planned: 6000, achieved: 5800, performance: '96.67%', lineItems: 1, storeType: 'express', playerType: 'digital-display', roas: '2.67x' },
    ];
    
    // Filter function
    const filterData = (data: any[], searchValue: string, storeTypeFilter: string[], playerTypeFilter: string[], performanceFilter: string[]) => {
      return data.filter(item => {
        // Search filter
        const matchesSearch = searchValue === '' || 
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.id.toLowerCase().includes(searchValue.toLowerCase());
        
        // Store type filter
        const matchesStoreType = storeTypeFilter.length === 0 || 
          storeTypeFilter.includes(item.storeType);
        
        // Player type filter
        const matchesPlayerType = playerTypeFilter.length === 0 || 
          playerTypeFilter.includes(item.playerType);
        
        // Performance filter (handles performance, uptime fields)
        const performanceValue = item.performance ? parseFloat(item.performance.replace('%', '')) :
                                 item.uptime ? parseFloat(item.uptime.replace('%', '')) : 0;
        const matchesPerformance = performanceFilter.length === 0 || 
          performanceFilter.some(filter => {
            switch (filter) {
              case 'above-100':
                return performanceValue > 100;
              case '90-100':
                return performanceValue >= 90 && performanceValue <= 100;
              case 'below-90':
                return performanceValue < 90;
              default:
                return true;
            }
          });
        
        return matchesSearch && matchesStoreType && matchesPlayerType && matchesPerformance;
      });
    };
    
    // Digital In-store stores data
    const digitalInstoreStoresData = [
      { id: 'ST-001', name: 'Albert Heijn Amsterdam Central', location: 'Amsterdam', screens: 4, plays: 2847, performance: '89.2%', storeType: 'hypermarket', playerType: 'digital-display' },
      { id: 'ST-002', name: 'Albert Heijn Utrecht CS', location: 'Utrecht', screens: 3, plays: 1923, performance: '92.1%', storeType: 'supermarket', playerType: 'checkout-screen' },
      { id: 'ST-003', name: 'Albert Heijn Rotterdam Central', location: 'Rotterdam', screens: 5, plays: 3241, performance: '87.6%', storeType: 'hypermarket', playerType: 'digital-display' },
      { id: 'ST-004', name: 'Albert Heijn Den Haag HS', location: 'Den Haag', screens: 2, plays: 1564, performance: '94.3%', storeType: 'convenience', playerType: 'entrance-display' },
      { id: 'ST-005', name: 'Albert Heijn Eindhoven CS', location: 'Eindhoven', screens: 3, plays: 2187, performance: '88.9%', storeType: 'express', playerType: 'interactive-kiosk' },
    ];
    
    // Digital In-store players data
    const digitalInstorePlayersData = [
      { id: 'PL-001', name: 'Entrance Display', store: 'Amsterdam Central', location: 'Front entrance', plays: 1247, uptime: '98.5%', storeType: 'hypermarket', playerType: 'entrance-display' },
      { id: 'PL-002', name: 'Checkout Display A', store: 'Amsterdam Central', location: 'Checkout area A', plays: 891, uptime: '95.2%', storeType: 'hypermarket', playerType: 'checkout-screen' },
      { id: 'PL-003', name: 'Checkout Display B', store: 'Amsterdam Central', location: 'Checkout area B', plays: 709, uptime: '89.1%', storeType: 'hypermarket', playerType: 'checkout-screen' },
      { id: 'PL-004', name: 'Produce Section', store: 'Utrecht CS', location: 'Produce department', plays: 1156, uptime: '97.8%', storeType: 'supermarket', playerType: 'digital-display' },
      { id: 'PL-005', name: 'Deli Counter', store: 'Utrecht CS', location: 'Deli department', plays: 767, uptime: '92.3%', storeType: 'supermarket', playerType: 'interactive-kiosk' },
      { id: 'PL-006', name: 'Main Entrance', store: 'Rotterdam Central', location: 'Main entrance', plays: 1578, uptime: '99.1%', storeType: 'hypermarket', playerType: 'entrance-display' },
      { id: 'PL-007', name: 'Bakery Section', store: 'Rotterdam Central', location: 'Bakery department', plays: 1003, uptime: '94.7%', storeType: 'hypermarket', playerType: 'digital-display' },
    ];
    
    // Apply filters to data
    const filteredLineItems = filterData(digitalInstoreLineItemsData, searchValue, storeTypeFilter, playerTypeFilter, performanceFilter);
    const filteredCreatives = filterData(digitalInstoreCreativesData, searchValue, storeTypeFilter, playerTypeFilter, performanceFilter);
    const filteredStores = filterData(digitalInstoreStoresData, searchValue, storeTypeFilter, playerTypeFilter, performanceFilter);
    const filteredPlayers = filterData(digitalInstorePlayersData, searchValue, storeTypeFilter, playerTypeFilter, performanceFilter);
    
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
          title: 'Summer Promotion 2024 - Digital In-store',
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
                {digitalInstoreMetrics.map((metric) => (
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
                  { value: 'stores', label: 'Stores' },
                  { value: 'player', label: 'Player' },
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
                      name: "Store Type",
                      options: [
                        { label: "Hypermarket", value: "hypermarket" },
                        { label: "Supermarket", value: "supermarket" },
                        { label: "Convenience", value: "convenience" },
                        { label: "Express", value: "express" },
                      ],
                      selectedValues: storeTypeFilter,
                      onChange: setStoreTypeFilter,
                    },
                    {
                      name: "Player Type",
                      options: [
                        { label: "Digital Display", value: "digital-display" },
                        { label: "Interactive Kiosk", value: "interactive-kiosk" },
                        { label: "Checkout Screen", value: "checkout-screen" },
                        { label: "Entrance Display", value: "entrance-display" },
                      ],
                      selectedValues: playerTypeFilter,
                      onChange: setPlayerTypeFilter,
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
                  searchPlaceholder="Search stores, players, line items..."
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
                    data={filteredLineItems}
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
                    data={filteredCreatives}
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
                <TabsContent value="stores" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Store Name' },
                      { key: 'id', header: 'Store ID' },
                      { key: 'location', header: 'Location' },
                      { key: 'screens', header: 'Screens', render: row => (
                        <Badge variant="secondary">{row.screens}</Badge>
                      )},
                      { key: 'plays', header: 'Plays', render: row => row.plays.toLocaleString() },
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                    ]}
                    data={filteredStores}
                    rowKey={row => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to store details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedStores,
                      onChange: setSelectedStores,
                      getKey: row => row.id,
                    }}
                  />
                </TabsContent>
                <TabsContent value="player" className="mt-0">
                  <Table
                    columns={[
                      { key: 'name', header: 'Player Name' },
                      { key: 'id', header: 'Player ID' },
                      { key: 'store', header: 'Store' },
                      { key: 'location', header: 'Location' },
                      { key: 'plays', header: 'Plays', render: row => row.plays.toLocaleString() },
                      { key: 'uptime', header: 'Uptime', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.uptime)}>
                          {row.uptime}
                        </Badge>
                      )},
                    ]}
                    data={filteredPlayers}
                    rowKey={row => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to player details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedPlayers,
                      onChange: setSelectedPlayers,
                      getKey: row => row.id,
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Digital In-store Specific Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Netherlands Map Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Store Locations</CardTitle>
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