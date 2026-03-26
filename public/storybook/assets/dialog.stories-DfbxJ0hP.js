import{j as e}from"./iframe-CHTXZqHT.js";import{D as a,a as o,b as t,c as r,d as n,e as s,f as p}from"./dialog-DrtAEImX.js";import{B as i}from"./button-6Pp8Vv4a.js";import"./preload-helper-PPVm8Dsz.js";import"./index-ZDUKtYTy.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-Csd0mXSg.js";import"./index-IS2wP4Ks.js";import"./Combination-Cg5hGoMc.js";import"./index-C9_Qsora.js";import"./index-BFaNEU3W.js";import"./utils-CBfrqCZ4.js";import"./x-CFpX2Oyw.js";import"./createLucideIcon-C4RkYYok.js";import"./index-CdJFUDDL.js";const k={title:"UI/Dialog",component:a,parameters:{layout:"centered"},tags:["autodocs"]},l={render:()=>e.jsxs(a,{children:[e.jsx(o,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Open Dialog"})}),e.jsxs(t,{className:"sm:max-w-[425px]",children:[e.jsxs(r,{children:[e.jsx(n,{children:"Edit profile"}),e.jsx(s,{children:"Make changes to your profile here. Click save when you're done."})]}),e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx("label",{htmlFor:"name",className:"text-right",children:"Name"}),e.jsx("input",{id:"name",defaultValue:"Pedro Duarte",className:"col-span-3"})]}),e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx("label",{htmlFor:"username",className:"text-right",children:"Username"}),e.jsx("input",{id:"username",defaultValue:"@peduarte",className:"col-span-3"})]})]}),e.jsx(p,{children:e.jsx(i,{type:"submit",children:"Save changes"})})]})]})},c={render:()=>e.jsxs(a,{children:[e.jsx(o,{asChild:!0,children:e.jsx(i,{children:"Simple Dialog"})}),e.jsx(t,{children:e.jsxs(r,{children:[e.jsx(n,{children:"Simple Dialog"}),e.jsx(s,{children:"This is a simple dialog with just a title and description."})]})})]})},d={render:()=>e.jsxs(a,{children:[e.jsx(o,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Dialog without Footer"})}),e.jsxs(t,{children:[e.jsxs(r,{children:[e.jsx(n,{children:"No Footer"}),e.jsx(s,{children:"This dialog doesn't have a footer with action buttons."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{children:"Content goes here..."})})]})]})},g={render:()=>e.jsxs(a,{children:[e.jsx(o,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Multiple Actions"})}),e.jsxs(t,{children:[e.jsxs(r,{children:[e.jsx(n,{children:"Confirm Action"}),e.jsx(s,{children:"Are you sure you want to perform this action? This cannot be undone."})]}),e.jsxs(p,{className:"flex justify-between",children:[e.jsx(i,{variant:"outline",children:"Cancel"}),e.jsx(i,{variant:"destructive",children:"Delete"})]})]})]})},m={render:()=>e.jsxs(a,{children:[e.jsx(o,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Large Content"})}),e.jsxs(t,{className:"sm:max-w-[600px]",children:[e.jsxs(r,{children:[e.jsx(n,{children:"Large Content Dialog"}),e.jsx(s,{children:"This dialog contains a lot of content to demonstrate scrolling behavior."})]}),e.jsx("div",{className:"max-h-[400px] overflow-y-auto",children:e.jsx("div",{className:"space-y-4",children:Array.from({length:20},(h,u)=>e.jsxs("div",{className:"p-4 border rounded",children:[e.jsxs("h4",{className:"font-medium",children:["Section ",u+1]}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["This is content for section ",u+1,". Lorem ipsum dolor sit amet, consectetur adipiscing elit."]})]},u))})}),e.jsx(p,{children:e.jsx(i,{children:"Save"})})]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right">
              Username
            </label>
            <input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>Simple Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
          <DialogDescription>
            This is a simple dialog with just a title and description.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Dialog without Footer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>No Footer</DialogTitle>
          <DialogDescription>
            This dialog doesn't have a footer with action buttons.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Content goes here...</p>
        </div>
      </DialogContent>
    </Dialog>
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Multiple Actions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to perform this action? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...g.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Large Content</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Large Content Dialog</DialogTitle>
          <DialogDescription>
            This dialog contains a lot of content to demonstrate scrolling behavior.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {Array.from({
            length: 20
          }, (_, i) => <div key={i} className="p-4 border rounded">
                <h4 className="font-medium">Section {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  This is content for section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>)}
          </div>
        </div>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...m.parameters?.docs?.source}}};const E=["Default","Simple","WithoutFooter","WithMultipleActions","LargeContent"];export{l as Default,m as LargeContent,c as Simple,g as WithMultipleActions,d as WithoutFooter,E as __namedExportsOrder,k as default};
