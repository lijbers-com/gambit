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
import { useDb, useRouteEntityId, workflowFor, walkSteps, type WorkflowScope } from '@/lib/db';
import { ArrowRight, GitBranch, Info, LayoutTemplate, Plus, ShieldCheck, SlidersHorizontal, Tag, Users, Zap } from 'lucide-react';
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

/**
 * Configuration rules: what the proposition does on its own. Each one is a
 * condition Edge watches and the effect it applies when it holds — the
 * retailer's standing decisions, written down once so nobody has to make
 * them per booking.
 */
const configurationRulesData = [
  {
    id: 'RULE-001', name: 'Product Category Targeting', status: 'Active', priority: 'High', lastUpdated: '2026-08-15', performance: '98%', templates: 3,
    owner: 'Yield Manager',
    summary: 'Keeps a booking on the category pages of the products it advertises.',
    when: 'A booking selects retail products and a category-page placement.',
    then: 'The placement is limited to the categories those products sit in; other categories are not served.',
    scope: 'Every booking on this proposition, unless a template turns it off.',
    why: 'Shoppers see the ad next to the product they came for; the retailer keeps category pages relevant. It also lifts click-through — the 98% is the share of impressions that landed in the right category.',
  },
  {
    id: 'RULE-002', name: 'Audience Segmentation', status: 'Active', priority: 'Medium', lastUpdated: '2026-08-12', performance: '94%', templates: 2,
    owner: 'Performance Analyst',
    summary: 'Splits delivery over the audience segments a booking targets.',
    when: 'A booking targets more than one audience segment.',
    then: 'Impressions are divided over the segments in proportion to their size, and a segment that stops converting is paused for the booking.',
    scope: 'Bookings with audience targeting; not applied to run-of-site bookings.',
    why: 'One large segment would otherwise take the whole budget. The 94% is how often the split held within 5% of the plan.',
  },
  {
    id: 'RULE-003', name: 'Budget Optimization', status: 'Paused', priority: 'Low', lastUpdated: '2026-08-10', performance: '87%', templates: 1,
    owner: 'Yield Manager',
    summary: 'Moves unspent budget from slow placements to the ones that deliver.',
    when: 'A booking is past 40% of its run time and a placement has spent under half its share.',
    then: 'The remaining budget of that placement is moved to the booking\'s best-performing placement, once a day, never more than 25% at a time.',
    scope: 'Auction bookings only; guaranteed bookings keep their fixed split.',
    why: 'Paused while the daily move is reviewed — it moved budget away from placements that were merely late to start. The 87% is the share of moves that improved the booking\'s ROAS.',
  },
];

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
    const engine = engineType as WorkflowScope;
    // The media plan sits above the propositions: it has a workflow, rules
    // and templates, but no positions to price and no buyers to list.
    const isPlan = engine === 'media-plan';
    const workflow = workflowFor(db, engine);
    const workflowSteps = workflow ? walkSteps(workflow) : [];
    const workflowStages = workflowSteps.filter((st) => st.kind === 'stage');
    const setupSteps = workflowSteps.filter((st) => !!st.setup);
    const activeRules = configurationRulesData.filter((r) => r.status === 'Active').length;
    const activeTemplates = configurationTemplatesData.filter((t) => t.status === 'Active').length;
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
            settings: 'Workflow and rules',
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
            <Card>
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    Configuration
                  </h3>
                  {workflow && (
                    <Badge variant={workflow.status === 'published' ? 'success' : 'outline'}>
                      Workflow {workflow.status === 'published' ? 'published' : 'draft'}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">The workflow its campaigns follow and the rules this proposition runs by.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <button type="button" onClick={() => go(settingsHref('rules'))} className="rounded-lg border border-border p-4 text-left transition-colors hover:bg-accent">
                    <span className="flex items-center gap-2 text-sm font-medium"><SlidersHorizontal className="h-4 w-4 text-muted-foreground" />Configuration rules</span>
                    <span className="mt-2 block text-2xl font-semibold tabular-nums">{activeRules}<span className="ml-1.5 text-sm font-normal text-muted-foreground">of {configurationRulesData.length} active</span></span>
                  </button>
                  <button type="button" onClick={() => go(settingsHref('workflow'))} className="rounded-lg border border-border p-4 text-left transition-colors hover:bg-accent">
                    <span className="flex items-center gap-2 text-sm font-medium"><GitBranch className="h-4 w-4 text-muted-foreground" />Workflow</span>
                    <span className="mt-2 block text-2xl font-semibold tabular-nums">{workflowStages.length}<span className="ml-1.5 text-sm font-normal text-muted-foreground">stages · {workflowSteps.length - workflowStages.length} steps</span></span>
                  </button>
                </div>
                {workflow && (
                  <ol className="mt-4 flex flex-wrap items-center gap-y-2">
                    {workflowStages.map((st, i) => (
                      <li key={st.id} className="flex items-center">
                        <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium" title={st.description}>{st.name}</span>
                        {i < workflowStages.length - 1 && <span className="mx-1 h-px w-4 bg-border" />}
                      </li>
                    ))}
                  </ol>
                )}
                {viewAll('Open configuration', () => go(settingsHref('workflow')))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <LayoutTemplate className="h-5 w-5 text-primary" />
                    Campaign templates
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{isPlan ? 'Preset media plans a user starts from; quick starts are offered in the wizard.' : 'Preset campaigns a user starts from; quick starts are offered in the wizard.'}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div><span className="block text-2xl font-semibold tabular-nums">{quickStarts.length}</span><span className="text-xs text-muted-foreground">quick starts</span></div>
                    <div><span className="block text-2xl font-semibold tabular-nums">{activeTemplates}</span><span className="text-xs text-muted-foreground">of {configurationTemplatesData.length} active</span></div>
                  </div>
                  <ul className="mt-3 flex-1 space-y-1 text-sm">
                    {configurationTemplatesData.slice(0, 4).map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate">{t.name}<span className="ml-1.5 text-xs text-muted-foreground">{t.presets}</span></span>
                        {t.quickStart ? <Badge variant="success">Quick start</Badge> : <Badge variant="outline">{t.status}</Badge>}
                      </li>
                    ))}
                  </ul>
                  {viewAll('Manage templates', () => go(`/configuration/${engineType}/templates`))}
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 text-primary" />
                    Users & organisations
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">Who works on this proposition.</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div><span className="block text-2xl font-semibold tabular-nums">{activeOrganisations.length}</span><span className="text-xs text-muted-foreground">organisations</span></div>
                    <div><span className="block text-2xl font-semibold tabular-nums">{advertiserUsers.length}</span><span className="text-xs text-muted-foreground">advertiser users</span></div>
                    <div><span className="block text-2xl font-semibold tabular-nums">{retailerUsers.length}</span><span className="text-xs text-muted-foreground">retailer users</span></div>
                  </div>
                  <ul className="mt-3 flex-1 space-y-1 text-sm">
                    {activeOrganisations.slice(0, 4).map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-2">
                        <span className="truncate">{a.name}</span>
                        <span className="text-xs text-muted-foreground">{a.brands.length} brand{a.brands.length === 1 ? '' : 's'}</span>
                      </li>
                    ))}
                  </ul>
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
                  <p className="mt-1 text-sm text-muted-foreground">Who may buy this proposition, and who never can.</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div><span className="block text-2xl font-semibold tabular-nums">{allowed.length}</span><span className="text-xs text-muted-foreground">allowed</span></div>
                    <div><span className="block text-2xl font-semibold tabular-nums">{blocked.length}</span><span className="text-xs text-muted-foreground">blocked</span></div>
                  </div>
                  <ul className="mt-3 flex-1 space-y-1 text-sm">
                    {listings.slice(0, 4).map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate">{l.name}<span className="ml-1.5 text-xs text-muted-foreground">{l.subject}</span></span>
                        <Badge variant={l.kind === 'allow' ? 'success' : 'destructive'}>{l.kind === 'allow' ? 'Allowed' : 'Blocked'}</Badge>
                      </li>
                    ))}
                  </ul>
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
                  <p className="mt-1 text-sm text-muted-foreground">{hasAuction ? 'Floor prices for auction, list prices when guaranteed.' : 'List prices — this proposition sells guaranteed only.'}</p>
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground">
                        <th className="pb-1 font-medium">Position</th>
                        {hasAuction && <th className="pb-1 text-right font-medium">Floor</th>}
                        <th className="pb-1 text-right font-medium">List</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricedPositions.slice(0, 5).map((pos) => (
                        <tr key={pos.id}>
                          <td className="truncate py-0.5 pr-2">{pos.name}</td>
                          {hasAuction && <td className="py-0.5 text-right tabular-nums">€{pos.floorPrice?.toFixed(2)}</td>}
                          <td className="py-0.5 text-right tabular-nums">€{pos.listPrice?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    <div className="grid gap-4 md:grid-cols-2">
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
                    <dl className="grid gap-4 rounded-xl border border-border p-5 sm:grid-cols-5">
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
                    onRowClick={row => go(`/configuration/${engineType}/rules/${row.id}`)}
                    rowSelection={{
                      selectedKeys: selectedRules,
                      onChange: setSelectedRules,
                      getKey: row => `${row.id}-${row.name}`,
                    }}
                  />
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