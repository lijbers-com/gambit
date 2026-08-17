'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { SummaryEntity } from './summary-card';

/**
 * The rule for every booking surface's summary column.
 *
 * A booking lives in a hierarchy, and its detail page and its create wizard
 * both show the whole chain in the sidebar, always in the same order: booking,
 * then campaign, then media plan — the thing itself first, then upward, one
 * parent at a time. Creatives trail the chain: they are what hangs off the
 * booking, not something above it. The active card is lifted to the top and
 * is the white one; on a wizard it is drawn as a step timeline instead of a
 * key/value list — the shape changes with the moment, the position and colour
 * do not.
 *
 * This component only enforces order; each slot is a finished card (so it can
 * keep its own state, link dialogs, actions). The caller styles the active
 * card white — usually it already does, because the active card also carries
 * the form's actions.
 */

export const HIERARCHY_ORDER: SummaryEntity[] = ['booking', 'campaign', 'media-plan', 'creative'];

export interface HierarchySidebarProps {
  /** Which entity is being worked on — its card is lifted to the top. */
  active: SummaryEntity;
  mediaPlan?: React.ReactNode;
  campaign?: React.ReactNode;
  booking?: React.ReactNode;
  creative?: React.ReactNode;
  className?: string;
}

const SLOT_KEY: Record<SummaryEntity, keyof Omit<HierarchySidebarProps, 'active' | 'className'>> = {
  'media-plan': 'mediaPlan',
  campaign: 'campaign',
  booking: 'booking',
  creative: 'creative',
};

export const HierarchySidebar: React.FC<HierarchySidebarProps> = ({ active, className, ...slots }) => {
  const order = [active, ...HIERARCHY_ORDER.filter((e) => e !== active)];
  return (
    <aside className={cn('space-y-4', className)}>
      {order.map((entity) => (
        <React.Fragment key={entity}>{slots[SLOT_KEY[entity]]}</React.Fragment>
      ))}
    </aside>
  );
};
