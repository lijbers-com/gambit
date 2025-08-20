import type { Meta, StoryObj } from '@storybook/react';
import { Input, FileInput } from './input';
import { Label } from './label';
import React, { useRef, useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Pre-filled value',
    placeholder: 'Enter text...',
  },
};

export const File: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <FileInput
        label="File"
        hint="You can upload PNG, JPG, or GIF files. Max size: 5MB."
        className="w-full"
      />
    </div>
  ),
};

export const Date: Story = {
  args: {
    type: 'date',
  },
};

export const Time: Story = {
  args: {
    type: 'time',
  },
};

export const Dropdown: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | undefined>(undefined);
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="dropdown">Dropdown</Label>
        <Input
          dropdown
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
          value={value}
          onChange={setValue}
          placeholder="Select an option"
        />
      </div>
    );
  },
};

export const WithHint: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="with-hint">Web landing parameter</Label>
      <Input id="with-hint" placeholder="Enter parameter" hint="This is a hint for extra info or error message." />
    </div>
  ),
}; 