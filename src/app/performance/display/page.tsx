'use client';

// Performance page for Display - based on DisplayPerformance story
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, MetricCard } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { FilterBar } from '@/components/ui/filter-bar';
import { defaultRoutes } from '@/components/layout/default-routes';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';

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

// Chart data function
const getChartData = (selectedMetric: string) => {
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    let baseAchieved = 1000;
    let basePlanned = 950;
    
    // Weekend dips
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      baseAchieved *= 0.7;
      basePlanned *= 0.7;
    }
    
    // Display has evening peaks
    baseAchieved *= 1.05;
    
    // Add variance
    baseAchieved *= (0.85 + Math.random() * 0.3);
    basePlanned *= (0.95 + Math.random() * 0.1);
    
    const multiplier = selectedMetric === 'impressions' ? 1000 : selectedMetric === 'clicks' ? 10 : selectedMetric === 'spend' ? 5 : 1;
    
    days.push({
      day: dayLabel,
      achieved: Math.round(baseAchieved * multiplier),
      planned: Math.round(basePlanned * multiplier),
    });
  }
  
  return days;
};

// Chart configuration
const chartConfig = {
  achieved: {
    label: "Achieved",
    color: "hsl(var(--chart-1))",
  },
  planned: {
    label: "Planned", 
    color: "hsl(var(--chart-2))",
  },
};

// Mock data for line items performance
const lineItemsData = [
  { id: '1893', name: 'Campaign total', planned: 27000, achieved: 25000, performance: '103.00%', creatives: 2, roas: '4.15x' },
  { id: '1894', name: 'Display line item #1', planned: 1300, achieved: 1250, performance: '96.15%', creatives: 2, roas: '4.05x' },
  { id: '1895', name: 'Display line item #2', planned: 1300, achieved: 1350, performance: '103.85%', creatives: 1, roas: '4.25x' },
];

// Mock data for creatives performance
const creativesData = [
  { id: 'CR-001', name: 'Banner Campaign', planned: 15000, achieved: 14500, performance: '96.67%', lineItems: 3, roas: '4.25x' },
  { id: 'CR-002', name: 'Video Ad', planned: 12000, achieved: 10500, performance: '87.50%', lineItems: 2, roas: '3.98x' },
  { id: 'CR-003', name: 'Rich Media', planned: 8000, achieved: 8200, performance: '102.50%', lineItems: 1, roas: '4.42x' },
];

const getPerformanceBadgeVariant = (performance: string) => {
  const value = parseFloat(performance.replace('%', ''));
  if (value >= 100) return 'default';
  if (value >= 90) return 'secondary';
  return 'destructive';
};

export default function DisplayPerformancePage() {
  const [selectedMetric, setSelectedMetric] = useState('impressions');
  const [activeTab, setActiveTab] = useState('line-items');
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
  
  const chartData = getChartData(selectedMetric);
  const selectedMetricData = displayMetrics.find(m => m.id === selectedMetric);
  
  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Performance - Display',
        subtitle: 'Monitor display campaign performance and analytics',
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
          <CardContent>
            <Viewbar
              labels={[]}
              tabs={[
                { value: 'line-items', label: 'Line Items' },
                { value: 'creatives', label: 'Creatives' },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <div className="mt-4 mb-4">
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
}