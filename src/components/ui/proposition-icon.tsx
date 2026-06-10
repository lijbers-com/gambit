import * as React from 'react';
import {
  ListStart,
  MonitorSpeaker,
  MonitorPlay,
  Store,
  Globe,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Per-proposition icon used in page titles, summary cards, and anywhere
 * else we need a quick visual signal for which advertising engine a
 * record belongs to. Icons match the ones used in the "Create" sub-menu
 * of the side navigation so the metaphor is consistent across the app.
 *
 *   - Sponsored products → ListStart
 *   - Display            → MonitorSpeaker
 *   - Digital in-store   → MonitorPlay
 *   - Offline in-store   → Store
 *   - Offsite display    → Globe
 *   - All / unknown      → LayoutGrid (neutral fallback)
 */

const ICON_MAP: Record<string, LucideIcon> = {
  'sponsored-products': ListStart,
  display: MonitorSpeaker,
  'digital-instore': MonitorPlay,
  'offline-instore': Store,
  offsite: Globe,
  'offsite-display': Globe,
  all: LayoutGrid,
};

// Normalise common variants of the engine type string. Same logic as
// the metric / story helpers — keep them aligned so any spelling works.
const normalize = (engineType: string): string => {
  return engineType
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/in[-\s]?store/g, 'instore');
};

export const getPropositionIcon = (engineType: string): LucideIcon => {
  const key = normalize(engineType);
  return ICON_MAP[key] ?? ICON_MAP.all;
};

export interface PropositionIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  engineType: string;
  /** Optional. Defaults to h-6 w-6 (24px) — sized to sit comfortably
   * next to a text-3xl page title without dominating it. Override via
   * className for smaller or larger contexts. */
  className?: string;
}

export const PropositionIcon: React.FC<PropositionIconProps> = ({
  engineType,
  className,
  ...rest
}) => {
  const Icon = getPropositionIcon(engineType);
  return <Icon className={cn('h-6 w-6 text-muted-foreground shrink-0', className)} {...rest} />;
};
