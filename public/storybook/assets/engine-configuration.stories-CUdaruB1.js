import{u as H,r as t,j as a,M as $}from"./iframe-CHTXZqHT.js";import{A as M,g as W}from"./theme-navigation-BcyViLA5.js";import{C as v,b as h,M as z,a as G}from"./card-CW8PFIxP.js";import{T as J,a as y}from"./tabs-ClhE1p3r.js";import{T as C}from"./table-DrEY2q0Z.js";import{V as _}from"./viewbar-DPpBQl-b.js";import{B as r}from"./badge-tQgOHfzk.js";import{B as X}from"./bar-chart-DBp_qYjn.js";import{D as Y}from"./date-picker-BgzZ_azE.js";import{F as q}from"./filter-bar-CaS_Bt0m.js";import"./preload-helper-PPVm8Dsz.js";import"./side-navigation-BKWT2_cu.js";import"./utils-CBfrqCZ4.js";import"./render-icon-DLL_fxGu.js";import"./createLucideIcon-C4RkYYok.js";import"./store-BXFWTEpu.js";import"./monitor-speaker-DnNpYfke.js";import"./users-DRel-cDy.js";import"./trending-up-DZqTHBJe.js";import"./settings-2-C7xvQLBW.js";import"./settings-DkrSMDF7.js";import"./user-C3Gu_d3T.js";import"./use-menu-Cb1XFWEg.js";import"./chevron-down-D0T9YktY.js";import"./chevron-right-Nj7-Lm2e.js";import"./dropdown-menu-BpjMxfKo.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-Csd0mXSg.js";import"./index-DIhyg6RD.js";import"./index-IS2wP4Ks.js";import"./index-C9_Qsora.js";import"./Combination-Cg5hGoMc.js";import"./index-Dv4mTO0q.js";import"./index-B01eqHDT.js";import"./index-BFaNEU3W.js";import"./checkbox-Bt-gaoCs.js";import"./index-BsF0p07j.js";import"./check-B9DH0HFd.js";import"./circle-CrkDz0bp.js";import"./logo-BGub6yyu.js";import"./smart-breadcrumbs-Bs7JPvF7.js";import"./breadcrumb-CNlyx9Sf.js";import"./button-6Pp8Vv4a.js";import"./index-CdJFUDDL.js";import"./default-routes-CqolUEBP.js";import"./page-header-BMlOf-ka.js";import"./building-2-BMUkMO_5.js";import"./ellipsis-DKuwGljM.js";import"./square-pen-D0K0PKK1.js";import"./header-actions-DPgT4HM3.js";import"./popover-BELfsOx9.js";import"./search-EiEHQMi5.js";import"./CategoricalChart-DMCpQKy-.js";import"./index-B4jz1kAT.js";import"./LineChart-BR6VPFG6.js";import"./ActivePoints-AM0bOTXX.js";import"./LabelList-DWPvemlA.js";import"./ErrorBar-DjEocbtv.js";import"./CartesianChart-C_l70-Uh.js";import"./chevron-up-CbPA-AJK.js";import"./chart-ab10WLMc.js";import"./YAxis-C988ic64.js";import"./tooltipContext-jA5Ps9Ah.js";import"./chevron-left-CTaZX9rv.js";import"./filter--lPtKJh6.js";import"./x-CFpX2Oyw.js";import"./search-input-Hq_yClba.js";import"./input-C563dLlj.js";const Va={title:"Page templates/Engine Configuration",component:M,parameters:{layout:"fullscreen",docs:{description:{component:`
# Engine Configuration Page Template

The Engine Configuration page template provides comprehensive configuration management for different advertising engines. It serves as the main interface for configuring and managing engine-specific settings.

## Features

- **Interactive Metric Cards**: Display key configuration metrics and status
- **Dynamic Chart Visualization**: Bar chart showing configuration performance
- **Tabbed Data Tables**: Switch between different configuration sections
- **Real-time Configuration**: Live configuration status indicators
- **Engine-Specific Settings**: Customized configuration options per engine type

## Engine Types

### Supported Engines
- **Sponsored Products**: Product advertising configuration
- **Display**: Display advertising configuration
- **Digital In-store**: Digital in-store advertising configuration
- **Offline In-store**: Offline in-store advertising configuration

## Layout Structure

### Top Configuration Cards (4 cards)
- **Configuration Status**: Overall configuration completeness
- **Active Rules**: Number of active configuration rules
- **Performance**: Configuration performance metrics
- **Last Updated**: Configuration update timestamps

### Configuration Tables
- **Rules**: Configuration rules and settings
- **Templates**: Configuration templates
- **History**: Configuration change history

## Usage

This template is ideal for:
- Engine configuration management
- Settings and rules administration
- Configuration performance monitoring
- Template and rule management
        `}}},tags:["autodocs"]},V=n=>{const i=parseFloat(n.replace("%",""));return i>=100?"success":i>=90?"secondary":"destructive"},Q=[{id:"RULE-001",name:"Product Category Targeting",status:"Active",priority:"High",lastUpdated:"2024-01-15",performance:"98%",templates:3},{id:"RULE-002",name:"Audience Segmentation",status:"Active",priority:"Medium",lastUpdated:"2024-01-12",performance:"94%",templates:2},{id:"RULE-003",name:"Budget Optimization",status:"Paused",priority:"Low",lastUpdated:"2024-01-10",performance:"87%",templates:1}],Z=[{id:"TEMP-001",name:"Standard Product Template",category:"Product",status:"Active",usageCount:45,lastModified:"2024-01-14",performance:"96%"},{id:"TEMP-002",name:"Seasonal Campaign Template",category:"Campaign",status:"Active",usageCount:23,lastModified:"2024-01-13",performance:"89%"}],ee=(n,i,s,m)=>[{day:"Mon",planned:120,achieved:98},{day:"Tue",planned:130,achieved:142},{day:"Wed",planned:140,achieved:125},{day:"Thu",planned:125,achieved:138},{day:"Fri",planned:150,achieved:167},{day:"Sat",planned:160,achieved:155},{day:"Sun",planned:145,achieved:134}].map(o=>({...o,[n]:o.achieved})),ae=n=>({[n]:{label:n.charAt(0).toUpperCase()+n.slice(1),color:"hsl(var(--chart-1))"},planned:{label:"Planned",color:"hsl(var(--chart-2))"}}),p=(n,i,s)=>({render:()=>{const{theme:m}=H(),o=W(m||"retailMedia"),[l,T]=t.useState(s[0]?.id||"configurations"),[b,f]=t.useState("rules"),[te,ne]=t.useState("last-month"),[x,P]=t.useState({from:new Date(Date.now()-720*60*60*1e3),to:new Date}),[R,A]=t.useState(14),[D,j]=t.useState([]),[L,U]=t.useState([]),[k,w]=t.useState(""),[E,O]=t.useState([]),[I,N]=t.useState([]),F=ee(l),B=ae(l),K=s.find(e=>e.id===l);return a.jsx($,{children:a.jsx(M,{routes:o,logo:{src:"/gambit-logo.svg",alt:"Gambit Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:`${i} Configuration`,subtitle:`Manage ${n} engine configuration settings and rules`,headerRight:a.jsx(Y,{dateRange:x,onDateRangeChange:P,placeholder:"Pick a date range with conversion window",showConversionWindow:!0,conversionWindow:R,onConversionWindowChange:A,showPresets:!0}),onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")},children:a.jsxs("div",{className:"space-y-6",children:[a.jsx(v,{children:a.jsxs(h,{className:"space-y-6 pt-6",children:[a.jsx("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:s.map(e=>a.jsx(z,{label:e.label,value:e.value,subMetric:e.subMetric,badgeValue:e.badgeValue,badgeVariant:e.badgeVariant,isSelected:l===e.id,onClick:()=>T(e.id)},e.id))}),a.jsxs("div",{children:[a.jsxs("h3",{className:"text-lg font-semibold mb-4",children:[K?.label||"Configuration"," Performance"]}),a.jsx(X,{data:F,config:B,showLegend:!0,showGrid:!0,showTooltip:!0,showXAxis:!0,showYAxis:!0,className:"h-80 aspect-auto",xAxisDataKey:"day"})]})]})}),a.jsxs(v,{children:[a.jsx(G,{children:a.jsx(_,{labels:[],tabs:[{value:"rules",label:"Configuration Rules"},{value:"templates",label:"Templates"}],activeTab:b,onTabChange:f})}),a.jsxs(h,{children:[a.jsx("div",{className:"mb-4",children:a.jsx(q,{filters:[{name:"Status",options:[{label:"Active",value:"active"},{label:"Paused",value:"paused"},{label:"Draft",value:"draft"},{label:"Archived",value:"archived"}],selectedValues:D,onChange:j},{name:"Priority",options:[{label:"High",value:"high"},{label:"Medium",value:"medium"},{label:"Low",value:"low"}],selectedValues:L,onChange:U}],searchValue:k,onSearchChange:w,searchPlaceholder:"Search configuration rules, templates..."})}),a.jsxs(J,{value:b,onValueChange:f,className:"w-full",children:[a.jsx(y,{value:"rules",className:"mt-0",children:a.jsx(C,{columns:[{key:"name",header:"Name"},{key:"id",header:"ID"},{key:"status",header:"Status",render:e=>a.jsx(r,{variant:e.status==="Active"?"success":"secondary",children:e.status})},{key:"priority",header:"Priority",render:e=>a.jsx(r,{variant:e.priority==="High"?"destructive":e.priority==="Medium"?"secondary":"outline",children:e.priority})},{key:"performance",header:"Performance",render:e=>a.jsx(r,{variant:V(e.performance),children:e.performance})},{key:"templates",header:"Templates",render:e=>a.jsx(r,{variant:"secondary",children:e.templates})},{key:"lastUpdated",header:"Last Updated"}],data:Q,rowKey:e=>`${e.id}-${e.name}`,hideActions:!0,rowClassName:()=>"cursor-pointer",onRowClick:e=>{console.log("Navigate to rule details for",e.name)},rowSelection:{selectedKeys:E,onChange:O,getKey:e=>`${e.id}-${e.name}`}})}),a.jsx(y,{value:"templates",className:"mt-0",children:a.jsx(C,{columns:[{key:"name",header:"Name"},{key:"id",header:"ID"},{key:"category",header:"Category"},{key:"status",header:"Status",render:e=>a.jsx(r,{variant:e.status==="Active"?"success":"secondary",children:e.status})},{key:"usageCount",header:"Usage Count",render:e=>a.jsx(r,{variant:"secondary",children:e.usageCount})},{key:"performance",header:"Performance",render:e=>a.jsx(r,{variant:V(e.performance),children:e.performance})},{key:"lastModified",header:"Last Modified"}],data:Z,rowKey:e=>e.id,hideActions:!0,rowClassName:()=>"cursor-pointer",onRowClick:e=>{console.log("Navigate to template details for",e.name)},rowSelection:{selectedKeys:I,onChange:N,getKey:e=>e.id}})})]})]})]})]})})})}}),c=p("sponsored-products","Sponsored Products",[{id:"configurations",label:"Active Configurations",value:"24",subMetric:"Rules: 18",badgeValue:"+3",badgeVariant:"success"},{id:"rules",label:"Configuration Rules",value:"18",subMetric:"Templates: 12",badgeValue:"+2",badgeVariant:"success"},{id:"performance",label:"Config Performance",value:"94.2%",subMetric:"Uptime: 99.8%",badgeValue:"+1.2%",badgeVariant:"success"},{id:"updated",label:"Last Updated",value:"2h ago",subMetric:"Auto-sync: On",badgeValue:"Live",badgeVariant:"secondary"}]),d=p("display","Display",[{id:"configurations",label:"Active Configurations",value:"16",subMetric:"Rules: 12",badgeValue:"+1",badgeVariant:"success"},{id:"rules",label:"Configuration Rules",value:"12",subMetric:"Templates: 8",badgeValue:"+1",badgeVariant:"success"},{id:"performance",label:"Config Performance",value:"91.8%",subMetric:"Uptime: 99.5%",badgeValue:"+0.8%",badgeVariant:"success"},{id:"updated",label:"Last Updated",value:"1h ago",subMetric:"Auto-sync: On",badgeValue:"Live",badgeVariant:"secondary"}]),u=p("digital-instore","Digital In-store",[{id:"configurations",label:"Active Configurations",value:"32",subMetric:"Rules: 28",badgeValue:"+4",badgeVariant:"success"},{id:"rules",label:"Configuration Rules",value:"28",subMetric:"Templates: 15",badgeValue:"+3",badgeVariant:"success"},{id:"performance",label:"Config Performance",value:"96.5%",subMetric:"Uptime: 99.9%",badgeValue:"+2.1%",badgeVariant:"success"},{id:"updated",label:"Last Updated",value:"30m ago",subMetric:"Auto-sync: On",badgeValue:"Live",badgeVariant:"secondary"}]),g=p("offline-instore","Offline In-store",[{id:"configurations",label:"Active Configurations",value:"19",subMetric:"Rules: 14",badgeValue:"+2",badgeVariant:"success"},{id:"rules",label:"Configuration Rules",value:"14",subMetric:"Templates: 9",badgeValue:"+1",badgeVariant:"success"},{id:"performance",label:"Config Performance",value:"89.7%",subMetric:"Uptime: 98.8%",badgeValue:"-0.3%",badgeVariant:"destructive"},{id:"updated",label:"Last Updated",value:"4h ago",subMetric:"Auto-sync: On",badgeValue:"Live",badgeVariant:"secondary"}]);c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`createEngineConfigurationStory('sponsored-products', 'Sponsored Products', [{
  id: 'configurations',
  label: 'Active Configurations',
  value: '24',
  subMetric: 'Rules: 18',
  badgeValue: '+3',
  badgeVariant: 'success' as const
}, {
  id: 'rules',
  label: 'Configuration Rules',
  value: '18',
  subMetric: 'Templates: 12',
  badgeValue: '+2',
  badgeVariant: 'success' as const
}, {
  id: 'performance',
  label: 'Config Performance',
  value: '94.2%',
  subMetric: 'Uptime: 99.8%',
  badgeValue: '+1.2%',
  badgeVariant: 'success' as const
}, {
  id: 'updated',
  label: 'Last Updated',
  value: '2h ago',
  subMetric: 'Auto-sync: On',
  badgeValue: 'Live',
  badgeVariant: 'secondary' as const
}])`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`createEngineConfigurationStory('display', 'Display', [{
  id: 'configurations',
  label: 'Active Configurations',
  value: '16',
  subMetric: 'Rules: 12',
  badgeValue: '+1',
  badgeVariant: 'success' as const
}, {
  id: 'rules',
  label: 'Configuration Rules',
  value: '12',
  subMetric: 'Templates: 8',
  badgeValue: '+1',
  badgeVariant: 'success' as const
}, {
  id: 'performance',
  label: 'Config Performance',
  value: '91.8%',
  subMetric: 'Uptime: 99.5%',
  badgeValue: '+0.8%',
  badgeVariant: 'success' as const
}, {
  id: 'updated',
  label: 'Last Updated',
  value: '1h ago',
  subMetric: 'Auto-sync: On',
  badgeValue: 'Live',
  badgeVariant: 'secondary' as const
}])`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`createEngineConfigurationStory('digital-instore', 'Digital In-store', [{
  id: 'configurations',
  label: 'Active Configurations',
  value: '32',
  subMetric: 'Rules: 28',
  badgeValue: '+4',
  badgeVariant: 'success' as const
}, {
  id: 'rules',
  label: 'Configuration Rules',
  value: '28',
  subMetric: 'Templates: 15',
  badgeValue: '+3',
  badgeVariant: 'success' as const
}, {
  id: 'performance',
  label: 'Config Performance',
  value: '96.5%',
  subMetric: 'Uptime: 99.9%',
  badgeValue: '+2.1%',
  badgeVariant: 'success' as const
}, {
  id: 'updated',
  label: 'Last Updated',
  value: '30m ago',
  subMetric: 'Auto-sync: On',
  badgeValue: 'Live',
  badgeVariant: 'secondary' as const
}])`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`createEngineConfigurationStory('offline-instore', 'Offline In-store', [{
  id: 'configurations',
  label: 'Active Configurations',
  value: '19',
  subMetric: 'Rules: 14',
  badgeValue: '+2',
  badgeVariant: 'success' as const
}, {
  id: 'rules',
  label: 'Configuration Rules',
  value: '14',
  subMetric: 'Templates: 9',
  badgeValue: '+1',
  badgeVariant: 'success' as const
}, {
  id: 'performance',
  label: 'Config Performance',
  value: '89.7%',
  subMetric: 'Uptime: 98.8%',
  badgeValue: '-0.3%',
  badgeVariant: 'destructive' as const
}, {
  id: 'updated',
  label: 'Last Updated',
  value: '4h ago',
  subMetric: 'Auto-sync: On',
  badgeValue: 'Live',
  badgeVariant: 'secondary' as const
}])`,...g.parameters?.docs?.source}}};const Ma=["SponsoredProducts","Display","DigitalInstore","OfflineInstore"];export{u as DigitalInstore,d as Display,g as OfflineInstore,c as SponsoredProducts,Ma as __namedExportsOrder,Va as default};
