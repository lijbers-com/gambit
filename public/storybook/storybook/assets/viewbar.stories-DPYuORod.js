import{r,j as a}from"./iframe-BVumAmaP.js";import{V as o}from"./viewbar-CHJUc5Vk.js";import"./preload-helper-PPVm8Dsz.js";import"./tabs-hFBM0bAA.js";import"./index-Xio54jsv.js";import"./index-CdIZDn3i.js";import"./index-CpQ2v_Rl.js";import"./index-Yd78ZJXV.js";import"./index-CYMrhGm5.js";import"./index-OLOPnAVh.js";import"./index-D0nTNiYe.js";import"./index-uq_WHOCh.js";import"./index-CuMwnqbd.js";import"./utils-CBfrqCZ4.js";const h={title:"UI/Viewbar",component:o},e={render:()=>{const[l,t]=r.useState("booked");return a.jsx("div",{className:"p-8 bg-background",children:a.jsx(o,{labels:[{label:"30 campaigns in-option",color:"muted"},{label:"20 closed-won campaigns",color:"success"}],tabs:[{value:"booked",label:"Booked Campaigns"},{value:"stores",label:"Available Stores"},{value:"reach",label:"Available Reach"},{value:"fill",label:"Fill rate"}],activeTab:l,onTabChange:t})})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
