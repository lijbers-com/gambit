import * as React from 'react';
import type { EngineId } from '@/lib/db';

/**
 * One pattern per proposition — the mark a proposition wears everywhere it is
 * drawn: a chart series, a legend swatch, a tile background on its own pages.
 *
 * Greys, not hues: the charts are quiet and the pattern carries identity, so
 * five stacked series still read apart without five colours, in print, and
 * for every kind of colour vision. The patterns are deliberately faint and
 * simple — a texture, not decoration — and diagonal, so they never read as
 * gridlines. Each proposition also sits on its own grey step, so a stack
 * separates even where a pattern is too small to see.
 */

export type PatternKind = 'diagonal' | 'diagonal-reverse' | 'dots' | 'crosshatch' | 'checker' | 'solid';

/** A series that stands for every proposition together — the total. */
export type PatternKey = EngineId | 'all';

export interface PropositionPattern {
  kind: PatternKind;
  /** The fill behind the pattern — a neutral step; lighter for the first series. */
  base: string;
  /** The ink the pattern is drawn in — one step darker than the base. */
  ink: string;
}

export const PROPOSITION_PATTERNS: Record<EngineId, PropositionPattern> = {
  // One near-white base for all: the pattern alone tells them apart, and a
  // thin ink line at each series edge keeps neighbours from blurring.
  'sponsored-products': { kind: 'dots',             base: 'rgb(var(--neutral-200))', ink: 'rgb(var(--neutral-600))' },
  display:              { kind: 'diagonal',         base: 'rgb(var(--neutral-200))', ink: 'rgb(var(--neutral-600))' },
  'digital-instore':    { kind: 'crosshatch',       base: 'rgb(var(--neutral-200))', ink: 'rgb(var(--neutral-600))' },
  'offline-instore':    { kind: 'checker',          base: 'rgb(var(--neutral-200))', ink: 'rgb(var(--neutral-600))' },
  offsite:              { kind: 'diagonal-reverse', base: 'rgb(var(--neutral-200))', ink: 'rgb(var(--neutral-600))' },
};

/** The id of the SVG pattern for a proposition — use as `url(#…)`. */
/** Solid grey is reserved for the whole: a series that adds every
 *  proposition together wears no pattern, so the eye reads "all" at once. */
export const ALL_PROPOSITIONS_PATTERN: PropositionPattern = { kind: 'solid', base: 'rgb(var(--neutral-300))', ink: 'rgb(var(--neutral-500))' };

/** A line cannot carry a fill pattern, so it carries a dash instead — one
 *  per proposition, in the same family as its fill. The total is solid. */
export const LINE_DASH: Record<PatternKey, string | undefined> = {
  'sponsored-products': '2 4',
  display: '8 4',
  'digital-instore': '8 3 2 3',
  'offline-instore': '4 4',
  offsite: '12 4 2 4',
  all: undefined,
};
export const lineDash = (key: PatternKey) => LINE_DASH[key];

export const patternFor = (key: PatternKey): PropositionPattern => (key === 'all' ? ALL_PROPOSITIONS_PATTERN : PROPOSITION_PATTERNS[key]);
export const patternId = (key: PatternKey) => `pp-${key}`;
export const patternFill = (key: PatternKey) => `url(#${patternId(key)})`;

/**
 * The SVG <defs> that every chart drawing propositions needs once. Rendered
 * inside the chart's own <svg> (Recharts lets a <defs> sit among its
 * children) or in a hidden <svg> at the top of a page for CSS use.
 */
export const PropositionPatternDefs: React.FC<{ engines?: PatternKey[]; opacity?: number }> = ({ engines, opacity = 1 }) => {
  const list: PatternKey[] = engines ?? [...(Object.keys(PROPOSITION_PATTERNS) as EngineId[]), 'all'];
  return (
    <defs>
      {list.map((engine) => {
        const p = patternFor(engine);
        const id = patternId(engine);
        const size = 10;
        return (
          <pattern key={id} id={id} patternUnits="userSpaceOnUse" width={size} height={size} style={{ opacity }}>
            <rect width={size} height={size} fill={p.base} />
            {p.kind === 'diagonal' && <path d={`M -2 ${size + 2} L ${size + 2} -2`} stroke={p.ink} strokeWidth={0.75} />}
            {p.kind === 'diagonal-reverse' && <path d={`M -2 -2 L ${size + 2} ${size + 2}`} stroke={p.ink} strokeWidth={0.75} />}
            {p.kind === 'crosshatch' && (
              <>
                <path d={`M -2 ${size + 2} L ${size + 2} -2`} stroke={p.ink} strokeWidth={0.6} />
                <path d={`M -2 -2 L ${size + 2} ${size + 2}`} stroke={p.ink} strokeWidth={0.6} />
              </>
            )}
            {p.kind === 'dots' && <circle cx={size / 2} cy={size / 2} r={1} fill={p.ink} />}
            {p.kind === 'checker' && (
              <>
                <rect x={0} y={0} width={size / 2} height={size / 2} fill={p.ink} opacity={0.45} />
                <rect x={size / 2} y={size / 2} width={size / 2} height={size / 2} fill={p.ink} opacity={0.45} />
              </>
            )}
          </pattern>
        );
      })}
    </defs>
  );
};

/** A small swatch of the proposition's pattern, for legends and chips. */
export const PropositionSwatch: React.FC<{ engine: PatternKey; className?: string; size?: number }> = ({ engine, className, size = 12 }) => {
  const p = patternFor(engine);
  const id = `sw-${engine}`;
  return (
    <svg width={size} height={size} className={className} aria-hidden style={{ borderRadius: 2, flexShrink: 0 }}>
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width={6} height={6}>
          <rect width={6} height={6} fill={p.base} />
          {p.kind === 'diagonal' && <path d="M -1.5 7.5 L 7.5 -1.5" stroke={p.ink} strokeWidth={0.75} />}
          {p.kind === 'diagonal-reverse' && <path d="M -1.5 -1.5 L 7.5 7.5" stroke={p.ink} strokeWidth={0.75} />}
          {p.kind === 'crosshatch' && (
            <>
              <path d="M -1.5 7.5 L 7.5 -1.5" stroke={p.ink} strokeWidth={0.7} />
              <path d="M -1.5 -1.5 L 7.5 7.5" stroke={p.ink} strokeWidth={0.7} />
            </>
          )}
          {p.kind === 'dots' && <circle cx={3} cy={3} r={0.9} fill={p.ink} />}
          {p.kind === 'checker' && (
            <>
              <rect x={0} y={0} width={3} height={3} fill={p.ink} opacity={0.45} />
              <rect x={3} y={3} width={3} height={3} fill={p.ink} opacity={0.45} />
            </>
          )}
        </pattern>
      </defs>
      <rect width={size} height={size} rx={2} fill={`url(#${id})`} stroke="hsl(var(--border))" strokeWidth={0.5} />
    </svg>
  );
};

/**
 * The same pattern as a CSS background, for a proposition's own pages — a
 * faint tile behind a header or card so the eye learns "this texture is
 * display" before reading a label. Kept very light: it is a cue, not a fill.
 */
export function patternBackground(engine: PatternKey, opts: { ink?: string; base?: string; size?: number } = {}): React.CSSProperties {
  const p = patternFor(engine);
  const size = opts.size ?? 10;
  const ink = opts.ink ?? 'rgb(var(--neutral-300))';
  const base = opts.base ?? 'transparent';
  switch (p.kind) {
    case 'diagonal':
      return { backgroundColor: base, backgroundImage: `repeating-linear-gradient(45deg, ${ink} 0 1px, transparent 1px ${size}px)` };
    case 'diagonal-reverse':
      return { backgroundColor: base, backgroundImage: `repeating-linear-gradient(135deg, ${ink} 0 1px, transparent 1px ${size}px)` };
    case 'crosshatch':
      return { backgroundColor: base, backgroundImage: `repeating-linear-gradient(45deg, ${ink} 0 1px, transparent 1px ${size}px), repeating-linear-gradient(135deg, ${ink} 0 1px, transparent 1px ${size}px)` };
    case 'dots':
      return { backgroundColor: base, backgroundImage: `radial-gradient(${ink} 1px, transparent 1.2px)`, backgroundSize: `${size}px ${size}px` };
    case 'checker':
      return { backgroundColor: base, backgroundImage: `linear-gradient(45deg, ${ink} 25%, transparent 25%, transparent 75%, ${ink} 75%), linear-gradient(45deg, ${ink} 25%, transparent 25%, transparent 75%, ${ink} 75%)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: `0 0, ${size / 2}px ${size / 2}px` };
    default:
      return { backgroundColor: base };
  }
}
