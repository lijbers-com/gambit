'use client';

import { UserProfile } from '@/components/layout/page-templates/user-profile.stories';
import { MenuContextProvider } from '@/contexts/menu-context';
import React from 'react';

export default function UserDetailPage() {
  const UserProfileComponent = UserProfile.render as (args: any) => React.JSX.Element;

  if (!UserProfileComponent) {
    return <div>User Detail</div>;
  }

  return (
    <MenuContextProvider>
      <UserProfileComponent {...UserProfile.args} />
    </MenuContextProvider>
  );
}
