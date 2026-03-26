import{u as Z,r as i,j as a,M as N}from"./iframe-B2sv3z--.js";import{A as T,g as ee}from"./theme-navigation-BNOnEcGS.js";import{C as F,a as H,b as W,c as ae}from"./card-CV9YZc92.js";import{T as z}from"./table-CNEeceD7.js";import{B as v}from"./badge-BuMlIxhD.js";import{F as V}from"./filter-bar-7qJjbfF8.js";import{B as G}from"./button-CuPAXXHd.js";import{C as X}from"./campaign-summary-BcenuCgz.js";import{a as m,D as ne}from"./date-picker-D5xY-lpC.js";import{A as $}from"./page-header-CB4H9ypj.js";import{d as Q}from"./default-routes-CqolUEBP.js";import"./preload-helper-PPVm8Dsz.js";import"./side-navigation-dbatG8sL.js";import"./utils-CBfrqCZ4.js";import"./render-icon-EYbjJv2z.js";import"./createLucideIcon-Bwht0sgB.js";import"./store-F7RDwBnd.js";import"./monitor-speaker-DOUMcHVE.js";import"./users-O13I7vWA.js";import"./trending-up-DIPn3Qxp.js";import"./settings-2-Dg95SXfj.js";import"./settings-DTWUPnnQ.js";import"./user-DWVaoi2S.js";import"./use-menu-COfJUJmr.js";import"./chevron-down-BepfQlRx.js";import"./chevron-right-BMhUZwQf.js";import"./dropdown-menu-CS3p5svP.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./index-ojs0XM5b.js";import"./index-G_2NqKkU.js";import"./index-BHEqwGAn.js";import"./index-BOcI3EBp.js";import"./Combination-CVHJjhEU.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./checkbox-DgACiBX7.js";import"./index-CG_rr0_2.js";import"./check-D5-eMeep.js";import"./circle-CA_9n80i.js";import"./logo-Cgnv_6es.js";import"./smart-breadcrumbs-C5KSSszP.js";import"./breadcrumb-BMOW2eJk.js";import"./header-actions-tRbzyRrb.js";import"./popover-BZWdwQcX.js";import"./search-CnB7SJuU.js";import"./building-2-DJtB2wEP.js";import"./CategoricalChart-DMmfmZNY.js";import"./index-CL2-xB0p.js";import"./LineChart-DUPfY8Ep.js";import"./ActivePoints-DCUubk-2.js";import"./LabelList-DJ4XRvfB.js";import"./ErrorBar-DbhfJglL.js";import"./CartesianChart-CBLZ8Imy.js";import"./ellipsis-DwDXQygk.js";import"./chevron-up-BAVTz51r.js";import"./index-CdJFUDDL.js";import"./filter-DQgXvjeP.js";import"./x-CbZ9gBzK.js";import"./search-input-DSX7Be2G.js";import"./input-ncBsZbtw.js";import"./label-D7LmVzfW.js";import"./switch-DMXwdGmW.js";import"./notification-item-DWU1zsYG.js";import"./circle-alert-Cq9aHOXQ.js";import"./sparkles-C62UWGSb.js";import"./dollar-sign-B65b2Dox.js";import"./globe-CcQ9wsjW.js";import"./square-pen-Xef5xhA3.js";import"./plus-B-5Hv10d.js";import"./info-BCz90tKB.js";import"./chevron-left-CE-9wMsK.js";const Ra={title:"Page templates/Campaign Overview",component:T,parameters:{layout:"fullscreen",docs:{description:{component:`
# Campaign Overview Page Template

The Campaign Overview page template provides a comprehensive table view of all campaigns with advanced filtering capabilities. It serves as the main campaign management interface for media partners.

## Features

- **Data Table**: Displays campaign information in a sortable, filterable table format
- **Advanced Filtering**: Multi-select filters for Status and Advertiser
- **Search Functionality**: Real-time search across campaign names
- **Status Badges**: Visual indicators for campaign status (Running, Ready, In option, Paused)
- **Quick Actions**: Edit, Export, Import, and Settings buttons in page header
- **Responsive Design**: Table adapts to different screen sizes

## Data Structure

Each campaign record includes:
- **ID**: Unique campaign identifier
- **Status**: Current campaign state with color-coded badges
- **Advertiser**: Campaign advertiser/client name
- **Name**: Campaign name
- **Line Items**: Number of associated line items (with badge)
- **Creatives**: Number of associated creatives (with badge)
- **Start/End Date**: Campaign runtime with proper date formatting

## Filter Options

### Status Filter
- **Running**: Currently active campaigns
- **Ready**: Approved campaigns ready to launch
- **In option**: Campaigns pending final approval
- **Paused**: Temporarily suspended campaigns

### Advertiser Filter
- Dynamic list of all advertisers in the system
- Multi-select capability for filtering multiple advertisers

## Usage

This template is ideal for:
- Campaign management dashboards
- Media partner campaign overviews
- Campaign performance monitoring
- Bulk campaign operations

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- FilterBar (filtering and search interface)
- Table (data display with sorting and actions)
- Badge (status and count indicators)
        `}}},tags:["autodocs"]},te=[{id:"C-001",status:"Running",advertiser:"Acme Media",name:"Holiday Sale",lineItems:5,creatives:3,placements:12,start:"2024-06-01",end:"2024-06-30",engines:["Display","Sponsored products"]},{id:"C-002",status:"Ready",advertiser:"BrandX",name:"Summer Launch",lineItems:2,creatives:1,placements:8,start:"2024-07-01",end:"2024-07-31",engines:["Digital in-store"]},{id:"C-003",status:"In option",advertiser:"MediaWorks",name:"Back to School",lineItems:4,creatives:2,placements:15,start:"2024-08-10",end:"2024-09-10",engines:["Sponsored products"]},{id:"C-004",status:"Paused",advertiser:"AdPartners",name:"Black Friday",lineItems:6,creatives:4,placements:20,start:"2024-11-01",end:"2024-11-30",engines:["Display","Digital in-store"]}],ie=d=>{switch(d){case"Running":return"default";case"Ready":return"secondary";case"In option":return"outline";case"Paused":return"destructive";default:return"outline"}},f=(d,y)=>({render:()=>{const{theme:b}=Z(),S=ee(b||"retailMedia"),[l,C]=i.useState([]),[g,t]=i.useState([]),[w,c]=i.useState("coca-cola"),o=te.filter(n=>{const h=l.length===0||l.includes(n.status.toLowerCase().replace(/ /g,"-")),r=g.length===0||g.includes(n.advertiser.toLowerCase().replace(/ /g,"-"));return h&&r});return a.jsx(N,{children:a.jsx(T,{routes:S,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:`Campaigns - ${y}`,subtitle:`Monitor ${d} campaign performance and manage your advertising initiatives`,onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),headerRight:a.jsx($,{value:w,onChange:c})},children:a.jsxs(F,{className:"w-full",children:[a.jsx(H,{children:a.jsx(V,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Ready",value:"ready"},{label:"In option",value:"in-option"},{label:"Paused",value:"paused"}],selectedValues:l,onChange:C},{name:"Advertiser",options:[{label:"Acme Media",value:"acme-media"},{label:"BrandX",value:"brandx"},{label:"MediaWorks",value:"mediaworks"},{label:"AdPartners",value:"adpartners"}],selectedValues:g,onChange:t}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:`Search ${d} campaigns...`})}),a.jsx(W,{children:a.jsx(z,{columns:[{key:"id",header:"ID"},{key:"status",header:"Status",render:n=>a.jsx(v,{variant:ie(n.status),children:n.status})},{key:"advertiser",header:"Advertiser"},{key:"name",header:"Name"},{key:"engines",header:"Engine",render:n=>a.jsx("div",{className:"flex flex-nowrap gap-1 whitespace-nowrap",children:n.engines.map((h,r)=>a.jsx(v,{variant:"outline",className:"text-xs whitespace-nowrap",children:h},r))})},{key:"lineItems",header:"Line items",render:n=>a.jsx(v,{variant:"secondary",children:n.lineItems})},{key:"creatives",header:"Creatives",render:n=>a.jsx(v,{variant:"secondary",children:n.creatives})},{key:"placements",header:"Placements",render:n=>a.jsx(v,{variant:"secondary",children:n.placements})},{key:"start",header:"Start date",render:n=>new Date(n.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:n=>new Date(n.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})}],data:o,rowKey:n=>n.id,onRowClick:n=>console.log(`Navigating to campaign: ${n.name} (${n.id})`)})})]})})})}}),x=f("all","All Engines"),A=f("sponsored products","Sponsored Products"),k=f("display","Display"),R=f("digital in-store","Digital In-Store"),B=f("offline instore","Offline Instore"),P=f("offsite","Offsite"),q=[{id:"C-001",campaignType:"sponsored-products",title:"Holiday Sale Campaign",badge:{text:"Best ROAS",variant:"default"},goal:"performance-transaction",estimatedRoas:"4.8x",budget:"$15,000",usedBudget:"$9,200",totalPrice:"$9,150",budgetUsagePercentage:61,placements:12,engines:[{id:"display",name:"Display",campaignName:"Holiday Banners",status:"running",enabled:!0},{id:"sponsored",name:"Sponsored products",campaignName:"Holiday Top Picks",status:"running",enabled:!0},{id:"digital",name:"Digital in-store",campaignName:"Holiday Screens",status:"ready",enabled:!0},{id:"offline",name:"Offline in-store",campaignName:"Holiday POS",status:"in-option",enabled:!0},{id:"offsite",name:"Offsite",campaignName:"Holiday Open Web",status:"draft",enabled:!0}],dateRange:{from:new Date("2024-06-01"),to:m(new Date("2024-06-01"),29)},features:[]},{id:"C-002",campaignType:"display",title:"Summer Launch Campaign",badge:{text:"High CTR",variant:"secondary"},goal:"brand-awareness",estimatedRoas:"3.2x",budget:"$8,500",usedBudget:"$2,100",totalPrice:"$2,125",budgetUsagePercentage:25,placements:8,engines:[{id:"display",name:"Display",campaignName:"Summer Banners",status:"running",enabled:!0},{id:"digital",name:"Digital in-store",campaignName:"Summer Kiosks",status:"ready",enabled:!0}],dateRange:{from:new Date("2024-07-01"),to:m(new Date("2024-07-01"),30)},features:[]},{id:"C-003",campaignType:"digital-instore",title:"Back to School Campaign",badge:{text:"In Option",variant:"outline"},goal:"customer-acquisition",estimatedRoas:"5.1x",budget:"$12,000",usedBudget:"$4,800",totalPrice:"$4,800",budgetUsagePercentage:40,placements:15,engines:[{id:"sponsored",name:"Sponsored products",campaignName:"Back to School Promos",status:"in-option",enabled:!0},{id:"digital",name:"Digital in-store",campaignName:"School Aisle Screens",status:"in-option",enabled:!0}],dateRange:{from:new Date("2024-08-10"),to:m(new Date("2024-08-10"),31)},features:[]},{id:"C-004",campaignType:"offline-instore",title:"Black Friday Campaign",badge:{text:"Paused",variant:"destructive"},goal:"performance-transaction",estimatedRoas:"6.2x",budget:"$25,000",usedBudget:"$22,800",totalPrice:"$22,750",budgetUsagePercentage:91,placements:20,engines:[{id:"display",name:"Display",campaignName:"BF Homepage Takeover",status:"paused",enabled:!0},{id:"sponsored",name:"Sponsored products",campaignName:"BF Deal Listings",status:"paused",enabled:!0},{id:"digital",name:"Digital in-store",campaignName:"BF Store Screens",status:"paused",enabled:!0},{id:"offline",name:"Offline in-store",campaignName:"BF Shelf Talkers",status:"paused",enabled:!0},{id:"offsite",name:"Offsite",campaignName:"BF Open Web",status:"new",enabled:!1}],dateRange:{from:new Date("2024-11-01"),to:m(new Date("2024-11-01"),29)},features:[]},{id:"C-005",campaignType:"display",title:"New Year Campaign",badge:{text:"Ready",variant:"secondary"},goal:"retargeting",estimatedRoas:"4.5x",budget:"$18,000",usedBudget:"$1,200",totalPrice:"$19,500",budgetUsagePercentage:7,placements:14,engines:[{id:"display",name:"Display",campaignName:"NY Retargeting Banners",status:"ready",enabled:!0},{id:"sponsored",name:"Sponsored products",campaignName:"NY Featured Products",status:"ready",enabled:!0}],dateRange:{from:new Date("2025-01-01"),to:m(new Date("2025-01-01"),31)},features:[]}],E={render:()=>{const[d,y]=i.useState([]),[b,D]=i.useState([]),[S,l]=i.useState("coca-cola"),[C,g]=i.useState({});return a.jsx(N,{children:a.jsx(T,{routes:Q,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Media Experiences",subtitle:"Complete overview of all your campaigns across all advertising engines",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),headerRight:a.jsx($,{value:S,onChange:l})},children:a.jsxs(F,{className:"w-full",children:[a.jsx(H,{children:a.jsx(V,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Ready",value:"ready"},{label:"In option",value:"in-option"},{label:"Paused",value:"paused"}],selectedValues:d,onChange:y},{name:"Advertiser",options:[{label:"Acme Media",value:"acme-media"},{label:"BrandX",value:"brandx"},{label:"MediaWorks",value:"mediaworks"},{label:"AdPartners",value:"adpartners"}],selectedValues:b,onChange:D}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search campaigns..."})}),a.jsx(W,{className:"space-y-6",children:q.map((t,w)=>{const c=C[t.title]||t.budget;return a.jsx(X,{layout:"horizontal",title:t.title,goal:t.goal,audience:"retail-shoppers",estimatedRoas:t.estimatedRoas,budget:c,usedBudget:t.usedBudget,totalPrice:t.totalPrice,budgetUsagePercentage:t.budgetUsagePercentage,engines:t.engines,placements:t.placements,dateRange:t.dateRange,features:t.features,onBudgetChange:o=>{g(n=>({...n,[t.title]:o})),console.log(`Budget updated for ${t.title}: ${o}`)},onEdit:()=>console.log(`Edit campaign: ${t.title}`),onEngineEdit:(o,n)=>{const r={display:"display",sponsored:"sponsored-products",digital:"digital-instore",offline:"offline-instore"}[o]||o;console.log(`Navigate to: /campaigns/${r}/${t.id}`),alert(`Would navigate to: /campaigns/${r}/${t.id}`)},className:"w-full"},w)})})]})})})},parameters:{docs:{description:{story:`
# 360 Campaigns

Get a complete overview of all your campaigns across all advertising engines with interactive budget management capabilities.

## Features

- **Comprehensive Campaign Cards**: Each campaign is displayed as a horizontal CampaignSummary component with full details
- **Interactive Budget Adjustment**: Click on any budget to open a dropdown with:
  - Direct input field for precise budget entry
  - Slider control for quick adjustments ($1,000 - $50,000 range)
  - Real-time budget updates
- **Multi-Engine Support**: Shows campaigns across Display, Sponsored Products, Digital In-Store, and Offline In-Store
- **Rich Information Display**: Shows budget usage, ROAS, engines used, and date ranges
- **Visual Status Indicators**: Color-coded badges for campaign status (Running, Ready, In Option, Paused)
- **Budget Usage Visualization**: Progress bars showing budget utilization with color indicators
- **Media Products Display**: Detailed breakdown showing budget and ROAS per advertising engine

## Interactive Elements

- **Budget Adjustment**: Click on any budget amount to adjust it using the dropdown with slider
- **Edit Campaign**: Quick access to campaign editing functionality
- **Add to Cart**: Easy campaign selection for bulk operations

## Use Cases

- 360-degree campaign management across all advertising channels
- Real-time budget optimization and reallocation
- Visual campaign performance monitoring
- Cross-engine campaign comparison and analysis
- Budget planning and adjustment workflows

This 360 Campaigns view provides complete visibility and control over your entire advertising portfolio, making it ideal for campaign managers who need to manage budgets and performance across multiple advertising engines simultaneously.
        `}}}},I={render:()=>{const[d,y]=i.useState([]),[b,D]=i.useState([]),[S,l]=i.useState("coca-cola"),[C,g]=i.useState({}),[t,w]=i.useState({from:new Date("2024-06-01"),to:m(new Date("2024-06-01"),180)}),[c,o]=i.useState("media-experiences"),[n,h]=i.useState([]),[r,K]=i.useState([]),Y=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Holiday Sale Campaign",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"$10,000",newValue:"$15,000",description:"Budget increased for holiday push"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"In-option",description:"Campaign moved to in-option status"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Engine Added",field:"Engines",oldValue:"-",newValue:"Display",description:"Added Display engine"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"Jane Doe",action:"Engine Added",field:"Engines",oldValue:"-",newValue:"Sponsored Products",description:"Added Sponsored Products engine"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Dates Modified",field:"End Date",oldValue:"06/25/2024",newValue:"06/30/2024",description:"Extended campaign end date"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"Budget Updated",field:"Budget",oldValue:"$15,000",newValue:"$18,000",description:"Budget reallocated across engines"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Summer Launch Campaign",description:"New campaign created"},{id:"LOG-009",timestamp:"2024-12-12 10:15:00",user:"Jane Doe",action:"Status Changed",field:"Status",oldValue:"In-option",newValue:"Running",description:"Holiday Sale Campaign is now live"},{id:"LOG-010",timestamp:"2024-12-13 09:00:00",user:"Mike Johnson",action:"Engine Added",field:"Engines",oldValue:"-",newValue:"Digital In-store",description:"Added Digital In-store engine to Summer Launch"}],[L,M]=i.useState(q),[O,j]=i.useState(new Set);let U=i.useRef(L.length+1);const _=()=>{const e=`C-${String(U.current).padStart(3,"0")}`;U.current+=1,j(u=>new Set(u).add(e)),M(u=>[{id:e,campaignType:"new",title:"",badge:{text:"New",variant:"outline"},goal:"",estimatedRoas:"0x",budget:"",usedBudget:"",totalPrice:"",budgetUsagePercentage:0,placements:0,engines:[],dateRange:{from:new Date,to:m(new Date,30)},features:[]},...u])};return a.jsx(N,{children:a.jsx(T,{routes:Q,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Media Experiences",subtitle:"Complete overview of all your campaigns across all advertising engines",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),headerRight:a.jsxs(a.Fragment,{children:[a.jsx($,{value:S,onChange:l}),a.jsx(ne,{dateRange:t,onDateRangeChange:w,placeholder:"Filter by date range",className:"bg-background border-border w-[220px]",showPresets:!0})]})},children:a.jsx(ae,{className:"w-full",tabs:[{label:"Media experiences",value:"media-experiences",content:a.jsxs("div",{className:"space-y-6 mt-6",children:[a.jsx(V,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Ready",value:"ready"},{label:"In option",value:"in-option"},{label:"Paused",value:"paused"}],selectedValues:d,onChange:y},{name:"Advertiser",options:[{label:"Acme Media",value:"acme-media"},{label:"BrandX",value:"brandx"},{label:"MediaWorks",value:"mediaworks"},{label:"AdPartners",value:"adpartners"}],selectedValues:b,onChange:D}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search campaigns..."}),a.jsx("div",{className:"space-y-6",children:L.map(e=>{const u=C[e.title]||e.budget;return a.jsx(X,{layout:"horizontal",title:e.title,goal:e.goal,audience:"retail-shoppers",hideGoal:!0,hideTargeting:!0,hideAgent:!0,hideAutoBudget:!0,hideEngineToggle:!0,hideEngineActions:!0,guidedSetup:O.has(e.id),onCancel:()=>{M(s=>s.filter(p=>p.id!==e.id)),j(s=>{const p=new Set(s);return p.delete(e.id),p})},campaignId:e.id,defaultExpanded:e.engines.length===0||O.has(e.id),estimatedRoas:e.estimatedRoas,budget:u,usedBudget:e.usedBudget,totalPrice:e.totalPrice,budgetUsagePercentage:e.budgetUsagePercentage,engines:e.engines,placements:e.placements,dateRange:e.dateRange,features:e.features,onBudgetChange:s=>{g(p=>({...p,[e.title]:s})),console.log(`Budget updated for ${e.title}: ${s}`)},onEdit:()=>console.log(`Edit campaign: ${e.title}`),onEngineEdit:(s,p)=>{const J={display:"display",sponsored:"sponsored-products",digital:"digital-instore",offline:"offline-instore"}[s]||s;console.log(`Navigate to: /campaigns/${J}/${e.id}`),alert(`Would navigate to: /campaigns/${J}/${e.id}`)},onEngineAdd:s=>{console.log(`Adding ${s} campaign to ${e.title}`)},className:"w-full"},e.id)})})]})},{label:"Logs",value:"logs",content:a.jsxs("div",{className:"space-y-6 mt-6",children:[a.jsx(V,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:n,onChange:h},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Engine Added",value:"Engine Added"},{label:"Dates Modified",value:"Dates Modified"}],selectedValues:r,onChange:K}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),a.jsx(z,{columns:[{key:"timestamp",header:"Timestamp",render:e=>new Date(e.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:e=>a.jsx(v,{variant:"outline",children:e.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:Y.filter(e=>{const u=n.length===0||n.includes(e.user),s=r.length===0||r.includes(e.action);return u&&s}),rowKey:e=>e.id,onRowClick:e=>console.log(`Log clicked: ${e.id}`)})]})}],action:c==="media-experiences"?a.jsx(G,{onClick:_,children:"Add media experience"}):c==="logs"?a.jsx(G,{children:"Export logs"}):null,activeTab:c,onTabChange:o})})})},parameters:{docs:{description:{story:`
# 360 Campaigns – No Goal & Targeting

A variant of the 360 Campaigns view without Goal and Targeting sections in the campaign summary cards. This streamlined view focuses on budget, runtime, and media proposition management.

## Differences from Standard 360 Campaigns

- **No Goal dropdown** in the summary sidebar
- **No Targeting dropdown** and Auto Targeting toggle in the summary sidebar
- **Simplified collapsed subtitle** without goal information
- All other features remain the same (budget management, engine toggles, metrics, etc.)

## Use Cases

- Retailers or platforms where goal and targeting are managed at a different level
- Simplified campaign management workflows
- Quick budget and runtime-focused campaign overviews
        `}}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:"createCampaignOverviewStory('all', 'All Engines')",...x.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:"createCampaignOverviewStory('sponsored products', 'Sponsored Products')",...A.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:"createCampaignOverviewStory('display', 'Display')",...k.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:"createCampaignOverviewStory('digital in-store', 'Digital In-Store')",...R.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:"createCampaignOverviewStory('offline instore', 'Offline Instore')",...B.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:"createCampaignOverviewStory('offsite', 'Offsite')",...P.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const [campaignBudgets, setCampaignBudgets] = React.useState<{
      [key: string]: string;
    }>({});
    return <MenuContextProvider>
        <AppLayout routes={defaultRoutes} logo={{
        src: '/next.svg',
        alt: 'Logo',
        width: 40,
        height: 40
      }} user={{
        name: 'Jane Doe',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32'
      }} onLogout={() => alert('Logout clicked')} breadcrumbProps={{
        namespace: ''
      }} pageHeaderProps={{
        title: 'Media Experiences',
        subtitle: 'Complete overview of all your campaigns across all advertising engines',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        headerRight: <AdvertiserSelect value={headerAdvertiser} onChange={setHeaderAdvertiser} />
      }}>
          <Card className="w-full">
            <CardHeader>
              <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Running',
                value: 'running'
              }, {
                label: 'Ready',
                value: 'ready'
              }, {
                label: 'In option',
                value: 'in-option'
              }, {
                label: 'Paused',
                value: 'paused'
              }],
              selectedValues: status,
              onChange: setStatus
            }, {
              name: 'Advertiser',
              options: [{
                label: 'Acme Media',
                value: 'acme-media'
              }, {
                label: 'BrandX',
                value: 'brandx'
              }, {
                label: 'MediaWorks',
                value: 'mediaworks'
              }, {
                label: 'AdPartners',
                value: 'adpartners'
              }],
              selectedValues: advertiser,
              onChange: setAdvertiser
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search campaigns..." />
            </CardHeader>
            <CardContent className="space-y-6">
              {campaignSummaryData.map((campaign, index) => {
              const currentBudget = campaignBudgets[campaign.title] || campaign.budget;
              return <CampaignSummary key={index} layout="horizontal" title={campaign.title} goal={campaign.goal} audience="retail-shoppers" estimatedRoas={campaign.estimatedRoas} budget={currentBudget} usedBudget={campaign.usedBudget} totalPrice={campaign.totalPrice} budgetUsagePercentage={campaign.budgetUsagePercentage} engines={campaign.engines} placements={campaign.placements} dateRange={campaign.dateRange} features={campaign.features} onBudgetChange={newBudget => {
                setCampaignBudgets(prev => ({
                  ...prev,
                  [campaign.title]: newBudget
                }));
                console.log(\`Budget updated for \${campaign.title}: \${newBudget}\`);
              }} onEdit={() => console.log(\`Edit campaign: \${campaign.title}\`)} onEngineEdit={(engineId, engineName) => {
                // Map engine ID to URL path
                const engineTypeMap: {
                  [key: string]: string;
                } = {
                  'display': 'display',
                  'sponsored': 'sponsored-products',
                  'digital': 'digital-instore',
                  'offline': 'offline-instore'
                };
                const engineType = engineTypeMap[engineId] || engineId;
                console.log(\`Navigate to: /campaigns/\${engineType}/\${campaign.id}\`);
                alert(\`Would navigate to: /campaigns/\${engineType}/\${campaign.id}\`);
              }} className="w-full" />;
            })}
            </CardContent>
          </Card>
        </AppLayout>
      </MenuContextProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
# 360 Campaigns

Get a complete overview of all your campaigns across all advertising engines with interactive budget management capabilities.

## Features

- **Comprehensive Campaign Cards**: Each campaign is displayed as a horizontal CampaignSummary component with full details
- **Interactive Budget Adjustment**: Click on any budget to open a dropdown with:
  - Direct input field for precise budget entry
  - Slider control for quick adjustments ($1,000 - $50,000 range)
  - Real-time budget updates
- **Multi-Engine Support**: Shows campaigns across Display, Sponsored Products, Digital In-Store, and Offline In-Store
- **Rich Information Display**: Shows budget usage, ROAS, engines used, and date ranges
- **Visual Status Indicators**: Color-coded badges for campaign status (Running, Ready, In Option, Paused)
- **Budget Usage Visualization**: Progress bars showing budget utilization with color indicators
- **Media Products Display**: Detailed breakdown showing budget and ROAS per advertising engine

## Interactive Elements

- **Budget Adjustment**: Click on any budget amount to adjust it using the dropdown with slider
- **Edit Campaign**: Quick access to campaign editing functionality
- **Add to Cart**: Easy campaign selection for bulk operations

## Use Cases

- 360-degree campaign management across all advertising channels
- Real-time budget optimization and reallocation
- Visual campaign performance monitoring
- Cross-engine campaign comparison and analysis
- Budget planning and adjustment workflows

This 360 Campaigns view provides complete visibility and control over your entire advertising portfolio, making it ideal for campaign managers who need to manage budgets and performance across multiple advertising engines simultaneously.
        \`
      }
    }
  }
}`,...E.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [status, setStatus] = React.useState<string[]>([]);
    const [advertiser, setAdvertiser] = React.useState<string[]>([]);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const [campaignBudgets, setCampaignBudgets] = React.useState<{
      [key: string]: string;
    }>({});
    const [pageDateRange, setPageDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 180)
    });
    const [activeTab, setActiveTab] = React.useState('media-experiences');
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Holiday Sale Campaign',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '$10,000',
      newValue: '$15,000',
      description: 'Budget increased for holiday push'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 15:22:45',
      user: 'John Smith',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'In-option',
      description: 'Campaign moved to in-option status'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-11 09:15:33',
      user: 'Sarah Wilson',
      action: 'Engine Added',
      field: 'Engines',
      oldValue: '-',
      newValue: 'Display',
      description: 'Added Display engine'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'Jane Doe',
      action: 'Engine Added',
      field: 'Engines',
      oldValue: '-',
      newValue: 'Sponsored Products',
      description: 'Added Sponsored Products engine'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Dates Modified',
      field: 'End Date',
      oldValue: '06/25/2024',
      newValue: '06/30/2024',
      description: 'Extended campaign end date'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '$15,000',
      newValue: '$18,000',
      description: 'Budget reallocated across engines'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Summer Launch Campaign',
      description: 'New campaign created'
    }, {
      id: 'LOG-009',
      timestamp: '2024-12-12 10:15:00',
      user: 'Jane Doe',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'In-option',
      newValue: 'Running',
      description: 'Holiday Sale Campaign is now live'
    }, {
      id: 'LOG-010',
      timestamp: '2024-12-13 09:00:00',
      user: 'Mike Johnson',
      action: 'Engine Added',
      field: 'Engines',
      oldValue: '-',
      newValue: 'Digital In-store',
      description: 'Added Digital In-store engine to Summer Launch'
    }];

    // Dynamic list of campaigns - starts with existing data
    const [campaigns, setCampaigns] = React.useState(campaignSummaryData);
    const [newCampaignIds, setNewCampaignIds] = React.useState<Set<string>>(new Set());
    let nextId = React.useRef(campaigns.length + 1);

    // Add a new empty media experience
    const handleAddMediaExperience = () => {
      const newId = \`C-\${String(nextId.current).padStart(3, '0')}\`;
      nextId.current += 1;
      setNewCampaignIds(prev => new Set(prev).add(newId));
      setCampaigns(prev => [{
        id: newId,
        campaignType: 'new',
        title: '',
        badge: {
          text: 'New',
          variant: 'outline' as const
        },
        goal: '',
        estimatedRoas: '0x',
        budget: '',
        usedBudget: '',
        totalPrice: '',
        budgetUsagePercentage: 0,
        placements: 0,
        engines: [],
        dateRange: {
          from: new Date(),
          to: addDays(new Date(), 30)
        },
        features: []
      }, ...prev]);
    };
    return <MenuContextProvider>
        <AppLayout routes={defaultRoutes} logo={{
        src: '/next.svg',
        alt: 'Logo',
        width: 40,
        height: 40
      }} user={{
        name: 'Jane Doe',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32'
      }} onLogout={() => alert('Logout clicked')} breadcrumbProps={{
        namespace: ''
      }} pageHeaderProps={{
        title: 'Media Experiences',
        subtitle: 'Complete overview of all your campaigns across all advertising engines',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        headerRight: <>
                <AdvertiserSelect value={headerAdvertiser} onChange={setHeaderAdvertiser} />
                <DateRangePicker dateRange={pageDateRange} onDateRangeChange={setPageDateRange} placeholder="Filter by date range" className="bg-background border-border w-[220px]" showPresets={true} />
              </>
      }}>
          <CardWithTabs className="w-full" tabs={[{
          label: 'Media experiences',
          value: 'media-experiences',
          content: <div className="space-y-6 mt-6">
                    <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Running',
                value: 'running'
              }, {
                label: 'Ready',
                value: 'ready'
              }, {
                label: 'In option',
                value: 'in-option'
              }, {
                label: 'Paused',
                value: 'paused'
              }],
              selectedValues: status,
              onChange: setStatus
            }, {
              name: 'Advertiser',
              options: [{
                label: 'Acme Media',
                value: 'acme-media'
              }, {
                label: 'BrandX',
                value: 'brandx'
              }, {
                label: 'MediaWorks',
                value: 'mediaworks'
              }, {
                label: 'AdPartners',
                value: 'adpartners'
              }],
              selectedValues: advertiser,
              onChange: setAdvertiser
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search campaigns..." />
                    <div className="space-y-6">
                      {campaigns.map(campaign => {
                const currentBudget = campaignBudgets[campaign.title] || campaign.budget;
                return <CampaignSummary key={campaign.id} layout="horizontal" title={campaign.title} goal={campaign.goal} audience="retail-shoppers" hideGoal hideTargeting hideAgent hideAutoBudget hideEngineToggle hideEngineActions guidedSetup={newCampaignIds.has(campaign.id)} onCancel={() => {
                  setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
                  setNewCampaignIds(prev => {
                    const next = new Set(prev);
                    next.delete(campaign.id);
                    return next;
                  });
                }} campaignId={campaign.id} defaultExpanded={campaign.engines.length === 0 || newCampaignIds.has(campaign.id)} estimatedRoas={campaign.estimatedRoas} budget={currentBudget} usedBudget={campaign.usedBudget} totalPrice={campaign.totalPrice} budgetUsagePercentage={campaign.budgetUsagePercentage} engines={campaign.engines} placements={campaign.placements} dateRange={campaign.dateRange} features={campaign.features} onBudgetChange={newBudget => {
                  setCampaignBudgets(prev => ({
                    ...prev,
                    [campaign.title]: newBudget
                  }));
                  console.log(\`Budget updated for \${campaign.title}: \${newBudget}\`);
                }} onEdit={() => console.log(\`Edit campaign: \${campaign.title}\`)} onEngineEdit={(engineId, engineName) => {
                  const engineTypeMap: {
                    [key: string]: string;
                  } = {
                    'display': 'display',
                    'sponsored': 'sponsored-products',
                    'digital': 'digital-instore',
                    'offline': 'offline-instore'
                  };
                  const engineType = engineTypeMap[engineId] || engineId;
                  console.log(\`Navigate to: /campaigns/\${engineType}/\${campaign.id}\`);
                  alert(\`Would navigate to: /campaigns/\${engineType}/\${campaign.id}\`);
                }} onEngineAdd={propositionType => {
                  console.log(\`Adding \${propositionType} campaign to \${campaign.title}\`);
                }} className="w-full" />;
              })}
                    </div>
                  </div>
        }, {
          label: 'Logs',
          value: 'logs',
          content: <div className="space-y-6 mt-6">
                    <FilterBar filters={[{
              name: 'Users',
              options: [{
                label: 'Jane Doe',
                value: 'Jane Doe'
              }, {
                label: 'John Smith',
                value: 'John Smith'
              }, {
                label: 'Sarah Wilson',
                value: 'Sarah Wilson'
              }, {
                label: 'Mike Johnson',
                value: 'Mike Johnson'
              }],
              selectedValues: logUsers,
              onChange: setLogUsers
            }, {
              name: 'Actions',
              options: [{
                label: 'Campaign Created',
                value: 'Campaign Created'
              }, {
                label: 'Budget Updated',
                value: 'Budget Updated'
              }, {
                label: 'Status Changed',
                value: 'Status Changed'
              }, {
                label: 'Engine Added',
                value: 'Engine Added'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                    <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: (row: typeof logData[0]) => new Date(row.timestamp).toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })
            }, {
              key: 'user',
              header: 'User'
            }, {
              key: 'action',
              header: 'Action',
              render: (row: typeof logData[0]) => <Badge variant="outline">{row.action}</Badge>
            }, {
              key: 'field',
              header: 'Field'
            }, {
              key: 'oldValue',
              header: 'Old Value'
            }, {
              key: 'newValue',
              header: 'New Value'
            }, {
              key: 'description',
              header: 'Description'
            }]} data={logData.filter(row => {
              const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
              const actionMatch = logActions.length === 0 || logActions.includes(row.action);
              return userMatch && actionMatch;
            })} rowKey={(row: typeof logData[0]) => row.id} onRowClick={(row: typeof logData[0]) => console.log(\`Log clicked: \${row.id}\`)} />
                  </div>
        }]} action={activeTab === 'media-experiences' ? <Button onClick={handleAddMediaExperience}>
                  Add media experience
                </Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
        </AppLayout>
      </MenuContextProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
# 360 Campaigns – No Goal & Targeting

A variant of the 360 Campaigns view without Goal and Targeting sections in the campaign summary cards. This streamlined view focuses on budget, runtime, and media proposition management.

## Differences from Standard 360 Campaigns

- **No Goal dropdown** in the summary sidebar
- **No Targeting dropdown** and Auto Targeting toggle in the summary sidebar
- **Simplified collapsed subtitle** without goal information
- All other features remain the same (budget management, engine toggles, metrics, etc.)

## Use Cases

- Retailers or platforms where goal and targeting are managed at a different level
- Simplified campaign management workflows
- Quick budget and runtime-focused campaign overviews
        \`
      }
    }
  }
}`,...I.parameters?.docs?.source}}};const Ba=["CampaignOverview","SponsoredProducts","Display","DigitalInStore","OfflineInstore","Offsite","Campaigns360","Campaigns360NoGoalTargeting"];export{x as CampaignOverview,E as Campaigns360,I as Campaigns360NoGoalTargeting,R as DigitalInStore,k as Display,B as OfflineInstore,P as Offsite,A as SponsoredProducts,Ba as __namedExportsOrder,Ra as default};
