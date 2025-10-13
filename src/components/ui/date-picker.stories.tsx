import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker, DateRangePicker } from './date-picker';
import { DateRange } from 'react-day-picker';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        placeholder="Pick a date"
      />
    );
  },
};

export const WithSelectedDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <DatePicker
        date={date}
        onDateChange={(newDate) => setDate(newDate || new Date())}
        placeholder="Pick a date"
      />
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        placeholder="Select your birthday"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        placeholder="Pick a date"
        disabled={true}
      />
    );
  },
};

export const WithCustomStyling: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <DatePicker
        date={date}
        onDateChange={setDate}
        placeholder="Pick a date"
        className="w-[300px]"
      />
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="space-y-4">
        <DatePicker
          date={date}
          onDateChange={setDate}
          placeholder="Pick a date"
        />
        <div className="text-sm text-muted-foreground">
          Selected date: {date ? date.toLocaleDateString() : 'None'}
        </div>
      </div>
    );
  },
};

export const MultipleDatePickers: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            date={startDate}
            onDateChange={setStartDate}
            placeholder="Start date"
          />
          <DatePicker
            date={endDate}
            onDateChange={setEndDate}
            placeholder="End date"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Date range: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
        </div>
      </div>
    );
  },
};

// Range picker stories
export const RangePickerDefault: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        placeholder="Pick a date range"
      />
    );
  },
};

export const RangePickerWithPresets: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <div className="space-y-4">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          placeholder="Pick a date range"
          showPresets={true}
        />
        <div className="text-sm text-muted-foreground">
          Selected range: {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
        </div>
      </div>
    );
  },
};

export const RangePickerWithSelectedRange: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    return (
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        placeholder="Pick a date range"
        showPresets={true}
      />
    );
  },
};

export const RangePickerCustomWidth: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        placeholder="Pick a date range"
        showPresets={true}
        className="w-[400px]"
      />
    );
  },
};

export const RangePickerDisabled: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        placeholder="Pick a date range"
        disabled={true}
        showPresets={true}
      />
    );
  },
};

export const RangePickerWithConversionWindow: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [conversionWindow, setConversionWindow] = useState<number>(14);
    return (
      <div className="space-y-4">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          placeholder="Pick a date range with conversion window"
          showPresets={true}
          showConversionWindow={true}
          conversionWindow={conversionWindow}
          onConversionWindowChange={setConversionWindow}
        />
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Selected range: {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}</div>
          <div>Conversion window: {conversionWindow} days</div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
# Date Range Picker with Conversion Window

This variant combines presets with conversion window options. The conversion window appears below the calendar months and allows users to select 7, 14, 21, or 28 days for attribution window settings.

## Features

- **Preset Selection**: Quick date range selections
- **Two Month Calendar**: Side-by-side month view
- **Conversion Window**: 4 button options (7, 14, 21, 28 days)
- **Visual Feedback**: Selected conversion window is highlighted
- **Responsive Layout**: Conversion window buttons adapt to container width

## Use Cases

- Campaign attribution settings
- Analytics reporting windows
- Performance measurement periods
- ROI calculation timeframes
        `,
      },
    },
  },
};

export const ComparisonShowcase: Story = {
  render: () => {
    const [singleDate, setSingleDate] = useState<Date>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Single Date Picker</h3>
          <DatePicker
            date={singleDate}
            onDateChange={setSingleDate}
            placeholder="Select a single date"
          />
        </div>

                 <div className="space-y-2">
           <h3 className="text-lg font-semibold">Range Date Picker</h3>
           <DateRangePicker
             dateRange={dateRange}
             onDateRangeChange={(range) => setDateRange(range)}
             placeholder="Select a date range"
           />
         </div>

         <div className="space-y-2">
           <h3 className="text-lg font-semibold">Range Date Picker with Presets</h3>
           <DateRangePicker
             dateRange={dateRange}
             onDateRangeChange={(range) => setDateRange(range)}
             placeholder="Select a date range"
             showPresets={true}
           />
        </div>
      </div>
    );
  },
}; 