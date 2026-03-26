import{u as w,r as o,j as e,M as j}from"./iframe-C5bSqRdg.js";import{A as p,g as S}from"./theme-navigation-17KOncgO.js";import{C as B,a as i,b as k,f as r,g as n,h as l}from"./card-D9J10WQk.js";import{F as m}from"./form-section-DZL8ZSB-.js";import{I as c}from"./input-BbKIeO3x.js";import{a as R,D as P}from"./date-picker-BSwb8brm.js";import{B as s}from"./button-CMihJ9pV.js";import{T as u}from"./table-DMHr_-Qo.js";import{B as g}from"./badge-DpORWxNf.js";import"./preload-helper-PPVm8Dsz.js";import"./side-navigation-BTABV-WY.js";import"./utils-CBfrqCZ4.js";import"./render-icon-C5J9mvsf.js";import"./createLucideIcon-CkgRO_Hx.js";import"./store-DA6NizPB.js";import"./monitor-speaker-CnbWk3Lx.js";import"./users-Bz_43eCx.js";import"./trending-up-Ct__SSRy.js";import"./settings-2-BO2bzVa0.js";import"./settings-BhjJRHSG.js";import"./user-C-TKlPDM.js";import"./use-menu-B5WFxXUD.js";import"./chevron-down-BH3g__jq.js";import"./chevron-right-zSdNciVz.js";import"./dropdown-menu-BPEWRI36.js";import"./index-DD08fZIQ.js";import"./index-DAh0e16s.js";import"./index-Z2B8irzh.js";import"./index-gOg22guj.js";import"./index-DJEyZNpx.js";import"./index-D5TxnOXk.js";import"./index-BDa5FaKX.js";import"./index-4SfGeEia.js";import"./Combination-BPLtMwXH.js";import"./index-DELDvHLi.js";import"./index-C48yRfEQ.js";import"./index-7AEp8Dl6.js";import"./checkbox-DTG8_xx0.js";import"./index-squPBcRJ.js";import"./check-BliW7QYp.js";import"./circle-xaoSWTc6.js";import"./logo-CzbqsAtz.js";import"./smart-breadcrumbs-xQ-yQEDu.js";import"./breadcrumb-DCylyj0S.js";import"./default-routes-CqolUEBP.js";import"./page-header-BE690Ecl.js";import"./building-2-R1bhGwAK.js";import"./ellipsis-A7mo7Ea1.js";import"./square-pen-CqwDJzpj.js";import"./header-actions-BMmlE090.js";import"./popover-CtRsAG4M.js";import"./search-BEI7_bcP.js";import"./CategoricalChart-CHwgL6wo.js";import"./index-CCZnHES1.js";import"./LineChart-BiKNmC_Q.js";import"./ActivePoints-B42lPFi4.js";import"./LabelList-CcglBYb3.js";import"./ErrorBar-DUU192wj.js";import"./CartesianChart-CKaA2JcV.js";import"./x-Xece35A4.js";import"./chevron-left-DOa0lkhI.js";import"./index-CdJFUDDL.js";import"./chevron-up-ClDTsJEw.js";const Ue={title:"Page templates/Media Cart",component:p,parameters:{layout:"fullscreen",docs:{description:{component:`
# Media Cart Page Template

The Media Cart page template provides a shopping cart-like interface for managing selected campaigns and media products. It features a detailed campaign summary with horizontal layout and comprehensive budget tracking.

## Features

- **Campaign Summary**: Horizontal layout showing detailed campaign information
- **Budget Tracking**: Visual budget usage with progress indicators
- **Media Products Display**: Table format showing budget and ROAS per engine
- **Goal and Runtime**: Side-by-side configuration fields
- **Action Buttons**: Edit and Add to Cart functionality
- **Status Badges**: Visual status indicators with "In-option" secondary badge

## Layout Structure

### Main Content
- **Campaign Details**: Left-aligned title with right-aligned status badges
- **Configuration Row**: Goal and Runtime fields in horizontal layout
- **Media Products Table**: Budget and estimated ROAS per media product
- **Campaign Summary Panel**: Budget metrics with usage visualization

### Interactive Elements
- **Goal Selection**: Dropdown with predefined options
- **Runtime Picker**: Date range selection with calendar interface
- **Budget Display**: Visual progress bar showing budget utilization
- **Action Buttons**: Edit (outline) and Add to Cart (primary) buttons

## Sample Data

The template includes realistic campaign data with:
- **Budget**: $18,000 total budget
- **Used Budget**: $1,200 (7% utilization)
- **Total Price**: $19,500
- **Estimated ROAS**: 4.5x
- **Media Products**: Display and Sponsored products with individual budgets

## Use Cases

This template is ideal for:
- Campaign shopping cart functionality
- Media product selection interface
- Budget planning and visualization
- Campaign configuration before purchase
- Pre-approval campaign review

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- CampaignSummary (horizontal layout with full feature set)
- Badge (status indicators)
- Input (dropdown for goal selection)
- DateRangePicker (runtime configuration)
- Button (action buttons)
        `}}},tags:["autodocs"]},A=[{id:"D-001",name:"Premium Banner Placement",brand:"Coca-Cola",budget:"$3,000",roas:"4.2x",status:"Active"},{id:"D-002",name:"Mobile App Ads",brand:"Nike",budget:"$2,500",roas:"4.8x",status:"Active"},{id:"D-003",name:"Video Interstitials",brand:"Samsung",budget:"$3,500",roas:"4.5x",status:"Pending"}],D=[{id:"S-001",name:"Search Result Placement",brand:"Amazon Basics",budget:"$4,000",roas:"5.1x",status:"Active"},{id:"S-002",name:"Product Page Ads",brand:"Unilever",budget:"$3,000",roas:"4.3x",status:"Active"},{id:"S-003",name:"Category Spotlight",brand:"P&G",budget:"$2,000",roas:"4.7x",status:"Active"}],t={title:"AI performance campaign, week 1-4",goal:"performance-transaction",goalOptions:[{label:"Performance on transaction",value:"performance-transaction"},{label:"Brand awareness",value:"brand-awareness"},{label:"Lead generation",value:"lead-generation"},{label:"Customer acquisition",value:"customer-acquisition"},{label:"Retargeting",value:"retargeting"}],estimatedRoas:"4.5x",budget:"$18,000",usedBudget:"$1,200",totalPrice:"$1,260",budgetUsagePercentage:7,dateRange:{from:new Date("2023-12-31"),to:R(new Date("2023-12-31"),31)}},d={render:()=>{const{theme:v}=w(),x=S(v||"retailMedia"),[h,f]=o.useState(t.goal),[b,N]=o.useState(t.dateRange),[y,C]=o.useState(14);return e.jsx(j,{children:e.jsx(p,{routes:x,logo:{src:"/gambit-logo.svg",alt:"Gambit Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Media Cart",subtitle:"Review and configure your selected campaigns before adding to cart",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked"),headerRight:null},children:e.jsx("div",{className:"flex flex-1 flex-col",children:e.jsx("div",{className:"flex flex-1 flex-col gap-2",children:e.jsx("div",{className:"flex flex-col gap-4 md:gap-6",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsx("div",{className:"lg:col-span-2 min-w-0",children:e.jsxs(B,{className:"min-w-0",children:[e.jsxs(i,{className:"space-y-8",children:[e.jsx(m,{title:"Campaign details",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-2",children:"Goal*"}),e.jsx(c,{dropdown:!0,options:t.goalOptions,value:h,onChange:f,placeholder:"Select goal",className:"w-full"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-2",children:"Budget"}),e.jsx(c,{value:t.budget,placeholder:"Enter budget",className:"w-full",readOnly:!0})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-2",children:"Run time*"}),e.jsx(P,{dateRange:b,onDateRangeChange:N,placeholder:"Select campaign dates with conversion window",className:"w-full bg-slate-50 border-slate-200",showPresets:!0,showConversionWindow:!0,conversionWindow:y,onConversionWindowChange:C})]})]})}),e.jsx(m,{title:"Display Engine",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-muted-foreground",children:"Budget"}),e.jsx("div",{className:"text-lg font-semibold",children:"$9,000"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-muted-foreground",children:"Est. ROAS"}),e.jsx("div",{className:"text-lg font-semibold text-green-600",children:"4.5x"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-sm font-medium",children:"Media Products"}),e.jsx(u,{columns:[{key:"name",header:"Name"},{key:"brand",header:"Brand"},{key:"budget",header:"Budget"},{key:"roas",header:"ROAS"},{key:"status",header:"Status",render:a=>e.jsx(g,{variant:a.status==="Active"?"default":"secondary",children:a.status})}],data:A,rowKey:a=>a.id,hideActions:!0,onRowClick:a=>console.log("Navigate to line item:",a.name)})]}),e.jsx("div",{className:"pt-2",children:e.jsx(s,{variant:"outline",onClick:()=>console.log("Edit Display Engine"),children:"Edit"})})]})}),e.jsx(m,{title:"Sponsored Products Engine",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-muted-foreground",children:"Budget"}),e.jsx("div",{className:"text-lg font-semibold",children:"$9,000"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-muted-foreground",children:"Est. ROAS"}),e.jsx("div",{className:"text-lg font-semibold text-green-600",children:"4.5x"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-sm font-medium",children:"Media Products"}),e.jsx(u,{columns:[{key:"name",header:"Name"},{key:"brand",header:"Brand"},{key:"budget",header:"Budget"},{key:"roas",header:"ROAS"},{key:"status",header:"Status",render:a=>e.jsx(g,{variant:a.status==="Active"?"default":"secondary",children:a.status})}],data:D,rowKey:a=>a.id,hideActions:!0,onRowClick:a=>console.log("Navigate to line item:",a.name)})]}),e.jsx("div",{className:"pt-2",children:e.jsx(s,{variant:"outline",onClick:()=>console.log("Edit Sponsored Products Engine"),children:"Edit"})})]})})]}),e.jsx(k,{children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(s,{variant:"outline",children:"Cancel"}),e.jsx(s,{children:"Proceed to Launch"})]})})]})}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(r,{children:[e.jsx(i,{children:e.jsx(n,{children:"Campaign Summary"})}),e.jsxs(l,{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Campaign"}),e.jsx("div",{className:"font-medium",children:t.title})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Status"}),e.jsx("div",{className:"font-medium",children:"Best ROAS • In-option"})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Goal"}),e.jsx("div",{className:"font-medium",children:"Performance on transaction"})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Runtime"}),e.jsx("div",{className:"font-medium",children:"Dec 31, 2023 - Jan 31, 2024"})]})]})]}),e.jsxs(r,{children:[e.jsx(i,{children:e.jsx(n,{children:"Budget Overview"})}),e.jsxs(l,{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Total Budget"}),e.jsx("div",{className:"font-medium",children:t.budget})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Used Budget"}),e.jsx("div",{className:"font-medium",children:t.usedBudget})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Total Price"}),e.jsx("div",{className:"font-medium",children:t.totalPrice})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Budget Usage"}),e.jsxs("div",{className:"font-medium",children:[t.budgetUsagePercentage,"%"]}),e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2 mt-1",children:e.jsx("div",{className:"h-2 rounded-full bg-green-500 transition-all",style:{width:`${t.budgetUsagePercentage}%`}})})]})]})]}),e.jsxs(r,{children:[e.jsx(i,{children:e.jsx(n,{children:"Performance"})}),e.jsxs(l,{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Est. ROAS"}),e.jsx("div",{className:"font-medium text-green-600",children:t.estimatedRoas})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Media Products"}),e.jsx("div",{className:"font-medium",children:"2 engines enabled"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-[14px] text-muted-foreground",children:"Features"}),e.jsx("div",{className:"font-medium",children:"Auto bidding, Goal-based placement"})]})]})]})]})]})})})})})})},parameters:{docs:{description:{story:`
# Media Cart Interface

This story demonstrates the Media Cart page template with a single campaign in horizontal layout. The interface provides:

## Key Features

- **Detailed Campaign Review**: Full horizontal CampaignSummary with all configuration options
- **Budget Visualization**: Low budget usage example (7%) with green progress indicator
- **Media Products Overview**: Display and Sponsored products with budget allocation
- **Interactive Configuration**: Goal selection and runtime configuration
- **Shopping Cart Actions**: Edit and Add to Cart buttons for user actions

## Campaign Details

- **Campaign**: AI performance campaign, week 1-4
- **Status**: Best ROAS badge with In-option secondary badge
- **Budget**: $18,000 total with only $1,200 used (7% utilization)
- **ROAS**: 4.5x estimated return on ad spend
- **Media Products**: Display and Sponsored products enabled
- **Runtime**: January 2024 campaign dates

## Usage Context

This template is perfect for:
- E-commerce style campaign selection
- Campaign configuration before purchase
- Budget review and approval workflows
- Media product comparison and selection
- Pre-order campaign management

The horizontal layout provides maximum detail while maintaining a clean, professional shopping cart experience.
        `}}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [goal, setGoal] = React.useState(campaignData.goal);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(campaignData.dateRange);
    const [conversionWindow, setConversionWindow] = React.useState<number>(14);
    return <MenuContextProvider>
        <AppLayout routes={routes} logo={{
        src: '/gambit-logo.svg',
        alt: 'Gambit Logo',
        width: 40,
        height: 40
      }} user={{
        name: 'Jane Doe',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32'
      }} onLogout={() => alert('Logout clicked')} breadcrumbProps={{
        namespace: ''
      }} pageHeaderProps={{
        title: 'Media Cart',
        subtitle: 'Review and configure your selected campaigns before adding to cart',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked'),
        headerRight: null
      }}>
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 min-w-0">
                    <Card className="min-w-0">
                      <CardHeader className="space-y-8">
                        <FormSection title="Campaign details">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Goal*</label>
                                <Input dropdown options={campaignData.goalOptions} value={goal} onChange={setGoal} placeholder="Select goal" className="w-full" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Budget</label>
                                <Input value={campaignData.budget} placeholder="Enter budget" className="w-full" readOnly />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Run time*</label>
                              <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Select campaign dates with conversion window" className="w-full bg-slate-50 border-slate-200" showPresets={true} showConversionWindow={true} conversionWindow={conversionWindow} onConversionWindowChange={setConversionWindow} />
                            </div>
                          </div>
                        </FormSection>

                        {/* Display Engine Card */}
                        <FormSection title="Display Engine">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Budget</div>
                                <div className="text-lg font-semibold">$9,000</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Est. ROAS</div>
                                <div className="text-lg font-semibold text-green-600">4.5x</div>
                              </div>
                            </div>

                            {/* Media Products Table */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Media Products</label>
                              <Table columns={[{
                              key: 'name',
                              header: 'Name'
                            }, {
                              key: 'brand',
                              header: 'Brand'
                            }, {
                              key: 'budget',
                              header: 'Budget'
                            }, {
                              key: 'roas',
                              header: 'ROAS'
                            }, {
                              key: 'status',
                              header: 'Status',
                              render: row => <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                                        {row.status}
                                      </Badge>
                            }]} data={displayLineItems} rowKey={row => row.id} hideActions onRowClick={row => console.log('Navigate to line item:', row.name)} />
                            </div>

                            {/* Edit Button */}
                            <div className="pt-2">
                              <Button variant="outline" onClick={() => console.log('Edit Display Engine')}>
                                Edit
                              </Button>
                            </div>
                          </div>
                        </FormSection>

                        {/* Sponsored Products Engine Card */}
                        <FormSection title="Sponsored Products Engine">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Budget</div>
                                <div className="text-lg font-semibold">$9,000</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Est. ROAS</div>
                                <div className="text-lg font-semibold text-green-600">4.5x</div>
                              </div>
                            </div>

                            {/* Media Products Table */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Media Products</label>
                              <Table columns={[{
                              key: 'name',
                              header: 'Name'
                            }, {
                              key: 'brand',
                              header: 'Brand'
                            }, {
                              key: 'budget',
                              header: 'Budget'
                            }, {
                              key: 'roas',
                              header: 'ROAS'
                            }, {
                              key: 'status',
                              header: 'Status',
                              render: row => <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                                        {row.status}
                                      </Badge>
                            }]} data={sponsoredLineItems} rowKey={row => row.id} hideActions onRowClick={row => console.log('Navigate to line item:', row.name)} />
                            </div>

                            {/* Edit Button */}
                            <div className="pt-2">
                              <Button variant="outline" onClick={() => console.log('Edit Sponsored Products Engine')}>
                                Edit
                              </Button>
                            </div>
                          </div>
                        </FormSection>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button>Proceed to Launch</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="flex flex-col gap-4">
                    <CardSummary>
                      <CardHeader>
                        <CardSummaryTitle>Campaign Summary</CardSummaryTitle>
                      </CardHeader>
                      <CardSummaryContent>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Campaign</div>
                          <div className="font-medium">{campaignData.title}</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Status</div>
                          <div className="font-medium">Best ROAS • In-option</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Goal</div>
                          <div className="font-medium">Performance on transaction</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Runtime</div>
                          <div className="font-medium">Dec 31, 2023 - Jan 31, 2024</div>
                        </div>
                      </CardSummaryContent>
                    </CardSummary>

                    <CardSummary>
                      <CardHeader>
                        <CardSummaryTitle>Budget Overview</CardSummaryTitle>
                      </CardHeader>
                      <CardSummaryContent>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Total Budget</div>
                          <div className="font-medium">{campaignData.budget}</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Used Budget</div>
                          <div className="font-medium">{campaignData.usedBudget}</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Total Price</div>
                          <div className="font-medium">{campaignData.totalPrice}</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Budget Usage</div>
                          <div className="font-medium">{campaignData.budgetUsagePercentage}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="h-2 rounded-full bg-green-500 transition-all" style={{
                            width: \`\${campaignData.budgetUsagePercentage}%\`
                          }} />
                          </div>
                        </div>
                      </CardSummaryContent>
                    </CardSummary>

                    <CardSummary>
                      <CardHeader>
                        <CardSummaryTitle>Performance</CardSummaryTitle>
                      </CardHeader>
                      <CardSummaryContent>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Est. ROAS</div>
                          <div className="font-medium text-green-600">{campaignData.estimatedRoas}</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[14px] text-muted-foreground">Media Products</div>
                          <div className="font-medium">2 engines enabled</div>
                        </div>
                        <div>
                          <div className="text-[14px] text-muted-foreground">Features</div>
                          <div className="font-medium">Auto bidding, Goal-based placement</div>
                        </div>
                      </CardSummaryContent>
                    </CardSummary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppLayout>
      </MenuContextProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
# Media Cart Interface

This story demonstrates the Media Cart page template with a single campaign in horizontal layout. The interface provides:

## Key Features

- **Detailed Campaign Review**: Full horizontal CampaignSummary with all configuration options
- **Budget Visualization**: Low budget usage example (7%) with green progress indicator
- **Media Products Overview**: Display and Sponsored products with budget allocation
- **Interactive Configuration**: Goal selection and runtime configuration
- **Shopping Cart Actions**: Edit and Add to Cart buttons for user actions

## Campaign Details

- **Campaign**: AI performance campaign, week 1-4
- **Status**: Best ROAS badge with In-option secondary badge
- **Budget**: $18,000 total with only $1,200 used (7% utilization)
- **ROAS**: 4.5x estimated return on ad spend
- **Media Products**: Display and Sponsored products enabled
- **Runtime**: January 2024 campaign dates

## Usage Context

This template is perfect for:
- E-commerce style campaign selection
- Campaign configuration before purchase
- Budget review and approval workflows
- Media product comparison and selection
- Pre-order campaign management

The horizontal layout provides maximum detail while maintaining a clean, professional shopping cart experience.
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};const He=["MediaCart"];export{d as MediaCart,He as __namedExportsOrder,Ue as default};
