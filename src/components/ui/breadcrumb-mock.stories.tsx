import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink } from './breadcrumb';
import { ChevronRight } from 'lucide-react';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb namespace="gambit" className="w-full px-6 py-3 relative" showNavToggle={true}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="home">
            Home
          </BreadcrumbLink>
          <ChevronRight width="16" height="16" className="mx-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/offline-media">
            <span className="text-sm capitalize">
              offline-media
            </span>
          </BreadcrumbLink>
          <ChevronRight width="16" height="16" className="mx-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/offline-media/bookings">
            <span className="text-sm capitalize">
              bookings
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const WithCustomStyling: Story = {
  render: () => (
    <Breadcrumb namespace="gambit" className="w-full px-6 py-3 relative" showNavToggle={true}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="home">
            Dashboard
          </BreadcrumbLink>
          <ChevronRight width="16" height="16" className="mx-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/users">
            <span className="text-sm capitalize">
              users
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const LongPath: Story = {
  render: () => (
    <Breadcrumb namespace="gambit" className="w-full px-6 py-3 relative" showNavToggle={true}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="home">
            Home
          </BreadcrumbLink>
          <ChevronRight width="16" height="16" className="mx-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/offline-media">
            <span className="text-sm capitalize">
              offline-media
            </span>
          </BreadcrumbLink>
          <ChevronRight width="16" height="16" className="mx-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/offline-media/bookings">
            <span className="text-sm capitalize">
              bookings
            </span>
          </BreadcrumbLink>
          <ChevronRight width="16" height="16" className="mx-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/offline-media/bookings/detail">
            <span className="text-sm capitalize">
              detail
            </span>
          </BreadcrumbLink>
          <ChevronRight width="16" height="16" className="mx-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/offline-media/bookings/detail/settings">
            <span className="text-sm capitalize">
              settings
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}; 