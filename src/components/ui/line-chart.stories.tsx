import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChartComponent } from './line-chart';

const meta: Meta<typeof LineChartComponent> = {
  title: 'Charts/Line Chart',
  component: LineChartComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showGrid: {
      control: 'boolean',
    },
    showTooltip: {
      control: 'boolean',
    },
    showLegend: {
      control: 'boolean',
    },
    showXAxis: {
      control: 'boolean',
    },
    showYAxis: {
      control: 'boolean',
    },
    curved: {
      control: 'boolean',
    },
    showDots: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

export const Default: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const WithLegend: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const Linear: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    curved: false,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const WithoutDots: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showDots: false,
    showLegend: true,
    className: "h-[300px]",
  },
};

export const WithoutGrid: Story = {
  args: {
    data: chartData,
    config: chartConfig,
    showGrid: false,
    showLegend: true,
    className: "h-[300px]",
  },
};

// Stock price data
const stockData = [
  { month: "Jan", price: 120.50, volume: 1500 },
  { month: "Feb", price: 125.30, volume: 1800 },
  { month: "Mar", price: 118.90, volume: 2100 },
  { month: "Apr", price: 132.40, volume: 1900 },
  { month: "May", price: 128.70, volume: 1600 },
  { month: "Jun", price: 135.20, volume: 2000 },
];

const stockConfig = {
  price: {
    label: "Stock Price",
    color: "hsl(142, 76%, 36%)",
  },
  volume: {
    label: "Volume",
    color: "hsl(221, 83%, 53%)",
  },
};

export const StockChart: Story = {
  args: {
    data: stockData,
    config: stockConfig,
    showLegend: true,
  },
};

// Temperature data
const temperatureData = [
  { month: "Jan", temperature: 2, humidity: 65 },
  { month: "Feb", temperature: 5, humidity: 70 },
  { month: "Mar", temperature: 12, humidity: 60 },
  { month: "Apr", temperature: 18, humidity: 55 },
  { month: "May", temperature: 24, humidity: 50 },
  { month: "Jun", temperature: 28, humidity: 45 },
];

const temperatureConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(346, 87%, 43%)",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(221, 83%, 53%)",
  },
};

export const TemperatureChart: Story = {
  args: {
    data: temperatureData,
    config: temperatureConfig,
    showLegend: true,
  },
};

// Growth metrics
const growthData = [
  { month: "Q1", users: 1000, revenue: 5000, conversion: 2.5 },
  { month: "Q2", users: 1500, revenue: 8000, conversion: 3.2 },
  { month: "Q3", users: 2200, revenue: 12000, conversion: 3.8 },
  { month: "Q4", users: 3100, revenue: 18000, conversion: 4.1 },
];

const growthConfig = {
  users: {
    label: "Users",
    color: "hsl(173, 58%, 39%)",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(43, 74%, 49%)",
  },
  conversion: {
    label: "Conversion Rate",
    color: "hsl(262, 83%, 58%)",
  },
};

export const GrowthChart: Story = {
  args: {
    data: growthData,
    config: growthConfig,
    showLegend: true,
  },
};

// Interactive Forecast Chart with draggable line

export const InteractiveForecast: Story = {
  render: () => {
    const [spendValue, setSpendValue] = useState(30000);
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

    // Generate data points for the chart
    const generateForecastData = () => {
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
    };

    const forecastData = generateForecastData();
    const currentMetrics = calculateMetrics(spendValue);
    const dragPosition = ((spendValue - 10000) / 40000) * 100; // Convert spend back to percentage

    const forecastConfig = {
      roas: {
        label: "ROAS",
        color: "hsl(var(--chart-1))", // Theme chart color 1
      },
      revenue: {
        label: "Revenue",  
        color: "hsl(var(--chart-2))", // Theme chart color 2
      },
    };

    return (
      <div className="relative">
        <LineChartComponent
          data={forecastData}
          config={forecastConfig}
          showLegend={true}
          showGrid={true}
          showTooltip={true}
          showXAxis={true}
          showYAxis={true}
          className="h-[400px] w-full"
          xAxisDataKey="spend"
          yAxisLabel="Revenue"
          secondaryYAxis={{
            dataKey: "roas",
            domain: [0, 700],
            label: "ROAS"
          }}
        />
        
        {/* Interactive overlay */}
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
    );
  },
}; 