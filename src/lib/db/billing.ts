import type { Booking, DbData, Invoice, InvoiceStatus } from './types';
import { bookingPrice, deliveryProgress, isGuaranteed } from './guaranteed';

/**
 * Billing, as Edge sees it.
 *
 * The billing service owns invoices. Edge owns what is BILLABLE: a booking
 * becomes billable when it completes, for its agreed price when guaranteed
 * and for its spend when bought at auction. So every booking has a billing
 * state Edge can derive on its own — upcoming while it runs, ready once it
 * completes — until the billing service has put it on an invoice, from
 * which point the invoice's own status is what counts.
 *
 * Under-delivery (a decision to confirm with the retailer): a guaranteed
 * booking that ends short of its goal is invoiced for what it delivered.
 * The agreed price stays on the line; the shortfall is a credit beside it,
 * so the invoice shows both what was agreed and why less is charged.
 */

export type BillingState = 'upcoming' | 'ready' | InvoiceStatus;

export const BILLING_STATE_LABEL: Record<BillingState, string> = {
  upcoming: 'Upcoming',
  ready: 'Ready to invoice',
  sent: 'Invoiced',
  paid: 'Paid',
  overdue: 'Overdue',
  credited: 'Credited',
};

export const BILLING_STATE_VARIANT: Record<BillingState, 'outline' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  upcoming: 'outline',
  ready: 'info',
  sent: 'secondary',
  paid: 'success',
  overdue: 'destructive',
  credited: 'warning',
};

export interface BillableLine {
  booking: Booking;
  bookingId: string;
  campaignId: string;
  mediaPlanId: string;
  advertiserId: string;
  /** How the amount is set: the agreed price, or what was spent. */
  basis: 'agreed' | 'spend';
  /** Agreed price or spend, excluding VAT. */
  amount: number;
  /** A credit for under-delivery, negative, once the booking has completed. */
  adjustment?: number;
  adjustmentReason?: string;
  /** What the line comes to: amount plus adjustment. */
  total: number;
  state: BillingState;
  invoice?: Invoice;
}

/** A guaranteed booking's under-delivery credit, once it has ended short. */
function underDeliveryCredit(booking: Booking, agreed: number): { adjustment: number; reason: string } | undefined {
  const progress = deliveryProgress(booking);
  if (!progress || booking.status !== 'completed' || progress.share >= 1) return undefined;
  const short = 1 - progress.share;
  return {
    adjustment: -Math.round(agreed * short * 100) / 100,
    reason: `Delivered ${(progress.share * 100).toFixed(1)}% of the goal`,
  };
}

/** The line a booking puts on an invoice — or would, once it completes. */
export function billableLine(db: DbData, booking: Booking, now = new Date()): BillableLine | undefined {
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  const plan = campaign && db.mediaPlans.find((p) => p.id === campaign.mediaPlanId);
  if (!campaign || !plan) return undefined;
  // Nothing has been bought until a booking is out of draft.
  if (booking.status === 'draft') return undefined;

  const invoice = db.invoices.find((inv) => inv.lines.some((l) => l.bookingId === booking.id));
  const invoiced = invoice?.lines.find((l) => l.bookingId === booking.id);

  let basis: BillableLine['basis'];
  let amount: number;
  let credit: ReturnType<typeof underDeliveryCredit>;
  if (isGuaranteed(db, booking)) {
    const price = bookingPrice(db, booking, now);
    // Only an agreed price is billable; a booking still in review has none.
    if (price.state !== 'agreed' || price.amount === undefined) return undefined;
    basis = 'agreed';
    amount = price.amount;
    credit = underDeliveryCredit(booking, amount);
  } else {
    if (booking.spend <= 0 && booking.status !== 'completed') return undefined;
    basis = 'spend';
    amount = booking.spend;
  }
  const adjustment = invoiced ? invoiced.adjustment : credit?.adjustment;
  const adjustmentReason = invoiced ? invoiced.adjustmentReason : credit?.reason;
  const lineAmount = invoiced ? invoiced.amount : amount;
  const state: BillingState = invoice ? effectiveInvoiceStatus(invoice, now) : booking.status === 'completed' ? 'ready' : 'upcoming';
  return {
    booking, bookingId: booking.id, campaignId: campaign.id, mediaPlanId: plan.id, advertiserId: plan.advertiserId,
    basis, amount: lineAmount, adjustment, adjustmentReason,
    total: Math.round((lineAmount + (adjustment ?? 0)) * 100) / 100,
    state, invoice,
  };
}

/** Every billable line, optionally narrowed to one organisation or plan. */
export function billableLines(db: DbData, scope: { advertiserId?: string; mediaPlanId?: string } = {}, now = new Date()): BillableLine[] {
  return db.bookings
    .map((b) => billableLine(db, b, now))
    .filter((l): l is BillableLine => !!l)
    .filter((l) => (!scope.advertiserId || l.advertiserId === scope.advertiserId) && (!scope.mediaPlanId || l.mediaPlanId === scope.mediaPlanId));
}

/** An invoice's totals: lines, adjustments, VAT. */
export function invoiceTotals(invoice: Invoice) {
  const subtotal = invoice.lines.reduce((n, l) => n + l.amount + (l.adjustment ?? 0), 0);
  const vat = Math.round(subtotal * invoice.vatRate * 100) / 100;
  return { subtotal: Math.round(subtotal * 100) / 100, vat, total: Math.round((subtotal + vat) * 100) / 100 };
}

/** An invoice past its due date and not paid reads as overdue, whatever the
 *  last sync said — the same way an expired hold reads as expired. */
export function effectiveInvoiceStatus(invoice: Invoice, now = new Date()): InvoiceStatus {
  if (invoice.status === 'sent' && new Date(invoice.dueAt) < now) return 'overdue';
  return invoice.status;
}

/** The figures on top of the billing page, excluding VAT. */
export function billingSummary(lines: BillableLine[]) {
  const sum = (state: BillingState) => Math.round(lines.filter((l) => l.state === state).reduce((n, l) => n + l.total, 0) * 100) / 100;
  return { upcoming: sum('upcoming'), ready: sum('ready'), invoiced: sum('sent'), paid: sum('paid'), overdue: sum('overdue') };
}
