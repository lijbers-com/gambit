import * as React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./filter-bar";

const meta: Meta<typeof FilterBar> = {
  title: "UI/FilterBar",
  component: FilterBar,
};
export default meta;

type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  render: () => {
    const [status, setStatus] = React.useState(["running", "paused", "draft", "completed", "archived"]);
    const [brand, setBrand] = React.useState<string[]>([]);
    const [media, setMedia] = React.useState<string[]>([]);
    const [search, setSearch] = React.useState("");

    return (
      <div className="p-6 bg-white">
        <FilterBar
          filters={[
            {
              name: "Status",
              options: [
                { label: "Running", value: "running" },
                { label: "Paused", value: "paused" },
                { label: "Draft", value: "draft" },
                { label: "Completed", value: "completed" },
                { label: "Archived", value: "archived" },
              ],
              selectedValues: status,
              onChange: setStatus,
            },
            {
              name: "Brand",
              options: [
                { label: "Brand A", value: "brand-a" },
                { label: "Brand B", value: "brand-b" },
              ],
              selectedValues: brand,
              onChange: setBrand,
            },
            {
              name: "Media product",
              options: Array.from({ length: 18 }, (_, i) => ({
                label: `Media Product ${i + 1}`,
                value: `media-product-${i + 1}`,
              })),
              selectedValues: media,
              onChange: setMedia,
            },
          ]}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search for ID, Name"
        />
      </div>
    );
  },
}; 