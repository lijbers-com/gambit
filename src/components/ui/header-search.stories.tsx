import type { Meta, StoryObj } from '@storybook/react';
import { HeaderSearch } from './header-search';
import { defaultRoutes } from '@/components/layout/default-routes';
import { HeaderActions } from './header-actions';

const meta: Meta<typeof HeaderSearch> = {
  title: 'UI/Header Search',
  component: HeaderSearch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Header Search

An expandable search input with categorized autocomplete for the application header. Search across campaigns, bookings, creatives, and pages.

## Features

- **Inline Search Input**: Always visible in the header, expands on focus
- **On-Demand Results**: Autocomplete only shows when user starts typing
- **Categorized Results**: Results grouped by type (Campaigns, Bookings, Creatives, Pages)
- **Status Badges**: Color-coded status indicators for each result
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select
- **Responsive**: Input expands from 176px to 288px on focus

## Usage

\`\`\`tsx
<HeaderSearch routes={routes} placeholder="Search..." />
\`\`\`

## Keyboard Shortcuts

- \`Arrow Up/Down\` - Navigate results
- \`Enter\` - Select result
- \`Escape\` - Close dropdown
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onNavigate: { action: 'navigate' },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    routes: defaultRoutes,
    placeholder: 'Search...',
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    routes: defaultRoutes,
    placeholder: 'Search campaigns, bookings...',
  },
  parameters: {
    docs: {
      description: {
        story: 'HeaderSearch with a custom placeholder text.',
      },
    },
  },
};

export const InHeader: Story = {
  render: () => (
    <div className="w-[600px] bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <span className="mx-2">/</span>
          <span>Campaigns</span>
        </div>
        <HeaderSearch routes={defaultRoutes} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'HeaderSearch positioned in header context. Start typing to see autocomplete suggestions.',
      },
    },
  },
};

export const WithHeaderActions: Story = {
  render: () => (
    <div className="w-[700px] bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <span className="mx-2">/</span>
          <span>Campaigns</span>
        </div>
        <HeaderActions routes={defaultRoutes} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'HeaderSearch integrated with HeaderActions showing full header layout.',
      },
    },
  },
};

export const Expanded: Story = {
  render: () => (
    <div className="w-[400px]">
      <p className="text-sm text-muted-foreground mb-4">
        Click on the search input to see it expand and show the autocomplete dropdown.
      </p>
      <HeaderSearch routes={defaultRoutes} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - click the input to see expand animation and categorized autocomplete.',
      },
    },
  },
};

export const SearchResults: Story = {
  render: () => (
    <div className="w-[400px]">
      <p className="text-sm text-muted-foreground mb-4">
        Try searching for: "summer", "running", "banner", or "display"
      </p>
      <HeaderSearch routes={defaultRoutes} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Try different search queries to see filtered results across categories.',
      },
    },
  },
};
