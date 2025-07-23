'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from '@/components/ui/card';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { defaultRoutes } from '@/components/layout/default-routes';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';

const yieldMetrics = [
  { id: 'fill-rate', label: 'Fill Rate', value: '92.7%', subMetric: 'Positions: 2,845', badgeValue: '+3.2%', badgeVariant: 'success' as const },
  { id: 'revenue', label: 'Revenue', value: '€67.8M', subMetric: 'RPP: €23.80', badgeValue: '+15.7%', badgeVariant: 'success' as const },
  { id: 'ecpm', label: 'eCPM', value: '€3.45', subMetric: 'Avg: €3.12', badgeValue: '+10.6%', badgeVariant: 'success' as const },
  { id: 'utilization', label: 'Utilization', value: '96.2%', subMetric: 'Peak: 99.1%', badgeValue: '+2.1%', badgeVariant: 'success' as const },
];

// Enhanced fill rate data for 30 days
const fillRateData = [];
const today = new Date();
for (let i = 29; i >= 0; i--) {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // Base fill rate with variance
  const baseFillRate = 92.7;
  const variance = (Math.random() - 0.5) * 6;
  const fillRate = Math.max(85, Math.min(98, baseFillRate + variance));
  
  fillRateData.push({
    day: dayLabel,
    fillRate: Math.round(fillRate * 10) / 10,
  });
}

// eCPM by device type data
const ecpmByDeviceData = [
  { device: 'Desktop', ecpm: 3.85, impressions: 2847000 },
  { device: 'Mobile', ecpm: 2.94, impressions: 4123000 },
  { device: 'Tablet', ecpm: 3.21, impressions: 891000 },
  { device: 'Smart TV', ecpm: 4.12, impressions: 567000 },
];

// Revenue by hour data
const revenueByHourData = [
  { hour: '0', revenue: 28400 },
  { hour: '1', revenue: 24200 },
  { hour: '2', revenue: 21800 },
  { hour: '3', revenue: 19600 },
  { hour: '4', revenue: 18200 },
  { hour: '5', revenue: 19800 },
  { hour: '6', revenue: 23400 },
  { hour: '7', revenue: 28900 },
  { hour: '8', revenue: 36400 },
  { hour: '9', revenue: 42100 },
  { hour: '10', revenue: 45800 },
  { hour: '11', revenue: 48200 },
  { hour: '12', revenue: 49600 },
  { hour: '13', revenue: 48900 },
  { hour: '14', revenue: 47200 },
  { hour: '15', revenue: 45600 },
  { hour: '16', revenue: 44100 },
  { hour: '17', revenue: 42800 },
  { hour: '18', revenue: 41200 },
  { hour: '19', revenue: 38900 },
  { hour: '20', revenue: 36100 },
  { hour: '21', revenue: 33400 },
  { hour: '22', revenue: 31200 },
  { hour: '23', revenue: 29800 },
];

export default function DisplayYieldPage() {
  const [selectedMetric, setSelectedMetric] = useState('fill-rate');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date(),
  });
  
  const selectedMetricData = yieldMetrics.find(m => m.id === selectedMetric);

  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Yield - Display',
        subtitle: 'Monitor display advertising yield and optimization',
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
                {selectedMetricData?.label || 'Fill Rate'} Trend (30 days)
              </h3>
              <LineChartComponent 
                data={fillRateData} 
                config={{ 
                  fillRate: { 
                    label: selectedMetricData?.label || "Fill Rate", 
                    color: "hsl(var(--chart-1))" 
                  }
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
          {/* eCPM by Device Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">eCPM by Device Type</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={ecpmByDeviceData}
                config={{
                  ecpm: {
                    label: "eCPM (€)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="device"
              />
            </CardContent>
          </Card>

          {/* Revenue by Hour */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={revenueByHourData}
                config={{
                  revenue: {
                    label: "Revenue (€)",
                    color: "hsl(var(--chart-3))",
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

        {/* Impressions Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Impressions by Device Type</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={ecpmByDeviceData}
              config={{
                impressions: {
                  label: "Impressions",
                  color: "hsl(var(--chart-4))",
                },
              }}
              showLegend={false}
              showGrid={true}
              showTooltip={true}
              showXAxis={true}
              showYAxis={true}
              className="h-60 w-full"
              xAxisDataKey="device"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}