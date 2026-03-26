import{j as e,r as i}from"./iframe-CHTXZqHT.js";import{S as r}from"./search-input-Hq_yClba.js";import"./preload-helper-PPVm8Dsz.js";import"./input-C563dLlj.js";import"./utils-CBfrqCZ4.js";import"./dropdown-menu-BpjMxfKo.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./index-Csd0mXSg.js";import"./index-DIhyg6RD.js";import"./index-IS2wP4Ks.js";import"./index-C9_Qsora.js";import"./Combination-Cg5hGoMc.js";import"./index-Dv4mTO0q.js";import"./index-B01eqHDT.js";import"./index-BFaNEU3W.js";import"./checkbox-Bt-gaoCs.js";import"./index-BsF0p07j.js";import"./check-B9DH0HFd.js";import"./createLucideIcon-C4RkYYok.js";import"./circle-CrkDz0bp.js";import"./chevron-right-Nj7-Lm2e.js";import"./button-6Pp8Vv4a.js";import"./index-CdJFUDDL.js";import"./chevron-down-D0T9YktY.js";import"./x-CFpX2Oyw.js";import"./search-EiEHQMi5.js";const F={title:"UI/Search Input",component:r,parameters:{layout:"centered",docs:{description:{component:`
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
