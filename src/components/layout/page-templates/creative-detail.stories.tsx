import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import { PropositionIcon } from '@/components/ui/proposition-icon';
import { CreativeBuilder } from '@/components/ui/creative-builder';
import type { EngineId } from '@/lib/db';

/**
 * The creative builder page — one template per engine, all rendering the
 * shared CreativeBuilder: settings generated from the engine's template
 * schema on the left, the LIVE preview on the right. You see what you
 * change and know the effect.
 *
 * Sponsored products deliberately has no story: SP runs without creatives.
 */
const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Creative Detail',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const BuilderPage: React.FC<{ engine: EngineId; title: string }> = ({ engine, title }) => {
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
          headerRight: null,
        }}
      >
        <CreativeBuilder engine={engine} />
      </AppLayout>
    </MenuContextProvider>
  );
};

export const Display: Story = {
  render: () => <BuilderPage engine="display" title="Creative — Display" />,
};

export const DigitalInStore: Story = {
  render: () => <BuilderPage engine="digital-instore" title="Creative — Digital in-store" />,
};

export const OfflineInStore: Story = {
  render: () => <BuilderPage engine="offline-instore" title="Creative — Offline in-store" />,
};

export const Offsite: Story = {
  render: () => <BuilderPage engine="offsite" title="Creative — Offsite" />,
};
