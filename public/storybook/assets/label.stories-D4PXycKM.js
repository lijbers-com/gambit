import{j as e}from"./iframe-DIN2IKqe.js";import{L as r}from"./label-BuLnL_vU.js";import{I as n}from"./input-Byogsn8g.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DjuRppva.js";import"./index-C8pd1VWv.js";import"./index-D93m9KRt.js";import"./index-BrN91Rgp.js";import"./index-CdJFUDDL.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-dbnqWaiD.js";import"./index-DywWKZUd.js";import"./index-Du2gMQwv.js";import"./index-X7hHvCXq.js";import"./index-Br6PxJxS.js";import"./Combination-B4vWFPwN.js";import"./index-BEqAkVqP.js";import"./index-DNa-te7d.js";import"./index-vD8Qkz52.js";import"./checkbox-C34OBCE9.js";import"./index-BCdNlN2L.js";import"./check-DcQhNYtI.js";import"./createLucideIcon-Buzyb9Q7.js";import"./circle-DmMWJKS7.js";import"./chevron-right-CUD2C_lr.js";import"./button-B9Y0ZSwa.js";import"./chevron-down-Rsxw0oJ3.js";import"./x-B-NQcBKM.js";const _={title:"UI/Label",component:r,parameters:{docs:{page:null},layout:"centered"},tags:["autodocs"],argTypes:{children:{control:{type:"text"}}}},s={args:{children:"Label"}},a={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(r,{htmlFor:"email",children:"Email"}),e.jsx(n,{type:"email",id:"email",placeholder:"Enter your email"})]})},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",id:"terms"}),e.jsx(r,{htmlFor:"terms",children:"Accept terms and conditions"})]})},i={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"radio",id:"option1",name:"options"}),e.jsx(r,{htmlFor:"option1",children:"Option 1"})]})},o={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsxs(r,{htmlFor:"required",children:["Required Field ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(n,{id:"required",placeholder:"This field is required"})]})},d={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(r,{htmlFor:"disabled",className:"text-muted-foreground",children:"Disabled Field"}),e.jsx(n,{id:"disabled",disabled:!0,placeholder:"This input is disabled"})]})},l={args:{children:"This is a very long label text that might wrap to multiple lines and should be handled gracefully by the component"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
