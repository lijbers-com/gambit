import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { FormSection } from '@/components/ui/form-section';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchSelectList } from '@/components/ui/search-select-list';
import { SuggestionList } from '@/components/ui/suggestion-list';
import { GoalCard } from '@/components/ui/goal-card';
import { spKeywordSuggestions, spKeywordDescription, spKeywordDetail, spCategoryOptions, localBrands } from '@/lib/sp-keywords';
import { LevelMeter } from '@/components/ui/level-meter';
import { SummaryCard } from '@/components/ui/summary-card';
import { LinkPickerDialog, LinkActionIcon } from '@/components/ui/link-picker';
import { HierarchySidebar } from '@/components/ui/hierarchy-sidebar';
import { MetricRow } from '@/components/ui/metric-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { SelectionList } from '@/components/ui/selection-list';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangePicker, futureDateRangePresets } from '@/components/ui/date-picker';
import { retailMoments } from '@/lib/retail-moments';
import { creativesForEngine } from '@/lib/creatives';
import { Table } from '@/components/ui/table';
import { stripPropositionSuffix } from '@/lib/proposition-colors';
import { TargetSelect, countTargets } from '@/components/ui/target-select';
import { onlineTargetGroups } from '@/lib/target-groups';
import { CreatePlacement } from '@/components/ui/create-placement';
import { BuyingTypePicker } from '@/components/ui/buying-type-picker';
import { BudgetPacing, type PacingShape, type PacingOverride } from '@/components/ui/budget-pacing';
import { BidRow, suggestedBid } from '@/components/ui/bid-row';
import { ToggleCard } from '@/components/ui/toggle-card';
import { DeliveryBehaviorFields, DeliveryObjectivesFields, ToggleSection, defaultDeliveryBehavior, defaultDeliveryObjectives, DELIVERY_OBJECTIVES_INFO, DELIVERY_OBJECTIVES_OFF, type DeliveryBehaviorValue, type DeliveryObjectivesValue } from '@/components/ui/delivery-settings';
import { BookingBudgetRuntime } from '@/components/ui/booking-budget-runtime';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { productImages } from '@/lib/product-images';
import { useDb, getDb, createCampaign, createBooking, updateBooking, updateCampaign, type EngineId } from '@/lib/db';
import { queueToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { DateRange } from 'react-day-picker';
import { Eye, Brain, ShoppingCart, Heart, Check, X, Users, Tag, TrendingUp, DollarSign, Sparkles, ScanBarcode, MonitorSpeaker, ListStart, MonitorPlay, Store, CalendarDays, Target, Search, Plus, ChevronDown, ChevronRight, Download, Upload, Calendar, Clock, CornerDownRight, Globe, ImagePlus, type LucideIcon, Gavel, ShieldCheck } from 'lucide-react';
import { AddInlineLabel } from '@/components/ui/add-button';

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
  offsite: {
    id: 'offsite',
    name: 'Offsite',
    description: 'Reach shoppers beyond the retailer — open web, social, CTV',
    icon: Globe,
    metrics: { reach: '5.6M', roas: '2.2x', sales: '€6,100', roasChange: '+6%' },
    campaignRoute: '/campaigns/offsite',
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

/**
 * Every proposition's wizard runs its campaign steps and then CONTINUES into
 * the booking and creative steps — one flow from "new campaign" to something
 * that can actually deliver, ending on the campaign's detail page. Sponsored
 * products is the exception without creatives: its ad is the product listing,
 * so its flow ends at keywords & placements.
 */
const getWizardSteps = (propositionType: string) => {
  if (propositionType === 'display') {
    return [
      { id: 'setup', label: 'Setup' },
      { id: 'advertiser', label: 'Advertiser' },
      { id: 'budget', label: 'Run time & budget' },
      { id: 'bookings', label: 'Bookings' },
      { id: 'creatives', label: 'Creatives' },
    ];
  }
  if (propositionType === 'sponsored-products') {
    return [
      { id: 'setup', label: 'Setup' },
      { id: 'advertiser', label: 'Advertiser' },
      { id: 'budget', label: 'Run time & budget' },
      { id: 'targeting', label: 'Goals & targets' },
      { id: 'keywords', label: 'Keywords & placements' },
    ];
  }
  return [
    { id: 'setup', label: 'Setup' },
    { id: 'advertiser', label: 'Advertiser' },
    { id: 'budget', label: 'Run time & budget' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'creatives', label: 'Creatives' },
  ];
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

// ── Bidding ─────────────────────────────────────────────────────────────
//
// On auction campaigns the price lives WHERE the inventory is picked: every
// selected placement card carries its own CPC with a suggested bid to accept.
// Guaranteed campaigns buy at fixed price and show no bids at all — the
// choice is made once, in campaign setup.

// --- Proposition Wizard Component ---

const PropositionWizard = ({
  propositionType,
  planId,
  campaignId,
  bookingId,
  step: entryStep,
  returnTo,
}: {
  propositionType: string;
  /** Create the campaign inside this media plan (run time prefills from it). */
  planId?: string;
  /** Booking mode: the campaign exists — run only the booking and creative
   *  steps against it, and land on the created booking. */
  campaignId?: string;
  /** Approval mode: this booking exists but was PREFILLED by the media plan
   *  wizard, so it is still a draft. The same booking steps run against it,
   *  already answered, and saving approves it instead of making a second. */
  bookingId?: string;
  /** With campaignId: 'creatives' runs only the creative step, against the
   *  campaign's existing bookings that still miss one. */
  step?: string;
  /** Where the run was started from — the media plan or the campaign — so
   *  finishing hands the user back to it instead of somewhere plausible. */
  returnTo?: string;
}) => {
  const { theme: storybookTheme } = useStorybookTheme();
  const currentTheme = storybookTheme || 'retailMedia';
  const routes = getRoutesForTheme(currentTheme);
  const proposition = propositionConfigs[propositionType];
  const PropositionIcon = proposition.icon;
  const isSponsoredProducts = propositionType === 'sponsored-products';

  // The prototype database — the wizard READS context (plan, campaign,
  // positions) from it and WRITES its result into it: finishing is what
  // creates the campaign and bookings the detail pages then show.
  const db = useDb();
  // Approval mode reads the booking it is approving; its campaign is the one
  // that booking already belongs to.
  const routeBooking = bookingId ? db.bookings.find((b) => b.id === bookingId) : undefined;
  // The campaign the booking hangs under: seeded from the route, and the
  // campaign card's link action can point the booking at another one — even
  // right after creating a campaign here.
  const [linkedCampaignId, setLinkedCampaignId] = React.useState<string | undefined>(campaignId ?? routeBooking?.campaignId);
  const [linkingCampaign, setLinkingCampaign] = React.useState(false);
  // The client store resolves the booking after hydration; adopt its campaign.
  React.useEffect(() => {
    if (routeBooking && !linkedCampaignId) setLinkedCampaignId(routeBooking.campaignId);
  }, [routeBooking, linkedCampaignId]);
  const routeCampaign = linkedCampaignId ? db.campaigns.find((c) => c.id === linkedCampaignId) : undefined;
  // Seeded from the route (`?planId=`, or the campaign's own plan in booking
  // mode); the Media plan card's link action can change it.
  const [linkedPlanId, setLinkedPlanId] = React.useState<string | undefined>(
    planId ?? routeCampaign?.mediaPlanId ?? undefined,
  );
  const [linkingMediaPlan, setLinkingMediaPlan] = React.useState(false);
  const linkedPlan = linkedPlanId ? db.mediaPlans.find((p) => p.id === linkedPlanId) : undefined;
  const bookingMode = !!campaignId || !!bookingId;
  const creativesOnly = bookingMode && entryStep === 'creatives';
  /** Approving a campaign the media plan wizard proposed: its own steps run
   *  against the existing record, and the flow continues into the bookings
   *  and creatives that make it deliverable. */
  const campaignReview = bookingMode && entryStep === 'campaign';

  // Booking mode skips the campaign phase — those steps are already answered
  // by the existing campaign; creatives-only mode is just the last step.
  const wizardSteps = React.useMemo(() => {
    const all = getWizardSteps(propositionType);
    if (creativesOnly) return all.filter((s) => s.id === 'creatives');
    const withoutCreatives = all.filter((s) => s.id !== 'creatives');
    if (campaignReview) return withoutCreatives;
    if (bookingMode) return withoutCreatives.filter((s) => s.id === 'bookings');
    return withoutCreatives;
  }, [propositionType, bookingMode, creativesOnly, campaignReview]);

  // Wizard state
  const [currentStep, setCurrentStep] = React.useState(0);
  const currentStepId = wizardSteps[currentStep]?.id;

  // Buying type — display and digital in-store auction OR reserve their
  // inventory; the choice decides whether placements carry bids. Booking mode
  // inherits the answer from the existing campaign.
  const hasBuyingType = propositionType === 'display' || propositionType === 'digital-instore';
  const [buyingType, setBuyingType] = React.useState<'auction' | 'guaranteed'>('auction');
  const isAuction = (routeCampaign?.buyingType ?? buyingType) !== 'guaranteed';

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
  const [autoPacing, setAutoPacing] = React.useState(false);
  const [pacingShape, setPacingShape] = React.useState<PacingShape>('even');
  const [pacingOverrides, setPacingOverrides] = React.useState<PacingOverride[]>([]);
  const [sendBudgetNotification, setSendBudgetNotification] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

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

  // Bookings phase state — every proposition except sponsored products runs
  // it (display first grew it; the flow is the same everywhere).
  const isDisplay = propositionType === 'display';
  const [bookings, setBookings] = React.useState<{
    id: string; name: string; budget: number; startDate?: Date; startTime: string;
    endDate?: Date; endTime: string; activeDays: string[]; positionIds: string[];
    /** Per-position CPC on auction campaigns — the bid lives on the placement. */
    bids: Record<string, string>;
    inclTargets: Record<string, string[]>; exclTargets: Record<string, string[]>;
    /** The creative it runs, chosen on the booking's own last step. */
    creativeId: string;
    deliveryBehavior: DeliveryBehaviorValue; objectivesEnabled: boolean; deliveryObjectives: DeliveryObjectivesValue;
  }[]>([]);
  const [bookingSubStep, setBookingSubStep] = React.useState<number | null>(null);
  // The booking's questions, in order: what it is, when it runs and what it
  // may spend (with active days), where it runs, who it targets — and last
  // the creative it runs, for the propositions that have one. (Sponsored
  // products does not: the product listing IS the ad.) No Pricing step — the
  // price sits on each selected placement on auction campaigns; for display,
  // delivery behaviour and objectives are part of Targeting.
  const hasCreativeStep = propositionType !== 'sponsored-products';
  const bookingSubStepLabels = hasCreativeStep
    ? ['Setup', 'Run time & budget', 'Placement', 'Targeting', 'Creative']
    : ['Setup', 'Run time & budget', 'Placement', 'Targeting'];
  /** The creative chosen for the booking being built or approved. */
  const [bookingCreativeId, setBookingCreativeId] = React.useState('');
  // Booking setup
  const [bookingName, setBookingName] = React.useState('');
  const [bookingDateRange, setBookingDateRange] = React.useState<DateRange | undefined>(undefined);
  const [bookingStartTime, setBookingStartTime] = React.useState('00:00');
  const [bookingEndTime, setBookingEndTime] = React.useState('23:59');
  const [activeDays, setActiveDays] = React.useState(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
  /** The booking's own budget, part of its Budget & run time step. */
  const [bookingBudget, setBookingBudget] = React.useState('');
  /** The channel picked in the Placement step (CreatePlacement is
   *  single-select: one media product per booking, everything in it included,
   *  trimmed in the modal). */
  const [selectedChannelIds, setSelectedChannelIds] = React.useState<string[]>([]);
  /** Weekday scheduling exists for the propositions that can switch by day. */
  const canScheduleDays = ['display', 'digital-instore', 'offsite'].includes(propositionType);
  // The booking's placement — real positions from the proposition's inventory,
  // because positionIds is what the to-do engine judges "placed" by.
  const [bookingPositionIds, setBookingPositionIds] = React.useState<string[]>([]);
  // The bid per selected position (auction campaigns only).
  const [positionBids, setPositionBids] = React.useState<Record<string, string>>({});
  // Creative step: per booking, the chosen creative ('' = add later).
  const [creativeChoice, setCreativeChoice] = React.useState<Record<string, string>>({});
  // Targeting — the same include/exclude target-group control the booking
  // detail page uses (ui/target-select): groups first, values as chips.
  const [inclTargets, setInclTargets] = React.useState<Record<string, string[]>>({});
  const [exclTargets, setExclTargets] = React.useState<Record<string, string[]>>({});
  // Delivery settings — the same value shapes the booking detail form uses.
  const [deliveryBehavior, setDeliveryBehavior] = React.useState<DeliveryBehaviorValue>(defaultDeliveryBehavior);
  const [objectivesEnabled, setObjectivesEnabled] = React.useState(false);
  const [deliveryObjectives, setDeliveryObjectives] = React.useState<DeliveryObjectivesValue>(defaultDeliveryObjectives);

  const dayLabels = [
    { id: 'mo', label: 'Mo' }, { id: 'tu', label: 'Tu' }, { id: 'we', label: 'We' },
    { id: 'th', label: 'Th' }, { id: 'fr', label: 'Fr' }, { id: 'sa', label: 'Sa' }, { id: 'su', label: 'Su' },
  ];
  const toggleDay = (id: string) => setActiveDays(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);

  const saveBooking = () => {
    // Approving an existing booking commits on the spot: the wizard was run
    // FOR that booking, so its last step is the end of the job, not a
    // staging post on the way to a list.
    if (routeBooking) {
      updateBooking(routeBooking.id, {
        status: 'in-option',
        name: bookingName || routeBooking.name,
        budget: parseFloat(bookingBudget) || routeBooking.budget,
        startDate: toIso(bookingDateRange?.from) ?? routeBooking.startDate,
        endDate: toIso(bookingDateRange?.to) ?? routeBooking.endDate,
        positionIds: bookingPositionIds.length > 0 ? bookingPositionIds : routeBooking.positionIds,
        ...(bookingCreativeId ? { creativeStatus: 'submitted' as const } : {}),
      });
      queueToast({ title: 'Booking approved', description: bookingName || routeBooking.name });
      if (typeof window !== 'undefined') window.location.href = afterBooking(routeBooking.campaignId, routeBooking.id);
      return;
    }
    setBookings(prev => [...prev, {
      id: String(Date.now()),
      name: bookingName, budget: parseFloat(bookingBudget) || 0,
      startDate: bookingDateRange?.from, startTime: bookingStartTime,
      endDate: bookingDateRange?.to, endTime: bookingEndTime, activeDays: [...activeDays],
      positionIds: [...bookingPositionIds],
      bids: { ...positionBids },
      inclTargets: { ...inclTargets }, exclTargets: { ...exclTargets },
      creativeId: bookingCreativeId,
      deliveryBehavior: { ...deliveryBehavior }, objectivesEnabled, deliveryObjectives: { ...deliveryObjectives },
    }]);
    // Reset form for next booking
    setBookingSubStep(null);
    setBookingName(''); setBookingBudget(''); setBookingDateRange(undefined);
    setBookingStartTime('00:00'); setBookingEndTime('23:59');
    setActiveDays(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
    setBookingPositionIds([]); setPositionBids({}); setSelectedChannelIds([]);
    setInclTargets({}); setExclTargets({}); setBookingCreativeId('');
    setDeliveryBehavior(defaultDeliveryBehavior); setObjectivesEnabled(false); setDeliveryObjectives(defaultDeliveryObjectives);
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

  // Phase helpers. The campaign phase is everything before 'bookings'; the
  // booking/creative phase continues the same wizard — one flow, two entities.
  const hasBookingsPhase = wizardSteps.some(s => s.id === 'bookings') || creativesOnly;
  // Bookings is a step OF the campaign — the timeline carries it, with how
  // many the campaign has once it is set up.
  const displayCampaignSteps = wizardSteps.filter(s => s.id !== 'creatives');
  const isInBookingsPhase = currentStepId === 'bookings' || currentStepId === 'creatives';
  /**
   * The campaign card is a TIMELINE while the campaign's own steps are being
   * walked — creating one, or checking the one the media plan proposed — so
   * the same guidance the booking gets applies to the campaign. It steps back
   * to its collapsed card the moment a booking takes over as the active card.
   */
  const campaignStepsActive =
    !creativesOnly
    && (!bookingMode || campaignReview)
    && bookingSubStep === null
    && currentStepId !== 'creatives';

  const isLastCampaignStep = hasBookingsPhase
    ? wizardSteps[currentStep + 1]?.id === 'bookings'
    : currentStep === wizardSteps.length - 1;

  // The proposition's real inventory, the way it is sold: CHANNELS group ad
  // positions. The placement picker asks channel first, positions second.
  const engineChannels = React.useMemo(() => {
    return db.mediaProducts
      .filter((mp) => mp.engine === propositionType)
      .map((mp) => ({
        id: mp.id,
        name: mp.name,
        positions: db.positions.filter((p) => p.mediaProductId === mp.id),
      }))
      .filter((ch) => ch.positions.length > 0);
  }, [db, propositionType]);
  const enginePositions = React.useMemo(
    () => engineChannels.flatMap((ch) => ch.positions.map((p) => ({ id: p.id, name: p.name, product: ch.name }))),
    [engineChannels],
  );

  /** The campaign's bookings as they stand in the store — what a run against
   *  an EXISTING campaign is working on, as opposed to what it just staged. */
  const existingBookings = React.useMemo(
    () => (linkedCampaignId ? db.bookings.filter((b) => b.campaignId === linkedCampaignId) : []),
    [db, linkedCampaignId],
  );

  /** How many bookings this campaign has: the ones it already carries, plus
   *  any this run has added. */
  const campaignBookingCount = (routeCampaign ? existingBookings.length : 0) + bookings.length;

  // What the creative step works on: the bookings this run made, plus the
  // campaign's own bookings that still need one — so approving a campaign
  // carries through to dressing the bookings it already had.
  const creativeTargets = creativesOnly
    ? (routeBooking
        ? [{ id: routeBooking.id, name: routeBooking.name }]
        : existingBookings
            .filter((b) => b.creativeStatus === 'missing' && b.status !== 'completed')
            .map((b) => ({ id: b.id, name: b.name })))
    : [
        ...bookings.map((b, i) => ({ id: b.id, name: b.name || `Booking ${i + 1}` })),
        ...existingBookings
          .filter((b) => b.creativeStatus === 'missing' && b.status !== 'completed' && b.id !== routeBooking?.id)
          .map((b) => ({ id: b.id, name: b.name })),
      ];

  /** Demo creative library — linking one marks the booking 'submitted'. */
  const creativeOptions = [
    { id: 'cr-hero', name: 'Summer hero banner' },
    { id: 'cr-spotlight', name: 'Product spotlight set' },
    { id: 'cr-video', name: 'Brand video 15s' },
  ];

  const toIso = (d?: Date) => (d ? d.toISOString().slice(0, 10) : undefined);

  /**
   * Where to go when a booking is finished. A campaign is rarely one booking:
   * if others are still proposed, or still without a creative, the run
   * continues into the next one rather than dropping the user out and asking
   * them to find it. Only when nothing is left does it hand back to whatever
   * started the run — the media plan or the campaign.
   */
  const backLink = returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : '';
  const afterBooking = (campaignOfBooking: string | undefined, justDoneId?: string) => {
    const fresh = getDb();
    const siblings = campaignOfBooking
      ? fresh.bookings.filter((b) => b.campaignId === campaignOfBooking && b.status !== 'completed')
      : [];
    // A creative the user deliberately skipped is not a reason to send them
    // straight back into it, so the booking just handled is left out.
    const stillOpen = siblings.some((b) => b.status === 'draft')
      || (hasCreativeStep && siblings.some((b) => b.id !== justDoneId && b.creativeStatus === 'missing'));
    // Back to the campaign's bookings list — the user picks the next one to
    // approve from the overview rather than being dropped into it.
    if (stillOpen) return `/create/${propositionType}?campaignId=${campaignOfBooking}${backLink}`;
    return returnTo ?? (campaignOfBooking ? `${proposition.campaignRoute}/${campaignOfBooking}` : proposition.campaignRoute);
  };

  // ── Prefill — the questions the media plan already answered are not asked
  //    again. All seeded after mount (never during render) so server and
  //    client HTML agree. ──────────────────────────────────────────────────

  // Campaign mode inside a plan: name, run time, the plan's goal, its
  // advertiser and brand, and the unallocated share of its budget.
  React.useEffect(() => {
    if (!linkedPlan) return;
    // A campaign being CREATED takes the plan's name, dates and unclaimed
    // budget; one that already exists keeps its own (the effect below fills
    // those from the record). Either way it inherits the plan's advertiser
    // and brand, which is why that part runs for both.
    if (!routeCampaign) {
      setCampaignName((prev) => prev || linkedPlan.name);
      setDateRange({ from: new Date(linkedPlan.startDate), to: new Date(linkedPlan.endDate) });
      const siblings = db.campaigns.filter((c) => c.mediaPlanId === linkedPlan.id);
      const unallocated = Math.max(linkedPlan.budget - siblings.reduce((s, c) => s + c.budget, 0), 0);
      if (unallocated > 0) setBudgetAmount((prev) => prev || String(unallocated));
      if (linkedPlan.goal) setSelectedGoal((prev) => prev ?? linkedPlan.goal!);
    }
    // The plan's advertiser and brand, matched by name into the demo options.
    const adv = db.advertisers.find((a) => a.id === linkedPlan.advertiserId);
    if (adv) {
      const advOpt = advertiserOptions.find((o) => o.label.toLowerCase() === adv.name.toLowerCase());
      if (advOpt) setSelectedAdvertiser((prev) => prev || advOpt.value);
      const planBrand = adv.brands.find((b) => linkedPlan.brandIds.includes(b.id)) ?? adv.brands[0];
      // Prefix match either way — the store says "Pepsi", the option "PepsiCo".
      const brandOpt = planBrand && brandOptions.find((o) => {
        const a = o.label.toLowerCase(); const b = planBrand.name.toLowerCase();
        return a === b || a.startsWith(b) || b.startsWith(a);
      });
      if (brandOpt) setSelectedBrand((prev) => prev || brandOpt.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedPlan?.id, routeCampaign?.id]);

  // Booking mode: the campaign's own facts come from the existing record, and
  // the booking form opens pre-named and pre-dated. An ASSISTED campaign goes
  // further — position preselected and the form already open, so the user
  // checks a filled booking instead of building one.
  React.useEffect(() => {
    if (!routeCampaign) return;
    setCampaignName(routeCampaign.name);
    if (routeCampaign.budget > 0) setBudgetAmount(String(routeCampaign.budget));
    setDateRange({ from: new Date(routeCampaign.startDate), to: new Date(routeCampaign.endDate) });
    setBookingDateRange({ from: new Date(routeCampaign.startDate), to: new Date(routeCampaign.endDate) });
    const existing = db.bookings.filter((b) => b.campaignId === routeCampaign.id).length;
    setBookingName((prev) => prev || `${stripPropositionSuffix(routeCampaign.name)} — Booking ${existing + 1}`);
    // Only a campaign with nothing booked yet opens straight into a new
    // booking form. Once it HAS bookings, the overview is the point: the
    // user picks which proposed booking to check.
    if (routeCampaign.mode === 'assisted' && !creativesOnly && existingBookings.length === 0) {
      const firstChannel = engineChannels[0];
      if (firstChannel) {
        setSelectedChannelIds((prev) => (prev.length ? prev : [firstChannel.id]));
        setBookingPositionIds((prev) => (prev.length ? prev : firstChannel.positions.map((p) => p.id)));
      }
      if (routeCampaign.budget > 0) setBookingBudget((prev) => prev || String(routeCampaign.budget));
      setBookingSubStep((prev) => prev ?? 0);
    }
    // `mode` is a dep because the hydration snapshot (the seed) can resolve
    // the campaign first, without the mode the browser's store carries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCampaign?.id, routeCampaign?.mode]);

  // Approval mode: the booking's own record fills the form. The user is
  // checking a proposal, so every field arrives answered, and the placement
  // opens on the channel the proposed positions belong to.
  React.useEffect(() => {
    if (!routeBooking) return;
    setBookingName(routeBooking.name);
    if (routeBooking.budget > 0) setBookingBudget(String(routeBooking.budget));
    setBookingDateRange({ from: new Date(routeBooking.startDate), to: new Date(routeBooking.endDate) });
    if (routeBooking.positionIds.length > 0) {
      setBookingPositionIds(routeBooking.positionIds);
      const channel = engineChannels.find((ch) => ch.positions.some((p) => routeBooking.positionIds.includes(p.id)));
      if (channel) setSelectedChannelIds([channel.id]);
    }
    setBookingSubStep((prev) => (prev === null ? 0 : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeBooking?.id, engineChannels.length]);

  // Assisted creatives: arrive chosen, not empty — the first creative is
  // staged per booking and the user swaps or clears it.
  React.useEffect(() => {
    if (currentStepId !== 'creatives' || routeCampaign?.mode !== 'assisted') return;
    setCreativeChoice((prev) => {
      const next = { ...prev };
      creativeTargets.forEach((t) => { if (!(t.id in next)) next[t.id] = creativeOptions[0].id; });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId, routeCampaign?.id, routeCampaign?.mode]);

  /**
   * The wizard's result: real records. The campaign (unless it already
   * existed), its bookings, and each booking's creative state — then the
   * detail page of what was just made, because a detail page is the RESULT
   * of a wizard, never the starting point.
   */
  const finishWizard = () => {
    if (creativesOnly) {
      creativeTargets.forEach((t) => {
        if (creativeChoice[t.id]) updateBooking(t.id, { creativeStatus: 'submitted' });
      });
      queueToast({ title: 'Creatives linked', description: `${creativeTargets.filter((t) => creativeChoice[t.id]).length} booking(s) updated` });
      if (typeof window !== 'undefined') {
        window.location.href = afterBooking(routeBooking?.campaignId ?? linkedCampaignId, routeBooking?.id);
      }
      return;
    }
    // Approval mode: the booking already exists — checking it is what makes
    // it real, so saving updates that record and lifts it out of draft.
    if (routeBooking) {
      const b = bookings[0];
      updateBooking(routeBooking.id, {
        status: 'in-option',
        ...(b
          ? {
              name: b.name || routeBooking.name,
              budget: b.budget > 0 ? b.budget : routeBooking.budget,
              startDate: toIso(b.startDate) ?? routeBooking.startDate,
              endDate: toIso(b.endDate) ?? routeBooking.endDate,
              positionIds: b.positionIds.length > 0 ? b.positionIds : routeBooking.positionIds,
              ...(b.creativeId ? { creativeStatus: 'submitted' as const } : {}),
            }
          : {}),
      });
      queueToast({ title: 'Booking approved', description: b?.name || routeBooking.name });
      if (typeof window !== 'undefined') window.location.href = afterBooking(routeBooking.campaignId, routeBooking.id);
      return;
    }
    const fallbackStart = toIso(dateRange?.from) ?? linkedPlan?.startDate ?? new Date().toISOString().slice(0, 10);
    const fallbackEnd = toIso(dateRange?.to) ?? linkedPlan?.endDate ?? fallbackStart;
    const campaignRecord = routeCampaign ?? createCampaign({
      mediaPlanId: linkedPlan?.id ?? '',
      name: campaignName || 'New campaign',
      engine: propositionType as EngineId,
      buyingType,
      retailProductIds: selectedRetailProducts,
      status: 'draft',
      budget: parseFloat(budgetAmount) || 0,
      spend: 0,
      startDate: fallbackStart,
      endDate: fallbackEnd,
    });
    const created = bookings.map((b) => createBooking({
      campaignId: campaignRecord.id,
      name: b.name || `${campaignRecord.name} — Booking`,
      status: 'draft',
      budget: b.budget,
      spend: 0,
      startDate: toIso(b.startDate) ?? campaignRecord.startDate,
      endDate: toIso(b.endDate) ?? campaignRecord.endDate,
      positionIds: b.positionIds,
      creativeStatus: b.creativeId ? 'submitted' : 'missing',
    }));
    // Creatives chosen for bookings that already existed are linked to them.
    existingBookings.forEach((b) => {
      if (creativeChoice[b.id]) updateBooking(b.id, { creativeStatus: 'submitted' });
    });
    queueToast(
      bookingMode
        ? { title: 'Booking created', description: created[0]?.name ?? '' }
        : { title: 'Campaign created', description: campaignRecord.name },
    );
    if (typeof window === 'undefined') return;
    // Where the run came from wins; otherwise the campaign it just filled in.
    window.location.href = bookingMode
      ? afterBooking(campaignRecord.id, created[0]?.id)
      : returnTo ?? `${proposition.campaignRoute}/${campaignRecord.id}`;
  };

  const isCurrentStepComplete = (() => {
    switch (currentStepId) {
      case 'setup': return isSetupComplete;
      case 'advertiser': return isAdvertiserComplete;
      case 'budget': return isBudgetComplete;
      case 'targeting': return isTargetingComplete;
      case 'keywords': return isKeywordsComplete;
      case 'bookings': return bookings.length > 0;
      case 'creatives': return true;
      default: return false;
    }
  })();

  // Step navigation helpers
  const goToNextStep = () => {
    // In review mode, leaving the campaign phase IS approving the campaign:
    // the user has just been through its own steps.
    if (campaignReview && routeCampaign && isLastCampaignStep) {
      updateCampaign(routeCampaign.id, {
        name: campaignName || routeCampaign.name,
        budget: parseFloat(budgetAmount) || routeCampaign.budget,
        ...(toIso(dateRange?.from) ? { startDate: toIso(dateRange?.from) as string } : {}),
        ...(toIso(dateRange?.to) ? { endDate: toIso(dateRange?.to) as string } : {}),
        buyingType,
        ...(routeCampaign.status === 'draft' ? { status: 'in-option' as const } : {}),
      });
    }
    setCurrentStep((prev) => Math.min(prev + 1, wizardSteps.length - 1));
  };
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
      case 'bookings': {
        if (campaignBookingCount === 0) return null;
        const proposed = existingBookings.filter((b) => b.status === 'draft').length;
        return [
          `${campaignBookingCount} booking${campaignBookingCount === 1 ? '' : 's'}`,
          ...(proposed > 0 ? [`${proposed} still to approve`] : []),
        ];
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
      case 'creatives': {
        const linked = creativeTargets.filter((t) => creativeChoice[t.id]).length;
        return linked > 0 ? [`${linked} creative${linked === 1 ? '' : 's'} linked`] : null;
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
                      {/* How the campaign buys is part of what it is — it
                          decides whether the booking's placements carry bids. */}
                      <BuyingTypePicker value={buyingType} onChange={setBuyingType} />
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
                        <SearchSelectList
                          label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                          placeholder="Select product by name or ID…"
                          icon={<ScanBarcode className="w-4 h-4" />}
                          options={retailProducts.map((r) => ({ value: r.id, label: r.name, description: r.id }))}
                          value={selectedRetailProducts}
                          onChange={setSelectedRetailProducts}
                          maxVisibleSelected={5}
                        />
                        <div className="text-xs text-muted-foreground">Search and select retail products to target for this campaign</div>
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
                          <Label>Run time <span className="text-foreground">*</span></Label>
                          <DateRangePicker
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                            placeholder="Select start and end date"
                            showPresets
                            showWeekNumbers
                            events={retailMoments}
                            presets={futureDateRangePresets}
                          />
                          <div className="text-xs text-muted-foreground">
                            Your campaign will automatically start and stop on the selected dates
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bidding-cpc">Bidding (CPC) <span className="text-foreground">*</span></Label>
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
                        {/* Pacing sits with the money it spreads: the daily
                            budget is derived from it, so the two belong to one
                            block rather than two fields that can disagree. */}
                        <BudgetPacing
                          budgetField={
                            <div className="space-y-2">
                              <Label htmlFor="budget-amount">Total budget <span className="text-foreground">*</span></Label>
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
                          }
                          totalBudget={Number(budgetAmount) || undefined}
                          startDate={dateRange?.from}
                          endDate={dateRange?.to}
                          auto={autoPacing}
                          onAutoChange={setAutoPacing}
                          shape={pacingShape}
                          onShapeChange={setPacingShape}
                          dailyBudget={dailyBudget}
                          onDailyBudgetChange={setDailyBudget}
                          overrides={pacingOverrides}
                          onOverridesChange={setPacingOverrides}
                        />
                        <ToggleCard
                          title="Email budget notifications"
                          description="Tells you when a booking caps out early or ends the flight with budget unspent."
                          checked={sendBudgetNotification}
                          onCheckedChange={setSendBudgetNotification}
                        />
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
                            showWeekNumbers
                            events={retailMoments}
                            presets={futureDateRangePresets}
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
                      </div>
                    )}
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={goToPrevStep}>Back</Button>
                      {/* Every step ends with its own primary action, the last
                          one included — the sidebar card echoes it, it does not
                          replace it. */}
                      <Button
                        disabled={hasBookingsPhase ? !isBudgetComplete : false}
                        onClick={hasBookingsPhase ? goToNextStep : () => { const name = campaignName || 'New Campaign'; window.location.href = `${proposition.campaignRoute}?new=${encodeURIComponent(name)}`; }}
                      >
                        {hasBookingsPhase ? 'Continue: Bookings' : 'Launch campaign'}
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
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                        {/* What the campaign already has: a proposed booking
                            still has to be checked, so it says so and offers
                            the run that approves it. */}
                        {existingBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between gap-3 rounded-lg border bg-neutral-50 p-4">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium">{booking.name}</div>
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                {booking.status === 'draft' ? 'Proposed — not approved yet' : 'Approved'}
                                {booking.creativeStatus === 'missing' && ' · needs a creative'}
                              </div>
                            </div>
                            {booking.status === 'draft' ? (
                              <Button
                                size="sm"
                                onClick={() => { if (typeof window !== 'undefined') window.location.href = `/create/${propositionType}?bookingId=${booking.id}${backLink}`; }}
                              >
                                Approve
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => { if (typeof window !== 'undefined') window.location.href = `${proposition.campaignRoute}/booking/${booking.id}`; }}>
                                Open
                              </Button>
                            )}
                          </div>
                        ))}

                        {/* Bookings staged by this run */}
                        {bookings.map((booking, i) => (
                          <div key={booking.id} className="rounded-lg border bg-neutral-50 p-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{booking.name || `Booking ${i + 1}`}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {booking.startDate ? booking.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '–'}
                                {countTargets(booking.inclTargets) + countTargets(booking.exclTargets) > 0 &&
                                  ` · ${countTargets(booking.inclTargets) + countTargets(booking.exclTargets)} targets`}
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
                          <AddInlineLabel className="font-medium">Add booking</AddInlineLabel>
                          <div className="text-xs text-muted-foreground mt-1">Setup, budget &amp; run time, placement and targeting</div>
                        </button>
                        {/* The step's own progression — the sidebar cards stay
                            CTA-free unless they are the active card. */}
                        <div className="flex items-center justify-between gap-3 mt-2">
                          {currentStep > 0 ? (
                            <Button variant="outline" size="sm" onClick={goToPrevStep}>Back</Button>
                          ) : <span />}
                          <Button
                            size="sm"
                            disabled={bookings.length === 0 && existingBookings.length === 0}
                            onClick={finishWizard}
                          >
                            {bookings.length === 0 ? 'Done' : bookingMode ? 'Save booking' : 'Save campaign'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Booking sub-wizard */}
                  {bookingSubStep !== null && (
                    <>
                      {/* Booking setup step */}
                      {/* Step 1: Setup — what this booking is. */}
                      {bookingSubStep === 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Setup</CardTitle>
                            <CardDescription>Name the booking</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label>Booking name <span className="text-foreground">*</span></Label>
                              <Input value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder="Enter booking name" />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                              <Button variant="outline" onClick={() => setBookingSubStep(null)}>Back</Button>
                              <Button onClick={() => setBookingSubStep(1)}>Continue</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 2: Run time & budget — the SAME shared block the
                          booking detail page uses, active days included. */}
                      {bookingSubStep === 1 && (
                        <Card>
                          <CardContent className="space-y-6 p-6">
                            <BookingBudgetRuntime
                              bordered={false}
                              budget={bookingBudget}
                              onBudgetChange={setBookingBudget}
                              startDate={bookingDateRange?.from}
                              endDate={bookingDateRange?.to}
                              onStartDateChange={(d) => setBookingDateRange((r) => (d || r?.to ? { from: d, to: r?.to } : undefined))}
                              onEndDateChange={(d) => setBookingDateRange((r) => (d || r?.from ? { from: r?.from as Date | undefined, to: d } : undefined))}
                              startTime={bookingStartTime}
                              endTime={bookingEndTime}
                              onStartTimeChange={setBookingStartTime}
                              onEndTimeChange={setBookingEndTime}
                              campaignBudget={budgetAmount.trim() !== '' ? `€${Number(budgetAmount).toLocaleString()}` : undefined}
                              activeDays={canScheduleDays ? activeDays : undefined}
                              onActiveDaysChange={canScheduleDays ? setActiveDays : undefined}
                              // Pacing belongs with the budget it spreads, in
                              // the same place sponsored products puts it. Only
                              // auction campaigns have a pacing decision to
                              // make — guaranteed buys a fixed delivery.
                              pacing={isAuction ? (budgetField) => (
                                <BudgetPacing
                                  budgetField={budgetField}
                                  totalBudget={Number(bookingBudget) || undefined}
                                  startDate={bookingDateRange?.from}
                                  endDate={bookingDateRange?.to}
                                  auto={autoPacing}
                                  onAutoChange={setAutoPacing}
                                  shape={pacingShape}
                                  onShapeChange={setPacingShape}
                                  shapes={['account', 'even', 'frontloaded', 'asap']}
                                  dailyBudget={dailyBudget}
                                  onDailyBudgetChange={setDailyBudget}
                                  overrides={pacingOverrides}
                                  onOverridesChange={setPacingOverrides}
                                />
                              ) : undefined}
                            />
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setBookingSubStep(0)}>Back</Button>
                              <Button onClick={() => setBookingSubStep(2)}>Continue</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 3: Placement — the SAME "Create placement" block
                          the booking detail page uses: find the channel, get
                          everything in it, trim ad positions in the modal.
                          Auction campaigns bid per position in that modal. */}
                      {bookingSubStep === 2 && (
                        <Card>
                          <CardContent className="space-y-6 p-6">
                            <FormSection title="Create placement">
                              <CreatePlacement
                                mediaProducts={engineChannels.map((ch) => ({
                                  value: ch.id,
                                  label: ch.name,
                                  description: `${ch.positions.length} ad position${ch.positions.length === 1 ? '' : 's'}`,
                                }))}
                                positions={(engineChannels.find((c) => c.id === selectedChannelIds[0])?.positions ?? []).map((p) => ({
                                  value: p.id,
                                  label: p.name,
                                  format: p.format,
                                  description: `${p.dailyCapacity}/day`,
                                }))}
                                mediaProduct={selectedChannelIds}
                                onMediaProductChange={(v) => {
                                  setSelectedChannelIds(v);
                                  setBookingPositionIds([]);
                                  setPositionBids({});
                                }}
                                positionsValue={bookingPositionIds}
                                onPositionsChange={setBookingPositionIds}
                                productLabel="Find channel"
                                {...(isAuction ? {
                                  bids: positionBids,
                                  onBidChange: (id: string, v: string) => setPositionBids((prev) => ({ ...prev, [id]: v })),
                                  suggestedBid,
                                } : {})}
                              />
                            </FormSection>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setBookingSubStep(1)}>Back</Button>
                              <Button onClick={() => setBookingSubStep(3)}>Continue</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 5: Creative — the booking's own last question,
                          answered from the advertiser's library. A table,
                          because a creative is chosen on its details: the
                          format the placement expects, its size, and whether
                          it has cleared approval. */}
                      {hasCreativeStep && bookingSubStep === 4 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Creative</CardTitle>
                            <CardDescription>Pick the creative this booking runs — or leave it, and the setup checklist keeps it open.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Table
                              columns={[
                                {
                                  key: 'pick',
                                  header: '',
                                  className: 'w-10',
                                  render: (row) => (
                                    <Checkbox
                                      checked={bookingCreativeId === row.id}
                                      onCheckedChange={() => setBookingCreativeId((prev) => (prev === row.id ? '' : row.id))}
                                      aria-label={`Use ${row.name}`}
                                    />
                                  ),
                                },
                                { key: 'name', header: 'Creative' },
                                { key: 'format', header: 'Format' },
                                { key: 'size', header: 'Size', render: (row) => <span className="tabular-nums text-muted-foreground">{row.size}</span> },
                                {
                                  key: 'status',
                                  header: 'Status',
                                  render: (row) => <Badge variant={row.status === 'Approved' ? 'secondary' : 'outline'}>{row.status}</Badge>,
                                },
                                { key: 'updated', header: 'Updated', render: (row) => <span className="text-muted-foreground">{row.updated}</span> },
                              ]}
                              data={creativesForEngine(propositionType)}
                              rowKey={(row) => row.id}
                              hideActions
                              onRowClick={(row) => setBookingCreativeId((prev) => (prev === row.id ? '' : row.id))}
                              emptyState={<span className="text-sm text-muted-foreground">No creatives in the library for this proposition yet.</span>}
                            />
                            <p className="text-xs text-muted-foreground">
                              {bookingCreativeId
                                ? 'Submitted for approval when the booking is saved.'
                                : 'No creative yet — the booking cannot go live without one.'}
                            </p>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setBookingSubStep(3)}>Back</Button>
                              <Button onClick={saveBooking}>{routeBooking ? 'Save booking' : 'Create booking'}</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Step 4: Targeting — who this booking reaches. For
                          display, delivery behaviour and delivery objectives
                          are part of targeting too. */}
                      {bookingSubStep === 3 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Targeting</CardTitle>
                            <CardDescription>Set inclusive or exclusive targeting rules for this booking</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              {/* Include and exclude are two lists, not a mode
                                  the user has to notice they are in — the same
                                  control as the booking detail page. */}
                              {([
                                { key: 'include', label: 'Include', hint: 'The booking shows to shoppers matching these targets.', targets: inclTargets, setTargets: setInclTargets },
                                { key: 'exclude', label: 'Exclude', hint: 'Never shown to shoppers matching these targets.', targets: exclTargets, setTargets: setExclTargets },
                              ] as const).map((mode) => (
                                <div key={mode.key} className="space-y-2">
                                  <Label className="block">{mode.label}</Label>
                                  <p className="-mt-1 text-xs text-muted-foreground">{mode.hint}</p>
                                  <TargetSelect
                                    groups={onlineTargetGroups}
                                    value={mode.targets}
                                    onChange={mode.setTargets}
                                    placeholder="Add a target group — keyword, category, city…"
                                  />
                                </div>
                              ))}
                            </div>
                            {isDisplay && (
                              <div className="space-y-3">
                                <Label className="text-sm font-semibold">Delivery behavior</Label>
                                <DeliveryBehaviorFields value={deliveryBehavior} onChange={setDeliveryBehavior} />
                              </div>
                            )}
                            {isDisplay && (
                              <ToggleSection
                                bordered={false}
                                title="Delivery objectives"
                                info={DELIVERY_OBJECTIVES_INFO}
                                offSummary={DELIVERY_OBJECTIVES_OFF}
                                checked={objectivesEnabled}
                                onCheckedChange={setObjectivesEnabled}
                              >
                                <DeliveryObjectivesFields value={deliveryObjectives} onChange={setDeliveryObjectives} />
                              </ToggleSection>
                            )}
                            <div className="flex justify-end gap-3 mt-4">
                              <Button variant="outline" onClick={() => setBookingSubStep(2)}>Back</Button>
                              {hasCreativeStep ? (
                                <Button onClick={() => setBookingSubStep(4)}>Continue</Button>
                              ) : (
                                <Button onClick={saveBooking}>{routeBooking ? 'Save booking' : 'Create booking'}</Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Step: Creatives — the last step of every proposition except
                  sponsored products. Each booking either links a creative now
                  or explicitly leaves it for later; nothing here blocks
                  finishing, but "later" stays visible as the campaign's
                  remaining setup. */}
              {currentStepId === 'creatives' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Creatives</CardTitle>
                    <CardDescription>
                      Link a creative to each booking, or add them later — a booking cannot go live without one.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {creativeTargets.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        {creativesOnly ? 'Every booking on this campaign already has a creative.' : 'No bookings yet — go back and add one first.'}
                      </p>
                    )}
                    {creativeTargets.map((t) => (
                      <div key={t.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <ImagePlus className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{t.name}</span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {creativeOptions.map((c) => {
                            const picked = creativeChoice[t.id] === c.id;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setCreativeChoice(prev => ({ ...prev, [t.id]: picked ? '' : c.id }))}
                                className={cn(
                                  'flex items-center gap-2 rounded-md border p-3 text-left text-sm transition-colors',
                                  picked ? 'border-surface-selected-border bg-surface-selected font-medium' : 'border-border bg-background hover:bg-surface-hover',
                                )}
                              >
                                {picked ? <Check className="h-4 w-4 shrink-0" /> : <ImagePlus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                                {c.name}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {creativeChoice[t.id] ? 'Submitted for approval when you finish.' : 'No creative yet — the setup checklist will keep this open.'}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1">
                      {currentStep > 0 ? (
                        <Button variant="outline" onClick={goToPrevStep}>Back</Button>
                      ) : <span />}
                      <Button onClick={finishWizard}>
                        {creativesOnly ? 'Save creatives' : routeBooking ? 'Approve booking' : bookingMode ? 'Save booking' : 'Save campaign'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Summary sidebar */}
            <div className="flex flex-col gap-4">
              {/* New booking card — shown while actively creating a booking */}
              {isInBookingsPhase && bookingSubStep !== null && (() => {
                const getLiveBookingStepValues = (stepIndex: number): string[] | null => {
                  switch (stepIndex) {
                    case 0: { // Setup
                      return bookingName.trim() ? [bookingName] : null;
                    }
                    case 1: { // Run time & budget
                      const vals: string[] = [];
                      if (bookingBudget.trim()) vals.push(`€${Number(bookingBudget).toLocaleString()}`);
                      if (bookingDateRange?.from) vals.push(`${bookingDateRange.from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${bookingStartTime}${bookingDateRange.to ? ` – ${bookingDateRange.to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${bookingEndTime}` : ''}`);
                      if (activeDays.length < 7) vals.push(activeDays.join(', '));
                      return vals.length > 0 ? vals : null;
                    }
                    case 2: { // Placement
                      const vals: string[] = [];
                      if (bookingPositionIds.length > 0) vals.push(`${bookingPositionIds.length} position${bookingPositionIds.length === 1 ? '' : 's'}`);
                      const bidCount = Object.values(positionBids).filter(Boolean).length;
                      if (bidCount > 0) vals.push(`${bidCount} bid${bidCount === 1 ? '' : 's'} set`);
                      return vals.length > 0 ? vals : null;
                    }
                    case 3: { // Targeting (incl. delivery for display)
                      const vals: string[] = [];
                      if (countTargets(inclTargets) > 0) vals.push(`${countTargets(inclTargets)} included`);
                      if (countTargets(exclTargets) > 0) vals.push(`${countTargets(exclTargets)} excluded`);
                      if (deliveryBehavior.optimizeForCPC) vals.push('Optimise for CPC');
                      if (deliveryBehavior.userFrequencyCap) vals.push('Frequency cap on');
                      if (deliveryBehavior.exclusivity) vals.push('Exclusivity on');
                      if (objectivesEnabled) vals.push('Delivery objectives set');
                      return vals.length > 0 ? vals : null;
                    }
                    case 4: { // Creative
                      const c = creativesForEngine(propositionType).find((x) => x.id === bookingCreativeId);
                      return c ? [c.name] : null;
                    }
                    default: return null;
                  }
                };
                return (
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>{routeBooking ? 'Booking' : 'New booking'}</CardSummaryTitle>
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
                        {/* Staging, not committing — approval mode commits on
                            the wizard's own save, one step further. */}
                        <Button className="w-full" onClick={saveBooking}>{routeBooking ? 'Save booking' : 'Create booking'}</Button>
                      </div>
                    )}
                  </CardSummary>
                );
              })()}

              {/* Saved booking cards — one per booking */}
              {isInBookingsPhase && bookings.map((booking, index) => {
                const getBookingStepValues = (stepIndex: number): string[] | null => {
                  switch (stepIndex) {
                    case 0: { // Setup
                      return booking.name ? [booking.name] : null;
                    }
                    case 1: { // Run time & budget
                      const vals: string[] = [];
                      if (booking.budget > 0) vals.push(`€${booking.budget.toLocaleString()}`);
                      if (booking.startDate) vals.push(`${booking.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${booking.startTime}${booking.endDate ? ` – ${booking.endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${booking.endTime}` : ''}`);
                      if (booking.activeDays.length < 7) vals.push(`${booking.activeDays.join(', ')}`);
                      return vals.length > 0 ? vals : null;
                    }
                    case 2: { // Placement
                      const vals: string[] = [];
                      if (booking.positionIds.length > 0) vals.push(`${booking.positionIds.length} position${booking.positionIds.length === 1 ? '' : 's'}`);
                      const bidCount = Object.values(booking.bids).filter(Boolean).length;
                      if (bidCount > 0) vals.push(`${bidCount} bid${bidCount === 1 ? '' : 's'} set`);
                      return vals.length > 0 ? vals : null;
                    }
                    case 3: { // Targeting (incl. delivery for display)
                      const vals: string[] = [];
                      if (countTargets(booking.inclTargets) > 0) vals.push(`${countTargets(booking.inclTargets)} included`);
                      if (countTargets(booking.exclTargets) > 0) vals.push(`${countTargets(booking.exclTargets)} excluded`);
                      if (booking.deliveryBehavior.optimizeForCPC) vals.push('Optimise for CPC');
                      if (booking.deliveryBehavior.userFrequencyCap) vals.push('Frequency cap on');
                      if (booking.deliveryBehavior.exclusivity) vals.push('Exclusivity on');
                      if (booking.objectivesEnabled) vals.push('Delivery objectives set');
                      return vals.length > 0 ? vals : null;
                    }
                    case 4: { // Creative
                      const c = creativesForEngine(propositionType).find((x) => x.id === booking.creativeId);
                      return c ? [c.name] : null;
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

              {/* Campaign summary card — always at the bottom. A booking is
                  never campaign-less: in booking mode the existing campaign
                  (and its media plan) render as the shared SummaryCard, with
                  the entity icon and left-aligned details — and NO call to
                  action, because only the active card carries one. */}
              {/* A campaign whose steps are done — an existing one in booking
                  mode, or the one just set up once the flow moves on to its
                  bookings — is no longer the active card: it steps back into
                  the collapsed context card on the page background, so only
                  one timeline (the booking's) is ever active. */}
              {!campaignStepsActive ? (() => {
                const facts = routeCampaign
                  ? {
                      name: stripPropositionSuffix(routeCampaign.name),
                      budget: routeCampaign.budget,
                      start: new Date(routeCampaign.startDate),
                      end: new Date(routeCampaign.endDate),
                      type: routeCampaign.buyingType ?? 'auction',
                    }
                  : {
                      name: campaignName || 'New campaign',
                      budget: parseFloat(budgetAmount) || 0,
                      start: dateRange?.from,
                      end: dateRange?.to,
                      type: buyingType,
                    };
                return (
                  <>
                  <SummaryCard
                    title={`${proposition.name} campaign`}
                    entity="campaign"
                    variant="details"
                    collapsible={bookingSubStep !== null}
                    className="bg-page"
                    headerAction={{
                      icon: LinkActionIcon,
                      label: 'Change linked campaign',
                      onClick: () => setLinkingCampaign(true),
                    }}
                    items={[
                      { label: 'Campaign name', value: facts.name },
                      { label: 'Budget', value: facts.budget > 0 ? `€${facts.budget.toLocaleString()}` : '—' },
                      { label: 'Run time', value: facts.start && facts.end ? `${formatDate(facts.start)} – ${formatDate(facts.end)}` : '—' },
                      { label: 'Campaign type', value: facts.type === 'guaranteed' ? 'Guaranteed' : 'Auction' },
                      { label: 'Bookings', value: campaignBookingCount === 0 ? 'None yet' : `${campaignBookingCount} booking${campaignBookingCount === 1 ? '' : 's'}` },
                    ]}
                  />
                  <LinkPickerDialog
                    open={linkingCampaign}
                    onOpenChange={setLinkingCampaign}
                    entityLabel="campaign"
                    // A booking always belongs to a campaign; while one is
                    // being created here, "none" means this new one.
                    allowNone={!bookingMode}
                    noneLabel="This new campaign"
                    options={db.campaigns
                      .filter((c) => c.engine === propositionType)
                      .map((c) => ({
                        value: c.id,
                        label: stripPropositionSuffix(c.name),
                        details: {
                          'Media plan': db.mediaPlans.find((mp) => mp.id === c.mediaPlanId)?.name ?? '—',
                          Budget: c.budget > 0 ? `€${c.budget.toLocaleString()}` : '—',
                          Status: c.status,
                        },
                      }))}
                    value={linkedCampaignId}
                    onChange={(v) => setLinkedCampaignId(v || undefined)}
                  />
                  </>
                );
              })() : (
              <SummaryCard
                title={`${proposition.name} campaign`}
                entity="campaign"
                variant="process"
                steps={displayCampaignSteps.map((step, index) => {
                  const status = isInBookingsPhase ? 'completed' as const : getStepStatus(index);
                  const stepValues = getStepValues(step.id);
                  return {
                    id: step.id,
                    label: step.label,
                    status,
                    values: stepValues ? (Array.isArray(stepValues) ? stepValues : [stepValues]) : undefined,
                    onClick: status === 'completed' && !isInBookingsPhase ? () => goToStepById(step.id) : undefined,
                  };
                })}
                // Only the ACTIVE card carries a call to action, and only for
                // the NEXT step: during the campaign phase this card is the
                // active one, so it hands over to Bookings. In the booking and
                // creative phases the progression lives in the main content.
                actions={!isInBookingsPhase && isLastCampaignStep ? [{
                  label: hasBookingsPhase ? 'Continue: Bookings' : 'Launch campaign',
                  disabled: hasBookingsPhase ? !isCurrentStepComplete : false,
                  onClick: hasBookingsPhase ? goToNextStep : () => { const name = campaignName || 'New Campaign'; window.location.href = `${proposition.campaignRoute}?new=${encodeURIComponent(name)}`; },
                }] : undefined}
              />
              )}

              {/* The media plan this campaign hangs under — last in the
                  hierarchy, always present: an empty card when nothing is
                  linked, the plan's name and budget when one is. */}
              <SummaryCard
                title="Media plan"
                entity="media-plan"
                variant="details"
                collapsible
                className="bg-page"
                headerAction={{
                  icon: LinkActionIcon,
                  label: linkedPlan ? 'Change linked media plan' : 'Link a media plan',
                  onClick: () => setLinkingMediaPlan(true),
                }}
                items={linkedPlan ? [
                  { label: 'Media plan', value: linkedPlan.name },
                  { label: 'Total budget', value: `€${linkedPlan.budget.toLocaleString()}` },
                ] : undefined}
                empty={linkedPlan ? undefined : 'No media plan linked'}
              />
              <LinkPickerDialog
                open={linkingMediaPlan}
                onOpenChange={setLinkingMediaPlan}
                entityLabel="media plan"
                allowNone
                noneLabel="No media plan"
                options={db.mediaPlans.map((mp) => ({
                  value: mp.id,
                  label: mp.name,
                  details: {
                    Advertiser: db.advertisers.find((a) => a.id === mp.advertiserId)?.name ?? '—',
                    Budget: `€${mp.budget.toLocaleString()}`,
                  },
                }))}
                value={linkedPlanId}
                onChange={(v) => setLinkedPlanId(v || undefined)}
              />
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
              className="ml-1 rounded-full p-0.5 hover:bg-neutral-200"
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
  /** Enter at the booking step: the campaign fields above describe an
   *  existing campaign a booking is being added to, not one being made. */
  startAtBooking?: boolean;
  /** The existing campaign's id, so the booking links to it rather than to a
   *  slug derived from its name. A real db id implies startAtBooking. */
  campaignId?: string;
  /** Approval mode: an existing, prefilled booking to check and approve. */
  bookingId?: string;
  /** Where the run started — the media plan or the campaign — to hand back to. */
  returnTo?: string;
  /** Create the campaign inside this media plan. */
  planId?: string;
}

export const SimplifiedSPWizard = ({ initialValues }: { initialValues?: SPWizardInitialValues } = {}) => {
  const { theme: storybookTheme } = useStorybookTheme();
  const currentTheme = storybookTheme || 'retailMedia';
  const routes = getRoutesForTheme(currentTheme);
  const proposition = propositionConfigs['sponsored-products'];

  // The prototype database: campaign/plan context is read from it, and
  // finishing the wizard writes the campaign and booking into it.
  const spDb = useDb();
  // Approval mode: the prefilled booking, and the campaign it belongs to.
  const routeBooking = initialValues?.bookingId
    ? spDb.bookings.find((b) => b.id === initialValues.bookingId)
    : undefined;
  const campaignIdForBooking = initialValues?.campaignId ?? routeBooking?.campaignId;
  const routeCampaign = campaignIdForBooking
    ? spDb.campaigns.find((c) => c.id === campaignIdForBooking)
    : undefined;
  const linkedPlan = initialValues?.planId
    ? spDb.mediaPlans.find((p) => p.id === initialValues.planId)
    : routeCampaign
      ? spDb.mediaPlans.find((p) => p.id === routeCampaign.mediaPlanId)
      : undefined;

  const wizardSteps = [
    { id: 'campaign-details', label: 'Campaign details' },
    { id: 'booking', label: 'Booking' },
  ];

  // "Add booking" on an existing campaign lands here mid-flow: the campaign
  // step is already done by definition, so the wizard opens on the booking.
  const startAtBooking = Boolean(
    routeCampaign || routeBooking || (initialValues?.startAtBooking && initialValues?.campaignName),
  );
  const [currentStep, setCurrentStep] = React.useState(startAtBooking ? 1 : 0);
  // The campaign's three questions, one card each: what it is (name and how
  // it buys), who it is for, and what it may spend and when.
  const campaignSubStepLabels = ['Setup', 'Advertiser', 'Run time & budget'];
  const [campaignSubStep, setCampaignSubStep] = React.useState(0);
  const [spBrand, setSpBrand] = React.useState('');
  const [spPoNumber, setSpPoNumber] = React.useState('');
  const [spRetailProducts, setSpRetailProducts] = React.useState<string[]>([]);
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
    // A real plan from the database outranks the demo options — the campaign
    // is being created inside it.
    if (linkedPlan) {
      return [
        {
          label: linkedPlan.name,
          value: `db-${linkedPlan.id}`,
          budget: `€${linkedPlan.budget.toLocaleString()}`,
          startDate: linkedPlan.startDate,
          endDate: linkedPlan.endDate,
          status: linkedPlan.status,
        },
        ...mediaPlanOptions,
      ];
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedPlan?.id, initialValues?.mediaPlanLabel, initialValues?.mediaPlanAdvertiser, initialValues?.mediaPlanBudget, initialValues?.mediaPlanStartDate, initialValues?.mediaPlanEndDate, initialValues?.mediaPlanStatus]);

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
  const [budget, setBudget] = React.useState(initialValues?.budget ?? '');
  // Auction bids per keyword/category/placement live on their cards in the
  // placements step; guaranteed campaigns show none. Booking mode inherits
  // the answer from the existing campaign.
  const [spBuyingType, setSpBuyingType] = React.useState<'auction' | 'guaranteed'>('auction');
  const spIsAuction = (routeCampaign?.buyingType ?? spBuyingType) !== 'guaranteed';
  const [selectedAdvertiser, setSelectedAdvertiser] = React.useState(resolvedAdvertiserValue);
  const [selectedMediaPlanV2, setSelectedMediaPlanV2] = React.useState(resolvedMediaPlanValue);
  const [startDate, setStartDate] = React.useState<Date | undefined>(initialValues?.startDate);
  const [endDate, setEndDate] = React.useState<Date | undefined>(initialValues?.endDate);

  // Context from the database, seeded after mount (never during render, so
  // server and client HTML agree): the plan the campaign is created in
  // answers name, run time, budget share and advertiser — those questions are
  // not asked again, only shown for checking.
  React.useEffect(() => {
    if (!linkedPlan) return;
    setSelectedMediaPlanV2(`db-${linkedPlan.id}`);
    if (routeCampaign) return; // booking mode seeds from the campaign instead
    setCampaignName((prev) => prev || linkedPlan.name);
    setStartDate((prev) => prev ?? new Date(linkedPlan.startDate));
    setEndDate((prev) => prev ?? new Date(linkedPlan.endDate));
    const siblings = spDb.campaigns.filter((c) => c.mediaPlanId === linkedPlan.id);
    const unallocated = Math.max(linkedPlan.budget - siblings.reduce((s, c) => s + c.budget, 0), 0);
    if (unallocated > 0) setBudget((prev) => prev || String(unallocated));
    const adv = spDb.advertisers.find((a) => a.id === linkedPlan.advertiserId);
    const advOpt = adv && advertiserOptions.find((o) => o.label.toLowerCase() === adv.name.toLowerCase());
    if (advOpt) setSelectedAdvertiser((prev) => prev || advOpt.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedPlan?.id, routeCampaign?.id]);

  // ── Step 2: Booking ──
  // Sub-step within booking: 0 = Setup, 1 = Placements
  const [bookingSubStep, setBookingSubStep] = React.useState(0);
  // General information card
  const [bookingCampaignName, setBookingCampaignName] = React.useState('');
  const [selectedCampaign, setSelectedCampaign] = React.useState(
    startAtBooking ? (initialValues?.campaignId ?? 'existing-campaign') : '',
  );
  const [bookingStartDate, setBookingStartDate] = React.useState<Date | undefined>(
    startAtBooking ? initialValues?.startDate : undefined,
  );
  const [bookingEndDate, setBookingEndDate] = React.useState<Date | undefined>(
    startAtBooking ? initialValues?.endDate : undefined,
  );
  // Budget card. The CPC is NOT here — on auction campaigns each selected
  // keyword, category and placement carries its own bid on its card.
  const [totalBudget, setTotalBudget] = React.useState(startAtBooking ? (initialValues?.budget ?? '') : '');
  const [dailyBudget, setDailyBudget] = React.useState('');
  const [autoPacing, setAutoPacing] = React.useState(false);
  const [pacingShape, setPacingShape] = React.useState<PacingShape>('even');
  const [pacingOverrides, setPacingOverrides] = React.useState<PacingOverride[]>([]);
  const [spBids, setSpBids] = React.useState<Record<string, string>>({});
  const [sendBudgetNotification, setSendBudgetNotification] = React.useState(false);
  // Targeting — the same target-group control as everywhere, but sponsored
  // products only targets its local brands: one group, no include/exclude
  // split, and every brand selected until the user trims.
  const [spTargets, setSpTargets] = React.useState<Record<string, string[]>>({
    'local-brands': localBrands.map((b) => b.label),
  });

  // Booking mode against a real campaign: its facts prefill the form and the
  // flow opens on the booking step. Runs post-mount because the campaign may
  // only exist in this browser's store, which the server render cannot see.
  React.useEffect(() => {
    if (!routeCampaign) return;
    setCampaignName(routeCampaign.name);
    if (routeCampaign.budget > 0) setBudget(String(routeCampaign.budget));
    setStartDate(new Date(routeCampaign.startDate));
    setEndDate(new Date(routeCampaign.endDate));
    setSelectedCampaign(routeCampaign.id);
    setBookingStartDate(new Date(routeCampaign.startDate));
    setBookingEndDate(new Date(routeCampaign.endDate));
    if (routeCampaign.budget > 0) setTotalBudget((prev) => prev || String(routeCampaign.budget));
    const existing = spDb.bookings.filter((b) => b.campaignId === routeCampaign.id).length;
    setBookingCampaignName((prev) => prev || `${stripPropositionSuffix(routeCampaign.name)} — Booking ${existing + 1}`);
    // An assisted campaign fills the whole booking — daily pace from the run
    // time, and the suggested bid accepted on every default placement — so
    // the form only needs checking.
    if (routeCampaign.mode === 'assisted' && routeCampaign.budget > 0) {
      const days = Math.max(1, Math.round((new Date(routeCampaign.endDate).getTime() - new Date(routeCampaign.startDate).getTime()) / 86400000) + 1);
      setDailyBudget((prev) => prev || String(Math.max(1, Math.round(routeCampaign.budget / days))));
      setSpBids((prev) => Object.keys(prev).length ? prev
        : Object.fromEntries([...keywords, ...spaLocations].map((k) => [k, suggestedBid(k)])));
    }
    setCurrentStep(1);
    // `mode` is a dep because the hydration snapshot (the seed) can resolve
    // the campaign first, without the mode the browser's store carries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCampaign?.id, routeCampaign?.mode]);
  // Placements (sub-step 2)
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [spaLocations, setSpaLocations] = React.useState<string[]>(['loc-pdp']);

  // Catalogues for the placements step. Descriptions carry the detail the
  // production form shows beside each option.
  const spProductOptions = [
    { value: 'prod-001', label: 'Heineken 6-pack 330ml', description: 'HNK-330-6PK · Beer' },
    { value: 'prod-002', label: 'Heineken 0.0 6-pack 330ml', description: 'HNK-00-330-6PK · Beer – alcohol free' },
    { value: 'prod-003', label: 'Heineken Silver 6-pack 330ml', description: 'HNK-SLV-330-6PK · Beer' },
    { value: 'prod-004', label: 'Heineken 24-pack 330ml', description: 'HNK-330-24PK · Beer' },
    { value: 'prod-005', label: 'Heineken 1L bottle', description: 'HNK-1L-BTL · Beer' },
  ];
  const spLocationOptions = [
    { value: 'loc-pdp', label: 'Product detail page', description: 'Sponsored slots beneath the product' },
    { value: 'loc-order', label: 'Order confirmation page', description: 'After checkout completes' },
    { value: 'loc-past', label: 'Past purchases', description: 'In the reorder list' },
    { value: 'loc-basket', label: 'Basket page', description: 'Alongside the basket contents' },
  ];
  const [keywordInput, setKeywordInput] = React.useState('');
  const [keywords, setKeywords] = React.useState<string[]>(['summer sale', 'beverages', 'snacks']);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  // Completion checks
  // The campaign already said which retail products it advertises (or the
  // user picked them a step ago), so a booking under it starts from those
  // instead of an empty list.
  React.useEffect(() => {
    const inherited = routeCampaign?.retailProductIds?.length ? routeCampaign.retailProductIds : spRetailProducts;
    if (inherited.length === 0) return;
    setSelectedProducts((prev) => (prev.length ? prev : inherited));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCampaign?.id, spRetailProducts.join(',')]);

  // Approval mode: the booking arrives answered — the user is checking it.
  React.useEffect(() => {
    if (!routeBooking) return;
    setBookingCampaignName(routeBooking.name);
    if (routeBooking.budget > 0) setTotalBudget(String(routeBooking.budget));
    setBookingStartDate(new Date(routeBooking.startDate));
    setBookingEndDate(new Date(routeBooking.endDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeBooking?.id]);

  const campaignMissing = [
    !campaignName.trim() && 'campaign name',
    !selectedAdvertiser && 'advertiser',
    !budget.trim() && 'budget',
    !startDate && 'run time',
  ].filter(Boolean) as string[];
  const isCampaignDetailsComplete = campaignMissing.length === 0;

  /**
   * A campaign being built has no performance yet, so the metric row carries
   * the forecast instead: what the budget buys at the bid being asked for.
   * Same row, same place — it fills in as the form does.
   */
  const spForecastMetrics = (() => {
    const dash = '—';
    const total = parseFloat(totalBudget || budget) || 0;
    // Auction: the blended bid across the placements' own CPCs. Guaranteed
    // buys at a fixed rate, so the estimate uses the standard €0.50.
    const bidValues = Object.values(spBids).map((v) => parseFloat(v)).filter((n) => n > 0);
    const cpc = spIsAuction
      ? (bidValues.length ? bidValues.reduce((a, b) => a + b, 0) / bidValues.length : 0)
      : 0.5;
    // Before the booking exists the campaign's own run time is the span.
    const from = bookingStartDate ?? startDate;
    const to = bookingEndDate ?? endDate;
    const days = from && to
      ? Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1)
      : 0;
    const clicks = cpc > 0 ? Math.round(total / cpc) : 0;
    // A wider keyword set converts a little better; enough to move with the form.
    const conversionRate = 0.04 + Math.min(keywords.length, 20) * 0.001;
    const orders = Math.round(clicks * conversionRate);
    const sales = orders * 18;
    return [
      {
        key: 'budget',
        label: 'Budget',
        value: total > 0 ? `€${total.toLocaleString()}` : dash,
        subMetric: total > 0
          ? (days > 0 ? `€${Math.round(total / days)}/day over ${days} days` : 'No run time set')
          : 'No budget set',
      },
      {
        key: 'clicks',
        label: 'Est. clicks',
        value: clicks > 0 ? clicks.toLocaleString() : dash,
        subMetric: cpc > 0 ? `At €${cpc.toFixed(2)} CPC` : 'Set a bid to calculate',
      },
      {
        key: 'sales',
        label: 'Est. sales',
        value: sales > 0 ? `€${sales.toLocaleString()}` : dash,
        subMetric: orders > 0 ? `${orders.toLocaleString()} orders` : 'Set budget and bid',
      },
      {
        key: 'roas',
        label: 'Est. ROAS',
        value: sales > 0 && total > 0 ? `${(sales / total).toFixed(1)}x` : dash,
        subMetric: keywords.length > 0 ? `${keywords.length} keywords targeted` : 'Add keywords to lift this',
      },
    ];
  })();

  // Relinking happens from the summary cards, not from a field in the form.
  const [linkingMediaPlan, setLinkingMediaPlan] = React.useState(false);
  const [linkingCampaign, setLinkingCampaign] = React.useState(false);

  /** Creating the campaign hands its details down to the booking step. */
  const createCampaignAndContinue = () => {
    const key = 'new-' + campaignName.toLowerCase().replace(/[\s–—]+/g, '-').replace(/[^a-z0-9-]/g, '');
    setSelectedCampaign(key);
    setBookingCampaignName('');
    if (startDate) setBookingStartDate(startDate);
    if (endDate) setBookingEndDate(endDate);
    if (budget.trim()) setTotalBudget(budget);
    setCurrentStep(1);
  };

  // What is still missing, by name. A disabled Next with no explanation is
  // the same as a broken Next — the user cannot tell which it is.
  const bookingMissing = [
    !selectedCampaign.trim() && 'campaign',
    !bookingCampaignName.trim() && 'booking name',
    !bookingStartDate && 'run time',
    !totalBudget.trim() && 'total budget',
    !dailyBudget.trim() && 'daily budget',
  ].filter(Boolean) as string[];
  const isBookingComplete = bookingMissing.length === 0;

  // Build campaign options for booking step — the just-created campaign appears first
  const campaignOptionsForBooking = React.useMemo(() => {
    // Entered from an existing campaign, that campaign IS the list — the
    // booking must not silently attach to a demo option.
    if (startAtBooking) {
      return [{
        label: routeCampaign?.name ?? initialValues?.campaignName ?? 'Campaign',
        value: routeCampaign?.id ?? initialValues?.campaignId ?? 'existing-campaign',
      }];
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignName, startAtBooking, routeCampaign?.id, initialValues?.campaignName, initialValues?.campaignId]);

  /**
   * The wizard's result: a real campaign (unless it already existed) and a
   * real booking, written to the store — then the campaign's detail page,
   * where sponsored-products bookings live. SP has no creative step: the
   * product listing is the ad, so the booking arrives creative-complete.
   */
  const finishSPWizard = () => {
    const iso = (d?: Date) => (d ? d.toISOString().slice(0, 10) : undefined);
    // Approval mode: the prefilled booking is updated and lifted out of
    // draft, not duplicated.
    if (routeBooking) {
      updateBooking(routeBooking.id, {
        status: 'in-option',
        name: bookingCampaignName || routeBooking.name,
        budget: parseFloat(totalBudget) || routeBooking.budget,
        startDate: iso(bookingStartDate) ?? routeBooking.startDate,
        endDate: iso(bookingEndDate) ?? routeBooking.endDate,
        positionIds: [...selectedProducts, ...keywords, ...selectedCategories, ...spaLocations],
      });
      queueToast({ title: 'Booking approved', description: bookingCampaignName || routeBooking.name });
      if (typeof window !== 'undefined') {
        // Another proposed booking on the same campaign continues the run.
        const fresh = getDb();
        const nextDraft = fresh.bookings.find((b) => b.campaignId === routeBooking.campaignId && b.id !== routeBooking.id && b.status === 'draft');
        window.location.href = nextDraft
          ? `/create/sponsored-products?bookingId=${nextDraft.id}${initialValues?.returnTo ? `&returnTo=${encodeURIComponent(initialValues.returnTo)}` : ''}`
          : initialValues?.returnTo ?? `${proposition.campaignRoute}/${routeBooking.campaignId}`;
      }
      return;
    }
    const fallbackStart = iso(startDate) ?? linkedPlan?.startDate ?? new Date().toISOString().slice(0, 10);
    const fallbackEnd = iso(endDate) ?? linkedPlan?.endDate ?? fallbackStart;
    const campaignRecord = routeCampaign ?? createCampaign({
      mediaPlanId: linkedPlan?.id ?? '',
      name: campaignName || 'New campaign',
      engine: 'sponsored-products',
      buyingType: spBuyingType,
      retailProductIds: spRetailProducts,
      status: 'draft',
      budget: parseFloat(budget) || 0,
      spend: 0,
      startDate: fallbackStart,
      endDate: fallbackEnd,
    });
    createBooking({
      campaignId: campaignRecord.id,
      name: bookingCampaignName || `${campaignRecord.name} — Booking`,
      status: 'draft',
      budget: parseFloat(totalBudget) || 0,
      spend: 0,
      startDate: iso(bookingStartDate) ?? campaignRecord.startDate,
      endDate: iso(bookingEndDate) ?? campaignRecord.endDate,
      // SP "placements" are its products, keywords, categories and locations.
      positionIds: [...selectedProducts, ...keywords, ...selectedCategories, ...spaLocations],
      creativeStatus: 'approved',
    });
    queueToast(
      routeCampaign
        ? { title: 'Booking created', description: bookingCampaignName || campaignRecord.name }
        : { title: 'Campaign created', description: campaignRecord.name },
    );
    if (typeof window !== 'undefined') {
      window.location.href = initialValues?.returnTo ?? `${proposition.campaignRoute}/${campaignRecord.id}`;
    }
  };

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
    const spTargetCount = countTargets(spTargets);
    if (spTargetCount > 0) vals.push(`${spTargetCount} target${spTargetCount !== 1 ? 's' : ''}`);
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
            : campaignName || 'Create sponsored products campaign',
          // Where you are in the flow is the timeline's job, in the sidebar.
          subtitle: '',
          headerRight: null,
        }}
      >
        <div className="mb-3">
          <MetricRow
            metrics={spForecastMetrics}
            maxVisible={4}
            defaultVariant="default"
            removable={false}
            bleedEdges
          />
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 min-w-0 space-y-4">

              {/* ── Step 1: Campaign, in four cards ── */}
              {currentStepId === 'campaign-details' && campaignSubStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Setup</CardTitle>
                    <CardDescription>Enter the basic details for your new sponsored products campaign</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* The media plan this hangs under is not a field of this
                        form — it is changed from the Media plan summary card. */}
                    <div className="space-y-2">
                      <Label htmlFor="v2-name">Campaign name</Label>
                      <Input
                        id="v2-name"
                        placeholder="e.g. Summer Sale 2026"
                        value={campaignName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
                        hint="Give your campaign a descriptive name to easily identify it later"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="v2-po">PO number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input
                        id="v2-po"
                        placeholder="e.g. PO-123456"
                        value={spPoNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpPoNumber(e.target.value)}
                      />
                    </div>
                    {/* How the campaign buys is part of what it is — it
                        decides whether the placements step carries bids. */}
                    <BuyingTypePicker value={spBuyingType} onChange={setSpBuyingType} />
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost">Cancel</Button>
                      <Button disabled={!campaignName.trim()} onClick={() => setCampaignSubStep(1)}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStepId === 'campaign-details' && campaignSubStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Advertiser</CardTitle>
                    <CardDescription>Select the advertiser, brand and retail products for this campaign</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                        value={spBrand}
                        onChange={(value: string) => setSpBrand(value)}
                        placeholder="Select a brand"
                      />
                      <div className="text-xs text-muted-foreground mt-1">Choose the brand this campaign will advertise for</div>
                    </div>
                    <div className="space-y-2">
                      <SearchSelectList
                        label={<>Retail products <span className="text-muted-foreground font-normal">(optional)</span></>}
                        placeholder="Select product by name or ID…"
                        icon={<ScanBarcode className="w-4 h-4" />}
                        options={retailProducts.map((r) => ({ value: r.id, label: r.name, description: r.id }))}
                        value={spRetailProducts}
                        onChange={setSpRetailProducts}
                        maxVisibleSelected={5}
                      />
                      <div className="text-xs text-muted-foreground">Search and select retail products to target for this campaign</div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCampaignSubStep(0)}>Back</Button>
                      <Button disabled={!selectedAdvertiser} onClick={() => setCampaignSubStep(2)}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStepId === 'campaign-details' && campaignSubStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Run time &amp; budget</CardTitle>
                    <CardDescription>Set when your campaign runs and how much you want to spend</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* One field, both ends picked in one calendar */}
                    <div className="space-y-2">
                      <Label>Run time</Label>
                      <DateRangePicker
                        dateRange={startDate ? { from: startDate, to: endDate } : undefined}
                        onDateRangeChange={(range) => {
                          setStartDate(range?.from);
                          setEndDate(range?.to);
                        }}
                        placeholder="Select start and end date"
                        showPresets
                        showWeekNumbers
                        events={retailMoments}
                        presets={futureDateRangePresets}
                      />
                      <div className="text-xs text-muted-foreground">Your campaign will automatically start and stop on the selected dates</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="v2-budget">Total budget</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                        <Input
                          id="v2-budget"
                          type="number"
                          placeholder="e.g. 5000"
                          value={budget}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">The maximum total amount for the entire campaign duration</div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCampaignSubStep(1)}>Back</Button>
                      <Button disabled={!isCampaignDetailsComplete} onClick={createCampaignAndContinue}>Create campaign</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── Step 2: Booking – Sub-step 1: Setup ── */}
              {/* One card holding bordered sections — the same shape every
                  booking detail form uses, so creating and editing a booking
                  look like the same job. */}
              {currentStepId === 'booking' && bookingSubStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Setup</CardTitle>
                    <CardDescription>Name the booking</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Which campaign this booking belongs to is changed from
                        the Campaign details card, not asked for again here. */}
                    <div className="space-y-2">
                      <Label htmlFor="bk-name">Booking name <span className="text-foreground">*</span></Label>
                      <Input
                        id="bk-name"
                        placeholder="Enter booking name"
                        value={bookingCampaignName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingCampaignName(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
                      <Button onClick={() => setBookingSubStep(1)}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStepId === 'booking' && bookingSubStep === 1 && (
                <Card>
                  <CardContent className="space-y-6 p-6">
                  <FormSection title="Run time & budget">
                    <div className="space-y-4">
                      {/* One field, both ends picked in one calendar — a run
                          time is a span, not two independent dates. */}
                      <div className="space-y-1.5">
                        <Label>Run time <span className="text-foreground">*</span></Label>
                        <DateRangePicker
                          dateRange={bookingStartDate ? { from: bookingStartDate, to: bookingEndDate } : undefined}
                          onDateRangeChange={(range) => {
                            setBookingStartDate(range?.from);
                            setBookingEndDate(range?.to);
                          }}
                          placeholder="Select start and end date"
                          showPresets
                          showWeekNumbers
                          events={retailMoments}
                          presets={futureDateRangePresets}
                        />
                      </div>
                      <BudgetPacing
                        budgetField={
                          <div className="space-y-1.5">
                            <Label htmlFor="bk-total">Total budget <span className="text-foreground">*</span></Label>
                            <Input
                              id="bk-total"
                              type="number"
                              placeholder="10.00"
                              value={totalBudget}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalBudget(e.target.value)}
                            />
                          </div>
                        }
                        totalBudget={Number(totalBudget) || undefined}
                        startDate={bookingStartDate}
                        endDate={bookingEndDate}
                        auto={autoPacing}
                        onAutoChange={setAutoPacing}
                        shape={pacingShape}
                        onShapeChange={setPacingShape}
                        dailyBudget={dailyBudget}
                        onDailyBudgetChange={setDailyBudget}
                        overrides={pacingOverrides}
                        onOverridesChange={setPacingOverrides}
                      />
                      {/* No CPC field here — on auction campaigns each
                          selected placement carries its own bid, on the next
                          step's cards. */}
                      <ToggleCard
                        title="Email budget notifications"
                        description="Tells you when a booking caps out early or ends the flight with budget unspent."
                        checked={sendBudgetNotification}
                        onCheckedChange={setSendBudgetNotification}
                      />
                    </div>
                  </FormSection>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setBookingSubStep(0)}>Back</Button>
                    <Button disabled={!isBookingComplete} onClick={() => setBookingSubStep(2)}>Continue</Button>
                  </div>
                  </CardContent>
                </Card>
              )}

              {/* ── Step 2: Booking – Sub-step 2: Placements ── */}
              {currentStepId === 'booking' && bookingSubStep === 2 && (
                <Card>
                  <CardContent className="space-y-6 p-6">

                  {/* Products — the selection component, so searching for a
                      product works the same as searching for anything else. */}
                  <FormSection title="Add retail products">
                    <SearchSelectList
                      label={null}
                      placeholder="Search for retail products…"
                      icon={<ScanBarcode className="w-4 h-4" />}
                      maxVisibleSelected={5}
                      options={spProductOptions}
                      value={selectedProducts}
                      onChange={setSelectedProducts}
                    />
                  </FormSection>

                  <FormSection title="Add keywords">
                    <div className="space-y-3">
                      <p className="-mt-2 text-xs text-muted-foreground">
                        Add keywords to target shoppers searching for relevant products.
                      </p>
                      {/* The selection component, with create turned on: the
                          suggestions are a starting point, not the whole set of
                          valid keywords. */}
                      <SearchSelectList
                        label={null}
                        placeholder="Search or type a keyword…"
                        allowCreate
                        maxVisibleSelected={5}
                        options={Array.from(new Set([...spKeywordSuggestions, ...keywords])).map((k) => ({
                          value: k,
                          label: k,
                          // One muted sub-line, same as every other selected card —
                          // on typed keywords too, not just the suggested ones.
                          description: spKeywordDescription(k),
                        }))}
                        value={keywords}
                        onChange={setKeywords}
                        // The card carries what the keyword is worth: its bid
                        // first (auction only), then volume and competition on
                        // the same meters the media plan wizard uses.
                        hideSelectedDescription
                        renderSelectedExtra={(opt) => {
                          const detail = spKeywordDetail(opt.value);
                          return (
                            <div className="space-y-2">
                              {spIsAuction && (
                                <BidRow
                                  id={opt.value}
                                  className="mt-1"
                                  value={spBids[opt.value] ?? ''}
                                  onChange={(v) => setSpBids(prev => ({ ...prev, [opt.value]: v }))}
                                />
                              )}
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                                <LevelMeter label="Volume" tone="supply" level={detail.volume} />
                                <LevelMeter label="Competition" tone="risk" level={detail.competition} />
                              </div>
                            </div>
                          );
                        }}
                      />
                      {/* Offered, not chosen: dashed pills in their own tray,
                          inside the section they feed. */}
                      <SuggestionList
                        items={spKeywordSuggestions
                          .filter(k => !keywords.includes(k))
                          .map(k => ({ value: k, meta: spKeywordDescription(k) }))}
                        onAdd={(k) => setKeywords(prev => [...prev, k])}
                        onAddAll={() => setKeywords(prev => [
                          ...prev,
                          ...spKeywordSuggestions.filter(k => !prev.includes(k)),
                        ])}
                        label="Suggested keywords"
                      />
                    </div>
                  </FormSection>

                  <FormSection
                    title="Enable categories"
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategories(
                          selectedCategories.length === spCategoryOptions.length ? [] : spCategoryOptions.map(c => c.value),
                        )}
                      >
                        {selectedCategories.length === spCategoryOptions.length ? 'Clear all' : 'Select all'}
                      </Button>
                    }
                  >
                    <div className="space-y-2">
                      <p className="-mt-2 mb-2 text-xs text-muted-foreground">Select product categories to broaden your reach.</p>
                      {spCategoryOptions.map((cat) => {
                        const isSelected = selectedCategories.includes(cat.value);
                        return (
                          <div
                            key={cat.value}
                            className={cn(
                              'rounded-md border p-3 transition-colors',
                              isSelected ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background hover:bg-surface-hover',
                            )}
                          >
                            <label className="flex w-full cursor-pointer items-center gap-3 text-left">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => setSelectedCategories(prev =>
                                  prev.includes(cat.value) ? prev.filter(c => c !== cat.value) : [...prev, cat.value]
                                )}
                              />
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">{cat.label}</span>
                                {cat.description && <span className="block text-xs text-muted-foreground">{cat.description}</span>}
                              </span>
                            </label>
                            {isSelected && spIsAuction && (
                              <BidRow
                                id={cat.value}
                                value={spBids[cat.value] ?? ''}
                                onChange={(v) => setSpBids(prev => ({ ...prev, [cat.value]: v }))}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </FormSection>

                  {/* Where else the sponsored products can surface. */}
                  <FormSection
                    title="Enable other locations"
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSpaLocations(
                          spaLocations.length === spLocationOptions.length ? [] : spLocationOptions.map(l => l.value),
                        )}
                      >
                        {spaLocations.length === spLocationOptions.length ? 'Clear all' : 'Select all'}
                      </Button>
                    }
                  >
                    <div className="space-y-2">
                      <p className="-mt-2 mb-2 text-xs text-muted-foreground">Select other placements to broaden your reach.</p>
                      {spLocationOptions.map((loc) => {
                        const isSelected = spaLocations.includes(loc.value);
                        return (
                          <div
                            key={loc.value}
                            className={cn(
                              'rounded-md border p-3 transition-colors',
                              isSelected ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background hover:bg-surface-hover',
                            )}
                          >
                            <label className="flex w-full cursor-pointer items-center gap-3 text-left">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => setSpaLocations(prev =>
                                  prev.includes(loc.value) ? prev.filter(l => l !== loc.value) : [...prev, loc.value]
                                )}
                              />
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">{loc.label}</span>
                                {loc.description && <span className="block text-xs text-muted-foreground">{loc.description}</span>}
                              </span>
                            </label>
                            {isSelected && spIsAuction && (
                              <BidRow
                                id={loc.value}
                                value={spBids[loc.value] ?? ''}
                                onChange={(v) => setSpBids(prev => ({ ...prev, [loc.value]: v }))}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </FormSection>

                  {/* Navigation */}
                  <div className="flex justify-end gap-3 pt-1">
                    <Button variant="outline" onClick={() => setBookingSubStep(1)}>Back</Button>
                    <Button onClick={() => setBookingSubStep(3)}>Continue</Button>
                  </div>
                  </CardContent>
                </Card>
              )}

              {/* ── Step 2: Booking – Sub-step 4: Targeting ── */}
              {currentStepId === 'booking' && bookingSubStep === 3 && (
                <Card>
                  <CardContent className="space-y-6 p-6">
                  <FormSection title="Targeting">
                    <div className="space-y-2">
                      {/* The same targeting control as everywhere — sponsored
                          products only asks which local brands, all of them
                          in until the user removes some. */}
                      <p className="-mt-2 text-xs text-muted-foreground">Which local brands should this booking target?</p>
                      <TargetSelect
                        groups={[{
                          value: 'local-brands',
                          label: 'Local brands',
                          description: 'The banners this booking runs under',
                          suggestions: localBrands.map((b) => b.label),
                        }]}
                        value={spTargets}
                        onChange={setSpTargets}
                        placeholder="Add a target group — local brands…"
                      />
                    </div>
                  </FormSection>

                  {/* Navigation */}
                  <div className="flex justify-end gap-3 pt-1">
                    <Button variant="outline" onClick={() => setBookingSubStep(2)}>Back</Button>
                    <Button onClick={finishSPWizard}>{routeBooking ? 'Approve booking' : 'Save & finish'}</Button>
                  </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Summary sidebar — the booking hierarchy, the thing being
                worked on first and white. In a wizard that active card is the
                booking drawn as a step timeline (the same shape the media
                plan wizard uses); the chain above it keeps its normal
                summary cards, muted, in hierarchy order. */}
            {(() => {
              const dash = '—';
              const fmt = (d?: Date) => d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : dash;
              const mp = mediaPlanOptionsWithDynamic.find(m => m.value === selectedMediaPlanV2);
              const campaign = campaignOptionsForBooking.find(o => o.value === selectedCampaign);
              const pending = currentStepId === 'campaign-details';
              // Each entity owns its own steps. A campaign's details are the
              // campaign's, not the booking's, so they live on the campaign's
              // timeline — the booking's starts where the booking does. Same
              // shape whichever entity a flow happens to start from.
              const campaignTimeline = (
                <SummaryCard
                  title="Sponsored products campaign"
                  entity="campaign"
                  variant="process"
                  steps={campaignSubStepLabels.map((label, i) => {
                    const status = !pending || i < campaignSubStep ? 'completed' as const : i === campaignSubStep ? 'active' as const : 'pending' as const;
                    const values = [
                      i === 0 ? [campaignName, spBuyingType === 'guaranteed' ? 'Guaranteed' : 'Auction'] : [],
                      i === 1 ? [advertiserOptions.find((a) => a.value === selectedAdvertiser)?.label ?? '', brandOptions.find((b) => b.value === spBrand)?.label ?? ''] : [],
                      i === 2 ? [budget ? `€${budget}` : '', startDate ? `${fmt(startDate)} - ${fmt(endDate)}` : ''] : [],
                    ].flat().filter(Boolean);
                    return {
                      id: `campaign-${i}`,
                      label,
                      status,
                      values,
                      onClick: () => { setCurrentStep(0); setCampaignSubStep(i); },
                    };
                  })}
                  // Only the last campaign step carries the call to action,
                  // the same rule the other propositions' wizards follow.
                  actions={
                    campaignSubStep === campaignSubStepLabels.length - 1
                      ? [{ label: 'Create campaign', disabled: !isCampaignDetailsComplete, onClick: createCampaignAndContinue }]
                      : undefined
                  }
                />
              );
              const bookingStatus = (i: number) =>
                i < bookingSubStep ? 'completed' as const : i === bookingSubStep ? 'active' as const : 'pending' as const;
              const bookingTimeline = (
                <SummaryCard
                  title={routeBooking ? 'Booking' : 'New booking'}
                  entity="booking"
                  variant="process"
                  steps={[
                    {
                      id: 'booking-setup',
                      label: 'Setup',
                      status: bookingStatus(0),
                      values: [bookingCampaignName].filter(Boolean),
                      onClick: () => setBookingSubStep(0),
                    },
                    {
                      id: 'booking-budget',
                      label: 'Run time & budget',
                      status: bookingStatus(1),
                      values: [
                        totalBudget ? `€${totalBudget}` : '',
                        bookingStartDate ? `${fmt(bookingStartDate)} - ${fmt(bookingEndDate)}` : '',
                      ].filter(Boolean),
                      onClick: () => setBookingSubStep(1),
                    },
                    {
                      id: 'placements',
                      label: 'Placements',
                      status: bookingStatus(2),
                      values: [
                        selectedProducts.length > 0 ? `${selectedProducts.length} products` : '',
                        keywords.length > 0 ? `${keywords.length} keywords` : '',
                        selectedCategories.length > 0 ? `${selectedCategories.length} categories` : '',
                        Object.keys(spBids).length > 0 ? `${Object.keys(spBids).length} bid${Object.keys(spBids).length === 1 ? '' : 's'} set` : '',
                      ].filter(Boolean),
                      onClick: () => setBookingSubStep(2),
                    },
                    {
                      id: 'targeting',
                      label: 'Targeting',
                      status: bookingStatus(3),
                      values: [
                        countTargets(spTargets) > 0 ? `${countTargets(spTargets)} local brand${countTargets(spTargets) === 1 ? '' : 's'}` : '',
                      ].filter(Boolean),
                      onClick: () => setBookingSubStep(3),
                    },
                  ]}
                  // Only the last step carries the call to action — the same
                  // rule every wizard's cards follow.
                  actions={bookingSubStep === 3 ? [{ label: routeBooking ? 'Approve booking' : 'Save & finish', onClick: finishSPWizard }] : undefined}
                />
              );
              return (
                <HierarchySidebar
                  active={pending ? 'campaign' : 'booking'}
                  booking={pending ? undefined : bookingTimeline}
                  mediaPlan={
                    <>
                      <SummaryCard
                        title="Media plan"
                        className="bg-page"
                        entity="media-plan"
                        variant="details"
                        collapsible
                        headerAction={{
                          icon: LinkActionIcon,
                          label: 'Change linked media plan',
                          onClick: () => setLinkingMediaPlan(true),
                        }}
                        items={mp ? [
                          { label: 'Media plan', value: mp.label },
                          ...('advertiser' in mp && mp.advertiser ? [{ label: 'Advertiser', value: String(mp.advertiser) }] : []),
                          ...('budget' in mp && mp.budget ? [{ label: 'Total budget', value: String(mp.budget) }] : []),
                        ] : undefined}
                        empty={mp ? undefined : 'No media plan linked'}
                      />
                      <LinkPickerDialog
                        open={linkingMediaPlan}
                        onOpenChange={setLinkingMediaPlan}
                        entityLabel="media plan"
                        allowNone
                        noneLabel="No media plan"
                        options={mediaPlanOptionsWithDynamic.map((o) => ({
                          value: o.value,
                          label: o.label,
                          details: {
                            Advertiser: 'advertiser' in o && o.advertiser ? String(o.advertiser) : '—',
                            Budget: 'budget' in o && o.budget ? String(o.budget) : '—',
                          },
                        }))}
                        value={selectedMediaPlanV2 || undefined}
                        onChange={(v) => setSelectedMediaPlanV2(v ?? '')}
                      />
                    </>
                  }
                  campaign={pending ? campaignTimeline : (
                    <>
                      <SummaryCard
                        title="Sponsored products campaign"
                        className="bg-page"
                        entity="campaign"
                        variant="details"
                        collapsible
                        // Only a booking hangs under a campaign; while the
                        // campaign is still being created there is nothing to
                        // relink it to.
                        headerAction={pending ? undefined : {
                          icon: LinkActionIcon,
                          label: 'Change linked campaign',
                          onClick: () => setLinkingCampaign(true),
                        }}
                        items={[
                          { label: 'Campaign name', value: campaignName || campaign?.label || dash },
                          { label: 'Advertiser', value: advertiserOptions.find(a => a.value === selectedAdvertiser)?.label ?? dash },
                          { label: 'Budget', value: budget ? `€${budget}` : dash },
                          { label: 'Runtime', value: startDate || endDate ? `${fmt(startDate)} - ${fmt(endDate)}` : dash },
                        ]}
                      />
                      <LinkPickerDialog
                        open={linkingCampaign}
                        onOpenChange={setLinkingCampaign}
                        entityLabel="campaign"
                        options={campaignOptionsForBooking.map((o) => ({
                          value: o.value,
                          label: o.label,
                        }))}
                        value={selectedCampaign || undefined}
                        onChange={(v) => setSelectedCampaign(v ?? '')}
                      />
                    </>
                  )}
                />
              );
            })()}
          </div>
        </div>
      </AppLayout>
    </MenuContextProvider>
  );
};

// --- Story Variants ---

/** The route args every create page passes through: `planId` links the new
 *  campaign into a media plan; `campaignId` enters at the booking step for an
 *  existing campaign; `step=creatives` runs only the creative step. */
type CreateArgs = { planId?: string; campaignId?: string; bookingId?: string; step?: string; returnTo?: string };

export const CreateDisplay: Story = {
  render: (args) => {
    const { planId, campaignId, bookingId, step, returnTo } = (args ?? {}) as CreateArgs;
    return <PropositionWizard propositionType="display" planId={planId} campaignId={campaignId} bookingId={bookingId} step={step} returnTo={returnTo} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating a Display campaign with banner ads across the retailer website and app.',
      },
    },
  },
};

export const CreateOffsite: Story = {
  render: (args) => {
    const { planId, campaignId, bookingId, step, returnTo } = (args ?? {}) as CreateArgs;
    return <PropositionWizard propositionType="offsite" planId={planId} campaignId={campaignId} bookingId={bookingId} step={step} returnTo={returnTo} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating an Offsite campaign reaching shoppers beyond the retailer — open web, social, CTV.',
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
  render: (args) => {
    const { planId, campaignId, bookingId, step, returnTo } = (args ?? {}) as CreateArgs;
    return <PropositionWizard propositionType="offline-instore" planId={planId} campaignId={campaignId} bookingId={bookingId} step={step} returnTo={returnTo} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating an Offline In-Store campaign with physical media placements like shelf talkers, flyers and POS materials.',
      },
    },
  },
};

export const CreateDigitalInstore: Story = {
  render: (args) => {
    const { planId, campaignId, bookingId, step, returnTo } = (args ?? {}) as CreateArgs;
    return <PropositionWizard propositionType="digital-instore" planId={planId} campaignId={campaignId} bookingId={bookingId} step={step} returnTo={returnTo} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Wizard flow for creating a Digital In-Store campaign with digital screens and kiosks in physical retail locations.',
      },
    },
  },
};
