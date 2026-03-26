import{j as t,R as u}from"./iframe-DIN2IKqe.js";import{T as o}from"./table-j0AjTCp9.js";import{B as i}from"./badge-BDRNArob.js";import{c as p}from"./createLucideIcon-Buzyb9Q7.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-dbnqWaiD.js";import"./index-DywWKZUd.js";import"./index-DjuRppva.js";import"./index-C8pd1VWv.js";import"./index-D93m9KRt.js";import"./index-BrN91Rgp.js";import"./index-Du2gMQwv.js";import"./index-X7hHvCXq.js";import"./index-Br6PxJxS.js";import"./Combination-B4vWFPwN.js";import"./index-BEqAkVqP.js";import"./index-DNa-te7d.js";import"./index-vD8Qkz52.js";import"./checkbox-C34OBCE9.js";import"./index-BCdNlN2L.js";import"./check-DcQhNYtI.js";import"./circle-DmMWJKS7.js";import"./chevron-right-CUD2C_lr.js";import"./ellipsis-DXKMKTiW.js";import"./chevron-down-Rsxw0oJ3.js";import"./chevron-up-ir_nW-fh.js";import"./index-CdJFUDDL.js";const h=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],l=p("badge-check",h),_={title:"UI/Table",component:o,parameters:{docs:{page:null}},tags:["autodocs"]},x=[{key:"id",header:"ID"},{key:"alerts",header:"Alerts"},{key:"status",header:"Status",render:e=>t.jsxs(i,{variant:"default",className:"inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100",children:[t.jsx(l,{className:"h-4 w-4 mr-1 text-green-500"}),e.status]}),className:"w-32"},{key:"player",header:"Player",render:e=>e.player},{key:"store",header:"Store",render:e=>e.store},{key:"attributes",header:"Attributes"}],m=[{id:8410,alerts:"0 alert(s)",status:"Online",player:"ZELFSCANPLEIN 4e – 1xPT, Q15a4-AH-WWM",mac:"00:01:80:90:83:cb",hostname:"gambit-33",storeLogo:"/store-logo.png",store:"1534 - Burg Van Stamplein 270 HOOFDDORP",attributes:0},{id:8192,alerts:"0 alert(s)",status:"Online",player:"ZELFSCANPLEIN 3e – 1xPT, Q15a3-AH-WWM",mac:"00:01:80:bc:b2:8f",hostname:"gambit-28",storeLogo:"/store-logo.png",store:"1534 - Burg Van Stamplein 270 HOOFDDORP",attributes:0},{id:8740,alerts:"0 alert(s)",status:"Online",player:"ZELFSCANPLEIN 3e – 1xPT, Q15a3-AH-WWM",mac:"00:01:80:bb:63:30",hostname:"gambit-26",storeLogo:"/store-logo.png",store:"1621 - Zwanenveld 5505 NIJMEGEN",attributes:0}],a={render:()=>t.jsx("div",{className:"p-8 bg-slate-50 min-h-screen",children:t.jsx(o,{columns:x,data:m,rowKey:e=>e.id})})},r={render:()=>t.jsxs("div",{className:"p-8 bg-slate-50 min-h-screen",children:[t.jsx("div",{className:"mb-4",children:t.jsx("p",{className:"text-sm text-slate-500",children:'The "ID" and "Status" columns are fixed by default. Open the column menu (⋯) to drag columns between the Fixed and Show sections, reorder fixed columns, or unpin them.'})}),t.jsx(o,{columns:[{key:"id",header:"ID",width:80},{key:"alerts",header:"Alerts",width:120},{key:"status",header:"Status",width:130,render:e=>t.jsxs(i,{variant:"default",className:"inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100",children:[t.jsx(l,{className:"h-4 w-4 mr-1 text-green-500"}),e.status]})},{key:"player",header:"Player",width:260,render:e=>t.jsxs("div",{children:[t.jsx("div",{className:"font-medium text-slate-800",children:e.player}),t.jsxs("div",{className:"text-xs text-slate-500",children:["MAC: ",e.mac]})]})},{key:"store",header:"Store",width:280,render:e=>t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx("img",{src:e.storeLogo,alt:"store",className:"h-7 w-7 rounded-full bg-slate-100 border border-slate-200"}),t.jsx("span",{children:e.store})]})},{key:"attributes",header:"Attributes",width:120}],data:m,rowKey:e=>e.id,defaultFixedColumns:["id","status"]})]})},s={render:()=>{const[e,n]=u.useState([]),c=[{id:1,name:"Alice",email:"alice@email.com"},{id:2,name:"Bob",email:"bob@email.com"},{id:3,name:"Charlie",email:"charlie@email.com"}];return t.jsxs("div",{className:"p-6 bg-white",children:[t.jsx(o,{columns:[{key:"name",header:"Name"},{key:"email",header:"Email"}],data:c,rowKey:d=>d.id,rowSelection:{selectedKeys:e,onChange:n,getKey:d=>d.id}}),t.jsxs("div",{className:"mt-4 text-sm text-muted-foreground",children:["Selected IDs: ",e.join(", ")||"None"]})]})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-slate-50 min-h-screen">
      <Table columns={columns} data={data} rowKey={row => row.id} />
    </div>
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-4">
        <p className="text-sm text-slate-500">The &quot;ID&quot; and &quot;Status&quot; columns are fixed by default. Open the column menu (⋯) to drag columns between the Fixed and Show sections, reorder fixed columns, or unpin them.</p>
      </div>
      <Table columns={[{
      key: 'id',
      header: 'ID',
      width: 80
    }, {
      key: 'alerts',
      header: 'Alerts',
      width: 120
    }, {
      key: 'status',
      header: 'Status',
      width: 130,
      render: row => <Badge variant="default" className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
                {row.status}
              </Badge>
    }, {
      key: 'player',
      header: 'Player',
      width: 260,
      render: row => <div>
                <div className="font-medium text-slate-800">{row.player}</div>
                <div className="text-xs text-slate-500">MAC: {row.mac}</div>
              </div>
    }, {
      key: 'store',
      header: 'Store',
      width: 280,
      render: row => <div className="flex items-center gap-2">
                <img src={row.storeLogo} alt="store" className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200" />
                <span>{row.store}</span>
              </div>
    }, {
      key: 'attributes',
      header: 'Attributes',
      width: 120
    }]} data={data} rowKey={row => row.id} defaultFixedColumns={['id', 'status']} />
    </div>
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = React.useState<any[]>([]);
    const data = [{
      id: 1,
      name: 'Alice',
      email: 'alice@email.com'
    }, {
      id: 2,
      name: 'Bob',
      email: 'bob@email.com'
    }, {
      id: 3,
      name: 'Charlie',
      email: 'charlie@email.com'
    }];
    return <div className="p-6 bg-white">
        <Table columns={[{
        key: 'name',
        header: 'Name'
      }, {
        key: 'email',
        header: 'Email'
      }]} data={data} rowKey={row => row.id} rowSelection={{
        selectedKeys: selected,
        onChange: setSelected,
        getKey: row => row.id
      }} />
        <div className="mt-4 text-sm text-muted-foreground">
          Selected IDs: {selected.join(', ') || 'None'}
        </div>
      </div>;
  }
}`,...s.parameters?.docs?.source}}};const Q=["Default","FixedColumns","SelectableRows"];export{a as Default,r as FixedColumns,s as SelectableRows,Q as __namedExportsOrder,_ as default};
