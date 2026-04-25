import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardWithTabs } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { Copy } from 'lucide-react';
import * as React from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Configuration Details',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AppLayout>;

const TokenDetailContent = () => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [access, setAccess] = React.useState<'public' | 'all' | 'selected'>('public');
  const [perms, setPerms] = React.useState({
    repositories: false,
    account: true,
    digitalMediaInstore: false,
    sponsoredProducts: false,
    display: false,
    offsite: false,
  });

  const toggle = (key: keyof typeof perms) =>
    setPerms(p => ({ ...p, [key]: !p[key] }));

  const users = [
    { name: 'John Smith', role: 'Admin', organisation: 'Unilever' },
    { name: 'Sarah Johnson', role: 'Campaign Manager', organisation: 'Coca-Cola' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardWithTabs
          className="w-full"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          action={activeTab === 'details' ? <Button>Save</Button> : null}
          header={
            activeTab === 'details' ? (
              <div className="space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input defaultValue="Test token" placeholder="Enter token name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Token</label>
                    <div className="relative">
                      <Input defaultValue="ghp_1234567890abcdef" readOnly className="text-muted-foreground pr-10 font-mono text-xs" />
                      <button
                        onClick={() => navigator.clipboard?.writeText('ghp_1234567890abcdef')}
                        className="absolute right-2 inset-y-0 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy token"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Repository access</label>
                  <div className="flex gap-6">
                    {[
                      { value: 'public', label: 'Public (Read only)' },
                      { value: 'all', label: 'All repositories' },
                      { value: 'selected', label: 'Only selected repositories' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="access"
                          value={opt.value}
                          checked={access === opt.value}
                          onChange={() => setAccess(opt.value as typeof access)}
                          className="h-4 w-4 accent-primary"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Permissions</label>
                  <div className="border border-border rounded-lg divide-y divide-border">
                    {[
                      { key: 'repositories', label: 'Repositories', description: 'Full control of repositories' },
                      { key: 'account', label: 'Account', description: 'Manage account settings and users' },
                      { key: 'digitalMediaInstore', label: 'Digital media instore', description: 'Access digital in-store campaigns' },
                      { key: 'sponsoredProducts', label: 'Sponsored products', description: 'Manage sponsored product campaigns' },
                      { key: 'display', label: 'Display', description: 'Access display campaigns and creatives' },
                      { key: 'offsite', label: 'Offsite', description: 'Manage offsite campaigns' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <Checkbox
                          checked={perms[item.key as keyof typeof perms]}
                          onCheckedChange={() => toggle(item.key as keyof typeof perms)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null
          }
          tabs={[
            { label: 'Details', value: 'details', content: null },
          ]}
        />
      </div>

      {/* Right sidebar */}
      <div className="space-y-6 pt-14">
        <Card>
          <CardHeader><CardTitle>Used by</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.name}>
                  <p className="font-medium text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.organisation} · <Badge variant="outline" className="text-xs h-4">{u.role}</Badge></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const TokenDetail: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'Test token', subtitle: 'Settings', onSettings: () => alert('Settings clicked') }}>
          <TokenDetailContent />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
