import{r,j as a}from"./iframe-C5bSqRdg.js";import{V as o}from"./viewbar-ClIYNI18.js";import"./preload-helper-PPVm8Dsz.js";import"./tabs-DQH67WFj.js";import"./index-DD08fZIQ.js";import"./index-DAh0e16s.js";import"./index-Z2B8irzh.js";import"./index-gOg22guj.js";import"./index-DJEyZNpx.js";import"./index-D5TxnOXk.js";import"./index-BDa5FaKX.js";import"./index-4SfGeEia.js";import"./index-7AEp8Dl6.js";import"./utils-CBfrqCZ4.js";const h={title:"UI/Viewbar",component:o},e={render:()=>{const[l,t]=r.useState("booked");return a.jsx("div",{className:"p-8 bg-background",children:a.jsx(o,{labels:[{label:"30 campaigns in-option",color:"muted"},{label:"20 closed-won campaigns",color:"success"}],tabs:[{value:"booked",label:"Booked Campaigns"},{value:"stores",label:"Available Stores"},{value:"reach",label:"Available Reach"},{value:"fill",label:"Fill rate"}],activeTab:l,onTabChange:t})})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
