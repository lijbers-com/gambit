'use client';

import * as React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PacingShapeSelect, type PacingShape } from './budget-pacing';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

/**
 * Delivery settings — how a booking delivers, as one set of blocks.
 *
 * The booking detail form and the booking wizard ask the same questions
 * (delivery behaviour, delivery objectives), so they render the same fields
 * from here. Each block takes a value object and an onChange, and a surface
 * supplies the state — which is why creating a booking and editing one can
 * never show two different versions of these settings.
 */

const InfoTip: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center text-muted-foreground"><Info className={className ?? 'h-3.5 w-3.5'} /></span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{text}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/** Compact single-select, the shape every small chooser in a form uses. */
export const MiniSelect: React.FC<{ value: string; options: string[]; onChange: (v: string) => void }> = ({ value, options, onChange }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full flex items-center justify-between font-normal">
        {value}
        <ChevronDown className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
      {options.map((opt) => (
        <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>{opt}</DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

/** A switch with a label, one line of what it does, and the detail behind an i. */
export const ToggleRow: React.FC<{
  label: string; hint?: string; checked: boolean; onCheckedChange: (v: boolean) => void; info?: string; rightText?: string;
}> = ({ label, hint, checked, onCheckedChange, info, rightText }) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <span className="min-w-0">
      <span className="flex items-center gap-1.5 font-medium text-sm">
        {label}
        {info && <InfoTip text={info} />}
      </span>
      {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
    </span>
    <div className="flex shrink-0 items-center gap-3">
      {rightText && <span className="text-sm text-muted-foreground">{rightText}</span>}
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  </div>
);

/**
 * A section that is one decision: off means "not used" (and says what the
 * default does), on reveals its fields. Bordered as a standalone section on
 * the detail pages; flat inside a wizard's step card.
 */
export const ToggleSection: React.FC<{
  title: string; info: string; offSummary: string; checked: boolean; onCheckedChange: (v: boolean) => void;
  bordered?: boolean; className?: string; children: React.ReactNode;
}> = ({ title, info, offSummary, checked, onCheckedChange, bordered = true, className, children }) => (
  <div className={cn(bordered && 'rounded-xl border border-border p-6', className)}>
    <div className={cn('flex items-start justify-between gap-4', checked && 'mb-6')}>
      <h2 className={cn('flex items-center gap-1.5 font-semibold', bordered ? 'text-lg' : 'text-sm')}>
        {title}
        <InfoTip text={info} className="h-4 w-4" />
      </h2>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="mt-1 shrink-0" />
    </div>
    {!checked && <p className="mt-3 text-xs text-muted-foreground">{offSummary}</p>}
    {checked && children}
  </div>
);

// ─── Delivery behaviour ──────────────────────────────────────────────────────

export interface DeliveryBehaviorValue {
  optimizeForCPC: boolean;
  userFrequencyCap: boolean;
  freqCapImpressions: string;
  freqCapExpiry: string;
  deliveryMethod: string;
  exclusivity: boolean;
  exclusivityMode: string;
}

export const defaultDeliveryBehavior: DeliveryBehaviorValue = {
  optimizeForCPC: false,
  userFrequencyCap: false,
  freqCapImpressions: '',
  freqCapExpiry: '',
  deliveryMethod: 'Account setting',
  exclusivity: false,
  exclusivityMode: 'one-at-a-time',
};

export const DELIVERY_METHODS = ['Account setting', 'Frontloaded', 'Even', 'ASAP'];

/** Delivery method is stored as its label; pacing is chosen as a shape. One
 *  map both ways, so the stored value never drifts from the control. */
const SHAPE_BY_METHOD: Record<string, PacingShape> = {
  'Account setting': 'account',
  Frontloaded: 'frontloaded',
  Even: 'even',
  ASAP: 'asap',
};
const METHOD_BY_SHAPE: Record<PacingShape, string> = {
  account: 'Account setting',
  frontloaded: 'Frontloaded',
  even: 'Even',
  asap: 'ASAP',
};
export const deliveryMethodToShape = (m: string): PacingShape => SHAPE_BY_METHOD[m] ?? 'account';
export const shapeToDeliveryMethod = (s: PacingShape): string => METHOD_BY_SHAPE[s];

export const DeliveryBehaviorFields: React.FC<{
  value: DeliveryBehaviorValue;
  onChange: (next: DeliveryBehaviorValue) => void;
}> = ({ value, onChange }) => {
  const set = <K extends keyof DeliveryBehaviorValue>(key: K, v: DeliveryBehaviorValue[K]) => onChange({ ...value, [key]: v });
  return (
    <div className="space-y-3">
      <ToggleRow
        label="Optimise for cost per click"
        hint="Spend shifts toward the placements winning clicks most cheaply."
        checked={value.optimizeForCPC}
        onCheckedChange={(v) => set('optimizeForCPC', v)}
        info="Bids shift toward placements with cheaper clicks. Use when clicks, not views, are what the booking is judged on."
      />
      <ToggleRow
        label="User frequency cap"
        hint="Limit how many times one shopper sees this booking."
        checked={value.userFrequencyCap}
        onCheckedChange={(v) => set('userFrequencyCap', v)}
        info="Limits how often one shopper sees this booking: the impressions amount per user, within the expiry window."
      />
      {value.userFrequencyCap && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="block">Impressions amount</Label>
            <Input type="number" value={value.freqCapImpressions} onChange={(e) => set('freqCapImpressions', e.target.value)} placeholder="e.g. 3" />
          </div>
          <div className="space-y-2">
            <Label className="block">Expiry in hours</Label>
            <Input type="number" value={value.freqCapExpiry} onChange={(e) => set('freqCapExpiry', e.target.value)} placeholder="e.g. 24" />
          </div>
        </div>
      )}
      <div className="space-y-3 py-2">
        <span className="flex items-center gap-1.5 font-medium text-sm">
          Pacing
          <InfoTip text="How the budget spreads over the flight: frontloaded spends faster early, even paces it flat, ASAP delivers as fast as inventory allows." />
        </span>
        {/* The same pacing cards a sponsored-products booking gets. Pacing is
            one decision with one shape, so it is one control — an auction
            campaign should not meet it as a dropdown here and as cards there. */}
        <PacingShapeSelect
          value={deliveryMethodToShape(value.deliveryMethod)}
          onChange={(shape) => set('deliveryMethod', shapeToDeliveryMethod(shape))}
          shapes={['account', 'even', 'frontloaded', 'asap']}
        />
      </div>
      <ToggleRow
        label="Exclusivity"
        hint="Keep competing ads out of the slots this booking runs in."
        checked={value.exclusivity}
        onCheckedChange={(v) => set('exclusivity', v)}
        info="Reserves the placement: no other campaign, or no other creative, shares the slot while this booking delivers."
      />
      {value.exclusivity && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {[
            { id: 'one-at-a-time', label: 'One at a time' },
            { id: 'campaign', label: 'Exclusive on campaign' },
            { id: 'creative', label: 'Exclusive on creative' },
          ].map((opt) => (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 text-sm has-[:checked]:border-surface-selected-border has-[:checked]:bg-surface-selected">
              <input
                type="radio"
                name="exclusivity-mode"
                className="h-4 w-4 accent-primary"
                checked={value.exclusivityMode === opt.id}
                onChange={() => set('exclusivityMode', opt.id)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Delivery objectives ─────────────────────────────────────────────────────

export interface DeliveryObjectivesValue {
  priority: string;
  reachUnit: string;
  reachAmount: string;
  limitAmount: string;
  limitEvent: string;
  limitPeriod: string;
}

export const defaultDeliveryObjectives: DeliveryObjectivesValue = {
  priority: 'Inherited from campaign',
  reachUnit: 'Impressions',
  reachAmount: '1000',
  limitAmount: '',
  limitEvent: 'Impressions',
  limitPeriod: 'Daily',
};

export const DELIVERY_OBJECTIVES_INFO = 'Optional targets that constrain delivery: priority against other bookings, a reach goal, or a hard delivery limit. Off means the booking simply delivers as booked.';
export const DELIVERY_OBJECTIVES_OFF = 'Delivers as booked — priority inherited from the campaign, no reach goal and no delivery limit.';

export const DeliveryObjectivesFields: React.FC<{
  value: DeliveryObjectivesValue;
  onChange: (next: DeliveryObjectivesValue) => void;
}> = ({ value, onChange }) => {
  const set = <K extends keyof DeliveryObjectivesValue>(key: K, v: DeliveryObjectivesValue[K]) => onChange({ ...value, [key]: v });
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="block">Priority</Label>
        <MiniSelect value={value.priority} options={['Inherited from campaign', 'Highest', 'High', 'Normal', 'Low']} onChange={(v) => set('priority', v)} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="block">Reach unit</Label>
          <MiniSelect value={value.reachUnit} options={['Impressions', 'Unique users', 'Clicks']} onChange={(v) => set('reachUnit', v)} />
        </div>
        <div className="space-y-2">
          <Label className="block">Reach amount</Label>
          <Input type="number" value={value.reachAmount} onChange={(e) => set('reachAmount', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="block">Delivery limit</Label>
          <Input type="number" value={value.limitAmount} onChange={(e) => set('limitAmount', e.target.value)} placeholder="No limit" />
        </div>
        <div className="space-y-2">
          <Label className="block">Delivery limit event</Label>
          <MiniSelect value={value.limitEvent} options={['Impressions', 'Clicks', 'Conversions']} onChange={(v) => set('limitEvent', v)} />
        </div>
        <div className="space-y-2">
          <Label className="block">Delivery limit period</Label>
          <MiniSelect value={value.limitPeriod} options={['Daily', 'Weekly', 'Whole flight']} onChange={(v) => set('limitPeriod', v)} />
        </div>
      </div>
    </div>
  );
};
