# Component Management System

## 🔴 CRITICAL RULE: All components MUST be documented in Storybook

**Before using any component, it MUST exist in Storybook with proper documentation.**

## 📁 Directory Structure

```
src/components/
├── ui/                     # All UI components
│   ├── index.ts           # Export all components
│   ├── button.tsx         # Component implementation
│   ├── button.stories.tsx # Storybook documentation
│   ├── card.tsx
│   ├── card.stories.tsx
│   └── ...
└── README.md              # This file
```

## 📋 Component Inventory

### ✅ **Currently Available Components**

| Component | Status | Stories | Variants | Notes |
|-----------|--------|---------|----------|-------|
| **Button** | ✅ Ready | ✅ Complete | 6 variants, 4 sizes | Primary UI component |
| **Card** | ✅ Ready | ✅ Complete | Header, Content, Footer | Container component |
| **Avatar** | ✅ Ready | ✅ Complete | Image, Fallback, Sizes | User representation |
| **Input** | ✅ Ready | ✅ Complete | Text, Email, Password | Form input |
| **Label** | ✅ Ready | ✅ Complete | Standard, Required | Form labels |

### 🚧 **Components To Add** (Create when needed)

| Component | Priority | Radix Primitive | Use Case |
|-----------|----------|-----------------|----------|
| **Checkbox** | High | `@radix-ui/react-checkbox` | Form controls |
| **Select** | High | `@radix-ui/react-select` | Dropdown selection |
| **Dialog** | High | `@radix-ui/react-dialog` | Modal dialogs |
| **Tooltip** | High | `@radix-ui/react-tooltip` | Contextual help |
| **Switch** | Medium | `@radix-ui/react-switch` | Toggle controls |
| **Tabs** | Medium | `@radix-ui/react-tabs` | Content organization |
| **Dropdown Menu** | Medium | `@radix-ui/react-dropdown-menu` | Context menus |
| **Progress** | Medium | `@radix-ui/react-progress` | Loading states |
| **Alert** | Medium | Custom | Notifications |
| **Separator** | Low | `@radix-ui/react-separator` | Visual dividers |
| **Accordion** | Low | `@radix-ui/react-accordion` | Collapsible content |
| **Navigation Menu** | Low | `@radix-ui/react-navigation-menu` | Site navigation |
| **Popover** | Low | `@radix-ui/react-popover` | Contextual overlays |
| **Slider** | Low | `@radix-ui/react-slider` | Range inputs |
| **Toggle** | Low | `@radix-ui/react-toggle` | Binary states |
| **Radio Group** | Low | `@radix-ui/react-radio-group` | Single selection |
| **Table** | Low | Custom | Data display |
| **Calendar** | Low | Custom | Date selection |

## 🔄 Component Creation Workflow

### **Step 1: Check Storybook First**
```bash
# Start Storybook
npm run storybook

# Visit http://localhost:6006
# Search for the component you need
```

### **Step 2: If Component Doesn't Exist**
1. **Create Component** (`src/components/ui/component-name.tsx`)
2. **Add to Index** (`src/components/ui/index.ts`)
3. **Create Stories** (`src/components/ui/component-name.stories.tsx`)
4. **Verify in Storybook**

### **Step 3: Component Template**

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

### **Step 4: Stories Template**

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

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small size',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large size',
  },
}
```

### **Step 5: Add to Index**

```typescript
// src/components/ui/index.ts
export * from "./button"
export * from "./card"
export * from "./avatar"
export * from "./input"
export * from "./label"
export * from "./new-component"  // Add your new component
```

## 🎯 Quality Checklist

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

## 🚨 Common Mistakes to Avoid

1. **Using components without Storybook documentation**
2. **Creating components without proper variants**
3. **Not using Radix UI primitives when available**
4. **Inconsistent naming conventions**
5. **Missing TypeScript interfaces**
6. **Not testing in Storybook before use**
7. **Forgetting to add to index.ts**

## 📖 Resources

- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Class Variance Authority](https://cva.style/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🔍 Component Status Tracking

To check component status:

```bash
# Check what's in Storybook
npm run storybook

# Check what's exported
cat src/components/ui/index.ts

# Check for missing stories
ls src/components/ui/*.tsx | grep -v stories | while read file; do
  story_file="${file%.tsx}.stories.tsx"
  if [ ! -f "$story_file" ]; then
    echo "Missing story: $story_file"
  fi
done
```

---

**Remember: If it's not in Storybook, it doesn't exist! 📚** 