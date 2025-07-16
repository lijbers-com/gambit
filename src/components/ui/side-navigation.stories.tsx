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
    id: 1,
    name: "Campaigns",
    type: "parent",
    icon: { lucide: "Table" },
    subitems: [
      {
        id: 11,
        name: "Display",
        url: "/campaigns/display"
      },
      {
        id: 12,
        name: "Sponsored products",
        url: "/campaigns/sponsored-products"
      },
      {
        id: 13,
        name: "Digital in-store",
        url: "/campaigns/digital-in-store"
      },
      {
        id: 14,
        name: "Offline in-store",
        url: "/campaigns/offline-in-store"
      }
    ]
  },
  {
    id: 2,
    name: "Creatives",
    type: "parent",
    icon: { lucide: "ImagePlus" },
    subitems: [
      {
        id: 21,
        name: "Display",
        url: "/creatives/display"
      },
      {
        id: 22,
        name: "Sponsored products",
        url: "/creatives/sponsored-products"
      },
      {
        id: 23,
        name: "Digital in-store",
        url: "/creatives/digital-in-store"
      },
      {
        id: 24,
        name: "Offline in-store",
        url: "/creatives/offline-in-store"
      }
    ]
  },
  {
    id: 3,
    name: "Calendar",
    type: "parent",
    icon: { lucide: "CalendarDays" },
    subitems: [
      {
        id: 31,
        name: "Display",
        url: "/calendar/display"
      },
      {
        id: 32,
        name: "Sponsored products",
        url: "/calendar/sponsored-products"
      },
      {
        id: 33,
        name: "Digital in-store",
        url: "/calendar/digital-in-store"
      },
      {
        id: 34,
        name: "Offline in-store",
        url: "/calendar/offline-in-store"
      }
    ]
  },
  {
    id: 4,
    name: "Performance",
    type: "parent",
    icon: { lucide: "ChartNoAxesColumn" },
    subitems: [
      {
        id: 41,
        name: "Display",
        url: "/performance/display"
      },
      {
        id: 42,
        name: "Sponsored products",
        url: "/performance/sponsored-products"
      },
      {
        id: 43,
        name: "Digital in-store",
        url: "/performance/digital-in-store"
      },
      {
        id: 44,
        name: "Offline in-store",
        url: "/performance/offline-in-store"
      }
    ]
  },
  {
    id: 5,
    name: "Yield",
    url: "/yield",
    icon: { lucide: "TrendingUp" }
  }
];

export const OpenState: Story = {
  args: {
    routes: sampleRoutes,
    logo: {
      src: "/next.svg",
      alt: "Logo",
      width: 40,
      height: 40
    },
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
    logo: {
      src: "/next.svg",
      alt: "Logo",
      width: 40,
      height: 40
    },
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