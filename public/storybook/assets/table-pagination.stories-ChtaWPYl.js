import{j as e,r as n}from"./iframe-CHTXZqHT.js";import{c as y}from"./utils-CBfrqCZ4.js";import{B as p}from"./button-6Pp8Vv4a.js";import{D as k,a as A,b as E,c as L}from"./dropdown-menu-BpjMxfKo.js";import{C as M}from"./chevron-left-CTaZX9rv.js";import{E as q}from"./ellipsis-DKuwGljM.js";import{C as W}from"./chevron-right-Nj7-Lm2e.js";import{C as B}from"./chevron-down-D0T9YktY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Csd0mXSg.js";import"./index-CdJFUDDL.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-DIhyg6RD.js";import"./index-IS2wP4Ks.js";import"./index-C9_Qsora.js";import"./Combination-Cg5hGoMc.js";import"./index-Dv4mTO0q.js";import"./index-B01eqHDT.js";import"./index-BFaNEU3W.js";import"./checkbox-Bt-gaoCs.js";import"./index-BsF0p07j.js";import"./check-B9DH0HFd.js";import"./createLucideIcon-C4RkYYok.js";import"./circle-CrkDz0bp.js";const i=({currentPage:t,totalPages:a,onPageChange:s,sortOptions:r=[],selectedSort:u,onSortChange:c,className:j,showSort:T=!0})=>{const O=(()=>{const m=[],o=[],g=Math.max(2,t-2),N=Math.min(a-1,t+2);for(let C=g;C<=N;C++)m.push(C);return g>2?o.push(1,"..."):o.push(1),o.push(...m),N<a-1?o.push("...",a):a>1&&o.push(a),o})(),D=r.find(l=>l.value===u)?.label||"Latest";return e.jsxs("div",{className:y("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3",j),children:[e.jsxs("nav",{role:"navigation","aria-label":"pagination",className:"flex items-center gap-1",children:[e.jsx(p,{variant:"ghost",size:"icon",onClick:()=>s(t-1),disabled:t===1,className:"h-9 w-9 hover:bg-white",children:e.jsx(M,{className:"h-4 w-4"})}),O.map((l,m)=>{if(l==="...")return e.jsx("span",{className:"flex h-9 w-9 items-center justify-center text-sm text-muted-foreground",children:e.jsx(q,{className:"h-4 w-4"})},`ellipsis-${m}`);const o=l,g=o===t;return e.jsx(p,{variant:g?"default":"ghost",size:"icon",onClick:()=>s(o),className:y("h-9 w-9 text-sm",g?"bg-slate-900 text-white hover:bg-slate-800":"hover:bg-white"),children:o},o)}),e.jsx(p,{variant:"ghost",size:"icon",onClick:()=>s(t+1),disabled:t===a,className:"h-9 w-9 hover:bg-white",children:e.jsx(W,{className:"h-4 w-4"})})]}),T&&r.length>0&&c&&e.jsxs("div",{className:"flex items-center gap-2 text-sm text-muted-foreground",children:[e.jsx("span",{className:"whitespace-nowrap",children:"Sort by:"}),e.jsxs(k,{children:[e.jsx(A,{asChild:!0,children:e.jsxs(p,{variant:"outline",className:"h-9 text-sm gap-2 min-w-[140px] justify-between",children:[D,e.jsx(B,{className:"h-4 w-4"})]})}),e.jsx(E,{align:"end",className:"min-w-[140px]",children:r.map(l=>e.jsx(L,{onClick:()=>c(l.value),className:y(u===l.value&&"bg-accent"),children:l.label},l.value))})]})]})]})};i.__docgenInfo={description:"",methods:[],displayName:"TablePagination",props:{currentPage:{required:!0,tsType:{name:"number"},description:""},totalPages:{required:!0,tsType:{name:"number"},description:""},onPageChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:""},sortOptions:{required:!1,tsType:{name:"Array",elements:[{name:"SortOption"}],raw:"SortOption[]"},description:"",defaultValue:{value:"[]",computed:!1}},selectedSort:{required:!1,tsType:{name:"string"},description:""},onSortChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""},showSort:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};const ue={title:"UI/Table Pagination",component:i,parameters:{layout:"centered",docs:{description:{component:`
# Table Pagination Component

A pagination component designed for tables with integrated sorting functionality. Features a slate background with border, left-aligned pagination controls, and right-aligned sort dropdown.

## Features

- **Smart pagination**: Shows relevant page numbers with ellipsis for large page ranges
- **Integrated sorting**: Sort dropdown on the right side using our DropdownMenu component
- **Responsive design**: Stacks vertically on mobile, horizontal on desktop
- **Styled container**: Slate-50 background with border and rounded corners
- **Proper alignment**: Pagination controls left-aligned, sort options right-aligned
- **Keyboard navigation**: Supports keyboard navigation for accessibility

## Usage

Perfect for data tables with many rows that need both pagination and sorting controls. The component provides a contained, styled interface that works well below tables.

### Basic Usage
\`\`\`tsx
<TablePagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log('Page changed to:', page)}
/>
\`\`\`

### With Sorting
\`\`\`tsx
<TablePagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log('Page changed to:', page)}
  sortOptions={[
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'name', label: 'Name' },
  ]}
  selectedSort="latest"
  onSortChange={(sort) => console.log('Sort changed to:', sort)}
/>
\`\`\`

## Props

- **currentPage**: Current active page number
- **totalPages**: Total number of pages available
- **onPageChange**: Callback when page changes
- **sortOptions**: Array of sort options for dropdown
- **selectedSort**: Currently selected sort value
- **onSortChange**: Callback when sort changes
- **showSort**: Whether to show the sort dropdown
- **className**: Additional CSS classes

## Design Notes

The component follows the provided design with:
- Page numbers on the left side
- Sort dropdown on the right side with "Sort by:" prefix
- Clean, minimal styling with proper spacing
- Active page highlighted in dark color
- Ellipsis for page ranges
        `}}},argTypes:{currentPage:{control:{type:"number",min:1},description:"Current active page number"},totalPages:{control:{type:"number",min:1},description:"Total number of pages"},showSort:{control:"boolean",description:"Whether to show the sort dropdown"}},tags:["autodocs"]},d=[{value:"latest",label:"Latest"},{value:"oldest",label:"Oldest"},{value:"name",label:"Name A-Z"},{value:"name-desc",label:"Name Z-A"},{value:"created",label:"Date Created"},{value:"modified",label:"Last Modified"}],h={render:()=>{const[t,a]=n.useState(1),[s,r]=n.useState("latest");return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsx(i,{currentPage:t,totalPages:10,onPageChange:a,sortOptions:d,selectedSort:s,onSortChange:r})})}},S={render:()=>{const[t,a]=n.useState(2);return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsx(i,{currentPage:t,totalPages:5,onPageChange:a,showSort:!1})})}},x={render:()=>{const[t,a]=n.useState(15),[s,r]=n.useState("latest");return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsx(i,{currentPage:t,totalPages:50,onPageChange:a,sortOptions:d,selectedSort:s,onSortChange:r})})}},P={render:()=>{const[t,a]=n.useState(2),[s,r]=n.useState("name");return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsx(i,{currentPage:t,totalPages:3,onPageChange:a,sortOptions:d,selectedSort:s,onSortChange:r})})}},b={render:()=>{const[t,a]=n.useState(1),[s,r]=n.useState("latest");return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsx(i,{currentPage:t,totalPages:10,onPageChange:a,sortOptions:d,selectedSort:s,onSortChange:r})})}},f={render:()=>{const[t,a]=n.useState(10),[s,r]=n.useState("oldest");return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsx(i,{currentPage:t,totalPages:10,onPageChange:a,sortOptions:d,selectedSort:s,onSortChange:r})})}},w={render:()=>{const[t,a]=n.useState(5),[s,r]=n.useState("name");return e.jsxs("div",{className:"w-full space-y-4",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Resize your browser window to see the responsive behavior. On mobile, the pagination and sort controls stack vertically."}),e.jsx("div",{className:"w-full",children:e.jsx(i,{currentPage:t,totalPages:25,onPageChange:a,sortOptions:d,selectedSort:s,onSortChange:r})})]})}},v={render:()=>{const[t,a]=n.useState(1),[s,r]=n.useState("latest"),u=[{id:1,name:"Campaign A",status:"Active",date:"2024-01-15"},{id:2,name:"Campaign B",status:"Paused",date:"2024-01-14"},{id:3,name:"Campaign C",status:"Active",date:"2024-01-13"},{id:4,name:"Campaign D",status:"Draft",date:"2024-01-12"},{id:5,name:"Campaign E",status:"Active",date:"2024-01-11"}];return e.jsxs("div",{className:"w-full max-w-4xl space-y-4",children:[e.jsx("div",{className:"border rounded-lg",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{className:"border-b bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-3 text-left text-sm font-medium text-gray-900",children:"Name"}),e.jsx("th",{className:"px-4 py-3 text-left text-sm font-medium text-gray-900",children:"Status"}),e.jsx("th",{className:"px-4 py-3 text-left text-sm font-medium text-gray-900",children:"Date"})]})}),e.jsx("tbody",{className:"divide-y",children:u.map(c=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-4 py-3 text-sm text-gray-900",children:c.name}),e.jsx("td",{className:"px-4 py-3 text-sm text-gray-600",children:c.status}),e.jsx("td",{className:"px-4 py-3 text-sm text-gray-600",children:c.date})]},c.id))})]})}),e.jsx(i,{currentPage:t,totalPages:20,onPageChange:a,sortOptions:d,selectedSort:s,onSortChange:r})]})}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSort, setSelectedSort] = useState('latest');
    return <div className="w-full max-w-4xl">
        <TablePagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} sortOptions={sortOptions} selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>;
  }
}`,...h.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(2);
    return <div className="w-full max-w-4xl">
        <TablePagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} showSort={false} />
      </div>;
  }
}`,...S.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(15);
    const [selectedSort, setSelectedSort] = useState('latest');
    return <div className="w-full max-w-4xl">
        <TablePagination currentPage={currentPage} totalPages={50} onPageChange={setCurrentPage} sortOptions={sortOptions} selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>;
  }
}`,...x.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(2);
    const [selectedSort, setSelectedSort] = useState('name');
    return <div className="w-full max-w-4xl">
        <TablePagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} sortOptions={sortOptions} selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>;
  }
}`,...P.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSort, setSelectedSort] = useState('latest');
    return <div className="w-full max-w-4xl">
        <TablePagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} sortOptions={sortOptions} selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>;
  }
}`,...b.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(10);
    const [selectedSort, setSelectedSort] = useState('oldest');
    return <div className="w-full max-w-4xl">
        <TablePagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} sortOptions={sortOptions} selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>;
  }
}`,...f.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    const [selectedSort, setSelectedSort] = useState('name');
    return <div className="w-full space-y-4">
        <p className="text-sm text-muted-foreground">
          Resize your browser window to see the responsive behavior. On mobile, the pagination and sort controls stack vertically.
        </p>
        <div className="w-full">
          <TablePagination currentPage={currentPage} totalPages={25} onPageChange={setCurrentPage} sortOptions={sortOptions} selectedSort={selectedSort} onSortChange={setSelectedSort} />
        </div>
      </div>;
  }
}`,...w.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSort, setSelectedSort] = useState('latest');
    const tableData = [{
      id: 1,
      name: 'Campaign A',
      status: 'Active',
      date: '2024-01-15'
    }, {
      id: 2,
      name: 'Campaign B',
      status: 'Paused',
      date: '2024-01-14'
    }, {
      id: 3,
      name: 'Campaign C',
      status: 'Active',
      date: '2024-01-13'
    }, {
      id: 4,
      name: 'Campaign D',
      status: 'Draft',
      date: '2024-01-12'
    }, {
      id: 5,
      name: 'Campaign E',
      status: 'Active',
      date: '2024-01-11'
    }];
    return <div className="w-full max-w-4xl space-y-4">
        {/* Mock table */}
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tableData.map(row => <tr key={row.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination currentPage={currentPage} totalPages={20} onPageChange={setCurrentPage} sortOptions={sortOptions} selectedSort={selectedSort} onSortChange={setSelectedSort} />
      </div>;
  }
}`,...v.parameters?.docs?.source}}};const me=["Default","WithoutSorting","LargePageCount","SmallPageCount","FirstPage","LastPage","ResponsiveBehavior","WithTableExample"];export{h as Default,b as FirstPage,x as LargePageCount,f as LastPage,w as ResponsiveBehavior,P as SmallPageCount,v as WithTableExample,S as WithoutSorting,me as __namedExportsOrder,ue as default};
