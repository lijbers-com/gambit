import{j as e}from"./iframe-CXx92WiO.js";import{L as r}from"./label-BwDZD5P1.js";import{I as n}from"./input-CSdJE6IY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dbh45AW3.js";import"./index-h1nIrFWq.js";import"./index-B5mXDP2d.js";import"./index-CMP_gnTw.js";import"./index-CdJFUDDL.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-CIgH4XpN.js";import"./index-DXKissID.js";import"./index-CMeRAYnL.js";import"./index-B1g_gBcA.js";import"./index-CiE_1Aax.js";import"./Combination-CdYqdelZ.js";import"./index-CfPW2CYo.js";import"./index-B3wPngdq.js";import"./index-B_MDKxx5.js";import"./checkbox-Czo-grmd.js";import"./index-IM8qODy1.js";import"./check-B7e4BBHi.js";import"./createLucideIcon-CIL_fWej.js";import"./circle-YiYbFBT2.js";import"./chevron-right-rS_I9gWT.js";import"./button-C1eHidSJ.js";import"./chevron-down-Bljws-eu.js";import"./x-DBJkAq3s.js";const _={title:"UI/Label",component:r,parameters:{docs:{page:null},layout:"centered"},tags:["autodocs"],argTypes:{children:{control:{type:"text"}}}},s={args:{children:"Label"}},a={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(r,{htmlFor:"email",children:"Email"}),e.jsx(n,{type:"email",id:"email",placeholder:"Enter your email"})]})},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",id:"terms"}),e.jsx(r,{htmlFor:"terms",children:"Accept terms and conditions"})]})},i={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"radio",id:"option1",name:"options"}),e.jsx(r,{htmlFor:"option1",children:"Option 1"})]})},o={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsxs(r,{htmlFor:"required",children:["Required Field ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(n,{id:"required",placeholder:"This field is required"})]})},d={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm items-center gap-1.5",children:[e.jsx(r,{htmlFor:"disabled",className:"text-muted-foreground",children:"Disabled Field"}),e.jsx(n,{id:"disabled",disabled:!0,placeholder:"This input is disabled"})]})},l={args:{children:"This is a very long label text that might wrap to multiple lines and should be handled gracefully by the component"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
