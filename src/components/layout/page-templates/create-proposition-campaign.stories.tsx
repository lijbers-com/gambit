import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { MetricRow } from '@/components/ui/metric-row';
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
  Sparkles,
  ScanBarcode,
  MonitorSpeaker,
  ListStart,
  MonitorPlay,
  Store,
  CalendarDays,
  Target,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Create Proposition Campaign',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Create Proposition Campaign - Wizard

A step-by-step wizard for creating campaigns for a specific proposition type.

## Steps

1. **Campaign Setup** - Enter the campaign name, select brand, and choose retail products
2. **Campaign Goal** - Select the objective of the campaign
3. **Targeting** - Select audience segments and add targeting tags
4. **Run time & Budget** - Set the campaign budget and date range
5. **Review & Launch** - Review all settings and launch the campaign
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Types ---

interface PropositionConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  metrics: { reach: string; roas: string; sales: string; roasChange: string };
  campaignRoute: string;
}

// --- Data ---

const propositionConfigs: Record<string, PropositionConfig> = {
  display: {
    id: 'display',
    name: 'Display',
    description: 'Banner ads across the retailer website and app',
    icon: MonitorSpeaker,
    metrics: { reach: '3.2M', roas: '2.8x', sales: '€8,400', roasChange: '+8%' },
    campaignRoute: '/campaigns/display',
  },
  'sponsored-products': {
    id: 'sponsored-products',
    name: 'Sponsored Products',
    description: 'Promoted product listings in search and category results',
    icon: ListStart,
    metrics: { reach: '4.8M', roas: '4.2x', sales: '€12,600', roasChange: '+18%' },
    campaignRoute: '/campaigns/sponsored-products',
  },
  'offline-instore': {
    id: 'offline-instore',
    name: 'Offline In-Store',
    description: 'Physical media placements like shelf talkers, flyers and POS materials',
    icon: Store,
    metrics: { reach: '240K', roas: '1.4x', sales: '€1,800', roasChange: '+3%' },
    campaignRoute: '/campaigns/offline-instore',
  },
  'digital-instore': {
    id: 'digital-instore',
    name: 'Digital In-Store',
    description: 'Digital screens and kiosks in physical retail locations',
    icon: MonitorPlay,
    metrics: { reach: '680K', roas: '1.9x', sales: '€3,200', roasChange: '+5%' },
    campaignRoute: '/campaigns/digital-instore',
  },
};

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

const getWizardSteps = (propositionType: string) => {
  const base = [
    { id: 'setup', label: 'Campaign setup' },
    { id: 'brand', label: 'Brand & products' },
    { id: 'goal', label: 'Campaign goal' },
    { id: 'targeting', label: 'Targeting' },
  ];
  if (propositionType === 'sponsored-products') {
    base.push({ id: 'keywords', label: 'Keywords & placements' });
  }
  base.push({ id: 'review', label: 'Review & launch' });
  return base;
};

// --- Keywords & Placements data (Sponsored Products) ---

const suggestedKeywords = [
  'Yoghurt', 'Toetjes', 'Toetje', 'Kinder', 'Dessert',
  'Yogurt', 'Zuivel', 'Joghurt', 'Kwark',
];

const categoryPlacements = [
  { id: 'yoghurt-cat', name: 'Yoghurt category', children: [
    { id: 'halfvolle-yoghurt', name: 'Halfvolle yoghurt category' },
    { id: 'vanille-yoghurt', name: 'Vanille yoghurt category' },
    { id: 'griekse-yoghurt', name: 'Griekse yoghurt category' },
  ]},
  { id: 'toetjes-cat', name: 'Toetjes category', children: [
    { id: 'vla', name: 'Vla category' },
    { id: 'pudding', name: 'Pudding category' },
  ]},
  { id: 'zuivel-cat', name: 'Zuivel category', children: [
    { id: 'melk', name: 'Melk category' },
    { id: 'kaas', name: 'Kaas category' },
  ]},
  { id: 'kinder-cat', name: 'Kinder category', children: [
    { id: 'kinder-yoghurt', name: 'Kinder yoghurt category' },
    { id: 'kinder-toetjes', name: 'Kinder toetjes category' },
  ]},
];

const otherPlacements = [
  { id: 'product-detail', name: 'Product detail page' },
  { id: 'past-purchases', name: 'Past purchases page' },
  { id: 'order-confirmation', name: 'Order confirmation page' },
  { id: 'search-results', name: 'Search results page' },
  { id: 'homepage', name: 'Homepage' },
];

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

// --- Proposition Wizard Component ---

const PropositionWizard = ({ propositionType }: { propositionType: string }) => {
  const { theme: storybookTheme } = useStorybookTheme();
  const currentTheme = storybookTheme || 'retailMedia';
  const routes = getRoutesForTheme(currentTheme);
  const proposition = propositionConfigs[propositionType];
  const PropositionIcon = proposition.icon;
  const wizardSteps = React.useMemo(() => getWizardSteps(propositionType), [propositionType]);
  const isSponsoredProducts = propositionType === 'sponsored-products';

  // Wizard state
  const [currentStep, setCurrentStep] = React.useState(0);
  const currentStepId = wizardSteps[currentStep]?.id;

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

  // Step: Keywords & Placements (Sponsored Products only)
  const [selectedKeywords, setSelectedKeywords] = React.useState<string[]>([]);
  const [keywordInput, setKeywordInput] = React.useState('');
  const [keywordSearch, setKeywordSearch] = React.useState('');
  const [showKeywordSuggestions, setShowKeywordSuggestions] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);
  const [categorySearch, setCategorySearch] = React.useState('');
  const [showCategoryResults, setShowCategoryResults] = React.useState(false);
  const [selectedOtherPlacements, setSelectedOtherPlacements] = React.useState<string[]>([]);
  const [placementSearch, setPlacementSearch] = React.useState('');
  const [showPlacementResults, setShowPlacementResults] = React.useState(false);

  // Step: Run time & Budget
  const [budgetAmount, setBudgetAmount] = React.useState('');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [autoBudgetOptimization, setAutoBudgetOptimization] = React.useState(true);

  // Derived data
  const selectedGoalData = goals.find((g) => g.id === selectedGoal);
  const selectedBrandData = brandOptions.find((b) => b.value === selectedBrand);

  // Step completion checks
  const isSetupComplete = campaignName.trim() !== '' && budgetAmount.trim() !== '' && dateRange?.from !== undefined && dateRange?.to !== undefined;
  const isBrandComplete = selectedBrand !== '';
  const isGoalComplete = selectedGoal !== null;
  const isTargetingComplete = selectedAudiences.length > 0;
  const isKeywordsComplete = isSponsoredProducts ? (selectedKeywords.length > 0 || selectedCategories.length > 0) : true;

  // Step navigation helpers
  const goToNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, wizardSteps.length - 1));
  const goToPrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStepById = (id: string) => {
    const idx = wizardSteps.findIndex((s) => s.id === id);
    if (idx >= 0) setCurrentStep(idx);
  };

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
        setShowKeywordSuggestions(false);
        setShowCategoryResults(false);
        setShowPlacementResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const adjusted = Math.min(total * 0.8, 15);
    return `${adjusted.toFixed(1)}M`;
  }, [selectedAudiences]);

  // Parse proposition reach for metrics
  const propositionReach = React.useMemo(() => {
    const reachStr = proposition.metrics.reach;
    if (reachStr.endsWith('M')) return parseFloat(reachStr.replace('M', ''));
    if (reachStr.endsWith('K')) return parseFloat(reachStr.replace('K', '')) / 1000;
    return 0;
  }, [proposition]);

  const roasBoost = parseFloat(proposition.metrics.roasChange.replace('%', '').replace('+', ''));
  const additionalSales = parseFloat(proposition.metrics.sales.replace('€', '').replace(',', ''));

  // Keyword helpers
  const addKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      setSelectedKeywords((prev) => [...prev, trimmed]);
    }
    setKeywordInput('');
  };

  const removeKeyword = (kw: string) => {
    setSelectedKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const parts = keywordInput.split(',').map(s => s.trim()).filter(Boolean);
      parts.forEach(addKeyword);
    }
  };

  const filteredSuggestedKeywords = suggestedKeywords.filter(
    (kw) => !selectedKeywords.includes(kw) && kw.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  // Category helpers
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleCategoryExpand = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredCategories = categorySearch
    ? categoryPlacements.filter(
        (cat) =>
          cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
          cat.children.some((child) => child.name.toLowerCase().includes(categorySearch.toLowerCase()))
      )
    : categoryPlacements;

  // Other placement helpers
  const toggleOtherPlacement = (id: string) => {
    setSelectedOtherPlacements((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filteredOtherPlacements = placementSearch
    ? otherPlacements.filter((p) => p.name.toLowerCase().includes(placementSearch.toLowerCase()))
    : otherPlacements;

  // Get step value for summary
  const getStepValue = (stepId: string): string | null => {
    switch (stepId) {
      case 'setup':
        if (isSetupComplete) return `${campaignName} · €${budgetAmount}`;
        return null;
      case 'brand': {
        if (!isBrandComplete) return null;
        const parts = [selectedBrandData?.label];
        if (selectedRetailProducts.length > 0) parts.push(`${selectedRetailProducts.length} product${selectedRetailProducts.length !== 1 ? 's' : ''}`);
        return parts.filter(Boolean).join(' · ');
      }
      case 'goal':
        if (selectedGoalData) return selectedGoalData.title;
        return null;
      case 'targeting': {
        if (!isTargetingComplete) return null;
        const audienceCount = selectedAudiences.length;
        return `${audienceCount} audience${audienceCount !== 1 ? 's' : ''}`;
      }
      case 'keywords': {
        const parts: string[] = [];
        if (selectedKeywords.length > 0) parts.push(`${selectedKeywords.length} keyword${selectedKeywords.length !== 1 ? 's' : ''}`);
        if (selectedCategories.length > 0) parts.push(`${selectedCategories.length} categor${selectedCategories.length !== 1 ? 'ies' : 'y'}`);
        if (selectedOtherPlacements.length > 0) parts.push(`${selectedOtherPlacements.length} placement${selectedOtherPlacements.length !== 1 ? 's' : ''}`);
        return parts.length > 0 ? parts.join(' · ') : null;
      }
      case 'review':
        return null;
      default:
        return null;
    }
  };

  // Get step status
  const getStepStatus = (stepIndex: number): 'completed' | 'active' | 'pending' => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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
          title: `Create ${proposition.name.toLowerCase()} campaign`,
          subtitle: '',
          headerRight: null,
        }}
      >
        <div className="space-y-6">
          {/* Metric cards */}
          <MetricRow
            metrics={[
              {
                key: 'reach',
                label: 'Est. Reach',
                value: selectedAudiences.length > 0
                  ? (() => {
                      const baseReach = parseFloat(estimatedReach?.replace('M', '') || '0');
                      const totalReach = baseReach + propositionReach;
                      return `${totalReach.toFixed(1)}M`;
                    })()
                  : '-',
                subMetric: selectedAudiences.length > 0
                  ? `${selectedAudiences.length} audience${selectedAudiences.length !== 1 ? 's' : ''} · ${proposition.name}`
                  : 'No audience selected',
                badgeValue: selectedAudiences.length > 0 ? `+${propositionReach.toFixed(1)}M` : undefined,
                badgeVariant: 'success' as const,
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
                      const boostedRoas = baseRoas * (1 + roasBoost / 100);
                      return `${boostedRoas.toFixed(1)}x`;
                    })()
                  : '-',
                subMetric: budgetAmount.trim() !== '' ? 'Predicted return' : 'Set budget to calculate',
                badgeValue: budgetAmount.trim() !== '' ? `+${roasBoost}%` : undefined,
                badgeVariant: 'success' as const,
              },
              {
                key: 'sales',
                label: 'Est. Sales',
                value: budgetAmount.trim() !== ''
                  ? (() => {
                      const baseRoas = 2.4 + (parseFloat(budgetAmount) > 5000 ? 1.2 : parseFloat(budgetAmount) > 2000 ? 0.6 : 0) + (selectedAudiences.length > 2 ? 0.5 : 0);
                      const baseSales = parseFloat(budgetAmount) * baseRoas;
                      const totalSales = baseSales + additionalSales;
                      return `€${Math.round(totalSales).toLocaleString()}`;
                    })()
                  : '-',
                subMetric: budgetAmount.trim() !== '' ? 'Projected revenue' : 'Set budget to calculate',
                badgeValue: budgetAmount.trim() !== '' ? `+€${additionalSales.toLocaleString()}` : undefined,
                badgeVariant: 'success' as const,
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

              {/* Step: Campaign Setup (name + budget + runtime) */}
              {currentStepId === 'setup' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Campaign setup</CardTitle>
                    <CardDescription>
                      Enter the basic details for your new {proposition.name.toLowerCase()} campaign
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
                              Automatically optimize your budget allocation based on real-time performance data to maximise ROAS
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
                      <Button variant="ghost">Cancel</Button>
                      <Button disabled={!isSetupComplete} onClick={goToNextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Brand & Products */}
              {currentStepId === 'brand' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Brand & products</CardTitle>
                    <CardDescription>
                      Select the brand and retail products for this campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
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
                            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredRetailProducts.length > 0 ? (
                                filteredRetailProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className={`p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 ${
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
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button disabled={!isBrandComplete} onClick={goToNextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Campaign Goal */}
              {currentStepId === 'goal' && (
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
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button disabled={!selectedGoal} onClick={goToNextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Targeting */}
              {currentStepId === 'targeting' && (
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

                    {/* Tags section */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-muted-foreground" />
                        <Label>Targeting tags</Label>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTag(tagInput)}
                          disabled={!tagInput.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="default" size="large" className="gap-1 pr-1.5">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive transition-colors rounded-full"
                              >
                                <X size={14} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {suggestedTags
                          .filter((t) => !tags.includes(t))
                          .slice(0, 8)
                          .map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => addTag(tag)}
                              className="text-xs px-2 py-1 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                            >
                              + {tag}
                            </button>
                          ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button disabled={!isTargetingComplete} onClick={goToNextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Keywords & Placements (Sponsored Products only) */}
              {currentStepId === 'keywords' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Keywords & placements</CardTitle>
                    <CardDescription>
                      Add keywords and select category and other placements for your sponsored products campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Keywords section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Keywords</Label>
                        <div className="relative" data-dropdown-container>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <SearchInput
                                value={keywordInput}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setKeywordInput(e.target.value);
                                  setKeywordSearch(e.target.value);
                                  setShowKeywordSuggestions(e.target.value.length > 0);
                                }}
                                onKeyDown={handleKeywordKeyDown}
                                onClick={() => setShowKeywordSuggestions(true)}
                                placeholder="Add keywords separated with commas"
                                className="w-full"
                                icon={<Search className="w-4 h-4" />}
                              />
                              {showKeywordSuggestions && filteredSuggestedKeywords.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                  {filteredSuggestedKeywords.map((kw) => (
                                    <div
                                      key={kw}
                                      className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                                      onClick={() => {
                                        addKeyword(kw);
                                        setShowKeywordSuggestions(false);
                                      }}
                                    >
                                      <span className="text-sm">{kw}</span>
                                      <Plus size={16} className="text-primary" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button onClick={() => {
                              const parts = keywordInput.split(',').map(s => s.trim()).filter(Boolean);
                              parts.forEach(addKeyword);
                            }} disabled={!keywordInput.trim()}>
                              Add
                            </Button>
                          </div>
                        </div>
                        {selectedKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedKeywords.map((kw) => (
                              <Badge key={kw} variant="default" size="large" className="gap-1 pr-1.5">
                                {kw}
                                <button
                                  type="button"
                                  onClick={() => removeKeyword(kw)}
                                  className="ml-1 hover:text-destructive transition-colors rounded-full"
                                >
                                  <X size={14} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {selectedKeywords.length > 0
                            ? `${selectedKeywords.length} keyword${selectedKeywords.length !== 1 ? 's' : ''} added`
                            : 'Add keywords to target specific search terms'}
                        </div>
                      </div>

                      {/* Category placements section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Category placements</Label>
                        <div className="relative" data-dropdown-container>
                          <SearchInput
                            value={categorySearch}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setCategorySearch(e.target.value);
                              setShowCategoryResults(e.target.value.length > 0);
                            }}
                            onClick={() => setShowCategoryResults(true)}
                            placeholder="Search categories..."
                            className="w-full"
                            icon={<Search className="w-4 h-4" />}
                          />
                          {showCategoryResults && filteredCategories.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredCategories.map((cat) => (
                                <div
                                  key={cat.id}
                                  className={`p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 ${
                                    selectedCategories.includes(cat.id) ? 'bg-primary/5' : ''
                                  }`}
                                  onClick={() => {
                                    toggleCategory(cat.id);
                                    setCategorySearch('');
                                    setShowCategoryResults(false);
                                  }}
                                >
                                  <span className="text-sm">{cat.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Selected categories with toggles */}
                        <div className="space-y-1">
                          {categoryPlacements.map((cat) => {
                            const isSelected = selectedCategories.includes(cat.id);
                            const isExpanded = expandedCategories.includes(cat.id);
                            const hasSelectedChildren = cat.children.some((child) => selectedCategories.includes(child.id));
                            if (!isSelected && !hasSelectedChildren) return null;
                            return (
                              <div key={cat.id}>
                                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                                  <Switch
                                    checked={isSelected}
                                    onCheckedChange={() => toggleCategory(cat.id)}
                                  />
                                  <span className="text-sm font-medium flex-1">{cat.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => toggleCategoryExpand(cat.id)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                  </button>
                                </div>
                                {isExpanded && (
                                  <div className="ml-6 space-y-1 mt-1">
                                    {cat.children.map((child) => (
                                      <div key={child.id} className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-muted/30 transition-colors">
                                        <Switch
                                          checked={selectedCategories.includes(child.id)}
                                          onCheckedChange={() => toggleCategory(child.id)}
                                        />
                                        <span className="text-sm flex-1">{child.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {selectedCategories.length === 0 && (
                          <div className="text-xs text-muted-foreground">
                            Search and select category pages where your products will be promoted
                          </div>
                        )}
                        {selectedCategories.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'} selected
                          </div>
                        )}
                      </div>

                      {/* Other placements section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Other placements</Label>
                        <div className="relative" data-dropdown-container>
                          <SearchInput
                            value={placementSearch}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setPlacementSearch(e.target.value);
                              setShowPlacementResults(e.target.value.length > 0);
                            }}
                            onClick={() => setShowPlacementResults(true)}
                            placeholder="Search placements..."
                            className="w-full"
                            icon={<Search className="w-4 h-4" />}
                          />
                          {showPlacementResults && filteredOtherPlacements.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredOtherPlacements.filter((p) => !selectedOtherPlacements.includes(p.id)).map((placement) => (
                                <div
                                  key={placement.id}
                                  className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                                  onClick={() => {
                                    toggleOtherPlacement(placement.id);
                                    setPlacementSearch('');
                                    setShowPlacementResults(false);
                                  }}
                                >
                                  <span className="text-sm">{placement.name}</span>
                                  <Plus size={16} className="text-primary" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Selected other placements with toggles */}
                        <div className="space-y-1">
                          {otherPlacements.filter((p) => selectedOtherPlacements.includes(p.id)).map((placement) => (
                            <div key={placement.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                              <Switch
                                checked={true}
                                onCheckedChange={() => toggleOtherPlacement(placement.id)}
                              />
                              <span className="text-sm font-medium flex-1">{placement.name}</span>
                            </div>
                          ))}
                        </div>
                        {selectedOtherPlacements.length === 0 && (
                          <div className="text-xs text-muted-foreground">
                            Select additional page placements for your sponsored products
                          </div>
                        )}
                        {selectedOtherPlacements.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {selectedOtherPlacements.length} placement{selectedOtherPlacements.length !== 1 ? 's' : ''} selected
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button disabled={!isKeywordsComplete} onClick={goToNextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}


              {/* Step: Review & Launch */}
              {currentStepId === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Review & launch</CardTitle>
                    <CardDescription>
                      Review your campaign settings before launching
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Proposition type */}
                      <div className="flex items-center gap-3 p-4 rounded-lg border bg-primary/5 border-primary/20">
                        <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                          <PropositionIcon size={20} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold">{proposition.name}</span>
                          <p className="text-xs text-muted-foreground">{proposition.description}</p>
                        </div>
                      </div>

                      {/* Campaign details */}
                      <div className="rounded-lg border divide-y">
                        {/* Setup details */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Campaign setup</span>
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline cursor-pointer"
                              onClick={() => goToStepById('setup')}
                            >
                              Edit
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Name</span>
                              <span className="text-sm font-medium">{campaignName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Budget</span>
                              <span className="text-sm font-medium">€{Number(budgetAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Run time</span>
                              <span className="text-sm font-medium">
                                {dateRange?.from && dateRange?.to
                                  ? `${formatDate(dateRange.from)} – ${formatDate(dateRange.to)}`
                                  : '-'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Auto optimization</span>
                              <span className="text-sm font-medium">{autoBudgetOptimization ? 'Enabled' : 'Disabled'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Brand & Products details */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Brand & products</span>
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline cursor-pointer"
                              onClick={() => goToStepById('brand')}
                            >
                              Edit
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Brand</span>
                              <span className="text-sm font-medium">{selectedBrandData?.label}</span>
                            </div>
                            {selectedRetailProducts.length > 0 && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Products</span>
                                <span className="text-sm font-medium">{selectedRetailProducts.length} selected</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Goal details */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Campaign goal</span>
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline cursor-pointer"
                              onClick={() => goToStepById('goal')}
                            >
                              Edit
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-primary">{selectedGoalData?.icon}</div>
                            <span className="text-sm font-medium">{selectedGoalData?.title}</span>
                          </div>
                        </div>

                        {/* Targeting details */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Targeting</span>
                            <button
                              type="button"
                              className="text-xs text-primary hover:underline cursor-pointer"
                              onClick={() => goToStepById('targeting')}
                            >
                              Edit
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Audiences</span>
                              <span className="text-sm font-medium">{selectedAudiences.length} selected</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {selectedAudiences.map((id) => {
                                const audience = audienceOptions.find(a => a.id === id);
                                return audience ? (
                                  <Badge key={id} variant="secondary" size="default">{audience.label}</Badge>
                                ) : null;
                              })}
                            </div>
                            {tags.length > 0 && (
                              <div className="flex justify-between mt-2">
                                <span className="text-sm text-muted-foreground">Tags</span>
                                <span className="text-sm font-medium">{tags.length} tag{tags.length !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Keywords & Placements details (Sponsored Products) */}
                        {isSponsoredProducts && (selectedKeywords.length > 0 || selectedCategories.length > 0 || selectedOtherPlacements.length > 0) && (
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-muted-foreground">Keywords & placements</span>
                              <button
                                type="button"
                                className="text-xs text-primary hover:underline cursor-pointer"
                                onClick={() => goToStepById('keywords')}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {selectedKeywords.length > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Keywords</span>
                                  <span className="text-sm font-medium">{selectedKeywords.length} keyword{selectedKeywords.length !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                              {selectedKeywords.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {selectedKeywords.map((kw) => (
                                    <Badge key={kw} variant="secondary" size="default">{kw}</Badge>
                                  ))}
                                </div>
                              )}
                              {selectedCategories.length > 0 && (
                                <div className="flex justify-between mt-2">
                                  <span className="text-sm text-muted-foreground">Categories</span>
                                  <span className="text-sm font-medium">{selectedCategories.length} selected</span>
                                </div>
                              )}
                              {selectedOtherPlacements.length > 0 && (
                                <div className="flex justify-between mt-2">
                                  <span className="text-sm text-muted-foreground">Other placements</span>
                                  <span className="text-sm font-medium">{selectedOtherPlacements.length} selected</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button
                        onClick={() => {
                          const name = campaignName || 'New Campaign';
                          window.location.href = `${proposition.campaignRoute}?new=${encodeURIComponent(name)}`;
                        }}
                      >
                        Launch campaign
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
                    <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border"></div>

                    <div className="space-y-4">
                      {wizardSteps.map((step, index) => {
                        const status = getStepStatus(index);
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
                                      ? 'bg-background text-primary border-2 border-primary'
                                      : 'bg-background text-muted-foreground border border-border'
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
                                  {step.id === 'setup' ? 'Not filled in' : step.id === 'brand' ? 'Not selected' : step.id === 'review' ? 'Review your settings' : step.id === 'keywords' ? 'Not configured' : 'Not selected'}
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
};

// --- Story Variants ---

export const CreateDisplay: Story = {
  render: () => <PropositionWizard propositionType="display" />,
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating a Display campaign with banner ads across the retailer website and app.',
      },
    },
  },
};

export const CreateSponsoredProducts: Story = {
  render: () => <PropositionWizard propositionType="sponsored-products" />,
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating a Sponsored Products campaign with promoted product listings in search and category results.',
      },
    },
  },
};

export const CreateOfflineInstore: Story = {
  render: () => <PropositionWizard propositionType="offline-instore" />,
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating an Offline In-Store campaign with physical media placements like shelf talkers, flyers and POS materials.',
      },
    },
  },
};

export const CreateDigitalInstore: Story = {
  render: () => <PropositionWizard propositionType="digital-instore" />,
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating a Digital In-Store campaign with digital screens and kiosks in physical retail locations.',
      },
    },
  },
};
