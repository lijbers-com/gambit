import{j as r,r as m}from"./iframe-kMwc57NQ.js";import{F as s}from"./filter-DBn0nYiE.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-FpfrwFWj.js";import"./index-BBE6OHCH.js";import"./index-CdJFUDDL.js";import"./popover-BZtR7h_q.js";import"./index-CDK8-NUj.js";import"./index-Bo3Clklg.js";import"./index-DOXTHwO9.js";import"./index-BoqR-WWR.js";import"./Combination-C5MNOf4_.js";import"./index-Bi6bXTBS.js";import"./index-c72aXvQd.js";import"./index-bMwaxSzY.js";import"./index-DpDPOQ2h.js";import"./index-DjVb1jZ5.js";import"./checkbox-kNdyylnl.js";import"./index-Cl3YdfkZ.js";import"./check-CwyobKrx.js";import"./createLucideIcon-SSdVYwtx.js";import"./x-DZvc5uvK.js";import"./search-BEIn4agr.js";import"./store-DBSSh01E.js";const e=[{label:"Chocomel",value:"chocomel"},{label:"Fristi",value:"fristi"},{label:"Brand",value:"brand"}],U={title:"UI/Filter",component:s,tags:["autodocs"]},a={args:{name:"Brand",options:e}},t={args:{name:"Brand",options:e,selectedValues:["brand"]}},o={args:{name:"Brand",options:e,selectedValues:[]}},n={render:()=>{const[d,i]=m.useState(["chocomel"]);return r.jsx(s,{name:"Brand",options:e,selectedValues:d,onChange:i})}},c={render:()=>{const[d,i]=m.useState(["chocomel","fristi","brand"]);return r.jsx(s,{name:"Brand",options:e,selectedValues:d,onChange:i})}},l={render:()=>r.jsxs("div",{className:"flex flex-col gap-4",children:[r.jsx(s,{name:"Brand",options:e}),r.jsx(s,{name:"Brand",options:e,selectedValues:["brand"]}),r.jsx(s,{name:"Brand",options:e}),r.jsx(s,{name:"Brand",options:e,selectedValues:["chocomel"],onChange:()=>{}}),r.jsx(s,{name:"Brand",options:e,selectedValues:["chocomel","fristi","brand"],onChange:()=>{}}),r.jsx(s,{name:"Brand",options:e})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
