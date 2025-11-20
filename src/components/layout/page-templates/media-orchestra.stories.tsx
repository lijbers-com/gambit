import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AppLayout } from '../app-layout';
import { PageHeader } from '@/components/ui/page-header';
import { FilterBar } from '@/components/ui/filter-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChartComponent } from '@/components/ui/area-chart';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

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

export const Overview = {
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
