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
import { ImagePlus, LayoutList, BarChart3, ArrowRight, Sparkles, WalletCards, TrendingUp } from 'lucide-react';
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

// Media plans surfaced inside a single widget — one needs an action, one is
// running and its result is worth a look. Each routes to its own destination.
const mediaPlans = [
  {
    key: 'summer-launch',
    icon: WalletCards,
    name: 'Summer Launch',
    status: 'Needs approval',
    tone: 'amber' as const,
    detail: 'Waiting for your sign-off before it can go live.',
    cta: 'Review plan',
    href: '/campaigns',
  },
  {
    key: 'holiday-sale',
    icon: TrendingUp,
    name: 'Holiday Sale',
    status: 'Running',
    tone: 'green' as const,
    detail: 'Live at 4.6× ROAS — 18% above target.',
    cta: 'See insight',
    href: '/insights',
  },
];

const planToneClasses: Record<'amber' | 'green', string> = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  green: 'bg-green-100 text-green-800 border-green-200',
};

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
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Welcome back, Jane',
            subtitle: 'Your tasks and the latest updates',
            showOptionsMenu: false,
          }}
        >
          <div className="space-y-8">
            {/* Your tasks — role-scoped task widgets */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-lg font-semibold">Your tasks</h2>
                <Badge variant="secondary">Ad operations</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Creatives — primary action */}
                {renderTaskWidget(taskWidgets[0])}

                {/* Media plans — one widget holding two plan examples */}
                <Card className="md:col-span-2">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                        <WalletCards className="h-5 w-5" />
                      </div>
                      <button
                        type="button"
                        data-href="/campaigns"
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        View all
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">Media plans</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Plans that need an action or are worth a closer look.</p>
                    <div className="mt-4 grid flex-1 gap-2 sm:grid-cols-2">
                      {mediaPlans.map((p) => {
                        const PlanIcon = p.icon;
                        return (
                          <div
                            key={p.key}
                            role="button"
                            tabIndex={0}
                            data-href={p.href}
                            className="flex cursor-pointer flex-col rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <div className="flex min-w-0 items-center gap-1.5">
                              <PlanIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span className="truncate text-sm font-medium">{p.name}</span>
                            </div>
                            <span className={cn('mt-1.5 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', planToneClasses[p.tone])}>
                              {p.status}
                            </span>
                            <p className="mt-1.5 text-xs text-muted-foreground">{p.detail}</p>
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                              {p.cta}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Bookings + Insights */}
                {renderTaskWidget(taskWidgets[1])}
                {renderTaskWidget(taskWidgets[2])}
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
