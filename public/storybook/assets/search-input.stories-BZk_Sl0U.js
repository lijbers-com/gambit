import{j as e,r as i}from"./iframe-CXx92WiO.js";import{S as r}from"./search-input-Drz__yl-.js";import"./preload-helper-PPVm8Dsz.js";import"./input-CSdJE6IY.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-CIgH4XpN.js";import"./index-DXKissID.js";import"./index-Dbh45AW3.js";import"./index-h1nIrFWq.js";import"./index-B5mXDP2d.js";import"./index-CMP_gnTw.js";import"./index-CMeRAYnL.js";import"./index-B1g_gBcA.js";import"./index-CiE_1Aax.js";import"./Combination-CdYqdelZ.js";import"./index-CfPW2CYo.js";import"./index-B3wPngdq.js";import"./index-B_MDKxx5.js";import"./checkbox-Czo-grmd.js";import"./index-IM8qODy1.js";import"./check-B7e4BBHi.js";import"./createLucideIcon-CIL_fWej.js";import"./circle-YiYbFBT2.js";import"./chevron-right-rS_I9gWT.js";import"./button-C1eHidSJ.js";import"./index-CdJFUDDL.js";import"./chevron-down-Bljws-eu.js";import"./x-DBJkAq3s.js";import"./search-B_34V_bt.js";const F={title:"UI/Search Input",component:r,parameters:{layout:"centered",docs:{description:{component:`
# Search Input

A reusable search input component with search icon and clear button.

## Features

- **Search Icon**: Left-aligned search icon for visual affordance
- **Clear Button**: X button appears when input has value
- **Controlled/Uncontrolled**: Supports both modes
- **Custom Icon**: Optional custom icon prop

## Usage

\`\`\`tsx
<SearchInput
  placeholder="Search..."
  onChange={(e) => console.log(e.target.value)}
/>
\`\`\`
        `}}},tags:["autodocs"],argTypes:{placeholder:{control:"text",description:"Placeholder text for the input"},value:{control:"text",description:"Controlled value of the input"},onChange:{action:"changed",description:"Callback when input value changes"},className:{control:"text",description:"Additional CSS classes"}}},a={args:{placeholder:"Search..."}},t={args:{placeholder:"Search campaigns, creatives, and more..."},parameters:{docs:{description:{story:"SearchInput with a descriptive placeholder."}}}},o={args:{placeholder:"Search...",defaultValue:"Campaign"},parameters:{docs:{description:{story:"SearchInput with a pre-filled value showing the clear button."}}}},s={render:function(){const[n,p]=i.useState("");return e.jsxs("div",{className:"w-80",children:[e.jsx(r,{value:n,onChange:l=>p(l.target.value),placeholder:"Type to search..."}),e.jsxs("p",{className:"mt-2 text-sm text-muted-foreground",children:["Value: ",n||"(empty)"]})]})},parameters:{docs:{description:{story:"Controlled SearchInput with external state management."}}}},c={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(r,{placeholder:"Small (w-48)",className:"w-48"}),e.jsx(r,{placeholder:"Medium (w-64)",className:"w-64"}),e.jsx(r,{placeholder:"Large (w-96)",className:"w-96"})]}),parameters:{docs:{description:{story:"SearchInput with different widths using className."}}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...'
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search campaigns, creatives, and more...'
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchInput with a descriptive placeholder.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...',
    defaultValue: 'Campaign'
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchInput with a pre-filled value showing the clear button.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: function ControlledSearchInput() {
    const [value, setValue] = useState('');
    return <div className="w-80">
        <SearchInput value={value} onChange={e => setValue(e.target.value)} placeholder="Type to search..." />
        <p className="mt-2 text-sm text-muted-foreground">
          Value: {value || '(empty)'}
        </p>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled SearchInput with external state management.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <SearchInput placeholder="Small (w-48)" className="w-48" />
      <SearchInput placeholder="Medium (w-64)" className="w-64" />
      <SearchInput placeholder="Large (w-96)" className="w-96" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'SearchInput with different widths using className.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};const R=["Default","WithPlaceholder","WithValue","Controlled","CustomWidth"];export{s as Controlled,c as CustomWidth,a as Default,t as WithPlaceholder,o as WithValue,R as __namedExportsOrder,F as default};
