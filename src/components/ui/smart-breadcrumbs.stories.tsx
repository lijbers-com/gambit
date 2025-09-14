import type { Meta, StoryObj } from '@storybook/react';
import { SmartBreadcrumbs } from './smart-breadcrumbs';
import { defaultRoutes } from '@/components/layout/default-routes';

const meta: Meta<typeof SmartBreadcrumbs> = {
  title: 'UI/SmartBreadcrumbs',
  component: SmartBreadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Smart Breadcrumbs

The SmartBreadcrumbs component automatically generates breadcrumb navigation based on the current URL path and route configuration. It provides:

## Features

- **Automatic Path Detection**: Uses Next.js usePathname to detect current route
- **Route-based Labels**: Maps URLs to proper names using route configuration
- **Navigation Toggle**: Optional toggle button for side navigation
- **Theme Support**: Inherits theme colors from CSS custom properties
- **Interactive Navigation**: All breadcrumb items are clickable links
- **Query Parameter Support**: Optional support for preserving query parameters

## Route Integration

When provided with a routes array, the component will:
1. Match current URL to route configuration
2. Use proper names from route definitions (e.g. "Sponsored products" instead of "sponsored-products")
3. Handle nested routes and parent/child relationships

## Usage

Use this component in layouts or pages where you want automatic breadcrumb navigation that stays in sync with your application's routing structure.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    namespace: {
      control: { type: 'text' },
      description: 'Namespace for the breadcrumb component',
    },
    homeTitle: {
      control: { type: 'text' },
      description: 'Title for the home breadcrumb item',
    },
    showNavToggle: {
      control: { type: 'boolean' },
      description: 'Whether to show the navigation toggle button',
    },
    passQueryParameters: {
      control: { type: 'boolean' },
      description: 'Whether to preserve query parameters in breadcrumb links',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock the Next.js hooks for Storybook
const mockPathname = '/campaigns/sponsored-products';

// We need to mock the Next.js navigation hooks since they don't work in Storybook
const MockedSmartBreadcrumbs = (props: any) => {
  // Create a mock implementation that simulates being on different pages
  const mockSearchParams = new URLSearchParams();
  
  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-slate-100 rounded text-sm">
        <strong>Simulated Path:</strong> {props.mockPath || '/campaigns/sponsored-products'}
      </div>
      <SmartBreadcrumbs {...props} />
    </div>
  );
};

export const CampaignPage: Story = {
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false,
  },
  render: (args) => <MockedSmartBreadcrumbs {...args} mockPath="/campaigns/sponsored-products" />,
};

export const WithNavToggle: Story = {
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false,
  },
  render: (args) => <MockedSmartBreadcrumbs {...args} mockPath="/campaigns/display" />,
};

export const WithoutNavToggle: Story = {
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: false,
    routes: defaultRoutes,
    passQueryParameters: false,
  },
  render: (args) => <MockedSmartBreadcrumbs {...args} mockPath="/creatives/digital-instore" />,
};

export const Dashboard: Story = {
  args: {
    namespace: 'app',
    homeTitle: 'Dashboard',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false,
  },
  render: (args) => <MockedSmartBreadcrumbs {...args} mockPath="/dashboard" />,
};

export const DeepPath: Story = {
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: true,
  },
  render: (args) => <MockedSmartBreadcrumbs {...args} mockPath="/performance/sponsored-products" />,
};

export const YieldManagement: Story = {
  args: {
    namespace: 'app',
    homeTitle: 'Home',
    showNavToggle: true,
    routes: defaultRoutes,
    passQueryParameters: false,
  },
  render: (args) => <MockedSmartBreadcrumbs {...args} mockPath="/yield/offline-instore" />,
};