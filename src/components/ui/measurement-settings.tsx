'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * How the numbers are counted — attribution window and model, whether halo
 * sales count, whether only hero products count. Not a filter on WHICH
 * rows show but on HOW every number is measured, so it sits with the
 * filters and the date range: everything that changes the figures, in one
 * row above them.
 */

/** Which sales count against the media. */
export type SalesScope = 'hero' | 'halo' | 'basket';

export interface MeasurementSettingsValue {
  /** Days after an ad exposure in which a sale still counts. */
  attributionWindow: 7 | 14 | 30;
  scope: SalesScope;
}

export const DEFAULT_MEASUREMENT: MeasurementSettingsValue = {
  attributionWindow: 14,
  scope: 'halo',
};

export const SCOPE_LABEL: Record<SalesScope, string> = {
  hero: 'Hero products only',
  halo: 'Hero + halo',
  basket: 'Full basket',
};
const SCOPE_HINT: Record<SalesScope, string> = {
  hero: 'Only the products named on the booking.',
  halo: "The hero products plus the brand's other products lifted by the campaign.",
  basket: 'Everything in the baskets of reached shoppers.',
};

/** One line that says how the figures are counted, for a button. */
export const measurementSummary = (v: MeasurementSettingsValue) => `${v.attributionWindow}d · ${SCOPE_LABEL[v.scope]}`;

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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium">Attribution window</label>
          <Input
            dropdown
            options={[7, 14, 30].map((d) => ({ value: String(d), label: `${d} days` }))}
            value={String(value.attributionWindow)}
            onChange={(v) => set('attributionWindow', Number(v) as 7 | 14 | 30)}
          />
          <p className="mt-1 text-xs text-muted-foreground">Days after an ad exposure in which a sale still counts.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium">Sales counted</label>
          <Input
            dropdown
            options={(Object.keys(SCOPE_LABEL) as SalesScope[]).map((k) => ({ value: k, label: SCOPE_LABEL[k] }))}
            value={value.scope}
            onChange={(v) => set('scope', v as SalesScope)}
          />
          <p className="mt-1 text-xs text-muted-foreground">{SCOPE_HINT[value.scope]}</p>
        </div>
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
