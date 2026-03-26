import{R as l}from"./radar-chart-C_Vw0HtK.js";import"./iframe-DIN2IKqe.js";import"./preload-helper-PPVm8Dsz.js";import"./chart-rzmzZjqz.js";import"./utils-CBfrqCZ4.js";import"./index-C8pd1VWv.js";import"./index-D93m9KRt.js";import"./CategoricalChart-DEJkm08c.js";import"./index-DYJKWAa-.js";import"./PolarChart-Bh9pZs18.js";import"./ActivePoints-CJfZ-mD2.js";import"./LabelList-BthFzM8w.js";const S={title:"Charts/Radar Chart",component:l,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{showTooltip:{control:"boolean"},showLegend:{control:"boolean"},showGrid:{control:"boolean"},showAngleAxis:{control:"boolean"},showRadiusAxis:{control:"boolean"},outerRadius:{control:{type:"range",min:50,max:150,step:5}}}},n=[{subject:"JavaScript",skillA:90,skillB:75},{subject:"React",skillA:85,skillB:80},{subject:"TypeScript",skillA:80,skillB:70},{subject:"Node.js",skillA:75,skillB:85},{subject:"Python",skillA:70,skillB:90},{subject:"Design",skillA:60,skillB:95}],i={skillA:{label:"Developer A",color:"hsl(var(--chart-1))"},skillB:{label:"Developer B",color:"hsl(var(--chart-2))"}},e={args:{data:n,config:i,showLegend:!0,className:"h-[300px]"}},o={args:{data:n,config:i,showLegend:!0}},s={args:{data:n,config:i,showLegend:!0,showRadiusAxis:!0}},r={args:{data:n,config:i,showLegend:!0,outerRadius:120}},d=[{subject:"Speed",frontend:85,backend:78,mobile:92},{subject:"Reliability",frontend:90,backend:95,mobile:88},{subject:"Security",frontend:78,backend:92,mobile:85},{subject:"Scalability",frontend:82,backend:88,mobile:75},{subject:"Usability",frontend:95,backend:70,mobile:90},{subject:"Performance",frontend:88,backend:85,mobile:82}],u={frontend:{label:"Frontend",color:"hsl(221, 83%, 53%)"},backend:{label:"Backend",color:"hsl(142, 76%, 36%)"},mobile:{label:"Mobile",color:"hsl(262, 83%, 58%)"}},a={args:{data:d,config:u,showLegend:!0}},p=[{subject:"Price",productA:60,productB:80,productC:40},{subject:"Quality",productA:85,productB:90,productC:70},{subject:"Features",productA:75,productB:85,productC:95},{subject:"Support",productA:90,productB:70,productC:80},{subject:"Ease of Use",productA:80,productB:75,productC:85},{subject:"Documentation",productA:70,productB:85,productC:90}],m={productA:{label:"Product A",color:"hsl(173, 58%, 39%)"},productB:{label:"Product B",color:"hsl(43, 74%, 49%)"},productC:{label:"Product C",color:"hsl(346, 87%, 43%)"}},t={args:{data:p,config:m,showLegend:!0,showRadiusAxis:!0}},g=[{subject:"Communication",team:85},{subject:"Technical Skills",team:90},{subject:"Problem Solving",team:88},{subject:"Creativity",team:75},{subject:"Leadership",team:80},{subject:"Collaboration",team:92}],b={team:{label:"Team Average",color:"hsl(262, 83%, 58%)"}},c={args:{data:g,config:b,showRadiusAxis:!0}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true,
    className: "h-[300px]"
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true,
    showRadiusAxis: true
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    data: skillsData,
    config: skillsConfig,
    showLegend: true,
    outerRadius: 120
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    data: performanceData,
    config: performanceConfig,
    showLegend: true
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: productData,
    config: productConfig,
    showLegend: true,
    showRadiusAxis: true
  }
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: teamData,
    config: teamConfig,
    showRadiusAxis: true
  }
}`,...c.parameters?.docs?.source}}};const y=["Default","WithLegend","WithRadiusAxis","LargeRadius","PerformanceMetrics","ProductComparison","TeamAssessment"];export{e as Default,r as LargeRadius,a as PerformanceMetrics,t as ProductComparison,c as TeamAssessment,o as WithLegend,s as WithRadiusAxis,y as __namedExportsOrder,S as default};
