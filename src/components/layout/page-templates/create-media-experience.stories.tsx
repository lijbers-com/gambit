import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { SummaryCard } from '@/components/ui/summary-card';
import { BuyingTypePicker } from '@/components/ui/buying-type-picker';
import { MetricRow } from '@/components/ui/metric-row';
import type { MetricDefinition } from '@/components/ui/metric-row';
import { Button } from '@/components/ui/button';
import { FieldHint, Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { RetailProductSelect } from '@/components/ui/retail-product-select';
import { SearchSelectList } from '@/components/ui/search-select-list';
import { Checkbox } from '@/components/ui/checkbox';
import { OptimisationCard, budgetOptimisationExplain, budgetPacingExplain, brandReachExplain, budgetStarterExplain, funnelKpiExplain, type Advice } from '@/components/ui/optimisation-card';
import { Filter } from '@/components/ui/filter';
import { GoalCard } from '@/components/ui/goal-card';
import { LevelMeter } from '@/components/ui/level-meter';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { DateRangePicker, futureDateRangePresets } from '@/components/ui/date-picker';
import { retailMoments } from '@/lib/retail-moments';
import { planForecast, fmtForecastRange } from '@/lib/forecast';
import { funnelKpis, kpiEstimates, stageForGoal, stageEstimateKpis } from '@/lib/funnel';
import { buildForecastMetrics } from '@/components/ui/forecast-metrics';
import { propositionColor } from '@/lib/proposition-colors';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { cn } from '@/lib/utils';
import { queueToast } from '@/components/ui/toast';
import { LinkPickerDialog } from '@/components/ui/link-picker';
import { Link2 } from 'lucide-react';
import { getDb, createMediaPlan, updateMediaPlan, createCampaign, updateCampaign, createBooking, getCurrentUser, type EngineId } from '@/lib/db';
import { describeObjective, describeKpi } from '@/lib/objective-kpi-copy';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  LayoutGrid,
  Euro,
  Calendar as CalendarIcon,
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
  Minus,
  Info,
  FlaskConical,
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

A step-by-step wizard for creating new media plans.

## Steps

1. **Campaign Setup** - Enter the campaign name and select the brand to advertise for
2. **Campaign Goal** - Select the objective of the media plan
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

// Objectives per goal, following the funnel → objective framework. The chosen
// objective drives the KPIs the plan is judged on. Purchase and Loyalty are
// Conversion-stage goals.
const goalObjectives: Record<string, { stage: string; objectives: string[] }> = {
  awareness: { stage: 'Awareness', objectives: ['Brand awareness', 'Product awareness', 'Brand associations'] },
  consideration: { stage: 'Consideration', objectives: ['Brand/product consideration', 'Brand associations', 'New customers', 'Brand preference', 'Purchase intent'] },
  purchase: { stage: 'Conversion', objectives: ['Sales', 'Promotion support'] },
  loyalty: { stage: 'Conversion', objectives: ['Sales', 'Promotion support'] },
};

// Demo estimates for the headline KPIs we surface in the metric row as the
// plan is built. Only KPIs with an estimate here are promoted to a metric card.
/**
 * A forecast is a band, not a point — showing "€8,208" promises a precision
 * the model doesn't have. ±8% around the midpoint, the two ends formatted the
 * same way, unit stated once.
 */
const forecastRange = (mid: number, fmt: (n: number) => string, unit = '') =>
  `${fmt(mid * 0.92)}–${fmt(mid * 1.08)}${unit}`;

// kpiEstimates moved to @/lib/funnel — shared with the plan detail page.

// KPIs the plan is judged on per funnel stage (the funnel → KPI framework).
// Awareness has no Sales KPIs; Conversion has no standalone Brand KPIs.
// funnelKpis moved to @/lib/funnel — shared with the plan detail page.



/**
 * What each goal is judged on, taken from the funnel framework rather than
 * written out again — the card used to list a hand-picked four, which read as
 * the whole set and disagreed with the KPI step further down. Brand KPIs first
 * (the outcome), then the media KPIs that steer towards it; Conversion splits
 * into the sales KPIs that suit buying versus keeping a customer.
 */
const LOYALTY_KPIS = [
  'Repeat', 'Purchase frequency', 'Win-back customers', 'CLV', 'Sales per customer',
  'Sales driver: existing customers', 'Redemption (loyalty product only)', 'Incremental ROAS',
];
const goalKpis: Record<string, string[]> = {
  awareness: [
    ...funnelKpis.Awareness.brand,
    'Reach', 'Unique reach', 'Frequency', 'Video completion rate', 'CPM', 'Share of voice (category)',
  ],
  consideration: [
    ...funnelKpis.Consideration.brand,
    'Click-through rate', 'Average time on page', 'Post engagement rate',
    ...funnelKpis.Consideration.sales,
  ],
  purchase: [
    'Sales lift', 'Incremental ROAS', 'Conversion rate', 'Sales online', 'Sales offline',
    'Trial (new to product)', 'New to brand', 'New to category', 'Basket size (SIS only)',
    'Share of basket (SIS only)',
  ],
  loyalty: LOYALTY_KPIS,
};

/**
 * Which KPIs are still selectable once a goal and objective are chosen.
 * Brand objectives narrow to their own brand-lift KPIs; a Conversion
 * objective has none of those, so it uses the goal's outcome KPIs. Shared by
 * the KPI picker and the goal card, so the card stops showing KPIs the
 * objective has already ruled out.
 */
const kpiPoolFor = (goalId: string, objective: string | null): string[] => {
  const stage = goalObjectives[goalId]?.stage;
  if (!stage) return [];
  const stageBrand = funnelKpis[stage]?.brand ?? [];
  const brand = (objectiveBrandKpis[objective ?? ''] ?? stageBrand).filter((k) => stageBrand.includes(k));
  return brand.length > 0 ? brand : (goalKpis[goalId] ?? []);
};

// Brand-lift "studies" a user can commission per objective. The available
// studies follow the funnel → brand KPI framework — they are the brand KPIs of
// the selected objective's stage (funnelKpis[stage].brand). A study is included
// for free once the total media budget clears its threshold; below that it can
// still be added for the listed one-off fee. Conversion-stage objectives have
// no brand study (sales attribution is tracked automatically).
/**
 * Which brand KPIs each objective is judged on — the funnel table's rows. The
 * stage pool (funnelKpis) is what the stage CAN measure; this is what the
 * chosen objective actually IS measured on, so the KPI select narrows to it.
 * Objectives absent here (sales, promotion support, new customers) have no
 * brand-lift KPI — their sales and media KPIs are tracked automatically.
 */
const objectiveBrandKpis: Record<string, string[]> = {
  'Brand awareness': ['Top-of-mind awareness', 'Unaided brand/product awareness', 'Aided brand/product awareness', 'Ad recall'],
  'Product awareness': ['Top-of-mind awareness', 'Unaided brand/product awareness', 'Aided brand/product awareness', 'Ad recall'],
  'Brand associations': ['Brand associations & values', 'Category entry points'],
  'Brand/product consideration': ['Brand/product consideration'],
  'Brand preference': ['Brand preference'],
  'Purchase intent': ['Purchase intent'],
};

const studyPricing: Record<string, { fee: number; freeThreshold: number }> = {
  'Top-of-mind awareness': { fee: 1500, freeThreshold: 25000 },
  'Unaided brand/product awareness': { fee: 1500, freeThreshold: 25000 },
  'Aided brand/product awareness': { fee: 1500, freeThreshold: 25000 },
  'Ad recall': { fee: 2500, freeThreshold: 50000 },
  'Category entry points': { fee: 3500, freeThreshold: 75000 },
  'Brand associations & values': { fee: 1500, freeThreshold: 25000 },
  'Brand/product consideration': { fee: 2000, freeThreshold: 30000 },
  'Brand preference': { fee: 2500, freeThreshold: 50000 },
  'Purchase intent': { fee: 2500, freeThreshold: 50000 },
};

type BrandStudy = { name: string; fee: number; freeThreshold: number };

const getStudiesForStage = (stage: string | undefined): BrandStudy[] =>
  (stage && funnelKpis[stage]?.brand ? funnelKpis[stage].brand : []).map((name) => ({
    name,
    ...(studyPricing[name] ?? { fee: 2000, freeThreshold: 50000 }),
  }));

const advertiserOptions = [
  { label: 'Acme Media', value: 'acme-media' },
  { label: 'Brand Alliance', value: 'brand-alliance' },
  { label: 'Global Brands Co.', value: 'global-brands' },
  { label: 'Unilever Shopper Marketing', value: 'unilever-shopper' },
  { label: 'Nestlé Trade Marketing', value: 'nestle-trade' },
];

// Brands carry lightweight first-party-style metrics so the assisted panels can
// surface real numbers and optimisation hints instead of generic copy.
// `hasRetailProducts` marks brands actually carried in the store — only those
// expose the retail-product picker (sales attribution). Non-endemic or
// not-carried brands run without SKUs.
const brandOptions = [
  { label: 'Coca-Cola', value: 'coca-cola', category: 'Soft drinks', reach: 6.4, roas: 4.1, hasRetailProducts: true },
  { label: 'Unilever', value: 'unilever', category: 'FMCG', reach: 8.1, roas: 3.6, hasRetailProducts: false },
  { label: 'Procter & Gamble', value: 'procter-gamble', category: 'Personal care', reach: 7.2, roas: 3.9, hasRetailProducts: false },
  { label: 'Nestlé', value: 'nestle', category: 'Food', reach: 7.8, roas: 3.4, hasRetailProducts: false },
  { label: 'PepsiCo', value: 'pepsico', category: 'Snacks & drinks', reach: 6.9, roas: 3.8, hasRetailProducts: true },
  { label: 'Heineken', value: 'heineken', category: 'Beer', reach: 5.3, roas: 4.4, hasRetailProducts: true },
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

/**
 * What an assisted campaign actually books per proposition — real positions
 * from the prototype database (see src/lib/db/seed.ts), so the preview the
 * user reads is exactly what gets created on launch.
 */
const assistedBookings: Record<string, { name: string; positionId: string; detail: string }[]> = {
  display: [
    { name: 'Homepage top banner', positionId: 'pos-dsp-home-top', detail: 'Homepage · above the fold' },
    { name: 'Category top banner', positionId: 'pos-dsp-cat-top', detail: 'Category pages · above the grid' },
    { name: 'PDP banner', positionId: 'pos-dsp-pdp', detail: 'Product pages · high intent' },
  ],
  'sponsored-products': [
    { name: 'Brand keywords', positionId: 'pos-sp-search', detail: 'Search · your own brand terms' },
    { name: 'Category keywords', positionId: 'pos-sp-search', detail: 'Search · generic category terms' },
    { name: 'Competitor keywords', positionId: 'pos-sp-search', detail: 'Search · competitor brand terms' },
  ],
  'digital-instore': [
    { name: 'Entrance screens', positionId: 'pos-dis-entrance', detail: 'In-store screens · store entrance' },
    { name: 'Aisle screens', positionId: 'pos-dis-aisle', detail: 'In-store screens · category aisle' },
  ],
  'offline-instore': [
    { name: 'Shelf displays', positionId: 'pos-ois-shelf', detail: 'Printed materials · at the shelf' },
    { name: 'Floor stickers', positionId: 'pos-ois-floor', detail: 'Printed materials · aisle floor' },
  ],
  offsite: [
    { name: 'Open web display', positionId: 'pos-off-web-standard', detail: 'Display · Epsilon' },
    { name: 'Social — Meta', positionId: 'pos-off-soc-meta', detail: 'Social Media · Meta' },
  ],
};

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
    id: 'offsite',
    name: 'Offsite',
    description: 'Extend your campaign beyond the retailer with 3rd party display, socials, connected TV, DOOH, AI, audio and mailing',
    icon: Globe,
    metrics: { reach: '8.5M', roas: '2.1x', sales: '€15,200', roasChange: '+14%' },
    aiPreset: {
      id: 'er-ai',
      name: 'AI optimised offsite',
      description: 'Multi-channel offsite advertising across 3rd party display, socials, connected TV, DOOH, AI, audio and mailing, matched to your retailer first-party data',
      placements: 42,
      estImpressions: '9.8M',
    },
  },
];

const wizardSteps = [
  { id: 'setup', label: 'Setup' },
  { id: 'advertiser', label: 'Advertiser' },
  // Goal/objective drives the KPIs we judge the plan on, so it comes before
  // run time & budget in the flow.
  { id: 'targeting', label: 'Goal and objectives' },
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

    // Step 1: Setup
    const [campaignName, setCampaignName] = React.useState('');
    const [poNumber, setPoNumber] = React.useState('');
  // On by default: a first-time planner is better served by a sensible split
  // than by an empty budget per proposition.
  const [autoBudget, setAutoBudget] = React.useState(true);

    // Step 2: Advertiser
    const [selectedAdvertiser, setSelectedAdvertiser] = React.useState('');
    const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
    const [selectedRetailProducts, setSelectedRetailProducts] = React.useState<string[]>([]);
    const [retailProductSearch, setRetailProductSearch] = React.useState('');
    const [showRetailProductResults, setShowRetailProductResults] = React.useState(false);

    // Step 3: Run time & budget
    const [budgetAmount, setBudgetAmount] = React.useState('');
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
    const [autoBudgetOptimization, setAutoBudgetOptimization] = React.useState(true);

    // Step 4: Goals & targets (goal + audience)
    const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null);
    const [selectedObjective, setSelectedObjective] = React.useState<string | null>(null);
    const [selectedStudies, setSelectedStudies] = React.useState<string[]>([]);
    // KPIs the user picks for the chosen objective — each can reveal a matching
    // brand-lift study (research) below.
    const [selectedKpis, setSelectedKpis] = React.useState<string[]>([]);
    /**
     * Picking a goal empties the other cards' KPI lists, which would shrink
     * the grid and jump everything below it up the page. The grid keeps the
     * height it had while all four were still listing their KPIs — measured
     * whenever nothing is picked yet, then held.
     */
    const goalGridRef = React.useRef<HTMLDivElement>(null);
    const [goalGridHeight, setGoalGridHeight] = React.useState<number | null>(null);
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    React.useEffect(() => {
      const el = goalGridRef.current;
      // Only measure while the full lists are on screen; afterwards the last
      // measurement is the reserved height.
      if (!el || selectedGoal !== null) return;
      const measure = () => setGoalGridHeight(el.getBoundingClientRect().height);
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
      // currentStep matters: the grid only exists on the goal step, so without
      // it the effect ran once on mount against nothing and never again.
    }, [selectedGoal, currentStep]);
    const [tags, setTags] = React.useState<string[]>([]);
    const [tagInput, setTagInput] = React.useState('');

    // Step 5: the campaigns in this plan — a LIST of rows, so a proposition can
    // hold more than one campaign. Assisted rows are prefilled from the AI
    // preset; expert rows carry their own form for the user to fill in.
    type CampaignRow = {
      id: string;
      engine: string;
      mode: 'preset' | 'expert';
      name: string;
      externalId: string;
      budget: string;
      dateRange: DateRange | undefined;
      /** How the campaign buys — assisted rows take the preset's auction. */
      buyingType: 'auction' | 'guaranteed';
    };
    const rowSeq = React.useRef(0);
    const nextRowId = () => `row-${(rowSeq.current += 1)}`;
    const makeRow = (engine: string, mode: 'preset' | 'expert'): CampaignRow => ({
      id: nextRowId(),
      engine,
      mode,
      name: '',
      externalId: '',
      budget: '',
      dateRange: undefined,
      buyingType: 'auction',
    });
    // Default: one assisted campaign per proposition.
    const [campaignRows, setCampaignRows] = React.useState<CampaignRow[]>(() =>
      propositions.map((p) => ({
        id: `row-${(rowSeq.current += 1)}`,
        engine: p.id,
        mode: 'preset' as const,
        name: '',
        externalId: '',
        budget: '',
        dateRange: undefined,
        buyingType: 'auction' as const,
      })),
    );
    const updateRow = (id: string, patch: Partial<CampaignRow>) =>
      setCampaignRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const removeRow = (id: string) => setCampaignRows((prev) => prev.filter((r) => r.id !== id));

    // Assisted experience — one switch that turns the AI service on or off across
    // the whole plan: per-step guidance, budget optimization, and AI campaign
    // presets. When off, the user builds the plan unassisted (no advice, no
    // suggestions, empty campaigns by default).
    const [assistedExperience, setAssistedExperience] = React.useState(true);
    const setAssisted = (on: boolean) => {
      setAssistedExperience(on);
      if (!on) setAutoBudgetOptimization(false);
      else if (budgetAmount.trim() !== '') setAutoBudgetOptimization(true);
      // Flip every campaign row to assisted (on) or expert (off).
      setCampaignRows((prev) => prev.map((r) => ({ ...r, mode: on ? 'preset' : 'expert' })));
    };

    // Derived data
    const selectedGoalData = goals.find((g) => g.id === selectedGoal);
    const selectedBrandLabels = brandOptions.filter((b) => selectedBrands.includes(b.value)).map((b) => b.label);

    // Aggregate brand metrics for the assisted optimisation panel on the
    // Advertiser step — combined reach (de-duplicated for overlap), average
    // category ROAS, and the categories in scope.
    const advertiserStats = React.useMemo(() => {
      const brands = brandOptions.filter((b) => selectedBrands.includes(b.value));
      const reach = brands.length ? Math.min(brands.reduce((s, b) => s + b.reach, 0) * 0.9, 14) : 0;
      const roas = brands.length ? brands.reduce((s, b) => s + b.roas, 0) / brands.length : 0;
      const categories = Array.from(new Set(brands.map((b) => b.category)));
      return { reach, roas, categories, products: selectedRetailProducts.length };
    }, [selectedBrands, selectedRetailProducts]);

    // Whether any selected brand is actually carried in the store — gates the
    // retail-product picker (some advertisers/brands have no SKUs here).
    const selectedBrandsHaveRetailProducts = selectedBrands.some(
      (v) => brandOptions.find((b) => b.value === v)?.hasRetailProducts,
    );

    // KPIs the plan is judged on (per funnel stage) become metric cards in the
    // top row once a goal + objective are chosen — the row fills in as you go.
    // KPI estimate cards come from the shared builder (stageEstimateKpis).

    // Step completion checks
    const isSetupComplete = campaignName.trim() !== '';
    const isAdvertiserComplete = selectedBrands.length > 0;
    const isBudgetComplete = budgetAmount.trim() !== '' && dateRange?.from !== undefined && dateRange?.to !== undefined;
    // Audiences are optional — a goal + objective is enough to continue.
    const isTargetingComplete = selectedGoal !== null && selectedObjective !== null;

    const isCurrentStepComplete = [isSetupComplete, isAdvertiserComplete, isTargetingComplete, isBudgetComplete, true][currentStep] ?? false;

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

    // Get step values for summary (returns array for list display)
    const getStepValues = (stepId: string): string[] | null => {
      switch (stepId) {
        case 'setup': {
          if (!campaignName.trim()) return null;
          const vals: string[] = [campaignName];
          if (poNumber.trim()) vals.push(poNumber);
          return vals;
        }
        case 'advertiser': {
          if (!isAdvertiserComplete) return null;
          const vals: string[] = [];
          if (selectedBrandLabels.length > 0) vals.push(selectedBrandLabels.length === 1 ? selectedBrandLabels[0] : selectedBrandLabels.length + ' brands');
          if (selectedRetailProducts.length > 0) vals.push(`${selectedRetailProducts.length} product${selectedRetailProducts.length !== 1 ? 's' : ''} selected`);
          return vals.length > 0 ? vals : null;
        }
        case 'budget': {
          if (!isBudgetComplete) return null;
          const vals: string[] = [`€${budgetAmount}`];
          if (dateRange?.from && dateRange?.to) {
            vals.push(`${dateRange.from.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${dateRange.to.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`);
          }
          return vals;
        }
        case 'targeting': {
          if (!selectedGoal) return null;
          const vals: string[] = [];
          if (selectedGoalData) vals.push(selectedGoalData.title);
          if (selectedObjective) vals.push(selectedObjective);
          if (selectedAudiences.length > 0) vals.push(`${selectedAudiences.length} audience${selectedAudiences.length !== 1 ? 's' : ''} selected`);
          return vals;
        }
        case 'review': {
          if (campaignRows.length === 0) return null;
          const engines = new Set(campaignRows.map((r) => r.engine)).size;
          return [
            `${campaignRows.length} campaign${campaignRows.length !== 1 ? 's' : ''}`,
            `${engines} proposition${engines !== 1 ? 's' : ''}`,
          ];
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

    // Proposition impact on metrics. Estimates are per PROPOSITION, so a second
    // campaign on the same proposition doesn't double-count its reach; only
    // assisted (preset) campaigns carry estimates — expert ones are unknown.
    const propositionImpact = React.useMemo(() => {
      let additionalReach = 0;
      let roasBoost = 0;
      let additionalSales = 0;

      const enginesInPlan = new Set(campaignRows.map((r) => r.engine));
      const assistedEngines = new Set(campaignRows.filter((r) => r.mode === 'preset').map((r) => r.engine));

      assistedEngines.forEach((propId) => {
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

      return { additionalReach, roasBoost, additionalSales, selectedCount: enginesInPlan.size };
    }, [campaignRows]);

    // Launching writes the media plan + one campaign per enabled proposition
    // into the prototype database, then opens the new plan's detail page.
    // Existing campaigns picked up into this plan: chosen in the same table
    // dialog every link change uses, relinked once the plan is created.
    const [linkExistingOpen, setLinkExistingOpen] = React.useState(false);
    const [linkedExistingIds, setLinkedExistingIds] = React.useState<string[]>([]);
    const existingCampaignOptions = getDb().campaigns
      .filter((c) => !linkedExistingIds.includes(c.id))
      .map((c) => ({
        value: c.id,
        label: c.name,
        details: {
          Proposition: c.engine.replace('-instore', ' in-store').replace(/-/g, ' '),
          Status: c.status,
          Budget: `€${c.budget.toLocaleString()}`,
        },
      }));

    const createMediaPlanFlow = () => {
      const name = campaignName || 'New Media plan';
      const db = getDb();
      const iso = (d: Date) => d.toISOString().slice(0, 10);
      const start = dateRange?.from ?? new Date();
      const end = dateRange?.to ?? new Date(start.getTime() + 30 * 86400000);
      const budget = parseFloat(budgetAmount) || 0;

      // Resolve the wizard's advertiser/brand option values to store entities.
      const advLabel = advertiserOptions.find((a) => a.value === selectedAdvertiser)?.label;
      const advertiser = db.advertisers.find((a) => a.name === advLabel) ?? db.advertisers[0];
      const brandIds = selectedBrands
        .map((v) => advertiser.brands.find((b) => b.id === `br-${v}` || b.name.toLowerCase() === v.replace(/-/g, ' '))?.id)
        .filter((id): id is string => Boolean(id));

      // The draft made after step 1 becomes the real plan; saving clears the
      // wizard marker so the overview stops showing "continue where you left off".
      const plan = draftPlanId
        ? updateMediaPlan(draftPlanId, {
            name,
            poNumber: poNumber || undefined,
            advertiserId: advertiser.id,
            brandIds,
            status: 'in-option',
            autoBudget,
            goal: selectedGoal ?? undefined,
            objective: selectedObjective ?? undefined,
            kpis: selectedKpis,
            budget,
            startDate: iso(start),
            endDate: iso(end),
            wizardStep: undefined,
          })!
        : createMediaPlan({
        name,
        poNumber: poNumber || undefined,
        advertiserId: advertiser.id,
        brandIds,
        status: 'in-option',
        autoBudget,
        goal: selectedGoal ?? undefined,
        objective: selectedObjective ?? undefined,
        kpis: selectedKpis,
        budget,
        startDate: iso(start),
        endDate: iso(end),
        createdBy: getCurrentUser()?.id,
      });

      // One campaign per row. Rows without their own budget share what's left of
      // the plan budget evenly; expert rows can carry their own budget/dates.
      const claimed = campaignRows.reduce((s, r) => s + (parseFloat(r.budget) || 0), 0);
      const unbudgeted = campaignRows.filter((r) => !(parseFloat(r.budget) > 0)).length;
      const perRow = unbudgeted > 0 ? Math.max(Math.floor((budget - claimed) / unbudgeted), 0) : 0;

      campaignRows.forEach((row) => {
        const propName = propositions.find((p) => p.id === row.engine)?.name ?? row.engine;
        const rowBudget = parseFloat(row.budget) || perRow;
        const campaignStart = iso(row.dateRange?.from ?? start);
        const campaignEnd = iso(row.dateRange?.to ?? end);
        const campaign = createCampaign({
          mediaPlanId: plan.id,
          // The proposition frames the campaign (cards, tables, columns) —
          // it is not part of the campaign's name.
          name: row.name.trim() || name,
          engine: row.engine as EngineId,
          // Persisted so the follow-up booking/creative wizards know whether
          // to open fully prefilled (assisted) or only with the shared facts.
          mode: row.mode === 'preset' ? 'assisted' : 'expert',
          buyingType: row.buyingType,
          status: 'in-option',
          budget: rowBudget,
          spend: 0,
          startDate: campaignStart,
          endDate: campaignEnd,
        });

        // An assisted campaign also creates the bookings it previewed, on the
        // real positions. They are PROPOSALS: created as drafts, so the plan's
        // setup checklist asks the user to run the prefilled booking wizard
        // and approve each one. Expert campaigns start empty — the user adds
        // their own bookings, and the to-do engine flags that until they do.
        if (row.mode === 'preset') {
          const bookings = assistedBookings[row.engine] ?? [];
          const perBooking = bookings.length > 0 ? Math.floor(rowBudget / bookings.length) : 0;
          bookings.forEach((b) => {
            createBooking({
              campaignId: campaign.id,
              name: b.name,
              // Prefilled, not yet checked by anyone — approving it in the
              // booking wizard is what puts it in option.
              status: 'draft',
              budget: perBooking,
              spend: 0,
              startDate: campaignStart,
              endDate: campaignEnd,
              positionIds: [b.positionId],
              // The advertiser still has to supply the creative.
              creativeStatus: 'missing',
            });
          });
        }
      });

      // Existing campaigns chosen on the last step move under the new plan.
      linkedExistingIds.forEach((id) => updateCampaign(id, { mediaPlanId: plan.id }));
      if (typeof window !== 'undefined') {
        queueToast({ title: 'Media plan created', description: plan.name });
        // Land on the plan's Campaigns & bookings tab (the default): the
        // setup cards there ARE the remaining work, one card per campaign.
        window.location.href = `/campaigns/plan/${plan.id}`;
      }
    };

    // ── Draft persistence ────────────────────────────────────────────────
    // After step 1 the plan exists in the store as a draft carrying the step
    // the user is on, so the overview can show it and clicking it lands back
    // here, mid-wizard. Saved on every step change with whatever is known.
    const [draftPlanId, setDraftPlanId] = React.useState<string | null>(null);

    const draftPatch = () => {
      const db = getDb();
      const iso = (d: Date) => d.toISOString().slice(0, 10);
      const start = dateRange?.from ?? new Date();
      const end = dateRange?.to ?? new Date(start.getTime() + 30 * 86400000);
      const advLabel = advertiserOptions.find((a) => a.value === selectedAdvertiser)?.label;
      const advertiser = db.advertisers.find((a) => a.name === advLabel) ?? db.advertisers[0];
      const brandIds = selectedBrands
        .map((v) => advertiser.brands.find((b) => b.id === `br-${v}` || b.name.toLowerCase() === v.replace(/-/g, ' '))?.id)
        .filter((id): id is string => Boolean(id));
      return {
        name: campaignName || 'New Media plan',
        poNumber: poNumber || undefined,
        advertiserId: advertiser.id,
        brandIds,
        autoBudget,
        goal: selectedGoal ?? undefined,
        objective: selectedObjective ?? undefined,
        kpis: selectedKpis,
        budget: parseFloat(budgetAmount) || 0,
        startDate: iso(start),
        endDate: iso(end),
      };
    };

    /** Move between steps, keeping the stored draft in step with the screen. */
    const goToStep = (step: number) => {
      if (draftPlanId) {
        updateMediaPlan(draftPlanId, { ...draftPatch(), wizardStep: step });
      } else if (step > 0) {
        const plan = createMediaPlan({
          ...draftPatch(),
          status: 'draft',
          wizardStep: step,
          kpis: selectedKpis,
          createdBy: getCurrentUser()?.id,
        });
        setDraftPlanId(plan.id);
      }
      setCurrentStep(step);
    };

    // Arriving with ?plan= resumes that draft where it was left.
    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      const id = new URLSearchParams(window.location.search).get('plan');
      if (!id) return;
      const plan = getDb().mediaPlans.find((p) => p.id === id);
      if (!plan) return;
      setDraftPlanId(plan.id);
      setCampaignName(plan.name === 'New Media plan' ? '' : plan.name);
      setPoNumber(plan.poNumber ?? '');
      setBudgetAmount(plan.budget > 0 ? String(plan.budget) : '');
      setAutoBudget(plan.autoBudget ?? true);
      if (plan.startDate && plan.endDate && plan.budget > 0) {
        setDateRange({ from: new Date(plan.startDate), to: new Date(plan.endDate) });
      }
      if (plan.goal) setSelectedGoal(plan.goal);
      if (plan.objective) setSelectedObjective(plan.objective);
      if (plan.kpis.length) setSelectedKpis(plan.kpis);
      setCurrentStep(plan.wizardStep ?? 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: campaignName || 'Create media plan',
            subtitle: '',
            headerRight: null,
          }}
        >
          <div className="space-y-3">
            {/* Metric cards - always visible, show '-' when no data */}
              {/* One builder for this row and the plan detail page's — the
                  cards, charts and numbers are decided once, so saving the
                  plan changes nothing on screen. The engines split appears as
                  soon as the campaign step gives each proposition a budget. */}
              {(() => {
                const draftBudget = parseFloat(budgetAmount) || 0;
                const days = dateRange?.from && dateRange?.to
                  ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
                  : 0;
                // Planned split: hand-set row budgets, remainder shared —
                // the same arithmetic the save uses.
                const claimed = campaignRows.reduce((sum, r) => sum + (parseFloat(r.budget) || 0), 0);
                const unbudgeted = campaignRows.filter((r) => !(parseFloat(r.budget) > 0)).length;
                const perRow = unbudgeted > 0 ? Math.max(Math.floor((draftBudget - claimed) / unbudgeted), 0) : 0;
                const engineAgg = new Map<string, number>();
                campaignRows.forEach((r) => {
                  const b = parseFloat(r.budget) || perRow;
                  engineAgg.set(r.engine, (engineAgg.get(r.engine) ?? 0) + b);
                });
                const engines = [...engineAgg.entries()]
                  .filter(([, b]) => b > 0)
                  .map(([engine, b]) => ({
                    name: propositions.find((pr) => pr.id === engine)?.name ?? engine,
                    budget: b,
                    color: propositionColor(engine as never),
                  }));
                const stage = selectedGoal ? goalObjectives[selectedGoal]?.stage : undefined;
                // Until the campaign step, the split is the platform's default
                // share, not a decision anyone has made — so the forecast
                // shows as one total and the split charts wait for the step
                // where the split is actually set.
                const splitDecided = currentStep >= 4;
                return (
                  <MetricRow
                    metrics={buildForecastMetrics({ budget: draftBudget, days, engines: splitDecided ? engines : [], stage })}
                    maxVisible={6}
                    defaultVariant="default"
                    removable={false}
                  />
                );
              })()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 min-w-0">

              {/* Step 1: Setup */}
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Setup</CardTitle>
                    <CardDescription>
                      Enter the basic details for your new media plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-name">Media plan name</Label>
                        <Input
                          id="campaign-name"
                          placeholder="e.g. Summer Sale 2026"
                          value={campaignName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
                          hint="Give your media plan a descriptive name to easily identify it later"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="po-number" className="flex items-center gap-1.5">
                          PO number <span className="text-muted-foreground font-normal">(optional)</span>
                          <TooltipProvider delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex cursor-help items-center text-muted-foreground"><Info className="h-3.5 w-3.5" /></span>
                              </TooltipTrigger>
                              <TooltipContent>
                                The purchase order reference from your finance team. Optional now, but it must be filled in before the plan is invoiced.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
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
                      <Button disabled={!isSetupComplete} onClick={() => goToStep(1)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Advertiser */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Advertiser</CardTitle>
                    <CardDescription>
                      Select the advertiser, brand and retail products for this campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <SearchSelectList
                        label="Advertiser"
                        placeholder="Search advertiser…"
                        options={advertiserOptions}
                        value={selectedAdvertiser ? [selectedAdvertiser] : []}
                        onChange={(vals) => setSelectedAdvertiser(vals[0] ?? '')}
                        multiple={false}
                      />
                      <div>
                        <SearchSelectList
                          label="Brands"
                          placeholder="Search brands…"
                          options={brandOptions}
                          value={selectedBrands}
                          onChange={setSelectedBrands}
                        />
                        <div className="text-xs text-muted-foreground mt-1">Choose the brand(s) this campaign will advertise for</div>
                      </div>
                      {/* Retail products — only surfaced once an advertiser and brand
                          are chosen, and only for brands actually carried in the store. */}
                      {selectedAdvertiser && selectedBrands.length > 0 && selectedBrandsHaveRetailProducts && (
                        <RetailProductSelect
                          value={selectedRetailProducts}
                          onChange={setSelectedRetailProducts}
                          optional
                          showCount
                        />
                      )}

                      {/* Recommendations are about what the user is creating,
                          so nothing shows until a retail product is chosen —
                          who the advertiser is doesn't need advice. Insights
                          belong to the plan once it exists, not the wizard. */}
                      {selectedRetailProducts.length > 0 && advertiserStats.categories.length > 1 && (
                        <OptimisationCard
                          items={[
                            {
                              badge: 'Suggestion',
                              tone: 'tip' as const,
                              title: 'Split by category',
                              message: `The selected products span ${advertiserStats.categories.length} categories (${advertiserStats.categories.join(', ')}) — splitting into focused campaigns improves attribution accuracy.`,
                              explain: {
                                stats: [
                                  { label: 'Categories', value: String(advertiserStats.categories.length), sub: 'In this selection' },
                                  { label: 'Products', value: String(advertiserStats.products), sub: 'SKUs in scope' },
                                  { label: 'Attribution', value: 'Per category', sub: 'After the split', tone: 'success' as const },
                                ],
                                insights: [
                                  { title: 'Why split', text: 'One campaign per category keeps sales attribution clean — a click on a beer ad is never credited to a snacks sale.' },
                                  { title: 'What it costs', text: 'Nothing in budget: the same total is spread over more focused campaigns.' },
                                  { title: 'Reversible', text: 'Campaigns can be merged later; attribution history stays with each category.' },
                                ],
                              },
                            },
                          ]}
                        />
                      )}
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => goToStep(0)}>Back</Button>
                      <Button disabled={!isAdvertiserComplete} onClick={() => goToStep(2)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Goals & targets */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Goal and objectives</CardTitle>
                    <CardDescription>
                      Select your media plan goal, the objective the plan is judged on, and the audience to target
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label className="mb-3 block">Media plan goal</Label>
                        <div
                          ref={goalGridRef}
                          // auto-rows-fr so the reserved height is shared by the
                          // rows rather than pooling as dead space underneath.
                          className="grid grid-cols-1 gap-2 sm:auto-rows-fr sm:grid-cols-2"
                          style={{ minHeight: goalGridHeight ?? undefined }}
                        >
                          {goals.map((goal) => (
                            <GoalCard
                              key={goal.id}
                              icon={goal.icon}
                              title={goal.title}
                              description={goal.description}
                              /**
                               * The KPI list narrows as the choice is made. With
                               * no goal picked the cards list their KPIs so the
                               * goals can be compared on them; once one is
                               * picked the others drop theirs, because none of
                               * those KPIs is available any more. The chosen
                               * card then narrows again to what its objective
                               * allows.
                               */
                              kpis={selectedGoal === null
                                ? goalKpis[goal.id]
                                : selectedGoal !== goal.id
                                  ? undefined
                                  : selectedObjective
                                    ? kpiPoolFor(goal.id, selectedObjective)
                                    : goalKpis[goal.id]}
                              highlightKpis={selectedGoal === goal.id ? selectedKpis : []}
                              selected={selectedGoal === goal.id}
                              onClick={() => { setSelectedGoal(goal.id); setSelectedObjective(null); setSelectedStudies([]); }}
                            />
                          ))}
                        </div>
                      </div>
                      {selectedGoal && goalObjectives[selectedGoal] && (
                        <div>
                          <SearchSelectList
                            label="Objective"
                            placeholder="Search objective…"
                            options={goalObjectives[selectedGoal].objectives.map((o) => ({ value: o, label: o, description: describeObjective(o) }))}
                            value={selectedObjective ? [selectedObjective] : []}
                            onChange={(vals) => { setSelectedObjective(vals[0] ?? null); setSelectedStudies([]); }}
                            multiple={false}
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {goalObjectives[selectedGoal].stage} stage — pick the one objective the plan is judged on.
                          </div>
                        </div>
                      )}
                      {selectedGoal && selectedObjective && goalObjectives[selectedGoal] && (() => {
                        const stage = goalObjectives[selectedGoal].stage;
                        /**
                         * Every objective is judged on a KPI, so every objective
                         * offers one. Brand objectives pick from their own
                         * brand-lift KPIs; a Conversion objective has none of
                         * those, so it picks from the goal's outcome KPIs —
                         * the same list its goal card shows. Only brand KPIs
                         * can carry a brand-lift study, which is what the
                         * add-on below keys off.
                         */
                        const brandOptions = (objectiveBrandKpis[selectedObjective] ?? funnelKpis[stage]?.brand ?? [])
                          .filter((k) => (funnelKpis[stage]?.brand ?? []).includes(k));
                        const kpiOptions = kpiPoolFor(selectedGoal, selectedObjective);
                        const activeKpis = selectedKpis.filter((k) => kpiOptions.includes(k));
                        const budgetNum = parseFloat(budgetAmount) || 0;
                        if (kpiOptions.length === 0) return null;
                        return (
                          <div className="space-y-2">
                            <SearchSelectList
                              label="KPI"
                              placeholder="Search KPI…"
                              multiple={false}
                              options={kpiOptions.map((k) => ({ value: k, label: k, description: describeKpi(k) }))}
                              value={activeKpis}
                              onChange={(vals) => {
                                setSelectedKpis(vals);
                                setSelectedStudies(selectedStudies.filter((n) => vals.includes(n)));
                              }}
                              renderSelectedExtra={(opt) => {
                                const kpi = opt.value;
                                const pricing = studyPricing[kpi];
                                const isSelected = selectedStudies.includes(kpi);
                                const isFree = pricing ? budgetNum >= pricing.freeThreshold : false;
                                return (
                                  <div className="space-y-3">
                                    {/* What choosing this KPI commits the plan to.
                                        It is a property of the KPI, so it sits in
                                        the KPI's own card; the study below is an
                                        optional paid extra and keeps its own box. */}
                                    <p className="text-xs text-muted-foreground">
                                      The plan is optimised for {kpi} alone. Everything else stays measured and
                                      reported, but delivery is never steered towards it.
                                    </p>
                                    {/* Sales KPIs are attributed from the data
                                        rather than surveyed — no study to sell. */}
                                    {pricing && (
                                      <div className="space-y-1 rounded-md border border-surface-selected-border bg-surface-selected p-3">
                                        <label className="flex cursor-pointer items-center gap-2.5">
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(c) => setSelectedStudies(c ? [...selectedStudies, kpi] : selectedStudies.filter((n) => n !== kpi))}
                                          />
                                          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                            <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                                            Add a brand-lift study
                                            <span className="font-normal text-muted-foreground">{isFree ? '· included' : `· +€${pricing.fee.toLocaleString()}`}</span>
                                          </span>
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                          Measures the uplift this KPI drives against a control group.{' '}
                                          {isFree ? 'Included at your current budget.' : `Free above €${(pricing.freeThreshold / 1000).toFixed(0)}k of spend.`}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              }}
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              Pick the KPI {selectedObjective} is judged on.{' '}
                              {brandOptions.length > 0
                                ? 'It can be measured with a matching brand-lift study.'
                                : 'Conversion KPIs are attributed from sales data — no study needed.'}
                            </div>
                          </div>
                        );
                      })()}
                      {/* Audience comes after the KPI, because the goal and its
                          KPI decide who is worth reaching. A conversion-stage
                          objective has no brand KPI to pick, so for those the
                          objective itself is the gate. */}
                      {(() => {
                        const stage = selectedGoal ? goalObjectives[selectedGoal]?.stage : undefined;
                        const hasKpiStep = !!selectedObjective && stage
                          ? (objectiveBrandKpis[selectedObjective] ?? funnelKpis[stage]?.brand ?? [])
                              .filter((k) => (funnelKpis[stage]?.brand ?? []).includes(k)).length > 0
                          : false;
                        const ready = !!selectedObjective && (!hasKpiStep || selectedKpis.length > 0);
                        if (!ready) return null;
                        return (
                          <SearchSelectList
                            label="Audience segments (optional)"
                            placeholder="Search audience segments…"
                            icon={<Users className="h-4 w-4" />}
                            options={audienceOptions.map((a) => ({ value: a.id, label: a.label, description: `Reach ${a.reach} · ${a.description}` }))}
                            value={selectedAudiences}
                            onChange={setSelectedAudiences}
                          />
                        );
                      })()}
                      {/* Only recommendations about the choices being made on
                          this step, each with its case. What a goal means for
                          KPIs is explained by the selection UI itself. */}
                      {selectedGoal && selectedObjective && goalObjectives[selectedGoal] && (selectedAudiences.length === 0 || (getStudiesForStage(goalObjectives[selectedGoal].stage).length > 0 && selectedStudies.length === 0)) && (
                      <OptimisationCard
                        items={[
                          ...(selectedAudiences.length === 0
                            ? [{
                                badge: 'Suggestion', tone: 'tip' as const,
                                title: 'Add an audience',
                                message: 'Add one or more audience segments — reach becomes estimable and the plan can be priced against a real pool of shoppers.',
                                explain: {
                                  stats: [
                                    { label: 'Audiences', value: '0', sub: 'Selected' },
                                    { label: 'Est. reach', value: '—', sub: 'Needs an audience' },
                                    { label: 'Largest pool', value: `${audienceOptions[0]?.reach ?? '—'}`, sub: audienceOptions[0]?.label ?? '' },
                                  ],
                                  insights: [
                                    { title: 'Why it matters', text: 'Without an audience the plan targets everyone, which prices like no one — reach, frequency and CPM all stay unknown.' },
                                    { title: 'Start broad', text: 'One broad segment is enough to estimate; narrower ones can be layered on later.' },
                                  ],
                                },
                              }]
                            : []),
                          ...(getStudiesForStage(goalObjectives[selectedGoal].stage).length > 0 && selectedStudies.length === 0
                            ? [{
                                badge: 'Suggestion', tone: 'tip' as const,
                                title: 'Add a brand-lift study',
                                message: `Add a brand-lift study to prove ${selectedObjective} — most are free once your media budget passes €25k.`,
                                explain: {
                                  stats: [
                                    { label: 'Objective', value: selectedObjective ?? '—', sub: 'To prove' },
                                    { label: 'Method', value: 'Pre/post', sub: 'Matched control group' },
                                    { label: 'Cost', value: 'Free', sub: 'Above €25k budget', tone: 'success' as const },
                                  ],
                                  insights: [
                                    { title: 'Why now', text: 'A study must start with the flight — added afterwards there is no clean pre-measurement to compare against.' },
                                    { title: 'What you get', text: `Evidence that ${selectedObjective ?? 'the objective'} actually moved, not just that media was delivered.` },
                                  ],
                                },
                              }]
                            : []),
                        ]}
                      />
                      )}
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => goToStep(1)}>Back</Button>
                      <Button disabled={!isTargetingComplete} onClick={() => goToStep(3)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Run time & budget */}
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
                          showWeekNumbers
                          events={retailMoments}
                          presets={futureDateRangePresets}
                        />
                        <FieldHint>Your campaign will automatically start and stop on the selected dates</FieldHint>
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
                        <FieldHint>The maximum total amount for the entire campaign duration</FieldHint>
                      </div>
                      <OptimisationCard
                        assisted={assistedExperience}
                        onToggle={setAssisted}
                        items={(() => {
                          // Accepted advice leaves the list rather than
                          // returning as an "it's on" insight — insights wait
                          // for the plan to exist.
                          const autoBudgetAdvice: Advice[] = autoBudgetOptimization
                            ? []
                            : [{ badge: 'Suggestion', tone: 'tip', title: 'Optimise budget automatically', message: 'Let us distribute your budget automatically across propositions to maximise ROAS (~+18%).', action: { label: 'Set budget to automatic', onClick: () => setAutoBudgetOptimization(true) }, explain: budgetOptimisationExplain() }];
                          if (budgetAmount.trim() === '' || !dateRange?.from || !dateRange?.to) {
                            return [
                              ...(budgetAmount.trim() === ''
                                ? [{ badge: 'Suggestion', tone: 'tip' as const, title: 'Suggested starting budget', message: 'Start with €5,000 — a common budget for plans like this.', action: { label: 'Use €5,000', onClick: () => setBudgetAmount('5000') }, explain: budgetStarterExplain() }]
                                : []),
                              ...autoBudgetAdvice,
                            ];
                          }
                          const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                          const daily = parseFloat(budgetAmount) / days;
                          const items: Advice[] = [];
                          // Silence is the healthy state — a note saying the
                          // pace is fine is noise next to the ones that matter.
                          if (daily < 150) {
                            // A recommendation, not a to-do: nothing is wrong
                            // with the plan, there is a better number on offer
                            // — so it names that number and can be accepted.
                            const suggested = Math.ceil((150 * days) / 500) * 500;
                            items.push({
                              badge: 'Recommendation',
                              tone: 'tip',
                              title: 'Raise the budget for steadier delivery',
                              message: `At €${daily.toFixed(0)}/day over ${days} days delivery may be thin. €${suggested.toLocaleString()} lifts it to about €150/day, the point where frequency builds.`,
                              action: { label: `Use €${suggested.toLocaleString()}`, onClick: () => setBudgetAmount(String(suggested)) },
                              explain: budgetStarterExplain(),
                            });
                          }
                          items.push(...autoBudgetAdvice);
                          if (days < 21) {
                            items.push({
                              badge: 'Suggestion', tone: 'tip', title: 'Consider a longer flight',
                              message: 'Flights of 3+ weeks build the frequency needed for awareness and consideration goals.',
                              explain: {
                                stats: [
                                  { label: 'Flight', value: `${days} days`, sub: 'As planned' },
                                  { label: 'Recommended', value: '21+ days', sub: 'For frequency build-up' },
                                  { label: 'Frequency', value: `~${Math.max(1, Math.round(days / 7))}×`, sub: 'Per shopper at this length' },
                                ],
                                insights: [
                                  { title: 'Why longer', text: 'Awareness works by repetition — a shopper needs several exposures before a brand registers, and short flights end before that builds.' },
                                  { title: 'Same budget', text: 'Stretching the flight does not need more budget; the same total spread thinner per day usually beats a loud, short burst.' },
                                ],
                              },
                            });
                          }
                          return items;
                        })()}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => goToStep(2)}>Back</Button>
                      <Button disabled={!isBudgetComplete} onClick={() => goToStep(4)}>
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
                      The campaigns in this plan — add one per proposition. Assisted campaigns come prefilled by the AI presets; expert campaigns start blank.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Campaign rows — one row per campaign, so a proposition
                          can hold several. Assisted rows show the prefilled
                          set-up (placements, run time, budget share); expert
                          rows carry the campaign form to fill in. */}
                      {campaignRows.map((row) => {
                        const prop = propositions.find((p) => p.id === row.engine);
                        if (!prop) return null;
                        const isAssisted = row.mode === 'preset';
                        const IconComponent = prop.icon;
                        const prefill = `${campaignName || 'New Media plan'} — ${prop.name}`;
                        // The bookings an assisted campaign creates on launch.
                        const rowBookings = assistedBookings[row.engine] ?? [];
                        // Inventory check: how contested each proposed position
                        // is, counted from real bookings on the same position
                        // whose flight overlaps this plan's window.
                        const availabilityOf = (positionId: string) => {
                          const from = (row.dateRange?.from ?? dateRange?.from)?.getTime();
                          const to = (row.dateRange?.to ?? dateRange?.to)?.getTime();
                          const clashes = getDb().bookings.filter((b) => {
                            if (!b.positionIds.includes(positionId)) return false;
                            if (b.status !== 'running' && b.status !== 'in-option') return false;
                            if (!from || !to) return true;
                            return new Date(b.startDate).getTime() <= to && new Date(b.endDate).getTime() >= from;
                          }).length;
                          return clashes <= 1 ? 'available' as const : clashes <= 2 ? 'limited' as const : 'tight' as const;
                        };
                        const availability = rowBookings.map((b) => ({ ...b, availability: availabilityOf(b.positionId) }));
                        const worstAvailability = availability.some((b) => b.availability === 'tight')
                          ? 'tight' : availability.some((b) => b.availability === 'limited') ? 'limited' : 'available';
                        // Budget share: this row's own budget, or an even split of
                        // whatever the plan budget has left for unbudgeted rows.
                        const planBudget = parseFloat(budgetAmount) || 0;
                        const claimed = campaignRows.reduce((s, r) => s + (parseFloat(r.budget) || 0), 0);
                        const unbudgeted = campaignRows.filter((r) => !(parseFloat(r.budget) > 0)).length;
                        const share = parseFloat(row.budget) || (unbudgeted > 0 ? Math.max(Math.floor((planBudget - claimed) / unbudgeted), 0) : 0);
                        const runTime = row.dateRange?.from && row.dateRange?.to
                          ? `${row.dateRange.from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → ${row.dateRange.to.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : dateRange?.from && dateRange?.to
                            ? `${dateRange.from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → ${dateRange.to.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : 'Inherits the plan run time';
                        return (
                          <div key={row.id} className="rounded-lg border border-border p-4 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary text-primary-foreground flex-shrink-0">
                                <IconComponent size={14} />
                              </div>
                              <span className="text-sm font-medium">{prop.name} campaign</span>
                              {/* Mode toggle — it both shows and sets the mode, so
                                  the header needs no extra badge. */}
                              <label className="ml-auto flex shrink-0 cursor-pointer items-center gap-2">
                                <Switch
                                  checked={isAssisted}
                                  onCheckedChange={(checked: boolean) => updateRow(row.id, { mode: checked ? 'preset' : 'expert' })}
                                  aria-label={`${prop.name} campaign mode`}
                                />
                                {/* Fixed width: "Assisted" and "Expert" differ,
                                    and the word deciding where the toggle sits
                                    made the whole header twitch on flip. */}
                                <span className={cn('w-14 text-xs', isAssisted ? 'font-medium text-primary' : 'text-muted-foreground')}>
                                  {isAssisted ? 'Assisted' : 'Expert'}
                                </span>
                              </label>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                aria-label={`Remove ${prop.name} campaign`}
                                onClick={() => removeRow(row.id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>

                            {isAssisted ? (
                              /* Assisted keeps the decisions and drops the
                                 detail: name it, see when it runs, what it
                                 costs, what it should deliver, and whether
                                 there is still room to buy. The bookings the
                                 preset creates are the platform's business —
                                 they appear on the campaign once it exists. */
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label>Campaign name</Label>
                                  <Input
                                    value={row.name}
                                    placeholder={prefill}
                                    onChange={(e) => updateRow(row.id, { name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                <Label>Campaign summary</Label>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md border border-border px-3 py-2">
                                  <span className="text-xs tabular-nums text-muted-foreground">
                                    {runTime} · {share > 0 ? `€${share.toLocaleString()}` : 'no budget set'} · ~{prop.aiPreset.estImpressions} impressions
                                  </span>
                                  <span className="ml-auto flex items-center gap-2">
                                    <LevelMeter
                                      className="shrink-0"
                                      label="Volume"
                                      tone="supply"
                                      level={worstAvailability === 'available' ? 4 : worstAvailability === 'limited' ? 2 : 1}
                                    />
                                    {worstAvailability !== 'available' && (
                                      <span className="text-[11px] text-muted-foreground">
                                        {worstAvailability === 'limited' ? 'Book early to secure' : 'Nearly booked out'}
                                      </span>
                                    )}
                                  </span>
                                </div>
                                </div>
                              </div>
                            ) : (
                              /* Expert mode — the campaign form, nothing else.
                                 Bookings are made on the campaign after the
                                 plan is created. */
                              <div className="grid grid-cols-1 gap-x-2 gap-y-3 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                  <Label>Campaign name</Label>
                                  <Input
                                    value={row.name}
                                    placeholder="Name the campaign"
                                    onChange={(e) => updateRow(row.id, { name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Campaign budget</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={row.budget}
                                    placeholder={share > 0 ? String(share) : 'Enter budget amount'}
                                    onChange={(e) => updateRow(row.id, { budget: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Campaign run time</Label>
                                  <DateRangePicker
                                    dateRange={row.dateRange}
                                    onDateRangeChange={(r) => updateRow(row.id, { dateRange: r })}
                                    placeholder="Inherits the plan run time"
                                    showPresets
                                    presets={futureDateRangePresets}
                                    className="w-full"
                                  />
                                </div>
                                {/* How this campaign buys — the same choice,
                                    the same control, as the campaign wizard's
                                    own setup step. */}
                                <div className="sm:col-span-2">
                                  <BuyingTypePicker
                                    value={row.buyingType}
                                    onChange={(v) => updateRow(row.id, { buyingType: v })}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Add campaign — a proposition can be added more than once. */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="w-full rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all p-3 flex items-center gap-3"
                          >
                            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-muted text-muted-foreground flex-shrink-0">
                              <Plus size={14} />
                            </div>
                            <span className="text-sm text-muted-foreground">Add campaign</span>
                          </button>
                        </DropdownMenuTrigger>
                        {/* Pick the proposition — the campaign starts in expert
                            mode; its row toggle switches it to assisted. Matches
                            the searchable-select dropdown: full trigger width,
                            each option with a subline. */}
                        <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] p-0">
                          {propositions.map((prop) => {
                            const count = campaignRows.filter((r) => r.engine === prop.id).length;
                            return (
                              <DropdownMenuItem
                                key={prop.id}
                                onClick={() => setCampaignRows((prev) => [...prev, makeRow(prop.id, 'expert')])}
                                className="cursor-pointer flex-col items-start gap-0.5 rounded-none border-b p-3 last:border-b-0"
                              >
                                <span className="flex w-full items-center gap-2">
                                  <span className="text-sm font-medium">{prop.name}</span>
                                  {count > 0 && (
                                    <span className="ml-auto text-xs text-muted-foreground">{count} added</span>
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">{prop.description}</span>
                              </DropdownMenuItem>
                            );
                          })}
                          <DropdownMenuItem
                            onClick={() => setLinkExistingOpen(true)}
                            className="cursor-pointer flex-col items-start gap-0.5 rounded-none p-3"
                          >
                            <span className="flex w-full items-center gap-2">
                              <Link2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Add existing campaign…</span>
                            </span>
                            <span className="text-xs text-muted-foreground">Move a campaign that already exists into this plan.</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* The existing campaigns this plan will absorb on save. */}
                      {linkedExistingIds.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {linkedExistingIds.map((id) => {
                            const c = getDb().campaigns.find((x) => x.id === id);
                            if (!c) return null;
                            return (
                              <div key={id} className="flex items-center justify-between gap-3 rounded-md border border-surface-selected-border bg-surface-selected p-3">
                                <span className="min-w-0">
                                  <span className="flex items-center gap-1.5 text-sm font-medium">
                                    <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                    <span className="truncate">{c.name}</span>
                                  </span>
                                  <span className="mt-0.5 block text-xs text-muted-foreground">
                                    Existing campaign · joins this plan on save
                                  </span>
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  iconOnly
                                  aria-label={`Remove ${c.name}`}
                                  onClick={() => setLinkedExistingIds((prev) => prev.filter((x) => x !== id))}
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <LinkPickerDialog
                        open={linkExistingOpen}
                        onOpenChange={setLinkExistingOpen}
                        entityLabel="campaign"
                        options={existingCampaignOptions}
                        onChange={(id) => { if (id) setLinkedExistingIds((prev) => [...prev, id]); }}
                      />
                    </div>
                    {/* One recommendation when the mix leaves reach on the
                        table; mode counts and projections are insights and
                        wait for the plan to exist. */}
                    {propositions.length - propositionImpact.selectedCount > 0 && (
                    <div className="mt-6">
                      <OptimisationCard
                        items={(() => {
                          const missing = propositions.length - propositionImpact.selectedCount;
                          const missingNames = propositions.filter((prop) => !campaignRows.some((r) => r.engine === prop.id)).map((prop) => prop.name);
                          return [{
                            badge: 'Suggestion', tone: 'tip' as const,
                            title: 'Propositions missing',
                            message: `${missing} proposition${missing === 1 ? '' : 's'} not in this plan — adding a campaign for them brings incremental reach for the same audience.`,
                            explain: {
                              stats: [
                                { label: 'In the plan', value: String(propositionImpact.selectedCount), sub: 'Propositions' },
                                { label: 'Missing', value: String(missing), sub: missingNames.slice(0, 2).join(', ') || 'None' },
                                { label: 'Extra reach', value: `+${(missing * 1.1).toFixed(1)}M`, sub: 'Est. if all added', tone: 'success' as const },
                              ],
                              insights: [
                                { title: 'Same audience, new surfaces', text: 'Each proposition reaches the audience in a different moment — adding one extends reach without buying the same impression twice.' },
                                { title: 'Budget still yours', text: 'Adding a campaign does not raise the plan budget; the split across campaigns is set on each row.' },
                              ],
                            },
                          }];
                        })()}
                      />
                    </div>
                    )}
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => goToStep(3)}>Back</Button>
                      <Button onClick={createMediaPlanFlow}>
                        Save media plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help for the step the user is on. The retailer writes these in
                  Configuration → FAQ & help; nothing renders when there is
                  nothing written for this step. */}

            </div>

            {/* Summary sidebar */}
            <div className="flex flex-col gap-4">
              {/* The same process card every wizard draws its timeline with. */}
              <SummaryCard
                title="Media plan"
                entity="media-plan"
                variant="process"
                steps={wizardSteps.map((step, index) => {
                  const status = getStepStatus(step.id, index);
                  const stepValues = getStepValues(step.id);
                  return {
                    id: step.id,
                    label: step.label,
                    status,
                    values: stepValues && stepValues.length > 0 ? stepValues : undefined,
                    onClick: status === 'completed' ? () => goToStep(index) : undefined,
                  };
                })}
                actions={currentStep === wizardSteps.length - 1 ? [{ label: 'Save media plan', onClick: createMediaPlanFlow }] : undefined}
              />
            </div>
          </div>
          </div>
        </AppLayout>
      </MenuContextProvider>
    );
  },
};

// --- Wizard Steps without Goal and Targeting ---
const wizardStepsNoGoalTargeting = [
  { id: 'setup', label: 'Campaign setup' },
  { id: 'budget', label: 'Run time & budget' },
  { id: 'review', label: 'Media plan' },
];

export const NoGoalTargeting: Story = {
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

    // Step 2: Run time & Budget (was step 4)
    const [budgetAmount, setBudgetAmount] = React.useState('');
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
    const [autoBudgetOptimization, setAutoBudgetOptimization] = React.useState(true);

    // Step 3: Media plan (was step 5)
    const [propositionSelections, setPropositionSelections] = React.useState<Record<string, { mode: 'preset' | 'empty'; presetId?: string } | null>>(() => {
      const defaults: Record<string, { mode: 'preset' | 'empty'; presetId?: string }> = {};
      propositions.forEach(p => { defaults[p.id] = { mode: 'preset', presetId: p.aiPreset.id }; });
      return defaults;
    });

    // Derived data
    const selectedBrandData = brandOptions.find((b) => b.value === selectedBrand);

    // Step completion checks
    const isSetupComplete = campaignName.trim() !== '' && selectedBrand !== '';
    const isBudgetComplete = budgetAmount.trim() !== '' && dateRange?.from !== undefined && dateRange?.to !== undefined;

    const isCurrentStepComplete = [isSetupComplete, isBudgetComplete, true][currentStep] ?? false;

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

    // Proposition impact on metrics
    const propositionImpact = React.useMemo(() => {
      let additionalReach = 0;
      let roasBoost = 0;
      let additionalSales = 0;
      let selectedCount = 0;

      Object.entries(propositionSelections).forEach(([propId, sel]) => {
        if (!sel) return;
        selectedCount++;
        if (sel.mode === 'empty') return;
        const prop = propositions.find(p => p.id === propId);
        if (!prop) return;
        const reachStr = prop.metrics.reach;
        if (reachStr.endsWith('M')) {
          additionalReach += parseFloat(reachStr.replace('M', ''));
        } else if (reachStr.endsWith('K')) {
          additionalReach += parseFloat(reachStr.replace('K', '')) / 1000;
        }
        const roasChangeNum = parseFloat(prop.metrics.roasChange.replace('%', '').replace('+', ''));
        roasBoost += roasChangeNum;
        const salesNum = parseFloat(prop.metrics.sales.replace('€', '').replace(',', ''));
        additionalSales += salesNum;
      });

      return { additionalReach, roasBoost, additionalSales, selectedCount };
    }, [propositionSelections]);

    // Get step value for summary
    const getStepValue = (stepId: string): string | null => {
      switch (stepId) {
        case 'setup':
          if (isSetupComplete) return `${campaignName} · ${selectedBrandData?.label}`;
          return null;
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

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => alert('Logout clicked')}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: campaignName || 'Create media plan',
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
                    value: propositionImpact.selectedCount > 0
                      ? forecastRange(propositionImpact.additionalReach, (n) => n.toFixed(1), 'M')
                      : '-',
                    subMetric: propositionImpact.selectedCount > 0
                      ? `${propositionImpact.selectedCount} proposition${propositionImpact.selectedCount !== 1 ? 's' : ''}`
                      : 'No propositions selected',
                    badgeValue: propositionImpact.additionalReach > 0 ? `${propositionImpact.additionalReach.toFixed(1)}M` : undefined,
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
                          const baseRoas = 2.4 + (parseFloat(budgetAmount) > 5000 ? 1.2 : parseFloat(budgetAmount) > 2000 ? 0.6 : 0);
                          const boostedRoas = baseRoas * (1 + propositionImpact.roasBoost / 100);
                          return forecastRange(boostedRoas, (n) => n.toFixed(1), 'x');
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
                          const baseRoas = 2.4 + (parseFloat(budgetAmount) > 5000 ? 1.2 : parseFloat(budgetAmount) > 2000 ? 0.6 : 0);
                          const baseSales = parseFloat(budgetAmount) * baseRoas;
                          const totalSales = baseSales + propositionImpact.additionalSales;
                          return '€' + forecastRange(totalSales, (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n)));
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
                      Enter the basic details for your new media plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-name-ng">Media plan name</Label>
                        <Input
                          id="campaign-name-ng"
                          placeholder="e.g. Summer Sale 2026"
                          value={campaignName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
                          hint="Give your media plan a descriptive name to easily identify it later"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand-ng">Brand</Label>
                        <Input
                          dropdown
                          options={brandOptions}
                          value={selectedBrand}
                          onChange={(value: string) => setSelectedBrand(value)}
                          placeholder="Select a brand"
                        />
                        <div className="text-xs text-muted-foreground mt-1">Choose the brand this campaign will advertise for</div>
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

              {/* Step 2: Run time & Budget */}
              {currentStep === 1 && (
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
                          showWeekNumbers
                          events={retailMoments}
                          presets={futureDateRangePresets}
                        />
                        <FieldHint>Your campaign will automatically start and stop on the selected dates</FieldHint>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget-amount-ng">Total budget</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                          <Input
                            id="budget-amount-ng"
                            type="number"
                            placeholder="e.g. 5000"
                            value={budgetAmount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudgetAmount(e.target.value)}
                            className="pl-7"
                          />
                        </div>
                        <FieldHint>The maximum total amount for the entire campaign duration</FieldHint>
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

                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(0)}>Back</Button>
                      <Button disabled={!isBudgetComplete} onClick={() => setCurrentStep(2)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Media plan */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Media plan</CardTitle>
                    <CardDescription>
                      Toggle propositions on or off, then choose an Assisted campaign (pre-set placements) or Expert mode (set it up yourself).
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
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <Sparkles size={14} className="text-primary flex-shrink-0" />
                                      <span className="text-sm font-medium">Assisted campaign</span>
                                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">Recommended</span>
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
                                      <span className="text-sm font-medium">Expert mode</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      Set up the {prop.name.toLowerCase()} campaign yourself — full control over placements, budget and targeting.
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
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                      <Button
                        onClick={() => {
                          const name = campaignName || 'New Media plan';
                          window.location.href = `/campaigns?new=${encodeURIComponent(name)}`;
                        }}
                      >
                        Save media plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help for the step the user is on. The retailer writes these in
                  Configuration → FAQ & help; nothing renders when there is
                  nothing written for this step. */}

            </div>

            {/* Summary sidebar */}
            <div className="flex flex-col gap-4">
              <CardSummary>
                <CardHeader>
                  <CardSummaryTitle>Media plan</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  <div className="relative pl-12">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border"></div>

                    <div className="space-y-4">
                      {wizardStepsNoGoalTargeting.map((step, index) => {
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
                              {status === 'completed' && stepValue ? (
                                <div className="text-sm text-muted-foreground mt-0.5">{stepValue}</div>
                              ) : status === 'active' ? (
                                <div className="text-xs text-muted-foreground italic mt-0.5">
                                  {step.id === 'setup' ? 'Not filled in' : 'Not selected'}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardSummaryContent>
                {currentStep === wizardStepsNoGoalTargeting.length - 1 && (
                  <div className="px-4 pb-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const name = campaignName || 'New Media plan';
                        const params = new URLSearchParams({ new: name });
                        if (budgetAmount) params.set('budget', budgetAmount);
                        if (dateRange?.from) params.set('startDate', dateRange.from.toISOString());
                        if (dateRange?.to) params.set('endDate', dateRange.to.toISOString());
                        window.location.href = `/campaigns?${params.toString()}`;
                      }}
                    >
                      Save media plan
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
  },
  parameters: {
    docs: {
      description: {
        story: `
# Create Media Experience – No Goal & Targeting

A streamlined variant of the Create Media Experience wizard that removes the Goal and Targeting steps. The wizard flows directly from Campaign Setup to Run Time & Budget, and then to Media Plan.

## Steps

1. **Campaign Setup** - Enter the campaign name, select brand, and choose retail products
2. **Run Time & Budget** - Set the campaign schedule and budget with auto-optimization
3. **Media Plan** - Toggle propositions and choose AI presets or empty campaigns

## Differences from Standard Wizard

- **No Campaign Goal step** (Step 2 removed)
- **No Targeting step** (Step 3 removed)
- **3-step wizard** instead of 5 steps
- Metric cards do not include audience-based reach calculations
- Summary sidebar shows only 3 steps

## Use Cases

- Platforms where goal and targeting are pre-configured or managed separately
- Simplified campaign creation workflows
- Quick campaign setup focused on budget and media selection
        `,
      },
    },
  },
};
