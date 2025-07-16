"use client"

import { SmartBreadcrumbs } from "@/components/ui/smart-breadcrumbs"

export default function TestBreadcrumbsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">SmartBreadcrumbs Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Default SmartBreadcrumbs</h2>
          <SmartBreadcrumbs namespace="offline-media" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">With Custom Home Title</h2>
          <SmartBreadcrumbs 
            namespace="offline-media" 
            homeTitle="Dashboard" 
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">With Query Parameters</h2>
          <SmartBreadcrumbs 
            namespace="offline-media" 
            passQueryParameters={true}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">With Specific Query Parameters</h2>
          <SmartBreadcrumbs 
            namespace="offline-media" 
            passQueryParameters={['size', 'campaignId']}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Different Namespace</h2>
          <SmartBreadcrumbs 
            namespace="dashboard" 
            homeTitle="Main"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">With Custom Styling</h2>
          <SmartBreadcrumbs 
            namespace="offline-media" 
            homeTitle="Home"
            className="bg-muted p-2 rounded-lg"
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Current Path:</h3>
        <p className="text-sm text-muted-foreground">
          /test-breadcrumbs
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The breadcrumbs above will show the current navigation path. 
          Try navigating to different pages to see how the breadcrumbs update.
        </p>
      </div>
    </div>
  )
} 