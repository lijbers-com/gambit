'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Switch } from './switch';

/**
 * How the numbers are counted — attribution window and model, whether halo
 * sales count, whether only hero products count. Not a filter on WHICH
 * rows show but on HOW every number is measured, so it sits with the
 * filters and the date range: everything that changes the figures, in one
 * row above them.
 */

export type AttributionModel = 'last-click' | 'any-click' | 'view-through';

export interface MeasurementSettingsValue {
  /** Days after an ad exposure in which a sale still counts. */
  attributionWindow: 7 | 14 | 30;
  model: AttributionModel;
  /** Count sales of the brand's other products lifted by the campaign. */
  includeHalo: boolean;
  /** Count only the hero products named on the booking. */
  heroOnly: boolean;
}

export const DEFAULT_MEASUREMENT: MeasurementSettingsValue = {
  attributionWindow: 14,
  model: 'last-click',
  includeHalo: true,
  heroOnly: false,
};

const MODEL_LABEL: Record<AttributionModel, string> = {
  'last-click': 'Last click',
  'any-click': 'Any click',
  'view-through': 'View-through',
};

/** One line that says how the figures are counted, for the button. */
export const measurementSummary = (v: MeasurementSettingsValue) =>
  `${v.attributionWindow}d · ${MODEL_LABEL[v.model]}${v.includeHalo ? ' · halo' : ''}${v.heroOnly ? ' · hero only' : ''}`;

/** The settings themselves — hosted by the popover below, or by a dialog
 *  (the metric row's Edit metrics) so the filter row stays one line. */
export const MeasurementSettingsFields: React.FC<{
  value: MeasurementSettingsValue;
  onChange: (next: MeasurementSettingsValue) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const set = <K extends keyof MeasurementSettingsValue>(key: K, val: MeasurementSettingsValue[K]) => onChange({ ...value, [key]: val });
  return (
    <div className={cn('space-y-4', className)}>
  <div>
    <div className="text-sm font-medium">How the numbers are counted</div>
    <p className="text-xs text-muted-foreground">Applies to every figure on this page.</p>
  </div>
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="mb-1.5 block text-xs font-medium">Attribution window</label>
      <Input
        dropdown
        options={[7, 14, 30].map((d) => ({ value: String(d), label: `${d} days` }))}
        value={String(value.attributionWindow)}
        onChange={(v) => set('attributionWindow', Number(v) as 7 | 14 | 30)}
      />
    </div>
    <div>
      <label className="mb-1.5 block text-xs font-medium">Model</label>
      <Input
        dropdown
        options={(Object.keys(MODEL_LABEL) as AttributionModel[]).map((m) => ({ value: m, label: MODEL_LABEL[m] }))}
        value={value.model}
        onChange={(v) => set('model', v as AttributionModel)}
      />
    </div>
  </div>
  <div className="space-y-2">
    <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
      <span>
        <span className="block text-sm font-medium">Include halo effect</span>
        <span className="block text-xs text-muted-foreground">Sales of the brand's other products lifted by the campaign</span>
      </span>
      <Switch checked={value.includeHalo} onCheckedChange={(on) => set('includeHalo', on)} />
    </label>
    <label className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
      <span>
        <span className="block text-sm font-medium">Hero products only</span>
        <span className="block text-xs text-muted-foreground">Count only the products named on the booking</span>
      </span>
      <Switch checked={value.heroOnly} onCheckedChange={(on) => set('heroOnly', on)} />
    </label>
  </div>
    </div>
  );
};

export const MeasurementSettings: React.FC<{
  value: MeasurementSettingsValue;
  onChange: (next: MeasurementSettingsValue) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('gap-2', className)} title="How the numbers are counted">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Measurement</span>
          <span className="text-xs text-muted-foreground">{measurementSummary(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <MeasurementSettingsFields value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};
