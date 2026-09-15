import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import { CreativePortal } from '@/components/ui/creative-portal';

/**
 * The creative portal — the home of every creative across engines, on the
 * database: real thumbnails (the builder's own preview at stamp size), a
 * working Add creative (proposition → template → builder), and approve /
 * reject that writes status through to the linked bookings.
 */
const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Creative Overview',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const CreativeOverview: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => console.log('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Creatives',
            subtitle: 'Every creative across propositions — build, review and link from one place',
            headerRight: null,
          }}
        >
          <CreativePortal />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
