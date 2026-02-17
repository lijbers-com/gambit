import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { MetricRow } from '@/components/ui/metric-row';
import type { MetricDefinition } from '@/components/ui/metric-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DateRangePicker } from '@/components/ui/date-picker';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { DateRange } from 'react-day-picker';
import {
  Eye,
  Brain,
  ShoppingCart,
  Heart,
  Check,
  X,
  Users,
  Tag,
  TrendingUp,
  DollarSign,
  BarChart3,
  ScanBarcode,
  MonitorSpeaker,
  ListStart,
  MonitorPlay,
  Store,
  Sparkles,
  Plus,
  FileText,
  Globe,
} from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Create Media Experience',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Create Media Experience - Wizard

A step-by-step wizard for creating new media experiences.

## Steps

1. **Campaign Setup** - Enter the campaign name and select the brand to advertise for
2. **Campaign Goal** - Select the objective of the media experience
3. **Targeting** - Select audience segments and add targeting tags
4. **Budget & Schedule** - Set the campaign budget and date range
5. Review & Launch (future)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Goal Card Component ---

interface GoalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

const GoalCard = ({ icon, title, description, selected, onClick }: GoalCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-start text-left p-6 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 hover:shadow-sm h-full ${
      selected
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-border bg-card'
    }`}
  >
    <div className={`mb-4 ${selected ? 'text-primary' : 'text-muted-foreground'}`}>
      {icon}
    </div>
    <h3 className="font-semibold text-sm mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
  </button>
);

// --- Data ---

const goals = [
  {
    id: 'awareness',
    icon: <Eye size={24} />,
    title: 'Awareness',
    description: 'Reach a broad audience and make them aware of your brand, product or service',
  },
  {
    id: 'consideration',
    icon: <Brain size={24} />,
    title: 'Consideration',
    description: 'Encourage people to think about your brand and seek out more information',
  },
  {
    id: 'purchase',
    icon: <ShoppingCart size={24} />,
    title: 'Purchase',
    description: 'Drive sales and conversions on your website, in your app or in physical stores',
  },
  {
    id: 'loyalty',
    icon: <Heart size={24} />,
    title: 'Loyalty',
    description: 'Strengthen existing customer relationships and drive repeat purchases',
  },
];

const brandOptions = [
  { label: 'Coca-Cola', value: 'coca-cola' },
  { label: 'Unilever', value: 'unilever' },
  { label: 'Procter & Gamble', value: 'procter-gamble' },
  { label: 'Nestlé', value: 'nestle' },
  { label: 'PepsiCo', value: 'pepsico' },
  { label: 'Heineken', value: 'heineken' },
];

const audienceOptions = [
  { id: 'all-shoppers', label: 'All Shoppers', description: 'All active shoppers in the platform', reach: '12.4M' },
  { id: 'frequent-buyers', label: 'Frequent Buyers', description: 'Customers with 3+ purchases per month', reach: '3.2M' },
  { id: 'new-customers', label: 'New Customers', description: 'First-time visitors in the last 30 days', reach: '1.8M' },
  { id: 'high-value', label: 'High Value Customers', description: 'Top 20% by average order value', reach: '2.1M' },
  { id: 'lapsed', label: 'Lapsed Customers', description: 'No purchase in the last 90 days', reach: '4.6M' },
  { id: 'category-buyers', label: 'Category Buyers', description: 'Active in relevant product categories', reach: '5.3M' },
];

const suggestedTags = [
  'Soft drinks', 'Snacks', 'Beverages', 'Organic', 'Health & Wellness',
  'Summer', 'Back to school', 'Holiday', 'Premium', 'Value',
  'Family', 'Young adults', 'Sports & Fitness',
];

const retailProducts = [
  { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
  { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
  { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
  { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
  { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
  { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
  { id: '612816', name: 'Nike - air max 270 - size 42' },
  { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
  { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
  { id: '615649', name: "Lay's - classic potato chips - 250g" },
  { id: '616250', name: 'Dove - body wash sensitive - 500ml' },
  { id: '617861', name: 'Nespresso - vertuo capsules - 30 pack' },
];

const propositions = [
  {
    id: 'display',
    name: 'Display',
    description: 'Banner ads across the retailer website and app',
    icon: MonitorSpeaker,
    metrics: { reach: '3.2M', roas: '2.8x', sales: '€8,400', roasChange: '+8%' },
    aiPreset: {
      id: 'display-ai',
      name: 'AI optimised display campaign',
      description: 'Automatically configured banner placements across homepage, category pages and checkout flow based on your audience and budget settings',
      placements: 13,
      estImpressions: '4.3M',
    },
  },
  {
    id: 'sponsored-products',
    name: 'Sponsored Products',
    description: 'Promoted product listings in search and category results',
    icon: ListStart,
    metrics: { reach: '4.8M', roas: '4.2x', sales: '€12,600', roasChange: '+18%' },
    aiPreset: {
      id: 'sp-ai',
      name: 'AI optimised sponsored products',
      description: 'Intelligent product placement in search results and category pages, optimised for your target audience and maximum return',
      placements: 9,
      estImpressions: '5.0M',
    },
  },
  {
    id: 'digital-instore',
    name: 'Digital In-Store',
    description: 'Digital screens and kiosks in physical retail locations',
    icon: MonitorPlay,
    metrics: { reach: '680K', roas: '1.9x', sales: '€3,200', roasChange: '+5%' },
    aiPreset: {
      id: 'dis-ai',
      name: 'AI optimised in-store digital',
      description: 'Smart selection of store entrance screens and aisle displays based on product category and shopper traffic patterns',
      placements: 36,
      estImpressions: '770K',
    },
  },
  {
    id: 'offline-instore',
    name: 'Offline In-Store',
    description: 'Physical media placements like shelf talkers, flyers and POS materials',
    icon: Store,
    metrics: { reach: '240K', roas: '1.4x', sales: '€1,800', roasChange: '+3%' },
    aiPreset: {
      id: 'ois-ai',
      name: 'AI optimised in-store media',
      description: 'Optimal mix of shelf talkers and point-of-sale displays based on store performance data and product placement',
      placements: 65,
      estImpressions: '275K',
    },
  },
  {
    id: 'extended-reach',
    name: 'Extended Reach',
    description: 'Extend your campaign beyond the retailer to partner networks and open web',
    icon: Globe,
    metrics: { reach: '8.5M', roas: '2.1x', sales: '€15,200', roasChange: '+14%' },
    aiPreset: {
      id: 'er-ai',
      name: 'AI optimised extended reach',
      description: 'Programmatic audience extension across partner networks and premium open web inventory, matched to your retailer first-party data',
      placements: 42,
      estImpressions: '9.8M',
    },
  },
];

const wizardSteps = [
  { id: 'setup', label: 'Campaign setup' },
  { id: 'goal', label: 'Campaign goal' },
  { id: 'targeting', label: 'Targeting' },
  { id: 'budget', label: 'Run time & budget' },
  { id: 'review', label: 'Media plan' },
];

export const GoalSelection: Story = {
  render: () => {
    const { theme: storybookTheme } = useStorybookTheme();
    const currentTheme = storybookTheme || 'retailMedia';
    const routes = getRoutesForTheme(currentTheme);

    // Wizard state
    const [currentStep, setCurrentStep] = React.useState(0);

    // Step 1: Campaign Setup
    const [campaignName, setCampaignName] = React.useState('');
    const [selectedBrand, setSelectedBrand] = React.useState('');
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);

    // Step 2: Campaign Goal
    const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null);

    // Step 3: Targeting
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [tags, setTags] = React.useState<string[]>([]);
    const [tagInput, setTagInput] = React.useState('');

    // Step 4: Run time & Budget
    const [budgetAmount, setBudgetAmount] = React.useState('');
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
    const [autoBudgetOptimization, setAutoBudgetOptimization] = React.useState(true);

    // Step 5: Media plan - proposition selections
    // Each key is a proposition id, value is 'preset' | 'empty' | null, plus selected preset id
    // Default: all propositions selected with AI preset
    const [propositionSelections, setPropositionSelections] = React.useState<Record<string, { mode: 'preset' | 'empty'; presetId?: string } | null>>(() => {
      const defaults: Record<string, { mode: 'preset' | 'empty'; presetId?: string }> = {};
      propositions.forEach(p => { defaults[p.id] = { mode: 'preset', presetId: p.aiPreset.id }; });
      return defaults;
    });

    // Derived data
    const selectedGoalData = goals.find((g) => g.id === selectedGoal);
    const selectedBrandData = brandOptions.find((b) => b.value === selectedBrand);

    // Step completion checks
    const isSetupComplete = campaignName.trim() !== '' && selectedBrand !== '';
    const isGoalComplete = selectedGoal !== null;
    const isTargetingComplete = selectedAudiences.length > 0;
    const isBudgetComplete = budgetAmount.trim() !== '' && dateRange?.from !== undefined && dateRange?.to !== undefined;

    // Audience toggle
    const toggleAudience = (id: string) => {
      setSelectedAudiences((prev) =>
        prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
      );
    };

    // Tag management
    const addTag = (tag: string) => {
      const trimmed = tag.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed]);
      }
      setTagInput('');
    };

    const removeTag = (tag: string) => {
      setTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(tagInput);
      }
    };

    // Retail product helpers
    const filteredRetailProducts = retailProducts.filter(product =>
      product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
      product.id.includes(retailProductSearch)
    );

    const handleRetailProductSelect = (product: { id: string; name: string }) => {
      if (!selectedRetailProducts.includes(product.id)) {
        setSelectedRetailProducts([...selectedRetailProducts, product.id]);
      }
      setRetailProductSearch('');
      setShowRetailProductResults(false);
    };

    const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRetailProductSearch(e.target.value);
      setShowRetailProductResults(e.target.value.length > 0);
    };

    const removeRetailProduct = (productId: string) => {
      setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setShowRetailProductResults(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get step value for summary
    const getStepValue = (stepId: string): string | null => {
      switch (stepId) {
        case 'setup':
          if (isSetupComplete) return `${campaignName} · ${selectedBrandData?.label}`;
          return null;
        case 'goal':
          if (selectedGoalData) return selectedGoalData.title;
          return null;
        case 'targeting': {
          if (!isTargetingComplete) return null;
          const audienceCount = selectedAudiences.length;
          return `${audienceCount} audience${audienceCount !== 1 ? 's' : ''}`;
        }
        case 'budget': {
          if (!isBudgetComplete) return null;
          return `€${budgetAmount} total`;
        }
        case 'review': {
          const selectedCount = Object.values(propositionSelections).filter(Boolean).length;
          if (selectedCount === 0) return null;
          return `${selectedCount} proposition${selectedCount !== 1 ? 's' : ''}`;
        }
        default:
          return null;
      }
    };

    // Get step status
    const getStepStatus = (stepId: string, stepIndex: number): 'completed' | 'active' | 'pending' => {
      if (stepIndex < currentStep) return 'completed';
      if (stepIndex === currentStep) return 'active';
      return 'pending';
    };

    // Estimated reach calculation
    const estimatedReach = React.useMemo(() => {
      if (selectedAudiences.length === 0) return null;
      let total = 0;
      selectedAudiences.forEach((id) => {
        const audience = audienceOptions.find((a) => a.id === id);
        if (audience) {
          const num = parseFloat(audience.reach.replace('M', ''));
          total += num;
        }
      });
      // Cap at a realistic number (overlapping audiences)
      const adjusted = Math.min(total * 0.8, 15);
      return `${adjusted.toFixed(1)}M`;
    }, [selectedAudiences]);

    // Proposition impact on metrics
    const propositionImpact = React.useMemo(() => {
      let additionalReach = 0;
      let roasBoost = 0;
      let additionalSales = 0;
      let selectedCount = 0;

      Object.entries(propositionSelections).forEach(([propId, sel]) => {
        if (!sel) return;
        selectedCount++;
        // Empty campaigns have unknown metrics, so skip them
        if (sel.mode === 'empty') return;
        const prop = propositions.find(p => p.id === propId);
        if (!prop) return;
        // Parse reach (e.g. '3.2M' or '680K')
        const reachStr = prop.metrics.reach;
        if (reachStr.endsWith('M')) {
          additionalReach += parseFloat(reachStr.replace('M', ''));
        } else if (reachStr.endsWith('K')) {
          additionalReach += parseFloat(reachStr.replace('K', '')) / 1000;
        }
        // Parse ROAS change (e.g. '+8%')
        const roasChangeNum = parseFloat(prop.metrics.roasChange.replace('%', '').replace('+', ''));
        roasBoost += roasChangeNum;
        // Parse sales (e.g. '€8,400')
        const salesNum = parseFloat(prop.metrics.sales.replace('€', '').replace(',', ''));
        additionalSales += salesNum;
      });

      return { additionalReach, roasBoost, additionalSales, selectedCount };
    }, [propositionSelections]);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: 'Create media experience',
            subtitle: '',
            headerRight: null,
          }}
        >
          <div className="space-y-6">
            {/* Metric cards - always visible, show '-' when no data */}
              <MetricRow
                metrics={[
                  {
                    key: 'reach',
                    label: 'Est. Reach',
                    value: selectedAudiences.length > 0
                      ? (() => {
                          const baseReach = parseFloat(estimatedReach?.replace('M', '') || '0');
                          const totalReach = baseReach + propositionImpact.additionalReach;
                          return `${totalReach.toFixed(1)}M`;
                        })()
                      : '-',
                    subMetric: selectedAudiences.length > 0
                      ? (propositionImpact.selectedCount > 0
                          ? `${selectedAudiences.length} audience${selectedAudiences.length !== 1 ? 's' : ''} · ${propositionImpact.selectedCount} proposition${propositionImpact.selectedCount !== 1 ? 's' : ''}`
                          : `${selectedAudiences.length} audience${selectedAudiences.length !== 1 ? 's' : ''}`)
                      : 'No audience selected',
                    badgeValue: selectedAudiences.length > 0 && propositionImpact.additionalReach > 0 ? `+${propositionImpact.additionalReach.toFixed(1)}M` : (selectedAudiences.length > 1 ? 'Combined' : undefined),
                    badgeVariant: propositionImpact.additionalReach > 0 ? 'success' as const : 'info' as const,
                  },
                  {
                    key: 'budget',
                    label: 'Budget',
                    value: budgetAmount.trim() !== '' ? `€${Number(budgetAmount).toLocaleString()}` : '-',
                    subMetric: budgetAmount.trim() !== ''
                      ? (dateRange?.from && dateRange?.to
                          ? `€${(parseFloat(budgetAmount) / (Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1)).toFixed(0)}/day`
                          : 'No dates set')
                      : 'No budget set',
                  },
                  {
                    key: 'roas',
                    label: 'Est. ROAS',
                    value: budgetAmount.trim() !== ''
                      ? (() => {
                          const baseRoas = 2.4 + (parseFloat(budgetAmount) > 5000 ? 1.2 : parseFloat(budgetAmount) > 2000 ? 0.6 : 0) + (selectedAudiences.length > 2 ? 0.5 : 0);
                          const boostedRoas = baseRoas * (1 + propositionImpact.roasBoost / 100);
                          return `${boostedRoas.toFixed(1)}x`;
                        })()
                      : '-',
                    subMetric: budgetAmount.trim() !== '' ? 'Predicted return' : 'Set budget to calculate',
                    badgeValue: budgetAmount.trim() !== '' ? (propositionImpact.roasBoost > 0 ? `+${propositionImpact.roasBoost}%` : '+12%') : undefined,
                    badgeVariant: 'success' as const,
                  },
                  {
                    key: 'sales',
                    label: 'Est. Sales',
                    value: budgetAmount.trim() !== ''
                      ? (() => {
                          const baseRoas = 2.4 + (parseFloat(budgetAmount) > 5000 ? 1.2 : parseFloat(budgetAmount) > 2000 ? 0.6 : 0) + (selectedAudiences.length > 2 ? 0.5 : 0);
                          const baseSales = parseFloat(budgetAmount) * baseRoas;
                          const totalSales = baseSales + propositionImpact.additionalSales;
                          return `€${Math.round(totalSales).toLocaleString()}`;
                        })()
                      : '-',
                    subMetric: budgetAmount.trim() !== '' ? 'Projected revenue' : 'Set budget to calculate',
                    badgeValue: budgetAmount.trim() !== '' ? (propositionImpact.additionalSales > 0 ? `+€${propositionImpact.additionalSales.toLocaleString()}` : 'Based on avg.') : undefined,
                    badgeVariant: propositionImpact.additionalSales > 0 ? 'success' as const : 'secondary' as const,
                  },
                ]}
                selectedKeys={['reach', 'budget', 'roas', 'sales']}
                maxVisible={4}
                defaultVariant="default"
                removable={false}
              />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 min-w-0">

              {/* Step 1: Campaign Setup */}
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Campaign setup</CardTitle>
                    <CardDescription>
                      Enter the basic details for your new media experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-name">Campaign name</Label>
                        <Input
                          id="campaign-name"
                          placeholder="e.g. Summer Sale 2026"
                          value={campaignName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
                          hint="Give your campaign a descriptive name to easily identify it later"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          dropdown
                          options={brandOptions}
                          value={selectedBrand}
                          onChange={(value: string) => setSelectedBrand(value)}
                          placeholder="Select a brand"
                        />
                        <div className="text-xs text-muted-foreground mt-1">Choose the brand this campaign will advertise for</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Retail products</Label>
                        <div className="relative" data-dropdown-container>
                          <SearchInput
                            value={retailProductSearch}
                            onChange={handleRetailProductSearchChange}
                            onClick={() => setShowRetailProductResults(true)}
                            placeholder="Select product by name or ID..."
                            className="w-full"
                            icon={<ScanBarcode className="w-4 h-4" />}
                          />
                          {showRetailProductResults && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredRetailProducts.length > 0 ? (
                                filteredRetailProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                                      selectedRetailProducts.includes(product.id) ? 'bg-primary/5' : ''
                                    }`}
                                    onClick={() => handleRetailProductSelect(product)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">{product.name}</span>
                                      <span className="text-xs text-muted-foreground">#{product.id}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 text-sm text-muted-foreground">No products found</div>
                              )}
                            </div>
                          )}
                        </div>
                        {selectedRetailProducts.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedRetailProducts.map((productId) => {
                              const product = retailProducts.find(p => p.id === productId);
                              if (!product) return null;
                              return (
                                <Badge key={productId} variant="default" size="large" className="gap-1 pr-1.5">
                                  {product.name}
                                  <button
                                    type="button"
                                    onClick={() => removeRetailProduct(productId)}
                                    className="ml-1 hover:text-destructive transition-colors rounded-full"
                                  >
                                    <X size={14} />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {selectedRetailProducts.length > 0
                            ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                            : 'Search and select retail products to target for this campaign'}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost">Cancel</Button>
                      <Button disabled={!isSetupComplete} onClick={() => setCurrentStep(1)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Campaign Goal */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What is your campaign goal?</CardTitle>
                    <CardDescription>
                      Select a goal to align the objectives and settings that work best for your campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {goals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          icon={goal.icon}
                          title={goal.title}
                          description={goal.description}
                          selected={selectedGoal === goal.id}
                          onClick={() => setSelectedGoal(goal.id)}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(0)}>Back</Button>
                      <Button disabled={!selectedGoal} onClick={() => setCurrentStep(2)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Targeting */}
              {currentStep === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users size={20} />
                        Select your audience
                      </CardTitle>
                      <CardDescription>
                        Choose one or more audience segments to target with your campaign
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {audienceOptions.map((audience) => {
                          const isSelected = selectedAudiences.includes(audience.id);
                          return (
                            <button
                              key={audience.id}
                              type="button"
                              onClick={() => toggleAudience(audience.id)}
                              className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/30'
                              }`}
                            >
                              <div
                                className={cn(
                                  "mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-primary flex items-center justify-center",
                                  isSelected && "bg-primary text-primary-foreground"
                                )}
                              >
                                {isSelected && <Check className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-medium">{audience.label}</span>
                                  <span className="text-xs text-muted-foreground flex-shrink-0">Reach: {audience.reach}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{audience.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {estimatedReach && (
                        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Estimated reach</span>
                            <span className="text-sm font-semibold text-primary">{estimatedReach} shoppers</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-3 mt-8">
                        <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                        <Button disabled={!isTargetingComplete} onClick={() => setCurrentStep(3)}>
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              )}

              {/* Step 4: Run time & Budget */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Run time & budget</CardTitle>
                    <CardDescription>
                      Set when your campaign runs and how much you want to spend
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Run time</Label>
                        <DateRangePicker
                          dateRange={dateRange}
                          onDateRangeChange={setDateRange}
                          placeholder="Select start and end date"
                          showPresets
                        />
                        <div className="text-xs text-muted-foreground">
                          Your campaign will automatically start and stop on the selected dates
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget-amount">Total budget</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                          <Input
                            id="budget-amount"
                            type="number"
                            placeholder="e.g. 5000"
                            value={budgetAmount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudgetAmount(e.target.value)}
                            className="pl-7"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          The maximum total amount for the entire campaign duration
                        </div>
                      </div>

                      {budgetAmount && dateRange?.from && dateRange?.to && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Daily average</span>
                            <span className="text-sm font-semibold text-primary">
                              €{(parseFloat(budgetAmount) / (Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1)).toFixed(2)}/day
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            €{budgetAmount} over {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                          </p>
                        </div>
                      )}

                      {/* Auto Budget Optimization */}
                      <div className={cn(
                        "rounded-lg border p-4 transition-all",
                        autoBudgetOptimization ? 'border-primary/30 bg-primary/5' : 'border-border'
                      )}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Sparkles size={14} className={autoBudgetOptimization ? 'text-primary' : 'text-muted-foreground'} />
                              <span className="text-sm font-medium">Auto budget optimization</span>
                              {autoBudgetOptimization && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">AI</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Automatically distribute your budget across propositions based on real-time performance data to maximise ROAS
                            </p>
                          </div>
                          <Switch
                            checked={autoBudgetOptimization}
                            onCheckedChange={setAutoBudgetOptimization}
                          />
                        </div>
                        {autoBudgetOptimization && budgetAmount && (
                          <div className="mt-3 pt-3 border-t border-primary/20 flex gap-4">
                            <div className="flex items-center gap-1.5">
                              <TrendingUp size={12} className="text-primary" />
                              <span className="text-xs text-muted-foreground">Avg. +18% ROAS improvement</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign size={12} className="text-primary" />
                              <span className="text-xs text-muted-foreground">Real-time rebalancing</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(2)}>Back</Button>
                      <Button disabled={!isBudgetComplete} onClick={() => setCurrentStep(4)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Media plan */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Media plan</CardTitle>
                    <CardDescription>
                      Toggle propositions on or off and choose a preset campaign or start with an empty configuration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {propositions.map((prop) => {
                        const selection = propositionSelections[prop.id];
                        const isEnabled = selection !== null && selection !== undefined;
                        const isAiSelected = selection?.mode === 'preset';
                        const isEmptySelected = selection?.mode === 'empty';
                        const IconComponent = prop.icon;

                        return (
                          <div
                            key={prop.id}
                            className={cn(
                              "rounded-lg border transition-all",
                              isEnabled ? 'border-border' : 'border-border/50'
                            )}
                          >
                            {/* Proposition header with toggle */}
                            <div className="flex items-center gap-3 p-4">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                isEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              )}>
                                <IconComponent size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={cn(
                                  "text-sm font-semibold",
                                  !isEnabled && 'text-muted-foreground'
                                )}>{prop.name}</span>
                                <p className="text-xs text-muted-foreground">{prop.description}</p>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                {isEnabled && (
                                  <span className="text-xs text-muted-foreground">
                                    {isEmptySelected ? '– reach · – ROAS' : `${prop.metrics.reach} reach · ${prop.metrics.roas} ROAS`}
                                  </span>
                                )}
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={(checked: boolean) => {
                                    if (checked) {
                                      setPropositionSelections(prev => ({
                                        ...prev,
                                        [prop.id]: { mode: 'preset', presetId: prop.aiPreset.id },
                                      }));
                                    } else {
                                      setPropositionSelections(prev => ({ ...prev, [prop.id]: null }));
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            {/* Expanded content when enabled */}
                            {isEnabled && (
                              <div className="px-4 pb-4">
                                <div className="grid grid-cols-2 gap-3">
                                  {/* AI preset option */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPropositionSelections(prev => ({
                                        ...prev,
                                        [prop.id]: { mode: 'preset', presetId: prop.aiPreset.id },
                                      }));
                                    }}
                                    className={cn(
                                      "flex flex-col items-start text-left p-4 rounded-lg border-2 transition-all cursor-pointer h-full",
                                      isAiSelected
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border hover:border-primary/30'
                                    )}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <Sparkles size={14} className="text-primary flex-shrink-0" />
                                      <span className="text-sm font-medium">Automatic</span>
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">AI</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{prop.aiPreset.description}</p>
                                    <div className="flex gap-3 mt-auto">
                                      <span className="text-xs text-muted-foreground">{prop.aiPreset.placements} placements</span>
                                      <span className="text-xs text-muted-foreground">~{prop.aiPreset.estImpressions} imp.</span>
                                    </div>
                                  </button>

                                  {/* Empty campaign option */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPropositionSelections(prev => ({
                                        ...prev,
                                        [prop.id]: { mode: 'empty' },
                                      }));
                                    }}
                                    className={cn(
                                      "flex flex-col items-start text-left p-4 rounded-lg border-2 border-dashed transition-all cursor-pointer h-full",
                                      isEmptySelected
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-muted-foreground/20 hover:border-primary/30'
                                    )}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <FileText size={14} className="text-muted-foreground flex-shrink-0" />
                                      <span className="text-sm font-medium">Empty campaign</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      Start with a blank {prop.name.toLowerCase()} campaign and configure manually
                                    </p>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(3)}>Back</Button>
                      <Button
                        onClick={() => {
                          // Navigate to media experiences overview with new campaign expanded
                          const name = campaignName || 'New Media Experience';
                          window.location.href = `/campaigns?new=${encodeURIComponent(name)}`;
                        }}
                      >
                        Launch media experience
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Summary sidebar */}
            <div className="flex flex-col gap-4">
              <CardSummary>
                <CardHeader>
                  <CardSummaryTitle>Summary</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  <div className="relative pl-12">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-slate-300"></div>

                    <div className="space-y-4">
                      {wizardSteps.map((step, index) => {
                        const status = getStepStatus(step.id, index);
                        const stepValue = getStepValue(step.id);

                        return (
                          <div key={step.id} className="relative flex items-start -ml-12">
                            {/* Circle on the timeline */}
                            <div className="w-10 flex justify-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                  status === 'completed'
                                    ? 'bg-primary text-primary-foreground'
                                    : status === 'active'
                                      ? 'bg-white text-primary border-2 border-primary'
                                      : 'bg-white text-muted-foreground border border-slate-300'
                                }`}
                              >
                                {status === 'completed' ? <Check size={14} /> : index + 1}
                              </div>
                            </div>
                            {/* Step content */}
                            <div className="ml-3 flex-1 min-w-0 pt-1">
                              <button
                                type="button"
                                className={`text-sm text-left ${
                                  status === 'active' || status === 'completed' ? 'font-medium' : 'text-muted-foreground'
                                } ${status === 'completed' ? 'hover:underline cursor-pointer' : ''}`}
                                onClick={() => {
                                  if (status === 'completed') setCurrentStep(index);
                                }}
                                disabled={status !== 'completed'}
                              >
                                {step.label}
                              </button>
                              {status === 'completed' && stepValue ? (
                                <div className="text-sm text-muted-foreground mt-0.5">{stepValue}</div>
                              ) : status === 'active' ? (
                                <div className="text-xs text-muted-foreground italic mt-0.5">
                                  {step.id === 'setup' ? 'Not filled in' : step.id === 'budget' ? 'Not configured' : 'Not selected'}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardSummaryContent>
              </CardSummary>
            </div>
          </div>
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};
