'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ChatInterface, Message } from '@/components/ui/chat-interface';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';

export default function KeywordSuggestionsChatPage() {
  const { theme } = useTheme();
  const routes = getRoutesForTheme(theme);

  // Initial messages for keyword suggestions chat
  const initialMessages: Message[] = [
    {
      id: 1,
      text: "Help me with suggested keywords",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: 2,
      text: "I'd be happy to help you generate targeted keyword suggestions! To provide the most relevant keywords, please select the retail products you'd like to target in your campaign:",
      isUser: false,
      timestamp: new Date(),
      showRetailProducts: true
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
          subtitle: 'Keyword research and optimization',
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
