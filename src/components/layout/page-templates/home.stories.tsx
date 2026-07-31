import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { ImagePlus, LayoutList, BarChart3, ArrowRight, Sparkles, WalletCards, Plus } from 'lucide-react';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { useSession, useDb, useMyTasks, derivePlanHealth, type EngineId, type PlanStatus } from '@/lib/db';
import React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Home',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Home Page Template

The landing page after sign-in. It surfaces the tasks that matter for the
signed-in user's role and the latest product release notes.

## Structure

- **Your tasks** — a row of task widgets that differ per role/right. This
  template shows the **Ad operations / campaign manager** set: approving
  creatives, following up on bookings, and checking performance.
- **What's new** — a release-notes feed so users see recent changes.

The task widgets are data-driven (\`taskWidgets\`) so a different role can be
shown simply by swapping the widget set. Each widget carries a \`href\` used by
the app wrapper to navigate (e.g. the creatives widget deep-links into the
creative portal).
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Task widgets for the Ad operations / campaign manager role. A different
// role would surface a different set (e.g. finance → invoices, advertiser →
// campaign drafts). The `accent` widget is the primary call to action.
const taskWidgets = [
  {
    key: 'creatives',
    icon: ImagePlus,
    count: '4',
    title: 'Creatives need approval',
    description: 'Review and approve the creatives submitted to the creative portal.',
    cta: 'Review creatives',
    href: '/creatives',
    accent: true,
  },
  {
    key: 'bookings',
    icon: LayoutList,
    count: '7',
    title: 'Bookings in option',
    description: 'Confirm or release the bookings currently held in option.',
    cta: 'View bookings',
    href: '/campaigns',
    accent: false,
  },
  {
    key: 'insights',
    icon: BarChart3,
    count: '+6%',
    title: 'Performance is up',
    description: 'Campaign ROAS rose 6% this week. Dive into the latest insights.',
    cta: 'Open insights',
    href: '/insights',
    accent: false,
  },
];


// Release notes feed — newest first.
const releaseNotes = [
  {
    version: 'v1.6',
    date: 'June 2026',
    title: 'Stores & displays targeting',
    items: [
      'Separate store-list and display-list sections — target one inventory type at a time.',
      'Build lists at random, upload a custom one, or confirm targeting all available inventory.',
    ],
  },
  {
    version: 'v1.5',
    date: 'June 2026',
    title: 'Smarter date picker',
    items: [
      'Forward-looking range presets, defaulting to "Next week".',
      'Click a week number to select the whole week at once.',
    ],
  },
  {
    version: 'v1.4',
    date: 'May 2026',
    title: 'Unified creative overview',
    items: [
      'One overview for every creative across all propositions.',
      'Filter by status, type and format in a single place.',
    ],
  },
  {
    version: 'v1.3',
    date: 'May 2026',
    title: 'Richer booking summary',
    items: ['A comprehensive booking summary card, including the shared media plan details.'],
  },
];

export const Home: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    // Greet the logged-in prototype user (falls back for Storybook).
    const sessionUser = useSession();
    const firstName = (sessionUser?.name ?? 'Jane Doe').split(' ')[0];
    const roleBadge = sessionUser?.role ?? 'Ad operations';

    // ── Live data: role-scoped to-dos + plans that need attention ──────
    const db = useDb();
    const myTasks = useMyTasks();
    const creativeTaskCount = myTasks.filter((t) => t.id.endsWith('-creative') || t.id.endsWith('-approve')).length;
    const inOptionBookings = db.bookings.filter((b) => b.status === 'in-option').length;
    const liveTaskWidgets = [
      { ...taskWidgets[0], count: String(creativeTaskCount || taskWidgets[0].count) },
      { ...taskWidgets[1], count: String(inOptionBookings || taskWidgets[1].count) },
      taskWidgets[2],
    ];

    // Plans surfaced on home: derived health ≠ good (risk first), max two.
    const engineCard: Record<EngineId, { id: string; name: string }> = {
      'display': { id: 'display', name: 'Display' },
      'sponsored-products': { id: 'sponsored', name: 'Sponsored products' },
      'digital-instore': { id: 'digital', name: 'Digital in-store' },
      'offline-instore': { id: 'offline', name: 'Offline in-store' },
      'offsite': { id: 'offsite', name: 'Offsite' },
    };
    const engineStatus: Record<PlanStatus, 'new' | 'draft' | 'ready' | 'in-option' | 'running' | 'paused'> = {
      'draft': 'draft', 'in-option': 'in-option', 'running': 'running', 'paused': 'paused', 'completed': 'ready',
    };
    const attentionPlans = db.mediaPlans
      .filter((p) => p.status !== 'completed')
      .map((plan) => ({ plan, health: derivePlanHealth(db, plan) }))
      .filter(({ health }) => health.level !== 'good')
      .sort((a, b) => (a.health.level === 'risk' ? 0 : 1) - (b.health.level === 'risk' ? 0 : 1))
      .slice(0, 2)
      .map(({ plan }) => {
        const planCampaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
        const bookings = db.bookings.filter((b) => planCampaigns.some((c) => c.id === b.campaignId)).length;
        const spend = planCampaigns.reduce((s, c) => s + c.spend, 0);
        return {
          id: plan.id,
          title: plan.name,
          budget: plan.budget > 0 ? `€${plan.budget.toLocaleString()}` : '',
          usedBudget: spend > 0 ? `€${spend.toLocaleString()}` : '',
          budgetUsagePercentage: plan.budget > 0 ? Math.round((spend / plan.budget) * 100) : 0,
          bookings,
          badge: plan.status === 'running'
            ? { text: 'Running', variant: 'success' as const }
            : { text: plan.status === 'draft' ? 'Draft' : 'In-option', variant: 'outline' as const },
          engines: planCampaigns.map((c) => ({
            id: engineCard[c.engine].id,
            name: engineCard[c.engine].name,
            campaignName: c.name,
            status: engineStatus[c.status],
            enabled: true,
            budget: c.budget,
            spend: c.spend,
          })),
          dateRange: { from: new Date(plan.startDate), to: new Date(plan.endDate) },
        };
      });

    // A single-metric task widget (creatives / bookings / insights).
    const renderTaskWidget = (w: (typeof taskWidgets)[number]) => {
      const Icon = w.icon;
      return (
        <Card
          key={w.key}
          role="button"
          tabIndex={0}
          data-href={w.href}
          className={cn(
            'cursor-pointer transition-colors hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            w.accent && 'border-primary/30 bg-primary/[0.03]',
          )}
        >
          <CardContent className="flex h-full flex-col p-5">
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  w.accent ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-2xl font-semibold tabular-nums">{w.count}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{w.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{w.description}</p>
            <div className="mt-4 pt-1">
              <Button variant={w.accent ? 'default' : 'outline'} size="sm" data-href={w.href} className="gap-1.5">
                {w.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    };

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
          user={{ name: sessionUser?.name ?? 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: `Welcome back, ${firstName}`,
            subtitle: 'Your tasks and the latest updates',
            showOptionsMenu: false,
          }}
        >
          <div className="space-y-8">
            {/* Your tasks — role-scoped task widgets */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-lg font-semibold">Your tasks</h2>
                <Badge variant="secondary">{roleBadge}</Badge>
              </div>
              {/* Media plans — top row: two plans that need attention, each with
                  their recommendations rendered with the same OptimisationCard
                  used inside a media plan. */}
              <Card className="mb-4">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                      <WalletCards className="h-5 w-5" />
                    </div>
                    <Button size="sm" data-href="/create/media-experience" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      New media plan
                    </Button>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">Media plans</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Plans that need an action or are worth a closer look.</p>
                  <div className="mt-4 flex-1 space-y-4">
                    {attentionPlans.map((p) => (
                      <CampaignSummary
                        key={p.id}
                        layout="horizontal"
                        title={p.title}
                        goal=""
                        audience="retail-shoppers"
                        hideGoal
                        hideTargeting
                        hideAgent
                        hideEngineToggle
                        hideEngineActions
                        campaignId={p.id}
                        badge={p.badge}
                        collapsedOnly
                        estimatedRoas="—"
                        budget={p.budget}
                        usedBudget={p.usedBudget}
                        budgetUsagePercentage={p.budgetUsagePercentage}
                        bookings={p.bookings}
                        engines={p.engines}
                        dateRange={p.dateRange}
                        features={[]}
                        defaultExpanded={false}
                        className="w-full"
                      />
                    ))}
                  </div>
                  {/* View all — at the bottom of the widget, with the total count. */}
                  <button
                    type="button"
                    data-href="/campaigns"
                    className="mt-4 inline-flex items-center justify-center gap-1 self-center text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    View all {db.mediaPlans.length} media plans
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>

              {/* Task widgets — counts derive from the to-do engine + store */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {renderTaskWidget(liveTaskWidgets[0])}
                {renderTaskWidget(liveTaskWidgets[1])}
                {renderTaskWidget(liveTaskWidgets[2])}
              </div>
            </section>

            {/* What's new — release notes feed */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    What&apos;s new
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ol className="relative space-y-6 border-l border-border pl-6">
                    {releaseNotes.map((note) => (
                      <li key={note.version} className="relative">
                        <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{note.version}</Badge>
                          <span className="text-sm font-semibold">{note.title}</span>
                          <span className="text-xs text-muted-foreground">{note.date}</span>
                        </div>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                          {note.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </section>
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
