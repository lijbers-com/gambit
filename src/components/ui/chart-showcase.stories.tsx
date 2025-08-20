import type { Meta, StoryObj } from '@storybook/react';
import { ChartShowcase } from './chart-showcase';

const meta: Meta<typeof ChartShowcase> = {
  title: 'Charts/Chart Showcase',
  component: ChartShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive showcase of all available chart components built with Recharts and Shadcn/ui. This demonstrates the full range of chart types and their variations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllCharts: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase displaying all chart types: Area Charts, Bar Charts, Line Charts, and Pie Charts with various configurations and styling options.',
      },
    },
  },
}; 