'use client';

// Yield page for Sponsored Products
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from '@/components/ui/card';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { defaultRoutes } from '@/components/layout/default-routes';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';

// Yield metrics for Sponsored Products
const yieldMetrics = [
  { 
    id: 'fill-rate', 
    label: 'Fill Rate', 
    value: '89.3%', 
    subMetric: 'Positions: 1,247',
    badgeValue: '+2.1%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'revenue', 
    label: 'Revenue', 
    value: '€94.2M', 
    subMetric: 'RPP: €75.50',
    badgeValue: '+12.4%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'ecpm', 
    label: 'eCPM', 
    value: '€2.14', 
    subMetric: 'Avg: €1.98',
    badgeValue: '+8.1%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'utilization', 
    label: 'Utilization', 
    value: '94.7%', 
    subMetric: 'Peak: 98.2%',
    badgeValue: '+1.3%',
    badgeVariant: 'success' as const,
  },
];

// Enhanced fill rate data for 30 days
const fillRateData = [];
const today = new Date();
for (let i = 29; i >= 0; i--) {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // Base fill rate with variance
  const baseFillRate = 89.3;
  const variance = (Math.random() - 0.5) * 8;
  const fillRate = Math.max(80, Math.min(96, baseFillRate + variance));
  
  fillRateData.push({
    day: dayLabel,
    fillRate: Math.round(fillRate * 10) / 10,
  });
}

// Bid competition data
const bidCompetitionData = [
  { keyword: 'Coffee', competition: 8.7, avgBid: 1.25 },
  { keyword: 'Organic', competition: 7.2, avgBid: 1.89 },
  { keyword: 'Premium', competition: 6.8, avgBid: 2.14 },
  { keyword: 'Fresh', competition: 5.9, avgBid: 0.98 },
  { keyword: 'Natural', competition: 6.3, avgBid: 1.67 },
];

// Revenue by category data
const revenueByCategoryData = [
  { category: 'Food & Beverage', revenue: 42800, fillRate: 91.2 },
  { category: 'Health & Beauty', revenue: 28900, fillRate: 87.8 },
  { category: 'Home & Garden', revenue: 18600, fillRate: 85.4 },
  { category: 'Electronics', revenue: 15400, fillRate: 89.6 },
  { category: 'Sports & Outdoor', revenue: 12200, fillRate: 86.1 },
];

export default function SponsoredProductsYieldPage() {
  const [selectedMetric, setSelectedMetric] = useState('fill-rate');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
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
        title: 'Yield - Sponsored Products',
        subtitle: 'Monitor fill rates and revenue optimization',
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
              {yieldMetrics.map((metric) => (
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
                {selectedMetricData?.label || 'Fill Rate'} Trend (30 days)
              </h3>
              <LineChartComponent
                data={fillRateData}
                config={{
                  fillRate: {
                    label: selectedMetricData?.label || "Fill Rate",
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
          {/* Bid Competition Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Keyword Competition</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={bidCompetitionData}
                config={{
                  competition: {
                    label: "Competition Level",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="keyword"
              />
            </CardContent>
          </Card>

          {/* Average Bid by Keyword */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Average Bid by Keyword</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={bidCompetitionData}
                config={{
                  avgBid: {
                    label: "Avg Bid (€)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="keyword"
              />
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={revenueByCategoryData}
              config={{
                revenue: {
                  label: "Revenue (€)",
                  color: "hsl(var(--chart-4))",
                },
              }}
              showLegend={false}
              showGrid={true}
              showTooltip={true}
              showXAxis={true}
              showYAxis={true}
              className="h-60 w-full"
              xAxisDataKey="category"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}