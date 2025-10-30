import { Route } from '@/components/ui/side-navigation';

export const defaultRoutes: Route[] = [
  {
    id: 99,
    name: "Media wallet",
    type: "single" as const,
    icon: { lucide: "WalletCards" },
    url: "/campaigns",
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
        url: "/campaigns/sponsored-products",
      },
      {
        id: 21,
        name: "Display",
        type: "single" as const,
        url: "/campaigns/display",
      },
      {
        id: 22,
        name: "Digital in-store",
        type: "single" as const,
        url: "/campaigns/digital-instore",
      },
      {
        id: 23,
        name: "Offline instore",
        type: "single" as const,
        url: "/campaigns/offline-instore",
      },
    ],
  },
  {
    id: 1,
    name: "Creatives",
    type: "single" as const,
    icon: { lucide: "ImagePlus" },
    url: "/creatives",
  },
  {
    id: 2,
    name: "Calendar",
    type: "parent" as const,
    icon: { lucide: "CalendarDays" },
    subitems: [
      {
        id: 40,
        name: "Sponsored products",
        type: "single" as const,
        url: "/calendar/sponsored-products",
      },
      {
        id: 41,
        name: "Display",
        type: "single" as const,
        url: "/calendar/display",
      },
      {
        id: 42,
        name: "Digital in-store",
        type: "single" as const,
        url: "/calendar/digital-instore",
      },
      {
        id: 43,
        name: "Offline instore",
        type: "single" as const,
        url: "/calendar/offline-instore",
      },
    ],
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
        url: "/insights",
      },
      {
        id: 51,
        name: "Full report",
        type: "single" as const,
        url: "/insights/report",
      },
    ],
  },
  {
    id: 4,
    name: "Yield",
    type: "parent" as const,
    icon: { lucide: "TrendingUp" },
    subitems: [
      {
        id: 60,
        name: "Dashboard",
        type: "single" as const,
        url: "/yield",
      },
      {
        id: 61,
        name: "Full report",
        type: "single" as const,
        url: "/yield/report",
      },
    ],
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
    url: "/chats/new",
  },
  {
    id: 8,
    name: "Configuration",
    type: "title" as const,
  },
  {
    id: 9,
    name: "Display config",
    type: "single" as const,
    icon: { lucide: "MonitorSpeaker" },
    url: "/configuration/display",
  },
  {
    id: 10,
    name: "Sponsored products config",
    type: "single" as const,
    icon: { lucide: "ListStart" },
    url: "/configuration/sponsored-products",
  },
  {
    id: 11,
    name: "Digital in-store config",
    type: "single" as const,
    icon: { lucide: "MonitorPlay" },
    url: "/configuration/digital-instore",
  },
  {
    id: 12,
    name: "Offline in-store config",
    type: "single" as const,
    icon: { lucide: "Store" },
    url: "/configuration/offline-instore",
  },
  {
    id: 13,
    name: "Organisations & users",
    type: "single" as const,
    icon: { lucide: "OrganisationsIcon" },
    url: "/configuration/organisations-users",
  },
  {
    id: 14,
    name: "Brands & retail products",
    type: "single" as const,
    icon: { lucide: "BrandsIcon" },
    url: "/configuration/brands-products",
  },
];

// Extended routes for breadcrumb navigation (detail pages)
export const extendedRoutes: Route[] = [
  ...defaultRoutes,
  // Campaign detail routes
  {
    id: 200,
    name: "Campaign Details",
    type: "hidden" as const,
    url: "/campaigns/sponsored-products/[id]",
    pattern: "/campaigns/sponsored-products/*",
  },
  {
    id: 201,
    name: "Campaign Details",
    type: "hidden" as const,
    url: "/campaigns/display/[id]",
    pattern: "/campaigns/display/*",
  },
  {
    id: 202,
    name: "Campaign Details",
    type: "hidden" as const,
    url: "/campaigns/digital-instore/[id]",
    pattern: "/campaigns/digital-instore/*",
  },
  {
    id: 203,
    name: "Campaign Details",
    type: "hidden" as const,
    url: "/campaigns/offline-instore/[id]",
    pattern: "/campaigns/offline-instore/*",
  },
  // Line-item detail routes
  {
    id: 210,
    name: "Line-item Details",
    type: "hidden" as const,
    url: "/campaigns/sponsored-products/line-item/[lineItemId]",
    pattern: "/campaigns/sponsored-products/line-item/*",
  },
  {
    id: 211,
    name: "Line-item Details",
    type: "hidden" as const,
    url: "/campaigns/display/line-item/[lineItemId]",
    pattern: "/campaigns/display/line-item/*",
  },
  {
    id: 212,
    name: "Line-item Details",
    type: "hidden" as const,
    url: "/campaigns/digital-instore/line-item/[lineItemId]",
    pattern: "/campaigns/digital-instore/line-item/*",
  },
  {
    id: 213,
    name: "Line-item Details",
    type: "hidden" as const,
    url: "/campaigns/offline-instore/line-item/[lineItemId]",
    pattern: "/campaigns/offline-instore/line-item/*",
  },
  // Creative detail routes
  {
    id: 220,
    name: "Creative Details",
    type: "hidden" as const,
    url: "/campaigns/sponsored-products/creative/[creativeId]",
    pattern: "/campaigns/sponsored-products/creative/*",
  },
  {
    id: 221,
    name: "Creative Details",
    type: "hidden" as const,
    url: "/campaigns/display/creative/[creativeId]",
    pattern: "/campaigns/display/creative/*",
  },
  {
    id: 222,
    name: "Creative Details",
    type: "hidden" as const,
    url: "/campaigns/digital-instore/creative/[creativeId]",
    pattern: "/campaigns/digital-instore/creative/*",
  },
  {
    id: 223,
    name: "Creative Details",
    type: "hidden" as const,
    url: "/campaigns/offline-instore/creative/[creativeId]",
    pattern: "/campaigns/offline-instore/creative/*",
  },
];