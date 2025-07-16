import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { Check, Pause, X, Circle, Clock, Play, Minus, Pencil, AlertCircle, Info } from 'lucide-react';

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
      options: ['default', 'secondary', 'destructive', 'outline'],
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

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Destructive</Badge>
      <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Outline</Badge>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Badge variant="success"><Check className="w-3 h-3 mr-1" />Success</Badge>
        <Badge variant="success" size="large"><Check className="w-5 h-5 mr-2" />Success</Badge>
        <Badge variant="warning"><AlertCircle className="w-3 h-3 mr-1" />Warning</Badge>
        <Badge variant="warning" size="large"><AlertCircle className="w-5 h-5 mr-2" />Warning</Badge>
        <Badge variant="info"><Info className="w-3 h-3 mr-1" />Info</Badge>
        <Badge variant="info" size="large"><Info className="w-5 h-5 mr-2" />Info</Badge>
        <Badge variant="error"><X className="w-3 h-3 mr-1" />Error</Badge>
        <Badge variant="error" size="large"><X className="w-5 h-5 mr-2" />Error</Badge>
        <Badge variant="default">Default</Badge>
        <Badge variant="default" size="large">Default</Badge>
        <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Destructive</Badge>
        <Badge variant="destructive" size="large"><X className="w-5 h-5 mr-2" />Destructive</Badge>
        <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Outline</Badge>
        <Badge variant="outline" size="large"><AlertCircle className="w-5 h-5 mr-2" />Outline</Badge>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Success
      </Badge>
      <Badge variant="destructive">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        Error
      </Badge>
    </div>
  ),
}; 