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

export type PatternKind = 'diagonal' | 'diagonal-reverse' | 'dots' | 'crosshatch' | 'solid';

export interface PropositionPattern {
  kind: PatternKind;
  /** The fill behind the pattern — a neutral step; lighter for the first series. */
  base: string;
  /** The ink the pattern is drawn in — one step darker than the base. */
  ink: string;
}

export const PROPOSITION_PATTERNS: Record<EngineId, PropositionPattern> = {
  'sponsored-products': { kind: 'dots',             base: 'rgb(var(--neutral-200))', ink: 'rgb(var(--neutral-400))' },
  display:              { kind: 'diagonal',         base: 'rgb(var(--neutral-300))', ink: 'rgb(var(--neutral-500))' },
  'digital-instore':    { kind: 'crosshatch',       base: 'rgb(var(--neutral-400))', ink: 'rgb(var(--neutral-600))' },
  'offline-instore':    { kind: 'solid',            base: 'rgb(var(--neutral-500))', ink: 'rgb(var(--neutral-600))' },
  offsite:              { kind: 'diagonal-reverse', base: 'rgb(var(--neutral-600))', ink: 'rgb(var(--neutral-800))' },
};

/** The id of the SVG pattern for a proposition — use as `url(#…)`. */
export const patternId = (engine: EngineId) => `pp-${engine}`;
export const patternFill = (engine: EngineId) => `url(#${patternId(engine)})`;

/**
 * The SVG <defs> that every chart drawing propositions needs once. Rendered
 * inside the chart's own <svg> (Recharts lets a <defs> sit among its
 * children) or in a hidden <svg> at the top of a page for CSS use.
 */
export const PropositionPatternDefs: React.FC<{ engines?: EngineId[]; opacity?: number }> = ({ engines, opacity = 1 }) => {
  const list = engines ?? (Object.keys(PROPOSITION_PATTERNS) as EngineId[]);
  return (
    <defs>
      {list.map((engine) => {
        const p = PROPOSITION_PATTERNS[engine];
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
          </pattern>
        );
      })}
    </defs>
  );
};

/** A small swatch of the proposition's pattern, for legends and chips. */
export const PropositionSwatch: React.FC<{ engine: EngineId; className?: string; size?: number }> = ({ engine, className, size = 12 }) => {
  const p = PROPOSITION_PATTERNS[engine];
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
export function patternBackground(engine: EngineId, opts: { ink?: string; base?: string; size?: number } = {}): React.CSSProperties {
  const p = PROPOSITION_PATTERNS[engine];
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
    default:
      return { backgroundColor: base };
  }
}
