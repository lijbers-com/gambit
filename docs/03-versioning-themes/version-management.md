# 🔄 Version Management Strategy
## Multi-Version Application Architecture

**Document Version:** 1.0  
**Last Updated:** January 2025  

---

## 🎯 Vision & Purpose

The Gambit platform is designed as a revolutionary 360° retail media campaign builder that transforms complex advertising into simple, AI-driven conversations. Our architecture enables rapid experimentation, theme customization, and consistent user experiences across multiple versions and brand implementations.

### Core Objectives

1. **Simplify Campaign Creation** - Make building multi-engine advertising campaigns as easy as describing your goals
2. **Enable Rapid Experimentation** - Test different UX approaches, features, and flows through versioned applications
3. **Maintain Brand Consistency** - Support multiple retail brands with cohesive, themed experiences  
4. **Ensure Component Integrity** - Single source of truth for all UI components across all applications

---

## 🏗️ Architecture Overview

Our architecture follows a **Design System First** approach with **Version-Controlled Applications**, enabling both consistency and experimentation.

```
┌─────────────────────────────────────────────────────────┐
│                    Storybook Library                    │
│                 (Single Source of Truth)               │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ Components  │ │   Pages     │ │   Themes    │      │
│  │             │ │             │ │             │      │
│  │ • Button    │ │ • Campaign  │ │ • Gambit    │      │
│  │ • Input     │ │ • Dashboard │ │ • Albert    │      │
│  │ • Card      │ │ • Settings  │ │   Heijn     │      │
│  │ • Modal     │ │ • Analytics │ │ • Jumbo     │      │
│  │ • etc...    │ │ • etc...    │ │ • etc...    │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                            │
                            │ (consumes)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Gambit Application                     │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │    Version      │  │     Theme       │              │
│  │   Management    │  │   Selection     │              │
│  │                 │  │                 │              │
│  │ • V1.0 Gambit   │  │ • gambit        │              │
│  │ • V2.0 Albert   │  │ • albert-heijn  │              │
│  │ • V2.1 Albert   │  │ • V3.0 Gambit   │              │
│  │ • V3.0 Gambit   │  │ • custom-brand  │              │
│  │ • V3.1 Gambit   │  │                 │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Gambit Application Versioning Strategy

### Version Naming Convention
```
V[MAJOR].[MINOR] [THEME_NAME]
```

#### Examples
- **V1.0 Gambit** - Original foundation version
- **V2.0 Albert Heijn** - Retailer-specific implementation
- **V2.1 Albert Heijn** - Enhanced retailer version
- **V3.0 Gambit** - AI-enhanced universal version
- **V3.1 Gambit** - Refined AI implementation

### Version Categories

#### Major Versions (V1, V2, V3, etc.)
Represent significant changes in:
- **User experience paradigms** - Fundamental interaction models
- **Core application architecture** - Technology stack or framework changes
- **Major feature additions or removals** - Substantial functionality changes
- **Fundamental workflow changes** - How users accomplish core tasks

**Example:** V1 might use a traditional form-based campaign creation, while V2 introduces AI-conversational campaign building.

#### Minor Versions (V2.1, V3.1, etc.)
Represent incremental improvements within a major version:
- **UI/UX refinements** - Polish and usability improvements
- **Feature enhancements** - Extending existing functionality
- **Performance optimizations** - Speed and efficiency improvements
- **Bug fixes and stability improvements** - Quality and reliability updates

---

## 🎮 Version Selection System

### User Experience
Users select their application version and theme through the login interface:

```
┌─────────────────────────────────────┐
│            Login Screen             │
│                                     │
│  Username: [________________]       │
│  Password: [________________]       │
│                                     │
│  Version:  [V3.1 Gambit      ▼]    │
│  Theme:    [Gambit Theme     ▼]     │
│                                     │
│            [Login Button]           │
└─────────────────────────────────────┘
```

### Available Combinations

#### Production-Ready Combinations
- **V2.0 Albert Heijn + Albert Heijn Theme** - Complete retailer integration
- **V3.1 Gambit + Gambit Theme** - Latest universal version
- **V2.1 Albert Heijn + Albert Heijn Theme** - Enhanced retailer experience
- **V3.0 Gambit + Delhaize Theme** - Cross-version theming example
- **V2.0 Gambit + AD USA Theme** - US market adaptation
- **V3.1 Gambit + AB Theme** - AB segment optimization
- **Any Version + Gambit Theme** - Fallback option for all retailers

### Session Management

#### Version Persistence
- **Session Storage** - Selected version and theme stored in user session
- **Consistent Experience** - Maintained throughout user session
- **Re-authentication Required** - Version switching requires new login for data integrity

#### Feature Flagging
Each version can enable/disable specific features:

```typescript
interface VersionConfig {
  version: string;
  features: {
    aiCampaignBuilder: boolean;
    advancedAnalytics: boolean;
    multiEngineSupport: boolean;
    voiceCommands: boolean;
    realTimeOptimization: boolean;
  };
  uiComponents: string[]; // Which components to use from library
  workflows: Record<string, string>; // Version-specific user flows
}
```

---

## 🔧 Implementation Architecture

### Version Configuration System

#### Version Registry
```typescript
// src/config/versions.ts
export const VERSION_REGISTRY: Record<string, VersionConfig> = {
  'v1.0-gambit': {
    version: 'V1.0 Gambit',
    features: {
      aiCampaignBuilder: false,
      advancedAnalytics: true,
      multiEngineSupport: false,
      voiceCommands: false,
      realTimeOptimization: false,
    },
    uiComponents: ['basic-campaign-form', 'simple-analytics'],
    workflows: {
      campaignCreation: 'form-based',
      optimization: 'manual',
    },
    availableThemes: ['gambit'],
  },
  'v3.1-gambit': {
    version: 'V3.1 Gambit',
    features: {
      aiCampaignBuilder: true,
      advancedAnalytics: true,
      multiEngineSupport: true,
      voiceCommands: true,
      realTimeOptimization: true,
    },
    uiComponents: ['ai-campaign-builder', 'advanced-analytics', 'voice-interface'],
    workflows: {
      campaignCreation: 'conversational-ai',
      optimization: 'automated',
    },
    availableThemes: ['gambit', 'albert-heijn', 'delhaize', 'ad-usa', 'ab'],
  },
  // ... other versions
};
```

#### Feature Flag Implementation
```typescript
// src/hooks/useFeatureFlag.ts
export function useFeatureFlag(feature: string): boolean {
  const { currentVersion } = useVersion();
  const versionConfig = VERSION_REGISTRY[currentVersion];
  return versionConfig?.features[feature] ?? false;
}

// Usage in components
function CampaignBuilder() {
  const hasAI = useFeatureFlag('aiCampaignBuilder');
  
  return (
    <div>
      {hasAI ? <AICampaignBuilder /> : <FormBasedCampaignBuilder />}
    </div>
  );
}
```

### Component Version Management

#### Version-Specific Components
```typescript
// src/components/versioned/CampaignBuilder.tsx
interface CampaignBuilderProps {
  version: string;
}

export function CampaignBuilder({ version }: CampaignBuilderProps) {
  const config = VERSION_REGISTRY[version];
  
  switch (config.workflows.campaignCreation) {
    case 'conversational-ai':
      return <AICampaignBuilder />;
    case 'form-based':
      return <FormBasedCampaignBuilder />;
    default:
      return <DefaultCampaignBuilder />;
  }
}
```

### Routing and Navigation

#### Version-Aware Routing
```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <VersionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </VersionProvider>
      </body>
    </html>
  );
}

// src/contexts/VersionContext.tsx
export function VersionProvider({ children }: { children: React.ReactNode }) {
  const [currentVersion, setCurrentVersion] = useState<string>('v3.1-gambit');
  const [currentTheme, setCurrentTheme] = useState<string>('gambit');
  
  return (
    <VersionContext.Provider value={{
      currentVersion,
      currentTheme,
      setCurrentVersion,
      setCurrentTheme,
      config: VERSION_REGISTRY[currentVersion],
    }}>
      {children}
    </VersionContext.Provider>
  );
}
```

---

## 📊 Version Comparison Matrix

### Feature Availability by Version

| Feature | V1.0 Gambit | V2.0 Albert Heijn | V2.1 Albert Heijn | V3.0 Gambit | V3.1 Gambit |
|---------|-------------|-------------------|-------------------|-------------|-------------|
| **Campaign Management** | ✅ Basic | ✅ Enhanced | ✅ Advanced | ✅ AI-Powered | ✅ AI-Enhanced |
| **Multi-Engine Support** | ❌ | ✅ Limited | ✅ Full | ✅ Full | ✅ Advanced |
| **AI Campaign Builder** | ❌ | ❌ | ❌ | ✅ Beta | ✅ Production |
| **Advanced Analytics** | ✅ Basic | ✅ Retailer-Specific | ✅ Enhanced | ✅ Predictive | ✅ Real-time |
| **Voice Commands** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Real-time Optimization** | ❌ | ✅ Limited | ✅ Enhanced | ✅ Advanced | ✅ Full |
| **Custom Themes** | ✅ Gambit Only | ✅ Albert Heijn | ✅ Albert Heijn | ✅ Multi-theme | ✅ All Themes |

### User Experience Differences

#### V1.0 Gambit (Foundation)
- **Campaign Creation** - Traditional form-based interface
- **Analytics** - Basic performance reporting
- **Optimization** - Manual bid and budget adjustments
- **Target Users** - Power users comfortable with traditional advertising platforms

#### V2.0/2.1 Albert Heijn (Retailer-Specific)
- **Campaign Creation** - Retailer-integrated workflow
- **Analytics** - Albert Heijn-specific metrics and terminology
- **Optimization** - Retailer platform-optimized recommendations
- **Target Users** - Albert Heijn advertising teams and partners

#### V3.0/3.1 Gambit (AI-Enhanced)
- **Campaign Creation** - Conversational AI-powered interface
- **Analytics** - Predictive insights and automated recommendations
- **Optimization** - Self-optimizing campaigns with real-time adjustments
- **Target Users** - All skill levels, from beginners to advanced users

---

## 🔄 Version Development Workflow

### Development Process

#### 1. Version Planning
- **Requirements Gathering** - Define version-specific features and goals
- **Architecture Review** - Ensure compatibility with existing system
- **Feature Flag Planning** - Determine what features to toggle
- **Testing Strategy** - Plan version-specific testing approaches

#### 2. Implementation
- **Feature Development** - Build version-specific functionality
- **Component Updates** - Extend Storybook library as needed
- **Configuration Setup** - Add version to registry and feature flags
- **Integration Testing** - Verify version works with all supported themes

#### 3. Testing and QA
- **Version-Specific Testing** - Test all features and workflows
- **Cross-Version Compatibility** - Ensure no breaking changes
- **Theme Compatibility** - Verify all theme combinations work
- **Performance Testing** - Maintain performance standards

#### 4. Deployment
- **Staged Rollout** - Gradual release to user segments
- **Monitoring** - Track version adoption and performance
- **Feedback Collection** - Gather user feedback and metrics
- **Iteration Planning** - Plan next version improvements

### Version Lifecycle Management

#### Version States
- **Development** - Active development and testing
- **Beta** - Limited user testing and feedback collection
- **Production** - Full availability to all users
- **Maintenance** - Bug fixes and security updates only
- **Deprecated** - Planned for removal, users migrated to newer versions
- **Retired** - No longer available for selection

#### Migration Strategy
```typescript
// Version migration helper
interface VersionMigration {
  fromVersion: string;
  toVersion: string;
  migrationSteps: MigrationStep[];
  dataTransformations: DataTransformation[];
  userNotifications: NotificationConfig[];
}

// Example migration
const v2ToV3Migration: VersionMigration = {
  fromVersion: 'v2.1-albert-heijn',
  toVersion: 'v3.0-gambit',
  migrationSteps: [
    'backup-user-data',
    'transform-campaign-structure',
    'update-analytics-format',
    'migrate-user-preferences',
  ],
  dataTransformations: [
    // ... data transformation logic
  ],
  userNotifications: [
    // ... user communication plan
  ],
};
```

---

## 📈 Success Metrics and Monitoring

### Version Adoption Metrics
- **User Distribution** - Percentage of users on each version
- **Feature Usage** - Adoption rates for version-specific features
- **User Satisfaction** - NPS and feedback scores by version
- **Performance Metrics** - Speed and reliability by version

### Development Metrics
- **Development Velocity** - Time to implement new versions
- **Bug Rates** - Quality metrics by version
- **Maintenance Overhead** - Cost of supporting multiple versions
- **Migration Success** - User transition rates between versions

### Business Impact Metrics
- **User Engagement** - Time spent and actions taken by version
- **Campaign Performance** - Advertising effectiveness by version
- **Revenue Impact** - Business value generated by version
- **Competitive Advantage** - Market differentiation through versioning

---

## 🔗 Related Documentation

- [Theme System](./theme-system.md)
- [Implementation Guide](./implementation-guide.md)
- [Architecture Overview](../02-architecture/architecture-overview.md)
- [Component System](../02-architecture/component-system.md)

---

**Document Owner:** Architecture Team  
**Technical Review:** Development Team  
**Business Review:** Product Management  
**Next Review Date:** March 2025