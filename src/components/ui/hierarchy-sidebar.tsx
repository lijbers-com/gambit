'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { entityIcon, type SummaryEntity } from './summary-card';

/**
 * The rule for every booking surface's summary column.
 *
 * A booking lives in a hierarchy, and its detail page and its create wizard
 * both show the whole chain in the sidebar, always in the same order: booking
 * and its creatives — the two live on the same level — then upward, one parent
 * at a time: campaign, then media plan. The active card is lifted to the top and
 * is the white one; on a wizard it is drawn as a step timeline instead of a
 * key/value list — the shape changes with the moment, the position and colour
 * do not.
 *
 * This component only enforces order; each slot is a finished card (so it can
 * keep its own state, link dialogs, actions). The caller styles the active
 * card white — usually it already does, because the active card also carries
 * the form's actions.
 *
 * Collapsed, the column shrinks to a rail of the cards' own icons, in the
 * same order, so the chain stays in view while the form takes the width;
 * any icon opens the column again.
 */

export const HIERARCHY_ORDER: SummaryEntity[] = ['booking', 'creative', 'campaign', 'media-plan'];

const ENTITY_LABEL: Record<SummaryEntity, string> = {
  'media-plan': 'Media plan',
  campaign: 'Campaign',
  booking: 'Booking',
  creative: 'Creatives',
};

export interface HierarchySidebarProps {
  /** Which entity is being worked on — its card is lifted to the top. */
  active: SummaryEntity;
  mediaPlan?: React.ReactNode;
  campaign?: React.ReactNode;
  booking?: React.ReactNode;
  creative?: React.ReactNode;
  /** Folded to the icon rail. */
  collapsed?: boolean;
  /** An icon on the rail was clicked: open the column (on that card). */
  onExpand?: (entity: SummaryEntity) => void;
  className?: string;
}

const SLOT_KEY: Record<SummaryEntity, keyof Omit<HierarchySidebarProps, 'active' | 'className' | 'collapsed' | 'onExpand'>> = {
  'media-plan': 'mediaPlan',
  campaign: 'campaign',
  booking: 'booking',
  creative: 'creative',
};

export const HierarchySidebar: React.FC<HierarchySidebarProps> = ({ active, className, collapsed, onExpand, ...slots }) => {
  const order = [active, ...HIERARCHY_ORDER.filter((e) => e !== active)];
  const present = order.filter((e) => !!slots[SLOT_KEY[e]]);
  if (collapsed) {
    return (
      <aside className={cn('flex w-9 flex-col gap-row', className)} aria-label="Summary">
        {present.map((entity) => {
          const Icon = entityIcon[entity];
          return (
            <button
              key={entity}
              type="button"
              title={ENTITY_LABEL[entity]}
              aria-label={`Show ${ENTITY_LABEL[entity].toLowerCase()} summary`}
              onClick={() => onExpand?.(entity)}
              // One square per card, drawn like the card it stands for: the
              // active one white, the others on the page background.
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors',
                entity === active ? 'bg-card text-foreground' : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </aside>
    );
  }
  return (
    <aside className={cn('space-y-row', className)}>
      {order.map((entity) => (
        <React.Fragment key={entity}>{slots[SLOT_KEY[entity]]}</React.Fragment>
      ))}
    </aside>
  );
};
