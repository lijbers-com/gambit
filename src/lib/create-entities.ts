'use client';

import { getDb, type EngineId, type Campaign } from '@/lib/db';

/**
 * What every "+ Add …" button actually does.
 *
 * One place, because adding has to work from anywhere it is offered — an
 * overview, a campaign page, a booking page — and each of those was one
 * unwired button away from a demo that dead-ends.
 *
 * Everything is created through a wizard. A campaign's wizard runs its
 * campaign steps and then continues into the booking and creative steps; a
 * booking's wizard is that same flow entered at the booking step, against an
 * existing campaign. The detail pages are the RESULT of a wizard, never the
 * place where an empty draft is dumped for the user to puzzle out.
 */

/** The campaign wizard for a proposition. Pass `planId` to create the
 *  campaign inside a media plan; without it the campaign stands alone. */
export function openCampaignWizard(engine: EngineId, planId?: string) {
  if (typeof window === 'undefined') return;
  window.location.href = `/create/${engine}${planId ? `?planId=${planId}` : ''}`;
}

export function openMediaPlanWizard() {
  if (typeof window !== 'undefined') window.location.href = '/create/media-experience';
}

/**
 * Open the booking wizard: the campaign wizard entered at its booking step,
 * for an existing campaign — booking form first, then the creative step
 * (sponsored products has no creatives, so its flow ends at placements).
 *
 * A booking needs a campaign to live under. Given one, use it; otherwise fall
 * back to the engine's first not-yet-finished campaign so the button still
 * works from pages that only know the proposition.
 */
export function addBooking(engine: EngineId, campaign?: Campaign | string) {
  const db = getDb();
  const chosen = typeof campaign === 'string' ? db.campaigns.find((c) => c.id === campaign) : campaign;
  const target =
    chosen ??
    db.campaigns.find((c) => c.engine === engine && c.status !== 'completed') ??
    db.campaigns.find((c) => c.engine === engine);
  if (typeof window === 'undefined') return;
  // No campaign to book under → the campaign wizard, which ends in a booking.
  if (!target) {
    openCampaignWizard(engine);
    return;
  }
  window.location.href = `/create/${engine}?campaignId=${target.id}`;
}
