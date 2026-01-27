import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { BreadcrumbProvider } from '@/contexts/breadcrumb-context';
import { AppLayout } from '../app-layout';
import { CardWithTabs } from '../../ui/card';
import { Card, CardHeader, CardContent, MetricCard } from '@/components/ui/card';
import { MetricRow } from '@/components/ui/metric-row';
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
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight, X, Triangle } from 'lucide-react';
import { FormSection } from '../../ui/form-section';
import { Input } from '../../ui/input';
import { DateRangePicker, DatePicker } from '../../ui/date-picker';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import React, { useState } from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Campaign Details',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Campaign Details Page Template

The Campaign Details page template provides a comprehensive view of individual campaigns with tabbed navigation for different data views. It combines campaign information display with detailed line item and creative management.

## Features

- **Tabbed Interface**: CardWithTabs component for organized content sections
- **Campaign Information**: Detailed campaign metadata and settings
- **Line Items Management**: Table view with filtering and actions
- **Creatives Management**: Table view with filtering and actions
- **Advanced Filtering**: FilterBar for both line items and creatives
- **Action Menus**: Dropdown menus for row-level actions
- **Responsive Design**: Adapts to different screen sizes

## Tab Structure

### Campaign Information Tab
- **Campaign Details**: Name, advertiser, dates, budget
- **Settings**: Campaign configuration options
- **Status**: Current campaign status and approval state

### Line Items Tab
- **Data Table**: List of all line items in the campaign
- **Filtering**: Filter by status, type, and other criteria
- **Actions**: Edit, duplicate, delete line items
- **Search**: Real-time search across line item names
- **Status Badges**: Visual indicators for line item status

### Creatives Tab
- **Data Table**: List of all creatives in the campaign
- **Filtering**: Filter by format, status, and approval state
- **Actions**: Edit, duplicate, delete creatives
- **Search**: Real-time search across creative names
- **Status Badges**: Visual indicators for creative status

## Data Management

### Line Items
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

### Line Item Actions
- **Edit**: Navigate to line item detail page
- **Duplicate**: Create copy of line item
- **Delete**: Remove line item from campaign
- **Pause/Resume**: Toggle line item status
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

### Line Items Filters
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
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
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
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Banner', placements: 3 },
      { id: 'CR-002', status: 'Rejected', name: 'Creative 2', format: 'Video', placements: 1 },
      { id: 'CR-003', status: 'Pending', name: 'Creative 3', format: 'Banner', placements: 2 },
    ];
    const lineItemData = [
      { id: 'LI-001', status: 'In-option', name: 'Line-item 1', placement: 'Homepage', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-002', status: 'In-option', name: 'Line-item 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Increase Spend' },
      { id: 'LI-003', status: 'In-option', name: 'Line-item 3', placement: 'Footer', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-004', status: 'In-option', name: 'Line-item 4', placement: 'Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Increase Spend' },
      { id: 'LI-005', status: 'In-option', name: 'Line-item 5', placement: 'Homepage', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Optimize Budget' },
    ];
    
    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Digital In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Campaign moved to in-option status' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Line Item Added', field: 'Line Items', oldValue: '-', newValue: 'LI-001', description: 'Added Homepage line item' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    
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
        value: '3.35x', 
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
        value: `${(currentMetrics.roas / 100).toFixed(2)}x`, 
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
      <div className="space-y-6">
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
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap">
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
          title: 'Digital In-store: Summer Launch (In-Option)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Line-items',
              value: 'line-items',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In-option', value: 'In-option' },
                          { label: 'Running', value: 'Running' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: lineItemStatus,
                        onChange: setLineItemStatus,
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
                    searchPlaceholder="Search line items..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Line-item ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'placement', header: 'Placement' },
                      { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'aiRecommendation', header: 'AI Recommendation', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                    ]}
                    data={lineItemData.filter(row => {
                      const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/digital-instore/line-item/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Approved', value: 'Approved' },
                          { label: 'Rejected', value: 'Rejected' },
                          { label: 'Pending', value: 'Pending' },
                        ],
                        selectedValues: creativeStatus,
                        onChange: setCreativeStatus,
                      },
                      {
                        name: 'Format',
                        options: [
                          { label: 'Banner', value: 'Banner' },
                          { label: 'Video', value: 'Video' },
                        ],
                        selectedValues: creativeFormat,
                        onChange: setCreativeFormat,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search creatives..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Creative ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'format', header: 'Format' },
                      { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
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
                    data={creativeData.filter(row => {
                      const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                      const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                      return statusMatch && formatMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to creative detail: ${row.name} (${row.id})`)}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'line-items' ? (
              <Button>Add line-item</Button>
            ) : activeTab === 'creatives' ? (
              <Button>Add creative</Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
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
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
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
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Banner', placements: 3 },
      { id: 'CR-002', status: 'Approved', name: 'Creative 2', format: 'Video', placements: 1 },
      { id: 'CR-003', status: 'Approved', name: 'Creative 3', format: 'Banner', placements: 2 },
    ];
    const lineItemData = [
      { id: 'LI-001', status: 'Running', name: 'Line-item 1', placement: 'Homepage', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Increase Spend' },
      { id: 'LI-002', status: 'Running', name: 'Line-item 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-003', status: 'Running', name: 'Line-item 3', placement: 'Footer', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Increase Spend' },
      { id: 'LI-004', status: 'Running', name: 'Line-item 4', placement: 'Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-005', status: 'Running', name: 'Line-item 5', placement: 'Homepage', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Increase Spend' },
    ];
    
    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Digital In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'Running', description: 'Campaign is now live' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Line Item Added', field: 'Line Items', oldValue: '-', newValue: 'LI-001', description: 'Added Homepage line item' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    
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
        value: '3.24x', 
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

    const ForecastSection = () => (
      <MetricRow
        metrics={performanceMetrics.map(m => ({ ...m, key: m.id }))}
        selectedKeys={performanceMetrics.map(m => m.id)}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        dialogMetrics={dialogMetricsDigitalInstoreRunning}
        onDialogMetricClick={(key) => console.log(`${key} selected`)}
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
            title: 'Digital In-store: Summer Launch (Running)',
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
            headerRight: (
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="Pick a date range with conversion window"
                showPresets={true}
                showConversionWindow={true}
                conversionWindow={conversionWindow}
                onConversionWindowChange={setConversionWindow}
              />
            ),
          }}
        >
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Line-items',
              value: 'line-items',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In-option', value: 'In-option' },
                          { label: 'Running', value: 'Running' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: lineItemStatus,
                        onChange: setLineItemStatus,
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
                    searchPlaceholder="Search line items..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Line-item ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'placement', header: 'Placement' },
                      { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'aiRecommendation', header: 'AI Recommendation', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                    ]}
                    data={lineItemData.filter(row => {
                      const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/digital-instore/line-item/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Approved', value: 'Approved' },
                          { label: 'Rejected', value: 'Rejected' },
                          { label: 'Pending', value: 'Pending' },
                        ],
                        selectedValues: creativeStatus,
                        onChange: setCreativeStatus,
                      },
                      {
                        name: 'Format',
                        options: [
                          { label: 'Banner', value: 'Banner' },
                          { label: 'Video', value: 'Video' },
                        ],
                        selectedValues: creativeFormat,
                        onChange: setCreativeFormat,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search creatives..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Creative ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'format', header: 'Format' },
                      { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
                    ]}
                    data={creativeData.filter(row => {
                      const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                      const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                      return statusMatch && formatMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/digital-instore/creative/${row.id}`}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'line-items' ? (
              <Button>Add line-item</Button>
            ) : activeTab === 'creatives' ? (
              <Button>Add creative</Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
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
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
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
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Print', placements: 3 },
      { id: 'CR-002', status: 'Approved', name: 'Creative 2', format: 'Poster', placements: 1 },
      { id: 'CR-003', status: 'Approved', name: 'Creative 3', format: 'Shelf Talker', placements: 2 },
    ];
    const lineItemData = [
      { id: 'LI-001', status: 'Running', name: 'Line-item 1', placement: 'End Cap', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-002', status: 'Running', name: 'Line-item 2', placement: 'Shelf Edge', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Increase Spend' },
      { id: 'LI-003', status: 'Running', name: 'Line-item 3', placement: 'Floor Stand', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-004', status: 'Running', name: 'Line-item 4', placement: 'Aisle Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Increase Spend' },
      { id: 'LI-005', status: 'Running', name: 'Line-item 5', placement: 'Checkout', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Optimize Budget' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Offline In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'Running', description: 'Campaign is now live' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Line Item Added', field: 'Line Items', oldValue: '-', newValue: 'LI-001', description: 'Added End Cap line item' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for running campaign
    const performanceMetrics = [
      {
        id: 'impressions',
        label: 'Impressions',
        value: '1,875,420',
        subMetric: 'Footfall: 12.8%',
        badgeValue: '+6%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'stores',
        label: 'Stores',
        value: '287',
        subMetric: 'Coverage: 74%',
        badgeValue: '+2%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'reach',
        label: 'Reach',
        value: '1.9M',
        subMetric: 'Unique visitors',
        badgeValue: '+8%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'roas',
        label: 'ROAS',
        value: '2.86x',
        subMetric: 'AOV: €65.20',
        badgeValue: '+15%',
        badgeVariant: 'success' as const,
      },
    ];

    const dialogMetricsOfflineInstoreRunning: MetricDefinition[] = [
      { key: 'footfallRate', label: 'Footfall Rate', value: '12.8%', subMetric: 'vs. 11.2% last period', badgeValue: '+14.3%', badgeVariant: 'success' },
      { key: 'storeCoverage', label: 'Store Coverage', value: '74%', subMetric: '287 of 388 stores', badgeValue: '+2.1%', badgeVariant: 'success' },
      { key: 'dwellTime', label: 'Average Dwell Time', value: '4.2 min', subMetric: 'vs. 3.8 min target', badgeValue: '+10.5%', badgeVariant: 'success' },
      { key: 'placementVisibility', label: 'Placement Visibility', value: '91.5%', subMetric: 'Above category avg', badgeValue: '+7.2%', badgeVariant: 'success' },
      { key: 'brandAwareness', label: 'Brand Awareness', value: '+22.4%', subMetric: 'Unaided recall', badgeValue: 'High', badgeVariant: 'info' },
      { key: 'purchaseIntent', label: 'Purchase Intent', value: '+18.6%', subMetric: 'Post-exposure', badgeValue: '+3.2%', badgeVariant: 'secondary' },
      { key: 'cpi', label: 'Cost Per Impression', value: '€0.12', subMetric: 'vs. €0.15 target', badgeValue: '-20%', badgeVariant: 'success' },
      { key: 'engagementRate', label: 'Engagement Rate', value: '8.9%', subMetric: 'Interactive displays', badgeValue: '+12.1%', badgeVariant: 'success' },
      { key: 'conversionLift', label: 'Conversion Lift', value: '+15.3%', subMetric: 'In-store purchases', badgeValue: '+2.8%', badgeVariant: 'success' },
    ];

    const ForecastSection = () => (
      <MetricRow
        metrics={performanceMetrics.map(m => ({ ...m, key: m.id }))}
        selectedKeys={performanceMetrics.map(m => m.id)}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        dialogMetrics={dialogMetricsOfflineInstoreRunning}
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
          title: 'Offline In-store: Summer Launch (Running)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Line-items',
              value: 'line-items',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In-option', value: 'In-option' },
                          { label: 'Running', value: 'Running' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: lineItemStatus,
                        onChange: setLineItemStatus,
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
                    searchPlaceholder="Search line items..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Line-item ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'aiRecommendation', header: 'AI Recommendation', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
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
                    data={lineItemData.filter(row => {
                      const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/display/line-item/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Approved', value: 'Approved' },
                          { label: 'Rejected', value: 'Rejected' },
                          { label: 'Pending', value: 'Pending' },
                        ],
                        selectedValues: creativeStatus,
                        onChange: setCreativeStatus,
                      },
                      {
                        name: 'Format',
                        options: [
                          { label: 'Print', value: 'Print' },
                          { label: 'Poster', value: 'Poster' },
                          { label: 'Shelf Talker', value: 'Shelf Talker' },
                        ],
                        selectedValues: creativeFormat,
                        onChange: setCreativeFormat,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search creatives..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Creative ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'format', header: 'Format' },
                      { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
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
                    data={creativeData.filter(row => {
                      const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                      const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                      return statusMatch && formatMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/display/creative/${row.id}`}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'line-items' ? (
              <Button>Add line-item</Button>
            ) : activeTab === 'creatives' ? (
              <Button>Add creative</Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
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
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
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
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Display Banner', placements: 4, totalSkuConversions: '3,245', totalSkuConversionRate: '2.8%', totalSkuUnits: '5,678', totalSkuRevenue: '$98,450', totalSkuRoas: '4.2x', onlineSkuConversions: '2,271', onlineSkuUnits: '3,975', onlineSkuRevenue: '$68,915', instoreSkuConversions: '974', instoreSkuUnits: '1,703', instoreSkuRevenue: '$29,535' },
      { id: 'CR-002', status: 'Approved', name: 'Creative 2', format: 'Video', placements: 2, totalSkuConversions: '1,867', totalSkuConversionRate: '3.4%', totalSkuUnits: '3,234', totalSkuRevenue: '$67,890', totalSkuRoas: '4.8x', onlineSkuConversions: '1,307', onlineSkuUnits: '2,264', onlineSkuRevenue: '$47,523', instoreSkuConversions: '560', instoreSkuUnits: '970', instoreSkuRevenue: '$20,367' },
      { id: 'CR-003', status: 'Approved', name: 'Creative 3', format: 'Rich Media', placements: 3, totalSkuConversions: '2,456', totalSkuConversionRate: '3.1%', totalSkuUnits: '4,123', totalSkuRevenue: '$89,670', totalSkuRoas: '4.6x', onlineSkuConversions: '1,719', onlineSkuUnits: '2,886', onlineSkuRevenue: '$62,769', instoreSkuConversions: '737', instoreSkuUnits: '1,237', instoreSkuRevenue: '$26,901' },
    ];
    const lineItemData = [
      { id: 'LI-001', status: 'Running', name: 'Line-item 1', placement: 'Above The Fold', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,248', totalSkuConversionRate: '3.2%', totalSkuUnits: '2,156', totalSkuRevenue: '$45,280', totalSkuRoas: '4.8x', onlineSkuConversions: '892', onlineSkuUnits: '1,543', onlineSkuRevenue: '$32,100', instoreSkuConversions: '356', instoreSkuUnits: '613', instoreSkuRevenue: '$13,180' },
      { id: 'LI-002', status: 'Running', name: 'Line-item 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget', totalSkuConversions: '987', totalSkuConversionRate: '2.8%', totalSkuUnits: '1,734', totalSkuRevenue: '$38,450', totalSkuRoas: '4.2x', onlineSkuConversions: '721', onlineSkuUnits: '1,245', onlineSkuRevenue: '$27,320', instoreSkuConversions: '266', instoreSkuUnits: '489', instoreSkuRevenue: '$11,130' },
      { id: 'LI-003', status: 'Running', name: 'Line-item 3', placement: 'Native Feed', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Increase Spend', totalSkuConversions: '2,134', totalSkuConversionRate: '4.1%', totalSkuUnits: '3,567', totalSkuRevenue: '$72,450', totalSkuRoas: '5.3x', onlineSkuConversions: '1,489', onlineSkuUnits: '2,398', onlineSkuRevenue: '$49,780', instoreSkuConversions: '645', instoreSkuUnits: '1,169', instoreSkuRevenue: '$22,670' },
      { id: 'LI-004', status: 'Running', name: 'Line-item 4', placement: 'Interstitial', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Optimize Budget', totalSkuConversions: '743', totalSkuConversionRate: '2.1%', totalSkuUnits: '1,298', totalSkuRevenue: '$28,920', totalSkuRoas: '3.7x', onlineSkuConversions: '534', onlineSkuUnits: '923', onlineSkuRevenue: '$20,440', instoreSkuConversions: '209', instoreSkuUnits: '375', instoreSkuRevenue: '$8,480' },
      { id: 'LI-005', status: 'Running', name: 'Line-item 5', placement: 'Bottom Banner', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,567', totalSkuConversionRate: '3.6%', totalSkuUnits: '2,834', totalSkuRevenue: '$58,670', totalSkuRoas: '4.9x', onlineSkuConversions: '1,098', onlineSkuUnits: '1,954', onlineSkuRevenue: '$40,230', instoreSkuConversions: '469', instoreSkuUnits: '880', instoreSkuRevenue: '$18,440' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Display: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€50,000', newValue: '€75,000', description: 'Budget increased for Q4 push' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'Running', description: 'Campaign is now live' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Line Item Added', field: 'Line Items', oldValue: '-', newValue: 'LI-001', description: 'Added Above The Fold line item' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

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
        value: '4.12x',
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
        metrics={performanceMetrics.map(m => ({ ...m, key: m.id }))}
        selectedKeys={performanceMetrics.map(m => m.id)}
        maxVisible={5}
        defaultVariant="default"
        removable={false}
        dialogMetrics={dialogMetricsDisplayRunning}
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
          title: 'Display: Summer Launch (Running)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Line-items',
              value: 'line-items',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In-option', value: 'In-option' },
                          { label: 'Running', value: 'Running' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: lineItemStatus,
                        onChange: setLineItemStatus,
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
                    searchPlaceholder="Search line items..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Line-item ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'aiRecommendation', header: 'AI Recommendation', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
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
                    data={lineItemData.filter(row => {
                      const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/display/line-item/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Approved', value: 'Approved' },
                          { label: 'Rejected', value: 'Rejected' },
                          { label: 'Pending', value: 'Pending' },
                        ],
                        selectedValues: creativeStatus,
                        onChange: setCreativeStatus,
                      },
                      {
                        name: 'Format',
                        options: [
                          { label: 'Display Banner', value: 'Display Banner' },
                          { label: 'Video', value: 'Video' },
                          { label: 'Rich Media', value: 'Rich Media' },
                        ],
                        selectedValues: creativeFormat,
                        onChange: setCreativeFormat,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search creatives..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Creative ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'format', header: 'Format' },
                      { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
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
                    data={creativeData.filter(row => {
                      const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                      const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                      return statusMatch && formatMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/display/creative/${row.id}`}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'line-items' ? (
              <Button>Add line-item</Button>
            ) : activeTab === 'creatives' ? (
              <Button>Add creative</Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
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
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
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
    const creativeData = [
      { id: 'CR-001', status: 'Pending', name: 'Creative 1', format: 'Print', placements: 2 },
      { id: 'CR-002', status: 'Approved', name: 'Creative 2', format: 'Poster', placements: 1 },
      { id: 'CR-003', status: 'Pending', name: 'Creative 3', format: 'Shelf Talker', placements: 1 },
    ];
    const lineItemData = [
      { id: 'LI-001', status: 'In-option', name: 'Line-item 1', placement: 'End Cap', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-002', status: 'In-option', name: 'Line-item 2', placement: 'Shelf Edge', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Increase Spend' },
      { id: 'LI-003', status: 'Ready', name: 'Line-item 3', placement: 'Floor Stand', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Optimize Budget' },
      { id: 'LI-004', status: 'In-option', name: 'Line-item 4', placement: 'Aisle Header', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Increase Spend' },
      { id: 'LI-005', status: 'Ready', name: 'Line-item 5', placement: 'Checkout', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Optimize Budget' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-09 16:20:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Offline In-store: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-09 16:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€0', newValue: '€75,000', description: 'Initial budget allocation' },
      { id: 'LOG-003', timestamp: '2024-12-10 09:15:33', user: 'Sarah Wilson', action: 'Line Item Added', field: 'Line Items', oldValue: '-', newValue: 'LI-001', description: 'Added End Cap line item for approval' },
      { id: 'LOG-004', timestamp: '2024-12-10 10:45:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Print creative uploaded for review' },
      { id: 'LOG-005', timestamp: '2024-12-10 11:30:14', user: 'Mike Johnson', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Campaign moved to in-option status' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

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
        value: '2.50x',
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
      { key: 'expectedRoi', label: 'Expected ROI', value: '2.5x', subMetric: 'Target return', badgeValue: 'Goal', badgeVariant: 'secondary' },
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
          title: 'Offline In-store: Summer Launch (In-option)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Line-items',
              value: 'line-items',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In-option', value: 'In-option' },
                          { label: 'Running', value: 'Running' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: lineItemStatus,
                        onChange: setLineItemStatus,
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
                    searchPlaceholder="Search line items..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Line-item ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'placement', header: 'Placement' },
                      { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'aiRecommendation', header: 'AI Recommendation', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                    ]}
                    data={lineItemData.filter(row => {
                      const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offline-instore/line-item/${row.id}`}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Approved', value: 'Approved' },
                          { label: 'Rejected', value: 'Rejected' },
                          { label: 'Pending', value: 'Pending' },
                        ],
                        selectedValues: creativeStatus,
                        onChange: setCreativeStatus,
                      },
                      {
                        name: 'Format',
                        options: [
                          { label: 'Print', value: 'Print' },
                          { label: 'Poster', value: 'Poster' },
                          { label: 'Shelf Talker', value: 'Shelf Talker' },
                        ],
                        selectedValues: creativeFormat,
                        onChange: setCreativeFormat,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search creatives..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Creative ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'format', header: 'Format' },
                      { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
                    ]}
                    data={creativeData.filter(row => {
                      const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                      const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                      return statusMatch && formatMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => window.location.href = `/campaigns/offline-instore/creative/${row.id}`}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'line-items' ? (
              <Button>Add line-item</Button>
            ) : activeTab === 'creatives' ? (
              <Button>Add creative</Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
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
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
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
    const creativeData = [
      { id: 'CR-001', status: 'Pending', name: 'Creative 1', format: 'Display Banner', placements: 3, totalSkuConversions: '1,245', totalSkuConversionRate: '2.1%', totalSkuUnits: '2,134', totalSkuRevenue: '$42,680', totalSkuRoas: '3.5x', onlineSkuConversions: '871', onlineSkuUnits: '1,494', onlineSkuRevenue: '$29,876', instoreSkuConversions: '374', instoreSkuUnits: '640', instoreSkuRevenue: '$12,804' },
      { id: 'CR-002', status: 'Approved', name: 'Creative 2', format: 'Video', placements: 1, totalSkuConversions: '2,867', totalSkuConversionRate: '3.6%', totalSkuUnits: '4,923', totalSkuRevenue: '$98,460', totalSkuRoas: '4.9x', onlineSkuConversions: '2,007', onlineSkuUnits: '3,446', onlineSkuRevenue: '$68,922', instoreSkuConversions: '860', instoreSkuUnits: '1,477', instoreSkuRevenue: '$29,538' },
      { id: 'CR-003', status: 'Rejected', name: 'Creative 3', format: 'Rich Media', placements: 0, totalSkuConversions: '0', totalSkuConversionRate: '0%', totalSkuUnits: '0', totalSkuRevenue: '$0', totalSkuRoas: '0x', onlineSkuConversions: '0', onlineSkuUnits: '0', onlineSkuRevenue: '$0', instoreSkuConversions: '0', instoreSkuUnits: '0', instoreSkuRevenue: '$0' },
    ];
    const lineItemData = [
      { id: 'LI-001', status: 'In-option', name: 'Line-item 1', placement: 'Above The Fold', start: '2024-06-01', end: '2024-06-30', aiRecommendation: 'Increase Spend', totalSkuConversions: '856', totalSkuConversionRate: '2.4%', totalSkuUnits: '1,467', totalSkuRevenue: '$31,280', totalSkuRoas: '3.8x', onlineSkuConversions: '598', onlineSkuUnits: '1,023', onlineSkuRevenue: '$21,840', instoreSkuConversions: '258', instoreSkuUnits: '444', instoreSkuRevenue: '$9,440' },
      { id: 'LI-002', status: 'In-option', name: 'Line-item 2', placement: 'Sidebar', start: '2024-07-01', end: '2024-07-31', aiRecommendation: 'Optimize Budget', totalSkuConversions: '634', totalSkuConversionRate: '1.9%', totalSkuUnits: '1,156', totalSkuRevenue: '$25,670', totalSkuRoas: '3.2x', onlineSkuConversions: '443', onlineSkuUnits: '798', onlineSkuRevenue: '$17,340', instoreSkuConversions: '191', instoreSkuUnits: '358', instoreSkuRevenue: '$8,330' },
      { id: 'LI-003', status: 'Ready', name: 'Line-item 3', placement: 'Native Feed', start: '2024-08-10', end: '2024-09-10', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,456', totalSkuConversionRate: '3.8%', totalSkuUnits: '2,543', totalSkuRevenue: '$54,230', totalSkuRoas: '4.7x', onlineSkuConversions: '1,019', onlineSkuUnits: '1,780', onlineSkuRevenue: '$37,960', instoreSkuConversions: '437', instoreSkuUnits: '763', instoreSkuRevenue: '$16,270' },
      { id: 'LI-004', status: 'In-option', name: 'Line-item 4', placement: 'Interstitial', start: '2024-11-01', end: '2024-11-30', aiRecommendation: 'Optimize Budget', totalSkuConversions: '432', totalSkuConversionRate: '1.5%', totalSkuUnits: '798', totalSkuRevenue: '$18,450', totalSkuRoas: '2.8x', onlineSkuConversions: '302', onlineSkuUnits: '559', onlineSkuRevenue: '$12,920', instoreSkuConversions: '130', instoreSkuUnits: '239', instoreSkuRevenue: '$5,530' },
      { id: 'LI-005', status: 'Ready', name: 'Line-item 5', placement: 'Bottom Banner', start: '2024-12-01', end: '2024-12-31', aiRecommendation: 'Increase Spend', totalSkuConversions: '1,089', totalSkuConversionRate: '3.1%', totalSkuUnits: '1,967', totalSkuRevenue: '$41,780', totalSkuRoas: '4.1x', onlineSkuConversions: '762', onlineSkuUnits: '1,377', onlineSkuRevenue: '$29,250', instoreSkuConversions: '327', instoreSkuUnits: '590', instoreSkuRevenue: '$12,530' },
    ];

    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-09 15:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Display: Summer Launch', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-09 15:45:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€0', newValue: '€100,000', description: 'Initial budget allocation for display campaign' },
      { id: 'LOG-003', timestamp: '2024-12-10 08:15:33', user: 'Sarah Wilson', action: 'Line Item Added', field: 'Line Items', oldValue: '-', newValue: 'LI-001', description: 'Added Above The Fold placement for approval' },
      { id: 'LOG-004', timestamp: '2024-12-10 09:30:21', user: 'Jane Doe', action: 'Creative Uploaded', field: 'Creatives', oldValue: '-', newValue: 'CR-001', description: 'Display banner creative uploaded for review' },
      { id: 'LOG-005', timestamp: '2024-12-10 10:15:14', user: 'Mike Johnson', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Campaign moved to in-option for client review' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

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
        value: '3.50x',
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
          title: 'Display: Summer Launch (In-option)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Line-items',
              value: 'line-items',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'In-option', value: 'In-option' },
                          { label: 'Running', value: 'Running' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Stopped', value: 'Stopped' },
                          { label: 'Ready', value: 'Ready' },
                        ],
                        selectedValues: lineItemStatus,
                        onChange: setLineItemStatus,
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
                    searchPlaceholder="Search line items..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Line-item ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'aiRecommendation', header: 'AI Recommendation', render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge> },
                      { key: 'placement', header: 'Placement' },
                      { key: 'start', header: 'Start date', render: row => new Date(row.start).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'end', header: 'End date', render: row => new Date(row.end).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
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
                    data={lineItemData.filter(row => {
                      const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                      const placementMatch = placement.length === 0 || placement.includes(row.placement);
                      return statusMatch && placementMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to line-item detail: ${row.name} (${row.id})`)}
                  />
                </div>
              ),
            },
            {
              label: 'Creatives',
              value: 'creatives',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Status',
                        options: [
                          { label: 'Approved', value: 'Approved' },
                          { label: 'Rejected', value: 'Rejected' },
                          { label: 'Pending', value: 'Pending' },
                        ],
                        selectedValues: creativeStatus,
                        onChange: setCreativeStatus,
                      },
                      {
                        name: 'Format',
                        options: [
                          { label: 'Display Banner', value: 'Display Banner' },
                          { label: 'Video', value: 'Video' },
                          { label: 'Rich Media', value: 'Rich Media' },
                        ],
                        selectedValues: creativeFormat,
                        onChange: setCreativeFormat,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search creatives..."
                  />
                  <Table
                    columns={[
                      { key: 'id', header: 'Creative ID' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge> },
                      { key: 'name', header: 'Name' },
                      { key: 'format', header: 'Format' },
                      { key: 'placements', header: 'Placements', render: row => <Badge variant="secondary">{row.placements}</Badge> },
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
                    data={creativeData.filter(row => {
                      const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                      const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                      return statusMatch && formatMatch;
                    })}
                    rowKey={row => row.id}
                    onRowClick={(row) => console.log(`Navigate to creative detail: ${row.name} (${row.id})`)}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'line-items' ? (
              <Button>Add line-item</Button>
            ) : activeTab === 'creatives' ? (
              <Button>Add creative</Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
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
    const [activeTab, setActiveTab] = useState('products');
    const [searchVolume, setSearchVolume] = useState<string[]>([]);
    const [competitive, setCompetitive] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Banner', placements: 3 },
      { id: 'CR-002', status: 'Rejected', name: 'Creative 2', format: 'Video', placements: 1 },
      { id: 'CR-003', status: 'Pending', name: 'Creative 3', format: 'Banner', placements: 2 },
    ];
    const productData = [
      { 
        productId: 'P-001', 
        gtin: '1234567890123', 
        image: 'https://via.placeholder.com/40x40', 
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
        image: 'https://via.placeholder.com/40x40', 
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
        image: 'https://via.placeholder.com/40x40', 
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
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Campaign moved to in-option status' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    
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
        value: '4.2x', 
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
        value: `${(currentMetrics.roas / 100).toFixed(2)}x`,
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
      <div className="space-y-6">
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
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap">
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
                <div className="grid grid-cols-1 gap-4">
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
                      <h4 className="font-medium text-gray-900">{item.category}</h4>
                      <p className="text-sm text-gray-500">Competition level: {item.competition}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${item.color}`}>
                      {Array.from({ length: item.level }, (_, i) => (
                        <Triangle key={i} className="w-4 h-4 fill-current" />
                      ))}
                      {Array.from({ length: 3 - item.level }, (_, i) => (
                        <Triangle key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
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
          title: 'Sponsored Products: Summer Launch (In-Option)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Products',
              value: 'products',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Search Volume',
                        options: [
                          { label: 'High', value: 'High' },
                          { label: 'Medium', value: 'Medium' },
                          { label: 'Low', value: 'Low' },
                        ],
                        selectedValues: searchVolume,
                        onChange: setSearchVolume,
                      },
                      {
                        name: 'Competitive',
                        options: [
                          { label: 'High', value: 'High' },
                          { label: 'Medium', value: 'Medium' },
                          { label: 'Low', value: 'Low' },
                        ],
                        selectedValues: competitive,
                        onChange: setCompetitive,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search products..."
                  />
                  <Table
                    columns={[
                      { key: 'productId', header: 'Product ID' },
                      { key: 'gtin', header: 'GTIN' },
                      { key: 'image', header: 'Image', render: row => <img src={row.image} alt="Product" className="w-8 h-8 rounded object-cover" /> },
                      { key: 'productTitle', header: 'Product Title' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'startTime', header: 'Start Time', render: row => new Date(row.startTime).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'endTime', header: 'End Time', render: row => new Date(row.endTime).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'searchVolume', header: 'Search Volume', render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge> },
                      { key: 'competitive', header: 'Competitive', render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge> },
                    ]}
                    data={productData.filter(row => {
                      const searchVolumeMatch = searchVolume.length === 0 || searchVolume.includes(row.searchVolume);
                      const competitiveMatch = competitive.length === 0 || competitive.includes(row.competitive);
                      return searchVolumeMatch && competitiveMatch;
                    })}
                    rowKey={row => row.productId}
                  />
                </div>
              ),
            },
            {
              label: 'Keywords',
              value: 'keywords',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Match Type',
                        options: [
                          { label: 'Exact', value: 'Exact' },
                          { label: 'Phrase', value: 'Phrase' },
                          { label: 'Broad', value: 'Broad' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                      {
                        name: 'Status',
                        options: [
                          { label: 'Active', value: 'Active' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Negative', value: 'Negative' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search keywords..."
                  />
                  <Table
                    columns={[
                      { key: 'keyword', header: 'Keyword' },
                      { key: 'matchType', header: 'Match Type', render: row => <Badge variant="outline">{row.matchType}</Badge> },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversion', header: 'Conversion' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'roas', header: 'ROAS' },
                      { key: 'searchVolume', header: 'Search Volume', render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge> },
                      { key: 'competitive', header: 'Competitive', render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge> },
                    ]}
                    data={[
                      { keyword: 'premium coffee beans', matchType: 'Exact', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€200', spent: '€0', budgetLeft: '€200', roas: '-', searchVolume: 'High', competitive: 'Medium' },
                      { keyword: 'organic coffee', matchType: 'Phrase', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€150', spent: '€0', budgetLeft: '€150', roas: '-', searchVolume: 'Medium', competitive: 'High' },
                      { keyword: 'coffee beans 500g', matchType: 'Broad', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€100', spent: '€0', budgetLeft: '€100', roas: '-', searchVolume: 'Low', competitive: 'Low' },
                    ]}
                    rowKey={row => row.keyword}
                  />
                </div>
              ),
            },
            {
              label: 'Categories',
              value: 'categories',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Category Level',
                        options: [
                          { label: 'Level 1', value: 'Level 1' },
                          { label: 'Level 2', value: 'Level 2' },
                          { label: 'Level 3', value: 'Level 3' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                      {
                        name: 'Status',
                        options: [
                          { label: 'Active', value: 'Active' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Excluded', value: 'Excluded' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search categories..."
                  />
                  <Table
                    columns={[
                      { key: 'category', header: 'Category' },
                      { key: 'level', header: 'Level', render: row => <Badge variant="secondary">{row.level}</Badge> },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversion', header: 'Conversion' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'roas', header: 'ROAS' },
                      { key: 'searchVolume', header: 'Search Volume', render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge> },
                      { key: 'competitive', header: 'Competitive', render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge> },
                    ]}
                    data={[
                      { category: 'Food & Beverages > Coffee & Tea', level: 'Level 2', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€300', spent: '€0', budgetLeft: '€300', roas: '-', searchVolume: 'High', competitive: 'Medium' },
                      { category: 'Food & Beverages > Snacks', level: 'Level 2', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€200', spent: '€0', budgetLeft: '€200', roas: '-', searchVolume: 'Medium', competitive: 'High' },
                      { category: 'Organic Products', level: 'Level 1', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€250', spent: '€0', budgetLeft: '€250', roas: '-', searchVolume: 'Medium', competitive: 'Low' },
                    ]}
                    rowKey={row => row.category}
                  />
                </div>
              ),
            },
            {
              label: 'Other',
              value: 'other',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Setting Type',
                        options: [
                          { label: 'Targeting', value: 'Targeting' },
                          { label: 'Bidding', value: 'Bidding' },
                          { label: 'Schedule', value: 'Schedule' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                      {
                        name: 'Status',
                        options: [
                          { label: 'Active', value: 'Active' },
                          { label: 'Inactive', value: 'Inactive' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search settings..."
                  />
                  <Table
                    columns={[
                      { key: 'setting', header: 'Setting' },
                      { key: 'type', header: 'Type', render: row => <Badge variant="outline">{row.type}</Badge> },
                      { key: 'value', header: 'Value' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversion', header: 'Conversion' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'roas', header: 'ROAS' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge> },
                    ]}
                    data={[
                      { setting: 'Age: 25-54', type: 'Targeting', value: 'Included', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€400', spent: '€0', budgetLeft: '€400', roas: '-', status: 'Active' },
                      { setting: 'Gender: All', type: 'Targeting', value: 'Included', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€300', spent: '€0', budgetLeft: '€300', roas: '-', status: 'Active' },
                      { setting: 'Schedule: Weekdays 9-17', type: 'Schedule', value: 'Active', impressions: '-', clicks: '-', avgCPC: '-', ctr: '-', conversion: '-', sales: '-', budget: '€200', spent: '€0', budgetLeft: '€200', roas: '-', status: 'Active' },
                    ]}
                    rowKey={row => row.setting}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'products' ? (
              <Button>Add product</Button>
            ) : activeTab === 'keywords' ? (
              <Button>Add keyword</Button>
            ) : activeTab === 'categories' ? (
              <Button>Add categories</Button>
            ) : activeTab === 'other' ? (
              <Button>Add other</Button>
            ) : activeTab === 'creatives' ? (
              <Button>Add creative</Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
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
    const [activeTab, setActiveTab] = useState('products');
    const [selectedMetric, setSelectedMetric] = useState('impressions');
    const [searchVolume, setSearchVolume] = useState<string[]>([]);
    const [competitive, setCompetitive] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30),
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const creativeData = [
      { id: 'CR-001', status: 'Approved', name: 'Creative 1', format: 'Banner', placements: 3 },
      { id: 'CR-002', status: 'Approved', name: 'Creative 2', format: 'Video', placements: 1 },
      { id: 'CR-003', status: 'Approved', name: 'Creative 3', format: 'Banner', placements: 2 },
    ];
    const productData = [
      { 
        productId: 'P-001', 
        gtin: '1234567890123', 
        image: 'https://via.placeholder.com/40x40', 
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
        roas: '3.8x', 
        extROAS: '4.2x', 
        iROAS: '3.6x', 
        startTime: '2024-06-01', 
        endTime: '2024-06-30',
        searchVolume: 'High',
        competitive: 'Medium'
      },
      { 
        productId: 'P-002', 
        gtin: '2345678901234', 
        image: 'https://via.placeholder.com/40x40', 
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
        roas: '2.9x', 
        extROAS: '3.1x', 
        iROAS: '2.8x', 
        startTime: '2024-07-01', 
        endTime: '2024-07-31',
        searchVolume: 'Medium',
        competitive: 'High'
      },
      { 
        productId: 'P-003', 
        gtin: '3456789012345', 
        image: 'https://via.placeholder.com/40x40', 
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
        roas: '4.2x', 
        extROAS: '4.6x', 
        iROAS: '4.1x', 
        startTime: '2024-08-10', 
        endTime: '2024-09-10',
        searchVolume: 'Low',
        competitive: 'Medium'
      },
    ];
    const logData = [
      { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Sponsored Products: Running Campaign', description: 'Initial campaign creation' },
      { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '€500', newValue: '€750', description: 'Budget increased for active campaign' },
      { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'In-option', newValue: 'Running', description: 'Campaign activated and running' },
      { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Performance Update', field: 'Metrics', oldValue: '-', newValue: 'CTR: 3.5%', description: 'Daily performance metrics update' },
      { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'System', action: 'Spend Alert', field: 'Budget', oldValue: '€100 remaining', newValue: '€13 remaining', description: 'Budget alert triggered' },
      { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Bid Adjustment', field: 'Bidding', oldValue: '€0.25', newValue: '€0.28', description: 'Increased bid for better positioning' },
      { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'ROAS Update', field: 'Performance', oldValue: '3.8x', newValue: '4.2x', description: 'Improved return on ad spend' },
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
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option': return 'outline';
        case 'Running': return 'success';
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
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    
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
        subMetric: 'ROAS: 3.34x',
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
      <div className="space-y-6">
        <MetricRow
          metrics={performanceMetrics.map(m => ({ ...m, key: m.id }))}
          selectedKeys={performanceMetrics.map(m => m.id)}
          maxVisible={5}
          defaultVariant="default"
          removable={false}
          activeKey={selectedMetric}
          onActiveKeyChange={(key) => setSelectedMetric(key ?? 'impressions')}
          dialogMetrics={dialogMetricsSponsoredProductsRunning}
          onDialogMetricClick={(key) => console.log(`${key} selected`)}
        />

        {/* Interactive Line Chart */}
        <div>
          <div className="relative bg-white border rounded-lg p-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedMetric('impressions')}
              aria-label="Close chart"
              className="absolute top-2 right-2 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
            <LineChartComponent
            data={chartData}
            config={{
              value: {
                label: selectedMetricData?.label || 'Value',
                color: "hsl(var(--chart-1))",
              },
            }}
            showLegend={false}
            showGrid={true}
            showTooltip={true}
            showXAxis={true}
            showYAxis={true}
              className="h-52 w-full"
              xAxisDataKey="day"
            />
          </div>
        </div>
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
          title: 'Sponsored Products: Summer Launch (Running)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Pick a date range with conversion window"
              showPresets={true}
              showConversionWindow={true}
              conversionWindow={conversionWindow}
              onConversionWindowChange={setConversionWindow}
            />
          ),
        }}
      >
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs
          className="w-full"
          header={
            activeTab === 'details' ? (
              <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Acme Media', value: 'acme' },
                          { label: 'BrandX', value: 'brandx' },
                        ]}
                        value={advertiserDropdown}
                        onChange={setAdvertiserDropdown}
                        placeholder="Select advertiser"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Brand 1', value: 'brand1' },
                          { label: 'Brand 2', value: 'brand2' },
                        ]}
                        value={brandDropdown}
                        onChange={setBrandDropdown}
                        placeholder="Select brand"
                      />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input
                        dropdown
                        options={[
                          { label: 'Awareness', value: 'awareness' },
                          { label: 'Engagement', value: 'engagement' },
                          { label: 'Conversion', value: 'conversion' },
                        ]}
                        value={goalDropdown}
                        onChange={setGoalDropdown}
                        placeholder="Select goal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form>
            ) : null
          }
          tabs={[
            {
              label: 'Details',
              value: 'details',
              content: null,
            },
            {
              label: 'Products',
              value: 'products',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Search Volume',
                        options: [
                          { label: 'High', value: 'High' },
                          { label: 'Medium', value: 'Medium' },
                          { label: 'Low', value: 'Low' },
                        ],
                        selectedValues: searchVolume,
                        onChange: setSearchVolume,
                      },
                      {
                        name: 'Competitive',
                        options: [
                          { label: 'High', value: 'High' },
                          { label: 'Medium', value: 'Medium' },
                          { label: 'Low', value: 'Low' },
                        ],
                        selectedValues: competitive,
                        onChange: setCompetitive,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search products..."
                  />
                  <Table
                    columns={[
                      { key: 'productId', header: 'Product ID' },
                      { key: 'gtin', header: 'GTIN' },
                      { key: 'image', header: 'Image', render: row => <img src={row.image} alt="Product" className="w-8 h-8 rounded object-cover" /> },
                      { key: 'productTitle', header: 'Product Title' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'addToCart', header: 'Add to Cart' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'atc', header: 'ATC' },
                      { key: 'conversion', header: 'Conversion' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'roas', header: 'ROAS' },
                      { key: 'extROAS', header: 'Ext. ROAS' },
                      { key: 'iROAS', header: 'IROAS' },
                      { key: 'startTime', header: 'Start Time', render: row => new Date(row.startTime).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'endTime', header: 'End Time', render: row => new Date(row.endTime).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) },
                      { key: 'searchVolume', header: 'Search Volume', render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge> },
                      { key: 'competitive', header: 'Competitive', render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge> },
                    ]}
                    data={productData.filter(row => {
                      const searchVolumeMatch = searchVolume.length === 0 || searchVolume.includes(row.searchVolume);
                      const competitiveMatch = competitive.length === 0 || competitive.includes(row.competitive);
                      return searchVolumeMatch && competitiveMatch;
                    })}
                    rowKey={row => row.productId}
                  />
                </div>
              ),
            },
            {
              label: 'Keywords',
              value: 'keywords',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Match Type',
                        options: [
                          { label: 'Exact', value: 'Exact' },
                          { label: 'Phrase', value: 'Phrase' },
                          { label: 'Broad', value: 'Broad' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                      {
                        name: 'Status',
                        options: [
                          { label: 'Active', value: 'Active' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Negative', value: 'Negative' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search keywords..."
                  />
                  <Table
                    columns={[
                      { key: 'keyword', header: 'Keyword' },
                      { key: 'matchType', header: 'Match Type', render: row => <Badge variant="outline">{row.matchType}</Badge> },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversion', header: 'Conversion' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'roas', header: 'ROAS' },
                      { key: 'searchVolume', header: 'Search Volume', render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge> },
                      { key: 'competitive', header: 'Competitive', render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge> },
                    ]}
                    data={[
                      { keyword: 'premium coffee beans', matchType: 'Exact', impressions: '342,156', clicks: '8,923', avgCPC: '€0.38', ctr: '2.6%', conversion: '1.8%', sales: '€4,234', budget: '€200', spent: '€187', budgetLeft: '€13', roas: '2.8x', searchVolume: 'High', competitive: 'Medium' },
                      { keyword: 'organic coffee', matchType: 'Phrase', impressions: '187,432', clicks: '4,567', avgCPC: '€0.42', ctr: '2.4%', conversion: '1.5%', sales: '€2,156', budget: '€150', spent: '€143', budgetLeft: '€7', roas: '2.1x', searchVolume: 'Medium', competitive: 'High' },
                      { keyword: 'coffee beans 500g', matchType: 'Broad', impressions: '89,234', clicks: '1,892', avgCPC: '€0.29', ctr: '2.1%', conversion: '2.2%', sales: '€1,234', budget: '€100', spent: '€95', budgetLeft: '€5', roas: '3.1x', searchVolume: 'Low', competitive: 'Low' },
                    ]}
                    rowKey={row => row.keyword}
                  />
                </div>
              ),
            },
            {
              label: 'Categories',
              value: 'categories',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Category Level',
                        options: [
                          { label: 'Level 1', value: 'Level 1' },
                          { label: 'Level 2', value: 'Level 2' },
                          { label: 'Level 3', value: 'Level 3' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                      {
                        name: 'Status',
                        options: [
                          { label: 'Active', value: 'Active' },
                          { label: 'Paused', value: 'Paused' },
                          { label: 'Excluded', value: 'Excluded' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search categories..."
                  />
                  <Table
                    columns={[
                      { key: 'category', header: 'Category' },
                      { key: 'level', header: 'Level', render: row => <Badge variant="secondary">{row.level}</Badge> },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversion', header: 'Conversion' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'roas', header: 'ROAS' },
                      { key: 'searchVolume', header: 'Search Volume', render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge> },
                      { key: 'competitive', header: 'Competitive', render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge> },
                    ]}
                    data={[
                      { category: 'Food & Beverages > Coffee & Tea', level: 'Level 2', impressions: '456,789', clicks: '12,345', avgCPC: '€0.35', ctr: '2.7%', conversion: '1.9%', sales: '€5,678', budget: '€300', spent: '€278', budgetLeft: '€22', roas: '3.2x', searchVolume: 'High', competitive: 'Medium' },
                      { category: 'Food & Beverages > Snacks', level: 'Level 2', impressions: '234,567', clicks: '6,789', avgCPC: '€0.41', ctr: '2.9%', conversion: '1.6%', sales: '€3,456', budget: '€200', spent: '€189', budgetLeft: '€11', roas: '2.8x', searchVolume: 'Medium', competitive: 'High' },
                      { category: 'Organic Products', level: 'Level 1', impressions: '345,678', clicks: '8,912', avgCPC: '€0.33', ctr: '2.6%', conversion: '2.1%', sales: '€4,567', budget: '€250', spent: '€234', budgetLeft: '€16', roas: '3.5x', searchVolume: 'Medium', competitive: 'Low' },
                    ]}
                    rowKey={row => row.category}
                  />
                </div>
              ),
            },
            {
              label: 'Other',
              value: 'other',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Setting Type',
                        options: [
                          { label: 'Targeting', value: 'Targeting' },
                          { label: 'Bidding', value: 'Bidding' },
                          { label: 'Schedule', value: 'Schedule' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                      {
                        name: 'Status',
                        options: [
                          { label: 'Active', value: 'Active' },
                          { label: 'Inactive', value: 'Inactive' },
                        ],
                        selectedValues: [],
                        onChange: () => {},
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search settings..."
                  />
                  <Table
                    columns={[
                      { key: 'setting', header: 'Setting' },
                      { key: 'type', header: 'Type', render: row => <Badge variant="outline">{row.type}</Badge> },
                      { key: 'value', header: 'Value' },
                      { key: 'impressions', header: 'Impressions' },
                      { key: 'clicks', header: 'Clicks' },
                      { key: 'avgCPC', header: 'Avg CPC' },
                      { key: 'ctr', header: 'CTR' },
                      { key: 'conversion', header: 'Conversion' },
                      { key: 'sales', header: 'Sales' },
                      { key: 'budget', header: 'Budget' },
                      { key: 'spent', header: 'Spent' },
                      { key: 'budgetLeft', header: 'Budget Left' },
                      { key: 'roas', header: 'ROAS' },
                      { key: 'status', header: 'Status', render: row => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge> },
                    ]}
                    data={[
                      { setting: 'Age: 25-54', type: 'Targeting', value: 'Included', impressions: '567,890', clicks: '14,567', avgCPC: '€0.36', ctr: '2.6%', conversion: '1.8%', sales: '€6,789', budget: '€400', spent: '€387', budgetLeft: '€13', roas: '3.1x', status: 'Active' },
                      { setting: 'Gender: All', type: 'Targeting', value: 'Included', impressions: '456,789', clicks: '11,234', avgCPC: '€0.39', ctr: '2.5%', conversion: '1.7%', sales: '€5,234', budget: '€300', spent: '€289', budgetLeft: '€11', roas: '2.9x', status: 'Active' },
                      { setting: 'Schedule: Weekdays 9-17', type: 'Schedule', value: 'Active', impressions: '234,567', clicks: '6,789', avgCPC: '€0.34', ctr: '2.9%', conversion: '2.0%', sales: '€3,456', budget: '€200', spent: '€192', budgetLeft: '€8', roas: '3.4x', status: 'Active' },
                    ]}
                    rowKey={row => row.setting}
                  />
                </div>
              ),
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
                          { label: 'Line Item Added', value: 'Line Item Added' },
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
          ]}
          action={
            activeTab === 'products' ? (
              <Button>Add product</Button>
            ) : activeTab === 'keywords' ? (
              <Button>Add keyword</Button>
            ) : activeTab === 'categories' ? (
              <Button>Add categories</Button>
            ) : activeTab === 'other' ? (
              <Button>Add other</Button>
            ) : null
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
      </MenuContextProvider>
    );
  },
}; 