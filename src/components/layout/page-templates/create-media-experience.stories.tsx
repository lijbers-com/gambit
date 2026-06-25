import type { Meta, StoryObj } from '@storybook/react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle } from '@/components/ui/card';
import { MetricRow } from '@/components/ui/metric-row';
import type { MetricDefinition } from '@/components/ui/metric-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import { RetailProductSelect } from '@/components/ui/retail-product-select';
import { OptimisationCard, type Advice } from '@/components/ui/optimisation-card';
import { Filter } from '@/components/ui/filter';
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
  Minus,
  Info,
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

// Objectives per goal, following the funnel → objective framework. The chosen
// objective drives the KPIs the plan is judged on. Purchase and Loyalty are
// Conversion-stage goals.
const goalObjectives: Record<string, { stage: string; objectives: string[] }> = {
  awareness: { stage: 'Awareness', objectives: ['Merkbekendheid', 'Productbekendheid', 'Merk associaties'] },
  consideration: { stage: 'Consideration', objectives: ['Verhogen merk/product overweging', 'Merk associaties', 'Nieuwe klanten', 'Merkvoorkeur', 'Aankoopintentie'] },
  purchase: { stage: 'Conversion', objectives: ['Sales', 'Promotie ondersteuning'] },
  loyalty: { stage: 'Conversion', objectives: ['Sales', 'Promotie ondersteuning'] },
};

// Demo estimates for the headline KPIs we surface in the metric row as the
// plan is built. Only KPIs with an estimate here are promoted to a metric card.
const kpiEstimates: Record<string, { value: string; sub: string }> = {
  'Bereik': { value: '21.6M', sub: 'Estimated reach' },
  'Frequentie': { value: '3.4', sub: 'Avg. per shopper' },
  'CTR': { value: '0.84%', sub: 'vs. 0.7% target' },
  'CPM': { value: '€4.50', sub: 'Blended' },
  'VCR': { value: '68%', sub: 'Video completion' },
  'Conversion rate': { value: '2.1%', sub: 'Estimated' },
  '(i)ROAS': { value: '3.8×', sub: 'Incremental' },
  'Sales lift': { value: '+12%', sub: 'vs. baseline' },
};

// KPIs the plan is judged on per funnel stage (the funnel → KPI framework).
// Awareness has no Sales KPIs; Conversion has no standalone Brand KPIs.
const funnelKpis: Record<string, { brand: string[]; media: string[]; sales: string[] }> = {
  Awareness: {
    brand: ['Top of Mind Awareness', 'Spontane merk/productbekendheid', 'Geholpen merk/productbekendheid', 'Reclamebekendheid (Ad-recall)', 'CEP', 'Merk associaties/waardes'],
    media: ['Bereik', 'Uniek bereik', 'Frequentie', 'Average time on page', 'Scroll depth', 'VCR', 'CTR', 'CPM', 'SOV (categorie)', 'Post Engagement rate (social)'],
    sales: [],
  },
  Consideration: {
    brand: ['Merk/product overweging', 'Merk associaties/waardes', 'Merkvoorkeur', 'Aankoopintentie'],
    media: ['Bereik', 'Uniek bereik', 'Frequentie', 'Average time on page', 'Scroll depth', 'VCR', 'CTR', 'CPM', 'SOV (categorie)', 'Post Engagement rate (social)', 'Conversion rate'],
    sales: ['Sales lift', 'Trial (New to product)', 'New to brand', 'New to Category', 'Koop frequentie', 'Recept in favorieten (allerhande only)'],
  },
  Conversion: {
    brand: [],
    media: ['Bereik', 'Uniek bereik', 'Frequentie', 'Average time on page', 'Scroll depth', 'VCR', 'CTR', 'CPM', 'SOV (categorie)', 'Post Engagement rate (social)', 'Conversion rate'],
    sales: ['Sales lift', '(i)ROAS', 'Sales online', 'Sales offline', 'New to brand', 'New to Category', 'Sales driver: existing customers (i)', 'Sales driver: sales per customer (i)', 'CLV', 'Redemptie (loyalty product only)', 'Basket size (SIS only)', 'Share of basket (SIS only)', 'Trial (New to product)', 'Repeat', 'Koop frequentie', 'Terugwinnen klanten'],
  },
};



const advertiserOptions = [
  { label: 'Acme Media', value: 'acme-media' },
  { label: 'Brand Alliance', value: 'brand-alliance' },
  { label: 'Global Brands Co.', value: 'global-brands' },
  { label: 'Unilever Shopper Marketing', value: 'unilever-shopper' },
  { label: 'Nestlé Trade Marketing', value: 'nestle-trade' },
];

// Brands carry lightweight first-party-style metrics so the assisted panels can
// surface real numbers and optimisation hints instead of generic copy.
const brandOptions = [
  { label: 'Coca-Cola', value: 'coca-cola', category: 'Soft drinks', reach: 6.4, roas: 4.1 },
  { label: 'Unilever', value: 'unilever', category: 'FMCG', reach: 8.1, roas: 3.6 },
  { label: 'Procter & Gamble', value: 'procter-gamble', category: 'Personal care', reach: 7.2, roas: 3.9 },
  { label: 'Nestlé', value: 'nestle', category: 'Food', reach: 7.8, roas: 3.4 },
  { label: 'PepsiCo', value: 'pepsico', category: 'Snacks & drinks', reach: 6.9, roas: 3.8 },
  { label: 'Heineken', value: 'heineken', category: 'Beer', reach: 5.3, roas: 4.4 },
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
    const [selectedAudiences, setSelectedAudiences] = React.useState<string[]>([]);
    const [tags, setTags] = React.useState<string[]>([]);
    const [tagInput, setTagInput] = React.useState('');

    // Step 5: Media plan - proposition selections
    // Each key is a proposition id, value is 'preset' | 'empty' | null, plus selected preset id
    // Default: all propositions selected with AI preset
    const [propositionSelections, setPropositionSelections] = React.useState<Record<string, { mode: 'preset' | 'empty'; presetId?: string } | null>>(() => {
      const defaults: Record<string, { mode: 'preset' | 'empty'; presetId?: string }> = {};
      propositions.forEach(p => { defaults[p.id] = { mode: 'preset', presetId: p.aiPreset.id }; });
      return defaults;
    });

    // Assisted experience — one switch that turns the AI service on or off across
    // the whole plan: per-step guidance, budget optimization, and AI campaign
    // presets. When off, the user builds the plan unassisted (no advice, no
    // suggestions, empty campaigns by default).
    const [assistedExperience, setAssistedExperience] = React.useState(true);
    const setAssisted = (on: boolean) => {
      setAssistedExperience(on);
      if (!on) setAutoBudgetOptimization(false);
      else if (budgetAmount.trim() !== '') setAutoBudgetOptimization(true);
      // Re-point every enabled proposition to an AI preset (on) or empty (off).
      setPropositionSelections((prev) => {
        const next: typeof prev = { ...prev };
        Object.keys(next).forEach((id) => {
          if (!next[id]) return;
          const prop = propositions.find((p) => p.id === id);
          next[id] = on ? { mode: 'preset', presetId: prop?.aiPreset.id } : { mode: 'empty' };
        });
        return next;
      });
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

    // KPIs the plan is judged on (per funnel stage) become metric cards in the
    // top row once a goal + objective are chosen — the row fills in as you go.
    const kpiMetrics = React.useMemo(() => {
      if (!selectedGoal || !selectedObjective || !goalObjectives[selectedGoal]) return [];
      const stage = goalObjectives[selectedGoal].stage;
      const k = funnelKpis[stage];
      return [...k.media, ...k.sales]
        .filter((name) => kpiEstimates[name])
        .slice(0, 4)
        .map((name) => ({ key: `kpi-${name}`, label: name, value: kpiEstimates[name].value, subMetric: kpiEstimates[name].sub }));
    }, [selectedGoal, selectedObjective]);

    // Step completion checks
    const isSetupComplete = campaignName.trim() !== '';
    const isAdvertiserComplete = selectedBrands.length > 0;
    const isBudgetComplete = budgetAmount.trim() !== '' && dateRange?.from !== undefined && dateRange?.to !== undefined;
    const isTargetingComplete = selectedGoal !== null && selectedObjective !== null && selectedAudiences.length > 0;

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
          const selectedCount = Object.values(propositionSelections).filter(Boolean).length;
          if (selectedCount === 0) return null;
          return [`${selectedCount} proposition${selectedCount !== 1 ? 's' : ''} selected`];
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
            title: campaignName || 'Create media plan',
            subtitle: '',
            headerRight: null,
          }}
        >
          <div className="space-y-3">
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
                  // KPIs for the selected funnel stage, added as you progress.
                  ...kpiMetrics,
                ]}
                selectedKeys={['reach', 'budget', 'roas', 'sales', ...kpiMetrics.map((m) => m.key)]}
                maxVisible={4 + kpiMetrics.length}
                defaultVariant="default"
                removable={false}
              />

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
                        <Label htmlFor="po-number">PO number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input
                          id="po-number"
                          placeholder="e.g. PO-123456"
                          value={poNumber}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPoNumber(e.target.value)}
                        />
                      </div>
                      <OptimisationCard
                        assisted={assistedExperience}
                        onToggle={setAssisted}
                        items={[
                          { badge: 'Tip', tone: 'tip', message: 'Keep assisted optimisations on — you get KPI estimates, campaign suggestions and automatic budget optimisation as you build the plan.' },
                        ]}
                      />
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
                        <Label htmlFor="brand">Brands</Label>
                        <Filter
                          name="Select brands"
                          keepName
                          options={brandOptions}
                          selectedValues={selectedBrands}
                          onChange={setSelectedBrands}
                          className="w-full justify-between"
                        />
                        {selectedBrands.length > 0 && (
                          <div className="space-y-1 pt-1">
                            {selectedBrands.map((value) => {
                              const opt = brandOptions.find((b) => b.value === value);
                              return opt ? (
                                <div key={value} className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-2">
                                  <div className="text-sm font-medium">{opt.label}</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedBrands(selectedBrands.filter((v) => v !== value))}
                                    className="h-8 w-8 shrink-0 p-0"
                                    aria-label={`Remove ${opt.label}`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">Choose the brand(s) this campaign will advertise for</div>
                      </div>
                      <RetailProductSelect
                        value={selectedRetailProducts}
                        onChange={setSelectedRetailProducts}
                        optional
                        showCount
                      />
                      <OptimisationCard
                        assisted={assistedExperience}
                        onToggle={setAssisted}
                        items={
                          selectedBrands.length === 0
                            ? [
                                { badge: 'Tip', tone: 'tip', message: 'Pick a brand to unlock reach, category ROAS and product insights.' },
                                { badge: 'AI Insight', tone: 'insight', message: 'First-party data lets us estimate brand reach and category benchmarks instantly.' },
                              ]
                            : [
                                {
                                  badge: 'AI Insight',
                                  tone: 'insight' as const,
                                  message: `${advertiserStats.categories[0]} buyers return ${advertiserStats.roas.toFixed(1)}× on average and reach ~${advertiserStats.reach.toFixed(1)}M shoppers — a strong base for a conversion goal.`,
                                },
                                advertiserStats.products === 0
                                  ? { badge: 'Tip', tone: 'tip' as const, message: 'Add retail products to enable sales attribution and product-level KPIs.' }
                                  : { badge: 'AI Insight', tone: 'success' as const, message: `${advertiserStats.products} SKU${advertiserStats.products === 1 ? '' : 's'} in scope — sales attribution and basket metrics are enabled.` },
                                ...(advertiserStats.categories.length > 1
                                  ? [{ badge: 'Tip', tone: 'tip' as const, message: `Spanning ${advertiserStats.categories.length} categories (${advertiserStats.categories.join(', ')}) — splitting into focused campaigns improves attribution accuracy.` }]
                                  : []),
                              ]
                        }
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(0)}>Back</Button>
                      <Button disabled={!isAdvertiserComplete} onClick={() => setCurrentStep(2)}>
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
                      Select your campaign goal, the objective the plan is judged on, and the audience to target
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                              onClick={() => { setSelectedGoal(goal.id); setSelectedObjective(null); }}
                            />
                          ))}
                        </div>
                      </div>
                      {selectedGoal && goalObjectives[selectedGoal] && (
                        <div className="space-y-2">
                          <Label>Objective</Label>
                          <Filter
                            name="Select objective"
                            keepName
                            options={goalObjectives[selectedGoal].objectives.map((o) => ({ label: o, value: o }))}
                            selectedValues={selectedObjective ? [selectedObjective] : []}
                            onChange={(vals) => setSelectedObjective(vals.length ? vals[vals.length - 1] : null)}
                            className="w-full justify-between"
                          />
                          {selectedObjective && (
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-2">
                                <div className="text-sm font-medium">{selectedObjective}</div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedObjective(null)}
                                  className="h-8 w-8 shrink-0 p-0"
                                  aria-label={`Remove ${selectedObjective}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {goalObjectives[selectedGoal].stage} stage — pick the one objective the plan is judged on.
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Users size={16} />
                          Audience segments
                        </Label>
                        <Filter
                          name="Select audiences"
                          keepName
                          options={audienceOptions.map((a) => ({ label: a.label, value: a.id, description: `Reach ${a.reach} · ${a.description}` }))}
                          selectedValues={selectedAudiences}
                          onChange={setSelectedAudiences}
                          className="w-full justify-between"
                        />
                        {selectedAudiences.length > 0 && (
                          <div className="space-y-1 pt-1">
                            {selectedAudiences.map((id) => {
                              const a = audienceOptions.find((x) => x.id === id);
                              return a ? (
                                <div key={id} className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-2">
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium">{a.label}</div>
                                    <div className="text-xs text-muted-foreground">Reach: {a.reach}</div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedAudiences(selectedAudiences.filter((v) => v !== id))}
                                    className="h-8 w-8 shrink-0 p-0"
                                    aria-label={`Remove ${a.label}`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <OptimisationCard
                        assisted={assistedExperience}
                        onToggle={setAssisted}
                        items={
                          selectedGoal && selectedObjective && goalObjectives[selectedGoal]
                            ? [
                                {
                                  badge: 'AI Insight',
                                  tone: 'insight' as const,
                                  message: `${goals.find((g) => g.id === selectedGoal)?.title} + ${selectedObjective} maps to the ${goalObjectives[selectedGoal].stage} stage — the matching KPIs are now in the metric row above.`,
                                },
                                goalObjectives[selectedGoal].stage === 'Conversion'
                                  ? { badge: 'AI Insight', tone: 'insight' as const, message: 'Conversion plans perform best with Sponsored Products + Display working together.' }
                                  : { badge: 'AI Insight', tone: 'insight' as const, message: 'Awareness goals lean on Display and Digital in-store for broad, high-frequency reach.' },
                                selectedAudiences.length === 0
                                  ? { badge: 'Tip', tone: 'tip' as const, message: 'Add one or more audience segments to estimate reach.' }
                                  : { badge: 'Tip', tone: 'tip' as const, message: `${selectedAudiences.length} audience${selectedAudiences.length === 1 ? '' : 's'} selected — add more to widen reach.` },
                              ]
                            : [
                                { badge: 'Tip', tone: 'tip' as const, message: 'Pick a goal and objective — the KPIs this plan is judged on appear in the metric row.' },
                                { badge: 'AI Insight', tone: 'insight' as const, message: 'Your goal sets the objective, which sets the Brand, Media and Sales KPIs we report on.' },
                              ]
                        }
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                      <Button disabled={!isTargetingComplete} onClick={() => setCurrentStep(3)}>
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
                      <OptimisationCard
                        assisted={assistedExperience}
                        onToggle={setAssisted}
                        items={(() => {
                          const autoBudgetAdvice: Advice = autoBudgetOptimization
                            ? { badge: 'AI Insight', tone: 'success', message: 'Automatic budget is on — spend reallocates to the best-performing propositions in real time (~+18% ROAS).' }
                            : { badge: 'Suggestion', tone: 'tip', message: 'Let us distribute your budget automatically across propositions to maximise ROAS (~+18%).', action: { label: 'Set budget to automatic', onClick: () => setAutoBudgetOptimization(true) } };
                          if (budgetAmount.trim() === '' || !dateRange?.from || !dateRange?.to) {
                            return [
                              ...(budgetAmount.trim() === ''
                                ? [{ badge: 'Suggestion', tone: 'tip' as const, message: 'Start with €5,000 — a common budget for plans like this.', action: { label: 'Use €5,000', onClick: () => setBudgetAmount('5000') } }]
                                : []),
                              autoBudgetAdvice,
                            ];
                          }
                          const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                          const daily = parseFloat(budgetAmount) / days;
                          const items: Advice[] = [];
                          if (daily < 150) {
                            items.push({ badge: 'Budget Alert', tone: 'alert', message: `At €${daily.toFixed(0)}/day over ${days} days, delivery may be thin — raising the budget builds usable frequency faster.` });
                          } else {
                            items.push({ badge: 'AI Insight', tone: 'insight', message: `€${daily.toFixed(0)}/day over ${days} days is a healthy pace for sustained frequency.` });
                          }
                          items.push(autoBudgetAdvice);
                          if (days < 21) {
                            items.push({ badge: 'Tip', tone: 'tip', message: 'Flights of 3+ weeks build the frequency needed for awareness and consideration goals.' });
                          }
                          return items;
                        })()}
                      />
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
                                        [prop.id]: assistedExperience
                                          ? { mode: 'preset', presetId: prop.aiPreset.id }
                                          : { mode: 'empty' },
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
                                <div className={cn('grid gap-3', assistedExperience && 'grid-cols-2')}>
                                  {/* AI preset option — only in the assisted experience */}
                                  {assistedExperience && (
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
                                  )}

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
                    <div className="mt-6">
                      <OptimisationCard
                        assisted={assistedExperience}
                        onToggle={setAssisted}
                        items={[
                          propositionImpact.selectedCount < propositions.length
                            ? { badge: 'Incomplete', tone: 'alert' as const, message: `${propositions.length - propositionImpact.selectedCount} proposition${propositions.length - propositionImpact.selectedCount === 1 ? '' : 's'} disabled — enabling them adds incremental reach for the same audience.` }
                            : { badge: 'AI Insight', tone: 'success' as const, message: 'All propositions enabled — the widest reach for this audience.' },
                          { badge: 'AI Insight', tone: 'insight' as const, message: `AI presets picked placements across ${propositionImpact.selectedCount} proposition${propositionImpact.selectedCount === 1 ? '' : 's'} — review or switch any to empty to configure manually.` },
                          ...(propositionImpact.additionalSales > 0
                            ? [{ badge: 'AI Insight', tone: 'success' as const, message: `Projected +€${propositionImpact.additionalSales.toLocaleString()} incremental sales from the enabled mix.` }]
                            : []),
                        ]}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(3)}>Back</Button>
                      <Button
                        onClick={() => {
                          const name = campaignName || 'New Media plan';
                          const params = new URLSearchParams({ new: name });
                          if (budgetAmount) params.set('budget', budgetAmount);
                          const advLabel = advertiserOptions.find(a => a.value === selectedAdvertiser)?.label;
                          if (advLabel) params.set('advertiser', advLabel);
                          if (dateRange?.from) params.set('startDate', dateRange.from.toISOString());
                          if (dateRange?.to) params.set('endDate', dateRange.to.toISOString());
                          window.location.href = `/campaigns?${params.toString()}`;
                        }}
                      >
                        Launch media plan
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
                  <CardSummaryTitle>Media plan</CardSummaryTitle>
                </CardHeader>
                <CardSummaryContent>
                  <div className="relative pl-12">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[19px] top-[16px] bottom-[16px] w-px bg-border"></div>

                    <div className="space-y-4">
                      {wizardSteps.map((step, index) => {
                        const status = getStepStatus(step.id, index);
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
                              {status === 'completed' && stepValues && stepValues.length > 0 ? (
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
                {currentStep === wizardSteps.length - 1 && (
                  <div className="px-4 pb-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const name = campaignName || 'New Media plan';
                        const params = new URLSearchParams({ new: name });
                        if (budgetAmount) params.set('budget', budgetAmount);
                        const advLabel = advertiserOptions.find(a => a.value === selectedAdvertiser)?.label;
                        if (advLabel) params.set('advertiser', advLabel);
                        if (dateRange?.from) params.set('startDate', dateRange.from.toISOString());
                        if (dateRange?.to) params.set('endDate', dateRange.to.toISOString());
                        window.location.href = `/campaigns?${params.toString()}`;
                      }}
                    >
                      Launch media plan
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
                      ? `${propositionImpact.additionalReach.toFixed(1)}M`
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
                          const baseRoas = 2.4 + (parseFloat(budgetAmount) > 5000 ? 1.2 : parseFloat(budgetAmount) > 2000 ? 0.6 : 0);
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
                        />
                        <div className="text-xs text-muted-foreground">
                          Your campaign will automatically start and stop on the selected dates
                        </div>
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
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                      <Button
                        onClick={() => {
                          const name = campaignName || 'New Media plan';
                          window.location.href = `/campaigns?new=${encodeURIComponent(name)}`;
                        }}
                      >
                        Launch media plan
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
                      Launch media plan
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
