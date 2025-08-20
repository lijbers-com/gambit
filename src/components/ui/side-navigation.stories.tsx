import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SideNavigation, Route } from './side-navigation';
import { useMenu } from '@/hooks/use-menu';

const meta: Meta<typeof SideNavigation> = {
  title: 'UI/SideNavigation',
  component: SideNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRoutes: Route[] = [
  {
    id: 0,
    name: "Home",
    type: "single",
    icon: { lucide: "Home" },
    url: "/"
  },
  {
    id: 1,
    name: "Dashboard",
    type: "single",
    icon: { lucide: "LayoutDashboard" },
    url: "/dashboard"
  },
  {
    id: 2,
    name: "Campaigns",
    type: "parent",
    icon: { lucide: "Table" },
    subitems: [
      {
        id: 20,
        name: "Sponsored products",
        url: "/campaigns/sponsored-products"
      },
      {
        id: 21,
        name: "Display",
        url: "/campaigns/display"
      },
      {
        id: 22,
        name: "Digital in-store",
        url: "/campaigns/digital-instore"
      },
      {
        id: 23,
        name: "Offline instore",
        url: "/campaigns/offline-instore"
      }
    ]
  },
  {
    id: 3,
    name: "Creatives",
    type: "parent",
    icon: { lucide: "ImagePlus" },
    subitems: [
      {
        id: 30,
        name: "Sponsored products",
        url: "/creatives/sponsored-products"
      },
      {
        id: 31,
        name: "Display",
        url: "/creatives/display"
      },
      {
        id: 32,
        name: "Digital in-store",
        url: "/creatives/digital-instore"
      },
      {
        id: 33,
        name: "Offline instore",
        url: "/creatives/offline-instore"
      }
    ]
  },
  {
    id: 4,
    name: "Calendar",
    type: "parent",
    icon: { lucide: "CalendarDays" },
    subitems: [
      {
        id: 40,
        name: "Sponsored products",
        url: "/calendar/sponsored-products"
      },
      {
        id: 41,
        name: "Display",
        url: "/calendar/display"
      },
      {
        id: 42,
        name: "Digital in-store",
        url: "/calendar/digital-instore"
      },
      {
        id: 43,
        name: "Offline instore",
        url: "/calendar/offline-instore"
      }
    ]
  },
  {
    id: 5,
    name: "Performance",
    type: "parent",
    icon: { lucide: "BarChart3" },
    subitems: [
      {
        id: 50,
        name: "Sponsored products",
        url: "/performance/sponsored-products"
      },
      {
        id: 51,
        name: "Display",
        url: "/performance/display"
      },
      {
        id: 52,
        name: "Digital in-store",
        url: "/performance/digital-instore"
      },
      {
        id: 53,
        name: "Offline instore",
        url: "/performance/offline-instore"
      }
    ]
  },
  {
    id: 6,
    name: "Yield",
    type: "parent",
    icon: { lucide: "TrendingUp" },
    subitems: [
      {
        id: 60,
        name: "Sponsored products",
        url: "/yield/sponsored-products"
      },
      {
        id: 61,
        name: "Display",
        url: "/yield/display"
      },
      {
        id: 62,
        name: "Digital in-store",
        url: "/yield/digital-instore"
      },
      {
        id: 63,
        name: "Offline instore",
        url: "/yield/offline-instore"
      }
    ]
  }
];

export const Primary: Story = {
  args: {
    routes: sampleRoutes,
    user: {
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&size=32"
    },
    onLogout: () => console.log("Logout clicked")
  },
  render: (args) => (
    <div className="flex h-screen">
      <SideNavigation {...args} />
      <div className="flex-1 p-8 bg-gray-50 ml-[270px]">
        <h1 className="text-2xl font-bold mb-4">Navigation Structure</h1>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Main Menu Items:</h3>
            <ul className="mt-2 space-y-1">
              <li>🏠 <strong>Home</strong> - Dashboard home page</li>
              <li>📊 <strong>Dashboard</strong> - Main dashboard view</li>
              <li>🗂️ <strong>Campaigns</strong> - Campaign management with 4 engines</li>
              <li>🎨 <strong>Creatives</strong> - Creative management with 4 engines</li>
              <li>📅 <strong>Calendar</strong> - Booking calendar with 4 engines</li>
              <li>📈 <strong>Performance</strong> - Performance analytics with 4 engines</li>
              <li>📊 <strong>Yield</strong> - Yield optimization with 4 engines</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Engine Types (Sub-menus):</h3>
            <ul className="mt-2 space-y-1">
              <li>• <strong>Sponsored products</strong></li>
              <li>• <strong>Display</strong></li>
              <li>• <strong>Digital in-store</strong></li>
              <li>• <strong>Offline instore</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const OpenState: Story = {
  args: {
    routes: sampleRoutes,
    user: {
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&size=32"
    },
    onLogout: () => console.log("Logout clicked")
  },
  render: (args) => (
    <div className="flex h-screen">
      <SideNavigation {...args} />
      <div className="flex-1 p-8 bg-gray-50 ml-[270px]">
        <h1 className="text-2xl font-bold mb-4">Open State</h1>
        <p>Side navigation is open with full width (270px minimum) showing labels and icons.</p>
      </div>
    </div>
  ),
};

export const CollapsedState: Story = {
  args: {
    routes: sampleRoutes,
    user: {
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&size=32"
    },
    onLogout: () => console.log("Logout clicked")
  },
  render: (args) => {
    const { setCollapsed } = useMenu();
    React.useEffect(() => {
      setCollapsed(true);
      return () => setCollapsed(false);
    }, [setCollapsed]);
    return (
      <div className="flex h-screen">
        <SideNavigation {...args} />
        <div className="flex-1 p-8 bg-gray-50 ml-[88px]">
          <h1 className="text-2xl font-bold mb-4">Collapsed State</h1>
          <p>Side navigation is collapsed to 88px width showing only icons.</p>
        </div>
      </div>
    );
  },
}; 