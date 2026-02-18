import type { Meta, StoryObj } from '@storybook/react';
import { CampaignSummary } from './campaign-summary';
import { addDays } from 'date-fns';

const meta: Meta<typeof CampaignSummary> = {
  title: 'UI/CampaignSummary',
  component: CampaignSummary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Campaign Summary Component

A comprehensive campaign summary card component that displays campaign configuration details with interactive controls.

## Features

- **Campaign Overview**: Title, badge, and goal configuration
- **Audience Selection**: Input field with optional dropdown support
- **Metrics Display**: ROAS estimation and budget with clear visual hierarchy
- **Engine Management**: List of advertising engines with toggle controls
- **Time Configuration**: Campaign run time display with calendar icon
- **Feature Toggles**: Interactive switches for campaign features
- **Action Buttons**: Edit and Add to Cart functionality

## Usage

\`\`\`tsx
import { CampaignSummary } from '@/components/ui/campaign-summary';

<CampaignSummary
  title="AI performance campaign, week 1-4"
  badge={{ text: "Best ROAS", variant: "default" }}
  goal="Performance on transaction"
  audience="AH bonus shoppers"
  estimatedRoas="4.8x"
  budget="$5,000"
  engines={[
    { id: 'display', name: 'Display', enabled: true },
    { id: 'sponsored', name: 'Sponsored products', enabled: true },
    { id: 'digital', name: 'Digital in-store', enabled: true }
  ]}
  runTime={{ start: '31 Dec, 2023', end: '31 Jan, 2024' }}
  features={[
    { id: 'auto-bidding', label: 'Auto bidding', enabled: true },
    { id: 'goal-based', label: 'Goal-Based Media placement', enabled: true }
  ]}
  onEdit={() => console.log('Edit clicked')}
/>
\`\`\`

## Interactive Elements

- **Goal Input**: Editable text field for campaign goal
- **Audience Selection**: Can be configured as dropdown or text input
- **Engine Toggles**: Switch controls to enable/disable advertising engines
- **Feature Toggles**: Switch controls for campaign features
- **Action Buttons**: Edit (outline) and Add to Cart (primary) buttons
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Campaign title displayed at the top',
    },
    badge: {
      control: 'object',
      description: 'Optional badge with text and variant',
    },
    goal: {
      control: 'text',
      description: 'Campaign goal description',
    },
    audience: {
      control: 'text',
      description: 'Target audience for the campaign',
    },
    estimatedRoas: {
      control: 'text',
      description: 'Estimated return on ad spend',
    },
    budget: {
      control: 'text',
      description: 'Campaign budget amount',
    },
    engines: {
      control: 'object',
      description: 'Array of advertising engines with toggle states',
    },
    dateRange: {
      control: 'object',
      description: 'Campaign date range',
    },
    features: {
      control: 'object',
      description: 'Array of campaign features with toggle states',
    },
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation for the campaign summary',
    },
    usedBudget: {
      control: 'text',
      description: 'Amount of budget already used',
    },
    totalPrice: {
      control: 'text',
      description: 'Total price for the campaign',
    },
    budgetUsagePercentage: {
      control: 'number',
      description: 'Percentage of budget used (0-100)',
      min: 0,
      max: 100,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps = {
  title: 'AI performance campaign, week 1-4',
  badge: {
    text: 'Best ROAS',
    variant: 'default' as const,
  },
  goal: 'performance-transaction',
  goalOptions: [
    { label: 'Performance on transaction', value: 'performance-transaction' },
    { label: 'Brand awareness', value: 'brand-awareness' },
    { label: 'Lead generation', value: 'lead-generation' },
    { label: 'Customer acquisition', value: 'customer-acquisition' },
    { label: 'Retargeting', value: 'retargeting' },
    { label: 'Full funnel', value: 'full-funnel' },
  ],
  audience: 'ah-bonus',
  estimatedRoas: '4.8x',
  budget: '$5,000',
  engines: [
    { id: 'display', name: 'Display', enabled: true },
    { id: 'sponsored', name: 'Sponsored products', enabled: true },
    { id: 'digital', name: 'Digital in-store', enabled: true },
  ],
  dateRange: {
    from: new Date('2023-12-31'),
    to: addDays(new Date('2023-12-31'), 31),
  },
  features: [],
  onGoalChange: (goal: string) => console.log('Goal changed:', goal),
  onAudienceChange: (audience: string) => console.log('Audience changed:', audience),
  onBudgetChange: (budget: string) => console.log('Budget changed:', budget),
  onEngineToggle: (engineId: string, enabled: boolean) =>
    console.log('Engine toggle:', engineId, enabled),
  onFeatureToggle: (featureId: string, enabled: boolean) =>
    console.log('Feature toggle:', featureId, enabled),
  onDateRangeChange: (dateRange: any) => console.log('Date range changed:', dateRange),
  onEdit: () => console.log('Edit clicked'),
};

export const Default: Story = {
  args: defaultProps,
};

export const Horizontal: Story = {
  args: {
    ...defaultProps,
    layout: 'horizontal',
    defaultExpanded: true,
    usedBudget: '$3,200',
    totalPrice: '$3,200',
    budgetUsagePercentage: 64,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
      { id: 'offline', name: 'Offline in-store', enabled: true },
    ],
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
# Horizontal Campaign Summary

The horizontal variant provides a wider layout that displays campaign information in a three-column format:

- **Left Column**: Core campaign settings (Goal, Audience, Run time)
- **Middle Column**: Engines and Features displayed in line-item style tables with headers and organized rows
- **Right Column**: Metrics and action buttons

## Key Features

- **Line-Item Style Engines**: Engines are displayed in a structured table format similar to line items, with clear headers and organized rows
- **Table Layout**: Each engine shows in a dedicated row with proper spacing and hover effects
- **Enhanced Visual Hierarchy**: Better organization of information with clear column separation
- **Responsive Design**: Adapts to wider screens while maintaining usability

## Use Cases

- Dashboard views where more horizontal space is available
- Desktop applications with wide screens
- Administrative interfaces requiring quick access to all campaign details
- Situations where the campaign summary needs to integrate with other horizontal elements

The horizontal layout maintains all the interactive functionality of the vertical version while providing a more structured, table-like presentation of engines and features.
        `,
      },
    },
  },
};

export const HorizontalHighBudgetUsage: Story = {
  args: {
    ...defaultProps,
    layout: 'horizontal',
    usedBudget: '$4,600',
    totalPrice: '$4,600',
    budgetUsagePercentage: 92,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
      { id: 'offline', name: 'Offline in-store', enabled: true },
    ],
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
# High Budget Usage Example

This variant demonstrates the horizontal layout with high budget usage (92%). The progress bar changes color to red when budget usage exceeds 80%, providing a visual warning that the campaign is nearing its budget limit.

The Campaign Summary panel shows:
- Used Budget: $4,600
- Total Price: $5,800
- Budget Usage: 92% (displayed in red)

This helps campaign managers quickly identify campaigns that need immediate attention or budget adjustment.
        `,
      },
    },
  },
};

export const HorizontalLowBudgetUsage: Story = {
  args: {
    ...defaultProps,
    layout: 'horizontal',
    usedBudget: '$1,200',
    totalPrice: '$1,200',
    budgetUsagePercentage: 24,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
      { id: 'offline', name: 'Offline in-store', enabled: true },
    ],
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
# Low Budget Usage Example

This variant shows the horizontal layout with low budget usage (24%). The progress bar displays in green when budget usage is below 50%, indicating healthy budget utilization with plenty of room for continued spending.

The Campaign Summary panel shows:
- Used Budget: $1,200
- Total Price: $5,800
- Budget Usage: 24% (displayed in green)

This helps campaign managers identify campaigns that may benefit from optimization to improve performance.
        `,
      },
    },
  },
};