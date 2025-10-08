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
  engines: CampaignEngine[];
  dateRange?: DateRange;
  features: CampaignFeature[];
  onGoalChange?: (goal: string) => void;
  onAudienceChange?: (audience: string) => void;
  onBudgetChange?: (budget: string) => void;
  onEngineToggle?: (engineId: string, enabled: boolean) => void;
  onFeatureToggle?: (featureId: string, enabled: boolean) => void;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
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
    engines,
    dateRange,
    features,
    onGoalChange,
    onAudienceChange,
    onBudgetChange,
    onEngineToggle,
    onFeatureToggle,
    onDateRangeChange,
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
      <Card ref={ref} className={cn('w-full max-w-md mx-auto', className)} {...props}>
        <CardHeader className="space-y-4">
          {/* Badge */}
          {badge && (
            <div className="flex justify-center">
              <Badge
                variant={badge.variant || 'default'}
                className="bg-slate-800 text-white border-slate-800 px-4 py-1 text-sm rounded-full"
              >
                {badge.text}
              </Badge>
            </div>
          )}

          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground leading-tight">
              {title}
            </h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
              placeholder="Select campaign dates"
              className="bg-slate-50 border-slate-200"
              showPresets={true}
            />
          </div>

          {/* Audience Section */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Audience
            </Label>
            <Input
              dropdown
              options={audienceOptions || [
                { label: 'AH bonus shoppers', value: 'ah-bonus' },
                { label: 'Premium customers', value: 'premium' },
                { label: 'New customers', value: 'new' },
                { label: 'Loyal customers', value: 'loyal' },
                { label: 'High-value customers', value: 'high-value' },
              ]}
              value={audience}
              onChange={onAudienceChange || (() => {})}
              placeholder="Select audience"
              className="bg-slate-50 border-slate-200"
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
        </CardContent>
      </Card>
    );
  }
);

CampaignSummary.displayName = 'CampaignSummary';