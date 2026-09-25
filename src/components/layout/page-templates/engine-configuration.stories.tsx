import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard, CardWithTabs, BarHorizontalDetail, DonutLegendDetail } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { WorkflowBuilder } from '@/components/ui/workflow-builder';
import { useDb, useRouteEntityId, workflowFor, walkSteps, stepsByStage, type WorkflowScope } from '@/lib/db';
import { ArrowRight, GitBranch, Info, LayoutTemplate, Plus, ShieldCheck, SlidersHorizontal, Tag, Users, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';

import { CONFIGURATION_RULES as configurationRulesData } from '@/lib/configuration-rules';

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

/**
 * Templates are preset campaigns: a name, a shape (budget, run time,
 * placements, targeting) a user starts from instead of a blank wizard. A
 * quick start is a template the wizard offers up front.
 */
const configurationTemplatesData = [
  { id: 'TEMP-001', name: 'Standard product push',   presets: '4 weeks · €5,000 · category pages · products on offer', category: 'Product',  status: 'Active', quickStart: true,  usageCount: 45, lastModified: '2026-08-14', performance: '96%' },
  { id: 'TEMP-002', name: 'Seasonal moment',         presets: '2 weeks · €8,000 · homepage + category · retail moment', category: 'Campaign', status: 'Active', quickStart: true,  usageCount: 23, lastModified: '2026-08-02', performance: '89%' },
  { id: 'TEMP-003', name: 'New product launch',      presets: '6 weeks · €12,000 · all placements · awareness first', category: 'Campaign', status: 'Active', quickStart: false, usageCount: 9,  lastModified: '2026-07-20', performance: '91%' },
  { id: 'TEMP-004', name: 'Always-on brand',         presets: '12 weeks · €20,000 · homepage rail · frequency capped', category: 'Brand',    status: 'Draft',  quickStart: false, usageCount: 0,  lastModified: '2026-09-10', performance: '—' },
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

const createEngineConfigurationStories = (
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
): { dashboard: Story; settings: Story; lists: Story; pricing: Story; templates: Story; rule: Story } => {
  const render = (view: 'dashboard' | 'settings' | 'lists' | 'pricing' | 'templates' | 'rule') => () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    // The settings page opens on the tab a dashboard widget asked for.
    const [activeTab, setActiveTab] = useState('workflow');
    // Read after mount: the server renders without a query string, and the
    // hydrated tree has to match it before the tab can change.
    React.useEffect(() => {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab) setActiveTab(tab);
    }, []);

    // ── The dashboard widgets read the store: the proposition's workflow,
    //    and the open messages about this proposition. ──
    const db = useDb();
    const engine = engineType as WorkflowScope;
    // The media plan sits above the propositions: it has a workflow, rules
    // and templates, but no positions to price and no buyers to list.
    const isPlan = engine === 'media-plan';
    const workflow = workflowFor(db, engine);
    const workflowSteps = workflow ? walkSteps(workflow) : [];
    const workflowStages = workflowSteps.filter((st) => st.kind === 'stage');
    const quickStarts = configurationTemplatesData.filter((t) => t.quickStart);
    // Who works on this proposition: the retailer's own people, and the
    // advertiser organisations with a campaign on it.
    const retailerUsers = db.users.filter((u) => u.side === 'retailer');
    const activeAdvertiserIds = new Set(
      isPlan ? db.mediaPlans.map((p) => p.advertiserId) : db.campaigns.filter((c) => c.engine === engine).map((c) => db.mediaPlans.find((p) => p.id === c.mediaPlanId)?.advertiserId).filter(Boolean),
    );
    const activeOrganisations = db.advertisers.filter((a) => activeAdvertiserIds.has(a.id));
    const advertiserUsers = db.users.filter((u) => u.side === 'advertiser' && u.advertiserId && activeAdvertiserIds.has(u.advertiserId));
    // Who may and may not buy it.
    const listings = db.listings.filter((l) => l.engine === engine);
    const allowed = listings.filter((l) => l.kind === 'allow');
    const blocked = listings.filter((l) => l.kind === 'block');
    // What its positions cost: a floor for auctions, a list price when guaranteed.
    const engineProductIds = new Set(db.mediaProducts.filter((m) => m.engine === engine).map((m) => m.id));
    const pricedPositions = db.positions
      .filter((pos) => engineProductIds.has(pos.mediaProductId))
      .map((pos) => ({ ...pos, product: db.mediaProducts.find((m) => m.id === pos.mediaProductId)?.name ?? '' }));
    const hasAuction = ['sponsored-products', 'display', 'digital-instore'].includes(engine);
    const settingsHref = (tab: string) => `/configuration/${engineType}/settings?tab=${tab}`;
    // The dashboard's rows: steps per stage, and users per organisation
    // with the retailer's own people as the last row.
    const stageRows = workflow
      ? stepsByStage(workflow).map(({ stage: st, steps: inStage }) => {
          const rules = inStage.filter((x) => x.actions.some((a) => a.type === 'rule')).length;
          return { id: st.id, stage: st.name, steps: inStage.length - rules, rules };
        })
      : [];
    const organisationRows: Array<{ id: string; name: string; brands: number | null; users: number }> = [
      ...activeOrganisations.map((a) => ({ id: a.id, name: a.name, brands: a.brands.length, users: advertiserUsers.filter((u) => u.advertiserId === a.id).length })),
      { id: 'retailer', name: 'Retailer', brands: null, users: retailerUsers.length },
    ];
    // The rule this page is about, from the route; the first one in Storybook.
    const routeRuleId = useRouteEntityId();
    const rule = configurationRulesData.find((r) => r.id === routeRuleId) ?? configurationRulesData[0];
    const ruleTemplates = configurationTemplatesData.slice(0, rule.templates);
    const ruleHistory = [
      { id: 'h1', when: rule.lastUpdated, who: rule.owner, what: rule.status === 'Paused' ? 'Paused the rule for review' : 'Raised the priority' },
      { id: 'h2', when: '2026-06-02', who: 'Campaign Builder', what: `Added to the "${ruleTemplates[0]?.name ?? 'Standard product push'}" template` },
      { id: 'h3', when: '2026-03-18', who: rule.owner, what: 'Created the rule' },
    ];
    const go = (href: string) => { if (typeof window !== 'undefined') window.location.href = href; };
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

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: {
            dashboard: `${engineTitle} Configuration`,
            settings: `${engineTitle} configuration settings`,
            templates: `${engineTitle} campaign templates`,
            rule: rule.name,
            lists: `${engineTitle} allow & block lists`,
            pricing: `${engineTitle} position pricing`,
          }[view],
          subtitle: {
            dashboard: isPlan ? 'How media plans are set up, reviewed and run' : `Manage ${engineType} engine configuration settings and rules`,
            settings: 'The workflow its campaigns follow — its rules run as checks on the board',
            templates: 'Preset campaigns a user starts from — quick starts are offered in the wizard',
            rule: `${engineTitle} configuration rule · ${rule.id}`,
            lists: 'Who may buy this proposition, and who never can',
            pricing: 'Floor prices for auction, list prices when guaranteed',
          }[view],
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <div className="space-y-6">
          {view === 'dashboard' && (
          <>
          {/* The dashboard, in the home page's shape: widgets first, each one
              a door into the page behind it — the configuration (rules,
              templates, workflow), who works on the proposition, who may buy
              it, and what its positions cost. */}
          <section className="space-y-4">
            {/* The workflow: the one place this proposition is configured.
                Its rules are checks on the board, so they are read there. */}
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
                <p className="mt-1 text-sm text-muted-foreground">The stages its campaigns go through, the steps in each, and the rules that run as checks along the way.</p>
                {workflow && (
                  <div className="mt-4 flex flex-1 flex-col justify-center">
                    <BarHorizontalDetail
                      productData={stageRows.map((r) => ({ name: r.rules ? `${r.stage} · ${r.rules} rule${r.rules === 1 ? '' : 's'}` : r.stage, value: r.steps + r.rules }))}
                      totalRow={{ label: 'Steps', value: stageRows.reduce((n, r) => n + r.steps + r.rules, 0) }}
                    />
                  </div>
                )}
                {viewAll('Open the workflow', () => go(settingsHref('workflow')))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-row lg:grid-cols-2">
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <LayoutTemplate className="h-5 w-5 text-primary" />
                    Campaign templates
                  </h3>
                  <div className="mt-4">
                    <Table
                      columns={[
                        { key: 'name', header: 'Template', className: 'font-medium' },
                        { key: 'presets', header: 'Presets', render: (t) => <span className="block max-w-[160px] truncate text-muted-foreground">{t.presets}</span> },
                        { key: 'status', header: 'Status', render: (t) => (t.quickStart ? <Badge variant="success">Quick start</Badge> : <Badge variant="outline">{t.status}</Badge>) },
                      ]}
                      data={configurationTemplatesData}
                      rowKey={(t) => t.id}
                      onRowClick={() => go(`/configuration/${engineType}/templates`)}
                      hideActions
                      hideRefreshedAt
                    />
                  </div>
                  {viewAll('Manage templates', () => go(`/configuration/${engineType}/templates`))}
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 text-primary" />
                    Users & organisations
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{activeOrganisations.length} organisations · {activeOrganisations.reduce((n, a) => n + a.brands.length, 0)} brands</p>
                  <div className="mt-4 flex flex-1 flex-col justify-center">
                    <DonutLegendDetail
                      donutData={organisationRows.map((r) => ({ name: r.name, value: r.users }))}
                      totalRow={{ label: 'Users', value: organisationRows.reduce((n, r) => n + r.users, 0) }}
                    />
                  </div>
                  {viewAll('Manage users & organisations', () => go('/configuration/organisations-users'))}
                </CardContent>
              </Card>
              {!isPlan && (
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Allow & block lists
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">Allowed: {allowed.map((l) => l.name).join(', ') || 'nobody by name'} · Blocked: {blocked.map((l) => l.name).join(', ') || 'nothing'}</p>
                  <div className="mt-4 flex flex-1 flex-col justify-center">
                    <DonutLegendDetail
                      donutData={[{ name: 'Allowed', value: allowed.length }, { name: 'Blocked', value: blocked.length }]}
                      totalRow={{ label: 'Lists', value: listings.length }}
                    />
                  </div>
                  {viewAll('Manage lists', () => go(`/configuration/${engineType}/lists`))}
                </CardContent>
              </Card>
              )}
              {!isPlan && (
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Tag className="h-5 w-5 text-primary" />
                    Position pricing
                  </h3>
                  <div className="mt-4">
                    <Table
                      columns={[
                        { key: 'name', header: 'Position', className: 'font-medium' },
                        ...(hasAuction ? [{ key: 'floorPrice', header: 'Floor', render: (pos: typeof pricedPositions[number]) => `€${pos.floorPrice?.toFixed(2)}` }] : []),
                        { key: 'listPrice', header: 'List', render: (pos) => `€${pos.listPrice?.toLocaleString()}` },
                      ]}
                      data={pricedPositions.slice(0, 5)}
                      rowKey={(pos) => pos.id}
                      onRowClick={() => go(`/configuration/${engineType}/pricing`)}
                      hideActions
                      hideRefreshedAt
                    />
                  </div>
                  {viewAll(`All ${pricedPositions.length} positions`, () => go(`/configuration/${engineType}/pricing`))}
                </CardContent>
              </Card>
              )}
            </div>
          </section>
          </>
          )}

          {/* The settings page: the tab strip above the card, left, the way
              every campaign and booking page is built. */}
          {/* Each widget has a page of its own: the lists, split into who
              may buy and who never can; the positions with their prices. */}
          {view === 'lists' && (
          <CardWithTabs
            className="w-full"
            tabs={[
              {
                value: 'allow',
                label: `Allowed (${allowed.length})`,
                content: (
                  <div className="mt-6">
                    <Table
                      columns={[
                        { key: 'name', header: 'Name' },
                        { key: 'subject', header: 'What', render: (row) => <span className="capitalize">{row.subject}</span> },
                        { key: 'kind', header: 'List', render: (row) => <Badge variant={row.kind === 'allow' ? 'success' : 'destructive'}>{row.kind === 'allow' ? 'Allowed' : 'Blocked'}</Badge> },
                        { key: 'reason', header: 'Reason' },
                        { key: 'addedAt', header: 'Since' },
                      ]}
                      data={allowed}
                      rowKey={(row) => row.id}
                      hideActions
                    />
                  </div>
                ),
              },
              {
                value: 'block',
                label: `Blocked (${blocked.length})`,
                content: (
                  <div className="mt-6">
                    <Table
                      columns={[
                        { key: 'name', header: 'Name' },
                        { key: 'subject', header: 'What', render: (row) => <span className="capitalize">{row.subject}</span> },
                        { key: 'kind', header: 'List', render: (row) => <Badge variant={row.kind === 'allow' ? 'success' : 'destructive'}>{row.kind === 'allow' ? 'Allowed' : 'Blocked'}</Badge> },
                        { key: 'reason', header: 'Reason' },
                        { key: 'addedAt', header: 'Since' },
                      ]}
                      data={blocked}
                      rowKey={(row) => row.id}
                      hideActions
                    />
                  </div>
                ),
              },
            ]}
            action={<Button className="gap-1.5"><Plus className="h-4 w-4" />Add to a list</Button>}
            activeTab={activeTab === 'block' ? 'block' : 'allow'}
            onTabChange={setActiveTab}
          />
          )}

          {view === 'rule' && (
          <CardWithTabs
            className="w-full"
            tabs={[
              {
                value: 'what',
                label: 'What it does',
                content: (
                  <div className="mt-6 space-y-6">
                    <p className="max-w-3xl text-base">{rule.summary}</p>
                    <div className="grid gap-row md:grid-cols-2">
                      <div className="rounded-xl border border-border p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="h-4 w-4 text-primary" />When</div>
                        <p className="mt-2 text-sm text-muted-foreground">{rule.when}</p>
                      </div>
                      <div className="rounded-xl border border-border p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold"><ArrowRight className="h-4 w-4 text-primary" />Then</div>
                        <p className="mt-2 text-sm text-muted-foreground">{rule.then}</p>
                      </div>
                      <div className="rounded-xl border border-border p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4 text-primary" />Applies to</div>
                        <p className="mt-2 text-sm text-muted-foreground">{rule.scope}</p>
                      </div>
                      <div className="rounded-xl border border-border p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold"><Info className="h-4 w-4 text-primary" />Why it exists</div>
                        <p className="mt-2 text-sm text-muted-foreground">{rule.why}</p>
                      </div>
                    </div>
                    <dl className="grid gap-row rounded-xl border border-border p-5 sm:grid-cols-5">
                      <div><dt className="text-xs text-muted-foreground">Status</dt><dd className="mt-1"><Badge variant={rule.status === 'Active' ? 'success' : 'secondary'}>{rule.status}</Badge></dd></div>
                      <div><dt className="text-xs text-muted-foreground">Priority</dt><dd className="mt-1"><Badge variant={rule.priority === 'High' ? 'destructive' : rule.priority === 'Medium' ? 'secondary' : 'outline'}>{rule.priority}</Badge></dd></div>
                      <div><dt className="text-xs text-muted-foreground">Performance</dt><dd className="mt-1 text-sm font-medium tabular-nums">{rule.performance}</dd></div>
                      <div><dt className="text-xs text-muted-foreground">Owner</dt><dd className="mt-1 text-sm">{rule.owner}</dd></div>
                      <div><dt className="text-xs text-muted-foreground">Last updated</dt><dd className="mt-1 text-sm tabular-nums">{rule.lastUpdated}</dd></div>
                    </dl>
                  </div>
                ),
              },
              {
                value: 'templates',
                label: `Templates (${ruleTemplates.length})`,
                content: (
                  <div className="mt-6">
                    <p className="mb-4 text-sm text-muted-foreground">The templates that switch this rule on for the campaigns they start.</p>
                    <Table
                      columns={[
                        { key: 'name', header: 'Template' },
                        { key: 'presets', header: 'What it presets' },
                        { key: 'quickStart', header: 'Quick start', render: (row) => (row.quickStart ? <Badge variant="success">In the wizard</Badge> : <span className="text-muted-foreground">—</span>) },
                        { key: 'usageCount', header: 'Uses' },
                      ]}
                      data={ruleTemplates}
                      rowKey={(row) => row.id}
                      hideActions
                      rowClassName={() => 'cursor-pointer'}
                      onRowClick={() => go(`/configuration/${engineType}/templates`)}
                    />
                  </div>
                ),
              },
              {
                value: 'history',
                label: 'History',
                content: (
                  <div className="mt-6">
                    <Table
                      columns={[
                        { key: 'when', header: 'When' },
                        { key: 'who', header: 'Who' },
                        { key: 'what', header: 'What changed' },
                      ]}
                      data={ruleHistory}
                      rowKey={(row) => row.id}
                      hideActions
                    />
                  </div>
                ),
              },
            ]}
            action={
              <div className="flex items-center gap-2">
                <Button variant="outline">{rule.status === 'Paused' ? 'Resume rule' : 'Pause rule'}</Button>
                <Button>Edit rule</Button>
              </div>
            }
            activeTab={['what', 'templates', 'history'].includes(activeTab) ? activeTab : 'what'}
            onTabChange={setActiveTab}
          />
          )}

          {view === 'templates' && (
          <CardWithTabs
            className="w-full"
            tabs={[
              {
                value: 'quick',
                label: `Quick starts (${quickStarts.length})`,
                content: (
                  <div className="mt-6">
                    <Table
                      columns={[
                        { key: 'name', header: 'Template' },
                        { key: 'presets', header: 'What it presets' },
                        { key: 'quickStart', header: 'Quick start', render: (row) => (row.quickStart ? <Badge variant="success">In the wizard</Badge> : <span className="text-muted-foreground">—</span>) },
                        { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge> },
                        { key: 'usageCount', header: 'Uses' },
                        { key: 'performance', header: 'Performance' },
                        { key: 'lastModified', header: 'Last modified' },
                      ]}
                      data={quickStarts}
                      rowKey={(row) => row.id}
                      hideActions
                    />
                  </div>
                ),
              },
              {
                value: 'all',
                label: `All templates (${configurationTemplatesData.length})`,
                content: (
                  <div className="mt-6">
                    <Table
                      columns={[
                        { key: 'name', header: 'Template' },
                        { key: 'presets', header: 'What it presets' },
                        { key: 'quickStart', header: 'Quick start', render: (row) => (row.quickStart ? <Badge variant="success">In the wizard</Badge> : <span className="text-muted-foreground">—</span>) },
                        { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge> },
                        { key: 'usageCount', header: 'Uses' },
                        { key: 'performance', header: 'Performance' },
                        { key: 'lastModified', header: 'Last modified' },
                      ]}
                      data={configurationTemplatesData}
                      rowKey={(row) => row.id}
                      hideActions
                    />
                  </div>
                ),
              },
            ]}
            action={<Button className="gap-1.5"><Plus className="h-4 w-4" />New template</Button>}
            activeTab={activeTab === 'all' ? 'all' : 'quick'}
            onTabChange={setActiveTab}
          />
          )}

          {view === 'pricing' && (
          <CardWithTabs
            className="w-full"
            tabs={[
              {
                value: 'positions',
                label: `Positions (${pricedPositions.length})`,
                content: (
                  <div className="mt-6">
                    <Table
                      columns={[
                        { key: 'name', header: 'Position' },
                        { key: 'product', header: 'Media product' },
                        { key: 'format', header: 'Format', render: (row) => row.format ?? '—' },
                        { key: 'dailyCapacity', header: 'Slots / day' },
                        ...(hasAuction ? [{ key: 'floorPrice', header: 'Floor price (auction, CPM)', render: (row: typeof pricedPositions[number]) => `€${row.floorPrice?.toFixed(2)}` }] : []),
                        { key: 'listPrice', header: 'List price (guaranteed, per day)', render: (row) => `€${row.listPrice?.toLocaleString()}` },
                      ]}
                      data={pricedPositions}
                      rowKey={(row) => row.id}
                      hideActions
                    />
                  </div>
                ),
              },
            ]}
            activeTab="positions"
          />
          )}

          {view === 'settings' && (
          <CardWithTabs
            id="config-tabs"
            className="w-full"
            tabs={[
              {
                // The proposition's workflow — the retailer's board: which
                // steps, who approves, what is mandatory, deadlines, SLAs
                // and the actions Edge fires.
                value: 'workflow',
                label: 'Workflow',
                content: (
                  <div className="mt-6">
                  <WorkflowBuilder engine={engine} />
                  </div>
                ),
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          )}
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  };
  return { dashboard: { render: render('dashboard') }, settings: { render: render('settings') }, lists: { render: render('lists') }, pricing: { render: render('pricing') }, templates: { render: render('templates') }, rule: { render: render('rule') } };
};

const mediaPlanStories = createEngineConfigurationStories(
  'media-plan',
  'Media plan',
  [
    { id: 'configurations', label: 'Active Configurations', value: '6', subMetric: 'Rules: 3', badgeValue: '+1', badgeVariant: 'success' as const },
    { id: 'rules', label: 'Configuration Rules', value: '3', subMetric: 'Templates: 4', badgeValue: '+1', badgeVariant: 'success' as const },
    { id: 'performance', label: 'Config Performance', value: '95.1%', subMetric: 'Uptime: 99.9%', badgeValue: '+0.8%', badgeVariant: 'success' as const },
    { id: 'updated', label: 'Last Updated', value: '1h ago', subMetric: 'Auto-sync: On', badgeValue: 'Live', badgeVariant: 'secondary' as const },
  ]
);
export const MediaPlan: Story = mediaPlanStories.dashboard;
export const MediaPlanSettings: Story = mediaPlanStories.settings;
export const MediaPlanTemplates: Story = mediaPlanStories.templates;
export const MediaPlanRule: Story = mediaPlanStories.rule;

const sponsoredProductsStories = createEngineConfigurationStories(
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
export const SponsoredProducts: Story = sponsoredProductsStories.dashboard;
export const SponsoredProductsSettings: Story = sponsoredProductsStories.settings;
export const SponsoredProductsLists: Story = sponsoredProductsStories.lists;
export const SponsoredProductsPricing: Story = sponsoredProductsStories.pricing;
export const SponsoredProductsTemplates: Story = sponsoredProductsStories.templates;
export const SponsoredProductsRule: Story = sponsoredProductsStories.rule;

const displayStories = createEngineConfigurationStories(
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
export const Display: Story = displayStories.dashboard;
export const DisplaySettings: Story = displayStories.settings;
export const DisplayLists: Story = displayStories.lists;
export const DisplayPricing: Story = displayStories.pricing;
export const DisplayTemplates: Story = displayStories.templates;
export const DisplayRule: Story = displayStories.rule;

const digitalInstoreStories = createEngineConfigurationStories(
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
export const DigitalInstore: Story = digitalInstoreStories.dashboard;
export const DigitalInstoreSettings: Story = digitalInstoreStories.settings;
export const DigitalInstoreLists: Story = digitalInstoreStories.lists;
export const DigitalInstorePricing: Story = digitalInstoreStories.pricing;
export const DigitalInstoreTemplates: Story = digitalInstoreStories.templates;
export const DigitalInstoreRule: Story = digitalInstoreStories.rule;

const offlineInstoreStories = createEngineConfigurationStories(
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
export const OfflineInstore: Story = offlineInstoreStories.dashboard;
export const OfflineInstoreSettings: Story = offlineInstoreStories.settings;
export const OfflineInstoreLists: Story = offlineInstoreStories.lists;
export const OfflineInstorePricing: Story = offlineInstoreStories.pricing;
export const OfflineInstoreTemplates: Story = offlineInstoreStories.templates;
export const OfflineInstoreRule: Story = offlineInstoreStories.rule;

const offsiteStories = createEngineConfigurationStories(
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
export const Offsite: Story = offsiteStories.dashboard;
export const OffsiteSettings: Story = offsiteStories.settings;
export const OffsiteLists: Story = offsiteStories.lists;
export const OffsitePricing: Story = offsiteStories.pricing;
export const OffsiteTemplates: Story = offsiteStories.templates;
export const OffsiteRule: Story = offsiteStories.rule;