import type { Meta, StoryObj } from '@storybook/react';
import { CalendarTable } from './calendar-table';

const meta: Meta<typeof CalendarTable> = {
  title: 'UI/CalendarTable',
  component: CalendarTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Calendar Table Component

A specialized table component for displaying media product availability across weeks with booking management capabilities.

## Features

- **Week-based Layout**: Display availability data across multiple weeks
- **Expandable Rows**: Click to expand and view bookings/placements
- **Retailer Events**: Optional event calendar with visual indicators
- **Metric Indicators**: Different icons based on display type
- **Booking Timeline**: Visual representation of bookings across weeks
- **Availability States**: Color-coded cells based on availability percentage

## Availability States

The availability cells are color-coded based on the percentage value:

- **Green** (Available): 100% to 11% - Indicates good availability
- **Grey** (No Availability): 10% to 0% - No available inventory
- **Orange** (Warning): "MC" (Multi Client) - Unknown availability status
- **Red** (Overbooked): -1% to -100% - Overbooked status

The text, eye icon, and bottom border (when events are present) all use the same color for consistency.

## Display Types

The CalendarTable supports different metric types with corresponding icons:

- **Reach**: Eye icon - Shows impression/reach metrics (default)
- **Fill Rate**: Percent icon - Shows fill rate percentages  
- **Revenue**: Euro icon - Shows revenue figures
- **Stores**: Store icon - Shows store counts
- **Players**: TV icon - Shows digital player counts

## Booking States

Bookings in expanded rows use different badge variants to indicate their status:

- **Default** (Grey): Confirmed and closed-won bookings
- **Warning** (Orange): In-option bookings that are not yet confirmed

## Usage

\`\`\`tsx
import { CalendarTable } from '@/components/ui/calendar-table';

<CalendarTable
  mediaProducts={products}
  weeks={6}
  startWeek={1}
  retailerEvents={events}
  showReach={true}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    weeks: {
      control: { type: 'number', min: 1, max: 52 },
      description: 'Number of weeks to display',
    },
    startWeek: {
      control: { type: 'number', min: 1, max: 52 },
      description: 'Starting week number',
    },
    showReach: {
      control: 'boolean',
      description: 'Show metric indicator icon',
    },
    displayType: {
      control: { type: 'select' },
      options: ['reach', 'fillRate', 'revenue', 'stores', 'players'],
      description: 'Type of metric being displayed with corresponding icon',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for 8 weeks
const mockMediaProducts = [
  {
    id: '1',
    name: 'No zone',
    availability: [85, 50, 25, 8, 0, -10, -50, 100], // Demonstrates all states: green, grey, orange, red
    bookings: [
      {
        id: 'booking-14',
        name: 'Unilever - New Year Campaign',
        startWeek: 1,
        endWeek: 3,
        stores: 500,
        variant: 'default',
      },
      {
        id: 'booking-1',
        name: 'Coco cola - Single Week',
        startWeek: 2,
        endWeek: 2,
        stores: 400,
        variant: 'default',
      },
      {
        id: 'booking-2',
        name: 'Albert Heijn - Holiday Campaign',
        startWeek: 3,
        endWeek: 5,
        stores: 600,
        variant: 'warning',
      },
      {
        id: 'booking-9',
        name: 'Jumbo - Competing Holiday Offer',
        startWeek: 4,
        endWeek: 6,
        stores: 450,
        variant: 'default',
      },
      {
        id: 'booking-3',
        name: 'Nike - Back to School',
        startWeek: 6,
        endWeek: 8,
        stores: 400,
        variant: 'default',
      },
    ],
  },
  {
    id: '2',
    name: 'AH to go',
    availability: [95, 60, 15, 5, 0, -5, -25, 75],
    bookings: [
      {
        id: 'booking-4',
        name: 'Samsung - Tech Week Promo',
        startWeek: 1,
        endWeek: 3,
        stores: 300,
        variant: 'default',
      },
      {
        id: 'booking-6',
        name: 'Apple - iPhone Launch',
        startWeek: 2,
        endWeek: 4,
        stores: 250,
        variant: 'warning',
      },
      {
        id: 'booking-10',
        name: 'Google - Pixel Campaign',
        startWeek: 3,
        endWeek: 5,
        stores: 200,
        variant: 'default',
      },
    ],
  },
  {
    id: '3',
    name: 'Dranken',
    availability: [40, 90, 12, 3, 0, -15, -80, 55],
    bookings: [
      {
        id: 'booking-5',
        name: 'Heineken - Summer Festival',
        startWeek: 4,
        endWeek: 6,
        stores: 500,
        variant: 'default',
      },
      {
        id: 'booking-7',
        name: 'Coca Cola - Refresh Campaign',
        startWeek: 5,
        endWeek: 7,
        stores: 400,
        variant: 'warning',
      },
      {
        id: 'booking-8',
        name: 'Pepsi - Counter Campaign',
        startWeek: 6,
        endWeek: 8,
        stores: 350,
        variant: 'default',
      },
    ],
  },
  {
    id: '4',
    name: 'Brood',
    availability: [70, 20, 8, 2, 0, -30, -60, 45],
    bookings: [
      {
        id: 'booking-11',
        name: 'Wonder - Fresh Bread Campaign',
        startWeek: 2,
        endWeek: 4,
        stores: 150,
        variant: 'warning',
      },
      {
        id: 'booking-12',
        name: 'Hovis - Healthy Living',
        startWeek: 3,
        endWeek: 6,
        stores: 180,
        variant: 'default',
      },
      {
        id: 'booking-13',
        name: 'Warburtons - Family Pack',
        startWeek: 5,
        endWeek: 7,
        stores: 220,
        variant: 'default',
      },
    ],
  },
];

const mockReachData = [
  {
    id: '1',
    name: 'No zone',
    availability: ['0', 'MC', '0', '40K', '100K', '100K', '80K', '60K'],
    isHighlighted: [false, false, false, false, true, true, true, false],
    bookings: [
      {
        id: 'booking-1',
        name: 'Unilever - Brand Awareness',
        startWeek: 2,
        endWeek: 4,
        stores: 400,
        variant: 'default',
      },
      {
        id: 'booking-2',
        name: 'Nestle - Product Launch',
        startWeek: 5,
        endWeek: 6,
        stores: 350,
        variant: 'warning',
      },
      {
        id: 'booking-3',
        name: 'P&G - Seasonal Campaign',
        startWeek: 7,
        endWeek: 8,
        stores: 400,
        variant: 'default',
      },
    ],
  },
  {
    id: '2',
    name: 'AH to go',
    availability: ['0', 'MC', '0', '60K', '60K', '100K', '90K', '70K'],
    isHighlighted: [false, false, false, false, false, true, true, false],
  },
  {
    id: '3',
    name: 'Dranken',
    availability: ['0', 'MC', '0', '40K', '60K', '100K', '85K', '65K'],
    isHighlighted: [false, false, false, false, false, true, true, false],
  },
  {
    id: '4',
    name: 'Brood',
    availability: ['0', '0', '0', '60K', '60K', '100K', '80K', '60K'],
    isHighlighted: [false, false, false, false, false, true, true, false],
  },
];

const mockRetailerEvents = [
  { week: 3, name: 'WORP....' },
  { week: 4, name: 'Week van de koffie' },
  { week: 5, name: 'Week van de koffie' }, // Multi-week event
  { week: 6, name: 'Summer Sale' },
  { week: 7, name: 'Summer Sale' }, // Multi-week event
  { week: 6, name: 'Back to School' }, // Overlapping event
  { week: 7, name: 'Back to School' },
  { week: 8, name: 'Back to School' },
];

export const Default: Story = {
  args: {
    mediaProducts: mockMediaProducts,
    weeks: 8,
    startWeek: 1,
    showReach: true,
    displayType: 'reach',
  },
};

export const WithReach: Story = {
  args: {
    mediaProducts: mockReachData,
    weeks: 8,
    startWeek: 1,
    showReach: true,
    displayType: 'reach',
  },
};

export const WithRetailerEvents: Story = {
  args: {
    mediaProducts: mockReachData,
    weeks: 8,
    startWeek: 1,
    retailerEvents: mockRetailerEvents,
    showReach: true,
    displayType: 'reach',
  },
};

export const FillRateView: Story = {
  args: {
    mediaProducts: mockMediaProducts,
    weeks: 8,
    startWeek: 1,
    showReach: true,
    displayType: 'fillRate',
  },
};

export const RevenueView: Story = {
  args: {
    mediaProducts: mockReachData,
    weeks: 8,
    startWeek: 1,
    showReach: true,
    displayType: 'revenue',
  },
};

export const StoresView: Story = {
  args: {
    mediaProducts: mockMediaProducts,
    weeks: 8,
    startWeek: 1,
    showReach: true,
    displayType: 'stores',
  },
};

export const PlayersView: Story = {
  args: {
    mediaProducts: mockMediaProducts,
    weeks: 8,
    startWeek: 1,
    showReach: true,
    displayType: 'players',
  },
};

export const ManyWeeks: Story = {
  args: {
    mediaProducts: [
      {
        id: '1',
        name: 'Display - Homepage Banner',
        availability: Array(12).fill(0).map((_, i) => {
          if (i < 3) return 50;
          if (i < 6) return 25;
          if (i < 9) return 5;
          return 0;
        }),
        bookings: [
          {
            id: 'booking-1',
            name: 'Summer Campaign - Nike',
            startWeek: 1,
            endWeek: 4,
            stores: 800,
            variant: 'default',
          },
          {
            id: 'booking-2',
            name: 'Back to School - Adidas',
            startWeek: 7,
            endWeek: 9,
            stores: 600,
            variant: 'warning',
          },
        ],
      },
      {
        id: '2',
        name: 'Digital In-store - Entrance Screen',
        availability: Array(12).fill(0).map((_, i) => {
          if (i < 4) return 80;
          if (i < 8) return 15;
          return 0;
        }),
      },
      {
        id: '3',
        name: 'Sponsored Products - Search Results',
        availability: Array(12).fill(0).map((_, i) => {
          return Math.max(-10, 100 - i * 10);
        }),
      },
    ],
    weeks: 12,
    startWeek: 1,
    showReach: true,
    displayType: 'fillRate',
  },
};

export const WithHighlightedEvents: Story = {
  args: {
    mediaProducts: mockReachData.map(product => ({
      ...product,
      isHighlighted: product.availability.map((_, i) => i >= 3),
    })),
    weeks: 6,
    startWeek: 1,
    retailerEvents: [
      { week: 3, name: 'WORP....' },
      { week: 4, name: 'Week van de koffie' },
      { week: 5, name: 'Summer Sale' },
      { week: 6, name: 'Back to School' },
    ],
    showReach: true,
    displayType: 'revenue',
  },
};

export const CustomStartWeek: Story = {
  args: {
    mediaProducts: mockMediaProducts,
    weeks: 6,
    startWeek: 48,
    retailerEvents: [
      { week: 51, name: 'Kerstmis' },
      { week: 52, name: 'Oud & Nieuw' },
      { week: 1, name: 'Nieuwjaar' },
    ],
    showReach: true,
    displayType: 'stores',
  },
};