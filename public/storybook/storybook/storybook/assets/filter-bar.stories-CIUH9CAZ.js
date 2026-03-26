import{r as e,j as n}from"./iframe-kMwc57NQ.js";import{F as r}from"./filter-bar-JgbchpZQ.js";import"./preload-helper-PPVm8Dsz.js";import"./filter-DBn0nYiE.js";import"./utils-CBfrqCZ4.js";import"./button-FpfrwFWj.js";import"./index-BBE6OHCH.js";import"./index-CdJFUDDL.js";import"./popover-BZtR7h_q.js";import"./index-CDK8-NUj.js";import"./index-Bo3Clklg.js";import"./index-DOXTHwO9.js";import"./index-BoqR-WWR.js";import"./Combination-C5MNOf4_.js";import"./index-Bi6bXTBS.js";import"./index-c72aXvQd.js";import"./index-bMwaxSzY.js";import"./index-DpDPOQ2h.js";import"./index-DjVb1jZ5.js";import"./checkbox-kNdyylnl.js";import"./index-Cl3YdfkZ.js";import"./check-CwyobKrx.js";import"./createLucideIcon-SSdVYwtx.js";import"./x-DZvc5uvK.js";import"./search-BEIn4agr.js";import"./store-DBSSh01E.js";import"./search-input-BpIRj-LJ.js";import"./input-Dy7wjhtJ.js";import"./dropdown-menu-CEgAEpmX.js";import"./index-eLNRRPGY.js";import"./circle-D6aeAbZN.js";import"./chevron-right-idmTSYJc.js";import"./chevron-down-BJIDV8wX.js";const L={title:"UI/FilterBar",component:r},a={render:()=>{const[s,o]=e.useState(["running","paused","draft","completed","archived"]),[l,i]=e.useState([]),[d,u]=e.useState([]),[m,c]=e.useState("");return n.jsx("div",{className:"p-6 bg-white",children:n.jsx(r,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Paused",value:"paused"},{label:"Draft",value:"draft"},{label:"Completed",value:"completed"},{label:"Archived",value:"archived"}],selectedValues:s,onChange:o},{name:"Brand",options:[{label:"Brand A",value:"brand-a"},{label:"Brand B",value:"brand-b"}],selectedValues:l,onChange:i},{name:"Media product",options:Array.from({length:18},(p,t)=>({label:`Media Product ${t+1}`,value:`media-product-${t+1}`})),selectedValues:d,onChange:u}],searchValue:m,onSearchChange:c,searchPlaceholder:"Search for ID, Name"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
