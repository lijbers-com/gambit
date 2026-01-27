import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MetricRow, MetricDefinition } from './metric-row';

const sampleGraphData = {
  sales: [
    { value: 95 }, { value: 142 }, { value: 128 }, { value: 175 }, { value: 188 }, { value: 210 }
  ],
  spend: [
    { value: 38 }, { value: 41 }, { value: 39 }, { value: 43 }, { value: 42 }, { value: 45 }
  ],
  roas: [
    { value: 2.5 }, { value: 3.5 }, { value: 3.3 }, { value: 4.1 }, { value: 4.5 }, { value: 4.7 }
  ],
  iroas: [
    { value: 2.2 }, { value: 3.1 }, { value: 2.9 }, { value: 3.7 }, { value: 4.0 }, { value: 4.2 }
  ],
  reach: [
    { value: 420 }, { value: 580 }, { value: 540 }, { value: 720 }, { value: 780 }, { value: 850 }
  ],
  ctr: [
    { value: 3.2 }, { value: 4.1 }, { value: 3.9 }, { value: 5.2 }, { value: 5.5 }, { value: 5.9 }
  ],
  conversionRate: [
    { value: 2.1 }, { value: 2.9 }, { value: 2.6 }, { value: 3.5 }, { value: 3.8 }, { value: 4.1 }
  ],
  cpa: [
    { value: 32 }, { value: 27 }, { value: 29 }, { value: 23 }, { value: 21 }, { value: 19 }
  ],
};

const allMetrics: MetricDefinition[] = [
  {
    key: 'sales',
    label: 'Total Sales',
    value: '€200K',
    badgeValue: '+78%',
    badgeVariant: 'success',
    graphData: sampleGraphData.sales,
    graphColor: 'hsl(142, 76%, 36%)',
  },
  {
    key: 'spend',
    label: 'Total Spend',
    value: '€42.5K',
    badgeValue: '85% of budget',
    badgeVariant: 'default',
    graphData: sampleGraphData.spend,
    graphColor: 'hsl(221, 83%, 53%)',
  },
  {
    key: 'roas',
    label: 'ROAS',
    value: '4.7x',
    badgeValue: '+0.8x',
    badgeVariant: 'success',
    graphData: sampleGraphData.roas,
    graphColor: 'hsl(262, 83%, 58%)',
  },
  {
    key: 'iroas',
    label: 'iROAS',
    value: '4.2x',
    badgeValue: '+1.4x',
    badgeVariant: 'success',
    graphData: sampleGraphData.iroas,
    graphColor: 'hsl(262, 83%, 58%)',
  },
  {
    key: 'reach',
    label: 'Reach',
    value: '850K',
    badgeValue: '+102%',
    badgeVariant: 'success',
    graphData: sampleGraphData.reach,
    graphColor: 'hsl(142, 76%, 36%)',
  },
  {
    key: 'ctr',
    label: 'Click-through Rate',
    value: '5.8%',
    badgeValue: '+53%',
    badgeVariant: 'success',
    graphData: sampleGraphData.ctr,
    graphColor: 'hsl(262, 83%, 58%)',
  },
  {
    key: 'conversionRate',
    label: 'Conversion Rate',
    value: '4.0%',
    badgeValue: '+60%',
    badgeVariant: 'success',
    graphData: sampleGraphData.conversionRate,
    graphColor: 'hsl(262, 83%, 58%)',
  },
  {
    key: 'cpa',
    label: 'Cost per Acquisition',
    value: '€18',
    badgeValue: '-36%',
    badgeVariant: 'success',
    graphData: sampleGraphData.cpa,
    graphColor: 'hsl(221, 83%, 53%)',
  },
];

const meta: Meta<typeof MetricRow> = {
  title: 'UI/Metric Row',
  component: MetricRow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A configurable row of metric cards with add and remove functionality. Users can select which metrics to display from a pool of available metrics.',
      },
    },
  },
  argTypes: {
    maxVisible: {
      control: { type: 'number', min: 2, max: 6 },
      description: 'Maximum number of visible metric cards',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricRow>;

export const Default: Story = {
  args: {
    metrics: allMetrics,
    selectedKeys: ['sales', 'spend', 'roas'],
    maxVisible: 4,
  },
};

export const FourMetrics: Story = {
  args: {
    metrics: allMetrics,
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 5,
  },
};

export const SingleMetric: Story = {
  args: {
    metrics: allMetrics,
    selectedKeys: ['sales'],
    maxVisible: 4,
  },
};

export const MaxCapacity: Story = {
  args: {
    metrics: allMetrics.slice(0, 4),
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'When all slots are filled, the add button is hidden.',
      },
    },
  },
};

const InteractiveTemplate = () => {
  const [selected, setSelected] = useState(['sales', 'spend', 'roas']);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Selected: {selected.join(', ')} | Hover over a card to see the remove button.
      </p>
      <MetricRow
        metrics={allMetrics}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        maxVisible={4}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive example with controlled state. Add and remove metrics dynamically.',
      },
    },
  },
};

export const DefaultVariantCards: Story = {
  args: {
    metrics: allMetrics.slice(0, 4).map(m => ({ ...m, variant: 'default' as const })),
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 5,
    defaultVariant: 'default',
    removable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Metric cards with the default variant (no sparklines). Cards are not removable.',
      },
    },
  },
};

const WithActiveSelectionTemplate = () => {
  const [selected] = useState(['sales', 'spend', 'roas', 'iroas']);
  const [activeKey, setActiveKey] = useState<string | null>('sales');

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Active metric: {activeKey ?? 'none'} | Click a card to toggle its selection indicator.
      </p>
      <MetricRow
        metrics={allMetrics}
        selectedKeys={selected}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        activeKey={activeKey}
        onActiveKeyChange={setActiveKey}
      />
    </div>
  );
};

export const WithActiveSelection: Story = {
  render: () => <WithActiveSelectionTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Cards with active selection indicator (arrow). Click a card to select it for chart filtering. Used in campaign detail templates.',
      },
    },
  },
};

const dialogOnlyMetrics: MetricDefinition[] = [
  { key: 'ctr', label: 'Click-Through Rate', value: '2.14%', subMetric: 'vs. 1.98% last period', badgeValue: '+8.1%', badgeVariant: 'success' },
  { key: 'convRate', label: 'Conversion Rate', value: '3.84%', subMetric: '1,156 conversions', badgeValue: '+12.8%', badgeVariant: 'success' },
  { key: 'cpc', label: 'Cost Per Click', value: '$0.45', subMetric: 'vs. $0.52 target', badgeValue: '-13.5%', badgeVariant: 'success' },
  { key: 'viewability', label: 'Viewability Rate', value: '89.2%', subMetric: 'Above industry avg', badgeValue: '+6.4%', badgeVariant: 'success' },
  { key: 'brandLift', label: 'Brand Lift', value: '+16.8%', subMetric: 'Awareness increase', badgeValue: 'High', badgeVariant: 'info' },
  { key: 'sov', label: 'Share of Voice', value: '29.5%', subMetric: 'In category', badgeValue: '+1.8%', badgeVariant: 'secondary' },
];

export const StaticDisplayWithDialog: Story = {
  args: {
    metrics: allMetrics.slice(0, 4).map(m => ({ ...m, variant: 'default' as const })),
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 5,
    defaultVariant: 'default',
    removable: false,
    dialogMetrics: dialogOnlyMetrics,
    onDialogMetricClick: (key: string) => console.log(`${key} selected from dialog`),
  },
  parameters: {
    docs: {
      description: {
        story: 'Static display with non-removable cards and a dialog showing additional metrics. The dialog metrics are separate from the visible pool.',
      },
    },
  },
};
