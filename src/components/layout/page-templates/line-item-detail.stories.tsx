import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FormSection } from '../../ui/form-section';
import { Input } from '../../ui/input';
import { SearchInput } from '../../ui/search-input';
import { DatePicker, DateRangePicker } from '../../ui/date-picker';
import type { DateRange } from 'react-day-picker';
import { Table } from '@/components/ui/table';
import { Button } from '../../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { SummaryCard } from '@/components/ui/summary-card';
import { FilterBar } from '../../ui/filter-bar';
import { Filter } from '../../ui/filter';
import { DialogFooter } from '../../ui/dialog';
import { Minus, Store, ScanBarcode, LayoutDashboard, Calendar, MapPin, Download, Upload, ChevronDown, Search, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Switch } from '../../ui/switch';
import { format } from 'date-fns';
import { defaultRoutes } from '../default-routes';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { cn } from '@/lib/utils';
import { CalendarTable } from '../../ui/calendar-table';
import { MetricRow } from '@/components/ui/metric-row';
import { getPropositionMetrics } from '@/lib/proposition-metrics';
import type { MetricDefinition } from '@/components/ui/metric-row';
import { PropositionIcon } from '@/components/ui/proposition-icon';

// --- Shared campaign metrics per proposition type ---
// These mirror the campaign-level metrics so users see consistent data when navigating from campaign → booking

const displayMetrics: MetricDefinition[] = [
  { key: 'adSpend', label: 'Ad Spend', value: '€8,120', subMetric: 'Budget: €15,000', badgeValue: '+10%', badgeVariant: 'success' },
  { key: 'impressions', label: 'Impressions', value: '945,230', subMetric: 'Unique: 620K', badgeValue: '+7%', badgeVariant: 'success' },
  { key: 'clicks', label: 'Clicks', value: '12,340', subMetric: 'Add to Carts: 1,845', badgeValue: '+9%', badgeVariant: 'success' },
  { key: 'ctr', label: 'CTR', value: '1.31%', subMetric: 'Clicks / Impressions', badgeValue: '+3%', badgeVariant: 'success' },
  { key: 'cpc', label: 'CPC', value: '€0.66', subMetric: 'Ad Spend / Clicks', badgeValue: '-5%', badgeVariant: 'success' },
  { key: 'cpm', label: 'CPM', value: '€8.59', subMetric: 'Cost per 1,000 impressions', badgeValue: '-2%', badgeVariant: 'success' },
  { key: 'onlineSkuRevenue', label: 'Online SKU Revenue', value: '€18,450', subMetric: '28-day attribution', badgeValue: '+18%', badgeVariant: 'success' },
  { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '€24,680', subMetric: '28-day attribution', badgeValue: '+15%', badgeVariant: 'success' },
  { key: 'roas', label: 'ROAS', value: '3.04x', subMetric: 'Revenue / Ad Spend', badgeValue: '+12%', badgeVariant: 'success' },
];

const digitalInstoreMetrics: MetricDefinition[] = [
  { key: 'repetitions', label: 'Repetitions', value: '1,245,890', subMetric: 'CTR: 2.14%', badgeValue: '+8%', badgeVariant: 'success' },
  { key: 'stores', label: 'Stores', value: '128', subMetric: 'Coverage: 74%', badgeValue: '0%', badgeVariant: 'secondary' },
  { key: 'reach', label: 'Reach', value: '680K', subMetric: 'Unique shoppers', badgeValue: '+12%', badgeVariant: 'success' },
  { key: 'roas', label: 'ROAS', value: '1.92x', subMetric: 'AOV: €42.30', badgeValue: '+5%', badgeVariant: 'success' },
  { key: 'adSpend', label: 'Ad Spend', value: '€4,250', subMetric: 'Budget: €8,000', badgeValue: '+6%', badgeVariant: 'success' },
  { key: 'cpm', label: 'CPM', value: '€3.41', subMetric: 'Cost per 1,000 repetitions', badgeValue: '-3%', badgeVariant: 'success' },
  { key: 'instoreSkuRevenue', label: 'In-store SKU Revenue', value: '€8,160', subMetric: '28-day attribution', badgeValue: '+14%', badgeVariant: 'success' },
  { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '€10,240', subMetric: '28-day attribution', badgeValue: '+11%', badgeVariant: 'success' },
];

const offlineInstoreMetrics: MetricDefinition[] = [
  { key: 'adSpend', label: 'Ad Spend', value: '€6,480', subMetric: 'Budget: €12,000', badgeValue: '+12%', badgeVariant: 'success' },
  { key: 'impressions', label: 'Impressions', value: '425,600', subMetric: 'Unique: 280K', badgeValue: '+6%', badgeVariant: 'success' },
  { key: 'stores', label: 'Stores', value: '86', subMetric: 'Coverage: 62%', badgeValue: '+4%', badgeVariant: 'success' },
  { key: 'ctr', label: 'CTR', value: '1.31%', subMetric: 'Clicks / Impressions', badgeValue: '+3%', badgeVariant: 'success' },
  { key: 'cpm', label: 'CPM', value: '€15.23', subMetric: 'Cost per 1,000 impressions', badgeValue: '-2%', badgeVariant: 'success' },
  { key: 'instoreSkuRevenue', label: 'In-store SKU Revenue', value: '€12,480', subMetric: '28-day attribution', badgeValue: '+22%', badgeVariant: 'success' },
  { key: 'instoreSkuUnits', label: 'In-store SKU Units', value: '1,245', subMetric: '28-day attribution', badgeValue: '+16%', badgeVariant: 'success' },
  { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '€18,960', subMetric: '28-day attribution', badgeValue: '+20%', badgeVariant: 'success' },
  { key: 'roas', label: 'ROAS', value: '2.93x', subMetric: 'Revenue / Ad Spend', badgeValue: '+8%', badgeVariant: 'success' },
];

const offsiteDisplayMetrics: MetricDefinition[] = [
  { key: 'adSpend', label: 'Ad Spend', value: '$12,350', subMetric: 'Budget: $20,000', badgeValue: '+15%', badgeVariant: 'success' },
  { key: 'impressions', label: 'Impressions', value: '1,835,331', subMetric: 'Unique: 980K', badgeValue: '+18%', badgeVariant: 'success' },
  { key: 'clicks', label: 'Clicks + Add to Carts', value: '28,349', subMetric: 'Add to Carts: 3,544', badgeValue: '+12%', badgeVariant: 'success' },
  { key: 'ctr', label: 'CTR', value: '1.54%', subMetric: 'Clicks / Impressions', badgeValue: '+20%', badgeVariant: 'success' },
  { key: 'cpc', label: 'CPC', value: '$0.44', subMetric: 'Ad Spend / Clicks', badgeValue: '-8%', badgeVariant: 'success' },
  { key: 'cpm', label: 'CPM', value: '$9.34', subMetric: 'Cost per 1,000 impressions', badgeValue: '-6%', badgeVariant: 'success' },
  { key: 'ecpm', label: 'eCPM', value: '$6.73', subMetric: 'Spend / Impressions × 1,000', badgeValue: '-4%', badgeVariant: 'success' },
  { key: 'onlineSkuRevenue', label: 'Online SKU Revenue', value: '$31,234', subMetric: '14-day attribution', badgeValue: '+22%', badgeVariant: 'success' },
  { key: 'instoreSkuRevenue', label: 'In-store SKU Revenue', value: '$22,326', subMetric: '14-day attribution', badgeValue: '+19%', badgeVariant: 'success' },
  { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '$53,560', subMetric: '14-day attribution', badgeValue: '+21%', badgeVariant: 'success' },
];

const sponsoredProductsMetrics: MetricDefinition[] = [
  { key: 'adSpend', label: 'Ad Spend', value: '€10,890', subMetric: 'Budget: €20,000', badgeValue: '+14%', badgeVariant: 'success' },
  { key: 'impressions', label: 'Impressions', value: '2,145,670', subMetric: 'Unique: 1.4M', badgeValue: '+9%', badgeVariant: 'success' },
  { key: 'clicks', label: 'Clicks', value: '38,920', subMetric: 'Add to Carts: 8,456', badgeValue: '+11%', badgeVariant: 'success' },
  { key: 'ctr', label: 'CTR', value: '1.81%', subMetric: 'Clicks / Impressions', badgeValue: '+5%', badgeVariant: 'success' },
  { key: 'cpc', label: 'CPC', value: '€0.28', subMetric: 'Ad Spend / Clicks', badgeValue: '-8%', badgeVariant: 'success' },
  { key: 'onlineSkuRevenue', label: 'Online SKU Revenue', value: '€42,680', subMetric: '28-day attribution', badgeValue: '+18%', badgeVariant: 'success' },
  { key: 'onlineSkuUnits', label: 'Online SKU Units', value: '3,456', subMetric: '28-day attribution', badgeValue: '+14%', badgeVariant: 'success' },
  { key: 'totalSkuRevenue', label: 'Total SKU Revenue', value: '€52,340', subMetric: '28-day attribution', badgeValue: '+20%', badgeVariant: 'success' },
  { key: 'roas', label: 'ROAS', value: '4.81x', subMetric: 'Revenue / Ad Spend', badgeValue: '+18%', badgeVariant: 'success' },
];

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Booking Detail',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Booking Detail Page Template

The Booking Detail page template provides comprehensive forms for creating and editing bookings across different campaign types. It features placement search, date pickers, creative linking, and real-time summary cards.

## Features

- **Multi-Variant Support**: Different forms for Display, Digital In-Store, Offline In-Store, and Sponsored Products
- **Placement Search**: SearchInput component with dropdown results for store/placement selection
- **Date Pickers**: DatePicker components for start and end date selection
- **Creative Linking**: Advanced dialog for linking bookings to creatives with filtering and search
- **Real-time Summary**: Live sidebar updates showing booking, placement, and creative details
- **Responsive Design**: Two-column layout that adapts to screen size

## Form Structure

### Booking Details Section
- **Name**: Required field for booking name

### Placement Section
- **Find Placement**: SearchInput with dropdown results
- **Search Results**: Shows store name, type, location, and category
- **Real-time Filtering**: Filters placements based on name and location

### Run Time Section
- **Campaign Runtime**: Displays preset campaign dates
- **Start Date**: DatePicker for booking start date
- **End Date**: DatePicker for booking end date
- **Date Validation**: Proper date handling with dd/MM/yyyy format

### Target Section
- **Targeting Criteria**: Interface for adding targeting parameters
- **Target Management**: Add and manage targeting rules

### Creatives Section
- **Link Dialog**: Advanced filtering by Format and Status
- **Search**: Real-time search across creative names
- **Management Table**: View and remove linked creatives
- **Row Actions**: Click to navigate to creative details

## Placement Search

The placement search provides:
- **Real-time Results**: Shows filtered placements as you type
- **Store Information**: Name, type, location, and category
- **Selection**: Click to select a placement
- **Visual Feedback**: Dropdown with proper styling

Example placement results:
- Albert Heijn Amsterdam Central (Store • Amsterdam • Grocery)
- Albert Heijn Rotterdam Center (Store • Rotterdam • Grocery)

## Date Management

- **DatePicker Integration**: Uses proper date picker components
- **Campaign Presets**: Shows campaign runtime as reference
- **Date Formatting**: Displays dates in dd/MM/yyyy format
- **Validation**: Ensures proper date selection

## Creative Linking

### Filter Options
- **Format**: Filter by creative format (Banner, Video, Digital Signage, etc.)
- **Status**: Filter by approval status (Approved, Pending, Draft, Rejected)

### Creative Management
- **Link Dialog**: Modal interface for creative selection
- **Search**: Real-time search across creative names
- **Removal**: Easy removal of linked creatives
- **Navigation**: Click creative rows to view details

## Variants

### Display Bookings
- Standard display advertising bookings
- Focus on digital placements and targeting

### Digital In-Store Bookings
- In-store digital advertising bookings
- Store-specific placement selection

### Offline In-Store Bookings
- Physical in-store advertising bookings
- Store location and material placement

### Sponsored Products Bookings
- Product-specific advertising bookings
- Product catalog integration

## Business Rules

1. **Name Required**: Booking name is mandatory
2. **Placement Selection**: Must select a placement for activation
3. **Date Validation**: Start date must be before end date
4. **Creative Linking**: Bookings can be linked to multiple creatives
5. **Real-time Updates**: Sidebar updates immediately when form fields change

## Sidebar Information

### Booking Summary
- Booking name
- Selected placement information
- Runtime dates (formatted)

### Creatives Summary
- Shows relationship between booking and creatives
- Displays creative names and formats
- Shows linked/unlinked status

### Campaign Details
- Campaign name, PO number, advertiser
- Brand, goal, budget, runtime

## Usage

This template is ideal for:
- Booking creation and editing
- Campaign planning and management
- Placement and targeting configuration
- Creative-booking relationship management

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- FormSection (organized form layouts)
- Input (text inputs)
- SearchInput (placement search with dropdown)
- DatePicker (date selection with calendar)
- Dialog (creative linking modal)
- FilterBar (advanced filtering in dialog)
- Table (creative management)
- Button (actions and navigation)
- CardSummary (sidebar information cards)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


// Mock data for creatives (opposite of bookings)
const mockCreatives = [
  { id: 1, name: 'Summer Banner', format: 'Banner', status: 'Approved', type: 'Display' },
  { id: 2, name: 'Holiday Video', format: 'Video', status: 'Pending', type: 'Display' },
  { id: 3, name: 'Store Signage', format: 'Digital Signage', status: 'Approved', type: 'Digital In-Store' },
];

// Mock data for placement search results - 3 packages per zone
const zones = [
  'No zone',
  'Zuivel',
  'Vers',
  'Vlees & Vega',
  'Diepvries',
  'Worldfoods',
  'Maaltijdtoevoegingen',
  'Noten, toast, chips etc.',
  'Zoetwaren',
  'Ontbijt',
  'Non Food',
  'To Go'
];

const packages = ['Small', 'Medium', 'Large'];

const adSpaces = {
  'Small': 'Wobbler',
  'Medium': 'Wobbler, VSB (mini & large), Vloersticker, Koeldeursticker, Makelaarsbord',
  'Large': 'Wobbler, VSB (mini & large), Vloersticker, Koeldeursticker, Makelaarsbord'
};

const mockPlacements = zones.flatMap((zone, zoneIndex) => 
  packages.map((pkg, pkgIndex) => ({
    id: zoneIndex * 3 + pkgIndex + 1,
    name: `${zone} - ${pkg} Package`,
    type: pkg,
    location: zone,
    category: 'In-Store Placement',
    adSpaces: adSpaces[pkg as keyof typeof adSpaces]
  }))
);

// Shared component for campaign details sidebar
const CampaignDetailsSidebar = () => (
  <SummaryCard
    title="Campaign details"
    variant="details"
    items={[
      { label: 'Campaign name', value: 'Campaign AH ..' },
      { label: 'PO Number', value: 'PO-123456' },
      { label: 'Advertiser', value: 'Acme Media' },
      { label: 'Brand', value: 'Knorr' },
      { label: 'Goal', value: 'Awareness' },
      { label: 'Budget', value: '€10,000' },
      { label: 'Runtime', value: '01 Aug, 2024 - 30 Aug, 2024' },
    ]}
  />
);

// Shared component for creative linking dialog
const CreativeLinkingDialog = ({ selectedCreatives, onSelectionChange }: { 
  selectedCreatives: any[], 
  onSelectionChange: (items: any[]) => void 
}) => {
  const [formatFilter, setFormatFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  const [localSelection, setLocalSelection] = React.useState<any[]>(selectedCreatives);

  React.useEffect(() => {
    setLocalSelection(selectedCreatives);
  }, [selectedCreatives]);

  const formats = Array.from(new Set(mockCreatives.map(item => item.format)));
  const statuses = Array.from(new Set(mockCreatives.map(item => item.status)));

  const filteredCreatives = mockCreatives.filter(item => {
    const formatMatch = formatFilter.length === 0 || formatFilter.includes(item.format);
    const statusMatch = statusFilter.length === 0 || statusFilter.includes(item.status);
    const searchMatch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
    return formatMatch && statusMatch && searchMatch;
  });

  const handleSave = () => {
    onSelectionChange(localSelection);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">Link creatives</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Link creatives</DialogTitle>
          <DialogDescription>Select creatives to link to this booking.</DialogDescription>
        </DialogHeader>
        
        <FilterBar
          filters={[
            {
              name: 'Format',
              options: formats.map(format => ({ label: format, value: format })),
              selectedValues: formatFilter,
              onChange: setFormatFilter,
            },
            {
              name: 'Status',
              options: statuses.map(status => ({ label: status, value: status })),
              selectedValues: statusFilter,
              onChange: setStatusFilter,
            },
          ]}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name"
        />
        
        <div className="overflow-x-auto">
          <Table
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'format', header: 'Format' },
              { key: 'status', header: 'Status' },
              { key: 'type', header: 'Type' },
            ]}
            data={filteredCreatives}
            rowKey={row => row.id}
            rowSelection={{
              selectedKeys: localSelection.map(row => row.id),
              onChange: (keys) => {
                setLocalSelection(filteredCreatives.filter(row => keys.includes(row.id)));
              },
              getKey: row => row.id,
            }}
            onRowClick={(row) => window.location.href = `/campaigns/digital-instore/creative/${row.id}`}
            hideActions
          />
        </div>
        
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="button" onClick={handleSave}>Save</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Display Booking Detail Story
export const Display: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    // Section open/closed state
    const [section1Open, setSection1Open] = React.useState(true);
    const [section2Open, setSection2Open] = React.useState(true);
    const [section3Open, setSection3Open] = React.useState(true);
    const [section4Open, setSection4Open] = React.useState(true);
    const [section5Open, setSection5Open] = React.useState(true);

    // Booking template tabs — split the form into three areas:
    // 1. Booking details (run-time, schedule, active days, position)
    // 2. Targeting (audience targets + delivery behaviour + objectives + pricing)
    // 3. Creatives (link / upload creatives — placeholder for now)
    const [bookingTab, setBookingTab] = React.useState<'details' | 'targeting' | 'creatives' | 'evaluation' | 'logs'>('details');
    const bookingLogData = [
      { id: 'BLOG-001', timestamp: '12/10/2024 14:30', user: 'Jane Doe', action: 'Booking Created', field: 'Booking', oldValue: '-', newValue: 'LI-001' },
      { id: 'BLOG-002', timestamp: '12/10/2024 15:05', user: 'John Smith', action: 'Budget Updated', field: 'Budget', oldValue: '€2,000', newValue: '€3,750' },
      { id: 'BLOG-003', timestamp: '12/11/2024 09:18', user: 'Sarah Wilson', action: 'Creative Linked', field: 'Creatives', oldValue: '-', newValue: 'CR-001' },
      { id: 'BLOG-004', timestamp: '12/11/2024 11:42', user: 'Jane Doe', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option' },
      { id: 'BLOG-005', timestamp: '12/12/2024 08:27', user: 'Mike Johnson', action: 'Run time Modified', field: 'End date', oldValue: '2024-08-25', newValue: '2024-08-30' },
    ];
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);
    const [logSearch, setLogSearch] = React.useState('');
    const [evaluationEnabled, setEvaluationEnabled] = React.useState(false);
    const [evaluationId, setEvaluationId] = React.useState('');

    // Booking setup
    const [bookingName, setBookingName] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = React.useState('00:00');
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [endTime, setEndTime] = React.useState('23:59');
    const [activeDays, setActiveDays] = React.useState(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
    const [activeDaysOpen, setActiveDaysOpen] = React.useState(true);
    const [positionOpen, setPositionOpen] = React.useState(true);
    const [positionTab, setPositionTab] = React.useState<'channels' | 'positions'>('positions');
    const [positionSearch, setPositionSearch] = React.useState('');

    // Targeting
    const [targetMode, setTargetMode] = React.useState<'inclusive' | 'exclusive'>('inclusive');
    const [targetKeywordType, setTargetKeywordType] = React.useState('Search Keyword');
    const [targetValue, setTargetValue] = React.useState('');

    // Delivery behavior
    const [optimizeForCPC, setOptimizeForCPC] = React.useState(false);
    const [userFrequencyCap, setUserFrequencyCap] = React.useState(false);
    const [deliveryMethod, setDeliveryMethod] = React.useState('Account setting');
    const [exclusivity, setExclusivity] = React.useState(false);

    // Delivery objectives
    const [priorityOverride, setPriorityOverride] = React.useState(false);
    const [reachOverride, setReachOverride] = React.useState(false);
    const [deliveryLimit, setDeliveryLimit] = React.useState(false);

    // Pricing
    const [pricingModel, setPricingModel] = React.useState(false);
    const [competeWithRTB, setCompeteWithRTB] = React.useState(false);

    const dayLabels = [
      { id: 'mo', label: 'Mo' },
      { id: 'tu', label: 'Tu' },
      { id: 'we', label: 'We' },
      { id: 'th', label: 'Th' },
      { id: 'fr', label: 'Fr' },
      { id: 'sa', label: 'Sa' },
      { id: 'su', label: 'Su' },
    ];

    const toggleDay = (id: string) => {
      setActiveDays(prev =>
        prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
      );
    };

    // Reusable section header
    const SectionHeader = ({ number, title, open, onToggle }: { number: number; title: string; open: boolean; onToggle: () => void }) => (
      <button
        className="w-full flex items-center justify-between p-6 text-left"
        onClick={onToggle}
      >
        <span className="font-semibold text-base">{number}. {title}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
    );

    // Reusable sub-section header (within a section)
    const SubSectionHeader = ({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) => (
      <button
        className="w-full flex items-center justify-between py-3 text-left border-t"
        onClick={onToggle}
      >
        <span className="font-semibold text-sm">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
    );

    // Toggle row (used in delivery behavior / objectives / pricing)
    const ToggleRow = ({ label, checked, onCheckedChange, info, rightText }: {
      label: string; checked: boolean; onCheckedChange: (v: boolean) => void; info?: boolean; rightText?: string;
    }) => (
      <div className="flex items-center justify-between py-2">
        <span className="font-medium text-sm">{label}</span>
        <div className="flex items-center gap-3">
          {info && (
            <div className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground cursor-help select-none">i</div>
          )}
          {rightText && <span className="text-sm text-muted-foreground">{rightText}</span>}
          <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
      </div>
    );

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Booking Detail',
          titleIcon: <PropositionIcon engineType="display" />,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
            headerRight: null,
          }}
        >
          <div className="mb-3">
            <MetricRow
              metrics={getPropositionMetrics('display', 'booking')}
              maxVisible={5}
              defaultVariant="default"
              removable={false}
              bleedEdges
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">

              {/* Tabs + outer card pair (no gap between them — the tab visually attaches to the card top) */}
              <div>
              {/* Tabs: split the form into Booking details / Targeting / Creatives */}
              <div className="flex gap-0" role="tablist">
                {[
                  { value: 'details',    label: 'Booking details' },
                  { value: 'targeting',  label: 'Targeting' },
                  { value: 'creatives',  label: 'Creatives' },
                  { value: 'evaluation', label: 'Evaluation' },
                  { value: 'logs', label: 'Logs' },
                ].map((t) => (
                  <button
                    key={t.value}
                    role="tab"
                    aria-selected={bookingTab === t.value}
                    onClick={() => setBookingTab(t.value as typeof bookingTab)}
                    className={cn(
                      'px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors',
                      bookingTab === t.value
                        ? 'font-medium bg-white text-card-foreground border-border z-10'
                        : 'font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground',
                    )}
                    style={{ position: 'relative', top: '1px' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Single outer card — the tab bar above visually attaches here */}
              <div
                className={cn(
                  'rounded-xl border bg-white',
                  bookingTab === 'details' && 'rounded-tl-none',
                )}
              >

              {/* 1. Booking setup — Booking details tab */}
              <div className={cn(bookingTab !== 'details' && 'hidden')}>
                <SectionHeader number={1} title="Booking setup" open={section1Open} onToggle={() => setSection1Open(v => !v)} />
                {section1Open && (
                  <div className="px-6 pb-6 space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Booking name <span className="text-destructive">*</span></label>
                      <Input
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder=""
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Evaluation ID</label>
                      <Input placeholder="Enter evaluation ID" className="w-full" />
                    </div>

                    <div className="space-y-4">
                      <div className="font-semibold text-sm">Schedule</div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1 flex items-center gap-1">
                            Start date and time
                            <span className="inline-block w-4 h-4 rounded-full bg-amber-100 text-amber-600 text-[10px] flex items-center justify-center font-bold">!</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <DatePicker
                              date={startDate}
                              onDateChange={setStartDate}
                              placeholder="MM/DD/YYYY"
                              className="w-full"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                              </span>
                              <Input
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="pl-9"
                                placeholder="00:00"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">End date and time</label>
                          <div className="grid grid-cols-2 gap-3">
                            <DatePicker
                              date={endDate}
                              onDateChange={setEndDate}
                              placeholder="MM/DD/YYYY"
                              className="w-full"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                              </span>
                              <Input
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="pl-9"
                                placeholder="23:59"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active days sub-section */}
                    <div>
                      <SubSectionHeader title="Active days" open={activeDaysOpen} onToggle={() => setActiveDaysOpen(v => !v)} />
                      {activeDaysOpen && (
                        <div className="pt-4 space-y-3">
                          <div className="flex gap-2">
                            {dayLabels.map(day => (
                              <button
                                key={day.id}
                                onClick={() => toggleDay(day.id)}
                                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors border ${
                                  activeDays.includes(day.id)
                                    ? 'bg-background border-primary text-foreground'
                                    : 'bg-background border-input text-muted-foreground hover:border-muted-foreground/50'
                                }`}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <button className="text-primary hover:underline" onClick={() => setActiveDays(['sa', 'su'])}>Weekend</button>
                            <span className="text-muted-foreground">·</span>
                            <button className="text-primary hover:underline" onClick={() => setActiveDays(['mo', 'tu', 'we', 'th', 'fr'])}>Weekdays</button>
                            <span className="text-muted-foreground">·</span>
                            <button className="text-primary hover:underline" onClick={() => setActiveDays(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'])}>All</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Position sub-section */}
                    <div>
                      <SubSectionHeader title="Position" open={positionOpen} onToggle={() => setPositionOpen(v => !v)} />
                      {positionOpen && (
                        <div className="pt-4 space-y-3">
                          <div className="flex rounded-lg bg-muted p-1 w-fit gap-1">
                            {(['channels', 'positions'] as const).map(tab => (
                              <button
                                key={tab}
                                onClick={() => setPositionTab(tab)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                                  positionTab === tab
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                              </button>
                            ))}
                          </div>
                          <SearchInput
                            value={positionSearch}
                            onChange={(e) => setPositionSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Targeting — Targeting tab */}
              <div className={cn(bookingTab !== 'targeting' && 'hidden')}>
                <SectionHeader number={2} title="Targeting" open={section2Open} onToggle={() => setSection2Open(v => !v)} />
                {section2Open && (
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="font-semibold text-sm">Targets</div>
                      <div className="flex items-center justify-between">
                        <div className="flex rounded-lg bg-muted p-1 gap-1">
                          {(['inclusive', 'exclusive'] as const).map(mode => (
                            <button
                              key={mode}
                              onClick={() => setTargetMode(mode)}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                                targetMode === mode
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download template
                          </Button>
                          <Button size="sm">
                            <Upload className="w-4 h-4 mr-1" />
                            Upload CSV
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-1 min-w-[140px] justify-between">
                              {targetKeywordType}
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {['Search Keyword', 'Product ID', 'Category', 'Brand'].map(opt => (
                              <DropdownMenuItem key={opt} onClick={() => setTargetKeywordType(opt)}>{opt}</DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex-1 flex items-center justify-between">
                              <span className="text-muted-foreground">{targetValue || 'Select target'}</span>
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            {['Beverages', 'Snacks', 'Dairy', 'Frozen foods', 'Health & Beauty'].map(opt => (
                              <DropdownMenuItem key={opt} onClick={() => setTargetValue(opt)}>{opt}</DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Delivery behavior — Targeting tab */}
              <div className={cn(bookingTab !== 'targeting' && 'hidden')}>
                <SectionHeader number={3} title="Delivery behavior" open={section3Open} onToggle={() => setSection3Open(v => !v)} />
                {section3Open && (
                  <div className="px-6 pb-6 space-y-3">
                    <ToggleRow label="Optimize for CPC" checked={optimizeForCPC} onCheckedChange={setOptimizeForCPC} info />
                    <ToggleRow label="User frequency cap" checked={userFrequencyCap} onCheckedChange={setUserFrequencyCap} info />
                    <div className="space-y-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Delivery method</span>
                        <div className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground cursor-help select-none">i</div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full flex items-center justify-between">
                            {deliveryMethod}
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {['Account setting', 'Frontloaded', 'Even', 'ASAP'].map(opt => (
                            <DropdownMenuItem key={opt} onClick={() => setDeliveryMethod(opt)}>{opt}</DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <p className="text-xs text-muted-foreground">
                        Follows the default setting that is configured for your account (Frontloaded).
                      </p>
                    </div>
                    <ToggleRow label="Exclusivity" checked={exclusivity} onCheckedChange={setExclusivity} />
                  </div>
                )}
              </div>

              {/* 4. Delivery objectives — Targeting tab */}
              <div className={cn(bookingTab !== 'targeting' && 'hidden')}>
                <SectionHeader number={4} title="Delivery objectives" open={section4Open} onToggle={() => setSection4Open(v => !v)} />
                {section4Open && (
                  <div className="px-6 pb-6 space-y-3">
                    <ToggleRow label="Priority" checked={priorityOverride} onCheckedChange={setPriorityOverride} rightText="Inherited from campaign: Highest" />
                    <ToggleRow label="Reach" checked={reachOverride} onCheckedChange={setReachOverride} />
                    <ToggleRow label="Delivery limit" checked={deliveryLimit} onCheckedChange={setDeliveryLimit} />
                  </div>
                )}
              </div>

              {/* 5. Pricing — Targeting tab */}
              <div className={cn(bookingTab !== 'targeting' && 'hidden')}>
                <SectionHeader number={5} title="Pricing" open={section5Open} onToggle={() => setSection5Open(v => !v)} />
                {section5Open && (
                  <div className="px-6 pb-6 space-y-3">
                    <ToggleRow label="Pricing model" checked={pricingModel} onCheckedChange={setPricingModel} />
                    <ToggleRow label="Compete with RTB" checked={competeWithRTB} onCheckedChange={setCompeteWithRTB} />
                  </div>
                )}
              </div>

              {/* Creatives tab — placeholder pending wiring to /creatives/[type]/[id] */}
              <div className={cn(bookingTab !== 'creatives' && 'hidden')}>
                <div className="px-6 py-10 text-center">
                  <h3 className="text-base font-semibold text-foreground mb-1">Creatives</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Attach existing creatives or upload new ones for this booking.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline">Browse creatives</Button>
                    <Button><Upload className="w-4 h-4 mr-1" /> Upload creative</Button>
                  </div>
                </div>
              </div>


              {/* Logs tab */}
              <div className={cn(bookingTab !== 'logs' && 'hidden')}>
                <div className="px-6 py-6 space-y-6">
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
                  { label: 'Booking Created', value: 'Booking Created' },
                  { label: 'Budget Updated', value: 'Budget Updated' },
                  { label: 'Creative Linked', value: 'Creative Linked' },
                  { label: 'Status Changed', value: 'Status Changed' },
                  { label: 'Run time Modified', value: 'Run time Modified' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={logSearch}
                    onSearchChange={setLogSearch}
                    searchPlaceholder="Search logs..."
                  />
                  <div className="overflow-x-auto">
                    <Table
                      columns={[
                        { key: 'timestamp', header: 'Timestamp' },
                        { key: 'user', header: 'User' },
                        { key: 'action', header: 'Action', render: (row) => <Badge variant="outline">{row.action}</Badge> },
                        { key: 'field', header: 'Field' },
                        { key: 'oldValue', header: 'Old value' },
                        { key: 'newValue', header: 'New value' },
                      ]}
                      data={bookingLogData.filter((row) => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      const searchMatch =
                        logSearch === '' ||
                        Object.values(row).some((v) => String(v).toLowerCase().includes(logSearch.toLowerCase()));
                      return userMatch && actionMatch && searchMatch;
                    })}
                      rowKey={(row) => row.id}
                      hideActions
                    />
                  </div>
                </div>
              </div>

              {/* Booking evaluation tab */}
              <div className={cn(bookingTab !== 'evaluation' && 'hidden')}>
                <div className="px-6 py-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-muted-foreground">Add evaluation details for this booking once it runs.</p>
                    <Switch checked={evaluationEnabled} onCheckedChange={setEvaluationEnabled} />
                  </div>
                  {evaluationEnabled && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Evaluation ID</label>
                      <Input
                        value={evaluationId}
                        onChange={(e) => setEvaluationId(e.target.value)}
                        placeholder="e.g. holiday-2025-1A"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
              </div>
              {/* end single outer card */}
              </div>
              {/* end tabs+card wrapper */}

              <div className="flex gap-2 pb-6">
                <Button variant="outline">Cancel</Button>
                <Button>Submit for approval</Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <SummaryCard
                title="Booking"
                variant="details"
                items={[
                  ...(bookingName ? [{ label: 'Name', value: bookingName }] : []),
                  ...((startDate) ? [{ label: 'Start', value: `${format(startDate, 'dd/MM/yyyy')} ${startTime}` }] : []),
                  ...((endDate) ? [{ label: 'End', value: `${format(endDate, 'dd/MM/yyyy')} ${endTime}` }] : []),
                  ...(activeDays.length > 0 && activeDays.length < 7 ? [{ label: 'Active days', value: activeDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ') }] : []),
                  ...(targetValue ? [{ label: 'Target', value: `${targetMode === 'inclusive' ? '+ ' : '- '}${targetValue}` }] : []),
                  ...(deliveryMethod !== 'Account setting' ? [{ label: 'Delivery', value: deliveryMethod }] : []),
                ]}
              />
              <CampaignDetailsSidebar />
            </div>
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Digital In-Store Booking Detail Story
export const DigitalInStore: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    // Evaluation feature toggle — when on, reveals Evaluation ID, store list
    // corrections / exclusions (reusing the booking store dialog), and an A/B
    // clone action so AdOps can cluster this booking with related campaigns
    // in the evaluation environment.
    const [evaluationEnabled, setEvaluationEnabled] = React.useState(false);
    const [bookingTab, setBookingTab] = React.useState<'details' | 'targeting' | 'creatives' | 'evaluation' | 'logs'>('details');
    const bookingLogData = [
      { id: 'BLOG-001', timestamp: '12/10/2024 14:30', user: 'Jane Doe', action: 'Booking Created', field: 'Booking', oldValue: '-', newValue: 'LI-001' },
      { id: 'BLOG-002', timestamp: '12/10/2024 15:05', user: 'John Smith', action: 'Budget Updated', field: 'Budget', oldValue: '€2,000', newValue: '€3,750' },
      { id: 'BLOG-003', timestamp: '12/11/2024 09:18', user: 'Sarah Wilson', action: 'Creative Linked', field: 'Creatives', oldValue: '-', newValue: 'CR-001' },
      { id: 'BLOG-004', timestamp: '12/11/2024 11:42', user: 'Jane Doe', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option' },
      { id: 'BLOG-005', timestamp: '12/12/2024 08:27', user: 'Mike Johnson', action: 'Run time Modified', field: 'End date', oldValue: '2024-08-25', newValue: '2024-08-30' },
    ];
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);
    const [logSearch, setLogSearch] = React.useState('');
    const [evaluationId, setEvaluationId] = React.useState('');
    // Booking store selection (ported from Offline in-store)
    const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>(['AH001', 'AH002', 'AH003']);
    const [storeSelectionMode, setStoreSelectionMode] = React.useState<'random' | 'custom' | null>(null);
    const [showSelectedStoresDialog, setShowSelectedStoresDialog] = React.useState(false);
    // Evaluation store pickers — reuse the same dialog pattern, separate state
    const [correctedStoreIds, setCorrectedStoreIds] = React.useState<string[]>([]);
    const [excludedStoreIds, setExcludedStoreIds] = React.useState<string[]>([]);
    const [showCorrectedStoresDialog, setShowCorrectedStoresDialog] = React.useState(false);
    const [showExcludedStoresDialog, setShowExcludedStoresDialog] = React.useState(false);
    const [abCloneCreated, setAbCloneCreated] = React.useState(false);

    // Stores list shared by the booking picker and the evaluation pickers
    const storesList = [
      { id: 'AH001', name: 'AH XL Amsterdam Centraal', type: 'AH XL', location: 'Amsterdam', reach: 12500, status: 'available' as const },
      { id: 'AH002', name: 'AH DNAH Rotterdam Zuid', type: 'AH DNAH', location: 'Rotterdam', reach: 11200, status: 'available' as const },
      { id: 'AH003', name: 'AH XL Utrecht Centraal', type: 'AH XL', location: 'Utrecht', reach: 10800, status: 'available' as const },
      { id: 'AH004', name: 'AH DNAH Den Haag Centrum', type: 'AH DNAH', location: 'Den Haag', reach: 9500, status: 'booked' as const },
      { id: 'AH005', name: 'AH XL Eindhoven Airport', type: 'AH XL', location: 'Eindhoven', reach: 8900, status: 'available' as const },
      { id: 'AH006', name: 'AH DNAH Groningen Grote Markt', type: 'AH DNAH', location: 'Groningen', reach: 7200, status: 'available' as const },
      { id: 'AH007', name: 'AH XL Maastricht Centrum', type: 'AH XL', location: 'Maastricht', reach: 8100, status: 'booked' as const },
      { id: 'AH008', name: 'AH DNAH Almere Stad', type: 'AH DNAH', location: 'Almere', reach: 9200, status: 'available' as const },
      { id: 'AH009', name: 'AH XL Tilburg Centrum', type: 'AH XL', location: 'Tilburg', reach: 8700, status: 'available' as const },
      { id: 'AH010', name: 'AH DNAH Breda Centrum', type: 'AH DNAH', location: 'Breda', reach: 7800, status: 'available' as const },
    ];

    const handleStoreSelection = (storeId: string, checked: boolean) => {
      setSelectedStoreIds(prev => checked ? [...prev, storeId] : prev.filter(id => id !== storeId));
    };
    const handleCorrectedStoreSelection = (storeId: string, checked: boolean) => {
      setCorrectedStoreIds(prev => checked ? [...prev, storeId] : prev.filter(id => id !== storeId));
    };
    const handleExcludedStoreSelection = (storeId: string, checked: boolean) => {
      setExcludedStoreIds(prev => checked ? [...prev, storeId] : prev.filter(id => id !== storeId));
    };

    // Filters shared across all store-selection dialogs in this variant
    const [storeFilterSearch, setStoreFilterSearch] = React.useState('');
    const [storeFilterTypes, setStoreFilterTypes] = React.useState<string[]>([]);
    const [storeFilterLocations, setStoreFilterLocations] = React.useState<string[]>([]);
    const storeTypeFilterOptions = Array.from(new Set(storesList.map(s => s.type))).map(t => ({ label: t, value: t }));
    const storeLocationFilterOptions = Array.from(new Set(storesList.map(s => s.location))).map(l => ({ label: l, value: l }));
    const filteredStoresList = storesList.filter(store => {
      if (storeFilterSearch && !store.name.toLowerCase().includes(storeFilterSearch.toLowerCase())) return false;
      if (storeFilterTypes.length > 0 && !storeFilterTypes.includes(store.type)) return false;
      if (storeFilterLocations.length > 0 && !storeFilterLocations.includes(store.location)) return false;
      return true;
    });

    // Location options for targeting
    const locationOptions = [
      { label: 'Amsterdam', value: 'amsterdam' },
      { label: 'Rotterdam', value: 'rotterdam' },
      { label: 'Den Haag', value: 'den-haag' },
      { label: 'Utrecht', value: 'utrecht' },
      { label: 'Eindhoven', value: 'eindhoven' }
    ];
    const [bookingName, setBookingName] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const dInstoreDateRange = React.useMemo<DateRange | undefined>(
      () => (startDate || endDate ? { from: startDate, to: endDate } : undefined),
      [startDate, endDate],
    );
    const setDInstoreDateRange = (range: DateRange | undefined) => {
      setStartDate(range?.from);
      setEndDate(range?.to);
    };
    const [dInstoreStartTime, setDInstoreStartTime] = React.useState('00:00');
    const [dInstoreEndTime, setDInstoreEndTime] = React.useState('23:59');
    const [dInstoreActiveDays, setDInstoreActiveDays] = React.useState<string[]>(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
    const toggleDInstoreDay = (id: string) =>
      setDInstoreActiveDays((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
    const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
    const dInstoreBrandOptions = [
      { label: 'Coca-Cola', value: 'coca-cola' },
      { label: 'Pepsi', value: 'pepsi' },
      { label: 'Red Bull', value: 'red-bull' },
      { label: 'Heineken', value: 'heineken' },
      { label: 'Knorr', value: 'knorr' },
      { label: 'Unilever', value: 'unilever' },
    ];
    const dayLabels: Array<{ id: string; label: string }> = [
      { id: 'mo', label: 'Mo' },
      { id: 'tu', label: 'Tu' },
      { id: 'we', label: 'We' },
      { id: 'th', label: 'Th' },
      { id: 'fr', label: 'Fr' },
      { id: 'sa', label: 'Sa' },
      { id: 'su', label: 'Su' },
    ];
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [storeAmount, setStoreAmount] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedStoreTypes, setSelectedStoreTypes] = React.useState<string[]>([]);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
    const [selectedInventory] = React.useState<string[]>([]); // Added to fix undefined reference

    // Retail products data
    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
      { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
      { id: '612816', name: 'Nike - air max 270 - size 42' },
      { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: 'Ben & Jerry\'s - cookie dough - 465ml' },
    ];

    // Target filter options (empty for non-OfflineInStore stories)
    const storeTypeOptions = [
      { label: 'AH XL', value: 'ah-xl' },
      { label: 'AH DNAH', value: 'ah-dnah' }
    ];


    const audienceOptions = [
      { label: 'Matig Stedelijk', value: 'matig-stedelijk' },
      { label: 'Zeer Stedelijk', value: 'zeer-stedelijk' },
      { label: 'Young adult', value: 'young-adult' },
      { label: 'Family with Kids', value: 'family-with-kids' },
      { label: 'Convenience stores', value: 'convenience-stores' },
      { label: 'Traditional stores', value: 'traditional-stores' }
    ];

    // Filter retail products based on search
    const filteredRetailProducts = retailProducts.filter(product => 
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    // Handle retail product selection
    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    // Handle retail product search change
    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    // Remove retail product
    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Brand multi-select — same search-and-pick pattern as retail products
    const [brandSearch, setBrandSearch] = React.useState('');
    const [showBrandResults, setShowBrandResults] = React.useState(false);
    const filteredBrands = dInstoreBrandOptions.filter(
      (b) =>
        b.label.toLowerCase().includes(brandSearch.toLowerCase()) &&
        !selectedBrands.includes(b.value),
    );
    const handleBrandSelect = (brand: { label: string; value: string }) => {
      if (!selectedBrands.includes(brand.value)) {
        setSelectedBrands([...selectedBrands, brand.value]);
      }
      setBrandSearch('');
      setShowBrandResults(false);
    };
    const removeBrand = (value: string) => {
      setSelectedBrands(selectedBrands.filter((v) => v !== value));
    };

    // Audience multi-select — same search-and-pick pattern as brands
    const [audienceSearch, setAudienceSearch] = React.useState('');
    const [showAudienceResults, setShowAudienceResults] = React.useState(false);
    const filteredAudiences = audienceOptions.filter(
      (a) =>
        a.label.toLowerCase().includes(audienceSearch.toLowerCase()) &&
        !selectedAudiences.includes(a.value),
    );
    const handleAudienceSelect = (audience: { label: string; value: string }) => {
      if (!selectedAudiences.includes(audience.value)) {
        setSelectedAudiences([...selectedAudiences, audience.value]);
      }
      setAudienceSearch('');
      setShowAudienceResults(false);
    };
    const removeAudience = (value: string) => {
      setSelectedAudiences(selectedAudiences.filter((v) => v !== value));
    };

    // Calculate estimated reach based on store amount (average reach per store: ~65)
    const calculateReach = (stores: string) => {
      const numStores = parseInt(stores);
      if (isNaN(numStores) || numStores <= 0) return 0;
      return Math.round(numStores * 65);
    };

    // Filter placements based on search and exclude already selected one
    const filteredPlacements = mockPlacements.filter(placement => 
      (placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.type.toLowerCase().includes(placementSearch.toLowerCase())) &&
      (!selectedPlacement || selectedPlacement.id !== placement.id)
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch('');
      setShowPlacementResults(false);
    };

    // Remove placement
    const removePlacement = () => {
      setSelectedPlacement(null);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    // Handle placement input click
    const handlePlacementClick = () => {
      setShowPlacementResults(true);
    };

    // Handle retail product input click
    const handleRetailProductClick = () => {
      setShowRetailProductResults(true);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowPlacementResults(false);
          setShowRetailProductResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{ 
          title: 'Booking Detail',
          titleIcon: <PropositionIcon engineType="digital-instore" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: null,
        }}
      >
        <div className="mb-3">
          <MetricRow
            metrics={getPropositionMetrics('digital-instore', 'booking')}
            maxVisible={5}
            defaultVariant="default"
            removable={false}
            bleedEdges
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-w-0">
                  <div className="flex gap-0" role="tablist">
                    {[
                      { value: 'details',    label: 'Booking details' },
                      { value: 'targeting',  label: 'Targeting' },
                      { value: 'creatives',  label: 'Creatives' },
                      { value: 'evaluation', label: 'Evaluation' },
                      { value: 'logs', label: 'Logs' },
                    ].map((t) => (
                      <button
                        key={t.value}
                        role="tab"
                        aria-selected={bookingTab === t.value}
                        onClick={() => setBookingTab(t.value as typeof bookingTab)}
                        className={cn(
                          'px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors',
                          bookingTab === t.value
                            ? 'font-medium bg-white text-card-foreground border-border z-10'
                            : 'font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground',
                        )}
                        style={{ position: 'relative', top: '1px' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <Card className={cn("min-w-0", bookingTab === 'details' && "rounded-tl-none")}>
                    <CardHeader className="[&>:not(.hidden)~:not(.hidden)]:mt-8">
<FormSection borderless title="Booking details" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input
                              value={bookingName}
                              onChange={(e) => setBookingName(e.target.value)}
                              placeholder="Enter booking name"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-4 min-w-0">
                            <div className="min-w-0 space-y-2">
                              <div className="relative" data-dropdown-container>
                                <label className="block text-sm font-medium mb-2">Brands</label>
                                <SearchInput
                                  value={brandSearch}
                                  onChange={(e) => {
                                    setBrandSearch(e.target.value);
                                    setShowBrandResults(true);
                                  }}
                                  onClick={() => setShowBrandResults(true)}
                                  placeholder="Search brands..."
                                  className="w-full"
                                />
                                {showBrandResults && (
                                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredBrands.length > 0 ? (
                                      filteredBrands.map((brand) => (
                                        <div
                                          key={brand.value}
                                          className="p-3 hover:bg-neutral-50 cursor-pointer border-b last:border-b-0"
                                          onClick={() => handleBrandSelect(brand)}
                                        >
                                          <div className="font-medium text-sm">{brand.label}</div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-3 text-center text-sm text-muted-foreground">No brands found</div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedBrands.length > 0 && (
                                <div className="space-y-1">
                                  {selectedBrands.map((value) => {
                                    const brand = dInstoreBrandOptions.find((b) => b.value === value);
                                    return brand ? (
                                      <div key={value} className="flex items-center justify-between bg-muted rounded-md p-2">
                                        <div className="text-sm font-medium">{brand.label}</div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeBrand(value)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 space-y-2">
                              <div className="relative" data-dropdown-container>
                                <label className="block text-sm font-medium mb-2">Retail products</label>
                                <SearchInput
                                  value={retailProductSearch}
                                  onChange={handleRetailProductSearchChange}
                                  onClick={handleRetailProductClick}
                                  placeholder="Search product by name or ID..."
                                  className="w-full"
                                  icon={<ScanBarcode className="w-4 h-4" />}
                                />
                                {showRetailProductResults && (
                                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredRetailProducts.length > 0 ? (
                                      filteredRetailProducts.map((product) => (
                                        <div
                                          key={product.id}
                                          className="p-3 hover:bg-neutral-50 cursor-pointer border-b last:border-b-0"
                                          onClick={() => handleRetailProductSelect(product)}
                                        >
                                          <div className="font-medium text-sm">{product.name}</div>
                                          <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-3 text-center text-sm text-muted-foreground">No products found</div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedRetailProducts.length > 0 && (
                                <div className="space-y-1">
                                  {selectedRetailProducts.map((productId) => {
                                    const product = retailProducts.find((p) => p.id === productId);
                                    return product ? (
                                      <div key={productId} className="flex items-center justify-between bg-muted rounded-md p-2">
                                        <div>
                                          <div className="text-sm font-medium">{product.name}</div>
                                          <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeRetailProduct(productId)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Placement" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              onClick={handlePlacementClick}
                              placeholder="Search for placement..." 
                              className="w-full"
                              icon={<LayoutDashboard className="w-4 h-4" />}
                            />
                            {showPlacementResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.length > 0 ? (
                                  filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-neutral-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {placement.adSpaces}
                                    </div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No placements found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {selectedPlacement && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected placement:</div>
                              <div className="flex items-center justify-between bg-muted rounded-md p-2">
                                <div>
                                  <div className="text-sm font-medium">{selectedPlacement.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {selectedPlacement.adSpaces}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={removePlacement}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                        </div>
                      </FormSection>

                      <FormSection borderless title="Run time" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="min-w-0">
                            <label className="block text-sm font-medium mb-2">Start &amp; end date*</label>
                            <DateRangePicker
                              dateRange={dInstoreDateRange}
                              onDateRangeChange={setDInstoreDateRange}
                              placeholder="Select date range"
                              className="w-full"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">Start time</label>
                              <Input
                                type="time"
                                value={dInstoreStartTime}
                                onChange={(e) => setDInstoreStartTime(e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">End time</label>
                              <Input
                                type="time"
                                value={dInstoreEndTime}
                                onChange={(e) => setDInstoreEndTime(e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <label className="block text-sm font-medium mb-2">Active days</label>
                            <div className="space-y-3">
                              <div className="flex gap-2 flex-wrap">
                                {dayLabels.map((day) => (
                                  <button
                                    key={day.id}
                                    type="button"
                                    onClick={() => toggleDInstoreDay(day.id)}
                                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors border ${
                                      dInstoreActiveDays.includes(day.id)
                                        ? 'bg-background border-primary text-foreground'
                                        : 'bg-background border-input text-muted-foreground hover:border-muted-foreground/50'
                                    }`}
                                  >
                                    {day.label}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <button type="button" className="text-primary hover:underline" onClick={() => setDInstoreActiveDays(['sa', 'su'])}>Weekend</button>
                                <span className="text-muted-foreground">·</span>
                                <button type="button" className="text-primary hover:underline" onClick={() => setDInstoreActiveDays(['mo', 'tu', 'we', 'th', 'fr'])}>Weekdays</button>
                                <span className="text-muted-foreground">·</span>
                                <button type="button" className="text-primary hover:underline" onClick={() => setDInstoreActiveDays(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'])}>All</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Store list" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of stores*</label>
                            <div className="flex items-center gap-3">
                              <div className="relative flex-1" data-dropdown-container>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  <Store className="w-4 h-4" />
                                </span>
                                <Input
                                  type="number"
                                  value={storeAmount}
                                  onChange={(e) => setStoreAmount(e.target.value)}
                                  placeholder="Enter number of stores"
                                  className="w-full pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min="1"
                                />
                              </div>
                              {storeSelectionMode && (
                                <Dialog open={showSelectedStoresDialog} onOpenChange={setShowSelectedStoresDialog}>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="whitespace-nowrap h-10">
                                      Selected stores
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl w-full max-h-[85vh] flex flex-col">
                                    <DialogHeader>
                                      <DialogTitle>Selected Stores</DialogTitle>
                                      <DialogDescription>View and manage the stores selected for this booking.</DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          placeholder="Search stores..."
                                          value={storeFilterSearch}
                                          onChange={(e) => setStoreFilterSearch(e.target.value)}
                                          className="pl-9"
                                        />
                                      </div>
                                      <Filter
                                        name="Type"
                                        options={storeTypeFilterOptions}
                                        selectedValues={storeFilterTypes}
                                        onChange={setStoreFilterTypes}
                                      />
                                      <Filter
                                        name="Location"
                                        options={storeLocationFilterOptions}
                                        selectedValues={storeFilterLocations}
                                        onChange={setStoreFilterLocations}
                                      />
                                      <Button variant="outline">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload store list
                                      </Button>
                                      <Button variant="outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download store list
                                      </Button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto min-h-0">
                                      <Table
                                        columns={[
                                          {
                                            key: 'select',
                                            header: (
                                              <Checkbox
                                                checked={filteredStoresList.length > 0 && filteredStoresList.every(s => selectedStoreIds.includes(s.id))}
                                                onCheckedChange={(checked) => {
                                                  if (checked) {
                                                    setSelectedStoreIds(prev => Array.from(new Set([...prev, ...filteredStoresList.map(s => s.id)])));
                                                  } else {
                                                    const toRemove = new Set(filteredStoresList.map(s => s.id));
                                                    setSelectedStoreIds(prev => prev.filter(id => !toRemove.has(id)));
                                                  }
                                                }}
                                              />
                                            )
                                          },
                                          { key: 'name', header: 'Store Name' },
                                          { key: 'type', header: 'Type' },
                                          { key: 'location', header: 'Location' },
                                          { key: 'reach', header: 'Estimated Reach' },
                                          { key: 'status', header: 'Status' }
                                        ]}
                                        data={filteredStoresList.map(store => ({
                                          select: (
                                            <Checkbox
                                              checked={selectedStoreIds.includes(store.id)}
                                              onCheckedChange={(checked) => handleStoreSelection(store.id, checked as boolean)}
                                            />
                                          ),
                                          name: store.name,
                                          type: store.type,
                                          location: store.location,
                                          reach: store.reach.toLocaleString(),
                                          status: (
                                            <Badge
                                              className={store.status === 'available'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-orange-100 text-orange-800 border-orange-200'}
                                            >
                                              {store.status === 'available' ? 'Available' : 'Booked'}
                                            </Badge>
                                          )
                                        }))}
                                        className="w-full"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <DialogTrigger asChild>
                                        <Button variant="outline">Close</Button>
                                      </DialogTrigger>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant={storeSelectionMode === 'random' ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => setStoreSelectionMode('random')}
                            >
                              Generate random stores
                            </Button>
                            <Button
                              variant={storeSelectionMode === 'custom' ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => setStoreSelectionMode('custom')}
                            >
                              Set custom stores
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 0
                              ? `This will generate ${calculateReach(storeAmount).toLocaleString()} reach`
                              : '750 stores available within the run time selected'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Target" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="flex gap-3">
                            <Filter
                              name="Location"
                              options={locationOptions}
                              selectedValues={selectedLocations}
                              onChange={setSelectedLocations}
                            />
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                            />
                          </div>
                          {(selectedLocations.length > 0 || selectedStoreTypes.length > 0) && (
                            <div className="flex flex-wrap gap-2">
                              {selectedLocations.map((value) => {
                                const opt = locationOptions.find((o) => o.value === value);
                                return opt ? (
                                  <Badge key={`loc-${value}`} variant="secondary" className="gap-1 pr-1">
                                    {opt.label}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedLocations(selectedLocations.filter((v) => v !== value))}
                                      className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                                      aria-label={`Remove ${opt.label}`}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ) : null;
                              })}
                              {selectedStoreTypes.map((value) => {
                                const opt = storeTypeOptions.find((o) => o.value === value);
                                return opt ? (
                                  <Badge key={`st-${value}`} variant="secondary" className="gap-1 pr-1">
                                    {opt.label}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedStoreTypes(selectedStoreTypes.filter((v) => v !== value))}
                                      className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                                      aria-label={`Remove ${opt.label}`}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </FormSection>

                      <FormSection borderless title="Audience" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-2 min-w-0">
                          <div className="relative" data-dropdown-container>
                            <SearchInput
                              value={audienceSearch}
                              onChange={(e) => {
                                setAudienceSearch(e.target.value);
                                setShowAudienceResults(true);
                              }}
                              onClick={() => setShowAudienceResults(true)}
                              placeholder="Search audiences..."
                              className="w-full"
                            />
                            {showAudienceResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredAudiences.length > 0 ? (
                                  filteredAudiences.map((audience) => (
                                    <div
                                      key={audience.value}
                                      className="p-3 hover:bg-neutral-50 cursor-pointer border-b last:border-b-0"
                                      onClick={() => handleAudienceSelect(audience)}
                                    >
                                      <div className="font-medium text-sm">{audience.label}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">No audiences found</div>
                                )}
                              </div>
                            )}
                          </div>
                          {selectedAudiences.length > 0 && (
                            <div className="space-y-1">
                              {selectedAudiences.map((value) => {
                                const audience = audienceOptions.find((a) => a.value === value);
                                return audience ? (
                                  <div key={value} className="flex items-center justify-between bg-muted rounded-md p-2">
                                    <div className="text-sm font-medium">{audience.label}</div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeAudience(value)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </FormSection>

                      <FormSection borderless title="Creatives" className={cn(bookingTab !== 'creatives' && "hidden")}>
                        {selectedCreatives.length > 0 && (
                          <div className="mb-4 overflow-x-auto">
                            <Table
                              columns={[
                                {
                                  key: 'remove',
                                  header: '',
                                  render: (row) => (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setSelectedCreatives(selectedCreatives.filter(item => item.id !== row.id))}
                                      aria-label="Remove creative"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  ),
                                  className: 'w-10 text-center',
                                },
                                { key: 'name', header: 'Name' },
                                { key: 'format', header: 'Format' },
                                { key: 'status', header: 'Status' },
                                { key: 'type', header: 'Type' },
                              ]}
                              data={selectedCreatives}
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to creative details for', row.name);
                              }}
                            />
                          </div>
                        )}

                        <CreativeLinkingDialog
                          selectedCreatives={selectedCreatives}
                          onSelectionChange={setSelectedCreatives}
                        />
                      </FormSection>

                      <section className={cn(bookingTab !== 'logs' && "hidden")}>
                        <div className="space-y-6">
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
                                  { label: 'Booking Created', value: 'Booking Created' },
                                  { label: 'Budget Updated', value: 'Budget Updated' },
                                  { label: 'Creative Linked', value: 'Creative Linked' },
                                  { label: 'Status Changed', value: 'Status Changed' },
                                  { label: 'Run time Modified', value: 'Run time Modified' },
                                ],
                                selectedValues: logActions,
                                onChange: setLogActions,
                              },
                            ]}
                            searchValue={logSearch}
                            onSearchChange={setLogSearch}
                            searchPlaceholder="Search logs..."
                          />
                          <div className="overflow-x-auto">
                            <Table
                              columns={[
                                { key: 'timestamp', header: 'Timestamp' },
                                { key: 'user', header: 'User' },
                                { key: 'action', header: 'Action', render: (row) => <Badge variant="outline">{row.action}</Badge> },
                                { key: 'field', header: 'Field' },
                                { key: 'oldValue', header: 'Old value' },
                                { key: 'newValue', header: 'New value' },
                              ]}
                              data={bookingLogData.filter((row) => {
                              const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                              const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                              const searchMatch =
                                logSearch === '' ||
                                Object.values(row).some((v) => String(v).toLowerCase().includes(logSearch.toLowerCase()));
                              return userMatch && actionMatch && searchMatch;
                            })}
                              rowKey={(row) => row.id}
                              hideActions
                            />
                          </div>
                        </div>
                      </section>

                      <FormSection borderless title="Evaluation" className={cn(bookingTab !== 'evaluation' && "hidden")}>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-muted-foreground">Add evaluation details for this booking once it runs.</p>
                            <Switch checked={evaluationEnabled} onCheckedChange={setEvaluationEnabled} />
                          </div>
                          {evaluationEnabled && (
                            <TooltipProvider delayDuration={150}>
                            <div className="space-y-5 pt-2">
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                  <label className="block text-sm font-medium">Evaluation ID</label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center text-muted-foreground cursor-help">
                                        <Info className="h-3.5 w-3.5" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>Reference used to group this booking with related campaigns in evaluation.</TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  value={evaluationId}
                                  onChange={(e) => setEvaluationId(e.target.value)}
                                  placeholder="e.g. holiday-2025-1A"
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                  <label className="block text-sm font-medium">Store list corrections</label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center text-muted-foreground cursor-help">
                                        <Info className="h-3.5 w-3.5" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>Stores where the campaign actually ran (also fed by the Kafka connector).</TooltipContent>
                                  </Tooltip>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground flex-1">{correctedStoreIds.length} store{correctedStoreIds.length === 1 ? '' : 's'} marked as corrected</span>
                                  <Dialog open={showCorrectedStoresDialog} onOpenChange={setShowCorrectedStoresDialog}>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" className="whitespace-nowrap h-10">
                                        Select corrected stores
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl w-full max-h-[85vh] flex flex-col">
                                      <DialogHeader>
                                        <DialogTitle>Store list corrections</DialogTitle>
                                        <DialogDescription>Mark which of the booking&apos;s stores are part of the corrected list. Pushed via the Kafka connector or curated manually here.</DialogDescription>
                                      </DialogHeader>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <div className="relative flex-1 min-w-[200px]">
                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input
                                            placeholder="Search stores..."
                                            value={storeFilterSearch}
                                            onChange={(e) => setStoreFilterSearch(e.target.value)}
                                            className="pl-9"
                                          />
                                        </div>
                                        <Filter
                                          name="Type"
                                          options={storeTypeFilterOptions}
                                          selectedValues={storeFilterTypes}
                                          onChange={setStoreFilterTypes}
                                        />
                                        <Filter
                                          name="Location"
                                          options={storeLocationFilterOptions}
                                          selectedValues={storeFilterLocations}
                                          onChange={setStoreFilterLocations}
                                        />
                                        <Button variant="outline">
                                          <Upload className="w-4 h-4 mr-2" />
                                          Upload store list
                                        </Button>
                                        <Button variant="outline">
                                          <Download className="w-4 h-4 mr-2" />
                                          Download store list
                                        </Button>
                                      </div>
                                      <div className="flex-1 overflow-y-auto min-h-0">
                                        <Table
                                          columns={[
                                            {
                                              key: 'select',
                                              header: (
                                                <Checkbox
                                                  checked={filteredStoresList.length > 0 && filteredStoresList.every(s => correctedStoreIds.includes(s.id))}
                                                  onCheckedChange={(checked) => {
                                                    if (checked) {
                                                      setCorrectedStoreIds(prev => Array.from(new Set([...prev, ...filteredStoresList.map(s => s.id)])));
                                                    } else {
                                                      const toRemove = new Set(filteredStoresList.map(s => s.id));
                                                      setCorrectedStoreIds(prev => prev.filter(id => !toRemove.has(id)));
                                                    }
                                                  }}
                                                />
                                              )
                                            },
                                            { key: 'name', header: 'Store Name' },
                                            { key: 'type', header: 'Type' },
                                            { key: 'location', header: 'Location' },
                                            { key: 'reach', header: 'Estimated Reach' },
                                          ]}
                                          data={filteredStoresList.map(store => ({
                                            select: (
                                              <Checkbox
                                                checked={correctedStoreIds.includes(store.id)}
                                                onCheckedChange={(checked) => handleCorrectedStoreSelection(store.id, checked as boolean)}
                                              />
                                            ),
                                            name: store.name,
                                            type: store.type,
                                            location: store.location,
                                            reach: store.reach.toLocaleString(),
                                          }))}
                                          className="w-full"
                                        />
                                      </div>
                                      <DialogFooter>
                                        <DialogTrigger asChild>
                                          <Button variant="outline">Close</Button>
                                        </DialogTrigger>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                  <label className="block text-sm font-medium">Store list excluded</label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center text-muted-foreground cursor-help">
                                        <Info className="h-3.5 w-3.5" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>Stores to leave out of the evaluation.</TooltipContent>
                                  </Tooltip>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground flex-1">{excludedStoreIds.length} store{excludedStoreIds.length === 1 ? '' : 's'} excluded</span>
                                  <Dialog open={showExcludedStoresDialog} onOpenChange={setShowExcludedStoresDialog}>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" className="whitespace-nowrap h-10">
                                        Select excluded stores
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl w-full max-h-[85vh] flex flex-col">
                                      <DialogHeader>
                                        <DialogTitle>Store list excluded</DialogTitle>
                                        <DialogDescription>Mark which of the booking&apos;s stores should be excluded from the evaluation.</DialogDescription>
                                      </DialogHeader>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <div className="relative flex-1 min-w-[200px]">
                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input
                                            placeholder="Search stores..."
                                            value={storeFilterSearch}
                                            onChange={(e) => setStoreFilterSearch(e.target.value)}
                                            className="pl-9"
                                          />
                                        </div>
                                        <Filter
                                          name="Type"
                                          options={storeTypeFilterOptions}
                                          selectedValues={storeFilterTypes}
                                          onChange={setStoreFilterTypes}
                                        />
                                        <Filter
                                          name="Location"
                                          options={storeLocationFilterOptions}
                                          selectedValues={storeFilterLocations}
                                          onChange={setStoreFilterLocations}
                                        />
                                      </div>
                                      <div className="flex-1 overflow-y-auto min-h-0">
                                        <Table
                                          columns={[
                                            {
                                              key: 'select',
                                              header: (
                                                <Checkbox
                                                  checked={filteredStoresList.length > 0 && filteredStoresList.every(s => excludedStoreIds.includes(s.id))}
                                                  onCheckedChange={(checked) => {
                                                    if (checked) {
                                                      setExcludedStoreIds(prev => Array.from(new Set([...prev, ...filteredStoresList.map(s => s.id)])));
                                                    } else {
                                                      const toRemove = new Set(filteredStoresList.map(s => s.id));
                                                      setExcludedStoreIds(prev => prev.filter(id => !toRemove.has(id)));
                                                    }
                                                  }}
                                                />
                                              )
                                            },
                                            { key: 'name', header: 'Store Name' },
                                            { key: 'type', header: 'Type' },
                                            { key: 'location', header: 'Location' },
                                            { key: 'reach', header: 'Estimated Reach' },
                                          ]}
                                          data={filteredStoresList.map(store => ({
                                            select: (
                                              <Checkbox
                                                checked={excludedStoreIds.includes(store.id)}
                                                onCheckedChange={(checked) => handleExcludedStoreSelection(store.id, checked as boolean)}
                                              />
                                            ),
                                            name: store.name,
                                            type: store.type,
                                            location: store.location,
                                            reach: store.reach.toLocaleString(),
                                          }))}
                                          className="w-full"
                                        />
                                      </div>
                                      <DialogFooter>
                                        <DialogTrigger asChild>
                                          <Button variant="outline">Close</Button>
                                        </DialogTrigger>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                  <label className="block text-sm font-medium">A/B test</label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center text-muted-foreground cursor-help">
                                        <Info className="h-3.5 w-3.5" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>Clone this booking and split the stores between the two for an A/B test.</TooltipContent>
                                  </Tooltip>
                                  {abCloneCreated && <Badge variant="secondary" className="text-xs">Version A</Badge>}
                                </div>
                                {!abCloneCreated ? (
                                  <Button variant="outline" type="button" onClick={() => setAbCloneCreated(true)}>
                                    Clone for A/B test
                                  </Button>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm text-foreground flex-1">{(bookingName || 'Untitled booking')} <span className="text-muted-foreground">(Version B)</span></span>
                                      <Button variant="outline" className="whitespace-nowrap h-10" type="button">
                                        Open Version B
                                      </Button>
                                    </div>
                                    <div className="rounded-md border bg-muted/30 p-3 space-y-1.5">
                                      <div className="text-xs font-medium text-foreground">Differences from this booking</div>
                                      <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4">
                                        <li>New Booking ID (auto-generated)</li>
                                        <li>Evaluation ID: <span className="font-mono text-foreground">{(evaluationId || 'eval-id') + '-B'}</span></li>
                                        <li>Stores: ~50% of the assigned stores (split with Version A)</li>
                                      </ul>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setAbCloneCreated(false)}
                                      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                                    >
                                      Undo clone
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            </TooltipProvider>
                          )}
                        </div>
                      </FormSection>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Submit for approval</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-4">
                  <SummaryCard
                    title="Booking"
                    variant="details"
                    items={[
                      ...(bookingName ? [{ label: 'Name', value: bookingName }] : []),
                      ...(selectedPlacement ? [{ label: 'Placement', value: selectedPlacement.name }] : []),
                      ...((startDate || endDate) ? [{ label: 'Runtime', value: `${startDate ? format(startDate, 'dd/MM/yyyy') : '?'} - ${endDate ? format(endDate, 'dd/MM/yyyy') : '?'}` }] : []),
                      ...(selectedRetailProducts.length > 0 ? [{ label: 'Retail products', value: `${selectedRetailProducts.length} selected` }] : []),
                      ...(storeAmount ? [{ label: 'Stores', value: `${storeAmount} stores` }] : []),
                      ...(selectedStoreTypes.length > 0 ? [{ label: 'Store types', value: `${selectedStoreTypes.length} selected` }] : []),
                      ...(selectedAudiences.length > 0 ? [{ label: 'Audiences', value: `${selectedAudiences.length} selected` }] : []),
                      ...(selectedInventory.length > 0 ? [{ label: 'Inventory', value: `${selectedInventory.length} selected` }] : []),
                    ]}
                  />

                  {/* Creatives section - hidden for now, can be brought back later
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Creatives</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockCreatives.map(creative => {
                        const isLinked = selectedCreatives.some(selected => selected.id === creative.id);
                        return (
                          <div key={creative.id} className="mb-3 pb-2 border-b border-neutral-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              <span className="font-medium">{creative.name}</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Booking: </span>
                              {isLinked ? (
                                <span className="font-medium">{bookingName || 'Unnamed Booking'}</span>
                              ) : (
                                <span className="text-muted-foreground">No booking</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardSummaryContent>
                  </CardSummary>
                  */}

                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Offline In-Store Booking Detail Story
export const OfflineInStore: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [bookingName, setBookingName] = React.useState('');
    const [bookingTab, setBookingTab] = React.useState<'details' | 'targeting' | 'creatives' | 'evaluation' | 'logs'>('details');
    const bookingLogData = [
      { id: 'BLOG-001', timestamp: '12/10/2024 14:30', user: 'Jane Doe', action: 'Booking Created', field: 'Booking', oldValue: '-', newValue: 'LI-001' },
      { id: 'BLOG-002', timestamp: '12/10/2024 15:05', user: 'John Smith', action: 'Budget Updated', field: 'Budget', oldValue: '€2,000', newValue: '€3,750' },
      { id: 'BLOG-003', timestamp: '12/11/2024 09:18', user: 'Sarah Wilson', action: 'Creative Linked', field: 'Creatives', oldValue: '-', newValue: 'CR-001' },
      { id: 'BLOG-004', timestamp: '12/11/2024 11:42', user: 'Jane Doe', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option' },
      { id: 'BLOG-005', timestamp: '12/12/2024 08:27', user: 'Mike Johnson', action: 'Run time Modified', field: 'End date', oldValue: '2024-08-25', newValue: '2024-08-30' },
    ];
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);
    const [logSearch, setLogSearch] = React.useState('');
    const [evaluationEnabled, setEvaluationEnabled] = React.useState(false);
    const [evaluationId, setEvaluationId] = React.useState('');
    const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
    const [selectedInventory, setSelectedInventory] = React.useState<any[]>([]);
    const [inventorySearch, setInventorySearch] = React.useState('');
    const [showInventoryResults, setShowInventoryResults] = React.useState(false);
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    // Removed location search state - using Filter component instead
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [storeAmount, setStoreAmount] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedStoreTypes, setSelectedStoreTypes] = React.useState<string[]>([]);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [showSelectedStoresDialog, setShowSelectedStoresDialog] = React.useState(false);
    const [showConflictingItemsDialog, setShowConflictingItemsDialog] = React.useState(false);
    const [conflictingBookingPriorities, setConflictingBookingPriorities] = React.useState<{[key: string]: string}>({
      'booking-1': 'Medium',
      'booking-2': 'Medium'
    });
    const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>(['AH001', 'AH002', 'AH003']);
    const [storeSelectionMode, setStoreSelectionMode] = React.useState<'random' | 'copy' | 'custom' | null>(null);
    const [creativeStatus, setCreativeStatus] = React.useState<'not-set' | 'received' | 'not-approved'>('not-set');
    const [printerStatus, setPrinterStatus] = React.useState<'not-set' | 'instruction-send' | 'delivered' | 'installed'>('not-set');
    const [briefingStatus, setBriefingStatus] = React.useState<'not-set' | 'send' | 'approved' | 'rejected'>('not-set');
    const [printerMessages, setPrinterMessages] = React.useState<{text: string; timestamp: string; sender: string}[]>([]);
    const [printerMessageInput, setPrinterMessageInput] = React.useState('');
    const handleSendPrinterMessage = () => {
      if (printerMessageInput.trim()) {
        setPrinterMessages(prev => [...prev, {
          text: printerMessageInput.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'You'
        }]);
        setPrinterMessageInput('');
      }
    };
    const [preparationChecklist, setPreparationChecklist] = React.useState({
      briefingToAdvertisers: false,
      creativeReceived: false,
      finalPrinterInstructionSend: false,
      storeListGenerated: false,
    });

    const allPreparationChecked = Object.values(preparationChecklist).every(Boolean);

    const handlePreparationChange = (key: keyof typeof preparationChecklist) => {
      setPreparationChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Location options for Filter component
    const locationOptions = [
      { label: 'No zone', value: 'no-zone', description: 'General store placement' },
      { label: 'Zuivel', value: 'zuivel', description: 'Dairy section, refrigerated area' },
      { label: 'Vers', value: 'vers', description: 'Fresh produce, vegetables, fruits' },
      { label: 'Vlees & Vega', value: 'vlees-vega', description: 'Meat counter, vegetarian alternatives' },
      { label: 'Diepvries', value: 'diepvries', description: 'Frozen food aisles, freezer sections' },
      { label: 'Worldfoods', value: 'worldfoods', description: 'International cuisine, ethnic foods' },
      { label: 'Maaltijdtoevoegingen', value: 'maaltijdtoevoegingen', description: 'Meal additions, sauces, seasonings' },
      { label: 'Noten, toast, chips etc.', value: 'noten-toast-chips', description: 'Snacks aisle, nuts, crackers' },
      { label: 'Zoetwaren', value: 'zoetwaren', description: 'Candy aisle, chocolates, sweets' },
      { label: 'Ontbijt', value: 'ontbijt', description: 'Breakfast items, cereals, spreads' },
      { label: 'Non Food', value: 'non-food', description: 'Household items, personal care' },
      { label: 'To Go', value: 'to-go', description: 'Ready meals, grab-and-go section' },
    ];

    // Inventory options with detailed information
    const inventoryOptions = [
      { id: 'wobbler', name: 'Wobbler', description: 'Shelf-edge promotional wobbler', dimensions: '10x15cm', locations: 'All shelving areas' },
      { id: 'vsb-mini', name: 'VSB (Mini)', description: 'Mini shelf barker', dimensions: '5x8cm', locations: 'Product shelves' },
      { id: 'vsb-large', name: 'VSB (Large)', description: 'Large shelf barker', dimensions: '15x20cm', locations: 'End caps, prime shelving' },
      { id: 'vloersticker', name: 'Vloersticker', description: 'Floor decal sticker', dimensions: '30x40cm', locations: 'High-traffic floor areas' },
      { id: 'koeldeursticker', name: 'Koeldeursticker', description: 'Cooler door sticker', dimensions: '20x25cm', locations: 'Refrigerated sections' },
      { id: 'makelaarsbord', name: 'Makelaarsbord', description: 'Standing promotional board', dimensions: '60x80cm', locations: 'Store entrance, aisles' },
    ];

    // Conflicting bookings data for overbook alert
    const conflictingBookings = [
      { id: 'booking-1', name: 'Summer Beverage Campaign', stores: 280, currentPriority: conflictingBookingPriorities['booking-1'] },
      { id: 'booking-2', name: 'Back to School Promotion', stores: 320, currentPriority: conflictingBookingPriorities['booking-2'] }
    ];

    const priorityOptions = ['High', 'Medium', 'Low'];

    const handlePriorityChange = (bookingId: string, priority: string) => {
      setConflictingBookingPriorities(prev => ({
        ...prev,
        [bookingId]: priority
      }));
    };

    // Sample data for other bookings running in the same time window
    const runningBookingsData = [
      {
        id: '1',
        name: 'Summer Beverage Campaign',
        availability: [85, 72, 90, 68, 76, 82, 88, 94, 79, 73, 86, 91],
        reachData: [1850000, 1650000, 1950000, 1450000, 1750000, 1850000, 2150000, 2350000, 1950000, 1550000, 2050000, 2250000],
        storeTypes: ['ah-xl', 'ah-dnah'],
        retailProducts: ['606983', '607124'],
        inventoryTypes: ['package-medium', 'package-large'],
        campaignCounts: [12, 8, 15, 6, 10, 12, 14, 18, 11, 7, 13, 16]
      },
      {
        id: '2', 
        name: 'Back to School Promotion',
        availability: [92, 88, 76, 84, 90, 87, 79, 85, 93, 89, 81, 86],
        reachData: [2150000, 1950000, 1750000, 1850000, 2050000, 1950000, 1750000, 1850000, 2150000, 2050000, 1850000, 1950000],
        storeTypes: ['ah-xl', 'ah-dnah'],
        retailProducts: ['608456', '609782'],
        inventoryTypes: ['package-small', 'package-medium'],
        campaignCounts: [8, 12, 5, 9, 13, 11, 6, 10, 15, 14, 7, 11]
      }
    ];

    // Other bookings in the same location
    const locationBookings = [
      {
        campaignId: 'LI-2024-001',
        status: 'closed-won',
        brand: 'Coca Cola',
        package: 'Large Package',
        storeAmount: '450',
        startDate: '2024-07-15',
        endDate: '2024-08-15'
      },
      {
        campaignId: 'LI-2024-089',
        status: 'in-option', 
        brand: 'Innocent',
        package: 'Medium Package',
        storeAmount: '280',
        startDate: '2024-08-01',
        endDate: '2024-08-31'
      },
      {
        campaignId: 'LI-2024-156',
        status: 'closed-won',
        brand: 'PepsiCo',
        package: 'Small Package', 
        storeAmount: '125',
        startDate: '2024-08-10',
        endDate: '2024-09-10'
      }
    ];

    // Retailer events for the calendar (commercial agenda events)
    const retailerEventsData = [
      { id: 'event1', name: 'Summer Sale', start: new Date('2024-08-05'), end: new Date('2024-08-12'), color: '#3B82F6' },
      { id: 'event2', name: 'Back to School', start: new Date('2024-08-20'), end: new Date('2024-08-31'), color: '#10B981' },
    ];

    // Store list data for selected stores dialog
    const storesList = [
      { id: 'AH001', name: 'AH XL Amsterdam Centraal', type: 'AH XL', location: 'Amsterdam', reach: 12500, status: 'available' },
      { id: 'AH002', name: 'AH DNAH Rotterdam Zuid', type: 'AH DNAH', location: 'Rotterdam', reach: 11200, status: 'available' },
      { id: 'AH003', name: 'AH XL Utrecht Centraal', type: 'AH XL', location: 'Utrecht', reach: 10800, status: 'available' },
      { id: 'AH004', name: 'AH DNAH Den Haag Centrum', type: 'AH DNAH', location: 'Den Haag', reach: 9500, status: 'booked' },
      { id: 'AH005', name: 'AH XL Eindhoven Airport', type: 'AH XL', location: 'Eindhoven', reach: 8900, status: 'available' },
      { id: 'AH006', name: 'AH DNAH Groningen Grote Markt', type: 'AH DNAH', location: 'Groningen', reach: 7200, status: 'available' },
      { id: 'AH007', name: 'AH XL Maastricht Centrum', type: 'AH XL', location: 'Maastricht', reach: 8100, status: 'booked' },
      { id: 'AH008', name: 'AH DNAH Almere Stad', type: 'AH DNAH', location: 'Almere', reach: 9200, status: 'available' },
      { id: 'AH009', name: 'AH XL Tilburg Centrum', type: 'AH XL', location: 'Tilburg', reach: 8700, status: 'available' },
      { id: 'AH010', name: 'AH DNAH Breda Centrum', type: 'AH DNAH', location: 'Breda', reach: 7800, status: 'available' },
    ];

    const handleStoreSelection = (storeId: string, checked: boolean) => {
      if (checked) {
        setSelectedStoreIds([...selectedStoreIds, storeId]);
      } else {
        setSelectedStoreIds(selectedStoreIds.filter(id => id !== storeId));
      }
    };

    // Filters for the store-selection dialog
    const [storeFilterSearch, setStoreFilterSearch] = React.useState('');
    const [storeFilterTypes, setStoreFilterTypes] = React.useState<string[]>([]);
    const [storeFilterLocations, setStoreFilterLocations] = React.useState<string[]>([]);
    const storeTypeFilterOptions = Array.from(new Set(storesList.map(s => s.type))).map(t => ({ label: t, value: t }));
    const storeLocationFilterOptions = Array.from(new Set(storesList.map(s => s.location))).map(l => ({ label: l, value: l }));
    const filteredStoresList = storesList.filter(store => {
      if (storeFilterSearch && !store.name.toLowerCase().includes(storeFilterSearch.toLowerCase())) return false;
      if (storeFilterTypes.length > 0 && !storeFilterTypes.includes(store.type)) return false;
      if (storeFilterLocations.length > 0 && !storeFilterLocations.includes(store.location)) return false;
      return true;
    });

    // Retail products data
    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
      { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
      { id: '612816', name: 'Nike - air max 270 - size 42' },
      { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: 'Ben & Jerry\'s - cookie dough - 465ml' },
    ];

    // Target filter options
    const storeTypeOptions = [
      { label: 'AH XL', value: 'ah-xl' },
      { label: 'AH DNAH', value: 'ah-dnah' }
    ];


    const audienceOptions = [
      { label: 'Matig Stedelijk', value: 'matig-stedelijk' },
      { label: 'Zeer Stedelijk', value: 'zeer-stedelijk' },
      { label: 'Young adult', value: 'young-adult' },
      { label: 'Family with Kids', value: 'family-with-kids' },
      { label: 'Convenience stores', value: 'convenience-stores' },
      { label: 'Traditional stores', value: 'traditional-stores' }
    ];

    // Filter retail products based on search
    const filteredRetailProducts = retailProducts.filter(product => 
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    // Handle retail product selection
    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    // Handle retail product search change
    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    // Remove retail product
    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Calculate estimated reach based on store amount (average reach per store: ~65)
    const calculateReach = (stores: string) => {
      const numStores = parseInt(stores);
      if (isNaN(numStores) || numStores <= 0) return 0;
      return Math.round(numStores * 65);
    };

    // Filter inventory based on search and exclude already selected items
    const filteredInventoryOptions = inventoryOptions.filter(inventory => 
      (inventory.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
       inventory.description.toLowerCase().includes(inventorySearch.toLowerCase()) ||
       inventory.locations.toLowerCase().includes(inventorySearch.toLowerCase())) &&
      !selectedInventory.some(selected => selected.id === inventory.id)
    );

    // Handle inventory search change
    const handleInventorySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInventorySearch(e.target.value);
      setShowInventoryResults(e.target.value.length > 0);
    };

    // Handle inventory input click
    const handleInventoryClick = () => {
      setShowInventoryResults(true);
    };

    // Handle inventory selection
    const handleInventorySelect = (inventory: any) => {
      if (!selectedInventory.some(item => item.id === inventory.id)) {
        setSelectedInventory([...selectedInventory, inventory]);
      }
      setInventorySearch('');
      setShowInventoryResults(false);
    };

    // Remove inventory item
    const removeInventoryItem = (inventoryId: string) => {
      setSelectedInventory(selectedInventory.filter(item => item.id !== inventoryId));
    };

    // Handle placement creation based on locations and inventory
    React.useEffect(() => {
      if (selectedLocations.length > 0 && selectedInventory.length > 0) {
        const locationLabels = selectedLocations
          .map(value => locationOptions.find(opt => opt.value === value)?.label)
          .filter(Boolean)
          .join(', ');
        const inventoryLabels = selectedInventory
          .map(item => item.name)
          .join(', ');
        setSelectedPlacement({
          name: `${locationLabels} - ${inventoryLabels}`,
          type: 'Custom Inventory',
          location: locationLabels,
          adSpaces: inventoryLabels
        });
      } else {
        setSelectedPlacement(null);
      }
    }, [selectedLocations, selectedInventory]);


    // Handle retail product input click
    const handleRetailProductClick = () => {
      setShowRetailProductResults(true);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowInventoryResults(false);
          setShowRetailProductResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{ 
          title: 'Booking Detail',
          titleIcon: <PropositionIcon engineType="offline-instore" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: null,
        }}
      >
        <div className="mb-3">
          <MetricRow
            metrics={getPropositionMetrics('offline-instore', 'booking')}
            maxVisible={5}
            defaultVariant="default"
            removable={false}
            bleedEdges
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-w-0">
                  <div className="flex gap-0" role="tablist">
                    {[
                      { value: 'details',    label: 'Booking details' },
                      { value: 'targeting',  label: 'Targeting' },
                      { value: 'creatives',  label: 'Creatives' },
                      { value: 'evaluation', label: 'Evaluation' },
                      { value: 'logs', label: 'Logs' },
                    ].map((t) => (
                      <button
                        key={t.value}
                        role="tab"
                        aria-selected={bookingTab === t.value}
                        onClick={() => setBookingTab(t.value as typeof bookingTab)}
                        className={cn(
                          'px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors',
                          bookingTab === t.value
                            ? 'font-medium bg-white text-card-foreground border-border z-10'
                            : 'font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground',
                        )}
                        style={{ position: 'relative', top: '1px' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <Card className={cn("min-w-0", bookingTab === 'details' && "rounded-tl-none")}>
                    <CardHeader className="[&>:not(.hidden)~:not(.hidden)]:mt-8">
<FormSection borderless title="Preparation" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Complete the steps below to prepare this booking. Set the store list, creative status, printer instructions, and briefing to mark this booking as ready.
                          </p>
                          <div>
                            <label className="block text-sm font-medium mb-2">Briefing</label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  {briefingStatus === 'not-set' && 'Not set'}
                                  {briefingStatus === 'send' && 'Send'}
                                  {briefingStatus === 'approved' && 'Approved'}
                                  {briefingStatus === 'rejected' && 'Rejected'}
                                  <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuItem onClick={() => setBriefingStatus('not-set')}>
                                  Not set
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setBriefingStatus('send')}>
                                  Send
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setBriefingStatus('approved')}>
                                  Approved
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setBriefingStatus('rejected')}>
                                  Rejected
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Run time" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">Start date*</label>
                              <DatePicker 
                                date={startDate}
                                onDateChange={setStartDate}
                                placeholder="Select start date" 
                                className="w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">End date*</label>
                              <DatePicker 
                                date={endDate}
                                onDateChange={setEndDate}
                                placeholder="Select end date" 
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Stores" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of stores*</label>
                            <div className="flex items-center gap-3">
                              <div className="relative flex-1" data-dropdown-container>
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  <Store className="w-4 h-4" />
                                </span>
                                <Input
                                  type="number"
                                  value={storeAmount}
                                  onChange={(e) => setStoreAmount(e.target.value)}
                                  placeholder="Enter number of stores"
                                  className="w-full pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min="1"
                                />
                              </div>
                              {storeSelectionMode && (
                                <Dialog open={showSelectedStoresDialog} onOpenChange={setShowSelectedStoresDialog}>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="whitespace-nowrap h-10">
                                      Selected stores
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl w-full max-h-[85vh] flex flex-col">
                                    <DialogHeader>
                                      <DialogTitle>Selected Stores</DialogTitle>
                                      <DialogDescription>View and manage the stores selected for this booking.</DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          placeholder="Search stores..."
                                          value={storeFilterSearch}
                                          onChange={(e) => setStoreFilterSearch(e.target.value)}
                                          className="pl-9"
                                        />
                                      </div>
                                      <Filter
                                        name="Type"
                                        options={storeTypeFilterOptions}
                                        selectedValues={storeFilterTypes}
                                        onChange={setStoreFilterTypes}
                                      />
                                      <Filter
                                        name="Location"
                                        options={storeLocationFilterOptions}
                                        selectedValues={storeFilterLocations}
                                        onChange={setStoreFilterLocations}
                                      />
                                      <Button variant="outline">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload store list
                                      </Button>
                                      <Button variant="outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download store list
                                      </Button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto min-h-0">
                                      <Table
                                        columns={[
                                          {
                                            key: 'select',
                                            header: (
                                              <Checkbox
                                                checked={filteredStoresList.length > 0 && filteredStoresList.every(s => selectedStoreIds.includes(s.id))}
                                                onCheckedChange={(checked) => {
                                                  if (checked) {
                                                    setSelectedStoreIds(prev => Array.from(new Set([...prev, ...filteredStoresList.map(s => s.id)])));
                                                  } else {
                                                    const toRemove = new Set(filteredStoresList.map(s => s.id));
                                                    setSelectedStoreIds(prev => prev.filter(id => !toRemove.has(id)));
                                                  }
                                                }}
                                              />
                                            )
                                          },
                                          { key: 'name', header: 'Store Name' },
                                          { key: 'type', header: 'Type' },
                                          { key: 'location', header: 'Location' },
                                          { key: 'reach', header: 'Estimated Reach' },
                                          { key: 'status', header: 'Status' }
                                        ]}
                                        data={filteredStoresList.map(store => ({
                                          select: (
                                            <Checkbox
                                              checked={selectedStoreIds.includes(store.id)}
                                              onCheckedChange={(checked) => handleStoreSelection(store.id, checked as boolean)}
                                            />
                                          ),
                                          name: store.name,
                                          type: store.type,
                                          location: store.location,
                                          reach: store.reach.toLocaleString(),
                                          status: (
                                            <Badge
                                              className={store.status === 'available'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-orange-100 text-orange-800 border-orange-200'}
                                            >
                                              {store.status === 'available' ? 'Available' : 'Booked'}
                                            </Badge>
                                          )
                                        }))}
                                        className="w-full"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <DialogTrigger asChild>
                                        <Button variant="outline">Close</Button>
                                      </DialogTrigger>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant={storeSelectionMode === 'random' ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => setStoreSelectionMode('random')}
                            >
                              Generate random stores
                            </Button>
                            <Button
                              variant={storeSelectionMode === 'custom' ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => setStoreSelectionMode('custom')}
                            >
                              Set custom stores
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 0
                              ? `This will generate ${calculateReach(storeAmount).toLocaleString()} reach`
                              : '750 stores available within the run time selected'
                            }
                          </div>
                          {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 750 && (
                            <>
                              <Alert variant="warning" className="mt-3">
                                <AlertTitle>Overbooked</AlertTitle>
                                <AlertDescription>
                                  <div className="mb-2">
                                    You have selected {storeAmount} stores, which exceeds the 750 available stores within the selected run time.
                                  </div>
                                  <div className="mb-2">
                                    There are 2 conflicting bookings booked in the same run time that limit store availability.
                                  </div>
                                  <button 
                                    className="text-orange-600 hover:text-orange-700 underline text-sm font-medium"
                                    onClick={() => setShowConflictingItemsDialog(true)}
                                  >
                                    Resolve conflicts
                                  </button>
                                </AlertDescription>
                              </Alert>

                              <Dialog open={showConflictingItemsDialog} onOpenChange={setShowConflictingItemsDialog}>
                                <DialogContent className="sm:max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Resolve Conflicting Line-Items</DialogTitle>
                                    <DialogDescription>
                                      Adjust priorities for bookings running in the same time period. Higher priority items will be allocated stores first.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <Table
                                      columns={[
                                        { key: 'name', header: 'Booking' },
                                        { key: 'stores', header: 'Stores Required' },
                                        { key: 'priority', header: 'Priority' }
                                      ]}
                                      data={[
                                        {
                                          name: (
                                            <div>
                                              <div className="font-medium">{bookingName || 'Current Booking'}</div>
                                              <div className="text-sm text-muted-foreground">This booking</div>
                                            </div>
                                          ),
                                          stores: `${storeAmount} stores`,
                                          priority: (
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                  Medium
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent>
                                                {priorityOptions.map((priority) => (
                                                  <DropdownMenuItem key={priority}>
                                                    {priority}
                                                  </DropdownMenuItem>
                                                ))}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          )
                                        },
                                        ...conflictingBookings.map((item) => ({
                                          name: <div className="font-medium">{item.name}</div>,
                                          stores: `${item.stores} stores`,
                                          priority: (
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                  {item.currentPriority}
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent>
                                                {priorityOptions.map((priority) => (
                                                  <DropdownMenuItem 
                                                    key={priority}
                                                    onClick={() => handlePriorityChange(item.id, priority)}
                                                  >
                                                    {priority}
                                                  </DropdownMenuItem>
                                                ))}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          )
                                        }))
                                      ]}
                                      className="w-full"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowConflictingItemsDialog(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={() => setShowConflictingItemsDialog(false)}>
                                      Apply Priorities
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
{selectedLocations.length > 0 && (
  <div className="mt-6 pt-4 border-t border-neutral-200">
    <h4 className="text-sm font-medium mb-3">Other campaigns in this location</h4>
    <Table
      columns={[
        {
          key: 'campaignId',
          header: 'Campaign ID',
          render: (row) => <span className="font-mono text-xs">{row.campaignId}</span>
        },
        {
          key: 'status',
          header: 'Status',
          render: (row) => (
            <Badge 
              variant={row.status === 'closed-won' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {row.status}
            </Badge>
          )
        },
        {
          key: 'brand',
          header: 'Brand',
          render: (row) => <span className="font-medium">{row.brand}</span>
        },
        {
          key: 'package',
          header: 'Package',
          render: (row) => row.package
        },
        {
          key: 'startDate',
          header: 'Start Date',
          render: (row) => <span className="text-xs text-muted-foreground">{row.startDate}</span>
        },
        {
          key: 'endDate',
          header: 'End Date',
          render: (row) => <span className="text-xs text-muted-foreground">{row.endDate}</span>
        },
        {
          key: 'storeAmount',
          header: 'Stores',
          render: (row) => <span className="font-medium">{row.storeAmount}</span>
        }
      ]}
      data={locationBookings}
      rowKey={(row) => row.campaignId}
      hideActions={true}
    />
  </div>
)}
                        </div>
                      </FormSection>


                      <FormSection borderless title="Creatives" className={cn(bookingTab !== 'creatives' && "hidden")}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  {creativeStatus === 'not-set' && 'Creative not set'}
                                  {creativeStatus === 'received' && 'Creative received'}
                                  {creativeStatus === 'not-approved' && 'Creative not approved'}
                                  <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuItem onClick={() => setCreativeStatus('not-set')}>
                                  Creative not set
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setCreativeStatus('received')}>
                                  Creative received
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setCreativeStatus('not-approved')}>
                                  Creative not approved
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Printer" className={cn(bookingTab !== 'creatives' && "hidden")}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  {printerStatus === 'not-set' && 'Not set'}
                                  {printerStatus === 'instruction-send' && 'Instruction send'}
                                  {printerStatus === 'delivered' && 'Delivered'}
                                  {printerStatus === 'installed' && 'Installed'}
                                  <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuItem onClick={() => setPrinterStatus('not-set')}>
                                  Not set
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPrinterStatus('instruction-send')}>
                                  Instruction send
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPrinterStatus('delivered')}>
                                  Delivered
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPrinterStatus('installed')}>
                                  Installed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2 pb-2 border-b">Printer communication</div>
                            <div className="rounded-md border bg-muted/30 p-4 min-h-[80px] flex items-center justify-center mb-3">
                              {printerMessages.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No messages yet</p>
                              ) : (
                                <div className="w-full space-y-2 flex flex-col">
                                  {printerMessages.map((msg, i) => (
                                    <div key={i} className="text-sm">
                                      <span className="font-medium">{msg.sender}</span>
                                      <span className="text-muted-foreground text-xs ml-2">{msg.timestamp}</span>
                                      <p className="mt-0.5">{msg.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                value={printerMessageInput}
                                onChange={(e) => setPrinterMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSendPrinterMessage(); }}
                              />
                              <Button
                                variant="secondary"
                                onClick={handleSendPrinterMessage}
                                disabled={!printerMessageInput.trim()}
                              >
                                send
                              </Button>
                            </div>
                          </div>
                        </div>
                      </FormSection>

                      <section className={cn(bookingTab !== 'logs' && "hidden")}>
                        <div className="space-y-6">
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
                                  { label: 'Booking Created', value: 'Booking Created' },
                                  { label: 'Budget Updated', value: 'Budget Updated' },
                                  { label: 'Creative Linked', value: 'Creative Linked' },
                                  { label: 'Status Changed', value: 'Status Changed' },
                                  { label: 'Run time Modified', value: 'Run time Modified' },
                                ],
                                selectedValues: logActions,
                                onChange: setLogActions,
                              },
                            ]}
                            searchValue={logSearch}
                            onSearchChange={setLogSearch}
                            searchPlaceholder="Search logs..."
                          />
                          <div className="overflow-x-auto">
                            <Table
                              columns={[
                                { key: 'timestamp', header: 'Timestamp' },
                                { key: 'user', header: 'User' },
                                { key: 'action', header: 'Action', render: (row) => <Badge variant="outline">{row.action}</Badge> },
                                { key: 'field', header: 'Field' },
                                { key: 'oldValue', header: 'Old value' },
                                { key: 'newValue', header: 'New value' },
                              ]}
                              data={bookingLogData.filter((row) => {
                              const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                              const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                              const searchMatch =
                                logSearch === '' ||
                                Object.values(row).some((v) => String(v).toLowerCase().includes(logSearch.toLowerCase()));
                              return userMatch && actionMatch && searchMatch;
                            })}
                              rowKey={(row) => row.id}
                              hideActions
                            />
                          </div>
                        </div>
                      </section>

                      <FormSection borderless title="Evaluation" className={cn(bookingTab !== 'evaluation' && "hidden")}>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-muted-foreground">Add evaluation details for this booking once it runs.</p>
                            <Switch checked={evaluationEnabled} onCheckedChange={setEvaluationEnabled} />
                          </div>
                          {evaluationEnabled && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Evaluation ID</label>
                              <Input
                                value={evaluationId}
                                onChange={(e) => setEvaluationId(e.target.value)}
                                placeholder="e.g. holiday-2025-1A"
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </FormSection>

                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline">Cancel</Button>
                        {/* <Button>Submit for approval</Button> */}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-4">
                  <SummaryCard
                    title="Booking"
                    variant="details"
                    items={[
                      { label: 'Preparation', value: briefingStatus === 'not-set' ? 'Not set' : briefingStatus === 'send' ? 'Briefing send' : briefingStatus === 'approved' ? 'Briefing approved' : 'Briefing rejected' },
                      { label: 'Runtime', value: `${startDate ? format(startDate, 'dd/MM/yyyy') : '?'} - ${endDate ? format(endDate, 'dd/MM/yyyy') : '?'}` },
                      { label: 'Stores', value: storeAmount ? `${storeAmount} stores${storeSelectionMode ? ' · Store list generated' : ''}` : 'Not set' },
                      { label: 'Creatives', value: creativeStatus === 'not-set' ? 'Not set' : creativeStatus === 'received' ? 'Creative received' : 'Creative not approved' },
                      { label: 'Printer', value: printerStatus === 'not-set' ? 'Not set' : printerStatus === 'instruction-send' ? 'Instruction send' : printerStatus === 'delivered' ? 'Delivered' : 'Installed' },
                    ]}
                  />

                  {/* Creatives section - hidden for now, can be brought back later
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Creatives</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockCreatives.map(creative => {
                        const isLinked = selectedCreatives.some(selected => selected.id === creative.id);
                        return (
                          <div key={creative.id} className="mb-3 pb-2 border-b border-neutral-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              <span className="font-medium">{creative.name}</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-[14px] text-muted-foreground">Booking: </span>
                              {isLinked ? (
                                <span className="font-medium">{bookingName || 'Unnamed Booking'}</span>
                              ) : (
                                <span className="text-muted-foreground">No booking</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardSummaryContent>
                  </CardSummary>
                  */}

                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Sponsored Products Booking Detail Story
export const SponsoredProducts: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    // Location options for targeting
    const locationOptions = [
      { label: 'Amsterdam', value: 'amsterdam' },
      { label: 'Rotterdam', value: 'rotterdam' },
      { label: 'Den Haag', value: 'den-haag' },
      { label: 'Utrecht', value: 'utrecht' },
      { label: 'Eindhoven', value: 'eindhoven' }
    ];
    const [bookingName, setBookingName] = React.useState('');
    const [bookingTab, setBookingTab] = React.useState<'details' | 'targeting' | 'creatives' | 'evaluation' | 'logs'>('details');
    const bookingLogData = [
      { id: 'BLOG-001', timestamp: '12/10/2024 14:30', user: 'Jane Doe', action: 'Booking Created', field: 'Booking', oldValue: '-', newValue: 'LI-001' },
      { id: 'BLOG-002', timestamp: '12/10/2024 15:05', user: 'John Smith', action: 'Budget Updated', field: 'Budget', oldValue: '€2,000', newValue: '€3,750' },
      { id: 'BLOG-003', timestamp: '12/11/2024 09:18', user: 'Sarah Wilson', action: 'Creative Linked', field: 'Creatives', oldValue: '-', newValue: 'CR-001' },
      { id: 'BLOG-004', timestamp: '12/11/2024 11:42', user: 'Jane Doe', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option' },
      { id: 'BLOG-005', timestamp: '12/12/2024 08:27', user: 'Mike Johnson', action: 'Run time Modified', field: 'End date', oldValue: '2024-08-25', newValue: '2024-08-30' },
    ];
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);
    const [logSearch, setLogSearch] = React.useState('');
    const [evaluationEnabled, setEvaluationEnabled] = React.useState(false);
    const [evaluationId, setEvaluationId] = React.useState('');
    const [placementSearch, setPlacementSearch] = React.useState('');
    const [selectedPlacement, setSelectedPlacement] = React.useState<any>(null);
    const [showPlacementResults, setShowPlacementResults] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-08-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-08-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [storeAmount, setStoreAmount] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedStoreTypes, setSelectedStoreTypes] = React.useState<string[]>([]);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
    const [selectedInventory] = React.useState<string[]>([]); // Added to fix undefined reference

    // Retail products data
    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
      { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
      { id: '612816', name: 'Nike - air max 270 - size 42' },
      { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: 'Ben & Jerry\'s - cookie dough - 465ml' },
    ];

    // Target filter options (empty for non-OfflineInStore stories)
    const storeTypeOptions = [
      { label: 'AH XL', value: 'ah-xl' },
      { label: 'AH DNAH', value: 'ah-dnah' }
    ];


    const audienceOptions = [
      { label: 'Matig Stedelijk', value: 'matig-stedelijk' },
      { label: 'Zeer Stedelijk', value: 'zeer-stedelijk' },
      { label: 'Young adult', value: 'young-adult' },
      { label: 'Family with Kids', value: 'family-with-kids' },
      { label: 'Convenience stores', value: 'convenience-stores' },
      { label: 'Traditional stores', value: 'traditional-stores' }
    ];

    // Filter retail products based on search
    const filteredRetailProducts = retailProducts.filter(product => 
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    // Handle retail product selection
    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    // Handle retail product search change
    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    // Remove retail product
    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Calculate estimated reach based on store amount (average reach per store: ~65)
    const calculateReach = (stores: string) => {
      const numStores = parseInt(stores);
      if (isNaN(numStores) || numStores <= 0) return 0;
      return Math.round(numStores * 65);
    };

    // Filter placements based on search and exclude already selected one
    const filteredPlacements = mockPlacements.filter(placement => 
      (placement.name.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.location.toLowerCase().includes(placementSearch.toLowerCase()) ||
      placement.type.toLowerCase().includes(placementSearch.toLowerCase())) &&
      (!selectedPlacement || selectedPlacement.id !== placement.id)
    );

    // Handle placement selection
    const handlePlacementSelect = (placement: any) => {
      setSelectedPlacement(placement);
      setPlacementSearch('');
      setShowPlacementResults(false);
    };

    // Remove placement
    const removePlacement = () => {
      setSelectedPlacement(null);
    };

    // Handle placement search change
    const handlePlacementSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlacementSearch(e.target.value);
      setShowPlacementResults(e.target.value.length > 0);
    };

    // Handle placement input click
    const handlePlacementClick = () => {
      setShowPlacementResults(true);
    };

    // Handle retail product input click
    const handleRetailProductClick = () => {
      setShowRetailProductResults(true);
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowPlacementResults(false);
          setShowRetailProductResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <MenuContextProvider>
        <AppLayout
        routes={routes}
        logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{ 
          title: 'Booking Detail',
          titleIcon: <PropositionIcon engineType="sponsored-products" />,
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: null,
        }}
      >
        <div className="mb-3">
          <MetricRow
            metrics={getPropositionMetrics('sponsored-products', 'booking')}
            maxVisible={5}
            defaultVariant="default"
            removable={false}
            bleedEdges
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-w-0">
                  <div className="flex gap-0" role="tablist">
                    {[
                      { value: 'details',    label: 'Booking details' },
                      { value: 'targeting',  label: 'Targeting' },
                      { value: 'creatives',  label: 'Creatives' },
                      { value: 'evaluation', label: 'Evaluation' },
                      { value: 'logs', label: 'Logs' },
                    ].map((t) => (
                      <button
                        key={t.value}
                        role="tab"
                        aria-selected={bookingTab === t.value}
                        onClick={() => setBookingTab(t.value as typeof bookingTab)}
                        className={cn(
                          'px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors',
                          bookingTab === t.value
                            ? 'font-medium bg-white text-card-foreground border-border z-10'
                            : 'font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground',
                        )}
                        style={{ position: 'relative', top: '1px' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <Card className={cn("min-w-0", bookingTab === 'details' && "rounded-tl-none")}>
                    <CardHeader className="[&>:not(.hidden)~:not(.hidden)]:mt-8">
<FormSection borderless title="Booking details" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name*</label>
                            <Input
                              value={bookingName}
                              onChange={(e) => setBookingName(e.target.value)}
                              placeholder="Enter booking name"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Evaluation ID</label>
                            <Input placeholder="Enter evaluation ID" className="w-full" />
                          </div>
                        </div>
                      </FormSection>
                      
                      <FormSection borderless title="Placement" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Find placement*</label>
                            <SearchInput 
                              value={placementSearch}
                              onChange={handlePlacementSearchChange}
                              onClick={handlePlacementClick}
                              placeholder="Search for placement..." 
                              className="w-full"
                              icon={<LayoutDashboard className="w-4 h-4" />}
                            />
                            {showPlacementResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredPlacements.length > 0 ? (
                                  filteredPlacements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className="p-3 hover:bg-neutral-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handlePlacementSelect(placement)}
                                  >
                                    <div className="font-medium text-sm">{placement.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {placement.adSpaces}
                                    </div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No placements found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {selectedPlacement && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected placement:</div>
                              <div className="flex items-center justify-between bg-muted rounded-md p-2">
                                <div>
                                  <div className="text-sm font-medium">{selectedPlacement.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {selectedPlacement.adSpaces}
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={removePlacement}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            {selectedPlacement 
                              ? 'Placement selected for this booking'
                              : 'Search and select a placement for this booking'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Run time" className={cn(bookingTab !== 'details' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">Start date*</label>
                              <DatePicker 
                                date={startDate}
                                onDateChange={setStartDate}
                                placeholder="Select start date" 
                                className="w-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <label className="block text-sm font-medium mb-2">End date*</label>
                              <DatePicker 
                                date={endDate}
                                onDateChange={setEndDate}
                                placeholder="Select end date" 
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Campaign runtime: 01 Aug, 2024 - 30 Aug, 2024
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Retail products" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-4">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Select retail products*</label>
                            <SearchInput 
                              value={retailProductSearch}
                              onChange={handleRetailProductSearchChange}
                              onClick={handleRetailProductClick}
                              placeholder="Select product by name or ID..." 
                              className="w-full"
                              icon={<ScanBarcode className="w-4 h-4" />}
                            />
                            {showRetailProductResults && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredRetailProducts.length > 0 ? (
                                  filteredRetailProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-3 hover:bg-neutral-50 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handleRetailProductSelect(product)}
                                  >
                                    <div className="font-medium text-sm">{product.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                  </div>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-sm text-muted-foreground">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {selectedRetailProducts.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Selected products:</div>
                              <div className="space-y-1">
                                {selectedRetailProducts.map(productId => {
                                  const product = retailProducts.find(p => p.id === productId);
                                  return product ? (
                                    <div key={productId} className="flex items-center justify-between bg-muted rounded-md p-2">
                                      <div>
                                        <div className="text-sm font-medium">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => removeRetailProduct(productId)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            {selectedRetailProducts.length > 0 
                              ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                              : 'Search and select retail products to target for this booking'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Store targets" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="flex gap-3">
                            <Filter
                              name="Location"
                              options={locationOptions}
                              selectedValues={selectedLocations}
                              onChange={setSelectedLocations}
                            />
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                            />
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Stores" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Number of stores*</label>
                            <div className="relative" data-dropdown-container>
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Store className="w-4 h-4" />
                              </span>
                              <Input 
                                type="number"
                                value={storeAmount}
                                onChange={(e) => setStoreAmount(e.target.value)}
                                placeholder="Enter number of stores" 
                                className="w-full pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1"
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {storeAmount && !isNaN(parseInt(storeAmount)) && parseInt(storeAmount) > 0
                              ? `This will generate ${calculateReach(storeAmount).toLocaleString()} reach`
                              : 'Specify how many stores this booking will target'
                            }
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Target" className={cn(bookingTab !== 'targeting' && "hidden")}>
                        <div className="space-y-4 min-w-0">
                          <div className="text-sm text-muted-foreground mb-4">
                            Add targeting criteria for this booking
                          </div>
                          <div className="flex gap-3">
                            <Filter
                              name="Store type"
                              options={storeTypeOptions}
                              selectedValues={selectedStoreTypes}
                              onChange={setSelectedStoreTypes}
                              className="flex-1"
                            />
                            <Filter
                              name="Audience"
                              options={audienceOptions}
                              selectedValues={selectedAudiences}
                              onChange={setSelectedAudiences}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </FormSection>

                      <FormSection borderless title="Creatives" className={cn(bookingTab !== 'creatives' && "hidden")}>
                        {selectedCreatives.length > 0 && (
                          <div className="mb-4 overflow-x-auto">
                            <Table
                              columns={[
                                {
                                  key: 'remove',
                                  header: '',
                                  render: (row) => (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => setSelectedCreatives(selectedCreatives.filter(item => item.id !== row.id))}
                                      aria-label="Remove creative"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  ),
                                  className: 'w-10 text-center',
                                },
                                { key: 'name', header: 'Name' },
                                { key: 'format', header: 'Format' },
                                { key: 'status', header: 'Status' },
                                { key: 'type', header: 'Type' },
                              ]}
                              data={selectedCreatives}
                              rowKey={row => row.id}
                              hideActions
                              rowClassName={() => 'cursor-pointer'}
                              onRowClick={row => {
                                console.log('Navigate to creative details for', row.name);
                              }}
                            />
                          </div>
                        )}
                        
                        <CreativeLinkingDialog 
                          selectedCreatives={selectedCreatives} 
                          onSelectionChange={setSelectedCreatives} 
                        />
                      </FormSection>

                      <section className={cn(bookingTab !== 'logs' && "hidden")}>
                        <div className="space-y-6">
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
                                  { label: 'Booking Created', value: 'Booking Created' },
                                  { label: 'Budget Updated', value: 'Budget Updated' },
                                  { label: 'Creative Linked', value: 'Creative Linked' },
                                  { label: 'Status Changed', value: 'Status Changed' },
                                  { label: 'Run time Modified', value: 'Run time Modified' },
                                ],
                                selectedValues: logActions,
                                onChange: setLogActions,
                              },
                            ]}
                            searchValue={logSearch}
                            onSearchChange={setLogSearch}
                            searchPlaceholder="Search logs..."
                          />
                          <div className="overflow-x-auto">
                            <Table
                              columns={[
                                { key: 'timestamp', header: 'Timestamp' },
                                { key: 'user', header: 'User' },
                                { key: 'action', header: 'Action', render: (row) => <Badge variant="outline">{row.action}</Badge> },
                                { key: 'field', header: 'Field' },
                                { key: 'oldValue', header: 'Old value' },
                                { key: 'newValue', header: 'New value' },
                              ]}
                              data={bookingLogData.filter((row) => {
                              const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                              const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                              const searchMatch =
                                logSearch === '' ||
                                Object.values(row).some((v) => String(v).toLowerCase().includes(logSearch.toLowerCase()));
                              return userMatch && actionMatch && searchMatch;
                            })}
                              rowKey={(row) => row.id}
                              hideActions
                            />
                          </div>
                        </div>
                      </section>

                      <FormSection borderless title="Evaluation" className={cn(bookingTab !== 'evaluation' && "hidden")}>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-muted-foreground">Add evaluation details for this booking once it runs.</p>
                            <Switch checked={evaluationEnabled} onCheckedChange={setEvaluationEnabled} />
                          </div>
                          {evaluationEnabled && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Evaluation ID</label>
                              <Input
                                value={evaluationId}
                                onChange={(e) => setEvaluationId(e.target.value)}
                                placeholder="e.g. holiday-2025-1A"
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </FormSection>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Submit for approval</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Sidebar */}
                <div className="flex flex-col gap-4">
                  <SummaryCard
                    title="Booking"
                    variant="details"
                    items={[
                      ...(bookingName ? [{ label: 'Name', value: bookingName }] : []),
                      ...(selectedPlacement ? [{ label: 'Placement', value: selectedPlacement.name }] : []),
                      ...((startDate || endDate) ? [{ label: 'Runtime', value: `${startDate ? format(startDate, 'dd/MM/yyyy') : '?'} - ${endDate ? format(endDate, 'dd/MM/yyyy') : '?'}` }] : []),
                      ...(selectedRetailProducts.length > 0 ? [{ label: 'Retail products', value: `${selectedRetailProducts.length} selected` }] : []),
                      ...(storeAmount ? [{ label: 'Stores', value: `${storeAmount} stores` }] : []),
                      ...(selectedStoreTypes.length > 0 ? [{ label: 'Store types', value: `${selectedStoreTypes.length} selected` }] : []),
                      ...(selectedAudiences.length > 0 ? [{ label: 'Audiences', value: `${selectedAudiences.length} selected` }] : []),
                      ...(selectedInventory.length > 0 ? [{ label: 'Inventory', value: `${(selectedInventory as any[]).length} selected` }] : []),
                    ]}
                  />

                  {/* Creatives section - hidden for now, can be brought back later
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Creatives</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      {mockCreatives.map(creative => {
                        const isLinked = selectedCreatives.some(selected => selected.id === creative.id);
                        return (
                          <div key={creative.id} className="mb-3 pb-2 border-b border-neutral-100 last:border-b-0">
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Creative: </span>
                              <span className="font-medium">{creative.name}</span>
                            </div>
                            <div className="text-[14px]">
                              <span className="text-muted-foreground">Booking: </span>
                              {isLinked ? (
                                <span className="font-medium">{bookingName || 'Unnamed Booking'}</span>
                              ) : (
                                <span className="text-muted-foreground">No booking</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardSummaryContent>
                  </CardSummary>
                  */}

                  <CampaignDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
      </MenuContextProvider>
    );
  },
};

// Offsite Display Booking Detail Story
export const OffsiteDisplay: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    const [bookingName, setBookingName] = React.useState('');
    const [bookingTab, setBookingTab] = React.useState<'details' | 'targeting' | 'creatives' | 'evaluation' | 'logs'>('details');
    const bookingLogData = [
      { id: 'BLOG-001', timestamp: '12/10/2024 14:30', user: 'Jane Doe', action: 'Booking Created', field: 'Booking', oldValue: '-', newValue: 'LI-001' },
      { id: 'BLOG-002', timestamp: '12/10/2024 15:05', user: 'John Smith', action: 'Budget Updated', field: 'Budget', oldValue: '€2,000', newValue: '€3,750' },
      { id: 'BLOG-003', timestamp: '12/11/2024 09:18', user: 'Sarah Wilson', action: 'Creative Linked', field: 'Creatives', oldValue: '-', newValue: 'CR-001' },
      { id: 'BLOG-004', timestamp: '12/11/2024 11:42', user: 'Jane Doe', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option' },
      { id: 'BLOG-005', timestamp: '12/12/2024 08:27', user: 'Mike Johnson', action: 'Run time Modified', field: 'End date', oldValue: '2024-08-25', newValue: '2024-08-30' },
    ];
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);
    const [logSearch, setLogSearch] = React.useState('');
    const [evaluationEnabled, setEvaluationEnabled] = React.useState(false);
    const [evaluationId, setEvaluationId] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date('2024-06-01'));
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date('2024-06-30'));
    const [selectedCreatives, setSelectedCreatives] = React.useState<any[]>([]);
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);
    const [selectedPlacement, setSelectedPlacement] = React.useState<string>('');
    const [selectedBudget, setSelectedBudget] = React.useState('');
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [selectedDevices, setSelectedDevices] = React.useState<string[]>([]);
    const [selectedGeos, setSelectedGeos] = React.useState<string[]>([]);

    const offsitePlacements = [
      { value: 'homepage-hero', label: 'Homepage Hero', description: '970×250 · Above the fold · Premium visibility' },
      { value: 'category-leaderboard', label: 'Category Leaderboard', description: '728×90 · Category pages · High intent audience' },
      { value: 'product-page-rectangle', label: 'Product Page Rectangle', description: '300×250 · Product detail pages · High purchase intent' },
      { value: 'search-results-top', label: 'Search Results Top', description: '728×90 · Search results · Keyword-triggered' },
      { value: 'checkout-sidebar', label: 'Checkout Sidebar', description: '300×600 · Checkout flow · Last-touch attribution' },
      { value: 'newsletter-half-page', label: 'Newsletter Half Page', description: '300×600 · Weekly newsletter · Engaged subscribers' },
      { value: 'mobile-interstitial', label: 'Mobile Interstitial', description: '320×480 · App & mobile web · Full-screen takeover' },
    ];

    const retailProducts = [
      { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
      { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
      { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
      { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
      { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
      { id: '614649', name: "Ben & Jerry's - cookie dough - 465ml" },
    ];

    const audienceOptions = [
      { label: 'Beverage Buyers', value: 'beverage-buyers' },
      { label: 'Health & Wellness', value: 'health-wellness' },
      { label: 'Frequent Shoppers', value: 'frequent-shoppers' },
      { label: 'Young Adults 18–34', value: 'young-adults' },
      { label: 'Families with Kids', value: 'families-kids' },
      { label: 'Premium Brand Affinity', value: 'premium-brand' },
    ];

    const deviceOptions = [
      { label: 'Desktop', value: 'desktop' },
      { label: 'Mobile', value: 'mobile' },
      { label: 'Tablet', value: 'tablet' },
    ];

    const geoOptions = [
      { label: 'Amsterdam', value: 'amsterdam' },
      { label: 'Rotterdam', value: 'rotterdam' },
      { label: 'Den Haag', value: 'den-haag' },
      { label: 'Utrecht', value: 'utrecht' },
      { label: 'Eindhoven', value: 'eindhoven' },
    ];

    const filteredRetailProducts = retailProducts.filter(product =>
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    const handleRetailProductSelect = (product: any) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowRetailProductResults(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedPlacementObj = offsitePlacements.find(p => p.value === selectedPlacement);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Booking Detail',
          titleIcon: <PropositionIcon engineType="offsite" />,
            onEdit: () => alert('Edit clicked'),
            onExport: () => alert('Export clicked'),
            onImport: () => alert('Import clicked'),
            onSettings: () => alert('Settings clicked'),
            headerRight: null,
          }}
        >
          <div className="mb-3">
            <MetricRow
              metrics={getPropositionMetrics('offsite', 'booking')}
              maxVisible={5}
              defaultVariant="default"
              removable={false}
              bleedEdges
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 min-w-0">
              <div className="flex gap-0" role="tablist">
                    {[
                      { value: 'details',    label: 'Booking details' },
                      { value: 'targeting',  label: 'Targeting' },
                      { value: 'creatives',  label: 'Creatives' },
                      { value: 'evaluation', label: 'Evaluation' },
                      { value: 'logs', label: 'Logs' },
                    ].map((t) => (
                      <button
                        key={t.value}
                        role="tab"
                        aria-selected={bookingTab === t.value}
                        onClick={() => setBookingTab(t.value as typeof bookingTab)}
                        className={cn(
                          'px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors',
                          bookingTab === t.value
                            ? 'font-medium bg-white text-card-foreground border-border z-10'
                            : 'font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground',
                        )}
                        style={{ position: 'relative', top: '1px' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
              <Card className={cn("min-w-0", bookingTab === 'details' && "rounded-tl-none")}>
                <CardHeader className="[&>:not(.hidden)~:not(.hidden)]:mt-8">
<FormSection borderless title="Booking details" className={cn(bookingTab !== 'details' && "hidden")}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name*</label>
                        <Input
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Enter booking name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Evaluation ID</label>
                        <Input placeholder="Enter evaluation ID" className="w-full" />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection borderless title="Placement" className={cn(bookingTab !== 'details' && "hidden")}>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium mb-2">Select placement*</label>
                      {offsitePlacements.map(placement => (
                        <div
                          key={placement.value}
                          onClick={() => setSelectedPlacement(placement.value)}
                          className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                            selectedPlacement === placement.value
                              ? 'border-primary bg-primary/5'
                              : 'border-input hover:bg-accent'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                            selectedPlacement === placement.value ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {selectedPlacement === placement.value && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{placement.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{placement.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormSection>

                  <FormSection borderless title="Run time" className={cn(bookingTab !== 'details' && "hidden")}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Start date*</label>
                          <DatePicker
                            date={startDate}
                            onDateChange={setStartDate}
                            placeholder="Select start date"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">End date*</label>
                          <DatePicker
                            date={endDate}
                            onDateChange={setEndDate}
                            placeholder="Select end date"
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Campaign runtime: 01 Jun, 2024 - 30 Jun, 2024
                      </div>
                    </div>
                  </FormSection>

                  <FormSection borderless title="Budget" className={cn(bookingTab !== 'details' && "hidden")}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Booking budget*</label>
                        <Input
                          type="number"
                          value={selectedBudget}
                          onChange={(e) => setSelectedBudget(e.target.value)}
                          placeholder="Enter budget"
                          className="w-full"
                          min="0"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Campaign budget: $120,000
                      </div>
                    </div>
                  </FormSection>

                  <FormSection borderless title="Retail products" className={cn(bookingTab !== 'targeting' && "hidden")}>
                    <div className="space-y-4">
                      <div className="relative" data-dropdown-container>
                        <label className="block text-sm font-medium mb-2">Select retail products*</label>
                        <SearchInput
                          value={retailProductSearch}
                          onChange={(e) => {
                            setRetailProductSearch(e.target.value);
                            setShowRetailProductResults(e.target.value.length > 0);
                          }}
                          onClick={() => setShowRetailProductResults(true)}
                          placeholder="Search product by name or ID..."
                          className="w-full"
                          icon={<ScanBarcode className="w-4 h-4" />}
                        />
                        {showRetailProductResults && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredRetailProducts.length > 0 ? (
                              filteredRetailProducts.map(product => (
                                <div
                                  key={product.id}
                                  className="p-3 hover:bg-neutral-50 cursor-pointer border-b last:border-b-0"
                                  onClick={() => handleRetailProductSelect(product)}
                                >
                                  <div className="font-medium text-sm">{product.name}</div>
                                  <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-sm text-muted-foreground">No products found</div>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedRetailProducts.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Selected products:</div>
                          {selectedRetailProducts.map(productId => {
                            const product = retailProducts.find(p => p.id === productId);
                            return product ? (
                              <div key={productId} className="flex items-center justify-between bg-muted rounded-md p-2">
                                <div>
                                  <div className="text-sm font-medium">{product.name}</div>
                                  <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => removeRetailProduct(productId)} className="h-8 w-8 p-0">
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        {selectedRetailProducts.length > 0
                          ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                          : 'Search and select retail products to advertise in this booking'
                        }
                      </div>
                    </div>
                  </FormSection>

                  <FormSection borderless title="Targeting" className={cn(bookingTab !== 'targeting' && "hidden")}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Audience</label>
                        <div className="flex flex-wrap gap-2">
                          {audienceOptions.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setSelectedAudiences(prev =>
                                prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                              )}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                selectedAudiences.includes(opt.value)
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-input bg-background hover:bg-accent'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Device</label>
                        <div className="flex flex-wrap gap-2">
                          {deviceOptions.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setSelectedDevices(prev =>
                                prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                              )}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                selectedDevices.includes(opt.value)
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-input bg-background hover:bg-accent'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Geo</label>
                        <div className="flex flex-wrap gap-2">
                          {geoOptions.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setSelectedGeos(prev =>
                                prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                              )}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                selectedGeos.includes(opt.value)
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-input bg-background hover:bg-accent'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  <FormSection borderless title="Creatives" className={cn(bookingTab !== 'creatives' && "hidden")}>
                    {selectedCreatives.length > 0 && (
                      <div className="mb-4 overflow-x-auto">
                        <Table
                          columns={[
                            {
                              key: 'remove',
                              header: '',
                              render: (row) => (
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => setSelectedCreatives(selectedCreatives.filter(item => item.id !== row.id))}
                                  aria-label="Remove creative"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              ),
                              className: 'w-10 text-center',
                            },
                            { key: 'name', header: 'Name' },
                            { key: 'format', header: 'Format' },
                            { key: 'status', header: 'Status' },
                          ]}
                          data={selectedCreatives}
                          rowKey={row => row.id}
                          hideActions
                          onRowClick={row => console.log('Navigate to creative', row.name)}
                        />
                      </div>
                    )}
                    <CreativeLinkingDialog
                      selectedCreatives={selectedCreatives}
                      onSelectionChange={setSelectedCreatives}
                    />
                  </FormSection>

                      <section className={cn(bookingTab !== 'logs' && "hidden")}>
                        <div className="space-y-6">
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
                                  { label: 'Booking Created', value: 'Booking Created' },
                                  { label: 'Budget Updated', value: 'Budget Updated' },
                                  { label: 'Creative Linked', value: 'Creative Linked' },
                                  { label: 'Status Changed', value: 'Status Changed' },
                                  { label: 'Run time Modified', value: 'Run time Modified' },
                                ],
                                selectedValues: logActions,
                                onChange: setLogActions,
                              },
                            ]}
                            searchValue={logSearch}
                            onSearchChange={setLogSearch}
                            searchPlaceholder="Search logs..."
                          />
                          <div className="overflow-x-auto">
                            <Table
                              columns={[
                                { key: 'timestamp', header: 'Timestamp' },
                                { key: 'user', header: 'User' },
                                { key: 'action', header: 'Action', render: (row) => <Badge variant="outline">{row.action}</Badge> },
                                { key: 'field', header: 'Field' },
                                { key: 'oldValue', header: 'Old value' },
                                { key: 'newValue', header: 'New value' },
                              ]}
                              data={bookingLogData.filter((row) => {
                              const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                              const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                              const searchMatch =
                                logSearch === '' ||
                                Object.values(row).some((v) => String(v).toLowerCase().includes(logSearch.toLowerCase()));
                              return userMatch && actionMatch && searchMatch;
                            })}
                              rowKey={(row) => row.id}
                              hideActions
                            />
                          </div>
                        </div>
                      </section>

                      <FormSection borderless title="Evaluation" className={cn(bookingTab !== 'evaluation' && "hidden")}>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-muted-foreground">Add evaluation details for this booking once it runs.</p>
                            <Switch checked={evaluationEnabled} onCheckedChange={setEvaluationEnabled} />
                          </div>
                          {evaluationEnabled && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Evaluation ID</label>
                              <Input
                                value={evaluationId}
                                onChange={(e) => setEvaluationId(e.target.value)}
                                placeholder="e.g. holiday-2025-1A"
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </FormSection>


                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Submit for approval</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <SummaryCard
                title="Booking"
                variant="details"
                items={[
                  ...(bookingName ? [{ label: 'Name', value: bookingName }] : []),
                  ...(selectedPlacementObj ? [{ label: 'Placement', value: selectedPlacementObj.label }] : []),
                  ...((startDate || endDate) ? [{ label: 'Runtime', value: `${startDate ? format(startDate, 'dd/MM/yyyy') : '?'} - ${endDate ? format(endDate, 'dd/MM/yyyy') : '?'}` }] : []),
                  ...(selectedBudget ? [{ label: 'Budget', value: `$${Number(selectedBudget).toLocaleString()}` }] : []),
                  ...(selectedRetailProducts.length > 0 ? [{ label: 'Retail products', value: `${selectedRetailProducts.length} selected` }] : []),
                  ...(selectedAudiences.length > 0 ? [{ label: 'Audiences', value: `${selectedAudiences.length} selected` }] : []),
                  ...(selectedDevices.length > 0 ? [{ label: 'Devices', value: selectedDevices.join(', ') }] : []),
                  ...(selectedGeos.length > 0 ? [{ label: 'Geo', value: `${selectedGeos.length} selected` }] : []),
                ]}
              />

              <SummaryCard
                title="Campaign details"
                variant="details"
                items={[
                  { label: 'Campaign name', value: 'Offsite: Summer Launch' },
                  { label: 'PO Number', value: 'PO-789012' },
                  { label: 'Advertiser', value: 'Coca-Cola' },
                  { label: 'Brand', value: 'Coca-Cola Zero' },
                  { label: 'Goal', value: 'Awareness' },
                  { label: 'Budget', value: '$120,000' },
                  { label: 'Runtime', value: '01 Jun, 2024 - 30 Jun, 2024' },
                ]}
              />
            </div>
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
