'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LifecycleActions } from './lifecycle-actions';
import { WorkflowProgress } from './workflow-progress';
import { useDb, deriveMessages, type EngineId, type PlanStatus } from '@/lib/db';

/**
 * The control panel a campaign or booking page opens with: where it stands
 * in the proposition's workflow — each stage a chip that opens its steps —
 * and the run controls. One row, the stages left, the controls right.
 *
 * Budget, run time, health and notifications are not here on purpose: the
 * media plan carries them for its whole tree, and on a campaign or booking
 * they live on the details form. What steers the entity is its stage and
 * whether it runs.
 *
 * Reads the store by id; a demo page whose id is not in the store still
 * gets the panel, with the status it was given.
 */
export interface EntityControlBarProps {
  level: 'campaign' | 'booking';
  engine: EngineId;
  entityId: string;
  /** Fallbacks for a demo entity the store does not hold. */
  name?: string;
  status?: PlanStatus;
  className?: string;
}

export const EntityControlBar: React.FC<EntityControlBarProps> = ({ level, engine, entityId, name, status, className }) => {
  const db = useDb();
  const entity = level === 'campaign' ? db.campaigns.find((c) => c.id === entityId) : db.bookings.find((b) => b.id === entityId);
  // A blocking to-do keeps the launch button off, and says so on it.
  const blockers = deriveMessages(db, level === 'campaign' ? { campaignId: entityId } : { bookingId: entityId })
    .filter((m) => m.kind === 'action' && m.severity === 'blocking');

  return (
    <section className={cn('flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border bg-card px-4 py-3', className)}>
      <WorkflowProgress
        variant="bar"
        hideNext
        engine={engine}
        campaignId={level === 'campaign' ? entityId : undefined}
        bookingId={level === 'booking' ? entityId : undefined}
      />
      <div className="ml-auto flex items-center gap-2">
        <LifecycleActions
          level={level}
          entityId={entityId}
          status={entity?.status ?? status ?? 'running'}
          name={entity?.name ?? name ?? entityId}
          playDisabled={blockers.length > 0}
          playDisabledReason={`${blockers.length} blocker${blockers.length === 1 ? '' : 's'} to clear first — see Notifications`}
        />
      </div>
    </section>
  );
};
