/**
 * The prototype's clock — the one "today" every rule and template reads.
 *
 * The prototype does not move in time: the seed was written as of one day
 * and no bookings arrive after it. So everything that asks "what is now?" —
 * prices that reward booking early, holds that expire, delivery pacing,
 * what is billable, the calendars' opening weeks, the date pickers'
 * "This week" — asks here, never the machine's clock. Otherwise a fill
 * rate is read in July while its price is read in October.
 *
 * Audit stamps (createdAt, a chat message's time) stay real time: they
 * record when someone did something, not where the business stands.
 */

/** The prototype's today, as an ISO date. The seed is written as of it. */
export const PROTOTYPE_TODAY = '2026-07-30';

/** Today as an instant — midnight UTC, the seed's own `now`. Use it for
 *  comparisons against stored ISO dates and timestamps. */
export function prototypeNow(): Date {
  return new Date(`${PROTOTYPE_TODAY}T00:00:00.000Z`);
}

/** Today as a local calendar day, for date pickers and date-fns maths. */
export function prototypeToday(): Date {
  const [y, m, d] = PROTOTYPE_TODAY.split('-').map(Number);
  return new Date(y, m - 1, d);
}
