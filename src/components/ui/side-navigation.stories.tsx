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
    name: "Insights",
    type: "parent",
    icon: { lucide: "BarChart3" },
    subitems: [
      {
        id: 50,
        name: "Sponsored products",
        url: "/insights/sponsored-products"
      },
      {
        id: 51,
        name: "Display",
        url: "/insights/display"
      },
      {
        id: 52,
        name: "Digital in-store",
        url: "/insights/digital-instore"
      },
      {
        id: 53,
        name: "Offline instore",
        url: "/insights/offline-instore"
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
              <li>📈 <strong>Insights</strong> - Performance analytics with 4 engines</li>
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

// Interactive wrapper with breadcrumb toggle
const InteractiveCollapsedDemo: React.FC<{ args: any }> = ({ args }) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [openSubmenu, setOpenSubmenu] = React.useState<string[]>([]);

  // Create a complete mock menu state
  const mockMenuState = React.useMemo(() => ({
    expandedItems: [],
    activeItem: '',
    toggleExpanded: () => {},
    isExpanded: () => false,
    setActive: () => {},
    isActive: () => false,
    collapsed,
    setCollapsed,
    toggleCollapsed: () => setCollapsed(prev => !prev),
    openSubmenu,
    setOpenSubmenu,
  }), [collapsed, openSubmenu]);

  // Custom SideNavigation that uses our local state
  const DemoSideNavigation = () => {
    const filteredRoutes = args.routes.filter(
      (item: any) =>
        item.type !== 'parent' ||
        (item.subitems && item.subitems.length > 0),
    );

    return (
      <div
        className={`fixed left-0 top-0 h-screen z-30 flex-shrink-0 text-sm flex flex-col transition-all duration-500 ease-in-out overflow-hidden scrollbar-hide ${
          collapsed ? 'w-[72px]' : 'w-[270px]'
        } pt-4 px-4 pb-6 side-navigation`}
        data-collapsed={collapsed}
        style={{ background: 'var(--brand-app-bg-hex, var(--brand-app-bg, #ffffff))' }}
      >
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex mb-8">
            <a 
              href="/" 
              className="side-navigation-logo flex-shrink-0 w-10 h-10"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#8B5CF6"/>
                <path d="M12 16h16v2H12v-2zm0 6h16v2H12v-2z" fill="white"/>
              </svg>
            </a>
          </div>

          {filteredRoutes.map((item: any) => {
            if (item.type === 'parent' && item.subitems?.length > 0) {
              return (
                <div key={item.id} className="flex items-center mb-6 pr-2 rounded-md transition-colors cursor-pointer">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    {item.icon?.lucide === 'Table' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>
                      </svg>
                    )}
                    {item.icon?.lucide === 'ImagePlus' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                        <line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/>
                        <circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    )}
                    {item.icon?.lucide === 'CalendarDays' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                        <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/>
                        <line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                    )}
                    {item.icon?.lucide === 'BarChart3' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
                      </svg>
                    )}
                    {item.icon?.lucide === 'TrendingUp' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
                        <polyline points="16,7 22,7 22,13"/>
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm ml-2 flex-1 ${collapsed ? 'hidden' : ''}`}>
                    {item.name}
                  </span>
                  <span className={`ml-auto ${collapsed ? 'hidden' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </span>
                </div>
              );
            }
            
            if (!item.type && item.url) {
              return (
                <a
                  key={item.id}
                  className="flex items-center mb-6 pr-2 rounded-md transition-colors"
                  href={item.url}
                >
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    {item.icon?.lucide === 'Home' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                      </svg>
                    )}
                    {item.icon?.lucide === 'LayoutDashboard' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="7" height="9" x="3" y="3" rx="1"/>
                        <rect width="7" height="5" x="14" y="3" rx="1"/>
                        <rect width="7" height="9" x="14" y="12" rx="1"/>
                        <rect width="7" height="5" x="3" y="16" rx="1"/>
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm ml-2 ${collapsed ? 'hidden' : ''}`}>{item.name}</span>
                </a>
              );
            }
            
            return null;
          })}
        </div>

        <div className="mt-auto">
          {args.user && (
            <a className="flex items-center mb-6 mt-12 pr-2 rounded-md hover:bg-slate-100" href="/profile">
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                  {args.user.name?.charAt(0) || 'U'}
                </div>
              </span>
              <span className={`text-sm ml-2 ${collapsed ? 'hidden' : ''}`}>Profile</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Breadcrumb with toggle button */}
      <div className={`breadcrumb flex items-center pl-6 h-16 border-b transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[270px]'}`}>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center justify-center mr-6 p-1 rounded transition-colors focus:outline-none hover:bg-gray-100"
          aria-label="Toggle navigation"
        >
          {collapsed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>
            </svg>
          )}
        </button>
        <span className="text-sm text-gray-600">Interactive Demo: Click the toggle button ←</span>
      </div>

      <div className="flex flex-1">
        <DemoSideNavigation />
        <div className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[270px]'}`}>
          <h1 className="text-2xl font-bold mb-4">
            {collapsed ? 'Collapsed State (72px)' : 'Expanded State (270px)'}
          </h1>
          <p>
            {collapsed 
              ? 'Side navigation is collapsed showing only icons. Click the toggle button in the breadcrumb to expand.' 
              : 'Side navigation is expanded showing icons and labels. Click the toggle button in the breadcrumb to collapse.'}
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Current State: {collapsed ? 'Collapsed' : 'Expanded'}</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Width: {collapsed ? '72px' : '270px'}</li>
              <li>• Icons: Always visible</li>
              <li>• Text labels: {collapsed ? 'Hidden' : 'Visible'}</li>
              <li>• Submenu chevrons: {collapsed ? 'Hidden' : 'Visible'}</li>
              <li>• Toggle button: In breadcrumb (as designed)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
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
  render: (args) => <InteractiveCollapsedDemo args={args} />,
}; 