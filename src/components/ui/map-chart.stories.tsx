import type { Meta, StoryObj } from '@storybook/react';
import { MapChart } from './map-chart';

const meta: Meta<typeof MapChart> = {
  title: 'Charts/MapChart',
  component: MapChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of store location data with plays, name, and coordinates',
    },
    className: {
      description: 'Additional CSS classes',
    },
    title: {
      description: 'Chart title',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MapChart>;

// Mock data for Netherlands store locations
const mockStoreData = [
  // Amsterdam area
  { name: 'Amsterdam Central', plays: 5847, x: 48, y: 35 },
  { name: 'Amsterdam Zuid', plays: 4239, x: 46, y: 40 },
  { name: 'Amsterdam Noord', plays: 3156, x: 50, y: 32 },
  
  // Rotterdam area
  { name: 'Rotterdam Central', plays: 6241, x: 40, y: 55 },
  { name: 'Rotterdam Zuid', plays: 2847, x: 42, y: 58 },
  
  // Den Haag area
  { name: 'Den Haag HS', plays: 4156, x: 35, y: 50 },
  { name: 'Den Haag Central', plays: 3542, x: 33, y: 52 },
  
  // Utrecht area
  { name: 'Utrecht CS', plays: 5123, x: 52, y: 48 },
  { name: 'Utrecht Noord', plays: 2156, x: 54, y: 45 },
  
  // Eindhoven area
  { name: 'Eindhoven CS', plays: 3789, x: 58, y: 70 },
  { name: 'Eindhoven Airport', plays: 1923, x: 62, y: 72 },
  
  // Groningen area
  { name: 'Groningen CS', plays: 2456, x: 65, y: 15 },
  { name: 'Groningen Noord', plays: 1567, x: 67, y: 12 },
  
  // Breda area
  { name: 'Breda CS', plays: 2789, x: 45, y: 68 },
  
  // Tilburg area
  { name: 'Tilburg CS', plays: 3234, x: 52, y: 65 },
  
  // Arnhem area
  { name: 'Arnhem CS', plays: 2945, x: 68, y: 52 },
  
  // Nijmegen area
  { name: 'Nijmegen CS', plays: 2156, x: 70, y: 58 },
  
  // Zwolle area
  { name: 'Zwolle CS', plays: 1834, x: 62, y: 35 },
  
  // Haarlem area
  { name: 'Haarlem CS', plays: 2567, x: 42, y: 38 },
  
  // Almere area
  { name: 'Almere CS', plays: 3456, x: 58, y: 42 },
];

export const Default: Story = {
  args: {
    data: mockStoreData,
  },
};

export const WithCustomTitle: Story = {
  args: {
    data: mockStoreData,
    title: "Digital In-store Performance Map",
  },
};

export const LimitedData: Story = {
  args: {
    data: [
      { name: 'Amsterdam Central', plays: 5847, x: 48, y: 35 },
      { name: 'Rotterdam Central', plays: 6241, x: 40, y: 55 },
      { name: 'Utrecht CS', plays: 5123, x: 52, y: 48 },
      { name: 'Eindhoven CS', plays: 3789, x: 58, y: 70 },
      { name: 'Groningen CS', plays: 2456, x: 65, y: 15 },
    ],
  },
};

export const HighPerformance: Story = {
  args: {
    data: mockStoreData.map(store => ({
      ...store,
      plays: store.plays + 2000 // Boost all values to show high performance
    })),
  },
};

export const LowPerformance: Story = {
  args: {
    data: mockStoreData.map(store => ({
      ...store,
      plays: Math.max(500, store.plays - 3000) // Reduce values to show low performance
    })),
  },
};