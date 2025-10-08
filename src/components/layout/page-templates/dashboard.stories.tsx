import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatInterface } from '@/components/ui/chat-interface';
import { defaultRoutes } from '../default-routes';
import { MenuContextProvider } from '@/contexts/menu-context';
import React from 'react';
import { MessageSquare } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Chat',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Chat Page Template

The Chat page template provides a conversational interface for AI-powered interactions. It offers a clean layout structure optimized for chat-based applications and messaging.

## Features

- **Full-screen layout**: Utilizes the entire viewport for maximum chat area
- **AppLayout integration**: Built on top of the AppLayout component with navigation and user management
- **Flexible content area**: Ready-to-use content container for chat interfaces and messaging components
- **Responsive design**: Adapts to different screen sizes seamlessly

## Usage

This template is ideal for:
- AI chat interfaces
- Customer support chat pages
- Conversational AI applications
- Messaging and communication tools

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



export const Chat: Story = {
  args: {
    routes: defaultRoutes,
    logo: { src: '/next.svg', alt: 'Logo', width: 40, height: 40 },
    user: { name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' },
    onLogout: () => alert('Logout clicked'),
    breadcrumbProps: { namespace: '' },
    pageHeaderProps: {
      title: 'AdGenie Chat',
      subtitle: 'AI-powered conversational interface for campaign management',
      headerRight: null,
      onEdit: () => alert('Edit clicked'),
      onExport: () => alert('Export clicked'),
      onImport: () => alert('Import clicked'),
      onSettings: () => alert('Settings clicked'),
    },
    children: <ChatInterface />,
  },
  render: (args) => (
    <MenuContextProvider>
      <AppLayout {...args} />
    </MenuContextProvider>
  ),
}; 