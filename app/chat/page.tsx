'use client';

import { Chat } from '@/components/layout/page-templates/dashboard.stories';
import { defaultRoutes } from '@/components/layout/default-routes';

export default function ChatPage() {
  // The Chat story expects args, so we need to pass them
  const chatArgs = {
    routes: defaultRoutes,
    logo: { src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 },
    user: { name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' },
    onLogout: () => console.log('Logout clicked'),
    breadcrumbProps: {},
    pageHeaderProps: {
      title: 'AdGenie Chat',
      subtitle: 'AI-powered conversational interface for campaign management',
      headerRight: null,
      onEdit: () => console.log('Edit clicked'),
      onExport: () => console.log('Export clicked'),
      onImport: () => console.log('Import clicked'),
      onSettings: () => console.log('Settings clicked'),
    },
    children: null, // The Chat story provides its own children
  };

  const Component = Chat.render;

  if (!Component) {
    return <div>Chat Interface</div>;
  }

  return <Component {...chatArgs} />;
}
