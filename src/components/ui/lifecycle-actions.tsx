'use client';

import * as React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import {
  useDb,
  applyPlanLifecycle,
  applyCampaignLifecycle,
  applyBookingLifecycle,
  canApply,
  primaryAction,
  actionLabel,
  playLabel,
  affectedCount,
  nextStatus,
  planScope,
  campaignScope,
  type LifecycleAction,
  type PlanStatus,
} from '@/lib/db';
import { TAB_ACTION_LABEL } from './tab-actions';

/**
 * Run, pause and stop, at whichever level the user is looking at.
 *
 * A media plan's control acts on its campaigns and their bookings; a
 * campaign's on its bookings. That cascade is the point — pausing a plan while
 * its bookings kept delivering would make the status a lie — so the button
 * says how far it reaches before it does anything.
 *
 * Play/pause is one toggling button because they are the same decision seen
 * from two sides. Stop is separate and confirmed: it ends the flight. Play on
 * a completed thing restarts it, so the control never disappears mid-demo.
 */

export interface LifecycleActionsProps {
  level: 'media-plan' | 'campaign' | 'booking';
  entityId: string;
  status: PlanStatus;
  /** Name used in the confirmation, e.g. "Holiday Sale Plan". */
  name?: string;
  /** Block launching and say why — a plan with unresolved blockers cannot go
   *  live, and the reason belongs on the control rather than in a toast after
   *  the click. */
  playDisabled?: boolean;
  playDisabledReason?: string;
  className?: string;
}

const ICON: Record<LifecycleAction, React.ComponentType<{ className?: string }>> = {
  play: Play,
  pause: Pause,
  stop: Square,
};

export const LifecycleActions: React.FC<LifecycleActionsProps> = ({
  level,
  entityId,
  status: statusProp,
  name,
  playDisabled,
  playDisabledReason,
  className,
}) => {
  const db = useDb();
  const [confirming, setConfirming] = React.useState<LifecycleAction | null>(null);
  // Some detail pages show demo data that is not in the store. The control
  // still has to work there — a demo dead-ends otherwise — so when the id
  // finds nothing, the status lives here instead.
  const [localStatus, setLocalStatus] = React.useState<PlanStatus | null>(null);

  const dbEntity =
    level === 'media-plan'
      ? db.mediaPlans.find((p) => p.id === entityId)
      : level === 'campaign'
        ? db.campaigns.find((c) => c.id === entityId)
        : db.bookings.find((b) => b.id === entityId);
  const status = dbEntity?.status ?? localStatus ?? statusProp;

  const scope = React.useMemo(() => {
    if (level === 'media-plan') {
      const plan = db.mediaPlans.find((p) => p.id === entityId);
      return plan ? planScope(db, plan) : { campaigns: [], bookings: [] };
    }
    if (level === 'campaign') {
      const campaign = db.campaigns.find((c) => c.id === entityId);
      return campaign ? campaignScope(db, campaign) : { campaigns: [], bookings: [] };
    }
    return { campaigns: [], bookings: [] };
  }, [db, level, entityId]);

  const apply = (action: LifecycleAction) => {
    if (!dbEntity) setLocalStatus(nextStatus(action, status) ?? status);
    else if (level === 'media-plan') applyPlanLifecycle(entityId, action);
    else if (level === 'campaign') applyCampaignLifecycle(entityId, action);
    else applyBookingLifecycle(entityId, action);
    setConfirming(null);
  };

  const toggle = primaryAction(status);
  const canStop = canApply('stop', status);

  const counts = confirming ? affectedCount(confirming, status, scope) : null;
  const ToggleIcon = ICON[toggle];

  /** "3 campaigns and 6 bookings" — what the action reaches beneath this. */
  const reach = (c: number, b: number) =>
    [c > 0 && `${c} campaign${c === 1 ? '' : 's'}`, b > 0 && `${b} booking${b === 1 ? '' : 's'}`]
      .filter(Boolean)
      .join(' and ');

  return (
    <>
      <div className={className}>
        <div className="flex items-center gap-2">
          <Button
            variant={toggle === 'play' && status !== 'paused' ? 'default' : 'outline'}
            // Starting is safe and reversible, so it acts immediately.
            // Pausing stops delivery for everything underneath, so it asks.
            onClick={() => (toggle === 'play' ? apply('play') : setConfirming('pause'))}
            disabled={toggle === 'play' && playDisabled}
            title={toggle === 'play' && playDisabled ? playDisabledReason : (toggle === 'play' ? playLabel(status) : actionLabel[toggle])}
            className="gap-1.5"
          >
            <ToggleIcon className="h-4 w-4" />
            <span className={TAB_ACTION_LABEL}>
              {toggle === 'play' ? playLabel(status) : actionLabel[toggle]}
            </span>
          </Button>
          {canStop && (
            <Button variant="outline" onClick={() => setConfirming('stop')} title="Stop" className="gap-1.5">
              <Square className="h-4 w-4" />
              <span className={TAB_ACTION_LABEL}>Stop</span>
            </Button>
          )}
        </div>
      </div>

      <Dialog open={confirming !== null} onOpenChange={(open) => !open && setConfirming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirming === 'stop' ? 'Stop' : 'Pause'} {name ?? 'this item'}?
            </DialogTitle>
            <DialogDescription>
              {confirming === 'stop'
                ? 'Stopping ends the flight and marks it completed. You can restart it later.'
                : 'Delivery stops until you resume. Nothing is lost — bookings and creatives stay as they are.'}
              {counts && counts.total > 1 && (
                <>
                  {' '}
                  This also {confirming === 'stop' ? 'stops' : 'pauses'}{' '}
                  {reach(counts.campaigns, counts.bookings)} underneath it.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(null)}>
              Cancel
            </Button>
            <Button
              variant={confirming === 'stop' ? 'destructive' : 'default'}
              onClick={() => confirming && apply(confirming)}
            >
              {confirming === 'stop' ? 'Stop' : 'Pause'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
