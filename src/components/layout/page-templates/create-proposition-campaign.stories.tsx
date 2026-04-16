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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangePicker, DatePicker } from '@/components/ui/date-picker';
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
  Clock,
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
  {
    label: 'Unilever H1 2026 – NL Retail',
    value: 'unilever-h1-2026',
    advertiser: 'Unilever',
    budget: '€850,000',
    startDate: '01 Jan 2026',
    endDate: '30 Jun 2026',
    status: 'In option',
  },
  {
    label: 'PepsiCo Annual Plan 2026',
    value: 'pepsico-annual-2026',
    advertiser: 'PepsiCo',
    budget: '€620,000',
    startDate: '01 Jan 2026',
    endDate: '31 Dec 2026',
    status: 'Draft',
  },
  {
    label: 'Nestlé H2 2026 – Seasonal',
    value: 'nestle-h2-2026',
    advertiser: 'Nestlé',
    budget: '€1,200,000',
    startDate: '01 Jul 2026',
    endDate: '31 Dec 2026',
    status: 'Draft',
  },
  {
    label: 'Heineken Brand Plan Q3 2026',
    value: 'heineken-q3-2026',
    advertiser: 'Heineken',
    budget: '€400,000',
    startDate: '01 Jul 2026',
    endDate: '30 Sep 2026',
    status: 'Ready',
  },
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
  if (propositionType === 'display') {
    return [
      { id: 'setup', label: 'Setup' },
      { id: 'advertiser', label: 'Advertiser' },
      { id: 'budget', label: 'Run time & budget' },
      { id: 'bookings', label: 'Bookings' },
    ];
  }
  const base = [
    { id: 'setup', label: 'Setup' },
    { id: 'advertiser', label: 'Advertiser' },
    { id: 'budget', label: 'Run time & budget' },
    { id: 'targeting', label: 'Goals & targets' },
  ];
  if (propositionType === 'sponsored-products') {
    base.push({ id: 'keywords', label: 'Keywords & placements' });
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
  // Bookings list (Display)
  const [bookings, setBookings] = React.useState<{
    id: string; name: string; startDate?: Date; startTime: string;
    endDate?: Date; endTime: string; activeDays: string[];
    targetMode: string; targetKeywordType: string; targetValue: string;
    optimizeForCPC: boolean; userFrequencyCap: boolean; deliveryMethod: string;
    exclusivity: boolean; priorityOverride: boolean; reachOverride: boolean;
    deliveryLimit: boolean; pricingModel: boolean; competeWithRTB: boolean;
  }[]>([]);
  const [bookingSubStep, setBookingSubStep] = React.useState<number | null>(null);
  const bookingSubStepLabels = ['Booking setup', 'Targeting', 'Delivery behavior', 'Delivery objectives', 'Pricing'];
  // Booking setup
  const [bookingName, setBookingName] = React.useState('');
  const [bookingDateRange, setBookingDateRange] = React.useState<DateRange | undefined>(undefined);
  const [bookingStartTime, setBookingStartTime] = React.useState('00:00');
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

  const saveBooking = () => {
    setBookings(prev => [...prev, {
      id: String(Date.now()),
      name: bookingName, startDate: bookingDateRange?.from, startTime: bookingStartTime,
      endDate: bookingDateRange?.to, endTime: bookingEndTime, activeDays: [...activeDays],
      targetMode: lineTargetMode, targetKeywordType: lineTargetKeywordType, targetValue: lineTargetValue,
      optimizeForCPC, userFrequencyCap, deliveryMethod, exclusivity,
      priorityOverride, reachOverride, deliveryLimit, pricingModel, competeWithRTB,
    }]);
    // Reset form for next booking
    setBookingSubStep(null);
    setBookingName(''); setBookingDateRange(undefined);
    setBookingStartTime('00:00'); setBookingEndTime('23:59');
    setActiveDays(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
    setLineTargetMode('inclusive'); setLineTargetKeywordType('Search Keyword'); setLineTargetValue('');
    setOptimizeForCPC(false); setUserFrequencyCap(false); setDeliveryMethod('Account setting');
    setExclusivity(false); setPriorityOverride(false); setReachOverride(false);
    setDeliveryLimit(false); setPricingModel(false); setCompeteWithRTB(false);
  };
  const removeBooking = (id: string) => setBookings(prev => prev.filter(b => b.id !== id));

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

  // Display-specific derived helpers
  const displayCampaignSteps = isDisplay ? wizardSteps.filter(s => s.id !== 'bookings') : wizardSteps;
  const isInBookingsPhase = isDisplay && currentStepId === 'bookings';
  const isLastCampaignStep = isDisplay ? currentStepId === 'budget' : currentStep === wizardSteps.length - 1;

  const isCurrentStepComplete = (() => {
    switch (currentStepId) {
      case 'setup': return isSetupComplete;
      case 'advertiser': return isAdvertiserComplete;
      case 'budget': return isBudgetComplete;
      case 'targeting': return isTargetingComplete;
      case 'keywords': return isKeywordsComplete;
      case 'bookings': return bookings.length > 0;
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
      case 'bookings': {
        if (bookings.length === 0) return null;
        return bookings.map((b, i) => b.name || `Booking ${i + 1}`);
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
        <div className="space-y-3">
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
                      {!isDisplay && (
                        <Button disabled={!isBudgetComplete} onClick={goToNextStep}>Continue</Button>
                      )}
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

              {/* Step: Bookings (Display only) */}
              {currentStepId === 'bookings' && (
                <div className="space-y-4">
                  {/* Booking list view */}
                  {bookingSubStep === null && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Bookings</CardTitle>
                        <CardDescription>Add one or more bookings to your campaign</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Existing bookings */}
                        {bookings.map((booking, i) => (
                          <div key={booking.id} className="rounded-lg border bg-slate-50 p-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{booking.name || `Booking ${i + 1}`}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {booking.startDate ? booking.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '–'}
                                {booking.targetValue && ` · ${booking.targetMode === 'inclusive' ? '+' : '–'} ${booking.targetValue}`}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeBooking(booking.id)}>Remove</Button>
                          </div>
                        ))}

                        {/* Add booking CTA */}
                        <button
                          className="w-full rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors p-5 text-center"
                          onClick={() => setBookingSubStep(0)}
                        >
                          <div className="text-sm font-medium text-muted-foreground">+ Add booking</div>
                          <div className="text-xs text-muted-foreground mt-1">Configure schedule, targeting and delivery</div>
                        </button>
                        <div className="flex justify-start mt-2">
                          <Button variant="outline" size="sm" onClick={goToPrevStep}>Back</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Booking sub-wizard */}
                  {bookingSubStep !== null && (
                    <>
                      {/* Booking setup step */}
                      {bookingSubStep === 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Booking setup</CardTitle>
                            <CardDescription>Configure the booking schedule, active days and position</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label>Booking name <span className="text-destructive">*</span></Label>
                              <Input value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder="Enter booking name" />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold">Schedule</Label>
                              <DateRangePicker
                                dateRange={bookingDateRange}
                                onDateRangeChange={setBookingDateRange}
                                placeholder="Select start and end date"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="block text-sm text-muted-foreground">Start time</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Clock className="w-4 h-4" /></span>
                                    <Input value={bookingStartTime} onChange={(e) => setBookingStartTime(e.target.value)} className="pl-9" placeholder="00:00" />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-sm text-muted-foreground">End time</label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Clock className="w-4 h-4" /></span>
                                    <Input value={bookingEndTime} onChange={(e) => setBookingEndTime(e.target.value)} className="pl-9" placeholder="23:59" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="rounded-lg border p-4 space-y-1">
                              <button className="w-full flex items-center justify-between text-sm font-semibold" onClick={() => setActiveDaysOpen(v => !v)}>
                                Active days <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${activeDaysOpen ? '' : '-rotate-90'}`} />
                              </button>
                              {activeDaysOpen && (
                                <div className="pt-3 space-y-3">
                                  <div className="flex gap-2">
                                    {dayLabels.map(day => (
                                      <button key={day.id} onClick={() => toggleDay(day.id)}
                                        className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${activeDays.includes(day.id) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
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
                            <div className="rounded-lg border p-4 space-y-1">
                              <button className="w-full flex items-center justify-between text-sm font-semibold" onClick={() => setPositionOpen(v => !v)}>
                                Position <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${positionOpen ? '' : '-rotate-90'}`} />
                              </button>
                              {positionOpen && (
                                <div className="pt-3 space-y-3">
                                  <div className="flex rounded-lg bg-muted p-1 w-fit gap-1">
                                    {(['channels', 'positions'] as const).map(tab => (
                                      <button key={tab} onClick={() => setPositionTab(tab)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${positionTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                      </button>
                                    ))}
                                  </div>
                                  <Input value={positionSearch} onChange={(e) => setPositionSearch(e.target.value)} placeholder="Search..." className="w-full" />
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                              <Button variant="outline" onClick={() => setBookingSubStep(null)}>Back</Button>
                              <Button onClick={() => setBookingSubStep(1)}>Continue</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Targeting step */}
                      {bookingSubStep === 1 && (
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
                                    <button key={mode} onClick={() => setLineTargetMode(mode)}
                                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${lineTargetMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
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
                                <select value={lineTargetKeywordType} onChange={(e) => setLineTargetKeywordType(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background min-w-[150px]">
                                  {['Search Keyword', 'Product ID', 'Category', 'Brand'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <select value={lineTargetValue} onChange={(e) => setLineTargetValue(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background flex-1">
                                  <option value="">Select target</option>
                                  {['Beverages', 'Snacks', 'Dairy', 'Frozen foods', 'Health & Beauty'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                              <Button variant="outline" onClick={() => setBookingSubStep(0)}>Back</Button>
                              <Button onClick={() => setBookingSubStep(2)}>Continue</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Delivery behavior step */}
                      {bookingSubStep === 2 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Delivery behavior</CardTitle>
                            <CardDescription>Configure how your ads are delivered</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {[
                              { label: 'Optimize for CPC', checked: optimizeForCPC, onChange: setOptimizeForCPC },
                              { label: 'User frequency cap', checked: userFrequencyCap, onChange: setUserFrequencyCap },
                            ].map(({ label, checked, onChange }) => (
                              <div key={label} className="flex items-center justify-between p-4 rounded-lg border">
                                <span className="font-medium text-sm">{label}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground cursor-help select-none">i</div>
                                  <Switch checked={checked} onCheckedChange={onChange} />
                                </div>
                              </div>
                            ))}
                            <div className="rounded-lg border p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">Delivery method</span>
                                <div className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center text-xs text-muted-foreground cursor-help select-none">i</div>
                              </div>
                              <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                                {['Account setting', 'Frontloaded', 'Even', 'ASAP'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                              <p className="text-xs text-muted-foreground">Follows the default setting that is configured for your account (Frontloaded).</p>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                              <span className="font-medium text-sm">Exclusivity</span>
                              <Switch checked={exclusivity} onCheckedChange={setExclusivity} />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                              <Button variant="outline" onClick={() => setBookingSubStep(1)}>Back</Button>
                              <Button onClick={() => setBookingSubStep(3)}>Continue</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Delivery objectives step */}
                      {bookingSubStep === 3 && (
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
                              <Button variant="outline" onClick={() => setBookingSubStep(2)}>Back</Button>
                              <Button onClick={() => setBookingSubStep(4)}>Continue</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Pricing step */}
                      {bookingSubStep === 4 && (
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
                              <Button variant="outline" onClick={() => setBookingSubStep(3)}>Back</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              )}

            </div>

            {/* Summary sidebar */}
            <div className="flex flex-col gap-4">
              {/* New booking card — shown while actively creating a booking */}
              {isInBookingsPhase && bookingSubStep !== null && (() => {
                const getLiveBookingStepValues = (stepIndex: number): string[] | null => {
                  switch (stepIndex) {
                    case 0: {
                      const vals: string[] = [];
                      if (bookingDateRange?.from) vals.push(`${bookingDateRange.from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${bookingStartTime}${bookingDateRange.to ? ` – ${bookingDateRange.to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${bookingEndTime}` : ''}`);
                      if (activeDays.length < 7) vals.push(activeDays.join(', '));
                      return vals.length > 0 ? vals : null;
                    }
                    case 1: {
                      const vals: string[] = [];
                      if (lineTargetValue) vals.push(`${lineTargetKeywordType}: ${lineTargetValue}`);
                      if (lineTargetMode !== 'inclusive') vals.push(lineTargetMode);
                      return vals.length > 0 ? vals : null;
                    }
                    case 2: {
                      const vals: string[] = [];
                      if (deliveryMethod && deliveryMethod !== 'Account setting') vals.push(deliveryMethod);
                      if (optimizeForCPC) vals.push('Optimize for CPC');
                      if (userFrequencyCap) vals.push('Frequency cap on');
                      if (exclusivity) vals.push('Exclusivity on');
                      return vals.length > 0 ? vals : null;
                    }
                    case 3: {
                      const vals: string[] = [];
                      if (priorityOverride) vals.push('Priority override');
                      if (reachOverride) vals.push('Reach override');
                      if (deliveryLimit) vals.push('Delivery limit set');
                      return vals.length > 0 ? vals : null;
                    }
                    case 4: {
                      const vals: string[] = [];
                      if (pricingModel) vals.push('Custom pricing');
                      if (competeWithRTB) vals.push('Compete with RTB');
                      return vals.length > 0 ? vals : null;
                    }
                    default: return null;
                  }
                };
                return (
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>New booking</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      <div className="relative pl-12">
                        <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border"></div>
                        <div className="space-y-4">
                          {bookingSubStepLabels.map((label, index) => {
                            const status: 'completed' | 'active' | 'pending' =
                              index < bookingSubStep ? 'completed'
                              : index === bookingSubStep ? 'active'
                              : 'pending';
                            const vals = status === 'completed' ? getLiveBookingStepValues(index) : null;
                            return (
                              <div key={label} className="relative flex items-start -ml-12">
                                <div className="w-10 flex justify-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${status === 'completed' ? 'bg-primary text-primary-foreground' : status === 'active' ? 'bg-background text-primary border border-primary' : 'bg-background text-muted-foreground border border-border'}`}>
                                    {status === 'completed' ? <Check size={14} /> : index + 1}
                                  </div>
                                </div>
                                <div className="ml-3 flex-1 min-w-0 pt-1">
                                  <div className={`text-sm ${status === 'active' || status === 'completed' ? 'font-medium' : 'text-muted-foreground'}`}>{label}</div>
                                  {vals && <div className="text-sm text-muted-foreground mt-0.5">{vals.join(', ')}</div>}
                                  {status === 'active' && <div className="text-xs text-muted-foreground italic mt-0.5">Not filled in</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardSummaryContent>
                    {bookingSubStep === bookingSubStepLabels.length - 1 && (
                      <div className="px-4 pb-4">
                        <Button className="w-full" onClick={saveBooking}>Create booking</Button>
                      </div>
                    )}
                  </CardSummary>
                );
              })()}

              {/* Saved booking cards — one per booking */}
              {isInBookingsPhase && bookings.map((booking, index) => {
                const getBookingStepValues = (stepIndex: number): string[] | null => {
                  switch (stepIndex) {
                    case 0: { // Booking setup
                      const vals: string[] = [];
                      if (booking.startDate) vals.push(`${booking.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${booking.startTime}${booking.endDate ? ` – ${booking.endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${booking.endTime}` : ''}`);
                      if (booking.activeDays.length < 7) vals.push(`${booking.activeDays.join(', ')}`);
                      return vals.length > 0 ? vals : null;
                    }
                    case 1: { // Targeting
                      const vals: string[] = [];
                      if (booking.targetValue) vals.push(`${booking.targetKeywordType}: ${booking.targetValue}`);
                      if (booking.targetMode !== 'inclusive') vals.push(booking.targetMode);
                      return vals.length > 0 ? vals : null;
                    }
                    case 2: { // Delivery behavior
                      const vals: string[] = [];
                      if (booking.deliveryMethod && booking.deliveryMethod !== 'Account setting') vals.push(booking.deliveryMethod);
                      if (booking.optimizeForCPC) vals.push('Optimize for CPC');
                      if (booking.userFrequencyCap) vals.push('Frequency cap on');
                      if (booking.exclusivity) vals.push('Exclusivity on');
                      return vals.length > 0 ? vals : null;
                    }
                    case 3: { // Delivery objectives
                      const vals: string[] = [];
                      if (booking.priorityOverride) vals.push('Priority override');
                      if (booking.reachOverride) vals.push('Reach override');
                      if (booking.deliveryLimit) vals.push('Delivery limit set');
                      return vals.length > 0 ? vals : null;
                    }
                    case 4: { // Pricing
                      const vals: string[] = [];
                      if (booking.pricingModel) vals.push('Custom pricing');
                      if (booking.competeWithRTB) vals.push('Compete with RTB');
                      return vals.length > 0 ? vals : null;
                    }
                    default: return null;
                  }
                };
                return (
                  <CardSummary key={booking.id}>
                    <CardHeader>
                      <CardSummaryTitle>{booking.name || `Booking ${index + 1}`}</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      <div className="relative pl-12">
                        <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border"></div>
                        <div className="space-y-4">
                          {bookingSubStepLabels.map((label, stepIndex) => {
                            const vals = getBookingStepValues(stepIndex);
                            return (
                              <div key={label} className="relative flex items-start -ml-12">
                                <div className="w-10 flex justify-center">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground">
                                    <Check size={14} />
                                  </div>
                                </div>
                                <div className="ml-3 flex-1 min-w-0 pt-1">
                                  <div className="text-sm font-medium">{label}</div>
                                  {vals && <div className="text-sm text-muted-foreground mt-0.5">{vals.join(', ')}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardSummaryContent>
                  </CardSummary>
                );
              })}

              {/* Campaign summary card — always at the bottom */}
              <CardSummary>
                <CardHeader>
                  <CardSummaryTitle>{proposition.name} campaign</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  <div className="relative pl-12">
                    <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border"></div>
                    <div className="space-y-4">
                      {displayCampaignSteps.map((step, index) => {
                        const status = isInBookingsPhase ? 'completed' : getStepStatus(index);
                        const stepValues = getStepValues(step.id);
                        return (
                          <div key={step.id} className="relative flex items-start -ml-12">
                            <div className="w-10 flex justify-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${status === 'completed' ? 'bg-primary text-primary-foreground' : status === 'active' ? 'bg-background text-primary border border-primary' : 'bg-background text-muted-foreground border border-border'}`}>
                                {status === 'completed' ? <Check size={14} /> : index + 1}
                              </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0 pt-1">
                              <button type="button"
                                className={`text-sm text-left ${status === 'active' || status === 'completed' ? 'font-medium' : 'text-muted-foreground'} ${status === 'completed' && !isInBookingsPhase ? 'hover:underline cursor-pointer' : ''}`}
                                onClick={() => { if (status === 'completed' && !isInBookingsPhase) goToStepById(step.id); }}
                                disabled={status !== 'completed' || isInBookingsPhase}>
                                {step.label}
                              </button>
                              {status === 'completed' && stepValues ? (
                                <div className="text-sm text-muted-foreground mt-0.5">{Array.isArray(stepValues) ? stepValues.join(', ') : stepValues}</div>
                              ) : status === 'active' ? (
                                <div className="text-xs text-muted-foreground italic mt-0.5">{step.id === 'setup' ? 'Not filled in' : 'Not selected'}</div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardSummaryContent>
                {!isInBookingsPhase && isLastCampaignStep && (
                  <div className="px-4 pb-4">
                    <Button
                      className="w-full"
                      disabled={isDisplay ? !isCurrentStepComplete : false}
                      onClick={isDisplay ? goToNextStep : () => { const name = campaignName || 'New Campaign'; window.location.href = `${proposition.campaignRoute}?new=${encodeURIComponent(name)}`; }}
                    >
                      {isDisplay ? 'Save campaign' : 'Launch campaign'}
                    </Button>
                  </div>
                )}
                {isInBookingsPhase && (
                  <div className="px-4 pb-4">
                    <Button
                      className="w-full"
                      disabled={bookings.length === 0}
                      onClick={() => { const name = campaignName || 'New Campaign'; window.location.href = `${proposition.campaignRoute}?new=${encodeURIComponent(name)}`; }}
                    >
                      Launch campaign
                    </Button>
                  </div>
                )}
              </CardSummary>
            </div>
          </div>
        </div>
      </AppLayout>
    </MenuContextProvider>
  );
};

// --- Simplified SP Wizard (V2: 2 steps: Campaign Details + Booking) ---

const walletOptions = [
  { label: 'Summer 2026 Wallet – PepsiCo', value: 'summer-wallet' },
  { label: 'Q3 Trade Budget – Nestlé', value: 'q3-wallet' },
  { label: 'Holiday Wallet – Heineken', value: 'holiday-wallet' },
  { label: 'Core Brand Wallet – Unilever', value: 'core-wallet' },
];

// ── Single-select dropdown with search ──────────────────────────────────────
interface SearchSelectOption { label: string; value: string; }
interface SearchSelectProps {
  options: SearchSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}
const SearchSelect: React.FC<SearchSelectProps> = ({ options, value, onChange, placeholder = 'Select...', id }) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  const selected = options.find(o => o.value === value);
  return (
    <Popover open={open} onOpenChange={v => { setOpen(v); if (!v) setSearch(''); }}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <span className={cn('flex-1 truncate', !selected && 'text-muted-foreground')}>
            {selected ? selected.label : placeholder}
          </span>
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={e => { e.stopPropagation(); onChange(''); }}
              className="ml-1 rounded-full p-0.5 hover:bg-slate-200"
              aria-label="Clear"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </span>
          )}
          <ChevronDown className="w-4 h-4 ml-2 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        className="p-0"
      >
        <div className="sticky top-0 bg-white border-b border-border">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-2.5 w-full bg-muted/30 text-sm focus:outline-none border-0"
              style={{ boxShadow: 'none' }}
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">No results</div>
          ) : (
            filtered.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left transition-colors hover:bg-accent',
                  opt.value === value && 'bg-accent'
                )}
                onClick={() => { onChange(opt.value); setOpen(false); setSearch(''); }}
              >
                <span className="w-4 shrink-0">
                  {opt.value === value && <Check className="w-4 h-4" />}
                </span>
                {opt.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

export interface SPWizardInitialValues {
  campaignName?: string;
  externalId?: string;
  budget?: string;
  advertiser?: string;
  mediaPlanLabel?: string;
  mediaPlanAdvertiser?: string;
  mediaPlanBudget?: string;
  mediaPlanStartDate?: string;
  mediaPlanEndDate?: string;
  mediaPlanStatus?: string;
  startDate?: Date;
  endDate?: Date;
}

export const SimplifiedSPWizard = ({ initialValues }: { initialValues?: SPWizardInitialValues } = {}) => {
  const { theme: storybookTheme } = useStorybookTheme();
  const currentTheme = storybookTheme || 'retailMedia';
  const routes = getRoutesForTheme(currentTheme);
  const proposition = propositionConfigs['sponsored-products'];

  const wizardSteps = [
    { id: 'campaign-details', label: 'Campaign details' },
    { id: 'booking', label: 'Booking' },
  ];

  const [currentStep, setCurrentStep] = React.useState(0);
  const currentStepId = wizardSteps[currentStep]?.id;

  // ── Step 1: Campaign details ──
  // Resolve mediaPlanLabel → option value (or create dynamic entry)
  const resolvedMediaPlanValue = React.useMemo(() => {
    if (!initialValues?.mediaPlanLabel) return '';
    const match = mediaPlanOptions.find(m =>
      m.label.toLowerCase() === initialValues.mediaPlanLabel!.toLowerCase()
    );
    return match ? match.value : 'prefilled-media-plan';
  }, [initialValues?.mediaPlanLabel]);

  // Merge a dynamic media plan entry if the label didn't match any static option
  // Include detail fields (advertiser, budget, dates, status) so the summary card shows them
  const mediaPlanOptionsWithDynamic = React.useMemo(() => {
    if (!initialValues?.mediaPlanLabel) return mediaPlanOptions;
    const alreadyExists = mediaPlanOptions.some(m =>
      m.label.toLowerCase() === initialValues.mediaPlanLabel!.toLowerCase()
    );
    if (alreadyExists) return mediaPlanOptions;
    return [
      {
        label: initialValues.mediaPlanLabel,
        value: 'prefilled-media-plan',
        ...(initialValues.mediaPlanAdvertiser ? { advertiser: initialValues.mediaPlanAdvertiser } : {}),
        ...(initialValues.mediaPlanBudget ? { budget: initialValues.mediaPlanBudget } : {}),
        ...(initialValues.mediaPlanStartDate ? { startDate: initialValues.mediaPlanStartDate } : {}),
        ...(initialValues.mediaPlanEndDate ? { endDate: initialValues.mediaPlanEndDate } : {}),
        ...(initialValues.mediaPlanStatus ? { status: initialValues.mediaPlanStatus } : {}),
      },
      ...mediaPlanOptions,
    ];
  }, [initialValues?.mediaPlanLabel, initialValues?.mediaPlanAdvertiser, initialValues?.mediaPlanBudget, initialValues?.mediaPlanStartDate, initialValues?.mediaPlanEndDate, initialValues?.mediaPlanStatus]);

  // Resolve advertiser value: initialValues.advertiser may be a label or a value
  const resolvedAdvertiserValue = React.useMemo(() => {
    if (!initialValues?.advertiser) return '';
    // Try exact value match first
    const byValue = advertiserOptions.find(a => a.value === initialValues.advertiser);
    if (byValue) return byValue.value;
    // Try label match (advertiser was passed as human-readable label)
    const byLabel = advertiserOptions.find(a => a.label === initialValues.advertiser);
    if (byLabel) return byLabel.value;
    return '';
  }, [initialValues?.advertiser]);

  const [campaignName, setCampaignName] = React.useState(initialValues?.campaignName ?? '');
  const [externalId, setExternalId] = React.useState(initialValues?.externalId ?? '');
  const [budget, setBudget] = React.useState(initialValues?.budget ?? '');
  const [selectedAdvertiser, setSelectedAdvertiser] = React.useState(resolvedAdvertiserValue);
  const [selectedMediaPlanV2, setSelectedMediaPlanV2] = React.useState(resolvedMediaPlanValue);
  const [startDate, setStartDate] = React.useState<Date | undefined>(initialValues?.startDate);
  const [endDate, setEndDate] = React.useState<Date | undefined>(initialValues?.endDate);

  // ── Step 2: Booking ──
  // Sub-step within booking: 0 = Setup, 1 = Placements
  const [bookingSubStep, setBookingSubStep] = React.useState(0);
  // General information card
  const [bookingCampaignName, setBookingCampaignName] = React.useState('');
  const [selectedCampaign, setSelectedCampaign] = React.useState('');
  const [bookingStartDate, setBookingStartDate] = React.useState<Date | undefined>(undefined);
  const [bookingEndDate, setBookingEndDate] = React.useState<Date | undefined>(undefined);
  // Budget and bidding card
  const [totalBudget, setTotalBudget] = React.useState('');
  const [dailyBudget, setDailyBudget] = React.useState('');
  const [biddingCPC, setBiddingCPC] = React.useState('');
  const [sendBudgetNotification, setSendBudgetNotification] = React.useState(false);
  // Targeting card
  const [selectedLocalBrands, setSelectedLocalBrands] = React.useState<string[]>([...localBrands.map(b => b.id)]);
  // Placements (sub-step 2)
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [keywordInput, setKeywordInput] = React.useState('');
  const [keywords, setKeywords] = React.useState<string[]>(['summer sale', 'beverages', 'snacks']);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  // Completion checks
  const isCampaignDetailsComplete =
    campaignName.trim() !== '' &&
    budget.trim() !== '' &&
    selectedAdvertiser !== '' &&
    startDate !== undefined;

  const isBookingComplete =
    bookingCampaignName.trim() !== '' &&
    selectedCampaign.trim() !== '' &&
    bookingStartDate !== undefined &&
    totalBudget.trim() !== '' &&
    dailyBudget.trim() !== '' &&
    biddingCPC.trim() !== '';

  // Build campaign options for booking step — the just-created campaign appears first
  const campaignOptionsForBooking = React.useMemo(() => {
    const base = [
      { label: 'Knorr Summer Sale – Sponsored', value: 'knorr-summer-sale' },
      { label: 'Lay\'s Back to School – Display', value: 'lays-back-to-school' },
      { label: 'Heineken Q3 Brand Awareness', value: 'heineken-q3-brand' },
      { label: 'Maggi Holiday Gifting', value: 'maggi-holiday-gifting' },
    ];
    if (campaignName.trim()) {
      const key = 'new-' + campaignName.toLowerCase().replace(/[\s–—]+/g, '-').replace(/[^a-z0-9-]/g, '');
      return [{ label: campaignName, value: key }, ...base];
    }
    return base;
  }, [campaignName]);

  const getStepStatus = (stepIndex: number): 'completed' | 'active' | 'pending' => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const getCampaignDetailsSummary = (): string[] => {
    const vals: string[] = [];
    if (campaignName.trim()) vals.push(campaignName);
    const advData = advertiserOptions.find(a => a.value === selectedAdvertiser);
    if (advData) vals.push(advData.label);
    if (budget.trim()) vals.push(`€${budget}`);
    if (startDate) vals.push(startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    return vals;
  };

  const getBookingSummary = (): string[] => {
    const vals: string[] = [];
    if (bookingCampaignName.trim()) vals.push(bookingCampaignName);
    if (totalBudget.trim()) vals.push(`€${totalBudget}`);
    if (selectedLocalBrands.length > 0) vals.push(`${selectedLocalBrands.length} brand${selectedLocalBrands.length !== 1 ? 's' : ''}`);
    return vals;
  };

  const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

  return (
    <MenuContextProvider>
      <AppLayout
        routes={routes}
        logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
        user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
        onLogout={() => alert('Logout clicked')}
        breadcrumbProps={{ namespace: '' }}
        pageHeaderProps={{
          title: currentStepId === 'booking'
            ? bookingCampaignName || 'Untitled'
            : campaignName || 'Untitled',
          subtitle: currentStepId === 'campaign-details'
            ? 'Step 1 of 3 – Campaign details'
            : currentStepId === 'booking'
              ? bookingSubStep === 0
                ? 'Step 2 of 3 – Booking setup'
                : 'Step 3 of 3 – Placements'
              : '',
          headerRight: null,
        }}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 min-w-0 space-y-4">

              {/* ── Step 1: Campaign details ── */}
              {currentStepId === 'campaign-details' && (
                <Card>
                  <CardContent className="pt-6">
                    {/* Row 0: Media plan (full width) */}
                    <div className="mb-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="v2-media-plan">Media plan</Label>
                        <SearchSelect
                          id="v2-media-plan"
                          options={mediaPlanOptionsWithDynamic}
                          value={selectedMediaPlanV2}
                          onChange={setSelectedMediaPlanV2}
                          placeholder="Select a media plan"
                        />
                      </div>
                    </div>

                    {/* Row 1: Name + External ID */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="v2-name">Campaign name <span className="text-destructive">*</span></Label>
                        <Input
                          id="v2-name"
                          placeholder="e.g. Summer Sale 2026 – Powerade"
                          value={campaignName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="v2-ext-id">External ID <span className="text-destructive">*</span></Label>
                        <Input
                          id="v2-ext-id"
                          placeholder="e.g. 11743347"
                          value={externalId}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExternalId(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Row 2: Budget + Advertiser */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="v2-budget">Budget <span className="text-destructive">*</span></Label>
                        <Input
                          id="v2-budget"
                          type="number"
                          placeholder="e.g. 200000"
                          value={budget}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Advertiser <span className="text-destructive">*</span></Label>
                        <Input
                          dropdown
                          options={advertiserOptions}
                          value={selectedAdvertiser}
                          onChange={(value: string) => setSelectedAdvertiser(value)}
                          placeholder="Select an advertiser"
                        />
                      </div>
                    </div>

                    {/* Row 3: Start Date + End Date */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1.5">
                        <Label>Start Date <span className="text-destructive">*</span></Label>
                        <DatePicker
                          date={startDate}
                          onDateChange={setStartDate}
                          placeholder="Select start date"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>End Date</Label>
                        <DatePicker
                          date={endDate}
                          onDateChange={setEndDate}
                          placeholder="Select end date"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        disabled={!isCampaignDetailsComplete}
                        onClick={() => {
                          // Pre-fill booking step from campaign details
                          const key = 'new-' + campaignName.toLowerCase().replace(/[\s–—]+/g, '-').replace(/[^a-z0-9-]/g, '');
                          setSelectedCampaign(key);
                          setBookingCampaignName('');
                          if (startDate) setBookingStartDate(startDate);
                          if (endDate) setBookingEndDate(endDate);
                          if (budget.trim()) setTotalBudget(budget);
                          setCurrentStep(1);
                        }}
                        className="flex items-center gap-2"
                      >
                        Create campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── Step 2: Booking – Sub-step 1: Setup ── */}
              {currentStepId === 'booking' && bookingSubStep === 0 && (
                <div className="space-y-4">

                  {/* Card 1: General information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Booking setup</CardTitle>
                      <CardDescription>Please fill in all the required* fields.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="bk-campaign">Campaign <span className="text-destructive">*</span></Label>
                        <SearchSelect
                          id="bk-campaign"
                          options={campaignOptionsForBooking}
                          value={selectedCampaign}
                          onChange={setSelectedCampaign}
                          placeholder="Select a campaign"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bk-name">Booking name <span className="text-destructive">*</span></Label>
                        <Input
                          id="bk-name"
                          placeholder="e.g. Enter booking name"
                          value={bookingCampaignName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingCampaignName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>Start date <span className="text-destructive">*</span></Label>
                          <DatePicker
                            date={bookingStartDate}
                            onDateChange={setBookingStartDate}
                            placeholder="Select start date"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>End date</Label>
                          <DatePicker
                            date={bookingEndDate}
                            onDateChange={setBookingEndDate}
                            placeholder="Select end date"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2: Budget and bidding */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Budget and bidding</CardTitle>
                      <CardDescription>What are you trying to achieve with this campaign?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="bk-total">Total budget <span className="text-destructive">*</span></Label>
                          <Input
                            id="bk-total"
                            type="number"
                            placeholder="10.00"
                            value={totalBudget}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalBudget(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bk-daily">Daily budget <span className="text-destructive">*</span></Label>
                          <Input
                            id="bk-daily"
                            type="number"
                            placeholder="1.00"
                            value={dailyBudget}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDailyBudget(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bk-cpc">Bidding (CPC) <span className="text-destructive">*</span></Label>
                          <Input
                            id="bk-cpc"
                            type="number"
                            placeholder="0.50"
                            value={biddingCPC}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBiddingCPC(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                        <Switch checked={sendBudgetNotification} onCheckedChange={setSendBudgetNotification} />
                        <span className="text-sm text-muted-foreground">Send me an email with budget notifications</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3: Targeting */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Targeting</CardTitle>
                      <CardDescription>Which great local brand would you like to target?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {localBrands.map((brand) => {
                        const isSelected = selectedLocalBrands.includes(brand.id);
                        return (
                          <button
                            key={brand.id}
                            type="button"
                            onClick={() => setSelectedLocalBrands(prev =>
                              prev.includes(brand.id) ? prev.filter(b => b !== brand.id) : [...prev, brand.id]
                            )}
                            className="w-full flex items-center gap-3 py-2 px-1 rounded hover:bg-muted/40 transition-colors text-left"
                          >
                            <div className={cn(
                              "h-4 w-4 shrink-0 rounded-sm border border-primary flex items-center justify-center",
                              isSelected && "bg-primary text-primary-foreground"
                            )}>
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <span className="text-sm">{brand.label}</span>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between pt-1">
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
                    <Button
                      disabled={!isBookingComplete}
                      onClick={() => setBookingSubStep(1)}
                    >
                      Next: Placements
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Booking – Sub-step 2: Placements ── */}
              {currentStepId === 'booking' && bookingSubStep === 1 && (
                <div className="space-y-4">

                  {/* Card 1: Retail products */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Retail products</CardTitle>
                      <CardDescription>Select the products you want to promote in this booking.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { id: 'prod-001', name: 'Heineken 6-pack 330ml', sku: 'HNK-330-6PK', category: 'Beer' },
                        { id: 'prod-002', name: 'Heineken 0.0 6-pack 330ml', sku: 'HNK-00-330-6PK', category: 'Beer – Alcohol Free' },
                        { id: 'prod-003', name: 'Heineken Silver 6-pack 330ml', sku: 'HNK-SLV-330-6PK', category: 'Beer' },
                        { id: 'prod-004', name: 'Heineken 24-pack 330ml', sku: 'HNK-330-24PK', category: 'Beer' },
                        { id: 'prod-005', name: 'Heineken 1L bottle', sku: 'HNK-1L-BTL', category: 'Beer' },
                      ].map((product) => {
                        const isSelected = selectedProducts.includes(product.id);
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => setSelectedProducts(prev =>
                              prev.includes(product.id) ? prev.filter(p => p !== product.id) : [...prev, product.id]
                            )}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                              isSelected ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/30"
                            )}
                          >
                            <div className={cn(
                              "h-4 w-4 shrink-0 rounded-sm border border-primary flex items-center justify-center",
                              isSelected && "bg-primary text-primary-foreground"
                            )}>
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sku} · {product.category}</p>
                            </div>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Card 2: Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Keywords</CardTitle>
                      <CardDescription>Add keywords to target shoppers searching for relevant products.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. beer, lager, party drinks"
                          value={keywordInput}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywordInput(e.target.value)}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter' && keywordInput.trim()) {
                              setKeywords(prev => [...prev, keywordInput.trim()]);
                              setKeywordInput('');
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (keywordInput.trim()) {
                              setKeywords(prev => [...prev, keywordInput.trim()]);
                              setKeywordInput('');
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      {keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {keywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                            >
                              {kw}
                              <button
                                type="button"
                                onClick={() => setKeywords(prev => prev.filter((_, i) => i !== idx))}
                                className="hover:text-destructive transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Card 3: Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Categories</CardTitle>
                      <CardDescription>Select product categories to broaden your reach.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { id: 'cat-beer', label: 'Beer & Cider', count: '1,240 products' },
                        { id: 'cat-spirits', label: 'Spirits & Liqueurs', count: '890 products' },
                        { id: 'cat-wine', label: 'Wine', count: '2,100 products' },
                        { id: 'cat-soft', label: 'Soft Drinks & Mixers', count: '560 products' },
                        { id: 'cat-snacks', label: 'Snacks & Crisps', count: '740 products' },
                        { id: 'cat-party', label: 'Party & Entertaining', count: '320 products' },
                      ].map((cat) => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategories(prev =>
                              prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                            )}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                              isSelected ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/30"
                            )}
                          >
                            <div className={cn(
                              "h-4 w-4 shrink-0 rounded-sm border border-primary flex items-center justify-center",
                              isSelected && "bg-primary text-primary-foreground"
                            )}>
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{cat.label}</p>
                              <p className="text-xs text-muted-foreground">{cat.count}</p>
                            </div>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between pt-1">
                    <Button variant="outline" onClick={() => setBookingSubStep(0)}>Back</Button>
                    <Button
                      onClick={() => { window.location.href = `${proposition.campaignRoute}?new=${encodeURIComponent(campaignName || 'New Campaign')}`; }}
                    >
                      Save &amp; finish
                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* Summary sidebar */}
            <div className="flex flex-col gap-4">

              {/* ── Media plan card ── */}
              <CardSummary>
                <CardHeader>
                  <CardSummaryTitle>Media plan</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  {(() => {
                    const mp = mediaPlanOptionsWithDynamic.find(m => m.value === selectedMediaPlanV2);
                    if (!mp) return <p className="text-xs text-muted-foreground italic">Not selected</p>;
                    return (
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{mp.label}</p>
                        {'advertiser' in mp && mp.advertiser && (
                          <div className="flex justify-between gap-2 pt-1">
                            <span className="text-muted-foreground shrink-0">Advertiser</span>
                            <span className="font-medium text-right truncate">{mp.advertiser}</span>
                          </div>
                        )}
                        {'budget' in mp && mp.budget && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Budget</span>
                            <span className="font-medium text-right">{mp.budget}</span>
                          </div>
                        )}
                        {'startDate' in mp && mp.startDate && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Start date</span>
                            <span className="font-medium text-right">{mp.startDate}</span>
                          </div>
                        )}
                        {'endDate' in mp && mp.endDate && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">End date</span>
                            <span className="font-medium text-right">{mp.endDate}</span>
                          </div>
                        )}
                        {'status' in mp && mp.status && (
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Status</span>
                            <span className="font-medium text-right">{mp.status}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </CardSummaryContent>
              </CardSummary>

              {/* ── Campaign card ── */}
              <CardSummary>
                <CardHeader>
                  <CardSummaryTitle>Campaign</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Name</span>
                      <span className="font-medium text-right truncate">{campaignName || <span className="italic text-muted-foreground">—</span>}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">External ID</span>
                      <span className="font-medium text-right truncate">{externalId || <span className="italic text-muted-foreground">—</span>}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Advertiser</span>
                      <span className="font-medium text-right truncate">
                        {advertiserOptions.find(a => a.value === selectedAdvertiser)?.label || <span className="italic text-muted-foreground">—</span>}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Budget</span>
                      <span className="font-medium text-right">{budget ? `€${budget}` : <span className="italic text-muted-foreground">—</span>}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">Start date</span>
                      <span className="font-medium text-right">{startDate ? startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="italic text-muted-foreground">—</span>}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">End date</span>
                      <span className="font-medium text-right">{endDate ? endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="italic text-muted-foreground">—</span>}</span>
                    </div>
                  </div>
                </CardSummaryContent>
              </CardSummary>

              {/* ── Booking card (includes placements when on sub-step 2) ── */}
              <CardSummary className={currentStepId === 'campaign-details' ? 'opacity-40 pointer-events-none' : ''}>
                <CardHeader>
                  <CardSummaryTitle>Booking</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  {currentStepId === 'campaign-details' ? (
                    <p className="text-xs text-muted-foreground italic">Complete campaign details first</p>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">Booking name</span>
                        <span className="font-medium text-right truncate">{bookingCampaignName || <span className="italic text-muted-foreground">—</span>}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">Campaign</span>
                        <span className="font-medium text-right truncate">{campaignOptionsForBooking.find(o => o.value === selectedCampaign)?.label || <span className="italic text-muted-foreground">—</span>}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">Start date</span>
                        <span className="font-medium text-right">{bookingStartDate ? bookingStartDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="italic text-muted-foreground">—</span>}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">End date</span>
                        <span className="font-medium text-right">{bookingEndDate ? bookingEndDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="italic text-muted-foreground">—</span>}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">Total budget</span>
                        <span className="font-medium text-right">{totalBudget ? `€${totalBudget}` : <span className="italic text-muted-foreground">—</span>}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">Daily budget</span>
                        <span className="font-medium text-right">{dailyBudget ? `€${dailyBudget}` : <span className="italic text-muted-foreground">—</span>}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground shrink-0">CPC bid</span>
                        <span className="font-medium text-right">{biddingCPC ? `€${biddingCPC}` : <span className="italic text-muted-foreground">—</span>}</span>
                      </div>

                      {/* Placements section — shown once user reaches sub-step 2 */}
                      {bookingSubStep >= 1 && (
                        <>
                          <div className="border-t border-border/50 pt-2 mt-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Placements</p>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Products</span>
                            <span className="font-medium text-right">{selectedProducts.length > 0 ? `${selectedProducts.length} selected` : <span className="italic text-muted-foreground">—</span>}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Keywords</span>
                            <span className="font-medium text-right">{keywords.length > 0 ? `${keywords.length} keywords` : <span className="italic text-muted-foreground">—</span>}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Categories</span>
                            <span className="font-medium text-right">{selectedCategories.length > 0 ? `${selectedCategories.length} selected` : <span className="italic text-muted-foreground">—</span>}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
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

export const CreateSponsoredProductsV2: Story = {
  render: () => <SimplifiedSPWizard />,
  parameters: {
    docs: {
      description: {
        story: 'Simplified 2-step wizard for creating a Sponsored Products campaign: all campaign details in one step, followed by a booking configuration.',
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
