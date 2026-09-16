'use client';

import * as React from 'react';
import { ControlBar, ControlBarItem } from './control-bar';
import { BudgetPopover, DatesCell, HealthCell, NotificationsCell, type HealthLevel } from './control-cells';
import { LifecycleActions } from './lifecycle-actions';
import { WorkflowProgress } from './workflow-progress';
import { InboxPanel } from './inbox-panel';
import { RightDrawer, RightDrawerBody, RightDrawerContent, RightDrawerDescription, RightDrawerHeader, RightDrawerTitle } from './right-drawer';
import { useDb, updateBooking, updateCampaign, deriveMessages, type EngineId, type PlanStatus } from '@/lib/db';

/**
 * The control panel a campaign or booking page opens with — the same card
 * the media plan has: what it may spend and when it runs, how it is doing,
 * what is waiting, the run controls, and beneath them where it stands in
 * the proposition's workflow. Everything that steers the entity, in one
 * place above the numbers.
 *
 * Reads the store by id; a demo page whose id is not in the store still
 * gets the panel, with the facts it can't know left blank.
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
  const [inboxOpen, setInboxOpen] = React.useState(false);
  const campaign = level === 'campaign' ? db.campaigns.find((c) => c.id === entityId) : undefined;
  const booking = level === 'booking' ? db.bookings.find((b) => b.id === entityId) : undefined;
  const entity = campaign ?? booking;

  // A campaign's ceiling is claimed by its bookings; a booking's by its spend.
  const committed = campaign
    ? db.bookings.filter((b) => b.campaignId === campaign.id).reduce((s, b) => s + b.budget, 0)
    : booking?.spend ?? 0;

  const messages = deriveMessages(db, level === 'campaign' ? { campaignId: entityId } : { bookingId: entityId });
  const counts = {
    actions: messages.filter((m) => m.kind === 'action' || m.kind === 'health').length,
    recommendations: messages.filter((m) => m.kind === 'recommendation').length,
    insights: messages.filter((m) => m.kind === 'insight').length,
  };
  const blockers = messages.filter((m) => m.kind === 'action' && m.severity === 'blocking');
  // Health follows the open work, the same rule the plan applies one level up.
  const health: HealthLevel = blockers.length ? 'risk' : counts.actions ? 'attention' : 'good';

  const noun = level === 'campaign' ? 'Campaign' : 'Booking';
  const displayName = entity?.name ?? name ?? entityId;

  return (
    <>
      <ControlBar
        className={className}
        footer={<WorkflowProgress variant="bar" engine={engine} campaignId={campaign?.id} bookingId={level === 'booking' ? entityId : undefined} />}
      >
        <ControlBarItem label={`${noun} budget`}>
          {entity ? (
            <BudgetPopover
              className="w-40"
              total={entity.budget}
              committed={committed}
              committedLabel={campaign ? 'Committed to bookings' : 'Spent'}
              hint={campaign ? 'Booking budgets are set on the bookings themselves — free room stays open for adding more.' : undefined}
              onApply={(budget) => (campaign ? updateCampaign(campaign.id, { budget }) : booking && updateBooking(booking.id, { budget }))}
            />
          ) : (
            <div className="flex h-9 items-center text-sm text-muted-foreground">—</div>
          )}
        </ControlBarItem>
        <ControlBarItem label={`${noun} run time`} dropOrder={3}>
          <DatesCell
            className="h-9 w-64 text-sm font-normal"
            start={entity?.startDate}
            end={entity?.endDate}
            onSave={(startDate, endDate) => (campaign ? updateCampaign(campaign.id, { startDate, endDate }) : booking && updateBooking(booking.id, { startDate, endDate }))}
          />
        </ControlBarItem>
        <ControlBarItem label="Health" dropOrder={2}>
          <div className="flex h-9 items-center">
            <button type="button" onClick={() => setInboxOpen(true)} title="Open notifications">
              <HealthCell health={health} />
            </button>
          </div>
        </ControlBarItem>
        <ControlBarItem label="Notifications" dropOrder={1}>
          <div className="flex h-9 items-center">
            <NotificationsCell {...counts} onOpen={() => setInboxOpen(true)} />
          </div>
        </ControlBarItem>
        {/* Launch, pause, resume, stop — with the facts that govern them. */}
        <div className="ml-auto flex items-center gap-2">
          <LifecycleActions
            level={level}
            entityId={entityId}
            status={entity?.status ?? status ?? 'running'}
            name={displayName}
            playDisabled={blockers.length > 0}
            playDisabledReason={`${blockers.length} blocker${blockers.length === 1 ? '' : 's'} to clear first — see Notifications`}
          />
        </div>
      </ControlBar>

      <RightDrawer open={inboxOpen} onOpenChange={setInboxOpen}>
        <RightDrawerContent>
          <RightDrawerHeader>
            <RightDrawerTitle>Notifications</RightDrawerTitle>
            <RightDrawerDescription>{displayName}</RightDrawerDescription>
          </RightDrawerHeader>
          <RightDrawerBody>
            {inboxOpen && <InboxPanel scope={level} entityId={entityId} detailInline />}
          </RightDrawerBody>
        </RightDrawerContent>
      </RightDrawer>
    </>
  );
};
