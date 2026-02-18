'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, MetricCard, CardSummary, CardSummaryContent, CardSummaryTitle } from './card';
import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Button } from './button';
import { DateRangePicker } from './date-picker';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Slider } from './slider';
import { NotificationItem } from './notification-item';
import { DollarSign, ChevronDown, ChevronUp, Sparkles, MonitorSpeaker, ListStart, MonitorPlay, Store, Globe, Info, MessageSquare, Plus } from 'lucide-react';

export interface CampaignEngine {
  id: string;
  name: string;
  campaignName?: string;
  enabled: boolean;
}

export interface CampaignFeature {
  id: string;
  label: string;
  enabled: boolean;
}

export interface CampaignSummaryProps {
  title: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' | 'info';
  };
  goal: string;
  goalOptions?: Array<{ label: string; value: string }>;
  audience: string;
  audienceOptions?: Array<{ label: string; value: string }>;
  estimatedRoas: string;
  budget: string;
  usedBudget?: string;
  totalPrice?: string;
  budgetUsagePercentage?: number;
  engines: CampaignEngine[];
  placements?: number;
  dateRange?: DateRange;
  features: CampaignFeature[];
  layout?: 'vertical' | 'horizontal';
  onGoalChange?: (goal: string) => void;
  onAudienceChange?: (audience: string) => void;
  onBudgetChange?: (budget: string) => void;
  onEngineToggle?: (engineId: string, enabled: boolean) => void;
  onFeatureToggle?: (featureId: string, enabled: boolean) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  onEngineBudgetChange?: (engineId: string, budget: string) => void;
  onEngineEdit?: (engineId: string, engineName: string) => void;
  onEngineAdd?: (propositionType: string) => void;
  onNotificationClick?: (notificationType: string) => void;
  conversionWindow?: number;
  onConversionWindowChange?: (conversionWindow: number) => void;
  onEdit?: () => void;
  defaultExpanded?: boolean;
  className?: string;
}

export const CampaignSummary = React.forwardRef<HTMLDivElement, CampaignSummaryProps>(
  ({
    title,
    badge,
    goal,
    goalOptions,
    audience,
    audienceOptions,
    estimatedRoas,
    budget,
    usedBudget,
    totalPrice,
    budgetUsagePercentage,
    engines,
    placements,
    dateRange,
    features,
    layout = 'vertical',
    onGoalChange,
    onAudienceChange,
    onBudgetChange,
    onEngineToggle,
    onFeatureToggle,
    onDateRangeChange,
    onEngineBudgetChange,
    onEngineEdit,
    onEngineAdd,
    onNotificationClick,
    conversionWindow,
    onConversionWindowChange,
    onEdit,
    defaultExpanded = false,
    className,
    ...props
  }, ref) => {
    // Try to use Next.js router if available (will be null in Storybook)
    let router: ReturnType<typeof useRouter> | null = null;
    try {
      router = useRouter();
    } catch (e) {
      // Router not available (Storybook)
    }

    // Internal state for switches when callbacks are not provided
    const [internalEngines, setInternalEngines] = React.useState(engines);
    const [internalFeatures, setInternalFeatures] = React.useState(features);
    const [isCollapsed, setIsCollapsed] = React.useState(!defaultExpanded);
    const [engineBudgets, setEngineBudgets] = React.useState<{ [key: string]: string }>({});
    const [autoBudgetOptimization, setAutoBudgetOptimization] = React.useState(false);
    const [autoTargeting, setAutoTargeting] = React.useState(false);
    const [autoSuggestions, setAutoSuggestions] = React.useState(true);
    const [totalBudgetInput, setTotalBudgetInput] = React.useState(budget.replace(/[^0-9.]/g, ''));
    const [showAddDropdown, setShowAddDropdown] = React.useState(false);

    // Available proposition types for adding new campaigns
    const propositionTypes = [
      { id: 'display', name: 'Display', icon: MonitorSpeaker },
      { id: 'sponsored', name: 'Sponsored products', icon: ListStart },
      { id: 'digital', name: 'Digital in-store', icon: MonitorPlay },
      { id: 'offline', name: 'Offline in-store', icon: Store },
      { id: 'extended-reach', name: 'Extended Reach', icon: Globe },
    ];

    const handleAddCampaign = (propositionType: string) => {
      if (onEngineAdd) {
        onEngineAdd(propositionType);
      }
      setShowAddDropdown(false);
    };

    // Update internal state when props change (compare by value to avoid infinite loops)
    const enginesKey = JSON.stringify(engines);
    React.useEffect(() => {
      setInternalEngines(engines);
    }, [enginesKey]);

    const featuresKey = JSON.stringify(features);
    React.useEffect(() => {
      setInternalFeatures(features);
    }, [featuresKey]);

    // Handle engine toggle
    const handleEngineToggle = (engineId: string, enabled: boolean) => {
      if (onEngineToggle) {
        onEngineToggle(engineId, enabled);
      } else {
        setInternalEngines(prev =>
          prev.map(engine =>
            engine.id === engineId ? { ...engine, enabled } : engine
          )
        );
      }
    };

    // Handle feature toggle
    const handleFeatureToggle = (featureId: string, enabled: boolean) => {
      if (onFeatureToggle) {
        onFeatureToggle(featureId, enabled);
      } else {
        setInternalFeatures(prev =>
          prev.map(feature =>
            feature.id === featureId ? { ...feature, enabled } : feature
          )
        );
      }
    };

    // Use controlled or internal state
    const currentEngines = onEngineToggle ? engines : internalEngines;
    const currentFeatures = onFeatureToggle ? features : internalFeatures;

    // Calculate actual budget usage percentage
    const calculateBudgetUsage = React.useMemo(() => {
      if (budgetUsagePercentage !== undefined) {
        // If percentage is explicitly provided, use it but cap at 100
        return Math.min(budgetUsagePercentage, 100);
      }

      // Otherwise calculate from budget and totalPrice
      if (budget && totalPrice) {
        const budgetNum = parseFloat(budget.replace(/[^0-9.]/g, ''));
        const spendNum = parseFloat(totalPrice.replace(/[^0-9.]/g, ''));

        if (!isNaN(budgetNum) && !isNaN(spendNum) && budgetNum > 0) {
          const percentage = (spendNum / budgetNum) * 100;
          // Cap at 100% for the progress bar
          return Math.min(Math.round(percentage), 100);
        }
      }

      return 0;
    }, [budget, totalPrice, budgetUsagePercentage]);

    // Media proposition icons mapping
    const mediaPropositionIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
      'Display': MonitorSpeaker,
      'Sponsored products': ListStart,
      'Digital in-store': MonitorPlay,
      'Offline in-store': Store,
      'Extended Reach': Globe,
    };

    // Handle engine budget change
    const handleEngineBudgetChange = (engineId: string, value: string) => {
      const newBudget = `$${value}`;
      setEngineBudgets(prev => ({
        ...prev,
        [engineId]: newBudget
      }));
      
      if (onEngineBudgetChange) {
        onEngineBudgetChange(engineId, newBudget);
      }
    };

    // Get current budget for an engine
    const getEngineBudget = (engineId: string) => {
      return engineBudgets[engineId] || (engineId === 'offline' ? '$0' : '$1,667');
    };

    // Calculate ROAS based on budget (higher budget = higher ROAS with some variation)
    const calculateEngineROAS = (engineId: string) => {
      if (engineId === 'offline') return '0x';

      const budget = parseFloat(getEngineBudget(engineId).replace(/[^0-9.]/g, '')) || 0;

      if (budget === 0) return '0x';

      // Engine-specific base ROAS values (distinct for demo purposes)
      const engineBaseROAS: Record<string, number> = {
        'display': 2.5,
        'sponsored': 4.8,
        'digital': 3.2,
        'offline': 0,
        'extended-reach': 2.1,
      };

      const baseROAS = engineBaseROAS[engineId as keyof typeof engineBaseROAS] || 3.0;

      return `${baseROAS.toFixed(1)}x`;
    };

    // Calculate total budget from all engines
    const calculateTotalBudget = () => {
      const total = currentEngines.reduce((sum, engine) => {
        const budget = getEngineBudget(engine.id);
        const amount = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0;
        return sum + amount;
      }, 0);
      return `$${total.toLocaleString()}`;
    };

    // Calculate weighted average ROAS across all engines
    const calculateTotalROAS = () => {
      let totalBudget = 0;
      let weightedROAS = 0;
      
      currentEngines.forEach(engine => {
        const budget = parseFloat(getEngineBudget(engine.id).replace(/[^0-9.]/g, '')) || 0;
        const roas = parseFloat(calculateEngineROAS(engine.id).replace('x', '')) || 0;
        
        totalBudget += budget;
        weightedROAS += budget * roas;
      });
      
      if (totalBudget === 0) return '0.0x';
      
      const averageROAS = weightedROAS / totalBudget;
      return `${averageROAS.toFixed(1)}x`;
    };

    // Update main budget and input when engine budgets change
    React.useEffect(() => {
      const totalBudget = calculateTotalBudget();
      const totalBudgetValue = totalBudget.replace(/[^0-9.]/g, '');
      setTotalBudgetInput(totalBudgetValue);
      if (onBudgetChange) {
        onBudgetChange(totalBudget);
      }
    }, [engineBudgets, currentEngines]);

    // Distribute budget based on Auto Budget Optimization setting
    React.useEffect(() => {
      if (autoBudgetOptimization) {
        // Calculate total budget
        const total = currentEngines.reduce((sum, engine) => {
          const budget = getEngineBudget(engine.id);
          const amount = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0;
          return sum + amount;
        }, 0);

        // Get ROAS values for each engine
        const roasValues: { [key: string]: number } = {};
        let totalRoasWeight = 0;

        currentEngines.forEach(engine => {
          if (engine.id === 'offline') {
            roasValues[engine.id] = 0;
          } else {
            const roas = parseFloat(calculateEngineROAS(engine.id).replace('x', '')) || 0;
            roasValues[engine.id] = roas;
            totalRoasWeight += roas;
          }
        });

        // Distribute budget based on ROAS weights
        if (totalRoasWeight > 0) {
          const newBudgets: { [key: string]: string } = {};
          currentEngines.forEach(engine => {
            if (engine.id === 'offline') {
              newBudgets[engine.id] = '$0';
            } else {
              const roasWeight = roasValues[engine.id] / totalRoasWeight;
              const allocatedBudget = Math.round(total * roasWeight);
              newBudgets[engine.id] = `$${allocatedBudget}`;
            }
          });
          setEngineBudgets(newBudgets);
        }
      } else {
        // When turned off, distribute evenly
        const total = currentEngines.reduce((sum, engine) => {
          const budget = getEngineBudget(engine.id);
          const amount = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0;
          return sum + amount;
        }, 0);

        const enabledEngines = currentEngines.filter(engine => engine.enabled && engine.id !== 'offline');
        const perEngine = enabledEngines.length > 0 ? total / enabledEngines.length : 0;

        const newBudgets: { [key: string]: string } = {};
        currentEngines.forEach(engine => {
          if (engine.id === 'offline') {
            newBudgets[engine.id] = '$0';
          } else if (engine.enabled) {
            newBudgets[engine.id] = `$${Math.round(perEngine)}`;
          } else {
            newBudgets[engine.id] = '$0';
          }
        });

        setEngineBudgets(newBudgets);
      }
    }, [autoBudgetOptimization]);
    return (
      <Card ref={ref} className={cn(
        'w-full',
        layout === 'vertical' ? 'max-w-md mx-auto relative mt-4 overflow-visible' : '',
        className
      )} {...props}>
        {/* Floating badge for vertical layout */}
        {layout === 'vertical' && badge && (
          <Badge
            variant={badge.variant || 'default'}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white border-slate-800 z-50"
          >
            {badge.text}
          </Badge>
        )}
        
        <CardHeader
          className={`${layout !== 'vertical' && isCollapsed ? 'space-y-2' : 'space-y-4'} ${layout !== 'vertical' ? `cursor-pointer transition-colors ${isCollapsed ? 'hover:bg-slate-50' : ''}` : ''}`}
          onClick={layout !== 'vertical' ? () => setIsCollapsed(!isCollapsed) : undefined}
        >
          {/* Title and Badges Row */}
          <div className="flex justify-between items-start">
            {/* Title - Left Aligned */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground leading-tight">
                {title}
              </h2>
              {layout === 'vertical' && (
                <div className="mt-2">
                  <Badge variant="success" className="text-sm font-medium">
                    Est. ROAS {calculateTotalROAS()}
                  </Badge>
                </div>
              )}
            </div>

            {/* Badges and Collapse Button - Right Aligned (horizontal layout only) */}
            {layout !== 'vertical' && (
              <div className="flex items-start gap-2">
                {badge ? (
                  <Badge variant={badge.variant || 'default'}>
                    {badge.text}
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    In-option
                  </Badge>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCollapsed(!isCollapsed);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                >
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Subtitle and Summary Row - Only when collapsed (horizontal layout only) */}
          {layout !== 'vertical' && isCollapsed && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {goal.replace(/-/g, ' ')} • {budget} • {dateRange ?
                  `${dateRange.from?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} - ${dateRange.to?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}` :
                  'No dates selected'
                }
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground text-right">
                  ROAS {calculateTotalROAS()}{usedBudget ? ` • Used ${usedBudget}` : ''}
                </div>
                {/* Spacer to match the chevron button width + gap */}
                <div className="w-[28px]"></div>
              </div>
            </div>
          )}
        </CardHeader>

        {(layout === 'vertical' || !isCollapsed) && (
          <CardContent className={layout === 'vertical' ? 'space-y-6' : 'p-6'}>
            {layout === 'vertical' ? (
            // Vertical Layout (updated to match horizontal)
            <div className="space-y-6">
              {/* Goal, Budget, and Runtime Section */}
              <div className="space-y-4">
                {/* Goal Section */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Goal</Label>
                  <Input
                    dropdown
                    options={goalOptions || [
                      { label: 'Performance on transaction', value: 'performance-transaction' },
                      { label: 'Brand awareness', value: 'brand-awareness' },
                      { label: 'Lead generation', value: 'lead-generation' },
                      { label: 'Customer acquisition', value: 'customer-acquisition' },
                      { label: 'Retargeting', value: 'retargeting' },
                      { label: 'Full funnel', value: 'full-funnel' },
                    ]}
                    value={goal}
                    onChange={onGoalChange || (() => {})}
                    placeholder="Select goal"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>

                {/* Total Budget Section */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Total budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={totalBudgetInput}
                      onChange={(e) => {
                        // Update the input state directly
                        setTotalBudgetInput(e.target.value);

                        // When main budget changes, distribute equally among enabled engines
                        const newTotal = parseFloat(e.target.value) || 0;
                        const enabledEngines = currentEngines.filter(engine => engine.enabled && engine.id !== 'offline');
                        const perEngine = enabledEngines.length > 0 ? newTotal / enabledEngines.length : 0;

                        const newBudgets: { [key: string]: string } = {};
                        currentEngines.forEach(engine => {
                          if (engine.id === 'offline') {
                            newBudgets[engine.id] = '$0';
                          } else if (engine.enabled) {
                            newBudgets[engine.id] = `$${Math.round(perEngine)}`;
                          } else {
                            newBudgets[engine.id] = '$0';
                          }
                        });

                        setEngineBudgets(newBudgets);
                        onBudgetChange?.(`$${e.target.value}`);
                      }}
                      className="w-full h-9 bg-slate-50 border border-slate-200 pl-10 py-1 rounded-md focus:outline-none focus:border-slate-300 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      placeholder="Enter budget amount"
                    />
                  </div>
                </div>

                {/* Run Time Section */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Run time</Label>
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={onDateRangeChange}
                    placeholder="Select campaign dates"
                    className="bg-slate-50 border-slate-200"
                    showPresets={true}
                  />
                </div>
              </div>

              {/* Media Propositions */}
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Campaigns</Label>
                <div className="space-y-2">
                  {currentEngines.map((engine) => {
                    const IconComponent = mediaPropositionIcons[engine.name];
                    const roas = calculateEngineROAS(engine.id);
                    const budgetVal = getEngineBudget(engine.id).replace(/[^0-9.]/g, '');
                    return (
                      <div
                        key={engine.id}
                        className={cn(
                          "rounded-lg border transition-all",
                          engine.enabled ? 'border-border' : 'border-border/50'
                        )}
                      >
                        <div className="flex items-center gap-3 p-3">
                          <div className={cn(
                            "w-7 h-7 rounded-md flex items-center justify-center transition-colors flex-shrink-0",
                            engine.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          )}>
                            {IconComponent && <IconComponent size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={cn(
                              "text-sm font-medium",
                              !engine.enabled && 'text-muted-foreground'
                            )}>
                              {engine.name}
                              {engine.campaignName && (
                                <span className="text-muted-foreground font-normal"> – {engine.campaignName}</span>
                              )}
                            </span>
                          </div>
                          {engine.enabled && (
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              ${budgetVal} · {roas} ROAS
                            </span>
                          )}
                          <Switch
                            checked={engine.enabled}
                            onCheckedChange={(checked) => handleEngineToggle(engine.id, checked)}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Add campaign row */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAddDropdown(!showAddDropdown)}
                      className="w-full rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all p-3 flex items-center gap-3"
                    >
                      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-muted text-muted-foreground flex-shrink-0">
                        <Plus size={14} />
                      </div>
                      <span className="text-sm text-muted-foreground">Add campaign</span>
                    </button>
                    {showAddDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg overflow-hidden">
                        {propositionTypes.map((type) => {
                          const TypeIcon = type.icon;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => handleAddCampaign(type.id)}
                              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                            >
                              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-muted text-muted-foreground flex-shrink-0">
                                <TypeIcon size={12} />
                              </div>
                              <span className="text-sm">{type.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Optimization Switches */}
              <div className="space-y-3 pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoBudgetOptimization}
                    onCheckedChange={setAutoBudgetOptimization}
                  />
                  <span className="text-sm text-foreground">Auto Budget Optimization</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoTargeting}
                    onCheckedChange={setAutoTargeting}
                  />
                  <span className="text-sm text-foreground">Auto Targeting</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>



              {/* Features Section - only show if there are features */}
              {currentFeatures.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">Features</Label>
                  <div className="space-y-3">
                    {currentFeatures.map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{feature.label}</span>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Horizontal Layout
            <div className="space-y-6">
              {/* Metrics Row - Below the title */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Budget"
                  value={budget}
                  subMetric={totalPrice ? `Total Spend: ${totalPrice}` : undefined}
                  progress={calculateBudgetUsage}
                  variant="graph"
                />
                <MetricCard
                  label="Reach"
                  value={
                    autoBudgetOptimization && autoTargeting ? "3.8M" :
                    autoTargeting ? "3.2M" :
                    autoBudgetOptimization ? "2.8M" :
                    "2.5M"
                  }
                  subMetric="Current: 1.6M"
                  variant="graph"
                  progress={
                    autoBudgetOptimization && autoTargeting ? 95 :
                    autoTargeting ? 82 :
                    autoBudgetOptimization ? 72 :
                    64
                  }
                  className="transition-all duration-500 ease-in-out"
                />
                <MetricCard
                  label="ROAS"
                  value={
                    autoBudgetOptimization && autoTargeting ? "5.6x" :
                    autoBudgetOptimization ? "5.0x" :
                    autoTargeting ? "4.5x" :
                    "4.1x"
                  }
                  subMetric="Current: 3.2x"
                  variant="graph"
                  progress={
                    autoBudgetOptimization && autoTargeting ? 88 :
                    autoBudgetOptimization ? 78 :
                    autoTargeting ? 70 :
                    64
                  }
                  className="transition-all duration-500 ease-in-out"
                />
                <MetricCard
                  label="Sales"
                  value={
                    autoBudgetOptimization && autoTargeting ? "$68.3K" :
                    autoBudgetOptimization ? "$58.7K" :
                    autoTargeting ? "$52.4K" :
                    "$45.2K"
                  }
                  subMetric="Current: $28.8K"
                  badgeValue={
                    autoBudgetOptimization && autoTargeting ? "+42%" :
                    autoBudgetOptimization ? "+30%" :
                    autoTargeting ? "+22%" :
                    "+15%"
                  }
                  badgeVariant="success"
                  variant="graph"
                  progress={
                    autoBudgetOptimization && autoTargeting ? 95 :
                    autoBudgetOptimization ? 82 :
                    autoTargeting ? 73 :
                    64
                  }
                  className="transition-all duration-500 ease-in-out"
                />
              </div>

              {/* Main content area with summary sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Campaigns & Agent */}
                <div className="lg:col-span-8 lg:order-1 space-y-4">
                  {/* Media Propositions */}
                  <div className="space-y-2">
                    {currentEngines.map((engine) => {
                      const IconComponent = mediaPropositionIcons[engine.name];
                      const roas = calculateEngineROAS(engine.id);
                      const budgetVal = getEngineBudget(engine.id).replace(/[^0-9.]/g, '');
                      return (
                        <div
                          key={engine.id}
                          className={cn(
                            "rounded-lg border transition-all",
                            engine.enabled ? 'border-border' : 'border-border/50'
                          )}
                        >
                          <div className="flex items-center gap-3 p-3">
                            <div className={cn(
                              "w-7 h-7 rounded-md flex items-center justify-center transition-colors flex-shrink-0",
                              engine.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            )}>
                              {IconComponent && <IconComponent size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={cn(
                                "text-sm font-medium",
                                !engine.enabled && 'text-muted-foreground'
                              )}>
                                {engine.name}
                                {engine.campaignName && (
                                  <span className="text-muted-foreground font-normal"> – {engine.campaignName}</span>
                                )}
                              </span>
                            </div>
                            {engine.enabled && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                ${budgetVal} · {roas} ROAS
                              </span>
                            )}
                            <Switch
                              checked={engine.enabled}
                              onCheckedChange={(checked) => handleEngineToggle(engine.id, checked)}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Add campaign row */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAddDropdown(!showAddDropdown)}
                        className="w-full rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all p-3 flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-muted text-muted-foreground flex-shrink-0">
                          <Plus size={14} />
                        </div>
                        <span className="text-sm text-muted-foreground">Add campaign</span>
                      </button>
                      {showAddDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg overflow-hidden">
                          {propositionTypes.map((type) => {
                            const TypeIcon = type.icon;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => handleAddCampaign(type.id)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                              >
                                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-muted text-muted-foreground flex-shrink-0">
                                  <TypeIcon size={12} />
                                </div>
                                <span className="text-sm">{type.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campaign Agent Section */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={autoSuggestions}
                          onCheckedChange={setAutoSuggestions}
                        />
                        <span className="text-sm text-foreground">Campaign Agent support</span>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        View all
                      </Button>
                    </div>
                  </div>

                  {/* AI Notifications Section - Only show when autoSuggestions is enabled */}
                  {autoSuggestions && (
                    <div className="space-y-3 pt-4">
                      <div className="space-y-4">
                        {/* AI Notification 1 - CTR Optimization */}
                        <NotificationItem
                          type="ai-insight"
                          message='Campaign "Spring Sale" could improve CTR by 23% with optimized targeting parameters.'
                          linkText='"Spring Sale"'
                          onLinkClick={() => {
                            // Navigate to campaign detail page
                            if (router) {
                              router.push('/campaigns/sponsored-products/C-001');
                            } else {
                              console.log('Navigate to Spring Sale campaign');
                            }
                          }}
                          onActionClick={() => {
                            // Navigate to AI chat for CTR optimization
                            if (router) {
                              router.push('/chat/spend-analysis');
                            } else {
                              console.log('Open AI chat for CTR optimization');
                            }
                          }}
                        />

                        {/* AI Notification 2 - Creative Timing */}
                        <NotificationItem
                          type="ai-insight"
                          message='Creative "Banner_Summer_v2" shows 34% higher engagement in evening time slots.'
                          linkText='"Banner_Summer_v2"'
                          onLinkClick={() => {
                            // Navigate to creative detail page
                            if (router) {
                              router.push('/campaigns/sponsored-products/creative/CRE-001');
                            } else {
                              console.log('Navigate to Banner_Summer_v2 creative');
                            }
                          }}
                          onActionClick={() => {
                            // Navigate to AI chat
                            if (router) {
                              router.push('/chat/spend-analysis');
                            } else {
                              console.log('Open AI chat for creative timing');
                            }
                          }}
                        />

                        {/* AI Notification 3 - Budget Alert */}
                        <NotificationItem
                          type="budget-alert"
                          message='Campaign "Summer Sale" budget recommendation. Opportunity: $12.5K potential lost revenue.'
                          linkText='"Summer Sale"'
                          onLinkClick={() => {
                            // Navigate to spend analysis chat
                            if (router) {
                              router.push('/chat/spend-analysis');
                            } else {
                              console.log('Navigate to spend analysis chat');
                            }
                          }}
                          onActionClick={() => {
                            if (onNotificationClick) {
                              onNotificationClick('budget-recommendation');
                            } else if (router) {
                              router.push('/chat/spend-analysis');
                            } else {
                              console.log('Navigate to budget recommendation');
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Summary Card */}
                <div className="lg:col-span-4 lg:order-2">
                  <CardSummary>
                    <CardHeader>
                      <CardSummaryTitle>Summary</CardSummaryTitle>
                    </CardHeader>
                    <CardSummaryContent>
                      <div className="space-y-5">
                        {/* Goal */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Goal</Label>
                          <Input
                            dropdown
                            options={goalOptions || [
                              { label: 'Performance on transaction', value: 'performance-transaction' },
                              { label: 'Brand awareness', value: 'brand-awareness' },
                              { label: 'Lead generation', value: 'lead-generation' },
                              { label: 'Customer acquisition', value: 'customer-acquisition' },
                              { label: 'Retargeting', value: 'retargeting' },
                              { label: 'Full funnel', value: 'full-funnel' },
                            ]}
                            value={goal}
                            onChange={onGoalChange || (() => {})}
                            placeholder="Select goal"
                            className="bg-white border-slate-200"
                          />
                        </div>

                        {/* Total Budget + Auto Budget Optimization */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Total budget</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="number"
                              value={totalBudgetInput}
                              onChange={(e) => {
                                setTotalBudgetInput(e.target.value);
                                const newTotal = parseFloat(e.target.value) || 0;
                                const enabledEngines = currentEngines.filter(engine => engine.enabled && engine.id !== 'offline');
                                const perEngine = enabledEngines.length > 0 ? newTotal / enabledEngines.length : 0;
                                const newBudgets: { [key: string]: string } = {};
                                currentEngines.forEach(engine => {
                                  if (engine.id === 'offline') {
                                    newBudgets[engine.id] = '$0';
                                  } else if (engine.enabled) {
                                    newBudgets[engine.id] = `$${Math.round(perEngine)}`;
                                  } else {
                                    newBudgets[engine.id] = '$0';
                                  }
                                });
                                setEngineBudgets(newBudgets);
                                onBudgetChange?.(`$${e.target.value}`);
                              }}
                              className="w-full h-9 bg-white border border-slate-200 pl-10 py-1 rounded-md focus:outline-none focus:border-slate-300 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                              placeholder="Enter budget amount"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className={cn("h-3.5 w-3.5", autoBudgetOptimization ? "text-primary" : "text-muted-foreground")} />
                              <span className="text-sm text-foreground">Auto Budget Optimization</span>
                            </div>
                            <Switch
                              checked={autoBudgetOptimization}
                              onCheckedChange={setAutoBudgetOptimization}
                            />
                          </div>
                        </div>

                        {/* Targeting + Auto Targeting */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Targeting</Label>
                          <Input
                            dropdown
                            options={audienceOptions || [
                              { label: 'AH bonus shoppers', value: 'ah-bonus' },
                              { label: 'Health conscious', value: 'health-conscious' },
                              { label: 'Families', value: 'families' },
                              { label: 'Young professionals', value: 'young-professionals' },
                              { label: 'Premium shoppers', value: 'premium-shoppers' },
                            ]}
                            value={audience}
                            onChange={onAudienceChange || (() => {})}
                            placeholder="Select audience"
                            className="bg-white border-slate-200"
                          />
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className={cn("h-3.5 w-3.5", autoTargeting ? "text-primary" : "text-muted-foreground")} />
                              <span className="text-sm text-foreground">Auto Targeting</span>
                            </div>
                            <Switch
                              checked={autoTargeting}
                              onCheckedChange={setAutoTargeting}
                            />
                          </div>
                        </div>

                        {/* Run Time */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Run time</Label>
                          <DateRangePicker
                            dateRange={dateRange}
                            onDateRangeChange={onDateRangeChange}
                            placeholder="Select campaign dates"
                            className="bg-white border-slate-200"
                            showPresets={true}
                          />
                        </div>
                      </div>
                    </CardSummaryContent>
                  </CardSummary>
                </div>
              </div>
            </div>

          )}

          </CardContent>
        )}
      </Card>
    );
  }
);

CampaignSummary.displayName = 'CampaignSummary';