import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from './label';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'default-switch',
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="default-switch">Enable notifications</Label>
    </div>
  ),
};

export const AirplaneMode: Story = {
  args: {
    id: 'airplane-mode',
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    id: 'checked-switch',
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="checked-switch">WiFi enabled</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: 'disabled-switch',
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="disabled-switch" className="text-muted-foreground">
        This option is disabled
      </Label>
    </div>
  ),
};

export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-switch',
    disabled: true,
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor="disabled-checked-switch" className="text-muted-foreground">
        This option is disabled and on
      </Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Push notifications</Label>
        </div>
        <p className="text-sm text-muted-foreground pl-8">
          Receive push notifications about important updates and changes.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="marketing" />
          <Label htmlFor="marketing">Marketing emails</Label>
        </div>
        <p className="text-sm text-muted-foreground pl-8">
          Get updates about new features and promotional offers.
        </p>
      </div>
    </div>
  ),
};

export const SwitchGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch id="location" defaultChecked />
            <Label htmlFor="location">Location services</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="analytics" />
            <Label htmlFor="analytics">Analytics tracking</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="cookies" defaultChecked />
            <Label htmlFor="cookies">Accept cookies</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sharing" />
            <Label htmlFor="sharing">Data sharing</Label>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const NotificationSettings: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Communication</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="email-switch" defaultChecked />
              <Label htmlFor="email-switch">Email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sms-switch" />
              <Label htmlFor="sms-switch">SMS notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="push-switch" defaultChecked />
              <Label htmlFor="push-switch">Push notifications</Label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Content</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="news-switch" />
              <Label htmlFor="news-switch">Newsletter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="updates-switch" defaultChecked />
              <Label htmlFor="updates-switch">Product updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="tips-switch" />
              <Label htmlFor="tips-switch">Tips and tricks</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AccessibilitySettings: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Accessibility Options</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch id="high-contrast" />
          <Label htmlFor="high-contrast">High contrast mode</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="large-text" />
          <Label htmlFor="large-text">Large text</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="screen-reader" />
          <Label htmlFor="screen-reader">Screen reader support</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="motion-reduced" defaultChecked />
          <Label htmlFor="motion-reduced">Reduce motion</Label>
        </div>
      </div>
    </div>
  ),
};

export const DeviceSettings: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Device Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="wifi">Wi-Fi</Label>
            <p className="text-sm text-muted-foreground">Connect to available networks</p>
          </div>
          <Switch id="wifi" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="bluetooth">Bluetooth</Label>
            <p className="text-sm text-muted-foreground">Connect to nearby devices</p>
          </div>
          <Switch id="bluetooth" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="airplane">Airplane Mode</Label>
            <p className="text-sm text-muted-foreground">Disable all wireless connections</p>
          </div>
          <Switch id="airplane" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="hotspot">Mobile Hotspot</Label>
            <p className="text-sm text-muted-foreground">Share your internet connection</p>
          </div>
          <Switch id="hotspot" />
        </div>
      </div>
    </div>
  ),
};

export const FormIntegration: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Account Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure your account settings and preferences below.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Security</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-factor authentication</Label>
              <Switch id="two-factor" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="login-alerts">Login alerts</Label>
              <Switch id="login-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-logout">Auto logout</Label>
              <Switch id="auto-logout" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Privacy</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visibility">Public profile</Label>
              <Switch id="profile-visibility" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="activity-status">Show activity status</Label>
              <Switch id="activity-status" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="search-indexing">Search engine indexing</Label>
              <Switch id="search-indexing" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};