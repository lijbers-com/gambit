import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Viewbar } from './viewbar';

const meta: Meta<typeof Viewbar> = {
  title: 'UI/Viewbar',
  component: Viewbar,
};
export default meta;

type Story = StoryObj<typeof Viewbar>;

export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState('booked');
    return (
      <div className="p-8 bg-background">
        <Viewbar
          labels={[
            { label: '30 campaigns in-option', color: 'muted' },
            { label: '20 closed-won campaigns', color: 'success' },
          ]}
          tabs={[
            { value: 'booked', label: 'Booked Campaigns' },
            { value: 'stores', label: 'Available Stores' },
            { value: 'reach', label: 'Available Reach' },
            { value: 'fill', label: 'Fill rate' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    );
  },
}; 