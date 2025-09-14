import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PageHeader } from './page-header';
import { Button } from './button';
import { DateRangePicker } from './date-picker';
import { DateRange } from 'react-day-picker';

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'PageHeader Title',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'PageHeader Title',
    subtitle: 'PageHeader Subtitle',
  },
};

export const WithHeaderRight: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    return (
      <PageHeader
        title="PageHeader Title"
        subtitle="PageHeader Subtitle"
        headerRight={
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="Pick a date range"
            showPresets={true}
          />
        }
      />
    );
  },
  args: { title: '' },
};

export const WithDropdownActions: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    return (
      <PageHeader
        title="PageHeader with Actions"
        subtitle="Built-in dropdown menu with Edit, Export, Import, and Settings"
        headerRight={
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="Pick a date range"
            showPresets={true}
          />
        }
        onEdit={() => alert('Edit clicked')}
        onExport={() => alert('Export clicked')}
        onImport={() => alert('Import clicked')}
        onSettings={() => alert('Settings clicked')}
      />
    );
  },
  args: { title: '' },
};

export const WithoutOptionsMenu: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    return (
      <PageHeader
        title="PageHeader without Options"
        subtitle="Options menu can be disabled"
        headerRight={
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="Pick a date range"
            showPresets={true}
          />
        }
        showOptionsMenu={false}
      />
    );
  },
  args: { title: '' },
};

 