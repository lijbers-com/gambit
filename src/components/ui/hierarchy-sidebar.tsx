'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { SummaryEntity } from './summary-card';

/**
 * The rule for every booking surface's summary column.
 *
 * A booking lives in a hierarchy — media plan → campaign → booking → creative —
 * and its detail page and its create wizard both show that whole chain in the
 * sidebar. The thing being worked on comes first and is the white card; the
 * rest follow in hierarchy order, muted. On a wizard the active card is the
 * same booking shown as a step timeline instead of a key/value list — the
 * shape changes with the moment, the position and colour do not.
 *
 * This component only enforces order; each slot is a finished card (so it can
 * keep its own state, link dialogs, actions). The caller styles the active
 * card white — usually it already does, because the active card also carries
 * the form's actions.
 */

export const HIERARCHY_ORDER: SummaryEntity[] = ['media-plan', 'campaign', 'booking', 'creative'];

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
