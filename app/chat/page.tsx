'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { AgentLanding } from '@/components/ui/agent-landing';
import { AgentChat } from '@/components/ui/agent-chat';
import { readAgentContext } from '@/lib/agent-context';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';

/**
 * The Campaign Agent page has two faces. A hand-off — “Ask the agent” on an
 * insight or recommendation, or a case tile on the landing, arriving with ?q
 * and a stashed context — opens the LIVE agent, fenced to that case. A
 * direct visit gets the landing: the case gallery plus a free prompt.
 */
function ChatPageBody({ q }: { q: string | null }) {
  // The stash lives in sessionStorage, which the server can't see — read it
  // after mount so the hydration render matches the server's.
  const [context, setContext] = React.useState<ReturnType<typeof readAgentContext>>(null);
  const [ready, setReady] = React.useState(false);
  // Re-read on every q change: a case tile stashes right before pushing the
  // new q, and that stash must win over whatever was read at mount.
  React.useEffect(() => {
    setContext(readAgentContext());
    setReady(true);
  }, [q]);

  if (q) {
    if (!ready) return null;
    return <AgentChat context={context} initialPrompt={q} className="h-full" />;
  }
  return <AgentLanding />;
}

function ChatPageFrame() {
  const { theme } = useTheme();
  const routes = getRoutesForTheme(theme);
  const params = useSearchParams();
  const q = params.get('q');

  return (
    <MenuContextProvider>
      <AppLayout
        fullHeightContent={!!q}
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => console.log('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Campaign Agent',
          subtitle: 'AI-powered conversational interface for campaign management',
          headerRight: null,
          onEdit: () => console.log('Edit clicked'),
          onExport: () => console.log('Export clicked'),
          onImport: () => console.log('Import clicked'),
          onSettings: () => console.log('Settings clicked'),
        }}
      >
        <ChatPageBody q={q} />
      </AppLayout>
    </MenuContextProvider>
  );
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={null}>
      <ChatPageFrame />
    </React.Suspense>
  );
}
