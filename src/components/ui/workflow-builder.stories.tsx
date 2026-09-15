import type { Meta, StoryObj } from '@storybook/react';
import { WorkflowBuilder } from './workflow-builder';

/**
 * The workflow board, per proposition. Each story loads that proposition's
 * seeded workflow from the database: digital in-store and offline in-store
 * come from Jacco's lifecycles (published), display and sponsored products
 * from the status-lifecycle proposal (drafts).
 */
const meta: Meta<typeof WorkflowBuilder> = {
  title: 'UI/Workflow Builder',
  component: WorkflowBuilder,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof WorkflowBuilder>;

export const DigitalInstore: Story = { args: { engine: 'digital-instore' } };
export const OfflineInstore: Story = { args: { engine: 'offline-instore' } };
export const Display: Story = { args: { engine: 'display' } };
export const SponsoredProducts: Story = { args: { engine: 'sponsored-products' } };
