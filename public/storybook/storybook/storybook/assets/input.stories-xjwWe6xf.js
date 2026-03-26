import{j as e,R as b}from"./iframe-DvKL0w_9.js";import{I as h,F as v}from"./input-CBnomjHd.js";import{L as g}from"./label-w-PFhKxu.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-D5IgHDJS.js";import"./index-DH-oRreP.js";import"./index-zjPiqC4D.js";import"./index-c8TczyEf.js";import"./index-COxQYZsJ.js";import"./index-cUSCOmKM.js";import"./index-CF5fDaZW.js";import"./index-DnLl3Ei0.js";import"./index-DHx-W8w9.js";import"./Combination-B-jfCMot.js";import"./index-4d8l3FI2.js";import"./index-BQ0gwhW0.js";import"./index-CGKGO6yD.js";import"./checkbox--WHKG7t-.js";import"./index-Ud09Nppy.js";import"./check-Cmreq_tW.js";import"./createLucideIcon-DN8XCnB-.js";import"./circle-DwGOr8Je.js";import"./chevron-right-CHIBhS7m.js";import"./button-oxyhV2g6.js";import"./index-CdJFUDDL.js";import"./chevron-down-NXkMBHE3.js";import"./x-DXIOgXXH.js";const A={title:"UI/Input",component:h,parameters:{docs:{page:null},layout:"centered"},tags:["autodocs"],argTypes:{type:{control:{type:"select"},options:["text","email","password","number","tel","url","search"]},placeholder:{control:{type:"text"}},disabled:{control:{type:"boolean"}}}},r={args:{placeholder:"Enter text..."}},a={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(g,{htmlFor:"email",children:"Email"}),e.jsx(h,{type:"email",id:"email",placeholder:"Enter your email"})]})},s={args:{type:"password",placeholder:"Enter password..."}},t={args:{type:"email",placeholder:"Enter email..."}},o={args:{type:"number",placeholder:"Enter number..."}},n={args:{type:"search",placeholder:"Search..."}},l={args:{disabled:!0,placeholder:"Disabled input"}},i={args:{value:"Pre-filled value",placeholder:"Enter text..."}},p={render:()=>e.jsx("div",{className:"w-full max-w-xl",children:e.jsx(v,{label:"File",hint:"You can upload PNG, JPG, or GIF files. Max size: 5MB.",className:"w-full"})})},c={args:{type:"date"}},m={args:{type:"time"}},d={render:()=>{const[w,x]=b.useState(void 0);return e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(g,{htmlFor:"dropdown",children:"Dropdown"}),e.jsx(h,{dropdown:!0,options:[{label:"Option 1",value:"option1"},{label:"Option 2",value:"option2"},{label:"Option 3",value:"option3"}],value:w,onChange:x,placeholder:"Select an option"})]})}},u={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(g,{htmlFor:"with-hint",children:"Web landing parameter"}),e.jsx(h,{id:"with-hint",placeholder:"Enter parameter",hint:"This is a hint for extra info or error message."})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password...'
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'Enter email...'
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'number',
    placeholder: 'Enter number...'
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search...'
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: 'Disabled input'
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'Pre-filled value',
    placeholder: 'Enter text...'
  }
}`,...i.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-xl">
      <FileInput label="File" hint="You can upload PNG, JPG, or GIF files. Max size: 5MB." className="w-full" />
    </div>
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'date'
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'time'
  }
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState<string | undefined>(undefined);
    return <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="dropdown">Dropdown</Label>
        <Input dropdown options={[{
        label: 'Option 1',
        value: 'option1'
      }, {
        label: 'Option 2',
        value: 'option2'
      }, {
        label: 'Option 3',
        value: 'option3'
      }]} value={value} onChange={setValue} placeholder="Select an option" />
      </div>;
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="with-hint">Web landing parameter</Label>
      <Input id="with-hint" placeholder="Enter parameter" hint="This is a hint for extra info or error message." />
    </div>
}`,...u.parameters?.docs?.source}}};const K=["Default","WithLabel","Password","Email","Number","Search","Disabled","WithValue","File","Date","Time","Dropdown","WithHint"];export{c as Date,r as Default,l as Disabled,d as Dropdown,t as Email,p as File,o as Number,s as Password,n as Search,m as Time,u as WithHint,a as WithLabel,i as WithValue,K as __namedExportsOrder,A as default};
