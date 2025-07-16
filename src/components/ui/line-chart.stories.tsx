import type { Meta, StoryObj } from '@storybook/react';
import { LineChartComponent } from './line-chart';

const meta: Meta<typeof LineChartComponent> = {
  title: 'Charts/Line Chart',
  component: LineChartComponent,
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
    curved: {
      control: 'boolean',
    },
    showDots: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
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
  },
};

export const WithLegend: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
  },
};

export const Linear: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    curved: false,
    showLegend: true,
  },
};

export const WithoutDots: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showDots: false,
    showLegend: true,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showGrid: false,
    showLegend: true,
  },
};

// Stock price data
const stockData = [
  { month: "Jan", price: 120.50, volume: 1500 },
  { month: "Feb", price: 125.30, volume: 1800 },
  { month: "Mar", price: 118.90, volume: 2100 },
  { month: "Apr", price: 132.40, volume: 1900 },
  { month: "May", price: 128.70, volume: 1600 },
  { month: "Jun", price: 135.20, volume: 2000 },
];

const stockConfig = {
  price: {
    label: "Stock Price",
    color: "hsl(142, 76%, 36%)",
  },
  volume: {
    label: "Volume",
    color: "hsl(221, 83%, 53%)",
  },
};

export const StockChart: Story = {
  args: {
    data: stockData,
    config: stockConfig,
    showLegend: true,
  },
};

// Temperature data
const temperatureData = [
  { month: "Jan", temperature: 2, humidity: 65 },
  { month: "Feb", temperature: 5, humidity: 70 },
  { month: "Mar", temperature: 12, humidity: 60 },
  { month: "Apr", temperature: 18, humidity: 55 },
  { month: "May", temperature: 24, humidity: 50 },
  { month: "Jun", temperature: 28, humidity: 45 },
];

const temperatureConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(346, 87%, 43%)",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(221, 83%, 53%)",
  },
};

export const TemperatureChart: Story = {
  args: {
    data: temperatureData,
    config: temperatureConfig,
    showLegend: true,
  },
};

// Growth metrics
const growthData = [
  { month: "Q1", users: 1000, revenue: 5000, conversion: 2.5 },
  { month: "Q2", users: 1500, revenue: 8000, conversion: 3.2 },
  { month: "Q3", users: 2200, revenue: 12000, conversion: 3.8 },
  { month: "Q4", users: 3100, revenue: 18000, conversion: 4.1 },
];

const growthConfig = {
  users: {
    label: "Users",
    color: "hsl(173, 58%, 39%)",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(43, 74%, 49%)",
  },
  conversion: {
    label: "Conversion Rate",
    color: "hsl(262, 83%, 58%)",
  },
};

export const GrowthChart: Story = {
  args: {
    data: growthData,
    config: growthConfig,
    showLegend: true,
  },
}; 