import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Filter } from './filter';

const options = [
  { label: 'Chocomel', value: 'chocomel' },
  { label: 'Fristi', value: 'fristi' },
  { label: 'Brand', value: 'brand' },
];

const meta: Meta<typeof Filter> = {
  title: 'UI/Filter',
  component: Filter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Brand',
    options,
  },
};

export const Selected: Story = {
  args: {
    name: 'Brand',
    options,
    selectedValues: ['brand'],
  },
};

export const Disabled: Story = {
  args: {
    name: 'Brand',
    options,
    selectedValues: [],
  },
};

export const WithRemove: Story = {
  render: () => {
    const [selected, setSelected] = useState(['chocomel']);
    return (
      <Filter name="Brand" options={options} selectedValues={selected} onChange={setSelected} />
    );
  },
};

export const MultiLabel: Story = {
  render: () => {
    const [selected, setSelected] = useState(['chocomel', 'fristi', 'brand']);
    return (
      <Filter name="Brand" options={options} selectedValues={selected} onChange={setSelected} />
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Filter name="Brand" options={options} />
      <Filter name="Brand" options={options} selectedValues={['brand']} />
      <Filter name="Brand" options={options} />
      <Filter name="Brand" options={options} selectedValues={['chocomel']} onChange={() => {}} />
      <Filter name="Brand" options={options} selectedValues={['chocomel', 'fristi', 'brand']} onChange={() => {}} />
      <Filter name="Brand" options={options} />
    </div>
  ),
}; 