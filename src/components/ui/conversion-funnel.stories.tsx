import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ConversionFunnelComponent } from './conversion-funnel';
import { Card, CardContent, CardHeader, CardTitle } from './card';

const meta: Meta<typeof ConversionFunnelComponent> = {
  title: 'Charts/Conversion Funnel',
  component: ConversionFunnelComponent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    showTooltip: { control: 'boolean' },
    color: { control: 'text' },
    barHeight: { control: { type: 'number', min: 80, max: 320, step: 20 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ecommerceStages = [
  { key: 'sessions', label: 'Sessions', value: 12450 },
  { key: 'cart', label: 'Added to cart', value: 4210 },
  { key: 'checkout', label: 'Reached checkout', value: 1820 },
  { key: 'completed', label: 'Completed', value: 940 },
];

export const Default: Story = {
  args: {
    stages: ecommerceStages,
    className: 'w-[720px]',
  },
};

export const InsideCard: Story = {
  render: (args) => {
    const firstValue = args.stages[0]?.value ?? 0;
    const lastValue = args.stages[args.stages.length - 1]?.value ?? 0;
    const overall = firstValue > 0 ? (lastValue / firstValue) * 100 : 0;
    return (
      <Card className="w-[760px]">
        <CardHeader>
          <CardTitle className="text-base">Conversion rate breakdown</CardTitle>
          <div className="text-3xl font-semibold mt-1">
            {overall.toFixed(overall < 10 ? 1 : 0)}%
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ConversionFunnelComponent {...args} />
        </CardContent>
      </Card>
    );
  },
  args: {
    stages: ecommerceStages,
  },
};

export const SteepDropOff: Story = {
  args: {
    stages: [
      { key: 'sessions', label: 'Sessions', value: 100000 },
      { key: 'cart', label: 'Added to cart', value: 8000 },
      { key: 'checkout', label: 'Reached checkout', value: 1500 },
      { key: 'completed', label: 'Completed', value: 400 },
    ],
    className: 'w-[720px]',
  },
};

export const ManyStages: Story = {
  args: {
    stages: [
      { key: 'impressions', label: 'Impressions', value: 540000 },
      { key: 'reach', label: 'Reach', value: 320000 },
      { key: 'clicks', label: 'Clicks', value: 84000 },
      { key: 'sessions', label: 'Sessions', value: 64500 },
      { key: 'cart', label: 'Added to cart', value: 12300 },
      { key: 'completed', label: 'Completed', value: 3800 },
    ],
    className: 'w-[920px]',
  },
};

export const TwoStages: Story = {
  args: {
    stages: [
      { key: 'visits', label: 'Visits', value: 8500 },
      { key: 'signups', label: 'Sign-ups', value: 1240 },
    ],
    className: 'w-[480px]',
  },
};

export const CustomColor: Story = {
  args: {
    stages: ecommerceStages,
    color: 'hsl(258, 100%, 60%)',
    className: 'w-[720px]',
  },
};
