import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SideNavigation, Route } from './side-navigation';
import { useMenu } from '@/hooks/use-menu';
import { MenuContext } from '@/contexts/menu-context';

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
    theme: {
      control: { type: 'select' },
      options: ['gambit', 'albert-heijn', 'albertHeijn'],
      description: 'Theme variant for testing theme-based filtering',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRoutes: Route[] = [
  {
    id: 98,
    name: "Campaign management",
    type: "title",
  },
  {
    id: 100,
    name: "Create",
    type: "create",
    icon: { lucide: "CreateIcon" },
    subitems: [
      { id: 101, name: "Media experience", type: "single" as const, url: "/create/media-experience" },
      { id: 102, name: "Sponsored product campaign", type: "single" as const, url: "/create/sponsored-products" },
      { id: 103, name: "Display campaign", type: "single" as const, url: "/create/display" },
      { id: 104, name: "Offline in-store campaign", type: "single" as const, url: "/create/offline-instore" },
      { id: 105, name: "Digital in-store campaign", type: "single" as const, url: "/create/digital-instore" },
      { id: 106, name: "Extended reach campaign", type: "single" as const, url: "/create/extended-reach" },
    ],
  },
  {
    id: 99,
    name: "Media Experiences",
    type: "single",
    icon: { lucide: "WalletCards" },
    url: "/campaigns"
  },
  {
    id: 0,
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
      },
      {
        id: 24,
        name: "Audio in-store",
        url: "/campaigns/audio-instore"
      },
      {
        id: 25,
        name: "Social",
        url: "/campaigns/social"
      },
      {
        id: 26,
        name: "Display offsite",
        url: "/campaigns/display-offsite"
      }
    ]
  },
  {
    id: 1,
    name: "Creatives",
    type: "single",
    icon: { lucide: "ImagePlus" },
    url: "/creatives"
  },
  {
    id: 2,
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
      },
      {
        id: 44,
        name: "Audio in-store",
        url: "/calendar/audio-instore"
      },
      {
        id: 45,
        name: "Social",
        url: "/calendar/social"
      },
      {
        id: 46,
        name: "Display offsite",
        url: "/calendar/display-offsite"
      }
    ]
  },
  {
    id: 3,
    name: "Insights",
    type: "parent",
    icon: { lucide: "BarChart3" },
    subitems: [
      {
        id: 50,
        name: "Dashboard",
        url: "/insights"
      },
      {
        id: 51,
        name: "Full report",
        url: "/insights/report"
      }
    ]
  },
  {
    id: 4,
    name: "Yield",
    type: "parent",
    icon: { lucide: "TrendingUp" },
    subitems: [
      {
        id: 60,
        name: "Dashboard",
        url: "/yield"
      },
      {
        id: 61,
        name: "Full report",
        url: "/yield/report"
      }
    ]
  },
  {
    id: 5,
    name: "Campaign Agent",
    type: "title"
  },
  {
    id: 6,
    name: "New chat",
    type: "single",
    icon: { lucide: "MessageCirclePlus" },
    url: "/chats/new"
  },
  {
    id: 8,
    name: "Configuration",
    type: "title"
  },
  {
    id: 9,
    name: "Display config",
    type: "single",
    icon: { lucide: "MonitorSpeaker" },
    url: "/configuration/display"
  },
  {
    id: 10,
    name: "Sponsored products config",
    type: "single",
    icon: { lucide: "ListStart" },
    url: "/configuration/sponsored-products"
  },
  {
    id: 11,
    name: "Digital in-store config",
    type: "single",
    icon: { lucide: "MonitorPlay" },
    url: "/configuration/digital-instore"
  },
  {
    id: 12,
    name: "Offline in-store config",
    type: "single",
    icon: { lucide: "Store" },
    url: "/configuration/offline-instore"
  },
  {
    id: 13,
    name: "Organisations & users",
    type: "single",
    icon: { lucide: "OrganisationsIcon" },
    url: "/configuration/organisations-users"
  },
  {
    id: 14,
    name: "Brands & retail products",
    type: "single",
    icon: { lucide: "BrandsIcon" },
    url: "/configuration/brands-products"
  }
];

export const Primary: Story = {
  args: {
    routes: sampleRoutes,
  },
  render: (args) => (
    <div className="flex h-screen">
      <SideNavigation {...args} />
      <div className="flex-1 p-8 bg-gray-50 ml-[285px]">
        <h1 className="text-2xl font-bold mb-4">Navigation Structure</h1>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Main Menu Items:</h3>
            <ul className="mt-2 space-y-1">
              <li>💳 <strong>Media Experiences</strong> - Media order management</li>
              <li>🗂️ <strong>Campaigns</strong> - Campaign management with 4 engines</li>
              <li>🎨 <strong>Creatives</strong> - Creative management with 4 engines</li>
              <li>📅 <strong>Calendar</strong> - Booking calendar with 4 engines</li>
              <li>📈 <strong>Insights</strong> - Performance analytics with 4 engines</li>
              <li>📊 <strong>Yield</strong> - Yield optimization with 4 engines</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-4">Configuration Section:</h3>
            <ul className="mt-2 space-y-1">
              <li>⚙️ <strong>Display config</strong> - Display engine configuration</li>
              <li>⚙️ <strong>Sponsored products config</strong> - Sponsored products engine configuration</li>
              <li>⚙️ <strong>Digital in-store config</strong> - Digital in-store engine configuration</li>
              <li>⚙️ <strong>Offline in-store config</strong> - Offline in-store engine configuration</li>
              <li>👥 <strong>Organisations & users</strong> - Manage organisations and user accounts</li>
              <li>🏷️ <strong>Brands & retail products</strong> - Manage brands and product catalog</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-4">Campaign Agent Section:</h3>
            <ul className="mt-2 space-y-1">
              <li>💬 <strong>New chat</strong> - Start a new AI-powered campaign chat</li>
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
  },
  render: (args) => (
    <div className="flex h-screen">
      <SideNavigation {...args} />
      <div className="flex-1 p-8 bg-gray-50 ml-[285px]">
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
          collapsed ? 'w-[72px]' : 'w-[285px]'
        } pt-4 px-4 pb-6 side-navigation`}
        data-collapsed={collapsed}
        style={{ background: 'var(--brand-app-bg-hex, var(--brand-app-bg, #ffffff))' }}
      >
        {/* Fixed logo area */}
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

        {/* Scrollable navigation area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {filteredRoutes.map((item: any, index: number, arr: any[]) => {
            // Handle title types
            if (item.type === 'title') {
              const nextItem = arr[index + 1];
              const isNextMainType = nextItem?.type === undefined;
              const isNextParentWithSubitems = nextItem?.type === 'parent' && (nextItem.subitems?.length ?? 0) > 0;
              const shouldShowTitle = !collapsed && (isNextMainType || isNextParentWithSubitems);
              
              if (shouldShowTitle) {
                return (
                  <p key={item.id} className={`mb-4 mt-8 transition-opacity duration-300 ${
                    item.name === "Configuration" || item.name === "Campaign Intelligence"
                      ? "text-xs text-muted-foreground"
                      : "text-muted-foreground"
                  }`}>
                    {item.name}
                  </p>
                );
              }
              return null;
            }
            
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
                    {item.icon?.lucide === 'Settings' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                    {item.icon?.lucide === 'MessageSquare' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
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
            
            if ((!item.type || item.type === 'single') && item.url) {
              return (
                <a
                  key={item.id}
                  className="flex items-center mb-6 pr-2 rounded-md transition-colors"
                  href={item.url}
                >
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    {item.icon?.lucide === 'WalletCards' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/>
                        <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"/>
                      </svg>
                    )}
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
                    {item.icon?.lucide === 'Settings' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                    {item.icon?.lucide === 'MessageSquare' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
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
      <div className={`breadcrumb flex items-center pl-6 h-16 border-b transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[285px]'}`}>
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
        <div className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[285px]'}`}>
          <h1 className="text-2xl font-bold mb-4">
            {collapsed ? 'Collapsed State (72px)' : 'Expanded State (285px)'}
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
              <li>• Width: {collapsed ? '72px' : '285px'}</li>
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
  },
  render: (args) => {
    // Custom context provider that forces collapsed state
    const CollapsedMenuProvider = ({ children }: { children: React.ReactNode }) => {
      const [expandedItems] = React.useState<string[]>([]);
      const [activeItem] = React.useState<string>('');
      const [collapsed] = React.useState<boolean>(true); // Force collapsed
      const [showText] = React.useState<boolean>(false); // Force text hidden
      const [openSubmenu, setOpenSubmenu] = React.useState<string[]>([]);

      const contextValue = {
        expandedItems,
        activeItem,
        collapsed,
        showText,
        openSubmenu,
        toggleExpanded: () => {},
        isExpanded: () => false,
        setActive: () => {},
        isActive: () => false,
        setCollapsed: () => {}, // No-op since we force collapsed
        toggleCollapsed: () => {}, // No-op since we force collapsed
        setOpenSubmenu,
      };

      return (
        <MenuContext.Provider value={contextValue}>
          {children}
        </MenuContext.Provider>
      );
    };

    return (
      <CollapsedMenuProvider>
        <div className="flex h-screen">
          <SideNavigation {...args} />
          <div className="flex-1 p-8 bg-gray-50 ml-[72px]">
            <h1 className="text-2xl font-bold mb-4">Collapsed State (72px)</h1>
            <p>Side navigation is collapsed showing only icons. Text labels and section titles are hidden.</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Collapsed State Features:</strong>
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Width: 72px</li>
                <li>• Icons: Visible</li>
                <li>• Text labels: Hidden</li>
                <li>• Section titles: Hidden</li>
                <li>• Submenu chevrons: Hidden</li>
                <li>• Logo: Same as expanded state</li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsedMenuProvider>
    );
  },
};

// Advertiser routes with limited access
const advertiserRoutes: Route[] = [
  {
    id: 98,
    name: "Campaign management",
    type: "title",
  },
  {
    id: 100,
    name: "Create",
    type: "create",
    icon: { lucide: "CreateIcon" },
    subitems: [
      { id: 101, name: "Media experience", type: "single" as const, url: "/create/media-experience" },
      { id: 102, name: "Sponsored product campaign", type: "single" as const, url: "/create/sponsored-products" },
      { id: 103, name: "Display campaign", type: "single" as const, url: "/create/display" },
      { id: 104, name: "Offline in-store campaign", type: "single" as const, url: "/create/offline-instore" },
      { id: 105, name: "Digital in-store campaign", type: "single" as const, url: "/create/digital-instore" },
      { id: 106, name: "Extended reach campaign", type: "single" as const, url: "/create/extended-reach" },
    ],
  },
  {
    id: 99,
    name: "Media Experiences",
    type: "single",
    icon: { lucide: "WalletCards" },
    url: "/campaigns"
  },
  {
    id: 0,
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
      },
      {
        id: 24,
        name: "Audio in-store",
        url: "/campaigns/audio-instore"
      },
      {
        id: 25,
        name: "Social",
        url: "/campaigns/social"
      },
      {
        id: 26,
        name: "Display offsite",
        url: "/campaigns/display-offsite"
      }
    ]
  },
  {
    id: 1,
    name: "Creatives",
    type: "single",
    icon: { lucide: "ImagePlus" },
    url: "/creatives"
  },
  {
    id: 3,
    name: "Insights",
    type: "parent",
    icon: { lucide: "BarChart3" },
    subitems: [
      {
        id: 50,
        name: "Dashboard",
        url: "/insights"
      },
      {
        id: 51,
        name: "Full report",
        url: "/insights/report"
      }
    ]
  },
  {
    id: 5,
    name: "Campaign Agent",
    type: "title"
  },
  {
    id: 6,
    name: "New chat",
    type: "single",
    icon: { lucide: "MessageCirclePlus" },
    url: "/chats/new"
  }
];

export const AdvertiserView: Story = {
  args: {
    routes: advertiserRoutes,
  },
  render: (args) => (
    <div className="flex h-screen">
      <SideNavigation {...args} />
      <div className="flex-1 p-8 bg-gray-50 ml-[285px]">
        <h1 className="text-2xl font-bold mb-4">Advertiser View</h1>
        <p className="mb-4">Limited navigation menu for advertiser users with restricted access.</p>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Available Menu Items:</h3>
            <ul className="mt-2 space-y-1">
              <li>💳 <strong>Media Experiences</strong> - Media order management</li>
              <li>🗂️ <strong>Campaigns</strong> - Campaign management with 4 engines</li>
              <li>🎨 <strong>Creatives</strong> - Creative management</li>
              <li>📈 <strong>Insights</strong> - Performance analytics and reports</li>
              <li>💬 <strong>Campaign Agent</strong> - AI-powered campaign chat</li>
            </ul>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Restricted Access:</strong>
            </p>
            <p className="text-sm text-blue-700">
              Advertisers do not have access to Calendar, Yield, or Configuration sections.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};