import{j as e}from"./iframe-kMwc57NQ.js";import{L as t}from"./logo-DFh9jCVE.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CBfrqCZ4.js";const d={title:"UI/Logo",component:t,parameters:{layout:"centered",docs:{description:{component:`
# Logo Component

The Logo component displays either the Gambit or Albert Heijn logo based on the current theme. It supports automatic theme detection and manual theme selection.

## Features

- **Theme-based Logo Switching**: Automatically displays the appropriate logo based on theme
- **Auto Detection**: Detects theme from CSS variables, data attributes, or class names
- **Manual Override**: Can be explicitly set to display a specific logo
- **Fixed Size**: Consistent 40×40 pixel dimensions
- **Color Adaptation**: Albert Heijn logo displays in white for AH theme
- **Clickable**: Optional click handler for navigation
- **Optimized**: Uses Next.js Image component for performance

## Theme Detection

The component detects themes in the following order:
1. **CSS Custom Property**: \`--brand-theme: albert-heijn | gambit\`
2. **Data Attributes**: \`data-theme="albert-heijn"\` on html or body
3. **CSS Classes**: \`.albert-heijn\` or \`.ah-theme\` on html or body
4. **Default**: Falls back to Gambit logo

## Usage Examples

\`\`\`tsx
// Auto-detect theme (default)
<Logo />

// Explicit theme
<Logo theme="albert-heijn" />

// With click handler
<Logo onClick={() => router.push('/')} />
\`\`\`

## Available Themes

- **gambit**: Displays the Gambit logo (\`/gambit-logo.svg\`)
- **albert-heijn**: Displays the Albert Heijn logo (\`/ah-logo.svg\`)
- **auto**: Automatically detects theme (default)
        `}}},tags:["autodocs"],argTypes:{theme:{control:"select",options:["auto","gambit","albert-heijn"],description:"Theme type that determines which logo to display",defaultValue:"auto"},variant:{control:"select",options:["auto","white","blue","original"],description:"Color variant for the logo",defaultValue:"auto"},alt:{control:"text",description:"Alternative text for the logo"},className:{control:"text",description:"Additional CSS classes"}}},a={args:{}},o={args:{theme:"gambit"},parameters:{docs:{description:{story:"Explicit Gambit logo display. This is the default logo for the Gambit theme."}}}},r={args:{theme:"albert-heijn"},parameters:{docs:{description:{story:"Explicit Albert Heijn logo display in white (default AH variant). Used when the theme is set to Albert Heijn."}}}},s={args:{theme:"albert-heijn",variant:"blue"},parameters:{docs:{description:{story:"Albert Heijn logo in blue (#00ADE6). Perfect for login pages and light backgrounds."}}}},i={args:{theme:"gambit",onClick:()=>alert("Logo clicked! In a real app, this would navigate to home.")},parameters:{docs:{description:{story:"Clickable logo with cursor pointer. Typically used for navigation to home page."}}}},n={render:()=>e.jsxs("div",{className:"flex gap-6 items-center flex-wrap",children:[e.jsxs("div",{className:"text-center",children:[e.jsx(t,{theme:"gambit"}),e.jsx("p",{className:"mt-2 text-sm text-gray-600",children:"Gambit (Original)"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{theme:"albert-heijn",variant:"white"}),e.jsx("p",{className:"mt-2 text-sm text-gray-600",children:"AH (White)"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{theme:"albert-heijn",variant:"blue"}),e.jsx("p",{className:"mt-2 text-sm text-gray-600",children:"AH (Blue)"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{theme:"albert-heijn",variant:"original"}),e.jsx("p",{className:"mt-2 text-sm text-gray-600",children:"AH (Original)"})]})]}),parameters:{docs:{description:{story:"Comparison of all logo variants showing theme and color combinations. Blue variant is perfect for login pages."}}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'gambit'
  },
  parameters: {
    docs: {
      description: {
        story: 'Explicit Gambit logo display. This is the default logo for the Gambit theme.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'albert-heijn'
  },
  parameters: {
    docs: {
      description: {
        story: 'Explicit Albert Heijn logo display in white (default AH variant). Used when the theme is set to Albert Heijn.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'albert-heijn',
    variant: 'blue'
  },
  parameters: {
    docs: {
      description: {
        story: 'Albert Heijn logo in blue (#00ADE6). Perfect for login pages and light backgrounds.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'gambit',
    onClick: () => alert('Logo clicked! In a real app, this would navigate to home.')
  },
  parameters: {
    docs: {
      description: {
        story: 'Clickable logo with cursor pointer. Typically used for navigation to home page.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-6 items-center flex-wrap">
      <div className="text-center">
        <Logo theme="gambit" />
        <p className="mt-2 text-sm text-gray-600">Gambit (Original)</p>
      </div>
      <div className="text-center">
        <Logo theme="albert-heijn" variant="white" />
        <p className="mt-2 text-sm text-gray-600">AH (White)</p>
      </div>
      <div className="text-center">
        <Logo theme="albert-heijn" variant="blue" />
        <p className="mt-2 text-sm text-gray-600">AH (Blue)</p>
      </div>
      <div className="text-center">
        <Logo theme="albert-heijn" variant="original" />
        <p className="mt-2 text-sm text-gray-600">AH (Original)</p>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all logo variants showing theme and color combinations. Blue variant is perfect for login pages.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};const h=["Default","GambitLogo","AlbertHeijnLogo","AlbertHeijnBlue","Clickable","Comparison"];export{s as AlbertHeijnBlue,r as AlbertHeijnLogo,i as Clickable,n as Comparison,a as Default,o as GambitLogo,h as __namedExportsOrder,d as default};
