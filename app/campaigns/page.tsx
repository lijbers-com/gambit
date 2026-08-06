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
import { SessionDateRange } from '@/components/ui/session-date-range';
import { useSessionFilters, withinSessionRange } from '@/lib/session-filters';
import { AdvertiserSelect } from '@/components/ui/advertiser-select';
import { PropositionIcon } from '@/components/ui/proposition-icon';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useTheme } from '@/contexts/theme-context';
import { addDays } from 'date-fns';
import { useDb, useSession, createMediaPlan, updateMediaPlan, deleteMediaPlan, type EngineId, type PlanStatus } from '@/lib/db';

// ── DB → card-view mapping ─────────────────────────────────────────────
// The media-plan cards render straight from the prototype database; these
// helpers translate store entities into the CampaignSummary props.

/** DB engine id → CampaignSummary engine id (its internal vocabulary). */
const engineCardId: Record<EngineId, string> = {
  'display': 'display',
  'sponsored-products': 'sponsored',
  'digital-instore': 'digital',
  'offline-instore': 'offline',
  'offsite': 'offsite',
};

const engineCardName: Record<EngineId, string> = {
  'display': 'Display',
  'sponsored-products': 'Sponsored products',
  'digital-instore': 'Digital in-store',
  'offline-instore': 'Offline in-store',
  'offsite': 'Offsite',
};

const engineCardStatus: Record<PlanStatus, 'new' | 'draft' | 'ready' | 'in-option' | 'running' | 'paused'> = {
  'draft': 'draft',
  'in-option': 'in-option',
  'running': 'running',
  'paused': 'paused',
  'completed': 'ready',
};

const planBadge = (status: PlanStatus): { text: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' } => {
  switch (status) {
    case 'running': return { text: 'Running', variant: 'success' };
    case 'paused': return { text: 'Paused', variant: 'destructive' };
    case 'completed': return { text: 'Completed', variant: 'secondary' };
    case 'draft': return { text: 'Draft', variant: 'outline' };
    default: return { text: 'In-option', variant: 'outline' };
  }
};

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
  const sessionFilters = useSessionFilters();
  const [logUsers, setLogUsers] = React.useState<string[]>([]);
  const [logActions, setLogActions] = React.useState<string[]>([]);
  const [newCampaignIds, setNewCampaignIds] = React.useState<Set<string>>(new Set());
  // Campaigns that have a pending (not-yet-created) sponsored engine row added
  const [pendingSponsoredEngines, setPendingSponsoredEngines] = React.useState<Set<string>>(new Set());

  // Check for newly created campaign from query params
  const newCampaignName = searchParams.get('new');
  const newBudget = searchParams.get('budget') ?? '';
  const newAdvertiser = searchParams.get('advertiser') ?? '';
  const newStartDate = searchParams.get('startDate');
  const newEndDate = searchParams.get('endDate');

  // ── Live data from the prototype database ────────────────────────────
  const db = useDb();
  const sessionUser = useSession();

  // A media plan arriving from the create flow via URL params is written to
  // the store once (guarded against strict-mode double effects).
  const createdFromParams = React.useRef(false);
  React.useEffect(() => {
    if (newCampaignName && !createdFromParams.current) {
      createdFromParams.current = true;
      const plan = createMediaPlan({
        name: newCampaignName,
        advertiserId: db.advertisers[0]?.id ?? 'adv-acme',
        brandIds: [],
        status: 'draft',
        kpis: [],
        budget: newBudget ? parseFloat(newBudget) || 0 : 0,
        startDate: (newStartDate ? new Date(newStartDate) : new Date()).toISOString().slice(0, 10),
        endDate: (newEndDate ? new Date(newEndDate) : addDays(new Date(), 30)).toISOString().slice(0, 10),
        createdBy: sessionUser?.id,
      });
      setNewCampaignIds(prev => new Set(prev).add(plan.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCampaignName]);

  // Add a new empty media plan straight into the store.
  const handleAddMediaExperience = () => {
    const plan = createMediaPlan({
      name: 'Untitled',
      advertiserId: db.advertisers[0]?.id ?? 'adv-acme',
      brandIds: [],
      status: 'draft',
      kpis: [],
      budget: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: addDays(new Date(), 30).toISOString().slice(0, 10),
      createdBy: sessionUser?.id,
    });
    setNewCampaignIds(prev => new Set(prev).add(plan.id));
  };

  // Map store entities into the CampaignSummary card shape. Newest first, and
  // only the plans whose flight overlaps the session's date range.
  const campaigns = [...db.mediaPlans]
    .filter((plan) => withinSessionRange(sessionFilters, plan.startDate, plan.endDate))
    .reverse()
    .map((plan) => {
    const planCampaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
    const planBookings = db.bookings.filter((b) => planCampaigns.some((c) => c.id === b.campaignId));
    const spend = planCampaigns.reduce((s, c) => s + c.spend, 0);
    const advertiserName = db.advertisers.find((a) => a.id === plan.advertiserId)?.name ?? '';
    return {
      id: plan.id,
      status: plan.status,
      advertiserName,
      title: plan.name,
      badge: planBadge(plan.status),
      goal: plan.goal ?? '',
      budget: plan.budget > 0 ? `€${plan.budget.toLocaleString()}` : '',
      usedBudget: spend > 0 ? `€${spend.toLocaleString()}` : '',
      budgetUsagePercentage: plan.budget > 0 ? Math.round((spend / plan.budget) * 100) : 0,
      bookings: planBookings.length,
      engines: planCampaigns.map((c) => ({
        id: engineCardId[c.engine],
        name: engineCardName[c.engine],
        campaignName: c.name,
        status: engineCardStatus[c.status],
        enabled: true,
        budget: c.budget,
        spend: c.spend,
      })),
      dateRange: { from: new Date(plan.startDate), to: new Date(plan.endDate) },
      features: [] as { id: string; label: string; enabled: boolean }[],
    };
  }).filter((plan) => {
    const statusMatch = status.length === 0 || status.includes(plan.status);
    const advertiserMatch = advertiser.length === 0 || advertiser.includes(plan.advertiserName.toLowerCase().replace(/ /g, '-'));
    return statusMatch && advertiserMatch;
  });

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: 'Media plans',
          titleIcon: <PropositionIcon engineType="media-plans" />,
          subtitle: 'All media plans',
          onEdit: () => alert('Edit clicked'),
          onExport: () => alert('Export clicked'),
          onImport: () => alert('Import clicked'),
          onSettings: () => alert('Settings clicked'),
          headerRight: (
            <div className="flex items-center gap-2">
              <AdvertiserSelect
                value={headerAdvertiser}
                onChange={setHeaderAdvertiser}
              />
              <SessionDateRange />
            </div>
          ),
        }}
      >
        <CardWithTabs
          className="w-full"
          tabs={[
            {
              label: 'Media plans',
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
                        options: db.advertisers.map((a) => ({
                          label: a.name,
                          value: a.name.toLowerCase().replace(/ /g, '-'),
                        })),
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
                          hideEngineToggle
                          hideEngineActions
                          guidedSetup={newCampaignIds.has(campaign.id)}
                          collapsedOnly
                          onCancel={() => {
                            // Cancelling a fresh plan removes it from the store.
                            deleteMediaPlan(campaign.id);
                            setNewCampaignIds(prev => {
                              const next = new Set(prev);
                              next.delete(campaign.id);
                              return next;
                            });
                          }}
                          onRename={(newName) => updateMediaPlan(campaign.id, { name: newName })}
                          campaignId={campaign.id}
                          badge={campaign.badge}
                          estimatedRoas="—"
                          defaultExpanded={newCampaignIds.has(campaign.id)}
                          budget={currentBudget}
                          usedBudget={campaign.usedBudget}
                          budgetUsagePercentage={campaign.budgetUsagePercentage}
                          engines={campaign.engines}
                          bookings={campaign.bookings}
                          dateRange={campaign.dateRange}
                          features={campaign.features}
                          onBudgetChange={(newBudget) => {
                            const numeric = parseFloat(newBudget.replace(/[^0-9.]/g, '')) || 0;
                            updateMediaPlan(campaign.id, { budget: numeric });
                            setCampaignBudgets(prev => ({
                              ...prev,
                              [campaign.title]: newBudget
                            }));
                          }}
                          onEdit={() => {
                            router.push(`/campaigns/plan/${campaign.id}`);
                          }}
                          onEngineEdit={(engineId, engineName) => {
                            // Pending sponsored engine row — launch the create wizard with pre-fill
                            const baseType = engineId.replace(/-\d+$/, '');
                            if (baseType === 'sponsored' && pendingSponsoredEngines.has(campaign.id)) {
                              setPendingSponsoredEngines(prev => {
                                const next = new Set(prev);
                                next.delete(campaign.id);
                                return next;
                              });
                              const params = new URLSearchParams();
                              params.set('from', 'media-plan');
                              // Media plan identity — used for dropdown selection and summary card
                              if (campaign.title) params.set('mediaPlanLabel', campaign.title);
                              // Media plan details — shown in the summary card
                              if (currentBudget) params.set('mediaPlanBudget', currentBudget);
                              if (newAdvertiser) params.set('mediaPlanAdvertiser', newAdvertiser);
                              if (campaign.dateRange?.from) params.set('mediaPlanStartDate', campaign.dateRange.from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
                              if (campaign.dateRange?.to) params.set('mediaPlanEndDate', campaign.dateRange.to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
                              params.set('mediaPlanStatus', 'Draft');
                              // Campaign form pre-fill (budget & dates inherited from media plan)
                              if (currentBudget) params.set('budget', currentBudget.replace(/[^0-9.]/g, ''));
                              if (newAdvertiser) params.set('advertiser', newAdvertiser);
                              if (campaign.dateRange?.from) params.set('startDate', campaign.dateRange.from.toISOString());
                              if (campaign.dateRange?.to) params.set('endDate', campaign.dateRange.to.toISOString());
                              router.push(`/create/sponsored-products?${params.toString()}`);
                              return;
                            }
                            // Existing engine — go to detail page
                            const engineTypeMap: { [key: string]: string } = {
                              'display': 'display',
                              'sponsored': 'sponsored-products',
                              'digital': 'digital-instore',
                              'offline': 'offline-instore',
                              'offsite': 'offsite',
                            };
                            const engineType = engineTypeMap[baseType] || baseType;
                            router.push(`/campaigns/${engineType}/${campaign.id}`);
                          }}
                          onEngineAdd={(propositionType) => {
                            if (propositionType === 'sponsored-products' || propositionType === 'sponsored') {
                              // Mark this campaign as having a pending sponsored engine row.
                              // The row is already added internally by CampaignSummary;
                              // the user clicks "Create" on it to launch the wizard.
                              setPendingSponsoredEngines(prev => new Set(prev).add(campaign.id));
                            }
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
                Add media plan
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
