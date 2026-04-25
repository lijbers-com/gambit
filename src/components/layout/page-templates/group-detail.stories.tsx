import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { Building2, ShieldCheck } from 'lucide-react';
import * as React from 'react';

const InfoRow = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) => (
  <div className="p-4 border rounded-lg">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-foreground/70 shrink-0" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Configuration Details',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AppLayout>;

const members = [
  { id: 'USR-001', name: 'John Smith', email: 'john.smith@unilever.com', role: 'Admin' as const, status: 'Active' as const },
  { id: 'USR-002', name: 'Sarah Johnson', email: 's.johnson@coca-cola.com', role: 'Campaign Manager' as const, status: 'Active' as const },
  { id: 'USR-003', name: 'Michael van den Berg', email: 'm.vandenberg@fc.com', role: 'Viewer' as const, status: 'Active' as const },
  { id: 'USR-004', name: 'Emma Wilson', email: 'e.wilson@pg.com', role: 'Finance' as const, status: 'Inactive' as const },
];

const GroupDetailContent = () => {
  const [activeTab, setActiveTab] = React.useState('details');
  const [status, setStatus] = React.useState('active');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardWithTabs
          className="w-full"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          action={
            activeTab === 'details' ? <Button>Save</Button> :
            activeTab === 'members' ? <Button>Add member</Button> : null
          }
          header={
            activeTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input defaultValue="Sponsored products team" placeholder="Enter group name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Input dropdown options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]} value={status} onChange={setStatus} placeholder="Select status" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="flex border border-input rounded-md w-full p-2 text-sm min-h-[80px] bg-transparent shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Describe the purpose of this group" defaultValue="Team responsible for managing sponsored products campaigns and keyword strategies." />
                </div>
              </div>
            ) : null
          }
          tabs={[
            { label: 'Details', value: 'details', content: null },
            {
              label: 'Members',
              value: 'members',
              content: (
                <div className="mt-6">
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'email', header: 'Email' },
                      { key: 'role', header: 'Role', render: (row) => <Badge variant="outline">{row.role}</Badge> },
                      { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'default' : 'destructive'}>{row.status}</Badge> },
                    ]}
                    data={members}
                    rowKey={(row) => row.id}
                    onRowClick={(row) => alert(`Navigate to ${row.name}`)}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Right sidebar */}
      <div className="space-y-6 pt-14">
        <Card>
          <CardHeader><CardTitle>Organisation</CardTitle></CardHeader>
          <CardContent>
            <InfoRow icon={Building2} title="Unilever" subtitle="Advertiser · 3,000 users" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Permissions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Sponsored products', 'Campaign management', 'Reporting'].map((p) => (
                <InfoRow key={p} icon={ShieldCheck} title={p} subtitle="Enabled" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const GroupDetail: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    return (
      <MenuContextProvider>
        <AppLayout routes={routes} logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')} breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{ title: 'Sponsored products team', subtitle: 'Unilever · Active', onEdit: () => alert('Edit clicked'), onSettings: () => alert('Settings clicked') }}>
          <GroupDetailContent />
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
