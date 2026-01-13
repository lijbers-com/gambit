'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/filter-bar';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { addDays } from 'date-fns';

// Campaign data for the card view
const campaignSummaryData = [
  {
    id: 'C-001',
    campaignType: 'sponsored-products',
    title: 'Holiday Sale Campaign',
    badge: { text: 'Running', variant: 'success' as const },
    goal: 'performance-transaction',
    estimatedRoas: '4.8x',
    budget: '$15,000',
    usedBudget: '$9,200',
    totalPrice: '$9,150',
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
    id: 'C-002',
    campaignType: 'display',
    title: 'Summer Launch Campaign',
    badge: { text: 'Running', variant: 'success' as const },
    goal: 'brand-awareness',
    estimatedRoas: '3.2x',
    budget: '$8,500',
    usedBudget: '$2,100',
    totalPrice: '$2,125',
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
    id: 'C-003',
    campaignType: 'digital-instore',
    title: 'Back to School Campaign',
    badge: { text: 'Running', variant: 'success' as const },
    goal: 'customer-acquisition',
    estimatedRoas: '5.1x',
    budget: '$12,000',
    usedBudget: '$4,800',
    totalPrice: '$4,800',
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
    id: 'C-004',
    campaignType: 'offline-instore',
    title: 'Black Friday Campaign',
    badge: { text: 'Paused', variant: 'destructive' as const },
    goal: 'performance-transaction',
    estimatedRoas: '6.2x',
    budget: '$25,000',
    usedBudget: '$22,800',
    totalPrice: '$22,750',
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
    id: 'C-005',
    campaignType: 'display',
    title: 'New Year Campaign',
    badge: { text: 'In-option', variant: 'outline' as const },
    goal: 'retargeting',
    estimatedRoas: '4.5x',
    budget: '$18,000',
    usedBudget: '$1,200',
    totalPrice: '$1,260',
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
  const router = useRouter();
  const { theme } = useTheme();
  const routes = getRoutesForTheme(theme);
  const [status, setStatus] = React.useState<string[]>([]);
  const [advertiser, setAdvertiser] = React.useState<string[]>([]);
  const [campaignBudgets, setCampaignBudgets] = React.useState<{ [key: string]: string }>({});

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Media Experiences',
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
                  badge={campaign.badge}
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
                  onEdit={() => {
                    // Navigate to the campaign detail page based on campaign type and ID
                    router.push(`/campaigns/${campaign.campaignType}/${campaign.id}`);
                  }}
                  onEngineEdit={(engineId, engineName) => {
                    // Map engine ID to URL path
                    const engineTypeMap: { [key: string]: string } = {
                      'display': 'display',
                      'sponsored': 'sponsored-products',
                      'digital': 'digital-instore',
                      'offline': 'offline-instore',
                    };
                    const engineType = engineTypeMap[engineId] || engineId;
                    // Navigate to the campaign detail page for this engine type
                    router.push(`/campaigns/${engineType}/${campaign.id}`);
                  }}
                  onNotificationClick={(notificationType) => {
                    // Navigate to chat page for budget recommendation
                    if (notificationType === 'budget-recommendation') {
                      router.push('/chat');
                    }
                  }}
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