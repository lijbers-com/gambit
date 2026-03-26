import{r,j as a}from"./iframe-CHTXZqHT.js";import{V as o}from"./viewbar-DPpBQl-b.js";import"./preload-helper-PPVm8Dsz.js";import"./tabs-ClhE1p3r.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-Csd0mXSg.js";import"./index-DIhyg6RD.js";import"./index-IS2wP4Ks.js";import"./index-C9_Qsora.js";import"./index-BFaNEU3W.js";import"./utils-CBfrqCZ4.js";const h={title:"UI/Viewbar",component:o},e={render:()=>{const[l,t]=r.useState("booked");return a.jsx("div",{className:"p-8 bg-background",children:a.jsx(o,{labels:[{label:"30 campaigns in-option",color:"muted"},{label:"20 closed-won campaigns",color:"success"}],tabs:[{value:"booked",label:"Booked Campaigns"},{value:"stores",label:"Available Stores"},{value:"reach",label:"Available Reach"},{value:"fill",label:"Fill rate"}],activeTab:l,onTabChange:t})})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [activeTab, setActiveTab] = React.useState('booked');
    return <div className="p-8 bg-background">
        <Viewbar labels={[{
        label: '30 campaigns in-option',
        color: 'muted'
      }, {
        label: '20 closed-won campaigns',
        color: 'success'
      }]} tabs={[{
        value: 'booked',
        label: 'Booked Campaigns'
      }, {
        value: 'stores',
        label: 'Available Stores'
      }, {
        value: 'reach',
        label: 'Available Reach'
      }, {
        value: 'fill',
        label: 'Fill rate'
      }]} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>;
  }
}`,...e.parameters?.docs?.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,h as default};
