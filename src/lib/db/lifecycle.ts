import type { DbData, MediaPlan, Campaign, Booking, PlanStatus } from './types';

/**
 * Running, pausing and stopping — the three things a user does to something
 * that is already booked.
 *
 * The rules live here rather than in the buttons, because the same action has
 * to mean the same thing at all three levels: pausing a media plan is exactly
 * pausing each of its campaigns, which is exactly pausing each of their
 * bookings. A control that only changed the parent would leave children
 * delivering while the plan claimed to be paused.
 */

export type LifecycleAction = 'play' | 'pause' | 'stop';

/** What each action moves an entity to. Stop is terminal. */
const TARGET: Record<LifecycleAction, PlanStatus> = {
  play: 'running',
  pause: 'paused',
  stop: 'completed',
};

/**
 * Whether an action makes sense for something in this state.
 *
 * Play covers launching, resuming and restarting — from the user's side they
 * are one gesture, "make this run", and having separate buttons meant the
 * control moved around depending on a state they had to infer. Pause and stop
 * only apply to something actually delivering. Completed is restartable too:
 * the control is always there, so every plan, campaign and booking can be
 * driven from the same place.
 */
export function canApply(action: LifecycleAction, status: PlanStatus): boolean {
  if (action === 'play') return status !== 'running';
  return status === 'running';
}

/** The action a control should offer for this state. */
export function primaryAction(status: PlanStatus): LifecycleAction {
  return status === 'running' ? 'pause' : 'play';
}

/** Play reads as Launch, Resume or Restart depending on where it starts from. */
export const playLabel = (status: PlanStatus): string =>
  status === 'paused' ? 'Resume' : status === 'completed' ? 'Restart' : 'Launch';

export const actionLabel: Record<LifecycleAction, string> = {
  play: 'Launch',
  pause: 'Pause',
  stop: 'Stop',
};

/**
 * What an action would change, without changing it.
 *
 * Used to tell the user what they are about to do ("Pause 3 campaigns and 6
 * bookings") and to leave the control disabled when the answer is nothing.
 */
export interface LifecycleScope {
  campaigns: Campaign[];
  bookings: Booking[];
}

export function planScope(db: DbData, plan: MediaPlan): LifecycleScope {
  const campaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
  const ids = new Set(campaigns.map((c) => c.id));
  return { campaigns, bookings: db.bookings.filter((b) => ids.has(b.campaignId)) };
}

/**
 * A campaign's scope is its bookings only. The campaign is the thing being
 * acted on, not something underneath it — counting it as a child made the
 * confirmation read "this also pauses 1 campaign … underneath it" about the
 * campaign the user had just clicked.
 */
export function campaignScope(db: DbData, campaign: Campaign): LifecycleScope {
  return { campaigns: [], bookings: db.bookings.filter((b) => b.campaignId === campaign.id) };
}

/** How many entities an action would actually move, parent included. */
export function affectedCount(
  action: LifecycleAction,
  parentStatus: PlanStatus,
  scope: LifecycleScope,
): { campaigns: number; bookings: number; total: number } {
  const campaigns = scope.campaigns.filter((c) => canApply(action, c.status)).length;
  const bookings = scope.bookings.filter((b) => canApply(action, b.status)).length;
  const parent = canApply(action, parentStatus) ? 1 : 0;
  return { campaigns, bookings, total: parent + campaigns + bookings };
}

/** The status an entity should end up in, or undefined to leave it alone. */
export function nextStatus(action: LifecycleAction, status: PlanStatus): PlanStatus | undefined {
  return canApply(action, status) ? TARGET[action] : undefined;
}
