import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { BreadcrumbProvider } from '@/contexts/breadcrumb-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs, tabFirst } from '../../ui/card';
import { Card, CardHeader, CardContent, MetricCard } from '@/components/ui/card';
import { MetricRow } from '@/components/ui/metric-row';
import { getPropositionMetrics } from '@/lib/proposition-metrics';
import { InsightsTab } from './insights-tab';
import { InboxPanel, useUnreadCount } from '@/components/ui/inbox-panel';
import { EntityControlBar } from '@/components/ui/entity-control-bar';
import { useRouteCampaign } from '@/lib/db';
import { CampaignCreativesPanel } from '@/components/ui/campaign-creatives-panel';
import type { MetricDefinition } from '@/components/ui/metric-row';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '../../ui/button';
import { LineChartComponent } from '@/components/ui/line-chart';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { MapChart } from '@/components/ui/map-chart';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight, X, Triangle, Check, Info, AlertTriangle, ScanBarcode } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { FormSection } from '../../ui/form-section';
import { type ObjectiveKpiValue } from '../../ui/objective-kpi-select';
import { Input } from '../../ui/input';
import { BuyingTypePicker } from '@/components/ui/buying-type-picker';
import { SearchSelectList } from '@/components/ui/search-select-list';
import { SearchableSelect } from '../../ui/searchable-select';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { cn } from '@/lib/utils';
import { DateRangePicker, futureDateRangePresets } from '../../ui/date-picker';
import { retailMoments } from '@/lib/retail-moments';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { productImageFor } from '@/lib/product-images';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';

/** Retail products the details form offers — the wizard's list. */
const detailsRetailProductOptions = [
  { value: 'RP-001', label: 'Coca-Cola Zero 1.5L', description: 'RP-001' },
  { value: 'RP-002', label: 'Coca-Cola Original 330ml (6-pack)', description: 'RP-002' },
  { value: 'RP-003', label: 'Fanta Orange 1.5L', description: 'RP-003' },
  { value: 'RP-004', label: 'Sprite 1.5L', description: 'RP-004' },
  { value: 'RP-005', label: 'Coca-Cola Cherry 330ml', description: 'RP-005' },
  { value: 'RP-006', label: 'Fuze Tea Peach 1L', description: 'RP-006' },
];
import React, { useState } from 'react';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { AddButton } from '@/components/ui/add-button';
import { addBooking } from '@/lib/create-entities';

// Derived ROAS / conversion-rate table columns. Values are computed from the
// row's revenue / ad spend / conversions / clicks so we don't duplicate them
// in the data. Brand-level figures run above the promoted SKU (the brand halo).
const parseMetric = (v: unknown) => parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')) || 0;
const roasOf = (revenue: unknown, spend: unknown) => {
  const s = parseMetric(spend);
  const r = parseMetric(revenue);
  return s && r ? `${Math.round((r / s) * 100)}%` : '–';
};
const convRateOf = (conversions: unknown, clicks: unknown) => {
  const c = parseMetric(clicks);
  const n = parseMetric(conversions);
  return c && n ? `${((n / c) * 100).toFixed(2)}%` : '–';
};
const BRAND_HALO = 1.45; // brand revenue/conversions ~45% above the promoted SKU

// Shared SP-wizard booking form data (used in SP Details tabs)
const spBookingCampaignOptions = [
  { label: 'Knorr Summer Sale – Sponsored', value: 'knorr-summer-sale' },
  { label: "Lay's Back to School – Display", value: 'lays-back-to-school' },
  { label: 'Heineken Q3 Brand Awareness', value: 'heineken-q3-brand' },
  { label: 'Maggi Holiday Gifting', value: 'maggi-holiday-gifting' },
];
const spBookingLocalBrands = [
  { id: 'food-lion', label: 'Food Lion' },
  { id: 'giant-food', label: 'Giant Food' },
  { id: 'hannaford', label: 'Hannaford' },
  { id: 'martins', label: "Martin's" },
  { id: 'stop-shop', label: 'Stop & Shop' },
  { id: 'giant-company', label: 'The Giant Company' },
];

// Media plans a campaign can be linked to (prototype data).
const mediaPlanOptions = [
  { label: 'Holiday Sale Campaign (C-001)', value: 'C-001' },
  { label: 'Summer Launch Campaign (C-002)', value: 'C-002' },
  { label: 'Back to School Promotion (C-003)', value: 'C-003' },
  { label: 'Q4 Brand Awareness (C-004)', value: 'C-004' },
  { label: 'Black Friday Push (C-005)', value: 'C-005' },
  { label: 'New Year Always-On (C-006)', value: 'C-006' },
  { label: 'Valentines Gifting (C-007)', value: 'C-007' },
  { label: 'Easter Family Meals (C-008)', value: 'C-008' },
  { label: "Mother's Day Premium (C-009)", value: 'C-009' },
  { label: 'BBQ & Outdoor Season (C-010)', value: 'C-010' },
  { label: 'Healthy January (C-011)', value: 'C-011' },
  { label: 'Spring Garden Goods (C-012)', value: 'C-012' },
];
// Budget cap per media plan — used by the Details tab to warn when
// a campaign budget exceeds what its media plan can cover.
const mediaPlanBudgets: Record<string, number> = {
  'C-001': 15000,
  'C-002': 8500,
  'C-003': 25000,
  'C-004': 40000,
  'C-005': 60000,
  'C-006': 18000,
  'C-007': 9000,
  'C-008': 14000,
  'C-009': 22000,
  'C-010': 30000,
  'C-011': 12000,
  'C-012': 16000,
};
const mediaPlanHref = (planId: string) => `/campaigns?from=campaign-details&plan=${planId}`;

// Advertiser + Brand options — long enough to make the search useful.
const advertiserOptions = [
  { label: 'Acme Media',         value: 'acme' },
  { label: 'BrandX',             value: 'brandx' },
  { label: 'Unilever',           value: 'unilever' },
  { label: 'Procter & Gamble',   value: 'pg' },
  { label: 'Nestlé',             value: 'nestle' },
  { label: 'Coca-Cola',          value: 'coca-cola' },
  { label: 'PepsiCo',            value: 'pepsico' },
  { label: 'Mondelez',           value: 'mondelez' },
  { label: 'Kellogg',            value: 'kellogg' },
  { label: 'General Mills',      value: 'general-mills' },
  { label: "L'Oréal",            value: 'loreal' },
  { label: 'Reckitt',            value: 'reckitt' },
  { label: 'Heineken',           value: 'heineken' },
  { label: 'Danone',             value: 'danone' },
  { label: 'Ferrero',            value: 'ferrero' },
];
const brandOptions = [
  { label: 'Brand 1',          value: 'brand1' },
  { label: 'Brand 2',          value: 'brand2' },
  { label: "Knorr",            value: 'knorr' },
  { label: "Lay's",            value: 'lays' },
  { label: 'Heineken',         value: 'heineken' },
  { label: 'Maggi',            value: 'maggi' },
  { label: 'Pampers',          value: 'pampers' },
  { label: 'Gillette',         value: 'gillette' },
  { label: 'Nescafé',          value: 'nescafe' },
  { label: 'KitKat',           value: 'kitkat' },
  { label: 'Sprite',           value: 'sprite' },
  { label: 'Doritos',          value: 'doritos' },
  { label: "Ben & Jerry's",    value: 'ben-jerrys' },
  { label: 'Magnum',           value: 'magnum' },
  { label: 'Oreo',             value: 'oreo' },
];

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Campaign Details',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Campaign Details Page Template

The Campaign Details page template provides a comprehensive view of individual campaigns with tabbed navigation for different data views. It combines campaign information display with detailed booking and creative management.

## Features

- **Tabbed Interface**: CardWithTabs component for organized content sections
- **Campaign Information**: Detailed campaign metadata and settings
- **Bookings Management**: Table view with filtering and actions
- **Creatives Management**: Table view with filtering and actions
- **Advanced Filtering**: FilterBar for both bookings and creatives
- **Action Menus**: Dropdown menus for row-level actions
- **Responsive Design**: Adapts to different screen sizes

## Tab Structure

### Campaign Information Tab
- **Campaign Details**: Name, advertiser, dates, budget
- **Settings**: Campaign configuration options
- **Status**: Current campaign status and approval state

### Bookings Tab
- **Data Table**: List of all bookings in the campaign
- **Filtering**: Filter by status, type, and other criteria
- **Actions**: Edit, duplicate, delete bookings
- **Search**: Real-time search across booking names
- **Status Badges**: Visual indicators for booking status

### Creatives Tab
- **Data Table**: List of all creatives in the campaign
- **Filtering**: Filter by format, status, and approval state
- **Actions**: Edit, duplicate, delete creatives
- **Search**: Real-time search across creative names
- **Status Badges**: Visual indicators for creative status

## Data Management

### Bookings
- **Status Tracking**: Active, Paused, Completed, Draft
- **Type Classification**: Display, Digital In-Store, Offline In-Store, Sponsored Products
- **Performance Metrics**: Impressions, clicks, conversions
- **Date Management**: Start/end dates with proper formatting

### Creatives
- **Approval Workflow**: Draft, Pending, Approved, Rejected
- **Format Classification**: Banner, Video, Digital Signage, etc.
- **Asset Management**: File uploads and asset tracking
- **Version Control**: Track creative versions and updates

## Action Capabilities

### Booking Actions
- **Edit**: Navigate to booking detail page
- **Duplicate**: Create copy of booking
- **Delete**: Remove booking from campaign
- **Pause/Resume**: Toggle booking status
- **View Performance**: Access performance metrics

### Creative Actions
- **Edit**: Navigate to creative detail page
- **Duplicate**: Create copy of creative
- **Delete**: Remove creative from campaign
- **Approve/Reject**: Change approval status
- **Download**: Download creative assets

## Business Rules

1. **Campaign Status**: Controls availability of actions
2. **User Permissions**: Role-based access to actions
3. **Data Integrity**: Cascading updates between related entities
4. **Status Validation**: Proper status transitions
5. **Asset Management**: File handling and storage

## Filter Options

### Bookings Filters
- **Status**: Active, Paused, Completed, Draft
- **Type**: Display, Digital In-Store, Offline In-Store, Sponsored Products
- **Performance**: Based on metrics thresholds

### Creatives Filters
- **Status**: Draft, Pending, Approved, Rejected
- **Format**: Banner, Video, Digital Signage, Wobbler, etc.
- **Type**: Display, Digital In-Store, Offline In-Store, Sponsored Products

## Usage

This template is ideal for:
- Campaign management and monitoring
- Line item and creative oversight
- Campaign performance analysis
- Asset management and approval workflows
- Multi-entity relationship management

## Components Used

- AppLayout (navigation, user management, page header)
- CardWithTabs (tabbed interface)
- Card (content containers)
- Table (data display with actions)
- FilterBar (filtering and search)
- Badge (status indicators)
- Button (actions and navigation)
- DropdownMenu (action menus)
- FormSection (organized form layouts)
- Input (form inputs)
- DatePicker (date selection)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


export const DigitalInstoreInOption: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [evaluationEnabled, setEvaluationEnabled] = React.useState(false);
    const [evaluationId, setEvaluationId] = React.useState('');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'In review', name: 'Booking 1', placement: 'Homepage', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-002', status: 'In review', name: 'Booking 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Increase Spend' },
      { id: 'LI-003', status: 'In review', name: 'Booking 3', placement: 'Footer', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-004', status: 'In review', name: 'Booking 4', placement: 'Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Increase Spend' },
      { id: 'LI-005', status: 'In review', name: 'Booking 5', placement: 'Homepage', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Optimize Budget' },
    ];
    
    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Digital In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In review', description: 'Campaign moved to in-option status' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added Homepage booking' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Banner creative uploaded' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Dates Modified', field: 'End Date', oldValue: '2024-06-25', newValue: '2024-06-30', description: 'Extended campaign end date' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Target Updated', field: 'Targeting', oldValue: 'Urban 18-35', newValue: 'Urban 18-45', description: 'Expanded age targeting' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Approved for launch', description: 'Added approval comment' },
    ];
    
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));
    
    // Forecast metrics for campaign
    const forecastMetrics = [
      { 
        id: 'repetitions', 
        label: 'Repetitions Forecast', 
        value: '4,200,000', 
        subMetric: 'Expected by end date',
        badgeValue: '+3.5%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'stores', 
        label: 'Stores Forecast', 
        value: '350', 
        subMetric: 'Coverage: 92%',
        badgeValue: '+2%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'reach', 
        label: 'Reach Forecast', 
        value: '2.8M', 
        subMetric: 'Unique users',
        badgeValue: '+4.2%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS Forecast', 
        value: '335%', 
        subMetric: 'Projected return',
        badgeValue: '+3.4%',
        badgeVariant: 'success' as const,
      },
    ];
    
    
    // State for interactive forecast - following the same pattern as SponsoredProductsRunning
    const [selectedForecastMetric, setSelectedForecastMetric] = useState<string | null>('spend');
    const [spendValue, setSpendValue] = useState(41866); // Initial spend value
    const [dragPosition, setDragPosition] = useState(50); // Position as percentage (0-100)
    const [isDragging, setIsDragging] = useState(false);
    
    // Calculate ROAS and Revenue based on spend using inverse relationship
    const calculateMetrics = (spend: number) => {
      // ROAS decreases as spend increases (inverse relationship) - scale values to be more visible
      const maxRoas = 600; // Scale up for visibility
      const minRoas = 100;
      const roasRange = maxRoas - minRoas;
      const spendRatio = (spend - 10000) / 40000; // Normalize spend to 0-1 range (10K-50K)
      const roas = maxRoas - (spendRatio * roasRange); // This will go from 600 down to 100
      
      // Revenue increases, creating a crossing point around middle
      const baseRevenue = 100; // Starting revenue 
      const maxRevenue = 500; // Max revenue
      const revenueRange = maxRevenue - baseRevenue;
      const revenue = baseRevenue + (spendRatio * revenueRange); // This will go from 100 up to 500
      
      return { spend, roas: Math.round(roas), revenue: Math.round(revenue) };
    };
    
    // Current metrics based on drag position
    const currentMetrics = calculateMetrics(spendValue);
    
    // Updated forecast metrics to match the original design and use proper MetricCard
const updatedForecastMetrics = [
      { 
        id: 'roas', 
        label: 'ROAS Forecast', 
        value: `${Math.round(currentMetrics.roas)}%`, 
        subMetric: 'Projected return',
        badgeValue: '+3.8%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'revenue', 
        label: 'Revenue Forecast', 
        value: `$${currentMetrics.revenue}K`, 
        subMetric: 'Total revenue',
        badgeValue: '+4.2%',
        badgeVariant: 'success' as const,
      },      { 
        id: 'performance', 
        label: 'Stores Forecast', 
        value: '350', 
        subMetric: 'Total coverage',
        badgeValue: '+5%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'customer-segments',
        label: 'Reach Forecast',
        value: '2.8M',
        subMetric: 'Total unique users',
        badgeValue: '+8%',
        badgeVariant: 'success' as const,
      },
    ];
    const dialogMetricsDigitalInOption: MetricDefinition[] = [
      { key: 'ctr', label: 'Click-Through Rate', value: '2.34%', subMetric: 'vs. 2.18% last period', badgeValue: '+7.3%', badgeVariant: 'success' },
      { key: 'conversionRate', label: 'Conversion Rate', value: '4.12%', subMetric: '1,234 conversions', badgeValue: '+12.5%', badgeVariant: 'success' },
      { key: 'cpc', label: 'Cost Per Click', value: '$0.58', subMetric: 'vs. $0.62 target', badgeValue: '-6.5%', badgeVariant: 'success' },
      { key: 'viewability', label: 'Viewability Rate', value: '87.3%', subMetric: 'Above industry avg', badgeValue: '+5.2%', badgeVariant: 'success' },
      { key: 'brandLift', label: 'Brand Lift', value: '+18.2%', subMetric: 'Awareness increase', badgeValue: 'High', badgeVariant: 'info' },
      { key: 'sov', label: 'Share of Voice', value: '34.7%', subMetric: 'In category', badgeValue: '+2.1%', badgeVariant: 'secondary' },
      { key: 'frequency', label: 'Frequency', value: '3.8x', subMetric: 'Avg. per user', badgeValue: 'Optimal', badgeVariant: 'success' },
      { key: 'vcr', label: 'Video Completion Rate', value: '68.9%', subMetric: '15s videos', badgeValue: '+9.4%', badgeVariant: 'success' },
      { key: 'cpa', label: 'Cost Per Acquisition', value: '$24.50', subMetric: 'vs. $30 target', badgeValue: '-18.3%', badgeVariant: 'success' },
    ];

    const ForecastSection = () => (
      <div className="space-y-section">
        <MetricRow
          metrics={updatedForecastMetrics.map(m => ({ ...m, key: m.id }))}
          selectedKeys={updatedForecastMetrics.map(m => m.id)}
          maxVisible={5}
          defaultVariant="default"
          removable={false}
          activeKey={selectedForecastMetric}
          onActiveKeyChange={setSelectedForecastMetric}
          dialogMetrics={dialogMetricsDigitalInOption}
          onDialogMetricClick={(key) => console.log(`${key} selected`)}
        />

        {/* Interactive Forecast Chart - only show when spend, roas, or revenue is selected */}
        {(selectedForecastMetric === 'roas' || selectedForecastMetric === 'revenue') && (
          <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedForecastMetric(null)}
                aria-label="Close chart"
                className="absolute top-2 right-2 z-10"
              >
                <X className="w-4 h-4" />
              </Button>
              {/* Generate data for LineChart */}
              <LineChartComponent
                data={(() => {
                  const data = [];
                  for (let spend = 10; spend <= 50; spend += 2) { // 10K to 50K in 2K steps
                    const metrics = calculateMetrics(spend * 1000);
                    data.push({
                      spend: `${spend}K`,
                      spendValue: spend * 1000,
                      roas: metrics.roas,
                      revenue: metrics.revenue,
                    });
                  }
                  return data;
                })()}
                config={{
                  roas: {
                    label: "ROAS",
                    color: "hsl(var(--chart-1))", // Theme chart color 1
                  },
                  revenue: {
                    label: "Revenue",  
                    color: "hsl(var(--chart-2))", // Theme chart color 2
                  },
                }}
                showLegend={true}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-[300px] w-full"
                xAxisDataKey="spend"
                yAxisLabel="Revenue"
                secondaryYAxis={{
                  dataKey: "roas",
                  domain: [0, 700],
                  label: "ROAS"
                }}
              />
              
              {/* Interactive overlay for dragging */}
              <div 
                className="absolute inset-0"
                style={{ 
                  cursor: isDragging ? 'ew-resize' : 'crosshair',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  
                  const container = e.currentTarget;
                  const rect = container.getBoundingClientRect();
                  
                  // Account for chart margins - Recharts typically has margins
                  const chartMarginLeft = rect.width * 0.1; // ~10% left margin
                  const chartMarginRight = rect.width * 0.05; // ~5% right margin  
                  const chartWidth = rect.width - chartMarginLeft - chartMarginRight;
                  
                  const updateSpend = (clientX: number) => {
                    const x = clientX - rect.left - chartMarginLeft;
                    const percentage = Math.max(0, Math.min(100, (x / chartWidth) * 100));
                    const newSpend = 10000 + (percentage / 100) * 40000;
                    setSpendValue(Math.round(newSpend));
                    setDragPosition(percentage);
                  };
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    updateSpend(e.clientX);
                  };
                  
                  const handleMouseUp = () => {
                    setIsDragging(false);
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                  
                  // Set initial position
                  updateSpend(e.clientX);
                }}
              >
                {/* Vertical indicator line */}
                <div 
                  className="absolute top-0 bottom-0 w-px bg-border pointer-events-none"
                  style={{ 
                    left: `${10 + (dragPosition * 0.85)}%`, // Account for chart margins
                    zIndex: 10 
                  }}
                >
                  {/* Spend amount as central element with chevrons */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-neutral-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap">
                    {/* Left chevron */}
                    <ChevronLeft className="w-4 h-4 mr-1 text-primary" />
                    
                    {/* Spend amount */}
                    <span className="font-medium">
                      Spend amount ${(spendValue / 1000).toFixed(0)}K
                    </span>
                    
                    {/* Right chevron */}
                    <ChevronRight className="w-4 h-4 ml-1 text-primary" />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Regular chart for other metrics */}
        {selectedForecastMetric === 'performance' && (
          <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedForecastMetric(null)}
                aria-label="Close chart"
                className="absolute top-2 right-2 z-10"
              >
                <X className="w-4 h-4" />
              </Button>
              <MapChart
                data={[
                  // Amsterdam area
                  { name: 'Amsterdam Central', plays: 5847, x: 48, y: 35 },
                  { name: 'Amsterdam Zuid', plays: 4239, x: 46, y: 40 },
                  { name: 'Amsterdam Noord', plays: 3156, x: 50, y: 32 },
                  
                  // Rotterdam area
                  { name: 'Rotterdam Central', plays: 6241, x: 40, y: 55 },
                  { name: 'Rotterdam Zuid', plays: 2847, x: 42, y: 58 },
                  
                  // Den Haag area
                  { name: 'Den Haag HS', plays: 4156, x: 35, y: 50 },
                  { name: 'Den Haag Central', plays: 3542, x: 33, y: 52 },
                  
                  // Utrecht area
                  { name: 'Utrecht CS', plays: 5123, x: 52, y: 48 },
                  { name: 'Utrecht Noord', plays: 2156, x: 54, y: 45 },
                  
                  // Eindhoven area
                  { name: 'Eindhoven CS', plays: 3789, x: 58, y: 70 },
                  { name: 'Eindhoven Airport', plays: 1923, x: 62, y: 72 },
                  
                  // Other major cities
                  { name: 'Groningen CS', plays: 2456, x: 65, y: 15 },
                  { name: 'Breda CS', plays: 2789, x: 45, y: 68 },
                  { name: 'Tilburg CS', plays: 3234, x: 52, y: 65 },
                  { name: 'Arnhem CS', plays: 2945, x: 68, y: 52 },
                  { name: 'Haarlem CS', plays: 2567, x: 42, y: 38 },
                  { name: 'Almere CS', plays: 3456, x: 58, y: 42 },
                ]}
                title="Store Performance Map"
                className="w-full"
              />
            </div>
          </div>
        )}
        {/* Reach Forecast pie chart */}
        {selectedForecastMetric === 'customer-segments' && (
          <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedForecastMetric(null)}
                aria-label="Close chart"
                className="absolute top-2 right-2 z-10"
              >
                <X className="w-4 h-4" />
              </Button>
              <PieChartComponent
                data={[
                  { name: 'Urban', value: 1260000, fill: 'hsl(var(--chart-1))' },
                  { name: 'Young adults', value: 980000, fill: 'hsl(var(--chart-2))' },
                  { name: 'Family with kids', value: 560000, fill: 'hsl(var(--chart-3))' },
                ]}
                config={{
                  Urban: {
                    label: 'Urban',
                    color: 'hsl(var(--chart-1))',
                  },
                  'Young adults': {
                    label: 'Young adults',
                    color: 'hsl(var(--chart-2))',
                  },
                  'Family with kids': {
                    label: 'Family with kids',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                showLabels={true}
                showLegend={true}
                showTooltip={true}
                className="h-80 w-full"
                dataKey="value"
                nameKey="name"
              />
            </div>
          </div>
        )}
      </div>
    );
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Digital in-store, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the digital instore workflow. */}
        <EntityControlBar
          level="campaign"
          engine="digital-instore"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                    <div className="md:col-span-2">
                      {/* How the campaign buys is part of what it is — the wizard asks it
                          with the name, so it sits here too. */}
                      <BuyingTypePicker value={detailsBuyingType} onChange={setDetailsBuyingType} />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Campaign evaluation" className="mb-6">
                  <div className="space-y-field">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm text-muted-foreground">Add an Evaluation ID to group this campaign with related ones.</p>
                      <Switch checked={evaluationEnabled} onCheckedChange={setEvaluationEnabled} />
                    </div>
                    {evaluationEnabled && (
                      <TooltipProvider delayDuration={150}>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <label className="block text-sm font-medium">Evaluation ID</label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center text-muted-foreground cursor-help">
                                  <Info className="h-3.5 w-3.5" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Set by AdOps in the PREP or DONE phase.</TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            value={evaluationId}
                            onChange={(e) => setEvaluationId(e.target.value)}
                            placeholder="e.g. holiday-2025-baseline"
                          />
                        </div>
                      </TooltipProvider>
                    )}
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Placement',
                        options: [
                          { label: 'Homepage', value: 'Homepage' },
                          { label: 'Sidebar', value: 'Sidebar' },
                          { label: 'Footer', value: 'Footer' },
                          { label: 'Header', value: 'Header' },
                        ],
                        selectedValues: placement,
                        onChange: setPlacement,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/digital-instore/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="digital-instore" className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="digital-instore" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to log detail: ${row.action} (${row.id})`)}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('digital-instore', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const DigitalInstoreRunning: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [evaluationEnabled, setEvaluationEnabled] = React.useState(false);
    const [evaluationId, setEvaluationId] = React.useState('');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'Live', name: 'Booking 1', placement: 'Homepage', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Increase Spend' },
      { id: 'LI-002', status: 'Live', name: 'Booking 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-003', status: 'Live', name: 'Booking 3', placement: 'Footer', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Increase Spend' },
      { id: 'LI-004', status: 'Live', name: 'Booking 4', placement: 'Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-005', status: 'Live', name: 'Booking 5', placement: 'Homepage', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Increase Spend' },
    ];
    
    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Digital In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'Live', description: 'Campaign is now live' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added Homepage booking' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Banner creative uploaded' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Dates Modified', field: 'End Date', oldValue: '2024-06-25', newValue: '2024-06-30', description: 'Extended campaign end date' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Target Updated', field: 'Targeting', oldValue: 'Urban 18-35', newValue: 'Urban 18-45', description: 'Expanded age targeting' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Campaign performing well', description: 'Added performance comment' },
    ];
    
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));
    
    // Performance metrics for running campaign
    const performanceMetrics = [
      { 
        id: 'repetitions', 
        label: 'Repetitions', 
        value: '4,058,317', 
        subMetric: 'CTR: 2.14%',
        badgeValue: '+8%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'stores', 
        label: 'Stores', 
        value: '343', 
        subMetric: 'Coverage: 89%',
        badgeValue: '0%',
        badgeVariant: 'secondary' as const,
      },
      { 
        id: 'reach', 
        label: 'Reach', 
        value: '2.6M', 
        subMetric: 'Unique users',
        badgeValue: '+12%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS', 
        value: '324%', 
        subMetric: 'AOV: €78.50',
        badgeValue: '+12%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const dialogMetricsDigitalInstoreRunning: MetricDefinition[] = [
      { key: 'ctr', label: 'Click-Through Rate', value: '2.14%', subMetric: 'vs. 1.98% last period', badgeValue: '+8.1%', badgeVariant: 'success' },
      { key: 'conversionRate', label: 'Conversion Rate', value: '3.84%', subMetric: '1,156 conversions', badgeValue: '+12.8%', badgeVariant: 'success' },
      { key: 'cpc', label: 'Cost Per Click', value: '$0.45', subMetric: 'vs. $0.52 target', badgeValue: '-13.5%', badgeVariant: 'success' },
      { key: 'viewability', label: 'Viewability Rate', value: '89.2%', subMetric: 'Above industry avg', badgeValue: '+6.4%', badgeVariant: 'success' },
      { key: 'brandLift', label: 'Brand Lift', value: '+16.8%', subMetric: 'Awareness increase', badgeValue: 'High', badgeVariant: 'info' },
      { key: 'sov', label: 'Share of Voice', value: '29.5%', subMetric: 'In category', badgeValue: '+1.8%', badgeVariant: 'secondary' },
      { key: 'frequency', label: 'Frequency', value: '3.2x', subMetric: 'Avg. per user', badgeValue: 'Optimal', badgeVariant: 'success' },
      { key: 'vcr', label: 'Video Completion Rate', value: '72.1%', subMetric: '15s videos', badgeValue: '+8.7%', badgeVariant: 'success' },
      { key: 'cpa', label: 'Cost Per Acquisition', value: '$22.80', subMetric: 'vs. $28 target', badgeValue: '-18.6%', badgeVariant: 'success' },
    ];

    // Unified per-proposition metric cards (same labels as the
    // /campaigns/digital-instore overview, values scaled to this single
    // campaign). See getPropositionMetrics().
    const ForecastSection = () => (
      <MetricRow
        metrics={getPropositionMetrics('digital-instore', 'campaign')}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        bleedEdges
      />
    );

    return (
      <BreadcrumbProvider
        entities={[
          {
            id: 'C-001',
            name: 'Summer Launch',
            type: 'campaign',
            campaignType: 'digital-instore',
          },
        ]}
      >
        <MenuContextProvider>
          <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Digital in-store, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
          }}
        >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the digital instore workflow. */}
        <EntityControlBar
          level="campaign"
          engine="digital-instore"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                    <div className="md:col-span-2">
                      {/* How the campaign buys is part of what it is — the wizard asks it
                          with the name, so it sits here too. */}
                      <BuyingTypePicker value={detailsBuyingType} onChange={setDetailsBuyingType} />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Campaign evaluation" className="mb-6">
                  <div className="space-y-field">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm text-muted-foreground">Add an Evaluation ID to group this campaign with related ones.</p>
                      <Switch checked={evaluationEnabled} onCheckedChange={setEvaluationEnabled} />
                    </div>
                    {evaluationEnabled && (
                      <TooltipProvider delayDuration={150}>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <label className="block text-sm font-medium">Evaluation ID</label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center text-muted-foreground cursor-help">
                                  <Info className="h-3.5 w-3.5" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Set by AdOps in the PREP or DONE phase.</TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            value={evaluationId}
                            onChange={(e) => setEvaluationId(e.target.value)}
                            placeholder="e.g. holiday-2025-baseline"
                          />
                        </div>
                      </TooltipProvider>
                    )}
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Placement',
                        options: [
                          { label: 'Homepage', value: 'Homepage' },
                          { label: 'Sidebar', value: 'Sidebar' },
                          { label: 'Footer', value: 'Footer' },
                          { label: 'Header', value: 'Header' },
                        ],
                        selectedValues: placement,
                        onChange: setPlacement,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/digital-instore/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="digital-instore" showPerformance className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="digital-instore" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/digital-instore/creative/${row.id}`}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('digital-instore', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
      </BreadcrumbProvider>
    );
  },
};

export const OfflineInstoreRunning: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'Live', name: 'Booking 1', placement: 'End Cap', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Optimize Budget', adSpend: '€6,490', impressions: '375,084', clicks: '4,913', cpc: '€1.32', ctr: '1.31%', cpm: '€26.64', ecpm: '€17.30', onlineSkuRevenue: '€8,536', onlineSkuUnits: '691', onlineSkuConversions: '427', instoreSkuRevenue: '€10,248', instoreSkuUnits: '978', instoreSkuConversions: '616', totalSkuRevenue: '€18,784', totalSkuUnits: '1,669', totalSkuConversions: '1,043' },
      { id: 'LI-002', status: 'Live', name: 'Booking 2', placement: 'Shelf Edge', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Increase Spend', adSpend: '€6,490', impressions: '375,084', clicks: '4,913', cpc: '€1.32', ctr: '1.31%', cpm: '€26.64', ecpm: '€17.30', onlineSkuRevenue: '€8,536', onlineSkuUnits: '691', onlineSkuConversions: '427', instoreSkuRevenue: '€10,248', instoreSkuUnits: '978', instoreSkuConversions: '616', totalSkuRevenue: '€18,784', totalSkuUnits: '1,669', totalSkuConversions: '1,043' },
      { id: 'LI-003', status: 'Live', name: 'Booking 3', placement: 'Floor Stand', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Optimize Budget', adSpend: '€7,778', impressions: '450,101', clicks: '5,895', cpc: '€1.32', ctr: '1.31%', cpm: '€26.64', ecpm: '€17.30', onlineSkuRevenue: '€10,243', onlineSkuUnits: '829', onlineSkuConversions: '512', instoreSkuRevenue: '€12,298', instoreSkuUnits: '1,174', instoreSkuConversions: '739', totalSkuRevenue: '€22,541', totalSkuUnits: '2,003', totalSkuConversions: '1,251' },
      { id: 'LI-004', status: 'Live', name: 'Booking 4', placement: 'Aisle Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Increase Spend', adSpend: '€5,846', impressions: '337,575', clicks: '4,423', cpc: '€1.32', ctr: '1.31%', cpm: '€26.64', ecpm: '€17.30', onlineSkuRevenue: '€7,682', onlineSkuUnits: '622', onlineSkuConversions: '384', instoreSkuRevenue: '€9,223', instoreSkuUnits: '881', instoreSkuConversions: '554', totalSkuRevenue: '€16,905', totalSkuUnits: '1,503', totalSkuConversions: '938' },
      { id: 'LI-005', status: 'Live', name: 'Booking 5', placement: 'Checkout', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Optimize Budget', adSpend: '€5,846', impressions: '337,576', clicks: '4,423', cpc: '€1.32', ctr: '1.31%', cpm: '€26.64', ecpm: '€17.30', onlineSkuRevenue: '€7,683', onlineSkuUnits: '623', onlineSkuConversions: '384', instoreSkuRevenue: '€9,223', instoreSkuUnits: '881', instoreSkuConversions: '553', totalSkuRevenue: '€16,906', totalSkuUnits: '1,504', totalSkuConversions: '937' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Offline In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'Live', description: 'Campaign is now live' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added End Cap booking' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Print creative uploaded' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Dates Modified', field: 'End Date', oldValue: '2024-06-25', newValue: '2024-06-30', description: 'Extended campaign end date' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Target Updated', field: 'Targeting', oldValue: 'Urban 18-35', newValue: 'Urban 18-45', description: 'Expanded age targeting' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Campaign performing well', description: 'Added performance comment' },
    ];

    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));

    // Performance metrics for running campaign
    const performanceMetrics: MetricDefinition[] = [
      { key: 'adSpend', label: 'Ad Spend', value: '€32,450', subMetric: 'Budget: €50,000', badgeValue: '+12%', badgeVariant: 'success' },
      { key: 'impressions', label: 'Impressions', value: '1,875,420', subMetric: 'Unique: 1.2M', badgeValue: '+6%', badgeVariant: 'success' },
      { key: 'clicks', label: 'Clicks + Add to Carts', value: '24,567', subMetric: 'Add to Carts: 3,245', badgeValue: '+8%', badgeVariant: 'success' },
      { key: 'cpc', label: 'CPC', value: '€1.32', subMetric: 'Ad Spend / Clicks', badgeValue: '-5%', badgeVariant: 'success' },
      { key: 'ctr', label: 'CTR', value: '1.31%', subMetric: 'Clicks / Impressions', badgeValue: '+3%', badgeVariant: 'success' },
      { key: 'cpm', label: 'CPM', value: '€26.64', subMetric: 'Budget / Impressions × 1,000', badgeValue: '-2%', badgeVariant: 'success' },
      { key: 'ecpm', label: 'eCPM', value: '€17.30', subMetric: 'Spend / Impressions × 1,000', badgeValue: '-4%', badgeVariant: 'success' },
      { key: 'onlineSkuRevenue', label: 'Online SKU Revenue', value: '€42,680', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+18%', badgeVariant: 'success' },
      { key: 'onlineSkuUnits', label: 'Online SKU Units', value: '3,456', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+14%', badgeVariant: 'success' },
      { key: 'onlineSkuConversions', label: 'Online SKU Conversions', value: '2,134', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+11%', badgeVariant: 'success' },
      { key: 'instoreSkuRevenue', label: 'In-store SKU Revenue', value: '€51,240', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+22%', badgeVariant: 'success' },
      { key: 'instoreSkuUnits', label: 'In-store SKU Units', value: '4,892', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+16%', badgeVariant: 'success' },
      { key: 'instoreSkuConversions', label: 'In-store SKU Conversions', value: '3,078', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+13%', badgeVariant: 'success' },
      { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '€93,920', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+20%', badgeVariant: 'success' },
      { key: 'totalSkuUnits', label: 'Total SKU Units', value: '8,348', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+15%', badgeVariant: 'success' },
      { key: 'totalSkuConversions', label: 'Total SKU Conversions', value: '5,212', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+12%', badgeVariant: 'success' },
    ];

    // Unified per-proposition cards — same labels as
    // /campaigns/offline-instore, values scoped to this campaign.
    const ForecastSection = () => (
      <MetricRow
        metrics={getPropositionMetrics('offline-instore', 'campaign')}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        bleedEdges
      />
    );

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Offline in-store, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the offline instore workflow. */}
        <EntityControlBar
          level="campaign"
          engine="offline-instore"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Placement',
                        options: [
                          { label: 'End Cap', value: 'End Cap' },
                          { label: 'Shelf Edge', value: 'Shelf Edge' },
                          { label: 'Floor Stand', value: 'Floor Stand' },
                          { label: 'Aisle Header', value: 'Aisle Header' },
                          { label: 'Checkout', value: 'Checkout' },
                        ],
                        selectedValues: placement,
                        onChange: setPlacement,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                      { key: 'adSpend', header: 'Ad Spend' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks + Add to Carts' },
                      { key: 'cpc', header: 'CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'cpm', header: 'CPM' },
                      { key: 'ecpm', header: 'eCPM' },
                      { key: 'onlineSkuRevenue', header: 'Online SKU Revenue' },
                      { key: 'onlineSkuUnits', header: 'Online SKU Units' },
                      { key: 'onlineSkuConversions', header: 'Online SKU Conversions' },
                      { key: 'instoreSkuRevenue', header: 'In-store SKU Revenue' },
                      { key: 'instoreSkuUnits', header: 'In-store SKU Units' },
                      { key: 'instoreSkuConversions', header: 'In-store SKU Conversions' },
                      { key: 'totalSkuRevenue', header: 'Total SKU Revenue' },
                      { key: 'totalSkuUnits', header: 'Total SKU Units' },
                      { key: 'totalSkuConversions', header: 'Total SKU Conversions' },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offline-instore/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="offline-instore" showPerformance className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="offline-instore" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offline-instore/creative/${row.id}`}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('offline-instore', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const DisplayRunning: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'Live', name: 'Booking 1', placement: 'Above The Fold', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,248', totalSkuConversionRate: '3.2%', totalSkuUnits: '2,156', totalSkuRevenue: '$45,280', totalSkuRoas: '480%', onlineSkuConversions: '892', onlineSkuUnits: '1,543', onlineSkuRevenue: '$32,100', instoreSkuConversions: '356', instoreSkuUnits: '613', instoreSkuRevenue: '$13,180' },
      { id: 'LI-002', status: 'Live', name: 'Booking 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget', totalSkuConversions: '987', totalSkuConversionRate: '2.8%', totalSkuUnits: '1,734', totalSkuRevenue: '$38,450', totalSkuRoas: '420%', onlineSkuConversions: '721', onlineSkuUnits: '1,245', onlineSkuRevenue: '$27,320', instoreSkuConversions: '266', instoreSkuUnits: '489', instoreSkuRevenue: '$11,130' },
      { id: 'LI-003', status: 'Live', name: 'Booking 3', placement: 'Native Feed', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Increase Spend', totalSkuConversions: '2,134', totalSkuConversionRate: '4.1%', totalSkuUnits: '3,567', totalSkuRevenue: '$72,450', totalSkuRoas: '530%', onlineSkuConversions: '1,489', onlineSkuUnits: '2,398', onlineSkuRevenue: '$49,780', instoreSkuConversions: '645', instoreSkuUnits: '1,169', instoreSkuRevenue: '$22,670' },
      { id: 'LI-004', status: 'Live', name: 'Booking 4', placement: 'Interstitial', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Optimize Budget', totalSkuConversions: '743', totalSkuConversionRate: '2.1%', totalSkuUnits: '1,298', totalSkuRevenue: '$28,920', totalSkuRoas: '370%', onlineSkuConversions: '534', onlineSkuUnits: '923', onlineSkuRevenue: '$20,440', instoreSkuConversions: '209', instoreSkuUnits: '375', instoreSkuRevenue: '$8,480' },
      { id: 'LI-005', status: 'Live', name: 'Booking 5', placement: 'Bottom Banner', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,567', totalSkuConversionRate: '3.6%', totalSkuUnits: '2,834', totalSkuRevenue: '$58,670', totalSkuRoas: '490%', onlineSkuConversions: '1,098', onlineSkuUnits: '1,954', onlineSkuRevenue: '$40,230', instoreSkuConversions: '469', instoreSkuUnits: '880', instoreSkuRevenue: '$18,440' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Display: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'Live', description: 'Campaign is now live' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added Above The Fold booking' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Display banner creative uploaded' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Dates Modified', field: 'End Date', oldValue: '2024-06-25', newValue: '2024-06-30', description: 'Extended campaign end date' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Target Updated', field: 'Targeting', oldValue: 'Desktop 18-35', newValue: 'Multi-device 18-45', description: 'Expanded targeting parameters' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Display performance exceeds expectations', description: 'Added performance comment' },
    ];

    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));

    // Performance metrics for running campaign
    const performanceMetrics = [
      {
        id: 'impressions',
        label: 'Impressions',
        value: '8,425,736',
        subMetric: 'Viewability: 78.4%',
        badgeValue: '+14%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'clicks',
        label: 'Clicks',
        value: '124,387',
        subMetric: 'CTR: 1.47%',
        badgeValue: '+9%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'reach',
        label: 'Reach',
        value: '3.2M',
        subMetric: 'Frequency: 2.6',
        badgeValue: '+18%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'roas',
        label: 'ROAS',
        value: '412%',
        subMetric: 'CPA: €23.50',
        badgeValue: '+22%',
        badgeVariant: 'success' as const,
      },
    ];

    const dialogMetricsDisplayRunning: MetricDefinition[] = [
      { key: 'ctr', label: 'Click-Through Rate', value: '1.47%', subMetric: 'vs. 1.32% last period', badgeValue: '+11.4%', badgeVariant: 'success' },
      { key: 'viewability', label: 'Viewability Rate', value: '78.4%', subMetric: 'Above industry avg', badgeValue: '+5.8%', badgeVariant: 'success' },
      { key: 'cpm', label: 'Cost Per Mille', value: '$2.85', subMetric: 'vs. $3.20 target', badgeValue: '-10.9%', badgeVariant: 'success' },
      { key: 'videoCompletion', label: 'Video Completion', value: '68.9%', subMetric: '15s completion', badgeValue: '+7.3%', badgeVariant: 'success' },
      { key: 'brandLift', label: 'Brand Lift', value: '+19.2%', subMetric: 'Awareness increase', badgeValue: 'High', badgeVariant: 'info' },
      { key: 'frequency', label: 'Frequency', value: '2.6x', subMetric: 'Avg. per user', badgeValue: 'Optimal', badgeVariant: 'success' },
      { key: 'cpc', label: 'Cost Per Click', value: '$1.94', subMetric: 'vs. $2.15 target', badgeValue: '-9.8%', badgeVariant: 'success' },
      { key: 'engagementRate', label: 'Engagement Rate', value: '3.2%', subMetric: 'Rich media ads', badgeValue: '+15.6%', badgeVariant: 'success' },
      { key: 'conversionRate', label: 'Conversion Rate', value: '2.8%', subMetric: 'Post-click conv.', badgeValue: '+18.2%', badgeVariant: 'success' },
    ];

    const ForecastSection = () => (
      <MetricRow
        metrics={getPropositionMetrics('display', 'campaign')}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        bleedEdges
      />
    );

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Display, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the display workflow. */}
        <EntityControlBar
          level="campaign"
          engine="display"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                    <div className="md:col-span-2">
                      {/* How the campaign buys is part of what it is — the wizard asks it
                          with the name, so it sits here too. */}
                      <BuyingTypePicker value={detailsBuyingType} onChange={setDetailsBuyingType} />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Placement',
                        options: [
                          { label: 'Above The Fold', value: 'Above The Fold' },
                          { label: 'Sidebar', value: 'Sidebar' },
                          { label: 'Native Feed', value: 'Native Feed' },
                          { label: 'Interstitial', value: 'Interstitial' },
                          { label: 'Bottom Banner', value: 'Bottom Banner' },
                        ],
                        selectedValues: placement,
                        onChange: setPlacement,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                      { key: 'totalSkuConversions', header: 'Total SKU conversions' },
                      { key: 'totalSkuConversionRate', header: 'Total SKU conversion rate' },
                      { key: 'totalSkuUnits', header: 'Total SKU units' },
                      { key: 'totalSkuRevenue', header: 'Total SKU Revenue' },
                      { key: 'totalSkuRoas', header: 'Total SKU ROAS' },
                      { key: 'onlineSkuConversions', header: 'Online SKU conversions' },
                      { key: 'onlineSkuUnits', header: 'Online SKU units' },
                      { key: 'onlineSkuRevenue', header: 'Online SKU Revenue' },
                      { key: 'instoreSkuConversions', header: 'In-store SKU conversions' },
                      { key: 'instoreSkuUnits', header: 'In-store SKU units' },
                      { key: 'instoreSkuRevenue', header: 'In-store SKU Revenue' },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/display/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="display" showPerformance className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="display" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/display/creative/${row.id}`}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('display', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const OfflineInstoreInOption: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'In review', name: 'Booking 1', placement: 'End Cap', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-002', status: 'In review', name: 'Booking 2', placement: 'Shelf Edge', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Increase Spend' },
      { id: 'LI-003', status: 'Ready', name: 'Booking 3', placement: 'Floor Stand', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-004', status: 'In review', name: 'Booking 4', placement: 'Aisle Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Increase Spend' },
      { id: 'LI-005', status: 'Ready', name: 'Booking 5', placement: 'Checkout', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Optimize Budget' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-09 16:20:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Offline In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-09 16:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€0', newValue: '€75,000', description: 'Initial budget allocation' },
      { id: 'LOG-003', timestamp: '2024-12-10 09:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added End Cap booking for approval' },
      { id: 'LOG-004', timestamp: '2024-12-10 10:45:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Print creative uploaded for review' },
      { id: 'LOG-005', timestamp: '2024-12-10 11:30:14', user: 'Mike Johnson', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In review', description: 'Campaign moved to in-option status' },
      { id: 'LOG-006', timestamp: '2024-12-10 14:20:58', user: 'Sarah Wilson', action: 'Target Updated', field: 'Targeting', oldValue: 'Urban 25-45', newValue: 'Urban 18-45', description: 'Expanded age targeting for approval' },
      { id: 'LOG-007', timestamp: '2024-12-10 16:45:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Awaiting client approval for placements', description: 'Added status comment' },
    ];

    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));

    // Performance metrics for in-option campaign (forecasted)
    const performanceMetrics = [
      {
        id: 'projected-impressions',
        label: 'Projected Impressions',
        value: '1,200,000',
        subMetric: 'Est. Footfall: 8.5%',
        badgeValue: 'Est.',
        badgeVariant: 'secondary' as const,
      },
      {
        id: 'stores',
        label: 'Target Stores',
        value: '220',
        subMetric: 'Coverage: 57%',
        badgeValue: 'Planned',
        badgeVariant: 'secondary' as const,
      },
      {
        id: 'projected-reach',
        label: 'Projected Reach',
        value: '950K',
        subMetric: 'Unique visitors',
        badgeValue: 'Est.',
        badgeVariant: 'secondary' as const,
      },
      {
        id: 'target-roas',
        label: 'Target ROAS',
        value: '250%',
        subMetric: 'Target AOV: €60',
        badgeValue: 'Goal',
        badgeVariant: 'secondary' as const,
      },
    ];

    const dialogMetricsOfflineInstoreInOption: MetricDefinition[] = [
      { key: 'projectedFootfall', label: 'Projected Footfall', value: '8.5%', subMetric: 'Estimated reach', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'targetCoverage', label: 'Target Coverage', value: '57%', subMetric: '220 planned stores', badgeValue: 'Planned', badgeVariant: 'secondary' },
      { key: 'expectedDwellTime', label: 'Expected Dwell Time', value: '3.8 min', subMetric: 'Target engagement', badgeValue: 'Goal', badgeVariant: 'secondary' },
      { key: 'budgetAllocation', label: 'Budget Allocation', value: '€75K', subMetric: 'Initial allocation', badgeValue: 'Approved', badgeVariant: 'info' },
      { key: 'targetAwareness', label: 'Target Awareness', value: '+20%', subMetric: 'Expected lift', badgeValue: 'Goal', badgeVariant: 'secondary' },
      { key: 'cpi', label: 'Cost Per Impression', value: '€0.15', subMetric: 'Target CPI', badgeValue: 'Target', badgeVariant: 'secondary' },
      { key: 'expectedRoi', label: 'Expected ROI', value: '250%', subMetric: 'Target return', badgeValue: 'Goal', badgeVariant: 'secondary' },
      { key: 'timeline', label: 'Timeline', value: '45 days', subMetric: 'To launch', badgeValue: 'Pending', badgeVariant: 'warning' },
      { key: 'approvalStatus', label: 'Approval Status', value: '75%', subMetric: 'Creatives approved', badgeValue: 'In Review', badgeVariant: 'warning' },
    ];

    const ForecastSection = () => (
      <MetricRow
        metrics={performanceMetrics.map(m => ({ ...m, key: m.id }))}
        selectedKeys={performanceMetrics.map(m => m.id)}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        showCharts={true}
        dialogMetrics={dialogMetricsOfflineInstoreInOption}
        onDialogMetricClick={(key) => console.log(`${key} selected`)}
      />
    );

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Offline in-store, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the offline instore workflow. */}
        <EntityControlBar
          level="campaign"
          engine="offline-instore"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Placement',
                        options: [
                          { label: 'End Cap', value: 'End Cap' },
                          { label: 'Shelf Edge', value: 'Shelf Edge' },
                          { label: 'Floor Stand', value: 'Floor Stand' },
                          { label: 'Aisle Header', value: 'Aisle Header' },
                          { label: 'Checkout', value: 'Checkout' },
                        ],
                        selectedValues: placement,
                        onChange: setPlacement,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offline-instore/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="offline-instore" className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="offline-instore" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offline-instore/creative/${row.id}`}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('offline-instore', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const DisplayInOption: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'In review', name: 'Booking 1', placement: 'Above The Fold', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Increase Spend', totalSkuConversions: '856', totalSkuConversionRate: '2.4%', totalSkuUnits: '1,467', totalSkuRevenue: '$31,280', totalSkuRoas: '380%', onlineSkuConversions: '598', onlineSkuUnits: '1,023', onlineSkuRevenue: '$21,840', instoreSkuConversions: '258', instoreSkuUnits: '444', instoreSkuRevenue: '$9,440' },
      { id: 'LI-002', status: 'In review', name: 'Booking 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget', totalSkuConversions: '634', totalSkuConversionRate: '1.9%', totalSkuUnits: '1,156', totalSkuRevenue: '$25,670', totalSkuRoas: '320%', onlineSkuConversions: '443', onlineSkuUnits: '798', onlineSkuRevenue: '$17,340', instoreSkuConversions: '191', instoreSkuUnits: '358', instoreSkuRevenue: '$8,330' },
      { id: 'LI-003', status: 'Ready', name: 'Booking 3', placement: 'Native Feed', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,456', totalSkuConversionRate: '3.8%', totalSkuUnits: '2,543', totalSkuRevenue: '$54,230', totalSkuRoas: '470%', onlineSkuConversions: '1,019', onlineSkuUnits: '1,780', onlineSkuRevenue: '$37,960', instoreSkuConversions: '437', instoreSkuUnits: '763', instoreSkuRevenue: '$16,270' },
      { id: 'LI-004', status: 'In review', name: 'Booking 4', placement: 'Interstitial', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Optimize Budget', totalSkuConversions: '432', totalSkuConversionRate: '1.5%', totalSkuUnits: '798', totalSkuRevenue: '$18,450', totalSkuRoas: '280%', onlineSkuConversions: '302', onlineSkuUnits: '559', onlineSkuRevenue: '$12,920', instoreSkuConversions: '130', instoreSkuUnits: '239', instoreSkuRevenue: '$5,530' },
      { id: 'LI-005', status: 'Ready', name: 'Booking 5', placement: 'Bottom Banner', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,089', totalSkuConversionRate: '3.1%', totalSkuUnits: '1,967', totalSkuRevenue: '$41,780', totalSkuRoas: '410%', onlineSkuConversions: '762', onlineSkuUnits: '1,377', onlineSkuRevenue: '$29,250', instoreSkuConversions: '327', instoreSkuUnits: '590', instoreSkuRevenue: '$12,530' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-09 15:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Display: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-09 15:45:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€0', newValue: '€100,000', description: 'Initial budget allocation for display campaign' },
      { id: 'LOG-003', timestamp: '2024-12-10 08:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added Above The Fold placement for approval' },
      { id: 'LOG-004', timestamp: '2024-12-10 09:30:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Display banner creative uploaded for review' },
      { id: 'LOG-005', timestamp: '2024-12-10 10:15:14', user: 'Mike Johnson', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In review', description: 'Campaign moved to in-option for client review' },
      { id: 'LOG-006', timestamp: '2024-12-10 13:45:58', user: 'Sarah Wilson', action: 'Target Updated', field: 'Targeting', oldValue: 'Desktop only', newValue: 'Multi-device 18-45', description: 'Expanded device and demographic targeting' },
      { id: 'LOG-007', timestamp: '2024-12-10 16:20:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Awaiting creative approval and placement confirmation', description: 'Added client feedback status' },
    ];

    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));

    // Performance metrics for in-option campaign (forecasted)
    const performanceMetrics = [
      {
        id: 'projected-impressions',
        label: 'Projected Impressions',
        value: '5,200,000',
        subMetric: 'Est. Viewability: 65%',
        badgeValue: 'Est.',
        badgeVariant: 'secondary' as const,
      },
      {
        id: 'projected-clicks',
        label: 'Projected Clicks',
        value: '78,000',
        subMetric: 'Est. CTR: 1.5%',
        badgeValue: 'Est.',
        badgeVariant: 'secondary' as const,
      },
      {
        id: 'projected-reach',
        label: 'Projected Reach',
        value: '2.1M',
        subMetric: 'Target frequency: 2.5',
        badgeValue: 'Goal',
        badgeVariant: 'secondary' as const,
      },
      {
        id: 'target-roas',
        label: 'Target ROAS',
        value: '350%',
        subMetric: 'Target CPA: €28',
        badgeValue: 'Goal',
        badgeVariant: 'secondary' as const,
      },
    ];

    const dialogMetricsDisplayInOption: MetricDefinition[] = [
      { key: 'projectedCtr', label: 'Projected CTR', value: '1.5%', subMetric: 'Estimated rate', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'targetViewability', label: 'Target Viewability', value: '65%', subMetric: 'Goal rate', badgeValue: 'Goal', badgeVariant: 'secondary' },
      { key: 'budgetAllocated', label: 'Budget Allocated', value: '$100K', subMetric: 'Initial budget', badgeValue: 'Approved', badgeVariant: 'info' },
      { key: 'targetFrequency', label: 'Target Frequency', value: '2.5x', subMetric: 'Optimal reach', badgeValue: 'Goal', badgeVariant: 'secondary' },
      { key: 'expectedBrandLift', label: 'Expected Brand Lift', value: '+15%', subMetric: 'Awareness goal', badgeValue: 'Target', badgeVariant: 'secondary' },
      { key: 'targetCpa', label: 'Target CPA', value: '$28', subMetric: 'Cost per acquisition', badgeValue: 'Goal', badgeVariant: 'secondary' },
      { key: 'deviceMix', label: 'Device Mix', value: 'Multi-device', subMetric: '18-45 targeting', badgeValue: 'Planned', badgeVariant: 'secondary' },
      { key: 'creativeStatus', label: 'Creative Status', value: '67%', subMetric: 'Assets approved', badgeValue: 'In Review', badgeVariant: 'warning' },
      { key: 'launchTimeline', label: 'Launch Timeline', value: '30 days', subMetric: 'To go-live', badgeValue: 'Pending', badgeVariant: 'warning' },
    ];

    const ForecastSection = () => (
      <MetricRow
        metrics={performanceMetrics.map(m => ({ ...m, key: m.id }))}
        selectedKeys={performanceMetrics.map(m => m.id)}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        showCharts={true}
        dialogMetrics={dialogMetricsDisplayInOption}
        onDialogMetricClick={(key) => console.log(`${key} selected`)}
      />
    );

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Display, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the display workflow. */}
        <EntityControlBar
          level="campaign"
          engine="display"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                    <div className="md:col-span-2">
                      {/* How the campaign buys is part of what it is — the wizard asks it
                          with the name, so it sits here too. */}
                      <BuyingTypePicker value={detailsBuyingType} onChange={setDetailsBuyingType} />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Placement',
                        options: [
                          { label: 'Above The Fold', value: 'Above The Fold' },
                          { label: 'Sidebar', value: 'Sidebar' },
                          { label: 'Native Feed', value: 'Native Feed' },
                          { label: 'Interstitial', value: 'Interstitial' },
                          { label: 'Bottom Banner', value: 'Bottom Banner' },
                        ],
                        selectedValues: placement,
                        onChange: setPlacement,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                      { key: 'totalSkuConversions', header: 'Total SKU conversions' },
                      { key: 'totalSkuConversionRate', header: 'Total SKU conversion rate' },
                      { key: 'totalSkuUnits', header: 'Total SKU units' },
                      { key: 'totalSkuRevenue', header: 'Total SKU Revenue' },
                      { key: 'totalSkuRoas', header: 'Total SKU ROAS' },
                      { key: 'onlineSkuConversions', header: 'Online SKU conversions' },
                      { key: 'onlineSkuUnits', header: 'Online SKU units' },
                      { key: 'onlineSkuRevenue', header: 'Online SKU Revenue' },
                      { key: 'instoreSkuConversions', header: 'In-store SKU conversions' },
                      { key: 'instoreSkuUnits', header: 'In-store SKU units' },
                      { key: 'instoreSkuRevenue', header: 'In-store SKU Revenue' },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to booking detail: ${row.name} (${row.id})`)}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="display" className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="display" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to log detail: ${row.action} (${row.id})`)}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('display', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const SponsoredProductsInOption: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [bookingPosition, setBookingPosition] = useState<string[]>([]);
    // The bookings under this campaign: one per position, each with its own
    // keywords, products and bids — the campaign itself only groups them.
    const spBookingData = [
      { id: 'LI-101', status: 'Live',      name: 'Top of Search · Summer Launch', position: 'Top of search', start: '2024-08-01', end: '2024-08-30', aiRecommendation: 'Increase Spend',  keywords: 124, products: 18, dailyBudget: '€50', impressions: '342,156', clicks: '8,923', avgCPC: '€0.38', ctr: '2.6%', conversions: '412', sales: '€4,234', spent: '€3,391', roas: '125%' },
      { id: 'LI-102', status: 'Live',      name: 'In-grid · Summer Launch',       position: 'In-grid',       start: '2024-08-01', end: '2024-08-30', aiRecommendation: 'Optimize Budget', keywords: 86,  products: 18, dailyBudget: '€35', impressions: '187,432', clicks: '4,567', avgCPC: '€0.42', ctr: '2.4%', conversions: '198', sales: '€2,156', spent: '€1,918', roas: '112%' },
      { id: 'LI-103', status: 'In review', name: 'Category page · Beer',          position: 'Category page', start: '2024-09-01', end: '2024-09-30', aiRecommendation: 'Increase Spend',  keywords: 42,  products: 9,  dailyBudget: '€25', impressions: '—',       clicks: '—',     avgCPC: '—',     ctr: '—',    conversions: '—',   sales: '—',      spent: '—',      roas: '—' },
      { id: 'LI-104', status: 'Paused',    name: 'Product page · Heineken 0.0',   position: 'Product page',  start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget', keywords: 31,  products: 4,  dailyBudget: '€20', impressions: '89,234',  clicks: '1,892', avgCPC: '€0.29', ctr: '2.1%', conversions: '96',  sales: '€1,234', spent: '€549',   roas: '225%' },
    ];
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [retailProduct, setRetailProduct] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Banner', placements: 3 },
      { id: 'CR-002', status: 'Rejected', name: 'Creative 2', format: 'Video', placements: 1 },
      { id: 'CR-003', status: 'Pending', name: 'Creative 3', format: 'Banner', placements: 2 },
    ];
    const productData = [
      { 
        productId: 'P-001', 
        gtin: '1234567890123', 
        image: productImageFor(0), 
        productTitle: 'Premium Coffee Beans 500g', 
        impressions: '-', 
        clicks: '-', 
        addToCart: '-', 
        avgCPC: '-', 
        ctr: '-', 
        atc: '-', 
        conversion: '-', 
        sales: '-', 
        budget: '€500', 
        spent: '€0', 
        budgetLeft: '€500', 
        roas: '-', 
        extROAS: '-', 
        iROAS: '-', 
        startTime: '2024-06-01', 
        endTime: '2024-06-30',
        searchVolume: 'High',
        competitive: 'Medium'
      },
      { 
        productId: 'P-002', 
        gtin: '2345678901234', 
        image: productImageFor(1), 
        productTitle: 'Organic Tea Selection Pack', 
        impressions: '-', 
        clicks: '-', 
        addToCart: '-', 
        avgCPC: '-', 
        ctr: '-', 
        atc: '-', 
        conversion: '-', 
        sales: '-', 
        budget: '€750', 
        spent: '€0', 
        budgetLeft: '€750', 
        roas: '-', 
        extROAS: '-', 
        iROAS: '-', 
        startTime: '2024-07-01', 
        endTime: '2024-07-31',
        searchVolume: 'Medium',
        competitive: 'High'
      },
      { 
        productId: 'P-003', 
        gtin: '3456789012345', 
        image: productImageFor(2), 
        productTitle: 'Artisan Chocolate Bar 200g', 
        impressions: '-', 
        clicks: '-', 
        addToCart: '-', 
        avgCPC: '-', 
        ctr: '-', 
        atc: '-', 
        conversion: '-', 
        sales: '-', 
        budget: '€300', 
        spent: '€0', 
        budgetLeft: '€300', 
        roas: '-', 
        extROAS: '-', 
        iROAS: '-', 
        startTime: '2024-08-10', 
        endTime: '2024-09-10',
        searchVolume: 'Low',
        competitive: 'Medium'
      },
    ];
    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Sponsored Products: Premium Coffee', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€500', newValue: '€750', description: 'Budget increased for product promotion' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In review', description: 'Campaign moved to in-option status' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Product Added', field: 'Products', oldValue: '-', newValue: 'P-001', description: 'Added Premium Coffee Beans product' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Product Added', field: 'Products', oldValue: '-', newValue: 'P-002', description: 'Added Organic Tea Selection product' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Targeting Updated', field: 'Search Volume', oldValue: 'Medium', newValue: 'High', description: 'Updated targeting for better reach' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Keywords Updated', field: 'Keywords', oldValue: 'coffee beans', newValue: 'premium coffee beans, organic coffee', description: 'Expanded keyword targeting' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Ready for review', description: 'Added campaign review comment' },
    ];
    
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spLocalBrands.map(b => b.id));

    // Forecast metrics for campaign
    const forecastMetrics = [
      {
        id: 'searchVolume',
        label: 'Search Volume', 
        value: 'High', 
        subMetric: '25K+ monthly searches',
        badgeValue: '▲▲▲',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'competitive', 
        label: 'Competitive', 
        value: 'Medium', 
        subMetric: 'Moderate competition',
        badgeValue: '▲▲',
        badgeVariant: 'warning' as const,
      },
      { 
        id: 'reach', 
        label: 'Reach Forecast', 
        value: '1.8M', 
        subMetric: 'Unique shoppers',
        badgeValue: '+6.2%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'roas', 
        label: 'ROAS Forecast', 
        value: '420%', 
        subMetric: 'Projected return',
        badgeValue: '+8.5%',
        badgeVariant: 'success' as const,
      },
    ];
    
    
    // State for interactive forecast - following the same pattern as SponsoredProductsRunning
    const [selectedForecastMetric, setSelectedForecastMetric] = useState<string | null>('spend');
    const [spendValue, setSpendValue] = useState(41866); // Initial spend value
    const [dragPosition, setDragPosition] = useState(50); // Position as percentage (0-100)
    const [isDragging, setIsDragging] = useState(false);
    
    // Calculate ROAS and Revenue based on spend using inverse relationship
    const calculateMetrics = (spend: number) => {
      // ROAS decreases as spend increases (inverse relationship) - scale values to be more visible
      const maxRoas = 600; // Scale up for visibility
      const minRoas = 100;
      const roasRange = maxRoas - minRoas;
      const spendRatio = (spend - 10000) / 40000; // Normalize spend to 0-1 range (10K-50K)
      const roas = maxRoas - (spendRatio * roasRange); // This will go from 600 down to 100
      
      // Revenue increases, creating a crossing point around middle
      const baseRevenue = 100; // Starting revenue 
      const maxRevenue = 500; // Max revenue
      const revenueRange = maxRevenue - baseRevenue;
      const revenue = baseRevenue + (spendRatio * revenueRange); // This will go from 100 up to 500
      
      return { spend, roas: Math.round(roas), revenue: Math.round(revenue) };
    };
    
    // Current metrics based on drag position
    const currentMetrics = calculateMetrics(spendValue);
    
    // Updated forecast metrics to match the original design and use proper MetricCard
    const updatedForecastMetrics = [
      { 
        id: 'spend', 
        label: 'Spend Forecast', 
        value: `$${currentMetrics.spend.toLocaleString()}`, 
        subMetric: 'Remaining: $39,263',
        badgeValue: '+3.5%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'roas',
        label: 'ROAS Forecast',
        value: `${Math.round(currentMetrics.roas)}%`,
        subMetric: 'Projected return',
        badgeValue: '+3.4%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'revenue',
        label: 'Revenue Forecast',
        value: `$${currentMetrics.revenue.toLocaleString()}`,
        subMetric: 'Total revenue',
        badgeValue: '+4.2%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'competitive',
        label: 'Competitive Forecast',
        value: 'Medium',
        subMetric: 'Avg. competition',
        badgeValue: '+2%',
        badgeVariant: 'success' as const,
      },
    ];
    
    const dialogMetricsSponsoredProductsInOption: MetricDefinition[] = [
      { key: 'ctr', label: 'Click-Through Rate', value: '2.34%', subMetric: 'vs. 2.18% last period', badgeValue: '+7.3%', badgeVariant: 'success' },
      { key: 'conversionRate', label: 'Conversion Rate', value: '4.12%', subMetric: '1,234 conversions', badgeValue: '+12.5%', badgeVariant: 'success' },
      { key: 'cpc', label: 'Cost Per Click', value: '$0.58', subMetric: 'vs. $0.62 target', badgeValue: '-6.5%', badgeVariant: 'success' },
      { key: 'viewability', label: 'Viewability Rate', value: '87.3%', subMetric: 'Above industry avg', badgeValue: '+5.2%', badgeVariant: 'success' },
      { key: 'brandLift', label: 'Brand Lift', value: '+18.2%', subMetric: 'Awareness increase', badgeValue: 'High', badgeVariant: 'info' },
      { key: 'sov', label: 'Share of Voice', value: '34.7%', subMetric: 'In category', badgeValue: '+2.1%', badgeVariant: 'secondary' },
      { key: 'frequency', label: 'Frequency', value: '3.8x', subMetric: 'Avg. per user', badgeValue: 'Optimal', badgeVariant: 'success' },
      { key: 'vcr', label: 'Video Completion Rate', value: '68.9%', subMetric: '15s videos', badgeValue: '+9.4%', badgeVariant: 'success' },
      { key: 'cpa', label: 'Cost Per Acquisition', value: '$24.50', subMetric: 'vs. $30 target', badgeValue: '-18.3%', badgeVariant: 'success' },
    ];

    const ForecastSection = () => (
      <div className="space-y-section">
        <MetricRow
          metrics={updatedForecastMetrics.map(m => ({ ...m, key: m.id }))}
          selectedKeys={updatedForecastMetrics.map(m => m.id)}
          maxVisible={5}
          defaultVariant="default"
          removable={false}
          activeKey={selectedForecastMetric}
          onActiveKeyChange={setSelectedForecastMetric}
          dialogMetrics={dialogMetricsSponsoredProductsInOption}
          onDialogMetricClick={(key) => console.log(`${key} selected`)}
        />

        {/* Interactive Forecast Chart - only show when spend, roas, or revenue is selected */}
        {(selectedForecastMetric === 'spend' || selectedForecastMetric === 'roas' || selectedForecastMetric === 'revenue') && (
          <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedForecastMetric(null)}
                aria-label="Close chart"
                className="absolute top-2 right-2 z-10"
              >
                <X className="w-4 h-4" />
              </Button>
              {/* Generate data for LineChart */}
              <LineChartComponent
                data={(() => {
                  const data = [];
                  for (let spend = 10; spend <= 50; spend += 2) { // 10K to 50K in 2K steps
                    const metrics = calculateMetrics(spend * 1000);
                    data.push({
                      spend: `${spend}K`,
                      spendValue: spend * 1000,
                      roas: metrics.roas,
                      revenue: metrics.revenue,
                    });
                  }
                  return data;
                })()}
                config={{
                  roas: {
                    label: "ROAS",
                    color: "hsl(var(--chart-1))", // Theme chart color 1
                  },
                  revenue: {
                    label: "Revenue",  
                    color: "hsl(var(--chart-2))", // Theme chart color 2
                  },
                }}
                showLegend={true}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-[300px] w-full"
                xAxisDataKey="spend"
                yAxisLabel="Revenue"
                secondaryYAxis={{
                  dataKey: "roas",
                  domain: [0, 700],
                  label: "ROAS"
                }}
              />
              
              {/* Interactive overlay for dragging */}
              <div 
                className="absolute inset-0"
                style={{ 
                  cursor: isDragging ? 'ew-resize' : 'crosshair',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  
                  const container = e.currentTarget;
                  const rect = container.getBoundingClientRect();
                  
                  // Account for chart margins - Recharts typically has margins
                  const chartMarginLeft = rect.width * 0.1; // ~10% left margin
                  const chartMarginRight = rect.width * 0.05; // ~5% right margin  
                  const chartWidth = rect.width - chartMarginLeft - chartMarginRight;
                  
                  const updateSpend = (clientX: number) => {
                    const x = clientX - rect.left - chartMarginLeft;
                    const percentage = Math.max(0, Math.min(100, (x / chartWidth) * 100));
                    const newSpend = 10000 + (percentage / 100) * 40000;
                    setSpendValue(Math.round(newSpend));
                    setDragPosition(percentage);
                  };
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    updateSpend(e.clientX);
                  };
                  
                  const handleMouseUp = () => {
                    setIsDragging(false);
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                  
                  // Set initial position
                  updateSpend(e.clientX);
                }}
              >
                {/* Vertical indicator line */}
                <div 
                  className="absolute top-0 bottom-0 w-px bg-border pointer-events-none"
                  style={{ 
                    left: `${10 + (dragPosition * 0.85)}%`, // Account for chart margins
                    zIndex: 10 
                  }}
                >
                  {/* Spend amount as central element with chevrons */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-neutral-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap">
                    {/* Left chevron */}
                    <ChevronLeft className="w-4 h-4 mr-1 text-primary" />
                    
                    {/* Spend amount */}
                    <span className="font-medium">
                      Spend amount ${(spendValue / 1000).toFixed(0)}K
                    </span>
                    
                    {/* Right chevron */}
                    <ChevronRight className="w-4 h-4 ml-1 text-primary" />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Regular chart for other metrics */}
        {selectedForecastMetric === 'competitive' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                Competitive Analysis by Category
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedForecastMetric(null)}
                aria-label="Close chart"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative bg-white border rounded-lg p-6">
              <div className="space-y-4">
                {/* Competitive analysis table with triangles */}
                <div className="grid grid-cols-1 gap-row">
                {[
                  { category: 'Organic Foods', competition: 'Low', level: 1, color: 'text-green-600' },
                  { category: 'Beverages', competition: 'Medium', level: 2, color: 'text-yellow-600' },
                  { category: 'Snacks & Candy', competition: 'High', level: 3, color: 'text-red-600' },
                  { category: 'Household Items', competition: 'Low', level: 1, color: 'text-green-600' },
                  { category: 'Personal Care', competition: 'Medium', level: 2, color: 'text-yellow-600' },
                  { category: 'Frozen Foods', competition: 'High', level: 3, color: 'text-red-600' },
                ].map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{item.category}</h4>
                      <p className="text-sm text-neutral-500">Competition level: {item.competition}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${item.color}`}>
                      {Array.from({ length: item.level }, (_, i) => (
                        <Triangle key={i} className="w-4 h-4 fill-current" />
                      ))}
                      {Array.from({ length: 3 - item.level }, (_, i) => (
                        <Triangle key={`empty-${i}`} className="w-4 h-4 text-neutral-300" />
                      ))}
                      <span className="ml-2 text-sm font-medium">{item.competition}</span>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Sponsored products, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the sponsored products workflow. */}
        <EntityControlBar
          level="campaign"
          engine="sponsored-products"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>
        
        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                    <div className="md:col-span-2">
                      {/* How the campaign buys is part of what it is — the wizard asks it
                          with the name, so it sits here too. */}
                      <BuyingTypePicker value={detailsBuyingType} onChange={setDetailsBuyingType} />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Bidding (CPC)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                        <Input type="number" placeholder="e.g. 0.50" value={detailsCPC} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsCPC(e.target.value)} className="pl-7" />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Position',
                        options: [
                          { label: 'Top of search', value: 'Top of search' },
                          { label: 'In-grid', value: 'In-grid' },
                          { label: 'Category page', value: 'Category page' },
                          { label: 'Product page', value: 'Product page' },
                        ],
                        selectedValues: bookingPosition,
                        onChange: setBookingPosition,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'position', header: 'Position' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                      { key: 'keywords', header: 'Keywords' },
                      { key: 'products', header: 'Products' },
                      { key: 'dailyBudget', header: 'Daily budget' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversions', header: 'Conversions' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={spBookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const positionMatch = bookingPosition.length === 0 || bookingPosition.includes(row.position);
                      return statusMatch && positionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/sponsored-products/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="sponsored-products" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to log detail: ${row.action} (${row.id})`)}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
            {activeTab === 'products' ? (
              <AddButton>Add product</AddButton>
            ) : activeTab === 'keywords' ? (
              <AddButton>Add keyword</AddButton>
            ) : activeTab === 'categories' ? (
              <AddButton>Add categories</AddButton>
            ) : activeTab === 'other' ? (
              <AddButton>Add other</AddButton>
            ) : activeTab === 'creatives' ? (
              <AddButton>Add creative</AddButton>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const SponsoredProductsRunning: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [selectedMetric, setSelectedMetric] = useState('impressions');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [bookingPosition, setBookingPosition] = useState<string[]>([]);
    // The bookings under this campaign: one per position, each with its own
    // keywords, products and bids — the campaign itself only groups them.
    const spBookingData = [
      { id: 'LI-101', status: 'Live',      name: 'Top of Search · Summer Launch', position: 'Top of search', start: '2024-08-01', end: '2024-08-30', aiRecommendation: 'Increase Spend',  keywords: 124, products: 18, dailyBudget: '€50', impressions: '342,156', clicks: '8,923', avgCPC: '€0.38', ctr: '2.6%', conversions: '412', sales: '€4,234', spent: '€3,391', roas: '125%' },
      { id: 'LI-102', status: 'Live',      name: 'In-grid · Summer Launch',       position: 'In-grid',       start: '2024-08-01', end: '2024-08-30', aiRecommendation: 'Optimize Budget', keywords: 86,  products: 18, dailyBudget: '€35', impressions: '187,432', clicks: '4,567', avgCPC: '€0.42', ctr: '2.4%', conversions: '198', sales: '€2,156', spent: '€1,918', roas: '112%' },
      { id: 'LI-103', status: 'In review', name: 'Category page · Beer',          position: 'Category page', start: '2024-09-01', end: '2024-09-30', aiRecommendation: 'Increase Spend',  keywords: 42,  products: 9,  dailyBudget: '€25', impressions: '—',       clicks: '—',     avgCPC: '—',     ctr: '—',    conversions: '—',   sales: '—',      spent: '—',      roas: '—' },
      { id: 'LI-104', status: 'Paused',    name: 'Product page · Heineken 0.0',   position: 'Product page',  start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget', keywords: 31,  products: 4,  dailyBudget: '€20', impressions: '89,234',  clicks: '1,892', avgCPC: '€0.29', ctr: '2.1%', conversions: '96',  sales: '€1,234', spent: '€549',   roas: '225%' },
    ];
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Banner', placements: 3 },
      { id: 'CR-002', status: 'Approved', name: 'Creative 2', format: 'Video', placements: 1 },
      { id: 'CR-003', status: 'Approved', name: 'Creative 3', format: 'Banner', placements: 2 },
    ];
    const productData = [
      { 
        productId: 'P-001', 
        gtin: '1234567890123', 
        image: productImageFor(0), 
        productTitle: 'Premium Coffee Beans 500g', 
        impressions: '847,592', 
        clicks: '27,123', 
        addToCart: '3,864', 
        avgCPC: '€0.34', 
        ctr: '3.2%', 
        atc: '14.2%', 
        conversion: '2.1%', 
        sales: '€12,847', 
        budget: '€500', 
        spent: '€423', 
        budgetLeft: '€77', 
        roas: '380%', 
        extROAS: '420%', 
        iROAS: '360%', 
        startTime: '2024-06-01', 
        endTime: '2024-06-30',
        searchVolume: 'High',
        competitive: 'Medium'
      },
      { 
        productId: 'P-002', 
        gtin: '2345678901234', 
        image: productImageFor(1), 
        productTitle: 'Organic Tea Selection Pack', 
        impressions: '634,218', 
        clicks: '18,945', 
        addToCart: '2,156', 
        avgCPC: '€0.42', 
        ctr: '2.9%', 
        atc: '11.4%', 
        conversion: '1.8%', 
        sales: '€8,934', 
        budget: '€750', 
        spent: '€612', 
        budgetLeft: '€138', 
        roas: '290%', 
        extROAS: '310%', 
        iROAS: '280%', 
        startTime: '2024-07-01', 
        endTime: '2024-07-31',
        searchVolume: 'Medium',
        competitive: 'High'
      },
      { 
        productId: 'P-003', 
        gtin: '3456789012345', 
        image: productImageFor(2), 
        productTitle: 'Artisan Chocolate Bar 200g', 
        impressions: '234,156', 
        clicks: '8,234', 
        addToCart: '1,245', 
        avgCPC: '€0.28', 
        ctr: '3.5%', 
        atc: '15.1%', 
        conversion: '2.8%', 
        sales: '€4,567', 
        budget: '€300', 
        spent: '€287', 
        budgetLeft: '€13', 
        roas: '420%', 
        extROAS: '460%', 
        iROAS: '410%', 
        startTime: '2024-08-10', 
        endTime: '2024-09-10',
        searchVolume: 'Low',
        competitive: 'Medium'
      },
    ];
    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Sponsored Products: Running Campaign', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€500', newValue: '€750', description: 'Budget increased for active campaign' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'In review', newValue: 'Live', description: 'Campaign activated and running' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Performance Update', field: 'Metrics', oldValue: '-', newValue: 'CTR: 3.5%', description: 'Daily performance metrics update' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'System', action: 'Spend Alert', field: 'Budget', oldValue: '€100 remaining', newValue: '€13 remaining', description: 'Budget alert triggered' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Bid Adjustment', field: 'Bidding', oldValue: '€0.25', newValue: '€0.28', description: 'Increased bid for better positioning' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'ROAS Update', field: 'Performance', oldValue: '380%', newValue: '420%', description: 'Improved return on ad spend' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Campaign Review', field: 'Notes', oldValue: '-', newValue: 'Performing well, continue current strategy', description: 'Weekly campaign review' },
    ];
    
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const ellipsisMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    // Details tab state — mirrors SP wizard booking step 1
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('15000');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('15000');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('500');
    const [detailsCPC, setDetailsCPC] = useState<string>('0.42');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spLocalBrands.map(b => b.id));

    // Performance metrics for running campaign
    const performanceMetrics = [
      {
        id: 'impressions',
        label: 'Impressions',
        value: '2,845,692',
        subMetric: 'CTR: 3.2%',
        badgeValue: '+15%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'clicks', 
        label: 'Clicks', 
        value: '91,062', 
        subMetric: 'CPC: €0.42',
        badgeValue: '+8%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'addToCart', 
        label: 'Add to Cart', 
        value: '12,847', 
        subMetric: 'CVR: 14.1%',
        badgeValue: '+22%',
        badgeVariant: 'success' as const,
      },
      { 
        id: 'sales', 
        label: 'Sales', 
        value: '€127,890', 
        subMetric: 'ROAS: 334%',
        badgeValue: '+18%',
        badgeVariant: 'success' as const,
      },
    ];
    
    // Chart data generation function
    const getChartData = (selectedMetric: string) => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        let value;
        switch (selectedMetric) {
          case 'impressions':
            value = Math.round(280000 + Math.random() * 100000);
            break;
          case 'clicks':
            value = Math.round(8000 + Math.random() * 4000);
            break;
          case 'addToCart':
            value = Math.round(1200 + Math.random() * 600);
            break;
          case 'sales':
            value = Math.round(12000 + Math.random() * 6000);
            break;
          default:
            value = Math.round(1000 + Math.random() * 500);
        }
        
        days.push({ day: dayLabel, value });
      }
      return days;
    };

    const chartData = getChartData(selectedMetric);
    const selectedMetricData = performanceMetrics.find(m => m.id === selectedMetric);
    
    const dialogMetricsSponsoredProductsRunning: MetricDefinition[] = [
      { key: 'ctr', label: 'Click-Through Rate', value: '2.34%', subMetric: 'vs. 2.18% last period', badgeValue: '+7.3%', badgeVariant: 'success' },
      { key: 'conversionRate', label: 'Conversion Rate', value: '4.12%', subMetric: '1,234 conversions', badgeValue: '+12.5%', badgeVariant: 'success' },
      { key: 'cpc', label: 'Cost Per Click', value: '$0.58', subMetric: 'vs. $0.62 target', badgeValue: '-6.5%', badgeVariant: 'success' },
      { key: 'viewability', label: 'Viewability Rate', value: '87.3%', subMetric: 'Above industry avg', badgeValue: '+5.2%', badgeVariant: 'success' },
      { key: 'brandLift', label: 'Brand Lift', value: '+18.2%', subMetric: 'Awareness increase', badgeValue: 'High', badgeVariant: 'info' },
      { key: 'sov', label: 'Share of Voice', value: '34.7%', subMetric: 'In category', badgeValue: '+2.1%', badgeVariant: 'secondary' },
      { key: 'frequency', label: 'Frequency', value: '3.8x', subMetric: 'Avg. per user', badgeValue: 'Optimal', badgeVariant: 'success' },
      { key: 'vcr', label: 'Video Completion Rate', value: '68.9%', subMetric: '15s videos', badgeValue: '+9.4%', badgeVariant: 'success' },
      { key: 'cpa', label: 'Cost Per Acquisition', value: '$24.50', subMetric: 'vs. $30 target', badgeValue: '-18.3%', badgeVariant: 'success' },
    ];

    const ForecastSection = () => (
      <MetricRow
        metrics={getPropositionMetrics('sponsored-products', 'campaign')}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        bleedEdges
      />
    );
    
    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Sponsored products, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the sponsored products workflow. */}
        <EntityControlBar
          level="campaign"
          engine="sponsored-products"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>
        
        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                    <div className="md:col-span-2">
                      {/* How the campaign buys is part of what it is — the wizard asks it
                          with the name, so it sits here too. */}
                      <BuyingTypePicker value={detailsBuyingType} onChange={setDetailsBuyingType} />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Bidding (CPC)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                        <Input type="number" placeholder="e.g. 0.50" value={detailsCPC} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsCPC(e.target.value)} className="pl-7" />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Position',
                        options: [
                          { label: 'Top of search', value: 'Top of search' },
                          { label: 'In-grid', value: 'In-grid' },
                          { label: 'Category page', value: 'Category page' },
                          { label: 'Product page', value: 'Product page' },
                        ],
                        selectedValues: bookingPosition,
                        onChange: setBookingPosition,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'position', header: 'Position' },
                      { key: 'aiRecommendation', header: 'Notifications', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                      { key: 'keywords', header: 'Keywords' },
                      { key: 'products', header: 'Products' },
                      { key: 'dailyBudget', header: 'Daily budget' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversions', header: 'Conversions' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'roas', header: 'ROAS' },
                    ]}
                    data={spBookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const positionMatch = bookingPosition.length === 0 || bookingPosition.includes(row.position);
                      return statusMatch && positionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/sponsored-products/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="sponsored-products" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to log detail: ${row.action} (${row.id})`)}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
            {activeTab === 'products' ? (
              <AddButton>Add product</AddButton>
            ) : activeTab === 'keywords' ? (
              <AddButton>Add keyword</AddButton>
            ) : activeTab === 'categories' ? (
              <AddButton>Add categories</AddButton>
            ) : activeTab === 'other' ? (
              <AddButton>Add other</AddButton>
            ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const OffsiteRunning: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [channel, setChannel] = useState<string[]>([]);
    const [retailProduct, setRetailProduct] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'Live', name: 'Coca-Cola Summer Break', channel: 'Homepage Hero', destination: 'New York Times', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg'], total: 2 }, adSpend: '$12,350', impressions: '1,835,331', clicks: '28,349', viewability: '72.4%', cpc: '$0.44', ctr: '1.54%', cpm: '$9.34', ecpm: '$6.73', onlineSkuRevenue: '$31,234', onlineSkuUnits: '2,118', onlineSkuConversions: '1,276', instoreSkuRevenue: '$22,326', instoreSkuUnits: '1,494', instoreSkuConversions: '902', totalSkuRevenue: '$53,560', totalSkuUnits: '3,612', totalSkuConversions: '2,178' },
      { id: 'LI-002', status: 'Live', name: 'Dove Open Web Boost', channel: 'Category Leaderboard', destination: 'All', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_656b70553646657151435343764372315175694b3941.jpeg', '/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg'], total: 5 }, adSpend: '$15,561', impressions: '2,312,917', clicks: '35,722', viewability: '68.1%', cpc: '$0.44', ctr: '1.54%', cpm: '$9.34', ecpm: '$6.73', onlineSkuRevenue: '$39,355', onlineSkuUnits: '2,669', onlineSkuConversions: '1,608', instoreSkuRevenue: '$28,130', instoreSkuUnits: '1,882', instoreSkuConversions: '1,136', totalSkuRevenue: '$67,485', totalSkuUnits: '4,551', totalSkuConversions: '2,744' },
      { id: 'LI-003', status: 'Live', name: 'Hellmann\'s Recipe Season', channel: 'Product Page Rectangle', destination: 'CNN only', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_58595668654137515274614244637957324d34372d51.jpeg'], total: 1 }, adSpend: '$14,184', impressions: '2,108,394', clicks: '32,561', viewability: '79.3%', cpc: '$0.44', ctr: '1.54%', cpm: '$9.34', ecpm: '$6.73', onlineSkuRevenue: '$35,886', onlineSkuUnits: '2,434', onlineSkuConversions: '1,467', instoreSkuRevenue: '$25,651', instoreSkuUnits: '1,716', instoreSkuConversions: '1,036', totalSkuRevenue: '$61,537', totalSkuUnits: '4,150', totalSkuConversions: '2,503' },
      { id: 'LI-004', status: 'Live', name: 'Ben & Jerry\'s Summer Scoop', channel: 'Search Results Top', destination: 'New York Times', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_656b70553646657151435343764372315175694b3941.jpeg'], total: 3 }, adSpend: '$9,566', impressions: '1,421,287', clicks: '21,953', viewability: '65.8%', cpc: '$0.44', ctr: '1.54%', cpm: '$9.34', ecpm: '$6.73', onlineSkuRevenue: '$24,205', onlineSkuUnits: '1,641', onlineSkuConversions: '989', instoreSkuRevenue: '$17,304', instoreSkuUnits: '1,158', instoreSkuConversions: '699', totalSkuRevenue: '$41,509', totalSkuUnits: '2,799', totalSkuConversions: '1,688' },
      { id: 'LI-005', status: 'Live', name: 'Axe Back to Campus', channel: 'Checkout Sidebar', destination: 'All', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_58595668654137515274614244637957324d34372d51.jpeg', '/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg'], total: 4 }, adSpend: '$14,184', impressions: '2,108,394', clicks: '32,561', viewability: '83.6%', cpc: '$0.44', ctr: '1.54%', cpm: '$9.34', ecpm: '$6.73', onlineSkuRevenue: '$35,886', onlineSkuUnits: '2,434', onlineSkuConversions: '1,467', instoreSkuRevenue: '$25,651', instoreSkuUnits: '1,716', instoreSkuConversions: '1,036', totalSkuRevenue: '$61,537', totalSkuUnits: '4,150', totalSkuConversions: '2,503' },
      { id: 'LI-006', status: 'Live', name: 'Knorr Weeknight Meals', channel: 'Newsletter Half Page', destination: 'CNN only', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_656b70553646657151435343764372315175694b3941.jpeg'], total: 1 }, adSpend: '$8,255', impressions: '1,226,527', clicks: '18,944', viewability: '71.2%', cpc: '$0.44', ctr: '1.54%', cpm: '$9.34', ecpm: '$6.73', onlineSkuRevenue: '$20,896', onlineSkuUnits: '1,417', onlineSkuConversions: '854', instoreSkuRevenue: '$14,935', instoreSkuUnits: '999', instoreSkuConversions: '603', totalSkuRevenue: '$35,831', totalSkuUnits: '2,416', totalSkuConversions: '1,457' },
      { id: 'LI-007', status: 'Live', name: 'Magnum Indulgence Moments', channel: 'Mobile Interstitial', destination: 'New York Times', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg', '/products/AHI_656b70553646657151435343764372315175694b3941.jpeg'], total: 6 }, adSpend: '$12,350', impressions: '1,834,470', clicks: '28,326', viewability: '76.9%', cpc: '$0.44', ctr: '1.54%', cpm: '$9.34', ecpm: '$6.73', onlineSkuRevenue: '$31,177', onlineSkuUnits: '2,110', onlineSkuConversions: '1,273', instoreSkuRevenue: '$22,283', instoreSkuUnits: '1,491', instoreSkuConversions: '900', totalSkuRevenue: '$53,460', totalSkuUnits: '3,601', totalSkuConversions: '2,173' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Offsite: Summer Launch', description: 'Initial offsite campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '$50,000', newValue: '$120,000', description: 'Budget increased for multi-channel offsite push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'Live', description: 'Offsite campaign is now live' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added 3rd Party Display booking' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-002', description: 'Added Socials campaign booking' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Channel Added', field: 'Channels', oldValue: '-', newValue: 'Connected TV', description: 'Added CTV channel to offsite mix' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Target Updated', field: 'Targeting', oldValue: 'Desktop 18-35', newValue: 'Multi-device 18-54', description: 'Expanded targeting for offsite channels' },
      { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Offsite performance exceeds expectations across all channels', description: 'Added performance comment' },
    ];

    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));

    // Performance metrics for running offsite campaign
    const performanceMetrics: MetricDefinition[] = [
      { key: 'adSpend', label: 'Ad Spend', value: '$86,450', subMetric: 'Budget: $120,000', badgeValue: '+15%', badgeVariant: 'success' },
      { key: 'impressions', label: 'Impressions', value: '12,847,320', subMetric: 'Unique: 5.8M', badgeValue: '+18%', badgeVariant: 'success' },
      { key: 'clicks', label: 'Clicks + Add to Carts', value: '198,456', subMetric: 'Add to Carts: 24,807', badgeValue: '+12%', badgeVariant: 'success' },
      { key: 'cpc', label: 'CPC', value: '$0.44', subMetric: 'Ad Spend / Clicks', badgeValue: '-8%', badgeVariant: 'success' },
      { key: 'ctr', label: 'CTR', value: '1.54%', subMetric: 'Clicks / Impressions', badgeValue: '+20%', badgeVariant: 'success' },
      { key: 'cpm', label: 'CPM', value: '$9.34', subMetric: 'Budget / Impressions × 1,000', badgeValue: '-6%', badgeVariant: 'success' },
      { key: 'ecpm', label: 'eCPM', value: '$6.73', subMetric: 'Spend / Impressions × 1,000', badgeValue: '-4%', badgeVariant: 'success' },
      { key: 'onlineSkuRevenue', label: 'Online SKU Revenue', value: '$218,640', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+22%', badgeVariant: 'success' },
      { key: 'onlineSkuUnits', label: 'Online SKU Units', value: '14,823', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+18%', badgeVariant: 'success' },
      { key: 'onlineSkuConversions', label: 'Online SKU Conversions', value: '8,934', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+16%', badgeVariant: 'success' },
      { key: 'instoreSkuRevenue', label: 'In-store SKU Revenue', value: '$156,280', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+19%', badgeVariant: 'success' },
      { key: 'instoreSkuUnits', label: 'In-store SKU Units', value: '10,456', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+14%', badgeVariant: 'success' },
      { key: 'instoreSkuConversions', label: 'In-store SKU Conversions', value: '6,312', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+11%', badgeVariant: 'success' },
      { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '$374,920', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+21%', badgeVariant: 'success' },
      { key: 'totalSkuUnits', label: 'Total SKU Units', value: '25,279', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+16%', badgeVariant: 'success' },
      { key: 'totalSkuConversions', label: 'Total SKU Conversions', value: '15,246', subMetric: `${conversionWindow}-day attribution`, badgeValue: '+14%', badgeVariant: 'success' },
    ];

    // Unified per-proposition cards — same labels as
    // /campaigns/offsite, values scoped to this campaign.
    const ForecastSection = () => (
      <MetricRow
        metrics={getPropositionMetrics('offsite', 'campaign')}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        bleedEdges
      />
    );

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Offsite, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the offsite workflow. */}
        <EntityControlBar
          level="campaign"
          engine="offsite"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Channel',
                        options: [
                          { label: 'Homepage Hero', value: 'Homepage Hero' },
                          { label: 'Category Leaderboard', value: 'Category Leaderboard' },
                          { label: 'Product Page Rectangle', value: 'Product Page Rectangle' },
                          { label: 'Search Results Top', value: 'Search Results Top' },
                          { label: 'Checkout Sidebar', value: 'Checkout Sidebar' },
                          { label: 'Newsletter Half Page', value: 'Newsletter Half Page' },
                          { label: 'Mobile Interstitial', value: 'Mobile Interstitial' },
                        ],
                        selectedValues: channel,
                        onChange: setChannel,
                      },
                      {
                        name: 'Retail Product',
                        options: [
                          { label: 'Coca-Cola Zero - 1 liter', value: '606983' },
                          { label: 'Pepsi Max - 1.5 liter', value: '607124' },
                          { label: 'Red Bull Original - 250ml', value: '608456' },
                          { label: 'Heineken Lager - 6x330ml', value: '609782' },
                          { label: 'Nutella Hazelnut Spread - 750g', value: '614038' },
                          { label: "Ben & Jerry's Cookie Dough - 465ml", value: '614649' },
                        ],
                        selectedValues: retailProduct,
                        onChange: setRetailProduct,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                      { key: 'retailMedia', header: 'Retail products', render: row => {
                        const maxShow = 3;
                        const shown = row.retailMedia.images.slice(0, maxShow);
                        const remaining = row.retailMedia.total - shown.length;
                        return (
                          <div className="flex items-center gap-1">
                            {shown.map((img: string, i: number) => (
                              <img key={i} src={img} alt="" className="w-7 h-7 rounded object-cover" />
                            ))}
                            {remaining > 0 && <span className="text-xs text-muted-foreground ml-0.5">+{remaining}</span>}
                          </div>
                        );
                      }},
                      { key: 'destination', header: 'Destinations' },
                      { key: 'adSpend', header: 'Ad Spend' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'viewability', header: 'Viewability' },
                      { key: 'cpc', header: 'CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'cpm', header: 'CPM' },
                      { key: 'ecpm', header: 'eCPM' },
                      { key: 'onlineSkuRevenue', header: 'Online SKU Revenue' },
                      { key: 'onlineSkuUnits', header: 'Online SKU Units' },
                      { key: 'onlineSkuConversions', header: 'Online SKU Conversions' },
                      { key: 'instoreSkuRevenue', header: 'In-store SKU Revenue' },
                      { key: 'instoreSkuUnits', header: 'In-store SKU Units' },
                      { key: 'instoreSkuConversions', header: 'In-store SKU Conversions' },
                      { key: 'totalSkuRevenue', header: 'Total SKU Revenue' },
                      { key: 'totalSkuUnits', header: 'Total SKU Units' },
                      { key: 'totalSkuConversions', header: 'Total SKU Conversions' },
                      { key: 'skuTotalConvRate', header: 'SKU Total Conversion Rate', render: row => convRateOf(row.totalSkuConversions, row.clicks) },
                      { key: 'skuInstoreRoas', header: 'SKU In-store ROAS', render: row => roasOf(row.instoreSkuRevenue, row.adSpend) },
                      { key: 'skuInstoreConvRate', header: 'SKU In-store Conversion Rate', render: row => convRateOf(row.instoreSkuConversions, row.clicks) },
                      { key: 'skuOnlineRoas', header: 'SKU Online ROAS', render: row => roasOf(row.onlineSkuRevenue, row.adSpend) },
                      { key: 'skuOnlineConvRate', header: 'SKU Online Conversion Rate', render: row => convRateOf(row.onlineSkuConversions, row.clicks) },
                      { key: 'brandTotalConvRate', header: 'Brand Total Conversion Rate', render: row => convRateOf(parseMetric(row.totalSkuConversions) * BRAND_HALO, row.clicks) },
                      { key: 'brandInstoreRoas', header: 'Brand In-store ROAS', render: row => roasOf(parseMetric(row.instoreSkuRevenue) * BRAND_HALO, row.adSpend) },
                      { key: 'brandInstoreConvRate', header: 'Brand In-store Conversion Rate', render: row => convRateOf(parseMetric(row.instoreSkuConversions) * BRAND_HALO, row.clicks) },
                      { key: 'brandOnlineRoas', header: 'Brand Online ROAS', render: row => roasOf(parseMetric(row.onlineSkuRevenue) * BRAND_HALO, row.adSpend) },
                      { key: 'brandOnlineConvRate', header: 'Brand Online Conversion Rate', render: row => convRateOf(parseMetric(row.onlineSkuConversions) * BRAND_HALO, row.clicks) },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const channelMatch = channel.length === 0 || channel.includes(row.channel);
                      return statusMatch && channelMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offsite/booking/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="offsite" showPerformance className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="offsite" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Channel Added', value: 'Channel Added' },
                          { label: 'Target Updated', value: 'Target Updated' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offsite/log/${row.id}`}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('offsite', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

export const OffsiteInOption: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingStatus, setBookingStatus] = useState<string[]>([]);
    const [channel, setChannel] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [retailProduct, setRetailProduct] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const bookingData = [
      { id: 'LI-001', status: 'In review', name: 'Homepage Hero Banner', channel: 'Homepage Hero', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg'], total: 2 }, adSpend: '-', impressions: '-', clicks: '-', cpc: '-', ctr: '-', cpm: '-', ecpm: '-', onlineSkuRevenue: '-', onlineSkuUnits: '-', onlineSkuConversions: '-', instoreSkuRevenue: '-', instoreSkuUnits: '-', instoreSkuConversions: '-', totalSkuRevenue: '-', totalSkuUnits: '-', totalSkuConversions: '-' },
      { id: 'LI-002', status: 'In review', name: 'Category Leaderboard', channel: 'Category Leaderboard', start: '2024-07-01', end: '2024-07-31', retailMedia: { images: ['/products/AHI_656b70553646657151435343764372315175694b3941.jpeg', '/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg'], total: 5 }, adSpend: '-', impressions: '-', clicks: '-', cpc: '-', ctr: '-', cpm: '-', ecpm: '-', onlineSkuRevenue: '-', onlineSkuUnits: '-', onlineSkuConversions: '-', instoreSkuRevenue: '-', instoreSkuUnits: '-', instoreSkuConversions: '-', totalSkuRevenue: '-', totalSkuUnits: '-', totalSkuConversions: '-' },
      { id: 'LI-003', status: 'Ready', name: 'Product Page Rectangle', channel: 'Product Page Rectangle', start: '2024-08-10', end: '2024-09-10', retailMedia: { images: ['/products/AHI_58595668654137515274614244637957324d34372d51.jpeg'], total: 1 }, adSpend: '-', impressions: '-', clicks: '-', cpc: '-', ctr: '-', cpm: '-', ecpm: '-', onlineSkuRevenue: '-', onlineSkuUnits: '-', onlineSkuConversions: '-', instoreSkuRevenue: '-', instoreSkuUnits: '-', instoreSkuConversions: '-', totalSkuRevenue: '-', totalSkuUnits: '-', totalSkuConversions: '-' },
      { id: 'LI-004', status: 'In review', name: 'Search Results Top Banner', channel: 'Search Results Top', start: '2024-11-01', end: '2024-11-30', retailMedia: { images: ['/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_656b70553646657151435343764372315175694b3941.jpeg'], total: 3 }, adSpend: '-', impressions: '-', clicks: '-', cpc: '-', ctr: '-', cpm: '-', ecpm: '-', onlineSkuRevenue: '-', onlineSkuUnits: '-', onlineSkuConversions: '-', instoreSkuRevenue: '-', instoreSkuUnits: '-', instoreSkuConversions: '-', totalSkuRevenue: '-', totalSkuUnits: '-', totalSkuConversions: '-' },
      { id: 'LI-005', status: 'Ready', name: 'Checkout Sidebar', channel: 'Checkout Sidebar', start: '2024-12-01', end: '2024-12-31', retailMedia: { images: ['/products/AHI_58595668654137515274614244637957324d34372d51.jpeg', '/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg'], total: 4 }, adSpend: '-', impressions: '-', clicks: '-', cpc: '-', ctr: '-', cpm: '-', ecpm: '-', onlineSkuRevenue: '-', onlineSkuUnits: '-', onlineSkuConversions: '-', instoreSkuRevenue: '-', instoreSkuUnits: '-', instoreSkuConversions: '-', totalSkuRevenue: '-', totalSkuUnits: '-', totalSkuConversions: '-' },
      { id: 'LI-006', status: 'In review', name: 'Newsletter Half Page', channel: 'Newsletter Half Page', start: '2024-06-01', end: '2024-06-30', retailMedia: { images: ['/products/AHI_656b70553646657151435343764372315175694b3941.jpeg'], total: 1 }, adSpend: '-', impressions: '-', clicks: '-', cpc: '-', ctr: '-', cpm: '-', ecpm: '-', onlineSkuRevenue: '-', onlineSkuUnits: '-', onlineSkuConversions: '-', instoreSkuRevenue: '-', instoreSkuUnits: '-', instoreSkuConversions: '-', totalSkuRevenue: '-', totalSkuUnits: '-', totalSkuConversions: '-' },
      { id: 'LI-007', status: 'Ready', name: 'Mobile Interstitial', channel: 'Mobile Interstitial', start: '2024-07-01', end: '2024-07-31', retailMedia: { images: ['/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg', '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg', '/products/AHI_656b70553646657151435343764372315175694b3941.jpeg'], total: 6 }, adSpend: '-', impressions: '-', clicks: '-', cpc: '-', ctr: '-', cpm: '-', ecpm: '-', onlineSkuRevenue: '-', onlineSkuUnits: '-', onlineSkuConversions: '-', instoreSkuRevenue: '-', instoreSkuUnits: '-', instoreSkuConversions: '-', totalSkuRevenue: '-', totalSkuUnits: '-', totalSkuConversions: '-' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-09 15:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Offsite: Summer Launch', description: 'Initial offsite campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-09 15:45:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '$0', newValue: '$100,000', description: 'Initial budget allocation for offsite channels' },
      { id: 'LOG-003', timestamp: '2024-12-10 08:15:33', user: 'Sarah Wilson', action: 'Booking Added', field: 'Bookings', oldValue: '-', newValue: 'LI-001', description: 'Added 3rd Party Display booking for approval' },
      { id: 'LOG-004', timestamp: '2024-12-10 09:30:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Social banner pack uploaded for review' },
      { id: 'LOG-005', timestamp: '2024-12-10 10:15:14', user: 'Mike Johnson', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In review', description: 'Campaign moved to in-option for client review' },
      { id: 'LOG-006', timestamp: '2024-12-10 13:45:58', user: 'Sarah Wilson', action: 'Channel Added', field: 'Channels', oldValue: '3rd Party Display', newValue: '+ Socials, Connected TV', description: 'Expanded offsite channel mix' },
      { id: 'LOG-007', timestamp: '2024-12-10 16:20:12', user: 'John Smith', action: 'Comment Added', field: 'Notes', oldValue: '-', newValue: 'Awaiting creative approval for all offsite channels', description: 'Added client feedback status' },
    ];

    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Pending': return 'warning';
        default: return 'outline';
      }
    };
    const bookingStatusVariant = (status: string) => {
      switch (status) {
        case 'In review': return 'outline';
        case 'Live': return 'success';
        case 'Paused': return 'warning';
        case 'Stopped': return 'destructive';
        case 'Ready': return 'info';
        default: return 'outline';
      }
    };
    const spCampaignOptions = spBookingCampaignOptions;
    const spLocalBrands = spBookingLocalBrands;
    const [detailsCampaign, setDetailsCampaign] = useState<string>('knorr-summer-sale');
    const [detailsBookingName, setDetailsBookingName] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-06-30'));
    const [detailsTotalBudget, setDetailsTotalBudget] = useState<string>('');
    const [detailsMediaPlan, setDetailsMediaPlan] = useState<string>('C-001');
    const [detailsBuyingType, setDetailsBuyingType] = useState<'auction' | 'guaranteed'>('auction');
    const [detailsRetailProducts, setDetailsRetailProducts] = useState<string[]>([]);
    const [detailsObjectiveKpi, setDetailsObjectiveKpi] = React.useState<ObjectiveKpiValue>({ objective: null, kpis: [] });
    const campaignUnread = useUnreadCount('campaign', undefined, ['recommendation']);
    const routeCampaign = useRouteCampaign();
    const [detailsBudget, setDetailsBudget] = useState<string>('');
    const [detailsDailyBudget, setDetailsDailyBudget] = useState<string>('');
    const [detailsCPC, setDetailsCPC] = useState<string>('');
    const [detailsSendBudgetNotification, setDetailsSendBudgetNotification] = useState(false);
    const [detailsSelectedBrands, setDetailsSelectedBrands] = useState<string[]>(spBookingLocalBrands.map(b => b.id));

    // Performance metrics for in-option offsite campaign (forecasted)
    const performanceMetrics: MetricDefinition[] = [
      { key: 'adSpend', label: 'Ad Spend', value: '$0', subMetric: 'Budget: $100,000', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'impressions', label: 'Impressions', value: '8,500,000', subMetric: 'Projected', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'clicks', label: 'Clicks + Add to Carts', value: '127,500', subMetric: 'Est. Add to Carts: 15,938', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'cpc', label: 'CPC', value: '$0.78', subMetric: 'Ad Spend / Clicks', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'ctr', label: 'CTR', value: '1.50%', subMetric: 'Clicks / Impressions', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'cpm', label: 'CPM', value: '$11.76', subMetric: 'Budget / Impressions × 1,000', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'ecpm', label: 'eCPM', value: '-', subMetric: 'Spend / Impressions × 1,000', badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'onlineSkuRevenue', label: 'Online SKU Revenue', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'onlineSkuUnits', label: 'Online SKU Units', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'onlineSkuConversions', label: 'Online SKU Conversions', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'instoreSkuRevenue', label: 'In-store SKU Revenue', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'instoreSkuUnits', label: 'In-store SKU Units', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'instoreSkuConversions', label: 'In-store SKU Conversions', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'totalSkuUnits', label: 'Total SKU Units', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
      { key: 'totalSkuConversions', label: 'Total SKU Conversions', value: '-', subMetric: `${conversionWindow}-day attribution`, badgeValue: 'Est.', badgeVariant: 'secondary' },
    ];

    const ForecastSection = () => (
      <MetricRow
        metrics={performanceMetrics}
        selectedKeys={['adSpend', 'impressions', 'ctr', 'totalSkuRevenue']}
        maxVisible={5}
        defaultVariant="default"
        removable={true}
        showCharts={true}
      />
    );

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Offsite, Summer Launch',
          titleIcon: <HierarchyBadge level="campaign" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        {/* The control panel: what this campaign may spend and when, how it is
            doing, the run controls, and where it stands in the offsite workflow. */}
        <EntityControlBar
          level="campaign"
          engine="offsite"
          entityId={routeCampaign?.id ?? 'demo-campaign'}
          name={routeCampaign?.name}
          status={routeCampaign?.status ?? 'running'}
          className="mb-section"
        />
        <div className="mb-section">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
                <FormSection bordered title="Setup" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Media plan</label>
                      <SearchableSelect
                        options={mediaPlanOptions}
                        value={detailsMediaPlan}
                        onChange={setDetailsMediaPlan}
                        placeholder="Select media plan"
                        searchPlaceholder="Search media plans..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection bordered title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <SearchableSelect
                        options={advertiserOptions}
                        value={detailsCampaign}
                        onChange={setDetailsCampaign}
                        placeholder="Select advertiser"
                        searchPlaceholder="Search advertisers..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <SearchableSelect
                        options={brandOptions}
                        value={detailsBookingName}
                        onChange={setDetailsBookingName}
                        placeholder="Select brand"
                        searchPlaceholder="Search brands..."
                      />
                    </div>
                                      <div className="md:col-span-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={detailsRetailProductOptions}
                        value={detailsRetailProducts}
                        onChange={setDetailsRetailProducts}
                        maxVisibleSelected={5}
                      />
                    </div>
</div>
                </FormSection>
                <FormSection bordered title="Run time & budget" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-row">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Run time</label>
                    {/* One field for the whole span, with the retailer's
                        commercial moments in the calendar — same picker the
                        media plan uses. */}
                    <DateRangePicker
                      dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                      onDateRangeChange={(range) => { setStartDate(range?.from); setEndDate(range?.to); }}
                      placeholder="Select start and end date"
                      showPresets
                      showWeekNumbers
                      events={retailMoments}
                      presets={futureDateRangePresets}
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input
                        value={detailsBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailsBudget(e.target.value)}
                        placeholder="Enter budget"
                        type="number"
                        min="0"
                      />
                      {(() => {
                        const planBudget = mediaPlanBudgets[detailsMediaPlan];
                        const entered = parseFloat(detailsBudget);
                        if (!planBudget || !entered || entered <= planBudget) return null;
                        const planLabel = mediaPlanOptions.find(o => o.value === detailsMediaPlan)?.label ?? detailsMediaPlan;
                        return (
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-warning-300 bg-warning-50 p-3 text-xs text-warning-900">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-warning-600" />
                            <div className="flex-1">
                              Budget exceeds the <span className="font-medium">{planLabel}</span> media-plan budget of ${planBudget.toLocaleString()}.{' '}
                              <a href={mediaPlanHref(detailsMediaPlan)} className="font-medium underline underline-offset-2 hover:text-warning-700">
                                Open media plan
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
              </form>
            ) : null
          }
          tabs={tabFirst([
            {
              label: 'Campaign details',
              value: 'details',
              content: null,
            },
            {
              // Everything to do or know for this campaign: derived to-dos
              // plus its recommendations and insights.
              label: 'Recommendations',
              value: 'actions',
              badgeCount: campaignUnread,
              content: <InboxPanel scope="campaign" kinds={['recommendation']} className="mt-6" />,
            },
            {
              label: 'Bookings',
              value: 'bookings',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In review', value: 'In review' },
                          { label: 'Live', value: 'Live' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: bookingStatus,
                        onChange: setBookingStatus,
                      },
                      {
                        name: 'Channel',
                        options: [
                          { label: 'Homepage Hero', value: 'Homepage Hero' },
                          { label: 'Category Leaderboard', value: 'Category Leaderboard' },
                          { label: 'Product Page Rectangle', value: 'Product Page Rectangle' },
                          { label: 'Search Results Top', value: 'Search Results Top' },
                          { label: 'Checkout Sidebar', value: 'Checkout Sidebar' },
                          { label: 'Newsletter Half Page', value: 'Newsletter Half Page' },
                          { label: 'Mobile Interstitial', value: 'Mobile Interstitial' },
                        ],
                        selectedValues: channel,
                        onChange: setChannel,
                      },
                      {
                        name: 'Retail Product',
                        options: [
                          { label: 'Coca-Cola Zero - 1 liter', value: '606983' },
                          { label: 'Pepsi Max - 1.5 liter', value: '607124' },
                          { label: 'Red Bull Original - 250ml', value: '608456' },
                          { label: 'Heineken Lager - 6x330ml', value: '609782' },
                          { label: 'Nutella Hazelnut Spread - 750g', value: '614038' },
                          { label: "Ben & Jerry's Cookie Dough - 465ml", value: '614649' },
                        ],
                        selectedValues: retailProduct,
                        onChange: setRetailProduct,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search bookings..."
                  />
                  <Table
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'id', header: 'ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={bookingStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'runtime', header: 'Run time', render: row => `${new Date(row.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(row.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` },
                      { key: 'retailMedia', header: 'Retail products', render: row => {
                        const maxShow = 3;
                        const shown = row.retailMedia.images.slice(0, maxShow);
                        const remaining = row.retailMedia.total - shown.length;
                        return (
                          <div className="flex items-center gap-1">
                            {shown.map((img: string, i: number) => (
                              <img key={i} src={img} alt="" className="w-7 h-7 rounded object-cover" />
                            ))}
                            {remaining > 0 && <span className="text-xs text-muted-foreground ml-0.5">+{remaining}</span>}
                          </div>
                        );
                      }},
                      { key: 'channel', header: 'Placements' },
                      { key: 'adSpend', header: 'Ad Spend' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks + Add to Carts' },
                      { key: 'cpc', header: 'CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'cpm', header: 'CPM' },
                      { key: 'ecpm', header: 'eCPM' },
                      { key: 'onlineSkuRevenue', header: 'Online SKU Revenue' },
                      { key: 'onlineSkuUnits', header: 'Online SKU Units' },
                      { key: 'onlineSkuConversions', header: 'Online SKU Conversions' },
                      { key: 'instoreSkuRevenue', header: 'In-store SKU Revenue' },
                      { key: 'instoreSkuUnits', header: 'In-store SKU Units' },
                      { key: 'instoreSkuConversions', header: 'In-store SKU Conversions' },
                      { key: 'totalSkuRevenue', header: 'Total SKU Revenue' },
                      { key: 'totalSkuUnits', header: 'Total SKU Units' },
                      { key: 'totalSkuConversions', header: 'Total SKU Conversions' },
                      { key: 'skuTotalConvRate', header: 'SKU Total Conversion Rate', render: row => convRateOf(row.totalSkuConversions, row.clicks) },
                      { key: 'skuInstoreRoas', header: 'SKU In-store ROAS', render: row => roasOf(row.instoreSkuRevenue, row.adSpend) },
                      { key: 'skuInstoreConvRate', header: 'SKU In-store Conversion Rate', render: row => convRateOf(row.instoreSkuConversions, row.clicks) },
                      { key: 'skuOnlineRoas', header: 'SKU Online ROAS', render: row => roasOf(row.onlineSkuRevenue, row.adSpend) },
                      { key: 'skuOnlineConvRate', header: 'SKU Online Conversion Rate', render: row => convRateOf(row.onlineSkuConversions, row.clicks) },
                      { key: 'brandTotalConvRate', header: 'Brand Total Conversion Rate', render: row => convRateOf(parseMetric(row.totalSkuConversions) * BRAND_HALO, row.clicks) },
                      { key: 'brandInstoreRoas', header: 'Brand In-store ROAS', render: row => roasOf(parseMetric(row.instoreSkuRevenue) * BRAND_HALO, row.adSpend) },
                      { key: 'brandInstoreConvRate', header: 'Brand In-store Conversion Rate', render: row => convRateOf(parseMetric(row.instoreSkuConversions) * BRAND_HALO, row.clicks) },
                      { key: 'brandOnlineRoas', header: 'Brand Online ROAS', render: row => roasOf(parseMetric(row.onlineSkuRevenue) * BRAND_HALO, row.adSpend) },
                      { key: 'brandOnlineConvRate', header: 'Brand Online Conversion Rate', render: row => convRateOf(parseMetric(row.onlineSkuConversions) * BRAND_HALO, row.clicks) },
                    ]}
                    data={bookingData.filter(row => {
                      const statusMatch = bookingStatus.length === 0 || bookingStatus.includes(row.status);
                      const channelMatch = channel.length === 0 || channel.includes(row.channel);
                      return statusMatch && channelMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to booking detail: ${row.name} (${row.id})`)}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <CampaignCreativesPanel engine="offsite" className="mt-6" />
              ),
            },
            {
              label: 'Insights',
              value: 'insights',
              content: <InsightsTab engineType="offsite" scope="campaign" />,
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Booking Added', value: 'Booking Added' },
                          { label: 'Creative Uploaded', value: 'Creative Uploaded' },
                          { label: 'Channel Added', value: 'Channel Added' },
                          { label: 'Comment Added', value: 'Comment Added' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: row => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: row => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to log detail: ${row.action} (${row.id})`)}
                  />
                </div>
              ),
            },
          ], 'bookings')}
          action={
            <div className="flex items-center gap-2">
              {activeTab === 'bookings' ? (
                <AddButton onClick={() => addBooking('offsite', routeCampaign)}>Add booking</AddButton>
              ) : activeTab === 'creatives' ? (
                <AddButton>Add creative</AddButton>
              ) : activeTab === 'logs' ? (
                <Button>Export logs</Button>
              ) : null}
            </div>
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};