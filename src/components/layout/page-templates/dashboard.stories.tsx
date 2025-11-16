import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, MetricCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatInterface } from '@/components/ui/chat-interface';
import { LineChartComponent } from '@/components/ui/line-chart';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { MenuContextProvider } from '@/contexts/menu-context';
import React, { useState } from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { MessageSquare, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Chat',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Chat Page Template

The Chat page template provides a conversational interface for AI-powered interactions. It offers a clean layout structure optimized for chat-based applications and messaging.

## Features

- **Full-screen layout**: Utilizes the entire viewport for maximum chat area
- **AppLayout integration**: Built on top of the AppLayout component with navigation and user management
- **Flexible content area**: Ready-to-use content container for chat interfaces and messaging components
- **Responsive design**: Adapts to different screen sizes seamlessly

## Usage

This template is ideal for:
- AI chat interfaces
- Customer support chat pages
- Conversational AI applications
- Messaging and communication tools

## Components Used

- AppLayout (navigation, user management, breadcrumbs)
- Card (content containers)
- CardHeader, CardTitle, CardDescription (content structure)
- CardContent (main content area)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;



export const Chat: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Campaign Agent',
            subtitle: 'AI-powered conversational interface for campaign management',
            headerRight: null,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <ChatInterface />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Enhanced ChatInterface that shows the spend analysis example
const ChatInterfaceWithSpendAnalysis = () => {
  const [spendValue, setSpendValue] = useState(30000);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate ROAS and Revenue based on spend
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

  // Generate forecast data
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
  const dragPosition = ((spendValue - 10000) / 40000) * 100;

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

  // Custom message content for the spend analysis example
  const SpendAnalysisContent = () => (
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

      {/* Interactive Forecast Chart */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-3">Spend vs Performance Forecast</p>
        <div className="relative bg-white rounded-lg p-4">
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
              const chartMarginLeft = rect.width * 0.1;
              const chartMarginRight = rect.width * 0.05;
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
              updateSpend(e.clientX);
            }}
          >
            {/* Vertical indicator line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-border pointer-events-none"
              style={{
                left: `${10 + (dragPosition * 0.85)}%`,
                zIndex: 10
              }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap">
                <ChevronLeft className="w-4 h-4 mr-1 text-primary" />
                <span className="font-medium">
                  Spend amount ${(spendValue / 1000).toFixed(0)}K
                </span>
                <ChevronRight className="w-4 h-4 ml-1 text-primary" />
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Drag the chart to explore different spend levels</p>
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

  // Create a modified ChatInterface with pre-loaded messages
  const [messages] = useState([
    {
      id: 1,
      text: "Why should I increase the spend on my Summer Sale campaign?",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: <SpendAnalysisContent />,
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  return <ChatInterface initialMessages={messages} />;
};

export const ChatWithSpendAnalysis: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Campaign Agent',
            subtitle: 'AI-powered conversational interface for campaign management',
            headerRight: null,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <ChatInterfaceWithSpendAnalysis />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

// ChatInterface for New Campaign example
const ChatInterfaceWithNewCampaign = () => {
  const [messages] = useState([
    {
      id: 1,
      text: "Create a new sponsored products campaign",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "Based on your requirements, I've generated 3 sponsored products campaign proposals with different optimization strategies. Each targets different goals and budget allocations:",
      isUser: false,
      timestamp: new Date(),
      showCampaigns: true
    },
  ]);

  return <ChatInterface initialMessages={messages} />;
};

export const ChatWithNewCampaign: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Campaign Agent',
            subtitle: 'AI-powered conversational interface for campaign management',
            headerRight: null,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <ChatInterfaceWithNewCampaign />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

// ChatInterface for Keyword Suggestions example
const ChatInterfaceWithKeywordSuggestions = () => {
  const [messages] = useState([
    {
      id: 1,
      text: "Help me with suggested keywords",
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "I'd be happy to help you generate targeted keyword suggestions! To provide the most relevant keywords, please select the retail products you'd like to target in your campaign:",
      isUser: false,
      timestamp: new Date(),
      showRetailProducts: true
    },
  ]);

  return <ChatInterface initialMessages={messages} />;
};

export const ChatWithKeywordSuggestions: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Campaign Agent',
            subtitle: 'AI-powered conversational interface for campaign management',
            headerRight: null,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
          <ChatInterfaceWithKeywordSuggestions />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};