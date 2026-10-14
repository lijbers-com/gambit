import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { BookingCalendarPage, type CalendarEngine } from './booking-calendar';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Bookings Calendar',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Booking calendars

One page per proposition, all built the same way (see \`booking-calendar.tsx\`):

- **Rows** are the media products configured for the proposition, expandable into their positions.
- **Every cell** is read from the inventory model (\`lib/db/inventory.ts\`) over the system's own bookings: fill rate, available stores, available time, impressions and revenue describe the same bookings the cell drawer lists, and a booking's availability check reads the same numbers.
- **Event bars** are the dated pricing rules (seasons and retail moments) that apply to the proposition.
- **The frame** opens on the prototype's today (30 July 2026), twelve weeks long.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const calendar = (engine: CalendarEngine, name: string): Story => ({
  name,
  render: () => (
    <MenuContextProvider>
      <BookingCalendarPage engine={engine} />
    </MenuContextProvider>
  ),
});

export const DisplayCalendar = calendar('display', 'Display Calendar');
export const SponsoredProductCalendar = calendar('sponsored-products', 'Sponsored Product Calendar');
export const DigitalInstoreCalendar = calendar('digital-instore', 'Digital In-store Calendar');
export const OfflineInstoreCalendar = calendar('offline-instore', 'Offline In-store Calendar');
