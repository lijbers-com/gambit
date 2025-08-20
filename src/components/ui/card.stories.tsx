import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardWithTabs, CardSummary, CardSummaryContent, MetricCard } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Table } from './table';
import { Checkbox } from './checkbox';
import React from 'react';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where you can put any content you want.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Without Footer</CardTitle>
        <CardDescription>This card doesn't have a footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where you can put any content you want.</p>
      </CardContent>
    </Card>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Card content goes here. This card doesn't have a header.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Card content goes here. This card only has content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithMultipleActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Multiple Actions</CardTitle>
        <CardDescription>This card has multiple buttons in the footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where you can put any content you want.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithTabs: Story = {
  render: () => (
    <CardWithTabs
      className="w-[700px]"
      header={
        <>
          <CardTitle>Card With Tabs On Top</CardTitle>
          <CardDescription>This card has tabs and a button above, plus a header section like the standard card.</CardDescription>
        </>
      }
      tabs={[
        {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="h-32">Line-items content</div>,
        },
        {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="h-32">Creatives content</div>,
        },
        {
          label: 'Details',
          value: 'details',
          content: <div className="h-32">Details content</div>,
        },
      ]}
      action={<Button>Button component</Button>}
    />
  ),
};

export const Summary: Story = {
  render: () => (
    <CardSummary className="w-[350px]">
      <CardHeader>
        <CardTitle>Creative</CardTitle>
      </CardHeader>
      <CardSummaryContent>
        <div className="mb-4">
          <div className="text-[14px] text-muted-foreground">Name</div>
          <div className="font-medium">Wobbler Knorr</div>
        </div>
        <div>
          <div className="text-[14px] text-muted-foreground">Type</div>
          <div className="font-medium">Wobbler</div>
        </div>
      </CardSummaryContent>
    </CardSummary>
  ),
};

export const MetricCardExample: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      {/* Normal state */}
      <MetricCard
        label="Add to Cart"
        value="1,465"
        subMetric="ATC: 0.44%"
        badgeValue="-12%"
        badgeVariant="destructive"
        isSelected={false}
      />

      {/* Selected state (shadow + arrow) */}
      <MetricCard
        label="Add to Cart"
        value="1,465"
        subMetric="ATC: 0.44%"
        badgeValue="-12%"
        badgeVariant="destructive"
        isSelected={true}
      />
    </div>
  ),
};

export const MetricCardWithGraph: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Graph variants with line charts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Graph Variant - Line Charts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Impressions"
            value="2,845,692"
            subMetric="CTR: 3.2%"
            badgeValue="+15%"
            badgeVariant="success"
            variant="graph"
            graphData={[
              { value: 2100000 }, { value: 2300000 }, { value: 2200000 }, { value: 2500000 }, 
              { value: 2700000 }, { value: 2600000 }, { value: 2845692 }
            ]}
            graphColor="#10b981"
          />

          <MetricCard
            label="Sales"
            value="€127,890"
            subMetric="ROAS: 3.34x"
            badgeValue="+18%"
            badgeVariant="success"
            variant="graph"
            graphData={[
              { value: 95000 }, { value: 108000 }, { value: 102000 }, { value: 115000 }, 
              { value: 122000 }, { value: 118000 }, { value: 127890 }
            ]}
            graphColor="#f59e0b"
          />

          <MetricCard
            label="Clicks"
            value="91,062"
            subMetric="CPC: €0.42"
            badgeValue="+8%"
            badgeVariant="success"
            variant="graph"
            graphData={[
              { value: 75000 }, { value: 82000 }, { value: 78000 }, { value: 85000 }, 
              { value: 88000 }, { value: 86000 }, { value: 91062 }
            ]}
            graphColor="#3b82f6"
          />
        </div>
      </div>

      {/* Graph variants with green progress bars */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Graph Variant - Progress Bars</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="CTR"
            value="3.2%"
            subMetric="Target: 2.5%"
            badgeValue="+28%"
            badgeVariant="success"
            variant="graph"
          />

          <MetricCard
            label="ROAS"
            value="4.2x"
            subMetric="Target: 3.0x"
            badgeValue="+40%"
            badgeVariant="success"
            variant="graph"
          />

          <MetricCard
            label="ATC Rate"
            value="14.1%"
            subMetric="Target: 12.0%"
            badgeValue="+18%"
            badgeVariant="success"
            variant="graph"
          />
        </div>
      </div>

      {/* Default variant for comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Add to Cart"
            value="12,847"
            subMetric="CVR: 14.1%"
            badgeValue="+22%"
            badgeVariant="success"
          />
        </div>
      </div>
    </div>
  ),
};

 