import{r as e,j as n}from"./iframe-BVumAmaP.js";import{F as r}from"./filter-bar-DVoleJLl.js";import"./preload-helper-PPVm8Dsz.js";import"./filter-k6SaYIKA.js";import"./utils-CBfrqCZ4.js";import"./button-C0Q2-t8z.js";import"./index-CYMrhGm5.js";import"./index-CdJFUDDL.js";import"./popover-Hr_nuNGy.js";import"./index-Xio54jsv.js";import"./index-CdIZDn3i.js";import"./index-CpQ2v_Rl.js";import"./index-Yd78ZJXV.js";import"./Combination-BERpo1ez.js";import"./index-uq_WHOCh.js";import"./index-D0nTNiYe.js";import"./index-B2zTIoeG.js";import"./index-DYiruaZ0.js";import"./index-CuMwnqbd.js";import"./checkbox-gqmVE3EZ.js";import"./index-DAuT_Ewe.js";import"./check-ICOllTtP.js";import"./createLucideIcon-olMS5pkE.js";import"./x-Cf_KK5yw.js";import"./search-DpFzmuoT.js";import"./store-CKs962OE.js";import"./search-input-BJ1PVVyr.js";import"./input-D97KWfQ5.js";import"./dropdown-menu-ByduCcsh.js";import"./index-OLOPnAVh.js";import"./circle-CCIUVUJv.js";import"./chevron-right-C7uhGK00.js";import"./chevron-down-6SCAHu11.js";const L={title:"UI/FilterBar",component:r},a={render:()=>{const[s,o]=e.useState(["running","paused","draft","completed","archived"]),[l,i]=e.useState([]),[d,u]=e.useState([]),[m,c]=e.useState("");return n.jsx("div",{className:"p-6 bg-white",children:n.jsx(r,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Paused",value:"paused"},{label:"Draft",value:"draft"},{label:"Completed",value:"completed"},{label:"Archived",value:"archived"}],selectedValues:s,onChange:o},{name:"Brand",options:[{label:"Brand A",value:"brand-a"},{label:"Brand B",value:"brand-b"}],selectedValues:l,onChange:i},{name:"Media product",options:Array.from({length:18},(p,t)=>({label:`Media Product ${t+1}`,value:`media-product-${t+1}`})),selectedValues:d,onChange:u}],searchValue:m,onSearchChange:c,searchPlaceholder:"Search for ID, Name"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [status, setStatus] = React.useState(["running", "paused", "draft", "completed", "archived"]);
    const [brand, setBrand] = React.useState<string[]>([]);
    const [media, setMedia] = React.useState<string[]>([]);
    const [search, setSearch] = React.useState("");
    return <div className="p-6 bg-white">
        <FilterBar filters={[{
        name: "Status",
        options: [{
          label: "Running",
          value: "running"
        }, {
          label: "Paused",
          value: "paused"
        }, {
          label: "Draft",
          value: "draft"
        }, {
          label: "Completed",
          value: "completed"
        }, {
          label: "Archived",
          value: "archived"
        }],
        selectedValues: status,
        onChange: setStatus
      }, {
        name: "Brand",
        options: [{
          label: "Brand A",
          value: "brand-a"
        }, {
          label: "Brand B",
          value: "brand-b"
        }],
        selectedValues: brand,
        onChange: setBrand
      }, {
        name: "Media product",
        options: Array.from({
          length: 18
        }, (_, i) => ({
          label: \`Media Product \${i + 1}\`,
          value: \`media-product-\${i + 1}\`
        })),
        selectedValues: media,
        onChange: setMedia
      }]} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search for ID, Name" />
      </div>;
  }
}`,...a.parameters?.docs?.source}}};const Q=["Default"];export{a as Default,Q as __namedExportsOrder,L as default};
