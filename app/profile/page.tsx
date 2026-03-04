'use client';

import { UserProfile } from '@/components/layout/page-templates/user-profile.stories';
import { MenuContextProvider } from '@/contexts/menu-context';

export default function ProfilePage() {
  const UserProfileComponent = UserProfile.render as (args: any) => React.JSX.Element;

  if (!UserProfileComponent) {
    return <div>User Profile</div>;
  }

  return (
    <MenuContextProvider>
      <UserProfileComponent {...UserProfile.args} />
    </MenuContextProvider>
  );
}
