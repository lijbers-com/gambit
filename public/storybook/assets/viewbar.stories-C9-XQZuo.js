import{r,j as a}from"./iframe-DvKL0w_9.js";import{V as o}from"./viewbar-DZ6LLLZL.js";import"./preload-helper-PPVm8Dsz.js";import"./tabs-Due7Jno1.js";import"./index-DH-oRreP.js";import"./index-zjPiqC4D.js";import"./index-c8TczyEf.js";import"./index-COxQYZsJ.js";import"./index-cUSCOmKM.js";import"./index-CF5fDaZW.js";import"./index-DnLl3Ei0.js";import"./index-DHx-W8w9.js";import"./index-CGKGO6yD.js";import"./utils-CBfrqCZ4.js";const h={title:"UI/Viewbar",component:o},e={render:()=>{const[l,t]=r.useState("booked");return a.jsx("div",{className:"p-8 bg-background",children:a.jsx(o,{labels:[{label:"30 campaigns in-option",color:"muted"},{label:"20 closed-won campaigns",color:"success"}],tabs:[{value:"booked",label:"Booked Campaigns"},{value:"stores",label:"Available Stores"},{value:"reach",label:"Available Reach"},{value:"fill",label:"Fill rate"}],activeTab:l,onTabChange:t})})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
