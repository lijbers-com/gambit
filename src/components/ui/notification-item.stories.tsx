import type { Meta, StoryObj } from '@storybook/react';
import { NotificationItem } from './notification-item';

const meta: Meta<typeof NotificationItem> = {
  title: 'UI/NotificationItem',
  component: NotificationItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Notification Item Component

A reusable notification component that displays AI insights, alerts, opportunities, and other notifications with consistent styling and interactive elements.

## Features

- **Multiple Types**: AI Insight, Budget Alert, Opportunity, Warning, Info
- **Icon Integration**: Each type has a dedicated Lucide icon
- **Badge Variants**: Color-coded badges for quick identification
- **Interactive Links**: Clickable links within notification text
- **Action Button**: Icon button for primary actions
- **Hover Effects**: Smooth transitions on hover

## Notification Types

### AI Insight
Blue badge with MessageSquare icon - Used for AI-powered recommendations and insights

### Budget Alert
Yellow/orange badge with AlertCircle icon - Used for budget-related warnings

### Opportunity
Green badge with TrendingUp icon - Used for potential revenue opportunities

### Warning
Red badge with AlertCircle icon - Used for critical alerts

### Info
Gray badge with Lightbulb icon - Used for informational messages

## Usage

\`\`\`tsx
import { NotificationItem } from '@/components/ui/notification-item';

<NotificationItem
  type="ai-insight"
  message='Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.'
  linkText='"Spring Sale"'
  onLinkClick={() => console.log('Navigate to campaign')}
  onActionClick={() => console.log('Open chat')}
/>
\`\`\`

## Props

- **type**: 'ai-insight' | 'budget-alert' | 'opportunity' | 'warning' | 'info'
- **message**: The notification text content
- **linkText**: Optional text to make clickable within the message
- **onLinkClick**: Callback when the link is clicked
- **onActionClick**: Callback when the icon button is clicked
- **className**: Optional additional CSS classes
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['ai-insight', 'budget-alert', 'opportunity', 'warning', 'info'],
      description: 'Type of notification',
    },
    message: {
      control: 'text',
      description: 'The notification message text',
    },
    linkText: {
      control: 'text',
      description: 'Text within message to make clickable',
    },
    onLinkClick: {
      action: 'link-clicked',
      description: 'Callback when link is clicked',
    },
    onActionClick: {
      action: 'action-clicked',
      description: 'Callback when icon button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AIInsight: Story = {
  args: {
    type: 'ai-insight',
    message: 'Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.',
    linkText: '"Spring Sale"',
    onLinkClick: () => console.log('Navigate to Spring Sale campaign'),
    onActionClick: () => console.log('Open AI chat'),
  },
};

export const AIInsightCreative: Story = {
  args: {
    type: 'ai-insight',
    message: 'Creative "Banner_Summer_v2" shows 34% higher engagement in evening time slots.',
    linkText: '"Banner_Summer_v2"',
    onLinkClick: () => console.log('Navigate to creative'),
    onActionClick: () => console.log('Open AI chat'),
  },
};

export const BudgetAlert: Story = {
  args: {
    type: 'budget-alert',
    message: 'Campaign "Summer Sale" budget recommendation. Opportunity: $12.5K potential lost revenue.',
    linkText: '"Summer Sale"',
    onLinkClick: () => console.log('Navigate to campaign'),
    onActionClick: () => console.log('View budget details'),
  },
};

export const Opportunity: Story = {
  args: {
    type: 'opportunity',
    message: 'Product "Premium Coffee Beans" has 45% higher conversion rate when shown in morning hours.',
    linkText: '"Premium Coffee Beans"',
    onLinkClick: () => console.log('Navigate to product'),
    onActionClick: () => console.log('View opportunity'),
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Campaign "Black Friday" is approaching budget limit. Only 8% remaining.',
    linkText: '"Black Friday"',
    onLinkClick: () => console.log('Navigate to campaign'),
    onActionClick: () => console.log('View warning details'),
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    message: 'New targeting options are now available for Display campaigns. Update your settings to take advantage.',
    onActionClick: () => console.log('View info'),
  },
};

export const WithoutLink: Story = {
  args: {
    type: 'ai-insight',
    message: 'Your campaigns are performing 15% better than industry average this week.',
    onActionClick: () => console.log('View details'),
  },
};

export const LongMessage: Story = {
  args: {
    type: 'opportunity',
    message: 'Based on historical data and current market trends, campaign "Holiday Season 2024" could see a 35% increase in ROI by adjusting the bidding strategy and expanding to premium ad placements during peak shopping hours.',
    linkText: '"Holiday Season 2024"',
    onLinkClick: () => console.log('Navigate to campaign'),
    onActionClick: () => console.log('View opportunity'),
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4 w-[600px]">
      <NotificationItem
        type="ai-insight"
        message='Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.'
        linkText='"Spring Sale"'
        onLinkClick={() => console.log('Navigate to campaign')}
        onActionClick={() => console.log('Open AI chat')}
      />
      <NotificationItem
        type="budget-alert"
        message='Campaign "Summer Sale" budget recommendation. Opportunity: $12.5K potential lost revenue.'
        linkText='"Summer Sale"'
        onLinkClick={() => console.log('Navigate to campaign')}
        onActionClick={() => console.log('View budget details')}
      />
      <NotificationItem
        type="opportunity"
        message='Product "Premium Coffee Beans" has 45% higher conversion rate when shown in morning hours.'
        linkText='"Premium Coffee Beans"'
        onLinkClick={() => console.log('Navigate to product')}
        onActionClick={() => console.log('View opportunity')}
      />
      <NotificationItem
        type="warning"
        message='Campaign "Black Friday" is approaching budget limit. Only 8% remaining.'
        linkText='"Black Friday"'
        onLinkClick={() => console.log('Navigate to campaign')}
        onActionClick={() => console.log('View warning details')}
      />
      <NotificationItem
        type="info"
        message="New targeting options are now available for Display campaigns. Update your settings to take advantage."
        onActionClick={() => console.log('View info')}
      />
    </div>
  ),
};
