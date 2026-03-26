import{j as e,R as u}from"./iframe-B2sv3z--.js";import{T as d}from"./table-CNEeceD7.js";import{B as i}from"./badge-BuMlIxhD.js";import{c as h}from"./createLucideIcon-Bwht0sgB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-CS3p5svP.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./index-ojs0XM5b.js";import"./index-G_2NqKkU.js";import"./index-BHEqwGAn.js";import"./index-BOcI3EBp.js";import"./Combination-CVHJjhEU.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./checkbox-DgACiBX7.js";import"./index-CG_rr0_2.js";import"./check-D5-eMeep.js";import"./circle-CA_9n80i.js";import"./chevron-right-BMhUZwQf.js";import"./ellipsis-DwDXQygk.js";import"./chevron-down-BepfQlRx.js";import"./chevron-up-BAVTz51r.js";import"./index-CdJFUDDL.js";const p=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],l=h("badge-check",p),_={title:"UI/Table",component:d,parameters:{docs:{page:null}},tags:["autodocs"]},x=[{key:"id",header:"ID"},{key:"alerts",header:"Alerts"},{key:"status",header:"Status",render:t=>e.jsxs(i,{variant:"default",className:"inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100",children:[e.jsx(l,{className:"h-4 w-4 mr-1 text-green-500"}),t.status]}),className:"w-32"},{key:"player",header:"Player",render:t=>e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-slate-800",children:t.player}),e.jsxs("div",{className:"text-xs text-slate-500",children:["MAC: ",t.mac]})]})},{key:"store",header:"Store",render:t=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("img",{src:t.storeLogo,alt:"store",className:"h-7 w-7 rounded-full bg-slate-100 border border-slate-200"}),e.jsx("span",{children:t.store})]}),className:"w-72"},{key:"attributes",header:"Attributes"}],m=[{id:8410,alerts:"0 alert(s)",status:"Online",player:"ZELFSCANPLEIN 4e – 1xPT, Q15a4-AH-WWM",mac:"00:01:80:90:83:cb",hostname:"gambit-33",storeLogo:"/store-logo.png",store:"1534 - Burg Van Stamplein 270 HOOFDDORP",attributes:0},{id:8192,alerts:"0 alert(s)",status:"Online",player:"ZELFSCANPLEIN 3e – 1xPT, Q15a3-AH-WWM",mac:"00:01:80:bc:b2:8f",hostname:"gambit-28",storeLogo:"/store-logo.png",store:"1534 - Burg Van Stamplein 270 HOOFDDORP",attributes:0},{id:8740,alerts:"0 alert(s)",status:"Online",player:"ZELFSCANPLEIN 3e – 1xPT, Q15a3-AH-WWM",mac:"00:01:80:bb:63:30",hostname:"gambit-26",storeLogo:"/store-logo.png",store:"1621 - Zwanenveld 5505 NIJMEGEN",attributes:0}],a={render:()=>e.jsx("div",{className:"p-8 bg-slate-50 min-h-screen",children:e.jsx(d,{columns:x,data:m,rowKey:t=>t.id})})},s={render:()=>e.jsxs("div",{className:"p-8 bg-slate-50 min-h-screen",children:[e.jsx("div",{className:"mb-4",children:e.jsx("p",{className:"text-sm text-slate-500",children:'The "ID" and "Status" columns are fixed by default. Open the column menu (⋯) to drag columns between the Fixed and Show sections, reorder fixed columns, or unpin them.'})}),e.jsx(d,{columns:[{key:"id",header:"ID",width:80},{key:"alerts",header:"Alerts",width:120},{key:"status",header:"Status",width:130,render:t=>e.jsxs(i,{variant:"default",className:"inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100",children:[e.jsx(l,{className:"h-4 w-4 mr-1 text-green-500"}),t.status]})},{key:"player",header:"Player",width:260,render:t=>e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-slate-800",children:t.player}),e.jsxs("div",{className:"text-xs text-slate-500",children:["MAC: ",t.mac]})]})},{key:"store",header:"Store",width:280,render:t=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("img",{src:t.storeLogo,alt:"store",className:"h-7 w-7 rounded-full bg-slate-100 border border-slate-200"}),e.jsx("span",{children:t.store})]})},{key:"attributes",header:"Attributes",width:120}],data:m,rowKey:t=>t.id,defaultFixedColumns:["id","status"]})]})},r={render:()=>{const[t,n]=u.useState([]),c=[{id:1,name:"Alice",email:"alice@email.com"},{id:2,name:"Bob",email:"bob@email.com"},{id:3,name:"Charlie",email:"charlie@email.com"}];return e.jsxs("div",{className:"p-6 bg-white",children:[e.jsx(d,{columns:[{key:"name",header:"Name"},{key:"email",header:"Email"}],data:c,rowKey:o=>o.id,rowSelection:{selectedKeys:t,onChange:n,getKey:o=>o.id}}),e.jsxs("div",{className:"mt-4 text-sm text-muted-foreground",children:["Selected IDs: ",t.join(", ")||"None"]})]})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8 bg-slate-50 min-h-screen">
      <Table columns={columns} data={data} rowKey={row => row.id} />
    </div>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","FixedColumns","SelectableRows"];export{a as Default,s as FixedColumns,r as SelectableRows,Q as __namedExportsOrder,_ as default};
