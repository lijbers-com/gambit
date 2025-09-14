# Gambit Retail Media Platform - Component Library Architecture

## Project Overview

Gambit is a retail media platform designed for rapid prototyping and deployment of theme-specific applications across multiple retailers. The system is built on a component-first architecture with comprehensive theming and version management capabilities.

### Core Principles
- **Component-First**: Everything is built using reusable components
- **Theme-Driven**: Multiple brand themes with consistent design tokens
- **Version Management**: Support for multiple app versions per retailer
- **Storybook Integration**: Comprehensive component documentation and testing

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.4.4 with App Router (Latest Version)
- **React**: 19.1.0 (Latest Version)
- **UI Library**: Custom components built on shadcn/ui + Radix UI
- **Styling**: Tailwind CSS with CSS Variables for theming
- **Documentation**: Storybook 9.0.16
- **Type Safety**: TypeScript with strict mode
- **Component Variants**: Class Variance Authority (CVA)

### ⚠️ VERSION COMPATIBILITY NOTES

**Current Versions (Updated to Latest):**

```json
{
  "next": "15.4.4",
  "react": "19.1.0", 
  "react-dom": "19.1.0"
}
```

**Important Configuration Notes:**
- **Dev Server**: Run without Turbopack for stability (`npx next dev`)
- **Config format**: Use `next.config.js` (CommonJS format)
- **CSS Compatibility**: Avoid complex Tailwind selectors with escaped brackets
- **swcMinify**: Removed (deprecated in Next.js 15)

**Known Compatibility Adjustments:**
- Use data attributes instead of complex class selectors for CSS targeting
- Disable Turbopack when encountering CSS parsing issues
- React 19 hydration: Ensure client/server consistency for dynamic classes

**Migration Notes:**
- Component library remains fully compatible with latest versions
- All existing templates work without modifications
- Performance improvements with React 19's automatic batching

### Project Structure
```
src/
├── components/
│   ├── ui/                     # Reusable UI components (30+)
│   │   ├── button.tsx         # Core interactive components
│   │   ├── card.tsx           # Layout components
│   │   ├── input.tsx          # Form components
│   │   └── index.ts           # Centralized exports
│   └── layout/                # Layout and template components
│       ├── app-layout.tsx     # Main app wrapper
│       └── page-templates/    # Page-level templates
├── app/                       # Next.js App Router pages
├── lib/                       # Utilities and configurations
└── styles/                    # Global styles and themes
```

## Component Library System

### Component Categories

#### 1. **Core UI Components** (`/src/components/ui/`)
- **Form Controls**: Button, Input, Checkbox, Switch, Select
- **Layout**: Card, Badge, Separator, Tabs
- **Navigation**: Breadcrumb, Side Navigation, Page Header
- **Data Display**: Table, Chart components (Area, Bar, Line, Pie, Radar)
- **Feedback**: Dialog, Popover, Right Drawer
- **Specialized**: Logo (theme-aware), Filter components

#### 2. **Layout Components** (`/src/components/layout/`)
- **App Layout**: Main application wrapper with navigation
- **Page Templates**: Pre-built page layouts for different sections
- **Template Variations**: Different layouts per app version

#### 3. **Component Patterns**
```typescript
// Standard component pattern
interface ComponentProps {
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  theme?: "gambit" | "albert-heijn";
  version?: "v1" | "v2" | "v3";
}

// Using CVA for variants
const componentVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { sm: "...", md: "...", lg: "..." }
  }
});
```

## Theme System Architecture

### Current Themes
1. **Gambit** (Default): Purple-based corporate theme
2. **Albert Heijn**: Brand-specific blue theme with AH styling

### Theme Implementation

#### CSS Variables System
```css
:root {
  /* Gambit Theme (Default) */
  --primary: 258 100% 60%;        /* Purple */
  --secondary: 258 30% 95%;
  --background: 0 0% 100%;
  --foreground: 258 10% 15%;
}

[data-theme="albert-heijn"] {
  /* Albert Heijn Theme */
  --primary: 214 100% 50%;        /* Blue */
  --secondary: 214 30% 95%;
  --ah-brand-color: 214 100% 45%;
}
```

#### Theme Context
```typescript
interface ThemeContextType {
  theme: 'gambit' | 'albert-heijn';
  setTheme: (theme: string) => void;
  availableThemes: Theme[];
}
```

#### Smart Component Theming
Components automatically adapt to themes:
```typescript
// Logo component auto-detects theme
export const Logo = ({ theme: propTheme, ...props }: LogoProps) => {
  const { theme: contextTheme } = useTheme();
  const activeTheme = propTheme || contextTheme;
  
  return activeTheme === 'albert-heijn' ? 
    <AHLogo /> : <GambitLogo />;
};
```

## Version Management System

### Current Version Strategy
- **V1.0**: Basic MVP with core functionality
- **V2.0**: Enhanced UX with advanced features
- **V3.0**: Next-generation interface with AI integration

### Version Implementation Approach

#### 1. **Feature Flags** (Planned)
```typescript
interface VersionConfig {
  version: 'v1' | 'v2' | 'v3';
  features: {
    advancedFilters: boolean;
    aiInsights: boolean;
    realTimeData: boolean;
  };
}
```

#### 2. **Component Versioning**
```typescript
// Version-specific component variants
const ButtonV2 = ({ ...props }) => {
  // Enhanced button for v2
};

const ButtonV3 = ({ ...props }) => {
  // AI-enhanced button for v3
};
```

#### 3. **Login-Based Version Selection**
```typescript
interface UserSession {
  userId: string;
  retailer: 'gambit' | 'albert-heijn' | 'delhaize';
  version: 'v1' | 'v2' | 'v3';
  theme: string;
}
```

## Development Guidelines

### Component Development Rules

#### 1. **Always Use Existing Components**
- NEVER create one-off components
- ALWAYS extend existing components for new variants
- Use composition over duplication

#### 2. **Component Creation Checklist**
- [ ] TypeScript interfaces defined
- [ ] CVA variants implemented
- [ ] forwardRef for accessibility
- [ ] Storybook story created
- [ ] Theme variants tested
- [ ] Mobile responsive
- [ ] Accessibility compliant

#### 3. **File Organization**
```
component-name/
├── component-name.tsx         # Component implementation
├── component-name.stories.tsx # Storybook stories
├── component-name.test.tsx    # Unit tests (if needed)
└── index.ts                   # Re-export
```

### Theme Development Guidelines

#### 1. **Adding New Themes**
1. Create theme CSS variables in `globals.css`
2. Add theme assets (logos, icons) to `/public/`
3. Update theme context with new theme option
4. Test all components with new theme
5. Create Storybook theme switcher

#### 2. **Theme-Specific Components**
```typescript
// Theme-aware component pattern
export const Component = ({ theme, ...props }) => {
  const currentTheme = theme || useTheme().theme;
  
  return (
    <div className={cn(
      baseStyles,
      themeVariants[currentTheme],
      props.className
    )}>
      {children}
    </div>
  );
};
```

### Version Development Guidelines

#### 1. **Creating Version Variants**
```typescript
// Version-specific component exports
export const ComponentV1 = (props) => <BaseComponent version="v1" {...props} />;
export const ComponentV2 = (props) => <EnhancedComponent version="v2" {...props} />;
export const ComponentV3 = (props) => <AIComponent version="v3" {...props} />;
```

#### 2. **Version Routing**
```typescript
// App router with version support
app/
├── (v1)/                 # Version 1 routes
│   ├── dashboard/
│   └── campaigns/
├── (v2)/                 # Version 2 routes
└── (v3)/                 # Version 3 routes
```

## Storybook Integration

### Story Organization
- Each component has comprehensive stories
- Stories cover all variants, themes, and versions
- Interactive controls for all props
- Documentation includes usage examples

### Story Pattern
```typescript
export default {
  title: 'UI/Component Name',
  component: Component,
  parameters: {
    docs: { autodocs: true }
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['gambit', 'albert-heijn']
    },
    version: {
      control: 'select', 
      options: ['v1', 'v2', 'v3']
    }
  }
};
```

## Deployment Architecture

### Current Deployment Setup
- **Storybook**: https://gambit-woad.vercel.app/ (Component library docs)
- **Next.js App**: https://gambit-app-five.vercel.app/ (Live application)

### Branch Strategy
- **main**: Storybook deployment configuration
- **nextjs-deployment**: Next.js application deployment

## Quality Assurance

### Component Verification
- Automated component checking with `scripts/check-components.js`
- ESLint rules for component consistency
- Pre-commit hooks for quality gates

### Testing Strategy
- Storybook for visual testing
- Component integration testing
- Theme switching validation
- Cross-browser compatibility

## Future Roadmap

### Phase 1: Enhanced Theming (Next 2 weeks)
- [ ] Add 3+ additional retailer themes (Delhaize, AD USA, AB)
- [ ] Implement runtime theme switching
- [ ] Create theme builder utility
- [ ] Enhanced Storybook theme matrix

### Phase 2: Version Management (Weeks 3-4)
- [ ] Implement feature flag system
- [ ] Create version-specific component variants
- [ ] Build version routing system
- [ ] Add migration utilities

### Phase 3: Advanced Features (Weeks 5-6)
- [ ] Component usage analytics
- [ ] Performance monitoring
- [ ] Automated visual regression testing
- [ ] AI-powered component suggestions

## Getting Started

### For New Developers
1. Clone repository and install dependencies
2. Run `npm run storybook` to explore components
3. Run `npm run dev` to start development server
4. Review component examples in Storybook
5. Follow component creation guidelines

### For Theme Development
1. Study existing theme implementations
2. Create new theme CSS variables
3. Add theme-specific assets
4. Test all components with new theme
5. Update Storybook documentation

### For Version Development
1. Understand current version strategy
2. Implement feature flags for new versions
3. Create version-specific component variants
4. Test cross-version compatibility
5. Document version differences

This architecture provides a solid foundation for building a scalable, maintainable component library that supports multiple themes and versions while ensuring consistent quality and developer experience.