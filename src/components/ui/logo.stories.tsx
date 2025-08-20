import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo';

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Logo Component

The Logo component displays either the Gambit or Albert Heijn logo based on the current theme. It supports automatic theme detection and manual theme selection.

## Features

- **Theme-based Logo Switching**: Automatically displays the appropriate logo based on theme
- **Auto Detection**: Detects theme from CSS variables, data attributes, or class names
- **Manual Override**: Can be explicitly set to display a specific logo
- **Fixed Size**: Consistent 40×40 pixel dimensions
- **Color Adaptation**: Albert Heijn logo displays in white for AH theme
- **Clickable**: Optional click handler for navigation
- **Optimized**: Uses Next.js Image component for performance

## Theme Detection

The component detects themes in the following order:
1. **CSS Custom Property**: \`--brand-theme: albert-heijn | gambit\`
2. **Data Attributes**: \`data-theme="albert-heijn"\` on html or body
3. **CSS Classes**: \`.albert-heijn\` or \`.ah-theme\` on html or body
4. **Default**: Falls back to Gambit logo

## Usage Examples

\`\`\`tsx
// Auto-detect theme (default)
<Logo />

// Explicit theme
<Logo theme="albert-heijn" />

// With click handler
<Logo onClick={() => router.push('/')} />
\`\`\`

## Available Themes

- **gambit**: Displays the Gambit logo (\`/gambit-logo.svg\`)
- **albert-heijn**: Displays the Albert Heijn logo (\`/ah-logo.svg\`)
- **auto**: Automatically detects theme (default)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['auto', 'gambit', 'albert-heijn'],
      description: 'Theme type that determines which logo to display',
      defaultValue: 'auto',
    },
    variant: {
      control: 'select',
      options: ['auto', 'white', 'blue', 'original'],
      description: 'Color variant for the logo',
      defaultValue: 'auto',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the logo',
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
  args: {},
};

export const GambitLogo: Story = {
  args: {
    theme: 'gambit',
  },
  parameters: {
    docs: {
      description: {
        story: 'Explicit Gambit logo display. This is the default logo for the Gambit theme.',
      },
    },
  },
};

export const AlbertHeijnLogo: Story = {
  args: {
    theme: 'albert-heijn',
  },
  parameters: {
    docs: {
      description: {
        story: 'Explicit Albert Heijn logo display in white (default AH variant). Used when the theme is set to Albert Heijn.',
      },
    },
  },
};

export const AlbertHeijnBlue: Story = {
  args: {
    theme: 'albert-heijn',
    variant: 'blue',
  },
  parameters: {
    docs: {
      description: {
        story: 'Albert Heijn logo in blue (#00ADE6). Perfect for login pages and light backgrounds.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    theme: 'gambit',
    onClick: () => alert('Logo clicked! In a real app, this would navigate to home.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Clickable logo with cursor pointer. Typically used for navigation to home page.',
      },
    },
  },
};

export const Comparison: Story = {
  render: () => (
    <div className="flex gap-6 items-center flex-wrap">
      <div className="text-center">
        <Logo theme="gambit" />
        <p className="mt-2 text-sm text-gray-600">Gambit (Original)</p>
      </div>
      <div className="text-center">
        <Logo theme="albert-heijn" variant="white" />
        <p className="mt-2 text-sm text-gray-600">AH (White)</p>
      </div>
      <div className="text-center">
        <Logo theme="albert-heijn" variant="blue" />
        <p className="mt-2 text-sm text-gray-600">AH (Blue)</p>
      </div>
      <div className="text-center">
        <Logo theme="albert-heijn" variant="original" />
        <p className="mt-2 text-sm text-gray-600">AH (Original)</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all logo variants showing theme and color combinations. Blue variant is perfect for login pages.',
      },
    },
  },
};