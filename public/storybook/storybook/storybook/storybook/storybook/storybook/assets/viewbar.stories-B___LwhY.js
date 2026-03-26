import{r,j as a}from"./iframe-B2sv3z--.js";import{V as o}from"./viewbar-BT-p9u2O.js";import"./preload-helper-PPVm8Dsz.js";import"./tabs-CxryUS_g.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./index-ojs0XM5b.js";import"./index-G_2NqKkU.js";import"./index-BHEqwGAn.js";import"./index-BOcI3EBp.js";import"./index-Duqzc3UP.js";import"./utils-CBfrqCZ4.js";const h={title:"UI/Viewbar",component:o},e={render:()=>{const[l,t]=r.useState("booked");return a.jsx("div",{className:"p-8 bg-background",children:a.jsx(o,{labels:[{label:"30 campaigns in-option",color:"muted"},{label:"20 closed-won campaigns",color:"success"}],tabs:[{value:"booked",label:"Booked Campaigns"},{value:"stores",label:"Available Stores"},{value:"reach",label:"Available Reach"},{value:"fill",label:"Fill rate"}],activeTab:l,onTabChange:t})})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
