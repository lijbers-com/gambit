import{r as e,j as n}from"./iframe-C5bSqRdg.js";import{F as r}from"./filter-bar-BQ_Dq79-.js";import"./preload-helper-PPVm8Dsz.js";import"./filter-DmOtPxy7.js";import"./utils-CBfrqCZ4.js";import"./button-CMihJ9pV.js";import"./index-DJEyZNpx.js";import"./index-CdJFUDDL.js";import"./popover-CtRsAG4M.js";import"./index-DD08fZIQ.js";import"./index-DAh0e16s.js";import"./index-Z2B8irzh.js";import"./index-gOg22guj.js";import"./Combination-BPLtMwXH.js";import"./index-4SfGeEia.js";import"./index-BDa5FaKX.js";import"./index-DELDvHLi.js";import"./index-C48yRfEQ.js";import"./index-7AEp8Dl6.js";import"./checkbox-DTG8_xx0.js";import"./index-squPBcRJ.js";import"./check-BliW7QYp.js";import"./createLucideIcon-CkgRO_Hx.js";import"./x-Xece35A4.js";import"./search-BEI7_bcP.js";import"./store-DA6NizPB.js";import"./search-input-CF4V8rQz.js";import"./input-BbKIeO3x.js";import"./dropdown-menu-BPEWRI36.js";import"./index-D5TxnOXk.js";import"./circle-xaoSWTc6.js";import"./chevron-right-zSdNciVz.js";import"./chevron-down-BH3g__jq.js";const L={title:"UI/FilterBar",component:r},a={render:()=>{const[s,o]=e.useState(["running","paused","draft","completed","archived"]),[l,i]=e.useState([]),[d,u]=e.useState([]),[m,c]=e.useState("");return n.jsx("div",{className:"p-6 bg-white",children:n.jsx(r,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Paused",value:"paused"},{label:"Draft",value:"draft"},{label:"Completed",value:"completed"},{label:"Archived",value:"archived"}],selectedValues:s,onChange:o},{name:"Brand",options:[{label:"Brand A",value:"brand-a"},{label:"Brand B",value:"brand-b"}],selectedValues:l,onChange:i},{name:"Media product",options:Array.from({length:18},(p,t)=>({label:`Media Product ${t+1}`,value:`media-product-${t+1}`})),selectedValues:d,onChange:u}],searchValue:m,onSearchChange:c,searchPlaceholder:"Search for ID, Name"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
