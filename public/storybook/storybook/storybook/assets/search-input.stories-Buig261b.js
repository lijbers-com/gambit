import{j as e,r as i}from"./iframe-B2sv3z--.js";import{S as r}from"./search-input-DSX7Be2G.js";import"./preload-helper-PPVm8Dsz.js";import"./input-ncBsZbtw.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-CS3p5svP.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./index-ojs0XM5b.js";import"./index-G_2NqKkU.js";import"./index-BHEqwGAn.js";import"./index-BOcI3EBp.js";import"./Combination-CVHJjhEU.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./checkbox-DgACiBX7.js";import"./index-CG_rr0_2.js";import"./check-D5-eMeep.js";import"./createLucideIcon-Bwht0sgB.js";import"./circle-CA_9n80i.js";import"./chevron-right-BMhUZwQf.js";import"./button-CuPAXXHd.js";import"./index-CdJFUDDL.js";import"./chevron-down-BepfQlRx.js";import"./x-CbZ9gBzK.js";import"./search-CnB7SJuU.js";const F={title:"UI/Search Input",component:r,parameters:{layout:"centered",docs:{description:{component:`
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
