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
import { DollarSign, ChevronDown, ChevronUp, Sparkles, MonitorSpeaker, ListStart, MonitorPlay, Store, Globe, Info, MessageSquare, Plus, SquarePen, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './dropdown-menu';

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
  onRename?: (newTitle: string) => void;
  onDelete?: () => void;
  defaultExpanded?: boolean;
  hideGoal?: boolean;
  hideTargeting?: boolean;
  hideAgent?: boolean;
  hideAutoBudget?: boolean;
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
    onRename,
    onDelete,
    defaultExpanded = false,
    hideGoal = false,
    hideTargeting = false,
    hideAgent = false,
    hideAutoBudget = false,
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
    const [internalTitle, setInternalTitle] = React.useState(title);
    const [isRenaming, setIsRenaming] = React.useState(false);
    const renameInputRef = React.useRef<HTMLInputElement>(null);
    const renameReadyRef = React.useRef(false);
    const [totalBudgetInput, setTotalBudgetInput] = React.useState(budget ? budget.replace(/[^0-9.]/g, '') : '');
    const [showAddDropdown, setShowAddDropdown] = React.useState(false);
    const [renamingEngineId, setRenamingEngineId] = React.useState<string | null>(null);
    const [engineNames, setEngineNames] = React.useState<Record<string, string>>({});
    const engineRenameInputRef = React.useRef<HTMLInputElement>(null);

    // Available proposition types for adding new campaigns
    const propositionTypes = [
      { id: 'display', name: 'Display', icon: MonitorSpeaker },
      { id: 'sponsored', name: 'Sponsored products', icon: ListStart },
      { id: 'digital', name: 'Digital in-store', icon: MonitorPlay },
      { id: 'offline', name: 'Offline in-store', icon: Store },
      { id: 'offsite', name: 'Offsite', icon: Globe },
    ];

    // Engine ID to campaign details Storybook story URL mapping
    const engineDetailUrlMap: Record<string, string> = {
      'display': '?path=/story/page-templates-campaign-details--display-in-option',
      'sponsored': '?path=/story/page-templates-campaign-details--sponsored-products-in-option',
      'digital': '?path=/story/page-templates-campaign-details--digital-instore-in-option',
      'offline': '?path=/story/page-templates-campaign-details--offline-instore-in-option',
      'offsite': '?path=/story/page-templates-campaign-details--offsite-in-option',
    };
    // Resolve URL from engine ID (supports both "display" and "display-3" formats)
    const getEngineDetailUrl = (engineId: string) => {
      if (engineDetailUrlMap[engineId]) return engineDetailUrlMap[engineId];
      const baseType = engineId.replace(/-\d+$/, '');
      return engineDetailUrlMap[baseType];
    };

    const engineCounter = React.useRef(internalEngines.length);
    const handleAddCampaign = (propositionType: string) => {
      const propType = propositionTypes.find(p => p.id === propositionType);
      if (propType) {
        engineCounter.current += 1;
        const uniqueId = `${propType.id}-${engineCounter.current}`;
        setInternalEngines(prev => [
          ...prev,
          {
            id: uniqueId,
            name: propType.name,
            campaignName: 'Untitled',
            enabled: true,
          },
        ]);
      }
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
      'Offsite': Globe,
    };

    // Handle engine budget change — cap so total doesn't exceed total budget
    const handleEngineBudgetChange = (engineId: string, value: string) => {
      const totalBudgetVal = parseFloat(totalBudgetInput) || 0;
      const requestedVal = parseFloat(value) || 0;

      // Sum of all other engine budgets (excluding current one)
      const otherEnginesTotal = Object.entries(engineBudgets).reduce((sum, [id, b]) => {
        if (id === engineId) return sum;
        return sum + (parseFloat(b.replace(/[^0-9.]/g, '')) || 0);
      }, 0);

      const maxAllowed = Math.max(totalBudgetVal - otherEnginesTotal, 0);
      const cappedVal = totalBudgetVal > 0 ? Math.min(requestedVal, maxAllowed) : requestedVal;

      const newBudget = `$${cappedVal}`;
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
      return engineBudgets[engineId] || '$0';
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
        'offsite': 2.1,
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

    // Notify parent when engine budgets change (without overwriting total budget)
    React.useEffect(() => {
      if (onBudgetChange && totalBudgetInput) {
        onBudgetChange(`$${totalBudgetInput}`);
      }
    }, [engineBudgets]);

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

    // ── Dynamic estimated metrics for horizontal layout ──
    const budgetNumForMetrics = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0;
    const hasBudget = budgetNumForMetrics > 0;
    const enabledEngineCount = currentEngines.filter(e => e.enabled).length;

    // Progress bars only show when there is actual spend data (campaign is running)
    const usedBudgetNum = parseFloat((usedBudget || '$0').replace(/[^0-9.]/g, '')) || 0;
    const hasProgress = hasBudget && usedBudgetNum > 0;

    const fmtNumber = (num: number): string => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return `${Math.round(num)}`;
    };
    const fmtCurrency = (num: number): string => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
      return `$${Math.round(num)}`;
    };

    // Reach: ~170 impressions per dollar, boosted by toggles
    const reachMult = autoBudgetOptimization && autoTargeting ? 250 :
      autoTargeting ? 215 : autoBudgetOptimization ? 185 : 170;
    const estReach = hasBudget ? fmtNumber(budgetNumForMetrics * reachMult) : '—';
    const estReachCurrent = hasProgress ? `Current: ${fmtNumber(budgetNumForMetrics * reachMult * 0.64)}` : undefined;
    const reachProgress = hasProgress ? (
      autoBudgetOptimization && autoTargeting ? 95 :
      autoTargeting ? 82 : autoBudgetOptimization ? 72 : 64
    ) : undefined;

    // ROAS: base 3.2x + engine bonus, boosted by toggles
    const engBonus = Math.min(enabledEngineCount * 0.2, 1.0);
    const baseRoasEst = 3.2 + engBonus;
    const roasMult = autoBudgetOptimization && autoTargeting ? 1.4 :
      autoBudgetOptimization ? 1.22 : autoTargeting ? 1.1 : 1.0;
    const estRoasNum = baseRoasEst * roasMult;
    const estRoas = hasBudget ? `${estRoasNum.toFixed(1)}x` : '—';
    const estRoasCurrent = hasProgress ? `Current: ${(estRoasNum * 0.78).toFixed(1)}x` : undefined;
    const roasProgress = hasProgress ? (
      autoBudgetOptimization && autoTargeting ? 88 :
      autoBudgetOptimization ? 78 : autoTargeting ? 70 : 64
    ) : undefined;

    // Sales: budget × ROAS
    const estSalesNum = budgetNumForMetrics * estRoasNum;
    const estSales = hasBudget ? fmtCurrency(estSalesNum) : '—';
    const estSalesCurrent = hasProgress ? `Current: ${fmtCurrency(estSalesNum * 0.64)}` : undefined;
    const estSalesGrowth = hasProgress ? (
      autoBudgetOptimization && autoTargeting ? '+42%' :
      autoBudgetOptimization ? '+30%' : autoTargeting ? '+22%' : '+15%'
    ) : undefined;
    const salesProgress = hasProgress ? (
      autoBudgetOptimization && autoTargeting ? 95 :
      autoBudgetOptimization ? 82 : autoTargeting ? 73 : 64
    ) : undefined;

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
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-foreground text-background border-foreground z-50"
          >
            {badge.text}
          </Badge>
        )}
        
        <CardHeader
          className={`${layout !== 'vertical' && isCollapsed ? 'space-y-0.5' : 'space-y-4'} ${layout !== 'vertical' ? `cursor-pointer transition-colors ${isCollapsed ? 'hover:bg-muted/50' : ''}` : ''}`}
          onClick={layout !== 'vertical' ? () => { if (!isRenaming) setIsCollapsed(!isCollapsed); } : undefined}
        >
          {/* Title and Badges Row */}
          <div className="flex justify-between items-start gap-4">
            {/* Title - Left Aligned */}
            <div className="flex-1">
              {isRenaming ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={internalTitle}
                    onChange={(e) => setInternalTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsRenaming(false);
                        if (onRename) onRename(internalTitle);
                      }
                      if (e.key === 'Escape') {
                        setIsRenaming(false);
                        setInternalTitle(internalTitle);
                      }
                    }}
                    className="text-xl font-semibold text-foreground leading-tight bg-background border border-border rounded-md px-2 py-1 flex-1 focus:outline-none focus:border-ring"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsRenaming(false);
                      if (onRename) onRename(internalTitle);
                    }}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <h2 className="text-xl font-semibold text-foreground leading-tight">
                  {internalTitle}
                </h2>
              )}
              {layout === 'vertical' && (
                <div className="mt-2">
                  <Badge variant="success" className="text-sm font-medium">
                    Est. ROAS {calculateTotalROAS()}
                  </Badge>
                </div>
              )}
            </div>

            {/* Badges, Ellipsis Menu and Collapse Button - Right Aligned (horizontal layout only) */}
            {layout !== 'vertical' && (
              <div className="flex items-center gap-2">
                {badge ? (
                  <Badge variant={badge.variant || 'default'}>
                    {badge.text}
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    In-option
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setIsRenaming(true);
                        setTimeout(() => {
                          renameInputRef.current?.focus();
                          renameInputRef.current?.select();
                        }, 50);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCollapsed(!isCollapsed);
                  }}
                >
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          {/* Subtitle and Summary Row - Only when collapsed (horizontal layout only) */}
          {layout !== 'vertical' && isCollapsed && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {!hideGoal ? `${goal.replace(/-/g, ' ')} • ` : ''}{hasBudget ? budget : 'No budget set'} • {dateRange ?
                  `${dateRange.from?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} - ${dateRange.to?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}` :
                  'No dates selected'
                }
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
                {!hideGoal && (
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
                    className="bg-muted/50 border-border"
                  />
                </div>
                )}

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
                      className="w-full h-9 bg-muted/50 border border-border pl-10 py-1 rounded-md focus:outline-none focus:border-ring [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
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
                    className="bg-muted/50 border-border"
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
                            <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                              <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                              <input
                                type="number"
                                value={budgetVal || ''}
                                onChange={(e) => handleEngineBudgetChange(engine.id, e.target.value)}
                                placeholder="Budget"
                                className="w-28 h-8 text-sm bg-background border border-border pl-8 pr-2 rounded-md focus:outline-none focus:border-ring [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                              />
                            </div>
                          )}
                          {engine.enabled && (onEngineEdit || getEngineDetailUrl(engine.id)) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEngineEdit) {
                                  onEngineEdit(engine.id, engine.name);
                                } else {
                                  window.top!.location.href = getEngineDetailUrl(engine.id);
                                }
                              }}
                              title={`View ${engine.name} campaign details`}
                            >
                              <SquarePen className="h-4 w-4" />
                              Edit
                            </Button>
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
                      <div className="absolute z-20 w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
                        {propositionTypes.map((type) => {
                          const TypeIcon = type.icon;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => handleAddCampaign(type.id)}
                              className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
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
                {!hideAutoBudget && (
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoBudgetOptimization}
                    onCheckedChange={setAutoBudgetOptimization}
                  />
                  <span className="text-sm text-foreground">Auto Budget Optimization</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                )}
                {!hideTargeting && (
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoTargeting}
                    onCheckedChange={setAutoTargeting}
                  />
                  <span className="text-sm text-foreground">Auto Targeting</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                )}
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
                  value={hasBudget ? budget : '—'}
                  subMetric={hasBudget && totalPrice ? `Total Spend: ${totalPrice}` : undefined}
                  progress={hasProgress ? calculateBudgetUsage : undefined}
                  variant="graph"
                />
                <MetricCard
                  label="Est. Impressions"
                  value={estReach}
                  subMetric={estReachCurrent}
                  variant="graph"
                  progress={reachProgress}
                  className="transition-all duration-500 ease-in-out"
                />
                <MetricCard
                  label="Est. ROAS"
                  value={estRoas}
                  subMetric={estRoasCurrent}
                  variant="graph"
                  progress={roasProgress}
                  className="transition-all duration-500 ease-in-out"
                />
                <MetricCard
                  label="Est. Sales"
                  value={estSales}
                  subMetric={estSalesCurrent}
                  badgeValue={estSalesGrowth}
                  badgeVariant="success"
                  variant="graph"
                  progress={salesProgress}
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
                      const detailUrl = getEngineDetailUrl(engine.id);
                      const displayName = engineNames[engine.id] || engine.campaignName;
                      const isEngineRenaming = renamingEngineId === engine.id;
                      return (
                        <div
                          key={engine.id}
                          className={cn(
                            "rounded-lg border transition-all cursor-pointer hover:border-primary/50",
                            engine.enabled ? 'border-border' : 'border-border/50'
                          )}
                          onClick={() => {
                            if (renamingEngineId) return;
                            if (onEngineEdit) {
                              onEngineEdit(engine.id, engine.name);
                            } else if (detailUrl) {
                              window.top!.location.href = detailUrl;
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 p-3 min-h-[56px]">
                            <div onClick={(e) => e.stopPropagation()}>
                              <Switch
                                checked={engine.enabled}
                                onCheckedChange={(checked) => handleEngineToggle(engine.id, checked)}
                              />
                            </div>
                            <div className={cn(
                              "w-7 h-7 rounded-md flex items-center justify-center transition-colors flex-shrink-0",
                              engine.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            )}>
                              {IconComponent && <IconComponent size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              {isEngineRenaming ? (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    ref={engineRenameInputRef}
                                    type="text"
                                    value={engineNames[engine.id] ?? engine.campaignName ?? ''}
                                    onChange={(e) => setEngineNames(prev => ({ ...prev, [engine.id]: e.target.value }))}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') setRenamingEngineId(null);
                                      if (e.key === 'Escape') {
                                        setEngineNames(prev => { const n = { ...prev }; delete n[engine.id]; return n; });
                                        setRenamingEngineId(null);
                                      }
                                    }}
                                    className="text-sm font-medium bg-background border border-border rounded-md px-2 py-1 flex-1 focus:outline-none focus:border-ring"
                                  />
                                  <Button size="sm" onClick={() => setRenamingEngineId(null)}>Save</Button>
                                </div>
                              ) : (
                                <span className={cn(
                                  "text-sm font-medium",
                                  !engine.enabled && 'text-muted-foreground'
                                )}>
                                  {engine.name}
                                  {displayName && (
                                    <span className="text-muted-foreground font-normal"> – {displayName}</span>
                                  )}
                                </span>
                              )}
                            </div>
                            <div className={cn("relative flex-shrink-0", !engine.enabled && "opacity-50")} onClick={(e) => e.stopPropagation()}>
                              <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                              <input
                                type="number"
                                value={budgetVal || ''}
                                onChange={(e) => handleEngineBudgetChange(engine.id, e.target.value)}
                                placeholder="Budget"
                                disabled={!engine.enabled}
                                className="w-28 h-8 text-sm bg-background border border-border pl-8 pr-2 rounded-md focus:outline-none focus:border-ring disabled:cursor-not-allowed [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                              />
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {(onEngineEdit || detailUrl) && (
                                    <DropdownMenuItem onSelect={() => {
                                      if (onEngineEdit) {
                                        onEngineEdit(engine.id, engine.name);
                                      } else if (detailUrl) {
                                        window.top!.location.href = detailUrl;
                                      }
                                    }}>
                                      <SquarePen className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setRenamingEngineId(engine.id);
                                    if (!engineNames[engine.id]) {
                                      setEngineNames(prev => ({ ...prev, [engine.id]: engine.campaignName || '' }));
                                    }
                                    setTimeout(() => {
                                      engineRenameInputRef.current?.focus();
                                      engineRenameInputRef.current?.select();
                                    }, 50);
                                  }}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
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
                        <div className="absolute z-20 w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
                          {propositionTypes.map((type) => {
                            const TypeIcon = type.icon;
                            return (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => handleAddCampaign(type.id)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
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
                  {!hideAgent && (
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
                  )}

                  {/* AI Notifications Section - Only show when autoSuggestions is enabled */}
                  {!hideAgent && autoSuggestions && (
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
                    <CardHeader className="pb-2">
                      <span className="text-sm font-semibold text-foreground">Settings</span>
                    </CardHeader>
                    <CardSummaryContent>
                      <div className="space-y-5">
                        {/* Goal */}
                        {!hideGoal && (
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
                            className="bg-background border-border"
                          />
                        </div>
                        )}

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
                              className="w-full h-9 bg-background border border-border pl-10 py-1 rounded-md focus:outline-none focus:border-ring [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                              placeholder="Enter budget amount"
                            />
                          </div>
                          {/* Budget breakdown lines */}
                          {(() => {
                            const totalBudgetVal = parseFloat(totalBudgetInput) || 0;
                            const allocatedBudget = currentEngines.reduce((sum, engine) => {
                              const b = parseFloat(getEngineBudget(engine.id).replace(/[^0-9.]/g, '')) || 0;
                              return sum + b;
                            }, 0);
                            const remaining = Math.max(totalBudgetVal - allocatedBudget, 0);
                            return (
                              <div className="space-y-1.5 pt-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Budget remaining</span>
                                  <span className="text-sm font-medium text-foreground">{fmtCurrency(remaining)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Budget allocated</span>
                                  <span className="text-sm font-medium text-foreground">{fmtCurrency(allocatedBudget)}</span>
                                </div>
                              </div>
                            );
                          })()}
                          {!hideAutoBudget && (
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
                          )}
                        </div>

                        {/* Targeting + Auto Targeting */}
                        {!hideTargeting && (
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
                            className="bg-background border-border"
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
                        )}

                        {/* Run Time */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Run time</Label>
                          <DateRangePicker
                            dateRange={dateRange}
                            onDateRangeChange={onDateRangeChange}
                            placeholder="Select campaign dates"
                            className="bg-background border-border"
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