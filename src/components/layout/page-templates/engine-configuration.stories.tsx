import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { FilterBar } from '@/components/ui/filter-bar';
import { WorkflowBuilder } from '@/components/ui/workflow-builder';
import type { EngineId } from '@/lib/db';
import React, { useState } from 'react';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Engine Configuration',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Engine Configuration Page Template

The Engine Configuration page template provides comprehensive configuration management for different advertising engines. It serves as the main interface for configuring and managing engine-specific settings.

## Features

- **Interactive Metric Cards**: Display key configuration metrics and status
- **Dynamic Chart Visualization**: Bar chart showing configuration performance
- **Tabbed Data Tables**: Switch between different configuration sections
- **Real-time Configuration**: Live configuration status indicators
- **Engine-Specific Settings**: Customized configuration options per engine type

## Engine Types

### Supported Engines
- **Sponsored Products**: Product advertising configuration
- **Display**: Display advertising configuration
- **Digital In-store**: Digital in-store advertising configuration
- **Offline In-store**: Offline in-store advertising configuration

## Layout Structure

### Top Configuration Cards (4 cards)
- **Configuration Status**: Overall configuration completeness
- **Active Rules**: Number of active configuration rules
- **Performance**: Configuration performance metrics
- **Last Updated**: Configuration update timestamps

### Configuration Tables
- **Rules**: Configuration rules and settings
- **Templates**: Configuration templates
- **History**: Configuration change history

## Usage

This template is ideal for:
- Engine configuration management
- Settings and rules administration
- Configuration performance monitoring
- Template and rule management
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper functions for configuration data
const getPerformanceBadgeVariant = (performance: string) => {
  const value = parseFloat(performance.replace('%', ''));
  if (value >= 100) return 'success';
  if (value >= 90) return 'secondary';
  return 'destructive';
};

// Sample configuration data
const configurationRulesData = [
  {
    id: 'RULE-001',
    name: 'Product Category Targeting',
    status: 'Active',
    priority: 'High',
    lastUpdated: '2024-01-15',
    performance: '98%',
    templates: 3
  },
  {
    id: 'RULE-002',
    name: 'Audience Segmentation',
    status: 'Active',
    priority: 'Medium',
    lastUpdated: '2024-01-12',
    performance: '94%',
    templates: 2
  },
  {
    id: 'RULE-003',
    name: 'Budget Optimization',
    status: 'Paused',
    priority: 'Low',
    lastUpdated: '2024-01-10',
    performance: '87%',
    templates: 1
  },
];

const configurationTemplatesData = [
  {
    id: 'TEMP-001',
    name: 'Standard Product Template',
    category: 'Product',
    status: 'Active',
    usageCount: 45,
    lastModified: '2024-01-14',
    performance: '96%'
  },
  {
    id: 'TEMP-002',
    name: 'Seasonal Campaign Template',
    category: 'Campaign',
    status: 'Active',
    usageCount: 23,
    lastModified: '2024-01-13',
    performance: '89%'
  },
];

// Chart data generator
const getChartData = (selectedMetric: string, engineType: string, timeRange: string, dateRange?: DateRange) => {
  const baseData = [
    { day: 'Mon', planned: 120, achieved: 98 },
    { day: 'Tue', planned: 130, achieved: 142 },
    { day: 'Wed', planned: 140, achieved: 125 },
    { day: 'Thu', planned: 125, achieved: 138 },
    { day: 'Fri', planned: 150, achieved: 167 },
    { day: 'Sat', planned: 160, achieved: 155 },
    { day: 'Sun', planned: 145, achieved: 134 },
  ];

  return baseData.map(item => ({
    ...item,
    [selectedMetric]: item.achieved,
  }));
};

const getChartConfig = (selectedMetric: string) => ({
  [selectedMetric]: {
    label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
    color: "hsl(var(--chart-1))",
  },
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-2))",
  }
});

const createEngineConfigurationStory = (
  engineType: string,
  engineTitle: string,
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    subMetric: string;
    badgeValue: string;
    badgeVariant: 'success' | 'destructive' | 'secondary' | 'outline';
  }>
) => ({
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('rules');

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');

    // Selection states
    const [selectedRules, setSelectedRules] = useState<any[]>([]);
    const [selectedTemplates, setSelectedTemplates] = useState<any[]>([]);

    // One filter row, shared by the two lists.
    const filterBar = (      <FilterBar
        filters={[
          {
            name: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Paused", value: "paused" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ],
            selectedValues: statusFilter,
            onChange: setStatusFilter,
          },
          {
            name: "Priority",
            options: [
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ],
            selectedValues: priorityFilter,
            onChange: setPriorityFilter,
          },
        ]}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search configuration rules, templates..."
      />
    );

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: `${engineTitle} Configuration`,
          subtitle: `Manage ${engineType} engine configuration settings and rules`,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {/* The tab strip sits above the card, left, the way every campaign
              and booking page is built — the card is the open tab's body. */}
          <CardWithTabs
            className="w-full"
            tabs={[
              {
                value: 'rules',
                label: 'Configuration Rules',
                content: (
                  <div className="space-y-4 mt-6">
                    {filterBar}
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => (
                        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>
                          {row.status}
                        </Badge>
                      )},
                      { key: 'priority', header: 'Priority', render: row => (
                        <Badge variant={row.priority === 'High' ? 'destructive' : row.priority === 'Medium' ? 'secondary' : 'outline'}>
                          {row.priority}
                        </Badge>
                      )},
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'templates', header: 'Templates', render: row => (
                        <Badge variant="secondary">{row.templates}</Badge>
                      )},
                      { key: 'lastUpdated', header: 'Last Updated' },
                    ]}
                    data={configurationRulesData}
                    rowKey={row => `${row.id}-${row.name}`}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to rule details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedRules,
                      onChange: setSelectedRules,
                      getKey: row => `${row.id}-${row.name}`,
                    }}
                  />
                  </div>
                ),
              },
              {
                value: 'templates',
                label: 'Templates',
                content: (
                  <div className="space-y-4 mt-6">
                    {filterBar}
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'category', header: 'Category' },
                      { key: 'status', header: 'Status', render: row => (
                        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>
                          {row.status}
                        </Badge>
                      )},
                      { key: 'usageCount', header: 'Usage Count', render: row => (
                        <Badge variant="secondary">{row.usageCount}</Badge>
                      )},
                      { key: 'performance', header: 'Performance', render: row => (
                        <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                          {row.performance}
                        </Badge>
                      )},
                      { key: 'lastModified', header: 'Last Modified' },
                    ]}
                    data={configurationTemplatesData}
                    rowKey={row => row.id}
                    hideActions
                    rowClassName={() => 'cursor-pointer'}
                    onRowClick={row => {
                      console.log('Navigate to template details for', row.name);
                    }}
                    rowSelection={{
                      selectedKeys: selectedTemplates,
                      onChange: setSelectedTemplates,
                      getKey: row => row.id,
                    }}
                  />
                  </div>
                ),
              },
              {
                // The proposition's workflow — the retailer's board: which
                // steps, who approves, what is mandatory, deadlines, SLAs
                // and the actions Edge fires.
                value: 'workflow',
                label: 'Workflow',
                content: (
                  <div className="mt-6">
                  <WorkflowBuilder engine={engineType as EngineId} />
                  </div>
                ),
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
});

export const SponsoredProducts: Story = createEngineConfigurationStory(
  'sponsored-products',
  'Sponsored Products',
  [
    {
      id: 'configurations',
      label: 'Active Configurations',
      value: '24',
      subMetric: 'Rules: 18',
      badgeValue: '+3',
      badgeVariant: 'success' as const,
    },
    {
      id: 'rules',
      label: 'Configuration Rules',
      value: '18',
      subMetric: 'Templates: 12',
      badgeValue: '+2',
      badgeVariant: 'success' as const,
    },
    {
      id: 'performance',
      label: 'Config Performance',
      value: '94.2%',
      subMetric: 'Uptime: 99.8%',
      badgeValue: '+1.2%',
      badgeVariant: 'success' as const,
    },
    {
      id: 'updated',
      label: 'Last Updated',
      value: '2h ago',
      subMetric: 'Auto-sync: On',
      badgeValue: 'Live',
      badgeVariant: 'secondary' as const,
    },
  ]
);

export const Display: Story = createEngineConfigurationStory(
  'display',
  'Display',
  [
    {
      id: 'configurations',
      label: 'Active Configurations',
      value: '16',
      subMetric: 'Rules: 12',
      badgeValue: '+1',
      badgeVariant: 'success' as const,
    },
    {
      id: 'rules',
      label: 'Configuration Rules',
      value: '12',
      subMetric: 'Templates: 8',
      badgeValue: '+1',
      badgeVariant: 'success' as const,
    },
    {
      id: 'performance',
      label: 'Config Performance',
      value: '91.8%',
      subMetric: 'Uptime: 99.5%',
      badgeValue: '+0.8%',
      badgeVariant: 'success' as const,
    },
    {
      id: 'updated',
      label: 'Last Updated',
      value: '1h ago',
      subMetric: 'Auto-sync: On',
      badgeValue: 'Live',
      badgeVariant: 'secondary' as const,
    },
  ]
);

export const DigitalInstore: Story = createEngineConfigurationStory(
  'digital-instore',
  'Digital In-store',
  [
    {
      id: 'configurations',
      label: 'Active Configurations',
      value: '32',
      subMetric: 'Rules: 28',
      badgeValue: '+4',
      badgeVariant: 'success' as const,
    },
    {
      id: 'rules',
      label: 'Configuration Rules',
      value: '28',
      subMetric: 'Templates: 15',
      badgeValue: '+3',
      badgeVariant: 'success' as const,
    },
    {
      id: 'performance',
      label: 'Config Performance',
      value: '96.5%',
      subMetric: 'Uptime: 99.9%',
      badgeValue: '+2.1%',
      badgeVariant: 'success' as const,
    },
    {
      id: 'updated',
      label: 'Last Updated',
      value: '30m ago',
      subMetric: 'Auto-sync: On',
      badgeValue: 'Live',
      badgeVariant: 'secondary' as const,
    },
  ]
);

export const OfflineInstore: Story = createEngineConfigurationStory(
  'offline-instore',
  'Offline In-store',
  [
    {
      id: 'configurations',
      label: 'Active Configurations',
      value: '19',
      subMetric: 'Rules: 14',
      badgeValue: '+2',
      badgeVariant: 'success' as const,
    },
    {
      id: 'rules',
      label: 'Configuration Rules',
      value: '14',
      subMetric: 'Templates: 9',
      badgeValue: '+1',
      badgeVariant: 'success' as const,
    },
    {
      id: 'performance',
      label: 'Config Performance',
      value: '89.7%',
      subMetric: 'Uptime: 98.8%',
      badgeValue: '-0.3%',
      badgeVariant: 'destructive' as const,
    },
    {
      id: 'updated',
      label: 'Last Updated',
      value: '4h ago',
      subMetric: 'Auto-sync: On',
      badgeValue: 'Live',
      badgeVariant: 'secondary' as const,
    },
  ]
);