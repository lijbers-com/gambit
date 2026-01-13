import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchInput } from './search-input';

const meta: Meta<typeof SearchInput> = {
  title: 'UI/Search Input',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Search Input

A reusable search input component with search icon and clear button.

## Features

- **Search Icon**: Left-aligned search icon for visual affordance
- **Clear Button**: X button appears when input has value
- **Controlled/Uncontrolled**: Supports both modes
- **Custom Icon**: Optional custom icon prop

## Usage

\`\`\`tsx
<SearchInput
  placeholder="Search..."
  onChange={(e) => console.log(e.target.value)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    value: {
      control: 'text',
      description: 'Controlled value of the input',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when input value changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Search campaigns, creatives, and more...',
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchInput with a descriptive placeholder.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search...',
    defaultValue: 'Campaign',
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchInput with a pre-filled value showing the clear button.',
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledSearchInput() {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type to search..."
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Value: {value || '(empty)'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled SearchInput with external state management.',
      },
    },
  },
};

export const CustomWidth: Story = {
  render: () => (
    <div className="space-y-4">
      <SearchInput placeholder="Small (w-48)" className="w-48" />
      <SearchInput placeholder="Medium (w-64)" className="w-64" />
      <SearchInput placeholder="Large (w-96)" className="w-96" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SearchInput with different widths using className.',
      },
    },
  },
};
