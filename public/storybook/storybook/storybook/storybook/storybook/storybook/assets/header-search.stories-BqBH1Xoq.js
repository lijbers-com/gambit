import{j as e}from"./iframe-B2sv3z--.js";import{a as d,H as c}from"./header-actions-tRbzyRrb.js";import{d as s}from"./default-routes-CqolUEBP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-CuPAXXHd.js";import"./index-ojs0XM5b.js";import"./index-CdJFUDDL.js";import"./popover-BZWdwQcX.js";import"./index-DehB9XTy.js";import"./index-CFhbmjQN.js";import"./index-DGA11cGX.js";import"./index-dFd8z_VS.js";import"./Combination-CVHJjhEU.js";import"./index-BOcI3EBp.js";import"./index-BHEqwGAn.js";import"./index-BBKt_i3X.js";import"./index-CYk8cACR.js";import"./index-Duqzc3UP.js";import"./render-icon-EYbjJv2z.js";import"./createLucideIcon-Bwht0sgB.js";import"./store-F7RDwBnd.js";import"./monitor-speaker-DOUMcHVE.js";import"./users-O13I7vWA.js";import"./trending-up-DIPn3Qxp.js";import"./settings-2-Dg95SXfj.js";import"./settings-DTWUPnnQ.js";import"./user-DWVaoi2S.js";import"./search-CnB7SJuU.js";import"./building-2-DJtB2wEP.js";const K={title:"UI/Header Search",component:d,parameters:{layout:"centered",docs:{description:{component:`
# Header Search

An expandable search input with categorized autocomplete for the application header. Search across campaigns, bookings, creatives, and pages.

## Features

- **Inline Search Input**: Always visible in the header, expands on focus
- **On-Demand Results**: Autocomplete only shows when user starts typing
- **Categorized Results**: Results grouped by type (Campaigns, Bookings, Creatives, Pages)
- **Status Badges**: Color-coded status indicators for each result
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select
- **Responsive**: Input expands from 176px to 288px on focus

## Usage

\`\`\`tsx
<HeaderSearch routes={routes} placeholder="Search..." />
\`\`\`

## Keyboard Shortcuts

- \`Arrow Up/Down\` - Navigate results
- \`Enter\` - Select result
- \`Escape\` - Close dropdown
        `}}},tags:["autodocs"],argTypes:{onNavigate:{action:"navigate"},placeholder:{control:"text",description:"Placeholder text for the search input"}}},t={args:{routes:s,placeholder:"Search..."}},a={args:{routes:s,placeholder:"Search campaigns, bookings..."},parameters:{docs:{description:{story:"HeaderSearch with a custom placeholder text."}}}},r={render:()=>e.jsx("div",{className:"w-[600px] bg-white p-4 rounded-lg shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"text-sm text-slate-600",children:[e.jsx("span",{className:"text-slate-900 font-medium",children:"Dashboard"}),e.jsx("span",{className:"mx-2",children:"/"}),e.jsx("span",{children:"Campaigns"})]}),e.jsx(d,{routes:s})]})}),parameters:{docs:{description:{story:"HeaderSearch positioned in header context. Start typing to see autocomplete suggestions."}}}},o={render:()=>e.jsx("div",{className:"w-[700px] bg-white p-4 rounded-lg shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"text-sm text-slate-600",children:[e.jsx("span",{className:"text-slate-900 font-medium",children:"Dashboard"}),e.jsx("span",{className:"mx-2",children:"/"}),e.jsx("span",{children:"Campaigns"})]}),e.jsx(c,{routes:s})]})}),parameters:{docs:{description:{story:"HeaderSearch integrated with HeaderActions showing full header layout."}}}},i={render:()=>e.jsxs("div",{className:"w-[400px]",children:[e.jsx("p",{className:"text-sm text-muted-foreground mb-4",children:"Click on the search input to see it expand and show the autocomplete dropdown."}),e.jsx(d,{routes:s})]}),parameters:{docs:{description:{story:"Interactive demo - click the input to see expand animation and categorized autocomplete."}}}},n={render:()=>e.jsxs("div",{className:"w-[400px]",children:[e.jsx("p",{className:"text-sm text-muted-foreground mb-4",children:'Try searching for: "summer", "running", "banner", or "display"'}),e.jsx(d,{routes:s})]}),parameters:{docs:{description:{story:"Try different search queries to see filtered results across categories."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    routes: defaultRoutes,
    placeholder: 'Search...'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    routes: defaultRoutes,
    placeholder: 'Search campaigns, bookings...'
  },
  parameters: {
    docs: {
      description: {
        story: 'HeaderSearch with a custom placeholder text.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[600px] bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <span className="mx-2">/</span>
          <span>Campaigns</span>
        </div>
        <HeaderSearch routes={defaultRoutes} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'HeaderSearch positioned in header context. Start typing to see autocomplete suggestions.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[700px] bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <span className="mx-2">/</span>
          <span>Campaigns</span>
        </div>
        <HeaderActions routes={defaultRoutes} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'HeaderSearch integrated with HeaderActions showing full header layout.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <p className="text-sm text-muted-foreground mb-4">
        Click on the search input to see it expand and show the autocomplete dropdown.
      </p>
      <HeaderSearch routes={defaultRoutes} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - click the input to see expand animation and categorized autocomplete.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[400px]">
      <p className="text-sm text-muted-foreground mb-4">
        Try searching for: "summer", "running", "banner", or "display"
      </p>
      <HeaderSearch routes={defaultRoutes} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Try different search queries to see filtered results across categories.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};const O=["Default","WithCustomPlaceholder","InHeader","WithHeaderActions","Expanded","SearchResults"];export{t as Default,i as Expanded,r as InHeader,n as SearchResults,a as WithCustomPlaceholder,o as WithHeaderActions,O as __namedExportsOrder,K as default};
