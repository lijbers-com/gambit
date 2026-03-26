import{j as s,r as p}from"./iframe-kMwc57NQ.js";import{M as v}from"./metric-row-Bzlqeo1-.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./card-BpNbW0TJ.js";import"./badge-DnexhppF.js";import"./index-CdJFUDDL.js";import"./CategoricalChart-CkmlGLMZ.js";import"./index-DPrKCq_X.js";import"./LineChart-gv1Vn-q8.js";import"./ActivePoints-BJlB1V6I.js";import"./LabelList-l5Dg6IZj.js";import"./ErrorBar-Cr-Qrlp6.js";import"./CartesianChart-DUVTQcLe.js";import"./dialog-DFDhQjtE.js";import"./index-D7SK3Ahl.js";import"./index-CDK8-NUj.js";import"./index-Bo3Clklg.js";import"./index-DOXTHwO9.js";import"./index-BoqR-WWR.js";import"./index-BBE6OHCH.js";import"./index-c72aXvQd.js";import"./Combination-C5MNOf4_.js";import"./index-Bi6bXTBS.js";import"./index-DjVb1jZ5.js";import"./x-DZvc5uvK.js";import"./createLucideIcon-SSdVYwtx.js";import"./plus-DKxtJOP3.js";const a={sales:[{value:95},{value:142},{value:128},{value:175},{value:188},{value:210}],spend:[{value:38},{value:41},{value:39},{value:43},{value:42},{value:45}],roas:[{value:2.5},{value:3.5},{value:3.3},{value:4.1},{value:4.5},{value:4.7}],iroas:[{value:2.2},{value:3.1},{value:2.9},{value:3.7},{value:4},{value:4.2}],reach:[{value:420},{value:580},{value:540},{value:720},{value:780},{value:850}],ctr:[{value:3.2},{value:4.1},{value:3.9},{value:5.2},{value:5.5},{value:5.9}],conversionRate:[{value:2.1},{value:2.9},{value:2.6},{value:3.5},{value:3.8},{value:4.1}],cpa:[{value:32},{value:27},{value:29},{value:23},{value:21},{value:19}]},r=[{key:"sales",label:"Total Sales",value:"€200K",badgeValue:"+78%",badgeVariant:"success",graphData:a.sales,graphColor:"hsl(142, 76%, 36%)"},{key:"spend",label:"Total Spend",value:"€42.5K",badgeValue:"85% of budget",badgeVariant:"default",graphData:a.spend,graphColor:"hsl(221, 83%, 53%)"},{key:"roas",label:"ROAS",value:"4.7x",badgeValue:"+0.8x",badgeVariant:"success",graphData:a.roas,graphColor:"hsl(262, 83%, 58%)"},{key:"iroas",label:"iROAS",value:"4.2x",badgeValue:"+1.4x",badgeVariant:"success",graphData:a.iroas,graphColor:"hsl(262, 83%, 58%)"},{key:"reach",label:"Reach",value:"850K",badgeValue:"+102%",badgeVariant:"success",graphData:a.reach,graphColor:"hsl(142, 76%, 36%)"},{key:"ctr",label:"Click-through Rate",value:"5.8%",badgeValue:"+53%",badgeVariant:"success",graphData:a.ctr,graphColor:"hsl(262, 83%, 58%)"},{key:"conversionRate",label:"Conversion Rate",value:"4.0%",badgeValue:"+60%",badgeVariant:"success",graphData:a.conversionRate,graphColor:"hsl(262, 83%, 58%)"},{key:"cpa",label:"Cost per Acquisition",value:"€18",badgeValue:"-36%",badgeVariant:"success",graphData:a.cpa,graphColor:"hsl(221, 83%, 53%)"}],P={title:"UI/Metric Row",component:v,parameters:{layout:"padded",docs:{description:{component:"A configurable row of metric cards with add and remove functionality. Users can select which metrics to display from a pool of available metrics."}}},argTypes:{maxVisible:{control:{type:"number",min:2,max:6},description:"Maximum number of visible metric cards"}}},i={args:{metrics:r,selectedKeys:["sales","spend","roas"],maxVisible:4}},l={args:{metrics:r,selectedKeys:["sales","spend","roas","iroas"],maxVisible:5}},o={args:{metrics:r,selectedKeys:["sales"],maxVisible:4}},c={args:{metrics:r.slice(0,4),selectedKeys:["sales","spend","roas","iroas"],maxVisible:4},parameters:{docs:{description:{story:"When all slots are filled, the add button is hidden."}}}},b=()=>{const[e,t]=p.useState(["sales","spend","roas"]);return s.jsxs("div",{className:"space-y-4",children:[s.jsxs("p",{className:"text-sm text-muted-foreground",children:["Selected: ",e.join(", ")," | Hover over a card to see the remove button."]}),s.jsx(v,{metrics:r,selectedKeys:e,onSelectionChange:t,maxVisible:4})]})},n={render:()=>s.jsx(b,{}),parameters:{docs:{description:{story:"Fully interactive example with controlled state. Add and remove metrics dynamically."}}}},d={args:{metrics:r.slice(0,4).map(e=>({...e,variant:"default"})),selectedKeys:["sales","spend","roas","iroas"],maxVisible:5,defaultVariant:"default",removable:!1},parameters:{docs:{description:{story:"Metric cards with the default variant (no sparklines). Cards are not removable."}}}},h=()=>{const[e]=p.useState(["sales","spend","roas","iroas"]),[t,g]=p.useState("sales");return s.jsxs("div",{className:"space-y-4",children:[s.jsxs("p",{className:"text-sm text-muted-foreground",children:["Active metric: ",t??"none"," | Click a card to toggle its selection indicator."]}),s.jsx(v,{metrics:r,selectedKeys:e,maxVisible:5,defaultVariant:"default",removable:!1,activeKey:t,onActiveKeyChange:g})]})},m={render:()=>s.jsx(h,{}),parameters:{docs:{description:{story:"Cards with active selection indicator (arrow). Click a card to select it for chart filtering. Used in campaign detail templates."}}}},y=[{key:"ctr",label:"Click-Through Rate",value:"2.14%",subMetric:"vs. 1.98% last period",badgeValue:"+8.1%",badgeVariant:"success"},{key:"convRate",label:"Conversion Rate",value:"3.84%",subMetric:"1,156 conversions",badgeValue:"+12.8%",badgeVariant:"success"},{key:"cpc",label:"Cost Per Click",value:"$0.45",subMetric:"vs. $0.52 target",badgeValue:"-13.5%",badgeVariant:"success"},{key:"viewability",label:"Viewability Rate",value:"89.2%",subMetric:"Above industry avg",badgeValue:"+6.4%",badgeVariant:"success"},{key:"brandLift",label:"Brand Lift",value:"+16.8%",subMetric:"Awareness increase",badgeValue:"High",badgeVariant:"info"},{key:"sov",label:"Share of Voice",value:"29.5%",subMetric:"In category",badgeValue:"+1.8%",badgeVariant:"secondary"}],u={args:{metrics:r.slice(0,4).map(e=>({...e,variant:"default"})),selectedKeys:["sales","spend","roas","iroas"],maxVisible:5,defaultVariant:"default",removable:!1,dialogMetrics:y,onDialogMetricClick:e=>console.log(`${e} selected from dialog`)},parameters:{docs:{description:{story:"Static display with non-removable cards and a dialog showing additional metrics. The dialog metrics are separate from the visible pool."}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    metrics: allMetrics,
    selectedKeys: ['sales', 'spend', 'roas'],
    maxVisible: 4
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    metrics: allMetrics,
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 5
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    metrics: allMetrics,
    selectedKeys: ['sales'],
    maxVisible: 4
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    metrics: allMetrics.slice(0, 4),
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 4
  },
  parameters: {
    docs: {
      description: {
        story: 'When all slots are filled, the add button is hidden.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <InteractiveTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive example with controlled state. Add and remove metrics dynamically.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    metrics: allMetrics.slice(0, 4).map(m => ({
      ...m,
      variant: 'default' as const
    })),
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 5,
    defaultVariant: 'default',
    removable: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Metric cards with the default variant (no sparklines). Cards are not removable.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <WithActiveSelectionTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'Cards with active selection indicator (arrow). Click a card to select it for chart filtering. Used in campaign detail templates.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    metrics: allMetrics.slice(0, 4).map(m => ({
      ...m,
      variant: 'default' as const
    })),
    selectedKeys: ['sales', 'spend', 'roas', 'iroas'],
    maxVisible: 5,
    defaultVariant: 'default',
    removable: false,
    dialogMetrics: dialogOnlyMetrics,
    onDialogMetricClick: (key: string) => console.log(\`\${key} selected from dialog\`)
  },
  parameters: {
    docs: {
      description: {
        story: 'Static display with non-removable cards and a dialog showing additional metrics. The dialog metrics are separate from the visible pool.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};const z=["Default","FourMetrics","SingleMetric","MaxCapacity","Interactive","DefaultVariantCards","WithActiveSelection","StaticDisplayWithDialog"];export{i as Default,d as DefaultVariantCards,l as FourMetrics,n as Interactive,c as MaxCapacity,o as SingleMetric,u as StaticDisplayWithDialog,m as WithActiveSelection,z as __namedExportsOrder,P as default};
