import{r as L,j as o}from"./iframe-B2sv3z--.js";import{L as D}from"./line-chart-CJpZ8IF_.js";import{C as V}from"./chevron-left-CE-9wMsK.js";import{C as F}from"./chevron-right-BMhUZwQf.js";import"./preload-helper-PPVm8Dsz.js";import"./chart-aky-PZdH.js";import"./utils-CBfrqCZ4.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./CategoricalChart-DMmfmZNY.js";import"./index-CL2-xB0p.js";import"./LineChart-DUPfY8Ep.js";import"./ActivePoints-DCUubk-2.js";import"./LabelList-DJ4XRvfB.js";import"./ErrorBar-DbhfJglL.js";import"./CartesianChart-CBLZ8Imy.js";import"./YAxis-Bwb_yRiV.js";import"./createLucideIcon-Bwht0sgB.js";const ie={title:"Charts/Line Chart",component:D,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{showGrid:{control:"boolean"},showTooltip:{control:"boolean"},showLegend:{control:"boolean"},showXAxis:{control:"boolean"},showYAxis:{control:"boolean"},curved:{control:"boolean"},showDots:{control:"boolean"}}},n=[{month:"Jan",desktop:186,mobile:80},{month:"Feb",desktop:305,mobile:200},{month:"Mar",desktop:237,mobile:120},{month:"Apr",desktop:73,mobile:190},{month:"May",desktop:209,mobile:130},{month:"Jun",desktop:214,mobile:140}],c={desktop:{label:"Desktop",color:"hsl(var(--chart-1))"},mobile:{label:"Mobile",color:"hsl(var(--chart-2))"}},i={args:{data:n,config:c,showLegend:!0,className:"h-[300px]"}},u={args:{data:n,config:c,showLegend:!0,className:"h-[300px]"}},d={args:{data:n,config:c,curved:!1,showLegend:!0,className:"h-[300px]"}},l={args:{data:n,config:c,showDots:!1,showLegend:!0,className:"h-[300px]"}},m={args:{data:n,config:c,showGrid:!1,showLegend:!0,className:"h-[300px]"}},T=[{month:"Jan",price:120.5,volume:1500},{month:"Feb",price:125.3,volume:1800},{month:"Mar",price:118.9,volume:2100},{month:"Apr",price:132.4,volume:1900},{month:"May",price:128.7,volume:1600},{month:"Jun",price:135.2,volume:2e3}],j={price:{label:"Stock Price",color:"hsl(142, 76%, 36%)"},volume:{label:"Volume",color:"hsl(221, 83%, 53%)"}},h={args:{data:T,config:j,showLegend:!0}},I=[{month:"Jan",temperature:2,humidity:65},{month:"Feb",temperature:5,humidity:70},{month:"Mar",temperature:12,humidity:60},{month:"Apr",temperature:18,humidity:55},{month:"May",temperature:24,humidity:50},{month:"Jun",temperature:28,humidity:45}],W={temperature:{label:"Temperature (°C)",color:"hsl(346, 87%, 43%)"},humidity:{label:"Humidity (%)",color:"hsl(221, 83%, 53%)"}},p={args:{data:I,config:W,showLegend:!0}},X=[{month:"Q1",users:1e3,revenue:5e3,conversion:2.5},{month:"Q2",users:1500,revenue:8e3,conversion:3.2},{month:"Q3",users:2200,revenue:12e3,conversion:3.8},{month:"Q4",users:3100,revenue:18e3,conversion:4.1}],O={users:{label:"Users",color:"hsl(173, 58%, 39%)"},revenue:{label:"Revenue",color:"hsl(43, 74%, 49%)"},conversion:{label:"Conversion Rate",color:"hsl(262, 83%, 58%)"}},g={args:{data:X,config:O,showLegend:!0}},v={render:()=>{const[R,C]=L.useState(3e4),[S,M]=L.useState(!1),N=t=>{const a=(t-1e4)/4e4,e=600,f=e-(e-100)*Math.pow(a,1/1.8),r=100,s=r+(500-r)*Math.pow(a,.6);return{spend:t,roas:Math.round(f),revenue:Math.round(s)}},A=(()=>{const t=[];for(let a=10;a<=50;a+=2){const e=N(a*1e3);t.push({spend:`${a}K`,spendValue:a*1e3,roas:e.roas,revenue:e.revenue})}return t})(),k=(R-1e4)/4e4*100,G={roas:{label:"ROAS",color:"hsl(var(--chart-1))"},revenue:{label:"Revenue",color:"hsl(var(--chart-2))"}};return o.jsxs("div",{className:"relative",children:[o.jsx(D,{data:A,config:G,curved:!0,showLegend:!0,showGrid:!0,showTooltip:!0,showXAxis:!0,showYAxis:!0,className:"h-[400px] w-full",xAxisDataKey:"spend",yAxisLabel:"Revenue",secondaryYAxis:{dataKey:"roas",domain:[0,700],label:"ROAS"}}),o.jsx("div",{className:"absolute inset-0",style:{cursor:S?"ew-resize":"crosshair",pointerEvents:"auto"},onMouseDown:t=>{t.preventDefault(),M(!0);const e=t.currentTarget.getBoundingClientRect(),w=e.width*.1,y=e.width*.05,f=e.width-w-y,r=s=>{const E=s-e.left-w,K=1e4+Math.max(0,Math.min(100,E/f*100))/100*4e4;C(Math.round(K))},x=s=>{r(s.clientX)},b=()=>{M(!1),document.removeEventListener("mousemove",x),document.removeEventListener("mouseup",b)};document.addEventListener("mousemove",x),document.addEventListener("mouseup",b),r(t.clientX)},children:o.jsx("div",{className:"absolute top-0 bottom-0 w-px bg-border pointer-events-none",style:{left:`${10+k*.85}%`,zIndex:10},children:o.jsxs("div",{className:"absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap",children:[o.jsx(V,{className:"w-4 h-4 mr-1 text-primary"}),o.jsxs("span",{className:"font-medium",children:["Spend amount $",(R/1e3).toFixed(0),"K"]}),o.jsx(F,{className:"w-4 h-4 ml-1 text-primary"})]})})})]})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...i.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    curved: false,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showDots: false,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showGrid: false,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    data: stockData,
    config: stockConfig,
    showLegend: true
  }
}`,...h.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    data: temperatureData,
    config: temperatureConfig,
    showLegend: true
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    data: growthData,
    config: growthConfig,
    showLegend: true
  }
}`,...g.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [spendValue, setSpendValue] = useState(30000);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate ROAS and Revenue based on spend using non-linear relationships
    const calculateMetrics = (spend: number) => {
      const spendRatio = (spend - 10000) / 40000; // Normalize spend to 0-1 range (10K-50K)

      // ROAS shows diminishing returns (exponential decay)
      // Starts high, decreases gradually
      const maxRoas = 600;
      const minRoas = 100;
      const roasDecayRate = 1.8; // Gentler decay (was 2.5)
      const roas = maxRoas - (maxRoas - minRoas) * Math.pow(spendRatio, 1 / roasDecayRate);

      // Revenue shows logarithmic growth (diminishing returns)
      // Increases more gradually at first, then slows down
      const baseRevenue = 100;
      const maxRevenue = 500;
      const revenueGrowthRate = 0.6; // Less steep curve (was 0.4)
      const revenue = baseRevenue + (maxRevenue - baseRevenue) * Math.pow(spendRatio, revenueGrowthRate);
      return {
        spend,
        roas: Math.round(roas),
        revenue: Math.round(revenue)
      };
    };

    // Generate data points for the chart
    const generateForecastData = () => {
      const data = [];
      for (let spend = 10; spend <= 50; spend += 2) {
        // 10K to 50K in 2K steps
        const metrics = calculateMetrics(spend * 1000);
        data.push({
          spend: \`\${spend}K\`,
          spendValue: spend * 1000,
          roas: metrics.roas,
          revenue: metrics.revenue
        });
      }
      return data;
    };
    const forecastData = generateForecastData();
    const currentMetrics = calculateMetrics(spendValue);
    const dragPosition = (spendValue - 10000) / 40000 * 100; // Convert spend back to percentage

    const forecastConfig = {
      roas: {
        label: "ROAS",
        color: "hsl(var(--chart-1))" // Theme chart color 1
      },
      revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))" // Theme chart color 2
      }
    };
    return <div className="relative">
        <LineChartComponent data={forecastData} config={forecastConfig} curved={true} showLegend={true} showGrid={true} showTooltip={true} showXAxis={true} showYAxis={true} className="h-[400px] w-full" xAxisDataKey="spend" yAxisLabel="Revenue" secondaryYAxis={{
        dataKey: "roas",
        domain: [0, 700],
        label: "ROAS"
      }} />
        
        {/* Interactive overlay */}
        <div className="absolute inset-0" style={{
        cursor: isDragging ? 'ew-resize' : 'crosshair',
        pointerEvents: 'auto'
      }} onMouseDown={e => {
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
          const percentage = Math.max(0, Math.min(100, x / chartWidth * 100));
          const newSpend = 10000 + percentage / 100 * 40000;
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
      }}>
          {/* Vertical indicator line */}
          <div className="absolute top-0 bottom-0 w-px bg-border pointer-events-none" style={{
          left: \`\${10 + dragPosition * 0.85}%\`,
          // Account for chart margins
          zIndex: 10
        }}>
            {/* Spend amount as central element with chevrons */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap">
              {/* Left chevron */}
              <ChevronLeft className="w-4 h-4 mr-1 text-primary" />
              
              {/* Spend amount */}
              <span className="font-medium">
                Spend amount \${(spendValue / 1000).toFixed(0)}K
              </span>
              
              {/* Right chevron */}
              <ChevronRight className="w-4 h-4 ml-1 text-primary" />
            </div>
          </div>
        </div>
      </div>;
  }
}`,...v.parameters?.docs?.source}}};const ue=["Default","WithLegend","Linear","WithoutDots","WithoutGrid","StockChart","TemperatureChart","GrowthChart","InteractiveForecast"];export{i as Default,g as GrowthChart,v as InteractiveForecast,d as Linear,h as StockChart,p as TemperatureChart,u as WithLegend,l as WithoutDots,m as WithoutGrid,ue as __namedExportsOrder,ie as default};
