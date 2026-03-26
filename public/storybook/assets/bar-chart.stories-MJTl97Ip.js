import{B as p}from"./bar-chart-D5Zq9Sgz.js";import"./iframe-B2sv3z--.js";import"./preload-helper-PPVm8Dsz.js";import"./chart-aky-PZdH.js";import"./utils-CBfrqCZ4.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./CategoricalChart-DMmfmZNY.js";import"./index-CL2-xB0p.js";import"./CartesianChart-CBLZ8Imy.js";import"./YAxis-Bwb_yRiV.js";import"./LabelList-DJ4XRvfB.js";import"./ErrorBar-DbhfJglL.js";import"./tooltipContext-NsQPOUQT.js";const B={title:"Charts/Bar Chart",component:p,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{showGrid:{control:"boolean"},showTooltip:{control:"boolean"},showLegend:{control:"boolean"},showXAxis:{control:"boolean"},showYAxis:{control:"boolean"},stacked:{control:"boolean"},horizontal:{control:"boolean"}}},e=[{month:"Jan",desktop:186,mobile:80},{month:"Feb",desktop:305,mobile:200},{month:"Mar",desktop:237,mobile:120},{month:"Apr",desktop:73,mobile:190},{month:"May",desktop:209,mobile:130},{month:"Jun",desktop:214,mobile:140}],a={desktop:{label:"Desktop",color:"hsl(var(--chart-1))"},mobile:{label:"Mobile",color:"hsl(var(--chart-2))"}},t={args:{data:e,config:a,showLegend:!0,className:"h-[300px]"}},o={args:{data:e,config:a,showLegend:!0,className:"h-[300px]"}},r={args:{data:e,config:a,stacked:!0,showLegend:!0,className:"h-[300px]"}},n={args:{data:e,config:a,horizontal:!0,showLegend:!0,className:"h-[300px]"}},s={args:{data:e,config:a,horizontal:!0,stacked:!0,showLegend:!0,className:"h-[300px]"}},h=[{month:"Jan",sales:12e3,target:15e3},{month:"Feb",sales:14e3,target:15e3},{month:"Mar",sales:16e3,target:15e3},{month:"Apr",sales:13e3,target:15e3},{month:"May",sales:18e3,target:15e3},{month:"Jun",sales:17e3,target:15e3}],u={sales:{label:"Sales",color:"hsl(142, 76%, 36%)"},target:{label:"Target",color:"hsl(43, 74%, 49%)"}},c={args:{data:h,config:u,showLegend:!0}},d=[{month:"Q1",engineering:45,marketing:25,sales:30},{month:"Q2",engineering:50,marketing:28,sales:35},{month:"Q3",engineering:48,marketing:30,sales:38},{month:"Q4",engineering:52,marketing:32,sales:40}],g={engineering:{label:"Engineering",color:"hsl(221, 83%, 53%)"},marketing:{label:"Marketing",color:"hsl(262, 83%, 58%)"},sales:{label:"Sales",color:"hsl(32, 95%, 44%)"}},l={args:{data:d,config:g,showLegend:!0}},m={args:{data:d,config:g,stacked:!0,showLegend:!0}},f=[{month:"Product A",value:275},{month:"Product B",value:200},{month:"Product C",value:187},{month:"Product D",value:173},{month:"Product E",value:90}],k={value:{label:"Sales",color:"hsl(173, 58%, 39%)"}},i={args:{data:f,config:k,horizontal:!0}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    stacked: true,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    horizontal: true,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    data: chartData,
    config: chartConfig,
    horizontal: true,
    stacked: true,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: salesData,
    config: salesConfig,
    showLegend: true
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: departmentData,
    config: departmentConfig,
    showLegend: true
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: departmentData,
    config: departmentConfig,
    stacked: true,
    showLegend: true
  }
}`,...m.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    data: productData,
    config: productConfig,
    horizontal: true
  }
}`,...i.parameters?.docs?.source}}};const H=["Default","WithLegend","Stacked","Horizontal","HorizontalStacked","SalesChart","DepartmentChart","DepartmentStacked","ProductComparison"];export{t as Default,l as DepartmentChart,m as DepartmentStacked,n as Horizontal,s as HorizontalStacked,i as ProductComparison,c as SalesChart,r as Stacked,o as WithLegend,H as __namedExportsOrder,B as default};
