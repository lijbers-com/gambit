'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, MetricCard } from './card';
import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Button } from './button';
import { DateRangePicker } from './date-picker';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Slider } from './slider';
import { DollarSign, ChevronDown, ChevronUp, Sparkles, MonitorSpeaker, ListStart, MonitorPlay, Store, Info } from 'lucide-react';

export interface CampaignEngine {
  id: string;
  name: string;
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
  conversionWindow?: number;
  onConversionWindowChange?: (conversionWindow: number) => void;
  onEdit?: () => void;
  onAddToCart?: () => void;
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
    conversionWindow,
    onConversionWindowChange,
    onEdit,
    onAddToCart,
    className,
    ...props
  }, ref) => {
    // Internal state for switches when callbacks are not provided
    const [internalEngines, setInternalEngines] = React.useState(engines);
    const [internalFeatures, setInternalFeatures] = React.useState(features);
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [engineBudgets, setEngineBudgets] = React.useState<{ [key: string]: string }>({});
    const [autoBudgetOptimization, setAutoBudgetOptimization] = React.useState(true);
    const [autoTargeting, setAutoTargeting] = React.useState(true);
    const [totalBudgetInput, setTotalBudgetInput] = React.useState(budget.replace(/[^0-9.]/g, ''));

    // Update internal state when props change
    React.useEffect(() => {
      setInternalEngines(engines);
    }, [engines]);

    React.useEffect(() => {
      setInternalFeatures(features);
    }, [features]);

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

    // Media proposition icons mapping
    const mediaPropositionIcons = {
      'Display': MonitorSpeaker,
      'Sponsored products': ListStart,
      'Digital in-store': MonitorPlay,
      'Offline in-store': Store,
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
      const engineBaseROAS = {
        'display': 2.5,
        'sponsored': 4.8,
        'digital': 3.2,
        'offline': 0
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
                {badge && (
                  <Badge
                    variant={badge.variant || 'default'}
                    className="bg-slate-800 text-white border-slate-800"
                  >
                    {badge.text}
                  </Badge>
                )}
                <Badge variant="outline">
                  In-option
                </Badge>
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

              {/* Media Propositions Table */}
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Media proposition</Label>
                <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
                  <table className="min-w-full text-sm text-slate-700 table-fixed">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ width: '200px', minWidth: '200px' }}>
                          Media proposition
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ width: '120px', minWidth: '120px' }}>
                          Budget
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ width: '100px', minWidth: '100px' }}>
                          Est. ROAS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {currentEngines.map((engine, index) => (
                        <tr key={engine.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 align-middle" style={{ width: '200px', minWidth: '200px' }}>
                            <div className="flex items-center gap-2 overflow-hidden">
                              {(() => {
                                const IconComponent = mediaPropositionIcons[engine.name as keyof typeof mediaPropositionIcons];
                                return IconComponent ? <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : null;
                              })()}
                              <span className="text-sm font-medium text-foreground truncate">{engine.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle text-center" style={{ width: '120px', minWidth: '120px' }}>
                            <div className="relative w-20 mx-auto">
                              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <input
                                type="number"
                                value={getEngineBudget(engine.id).replace(/[^0-9.]/g, '')}
                                onChange={(e) => handleEngineBudgetChange(engine.id, e.target.value)}
                                disabled={autoBudgetOptimization}
                                className="w-full text-center text-sm pl-6 pr-2 py-1 h-8 border border-transparent hover:border-slate-200 focus:border-slate-300 focus:outline-none rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                placeholder="0"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle text-center" style={{ width: '100px', minWidth: '100px' }}>
                            <span className={`text-sm font-medium whitespace-nowrap ${engine.id === 'offline' ? 'text-muted-foreground' : 'text-green-600'}`}>
                              {calculateEngineROAS(engine.id)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Main Content */}
              <div className="col-span-9 space-y-4">
                {/* Top Row - Goal, Budget, and Runtime together */}
                <div className="grid grid-cols-3 gap-4">
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

                  {/* Budget Section */}
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

                {/* Bottom Section - Engines (Line Item Style) */}
                <div className="space-y-3">
                  <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
                    <table className="min-w-full text-sm text-slate-700 table-fixed">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ width: '200px', minWidth: '200px' }}>
                            Media proposition
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ width: '120px', minWidth: '120px' }}>
                            Budget
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ width: '100px', minWidth: '100px' }}>
                            Est. ROAS
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ width: '100px', minWidth: '100px' }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {currentEngines.map((engine, index) => (
                          <tr key={engine.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 align-middle" style={{ width: '200px', minWidth: '200px' }}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                {(() => {
                                  const IconComponent = mediaPropositionIcons[engine.name as keyof typeof mediaPropositionIcons];
                                  return IconComponent ? <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : null;
                                })()}
                                <span className="text-sm font-medium text-foreground truncate">{engine.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle text-center" style={{ width: '120px', minWidth: '120px' }}>
                              <div className="relative w-20 mx-auto">
                                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <input
                                  type="number"
                                  value={getEngineBudget(engine.id).replace(/[^0-9.]/g, '')}
                                  onChange={(e) => handleEngineBudgetChange(engine.id, e.target.value)}
                                  disabled={autoBudgetOptimization}
                                  className="w-full text-center text-sm pl-6 pr-2 py-1 h-8 border border-transparent hover:border-slate-200 focus:border-slate-300 focus:outline-none rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                  placeholder="0"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle text-center" style={{ width: '100px', minWidth: '100px' }}>
                              <span className={`text-sm font-medium whitespace-nowrap ${engine.id === 'offline' ? 'text-muted-foreground' : 'text-green-600'}`}>
                                {calculateEngineROAS(engine.id)}
                              </span>
                            </td>
                            <td className="px-4 py-3 align-middle text-center" style={{ width: '100px', minWidth: '100px' }}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEngineEdit ? onEngineEdit(engine.id, engine.name) : console.log(`Edit ${engine.name} engine`)}
                                className="whitespace-nowrap"
                              >
                                Edit
                              </Button>
                            </td>                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Campaign Metrics Row */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <MetricCard
                    label="Reach"
                    value="2.5M"
                    subMetric="Unique users"
                  />
                  <MetricCard
                    label="ROAS"
                    value={estimatedRoas}
                    subMetric="Estimated return"
                  />
                  <MetricCard
                    label="Sales"
                    value="$45.2K"
                    subMetric="+15% vs last period"
                    badgeValue="+15%"
                    badgeVariant="success"
                  />
                </div>

                {/* Optimization Switches */}
                <div className="flex gap-6 pt-4 pb-4">
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
              </div>

              {/* Right Column - Summary */}
              <div className="col-span-3 space-y-2">
                {/* Campaign Summary Title - aligned with other titles */}
                <Label className="text-sm text-muted-foreground">Summary</Label>
                
                {/* Summary Card */}
                <div className="border rounded-lg p-4 bg-white">

                  {/* Budget Set */}
                  <div className="space-y-3 pb-3">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-sm text-muted-foreground">Budget set</span>
                      <span className="text-sm font-medium">{budget}</span>
                    </div>
                  </div>

                  {/* Budget Metrics Group */}
                  <div className="space-y-3 border-t pt-3 pb-3">
                    {/* Used Budget */}
                    {usedBudget && (
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-sm text-muted-foreground">Used Budget</span>
                        <span className="text-sm font-medium">{usedBudget}</span>
                      </div>
                    )}

                    {/* Budget Usage Progress */}
                    {budgetUsagePercentage !== undefined && (
                      <div className="space-y-2 py-0.5">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Budget Usage</span>
                          <span className="text-sm font-medium">{budgetUsagePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              budgetUsagePercentage < 50 ? "bg-green-500" :
                              budgetUsagePercentage < 80 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Group */}
                  {totalPrice && (
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-sm text-muted-foreground">Total Spend</span>
                        <span className="text-sm font-medium">{totalPrice}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          )}

          {/* Action Buttons - Bottom, Left Aligned for all layouts */}
          <div className="flex gap-3 pt-4">
            {layout === 'horizontal' && (
              <Button
                variant="outline"
                onClick={onEdit}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                3 recommendations
              </Button>
            )}
            {onAddToCart && (
              <Button
                onClick={onAddToCart}
              >
                Add to cart
              </Button>
            )}
          </div>
          </CardContent>
        )}
      </Card>
    );
  }
);

CampaignSummary.displayName = 'CampaignSummary';