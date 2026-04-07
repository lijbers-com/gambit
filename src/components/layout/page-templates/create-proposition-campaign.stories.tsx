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
import { SelectionList } from '@/components/ui/selection-list';
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
  Download,
  Upload,
  Calendar,
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

const mediaPlanOptions = [
  { label: 'Summer Sale 2026 – Knorr', value: 'summer-sale-2026' },
  { label: 'Back to School 2026 – PepsiCo', value: 'back-to-school-2026' },
  { label: 'Holiday Season 2026 – Nestlé', value: 'holiday-2026' },
  { label: 'Q3 Awareness – Heineken', value: 'q3-awareness' },
];

const localBrands = [
  { id: 'food-lion', label: 'Food Lion' },
  { id: 'giant-food', label: 'Giant Food' },
  { id: 'hannaford', label: 'Hannaford' },
  { id: 'martins', label: "Martin's" },
  { id: 'stop-shop', label: 'Stop & Shop' },
  { id: 'giant-company', label: 'The Giant Company' },
];

const advertiserOptions = [
  { label: 'Acme Media', value: 'acme-media' },
  { label: 'Brand Alliance', value: 'brand-alliance' },
  { label: 'Global Brands Co.', value: 'global-brands' },
  { label: 'Unilever Shopper Marketing', value: 'unilever-shopper' },
  { label: 'Nestlé Trade Marketing', value: 'nestle-trade' },
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

const productImages = [
  '/products/AHI_326b5a694f4a696b516a575a77426b66767874375641.jpeg',
  '/products/AHI_58595668654137515274614244637957324d34372d51.jpeg',
  '/products/AHI_656b70553646657151435343764372315175694b3941.jpeg',
];

const retailProducts = [
  { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter', image: productImages[0] },
  { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter', image: productImages[1] },
  { id: '608456', name: 'Red Bull - energy drink original - 250ml', image: productImages[2] },
  { id: '609782', name: 'Heineken - premium lager beer - 6x330ml', image: productImages[0] },
  { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB', image: productImages[1] },
  { id: '611205', name: 'iPhone - 15 pro max - 512GB', image: productImages[2] },
  { id: '612816', name: 'Nike - air max 270 - size 42', image: productImages[0] },
  { id: '613427', name: 'Adidas - ultraboost 22 - size 43', image: productImages[1] },
  { id: '614038', name: 'Nutella - hazelnut spread - 750g', image: productImages[2] },
  { id: '615649', name: "Lay's - classic potato chips - 250g", image: productImages[0] },
  { id: '616250', name: 'Dove - body wash sensitive - 500ml', image: productImages[1] },
  { id: '617861', name: 'Nespresso - vertuo capsules - 30 pack', image: productImages[2] },
];

const getWizardSteps = (propositionType: string) => {
  const base = [
    { id: 'setup', label: 'Setup' },
    { id: 'advertiser', label: 'Advertiser' },
    { id: 'budget', label: 'Run time & budget' },
    { id: 'targeting', label: 'Goals & targets' },
  ];
  if (propositionType === 'sponsored-products') {
    base.push({ id: 'keywords', label: 'Keywords & placements' });
  }
  if (propositionType === 'display') {
    base.push(
      { id: 'booking', label: 'Booking setup' },
      { id: 'line-targeting', label: 'Targeting' },
      { id: 'delivery', label: 'Delivery behavior' },
      { id: 'delivery-objectives', label: 'Delivery objectives' },
      { id: 'pricing', label: 'Pricing' },
    );
  }
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

  // Step 1: Setup
  const [campaignName, setCampaignName] = React.useState('');
  const [poNumber, setPoNumber] = React.useState('');

  // Step 2: Advertiser
  const [selectedAdvertiser, setSelectedAdvertiser] = React.useState('');
  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
  const [retailProductSearch, setRetailProductSearch] = React.useState('');
  const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);

  // Step 1: Setup (SP-specific)
  const [selectedMediaPlan, setSelectedMediaPlan] = React.useState('');

  // Step 3: Run time & Budget
  const [budgetAmount, setBudgetAmount] = React.useState('');
  const [dailyBudget, setDailyBudget] = React.useState('');
  const [biddingCPC, setBiddingCPC] = React.useState('');
  const [sendBudgetNotification, setSendBudgetNotification] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [autoBudgetOptimization, setAutoBudgetOptimization] = React.useState(true);

  // Step 4: Goals & targets
  const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null);
  const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [selectedLocalBrands, setSelectedLocalBrands] = React.useState<string[]>([]);

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

  // Display-specific steps state
  const isDisplay = propositionType === 'display';
  // Booking setup
  const [bookingName, setBookingName] = React.useState('');
  const [bookingStartDate, setBookingStartDate] = React.useState<Date | undefined>(undefined);
  const [bookingStartTime, setBookingStartTime] = React.useState('00:00');
  const [bookingEndDate, setBookingEndDate] = React.useState<Date | undefined>(undefined);
  const [bookingEndTime, setBookingEndTime] = React.useState('23:59');
  const [activeDays, setActiveDays] = React.useState(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
  const [activeDaysOpen, setActiveDaysOpen] = React.useState(true);
  const [positionOpen, setPositionOpen] = React.useState(true);
  const [positionTab, setPositionTab] = React.useState<'channels' | 'positions'>('positions');
  const [positionSearch, setPositionSearch] = React.useState('');
  // Targeting (line item)
  const [lineTargetMode, setLineTargetMode] = React.useState<'inclusive' | 'exclusive'>('inclusive');
  const [lineTargetKeywordType, setLineTargetKeywordType] = React.useState('Search Keyword');
  const [lineTargetValue, setLineTargetValue] = React.useState('');
  // Delivery behavior
  const [optimizeForCPC, setOptimizeForCPC] = React.useState(false);
  const [userFrequencyCap, setUserFrequencyCap] = React.useState(false);
  const [deliveryMethod, setDeliveryMethod] = React.useState('Account setting');
  const [exclusivity, setExclusivity] = React.useState(false);
  // Delivery objectives
  const [priorityOverride, setPriorityOverride] = React.useState(false);
  const [reachOverride, setReachOverride] = React.useState(false);
  const [deliveryLimit, setDeliveryLimit] = React.useState(false);
  // Pricing
  const [pricingModel, setPricingModel] = React.useState(false);
  const [competeWithRTB, setCompeteWithRTB] = React.useState(false);

  const dayLabels = [
    { id: 'mo', label: 'Mo' }, { id: 'tu', label: 'Tu' }, { id: 'we', label: 'We' },
    { id: 'th', label: 'Th' }, { id: 'fr', label: 'Fr' }, { id: 'sa', label: 'Sa' }, { id: 'su', label: 'Su' },
  ];
  const toggleDay = (id: string) => setActiveDays(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);

  // Derived data
  const selectedGoalData = goals.find((g) => g.id === selectedGoal);
  const selectedBrandData = brandOptions.find((b) => b.value === selectedBrand);

  // Step completion checks
  const isSetupComplete = campaignName.trim() !== '';
  const isAdvertiserComplete = selectedBrand !== '';
  const isBudgetComplete = isSponsoredProducts
    ? budgetAmount.trim() !== '' && dailyBudget.trim() !== '' && biddingCPC.trim() !== '' && dateRange?.from !== undefined && dateRange?.to !== undefined
    : budgetAmount.trim() !== '' && dateRange?.from !== undefined && dateRange?.to !== undefined;
  const isTargetingComplete = isSponsoredProducts
    ? selectedLocalBrands.length > 0
    : selectedGoal !== null && selectedAudiences.length > 0;
  const isKeywordsComplete = isSponsoredProducts ? (selectedKeywords.length > 0 || selectedCategories.length > 0) : true;

  const isBookingComplete = bookingName.trim() !== '' && bookingStartDate !== undefined;
  const isCurrentStepComplete = (() => {
    switch (currentStepId) {
      case 'setup': return isSetupComplete;
      case 'advertiser': return isAdvertiserComplete;
      case 'budget': return isBudgetComplete;
      case 'targeting': return isTargetingComplete;
      case 'keywords': return isKeywordsComplete;
      case 'booking': return isBookingComplete;
      case 'line-targeting': return true;
      case 'delivery': return true;
      case 'delivery-objectives': return true;
      case 'pricing': return true;
      default: return false;
    }
  })();

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

  // Get step values for summary (returns array for list display)
  const getStepValues = (stepId: string): string[] | null => {
    switch (stepId) {
      case 'setup': {
        const vals: string[] = [];
        const mediaPlanData = mediaPlanOptions.find((m) => m.value === selectedMediaPlan);
        if (mediaPlanData) vals.push(mediaPlanData.label);
        if (campaignName.trim()) vals.push(campaignName);
        if (poNumber.trim()) vals.push(poNumber);
        return vals.length > 0 ? vals : null;
      }
      case 'advertiser': {
        const vals: string[] = [];
        const advertiserData = advertiserOptions.find((a) => a.value === selectedAdvertiser);
        if (advertiserData) vals.push(advertiserData.label);
        if (selectedBrandData) vals.push(selectedBrandData.label);
        selectedRetailProducts.forEach((id) => {
          const p = retailProducts.find((r) => r.id === id);
          if (p) vals.push(p.name);
        });
        return vals.length > 0 ? vals : null;
      }
      case 'budget': {
        const vals: string[] = [];
        if (isSponsoredProducts) {
          if (dateRange?.from && dateRange?.to) {
            vals.push(`${dateRange.from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${dateRange.to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`);
          }
          if (budgetAmount.trim()) vals.push(`Total €${budgetAmount}`);
          if (dailyBudget.trim()) vals.push(`Daily €${dailyBudget}`);
          if (biddingCPC.trim()) vals.push(`CPC €${biddingCPC}`);
        } else {
          if (budgetAmount.trim()) vals.push(`€${budgetAmount}`);
          if (dateRange?.from && dateRange?.to) {
            vals.push(`${dateRange.from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${dateRange.to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`);
          }
        }
        return vals.length > 0 ? vals : null;
      }
      case 'targeting': {
        if (isSponsoredProducts) {
          const vals = selectedLocalBrands.map((id) => localBrands.find((b) => b.id === id)?.label ?? id);
          return vals.length > 0 ? vals : null;
        }
        const vals: string[] = [];
        if (selectedGoalData) vals.push(selectedGoalData.title);
        selectedAudiences.forEach((id) => {
          const a = audienceOptions.find((o) => o.id === id);
          if (a) vals.push(a.label);
        });
        return vals.length > 0 ? vals : null;
      }
      case 'keywords': {
        const vals: string[] = [];
        vals.push(...selectedKeywords);
        selectedCategories.forEach((id) => {
          const cat = categoryPlacements.flatMap((c) => [c, ...c.children]).find((c) => c.id === id);
          if (cat) vals.push(cat.name);
        });
        selectedOtherPlacements.forEach((id) => {
          const p = otherPlacements.find((o) => o.id === id);
          if (p) vals.push(p.name);
        });
        return vals.length > 0 ? vals : null;
      }
      case 'booking': {
        const vals: string[] = [];
        if (bookingName.trim()) vals.push(bookingName);
        if (bookingStartDate) vals.push(`${bookingStartDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${bookingStartTime}`);
        if (activeDays.length < 7) vals.push(activeDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', '));
        return vals.length > 0 ? vals : null;
      }
      case 'line-targeting': {
        const vals: string[] = [];
        if (lineTargetValue) vals.push(`${lineTargetMode === 'inclusive' ? '+' : '–'} ${lineTargetValue}`);
        return vals.length > 0 ? vals : null;
      }
      case 'delivery': {
        const vals: string[] = [];
        if (optimizeForCPC) vals.push('Optimize for CPC');
        if (userFrequencyCap) vals.push('Frequency cap');
        if (deliveryMethod !== 'Account setting') vals.push(deliveryMethod);
        if (exclusivity) vals.push('Exclusivity');
        return vals.length > 0 ? vals : null;
      }
      case 'delivery-objectives': {
        const vals: string[] = [];
        if (priorityOverride) vals.push('Priority override');
        if (reachOverride) vals.push('Reach override');
        if (deliveryLimit) vals.push('Delivery limit');
        return vals.length > 0 ? vals : null;
      }
      case 'pricing': {
        const vals: string[] = [];
        if (pricingModel) vals.push('Custom pricing');
        if (competeWithRTB) vals.push('Compete with RTB');
        return vals.length > 0 ? vals : null;
      }
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
          title: campaignName || `Create ${proposition.name.toLowerCase()} campaign`,
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

              {/* Step 1: Setup */}
              {currentStepId === 'setup' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Setup</CardTitle>
                    <CardDescription>
                      Enter the basic details for your new {proposition.name.toLowerCase()} campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {isSponsoredProducts && (
                        <div className="space-y-2">
                          <Label htmlFor="media-plan">Media plan</Label>
                          <Input
                            dropdown
                            options={mediaPlanOptions}
                            value={selectedMediaPlan}
                            onChange={(value: string) => setSelectedMediaPlan(value)}
                            placeholder="Select a media plan"
                          />
                          <div className="text-xs text-muted-foreground">Link this campaign to an existing media plan</div>
                        </div>
                      )}
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
                        <Label htmlFor="po-number">PO number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input
                          id="po-number"
                          placeholder="e.g. PO-123456"
                          value={poNumber}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPoNumber(e.target.value)}
                        />
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

              {/* Step 2: Advertiser */}
              {currentStepId === 'advertiser' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Advertiser</CardTitle>
                    <CardDescription>
                      Select the advertiser, brand and retail products for this campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="advertiser">Advertiser</Label>
                        <Input
                          dropdown
                          options={advertiserOptions}
                          value={selectedAdvertiser}
                          onChange={(value: string) => setSelectedAdvertiser(value)}
                          placeholder="Select an advertiser"
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
                        <Label>{isSponsoredProducts ? 'SKU' : 'Retail products'} <span className="text-muted-foreground font-normal">(optional)</span></Label>
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
                              {!retailProductSearch && (
                                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/30">
                                  Suggestions
                                </div>
                              )}
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
                        <SelectionList
                          variant="list"
                          items={selectedRetailProducts
                            .map((id) => retailProducts.find((p) => p.id === id))
                            .filter(Boolean)
                            .map((p) => ({ id: p!.id, label: p!.name, meta: `#${p!.id}`, image: p!.image }))}
                          onRemove={(id) => removeRetailProduct(id)}
                          className="mt-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {selectedRetailProducts.length > 0
                            ? `${selectedRetailProducts.length} retail product${selectedRetailProducts.length > 1 ? 's' : ''} selected`
                            : 'Search and select retail products to target for this campaign'}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button disabled={!isAdvertiserComplete} onClick={goToNextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Run time & budget */}
              {currentStepId === 'budget' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Run time & budget</CardTitle>
                    <CardDescription>
                      {isSponsoredProducts
                        ? 'Set when your campaign runs, your total budget and cost-per-click bid'
                        : 'Set when your campaign runs and how much you want to spend'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSponsoredProducts ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Run time <span className="text-destructive">*</span></Label>
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
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="budget-amount">Total budget <span className="text-destructive">*</span></Label>
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
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="daily-budget">Daily budget <span className="text-destructive">*</span></Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                              <Input
                                id="daily-budget"
                                type="number"
                                placeholder="e.g. 200"
                                value={dailyBudget}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDailyBudget(e.target.value)}
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bidding-cpc">Bidding (CPC) <span className="text-destructive">*</span></Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                              <Input
                                id="bidding-cpc"
                                type="number"
                                placeholder="e.g. 0.50"
                                value={biddingCPC}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBiddingCPC(e.target.value)}
                                className="pl-7"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                          <span className="text-sm">Send me an email with budget notifications</span>
                          <Switch
                            checked={sendBudgetNotification}
                            onCheckedChange={setSendBudgetNotification}
                          />
                        </div>
                      </div>
                    ) : (
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
                    )}
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button disabled={!isBudgetComplete} onClick={goToNextStep}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Goals & targets */}
              {currentStepId === 'targeting' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Goals & targets</CardTitle>
                    <CardDescription>
                      {isSponsoredProducts
                        ? 'Which great local brand would you like to target?'
                        : 'Select your campaign goal and the audience segments to target'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSponsoredProducts ? (
                      <div className="space-y-3">
                        {localBrands.map((brand) => {
                          const isSelected = selectedLocalBrands.includes(brand.id);
                          return (
                            <button
                              key={brand.id}
                              type="button"
                              onClick={() =>
                                setSelectedLocalBrands((prev) =>
                                  prev.includes(brand.id)
                                    ? prev.filter((b) => b !== brand.id)
                                    : [...prev, brand.id]
                                )
                              }
                              className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${
                                isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/30'
                              }`}
                            >
                              <div
                                className={cn(
                                  "h-4 w-4 shrink-0 rounded-sm border border-primary flex items-center justify-center",
                                  isSelected && "bg-primary text-primary-foreground"
                                )}
                              >
                                {isSelected && <Check className="h-4 w-4" />}
                              </div>
                              <span className="text-sm font-medium">{brand.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <Label className="mb-3 block">Campaign goal</Label>
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
                        </div>
                        <div>
                          <Label className="mb-3 block flex items-center gap-2">
                            <Users size={16} />
                            Audience segments
                          </Label>
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
                        </div>
                        {/* Tags section */}
                        <div className="space-y-3">
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
                      </div>
                    )}
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      {isSponsoredProducts && (
                        <Button disabled={!isTargetingComplete} onClick={goToNextStep}>
                          Continue
                        </Button>
                      )}
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
                                  {!keywordSearch && (
                                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/30">
                                      Suggestions
                                    </div>
                                  )}
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
                        <SelectionList
                          variant="list"
                          items={selectedKeywords.map((kw) => ({ id: kw, label: kw }))}
                          onRemove={(id) => removeKeyword(id)}
                        />
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
                        <SelectionList
                          variant="switch"
                          items={otherPlacements
                            .filter((p) => selectedOtherPlacements.includes(p.id))
                            .map((p) => ({ id: p.id, label: p.name }))}
                          onToggle={(id) => toggleOtherPlacement(id)}
                        />
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
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Booking setup (Display only) */}
              {currentStepId === 'booking' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking setup</CardTitle>
                    <CardDescription>Configure the booking schedule, active days and position</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Booking name */}
                    <div className="space-y-2">
                      <Label>Booking name <span className="text-destructive">*</span></Label>
                      <Input
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="Enter booking name"
                      />
                    </div>

                    {/* Schedule */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Schedule</Label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1 flex items-center gap-1.5">
                            Start date and time <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold">!</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <DateRangePicker
                              dateRange={bookingStartDate ? { from: bookingStartDate } : undefined}
                              onDateRangeChange={(r) => setBookingStartDate(r?.from)}
                              placeholder="MM/DD/YYYY"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Calendar className="w-4 h-4" /></span>
                              <Input value={bookingStartTime} onChange={(e) => setBookingStartTime(e.target.value)} className="pl-9" placeholder="00:00" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">End date and time</label>
                          <div className="grid grid-cols-2 gap-3">
                            <DateRangePicker
                              dateRange={bookingEndDate ? { from: bookingEndDate } : undefined}
                              onDateRangeChange={(r) => setBookingEndDate(r?.from)}
                              placeholder="MM/DD/YYYY"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Calendar className="w-4 h-4" /></span>
                              <Input value={bookingEndTime} onChange={(e) => setBookingEndTime(e.target.value)} className="pl-9" placeholder="23:59" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active days */}
                    <div className="rounded-lg border p-4 space-y-1">
                      <button
                        className="w-full flex items-center justify-between text-sm font-semibold"
                        onClick={() => setActiveDaysOpen(v => !v)}
                      >
                        Active days
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${activeDaysOpen ? '' : '-rotate-90'}`} />
                      </button>
                      {activeDaysOpen && (
                        <div className="pt-3 space-y-3">
                          <div className="flex gap-2">
                            {dayLabels.map(day => (
                              <button
                                key={day.id}
                                onClick={() => toggleDay(day.id)}
                                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${activeDays.includes(day.id) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>Select:</span>
                            <button className="text-primary hover:underline" onClick={() => setActiveDays(['sa', 'su'])}>Weekend</button>
                            <span>·</span>
                            <button className="text-primary hover:underline" onClick={() => setActiveDays(['mo', 'tu', 'we', 'th', 'fr'])}>Weekdays</button>
                            <span>·</span>
                            <button className="text-primary hover:underline" onClick={() => setActiveDays([])}>Deselect All</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Position */}
                    <div className="rounded-lg border p-4 space-y-1">
                      <button
                        className="w-full flex items-center justify-between text-sm font-semibold"
                        onClick={() => setPositionOpen(v => !v)}
                      >
                        Position
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${positionOpen ? '' : '-rotate-90'}`} />
                      </button>
                      {positionOpen && (
                        <div className="pt-3 space-y-3">
                          <div className="flex rounded-lg bg-muted p-1 w-fit gap-1">
                            {(['channels', 'positions'] as const).map(tab => (
                              <button
                                key={tab}
                                onClick={() => setPositionTab(tab)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${positionTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                              >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                              </button>
                            ))}
                          </div>
                          <Input
                            value={positionSearch}
                            onChange={(e) => setPositionSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full"
                          />
                          <div className="text-xs text-muted-foreground">
                            {positionTab === 'positions' ? 'Search and select ad positions' : 'Search and select channels'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button disabled={!isBookingComplete} onClick={goToNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Targeting (Display only) */}
              {currentStepId === 'line-targeting' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Targeting</CardTitle>
                    <CardDescription>Set inclusive or exclusive targeting rules for this booking</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-4">
                      <Label className="text-sm font-semibold">Targets</Label>
                      <div className="flex items-center justify-between">
                        <div className="flex rounded-lg bg-muted p-1 gap-1">
                          {(['inclusive', 'exclusive'] as const).map(mode => (
                            <button
                              key={mode}
                              onClick={() => setLineTargetMode(mode)}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${lineTargetMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1.5" />Download template</Button>
                          <Button size="sm"><Upload className="w-4 h-4 mr-1.5" />Upload CSV</Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={lineTargetKeywordType}
                          onChange={(e) => setLineTargetKeywordType(e.target.value)}
                          className="border rounded-md px-3 py-2 text-sm bg-background min-w-[150px]"
                        >
                          {['Search Keyword', 'Product ID', 'Category', 'Brand'].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <select
                          value={lineTargetValue}
                          onChange={(e) => setLineTargetValue(e.target.value)}
                          className="border rounded-md px-3 py-2 text-sm bg-background flex-1"
                        >
                          <option value="">Select target</option>
                          {['Beverages', 'Snacks', 'Dairy', 'Frozen foods', 'Health & Beauty'].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button onClick={goToNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Delivery behavior (Display only) */}
              {currentStepId === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery behavior</CardTitle>
                    <CardDescription>Configure how your ads are delivered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: 'Optimize for CPC', checked: optimizeForCPC, onChange: setOptimizeForCPC, info: true },
                      { label: 'User frequency cap', checked: userFrequencyCap, onChange: setUserFrequencyCap, info: true },
                    ].map(({ label, checked, onChange, info }) => (
                      <div key={label} className="flex items-center justify-between p-4 rounded-lg border">
                        <span className="font-medium text-sm">{label}</span>
                        <div className="flex items-center gap-3">
                          {info && <div className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground cursor-help select-none">i</div>}
                          <Switch checked={checked} onCheckedChange={onChange} />
                        </div>
                      </div>
                    ))}
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Delivery method</span>
                        <div className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground cursor-help select-none">i</div>
                      </div>
                      <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      >
                        {['Account setting', 'Frontloaded', 'Even', 'ASAP'].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground">Follows the default setting that is configured for your account (Frontloaded).</p>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium text-sm">Exclusivity</span>
                      <Switch checked={exclusivity} onCheckedChange={setExclusivity} />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button onClick={goToNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Delivery objectives (Display only) */}
              {currentStepId === 'delivery-objectives' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery objectives</CardTitle>
                    <CardDescription>Override delivery priority, reach and impression limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium text-sm">Priority</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Inherited from campaign: Highest</span>
                        <Switch checked={priorityOverride} onCheckedChange={setPriorityOverride} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium text-sm">Reach</span>
                      <Switch checked={reachOverride} onCheckedChange={setReachOverride} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium text-sm">Delivery limit</span>
                      <Switch checked={deliveryLimit} onCheckedChange={setDeliveryLimit} />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      <Button onClick={goToNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Pricing (Display only) */}
              {currentStepId === 'pricing' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pricing</CardTitle>
                    <CardDescription>Set the pricing model and RTB competition settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium text-sm">Pricing model</span>
                      <Switch checked={pricingModel} onCheckedChange={setPricingModel} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium text-sm">Compete with RTB</span>
                      <Switch checked={competeWithRTB} onCheckedChange={setCompeteWithRTB} />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Summary sidebar */}
            <div className="flex flex-col gap-4">
              <CardSummary>
                <CardHeader>
                  <CardSummaryTitle>{proposition.name} campaign</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  <div className="relative pl-12">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border"></div>

                    <div className="space-y-4">
                      {wizardSteps.map((step, index) => {
                        const status = getStepStatus(index);
                        const stepValues = getStepValues(step.id);

                        return (
                          <div key={step.id} className="relative flex items-start -ml-12">
                            {/* Circle on the timeline */}
                            <div className="w-10 flex justify-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                  status === 'completed'
                                    ? 'bg-primary text-primary-foreground'
                                    : status === 'active'
                                      ? 'bg-background text-primary border border-primary'
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
                              {(status === 'completed' || status === 'active') && stepValues && stepValues.length > 0 ? (
                                <div className="mt-1 space-y-0.5">
                                  {stepValues.map((v, i) => (
                                    <div key={i} className="text-xs text-muted-foreground">{v}</div>
                                  ))}
                                </div>
                              ) : status === 'active' ? (
                                <div className="text-xs text-muted-foreground italic mt-0.5">
                                  Not filled in
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardSummaryContent>
                <div className="px-4 pb-4 flex flex-col gap-2">
                  {currentStep < wizardSteps.length - 1 ? (
                    <>
                      <Button className="w-full" disabled={!isCurrentStepComplete} onClick={goToNextStep}>Continue</Button>
                      {currentStep > 0 ? (
                        <Button variant="outline" className="w-full" onClick={goToPrevStep}>Back</Button>
                      ) : (
                        <Button variant="ghost" className="w-full">Cancel</Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => {
                          const name = campaignName || 'New Campaign';
                          window.location.href = `${proposition.campaignRoute}?new=${encodeURIComponent(name)}`;
                        }}
                      >
                        Launch campaign
                      </Button>
                      <Button variant="outline" className="w-full" onClick={goToPrevStep}>Back</Button>
                    </>
                  )}
                </div>
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
