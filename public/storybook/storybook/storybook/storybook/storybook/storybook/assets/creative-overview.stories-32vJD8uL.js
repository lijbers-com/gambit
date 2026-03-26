import{u as w,r as i,j as t,M as S}from"./iframe-DvKL0w_9.js";import{A as c,g as D}from"./theme-navigation-CKTKm05e.js";import{C as k,a as I,b as L}from"./card-BlwAoG0h.js";import{T}from"./table-C7y9lzDb.js";import{B as d}from"./badge-CxTz6Abc.js";import{F as P}from"./filter-bar-DMUjQTHM.js";import"./preload-helper-PPVm8Dsz.js";import"./side-navigation-BTBJFULY.js";import"./utils-CBfrqCZ4.js";import"./render-icon-kB-A0JQq.js";import"./createLucideIcon-DN8XCnB-.js";import"./store-CQtbaQZT.js";import"./monitor-speaker-DY4dhsgN.js";import"./users-C587xWqs.js";import"./trending-up-B-v9wpFO.js";import"./settings-2-DkDxpgQK.js";import"./settings-z7_OPcN8.js";import"./user-CUEFPk3f.js";import"./use-menu-lxpwdHl9.js";import"./chevron-down-NXkMBHE3.js";import"./chevron-right-CHIBhS7m.js";import"./dropdown-menu-D5IgHDJS.js";import"./index-DH-oRreP.js";import"./index-zjPiqC4D.js";import"./index-c8TczyEf.js";import"./index-COxQYZsJ.js";import"./index-cUSCOmKM.js";import"./index-CF5fDaZW.js";import"./index-DnLl3Ei0.js";import"./index-DHx-W8w9.js";import"./Combination-B-jfCMot.js";import"./index-4d8l3FI2.js";import"./index-BQ0gwhW0.js";import"./index-CGKGO6yD.js";import"./checkbox--WHKG7t-.js";import"./index-Ud09Nppy.js";import"./check-Cmreq_tW.js";import"./circle-DwGOr8Je.js";import"./logo-Cse3cXZO.js";import"./smart-breadcrumbs--AzVLQcp.js";import"./breadcrumb-D04Vjr9R.js";import"./button-oxyhV2g6.js";import"./index-CdJFUDDL.js";import"./default-routes-CqolUEBP.js";import"./page-header-DG9mgAKW.js";import"./building-2-C44QEb30.js";import"./date-picker-CL7M1Iap.js";import"./chevron-left-DjhSkhjd.js";import"./popover-j87nmUjH.js";import"./ellipsis-BDSGhZCK.js";import"./square-pen-BwRaBdr7.js";import"./header-actions-B7eTecaK.js";import"./search-Dpj4_yN2.js";import"./CategoricalChart-CXUfibb_.js";import"./index-BNw0aX4h.js";import"./LineChart-DcnkC8MV.js";import"./ActivePoints-DVkQZuaJ.js";import"./LabelList-yszl33Na.js";import"./ErrorBar-DeuvW3zE.js";import"./CartesianChart-SWwegQ-C.js";import"./chevron-up-BIkku3he.js";import"./filter-L7NEj-xr.js";import"./x-DXIOgXXH.js";import"./search-input-A57EVLBS.js";import"./input-CBnomjHd.js";const ze={title:"Page templates/Creative Overview",component:c,parameters:{layout:"fullscreen",docs:{description:{component:`
# Creative Overview Page Template

The Creative Overview page template provides a comprehensive view of all creative assets with advanced filtering and search capabilities. It serves as the main creative management interface for media partners.

## Features

- **Data Table**: Displays creative information in a sortable, filterable table format
- **Triple Filtering**: Multi-select filters for Status, Type, and Format
- **Advanced Search**: Real-time search across creative names, campaigns, and IDs
- **Status Badges**: Visual indicators for creative approval status
- **Type Badges**: Visual indicators for creative types (Display, Digital In-Store, etc.)
- **Click Navigation**: Row clicks navigate to creative detail pages
- **Responsive Design**: Table adapts to different screen sizes

## Data Structure

Each creative record includes:
- **ID**: Unique creative identifier (CR-001, CR-002, etc.)
- **Status**: Approval status with color-coded badges
- **Type**: Creative type with color-coded badges
- **Format**: Creative format specification
- **Name**: Creative name
- **Campaign**: Associated campaign name
- **Line Items**: Number of linked line items (with badge)
- **Created/Updated**: Date tracking with proper formatting

## Filter Options

### Status Filter
- **Approved**: Creative approved and ready for use
- **Pending**: Creative awaiting approval
- **Draft**: Creative in development
- **Rejected**: Creative rejected and needs revision

### Type Filter
- **Display**: Online display advertisements
- **Digital In-Store**: Digital signage and in-store displays
- **Offline In-Store**: Physical in-store materials
- **Sponsored Products**: Product-specific advertising

### Format Filter
- **Banner**: Standard banner advertisements
- **Video**: Video advertisements
- **Digital Signage**: Digital display formats
- **Wobbler**: Physical wobbler materials
- **Product Image**: Product-specific imagery
- **Interstitial**: Full-screen advertisements

## Search Functionality

The search feature allows filtering by:
- Creative names
- Campaign names
- Creative IDs
- Real-time filtering as you type

## Usage

This template is ideal for:
- Creative asset management
- Media partner creative overviews
- Creative approval workflows
- Creative performance monitoring
- Bulk creative operations

## Components Used

- AppLayout (navigation, user management, page header)
- Card (main content container)
- FilterBar (filtering and search interface)
- Table (data display with sorting and row actions)
- Badge (status, type, and count indicators)
        `}}},tags:["autodocs"]},F=[{id:"CR-001",status:"Approved",type:"Display",format:"Banner",name:"Holiday Sale Banner",campaign:"Holiday Sale",lineItems:3,created:"2024-06-01",updated:"2024-06-15"},{id:"CR-002",status:"Pending",type:"Display",format:"Video",name:"Summer Launch Video",campaign:"Summer Launch",lineItems:1,created:"2024-07-01",updated:"2024-07-10"},{id:"CR-003",status:"Approved",type:"Digital In-Store",format:"Digital Signage",name:"Back to School Display",campaign:"Back to School",lineItems:2,created:"2024-08-01",updated:"2024-08-05"},{id:"CR-004",status:"Rejected",type:"Offline In-Store",format:"Wobbler",name:"Black Friday Wobbler",campaign:"Black Friday",lineItems:0,created:"2024-10-15",updated:"2024-10-20"},{id:"CR-005",status:"Approved",type:"Sponsored Products",format:"Product Image",name:"Electronics Promo",campaign:"Electronics Sale",lineItems:4,created:"2024-09-01",updated:"2024-09-10"},{id:"CR-006",status:"Draft",type:"Display",format:"Interstitial",name:"Winter Collection",campaign:"Winter Launch",lineItems:0,created:"2024-11-01",updated:"2024-11-01"}],B=a=>{switch(a){case"Approved":return"default";case"Pending":return"secondary";case"Draft":return"outline";case"Rejected":return"destructive";default:return"outline"}},x=a=>{switch(a){case"Display":return"default";case"Digital In-Store":return"secondary";case"Offline In-Store":return"outline";case"Sponsored Products":return"destructive";default:return"outline"}},o={render:()=>{const{theme:a}=w(),p=D(a||"retailMedia"),[s,m]=i.useState([]),[n,u]=i.useState([]),[l,g]=i.useState([]),[r,v]=i.useState(""),h=F.filter(e=>{const y=s.length===0||s.includes(e.status.toLowerCase().replace(/ /g,"-")),f=n.length===0||n.includes(e.type.toLowerCase().replace(/ /g,"-")),C=l.length===0||l.includes(e.format.toLowerCase().replace(/ /g,"-")),b=r===""||e.name.toLowerCase().includes(r.toLowerCase())||e.campaign.toLowerCase().includes(r.toLowerCase())||e.id.toLowerCase().includes(r.toLowerCase());return y&&f&&C&&b});return t.jsx(S,{children:t.jsx(c,{routes:p,logo:{src:"/gambit-logo.svg",alt:"Gambit Logo",width:40,height:40},user:{name:"Jane Doe",avatar:"https://ui-avatars.com/api/?name=Jane+Doe&size=32"},onLogout:()=>alert("Logout clicked"),breadcrumbProps:{namespace:""},pageHeaderProps:{title:"Creative Overview",subtitle:"Manage and monitor all your creative assets across campaigns",onEdit:()=>alert("Edit clicked"),onExport:()=>alert("Export clicked"),onImport:()=>alert("Import clicked"),onSettings:()=>alert("Settings clicked")},children:t.jsxs(k,{className:"w-full",children:[t.jsx(I,{children:t.jsx(P,{filters:[{name:"Status",options:[{label:"Approved",value:"approved"},{label:"Pending",value:"pending"},{label:"Draft",value:"draft"},{label:"Rejected",value:"rejected"}],selectedValues:s,onChange:m},{name:"Type",options:[{label:"Display",value:"display"},{label:"Digital In-Store",value:"digital-in-store"},{label:"Offline In-Store",value:"offline-in-store"},{label:"Sponsored Products",value:"sponsored-products"}],selectedValues:n,onChange:u},{name:"Format",options:[{label:"Banner",value:"banner"},{label:"Video",value:"video"},{label:"Digital Signage",value:"digital-signage"},{label:"Wobbler",value:"wobbler"},{label:"Product Image",value:"product-image"},{label:"Interstitial",value:"interstitial"}],selectedValues:l,onChange:g}],searchValue:r,onSearchChange:v,searchPlaceholder:"Search creatives..."})}),t.jsx(L,{children:t.jsx(T,{columns:[{key:"id",header:"ID"},{key:"status",header:"Status",render:e=>t.jsx(d,{variant:B(e.status),children:e.status})},{key:"type",header:"Type",render:e=>t.jsx(d,{variant:x(e.type),children:e.type})},{key:"format",header:"Format"},{key:"name",header:"Name"},{key:"campaign",header:"Campaign"},{key:"lineItems",header:"Line items",render:e=>t.jsx(d,{variant:"secondary",children:e.lineItems})},{key:"created",header:"Created",render:e=>new Date(e.created).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})},{key:"updated",header:"Updated",render:e=>new Date(e.updated).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"})}],data:h,rowKey:e=>e.id,rowClassName:()=>"cursor-pointer",onRowClick:e=>{console.log("Navigate to creative details for",e.name)}})})]})})})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      theme: storybookTheme
    } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);
    const [status, setStatus] = useState<string[]>([]);
    const [type, setType] = useState<string[]>([]);
    const [format, setFormat] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const filteredCreativeData = creativeData.filter(row => {
      const statusMatch = status.length === 0 || status.includes(row.status.toLowerCase().replace(/ /g, '-'));
      const typeMatch = type.length === 0 || type.includes(row.type.toLowerCase().replace(/ /g, '-'));
      const formatMatch = format.length === 0 || format.includes(row.format.toLowerCase().replace(/ /g, '-'));
      const searchMatch = search === '' || row.name.toLowerCase().includes(search.toLowerCase()) || row.campaign.toLowerCase().includes(search.toLowerCase()) || row.id.toLowerCase().includes(search.toLowerCase());
      return statusMatch && typeMatch && formatMatch && searchMatch;
    });
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
        title: 'Creative Overview',
        subtitle: 'Manage and monitor all your creative assets across campaigns',
        onEdit: () => alert('Edit clicked'),
        onExport: () => alert('Export clicked'),
        onImport: () => alert('Import clicked'),
        onSettings: () => alert('Settings clicked')
      }}>
        <Card className="w-full">
          <CardHeader>
            <FilterBar filters={[{
              name: 'Status',
              options: [{
                label: 'Approved',
                value: 'approved'
              }, {
                label: 'Pending',
                value: 'pending'
              }, {
                label: 'Draft',
                value: 'draft'
              }, {
                label: 'Rejected',
                value: 'rejected'
              }],
              selectedValues: status,
              onChange: setStatus
            }, {
              name: 'Type',
              options: [{
                label: 'Display',
                value: 'display'
              }, {
                label: 'Digital In-Store',
                value: 'digital-in-store'
              }, {
                label: 'Offline In-Store',
                value: 'offline-in-store'
              }, {
                label: 'Sponsored Products',
                value: 'sponsored-products'
              }],
              selectedValues: type,
              onChange: setType
            }, {
              name: 'Format',
              options: [{
                label: 'Banner',
                value: 'banner'
              }, {
                label: 'Video',
                value: 'video'
              }, {
                label: 'Digital Signage',
                value: 'digital-signage'
              }, {
                label: 'Wobbler',
                value: 'wobbler'
              }, {
                label: 'Product Image',
                value: 'product-image'
              }, {
                label: 'Interstitial',
                value: 'interstitial'
              }],
              selectedValues: format,
              onChange: setFormat
            }]} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search creatives..." />
          </CardHeader>
          <CardContent>
            <Table columns={[{
              key: 'id',
              header: 'ID'
            }, {
              key: 'status',
              header: 'Status',
              render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
            }, {
              key: 'type',
              header: 'Type',
              render: row => <Badge variant={typeVariant(row.type)}>{row.type}</Badge>
            }, {
              key: 'format',
              header: 'Format'
            }, {
              key: 'name',
              header: 'Name'
            }, {
              key: 'campaign',
              header: 'Campaign'
            }, {
              key: 'lineItems',
              header: 'Line items',
              render: row => <Badge variant="secondary">{row.lineItems}</Badge>
            }, {
              key: 'created',
              header: 'Created',
              render: row => new Date(row.created).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }, {
              key: 'updated',
              header: 'Updated',
              render: row => new Date(row.updated).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            }]} data={filteredCreativeData} rowKey={row => row.id} rowClassName={() => 'cursor-pointer'} onRowClick={row => {
              console.log('Navigate to creative details for', row.name);
            }} />
          </CardContent>
        </Card>
      </AppLayout>
      </MenuContextProvider>;
  }
}`,...o.parameters?.docs?.source}}};const Ge=["CreativeOverview"];export{o as CreativeOverview,Ge as __namedExportsOrder,ze as default};
