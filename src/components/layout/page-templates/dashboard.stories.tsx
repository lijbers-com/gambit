import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { defaultRoutes } from '../default-routes';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Dashboard',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Dashboard Page Template

The Dashboard page template serves as the main landing page for the application. It provides a basic layout structure that can be customized with various content areas.

## Features

- **Full-screen layout**: Utilizes the entire viewport for maximum content area
- **AppLayout integration**: Built on top of the AppLayout component with navigation and user management
- **Flexible content area**: Ready-to-use content container for dashboard widgets and cards
- **Responsive design**: Adapts to different screen sizes seamlessly

## Usage

This template is ideal for:
- Application dashboard/home pages
- Overview pages with multiple content sections
- Landing pages with summary information
- Main navigation hubs

## Components Used

- AppLayout (navigation, user management, breadcrumbs)
- Card (content containers)
- CardHeader, CardTitle, CardDescription (content structure)
- CardContent (main content area)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


export const Dashboard: Story = {
  args: {
    routes: defaultRoutes,
    logo: { src: '/next.svg', alt: 'Logo', width: 40, height: 40 },
    user: { name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' },
    onLogout: () => alert('Logout clicked'),
    breadcrumbProps: {},
    pageHeaderProps: {
      title: 'Offline media in-store',
      subtitle: 'Manage your offline media campaigns and performance',
      onEdit: () => alert('Edit clicked'),
      onExport: () => alert('Export clicked'),
      onImport: () => alert('Import clicked'),
      onSettings: () => alert('Settings clicked'),
    },
    children: (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Page Content Area</CardTitle>
          <CardDescription>
            This is where your page content will go.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Content area ready for your components */}
        </CardContent>
      </Card>
    ),
  },
}; 