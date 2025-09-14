# Gambit - Modern UI Component Library

A clean, modern Next.js application built with **Radix UI primitives** and comprehensive component documentation.

## 🏗️ Architecture

### **Clean Component System**
- **Radix UI Primitives** - Accessible, unstyled components as foundation
- **Custom Styling** - Tailwind CSS with CSS variables for consistent theming
- **Type Safety** - Full TypeScript support with proper component interfaces
- **Variant Management** - Class Variance Authority (CVA) for type-safe variants

### **Design System**
- **CSS Variables** - Consistent theming with light/dark mode support
- **Tailwind CSS v3** - Utility-first styling with custom design tokens
- **Accessibility First** - WCAG compliant components via Radix UI
- **Responsive Design** - Mobile-first approach with consistent breakpoints

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd gambit

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook
```

### **Development Workflow**
```bash
# Development server (Next.js)
npm run dev          # http://localhost:3000

# Component documentation (Storybook)
npm run storybook    # http://localhost:6006

# Build for production
npm run build
```

## 📚 Component Management

### **Component Creation Process**

**🔴 IMPORTANT RULE: All components MUST be documented in Storybook**

1. **Create Component** in `src/components/ui/`
2. **Add to Index** in `src/components/ui/index.ts`
3. **Create Stories** in `src/components/ui/[component].stories.tsx`
4. **Verify in Storybook** - Component appears and works correctly

### **Component Structure**
```
src/components/ui/
├── index.ts                 # Export all components
├── button.tsx              # Component implementation
├── button.stories.tsx      # Storybook documentation
├── card.tsx
├── card.stories.tsx
└── ...
```

### **Current Component Library**

#### ✅ **Available Components**
- **Button** - Multiple variants (default, secondary, destructive, outline, ghost, link)
- **Card** - Header, content, footer, title, description
- **Avatar** - Image with fallback support
- **Input** - Form input with proper styling
- **Label** - Accessible form labels

#### 🚧 **Components To Add** (when needed)
- Checkbox
- Dialog
- Dropdown Menu
- Tabs
- Tooltip
- Select
- Switch
- Progress
- Alert
- Separator
- Accordion
- Navigation Menu
- Popover
- Slider
- Toggle
- Radio Group
- Table
- Calendar

### **Adding New Components**

When you need a new component:

1. **Check Storybook First** - Visit http://localhost:6006
2. **If Missing** - Create following our pattern:

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
        // ... other variants
      },
      size: {
        default: "default-size",
        // ... other sizes
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

3. **Add to Index** - Export in `src/components/ui/index.ts`
4. **Create Stories** - Document in Storybook
5. **Test** - Verify in Storybook before using

## 🎨 Design System

### **Color System**
```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96%;
--muted: 210 40% 96%;
--accent: 210 40% 96%;
--destructive: 0 84.2% 60.2%;

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 217.2 91.2% 59.8%;
/* ... */
```

### **Component Variants**
- **Size Variants**: `sm`, `default`, `lg`, `icon`
- **Style Variants**: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`
- **State Variants**: `disabled`, `loading`, `active`

## 🧪 Testing & Documentation

### **Storybook**
- **Component Playground** - Interactive component testing
- **Documentation** - Auto-generated docs from TypeScript
- **Visual Testing** - All component states and variants
- **Accessibility** - Built-in a11y testing

### **Quality Assurance**
- **TypeScript** - Full type safety
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Accessibility** - WCAG compliance via Radix UI

## 📦 Dependencies

### **Core Dependencies**
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Styling

### **UI Dependencies**
- **Radix UI** - Accessible component primitives
- **Class Variance Authority** - Variant management
- **Tailwind Merge** - Class merging utility
- **CLSX** - Conditional classes

### **Development Dependencies**
- **Storybook 9** - Component documentation
- **ESLint** - Code linting
- **Vitest** - Testing framework

## 🔧 Configuration

### **Tailwind Config**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### **TypeScript Config**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🚀 Deployment

### **Build**
```bash
npm run build
```

### **Production**
```bash
npm run start
```

### **Storybook Build**
```bash
npm run build-storybook
```

## 📋 Component Checklist

When creating/using components:

- [ ] **Component exists in Storybook** ✅
- [ ] **All variants documented** ✅
- [ ] **TypeScript interfaces defined** ✅
- [ ] **Accessibility tested** ✅
- [ ] **Responsive design verified** ✅
- [ ] **Dark mode support** ✅

## 🎯 Best Practices

### **Component Development**
1. **Start with Storybook** - Always check existing components first
2. **Use Radix Primitives** - Build on accessible foundations
3. **Follow Naming Conventions** - Clear, descriptive names
4. **Document Everything** - Comprehensive Storybook stories
5. **Type Safety** - Full TypeScript support

### **Styling Guidelines**
1. **CSS Variables** - Use design tokens consistently
2. **Tailwind Classes** - Utility-first approach
3. **Responsive Design** - Mobile-first breakpoints
4. **Accessibility** - WCAG compliance
5. **Dark Mode** - Support both themes

### **Code Quality**
1. **ESLint** - Follow linting rules
2. **TypeScript** - Strict type checking
3. **Component Composition** - Reusable, composable components
4. **Performance** - Optimized rendering
5. **Testing** - Comprehensive Storybook coverage

---

## 📖 Learn More

- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Storybook Documentation](https://storybook.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Built with ❤️ using modern web technologies and best practices.**
