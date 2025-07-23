'use client';

// Performance page for Digital In-store - based on DigitalInstorePerformance story
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, MetricCard } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Table } from '@/components/ui/table';
import { Viewbar } from '@/components/ui/viewbar';
import { Badge } from '@/components/ui/badge';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { LineChartComponent } from '@/components/ui/line-chart';
import { MapChart } from '@/components/ui/map-chart';
import { DateRangePicker } from '@/components/ui/date-picker';
import { FilterBar } from '@/components/ui/filter-bar';
import { defaultRoutes } from '@/components/layout/default-routes';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';

// Digital In-store specific metrics
const digitalInstoreMetrics = [
  { 
    id: 'stores', 
    label: 'Stores', 
    value: '1,247', 
    subMetric: 'Coverage: 94%',
    badgeValue: '+2%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'plays', 
    label: 'Plays', 
    value: '89,432', 
    subMetric: 'Rate: 71.7/day',
    badgeValue: '+8%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'completion', 
    label: 'Completion', 
    value: '87.3%', 
    subMetric: 'Duration: 15s avg',
    badgeValue: '-1%',
    badgeVariant: 'destructive' as const,
  },
  { 
    id: 'roas', 
    label: 'ROAS', 
    value: '2.85x', 
    subMetric: 'AOV: €92.40',
    badgeValue: '+7%',
    badgeVariant: 'success' as const,
  },
];

// Chart data function
const getChartData = (selectedMetric: string) => {
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    let baseAchieved = 1000;
    let basePlanned = 950;
    
    // Weekend dips
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      baseAchieved *= 0.7;
      basePlanned *= 0.7;
    }
    
    // Digital in-store has consistent performance during store hours
    baseAchieved *= 1.1;
    
    // Add variance
    baseAchieved *= (0.85 + Math.random() * 0.3);
    basePlanned *= (0.95 + Math.random() * 0.1);
    
    const multiplier = 
      selectedMetric === 'stores' ? 0.1 : 
      selectedMetric === 'plays' ? 100 : 
      1;
    
    days.push({
      day: dayLabel,
      achieved: Math.round(baseAchieved * multiplier),
      planned: Math.round(basePlanned * multiplier),
    });
  }
  
  return days;
};

// Chart configuration
const chartConfig = {
  achieved: {
    label: "Achieved",
    color: "hsl(var(--chart-1))",
  },
  planned: {
    label: "Planned", 
    color: "hsl(var(--chart-2))",
  },
};

// Enhanced data with store/player type information for Digital In-store
const digitalInstoreLineItemsData = [
  { id: '1893', name: 'Campaign total', planned: 27000, achieved: 25000, performance: '103.00%', creatives: 2, storeType: 'hypermarket', playerType: 'digital-display', roas: '2.85x' },
  { id: '1894', name: 'Hypermarket displays', planned: 1300, achieved: 1250, performance: '96.15%', creatives: 2, storeType: 'hypermarket', playerType: 'digital-display', roas: '2.92x' },
  { id: '1895', name: 'Checkout screens', planned: 1300, achieved: 1350, performance: '103.85%', creatives: 1, storeType: 'supermarket', playerType: 'checkout-screen', roas: '3.15x' },
  { id: '1896', name: 'Entrance displays', planned: 1300, achieved: 1180, performance: '90.77%', creatives: 3, storeType: 'convenience', playerType: 'entrance-display', roas: '2.68x' },
  { id: '1897', name: 'Interactive kiosks', planned: 1300, achieved: 1420, performance: '109.23%', creatives: 2, storeType: 'express', playerType: 'interactive-kiosk', roas: '3.47x' },
];

const digitalInstoreCreativesData = [
  { id: 'CR-001', name: 'In-store Promotion Banner', planned: 15000, achieved: 14500, performance: '96.67%', lineItems: 3, storeType: 'hypermarket', playerType: 'digital-display', roas: '3.12x' },
  { id: 'CR-002', name: 'Checkout Animation', planned: 12000, achieved: 10500, performance: '87.50%', lineItems: 2, storeType: 'supermarket', playerType: 'checkout-screen', roas: '2.45x' },
  { id: 'CR-003', name: 'Welcome Message', planned: 8000, achieved: 8200, performance: '102.50%', lineItems: 4, storeType: 'convenience', playerType: 'entrance-display', roas: '2.89x' },
  { id: 'CR-004', name: 'Product Finder Interface', planned: 10000, achieved: 11000, performance: '110.00%', lineItems: 2, storeType: 'express', playerType: 'interactive-kiosk', roas: '3.78x' },
];

// Digital In-store stores data
const digitalInstoreStoresData = [
  { id: 'ST-001', name: 'Albert Heijn Amsterdam Central', location: 'Amsterdam', screens: 4, plays: 2847, performance: '89.2%', storeType: 'hypermarket', playerType: 'digital-display' },
  { id: 'ST-002', name: 'Albert Heijn Utrecht CS', location: 'Utrecht', screens: 3, plays: 1923, performance: '92.1%', storeType: 'supermarket', playerType: 'checkout-screen' },
  { id: 'ST-003', name: 'Albert Heijn Rotterdam Central', location: 'Rotterdam', screens: 5, plays: 3241, performance: '87.6%', storeType: 'hypermarket', playerType: 'digital-display' },
];

// Digital In-store players data
const digitalInstorePlayersData = [
  { id: 'PL-001', name: 'Entrance Display', store: 'Amsterdam Central', location: 'Front entrance', plays: 1247, uptime: '98.5%', storeType: 'hypermarket', playerType: 'entrance-display' },
  { id: 'PL-002', name: 'Checkout Display A', store: 'Amsterdam Central', location: 'Checkout area A', plays: 891, uptime: '95.2%', storeType: 'hypermarket', playerType: 'checkout-screen' },
  { id: 'PL-003', name: 'Produce Section', store: 'Utrecht CS', location: 'Produce department', plays: 1156, uptime: '97.8%', storeType: 'supermarket', playerType: 'digital-display' },
];

// Map data for Digital In-store
const mapData = [
  { name: 'Amsterdam Central', plays: 5847, x: 48, y: 35 },
  { name: 'Rotterdam Central', plays: 6241, x: 40, y: 55 },
  { name: 'Den Haag HS', plays: 4156, x: 35, y: 50 },
  { name: 'Utrecht CS', plays: 5123, x: 52, y: 48 },
  { name: 'Eindhoven CS', plays: 3789, x: 58, y: 70 },
];

const getPerformanceBadgeVariant = (performance: string) => {
  const value = parseFloat(performance.replace('%', ''));
  if (value >= 100) return 'default';
  if (value >= 90) return 'secondary';
  return 'destructive';
};

export default function DigitalInstorePerformancePage() {
  const [selectedMetric, setSelectedMetric] = useState('stores');
  const [activeTab, setActiveTab] = useState('line-items');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  
  // Filter states
  const [storeTypeFilter, setStoreTypeFilter] = useState<string[]>([]);
  const [playerTypeFilter, setPlayerTypeFilter] = useState<string[]>([]);
  const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  
  // Selection states
  const [selectedLineItems, setSelectedLineItems] = useState<any[]>([]);
  const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
  const [selectedStores, setSelectedStores] = useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
  
  const chartData = getChartData(selectedMetric);
  const selectedMetricData = digitalInstoreMetrics.find(m => m.id === selectedMetric);

  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Performance - Digital In-store',
        subtitle: 'Monitor in-store digital performance and analytics',
        headerRight: (
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="Pick a date range"
            showPresets={true}
          />
        ),
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
      }}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {digitalInstoreMetrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                  subMetric={metric.subMetric}
                  badgeValue={metric.badgeValue}
                  badgeVariant={metric.badgeVariant}
                  isSelected={selectedMetric === metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                />
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Achieved {selectedMetricData?.label.toLowerCase() || 'performance'}
              </h3>
              <BarChartComponent
                data={chartData}
                config={chartConfig}
                showLegend={true}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-80 aspect-auto"
                xAxisDataKey="day"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Viewbar
              labels={[]}
              tabs={[
                { value: 'line-items', label: 'Line Items' },
                { value: 'creatives', label: 'Creatives' },
                { value: 'stores', label: 'Stores' },
                { value: 'player', label: 'Player' },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <div className="mt-4 mb-4">
              <FilterBar
                filters={[
                  {
                    name: "Store Type",
                    options: [
                      { label: "Hypermarket", value: "hypermarket" },
                      { label: "Supermarket", value: "supermarket" },
                      { label: "Convenience", value: "convenience" },
                      { label: "Express", value: "express" },
                    ],
                    selectedValues: storeTypeFilter,
                    onChange: setStoreTypeFilter,
                  },
                  {
                    name: "Player Type",
                    options: [
                      { label: "Digital Display", value: "digital-display" },
                      { label: "Interactive Kiosk", value: "interactive-kiosk" },
                      { label: "Checkout Screen", value: "checkout-screen" },
                      { label: "Entrance Display", value: "entrance-display" },
                    ],
                    selectedValues: playerTypeFilter,
                    onChange: setPlayerTypeFilter,
                  },
                  {
                    name: "Performance",
                    options: [
                      { label: "Above 100%", value: "above-100" },
                      { label: "90-100%", value: "90-100" },
                      { label: "Below 90%", value: "below-90" },
                    ],
                    selectedValues: performanceFilter,
                    onChange: setPerformanceFilter,
                  },
                ]}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search stores, players, line items..."
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="line-items" className="mt-0">
                <Table
                  columns={[
                    { key: 'name', header: 'Name' },
                    { key: 'id', header: 'ID' },
                    { key: 'planned', header: 'Planned', render: row => row.planned?.toLocaleString() || "0" },
                    { key: 'achieved', header: 'Achieved', render: row => row.achieved?.toLocaleString() || "0" },
                    { key: 'performance', header: 'Performance', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                        {row.performance}
                      </Badge>
                    )},
                    { key: 'creatives', header: 'Creative', render: row => (
                      <Badge variant="secondary">{row.creatives}</Badge>
                    )},
                    { key: 'roas', header: 'ROAS' },
                  ]}
                  data={digitalInstoreLineItemsData}
                  rowKey={row => `${row.id}-${row.name}`}
                  hideActions
                  rowClassName={() => 'cursor-pointer'}
                  onRowClick={row => console.log('Navigate to line item details for', row.name)}
                  rowSelection={{
                    selectedKeys: selectedLineItems,
                    onChange: setSelectedLineItems,
                    getKey: row => `${row.id}-${row.name}`,
                  }}
                />
              </TabsContent>
              <TabsContent value="creatives" className="mt-0">
                <Table
                  columns={[
                    { key: 'name', header: 'Name' },
                    { key: 'id', header: 'ID' },
                    { key: 'planned', header: 'Planned', render: row => row.planned?.toLocaleString() || "0" },
                    { key: 'achieved', header: 'Achieved', render: row => row.achieved?.toLocaleString() || "0" },
                    { key: 'performance', header: 'Performance', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                        {row.performance}
                      </Badge>
                    )},
                    { key: 'lineItems', header: 'Line Items', render: row => (
                      <Badge variant="secondary">{row.lineItems}</Badge>
                    )},
                    { key: 'roas', header: 'ROAS' },
                  ]}
                  data={digitalInstoreCreativesData}
                  rowKey={row => row.id}
                  hideActions
                  rowClassName={() => 'cursor-pointer'}
                  onRowClick={row => console.log('Navigate to creative details for', row.name)}
                  rowSelection={{
                    selectedKeys: selectedCreatives,
                    onChange: setSelectedCreatives,
                    getKey: row => row.id,
                  }}
                />
              </TabsContent>
              <TabsContent value="stores" className="mt-0">
                <Table
                  columns={[
                    { key: 'name', header: 'Store Name' },
                    { key: 'id', header: 'Store ID' },
                    { key: 'location', header: 'Location' },
                    { key: 'screens', header: 'Screens', render: row => (
                      <Badge variant="secondary">{row.screens}</Badge>
                    )},
                    { key: 'plays', header: 'Plays', render: row => row.plays.toLocaleString() },
                    { key: 'performance', header: 'Performance', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                        {row.performance}
                      </Badge>
                    )},
                  ]}
                  data={digitalInstoreStoresData}
                  rowKey={row => row.id}
                  hideActions
                  rowClassName={() => 'cursor-pointer'}
                  onRowClick={row => console.log('Navigate to store details for', row.name)}
                  rowSelection={{
                    selectedKeys: selectedStores,
                    onChange: setSelectedStores,
                    getKey: row => row.id,
                  }}
                />
              </TabsContent>
              <TabsContent value="player" className="mt-0">
                <Table
                  columns={[
                    { key: 'name', header: 'Player Name' },
                    { key: 'id', header: 'Player ID' },
                    { key: 'store', header: 'Store' },
                    { key: 'location', header: 'Location' },
                    { key: 'plays', header: 'Plays', render: row => row.plays.toLocaleString() },
                    { key: 'uptime', header: 'Uptime', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.uptime)}>
                        {row.uptime}
                      </Badge>
                    )},
                  ]}
                  data={digitalInstorePlayersData}
                  rowKey={row => row.id}
                  hideActions
                  rowClassName={() => 'cursor-pointer'}
                  onRowClick={row => console.log('Navigate to player details for', row.name)}
                  rowSelection={{
                    selectedKeys: selectedPlayers,
                    onChange: setSelectedPlayers,
                    getKey: row => row.id,
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Digital In-store Specific Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Netherlands Map Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Store Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <MapChart data={mapData} />
            </CardContent>
          </Card>

          {/* Hourly Plays Line Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Plays by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={[
                  { hour: '6AM', plays: 0 },
                  { hour: '7AM', plays: 1200 },
                  { hour: '8AM', plays: 8900 },
                  { hour: '9AM', plays: 12400 },
                  { hour: '10AM', plays: 13800 },
                  { hour: '11AM', plays: 14200 },
                  { hour: '12PM', plays: 15800 },
                  { hour: '1PM', plays: 16200 },
                  { hour: '2PM', plays: 15900 },
                  { hour: '3PM', plays: 15200 },
                  { hour: '4PM', plays: 14800 },
                  { hour: '5PM', plays: 13900 },
                  { hour: '6PM', plays: 12100 },
                  { hour: '7PM', plays: 8900 },
                  { hour: '8PM', plays: 4200 },
                  { hour: '9PM', plays: 1800 },
                  { hour: '10PM', plays: 0 },
                ]}
                config={{
                  plays: {
                    label: "Plays",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="hour"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}