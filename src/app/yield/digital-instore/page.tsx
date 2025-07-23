'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from '@/components/ui/card';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { LineChartComponent } from '@/components/ui/line-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { defaultRoutes } from '@/components/layout/default-routes';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';

const yieldMetrics = [
  { id: 'fill-rate', label: 'Fill Rate', value: '85.4%', subMetric: 'Stores: 1,247', badgeValue: '+1.8%', badgeVariant: 'success' as const },
  { id: 'revenue', label: 'Revenue', value: '€45.6M', subMetric: 'RPS: €36.60', badgeValue: '+8.9%', badgeVariant: 'success' as const },
  { id: 'utilization', label: 'Utilization', value: '91.3%', subMetric: 'Hours: 12.5/day', badgeValue: '+2.7%', badgeVariant: 'success' as const },
  { id: 'efficiency', label: 'Efficiency', value: '88.7%', subMetric: 'Uptime: 96.2%', badgeValue: '+1.4%', badgeVariant: 'success' as const },
];

// Chart data function for yield metrics
const getYieldChartData = (selectedMetric: string) => {
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    let baseValue = selectedMetric === 'fill-rate' ? 85 : 
                   selectedMetric === 'utilization' ? 91 : 
                   selectedMetric === 'efficiency' ? 88 : 100;
    
    // Add variance
    const variance = (Math.random() - 0.5) * 10;
    const value = Math.max(0, Math.min(100, baseValue + variance));
    
    days.push({
      day: dayLabel,
      value: Math.round(value * 100) / 100,
    });
  }
  
  return days;
};

// Revenue data for bar chart
const revenueData = [
  { hour: '6AM', revenue: 0 },
  { hour: '7AM', revenue: 2400 },
  { hour: '8AM', revenue: 18900 },
  { hour: '9AM', revenue: 24800 },
  { hour: '10AM', revenue: 27600 },
  { hour: '11AM', revenue: 28400 },
  { hour: '12PM', revenue: 31600 },
  { hour: '1PM', revenue: 32400 },
  { hour: '2PM', revenue: 31800 },
  { hour: '3PM', revenue: 30400 },
  { hour: '4PM', revenue: 29600 },
  { hour: '5PM', revenue: 27800 },
  { hour: '6PM', revenue: 24200 },
  { hour: '7PM', revenue: 17800 },
  { hour: '8PM', revenue: 8400 },
  { hour: '9PM', revenue: 3600 },
  { hour: '10PM', revenue: 0 },
];

export default function DigitalInstoreYieldPage() {
  const [selectedMetric, setSelectedMetric] = useState('fill-rate');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date(),
  });
  
  const chartData = getYieldChartData(selectedMetric);
  const selectedMetricData = yieldMetrics.find(m => m.id === selectedMetric);

  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Yield - Digital In-store',
        subtitle: 'Monitor in-store digital advertising yield',
        headerRight: <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range" showPresets={true} />,
        onEdit: () => alert('Edit clicked'), onExport: () => alert('Export clicked'), onImport: () => alert('Import clicked'), onSettings: () => alert('Settings clicked'),
      }}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {yieldMetrics.map((metric) => (
                <MetricCard key={metric.id} label={metric.label} value={metric.value} subMetric={metric.subMetric}
                  badgeValue={metric.badgeValue} badgeVariant={metric.badgeVariant} isSelected={selectedMetric === metric.id}
                  onClick={() => setSelectedMetric(metric.id)} />
              ))}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {selectedMetricData?.label || 'Yield'} Trend (30 days)
              </h3>
              <LineChartComponent
                data={chartData}
                config={{
                  value: {
                    label: selectedMetricData?.label || 'Value',
                    color: "hsl(var(--chart-1))",
                  },
                }}
                showLegend={false}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Hour Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={revenueData}
                config={{
                  revenue: {
                    label: "Revenue (€)",
                    color: "hsl(var(--chart-2))",
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

          {/* Fill Rate by Store Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fill Rate by Store Type</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={[
                  { storeType: 'Hypermarket', fillRate: 87.2 },
                  { storeType: 'Supermarket', fillRate: 84.8 },
                  { storeType: 'Convenience', fillRate: 82.1 },
                  { storeType: 'Express', fillRate: 86.5 },
                ]}
                config={{
                  fillRate: {
                    label: "Fill Rate %",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="storeType"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}