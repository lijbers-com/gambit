'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ChatInterface } from '@/components/ui/chat-interface';
import { defaultRoutes } from '@/components/layout/default-routes';
import { MenuContextProvider } from '@/contexts/menu-context';

export default function ChatPage() {
  return (
    <MenuContextProvider>
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => console.log('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'AdGenie Chat',
          subtitle: 'AI-powered conversational interface for campaign management',
          headerRight: null,
          onEdit: () => console.log('Edit clicked'),
          onExport: () => console.log('Export clicked'),
          onImport: () => console.log('Import clicked'),
          onSettings: () => console.log('Settings clicked'),
        }}
      >
        <ChatInterface />
      </AppLayout>
    </MenuContextProvider>
  );
}
