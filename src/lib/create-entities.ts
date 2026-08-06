'use client';

import { getDb, createBooking, type EngineId, type Campaign } from '@/lib/db';

/**
 * What every "+ Add …" button actually does.
 *
 * One place, because adding has to work from anywhere it is offered — an
 * overview, a campaign page, a booking page — and each of those was one
 * unwired button away from a demo that dead-ends. Campaigns and media plans
 * have wizards, so adding navigates there; a booking's form IS its detail
 * page, so adding creates a draft in place and opens it.
 */

/** The create wizards, one per proposition, plus the media plan wizard. */
export function openCampaignWizard(engine: EngineId) {
  if (typeof window !== 'undefined') window.location.href = `/create/${engine}`;
}

export function openMediaPlanWizard() {
  if (typeof window !== 'undefined') window.location.href = '/create/media-experience';
}

/**
 * Create a draft booking and open its detail form.
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
  if (!target) return;
  const booking = createBooking({
    campaignId: target.id,
    name: `${target.name} — New booking`,
    status: 'draft',
    budget: 0,
    spend: 0,
    startDate: target.startDate,
    endDate: target.endDate,
    positionIds: [],
    creativeStatus: 'missing',
  });
  if (typeof window === 'undefined') return;
  // Sponsored-products bookings live inside the campaign page.
  window.location.href =
    engine === 'sponsored-products'
      ? `/campaigns/sponsored-products/${target.id}`
      : `/campaigns/${engine}/booking/${booking.id}`;
}
