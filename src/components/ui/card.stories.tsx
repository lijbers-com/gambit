import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardWithTabs, CardSummary, CardSummaryContent } from './card';
import { Button } from './button';
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