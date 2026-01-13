'use client';

import { MenuContextProvider } from '@/contexts/menu-context';
import { BreadcrumbProvider } from '@/contexts/breadcrumb-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs, Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Table as TableIcon, CalendarDays, ImagePlus, BarChart3, Bell } from 'lucide-react';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import React, { useState } from 'react';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { NotificationItem } from '@/components/ui/notification-item';
import { DateRange } from 'react-day-picker';

// Type definitions for mock data
interface CampaignResult {
  id: string;
  name: string;
  advertiser: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface BookingResult {
  id: string;
  name: string;
  placement: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface CreativeResult {
  id: string;
  name: string;
  format: string;
  campaign: string;
  status: string;
}

interface InsightResult {
  id: string;
  name: string;
  chartType: string;
  category: string;
  description: string;
}

interface NotificationResult {
  id: string;
  type: 'ai-insight' | 'budget-alert' | 'opportunity' | 'warning' | 'info';
  message: string;
  linkText?: string;
}

// Mock search results data
const allCampaignResults: CampaignResult[] = [
  { id: 'C-001', name: 'Summer Sale 2024', advertiser: 'Acme Corp', type: 'Display', status: 'Running', startDate: '2024-06-01', endDate: '2024-08-31' },
  { id: 'C-002', name: 'Holiday Promotion', advertiser: 'BrandX', type: 'Sponsored Products', status: 'Ready', startDate: '2024-11-15', endDate: '2024-12-31' },
  { id: 'C-003', name: 'Brand Awareness Q1', advertiser: 'MediaWorks', type: 'Digital In-Store', status: 'Running', startDate: '2024-01-01', endDate: '2024-03-31' },
  { id: 'C-004', name: 'New Product Launch', advertiser: 'TechStart', type: 'Offline In-Store', status: 'In option', startDate: '2024-04-01', endDate: '2024-04-30' },
  { id: 'C-005', name: 'Winter Collection', advertiser: 'FashionCo', type: 'Display', status: 'Paused', startDate: '2024-12-01', endDate: '2025-02-28' },
];

const allBookingResults: BookingResult[] = [
  { id: 'B-001', name: 'Homepage Banner - Week 12', placement: 'Homepage Hero', startDate: '2024-03-18', endDate: '2024-03-24', status: 'Confirmed' },
  { id: 'B-002', name: 'Checkout Placement', placement: 'Checkout Page', startDate: '2024-03-25', endDate: '2024-04-07', status: 'Pending' },
  { id: 'B-003', name: 'In-store Screen Network', placement: 'Store Entrance', startDate: '2024-04-01', endDate: '2024-04-30', status: 'Confirmed' },
  { id: 'B-004', name: 'End Cap Display', placement: 'Aisle End Cap', startDate: '2024-04-15', endDate: '2024-05-15', status: 'Draft' },
  { id: 'B-005', name: 'Category Page Banner', placement: 'Category Header', startDate: '2024-05-01', endDate: '2024-05-31', status: 'Confirmed' },
];

const allCreativeResults: CreativeResult[] = [
  { id: 'CR-001', name: 'Summer Banner 728x90', format: 'Banner', campaign: 'Summer Sale 2024', status: 'Approved' },
  { id: 'CR-002', name: 'Product Hero Image', format: 'Product Image', campaign: 'Holiday Promotion', status: 'Pending' },
  { id: 'CR-003', name: 'Store Video 15s', format: 'Video', campaign: 'Brand Awareness Q1', status: 'Approved' },
  { id: 'CR-004', name: 'Wobbler Design A', format: 'Wobbler', campaign: 'New Product Launch', status: 'Draft' },
  { id: 'CR-005', name: 'Holiday Promo Banner', format: 'Banner', campaign: 'Holiday Promotion', status: 'Rejected' },
  { id: 'CR-006', name: 'Digital Signage 16:9', format: 'Digital Signage', campaign: 'Brand Awareness Q1', status: 'Approved' },
];

const allInsightResults: InsightResult[] = [
  { id: 'I-001', name: 'Campaign Performance Overview', chartType: 'Line Chart', category: 'Performance', description: 'Track campaign performance over time' },
  { id: 'I-002', name: 'Revenue by Channel', chartType: 'Bar Chart', category: 'Revenue', description: 'Compare revenue across advertising channels' },
  { id: 'I-003', name: 'Impressions Trend', chartType: 'Area Chart', category: 'Performance', description: 'Daily impressions trend analysis' },
  { id: 'I-004', name: 'CTR by Campaign Type', chartType: 'Bar Chart', category: 'Engagement', description: 'Click-through rates comparison' },
  { id: 'I-005', name: 'Budget Allocation', chartType: 'Pie Chart', category: 'Budget', description: 'Budget distribution across campaigns' },
];

const allNotificationResults: NotificationResult[] = [
  { id: 'N-001', type: 'ai-insight', message: 'Your Summer Sale 2024 campaign is performing 23% above average. Consider increasing budget allocation.', linkText: 'Summer Sale 2024' },
  { id: 'N-002', type: 'budget-alert', message: 'Holiday Promotion campaign has reached 80% of allocated budget. Review spending to avoid overspend.', linkText: 'Holiday Promotion' },
  { id: 'N-003', type: 'opportunity', message: 'Summer Banner 728x90 has high engagement. Consider expanding to more placements.', linkText: 'Summer Banner 728x90' },
  { id: 'N-004', type: 'warning', message: 'Homepage Banner - Week 12 booking expires in 3 days. Take action to renew or cancel.', linkText: 'Homepage Banner - Week 12' },
  { id: 'N-005', type: 'info', message: 'Brand Awareness Q1 has exceeded 1M impressions milestone. View performance report for details.' },
  { id: 'N-006', type: 'ai-insight', message: 'Based on historical data, increasing bid by 15% on Winter Collection could improve ROAS by 20%.', linkText: 'Winter Collection' },
];

export interface SearchResultsProps {
  searchQuery: string;
  theme?: string;
  onRowClick?: (type: string, id: string) => void;
}

export function SearchResults({ searchQuery, theme = 'retailMedia', onRowClick }: SearchResultsProps) {
  const routes = getRoutesForTheme(theme);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaignStatus, setCampaignStatus] = useState<string[]>([]);
  const [campaignType, setCampaignType] = useState<string[]>([]);
  const [bookingStatus, setBookingStatus] = useState<string[]>([]);
  const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
  const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
  const [insightCategory, setInsightCategory] = useState<string[]>([]);
  const [insightChartType, setInsightChartType] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState<string[]>([]);
  const [campaignDateRange, setCampaignDateRange] = useState<DateRange | undefined>(undefined);
  const [bookingDateRange, setBookingDateRange] = useState<DateRange | undefined>(undefined);
  const [creativeDateRange, setCreativeDateRange] = useState<DateRange | undefined>(undefined);
  const [insightDateRange, setInsightDateRange] = useState<DateRange | undefined>(undefined);
  const [notificationDateRange, setNotificationDateRange] = useState<DateRange | undefined>(undefined);

  // Filter results based on search query
  const filterByQuery = <T,>(items: T[], query: string, getSearchableText: (item: T) => string): T[] => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item => getSearchableText(item).toLowerCase().includes(lowerQuery));
  };

  const campaignResults = filterByQuery(
    allCampaignResults,
    searchQuery,
    (item) => `${item.name} ${item.advertiser} ${item.type} ${item.status}`
  );
  const bookingResults = filterByQuery(
    allBookingResults,
    searchQuery,
    (item) => `${item.name} ${item.placement} ${item.status}`
  );
  const creativeResults = filterByQuery(
    allCreativeResults,
    searchQuery,
    (item) => `${item.name} ${item.format} ${item.campaign} ${item.status}`
  );
  const insightResults = filterByQuery(
    allInsightResults,
    searchQuery,
    (item) => `${item.name} ${item.chartType} ${item.category} ${item.description}`
  );
  const notificationResults = filterByQuery(
    allNotificationResults,
    searchQuery,
    (item) => `${item.message} ${item.type} ${item.linkText || ''}`
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Running':
      case 'Approved':
      case 'Confirmed':
        return 'success';
      case 'Ready':
      case 'Pending':
        return 'warning';
      case 'Paused':
      case 'Draft':
      case 'In option':
        return 'outline';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleRowClick = (row: { id: string }, type: string) => {
    if (onRowClick) {
      onRowClick(type, row.id);
    } else {
      console.log('Navigate to:', type, row.id);
    }
  };

  // Insight chart data
  const audienceDistributionData = [
    { name: 'Young Professionals', value: 35 },
    { name: 'Families', value: 28 },
    { name: 'Students', value: 22 },
    { name: 'Seniors', value: 15 },
  ];

  const audienceConfig = {
    'Young Professionals': { label: 'Young Professionals', color: 'hsl(258, 100%, 60%)' },
    'Families': { label: 'Families', color: 'hsl(258, 80%, 50%)' },
    'Students': { label: 'Students', color: 'hsl(258, 60%, 70%)' },
    'Seniors': { label: 'Seniors', color: 'hsl(258, 90%, 40%)' },
  };

  const clvData = [
    { audience: 'Young Prof.', avgOrderValue: 1200, clv: 85 },
    { audience: 'Families', avgOrderValue: 850, clv: 120 },
    { audience: 'Students', avgOrderValue: 320, clv: 45 },
    { audience: 'Seniors', avgOrderValue: 750, clv: 65 },
  ];

  const clvConfig = {
    avgOrderValue: { label: 'avgOrderValue', color: 'hsl(258, 100%, 60%)' },
    clv: { label: 'clv', color: 'hsl(258, 90%, 40%)' },
  };

  const totalResults = campaignResults.length + bookingResults.length + creativeResults.length + insightResults.length + notificationResults.length;

  const tabs = [
    {
      label: (<span className="flex items-center gap-2"><TableIcon className="w-4 h-4" />Campaigns ({campaignResults.length})</span>),
      value: 'campaigns',
      content: (
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <FilterBar
              filters={[
                {
                  name: 'Status',
                  options: [
                    { label: 'Running', value: 'running' },
                    { label: 'Ready', value: 'ready' },
                    { label: 'Paused', value: 'paused' },
                    { label: 'In option', value: 'in-option' },
                  ],
                  selectedValues: campaignStatus,
                  onChange: setCampaignStatus,
                },
                {
                  name: 'Type',
                  options: [
                    { label: 'Display', value: 'display' },
                    { label: 'Sponsored Products', value: 'sponsored-products' },
                    { label: 'Digital In-Store', value: 'digital-instore' },
                    { label: 'Offline In-Store', value: 'offline-instore' },
                  ],
                  selectedValues: campaignType,
                  onChange: setCampaignType,
                },
              ]}
              hideSearch
              className="flex-1"
            />
            <DateRangePicker
              dateRange={campaignDateRange}
              onDateRangeChange={setCampaignDateRange}
              placeholder="Filter by date"
              showPresets
              className="w-[280px]"
            />
          </div>
          <Table<CampaignResult>
            columns={[
              { key: 'id', header: 'ID', className: 'w-24' },
              { key: 'name', header: 'Campaign Name' },
              { key: 'advertiser', header: 'Advertiser' },
              { key: 'type', header: 'Type' },
              { key: 'status', header: 'Status', render: (row) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge> },
              { key: 'startDate', header: 'Start Date' },
              { key: 'endDate', header: 'End Date' },
            ]}
            data={campaignResults}
            hideActions
            onRowClick={(row) => handleRowClick(row, 'campaign')}
          />
        </div>
      ),
    },
    {
      label: (<span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />Bookings ({bookingResults.length})</span>),
      value: 'bookings',
      content: (
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <FilterBar
              filters={[
                {
                  name: 'Status',
                  options: [
                    { label: 'Confirmed', value: 'confirmed' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Draft', value: 'draft' },
                  ],
                  selectedValues: bookingStatus,
                  onChange: setBookingStatus,
                },
              ]}
              hideSearch
              className="flex-1"
            />
            <DateRangePicker
              dateRange={bookingDateRange}
              onDateRangeChange={setBookingDateRange}
              placeholder="Filter by date"
              showPresets
              className="w-[280px]"
            />
          </div>
          <Table<BookingResult>
            columns={[
              { key: 'id', header: 'ID', className: 'w-24' },
              { key: 'name', header: 'Booking Name' },
              { key: 'placement', header: 'Placement' },
              { key: 'startDate', header: 'Start Date' },
              { key: 'endDate', header: 'End Date' },
              { key: 'status', header: 'Status', render: (row) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge> },
            ]}
            data={bookingResults}
            hideActions
            onRowClick={(row) => handleRowClick(row, 'booking')}
          />
        </div>
      ),
    },
    {
      label: (<span className="flex items-center gap-2"><ImagePlus className="w-4 h-4" />Creatives ({creativeResults.length})</span>),
      value: 'creatives',
      content: (
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <FilterBar
              filters={[
                {
                  name: 'Status',
                  options: [
                    { label: 'Approved', value: 'approved' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Rejected', value: 'rejected' },
                  ],
                  selectedValues: creativeStatus,
                  onChange: setCreativeStatus,
                },
                {
                  name: 'Format',
                  options: [
                    { label: 'Banner', value: 'banner' },
                    { label: 'Video', value: 'video' },
                    { label: 'Product Image', value: 'product-image' },
                    { label: 'Digital Signage', value: 'digital-signage' },
                    { label: 'Wobbler', value: 'wobbler' },
                  ],
                  selectedValues: creativeFormat,
                  onChange: setCreativeFormat,
                },
              ]}
              hideSearch
              className="flex-1"
            />
            <DateRangePicker
              dateRange={creativeDateRange}
              onDateRangeChange={setCreativeDateRange}
              placeholder="Filter by date"
              showPresets
              className="w-[280px]"
            />
          </div>
          <Table<CreativeResult>
            columns={[
              { key: 'id', header: 'ID', className: 'w-24' },
              { key: 'name', header: 'Creative Name' },
              { key: 'format', header: 'Format' },
              { key: 'campaign', header: 'Campaign' },
              { key: 'status', header: 'Status', render: (row) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge> },
            ]}
            data={creativeResults}
            hideActions
            onRowClick={(row) => handleRowClick(row, 'creative')}
          />
        </div>
      ),
    },
    {
      label: (<span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" />Insights ({insightResults.length})</span>),
      value: 'insights',
      content: (
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <FilterBar
              filters={[
                {
                  name: 'Category',
                  options: [
                    { label: 'Performance', value: 'performance' },
                    { label: 'Revenue', value: 'revenue' },
                    { label: 'Engagement', value: 'engagement' },
                    { label: 'Budget', value: 'budget' },
                  ],
                  selectedValues: insightCategory,
                  onChange: setInsightCategory,
                },
                {
                  name: 'Chart Type',
                  options: [
                    { label: 'Line Chart', value: 'line-chart' },
                    { label: 'Bar Chart', value: 'bar-chart' },
                    { label: 'Area Chart', value: 'area-chart' },
                    { label: 'Pie Chart', value: 'pie-chart' },
                  ],
                  selectedValues: insightChartType,
                  onChange: setInsightChartType,
                },
              ]}
              hideSearch
              className="flex-1"
            />
            <DateRangePicker
              dateRange={insightDateRange}
              onDateRangeChange={setInsightDateRange}
              placeholder="Filter by date"
              showPresets
              className="w-[280px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => console.log('Navigate to: Audience Distribution')}>
              <CardHeader>
                <CardTitle>Audience Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  data={audienceDistributionData}
                  config={audienceConfig}
                  className="h-[300px]"
                  showLabels
                  labelPosition="outside"
                  showLegend
                />
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => console.log('Navigate to: Customer Lifetime Value')}>
              <CardHeader>
                <CardTitle>Customer Lifetime Value by Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={clvData}
                  config={clvConfig}
                  className="h-[300px]"
                  xAxisDataKey="audience"
                  showLegend
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      label: (<span className="flex items-center gap-2"><Bell className="w-4 h-4" />Notifications ({notificationResults.length})</span>),
      value: 'notifications',
      content: (
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <FilterBar
              filters={[
                {
                  name: 'Type',
                  options: [
                    { label: 'AI Insight', value: 'ai-insight' },
                    { label: 'Budget Alert', value: 'budget-alert' },
                    { label: 'Opportunity', value: 'opportunity' },
                    { label: 'Warning', value: 'warning' },
                    { label: 'Info', value: 'info' },
                  ],
                  selectedValues: notificationType,
                  onChange: setNotificationType,
                },
              ]}
              hideSearch
              className="flex-1"
            />
            <DateRangePicker
              dateRange={notificationDateRange}
              onDateRangeChange={setNotificationDateRange}
              placeholder="Filter by date"
              showPresets
              className="w-[280px]"
            />
          </div>
          <div className="space-y-3">
            {notificationResults.map((notification) => (
              <NotificationItem
                key={notification.id}
                type={notification.type}
                message={notification.message}
                linkText={notification.linkText}
                onLinkClick={() => console.log('Navigate to:', notification.linkText)}
                onActionClick={() => console.log('Action clicked:', notification.id)}
              />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <MenuContextProvider>
      <BreadcrumbProvider>
        <AppLayout
          routes={routes}
          pageHeaderProps={{
            title: `Search results for "${searchQuery}"`,
            subtitle: `Found ${totalResults} results`,
            headerRight: null,
          }}
        >
          <CardWithTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </AppLayout>
      </BreadcrumbProvider>
    </MenuContextProvider>
  );
}

export default SearchResults;
