import{u as de,r as n,R as C,j as e,M as ce}from"./iframe-B2sv3z--.js";import{B as Ke}from"./smart-breadcrumbs-C5KSSszP.js";import{A as le,g as ue}from"./theme-navigation-BNOnEcGS.js";import{c as me}from"./card-CV9YZc92.js";import{M as ve}from"./metric-row-CtEPUD9z.js";import{T as S}from"./table-CNEeceD7.js";import{B as l}from"./badge-BuMlIxhD.js";import{F as k}from"./filter-bar-7qJjbfF8.js";import{B as m}from"./button-CuPAXXHd.js";import{L as je}from"./line-chart-CJpZ8IF_.js";import{P as Je}from"./pie-chart-Bj1QXkvP.js";import{M as Ge}from"./map-chart-CqEDuLgG.js";import"./dropdown-menu-CS3p5svP.js";import{F as w}from"./form-section-3n4pMUs6.js";import{I as d}from"./input-ncBsZbtw.js";import{a as ge,b as U,D as He}from"./date-picker-D5xY-lpC.js";import{X as fe}from"./x-CbZ9gBzK.js";import{C as Oe}from"./chevron-left-CE-9wMsK.js";import{C as $e}from"./chevron-right-BMhUZwQf.js";import{c as We}from"./createLucideIcon-Bwht0sgB.js";import"./preload-helper-PPVm8Dsz.js";import"./breadcrumb-BMOW2eJk.js";import"./index-ojs0XM5b.js";import"./utils-CBfrqCZ4.js";import"./use-menu-COfJUJmr.js";import"./default-routes-CqolUEBP.js";import"./side-navigation-dbatG8sL.js";import"./render-icon-EYbjJv2z.js";import"./store-F7RDwBnd.js";import"./monitor-speaker-DOUMcHVE.js";import"./users-O13I7vWA.js";import"./trending-up-DIPn3Qxp.js";import"./settings-2-Dg95SXfj.js";import"./settings-DTWUPnnQ.js";import"./user-DWVaoi2S.js";import"./chevron-down-BepfQlRx.js";import"./logo-Cgnv_6es.js";import"./page-header-CB4H9ypj.js";import"./building-2-DJtB2wEP.js";import"./ellipsis-DwDXQygk.js";import"./square-pen-Xef5xhA3.js";import"./header-actions-tRbzyRrb.js";import"./popover-BZWdwQcX.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./Combination-CVHJjhEU.js";import"./index-BOcI3EBp.js";import"./index-BHEqwGAn.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./search-CnB7SJuU.js";import"./CategoricalChart-DMmfmZNY.js";import"./index-CL2-xB0p.js";import"./LineChart-DUPfY8Ep.js";import"./ActivePoints-DCUubk-2.js";import"./LabelList-DJ4XRvfB.js";import"./ErrorBar-DbhfJglL.js";import"./CartesianChart-CBLZ8Imy.js";import"./dialog-1golBNom.js";import"./index-CR_Lbx6h.js";import"./plus-B-5Hv10d.js";import"./checkbox-DgACiBX7.js";import"./index-CG_rr0_2.js";import"./check-D5-eMeep.js";import"./chevron-up-BAVTz51r.js";import"./index-CdJFUDDL.js";import"./filter-DQgXvjeP.js";import"./search-input-DSX7Be2G.js";import"./chart-aky-PZdH.js";import"./YAxis-Bwb_yRiV.js";import"./PolarChart-cd0QZuUk.js";import"./tooltipContext-NsQPOUQT.js";import"./index-G_2NqKkU.js";import"./circle-CA_9n80i.js";const ze=[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"14u9p9"}]],Ne=We("triangle",ze),bt={title:"Page templates/Campaign Details",component:le,parameters:{layout:"fullscreen",docs:{description:{component:`
# Campaign Details Page Template

The Campaign Details page template provides a comprehensive view of individual campaigns with tabbed navigation for different data views. It combines campaign information display with detailed line item and creative management.

## Features

- **Tabbed Interface**: CardWithTabs component for organized content sections
- **Campaign Information**: Detailed campaign metadata and settings
- **Line Items Management**: Table view with filtering and actions
- **Creatives Management**: Table view with filtering and actions
- **Advanced Filtering**: FilterBar for both line items and creatives
- **Action Menus**: Dropdown menus for row-level actions
- **Responsive Design**: Adapts to different screen sizes

## Tab Structure

### Campaign Information Tab
- **Campaign Details**: Name, advertiser, dates, budget
- **Settings**: Campaign configuration options
- **Status**: Current campaign status and approval state

### Line Items Tab
- **Data Table**: List of all line items in the campaign
- **Filtering**: Filter by status, type, and other criteria
- **Actions**: Edit, duplicate, delete line items
- **Search**: Real-time search across line item names
- **Status Badges**: Visual indicators for line item status

### Creatives Tab
- **Data Table**: List of all creatives in the campaign
- **Filtering**: Filter by format, status, and approval state
- **Actions**: Edit, duplicate, delete creatives
- **Search**: Real-time search across creative names
- **Status Badges**: Visual indicators for creative status

## Data Management

### Line Items
- **Status Tracking**: Active, Paused, Completed, Draft
- **Type Classification**: Display, Digital In-Store, Offline In-Store, Sponsored Products
- **Performance Metrics**: Impressions, clicks, conversions
- **Date Management**: Start/end dates with proper formatting

### Creatives
- **Approval Workflow**: Draft, Pending, Approved, Rejected
- **Format Classification**: Banner, Video, Digital Signage, etc.
- **Asset Management**: File uploads and asset tracking
- **Version Control**: Track creative versions and updates

## Action Capabilities

### Line Item Actions
- **Edit**: Navigate to line item detail page
- **Duplicate**: Create copy of line item
- **Delete**: Remove line item from campaign
- **Pause/Resume**: Toggle line item status
- **View Performance**: Access performance metrics

### Creative Actions
- **Edit**: Navigate to creative detail page
- **Duplicate**: Create copy of creative
- **Delete**: Remove creative from campaign
- **Approve/Reject**: Change approval status
- **Download**: Download creative assets

## Business Rules

1. **Campaign Status**: Controls availability of actions
2. **User Permissions**: Role-based access to actions
3. **Data Integrity**: Cascading updates between related entities
4. **Status Validation**: Proper status transitions
5. **Asset Management**: File handling and storage

## Filter Options

### Line Items Filters
- **Status**: Active, Paused, Completed, Draft
- **Type**: Display, Digital In-Store, Offline In-Store, Sponsored Products
- **Performance**: Based on metrics thresholds

### Creatives Filters
- **Status**: Draft, Pending, Approved, Rejected
- **Format**: Banner, Video, Digital Signage, Wobbler, etc.
- **Type**: Display, Digital In-Store, Offline In-Store, Sponsored Products

## Usage

This template is ideal for:
- Campaign management and monitoring
- Line item and creative oversight
- Campaign performance analysis
- Asset management and approval workflows
- Multi-entity relationship management

## Components Used

- AppLayout (navigation, user management, page header)
- CardWithTabs (tabbed interface)
- Card (content containers)
- Table (data display with actions)
- FilterBar (filtering and search)
- Badge (status indicators)
- Button (actions and navigation)
- DropdownMenu (action menus)
- FormSection (organized form layouts)
- Input (form inputs)
- DatePicker (date selection)
        `}}},tags:["autodocs"]},Ve={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Approved",name:"Creative 1",format:"Banner",placements:3},{id:"CR-002",status:"Rejected",name:"Creative 2",format:"Video",placements:1},{id:"CR-003",status:"Pending",name:"Creative 3",format:"Banner",placements:2}],$=[{id:"LI-001",status:"In-option",name:"Line-item 1",placement:"Homepage",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Optimize Budget"},{id:"LI-002",status:"In-option",name:"Line-item 2",placement:"Sidebar",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Increase Spend"},{id:"LI-003",status:"In-option",name:"Line-item 3",placement:"Footer",start:"2024-08-10",end:"2024-09-10",aiRecommendation:"Optimize Budget"},{id:"LI-004",status:"In-option",name:"Line-item 4",placement:"Header",start:"2024-11-01",end:"2024-11-30",aiRecommendation:"Increase Spend"},{id:"LI-005",status:"In-option",name:"Line-item 5",placement:"Homepage",start:"2024-12-01",end:"2024-12-31",aiRecommendation:"Optimize Budget"}],E=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Digital In-store: Summer Launch",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€50,000",newValue:"€75,000",description:"Budget increased for Q4 push"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"In-option",description:"Campaign moved to in-option status"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added Homepage line item"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"Jane Doe",action:"Creative Uploaded",field:"Creatives",oldValue:"-",newValue:"CR-001",description:"Banner creative uploaded"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Dates Modified",field:"End Date",oldValue:"2024-06-25",newValue:"2024-06-30",description:"Extended campaign end date"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"Target Updated",field:"Targeting",oldValue:"Urban 18-35",newValue:"Urban 18-45",description:"Expanded age targeting"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Approved for launch",description:"Added approval comment"}],F=o=>{switch(o){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=o=>{switch(o){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),[f,x]=n.useState("spend"),[t,a]=n.useState(41866),[c,s]=n.useState(50),[oe,ie]=n.useState(!1),be=o=>{const Se=(o-1e4)/4e4,ke=600-Se*500,re=100,ye=500-re,Ce=re+Se*ye;return{spend:o,roas:Math.round(ke),revenue:Math.round(Ce)}},we=be(t),i=[{id:"roas",label:"ROAS Forecast",value:`${(we.roas/100).toFixed(2)}x`,subMetric:"Projected return",badgeValue:"+3.8%",badgeVariant:"success"},{id:"revenue",label:"Revenue Forecast",value:`$${we.revenue}K`,subMetric:"Total revenue",badgeValue:"+4.2%",badgeVariant:"success"},{id:"performance",label:"Stores Forecast",value:"350",subMetric:"Total coverage",badgeValue:"+5%",badgeVariant:"success"},{id:"customer-segments",label:"Reach Forecast",value:"2.8M",subMetric:"Total unique users",badgeValue:"+8%",badgeVariant:"success"}],se=[{key:"ctr",label:"Click-Through Rate",value:"2.34%",subMetric:"vs. 2.18% last period",badgeValue:"+7.3%",badgeVariant:"success"},{key:"conversionRate",label:"Conversion Rate",value:"4.12%",subMetric:"1,234 conversions",badgeValue:"+12.5%",badgeVariant:"success"},{key:"cpc",label:"Cost Per Click",value:"$0.58",subMetric:"vs. $0.62 target",badgeValue:"-6.5%",badgeVariant:"success"},{key:"viewability",label:"Viewability Rate",value:"87.3%",subMetric:"Above industry avg",badgeValue:"+5.2%",badgeVariant:"success"},{key:"brandLift",label:"Brand Lift",value:"+18.2%",subMetric:"Awareness increase",badgeValue:"High",badgeVariant:"info"},{key:"sov",label:"Share of Voice",value:"34.7%",subMetric:"In category",badgeValue:"+2.1%",badgeVariant:"secondary"},{key:"frequency",label:"Frequency",value:"3.8x",subMetric:"Avg. per user",badgeValue:"Optimal",badgeVariant:"success"},{key:"vcr",label:"Video Completion Rate",value:"68.9%",subMetric:"15s videos",badgeValue:"+9.4%",badgeVariant:"success"},{key:"cpa",label:"Cost Per Acquisition",value:"$24.50",subMetric:"vs. $30 target",badgeValue:"-18.3%",badgeVariant:"success"}],ee=()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(ve,{metrics:i.map(o=>({...o,key:o.id})),selectedKeys:i.map(o=>o.id),maxVisible:5,defaultVariant:"default",removable:!1,activeKey:f,onActiveKeyChange:x,dialogMetrics:se,onDialogMetricClick:o=>console.log(`${o} selected`)}),(f==="roas"||f==="revenue")&&e.jsx("div",{children:e.jsxs("div",{className:"relative bg-white border rounded-lg p-6",children:[e.jsx(m,{variant:"outline",size:"icon",onClick:()=>x(null),"aria-label":"Close chart",className:"absolute top-2 right-2 z-10",children:e.jsx(fe,{className:"w-4 h-4"})}),e.jsx(je,{data:(()=>{const o=[];for(let ae=10;ae<=50;ae+=2){const te=be(ae*1e3);o.push({spend:`${ae}K`,spendValue:ae*1e3,roas:te.roas,revenue:te.revenue})}return o})(),config:{roas:{label:"ROAS",color:"hsl(var(--chart-1))"},revenue:{label:"Revenue",color:"hsl(var(--chart-2))"}},showLegend:!0,showGrid:!0,showTooltip:!0,showXAxis:!0,showYAxis:!0,className:"h-[300px] w-full",xAxisDataKey:"spend",yAxisLabel:"Revenue",secondaryYAxis:{dataKey:"roas",domain:[0,700],label:"ROAS"}}),e.jsx("div",{className:"absolute inset-0",style:{cursor:oe?"ew-resize":"crosshair",pointerEvents:"auto"},onMouseDown:o=>{o.preventDefault(),ie(!0);const te=o.currentTarget.getBoundingClientRect(),he=te.width*.1,Se=te.width*.05,ke=te.width-he-Se,re=Ce=>{const Ee=Ce-te.left-he,Be=Math.max(0,Math.min(100,Ee/ke*100)),Fe=1e4+Be/100*4e4;a(Math.round(Fe)),s(Be)},Re=Ce=>{re(Ce.clientX)},ye=()=>{ie(!1),document.removeEventListener("mousemove",Re),document.removeEventListener("mouseup",ye)};document.addEventListener("mousemove",Re),document.addEventListener("mouseup",ye),re(o.clientX)},children:e.jsx("div",{className:"absolute top-0 bottom-0 w-px bg-border pointer-events-none",style:{left:`${10+c*.85}%`,zIndex:10},children:e.jsxs("div",{className:"absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap",children:[e.jsx(Oe,{className:"w-4 h-4 mr-1 text-primary"}),e.jsxs("span",{className:"font-medium",children:["Spend amount $",(t/1e3).toFixed(0),"K"]}),e.jsx($e,{className:"w-4 h-4 ml-1 text-primary"})]})})})]})}),f==="performance"&&e.jsx("div",{children:e.jsxs("div",{className:"relative bg-white border rounded-lg p-6",children:[e.jsx(m,{variant:"outline",size:"icon",onClick:()=>x(null),"aria-label":"Close chart",className:"absolute top-2 right-2 z-10",children:e.jsx(fe,{className:"w-4 h-4"})}),e.jsx(Ge,{data:[{name:"Amsterdam Central",plays:5847,x:48,y:35},{name:"Amsterdam Zuid",plays:4239,x:46,y:40},{name:"Amsterdam Noord",plays:3156,x:50,y:32},{name:"Rotterdam Central",plays:6241,x:40,y:55},{name:"Rotterdam Zuid",plays:2847,x:42,y:58},{name:"Den Haag HS",plays:4156,x:35,y:50},{name:"Den Haag Central",plays:3542,x:33,y:52},{name:"Utrecht CS",plays:5123,x:52,y:48},{name:"Utrecht Noord",plays:2156,x:54,y:45},{name:"Eindhoven CS",plays:3789,x:58,y:70},{name:"Eindhoven Airport",plays:1923,x:62,y:72},{name:"Groningen CS",plays:2456,x:65,y:15},{name:"Breda CS",plays:2789,x:45,y:68},{name:"Tilburg CS",plays:3234,x:52,y:65},{name:"Arnhem CS",plays:2945,x:68,y:52},{name:"Haarlem CS",plays:2567,x:42,y:38},{name:"Almere CS",plays:3456,x:58,y:42}],title:"Store Performance Map",className:"w-full"})]})}),f==="customer-segments"&&e.jsx("div",{children:e.jsxs("div",{className:"relative bg-white border rounded-lg p-6",children:[e.jsx(m,{variant:"outline",size:"icon",onClick:()=>x(null),"aria-label":"Close chart",className:"absolute top-2 right-2 z-10",children:e.jsx(fe,{className:"w-4 h-4"})}),e.jsx(Je,{data:[{name:"Urban",value:126e4,fill:"hsl(var(--chart-1))"},{name:"Young adults",value:98e4,fill:"hsl(var(--chart-2))"},{name:"Family with kids",value:56e4,fill:"hsl(var(--chart-3))"}],config:{Urban:{label:"Urban",color:"hsl(var(--chart-1))"},"Young adults":{label:"Young adults",color:"hsl(var(--chart-2))"},"Family with kids":{label:"Family with kids",color:"hsl(var(--chart-3))"}},showLabels:!0,showLegend:!0,showTooltip:!0,className:"h-80 w-full",dataKey:"value",nameKey:"name"})]})})]});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Digital In-store: Summer Launch (In-Option)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(ee,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Placement",options:[{label:"Homepage",value:"Homepage"},{label:"Sidebar",value:"Sidebar"},{label:"Footer",value:"Footer"},{label:"Header",value:"Header"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:o=>e.jsx(l,{variant:K(o.status),children:o.status})},{key:"name",header:"Name"},{key:"placement",header:"Placement"},{key:"start",header:"Start date",render:o=>new Date(o.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:o=>new Date(o.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"aiRecommendation",header:"AI Recommendation",render:o=>e.jsx(l,{variant:o.aiRecommendation==="Optimize Budget"?"warning":"info",children:o.aiRecommendation})}],data:$.filter(o=>{const ae=v.length===0||v.includes(o.status),te=g.length===0||g.includes(o.placement);return ae&&te}),rowKey:o=>o.id,onRowClick:o=>window.location.href=`/campaigns/digital-instore/line-item/${o.id}`})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Banner",value:"Banner"},{label:"Video",value:"Video"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:o=>e.jsx(l,{variant:F(o.status),children:o.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:o=>e.jsx(l,{variant:"secondary",children:o.placements})},{key:"totalSkuConversions",header:"Total SKU conversions"},{key:"totalSkuConversionRate",header:"Total SKU conversion rate"},{key:"totalSkuUnits",header:"Total SKU units"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuRoas",header:"Total SKU ROAS"},{key:"onlineSkuConversions",header:"Online SKU conversions"},{key:"onlineSkuUnits",header:"Online SKU units"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"instoreSkuConversions",header:"In-store SKU conversions"},{key:"instoreSkuUnits",header:"In-store SKU units"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"}],data:O.filter(o=>{const ae=h.length===0||h.includes(o.status),te=y.length===0||y.includes(o.format);return ae&&te}),rowKey:o=>o.id,onRowClick:o=>console.log(`Navigate to creative detail: ${o.name} (${o.id})`)})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:o=>new Date(o.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:o=>e.jsx(l,{variant:"outline",children:o.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(o=>{const ae=b.length===0||b.includes(o.user),te=p.length===0||p.includes(o.action);return ae&&te}),rowKey:o=>o.id,onRowClick:o=>console.log(`Navigate to log detail: ${o.action} (${o.id})`)})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}},xe={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Approved",name:"Creative 1",format:"Banner",placements:3},{id:"CR-002",status:"Approved",name:"Creative 2",format:"Video",placements:1},{id:"CR-003",status:"Approved",name:"Creative 3",format:"Banner",placements:2}],$=[{id:"LI-001",status:"Running",name:"Line-item 1",placement:"Homepage",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend"},{id:"LI-002",status:"Running",name:"Line-item 2",placement:"Sidebar",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Optimize Budget"},{id:"LI-003",status:"Running",name:"Line-item 3",placement:"Footer",start:"2024-08-10",end:"2024-09-10",aiRecommendation:"Increase Spend"},{id:"LI-004",status:"Running",name:"Line-item 4",placement:"Header",start:"2024-11-01",end:"2024-11-30",aiRecommendation:"Optimize Budget"},{id:"LI-005",status:"Running",name:"Line-item 5",placement:"Homepage",start:"2024-12-01",end:"2024-12-31",aiRecommendation:"Increase Spend"}],E=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Digital In-store: Summer Launch",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€50,000",newValue:"€75,000",description:"Budget increased for Q4 push"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"Running",description:"Campaign is now live"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added Homepage line item"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"Jane Doe",action:"Creative Uploaded",field:"Creatives",oldValue:"-",newValue:"CR-001",description:"Banner creative uploaded"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Dates Modified",field:"End Date",oldValue:"2024-06-25",newValue:"2024-06-30",description:"Extended campaign end date"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"Target Updated",field:"Targeting",oldValue:"Urban 18-35",newValue:"Urban 18-45",description:"Expanded age targeting"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Campaign performing well",description:"Added performance comment"}],F=a=>{switch(a){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=a=>{switch(a){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),f=[{id:"repetitions",label:"Repetitions",value:"4,058,317",subMetric:"CTR: 2.14%",badgeValue:"+8%",badgeVariant:"success"},{id:"stores",label:"Stores",value:"343",subMetric:"Coverage: 89%",badgeValue:"0%",badgeVariant:"secondary"},{id:"reach",label:"Reach",value:"2.6M",subMetric:"Unique users",badgeValue:"+12%",badgeVariant:"success"},{id:"roas",label:"ROAS",value:"3.24x",subMetric:"AOV: €78.50",badgeValue:"+12%",badgeVariant:"success"}],x=[{key:"ctr",label:"Click-Through Rate",value:"2.14%",subMetric:"vs. 1.98% last period",badgeValue:"+8.1%",badgeVariant:"success"},{key:"conversionRate",label:"Conversion Rate",value:"3.84%",subMetric:"1,156 conversions",badgeValue:"+12.8%",badgeVariant:"success"},{key:"cpc",label:"Cost Per Click",value:"$0.45",subMetric:"vs. $0.52 target",badgeValue:"-13.5%",badgeVariant:"success"},{key:"viewability",label:"Viewability Rate",value:"89.2%",subMetric:"Above industry avg",badgeValue:"+6.4%",badgeVariant:"success"},{key:"brandLift",label:"Brand Lift",value:"+16.8%",subMetric:"Awareness increase",badgeValue:"High",badgeVariant:"info"},{key:"sov",label:"Share of Voice",value:"29.5%",subMetric:"In category",badgeValue:"+1.8%",badgeVariant:"secondary"},{key:"frequency",label:"Frequency",value:"3.2x",subMetric:"Avg. per user",badgeValue:"Optimal",badgeVariant:"success"},{key:"vcr",label:"Video Completion Rate",value:"72.1%",subMetric:"15s videos",badgeValue:"+8.7%",badgeVariant:"success"},{key:"cpa",label:"Cost Per Acquisition",value:"$22.80",subMetric:"vs. $28 target",badgeValue:"-18.6%",badgeVariant:"success"}],t=()=>e.jsx(ve,{metrics:f.map(a=>({...a,key:a.id})),selectedKeys:f.map(a=>a.id),maxVisible:5,defaultVariant:"default",removable:!1,dialogMetrics:x,onDialogMetricClick:a=>console.log(`${a} selected`)});return e.jsx(Ke,{entities:[{id:"C-001",name:"Summer Launch",type:"campaign",campaignType:"digital-instore"}],children:e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Digital In-store: Summer Launch (Running)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),headerRight:e.jsx(He,{dateRange:D,onDateRangeChange:B,placeholder:"Pick a date range with conversion window",showPresets:!0,showConversionWindow:!0,conversionWindow:u,onConversionWindowChange:N})},children:[e.jsx("div",{className:"mb-8",children:e.jsx(t,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Placement",options:[{label:"Homepage",value:"Homepage"},{label:"Sidebar",value:"Sidebar"},{label:"Footer",value:"Footer"},{label:"Header",value:"Header"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:K(a.status),children:a.status})},{key:"name",header:"Name"},{key:"placement",header:"Placement"},{key:"start",header:"Start date",render:a=>new Date(a.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:a=>new Date(a.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"aiRecommendation",header:"AI Recommendation",render:a=>e.jsx(l,{variant:a.aiRecommendation==="Optimize Budget"?"warning":"info",children:a.aiRecommendation})}],data:$.filter(a=>{const c=v.length===0||v.includes(a.status),s=g.length===0||g.includes(a.placement);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/digital-instore/line-item/${a.id}`})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Banner",value:"Banner"},{label:"Video",value:"Video"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:F(a.status),children:a.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:a=>e.jsx(l,{variant:"secondary",children:a.placements})}],data:O.filter(a=>{const c=h.length===0||h.includes(a.status),s=y.length===0||y.includes(a.format);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/digital-instore/creative/${a.id}`})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:a=>new Date(a.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:a=>e.jsx(l,{variant:"outline",children:a.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(a=>{const c=b.length===0||b.includes(a.user),s=p.length===0||p.includes(a.action);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/digital-instore/creative/${a.id}`})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})})}},De={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Approved",name:"Creative 1",format:"Print",placements:3,adSpend:"€12,980",impressions:"750,168",clicks:"9,827",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€17,072",onlineSkuUnits:"1,382",onlineSkuConversions:"854",instoreSkuRevenue:"€20,496",instoreSkuUnits:"1,957",instoreSkuConversions:"1,231",totalSkuRevenue:"€37,568",totalSkuUnits:"3,339",totalSkuConversions:"2,085"},{id:"CR-002",status:"Approved",name:"Creative 2",format:"Poster",placements:1,adSpend:"€9,735",impressions:"562,626",clicks:"7,370",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€12,804",onlineSkuUnits:"1,037",onlineSkuConversions:"640",instoreSkuRevenue:"€15,372",instoreSkuUnits:"1,468",instoreSkuConversions:"923",totalSkuRevenue:"€28,176",totalSkuUnits:"2,505",totalSkuConversions:"1,563"},{id:"CR-003",status:"Approved",name:"Creative 3",format:"Shelf Talker",placements:2,adSpend:"€9,735",impressions:"562,626",clicks:"7,370",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€12,804",onlineSkuUnits:"1,037",onlineSkuConversions:"640",instoreSkuRevenue:"€15,372",instoreSkuUnits:"1,467",instoreSkuConversions:"924",totalSkuRevenue:"€28,176",totalSkuUnits:"2,504",totalSkuConversions:"1,564"}],$=[{id:"LI-001",status:"Running",name:"Line-item 1",placement:"End Cap",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Optimize Budget",adSpend:"€6,490",impressions:"375,084",clicks:"4,913",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€8,536",onlineSkuUnits:"691",onlineSkuConversions:"427",instoreSkuRevenue:"€10,248",instoreSkuUnits:"978",instoreSkuConversions:"616",totalSkuRevenue:"€18,784",totalSkuUnits:"1,669",totalSkuConversions:"1,043"},{id:"LI-002",status:"Running",name:"Line-item 2",placement:"Shelf Edge",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Increase Spend",adSpend:"€6,490",impressions:"375,084",clicks:"4,913",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€8,536",onlineSkuUnits:"691",onlineSkuConversions:"427",instoreSkuRevenue:"€10,248",instoreSkuUnits:"978",instoreSkuConversions:"616",totalSkuRevenue:"€18,784",totalSkuUnits:"1,669",totalSkuConversions:"1,043"},{id:"LI-003",status:"Running",name:"Line-item 3",placement:"Floor Stand",start:"2024-08-10",end:"2024-09-10",aiRecommendation:"Optimize Budget",adSpend:"€7,778",impressions:"450,101",clicks:"5,895",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€10,243",onlineSkuUnits:"829",onlineSkuConversions:"512",instoreSkuRevenue:"€12,298",instoreSkuUnits:"1,174",instoreSkuConversions:"739",totalSkuRevenue:"€22,541",totalSkuUnits:"2,003",totalSkuConversions:"1,251"},{id:"LI-004",status:"Running",name:"Line-item 4",placement:"Aisle Header",start:"2024-11-01",end:"2024-11-30",aiRecommendation:"Increase Spend",adSpend:"€5,846",impressions:"337,575",clicks:"4,423",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€7,682",onlineSkuUnits:"622",onlineSkuConversions:"384",instoreSkuRevenue:"€9,223",instoreSkuUnits:"881",instoreSkuConversions:"554",totalSkuRevenue:"€16,905",totalSkuUnits:"1,503",totalSkuConversions:"938"},{id:"LI-005",status:"Running",name:"Line-item 5",placement:"Checkout",start:"2024-12-01",end:"2024-12-31",aiRecommendation:"Optimize Budget",adSpend:"€5,846",impressions:"337,576",clicks:"4,423",cpc:"€1.32",ctr:"1.31%",cpm:"€26.64",ecpm:"€17.30",onlineSkuRevenue:"€7,683",onlineSkuUnits:"623",onlineSkuConversions:"384",instoreSkuRevenue:"€9,223",instoreSkuUnits:"881",instoreSkuConversions:"553",totalSkuRevenue:"€16,906",totalSkuUnits:"1,504",totalSkuConversions:"937"}],E=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Offline In-store: Summer Launch",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€50,000",newValue:"€75,000",description:"Budget increased for Q4 push"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"Running",description:"Campaign is now live"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added End Cap line item"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"Jane Doe",action:"Creative Uploaded",field:"Creatives",oldValue:"-",newValue:"CR-001",description:"Print creative uploaded"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Dates Modified",field:"End Date",oldValue:"2024-06-25",newValue:"2024-06-30",description:"Extended campaign end date"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"Target Updated",field:"Targeting",oldValue:"Urban 18-35",newValue:"Urban 18-45",description:"Expanded age targeting"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Campaign performing well",description:"Added performance comment"}],F=t=>{switch(t){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=t=>{switch(t){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),f=[{key:"adSpend",label:"Ad Spend",value:"€32,450",subMetric:"Budget: €50,000",badgeValue:"+12%",badgeVariant:"success"},{key:"impressions",label:"Impressions",value:"1,875,420",subMetric:"Unique: 1.2M",badgeValue:"+6%",badgeVariant:"success"},{key:"clicks",label:"Clicks + Add to Carts",value:"24,567",subMetric:"Add to Carts: 3,245",badgeValue:"+8%",badgeVariant:"success"},{key:"cpc",label:"CPC",value:"€1.32",subMetric:"Ad Spend / Clicks",badgeValue:"-5%",badgeVariant:"success"},{key:"ctr",label:"CTR",value:"1.31%",subMetric:"Clicks / Impressions",badgeValue:"+3%",badgeVariant:"success"},{key:"cpm",label:"CPM",value:"€26.64",subMetric:"Budget / Impressions × 1,000",badgeValue:"-2%",badgeVariant:"success"},{key:"ecpm",label:"eCPM",value:"€17.30",subMetric:"Spend / Impressions × 1,000",badgeValue:"-4%",badgeVariant:"success"},{key:"onlineSkuRevenue",label:"Online SKU Revenue",value:"€42,680",subMetric:`${u}-day attribution`,badgeValue:"+18%",badgeVariant:"success"},{key:"onlineSkuUnits",label:"Online SKU Units",value:"3,456",subMetric:`${u}-day attribution`,badgeValue:"+14%",badgeVariant:"success"},{key:"onlineSkuConversions",label:"Online SKU Conversions",value:"2,134",subMetric:`${u}-day attribution`,badgeValue:"+11%",badgeVariant:"success"},{key:"instoreSkuRevenue",label:"In-store SKU Revenue",value:"€51,240",subMetric:`${u}-day attribution`,badgeValue:"+22%",badgeVariant:"success"},{key:"instoreSkuUnits",label:"In-store SKU Units",value:"4,892",subMetric:`${u}-day attribution`,badgeValue:"+16%",badgeVariant:"success"},{key:"instoreSkuConversions",label:"In-store SKU Conversions",value:"3,078",subMetric:`${u}-day attribution`,badgeValue:"+13%",badgeVariant:"success"},{key:"totalSkuRevenue",label:"Total SKU Revenue",value:"€93,920",subMetric:`${u}-day attribution`,badgeValue:"+20%",badgeVariant:"success"},{key:"totalSkuUnits",label:"Total SKU Units",value:"8,348",subMetric:`${u}-day attribution`,badgeValue:"+15%",badgeVariant:"success"},{key:"totalSkuConversions",label:"Total SKU Conversions",value:"5,212",subMetric:`${u}-day attribution`,badgeValue:"+12%",badgeVariant:"success"}],x=()=>e.jsx(ve,{metrics:f,selectedKeys:["adSpend","impressions","ctr","totalSkuRevenue"],maxVisible:5,defaultVariant:"default",removable:!0});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Offline In-store: Summer Launch (Running)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(x,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Placement",options:[{label:"End Cap",value:"End Cap"},{label:"Shelf Edge",value:"Shelf Edge"},{label:"Floor Stand",value:"Floor Stand"},{label:"Aisle Header",value:"Aisle Header"},{label:"Checkout",value:"Checkout"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:t=>e.jsx(l,{variant:K(t.status),children:t.status})},{key:"name",header:"Name"},{key:"aiRecommendation",header:"AI Recommendation",render:t=>e.jsx(l,{variant:t.aiRecommendation==="Optimize Budget"?"warning":"info",children:t.aiRecommendation})},{key:"placement",header:"Placement"},{key:"start",header:"Start date",render:t=>new Date(t.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:t=>new Date(t.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"adSpend",header:"Ad Spend"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks + Add to Carts"},{key:"cpc",header:"CPC"},{key:"ctr",header:"CTR"},{key:"cpm",header:"CPM"},{key:"ecpm",header:"eCPM"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"onlineSkuUnits",header:"Online SKU Units"},{key:"onlineSkuConversions",header:"Online SKU Conversions"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"},{key:"instoreSkuUnits",header:"In-store SKU Units"},{key:"instoreSkuConversions",header:"In-store SKU Conversions"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuUnits",header:"Total SKU Units"},{key:"totalSkuConversions",header:"Total SKU Conversions"}],data:$.filter(t=>{const a=v.length===0||v.includes(t.status),c=g.length===0||g.includes(t.placement);return a&&c}),rowKey:t=>t.id,onRowClick:t=>window.location.href=`/campaigns/offline-instore/line-item/${t.id}`})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Print",value:"Print"},{label:"Poster",value:"Poster"},{label:"Shelf Talker",value:"Shelf Talker"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:t=>e.jsx(l,{variant:F(t.status),children:t.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:t=>e.jsx(l,{variant:"secondary",children:t.placements})},{key:"adSpend",header:"Ad Spend"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks + Add to Carts"},{key:"cpc",header:"CPC"},{key:"ctr",header:"CTR"},{key:"cpm",header:"CPM"},{key:"ecpm",header:"eCPM"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"onlineSkuUnits",header:"Online SKU Units"},{key:"onlineSkuConversions",header:"Online SKU Conversions"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"},{key:"instoreSkuUnits",header:"In-store SKU Units"},{key:"instoreSkuConversions",header:"In-store SKU Conversions"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuUnits",header:"Total SKU Units"},{key:"totalSkuConversions",header:"Total SKU Conversions"}],data:O.filter(t=>{const a=h.length===0||h.includes(t.status),c=y.length===0||y.includes(t.format);return a&&c}),rowKey:t=>t.id,onRowClick:t=>window.location.href=`/campaigns/offline-instore/creative/${t.id}`})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:t=>new Date(t.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:t=>e.jsx(l,{variant:"outline",children:t.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(t=>{const a=b.length===0||b.includes(t.user),c=p.length===0||p.includes(t.action);return a&&c}),rowKey:t=>t.id,onRowClick:t=>window.location.href=`/campaigns/offline-instore/creative/${t.id}`})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}},Me={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Approved",name:"Creative 1",format:"Display Banner",placements:4,totalSkuConversions:"3,245",totalSkuConversionRate:"2.8%",totalSkuUnits:"5,678",totalSkuRevenue:"$98,450",totalSkuRoas:"4.2x",onlineSkuConversions:"2,271",onlineSkuUnits:"3,975",onlineSkuRevenue:"$68,915",instoreSkuConversions:"974",instoreSkuUnits:"1,703",instoreSkuRevenue:"$29,535"},{id:"CR-002",status:"Approved",name:"Creative 2",format:"Video",placements:2,totalSkuConversions:"1,867",totalSkuConversionRate:"3.4%",totalSkuUnits:"3,234",totalSkuRevenue:"$67,890",totalSkuRoas:"4.8x",onlineSkuConversions:"1,307",onlineSkuUnits:"2,264",onlineSkuRevenue:"$47,523",instoreSkuConversions:"560",instoreSkuUnits:"970",instoreSkuRevenue:"$20,367"},{id:"CR-003",status:"Approved",name:"Creative 3",format:"Rich Media",placements:3,totalSkuConversions:"2,456",totalSkuConversionRate:"3.1%",totalSkuUnits:"4,123",totalSkuRevenue:"$89,670",totalSkuRoas:"4.6x",onlineSkuConversions:"1,719",onlineSkuUnits:"2,886",onlineSkuRevenue:"$62,769",instoreSkuConversions:"737",instoreSkuUnits:"1,237",instoreSkuRevenue:"$26,901"}],$=[{id:"LI-001",status:"Running",name:"Line-item 1",placement:"Above The Fold",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend",totalSkuConversions:"1,248",totalSkuConversionRate:"3.2%",totalSkuUnits:"2,156",totalSkuRevenue:"$45,280",totalSkuRoas:"4.8x",onlineSkuConversions:"892",onlineSkuUnits:"1,543",onlineSkuRevenue:"$32,100",instoreSkuConversions:"356",instoreSkuUnits:"613",instoreSkuRevenue:"$13,180"},{id:"LI-002",status:"Running",name:"Line-item 2",placement:"Sidebar",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Optimize Budget",totalSkuConversions:"987",totalSkuConversionRate:"2.8%",totalSkuUnits:"1,734",totalSkuRevenue:"$38,450",totalSkuRoas:"4.2x",onlineSkuConversions:"721",onlineSkuUnits:"1,245",onlineSkuRevenue:"$27,320",instoreSkuConversions:"266",instoreSkuUnits:"489",instoreSkuRevenue:"$11,130"},{id:"LI-003",status:"Running",name:"Line-item 3",placement:"Native Feed",start:"2024-08-10",end:"2024-09-10",aiRecommendation:"Increase Spend",totalSkuConversions:"2,134",totalSkuConversionRate:"4.1%",totalSkuUnits:"3,567",totalSkuRevenue:"$72,450",totalSkuRoas:"5.3x",onlineSkuConversions:"1,489",onlineSkuUnits:"2,398",onlineSkuRevenue:"$49,780",instoreSkuConversions:"645",instoreSkuUnits:"1,169",instoreSkuRevenue:"$22,670"},{id:"LI-004",status:"Running",name:"Line-item 4",placement:"Interstitial",start:"2024-11-01",end:"2024-11-30",aiRecommendation:"Optimize Budget",totalSkuConversions:"743",totalSkuConversionRate:"2.1%",totalSkuUnits:"1,298",totalSkuRevenue:"$28,920",totalSkuRoas:"3.7x",onlineSkuConversions:"534",onlineSkuUnits:"923",onlineSkuRevenue:"$20,440",instoreSkuConversions:"209",instoreSkuUnits:"375",instoreSkuRevenue:"$8,480"},{id:"LI-005",status:"Running",name:"Line-item 5",placement:"Bottom Banner",start:"2024-12-01",end:"2024-12-31",aiRecommendation:"Increase Spend",totalSkuConversions:"1,567",totalSkuConversionRate:"3.6%",totalSkuUnits:"2,834",totalSkuRevenue:"$58,670",totalSkuRoas:"4.9x",onlineSkuConversions:"1,098",onlineSkuUnits:"1,954",onlineSkuRevenue:"$40,230",instoreSkuConversions:"469",instoreSkuUnits:"880",instoreSkuRevenue:"$18,440"}],E=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Display: Summer Launch",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€50,000",newValue:"€75,000",description:"Budget increased for Q4 push"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"Running",description:"Campaign is now live"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added Above The Fold line item"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"Jane Doe",action:"Creative Uploaded",field:"Creatives",oldValue:"-",newValue:"CR-001",description:"Display banner creative uploaded"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Dates Modified",field:"End Date",oldValue:"2024-06-25",newValue:"2024-06-30",description:"Extended campaign end date"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"Target Updated",field:"Targeting",oldValue:"Desktop 18-35",newValue:"Multi-device 18-45",description:"Expanded targeting parameters"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Display performance exceeds expectations",description:"Added performance comment"}],F=a=>{switch(a){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=a=>{switch(a){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),f=[{id:"impressions",label:"Impressions",value:"8,425,736",subMetric:"Viewability: 78.4%",badgeValue:"+14%",badgeVariant:"success"},{id:"clicks",label:"Clicks",value:"124,387",subMetric:"CTR: 1.47%",badgeValue:"+9%",badgeVariant:"success"},{id:"reach",label:"Reach",value:"3.2M",subMetric:"Frequency: 2.6",badgeValue:"+18%",badgeVariant:"success"},{id:"roas",label:"ROAS",value:"4.12x",subMetric:"CPA: €23.50",badgeValue:"+22%",badgeVariant:"success"}],x=[{key:"ctr",label:"Click-Through Rate",value:"1.47%",subMetric:"vs. 1.32% last period",badgeValue:"+11.4%",badgeVariant:"success"},{key:"viewability",label:"Viewability Rate",value:"78.4%",subMetric:"Above industry avg",badgeValue:"+5.8%",badgeVariant:"success"},{key:"cpm",label:"Cost Per Mille",value:"$2.85",subMetric:"vs. $3.20 target",badgeValue:"-10.9%",badgeVariant:"success"},{key:"videoCompletion",label:"Video Completion",value:"68.9%",subMetric:"15s completion",badgeValue:"+7.3%",badgeVariant:"success"},{key:"brandLift",label:"Brand Lift",value:"+19.2%",subMetric:"Awareness increase",badgeValue:"High",badgeVariant:"info"},{key:"frequency",label:"Frequency",value:"2.6x",subMetric:"Avg. per user",badgeValue:"Optimal",badgeVariant:"success"},{key:"cpc",label:"Cost Per Click",value:"$1.94",subMetric:"vs. $2.15 target",badgeValue:"-9.8%",badgeVariant:"success"},{key:"engagementRate",label:"Engagement Rate",value:"3.2%",subMetric:"Rich media ads",badgeValue:"+15.6%",badgeVariant:"success"},{key:"conversionRate",label:"Conversion Rate",value:"2.8%",subMetric:"Post-click conv.",badgeValue:"+18.2%",badgeVariant:"success"}],t=()=>e.jsx(ve,{metrics:f.map(a=>({...a,key:a.id})),selectedKeys:f.map(a=>a.id),maxVisible:5,defaultVariant:"default",removable:!1,dialogMetrics:x,onDialogMetricClick:a=>console.log(`${a} selected`)});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Display: Summer Launch (Running)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(t,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Placement",options:[{label:"Above The Fold",value:"Above The Fold"},{label:"Sidebar",value:"Sidebar"},{label:"Native Feed",value:"Native Feed"},{label:"Interstitial",value:"Interstitial"},{label:"Bottom Banner",value:"Bottom Banner"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:K(a.status),children:a.status})},{key:"name",header:"Name"},{key:"aiRecommendation",header:"AI Recommendation",render:a=>e.jsx(l,{variant:a.aiRecommendation==="Optimize Budget"?"warning":"info",children:a.aiRecommendation})},{key:"placement",header:"Placement"},{key:"start",header:"Start date",render:a=>new Date(a.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:a=>new Date(a.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"totalSkuConversions",header:"Total SKU conversions"},{key:"totalSkuConversionRate",header:"Total SKU conversion rate"},{key:"totalSkuUnits",header:"Total SKU units"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuRoas",header:"Total SKU ROAS"},{key:"onlineSkuConversions",header:"Online SKU conversions"},{key:"onlineSkuUnits",header:"Online SKU units"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"instoreSkuConversions",header:"In-store SKU conversions"},{key:"instoreSkuUnits",header:"In-store SKU units"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"}],data:$.filter(a=>{const c=v.length===0||v.includes(a.status),s=g.length===0||g.includes(a.placement);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/display/line-item/${a.id}`})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Display Banner",value:"Display Banner"},{label:"Video",value:"Video"},{label:"Rich Media",value:"Rich Media"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:F(a.status),children:a.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:a=>e.jsx(l,{variant:"secondary",children:a.placements})},{key:"totalSkuConversions",header:"Total SKU conversions"},{key:"totalSkuConversionRate",header:"Total SKU conversion rate"},{key:"totalSkuUnits",header:"Total SKU units"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuRoas",header:"Total SKU ROAS"},{key:"onlineSkuConversions",header:"Online SKU conversions"},{key:"onlineSkuUnits",header:"Online SKU units"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"instoreSkuConversions",header:"In-store SKU conversions"},{key:"instoreSkuUnits",header:"In-store SKU units"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"}],data:O.filter(a=>{const c=h.length===0||h.includes(a.status),s=y.length===0||y.includes(a.format);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/display/creative/${a.id}`})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:a=>new Date(a.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:a=>e.jsx(l,{variant:"outline",children:a.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(a=>{const c=b.length===0||b.includes(a.user),s=p.length===0||p.includes(a.action);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/display/creative/${a.id}`})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}},Ae={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Pending",name:"Creative 1",format:"Print",placements:2},{id:"CR-002",status:"Approved",name:"Creative 2",format:"Poster",placements:1},{id:"CR-003",status:"Pending",name:"Creative 3",format:"Shelf Talker",placements:1}],$=[{id:"LI-001",status:"In-option",name:"Line-item 1",placement:"End Cap",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Optimize Budget"},{id:"LI-002",status:"In-option",name:"Line-item 2",placement:"Shelf Edge",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Increase Spend"},{id:"LI-003",status:"Ready",name:"Line-item 3",placement:"Floor Stand",start:"2024-08-10",end:"2024-09-10",aiRecommendation:"Optimize Budget"},{id:"LI-004",status:"In-option",name:"Line-item 4",placement:"Aisle Header",start:"2024-11-01",end:"2024-11-30",aiRecommendation:"Increase Spend"},{id:"LI-005",status:"Ready",name:"Line-item 5",placement:"Checkout",start:"2024-12-01",end:"2024-12-31",aiRecommendation:"Optimize Budget"}],E=[{id:"LOG-001",timestamp:"2024-12-09 16:20:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Offline In-store: Summer Launch",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-09 16:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€0",newValue:"€75,000",description:"Initial budget allocation"},{id:"LOG-003",timestamp:"2024-12-10 09:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added End Cap line item for approval"},{id:"LOG-004",timestamp:"2024-12-10 10:45:21",user:"Jane Doe",action:"Creative Uploaded",field:"Creatives",oldValue:"-",newValue:"CR-001",description:"Print creative uploaded for review"},{id:"LOG-005",timestamp:"2024-12-10 11:30:14",user:"Mike Johnson",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"In-option",description:"Campaign moved to in-option status"},{id:"LOG-006",timestamp:"2024-12-10 14:20:58",user:"Sarah Wilson",action:"Target Updated",field:"Targeting",oldValue:"Urban 25-45",newValue:"Urban 18-45",description:"Expanded age targeting for approval"},{id:"LOG-007",timestamp:"2024-12-10 16:45:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Awaiting client approval for placements",description:"Added status comment"}],F=a=>{switch(a){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=a=>{switch(a){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),f=[{id:"projected-impressions",label:"Projected Impressions",value:"1,200,000",subMetric:"Est. Footfall: 8.5%",badgeValue:"Est.",badgeVariant:"secondary"},{id:"stores",label:"Target Stores",value:"220",subMetric:"Coverage: 57%",badgeValue:"Planned",badgeVariant:"secondary"},{id:"projected-reach",label:"Projected Reach",value:"950K",subMetric:"Unique visitors",badgeValue:"Est.",badgeVariant:"secondary"},{id:"target-roas",label:"Target ROAS",value:"2.50x",subMetric:"Target AOV: €60",badgeValue:"Goal",badgeVariant:"secondary"}],x=[{key:"projectedFootfall",label:"Projected Footfall",value:"8.5%",subMetric:"Estimated reach",badgeValue:"Est.",badgeVariant:"secondary"},{key:"targetCoverage",label:"Target Coverage",value:"57%",subMetric:"220 planned stores",badgeValue:"Planned",badgeVariant:"secondary"},{key:"expectedDwellTime",label:"Expected Dwell Time",value:"3.8 min",subMetric:"Target engagement",badgeValue:"Goal",badgeVariant:"secondary"},{key:"budgetAllocation",label:"Budget Allocation",value:"€75K",subMetric:"Initial allocation",badgeValue:"Approved",badgeVariant:"info"},{key:"targetAwareness",label:"Target Awareness",value:"+20%",subMetric:"Expected lift",badgeValue:"Goal",badgeVariant:"secondary"},{key:"cpi",label:"Cost Per Impression",value:"€0.15",subMetric:"Target CPI",badgeValue:"Target",badgeVariant:"secondary"},{key:"expectedRoi",label:"Expected ROI",value:"2.5x",subMetric:"Target return",badgeValue:"Goal",badgeVariant:"secondary"},{key:"timeline",label:"Timeline",value:"45 days",subMetric:"To launch",badgeValue:"Pending",badgeVariant:"warning"},{key:"approvalStatus",label:"Approval Status",value:"75%",subMetric:"Creatives approved",badgeValue:"In Review",badgeVariant:"warning"}],t=()=>e.jsx(ve,{metrics:f.map(a=>({...a,key:a.id})),selectedKeys:f.map(a=>a.id),maxVisible:5,defaultVariant:"default",removable:!1,dialogMetrics:x,onDialogMetricClick:a=>console.log(`${a} selected`)});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Offline In-store: Summer Launch (In-option)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(t,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Placement",options:[{label:"End Cap",value:"End Cap"},{label:"Shelf Edge",value:"Shelf Edge"},{label:"Floor Stand",value:"Floor Stand"},{label:"Aisle Header",value:"Aisle Header"},{label:"Checkout",value:"Checkout"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:K(a.status),children:a.status})},{key:"name",header:"Name"},{key:"placement",header:"Placement"},{key:"start",header:"Start date",render:a=>new Date(a.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:a=>new Date(a.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"aiRecommendation",header:"AI Recommendation",render:a=>e.jsx(l,{variant:a.aiRecommendation==="Optimize Budget"?"warning":"info",children:a.aiRecommendation})}],data:$.filter(a=>{const c=v.length===0||v.includes(a.status),s=g.length===0||g.includes(a.placement);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/offline-instore/line-item/${a.id}`})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Print",value:"Print"},{label:"Poster",value:"Poster"},{label:"Shelf Talker",value:"Shelf Talker"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:F(a.status),children:a.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:a=>e.jsx(l,{variant:"secondary",children:a.placements})}],data:O.filter(a=>{const c=h.length===0||h.includes(a.status),s=y.length===0||y.includes(a.format);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/offline-instore/creative/${a.id}`})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:a=>new Date(a.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:a=>e.jsx(l,{variant:"outline",children:a.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(a=>{const c=b.length===0||b.includes(a.user),s=p.length===0||p.includes(a.action);return c&&s}),rowKey:a=>a.id,onRowClick:a=>window.location.href=`/campaigns/offline-instore/creative/${a.id}`})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}},Ue={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Pending",name:"Creative 1",format:"Display Banner",placements:3,totalSkuConversions:"1,245",totalSkuConversionRate:"2.1%",totalSkuUnits:"2,134",totalSkuRevenue:"$42,680",totalSkuRoas:"3.5x",onlineSkuConversions:"871",onlineSkuUnits:"1,494",onlineSkuRevenue:"$29,876",instoreSkuConversions:"374",instoreSkuUnits:"640",instoreSkuRevenue:"$12,804"},{id:"CR-002",status:"Approved",name:"Creative 2",format:"Video",placements:1,totalSkuConversions:"2,867",totalSkuConversionRate:"3.6%",totalSkuUnits:"4,923",totalSkuRevenue:"$98,460",totalSkuRoas:"4.9x",onlineSkuConversions:"2,007",onlineSkuUnits:"3,446",onlineSkuRevenue:"$68,922",instoreSkuConversions:"860",instoreSkuUnits:"1,477",instoreSkuRevenue:"$29,538"},{id:"CR-003",status:"Rejected",name:"Creative 3",format:"Rich Media",placements:0,totalSkuConversions:"0",totalSkuConversionRate:"0%",totalSkuUnits:"0",totalSkuRevenue:"$0",totalSkuRoas:"0x",onlineSkuConversions:"0",onlineSkuUnits:"0",onlineSkuRevenue:"$0",instoreSkuConversions:"0",instoreSkuUnits:"0",instoreSkuRevenue:"$0"}],$=[{id:"LI-001",status:"In-option",name:"Line-item 1",placement:"Above The Fold",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend",totalSkuConversions:"856",totalSkuConversionRate:"2.4%",totalSkuUnits:"1,467",totalSkuRevenue:"$31,280",totalSkuRoas:"3.8x",onlineSkuConversions:"598",onlineSkuUnits:"1,023",onlineSkuRevenue:"$21,840",instoreSkuConversions:"258",instoreSkuUnits:"444",instoreSkuRevenue:"$9,440"},{id:"LI-002",status:"In-option",name:"Line-item 2",placement:"Sidebar",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Optimize Budget",totalSkuConversions:"634",totalSkuConversionRate:"1.9%",totalSkuUnits:"1,156",totalSkuRevenue:"$25,670",totalSkuRoas:"3.2x",onlineSkuConversions:"443",onlineSkuUnits:"798",onlineSkuRevenue:"$17,340",instoreSkuConversions:"191",instoreSkuUnits:"358",instoreSkuRevenue:"$8,330"},{id:"LI-003",status:"Ready",name:"Line-item 3",placement:"Native Feed",start:"2024-08-10",end:"2024-09-10",aiRecommendation:"Increase Spend",totalSkuConversions:"1,456",totalSkuConversionRate:"3.8%",totalSkuUnits:"2,543",totalSkuRevenue:"$54,230",totalSkuRoas:"4.7x",onlineSkuConversions:"1,019",onlineSkuUnits:"1,780",onlineSkuRevenue:"$37,960",instoreSkuConversions:"437",instoreSkuUnits:"763",instoreSkuRevenue:"$16,270"},{id:"LI-004",status:"In-option",name:"Line-item 4",placement:"Interstitial",start:"2024-11-01",end:"2024-11-30",aiRecommendation:"Optimize Budget",totalSkuConversions:"432",totalSkuConversionRate:"1.5%",totalSkuUnits:"798",totalSkuRevenue:"$18,450",totalSkuRoas:"2.8x",onlineSkuConversions:"302",onlineSkuUnits:"559",onlineSkuRevenue:"$12,920",instoreSkuConversions:"130",instoreSkuUnits:"239",instoreSkuRevenue:"$5,530"},{id:"LI-005",status:"Ready",name:"Line-item 5",placement:"Bottom Banner",start:"2024-12-01",end:"2024-12-31",aiRecommendation:"Increase Spend",totalSkuConversions:"1,089",totalSkuConversionRate:"3.1%",totalSkuUnits:"1,967",totalSkuRevenue:"$41,780",totalSkuRoas:"4.1x",onlineSkuConversions:"762",onlineSkuUnits:"1,377",onlineSkuRevenue:"$29,250",instoreSkuConversions:"327",instoreSkuUnits:"590",instoreSkuRevenue:"$12,530"}],E=[{id:"LOG-001",timestamp:"2024-12-09 15:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Display: Summer Launch",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-09 15:45:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€0",newValue:"€100,000",description:"Initial budget allocation for display campaign"},{id:"LOG-003",timestamp:"2024-12-10 08:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added Above The Fold placement for approval"},{id:"LOG-004",timestamp:"2024-12-10 09:30:21",user:"Jane Doe",action:"Creative Uploaded",field:"Creatives",oldValue:"-",newValue:"CR-001",description:"Display banner creative uploaded for review"},{id:"LOG-005",timestamp:"2024-12-10 10:15:14",user:"Mike Johnson",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"In-option",description:"Campaign moved to in-option for client review"},{id:"LOG-006",timestamp:"2024-12-10 13:45:58",user:"Sarah Wilson",action:"Target Updated",field:"Targeting",oldValue:"Desktop only",newValue:"Multi-device 18-45",description:"Expanded device and demographic targeting"},{id:"LOG-007",timestamp:"2024-12-10 16:20:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Awaiting creative approval and placement confirmation",description:"Added client feedback status"}],F=a=>{switch(a){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=a=>{switch(a){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),f=[{id:"projected-impressions",label:"Projected Impressions",value:"5,200,000",subMetric:"Est. Viewability: 65%",badgeValue:"Est.",badgeVariant:"secondary"},{id:"projected-clicks",label:"Projected Clicks",value:"78,000",subMetric:"Est. CTR: 1.5%",badgeValue:"Est.",badgeVariant:"secondary"},{id:"projected-reach",label:"Projected Reach",value:"2.1M",subMetric:"Target frequency: 2.5",badgeValue:"Goal",badgeVariant:"secondary"},{id:"target-roas",label:"Target ROAS",value:"3.50x",subMetric:"Target CPA: €28",badgeValue:"Goal",badgeVariant:"secondary"}],x=[{key:"projectedCtr",label:"Projected CTR",value:"1.5%",subMetric:"Estimated rate",badgeValue:"Est.",badgeVariant:"secondary"},{key:"targetViewability",label:"Target Viewability",value:"65%",subMetric:"Goal rate",badgeValue:"Goal",badgeVariant:"secondary"},{key:"budgetAllocated",label:"Budget Allocated",value:"$100K",subMetric:"Initial budget",badgeValue:"Approved",badgeVariant:"info"},{key:"targetFrequency",label:"Target Frequency",value:"2.5x",subMetric:"Optimal reach",badgeValue:"Goal",badgeVariant:"secondary"},{key:"expectedBrandLift",label:"Expected Brand Lift",value:"+15%",subMetric:"Awareness goal",badgeValue:"Target",badgeVariant:"secondary"},{key:"targetCpa",label:"Target CPA",value:"$28",subMetric:"Cost per acquisition",badgeValue:"Goal",badgeVariant:"secondary"},{key:"deviceMix",label:"Device Mix",value:"Multi-device",subMetric:"18-45 targeting",badgeValue:"Planned",badgeVariant:"secondary"},{key:"creativeStatus",label:"Creative Status",value:"67%",subMetric:"Assets approved",badgeValue:"In Review",badgeVariant:"warning"},{key:"launchTimeline",label:"Launch Timeline",value:"30 days",subMetric:"To go-live",badgeValue:"Pending",badgeVariant:"warning"}],t=()=>e.jsx(ve,{metrics:f.map(a=>({...a,key:a.id})),selectedKeys:f.map(a=>a.id),maxVisible:5,defaultVariant:"default",removable:!1,dialogMetrics:x,onDialogMetricClick:a=>console.log(`${a} selected`)});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Display: Summer Launch (In-option)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(t,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Placement",options:[{label:"Above The Fold",value:"Above The Fold"},{label:"Sidebar",value:"Sidebar"},{label:"Native Feed",value:"Native Feed"},{label:"Interstitial",value:"Interstitial"},{label:"Bottom Banner",value:"Bottom Banner"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:K(a.status),children:a.status})},{key:"name",header:"Name"},{key:"aiRecommendation",header:"AI Recommendation",render:a=>e.jsx(l,{variant:a.aiRecommendation==="Optimize Budget"?"warning":"info",children:a.aiRecommendation})},{key:"placement",header:"Placement"},{key:"start",header:"Start date",render:a=>new Date(a.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:a=>new Date(a.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"totalSkuConversions",header:"Total SKU conversions"},{key:"totalSkuConversionRate",header:"Total SKU conversion rate"},{key:"totalSkuUnits",header:"Total SKU units"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuRoas",header:"Total SKU ROAS"},{key:"onlineSkuConversions",header:"Online SKU conversions"},{key:"onlineSkuUnits",header:"Online SKU units"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"instoreSkuConversions",header:"In-store SKU conversions"},{key:"instoreSkuUnits",header:"In-store SKU units"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"}],data:$.filter(a=>{const c=v.length===0||v.includes(a.status),s=g.length===0||g.includes(a.placement);return c&&s}),rowKey:a=>a.id,onRowClick:a=>console.log(`Navigate to line-item detail: ${a.name} (${a.id})`)})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Display Banner",value:"Display Banner"},{label:"Video",value:"Video"},{label:"Rich Media",value:"Rich Media"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:a=>e.jsx(l,{variant:F(a.status),children:a.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:a=>e.jsx(l,{variant:"secondary",children:a.placements})},{key:"totalSkuConversions",header:"Total SKU conversions"},{key:"totalSkuConversionRate",header:"Total SKU conversion rate"},{key:"totalSkuUnits",header:"Total SKU units"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuRoas",header:"Total SKU ROAS"},{key:"onlineSkuConversions",header:"Online SKU conversions"},{key:"onlineSkuUnits",header:"Online SKU units"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"instoreSkuConversions",header:"In-store SKU conversions"},{key:"instoreSkuUnits",header:"In-store SKU units"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"}],data:O.filter(a=>{const c=h.length===0||h.includes(a.status),s=y.length===0||y.includes(a.format);return c&&s}),rowKey:a=>a.id,onRowClick:a=>console.log(`Navigate to creative detail: ${a.name} (${a.id})`)})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:a=>new Date(a.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:a=>e.jsx(l,{variant:"outline",children:a.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(a=>{const c=b.length===0||b.includes(a.user),s=p.length===0||p.includes(a.action);return c&&s}),rowKey:a=>a.id,onRowClick:a=>console.log(`Navigate to log detail: ${a.action} (${a.id})`)})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}},Ie={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("products"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{productId:"P-001",gtin:"1234567890123",image:"https://via.placeholder.com/40x40",productTitle:"Premium Coffee Beans 500g",impressions:"-",clicks:"-",addToCart:"-",avgCPC:"-",ctr:"-",atc:"-",conversion:"-",sales:"-",budget:"€500",spent:"€0",budgetLeft:"€500",roas:"-",extROAS:"-",iROAS:"-",startTime:"2024-06-01",endTime:"2024-06-30",searchVolume:"High",competitive:"Medium"},{productId:"P-002",gtin:"2345678901234",image:"https://via.placeholder.com/40x40",productTitle:"Organic Tea Selection Pack",impressions:"-",clicks:"-",addToCart:"-",avgCPC:"-",ctr:"-",atc:"-",conversion:"-",sales:"-",budget:"€750",spent:"€0",budgetLeft:"€750",roas:"-",extROAS:"-",iROAS:"-",startTime:"2024-07-01",endTime:"2024-07-31",searchVolume:"Medium",competitive:"High"},{productId:"P-003",gtin:"3456789012345",image:"https://via.placeholder.com/40x40",productTitle:"Artisan Chocolate Bar 200g",impressions:"-",clicks:"-",addToCart:"-",avgCPC:"-",ctr:"-",atc:"-",conversion:"-",sales:"-",budget:"€300",spent:"€0",budgetLeft:"€300",roas:"-",extROAS:"-",iROAS:"-",startTime:"2024-08-10",endTime:"2024-09-10",searchVolume:"Low",competitive:"Medium"}],$=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Sponsored Products: Premium Coffee",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€500",newValue:"€750",description:"Budget increased for product promotion"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"In-option",description:"Campaign moved to in-option status"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Product Added",field:"Products",oldValue:"-",newValue:"P-001",description:"Added Premium Coffee Beans product"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"Jane Doe",action:"Product Added",field:"Products",oldValue:"-",newValue:"P-002",description:"Added Organic Tea Selection product"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Targeting Updated",field:"Search Volume",oldValue:"Medium",newValue:"High",description:"Updated targeting for better reach"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"Keywords Updated",field:"Keywords",oldValue:"coffee beans",newValue:"premium coffee beans, organic coffee",description:"Expanded keyword targeting"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Ready for review",description:"Added campaign review comment"}],[E,F]=n.useState(void 0),[K,J]=n.useState(void 0),[G,H]=n.useState(void 0),[W,z]=n.useState(),[q,X]=n.useState(),[R,M]=n.useState("spend"),[V,f]=n.useState(41866),[x,t]=n.useState(50),[a,c]=n.useState(!1),s=i=>{const ae=(i-1e4)/4e4,te=600-ae*500,he=100,ke=500-he,re=he+ae*ke;return{spend:i,roas:Math.round(te),revenue:Math.round(re)}},oe=s(V),ie=[{id:"spend",label:"Spend Forecast",value:`$${oe.spend.toLocaleString()}`,subMetric:"Remaining: $39,263",badgeValue:"+3.5%",badgeVariant:"success"},{id:"roas",label:"ROAS Forecast",value:`${(oe.roas/100).toFixed(2)}x`,subMetric:"Projected return",badgeValue:"+3.4%",badgeVariant:"success"},{id:"revenue",label:"Revenue Forecast",value:`$${oe.revenue.toLocaleString()}`,subMetric:"Total revenue",badgeValue:"+4.2%",badgeVariant:"success"},{id:"competitive",label:"Competitive Forecast",value:"Medium",subMetric:"Avg. competition",badgeValue:"+2%",badgeVariant:"success"}],be=[{key:"ctr",label:"Click-Through Rate",value:"2.34%",subMetric:"vs. 2.18% last period",badgeValue:"+7.3%",badgeVariant:"success"},{key:"conversionRate",label:"Conversion Rate",value:"4.12%",subMetric:"1,234 conversions",badgeValue:"+12.5%",badgeVariant:"success"},{key:"cpc",label:"Cost Per Click",value:"$0.58",subMetric:"vs. $0.62 target",badgeValue:"-6.5%",badgeVariant:"success"},{key:"viewability",label:"Viewability Rate",value:"87.3%",subMetric:"Above industry avg",badgeValue:"+5.2%",badgeVariant:"success"},{key:"brandLift",label:"Brand Lift",value:"+18.2%",subMetric:"Awareness increase",badgeValue:"High",badgeVariant:"info"},{key:"sov",label:"Share of Voice",value:"34.7%",subMetric:"In category",badgeValue:"+2.1%",badgeVariant:"secondary"},{key:"frequency",label:"Frequency",value:"3.8x",subMetric:"Avg. per user",badgeValue:"Optimal",badgeVariant:"success"},{key:"vcr",label:"Video Completion Rate",value:"68.9%",subMetric:"15s videos",badgeValue:"+9.4%",badgeVariant:"success"},{key:"cpa",label:"Cost Per Acquisition",value:"$24.50",subMetric:"vs. $30 target",badgeValue:"-18.3%",badgeVariant:"success"}],we=()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(ve,{metrics:ie.map(i=>({...i,key:i.id})),selectedKeys:ie.map(i=>i.id),maxVisible:5,defaultVariant:"default",removable:!1,activeKey:R,onActiveKeyChange:M,dialogMetrics:be,onDialogMetricClick:i=>console.log(`${i} selected`)}),(R==="spend"||R==="roas"||R==="revenue")&&e.jsx("div",{children:e.jsxs("div",{className:"relative bg-white border rounded-lg p-6",children:[e.jsx(m,{variant:"outline",size:"icon",onClick:()=>M(null),"aria-label":"Close chart",className:"absolute top-2 right-2 z-10",children:e.jsx(fe,{className:"w-4 h-4"})}),e.jsx(je,{data:(()=>{const i=[];for(let se=10;se<=50;se+=2){const ee=s(se*1e3);i.push({spend:`${se}K`,spendValue:se*1e3,roas:ee.roas,revenue:ee.revenue})}return i})(),config:{roas:{label:"ROAS",color:"hsl(var(--chart-1))"},revenue:{label:"Revenue",color:"hsl(var(--chart-2))"}},showLegend:!0,showGrid:!0,showTooltip:!0,showXAxis:!0,showYAxis:!0,className:"h-[300px] w-full",xAxisDataKey:"spend",yAxisLabel:"Revenue",secondaryYAxis:{dataKey:"roas",domain:[0,700],label:"ROAS"}}),e.jsx("div",{className:"absolute inset-0",style:{cursor:a?"ew-resize":"crosshair",pointerEvents:"auto"},onMouseDown:i=>{i.preventDefault(),c(!0);const ee=i.currentTarget.getBoundingClientRect(),o=ee.width*.1,ae=ee.width*.05,te=ee.width-o-ae,he=re=>{const Re=re-ee.left-o,ye=Math.max(0,Math.min(100,Re/te*100)),Ce=1e4+ye/100*4e4;f(Math.round(Ce)),t(ye)},Se=re=>{he(re.clientX)},ke=()=>{c(!1),document.removeEventListener("mousemove",Se),document.removeEventListener("mouseup",ke)};document.addEventListener("mousemove",Se),document.addEventListener("mouseup",ke),he(i.clientX)},children:e.jsx("div",{className:"absolute top-0 bottom-0 w-px bg-border pointer-events-none",style:{left:`${10+x*.85}%`,zIndex:10},children:e.jsxs("div",{className:"absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg shadow-lg border pointer-events-none whitespace-nowrap",children:[e.jsx(Oe,{className:"w-4 h-4 mr-1 text-primary"}),e.jsxs("span",{className:"font-medium",children:["Spend amount $",(V/1e3).toFixed(0),"K"]}),e.jsx($e,{className:"w-4 h-4 ml-1 text-primary"})]})})})]})}),R==="competitive"&&e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Competitive Analysis by Category"}),e.jsx(m,{variant:"outline",size:"icon",onClick:()=>M(null),"aria-label":"Close chart",children:e.jsx(fe,{className:"w-4 h-4"})})]}),e.jsx("div",{className:"relative bg-white border rounded-lg p-6",children:e.jsx("div",{className:"space-y-4",children:e.jsx("div",{className:"grid grid-cols-1 gap-4",children:[{category:"Organic Foods",competition:"Low",level:1,color:"text-green-600"},{category:"Beverages",competition:"Medium",level:2,color:"text-yellow-600"},{category:"Snacks & Candy",competition:"High",level:3,color:"text-red-600"},{category:"Household Items",competition:"Low",level:1,color:"text-green-600"},{category:"Personal Care",competition:"Medium",level:2,color:"text-yellow-600"},{category:"Frozen Foods",competition:"High",level:3,color:"text-red-600"}].map(i=>e.jsxs("div",{className:"flex items-center justify-between p-4 border rounded-lg bg-white",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-medium text-gray-900",children:i.category}),e.jsxs("p",{className:"text-sm text-gray-500",children:["Competition level: ",i.competition]})]}),e.jsxs("div",{className:`flex items-center space-x-1 ${i.color}`,children:[Array.from({length:i.level},(se,ee)=>e.jsx(Ne,{className:"w-4 h-4 fill-current"},ee)),Array.from({length:3-i.level},(se,ee)=>e.jsx(Ne,{className:"w-4 h-4 text-gray-300"},`empty-${ee}`)),e.jsx("span",{className:"ml-2 text-sm font-medium",children:i.competition})]})]},i.category))})})})]})]});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Sponsored Products: Summer Launch (In-Option)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(we,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:E,onChange:F,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:K,onChange:J,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:G,onChange:H,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:W,onDateChange:z})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:q,onDateChange:X})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Products",value:"products",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Search Volume",options:[{label:"High",value:"High"},{label:"Medium",value:"Medium"},{label:"Low",value:"Low"}],selectedValues:v,onChange:A},{name:"Competitive",options:[{label:"High",value:"High"},{label:"Medium",value:"Medium"},{label:"Low",value:"Low"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search products..."}),e.jsx(S,{columns:[{key:"productId",header:"Product ID"},{key:"gtin",header:"GTIN"},{key:"image",header:"Image",render:i=>e.jsx("img",{src:i.image,alt:"Product",className:"w-8 h-8 rounded object-cover"})},{key:"productTitle",header:"Product Title"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"startTime",header:"Start Time",render:i=>new Date(i.startTime).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"endTime",header:"End Time",render:i=>new Date(i.endTime).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"searchVolume",header:"Search Volume",render:i=>e.jsx(l,{variant:i.searchVolume==="High"?"success":i.searchVolume==="Medium"?"warning":"secondary",children:i.searchVolume})},{key:"competitive",header:"Competitive",render:i=>e.jsx(l,{variant:i.competitive==="High"?"destructive":i.competitive==="Medium"?"warning":"success",children:i.competitive})}],data:O.filter(i=>{const se=v.length===0||v.includes(i.searchVolume),ee=g.length===0||g.includes(i.competitive);return se&&ee}),rowKey:i=>i.productId})]})},{label:"Keywords",value:"keywords",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Match Type",options:[{label:"Exact",value:"Exact"},{label:"Phrase",value:"Phrase"},{label:"Broad",value:"Broad"}],selectedValues:[],onChange:()=>{}},{name:"Status",options:[{label:"Active",value:"Active"},{label:"Paused",value:"Paused"},{label:"Negative",value:"Negative"}],selectedValues:[],onChange:()=>{}}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search keywords..."}),e.jsx(S,{columns:[{key:"keyword",header:"Keyword"},{key:"matchType",header:"Match Type",render:i=>e.jsx(l,{variant:"outline",children:i.matchType})},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks"},{key:"avgCPC",header:"Avg CPC"},{key:"ctr",header:"CTR"},{key:"conversion",header:"Conversion"},{key:"sales",header:"Sales"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"roas",header:"ROAS"},{key:"searchVolume",header:"Search Volume",render:i=>e.jsx(l,{variant:i.searchVolume==="High"?"success":i.searchVolume==="Medium"?"warning":"secondary",children:i.searchVolume})},{key:"competitive",header:"Competitive",render:i=>e.jsx(l,{variant:i.competitive==="High"?"destructive":i.competitive==="Medium"?"warning":"success",children:i.competitive})}],data:[{keyword:"premium coffee beans",matchType:"Exact",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€200",spent:"€0",budgetLeft:"€200",roas:"-",searchVolume:"High",competitive:"Medium"},{keyword:"organic coffee",matchType:"Phrase",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€150",spent:"€0",budgetLeft:"€150",roas:"-",searchVolume:"Medium",competitive:"High"},{keyword:"coffee beans 500g",matchType:"Broad",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€100",spent:"€0",budgetLeft:"€100",roas:"-",searchVolume:"Low",competitive:"Low"}],rowKey:i=>i.keyword})]})},{label:"Categories",value:"categories",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Category Level",options:[{label:"Level 1",value:"Level 1"},{label:"Level 2",value:"Level 2"},{label:"Level 3",value:"Level 3"}],selectedValues:[],onChange:()=>{}},{name:"Status",options:[{label:"Active",value:"Active"},{label:"Paused",value:"Paused"},{label:"Excluded",value:"Excluded"}],selectedValues:[],onChange:()=>{}}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search categories..."}),e.jsx(S,{columns:[{key:"category",header:"Category"},{key:"level",header:"Level",render:i=>e.jsx(l,{variant:"secondary",children:i.level})},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks"},{key:"avgCPC",header:"Avg CPC"},{key:"ctr",header:"CTR"},{key:"conversion",header:"Conversion"},{key:"sales",header:"Sales"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"roas",header:"ROAS"},{key:"searchVolume",header:"Search Volume",render:i=>e.jsx(l,{variant:i.searchVolume==="High"?"success":i.searchVolume==="Medium"?"warning":"secondary",children:i.searchVolume})},{key:"competitive",header:"Competitive",render:i=>e.jsx(l,{variant:i.competitive==="High"?"destructive":i.competitive==="Medium"?"warning":"success",children:i.competitive})}],data:[{category:"Food & Beverages > Coffee & Tea",level:"Level 2",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€300",spent:"€0",budgetLeft:"€300",roas:"-",searchVolume:"High",competitive:"Medium"},{category:"Food & Beverages > Snacks",level:"Level 2",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€200",spent:"€0",budgetLeft:"€200",roas:"-",searchVolume:"Medium",competitive:"High"},{category:"Organic Products",level:"Level 1",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€250",spent:"€0",budgetLeft:"€250",roas:"-",searchVolume:"Medium",competitive:"Low"}],rowKey:i=>i.category})]})},{label:"Other",value:"other",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Setting Type",options:[{label:"Targeting",value:"Targeting"},{label:"Bidding",value:"Bidding"},{label:"Schedule",value:"Schedule"}],selectedValues:[],onChange:()=>{}},{name:"Status",options:[{label:"Active",value:"Active"},{label:"Inactive",value:"Inactive"}],selectedValues:[],onChange:()=>{}}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search settings..."}),e.jsx(S,{columns:[{key:"setting",header:"Setting"},{key:"type",header:"Type",render:i=>e.jsx(l,{variant:"outline",children:i.type})},{key:"value",header:"Value"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks"},{key:"avgCPC",header:"Avg CPC"},{key:"ctr",header:"CTR"},{key:"conversion",header:"Conversion"},{key:"sales",header:"Sales"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"roas",header:"ROAS"},{key:"status",header:"Status",render:i=>e.jsx(l,{variant:i.status==="Active"?"success":"secondary",children:i.status})}],data:[{setting:"Age: 25-54",type:"Targeting",value:"Included",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€400",spent:"€0",budgetLeft:"€400",roas:"-",status:"Active"},{setting:"Gender: All",type:"Targeting",value:"Included",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€300",spent:"€0",budgetLeft:"€300",roas:"-",status:"Active"},{setting:"Schedule: Weekdays 9-17",type:"Schedule",value:"Active",impressions:"-",clicks:"-",avgCPC:"-",ctr:"-",conversion:"-",sales:"-",budget:"€200",spent:"€0",budgetLeft:"€200",roas:"-",status:"Active"}],rowKey:i=>i.setting})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:i=>new Date(i.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:i=>e.jsx(l,{variant:"outline",children:i.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:$.filter(i=>{const se=b.length===0||b.includes(i.user),ee=p.length===0||p.includes(i.action);return se&&ee}),rowKey:i=>i.id,onRowClick:i=>console.log(`Navigate to log detail: ${i.action} (${i.id})`)})]})}],action:r==="products"?e.jsx(m,{children:"Add product"}):r==="keywords"?e.jsx(m,{children:"Add keyword"}):r==="categories"?e.jsx(m,{children:"Add categories"}):r==="other"?e.jsx(m,{children:"Add other"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}},Le={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("products"),[v,A]=n.useState("impressions"),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=n.useState([]),[u,N]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[_,Z]=C.useState(14),[O,$]=C.useState("coca-cola"),E=[{productId:"P-001",gtin:"1234567890123",image:"https://via.placeholder.com/40x40",productTitle:"Premium Coffee Beans 500g",impressions:"847,592",clicks:"27,123",addToCart:"3,864",avgCPC:"€0.34",ctr:"3.2%",atc:"14.2%",conversion:"2.1%",sales:"€12,847",budget:"€500",spent:"€423",budgetLeft:"€77",roas:"3.8x",extROAS:"4.2x",iROAS:"3.6x",startTime:"2024-06-01",endTime:"2024-06-30",searchVolume:"High",competitive:"Medium"},{productId:"P-002",gtin:"2345678901234",image:"https://via.placeholder.com/40x40",productTitle:"Organic Tea Selection Pack",impressions:"634,218",clicks:"18,945",addToCart:"2,156",avgCPC:"€0.42",ctr:"2.9%",atc:"11.4%",conversion:"1.8%",sales:"€8,934",budget:"€750",spent:"€612",budgetLeft:"€138",roas:"2.9x",extROAS:"3.1x",iROAS:"2.8x",startTime:"2024-07-01",endTime:"2024-07-31",searchVolume:"Medium",competitive:"High"},{productId:"P-003",gtin:"3456789012345",image:"https://via.placeholder.com/40x40",productTitle:"Artisan Chocolate Bar 200g",impressions:"234,156",clicks:"8,234",addToCart:"1,245",avgCPC:"€0.28",ctr:"3.5%",atc:"15.1%",conversion:"2.8%",sales:"€4,567",budget:"€300",spent:"€287",budgetLeft:"€13",roas:"4.2x",extROAS:"4.6x",iROAS:"4.1x",startTime:"2024-08-10",endTime:"2024-09-10",searchVolume:"Low",competitive:"Medium"}],F=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Sponsored Products: Running Campaign",description:"Initial campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"€500",newValue:"€750",description:"Budget increased for active campaign"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"In-option",newValue:"Running",description:"Campaign activated and running"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Performance Update",field:"Metrics",oldValue:"-",newValue:"CTR: 3.5%",description:"Daily performance metrics update"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"System",action:"Spend Alert",field:"Budget",oldValue:"€100 remaining",newValue:"€13 remaining",description:"Budget alert triggered"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Bid Adjustment",field:"Bidding",oldValue:"€0.25",newValue:"€0.28",description:"Increased bid for better positioning"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"ROAS Update",field:"Performance",oldValue:"3.8x",newValue:"4.2x",description:"Improved return on ad spend"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Campaign Review",field:"Notes",oldValue:"-",newValue:"Performing well, continue current strategy",description:"Weekly campaign review"}],[K,J]=n.useState(void 0),[G,H]=n.useState(void 0),[W,z]=n.useState(void 0),[q,X]=n.useState(),[R,M]=n.useState(),V=[{id:"impressions",label:"Impressions",value:"2,845,692",subMetric:"CTR: 3.2%",badgeValue:"+15%",badgeVariant:"success"},{id:"clicks",label:"Clicks",value:"91,062",subMetric:"CPC: €0.42",badgeValue:"+8%",badgeVariant:"success"},{id:"addToCart",label:"Add to Cart",value:"12,847",subMetric:"CVR: 14.1%",badgeValue:"+22%",badgeVariant:"success"},{id:"sales",label:"Sales",value:"€127,890",subMetric:"ROAS: 3.34x",badgeValue:"+18%",badgeVariant:"success"}],x=(s=>{const oe=[];for(let ie=6;ie>=0;ie--){const be=new Date;be.setDate(be.getDate()-ie);const we=be.toLocaleDateString("en-US",{month:"short",day:"numeric"});let i;switch(s){case"impressions":i=Math.round(28e4+Math.random()*1e5);break;case"clicks":i=Math.round(8e3+Math.random()*4e3);break;case"addToCart":i=Math.round(1200+Math.random()*600);break;case"sales":i=Math.round(12e3+Math.random()*6e3);break;default:i=Math.round(1e3+Math.random()*500)}oe.push({day:we,value:i})}return oe})(v),t=V.find(s=>s.id===v),a=[{key:"ctr",label:"Click-Through Rate",value:"2.34%",subMetric:"vs. 2.18% last period",badgeValue:"+7.3%",badgeVariant:"success"},{key:"conversionRate",label:"Conversion Rate",value:"4.12%",subMetric:"1,234 conversions",badgeValue:"+12.5%",badgeVariant:"success"},{key:"cpc",label:"Cost Per Click",value:"$0.58",subMetric:"vs. $0.62 target",badgeValue:"-6.5%",badgeVariant:"success"},{key:"viewability",label:"Viewability Rate",value:"87.3%",subMetric:"Above industry avg",badgeValue:"+5.2%",badgeVariant:"success"},{key:"brandLift",label:"Brand Lift",value:"+18.2%",subMetric:"Awareness increase",badgeValue:"High",badgeVariant:"info"},{key:"sov",label:"Share of Voice",value:"34.7%",subMetric:"In category",badgeValue:"+2.1%",badgeVariant:"secondary"},{key:"frequency",label:"Frequency",value:"3.8x",subMetric:"Avg. per user",badgeValue:"Optimal",badgeVariant:"success"},{key:"vcr",label:"Video Completion Rate",value:"68.9%",subMetric:"15s videos",badgeValue:"+9.4%",badgeVariant:"success"},{key:"cpa",label:"Cost Per Acquisition",value:"$24.50",subMetric:"vs. $30 target",badgeValue:"-18.3%",badgeVariant:"success"}],c=()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(ve,{metrics:V.map(s=>({...s,key:s.id})),selectedKeys:V.map(s=>s.id),maxVisible:5,defaultVariant:"default",removable:!1,activeKey:v,onActiveKeyChange:s=>A(s??"impressions"),dialogMetrics:a,onDialogMetricClick:s=>console.log(`${s} selected`)}),e.jsx("div",{children:e.jsxs("div",{className:"relative bg-white border rounded-lg p-6",children:[e.jsx(m,{variant:"outline",size:"icon",onClick:()=>A("impressions"),"aria-label":"Close chart",className:"absolute top-2 right-2 z-10",children:e.jsx(fe,{className:"w-4 h-4"})}),e.jsx(je,{data:x,config:{value:{label:t?.label||"Value",color:"hsl(var(--chart-1))"}},showLegend:!1,showGrid:!0,showTooltip:!0,showXAxis:!0,showYAxis:!0,className:"h-52 w-full",xAxisDataKey:"day"})]})})]});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Sponsored Products: Summer Launch (Running)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:O,onChange:$},attributionWindowProps:{value:_,onChange:Z},dateRangeProps:{dateRange:u,onDateRangeChange:N,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(c,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:K,onChange:J,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:G,onChange:H,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:W,onChange:z,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:q,onDateChange:X})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:R,onDateChange:M})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Products",value:"products",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Search Volume",options:[{label:"High",value:"High"},{label:"Medium",value:"Medium"},{label:"Low",value:"Low"}],selectedValues:g,onChange:T},{name:"Competitive",options:[{label:"High",value:"High"},{label:"Medium",value:"Medium"},{label:"Low",value:"Low"}],selectedValues:h,onChange:Y}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search products..."}),e.jsx(S,{columns:[{key:"productId",header:"Product ID"},{key:"gtin",header:"GTIN"},{key:"image",header:"Image",render:s=>e.jsx("img",{src:s.image,alt:"Product",className:"w-8 h-8 rounded object-cover"})},{key:"productTitle",header:"Product Title"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks"},{key:"addToCart",header:"Add to Cart"},{key:"avgCPC",header:"Avg CPC"},{key:"ctr",header:"CTR"},{key:"atc",header:"ATC"},{key:"conversion",header:"Conversion"},{key:"sales",header:"Sales"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"roas",header:"ROAS"},{key:"extROAS",header:"Ext. ROAS"},{key:"iROAS",header:"IROAS"},{key:"startTime",header:"Start Time",render:s=>new Date(s.startTime).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"endTime",header:"End Time",render:s=>new Date(s.endTime).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"searchVolume",header:"Search Volume",render:s=>e.jsx(l,{variant:s.searchVolume==="High"?"success":s.searchVolume==="Medium"?"warning":"secondary",children:s.searchVolume})},{key:"competitive",header:"Competitive",render:s=>e.jsx(l,{variant:s.competitive==="High"?"destructive":s.competitive==="Medium"?"warning":"success",children:s.competitive})}],data:E.filter(s=>{const oe=g.length===0||g.includes(s.searchVolume),ie=h.length===0||h.includes(s.competitive);return oe&&ie}),rowKey:s=>s.productId})]})},{label:"Keywords",value:"keywords",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Match Type",options:[{label:"Exact",value:"Exact"},{label:"Phrase",value:"Phrase"},{label:"Broad",value:"Broad"}],selectedValues:[],onChange:()=>{}},{name:"Status",options:[{label:"Active",value:"Active"},{label:"Paused",value:"Paused"},{label:"Negative",value:"Negative"}],selectedValues:[],onChange:()=>{}}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search keywords..."}),e.jsx(S,{columns:[{key:"keyword",header:"Keyword"},{key:"matchType",header:"Match Type",render:s=>e.jsx(l,{variant:"outline",children:s.matchType})},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks"},{key:"avgCPC",header:"Avg CPC"},{key:"ctr",header:"CTR"},{key:"conversion",header:"Conversion"},{key:"sales",header:"Sales"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"roas",header:"ROAS"},{key:"searchVolume",header:"Search Volume",render:s=>e.jsx(l,{variant:s.searchVolume==="High"?"success":s.searchVolume==="Medium"?"warning":"secondary",children:s.searchVolume})},{key:"competitive",header:"Competitive",render:s=>e.jsx(l,{variant:s.competitive==="High"?"destructive":s.competitive==="Medium"?"warning":"success",children:s.competitive})}],data:[{keyword:"premium coffee beans",matchType:"Exact",impressions:"342,156",clicks:"8,923",avgCPC:"€0.38",ctr:"2.6%",conversion:"1.8%",sales:"€4,234",budget:"€200",spent:"€187",budgetLeft:"€13",roas:"2.8x",searchVolume:"High",competitive:"Medium"},{keyword:"organic coffee",matchType:"Phrase",impressions:"187,432",clicks:"4,567",avgCPC:"€0.42",ctr:"2.4%",conversion:"1.5%",sales:"€2,156",budget:"€150",spent:"€143",budgetLeft:"€7",roas:"2.1x",searchVolume:"Medium",competitive:"High"},{keyword:"coffee beans 500g",matchType:"Broad",impressions:"89,234",clicks:"1,892",avgCPC:"€0.29",ctr:"2.1%",conversion:"2.2%",sales:"€1,234",budget:"€100",spent:"€95",budgetLeft:"€5",roas:"3.1x",searchVolume:"Low",competitive:"Low"}],rowKey:s=>s.keyword})]})},{label:"Categories",value:"categories",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Category Level",options:[{label:"Level 1",value:"Level 1"},{label:"Level 2",value:"Level 2"},{label:"Level 3",value:"Level 3"}],selectedValues:[],onChange:()=>{}},{name:"Status",options:[{label:"Active",value:"Active"},{label:"Paused",value:"Paused"},{label:"Excluded",value:"Excluded"}],selectedValues:[],onChange:()=>{}}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search categories..."}),e.jsx(S,{columns:[{key:"category",header:"Category"},{key:"level",header:"Level",render:s=>e.jsx(l,{variant:"secondary",children:s.level})},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks"},{key:"avgCPC",header:"Avg CPC"},{key:"ctr",header:"CTR"},{key:"conversion",header:"Conversion"},{key:"sales",header:"Sales"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"roas",header:"ROAS"},{key:"searchVolume",header:"Search Volume",render:s=>e.jsx(l,{variant:s.searchVolume==="High"?"success":s.searchVolume==="Medium"?"warning":"secondary",children:s.searchVolume})},{key:"competitive",header:"Competitive",render:s=>e.jsx(l,{variant:s.competitive==="High"?"destructive":s.competitive==="Medium"?"warning":"success",children:s.competitive})}],data:[{category:"Food & Beverages > Coffee & Tea",level:"Level 2",impressions:"456,789",clicks:"12,345",avgCPC:"€0.35",ctr:"2.7%",conversion:"1.9%",sales:"€5,678",budget:"€300",spent:"€278",budgetLeft:"€22",roas:"3.2x",searchVolume:"High",competitive:"Medium"},{category:"Food & Beverages > Snacks",level:"Level 2",impressions:"234,567",clicks:"6,789",avgCPC:"€0.41",ctr:"2.9%",conversion:"1.6%",sales:"€3,456",budget:"€200",spent:"€189",budgetLeft:"€11",roas:"2.8x",searchVolume:"Medium",competitive:"High"},{category:"Organic Products",level:"Level 1",impressions:"345,678",clicks:"8,912",avgCPC:"€0.33",ctr:"2.6%",conversion:"2.1%",sales:"€4,567",budget:"€250",spent:"€234",budgetLeft:"€16",roas:"3.5x",searchVolume:"Medium",competitive:"Low"}],rowKey:s=>s.category})]})},{label:"Other",value:"other",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Setting Type",options:[{label:"Targeting",value:"Targeting"},{label:"Bidding",value:"Bidding"},{label:"Schedule",value:"Schedule"}],selectedValues:[],onChange:()=>{}},{name:"Status",options:[{label:"Active",value:"Active"},{label:"Inactive",value:"Inactive"}],selectedValues:[],onChange:()=>{}}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search settings..."}),e.jsx(S,{columns:[{key:"setting",header:"Setting"},{key:"type",header:"Type",render:s=>e.jsx(l,{variant:"outline",children:s.type})},{key:"value",header:"Value"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks"},{key:"avgCPC",header:"Avg CPC"},{key:"ctr",header:"CTR"},{key:"conversion",header:"Conversion"},{key:"sales",header:"Sales"},{key:"budget",header:"Budget"},{key:"spent",header:"Spent"},{key:"budgetLeft",header:"Budget Left"},{key:"roas",header:"ROAS"},{key:"status",header:"Status",render:s=>e.jsx(l,{variant:s.status==="Active"?"success":"secondary",children:s.status})}],data:[{setting:"Age: 25-54",type:"Targeting",value:"Included",impressions:"567,890",clicks:"14,567",avgCPC:"€0.36",ctr:"2.6%",conversion:"1.8%",sales:"€6,789",budget:"€400",spent:"€387",budgetLeft:"€13",roas:"3.1x",status:"Active"},{setting:"Gender: All",type:"Targeting",value:"Included",impressions:"456,789",clicks:"11,234",avgCPC:"€0.39",ctr:"2.5%",conversion:"1.7%",sales:"€5,234",budget:"€300",spent:"€289",budgetLeft:"€11",roas:"2.9x",status:"Active"},{setting:"Schedule: Weekdays 9-17",type:"Schedule",value:"Active",impressions:"234,567",clicks:"6,789",avgCPC:"€0.34",ctr:"2.9%",conversion:"2.0%",sales:"€3,456",budget:"€200",spent:"€192",budgetLeft:"€8",roas:"3.4x",status:"Active"}],rowKey:s=>s.setting})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:p,onChange:j},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Dates Modified",value:"Dates Modified"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:D,onChange:B}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:s=>new Date(s.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:s=>e.jsx(l,{variant:"outline",children:s.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:F.filter(s=>{const oe=p.length===0||p.includes(s.user),ie=D.length===0||D.includes(s.action);return oe&&ie}),rowKey:s=>s.id,onRowClick:s=>console.log(`Navigate to log detail: ${s.action} (${s.id})`)})]})}],action:r==="products"?e.jsx(m,{children:"Add product"}):r==="keywords"?e.jsx(m,{children:"Add keyword"}):r==="categories"?e.jsx(m,{children:"Add categories"}):r==="other"?e.jsx(m,{children:"Add other"}):null,activeTab:r,onTabChange:P})]})})}},Pe={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Approved",name:"Social Banner Pack",format:"Social Media",placements:6,adSpend:"$25,935",impressions:"3,854,196",clicks:"59,537",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$65,592",onlineSkuUnits:"4,447",onlineSkuConversions:"2,680",instoreSkuRevenue:"$46,884",instoreSkuUnits:"3,137",instoreSkuConversions:"1,894",totalSkuRevenue:"$112,476",totalSkuUnits:"7,584",totalSkuConversions:"4,574"},{id:"CR-002",status:"Approved",name:"CTV Spot 30s",format:"Video",placements:3,adSpend:"$25,935",impressions:"3,854,196",clicks:"59,537",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$65,592",onlineSkuUnits:"4,447",onlineSkuConversions:"2,680",instoreSkuRevenue:"$46,884",instoreSkuUnits:"3,137",instoreSkuConversions:"1,894",totalSkuRevenue:"$112,476",totalSkuUnits:"7,584",totalSkuConversions:"4,574"},{id:"CR-003",status:"Approved",name:"Audio Spot 15s",format:"Audio",placements:2,adSpend:"$17,290",impressions:"2,569,464",clicks:"39,691",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$43,728",onlineSkuUnits:"2,965",onlineSkuConversions:"1,787",instoreSkuRevenue:"$31,256",instoreSkuUnits:"2,091",instoreSkuConversions:"1,262",totalSkuRevenue:"$74,984",totalSkuUnits:"5,056",totalSkuConversions:"3,049"},{id:"CR-004",status:"Approved",name:"DOOH Billboard",format:"Digital Out-of-Home",placements:4,adSpend:"$17,290",impressions:"2,569,464",clicks:"39,691",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$43,728",onlineSkuUnits:"2,964",onlineSkuConversions:"1,787",instoreSkuRevenue:"$31,256",instoreSkuUnits:"2,091",instoreSkuConversions:"1,262",totalSkuRevenue:"$74,984",totalSkuUnits:"5,055",totalSkuConversions:"3,049"}],$=[{id:"LI-001",status:"Running",name:"3rd Party Display Campaign",channel:"3rd Party Display",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend",adSpend:"$12,350",impressions:"1,835,331",clicks:"28,349",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$31,234",onlineSkuUnits:"2,118",onlineSkuConversions:"1,276",instoreSkuRevenue:"$22,326",instoreSkuUnits:"1,494",instoreSkuConversions:"902",totalSkuRevenue:"$53,560",totalSkuUnits:"3,612",totalSkuConversions:"2,178"},{id:"LI-002",status:"Running",name:"Meta & Google Social Ads",channel:"Socials",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Optimize Budget",adSpend:"$15,561",impressions:"2,312,917",clicks:"35,722",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$39,355",onlineSkuUnits:"2,669",onlineSkuConversions:"1,608",instoreSkuRevenue:"$28,130",instoreSkuUnits:"1,882",instoreSkuConversions:"1,136",totalSkuRevenue:"$67,485",totalSkuUnits:"4,551",totalSkuConversions:"2,744"},{id:"LI-003",status:"Running",name:"Connected TV Spots",channel:"Connected TV",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend",adSpend:"$14,184",impressions:"2,108,394",clicks:"32,561",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$35,886",onlineSkuUnits:"2,434",onlineSkuConversions:"1,467",instoreSkuRevenue:"$25,651",instoreSkuUnits:"1,716",instoreSkuConversions:"1,036",totalSkuRevenue:"$61,537",totalSkuUnits:"4,150",totalSkuConversions:"2,503"},{id:"LI-004",status:"Running",name:"Digital Out-of-Home Network",channel:"3rd Party DOOH",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Optimize Budget",adSpend:"$9,566",impressions:"1,421,287",clicks:"21,953",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$24,205",onlineSkuUnits:"1,641",onlineSkuConversions:"989",instoreSkuRevenue:"$17,304",instoreSkuUnits:"1,158",instoreSkuConversions:"699",totalSkuRevenue:"$41,509",totalSkuUnits:"2,799",totalSkuConversions:"1,688"},{id:"LI-005",status:"Running",name:"AI-Powered Programmatic",channel:"AI",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend",adSpend:"$14,184",impressions:"2,108,394",clicks:"32,561",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$35,886",onlineSkuUnits:"2,434",onlineSkuConversions:"1,467",instoreSkuRevenue:"$25,651",instoreSkuUnits:"1,716",instoreSkuConversions:"1,036",totalSkuRevenue:"$61,537",totalSkuUnits:"4,150",totalSkuConversions:"2,503"},{id:"LI-006",status:"Running",name:"Audio Streaming Ads",channel:"3rd Party Audio",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Optimize Budget",adSpend:"$8,255",impressions:"1,226,527",clicks:"18,944",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$20,896",onlineSkuUnits:"1,417",onlineSkuConversions:"854",instoreSkuRevenue:"$14,935",instoreSkuUnits:"999",instoreSkuConversions:"603",totalSkuRevenue:"$35,831",totalSkuUnits:"2,416",totalSkuConversions:"1,457"},{id:"LI-007",status:"Running",name:"Direct Mail Campaign",channel:"3rd Party Mailing",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend",adSpend:"$12,350",impressions:"1,834,470",clicks:"28,326",cpc:"$0.44",ctr:"1.54%",cpm:"$9.34",ecpm:"$6.73",onlineSkuRevenue:"$31,177",onlineSkuUnits:"2,110",onlineSkuConversions:"1,273",instoreSkuRevenue:"$22,283",instoreSkuUnits:"1,491",instoreSkuConversions:"900",totalSkuRevenue:"$53,460",totalSkuUnits:"3,601",totalSkuConversions:"2,173"}],E=[{id:"LOG-001",timestamp:"2024-12-10 14:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Offsite: Summer Launch",description:"Initial offsite campaign creation"},{id:"LOG-002",timestamp:"2024-12-10 14:35:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"$50,000",newValue:"$120,000",description:"Budget increased for multi-channel offsite push"},{id:"LOG-003",timestamp:"2024-12-10 15:22:45",user:"John Smith",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"Running",description:"Offsite campaign is now live"},{id:"LOG-004",timestamp:"2024-12-11 09:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added 3rd Party Display line item"},{id:"LOG-005",timestamp:"2024-12-11 10:45:21",user:"Jane Doe",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-002",description:"Added Socials campaign line item"},{id:"LOG-006",timestamp:"2024-12-11 11:30:14",user:"Mike Johnson",action:"Channel Added",field:"Channels",oldValue:"-",newValue:"Connected TV",description:"Added CTV channel to offsite mix"},{id:"LOG-007",timestamp:"2024-12-11 16:20:58",user:"Sarah Wilson",action:"Target Updated",field:"Targeting",oldValue:"Desktop 18-35",newValue:"Multi-device 18-54",description:"Expanded targeting for offsite channels"},{id:"LOG-008",timestamp:"2024-12-12 08:45:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Offsite performance exceeds expectations across all channels",description:"Added performance comment"}],F=t=>{switch(t){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=t=>{switch(t){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),f=[{key:"adSpend",label:"Ad Spend",value:"$86,450",subMetric:"Budget: $120,000",badgeValue:"+15%",badgeVariant:"success"},{key:"impressions",label:"Impressions",value:"12,847,320",subMetric:"Unique: 5.8M",badgeValue:"+18%",badgeVariant:"success"},{key:"clicks",label:"Clicks + Add to Carts",value:"198,456",subMetric:"Add to Carts: 24,807",badgeValue:"+12%",badgeVariant:"success"},{key:"cpc",label:"CPC",value:"$0.44",subMetric:"Ad Spend / Clicks",badgeValue:"-8%",badgeVariant:"success"},{key:"ctr",label:"CTR",value:"1.54%",subMetric:"Clicks / Impressions",badgeValue:"+20%",badgeVariant:"success"},{key:"cpm",label:"CPM",value:"$9.34",subMetric:"Budget / Impressions × 1,000",badgeValue:"-6%",badgeVariant:"success"},{key:"ecpm",label:"eCPM",value:"$6.73",subMetric:"Spend / Impressions × 1,000",badgeValue:"-4%",badgeVariant:"success"},{key:"onlineSkuRevenue",label:"Online SKU Revenue",value:"$218,640",subMetric:`${u}-day attribution`,badgeValue:"+22%",badgeVariant:"success"},{key:"onlineSkuUnits",label:"Online SKU Units",value:"14,823",subMetric:`${u}-day attribution`,badgeValue:"+18%",badgeVariant:"success"},{key:"onlineSkuConversions",label:"Online SKU Conversions",value:"8,934",subMetric:`${u}-day attribution`,badgeValue:"+16%",badgeVariant:"success"},{key:"instoreSkuRevenue",label:"In-store SKU Revenue",value:"$156,280",subMetric:`${u}-day attribution`,badgeValue:"+19%",badgeVariant:"success"},{key:"instoreSkuUnits",label:"In-store SKU Units",value:"10,456",subMetric:`${u}-day attribution`,badgeValue:"+14%",badgeVariant:"success"},{key:"instoreSkuConversions",label:"In-store SKU Conversions",value:"6,312",subMetric:`${u}-day attribution`,badgeValue:"+11%",badgeVariant:"success"},{key:"totalSkuRevenue",label:"Total SKU Revenue",value:"$374,920",subMetric:`${u}-day attribution`,badgeValue:"+21%",badgeVariant:"success"},{key:"totalSkuUnits",label:"Total SKU Units",value:"25,279",subMetric:`${u}-day attribution`,badgeValue:"+16%",badgeVariant:"success"},{key:"totalSkuConversions",label:"Total SKU Conversions",value:"15,246",subMetric:`${u}-day attribution`,badgeValue:"+14%",badgeVariant:"success"}],x=()=>e.jsx(ve,{metrics:f,selectedKeys:["adSpend","impressions","ctr","totalSkuRevenue"],maxVisible:5,defaultVariant:"default",removable:!0});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Offsite: Summer Launch (Running)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(x,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Channel",options:[{label:"3rd Party Display",value:"3rd Party Display"},{label:"Socials",value:"Socials"},{label:"Connected TV",value:"Connected TV"},{label:"3rd Party DOOH",value:"3rd Party DOOH"},{label:"AI",value:"AI"},{label:"3rd Party Audio",value:"3rd Party Audio"},{label:"3rd Party Mailing",value:"3rd Party Mailing"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:t=>e.jsx(l,{variant:K(t.status),children:t.status})},{key:"name",header:"Name"},{key:"aiRecommendation",header:"AI Recommendation",render:t=>e.jsx(l,{variant:t.aiRecommendation==="Optimize Budget"?"warning":"info",children:t.aiRecommendation})},{key:"channel",header:"Channel"},{key:"start",header:"Start date",render:t=>new Date(t.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:t=>new Date(t.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"adSpend",header:"Ad Spend"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks + Add to Carts"},{key:"cpc",header:"CPC"},{key:"ctr",header:"CTR"},{key:"cpm",header:"CPM"},{key:"ecpm",header:"eCPM"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"onlineSkuUnits",header:"Online SKU Units"},{key:"onlineSkuConversions",header:"Online SKU Conversions"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"},{key:"instoreSkuUnits",header:"In-store SKU Units"},{key:"instoreSkuConversions",header:"In-store SKU Conversions"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuUnits",header:"Total SKU Units"},{key:"totalSkuConversions",header:"Total SKU Conversions"}],data:$.filter(t=>{const a=v.length===0||v.includes(t.status),c=g.length===0||g.includes(t.channel);return a&&c}),rowKey:t=>t.id,onRowClick:t=>window.location.href=`/campaigns/offsite/line-item/${t.id}`})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Social Media",value:"Social Media"},{label:"Video",value:"Video"},{label:"Audio",value:"Audio"},{label:"Digital Out-of-Home",value:"Digital Out-of-Home"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:t=>e.jsx(l,{variant:F(t.status),children:t.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:t=>e.jsx(l,{variant:"secondary",children:t.placements})},{key:"adSpend",header:"Ad Spend"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks + Add to Carts"},{key:"cpc",header:"CPC"},{key:"ctr",header:"CTR"},{key:"cpm",header:"CPM"},{key:"ecpm",header:"eCPM"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"onlineSkuUnits",header:"Online SKU Units"},{key:"onlineSkuConversions",header:"Online SKU Conversions"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"},{key:"instoreSkuUnits",header:"In-store SKU Units"},{key:"instoreSkuConversions",header:"In-store SKU Conversions"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuUnits",header:"Total SKU Units"},{key:"totalSkuConversions",header:"Total SKU Conversions"}],data:O.filter(t=>{const a=h.length===0||h.includes(t.status),c=y.length===0||y.includes(t.format);return a&&c}),rowKey:t=>t.id,onRowClick:t=>window.location.href=`/campaigns/offsite/creative/${t.id}`})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Channel Added",value:"Channel Added"},{label:"Target Updated",value:"Target Updated"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:t=>new Date(t.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:t=>e.jsx(l,{variant:"outline",children:t.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(t=>{const a=b.length===0||b.includes(t.user),c=p.length===0||p.includes(t.action);return a&&c}),rowKey:t=>t.id,onRowClick:t=>window.location.href=`/campaigns/offsite/log/${t.id}`})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}},Te={render:()=>{const{theme:I}=de(),L=ue(I||"retailMedia"),[r,P]=n.useState("line-items"),[v,A]=n.useState([]),[g,T]=n.useState([]),[h,Y]=n.useState([]),[y,ne]=n.useState([]),[b,Q]=n.useState([]),[p,j]=n.useState([]),[D,B]=C.useState({from:new Date("2024-06-01"),to:ge(new Date("2024-06-01"),30)}),[u,N]=C.useState(14),[_,Z]=C.useState("coca-cola"),O=[{id:"CR-001",status:"Pending",name:"Social Banner Pack",format:"Social Media",placements:4,adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"CR-002",status:"Approved",name:"CTV Spot 30s",format:"Video",placements:2,adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"CR-003",status:"Rejected",name:"Audio Spot 15s",format:"Audio",placements:0,adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"}],$=[{id:"LI-001",status:"In-option",name:"3rd Party Display Campaign",channel:"3rd Party Display",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Increase Spend",adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"LI-002",status:"In-option",name:"Meta & Google Social Ads",channel:"Socials",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Optimize Budget",adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"LI-003",status:"Ready",name:"Connected TV Spots",channel:"Connected TV",start:"2024-08-10",end:"2024-09-10",aiRecommendation:"Increase Spend",adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"LI-004",status:"In-option",name:"Digital Out-of-Home Network",channel:"3rd Party DOOH",start:"2024-11-01",end:"2024-11-30",aiRecommendation:"Optimize Budget",adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"LI-005",status:"Ready",name:"AI-Powered Programmatic",channel:"AI",start:"2024-12-01",end:"2024-12-31",aiRecommendation:"Increase Spend",adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"LI-006",status:"In-option",name:"Audio Streaming Ads",channel:"3rd Party Audio",start:"2024-06-01",end:"2024-06-30",aiRecommendation:"Optimize Budget",adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"},{id:"LI-007",status:"Ready",name:"Direct Mail Campaign",channel:"3rd Party Mailing",start:"2024-07-01",end:"2024-07-31",aiRecommendation:"Increase Spend",adSpend:"-",impressions:"-",clicks:"-",cpc:"-",ctr:"-",cpm:"-",ecpm:"-",onlineSkuRevenue:"-",onlineSkuUnits:"-",onlineSkuConversions:"-",instoreSkuRevenue:"-",instoreSkuUnits:"-",instoreSkuConversions:"-",totalSkuRevenue:"-",totalSkuUnits:"-",totalSkuConversions:"-"}],E=[{id:"LOG-001",timestamp:"2024-12-09 15:30:00",user:"Jane Doe",action:"Campaign Created",field:"Campaign",oldValue:"-",newValue:"Offsite: Summer Launch",description:"Initial offsite campaign creation"},{id:"LOG-002",timestamp:"2024-12-09 15:45:12",user:"Jane Doe",action:"Budget Updated",field:"Budget",oldValue:"$0",newValue:"$100,000",description:"Initial budget allocation for offsite channels"},{id:"LOG-003",timestamp:"2024-12-10 08:15:33",user:"Sarah Wilson",action:"Line Item Added",field:"Line Items",oldValue:"-",newValue:"LI-001",description:"Added 3rd Party Display line item for approval"},{id:"LOG-004",timestamp:"2024-12-10 09:30:21",user:"Jane Doe",action:"Creative Uploaded",field:"Creatives",oldValue:"-",newValue:"CR-001",description:"Social banner pack uploaded for review"},{id:"LOG-005",timestamp:"2024-12-10 10:15:14",user:"Mike Johnson",action:"Status Changed",field:"Status",oldValue:"Draft",newValue:"In-option",description:"Campaign moved to in-option for client review"},{id:"LOG-006",timestamp:"2024-12-10 13:45:58",user:"Sarah Wilson",action:"Channel Added",field:"Channels",oldValue:"3rd Party Display",newValue:"+ Socials, Connected TV",description:"Expanded offsite channel mix"},{id:"LOG-007",timestamp:"2024-12-10 16:20:12",user:"John Smith",action:"Comment Added",field:"Notes",oldValue:"-",newValue:"Awaiting creative approval for all offsite channels",description:"Added client feedback status"}],F=t=>{switch(t){case"Approved":return"success";case"Rejected":return"destructive";case"Pending":return"warning";default:return"outline"}},K=t=>{switch(t){case"In-option":return"outline";case"Running":return"success";case"Paused":return"warning";case"Stopped":return"destructive";case"Ready":return"info";default:return"outline"}},[J,G]=n.useState(void 0),[H,W]=n.useState(void 0),[z,q]=n.useState(void 0),[X,R]=n.useState(),[M,V]=n.useState(),f=[{key:"adSpend",label:"Ad Spend",value:"$0",subMetric:"Budget: $100,000",badgeValue:"Est.",badgeVariant:"secondary"},{key:"impressions",label:"Impressions",value:"8,500,000",subMetric:"Projected",badgeValue:"Est.",badgeVariant:"secondary"},{key:"clicks",label:"Clicks + Add to Carts",value:"127,500",subMetric:"Est. Add to Carts: 15,938",badgeValue:"Est.",badgeVariant:"secondary"},{key:"cpc",label:"CPC",value:"$0.78",subMetric:"Ad Spend / Clicks",badgeValue:"Est.",badgeVariant:"secondary"},{key:"ctr",label:"CTR",value:"1.50%",subMetric:"Clicks / Impressions",badgeValue:"Est.",badgeVariant:"secondary"},{key:"cpm",label:"CPM",value:"$11.76",subMetric:"Budget / Impressions × 1,000",badgeValue:"Est.",badgeVariant:"secondary"},{key:"ecpm",label:"eCPM",value:"-",subMetric:"Spend / Impressions × 1,000",badgeValue:"Est.",badgeVariant:"secondary"},{key:"onlineSkuRevenue",label:"Online SKU Revenue",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"onlineSkuUnits",label:"Online SKU Units",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"onlineSkuConversions",label:"Online SKU Conversions",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"instoreSkuRevenue",label:"In-store SKU Revenue",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"instoreSkuUnits",label:"In-store SKU Units",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"instoreSkuConversions",label:"In-store SKU Conversions",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"totalSkuRevenue",label:"Total SKU Revenue",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"totalSkuUnits",label:"Total SKU Units",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"},{key:"totalSkuConversions",label:"Total SKU Conversions",value:"-",subMetric:`${u}-day attribution`,badgeValue:"Est.",badgeVariant:"secondary"}],x=()=>e.jsx(ve,{metrics:f,selectedKeys:["adSpend","impressions","ctr","totalSkuRevenue"],maxVisible:5,defaultVariant:"default",removable:!0});return e.jsx(ce,{children:e.jsxs(le,{routes:L,logo:{src:"/next.svg",alt:"Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Offsite: Summer Launch (In-option)",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),variant:"campaign-detail",advertiserProps:{value:_,onChange:Z},attributionWindowProps:{value:u,onChange:N},dateRangeProps:{dateRange:D,onDateRangeChange:B,placeholder:"Select date range",showPresets:!0}},children:[e.jsx("div",{className:"mb-8",children:e.jsx(x,{})}),e.jsx(me,{className:"w-full",header:r==="details"?e.jsxs("form",{className:"space-y-8 w-full max-w-2xl",children:[e.jsx(w,{title:"Details",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign name"}),e.jsx(d,{placeholder:"Enter campaign name"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"PO Number"}),e.jsx(d,{placeholder:"Enter PO number"})]})]})}),e.jsx(w,{title:"Advertiser",className:"mb-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Advertiser"}),e.jsx(d,{dropdown:!0,options:[{label:"Acme Media",value:"acme"},{label:"BrandX",value:"brandx"}],value:J,onChange:G,placeholder:"Select advertiser"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Brand"}),e.jsx(d,{dropdown:!0,options:[{label:"Brand 1",value:"brand1"},{label:"Brand 2",value:"brand2"}],value:H,onChange:W,placeholder:"Select brand"})]})]})}),e.jsxs(w,{title:"Campaign",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Campaign Goal"}),e.jsx(d,{dropdown:!0,options:[{label:"Awareness",value:"awareness"},{label:"Engagement",value:"engagement"},{label:"Conversion",value:"conversion"}],value:z,onChange:q,placeholder:"Select goal"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Budget"}),e.jsx(d,{placeholder:"Enter budget",type:"number",min:"0"})]})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Run Time"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsx("div",{children:e.jsx(U,{placeholder:"Start date",date:X,onDateChange:R})}),e.jsx("div",{children:e.jsx(U,{placeholder:"End date",date:M,onDateChange:V})})]})]})]}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-primary text-white rounded",children:"Save"})]}):null,tabs:[{label:"Details",value:"details",content:null},{label:"Line-items",value:"line-items",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"In-option",value:"In-option"},{label:"Running",value:"Running"},{label:"Paused",value:"Paused"},{label:"Stopped",value:"Stopped"},{label:"Ready",value:"Ready"}],selectedValues:v,onChange:A},{name:"Channel",options:[{label:"3rd Party Display",value:"3rd Party Display"},{label:"Socials",value:"Socials"},{label:"Connected TV",value:"Connected TV"},{label:"3rd Party DOOH",value:"3rd Party DOOH"},{label:"AI",value:"AI"},{label:"3rd Party Audio",value:"3rd Party Audio"},{label:"3rd Party Mailing",value:"3rd Party Mailing"}],selectedValues:g,onChange:T}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search line items..."}),e.jsx(S,{columns:[{key:"id",header:"Line-item ID"},{key:"status",header:"Status",render:t=>e.jsx(l,{variant:K(t.status),children:t.status})},{key:"name",header:"Name"},{key:"aiRecommendation",header:"AI Recommendation",render:t=>e.jsx(l,{variant:t.aiRecommendation==="Optimize Budget"?"warning":"info",children:t.aiRecommendation})},{key:"channel",header:"Channel"},{key:"start",header:"Start date",render:t=>new Date(t.start).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"end",header:"End date",render:t=>new Date(t.end).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"adSpend",header:"Ad Spend"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks + Add to Carts"},{key:"cpc",header:"CPC"},{key:"ctr",header:"CTR"},{key:"cpm",header:"CPM"},{key:"ecpm",header:"eCPM"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"onlineSkuUnits",header:"Online SKU Units"},{key:"onlineSkuConversions",header:"Online SKU Conversions"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"},{key:"instoreSkuUnits",header:"In-store SKU Units"},{key:"instoreSkuConversions",header:"In-store SKU Conversions"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuUnits",header:"Total SKU Units"},{key:"totalSkuConversions",header:"Total SKU Conversions"}],data:$.filter(t=>{const a=v.length===0||v.includes(t.status),c=g.length===0||g.includes(t.channel);return a&&c}),rowKey:t=>t.id,onRowClick:t=>console.log(`Navigate to line-item detail: ${t.name} (${t.id})`)})]})},{label:"Creatives",value:"creatives",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Status",options:[{label:"Approved",value:"Approved"},{label:"Rejected",value:"Rejected"},{label:"Pending",value:"Pending"}],selectedValues:h,onChange:Y},{name:"Format",options:[{label:"Social Media",value:"Social Media"},{label:"Video",value:"Video"},{label:"Audio",value:"Audio"},{label:"Digital Out-of-Home",value:"Digital Out-of-Home"}],selectedValues:y,onChange:ne}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search creatives..."}),e.jsx(S,{columns:[{key:"id",header:"Creative ID"},{key:"status",header:"Status",render:t=>e.jsx(l,{variant:F(t.status),children:t.status})},{key:"name",header:"Name"},{key:"format",header:"Format"},{key:"placements",header:"Placements",render:t=>e.jsx(l,{variant:"secondary",children:t.placements})},{key:"adSpend",header:"Ad Spend"},{key:"impressions",header:"Impressions"},{key:"clicks",header:"Clicks + Add to Carts"},{key:"cpc",header:"CPC"},{key:"ctr",header:"CTR"},{key:"cpm",header:"CPM"},{key:"ecpm",header:"eCPM"},{key:"onlineSkuRevenue",header:"Online SKU Revenue"},{key:"onlineSkuUnits",header:"Online SKU Units"},{key:"onlineSkuConversions",header:"Online SKU Conversions"},{key:"instoreSkuRevenue",header:"In-store SKU Revenue"},{key:"instoreSkuUnits",header:"In-store SKU Units"},{key:"instoreSkuConversions",header:"In-store SKU Conversions"},{key:"totalSkuRevenue",header:"Total SKU Revenue"},{key:"totalSkuUnits",header:"Total SKU Units"},{key:"totalSkuConversions",header:"Total SKU Conversions"}],data:O.filter(t=>{const a=h.length===0||h.includes(t.status),c=y.length===0||y.includes(t.format);return a&&c}),rowKey:t=>t.id,onRowClick:t=>console.log(`Navigate to creative detail: ${t.name} (${t.id})`)})]})},{label:"Logs",value:"logs",content:e.jsxs("div",{className:"space-y-6 mt-6",children:[e.jsx(k,{filters:[{name:"Users",options:[{label:"Jane Doe",value:"Jane Doe"},{label:"John Smith",value:"John Smith"},{label:"Sarah Wilson",value:"Sarah Wilson"},{label:"Mike Johnson",value:"Mike Johnson"}],selectedValues:b,onChange:Q},{name:"Actions",options:[{label:"Campaign Created",value:"Campaign Created"},{label:"Budget Updated",value:"Budget Updated"},{label:"Status Changed",value:"Status Changed"},{label:"Line Item Added",value:"Line Item Added"},{label:"Creative Uploaded",value:"Creative Uploaded"},{label:"Channel Added",value:"Channel Added"},{label:"Comment Added",value:"Comment Added"}],selectedValues:p,onChange:j}],searchValue:"",onSearchChange:()=>{},searchPlaceholder:"Search logs..."}),e.jsx(S,{columns:[{key:"timestamp",header:"Timestamp",render:t=>new Date(t.timestamp).toLocaleString("en-US",{month:"2-digit",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})},{key:"user",header:"User"},{key:"action",header:"Action",render:t=>e.jsx(l,{variant:"outline",children:t.action})},{key:"field",header:"Field"},{key:"oldValue",header:"Old Value"},{key:"newValue",header:"New Value"},{key:"description",header:"Description"}],data:E.filter(t=>{const a=b.length===0||b.includes(t.user),c=p.length===0||p.includes(t.action);return a&&c}),rowKey:t=>t.id,onRowClick:t=>console.log(`Navigate to log detail: ${t.action} (${t.id})`)})]})}],action:r==="line-items"?e.jsx(m,{children:"Add line-item"}):r==="creatives"?e.jsx(m,{children:"Add creative"}):r==="logs"?e.jsx(m,{children:"Export logs"}):null,activeTab:r,onTabChange:P})]})})}};Ve.parameters={...Ve.parameters,docs:{...Ve.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Approved',
      name: 'Creative 1',
      format: 'Banner',
      placements: 3
    }, {
      id: 'CR-002',
      status: 'Rejected',
      name: 'Creative 2',
      format: 'Video',
      placements: 1
    }, {
      id: 'CR-003',
      status: 'Pending',
      name: 'Creative 3',
      format: 'Banner',
      placements: 2
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'In-option',
      name: 'Line-item 1',
      placement: 'Homepage',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Optimize Budget'
    }, {
      id: 'LI-002',
      status: 'In-option',
      name: 'Line-item 2',
      placement: 'Sidebar',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Increase Spend'
    }, {
      id: 'LI-003',
      status: 'In-option',
      name: 'Line-item 3',
      placement: 'Footer',
      start: '2024-08-10',
      end: '2024-09-10',
      aiRecommendation: 'Optimize Budget'
    }, {
      id: 'LI-004',
      status: 'In-option',
      name: 'Line-item 4',
      placement: 'Header',
      start: '2024-11-01',
      end: '2024-11-30',
      aiRecommendation: 'Increase Spend'
    }, {
      id: 'LI-005',
      status: 'In-option',
      name: 'Line-item 5',
      placement: 'Homepage',
      start: '2024-12-01',
      end: '2024-12-31',
      aiRecommendation: 'Optimize Budget'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Digital In-store: Summer Launch',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€50,000',
      newValue: '€75,000',
      description: 'Budget increased for Q4 push'
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
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added Homepage line item'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'Jane Doe',
      action: 'Creative Uploaded',
      field: 'Creatives',
      oldValue: '-',
      newValue: 'CR-001',
      description: 'Banner creative uploaded'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Dates Modified',
      field: 'End Date',
      oldValue: '2024-06-25',
      newValue: '2024-06-30',
      description: 'Extended campaign end date'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'Target Updated',
      field: 'Targeting',
      oldValue: 'Urban 18-35',
      newValue: 'Urban 18-45',
      description: 'Expanded age targeting'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Approved for launch',
      description: 'Added approval comment'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Forecast metrics for campaign
    const forecastMetrics = [{
      id: 'repetitions',
      label: 'Repetitions Forecast',
      value: '4,200,000',
      subMetric: 'Expected by end date',
      badgeValue: '+3.5%',
      badgeVariant: 'success' as const
    }, {
      id: 'stores',
      label: 'Stores Forecast',
      value: '350',
      subMetric: 'Coverage: 92%',
      badgeValue: '+2%',
      badgeVariant: 'success' as const
    }, {
      id: 'reach',
      label: 'Reach Forecast',
      value: '2.8M',
      subMetric: 'Unique users',
      badgeValue: '+4.2%',
      badgeVariant: 'success' as const
    }, {
      id: 'roas',
      label: 'ROAS Forecast',
      value: '3.35x',
      subMetric: 'Projected return',
      badgeValue: '+3.4%',
      badgeVariant: 'success' as const
    }];

    // State for interactive forecast - following the same pattern as SponsoredProductsRunning
    const [selectedForecastMetric, setSelectedForecastMetric] = useState<string | null>('spend');
    const [spendValue, setSpendValue] = useState(41866); // Initial spend value
    const [dragPosition, setDragPosition] = useState(50); // Position as percentage (0-100)
    const [isDragging, setIsDragging] = useState(false);

    // Calculate ROAS and Revenue based on spend using inverse relationship
    const calculateMetrics = (spend: number) => {
      // ROAS decreases as spend increases (inverse relationship) - scale values to be more visible
      const maxRoas = 600; // Scale up for visibility
      const minRoas = 100;
      const roasRange = maxRoas - minRoas;
      const spendRatio = (spend - 10000) / 40000; // Normalize spend to 0-1 range (10K-50K)
      const roas = maxRoas - spendRatio * roasRange; // This will go from 600 down to 100

      // Revenue increases, creating a crossing point around middle
      const baseRevenue = 100; // Starting revenue 
      const maxRevenue = 500; // Max revenue
      const revenueRange = maxRevenue - baseRevenue;
      const revenue = baseRevenue + spendRatio * revenueRange; // This will go from 100 up to 500

      return {
        spend,
        roas: Math.round(roas),
        revenue: Math.round(revenue)
      };
    };

    // Current metrics based on drag position
    const currentMetrics = calculateMetrics(spendValue);

    // Updated forecast metrics to match the original design and use proper MetricCard
    const updatedForecastMetrics = [{
      id: 'roas',
      label: 'ROAS Forecast',
      value: \`\${(currentMetrics.roas / 100).toFixed(2)}x\`,
      subMetric: 'Projected return',
      badgeValue: '+3.8%',
      badgeVariant: 'success' as const
    }, {
      id: 'revenue',
      label: 'Revenue Forecast',
      value: \`$\${currentMetrics.revenue}K\`,
      subMetric: 'Total revenue',
      badgeValue: '+4.2%',
      badgeVariant: 'success' as const
    }, {
      id: 'performance',
      label: 'Stores Forecast',
      value: '350',
      subMetric: 'Total coverage',
      badgeValue: '+5%',
      badgeVariant: 'success' as const
    }, {
      id: 'customer-segments',
      label: 'Reach Forecast',
      value: '2.8M',
      subMetric: 'Total unique users',
      badgeValue: '+8%',
      badgeVariant: 'success' as const
    }];
    const dialogMetricsDigitalInOption: MetricDefinition[] = [{
      key: 'ctr',
      label: 'Click-Through Rate',
      value: '2.34%',
      subMetric: 'vs. 2.18% last period',
      badgeValue: '+7.3%',
      badgeVariant: 'success'
    }, {
      key: 'conversionRate',
      label: 'Conversion Rate',
      value: '4.12%',
      subMetric: '1,234 conversions',
      badgeValue: '+12.5%',
      badgeVariant: 'success'
    }, {
      key: 'cpc',
      label: 'Cost Per Click',
      value: '$0.58',
      subMetric: 'vs. $0.62 target',
      badgeValue: '-6.5%',
      badgeVariant: 'success'
    }, {
      key: 'viewability',
      label: 'Viewability Rate',
      value: '87.3%',
      subMetric: 'Above industry avg',
      badgeValue: '+5.2%',
      badgeVariant: 'success'
    }, {
      key: 'brandLift',
      label: 'Brand Lift',
      value: '+18.2%',
      subMetric: 'Awareness increase',
      badgeValue: 'High',
      badgeVariant: 'info'
    }, {
      key: 'sov',
      label: 'Share of Voice',
      value: '34.7%',
      subMetric: 'In category',
      badgeValue: '+2.1%',
      badgeVariant: 'secondary'
    }, {
      key: 'frequency',
      label: 'Frequency',
      value: '3.8x',
      subMetric: 'Avg. per user',
      badgeValue: 'Optimal',
      badgeVariant: 'success'
    }, {
      key: 'vcr',
      label: 'Video Completion Rate',
      value: '68.9%',
      subMetric: '15s videos',
      badgeValue: '+9.4%',
      badgeVariant: 'success'
    }, {
      key: 'cpa',
      label: 'Cost Per Acquisition',
      value: '$24.50',
      subMetric: 'vs. $30 target',
      badgeValue: '-18.3%',
      badgeVariant: 'success'
    }];
    const ForecastSection = () => <div className="space-y-6">
        <MetricRow metrics={updatedForecastMetrics.map(m => ({
        ...m,
        key: m.id
      }))} selectedKeys={updatedForecastMetrics.map(m => m.id)} maxVisible={5} defaultVariant="default" removable={false} activeKey={selectedForecastMetric} onActiveKeyChange={setSelectedForecastMetric} dialogMetrics={dialogMetricsDigitalInOption} onDialogMetricClick={key => console.log(\`\${key} selected\`)} />

        {/* Interactive Forecast Chart - only show when spend, roas, or revenue is selected */}
        {(selectedForecastMetric === 'roas' || selectedForecastMetric === 'revenue') && <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button variant="outline" size="icon" onClick={() => setSelectedForecastMetric(null)} aria-label="Close chart" className="absolute top-2 right-2 z-10">
                <X className="w-4 h-4" />
              </Button>
              {/* Generate data for LineChart */}
              <LineChartComponent data={(() => {
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
          })()} config={{
            roas: {
              label: "ROAS",
              color: "hsl(var(--chart-1))" // Theme chart color 1
            },
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-2))" // Theme chart color 2
            }
          }} showLegend={true} showGrid={true} showTooltip={true} showXAxis={true} showYAxis={true} className="h-[300px] w-full" xAxisDataKey="spend" yAxisLabel="Revenue" secondaryYAxis={{
            dataKey: "roas",
            domain: [0, 700],
            label: "ROAS"
          }} />
              
              {/* Interactive overlay for dragging */}
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
              setDragPosition(percentage);
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
            </div>
          </div>}
        
        {/* Regular chart for other metrics */}
        {selectedForecastMetric === 'performance' && <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button variant="outline" size="icon" onClick={() => setSelectedForecastMetric(null)} aria-label="Close chart" className="absolute top-2 right-2 z-10">
                <X className="w-4 h-4" />
              </Button>
              <MapChart data={[
          // Amsterdam area
          {
            name: 'Amsterdam Central',
            plays: 5847,
            x: 48,
            y: 35
          }, {
            name: 'Amsterdam Zuid',
            plays: 4239,
            x: 46,
            y: 40
          }, {
            name: 'Amsterdam Noord',
            plays: 3156,
            x: 50,
            y: 32
          },
          // Rotterdam area
          {
            name: 'Rotterdam Central',
            plays: 6241,
            x: 40,
            y: 55
          }, {
            name: 'Rotterdam Zuid',
            plays: 2847,
            x: 42,
            y: 58
          },
          // Den Haag area
          {
            name: 'Den Haag HS',
            plays: 4156,
            x: 35,
            y: 50
          }, {
            name: 'Den Haag Central',
            plays: 3542,
            x: 33,
            y: 52
          },
          // Utrecht area
          {
            name: 'Utrecht CS',
            plays: 5123,
            x: 52,
            y: 48
          }, {
            name: 'Utrecht Noord',
            plays: 2156,
            x: 54,
            y: 45
          },
          // Eindhoven area
          {
            name: 'Eindhoven CS',
            plays: 3789,
            x: 58,
            y: 70
          }, {
            name: 'Eindhoven Airport',
            plays: 1923,
            x: 62,
            y: 72
          },
          // Other major cities
          {
            name: 'Groningen CS',
            plays: 2456,
            x: 65,
            y: 15
          }, {
            name: 'Breda CS',
            plays: 2789,
            x: 45,
            y: 68
          }, {
            name: 'Tilburg CS',
            plays: 3234,
            x: 52,
            y: 65
          }, {
            name: 'Arnhem CS',
            plays: 2945,
            x: 68,
            y: 52
          }, {
            name: 'Haarlem CS',
            plays: 2567,
            x: 42,
            y: 38
          }, {
            name: 'Almere CS',
            plays: 3456,
            x: 58,
            y: 42
          }]} title="Store Performance Map" className="w-full" />
            </div>
          </div>}
        {/* Reach Forecast pie chart */}
        {selectedForecastMetric === 'customer-segments' && <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button variant="outline" size="icon" onClick={() => setSelectedForecastMetric(null)} aria-label="Close chart" className="absolute top-2 right-2 z-10">
                <X className="w-4 h-4" />
              </Button>
              <PieChartComponent data={[{
            name: 'Urban',
            value: 1260000,
            fill: 'hsl(var(--chart-1))'
          }, {
            name: 'Young adults',
            value: 980000,
            fill: 'hsl(var(--chart-2))'
          }, {
            name: 'Family with kids',
            value: 560000,
            fill: 'hsl(var(--chart-3))'
          }]} config={{
            Urban: {
              label: 'Urban',
              color: 'hsl(var(--chart-1))'
            },
            'Young adults': {
              label: 'Young adults',
              color: 'hsl(var(--chart-2))'
            },
            'Family with kids': {
              label: 'Family with kids',
              color: 'hsl(var(--chart-3))'
            }
          }} showLabels={true} showLegend={true} showTooltip={true} className="h-80 w-full" dataKey="value" nameKey="name" />
            </div>
          </div>}
      </div>;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Digital In-store: Summer Launch (In-Option)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'In-option',
                value: 'In-option'
              }, {
                label: 'Running',
                value: 'Running'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Stopped',
                value: 'Stopped'
              }, {
                label: 'Ready',
                value: 'Ready'
              }],
              selectedValues: lineItemStatus,
              onChange: setLineItemStatus
            }, {
              name: 'Placement',
              options: [{
                label: 'Homepage',
                value: 'Homepage'
              }, {
                label: 'Sidebar',
                value: 'Sidebar'
              }, {
                label: 'Footer',
                value: 'Footer'
              }, {
                label: 'Header',
                value: 'Header'
              }],
              selectedValues: placement,
              onChange: setPlacement
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
              key: 'id',
              header: 'Line-item ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'placement',
              header: 'Placement'
            }, {
              key: 'start',
              header: 'Start date',
              render: row => new Date(row.start).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'end',
              header: 'End date',
              render: row => new Date(row.end).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'aiRecommendation',
              header: 'AI Recommendation',
              render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
            }]} data={lineItemData.filter(row => {
              const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
              const placementMatch = placement.length === 0 || placement.includes(row.placement);
              return statusMatch && placementMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/digital-instore/line-item/\${row.id}\`} />
                </div>
        }, {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'Approved'
              }, {
                label: 'Rejected',
                value: 'Rejected'
              }, {
                label: 'Pending',
                value: 'Pending'
              }],
              selectedValues: creativeStatus,
              onChange: setCreativeStatus
            }, {
              name: 'Format',
              options: [{
                label: 'Banner',
                value: 'Banner'
              }, {
                label: 'Video',
                value: 'Video'
              }],
              selectedValues: creativeFormat,
              onChange: setCreativeFormat
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
              key: 'id',
              header: 'Creative ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'placements',
              header: 'Placements',
              render: row => <Badge variant="secondary">{row.placements}</Badge>
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU conversions'
            }, {
              key: 'totalSkuConversionRate',
              header: 'Total SKU conversion rate'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU units'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuRoas',
              header: 'Total SKU ROAS'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU conversions'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU units'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU conversions'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU units'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }]} data={creativeData.filter(row => {
              const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
              const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
              return statusMatch && formatMatch;
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to creative detail: \${row.name} (\${row.id})\`)} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to log detail: \${row.action} (\${row.id})\`)} />
                </div>
        }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Ve.parameters?.docs?.source}}};xe.parameters={...xe.parameters,docs:{...xe.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Approved',
      name: 'Creative 1',
      format: 'Banner',
      placements: 3
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'Creative 2',
      format: 'Video',
      placements: 1
    }, {
      id: 'CR-003',
      status: 'Approved',
      name: 'Creative 3',
      format: 'Banner',
      placements: 2
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'Running',
      name: 'Line-item 1',
      placement: 'Homepage',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend'
    }, {
      id: 'LI-002',
      status: 'Running',
      name: 'Line-item 2',
      placement: 'Sidebar',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Optimize Budget'
    }, {
      id: 'LI-003',
      status: 'Running',
      name: 'Line-item 3',
      placement: 'Footer',
      start: '2024-08-10',
      end: '2024-09-10',
      aiRecommendation: 'Increase Spend'
    }, {
      id: 'LI-004',
      status: 'Running',
      name: 'Line-item 4',
      placement: 'Header',
      start: '2024-11-01',
      end: '2024-11-30',
      aiRecommendation: 'Optimize Budget'
    }, {
      id: 'LI-005',
      status: 'Running',
      name: 'Line-item 5',
      placement: 'Homepage',
      start: '2024-12-01',
      end: '2024-12-31',
      aiRecommendation: 'Increase Spend'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Digital In-store: Summer Launch',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€50,000',
      newValue: '€75,000',
      description: 'Budget increased for Q4 push'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 15:22:45',
      user: 'John Smith',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'Running',
      description: 'Campaign is now live'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-11 09:15:33',
      user: 'Sarah Wilson',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added Homepage line item'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'Jane Doe',
      action: 'Creative Uploaded',
      field: 'Creatives',
      oldValue: '-',
      newValue: 'CR-001',
      description: 'Banner creative uploaded'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Dates Modified',
      field: 'End Date',
      oldValue: '2024-06-25',
      newValue: '2024-06-30',
      description: 'Extended campaign end date'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'Target Updated',
      field: 'Targeting',
      oldValue: 'Urban 18-35',
      newValue: 'Urban 18-45',
      description: 'Expanded age targeting'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Campaign performing well',
      description: 'Added performance comment'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for running campaign
    const performanceMetrics = [{
      id: 'repetitions',
      label: 'Repetitions',
      value: '4,058,317',
      subMetric: 'CTR: 2.14%',
      badgeValue: '+8%',
      badgeVariant: 'success' as const
    }, {
      id: 'stores',
      label: 'Stores',
      value: '343',
      subMetric: 'Coverage: 89%',
      badgeValue: '0%',
      badgeVariant: 'secondary' as const
    }, {
      id: 'reach',
      label: 'Reach',
      value: '2.6M',
      subMetric: 'Unique users',
      badgeValue: '+12%',
      badgeVariant: 'success' as const
    }, {
      id: 'roas',
      label: 'ROAS',
      value: '3.24x',
      subMetric: 'AOV: €78.50',
      badgeValue: '+12%',
      badgeVariant: 'success' as const
    }];
    const dialogMetricsDigitalInstoreRunning: MetricDefinition[] = [{
      key: 'ctr',
      label: 'Click-Through Rate',
      value: '2.14%',
      subMetric: 'vs. 1.98% last period',
      badgeValue: '+8.1%',
      badgeVariant: 'success'
    }, {
      key: 'conversionRate',
      label: 'Conversion Rate',
      value: '3.84%',
      subMetric: '1,156 conversions',
      badgeValue: '+12.8%',
      badgeVariant: 'success'
    }, {
      key: 'cpc',
      label: 'Cost Per Click',
      value: '$0.45',
      subMetric: 'vs. $0.52 target',
      badgeValue: '-13.5%',
      badgeVariant: 'success'
    }, {
      key: 'viewability',
      label: 'Viewability Rate',
      value: '89.2%',
      subMetric: 'Above industry avg',
      badgeValue: '+6.4%',
      badgeVariant: 'success'
    }, {
      key: 'brandLift',
      label: 'Brand Lift',
      value: '+16.8%',
      subMetric: 'Awareness increase',
      badgeValue: 'High',
      badgeVariant: 'info'
    }, {
      key: 'sov',
      label: 'Share of Voice',
      value: '29.5%',
      subMetric: 'In category',
      badgeValue: '+1.8%',
      badgeVariant: 'secondary'
    }, {
      key: 'frequency',
      label: 'Frequency',
      value: '3.2x',
      subMetric: 'Avg. per user',
      badgeValue: 'Optimal',
      badgeVariant: 'success'
    }, {
      key: 'vcr',
      label: 'Video Completion Rate',
      value: '72.1%',
      subMetric: '15s videos',
      badgeValue: '+8.7%',
      badgeVariant: 'success'
    }, {
      key: 'cpa',
      label: 'Cost Per Acquisition',
      value: '$22.80',
      subMetric: 'vs. $28 target',
      badgeValue: '-18.6%',
      badgeVariant: 'success'
    }];
    const ForecastSection = () => <MetricRow metrics={performanceMetrics.map(m => ({
      ...m,
      key: m.id
    }))} selectedKeys={performanceMetrics.map(m => m.id)} maxVisible={5} defaultVariant="default" removable={false} dialogMetrics={dialogMetricsDigitalInstoreRunning} onDialogMetricClick={key => console.log(\`\${key} selected\`)} />;
    return <BreadcrumbProvider entities={[{
      id: 'C-001',
      name: 'Summer Launch',
      type: 'campaign',
      campaignType: 'digital-instore'
    }]}>
        <MenuContextProvider>
          <AppLayout routes={routes} logo={{
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
          title: 'Digital In-store: Summer Launch (Running)',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Pick a date range with conversion window" showPresets={true} showConversionWindow={true} conversionWindow={conversionWindow} onConversionWindowChange={setConversionWindow} />
        }}>
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                    label: 'Acme Media',
                    value: 'acme'
                  }, {
                    label: 'BrandX',
                    value: 'brandx'
                  }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                    label: 'Brand 1',
                    value: 'brand1'
                  }, {
                    label: 'Brand 2',
                    value: 'brand2'
                  }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                    label: 'Awareness',
                    value: 'awareness'
                  }, {
                    label: 'Engagement',
                    value: 'engagement'
                  }, {
                    label: 'Conversion',
                    value: 'conversion'
                  }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
            label: 'Details',
            value: 'details',
            content: null
          }, {
            label: 'Line-items',
            value: 'line-items',
            content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
                name: 'Status',
                options: [{
                  label: 'In-option',
                  value: 'In-option'
                }, {
                  label: 'Running',
                  value: 'Running'
                }, {
                  label: 'Paused',
                  value: 'Paused'
                }, {
                  label: 'Stopped',
                  value: 'Stopped'
                }, {
                  label: 'Ready',
                  value: 'Ready'
                }],
                selectedValues: lineItemStatus,
                onChange: setLineItemStatus
              }, {
                name: 'Placement',
                options: [{
                  label: 'Homepage',
                  value: 'Homepage'
                }, {
                  label: 'Sidebar',
                  value: 'Sidebar'
                }, {
                  label: 'Footer',
                  value: 'Footer'
                }, {
                  label: 'Header',
                  value: 'Header'
                }],
                selectedValues: placement,
                onChange: setPlacement
              }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
                key: 'id',
                header: 'Line-item ID'
              }, {
                key: 'status',
                header: 'Status',
                render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
              }, {
                key: 'name',
                header: 'Name'
              }, {
                key: 'placement',
                header: 'Placement'
              }, {
                key: 'start',
                header: 'Start date',
                render: row => new Date(row.start).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })
              }, {
                key: 'end',
                header: 'End date',
                render: row => new Date(row.end).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })
              }, {
                key: 'aiRecommendation',
                header: 'AI Recommendation',
                render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
              }]} data={lineItemData.filter(row => {
                const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
                const placementMatch = placement.length === 0 || placement.includes(row.placement);
                return statusMatch && placementMatch;
              })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/digital-instore/line-item/\${row.id}\`} />
                </div>
          }, {
            label: 'Creatives',
            value: 'creatives',
            content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
                name: 'Status',
                options: [{
                  label: 'Approved',
                  value: 'Approved'
                }, {
                  label: 'Rejected',
                  value: 'Rejected'
                }, {
                  label: 'Pending',
                  value: 'Pending'
                }],
                selectedValues: creativeStatus,
                onChange: setCreativeStatus
              }, {
                name: 'Format',
                options: [{
                  label: 'Banner',
                  value: 'Banner'
                }, {
                  label: 'Video',
                  value: 'Video'
                }],
                selectedValues: creativeFormat,
                onChange: setCreativeFormat
              }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
                key: 'id',
                header: 'Creative ID'
              }, {
                key: 'status',
                header: 'Status',
                render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
              }, {
                key: 'name',
                header: 'Name'
              }, {
                key: 'format',
                header: 'Format'
              }, {
                key: 'placements',
                header: 'Placements',
                render: row => <Badge variant="secondary">{row.placements}</Badge>
              }]} data={creativeData.filter(row => {
                const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
                const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
                return statusMatch && formatMatch;
              })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/digital-instore/creative/\${row.id}\`} />
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
                  label: 'Line Item Added',
                  value: 'Line Item Added'
                }, {
                  label: 'Creative Uploaded',
                  value: 'Creative Uploaded'
                }, {
                  label: 'Dates Modified',
                  value: 'Dates Modified'
                }, {
                  label: 'Target Updated',
                  value: 'Target Updated'
                }, {
                  label: 'Comment Added',
                  value: 'Comment Added'
                }],
                selectedValues: logActions,
                onChange: setLogActions
              }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
                key: 'timestamp',
                header: 'Timestamp',
                render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
                render: row => <Badge variant="outline">{row.action}</Badge>
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
              })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/digital-instore/creative/\${row.id}\`} />
                </div>
          }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>
      </BreadcrumbProvider>;
  }
}`,...xe.parameters?.docs?.source}}};De.parameters={...De.parameters,docs:{...De.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Approved',
      name: 'Creative 1',
      format: 'Print',
      placements: 3,
      adSpend: '€12,980',
      impressions: '750,168',
      clicks: '9,827',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€17,072',
      onlineSkuUnits: '1,382',
      onlineSkuConversions: '854',
      instoreSkuRevenue: '€20,496',
      instoreSkuUnits: '1,957',
      instoreSkuConversions: '1,231',
      totalSkuRevenue: '€37,568',
      totalSkuUnits: '3,339',
      totalSkuConversions: '2,085'
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'Creative 2',
      format: 'Poster',
      placements: 1,
      adSpend: '€9,735',
      impressions: '562,626',
      clicks: '7,370',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€12,804',
      onlineSkuUnits: '1,037',
      onlineSkuConversions: '640',
      instoreSkuRevenue: '€15,372',
      instoreSkuUnits: '1,468',
      instoreSkuConversions: '923',
      totalSkuRevenue: '€28,176',
      totalSkuUnits: '2,505',
      totalSkuConversions: '1,563'
    }, {
      id: 'CR-003',
      status: 'Approved',
      name: 'Creative 3',
      format: 'Shelf Talker',
      placements: 2,
      adSpend: '€9,735',
      impressions: '562,626',
      clicks: '7,370',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€12,804',
      onlineSkuUnits: '1,037',
      onlineSkuConversions: '640',
      instoreSkuRevenue: '€15,372',
      instoreSkuUnits: '1,467',
      instoreSkuConversions: '924',
      totalSkuRevenue: '€28,176',
      totalSkuUnits: '2,504',
      totalSkuConversions: '1,564'
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'Running',
      name: 'Line-item 1',
      placement: 'End Cap',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Optimize Budget',
      adSpend: '€6,490',
      impressions: '375,084',
      clicks: '4,913',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€8,536',
      onlineSkuUnits: '691',
      onlineSkuConversions: '427',
      instoreSkuRevenue: '€10,248',
      instoreSkuUnits: '978',
      instoreSkuConversions: '616',
      totalSkuRevenue: '€18,784',
      totalSkuUnits: '1,669',
      totalSkuConversions: '1,043'
    }, {
      id: 'LI-002',
      status: 'Running',
      name: 'Line-item 2',
      placement: 'Shelf Edge',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Increase Spend',
      adSpend: '€6,490',
      impressions: '375,084',
      clicks: '4,913',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€8,536',
      onlineSkuUnits: '691',
      onlineSkuConversions: '427',
      instoreSkuRevenue: '€10,248',
      instoreSkuUnits: '978',
      instoreSkuConversions: '616',
      totalSkuRevenue: '€18,784',
      totalSkuUnits: '1,669',
      totalSkuConversions: '1,043'
    }, {
      id: 'LI-003',
      status: 'Running',
      name: 'Line-item 3',
      placement: 'Floor Stand',
      start: '2024-08-10',
      end: '2024-09-10',
      aiRecommendation: 'Optimize Budget',
      adSpend: '€7,778',
      impressions: '450,101',
      clicks: '5,895',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€10,243',
      onlineSkuUnits: '829',
      onlineSkuConversions: '512',
      instoreSkuRevenue: '€12,298',
      instoreSkuUnits: '1,174',
      instoreSkuConversions: '739',
      totalSkuRevenue: '€22,541',
      totalSkuUnits: '2,003',
      totalSkuConversions: '1,251'
    }, {
      id: 'LI-004',
      status: 'Running',
      name: 'Line-item 4',
      placement: 'Aisle Header',
      start: '2024-11-01',
      end: '2024-11-30',
      aiRecommendation: 'Increase Spend',
      adSpend: '€5,846',
      impressions: '337,575',
      clicks: '4,423',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€7,682',
      onlineSkuUnits: '622',
      onlineSkuConversions: '384',
      instoreSkuRevenue: '€9,223',
      instoreSkuUnits: '881',
      instoreSkuConversions: '554',
      totalSkuRevenue: '€16,905',
      totalSkuUnits: '1,503',
      totalSkuConversions: '938'
    }, {
      id: 'LI-005',
      status: 'Running',
      name: 'Line-item 5',
      placement: 'Checkout',
      start: '2024-12-01',
      end: '2024-12-31',
      aiRecommendation: 'Optimize Budget',
      adSpend: '€5,846',
      impressions: '337,576',
      clicks: '4,423',
      cpc: '€1.32',
      ctr: '1.31%',
      cpm: '€26.64',
      ecpm: '€17.30',
      onlineSkuRevenue: '€7,683',
      onlineSkuUnits: '623',
      onlineSkuConversions: '384',
      instoreSkuRevenue: '€9,223',
      instoreSkuUnits: '881',
      instoreSkuConversions: '553',
      totalSkuRevenue: '€16,906',
      totalSkuUnits: '1,504',
      totalSkuConversions: '937'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Offline In-store: Summer Launch',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€50,000',
      newValue: '€75,000',
      description: 'Budget increased for Q4 push'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 15:22:45',
      user: 'John Smith',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'Running',
      description: 'Campaign is now live'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-11 09:15:33',
      user: 'Sarah Wilson',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added End Cap line item'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'Jane Doe',
      action: 'Creative Uploaded',
      field: 'Creatives',
      oldValue: '-',
      newValue: 'CR-001',
      description: 'Print creative uploaded'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Dates Modified',
      field: 'End Date',
      oldValue: '2024-06-25',
      newValue: '2024-06-30',
      description: 'Extended campaign end date'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'Target Updated',
      field: 'Targeting',
      oldValue: 'Urban 18-35',
      newValue: 'Urban 18-45',
      description: 'Expanded age targeting'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Campaign performing well',
      description: 'Added performance comment'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for running campaign
    const performanceMetrics: MetricDefinition[] = [{
      key: 'adSpend',
      label: 'Ad Spend',
      value: '€32,450',
      subMetric: 'Budget: €50,000',
      badgeValue: '+12%',
      badgeVariant: 'success'
    }, {
      key: 'impressions',
      label: 'Impressions',
      value: '1,875,420',
      subMetric: 'Unique: 1.2M',
      badgeValue: '+6%',
      badgeVariant: 'success'
    }, {
      key: 'clicks',
      label: 'Clicks + Add to Carts',
      value: '24,567',
      subMetric: 'Add to Carts: 3,245',
      badgeValue: '+8%',
      badgeVariant: 'success'
    }, {
      key: 'cpc',
      label: 'CPC',
      value: '€1.32',
      subMetric: 'Ad Spend / Clicks',
      badgeValue: '-5%',
      badgeVariant: 'success'
    }, {
      key: 'ctr',
      label: 'CTR',
      value: '1.31%',
      subMetric: 'Clicks / Impressions',
      badgeValue: '+3%',
      badgeVariant: 'success'
    }, {
      key: 'cpm',
      label: 'CPM',
      value: '€26.64',
      subMetric: 'Budget / Impressions × 1,000',
      badgeValue: '-2%',
      badgeVariant: 'success'
    }, {
      key: 'ecpm',
      label: 'eCPM',
      value: '€17.30',
      subMetric: 'Spend / Impressions × 1,000',
      badgeValue: '-4%',
      badgeVariant: 'success'
    }, {
      key: 'onlineSkuRevenue',
      label: 'Online SKU Revenue',
      value: '€42,680',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+18%',
      badgeVariant: 'success'
    }, {
      key: 'onlineSkuUnits',
      label: 'Online SKU Units',
      value: '3,456',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+14%',
      badgeVariant: 'success'
    }, {
      key: 'onlineSkuConversions',
      label: 'Online SKU Conversions',
      value: '2,134',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+11%',
      badgeVariant: 'success'
    }, {
      key: 'instoreSkuRevenue',
      label: 'In-store SKU Revenue',
      value: '€51,240',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+22%',
      badgeVariant: 'success'
    }, {
      key: 'instoreSkuUnits',
      label: 'In-store SKU Units',
      value: '4,892',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+16%',
      badgeVariant: 'success'
    }, {
      key: 'instoreSkuConversions',
      label: 'In-store SKU Conversions',
      value: '3,078',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+13%',
      badgeVariant: 'success'
    }, {
      key: 'totalSkuRevenue',
      label: 'Total SKU Revenue',
      value: '€93,920',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+20%',
      badgeVariant: 'success'
    }, {
      key: 'totalSkuUnits',
      label: 'Total SKU Units',
      value: '8,348',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+15%',
      badgeVariant: 'success'
    }, {
      key: 'totalSkuConversions',
      label: 'Total SKU Conversions',
      value: '5,212',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+12%',
      badgeVariant: 'success'
    }];
    const ForecastSection = () => <MetricRow metrics={performanceMetrics} selectedKeys={['adSpend', 'impressions', 'ctr', 'totalSkuRevenue']} maxVisible={5} defaultVariant="default" removable={true} />;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Offline In-store: Summer Launch (Running)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'In-option',
                value: 'In-option'
              }, {
                label: 'Running',
                value: 'Running'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Stopped',
                value: 'Stopped'
              }, {
                label: 'Ready',
                value: 'Ready'
              }],
              selectedValues: lineItemStatus,
              onChange: setLineItemStatus
            }, {
              name: 'Placement',
              options: [{
                label: 'End Cap',
                value: 'End Cap'
              }, {
                label: 'Shelf Edge',
                value: 'Shelf Edge'
              }, {
                label: 'Floor Stand',
                value: 'Floor Stand'
              }, {
                label: 'Aisle Header',
                value: 'Aisle Header'
              }, {
                label: 'Checkout',
                value: 'Checkout'
              }],
              selectedValues: placement,
              onChange: setPlacement
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
              key: 'id',
              header: 'Line-item ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'aiRecommendation',
              header: 'AI Recommendation',
              render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
            }, {
              key: 'placement',
              header: 'Placement'
            }, {
              key: 'start',
              header: 'Start date',
              render: row => new Date(row.start).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'end',
              header: 'End date',
              render: row => new Date(row.end).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'adSpend',
              header: 'Ad Spend'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks + Add to Carts'
            }, {
              key: 'cpc',
              header: 'CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'cpm',
              header: 'CPM'
            }, {
              key: 'ecpm',
              header: 'eCPM'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU Units'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU Conversions'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU Units'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU Conversions'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU Units'
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU Conversions'
            }]} data={lineItemData.filter(row => {
              const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
              const placementMatch = placement.length === 0 || placement.includes(row.placement);
              return statusMatch && placementMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offline-instore/line-item/\${row.id}\`} />
                </div>
        }, {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'Approved'
              }, {
                label: 'Rejected',
                value: 'Rejected'
              }, {
                label: 'Pending',
                value: 'Pending'
              }],
              selectedValues: creativeStatus,
              onChange: setCreativeStatus
            }, {
              name: 'Format',
              options: [{
                label: 'Print',
                value: 'Print'
              }, {
                label: 'Poster',
                value: 'Poster'
              }, {
                label: 'Shelf Talker',
                value: 'Shelf Talker'
              }],
              selectedValues: creativeFormat,
              onChange: setCreativeFormat
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
              key: 'id',
              header: 'Creative ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'placements',
              header: 'Placements',
              render: row => <Badge variant="secondary">{row.placements}</Badge>
            }, {
              key: 'adSpend',
              header: 'Ad Spend'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks + Add to Carts'
            }, {
              key: 'cpc',
              header: 'CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'cpm',
              header: 'CPM'
            }, {
              key: 'ecpm',
              header: 'eCPM'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU Units'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU Conversions'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU Units'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU Conversions'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU Units'
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU Conversions'
            }]} data={creativeData.filter(row => {
              const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
              const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
              return statusMatch && formatMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offline-instore/creative/\${row.id}\`} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offline-instore/creative/\${row.id}\`} />
                </div>
        }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...De.parameters?.docs?.source}}};Me.parameters={...Me.parameters,docs:{...Me.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Approved',
      name: 'Creative 1',
      format: 'Display Banner',
      placements: 4,
      totalSkuConversions: '3,245',
      totalSkuConversionRate: '2.8%',
      totalSkuUnits: '5,678',
      totalSkuRevenue: '$98,450',
      totalSkuRoas: '4.2x',
      onlineSkuConversions: '2,271',
      onlineSkuUnits: '3,975',
      onlineSkuRevenue: '$68,915',
      instoreSkuConversions: '974',
      instoreSkuUnits: '1,703',
      instoreSkuRevenue: '$29,535'
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'Creative 2',
      format: 'Video',
      placements: 2,
      totalSkuConversions: '1,867',
      totalSkuConversionRate: '3.4%',
      totalSkuUnits: '3,234',
      totalSkuRevenue: '$67,890',
      totalSkuRoas: '4.8x',
      onlineSkuConversions: '1,307',
      onlineSkuUnits: '2,264',
      onlineSkuRevenue: '$47,523',
      instoreSkuConversions: '560',
      instoreSkuUnits: '970',
      instoreSkuRevenue: '$20,367'
    }, {
      id: 'CR-003',
      status: 'Approved',
      name: 'Creative 3',
      format: 'Rich Media',
      placements: 3,
      totalSkuConversions: '2,456',
      totalSkuConversionRate: '3.1%',
      totalSkuUnits: '4,123',
      totalSkuRevenue: '$89,670',
      totalSkuRoas: '4.6x',
      onlineSkuConversions: '1,719',
      onlineSkuUnits: '2,886',
      onlineSkuRevenue: '$62,769',
      instoreSkuConversions: '737',
      instoreSkuUnits: '1,237',
      instoreSkuRevenue: '$26,901'
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'Running',
      name: 'Line-item 1',
      placement: 'Above The Fold',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend',
      totalSkuConversions: '1,248',
      totalSkuConversionRate: '3.2%',
      totalSkuUnits: '2,156',
      totalSkuRevenue: '$45,280',
      totalSkuRoas: '4.8x',
      onlineSkuConversions: '892',
      onlineSkuUnits: '1,543',
      onlineSkuRevenue: '$32,100',
      instoreSkuConversions: '356',
      instoreSkuUnits: '613',
      instoreSkuRevenue: '$13,180'
    }, {
      id: 'LI-002',
      status: 'Running',
      name: 'Line-item 2',
      placement: 'Sidebar',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Optimize Budget',
      totalSkuConversions: '987',
      totalSkuConversionRate: '2.8%',
      totalSkuUnits: '1,734',
      totalSkuRevenue: '$38,450',
      totalSkuRoas: '4.2x',
      onlineSkuConversions: '721',
      onlineSkuUnits: '1,245',
      onlineSkuRevenue: '$27,320',
      instoreSkuConversions: '266',
      instoreSkuUnits: '489',
      instoreSkuRevenue: '$11,130'
    }, {
      id: 'LI-003',
      status: 'Running',
      name: 'Line-item 3',
      placement: 'Native Feed',
      start: '2024-08-10',
      end: '2024-09-10',
      aiRecommendation: 'Increase Spend',
      totalSkuConversions: '2,134',
      totalSkuConversionRate: '4.1%',
      totalSkuUnits: '3,567',
      totalSkuRevenue: '$72,450',
      totalSkuRoas: '5.3x',
      onlineSkuConversions: '1,489',
      onlineSkuUnits: '2,398',
      onlineSkuRevenue: '$49,780',
      instoreSkuConversions: '645',
      instoreSkuUnits: '1,169',
      instoreSkuRevenue: '$22,670'
    }, {
      id: 'LI-004',
      status: 'Running',
      name: 'Line-item 4',
      placement: 'Interstitial',
      start: '2024-11-01',
      end: '2024-11-30',
      aiRecommendation: 'Optimize Budget',
      totalSkuConversions: '743',
      totalSkuConversionRate: '2.1%',
      totalSkuUnits: '1,298',
      totalSkuRevenue: '$28,920',
      totalSkuRoas: '3.7x',
      onlineSkuConversions: '534',
      onlineSkuUnits: '923',
      onlineSkuRevenue: '$20,440',
      instoreSkuConversions: '209',
      instoreSkuUnits: '375',
      instoreSkuRevenue: '$8,480'
    }, {
      id: 'LI-005',
      status: 'Running',
      name: 'Line-item 5',
      placement: 'Bottom Banner',
      start: '2024-12-01',
      end: '2024-12-31',
      aiRecommendation: 'Increase Spend',
      totalSkuConversions: '1,567',
      totalSkuConversionRate: '3.6%',
      totalSkuUnits: '2,834',
      totalSkuRevenue: '$58,670',
      totalSkuRoas: '4.9x',
      onlineSkuConversions: '1,098',
      onlineSkuUnits: '1,954',
      onlineSkuRevenue: '$40,230',
      instoreSkuConversions: '469',
      instoreSkuUnits: '880',
      instoreSkuRevenue: '$18,440'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Display: Summer Launch',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€50,000',
      newValue: '€75,000',
      description: 'Budget increased for Q4 push'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 15:22:45',
      user: 'John Smith',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'Running',
      description: 'Campaign is now live'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-11 09:15:33',
      user: 'Sarah Wilson',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added Above The Fold line item'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'Jane Doe',
      action: 'Creative Uploaded',
      field: 'Creatives',
      oldValue: '-',
      newValue: 'CR-001',
      description: 'Display banner creative uploaded'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Dates Modified',
      field: 'End Date',
      oldValue: '2024-06-25',
      newValue: '2024-06-30',
      description: 'Extended campaign end date'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'Target Updated',
      field: 'Targeting',
      oldValue: 'Desktop 18-35',
      newValue: 'Multi-device 18-45',
      description: 'Expanded targeting parameters'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Display performance exceeds expectations',
      description: 'Added performance comment'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for running campaign
    const performanceMetrics = [{
      id: 'impressions',
      label: 'Impressions',
      value: '8,425,736',
      subMetric: 'Viewability: 78.4%',
      badgeValue: '+14%',
      badgeVariant: 'success' as const
    }, {
      id: 'clicks',
      label: 'Clicks',
      value: '124,387',
      subMetric: 'CTR: 1.47%',
      badgeValue: '+9%',
      badgeVariant: 'success' as const
    }, {
      id: 'reach',
      label: 'Reach',
      value: '3.2M',
      subMetric: 'Frequency: 2.6',
      badgeValue: '+18%',
      badgeVariant: 'success' as const
    }, {
      id: 'roas',
      label: 'ROAS',
      value: '4.12x',
      subMetric: 'CPA: €23.50',
      badgeValue: '+22%',
      badgeVariant: 'success' as const
    }];
    const dialogMetricsDisplayRunning: MetricDefinition[] = [{
      key: 'ctr',
      label: 'Click-Through Rate',
      value: '1.47%',
      subMetric: 'vs. 1.32% last period',
      badgeValue: '+11.4%',
      badgeVariant: 'success'
    }, {
      key: 'viewability',
      label: 'Viewability Rate',
      value: '78.4%',
      subMetric: 'Above industry avg',
      badgeValue: '+5.8%',
      badgeVariant: 'success'
    }, {
      key: 'cpm',
      label: 'Cost Per Mille',
      value: '$2.85',
      subMetric: 'vs. $3.20 target',
      badgeValue: '-10.9%',
      badgeVariant: 'success'
    }, {
      key: 'videoCompletion',
      label: 'Video Completion',
      value: '68.9%',
      subMetric: '15s completion',
      badgeValue: '+7.3%',
      badgeVariant: 'success'
    }, {
      key: 'brandLift',
      label: 'Brand Lift',
      value: '+19.2%',
      subMetric: 'Awareness increase',
      badgeValue: 'High',
      badgeVariant: 'info'
    }, {
      key: 'frequency',
      label: 'Frequency',
      value: '2.6x',
      subMetric: 'Avg. per user',
      badgeValue: 'Optimal',
      badgeVariant: 'success'
    }, {
      key: 'cpc',
      label: 'Cost Per Click',
      value: '$1.94',
      subMetric: 'vs. $2.15 target',
      badgeValue: '-9.8%',
      badgeVariant: 'success'
    }, {
      key: 'engagementRate',
      label: 'Engagement Rate',
      value: '3.2%',
      subMetric: 'Rich media ads',
      badgeValue: '+15.6%',
      badgeVariant: 'success'
    }, {
      key: 'conversionRate',
      label: 'Conversion Rate',
      value: '2.8%',
      subMetric: 'Post-click conv.',
      badgeValue: '+18.2%',
      badgeVariant: 'success'
    }];
    const ForecastSection = () => <MetricRow metrics={performanceMetrics.map(m => ({
      ...m,
      key: m.id
    }))} selectedKeys={performanceMetrics.map(m => m.id)} maxVisible={5} defaultVariant="default" removable={false} dialogMetrics={dialogMetricsDisplayRunning} onDialogMetricClick={key => console.log(\`\${key} selected\`)} />;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Display: Summer Launch (Running)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'In-option',
                value: 'In-option'
              }, {
                label: 'Running',
                value: 'Running'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Stopped',
                value: 'Stopped'
              }, {
                label: 'Ready',
                value: 'Ready'
              }],
              selectedValues: lineItemStatus,
              onChange: setLineItemStatus
            }, {
              name: 'Placement',
              options: [{
                label: 'Above The Fold',
                value: 'Above The Fold'
              }, {
                label: 'Sidebar',
                value: 'Sidebar'
              }, {
                label: 'Native Feed',
                value: 'Native Feed'
              }, {
                label: 'Interstitial',
                value: 'Interstitial'
              }, {
                label: 'Bottom Banner',
                value: 'Bottom Banner'
              }],
              selectedValues: placement,
              onChange: setPlacement
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
              key: 'id',
              header: 'Line-item ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'aiRecommendation',
              header: 'AI Recommendation',
              render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
            }, {
              key: 'placement',
              header: 'Placement'
            }, {
              key: 'start',
              header: 'Start date',
              render: row => new Date(row.start).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'end',
              header: 'End date',
              render: row => new Date(row.end).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU conversions'
            }, {
              key: 'totalSkuConversionRate',
              header: 'Total SKU conversion rate'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU units'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuRoas',
              header: 'Total SKU ROAS'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU conversions'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU units'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU conversions'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU units'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }]} data={lineItemData.filter(row => {
              const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
              const placementMatch = placement.length === 0 || placement.includes(row.placement);
              return statusMatch && placementMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/display/line-item/\${row.id}\`} />
                </div>
        }, {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'Approved'
              }, {
                label: 'Rejected',
                value: 'Rejected'
              }, {
                label: 'Pending',
                value: 'Pending'
              }],
              selectedValues: creativeStatus,
              onChange: setCreativeStatus
            }, {
              name: 'Format',
              options: [{
                label: 'Display Banner',
                value: 'Display Banner'
              }, {
                label: 'Video',
                value: 'Video'
              }, {
                label: 'Rich Media',
                value: 'Rich Media'
              }],
              selectedValues: creativeFormat,
              onChange: setCreativeFormat
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
              key: 'id',
              header: 'Creative ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'placements',
              header: 'Placements',
              render: row => <Badge variant="secondary">{row.placements}</Badge>
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU conversions'
            }, {
              key: 'totalSkuConversionRate',
              header: 'Total SKU conversion rate'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU units'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuRoas',
              header: 'Total SKU ROAS'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU conversions'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU units'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU conversions'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU units'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }]} data={creativeData.filter(row => {
              const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
              const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
              return statusMatch && formatMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/display/creative/\${row.id}\`} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/display/creative/\${row.id}\`} />
                </div>
        }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Me.parameters?.docs?.source}}};Ae.parameters={...Ae.parameters,docs:{...Ae.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Pending',
      name: 'Creative 1',
      format: 'Print',
      placements: 2
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'Creative 2',
      format: 'Poster',
      placements: 1
    }, {
      id: 'CR-003',
      status: 'Pending',
      name: 'Creative 3',
      format: 'Shelf Talker',
      placements: 1
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'In-option',
      name: 'Line-item 1',
      placement: 'End Cap',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Optimize Budget'
    }, {
      id: 'LI-002',
      status: 'In-option',
      name: 'Line-item 2',
      placement: 'Shelf Edge',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Increase Spend'
    }, {
      id: 'LI-003',
      status: 'Ready',
      name: 'Line-item 3',
      placement: 'Floor Stand',
      start: '2024-08-10',
      end: '2024-09-10',
      aiRecommendation: 'Optimize Budget'
    }, {
      id: 'LI-004',
      status: 'In-option',
      name: 'Line-item 4',
      placement: 'Aisle Header',
      start: '2024-11-01',
      end: '2024-11-30',
      aiRecommendation: 'Increase Spend'
    }, {
      id: 'LI-005',
      status: 'Ready',
      name: 'Line-item 5',
      placement: 'Checkout',
      start: '2024-12-01',
      end: '2024-12-31',
      aiRecommendation: 'Optimize Budget'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-09 16:20:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Offline In-store: Summer Launch',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-09 16:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€0',
      newValue: '€75,000',
      description: 'Initial budget allocation'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 09:15:33',
      user: 'Sarah Wilson',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added End Cap line item for approval'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-10 10:45:21',
      user: 'Jane Doe',
      action: 'Creative Uploaded',
      field: 'Creatives',
      oldValue: '-',
      newValue: 'CR-001',
      description: 'Print creative uploaded for review'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-10 11:30:14',
      user: 'Mike Johnson',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'In-option',
      description: 'Campaign moved to in-option status'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-10 14:20:58',
      user: 'Sarah Wilson',
      action: 'Target Updated',
      field: 'Targeting',
      oldValue: 'Urban 25-45',
      newValue: 'Urban 18-45',
      description: 'Expanded age targeting for approval'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-10 16:45:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Awaiting client approval for placements',
      description: 'Added status comment'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for in-option campaign (forecasted)
    const performanceMetrics = [{
      id: 'projected-impressions',
      label: 'Projected Impressions',
      value: '1,200,000',
      subMetric: 'Est. Footfall: 8.5%',
      badgeValue: 'Est.',
      badgeVariant: 'secondary' as const
    }, {
      id: 'stores',
      label: 'Target Stores',
      value: '220',
      subMetric: 'Coverage: 57%',
      badgeValue: 'Planned',
      badgeVariant: 'secondary' as const
    }, {
      id: 'projected-reach',
      label: 'Projected Reach',
      value: '950K',
      subMetric: 'Unique visitors',
      badgeValue: 'Est.',
      badgeVariant: 'secondary' as const
    }, {
      id: 'target-roas',
      label: 'Target ROAS',
      value: '2.50x',
      subMetric: 'Target AOV: €60',
      badgeValue: 'Goal',
      badgeVariant: 'secondary' as const
    }];
    const dialogMetricsOfflineInstoreInOption: MetricDefinition[] = [{
      key: 'projectedFootfall',
      label: 'Projected Footfall',
      value: '8.5%',
      subMetric: 'Estimated reach',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'targetCoverage',
      label: 'Target Coverage',
      value: '57%',
      subMetric: '220 planned stores',
      badgeValue: 'Planned',
      badgeVariant: 'secondary'
    }, {
      key: 'expectedDwellTime',
      label: 'Expected Dwell Time',
      value: '3.8 min',
      subMetric: 'Target engagement',
      badgeValue: 'Goal',
      badgeVariant: 'secondary'
    }, {
      key: 'budgetAllocation',
      label: 'Budget Allocation',
      value: '€75K',
      subMetric: 'Initial allocation',
      badgeValue: 'Approved',
      badgeVariant: 'info'
    }, {
      key: 'targetAwareness',
      label: 'Target Awareness',
      value: '+20%',
      subMetric: 'Expected lift',
      badgeValue: 'Goal',
      badgeVariant: 'secondary'
    }, {
      key: 'cpi',
      label: 'Cost Per Impression',
      value: '€0.15',
      subMetric: 'Target CPI',
      badgeValue: 'Target',
      badgeVariant: 'secondary'
    }, {
      key: 'expectedRoi',
      label: 'Expected ROI',
      value: '2.5x',
      subMetric: 'Target return',
      badgeValue: 'Goal',
      badgeVariant: 'secondary'
    }, {
      key: 'timeline',
      label: 'Timeline',
      value: '45 days',
      subMetric: 'To launch',
      badgeValue: 'Pending',
      badgeVariant: 'warning'
    }, {
      key: 'approvalStatus',
      label: 'Approval Status',
      value: '75%',
      subMetric: 'Creatives approved',
      badgeValue: 'In Review',
      badgeVariant: 'warning'
    }];
    const ForecastSection = () => <MetricRow metrics={performanceMetrics.map(m => ({
      ...m,
      key: m.id
    }))} selectedKeys={performanceMetrics.map(m => m.id)} maxVisible={5} defaultVariant="default" removable={false} dialogMetrics={dialogMetricsOfflineInstoreInOption} onDialogMetricClick={key => console.log(\`\${key} selected\`)} />;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Offline In-store: Summer Launch (In-option)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'In-option',
                value: 'In-option'
              }, {
                label: 'Running',
                value: 'Running'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Stopped',
                value: 'Stopped'
              }, {
                label: 'Ready',
                value: 'Ready'
              }],
              selectedValues: lineItemStatus,
              onChange: setLineItemStatus
            }, {
              name: 'Placement',
              options: [{
                label: 'End Cap',
                value: 'End Cap'
              }, {
                label: 'Shelf Edge',
                value: 'Shelf Edge'
              }, {
                label: 'Floor Stand',
                value: 'Floor Stand'
              }, {
                label: 'Aisle Header',
                value: 'Aisle Header'
              }, {
                label: 'Checkout',
                value: 'Checkout'
              }],
              selectedValues: placement,
              onChange: setPlacement
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
              key: 'id',
              header: 'Line-item ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'placement',
              header: 'Placement'
            }, {
              key: 'start',
              header: 'Start date',
              render: row => new Date(row.start).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'end',
              header: 'End date',
              render: row => new Date(row.end).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'aiRecommendation',
              header: 'AI Recommendation',
              render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
            }]} data={lineItemData.filter(row => {
              const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
              const placementMatch = placement.length === 0 || placement.includes(row.placement);
              return statusMatch && placementMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offline-instore/line-item/\${row.id}\`} />
                </div>
        }, {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'Approved'
              }, {
                label: 'Rejected',
                value: 'Rejected'
              }, {
                label: 'Pending',
                value: 'Pending'
              }],
              selectedValues: creativeStatus,
              onChange: setCreativeStatus
            }, {
              name: 'Format',
              options: [{
                label: 'Print',
                value: 'Print'
              }, {
                label: 'Poster',
                value: 'Poster'
              }, {
                label: 'Shelf Talker',
                value: 'Shelf Talker'
              }],
              selectedValues: creativeFormat,
              onChange: setCreativeFormat
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
              key: 'id',
              header: 'Creative ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'placements',
              header: 'Placements',
              render: row => <Badge variant="secondary">{row.placements}</Badge>
            }]} data={creativeData.filter(row => {
              const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
              const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
              return statusMatch && formatMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offline-instore/creative/\${row.id}\`} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offline-instore/creative/\${row.id}\`} />
                </div>
        }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Ae.parameters?.docs?.source}}};Ue.parameters={...Ue.parameters,docs:{...Ue.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [placement, setPlacement] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Pending',
      name: 'Creative 1',
      format: 'Display Banner',
      placements: 3,
      totalSkuConversions: '1,245',
      totalSkuConversionRate: '2.1%',
      totalSkuUnits: '2,134',
      totalSkuRevenue: '$42,680',
      totalSkuRoas: '3.5x',
      onlineSkuConversions: '871',
      onlineSkuUnits: '1,494',
      onlineSkuRevenue: '$29,876',
      instoreSkuConversions: '374',
      instoreSkuUnits: '640',
      instoreSkuRevenue: '$12,804'
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'Creative 2',
      format: 'Video',
      placements: 1,
      totalSkuConversions: '2,867',
      totalSkuConversionRate: '3.6%',
      totalSkuUnits: '4,923',
      totalSkuRevenue: '$98,460',
      totalSkuRoas: '4.9x',
      onlineSkuConversions: '2,007',
      onlineSkuUnits: '3,446',
      onlineSkuRevenue: '$68,922',
      instoreSkuConversions: '860',
      instoreSkuUnits: '1,477',
      instoreSkuRevenue: '$29,538'
    }, {
      id: 'CR-003',
      status: 'Rejected',
      name: 'Creative 3',
      format: 'Rich Media',
      placements: 0,
      totalSkuConversions: '0',
      totalSkuConversionRate: '0%',
      totalSkuUnits: '0',
      totalSkuRevenue: '$0',
      totalSkuRoas: '0x',
      onlineSkuConversions: '0',
      onlineSkuUnits: '0',
      onlineSkuRevenue: '$0',
      instoreSkuConversions: '0',
      instoreSkuUnits: '0',
      instoreSkuRevenue: '$0'
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'In-option',
      name: 'Line-item 1',
      placement: 'Above The Fold',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend',
      totalSkuConversions: '856',
      totalSkuConversionRate: '2.4%',
      totalSkuUnits: '1,467',
      totalSkuRevenue: '$31,280',
      totalSkuRoas: '3.8x',
      onlineSkuConversions: '598',
      onlineSkuUnits: '1,023',
      onlineSkuRevenue: '$21,840',
      instoreSkuConversions: '258',
      instoreSkuUnits: '444',
      instoreSkuRevenue: '$9,440'
    }, {
      id: 'LI-002',
      status: 'In-option',
      name: 'Line-item 2',
      placement: 'Sidebar',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Optimize Budget',
      totalSkuConversions: '634',
      totalSkuConversionRate: '1.9%',
      totalSkuUnits: '1,156',
      totalSkuRevenue: '$25,670',
      totalSkuRoas: '3.2x',
      onlineSkuConversions: '443',
      onlineSkuUnits: '798',
      onlineSkuRevenue: '$17,340',
      instoreSkuConversions: '191',
      instoreSkuUnits: '358',
      instoreSkuRevenue: '$8,330'
    }, {
      id: 'LI-003',
      status: 'Ready',
      name: 'Line-item 3',
      placement: 'Native Feed',
      start: '2024-08-10',
      end: '2024-09-10',
      aiRecommendation: 'Increase Spend',
      totalSkuConversions: '1,456',
      totalSkuConversionRate: '3.8%',
      totalSkuUnits: '2,543',
      totalSkuRevenue: '$54,230',
      totalSkuRoas: '4.7x',
      onlineSkuConversions: '1,019',
      onlineSkuUnits: '1,780',
      onlineSkuRevenue: '$37,960',
      instoreSkuConversions: '437',
      instoreSkuUnits: '763',
      instoreSkuRevenue: '$16,270'
    }, {
      id: 'LI-004',
      status: 'In-option',
      name: 'Line-item 4',
      placement: 'Interstitial',
      start: '2024-11-01',
      end: '2024-11-30',
      aiRecommendation: 'Optimize Budget',
      totalSkuConversions: '432',
      totalSkuConversionRate: '1.5%',
      totalSkuUnits: '798',
      totalSkuRevenue: '$18,450',
      totalSkuRoas: '2.8x',
      onlineSkuConversions: '302',
      onlineSkuUnits: '559',
      onlineSkuRevenue: '$12,920',
      instoreSkuConversions: '130',
      instoreSkuUnits: '239',
      instoreSkuRevenue: '$5,530'
    }, {
      id: 'LI-005',
      status: 'Ready',
      name: 'Line-item 5',
      placement: 'Bottom Banner',
      start: '2024-12-01',
      end: '2024-12-31',
      aiRecommendation: 'Increase Spend',
      totalSkuConversions: '1,089',
      totalSkuConversionRate: '3.1%',
      totalSkuUnits: '1,967',
      totalSkuRevenue: '$41,780',
      totalSkuRoas: '4.1x',
      onlineSkuConversions: '762',
      onlineSkuUnits: '1,377',
      onlineSkuRevenue: '$29,250',
      instoreSkuConversions: '327',
      instoreSkuUnits: '590',
      instoreSkuRevenue: '$12,530'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-09 15:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Display: Summer Launch',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-09 15:45:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€0',
      newValue: '€100,000',
      description: 'Initial budget allocation for display campaign'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 08:15:33',
      user: 'Sarah Wilson',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added Above The Fold placement for approval'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-10 09:30:21',
      user: 'Jane Doe',
      action: 'Creative Uploaded',
      field: 'Creatives',
      oldValue: '-',
      newValue: 'CR-001',
      description: 'Display banner creative uploaded for review'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-10 10:15:14',
      user: 'Mike Johnson',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'In-option',
      description: 'Campaign moved to in-option for client review'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-10 13:45:58',
      user: 'Sarah Wilson',
      action: 'Target Updated',
      field: 'Targeting',
      oldValue: 'Desktop only',
      newValue: 'Multi-device 18-45',
      description: 'Expanded device and demographic targeting'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-10 16:20:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Awaiting creative approval and placement confirmation',
      description: 'Added client feedback status'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for in-option campaign (forecasted)
    const performanceMetrics = [{
      id: 'projected-impressions',
      label: 'Projected Impressions',
      value: '5,200,000',
      subMetric: 'Est. Viewability: 65%',
      badgeValue: 'Est.',
      badgeVariant: 'secondary' as const
    }, {
      id: 'projected-clicks',
      label: 'Projected Clicks',
      value: '78,000',
      subMetric: 'Est. CTR: 1.5%',
      badgeValue: 'Est.',
      badgeVariant: 'secondary' as const
    }, {
      id: 'projected-reach',
      label: 'Projected Reach',
      value: '2.1M',
      subMetric: 'Target frequency: 2.5',
      badgeValue: 'Goal',
      badgeVariant: 'secondary' as const
    }, {
      id: 'target-roas',
      label: 'Target ROAS',
      value: '3.50x',
      subMetric: 'Target CPA: €28',
      badgeValue: 'Goal',
      badgeVariant: 'secondary' as const
    }];
    const dialogMetricsDisplayInOption: MetricDefinition[] = [{
      key: 'projectedCtr',
      label: 'Projected CTR',
      value: '1.5%',
      subMetric: 'Estimated rate',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'targetViewability',
      label: 'Target Viewability',
      value: '65%',
      subMetric: 'Goal rate',
      badgeValue: 'Goal',
      badgeVariant: 'secondary'
    }, {
      key: 'budgetAllocated',
      label: 'Budget Allocated',
      value: '$100K',
      subMetric: 'Initial budget',
      badgeValue: 'Approved',
      badgeVariant: 'info'
    }, {
      key: 'targetFrequency',
      label: 'Target Frequency',
      value: '2.5x',
      subMetric: 'Optimal reach',
      badgeValue: 'Goal',
      badgeVariant: 'secondary'
    }, {
      key: 'expectedBrandLift',
      label: 'Expected Brand Lift',
      value: '+15%',
      subMetric: 'Awareness goal',
      badgeValue: 'Target',
      badgeVariant: 'secondary'
    }, {
      key: 'targetCpa',
      label: 'Target CPA',
      value: '$28',
      subMetric: 'Cost per acquisition',
      badgeValue: 'Goal',
      badgeVariant: 'secondary'
    }, {
      key: 'deviceMix',
      label: 'Device Mix',
      value: 'Multi-device',
      subMetric: '18-45 targeting',
      badgeValue: 'Planned',
      badgeVariant: 'secondary'
    }, {
      key: 'creativeStatus',
      label: 'Creative Status',
      value: '67%',
      subMetric: 'Assets approved',
      badgeValue: 'In Review',
      badgeVariant: 'warning'
    }, {
      key: 'launchTimeline',
      label: 'Launch Timeline',
      value: '30 days',
      subMetric: 'To go-live',
      badgeValue: 'Pending',
      badgeVariant: 'warning'
    }];
    const ForecastSection = () => <MetricRow metrics={performanceMetrics.map(m => ({
      ...m,
      key: m.id
    }))} selectedKeys={performanceMetrics.map(m => m.id)} maxVisible={5} defaultVariant="default" removable={false} dialogMetrics={dialogMetricsDisplayInOption} onDialogMetricClick={key => console.log(\`\${key} selected\`)} />;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Display: Summer Launch (In-option)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'In-option',
                value: 'In-option'
              }, {
                label: 'Running',
                value: 'Running'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Stopped',
                value: 'Stopped'
              }, {
                label: 'Ready',
                value: 'Ready'
              }],
              selectedValues: lineItemStatus,
              onChange: setLineItemStatus
            }, {
              name: 'Placement',
              options: [{
                label: 'Above The Fold',
                value: 'Above The Fold'
              }, {
                label: 'Sidebar',
                value: 'Sidebar'
              }, {
                label: 'Native Feed',
                value: 'Native Feed'
              }, {
                label: 'Interstitial',
                value: 'Interstitial'
              }, {
                label: 'Bottom Banner',
                value: 'Bottom Banner'
              }],
              selectedValues: placement,
              onChange: setPlacement
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
              key: 'id',
              header: 'Line-item ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'aiRecommendation',
              header: 'AI Recommendation',
              render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
            }, {
              key: 'placement',
              header: 'Placement'
            }, {
              key: 'start',
              header: 'Start date',
              render: row => new Date(row.start).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'end',
              header: 'End date',
              render: row => new Date(row.end).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU conversions'
            }, {
              key: 'totalSkuConversionRate',
              header: 'Total SKU conversion rate'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU units'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuRoas',
              header: 'Total SKU ROAS'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU conversions'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU units'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU conversions'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU units'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }]} data={lineItemData.filter(row => {
              const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
              const placementMatch = placement.length === 0 || placement.includes(row.placement);
              return statusMatch && placementMatch;
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to line-item detail: \${row.name} (\${row.id})\`)} />
                </div>
        }, {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'Approved'
              }, {
                label: 'Rejected',
                value: 'Rejected'
              }, {
                label: 'Pending',
                value: 'Pending'
              }],
              selectedValues: creativeStatus,
              onChange: setCreativeStatus
            }, {
              name: 'Format',
              options: [{
                label: 'Display Banner',
                value: 'Display Banner'
              }, {
                label: 'Video',
                value: 'Video'
              }, {
                label: 'Rich Media',
                value: 'Rich Media'
              }],
              selectedValues: creativeFormat,
              onChange: setCreativeFormat
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
              key: 'id',
              header: 'Creative ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'placements',
              header: 'Placements',
              render: row => <Badge variant="secondary">{row.placements}</Badge>
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU conversions'
            }, {
              key: 'totalSkuConversionRate',
              header: 'Total SKU conversion rate'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU units'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuRoas',
              header: 'Total SKU ROAS'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU conversions'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU units'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU conversions'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU units'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }]} data={creativeData.filter(row => {
              const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
              const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
              return statusMatch && formatMatch;
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to creative detail: \${row.name} (\${row.id})\`)} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to log detail: \${row.action} (\${row.id})\`)} />
                </div>
        }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Ue.parameters?.docs?.source}}};Ie.parameters={...Ie.parameters,docs:{...Ie.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('products');
    const [searchVolume, setSearchVolume] = useState<string[]>([]);
    const [competitive, setCompetitive] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Approved',
      name: 'Creative 1',
      format: 'Banner',
      placements: 3
    }, {
      id: 'CR-002',
      status: 'Rejected',
      name: 'Creative 2',
      format: 'Video',
      placements: 1
    }, {
      id: 'CR-003',
      status: 'Pending',
      name: 'Creative 3',
      format: 'Banner',
      placements: 2
    }];
    const productData = [{
      productId: 'P-001',
      gtin: '1234567890123',
      image: 'https://via.placeholder.com/40x40',
      productTitle: 'Premium Coffee Beans 500g',
      impressions: '-',
      clicks: '-',
      addToCart: '-',
      avgCPC: '-',
      ctr: '-',
      atc: '-',
      conversion: '-',
      sales: '-',
      budget: '€500',
      spent: '€0',
      budgetLeft: '€500',
      roas: '-',
      extROAS: '-',
      iROAS: '-',
      startTime: '2024-06-01',
      endTime: '2024-06-30',
      searchVolume: 'High',
      competitive: 'Medium'
    }, {
      productId: 'P-002',
      gtin: '2345678901234',
      image: 'https://via.placeholder.com/40x40',
      productTitle: 'Organic Tea Selection Pack',
      impressions: '-',
      clicks: '-',
      addToCart: '-',
      avgCPC: '-',
      ctr: '-',
      atc: '-',
      conversion: '-',
      sales: '-',
      budget: '€750',
      spent: '€0',
      budgetLeft: '€750',
      roas: '-',
      extROAS: '-',
      iROAS: '-',
      startTime: '2024-07-01',
      endTime: '2024-07-31',
      searchVolume: 'Medium',
      competitive: 'High'
    }, {
      productId: 'P-003',
      gtin: '3456789012345',
      image: 'https://via.placeholder.com/40x40',
      productTitle: 'Artisan Chocolate Bar 200g',
      impressions: '-',
      clicks: '-',
      addToCart: '-',
      avgCPC: '-',
      ctr: '-',
      atc: '-',
      conversion: '-',
      sales: '-',
      budget: '€300',
      spent: '€0',
      budgetLeft: '€300',
      roas: '-',
      extROAS: '-',
      iROAS: '-',
      startTime: '2024-08-10',
      endTime: '2024-09-10',
      searchVolume: 'Low',
      competitive: 'Medium'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Sponsored Products: Premium Coffee',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€500',
      newValue: '€750',
      description: 'Budget increased for product promotion'
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
      action: 'Product Added',
      field: 'Products',
      oldValue: '-',
      newValue: 'P-001',
      description: 'Added Premium Coffee Beans product'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'Jane Doe',
      action: 'Product Added',
      field: 'Products',
      oldValue: '-',
      newValue: 'P-002',
      description: 'Added Organic Tea Selection product'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Targeting Updated',
      field: 'Search Volume',
      oldValue: 'Medium',
      newValue: 'High',
      description: 'Updated targeting for better reach'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'Keywords Updated',
      field: 'Keywords',
      oldValue: 'coffee beans',
      newValue: 'premium coffee beans, organic coffee',
      description: 'Expanded keyword targeting'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Ready for review',
      description: 'Added campaign review comment'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Forecast metrics for campaign
    const forecastMetrics = [{
      id: 'searchVolume',
      label: 'Search Volume',
      value: 'High',
      subMetric: '25K+ monthly searches',
      badgeValue: '▲▲▲',
      badgeVariant: 'success' as const
    }, {
      id: 'competitive',
      label: 'Competitive',
      value: 'Medium',
      subMetric: 'Moderate competition',
      badgeValue: '▲▲',
      badgeVariant: 'warning' as const
    }, {
      id: 'reach',
      label: 'Reach Forecast',
      value: '1.8M',
      subMetric: 'Unique shoppers',
      badgeValue: '+6.2%',
      badgeVariant: 'success' as const
    }, {
      id: 'roas',
      label: 'ROAS Forecast',
      value: '4.2x',
      subMetric: 'Projected return',
      badgeValue: '+8.5%',
      badgeVariant: 'success' as const
    }];

    // State for interactive forecast - following the same pattern as SponsoredProductsRunning
    const [selectedForecastMetric, setSelectedForecastMetric] = useState<string | null>('spend');
    const [spendValue, setSpendValue] = useState(41866); // Initial spend value
    const [dragPosition, setDragPosition] = useState(50); // Position as percentage (0-100)
    const [isDragging, setIsDragging] = useState(false);

    // Calculate ROAS and Revenue based on spend using inverse relationship
    const calculateMetrics = (spend: number) => {
      // ROAS decreases as spend increases (inverse relationship) - scale values to be more visible
      const maxRoas = 600; // Scale up for visibility
      const minRoas = 100;
      const roasRange = maxRoas - minRoas;
      const spendRatio = (spend - 10000) / 40000; // Normalize spend to 0-1 range (10K-50K)
      const roas = maxRoas - spendRatio * roasRange; // This will go from 600 down to 100

      // Revenue increases, creating a crossing point around middle
      const baseRevenue = 100; // Starting revenue 
      const maxRevenue = 500; // Max revenue
      const revenueRange = maxRevenue - baseRevenue;
      const revenue = baseRevenue + spendRatio * revenueRange; // This will go from 100 up to 500

      return {
        spend,
        roas: Math.round(roas),
        revenue: Math.round(revenue)
      };
    };

    // Current metrics based on drag position
    const currentMetrics = calculateMetrics(spendValue);

    // Updated forecast metrics to match the original design and use proper MetricCard
    const updatedForecastMetrics = [{
      id: 'spend',
      label: 'Spend Forecast',
      value: \`$\${currentMetrics.spend.toLocaleString()}\`,
      subMetric: 'Remaining: $39,263',
      badgeValue: '+3.5%',
      badgeVariant: 'success' as const
    }, {
      id: 'roas',
      label: 'ROAS Forecast',
      value: \`\${(currentMetrics.roas / 100).toFixed(2)}x\`,
      subMetric: 'Projected return',
      badgeValue: '+3.4%',
      badgeVariant: 'success' as const
    }, {
      id: 'revenue',
      label: 'Revenue Forecast',
      value: \`$\${currentMetrics.revenue.toLocaleString()}\`,
      subMetric: 'Total revenue',
      badgeValue: '+4.2%',
      badgeVariant: 'success' as const
    }, {
      id: 'competitive',
      label: 'Competitive Forecast',
      value: 'Medium',
      subMetric: 'Avg. competition',
      badgeValue: '+2%',
      badgeVariant: 'success' as const
    }];
    const dialogMetricsSponsoredProductsInOption: MetricDefinition[] = [{
      key: 'ctr',
      label: 'Click-Through Rate',
      value: '2.34%',
      subMetric: 'vs. 2.18% last period',
      badgeValue: '+7.3%',
      badgeVariant: 'success'
    }, {
      key: 'conversionRate',
      label: 'Conversion Rate',
      value: '4.12%',
      subMetric: '1,234 conversions',
      badgeValue: '+12.5%',
      badgeVariant: 'success'
    }, {
      key: 'cpc',
      label: 'Cost Per Click',
      value: '$0.58',
      subMetric: 'vs. $0.62 target',
      badgeValue: '-6.5%',
      badgeVariant: 'success'
    }, {
      key: 'viewability',
      label: 'Viewability Rate',
      value: '87.3%',
      subMetric: 'Above industry avg',
      badgeValue: '+5.2%',
      badgeVariant: 'success'
    }, {
      key: 'brandLift',
      label: 'Brand Lift',
      value: '+18.2%',
      subMetric: 'Awareness increase',
      badgeValue: 'High',
      badgeVariant: 'info'
    }, {
      key: 'sov',
      label: 'Share of Voice',
      value: '34.7%',
      subMetric: 'In category',
      badgeValue: '+2.1%',
      badgeVariant: 'secondary'
    }, {
      key: 'frequency',
      label: 'Frequency',
      value: '3.8x',
      subMetric: 'Avg. per user',
      badgeValue: 'Optimal',
      badgeVariant: 'success'
    }, {
      key: 'vcr',
      label: 'Video Completion Rate',
      value: '68.9%',
      subMetric: '15s videos',
      badgeValue: '+9.4%',
      badgeVariant: 'success'
    }, {
      key: 'cpa',
      label: 'Cost Per Acquisition',
      value: '$24.50',
      subMetric: 'vs. $30 target',
      badgeValue: '-18.3%',
      badgeVariant: 'success'
    }];
    const ForecastSection = () => <div className="space-y-6">
        <MetricRow metrics={updatedForecastMetrics.map(m => ({
        ...m,
        key: m.id
      }))} selectedKeys={updatedForecastMetrics.map(m => m.id)} maxVisible={5} defaultVariant="default" removable={false} activeKey={selectedForecastMetric} onActiveKeyChange={setSelectedForecastMetric} dialogMetrics={dialogMetricsSponsoredProductsInOption} onDialogMetricClick={key => console.log(\`\${key} selected\`)} />

        {/* Interactive Forecast Chart - only show when spend, roas, or revenue is selected */}
        {(selectedForecastMetric === 'spend' || selectedForecastMetric === 'roas' || selectedForecastMetric === 'revenue') && <div>
            <div className="relative bg-white border rounded-lg p-6">
              <Button variant="outline" size="icon" onClick={() => setSelectedForecastMetric(null)} aria-label="Close chart" className="absolute top-2 right-2 z-10">
                <X className="w-4 h-4" />
              </Button>
              {/* Generate data for LineChart */}
              <LineChartComponent data={(() => {
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
          })()} config={{
            roas: {
              label: "ROAS",
              color: "hsl(var(--chart-1))" // Theme chart color 1
            },
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-2))" // Theme chart color 2
            }
          }} showLegend={true} showGrid={true} showTooltip={true} showXAxis={true} showYAxis={true} className="h-[300px] w-full" xAxisDataKey="spend" yAxisLabel="Revenue" secondaryYAxis={{
            dataKey: "roas",
            domain: [0, 700],
            label: "ROAS"
          }} />
              
              {/* Interactive overlay for dragging */}
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
              setDragPosition(percentage);
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
            </div>
          </div>}
        
        {/* Regular chart for other metrics */}
        {selectedForecastMetric === 'competitive' && <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                Competitive Analysis by Category
              </h3>
              <Button variant="outline" size="icon" onClick={() => setSelectedForecastMetric(null)} aria-label="Close chart">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative bg-white border rounded-lg p-6">
              <div className="space-y-4">
                {/* Competitive analysis table with triangles */}
                <div className="grid grid-cols-1 gap-4">
                {[{
                category: 'Organic Foods',
                competition: 'Low',
                level: 1,
                color: 'text-green-600'
              }, {
                category: 'Beverages',
                competition: 'Medium',
                level: 2,
                color: 'text-yellow-600'
              }, {
                category: 'Snacks & Candy',
                competition: 'High',
                level: 3,
                color: 'text-red-600'
              }, {
                category: 'Household Items',
                competition: 'Low',
                level: 1,
                color: 'text-green-600'
              }, {
                category: 'Personal Care',
                competition: 'Medium',
                level: 2,
                color: 'text-yellow-600'
              }, {
                category: 'Frozen Foods',
                competition: 'High',
                level: 3,
                color: 'text-red-600'
              }].map(item => <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.category}</h4>
                      <p className="text-sm text-gray-500">Competition level: {item.competition}</p>
                    </div>
                    <div className={\`flex items-center space-x-1 \${item.color}\`}>
                      {Array.from({
                    length: item.level
                  }, (_, i) => <Triangle key={i} className="w-4 h-4 fill-current" />)}
                      {Array.from({
                    length: 3 - item.level
                  }, (_, i) => <Triangle key={\`empty-\${i}\`} className="w-4 h-4 text-gray-300" />)}
                      <span className="ml-2 text-sm font-medium">{item.competition}</span>
                    </div>
                  </div>)}
                </div>
              </div>
            </div>
          </div>}
      </div>;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Sponsored Products: Summer Launch (In-Option)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Products',
          value: 'products',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Search Volume',
              options: [{
                label: 'High',
                value: 'High'
              }, {
                label: 'Medium',
                value: 'Medium'
              }, {
                label: 'Low',
                value: 'Low'
              }],
              selectedValues: searchVolume,
              onChange: setSearchVolume
            }, {
              name: 'Competitive',
              options: [{
                label: 'High',
                value: 'High'
              }, {
                label: 'Medium',
                value: 'Medium'
              }, {
                label: 'Low',
                value: 'Low'
              }],
              selectedValues: competitive,
              onChange: setCompetitive
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search products..." />
                  <Table columns={[{
              key: 'productId',
              header: 'Product ID'
            }, {
              key: 'gtin',
              header: 'GTIN'
            }, {
              key: 'image',
              header: 'Image',
              render: row => <img src={row.image} alt="Product" className="w-8 h-8 rounded object-cover" />
            }, {
              key: 'productTitle',
              header: 'Product Title'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'startTime',
              header: 'Start Time',
              render: row => new Date(row.startTime).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'endTime',
              header: 'End Time',
              render: row => new Date(row.endTime).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'searchVolume',
              header: 'Search Volume',
              render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge>
            }, {
              key: 'competitive',
              header: 'Competitive',
              render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge>
            }]} data={productData.filter(row => {
              const searchVolumeMatch = searchVolume.length === 0 || searchVolume.includes(row.searchVolume);
              const competitiveMatch = competitive.length === 0 || competitive.includes(row.competitive);
              return searchVolumeMatch && competitiveMatch;
            })} rowKey={row => row.productId} />
                </div>
        }, {
          label: 'Keywords',
          value: 'keywords',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Match Type',
              options: [{
                label: 'Exact',
                value: 'Exact'
              }, {
                label: 'Phrase',
                value: 'Phrase'
              }, {
                label: 'Broad',
                value: 'Broad'
              }],
              selectedValues: [],
              onChange: () => {}
            }, {
              name: 'Status',
              options: [{
                label: 'Active',
                value: 'Active'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Negative',
                value: 'Negative'
              }],
              selectedValues: [],
              onChange: () => {}
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search keywords..." />
                  <Table columns={[{
              key: 'keyword',
              header: 'Keyword'
            }, {
              key: 'matchType',
              header: 'Match Type',
              render: row => <Badge variant="outline">{row.matchType}</Badge>
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks'
            }, {
              key: 'avgCPC',
              header: 'Avg CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'conversion',
              header: 'Conversion'
            }, {
              key: 'sales',
              header: 'Sales'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'roas',
              header: 'ROAS'
            }, {
              key: 'searchVolume',
              header: 'Search Volume',
              render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge>
            }, {
              key: 'competitive',
              header: 'Competitive',
              render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge>
            }]} data={[{
              keyword: 'premium coffee beans',
              matchType: 'Exact',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€200',
              spent: '€0',
              budgetLeft: '€200',
              roas: '-',
              searchVolume: 'High',
              competitive: 'Medium'
            }, {
              keyword: 'organic coffee',
              matchType: 'Phrase',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€150',
              spent: '€0',
              budgetLeft: '€150',
              roas: '-',
              searchVolume: 'Medium',
              competitive: 'High'
            }, {
              keyword: 'coffee beans 500g',
              matchType: 'Broad',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€100',
              spent: '€0',
              budgetLeft: '€100',
              roas: '-',
              searchVolume: 'Low',
              competitive: 'Low'
            }]} rowKey={row => row.keyword} />
                </div>
        }, {
          label: 'Categories',
          value: 'categories',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Category Level',
              options: [{
                label: 'Level 1',
                value: 'Level 1'
              }, {
                label: 'Level 2',
                value: 'Level 2'
              }, {
                label: 'Level 3',
                value: 'Level 3'
              }],
              selectedValues: [],
              onChange: () => {}
            }, {
              name: 'Status',
              options: [{
                label: 'Active',
                value: 'Active'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Excluded',
                value: 'Excluded'
              }],
              selectedValues: [],
              onChange: () => {}
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search categories..." />
                  <Table columns={[{
              key: 'category',
              header: 'Category'
            }, {
              key: 'level',
              header: 'Level',
              render: row => <Badge variant="secondary">{row.level}</Badge>
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks'
            }, {
              key: 'avgCPC',
              header: 'Avg CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'conversion',
              header: 'Conversion'
            }, {
              key: 'sales',
              header: 'Sales'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'roas',
              header: 'ROAS'
            }, {
              key: 'searchVolume',
              header: 'Search Volume',
              render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge>
            }, {
              key: 'competitive',
              header: 'Competitive',
              render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge>
            }]} data={[{
              category: 'Food & Beverages > Coffee & Tea',
              level: 'Level 2',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€300',
              spent: '€0',
              budgetLeft: '€300',
              roas: '-',
              searchVolume: 'High',
              competitive: 'Medium'
            }, {
              category: 'Food & Beverages > Snacks',
              level: 'Level 2',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€200',
              spent: '€0',
              budgetLeft: '€200',
              roas: '-',
              searchVolume: 'Medium',
              competitive: 'High'
            }, {
              category: 'Organic Products',
              level: 'Level 1',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€250',
              spent: '€0',
              budgetLeft: '€250',
              roas: '-',
              searchVolume: 'Medium',
              competitive: 'Low'
            }]} rowKey={row => row.category} />
                </div>
        }, {
          label: 'Other',
          value: 'other',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Setting Type',
              options: [{
                label: 'Targeting',
                value: 'Targeting'
              }, {
                label: 'Bidding',
                value: 'Bidding'
              }, {
                label: 'Schedule',
                value: 'Schedule'
              }],
              selectedValues: [],
              onChange: () => {}
            }, {
              name: 'Status',
              options: [{
                label: 'Active',
                value: 'Active'
              }, {
                label: 'Inactive',
                value: 'Inactive'
              }],
              selectedValues: [],
              onChange: () => {}
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search settings..." />
                  <Table columns={[{
              key: 'setting',
              header: 'Setting'
            }, {
              key: 'type',
              header: 'Type',
              render: row => <Badge variant="outline">{row.type}</Badge>
            }, {
              key: 'value',
              header: 'Value'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks'
            }, {
              key: 'avgCPC',
              header: 'Avg CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'conversion',
              header: 'Conversion'
            }, {
              key: 'sales',
              header: 'Sales'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'roas',
              header: 'ROAS'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
            }]} data={[{
              setting: 'Age: 25-54',
              type: 'Targeting',
              value: 'Included',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€400',
              spent: '€0',
              budgetLeft: '€400',
              roas: '-',
              status: 'Active'
            }, {
              setting: 'Gender: All',
              type: 'Targeting',
              value: 'Included',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€300',
              spent: '€0',
              budgetLeft: '€300',
              roas: '-',
              status: 'Active'
            }, {
              setting: 'Schedule: Weekdays 9-17',
              type: 'Schedule',
              value: 'Active',
              impressions: '-',
              clicks: '-',
              avgCPC: '-',
              ctr: '-',
              conversion: '-',
              sales: '-',
              budget: '€200',
              spent: '€0',
              budgetLeft: '€200',
              roas: '-',
              status: 'Active'
            }]} rowKey={row => row.setting} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to log detail: \${row.action} (\${row.id})\`)} />
                </div>
        }]} action={activeTab === 'products' ? <Button>Add product</Button> : activeTab === 'keywords' ? <Button>Add keyword</Button> : activeTab === 'categories' ? <Button>Add categories</Button> : activeTab === 'other' ? <Button>Add other</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Ie.parameters?.docs?.source}}};Le.parameters={...Le.parameters,docs:{...Le.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('products');
    const [selectedMetric, setSelectedMetric] = useState('impressions');
    const [searchVolume, setSearchVolume] = useState<string[]>([]);
    const [competitive, setCompetitive] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Approved',
      name: 'Creative 1',
      format: 'Banner',
      placements: 3
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'Creative 2',
      format: 'Video',
      placements: 1
    }, {
      id: 'CR-003',
      status: 'Approved',
      name: 'Creative 3',
      format: 'Banner',
      placements: 2
    }];
    const productData = [{
      productId: 'P-001',
      gtin: '1234567890123',
      image: 'https://via.placeholder.com/40x40',
      productTitle: 'Premium Coffee Beans 500g',
      impressions: '847,592',
      clicks: '27,123',
      addToCart: '3,864',
      avgCPC: '€0.34',
      ctr: '3.2%',
      atc: '14.2%',
      conversion: '2.1%',
      sales: '€12,847',
      budget: '€500',
      spent: '€423',
      budgetLeft: '€77',
      roas: '3.8x',
      extROAS: '4.2x',
      iROAS: '3.6x',
      startTime: '2024-06-01',
      endTime: '2024-06-30',
      searchVolume: 'High',
      competitive: 'Medium'
    }, {
      productId: 'P-002',
      gtin: '2345678901234',
      image: 'https://via.placeholder.com/40x40',
      productTitle: 'Organic Tea Selection Pack',
      impressions: '634,218',
      clicks: '18,945',
      addToCart: '2,156',
      avgCPC: '€0.42',
      ctr: '2.9%',
      atc: '11.4%',
      conversion: '1.8%',
      sales: '€8,934',
      budget: '€750',
      spent: '€612',
      budgetLeft: '€138',
      roas: '2.9x',
      extROAS: '3.1x',
      iROAS: '2.8x',
      startTime: '2024-07-01',
      endTime: '2024-07-31',
      searchVolume: 'Medium',
      competitive: 'High'
    }, {
      productId: 'P-003',
      gtin: '3456789012345',
      image: 'https://via.placeholder.com/40x40',
      productTitle: 'Artisan Chocolate Bar 200g',
      impressions: '234,156',
      clicks: '8,234',
      addToCart: '1,245',
      avgCPC: '€0.28',
      ctr: '3.5%',
      atc: '15.1%',
      conversion: '2.8%',
      sales: '€4,567',
      budget: '€300',
      spent: '€287',
      budgetLeft: '€13',
      roas: '4.2x',
      extROAS: '4.6x',
      iROAS: '4.1x',
      startTime: '2024-08-10',
      endTime: '2024-09-10',
      searchVolume: 'Low',
      competitive: 'Medium'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Sponsored Products: Running Campaign',
      description: 'Initial campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '€500',
      newValue: '€750',
      description: 'Budget increased for active campaign'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 15:22:45',
      user: 'John Smith',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'In-option',
      newValue: 'Running',
      description: 'Campaign activated and running'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-11 09:15:33',
      user: 'Sarah Wilson',
      action: 'Performance Update',
      field: 'Metrics',
      oldValue: '-',
      newValue: 'CTR: 3.5%',
      description: 'Daily performance metrics update'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'System',
      action: 'Spend Alert',
      field: 'Budget',
      oldValue: '€100 remaining',
      newValue: '€13 remaining',
      description: 'Budget alert triggered'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Bid Adjustment',
      field: 'Bidding',
      oldValue: '€0.25',
      newValue: '€0.28',
      description: 'Increased bid for better positioning'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'ROAS Update',
      field: 'Performance',
      oldValue: '3.8x',
      newValue: '4.2x',
      description: 'Improved return on ad spend'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Campaign Review',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Performing well, continue current strategy',
      description: 'Weekly campaign review'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const ellipsisMenu = <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for running campaign
    const performanceMetrics = [{
      id: 'impressions',
      label: 'Impressions',
      value: '2,845,692',
      subMetric: 'CTR: 3.2%',
      badgeValue: '+15%',
      badgeVariant: 'success' as const
    }, {
      id: 'clicks',
      label: 'Clicks',
      value: '91,062',
      subMetric: 'CPC: €0.42',
      badgeValue: '+8%',
      badgeVariant: 'success' as const
    }, {
      id: 'addToCart',
      label: 'Add to Cart',
      value: '12,847',
      subMetric: 'CVR: 14.1%',
      badgeValue: '+22%',
      badgeVariant: 'success' as const
    }, {
      id: 'sales',
      label: 'Sales',
      value: '€127,890',
      subMetric: 'ROAS: 3.34x',
      badgeValue: '+18%',
      badgeVariant: 'success' as const
    }];

    // Chart data generation function
    const getChartData = (selectedMetric: string) => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayLabel = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        let value;
        switch (selectedMetric) {
          case 'impressions':
            value = Math.round(280000 + Math.random() * 100000);
            break;
          case 'clicks':
            value = Math.round(8000 + Math.random() * 4000);
            break;
          case 'addToCart':
            value = Math.round(1200 + Math.random() * 600);
            break;
          case 'sales':
            value = Math.round(12000 + Math.random() * 6000);
            break;
          default:
            value = Math.round(1000 + Math.random() * 500);
        }
        days.push({
          day: dayLabel,
          value
        });
      }
      return days;
    };
    const chartData = getChartData(selectedMetric);
    const selectedMetricData = performanceMetrics.find(m => m.id === selectedMetric);
    const dialogMetricsSponsoredProductsRunning: MetricDefinition[] = [{
      key: 'ctr',
      label: 'Click-Through Rate',
      value: '2.34%',
      subMetric: 'vs. 2.18% last period',
      badgeValue: '+7.3%',
      badgeVariant: 'success'
    }, {
      key: 'conversionRate',
      label: 'Conversion Rate',
      value: '4.12%',
      subMetric: '1,234 conversions',
      badgeValue: '+12.5%',
      badgeVariant: 'success'
    }, {
      key: 'cpc',
      label: 'Cost Per Click',
      value: '$0.58',
      subMetric: 'vs. $0.62 target',
      badgeValue: '-6.5%',
      badgeVariant: 'success'
    }, {
      key: 'viewability',
      label: 'Viewability Rate',
      value: '87.3%',
      subMetric: 'Above industry avg',
      badgeValue: '+5.2%',
      badgeVariant: 'success'
    }, {
      key: 'brandLift',
      label: 'Brand Lift',
      value: '+18.2%',
      subMetric: 'Awareness increase',
      badgeValue: 'High',
      badgeVariant: 'info'
    }, {
      key: 'sov',
      label: 'Share of Voice',
      value: '34.7%',
      subMetric: 'In category',
      badgeValue: '+2.1%',
      badgeVariant: 'secondary'
    }, {
      key: 'frequency',
      label: 'Frequency',
      value: '3.8x',
      subMetric: 'Avg. per user',
      badgeValue: 'Optimal',
      badgeVariant: 'success'
    }, {
      key: 'vcr',
      label: 'Video Completion Rate',
      value: '68.9%',
      subMetric: '15s videos',
      badgeValue: '+9.4%',
      badgeVariant: 'success'
    }, {
      key: 'cpa',
      label: 'Cost Per Acquisition',
      value: '$24.50',
      subMetric: 'vs. $30 target',
      badgeValue: '-18.3%',
      badgeVariant: 'success'
    }];
    const ForecastSection = () => <div className="space-y-6">
        <MetricRow metrics={performanceMetrics.map(m => ({
        ...m,
        key: m.id
      }))} selectedKeys={performanceMetrics.map(m => m.id)} maxVisible={5} defaultVariant="default" removable={false} activeKey={selectedMetric} onActiveKeyChange={key => setSelectedMetric(key ?? 'impressions')} dialogMetrics={dialogMetricsSponsoredProductsRunning} onDialogMetricClick={key => console.log(\`\${key} selected\`)} />

        {/* Interactive Line Chart */}
        <div>
          <div className="relative bg-white border rounded-lg p-6">
            <Button variant="outline" size="icon" onClick={() => setSelectedMetric('impressions')} aria-label="Close chart" className="absolute top-2 right-2 z-10">
              <X className="w-4 h-4" />
            </Button>
            <LineChartComponent data={chartData} config={{
            value: {
              label: selectedMetricData?.label || 'Value',
              color: "hsl(var(--chart-1))"
            }
          }} showLegend={false} showGrid={true} showTooltip={true} showXAxis={true} showYAxis={true} className="h-52 w-full" xAxisDataKey="day" />
          </div>
        </div>
      </div>;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Sponsored Products: Summer Launch (Running)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>
        
        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Products',
          value: 'products',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Search Volume',
              options: [{
                label: 'High',
                value: 'High'
              }, {
                label: 'Medium',
                value: 'Medium'
              }, {
                label: 'Low',
                value: 'Low'
              }],
              selectedValues: searchVolume,
              onChange: setSearchVolume
            }, {
              name: 'Competitive',
              options: [{
                label: 'High',
                value: 'High'
              }, {
                label: 'Medium',
                value: 'Medium'
              }, {
                label: 'Low',
                value: 'Low'
              }],
              selectedValues: competitive,
              onChange: setCompetitive
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search products..." />
                  <Table columns={[{
              key: 'productId',
              header: 'Product ID'
            }, {
              key: 'gtin',
              header: 'GTIN'
            }, {
              key: 'image',
              header: 'Image',
              render: row => <img src={row.image} alt="Product" className="w-8 h-8 rounded object-cover" />
            }, {
              key: 'productTitle',
              header: 'Product Title'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks'
            }, {
              key: 'addToCart',
              header: 'Add to Cart'
            }, {
              key: 'avgCPC',
              header: 'Avg CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'atc',
              header: 'ATC'
            }, {
              key: 'conversion',
              header: 'Conversion'
            }, {
              key: 'sales',
              header: 'Sales'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'roas',
              header: 'ROAS'
            }, {
              key: 'extROAS',
              header: 'Ext. ROAS'
            }, {
              key: 'iROAS',
              header: 'IROAS'
            }, {
              key: 'startTime',
              header: 'Start Time',
              render: row => new Date(row.startTime).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'endTime',
              header: 'End Time',
              render: row => new Date(row.endTime).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'searchVolume',
              header: 'Search Volume',
              render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge>
            }, {
              key: 'competitive',
              header: 'Competitive',
              render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge>
            }]} data={productData.filter(row => {
              const searchVolumeMatch = searchVolume.length === 0 || searchVolume.includes(row.searchVolume);
              const competitiveMatch = competitive.length === 0 || competitive.includes(row.competitive);
              return searchVolumeMatch && competitiveMatch;
            })} rowKey={row => row.productId} />
                </div>
        }, {
          label: 'Keywords',
          value: 'keywords',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Match Type',
              options: [{
                label: 'Exact',
                value: 'Exact'
              }, {
                label: 'Phrase',
                value: 'Phrase'
              }, {
                label: 'Broad',
                value: 'Broad'
              }],
              selectedValues: [],
              onChange: () => {}
            }, {
              name: 'Status',
              options: [{
                label: 'Active',
                value: 'Active'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Negative',
                value: 'Negative'
              }],
              selectedValues: [],
              onChange: () => {}
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search keywords..." />
                  <Table columns={[{
              key: 'keyword',
              header: 'Keyword'
            }, {
              key: 'matchType',
              header: 'Match Type',
              render: row => <Badge variant="outline">{row.matchType}</Badge>
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks'
            }, {
              key: 'avgCPC',
              header: 'Avg CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'conversion',
              header: 'Conversion'
            }, {
              key: 'sales',
              header: 'Sales'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'roas',
              header: 'ROAS'
            }, {
              key: 'searchVolume',
              header: 'Search Volume',
              render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge>
            }, {
              key: 'competitive',
              header: 'Competitive',
              render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge>
            }]} data={[{
              keyword: 'premium coffee beans',
              matchType: 'Exact',
              impressions: '342,156',
              clicks: '8,923',
              avgCPC: '€0.38',
              ctr: '2.6%',
              conversion: '1.8%',
              sales: '€4,234',
              budget: '€200',
              spent: '€187',
              budgetLeft: '€13',
              roas: '2.8x',
              searchVolume: 'High',
              competitive: 'Medium'
            }, {
              keyword: 'organic coffee',
              matchType: 'Phrase',
              impressions: '187,432',
              clicks: '4,567',
              avgCPC: '€0.42',
              ctr: '2.4%',
              conversion: '1.5%',
              sales: '€2,156',
              budget: '€150',
              spent: '€143',
              budgetLeft: '€7',
              roas: '2.1x',
              searchVolume: 'Medium',
              competitive: 'High'
            }, {
              keyword: 'coffee beans 500g',
              matchType: 'Broad',
              impressions: '89,234',
              clicks: '1,892',
              avgCPC: '€0.29',
              ctr: '2.1%',
              conversion: '2.2%',
              sales: '€1,234',
              budget: '€100',
              spent: '€95',
              budgetLeft: '€5',
              roas: '3.1x',
              searchVolume: 'Low',
              competitive: 'Low'
            }]} rowKey={row => row.keyword} />
                </div>
        }, {
          label: 'Categories',
          value: 'categories',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Category Level',
              options: [{
                label: 'Level 1',
                value: 'Level 1'
              }, {
                label: 'Level 2',
                value: 'Level 2'
              }, {
                label: 'Level 3',
                value: 'Level 3'
              }],
              selectedValues: [],
              onChange: () => {}
            }, {
              name: 'Status',
              options: [{
                label: 'Active',
                value: 'Active'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Excluded',
                value: 'Excluded'
              }],
              selectedValues: [],
              onChange: () => {}
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search categories..." />
                  <Table columns={[{
              key: 'category',
              header: 'Category'
            }, {
              key: 'level',
              header: 'Level',
              render: row => <Badge variant="secondary">{row.level}</Badge>
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks'
            }, {
              key: 'avgCPC',
              header: 'Avg CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'conversion',
              header: 'Conversion'
            }, {
              key: 'sales',
              header: 'Sales'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'roas',
              header: 'ROAS'
            }, {
              key: 'searchVolume',
              header: 'Search Volume',
              render: row => <Badge variant={row.searchVolume === 'High' ? 'success' : row.searchVolume === 'Medium' ? 'warning' : 'secondary'}>{row.searchVolume}</Badge>
            }, {
              key: 'competitive',
              header: 'Competitive',
              render: row => <Badge variant={row.competitive === 'High' ? 'destructive' : row.competitive === 'Medium' ? 'warning' : 'success'}>{row.competitive}</Badge>
            }]} data={[{
              category: 'Food & Beverages > Coffee & Tea',
              level: 'Level 2',
              impressions: '456,789',
              clicks: '12,345',
              avgCPC: '€0.35',
              ctr: '2.7%',
              conversion: '1.9%',
              sales: '€5,678',
              budget: '€300',
              spent: '€278',
              budgetLeft: '€22',
              roas: '3.2x',
              searchVolume: 'High',
              competitive: 'Medium'
            }, {
              category: 'Food & Beverages > Snacks',
              level: 'Level 2',
              impressions: '234,567',
              clicks: '6,789',
              avgCPC: '€0.41',
              ctr: '2.9%',
              conversion: '1.6%',
              sales: '€3,456',
              budget: '€200',
              spent: '€189',
              budgetLeft: '€11',
              roas: '2.8x',
              searchVolume: 'Medium',
              competitive: 'High'
            }, {
              category: 'Organic Products',
              level: 'Level 1',
              impressions: '345,678',
              clicks: '8,912',
              avgCPC: '€0.33',
              ctr: '2.6%',
              conversion: '2.1%',
              sales: '€4,567',
              budget: '€250',
              spent: '€234',
              budgetLeft: '€16',
              roas: '3.5x',
              searchVolume: 'Medium',
              competitive: 'Low'
            }]} rowKey={row => row.category} />
                </div>
        }, {
          label: 'Other',
          value: 'other',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Setting Type',
              options: [{
                label: 'Targeting',
                value: 'Targeting'
              }, {
                label: 'Bidding',
                value: 'Bidding'
              }, {
                label: 'Schedule',
                value: 'Schedule'
              }],
              selectedValues: [],
              onChange: () => {}
            }, {
              name: 'Status',
              options: [{
                label: 'Active',
                value: 'Active'
              }, {
                label: 'Inactive',
                value: 'Inactive'
              }],
              selectedValues: [],
              onChange: () => {}
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search settings..." />
                  <Table columns={[{
              key: 'setting',
              header: 'Setting'
            }, {
              key: 'type',
              header: 'Type',
              render: row => <Badge variant="outline">{row.type}</Badge>
            }, {
              key: 'value',
              header: 'Value'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks'
            }, {
              key: 'avgCPC',
              header: 'Avg CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'conversion',
              header: 'Conversion'
            }, {
              key: 'sales',
              header: 'Sales'
            }, {
              key: 'budget',
              header: 'Budget'
            }, {
              key: 'spent',
              header: 'Spent'
            }, {
              key: 'budgetLeft',
              header: 'Budget Left'
            }, {
              key: 'roas',
              header: 'ROAS'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
            }]} data={[{
              setting: 'Age: 25-54',
              type: 'Targeting',
              value: 'Included',
              impressions: '567,890',
              clicks: '14,567',
              avgCPC: '€0.36',
              ctr: '2.6%',
              conversion: '1.8%',
              sales: '€6,789',
              budget: '€400',
              spent: '€387',
              budgetLeft: '€13',
              roas: '3.1x',
              status: 'Active'
            }, {
              setting: 'Gender: All',
              type: 'Targeting',
              value: 'Included',
              impressions: '456,789',
              clicks: '11,234',
              avgCPC: '€0.39',
              ctr: '2.5%',
              conversion: '1.7%',
              sales: '€5,234',
              budget: '€300',
              spent: '€289',
              budgetLeft: '€11',
              roas: '2.9x',
              status: 'Active'
            }, {
              setting: 'Schedule: Weekdays 9-17',
              type: 'Schedule',
              value: 'Active',
              impressions: '234,567',
              clicks: '6,789',
              avgCPC: '€0.34',
              ctr: '2.9%',
              conversion: '2.0%',
              sales: '€3,456',
              budget: '€200',
              spent: '€192',
              budgetLeft: '€8',
              roas: '3.4x',
              status: 'Active'
            }]} rowKey={row => row.setting} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Dates Modified',
                value: 'Dates Modified'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to log detail: \${row.action} (\${row.id})\`)} />
                </div>
        }]} action={activeTab === 'products' ? <Button>Add product</Button> : activeTab === 'keywords' ? <Button>Add keyword</Button> : activeTab === 'categories' ? <Button>Add categories</Button> : activeTab === 'other' ? <Button>Add other</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Le.parameters?.docs?.source}}};Pe.parameters={...Pe.parameters,docs:{...Pe.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [channel, setChannel] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Approved',
      name: 'Social Banner Pack',
      format: 'Social Media',
      placements: 6,
      adSpend: '$25,935',
      impressions: '3,854,196',
      clicks: '59,537',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$65,592',
      onlineSkuUnits: '4,447',
      onlineSkuConversions: '2,680',
      instoreSkuRevenue: '$46,884',
      instoreSkuUnits: '3,137',
      instoreSkuConversions: '1,894',
      totalSkuRevenue: '$112,476',
      totalSkuUnits: '7,584',
      totalSkuConversions: '4,574'
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'CTV Spot 30s',
      format: 'Video',
      placements: 3,
      adSpend: '$25,935',
      impressions: '3,854,196',
      clicks: '59,537',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$65,592',
      onlineSkuUnits: '4,447',
      onlineSkuConversions: '2,680',
      instoreSkuRevenue: '$46,884',
      instoreSkuUnits: '3,137',
      instoreSkuConversions: '1,894',
      totalSkuRevenue: '$112,476',
      totalSkuUnits: '7,584',
      totalSkuConversions: '4,574'
    }, {
      id: 'CR-003',
      status: 'Approved',
      name: 'Audio Spot 15s',
      format: 'Audio',
      placements: 2,
      adSpend: '$17,290',
      impressions: '2,569,464',
      clicks: '39,691',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$43,728',
      onlineSkuUnits: '2,965',
      onlineSkuConversions: '1,787',
      instoreSkuRevenue: '$31,256',
      instoreSkuUnits: '2,091',
      instoreSkuConversions: '1,262',
      totalSkuRevenue: '$74,984',
      totalSkuUnits: '5,056',
      totalSkuConversions: '3,049'
    }, {
      id: 'CR-004',
      status: 'Approved',
      name: 'DOOH Billboard',
      format: 'Digital Out-of-Home',
      placements: 4,
      adSpend: '$17,290',
      impressions: '2,569,464',
      clicks: '39,691',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$43,728',
      onlineSkuUnits: '2,964',
      onlineSkuConversions: '1,787',
      instoreSkuRevenue: '$31,256',
      instoreSkuUnits: '2,091',
      instoreSkuConversions: '1,262',
      totalSkuRevenue: '$74,984',
      totalSkuUnits: '5,055',
      totalSkuConversions: '3,049'
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'Running',
      name: '3rd Party Display Campaign',
      channel: '3rd Party Display',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend',
      adSpend: '$12,350',
      impressions: '1,835,331',
      clicks: '28,349',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$31,234',
      onlineSkuUnits: '2,118',
      onlineSkuConversions: '1,276',
      instoreSkuRevenue: '$22,326',
      instoreSkuUnits: '1,494',
      instoreSkuConversions: '902',
      totalSkuRevenue: '$53,560',
      totalSkuUnits: '3,612',
      totalSkuConversions: '2,178'
    }, {
      id: 'LI-002',
      status: 'Running',
      name: 'Meta & Google Social Ads',
      channel: 'Socials',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Optimize Budget',
      adSpend: '$15,561',
      impressions: '2,312,917',
      clicks: '35,722',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$39,355',
      onlineSkuUnits: '2,669',
      onlineSkuConversions: '1,608',
      instoreSkuRevenue: '$28,130',
      instoreSkuUnits: '1,882',
      instoreSkuConversions: '1,136',
      totalSkuRevenue: '$67,485',
      totalSkuUnits: '4,551',
      totalSkuConversions: '2,744'
    }, {
      id: 'LI-003',
      status: 'Running',
      name: 'Connected TV Spots',
      channel: 'Connected TV',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend',
      adSpend: '$14,184',
      impressions: '2,108,394',
      clicks: '32,561',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$35,886',
      onlineSkuUnits: '2,434',
      onlineSkuConversions: '1,467',
      instoreSkuRevenue: '$25,651',
      instoreSkuUnits: '1,716',
      instoreSkuConversions: '1,036',
      totalSkuRevenue: '$61,537',
      totalSkuUnits: '4,150',
      totalSkuConversions: '2,503'
    }, {
      id: 'LI-004',
      status: 'Running',
      name: 'Digital Out-of-Home Network',
      channel: '3rd Party DOOH',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Optimize Budget',
      adSpend: '$9,566',
      impressions: '1,421,287',
      clicks: '21,953',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$24,205',
      onlineSkuUnits: '1,641',
      onlineSkuConversions: '989',
      instoreSkuRevenue: '$17,304',
      instoreSkuUnits: '1,158',
      instoreSkuConversions: '699',
      totalSkuRevenue: '$41,509',
      totalSkuUnits: '2,799',
      totalSkuConversions: '1,688'
    }, {
      id: 'LI-005',
      status: 'Running',
      name: 'AI-Powered Programmatic',
      channel: 'AI',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend',
      adSpend: '$14,184',
      impressions: '2,108,394',
      clicks: '32,561',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$35,886',
      onlineSkuUnits: '2,434',
      onlineSkuConversions: '1,467',
      instoreSkuRevenue: '$25,651',
      instoreSkuUnits: '1,716',
      instoreSkuConversions: '1,036',
      totalSkuRevenue: '$61,537',
      totalSkuUnits: '4,150',
      totalSkuConversions: '2,503'
    }, {
      id: 'LI-006',
      status: 'Running',
      name: 'Audio Streaming Ads',
      channel: '3rd Party Audio',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Optimize Budget',
      adSpend: '$8,255',
      impressions: '1,226,527',
      clicks: '18,944',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$20,896',
      onlineSkuUnits: '1,417',
      onlineSkuConversions: '854',
      instoreSkuRevenue: '$14,935',
      instoreSkuUnits: '999',
      instoreSkuConversions: '603',
      totalSkuRevenue: '$35,831',
      totalSkuUnits: '2,416',
      totalSkuConversions: '1,457'
    }, {
      id: 'LI-007',
      status: 'Running',
      name: 'Direct Mail Campaign',
      channel: '3rd Party Mailing',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend',
      adSpend: '$12,350',
      impressions: '1,834,470',
      clicks: '28,326',
      cpc: '$0.44',
      ctr: '1.54%',
      cpm: '$9.34',
      ecpm: '$6.73',
      onlineSkuRevenue: '$31,177',
      onlineSkuUnits: '2,110',
      onlineSkuConversions: '1,273',
      instoreSkuRevenue: '$22,283',
      instoreSkuUnits: '1,491',
      instoreSkuConversions: '900',
      totalSkuRevenue: '$53,460',
      totalSkuUnits: '3,601',
      totalSkuConversions: '2,173'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-10 14:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Offsite: Summer Launch',
      description: 'Initial offsite campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-10 14:35:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '$50,000',
      newValue: '$120,000',
      description: 'Budget increased for multi-channel offsite push'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 15:22:45',
      user: 'John Smith',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'Running',
      description: 'Offsite campaign is now live'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-11 09:15:33',
      user: 'Sarah Wilson',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added 3rd Party Display line item'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-11 10:45:21',
      user: 'Jane Doe',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-002',
      description: 'Added Socials campaign line item'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-11 11:30:14',
      user: 'Mike Johnson',
      action: 'Channel Added',
      field: 'Channels',
      oldValue: '-',
      newValue: 'Connected TV',
      description: 'Added CTV channel to offsite mix'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-11 16:20:58',
      user: 'Sarah Wilson',
      action: 'Target Updated',
      field: 'Targeting',
      oldValue: 'Desktop 18-35',
      newValue: 'Multi-device 18-54',
      description: 'Expanded targeting for offsite channels'
    }, {
      id: 'LOG-008',
      timestamp: '2024-12-12 08:45:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Offsite performance exceeds expectations across all channels',
      description: 'Added performance comment'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for running offsite campaign
    const performanceMetrics: MetricDefinition[] = [{
      key: 'adSpend',
      label: 'Ad Spend',
      value: '$86,450',
      subMetric: 'Budget: $120,000',
      badgeValue: '+15%',
      badgeVariant: 'success'
    }, {
      key: 'impressions',
      label: 'Impressions',
      value: '12,847,320',
      subMetric: 'Unique: 5.8M',
      badgeValue: '+18%',
      badgeVariant: 'success'
    }, {
      key: 'clicks',
      label: 'Clicks + Add to Carts',
      value: '198,456',
      subMetric: 'Add to Carts: 24,807',
      badgeValue: '+12%',
      badgeVariant: 'success'
    }, {
      key: 'cpc',
      label: 'CPC',
      value: '$0.44',
      subMetric: 'Ad Spend / Clicks',
      badgeValue: '-8%',
      badgeVariant: 'success'
    }, {
      key: 'ctr',
      label: 'CTR',
      value: '1.54%',
      subMetric: 'Clicks / Impressions',
      badgeValue: '+20%',
      badgeVariant: 'success'
    }, {
      key: 'cpm',
      label: 'CPM',
      value: '$9.34',
      subMetric: 'Budget / Impressions × 1,000',
      badgeValue: '-6%',
      badgeVariant: 'success'
    }, {
      key: 'ecpm',
      label: 'eCPM',
      value: '$6.73',
      subMetric: 'Spend / Impressions × 1,000',
      badgeValue: '-4%',
      badgeVariant: 'success'
    }, {
      key: 'onlineSkuRevenue',
      label: 'Online SKU Revenue',
      value: '$218,640',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+22%',
      badgeVariant: 'success'
    }, {
      key: 'onlineSkuUnits',
      label: 'Online SKU Units',
      value: '14,823',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+18%',
      badgeVariant: 'success'
    }, {
      key: 'onlineSkuConversions',
      label: 'Online SKU Conversions',
      value: '8,934',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+16%',
      badgeVariant: 'success'
    }, {
      key: 'instoreSkuRevenue',
      label: 'In-store SKU Revenue',
      value: '$156,280',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+19%',
      badgeVariant: 'success'
    }, {
      key: 'instoreSkuUnits',
      label: 'In-store SKU Units',
      value: '10,456',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+14%',
      badgeVariant: 'success'
    }, {
      key: 'instoreSkuConversions',
      label: 'In-store SKU Conversions',
      value: '6,312',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+11%',
      badgeVariant: 'success'
    }, {
      key: 'totalSkuRevenue',
      label: 'Total SKU Revenue',
      value: '$374,920',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+21%',
      badgeVariant: 'success'
    }, {
      key: 'totalSkuUnits',
      label: 'Total SKU Units',
      value: '25,279',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+16%',
      badgeVariant: 'success'
    }, {
      key: 'totalSkuConversions',
      label: 'Total SKU Conversions',
      value: '15,246',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: '+14%',
      badgeVariant: 'success'
    }];
    const ForecastSection = () => <MetricRow metrics={performanceMetrics} selectedKeys={['adSpend', 'impressions', 'ctr', 'totalSkuRevenue']} maxVisible={5} defaultVariant="default" removable={true} />;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Offsite: Summer Launch (Running)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'In-option',
                value: 'In-option'
              }, {
                label: 'Running',
                value: 'Running'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Stopped',
                value: 'Stopped'
              }, {
                label: 'Ready',
                value: 'Ready'
              }],
              selectedValues: lineItemStatus,
              onChange: setLineItemStatus
            }, {
              name: 'Channel',
              options: [{
                label: '3rd Party Display',
                value: '3rd Party Display'
              }, {
                label: 'Socials',
                value: 'Socials'
              }, {
                label: 'Connected TV',
                value: 'Connected TV'
              }, {
                label: '3rd Party DOOH',
                value: '3rd Party DOOH'
              }, {
                label: 'AI',
                value: 'AI'
              }, {
                label: '3rd Party Audio',
                value: '3rd Party Audio'
              }, {
                label: '3rd Party Mailing',
                value: '3rd Party Mailing'
              }],
              selectedValues: channel,
              onChange: setChannel
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
              key: 'id',
              header: 'Line-item ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'aiRecommendation',
              header: 'AI Recommendation',
              render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
            }, {
              key: 'channel',
              header: 'Channel'
            }, {
              key: 'start',
              header: 'Start date',
              render: row => new Date(row.start).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'end',
              header: 'End date',
              render: row => new Date(row.end).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'adSpend',
              header: 'Ad Spend'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks + Add to Carts'
            }, {
              key: 'cpc',
              header: 'CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'cpm',
              header: 'CPM'
            }, {
              key: 'ecpm',
              header: 'eCPM'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU Units'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU Conversions'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU Units'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU Conversions'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU Units'
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU Conversions'
            }]} data={lineItemData.filter(row => {
              const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
              const channelMatch = channel.length === 0 || channel.includes(row.channel);
              return statusMatch && channelMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offsite/line-item/\${row.id}\`} />
                </div>
        }, {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'Approved'
              }, {
                label: 'Rejected',
                value: 'Rejected'
              }, {
                label: 'Pending',
                value: 'Pending'
              }],
              selectedValues: creativeStatus,
              onChange: setCreativeStatus
            }, {
              name: 'Format',
              options: [{
                label: 'Social Media',
                value: 'Social Media'
              }, {
                label: 'Video',
                value: 'Video'
              }, {
                label: 'Audio',
                value: 'Audio'
              }, {
                label: 'Digital Out-of-Home',
                value: 'Digital Out-of-Home'
              }],
              selectedValues: creativeFormat,
              onChange: setCreativeFormat
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
              key: 'id',
              header: 'Creative ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'placements',
              header: 'Placements',
              render: row => <Badge variant="secondary">{row.placements}</Badge>
            }, {
              key: 'adSpend',
              header: 'Ad Spend'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks + Add to Carts'
            }, {
              key: 'cpc',
              header: 'CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'cpm',
              header: 'CPM'
            }, {
              key: 'ecpm',
              header: 'eCPM'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU Units'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU Conversions'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU Units'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU Conversions'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU Units'
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU Conversions'
            }]} data={creativeData.filter(row => {
              const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
              const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
              return statusMatch && formatMatch;
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offsite/creative/\${row.id}\`} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Channel Added',
                value: 'Channel Added'
              }, {
                label: 'Target Updated',
                value: 'Target Updated'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => window.location.href = \`/campaigns/offsite/log/\${row.id}\`} />
                </div>
        }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Pe.parameters?.docs?.source}}};Te.parameters={...Te.parameters,docs:{...Te.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [activeTab, setActiveTab] = useState('line-items');
    const [lineItemStatus, setLineItemStatus] = useState<string[]>([]);
    const [channel, setChannel] = useState<string[]>([]);
    const [creativeStatus, setCreativeStatus] = useState<string[]>([]);
    const [creativeFormat, setCreativeFormat] = useState<string[]>([]);
    const [logUsers, setLogUsers] = useState<string[]>([]);
    const [logActions, setLogActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 30)
    });
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
    const creativeData = [{
      id: 'CR-001',
      status: 'Pending',
      name: 'Social Banner Pack',
      format: 'Social Media',
      placements: 4,
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'CR-002',
      status: 'Approved',
      name: 'CTV Spot 30s',
      format: 'Video',
      placements: 2,
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'CR-003',
      status: 'Rejected',
      name: 'Audio Spot 15s',
      format: 'Audio',
      placements: 0,
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }];
    const lineItemData = [{
      id: 'LI-001',
      status: 'In-option',
      name: '3rd Party Display Campaign',
      channel: '3rd Party Display',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Increase Spend',
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'LI-002',
      status: 'In-option',
      name: 'Meta & Google Social Ads',
      channel: 'Socials',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Optimize Budget',
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'LI-003',
      status: 'Ready',
      name: 'Connected TV Spots',
      channel: 'Connected TV',
      start: '2024-08-10',
      end: '2024-09-10',
      aiRecommendation: 'Increase Spend',
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'LI-004',
      status: 'In-option',
      name: 'Digital Out-of-Home Network',
      channel: '3rd Party DOOH',
      start: '2024-11-01',
      end: '2024-11-30',
      aiRecommendation: 'Optimize Budget',
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'LI-005',
      status: 'Ready',
      name: 'AI-Powered Programmatic',
      channel: 'AI',
      start: '2024-12-01',
      end: '2024-12-31',
      aiRecommendation: 'Increase Spend',
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'LI-006',
      status: 'In-option',
      name: 'Audio Streaming Ads',
      channel: '3rd Party Audio',
      start: '2024-06-01',
      end: '2024-06-30',
      aiRecommendation: 'Optimize Budget',
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }, {
      id: 'LI-007',
      status: 'Ready',
      name: 'Direct Mail Campaign',
      channel: '3rd Party Mailing',
      start: '2024-07-01',
      end: '2024-07-31',
      aiRecommendation: 'Increase Spend',
      adSpend: '-',
      impressions: '-',
      clicks: '-',
      cpc: '-',
      ctr: '-',
      cpm: '-',
      ecpm: '-',
      onlineSkuRevenue: '-',
      onlineSkuUnits: '-',
      onlineSkuConversions: '-',
      instoreSkuRevenue: '-',
      instoreSkuUnits: '-',
      instoreSkuConversions: '-',
      totalSkuRevenue: '-',
      totalSkuUnits: '-',
      totalSkuConversions: '-'
    }];
    const logData = [{
      id: 'LOG-001',
      timestamp: '2024-12-09 15:30:00',
      user: 'Jane Doe',
      action: 'Campaign Created',
      field: 'Campaign',
      oldValue: '-',
      newValue: 'Offsite: Summer Launch',
      description: 'Initial offsite campaign creation'
    }, {
      id: 'LOG-002',
      timestamp: '2024-12-09 15:45:12',
      user: 'Jane Doe',
      action: 'Budget Updated',
      field: 'Budget',
      oldValue: '$0',
      newValue: '$100,000',
      description: 'Initial budget allocation for offsite channels'
    }, {
      id: 'LOG-003',
      timestamp: '2024-12-10 08:15:33',
      user: 'Sarah Wilson',
      action: 'Line Item Added',
      field: 'Line Items',
      oldValue: '-',
      newValue: 'LI-001',
      description: 'Added 3rd Party Display line item for approval'
    }, {
      id: 'LOG-004',
      timestamp: '2024-12-10 09:30:21',
      user: 'Jane Doe',
      action: 'Creative Uploaded',
      field: 'Creatives',
      oldValue: '-',
      newValue: 'CR-001',
      description: 'Social banner pack uploaded for review'
    }, {
      id: 'LOG-005',
      timestamp: '2024-12-10 10:15:14',
      user: 'Mike Johnson',
      action: 'Status Changed',
      field: 'Status',
      oldValue: 'Draft',
      newValue: 'In-option',
      description: 'Campaign moved to in-option for client review'
    }, {
      id: 'LOG-006',
      timestamp: '2024-12-10 13:45:58',
      user: 'Sarah Wilson',
      action: 'Channel Added',
      field: 'Channels',
      oldValue: '3rd Party Display',
      newValue: '+ Socials, Connected TV',
      description: 'Expanded offsite channel mix'
    }, {
      id: 'LOG-007',
      timestamp: '2024-12-10 16:20:12',
      user: 'John Smith',
      action: 'Comment Added',
      field: 'Notes',
      oldValue: '-',
      newValue: 'Awaiting creative approval for all offsite channels',
      description: 'Added client feedback status'
    }];
    const creativeStatusVariant = (status: string) => {
      switch (status) {
        case 'Approved':
          return 'success';
        case 'Rejected':
          return 'destructive';
        case 'Pending':
          return 'warning';
        default:
          return 'outline';
      }
    };
    const lineItemStatusVariant = (status: string) => {
      switch (status) {
        case 'In-option':
          return 'outline';
        case 'Running':
          return 'success';
        case 'Paused':
          return 'warning';
        case 'Stopped':
          return 'destructive';
        case 'Ready':
          return 'info';
        default:
          return 'outline';
      }
    };
    const [advertiserDropdown, setAdvertiserDropdown] = useState<string | undefined>(undefined);
    const [brandDropdown, setBrandDropdown] = useState<string | undefined>(undefined);
    const [goalDropdown, setGoalDropdown] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    // Performance metrics for in-option offsite campaign (forecasted)
    const performanceMetrics: MetricDefinition[] = [{
      key: 'adSpend',
      label: 'Ad Spend',
      value: '$0',
      subMetric: 'Budget: $100,000',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'impressions',
      label: 'Impressions',
      value: '8,500,000',
      subMetric: 'Projected',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'clicks',
      label: 'Clicks + Add to Carts',
      value: '127,500',
      subMetric: 'Est. Add to Carts: 15,938',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'cpc',
      label: 'CPC',
      value: '$0.78',
      subMetric: 'Ad Spend / Clicks',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'ctr',
      label: 'CTR',
      value: '1.50%',
      subMetric: 'Clicks / Impressions',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'cpm',
      label: 'CPM',
      value: '$11.76',
      subMetric: 'Budget / Impressions × 1,000',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'ecpm',
      label: 'eCPM',
      value: '-',
      subMetric: 'Spend / Impressions × 1,000',
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'onlineSkuRevenue',
      label: 'Online SKU Revenue',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'onlineSkuUnits',
      label: 'Online SKU Units',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'onlineSkuConversions',
      label: 'Online SKU Conversions',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'instoreSkuRevenue',
      label: 'In-store SKU Revenue',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'instoreSkuUnits',
      label: 'In-store SKU Units',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'instoreSkuConversions',
      label: 'In-store SKU Conversions',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'totalSkuRevenue',
      label: 'Total SKU Revenue',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'totalSkuUnits',
      label: 'Total SKU Units',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }, {
      key: 'totalSkuConversions',
      label: 'Total SKU Conversions',
      value: '-',
      subMetric: \`\${conversionWindow}-day attribution\`,
      badgeValue: 'Est.',
      badgeVariant: 'secondary'
    }];
    const ForecastSection = () => <MetricRow metrics={performanceMetrics} selectedKeys={['adSpend', 'impressions', 'ctr', 'totalSkuRevenue']} maxVisible={5} defaultVariant="default" removable={true} />;
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
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
        title: 'Offsite: Summer Launch (In-option)',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        variant: 'campaign-detail',
        advertiserProps: {
          value: headerAdvertiser,
          onChange: setHeaderAdvertiser
        },
        attributionWindowProps: {
          value: conversionWindow,
          onChange: setConversionWindow
        },
        dateRangeProps: {
          dateRange: dateRange,
          onDateRangeChange: setDateRange,
          placeholder: "Select date range",
          showPresets: true
        }
      }}>
        <div className="mb-8">
          <ForecastSection />
        </div>

        <CardWithTabs className="w-full" header={activeTab === 'details' ? <form className="space-y-8 w-full max-w-2xl">
                <FormSection title="Details" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign name</label>
                      <Input placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PO Number</label>
                      <Input placeholder="Enter PO number" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Advertiser" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Advertiser</label>
                      <Input dropdown options={[{
                  label: 'Acme Media',
                  value: 'acme'
                }, {
                  label: 'BrandX',
                  value: 'brandx'
                }]} value={advertiserDropdown} onChange={setAdvertiserDropdown} placeholder="Select advertiser" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input dropdown options={[{
                  label: 'Brand 1',
                  value: 'brand1'
                }, {
                  label: 'Brand 2',
                  value: 'brand2'
                }]} value={brandDropdown} onChange={setBrandDropdown} placeholder="Select brand" />
                    </div>
                  </div>
                </FormSection>
                <FormSection title="Campaign">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Campaign Goal</label>
                      <Input dropdown options={[{
                  label: 'Awareness',
                  value: 'awareness'
                }, {
                  label: 'Engagement',
                  value: 'engagement'
                }, {
                  label: 'Conversion',
                  value: 'conversion'
                }]} value={goalDropdown} onChange={setGoalDropdown} placeholder="Select goal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Budget</label>
                      <Input placeholder="Enter budget" type="number" min="0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Run Time</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <DatePicker placeholder="Start date" date={startDate} onDateChange={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" date={endDate} onDateChange={setEndDate} />
                      </div>
                    </div>
                  </div>
                </FormSection>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </form> : null} tabs={[{
          label: 'Details',
          value: 'details',
          content: null
        }, {
          label: 'Line-items',
          value: 'line-items',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'In-option',
                value: 'In-option'
              }, {
                label: 'Running',
                value: 'Running'
              }, {
                label: 'Paused',
                value: 'Paused'
              }, {
                label: 'Stopped',
                value: 'Stopped'
              }, {
                label: 'Ready',
                value: 'Ready'
              }],
              selectedValues: lineItemStatus,
              onChange: setLineItemStatus
            }, {
              name: 'Channel',
              options: [{
                label: '3rd Party Display',
                value: '3rd Party Display'
              }, {
                label: 'Socials',
                value: 'Socials'
              }, {
                label: 'Connected TV',
                value: 'Connected TV'
              }, {
                label: '3rd Party DOOH',
                value: '3rd Party DOOH'
              }, {
                label: 'AI',
                value: 'AI'
              }, {
                label: '3rd Party Audio',
                value: '3rd Party Audio'
              }, {
                label: '3rd Party Mailing',
                value: '3rd Party Mailing'
              }],
              selectedValues: channel,
              onChange: setChannel
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search line items..." />
                  <Table columns={[{
              key: 'id',
              header: 'Line-item ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={lineItemStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'aiRecommendation',
              header: 'AI Recommendation',
              render: row => <Badge variant={row.aiRecommendation === 'Optimize Budget' ? 'warning' : 'info'}>{row.aiRecommendation}</Badge>
            }, {
              key: 'channel',
              header: 'Channel'
            }, {
              key: 'start',
              header: 'Start date',
              render: row => new Date(row.start).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'end',
              header: 'End date',
              render: row => new Date(row.end).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'adSpend',
              header: 'Ad Spend'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks + Add to Carts'
            }, {
              key: 'cpc',
              header: 'CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'cpm',
              header: 'CPM'
            }, {
              key: 'ecpm',
              header: 'eCPM'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU Units'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU Conversions'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU Units'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU Conversions'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU Units'
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU Conversions'
            }]} data={lineItemData.filter(row => {
              const statusMatch = lineItemStatus.length === 0 || lineItemStatus.includes(row.status);
              const channelMatch = channel.length === 0 || channel.includes(row.channel);
              return statusMatch && channelMatch;
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to line-item detail: \${row.name} (\${row.id})\`)} />
                </div>
        }, {
          label: 'Creatives',
          value: 'creatives',
          content: <div className="space-y-6 mt-6">
                  <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'Approved'
              }, {
                label: 'Rejected',
                value: 'Rejected'
              }, {
                label: 'Pending',
                value: 'Pending'
              }],
              selectedValues: creativeStatus,
              onChange: setCreativeStatus
            }, {
              name: 'Format',
              options: [{
                label: 'Social Media',
                value: 'Social Media'
              }, {
                label: 'Video',
                value: 'Video'
              }, {
                label: 'Audio',
                value: 'Audio'
              }, {
                label: 'Digital Out-of-Home',
                value: 'Digital Out-of-Home'
              }],
              selectedValues: creativeFormat,
              onChange: setCreativeFormat
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search creatives..." />
                  <Table columns={[{
              key: 'id',
              header: 'Creative ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={creativeStatusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'placements',
              header: 'Placements',
              render: row => <Badge variant="secondary">{row.placements}</Badge>
            }, {
              key: 'adSpend',
              header: 'Ad Spend'
            }, {
              key: 'impressions',
              header: 'Impressions'
            }, {
              key: 'clicks',
              header: 'Clicks + Add to Carts'
            }, {
              key: 'cpc',
              header: 'CPC'
            }, {
              key: 'ctr',
              header: 'CTR'
            }, {
              key: 'cpm',
              header: 'CPM'
            }, {
              key: 'ecpm',
              header: 'eCPM'
            }, {
              key: 'onlineSkuRevenue',
              header: 'Online SKU Revenue'
            }, {
              key: 'onlineSkuUnits',
              header: 'Online SKU Units'
            }, {
              key: 'onlineSkuConversions',
              header: 'Online SKU Conversions'
            }, {
              key: 'instoreSkuRevenue',
              header: 'In-store SKU Revenue'
            }, {
              key: 'instoreSkuUnits',
              header: 'In-store SKU Units'
            }, {
              key: 'instoreSkuConversions',
              header: 'In-store SKU Conversions'
            }, {
              key: 'totalSkuRevenue',
              header: 'Total SKU Revenue'
            }, {
              key: 'totalSkuUnits',
              header: 'Total SKU Units'
            }, {
              key: 'totalSkuConversions',
              header: 'Total SKU Conversions'
            }]} data={creativeData.filter(row => {
              const statusMatch = creativeStatus.length === 0 || creativeStatus.includes(row.status);
              const formatMatch = creativeFormat.length === 0 || creativeFormat.includes(row.format);
              return statusMatch && formatMatch;
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to creative detail: \${row.name} (\${row.id})\`)} />
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
                label: 'Line Item Added',
                value: 'Line Item Added'
              }, {
                label: 'Creative Uploaded',
                value: 'Creative Uploaded'
              }, {
                label: 'Channel Added',
                value: 'Channel Added'
              }, {
                label: 'Comment Added',
                value: 'Comment Added'
              }],
              selectedValues: logActions,
              onChange: setLogActions
            }]} searchValue={''} onSearchChange={() => {}} searchPlaceholder="Search logs..." />
                  <Table columns={[{
              key: 'timestamp',
              header: 'Timestamp',
              render: row => new Date(row.timestamp).toLocaleString('en-US', {
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
              render: row => <Badge variant="outline">{row.action}</Badge>
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
            })} rowKey={row => row.id} onRowClick={row => console.log(\`Navigate to log detail: \${row.action} (\${row.id})\`)} />
                </div>
        }]} action={activeTab === 'line-items' ? <Button>Add line-item</Button> : activeTab === 'creatives' ? <Button>Add creative</Button> : activeTab === 'logs' ? <Button>Export logs</Button> : null} activeTab={activeTab} onTabChange={setActiveTab} />
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...Te.parameters?.docs?.source}}};const St=["DigitalInstoreInOption","DigitalInstoreRunning","OfflineInstoreRunning","DisplayRunning","OfflineInstoreInOption","DisplayInOption","SponsoredProductsInOption","SponsoredProductsRunning","OffsiteRunning","OffsiteInOption"];export{Ve as DigitalInstoreInOption,xe as DigitalInstoreRunning,Ue as DisplayInOption,Me as DisplayRunning,Ae as OfflineInstoreInOption,De as OfflineInstoreRunning,Te as OffsiteInOption,Pe as OffsiteRunning,Ie as SponsoredProductsInOption,Le as SponsoredProductsRunning,St as __namedExportsOrder,bt as default};
