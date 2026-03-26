import{j as e}from"./iframe-kMwc57NQ.js";import{L as r}from"./label-D48QEFNC.js";import{I as n}from"./input-Dy7wjhtJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bo3Clklg.js";import"./index-DOXTHwO9.js";import"./index-BoqR-WWR.js";import"./index-BBE6OHCH.js";import"./index-CdJFUDDL.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-CEgAEpmX.js";import"./index-CDK8-NUj.js";import"./index-eLNRRPGY.js";import"./index-c72aXvQd.js";import"./index-Bi6bXTBS.js";import"./Combination-C5MNOf4_.js";import"./index-bMwaxSzY.js";import"./index-DpDPOQ2h.js";import"./index-DjVb1jZ5.js";import"./checkbox-kNdyylnl.js";import"./index-Cl3YdfkZ.js";import"./check-CwyobKrx.js";import"./createLucideIcon-SSdVYwtx.js";import"./circle-D6aeAbZN.js";import"./chevron-right-idmTSYJc.js";import"./button-FpfrwFWj.js";import"./chevron-down-BJIDV8wX.js";import"./x-DZvc5uvK.js";const _={title:"UI/Label",component:r,parameters:{docs:{page:null},layout:"centered"},tags:["autodocs"],argTypes:{children:{control:{type:"text"}}}},s={args:{children:"Label"}},a={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(r,{htmlFor:"email",children:"Email"}),e.jsx(n,{type:"email",id:"email",placeholder:"Enter your email"})]})},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",id:"terms"}),e.jsx(r,{htmlFor:"terms",children:"Accept terms and conditions"})]})},i={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"radio",id:"option1",name:"options"}),e.jsx(r,{htmlFor:"option1",children:"Option 1"})]})},o={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsxs(r,{htmlFor:"required",children:["Required Field ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(n,{id:"required",placeholder:"This field is required"})]})},d={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(r,{htmlFor:"disabled",className:"text-muted-foreground",children:"Disabled Field"}),e.jsx(n,{id:"disabled",disabled:!0,placeholder:"This input is disabled"})]})},l={args:{children:"This is a very long label text that might wrap to multiple lines and should be handled gracefully by the component"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Label'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <input type="checkbox" id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">
      <input type="radio" id="option1" name="options" />
      <Label htmlFor="option1">Option 1</Label>
    </div>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required">
        Required Field <span className="text-red-500">*</span>
      </Label>
      <Input id="required" placeholder="This field is required" />
    </div>
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled" className="text-muted-foreground">
        Disabled Field
      </Label>
      <Input id="disabled" disabled placeholder="This input is disabled" />
    </div>
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'This is a very long label text that might wrap to multiple lines and should be handled gracefully by the component'
  }
}`,...l.parameters?.docs?.source}}};const U=["Default","WithInput","WithCheckbox","WithRadio","Required","Disabled","LongText"];export{s as Default,d as Disabled,l as LongText,o as Required,t as WithCheckbox,a as WithInput,i as WithRadio,U as __namedExportsOrder,_ as default};
