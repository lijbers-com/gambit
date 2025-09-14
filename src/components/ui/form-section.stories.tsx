import type { Meta, StoryObj } from '@storybook/react';
import { FormSection } from './form-section';
import { Input } from './input';

const meta: Meta<typeof FormSection> = {
  title: 'UI/FormSection',
  component: FormSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormSection>;

export const SingleField: Story = {
  render: () => (
    <FormSection title="Details">
      <div>
        <label className="block text-sm font-medium mb-1">Campaign name</label>
        <Input placeholder="Enter campaign name" />
      </div>
    </FormSection>
  ),
};

export const MultipleFields: Story = {
  render: () => (
    <FormSection title="Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Campaign name</label>
          <Input placeholder="Enter campaign name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">PO number</label>
          <Input placeholder="Enter PO number" />
        </div>
      </div>
    </FormSection>
  ),
}; 