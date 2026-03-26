import{j as e}from"./iframe-C5bSqRdg.js";import{P as n,a as o,b as l}from"./popover-CtRsAG4M.js";import{B as s}from"./button-CMihJ9pV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DD08fZIQ.js";import"./index-DAh0e16s.js";import"./index-Z2B8irzh.js";import"./index-gOg22guj.js";import"./index-DJEyZNpx.js";import"./Combination-BPLtMwXH.js";import"./index-4SfGeEia.js";import"./index-BDa5FaKX.js";import"./index-DELDvHLi.js";import"./index-C48yRfEQ.js";import"./index-7AEp8Dl6.js";import"./utils-CBfrqCZ4.js";import"./index-CdJFUDDL.js";const b={title:"UI/Popover",component:n,parameters:{layout:"centered"},tags:["autodocs"]},t={render:()=>e.jsxs(n,{children:[e.jsx(o,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Open popover"})}),e.jsx(l,{className:"w-80",children:e.jsxs("div",{className:"grid gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium leading-none",children:"Dimensions"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Set the dimensions for the layer."})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx("label",{htmlFor:"width",children:"Width"}),e.jsx("input",{id:"width",defaultValue:"100%",className:"col-span-2 h-8"})]}),e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx("label",{htmlFor:"maxWidth",children:"Max. width"}),e.jsx("input",{id:"maxWidth",defaultValue:"300px",className:"col-span-2 h-8"})]}),e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx("label",{htmlFor:"height",children:"Height"}),e.jsx("input",{id:"height",defaultValue:"25px",className:"col-span-2 h-8"})]}),e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx("label",{htmlFor:"maxHeight",children:"Max. height"}),e.jsx("input",{id:"maxHeight",defaultValue:"none",className:"col-span-2 h-8"})]})]})]})})]})},a={render:()=>e.jsxs(n,{children:[e.jsx(o,{asChild:!0,children:e.jsx(s,{children:"Simple Popover"})}),e.jsx(l,{children:e.jsx("p",{children:"This is a simple popover with just text content."})})]})},i={render:()=>e.jsxs(n,{children:[e.jsx(o,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Actions"})}),e.jsx(l,{className:"w-80",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Actions"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Choose an action to perform."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{className:"w-full justify-start",variant:"ghost",children:"Edit"}),e.jsx(s,{className:"w-full justify-start",variant:"ghost",children:"Copy"}),e.jsx(s,{className:"w-full justify-start",variant:"ghost",children:"Delete"})]})]})})]})},r={render:()=>e.jsxs(n,{children:[e.jsx(o,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"Aligned End"})}),e.jsx(l,{className:"w-80",align:"end",children:e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium",children:"Aligned End"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"This popover is aligned to the end."})]})})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width">Width</label>
              <input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="maxWidth">Max. width</label>
              <input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="height">Height</label>
              <input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="maxHeight">Max. height</label>
              <input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button>Simple Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>This is a simple popover with just text content.</p>
      </PopoverContent>
    </Popover>
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Actions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Actions</h4>
            <p className="text-sm text-muted-foreground">
              Choose an action to perform.
            </p>
          </div>
          <div className="space-y-2">
            <Button className="w-full justify-start" variant="ghost">
              Edit
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              Copy
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Aligned End</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Aligned End</h4>
            <p className="text-sm text-muted-foreground">
              This popover is aligned to the end.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
}`,...r.parameters?.docs?.source}}};const T=["Default","Simple","WithActions","AlignedEnd"];export{r as AlignedEnd,t as Default,a as Simple,i as WithActions,T as __namedExportsOrder,b as default};
