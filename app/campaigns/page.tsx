'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '@/components/layout/app-layout';
import { CardWithTabs } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/ui/filter-bar';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { DateRangePicker } from '@/components/ui/date-picker';
import { AdvertiserSelect } from '@/components/ui/advertiser-select';
import { DateRange } from 'react-day-picker';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { addDays } from 'date-fns';

// Campaign data for the card view
const campaignSummaryData = [
  {
    id: 'C-001',
    campaignType: 'sponsored-products',
    title: 'Holiday Sale Campaign',
    badge: { text: 'Best ROAS', variant: 'default' as const },
    goal: 'performance-transaction',
    estimatedRoas: '4.8x',
    budget: '$15,000',
    usedBudget: '$9,200',
    totalPrice: '$9,150',
    budgetUsagePercentage: 61,
    placements: 12,
    engines: [
      { id: 'display', name: 'Display', campaignName: 'Holiday Banners', status: 'running' as const, enabled: true },
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'Holiday Top Picks', status: 'running' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'Holiday Screens', status: 'ready' as const, enabled: true },
      { id: 'offline', name: 'Offline in-store', campaignName: 'Holiday POS', status: 'in-option' as const, enabled: true },
      { id: 'offsite', name: 'Offsite', campaignName: 'Holiday Open Web', status: 'draft' as const, enabled: true },
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
    badge: { text: 'High CTR', variant: 'secondary' as const },
    goal: 'brand-awareness',
    estimatedRoas: '3.2x',
    budget: '$8,500',
    usedBudget: '$2,100',
    totalPrice: '$2,125',
    budgetUsagePercentage: 25,
    placements: 8,
    engines: [
      { id: 'display', name: 'Display', campaignName: 'Summer Banners', status: 'running' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'Summer Kiosks', status: 'ready' as const, enabled: true },
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
    badge: { text: 'In Option', variant: 'outline' as const },
    goal: 'customer-acquisition',
    estimatedRoas: '5.1x',
    budget: '$12,000',
    usedBudget: '$4,800',
    totalPrice: '$4,800',
    budgetUsagePercentage: 40,
    placements: 15,
    engines: [
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'Back to School Promos', status: 'in-option' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'School Aisle Screens', status: 'in-option' as const, enabled: true },
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
      { id: 'display', name: 'Display', campaignName: 'BF Homepage Takeover', status: 'paused' as const, enabled: true },
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'BF Deal Listings', status: 'paused' as const, enabled: true },
      { id: 'digital', name: 'Digital in-store', campaignName: 'BF Store Screens', status: 'paused' as const, enabled: true },
      { id: 'offline', name: 'Offline in-store', campaignName: 'BF Shelf Talkers', status: 'paused' as const, enabled: true },
      { id: 'offsite', name: 'Offsite', campaignName: 'BF Open Web', status: 'new' as const, enabled: false },
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
    badge: { text: 'Ready', variant: 'secondary' as const },
    goal: 'retargeting',
    estimatedRoas: '4.5x',
    budget: '$18,000',
    usedBudget: '$1,200',
    totalPrice: '$19,500',
    budgetUsagePercentage: 7,
    placements: 14,
    engines: [
      { id: 'display', name: 'Display', campaignName: 'NY Retargeting Banners', status: 'ready' as const, enabled: true },
      { id: 'sponsored', name: 'Sponsored products', campaignName: 'NY Featured Products', status: 'ready' as const, enabled: true },
    ],
    dateRange: {
      from: new Date('2025-01-01'),
      to: addDays(new Date('2025-01-01'), 31),
    },
    features: [],
  },
];

const logData = [
  { id: 'LOG-001', timestamp: '2024-12-10 14:30:00', user: 'Jane Doe', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Holiday Sale Campaign', description: 'Initial campaign creation' },
  { id: 'LOG-002', timestamp: '2024-12-10 14:35:12', user: 'Jane Doe', action: 'Budget Updated', field: 'Budget', oldValue: '$10,000', newValue: '$15,000', description: 'Budget increased for holiday push' },
  { id: 'LOG-003', timestamp: '2024-12-10 15:22:45', user: 'John Smith', action: 'Status Changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Campaign moved to in-option status' },
  { id: 'LOG-004', timestamp: '2024-12-11 09:15:33', user: 'Sarah Wilson', action: 'Engine Added', field: 'Engines', oldValue: '-', newValue: 'Display', description: 'Added Display engine' },
  { id: 'LOG-005', timestamp: '2024-12-11 10:45:21', user: 'Jane Doe', action: 'Engine Added', field: 'Engines', oldValue: '-', newValue: 'Sponsored Products', description: 'Added Sponsored Products engine' },
  { id: 'LOG-006', timestamp: '2024-12-11 11:30:14', user: 'Mike Johnson', action: 'Dates Modified', field: 'End Date', oldValue: '06/25/2024', newValue: '06/30/2024', description: 'Extended campaign end date' },
  { id: 'LOG-007', timestamp: '2024-12-11 16:20:58', user: 'Sarah Wilson', action: 'Budget Updated', field: 'Budget', oldValue: '$15,000', newValue: '$18,000', description: 'Budget reallocated across engines' },
  { id: 'LOG-008', timestamp: '2024-12-12 08:45:12', user: 'John Smith', action: 'Campaign Created', field: 'Campaign', oldValue: '-', newValue: 'Summer Launch Campaign', description: 'New campaign created' },
  { id: 'LOG-009', timestamp: '2024-12-12 10:15:00', user: 'Jane Doe', action: 'Status Changed', field: 'Status', oldValue: 'In-option', newValue: 'Running', description: 'Holiday Sale Campaign is now live' },
  { id: 'LOG-010', timestamp: '2024-12-13 09:00:00', user: 'Mike Johnson', action: 'Engine Added', field: 'Engines', oldValue: '-', newValue: 'Digital In-store', description: 'Added Digital In-store engine to Summer Launch' },
];

export default function AllCampaignsPageWrapper() {
  return (
    <React.Suspense fallback={null}>
      <AllCampaignsPage />
    </React.Suspense>
  );
}

function AllCampaignsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const routes = getRoutesForTheme(theme);
  const [status, setStatus] = React.useState<string[]>([]);
  const [advertiser, setAdvertiser] = React.useState<string[]>([]);
  const [headerAdvertiser, setHeaderAdvertiser] = React.useState<string>('coca-cola');
  const [campaignBudgets, setCampaignBudgets] = React.useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = React.useState('media-experiences');
  const [logUsers, setLogUsers] = React.useState<string[]>([]);
  const [logActions, setLogActions] = React.useState<string[]>([]);
  const [pageDateRange, setPageDateRange] = React.useState<DateRange | undefined>({
    from: new Date('2024-06-01'),
    to: addDays(new Date('2024-06-01'), 180),
  });
  const [newCampaignIds, setNewCampaignIds] = React.useState<Set<string>>(new Set());

  // Check for newly created campaign from query param
  const newCampaignName = searchParams.get('new');

  type CampaignData = typeof campaignSummaryData[number];
  // Dynamic list of campaigns
  const [campaigns, setCampaigns] = React.useState<CampaignData[]>(campaignSummaryData);
  const nextId = React.useRef(campaigns.length + 1);

  // Add newly created campaign from URL param
  React.useEffect(() => {
    if (newCampaignName) {
      const newCampaign: CampaignData = {
        id: `C-${String(nextId.current).padStart(3, '0')}`,
        campaignType: 'new',
        title: newCampaignName,
        badge: { text: 'Draft', variant: 'outline' as const },
        goal: '',
        estimatedRoas: '0x',
        budget: '',
        usedBudget: '',
        totalPrice: '',
        budgetUsagePercentage: 0,
        placements: 0,
        engines: [],
        dateRange: {
          from: new Date(),
          to: addDays(new Date(), 30),
        },
        features: [],
      };
      nextId.current += 1;
      setCampaigns(prev => [newCampaign, ...prev]);
    }
  }, [newCampaignName]);

  // Add a new empty media experience
  const handleAddMediaExperience = () => {
    const newId = `C-${String(nextId.current).padStart(3, '0')}`;
    nextId.current += 1;
    const newCampaign: CampaignData = {
      id: newId,
      campaignType: 'new',
      title: 'Untitled',
      badge: { text: 'Draft', variant: 'outline' as const },
      goal: '',
      estimatedRoas: '0x',
      budget: '',
      usedBudget: '',
      totalPrice: '',
      budgetUsagePercentage: 0,
      placements: 0,
      engines: [],
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 30),
      },
      features: [],
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    setNewCampaignIds(prev => new Set(prev).add(newId));
  };

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
          headerRight: (
            <>
              <AdvertiserSelect
                value={headerAdvertiser}
                onChange={setHeaderAdvertiser}
              />
              <DateRangePicker
                dateRange={pageDateRange}
                onDateRangeChange={setPageDateRange}
                placeholder="Filter by date range"
                className="bg-background border-border w-[220px]"
                showPresets={true}
              />
            </>
          ),
        }}
      >
        <CardWithTabs
          className="w-full"
          tabs={[
            {
              label: 'Media experiences',
              value: 'media-experiences',
              content: (
                <div className="space-y-6 mt-6">
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
                  <div className="space-y-6">
                    {campaigns.map((campaign) => {
                      const currentBudget = campaignBudgets[campaign.title] || campaign.budget;
                      return (
                        <CampaignSummary
                          key={campaign.id}
                          layout="horizontal"
                          title={campaign.title}
                          goal={campaign.goal}
                          audience="retail-shoppers"
                          hideGoal
                          hideTargeting
                          hideAgent
                          hideAutoBudget
                          hideEngineToggle
                          hideEngineActions
                          guidedSetup={newCampaignIds.has(campaign.id)}
                          onCancel={() => {
                            setCampaigns(prev => prev.filter(c => c.id !== campaign.id));
                            setNewCampaignIds(prev => {
                              const next = new Set(prev);
                              next.delete(campaign.id);
                              return next;
                            });
                          }}
                          campaignId={campaign.id}
                          defaultExpanded={campaign.engines.length === 0 || newCampaignIds.has(campaign.id)}
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
                          }}
                          onEdit={() => {
                            router.push(`/campaigns/${campaign.campaignType}/${campaign.id}`);
                          }}
                          onEngineEdit={(engineId, engineName) => {
                            const engineTypeMap: { [key: string]: string } = {
                              'display': 'display',
                              'sponsored': 'sponsored-products',
                              'digital': 'digital-instore',
                              'offline': 'offline-instore',
                              'offsite': 'offsite',
                            };
                            const engineType = engineTypeMap[engineId] || engineId;
                            router.push(`/campaigns/${engineType}/${campaign.id}`);
                          }}
                          onEngineAdd={(propositionType) => {
                            console.log(`Adding ${propositionType} campaign to ${campaign.title}`);
                          }}
                          className="w-full"
                        />
                      );
                    })}
                  </div>
                </div>
              ),
            },
            {
              label: 'Logs',
              value: 'logs',
              content: (
                <div className="space-y-6 mt-6">
                  <FilterBar
                    filters={[
                      {
                        name: 'Users',
                        options: [
                          { label: 'Jane Doe', value: 'Jane Doe' },
                          { label: 'John Smith', value: 'John Smith' },
                          { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                          { label: 'Mike Johnson', value: 'Mike Johnson' },
                        ],
                        selectedValues: logUsers,
                        onChange: setLogUsers,
                      },
                      {
                        name: 'Actions',
                        options: [
                          { label: 'Campaign Created', value: 'Campaign Created' },
                          { label: 'Budget Updated', value: 'Budget Updated' },
                          { label: 'Status Changed', value: 'Status Changed' },
                          { label: 'Engine Added', value: 'Engine Added' },
                          { label: 'Dates Modified', value: 'Dates Modified' },
                        ],
                        selectedValues: logActions,
                        onChange: setLogActions,
                      },
                    ]}
                    searchValue={''}
                    onSearchChange={() => {}}
                    searchPlaceholder="Search logs..."
                  />
                  <Table
                    columns={[
                      { key: 'timestamp', header: 'Timestamp', render: (row: typeof logData[0]) => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
                      { key: 'user', header: 'User' },
                      { key: 'action', header: 'Action', render: (row: typeof logData[0]) => <Badge variant="outline">{row.action}</Badge> },
                      { key: 'field', header: 'Field' },
                      { key: 'oldValue', header: 'Old Value' },
                      { key: 'newValue', header: 'New Value' },
                      { key: 'description', header: 'Description' },
                    ]}
                    data={logData.filter(row => {
                      const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                      const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                      return userMatch && actionMatch;
                    })}
                    rowKey={(row: typeof logData[0]) => row.id}
                    onRowClick={(row: typeof logData[0]) => console.log(`Log clicked: ${row.id}`)}
                  />
                </div>
              ),
            },
          ]}
          action={
            activeTab === 'media-experiences' ? (
              <Button onClick={handleAddMediaExperience}>
                Add media experience
              </Button>
            ) : activeTab === 'logs' ? (
              <Button>Export logs</Button>
            ) : null
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppLayout>
    </MenuContextProvider>
  );
}
