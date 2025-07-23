'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CalendarTable } from '@/components/ui/calendar-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { Viewbar } from '@/components/ui/viewbar';
import { DateRangePicker } from '@/components/ui/date-picker';
import { defaultRoutes } from '@/components/layout/default-routes';
import React, { useState } from 'react';
import { DateRange } from "react-day-picker";

// Exact data structure from Storybook GeneralBookingsCalendar
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
        startWeek: 30,
        endWeek: 33,
        stores: 450,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-2',
        name: 'Nike - Back to School Collection',
        startWeek: 32,
        endWeek: 36,
        stores: 320,
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
        startWeek: 30,
        endWeek: 32,
        stores: 200,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-6',
        name: 'McDonald\'s - McFlurry Campaign',
        startWeek: 31,
        endWeek: 35,
        stores: 350,
        variant: 'default' as const,
        status: 'closed-won',
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
        startWeek: 30,
        endWeek: 34,
        stores: 400,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
];

// Commercial events - 5 events with 3-5 weeks duration each
const retailerEvents = [
  // Summer Festival (4 weeks: weeks 30-33)
  { week: 30, name: 'Summer Festival' },
  { week: 31, name: 'Summer Festival' },
  { week: 32, name: 'Summer Festival' },
  { week: 33, name: 'Summer Festival' },
  
  // Back to School (5 weeks: weeks 33-37)
  { week: 33, name: 'Back to School' },
  { week: 34, name: 'Back to School' },
  { week: 35, name: 'Back to School' },
  { week: 36, name: 'Back to School' },
  { week: 37, name: 'Back to School' },
  
  // Autumn Sale (3 weeks: weeks 36-38)
  { week: 36, name: 'Autumn Sale' },
  { week: 37, name: 'Autumn Sale' },
  { week: 38, name: 'Autumn Sale' },
  
  // Holiday Season (5 weeks: weeks 38-42)
  { week: 38, name: 'Holiday Season' },
  { week: 39, name: 'Holiday Season' },
  { week: 40, name: 'Holiday Season' },
  { week: 41, name: 'Holiday Season' },
  { week: 42, name: 'Holiday Season' },
  
  // Winter Clearance (3 weeks: weeks 40-42)
  { week: 40, name: 'Winter Clearance' },
  { week: 41, name: 'Winter Clearance' },
  { week: 42, name: 'Winter Clearance' },
];

const mediaProductOptions = [
  { label: 'Digital Display - Homepage', value: '1' },
  { label: 'In-Store Digital - Entrance', value: '2' },
  { label: 'Sponsored Products', value: '3' },
];

export default function BookingsCalendarPage() {
  const [status, setStatus] = useState<string[]>([]);
  const [storeAssortment, setStoreAssortment] = useState<string[]>([]);
  const [storeType, setStoreType] = useState<string[]>([]);
  const [mediaProduct, setMediaProduct] = useState<string[]>([]);
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

  const numberOfWeeks = 12;
  const startWeek = 30; // Changed to week 30 to match 22nd July 2025

  const handleCellClick = (mediaProduct: any, weekNumber: number, value: number | string) => {
    console.log('Cell clicked:', { mediaProduct, weekNumber, value });
  };

  // Apply filters - exact logic from Storybook
  const filteredBookingsData = generalBookingsData.filter(product => {
    const statusMatch = status.length === 0 || product.bookings.some(booking => 
      status.includes(booking.status)
    );
    const storeTypeMatch = storeType.length === 0 || product.storeTypes.some(type => 
      storeType.includes(type)
    );
    const retailProductMatch = storeAssortment.length === 0 || product.retailProducts.some(rp => 
      storeAssortment.includes(rp)
    );
    const mediaProductMatch = mediaProduct.length === 0 || mediaProduct.includes(product.id);
    
    return statusMatch && storeTypeMatch && retailProductMatch && mediaProductMatch;
  });

  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: "Bookings Calendar",
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
                  { label: 'RP-006 - L\'Oreal Paris Mascara', value: 'rp-006' },
                  { label: 'RP-007 - Nivea Body Lotion 400ml', value: 'rp-007' },
                  { label: 'RP-008 - Heineken Beer 6-pack', value: 'rp-008' },
                  { label: 'RP-010 - PlayStation 5 Console', value: 'rp-010' },
                  { label: 'RP-016 - Ben & Jerry\'s Ice Cream 500ml', value: 'rp-016' },
                  { label: 'RP-017 - Nutella Hazelnut Spread 750g', value: 'rp-017' },
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
        </CardHeader>
        <CardContent>
          <CalendarTable
            mediaProducts={filteredBookingsData}
            weeks={numberOfWeeks}
            startWeek={startWeek}
            retailerEvents={retailerEvents}
            showReach={true}
            displayType={activeView as 'reach' | 'fillRate' | 'revenue' | 'stores' | 'players'}
            onCellClick={handleCellClick}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}