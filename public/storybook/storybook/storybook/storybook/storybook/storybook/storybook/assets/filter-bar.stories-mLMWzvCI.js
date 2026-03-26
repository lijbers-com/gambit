import{r as e,j as n}from"./iframe-CHTXZqHT.js";import{F as r}from"./filter-bar-CaS_Bt0m.js";import"./preload-helper-PPVm8Dsz.js";import"./filter--lPtKJh6.js";import"./utils-CBfrqCZ4.js";import"./button-6Pp8Vv4a.js";import"./index-Csd0mXSg.js";import"./index-CdJFUDDL.js";import"./popover-BELfsOx9.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./Combination-Cg5hGoMc.js";import"./index-C9_Qsora.js";import"./index-IS2wP4Ks.js";import"./index-Dv4mTO0q.js";import"./index-B01eqHDT.js";import"./index-BFaNEU3W.js";import"./checkbox-Bt-gaoCs.js";import"./index-BsF0p07j.js";import"./check-B9DH0HFd.js";import"./createLucideIcon-C4RkYYok.js";import"./x-CFpX2Oyw.js";import"./search-EiEHQMi5.js";import"./store-BXFWTEpu.js";import"./search-input-Hq_yClba.js";import"./input-C563dLlj.js";import"./dropdown-menu-BpjMxfKo.js";import"./index-DIhyg6RD.js";import"./circle-CrkDz0bp.js";import"./chevron-right-Nj7-Lm2e.js";import"./chevron-down-D0T9YktY.js";const L={title:"UI/FilterBar",component:r},a={render:()=>{const[s,o]=e.useState(["running","paused","draft","completed","archived"]),[l,i]=e.useState([]),[d,u]=e.useState([]),[m,c]=e.useState("");return n.jsx("div",{className:"p-6 bg-white",children:n.jsx(r,{filters:[{name:"Status",options:[{label:"Running",value:"running"},{label:"Paused",value:"paused"},{label:"Draft",value:"draft"},{label:"Completed",value:"completed"},{label:"Archived",value:"archived"}],selectedValues:s,onChange:o},{name:"Brand",options:[{label:"Brand A",value:"brand-a"},{label:"Brand B",value:"brand-b"}],selectedValues:l,onChange:i},{name:"Media product",options:Array.from({length:18},(p,t)=>({label:`Media Product ${t+1}`,value:`media-product-${t+1}`})),selectedValues:d,onChange:u}],searchValue:m,onSearchChange:c,searchPlaceholder:"Search for ID, Name"})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
