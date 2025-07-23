'use client';

// Performance page for Offline In-store - based on OfflineInstorePerformance story
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

// Offline In-store specific metrics
const offlineInstoreMetrics = [
  { 
    id: 'locations', 
    label: 'Locations', 
    value: '843', 
    subMetric: 'Coverage: 97%',
    badgeValue: '+1%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'materials', 
    label: 'Materials', 
    value: '2,195', 
    subMetric: 'Installed: 98%',
    badgeValue: '+3%',
    badgeVariant: 'success' as const,
  },
  { 
    id: 'compliance', 
    label: 'Compliance', 
    value: '94.2%', 
    subMetric: 'Verified: 89%',
    badgeValue: '-2%',
    badgeVariant: 'destructive' as const,
  },
  { 
    id: 'roas', 
    label: 'ROAS', 
    value: '1.95x', 
    subMetric: 'AOV: €65.80',
    badgeValue: '+4%',
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
    
    let baseAchieved = 800;
    let basePlanned = 850;
    
    // Weekend dips
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      baseAchieved *= 0.8;
      basePlanned *= 0.8;
    }
    
    // Offline in-store has moderate performance
    baseAchieved *= 0.95;
    
    // Add variance
    baseAchieved *= (0.85 + Math.random() * 0.3);
    basePlanned *= (0.95 + Math.random() * 0.1);
    
    const multiplier = 
      selectedMetric === 'locations' ? 0.1 : 
      selectedMetric === 'materials' ? 3 : 
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

// Enhanced data with location/material type information for Offline In-store
const offlineInstoreLineItemsData = [
  { id: '2001', name: 'Total campaign', planned: 18000, achieved: 16500, performance: '91.67%', materials: 5, locationType: 'hypermarket', materialType: 'end-cap', roas: '1.95x' },
  { id: '2002', name: 'Hypermarket end-caps', planned: 1200, achieved: 1100, performance: '91.67%', materials: 3, locationType: 'hypermarket', materialType: 'end-cap', roas: '2.12x' },
  { id: '2003', name: 'Shelf wobblers', planned: 1200, achieved: 1050, performance: '87.50%', materials: 2, locationType: 'supermarket', materialType: 'shelf-wobbler', roas: '1.89x' },
  { id: '2004', name: 'Floor graphics', planned: 1200, achieved: 1320, performance: '110.00%', materials: 4, locationType: 'convenience', materialType: 'floor-graphic', roas: '2.34x' },
  { id: '2005', name: 'Window clings', planned: 1200, achieved: 980, performance: '81.67%', materials: 3, locationType: 'express', materialType: 'window-cling', roas: '1.67x' },
];

const offlineInstoreCreativesData = [
  { id: 'CR-101', name: 'Summer Sale Banner', planned: 8000, achieved: 7200, performance: '90.00%', lineItems: 3, locationType: 'hypermarket', materialType: 'banner', roas: '2.01x' },
  { id: 'CR-102', name: 'Product Shelf Talker', planned: 6000, achieved: 5400, performance: '90.00%', lineItems: 2, locationType: 'supermarket', materialType: 'shelf-talker', roas: '1.78x' },
  { id: 'CR-103', name: 'Aisle Directional', planned: 4000, achieved: 4200, performance: '105.00%', lineItems: 4, locationType: 'convenience', materialType: 'directional', roas: '2.12x' },
  { id: 'CR-104', name: 'Checkout Counter Card', planned: 5000, achieved: 4800, performance: '96.00%', lineItems: 2, locationType: 'express', materialType: 'counter-card', roas: '1.89x' },
];

// Offline In-store stores data
const offlineInstoreStoresData = [
  { id: 'ST-101', name: 'Albert Heijn Amsterdam Zuid', location: 'Amsterdam', materials: 8, compliance: '96.2%', performance: '89.2%', locationType: 'hypermarket', materialType: 'end-cap' },
  { id: 'ST-102', name: 'Albert Heijn Utrecht Centrum', location: 'Utrecht', materials: 6, compliance: '94.1%', performance: '92.1%', locationType: 'supermarket', materialType: 'shelf-wobbler' },
  { id: 'ST-103', name: 'Albert Heijn Rotterdam West', location: 'Rotterdam', materials: 9, compliance: '91.6%', performance: '87.6%', locationType: 'hypermarket', materialType: 'end-cap' },
];

// Offline In-store materials data
const offlineInstoreMaterialsData = [
  { id: 'MT-001', name: 'End-cap Display', store: 'Amsterdam Zuid', location: 'Aisle 5 end', status: 'Active', compliance: '98.5%', locationType: 'hypermarket', materialType: 'end-cap' },
  { id: 'MT-002', name: 'Shelf Wobbler A', store: 'Amsterdam Zuid', location: 'Dairy section', status: 'Active', compliance: '95.2%', locationType: 'hypermarket', materialType: 'shelf-wobbler' },
  { id: 'MT-003', name: 'Floor Graphic', store: 'Utrecht Centrum', location: 'Main entrance', status: 'Active', compliance: '97.8%', locationType: 'supermarket', materialType: 'floor-graphic' },
];

// Map data for Offline In-store
const mapData = [
  { name: 'Amsterdam Zuid', materials: 47, x: 48, y: 35 },
  { name: 'Rotterdam West', materials: 52, x: 40, y: 55 },
  { name: 'Den Haag Centrum', materials: 31, x: 35, y: 50 },
  { name: 'Utrecht Centrum', materials: 43, x: 52, y: 48 },
  { name: 'Eindhoven Noord', materials: 29, x: 58, y: 70 },
];

const getPerformanceBadgeVariant = (performance: string) => {
  const value = parseFloat(performance.replace('%', ''));
  if (value >= 100) return 'default';
  if (value >= 90) return 'secondary';
  return 'destructive';
};

export default function OfflineInstorePerformancePage() {
  const [selectedMetric, setSelectedMetric] = useState('locations');
  const [activeTab, setActiveTab] = useState('line-items');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  
  // Filter states
  const [locationTypeFilter, setLocationTypeFilter] = useState<string[]>([]);
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string[]>([]);
  const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  
  // Selection states
  const [selectedLineItems, setSelectedLineItems] = useState<any[]>([]);
  const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
  const [selectedStores, setSelectedStores] = useState<any[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  
  const chartData = getChartData(selectedMetric);
  const selectedMetricData = offlineInstoreMetrics.find(m => m.id === selectedMetric);

  return (
    <AppLayout
      routes={defaultRoutes}
      logo={{ src: '/gambit-logo.svg', alt: 'Gambit Logo', width: 40, height: 40 }}
      user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
      onLogout={() => alert('Logout clicked')}
      breadcrumbProps={{}}
      pageHeaderProps={{
        title: 'Performance - Offline In-store',
        subtitle: 'Monitor offline in-store performance and compliance',
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
              {offlineInstoreMetrics.map((metric) => (
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
                { value: 'materials', label: 'Materials' },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <div className="mt-4 mb-4">
              <FilterBar
                filters={[
                  {
                    name: "Location Type",
                    options: [
                      { label: "Hypermarket", value: "hypermarket" },
                      { label: "Supermarket", value: "supermarket" },
                      { label: "Convenience", value: "convenience" },
                      { label: "Express", value: "express" },
                    ],
                    selectedValues: locationTypeFilter,
                    onChange: setLocationTypeFilter,
                  },
                  {
                    name: "Material Type",
                    options: [
                      { label: "End-cap", value: "end-cap" },
                      { label: "Shelf Wobbler", value: "shelf-wobbler" },
                      { label: "Floor Graphic", value: "floor-graphic" },
                      { label: "Window Cling", value: "window-cling" },
                      { label: "Banner", value: "banner" },
                      { label: "Shelf Talker", value: "shelf-talker" },
                    ],
                    selectedValues: materialTypeFilter,
                    onChange: setMaterialTypeFilter,
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
                searchPlaceholder="Search stores, materials, line items..."
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="line-items" className="mt-0">
                <Table
                  columns={[
                    { key: 'name', header: 'Name' },
                    { key: 'id', header: 'ID' },
                    { key: 'planned', header: 'Planned', render: row => row.planned?.toLocaleString() || '0' },
                    { key: 'achieved', header: 'Achieved', render: row => row.achieved?.toLocaleString() || '0' },
                    { key: 'performance', header: 'Performance', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                        {row.performance}
                      </Badge>
                    )},
                    { key: 'materials', header: 'Materials', render: row => (
                      <Badge variant="secondary">{row.materials}</Badge>
                    )},
                    { key: 'roas', header: 'ROAS' },
                  ]}
                  data={offlineInstoreLineItemsData}
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
                    { key: 'planned', header: 'Planned', render: row => row.planned?.toLocaleString() || '0' },
                    { key: 'achieved', header: 'Achieved', render: row => row.achieved?.toLocaleString() || '0' },
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
                  data={offlineInstoreCreativesData}
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
                    { key: 'materials', header: 'Materials', render: row => (
                      <Badge variant="secondary">{row.materials}</Badge>
                    )},
                    { key: 'compliance', header: 'Compliance', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.compliance)}>
                        {row.compliance}
                      </Badge>
                    )},
                    { key: 'performance', header: 'Performance', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                        {row.performance}
                      </Badge>
                    )},
                  ]}
                  data={offlineInstoreStoresData}
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
              <TabsContent value="materials" className="mt-0">
                <Table
                  columns={[
                    { key: 'name', header: 'Material Name' },
                    { key: 'id', header: 'Material ID' },
                    { key: 'store', header: 'Store' },
                    { key: 'location', header: 'Location' },
                    { key: 'status', header: 'Status', render: row => (
                      <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                        {row.status}
                      </Badge>
                    )},
                    { key: 'compliance', header: 'Compliance', render: row => (
                      <Badge variant={getPerformanceBadgeVariant(row.compliance)}>
                        {row.compliance}
                      </Badge>
                    )},
                  ]}
                  data={offlineInstoreMaterialsData}
                  rowKey={row => row.id}
                  hideActions
                  rowClassName={() => 'cursor-pointer'}
                  onRowClick={row => console.log('Navigate to material details for', row.name)}
                  rowSelection={{
                    selectedKeys: selectedMaterials,
                    onChange: setSelectedMaterials,
                    getKey: row => row.id,
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Offline In-store Specific Cards */}
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

          {/* Compliance by Day Line Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Compliance by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={[
                  { day: 'Mon', compliance: 94.2 },
                  { day: 'Tue', compliance: 95.8 },
                  { day: 'Wed', compliance: 93.5 },
                  { day: 'Thu', compliance: 96.1 },
                  { day: 'Fri', compliance: 94.8 },
                  { day: 'Sat', compliance: 92.3 },
                  { day: 'Sun', compliance: 91.7 },
                ]}
                config={{
                  compliance: {
                    label: "Compliance %",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                showLegend={false}
                showGrid={true}
                showTooltip={true}
                showXAxis={true}
                showYAxis={true}
                className="h-60 w-full"
                xAxisDataKey="day"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}