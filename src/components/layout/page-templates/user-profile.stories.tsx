import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
import {
  ChevronDown,
  MoreVertical,
  Info,
  KeyRound,
  Smartphone,
  Link2,
  Clock,
  Lock,
  ShieldCheck,
  AlertTriangle,
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

The User Profile page template provides a comprehensive user management interface with account settings, campaign permissions, organisation details, role assignments, and access details.

## Features

- **Settings Card**: Editable First Name and Last Name fields with Save button, read-only Email and ID, email verification status (Verified/Unverified), and user status (Enabled/Disabled) with toggle
- **Access Details Card**: Last login timestamp, lockout status, and credential management (Password, MFA devices, SSO) with reset confirmation dialogs
- **Campaign Permissions**: Company selector with brand-level permission toggles for Sponsored Products and Display
- **Organisation Card**: Displays the user's organisation and member count
- **Roles Table**: Scrollable list of assigned roles with their propositions and an "Assign roles" action

## Layout

Two-column responsive layout:
- **Left column (2/3)**: Settings card + Access details card + Campaign permissions card
- **Right column (1/3)**: Organisation card + Roles card

## Components Used

- AppLayout (navigation, user management, breadcrumbs)
- Card (content containers)
- Input (editable form fields)
- Badge (status indicators)
- Switch (permission toggles)
- Separator (table row dividers)
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

const UserProfileContent = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Smith');
  const [email] = useState('john.smith@ah.nl');
  const [userId] = useState('2d6f2e20-b482-4b1f-8944-0b4544c60ffe');
  const [isEnabled, setIsEnabled] = useState(true);
  const [permissions, setPermissions] = useState(brandPermissions);
  const [selectedCompany] = useState('Kai Tak Company B.V.');

  const togglePermission = (index: number, field: 'sponsoredProducts' | 'display') => {
    setPermissions(prev =>
      prev.map((p, i) => (i === index ? { ...p, [field]: !p[field] } : p))
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Settings card */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
            <div className="flex justify-end mt-6">
              <Button onClick={() => alert(`Saved: ${firstName} ${lastName}`)}>
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access details card */}
        <Card>
          <CardHeader>
            <CardTitle>Access details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Last login & Lockout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last login</p>
                  <p className="text-sm text-muted-foreground">
                    February 28, 2026 at 14:32 UTC
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Lockout status</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="default">Not locked</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Credentials */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Credentials configured</h4>
              <div className="space-y-4">
                {/* Password */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">Configured</p>
                    </div>
                  </div>
                  <ResetConfirmDialog
                    trigger={
                      <Button variant="outline" size="sm">
                        Reset password
                      </Button>
                    }
                    title="Reset password"
                    description="The user will receive an email with instructions to set up a new password. Their current password will be invalidated immediately."
                    onConfirm={() => alert('Password reset email sent')}
                  />
                </div>

                {/* MFA Devices */}
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">MFA Devices</p>
                        <p className="text-sm text-muted-foreground">
                          {mfaDevices.length} device(s) configured
                        </p>
                      </div>
                    </div>
                    <ResetConfirmDialog
                      trigger={
                        <Button variant="outline" size="sm">
                          Remove all devices
                        </Button>
                      }
                      title="Remove MFA devices"
                      description="All MFA devices will be removed. The user will be prompted to set up a new MFA device on their next login."
                      onConfirm={() => alert('All MFA devices removed')}
                    />
                  </div>
                  <div className="ml-8 space-y-2">
                    {mfaDevices.map((device) => (
                      <div
                        key={device.name}
                        className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                          <span>{device.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SSO Federated Credentials */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">SSO Federated Credentials</p>
                      <p className="text-sm text-muted-foreground">Linked</p>
                    </div>
                  </div>
                  <ResetConfirmDialog
                    trigger={
                      <Button variant="outline" size="sm">
                        Unlink
                      </Button>
                    }
                    title="Unlink SSO Federated Credentials"
                    description="This will unlink the Gambit user from its federated credentials. The user will no longer be able to sign in using SSO until the credentials are re-linked."
                    onConfirm={() => alert('SSO credentials unlinked')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign permissions card */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Company selector */}
            <div className="mb-6">
              <button
                type="button"
                className="flex h-10 w-full items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="flex-1 truncate">{selectedCompany}</span>
                <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
              </button>
            </div>

            {/* Permissions table */}
            <div className="border rounded-md overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_160px_160px_40px] bg-muted/30 px-4 py-3 text-sm font-medium text-primary">
                <span>Brands</span>
                <span>Sponsored products</span>
                <span>Display</span>
                <span></span>
              </div>
              <Separator />

              {/* Table rows */}
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
                        onCheckedChange={() =>
                          togglePermission(index, 'sponsoredProducts')
                        }
                      />
                    </span>
                    <span>
                      <Switch
                        checked={brand.display}
                        onCheckedChange={() =>
                          togglePermission(index, 'display')
                        }
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
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Organisation card */}
        <Card>
          <CardHeader>
            <CardTitle>Organisation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">albertheijn</p>
            <p className="text-sm text-muted-foreground">250 user(s)</p>
          </CardContent>
        </Card>

        {/* Roles card */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_32px] px-4 py-3 text-sm font-medium text-primary bg-muted/30">
                <span>Role</span>
                <span>Proposition</span>
                <span></span>
              </div>
              <Separator />

              {/* Table rows */}
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
