import{j as r,r as m}from"./iframe-BVumAmaP.js";import{F as s}from"./filter-k6SaYIKA.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-C0Q2-t8z.js";import"./index-CYMrhGm5.js";import"./index-CdJFUDDL.js";import"./popover-Hr_nuNGy.js";import"./index-Xio54jsv.js";import"./index-CdIZDn3i.js";import"./index-CpQ2v_Rl.js";import"./index-Yd78ZJXV.js";import"./Combination-BERpo1ez.js";import"./index-uq_WHOCh.js";import"./index-D0nTNiYe.js";import"./index-B2zTIoeG.js";import"./index-DYiruaZ0.js";import"./index-CuMwnqbd.js";import"./checkbox-gqmVE3EZ.js";import"./index-DAuT_Ewe.js";import"./check-ICOllTtP.js";import"./createLucideIcon-olMS5pkE.js";import"./x-Cf_KK5yw.js";import"./search-DpFzmuoT.js";import"./store-CKs962OE.js";const e=[{label:"Chocomel",value:"chocomel"},{label:"Fristi",value:"fristi"},{label:"Brand",value:"brand"}],U={title:"UI/Filter",component:s,tags:["autodocs"]},a={args:{name:"Brand",options:e}},t={args:{name:"Brand",options:e,selectedValues:["brand"]}},o={args:{name:"Brand",options:e,selectedValues:[]}},n={render:()=>{const[d,i]=m.useState(["chocomel"]);return r.jsx(s,{name:"Brand",options:e,selectedValues:d,onChange:i})}},c={render:()=>{const[d,i]=m.useState(["chocomel","fristi","brand"]);return r.jsx(s,{name:"Brand",options:e,selectedValues:d,onChange:i})}},l={render:()=>r.jsxs("div",{className:"flex flex-col gap-4",children:[r.jsx(s,{name:"Brand",options:e}),r.jsx(s,{name:"Brand",options:e,selectedValues:["brand"]}),r.jsx(s,{name:"Brand",options:e}),r.jsx(s,{name:"Brand",options:e,selectedValues:["chocomel"],onChange:()=>{}}),r.jsx(s,{name:"Brand",options:e,selectedValues:["chocomel","fristi","brand"],onChange:()=>{}}),r.jsx(s,{name:"Brand",options:e})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Brand',
    options
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Brand',
    options,
    selectedValues: ['brand']
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Brand',
    options,
    selectedValues: []
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState(['chocomel']);
    return <Filter name="Brand" options={options} selectedValues={selected} onChange={setSelected} />;
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState(['chocomel', 'fristi', 'brand']);
    return <Filter name="Brand" options={options} selectedValues={selected} onChange={setSelected} />;
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Filter name="Brand" options={options} />
      <Filter name="Brand" options={options} selectedValues={['brand']} />
      <Filter name="Brand" options={options} />
      <Filter name="Brand" options={options} selectedValues={['chocomel']} onChange={() => {}} />
      <Filter name="Brand" options={options} selectedValues={['chocomel', 'fristi', 'brand']} onChange={() => {}} />
      <Filter name="Brand" options={options} />
    </div>
}`,...l.parameters?.docs?.source}}};const k=["Default","Selected","Disabled","WithRemove","MultiLabel","AllStates"];export{l as AllStates,a as Default,o as Disabled,c as MultiLabel,t as Selected,n as WithRemove,k as __namedExportsOrder,U as default};
