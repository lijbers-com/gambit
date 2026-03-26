import{A as h}from"./area-chart-DPc8QJ37.js";import"./iframe-DvKL0w_9.js";import"./preload-helper-PPVm8Dsz.js";import"./chart-i0YdlviM.js";import"./utils-CBfrqCZ4.js";import"./index-c8TczyEf.js";import"./index-COxQYZsJ.js";import"./CategoricalChart-CXUfibb_.js";import"./index-BNw0aX4h.js";import"./CartesianChart-SWwegQ-C.js";import"./YAxis-DPuBzEXG.js";import"./LabelList-yszl33Na.js";import"./ActivePoints-DVkQZuaJ.js";const Q={title:"Charts/Area Chart",component:h,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{showGrid:{control:"boolean"},showTooltip:{control:"boolean"},showLegend:{control:"boolean"},showXAxis:{control:"boolean"},showYAxis:{control:"boolean"},stacked:{control:"boolean"},curved:{control:"boolean"}}},e=[{month:"Jan",desktop:186,mobile:80},{month:"Feb",desktop:305,mobile:200},{month:"Mar",desktop:237,mobile:120},{month:"Apr",desktop:73,mobile:190},{month:"May",desktop:209,mobile:130},{month:"Jun",desktop:214,mobile:140}],a={desktop:{label:"Desktop",color:"hsl(var(--chart-1))"},mobile:{label:"Mobile",color:"hsl(var(--chart-2))"}},r={args:{data:e,config:a,showLegend:!0,className:"h-[300px]"}},o={args:{data:e,config:a,showLegend:!0,className:"h-[300px]"}},s={args:{data:e,config:a,stacked:!0,showLegend:!0,className:"h-[300px]"}},t={args:{data:e,config:a,curved:!1,showLegend:!0,className:"h-[300px]"}},n={args:{data:e,config:a,showGrid:!1,showLegend:!0,className:"h-[300px]"}},c={args:{data:e,config:a,showXAxis:!1,showYAxis:!1,showGrid:!1,showLegend:!0}},u=[{month:"January",revenue:4200,expenses:2400},{month:"February",revenue:3800,expenses:2200},{month:"March",revenue:5200,expenses:2800},{month:"April",revenue:4600,expenses:2600},{month:"May",revenue:5800,expenses:3200},{month:"June",revenue:6200,expenses:3400}],f={revenue:{label:"Revenue",color:"hsl(142, 76%, 36%)"},expenses:{label:"Expenses",color:"hsl(346, 87%, 43%)"}},i={args:{data:u,config:f,showLegend:!0}},d=[{month:"Jan",sales:1200,marketing:800,support:600},{month:"Feb",sales:1400,marketing:900,support:700},{month:"Mar",sales:1100,marketing:750,support:650},{month:"Apr",sales:1600,marketing:1e3,support:800},{month:"May",sales:1800,marketing:1200,support:900},{month:"Jun",sales:2e3,marketing:1300,support:950}],g={sales:{label:"Sales",color:"hsl(221, 83%, 53%)"},marketing:{label:"Marketing",color:"hsl(262, 83%, 58%)"},support:{label:"Support",color:"hsl(32, 95%, 44%)"}},m={args:{data:d,config:g,showLegend:!0}},l={args:{data:d,config:g,stacked:!0,showLegend:!0}},w=[{month:"Q1",performance:85,target:90},{month:"Q2",performance:92,target:90},{month:"Q3",performance:88,target:90},{month:"Q4",performance:95,target:90}],x={performance:{label:"Performance",color:"hsl(173, 58%, 39%)"},target:{label:"Target",color:"hsl(43, 74%, 49%)"}},p={args:{data:w,config:x,showLegend:!0}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    stacked: true,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    curved: false,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showGrid: false,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showXAxis: false,
    showYAxis: false,
    showGrid: false,
    showLegend: true
  }
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    data: revenueData,
    config: revenueConfig,
    showLegend: true
  }
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: multiSeriesData,
    config: multiSeriesConfig,
    showLegend: true
  }
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: multiSeriesData,
    config: multiSeriesConfig,
    stacked: true,
    showLegend: true
  }
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    data: performanceData,
    config: performanceConfig,
    showLegend: true
  }
}`,...p.parameters?.docs?.source}}};const W=["Default","WithLegend","Stacked","Linear","WithoutGrid","MinimalAxes","RevenueChart","MultiSeries","MultiSeriesStacked","PerformanceChart"];export{r as Default,t as Linear,c as MinimalAxes,m as MultiSeries,l as MultiSeriesStacked,p as PerformanceChart,i as RevenueChart,s as Stacked,o as WithLegend,n as WithoutGrid,W as __namedExportsOrder,Q as default};
