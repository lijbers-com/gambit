import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardWithTabs } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { defaultRoutes } from '../default-routes';
import { MenuContextProvider } from '@/contexts/menu-context';
import React, { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Settings, Zap, Bell, Mail, MessageSquare, CheckCircle2, Sparkles, Table, Image, DollarSign, BarChart3 } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Notification Center',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Notification Center Page Template

The Notification Center page template provides a comprehensive timeline view of system notifications, campaign updates, and user actions. It features an organized chronological layout for tracking important events and status changes.

## Features

- **Timeline Layout**: Chronological display of activities with clear visual hierarchy
- **Status Indicators**: Color-coded badges and icons for different activity states
- **Activity Grouping**: Activities organized by time periods (Due in X days, Today, Yesterday, etc.)
- **Interactive Elements**: Clickable links for campaigns, creatives, and other entities
- **Expandable Content**: "Load more" functionality for extensive activity histories

## Usage

This template is ideal for:
- Activity and audit logs
- Campaign status tracking
- User action histories
- System notifications and updates
- Workflow status monitoring

## Components Used

- AppLayout (navigation, user management, breadcrumbs)
- Card (content containers)
- Badge (status indicators)
- Various Lucide icons for activity types
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Activity data with different types and statuses
const activitiesData = [
  {
    timeGroup: 'Due in 2 days',
    activities: [
      {
        id: 1,
        type: 'Incomplete',
        status: 'warning',
        description: 'Campaign "Spring Sale" is missing approved creatives or bookings and starts in 2 days.',
        entityName: 'Spring Sale',
        entityType: 'campaign',
        timestamp: null,
      }
    ]
  },
  {
    timeGroup: 'Today',
    activities: [
      {
        id: 2,
        type: 'AI Insight',
        status: 'info',
        description: 'Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.',
        entityName: 'Spring Sale',
        entityType: 'ai',
        timestamp: null,
      },
      {
        id: 3,
        type: 'Incomplete',
        status: 'warning',
        description: 'Campaign "Spring Sale" is missing approved creatives or bookings.',
        entityName: 'Spring Sale',
        entityType: 'campaign',
        timestamp: null,
      },
      {
        id: 4,
        type: 'Rejected',
        status: 'destructive',
        description: 'Creative "Banner_300x250_v2" was rejected during review.',
        entityName: 'Banner_300x250_v2',
        entityType: 'creative',
        timestamp: null,
      },
      {
        id: 5,
        type: 'AI Suggestion',
        status: 'success',
        description: 'Creative "Video_Ad_30s" performance exceeds benchmarks - consider increasing budget allocation.',
        entityName: 'Video_Ad_30s',
        entityType: 'ai',
        timestamp: null,
      }
    ]
  },
  {
    timeGroup: 'Yesterday',
    activities: [
      {
        id: 6,
        type: 'New',
        status: 'info',
        description: 'Campaign "Summer Deal" was submitted for approval.',
        entityName: 'Summer Deal',
        entityType: 'campaign',
        timestamp: null,
      },
      {
        id: 7,
        type: 'AI Alert',
        status: 'warning',
        description: 'Campaign "Black Friday" shows declining engagement - recommended to refresh creative assets.',
        entityName: 'Black Friday',
        entityType: 'ai',
        timestamp: null,
      }
    ]
  },
  {
    timeGroup: 'Monday',
    activities: [
      {
        id: 8,
        type: 'Rejected',
        status: 'destructive',
        description: 'Campaign "Summer Deal" was rejected.',
        entityName: 'Summer Deal',
        entityType: 'campaign',
        timestamp: null,
      },
      {
        id: 9,
        type: 'Approved',
        status: 'success',
        description: 'Creative "Banner_300x250_v2" has been approved and is ready for use.',
        entityName: 'Banner_300x250_v2',
        entityType: 'creative',
        timestamp: null,
      },
      {
        id: 10,
        type: 'AI Optimization',
        status: 'success',
        description: 'Campaign "Holiday Sale" auto-optimized bid strategy resulted in 15% cost reduction.',
        entityName: 'Holiday Sale',
        entityType: 'ai',
        timestamp: null,
      }
    ]
  },
  {
    timeGroup: 'Last week',
    activities: [
      {
        id: 8,
        type: 'Approved',
        status: 'success',
        description: 'Campaign "Summer Deal" has been approved.',
        entityName: 'Summer Deal',
        entityType: 'campaign',
        timestamp: null,
      },
      {
        id: 9,
        type: 'Approved',
        status: 'success',
        description: 'Creative "Banner_300x250_v2" has been approved and is ready for use.',
        entityName: 'Banner_300x250_v2',
        entityType: 'creative',
        timestamp: null,
      },
      {
        id: 10,
        type: 'Rejected',
        status: 'destructive',
        description: 'Campaign "Summer Deal" was rejected.',
        entityName: 'Summer Deal',
        entityType: 'campaign',
        timestamp: null,
      },
      {
        id: 11,
        type: 'Rejected',
        status: 'destructive',
        description: 'Creative "Banner_300x250_v2" was rejected during review.',
        entityName: 'Banner_300x250_v2',
        entityType: 'creative',
        timestamp: null,
      },
      {
        id: 12,
        type: 'Approved',
        status: 'success',
        description: 'Creative "Banner_300x250_v2" has been approved and is ready for use.',
        entityName: 'Banner_300x250_v2',
        entityType: 'creative',
        timestamp: null,
      }
    ]
  },
  {
    timeGroup: '2 weeks ago',
    activities: [
      {
        id: 13,
        type: 'New',
        status: 'info',
        description: 'Campaign "Black Friday Special" was created and submitted for approval.',
        entityName: 'Black Friday Special',
        entityType: 'campaign',
        timestamp: null,
      },
      {
        id: 14,
        type: 'Approved',
        status: 'success',
        description: 'Creative "Video_Ad_15s" has been approved for use.',
        entityName: 'Video_Ad_15s',
        entityType: 'creative',
        timestamp: null,
      },
      {
        id: 15,
        type: 'Incomplete',
        status: 'warning',
        description: 'Campaign "Holiday Sale" is missing targeting settings.',
        entityName: 'Holiday Sale',
        entityType: 'campaign',
        timestamp: null,
      }
    ]
  },
  {
    timeGroup: '3 weeks ago',
    activities: [
      {
        id: 16,
        type: 'Rejected',
        status: 'destructive',
        description: 'Creative "Banner_728x90" was rejected due to policy violations.',
        entityName: 'Banner_728x90',
        entityType: 'creative',
        timestamp: null,
      },
      {
        id: 17,
        type: 'New',
        status: 'info',
        description: 'Campaign "Winter Collection" was duplicated from template.',
        entityName: 'Winter Collection',
        entityType: 'campaign',
        timestamp: null,
      }
    ]
  },
  {
    timeGroup: 'Last month',
    activities: [
      {
        id: 18,
        type: 'Approved',
        status: 'success',
        description: 'Campaign "End of Season Sale" completed successfully.',
        entityName: 'End of Season Sale',
        entityType: 'campaign',
        timestamp: null,
      },
      {
        id: 19,
        type: 'New',
        status: 'info',
        description: 'Creative "Carousel_Ad_Mobile" was uploaded for review.',
        entityName: 'Carousel_Ad_Mobile',
        entityType: 'creative',
        timestamp: null,
      },
      {
        id: 20,
        type: 'Approved',
        status: 'success',
        description: 'Campaign "Back to School" achieved target impressions.',
        entityName: 'Back to School',
        entityType: 'campaign',
        timestamp: null,
      }
    ]
  }
];

const ActivityItem = ({ activity }: { activity: any }) => {
  const entityLabel = activity.entityType === 'creative' ? 'Creative' : 'Campaign';
  const descriptionParts = activity.description.split(`"${activity.entityName}"`);
  const beforeEntity = descriptionParts[0] || '';
  const afterEntity = descriptionParts[1] || '';

  return (
    <div className="flex-grow min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <Badge variant={activity.status as any} size="default">
          {activity.type}
        </Badge>
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        {beforeEntity}
        {entityLabel}{' '}
        <button className="text-primary underline underline-offset-4 font-medium">
          "{activity.entityName}"
        </button>
        {afterEntity}
      </p>
    </div>
  );
};

const NotificationCenterContent = () => {
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [campaignApprovals, setCampaignApprovals] = React.useState(true);
  const [creativeUpdates, setCreativeUpdates] = React.useState(true);
  const [budgetAlerts, setBudgetAlerts] = React.useState(false);
  const [performanceReports, setPerformanceReports] = React.useState(true);
  const [aiRecommendations, setAiRecommendations] = React.useState(true);


  // Notifications Tab Content
  const notificationsContent = (
    <div className="relative pl-12 pt-8 pb-8">
      {/* Vertical Timeline Line - starts from first timing badge */}
      <div className="absolute left-6 top-[30px] bottom-0 w-px bg-slate-300"></div>

      {/* Timeline Content */}
      <div className="space-y-6">
        {activitiesData.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            {/* Time Group Header */}
            <div className="relative flex items-center -ml-12">
              {/* Time label positioned on the left of timeline */}
              <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 mr-4 relative z-10">
                {group.timeGroup}
              </span>
            </div>

            {/* Activities */}
            {group.activities.map((activity) => {
              // Determine icon based on entity type
              const Icon = activity.entityType === 'ai' ? Sparkles :
                          activity.entityType === 'creative' ? Image : Table;
              return (
                <div key={activity.id} className="relative flex items-start -ml-12">
                  {/* Icon on the timeline */}
                  <div className="w-12 flex justify-center">
                    <div className="w-8 h-8 bg-white rounded-full border border-slate-300 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>

                  {/* Badge and text */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-start gap-3">
                      <Badge variant={activity.status as any} className="mt-0.5 flex-shrink-0 whitespace-nowrap min-w-0">
                        {activity.type}
                      </Badge>
                      <p className="text-sm text-foreground flex-1 min-w-0">
                        {activity.entityType === 'ai' ? (
                          <>
                            {activity.description.split(`"${activity.entityName}"`)[0]}
                            <button className="text-primary underline underline-offset-4 font-medium">
                              "{activity.entityName}"
                            </button>
                            {activity.description.split(`"${activity.entityName}"`)[1]}
                          </>
                        ) : (
                          <>
                            {activity.entityType === 'creative' ? 'Creative' : 'Campaign'}{' '}
                            <button className="text-primary underline underline-offset-4 font-medium">
                              "{activity.entityName}"
                            </button>
                            {' '}{activity.description.split(`"${activity.entityName}"`)[1]}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );

  // Settings Tab Content
  const settingsContent = (
    <div className="space-y-6 pt-4">
      {/* General Notification Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-600" />
              <div>
                <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-600" />
              <div>
                <Label htmlFor="push-notifications" className="text-base font-medium cursor-pointer">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Table className="w-5 h-5 text-slate-600" />
              <div>
                <Label htmlFor="campaign-approvals" className="text-base font-medium cursor-pointer">
                  Campaign Approvals
                </Label>
                <p className="text-sm text-muted-foreground">
                  Updates about campaign approval status
                </p>
              </div>
            </div>
            <Switch
              id="campaign-approvals"
              checked={campaignApprovals}
              onCheckedChange={setCampaignApprovals}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Image className="w-5 h-5 text-slate-600" />
              <div>
                <Label htmlFor="creative-updates" className="text-base font-medium cursor-pointer">
                  Creative Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notifications about creative reviews and changes
                </p>
              </div>
            </div>
            <Switch
              id="creative-updates"
              checked={creativeUpdates}
              onCheckedChange={setCreativeUpdates}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-slate-600" />
              <div>
                <Label htmlFor="budget-alerts" className="text-base font-medium cursor-pointer">
                  Budget Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alerts when campaigns reach budget thresholds
                </p>
              </div>
            </div>
            <Switch
              id="budget-alerts"
              checked={budgetAlerts}
              onCheckedChange={setBudgetAlerts}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              <div>
                <Label htmlFor="performance-reports" className="text-base font-medium cursor-pointer">
                  Performance Reports
                </Label>
                <p className="text-sm text-muted-foreground">
                  Regular updates on campaign performance
                </p>
              </div>
            </div>
            <Switch
              id="performance-reports"
              checked={performanceReports}
              onCheckedChange={setPerformanceReports}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-slate-600" />
              <div>
                <Label htmlFor="ai-recommendations" className="text-base font-medium cursor-pointer">
                  AI Recommendations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Smart suggestions for campaign optimization
                </p>
              </div>
            </div>
            <Switch
              id="ai-recommendations"
              checked={aiRecommendations}
              onCheckedChange={setAiRecommendations}
            />
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <CardWithTabs
      className="w-full"
      tabs={[
        {
          label: 'Notifications',
          value: 'notifications',
          content: notificationsContent,
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
    routes: defaultRoutes,
    logo: { src: '/next.svg', alt: 'Logo', width: 40, height: 40 },
    user: { name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' },
    onLogout: () => alert('Logout clicked'),
    breadcrumbProps: { namespace: '' },
    children: <NotificationCenterContent />,
  },
  render: (args) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date(), // Today
    });

    return (
      <MenuContextProvider>
        <AppLayout
          {...args}
          pageHeaderProps={{
            title: 'Notification Center',
            subtitle: 'Track campaign updates, approvals, and system events',
            headerRight: (
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="Select date range"
                showPresets={true}
              />
            ),
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        />
      </MenuContextProvider>
    );
  },
};