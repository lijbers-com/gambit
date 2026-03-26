import{j as e,r as i}from"./iframe-DvKL0w_9.js";import{S as r}from"./search-input-A57EVLBS.js";import"./preload-helper-PPVm8Dsz.js";import"./input-CBnomjHd.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-D5IgHDJS.js";import"./index-DH-oRreP.js";import"./index-zjPiqC4D.js";import"./index-c8TczyEf.js";import"./index-COxQYZsJ.js";import"./index-cUSCOmKM.js";import"./index-CF5fDaZW.js";import"./index-DnLl3Ei0.js";import"./index-DHx-W8w9.js";import"./Combination-B-jfCMot.js";import"./index-4d8l3FI2.js";import"./index-BQ0gwhW0.js";import"./index-CGKGO6yD.js";import"./checkbox--WHKG7t-.js";import"./index-Ud09Nppy.js";import"./check-Cmreq_tW.js";import"./createLucideIcon-DN8XCnB-.js";import"./circle-DwGOr8Je.js";import"./chevron-right-CHIBhS7m.js";import"./button-oxyhV2g6.js";import"./index-CdJFUDDL.js";import"./chevron-down-NXkMBHE3.js";import"./x-DXIOgXXH.js";import"./search-Dpj4_yN2.js";const F={title:"UI/Search Input",component:r,parameters:{layout:"centered",docs:{description:{component:`
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
