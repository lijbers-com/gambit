import{j as e,r as l}from"./iframe-DIN2IKqe.js";import{R as o,f as d,a as c,b as h,c as u,d as g,e as m,g as C,h as y}from"./right-drawer-BTC-FKGk.js";import{B as t}from"./button-B9Y0ZSwa.js";import{V as j}from"./viewbar-njMP8UEJ.js";import{F as B}from"./filter-bar-sbO9NQiI.js";import{T as f}from"./table-j0AjTCp9.js";import{B as n}from"./badge-BDRNArob.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B5OJPJ_8.js";import"./index-DywWKZUd.js";import"./index-DjuRppva.js";import"./index-C8pd1VWv.js";import"./index-D93m9KRt.js";import"./index-BrN91Rgp.js";import"./index-X7hHvCXq.js";import"./Combination-B4vWFPwN.js";import"./index-Br6PxJxS.js";import"./index-vD8Qkz52.js";import"./utils-CBfrqCZ4.js";import"./x-B-NQcBKM.js";import"./createLucideIcon-Buzyb9Q7.js";import"./index-CdJFUDDL.js";import"./tabs-BOfVHh0v.js";import"./index-Du2gMQwv.js";import"./filter-CKw524Wp.js";import"./popover-2KUBjTNn.js";import"./index-BEqAkVqP.js";import"./index-DNa-te7d.js";import"./checkbox-C34OBCE9.js";import"./index-BCdNlN2L.js";import"./check-DcQhNYtI.js";import"./search-BKytZcvT.js";import"./store-Dc94NX38.js";import"./search-input-D2TAlW-3.js";import"./input-Byogsn8g.js";import"./dropdown-menu-dbnqWaiD.js";import"./circle-DmMWJKS7.js";import"./chevron-right-CUD2C_lr.js";import"./chevron-down-Rsxw0oJ3.js";import"./ellipsis-DXKMKTiW.js";import"./chevron-up-ir_nW-fh.js";const ve={title:"UI/Right Drawer",component:o,parameters:{layout:"fullscreen",docs:{description:{component:`
# Right Drawer Component

A drawer component that slides in from the right side of the viewport. Built on top of Vaul drawer primitive with custom styling and layout for right-side presentation.

## Features

- **Right-side slide**: Slides in from the right side instead of bottom
- **Responsive width**: Full width on mobile, max 2xl width on desktop
- **Built-in close button**: X button in the top-right corner
- **Flexible content**: Can contain any components like ViewBar, FilterBar, Tables
- **Scrollable body**: Content area scrolls when content overflows
- **Overlay backdrop**: Dark overlay behind the drawer
- **Smooth animations**: CSS transitions for open/close states

## Usage

Perfect for detailed views, filters, forms, or any content that needs to slide in from the side without navigating away from the current page.

### Basic Usage
\`\`\`tsx
<RightDrawer>
  <RightDrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </RightDrawerTrigger>
  <RightDrawerContent>
    <RightDrawerHeader>
      <RightDrawerTitle>Title</RightDrawerTitle>
      <RightDrawerDescription>Description</RightDrawerDescription>
    </RightDrawerHeader>
    <RightDrawerBody>
      Content goes here
    </RightDrawerBody>
  </RightDrawerContent>
</RightDrawer>
\`\`\`

### With Components
\`\`\`tsx
<RightDrawerBody>
  <div className="space-y-6">
    <Viewbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    <FilterBar filters={filters} />
    <Table columns={columns} data={data} />
  </div>
</RightDrawerBody>
\`\`\`

## Components

- **RightDrawer**: Main container component
- **RightDrawerTrigger**: Element that opens the drawer
- **RightDrawerContent**: Drawer content container
- **RightDrawerHeader**: Header with title, description and close button
- **RightDrawerTitle**: Drawer title
- **RightDrawerDescription**: Drawer description/subtitle
- **RightDrawerBody**: Scrollable content area
- **RightDrawerFooter**: Footer for actions
- **RightDrawerClose**: Close trigger component

## Design Notes

- Width: Full width on mobile, max 2xl (672px) on desktop
- Header includes automatic close button (can be disabled)
- Body area is scrollable for long content
- Follows design system spacing and typography
        `}}},argTypes:{shouldScaleBackground:{control:"boolean",description:"Whether to scale the background when drawer opens"}},tags:["autodocs"]},F=[{value:"campaigns",label:"Campaigns"},{value:"bookings",label:"Bookings"},{value:"creatives",label:"Creatives"}],V=[{name:"Status",options:[{label:"Running",value:"running"},{label:"Paused",value:"paused"},{label:"Completed",value:"completed"}],selectedValues:[],onChange:()=>{}},{name:"Brand",options:[{label:"Coca Cola",value:"coca-cola"},{label:"Nike",value:"nike"},{label:"Apple",value:"apple"}],selectedValues:[],onChange:()=>{}}],k=[{id:"2023-86527",status:"Running",brand:"Coca Cola",mediaProduct:"Package M",planned:"100",booked:"100"},{id:"2023-86528",status:"Paused",brand:"Nike",mediaProduct:"Digital Display",planned:"150",booked:"120"},{id:"2023-86529",status:"Running",brand:"Apple",mediaProduct:"Audio Ads",planned:"200",booked:"200"},{id:"2023-86530",status:"Completed",brand:"Samsung",mediaProduct:"Sponsored Products",planned:"80",booked:"75"},{id:"2023-86531",status:"Running",brand:"McDonald's",mediaProduct:"In-Store Digital",planned:"300",booked:"280"}],T=s=>{switch(s){case"Running":return"default";case"Paused":return"secondary";case"Completed":return"outline";default:return"outline"}},p={render:()=>e.jsx("div",{className:"p-8",children:e.jsxs(o,{children:[e.jsx(d,{asChild:!0,children:e.jsx(t,{children:"Open Right Drawer"})}),e.jsxs(c,{children:[e.jsxs(h,{children:[e.jsx(u,{children:"Campaign Details"}),e.jsx(g,{children:"01 Dec, 2023 - 01 Feb, 2024"})]}),e.jsx(m,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"This is the basic right drawer example. Content slides in from the right side of the screen."}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Campaign Information"}),e.jsxs("div",{className:"grid gap-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Campaign ID:"}),e.jsx("span",{children:"2023-86527"})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Status:"}),e.jsx(n,{variant:"default",children:"Running"})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Brand:"}),e.jsx("span",{children:"Coca Cola"})]})]})]})]})}),e.jsxs(C,{children:[e.jsx(t,{children:"Save Changes"}),e.jsx(y,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Cancel"})})]})]})]})})},w={render:()=>{const[s,i]=l.useState("campaigns"),[v,R]=l.useState(V);return e.jsx("div",{className:"p-8",children:e.jsxs(o,{children:[e.jsx(d,{asChild:!0,children:e.jsx(t,{children:"Open Drawer with Components"})}),e.jsxs(c,{children:[e.jsxs(h,{children:[e.jsx(u,{children:"Dranken Campaign"}),e.jsx(g,{children:"01 Dec, 2023 - 01 Feb, 2024"})]}),e.jsx(m,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(j,{tabs:F,activeTab:s,onTabChange:i,labels:[{label:"Chocomel",color:"default"},{label:"Running + 4 more",color:"success"}]}),e.jsx(B,{filters:v,hideSearch:!0}),e.jsx(f,{columns:[{key:"id",header:"ID"},{key:"status",header:"Status",render:a=>e.jsx(n,{variant:T(a.status),children:a.status})},{key:"brand",header:"Brand"},{key:"mediaProduct",header:"Media Product"},{key:"planned",header:"Planned",render:a=>e.jsx(n,{variant:"secondary",children:a.planned})},{key:"booked",header:"Booked",render:a=>e.jsx(n,{variant:"secondary",children:a.booked})}],data:k,rowKey:a=>a.id})]})})]})]})})}},D={render:()=>e.jsx("div",{className:"p-8",children:e.jsxs(o,{children:[e.jsx(d,{asChild:!0,children:e.jsx(t,{children:"Open Scrollable Drawer"})}),e.jsxs(c,{children:[e.jsxs(h,{children:[e.jsx(u,{children:"Long Content Example"}),e.jsx(g,{children:"This drawer demonstrates scrollable content"})]}),e.jsx(m,{children:e.jsx("div",{className:"space-y-6",children:Array.from({length:20},(s,i)=>e.jsxs("div",{className:"p-4 border rounded-lg",children:[e.jsxs("h4",{className:"font-medium mb-2",children:["Content Block ",i+1]}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This is a content block to demonstrate scrollable content in the drawer. The drawer body will scroll when content exceeds the available height."})]},i))})})]})]})})},b={render:()=>e.jsx("div",{className:"p-8",children:e.jsxs(o,{children:[e.jsx(d,{asChild:!0,children:e.jsx(t,{children:"Open Without Close Button"})}),e.jsxs(c,{children:[e.jsxs(h,{showCloseButton:!1,children:[e.jsx(u,{children:"Custom Close Handling"}),e.jsx(g,{children:"Close button hidden, use custom controls"})]}),e.jsx(m,{children:e.jsx("div",{className:"space-y-4",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"This drawer has the close button hidden in the header. You can implement custom close logic."})})}),e.jsx(C,{children:e.jsx(y,{asChild:!0,children:e.jsx(t,{children:"Done"})})})]})]})})},x={render:()=>{const[s,i]=l.useState("campaigns"),[v,R]=l.useState([]),[a,N]=l.useState([]),S=[{name:"Status",options:[{label:"Running",value:"running"},{label:"Paused",value:"paused"},{label:"Completed",value:"completed"}],selectedValues:v,onChange:R},{name:"Brand",options:[{label:"Coca Cola",value:"coca-cola"},{label:"Nike",value:"nike"},{label:"Apple",value:"apple"},{label:"Samsung",value:"samsung"},{label:"McDonald's",value:"mcdonalds"}],selectedValues:a,onChange:N}];return e.jsxs("div",{className:"p-8 space-y-4",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"This example replicates the design from the provided image with all components integrated."}),e.jsxs(o,{children:[e.jsx(d,{asChild:!0,children:e.jsx(t,{children:"Open Dranken Campaign"})}),e.jsxs(c,{children:[e.jsxs(h,{children:[e.jsx(u,{children:"Dranken"}),e.jsx(g,{children:"01 Dec, 2023 - 01 Feb, 2024"})]}),e.jsx(m,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(j,{tabs:[{value:"campaigns",label:"Campaigns"},{value:"bookings",label:"Bookings"},{value:"creatives",label:"Creatives"}],activeTab:s,onTabChange:i,labels:[{label:"Chocomel",color:"default"},{label:"Running + 4 more",color:"success"}]}),e.jsx(B,{filters:S,hideSearch:!0}),e.jsx(f,{columns:[{key:"id",header:"ID"},{key:"status",header:"Status",render:r=>e.jsx(n,{variant:T(r.status),children:r.status})},{key:"brand",header:"Brand"},{key:"mediaProduct",header:"Media Product"},{key:"planned",header:"Planned",render:r=>e.jsx(n,{variant:"secondary",children:r.planned})},{key:"booked",header:"Booked",render:r=>e.jsx(n,{variant:"secondary",children:r.booked})}],data:k,rowKey:r=>r.id}),e.jsx("div",{className:"flex justify-end",children:e.jsx(t,{variant:"ghost",className:"text-sm",children:"See all"})})]})})]})]})]})}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8">
      <RightDrawer>
        <RightDrawerTrigger asChild>
          <Button>Open Right Drawer</Button>
        </RightDrawerTrigger>
        <RightDrawerContent>
          <RightDrawerHeader>
            <RightDrawerTitle>Campaign Details</RightDrawerTitle>
            <RightDrawerDescription>
              01 Dec, 2023 - 01 Feb, 2024
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                This is the basic right drawer example. Content slides in from the right side of the screen.
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Campaign Information</h4>
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Campaign ID:</span>
                    <span>2023-86527</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Brand:</span>
                    <span>Coca Cola</span>
                  </div>
                </div>
              </div>
            </div>
          </RightDrawerBody>
          <RightDrawerFooter>
            <Button>Save Changes</Button>
            <RightDrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </RightDrawerClose>
          </RightDrawerFooter>
        </RightDrawerContent>
      </RightDrawer>
    </div>
}`,...p.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeView, setActiveView] = useState('campaigns');
    const [filters, setFilters] = useState(filterOptions);
    return <div className="p-8">
        <RightDrawer>
          <RightDrawerTrigger asChild>
            <Button>Open Drawer with Components</Button>
          </RightDrawerTrigger>
          <RightDrawerContent>
            <RightDrawerHeader>
              <RightDrawerTitle>Dranken Campaign</RightDrawerTitle>
              <RightDrawerDescription>
                01 Dec, 2023 - 01 Feb, 2024
              </RightDrawerDescription>
            </RightDrawerHeader>
            <RightDrawerBody>
              <div className="space-y-6">
                <Viewbar tabs={viewTabs} activeTab={activeView} onTabChange={setActiveView} labels={[{
                label: 'Chocomel',
                color: 'default'
              }, {
                label: 'Running + 4 more',
                color: 'success'
              }]} />
                
                <FilterBar filters={filters} hideSearch={true} />
                
                <Table columns={[{
                key: 'id',
                header: 'ID'
              }, {
                key: 'status',
                header: 'Status',
                render: (row: any) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              }, {
                key: 'brand',
                header: 'Brand'
              }, {
                key: 'mediaProduct',
                header: 'Media Product'
              }, {
                key: 'planned',
                header: 'Planned',
                render: (row: any) => <Badge variant="secondary">{row.planned}</Badge>
              }, {
                key: 'booked',
                header: 'Booked',
                render: (row: any) => <Badge variant="secondary">{row.booked}</Badge>
              }]} data={tableData} rowKey={(row: any) => row.id} />
              </div>
            </RightDrawerBody>
          </RightDrawerContent>
        </RightDrawer>
      </div>;
  }
}`,...w.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8">
      <RightDrawer>
        <RightDrawerTrigger asChild>
          <Button>Open Scrollable Drawer</Button>
        </RightDrawerTrigger>
        <RightDrawerContent>
          <RightDrawerHeader>
            <RightDrawerTitle>Long Content Example</RightDrawerTitle>
            <RightDrawerDescription>
              This drawer demonstrates scrollable content
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-6">
              {Array.from({
              length: 20
            }, (_, i) => <div key={i} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Content Block {i + 1}</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a content block to demonstrate scrollable content in the drawer. 
                    The drawer body will scroll when content exceeds the available height.
                  </p>
                </div>)}
            </div>
          </RightDrawerBody>
        </RightDrawerContent>
      </RightDrawer>
    </div>
}`,...D.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8">
      <RightDrawer>
        <RightDrawerTrigger asChild>
          <Button>Open Without Close Button</Button>
        </RightDrawerTrigger>
        <RightDrawerContent>
          <RightDrawerHeader showCloseButton={false}>
            <RightDrawerTitle>Custom Close Handling</RightDrawerTitle>
            <RightDrawerDescription>
              Close button hidden, use custom controls
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This drawer has the close button hidden in the header. You can implement custom close logic.
              </p>
            </div>
          </RightDrawerBody>
          <RightDrawerFooter>
            <RightDrawerClose asChild>
              <Button>Done</Button>
            </RightDrawerClose>
          </RightDrawerFooter>
        </RightDrawerContent>
      </RightDrawer>
    </div>
}`,...b.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeView, setActiveView] = useState('campaigns');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const filters = [{
      name: 'Status',
      options: [{
        label: 'Running',
        value: 'running'
      }, {
        label: 'Paused',
        value: 'paused'
      }, {
        label: 'Completed',
        value: 'completed'
      }],
      selectedValues: statusFilter,
      onChange: setStatusFilter
    }, {
      name: 'Brand',
      options: [{
        label: 'Coca Cola',
        value: 'coca-cola'
      }, {
        label: 'Nike',
        value: 'nike'
      }, {
        label: 'Apple',
        value: 'apple'
      }, {
        label: 'Samsung',
        value: 'samsung'
      }, {
        label: 'McDonald\\'s',
        value: 'mcdonalds'
      }],
      selectedValues: brandFilter,
      onChange: setBrandFilter
    }];
    return <div className="p-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          This example replicates the design from the provided image with all components integrated.
        </p>
        
        <RightDrawer>
          <RightDrawerTrigger asChild>
            <Button>Open Dranken Campaign</Button>
          </RightDrawerTrigger>
          <RightDrawerContent>
            <RightDrawerHeader>
              <RightDrawerTitle>Dranken</RightDrawerTitle>
              <RightDrawerDescription>
                01 Dec, 2023 - 01 Feb, 2024
              </RightDrawerDescription>
            </RightDrawerHeader>
            <RightDrawerBody>
              <div className="space-y-6">
                {/* ViewBar with tabs and labels */}
                <Viewbar tabs={[{
                value: 'campaigns',
                label: 'Campaigns'
              }, {
                value: 'bookings',
                label: 'Bookings'
              }, {
                value: 'creatives',
                label: 'Creatives'
              }]} activeTab={activeView} onTabChange={setActiveView} labels={[{
                label: 'Chocomel',
                color: 'default'
              }, {
                label: 'Running + 4 more',
                color: 'success'
              }]} />
                
                {/* FilterBar */}
                <FilterBar filters={filters} hideSearch={true} />
                
                {/* Table with campaign data */}
                <Table columns={[{
                key: 'id',
                header: 'ID'
              }, {
                key: 'status',
                header: 'Status',
                render: (row: any) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              }, {
                key: 'brand',
                header: 'Brand'
              }, {
                key: 'mediaProduct',
                header: 'Media Product'
              }, {
                key: 'planned',
                header: 'Planned',
                render: (row: any) => <Badge variant="secondary">{row.planned}</Badge>
              }, {
                key: 'booked',
                header: 'Booked',
                render: (row: any) => <Badge variant="secondary">{row.booked}</Badge>
              }]} data={tableData} rowKey={(row: any) => row.id} />
                
                {/* See all button */}
                <div className="flex justify-end">
                  <Button variant="ghost" className="text-sm">
                    See all
                  </Button>
                </div>
              </div>
            </RightDrawerBody>
          </RightDrawerContent>
        </RightDrawer>
      </div>;
  }
}`,...x.parameters?.docs?.source}}};const Re=["Default","WithViewBarAndFilters","WithScrollableContent","WithoutCloseButton","FullExample"];export{p as Default,x as FullExample,D as WithScrollableContent,w as WithViewBarAndFilters,b as WithoutCloseButton,Re as __namedExportsOrder,ve as default};
