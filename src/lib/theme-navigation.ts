import { Route } from '@/components/ui/side-navigation';
import { defaultRoutes } from '@/components/layout/default-routes';

// Advertiser routes with limited access (no Calendar, Yield, or Configuration)
export const advertiserRoutes: Route[] = [
  {
    id: 99,
    name: "Media wallet",
    type: "single" as const,
    icon: { lucide: "WalletCards" },
    url: "/campaigns"
  },
  {
    id: 0,
    name: "Campaigns",
    type: "parent" as const,
    icon: { lucide: "Table" },
    subitems: [
      {
        id: 20,
        name: "Sponsored products",
        type: "single" as const,
        url: "/campaigns/sponsored-products"
      },
      {
        id: 21,
        name: "Display",
        type: "single" as const,
        url: "/campaigns/display"
      },
      {
        id: 22,
        name: "Digital in-store",
        type: "single" as const,
        url: "/campaigns/digital-instore"
      },
      {
        id: 23,
        name: "Offline instore",
        type: "single" as const,
        url: "/campaigns/offline-instore"
      }
    ]
  },
  {
    id: 1,
    name: "Creatives",
    type: "single" as const,
    icon: { lucide: "ImagePlus" },
    url: "/creatives"
  },
  {
    id: 3,
    name: "Insights",
    type: "parent" as const,
    icon: { lucide: "BarChart3" },
    subitems: [
      {
        id: 50,
        name: "Dashboard",
        type: "single" as const,
        url: "/insights"
      },
      {
        id: 51,
        name: "Full report",
        type: "single" as const,
        url: "/insights/report"
      }
    ]
  },
  {
    id: 5,
    name: "Campaign Intelligence",
    type: "title" as const,
  },
  {
    id: 6,
    name: "New chat",
    type: "single" as const,
    icon: { lucide: "MessageCirclePlus" },
    url: "/chats/new"
  }
];

/**
 * Determines navigation variant based on theme
 * @param theme - Theme name from Storybook globals
 * @returns 'primary' for Gambit, 'advertiser' for other brands
 */
export function getNavigationVariant(theme: string): 'primary' | 'advertiser' {
  // Gambit/Retail Media uses full navigation
  if (theme === 'retailMedia' || theme === 'gambit') {
    return 'primary';
  }

  // All other brands use advertiser navigation
  return 'advertiser';
}

/**
 * Gets the appropriate routes array based on theme
 * @param theme - Theme name from Storybook globals
 * @returns Routes array (full or advertiser)
 */
export function getRoutesForTheme(theme: string): Route[] {
  const variant = getNavigationVariant(theme);

  if (variant === 'primary') {
    return defaultRoutes;
  }

  return advertiserRoutes;
}

/**
 * Maps Storybook theme names to theme values used in the application
 * @param storybookTheme - Theme name from Storybook globals
 * @returns Theme name for components
 */
export function mapStorybookThemeToAppTheme(storybookTheme: string): string {
  const themeMap: Record<string, string> = {
    'retailMedia': 'gambit',
    'albertHeijn': 'albert-heijn',
    'adusa': 'adusa',
    'delhaize': 'delhaize',
    'alfaBeta': 'alfa-beta'
  };

  return themeMap[storybookTheme] || storybookTheme;
}
