import * as React from 'react';
import { Check, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { Filter } from './filter';
import { Input } from './input';

/**
 * Funnel → Objective (Doelstelling) → KPI catalog. Picking an objective surfaces
 * the KPIs that objective can be measured on; the user selects which to track.
 * Mirrors the retail-media measurement framework (Awareness / Consideration /
 * Conversion). Objective names can repeat across funnels, so each objective is
 * addressed by a composite id `${funnel}__${name}`.
 */
export interface ObjectiveDef {
  name: string;
  kpis: string[];
}

export interface FunnelDef {
  funnel: string;
  objectives: ObjectiveDef[];
}

export const objectiveKpiCatalog: FunnelDef[] = [
  {
    funnel: 'Awareness',
    objectives: [
      { name: 'Vergroten merkbekendheid', kpis: ['Top-of-mind merkbekendheid', 'Spontane merkbekendheid', 'Geholpen merkbekendheid', 'Reclamebekendheid', 'Uniek bereik', 'Frequentie', 'VCR', 'CPM'] },
      { name: 'Vergroten productbekendheid', kpis: ['Top-of-mind productbekendheid', 'Spontane productbekendheid', 'Geholpen productbekendheid', 'Reclamebekendheid', 'Uniek bereik', 'Frequentie', 'VCR', 'CPM'] },
      { name: 'Versterken merkassociaties/-waardes', kpis: ['Merkassociaties/-waardes', 'CEP', 'Frequentie', 'VCR', 'CTR', 'Average time on page', 'Post engagement rate'] },
    ],
  },
  {
    funnel: 'Consideration',
    objectives: [
      { name: 'Versterken merkassociaties/-waardes', kpis: ['Merk associaties/-waardes', 'Frequentie', 'VCR', 'Post engagement rate'] },
      { name: 'Vergroten merkoverweging', kpis: ['Merkoverweging', 'CTR', 'Average time on page', 'VCR', 'Post engagement rate'] },
      { name: 'Vergroten merkvoorkeur', kpis: ['Merkvoorkeur', 'Koopfrequentie'] },
      { name: 'Vergroten aankoopintentie', kpis: ['Aankoopintentie', 'Trial (new to product)', 'New to brand', 'New to category', 'CTR (click-through rate)', 'CVR (conversion rate)'] },
      { name: 'Aantrekken nieuwe klanten', kpis: ['Trial (new to product)', 'New to brand', 'New to category', 'Bereik (binnen audience)'] },
    ],
  },
  {
    funnel: 'Conversie',
    objectives: [
      { name: 'Sales genereren zonder Bonus promo', kpis: ['Sales lift (i)', 'Sales online (i)', 'Sales offline (i)', '(I)ROAS', 'Sales per customer (i)', 'Terug winnen klanten', 'CLV', 'Sales driver: existing customers (i)', 'Trial (new to product)', 'Share of Basket', 'New to brand', 'New to category'] },
      { name: 'Bonus promo ondersteunen', kpis: ['Sales lift (i)', 'Sales online (i)', 'Sales offline (i)', '(I)ROAS', 'Sales per customer (i)', 'Terug winnen klanten', 'Trial (new to product)'] },
    ],
  },
];

export const objectiveId = (funnel: string, name: string) => `${funnel}__${name}`;

export const findObjective = (id: string | null): { funnel: string; objective: ObjectiveDef } | null => {
  if (!id) return null;
  for (const f of objectiveKpiCatalog) {
    for (const o of f.objectives) {
      if (objectiveId(f.funnel, o.name) === id) return { funnel: f.funnel, objective: o };
    }
  }
  return null;
};

export interface ObjectiveKpiValue {
  /** Composite objective id (`${funnel}__${name}`), or null when unset. */
  objective: string | null;
  /** KPIs the user chose to track for that objective. */
  kpis: string[];
  /** Optional target value per tracked KPI (keyed by KPI name). */
  targets?: Record<string, string>;
}

/** Suggest a sensible target format/unit from the KPI name. */
const targetPlaceholder = (kpi: string): string => {
  const k = kpi.toLowerCase();
  if (k.includes('roas')) return 'e.g. 3.5×';
  if (k.includes('cpm')) return 'e.g. €4.50';
  if (k.includes('cpc')) return 'e.g. €0.45';
  if (/ctr|vcr|rate|lift|cvr|share/.test(k)) return 'e.g. 1.2%';
  if (/bereik|reach/.test(k)) return 'e.g. 5M';
  if (k.includes('frequentie') || k.includes('frequency')) return 'e.g. 3.0';
  if (k.includes('time on page')) return 'e.g. 0:45';
  return 'Set target';
};

export interface ObjectiveKpiSelectProps {
  value: ObjectiveKpiValue;
  onChange: (value: ObjectiveKpiValue) => void;
  className?: string;
  /** Hide the "Objective" / "KPIs" field labels (when a parent already labels them). */
  hideLabels?: boolean;
}

/**
 * Objective + KPI picker. The user selects one objective (grouped by funnel),
 * then ticks the KPIs the plan is judged on. Selecting an objective pre-selects
 * all of its KPIs; the user can trim them. Reused across campaign detail and the
 * campaign/media-plan setup stages.
 */
export const ObjectiveKpiSelect: React.FC<ObjectiveKpiSelectProps> = ({ value, onChange, className, hideLabels }) => {
  const selected = findObjective(value.objective);

  const options = objectiveKpiCatalog.flatMap((f) =>
    f.objectives.map((o) => ({ label: o.name, value: objectiveId(f.funnel, o.name), description: f.funnel })),
  );

  const onObjective = (vals: string[]) => {
    const id = vals.length ? vals[vals.length - 1] : null;
    const found = findObjective(id);
    // Pre-select every KPI of the chosen objective; the user can deselect.
    onChange({ objective: id, kpis: found ? [...found.objective.kpis] : [] });
  };

  const toggleKpi = (kpi: string) => {
    const isOn = value.kpis.includes(kpi);
    const next = isOn ? value.kpis.filter((k) => k !== kpi) : [...value.kpis, kpi];
    // Drop the target when a KPI is removed.
    const targets = { ...(value.targets ?? {}) };
    if (isOn) delete targets[kpi];
    onChange({ ...value, kpis: next, targets });
  };

  const setTarget = (kpi: string, target: string) => {
    onChange({ ...value, targets: { ...(value.targets ?? {}), [kpi]: target } });
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2">
        {!hideLabels && (
          <Label className="flex items-center gap-2">
            <Target size={16} />
            Objective
          </Label>
        )}
        <Filter
          name="Select objective"
          keepName
          options={options}
          selectedValues={value.objective ? [value.objective] : []}
          onChange={onObjective}
          className="w-full justify-between"
        />
      </div>

      {selected && (
        <div className="space-y-2">
          {!hideLabels && <Label className="text-sm text-muted-foreground">KPIs · {selected.funnel}</Label>}
          <p className="text-xs text-muted-foreground">
            {value.kpis.length} of {selected.objective.kpis.length} KPIs selected — these are what the plan is judged on.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selected.objective.kpis.map((kpi) => {
              const on = value.kpis.includes(kpi);
              return (
                <button
                  key={kpi}
                  type="button"
                  onClick={() => toggleKpi(kpi)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors',
                    on ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/40',
                  )}
                >
                  <span className={cn('flex h-3.5 w-3.5 items-center justify-center rounded-full border', on ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40')}>
                    {on && <Check className="h-2.5 w-2.5" />}
                  </span>
                  {kpi}
                </button>
              );
            })}
          </div>

          {value.kpis.length > 0 && (
            <div className="space-y-2 pt-1">
              {!hideLabels && <Label className="text-sm text-muted-foreground">Targets</Label>}
              <p className="text-xs text-muted-foreground">Set a target for the KPIs you want to focus on (optional).</p>
              <div className="space-y-1.5">
                {value.kpis.map((kpi) => (
                  <div key={kpi} className="flex items-center gap-3 rounded-md border bg-card px-3 py-1.5">
                    <span className="flex-1 truncate text-xs font-medium">{kpi}</span>
                    <Input
                      value={value.targets?.[kpi] ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(kpi, e.target.value)}
                      placeholder={targetPlaceholder(kpi)}
                      className="h-8 w-32 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
