"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { CircleX, Plus, Settings } from "lucide-react"

export default function TestPageHeaderPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <PageHeader
        title="Test Page"
        subtitle="Testing the PageHeader component"
        headerRight={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        }
      />
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Default PageHeader</h2>
          <PageHeader title="Default Header" />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">With Subtitle</h2>
          <PageHeader 
            title="With Subtitle" 
            subtitle="This header has a subtitle" 
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">With Icon Action</h2>
          <PageHeader
            title="With Icon Action"
            subtitle="Header with an icon button"
            headerRight={
              <Button size="icon" title="Delete">
                <CircleX className="h-4 w-4" />
              </Button>
            }
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">With Multiple Actions</h2>
          <PageHeader
            title="Multiple Actions"
            subtitle="Header with multiple action buttons"
            headerRight={
              <div className="flex gap-2">
                <Button variant="outline" size="icon" title="Settings">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button size="icon" title="Add">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            }
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Custom Styling</h2>
          <PageHeader
            title="Custom Styled"
            subtitle="With custom background styling"
            className="bg-muted p-4 rounded-lg"
          />
        </div>
      </div>
    </div>
  )
} 