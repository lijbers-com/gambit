import{j as e}from"./iframe-CHTXZqHT.js";import{a as d,H as c}from"./header-actions-DPgT4HM3.js";import{d as s}from"./default-routes-CqolUEBP.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";import"./button-6Pp8Vv4a.js";import"./index-Csd0mXSg.js";import"./index-CdJFUDDL.js";import"./popover-BELfsOx9.js";import"./index-DVh6J3qr.js";import"./index-Bewmt33Y.js";import"./index-CnT3Uich.js";import"./index-Bs7E9PJc.js";import"./Combination-Cg5hGoMc.js";import"./index-C9_Qsora.js";import"./index-IS2wP4Ks.js";import"./index-Dv4mTO0q.js";import"./index-B01eqHDT.js";import"./index-BFaNEU3W.js";import"./render-icon-DLL_fxGu.js";import"./createLucideIcon-C4RkYYok.js";import"./store-BXFWTEpu.js";import"./monitor-speaker-DnNpYfke.js";import"./users-DRel-cDy.js";import"./trending-up-DZqTHBJe.js";import"./settings-2-C7xvQLBW.js";import"./settings-DkrSMDF7.js";import"./user-C3Gu_d3T.js";import"./search-EiEHQMi5.js";import"./building-2-BMUkMO_5.js";const K={title:"UI/Header Search",component:d,parameters:{layout:"centered",docs:{description:{component:`
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
