'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ChatInterface, Message } from '@/components/ui/chat-interface';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';

export default function NewCampaignChatPage() {
  const { theme } = useTheme();
  const routes = getRoutesForTheme(theme);

  // Initial messages for new campaign chat
  const initialMessages: Message[] = [
    {
      id: 1,
      text: "Create a new sponsored products campaign",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: 2,
      text: "Based on your requirements, I've generated 3 sponsored products campaign proposals with different optimization strategies. Each targets different goals and budget allocations:",
      isUser: false,
      timestamp: new Date(),
      showCampaigns: true
    }
  ];

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => console.log('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Campaign Agent',
          subtitle: 'Create and configure new campaigns',
          headerRight: null,
          onEdit: () => console.log('Edit clicked'),
          onExport: () => console.log('Export clicked'),
          onImport: () => console.log('Import clicked'),
          onSettings: () => console.log('Settings clicked'),
        }}
      >
        <ChatInterface initialMessages={initialMessages} />
      </AppLayout>
    </MenuContextProvider>
  );
}
