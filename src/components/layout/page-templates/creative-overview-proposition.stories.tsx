import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import { PropositionIcon } from '@/components/ui/proposition-icon';
import { CreativePortal } from '@/components/ui/creative-portal';
import type { EngineId } from '@/lib/db';

/**
 * The per-proposition creative portal — the SAME portal, scoped to one
 * engine. One implementation; the engine pages are a filter, not a fork.
 */
const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Creative Overview (Proposition)',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const PortalPage: React.FC<{ engine: EngineId; title: string }> = ({ engine, title }) => {
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
          title,
          titleIcon: <PropositionIcon engineType={engine} />,
          subtitle: 'Creatives for this proposition — its templates carry the format logic',
          headerRight: null,
        }}
      >
        <CreativePortal engine={engine} />
      </AppLayout>
    </MenuContextProvider>
  );
};

export const Display: Story = {
  render: () => <PortalPage engine="display" title="Creatives — Display" />,
};

export const DigitalInStore: Story = {
  render: () => <PortalPage engine="digital-instore" title="Creatives — Digital in-store" />,
};

export const OfflineInStore: Story = {
  render: () => <PortalPage engine="offline-instore" title="Creatives — Offline in-store" />,
};

export const Offsite: Story = {
  render: () => <PortalPage engine="offsite" title="Creatives — Offsite" />,
};
