import type { Meta, StoryObj } from '@storybook/react';
import { 
  RightDrawer, 
  RightDrawerTrigger, 
  RightDrawerContent, 
  RightDrawerHeader, 
  RightDrawerTitle, 
  RightDrawerDescription, 
  RightDrawerBody,
  RightDrawerFooter,
  RightDrawerClose 
} from './right-drawer';
import { Button } from './button';
import { Viewbar } from './viewbar';
import { FilterBar } from './filter-bar';
import { Table } from './table';
import { Badge } from './badge';
import { useState } from 'react';

const meta: Meta<typeof RightDrawer> = {
  title: 'UI/Right Drawer',
  component: RightDrawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Right Drawer Component

A drawer component that slides in from the right side of the viewport. Built on top of Vaul drawer primitive with custom styling and layout for right-side presentation.

## Features

- **Right-side slide**: Slides in from the right side instead of bottom
- **Responsive width**: Full width on mobile, max 2xl width on desktop
- **Built-in close button**: X button in the top-right corner
- **Flexible content**: Can contain any components like ViewBar, FilterBar, Tables
- **Scrollable body**: Content area scrolls when content overflows
- **Overlay backdrop**: Dark overlay behind the drawer
- **Smooth animations**: CSS transitions for open/close states

## Usage

Perfect for detailed views, filters, forms, or any content that needs to slide in from the side without navigating away from the current page.

### Basic Usage
\`\`\`tsx
<RightDrawer>
  <RightDrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </RightDrawerTrigger>
  <RightDrawerContent>
    <RightDrawerHeader>
      <RightDrawerTitle>Title</RightDrawerTitle>
      <RightDrawerDescription>Description</RightDrawerDescription>
    </RightDrawerHeader>
    <RightDrawerBody>
      Content goes here
    </RightDrawerBody>
  </RightDrawerContent>
</RightDrawer>
\`\`\`

### With Components
\`\`\`tsx
<RightDrawerBody>
  <div className="space-y-6">
    <Viewbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    <FilterBar filters={filters} />
    <Table columns={columns} data={data} />
  </div>
</RightDrawerBody>
\`\`\`

## Components

- **RightDrawer**: Main container component
- **RightDrawerTrigger**: Element that opens the drawer
- **RightDrawerContent**: Drawer content container
- **RightDrawerHeader**: Header with title, description and close button
- **RightDrawerTitle**: Drawer title
- **RightDrawerDescription**: Drawer description/subtitle
- **RightDrawerBody**: Scrollable content area
- **RightDrawerFooter**: Footer for actions
- **RightDrawerClose**: Close trigger component

## Design Notes

- Width: Full width on mobile, max 2xl (672px) on desktop
- Header includes automatic close button (can be disabled)
- Body area is scrollable for long content
- Follows design system spacing and typography
        `,
      },
    },
  },
  argTypes: {
    shouldScaleBackground: {
      control: 'boolean',
      description: 'Whether to scale the background when drawer opens',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for examples
const viewTabs = [
  { value: 'campaigns', label: 'Campaigns' },
  { value: 'bookings', label: 'Bookings' },
  { value: 'creatives', label: 'Creatives' },
];

const filterOptions = [
  {
    name: 'Status',
    options: [
      { label: 'Running', value: 'running' },
      { label: 'Paused', value: 'paused' },
      { label: 'Completed', value: 'completed' },
    ],
    selectedValues: [],
    onChange: () => {},
  },
  {
    name: 'Brand',
    options: [
      { label: 'Coca Cola', value: 'coca-cola' },
      { label: 'Nike', value: 'nike' },
      { label: 'Apple', value: 'apple' },
    ],
    selectedValues: [],
    onChange: () => {},
  },
];

const tableData = [
  { id: '2023-86527', status: 'Running', brand: 'Coca Cola', mediaProduct: 'Package M', planned: '100', booked: '100' },
  { id: '2023-86528', status: 'Paused', brand: 'Nike', mediaProduct: 'Digital Display', planned: '150', booked: '120' },
  { id: '2023-86529', status: 'Running', brand: 'Apple', mediaProduct: 'Audio Ads', planned: '200', booked: '200' },
  { id: '2023-86530', status: 'Completed', brand: 'Samsung', mediaProduct: 'Sponsored Products', planned: '80', booked: '75' },
  { id: '2023-86531', status: 'Running', brand: 'McDonald\'s', mediaProduct: 'In-Store Digital', planned: '300', booked: '280' },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'Running': return 'default';
    case 'Paused': return 'secondary';
    case 'Completed': return 'outline';
    default: return 'outline';
  }
};

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <RightDrawer>
        <RightDrawerTrigger asChild>
          <Button>Open Right Drawer</Button>
        </RightDrawerTrigger>
        <RightDrawerContent>
          <RightDrawerHeader>
            <RightDrawerTitle>Campaign Details</RightDrawerTitle>
            <RightDrawerDescription>
              01 Dec, 2023 - 01 Feb, 2024
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                This is the basic right drawer example. Content slides in from the right side of the screen.
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Campaign Information</h4>
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Campaign ID:</span>
                    <span>2023-86527</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Brand:</span>
                    <span>Coca Cola</span>
                  </div>
                </div>
              </div>
            </div>
          </RightDrawerBody>
          <RightDrawerFooter>
            <Button>Save Changes</Button>
            <RightDrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </RightDrawerClose>
          </RightDrawerFooter>
        </RightDrawerContent>
      </RightDrawer>
    </div>
  ),
};

export const WithViewBarAndFilters: Story = {
  render: () => {
    const [activeView, setActiveView] = useState('campaigns');
    const [filters, setFilters] = useState(filterOptions);

    return (
      <div className="p-8">
        <RightDrawer>
          <RightDrawerTrigger asChild>
            <Button>Open Drawer with Components</Button>
          </RightDrawerTrigger>
          <RightDrawerContent>
            <RightDrawerHeader>
              <RightDrawerTitle>Dranken Campaign</RightDrawerTitle>
              <RightDrawerDescription>
                01 Dec, 2023 - 01 Feb, 2024
              </RightDrawerDescription>
            </RightDrawerHeader>
            <RightDrawerBody>
              <div className="space-y-6">
                <Viewbar
                  tabs={viewTabs}
                  activeTab={activeView}
                  onTabChange={setActiveView}
                  labels={[
                    { label: 'Chocomel', color: 'default' },
                    { label: 'Running + 4 more', color: 'success' },
                  ]}
                />
                
                <FilterBar
                  filters={filters}
                  hideSearch={true}
                />
                
                <Table
                  columns={[
                    { key: 'id', header: 'ID' },
                    { key: 'status', header: 'Status', render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
                    { key: 'brand', header: 'Brand' },
                    { key: 'mediaProduct', header: 'Media Product' },
                    { key: 'planned', header: 'Planned', render: row => <Badge variant="secondary">{row.planned}</Badge> },
                    { key: 'booked', header: 'Booked', render: row => <Badge variant="secondary">{row.booked}</Badge> },
                  ]}
                  data={tableData}
                  rowKey={row => row.id}
                />
              </div>
            </RightDrawerBody>
          </RightDrawerContent>
        </RightDrawer>
      </div>
    );
  },
};

export const WithScrollableContent: Story = {
  render: () => (
    <div className="p-8">
      <RightDrawer>
        <RightDrawerTrigger asChild>
          <Button>Open Scrollable Drawer</Button>
        </RightDrawerTrigger>
        <RightDrawerContent>
          <RightDrawerHeader>
            <RightDrawerTitle>Long Content Example</RightDrawerTitle>
            <RightDrawerDescription>
              This drawer demonstrates scrollable content
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-6">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Content Block {i + 1}</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a content block to demonstrate scrollable content in the drawer. 
                    The drawer body will scroll when content exceeds the available height.
                  </p>
                </div>
              ))}
            </div>
          </RightDrawerBody>
        </RightDrawerContent>
      </RightDrawer>
    </div>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <div className="p-8">
      <RightDrawer>
        <RightDrawerTrigger asChild>
          <Button>Open Without Close Button</Button>
        </RightDrawerTrigger>
        <RightDrawerContent>
          <RightDrawerHeader showCloseButton={false}>
            <RightDrawerTitle>Custom Close Handling</RightDrawerTitle>
            <RightDrawerDescription>
              Close button hidden, use custom controls
            </RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This drawer has the close button hidden in the header. You can implement custom close logic.
              </p>
            </div>
          </RightDrawerBody>
          <RightDrawerFooter>
            <RightDrawerClose asChild>
              <Button>Done</Button>
            </RightDrawerClose>
          </RightDrawerFooter>
        </RightDrawerContent>
      </RightDrawer>
    </div>
  ),
};

export const FullExample: Story = {
  render: () => {
    const [activeView, setActiveView] = useState('campaigns');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);

    const filters = [
      {
        name: 'Status',
        options: [
          { label: 'Running', value: 'running' },
          { label: 'Paused', value: 'paused' },
          { label: 'Completed', value: 'completed' },
        ],
        selectedValues: statusFilter,
        onChange: setStatusFilter,
      },
      {
        name: 'Brand',
        options: [
          { label: 'Coca Cola', value: 'coca-cola' },
          { label: 'Nike', value: 'nike' },
          { label: 'Apple', value: 'apple' },
          { label: 'Samsung', value: 'samsung' },
          { label: 'McDonald\'s', value: 'mcdonalds' },
        ],
        selectedValues: brandFilter,
        onChange: setBrandFilter,
      },
    ];

    return (
      <div className="p-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          This example replicates the design from the provided image with all components integrated.
        </p>
        
        <RightDrawer>
          <RightDrawerTrigger asChild>
            <Button>Open Dranken Campaign</Button>
          </RightDrawerTrigger>
          <RightDrawerContent>
            <RightDrawerHeader>
              <RightDrawerTitle>Dranken</RightDrawerTitle>
              <RightDrawerDescription>
                01 Dec, 2023 - 01 Feb, 2024
              </RightDrawerDescription>
            </RightDrawerHeader>
            <RightDrawerBody>
              <div className="space-y-6">
                {/* ViewBar with tabs and labels */}
                <Viewbar
                  tabs={[
                    { value: 'campaigns', label: 'Campaigns' },
                    { value: 'bookings', label: 'Bookings' },
                    { value: 'creatives', label: 'Creatives' },
                  ]}
                  activeTab={activeView}
                  onTabChange={setActiveView}
                  labels={[
                    { label: 'Chocomel', color: 'default' },
                    { label: 'Running + 4 more', color: 'success' },
                  ]}
                />
                
                {/* FilterBar */}
                <FilterBar
                  filters={filters}
                  hideSearch={true}
                />
                
                {/* Table with campaign data */}
                <Table
                  columns={[
                    { key: 'id', header: 'ID' },
                    { 
                      key: 'status', 
                      header: 'Status', 
                      render: row => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> 
                    },
                    { key: 'brand', header: 'Brand' },
                    { key: 'mediaProduct', header: 'Media Product' },
                    { 
                      key: 'planned', 
                      header: 'Planned', 
                      render: row => <Badge variant="secondary">{row.planned}</Badge> 
                    },
                    { 
                      key: 'booked', 
                      header: row => (
                        <div className="flex items-center gap-1">
                          Booked
                        </div>
                      ), 
                      render: row => <Badge variant="secondary">{row.booked}</Badge> 
                    },
                  ]}
                  data={tableData}
                  rowKey={row => row.id}
                />
                
                {/* See all button */}
                <div className="flex justify-end">
                  <Button variant="ghost" className="text-sm">
                    See all
                  </Button>
                </div>
              </div>
            </RightDrawerBody>
          </RightDrawerContent>
        </RightDrawer>
      </div>
    );
  },
};