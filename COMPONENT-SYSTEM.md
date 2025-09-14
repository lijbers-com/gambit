# 🎯 Component System Documentation

## 🔴 **GOLDEN RULE: All components MUST be documented in Storybook**

**If it's not in Storybook, it doesn't exist!**

---

## 📋 **Current Component Status**

### ✅ **Available Components** (Ready for Use)

| Component | Status | Stories | Variants | Description |
|-----------|--------|---------|----------|-------------|
| **Button** | ✅ Ready | ✅ Complete | 6 variants, 4 sizes | Primary action component |
| **Card** | ✅ Ready | ✅ Complete | Header, Content, Footer | Container component |
| **Avatar** | ✅ Ready | ✅ Complete | Image, Fallback, Sizes | User representation |
| **Input** | ✅ Ready | ✅ Complete | 7 types, Error states | Form input component |
| **Label** | ✅ Ready | ✅ Complete | Standard, Required, Disabled | Form label component |

### 🚧 **Components To Add** (Create when needed)

| Priority | Component | Radix Primitive | Use Case |
|----------|-----------|-----------------|----------|
| **High** | Checkbox | `@radix-ui/react-checkbox` | Form controls |
| **High** | Select | `@radix-ui/react-select` | Dropdown selection |
| **High** | Dialog | `@radix-ui/react-dialog` | Modal dialogs |
| **High** | Tooltip | `@radix-ui/react-tooltip` | Contextual help |
| **Medium** | Switch | `@radix-ui/react-switch` | Toggle controls |
| **Medium** | Tabs | `@radix-ui/react-tabs` | Content organization |
| **Medium** | Dropdown Menu | `@radix-ui/react-dropdown-menu` | Context menus |
| **Medium** | Progress | `@radix-ui/react-progress` | Loading states |

---

## 🔄 **Development Workflow**

### **Before Using ANY Component:**

1. **Check Storybook First** 
   ```bash
   npm run storybook
   # Visit http://localhost:6006
   ```

2. **Verify Component Exists**
   ```bash
   npm run check-components
   ```

3. **If Component Missing → Create It**

### **Component Creation Process:**

```bash
# Step 1: Create component
touch src/components/ui/new-component.tsx

# Step 2: Create stories
touch src/components/ui/new-component.stories.tsx

# Step 3: Add to index
# Edit src/components/ui/index.ts

# Step 4: Verify
npm run check-components
npm run storybook
```

---

## 📝 **Component Templates**

### **Component Template:**

```typescript
// src/components/ui/new-component.tsx
import * as React from "react"
import * as RadixComponent from "@radix-ui/react-component"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        default: "default-size",
        sm: "small-size",
        lg: "large-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ComponentProps
  extends React.ComponentPropsWithoutRef<typeof RadixComponent.Root>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<
  React.ElementRef<typeof RadixComponent.Root>,
  ComponentProps
>(({ className, variant, size, ...props }, ref) => (
  <RadixComponent.Root
    ref={ref}
    className={cn(componentVariants({ variant, size, className }))}
    {...props}
  />
))
Component.displayName = RadixComponent.Root.displayName

export { Component, componentVariants }
```

### **Stories Template:**

```typescript
// src/components/ui/new-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Component } from './new-component'

const meta: Meta<typeof Component> = {
  title: 'UI/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Component content',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary variant',
  },
}
```

---

## 🛠️ **Available Scripts**

```bash
# Development
npm run dev              # Start Next.js dev server
npm run storybook        # Start Storybook

# Component Management
npm run check-components # Verify all components have stories
npm run pre-commit      # Run checks before committing

# Build
npm run build           # Build for production
npm run build-storybook # Build Storybook for deployment
```

---

## 🎯 **Quality Checklist**

Before marking a component as "Ready":

### **Component Implementation**
- [ ] Uses Radix UI primitive (if available)
- [ ] Implements CVA for variants
- [ ] Proper TypeScript interfaces
- [ ] forwardRef for ref forwarding
- [ ] Consistent naming conventions
- [ ] Proper displayName

### **Storybook Documentation**
- [ ] All variants documented
- [ ] Interactive controls
- [ ] Multiple story examples
- [ ] Proper categorization (`UI/ComponentName`)
- [ ] Auto-generated docs (`autodocs` tag)

### **Styling & Accessibility**
- [ ] Uses design tokens (CSS variables)
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Accessibility compliant
- [ ] Proper focus states

### **Testing**
- [ ] Component renders in Storybook
- [ ] All variants work correctly
- [ ] Interactive elements function
- [ ] No console errors
- [ ] Proper TypeScript types

---

## 🚨 **Common Mistakes to Avoid**

1. ❌ **Using components without Storybook documentation**
2. ❌ **Creating components without proper variants**
3. ❌ **Not using Radix UI primitives when available**
4. ❌ **Inconsistent naming conventions**
5. ❌ **Missing TypeScript interfaces**
6. ❌ **Not testing in Storybook before use**
7. ❌ **Forgetting to add to index.ts**

---

## 📖 **Resources**

- **[Storybook](http://localhost:6006)** - Component documentation
- **[Radix UI Primitives](https://www.radix-ui.com/primitives)** - Accessible components
- **[Class Variance Authority](https://cva.style/docs)** - Variant management
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling utilities

---

## 🔍 **Verification Commands**

```bash
# Check component status
npm run check-components

# Check what's in Storybook
npm run storybook

# Check what's exported
cat src/components/ui/index.ts

# Manual check for missing stories
ls src/components/ui/*.tsx | grep -v stories
```

---

## 🎉 **Success Criteria**

✅ **All components have Storybook stories**  
✅ **All components are exported in index.ts**  
✅ **All components follow the same pattern**  
✅ **All components are accessible**  
✅ **All components have proper TypeScript support**  

---

**Remember: This system ensures consistency, accessibility, and maintainability across the entire application. Every component must be documented before it can be used!** 