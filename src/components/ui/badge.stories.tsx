import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Circle, 
  Clock, 
  Play, 
  Pause, 
  Settings,
  User,
  Shield,
  Zap
} from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'success', 'warning', 'outline', 'info'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'large'],
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">All Badge Variants</h3>
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="destructive">Error</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="secondary">Secondary</Badge>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Badge Sizes</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-16">Default:</span>
          <Badge variant="success">Success</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-16">Large:</span>
          <Badge variant="success" size="large">Success</Badge>
          <Badge variant="destructive" size="large">Error</Badge>
          <Badge variant="warning" size="large">Warning</Badge>
          <Badge variant="info" size="large">Info</Badge>
        </div>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Badges with Icons</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-16">Default:</span>
          <Badge variant="success">
            <Check className="w-3 h-3 mr-1" />
            Completed
          </Badge>
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Failed
          </Badge>
          <Badge variant="warning">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
          <Badge variant="info">
            <Info className="w-3 h-3 mr-1" />
            Information
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-16">Large:</span>
          <Badge variant="success" size="large">
            <Check className="w-4 h-4 mr-2" />
            Completed
          </Badge>
          <Badge variant="destructive" size="large">
            <X className="w-4 h-4 mr-2" />
            Failed
          </Badge>
          <Badge variant="warning" size="large">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Warning
          </Badge>
          <Badge variant="info" size="large">
            <Info className="w-4 h-4 mr-2" />
            Information
          </Badge>
        </div>
      </div>
    </div>
  ),
};

export const ApplicationStates: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Application Badge States</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Campaign Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">
              <Circle className="w-3 h-3 mr-1 fill-current" />
              Active
            </Badge>
            <Badge variant="warning">
              <Pause className="w-3 h-3 mr-1" />
              Paused
            </Badge>
            <Badge variant="destructive">
              <X className="w-3 h-3 mr-1" />
              Stopped
            </Badge>
            <Badge variant="info">
              <Clock className="w-3 h-3 mr-1" />
              Scheduled
            </Badge>
            <Badge variant="outline">
              <Settings className="w-3 h-3 mr-1" />
              Draft
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Performance Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">
              <Zap className="w-3 h-3 mr-1" />
              High Performance
            </Badge>
            <Badge variant="warning">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Needs Attention
            </Badge>
            <Badge variant="destructive">
              <X className="w-3 h-3 mr-1" />
              Under Performing
            </Badge>
            <Badge variant="info">
              <Info className="w-3 h-3 mr-1" />
              New Campaign
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">User Roles</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
            <Badge variant="info">
              <User className="w-3 h-3 mr-1" />
              Manager
            </Badge>
            <Badge variant="outline">
              <User className="w-3 h-3 mr-1" />
              User
            </Badge>
            <Badge variant="warning">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Limited Access
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">System Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">
              <Check className="w-3 h-3 mr-1" />
              Operational
            </Badge>
            <Badge variant="warning">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Maintenance
            </Badge>
            <Badge variant="destructive">
              <X className="w-3 h-3 mr-1" />
              Outage
            </Badge>
            <Badge variant="info">
              <Settings className="w-3 h-3 mr-1" />
              Updating
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Real-world Usage Examples</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Campaign Dashboard</h4>
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Summer Sale Campaign</span>
              <Badge variant="success" size="large">
                <Play className="w-4 h-4 mr-2" />
                Running
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Back to School Promo</span>
              <Badge variant="warning" size="large">
                <Clock className="w-4 h-4 mr-2" />
                Scheduled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Black Friday Campaign</span>
              <Badge variant="outline" size="large">
                <Settings className="w-4 h-4 mr-2" />
                Draft
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Performance Metrics</h4>
          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-20">CTR:</span>
              <Badge variant="success">
                <Zap className="w-3 h-3 mr-1" />
                Excellent
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-20">CPC:</span>
              <Badge variant="warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                High
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-20">Quality:</span>
              <Badge variant="success">
                <Check className="w-3 h-3 mr-1" />
                Good
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}; 