'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ChatInterface, Message } from '@/components/ui/chat-interface';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/card';
import { LineChartComponent } from '@/components/ui/line-chart';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function SpendAnalysisChatPage() {
  const { theme } = useTheme();
  const routes = getRoutesForTheme(theme);

  // Create spend analysis content
  const createSpendAnalysisContent = () => {
    const calculateMetrics = (spend: number) => {
      const maxRoas = 600;
      const minRoas = 100;
      const roasRange = maxRoas - minRoas;
      const spendRatio = (spend - 10000) / 40000;
      const roas = maxRoas - (spendRatio * roasRange);

      const baseRevenue = 100;
      const maxRevenue = 500;
      const revenueRange = maxRevenue - baseRevenue;
      const revenue = baseRevenue + (spendRatio * revenueRange);

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
          <div className="bg-white rounded-lg p-4">
            <LineChartComponent
              data={forecastData}
              config={forecastConfig}
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
