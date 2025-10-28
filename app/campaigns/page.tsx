'use client';

import * as React from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/filter-bar';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { defaultRoutes } from '@/components/layout/default-routes';
import { addDays } from 'date-fns';

// Campaign data for the card view
const campaignSummaryData = [
  {
    title: 'Holiday Sale Campaign',
    badge: { text: 'Best ROAS', variant: 'default' as const },
    goal: 'performance-transaction',
    estimatedRoas: '4.8x',
    budget: '$15,000',
    usedBudget: '$9,200',
    totalPrice: '$17,500',
    budgetUsagePercentage: 61,
    placements: 12,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
      { id: 'offline', name: 'Offline in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-06-01'),
      to: addDays(new Date('2024-06-01'), 29),
    },
    features: [],
  },
  {
    title: 'Summer Launch Campaign',
    badge: { text: 'High CTR', variant: 'secondary' as const },
    goal: 'brand-awareness',
    estimatedRoas: '3.2x',
    budget: '$8,500',
    usedBudget: '$2,100',
    totalPrice: '$9,200',
    budgetUsagePercentage: 25,
    placements: 8,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-07-01'),
      to: addDays(new Date('2024-07-01'), 30),
    },
    features: [],
  },
  {
    title: 'Back to School Campaign',
    badge: { text: 'In Option', variant: 'outline' as const },
    goal: 'customer-acquisition',
    estimatedRoas: '5.1x',
    budget: '$12,000',
    usedBudget: '$4,800',
    totalPrice: '$13,500',
    budgetUsagePercentage: 40,
    placements: 15,
    engines: [
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-08-10'),
      to: addDays(new Date('2024-08-10'), 31),
    },
    features: [],
  },
  {
    title: 'Black Friday Campaign',
    badge: { text: 'Paused', variant: 'destructive' as const },
    goal: 'performance-transaction',
    estimatedRoas: '6.2x',
    budget: '$25,000',
    usedBudget: '$22,800',
    totalPrice: '$28,000',
    budgetUsagePercentage: 91,
    placements: 20,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
      { id: 'digital', name: 'Digital in-store', enabled: true },
      { id: 'offline', name: 'Offline in-store', enabled: true },
    ],
    dateRange: {
      from: new Date('2024-11-01'),
      to: addDays(new Date('2024-11-01'), 29),
    },
    features: [],
  },
  {
    title: 'New Year Campaign',
    badge: { text: 'Ready', variant: 'secondary' as const },
    goal: 'retargeting',
    estimatedRoas: '4.5x',
    budget: '$18,000',
    usedBudget: '$1,200',
    totalPrice: '$19,500',
    budgetUsagePercentage: 7,
    placements: 14,
    engines: [
      { id: 'display', name: 'Display', enabled: true },
      { id: 'sponsored', name: 'Sponsored products', enabled: true },
    ],
    dateRange: {
      from: new Date('2025-01-01'),
      to: addDays(new Date('2025-01-01'), 31),
    },
    features: [],
  },
];

export default function AllCampaignsPage() {
  const [status, setStatus] = React.useState<string[]>([]);
  const [advertiser, setAdvertiser] = React.useState<string[]>([]);
  const [campaignBudgets, setCampaignBudgets] = React.useState<{ [key: string]: string }>({});

  return (
    <MenuContextProvider>
      <AppLayout
        routes={defaultRoutes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'All campaigns',
          subtitle: 'Complete overview of all your campaigns across all advertising engines',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
        }}
      >
        <Card className="w-full">
          <CardHeader>
            <FilterBar
              filters={[
                {
                  name: 'Status',
                  options: [
                    { label: 'Running', value: 'running' },
                    { label: 'Ready', value: 'ready' },
                    { label: 'In option', value: 'in-option' },
                    { label: 'Paused', value: 'paused' },
                  ],
                  selectedValues: status,
                  onChange: setStatus,
                },
                {
                  name: 'Advertiser',
                  options: [
                    { label: 'Acme Media', value: 'acme-media' },
                    { label: 'BrandX', value: 'brandx' },
                    { label: 'MediaWorks', value: 'mediaworks' },
                    { label: 'AdPartners', value: 'adpartners' },
                  ],
                  selectedValues: advertiser,
                  onChange: setAdvertiser,
                },
              ]}
              searchValue={''}
              onSearchChange={() => {}}
              searchPlaceholder="Search campaigns..."
            />
          </CardHeader>
          <CardContent className="space-y-6">
            {campaignSummaryData.map((campaign, index) => {
              const currentBudget = campaignBudgets[campaign.title] || campaign.budget;
              return (
                <CampaignSummary
                  key={index}
                  layout="horizontal"
                  title={campaign.title}
                  goal={campaign.goal}
                  audience="retail-shoppers"
                  estimatedRoas={campaign.estimatedRoas}
                  budget={currentBudget}
                  usedBudget={campaign.usedBudget}
                  totalPrice={campaign.totalPrice}
                  budgetUsagePercentage={campaign.budgetUsagePercentage}
                  engines={campaign.engines}
                  placements={campaign.placements}
                  dateRange={campaign.dateRange}
                  features={campaign.features}
                  onBudgetChange={(newBudget) => {
                    setCampaignBudgets(prev => ({
                      ...prev,
                      [campaign.title]: newBudget
                    }));
                    console.log(`Budget updated for ${campaign.title}: ${newBudget}`);
                  }}
                  onEdit={() => console.log(`Edit campaign: ${campaign.title}`)}
                  className="w-full"
                />
              );
            })}
          </CardContent>
        </Card>
      </AppLayout>
    </MenuContextProvider>
  );
}