import type { Meta, StoryObj } from '@storybook/react';
import { BarChartComponent } from './bar-chart';

const meta: Meta<typeof BarChartComponent> = {
  title: 'Charts/Bar Chart',
  component: BarChartComponent,
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
    horizontal: {
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

export const Horizontal: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    horizontal: true,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const HorizontalStacked: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    horizontal: true,
    stacked: true,
    showLegend: true,
    className: "h-[300px]",
  },
};

// Sales data example
const salesData = [
  { month: "Jan", sales: 12000, target: 15000 },
  { month: "Feb", sales: 14000, target: 15000 },
  { month: "Mar", sales: 16000, target: 15000 },
  { month: "Apr", sales: 13000, target: 15000 },
  { month: "May", sales: 18000, target: 15000 },
  { month: "Jun", sales: 17000, target: 15000 },
];

const salesConfig = {
  sales: {
    label: "Sales",
    color: "hsl(142, 76%, 36%)",
  },
  target: {
    label: "Target",
    color: "hsl(43, 74%, 49%)",
  },
};

export const SalesChart: Story = {
  args: {
    data: salesData,
    config: salesConfig,
    showLegend: true,
  },
};

// Department data
const departmentData = [
  { month: "Q1", engineering: 45, marketing: 25, sales: 30 },
  { month: "Q2", engineering: 50, marketing: 28, sales: 35 },
  { month: "Q3", engineering: 48, marketing: 30, sales: 38 },
  { month: "Q4", engineering: 52, marketing: 32, sales: 40 },
];

const departmentConfig = {
  engineering: {
    label: "Engineering",
    color: "hsl(221, 83%, 53%)",
  },
  marketing: {
    label: "Marketing",
    color: "hsl(262, 83%, 58%)",
  },
  sales: {
    label: "Sales",
    color: "hsl(32, 95%, 44%)",
  },
};

export const DepartmentChart: Story = {
  args: {
    data: departmentData,
    config: departmentConfig,
    showLegend: true,
  },
};

export const DepartmentStacked: Story = {
  args: {
    data: departmentData,
    config: departmentConfig,
    stacked: true,
    showLegend: true,
  },
};

// Product comparison
const productData = [
  { month: "Product A", value: 275 },
  { month: "Product B", value: 200 },
  { month: "Product C", value: 187 },
  { month: "Product D", value: 173 },
  { month: "Product E", value: 90 },
];

const productConfig = {
  value: {
    label: "Sales",
    color: "hsl(173, 58%, 39%)",
  },
};

export const ProductComparison: Story = {
  args: {
    data: productData,
    config: productConfig,
    horizontal: true,
  },
}; 