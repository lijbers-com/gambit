import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { FilterBar } from '@/components/ui/filter-bar';
import { WorkflowBuilder } from '@/components/ui/workflow-builder';
import { useDb, useInboxState, deriveMessages, workflowFor, walkSteps, type EngineId } from '@/lib/db';
import { Inbox } from '@/components/ui/inbox';
import { ArrowRight, Bell, GitBranch, LayoutTemplate, SlidersHorizontal } from 'lucide-react';
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

    // ── The dashboard widgets read the store: the proposition's workflow,
    //    and the open messages about this proposition. ──
    const db = useDb();
    const engine = engineType as EngineId;
    const workflow = workflowFor(db, engine);
    const workflowSteps = workflow ? walkSteps(workflow) : [];
    const workflowStages = workflowSteps.filter((st) => st.kind === 'stage');
    const setupSteps = workflowSteps.filter((st) => !!st.setup);
    const inboxStatus = useInboxState();
    const engineMessages = deriveMessages(db, { engine }).filter((m) => (inboxStatus[m.id] ?? 'unread') !== 'done');
    const engineInboxItems = engineMessages.slice(0, 4).map((m) => ({
      id: m.id, kind: m.kind, subject: m.subject, preview: m.preview,
      context: m.context, level: m.level, severity: m.severity,
    }));
    const activeRules = configurationRulesData.filter((r) => r.status === 'Active').length;
    const activeTemplates = configurationTemplatesData.filter((t) => t.status === 'Active').length;
    /** A widget's button opens its tab and brings the card into view. */
    const openTab = (tab: string) => {
      setActiveTab(tab);
      if (typeof document !== 'undefined') document.getElementById('config-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const viewAll = (label: string, onClick: () => void) => (
      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center justify-center gap-1 self-center text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {label}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    );

    // One filter row, shared by the two lists.
    const filterBar = (
      <FilterBar
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
          {/* The dashboard, in the home page's shape: widgets first, each
              one a door into the configuration behind it — the workflow the
              proposition follows, its rules and templates, and what is
              waiting on it. The tables and the board sit underneath. */}
          <section className="space-y-4">
            <Card>
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <GitBranch className="h-5 w-5 text-primary" />
                    Workflow
                  </h3>
                  {workflow && (
                    <Badge variant={workflow.status === 'published' ? 'success' : 'outline'}>
                      {workflow.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  )}
                </div>
                {workflow ? (
                  <>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {workflow.name} — {workflowStages.length} stages, {workflowSteps.length - workflowStages.length} steps between them, {setupSteps.length} of which are setup steps Edge ticks off from the data.
                    </p>
                    <ol className="mt-4 flex flex-wrap items-center gap-y-2">
                      {workflowStages.map((st, i) => (
                        <li key={st.id} className="flex items-center">
                          <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium" title={st.description}>
                            {st.name}
                          </span>
                          {i < workflowStages.length - 1 && <span className="mx-1 h-px w-4 bg-border" />}
                        </li>
                      ))}
                    </ol>
                    <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      {setupSteps.map((st) => (
                        <li key={st.id} className="rounded-md border border-border px-3 py-2">
                          <span className="block font-medium">{st.name}</span>
                          <span className="block text-xs text-muted-foreground">Setup · {st.owner}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">No workflow yet — open the board to draw one.</p>
                )}
                {viewAll('Open the workflow board', () => openTab('workflow'))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    Configuration rules
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">How this proposition targets, prioritises and spends.</p>
                  <p className="mt-4 text-3xl font-semibold tabular-nums">{activeRules}<span className="ml-2 text-sm font-normal text-muted-foreground">of {configurationRulesData.length} active</span></p>
                  <ul className="mt-3 flex-1 space-y-1 text-sm">
                    {configurationRulesData.slice(0, 3).map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-2">
                        <span className="truncate">{r.name}</span>
                        <Badge variant={r.status === 'Active' ? 'success' : 'secondary'}>{r.status}</Badge>
                      </li>
                    ))}
                  </ul>
                  {viewAll('Manage rules', () => openTab('rules'))}
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <LayoutTemplate className="h-5 w-5 text-primary" />
                    Templates
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">The shapes a booking or campaign starts from.</p>
                  <p className="mt-4 text-3xl font-semibold tabular-nums">{activeTemplates}<span className="ml-2 text-sm font-normal text-muted-foreground">of {configurationTemplatesData.length} active</span></p>
                  <ul className="mt-3 flex-1 space-y-1 text-sm">
                    {configurationTemplatesData.slice(0, 3).map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-2">
                        <span className="truncate">{t.name}</span>
                        <span className="text-xs text-muted-foreground">{t.category}</span>
                      </li>
                    ))}
                  </ul>
                  {viewAll('Manage templates', () => openTab('templates'))}
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Bell className={cn('h-5 w-5', engineMessages.length > 0 ? 'text-primary' : 'text-muted-foreground')} />
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <span className="text-sm text-muted-foreground">{engineMessages.length} open</span>
                  </div>
                  <Inbox
                    items={engineInboxItems}
                    status={inboxStatus}
                    showFilters={false}
                    emptyMessage="Nothing is waiting on this proposition."
                    onOpen={() => { if (typeof window !== 'undefined') window.location.href = '/notifications'; }}
                  />
                  {viewAll('View all notifications', () => { if (typeof window !== 'undefined') window.location.href = '/notifications'; })}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* The tab strip sits above the card, left, the way every campaign
              and booking page is built — the card is the open tab's body. */}
          <CardWithTabs
            id="config-tabs"
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

export const Offsite: Story = createEngineConfigurationStory(
  'offsite',
  'Offsite',
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