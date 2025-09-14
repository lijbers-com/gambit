import type { Meta, StoryObj } from '@storybook/react';
import { TablePagination } from './table-pagination';
import { useState } from 'react';

const meta: Meta<typeof TablePagination> = {
  title: 'UI/Table Pagination',
  component: TablePagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Table Pagination Component

A pagination component designed for tables with integrated sorting functionality. Features a slate background with border, left-aligned pagination controls, and right-aligned sort dropdown.

## Features

- **Smart pagination**: Shows relevant page numbers with ellipsis for large page ranges
- **Integrated sorting**: Sort dropdown on the right side using our DropdownMenu component
- **Responsive design**: Stacks vertically on mobile, horizontal on desktop
- **Styled container**: Slate-50 background with border and rounded corners
- **Proper alignment**: Pagination controls left-aligned, sort options right-aligned
- **Keyboard navigation**: Supports keyboard navigation for accessibility

## Usage

Perfect for data tables with many rows that need both pagination and sorting controls. The component provides a contained, styled interface that works well below tables.

### Basic Usage
\`\`\`tsx
<TablePagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log('Page changed to:', page)}
/>
\`\`\`

### With Sorting
\`\`\`tsx
<TablePagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log('Page changed to:', page)}
  sortOptions={[
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'name', label: 'Name' },
  ]}
  selectedSort="latest"
  onSortChange={(sort) => console.log('Sort changed to:', sort)}
/>
\`\`\`

## Props

- **currentPage**: Current active page number
- **totalPages**: Total number of pages available
- **onPageChange**: Callback when page changes
- **sortOptions**: Array of sort options for dropdown
- **selectedSort**: Currently selected sort value
- **onSortChange**: Callback when sort changes
- **showSort**: Whether to show the sort dropdown
- **className**: Additional CSS classes

## Design Notes

The component follows the provided design with:
- Page numbers on the left side
- Sort dropdown on the right side with "Sort by:" prefix
- Clean, minimal styling with proper spacing
- Active page highlighted in dark color
- Ellipsis for page ranges
        `,
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page number',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    showSort: {
      control: 'boolean',
      description: 'Whether to show the sort dropdown',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sort options for stories
const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'created', label: 'Date Created' },
  { value: 'modified', label: 'Last Modified' },
];

export const Default: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSort, setSelectedSort] = useState('latest');

    return (
      <div className="w-full max-w-4xl">
        <TablePagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>
    );
  },
};

export const WithoutSorting: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(2);

    return (
      <div className="w-full max-w-4xl">
        <TablePagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
          showSort={false}
        />
      </div>
    );
  },
};

export const LargePageCount: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(15);
    const [selectedSort, setSelectedSort] = useState('latest');

    return (
      <div className="w-full max-w-4xl">
        <TablePagination
          currentPage={currentPage}
          totalPages={50}
          onPageChange={setCurrentPage}
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>
    );
  },
};

export const SmallPageCount: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(2);
    const [selectedSort, setSelectedSort] = useState('name');

    return (
      <div className="w-full max-w-4xl">
        <TablePagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={setCurrentPage}
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>
    );
  },
};

export const FirstPage: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSort, setSelectedSort] = useState('latest');

    return (
      <div className="w-full max-w-4xl">
        <TablePagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>
    );
  },
};

export const LastPage: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(10);
    const [selectedSort, setSelectedSort] = useState('oldest');

    return (
      <div className="w-full max-w-4xl">
        <TablePagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>
    );
  },
};

export const ResponsiveBehavior: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    const [selectedSort, setSelectedSort] = useState('name');

    return (
      <div className="w-full space-y-4">
        <p className="text-sm text-muted-foreground">
          Resize your browser window to see the responsive behavior. On mobile, the pagination and sort controls stack vertically.
        </p>
        <div className="w-full">
          <TablePagination
            currentPage={currentPage}
            totalPages={25}
            onPageChange={setCurrentPage}
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        </div>
      </div>
    );
  },
};

// Demonstrating the component in a table context
export const WithTableExample: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSort, setSelectedSort] = useState('latest');

    const tableData = [
      { id: 1, name: 'Campaign A', status: 'Active', date: '2024-01-15' },
      { id: 2, name: 'Campaign B', status: 'Paused', date: '2024-01-14' },
      { id: 3, name: 'Campaign C', status: 'Active', date: '2024-01-13' },
      { id: 4, name: 'Campaign D', status: 'Draft', date: '2024-01-12' },
      { id: 5, name: 'Campaign E', status: 'Active', date: '2024-01-11' },
    ];

    return (
      <div className="w-full max-w-4xl space-y-4">
        {/* Mock table */}
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={20}
          onPageChange={setCurrentPage}
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>
    );
  },
};