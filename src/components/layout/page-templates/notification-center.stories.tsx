import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { InboxPanel } from '@/components/ui/inbox-panel';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import React, { useState } from 'react';
import { Bell, Mail, Sparkles, Table, Image, DollarSign, BarChart3 } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Inbox',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Inbox Page Template

The user's single list of everything needing their attention, across every media
plan, campaign and booking they are responsible for.

## How it works

Messages are **derived from the data, never stored**. A message exists exactly as
long as the condition behind it is true: upload the missing creative and the
message is gone, without anyone marking it off. That is why the inbox can never
drift out of sync with the pages it links to.

Four kinds, deliberately no more:

- **Health** — a media plan is at risk or needs attention
- **Action needed** — something blocks delivery (missing creative, no placement)
- **Recommendation** — an optimisation worth taking (rebalance budget, raise caps)
- **Insight** — an observation about how the plan is performing

## Inbox behaviour

- An **unread dot** marks messages the user hasn't opened yet
- Opening a message marks it read; **Mark as done** files it under Done
- Filters: **To do**, **Unread**, **Done**
- Messages are **scoped by role** — a user only sees what they can act on

The same component (\`InboxPanel\`) renders the Inbox tab on the media-plan,
campaign, booking and proposition pages, scoped to that entity.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** One row of the Settings tab — a switch with a label and an explanation. */
const SettingRow = ({
  id, icon: Icon, title, description, checked, onCheckedChange,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <Label htmlFor={id} className="cursor-pointer text-base font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

const InboxContent = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [campaignApprovals, setCampaignApprovals] = useState(true);
  const [creativeUpdates, setCreativeUpdates] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [performanceReports, setPerformanceReports] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(true);

  const settingsContent = (
    <div className="space-y-6 pt-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Delivery</h3>
        <div className="space-y-4">
          <SettingRow
            id="email-notifications" icon={Mail}
            title="Email" description="Send these messages to my email as well"
            checked={emailNotifications} onCheckedChange={setEmailNotifications}
          />
          <SettingRow
            id="push-notifications" icon={Bell}
            title="Browser push" description="Notify me in the browser when something needs action"
            checked={pushNotifications} onCheckedChange={setPushNotifications}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">What I want to hear about</h3>
        <div className="space-y-4">
          <SettingRow
            id="campaign-approvals" icon={Table}
            title="Approvals" description="Campaigns and bookings waiting on a decision"
            checked={campaignApprovals} onCheckedChange={setCampaignApprovals}
          />
          <SettingRow
            id="creative-updates" icon={Image}
            title="Creatives" description="Missing, submitted and rejected creatives"
            checked={creativeUpdates} onCheckedChange={setCreativeUpdates}
          />
          <SettingRow
            id="budget-alerts" icon={DollarSign}
            title="Budget and pacing" description="Plans spending too fast, or leaving budget unspent"
            checked={budgetAlerts} onCheckedChange={setBudgetAlerts}
          />
          <SettingRow
            id="performance-reports" icon={BarChart3}
            title="Insights" description="Observations about how a plan is performing"
            checked={performanceReports} onCheckedChange={setPerformanceReports}
          />
          <SettingRow
            id="ai-recommendations" icon={Sparkles}
            title="Recommendations" description="Optimisations the Campaign Agent suggests"
            checked={aiRecommendations} onCheckedChange={setAiRecommendations}
          />
        </div>
      </div>
    </div>
  );

  return (
    <CardWithTabs
      className="w-full"
      tabs={[
        {
          // Scoped to the signed-in user: only messages their role can act on.
          label: 'Messages',
          value: 'messages',
          content: <InboxPanel scope="user" className="pt-6" />,
        },
        {
          label: 'Settings',
          value: 'settings',
          content: settingsContent,
        },
      ]}
    />
  );
};

export const NotificationCenter: Story = {
  args: {
    routes: defaultRoutes, // overridden in render
    logo: { src: '/next.svg', alt: 'Logo', width: 40, height: 40 },
    user: { name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' },
    onLogout: () => alert('Logout clicked'),
    breadcrumbProps: { namespace: '' },
    children: <InboxContent />,
  },
  render: (args) => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');

    return (
      <MenuContextProvider>
        <AppLayout
          {...args}
          routes={routes}
          pageHeaderProps={{
            title: 'Inbox',
            subtitle: 'Everything that needs your attention, across your media plans',
            // No date range: messages have no timestamp — one exists exactly as
            // long as the condition behind it is true.
            headerRight: null,
          }}
        />
      </MenuContextProvider>
    );
  },
};
