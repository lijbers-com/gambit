'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ChatInterface, Message } from '@/components/ui/chat-interface';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/card';
import { LineChartComponent } from '@/components/ui/line-chart';
import { TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SpendAnalysisChatPage() {
  const { theme } = useTheme();
  const routes = getRoutesForTheme(theme);
  const [spendValue, setSpendValue] = useState(30000);
  const [isDragging, setIsDragging] = useState(false);

  // Create spend analysis content
  const createSpendAnalysisContent = () => {
    const calculateMetrics = (spend: number) => {
      const spendRatio = (spend - 10000) / 40000; // Normalize spend to 0-1 range (10K-50K)

      // ROAS shows diminishing returns (exponential decay)
      // Starts high, decreases gradually
      const maxRoas = 600;
      const minRoas = 100;
      const roasDecayRate = 1.8; // Gentler decay
      const roas = maxRoas - ((maxRoas - minRoas) * Math.pow(spendRatio, 1 / roasDecayRate));

      // Revenue shows logarithmic growth (diminishing returns)
      // Increases more gradually at first, then slows down
      const baseRevenue = 100;
      const maxRevenue = 500;
      const revenueGrowthRate = 0.6; // More gradual increase
      const revenue = baseRevenue + ((maxRevenue - baseRevenue) * Math.pow(spendRatio, revenueGrowthRate));

      return { spend, roas: Math.round(roas), revenue: Math.round(revenue) };
    };

    const generateForecastData = () => {
      const data = [];
      for (let spend = 10; spend <= 50; spend += 2) {
        const metrics = calculateMetrics(spend * 1000);
        data.push({
          spend: `${spend}K`,
          spendValue: spend * 1000,
          roas: metrics.roas,
          revenue: metrics.revenue,
        });
      }
      return data;
    };

    const forecastData = generateForecastData();
    const currentMetrics = calculateMetrics(spendValue);
    const dragPosition = ((spendValue - 10000) / 40000) * 100; // Convert spend back to percentage

    const forecastConfig = {
      roas: {
        label: "ROAS",
        color: "hsl(var(--chart-1))",
      },
      revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))",
      },
    };

    return (
      <>
        <p className="text-sm mb-4">Based on your campaign performance, I recommend increasing your spend. Here's why:</p>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <MetricCard
            label="ROAS Performance"
            value="4.2x"
            subMetric="Above target (3.0x)"
            badgeValue="+40%"
            badgeVariant="success"
          />
          <MetricCard
            label="Budget Usage"
            value="95%"
            subMetric="Near depletion"
            badgeValue="High demand"
            badgeVariant="warning"
          />
          <MetricCard
            label="Opportunity Cost"
            value="$12.5K"
            subMetric="Potential lost revenue"
            badgeValue="High"
            badgeVariant="destructive"
          />
        </div>

        {/* Forecast Chart */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-3">Spend vs Performance Forecast</p>
          <div className="bg-white rounded-lg p-4 relative">
            <LineChartComponent
              data={forecastData}
              config={forecastConfig}
              curved={true}
              showLegend={true}
              showGrid={true}
              showTooltip={true}
              showXAxis={true}
              showYAxis={true}
              className="h-[300px] w-full"
              xAxisDataKey="spend"
              yAxisLabel="Revenue"
              secondaryYAxis={{
                dataKey: "roas",
                domain: [0, 700],
                label: "ROAS"
              }}
            />

            {/* Interactive overlay */}
            <div
              className="absolute inset-0"
              style={{
                cursor: isDragging ? 'ew-resize' : 'crosshair',
                pointerEvents: 'auto'
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);

                const container = e.currentTarget;
                const rect = container.getBoundingClientRect();

                // Account for chart margins - Recharts typically has margins
                const chartMarginLeft = rect.width * 0.1; // ~10% left margin
                const chartMarginRight = rect.width * 0.05; // ~5% right margin
                const chartWidth = rect.width - chartMarginLeft - chartMarginRight;

                const updateSpend = (clientX: number) => {
                  const x = clientX - rect.left - chartMarginLeft;
                  const percentage = Math.max(0, Math.min(100, (x / chartWidth) * 100));
                  const newSpend = 10000 + (percentage / 100) * 40000;
                  setSpendValue(Math.round(newSpend));
                };

                const handleMouseMove = (e: MouseEvent) => {
                  updateSpend(e.clientX);
                };

                const handleMouseUp = () => {
                  setIsDragging(false);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);

                // Set initial position
                updateSpend(e.clientX);
              }}
            >
              {/* Vertical indicator line */}
              <div
                className="absolute top-0 bottom-0 w-px bg-border pointer-events-none"
                style={{
                  left: `${10 + (dragPosition * 0.85)}%`, // Account for chart margins
                  zIndex: 10
                }}
              >
                {/* Spend amount as central element with chevrons */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap">
                  {/* Left chevron */}
                  <ChevronLeft className="w-4 h-4 mr-1 text-primary" />

                  {/* Spend amount */}
                  <span className="font-medium">
                    Spend amount ${(spendValue / 1000).toFixed(0)}K
                  </span>

                  {/* Right chevron */}
                  <ChevronRight className="w-4 h-4 ml-1 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p><strong>Key insights:</strong></p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span><strong>High ROAS:</strong> Your campaign is generating $4.20 for every $1 spent, which is 40% above your target of 3.0x</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span><strong>Budget Constraint:</strong> You've used 95% of your allocated budget with 2 weeks remaining in the campaign period</span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span><strong>Growth Potential:</strong> Based on current conversion rates, increasing spend by $15K could generate an additional $63K in revenue</span>
            </li>
          </ul>

          <p className="pt-2"><strong>Recommendation:</strong> Increase your campaign budget by $15,000 to capitalize on the high performance and avoid missing out on potential revenue during the remaining campaign period.</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4 pt-4">
          <Button>
            Increase Budget
          </Button>
          <Button variant="outline">
            Show Campaign Details
          </Button>
        </div>
      </>
    );
  };

  // Initial messages for spend analysis chat
  const initialMessages: Message[] = [
    {
      id: 1,
      text: "Show me budget recommendation for Summer Sale campaign",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: 2,
      text: createSpendAnalysisContent(),
      isUser: false,
      timestamp: new Date()
    }
  ];

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => console.log('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Campaign Agent',
          subtitle: 'Budget analysis and spend optimization',
          headerRight: null,
          onEdit: () => console.log('Edit clicked'),
          onExport: () => console.log('Export clicked'),
          onImport: () => console.log('Import clicked'),
          onSettings: () => console.log('Settings clicked'),
        }}
      >
        <ChatInterface initialMessages={initialMessages} />
      </AppLayout>
    </MenuContextProvider>
  );
}
