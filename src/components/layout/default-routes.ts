import { Route } from '@/components/ui/side-navigation';

export const defaultRoutes: Route[] = [
  {
    id: 0,
    name: "Home",
    type: "single" as const,
    icon: { lucide: "Home" },
    url: "/"
  },
  {
    id: 1,
    name: "Dashboard",
    type: "single" as const,
    icon: { lucide: "LayoutDashboard" },
    url: "/dashboard"
  },
  {
    id: 2,
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
    id: 3,
    name: "Creatives",
    type: "parent" as const,
    icon: { lucide: "ImagePlus" },
    subitems: [
      {
        id: 30,
        name: "Sponsored products",
        type: "single" as const,
        url: "/creatives/sponsored-products",
      },
      {
        id: 31,
        name: "Display",
        type: "single" as const,
        url: "/creatives/display",
      },
      {
        id: 32,
        name: "Digital in-store",
        type: "single" as const,
        url: "/creatives/digital-instore",
      },
      {
        id: 33,
        name: "Offline instore",
        type: "single" as const,
        url: "/creatives/offline-instore",
      },
    ],
  },
  {
    id: 4,
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
    id: 5,
    name: "Performance",
    type: "parent" as const,
    icon: { lucide: "BarChart3" },
    subitems: [
      {
        id: 50,
        name: "Sponsored products",
        type: "single" as const,
        url: "/performance/sponsored-products",
      },
      {
        id: 51,
        name: "Display",
        type: "single" as const,
        url: "/performance/display",
      },
      {
        id: 52,
        name: "Digital in-store",
        type: "single" as const,
        url: "/performance/digital-instore",
      },
      {
        id: 53,
        name: "Offline instore",
        type: "single" as const,
        url: "/performance/offline-instore",
      },
    ],
  },
  {
    id: 6,
    name: "Yield",
    type: "parent" as const,
    icon: { lucide: "TrendingUp" },
    subitems: [
      {
        id: 60,
        name: "Sponsored products",
        type: "single" as const,
        url: "/yield/sponsored-products",
      },
      {
        id: 61,
        name: "Display",
        type: "single" as const,
        url: "/yield/display",
      },
      {
        id: 62,
        name: "Digital in-store",
        type: "single" as const,
        url: "/yield/digital-instore",
      },
      {
        id: 63,
        name: "Offline instore",
        type: "single" as const,
        url: "/yield/offline-instore",
      },
    ],
  },
];