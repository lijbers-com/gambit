import type { CreativeApprovalStatus, CreativeStatus, PlanStatus } from './db/types';

/**
 * The one status vocabulary — the words every surface uses for where
 * something stands, so a status reads the same on a plan, a campaign, a
 * booking, a creative, a to-do and a workflow board.
 *
 * Agreed direction from the workflow discovery (Sept 2026, "Getting things
 * done, together"): one lifecycle for plan, campaign and booking —
 *
 *   draft → in review → approved → scheduled → live → completed
 *   side states: changes requested · paused · cancelled
 *
 * and one for creatives —
 *
 *   requested → submitted → in review → approved
 *   side states: changes requested · rejected
 *
 * The prototype's stored codes predate this (in-option, running); they map
 * onto the shared words here, in one place, so the labels can move without
 * touching every record. Inventory hold (option until <date> → booked) is a
 * separate dimension and never a lifecycle label.
 */

export type LifecycleStatus = 'draft' | 'in-review' | 'approved' | 'scheduled' | 'live' | 'completed' | 'changes-requested' | 'paused' | 'cancelled';

/** The main path, in order — what a stage bar walks along. */
export const LIFECYCLE_PATH: LifecycleStatus[] = ['draft', 'in-review', 'approved', 'scheduled', 'live', 'completed'];

export const LIFECYCLE_LABEL: Record<LifecycleStatus, string> = {
  draft: 'Draft',
  'in-review': 'In review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  live: 'Live',
  completed: 'Completed',
  'changes-requested': 'Changes requested',
  paused: 'Paused',
  cancelled: 'Cancelled',
};

/** One line per status, for glossaries, tooltips and the Help section. */
export const LIFECYCLE_MEANING: Record<LifecycleStatus, string> = {
  draft: 'Being set up; nothing reserved yet.',
  'in-review': 'Submitted; the retailer is reviewing. Inventory is held in option.',
  approved: 'Approved; inventory booked. Creatives and fulfilment still to come.',
  scheduled: 'Everything in place; waiting for the flight date.',
  live: 'Delivering.',
  completed: 'The flight has ended.',
  'changes-requested': 'Sent back with reasons; resubmit to continue.',
  paused: 'Temporarily stopped; can resume.',
  cancelled: 'Stopped for good.',
};

/** The prototype's stored plan/campaign/booking codes, read in the shared words. */
export const PLAN_STATUS_TO_LIFECYCLE: Record<PlanStatus, LifecycleStatus> = {
  draft: 'draft',
  'in-option': 'in-review',
  running: 'live',
  paused: 'paused',
  completed: 'completed',
};

/** The label to show for a stored plan/campaign/booking status. */
export const planStatusLabel = (status: PlanStatus): string => LIFECYCLE_LABEL[PLAN_STATUS_TO_LIFECYCLE[status]];

/** Badge tone per lifecycle status, shared by every status badge. */
export const LIFECYCLE_TONE: Record<LifecycleStatus, string> = {
  draft: 'border-border bg-neutral-50 text-neutral-600',
  'in-review': 'border-info-200 bg-info-50 text-info-700',
  approved: 'border-success-200 bg-success-50 text-success-700',
  scheduled: 'border-info-200 bg-info-50 text-info-700',
  live: 'border-success-200 bg-success-50 text-success-700',
  completed: 'border-border bg-neutral-100 text-neutral-700',
  'changes-requested': 'border-warning-200 bg-warning-50 text-warning-700',
  paused: 'border-warning-200 bg-warning-50 text-warning-700',
  cancelled: 'border-destructive-200 bg-destructive-50 text-destructive-700',
};

// ── Creatives ─────────────────────────────────────────────────────────

export const CREATIVE_STATUS_LABEL: Record<CreativeApprovalStatus, string> = {
  requested: 'Requested',
  draft: 'Draft',
  submitted: 'Submitted',
  'in-review': 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
};

/** A booking's creative readiness, in the same words as the creatives themselves. */
export const BOOKING_CREATIVE_LABEL: Record<CreativeStatus, string> = {
  missing: 'Requested',
  submitted: 'Submitted',
  approved: 'Approved',
};
