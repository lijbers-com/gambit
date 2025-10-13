'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Button } from './button';
import { DateRangePicker } from './date-picker';
import { DateRange } from 'react-day-picker';

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
  dateRange?: DateRange;
  features: CampaignFeature[];
  layout?: 'vertical' | 'horizontal';
  onGoalChange?: (goal: string) => void;
  onAudienceChange?: (audience: string) => void;
  onBudgetChange?: (budget: string) => void;
  onEngineToggle?: (engineId: string, enabled: boolean) => void;
  onFeatureToggle?: (featureId: string, enabled: boolean) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
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
    dateRange,
    features,
    layout = 'vertical',
    onGoalChange,
    onAudienceChange,
    onBudgetChange,
    onEngineToggle,
    onFeatureToggle,
    onDateRangeChange,
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
    return (
      <Card ref={ref} className={cn(
        'w-full',
        layout === 'vertical' ? 'max-w-md mx-auto' : '',
        className
      )} {...props}>
        <CardHeader className="space-y-4">
          {/* Title and Badges Row */}
          <div className="flex justify-between items-center">
            {/* Title - Left Aligned */}
            <h2 className="text-xl font-semibold text-foreground leading-tight">
              {title}
            </h2>

            {/* Badges - Right Aligned */}
            <div className="flex gap-2">
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
            </div>
          </div>
        </CardHeader>

        <CardContent className={layout === 'vertical' ? 'space-y-6' : 'p-6'}>
          {layout === 'vertical' ? (
            // Vertical Layout (original)
            <>
              {/* Goal Section */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Goal
                </Label>
                <Input
                  dropdown
                  options={goalOptions || [
                    { label: 'Performance on transaction', value: 'performance-transaction' },
                    { label: 'Brand awareness', value: 'brand-awareness' },
                    { label: 'Lead generation', value: 'lead-generation' },
                    { label: 'Customer acquisition', value: 'customer-acquisition' },
                    { label: 'Retargeting', value: 'retargeting' },
                  ]}
                  value={goal}
                  onChange={onGoalChange || (() => {})}
                  placeholder="Select goal"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Metrics Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {estimatedRoas}
                  </div>
                  <div className="text-sm text-muted-foreground">Est. ROAS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {budget}
                  </div>
                  <div className="text-sm text-muted-foreground">Budget</div>
                </div>
              </div>

              {/* Engines Section */}
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Engines:</Label>
                <ul className="space-y-1">
                  {currentEngines.map((engine) => (
                    <li key={engine.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">• {engine.name}</span>
                      <Switch
                        checked={engine.enabled}
                        onCheckedChange={(checked) => handleEngineToggle(engine.id, checked)}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Run Time Section */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Run time:</Label>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={onDateRangeChange}
                  placeholder="Select campaign dates with conversion window"
                  className="bg-slate-50 border-slate-200"
                  showPresets={true}
                  showConversionWindow={true}
                  conversionWindow={conversionWindow}
                  onConversionWindowChange={onConversionWindowChange}
                />
              </div>


              {/* Features Section - only show if there are features */}
              {currentFeatures.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">Features:</Label>
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

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="w-full"
                >
                  Edit
                </Button>
                <Button
                  onClick={onAddToCart}
                  className="w-full"
                >
                  Add to cart
                </Button>
              </div>
            </>
          ) : (
            // Horizontal Layout
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Main Content */}
              <div className="col-span-9 space-y-4">
                {/* Top Row - Goal and Runtime on one line */}
                <div className="grid grid-cols-2 gap-4">
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
                      ]}
                      value={goal}
                      onChange={onGoalChange || (() => {})}
                      placeholder="Select goal"
                      className="bg-slate-50 border-slate-200"
                    />
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
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="border-b bg-slate-50 px-4 py-2">
                      <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        <span>Media products</span>
                        <span className="text-center">Budget</span>
                        <span className="text-center">Est. ROAS</span>
                      </div>
                    </div>
                    <div className="divide-y">
                      {currentEngines.map((engine) => (
                        <div key={engine.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                          <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="text-sm font-medium text-foreground">{engine.name}</span>
                            <div className="text-center">
                              <span className="text-sm font-medium text-foreground">$1,667</span>
                            </div>
                            <div className="text-center">
                              <span className="text-sm font-medium text-green-600">4.8x</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary */}
              <div className="col-span-3 space-y-4">
                {/* Summary Card */}
                <div className="border rounded-lg p-4 bg-white">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Campaign Summary</h3>

                  {/* ROAS and Budget Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        {estimatedRoas}
                      </div>
                      <div className="text-xs text-muted-foreground">Est. ROAS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-foreground">
                        {budget}
                      </div>
                      <div className="text-xs text-muted-foreground">Budget</div>
                    </div>
                  </div>

                  {/* Budget Usage Details */}
                  <div className="space-y-3 border-t pt-3">
                    {/* Used Budget */}
                    {usedBudget && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Used Budget</span>
                        <span className="text-sm font-medium">{usedBudget}</span>
                      </div>
                    )}

                    {/* Total Price */}
                    {totalPrice && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Total Price</span>
                        <span className="text-sm font-medium">{totalPrice}</span>
                      </div>
                    )}

                    {/* Budget Usage Progress */}
                    {budgetUsagePercentage !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Budget Usage</span>
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
                </div>
              </div>
            </div>

          )}

          {/* Action Buttons - Bottom, Left Aligned for all layouts */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              onClick={onAddToCart}
            >
              Add to cart
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

CampaignSummary.displayName = 'CampaignSummary';