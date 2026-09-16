'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LifecycleActions } from './lifecycle-actions';
import { WorkflowProgress } from './workflow-progress';
import { Button } from './button';
import { useDb, deriveMessages, setupStepDone, setupStepDoneForBooking, type EngineId, type PlanStatus, type WorkflowStep } from '@/lib/db';

/** Where each proposition's wizard lives. */
const ROUTE_SEG: Record<EngineId, string> = {
      'display': 'display',
      'sponsored-products': 'sponsored-products',
      'digital-instore': 'digital-instore',
      'offline-instore': 'offline-instore',
      'offsite': 'offsite',
    };

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

  /**
   * At the end of an open setup step: a Start that opens the wizard where
   * that work is done — the same doors the plan's panel and setup cards open.
   */
  const stepExtra = (step: WorkflowStep, done: boolean): React.ReactNode => {
    if (done || !step.setup || !entity) return null;
    const key = step.setup;
    const seg = ROUTE_SEG[engine as EngineId] ?? engine;
    const back = typeof window !== 'undefined' ? `&returnTo=${encodeURIComponent(window.location.pathname)}` : '';
    const go = (href: string) => { if (typeof window !== 'undefined') window.location.href = href; };
    if (level === 'booking') {
      const b = db.bookings.find((x) => x.id === entityId);
      if (!b || setupStepDoneForBooking(db, b, key)) return null;
      const href = key === 'link-creatives' ? `/create/${seg}?bookingId=${b.id}&step=creatives${back}` : `/create/${seg}?bookingId=${b.id}${back}`;
      return <Button size="sm" onClick={() => go(href)}>Start</Button>;
    }
    const c = db.campaigns.find((x) => x.id === entityId);
    if (!c || setupStepDone(db, c, key)) return null;
    const bookings = db.bookings.filter((x) => x.campaignId === c.id);
    const draft = bookings.find((x) => x.status === 'draft');
    const missing = bookings.find((x) => x.creativeStatus === 'missing');
    const waiting = key === 'approve-bookings' ? bookings.filter((x) => x.status === 'draft').length : key === 'link-creatives' ? bookings.filter((x) => x.creativeStatus === 'missing').length : 0;
    const href =
      key === 'approve-campaign' || key === 'approve-campaigns' ? `/create/${seg}?campaignId=${c.id}&step=campaign${back}`
      : key === 'approve-bookings' ? `/create/${seg}?bookingId=${draft?.id ?? bookings[0]?.id}${back}`
      : key === 'link-creatives' ? (missing ? `/create/${seg}?bookingId=${missing.id}&step=creatives${back}` : `/create/${seg}?campaignId=${c.id}${back}`)
      : `/create/${seg}?campaignId=${c.id}${back}`;
    return (
      <span className="flex shrink-0 items-center gap-3">
        {waiting > 0 && <span className="text-xs text-muted-foreground">{waiting} of {bookings.length} booking{bookings.length === 1 ? '' : 's'}</span>}
        <Button size="sm" onClick={() => go(href)}>Start</Button>
      </span>
    );
  };

  return (
    <section className={cn('rounded-xl border border-border bg-card px-4 py-3', className)}>
      <WorkflowProgress
        className="w-full"
        variant="bar"
        hideNext
        engine={engine}
        campaignId={level === 'campaign' ? entityId : undefined}
        bookingId={level === 'booking' ? entityId : undefined}
        renderStepExtra={stepExtra}
        trailing={(
          <LifecycleActions
            level={level}
            entityId={entityId}
            status={entity?.status ?? status ?? 'running'}
            name={entity?.name ?? name ?? entityId}
            playDisabled={blockers.length > 0}
            playDisabledReason={`${blockers.length} blocker${blockers.length === 1 ? '' : 's'} to clear first — see Notifications`}
          />
        )}
      />
    </section>
  );
};
