import{j as e,R as b}from"./iframe-CHTXZqHT.js";import{I as h,F as v}from"./input-C563dLlj.js";import{L as g}from"./label-n8K7ANyR.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-BpjMxfKo.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-Csd0mXSg.js";import"./index-DIhyg6RD.js";import"./index-IS2wP4Ks.js";import"./index-C9_Qsora.js";import"./Combination-Cg5hGoMc.js";import"./index-Dv4mTO0q.js";import"./index-B01eqHDT.js";import"./index-BFaNEU3W.js";import"./checkbox-Bt-gaoCs.js";import"./index-BsF0p07j.js";import"./check-B9DH0HFd.js";import"./createLucideIcon-C4RkYYok.js";import"./circle-CrkDz0bp.js";import"./chevron-right-Nj7-Lm2e.js";import"./button-6Pp8Vv4a.js";import"./index-CdJFUDDL.js";import"./chevron-down-D0T9YktY.js";import"./x-CFpX2Oyw.js";const A={title:"UI/Input",component:h,parameters:{docs:{page:null},layout:"centered"},tags:["autodocs"],argTypes:{type:{control:{type:"select"},options:["text","email","password","number","tel","url","search"]},placeholder:{control:{type:"text"}},disabled:{control:{type:"boolean"}}}},r={args:{placeholder:"Enter text..."}},a={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(g,{htmlFor:"email",children:"Email"}),e.jsx(h,{type:"email",id:"email",placeholder:"Enter your email"})]})},s={args:{type:"password",placeholder:"Enter password..."}},t={args:{type:"email",placeholder:"Enter email..."}},o={args:{type:"number",placeholder:"Enter number..."}},n={args:{type:"search",placeholder:"Search..."}},l={args:{disabled:!0,placeholder:"Disabled input"}},i={args:{value:"Pre-filled value",placeholder:"Enter text..."}},p={render:()=>e.jsx("div",{className:"w-full max-w-xl",children:e.jsx(v,{label:"File",hint:"You can upload PNG, JPG, or GIF files. Max size: 5MB.",className:"w-full"})})},c={args:{type:"date"}},m={args:{type:"time"}},d={render:()=>{const[w,x]=b.useState(void 0);return e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(g,{htmlFor:"dropdown",children:"Dropdown"}),e.jsx(h,{dropdown:!0,options:[{label:"Option 1",value:"option1"},{label:"Option 2",value:"option2"},{label:"Option 3",value:"option3"}],value:w,onChange:x,placeholder:"Select an option"})]})}},u={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(g,{htmlFor:"with-hint",children:"Web landing parameter"}),e.jsx(h,{id:"with-hint",placeholder:"Enter parameter",hint:"This is a hint for extra info or error message."})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
