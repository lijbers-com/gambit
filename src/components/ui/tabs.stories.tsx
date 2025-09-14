import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      page: null,
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-full max-w-xl">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Performance</TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
        <TabsTrigger value="tab4" disabled>Disabled</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4">Overview content goes here.</div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4">Performance content goes here.</div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4">Settings content goes here.</div>
      </TabsContent>
      <TabsContent value="tab4">
        <div className="p-4">Disabled tab content (should not be visible).</div>
      </TabsContent>
    </Tabs>
  ),
}; 