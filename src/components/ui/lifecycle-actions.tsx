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
  affectedCount,
  planScope,
  campaignScope,
  type LifecycleAction,
  type PlanStatus,
} from '@/lib/db';

/**
 * Run, pause and stop, at whichever level the user is looking at.
 *
 * A media plan's control acts on its campaigns and their bookings; a
 * campaign's on its bookings. That cascade is the point — pausing a plan while
 * its bookings kept delivering would make the status a lie — so the button
 * says how far it reaches before it does anything.
 *
 * Play/pause is one toggling button because they are the same decision seen
 * from two sides. Stop is separate and confirmed: it ends the flight, and
 * nothing here restarts a completed thing.
 */

export interface LifecycleActionsProps {
  level: 'media-plan' | 'campaign' | 'booking';
  entityId: string;
  status: PlanStatus;
  /** Name used in the confirmation, e.g. "Holiday Sale Plan". */
  name?: string;
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
  status,
  name,
  className,
}) => {
  const db = useDb();
  const [confirming, setConfirming] = React.useState<LifecycleAction | null>(null);

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
    if (level === 'media-plan') applyPlanLifecycle(entityId, action);
    else if (level === 'campaign') applyCampaignLifecycle(entityId, action);
    else applyBookingLifecycle(entityId, action);
    setConfirming(null);
  };

  const toggle = primaryAction(status);
  const canStop = canApply('stop', status);
  // Nothing is live and nothing is paused: the entity is a draft, in option or
  // finished, and none of these three verbs apply to it yet.
  if (!toggle && !canStop) return null;

  const counts = confirming ? affectedCount(confirming, status, scope) : null;
  const ToggleIcon = toggle ? ICON[toggle] : null;

  /** "3 campaigns and 6 bookings" — what the action reaches beneath this. */
  const reach = (c: number, b: number) =>
    [c > 0 && `${c} campaign${c === 1 ? '' : 's'}`, b > 0 && `${b} booking${b === 1 ? '' : 's'}`]
      .filter(Boolean)
      .join(' and ');

  return (
    <>
      <div className={className}>
        <div className="flex items-center gap-2">
          {toggle && ToggleIcon && (
            <Button
              variant="outline"
              // Resuming is safe and reversible, so it acts immediately.
              // Pausing stops delivery for everything underneath, so it asks.
              onClick={() => (toggle === 'play' ? apply('play') : setConfirming('pause'))}
              className="gap-1.5"
            >
              <ToggleIcon className="h-4 w-4" />
              {actionLabel[toggle]}
            </Button>
          )}
          {canStop && (
            <Button variant="outline" onClick={() => setConfirming('stop')} className="gap-1.5">
              <Square className="h-4 w-4" />
              Stop
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
                ? 'Stopping ends the flight. It cannot be resumed afterwards.'
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
