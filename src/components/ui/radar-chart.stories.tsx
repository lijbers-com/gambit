import type { Meta, StoryObj } from '@storybook/react';
import { RadarChartComponent } from './radar-chart';

const meta: Meta<typeof RadarChartComponent> = {
  title: 'Charts/Radar Chart',
  component: RadarChartComponent,
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
    showGrid: {
      control: 'boolean',
    },
    showAngleAxis: {
      control: 'boolean',
    },
    showRadiusAxis: {
      control: 'boolean',
    },
    outerRadius: {
      control: { type: 'range', min: 50, max: 150, step: 5 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const skillsData = [
  { subject: 'JavaScript', skillA: 90, skillB: 75 },
  { subject: 'React', skillA: 85, skillB: 80 },
  { subject: 'TypeScript', skillA: 80, skillB: 70 },
  { subject: 'Node.js', skillA: 75, skillB: 85 },
  { subject: 'Python', skillA: 70, skillB: 90 },
  { subject: 'Design', skillA: 60, skillB: 95 },
];

const skillsConfig = {
  skillA: {
    label: "Developer A",
    color: "hsl(var(--chart-1))",
  },
  skillB: {
    label: "Developer B",
    color: "hsl(var(--chart-2))",
  },
};

export const Default: Story = {
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const WithLegend: Story = {
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true,
  },
};

export const WithRadiusAxis: Story = {
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true,
    showRadiusAxis: true,
  },
};

export const LargeRadius: Story = {
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true,
    outerRadius: 120,
  },
};

// Performance metrics
const performanceData = [
  { subject: 'Speed', frontend: 85, backend: 78, mobile: 92 },
  { subject: 'Reliability', frontend: 90, backend: 95, mobile: 88 },
  { subject: 'Security', frontend: 78, backend: 92, mobile: 85 },
  { subject: 'Scalability', frontend: 82, backend: 88, mobile: 75 },
  { subject: 'Usability', frontend: 95, backend: 70, mobile: 90 },
  { subject: 'Performance', frontend: 88, backend: 85, mobile: 82 },
];

const performanceConfig = {
  frontend: {
    label: "Frontend",
    color: "hsl(221, 83%, 53%)",
  },
  backend: {
    label: "Backend",
    color: "hsl(142, 76%, 36%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(262, 83%, 58%)",
  },
};

export const PerformanceMetrics: Story = {
  args: {
    data: performanceData,
    config: performanceConfig,
    showLegend: true,
  },
};

// Product comparison
const productData = [
  { subject: 'Price', productA: 60, productB: 80, productC: 40 },
  { subject: 'Quality', productA: 85, productB: 90, productC: 70 },
  { subject: 'Features', productA: 75, productB: 85, productC: 95 },
  { subject: 'Support', productA: 90, productB: 70, productC: 80 },
  { subject: 'Ease of Use', productA: 80, productB: 75, productC: 85 },
  { subject: 'Documentation', productA: 70, productB: 85, productC: 90 },
];

const productConfig = {
  productA: {
    label: "Product A",
    color: "hsl(173, 58%, 39%)",
  },
  productB: {
    label: "Product B",
    color: "hsl(43, 74%, 49%)",
  },
  productC: {
    label: "Product C",
    color: "hsl(346, 87%, 43%)",
  },
};

export const ProductComparison: Story = {
  args: {
    data: productData,
    config: productConfig,
    showLegend: true,
    showRadiusAxis: true,
  },
};

// Team skills assessment
const teamData = [
  { subject: 'Communication', team: 85 },
  { subject: 'Technical Skills', team: 90 },
  { subject: 'Problem Solving', team: 88 },
  { subject: 'Creativity', team: 75 },
  { subject: 'Leadership', team: 80 },
  { subject: 'Collaboration', team: 92 },
];

const teamConfig = {
  team: {
    label: "Team Average",
    color: "hsl(262, 83%, 58%)",
  },
};

export const TeamAssessment: Story = {
  args: {
    data: teamData,
    config: teamConfig,
    showRadiusAxis: true,
  },
}; 