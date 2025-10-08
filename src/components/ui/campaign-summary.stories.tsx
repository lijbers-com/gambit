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
  onAddToCart={() => console.log('Add to cart clicked')}
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
  features: [
    { id: 'auto-bidding', label: 'Auto bidding', enabled: true },
    { id: 'goal-based', label: 'Goal-Based Media placement', enabled: true },
  ],
  onGoalChange: (goal: string) => console.log('Goal changed:', goal),
  onAudienceChange: (audience: string) => console.log('Audience changed:', audience),
  onBudgetChange: (budget: string) => console.log('Budget changed:', budget),
  onEngineToggle: (engineId: string, enabled: boolean) =>
    console.log('Engine toggle:', engineId, enabled),
  onFeatureToggle: (featureId: string, enabled: boolean) =>
    console.log('Feature toggle:', featureId, enabled),
  onDateRangeChange: (dateRange: any) => console.log('Date range changed:', dateRange),
  onEdit: () => console.log('Edit clicked'),
  onAddToCart: () => console.log('Add to cart clicked'),
};

export const Default: Story = {
  args: defaultProps,
};