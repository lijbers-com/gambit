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
  { id: 'fill-rate', label: 'Fill Rate', value: '78.9%', subMetric: 'Locations: 843', badgeValue: '+0.9%', badgeVariant: 'success' as const },
  { id: 'revenue', label: 'Revenue', value: '€23.4M', subMetric: 'RPL: €27.80', badgeValue: '+5.2%', badgeVariant: 'success' as const },
  { id: 'utilization', label: 'Utilization', value: '84.6%', subMetric: 'Materials: 2,195', badgeValue: '+1.8%', badgeVariant: 'success' as const },
  { id: 'compliance', label: 'Compliance', value: '94.2%', subMetric: 'Verified: 89%', badgeValue: '+2.1%', badgeVariant: 'success' as const },
];

// Chart data function for yield metrics
const getYieldChartData = (selectedMetric: string) => {
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    let baseValue = selectedMetric === 'fill-rate' ? 78 : 
                   selectedMetric === 'utilization' ? 84 : 
                   selectedMetric === 'compliance' ? 94 : 100;
    
    // Add variance
    const variance = (Math.random() - 0.5) * 8;
    const value = Math.max(0, Math.min(100, baseValue + variance));
    
    days.push({
      day: dayLabel,
      value: Math.round(value * 100) / 100,
    });
  }
  
  return days;
};

// Material placement data for bar chart
const materialPlacementData = [
  { location: 'End-caps', placements: 342, efficiency: 89.2 },
  { location: 'Shelf Edge', placements: 578, efficiency: 76.8 },
  { location: 'Floor Graphics', placements: 189, efficiency: 92.1 },
  { location: 'Window Displays', placements: 156, efficiency: 84.5 },
  { location: 'Checkout Area', placements: 298, efficiency: 81.3 },
];

export default function OfflineInstoreYieldPage() {
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
        title: 'Yield - Offline In-store',
        subtitle: 'Monitor physical in-store advertising yield',
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
          {/* Material Placement Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Placement Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={materialPlacementData}
                config={{
                  efficiency: {
                    label: "Efficiency %",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="location"
              />
            </CardContent>
          </Card>

          {/* Material Count by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Materials by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={materialPlacementData}
                config={{
                  placements: {
                    label: "Materials",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="location"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}