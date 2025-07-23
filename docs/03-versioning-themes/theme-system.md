# 🎨 Theme System Documentation
## Multi-Brand Theming Architecture

**Document Version:** 1.0  
**Last Updated:** January 2025  

---

## 🌟 Theme System Overview

The Gambit theme system enables seamless brand customization across multiple retail partners while maintaining design consistency and development efficiency. Each theme provides a complete visual identity that can be applied to any version of the application.

### Core Principles

1. **Brand Consistency** - Each theme maintains authentic brand identity
2. **Technical Flexibility** - Themes work across all application versions
3. **Easy Maintenance** - Centralized theme management and updates
4. **Scalable Architecture** - Simple addition of new retail partner themes

---

## 🎯 Available Themes for Gambit Versions

### 1. Gambit Theme (Universal) 🌐
**Default platform branding - universal theme available to all retailers**

#### Brand Identity
- **Color Palette** - Modern tech-forward blue and white with accent colors
- **Typography** - Clean, readable fonts optimized for data-heavy interfaces
- **Visual Style** - Minimalist, professional aesthetic focused on functionality
- **Iconography** - Consistent icon library with universal recognition

#### Use Cases
- **Default theme** for all new users and retailers
- **Fallback theme** when retailer-specific themes are unavailable
- **White-label solution** for retailers without custom branding
- **Development and testing** environment standard

#### Brand Colors
```css
/* Gambit Theme Colors */
:root {
  --primary: 214 95% 93%;          /* Gambit Blue */
  --primary-foreground: 214 100% 15%;
  --secondary: 210 40% 96%;        /* Light Gray */
  --secondary-foreground: 210 8% 45%;
  --accent: 214 95% 90%;           /* Accent Blue */
  --accent-foreground: 214 100% 20%;
  --background: 0 0% 100%;         /* White */
  --foreground: 214 15% 15%;       /* Dark Gray */
  --muted: 210 40% 96%;
  --muted-foreground: 210 8% 45%;
  --border: 214 20% 85%;
  --input: 214 20% 90%;
  --ring: 214 95% 50%;
}
```

### 2. Albert Heijn Theme 🇳🇱
**Dutch supermarket chain branding for Albert Heijn advertisers**

#### Brand Identity
- **Color Palette** - Iconic Albert Heijn blue and white with brand-specific accents
- **Typography** - Albert Heijn corporate font family
- **Visual Style** - Clean, trustworthy aesthetic reflecting Dutch retail quality
- **Iconography** - Albert Heijn brand icons and Netherlands market terminology

#### Features
- **Localized Interface** - Dutch terminology and cultural preferences
- **Product Integration** - Albert Heijn product imagery and categories
- **Market Specifics** - Netherlands retail market optimizations
- **Brand Compliance** - Official Albert Heijn brand guidelines adherence

#### Brand Colors
```css
/* Albert Heijn Theme Colors */
:root {
  --primary: 214 100% 45%;         /* AH Blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 214 15% 95%;        /* Light AH Blue */
  --secondary-foreground: 214 50% 25%;
  --accent: 214 85% 55%;           /* Medium AH Blue */
  --accent-foreground: 0 0% 100%;
  --background: 0 0% 100%;         /* White */
  --foreground: 214 25% 15%;       /* Dark Blue-Gray */
  --success: 142 76% 36%;          /* AH Green */
  --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%;           /* AH Orange */
  --warning-foreground: 0 0% 100%;
}
```

### 3. Delhaize Theme 🇧🇪
**Belgian/European supermarket chain branding for Delhaize advertisers**

#### Brand Identity
- **Color Palette** - Delhaize red, white, and green corporate colors
- **Typography** - Delhaize brand typography system
- **Visual Style** - European retail aesthetic with premium positioning
- **Iconography** - Delhaize-specific icons and European market elements

#### Features
- **European Localization** - Multi-language support (French, Dutch, English)
- **Regional Adaptation** - Belgian and European market preferences
- **Premium Positioning** - Upscale visual treatment reflecting brand position
- **Cross-Border Support** - Multiple European market compatibility

#### Brand Colors
```css
/* Delhaize Theme Colors */
:root {
  --primary: 0 84% 45%;            /* Delhaize Red */
  --primary-foreground: 0 0% 100%;
  --secondary: 120 35% 45%;        /* Delhaize Green */
  --secondary-foreground: 0 0% 100%;
  --accent: 0 75% 55%;             /* Light Red */
  --accent-foreground: 0 0% 100%;
  --background: 0 0% 100%;         /* White */
  --foreground: 0 15% 15%;         /* Dark Gray */
  --success: 120 60% 40%;          /* Deep Green */
  --success-foreground: 0 0% 100%;
}
```

### 4. AD USA Theme 🇺🇸
**US market branding for American advertisers and campaigns**

#### Brand Identity
- **Color Palette** - Patriotic red, white, and blue with American market appeal
- **Typography** - Bold, confident fonts suitable for US retail market
- **Visual Style** - Dynamic, energetic aesthetic reflecting American retail culture
- **Iconography** - US-specific icons and American market terminology

#### Features
- **US Market Optimization** - American retail terminology and preferences
- **Currency and Units** - USD pricing and imperial measurement systems
- **Cultural Adaptation** - American shopping behaviors and expectations
- **Regulatory Compliance** - US advertising and retail regulations

#### Brand Colors
```css
/* AD USA Theme Colors */
:root {
  --primary: 220 100% 50%;         /* American Blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 100% 45%;         /* American Red */
  --secondary-foreground: 0 0% 100%;
  --accent: 220 75% 60%;           /* Light Blue */
  --accent-foreground: 0 0% 100%;
  --background: 0 0% 100%;         /* White */
  --foreground: 220 15% 15%;       /* Dark Blue-Gray */
  --success: 120 60% 40%;          /* Green */
  --success-foreground: 0 0% 100%;
}
```

### 5. AB Theme 🏢
**Specialized theme for AB market segment advertisers**

#### Brand Identity
- **Color Palette** - Professional corporate colors optimized for AB segment
- **Typography** - Clean, business-focused font selections
- **Visual Style** - Sophisticated, data-driven aesthetic for enterprise users
- **Iconography** - Business-oriented icons and enterprise terminology

#### Features
- **Enterprise Optimization** - Features and workflows tailored for AB segment
- **Advanced Analytics** - Enhanced reporting and business intelligence focus
- **Workflow Efficiency** - Streamlined processes for high-volume users
- **Custom Integrations** - AB-specific platform connections and data sources

#### Brand Colors
```css
/* AB Theme Colors */
:root {
  --primary: 240 60% 35%;          /* Deep Blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 240 15% 85%;        /* Light Gray-Blue */
  --secondary-foreground: 240 25% 25%;
  --accent: 240 45% 45%;           /* Medium Blue */
  --accent-foreground: 0 0% 100%;
  --background: 0 0% 100%;         /* White */
  --foreground: 240 20% 15%;       /* Dark Blue-Gray */
  --success: 142 60% 40%;          /* Professional Green */
  --success-foreground: 0 0% 100%;
}
```

---

## 🏗️ Theme Architecture

### CSS Variable System

#### Theme Structure
```css
/* Base theme structure - all themes follow this pattern */
:root[data-theme="theme-name"] {
  /* Primary Colors */
  --primary: [h s l];
  --primary-foreground: [h s l];
  
  /* Secondary Colors */
  --secondary: [h s l];
  --secondary-foreground: [h s l];
  
  /* Accent Colors */
  --accent: [h s l];
  --accent-foreground: [h s l];
  
  /* Background Colors */
  --background: [h s l];
  --foreground: [h s l];
  
  /* Utility Colors */
  --muted: [h s l];
  --muted-foreground: [h s l];
  --border: [h s l];
  --input: [h s l];
  --ring: [h s l];
  
  /* Status Colors */
  --destructive: [h s l];
  --destructive-foreground: [h s l];
  --success: [h s l];
  --success-foreground: [h s l];
  --warning: [h s l];
  --warning-foreground: [h s l];
  
  /* Chart Colors */
  --chart-1: [h s l];
  --chart-2: [h s l];
  --chart-3: [h s l];
  --chart-4: [h s l];
  --chart-5: [h s l];
}
```

#### Dynamic Theme Application
```typescript
// Theme Context Implementation
interface ThemeConfig {
  name: string;
  displayName: string;
  colors: Record<string, string>;
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  };
  localization: {
    currency: string;
    dateFormat: string;
    numberFormat: string;
    language: string;
    region: string;
  };
  branding: {
    logo: string;
    favicon: string;
    companyName: string;
    tagline: string;
  };
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  'gambit': {
    name: 'gambit',
    displayName: 'Gambit Theme',
    colors: { /* ... theme colors */ },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      bodyFont: '"Inter", sans-serif',
    },
    localization: {
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'european',
      language: 'en',
      region: 'EU',
    },
    branding: {
      logo: '/gambit-logo.svg',
      favicon: '/favicon.ico',
      companyName: 'Gambit',
      tagline: 'Retail Media Made Simple',
    },
  },
  'albert-heijn': {
    name: 'albert-heijn',
    displayName: 'Albert Heijn Theme',
    colors: { /* ... AH theme colors */ },
    typography: {
      fontFamily: '"Albert Heijn Sans", sans-serif',
      headingFont: '"Albert Heijn Sans", sans-serif', 
      bodyFont: '"Albert Heijn Sans", sans-serif',
    },
    localization: {
      currency: 'EUR',
      dateFormat: 'DD-MM-YYYY',
      numberFormat: 'dutch',
      language: 'nl',
      region: 'NL',
    },
    branding: {
      logo: '/ah-logo.svg',
      favicon: '/ah-favicon.ico',
      companyName: 'Albert Heijn',
      tagline: 'Samen maken we het verschil',
    },
  },
  // ... other themes
};
```

### Component Theme Integration

#### Theme-Aware Components
```typescript
// Button component with theme support
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// All color classes reference CSS variables that change per theme
// No theme-specific code needed in components
```

---

## 🎮 Theme Selection and Management

### User Interface Integration

#### Theme Selector Component
```typescript
// Theme selection in login screen
interface ThemeSelectProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  availableThemes: string[];
}

export function ThemeSelect({ selectedTheme, onThemeChange, availableThemes }: ThemeSelectProps) {
  return (
    <Select value={selectedTheme} onValueChange={onThemeChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {availableThemes.map((themeKey) => {
          const theme = THEME_CONFIGS[themeKey];
          return (
            <SelectItem key={themeKey} value={themeKey}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                />
                {theme.displayName}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
```

#### Theme Context Provider
```typescript
// Global theme management
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<string>('gambit');
  
  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update meta tags for branding
    const themeConfig = THEME_CONFIGS[currentTheme];
    document.title = `${themeConfig.branding.companyName} - Retail Media Platform`;
    
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = themeConfig.branding.favicon;
    }
  }, [currentTheme]);
  
  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setCurrentTheme,
      themeConfig: THEME_CONFIGS[currentTheme],
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## 🔧 Implementation Guidelines

### Adding New Themes

#### 1. Theme Configuration
```typescript
// Add new theme to THEME_CONFIGS
const newRetailerTheme: ThemeConfig = {
  name: 'new-retailer',
  displayName: 'New Retailer Theme',
  colors: {
    primary: '210 100% 50%',
    // ... complete color palette
  },
  typography: {
    fontFamily: '"Retailer Font", sans-serif',
    headingFont: '"Retailer Heading Font", sans-serif',
    bodyFont: '"Retailer Body Font", sans-serif',
  },
  localization: {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'american',
    language: 'en',
    region: 'US',
  },
  branding: {
    logo: '/new-retailer-logo.svg',
    favicon: '/new-retailer-favicon.ico',
    companyName: 'New Retailer',
    tagline: 'Your Shopping Partner',
  },
};
```

#### 2. CSS Variables Definition
```css
/* Add to globals.css */
:root[data-theme="new-retailer"] {
  --primary: 210 100% 50%;
  --primary-foreground: 0 0% 100%;
  /* ... complete variable set */
}
```

#### 3. Asset Management
```
public/
├── new-retailer-logo.svg
├── new-retailer-favicon.ico
├── new-retailer-fonts/
│   ├── RetailerFont-Regular.woff2
│   ├── RetailerFont-Bold.woff2
│   └── RetailerFont-Light.woff2
└── new-retailer-assets/
    ├── hero-image.jpg
    └── brand-icons/
```

### Theme Testing

#### Visual Regression Testing
```typescript
// Storybook theme testing
export const AllThemes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {Object.keys(THEME_CONFIGS).map((themeKey) => (
        <div key={themeKey} data-theme={themeKey} className="p-4 border rounded">
          <h3 className="text-lg font-semibold text-primary mb-2">
            {THEME_CONFIGS[themeKey].displayName}
          </h3>
          <Button>Primary Button</Button>
          <Button variant="secondary" className="ml-2">Secondary</Button>
          <Button variant="outline" className="ml-2">Outline</Button>
        </div>
      ))}
    </div>
  ),
};
```

#### Accessibility Testing
```typescript
// Theme accessibility validation
function validateThemeAccessibility(theme: ThemeConfig) {
  const colorTests = [
    { bg: theme.colors.primary, fg: theme.colors['primary-foreground'] },
    { bg: theme.colors.secondary, fg: theme.colors['secondary-foreground'] },
    // ... other color combinations
  ];
  
  colorTests.forEach(({ bg, fg }) => {
    const contrastRatio = calculateContrastRatio(bg, fg);
    expect(contrastRatio).toBeGreaterThan(4.5); // WCAG AA standard
  });
}
```

---

## 📊 Theme Performance and Analytics

### Performance Considerations

#### CSS Loading Strategy
```typescript
// Dynamic theme loading for performance
export function loadThemeStyles(themeName: string) {
  const existingLink = document.querySelector(`link[data-theme="${themeName}"]`);
  
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${themeName}.css`;
    link.setAttribute('data-theme', themeName);
    document.head.appendChild(link);
  }
}
```

#### Bundle Size Optimization
- **Base theme** - Core styles loaded always
- **Theme variations** - Only load selected theme styles
- **Font loading** - Lazy load theme-specific fonts
- **Asset optimization** - Theme-specific image compression

### Analytics and Monitoring

#### Theme Usage Metrics
```typescript
// Track theme selection and usage
interface ThemeAnalytics {
  themeUsage: Record<string, number>;
  themeSwitchEvents: Array<{
    fromTheme: string;
    toTheme: string;
    timestamp: Date;
    userId: string;
  }>;
  themePerformance: Record<string, {
    loadTime: number;
    renderTime: number;
    userSatisfaction: number;
  }>;
}
```

#### Business Impact Tracking
- **Conversion rates** by theme
- **User engagement** metrics per theme
- **Task completion rates** across themes
- **User satisfaction scores** by theme

---

## 🔗 Theme System Integration

### Storybook Documentation

#### Theme Showcase
Every component in Storybook can be viewed across all themes:

```typescript
// .storybook/preview.ts
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'gambit',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'gambit', title: 'Gambit Theme' },
        { value: 'albert-heijn', title: 'Albert Heijn Theme' },
        { value: 'delhaize', title: 'Delhaize Theme' },
        { value: 'ad-usa', title: 'AD USA Theme' },
        { value: 'ab', title: 'AB Theme' },
      ],
    },
  },
};
```

#### Component Documentation
```typescript
// Component stories with theme support
export const ThemeShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      {Object.keys(THEME_CONFIGS).map((themeKey) => (
        <div key={themeKey} data-theme={themeKey} className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            {THEME_CONFIGS[themeKey].displayName}
          </h3>
          <ComponentExample />
        </div>
      ))}
    </div>
  ),
};
```

### Development Workflow

#### Theme Development Process
1. **Design Review** - Validate theme with brand guidelines
2. **Color Definition** - Create complete color palette
3. **Component Testing** - Verify all components work with theme
4. **Accessibility Validation** - Ensure WCAG compliance
5. **Performance Testing** - Validate load times and rendering
6. **User Testing** - Gather feedback from target users
7. **Documentation** - Update theme documentation and examples

---

## 🚀 Future Enhancements

### Planned Features

#### Dynamic Theme Creation
- **Theme Builder UI** - Visual theme customization interface
- **Real-time Preview** - Instant theme changes preview
- **Export/Import** - Theme configuration file management
- **Template Library** - Pre-built theme starting points

#### Advanced Customization
- **Component Variants** - Theme-specific component variations
- **Layout Adaptations** - Theme-specific layout options
- **Animation Themes** - Theme-specific motion and transitions
- **Content Themes** - Theme-specific copy and messaging

#### Multi-Brand Support
- **Sub-brand Themes** - Support for retailer sub-brands
- **Seasonal Themes** - Holiday and seasonal theme variations
- **Event Themes** - Special event and promotion themes
- **Regional Themes** - Location-specific theme adaptations

---

## 🔗 Related Documentation

- [Version Management](./version-management.md)
- [Implementation Guide](./implementation-guide.md)
- [Component System](../02-architecture/component-system.md)
- [Development Setup](../04-getting-started/development-setup.md)

---

**Document Owner:** Design System Team  
**Technical Review:** Frontend Team  
**Brand Review:** Marketing Team  
**Next Review Date:** March 2025