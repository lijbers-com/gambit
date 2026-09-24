import type { Booking, Campaign, DbData, MediaPlan } from './types';
import { keywordWeek } from '../recommendations';

/**
 * Health — concern-only.
 *
 * Health reports concerns. It never says something is fine: checks are added
 * over time, so "nothing found" means "nothing found by the checks that
 * exist today", which is not the same as healthy. There is therefore no
 * HEALTHY value — when there is nothing to report the health is ABSENT, and
 * the UI must not paint that as a green state.
 *
 *   Indicator   one detected concern (UNDERPACING…), with its own severity
 *   Subject     the booking, campaign order or media plan it was detected on
 *   Severity    NEEDS_ATTENTION or AT_RISK — one scale, used for an indicator
 *               and for a subject's status
 *   Status      a subject's severity: the highest found on it or below it
 *   Check       a configurable family of detections (budget pacing, delivery,
 *               objective performance, visibility, budget allocation), each
 *               with its own thresholds and severities
 *
 * Every level works the same way: it can carry its own indicators, and it
 * resolves to one status covering itself and everything below it. Indicators
 * travel upward, each naming its subject, so a plan's status opens to the
 * full list of findings without drilling down. Nothing is stored — health is
 * evaluated on read, against the thresholds configured now.
 */

export type HealthSeverity = 'NEEDS_ATTENTION' | 'AT_RISK';

export type HealthIndicatorCode =
  | 'SEVERELY_UNDERPACING' | 'UNDERPACING' | 'OVERPACING' | 'SEVERELY_OVERPACING'
  | 'NOT_DELIVERING' | 'DELIVERY_STOPPED' | 'DAILY_CAP_LIMITING_DELIVERY'
  | 'SEVERELY_BELOW_KPI_TARGET' | 'BELOW_KPI_TARGET'
  | 'LOW_WIN_RATE' | 'LOW_SHARE_OF_VOICE'
  | 'BUDGET_NOT_FULLY_ALLOCATED' | 'NO_LIVE_BOOKINGS';

export type HealthSubjectLevel = 'MEDIA_PLAN' | 'CAMPAIGN_ORDER' | 'BOOKING';
export type HealthMetricUnit = 'RATIO' | 'PERCENTAGE' | 'CURRENCY' | 'DAYS' | 'COUNT';

/** What an indicator was detected on. A plan indicator carries only the
 *  plan; a booking indicator carries plan, campaign order and booking. */
export interface HealthIndicatorSubject {
  level: HealthSubjectLevel;
  mediaPlanId: string;
  mediaPlanName: string;
  campaignOrderId?: string;
  campaignOrderName?: string;
  bookingId?: string;
  bookingName?: string;
}

/** One detected concern, with what it measured and what it was compared to. */
export interface HealthIndicator {
  code: HealthIndicatorCode;
  severity: HealthSeverity;
  subject: HealthIndicatorSubject;
  observedValue?: number;
  thresholdValue?: number;
  unit?: HealthMetricUnit;
  detectedAt: string;
}

/** Rolled-up health: the same shape at booking, campaign order and plan
 *  level; only the breadth of the list changes. Absent when nothing found. */
export interface HealthSummary {
  status: HealthSeverity;
  indicators: HealthIndicator[];
  evaluatedAt: string;
}

// ── The catalogue ───────────────────────────────────────────────────────

export type HealthCheckKey = 'budget-pacing' | 'delivery' | 'objective-performance' | 'visibility' | 'budget-allocation';

/** What each code means, for the UI. */
export const INDICATOR_CATALOGUE: Record<HealthIndicatorCode, { check: HealthCheckKey; title: string; meaning: string; levels: HealthSubjectLevel[] }> = {
  SEVERELY_UNDERPACING:        { check: 'budget-pacing', title: 'Severely underpacing', meaning: 'Spending far below the rate needed to deliver in full — a significant part of the budget will go unspent.', levels: ['BOOKING'] },
  UNDERPACING:                 { check: 'budget-pacing', title: 'Underpacing',          meaning: 'Spending below the rate needed to deliver in full.', levels: ['BOOKING'] },
  OVERPACING:                  { check: 'budget-pacing', title: 'Overpacing',           meaning: 'Spending faster than planned.', levels: ['BOOKING'] },
  SEVERELY_OVERPACING:         { check: 'budget-pacing', title: 'Severely overpacing',  meaning: 'Spending far too fast — the budget will be exhausted before the flight ends.', levels: ['BOOKING'] },
  NOT_DELIVERING:              { check: 'delivery', title: 'Not delivering',            meaning: 'Live but has never spent.', levels: ['BOOKING'] },
  DELIVERY_STOPPED:            { check: 'delivery', title: 'Delivery stopped',          meaning: 'Was spending, has now stopped while budget and flight remain.', levels: ['BOOKING'] },
  DAILY_CAP_LIMITING_DELIVERY: { check: 'delivery', title: 'Daily cap limiting delivery', meaning: 'Consistently spending up to its daily cap while underpacing — the cap is throttling delivery.', levels: ['BOOKING'] },
  SEVERELY_BELOW_KPI_TARGET:   { check: 'objective-performance', title: 'Severely below KPI target', meaning: 'KPI far worse than target.', levels: ['BOOKING', 'CAMPAIGN_ORDER'] },
  BELOW_KPI_TARGET:            { check: 'objective-performance', title: 'Below KPI target',          meaning: 'KPI worse than target.', levels: ['BOOKING', 'CAMPAIGN_ORDER'] },
  LOW_WIN_RATE:                { check: 'visibility', title: 'Low win rate',            meaning: 'Losing a high share of the auctions it enters.', levels: ['BOOKING'] },
  LOW_SHARE_OF_VOICE:          { check: 'visibility', title: 'Low share of voice',      meaning: 'Low visibility relative to the addressable inventory.', levels: ['BOOKING'] },
  BUDGET_NOT_FULLY_ALLOCATED:  { check: 'budget-allocation', title: 'Budget not fully allocated', meaning: 'A meaningful share of the budget has not been passed down — it cannot be spent where it sits.', levels: ['MEDIA_PLAN', 'CAMPAIGN_ORDER'] },
  NO_LIVE_BOOKINGS:            { check: 'budget-allocation', title: 'No live bookings',  meaning: 'The campaign order is live but has no bookings under it, so nothing can deliver against its budget.', levels: ['CAMPAIGN_ORDER'] },
};

export const CHECK_LABEL: Record<HealthCheckKey, string> = { 'budget-pacing': 'Budget pacing', delivery: 'Delivery', 'objective-performance': 'Objective performance', visibility: 'Visibility', 'budget-allocation': 'Budget allocation' };
export const SEVERITY_LABEL: Record<HealthSeverity, string> = { NEEDS_ATTENTION: 'Needs attention', AT_RISK: 'At risk' };
export const LEVEL_LABEL: Record<HealthSubjectLevel, string> = { MEDIA_PLAN: 'Media plan', CAMPAIGN_ORDER: 'Campaign', BOOKING: 'Booking' };

// ── Configuration: per check, thresholds and severities ────────────────

export interface HealthConfig {
  enabled: boolean;
  checks: {
    'budget-pacing': { enabled: boolean; severelyUnderpacingBelow: number; underpacingBelow: number; overpacingAbove: number; severelyOverpacingAbove: number; severities: Record<'SEVERELY_UNDERPACING' | 'UNDERPACING' | 'OVERPACING' | 'SEVERELY_OVERPACING', HealthSeverity> };
    delivery: { enabled: boolean; noSpendDays: number; stoppedDays: number; capUtilisationAbove: number; severities: Record<'NOT_DELIVERING' | 'DELIVERY_STOPPED' | 'DAILY_CAP_LIMITING_DELIVERY', HealthSeverity> };
    'objective-performance': { enabled: boolean; belowTargetBy: number; severelyBelowTargetBy: number; severities: Record<'BELOW_KPI_TARGET' | 'SEVERELY_BELOW_KPI_TARGET', HealthSeverity> };
    visibility: { enabled: boolean; winRateBelow: number; shareOfVoiceBelow: number; severities: Record<'LOW_WIN_RATE' | 'LOW_SHARE_OF_VOICE', HealthSeverity> };
    'budget-allocation': { enabled: boolean; unallocatedShareAbove: number; severities: Record<'BUDGET_NOT_FULLY_ALLOCATED' | 'NO_LIVE_BOOKINGS', HealthSeverity> };
  };
}

/** The defaults — what `media-plan.health` binds to until an environment tunes it. */
export const DEFAULT_HEALTH_CONFIG: HealthConfig = {
  enabled: true,
  checks: {
    'budget-pacing': {
      enabled: true, severelyUnderpacingBelow: 0.80, underpacingBelow: 0.90, overpacingAbove: 1.10, severelyOverpacingAbove: 1.25,
      severities: { SEVERELY_UNDERPACING: 'AT_RISK', UNDERPACING: 'NEEDS_ATTENTION', OVERPACING: 'NEEDS_ATTENTION', SEVERELY_OVERPACING: 'AT_RISK' },
    },
    delivery: {
      enabled: true, noSpendDays: 3, stoppedDays: 2, capUtilisationAbove: 0.95,
      severities: { NOT_DELIVERING: 'AT_RISK', DELIVERY_STOPPED: 'AT_RISK', DAILY_CAP_LIMITING_DELIVERY: 'NEEDS_ATTENTION' },
    },
    'objective-performance': {
      enabled: true, belowTargetBy: 0.20, severelyBelowTargetBy: 0.40,
      severities: { BELOW_KPI_TARGET: 'NEEDS_ATTENTION', SEVERELY_BELOW_KPI_TARGET: 'AT_RISK' },
    },
    visibility: {
      enabled: true, winRateBelow: 0.50, shareOfVoiceBelow: 0.20,
      severities: { LOW_WIN_RATE: 'NEEDS_ATTENTION', LOW_SHARE_OF_VOICE: 'NEEDS_ATTENTION' },
    },
    'budget-allocation': {
      enabled: true, unallocatedShareAbove: 0.10,
      severities: { BUDGET_NOT_FULLY_ALLOCATED: 'NEEDS_ATTENTION', NO_LIVE_BOOKINGS: 'AT_RISK' },
    },
  },
};

// ── Evaluation ──────────────────────────────────────────────────────────

const DAY = 86400000;
const rank: Record<HealthSeverity, number> = { NEEDS_ATTENTION: 1, AT_RISK: 2 };

/** How far through its flight a subject is, 0..1, as of `now`. */
function elapsedFraction(startDate: string, endDate: string, now: number): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!(end > start)) return 1;
  return Math.max(0, Math.min(1, (now - start) / (end - start)));
}

/** The keywords a sponsored-products booking buys, read off its name. */
function keywordsOf(bookingName: string): string[] {
  const m = /keywords\s*[—–-]\s*(.+)$/i.exec(bookingName);
  return m ? m[1].split(/\s*&\s*/).map((k) => k.trim()).filter(Boolean) : [];
}

/** The rollup: the highest severity on the subject and below it, or absent. */
function summarise(indicators: HealthIndicator[], evaluatedAt: string): HealthSummary | undefined {
  if (indicators.length === 0) return undefined;
  const status = indicators.reduce<HealthSeverity>((top, i) => (rank[i.severity] > rank[top] ? i.severity : top), 'NEEDS_ATTENTION');
  return { status, indicators, evaluatedAt };
}

export interface PlanAssessment {
  plan?: HealthSummary;
  campaigns: Map<string, HealthSummary | undefined>;
  bookings: Map<string, HealthSummary | undefined>;
  evaluatedAt: string;
}

/**
 * Assess one media plan and everything under it. Detection is open at every
 * level: a concern is detected where it is observable — pacing on a booking,
 * an empty live campaign on the campaign order, unallocated budget on the
 * plan — and each level's summary carries its own indicators plus every
 * indicator found below it.
 */
export function assessMediaPlan(db: DbData, plan: MediaPlan, config: HealthConfig = DEFAULT_HEALTH_CONFIG, now: number = Date.now()): PlanAssessment {
  const evaluatedAt = new Date(now).toISOString();
  const campaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
  const byCampaign = new Map<string, HealthSummary | undefined>();
  const byBooking = new Map<string, HealthSummary | undefined>();
  const planIndicators: HealthIndicator[] = [];
  // A completed plan's health is history: nothing left to act on, so
  // nothing is reported. Off is off.
  if (!config.enabled || plan.status === 'completed') return { plan: undefined, campaigns: byCampaign, bookings: byBooking, evaluatedAt };

  const subjectFor = (level: HealthSubjectLevel, campaign?: Campaign, booking?: Booking): HealthIndicatorSubject => ({
    level, mediaPlanId: plan.id, mediaPlanName: plan.name,
    campaignOrderId: campaign?.id, campaignOrderName: campaign?.name,
    bookingId: booking?.id, bookingName: booking?.name,
  });
  const ind = (code: HealthIndicatorCode, severity: HealthSeverity, subject: HealthIndicatorSubject, observedValue?: number, thresholdValue?: number, unit?: HealthMetricUnit): HealthIndicator =>
    ({ code, severity, subject, observedValue, thresholdValue, unit, detectedAt: evaluatedAt });

  // ── Booking level ────────────────────────────────────────────────────
  const assessBooking = (campaign: Campaign, booking: Booking): HealthIndicator[] => {
    const found: HealthIndicator[] = [];
    const subject = subjectFor('BOOKING', campaign, booking);
    const live = booking.status === 'running';
    const elapsed = elapsedFraction(booking.startDate, booking.endDate, now);
    const daysIn = (now - new Date(booking.startDate).getTime()) / DAY;

    // Budget pacing: spend so far against the spend expected at this point.
    const pacing = config.checks['budget-pacing'];
    if (pacing.enabled && live && booking.budget > 0 && elapsed >= 0.05) {
      const expected = booking.budget * elapsed;
      const ratio = Math.round((booking.spend / expected) * 100) / 100;
      if (booking.spend > 0) {
        if (ratio < pacing.severelyUnderpacingBelow) found.push(ind('SEVERELY_UNDERPACING', pacing.severities.SEVERELY_UNDERPACING, subject, ratio, pacing.severelyUnderpacingBelow, 'RATIO'));
        else if (ratio < pacing.underpacingBelow) found.push(ind('UNDERPACING', pacing.severities.UNDERPACING, subject, ratio, pacing.underpacingBelow, 'RATIO'));
        else if (ratio > pacing.severelyOverpacingAbove) found.push(ind('SEVERELY_OVERPACING', pacing.severities.SEVERELY_OVERPACING, subject, ratio, pacing.severelyOverpacingAbove, 'RATIO'));
        else if (ratio > pacing.overpacingAbove) found.push(ind('OVERPACING', pacing.severities.OVERPACING, subject, ratio, pacing.overpacingAbove, 'RATIO'));
      }
    }

    // Delivery: spending at all, and what holds it back. (DELIVERY_STOPPED
    // needs a daily spend history the prototype does not keep yet.)
    const delivery = config.checks.delivery;
    if (delivery.enabled && live) {
      if (booking.spend === 0 && daysIn >= delivery.noSpendDays) {
        found.push(ind('NOT_DELIVERING', delivery.severities.NOT_DELIVERING, subject, Math.floor(daysIn), delivery.noSpendDays, 'DAYS'));
      }
      const weeks = campaign.engine === 'sponsored-products' ? keywordsOf(booking.name).map((k) => keywordWeek(k, booking.id)) : [];
      if (weeks.length) {
        const utilisation = Math.max(...weeks.map((w) => w.cappedDays / w.daysInWindow));
        const underpacing = found.some((f) => f.code === 'UNDERPACING' || f.code === 'SEVERELY_UNDERPACING');
        if (underpacing && utilisation >= delivery.capUtilisationAbove) {
          found.push(ind('DAILY_CAP_LIMITING_DELIVERY', delivery.severities.DAILY_CAP_LIMITING_DELIVERY, subject, Math.round(utilisation * 100) / 100, delivery.capUtilisationAbove, 'RATIO'));
        }
      }
      // Visibility: the share of auctions the booking's keywords win.
      const visibility = config.checks.visibility;
      if (visibility.enabled && weeks.length) {
        const winRate = Math.min(...weeks.map((w) => w.winRate));
        if (winRate < visibility.winRateBelow) found.push(ind('LOW_WIN_RATE', visibility.severities.LOW_WIN_RATE, subject, winRate, visibility.winRateBelow, 'RATIO'));
      }
    }
    // Objective performance and share of voice wait for KPI targets and
    // inventory data the prototype does not carry yet — the codes are in the
    // catalogue so adding the detector changes nothing else.
    return found;
  };

  // ── Campaign order level ─────────────────────────────────────────────
  const allocation = config.checks['budget-allocation'];
  for (const campaign of campaigns) {
    const bookings = db.bookings.filter((b) => b.campaignId === campaign.id);
    const own: HealthIndicator[] = [];
    const subject = subjectFor('CAMPAIGN_ORDER', campaign);
    const inPlay = campaign.status !== 'draft' && campaign.status !== 'completed';
    if (allocation.enabled && inPlay) {
      if (campaign.status === 'running' && !bookings.some((b) => b.status === 'running')) {
        own.push(ind('NO_LIVE_BOOKINGS', allocation.severities.NO_LIVE_BOOKINGS, subject, bookings.filter((b) => b.status === 'running').length, 1, 'COUNT'));
      } else if (campaign.budget > 0 && bookings.length > 0) {
        const share = Math.round(((campaign.budget - bookings.reduce((s, b) => s + b.budget, 0)) / campaign.budget) * 100) / 100;
        if (share > allocation.unallocatedShareAbove) own.push(ind('BUDGET_NOT_FULLY_ALLOCATED', allocation.severities.BUDGET_NOT_FULLY_ALLOCATED, subject, share, allocation.unallocatedShareAbove, 'RATIO'));
      }
    }
    const below: HealthIndicator[] = [];
    for (const booking of bookings) {
      const found = assessBooking(campaign, booking);
      byBooking.set(booking.id, summarise(found, evaluatedAt));
      below.push(...found);
    }
    const all = [...own, ...below];
    byCampaign.set(campaign.id, summarise(all, evaluatedAt));
    planIndicators.push(...all);
  }

  // ── Media plan level ─────────────────────────────────────────────────
  const planInPlay = plan.status !== 'draft';
  if (allocation.enabled && planInPlay && plan.budget > 0 && campaigns.length > 0) {
    const share = Math.round(((plan.budget - campaigns.reduce((s, c) => s + c.budget, 0)) / plan.budget) * 100) / 100;
    if (share > allocation.unallocatedShareAbove) {
      planIndicators.unshift(ind('BUDGET_NOT_FULLY_ALLOCATED', allocation.severities.BUDGET_NOT_FULLY_ALLOCATED, subjectFor('MEDIA_PLAN'), share, allocation.unallocatedShareAbove, 'RATIO'));
    }
  }

  return { plan: summarise(planIndicators, evaluatedAt), campaigns: byCampaign, bookings: byBooking, evaluatedAt };
}

/** A plan's health, or undefined when nothing has been found on it or below it. */
export function planHealth(db: DbData, planId: string, config?: HealthConfig): HealthSummary | undefined {
  const plan = db.mediaPlans.find((p) => p.id === planId);
  return plan ? assessMediaPlan(db, plan, config).plan : undefined;
}

/** A campaign order's health, or undefined. */
export function campaignHealth(db: DbData, campaignId: string, config?: HealthConfig): HealthSummary | undefined {
  const campaign = db.campaigns.find((c) => c.id === campaignId);
  const plan = campaign && db.mediaPlans.find((p) => p.id === campaign.mediaPlanId);
  return plan ? assessMediaPlan(db, plan, config).campaigns.get(campaignId) : undefined;
}

/** A booking's health, or undefined. */
export function bookingHealth(db: DbData, bookingId: string, config?: HealthConfig): HealthSummary | undefined {
  const booking = db.bookings.find((b) => b.id === bookingId);
  const campaign = booking && db.campaigns.find((c) => c.id === booking.campaignId);
  const plan = campaign && db.mediaPlans.find((p) => p.id === campaign.mediaPlanId);
  return plan ? assessMediaPlan(db, plan, config).bookings.get(bookingId) : undefined;
}

// ── Explaining a finding ────────────────────────────────────────────────

const fmtValue = (v: number, unit?: HealthMetricUnit): string => {
  switch (unit) {
    case 'RATIO': return v.toFixed(2);
    case 'PERCENTAGE': return `${Math.round(v * 100)}%`;
    case 'CURRENCY': return `€${Math.round(v).toLocaleString()}`;
    case 'DAYS': return `${v} day${v === 1 ? '' : 's'}`;
    case 'COUNT': return String(v);
    default: return String(v);
  }
};

const MEASURE: Partial<Record<HealthIndicatorCode, string>> = {
  SEVERELY_UNDERPACING: 'pacing', UNDERPACING: 'pacing', OVERPACING: 'pacing', SEVERELY_OVERPACING: 'pacing',
  NOT_DELIVERING: 'days live without spend', DAILY_CAP_LIMITING_DELIVERY: 'cap utilisation',
  LOW_WIN_RATE: 'win rate', LOW_SHARE_OF_VOICE: 'share of voice',
  BUDGET_NOT_FULLY_ALLOCATED: 'unallocated share', NO_LIVE_BOOKINGS: 'live bookings',
};

/** "Flagged because pacing is 0.78, below the 0.80 threshold." */
export function explainIndicator(i: HealthIndicator): string {
  if (i.observedValue === undefined || i.thresholdValue === undefined) return INDICATOR_CATALOGUE[i.code].meaning;
  const measure = MEASURE[i.code] ?? 'value';
  const direction = i.observedValue < i.thresholdValue ? 'below' : 'above';
  return `Flagged because ${measure} is ${fmtValue(i.observedValue, i.unit)}, ${direction} the ${fmtValue(i.thresholdValue, i.unit)} threshold.`;
}

/** "Booking · Aisle Screens — Summer" — where an indicator was detected. */
export function subjectLabel(s: HealthIndicatorSubject): string {
  const name = s.level === 'BOOKING' ? s.bookingName : s.level === 'CAMPAIGN_ORDER' ? s.campaignOrderName : s.mediaPlanName;
  return `${LEVEL_LABEL[s.level]} · ${name ?? ''}`;
}
