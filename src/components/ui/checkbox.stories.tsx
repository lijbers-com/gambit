import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
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
    id: 'default-checkbox',
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="default-checkbox">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    id: 'checked-checkbox',
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="checked-checkbox">I agree to the terms</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: 'disabled-checkbox',
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="disabled-checkbox" className="text-muted-foreground">
        This option is disabled
      </Label>
    </div>
  ),
};

export const DisabledChecked: Story = {
  args: {
    id: 'disabled-checked-checkbox',
    disabled: true,
    checked: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor="disabled-checked-checkbox" className="text-muted-foreground">
        This option is disabled and checked
      </Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="notifications" />
          <Label htmlFor="notifications">Email notifications</Label>
        </div>
        <p className="text-sm text-muted-foreground pl-6">
          Receive notifications about important updates and changes.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" />
          <Label htmlFor="marketing">Marketing emails</Label>
        </div>
        <p className="text-sm text-muted-foreground pl-6">
          Get updates about new features and promotional offers.
        </p>
      </div>
    </div>
  ),
};

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select your preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="pref1" defaultChecked />
            <Label htmlFor="pref1">Email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pref2" />
            <Label htmlFor="pref2">SMS notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pref3" defaultChecked />
            <Label htmlFor="pref3">Push notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pref4" />
            <Label htmlFor="pref4">Newsletter subscription</Label>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InlineWithLink: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">
        I agree to the{' '}
        <a href="#" className="text-primary underline hover:no-underline">
          terms and conditions
        </a>
      </Label>
    </div>
  ),
};

export const TaskList: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Task List</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="task1" defaultChecked />
          <Label htmlFor="task1" className="line-through text-muted-foreground">
            Complete project setup
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="task2" defaultChecked />
          <Label htmlFor="task2" className="line-through text-muted-foreground">
            Design system components
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="task3" />
          <Label htmlFor="task3">
            Implement authentication
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="task4" />
          <Label htmlFor="task4">
            Add user dashboard
          </Label>
        </div>
      </div>
    </div>
  ),
};

export const FilterOptions: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Filter Results</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Category</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="category1" defaultChecked />
              <Label htmlFor="category1">Technology</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category2" />
              <Label htmlFor="category2">Design</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category3" />
              <Label htmlFor="category3">Business</Label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Price Range</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="price1" />
              <Label htmlFor="price1">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="price2" defaultChecked />
              <Label htmlFor="price2">$1 - $50</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="price3" />
              <Label htmlFor="price3">$51 - $100</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Different Sizes</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="small" className="h-3 w-3" />
          <Label htmlFor="small" className="text-sm">
            Small checkbox
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="medium" />
          <Label htmlFor="medium">
            Medium checkbox (default)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="large" className="h-5 w-5" />
          <Label htmlFor="large" className="text-lg">
            Large checkbox
          </Label>
        </div>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your account preferences below.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="email-notif" defaultChecked />
              <Label htmlFor="email-notif">Email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sms-notif" />
              <Label htmlFor="sms-notif">SMS notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="push-notif" defaultChecked />
              <Label htmlFor="push-notif">Push notifications</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Privacy</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="profile-public" />
              <Label htmlFor="profile-public">Make profile public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="analytics" defaultChecked />
              <Label htmlFor="analytics">Allow analytics tracking</Label>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms-final" />
            <Label htmlFor="terms-final">
              I agree to the{' '}
              <a href="#" className="text-primary underline hover:no-underline">
                terms of service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary underline hover:no-underline">
                privacy policy
              </a>
            </Label>
          </div>
        </div>
      </div>
    </div>
  ),
}; 