import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { SearchSelectList } from './search-select-list';
import { Input } from './input';

/**
 * Funnel → Objective → KPI catalog. Picking an objective surfaces
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
      { name: 'Grow brand awareness', kpis: ['Top-of-mind brand awareness', 'Unaided brand awareness', 'Aided brand awareness', 'Ad recall', 'Unique reach', 'Frequency', 'Video completion rate', 'CPM'] },
      { name: 'Grow product awareness', kpis: ['Top-of-mind product awareness', 'Unaided product awareness', 'Aided product awareness', 'Ad recall', 'Unique reach', 'Frequency', 'Video completion rate', 'CPM'] },
      { name: 'Strengthen brand associations', kpis: ['Brand associations & values', 'Category entry points', 'Frequency', 'Video completion rate', 'Click-through rate', 'Average time on page', 'Post engagement rate'] },
    ],
  },
  {
    funnel: 'Consideration',
    objectives: [
      { name: 'Strengthen brand associations', kpis: ['Brand associations & values', 'Frequency', 'Video completion rate', 'Post engagement rate'] },
      { name: 'Grow brand consideration', kpis: ['Brand consideration', 'Click-through rate', 'Average time on page', 'Video completion rate', 'Post engagement rate'] },
      { name: 'Grow brand preference', kpis: ['Brand preference', 'Purchase frequency'] },
      { name: 'Grow purchase intent', kpis: ['Purchase intent', 'Trial (new to product)', 'New to brand', 'New to category', 'Click-through rate', 'Conversion rate'] },
      { name: 'Attract new customers', kpis: ['Trial (new to product)', 'New to brand', 'New to category', 'Reach (within audience)'] },
    ],
  },
  {
    funnel: 'Conversion',
    objectives: [
      { name: 'Generate sales without promotion', kpis: ['Sales lift', 'Sales online', 'Sales offline', 'Incremental ROAS', 'Sales per customer', 'Win-back customers', 'CLV', 'Sales driver: existing customers', 'Trial (new to product)', 'Share of basket', 'New to brand', 'New to category'] },
      { name: 'Support a promotion', kpis: ['Sales lift', 'Sales online', 'Sales offline', 'Incremental ROAS', 'Sales per customer', 'Win-back customers', 'Trial (new to product)'] },
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
  if (k.includes('reach')) return 'e.g. 5M';
  if (k.includes('frequency')) return 'e.g. 3.0';
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
        {!hideLabels && <Label>Objective</Label>}
        <SearchSelectList
          label={null}
          placeholder="Search objectives…"
          options={options}
          value={value.objective ? [value.objective] : []}
          onChange={onObjective}
          multiple={false}
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
