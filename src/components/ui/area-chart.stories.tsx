import type { Meta, StoryObj } from '@storybook/react';
import { AreaChartComponent } from './area-chart';

const meta: Meta<typeof AreaChartComponent> = {
  title: 'Charts/Area Chart',
  component: AreaChartComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showGrid: {
      control: 'boolean',
    },
    showTooltip: {
      control: 'boolean',
    },
    showLegend: {
      control: 'boolean',
    },
    showXAxis: {
      control: 'boolean',
    },
    showYAxis: {
      control: 'boolean',
    },
    stacked: {
      control: 'boolean',
    },
    curved: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

export const Default: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const WithLegend: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const Stacked: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    stacked: true,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const Linear: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    curved: false,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const WithoutGrid: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showGrid: false,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const MinimalAxes: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showXAxis: false,
    showYAxis: false,
    showGrid: false,
    showLegend: true,
  },
};

// Revenue data example
const revenueData = [
  { month: "January", revenue: 4200, expenses: 2400 },
  { month: "February", revenue: 3800, expenses: 2200 },
  { month: "March", revenue: 5200, expenses: 2800 },
  { month: "April", revenue: 4600, expenses: 2600 },
  { month: "May", revenue: 5800, expenses: 3200 },
  { month: "June", revenue: 6200, expenses: 3400 },
];

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(142, 76%, 36%)",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(346, 87%, 43%)",
  },
};

export const RevenueChart: Story = {
  args: {
    data: revenueData,
    config: revenueConfig,
    showLegend: true,
  },
};

// Multi-series data
const multiSeriesData = [
  { month: "Jan", sales: 1200, marketing: 800, support: 600 },
  { month: "Feb", sales: 1400, marketing: 900, support: 700 },
  { month: "Mar", sales: 1100, marketing: 750, support: 650 },
  { month: "Apr", sales: 1600, marketing: 1000, support: 800 },
  { month: "May", sales: 1800, marketing: 1200, support: 900 },
  { month: "Jun", sales: 2000, marketing: 1300, support: 950 },
];

const multiSeriesConfig = {
  sales: {
    label: "Sales",
    color: "hsl(221, 83%, 53%)",
  },
  marketing: {
    label: "Marketing",
    color: "hsl(262, 83%, 58%)",
  },
  support: {
    label: "Support",
    color: "hsl(32, 95%, 44%)",
  },
};

export const MultiSeries: Story = {
  args: {
    data: multiSeriesData,
    config: multiSeriesConfig,
    showLegend: true,
  },
};

export const MultiSeriesStacked: Story = {
  args: {
    data: multiSeriesData,
    config: multiSeriesConfig,
    stacked: true,
    showLegend: true,
  },
};

// Performance data
const performanceData = [
  { month: "Q1", performance: 85, target: 90 },
  { month: "Q2", performance: 92, target: 90 },
  { month: "Q3", performance: 88, target: 90 },
  { month: "Q4", performance: 95, target: 90 },
];

const performanceConfig = {
  performance: {
    label: "Performance",
    color: "hsl(173, 58%, 39%)",
  },
  target: {
    label: "Target",
    color: "hsl(43, 74%, 49%)",
  },
};

export const PerformanceChart: Story = {
  args: {
    data: performanceData,
    config: performanceConfig,
    showLegend: true,
  },
}; 