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

// Sponsored product specific booking data
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
        startWeek: 30,
        endWeek: 33,
        stores: 480,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-2',
        name: 'Nike - Sport Category Feature',
        startWeek: 32,
        endWeek: 36,
        stores: 320,
        variant: 'warning' as const,
        status: 'in-option',
      },
      {
        id: 'booking-3',
        name: 'Apple - Tech Category Lead',
        startWeek: 37,
        endWeek: 41,
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
        startWeek: 30,
        endWeek: 32,
        stores: 520,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-5',
        name: 'L\'Oréal - "Beauty" Keywords',
        startWeek: 33,
        endWeek: 38,
        stores: 350,
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
        startWeek: 31,
        endWeek: 34,
        stores: 220,
        variant: 'default' as const,
        status: 'closed-won',
      },
      {
        id: 'booking-8',
        name: 'Nestlé - Food & Beverages',
        startWeek: 35,
        endWeek: 38,
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
        name: 'Unilever - Personalized Recs',
        startWeek: 30,
        endWeek: 35,
        stores: 400,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '5',
    name: 'Email Newsletter Sponsorship',
    availability: [70, 55, 30, 12, 5, 0, -20, 65, 45, 35, 25, 72],
    storeTypes: ['xl', 'premium', 'compact'],
    retailProducts: ['rp-008', 'rp-010', 'rp-014', 'rp-020'],
    bookings: [
      {
        id: 'booking-10',
        name: 'McDonald\'s - Weekly Deals',
        startWeek: 31,
        endWeek: 33,
        stores: 150,
        variant: 'default' as const,
        status: 'closed-won',
      },
    ],
  },
  {
    id: '6',
    name: 'App Banner Placement',
    availability: [85, 68, 42, 18, 8, 2, -15, 80, 58, 45, 32, 82],
    storeTypes: ['to-go', 'express'],
    retailProducts: ['rp-013', 'rp-016', 'rp-019', 'rp-020'],
    bookings: [
      {
        id: 'booking-11',
        name: 'Netflix - New Season Banner',
        startWeek: 34,
        endWeek: 39,
        stores: 320,
        variant: 'warning' as const,
        status: 'in-option',
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
  { label: 'Featured Product Placement', value: '1' },
  { label: 'Search Sponsored Results', value: '2' },
  { label: 'Category Sponsorship', value: '3' },
  { label: 'Recommendation Engine', value: '4' },
  { label: 'Email Newsletter Sponsorship', value: '5' },
  { label: 'App Banner Placement', value: '6' },
];

export default function SponsoredProductsCalendarPage() {
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
  const startWeek = 30; // Week 30 = July 22nd, 2025

  const handleCellClick = (mediaProduct: any, weekNumber: number, value: number | string) => {
    console.log('Cell clicked:', { mediaProduct, weekNumber, value });
  };

  // Apply filters
  const filteredBookingsData = sponsoredProductBookingsData.filter(product => {
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
      logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: "Sponsored Products Calendar",
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