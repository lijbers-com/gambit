import{j as e,r as i}from"./iframe-kMwc57NQ.js";import{S as r}from"./search-input-BpIRj-LJ.js";import"./preload-helper-PPVm8Dsz.js";import"./input-Dy7wjhtJ.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-CEgAEpmX.js";import"./index-CDK8-NUj.js";import"./index-Bo3Clklg.js";import"./index-DOXTHwO9.js";import"./index-BoqR-WWR.js";import"./index-BBE6OHCH.js";import"./index-eLNRRPGY.js";import"./index-c72aXvQd.js";import"./index-Bi6bXTBS.js";import"./Combination-C5MNOf4_.js";import"./index-bMwaxSzY.js";import"./index-DpDPOQ2h.js";import"./index-DjVb1jZ5.js";import"./checkbox-kNdyylnl.js";import"./index-Cl3YdfkZ.js";import"./check-CwyobKrx.js";import"./createLucideIcon-SSdVYwtx.js";import"./circle-D6aeAbZN.js";import"./chevron-right-idmTSYJc.js";import"./button-FpfrwFWj.js";import"./index-CdJFUDDL.js";import"./chevron-down-BJIDV8wX.js";import"./x-DZvc5uvK.js";import"./search-BEIn4agr.js";const F={title:"UI/Search Input",component:r,parameters:{layout:"centered",docs:{description:{component:`
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
