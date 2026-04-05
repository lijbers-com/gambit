import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SummaryCard } from './summary-card';
import type { SummaryStep } from './summary-card';

const meta: Meta<typeof SummaryCard> = {
  title: 'UI/SummaryCard',
  component: SummaryCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# SummaryCard

A flexible summary sidebar card with three variants:

| Variant | Use case |
|---|---|
| \`details\` | Key/value list — Campaign details, Booking info, Creative specs |
| \`process\` | Numbered wizard timeline — create flow step tracker |
| \`order\` | Grouped line-items with totals — order/checkout summary |

All variants accept an \`actions\` array for primary/secondary buttons and an optional \`footer\` note.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['details', 'process', 'order'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SummaryCard>;

// ─── Details variant ──────────────────────────────────────────────────────────

export const CampaignDetails: Story = {
  name: 'Details — Campaign',
  render: () => (
    <div className="w-72">
      <SummaryCard
        title="Campaign details"
        variant="details"
        groups={[
          {
            label: 'Campaign setup',
            items: [
              { label: 'Campaign name', value: 'Campaign AH – Summer 2024' },
              { label: 'PO Number', value: 'PO-123456' },
              { label: 'Budget', value: '€10,000' },
              { label: 'Runtime', value: '01 Aug, 2024 – 30 Aug, 2024' },
            ],
          },
          {
            label: 'Advertiser, brand & products',
            items: [
              { label: 'Advertiser', value: 'Acme Media' },
              { label: 'Brand', value: 'Knorr' },
            ],
          },
          {
            label: 'Campaign targeting',
            items: [
              { label: 'Goal', value: 'Awareness' },
            ],
          },
        ]}
        actions={[
          { label: 'Edit campaign', variant: 'outline', onClick: () => alert('Edit') },
        ]}
      />
    </div>
  ),
};

export const BookingDetails: Story = {
  name: 'Details — Booking',
  render: () => (
    <div className="w-72">
      <SummaryCard
        title="Booking"
        variant="details"
        items={[
          { label: 'Runtime', value: '01/08/2024 – 30/08/2024' },
          { label: 'Placement', value: 'Homepage banner' },
          { label: 'Format', value: '970×250' },
          { label: 'Budget', value: '€2,500' },
          { label: 'Status', value: 'In option' },
        ]}
        actions={[
          { label: 'Save booking', variant: 'default', onClick: () => alert('Saved') },
          { label: 'Cancel', variant: 'ghost', onClick: () => alert('Cancelled') },
        ]}
      />
    </div>
  ),
};

export const CreativeDetails: Story = {
  name: 'Details — Creative',
  render: () => (
    <div className="w-72">
      <SummaryCard
        title="Creative"
        variant="details"
        items={[
          { label: 'Creative name', value: 'Summer Banner v2' },
          { label: 'Format', value: '970×250 px' },
          { label: 'Type', value: 'Display' },
          { label: 'Status', value: 'Approved' },
          { label: 'Last updated', value: '28 Mar 2026' },
        ]}
        actions={[
          { label: 'Preview creative', variant: 'outline', onClick: () => alert('Preview') },
        ]}
      />
    </div>
  ),
};

// ─── Process variant ──────────────────────────────────────────────────────────

export const WizardSummaryEmpty: Story = {
  name: 'Process — Wizard (empty)',
  render: () => (
    <div className="w-72">
      <SummaryCard
        title="Summary"
        variant="process"
        steps={[
          { id: 'setup', label: 'Campaign setup', status: 'active' },
          { id: 'brand', label: 'Brand & products', status: 'pending' },
          { id: 'goal', label: 'Campaign goal', status: 'pending' },
          { id: 'targeting', label: 'Targeting', status: 'pending' },
          { id: 'keywords', label: 'Keywords & placements', status: 'pending' },
          { id: 'review', label: 'Review & launch', status: 'pending' },
        ]}
      />
    </div>
  ),
};

export const WizardSummaryInProgress: Story = {
  name: 'Process — Wizard (in progress)',
  render: () => {
    const [currentStep, setCurrentStep] = useState(2);

    const allSteps = [
      { id: 'setup', label: 'Campaign setup', completedValues: ['Summer Sale 2024', 'Knorr'] },
      { id: 'brand', label: 'Brand & products', completedValues: ['Knorr', '3 products selected'] },
      { id: 'goal', label: 'Campaign goal', completedValues: undefined },
      { id: 'targeting', label: 'Targeting', completedValues: undefined },
      { id: 'keywords', label: 'Keywords & placements', completedValues: undefined },
      { id: 'review', label: 'Review & launch', completedValues: undefined },
    ];

    const steps: SummaryStep[] = allSteps.map((s, i) => ({
      id: s.id,
      label: s.label,
      status: i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending',
      values: i < currentStep ? s.completedValues : undefined,
      onClick: i < currentStep ? () => setCurrentStep(i) : undefined,
    }));

    return (
      <div className="w-72">
        <SummaryCard title="Summary" variant="process" steps={steps} />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Click a completed step to jump back
        </p>
      </div>
    );
  },
};

export const WizardSummaryComplete: Story = {
  name: 'Process — Wizard (complete)',
  render: () => (
    <div className="w-72">
      <SummaryCard
        title="Summary"
        variant="process"
        steps={[
          { id: 'setup', label: 'Campaign setup', status: 'completed', values: ['Summer Sale 2024', 'Knorr'] },
          { id: 'brand', label: 'Brand & products', status: 'completed', values: ['Knorr', '3 products selected'] },
          { id: 'goal', label: 'Campaign goal', status: 'completed', values: ['Awareness'] },
          { id: 'targeting', label: 'Targeting', status: 'completed', values: ['Retail shoppers'] },
          { id: 'keywords', label: 'Keywords & placements', status: 'completed', values: ['8 keywords'] },
          { id: 'review', label: 'Review & launch', status: 'active' },
        ]}
        actions={[
          { label: 'Launch campaign', variant: 'default', onClick: () => alert('Launched!') },
          { label: 'Save draft', variant: 'outline', onClick: () => alert('Saved') },
        ]}
      />
    </div>
  ),
};

// ─── Order variant ────────────────────────────────────────────────────────────

export const OrderSummaryRetailMedia: Story = {
  name: 'Order — Media plan',
  render: () => (
    <div className="w-72">
      <SummaryCard
        title="Media plan summary"
        subtitle="Campaign · Summer Sale 2024"
        variant="order"
        sections={[
          {
            label: 'Monthly costs',
            items: [
              { label: 'Sponsored Products', value: '€ 1,200' },
              { label: 'Display campaign', value: '€ 800', originalValue: '€ 1,000' },
            ],
          },
          {
            label: 'One-time costs',
            items: [
              { label: 'Creative production', value: '€ 250' },
              { label: 'Setup fee', value: '€ 0' },
            ],
          },
        ]}
        totals={[
          { label: 'Total per month', value: '€ 2,000' },
          { label: 'One-time total', value: '€ 250' },
        ]}
        actions={[
          { label: 'View full overview', variant: 'outline', onClick: () => alert('Overview') },
          { label: 'Confirm & book', variant: 'default', onClick: () => alert('Booked!') },
        ]}
        footer="All prices are excluding VAT."
      />
    </div>
  ),
};

// ─── Compact / condensed ─────────────────────────────────────────────────────

export const CompactDetails: Story = {
  name: 'Details — Compact (no actions)',
  render: () => (
    <div className="w-64">
      <SummaryCard
        title="Booking"
        variant="details"
        items={[
          { label: 'Runtime', value: '01/08/2024 – 30/08/2024' },
          { label: 'Budget', value: '€2,500' },
        ]}
      />
    </div>
  ),
};
