'use client';

import { Chat } from '@/components/layout/page-templates/dashboard.stories';

export default function ChatPage() {
  const Component = Chat.render || (() => <div>Chat Interface</div>);
  return <Component />;
}
