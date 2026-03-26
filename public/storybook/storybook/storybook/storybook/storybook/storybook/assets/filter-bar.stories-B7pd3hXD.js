import{r as e,j as n}from"./iframe-DvKL0w_9.js";import{F as r}from"./filter-bar-DMUjQTHM.js";import"./preload-helper-PPVm8Dsz.js";import"./filter-L7NEj-xr.js";import"./utils-CBfrqCZ4.js";import"./button-oxyhV2g6.js";import"./index-cUSCOmKM.js";import"./index-CdJFUDDL.js";import"./popover-j87nmUjH.js";import"./index-DH-oRreP.js";import"./index-zjPiqC4D.js";import"./index-c8TczyEf.js";import"./index-COxQYZsJ.js";import"./Combination-B-jfCMot.js";import"./index-DHx-W8w9.js";import"./index-DnLl3Ei0.js";import"./index-4d8l3FI2.js";import"./index-BQ0gwhW0.js";import"./index-CGKGO6yD.js";import"./checkbox--WHKG7t-.js";import"./index-Ud09Nppy.js";import"./check-Cmreq_tW.js";import"./createLucideIcon-DN8XCnB-.js";import"./x-DXIOgXXH.js";import"./search-Dpj4_yN2.js";import"./store-CQtbaQZT.js";import"./search-input-A57EVLBS.js";import"./input-CBnomjHd.js";import"./dropdown-menu-D5IgHDJS.js";import"./index-CF5fDaZW.js";import"./circle-DwGOr8Je.js";import"./chevron-right-CHIBhS7m.js";import"./chevron-down-NXkMBHE3.js";const L={title:"UI/FilterBar",component:r},a={render:()=>{const[s,o]=e.useState(["running","paused","draft","completed","archived"]),[l,i]=e.useState([]),[d,u]=e.useState([]),[m,c]=e.useState("");return n.jsx("div",{className:"p-6 bg-white",children:n.jsx(r,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Paused",value:"paused"},{label:"Draft",value:"draft"},{label:"Completed",value:"completed"},{label:"Archived",value:"archived"}],selectedValues:s,onChange:o},{name:"Brand",options:[{label:"Brand A",value:"brand-a"},{label:"Brand B",value:"brand-b"}],selectedValues:l,onChange:i},{name:"Media product",options:Array.from({length:18},(p,t)=>({label:`Media Product ${t+1}`,value:`media-product-${t+1}`})),selectedValues:d,onChange:u}],searchValue:m,onSearchChange:c,searchPlaceholder:"Search for ID, Name"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
