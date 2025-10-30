import type { Meta, StoryObj } from '@storybook/react';
import { HeaderActions } from './header-actions';

const meta: Meta<typeof HeaderActions> = {
  title: 'UI/Header Actions',
  component: HeaderActions,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Header Actions

A component that displays icon buttons for quick access to key application areas: Notifications, Profile, and Organisation settings.

## Features

- **Icon-based Navigation**: Clean, icon-only buttons for minimal UI footprint
- **Notification Indicator**: Red dot badge on bell icon to show unread notifications
- **Hover States**: Subtle hover effects for better user feedback
- **Accessible**: Proper ARIA labels for screen readers
- **Router Integration**: Works with both Next.js router and custom Storybook router
- **Customizable**: Support for custom click handlers via props

## Usage

This component is typically placed in the top-right corner of the application header, on the same line as the breadcrumb navigation.

## Navigation Targets

- **Bell Icon**: Opens Notifications Center (/notifications)
- **User Icon**: Opens User Profile (/profile)
- **Building Icon**: Opens Organisation Settings (placeholder)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onNotificationsClick: { action: 'notifications clicked' },
    onProfileClick: { action: 'profile clicked' },
    onOrganisationClick: { action: 'organisation clicked' },
    hasUnreadNotifications: {
      control: 'boolean',
      description: 'Shows a red dot indicator when there are unread notifications',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hasUnreadNotifications: true,
  },
};

export const NoUnreadNotifications: Story = {
  args: {
    hasUnreadNotifications: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'HeaderActions without the red notification indicator.',
      },
    },
  },
};

export const WithCustomHandlers: Story = {
  args: {
    onNotificationsClick: () => console.log('Custom notifications handler'),
    onProfileClick: () => console.log('Custom profile handler'),
    onOrganisationClick: () => console.log('Custom organisation handler'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom click handlers instead of default routing behavior.',
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <span className="mx-2">/</span>
          <span>Campaigns</span>
        </div>
        <HeaderActions />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing the HeaderActions component in context with breadcrumb navigation.',
      },
    },
  },
};
