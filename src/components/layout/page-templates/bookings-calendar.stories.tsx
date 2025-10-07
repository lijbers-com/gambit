import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CalendarTable } from '@/components/ui/calendar-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { Viewbar } from '@/components/ui/viewbar';
import { DateRangePicker } from '@/components/ui/date-picker';
import { 
  RightDrawer, 
  RightDrawerTrigger, 
  RightDrawerContent, 
  RightDrawerHeader, 
  RightDrawerTitle, 
  RightDrawerDescription, 
  RightDrawerBody 
} from '@/components/ui/right-drawer';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { defaultRoutes } from '../default-routes';
import React, { useState } from 'react';
import { DateRange } from "react-day-picker";
import { differenceInWeeks, startOfWeek, getWeek } from "date-fns";

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Bookings Calendar',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Bookings Calendar Page Templates

The Bookings Calendar page templates provide comprehensive calendar views of all media bookings across different weeks, organized by engine types. Each template serves as a specialized booking management interface for different media categories.

## Engine Types

### 1. General Bookings Calendar
The main booking calendar template with mixed media products across all categories.

### 2. Offline In-store Calendar
Focuses on traditional in-store media placements and promotional displays:
- End Cap Displays, Shelf Talkers, Floor Graphics
- Promotional Stands, In-store Sampling, Window Displays

### 3. Digital In-store Calendar  
Focuses on digital screens, interactive displays, and technology-driven in-store media:
- Digital Screens, Interactive Kiosks, Smart Shelf Displays
- Checkout Digital Screens, Audio System, Digital Wayfinding

### 4. Display Calendar
Focuses on out-of-home display advertising and outdoor promotional displays:
- Digital Billboards, Static Billboards, Building Wraps
- Transit Displays, Street Furniture, LED Screens

### 5. Sponsored Product Calendar
Focuses on product placement, sponsored listings, and paid promotional opportunities:
- Featured Product Placement, Search Sponsored Results, Category Sponsorship
- Recommendation Engine, Email Newsletter Sponsorship, App Banner Placement

## Features

- **Calendar View**: Displays booking information in a week-based calendar format
- **View Tabs**: Easy switching between different metric types (Reach, Revenue, Fill Rate, Available Stores)
- **Advanced Filtering**: Multi-select filters for Status, Store assortment, Store type, and Media product
- **Expandable Rows**: Click to expand and view detailed bookings for each media product
- **Commercial Events**: Integrated event calendar with retailer events (5 events spanning 3-5 weeks each)
- **Multiple Display Types**: Support for different metrics (reach, fill rate, revenue, stores, players)
- **Status Indicators**: Color-coded availability states and booking statuses
- **Responsive Design**: Calendar adapts to different screen sizes
- **Right Drawer**: Detailed booking information panel with filtering and table view

## Display Types

The calendar supports different metric types with corresponding icons:

- **Reach**: Eye icon - Shows impression/reach metrics
- **Fill Rate**: Percent icon - Shows fill rate percentages  
- **Revenue**: Euro icon - Shows revenue figures
- **Stores**: Store icon - Shows store counts
- **Players**: TV icon - Shows digital player counts

## Availability States

- **Green** (Available): 100% to 11% - Indicates good availability
- **Grey** (No Availability): 10% to 0% - No available inventory
- **Orange** (Warning): "MC" (Multi Client) - Unknown availability status
- **Red** (Overbooked): -1% to -100% - Overbooked status

## Booking States

- **Default** (Grey): Confirmed and closed-won bookings
- **Warning** (Orange): In-option bookings that are not yet confirmed

## Usage

These templates are ideal for:
- Engine-specific media booking management
- Availability planning and forecasting
- Campaign scheduling and optimization
- Inventory management across time periods
- Multi-engine campaign coordination

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- ViewBar (tab-based view switching)
- FilterBar (filtering and search interface)
- CalendarTable (calendar-based data display with bookings)
- RightDrawer (detailed booking information panel)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock retailer events - 5 events spanning 3-5 weeks each
const retailerEvents = [
  // Spring Sale (3 weeks: weeks 1-3)
  { week: 1, name: 'Spring Sale' },
  { week: 2, name: 'Spring Sale' },
  { week: 3, name: 'Spring Sale' },
  
  // Summer Campaign (4 weeks: weeks 3-6)
  { week: 3, name: 'Summer Campaign' },
  { week: 4, name: 'Summer Campaign' },
  { week: 5, name: 'Summer Campaign' },
  { week: 6, name: 'Summer Campaign' },
  
  // Back to School (5 weeks: weeks 5-9)
  { week: 5, name: 'Back to School' },
  { week: 6, name: 'Back to School' },
  { week: 7, name: 'Back to School' },
  { week: 8, name: 'Back to School' },
  { week: 9, name: 'Back to School' },
  
  // Holiday Season (4 weeks: weeks 8-11)
  { week: 8, name: 'Holiday Season' },
  { week: 9, name: 'Holiday Season' },
  { week: 10, name: 'Holiday Season' },
  { week: 11, name: 'Holiday Season' },
  
  // Year End Clearance (3 weeks: weeks 10-12)
  { week: 10, name: 'Year End Clearance' },
  { week: 11, name: 'Year End Clearance' },
  { week: 12, name: 'Year End Clearance' },
];

// Shared component for booking calendar functionality
const BookingCalendarTemplate = ({ 
  bookingsData, 
  title,
  mediaProductOptions 
}: { 
  bookingsData: any[], 
  title: string,
  mediaProductOptions: Array<{ label: string, value: string }>
}) => {
  const [status, setStatus] = useState<string[]>([]);
  const [storeAssortment, setStoreAssortment] = useState<string[]>([]);
  const [storeType, setStoreType] = useState<string[]>([]);
  const [mediaProduct, setMediaProduct] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    mediaProduct: any;
    weekNumber: number;
    value: number | string;
  } | null>(null);
  const [activeView, setActiveView] = useState('reach');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().getTime() + 11 * 7 * 24 * 60 * 60 * 1000) // 12 weeks from now
  });
  
  const viewTabs = [
    { value: 'reach', label: 'Reach' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'fillRate', label: 'Fill Rate' },
    { value: 'stores', label: 'Available Stores' },
  ];
  
  // Calculate weeks to show and start week from date range
  const getCalendarWeeks = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) {
      // Default to 8 weeks starting from current week
      const now = new Date();
      return {
        startWeek: getWeek(startOfWeek(now, { weekStartsOn: 1 })),
        numberOfWeeks: 8
      };
    }
    
    const from = startOfWeek(range.from, { weekStartsOn: 1 });
    const to = startOfWeek(range.to, { weekStartsOn: 1 });
    const weeksDiff = differenceInWeeks(to, from) + 1; // +1 to include both start and end weeks
    
    return {
      startWeek: getWeek(from),
      numberOfWeeks: Math.max(1, Math.min(weeksDiff, 52)) // Limit to between 1 and 52 weeks
    };
  };
  
  const { startWeek, numberOfWeeks } = getCalendarWeeks(dateRange);

  // Handle cell click to open drawer
  const handleCellClick = (mediaProduct: any, weekNumber: number, value: number | string) => {
    setSelectedCell({ mediaProduct, weekNumber, value });
    setDrawerOpen(true);
  };

  // Get bookings for the selected week
  const getBookingsForWeek = () => {
    if (!selectedCell) return [];
    
    return filteredBookingsData.reduce((allBookings: any[], product) => {
      if (product.bookings) {
        const weekBookings = product.bookings.filter((booking: any) =>
          booking.startWeek <= selectedCell.weekNumber && booking.endWeek >= selectedCell.weekNumber
        );
        return [...allBookings, ...weekBookings.map((booking: any) => ({
          ...booking,
          mediaProductName: product.name
        }))];
      }
      return allBookings;
    }, []);
  };

  
  // Adjust retailer events to match the actual week range
  const adjustedRetailerEvents = retailerEvents.map(event => ({
    ...event,
    week: startWeek + event.week - 1
  }));
  
  // Adjust bookings data to match the actual week range  
  const adjustedBookingsData = bookingsData.map(product => ({
    ...product,
    bookings: product.bookings?.map((booking: any) => ({
      ...booking,
      startWeek: startWeek + booking.startWeek - 1,
      endWeek: startWeek + booking.endWeek - 1,
    }))
  }));
  
  // Filter the adjusted bookings data based on selected filters
  const filteredBookingsData = adjustedBookingsData.filter(product => {
    // Media product filter
    if (mediaProduct.length > 0 && !mediaProduct.includes(product.id)) {
      return false;
    }
    
    // Store type filter
    if (storeType.length > 0 && !storeType.some(type => product.storeTypes?.includes(type))) {
      return false;
    }
    
    // Store assortment (retail products) filter
    if (storeAssortment.length > 0 && !storeAssortment.some(retailProduct => product.retailProducts?.includes(retailProduct))) {
      return false;
    }
    
    // If no booking-level filters are selected, include this media product
    if (status.length === 0) {
      return true;
    }
    
    // Status filter - check if any bookings match the status filter
    const hasMatchingBookings = product.bookings?.some((booking: any) =>
      status.length === 0 || status.includes(booking.status || '')
    );
    
    return hasMatchingBookings;
  }).map(product => {
    // For media products that pass the filter, also filter their bookings by status
    if (status.length > 0 && product.bookings) {
      return {
        ...product,
        bookings: product.bookings.filter((booking: any) =>
          status.includes(booking.status || '')
        )
      };
    }
    return product;
  });
  
  return (
    <RightDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
              showPresets={true}
              className="w-[280px]"
            />
          ),
        }}
      >
        <Card className="w-full">
          <CardHeader>
            <div className="mb-4">
              <Viewbar
                tabs={viewTabs}
                activeTab={activeView}
                onTabChange={setActiveView}
                labels={[]}
              />
            </div>
            <FilterBar
              filters={[
                {
                  name: 'Status',
                  options: [
                    { label: 'Closed-won', value: 'closed-won' },
                    { label: 'In option', value: 'in-option' },
                  ],
                  selectedValues: status,
                  onChange: setStatus,
                },
                {
                  name: 'Store assortment',
                  options: [
                    { label: 'RP-001 - Coca-Cola Classic 330ml', value: 'rp-001' },
                    { label: 'RP-002 - iPhone 15 Pro 128GB', value: 'rp-002' },
                    { label: 'RP-003 - Samsung Galaxy S24 256GB', value: 'rp-003' },
                    { label: 'RP-004 - Nike Air Max 90 White', value: 'rp-004' },
                    { label: 'RP-005 - Adidas Ultraboost 22 Black', value: 'rp-005' },
                    { label: 'RP-006 - L\'Oreal Paris Mascara', value: 'rp-006' },
                    { label: 'RP-007 - Nivea Body Lotion 400ml', value: 'rp-007' },
                    { label: 'RP-008 - Heineken Beer 6-pack', value: 'rp-008' },
                    { label: 'RP-009 - Red Bull Energy Drink 250ml', value: 'rp-009' },
                    { label: 'RP-010 - PlayStation 5 Console', value: 'rp-010' },
                    { label: 'RP-011 - LEGO Creator Expert Set', value: 'rp-011' },
                    { label: 'RP-012 - Dyson V15 Vacuum Cleaner', value: 'rp-012' },
                    { label: 'RP-013 - KitchenAid Stand Mixer', value: 'rp-013' },
                    { label: 'RP-014 - Philips LED Smart Bulb', value: 'rp-014' },
                    { label: 'RP-015 - Nespresso Coffee Machine', value: 'rp-015' },
                    { label: 'RP-016 - Ben & Jerry\'s Ice Cream 500ml', value: 'rp-016' },
                    { label: 'RP-017 - Nutella Hazelnut Spread 750g', value: 'rp-017' },
                    { label: 'RP-018 - Kellogg\'s Corn Flakes 500g', value: 'rp-018' },
                    { label: 'RP-019 - Gillette Razor Blades 8-pack', value: 'rp-019' },
                    { label: 'RP-020 - Oral-B Electric Toothbrush', value: 'rp-020' },
                  ],
                  selectedValues: storeAssortment,
                  onChange: setStoreAssortment,
                },
                {
                  name: 'Store type',
                  options: [
                    { label: 'To Go', value: 'to-go' },
                    { label: 'XL', value: 'xl' },
                    { label: 'Express', value: 'express' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'Compact', value: 'compact' },
                  ],
                  selectedValues: storeType,
                  onChange: setStoreType,
                },
              ]}
              hideSearch={true}
            />
          </CardHeader>
          <CardContent>
            <CalendarTable
              mediaProducts={filteredBookingsData}
              weeks={numberOfWeeks}
              startWeek={startWeek}
              retailerEvents={adjustedRetailerEvents}
              showReach={true}
              displayType={
                activeView === 'bookedCampaigns' ? 'fillRate' : 
                activeView === 'stores' ? 'stores' : 
                'reach'
              }
              onCellClick={handleCellClick}
            />
          </CardContent>
        </Card>

        <RightDrawerContent>
          <RightDrawerHeader>
            <RightDrawerTitle>
              {selectedCell?.mediaProduct?.name || 'Bookings'} - Week {selectedCell?.weekNumber}
            </RightDrawerTitle>
            <RightDrawerDescription>
              Availability: {selectedCell?.value} | All bookings for this week
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-6">
              <Viewbar
                tabs={viewTabs}
                activeTab={activeView}
                onTabChange={setActiveView}
                labels={[]}
              />
              
              <FilterBar
                filters={[
                  {
                    name: 'Status',
                    options: [
                      { label: 'Closed-won', value: 'closed-won' },
                      { label: 'In option', value: 'in-option' },
                    ],
                    selectedValues: status,
                    onChange: setStatus,
                  },
                  {
                    name: 'Store assortment',
                    options: [
                      { label: 'RP-001 - Coca-Cola Classic 330ml', value: 'rp-001' },
                      { label: 'RP-002 - iPhone 15 Pro 128GB', value: 'rp-002' },
                      { label: 'RP-003 - Samsung Galaxy S24 256GB', value: 'rp-003' },
                      { label: 'RP-004 - Nike Air Max 90 White', value: 'rp-004' },
                      { label: 'RP-005 - Adidas Ultraboost 22 Black', value: 'rp-005' },
                      { label: 'RP-006 - L\'Oreal Paris Mascara', value: 'rp-006' },
                      { label: 'RP-007 - Nivea Body Lotion 400ml', value: 'rp-007' },
                      { label: 'RP-008 - Heineken Beer 6-pack', value: 'rp-008' },
                      { label: 'RP-009 - Red Bull Energy Drink 250ml', value: 'rp-009' },
                      { label: 'RP-010 - PlayStation 5 Console', value: 'rp-010' },
                      { label: 'RP-011 - LEGO Creator Expert Set', value: 'rp-011' },
                      { label: 'RP-012 - Dyson V15 Vacuum Cleaner', value: 'rp-012' },
                      { label: 'RP-013 - KitchenAid Stand Mixer', value: 'rp-013' },
                      { label: 'RP-014 - Philips LED Smart Bulb', value: 'rp-014' },
                      { label: 'RP-015 - Nespresso Coffee Machine', value: 'rp-015' },
                      { label: 'RP-016 - Ben & Jerry\'s Ice Cream 500ml', value: 'rp-016' },
                      { label: 'RP-017 - Nutella Hazelnut Spread 750g', value: 'rp-017' },
                      { label: 'RP-018 - Kellogg\'s Corn Flakes 500g', value: 'rp-018' },
                      { label: 'RP-019 - Gillette Razor Blades 8-pack', value: 'rp-019' },
                      { label: 'RP-020 - Oral-B Electric Toothbrush', value: 'rp-020' },
                    ],
                    selectedValues: storeAssortment,
                    onChange: setStoreAssortment,
                  },
                  {
                    name: 'Store type',
                    options: [
                      { label: 'To Go', value: 'to-go' },
                      { label: 'XL', value: 'xl' },
                      { label: 'Express', value: 'express' },
                      { label: 'Premium', value: 'premium' },
                      { label: 'Compact', value: 'compact' },
                    ],
                    selectedValues: storeType,
                    onChange: setStoreType,
                  },
                  {
                    name: 'Media product',
                    options: mediaProductOptions,
                    selectedValues: mediaProduct,
                    onChange: setMediaProduct,
                  },
                ]}
                hideSearch={true}
              />
              
              <Table
                columns={[
                  { key: 'id', header: 'Booking ID' },
                  { key: 'name', header: 'Campaign Name' },
                  { key: 'mediaProductName', header: 'Media Product' },
                  { 
                    key: 'stores', 
                    header: 'Stores', 
                    render: row => <Badge variant="secondary">{row.stores}</Badge> 
                  },
                  { key: 'startWeek', header: 'Start Week' },
                  { key: 'endWeek', header: 'End Week' },
                ]}
                data={getBookingsForWeek()}
                rowKey={row => row.id}
              />
            </div>
          </RightDrawerBody>
        </RightDrawerContent>
      </AppLayout>
    </RightDrawer>
  );
};

// Mock data for general bookings calendar - mixed media products
const generalBookingsData = [
  {
    id: '1',
    name: 'Digital Display - Homepage',
    availability: [85, 60, 25, 8, 0, -10, -30, 75, 45, 30, 15, 80],
    storeTypes: ['to-go', 'xl', 'express'],
    retailProducts: ['rp-001', 'rp-002', 'rp-008'],
    bookings: [
      {
        id: 'booking-1',
        name: 'Coca Cola - Summer Campaign',
        startWeek: 1,
        endWeek: 4,
        stores: 450,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-2',
        name: 'Nike - Back to School Collection',
        startWeek: 3,
        endWeek: 7,
        stores: 320,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-3',
        name: 'Apple - iPhone 15 Launch',
        startWeek: 6,
        endWeek: 10,
        stores: 500,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-4',
        name: 'Starbucks - Holiday Collection',
        startWeek: 9,
        endWeek: 12,
        stores: 280,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '2',
    name: 'In-Store Digital - Entrance',
    availability: [95, 40, 15, 5, 0, -5, -25, 60, 35, 20, 50, 85],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-003', 'rp-010', 'rp-016'],
    bookings: [
      {
        id: 'booking-5',
        name: 'Samsung - Galaxy S24 Ultra',
        startWeek: 1,
        endWeek: 3,
        stores: 200,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-6',
        name: 'McDonald\'s - McFlurry Campaign',
        startWeek: 2,
        endWeek: 6,
        stores: 350,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-7',
        name: 'Netflix - Stranger Things S5',
        startWeek: 5,
        endWeek: 8,
        stores: 420,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-8',
        name: 'Adidas - Ultraboost 24',
        startWeek: 7,
        endWeek: 11,
        stores: 290,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-9',
        name: 'Tesla - Model Y Refresh',
        startWeek: 10,
        endWeek: 12,
        stores: 180,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '3',
    name: 'Sponsored Products',
    availability: [70, 90, 12, 3, 0, -15, -40, 45, 25, 60, 35, 70],
    storeTypes: ['to-go', 'express', 'compact'],
    retailProducts: ['rp-004', 'rp-006', 'rp-007', 'rp-017'],
    bookings: [
      {
        id: 'booking-10',
        name: 'Unilever - Dove Body Care',
        startWeek: 1,
        endWeek: 5,
        stores: 400,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-11',
        name: 'P&G - Tide Pods Campaign',
        startWeek: 3,
        endWeek: 6,
        stores: 320,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-12',
        name: 'L\'Oréal - New Foundation Line',
        startWeek: 4,
        endWeek: 9,
        stores: 280,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-13',
        name: 'Nestlé - KitKat Chunky',
        startWeek: 8,
        endWeek: 12,
        stores: 350,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '4',
    name: 'Audio Announcements',
    availability: [40, 20, 8, 2, 0, -30, -60, 35, 50, 25, 40, 65],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-008', 'rp-009', 'rp-015', 'rp-020'],
    bookings: [
      {
        id: 'booking-14',
        name: 'Heineken - UEFA Euro 2024',
        startWeek: 1,
        endWeek: 6,
        stores: 150,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-15',
        name: 'Spotify - Premium Push',
        startWeek: 4,
        endWeek: 8,
        stores: 200,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-16',
        name: 'BMW - iX Electric Campaign',
        startWeek: 7,
        endWeek: 11,
        stores: 120,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '5',
    name: 'Dranken',
    availability: [820, 750, 680, 620, 570, 520, 480, 800, 730, 670, 710, 840],
    reachData: [2250000, 1950000, 1550000, 1280000, 980000, 650000, 450000, 1750000, 2150000, 1450000, 1050000, 2550000],
    storeTypes: ['to-go', 'express', 'premium'],
    retailProducts: ['rp-011', 'rp-012', 'rp-013', 'rp-019'],
    bookings: [
      {
        id: 'booking-17',
        name: 'Mars - Snickers Limited Edition',
        startWeek: 2,
        endWeek: 7,
        stores: 380,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-18',
        name: 'Red Bull - Energy Campaign',
        startWeek: 5,
        endWeek: 9,
        stores: 250,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-19',
        name: 'PlayStation - PS5 Pro Launch',
        startWeek: 8,
        endWeek: 12,
        stores: 190,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '6',
    name: 'Parking Lot Digital',
    availability: [80, 65, 40, 20, 10, -5, -15, 55, 70, 45, 60, 85],
    storeTypes: ['xl', 'compact'],
    retailProducts: ['rp-014', 'rp-015', 'rp-018', 'rp-020'],
    bookings: [
      {
        id: 'booking-20',
        name: 'IKEA - New Store Opening',
        startWeek: 1,
        endWeek: 8,
        stores: 80,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-21',
        name: 'Uber Eats - Fast Delivery',
        startWeek: 6,
        endWeek: 10,
        stores: 120,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-22',
        name: 'Amazon Prime - Black Friday',
        startWeek: 9,
        endWeek: 12,
        stores: 200,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
];

// Mock data for offline in-store bookings
const offlineInstoreBookingsData = [
  {
    id: '1',
    name: 'No zone',
    availability: [800, 720, 650, 580, 520, 450, 380, 750, 680, 620, 560, 780],
    reachData: [2850000, 2400000, 1950000, 1680000, 1420000, 950000, 680000, 2200000, 2750000, 1850000, 1200000, 3000000],
    storeTypes: ['to-go', 'xl', 'express', 'premium'],
    retailProducts: ['rp-001', 'rp-004', 'rp-008', 'rp-016'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [
      {
        id: 'booking-1',
        name: 'Coca Cola - Summer Display',
        startWeek: 1,
        endWeek: 4,
        stores: 350,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-2',
        name: 'P&G - Back to School Promo',
        startWeek: 3,
        endWeek: 7,
        stores: 280,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-3',
        name: 'Unilever - Holiday Campaign',
        startWeek: 8,
        endWeek: 12,
        stores: 420,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '2',
    name: 'Zuivel',
    availability: [850, 780, 710, 640, 580, 520, 460, 820, 750, 690, 730, 860],
    reachData: [2650000, 2180000, 1780000, 1520000, 1280000, 850000, 580000, 2050000, 2550000, 1650000, 980000, 2850000],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-002', 'rp-005', 'rp-009', 'rp-017'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [
      {
        id: 'booking-4',
        name: 'Nestle - Coffee Promotion',
        startWeek: 1,
        endWeek: 3,
        stores: 450,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-5',
        name: 'Johnson & Johnson - Health Week',
        startWeek: 2,
        endWeek: 6,
        stores: 320,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-6',
        name: 'Mars - Seasonal Candy',
        startWeek: 9,
        endWeek: 12,
        stores: 380,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '3',
    name: 'Vers',
    availability: [780, 720, 660, 600, 550, 500, 450, 750, 690, 630, 670, 800],
    reachData: [2450000, 2050000, 1650000, 1380000, 1150000, 750000, 480000, 1850000, 2350000, 1450000, 850000, 2650000],
    storeTypes: ['to-go', 'express', 'compact'],
    retailProducts: ['rp-003', 'rp-007', 'rp-011', 'rp-019'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [
      {
        id: 'booking-7',
        name: 'Nike - Wayfinding Campaign',
        startWeek: 2,
        endWeek: 5,
        stores: 200,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-8',
        name: 'McDonald\'s - Happy Meal Promo',
        startWeek: 6,
        endWeek: 9,
        stores: 150,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '4',
    name: 'Vlees & Vega',
    availability: [740, 680, 620, 560, 510, 460, 420, 720, 650, 590, 630, 760],
    reachData: [2250000, 1850000, 1450000, 1180000, 950000, 650000, 380000, 1650000, 2150000, 1250000, 750000, 2450000],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-006', 'rp-010', 'rp-014', 'rp-020'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [
      {
        id: 'booking-9',
        name: 'Apple - iPhone Display Stand',
        startWeek: 1,
        endWeek: 6,
        stores: 120,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-10',
        name: 'Sony - PlayStation Demo',
        startWeek: 7,
        endWeek: 11,
        stores: 90,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '5',
    name: 'Diepvries',
    availability: [770, 710, 650, 590, 540, 490, 450, 740, 680, 620, 660, 790],
    reachData: [2150000, 1750000, 1350000, 1080000, 850000, 550000, 320000, 1550000, 1950000, 1150000, 680000, 2350000],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-012', 'rp-013', 'rp-015', 'rp-018'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [
      {
        id: 'booking-11',
        name: 'Ben & Jerry\'s - Ice Cream Sampling',
        startWeek: 3,
        endWeek: 7,
        stores: 180,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-12',
        name: 'Starbucks - Coffee Tasting',
        startWeek: 8,
        endWeek: 12,
        stores: 220,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '6',
    name: 'Worldfoods',
    availability: [720, 660, 600, 540, 490, 440, 400, 700, 640, 580, 620, 740],
    reachData: [1950000, 1550000, 1150000, 880000, 650000, 450000, 300000, 1350000, 1750000, 950000, 580000, 2150000],
    storeTypes: ['premium', 'compact'],
    retailProducts: ['rp-004', 'rp-008', 'rp-016', 'rp-020'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [
      {
        id: 'booking-13',
        name: 'H&M - Fashion Week Display',
        startWeek: 2,
        endWeek: 8,
        stores: 85,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-14',
        name: 'IKEA - Home Decor Showcase',
        startWeek: 9,
        endWeek: 12,
        stores: 60,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '7',
    name: 'Maaltijdtoevoegingen',
    availability: [510, 370, 260, 150, 95, 50, 25, 440, 350, 290, 320, 490],
    reachData: [1150000, 950000, 750000, 580000, 420000, 350000, 300000, 850000, 1050000, 650000, 480000, 1350000],
    storeTypes: ['to-go', 'xl', 'premium'],
    retailProducts: ['rp-005', 'rp-009', 'rp-017'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [],
  },
  {
    id: '8',
    name: 'Noten, toast, chips etc.',
    availability: [480, 340, 230, 120, 70, 40, 20, 410, 320, 270, 300, 460],
    reachData: [950000, 780000, 620000, 480000, 380000, 320000, 300000, 720000, 850000, 550000, 420000, 1150000],
    storeTypes: ['express', 'compact', 'premium'],
    retailProducts: ['rp-006', 'rp-010', 'rp-018'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [],
  },
  {
    id: '9',
    name: 'Zoetwaren',
    availability: [520, 380, 270, 140, 85, 45, 22, 450, 360, 300, 340, 500],
    reachData: [1250000, 1050000, 820000, 650000, 480000, 380000, 320000, 920000, 1150000, 720000, 520000, 1450000],
    storeTypes: ['to-go', 'express', 'xl'],
    retailProducts: ['rp-007', 'rp-011', 'rp-019'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [],
  },
  {
    id: '10',
    name: 'Ontbijt',
    availability: [560, 420, 310, 180, 110, 60, 35, 490, 400, 340, 370, 540],
    reachData: [1450000, 1250000, 980000, 750000, 550000, 420000, 350000, 1080000, 1350000, 820000, 620000, 1650000],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-008', 'rp-012', 'rp-020'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [],
  },
  {
    id: '11',
    name: 'Non Food',
    availability: [440, 310, 200, 100, 55, 30, 15, 380, 290, 240, 260, 420],
    reachData: [850000, 680000, 520000, 420000, 350000, 310000, 300000, 620000, 750000, 480000, 380000, 950000],
    storeTypes: ['premium', 'compact'],
    retailProducts: ['rp-013', 'rp-014', 'rp-015'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [],
  },
  {
    id: '12',
    name: 'To Go',
    availability: [390, 270, 180, 90, 45, 25, 10, 330, 250, 200, 220, 370],
    reachData: [750000, 580000, 450000, 380000, 320000, 300000, 300000, 550000, 650000, 420000, 350000, 820000],
    storeTypes: ['to-go', 'express'],
    retailProducts: ['rp-016', 'rp-017', 'rp-018'],
    inventoryTypes: ['package-small', 'package-medium', 'package-large'],
    bookings: [],
  },
];

// Mock data for digital in-store bookings
const digitalInstoreBookingsData = [
  {
    id: '1',
    name: 'Digital Screens - Entrance',
    availability: [95, 75, 40, 18, 5, 0, -15, 85, 60, 45, 30, 90],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-001', 'rp-002', 'rp-010', 'rp-015'],
    bookings: [
      {
        id: 'booking-1',
        name: 'Apple - iPhone 16 Launch',
        startWeek: 1,
        endWeek: 4,
        stores: 280,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-2',
        name: 'Samsung - Galaxy AI Campaign',
        startWeek: 3,
        endWeek: 7,
        stores: 350,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-3',
        name: 'Netflix - Streaming Promo',
        startWeek: 8,
        endWeek: 12,
        stores: 420,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '2',
    name: 'Interactive Kiosks',
    availability: [88, 65, 35, 12, 0, -8, -20, 78, 52, 38, 48, 82],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-003', 'rp-008', 'rp-014', 'rp-020'],
    bookings: [
      {
        id: 'booking-4',
        name: 'Microsoft - Surface Demo',
        startWeek: 1,
        endWeek: 3,
        stores: 150,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-5',
        name: 'Google - Pixel Experience',
        startWeek: 2,
        endWeek: 6,
        stores: 200,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-6',
        name: 'Adobe - Creative Cloud',
        startWeek: 9,
        endWeek: 12,
        stores: 180,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '3',
    name: 'Smart Shelf Displays',
    availability: [92, 68, 32, 15, 2, -5, -18, 80, 55, 42, 52, 86],
    storeTypes: ['to-go', 'xl', 'express', 'premium'],
    retailProducts: ['rp-004', 'rp-009', 'rp-016', 'rp-017'],
    bookings: [
      {
        id: 'booking-7',
        name: 'Coca Cola - Smart Price Display',
        startWeek: 2,
        endWeek: 5,
        stores: 480,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-8',
        name: 'P&G - Digital Product Info',
        startWeek: 6,
        endWeek: 9,
        stores: 320,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '4',
    name: 'Checkout Digital Screens',
    availability: [85, 58, 28, 10, 0, -12, -25, 72, 48, 35, 45, 78],
    storeTypes: ['to-go', 'express', 'compact'],
    retailProducts: ['rp-005', 'rp-011', 'rp-018', 'rp-019'],
    bookings: [
      {
        id: 'booking-9',
        name: 'Visa - Contactless Payment',
        startWeek: 1,
        endWeek: 6,
        stores: 520,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-10',
        name: 'PayPal - Digital Wallet',
        startWeek: 7,
        endWeek: 11,
        stores: 380,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '5',
    name: 'Audio System',
    availability: [78, 50, 25, 8, 0, -15, -30, 65, 42, 30, 40, 75],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-006', 'rp-012', 'rp-013', 'rp-007'],
    bookings: [
      {
        id: 'booking-11',
        name: 'Spotify - Audio Ads Campaign',
        startWeek: 3,
        endWeek: 7,
        stores: 290,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-12',
        name: 'Amazon Music - Voice Promotion',
        startWeek: 8,
        endWeek: 12,
        stores: 220,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '6',
    name: 'Digital Wayfinding',
    availability: [82, 55, 30, 12, 3, -8, -22, 70, 45, 32, 42, 80],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-014', 'rp-015', 'rp-020', 'rp-010'],
    bookings: [
      {
        id: 'booking-13',
        name: 'IKEA - Store Navigation',
        startWeek: 2,
        endWeek: 8,
        stores: 95,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-14',
        name: 'Best Buy - Product Finder',
        startWeek: 9,
        endWeek: 12,
        stores: 120,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
];

// Mock data for display bookings
const displayBookingsData = [
  {
    id: '1',
    name: 'Digital Billboards',
    availability: [85, 70, 45, 20, 8, 0, -12, 80, 60, 50, 35, 85],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-001', 'rp-002', 'rp-008', 'rp-010'],
    bookings: [
      {
        id: 'booking-1',
        name: 'McDonald\'s - Big Mac Campaign',
        startWeek: 1,
        endWeek: 4,
        stores: 45,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-2',
        name: 'BMW - Electric Vehicle Launch',
        startWeek: 3,
        endWeek: 7,
        stores: 60,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-3',
        name: 'Netflix - Series Premiere',
        startWeek: 8,
        endWeek: 12,
        stores: 55,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '2',
    name: 'Static Billboards',
    availability: [90, 75, 50, 25, 10, 2, -8, 85, 65, 55, 40, 88],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-003', 'rp-005', 'rp-009', 'rp-015'],
    bookings: [
      {
        id: 'booking-4',
        name: 'Coca Cola - Share a Coke',
        startWeek: 1,
        endWeek: 3,
        stores: 120,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-5',
        name: 'Apple - iPhone Billboard',
        startWeek: 2,
        endWeek: 6,
        stores: 95,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-6',
        name: 'Nike - Just Do It Campaign',
        startWeek: 9,
        endWeek: 12,
        stores: 80,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '3',
    name: 'Building Wraps',
    availability: [70, 55, 35, 15, 5, 0, -15, 65, 45, 40, 25, 70],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-004', 'rp-007', 'rp-012', 'rp-018'],
    bookings: [
      {
        id: 'booking-7',
        name: 'Samsung - Galaxy Wrap',
        startWeek: 2,
        endWeek: 5,
        stores: 25,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-8',
        name: 'Disney - Movie Premiere',
        startWeek: 6,
        endWeek: 9,
        stores: 30,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '4',
    name: 'Transit Displays',
    availability: [95, 80, 60, 30, 12, 5, -5, 90, 70, 60, 45, 92],
    storeTypes: ['to-go', 'express', 'compact'],
    retailProducts: ['rp-006', 'rp-011', 'rp-016', 'rp-019'],
    bookings: [
      {
        id: 'booking-9',
        name: 'Uber - Ride Share Promotion',
        startWeek: 1,
        endWeek: 6,
        stores: 180,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-10',
        name: 'Spotify - Music Streaming',
        startWeek: 7,
        endWeek: 11,
        stores: 150,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '5',
    name: 'Street Furniture',
    availability: [88, 65, 40, 18, 8, 0, -10, 82, 55, 45, 38, 85],
    storeTypes: ['to-go', 'express', 'premium', 'compact'],
    retailProducts: ['rp-013', 'rp-014', 'rp-017', 'rp-020'],
    bookings: [
      {
        id: 'booking-11',
        name: 'L\'Oreal - Beauty Campaign',
        startWeek: 3,
        endWeek: 7,
        stores: 220,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-12',
        name: 'Adidas - Sport Collection',
        startWeek: 8,
        endWeek: 12,
        stores: 190,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '6',
    name: 'LED Screens',
    availability: [80, 60, 35, 15, 3, -2, -18, 75, 50, 38, 30, 78],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-002', 'rp-008', 'rp-010', 'rp-015'],
    bookings: [
      {
        id: 'booking-13',
        name: 'Tesla - Model Y Campaign',
        startWeek: 2,
        endWeek: 8,
        stores: 35,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-14',
        name: 'Amazon Prime - Video Streaming',
        startWeek: 9,
        endWeek: 12,
        stores: 42,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
];

// Mock data for sponsored product bookings
const sponsoredProductBookingsData = [
  {
    id: '1',
    name: 'Featured Product Placement',
    availability: [92, 78, 55, 28, 12, 3, -8, 88, 65, 52, 38, 90],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-001', 'rp-004', 'rp-008', 'rp-016'],
    bookings: [
      {
        id: 'booking-1',
        name: 'Coca Cola - Homepage Feature',
        startWeek: 1,
        endWeek: 4,
        stores: 480,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-2',
        name: 'Nike - Sport Category Feature',
        startWeek: 3,
        endWeek: 7,
        stores: 320,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-3',
        name: 'Apple - Tech Category Lead',
        startWeek: 8,
        endWeek: 12,
        stores: 280,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '2',
    name: 'Search Sponsored Results',
    availability: [95, 82, 60, 32, 15, 5, -5, 90, 70, 58, 45, 92],
    storeTypes: ['to-go', 'xl', 'express', 'premium', 'compact'],
    retailProducts: ['rp-002', 'rp-005', 'rp-009', 'rp-017'],
    bookings: [
      {
        id: 'booking-4',
        name: 'Samsung - "Smartphone" Search',
        startWeek: 1,
        endWeek: 3,
        stores: 520,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-5',
        name: 'L\'Oreal - "Beauty" Search',
        startWeek: 2,
        endWeek: 6,
        stores: 380,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-6',
        name: 'PlayStation - "Gaming" Search',
        startWeek: 9,
        endWeek: 12,
        stores: 290,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '3',
    name: 'Category Sponsorship',
    availability: [88, 70, 45, 22, 8, 0, -12, 85, 60, 48, 35, 88],
    storeTypes: ['xl', 'premium'],
    retailProducts: ['rp-003', 'rp-007', 'rp-012', 'rp-018'],
    bookings: [
      {
        id: 'booking-7',
        name: 'P&G - Personal Care Sponsor',
        startWeek: 2,
        endWeek: 5,
        stores: 220,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-8',
        name: 'Nestlé - Food & Beverages',
        startWeek: 6,
        endWeek: 9,
        stores: 180,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '4',
    name: 'Recommendation Engine',
    availability: [90, 75, 50, 25, 10, 2, -10, 86, 62, 50, 40, 85],
    storeTypes: ['to-go', 'express', 'compact'],
    retailProducts: ['rp-006', 'rp-011', 'rp-015', 'rp-019'],
    bookings: [
      {
        id: 'booking-9',
        name: 'Amazon - "Customers who bought"',
        startWeek: 1,
        endWeek: 6,
        stores: 450,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-10',
        name: 'Netflix - "Because you watched"',
        startWeek: 7,
        endWeek: 11,
        stores: 380,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '5',
    name: 'Email Newsletter Sponsorship',
    availability: [85, 65, 40, 18, 6, 0, -15, 80, 55, 42, 32, 82],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-010', 'rp-013', 'rp-014', 'rp-020'],
    bookings: [
      {
        id: 'booking-11',
        name: 'Microsoft - Weekly Tech Newsletter',
        startWeek: 3,
        endWeek: 7,
        stores: 320,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-12',
        name: 'IKEA - Home & Garden Newsletter',
        startWeek: 8,
        endWeek: 12,
        stores: 280,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
  {
    id: '6',
    name: 'App Banner Placement',
    availability: [93, 80, 58, 30, 14, 4, -6, 88, 68, 55, 42, 90],
    storeTypes: ['to-go', 'express', 'premium'],
    retailProducts: ['rp-001', 'rp-008', 'rp-016', 'rp-017'],
    bookings: [
      {
        id: 'booking-13',
        name: 'Uber Eats - Food App Banner',
        startWeek: 2,
        endWeek: 8,
        stores: 420,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-14',
        name: 'Spotify - Music App Promo',
        startWeek: 9,
        endWeek: 12,
        stores: 350,
        variant: 'warning' as const,
        status: 'in-option',
      },
    ],
  },
];

// Stories for each engine type
export const GeneralBookingsCalendar: Story = {
  name: 'General Bookings Calendar',
  render: () => (
    <MenuContextProvider>
      <BookingCalendarTemplate
        bookingsData={generalBookingsData}
        title="Bookings Calendar"
        mediaProductOptions={[
          { label: 'Digital Display - Homepage', value: '1' },
          { label: 'In-Store Digital - Entrance', value: '2' },
          { label: 'Sponsored Products', value: '3' },
          { label: 'Audio Announcements', value: '4' },
          { label: 'Checkout Display', value: '5' },
          { label: 'Parking Lot Digital', value: '6' },
        ]}
      />
    </MenuContextProvider>
  ),
};

// Specialized component for offline in-store calendar with custom filters
const OfflineInstoreCalendarTemplate = ({ 
  bookingsData, 
  title,
  mediaProductOptions 
}: { 
  bookingsData: any[], 
  title: string,
  mediaProductOptions: Array<{ label: string, value: string }>
}) => {
  const [inventoryType, setInventoryType] = useState<string[]>([]);
  const [storeType, setStoreType] = useState<string[]>([]);
  const [retailProduct, setRetailProduct] = useState<string[]>([]);
  const [maxStoreAmount, setMaxStoreAmount] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    mediaProduct: any;
    weekNumber: number;
    value: number | string;
  } | null>(null);
  const [activeView, setActiveView] = useState('bookedCampaigns');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().getTime() + 11 * 7 * 24 * 60 * 60 * 1000) // 12 weeks from now
  });
  
  const viewTabs = [
    { value: 'bookedCampaigns', label: 'Booked campaigns' },
    { value: 'stores', label: 'Available stores' },
    { value: 'reach', label: 'Available reach' },
  ];
  
  // Calculate weeks to show and start week from date range
  const getCalendarWeeks = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) {
      // Default to 8 weeks starting from current week
      const now = new Date();
      return {
        startWeek: getWeek(startOfWeek(now, { weekStartsOn: 1 })),
        numberOfWeeks: 8
      };
    }
    
    const from = startOfWeek(range.from, { weekStartsOn: 1 });
    const to = startOfWeek(range.to, { weekStartsOn: 1 });
    const weeksDiff = differenceInWeeks(to, from) + 1; // +1 to include both start and end weeks
    
    return {
      startWeek: getWeek(from),
      numberOfWeeks: Math.max(1, Math.min(weeksDiff, 52)) // Limit to between 1 and 52 weeks
    };
  };
  
  const { startWeek, numberOfWeeks } = getCalendarWeeks(dateRange);

  // Handle cell click to open drawer
  const handleCellClick = (mediaProduct: any, weekNumber: number, value: number | string) => {
    setSelectedCell({ mediaProduct, weekNumber, value });
    setDrawerOpen(true);
  };

  // Get bookings for the selected week
  const getBookingsForWeek = () => {
    if (!selectedCell) return [];
    
    return filteredBookingsData.reduce((allBookings: any[], product) => {
      if (product.bookings) {
        const weekBookings = product.bookings.filter((booking: any) =>
          booking.startWeek <= selectedCell.weekNumber && booking.endWeek >= selectedCell.weekNumber
        );
        return [...allBookings, ...weekBookings.map((booking: any) => ({
          ...booking,
          mediaProductName: product.name
        }))];
      }
      return allBookings;
    }, []);
  };

  
  // Adjust retailer events to match the actual week range
  const adjustedRetailerEvents = retailerEvents.map(event => ({
    ...event,
    week: startWeek + event.week - 1
  }));
  
  // Adjust bookings data to match the actual week range  
  const adjustedBookingsData = bookingsData.map(product => ({
    ...product,
    bookings: product.bookings?.map((booking: any) => ({
      ...booking,
      startWeek: startWeek + booking.startWeek - 1,
      endWeek: startWeek + booking.endWeek - 1,
    }))
  }));
  
  // Function to calculate availability reduction based on filters
  const calculateFilteredAvailability = (baseAvailability: number[], product: any, shouldHideGreyCells = false) => {
    let reductionFactor = 1.0;
    
    // Reduce availability if specific filters are applied
    if (inventoryType.length > 0) {
      // If specific inventory types are selected, reduce availability by 20%
      reductionFactor *= 0.8;
    }
    
    if (storeType.length > 0) {
      // If specific store types are selected, reduce availability by 15%
      reductionFactor *= 0.85;
    }
    
    if (retailProduct.length > 0) {
      // If specific retail products are selected, reduce availability by 25%
      reductionFactor *= 0.75;
    }
    
    // Apply reduction and round to integers, then cap at max store amount if specified
    return baseAvailability.map(val => {
      if (typeof val === 'number') {
        let filteredVal = Math.round(val * reductionFactor);
        
        // Apply max store amount cap if specified
        if (maxStoreAmount && !isNaN(parseInt(maxStoreAmount))) {
          const maxStores = parseInt(maxStoreAmount);
          filteredVal = Math.min(filteredVal, maxStores);
        }
        
        
        return filteredVal;
      }
      return val;
    });
  };

  // Filter the adjusted bookings data based on selected filters
  const filteredBookingsData = adjustedBookingsData.filter(product => {
    // Inventory type filter
    if (inventoryType.length > 0 && !inventoryType.some(type => product.inventoryTypes?.includes(type))) {
      return false;
    }
    
    // Store type filter
    if (storeType.length > 0 && !storeType.some(type => product.storeTypes?.includes(type))) {
      return false;
    }
    
    // Retail product filter
    if (retailProduct.length > 0 && !retailProduct.some(productId => product.retailProducts?.includes(productId))) {
      return false;
    }
    
    return true;
  }).map(product => {
    const shouldHideGreyCells = activeView === 'stores' || activeView === 'reach';
    return {
      ...product,
      availability: calculateFilteredAvailability(product.availability, product, shouldHideGreyCells),
      reachData: product.reachData ? calculateFilteredAvailability(product.reachData, product, shouldHideGreyCells) : undefined,
    };
  });
  
  return (
    <RightDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
              showPresets={true}
              className="w-[280px]"
            />
          ),
        }}
      >
        <Card className="w-full">
          <CardHeader>
            <div className="mb-4">
              <Viewbar
                tabs={viewTabs}
                activeTab={activeView}
                onTabChange={setActiveView}
                labels={[]}
              />
            </div>
            <FilterBar
              filters={[
                {
                  name: 'Inventory type',
                  options: [
                    { label: 'Small Package', value: 'package-small' },
                    { label: 'Medium Package', value: 'package-medium' },
                    { label: 'Large Package', value: 'package-large' },
                  ],
                  selectedValues: inventoryType,
                  onChange: setInventoryType,
                },
                {
                  name: 'Store type',
                  options: [
                    { label: 'AH DNAH', value: 'ah-dnah' },
                    { label: 'AH XL', value: 'ah-xl' },
                  ],
                  selectedValues: storeType,
                  onChange: setStoreType,
                  customInput: {
                    label: 'Max number of stores',
                    value: maxStoreAmount,
                    onChange: setMaxStoreAmount,
                    placeholder: 'Enter max stores',
                    type: 'number'
                  },
                },
                {
                  name: 'Retail Product',
                  options: [
                    { label: 'Coca-Cola - coca-cola zero fl - 1 liter', value: '606983', description: 'ID: 606983' },
                    { label: 'Pepsi - pepsi max - 1.5 liter', value: '607124', description: 'ID: 607124' },
                    { label: 'Red Bull - energy drink original - 250ml', value: '608456', description: 'ID: 608456' },
                    { label: 'Heineken - premium lager beer - 6x330ml', value: '609782', description: 'ID: 609782' },
                    { label: 'Samsung - galaxy s24 ultra - 256GB', value: '610394', description: 'ID: 610394' },
                    { label: 'iPhone - 15 pro max - 512GB', value: '611205', description: 'ID: 611205' },
                    { label: 'Nike - air max 270 - size 42', value: '612816', description: 'ID: 612816' },
                    { label: 'Adidas - ultraboost 22 - size 43', value: '613427', description: 'ID: 613427' },
                    { label: 'Nutella - hazelnut spread - 750g', value: '614038', description: 'ID: 614038' },
                    { label: 'Ben & Jerry\'s - cookie dough - 465ml', value: '614649', description: 'ID: 614649' },
                  ],
                  selectedValues: retailProduct,
                  onChange: setRetailProduct,
                },
              ]}
              hideSearch={true}
            />
          </CardHeader>
          <CardContent>
            <CalendarTable
              mediaProducts={filteredBookingsData.map(product => ({
                ...product,
                availability: activeView === 'bookedCampaigns' 
                  ? (product.campaignCounts || product.availability)
                  : activeView === 'reach'
                  ? (product.reachData || product.availability)
                  : product.availability
              }))}
              weeks={numberOfWeeks}
              startWeek={startWeek}
              retailerEvents={adjustedRetailerEvents}
              showReach={true}
              displayType={
                activeView === 'bookedCampaigns' ? 'bookedCampaigns' : 
                activeView === 'stores' ? 'stores' : 
                'reach'
              }
              onCellClick={handleCellClick}
              hideGreyCells={activeView === 'stores' || activeView === 'reach'}
              hasRetailProductFilter={retailProduct.length > 0}
            />
          </CardContent>
        </Card>

        <RightDrawerContent>
          <RightDrawerHeader>
            <RightDrawerTitle>
              {selectedCell?.mediaProduct?.name || 'Bookings'} - Week {selectedCell?.weekNumber}
            </RightDrawerTitle>
            <RightDrawerDescription>
              Availability: {selectedCell?.value} | All bookings for this week
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-6">
              <Viewbar
                tabs={viewTabs}
                activeTab={activeView}
                onTabChange={setActiveView}
                labels={[]}
              />
              
              <FilterBar
                filters={[
                  {
                    name: 'Inventory type',
                    options: [
                      { label: 'Small', value: 'package-small' },
                      { label: 'Medium', value: 'package-medium' },
                      { label: 'Large', value: 'package-large' },
                    ],
                    selectedValues: inventoryType,
                    onChange: setInventoryType,
                  },
                  {
                    name: 'Store type',
                    options: [
                      { label: 'AH DNAH', value: 'ah-dnah' },
                      { label: 'AH XL', value: 'ah-xl' },
                    ],
                    selectedValues: storeType,
                    onChange: setStoreType,
                  },
                  {
                    name: 'Retail Product',
                    options: [
                      { label: 'Coca-Cola - coca-cola zero fl - 1 liter (606983)', value: '606983' },
                      { label: 'Pepsi - pepsi max - 1.5 liter (607124)', value: '607124' },
                      { label: 'Red Bull - energy drink original - 250ml (608456)', value: '608456' },
                      { label: 'Heineken - premium lager beer - 6x330ml (609782)', value: '609782' },
                      { label: 'Samsung - galaxy s24 ultra - 256GB (610394)', value: '610394' },
                      { label: 'iPhone - 15 pro max - 512GB (611205)', value: '611205' },
                      { label: 'Nike - air max 270 - size 42 (612816)', value: '612816' },
                      { label: 'Adidas - ultraboost 22 - size 43 (613427)', value: '613427' },
                      { label: 'Nutella - hazelnut spread - 750g (614038)', value: '614038' },
                      { label: 'Ben & Jerry\'s - cookie dough - 465ml (614649)', value: '614649' },
                    ],
                    selectedValues: retailProduct,
                    onChange: setRetailProduct,
                  },
                ]}
                hideSearch={true}
              />
              
              <Table
                columns={[
                  { key: 'id', header: 'Booking ID' },
                  { key: 'name', header: 'Campaign Name' },
                  { key: 'mediaProductName', header: 'Media Product' },
                  { 
                    key: 'stores', 
                    header: 'Stores', 
                    render: row => <Badge variant="secondary">{row.stores}</Badge> 
                  },
                  { key: 'startWeek', header: 'Start Week' },
                  { key: 'endWeek', header: 'End Week' },
                ]}
                data={getBookingsForWeek()}
                rowKey={row => row.id}
              />
            </div>
          </RightDrawerBody>
        </RightDrawerContent>
      </AppLayout>
    </RightDrawer>
  );
};

export const OfflineInstoreCalendar: Story = {
  name: 'Offline In-store Calendar',
  render: () => (
    <MenuContextProvider>
      <OfflineInstoreCalendarTemplate
        bookingsData={offlineInstoreBookingsData.map(product => ({
          ...product,
          storeTypes: ['ah-dnah', 'ah-xl'], // Add sample store types
          retailProducts: ['606983', '607124', '608456'], // Add sample retail products
          campaignCounts: [3, 7, 2, 8, 12, 5, 1, 9, 4, 6, 0, 11] // Number of booked campaigns (0-12) for each week
        }))}
        title="Offline In-store Calendar"
        mediaProductOptions={[
          { label: 'End Cap Displays', value: '1' },
          { label: 'Shelf Talkers', value: '2' },
          { label: 'Floor Graphics', value: '3' },
          { label: 'Promotional Stands', value: '4' },
          { label: 'In-store Sampling', value: '5' },
          { label: 'Window Displays', value: '6' },
        ]}
      />
    </MenuContextProvider>
  ),
};

export const DigitalInstoreCalendar: Story = {
  name: 'Digital In-store Calendar',
  render: () => (
    <MenuContextProvider>
      <BookingCalendarTemplate
        bookingsData={digitalInstoreBookingsData}
        title="Digital In-store Calendar"
        mediaProductOptions={[
          { label: 'Digital Screens - Entrance', value: '1' },
          { label: 'Interactive Kiosks', value: '2' },
          { label: 'Smart Shelf Displays', value: '3' },
          { label: 'Checkout Digital Screens', value: '4' },
          { label: 'Audio System', value: '5' },
          { label: 'Digital Wayfinding', value: '6' },
        ]}
      />
    </MenuContextProvider>
  ),
};

export const DisplayCalendar: Story = {
  name: 'Display Calendar',
  render: () => (
    <MenuContextProvider>
      <BookingCalendarTemplate
        bookingsData={displayBookingsData}
        title="Display Calendar"
        mediaProductOptions={[
          { label: 'Digital Billboards', value: '1' },
          { label: 'Static Billboards', value: '2' },
          { label: 'Building Wraps', value: '3' },
          { label: 'Transit Displays', value: '4' },
          { label: 'Street Furniture', value: '5' },
          { label: 'LED Screens', value: '6' },
        ]}
      />
    </MenuContextProvider>
  ),
};

export const SponsoredProductCalendar: Story = {
  name: 'Sponsored Product Calendar',
  render: () => (
    <MenuContextProvider>
      <BookingCalendarTemplate
        bookingsData={sponsoredProductBookingsData}
        title="Sponsored Product Calendar"
        mediaProductOptions={[
          { label: 'Featured Product Placement', value: '1' },
          { label: 'Search Sponsored Results', value: '2' },
          { label: 'Category Sponsorship', value: '3' },
          { label: 'Recommendation Engine', value: '4' },
          { label: 'Email Newsletter Sponsorship', value: '5' },
          { label: 'App Banner Placement', value: '6' },
        ]}
      />
    </MenuContextProvider>
  ),
};