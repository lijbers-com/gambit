'use client';

import { NotificationCenter } from '@/components/layout/page-templates/notification-center.stories';
import { MenuContextProvider } from '@/contexts/menu-context';

export default function NotificationsPage() {
  // Get the render function from the story
  const NotificationComponent = NotificationCenter.render as (args: any) => React.JSX.Element;

  if (!NotificationComponent) {
    return <div>Notification Center Component</div>;
  }

  return (
    <MenuContextProvider>
      <NotificationComponent {...NotificationCenter.args} />
    </MenuContextProvider>
  );
}