"use client"

import { SideNavigation, Route } from "@/components/ui/side-navigation"
import { Button } from "@/components/ui/button"
import { useMenu } from "@/hooks/use-menu"
import { Menu } from "lucide-react"

const sampleRoutes: Route[] = [
  {
    id: 1,
    name: "Dashboard",
    url: "/dashboard",
    icon: { lucide: "Home" }
  },
  {
    id: 2,
    name: "Campaigns",
    type: "parent",
    icon: { lucide: "Campaigns" },
    subitems: [
      {
        id: 21,
        name: "All Campaigns",
        url: "/campaigns"
      },
      {
        id: 22,
        name: "Create Campaign",
        url: "/campaigns/create"
      }
    ]
  },
  {
    id: 3,
    name: "Analytics",
    type: "title"
  },
  {
    id: 4,
    name: "Performance",
    url: "/performance",
    icon: { lucide: "Performance" }
  },
  {
    id: 5,
    name: "Reports",
    url: "/reports",
    icon: { lucide: "FileText" }
  },
  {
    id: 6,
    name: "Settings",
    type: "parent",
    icon: { lucide: "Settings" },
    subitems: [
      {
        id: 61,
        name: "General",
        url: "/settings/general"
      },
      {
        id: 62,
        name: "Users",
        url: "/settings/users"
      }
    ]
  }
]

export default function TestNavigationPage() {
  const { toggleCollapsed } = useMenu()

  const handleLogout = () => {
    console.log("Logout clicked")
  }

  return (
    <div className="flex h-screen">
      <SideNavigation
        routes={sampleRoutes}
        logo={{
          src: "/next.svg",
          alt: "Logo",
          width: 40,
          height: 40
        }}
        user={{
          name: "John Doe",
          avatar: "https://ui-avatars.com/api/?name=John+Doe&size=32"
        }}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={toggleCollapsed} variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Side Navigation Test</h1>
        </div>
        
        <div className="space-y-4">
          <p>This page demonstrates the side navigation component.</p>
          <p>Click the menu button to toggle the navigation collapse state.</p>
          <p>Try clicking on different navigation items to see the active states.</p>
        </div>
      </div>
    </div>
  )
} 