import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardWithTabs } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table } from '@/components/ui/table';
import { FilterBar } from '@/components/ui/filter-bar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { MenuContextProvider } from '@/contexts/menu-context';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Building2,
  ChevronDown,
  MoreVertical,
  Info,
  KeyRound,
  Smartphone,
  Link2,
  ShieldCheck,
} from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/User Profile',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# User Profile Page Template

The User Profile page template provides a comprehensive user management interface with tabbed navigation for account settings, permissions, and access logs.

## Features

- **Details Tab**: Editable First Name and Last Name fields with Save button, read-only Email (with verification badge) and ID, account enabled/disabled toggle
- **Permissions Tab**: Campaign permissions with company selector and brand-level toggles, plus roles table with proposition assignments
- **Logs Tab**: Login/access log table with filters, access details including last login, lockout status, and credential management

## Layout

Tabbed interface using CardWithTabs component with three tabs:
- **Details**: User settings form
- **Permissions**: Campaign permissions and role assignments
- **Logs**: Access logs and credential management

## Components Used

- AppLayout (navigation, user management, breadcrumbs)
- CardWithTabs (tabbed interface)
- Card (sidebar content containers)
- Input (editable form fields)
- Badge (status indicators)
- Switch (permission toggles)
- Table (log entries)
- FilterBar (log filtering)
- Dialog (confirmation modals for credential resets)
- Button (actions)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const brandPermissions = [
  { name: 'All', sponsoredProducts: false, display: false, isAll: true },
  { name: 'ABC', sponsoredProducts: false, display: false },
  { name: 'Arm & Hammer', sponsoredProducts: true, display: false },
  { name: 'Hakubaku', sponsoredProducts: false, display: false },
  { name: 'Mae Ploy', sponsoredProducts: false, display: false },
  { name: 'TaoKaeNoi', sponsoredProducts: false, display: false },
];

const roles = [
  { role: 'Account Manager', proposition: 'General' },
  { role: 'Finance', proposition: 'AdCRM' },
  { role: 'Campaigner', proposition: 'Digital media instore' },
  { role: 'Booking Manager', proposition: 'Digital media instore' },
  { role: 'Admin', proposition: 'Digital media instore' },
  { role: 'Tech-ops', proposition: 'Digital media instore' },
  { role: 'Creative and Ad Master', proposition: 'Display' },
  { role: 'Creative Approver', proposition: 'Display' },
  { role: 'Admin', proposition: 'Display' },
  { role: 'Viewer', proposition: 'Display' },
  { role: 'Admin', proposition: 'Offline media instore' },
  { role: 'Calendar Events Manager', proposition: 'Offline media instore' },
  { role: 'Account Manager', proposition: 'Offline media instore' },
  { role: 'Project Manager', proposition: 'Offline media instore' },
  { role: 'Reach Manager', proposition: 'Offline media instore' },
  { role: 'Proposition Developer', proposition: 'Offline media instore' },
  { role: 'Admin', proposition: 'Sponsored products' },
];

const mfaDevices = [
  { name: 'iPhone 15 Pro' },
  { name: 'YubiKey 5 NFC' },
];

const loginLogData = [
  { id: 'LOG-001', timestamp: '2026-02-28T14:32:00', action: 'Login', status: 'Success', ipAddress: '192.168.1.45', browser: 'Chrome 122', location: 'Amsterdam, NL' },
  { id: 'LOG-002', timestamp: '2026-02-27T09:15:00', action: 'Login', status: 'Success', ipAddress: '192.168.1.45', browser: 'Chrome 122', location: 'Amsterdam, NL' },
  { id: 'LOG-003', timestamp: '2026-02-26T16:45:00', action: 'Login', status: 'Failed', ipAddress: '10.0.0.12', browser: 'Firefox 123', location: 'Rotterdam, NL' },
  { id: 'LOG-004', timestamp: '2026-02-26T16:44:00', action: 'Login', status: 'Failed', ipAddress: '10.0.0.12', browser: 'Firefox 123', location: 'Rotterdam, NL' },
  { id: 'LOG-005', timestamp: '2026-02-25T08:30:00', action: 'Login', status: 'Success', ipAddress: '192.168.1.45', browser: 'Chrome 122', location: 'Amsterdam, NL' },
  { id: 'LOG-006', timestamp: '2026-02-24T11:20:00', action: 'Password Reset', status: 'Success', ipAddress: '192.168.1.45', browser: 'Chrome 122', location: 'Amsterdam, NL' },
  { id: 'LOG-007', timestamp: '2026-02-23T13:50:00', action: 'Login', status: 'Success', ipAddress: '172.16.0.5', browser: 'Safari 17', location: 'Utrecht, NL' },
  { id: 'LOG-008', timestamp: '2026-02-22T10:10:00', action: 'MFA Setup', status: 'Success', ipAddress: '192.168.1.45', browser: 'Chrome 122', location: 'Amsterdam, NL' },
  { id: 'LOG-009', timestamp: '2026-02-21T15:30:00', action: 'Login', status: 'Success', ipAddress: '192.168.1.45', browser: 'Chrome 122', location: 'Amsterdam, NL' },
  { id: 'LOG-010', timestamp: '2026-02-20T09:00:00', action: 'Login', status: 'Failed', ipAddress: '203.0.113.50', browser: 'Unknown', location: 'Unknown' },
];

// Confirmation dialog component for credential resets
const ResetConfirmDialog = ({
  trigger,
  title,
  description,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Reusable info row component for credential items and organisation details
const InfoRow = ({
  icon: Icon,
  title,
  subtitle,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className={cn('p-4 border rounded-lg', children ? 'space-y-3' : '')}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-foreground/70" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const UserProfileContent = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Smith');
  const [email] = useState('john.smith@ah.nl');
  const [userId] = useState('2d6f2e20-b482-4b1f-8944-0b4544c60ffe');
  const [isEnabled, setIsEnabled] = useState(true);
  const [permissions, setPermissions] = useState(brandPermissions);
  const [selectedCompany] = useState('Kai Tak Company B.V.');
  const [activeTab, setActiveTab] = useState('details');
  const [logStatusFilter, setLogStatusFilter] = useState<string[]>([]);
  const [logActionFilter, setLogActionFilter] = useState<string[]>([]);

  const togglePermission = (index: number, field: 'sponsoredProducts' | 'display') => {
    setPermissions(prev =>
      prev.map((p, i) => (i === index ? { ...p, [field]: !p[field] } : p))
    );
  };

  const filteredLogs = loginLogData.filter(row => {
    const statusMatch = logStatusFilter.length === 0 || logStatusFilter.includes(row.status);
    const actionMatch = logActionFilter.length === 0 || logActionFilter.includes(row.action);
    return statusMatch && actionMatch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Tabbed content */}
      <div className="lg:col-span-2">
        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <div className="space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName((e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName((e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className="text-muted-foreground pr-24"
                      />
                      <div className="absolute right-2 inset-y-0 flex items-center">
                        <Badge variant="success">Verified</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userId">ID</Label>
                    <Input
                      id="userId"
                      value={userId}
                      readOnly
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isEnabled ? 'Account enabled' : 'Account disabled'}</Label>
                    <div className="flex items-center gap-3 pt-1">
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={setIsEnabled}
                      />
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <h3 className="text-sm font-semibold">Credentials</h3>
                <div className="space-y-3">
                  <InfoRow
                    icon={KeyRound}
                    title="Password"
                    subtitle="Configured"
                    action={
                      <ResetConfirmDialog
                        trigger={<Button variant="outline" size="sm">Reset password</Button>}
                        title="Reset password"
                        description="The user will receive an email with instructions to set up a new password. Their current password will be invalidated immediately."
                        onConfirm={() => alert('Password reset email sent')}
                      />
                    }
                  />
                  <InfoRow
                    icon={Smartphone}
                    title="MFA Devices"
                    subtitle={`${mfaDevices.length} device(s) configured`}
                    action={
                      <ResetConfirmDialog
                        trigger={<Button variant="outline" size="sm">Remove all devices</Button>}
                        title="Remove MFA devices"
                        description="All MFA devices will be removed. The user will be prompted to set up a new MFA device on their next login."
                        onConfirm={() => alert('All MFA devices removed')}
                      />
                    }
                  >
                    <div className="ml-8 space-y-2">
                      {mfaDevices.map((device) => (
                        <div key={device.name} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-md text-sm">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-foreground/70" />
                            <span>{device.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </InfoRow>
                  <InfoRow
                    icon={Link2}
                    title="SSO Federated Credentials"
                    subtitle="Linked"
                    action={
                      <ResetConfirmDialog
                        trigger={<Button variant="outline" size="sm">Unlink</Button>}
                        title="Unlink SSO Federated Credentials"
                        description="This will unlink the Gambit user from its federated credentials. The user will no longer be able to sign in using SSO until the credentials are re-linked."
                        onConfirm={() => alert('SSO credentials unlinked')}
                      />
                    }
                  />
                </div>
              </div>
            ) : activeTab === 'permissions' ? (
              <div className="space-y-8 w-full">
                {/* Campaign permissions */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Campaign permissions</h3>
                  <div className="mb-4">
                    <button
                      type="button"
                      className="flex h-10 w-full items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <span className="flex-1 truncate">{selectedCompany}</span>
                      <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-[1fr_160px_160px_40px] bg-muted/30 px-4 py-3 text-sm font-medium text-primary">
                      <span>Brands</span>
                      <span>Sponsored products</span>
                      <span>Display</span>
                      <span></span>
                    </div>
                    <Separator />
                    {permissions.map((brand, index) => (
                      <div key={brand.name}>
                        <div className="grid grid-cols-[1fr_160px_160px_40px] items-center px-4 py-3 text-sm">
                          <span className="flex items-center gap-2">
                            {brand.name}
                            {brand.isAll && <Info className="w-4 h-4 text-primary" />}
                          </span>
                          <span>
                            <Switch
                              checked={brand.sponsoredProducts}
                              onCheckedChange={() => togglePermission(index, 'sponsoredProducts')}
                            />
                          </span>
                          <span>
                            <Switch
                              checked={brand.display}
                              onCheckedChange={() => togglePermission(index, 'display')}
                            />
                          </span>
                          <span>
                            <button className="p-1 rounded hover:bg-muted">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </span>
                        </div>
                        {index < permissions.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Permissions',
              value: 'permissions',
              content: null,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Success', value: 'Success' },
                          { label: 'Failed', value: 'Failed' },
                        ],
                        selectedValues: logStatusFilter,
                        onChange: setLogStatusFilter,
                      },
                      {
                        name: 'Action',
                        options: [
                          { label: 'Login', value: 'Login' },
                          { label: 'Password Reset', value: 'Password Reset' },
                          { label: 'MFA Setup', value: 'MFA Setup' },
                        ],
                        selectedValues: logActionFilter,
                        onChange: setLogActionFilter,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      {
                        key: 'timestamp',
                        header: 'Timestamp',
                        render: (row: typeof loginLogData[0]) => new Date(row.timestamp).toLocaleString('en-US', {
                          month: '2-digit', day: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true,
                        }),
                      },
                      { key: 'action', header: 'Action', render: (row: typeof loginLogData[0]) => <Badge variant="outline">{row.action}</Badge> },
                      {
                        key: 'status',
                        header: 'Status',
                        render: (row: typeof loginLogData[0]) => (
                          <Badge variant={row.status === 'Success' ? 'success' : 'destructive'}>
                            {row.status}
                          </Badge>
                        ),
                      },
                      { key: 'ipAddress', header: 'IP Address' },
                      { key: 'browser', header: 'Browser' },
                      { key: 'location', header: 'Location' },
                    ]}
                    data={filteredLogs}
                    rowKey={(row: typeof loginLogData[0]) => row.id}
                  />
                </div>
              ),
            },
          ]}
          action={
            activeTab === 'details' ? (
              <Button onClick={() => alert(`Saved: ${firstName} ${lastName}`)}>Save</Button>
            ) : null
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Organisation card */}
        <Card>
          <CardHeader>
            <CardTitle>Organisation</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              icon={Building2}
              title="albertheijn"
              subtitle="250 user(s)"
            />
          </CardContent>
        </Card>

        {/* Roles card */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_32px] px-4 py-3 text-sm font-medium text-primary bg-muted/30">
                <span>Role</span>
                <span>Proposition</span>
                <span></span>
              </div>
              <Separator />
              <div className="max-h-[520px] overflow-y-auto">
                {roles.map((item, index) => (
                  <div key={`${item.role}-${item.proposition}-${index}`}>
                    <div className="grid grid-cols-[1fr_1fr_32px] items-center px-4 py-3 text-sm">
                      <span>{item.role}</span>
                      <span>{item.proposition}</span>
                      <span>
                        <button className="p-1 rounded hover:bg-muted">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </span>
                    </div>
                    {index < roles.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 flex justify-end">
              <Button>Assign roles</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const UserProfile: Story = {
  args: {
    routes: defaultRoutes,
    logo: { src: '/next.svg', alt: 'Logo', width: 40, height: 40 },
    user: {
      name: 'John Smith',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&size=32',
    },
    onLogout: () => alert('Logout clicked'),
    breadcrumbProps: { namespace: '' },
    children: <UserProfileContent />,
  },
  render: (args) => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    return (
      <MenuContextProvider>
        <AppLayout
          {...args}
          routes={routes}
          pageHeaderProps={{
            title: 'John Smith',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        />
      </MenuContextProvider>
    );
  },
};
