import * as React from 'react';
import {
  ListStart,
  MonitorSpeaker,
  MonitorPlay,
  Store,
  Globe,
  LayoutGrid,
  WalletCards,
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
 *   - Media plans        → WalletCards (same icon used in the nav)
 *   - All / unknown      → LayoutGrid (neutral fallback)
 */

const ICON_MAP: Record<string, LucideIcon> = {
  'sponsored-products': ListStart,
  display: MonitorSpeaker,
  'digital-instore': MonitorPlay,
  'offline-instore': Store,
  offsite: Globe,
  'offsite-display': Globe,
  'media-plans': WalletCards,
  'media-plan': WalletCards,
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

export interface PropositionIconProps {
  engineType: string;
  /** Optional. Override the badge wrapper class (size/colors).
   *  Default: a 32×32 dark-on-light rounded badge styled to match the
   *  per-engine row icons on the campaign-summary card. */
  className?: string;
}

/**
 * Renders the proposition icon inside a dark rounded badge — same
 * treatment as the per-engine rows on the Media-plans `CampaignSummary`
 * card. Use as the PageHeader `titleIcon` so each proposition has a
 * consistent, prominent visual anchor next to its page title.
 */
export const PropositionIcon: React.FC<PropositionIconProps> = ({
  engineType,
  className,
}) => {
  const Icon = getPropositionIcon(engineType);
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex items-center justify-center shrink-0 rounded-md bg-primary text-primary-foreground h-8 w-8',
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
};
