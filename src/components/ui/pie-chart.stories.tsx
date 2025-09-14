import type { Meta, StoryObj } from '@storybook/react';
import { PieChartComponent } from './pie-chart';

const meta: Meta<typeof PieChartComponent> = {
  title: 'Charts/Pie Chart',
  component: PieChartComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showTooltip: {
      control: 'boolean',
    },
    showLegend: {
      control: 'boolean',
    },
    showLabels: {
      control: 'boolean',
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['outside', 'inside', 'center'],
    },
    innerRadius: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
    },
    outerRadius: {
      control: { type: 'range', min: 50, max: 150, step: 5 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const chartData = [
  { name: "desktop", value: 186 },
  { name: "mobile", value: 305 },
  { name: "tablet", value: 237 },
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
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
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

export const WithoutLegend: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: false,
  },
};

export const DonutChart: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    innerRadius: 40,
  },
};

export const LargeDonut: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    innerRadius: 60,
    outerRadius: 120,
  },
};

// Browser market share data
const browserData = [
  { name: "chrome", value: 65.2 },
  { name: "safari", value: 18.8 },
  { name: "firefox", value: 9.3 },
  { name: "edge", value: 4.1 },
  { name: "other", value: 2.6 },
];

const browserConfig = {
  chrome: {
    label: "Chrome",
    color: "hsl(221, 83%, 53%)",
  },
  safari: {
    label: "Safari",
    color: "hsl(173, 58%, 39%)",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(32, 95%, 44%)",
  },
  edge: {
    label: "Edge",
    color: "hsl(262, 83%, 58%)",
  },
  other: {
    label: "Other",
    color: "hsl(346, 87%, 43%)",
  },
};

export const BrowserShare: Story = {
  args: {
    data: browserData,
    config: browserConfig,
  },
};

// Sales by region
const regionData = [
  { name: "north", value: 2400 },
  { name: "south", value: 1398 },
  { name: "east", value: 9800 },
  { name: "west", value: 3908 },
];

const regionConfig = {
  north: {
    label: "North",
    color: "hsl(142, 76%, 36%)",
  },
  south: {
    label: "South",
    color: "hsl(43, 74%, 49%)",
  },
  east: {
    label: "East",
    color: "hsl(221, 83%, 53%)",
  },
  west: {
    label: "West",
    color: "hsl(262, 83%, 58%)",
  },
};

export const SalesByRegion: Story = {
  args: {
    data: regionData,
    config: regionConfig,
  },
};

export const SalesByRegionDonut: Story = {
  args: {
    data: regionData,
    config: regionConfig,
    innerRadius: 50,
  },
};

// Budget allocation
const budgetData = [
  { name: "marketing", value: 35 },
  { name: "development", value: 45 },
  { name: "operations", value: 15 },
  { name: "research", value: 5 },
];

const budgetConfig = {
  marketing: {
    label: "Marketing",
    color: "hsl(173, 58%, 39%)",
  },
  development: {
    label: "Development",
    color: "hsl(221, 83%, 53%)",
  },
  operations: {
    label: "Operations",
    color: "hsl(32, 95%, 44%)",
  },
  research: {
    label: "Research",
    color: "hsl(262, 83%, 58%)",
  },
};

export const BudgetAllocation: Story = {
  args: {
    data: budgetData,
    config: budgetConfig,
  },
};

// Customer satisfaction
const satisfactionData = [
  { name: "excellent", value: 42 },
  { name: "good", value: 38 },
  { name: "average", value: 15 },
  { name: "poor", value: 5 },
];

const satisfactionConfig = {
  excellent: {
    label: "Excellent",
    color: "hsl(142, 76%, 36%)",
  },
  good: {
    label: "Good",
    color: "hsl(173, 58%, 39%)",
  },
  average: {
    label: "Average",
    color: "hsl(43, 74%, 49%)",
  },
  poor: {
    label: "Poor",
    color: "hsl(346, 87%, 43%)",
  },
};

export const CustomerSatisfaction: Story = {
  args: {
    data: satisfactionData,
    config: satisfactionConfig,
    innerRadius: 30,
  },
};

// Custom Label variant matching the image
const customLabelData = [
  { name: "segment1", value: 275 },
  { name: "segment2", value: 200 },
  { name: "segment3", value: 187 },
  { name: "segment4", value: 173 },
  { name: "segment5", value: 90 },
];

const customLabelConfig = {
  segment1: {
    label: "Segment 1",
    color: "hsl(213, 94%, 68%)", // Light blue
  },
  segment2: {
    label: "Segment 2", 
    color: "hsl(217, 91%, 60%)", // Medium blue
  },
  segment3: {
    label: "Segment 3",
    color: "hsl(221, 83%, 53%)", // Blue
  },
  segment4: {
    label: "Segment 4",
    color: "hsl(224, 76%, 48%)", // Dark blue
  },
  segment5: {
    label: "Segment 5",
    color: "hsl(226, 71%, 40%)", // Darker blue
  },
};

export const CustomLabel: Story = {
  args: {
    data: customLabelData,
    config: customLabelConfig,
    showLabels: true,
    showLegend: false,
    showTooltip: true,
    className: "h-[400px]",
    outerRadius: 120,
  },
}; 