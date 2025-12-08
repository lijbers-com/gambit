import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AppLayout } from '../app-layout';
import { PageHeader } from '@/components/ui/page-header';
import { FilterBar } from '@/components/ui/filter-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, MetricCard, CardWithTabs } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChartComponent } from '@/components/ui/area-chart';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { ArrowUp, ArrowDown, TrendingUp, Plus } from 'lucide-react';
import { Table } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const meta = {
  title: 'Page Templates/Media Orchestra',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StrategyAllocation = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    // Strategy allocation states (percentage sliders)
    const [marketingAllocation, setMarketingAllocation] = useState(40);
    const [monetizationAllocation, setMonetizationAllocation] = useState(35);
    const [loyaltyAllocation, setLoyaltyAllocation] = useState(25);

    // Filter states
    const [mediaProductFilter, setMediaProductFilter] = useState<string[]>([]);
    const [propositionFilter, setPropositionFilter] = useState<string[]>([]);
    const [adSpaceFilter, setAdSpaceFilter] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(2024, 0, 1),
      to: new Date(2024, 5, 30)
    });

    // Sample data for Strategy Split
    const strategySplitData = [
      { month: 'Jan', marketing: 380000, monetization: 320000, loyalty: 240000 },
      { month: 'Feb', marketing: 420000, monetization: 350000, loyalty: 260000 },
      { month: 'Mar', marketing: 390000, monetization: 340000, loyalty: 250000 },
      { month: 'Apr', marketing: 450000, monetization: 380000, loyalty: 280000 },
      { month: 'May', marketing: 480000, monetization: 400000, loyalty: 300000 },
      { month: 'Jun', marketing: 510000, monetization: 420000, loyalty: 320000 }
    ];

    // Ad Space Performance Data
    const adSpaceData = [
      { month: 'Jan', homepage: 85000, categoryPages: 65000, productPages: 120000, checkout: 35000 },
      { month: 'Feb', homepage: 95000, categoryPages: 78000, productPages: 145000, checkout: 42000 },
      { month: 'Mar', homepage: 88000, categoryPages: 72000, productPages: 135000, checkout: 38000 },
      { month: 'Apr', homepage: 102000, categoryPages: 85000, productPages: 158000, checkout: 48000 },
      { month: 'May', homepage: 108000, categoryPages: 92000, productPages: 168000, checkout: 52000 },
      { month: 'Jun', homepage: 115000, categoryPages: 98000, productPages: 178000, checkout: 58000 }
    ];

    // Proposition (Engine) Performance Data
    const propositionData = [
      { month: 'Jan', display: 180000, sponsoredProducts: 95000, digitalInstore: 45000 },
      { month: 'Feb', display: 210000, sponsoredProducts: 115000, digitalInstore: 55000 },
      { month: 'Mar', display: 195000, sponsoredProducts: 105000, digitalInstore: 50000 },
      { month: 'Apr', display: 225000, sponsoredProducts: 128000, digitalInstore: 62000 },
      { month: 'May', display: 240000, sponsoredProducts: 138000, digitalInstore: 68000 },
      { month: 'Jun', display: 255000, sponsoredProducts: 148000, digitalInstore: 75000 }
    ];

    // Conversion & Profit Data
    const performanceData = [
      { month: 'Jan', conversion: 2.8, profit: 45000 },
      { month: 'Feb', conversion: 3.2, profit: 58000 },
      { month: 'Mar', conversion: 3.0, profit: 52000 },
      { month: 'Apr', conversion: 3.6, profit: 68000 },
      { month: 'May', conversion: 3.9, profit: 75000 },
      { month: 'Jun', conversion: 4.2, profit: 82000 }
    ];

    const strategySplitConfig = {
      marketing: { label: "Marketing", color: "hsl(var(--chart-1))" },
      monetization: { label: "Monetization", color: "hsl(var(--chart-2))" },
      loyalty: { label: "Loyalty", color: "hsl(var(--chart-3))" }
    };

    const adSpaceConfig = {
      homepage: { label: "Homepage", color: "hsl(var(--chart-1))" },
      categoryPages: { label: "Category Pages", color: "hsl(var(--chart-2))" },
      productPages: { label: "Product Pages", color: "hsl(var(--chart-3))" },
      checkout: { label: "Checkout", color: "hsl(var(--chart-4))" }
    };

    const propositionConfig = {
      display: { label: "Display Engine", color: "hsl(var(--chart-1))" },
      sponsoredProducts: { label: "Sponsored Products", color: "hsl(var(--chart-2))" },
      digitalInstore: { label: "Digital In-Store", color: "hsl(var(--chart-3))" }
    };

    const performanceConfig = {
      conversion: { label: "Conversion Rate (%)", color: "hsl(var(--chart-1))" },
      profit: { label: "Profit (€K)", color: "hsl(var(--chart-2))" }
    };

    return (
      <AppLayout
        routes={routes}
        pageHeaderProps={{
          title: "Media Orchestra",
          subtitle: "Control and optimize media placement across marketing, monetization, and loyalty strategies",
          headerRight: (
            <div className="flex gap-2">
              <Button variant="outline">Export Analytics</Button>
              <Button>Audience Builder</Button>
            </div>
          )
        }}
      >
        <div className="flex flex-col gap-6">
          {/* Filters */}
          <FilterBar
            filters={[
              {
                name: 'Media Product',
                options: [
                  { label: 'Premium Homepage', value: 'premium-homepage' },
                  { label: 'Category Takeover', value: 'category-takeover' },
                  { label: 'Product Spotlight', value: 'product-spotlight' },
                  { label: 'Checkout Boost', value: 'checkout-boost' },
                ],
                selectedValues: mediaProductFilter,
                onChange: setMediaProductFilter,
              },
              {
                name: 'Proposition (Engine)',
                options: [
                  { label: 'Display Engine', value: 'display' },
                  { label: 'Sponsored Products', value: 'sponsored-products' },
                  { label: 'Digital In-Store', value: 'digital-instore' },
                  { label: 'Offsite Media', value: 'offsite' },
                ],
                selectedValues: propositionFilter,
                onChange: setPropositionFilter,
              },
              {
                name: 'Ad Space',
                options: [
                  { label: 'Homepage Banner', value: 'homepage-banner' },
                  { label: 'Category Sidebar', value: 'category-sidebar' },
                  { label: 'Product Carousel', value: 'product-carousel' },
                  { label: 'Search Results', value: 'search-results' },
                ],
                selectedValues: adSpaceFilter,
                onChange: setAdSpaceFilter,
              },
            ]}
          />

          {/* Strategy Allocation Control */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Allocation Control</CardTitle>
              <CardDescription>
                Adjust media investment split between Marketing (personalization), Monetization (conversion & profit), and Loyalty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Marketing</label>
                    <Badge variant="default">{marketingAllocation}%</Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={marketingAllocation}
                    onChange={(e) => setMarketingAllocation(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Focus on customer personalization & reach
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Monetization</label>
                    <Badge variant="default">{monetizationAllocation}%</Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={monetizationAllocation}
                    onChange={(e) => setMonetizationAllocation(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optimize for conversion & profit
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Loyalty</label>
                    <Badge variant="default">{loyaltyAllocation}%</Badge>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={loyaltyAllocation}
                    onChange={(e) => setLoyaltyAllocation(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Build customer lifetime value
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Note:</strong> Our AI-powered personalization engine automatically builds audiences
                  and optimizes placements based on your strategy allocation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Split Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Strategy</CardTitle>
              <CardDescription>Track performance across Marketing, Monetization, and Loyalty initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChartComponent
                data={strategySplitData}
                config={strategySplitConfig}
                showLegend={true}
                stacked={true}
                className="h-[350px]"
              />
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion & Profit</CardTitle>
                <CardDescription>Key performance indicators for monetization strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChartComponent
                  data={performanceData}
                  config={performanceConfig}
                  showLegend={true}
                  curved={true}
                  secondaryYAxis={{
                    dataKey: "profit"
                  }}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposition Performance</CardTitle>
                <CardDescription>Revenue by engine type (Display, Sponsored Products, etc.)</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  data={propositionData}
                  config={propositionConfig}
                  showLegend={true}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Ad Space Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Ad Space Performance</CardTitle>
              <CardDescription>Revenue across different media placements (Homepage, Category Pages, Product Pages, Checkout)</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChartComponent
                data={adSpaceData}
                config={adSpaceConfig}
                showLegend={true}
                className="h-[350px]"
              />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};

export const Overview = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    // Filter states
    const [propositionFilter, setPropositionFilter] = useState<string[]>([]);
    const [mediaProductsFilter, setMediaProductsFilter] = useState<string[]>([]);
    const [adPositionsFilter, setAdPositionsFilter] = useState<string[]>([]);
    const [audienceFilter, setAudienceFilter] = useState<string[]>([]);
    const [selectedMetric, setSelectedMetric] = useState('revenue');

    // Revenue performance data
    const revenueData = [
      { month: 'Jan', revenue: 420 },
      { month: 'Feb', revenue: 580 },
      { month: 'Mar', revenue: 540 },
      { month: 'Apr', revenue: 720 },
      { month: 'May', revenue: 780 },
      { month: 'Jun', revenue: 850 }
    ];

    // Price buildup data (stacked bar chart)
    const priceData = [
      { month: 'Jan', cpm: 2.5, priceIndex: 1.2, seasonality: 0.8, discount: -0.3 },
      { month: 'Feb', cpm: 2.8, priceIndex: 1.3, seasonality: 0.9, discount: -0.4 },
      { month: 'Mar', cpm: 2.6, priceIndex: 1.2, seasonality: 0.85, discount: -0.35 },
      { month: 'Apr', cpm: 3.2, priceIndex: 1.4, seasonality: 1.0, discount: -0.5 },
      { month: 'May', cpm: 3.4, priceIndex: 1.5, seasonality: 1.1, discount: -0.6 },
      { month: 'Jun', cpm: 3.6, priceIndex: 1.6, seasonality: 1.2, discount: -0.7 }
    ];

    // Revenue by strategy data - showing marketing cost vs monetization revenue
    // Marketing = cost of using inventory (~30% of revenue)
    // Monetization = actual revenue from ad sales
    const strategyData = [
      { month: 'Jan', marketing: 126, monetization: 420 },
      { month: 'Feb', marketing: 174, monetization: 580 },
      { month: 'Mar', marketing: 162, monetization: 540 },
      { month: 'Apr', marketing: 216, monetization: 720 },
      { month: 'May', marketing: 234, monetization: 780 },
      { month: 'Jun', marketing: 255, monetization: 850 }
    ];

    // Fill rates data
    const fillRatesData = [
      { month: 'Jan', fillRate: 82 },
      { month: 'Feb', fillRate: 85 },
      { month: 'Mar', fillRate: 83 },
      { month: 'Apr', fillRate: 88 },
      { month: 'May', fillRate: 90 },
      { month: 'Jun', fillRate: 92 }
    ];

    // Media positions table data (moved before calculateStrategyRevenue)
    const mediaPositionsData = [
      {
        id: 'MP001',
        position: 'Homepage Hero Banner',
        proposition: 'Display',
        mediaProduct: 'Premium Homepage Takeover',
        audience: 'High-Value Shoppers',
        impressions: '2.5M',
        clicks: '85K',
        ctr: '3.4%',
        revenue: '€125K',
        fillRate: '95%',
        cpm: '€3.80',
      },
      {
        id: 'MP002',
        position: 'Category Top Slot',
        proposition: 'Sponsored Products',
        mediaProduct: 'Category Sponsorship',
        audience: 'Category Browsers',
        impressions: '1.8M',
        clicks: '62K',
        ctr: '3.4%',
        revenue: '€95K',
        fillRate: '92%',
        cpm: '€3.50',
      },
      {
        id: 'MP003',
        position: 'Product Page Carousel',
        proposition: 'Sponsored Products',
        mediaProduct: 'Product Recommendations',
        audience: 'Product Viewers',
        impressions: '3.2M',
        clicks: '128K',
        ctr: '4.0%',
        revenue: '€145K',
        fillRate: '88%',
        cpm: '€3.20',
      },
      {
        id: 'MP004',
        position: 'Checkout Sidebar',
        proposition: 'Display',
        mediaProduct: 'Checkout Companion',
        audience: 'Purchase Intent',
        impressions: '950K',
        clicks: '42K',
        ctr: '4.4%',
        revenue: '€68K',
        fillRate: '94%',
        cpm: '€4.20',
      },
      {
        id: 'MP005',
        position: 'Search Results Top',
        proposition: 'Sponsored Products',
        mediaProduct: 'Search Ads',
        audience: 'Active Searchers',
        impressions: '2.1M',
        clicks: '95K',
        ctr: '4.5%',
        revenue: '€110K',
        fillRate: '90%',
        cpm: '€3.90',
      },
      {
        id: 'MP006',
        position: 'Email Header',
        proposition: 'Offline',
        mediaProduct: 'Newsletter Sponsorship',
        audience: 'Email Subscribers',
        impressions: '850K',
        clicks: '28K',
        ctr: '3.3%',
        revenue: '€55K',
        fillRate: '98%',
        cpm: '€2.80',
      },
      {
        id: 'MP007',
        position: 'In-Store Digital Display',
        proposition: 'DOOH',
        mediaProduct: 'Digital Signage',
        audience: 'In-Store Shoppers',
        impressions: '1.2M',
        clicks: '0',
        ctr: 'N/A',
        revenue: '€72K',
        fillRate: '85%',
        cpm: '€4.50',
      },
      {
        id: 'MP008',
        position: 'Mobile App Banner',
        proposition: 'Display',
        mediaProduct: 'App Advertising',
        audience: 'Mobile Users',
        impressions: '1.6M',
        clicks: '52K',
        ctr: '3.3%',
        revenue: '€88K',
        fillRate: '91%',
        cpm: '€3.40',
      },
    ];

    // Filtered data based on selected filters (moved before calculateStrategyRevenue)
    const filteredMediaPositions = mediaPositionsData.filter(row => {
      const propositionMatch = propositionFilter.length === 0 || propositionFilter.includes(row.proposition);
      const mediaProductMatch = mediaProductsFilter.length === 0 || mediaProductsFilter.includes(row.mediaProduct);
      const adPositionMatch = adPositionsFilter.length === 0 || adPositionsFilter.includes(row.position);
      const audienceMatch = audienceFilter.length === 0 || audienceFilter.includes(row.audience);
      return propositionMatch && mediaProductMatch && adPositionMatch && audienceMatch;
    });

    // Performance metrics for top cards
    const performanceMetrics = [
      {
        id: 'revenue',
        label: 'Revenue',
        value: '€850K',
        subMetric: 'Total revenue',
        badgeValue: '+102%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'price',
        label: 'Avg Price (CPM)',
        value: '€3.60',
        subMetric: 'Cost per mille',
        badgeValue: '+44%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'strategy',
        label: 'Revenue Split',
        value: '€850K',
        subMetric: 'Monetization revenue',
        badgeValue: '70%',
        badgeVariant: 'success' as const,
      },
      {
        id: 'fillRate',
        label: 'Fill Rate',
        value: '92%',
        subMetric: 'Inventory filled',
        badgeValue: '+12%',
        badgeVariant: 'success' as const,
      },
    ];

    // Additional metrics for "Add Metrics" modal
    const additionalMetrics = [
      { id: 'impressions', label: 'Impressions', value: '12.5M', subMetric: 'Total views', badgeValue: '+85%', badgeVariant: 'success' as const },
      { id: 'clicks', label: 'Clicks', value: '425K', subMetric: 'Total clicks', badgeValue: '+62%', badgeVariant: 'success' as const },
      { id: 'ctr', label: 'CTR', value: '3.4%', subMetric: 'Click-through rate', badgeValue: '+0.8%', badgeVariant: 'success' as const },
      { id: 'conversions', label: 'Conversions', value: '18.2K', subMetric: 'Total conversions', badgeValue: '+45%', badgeVariant: 'success' as const },
      { id: 'roi', label: 'ROI', value: '4.2x', subMetric: 'Return on investment', badgeValue: '+1.1x', badgeVariant: 'success' as const },
      { id: 'cpc', label: 'CPC', value: '€2.00', subMetric: 'Cost per click', badgeValue: '-€0.35', badgeVariant: 'success' as const },
    ];

    const revenueConfig = {
      revenue: { label: "Revenue (K€)", color: "hsl(var(--chart-1))" }
    };

    const priceConfig = {
      cpm: { label: "CPM", color: "hsl(var(--chart-1))" },
      priceIndex: { label: "Price Index", color: "hsl(var(--chart-2))" },
      seasonality: { label: "Seasonality", color: "hsl(var(--chart-3))" },
      discount: { label: "Discount", color: "hsl(var(--chart-4))" }
    };

    const strategyConfig = {
      marketing: { label: "Marketing Cost", color: "hsl(var(--chart-1))" },
      monetization: { label: "Monetization Revenue", color: "hsl(var(--chart-2))" }
    };

    const fillRatesConfig = {
      fillRate: { label: "Fill Rate (%)", color: "hsl(var(--chart-2))" }
    };

    return (
      <AppLayout
        routes={routes}
        pageHeaderProps={{
          title: "Media Orchestra - Positions",
          subtitle: "Manage and analyze performance across all media positions",
          headerRight: (
            <div className="flex gap-2">
              <Button variant="outline">Export Report</Button>
              <Button>Optimize Placement</Button>
            </div>
          )
        }}
      >
        <div className="flex flex-col gap-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {performanceMetrics.map((metric) => (
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

            {/* Add More Metrics Button */}
            <Dialog>
              <DialogTrigger asChild>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Add Metric</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Select a Metric</DialogTitle>
                  <DialogDescription>
                    Choose a metric to add to your dashboard. Click on any metric card to select it.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[500px] overflow-y-auto p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {additionalMetrics.map((metric) => (
                      <MetricCard
                        key={metric.id}
                        label={metric.label}
                        value={metric.value}
                        subMetric={metric.subMetric}
                        badgeValue={metric.badgeValue}
                        badgeVariant={metric.badgeVariant}
                        className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => {
                          console.log('Metric selected:', metric.id);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Detailed Metric Charts based on selection */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedMetric === 'revenue' && 'Performance on Revenue'}
                {selectedMetric === 'price' && 'Price Buildup Analysis'}
                {selectedMetric === 'strategy' && 'Marketing Cost vs Monetization Revenue'}
                {selectedMetric === 'fillRate' && 'Fill Rates Over Time'}
              </CardTitle>
              <CardDescription>
                {selectedMetric === 'revenue' && 'Track revenue performance across all media positions'}
                {selectedMetric === 'price' && 'Breakdown of pricing components: CPM, price index, seasonality, and discounts'}
                {selectedMetric === 'strategy' && 'Compare marketing costs (inventory usage) against monetization revenue (ad sales) from selected positions'}
                {selectedMetric === 'fillRate' && 'Inventory fill rates showing demand vs. supply'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMetric === 'revenue' && (
                <AreaChartComponent
                  data={revenueData}
                  config={revenueConfig}
                  showLegend={false}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-[300px] w-full"
                  xAxisDataKey="month"
                />
              )}
              {selectedMetric === 'price' && (
                <BarChartComponent
                  data={priceData}
                  config={priceConfig}
                  showLegend={true}
                  stacked={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-[300px] w-full"
                  xAxisDataKey="month"
                />
              )}
              {selectedMetric === 'strategy' && (
                <BarChartComponent
                  data={strategyData}
                  config={strategyConfig}
                  showLegend={true}
                  stacked={false}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-[300px] w-full"
                  xAxisDataKey="month"
                />
              )}
              {selectedMetric === 'fillRate' && (
                <LineChartComponent
                  data={fillRatesData}
                  config={fillRatesConfig}
                  showLegend={false}
                  curved={true}
                  showGrid={true}
                  showTooltip={true}
                  showXAxis={true}
                  showYAxis={true}
                  className="h-[300px] w-full"
                  xAxisDataKey="month"
                />
              )}
            </CardContent>
          </Card>

          {/* Media Positions Table with Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Media Positions</CardTitle>
              <CardDescription>All media positions with performance metrics and filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FilterBar
                filters={[
                  {
                    name: 'Proposition',
                    options: [
                      { label: 'Sponsored Products', value: 'Sponsored Products' },
                      { label: 'Display', value: 'Display' },
                      { label: 'DOOH', value: 'DOOH' },
                      { label: 'Offline', value: 'Offline' },
                    ],
                    selectedValues: propositionFilter,
                    onChange: setPropositionFilter,
                  },
                  {
                    name: 'Media Products',
                    options: [
                      { label: 'Premium Homepage Takeover', value: 'Premium Homepage Takeover' },
                      { label: 'Category Sponsorship', value: 'Category Sponsorship' },
                      { label: 'Product Recommendations', value: 'Product Recommendations' },
                      { label: 'Checkout Companion', value: 'Checkout Companion' },
                      { label: 'Search Ads', value: 'Search Ads' },
                      { label: 'Newsletter Sponsorship', value: 'Newsletter Sponsorship' },
                      { label: 'Digital Signage', value: 'Digital Signage' },
                      { label: 'App Advertising', value: 'App Advertising' },
                      { label: 'Email Header Ads', value: 'Email Header Ads' },
                      { label: 'Social Media Integration', value: 'Social Media Integration' },
                    ],
                    selectedValues: mediaProductsFilter,
                    onChange: setMediaProductsFilter,
                  },
                  {
                    name: 'Ad Positions',
                    options: [
                      { label: 'Homepage Hero Banner', value: 'Homepage Hero Banner' },
                      { label: 'Category Top Slot', value: 'Category Top Slot' },
                      { label: 'Product Page Carousel', value: 'Product Page Carousel' },
                      { label: 'Checkout Sidebar', value: 'Checkout Sidebar' },
                      { label: 'Search Results Top', value: 'Search Results Top' },
                      { label: 'Email Header', value: 'Email Header' },
                      { label: 'In-Store Digital Display', value: 'In-Store Digital Display' },
                      { label: 'Mobile App Banner', value: 'Mobile App Banner' },
                      { label: 'Footer Banner', value: 'Footer Banner' },
                      { label: 'Sidebar Widget', value: 'Sidebar Widget' },
                    ],
                    selectedValues: adPositionsFilter,
                    onChange: setAdPositionsFilter,
                  },
                  {
                    name: 'Audience',
                    options: [
                      { label: 'High-Value Shoppers', value: 'High-Value Shoppers' },
                      { label: 'Category Browsers', value: 'Category Browsers' },
                      { label: 'Product Viewers', value: 'Product Viewers' },
                      { label: 'Purchase Intent', value: 'Purchase Intent' },
                      { label: 'Active Searchers', value: 'Active Searchers' },
                      { label: 'Email Subscribers', value: 'Email Subscribers' },
                      { label: 'In-Store Shoppers', value: 'In-Store Shoppers' },
                      { label: 'Mobile Users', value: 'Mobile Users' },
                    ],
                    selectedValues: audienceFilter,
                    onChange: setAudienceFilter,
                  },
                ]}
                searchValue={''}
                onSearchChange={() => {}}
                searchPlaceholder="Search positions..."
              />

              <Table
                columns={[
                  { key: 'id', header: 'ID' },
                  { key: 'position', header: 'Ad Position' },
                  { key: 'proposition', header: 'Proposition' },
                  { key: 'mediaProduct', header: 'Media Product' },
                  { key: 'audience', header: 'Audience' },
                  { key: 'impressions', header: 'Impressions' },
                  { key: 'clicks', header: 'Clicks' },
                  { key: 'ctr', header: 'CTR' },
                  { key: 'revenue', header: 'Revenue' },
                  {
                    key: 'fillRate',
                    header: 'Fill Rate',
                    render: row => {
                      const rate = parseInt(row.fillRate);
                      const variant = rate >= 90 ? 'success' : rate >= 80 ? 'warning' : 'destructive';
                      return <Badge variant={variant}>{row.fillRate}</Badge>;
                    }
                  },
                  { key: 'cpm', header: 'CPM' },
                ]}
                data={filteredMediaPositions}
                rowKey={row => row.id}
              />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  },
};
